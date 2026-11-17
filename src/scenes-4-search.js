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
 example:'Exploring a maze with chalk: go as far as you can, marking where you have been, then retrace your steps to the last junction with an unexplored way. (Keeping one hand on the wall is a different, more limited rule.)',
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
 const a=f.a,n=a.length,W=38,x0=20,base=300,mx=Math.max(...a),sc=200/mx;let out=TF(212,30,title,17,C.ink,'middle','font-weight="650"');
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
 out+=TBF(504,124,'Comparisons on this input',13,C.ink);
 SS_ALGS.forEach(([nm],i)=>{const y=136+i*34,me=nm===which;out+=T(418,y+12,nm,13,me?C.ink:C.muted,'start',me?'font-weight="700"':'')+R(418,y+17,Math.max(2,cs[i]/cm*130),10,me?C.blue:C.line,'none',3)+T(590,y+12,cs[i],13,me?C.blue:C.muted,'end','font-weight="650"')});
 out+=TF(504,292,`n = ${n}: n²/2 = ${n*n/2}`,13,C.muted)+TF(504,310,`n log₂ n ≈ ${Math.round(n*Math.log2(n))}`,13,C.muted);
 out+=TF(212,350,X.try&&X.k===0&&s.sel!==null&&s.sel!==undefined?'Now press another bar to swap with it.':'Amber = compared · coral = swapped · green = in final place',13,C.muted);
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
  SS_FN.forEach(([nm,fn,col],i)=>{const y=62+i*48,v=fn(s.n);out+=R(340,y,250,42,'#fff',C.grid,7)+R(340,y,6,42,col,'none',3)+TBF(356,y+18,nm,14,col,'start')+TBF(582,y+18,SS_num(v),15,C.ink,'end')+TF(356,y+35,'≈ '+SS_time(v)+' at 10⁹ steps/s',13,C.muted,'start')});
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
  out+=TF(20,350,s.mode==='memo'?'memo':'times computed',13,C.muted,'start');
  const cw=Math.min(58,(560-120)/(s.n+1));
  for(let k=0;k<=s.n;k++){const x=130+k*cw;let txt,on;
   if(s.mode==='memo'){const fin=nodes.find(nd=>nd.k===k&&!nd.hit&&nd.last<=f.i);on=!!fin;txt=on?`f${k}=${SS_fib(k)}`:`f${k}`}
   else{const cnt=nodes.filter(nd=>nd.k===k&&nd.idx<=f.i).length;on=cnt>1;txt=`f${k} ×${cnt}`}
   out+=R(x,330,cw-4,30,on?(s.mode==='memo'?C.greenp:C.coralp):'#fff',on?(s.mode==='memo'?C.green:C.coral):C.grid,5)+TF(x+(cw-4)/2,350,txt,13,C.ink);
  }
  return {svg:out,phase:f.say};
 }});

/* =====================================================================
   Stage 4, part 2: the further scenes of each lesson.
   ===================================================================== */

/* ---------- Linear search lesson ---------- */
const SS_LU=[14,3,19,8,1,12,6,17,10,4],SS_LS=SS_LU.slice().sort((a,b)=>a-b);
function SS_card(X,act,arg,label,x,y,w,h,v,fill,stroke,ink=C.ink,size=22){return hit(X,act,arg,label,R(x,y,w,h,fill,stroke,8)+TB(x+w/2,y+h/2+size*.36,v,size,ink))}
SCENE({id:'linear-early-exit',name:'Stopping early in a sorted list',tag:'Order lets you give up sooner',
 definition:'In a sorted list, a linear search can stop as soon as it passes a value bigger than the target, because the target could only have been earlier.',
 example:'Looking for 11 among 1, 3, 4, 6, 8, 10, 12…: at 12 you know 11 is missing. In an unsorted pile you must check every card before saying “not here”.',
 desc:'Two rows of ten cards, unsorted above and sorted below, searched at the same time; the sorted row stops at the first value larger than the target.',
 dur:10,hint:'Slide the target. Missing values show the difference best: the sorted row stops early, the unsorted row checks everything.',
 init:()=>({target:11}),
 ui:[{range:'t',label:'Target',min:0,max:20,get:s=>s.target,act:'target'}],
 on:{target(s,v){s.target=v}},
 trace(s){const t=s.target,n=SS_LU.length,ui=SS_LU.indexOf(t),uc=ui>=0?ui+1:n;let sj=SS_LS.findIndex(v=>v>=t);const sc=sj<0?n:sj+1,sFound=sj>=0&&SS_LS[sj]===t;
  const fr=[];for(let k=0;k<=Math.max(uc,sc);k++)fr.push({k,uc,sc,ui,sj,sFound,say:k===0?`Search both rows for ${t}, one card at a time.`:k<Math.max(uc,sc)?`Comparison ${k}.`+(k===sc&&!sFound&&sj>=0?` Sorted row: ${SS_LS[sj]} > ${t}, so ${t} cannot appear later. Stop.`:''):`Unsorted: ${uc} comparison${uc>1?'s':''}${ui<0?' (missing)':''}. Sorted: ${sc}${sFound?' (found)':sj>=0?' (stopped at '+SS_LS[sj]+')':' (missing)'}.`});
  return fr},
 draw(s,f,X){
  const n=10,w=48,step=54,x0=300-(n*step-6)/2;let out=heading(`Search for ${s.target}`);
  const row=(arr,y,count,foundIdx,stopIdx,label)=>{let o=TB(x0,y-12,label,14,C.muted,'start');
   arr.forEach((v,i)=>{const checked=i<Math.min(f.k,count),cur=i===Math.min(f.k,count)-1&&f.k>0,found=cur&&i===foundIdx,stop=cur&&i===stopIdx&&!found;
    const fill=found?C.greenp:stop?C.coralp:cur?C.amberp:checked?'#eef2f4':'#fff',st=found?C.green:stop?C.coral:cur?C.amber:checked?C.grid:C.line;
    o+=R(x0+i*step,y,w,58,fill,st,8)+TB(x0+i*step+w/2,y+37,v,20,checked&&!cur?C.muted:C.ink)});
   return o+T(x0+n*step-6,y-12,`${Math.min(f.k,count)} comparison${Math.min(f.k,count)===1?'':'s'}`,14,C.blue,'end','font-weight="650"')};
  out+=row(SS_LU,80,f.uc,f.ui,-1,'Unsorted');
  out+=row(SS_LS,205,f.sc,f.sFound?f.sj:-1,f.sFound?-1:f.sj,'Sorted');
  out+=T(300,310,'Unsorted: “not here” costs all n checks.',15,C.ink)+T(300,336,'Sorted: stop at the first value bigger than the target.',15,C.ink);
  return {svg:out,phase:f.say};
 }});

SCENE({id:'linear-average-case',name:'Best, average and worst case',tag:'It depends where the target is',
 definition:'The best case is the luckiest input, the worst case the unluckiest, and the average case what you expect over all inputs. For linear search they are 1, n, and about n/2 comparisons.',
 example:'With 8 cards and the target equally likely to be anywhere, you need 1 to 8 checks: (8 + 1) / 2 = 4.5 on average. If the target is often missing, the average moves towards n.',
 desc:'A bar for each possible target position showing how many comparisons it costs, with dashed lines marking the best, average and worst case.',
 dur:9,hint:'Change n and whether the target is sometimes missing. Watch the average line move.',
 init:()=>({n:8,miss:'present'}),
 watch(p){return {n:8,miss:p<.6?'present':'half',reveal:p}},
 ui:[{range:'n',label:'n',min:2,max:16,get:s=>s.n,act:'n'},{choose:[['present','Always present'],['half','Missing half the time']],label:'Target',get:s=>s.miss,act:'miss'}],
 on:{n(s,v){s.n=v},miss(s,v){s.miss=v}},
 draw(s,f,X){
  const n=s.n,half=s.miss==='half',bars=range(n).map(i=>i+1).concat(half?[n]:[]),shown=s.reveal===undefined?bars.length:Math.max(1,Math.ceil(clamp(s.reveal*1.6,0,1)*bars.length));
  const avg=half?.5*(n+1)/2+.5*n:(n+1)/2,base=300,W=Math.min(40,470/bars.length),x0=70,sc=210/Math.max(n,1);
  let out=heading('Comparisons needed for each place the target could be');
  out+=L(x0,base,x0+bars.length*W+6,base,C.line,2)+L(x0,base,x0,base-220,C.line,2);
  bars.slice(0,shown).forEach((v,i)=>{const miss=half&&i===n,x=x0+4+i*W;out+=R(x,base-v*sc,W-6,v*sc,miss?C.coral:C.blue,'none',3)+TF(x+(W-6)/2,base+16,miss?'✗':i+1,13,miss?C.coral:C.muted)});
  const line=(v,col,label)=>{const y=base-v*sc;return L(x0,y,x0+bars.length*W+6,y,col,2,'stroke-dasharray="6 4"')+T(x0+bars.length*W+12,y+5,label,14,col,'start','font-weight="650"')};
  out+=line(1,C.green,'best 1')+line(n,C.coral,'worst '+n)+line(avg,C.purple,'average '+fmt(avg));
  out+=TF(300,356,half?'Half the time the target is missing and costs all n checks.':'Target equally likely at each position: average (n + 1) / 2.',14,C.muted);
  out+=TF(70,base+30,'target position →',13,C.muted,'start');
  return {svg:out,phase:`n = ${n}: best case 1, worst case ${n}, average ${fmt(avg)}. All three grow in proportion to n, so linear search is O(n) whichever case you measure.`};
 }});

SCENE({id:'linear-sentinel',name:'Sentinel search',tag:'One test per card instead of two',
 definition:'A sentinel is a copy of the target placed after the last item, so the search loop no longer needs to check whether it has reached the end.',
 example:'The plain loop asks two questions per card: “is i still inside the list?” and “is this the target?”. With the sentinel guaranteed to stop the loop, only the second question remains.',
 desc:'Two copies of the same cards: the plain search counts two tests per card, the sentinel version, with an extra target card at the end, counts one.',
 dur:10,hint:'Choose a target (10 is missing) or shuffle, then step. Compare the test counters.',
 init:()=>({cards:[7,3,9,1,8,4,6,2,5],target:4}),
 ui:[{range:'t',label:'Target',min:1,max:10,get:s=>s.target,act:'target'},{b:'Shuffle cards',act:'shuffle'}],
 on:{target(s,v){s.target=v},shuffle(s){s.cards=shuffled(s.cards,nextSeed())}},
 trace(s){const n=s.cards.length,m=s.cards.indexOf(s.target),steps=m>=0?m+1:n,fr=[];
  for(let k=0;k<=steps;k++)fr.push({k,plain:2*k,sent:k,say:k===0?'The sentinel copy of the target sits after the last card, so the sentinel loop cannot run off the end.':m>=0&&k===steps?`Found at card ${m+1}.`:`Card ${k}: not the target.`});
  const last=fr[fr.length-1];
  if(m>=0)fr.push({k:steps,plain:2*steps,sent:steps+1,done:true,m,say:`Plain loop: ${2*steps} tests. Sentinel loop: ${steps} comparisons plus one final check that it stopped before the sentinel = ${steps+1}.`});
  else fr.push({k:n+1,plain:2*n+1,sent:n+2,done:true,m,say:`Missing: the plain loop made ${2*n+1} tests; the sentinel loop hit the sentinel after ${n+1} comparisons, then one check showed it was the sentinel: ${n+2}.`});
  return fr},
 draw(s,f,X){
  const n=s.cards.length,w=46,step=52,x0=36;let out=heading(`Search for ${s.target}`);
  const row=(y,withSent,count,label,code)=>{let o=TBF(x0,y-12,label,14,C.muted,'start')+TMF(x0+122,y-12,code,13,C.muted,'start')+TBF(x0+(n+1)*step-6,y-12,`tests: ${count}`,15,withSent?C.purple:C.blue,'end');
   s.cards.concat(withSent?[s.target]:[]).forEach((v,i)=>{const sent=i===n,looked=i<Math.min(f.k,withSent?n+1:n),cur=i===Math.min(f.k,withSent?n+1:n)-1&&f.k>0,found=cur&&v===s.target;
    o+=R(x0+i*step,y,w,56,sent?C.purplep:found?C.greenp:cur?C.amberp:looked?'#eef2f4':'#fff',sent?C.purple:found?C.green:cur?C.amber:C.line,8,sent?'stroke-dasharray="5 3"':'')+TB(x0+i*step+w/2,y+36,v,20,sent?C.purple:C.ink)});
   return o};
  out+=row(84,false,f.plain,'Plain loop','while i < n and a[i] ≠ t');
  out+=row(214,true,f.sent,'With sentinel','while a[i] ≠ t');
  out+=TF(x0+n*step+w/2,292,'sentinel',13,C.purple);
  out+=TF(300,352,'Same O(n) growth, but half the tests in the inner loop.',14,C.muted);
  return {svg:out,phase:f.say};
 }});

/* ---------- Binary search lesson ---------- */
const SS_BU=[12,5,19,9,2,15,7,1,17,11,4,14,8,20,3];
function SS_binTrace(a,t){let lo=0,hi=a.length-1,c=0;const fr=[{lo,hi,mid:null,c,say:`Search for ${t}: check the middle of the whole list.`}];
 while(lo<=hi){const mid=(lo+hi)>>1;c++;if(a[mid]===t){fr.push({lo,hi,mid,c,found:true,say:`${a[mid]} is the target: found after ${c} comparison${c>1?'s':''}.`});return fr}
  const left=t<a[mid];fr.push({lo,hi,mid,c,say:`${t} ${left?'<':'>'} ${a[mid]}, so keep the ${left?'left':'right'} half.`});if(left)hi=mid-1;else lo=mid+1}
 fr.push({lo,hi,mid:null,c,miss:true,say:'The interval is empty.'});return fr}
function SS_rowCells(X,a,f,x0,y,w,step,act){let o='';a.forEach((v,i)=>{const inside=i>=f.lo&&i<=f.hi&&!f.miss,mid=i===f.mid,found=mid&&f.found;
 o+=hit(X,act,i,`${v}. Press to search for ${v}.`,R(x0+i*step,y,w,44,found?C.greenp:mid?C.amberp:inside?'#fff':'#eef2f4',found?C.green:mid?C.amber:inside?C.blue:C.grid,6)+TB(x0+i*step+w/2,y+28,v,15,inside||mid?C.ink:'#9aaab3'))});return o}
SCENE({id:'binary-search-unsorted',name:'Why binary search needs sorted data',tag:'Halving only works with order',
 definition:'Binary search throws away half the list after each comparison. That is only safe if the list is sorted; on unsorted data it can discard the half that holds the target.',
 example:'Searching an unsorted list for 9: the middle is 1, 9 > 1, so binary search keeps the right half. But 9 was on the left, so it reports “not found”.',
 desc:'Fifteen numbers, either sorted or jumbled, with the same binary search running on them; discarded cells turn grey.',
 dur:10,hint:'Switch between sorted and unsorted, pick a target by pressing a number, then Step. On unsorted data it often misses.',
 init:()=>({sorted:false,target:9}),
 ui:[{choose:[['false','Unsorted'],['true','Sorted']],label:'Data',get:s=>String(s.sorted),act:'data'}],
 on:{data(s,v){s.sorted=v==='true'},pick(s,i){const a=s.sorted?SS_BU.slice().sort((x,y)=>x-y):SS_BU;s.target=a[Number(i)]}},
 trace(s){const a=s.sorted?SS_BU.slice().sort((x,y)=>x-y):SS_BU,fr=SS_binTrace(a,s.target),last=fr[fr.length-1];
  if(last.miss){const j=a.indexOf(s.target);last.say=j>=0?`“Not found”, but ${s.target} is at position ${j+1}: it was in a half that was thrown away. Binary search trusted an order that was not there.`:`${s.target} is not in the list.`;last.lost=j}
  return fr},
 draw(s,f,X){
  const a=s.sorted?SS_BU.slice().sort((x,y)=>x-y):SS_BU,w=34,step=37,x0=300-(a.length*step-3)/2;let out=heading(s.sorted?'Sorted: every discarded half is safe':'Unsorted: a discarded half may hold the target');
  out+=SS_rowCells(X,a,f,x0,110,w,step,'pick');
  if(f.mid!==null){const x=x0+f.mid*step+w/2;out+=TB(x,98,'mid ↓',13,f.found?C.green:C.amber)}
  if(f.lost>=0&&f.lost!==undefined){const x=x0+f.lost*step+w/2;out+=arrow(x,200,x,160,C.coral,3)+TB(x,220,`${s.target} was here`,14,C.coral)}
  out+=counter(160,252,'Target',s.target,C.ink,130)+counter(310,252,'Comparisons',f.c,C.blue,130);
  out+=T(300,345,'Sort once (O(n log n)), then every search is O(log n).',14,C.muted);
  return {svg:out,phase:f.say};
 }});

SCENE({id:'binary-guess-number',name:'Guess the number',tag:'Halving a range of numbers',
 definition:'Guessing a secret number from 1 to N with “higher” or “lower” clues takes at most ⌈log₂(N + 1)⌉ guesses if you always guess the middle of what is left.',
 example:'1 to 100 needs at most 7 guesses, because 2⁷ = 128 > 100. Ten times the range, 1 to 1000, needs only 3 more: 10 guesses.',
 desc:'A number line from 1 to N with the remaining range shaded; each guess is marked and labelled “too high” or “too low” until the secret is found.',
 dur:10,hint:'Set the secret and the range, then Step to watch the halving guesser.',
 init:()=>({secret:37,max:100}),
 ui:[{range:'secret',label:'Secret',min:1,max:1000,get:s=>s.secret,act:'secret'},{choose:[['100','1 to 100'],['1000','1 to 1000']],label:'Range',get:s=>String(s.max),act:'max'}],
 on:{secret(s,v){s.secret=clamp(v,1,s.max)},max(s,v){s.max=Number(v);s.secret=clamp(s.secret,1,s.max)}},
 trace(s){let lo=1,hi=s.max;const fr=[{lo,hi,guesses:[],say:`The secret is between 1 and ${s.max}.`}],gs=[];
  while(lo<=hi){const g=(lo+hi)>>1;const res=g===s.secret?'yes':g>s.secret?'high':'low';gs.push([g,res]);
   if(res==='yes'){fr.push({lo,hi,guesses:gs.slice(),done:true,say:`Guess ${gs.length}: ${g}. Correct!`});break}
   if(res==='high')hi=g-1;else lo=g+1;fr.push({lo,hi,guesses:gs.slice(),say:`Guess ${gs.length}: ${g} is too ${res}. Now ${lo}–${hi}: ${hi-lo+1} number${hi-lo?'s':''} left.`})}
  return fr},
 draw(s,f,X){
  const x0=40,x1=560,X_=v=>x0+(x1-x0)*(v-1)/(s.max-1||1),limit=Math.ceil(Math.log2(s.max+1));let out=heading(`Find the secret between 1 and ${s.max}`);
  out+=L(x0,130,x1,130,C.line,6)+R(X_(f.lo)-2,120,Math.max(4,X_(f.hi)-X_(f.lo)+4),20,C.pale,C.blue,6);
  out+=T(x0,160,'1',13,C.muted)+T(x1,160,s.max,13,C.muted);
  f.guesses.forEach(([g,r],i)=>{const x=X_(g),col=r==='yes'?C.green:r==='high'?C.coral:C.purple,last=i===f.guesses.length-1;out+=L(x,100,x,150,col,last?3:1.5)+(last?TB(x,92,g,15,col):'')});
  const list=f.guesses.map(([g,r])=>g+(r==='yes'?' ✓':r==='high'?' ↓':' ↑'));
  list.forEach((t,i)=>{const col=i%5,row=Math.floor(i/5);out+=R(48+col*104,190+row*40,96,32,'#fff',C.grid,6)+TF(96+col*104,211+row*40,`${i+1}. ${t}`,14,C.ink)});
  out+=counter(140,288,'Guesses',f.guesses.length,C.blue,140)+counter(320,288,`Most needed (⌈log₂ ${s.max+1}⌉)`,limit,C.muted,150);
  return {svg:out,phase:f.say+(f.done?` That took ${f.guesses.length} of at most ${limit} guesses.`:'')};
 }});

const SS_DUP=[3,5,5,5,8,10,10,13,15,15,15,18,21,24,27];
SCENE({id:'binary-insertion-point',name:'First occurrence and insertion point',tag:'Binary search for a boundary',
 definition:'A variant of binary search that finds the first position whose value is at least the target: the first copy of the target, or where it should be inserted to keep the list sorted.',
 example:'In 3, 5, 5, 5, 8 the first 5 is at position 2. Searching for 6 gives position 5: insert 6 there and the list stays sorted.',
 desc:'A sorted list with repeated values; low and high close in on a boundary, which is marked with an insertion arrow.',
 dur:10,hint:'Slide the target, including values that repeat (5, 10, 15) and values that are missing (6, 30).',
 init:()=>({target:15}),
 ui:[{range:'t',label:'Target',min:0,max:30,get:s=>s.target,act:'target'}],
 on:{target(s,v){s.target=v}},
 trace(s){const a=SS_DUP,t=s.target;let lo=0,hi=a.length,c=0;const fr=[{lo,hi,mid:null,c,say:`Find the first position holding a value ≥ ${t}. The answer lies between low and high.`}];
  while(lo<hi){const mid=(lo+hi)>>1;c++;const go=a[mid]<t;fr.push({lo,hi,mid,c,say:go?`${a[mid]} < ${t}: the boundary is to the right of position ${mid+1}.`:`${a[mid]} ≥ ${t}: the boundary is here or to the left, so keep position ${mid+1}.`});if(go)lo=mid+1;else hi=mid}
  const hitIt=a[lo]===t;fr.push({lo,hi,mid:null,c,done:true,ans:lo,say:hitIt?`Low = high = ${lo+1}: the first ${t} is at position ${lo+1}, found in ${c} comparisons, even though ${t} appears ${a.filter(v=>v===t).length} times.`:`${t} is not present. Insert it at position ${lo+1} to keep the list sorted.`});return fr},
 draw(s,f,X){
  const a=SS_DUP,w=34,step=37,x0=300-(a.length*step-3)/2;let out=heading(`First position with a value ≥ ${s.target}`);
  a.forEach((v,i)=>{const inside=i>=f.lo&&i<f.hi,mid=i===f.mid,eq=f.done&&v===s.target;out+=R(x0+i*step,110,w,44,mid?C.amberp:eq?C.greenp:inside?'#fff':'#eef2f4',mid?C.amber:eq?C.green:inside?C.blue:C.grid,6)+TB(x0+i*step+w/2,138,v,15,inside||mid||eq?C.ink:'#9aaab3')+TF(x0+i*step+w/2,100,i+1,13,C.muted)});
  if(f.done){const x=x0+f.ans*step-1.5;out+=L(x,104,x,166,C.coral,3)+arrow(x,212,x,172,C.coral,3)+TB(x,232,SS_DUP[f.ans]===s.target?'first copy':'insert here',14,C.coral)}
  else{const xl=x0+f.lo*step,xr=x0+f.hi*step-3;if(xr>xl)out+=P(`M${xl} 162V170H${xr}V162`,C.blue,2.5)+T(xl,188,'low',13,C.blue,'start')+T(xr,188,'high',13,C.blue,'end')}
  out+=counter(225,256,'Comparisons',f.c,C.blue,150);
  out+=T(300,345,'An ordinary binary search might stop at any of the copies; this one finds the first.',14,C.muted);
  return {svg:out,phase:f.say};
 }});

/* ---------- Grid mazes: BFS, DFS and A* share one maze ---------- */
const SS_MZ=['S....#.....','.##.##.###.','.#.......#.','.#.###.#.#.','...#...#...','##.#.###.#.','...#.....#G'];
const SS_MW=11,SS_MH=7,SS_CS=34,SS_GX=18,SS_GY=56,SS_MS=0,SS_MG=SS_MW*SS_MH-1;
const SS_mazeInit=()=>({walls:SS_MZ.flatMap((r,i)=>[...r].map((ch,j)=>ch==='#'?i*SS_MW+j:-1)).filter(x=>x>=0),mode:'astar'});
function SS_nbrs(c,W,order=[[0,1],[1,0],[0,-1],[-1,0]]){const r=Math.floor(c/SS_MW),k=c%SS_MW,out=[];for(const [dr,dk] of order){const rr=r+dr,kk=k+dk;if(rr<0||kk<0||rr>=SS_MH||kk>=SS_MW)continue;const n=rr*SS_MW+kk;if(!W.has(n))out.push(n)}return out}
function SS_back(par,end){if(end===undefined||(end!==SS_MS&&par[end]===undefined))return null;const p=[end];let c=end;while(c!==SS_MS){c=par[c];p.push(c)}return p.reverse()}
function SS_mazeBFS(s){const W=new Set(s.walls),dist={[SS_MS]:0},par={},layers=[[SS_MS]];let q=[SS_MS];
 while(q.length&&dist[SS_MG]===undefined){const nx=[];for(const c of q)for(const n of SS_nbrs(c,W))if(dist[n]===undefined){dist[n]=dist[c]+1;par[n]=c;nx.push(n)}if(!nx.length)break;layers.push(nx);q=nx}
 return {dist,layers,path:dist[SS_MG]!==undefined?SS_back(par,SS_MG):null}}
function SS_mazeDFS(s){const W=new Set(s.walls),seen=new Set([SS_MS]),stack=[SS_MS],dead=[],fr=[{stack:[SS_MS],dead:[],seen:1,say:'Start at S. Follow one corridor as far as it goes (trying right, down, left, up in that order).'}];
 while(stack.length&&fr.length<220){const c=stack[stack.length-1];if(c===SS_MG){fr.push({stack:stack.slice(),dead:dead.slice(),seen:seen.size,found:true,say:`Reached G. The path on the stack is ${stack.length-1} steps long: a route, but not necessarily the shortest.`});return fr}
  const n=SS_nbrs(c,W).find(n=>!seen.has(n));
  if(n!==undefined){seen.add(n);stack.push(n);fr.push({stack:stack.slice(),dead:dead.slice(),seen:seen.size,say:`Step forward. The stack (the current path) is ${stack.length} cells deep.`})}
  else{stack.pop();dead.push(c);fr.push({stack:stack.slice(),dead:dead.slice(),seen:seen.size,back:c,say:'Dead end: nothing new to explore here. Pop it off the stack and back up one cell.'})}}
 fr.push({stack:[],dead:dead.slice(),seen:seen.size,fail:true,say:'Every reachable cell has been explored and G was never reached: the walls block every route.'});return fr}
function SS_mazeAstar(s,mode){const W=new Set(s.walls),h=c=>mode==='astar'?Math.abs(Math.floor(c/SS_MW)-(SS_MH-1))+Math.abs(c%SS_MW-(SS_MW-1)):0;
 const g={[SS_MS]:0},par={},open=[SS_MS],closed=[],fr=[{cur:null,closed:[],open:[SS_MS],g:{...g},say:mode==='astar'?'A*: always expand the open cell with the smallest (steps so far + estimated steps left).':'Dijkstra: always expand the open cell with the fewest steps so far, with no sense of where G is.'}];
 while(open.length){open.sort((a,b)=>(g[a]+h(a))-(g[b]+h(b))||h(a)-h(b)||a-b);const c=open.shift();closed.push(c);
  if(c===SS_MG){fr.push({cur:c,closed:closed.slice(),open:open.slice(),g:{...g},done:true,path:SS_back(par,SS_MG),say:`Reached G after expanding ${closed.length} cells. Path length ${g[c]}.`});return fr}
  for(const n of SS_nbrs(c,W))if(!closed.includes(n)&&(g[n]===undefined||g[c]+1<g[n])){g[n]=g[c]+1;par[n]=c;if(!open.includes(n))open.push(n)}
  fr.push({cur:c,closed:closed.slice(),open:open.slice(),g:{...g},h:mode==='astar'?h(c):0,say:`Expand the cell with ${mode==='astar'?`g + h = ${g[c]} + ${h(c)} = ${g[c]+h(c)}`:`g = ${g[c]}`}. ${open.length} cell${open.length===1?'':'s'} wait in the open set.`})}
 fr.push({cur:null,closed:closed.slice(),open:[],g:{...g},done:true,path:null,say:'The open set is empty: G cannot be reached.'});return fr}
function SS_mazeDraw(X,s,cellFn){let out='';
 for(let r=0;r<SS_MH;r++)for(let k=0;k<SS_MW;k++){const c=r*SS_MW+k,x=SS_GX+k*SS_CS,y=SS_GY+r*SS_CS,wall=s.walls.includes(c),st=wall?{}:(cellFn(c)||{});
  let inner=R(x+1,y+1,SS_CS-2,SS_CS-2,wall?C.dark:st.fill||'#fff',wall?C.dark:st.stroke||C.grid,4);
  const lab=c===SS_MS?'S':c===SS_MG?'G':st.label;if(lab!==undefined&&lab!=='')inner+=TBF(x+SS_CS/2,y+SS_CS/2+5,lab,13,st.ink||C.ink);
  out+=(c===SS_MS||c===SS_MG)?inner:hit(X,'wall',c,`Row ${r+1}, column ${k+1}: ${wall?'wall':'open'}. Press to toggle a wall.`,inner)}
 return out}
function SS_pathLine(path){if(!path)return '';return P(path.map((c,i)=>`${i?'L':'M'}${SS_GX+(c%SS_MW)*SS_CS+SS_CS/2} ${SS_GY+Math.floor(c/SS_MW)*SS_CS+SS_CS/2}`).join(''),C.coral,4,'none','opacity=".85"')}
const SS_mazeOn={wall(s,c){c=Number(c);const i=s.walls.indexOf(c);if(i>=0)s.walls.splice(i,1);else s.walls.push(c)},mode(s,v){s.mode=v},clear(s){s.walls=[]},restore(s){s.walls=SS_mazeInit().walls}};
const SS_mazeUI=[{b:'Clear walls',act:'clear'},{b:'Original maze',act:'restore'}];
function SS_mazeStats(s){const b=SS_mazeBFS(s),d=SS_mazeDFS(s),df=d[d.length-1];return {bfs:b.path?b.path.length-1:null,dfs:df.found?df.stack.length-1:null}}

SCENE({id:'bfs-maze',name:'Shortest path through a maze',tag:'Breadth-first search on a grid',shared:'grid-maze',
 definition:'Treat each open square of a maze as a node joined to its neighbours. Breadth-first search spreads out one step at a time, so the first time it reaches the goal it has found a shortest route.',
 example:'Every square gets a number: its distance from the start. Following the numbers back down from the goal, 14, 13, 12…, traces a shortest path.',
 desc:'A grid maze with walls; numbers spread out from S in waves showing each square’s distance, until G is reached and the shortest path is drawn.',
 dur:14,hint:'Press squares to add or remove walls, then Step or Run. The maze is shared with depth-first search and A*.',
 init:SS_mazeInit,ui:SS_mazeUI,on:SS_mazeOn,
 trace(s){const b=SS_mazeBFS(s),fr=b.layers.map((_,d)=>({d,b,say:d===0?'Distance 0: the start.':`Wave ${d}: every square ${d} step${d>1?'s':''} from S.`}));
  fr.push({d:b.layers.length-1,b,done:true,say:b.path?`G is ${b.path.length-1} steps away. No route can be shorter, because BFS reached every square at distance ${b.path.length-2} first.`:'The waves stop before reaching G: there is no route.'});return fr},
 draw(s,f,X){
  const dist=f.b.dist;let out=heading('Waves of equal distance from S');
  out+=SS_mazeDraw(X,s,c=>{const d=dist[c];if(d===undefined||d>f.d)return null;const front=d===f.d&&!f.done;return {fill:front?C.amberp:C.pale,stroke:front?C.amber:C.grid,label:c===SS_MS||c===SS_MG?undefined:d,ink:C.blue}});
  if(f.done)out+=SS_pathLine(f.b.path);
  const st=SS_mazeStats(s);
  out+=counter(420,70,'Wave',f.d,C.amber,150)+counter(420,128,'Squares reached',Object.values(dist).filter(d=>d<=f.d).length,C.blue,150);
  out+=counter(420,186,'Shortest path',st.bfs===null?'none':st.bfs+' steps',C.coral,150)+counter(420,244,'Depth-first path',st.dfs===null?'none':st.dfs+' steps',C.muted,150);
  return {svg:out,phase:f.say};
 }});

/* Flood fill: a paint bucket is BFS on pixels of one colour. */
const SS_PICS=[['wwwwkkkwwwww','wwwkwwwkwbbw','wwkwwwwwkbbw','wkwwwwwwwkww','wkwwwwwwwkww','wwkwwwwwkwgg','wwwkwwwkwwgg','wwwwkkkwwwww'],
 ['kkkkkkkkkkkk','kwwwkwwwwwwk','kwwwkwkkkkwk','kwwwwwkwwkwk','kkkkkwkwwkwk','kwwwkwkkwkwk','kwwwwwwwwwwk','kkkkkkkkkkkk']];
const SS_PCOL={w:'#ffffff',k:C.dark,b:'#9fc6e4',g:'#a8d5c7'};
SCENE({id:'bfs-flood-fill',name:'Flood fill',tag:'The paint bucket is a breadth-first search',
 definition:'Flood fill recolours every pixel connected to a starting pixel through pixels of the same colour, by exploring neighbours with a queue.',
 example:'Clicking a paint bucket inside a drawn circle fills the inside but not the outside, because the outline’s dark pixels are never added to the queue.',
 desc:'A grid of pixels with a dark outline; the fill spreads from the chosen pixel in rings, stopping at pixels of another colour.',
 dur:10,hint:'Press any pixel to start the fill there, then Step or Run. Try outside the shape too.',
 init:()=>({pic:0,start:3*12+5}),
 ui:[{b:'Other picture',act:'pic'}],
 on:{start(s,c){s.start=Number(c)},pic(s){s.pic=1-s.pic;s.start=3*12+2}},
 trace(s){const pic=SS_PICS[s.pic],W=12,H=8,col=c=>pic[Math.floor(c/W)][c%W],target=col(s.start),dist={[s.start]:0},layers=[[s.start]];let q=[s.start];
  while(q.length){const nx=[];for(const c of q){const r=Math.floor(c/W),k=c%W;for(const [dr,dk] of [[0,1],[1,0],[0,-1],[-1,0]]){const rr=r+dr,kk=k+dk;if(rr<0||kk<0||rr>=H||kk>=W)continue;const n=rr*W+kk;if(dist[n]===undefined&&col(n)===target){dist[n]=dist[c]+1;nx.push(n)}}}if(!nx.length)break;layers.push(nx);q=nx}
  const total=Object.keys(dist).length;return layers.map((L,d)=>({d,dist,total,say:d===0?'Start: recolour the chosen pixel and put it in the queue.':d===layers.length-1?`Done: ${total} pixels recoloured in ${d+1} rings. Pixels of a different colour were never queued, so the fill stopped at the edges.`:`Ring ${d}: ${L.length} more pixel${L.length>1?'s':''} of the same colour.`}))},
 draw(s,f,X){
  const pic=SS_PICS[s.pic],cs=33,x0=18,y0=52;let out=heading('Fill every connected pixel of the same colour');
  for(let r=0;r<8;r++)for(let k=0;k<12;k++){const c=r*12+k,d=f.dist[c],filled=d!==undefined&&d<=f.d,front=filled&&d===f.d;
   out+=hit(X,'start',c,`Pixel row ${r+1}, column ${k+1}. Press to fill from here.`,R(x0+k*cs,y0+r*cs,cs-1,cs-1,filled?(front?'#f4a58f':C.coral):SS_PCOL[pic[r][k]],c===s.start?C.ink:'#d4dee5',2,c===s.start?'stroke-width="3"':'stroke-width="1"'))}
  out+=counter(430,80,'Ring',f.d,C.amber,150)+counter(430,140,'Pixels filled',Object.values(f.dist).filter(d=>d<=f.d).length,C.coral,150);
  out+=TF(505,230,'Queue order = rings',13,C.muted)+TF(505,250,'of equal distance,',13,C.muted)+TF(505,270,'exactly as in BFS.',13,C.muted);
  return {svg:out,phase:f.say};
 }});

const SS_PEOPLE=['Ana','Ben','Cai','Dev','Eli','Fay','Gus','Hal','Ivy','Jo'];
const SS_FRIENDS=[[0,1],[0,2],[1,3],[2,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,9],[1,4],[8,9]];
SCENE({id:'bfs-levels',name:'Degrees of separation',tag:'BFS layers on a social network',
 definition:'Breadth-first search sorts every person in a network by their distance from you: friends, friends of friends, and so on. Each ring is one more “degree of separation”.',
 example:'If Ana is friends with Ben and Cai, and Cai with Dev, then Dev is two degrees from Ana. BFS finds this for everyone at once.',
 desc:'A small friendship network redrawn as rings around the chosen person; people within the chosen number of steps are highlighted, and a list groups people by distance.',
 dur:10,hint:'Press a person to put them in the centre. Slide k to highlight everyone within k steps.',
 init:()=>({start:0,k:2}),
 watch(p){return {start:0,k:Math.min(4,Math.floor(p*5))}},
 ui:[{range:'k',label:'Within k steps',min:0,max:5,get:s=>s.k,act:'k'}],
 on:{who(s,i){s.start=Number(i)},k(s,v){s.k=v}},
 draw(s,f,X){
  const n=SS_PEOPLE.length,adj=range(n).map(()=>[]);SS_FRIENDS.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a)});
  const dist=Array(n).fill(-1);dist[s.start]=0;let q=[s.start];while(q.length){const nx=[];for(const u of q)for(const v of adj[u])if(dist[v]<0){dist[v]=dist[u]+1;nx.push(v)}q=nx}
  const maxd=Math.max(...dist),cx=215,cy=205,rad=[0,58,108,152,152,152],pos=[];
  for(let d=0;d<=maxd;d++){const ring=range(n).filter(i=>dist[i]===d);ring.forEach((i,j)=>{const a=-Math.PI/2+(j+.5)*2*Math.PI/ring.length+d*.4;pos[i]=[cx+Math.cos(a)*rad[Math.min(d,5)]*(d>3?1+(d-3)*.12:1),cy+Math.sin(a)*rad[Math.min(d,5)]*.98]})}
  let out=heading(`Everyone within ${s.k} step${s.k===1?'':'s'} of ${SS_PEOPLE[s.start]}`,28);
  for(let d=1;d<=Math.min(maxd,3);d++)out+=Ci(cx,cy,rad[d],'none',C.grid,'stroke-dasharray="4 5"');
  SS_FRIENDS.forEach(([a,b])=>{const on=dist[a]<=s.k&&dist[b]<=s.k&&Math.abs(dist[a]-dist[b])===1;out+=L(pos[a][0],pos[a][1],pos[b][0],pos[b][1],on?C.blue:C.line,on?2.5:1.5)});
  range(n).forEach(i=>{const [x,y]=pos[i],inR=dist[i]<=s.k,me=i===s.start;out+=hit(X,'who',i,`${SS_PEOPLE[i]}, ${dist[i]} steps away. Press to put them in the centre.`,Ci(x,y,21,me?C.coral:inR?C.blue:'#fff',me?C.coral:inR?C.blue:C.line)+TBF(x,y+5,SS_PEOPLE[i],13,me||inR?'#fff':C.ink))});
  for(let d=0;d<=maxd;d++){const y=72+d*48,names=range(n).filter(i=>dist[i]===d).map(i=>SS_PEOPLE[i]).join(', ');out+=TBF(420,y,d===0?'Start':`${d} step${d>1?'s':''}`,13,d<=s.k?C.blue:C.muted,'start')+TF(420,y+19,names,13,d<=s.k?C.ink:C.muted,'start')}
  const within=dist.filter(d=>d>=0&&d<=s.k).length-1;
  return {svg:out,phase:`${within} ${within===1?'person is':'people are'} within ${s.k} step${s.k===1?'':'s'} of ${SS_PEOPLE[s.start]}. The rings are BFS layers: everyone in ring d is found before anyone in ring d + 1.`};
 }});

/* ---------- Depth-first search lesson ---------- */
SCENE({id:'dfs-maze',name:'Solving a maze by backtracking',tag:'Depth-first search on a grid',shared:'grid-maze',
 definition:'Depth-first search walks one corridor as far as it can, and on reaching a dead end backs up to the last junction with an unexplored way. The stack holds the current path.',
 example:'Unlike keeping one hand on the wall, which can miss an exit inside a loop of walls, depth-first search marks where it has been, so in a finite maze it always finds a way out if there is one, though not necessarily the shortest.',
 desc:'The same grid maze; a path grows from S, dead ends turn grey as the search backs up, and the final stack is the route found.',
 dur:16,hint:'Edit walls (shared with the breadth-first and A* mazes), then Step or Run. Compare the path length with breadth-first search.',
 init:SS_mazeInit,ui:SS_mazeUI,on:SS_mazeOn,
 trace:s=>SS_mazeDFS(s),
 draw(s,f,X){
  const onStack=new Set(f.stack),dead=new Set(f.dead),top=f.stack[f.stack.length-1];let out=heading('Go deep; back up at dead ends');
  out+=SS_mazeDraw(X,s,c=>c===top&&!f.found?{fill:C.amberp,stroke:C.amber}:onStack.has(c)?{fill:C.pale,stroke:C.blue}:dead.has(c)?{fill:'#e3e8eb',label:'×',ink:C.muted}:null);
  if(f.stack.length>1)out+=SS_pathLine(f.stack).replace(C.coral,f.found?C.coral:C.blue);
  const st=SS_mazeStats(s);
  out+=counter(420,70,'Stack depth',f.stack.length,C.blue,150)+counter(420,128,'Dead ends backed out',f.dead.length,C.muted,150);
  out+=counter(420,186,'Squares visited',f.seen,C.amber,150)+counter(420,244,'Breadth-first path',st.bfs===null?'none':st.bfs+' steps',C.coral,150);
  return {svg:out,phase:f.say};
 }});

/* Cycle detection in a directed graph: white / grey / black colouring. */
const SS_CYP={A:[70,110],B:[200,70],C:[330,110],D:[300,250],E:[110,270],F:[200,330]};
const SS_CYE0=[['A','B'],['B','C'],['C','D'],['D','B'],['A','E'],['E','F'],['F','D']];
function SS_cycleTrace(edges){const nb={};for(const k in SS_CYP)nb[k]=[];edges.forEach(([a,b])=>nb[a].push(b));
 const col={};for(const k in SS_CYP)col[k]='white';const fr=[],stack=[],snap=(extra)=>fr.push({col:{...col},stack:stack.slice(),...extra});
 snap({say:'All nodes start white (unvisited). Grey means “on the current path”; black means “finished”.'});
 let cycle=null;
 (function visitAll(){for(const s of Object.keys(SS_CYP)){if(col[s]!=='white')continue;
  (function go(u){if(cycle)return;col[u]='grey';stack.push(u);snap({cur:u,say:`Enter ${u}: colour it grey.`});
   for(const v of nb[u]){if(cycle)return;if(col[v]==='grey'){cycle=stack.slice(stack.indexOf(v)).concat(v);snap({cur:u,edge:[u,v],cycle,say:`Edge ${u} → ${v} leads to a grey node, one still on the current path: a cycle ${cycle.join(' → ')}.`});return}
    if(col[v]==='white'){snap({cur:u,edge:[u,v],say:`Follow ${u} → ${v}.`});go(v);if(cycle)return}}
   col[u]='black';stack.pop();snap({cur:u,say:`${u} has no more unexplored edges: colour it black and back up.`})})(s);if(cycle)return}})();
 if(!cycle)snap({done:true,say:'Every node is black and no edge ever pointed back to a grey node: there is no cycle.'});else fr[fr.length-1].done=true;
 return fr}
SCENE({id:'dfs-cycle-detection',name:'Detecting a cycle',tag:'Depth-first search finds loops',
 definition:'A directed graph has a cycle exactly when depth-first search finds an edge back to a node that is still on its current path (coloured grey).',
 example:'If task B needs C, C needs D and D needs B, no order can satisfy them all. Depth-first search spots the loop B → C → D → B.',
 desc:'A directed graph whose nodes turn grey while on the current path and black when finished; a back edge to a grey node is highlighted as a cycle.',
 dur:13,hint:'Press the small circle on any arrow to reverse its direction, then Step or Run. Can you remove every cycle?',
 init:()=>({edges:SS_CYE0.map(e=>e.slice())}),
 ui:[{b:'Original edges',act:'restore'}],
 on:{flip(s,i){i=Number(i);s.edges[i].reverse()},restore(s){s.edges=SS_CYE0.map(e=>e.slice())}},
 trace:s=>SS_cycleTrace(s.edges),
 draw(s,f,X){
  let out=heading('White: unvisited · grey: on the current path · black: finished');
  const inCycle=(a,b)=>f.cycle&&f.cycle.some((v,i)=>i<f.cycle.length-1&&v===a&&f.cycle[i+1]===b);
  s.edges.forEach(([a,b],i)=>{const A=SS_CYP[a],B=SS_CYP[b],cyc=inCycle(a,b),cur=f.edge&&f.edge[0]===a&&f.edge[1]===b,col=cyc?C.coral:cur?C.amber:C.line;
   out+=arrowR(A,B,24,26,col,cyc||cur?3.5:2.2);const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;out+=hit(X,'flip',i,`Edge ${a} to ${b}. Press to reverse it.`,Ci(mx,my,9,'#fff',col))});
  for(const k in SS_CYP){const [x,y]=SS_CYP[k],c=f.col[k],cur=k===f.cur;out+=Ci(x,y,24,c==='white'?'#fff':c==='grey'?'#b9c6ce':C.dark,cur?C.amber:C.ink,cur?'stroke-width="3.5"':'')+TB(x,y+6,k,17,c==='black'?'#fff':C.ink)}
  out+=TBF(450,80,'Current path (stack)',13,C.ink)+TMF(450,104,f.stack.join(' → ')||'(empty)',14,C.blue);
  out+=f.cycle?R(380,140,200,60,C.coralp,C.coral,10)+TBF(480,166,'Cycle found',15,C.coral)+TF(480,188,f.cycle.join(' → '),13,C.ink):f.done?R(380,140,200,46,C.greenp,C.green,10)+TBF(480,169,'No cycle',15,C.green):'';
  return {svg:out,phase:f.say};
 }});

/* Topological sort: dress in an order that respects every “before” arrow. */
const SS_TP={Pants:[80,80],Socks:[230,60],Shirt:[370,80],Belt:[120,190],Tie:[350,190],Shoes:[220,190],Jacket:[230,300]};
const SS_TE=[['Pants','Shoes',1],['Socks','Shoes',1],['Pants','Belt',1],['Shirt','Belt',1],['Shirt','Tie',1],['Tie','Jacket',1],['Belt','Jacket',1],['Shoes','Pants',0]];
function SS_topoTrace(edges){const on=edges.filter(e=>e[2]),nb={};for(const k in SS_TP)nb[k]=[];on.forEach(([a,b])=>nb[a].push(b));
 const col={};for(const k in SS_TP)col[k]=0;const order=[],fr=[{col:{...col},order:[],say:'Depth-first search from each task. A task is added to the front of the schedule only after everything that must come after it is done.'}];let bad=null;
 for(const s of Object.keys(SS_TP)){if(col[s])continue;(function go(u){if(bad)return;col[u]=1;fr.push({col:{...col},order:order.slice(),cur:u,say:`Visit ${u}.`});
  for(const v of nb[u]){if(bad)return;if(col[v]===1){bad=[u,v];fr.push({col:{...col},order:order.slice(),cur:u,bad,say:`${u} → ${v} points back to a task still in progress: the arrows form a cycle, so no schedule exists.`});return}if(!col[v])go(v)}
  col[u]=2;order.unshift(u);fr.push({col:{...col},order:order.slice(),cur:u,say:`${u} is finished: everything after it is scheduled, so put ${u} at the front.`})})(s);if(bad)break}
 if(!bad)fr.push({col:{...col},order:order.slice(),done:true,say:`A valid order: ${order.join(', ')}. Every arrow points forwards in this list.`});return fr}
SCENE({id:'dfs-topological-sort',name:'Topological sort',tag:'Order tasks that depend on each other',
 definition:'A topological order lists the nodes of a directed graph so that every arrow points forwards. Depth-first search produces one by listing each node when it finishes, in reverse.',
 example:'Getting dressed: pants before shoes, socks before shoes, shirt before tie, tie and belt before jacket. A topological sort gives a valid order.',
 desc:'Clothing tasks joined by “must come before” arrows; as depth-first search finishes each task it is added to the front of a schedule shown on the right.',
 dur:13,hint:'Press the circle on an arrow to switch that rule on or off (the dashed one creates a cycle), then Step or Run.',
 init:()=>({edges:SS_TE.map(e=>e.slice())}),
 on:{tog(s,i){i=Number(i);s.edges[i][2]=s.edges[i][2]?0:1}},
 trace:s=>SS_topoTrace(s.edges),
 draw(s,f,X){
  let out=heading('Every arrow means “do this first”');
  s.edges.forEach(([a,b,on],i)=>{const A=SS_TP[a],B=SS_TP[b],isBad=f.bad&&f.bad[0]===a&&f.bad[1]===b,col=isBad?C.coral:on?C.blue:C.line;
   if(on)out+=arrowR(A,B,26,30,col,isBad?3.5:2.2);else out+=L(A[0],A[1],B[0],B[1],C.line,1.5,'stroke-dasharray="4 5"');
   const mx=(A[0]+B[0])/2+(a==='Shoes'?16:0),my=(A[1]+B[1])/2+(a==='Shoes'?-16:0);out+=hit(X,'tog',i,`Rule ${a} before ${b}: ${on?'on':'off'}. Press to switch.`,Ci(mx,my,8,on?'#fff':'#eef2f4',col))});
  for(const k in SS_TP){const [x,y]=SS_TP[k],c=f.col[k],cur=k===f.cur;out+=R(x-44,y-17,88,34,c===2?C.greenp:c===1?C.amberp:'#fff',cur?C.ink:c===2?C.green:c===1?C.amber:C.line,17)+TBF(x,y+5,k,14,C.ink)}
  out+=TBF(510,58,'Schedule',14,C.ink);f.order.forEach((k,i)=>out+=R(450,70+i*38,120,30,C.greenp,C.green,8)+TF(510,90+i*38,`${i+1}. ${k}`,14,C.ink));
  if(f.bad)out+=R(440,330,140,36,C.coralp,C.coral,8)+TBF(510,353,'Cycle: no order',14,C.coral);
  return {svg:out,phase:f.say};
 }});

/* ---------- Dijkstra lesson ---------- */
const SS_NP={S:[80,200],A:[300,90],B:[300,310],T:[520,200]};
function SS_negTrace(w){const E=[['S','A',2],['S','B',5],['B','A',w],['A','T',1]];const d={S:0,A:Infinity,B:Infinity,T:Infinity},settled=[],fr=[{d:{...d},settled:[],say:'Dijkstra’s rule: settle the closest unsettled node, then never change it again.'}];
 while(settled.length<4){const u=Object.keys(d).filter(k=>!settled.includes(k)).sort((a,b)=>d[a]-d[b])[0];if(d[u]===Infinity)break;settled.push(u);
  const ups=[];for(const [a,b,ww] of E)if(a===u&&!settled.includes(b)&&d[u]+ww<d[b]){d[b]=d[u]+ww;ups.push(b)}
  fr.push({d:{...d},settled:settled.slice(),cur:u,say:`Settle ${u} at ${d[u]}.`+(ups.length?` Update ${ups.join(', ')}.`:'')+(u==='B'&&w<0?` The edge B → A (${w}) would give A ${d.B+w}, but A is already settled.`:'')})}
 const t={S:0,A:Infinity,B:Infinity,T:Infinity};for(let i=0;i<4;i++)for(const [a,b,ww] of E)if(t[a]+ww<t[b])t[b]=t[a]+ww;
 const wrong=['A','T'].filter(k=>t[k]!==d[k]);fr.push({d:{...d},settled:settled.slice(),truth:t,done:true,wrong,say:wrong.length?`Wrong answers for ${wrong.join(' and ')}: the true shortest route goes S → B → A at ${t.A}. A negative edge made a node cheaper after it was settled.`:'With no negative edge, Dijkstra’s answers match the true shortest distances.'});return fr}
SCENE({id:'dijkstra-negative',name:'Why negative edges break Dijkstra',tag:'Settled too soon',
 definition:'Dijkstra’s algorithm assumes that adding an edge never makes a path shorter. With a negative edge, a node it has already settled can later be reached more cheaply, and the answer is wrong.',
 example:'S → A costs 2, S → B costs 5, B → A costs −4. Dijkstra settles A at 2, but S → B → A costs only 1. The Bellman–Ford algorithm handles negative edges correctly, more slowly.',
 desc:'Four nodes with directed edges; Dijkstra settles nodes one by one and the final table compares its distances with the true shortest distances.',
 dur:11,hint:'Slide the weight of the edge B → A from −6 to 4, then Step. Dijkstra is only wrong when the weight is negative enough.',
 init:()=>({w:-4}),
 ui:[{range:'w',label:'B → A weight',min:-6,max:4,get:s=>s.w,act:'w'}],
 on:{w(s,v){s.w=v}},
 trace:s=>SS_negTrace(s.w),
 draw(s,f,X){
  const E=[['S','A',2],['S','B',5],['B','A',s.w],['A','T',1]];let out=heading('Dijkstra settles each node once');
  E.forEach(([a,b,w])=>{const A=SS_NP[a],B=SS_NP[b],neg=w<0;out+=arrowR(A,B,28,30,neg?C.coral:C.line,neg?3:2.2);const mx=(A[0]+B[0])/2+(a==='B'?22:0),my=(A[1]+B[1])/2;out+=R(mx-18,my-13,36,24,'#fff',neg?C.coral:C.line,6)+TB(mx,my+5,w,14,neg?C.coral:C.ink)});
  for(const k in SS_NP){const [x,y]=SS_NP[k],st=f.settled.includes(k),cur=k===f.cur,bad=f.wrong&&f.wrong.includes(k);out+=Ci(x,y,28,st?C.blue:'#fff',bad?C.coral:cur?C.amber:C.blue,bad||cur?'stroke-width="3.5"':'')+TB(x,y+6,k,18,st?'#fff':C.ink)+SS_badge(k==='A'||k==='B'?x-34:x,y+(k==='A'?-36:48),'d = '+(f.d[k]===Infinity?'∞':f.d[k]),C.blue)}
  if(f.done){out+=TBF(470,300,'Dijkstra',13,C.blue)+TBF(545,300,'True',13,C.green);['A','T'].forEach((k,i)=>{const y=324+i*24;out+=TBF(420,y,k,14,C.ink)+TF(470,y,f.d[k],14,f.wrong.includes(k)?C.coral:C.blue)+TF(545,y,f.truth[k],14,C.green)})}
  return {svg:out,phase:f.say};
 }});

SCENE({id:'a-star-search',name:'A* search',tag:'Dijkstra with a sense of direction',
 definition:'A* expands the cell with the smallest g + h, where g is the distance travelled so far and h is an estimate of the distance still to go. A good estimate steers the search towards the goal.',
 example:'On a grid, h can be the number of steps ignoring walls (the Manhattan distance). Satnavs and game characters use A* because it explores far fewer places than Dijkstra.',
 desc:'The shared grid maze searched either by Dijkstra or by A*; expanded cells are shaded, the open set is outlined, and the counter shows how many cells each needed.',
 dur:14,hint:'Choose Dijkstra or A*, edit walls, then Step or Run. Compare the “cells expanded” counter.',shared:'grid-maze',
 init:SS_mazeInit,ui:[{choose:[['astar','A* (g + h)'],['dijkstra','Dijkstra (g only)']],label:'Method',get:s=>s.mode,act:'mode'},...SS_mazeUI],on:SS_mazeOn,
 trace:s=>SS_mazeAstar(s,s.mode),
 draw(s,f,X){
  const closed=new Set(f.closed),open=new Set(f.open),hh=c=>Math.abs(Math.floor(c/SS_MW)-(SS_MH-1))+Math.abs(c%SS_MW-(SS_MW-1));
  let out=heading(s.mode==='astar'?'A*: expand the smallest steps + estimate':'Dijkstra: expand the smallest steps so far');
  out+=SS_mazeDraw(X,s,c=>c===f.cur?{fill:C.amberp,stroke:C.amber,label:f.g[c]}:closed.has(c)?{fill:C.pale,label:f.g[c],ink:C.blue}:open.has(c)?{fill:'#fff',stroke:C.purple,label:s.mode==='astar'?f.g[c]+hh(c):f.g[c],ink:C.purple}:null);
  if(f.done)out+=SS_pathLine(f.path);
  const other=SS_mazeAstar(s,s.mode==='astar'?'dijkstra':'astar'),oc=other[other.length-1].closed.length;
  out+=counter(420,70,'Cells expanded',f.closed.length,C.blue,150)+counter(420,128,'Open set',f.open.length,C.purple,150);
  out+=counter(420,186,(s.mode==='astar'?'Dijkstra':'A*')+' expands',oc,C.muted,150);
  out+=TF(495,268,'Purple numbers on the',13,C.muted)+TF(495,286,s.mode==='astar'?'open set are g + h.':'open set are g.',13,C.muted);
  return {svg:out,phase:f.say};
 }});

/* Priority queue as a binary heap: the cheapest item is always at the top. */
function SS_heapOp(base,op){const h=base.slice(),fr=[];
 if(!op){fr.push({h:h.slice(),say:'A binary heap: every parent is smaller than its children, so the smallest item is always at the top.'});return fr}
 if(op.type==='insert'){h.push(op.val);let i=h.length-1;fr.push({h:h.slice(),hl:[i],say:`Insert ${op.val} at the next free place at the bottom.`});
  while(i>0){const p=(i-1)>>1;if(h[p]<=h[i]){fr.push({h:h.slice(),hl:[i],say:`${h[p]} ≤ ${h[i]}: the parent is smaller, so ${op.val} stops here.`});break}[h[p],h[i]]=[h[i],h[p]];fr.push({h:h.slice(),hl:[p],sw:[p,i],say:`${h[i]} > ${h[p]}: swap with the parent (sift up).`});i=p}
  if(i===0)fr.push({h:h.slice(),hl:[0],say:`${op.val} is the new smallest item.`})}
 else{if(!h.length){fr.push({h:[],say:'The heap is empty.'});return fr}const top=h[0];fr.push({h:h.slice(),hl:[0],say:`Take the smallest item, ${top}, from the top.`});const last=h.pop();
  if(h.length){h[0]=last;let i=0;fr.push({h:h.slice(),hl:[0],say:`Move the last item, ${last}, to the top.`});
   for(;;){const l=2*i+1,r=l+1;let m=i;if(l<h.length&&h[l]<h[m])m=l;if(r<h.length&&h[r]<h[m])m=r;if(m===i){fr.push({h:h.slice(),hl:[i],say:`${h[i]} is smaller than its children: the heap is repaired.`});break}[h[i],h[m]]=[h[m],h[i]];fr.push({h:h.slice(),hl:[m],sw:[i,m],say:`Swap with the smaller child (sift down).`});i=m}}
  else fr.push({h:[],say:'The heap is now empty.'})}
 return fr}
SCENE({id:'dijkstra-priority-queue',name:'Priority queue',tag:'Always hand out the smallest',
 definition:'A priority queue gives back items in order of priority, smallest first. A binary heap does it with about log₂ n swaps per insert or removal, instead of sorting everything each time.',
 example:'Dijkstra’s algorithm keeps unsettled nodes in a priority queue keyed by distance, so “the closest unsettled node” is always at the top.',
 desc:'A binary heap drawn as a tree with its array underneath; a new item sifts up or the top is removed and the replacement sifts down.',
 dur:10,hint:'Insert the next value or take out the smallest, then Step through the sift.',
 init:()=>({heap:[2,4,3,8,5,7,6],base:[3,4,6,8,5,7],op:{type:'insert',val:2},next:9}),
 ui:[{b:'Insert next value',act:'ins'},{b:'Extract smallest',act:'ext'}],
 on:{ins(s){if(s.heap.length>=15)return 'keep';const r=rng(s.next*7919);const v=1+Math.floor(r()*20);s.next++;s.base=s.heap.slice();s.op={type:'insert',val:v};s.heap=SS_heapOp(s.base,s.op).pop().h;return 'run'},
  ext(s){s.base=s.heap.slice();s.op={type:'extract'};s.heap=SS_heapOp(s.base,s.op).pop().h;return 'run'}},
 trace:s=>SS_heapOp(s.base,s.op),
 draw(s,f,X){
  const h=f.h,pos=i=>{const d=Math.floor(Math.log2(i+1)),j=i-(2**d-1),cnt=2**d;return [40+(j+.5)*520/cnt,70+d*62]};let out=heading('Binary heap: each parent ≤ its children');
  h.forEach((v,i)=>{if(i>0){const [x1,y1]=pos((i-1)>>1),[x2,y2]=pos(i);out+=L(x1,y1,x2,y2,C.line,2)}});
  h.forEach((v,i)=>{const [x,y]=pos(i),hl=f.hl&&f.hl.includes(i),sw=f.sw&&f.sw.includes(i);out+=Ci(x,y,20,hl?C.amberp:i===0?C.greenp:'#fff',hl?C.amber:sw?C.coral:i===0?C.green:C.blue)+TB(x,y+6,v,15,C.ink)});
  const w=Math.min(36,540/Math.max(1,h.length));h.forEach((v,i)=>{const x=300-h.length*w/2+i*w,hl=f.hl&&f.hl.includes(i);out+=R(x,286,w-2,32,hl?C.amberp:'#fff',hl?C.amber:C.grid,4)+TBF(x+w/2-1,307,v,13,C.ink)+TF(x+w/2-1,334,i,13,C.muted)});
  out+=TF(300,360,'Array: children of position i sit at 2i + 1 and 2i + 2',13,C.muted);
  return {svg:out,phase:f.say};
 }});

/* ---------- Bubble sort lesson ---------- */
function SS_input(kind,n,seed=5){const a=range(n).map(i=>i+1);if(kind==='reversed')return a.reverse();if(kind==='nearly'){[a[0],a[1]]=[a[1],a[0]];[a[n-2],a[n-1]]=[a[n-1],a[n-2]];return a}if(kind==='shuffled')return shuffled(a,seed);return a}
SCENE({id:'bubble-best-case',name:'Stopping when nothing swaps',tag:'Bubble sort’s best case',
 definition:'If a whole pass of bubble sort makes no swaps, the list is sorted and the algorithm can stop. Already-sorted input then costs one pass: n − 1 comparisons instead of about n²/2.',
 example:'Sorted input finishes after a single pass. Reversed input is the worst case: every comparison swaps, and every one of the n − 1 passes is needed.',
 desc:'A table with one row per pass of bubble sort; swapped cells are highlighted and the table ends as soon as a pass makes no swaps.',
 dur:11,hint:'Choose an input and a size, then Step one pass at a time.',
 init:()=>({kind:'nearly',n:8}),
 ui:[{choose:[['sorted','Sorted'],['nearly','Nearly sorted'],['shuffled','Shuffled'],['reversed','Reversed']],label:'Input',get:s=>s.kind,act:'kind'},{range:'n',label:'n',min:4,max:10,get:s=>s.n,act:'n'}],
 on:{kind(s,v){s.kind=v},n(s,v){s.n=v}},
 trace(s){const a=SS_input(s.kind,s.n),n=a.length,rows=[{a:a.slice(),sw:[],pass:0}];let c=0;const fr=[{rows:rows.slice(),c,say:'Each row shows the list after one full pass.'}];
  for(let p=0;p<n-1;p++){const sw=[];let cnt=0;for(let j=0;j<n-1-p;j++){c++;if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];sw.push(j,j+1);cnt++}}
   rows.push({a:a.slice(),sw:[...new Set(sw)],pass:p+1,fixed:n-1-p});
   if(!sw.length){fr.push({rows:rows.slice(),c,done:true,early:true,say:`Pass ${p+1} made no swaps, so stop: ${p+1} pass${p?'es':''} and ${c} comparisons. Without the check it would take ${n-1} passes and ${n*(n-1)/2} comparisons.`});return fr}
   fr.push({rows:rows.slice(),c,say:`Pass ${p+1}: ${cnt} swap${cnt===1?'':'s'}; ${a[n-1-p]} is now fixed in its final place.`})}
  fr[fr.length-1].done=true;fr[fr.length-1].say=`Needed all ${n-1} passes and ${c} comparisons: the worst case for this size.`;return fr},
 draw(s,f,X){
  const n=s.n,w=32,rh=29,x0=70;let out=heading('One row per pass; stop after a pass with no swaps');
  f.rows.forEach((r,i)=>{const y=50+i*rh;out+=TF(x0-12,y+19,i===0?'start':'pass '+r.pass,13,C.muted,'end');
   r.a.forEach((v,j)=>{const sw=r.sw.includes(j),fixed=r.fixed!==undefined&&j>=r.fixed;out+=R(x0+j*w,y,w-3,rh-4,sw?C.coralp:fixed?C.greenp:'#fff',sw?C.coral:fixed?C.green:C.grid,4)+TBF(x0+j*w+(w-3)/2,y+18,v,13,C.ink)})});
  const used=f.rows.length-1;out+=counter(440,60,'Passes',used,C.blue,140)+counter(440,118,'Comparisons',f.c,C.blue,140)+counter(440,176,'Without early stop',n*(n-1)/2,C.muted,140);
  if(f.early)out+=R(430,240,160,50,C.greenp,C.green,10)+TBF(510,262,'No swaps:',14,C.green)+TBF(510,280,'sorted, stop',14,C.green);
  return {svg:out,phase:f.say};
 }});

const SS_STAB=[[3,'a'],[1,'b'],[2,'c'],[3,'d'],[1,'e'],[2,'f'],[3,'g']];
const SS_LCOL={a:C.blue,b:C.green,c:C.purple,d:C.coral,e:C.amber,f:'#2f6f8f',g:'#8a4f7d'};
SCENE({id:'bubble-stability',name:'Stable sorting',tag:'Equal items keep their order',
 definition:'A sort is stable if items with equal keys stay in the order they started in. Bubble and insertion sort are stable; selection sort and quick sort usually are not.',
 example:'Sort a class list by grade, having already sorted it by name: a stable sort keeps the names in alphabetical order within each grade.',
 desc:'Cards with a number and a letter are sorted by number; at the end, ticks or crosses show whether cards with equal numbers kept their letter order.',
 dur:12,hint:'Choose a stable or unstable algorithm, shuffle the cards, then Step or Run. Watch the letters within each number.',
 init:()=>({alg:'selection',a:SS_STAB.map(x=>x.slice())}),
 ui:[{choose:[['insertion','Insertion (stable)'],['selection','Selection (unstable)']],label:'Algorithm',get:s=>s.alg,act:'alg'},{b:'Shuffle cards',act:'shuffle'}],
 on:{alg(s,v){s.alg=v},shuffle(s){s.a=shuffled(SS_STAB.map(x=>x.slice()),nextSeed())}},
 trace(s){const a=s.a.map(x=>x.slice()),n=a.length,fr=[{a:a.map(x=>x.slice()),say:'Sort by the number only. The letters show the original order of equal numbers.'}];
  if(s.alg==='insertion'){for(let i=1;i<n;i++){let j=i;while(j>0&&a[j-1][0]>a[j][0]){[a[j-1],a[j]]=[a[j],a[j-1]];fr.push({a:a.map(x=>x.slice()),sw:[j-1,j],say:`${a[j][0]}${a[j][1]} > ${a[j-1][0]}${a[j-1][1]}: swap neighbours. Equal numbers are never swapped past each other.`});j--}}}
  else{for(let i=0;i<n-1;i++){let m=i;for(let j=i+1;j<n;j++)if(a[j][0]<a[m][0])m=j;if(m!==i){const far=m-i>1;[a[i],a[m]]=[a[m],a[i]];fr.push({a:a.map(x=>x.slice()),sw:[i,m],say:`Swap the smallest remaining, ${a[i][0]}${a[i][1]}, into place ${i+1}.`+(far?` This long-distance swap can jump ${a[m][0]}${a[m][1]} over an equal card.`:'')})}}}
  fr.push({a:a.map(x=>x.slice()),done:true,say:''});const last=fr[fr.length-1];const ok=[1,2,3].map(v=>{const ls=last.a.filter(x=>x[0]===v).map(x=>x[1]).join(''),orig=s.a.filter(x=>x[0]===v).map(x=>x[1]).join('');return ls===orig});
  last.ok=ok;last.say=ok.every(Boolean)?'Every group of equal numbers kept its original letter order: stable on this input.':`Group${ok.filter(x=>!x).length>1?'s':''} ${[1,2,3].filter((v,i)=>!ok[i]).join(' and ')} changed letter order: not stable.`;return fr},
 draw(s,f,X){
  const n=f.a.length,w=62,step=72,x0=300-(n*step-10)/2;let out=heading('Sorted by number; are equal numbers still in letter order?');
  const orig=(y)=>{s.a.forEach(([v,l],i)=>{out+=R(x0+i*step,y,w,46,'#fff',C.grid,8)+TB(x0+i*step+w/2-8,y+30,v,18,C.ink)+TB(x0+i*step+w/2+12,y+30,l,15,SS_LCOL[l])})};
  out+=TF(x0,68,'Start',13,C.muted,'start');orig(76);
  out+=TF(x0,160,f.done?'Sorted':'Now',13,C.muted,'start');
  f.a.forEach(([v,l],i)=>{const sw=f.sw&&f.sw.includes(i);out+=R(x0+i*step,168,w,64,sw?C.amberp:'#fff',sw?C.amber:SS_LCOL[l],8)+TB(x0+i*step+w/2-8,207,v,24,C.ink)+TB(x0+i*step+w/2+14,207,l,17,SS_LCOL[l])});
  if(f.done)[1,2,3].forEach((v,i)=>{const x=110+i*150;out+=R(x,270,120,50,f.ok[i]?C.greenp:C.coralp,f.ok[i]?C.green:C.coral,9)+TBF(x+60,292,`${v}s: ${f.a.filter(c=>c[0]===v).map(c=>c[1]).join(' ')}`,14,C.ink)+TBF(x+60,311,f.ok[i]?'order kept ✓':'order changed ✗',13,f.ok[i]?C.green:C.coral)});
  return {svg:out,phase:f.say};
 }});

/* ---------- Insertion sort lesson ---------- */
SCENE({id:'insertion-nearly-sorted',name:'Fast on nearly sorted data',tag:'Work grows with the disorder',
 definition:'Insertion sort makes about n + I comparisons, where I counts the pairs that are in the wrong order (inversions). On nearly sorted data I is small, so it is very fast.',
 example:'A list of 12 with two neighbours swapped has one inversion: insertion sort needs about 12 comparisons, fewer than merge sort’s 30 or so.',
 desc:'A row of bars getting more and more out of order, beside bars comparing insertion sort’s and merge sort’s comparison counts as the number of inversions grows.',
 dur:10,hint:'Slide the amount of disorder. Each step of disorder swaps two random neighbours.',
 init:()=>({k:2,seed:3}),
 watch(p){return {k:Math.round(smooth(p)*30),seed:3}},
 ui:[{range:'k',label:'Disorder (neighbour swaps)',min:0,max:40,get:s=>s.k,act:'k'},{b:'Different swaps',act:'seed'}],
 on:{k(s,v){s.k=v},seed(s){s.seed=nextSeed()}},
 draw(s,f,X){
  const n=12,a=range(n).map(i=>i+1),r=rng(s.seed);for(let i=0;i<s.k;i++){const j=Math.floor(r()*(n-1));[a[j],a[j+1]]=[a[j+1],a[j]]}
  let inv=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(a[i]>a[j])inv++;
  const ins=SS_insertion(a),insC=ins[ins.length-1].c,mer=SS_merge(a),merC=mer[mer.length-1].c,worst=n*(n-1)/2;
  let out=heading(`${inv} inversion${inv===1?'':'s'} (pairs in the wrong order)`);
  a.forEach((v,i)=>{const bad=(i>0&&a[i-1]>v)||(i<n-1&&v>a[i+1]);out+=R(40+i*42,250-v*14,34,v*14,bad?C.coral:'#9ab5c7','none',4)+TF(57+i*42,268,v,13,C.muted)});
  const bars=[['Insertion sort',insC,C.blue],['Merge sort',merC,C.purple],['Worst case n(n−1)/2',worst,C.muted]];
  bars.forEach(([nm,v,col],i)=>{const y=296+i*26;out+=TF(40,y+13,nm,13,C.ink,'start')+R(190,y,Math.max(3,v/worst*300),16,col,'none',4)+TBF(200+v/worst*300,y+13,v,13,col,'start')});
  return {svg:out,phase:`${inv} inversion${inv===1?'':'s'}: insertion sort needs ${insC} comparisons (about n + inversions = ${n-1+inv}), merge sort ${merC}. ${insC<merC?'Insertion sort wins on nearly sorted data.':'With this much disorder, merge sort wins.'}`};
 }});

SCENE({id:'insertion-shifting',name:'Shifting, not swapping',tag:'Hold the card, slide the rest',
 definition:'Insertion sort can lift the new item out, slide each larger item one place right, then drop the item into the gap. Each slide is one write, where a swap needs three.',
 example:'Sorting a hand of playing cards: you pull out the new card and push the bigger cards along, rather than swapping it past each one.',
 desc:'A sorted hand of cards with a new card held above; larger cards slide right one by one and the held card drops into the gap.',
 dur:10,hint:'Choose the value of the new card, then Step. Compare writes with shifting against writes with swapping.',
 init:()=>({v:5}),
 ui:[{range:'v',label:'New card',min:1,max:13,get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=v}},
 trace(s){const hand=[2,4,6,7,9,11,12],v=s.v,fr=[{hand:hand.slice(),gap:hand.length,held:true,c:0,w:0,say:`Lift the new card, ${v}, out of the line. Its old place at the end becomes a gap.`}];let g=hand.length,c=0,w=0;const h=hand.concat([null]);
  while(g>0){c++;if(h[g-1]>v){h[g]=h[g-1];h[g-1]=null;w++;g--;fr.push({hand:h.slice(),gap:g,held:true,c,w,say:`${h[g+1]} > ${v}: slide ${h[g+1]} one place right (one write).`})}else{fr.push({hand:h.slice(),gap:g,held:true,c,w,say:`${h[g-1]} ≤ ${v}: stop. The gap is where ${v} belongs.`});break}}
  h[g]=v;w++;fr.push({hand:h.slice(),gap:-1,held:false,c,w,done:true,ins:g,say:`Drop ${v} into the gap: ${w} writes. Swapping it left one place at a time would have taken ${3*(w-1)} writes.`});return fr},
 draw(s,f,X){
  const n=f.hand.length,w=58,step=66,x0=300-(n*step-8)/2;let out=heading('Slide the bigger cards right, then drop the new card in');
  f.hand.forEach((v,i)=>{const x=x0+i*step;if(v===null){out+=R(x,170,w,82,'none',C.amber,8,'stroke-dasharray="5 4"');return}
   const ins=f.done&&i===f.ins;out+=R(x,170,w,82,ins?C.greenp:'#fff',ins?C.green:C.blue,8)+TB(x+w/2,220,v,26,C.ink)});
  if(f.held){const x=x0+f.gap*step;out+=R(x,60,w,82,C.amberp,C.amber,8)+TB(x+w/2,110,s.v,26,C.ink)+arrow(x+w/2,146,x+w/2,164,C.amber,2.5)}
  out+=counter(110,286,'Comparisons',f.c,C.blue,120)+counter(240,286,'Writes (shifting)',f.w,C.green,120)+counter(370,286,'Writes if swapping',Math.max(0,3*(f.w-(f.done?1:0))),C.coral,120);
  return {svg:out,phase:f.say};
 }});

/* ---------- Merge sort lesson ---------- */
SCENE({id:'merge-step',name:'Merging two sorted piles',tag:'The heart of merge sort',
 definition:'To merge two sorted piles, compare the two front items, take the smaller, and repeat. When one pile runs out, copy the rest of the other. It needs at most n − 1 comparisons.',
 example:'Merging 2 5 9 12 with 1 6 7 14: take 1, then 2, 5, 6, 7, 9, 12, 14. Seven comparisons for eight cards.',
 desc:'Two sorted rows of cards with their front cards highlighted; the smaller front card moves into the output row until both rows are empty.',
 dur:11,hint:'Make new piles or try one where every left card is smaller, then Step. Count the comparisons.',
 init:()=>({L:[2,5,9,12],R:[1,6,7,14]}),
 ui:[{b:'New piles',act:'renew'},{b:'Left all smaller',act:'apart'}],
 on:{renew(s){const r=rng(nextSeed()),pool=shuffled(range(20).map(i=>i+1),Math.floor(r()*1e6)).slice(0,8);s.L=pool.slice(0,4).sort((a,b)=>a-b);s.R=pool.slice(4).sort((a,b)=>a-b)},apart(s){s.L=[1,3,4,6];s.R=[8,10,13,15]}},
 trace(s){let i=0,j=0,c=0;const out=[],fr=[{i,j,out:[],c,say:'Both piles are sorted, so the smallest card overall is one of the two front cards.'}];
  while(i<s.L.length&&j<s.R.length){c++;const l=s.L[i],r=s.R[j];if(l<=r){out.push(['L',l]);i++}else{out.push(['R',r]);j++}fr.push({i,j,out:out.slice(),c,cmp:[l,r],say:`Compare ${l} and ${r}: take ${Math.min(l,r)}.`})}
  const rest=i<s.L.length?'left':'right';while(i<s.L.length)out.push(['L',s.L[i++]]);while(j<s.R.length)out.push(['R',s.R[j++]]);
  fr.push({i,j,out:out.slice(),c,done:true,say:`The ${rest==='left'?'right':'left'} pile is empty: copy the rest of the ${rest} pile with no more comparisons. ${c} comparison${c===1?'':'s'} for ${out.length} cards.`});return fr},
 draw(s,f,X){
  const w=54,step=62;let out=heading('Take the smaller front card each time');
  const pile=(arr,used,y,label,col)=>{out+=TBF(80,y+34,label,15,col,'end');arr.forEach((v,k)=>{const gone=k<used,front=k===used&&!f.done;if(gone)return;const x=90+(k-used)*step;out+=R(x,y,w,56,front?C.amberp:'#fff',front?C.amber:col,8)+TB(x+w/2,y+36,v,20,C.ink)})};
  pile(s.L,f.i,60,'Left',C.blue);pile(s.R,f.j,140,'Right',C.purple);
  out+=TBF(80,262,'Merged',15,C.green,'end');f.out.forEach(([side,v],k)=>{const x=90+k*step;out+=R(x,228,w,56,C.greenp,side==='L'?C.blue:C.purple,8)+TB(x+w/2,264,v,20,C.ink)});
  out+=counter(470,60,'Comparisons',f.c,C.blue,110)+counter(470,120,'At most n − 1',s.L.length+s.R.length-1,C.muted,110);
  out+=T(300,330,'Blue edge: came from the left pile · purple: from the right',14,C.muted);
  return {svg:out,phase:f.say};
 }});

SCENE({id:'merge-sort-tree',name:'The merge sort recursion tree',tag:'n work on each of log₂ n levels',
 definition:'Merge sort splits the list in half log₂ n times. On every level of splitting, the merges together handle all n items, so the total work is about n × log₂ n.',
 example:'For 16 items there are 4 levels of merging, each touching 16 items: about 64 steps. Sorting 16 by comparing every pair would take 120.',
 desc:'A tree of boxes: the whole list at the top, halved on each row down to single items, with the work on each row adding up to n.',
 dur:10,hint:'Choose n. Every row still adds up to n; only the number of rows grows, by one each time n doubles.',
 init:()=>({n:16}),
 watch(p){return {n:16,reveal:p}},
 ui:[{choose:[['4','4'],['8','8'],['16','16'],['32','32']],label:'n',get:s=>String(s.n),act:'n'}],
 on:{n(s,v){s.n=Number(v)}},
 draw(s,f,X){
  const n=s.n,levels=Math.log2(n),rows=levels+1,shown=s.reveal===undefined?rows:Math.max(1,Math.ceil(clamp(s.reveal*1.4,0,1)*rows)),rh=Math.min(56,250/rows),W=440,x0=30;
  let out=heading(`n = ${n}: ${levels} level${levels===1?'':'s'} of merging`);
  for(let d=0;d<shown;d++){const cnt=2**d,bw=W/cnt,y=52+d*rh;
   for(let k=0;k<cnt;k++){out+=R(x0+k*bw+1.5,y,bw-3,rh-10,d===rows-1?C.greenp:C.pale,d===rows-1?C.green:C.blue,Math.min(6,bw/4));if(bw>30)out+=TF(x0+k*bw+bw/2,y+(rh-10)/2+5,n/cnt,13,C.ink)}
   out+=TF(x0+W+14,y+(rh-10)/2+5,`${cnt} × ${n/cnt} = ${n}`,13,C.blue,'start')}
  const ty=Math.min(340,52+rows*rh+24);out+=TB(300,ty,`Total ≈ n × log₂ n = ${n} × ${levels} = ${n*levels}`,16,C.ink);
  out+=T(300,Math.min(366,ty+24),`Comparing every pair: n(n − 1)/2 = ${n*(n-1)/2}`,14,C.muted);
  return {svg:out,phase:`Each row of the tree is one level of merging, and every row handles all ${n} items. There are log₂ ${n} = ${levels} merging levels, so merge sort costs about ${n*levels} steps: O(n log n).`};
 }});

/* ---------- Quick sort lesson ---------- */
function SS_qsTree(a0,rule){const a=a0.slice(),segs=[];let c=0;
 (function qs(lo,hi,d){if(lo>hi)return;segs.push([lo,hi,d]);if(lo===hi)return;
  let pi=hi;if(rule==='middle')pi=(lo+hi)>>1;else if(rule==='median'){const m=(lo+hi)>>1,cand=[[a[lo],lo],[a[m],m],[a[hi],hi]].sort((x,y)=>x[0]-y[0]);pi=cand[1][1]}
  [a[pi],a[hi]]=[a[hi],a[pi]];const pv=a[hi];let i=lo;for(let j=lo;j<hi;j++){c++;if(a[j]<pv){[a[i],a[j]]=[a[j],a[i]];i++}}[a[i],a[hi]]=[a[hi],a[i]];
  qs(lo,i-1,d+1);qs(i+1,hi,d+1)})(0,a.length-1,0);
 return {segs,c,depth:Math.max(...segs.map(x=>x[2]))+1}}
SCENE({id:'quick-pivot-choice',name:'Choosing the pivot',tag:'A bad pivot makes quick sort slow',
 definition:'Quick sort is fast when each pivot splits its part roughly in half. Always picking the last item is a disaster on sorted input: every split is lopsided and the work grows like n².',
 example:'On 16 sorted numbers with “last item” pivots, the recursion goes 16 levels deep and needs 120 comparisons. Picking the median of three items brings it down to about 4 levels.',
 desc:'Rows of bars showing how each level of quick sort’s recursion splits the list; a balanced pivot gives few short rows, a bad pivot a long staircase.',
 dur:11,hint:'Choose a pivot rule and an input. Compare the depth and the comparison counts.',
 init:()=>({rule:'last',kind:'sorted'}),
 watch(p){return p<.5?{rule:'last',kind:'sorted'}:{rule:'median',kind:'sorted'}},
 ui:[{choose:[['last','Last item'],['middle','Middle item'],['median','Median of three']],label:'Pivot',get:s=>s.rule,act:'rule'},{choose:[['sorted','Sorted'],['shuffled','Shuffled'],['reversed','Reversed']],label:'Input',get:s=>s.kind,act:'kind'}],
 on:{rule(s,v){s.rule=v},kind(s,v){s.kind=v}},
 draw(s,f,X){
  const n=16,a=SS_input(s.kind,n,11),t=SS_qsTree(a,s.rule),rh=Math.min(17,250/t.depth),W=24,x0=30;
  let out=heading(`Recursion depth ${t.depth}, ${t.c} comparisons`);
  t.segs.forEach(([lo,hi,d])=>{const y=50+d*rh;out+=R(x0+lo*W+1,y,(hi-lo+1)*W-2,rh-3,hi===lo?C.greenp:C.pale,hi===lo?C.green:C.blue,3)});
  out+=TF(x0,330,'Each row: the parts still being sorted at that depth',13,C.muted,'start');
  out+=counter(440,60,'Depth',t.depth,t.depth>8?C.coral:C.green,140)+counter(440,118,'Comparisons',t.c,C.blue,140);
  out+=counter(440,176,'n log₂ n',n*4,C.muted,140)+counter(440,234,'n(n − 1)/2',n*(n-1)/2,C.muted,140);
  return {svg:out,phase:t.depth>8?`Lopsided splits: each pivot peels off only one item, so there are ${t.depth} levels and ${t.c} comparisons, close to n²/2.`:`Balanced splits: about log₂ ${n} = 4 levels are needed. ${t.c} comparisons, close to n log₂ n.`};
 }});

function SS_partTrace(a0,scheme){const a=a0.slice(),n=a.length,fr=[];let c=0,sw=0;
 if(scheme==='lomuto'){const pv=a[n-1];let i=0;fr.push({a:a.slice(),i,j:0,pv:n-1,c,sw,say:`Lomuto: pivot ${pv} is the last item. i marks the end of the “smaller” zone.`});
  for(let j=0;j<n-1;j++){c++;const v=a[j],small=v<pv;if(small){if(i!==j){[a[i],a[j]]=[a[j],a[i]];sw++}i++}fr.push({a:a.slice(),i,j,pv:n-1,c,sw,say:small?`${v} < ${pv}: move it into the “smaller” zone.`:`${v} ≥ ${pv}: leave it where it is.`})}
  [a[i],a[n-1]]=[a[n-1],a[i]];sw++;fr.push({a:a.slice(),i,j:null,pv:i,c,sw,done:true,say:`Put the pivot at position ${i+1}: ${c} comparisons, ${sw} swaps.`});return fr}
 const pv=a[0];let i=-1,j=n;fr.push({a:a.slice(),i:0,j:n-1,pv:0,c,sw,say:`Hoare: pivot ${pv} is the first item. Pointers start at both ends and move towards each other.`});
 for(;;){do{i++;c++}while(a[i]<pv);do{j--;c++}while(a[j]>pv);if(i>=j){fr.push({a:a.slice(),i,j,c,sw,done:true,split:j,say:`The pointers have crossed. Everything up to position ${j+1} is ≤ ${pv}; the rest is ≥ ${pv}. ${c} comparisons, ${sw} swaps.`});return fr}
  [a[i],a[j]]=[a[j],a[i]];sw++;fr.push({a:a.slice(),i,j,c,sw,say:`Left pointer stopped at ${a[j]} (≥ pivot), right at ${a[i]} (≤ pivot): swap them.`})}}
SCENE({id:'quick-partition-schemes',name:'Two ways to partition',tag:'Lomuto and Hoare',
 definition:'Partitioning splits a list around a pivot. Lomuto’s scheme scans left to right with one boundary; Hoare’s moves two pointers inwards from both ends and swaps pairs that are on the wrong side.',
 example:'Hoare’s scheme usually does about three times fewer swaps, because it only swaps when both pointers have found an item on the wrong side.',
 desc:'Ten bars being partitioned around a pivot by either one scanning pointer or two pointers moving inwards, with counters for comparisons and swaps.',
 dur:12,hint:'Choose a scheme, shuffle, then Step or Run. Compare the swap counts on the same input.',
 init:()=>({scheme:'hoare',a:[6,9,2,7,1,8,3,10,5,4]}),
 ui:[{choose:[['lomuto','Lomuto'],['hoare','Hoare']],label:'Scheme',get:s=>s.scheme,act:'scheme'},{b:'Shuffle',act:'shuffle'}],
 on:{scheme(s,v){s.scheme=v},shuffle(s){s.a=shuffled(range(10).map(i=>i+1),nextSeed())}},
 trace:s=>SS_partTrace(s.a,s.scheme),
 draw(s,f,X){
  const a=f.a,W=44,x0=40,base=270;let out=heading(s.scheme==='lomuto'?'Lomuto: one pointer scans; the zone grows':'Hoare: two pointers move inwards and swap');
  const pvVal=s.scheme==='lomuto'?s.a[s.a.length-1]:s.a[0];
  a.forEach((v,i)=>{const isP=v===pvVal,left=s.scheme==='lomuto'?i<f.i:(f.done?i<=f.split:false);out+=R(x0+i*W+4,base-v*18,W-8,v*18,isP?C.purple:left?C.green:'#9ab5c7','none',4)+TF(x0+i*W+W/2,base+18,v,13,C.muted)});
  const ptr=(i,label,col,y)=>{if(i===null||i===undefined||i<0||i>=a.length)return '';const x=x0+i*W+W/2;return arrow(x,y+26,x,y+6,col,2.5)+TBF(x,y+42,label,13,col)};
  out+=ptr(f.i,s.scheme==='lomuto'?'i':'left',C.green,base+20)+ptr(f.j,s.scheme==='lomuto'?'j':'right',C.coral,base+20);
  out+=counter(500,70,'Comparisons',f.c,C.blue,90)+counter(500,128,'Swaps',f.sw,C.coral,90);
  out+=TF(545,200,'purple = pivot',13,C.purple);
  const other=SS_partTrace(s.a,s.scheme==='lomuto'?'hoare':'lomuto');out+=TF(545,222,`${s.scheme==='lomuto'?'Hoare':'Lomuto'}: ${other[other.length-1].sw} swaps`,13,C.muted);
  return {svg:out,phase:f.say};
 }});

/* ---------- Big-O lesson ---------- */
const SS_SNIP={single:{code:['count = 0','for i in range(n):','    count += 1'],steps:n=>range(n).map(i=>[i,0]),grow:'n',f:n=>n},
 nested:{code:['count = 0','for i in range(n):','    for j in range(n):','        count += 1'],steps:n=>range(n*n).map(k=>[Math.floor(k/n),k%n]),grow:'n²',f:n=>n*n},
 triangle:{code:['count = 0','for i in range(n):','    for j in range(i):','        count += 1'],steps:n=>{const o=[];for(let i=0;i<n;i++)for(let j=0;j<i;j++)o.push([i,j]);return o},grow:'n(n − 1)/2, still O(n²)',f:n=>n*(n-1)/2},
 halving:{code:['count = 0','while n > 1:','    n = n // 2','    count += 1'],steps:n=>{const o=[];let m=n;while(m>1){m=Math.floor(m/2);o.push([o.length,m])}return o},grow:'log₂ n',f:n=>Math.floor(Math.log2(Math.max(1,n)))}};
SCENE({id:'big-o-counting',name:'Counting operations in code',tag:'Loops tell you the growth',
 definition:'To estimate an algorithm’s growth, count how many times its innermost step runs as n grows: one loop to n gives n, a loop inside a loop gives n², and halving n each time gives log₂ n.',
 example:'Two nested loops over 10 items run the inner line 100 times; over 20 items, 400 times. Doubling n quadruples the work: O(n²).',
 desc:'A short program beside a grid of dots, one dot per time the counted line runs, filling in as the program steps.',
 dur:12,hint:'Pick a program and n, then Step or Run. Double n and see how the count changes.',
 init:()=>({kind:'nested',n:6}),
 ui:[{choose:[['single','One loop'],['nested','Nested loops'],['triangle','Triangle'],['halving','Halving']],label:'Program',get:s=>s.kind,act:'kind'},{range:'n',label:'n',min:1,max:12,get:s=>s.n,act:'n'}],
 on:{kind(s,v){s.kind=v},n(s,v){s.n=v}},
 trace(s){const sp=SS_SNIP[s.kind],steps=sp.steps(s.n),fr=[{k:0,steps,say:'count starts at 0.'}];steps.forEach((st,i)=>fr.push({k:i+1,steps,say:`The counted line runs: count = ${i+1}.`}));fr[fr.length-1].done=true;fr[fr.length-1].say=`Finished: count = ${steps.length} for n = ${s.n}. This program grows like ${sp.grow}.`;return fr},
 draw(s,f,X){
  const sp=SS_SNIP[s.kind],n=s.n;let out=heading(`How many times does the inner line run? (n = ${n})`);
  out+=R(24,56,250,30+sp.code.length*26,'#fff',C.grid,8);sp.code.forEach((ln,i)=>{const cur=i===sp.code.length-1&&f.k>0&&!f.done;out+=(cur?R(28,64+i*26,242,24,C.amberp,'none',4):'')+TMF(36,81+i*26,ln,14,C.ink,'start','xml:space="preserve"')});
  if(s.kind==='halving'){const m=[n,...f.steps.map(x=>x[1])];m.slice(0,f.k+1).forEach((v,i)=>{const y=60+i*44;out+=R(310,y,Math.max(6,v*18),30,i===f.k?C.amberp:C.pale,i===f.k?C.amber:C.blue,5)+TF(316+Math.max(6,v*18),y+20,'n = '+v,13,C.ink,'start')})}
  else{const cs=Math.min(22,250/n),x0=310,y0=60;f.steps.forEach(([i,j],k)=>{const on=k<f.k;out+=Ci(x0+j*cs+cs/2,y0+i*cs+cs/2,cs*.32,on?(k===f.k-1?C.amber:C.blue):'#e1e8ed')});
   out+=TF(x0,y0-8,s.kind==='single'?'one dot per i':'row i, column j',13,C.muted,'start')}
  out+=counter(30,250,'count',f.k,C.blue,110)+counter(150,250,'Grows like',sp.grow.split(',')[0],C.purple,124);
  out+=T(150,336,`n = ${n*2} would give ${sp.f(n*2)}`,14,C.muted);
  return {svg:out,phase:f.say};
 }});

const SS_bwaCache=new Map();
function SS_perms(n){const out=[],a=range(n);(function p(k){if(k===n){out.push(a.slice());return}for(let i=k;i<n;i++){[a[k],a[i]]=[a[i],a[k]];p(k+1);[a[k],a[i]]=[a[i],a[k]]}})(0);return out}
SCENE({id:'big-o-cases',name:'Best, worst and average over all inputs',tag:'One algorithm, many costs',
 definition:'Run an algorithm on every possible input of size n and count its steps. The smallest count is the best case, the largest the worst case, and the mean the average case.',
 example:'Insertion sort on all 120 orderings of 5 items: best 4 comparisons (already sorted), worst 10 (reversed), average about 7.7.',
 desc:'A histogram of comparison counts over every ordering of n items, with markers for the best, average and worst case.',
 dur:10,hint:'Choose an algorithm and n. Every possible input is counted, so the chart is exact.',
 init:()=>({alg:'insertion',n:5}),
 watch(p){return {alg:p<.5?'insertion':'bubble',n:5}},
 ui:[{choose:[['insertion','Insertion sort'],['bubble','Bubble sort (early stop)'],['merge','Merge sort']],label:'Algorithm',get:s=>s.alg,act:'alg'},{range:'n',label:'n',min:3,max:6,get:s=>s.n,act:'n'}],
 on:{alg(s,v){s.alg=v},n(s,v){s.n=v}},
 draw(s,f,X){
  const ps=SS_perms(s.n),key=s.alg+s.n;if(!SS_bwaCache.has(key)){const fn={insertion:SS_insertion,bubble:SS_bubble,merge:SS_merge}[s.alg];SS_bwaCache.set(key,ps.map(p=>{const fr=fn(p.map(x=>x+1));return fr[fr.length-1].c}))}const cs=SS_bwaCache.get(key);
  const lo=Math.min(...cs),hi=Math.max(...cs),avg=sum(cs)/cs.length,hist={};cs.forEach(c=>hist[c]=(hist[c]||0)+1);const mx=Math.max(...Object.values(hist));
  let out=heading(`${s.alg[0].toUpperCase()+s.alg.slice(1)} sort on all ${ps.length} orderings of ${s.n} items`);
  const x0=60,W=480,bw=W/(hi-lo+1),base=280;
  for(let c=lo;c<=hi;c++){const v=hist[c]||0,x=x0+(c-lo)*bw;out+=R(x+2,base-v/mx*160,bw-4,v/mx*160,C.blue,'none',3)+TF(x+bw/2,base+16,c,13,C.muted);if(v&&bw>26){const bh=v/mx*160;out+=bh>22?TF(x+bw/2,base-bh+16,v,13,'#fff'):TF(x+bw/2,base-bh-5,v,13,C.blue)}}
  const mark=(c,col,label,dy)=>{const x=x0+(c-lo+.5)*bw;return L(x,72+dy,x,base,col,2,'stroke-dasharray="5 4"')+R(x-46,50+dy,92,18,'#fff','none',4,'opacity=".9"')+TBF(x,63+dy,label,13,col)};
  out+=mark(lo,C.green,'best '+lo,0)+mark(hi,C.coral,'worst '+hi,0)+mark(avg,C.purple,'average '+fmt(avg),18);
  out+=T(300,322,'comparisons needed →',13,C.muted)+T(300,350,'Bar height: how many orderings need that many comparisons.',14,C.muted);
  return {svg:out,phase:`Best ${lo}, average ${fmt(avg)}, worst ${hi} comparisons. ${s.alg==='merge'?'Merge sort’s counts are tightly bunched: its best and worst cases are close.':'The best case (already sorted) is far from the worst case (reversed).'}`};
 }});

SCENE({id:'big-o-space',name:'Space complexity',tag:'How much memory the work needs',
 definition:'Space complexity counts the extra memory an algorithm needs as n grows. A loop with a running total needs O(1) extra space; a recursive version needs a stack frame per call, O(n).',
 example:'Adding up a list with a loop uses one variable, whatever the length. Adding it up recursively keeps n calls waiting at once; making a reversed copy needs a whole new list.',
 desc:'Memory cells drawn as boxes filling and emptying over time for three ways of processing a list, with a chart of memory in use at each step.',
 dur:12,hint:'Choose a method and n, then Step or Run. Watch the peak memory.',
 init:()=>({how:'recursive',n:6}),
 ui:[{choose:[['loop','Loop with a total'],['recursive','Recursive sum'],['copy','Reversed copy']],label:'Method',get:s=>s.how,act:'how'},{range:'n',label:'n',min:2,max:10,get:s=>s.n,act:'n'}],
 on:{how(s,v){s.how=v},n(s,v){s.n=v}},
 trace(s){const n=s.n,fr=[];let mem=[];const snap=(say)=>fr.push({mem:mem.slice(),say});
  if(s.how==='loop'){mem=['total = 0'];snap('One variable holds the running total.');let t=0;for(let i=1;i<=n;i++){t+=i;mem=['total = '+t,'i = '+i];snap(`Add item ${i}. Still just two variables.`)}mem=['total = '+t];snap(`Done with ${n} items using O(1) extra memory.`)}
  else if(s.how==='recursive'){for(let i=n;i>=1;i--){mem.push(`sum(${i}) waits`);snap(`Call sum on the last ${i} item${i>1?'s':''}: a new stack frame.`)}for(let i=1;i<=n;i++){mem.pop();snap(`A call returns and its frame is freed.`)}snap(`Peak: ${n} frames at once, O(n) extra memory.`)}
  else{mem=[];snap('Make a new list to hold the reversed copy.');for(let i=n;i>=1;i--){mem.push('item '+i);snap(`Copy item ${i}: one more cell.`)}snap(`The copy needs ${n} cells: O(n) extra memory.`)}
  return fr},
 draw(s,f,X){
  let out=heading({loop:'Loop with a running total',recursive:'Recursive sum: one frame per call',copy:'Building a reversed copy'}[s.how]);
  f.mem.forEach((m,i)=>{const y=320-(i+1)*26;out+=R(40,y,170,23,s.how==='recursive'?C.amberp:C.pale,s.how==='recursive'?C.amber:C.blue,5)+TMF(125,y+16,m,13,C.ink)});
  out+=L(30,322,220,322,C.ink,2)+TF(125,342,'memory in use',13,C.muted);
  const fr=SS_recomputeSpace(s),H=fr.map(x=>x.length),mx=Math.max(10,...H),cw=Math.min(22,320/H.length),x0=260,base=300;
  H.forEach((h,i)=>{const on=i<=X.k;out+=R(x0+i*cw,base-h/mx*200,cw-2,h/mx*200,on?C.blue:'#e1e8ed','none',2)});
  out+=L(x0,base,x0+H.length*cw,base,C.line,2)+TF(x0,base+18,'time →',13,C.muted,'start');
  out+=counter(440,70,'In use now',f.mem.length,C.blue,140)+counter(440,128,'Peak',Math.max(...H),C.coral,140);
  return {svg:out,phase:f.say};
 }});
function SS_recomputeSpace(s){return SCENES['big-o-space'].trace(s).map(x=>x.mem)}

/* ---------- Divide and conquer lesson ---------- */
const SS_big=b=>{const s=b.toString();return s.length>11?s.slice(0,4)+'… ('+s.length+' digits)':s};
SCENE({id:'dc-fast-exponentiation',name:'Fast exponentiation',tag:'Square, square, square',
 definition:'To raise x to the power n, square repeatedly (x, x², x⁴, x⁸, …) and multiply together the powers that match the 1 bits of n. It takes about 2 log₂ n multiplications instead of n − 1.',
 example:'3¹³: 13 is 1101 in binary, so 3¹³ = 3⁸ × 3⁴ × 3¹. Five multiplications instead of twelve. Public-key encryption relies on this with exponents hundreds of digits long.',
 desc:'The exponent written in binary above a row of repeated squares; the squares under 1 bits are multiplied into the result, with a running count of multiplications.',
 dur:11,hint:'Choose the base and the exponent, then Step. Compare the multiplication count with n − 1.',
 init:()=>({base:3,exp:13}),
 ui:[{range:'base',label:'Base',min:2,max:9,get:s=>s.base,act:'base'},{range:'exp',label:'Exponent',min:1,max:60,get:s=>s.exp,act:'exp'}],
 on:{base(s,v){s.base=v},exp(s,v){s.exp=v}},
 trace(s){const bits=s.exp.toString(2).split('').reverse().map(Number),B=BigInt(s.base);let pow=B,res=1n,m=0,first=true;const fr=[{i:-1,res,m,used:[],say:`${s.exp} in binary is ${s.exp.toString(2)}. Each 1 bit says which square to use.`}],used=[];
  bits.forEach((b,i)=>{if(i>0){pow=pow*pow;m++}
   if(b){if(first){res=pow;first=false}else{res=res*pow;m++}used.push(i)}
   fr.push({i,res,m,used:used.slice(),pow,say:(i>0?`Square to get ${s.base}^${2**i}. `:'')+(b?`Bit ${i} is 1: multiply it into the result.`:`Bit ${i} is 0: skip it.`)})});
  fr.push({i:bits.length-1,res,m,used:used.slice(),done:true,say:`${s.base}^${s.exp} = ${SS_big(res)} using ${m} multiplication${m===1?'':'s'}. Multiplying one at a time would need ${s.exp-1}.`});return fr},
 draw(s,f,X){
  const bits=s.exp.toString(2).split('').reverse().map(Number),k=bits.length,w=Math.min(88,540/k),x0=300-k*w/2;let out=heading(`${s.base} to the power ${s.exp}`);
  out+=TF(300,58,`${s.exp} = ${s.exp.toString(2)} in binary (read right to left below)`,13,C.muted);
  bits.forEach((b,i)=>{const x=x0+(k-1-i)*w,done=i<=f.i,use=f.used.includes(i),cur=i===f.i;
   out+=TB(x+w/2,90,b,22,b?C.blue:C.muted)+TF(x+w/2,108,'bit '+i,13,C.muted);
   out+=R(x+4,120,w-8,62,!done?'#f4f7f9':use?C.greenp:'#fff',cur?C.amber:use?C.green:C.grid,8)+TBF(x+w/2,146,`${s.base}${SS_sup(2**i)}`,14,done?C.ink:'#9aaab3');
   if(done){const v=(BigInt(s.base)**BigInt(2**i)).toString();out+=TF(x+w/2,168,v.length>8?v.slice(0,5)+'…':v,13,C.muted)}});
  out+=T(300,226,'Result = '+(f.used.length?f.used.map(i=>`${s.base}${SS_sup(2**i)}`).join(' × '):'1'),17,C.ink);
  out+=TB(300,256,'= '+SS_big(f.res),17,C.green);
  out+=counter(150,288,'Multiplications',f.m,C.blue,140)+counter(310,288,'One at a time',s.exp-1,C.muted,140);
  return {svg:out,phase:f.say};
 }});

const SS_REC={merge:{a:2,f:m=>m,label:'T(n) = 2T(n/2) + n',name:'merge sort',big:'n log n'},bins:{a:1,f:m=>1,label:'T(n) = T(n/2) + 1',name:'binary search',big:'log n'},
 naive:{a:4,f:m=>m,label:'T(n) = 4T(n/2) + n',name:'school multiplication',big:'n²'},karat:{a:3,f:m=>m,label:'T(n) = 3T(n/2) + n',name:'Karatsuba',big:'n^1.58'}};
SCENE({id:'dc-recursion-tree',name:'Adding up a recursion tree',tag:'Which level does the most work?',
 definition:'A divide-and-conquer algorithm splits a problem of size n into a parts of size n/b and does f(n) extra work. Adding the work level by level shows the total: it depends on whether the top, every level or the leaves dominate.',
 example:'Merge sort (2 parts, n extra) does n on every level: n log n in total. Splitting into 4 parts, as in schoolbook multiplication, makes the leaves dominate: n².',
 desc:'A recursion tree drawn level by level, the number of subproblems on each level, and a bar for the total work on that level, for four different recurrences.',
 dur:12,hint:'Choose a recurrence and a size. Look at whether the work bars stay level, shrink or grow towards the leaves.',
 init:()=>({rec:'merge',n:16}),
 watch(p){return {rec:['merge','bins','naive','karat'][Math.min(3,Math.floor(p*4))],n:16}},
 ui:[{choose:[['merge','2T(n/2) + n'],['bins','T(n/2) + 1'],['naive','4T(n/2) + n'],['karat','3T(n/2) + n']],label:'Recurrence',get:s=>s.rec,act:'rec'},{choose:[['8','n = 8'],['16','16'],['32','32'],['64','64']],label:'n',get:s=>String(s.n),act:'n'}],
 on:{rec(s,v){s.rec=v},n(s,v){s.n=Number(v)}},
 draw(s,f,X){
  const R_=SS_REC[s.rec],L_=Math.log2(s.n),rows=L_+1,rh=Math.min(42,262/rows),work=range(rows).map(d=>R_.a**d*R_.f(s.n/2**d)),mx=Math.max(...work),total=sum(work);
  let out=heading(`${R_.label}  (${R_.name})`);
  out+=TBF(190,58,'subproblems',13,C.muted)+TBF(480,58,'work on this level',13,C.muted);
  for(let d=0;d<rows;d++){const y=66+d*rh,cnt=R_.a**d,size=s.n/2**d;
   if(cnt<=16){const bw=300/cnt;for(let k=0;k<cnt;k++)out+=R(40+k*bw+1,y,bw-2,rh-8,C.pale,C.blue,4);if(300/cnt>26)out+=TF(40+bw/2,y+(rh-8)/2+5,size,13,C.ink)}
   else out+=R(40,y,300,rh-8,C.pale,C.blue,4)+TF(190,y+(rh-8)/2+5,`${cnt} parts of size ${size}`,13,C.ink);
   out+=R(380,y,Math.max(3,work[d]/mx*150),rh-8,C.coral,'none',3)+TF(386+Math.max(3,work[d]/mx*150),y+(rh-8)/2+5,work[d],13,C.ink,'start')}
  out+=TB(300,Math.min(368,66+rows*rh+20),`Total ≈ ${total} for n = ${s.n}: grows like ${R_.big}`,15,C.ink);
  const shape=work[rows-1]>work[0]*1.5?'The leaves do the most work.':work[0]>work[rows-1]*1.5?'The top level does the most work.':'Every level does about the same work.';
  return {svg:out,phase:`${shape} ${s.rec==='karat'?'Three parts instead of four is Karatsuba’s trick: the leaves shrink from n² to about n^1.58.':''}`};
 }});

SCENE({id:'dc-karatsuba',name:'Karatsuba multiplication',tag:'Three multiplications instead of four',
 definition:'To multiply two numbers split into halves, schoolbook multiplication needs four half-size products. Karatsuba’s trick gets the middle term from one extra product, so three are enough.',
 example:'1234 × 5678: a = 12, b = 34, c = 56, d = 78. Compute ac, bd and (a + b)(c + d); the middle term ad + bc is (a + b)(c + d) − ac − bd.',
 desc:'Two four-digit numbers split into halves, then the three products, the subtraction that recovers the middle term, and the final answer assembled from place values.',
 dur:12,hint:'Choose two numbers, then Step through the three multiplications.',
 init:()=>({x:1234,y:5678}),
 ui:[{range:'x',label:'x',min:1000,max:9999,get:s=>s.x,act:'x'},{range:'y',label:'y',min:1000,max:9999,get:s=>s.y,act:'y'}],
 on:{x(s,v){s.x=v},y(s,v){s.y=v}},
 trace(s){const a=Math.floor(s.x/100),b=s.x%100,c=Math.floor(s.y/100),d=s.y%100,ac=a*c,bd=b*d,mid=(a+b)*(c+d),cross=mid-ac-bd,res=ac*10000+cross*100+bd;
  const v={a,b,c,d,ac,bd,mid,cross,res};return [
   {k:0,v,m:0,say:`Split each number into halves: ${s.x} = ${a}·100 + ${b}, ${s.y} = ${c}·100 + ${d}.`},
   {k:1,v,m:1,say:`Product 1: a × c = ${a} × ${c} = ${ac}.`},
   {k:2,v,m:2,say:`Product 2: b × d = ${b} × ${d} = ${bd}.`},
   {k:3,v,m:3,say:`Product 3: (a + b)(c + d) = ${a+b} × ${c+d} = ${mid}. It contains ac + ad + bc + bd.`},
   {k:4,v,m:3,say:`Subtract: ad + bc = ${mid} − ${ac} − ${bd} = ${cross}. No fourth multiplication needed.`},
   {k:5,v,m:3,done:true,say:`Assemble: ${ac}·10000 + ${cross}·100 + ${bd} = ${res}. ${res===s.x*s.y?'✓ equals':'≠'} ${s.x} × ${s.y}. Applied recursively, this costs about n^1.58 instead of n² digit operations.`}]},
 draw(s,f,X){
  const v=f.v;let out=heading(`${s.x} × ${s.y}`);
  const half=(x,y,hi,lo,n1,n2)=>R(x,y,72,46,C.pale,C.blue,8)+TB(x+36,y+30,hi,20,C.ink)+R(x+78,y,72,46,C.purplep,C.purple,8)+TB(x+114,y+30,lo,20,C.ink)+TF(x+36,y+62,n1,13,C.blue)+TF(x+114,y+62,n2,13,C.purple);
  out+=half(70,56,v.a,v.b,'a','b')+half(380,56,v.c,v.d,'c','d')+TB(300,86,'×',22,C.muted);
  const rows=[[1,`ac = ${v.a} × ${v.c}`,v.ac],[2,`bd = ${v.b} × ${v.d}`,v.bd],[3,`(a + b)(c + d) = ${v.a+v.b} × ${v.c+v.d}`,v.mid],[4,`ad + bc = ${v.mid} − ${v.ac} − ${v.bd}`,v.cross]];
  rows.forEach(([k,txt,val],i)=>{const y=136+i*36,on=f.k>=k,cur=f.k===k;out+=R(70,y,460,32,cur?C.amberp:on?'#fff':'#f4f7f9',cur?C.amber:C.grid,6)+TMF(84,y+21,txt,14,on?C.ink:'#9aaab3','start')+(on?TBF(516,y+21,'= '+val,14,k===4?C.purple:C.blue,'end'):'')});
  if(f.done)out+=TB(300,300,`${v.ac}·10⁴ + ${v.cross}·10² + ${v.bd} = ${v.res}`,17,C.green);
  out+=counter(70,318,'Multiplications',f.m,C.blue,130)+counter(400,318,'Schoolbook',4,C.muted,130);
  return {svg:out,phase:f.say};
 }});

/* ---------- Dynamic programming lesson ---------- */
const SS_COINS={'1,3,4':[1,3,4],'1,2,5,10':[1,2,5,10],'1,5,6,9':[1,5,6,9]};
SCENE({id:'dp-coin-change',name:'Fewest coins',tag:'Build the answer from smaller amounts',
 definition:'To make an amount with the fewest coins, work out the best answer for every smaller amount first. The best for m is one coin plus the best for m minus that coin, over every coin.',
 example:'With coins 1, 3 and 4, making 6: the greedy choice 4 + 1 + 1 uses three coins, but the table finds 3 + 3, two coins.',
 desc:'A row of cells for every amount from 0 up to the target, each filled with the fewest coins needed, with an arrow from the smaller amount it builds on; the greedy answer is shown for comparison.',
 dur:13,hint:'Choose a coin set and an amount, then Step or Run. Look for amounts where greedy does worse.',
 init:()=>({set:'1,3,4',amount:10}),
 ui:[{choose:[['1,3,4','1, 3, 4'],['1,2,5,10','1, 2, 5, 10'],['1,5,6,9','1, 5, 6, 9']],label:'Coins',get:s=>s.set,act:'set'},{range:'amount',label:'Amount',min:1,max:15,get:s=>s.amount,act:'amount'}],
 on:{set(s,v){s.set=v},amount(s,v){s.amount=v}},
 trace(s){const coins=SS_COINS[s.set],best=[0],from=[null],fr=[{m:0,best:[0],from:[null],say:'0 needs 0 coins. Every other amount is built from a smaller one.'}];
  for(let m=1;m<=s.amount;m++){let b=Infinity,bc=null;for(const c of coins)if(c<=m&&best[m-c]+1<b){b=best[m-c]+1;bc=c}best.push(b);from.push(bc);
   fr.push({m,best:best.slice(),from:from.slice(),say:`${m}: try each coin. Best is coin ${bc} plus the best for ${m-bc} (${best[m-bc]} coin${best[m-bc]===1?'':'s'}) = ${b}.`})}
  const use=[];let m=s.amount;while(m>0){use.push(from[m]);m-=from[m]}
  const greedy=[];let g=s.amount;for(const c of coins.slice().sort((a,b)=>b-a))while(g>=c){greedy.push(c);g-=c}
  fr.push({m:s.amount,best,from,done:true,use,greedy,say:`Fewest coins for ${s.amount}: ${use.join(' + ')} (${use.length}). Greedy, always taking the biggest coin, gives ${greedy.join(' + ')} (${greedy.length})${greedy.length>use.length?': worse':': the same here'}.`});return fr},
 draw(s,f,X){
  const n=s.amount+1,w=Math.min(36,560/n),x0=300-n*w/2;let out=heading(`Fewest coins for every amount up to ${s.amount}`);
  out+=TF(300,56,'coins: '+SS_COINS[s.set].join(', '),13,C.muted);
  for(let m=0;m<n;m++){const x=x0+m*w,known=m<=f.m,cur=m===f.m&&!f.done,onPath=f.done&&(()=>{let k=s.amount;while(k>0){if(k===m)return true;k-=f.from[k]}return m===0})();
   out+=TF(x+w/2,150,m,13,C.muted)+R(x+2,160,w-4,44,cur?C.amberp:onPath?C.greenp:known?'#fff':'#f4f7f9',cur?C.amber:onPath?C.green:C.grid,6);
   if(known)out+=TBF(x+w/2,188,f.best[m],15,C.ink)+(m>0?TF(x+w/2,222,'+'+f.from[m],13,C.blue):'')}
  if(f.m>0&&!f.done){const c=f.from[f.m],xa=x0+(f.m-c)*w+w/2,xb=x0+f.m*w+w/2;out+=curveArrow(xa,156,xb,156,Math.min(60,(xb-xa)*.5),C.coral,2.2)}
  out+=TF(300,248,'Top: amount · cell: fewest coins · below: last coin used',13,C.muted);
  if(f.done){out+=R(90,272,200,58,C.greenp,C.green,10)+TBF(190,295,'Table: '+f.use.length+' coins',14,C.green)+TF(190,316,f.use.join(' + '),13,C.ink);
   const bad=f.greedy.length>f.use.length;out+=R(310,272,200,58,bad?C.coralp:'#fff',bad?C.coral:C.grid,10)+TBF(410,295,'Greedy: '+f.greedy.length+' coins',14,bad?C.coral:C.ink)+TF(410,316,f.greedy.join(' + '),13,C.ink)}
  return {svg:out,phase:f.say};
 }});

function SS_edTrace(A,B){const m=A.length,n=B.length,D=range(m+1).map(i=>range(n+1).map(j=>i===0?j:j===0?i:null));const fr=[{D:D.map(r=>r.slice()),cur:null,say:'Top row: turning “” into each prefix of the second word takes that many insertions. Left column: deletions.'}];
 for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){const same=A[i-1]===B[j-1],sub=D[i-1][j-1]+(same?0:1),del=D[i-1][j]+1,ins=D[i][j-1]+1;D[i][j]=Math.min(sub,del,ins);
  fr.push({D:D.map(r=>r.slice()),cur:[i,j],say:same?`“${A[i-1]}” = “${B[j-1]}”: copy the diagonal, ${D[i-1][j-1]}.`:`“${A[i-1]}” ≠ “${B[j-1]}”: 1 + the smallest of replace ${D[i-1][j-1]}, delete ${D[i-1][j]}, insert ${D[i][j-1]} = ${D[i][j]}.`})}
 const path=[[m,n]],ops=[];let i=m,j=n;while(i>0||j>0){if(i>0&&j>0&&D[i][j]===D[i-1][j-1]+(A[i-1]===B[j-1]?0:1)){if(A[i-1]!==B[j-1])ops.unshift(`replace ${A[i-1]} → ${B[j-1]}`);i--;j--}else if(i>0&&D[i][j]===D[i-1][j]+1){ops.unshift(`delete ${A[i-1]}`);i--}else{ops.unshift(`insert ${B[j-1]}`);j--}path.push([i,j])}
 fr.push({D,cur:null,done:true,path,ops,say:`Edit distance ${D[m][n]}: ${ops.length?ops.join(', '):'the words are equal'}. Each cell reused answers already in the table instead of recomputing them.`});return fr}
const SS_word=v=>String(v).toLowerCase().replace(/[^a-z]/g,'').slice(0,7);
SCENE({id:'dp-edit-distance',name:'Edit distance',tag:'A table of smaller answers',
 definition:'The edit distance between two words is the fewest single-letter insertions, deletions and replacements that turn one into the other. Each table cell solves it for two prefixes, using three neighbouring cells.',
 example:'kitten → sitting takes 3 edits: replace k → s, replace e → i, insert g. Spell checkers suggest the dictionary words with the smallest edit distance.',
 desc:'A grid with one word down the side and the other across the top; cells fill row by row with the cost of turning one prefix into the other, then the cheapest route back is traced.',
 dur:15,hint:'Type two short words (up to 7 letters), then Step or Run. Switch to 3D to see the table as a landscape.',
 init:()=>({a:'kitten',b:'sitting'}),
 ui:[{text:'From',label:'From',get:s=>s.a,act:'a',max:7},{text:'To',label:'To',get:s=>s.b,act:'b',max:7}],
 on:{a(s,v){s.a=SS_word(v)},b(s,v){s.b=SS_word(v)}},
 trace:s=>SS_edTrace(SS_word(s.a),SS_word(s.b)),
 draw(s,f,X){
  const A=SS_word(s.a),B=SS_word(s.b),m=A.length,n=B.length,cs=Math.min(34,250/(Math.max(m,n)+1)),x0=72,y0=70;let out=heading(`Turn “${A}” into “${B}”`);
  const onPath=(i,j)=>f.path&&f.path.some(p=>p[0]===i&&p[1]===j);
  [...B].forEach((ch,j)=>out+=TB(x0+(j+1)*cs+cs/2,y0-8,ch,15,C.purple));[...A].forEach((ch,i)=>out+=TB(x0-12,y0+(i+1)*cs+cs/2+5,ch,15,C.blue));
  for(let i=0;i<=m;i++)for(let j=0;j<=n;j++){const v=f.D[i][j],cur=f.cur&&f.cur[0]===i&&f.cur[1]===j,nb=f.cur&&((i===f.cur[0]-1&&j===f.cur[1]-1)||(i===f.cur[0]-1&&j===f.cur[1])||(i===f.cur[0]&&j===f.cur[1]-1));
   out+=R(x0+j*cs,y0+i*cs,cs-2,cs-2,cur?C.amberp:onPath(i,j)?C.coralp:nb?C.pale:v===null?'#f4f7f9':'#fff',cur?C.amber:onPath(i,j)?C.coral:nb?C.blue:C.grid,4);
   if(v!==null)out+=TBF(x0+j*cs+cs/2-1,y0+i*cs+cs/2+4,v,13,C.ink)}
  if(f.done){out+=TBF(470,80,`Distance ${f.D[m][n]}`,16,C.coral);f.ops.slice(0,8).forEach((o,i)=>out+=TF(400,108+i*24,`${i+1}. ${o}`,14,C.ink,'start'))}
  else out+=TF(470,90,'Each cell: the cheapest of',13,C.muted)+TF(470,110,'↖ replace or keep',13,C.muted)+TF(470,130,'↑ delete · ← insert',13,C.muted);
  return {svg:out,phase:f.say};
 },
 three(s,f,X,project){
  const A=SS_word(s.a),B=SS_word(s.b),m=A.length,n=B.length,mx=Math.max(1,...f.D.flat().filter(v=>v!==null)),hz=2.6/mx;
  const P=project([[0,0,0],[n+1,m+1,0],[0,0,mx*hz+.4],[n+1,m+1,mx*hz]]);const faces=[];
  for(let i=0;i<=m;i++)for(let j=0;j<=n;j++){const v=f.D[i][j];if(v===null)continue;const path=f.path&&f.path.some(p=>p[0]===i&&p[1]===j),cur=f.cur&&f.cur[0]===i&&f.cur[1]===j;
   faces.push(...prism(j+.08,i+.08,0,.84,.84,Math.max(.05,v*hz),cur?C.amber:path?C.coral:'#7fa9c8'))}
  let out=poly3([[0,0,0],[n+1,0,0],[n+1,m+1,0],[0,m+1,0]],P,'#e5edf2')+paintFaces(faces,P);
  [...B].forEach((ch,j)=>{const q=P([j+1.5,-.4,0]);out+=label3(q[0],q[1]+5,ch,14,C.purple,'font-weight="700"')});
  [...A].forEach((ch,i)=>{const q=P([-.4,i+1.5,0]);out+=label3(q[0],q[1]+5,ch,14,C.blue,'font-weight="700"')});
  return {svg:out,title:'Edit-distance table as a landscape',caption:`Column height is the cell’s edit distance. The costs rise smoothly away from the top-left corner; ${f.done?'the coral columns are the cheapest route of edits':'the amber column is being filled from its three lower neighbours'}.`};
 }});

const SS_ITEMS=[['Map',1,1],['Torch',3,4],['Stove',4,5],['Tent',5,7]];
SCENE({id:'dp-knapsack',name:'The knapsack problem',tag:'Pack the most value under a weight limit',
 definition:'Given items with weights and values, choose some to carry so the total value is as large as possible without going over the weight limit. A table over items and capacities solves it.',
 example:'With room for 7 kg and items Map 1 kg/£1, Torch 3 kg/£4, Stove 4 kg/£5 and Tent 5 kg/£7, the best pack is Torch + Stove: £9.',
 desc:'A table with a row per item and a column per capacity; each cell holds the best value using the items so far, then the chosen items are traced back and shown in a bag.',
 dur:14,hint:'Change the weight limit, then Step or Run. Each cell either skips the item or takes it plus the best for the remaining capacity.',
 init:()=>({cap:7}),
 ui:[{range:'cap',label:'Weight limit (kg)',min:1,max:9,get:s=>s.cap,act:'cap'}],
 on:{cap(s,v){s.cap=v}},
 trace(s){const C_=s.cap,T_=[range(C_+1).map(()=>0)],fr=[{T:T_.map(r=>r.slice()),cur:null,say:'Row 0: with no items, every capacity is worth £0.'}];
  SS_ITEMS.forEach(([nm,w,v],i)=>{T_.push([]);for(let c=0;c<=C_;c++){const skip=T_[i][c],take=w<=c?T_[i][c-w]+v:-1;T_[i+1][c]=Math.max(skip,take);
   if(c>0)fr.push({T:T_.map(r=>r.slice()),cur:[i+1,c],took:take>skip,say:w>c?`${nm} (${w} kg) does not fit in ${c} kg: copy £${skip} from above.`:`Capacity ${c}: skip ${nm} → £${skip}; take it → £${v} + best for ${c-w} kg (£${T_[i][c-w]}) = £${take}. Keep £${T_[i+1][c]}.`})}});
  const pick=[];let c=C_;for(let i=SS_ITEMS.length;i>0;i--)if(T_[i][c]!==T_[i-1][c]){pick.unshift(i-1);c-=SS_ITEMS[i-1][1]}
  fr.push({T:T_,cur:null,done:true,pick,say:`Best value £${T_[SS_ITEMS.length][C_]}: ${pick.map(i=>SS_ITEMS[i][0]).join(' + ')||'nothing fits'}. Trying every subset would mean 2⁴ = 16 checks; the table needs only ${SS_ITEMS.length} × ${C_}.`});return fr},
 draw(s,f,X){
  const C_=s.cap,cw=Math.min(38,330/(C_+1)),x0=200,y0=66,rh=34;let out=heading(`Best value within ${C_} kg`);
  for(let c=0;c<=C_;c++)out+=TF(x0+c*cw+cw/2,y0-8,c+' kg',13,C.muted);
  f.T.forEach((row,i)=>{const label=i===0?'no items':`+ ${SS_ITEMS[i-1][0]} ${SS_ITEMS[i-1][1]} kg £${SS_ITEMS[i-1][2]}`;out+=TF(x0-8,y0+i*rh+21,label,13,i&&f.pick&&f.pick.includes(i-1)?C.green:C.ink,'end');
   for(let c=0;c<=C_;c++){const v=row[c],cur=f.cur&&f.cur[0]===i&&f.cur[1]===c;out+=R(x0+c*cw,y0+i*rh,cw-3,rh-4,cur?(f.took?C.greenp:C.amberp):v===undefined?'#f4f7f9':'#fff',cur?(f.took?C.green:C.amber):C.grid,4)+(v!==undefined?TBF(x0+c*cw+cw/2-1.5,y0+i*rh+20,'£'+v,13,C.ink):'')}});
  if(f.done){const y=y0+5*rh+20;out+=R(150,y,300,60,C.greenp,C.green,12)+TBF(300,y+24,`In the bag: £${f.T[4][C_]}`,15,C.green)+TF(300,y+46,f.pick.map(i=>`${SS_ITEMS[i][0]} (${SS_ITEMS[i][1]} kg)`).join(' + ')||'nothing',13,C.ink)}
  return {svg:out,phase:f.say};
 }});
