/* ===================== Stage 4 · Search and sort ===================== */
const SS_SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';
const SS_sup=n=>String(n).split('').map(d=>d==='-'?'⁻':SS_SUP[+d]).join('');
function SS_num(v){if(v<1e6)return v<10&&v%1?v.toFixed(1):Math.round(v).toLocaleString('en-GB');const e=Math.floor(Math.log10(v));return (v/10**e).toFixed(1)+' × 10'+SS_sup(e)}
function SS_time(v){const s=v/1e9;if(s<1e-6)return 'under 1 µs';if(s<1e-3)return fmt(s*1e6)+' µs';if(s<1)return fmt(s*1e3)+' ms';if(s<120)return fmt(s)+' s';if(s<7200)return fmt(s/60)+' minutes';if(s<86400*2)return fmt(s/3600)+' hours';if(s<86400*365*2)return Math.round(s/86400)+' days';return SS_num(s/(86400*365.25))+' years'}

/* ---------- Linear search ---------- */
SCENE({id:'linear-search',name:'Linear search',tag:'Check every item in turn',
 definition:'Look through a list one item at a time, from the start, until you find what you want or run out of items.',
 example:'Finding a name in an unsorted pile of cards: you may get lucky on the first card, but in the worst case you check all n of them.',
 desc:'A row of numbered cards; a pointer moves from left to right, greying out each card checked, until the target card turns green.',
 dur:9,hint:'Press a card to search for its value, or choose a target with the slider (10 is missing). Then Step or Run.',
 init:()=>({cards:[7,3,9,1,8,4,6,2,5],target:6}),
 ui:[{range:'t',label:'Target',min:0,max:10,get:s=>s.target,act:'target'},{b:'Shuffle cards',act:'shuffle'},{b:'Search for a missing value',act:'missing'}],
 on:{pick(s,i){s.target=s.cards[Number(i)]},target(s,v){s.target=v},shuffle(s){s.cards=shuffled(s.cards,nextSeed())},missing(s){s.target=10}},
 trace(s){const n=s.cards.length,fr=[{i:-1,c:0,say:`Looking for ${s.target}. The cards are in no particular order, so start at the left.`}];
  for(let i=0;i<n;i++){const hit=s.cards[i]===s.target;fr.push({i,c:i+1,hit,say:hit?`Card ${i+1} is ${s.target}: found after ${i+1} comparison${i?'s':''}.`:`Card ${i+1} is ${s.cards[i]}, not ${s.target}. Move right.`});if(hit)return fr}
  fr.push({i:n,c:n,miss:true,say:`Checked all ${n} cards: ${s.target} is not here. A missing item always costs n comparisons.`});return fr},
 draw(s,f,X){
  const n=s.cards.length,w=56,step=62,x0=300-(n*step-6)/2;let out=heading('Check each card in turn');
  s.cards.forEach((v,i)=>{const x=x0+i*step,cur=i===f.i,found=cur&&f.hit,done=i<f.i||(f.miss);
   const fill=found?C.greenp:cur?C.amberp:done?'#eef2f4':'#fff',st=found?C.green:cur?C.amber:done?C.grid:C.line;
   out+=hit(X,'pick',i,`Card ${i+1}: ${v}. Press to search for ${v}.`,R(x,90,w,80,fill,st,9)+TB(x+w/2,140,v,28,done&&!cur?C.muted:C.ink));
   out+=T(x+w/2,80,i+1,13,C.muted);
  });
  if(f.i>=0&&f.i<n){const x=x0+f.i*step+w/2;out+=arrow(x,214,x,178,f.hit?C.green:C.amber,3)+TB(x,234,'i = '+(f.i+1),15,f.hit?C.green:C.amber)}
  out+=counter(95,258,'Target',s.target,C.ink)+counter(240,258,'Comparisons',f.c,C.blue)+counter(385,258,'Cards (n)',n,C.muted);
  out+=T(300,350,'Worst case: n comparisons. Twice as many cards, twice the work: O(n).',15,C.muted);
  return {svg:out,phase:f.say};
 }});

/* ---------- Binary search ---------- */
const SS_BS=[2,5,8,12,16,23,38,45,56,67,72,81,88,91,95,99];
SCENE({id:'binary-search',name:'Binary search',tag:'Halve a sorted list',
 definition:'Find an item in a sorted list by checking the middle and throwing away the half that cannot contain it, again and again.',
 example:'Looking up a word in a dictionary: open near the middle, then keep only the half where the word must be. 16 items need at most 5 checks; a million need about 20.',
 desc:'Sixteen sorted numbers in a row; brackets mark the remaining interval, which halves at each comparison with the middle number.',
 dur:10,hint:'Press a number to search for it, or slide the target to a value that is not in the list. Then Step or Run.',
 init:()=>({arr:SS_BS.slice(),target:72}),
 ui:[{range:'t',label:'Target',min:0,max:100,get:s=>s.target,act:'target'},{b:'Absent target',act:'absent'},{b:'New numbers',act:'renew'}],
 on:{pick(s,i){s.target=s.arr[Number(i)]},target(s,v){s.target=v},absent(s){let v=50;while(s.arr.includes(v))v++;s.target=v},
  renew(s){const r=rng(nextSeed()),set=new Set();while(set.size<16)set.add(1+Math.floor(r()*99));s.arr=[...set].sort((a,b)=>a-b);s.target=s.arr[Math.floor(r()*16)]}},
 trace(s){const a=s.arr,t=s.target;let lo=0,hi=a.length-1,c=0;const sizes=[a.length];const fr=[{lo,hi,mid:null,c,sizes:sizes.slice(),say:`The list is sorted. Search for ${t} in all ${a.length} numbers.`}];
  while(lo<=hi){const mid=(lo+hi)>>1;c++;
   if(a[mid]===t){fr.push({lo,hi,mid,c,found:true,sizes:sizes.slice(),say:`The middle number is ${a[mid]}: found ${t} after ${c} comparison${c>1?'s':''}.`});return fr}
   const left=t<a[mid];fr.push({lo,hi,mid,c,sizes:sizes.slice(),say:left?`${t} < ${a[mid]}, so ${t} can only be to the left. Discard ${a[mid]} and everything to its right.`:`${t} > ${a[mid]}, so ${t} can only be to the right. Discard ${a[mid]} and everything to its left.`});
   if(left)hi=mid-1;else lo=mid+1;sizes.push(Math.max(0,hi-lo+1));
  }
  fr.push({lo,hi,mid:null,c,miss:true,sizes:sizes.slice(),say:`The interval is empty after ${c} comparisons: ${t} is not in the list.`});return fr},
 draw(s,f,X){
  const a=s.arr,w=33,step=35,x0=20;let out=heading('Check the middle; keep the half that can still hold the target');
  a.forEach((v,i)=>{const x=x0+i*step,inside=i>=f.lo&&i<=f.hi&&!f.miss,mid=i===f.mid,found=mid&&f.found;
   const fill=found?C.greenp:mid?C.amberp:inside?'#fff':'#eef2f4',st=found?C.green:mid?C.amber:inside?C.blue:C.grid;
   out+=hit(X,'pick',i,`${v}. Press to search for ${v}.`,R(x,96,w,44,fill,st,6)+TB(x+w/2,124,v,15,inside||mid?C.ink:'#9aaab3'));
   out+=T(x+w/2,86,i,13,C.muted);
  });
  if(!f.miss&&f.lo<=f.hi){const xl=x0+f.lo*step,xr=x0+f.hi*step+w;out+=P(`M${xl} 150V158H${xr}V150`,C.blue,2.5)+(f.lo===f.hi?T((xl+xr)/2,176,'low = high',13,C.blue):T(xl,176,'low',13,C.blue,'start')+T(xr,176,'high',13,C.blue,'end'))}
  if(f.mid!==null){const x=x0+f.mid*step+w/2;out+=TB(x,66,'mid ↓',13,f.found?C.green:C.amber)}
  out+=counter(40,206,'Target',s.target,C.ink,150)+counter(225,206,'Comparisons',f.c,C.blue,150)+counter(410,206,'Worst case ⌈log₂ 17⌉',5,C.muted,150);
  out+=T(300,288,'Interval size: '+f.sizes.join(' → '),17,C.ink);
  const li=a.indexOf(s.target);out+=T(300,322,`Linear search would need ${li>=0?li+1:a.length} comparison${li===0?'':'s'} for the same target.`,15,C.muted);
  out+=T(300,352,'Each step halves the interval: O(log n).',15,C.muted);
  return {svg:out,phase:f.say};
 }});

/* ---------- Graph search: BFS and DFS share one graph ---------- */
const SS_GP={A:[70,95],B:[190,70],C:[320,95],D:[60,225],E:[185,195],F:[315,220],G:[115,322],H:[265,322]};
const SS_GE=[['A','B'],['A','D'],['B','C'],['B','E'],['C','F'],['D','E'],['D','G'],['E','F'],['E','H'],['F','H'],['G','H']];
const SS_ADJ=(()=>{const a={};for(const k in SS_GP)a[k]=[];for(const [x,y] of SS_GE){a[x].push(y);a[y].push(x)}for(const k in a)a[k].sort();return a})();
function SS_bfs(st){const seen={[st]:0},parent={},order=[],queue=[st];const fr=[{cur:null,queue:queue.slice(),seen:{...seen},parent:{},order:[],say:`Start at ${st}: put it in the queue at distance 0.`}];
 while(queue.length){const u=queue.shift();order.push(u);const nw=[];for(const v of SS_ADJ[u])if(!(v in seen)){seen[v]=seen[u]+1;parent[v]=u;queue.push(v);nw.push(v)}
  fr.push({cur:u,queue:queue.slice(),seen:{...seen},parent:{...parent},order:order.slice(),say:`Take ${u} from the front of the queue (distance ${seen[u]}). ${nw.length?'Add its unseen neighbours '+nw.join(', ')+' to the back.':'All its neighbours are already seen.'}`})}
 fr.push({cur:null,done:true,queue:[],seen:{...seen},parent:{...parent},order:order.slice(),say:'The queue is empty. Nodes were visited in rings: all at distance 1, then all at distance 2, and so on.'});return fr}
function SS_dfs(st){const vis={},parent={},order=[],path=[],fr=[];
 (function go(u){vis[u]=true;order.push(u);path.push(u);
  fr.push({cur:u,stack:path.slice(),parent:{...parent},order:order.slice(),say:`Visit ${u} and push it on the stack. Go deeper through its first unvisited neighbour.`});
  for(const v of SS_ADJ[u])if(!vis[v]){parent[v]=u;go(v)}
  fr.push({cur:u,stack:path.slice(),parent:{...parent},order:order.slice(),back:true,say:path.length>1?`${u} has no unvisited neighbours. Pop it and backtrack to ${path[path.length-2]}.`:`Back at the start ${u} with nothing left to explore.`});
  path.pop();
 })(st);
 fr.push({cur:null,done:true,stack:[],parent:{...parent},order:order.slice(),say:'The stack is empty. DFS ran down one long path first, then backtracked to fill in the rest.'});return fr}
function SS_badge(x,y,txt,col=C.muted){const w=txt.length*7.6+10;return R(x-w/2,y-13,w,18,'#fff','none',5,'opacity=".92"')+T(x,y,txt,13,col,'middle','font-weight="600"')}
const SS_order=(fr)=>fr[fr.length-1].order.join(' ');
function SS_graphDraw(s,f,X,kind){
 const inFront=kind==='bfs'?new Set(f.queue):new Set(f.stack),ord=f.order;
 let out=T(200,30,kind==='bfs'?'Breadth-first: explore in rings':'Depth-first: go deep, then backtrack',18,C.ink,'middle','font-weight="650"');
 out+=graphSVG(X,SS_GP,SS_GE,{r:21,nodeAct:'start',
  edge:e=>{const tree=f.parent[e[1]]===e[0]||f.parent[e[0]]===e[1];return tree?{col:C.blue,w:4.5}:{col:C.line,w:2.5}},
  node:id=>{const cur=id===f.cur,vis=ord.includes(id),fr=inFront.has(id)&&!cur;
   return {fill:cur?C.coral:fr&&kind==='bfs'?C.amberp:vis?C.blue:'#fff',stroke:cur?C.coral:fr?C.amber:C.blue,ink:cur||(vis&&!(fr&&kind==='bfs'))?'#fff':C.ink,
    aria:`Node ${id}. Press to start the search here.`}}});
 for(const id in SS_GP){const b=kind==='bfs'?(id in f.seen?'d = '+f.seen[id]:''):(ord.includes(id)?'#'+(ord.indexOf(id)+1):'');if(b){const [x,y]=SS_GP[id];out+=SS_badge(x+(id==='E'||id==='F'?30:id==='B'?-34:0),y+(id==='E'||id==='F'||id==='B'?-22:38),b)}}
 if(kind==='bfs'){
  out+=TB(500,62,'Queue (front → back)',14,C.ink);
  if(!f.queue.length)out+=T(500,92,'empty',14,C.muted);
  f.queue.forEach((q,i)=>out+=box(420+(i%5)*33,74+Math.floor(i/5)*34,30,30,q,C.amberp,C.ink,15,C.amber));
  out+=TB(500,170,'Distance layers',14,C.ink);
  const layers={};for(const k in f.seen)(layers[f.seen[k]]=layers[f.seen[k]]||[]).push(k);
  Object.keys(layers).sort().forEach((d,i)=>out+=TM(430,196+i*22,`${d}: ${layers[d].sort().join(' ')}`,15,C.ink,'start'));
 }else{
  out+=TB(500,52,'Stack (top ↑)',14,C.ink);
  if(!f.stack.length)out+=T(500,270,'empty',14,C.muted);
  f.stack.forEach((q,i)=>{const top=i===f.stack.length-1;out+=box(470,258-i*25,60,22,q,top?C.coralp:C.pale,C.ink,14,top?C.coral:'none')});
 }
 out+=TB(500,306,'Visit order',14,C.ink)+TM(500,330,ord.join(' ')||'—',16,C.blue);
 return out;
}
SCENE({id:'bfs',name:'Breadth-first search',tag:'Explore in rings',shared:'graph-search',
 definition:'Explore a graph from a start node by visiting all its neighbours first, then their neighbours, keeping a queue of nodes to visit next.',
 example:'Ripples on a pond, or finding everyone within two handshakes of you. BFS finds the route with the fewest edges.',
 desc:'A graph of eight lettered nodes; the visited nodes fill in ring by ring from the start, with a queue of waiting nodes and the distance of each node.',
 dur:12,hint:'Press any node to start from it, then Step or Run. Compare the visit order with depth-first search on the next page.',
 init:()=>({start:'A'}),on:{start(s,id){s.start=id}},
 trace:s=>SS_bfs(s.start),
 draw(s,f,X){return {svg:SS_graphDraw(s,f,X,'bfs'),phase:f.say+(f.done?` Depth-first from ${s.start} would visit ${SS_order(SS_dfs(s.start))}.`:'')}}});
SCENE({id:'dfs',name:'Depth-first search',tag:'Go deep, then backtrack',shared:'graph-search',
 definition:'Explore a graph by following one path as far as it goes, then backing up to the most recent node with unexplored neighbours, using a stack.',
 example:'Solving a maze by keeping one hand on the wall: go as far as you can, then retrace your steps to the last junction.',
 desc:'The same eight-node graph explored depth first; a stack shows the current path, which grows and then pops as the search backtracks.',
 dur:12,hint:'Press any node to start from it, then Step or Run. The caption names the breadth-first order for the same start.',
 init:()=>({start:'A'}),on:{start(s,id){s.start=id}},
 trace:s=>SS_dfs(s.start),
 draw(s,f,X){return {svg:SS_graphDraw(s,f,X,'dfs'),phase:f.say+(f.done?` Breadth-first from ${s.start} would visit ${SS_order(SS_bfs(s.start))}.`:'')}}});

/* ---------- Dijkstra ---------- */
const SS_DP={A:[50,190],B:[165,85],C:[165,295],D:[295,85],E:[295,295],F:[390,190]};
const SS_DE=[['A','B'],['A','C'],['C','B'],['B','D'],['C','D'],['C','E'],['D','E'],['D','F'],['E','F']];
const SS_DW=[4,2,1,5,8,10,2,6,3];
function SS_dij(s){const W={};SS_DE.forEach((e,i)=>W[e[0]+'-'+e[1]]=s.w[i]);const nb={};for(const k in SS_DP)nb[k]=[];SS_DE.forEach(([a,b],i)=>{nb[a].push([b,s.w[i]]);nb[b].push([a,s.w[i]])});for(const k in nb)nb[k].sort((x,y)=>x[0]<y[0]?-1:1);
 const dist={},prev={},settled=[];for(const k in SS_DP)dist[k]=Infinity;dist[s.start]=0;
 const snap=(o)=>({dist:{...dist},prev:{...prev},settled:settled.slice(),...o});
 const fr=[snap({say:`Start at ${s.start} with distance 0. Every other node is “infinitely far” until a route is found.`})];
 for(;;){let u=null;for(const k of Object.keys(SS_DP).sort())if(!settled.includes(k)&&dist[k]<Infinity&&(u===null||dist[k]<dist[u]))u=k;if(u===null)break;
  settled.push(u);fr.push(snap({cur:u,say:`${u} has the smallest distance not yet settled (${dist[u]}), so no shorter route to it can exist. Settle it.`}));
  for(const [v,w] of nb[u]){if(settled.includes(v))continue;const nd=dist[u]+w,old=dist[v],better=nd<old;if(better){dist[v]=nd;prev[v]=u}
   fr.push(snap({cur:u,edge:[u,v],better,say:`${u} → ${v}: ${dist[u]} + ${w} = ${nd}${better?`, better than ${old===Infinity?'∞':old}. Update ${v}.`:`, not better than ${old}. Keep ${old}.`}`}))}
 }
 fr.push(snap({done:true,say:'Every reachable node is settled. The blue edges form the tree of shortest routes from the start.'}));return fr}
SCENE({id:'dijkstra',name:'Shortest path (Dijkstra)',tag:'Cheapest route first',
 definition:'Dijkstra’s algorithm finds the shortest routes from a start node in a graph whose edges have non-negative lengths, by always settling the closest unsettled node next.',
 example:'Sat-navs and network routers use this idea: the direct road from A to B (4) is longer than going A → C → B (2 + 1 = 3).',
 desc:'A weighted graph of six nodes with a distance table; nodes are settled one at a time and the shortest-route edges turn blue.',
 dur:16,hint:'Press a node to start from it, or press a number on an edge to change its length (1–9). Then Step or Run.',
 init:()=>({start:'A',w:SS_DW.slice()}),
 on:{start(s,id){s.start=id},w(s,key){const i=SS_DE.findIndex(e=>e[0]+'-'+e[1]===key);if(i>=0)s.w[i]=s.w[i]%9+1}},
 trace:SS_dij,
 draw(s,f,X){
  let out=T(210,30,'Settle the closest node; relax its edges',18,C.ink,'middle','font-weight="650"');
  const edges=SS_DE.map((e,i)=>[e[0],e[1],s.w[i]]);
  out+=graphSVG(X,SS_DP,edges,{r:22,nodeAct:'start',edgeAct:'w',
   edge:e=>{const cur=f.edge&&((f.edge[0]===e[0]&&f.edge[1]===e[1])||(f.edge[0]===e[1]&&f.edge[1]===e[0]));const tree=f.prev[e[1]]===e[0]||f.prev[e[0]]===e[1];return cur?{col:f.better?C.coral:C.amber,w:5}:tree?{col:C.blue,w:4.5}:{col:C.line,w:2.5}},
   node:id=>{const st=f.settled.includes(id),cur=id===f.cur;return {fill:cur?C.coral:st?C.blue:'#fff',stroke:cur?C.coral:C.blue,ink:cur||st?'#fff':C.ink,aria:`Node ${id}. Press to start here.`}}});
  for(const id in SS_DP){const [x,y]=SS_DP[id],st=f.settled.includes(id);out+=SS_badge(x,id==='B'||id==='D'?y-31:y+40,f.dist[id]===Infinity?'∞':String(f.dist[id]),st?C.blue:C.muted)}
  out+=TB(440,70,'Node',13,C.muted)+TB(495,70,'Distance',13,C.muted)+TB(555,70,'Via',13,C.muted);
  Object.keys(SS_DP).forEach((k,i)=>{const y=84+i*36,st=f.settled.includes(k),cur=k===f.cur;out+=R(420,y,165,30,cur?C.coralp:st?C.pale:'#fff',cur?C.coral:C.grid,6)+TB(440,y+21,k,15)+TM(495,y+21,f.dist[k]===Infinity?'∞':f.dist[k],15,st?C.blue:C.ink)+TM(555,y+21,f.prev[k]||'—',15,C.muted)});
  out+=T(502,320,'Blue rows are settled:',13,C.muted)+T(502,338,'their distance is final.',13,C.muted);
  return {svg:out,phase:f.say};
 }});

/* ---------- Sorting: four algorithms share one input ---------- */
const SS_SORT0=[5,9,2,7,1,8,3,10,6,4];
function SS_bubble(a0){const a=a0.slice(),n=a.length,fr=[];let c=0,sw=0,done=[];
 fr.push({a:a.slice(),c,sw,done:[],say:'Compare neighbours from the left; swap any pair that is out of order.'});
 for(let pass=0;pass<n-1;pass++){let any=false;for(let j=0;j<n-1-pass;j++){c++;const x=a[j]>a[j+1];if(x){[a[j],a[j+1]]=[a[j+1],a[j]];sw++;any=true}
   fr.push({a:a.slice(),cmp:[j,j+1],swapped:x,c,sw,done:done.slice(),say:x?`${a[j+1]} > ${a[j]}: swap them.`:`${a[j]} ≤ ${a[j+1]}: already in order.`})}
  done.push(n-1-pass);
  if(!any){fr.push({a:a.slice(),c,sw,done:range(n),say:`Pass ${pass+1} made no swaps, so the list is sorted. Stop early.`});return fr}
  fr.push({a:a.slice(),c,sw,done:done.slice(),say:`End of pass ${pass+1}: the largest remaining value has bubbled to position ${n-pass}.`});
 }
 fr.push({a:a.slice(),c,sw,done:range(n),say:`Sorted with ${c} comparisons and ${sw} swaps.`});return fr}
function SS_insertion(a0){const a=a0.slice(),n=a.length,fr=[];let c=0,sw=0;
 fr.push({a:a.slice(),c,sw,prefix:1,say:'The first card on its own is a sorted hand. Take the next card and slide it left into place.'});
 for(let i=1;i<n;i++){let j=i;while(j>0){c++;if(a[j-1]>a[j]){[a[j-1],a[j]]=[a[j],a[j-1]];sw++;fr.push({a:a.slice(),cmp:[j-1,j],swapped:true,c,sw,prefix:i+1,say:`${a[j]} > ${a[j-1]}: slide ${a[j-1]} one place left.`});j--}else{fr.push({a:a.slice(),cmp:[j-1,j],c,sw,prefix:i+1,say:`${a[j-1]} ≤ ${a[j]}: ${a[j]} is in place. The first ${i+1} are sorted.`});break}}}
 fr.push({a:a.slice(),c,sw,done:range(n),say:`Sorted with ${c} comparisons. Nearly sorted input needs very few.`});return fr}
function SS_merge(a0){const a=a0.slice(),n=a.length,fr=[];let c=0,sw=0;
 fr.push({a:a.slice(),c,sw,say:'Split the list in halves, again and again, until every piece has one item. Then merge pieces in order.'});
 (function ms(lo,hi,d){if(hi-lo<2)return;const mid=(lo+hi)>>1;ms(lo,mid,d+1);ms(mid,hi,d+1);
  const Lf=a.slice(lo,mid),Rt=a.slice(mid,hi);let i=0,j=0,k=lo;
  const view=()=>a.slice(0,k).concat(Lf.slice(i),Rt.slice(j),a.slice(hi));
  fr.push({a:view(),c,sw,rng:[lo,mid,hi],d,k,say:`Merge the sorted pieces [${Lf.join(' ')}] and [${Rt.join(' ')}] (split level ${d}).`});
  while(i<Lf.length&&j<Rt.length){c++;const ci=[k,k+(Lf.length-i)],l=Lf[i],r=Rt[j];
   fr.push({a:view(),cmp:ci,c,sw,rng:[lo,mid,hi],d,k,say:`Compare the front of each piece, ${l} and ${r}: ${Math.min(l,r)} is smaller, so it goes next.`});
   if(l<=r)a[k++]=Lf[i++];else a[k++]=Rt[j++];sw++}
  while(i<Lf.length){a[k++]=Lf[i++];sw++}while(j<Rt.length){a[k++]=Rt[j++];sw++}
  fr.push({a:a.slice(),c,sw,rng:[lo,mid,hi],d,k:hi,say:`One piece is used up: copy the rest. [${a.slice(lo,hi).join(' ')}] is sorted.`});
 })(0,n,0);
 fr.push({a:a.slice(),c,sw,done:range(n),say:`Sorted with ${c} comparisons. Merge sort always needs about n log₂ n, whatever the input.`});return fr}
function SS_quick(a0){const a=a0.slice(),n=a.length,fr=[],done=new Set();let c=0,sw=0;
 fr.push({a:a.slice(),c,sw,done:[],say:'Pick a pivot, move smaller items to its left and the rest to its right, then sort each side the same way.'});
 (function qs(lo,hi){if(lo>hi)return;if(lo===hi){done.add(lo);return}const pv=a[hi];let i=lo;
  fr.push({a:a.slice(),c,sw,pivot:hi,part:[lo,hi],bound:i,done:[...done],say:`Pivot ${pv} (the last item of positions ${lo+1}–${hi+1}).`});
  for(let j=lo;j<hi;j++){c++;const small=a[j]<pv;if(small){if(i!==j){[a[i],a[j]]=[a[j],a[i]];sw++}i++}
   fr.push({a:a.slice(),cmp:[j,hi],swapped:small&&i-1!==j,c,sw,pivot:hi,part:[lo,hi],bound:i,done:[...done],say:small?`${a[i-1]} < ${pv}: move it into the “smaller” zone.`:`${a[j]} ≥ ${pv}: leave it on the right.`})}
  if(i!==hi){[a[i],a[hi]]=[a[hi],a[i]];sw++}done.add(i);
  fr.push({a:a.slice(),c,sw,pivot:i,part:[lo,hi],bound:i,done:[...done],say:`Put pivot ${pv} between the zones. It is now in its final place.`});
  qs(lo,i-1);qs(i+1,hi);
 })(0,n-1);
 fr.push({a:a.slice(),c,sw,done:range(n),say:`Sorted with ${c} comparisons. A good pivot halves the work; a bad one (sorted input here) makes quick sort slow.`});return fr}
const SS_ALGS=[['Bubble',SS_bubble],['Insertion',SS_insertion],['Merge',SS_merge],['Quick',SS_quick]];
const SS_cmpCache=new Map();
function SS_counts(a){const key=a.join(',');if(!SS_cmpCache.has(key))SS_cmpCache.set(key,SS_ALGS.map(([n,fn])=>{const fr=fn(a);return fr[fr.length-1].c}));return SS_cmpCache.get(key)}
const SS_sortUI=[{b:'Shuffle',act:'shuffle'},{b:'Reverse',act:'reverse'},{b:'Nearly sorted',act:'nearly'},{b:'Few unique',act:'few'}];
const SS_sortOn={
 shuffle(s){s.a=shuffled(range(10).map(i=>i+1),nextSeed());s.sel=null},
 reverse(s){s.a=range(10).map(i=>10-i);s.sel=null},
 nearly(s){s.a=range(10).map(i=>i+1);const r=rng(nextSeed()),i=Math.floor(r()*9);[s.a[i],s.a[i+1]]=[s.a[i+1],s.a[i]];s.sel=null},
 few(s){s.a=shuffled([1,1,1,2,2,2,3,3,3,3],nextSeed());s.sel=null},
 pick(s,i){i=Number(i);if(s.sel===null||s.sel===undefined){s.sel=i}else{if(s.sel!==i)[s.a[s.sel],s.a[i]]=[s.a[i],s.a[s.sel]];s.sel=null}}};
function SS_sortDraw(which,title,s,f,X,moves='Swaps'){
 const a=f.a,n=a.length,W=38,x0=20,base=300,mx=Math.max(...a),sc=200/mx;let out=T(212,30,title,17,C.ink,'middle','font-weight="650"');
 const cmp=f.cmp||[],done=new Set(f.done||[]);
 if(f.rng){const [lo,mid,hi]=f.rng;out+=R(x0+lo*W,84,(mid-lo)*W,base-80,C.pale,'none',6)+R(x0+mid*W,84,(hi-mid)*W,base-80,C.purplep,'none',6)}
 if(f.part){const [lo,hi]=f.part;out+=R(x0+lo*W,84,(hi-lo+1)*W,base-80,'#f2f6f9',C.grid,6);if(f.bound>lo)out+=R(x0+lo*W,84,(f.bound-lo)*W,base-80,C.greenp,'none',6)}
 a.forEach((v,i)=>{const x=x0+i*W;let col='#9ab5c7';
  if(f.prefix&&i<f.prefix)col='#6f9fbf';if(done.has(i))col=C.green;if(f.pivot===i)col=C.purple;
  if(cmp.includes(i))col=f.swapped?C.coral:C.amber;
  const sel=X.try&&X.k===0&&s.sel===i;
  out+=hit(X,'pick',i,`Bar ${i+1}, value ${v}. Press two bars to swap them.`,R(x,80,W,base-76,'transparent','none',0)+R(x+4,base-v*sc,W-8,v*sc,col,sel?C.ink:'none',4,sel?'stroke-width="3"':''))+T(x+W/2,base+18,v,14,C.muted);
 });
 if(f.rng)out+=T(x0+f.rng[0]*W+4,100,'level '+f.d,13,C.muted,'start');
 out+=counter(418,46,'Comparisons',f.c,C.blue,82)+counter(508,46,moves,f.sw,C.coral,82);
 const cs=SS_counts(s.a),cm=Math.max(...cs);
 out+=TB(504,124,'Comparisons on this input',13,C.ink);
 SS_ALGS.forEach(([nm],i)=>{const y=136+i*34,me=nm===which;out+=T(418,y+12,nm,13,me?C.ink:C.muted,'start',me?'font-weight="700"':'')+R(418,y+17,Math.max(2,cs[i]/cm*130),10,me?C.blue:C.line,'none',3)+T(590,y+12,cs[i],13,me?C.blue:C.muted,'end','font-weight="650"')});
 out+=T(504,292,`n = ${n}: n²/2 = ${n*n/2}`,13,C.muted)+T(504,310,`n log₂ n ≈ ${Math.round(n*Math.log2(n))}`,13,C.muted);
 out+=T(212,350,X.try&&X.k===0&&s.sel!==null&&s.sel!==undefined?'Now press another bar to swap with it.':'Amber = compared · coral = swapped · green = in final place',13,C.muted);
 return out;
}
function SS_sortScene(id,name,tag,which,fn,title,def,ex,dur,moves){
 SCENE({id,name,tag,shared:'sort',definition:def,example:ex,dur,
  desc:`Ten bars of different heights being sorted by ${name.toLowerCase()}, with live comparison and ${moves.toLowerCase()} counters and a chart comparing four algorithms on the same input.`,
  hint:'Shuffle, reverse or nearly sort the bars, or press two bars to swap them, then Step or Run. All four sorting pages share this input.',
  init:()=>({a:SS_SORT0.slice(),sel:null}),ui:SS_sortUI,on:SS_sortOn,trace:s=>fn(s.a),
  draw(s,f,X){return {svg:SS_sortDraw(which,title,s,f,X,moves),phase:f.say}}});
}
SS_sortScene('bubble-sort','Bubble sort','Swap neighbours until nothing moves','Bubble',SS_bubble,'Swap neighbours that are out of order',
 'Repeatedly pass through the list, swapping neighbouring items that are in the wrong order, until a pass makes no swaps.',
 'Each pass carries the largest remaining value to the end, like a bubble rising. Simple, but about n²/2 comparisons for a shuffled list.',16,'Swaps');
SS_sortScene('insertion-sort','Insertion sort','Slide each item into place','Insertion',SS_insertion,'Slide each new item into the sorted part',
 'Build a sorted list one item at a time by sliding each new item left past larger ones until it fits.',
 'How most people sort a hand of cards. Very fast on nearly sorted input, but reversed input makes every item slide all the way.',15,'Swaps');
SS_sortScene('merge-sort','Merge sort','Split, then merge in order','Merge',SS_merge,'Split into halves, then merge sorted halves',
 'Split the list into halves until each piece has one item, then repeatedly merge pairs of sorted pieces by comparing their front items.',
 'Merging two sorted piles is easy: keep taking the smaller top card. log₂ n levels of splitting, n work per level: about n log₂ n comparisons.',16,'Moves');
SS_sortScene('quick-sort','Quick sort','Partition around a pivot','Quick',SS_quick,'Partition around a pivot, then sort each side',
 'Choose a pivot, rearrange the list so smaller items come before it and larger after it, then quick-sort each side.',
 'Usually the fastest in practice. With the last item as pivot, already sorted input is its worst case: every partition is lopsided.',16,'Swaps');

/* ---------- Big-O ---------- */
const SS_FN=[['O(1)',n=>1,C.muted],['O(log n)',n=>Math.max(1,Math.log2(n)),C.green],['O(n)',n=>n,C.blue],['O(n log n)',n=>Math.max(1,n*Math.log2(n)),C.purple],['O(n²)',n=>n*n,C.amber],['O(2ⁿ)',n=>2**n,C.coral]];
SCENE({id:'big-o',name:'Big-O notation',tag:'How the work grows',
 definition:'A way to describe how an algorithm’s running time grows as its input size n grows, ignoring constant factors.',
 example:'Linear search is O(n), binary search O(log n), bubble sort O(n²). At n = 64, 2ⁿ steps would take centuries even at a billion steps a second.',
 desc:'Six growth curves on a logarithmic scale race as n increases from 1 to 64, beside a table of step counts and times.',
 dur:11,hint:'Drag n. The vertical scale is logarithmic: each grid line is ten times the one below.',
 init:()=>({n:16}),watch:p=>({n:1+Math.round(smooth(p)*63)}),
 ui:[{range:'n',label:'n',min:1,max:64,get:s=>s.n,act:'n'},{b:'Double n',act:'dbl'}],
 on:{n(s,v){s.n=v},dbl(s){s.n=Math.min(64,s.n*2)}},
 draw(s){
  const x0=58,x1=320,yT=56,yB=300,X=n=>x0+(n-1)/63*(x1-x0),Y=v=>yB-clamp(Math.log10(Math.max(v,1))/6,0,1)*(yB-yT);let out=T(190,30,'Steps needed as n grows',18,C.ink,'middle','font-weight="650"');
  ['1','10','100','1k','10k','100k','1M'].forEach((l,i)=>{const y=yB-i*(yB-yT)/6;out+=L(x0,y,x1,y,C.grid,1)+T(x0-6,y+5,l,13,C.muted,'end')});
  [1,16,32,48,64].forEach(n=>out+=T(X(n),yB+20,n,13,C.muted));out+=T((x0+x1)/2,yB+40,'input size n',13,C.muted);
  out+=L(x0,yT,x0,yB,C.line,2)+L(x0,yB,x1,yB,C.line,2);
  for(const [nm,fn,col] of SS_FN){let d='',clip=false;for(let n=1;n<=s.n;n++){const v=fn(n);if(Math.log10(v)>6){clip=true;break}d+=(d?'L':'M')+fmt(X(n))+' '+fmt(Y(v))}
   if(d)out+=P(d,col,3);const v=fn(s.n);if(Math.log10(v)<=6)out+=Ci(X(s.n),Y(v),5,col);else if(clip){out+=T(X(20),yT-6,'2ⁿ off the chart ↑',13,C.coral)}}
  out+=L(X(s.n),yT,X(s.n),yB,C.ink,1.5,'stroke-dasharray="4 4"');
  out+=TB(460,44,`n = ${s.n}`,18,C.ink);
  SS_FN.forEach(([nm,fn,col],i)=>{const y=62+i*48,v=fn(s.n);out+=R(340,y,250,42,'#fff',C.grid,7)+R(340,y,6,42,col,'none',3)+TB(356,y+18,nm,14,col,'start')+TB(582,y+18,SS_num(v),15,C.ink,'end')+T(356,y+35,'≈ '+SS_time(v)+' at 10⁹ steps/s',13,C.muted,'start')});
  return {svg:out,phase:`At n = ${s.n}: O(n log n) needs about ${SS_num(SS_FN[3][1](s.n))} steps, O(n²) needs ${SS_num(s.n*s.n)} and O(2ⁿ) needs ${SS_num(2**s.n)}. Doubling n doubles O(n), quadruples O(n²) and squares O(2ⁿ).`};
 }});

/* ---------- Divide and conquer ---------- */
const SS_DCV=[7,3,9,4,12,6,2,8,5,11,1,10,14,13,15,0];
function SS_dc(s){const v=s.vals.slice(0,s.n),st={},res={},fr=[];let comps=0;
 const push=(cur,say)=>fr.push({st:{...st},res:{...res},cur,comps,say});
 push(null,`Find the largest of ${s.n} numbers by splitting the problem in half.`);
 (function rec(lo,hi,d){const id=lo+'-'+hi;
  if(hi-lo===1){st[id]='done';res[id]=v[lo];push(id,`A single number, ${v[lo]}, is its own maximum: the base case.`);return v[lo]}
  st[id]='split';push(id,`Split [${v.slice(lo,hi).join(' ')}] into two halves.`);
  const mid=(lo+hi)>>1,a=rec(lo,mid,d+1),b=rec(mid,hi,d+1);comps++;res[id]=Math.max(a,b);st[id]='done';
  push(id,`Combine: compare ${a} and ${b}, keep ${res[id]}.`);return res[id]})(0,s.n,0);
 fr.push({st:{...st},res:{...res},cur:null,comps,done:true,say:`The maximum is ${res['0-'+s.n]}: ${comps} comparisons in a tree ${Math.ceil(Math.log2(s.n))} levels deep.`});return fr}
SCENE({id:'divide-and-conquer',name:'Divide and conquer',tag:'Split, solve, combine',
 definition:'Solve a problem by splitting it into smaller problems of the same kind, solving those (often recursively), and combining their answers.',
 example:'Merge sort, quick sort and binary search all divide and conquer. Halving a problem of size 16 reaches single items in log₂ 16 = 4 levels.',
 desc:'A row of numbers at the top and a tree of boxes below; each box splits into two halves, and answers flow back up as the larger of two results.',
 dur:14,hint:'Choose how many numbers (2–16) and shuffle them, then Step or Run. Watch the depth grow by one each time n doubles.',
 init:()=>({n:8,vals:SS_DCV.slice()}),
 ui:[{range:'n',label:'Numbers',min:2,max:16,get:s=>s.n,act:'n'},{b:'Shuffle values',act:'shuffle'}],
 on:{n(s,v){s.n=v},shuffle(s){s.vals=shuffled(s.vals,nextSeed())}},
 trace:SS_dc,
 draw(s,f){
  const n=s.n,W=560/n,v=s.vals.slice(0,n);let out=heading('Largest number: split, solve, combine',24);
  v.forEach((x,i)=>out+=R(20+i*W+1,36,W-2,28,'#fff',C.grid,5)+T(20+i*W+W/2,55,x,13,C.ink));
  const nodes=[];(function rec(lo,hi,d){nodes.push([lo,hi,d]);if(hi-lo>1){const m=(lo+hi)>>1;rec(lo,m,d+1);rec(m,hi,d+1)}})(0,n,0);
  const yOf=d=>84+d*58;
  for(const [lo,hi,d] of nodes)if(hi-lo>1){const m=(lo+hi)>>1,cx=20+(lo+hi)/2*W;for(const [a,b] of [[lo,m],[m,hi]]){const id=a+'-'+b;if(f.st[id])out+=L(cx,yOf(d)+38,20+(a+b)/2*W,yOf(d+1),C.line,2)}}
  for(const [lo,hi,d] of nodes){const id=lo+'-'+hi,stt=f.st[id],cur=id===f.cur,x=20+lo*W+2,w=(hi-lo)*W-4,y=yOf(d);
   if(!stt){out+=R(x,y,w,38,'none',C.grid,6,'stroke-dasharray="4 4"');continue}
   const fill=stt==='done'?C.greenp:C.pale;out+=R(x,y,w,38,fill,cur?C.amber:stt==='done'?C.green:C.line,6,cur?'stroke-width="3"':'');
   const label=stt==='done'?(w>=60?'max '+f.res[id]:String(f.res[id])):(w>=60?'split':'…');
   out+=T(x+w/2,y+24,label,13,stt==='done'?C.green:C.muted,'middle','font-weight="650"');
  }
  return {svg:out,phase:f.say+(f.done?'':` Comparisons so far: ${f.comps}.`)};
 }});

/* ---------- Dynamic programming ---------- */
function SS_fibTree(n,memo){const known=new Set(),nodes=[];let leaf=0;
 function rec(k,d,parent){const node={k,d,parent,idx:nodes.length,hit:false};nodes.push(node);
  if(memo&&known.has(k)){node.hit=true;node.x=leaf++;node.last=node.idx;node.val=SS_fib(k);return node}
  if(k<2){node.x=leaf++;node.last=node.idx;node.val=k;known.add(k);return node}
  const a=rec(k-1,d+1,node),b=rec(k-2,d+1,node);node.x=(a.x+b.x)/2;node.last=nodes.length-1;node.val=a.val+b.val;known.add(k);return node}
 rec(n,0,null);return {nodes,leaves:leaf}}
const SS_fib=k=>{let a=0,b=1;for(let i=0;i<k;i++)[a,b]=[b,a+b];return a};
SCENE({id:'dynamic-programming',name:'Dynamic programming',tag:'Remember answers you have already found',
 definition:'Solve a problem by breaking it into overlapping smaller problems and storing each answer the first time, so it is never recomputed.',
 example:'fib(n) = fib(n−1) + fib(n−2). Plain recursion recomputes fib(2) again and again; memoising it turns hundreds of calls into a dozen.',
 desc:'The call tree for a Fibonacci number grows call by call; in memoised mode repeated calls become instant look-ups, and a table of stored answers fills in.',
 dur:15,hint:'Choose n and switch between plain recursion and memoised, then Step or Run. Compare the call counts.',
 init:()=>({n:6,mode:'naive'}),
 ui:[{range:'n',label:'n',min:2,max:7,get:s=>s.n,act:'n'},{choose:[['naive','Plain recursion'],['memo','Memoised']],label:'Method',get:s=>s.mode,act:'mode'}],
 on:{n(s,v){s.n=v},mode(s,m){s.mode=m}},
 trace(s){const t=SS_fibTree(s.n,s.mode==='memo');return t.nodes.map((nd,i)=>({i,t,say:nd.hit?`fib(${nd.k}) is already in the memo table: answer ${nd.val} instantly, no further calls.`:nd.k<2?`fib(${nd.k}) = ${nd.k}: a base case.`:`Call fib(${nd.k}), which needs fib(${nd.k-1}) and fib(${nd.k-2}).`})).concat([{i:t.nodes.length,t,done:true,say:`fib(${s.n}) = ${SS_fib(s.n)} using ${t.nodes.length} calls. ${s.mode==='memo'?`Plain recursion would need ${SS_fibTree(s.n,false).nodes.length}.`:`Memoised, it needs only ${SS_fibTree(s.n,true).nodes.length}.`}`}])},
 draw(s,f){
  const {nodes,leaves}=f.t,sp=Math.min(70,540/leaves),xo=300-(leaves-1)*sp/2,P_=nd=>[xo+nd.x*sp,64+nd.d*42],r=Math.min(14,sp*.45);
  let out=T(20,28,`fib(${s.n}) ${s.mode==='memo'?'memoised':'by plain recursion'}`,18,C.ink,'start','font-weight="650"');
  const naive=SS_fibTree(s.n,false).nodes.length,memo=SS_fibTree(s.n,true).nodes.length;
  out+=TB(580,24,`calls so far: ${Math.min(f.i+1,nodes.length)}`,15,C.blue,'end')+T(580,42,`plain ${naive} · memoised ${memo}`,13,C.muted,'end');
  nodes.forEach(nd=>{if(nd.idx<=f.i&&nd.parent){const a=P_(nd.parent),b=P_(nd);out+=L(a[0],a[1],b[0],b[1],nd.hit?C.green:C.line,2,nd.hit?'stroke-dasharray="4 3"':'')}});
  nodes.forEach(nd=>{if(nd.idx>f.i)return;const [x,y]=P_(nd),cur=nd.idx===f.i,fin=nd.last<=f.i&&!cur;
   out+=Ci(x,y,r,nd.hit?C.greenp:cur?C.coral:fin?C.pale:'#fff',nd.hit?C.green:cur?C.coral:C.blue)+T(x,y+5,nd.k,13,cur?'#fff':C.ink,'middle','font-weight="650"')});
  // Memo table (memoised) or recomputation counts (plain).
  out+=T(20,350,s.mode==='memo'?'memo':'times computed',13,C.muted,'start');
  const cw=Math.min(58,(560-120)/(s.n+1));
  for(let k=0;k<=s.n;k++){const x=130+k*cw;let txt,on;
   if(s.mode==='memo'){const fin=nodes.find(nd=>nd.k===k&&!nd.hit&&nd.last<=f.i);on=!!fin;txt=on?`f${k}=${SS_fib(k)}`:`f${k}`}
   else{const cnt=nodes.filter(nd=>nd.k===k&&nd.idx<=f.i).length;on=cnt>1;txt=`f${k} ×${cnt}`}
   out+=R(x,330,cw-4,30,on?(s.mode==='memo'?C.greenp:C.coralp):'#fff',on?(s.mode==='memo'?C.green:C.coral):C.grid,5)+T(x+(cw-4)/2,350,txt,13,C.ink);
  }
  return {svg:out,phase:f.say};
 }});
