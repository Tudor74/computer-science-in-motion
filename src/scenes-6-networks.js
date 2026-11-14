/* ===================== Stage 6 · Networks ===================== */
// Shared helpers for this stage (prefixed NW_ because every file shares one scope).
const NW_chip=(x,y,label,col=C.blue,w=50)=>R(x-w/2,y-11,w,22,col,'none',6)+TMF(x,y+5,label,13,'#fff','middle','font-weight="700"');
const NW_mod=(b,e,m)=>{let r=1n,x=BigInt(b)%BigInt(m),k=BigInt(e);const M=BigInt(m);while(k>0n){if(k&1n)r=r*x%M;x=x*x%M;k>>=1n}return Number(r)};
const NW_pow=(b,e)=>(BigInt(b)**BigInt(e)).toString();
const NW_sup=n=>String(n).split('').map(d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
// All simple paths between two nodes, avoiding cut links; shortest first.
function NW_paths(links,cut,from,to){
 const adj={};for(const [a,b] of links){const id=a+'-'+b;if(cut.includes(id))continue;(adj[a]=adj[a]||[]).push(b);(adj[b]=adj[b]||[]).push(a)}
 const out=[];(function walk(p){const n=p[p.length-1];if(n===to){out.push(p.slice());return}for(const m of (adj[n]||[]).slice().sort()){if(!p.includes(m)&&(m===to||m[0]==='R')){p.push(m);walk(p);p.pop()}}})([from]);
 return out.sort((a,b)=>a.length-b.length||a.join().localeCompare(b.join()));
}
// A link in Try it mode carries a small cut/repair target at its midpoint.
function NW_link(X,a,b,id,cut,col=C.line,w=3){
 const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;let out=cut?L(a[0],a[1],b[0],b[1],C.coral,2,'stroke-dasharray="6 5"')+T(mx,my+6,'✕',18,C.coral,'middle','font-weight="700"'):L(a[0],a[1],b[0],b[1],col,w);
 if(X.try)out+=hit(X,'cut',id,`Link ${id.replace('-',' to ')}: ${cut?'broken. Press to repair.':'working. Press to break.'}`,Ci(mx,my,10,cut?'transparent':'#fff',cut?'transparent':C.muted)+(cut?'':L(mx-4,my,mx+4,my,C.muted,2)));
 return out;
}

/* ---- Packet switching ---- */
const NW_NET={nodes:{A:[45,180],R1:[165,110],R2:[165,255],R3:[300,180],R4:[435,110],R5:[435,255],B:[555,180]},
 links:[['A','R1'],['A','R2'],['R1','R3'],['R2','R3'],['R1','R4'],['R2','R5'],['R3','R4'],['R3','R5'],['R4','B'],['R5','B']]};
function NW_plan(s){
 const msg=s.msg.slice(0,12),chunks=[];for(let i=0;i<msg.length;i+=3)chunks.push(msg.slice(i,i+3));
 const paths=NW_paths(NW_NET.links,s.cut,'A','B');if(!paths.length)return {chunks,packets:[],end:0,paths};
 const min=paths[0].length,short=paths.filter(p=>p.length===min),long=paths.filter(p=>p.length>min);
 const packets=chunks.map((c,i)=>{const path=i%2===0&&long.length?long[(i>>1)%long.length]:short[(i>>1)%short.length],start=i*.5;return {n:i+1,data:c,path,start,arrive:start+path.length-1}});
 return {chunks,packets,paths,end:Math.max(...packets.map(p=>p.arrive))};
}
SCENE({id:'packet',name:'Packet',tag:'Messages travel in pieces',
 definition:'A small, numbered piece of a larger message. Each packet travels through the network on its own and the pieces are put back together at the end.',
 example:'A video call is sent as thousands of packets a second. Two packets from the same message can take different routes and arrive in a different order.',
 desc:'A message is cut into numbered packets that cross a mesh of routers by different paths, arrive out of order and are reassembled by number.',
 dur:12,hint:'Type a message (up to 12 characters). Press the small marker on any link to break it and watch the packets take other routes.',
 init:()=>({msg:'Hello world!',cut:[]}),
 ui:[{text:'Message',label:'Message',get:s=>s.msg,act:'msg',max:12},{b:'Repair all links',act:'repair'}],
 on:{msg(s,v){s.msg=v},cut(s,id){const i=s.cut.indexOf(id);if(i>=0)s.cut.splice(i,1);else s.cut.push(id)},repair(s){s.cut=[]}},
 trace(s){const pl=NW_plan(s),fr=[];if(!pl.packets.length)return [{t:0}];for(let t=0;t<=pl.end+.5;t+=.5)fr.push({t});return fr},
 draw(s,f,X){
  const pl=NW_plan(s),N=NW_NET.nodes,last=X.k>=X.n-1,Tt=f.t+(last?0:X.u*.5);let out=heading('Split, send separately, reassemble');
  out+=T(300,54,pl.chunks.length?`“${s.msg.slice(0,12)}” → ${pl.chunks.length} packet${pl.chunks.length>1?'s':''} of up to 3 characters`:'Type a message to send',14,C.muted);
  for(const [a,b] of NW_NET.links){const id=a+'-'+b,used=pl.packets.some(p=>{const h=Math.floor(Tt-p.start);return h>=0&&Tt<p.arrive&&((p.path[h]===a&&p.path[h+1]===b)||(p.path[h]===b&&p.path[h+1]===a))});out+=NW_link(X,N[a],N[b],id,s.cut.includes(id),used?C.blue:C.line,used?4:3)}
  for(const id in N){const [x,y]=N[id],host=id.length===1;out+=host?R(x-26,y-20,52,40,C.dark,'none',8)+TB(x,y+6,id==='A'?'From':'To',13,'#fff'):Ci(x,y,20,'#fff',C.blue)+TB(x,y+5,id,14)}
  const cols=[C.blue,C.purple,C.green,C.amber];const arrived=[];let waiting=0;
  for(const p of pl.packets){const s2=Tt-p.start,col=cols[(p.n-1)%4],label=p.n+':'+p.data;
   if(s2<0){out+=NW_chip(45,222+waiting*26,label,col);waiting++;continue}
   if(Tt>=p.arrive){arrived.push(p);continue}
   const h=Math.floor(s2),u=s2-h,a=N[p.path[h]],b=N[p.path[h+1]];out+=NW_chip(lerp(a[0],b[0],u),lerp(a[1],b[1],u)-31,label,col)}
  arrived.sort((a,b)=>a.arrive-b.arrive||a.n-b.n);
  out+=T(20,316,'Arrived:',14,C.muted,'start');arrived.forEach((p,i)=>out+=NW_chip(110+i*58,311,p.n+':'+p.data,cols[(p.n-1)%4]));
  const done=pl.packets.length&&arrived.length===pl.packets.length,sorted=arrived.slice().sort((a,b)=>a.n-b.n);
  out+=TF(20,356,'In number order:',14,C.muted,'start')+TMF(145,356,sorted.map(p=>p.data).join('')||'…',17,done?C.green:C.ink,'start','font-weight="700" xml:space="preserve"');
  let phase;
  if(!pl.paths.length)phase='Every route from sender to receiver is broken, so no packet can get through. Repair a link.';
  else if(!pl.packets.length)phase='Type a message to split it into packets.';
  else if(done){const order=arrived.map(p=>p.n).join(', ');phase=`They arrived in the order ${order}. Because every packet is numbered, the receiver can put them back in order: “${sorted.map(p=>p.data).join('')}”.`}
  else if(arrived.length)phase=`Packet ${arrived[arrived.length-1].n} has arrived first or early. Shorter routes win the race, so arrival order need not match sending order.`;
  else phase=`Each router passes a packet on towards its destination. Packets ${pl.packets.length>1?'1 and 2 take different routes':'travel independently'}${s.cut.length?', avoiding the broken link'+(s.cut.length>1?'s':''):''}.`;
  return {svg:out,phase};
 }});

/* ---- IP addresses and routing ---- */
const NW_RT={routers:{R1:[125,120],R2:[290,120],R3:[290,265],R4:[125,265]},
 hosts:{H1:{r:'R1',ip:'10.0.1.5',at:[52,60]},H2:{r:'R2',ip:'10.0.2.7',at:[362,60]},H3:{r:'R3',ip:'10.0.3.9',at:[362,325]},H4:{r:'R4',ip:'10.0.4.2',at:[52,325]}},
 links:[['R1','R2'],['R2','R3'],['R3','R4'],['R1','R4'],['R1','R3']]};
function NW_next(cut){
 // Distances by breadth-first search from every router; next hop = first neighbour one step closer.
 const adj={R1:[],R2:[],R3:[],R4:[]};for(const [a,b] of NW_RT.links){if(cut.includes(a+'-'+b))continue;adj[a].push(b);adj[b].push(a)}
 const table={};for(const d of Object.keys(adj)){const dist={[d]:0},q=[d];while(q.length){const x=q.shift();for(const y of adj[x])if(dist[y]===undefined){dist[y]=dist[x]+1;q.push(y)}}
  for(const r of Object.keys(adj)){table[r]=table[r]||{};table[r][d]=r===d?'direct':dist[r]===undefined?null:adj[r].filter(y=>dist[y]===dist[r]-1).sort()[0]}}
 return table;
}
SCENE({id:'ip-routing',name:'IP address and routing',tag:'Finding the way, one hop at a time',
 definition:'Every device on the internet has an IP address. Routers forward each packet one hop at a time, looking up its destination in a routing table to choose the next router.',
 example:'No router knows the whole journey. A packet for 10.0.3.9 matches the table row 10.0.3.0/24, which says “next hop R3”, and R3 delivers it directly.',
 desc:'Four routers joined by links, each with a host; a packet hops from router to router while the current router’s routing table is shown with the matching row highlighted.',
 dur:10,hint:'Press a destination computer to send a packet from H1. Press a link marker to cut it: the tables update and packets go round.',
 init:()=>({dest:'H3',cut:[]}),
 ui:[{choose:[['H2','To H2'],['H3','To H3'],['H4','To H4']],label:'Destination',get:s=>s.dest,act:'dest'},{b:'Repair all links',act:'repair'}],
 on:{dest(s,v){if(v!=='H1')s.dest=v},cut(s,id){const i=s.cut.indexOf(id);if(i>=0)s.cut.splice(i,1);else s.cut.push(id)},repair(s){s.cut=[]}},
 trace(s){
  const tb=NW_next(s.cut),dr=NW_RT.hosts[s.dest].r,fr=[{at:'H1'}];let r='R1',guard=0;
  while(guard++<8){const nh=tb[r][dr];fr.push({at:r,next:nh});if(nh===null)break;if(nh==='direct'){fr.push({at:s.dest});break}r=nh}
  return fr;
 },
 draw(s,f,X){
  const tb=NW_next(s.cut),H=NW_RT.hosts,Rr=NW_RT.routers,dip=H[s.dest].ip;let out=heading(`Packet from 10.0.1.5 to ${dip}`);
  for(const [a,b] of NW_RT.links)out+=NW_link(X,Rr[a],Rr[b],a+'-'+b,s.cut.includes(a+'-'+b));
  for(const h in H){const {at,r,ip}=H[h],rp=Rr[r];out+=L(at[0],at[1],rp[0],rp[1],C.line,2,'stroke-dasharray="3 4"');
   const dest=h===s.dest,src=h==='H1',inner=R(at[0]-40,at[1]-19,80,38,dest?C.amberp:'#fff',dest?C.amber:src?C.blue:C.line,8)+TB(at[0],at[1]-3,h,13,C.ink)+TM(at[0],at[1]+13,ip,12.5,C.muted);
   out+=h==='H1'?inner:hit(X,'dest',h,`Send to ${h}, address ${ip}`,inner)}
  for(const r in Rr){const [x,y]=Rr[r],here=f.at===r;out+=Ci(x,y,24,here?C.pale:'#fff',here?C.coral:C.blue)+TB(x,y+5,r,15)}
  // The moving packet: tween from the previous holder to the current one.
  const pos=id=>H[id]?H[id].at:Rr[id],path=SCENES['ip-routing'].trace(s).map(q=>q.at),cur2=pos(f.at),pb=X.k>0?pos(path[X.k-1]):cur2,u=smooth(X.u),px=lerp(pb[0],cur2[0],u),py=lerp(pb[1],cur2[1],u);
  const dx=207-px,dy=192-py,dd=Math.hypot(dx,dy)||1;out+=NW_chip(px+dx/dd*50,py+dy/dd*50,'→ '+dip.split('.').slice(2).join('.'),C.coral,64);
  // Routing table of the router now holding the packet.
  const tx=420,holder=f.at[0]==='R'?f.at:null;
  out+=R(tx-6,64,184,234,'#fff',C.grid,10);
  if(holder){out+=TB(tx+86,88,holder+'’s routing table',14,C.ink);out+=T(tx+8,112,'Destination',13,C.muted,'start')+T(tx+170,112,'Next hop',13,C.muted,'end');
   ['R1','R2','R3','R4'].forEach((d,i)=>{const y=124+i*36,hl=d===H[s.dest].r,nh=tb[holder][d];out+=R(tx-2,y,176,30,hl?C.amberp:'none',hl?C.amber:'none',6)+TM(tx+6,y+20,'10.0.'+d[1]+'.0/24',13,C.ink,'start')+TM(tx+168,y+20,nh===null?'none':nh,13,nh===null?C.coral:nh==='direct'?C.green:C.blue,'end','font-weight="700"')})}
  else out+=T(tx+86,150,f.at==='H1'?'H1 hands the packet':'Delivered to',14,C.muted)+T(tx+86,172,f.at==='H1'?'to its router, R1':s.dest+' at '+dip,14,C.muted);
  out+=T(tx+86,272,'“/24” = the first three',13,C.muted)+T(tx+86,289,'numbers must match',13,C.muted);
  const hops=path.filter(p=>p[0]==='R').length;out+=counter(tx+26,310,'routers visited',X.k===0?0:Math.min(hops,path.slice(0,X.k+1).filter(p=>p[0]==='R').length),C.blue,130);
  let phase;
  if(f.at==='H1')phase=`H1 (10.0.1.5) puts the destination address ${dip} on the packet and hands it to its router.`;
  else if(f.at===s.dest)phase=`Delivered after ${hops} router${hops>1?'s':''}. Each router only chose the next hop; nobody planned the whole route.`;
  else if(f.next===null)phase=`${f.at} has no route to 10.0.${H[s.dest].r[1]}.0/24 because the links are cut, so the packet is dropped.`;
  else if(f.next==='direct')phase=`${f.at} sees that ${dip} is on its own network, so it delivers the packet directly.`;
  else phase=`${f.at} looks up ${dip}: it matches 10.0.${H[s.dest].r[1]}.0/24, whose next hop is ${f.next}.${s.cut.length?' The tables were recalculated around the cut links.':''}`;
  return {svg:out,phase};
 }});

/* ---- TCP ---- */
function NW_tcp(lost){
 const msgs=[],ev={},say=(t,x)=>(ev[t]=ev[t]||[]).push(x);let base=1,next=1,timer=null,expected=1,end=0;const got=new Set();
 for(let t=0;t<=60;t++){
  for(const m of msgs){if(m.t1!==t||m.lost)continue;
   if(m.kind==='seg'){got.add(m.n);const before=expected;while(got.has(expected))expected++;msgs.push({kind:'ack',n:expected,t0:t,t1:t+2});
    say(t,expected>before?`Segment ${m.n} arrives${m.re?' at last':''}; the receiver replies ACK ${expected} (“send ${expected} next”).`:`Segment ${m.n} arrives early and is kept; the receiver repeats ACK ${expected} because ${expected} is still missing.`)}
   else if(m.n>base){base=m.n;timer=base<=5?t:null;say(t,`ACK ${m.n} reaches the sender: everything before ${m.n} is confirmed.`)}
  }
  for(const m of msgs)if(m.kind==='seg'&&m.lost&&m.t0+1===t)say(t,`Segment ${m.n} is lost on the way.`);
  if(base<=5&&timer!==null&&t-timer>=5){msgs.push({kind:'seg',n:base,t0:t,t1:t+2,re:true});timer=t;say(t,`The timer for segment ${base} runs out with no ACK beyond ${base}, so the sender resends it.`)}
  if(next<=5){msgs.push({kind:'seg',n:next,t0:t,t1:t+2,lost:lost.includes(next)});if(timer===null)timer=t;say(t,`The sender sends segment ${next}.`);next++}
  if(base>5&&msgs.every(m=>m.t1<=t)){end=t;break}
 }
 return {msgs,ev,end};
}
SCENE({id:'tcp',name:'TCP',tag:'Reliable delivery over an unreliable network',
 definition:'The Transmission Control Protocol numbers the data it sends, has the receiver acknowledge what arrived, and resends anything that goes missing.',
 example:'If segment 2 is lost, the receiver keeps 3, 4 and 5 but keeps asking for 2 (“ACK 2”). The sender’s timer runs out, it resends 2, and the receiver can then acknowledge everything (“ACK 6”).',
 desc:'A sequence diagram with the sender and receiver as two vertical timelines; numbered segments travel right, acknowledgements travel back, and a lost segment is resent after a timeout.',
 dur:14,hint:'Press a “Seg” label to lose that segment’s first transmission (up to two at once). Then step through and watch the acknowledgements.',
 init:()=>({lost:[2]}),
 ui:[{b:'Lose nothing',act:'none'}],
 on:{lose(s,n){n=Number(n);const i=s.lost.indexOf(n);if(i>=0)s.lost.splice(i,1);else{s.lost.push(n);if(s.lost.length>2)s.lost.shift()}},none(s){s.lost=[]}},
 trace(s){const r=NW_tcp(s.lost);return range(r.end+1).map(t=>({t}))},
 draw(s,f,X){
  const r=NW_tcp(s.lost),last=X.k>=X.n-1,Tn=f.t+(last?0:X.u),sp=Math.min(24,288/Math.max(1,r.end)),y=t=>80+t*sp,sx=150,rx=450;
  let out=heading('Number, acknowledge, resend');
  out+=TB(sx,60,'Sender',15)+TB(rx,60,'Receiver',15)+L(sx,68,sx,372,C.dark,2)+L(rx,68,rx,372,C.dark,2);
  for(const m of r.msgs){if(m.t0>Tn)continue;const pr=clamp((Tn-m.t0)/(m.t1-m.t0),0,1),seg=m.kind==='seg';
   const x0=seg?sx:rx,x1=seg?rx:sx,y0=y(m.t0),y1=y(m.t1),col=seg?(m.re?C.purple:C.blue):C.green;
   if(m.lost){const q=Math.min(pr,.5);out+=L(x0,y0,lerp(x0,x1,q),lerp(y0,y1,q),C.coral,2.5,'stroke-dasharray="5 4"');if(pr>=.5)out+=TB(lerp(x0,x1,.5),lerp(y0,y1,.5)+6,'✕',18,C.coral)}
   else if(pr>0)out+=arrow(x0,y0,lerp(x0,x1,pr),lerp(y0,y1,pr),col,2.5,8);
   if(seg){const lab=m.re?'resend '+m.n:'Seg '+m.n,inner=R(sx-76,y0-8,66,16,m.lost?C.coralp:m.re?C.purplep:C.pale,m.lost?C.coral:'none',10)+T(sx-43,y0+4.5,lab,13,m.lost?C.coral:col,'middle','font-weight="650"');
    out+=!m.re?hit(X,'lose',m.n,`Segment ${m.n}: ${m.lost?'lost':'delivered'} first time. Press to toggle.`,inner):inner}
   else if(pr>=0)out+=R(rx+8,y0-8,56,16,C.greenp,'none',8)+T(rx+36,y0+4.5,'ACK '+m.n,13,C.green,'middle','font-weight="650"');
  }
  const arrivedSegs=new Set(r.msgs.filter(m=>m.kind==='seg'&&!m.lost&&m.t1<=Tn).map(m=>m.n));
  out+=TF(570,92,'Received',13,C.muted);range(5).forEach(i=>{const ok=arrivedSegs.has(i+1);out+=R(548,102+i*30,44,24,ok?C.blue:'#fff',ok?C.blue:C.line,6)+T(570,119+i*30,i+1,14,ok?'#fff':C.muted,'middle','font-weight="700"')});
  let msg='';for(let t=Math.floor(Tn);t>=0&&!msg;t--)if(r.ev[t])msg=r.ev[t].join(' ');
  if(last&&f.t>=r.end)msg='All five segments are confirmed. The receiver hands 1, 2, 3, 4, 5 to the application in order, even though they did not all arrive in order.';
  return {svg:out,phase:msg};
 }});

/* ---- DNS ---- */
const NW_DNS={'www.example.co.uk':{ip:'203.0.113.10',tld:'.uk',zone:'example.co.uk'},'shop.example.co.uk':{ip:'203.0.113.42',tld:'.uk',zone:'example.co.uk'},'news.example.org':{ip:'198.51.100.7',tld:'.org',zone:'example.org'}};
function NW_dnsSteps(name,cachedNow){
 const d=NW_DNS[name];
 if(cachedNow)return [{a:'browser',b:'resolver',m:`Where is ${name}?`},{c:true,m:`The resolver finds ${name} in its cache: no need to ask anyone else.`},{a:'resolver',b:'browser',m:`${name} is ${d.ip}.`}];
 return [{a:'browser',b:'resolver',m:`Where is ${name}?`},{c:true,m:'The resolver checks its cache: not there.'},
  {a:'resolver',b:'root',m:`Where is ${name}?`},{a:'root',b:'resolver',m:`I don’t know, but the ${d.tld} servers will.`},
  {a:'resolver',b:'tld',m:`Where is ${name}?`},{a:'tld',b:'resolver',m:`Ask ${d.zone}’s name server.`},
  {a:'resolver',b:'auth',m:`Where is ${name}?`},{a:'auth',b:'resolver',m:`${name} is ${d.ip}.`},
  {c:true,store:true,m:'The resolver keeps the answer in its cache for an hour.'},{a:'resolver',b:'browser',m:`${name} is ${d.ip}. The browser can now connect.`}];
}
SCENE({id:'dns',name:'DNS',tag:'Turning names into addresses',
 definition:'The Domain Name System turns names people can remember, like www.example.co.uk, into the IP addresses that routers need.',
 example:'Your resolver asks a root server, which points to the .uk servers, which point to example.co.uk’s own name server, which knows the address. The answer is cached, so the next lookup is almost instant.',
 desc:'A browser asks a resolver, which asks the root, top-level and domain name servers in turn; the answer is stored in the resolver’s cache and a second lookup is answered straight from it.',
 dur:16,hint:'Pick a name, step through the lookup, then press “Look it up again” to see the cache answer it.',
 init:()=>({name:'www.example.co.uk',cached:[],twice:true}),
 ui:[{choose:Object.keys(NW_DNS).map(n=>[n,n]),label:'Name',get:s=>s.name,act:'name'},{b:'Look it up again',act:'again'},{b:'Empty the cache',act:'clear'}],
 on:{name(s,v){s.name=v;s.twice=false},again(s){if(!s.cached.includes(s.name))s.cached.push(s.name);s.twice=false},clear(s){s.cached=[];s.twice=false}},
 trace(s){
  const hit1=s.cached.includes(s.name),a=NW_dnsSteps(s.name,hit1).map(x=>({...x,round:1}));
  const cacheAfter=hit1?s.cached.slice():s.cached.concat([s.name]);let fr=a.map(x=>({...x,cache:x.store||hit1?cacheAfter:s.cached}));
  if(s.twice)fr=fr.concat([{m:'Later, another browser asks for the same name…',cache:cacheAfter,round:2,pause:true}],NW_dnsSteps(s.name,true).map(x=>({...x,cache:cacheAfter,round:2})));
  return fr;
 },
 draw(s,f,X){
  const d=NW_DNS[s.name];let out=heading('Name → address, one question at a time');
  const NB={browser:[20,165,100,50,'Browser'],resolver:[165,165,140,50,'Resolver'],root:[400,60,180,50,'Root server'],tld:[400,165,180,50,d.tld+' servers'],auth:[400,270,180,50,d.zone]};
  const act=new Set([f.a,f.b,f.c?'resolver':null]);
  for(const k in NB){const [x,y,w,h,l]=NB[k];out+=R(x,y,w,h,act.has(k)?C.pale:'#fff',act.has(k)?C.blue:C.line,9)+T(x+w/2,y+h/2+5,l,14,C.ink,'middle','font-weight="650"')}
  out+=TF(70,236,'your computer',13,C.muted)+TF(490,52,'name servers on the internet',13,C.muted);
  const anchor=(k,toward)=>{const [x,y,w,h]=NB[k];const cx=x+w/2,cy=y+h/2;if(k==='browser')return [x+w,cy];if(k==='resolver')return toward==='browser'?[x,cy]:[x+w,cy];return [x,cy]};
  if(f.a){const [x0,y0]=anchor(f.a,f.b),[x1,y1]=anchor(f.b,f.a),dx=x1-x0,dy=y1-y0,dd=Math.hypot(dx,dy),off=(f.a==='resolver'&&f.b!=='browser')||f.a==='browser'?-7:7,ox=-dy/dd*off,oy=dx/dd*off;
   const reply=f.b==='resolver'||f.b==='browser',col=reply?C.green:C.blue,u=smooth(X.u);
   out+=arrow(x0+ox,y0+oy,x1+ox,y1+oy,col,2.5,9)+Ci(lerp(x0,x1,u)+ox,lerp(y0,y1,u)+oy,6,col)}
  // Cache box
  const cache=f.cache||[];out+=R(165,232,140,96,f.c?C.amberp:'#fff',f.c?C.amber:C.grid,8)+T(235,251,'Resolver cache',13,C.muted,'middle','font-weight="650"');
  if(!cache.length)out+=T(235,286,'(empty)',13,C.muted);
  cache.slice(-2).forEach((n,i)=>out+=TM(173,272+i*30,n.length>17?n.slice(0,16)+'…':n,12.5,C.ink,'start')+TM(173,286+i*30,'→ '+NW_DNS[n].ip,12.5,C.green,'start'));
  const steps=X.n?SCENES.dns.trace(s).slice(0,X.k+1):[],sent=steps.filter(q=>q.a&&q.round===f.round).length;
  out+=counter(20,62,`messages, lookup ${f.round||1}`,sent,f.round===2||s.cached.includes(s.name)&&!s.twice?C.green:C.blue,130);
  out+=R(20,340,560,32,'#fff',C.grid,8)+T(300,361,f.m,14,C.ink);
  const ph=f.round===2&&f.a==='resolver'&&f.b==='browser'?`The second lookup took 2 messages instead of 8, because the resolver remembered ${d.ip}.`:f.m+(f.a&&f.b==='resolver'&&f.a!=='browser'?' Each server only knows the next place to ask.':'');
  return {svg:out,phase:ph};
 }});

/* ---- HTTP ---- */
const NW_HTTP={
 home:{label:'GET /',req:['GET / HTTP/1.1','Host: example.com','Accept: text/html'],route:0,code:200,status:'200 OK',head:['Content-Type: text/html','Content-Length: 16'],body:'<h1>Welcome</h1>',page:'Welcome',path:'/'},
 missing:{label:'GET /missing',req:['GET /missing HTTP/1.1','Host: example.com','Accept: text/html'],route:3,code:404,status:'404 Not Found',head:['Content-Type: text/html','Content-Length: 18'],body:'<h1>Not found</h1>',page:'Not found',path:'/missing'},
 contact:{label:'POST /contact',req:['POST /contact HTTP/1.1','Host: example.com','Content-Length: 15','','name=Ada&msg=Hi'],route:1,code:303,status:'303 See Other',head:['Location: /thanks','Content-Length: 0'],body:'',page:'→ now GET /thanks',path:'/contact'},
 admin:{label:'GET /admin',req:['GET /admin HTTP/1.1','Host: example.com','Accept: text/html'],route:2,code:403,status:'403 Forbidden',head:['Content-Type: text/html','Content-Length: 19'],body:'<h1>Staff only</h1>',page:'Staff only',path:'/admin'}};
const NW_ROUTES=['GET /  → home page','POST /contact → save, redirect','GET /admin → staff only','anything else → 404'];
SCENE({id:'http',name:'HTTP',tag:'Requests and responses',
 definition:'The Hypertext Transfer Protocol: a browser sends a text request naming a method and a path, and the server sends back a response with a status code, headers and usually a body.',
 example:'GET /missing gets “404 Not Found”. Submitting a form with POST often gets “303 See Other”, telling the browser where to go next. HTTPS is the same conversation inside an encrypted connection.',
 desc:'A browser and a server exchange a request and a response; the request text, the server’s matching route, the response with its status code highlighted, and the rendered page are shown.',
 dur:10,hint:'Choose a request and step through: request out, route matched, response back, page shown.',
 init:()=>({req:'home'}),
 ui:[{choose:Object.keys(NW_HTTP).map(k=>[k,NW_HTTP[k].label]),label:'Request',get:s=>s.req,act:'req'}],
 on:{req(s,v){s.req=v}},
 trace:()=>[{m:'The browser writes a request: a method, a path and some headers.'},{m:'The request travels to the server.'},{m:'The server matches the method and path against its routes.'},{m:'The response travels back, starting with a status line.'},{m:'The browser acts on the response.'}],
 draw(s,f,X){
  const q=NW_HTTP[s.req],k=X.k,u=smooth(X.u),col=q.code<300?C.green:q.code<400?C.blue:C.coral;let out=heading('Request → response');
  out+=box(20,44,120,40,'Browser',C.pale,C.ink,15)+box(460,44,120,40,'example.com',C.pale,C.ink,15)+L(140,64,460,64,C.line,2,'stroke-dasharray="4 4"');
  if(k===1)out+=NW_chip(lerp(170,430,u),64,q.label.split(' ')[0],C.blue,58);
  if(k===3)out+=NW_chip(lerp(430,170,u),64,String(q.code),col,50);
  const panel=(x,y,w,h,title,lines,hl)=>{let o=R(x,y,w,h,'#fff',C.grid,9)+T(x+10,y+20,title,13,C.muted,'start','font-weight="700"');lines.forEach((l,i)=>{if(i===0&&hl)o+=R(x+5,y+29+i*18,w-10,20,hl+'22',hl,5);o+=TM(x+12,y+44+i*18,l,13,i===0?C.ink:C.muted,'start',i===0?'font-weight="700"':'')});return o};
  out+=panel(20,100,280,122,'Request',q.req,null);
  out+=R(20,234,280,112,'#fff',C.grid,9)+T(30,254,'Server’s routes',13,C.muted,'start','font-weight="700"');
  NW_ROUTES.forEach((r,i)=>{const on=k>=2&&i===q.route;out+=R(25,262+i*20,270,19,on?C.amberp:'none',on?C.amber:'none',5)+TM(34,276+i*20,r,12.5,on?C.ink:C.muted,'start',on?'font-weight="700"':'')});
  if(k>=3){out+=panel(312,100,268,148,'Response',['HTTP/1.1 '+q.status,...q.head,'',q.body].filter((l,i,a)=>i<a.length-1||l),col)}
  else out+=R(312,100,268,148,'none',C.grid,9,'stroke-dasharray="5 5"')+T(446,178,'response not yet sent',13,C.muted);
  out+=R(312,258,268,112,'#fff',C.grid,9)+R(312,258,268,24,C.grid,'none',9)+TM(322,275,'example.com'+(q.code===303&&k>=4?'/thanks':q.path),12.5,C.muted,'start');
  if(k>=4)out+=TB(446,330,q.page,q.code===303?15:22,q.code===303?C.blue:C.ink);
  const meaning={200:'200 means success: here is the page.',404:'404 means the server has nothing at that path.',303:'303 means “done; now go and GET the address in Location”.',403:'403 means the server understood but refuses: you are not allowed.'}[q.code];
  return {svg:out,phase:f.m+(k>=3?' '+meaning:'')};
 }});

/* ---- Symmetric encryption (Caesar) ---- */
const NW_AZ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NW_shift=(t,k)=>t.toUpperCase().replace(/[A-Z]/g,c=>NW_AZ[(NW_AZ.indexOf(c)+k+26)%26]);
SCENE({id:'encryption',name:'Encryption',tag:'Scrambling with a shared secret',
 definition:'Turning readable plaintext into unreadable ciphertext with a key, so that only someone with the key can turn it back.',
 example:'The Caesar cipher shifts each letter by the key: with key 3, MEET becomes PHHW. Sender and receiver must share the same secret key, and with only 25 useful keys an attacker can simply try them all.',
 desc:'A plain alphabet above a shifted alphabet; letters of the message are joined to their encrypted partners, with the plaintext and ciphertext shown underneath.',
 dur:11,hint:'Type a message and slide the key. Then switch to “Attack” to see why 25 possible keys is far too few.',
 init:()=>({text:'MEET AT NOON',key:3,mode:'enc'}),
 watch(p){return {text:'MEET AT NOON',key:3,slide:smooth(clamp(p/.35,0,1))*3,reveal:Math.floor(clamp((p-.4)/.45,0,1)*12),mode:p>.9?'enc':'enc'}},
 ui:[{text:'Message',label:'Message',get:s=>s.text,act:'text',max:14},{range:'key',label:'Key',min:0,max:25,get:s=>s.key,act:'key'},{choose:[['enc','Encrypt'],['attack','Attack: try every key']],label:'View',get:s=>s.mode,act:'mode'}],
 on:{text(s,v){s.text=v},key(s,v){s.key=v},mode(s,v){s.mode=v}},
 draw(s,f,X){
  const text=s.text.toUpperCase().slice(0,14),key=s.key,slide=s.slide===undefined?key:s.slide,reveal=s.reveal===undefined?text.length:s.reveal,cipher=NW_shift(text,key);
  let out=heading(s.mode==='attack'?'An attacker simply tries all 26 keys':`Caesar cipher, key ${Math.round(slide)}: each letter moves ${Math.round(slide)} places`);
  if(s.mode==='attack'){
   out+=T(300,58,'Intercepted ciphertext:',14,C.muted)+TM(300,84,cipher||'…',20,C.coral,'middle','font-weight="700" xml:space="preserve"');
   range(26).forEach(k=>{const x=k<13?40:320,y=112+(k%13)*18,cand=NW_shift(cipher,-k),right=k===key;out+=(right?R(x-6,y-13,250,17,C.greenp,C.green,4):'')+TM(x,y,`key ${pad(k,2,' ')}: ${cand}`,13,right?C.green:C.muted,'start',(right?'font-weight="700" ':'')+'xml:space="preserve"')});
   out+=T(300,366,'Only one line reads as words. A computer checks all 26 in microseconds.',14,C.ink);
   return {svg:out,phase:'With a key space of only 26 shifts, brute force wins instantly. Real ciphers such as AES have 2¹²⁸ or more possible keys, far too many to try.'};
  }
  const cw=21,x0=27,used=new Set(text.slice(0,reveal).replace(/[^A-Z]/g,''));
  out+=`<defs><clipPath id="nw-clip"><rect x="${x0}" y="126" width="${26*cw}" height="34"/></clipPath></defs>`;
  out+=T(x0,64,'Plain alphabet',13,C.muted,'start')+T(x0,178,'Cipher alphabet: the plain alphabet slid along by the key',13,C.muted,'start');
  for(let i=0;i<26;i++){const on=used.has(NW_AZ[i]);out+=R(x0+i*cw+1,70,cw-2,26,on?C.pale:'#fff',on?C.blue:C.grid,4)+TM(x0+i*cw+cw/2,88,NW_AZ[i],14,C.ink)}
  const fl=Math.floor(slide),fr=slide-fl;let strip='';
  for(let j=-1;j<=27;j++){const i=((j+fl)%26+26)%26,x=x0+(j-fr)*cw,on=fr<.01&&j>=0&&j<26&&used.has(NW_AZ[j]);strip+=R(x+1,130,cw-2,26,on?C.coralp:'#fff',on?C.coral:C.grid,4)+TM(x+cw/2,148,NW_AZ[i],14,on?C.coral:C.ink)}
  out+=`<g clip-path="url(#nw-clip)">${strip}</g>`;
  if(fr<.01)for(const c of used){const i=NW_AZ.indexOf(c);out+=L(x0+i*cw+cw/2,97,x0+i*cw+cw/2,129,C.coral,1.5)}
  const n=text.length,bw=Math.min(38,540/Math.max(1,n)),bx=300-n*bw/2;
  out+=T(20,198,'Plaintext',13,C.muted,'start')+T(20,268,'Ciphertext',13,C.muted,'start');
  for(let i=0;i<n;i++){const c=text[i],x=bx+i*bw,letter=/[A-Z]/.test(c),shown=i<reveal;
   out+=R(x+2,204,bw-4,32,'#fff',C.blue,6)+TM(x+bw/2,226,c,17,C.ink);
   if(shown){out+=(letter?arrow(x+bw/2,240,x+bw/2,268,C.line,1.5,6):'')+R(x+2,272,bw-4,34,letter?C.coralp:'#fff',letter?C.coral:C.grid,6)+TM(x+bw/2,295,cipher[i],17,letter?C.coral:C.muted,'middle','font-weight="700"')}}
  out+=R(20,322,560,48,C.amberp,'none',8)+T(300,342,'Weak: only 25 useful keys, and common letters (E, T, A) stay common,',13.5,C.ink)+T(300,361,'so the pattern of the language shows through. To decrypt, shift back by the key.',13.5,C.ink);
  return {svg:out,phase:`The same secret key (${key}) is used to encrypt and to decrypt. ${text.trim()?`“${text}” becomes “${cipher}”.`:''} Anyone who learns the key can read every message.`};
 }});

/* ---- Public-key encryption (toy RSA) ---- */
function NW_lock(x,y,open,col=C.dark){return P(open?`M${x-7} ${y}V${y-12}a9 9 0 0 1 18 0V${y-8}`:`M${x-8} ${y}V${y-10}a8 8 0 0 1 16 0V${y}`,col,3.5)+R(x-12,y,24,19,col,'none',4)+Ci(x,y+9,2.6,'#fff')}
SCENE({id:'public-key',name:'Public-key encryption',tag:'A lock anyone can close',
 definition:'Each person has two linked keys: a public key that anyone may use to lock (encrypt) a message, and a private key, kept secret, that alone can unlock it.',
 example:'Bob publishes the open padlock (e = 3, n = 33). Alice locks the number 4: 4³ mod 33 = 31. Only Bob’s private key unlocks it: 31⁷ mod 33 = 4. Real keys use numbers hundreds of digits long.',
 desc:'Bob sends an open padlock (his public key) to Alice, who locks a number with it; an eavesdropper sees the padlock and the locked number, but only Bob’s private key recovers the message.',
 dur:13,hint:'Slide the message number m (0–32) and step through: lock with the public key, unlock with the private key.',
 init:()=>({m:4}),
 ui:[{range:'m',label:'Message m',min:0,max:32,get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v}},
 trace:()=>[{m:'Bob picks two primes, 3 and 11, and makes n = 33. His public key is (e = 3, n = 33); his private key is d = 7, kept secret.'},
  {m:'Bob sends the open padlock (his public key) to Alice. Anyone can see and copy it, including Eve.'},
  {m:'Alice locks her message with the public key: c = m³ mod 33.'},
  {m:'The locked number travels to Bob. Eve sees it too, but cannot undo it with the public key.'},
  {m:'Bob unlocks with his private key: m = c⁷ mod 33. He gets Alice’s message back.'},
  {m:'To find d, Eve would need to split n into its two primes. For 33 that is easy; for a 600-digit n no known method finishes in the lifetime of the universe.'}],
 draw(s,f,X){
  const m=s.m,c=NW_mod(m,3,33),back=NW_mod(c,7,33),k=X.k,u=smooth(X.u);let out=heading('Lock with the public key, unlock with the private key');
  out+=box(20,46,150,44,'Alice (sender)',C.pale,C.ink,15)+box(430,46,150,44,'Bob (receiver)',C.pale,C.ink,15)+L(170,68,430,68,C.line,2,'stroke-dasharray="4 4"');
  if(k===1)out+=NW_lock(lerp(410,190,u),58,true,C.green);
  if(k===3)out+=NW_lock(lerp(190,400,u)-14,58,false,C.coral)+TB(lerp(190,400,u)+14,74,c,15,C.coral,'start');
  // Bob's panel
  out+=R(400,104,190,140,'#fff',C.grid,9)+TM(410,128,'n = 3 × 11 = 33',13,C.ink,'start')+TM(410,150,'public  e = 3',13,C.green,'start','font-weight="700"')+TM(410,172,'private d = 7',13,C.coral,'start','font-weight="700"');
  out+=NW_lock(570,152,true,C.green);
  if(k>=4)out+=TM(410,200,`${c}⁷ = ${NW_pow(c,7)}`,12.5,C.ink,'start')+TM(410,224,`mod 33 = ${back}`,15,C.blue,'start','font-weight="700"')+(back===m?T(560,224,'✓',17,C.green,'middle','font-weight="700"'):'');
  // Alice's panel
  out+=R(10,104,200,140,'#fff',C.grid,9)+TM(20,128,`message m = ${m}`,14,C.ink,'start','font-weight="700"');
  if(k>=1)out+=NW_lock(186,124,true,C.green)+TM(20,150,'has key (3, 33)',12.5,C.green,'start');
  if(k>=2)out+=TM(20,178,`c = ${m}³ mod 33`,14,C.ink,'start')+TM(20,202,`  = ${NW_pow(m,3)} mod 33`,14,C.ink,'start','xml:space="preserve"')+TM(20,228,`  = ${c}`,16,C.coral,'start','font-weight="700" xml:space="preserve"')+NW_lock(186,214,false,C.coral);
  // Eve
  out+=R(200,262,200,108,C.coralp,'none',10)+TB(300,282,'Eve (listening)',14,C.coral)+T(300,304,k>=1?'saw the public key (3, 33)':'has seen nothing yet',13,C.ink)+T(300,324,k>=3?`saw the locked number ${c}`:'',13,C.ink)+T(300,346,k>=5?'needs d: must factor 33 = 3 × 11':'cannot unlock without d',13,k>=5?C.coral:C.muted);
  out+=T(105,268,'Anyone can lock;',13,C.muted)+T(105,286,'only Bob can unlock.',13,C.muted);
  return {svg:out,phase:f.m+(k===2?` For m = ${m}: ${m}³ = ${NW_pow(m,3)}, and ${NW_pow(m,3)} mod 33 = ${c}.`:'')};
 }});

/* ---- Digital signature ---- */
const NW_digest=t=>{let h=0;for(const ch of t)h=(h*31+ch.codePointAt(0))%33;return h};
SCENE({id:'digital-signature',name:'Digital signature',tag:'Proving who wrote it',
 definition:'A value computed from a message with the sender’s private key. Anyone can check it with the sender’s public key, and any change to the message makes the check fail.',
 example:'Alice digests “Pay Bob £10” to a short number and raises it to her private power. Bob recomputes the digest and checks it against the signature using her public key. Change £10 to £90 and the two no longer match.',
 desc:'Alice digests a message and signs the digest with her private key; Bob receives the message and signature, digests the message himself and checks the signature with Alice’s public key.',
 dur:12,hint:'Edit the received message to tamper with it, or press Sign to have Alice sign the new text. Step through to see the check.',
 init:()=>({signed:'Pay Bob £10',received:'Pay Bob £10'}),
 ui:[{text:'Received message',label:'Received message',get:s=>s.received,act:'edit',max:20},{b:'Tamper: £10 → £90',act:'tamper'},{b:'Sign',act:'sign',aria:'Alice signs the current message'}],
 on:{edit(s,v){s.received=v},tamper(s){s.received=s.received.includes('£10')?s.received.replace('£10','£90'):s.received+'!'},sign(s){s.signed=s.received}},
 trace:()=>[{m:'Alice writes the message.'},{m:'She squeezes it into a short digest (here a number from 0 to 32).'},{m:'She signs the digest with her private key: s = h⁷ mod 33.'},{m:'The message and the signature travel to Bob.'},{m:'Bob digests the message he received.'},{m:'Bob unlocks the signature with Alice’s public key, s³ mod 33, and compares.'}],
 draw(s,f,X){
  const k=X.k,u=smooth(X.u),h=NW_digest(s.signed),sig=NW_mod(h,7,33),h2=NW_digest(s.received),check=NW_mod(sig,3,33),ok=check===h2;let out=heading('Sign with the private key, check with the public key');
  out+=box(20,46,190,44,'Alice signs',C.pale,C.ink,15)+box(390,46,190,44,'Bob checks',C.pale,C.ink,15)+L(210,68,390,68,C.line,2,'stroke-dasharray="4 4"');
  if(k===3)out+=NW_chip(lerp(240,360,u),68,'msg + '+sig,C.purple,80);
  out+=R(10,104,210,170,'#fff',C.grid,9)+T(20,126,'Message',13,C.muted,'start')+TM(20,148,s.signed,13.5,C.ink,'start','font-weight="700" xml:space="preserve"');
  if(k>=1)out+=T(20,176,'Digest',13,C.muted,'start')+TM(20,198,`h = ${h}`,15,C.ink,'start');
  if(k>=2)out+=T(20,226,'Sign with private d = 7',13,C.muted,'start')+TM(20,250,`s = ${h}⁷ mod 33 = ${sig}`,14,C.purple,'start','font-weight="700"');
  out+=R(380,104,210,170,'#fff',C.grid,9)+T(390,126,'Received message',13,C.muted,'start');
  if(k>=3)out+=TM(390,148,s.received,13.5,s.received===s.signed?C.ink:C.coral,'start','font-weight="700" xml:space="preserve"');
  if(k>=4)out+=T(390,176,'Digest of what arrived',13,C.muted,'start')+TM(390,198,`h′ = ${h2}`,15,C.ink,'start');
  if(k>=5)out+=T(390,226,'Check with public e = 3',13,C.muted,'start')+TM(390,250,`${sig}³ mod 33 = ${check}`,14,C.green,'start','font-weight="700"');
  if(k>=5){out+=R(130,288,340,46,ok?C.greenp:C.coralp,ok?C.green:C.coral,10)+TB(300,317,ok?`${check} = ${h2}: valid, unchanged, from Alice`:`${check} ≠ ${h2}: invalid, reject it`,16,ok?C.green:C.coral)}
  else out+=T(300,316,'The private key never leaves Alice.',14,C.muted);
  out+=T(300,360,'Toy digest: only 33 possible values. Real digests (SHA-256) have 2²⁵⁶.',13,C.muted);
  let extra='';if(k>=5)extra=ok?(s.received===s.signed?' They match, so the message is exactly what Alice signed.':' They match only by chance: this toy digest has just 33 values. A real digest would catch the change.'):' The digests differ, so the message was changed after signing, or was not signed by Alice.';
  return {svg:out,phase:f.m+extra};
 }});
