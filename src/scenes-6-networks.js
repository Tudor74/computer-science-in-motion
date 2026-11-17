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
 example:'A video call is sent as hundreds of packets a second. Two packets from the same message can take different routes and arrive in a different order.',
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
 definition:'The Hypertext Transfer Protocol: a browser sends a request naming a method and a path, and the server sends back a response with a status code, headers and usually a body. In HTTP/1.1, shown here, both are plain text; HTTP/2 and HTTP/3 carry the same messages in binary frames.',
 example:'GET /missing gets “404 Not Found”. Submitting a form with POST often gets “303 See Other”, telling the browser where to go next. HTTPS is the same conversation inside an encrypted connection.',
 desc:'A browser and a server exchange a request and a response; the HTTP/1.1 request text, the server’s matching route, the response with its status code highlighted, and the rendered page are shown.',
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

/* ===================== Stage 6 lessons: new scenes ===================== */
// Wireframe box for 3D views: c = [x0,y0,z0,x1,y1,z1].
function NW_wire(P,c,col,w=2,extra=''){const [x0,y0,z0,x1,y1,z1]=c,v=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
 return [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].map(([a,b])=>line3(v[a],v[b],P,col,w,extra)).join('')}
// Move along a list of frame positions: the previous frame's spot → this frame's spot.
const NW_tw=(a,b,u)=>[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];

/* ---- Packet lesson: encapsulation ---- */
const NW_LAYERS=[
 {name:'Application',proto:'HTTP',col:C.purple,tag:'DATA',fields:'Application data: the HTTP request the browser wants to send.'},
 {name:'Transport',proto:'TCP',col:C.blue,tag:'TCP',fields:'TCP header: port 51515 → port 80, sequence number, checksum. It gets the data to the right program.'},
 {name:'Network',proto:'IP',col:C.green,tag:'IP',fields:'IP header: 10.0.1.5 → 203.0.113.10, TTL 64. It gets the packet to the right computer.'},
 {name:'Link',proto:'Ethernet / Wi-Fi',col:C.amber,tag:'ETH',fields:'Ethernet header and trailer: card → router addresses, plus an error check. It crosses one cable or radio hop.'}];
const NW_ENC_FR=[
 {side:'s',d:1,a:0,say:'The browser hands its request to the network stack. So far it is just data.'},
 {side:'s',d:2,a:1,say:'TCP wraps the data in a header with port numbers and a sequence number.'},
 {side:'s',d:3,a:2,say:'IP wraps that in a header with the source and destination IP addresses.'},
 {side:'s',d:4,a:3,say:'The link layer adds a header and a trailer for this one hop, then sends it as bits.'},
 {side:'w',d:4,a:-1,say:'On the wire there are only bits. Every router on the way unwraps and rewraps the link layer only.'},
 {side:'r',d:3,a:3,say:'The receiver’s link layer checks the trailer and removes the outer envelope.'},
 {side:'r',d:2,a:2,say:'IP checks the address is this computer and removes its header.'},
 {side:'r',d:1,a:1,say:'TCP puts the data in order, acknowledges it and removes its header.'},
 {side:'r',d:1,a:0,say:'The web server program receives exactly the bytes the browser sent. Each layer only read its own header.'}];
SCENE({id:'encapsulation',name:'Protocol layers and encapsulation',tag:'Envelopes inside envelopes',
 definition:'Network software is built in layers. On the way out, each layer wraps the data from the layer above in its own header; on the way in, each layer removes only its own header.',
 example:'An HTTP request goes inside a TCP segment, which goes inside an IP packet, which goes inside an Ethernet frame. Wi-Fi can replace Ethernet without HTTP noticing.',
 desc:'A sender’s and a receiver’s four-layer stacks; a packet bar gains a header at each layer going down and loses one at each layer going up.',
 dur:12,hint:'Type the data, then step down the sender’s stack and up the receiver’s. Press any header to read what it carries.',
 init:()=>({msg:'GET /index.html',sel:null}),
 ui:[{text:'Data',label:'Data',get:s=>s.msg,act:'msg',max:16}],
 on:{msg(s,v){s.msg=v},sel(s,i){s.sel=Number(i);return 'keep'}},
 trace:()=>NW_ENC_FR,
 draw(s,f,X){
  let out=heading('Each layer wraps what it is given');
  const stack=(x,side)=>{let o=TBF(x+60,48,side==='s'?'Sender':'Receiver',14,C.ink);
   for(let i=0;i<4;i++){const Ly=NW_LAYERS[i],y=56+i*44,on=f.side===side&&f.a===i;o+=R(x,y,120,38,on?Ly.col:'#fff',Ly.col,8)+TBF(x+60,y+16,Ly.name,13,on?'#fff':C.ink)+TF(x+60,y+32,Ly.proto,13,on?'#fff':C.muted)}return o};
  out+=stack(20,'s')+stack(460,'r');
  if(f.side==='s')out+=arrow(158,62,158,222,C.line,2.5,9)+TF(170,148,'wrap',13,C.muted,'start');
  if(f.side==='r')out+=arrow(442,222,442,62,C.line,2.5,9)+TF(430,148,'unwrap',13,C.muted,'end');
  out+=L(80,240,520,240,f.side==='w'?C.amber:C.line,3)+TF(300,234,'cable or radio: only bits',13,C.muted);
  if(f.side==='w')for(let i=0;i<9;i++){const x=80+((i/9+X.u*.11)%1)*440;out+=TMF(x,256,i%3?'1':'0',13,C.amber)}
  // The packet bar: outer headers first, then the data, then the link trailer.
  const msg=s.msg.slice(0,16)||'(empty)',segs=[];for(let i=f.d-1;i>=1;i--)segs.push({i,w:58,label:NW_LAYERS[i].tag});
  segs.push({i:0,w:Math.max(110,msg.length*8.4+20),label:msg,data:true});if(f.d===4)segs.push({i:3,w:44,label:'FCS'});
  const total=sum(segs.map(g=>g.w));let x=300-total/2;const sel=s.sel===null?f.a:s.sel;
  segs.forEach(g=>{const Ly=NW_LAYERS[g.i],on=g.i===sel,inner=R(x,272,g.w-3,38,g.data?C.purplep:Ly.col,on?C.ink:'none',6)+(g.data?TMF(x+g.w/2-1.5,296,g.label,13,C.ink,'middle','xml:space="preserve"'):TBF(x+g.w/2-1.5,296,g.label,13,'#fff'));
   out+=hit(X,'sel',g.i,`${Ly.name} layer: ${Ly.fields}`,inner);x+=g.w});
  const Lsel=NW_LAYERS[clamp(sel,0,3)];out+=TF(300,336,Lsel.fields,13,C.ink)+TF(300,360,`${f.d} layer${f.d>1?'s':''} of wrapping · ${f.d>1?Math.min(f.d-1,2)*20+(f.d===4?18:0):0} bytes of headers around ${msg.length} bytes of data`,13,C.muted);
  return {svg:out,phase:f.say};
 },
 three(s,f,X,project){
  const P=project([[-3.2,-2.2,-1.6],[3.2,2.2,1.6]]);let out='';
  const box=i=>{const m=.55*i;return [-1.4-m,-.7-m*.7,-.45-m*.55,1.4+m,.7+m*.7,.45+m*.55]};
  out+=paintFaces(prism(-1.4,-.7,-.45,2.8,1.4,.9,C.purple).map((q,j)=>j===5?{...q,label:'data',ink:'#fff'}:q),P);
  const labs=[];
  for(let i=1;i<f.d;i++){const c=box(i),Ly=NW_LAYERS[i];out+=NW_wire(P,c,Ly.col,i===f.a?3.2:2);
   // Label each envelope at its right-most corner; keep labels at least 20 px apart vertically.
   const q=[[c[0],c[1],c[5]],[c[3],c[1],c[5]],[c[0],c[4],c[5]],[c[3],c[4],c[5]],[c[0],c[1],c[2]],[c[3],c[1],c[2]],[c[0],c[4],c[2]],[c[3],c[4],c[2]]].map(P).sort((u,v)=>v[0]-u[0])[0];
   let y=q[1];for(const l of labs)if(Math.abs(l-y)<20)y=l+20;labs.push(y);out+=TB(q[0]+10,y+5,Ly.tag,15,Ly.col,'start')}
  return {svg:out,title:'Nested envelopes',caption:`${f.d===1?'Only the data, no envelopes yet.':`${f.d-1} envelope${f.d>2?'s':''} around the data: ${range(f.d-1).map(i=>NW_LAYERS[i+1].tag).reverse().join(' around ')} around the data.`} Each layer only ever opens its own envelope.`};
 }});

/* ---- Packet lesson: checksum ---- */
const NW_CS_MSG='HELLO',NW_CS_BYTES=Array.from(NW_CS_MSG).map(c=>c.charCodeAt(0));
SCENE({id:'checksum',name:'Checksum',tag:'Spotting damage in transit',
 definition:'A small number calculated from the data and sent with it. The receiver recalculates it; if the two differ, the data was damaged on the way.',
 example:'Add the bytes of HELLO: 72 + 69 + 76 + 76 + 79 = 372, and send 372 mod 256 = 116. If noise flips one bit, the receiver’s sum changes and the packet is rejected.',
 desc:'The sender adds up five bytes and sends the total with them; the receiver’s bytes, some with flipped bits, are added up again and compared.',
 dur:10,hint:'Press bits on the receiver’s side to simulate noise. Try “Two errors that cancel” to see what a simple checksum can miss.',
 init:()=>({flips:['2,5']}),
 ui:[{b:'One flipped bit',act:'one'},{b:'Two errors that cancel',act:'cancel'},{b:'Clean line',act:'clean'}],
 on:{flip(s,a){const i=s.flips.indexOf(a);if(i>=0)s.flips.splice(i,1);else s.flips.push(a);return 'end'},one(s){s.flips=['2,5'];return 'end'},cancel(s){s.flips=['0,7','1,7'];return 'end'},clean(s){s.flips=[];return 'end'}},
 trace:()=>[{k:0,say:'The sender adds up the bytes of the message.'},{k:1,say:'It keeps the remainder after dividing by 256, so the checksum fits in one byte, and sends it with the data.'},{k:2,say:'Noise may flip bits on the way. The receiver adds up the bytes it actually got.'},{k:3,say:''}],
 draw(s,f,X){
  const k=f.k,rec=NW_CS_BYTES.map((b,i)=>s.flips.filter(q=>Number(q.split(',')[0])===i).reduce((v,q)=>v^(1<<(7-Number(q.split(',')[1]))),b));
  const sumS=sum(NW_CS_BYTES),csS=sumS%256,sumR=sum(rec),csR=sumR%256,damaged=s.flips.length>0,ok=csS===csR;
  let out=heading('Add it up before and after');
  out+=TB(130,56,'Sender',15)+TB(462,56,'Receiver',15);
  NW_CS_BYTES.forEach((b,i)=>{const y=68+i*32;out+=TMF(30,y+19,NW_CS_MSG[i],16,C.ink,'start','font-weight="700"')+TMF(56,y+19,pad(b,3,' '),14,C.muted,'start','xml:space="preserve"')+TMF(92,y+19,bin(b,8),14,C.ink,'start');
   if(k>=2){const r=rec[i],ch=r>=32&&r<127?String.fromCharCode(r):'?',bad=r!==b;out+=TMF(330,y+19,ch,16,bad?C.coral:C.ink,'start','font-weight="700"')+TMF(352,y+19,pad(r,3,' '),14,bad?C.coral:C.muted,'start','xml:space="preserve"');
    bin(r,8).split('').forEach((d,j)=>{const fl=s.flips.includes(i+','+j);out+=hit(X,'flip',i+','+j,`Received byte ${i+1}, bit ${j+1}: ${d}${fl?', flipped by noise':''}. Press to flip.`,R(390+j*24,y+2,22,24,fl?C.coralp:'#fff',fl?C.coral:C.grid,4)+TMF(401+j*24,y+19,d,14,fl?C.coral:C.ink))})}});
  out+=L(30,234,250,234,C.line,1.5)+TMF(30,256,`sum ${sumS}`,15,C.ink,'start');
  if(k>=1){out+=TMF(30,280,`${sumS} mod 256 = ${csS}`,15,C.blue,'start','font-weight="700"')+arrow(250,276,320,276,C.blue,2,8)+NW_chip(285,262,'+'+csS,C.blue,52)}
  if(k>=2)out+=L(330,234,582,234,C.line,1.5)+TMF(330,256,`sum ${sumR}`,15,C.ink,'start')+TMF(330,280,`${sumR} mod 256 = ${csR}`,15,ok?C.green:C.coral,'start','font-weight="700"');
  let say=f.say;
  if(k>=3){const col=!ok?C.coral:damaged?C.amber:C.green,fill=!ok?C.coralp:damaged?C.amberp:C.greenp;
   const msg=!ok?`${csR} ≠ ${csS}: damaged, so discard it`:damaged?`${csR} = ${csS}, yet the data is wrong!`:`${csR} = ${csS}: accept the data`;
   out+=R(110,302,380,40,fill,col,10)+TB(300,328,msg,16,col);
   say=!ok?'The checksums differ, so the receiver knows the packet was damaged and throws it away; TCP will get it resent.':damaged?'Two flips changed the sum by +1 and −1, so the totals still match and the damage slips through. Real links use stronger checks (CRCs) that catch this.':'No bits were flipped, so both sides get the same checksum.'}
  out+=TF(300,366,'Checksums detect accidents, not attackers: anyone can recompute one.',13,C.muted);
  return {svg:out,phase:say};
 }});

/* ---- Packet lesson: bandwidth and latency ---- */
function NW_bl(s){const send=i=>Math.floor(i/s.bw),done=send(s.size-1)+s.lat;return {send,done}}
SCENE({id:'bandwidth-latency',name:'Bandwidth and latency',tag:'A wide pipe or a short one',
 definition:'Bandwidth is how much data a link carries per second (the width of the pipe); latency is how long one piece takes to get through (the length of the pipe).',
 example:'Sending a large file is mostly limited by bandwidth; a quick game move or a web page made of many small requests is mostly limited by latency. Total time ≈ latency + size ÷ bandwidth.',
 desc:'A pipe whose width is the bandwidth and whose length is the latency; packets enter at the left, cross, and are counted as they arrive on the right.',
 dur:12,hint:'Change the width (bandwidth), length (latency) and file size, then Run. Which one helps a 1-packet message?',
 init:()=>({bw:3,lat:5,size:12}),
 ui:[{range:'bw',label:'Bandwidth (packets per tick)',min:1,max:6,get:s=>s.bw,act:'bw'},{range:'lat',label:'Latency (ticks)',min:1,max:10,get:s=>s.lat,act:'lat'},{range:'size',label:'File size (packets)',min:1,max:24,get:s=>s.size,act:'size'}],
 on:{bw(s,v){s.bw=v},lat(s,v){s.lat=v},size(s,v){s.size=v}},
 trace(s){const {done}=NW_bl(s);return range(done+2).map(t=>({t}))},
 draw(s,f,X){
  const {send,done}=NW_bl(s),last=X.k>=X.n-1,t=f.t+(last?0:X.u),len=Math.max(60,s.lat*42),h=s.bw*14+6,x0=110,cy=158,top=cy-h/2;
  let out=heading('Width carries more at once; length sets the delay');
  out+=box(20,cy-26,78,52,'Sender',C.pale,C.ink,14)+box(x0+len+12,cy-26,82,52,'Receiver',C.pale,C.ink,14);
  out+=R(x0,top,len,h,'#eef5fa',C.blue,h/2>14?14:h/2);
  out+=L(x0,top-14,x0+len,top-14,C.muted,1.5)+TF(x0+len/2,top-20,`latency ${s.lat} tick${s.lat>1?'s':''}`,13,C.muted);
  out+=L(x0-8,top,x0-8,top+h,C.muted,1.5)+TF(x0,top+h+18,`width ${s.bw} (bandwidth)`,13,C.muted,'start');
  let arrived=0;
  for(let i=0;i<s.size;i++){const st=send(i);if(t>=st+s.lat){arrived++;continue}if(t<st)continue;const x=x0+(t-st)/s.lat*len,y=top+4+(i%s.bw)*14;out+=R(x-5,y,10,11,C.blue,'none',2)}
  out+=counter(20,232,'ticks so far',fmt(Math.min(t,done+1)),C.blue,128)+counter(160,232,'arrived',`${arrived} of ${s.size}`,arrived===s.size?C.green:C.blue,128);
  const tiny=s.lat+1,file=done+1;
  const bw=v=>Math.max(4,v*260/Math.max(tiny,file,1));
  out+=TF(310,244,`1-packet message: ${tiny} ticks`,13,C.ink,'start')+R(310,250,bw(tiny),12,C.purple,'none',4);
  out+=TF(310,280,`this file (${s.size} packets): ${file} ticks`,13,C.ink,'start')+R(310,286,bw(file),12,C.blue,'none',4);
  out+=TF(300,322,`≈ latency + size ÷ bandwidth = ${s.lat} + ${s.size} ÷ ${s.bw} ≈ ${fmt(s.lat+s.size/s.bw)} ticks`,14,C.ink);
  out+=TF(300,352,'A wider pipe shortens big transfers; only a shorter pipe helps tiny messages.',13,C.muted);
  return {svg:out,phase:t<=0?'Packets queue at the sender. Each tick, as many as the bandwidth allows enter the pipe.':arrived===s.size?`All ${s.size} packets are through after ${file} ticks. A single packet would still need ${tiny}: no amount of bandwidth removes the latency.`:`Each packet spends ${s.lat} ticks in the pipe; ${s.bw} can travel side by side. ${arrived} of ${s.size} have arrived.`};
 }});

/* ---- IP routing lesson: subnet masks ---- */
const NW_ipStr=a=>a.join('.'),NW_ipNum=a=>((a[0]<<24)|(a[1]<<16)|(a[2]<<8)|a[3])>>>0,NW_numIp=n=>[n>>>24&255,n>>>16&255,n>>>8&255,n&255];
const NW_maskNum=p=>p===0?0:(0xFFFFFFFF<<(32-p))>>>0;
SCENE({id:'subnet-mask',name:'Subnet mask',tag:'Which addresses are neighbours?',
 definition:'A mask that splits an IP address into a network part and a host part. A computer ANDs an address with the mask: if two addresses give the same network part, they are on the same local network.',
 example:'With /24 (255.255.255.0), 192.168.1.77 and 192.168.1.200 share the network 192.168.1.0, so they talk directly. With /25 they do not, and traffic between them goes through a router.',
 desc:'Two IP addresses written in bits, each ANDed with the same mask; the resulting network parts are compared to decide whether to deliver directly or via a router.',
 dur:12,hint:'Change the prefix length and the second address. Watch which bits survive the AND, and whether the network parts still match.',
 init:()=>({a:[192,168,1,77],b3:1,b4:200,prefix:24}),
 watch(p){return {a:[192,168,1,77],b3:1,b4:200,prefix:16+Math.min(12,Math.floor(p*13))}},
 ui:[{range:'prefix',label:'Prefix /',min:8,max:30,get:s=>s.prefix,act:'prefix'},{range:'b3',label:'B third number',min:0,max:255,get:s=>s.b3,act:'b3'},{range:'b4',label:'B last number',min:0,max:255,get:s=>s.b4,act:'b4'}],
 on:{prefix(s,v){s.prefix=v},b3(s,v){s.b3=v},b4(s,v){s.b4=v}},
 draw(s){
  const A=NW_ipNum(s.a),B=NW_ipNum([192,168,s.b3,s.b4]),M=NW_maskNum(s.prefix),na=(A&M)>>>0,nb=(B&M)>>>0,same=na===nb;
  let out=heading(`Mask /${s.prefix}: the first ${s.prefix} bits name the network`);
  const row=(y,label,val,kind)=>{let o=TBF(10,y+14,label,13,kind==='mask'?C.amber:C.ink,'start')+TMF(10,y+31,NW_ipStr(NW_numIp(val)),13,C.muted,'start');
   for(let i=0;i<32;i++){const bit=val>>>(31-i)&1,o8=Math.floor(i/8),x=150+o8*110+(i%8)*13,net=i<s.prefix;
    const fill=kind==='mask'?(bit?C.amberp:'#fff'):kind==='net'?(net?(same?C.greenp:C.coralp):'#f4f6f7'):(net?C.pale:'#fff');
    o+=R(x,y+2,12,26,fill,kind==='mask'&&bit?C.amber:C.grid,3)+TMF(x+6,y+20,bit,13,kind==='net'&&!net?C.line:C.ink)}return o};
  out+=row(46,'A',A,'ip')+row(80,'mask',M,'mask')+row(114,'A AND mask',na,'net');
  out+=row(170,'B',B,'ip')+row(204,'mask',M,'mask')+row(238,'B AND mask',nb,'net');
  out+=L(150+s.prefix*13+Math.floor((s.prefix-1)/8)*6-2,42,150+s.prefix*13+Math.floor((s.prefix-1)/8)*6-2,272,C.coral,2,'stroke-dasharray="4 3"');
  out+=TF(150,290,'network part ←',13,C.muted,'start')+TF(586,290,'→ host part',13,C.muted,'end');
  out+=R(70,302,460,44,same?C.greenp:C.coralp,same?C.green:C.coral,10)+TB(300,330,same?`Same network ${NW_ipStr(NW_numIp(na))}: deliver directly`:`Different networks: send it to the router`,16,same?C.green:C.coral);
  out+=TF(300,366,`/${s.prefix} leaves ${32-s.prefix} host bits: ${Math.max(0,2**(32-s.prefix)-2).toLocaleString('en-GB')} usable addresses`,13,C.muted);
  return {svg:out,phase:`AND keeps a bit only where the mask has a 1. A’s network part is ${NW_ipStr(NW_numIp(na))}, B’s is ${NW_ipStr(NW_numIp(nb))}. ${same?'They match, so A can reach B without a router.':'They differ in the masked bits, so A hands the packet to its default gateway (router).'}`};
 }});

/* ---- IP routing lesson: NAT ---- */
const NW_NAT={dev:{L1:{ip:'192.168.1.10',at:[70,110]},L2:{ip:'192.168.1.11',at:[70,232]}},router:[300,171],server:[520,171],pub:'81.2.69.160',srv:'93.184.216.34:443'};
function NW_natFrames(who){
 const devs=who==='both'?['L1','L2']:[who],fr=[],table=[];
 devs.forEach((d,i)=>{const pp=40001+i,priv=NW_NAT.dev[d].ip+':5000',pub=NW_NAT.pub+':'+pp;
  fr.push({from:d,to:'router',src:priv,dst:NW_NAT.srv,table:table.slice(),say:`${d} sends from its private address ${priv}. Private 192.168.x.x addresses are not allowed on the public internet.`});
  table.push([priv,pub]);
  fr.push({at:'router',src:pub,dst:NW_NAT.srv,table:table.slice(),hl:table.length-1,say:`The router swaps the source for its own public address and a fresh port, ${pp}, and writes the pair in its NAT table.`});
  fr.push({from:'router',to:'server',src:pub,dst:NW_NAT.srv,table:table.slice(),say:'The server sees only the router’s public address. It cannot tell which device is behind it.'});
  fr.push({from:'server',to:'router',src:NW_NAT.srv,dst:pub,table:table.slice(),reply:true,say:`The reply is addressed to ${pub}.`});
  fr.push({at:'router',src:NW_NAT.srv,dst:priv,table:table.slice(),hl:table.length-1,reply:true,say:`The router looks up port ${pp} in its table and rewrites the destination back to ${priv}.`});
  fr.push({from:'router',to:d,src:NW_NAT.srv,dst:priv,table:table.slice(),reply:true,say:`The reply reaches ${d}.${devs.length>1&&i===0?' Now the second device does the same, with the same port 5000.':''}`});
 });
 fr.push({done:true,table:table.slice(),say:devs.length>1?'Both devices used port 5000 inside, but the router told them apart by giving each a different outside port. Many devices share one public address.':'One public address is enough for the whole home: the router keeps track of who asked for what.'});
 return fr;
}
SCENE({id:'nat',name:'Network address translation',tag:'Many devices, one public address',
 definition:'A home router gives devices private addresses and rewrites their packets to use its single public address, remembering each conversation in a table so replies go back to the right device.',
 example:'Your laptop (192.168.1.10) and phone (192.168.1.11) both browse the web, but every website sees only your router’s public address.',
 desc:'Two home devices send packets through a router that rewrites the source address and port, records the mapping in a NAT table, and reverses it for the replies.',
 dur:14,hint:'Choose who sends, then step through: out through the router, the reply back, and the NAT table filling in.',
 init:()=>({who:'both'}),
 ui:[{choose:[['L1','Laptop'],['L2','Phone'],['both','Both at once']],label:'Who sends',get:s=>s.who,act:'who'}],
 on:{who(s,v){s.who=v}},
 trace:s=>NW_natFrames(s.who),
 draw(s,f,X){
  const N=NW_NAT,pos=k=>k==='router'?N.router:k==='server'?N.server:N.dev[k].at;let out=heading('The router rewrites addresses at the border');
  out+=R(14,48,300,236,'none',C.line,12,'stroke-dasharray="6 5"')+TF(26,66,'Home: private addresses',13,C.muted,'start')+TF(586,66,'Internet: public addresses',13,C.muted,'end');
  for(const d in N.dev){const [x,y]=N.dev[d].at;out+=L(x+48,y,N.router[0]-26,N.router[1],C.line,2)+R(x-50,y-22,100,44,'#fff',C.blue,8)+TBF(x,y-4,d==='L1'?'Laptop':'Phone',13,C.ink)+TMF(x,y+13,N.dev[d].ip,12.5,C.muted)}
  out+=L(N.router[0]+26,N.router[1],N.server[0]-50,N.server[1],C.line,2);
  out+=Ci(N.router[0],N.router[1],26,f.at==='router'?C.amberp:'#fff',f.at==='router'?C.amber:C.blue)+TBF(N.router[0],N.router[1]+5,'Router',13,C.ink)+TMF(N.router[0],N.router[1]+44,N.pub,12.5,C.muted);
  out+=R(N.server[0]-60,N.server[1]-24,120,48,'#fff',C.blue,8)+TBF(N.server[0],N.server[1]-5,'Web server',13,C.ink)+TMF(N.server[0],N.server[1]+13,'93.184.216.34',12.5,C.muted);
  if(!f.done){const a=f.at?pos(f.at):pos(f.from),b=f.at?pos(f.at):pos(f.to),[x,y]=NW_tw(a,b,smooth(X.u)),w=196,col=f.reply?C.green:C.blue;
   out+=R(x-w/2,y-64,w,42,'#fff',col,7)+TMF(x-w/2+8,y-48,'src '+f.src,12.5,C.ink,'start')+TMF(x-w/2+8,y-31,'dst '+f.dst,12.5,C.ink,'start')+Ci(x,y,6,col)}
  out+=R(20,294,560,80,'#fff',C.grid,9)+TBF(32,312,'NAT table (inside ↔ outside)',13,C.ink,'start');
  if(!f.table.length)out+=TF(300,346,'(empty: nothing has gone out yet)',13,C.muted);
  f.table.forEach((r,i)=>{const y=322+i*24,on=f.hl===i;out+=R(26,y,548,22,on?C.amberp:'none',on?C.amber:'none',5)+TMF(40,y+16,r[0],13,C.ink,'start')+TF(300,y+16,'↔',14,C.muted)+TMF(560,y+16,r[1],13,C.ink,'end')});
  return {svg:out,phase:f.say};
 }});

/* ---- IP routing lesson: TTL and traceroute ---- */
const NW_TR={nodes:['You','R1','R2','R3','R4','Server'],ms:[0,3,9,14,22,31]};
function NW_trFrames(s){
 const fr=[],res=[],hops=5;
 const probe=(ttl,record)=>{let pos=0,left=ttl;fr.push({pos,ttl:left,dir:1,res:res.slice(),say:`A packet leaves with TTL ${ttl}.`});
  while(true){pos++;if(pos===hops){fr.push({pos,ttl:left,dir:1,res:res.slice(),reached:true,say:`It reaches the server with TTL ${left} to spare.`});if(record){res.push({hop:pos,name:'Server',ms:NW_TR.ms[pos]})}fr.push({pos:0,from:pos,ttl:null,dir:-1,res:res.slice(),reply:'reply',say:'The server answers normally.'});break}
   left--;if(left===0){fr.push({pos,ttl:0,dir:1,res:res.slice(),dead:true,say:`${NW_TR.nodes[pos]} lowers TTL to 0, drops the packet and sends back “time exceeded”, revealing itself.`});if(record)res.push({hop:pos,name:NW_TR.nodes[pos],ms:NW_TR.ms[pos]});fr.push({pos:0,from:pos,ttl:null,dir:-1,res:res.slice(),reply:'error',say:`The error message comes back from ${NW_TR.nodes[pos]}${record?`, about ${NW_TR.ms[pos]} ms after sending`:''}.`});break}
   fr.push({pos,ttl:left,dir:1,res:res.slice(),say:`${NW_TR.nodes[pos]} lowers TTL to ${left} and forwards it.`})}};
 if(s.mode==='probe')probe(s.ttl,true);else for(let t=1;t<=hops;t++)probe(t,true);
 fr.push({pos:0,ttl:null,res:res.slice(),end:true,say:s.mode==='probe'?(s.ttl>=hops?'With enough TTL the packet arrives. TTL exists so that a packet caught in a routing loop dies instead of circling for ever.':`TTL ${s.ttl} was too small: the packet died at hop ${s.ttl}. Traceroute uses exactly this on purpose.`):'Traceroute sent TTL 1, 2, 3… so each router in turn reported itself: the whole route, with timings.'});
 return fr;
}
SCENE({id:'ttl-traceroute',name:'TTL and traceroute',tag:'A packet with a countdown',
 definition:'Every IP packet carries a time-to-live (TTL) counter. Each router lowers it by one; at zero the packet is dropped and the sender is told. Traceroute uses this to map a route hop by hop.',
 example:'A packet sent with TTL 2 dies at the second router, which replies “time exceeded”. Sending TTL 1, then 2, then 3… makes each router on the path introduce itself.',
 desc:'A path of four routers between you and a server; a packet’s TTL counts down hop by hop until it arrives or is dropped, and traceroute’s results build up in a table.',
 dur:16,hint:'Choose a single packet with a chosen TTL, or run traceroute and watch the table of hops fill in.',
 init:()=>({mode:'trace',ttl:2}),
 ui:[{choose:[['probe','One packet'],['trace','Traceroute']],label:'Mode',get:s=>s.mode,act:'mode'},{range:'ttl',label:'TTL',min:1,max:7,get:s=>s.ttl,act:'ttl'}],
 on:{mode(s,v){s.mode=v},ttl(s,v){s.ttl=v;s.mode='probe'}},
 trace:NW_trFrames,
 draw(s,f,X){
  const xs=[50,150,250,350,450,550],y=150;let out=heading(s.mode==='probe'?`One packet sent with TTL ${s.ttl}`:'Traceroute: TTL 1, 2, 3… until it arrives');
  for(let i=0;i<5;i++)out+=L(xs[i]+24,y,xs[i+1]-24,y,C.line,3);
  NW_TR.nodes.forEach((n,i)=>{const end=i===0||i===5,dead=f.dead&&f.pos===i;out+=end?R(xs[i]-30,y-22,60,44,'#fff',C.blue,8)+TBF(xs[i],y+5,n,13,C.ink):Ci(xs[i],y,22,dead?C.coralp:'#fff',dead?C.coral:C.blue)+TBF(xs[i],y+5,n,14,dead?C.coral:C.ink)});
  const prev=X.k>0?NW_trFrames(s)[X.k-1]:f,u=smooth(X.u);
  if(f.dir===1&&!f.end){const p0=prev&&prev.dir===1&&!prev.end&&prev.pos<f.pos?prev.pos:f.pos,x=lerp(xs[p0],xs[f.pos],u);out+=NW_chip(x,y-40,f.dead?'TTL 0 ✕':'TTL '+f.ttl,f.dead?C.coral:C.blue,70)}
  if(f.dir===-1){const x=lerp(xs[f.from],xs[0],u);out+=NW_chip(x,y+42,f.reply==='error'?'time exceeded':'reply',f.reply==='error'?C.coral:C.green,f.reply==='error'?110:60)}
  out+=R(130,214,340,24,C.pale,'none',6)+TBF(170,231,'hop',13,C.muted)+TBF(300,231,'who answered',13,C.muted)+TBF(430,231,'round trip',13,C.muted);
  if(!f.res.length)out+=TF(300,264,s.mode==='probe'?'(no answer yet)':'(no answers yet)',13,C.muted);
  f.res.forEach((r,i)=>{const yy=256+i*22;out+=TMF(170,yy,r.hop,13,C.ink)+TF(300,yy,r.name,13,C.ink)+TMF(430,yy,r.ms+' ms',13,C.ink)});
  return {svg:out,phase:f.say};
 }});

/* ---- TCP lesson: three-way handshake ---- */
function NW_hs(s){
 const C0=s.isnC,S0=s.isnS,m=[];const L=s.lose==='yes';
 m.push({from:'c',t0:0,t1:2,label:`SYN  seq=${C0}`,say:`The client asks to connect: SYN with its starting sequence number ${C0}.`});
 if(L){m.push({from:'s',t0:2,t1:4,lost:true,label:`SYN-ACK  seq=${S0} ack=${C0+1}`,say:`The server replies SYN-ACK, but the reply is lost.`});
  m.push({from:'c',t0:6,t1:8,label:`SYN  seq=${C0}  (again)`,say:'The client hears nothing; its timer runs out and it resends the SYN.'});
  m.push({from:'s',t0:8,t1:10,label:`SYN-ACK  seq=${S0} ack=${C0+1}`,say:`This time the SYN-ACK arrives: the server’s number is ${S0}, and “ack=${C0+1}” confirms the client’s SYN.`})}
 else m.push({from:'s',t0:2,t1:4,label:`SYN-ACK  seq=${S0} ack=${C0+1}`,say:`The server agrees: SYN-ACK with its own number ${S0}, and ack=${C0+1} meaning “I got your ${C0}”.`});
 const b=L?10:4;m.push({from:'c',t0:b,t1:b+2,label:`ACK  ack=${S0+1}`,say:`The client confirms the server’s number with ack=${S0+1}. Both sides now agree on both starting numbers.`});
 m.push({from:'c',t0:b+2,t1:b+4,label:`data  seq=${C0+1}`,say:`Data can flow. The first byte is numbered ${C0+1}, so the server can put every later byte in order.`});
 return {m,end:b+4};
}
SCENE({id:'tcp-handshake',name:'TCP three-way handshake',tag:'Agreeing before talking',
 definition:'Before sending data, TCP opens a connection with three messages: SYN, SYN-ACK and ACK. Each side picks a starting sequence number and confirms the other’s.',
 example:'Client: “SYN, I start at 100.” Server: “SYN-ACK, I start at 300; I got your 100.” Client: “ACK, I got your 300.” Data then begins at byte 101.',
 desc:'Client and server timelines with the three handshake messages crossing between them, the sequence numbers on each, and both sides’ connection states.',
 dur:12,hint:'Change the starting numbers, or lose the SYN-ACK to see the client wait, give up waiting and try again.',
 init:()=>({isnC:100,isnS:300,lose:'no'}),
 ui:[{range:'isnC',label:'Client starts at',min:0,max:900,step:50,get:s=>s.isnC,act:'c'},{range:'isnS',label:'Server starts at',min:0,max:900,step:50,get:s=>s.isnS,act:'s'},{choose:[['no','Deliver all'],['yes','Lose the SYN-ACK']],label:'Network',get:s=>s.lose,act:'lose'}],
 on:{c(s,v){s.isnC=v},s(s,v){s.isnS=v},lose(s,v){s.lose=v}},
 trace(s){const {end}=NW_hs(s);return range(end+1).map(t=>({t}))},
 draw(s,f,X){
  const {m,end}=NW_hs(s),last=X.k>=X.n-1,Tn=f.t+(last?0:X.u),sp=Math.min(26,250/end),y=t=>84+t*sp,cx=170,sx=430;let out=heading('SYN, SYN-ACK, ACK');
  out+=TB(cx,54,'Client',15)+TB(sx,54,'Server',15)+L(cx,64,cx,350,C.dark,2)+L(sx,64,sx,350,C.dark,2);
  let say='Both sides start with no connection. The server is listening.';
  for(const q of m){if(q.t0>Tn)continue;const pr=clamp((Tn-q.t0)/(q.t1-q.t0),0,1),x0=q.from==='c'?cx:sx,x1=q.from==='c'?sx:cx,y0=y(q.t0),y1=y(q.t1),col=q.label.startsWith('data')?C.purple:q.from==='c'?C.blue:C.green;
   if(q.lost){const qq=Math.min(pr,.5);out+=L(x0,y0,lerp(x0,x1,qq),lerp(y0,y1,qq),C.coral,2.5,'stroke-dasharray="5 4"');if(pr>=.5)out+=TB(lerp(x0,x1,.5),lerp(y0,y1,.5)+6,'✕',18,C.coral)}
   else out+=arrow(x0,y0,lerp(x0,x1,pr),lerp(y0,y1,pr),col,2.5,8);
   const mx=lerp(x0,x1,.5),my=lerp(y0,y1,.5)-10;if(pr>.15)out+=R(mx-92,my-12,184,18,'#fff','none',5)+TMF(mx,my+1,q.label,13,q.lost?C.coral:col,'middle','font-weight="700" xml:space="preserve"');
   say=q.say}
  // Connection states at the current moment.
  const synAck=m.filter(q=>q.from==='s'&&!q.lost),gotSynAck=synAck.some(q=>q.t1<=Tn),gotSyn=m[0].t1<=Tn,ack=m.find(q=>q.label.startsWith('ACK')),gotAck=ack.t1<=Tn;
  const cs=gotSynAck?'ESTABLISHED':'SYN-SENT',ss=gotAck?'ESTABLISHED':gotSyn?'SYN-RECEIVED':'LISTEN';
  out+=R(cx-150,354,130,22,cs==='ESTABLISHED'?C.greenp:C.amberp,'none',6)+TMF(cx-85,370,cs,13,C.ink)+R(sx+20,354,130,22,ss==='ESTABLISHED'?C.greenp:ss==='LISTEN'?'#eef2f4':C.amberp,'none',6)+TMF(sx+85,370,ss,13,C.ink);
  if(last&&f.t>=end)say=`Connected. Three messages were enough for each side to learn and confirm the other’s starting number (${s.isnC} and ${s.isnS}).${s.lose==='yes'?' The lost SYN-ACK only cost a timeout and a retry.':''}`;
  return {svg:out,phase:say};
 }});

/* ---- TCP lesson: sliding window ---- */
const NW_SW_N=12;
function NW_sw(w){
 const snaps=[];let base=1,next=1;const segs=[],acks=[];
 for(let t=0;t<200;t++){
  for(const a of acks)if(a.t0+2===t&&a.n>base)base=a.n;
  for(const g of segs)if(g.t0+2===t)acks.push({n:g.n+1,t0:t});
  // The link can start one segment per tick, so a round trip (4 ticks) holds at most 4 segments.
  if(next<base+w&&next<=NW_SW_N){segs.push({n:next,t0:t});next++}
  snaps.push({t,base,next,segs:segs.filter(g=>g.t0<=t&&g.t0+2>t).map(g=>({...g})),acks:acks.filter(a=>a.t0<=t&&a.t0+2>t).map(a=>({...a}))});
  if(base>NW_SW_N)break;
 }
 return snaps;
}
SCENE({id:'sliding-window',name:'Sliding window',tag:'Keep several segments in flight',
 definition:'TCP lets the sender have several unacknowledged segments on the way at once, up to a window size. As acknowledgements return, the window slides forward. The receiver can shrink the window to stop being flooded (flow control).',
 example:'Waiting for each acknowledgement before sending the next segment wastes a whole round trip per segment. With a window of 4, four segments share each round trip, so a long transfer takes about a quarter of the time (here, 12 segments take 15 ticks instead of 48).',
 desc:'A strip of twelve numbered segments with a bracket marking the window; segments travel to the receiver and acknowledgements come back, and the window slides right as they arrive.',
 dur:14,hint:'Choose a window size, then Run. Compare the finishing times for different windows in the chart.',
 init:()=>({w:3}),
 ui:[{range:'w',label:'Window size',min:1,max:6,get:s=>s.w,act:'w'}],
 on:{w(s,v){s.w=v}},
 trace:s=>NW_sw(s.w),
 draw(s,f,X){
  const w=s.w,x0=72,bw=38,u=X.k>=X.n-1?0:X.u;let out=heading(`Window of ${w}: up to ${w} segment${w>1?'s':''} unacknowledged at once`);
  for(let n=1;n<=NW_SW_N;n++){const x=x0+(n-1)*bw,acked=n<f.base,fl=n>=f.base&&n<f.next,allowed=n>=f.next&&n<f.base+w;
   out+=R(x+2,62,bw-4,30,acked?C.greenp:fl?C.blue:allowed?'#fff':'#eef2f4',acked?C.green:fl?C.blue:allowed?C.blue:C.grid,5,allowed?'stroke-dasharray="4 3"':'')+TB(x+bw/2,82,n,14,fl?'#fff':acked?C.green:allowed?C.blue:C.muted)}
  const wx=x0+(f.base-1)*bw,ww=Math.min(w,NW_SW_N-f.base+1)*bw;if(f.base<=NW_SW_N)out+=P(`M${wx} 56V50H${wx+ww}V56`,C.coral,2.5)+TF(wx+ww+4,55,'window',13,C.coral,'start');
  out+=TF(72,110,'acknowledged',13,C.green,'start')+TF(220,110,'in flight',13,C.blue,'start')+TF(330,110,'may be sent',13,C.blue,'start')+TF(470,110,'must wait',13,C.muted,'start');
  out+=box(14,144,74,52,'Sender',C.pale,C.ink,13)+box(512,144,74,52,'Receiver',C.pale,C.ink,13)+L(90,170,510,170,C.line,1.5,'stroke-dasharray="4 4"');
  f.segs.forEach((g,i)=>{const pr=clamp((f.t+u-g.t0)/2,0,1);out+=NW_chip(lerp(110,490,pr),150-(g.n%3)*0,String(g.n),C.blue,30)});
  f.acks.forEach(a=>{const pr=clamp((f.t+u-a.t0)/2,0,1);out+=NW_chip(lerp(490,110,pr),192,'ACK '+a.n,C.green,62)});
  out+=counter(14,214,'time (ticks)',f.t,C.blue,110);
  const ends=range(6).map(i=>{const sn=NW_sw(i+1);return sn[sn.length-1].t});
  out+=TF(170,232,'Ticks to deliver all 12, by window size',13,C.muted,'start');
  ends.forEach((e,i)=>{const y=242+i*21,on=i+1===w,len=e*360/ends[0];out+=TF(178,y+14,i+1,13,on?C.coral:C.muted,'end')+R(186,y+2,len,16,on?C.coral:C.pale,'none',4)+TF(192+len,y+14,e,13,on?C.coral:C.muted,'start')});
  const done=f.base>NW_SW_N;
  return {svg:out,phase:done?`All 12 acknowledged after ${f.t} ticks. A window of 1 (stop and wait) needs ${ends[0]}. ${w>=4?'Beyond 4 nothing improves: a round trip only holds 4 segments, so the line is already full (bandwidth × delay).':'A bigger window keeps more of the line busy.'}`:`The sender may have segments ${f.base} to ${Math.min(NW_SW_N,f.base+w-1)} unacknowledged. Each returning ACK slides the window right and lets a new segment go.`};
 }});

/* ---- TCP lesson: congestion control ---- */
function NW_cc(s){const out=[];let cw=1,ss=s.thresh;for(let r=1;r<=20;r++){const loss=s.losses.includes(r),phase=cw<ss?'slow':'avoid';out.push({r,cw,ss,loss,phase});if(loss){ss=Math.max(2,Math.floor(cw/2));cw=ss}else if(cw<ss)cw=Math.min(cw*2,ss);else cw+=1}return out}
SCENE({id:'congestion-control',name:'Congestion control',tag:'Speed up, back off',
 definition:'TCP guesses how fast the network can go. It starts slowly and doubles its sending rate each round trip (slow start), then grows by one per round (congestion avoidance). When a packet is lost it halves its rate.',
 example:'Losses usually mean a router somewhere is overloaded. By halving on loss and growing gently, millions of TCP connections share the internet fairly without a central controller.',
 desc:'A bar chart of the congestion window for twenty round trips: doubling at first, then climbing by one, with a sharp halving at each loss and a dashed threshold line.',
 dur:13,hint:'Press any round to cause a packet loss there (press again to remove it). Change the starting threshold.',
 init:()=>({thresh:16,losses:[11]}),
 ui:[{range:'thresh',label:'Starting threshold',min:4,max:32,get:s=>s.thresh,act:'th'},{b:'No losses',act:'clear'}],
 on:{th(s,v){s.thresh=v},clear(s){s.losses=[];return 'end'},loss(s,r){r=Number(r);const i=s.losses.indexOf(r);if(i>=0)s.losses.splice(i,1);else s.losses.push(r);return 'end'}},
 trace:s=>NW_cc(s).map((q,i)=>({i})),
 draw(s,f,X){
  const rows=NW_cc(s),k=f.i,mx=Math.max(16,...rows.map(q=>q.cw),s.thresh),H=230,base=300,sc=H/mx,x0=60,cw=25;let out=heading('The congestion window, round trip by round trip');
  for(let v=0;v<=mx;v+=mx>24?8:4){const y=base-v*sc;out+=L(x0-4,y,x0+20*cw,y,C.grid,1)+TF(x0-8,y+4,v,13,C.muted,'end')}
  out+=TF(18,52,'segments per round',13,C.muted,'start');
  rows.forEach((q,i)=>{const x=x0+i*cw,h=q.cw*sc,shown=i<=k,col=q.phase==='slow'?C.purple:C.blue;
   if(shown)out+=R(x+3,base-h,cw-6,h,q.loss?C.coral:col,'none',3);
   if(shown&&q.loss)out+=TBF(x+cw/2,base-h-6,'✕',14,C.coral);
   out+=TF(x+cw/2,base+16,q.r,13,i===k?C.ink:C.muted);
   if(X.try)out+=hit(X,'loss',q.r,`Round ${q.r}: ${q.loss?'loss here. Press to remove.':'no loss. Press to lose a packet here.'}`,R(x,60,cw,base-60,'transparent','none',0))});
  const ssPath=rows.slice(0,k+1).map((q,i)=>`${i?'L':'M'}${x0+i*cw} ${base-q.ss*sc}H${x0+(i+1)*cw}`).join('');out+=P(ssPath,C.amber,2,'none','stroke-dasharray="5 4"');
  out+=TF(x0,base+38,'round trip →',13,C.muted,'start')+TF(560,74,'threshold',13,C.amber,'end')+TF(560,92,'slow start',13,C.purple,'end')+TF(560,110,'avoidance',13,C.blue,'end');
  const q=rows[k],sent=sum(rows.slice(0,k+1).map(r=>r.cw));out+=TF(300,354,`Round ${q.r}: window ${q.cw} · ${sent} segments sent so far`,14,C.ink);
  return {svg:out,phase:q.loss?`A loss in round ${q.r}: TCP takes it as a sign of congestion and halves its window to ${Math.max(2,Math.floor(q.cw/2))}, and sets the threshold there too.`:q.phase==='slow'?`Slow start: the window doubles each round trip (${q.cw} now) until it reaches the threshold of ${q.ss}.`:`Congestion avoidance: above the threshold the window grows by just one segment per round trip, probing gently for spare capacity.`};
 }});

/* ---- DNS lesson: record types ---- */
const NW_ZONE=[['example.co.uk','A','203.0.113.10'],['example.co.uk','AAAA','2001:db8::10'],['example.co.uk','MX','10 mail.example.co.uk'],['www.example.co.uk','CNAME','example.co.uk'],['mail.example.co.uk','A','203.0.113.25'],['shop.example.co.uk','A','203.0.113.42'],['example.co.uk','TXT','"v=spf1 mx -all"']];
const NW_RTYPE={A:'IPv4 address',AAAA:'IPv6 address',CNAME:'another name for',MX:'mail server for',TXT:'text note'};
function NW_rr(s){
 const fr=[];let name=s.name,ans=[];const seen=new Set();
 for(let g=0;g<4;g++){
  const hitRows=NW_ZONE.map((r,i)=>i).filter(i=>NW_ZONE[i][0]===name&&NW_ZONE[i][1]===s.type);
  if(hitRows.length){ans.push(...hitRows);fr.push({rows:hitRows,name,say:`Found ${s.type} for ${name}: ${hitRows.map(i=>NW_ZONE[i][2]).join(', ')}.`,ans:ans.slice()});
   if(s.type==='MX'){const host=NW_ZONE[hitRows[0]][2].split(' ')[1],a=NW_ZONE.findIndex(r=>r[0]===host&&r[1]==='A');if(a>=0){ans.push(a);fr.push({rows:[a],name:host,say:`Mail goes to ${host}; its A record gives the address to connect to, ${NW_ZONE[a][2]}.`,ans:ans.slice()})}}
   break}
  const cn=NW_ZONE.findIndex(r=>r[0]===name&&r[1]==='CNAME');
  if(cn>=0&&!seen.has(name)){seen.add(name);ans.push(cn);fr.push({rows:[cn],name,say:`No ${s.type} record for ${name}, but a CNAME says it is another name for ${NW_ZONE[cn][2]}. Look that up instead.`,ans:ans.slice()});name=NW_ZONE[cn][2];continue}
  fr.push({rows:[],name,none:true,say:`There is no ${s.type} record for ${name}. The answer is “no data”: the name exists but has no ${NW_RTYPE[s.type]}.`,ans:ans.slice()});break;
 }
 return [{rows:[],name:s.name,say:`The question names a domain and a record type: ${s.name}, type ${s.type} (${NW_RTYPE[s.type]}).`,ans:[]}].concat(fr);
}
SCENE({id:'dns-records',name:'DNS record types',tag:'Different questions, different answers',
 definition:'A DNS zone is a list of records. Each record has a name, a type and a value: A gives an IPv4 address, AAAA an IPv6 address, CNAME an alias for another name, MX the mail server and TXT free text.',
 example:'Asking for the A record of www.example.co.uk finds a CNAME pointing to example.co.uk, and then that name’s A record, 203.0.113.10. Email to @example.co.uk is sent to the MX host, mail.example.co.uk.',
 desc:'The record table for example.co.uk; a question (name and type) is answered by highlighting matching records, following an alias where needed.',
 dur:11,hint:'Pick a name and a record type, then step through the lookup in the zone’s records.',
 init:()=>({name:'www.example.co.uk',type:'A'}),
 ui:[{choose:[['www.example.co.uk','www'],['example.co.uk','example.co.uk'],['shop.example.co.uk','shop'],['mail.example.co.uk','mail']],label:'Name',get:s=>s.name,act:'name'},{choose:[['A','A'],['AAAA','AAAA'],['MX','MX'],['TXT','TXT']],label:'Type',get:s=>s.type,act:'type'}],
 on:{name(s,v){s.name=v},type(s,v){s.type=v}},
 trace:NW_rr,
 draw(s,f,X){
  let out=heading('The zone file for example.co.uk');
  out+=R(20,44,560,34,C.amberp,C.amber,8)+TMF(300,66,`Question: ${s.name}  type ${s.type}`,14,C.ink,'middle','font-weight="700" xml:space="preserve"');
  out+=TF(30,100,'name',13,C.muted,'start')+TF(250,100,'type',13,C.muted,'start')+TF(320,100,'value',13,C.muted,'start');
  NW_ZONE.forEach((r,i)=>{const y=106+i*28,on=f.rows.includes(i),inAns=f.ans.includes(i);out+=R(20,y,560,25,on?C.pale:inAns?'#f1f8f4':i%2?'#f6f9fb':'#fff',on?C.blue:'none',5)+TMF(30,y+17,r[0],13,C.ink,'start')+R(246,y+4,56,18,on?C.blue:'#e7eef3','none',9)+TBF(274,y+17,r[1],12.5,on?'#fff':C.ink)+TMF(320,y+17,r[2],13,on?C.blue:C.ink,'start',on?'font-weight="700"':'')});
  const last=X.k>=X.n-1,fin=f.ans.filter(i=>NW_ZONE[i][1]!=='CNAME').map(i=>NW_ZONE[i][2]);
  out+=R(20,310,560,52,last?(f.none?C.coralp:C.greenp):'#fff',last?(f.none?C.coral:C.green):C.grid,9);
  out+=TF(30,330,last?'Answer':'Answer so far',13,C.muted,'start')+TMF(30,352,last?(f.none?`no ${s.type} record (name exists)`:fin.join('  ·  ')):(f.ans.length?f.ans.map(i=>NW_ZONE[i][1]+' '+NW_ZONE[i][2]).join('  →  '):'…'),13.5,C.ink,'start','font-weight="700" xml:space="preserve"');
  return {svg:out,phase:f.say};
 }});

/* ---- DNS lesson: time to live and caching ---- */
const NW_REQ=[5,20,40,70,95,130,160,175,210,240,270,290];
function NW_ttl(s){
 let exp=-1,val=null,fetched=0;const out=[];
 for(const r of NW_REQ){const truth=r<150?'.10':'.99';let kind;
  if(r<exp)kind=val===truth?'hit':'stale';else{kind='miss';val=truth;fetched=r;exp=r+s.ttl}
  out.push({r,kind,val,from:fetched,exp})}
 return out;
}
SCENE({id:'dns-ttl',name:'DNS caching and TTL',tag:'Fresh enough?',
 definition:'Every DNS answer comes with a time to live (TTL) in seconds. Resolvers may reuse a cached answer until it expires, then must ask again.',
 example:'With a TTL of one hour, a busy resolver asks the name server once an hour instead of thousands of times. But if the site moves to a new address, some users keep getting the old one until their cached copy expires.',
 desc:'A five-minute timeline of lookups for one name; bars show how long each cached answer stays valid, lookups are marked as cache hits, fresh fetches or stale answers, and the address changes halfway.',
 dur:13,hint:'Slide the TTL. Short TTLs mean more queries; long ones mean stale answers after the address changes at 150 s.',
 init:()=>({ttl:60}),
 ui:[{range:'ttl',label:'TTL (seconds)',min:10,max:300,step:10,get:s=>s.ttl,act:'ttl'}],
 on:{ttl(s,v){s.ttl=v}},
 trace:s=>NW_ttl(s).map((q,i)=>({i})),
 draw(s,f,X){
  const rows=NW_ttl(s),k=f.i,sx=t=>40+t*520/300,axis=250;let out=heading(`TTL ${s.ttl} s: how long the resolver may reuse an answer`);
  out+=L(40,axis,560,axis,C.ink,2);for(let t=0;t<=300;t+=50)out+=L(sx(t),axis,sx(t),axis+6,C.ink,1.5)+TF(sx(t),axis+22,t+' s',13,C.muted);
  out+=L(sx(150),58,sx(150),axis,C.coral,2,'stroke-dasharray="5 4"')+TF(sx(150)+6,72,'site moves:',13,C.coral,'start')+TF(sx(150)+6,88,'.10 → .99',13,C.coral,'start');
  out+=TF(40,72,'address ends .10',13,C.muted,'start');
  rows.slice(0,k+1).forEach((q,i)=>{if(q.kind==='miss'){const x0=sx(q.r),x1=sx(Math.min(300,q.exp));out+=R(x0,100+(i%3)*22,x1-x0,18,q.val==='.10'?C.pale:C.greenp,q.val==='.10'?C.blue:C.green,4)+TMF(x0+4,113+(i%3)*22,'cached '+q.val,12.5,C.ink,'start')}});
  rows.forEach((q,i)=>{if(i>k)return;const x=sx(q.r),col=q.kind==='miss'?C.blue:q.kind==='hit'?C.green:C.coral;out+=L(x,axis-38,x,axis,col,2)+Ci(x,axis-42,i===k?9:6,col);
   if(i===k)out+=TBF(x,axis-58,q.kind==='miss'?'ask':q.kind==='hit'?'cache':'stale!',13,col)});
  const done=rows.slice(0,k+1),m=done.filter(q=>q.kind==='miss').length,h=done.filter(q=>q.kind==='hit').length,st=done.filter(q=>q.kind==='stale').length;
  out+=counter(60,290,'queries upstream',m,C.blue,140)+counter(230,290,'cache hits',h,C.green,140)+counter(400,290,'stale answers',st,C.coral,140);
  const q=rows[k];
  return {svg:out,phase:q.kind==='miss'?`At ${q.r} s there is no valid cached copy, so the resolver asks the name server and keeps the answer (${q.val}) until ${Math.min(q.exp,999)} s.`:q.kind==='hit'?`At ${q.r} s the cached answer is still within its TTL: answered instantly, no query sent.`:`At ${q.r} s the cache still holds .10 although the site moved to .99 at 150 s: a stale answer, until the TTL runs out at ${q.exp} s.`};
 }});

/* ---- HTTP lesson: anatomy of a URL ---- */
const NW_URLS=['https://shop.example.co.uk:8443/basket/items?id=42&colour=red#reviews','http://example.com/','https://www.example.org/search?q=binary+search&page=2'];
const NW_UPARTS=[['scheme',C.purple,'How to talk: https = HTTP inside an encrypted TLS connection.'],['host',C.blue,'Which computer: the name DNS turns into an IP address.'],['port',C.amber,'Which program on that computer (443 for https, 80 for http if left out).'],['path',C.green,'Which resource on the server, like a file path.'],['query',C.coral,'Extra details as key=value pairs, after ?, joined by &.'],['fragment',C.muted,'A place within the page. The browser keeps it: it is never sent to the server.']];
function NW_url(str){
 let u;try{u=new URL(str)}catch(e){return null}
 const low=str.toLowerCase(),find=(v,from=0)=>v?low.indexOf(v.toLowerCase(),from):-1,parts=[];
 const sch=u.protocol.slice(0,-1);parts.push({k:0,v:sch,at:find(sch),len:sch.length});
 const hi=find(u.hostname,sch.length);parts.push({k:1,v:u.hostname,at:hi,len:u.hostname.length});
 const def={'https':'443','http':'80'}[sch]||'?';parts.push({k:2,v:u.port||def+' (default)',at:u.port?find(':'+u.port,hi)+1:-1,len:u.port.length});
 const pi=find(u.pathname,hi+u.hostname.length);parts.push({k:3,v:u.pathname,at:pi,len:u.pathname.length});
 parts.push({k:4,v:u.search?[...u.searchParams].map(([a,b])=>a+' = '+b).join(' · '):'(none)',at:u.search?find(u.search):-1,len:u.search.length});
 parts.push({k:5,v:u.hash?u.hash.slice(1):'(none)',at:u.hash?find(u.hash):-1,len:u.hash.length});
 return parts;
}
SCENE({id:'url-anatomy',name:'URL',tag:'An address in six parts',
 definition:'A URL (uniform resource locator) says how to fetch something and from where: a scheme, a host, an optional port, a path, an optional query and an optional fragment.',
 example:'In https://shop.example.co.uk:8443/basket?id=42#reviews the browser uses HTTPS, looks up shop.example.co.uk, connects to port 8443, asks for /basket?id=42, then scrolls to “reviews” itself.',
 desc:'A URL with each of its parts underlined in its own colour, and a table naming each part, its value and what it is for.',
 dur:12,hint:'Type or pick a URL. Each coloured part is matched to its row; try adding a query or a #fragment.',
 init:()=>({url:NW_URLS[0]}),
 watch(p){return {url:NW_URLS[0],hl:Math.min(5,Math.floor(p*6))}},
 ui:[{text:'URL',label:'URL',get:s=>s.url,act:'url',max:70},{choose:NW_URLS.map((u,i)=>[u,['Shop','Plain','Search'][i]]),label:'Examples',get:s=>s.url,act:'url'}],
 on:{url(s,v){s.url=v}},
 draw(s,f,X){
  const parts=NW_url(s.url.trim());let out=heading('Reading a URL from left to right');
  if(!parts){out+=TM(300,80,s.url.slice(0,70)||'(empty)',13,C.coral)+R(60,170,480,60,C.coralp,C.coral,10)+TB(300,198,'Not a complete URL',16,C.coral)+TF(300,218,'It needs at least a scheme and a host, like https://example.com',13,C.ink);return {svg:out,phase:'A browser cannot fetch this: a full URL starts with a scheme such as https:// followed by a host name.'}}
  const str=s.url.trim().slice(0,70),cw=Math.min(9,560/Math.max(1,str.length)),x0=300-str.length*cw/2,hl=s.hl;
  const colAt=i=>{const p=parts.find(q=>q.at>=0&&i>=q.at&&i<q.at+q.len);return p?NW_UPARTS[p.k][1]:null};
  Array.from(str).forEach((c,i)=>{const col=colAt(i),p=parts.find(q=>q.at>=0&&i>=q.at&&i<q.at+q.len),on=hl===undefined||(p&&p.k===hl);out+=TMF(x0+i*cw+cw/2,78,c,Math.min(15,cw*1.55),col&&on?col:C.muted,'middle',col&&on?'font-weight="700"':'')});
  parts.forEach(p=>{if(p.at<0||!p.len)return;const on=hl===undefined||p.k===hl;out+=L(x0+p.at*cw+1,88,x0+(p.at+p.len)*cw-1,88,NW_UPARTS[p.k][1],on?3.5:1.5)});
  parts.forEach((p,i)=>{const y=106+i*42,[nm,col,note]=NW_UPARTS[p.k],on=hl===undefined||p.k===hl;
   out+=R(20,y,560,38,on?'#fff':'#f6f9fb',on?col:C.grid,8)+R(20,y,96,38,on?col:'#e7eef3','none',8)+TBF(68,y+24,nm,14,on?'#fff':C.muted);
   out+=TMF(126,y+16,p.v.length>52?p.v.slice(0,51)+'…':p.v,13,on?C.ink:C.muted,'start','font-weight="700" xml:space="preserve"')+TF(126,y+32,note,13,on?C.muted:C.line,'start')});
  const cur=hl===undefined?null:NW_UPARTS[hl];
  return {svg:out,phase:cur?`${cur[0][0].toUpperCase()+cur[0].slice(1)}: ${cur[2]}`:'Only the scheme and host are compulsory. The path, query and fragment are optional, and the port is usually left to its default.'};
 }});

/* ---- HTTP lesson: cookies ---- */
const NW_SIDS=['7f3a','c21b','9e04','5d6e','b3c9','0a8f'];
function NW_ck(s,act){
 s=JSON.parse(JSON.stringify(s));let req,res,set=null,page;
 if(act==='clear'){s.cookie=null;s.last={act,req:['(no request: the browser deletes its cookies)'],res:[],page:'Cookies cleared',set:null,note:'The browser forgets its cookie. The server still has the session, but nobody can point to it any more.'};return s}
 const path={visit:'GET /',add:'POST /basket/add',login:'POST /login'}[act];req=[path+' HTTP/1.1','Host: shop.example',s.cookie?'Cookie: sid='+s.cookie:'(no Cookie header)'];
 let sess=s.cookie?s.sessions[s.cookie]:null;
 if(!sess){const sid=NW_SIDS[s.n%NW_SIDS.length];s.n++;s.sessions[sid]={user:null,basket:0};sess=s.sessions[sid];set=sid;s.cookie=sid}
 if(act==='add')sess.basket++;if(act==='login')sess.user='Ada';
 page=(sess.user?`Hello, ${sess.user}`:'Hello, stranger')+` · basket: ${sess.basket}`;
 res=['HTTP/1.1 200 OK',set?'Set-Cookie: sid='+set:'(no Set-Cookie)',page];
 const note=set?`No cookie came with the request, so the server makes a new session and sends Set-Cookie: sid=${set}. The browser stores it.`:act==='add'?'The cookie tells the server which session this is, so it adds to the right basket.':act==='login'?'Logging in attaches a name to the session. The cookie itself still only holds the session id.':'The browser sends the cookie back automatically, so the server recognises the visitor.';
 s.last={act,req,res,page,set,note};return s;
}
const NW_CK_SCRIPT=['visit','add','login','add','visit','clear','visit'];
const NW_CK0=()=>({cookie:null,sessions:{},n:0,last:null});
SCENE({id:'cookies',name:'Cookies and sessions',tag:'Remembering a stateless conversation',
 definition:'HTTP itself forgets everything between requests. A cookie is a small value the server asks the browser to store and send back with every later request, so the server can recognise the visitor and keep their session.',
 example:'The first response says Set-Cookie: sid=7f3a. From then on every request carries Cookie: sid=7f3a, and the server looks up session 7f3a to find your basket. Clear your cookies and you look like a stranger again.',
 desc:'The latest request and response, the browser’s cookie jar and page, and the server’s table of sessions, updated as the visitor browses, logs in and clears cookies.',
 dur:14,hint:'Visit, add to the basket, log in, clear cookies… Watch the Cookie header and the server’s session table.',
 init:NW_CK0,
 watch(p){let s=NW_CK0();const n=Math.min(NW_CK_SCRIPT.length,Math.floor(p*NW_CK_SCRIPT.length)+1);for(let i=0;i<n;i++)s=NW_ck(s,NW_CK_SCRIPT[i]);return s},
 ui:[{b:'Visit page',act:'go',arg:'visit'},{b:'Add to basket',act:'go',arg:'add'},{b:'Log in as Ada',act:'go',arg:'login'},{b:'Clear cookies',act:'go',arg:'clear'}],
 on:{go(s,a){Object.assign(s,NW_ck(s,a))}},
 draw(s){
  const l=s.last;let out=heading('A cookie carries a session id back and forth');
  const panel=(x,w,title,lines,col)=>{let o=R(x,44,w,118,'#fff',col,9)+TF(x+10,62,title,13,C.muted,'start','font-weight="700"');(lines||[]).forEach((t,i)=>{const hl=/Cookie/.test(t)&&!/^\(/.test(t);if(hl)o+=R(x+5,70+i*20,w-10,20,C.amberp,'none',4);o+=TMF(x+12,85+i*20,t.length>32?t.slice(0,31)+'…':t,13,/^\(/.test(t)?C.muted:C.ink,'start',hl?'font-weight="700"':'')});return o};
  out+=panel(20,276,'Request (browser → server)',l?l.req:['(nothing sent yet)'],C.blue)+panel(304,276,'Response (server → browser)',l?l.res:[],C.green);
  out+=R(20,176,276,190,'#fff',C.grid,9)+TBF(32,196,'Browser',14,C.ink,'start');
  out+=R(32,206,252,56,'#f6f9fb',C.grid,6)+TF(40,224,'page',13,C.muted,'start')+TBF(158,248,l?l.page:'(blank)',14,C.ink);
  out+=R(32,272,252,82,s.cookie?C.amberp:'#fff',s.cookie?C.amber:C.grid,6)+TF(40,290,'cookie jar for shop.example',13,C.muted,'start')+TMF(158,326,s.cookie?'sid = '+s.cookie:'(empty)',15,s.cookie?C.ink:C.muted,'middle','font-weight="700"');
  out+=R(304,176,276,190,'#fff',C.grid,9)+TBF(316,196,'Server’s session table',14,C.ink,'start');
  out+=TF(320,218,'sid',13,C.muted,'start')+TF(390,218,'user',13,C.muted,'start')+TF(480,218,'basket',13,C.muted,'start');
  const ids=Object.keys(s.sessions);if(!ids.length)out+=TF(442,262,'(no sessions)',13,C.muted);
  ids.slice(-5).forEach((id,i)=>{const y=226+i*26,on=id===s.cookie,q=s.sessions[id];out+=R(310,y,264,23,on?C.pale:'none',on?C.blue:'none',5)+TMF(320,y+16,id,13,C.ink,'start')+TF(390,y+16,q.user||'—',13,C.ink,'start')+TF(480,y+16,q.basket,13,C.ink,'start')});
  return {svg:out,phase:l?l.note:'The browser has no cookie yet, and the server has no sessions. Press “Visit page” to begin.'};
 }});

/* ---- HTTP lesson: the TLS handshake behind HTTPS ---- */
const NW_TLS_FAULT={ok:'',name:'The certificate is for evil.example.net, not shop.example.co.uk.',expired:'The certificate expired on 1 March 2026.',untrusted:'The certificate chains to “Totally Legit Root”, which is not in the browser’s trust store.'};
function NW_tlsFrames(s){
 const p=23,g=5,a=6,b=15,A=NW_mod(g,a,p),B=NW_mod(g,b,p),K=NW_mod(B,a,p);
 const fr=[{m:{from:'c',label:'ClientHello',sub:'TLS versions, ciphers, random'},say:'The browser says hello: which versions and ciphers it supports, and a random number.'},
  {m:{from:'s',label:'ServerHello + certificate',sub:'chosen cipher, random, certificate'},say:'The server picks a cipher, sends its own random number and its certificate: “this public key belongs to shop.example.co.uk”, signed by a certificate authority.'},
  {check:true,say:s.cert==='ok'?'The browser checks the certificate: right name, in date, and signed by an authority it trusts. All good.':'The browser checks the certificate and it fails. '+NW_TLS_FAULT[s.cert]}];
 if(s.cert!=='ok'){fr.push({stop:true,say:'The browser stops and shows a full-page warning. No password or card number is ever sent.'});return fr}
 fr.push({m:{from:'c',label:`key share: ${A}`,sub:`${g}^a mod ${p}, a kept secret`},say:`Both sides make a fresh secret. The browser sends ${g}^${a} mod ${p} = ${A}.`});
 fr.push({m:{from:'s',label:`key share: ${B}`,sub:`${g}^b mod ${p}, signed by the server`},say:`The server sends ${g}^${b} mod ${p} = ${B}, signed with its certificate’s private key so nobody can swap it.`});
 fr.push({keys:K,say:`Each side combines its secret with the other’s share and gets the same number, ${K}, without it ever crossing the network. Session keys are derived from it.`});
 fr.push({m:{from:'c',label:'Finished 🔒',sub:'encrypted check of everything so far'},enc:true,say:'Both send “Finished”, encrypted with the new keys, proving neither side was tampered with.'});
 fr.push({m:{from:'c',label:'GET /basket 🔒',sub:'on the wire: 9c 4e a1 07 d2 …'},enc:true,say:'Now ordinary HTTP flows inside the encrypted connection. Anyone on the path sees only scrambled bytes.'});
 return fr;
}
SCENE({id:'tls-handshake',name:'HTTPS and the TLS handshake',tag:'Who are you, and what is our secret?',
 definition:'HTTPS is HTTP sent inside a TLS connection. Before any web traffic, the TLS handshake checks the server’s certificate and agrees fresh secret keys, so the conversation is private and goes to the right site.',
 example:'The padlock in the address bar means the handshake succeeded: the certificate proved the site’s name, and a key exchange gave both sides a key that an eavesdropper never saw.',
 desc:'Browser and server timelines exchanging hello messages, a certificate, key shares and encrypted messages; a certificate check can stop the handshake with a warning.',
 dur:14,hint:'Choose a certificate problem to see where the handshake stops, or a good certificate to see the keys agreed.',
 init:()=>({cert:'ok'}),
 ui:[{choose:[['ok','Good certificate'],['name','Wrong name'],['expired','Expired'],['untrusted','Unknown authority']],label:'Certificate',get:s=>s.cert,act:'cert'}],
 on:{cert(s,v){s.cert=v}},
 trace:NW_tlsFrames,
 draw(s,f,X){
  const fr=NW_tlsFrames(s),cx=110,sx=490,u=smooth(X.u);let out=heading('Hello, prove it, agree a key, then talk privately');
  out+=TB(cx,54,'Browser',15)+TB(sx,54,'shop.example.co.uk',15)+L(cx,64,cx,372,C.dark,2)+L(sx,64,sx,372,C.dark,2);
  let row=0;
  fr.slice(0,X.k+1).forEach((q,i)=>{const y=82+row*36,cur=i===X.k;
   if(q.m){row++;const x0=q.m.from==='c'?cx:sx,x1=q.m.from==='c'?sx:cx,pr=cur&&X.k<X.n-1?u:1,col=q.enc?C.green:q.m.from==='c'?C.blue:C.purple;
    out+=arrow(x0,y,lerp(x0,x1,pr),y,col,2.5,8)+TBF(300,y-6,q.m.label,13,col)+TF(300,y+14,q.m.sub,13,C.muted)}
   else if(q.check){row++;const ok=s.cert==='ok';out+=R(cx+14,y-14,250,30,ok?C.greenp:C.coralp,ok?C.green:C.coral,8)+TBF(cx+139,y+6,ok?'✓ certificate checks out':'✗ certificate rejected',14,ok?C.green:C.coral)}
   else if(q.keys){row++;out+=R(cx-60,y-14,120,28,C.amberp,C.amber,8)+TMF(cx,y+5,'key = '+q.keys,14,C.ink,'middle','font-weight="700"')+R(sx-60,y-14,120,28,C.amberp,C.amber,8)+TMF(sx,y+5,'key = '+q.keys,14,C.ink,'middle','font-weight="700"')+TF(300,y+5,'same number, never sent',13,C.amber)}
   else if(q.stop){row++;out+=R(130,y-14,340,40,C.coralp,C.coral,10)+TBF(300,y+5,'⚠ Your connection is not private',15,C.coral)+TF(300,y+20,'',13,C.ink)}});
  if(X.k===fr.length-1&&s.cert==='ok')out+=R(cx-48,346,96,24,C.greenp,C.green,12)+TBF(cx,363,'🔒 secure',13,C.green);
  return {svg:out,phase:f.say};
 }});

/* ---- Encryption lesson: one-time pad ---- */
const NW_KEYB=(()=>{const r=rng(2468);return range(8).map(()=>Math.floor(r()*256))})();
const NW_A8=t=>Array.from(t.toUpperCase()).slice(0,6).map(c=>c.charCodeAt(0)&255);
SCENE({id:'one-time-pad',name:'One-time pad',tag:'Perfect secrecy, once',
 definition:'Combine each bit of the message with a truly random key bit using XOR. If the key is as long as the message, kept secret and never reused, the ciphertext reveals nothing at all about the message.',
 example:'H (01001000) XOR key 00110001 gives 01111001. XOR with the same key again gives H back. But reuse the key for a second message and C1 XOR C2 = P1 XOR P2: the key cancels out and the messages start to leak.',
 desc:'Each character’s bits are XORed with key bits to make ciphertext bits; in the reuse view, two ciphertexts made with the same key are XORed together and a guessed message reveals the other.',
 dur:13,hint:'Type a message. Then switch to “Key used twice” and see an attacker recover message 2 by guessing message 1.',
 init:()=>({p1:'HELLO',p2:'MONEY',view:'enc'}),
 watch(p){return {p1:'HELLO',p2:'MONEY',view:p<.55?'enc':'reuse',rows:p<.55?Math.floor(p/.55*4.99):Math.floor((p-.55)/.45*4.99)}},
 ui:[{text:'Message 1',label:'Message 1',get:s=>s.p1,act:'p1',max:6},{text:'Message 2',label:'Message 2',get:s=>s.p2,act:'p2',max:6},{choose:[['enc','Encrypt once'],['reuse','Key used twice']],label:'View',get:s=>s.view,act:'view'}],
 on:{p1(s,v){s.p1=v},p2(s,v){s.p2=v},view(s,v){s.view=v}},
 draw(s){
  const P1=NW_A8(s.p1),P2=NW_A8(s.p2),K=NW_KEYB,rows=s.rows===undefined?9:s.rows,n=P1.length,cw=79,x0=112;let out='';
  if(s.view==='enc'){
   out+=heading('Message XOR key = ciphertext');
   const lines=[['message',P1,C.ink],['⊕ key',K.slice(0,n),C.purple],['= cipher',P1.map((b,i)=>b^K[i]),C.coral],['⊕ key again',P1,C.green]];
   lines.forEach(([lab,arr,col],r)=>{if(r>rows)return;const y=62+r*66;out+=TBF(20,y+28,lab,13,col,'start');
    arr.forEach((b,i)=>{const x=x0+i*cw;out+=R(x,y,cw-6,52,'#fff',col,7)+TMF(x+(cw-6)/2,y+20,bin(b,8),13,col)+TMF(x+(cw-6)/2,y+42,r===1||r===2?hex(b):b>=32&&b<127?String.fromCharCode(b):'·',15,C.ink,'middle','font-weight="700"')})});
   if(rows>=3)out+=TF(300,346,'The key is random and as long as the message, so every possible message is equally likely.',13,C.muted)+TF(300,366,'Decryption is the same XOR: the key cancels itself.',13,C.muted);
   return {svg:out,phase:'XOR gives 1 where the two bits differ. Because each key bit is a fair coin toss, each ciphertext bit is too: the ciphertext alone carries no information.'};
  }
  const m=Math.min(n,P2.length),C1=P1.slice(0,m).map((b,i)=>b^K[i]),C2=P2.slice(0,m).map((b,i)=>b^K[i]),X12=C1.map((b,i)=>b^C2[i]),rec=X12.map((b,i)=>b^P1[i]);
  out+=heading('The same key twice: the key cancels out');
  const lines=[['cipher 1',C1,C.coral,'hex'],['cipher 2',C2,C.coral,'hex'],['C1 ⊕ C2',X12,C.purple,'hex'],['⊕ guess “'+s.p1.toUpperCase().slice(0,8)+'”',P1.slice(0,m),C.blue,'chr'],['= message 2',rec,C.green,'chr']];
  lines.forEach(([lab,arr,col,kind],r)=>{if(r>rows)return;const y=54+r*56;out+=TBF(20,y+26,lab.length>14?lab.slice(0,13)+'…':lab,13,col,'start');
   arr.forEach((b,i)=>{const x=x0+i*cw;out+=R(x,y,cw-6,42,'#fff',col,7)+TMF(x+(cw-6)/2,y+18,bin(b,8),13,col)+TMF(x+(cw-6)/2,y+36,kind==='hex'?hex(b):b>=32&&b<127?String.fromCharCode(b):'·',14,C.ink,'middle','font-weight="700"')})});
  if(!m)out+=T(300,190,'Type two messages.',16,C.muted);
  return {svg:out,phase:`C1 ⊕ C2 = (P1 ⊕ K) ⊕ (P2 ⊕ K) = P1 ⊕ P2: the key has vanished. An attacker who guesses one message (or even part of it) reads the other: “${rec.map(b=>b>=32&&b<127?String.fromCharCode(b):'·').join('')}”. That is why the pad must be used only once.`};
 }});

/* ---- Encryption lesson: frequency analysis ---- */
const NW_ENG=[8.2,1.5,2.8,4.3,12.7,2.2,2.0,6.1,7.0,.15,.8,4.0,2.4,6.7,7.5,1.9,.1,6.0,6.3,9.1,2.8,1.0,2.4,.15,2.0,.07];
const NW_FA_PLAIN='MEET ME NEAR THE OLD STATION AT SEVEN THIS EVENING. BRING THE MAP AND THE KEYS, AND TELL NOBODY WHERE WE ARE GOING. THE TRAIN LEAVES AT EIGHT AND WE MUST NOT BE SEEN TOGETHER BEFORE THEN.';
const NW_FA_KEY=11,NW_FA_CIPHER=NW_shift(NW_FA_PLAIN,NW_FA_KEY);
const NW_FA_COUNT=(()=>{const c=range(26).map(()=>0);for(const ch of NW_FA_CIPHER){const i=NW_AZ.indexOf(ch);if(i>=0)c[i]++}const t=sum(c);return c.map(v=>v*100/t)})();
const NW_faScore=g=>sum(range(26).map(i=>NW_FA_COUNT[(i+g)%26]*NW_ENG[i]));
SCENE({id:'frequency-analysis',name:'Frequency analysis',tag:'The language shows through',
 definition:'Breaking a simple cipher by counting how often each letter appears in the ciphertext and matching that pattern against the known letter frequencies of the language.',
 example:'In English, E, T and A are the commonest letters. If a ciphertext’s commonest letter is P, a Caesar shift of 11 (E → P) is the first key to try. Arab scholar al-Kindi described the method in the 9th century.',
 desc:'Bars of letter frequencies in an intercepted ciphertext above the usual English frequencies, slid along by a guessed shift; a match score for each shift and a decryption preview.',
 dur:12,hint:'Slide the guessed shift until the English pattern lines up with the ciphertext’s peaks. The preview turns into English.',
 init:()=>({guess:0}),
 watch(p){return {guess:Math.min(NW_FA_KEY,Math.floor(smooth(p*1.25)*(NW_FA_KEY+1)))}},
 ui:[{range:'guess',label:'Guessed shift',min:0,max:25,get:s=>s.guess,act:'g'},{b:'Best match',act:'best'}],
 on:{g(s,v){s.guess=v},best(s){s.guess=range(26).reduce((b,g)=>NW_faScore(g)>NW_faScore(b)?g:b,0)}},
 draw(s){
  const g=s.guess,bw=21,x0=27,mx=Math.max(...NW_FA_COUNT,12.7),sc=70/mx;let out=heading('Count the letters, then slide English along to match');
  out+=TF(x0,54,'ciphertext letter counts (%)',13,C.coral,'start');
  NW_FA_COUNT.forEach((v,i)=>{const x=x0+i*bw;out+=R(x+2,140-v*sc,bw-4,v*sc,C.coral,'none',2)+TMF(x+bw/2,156,NW_AZ[i],13,C.ink)});
  out+=TF(x0,180,`English letter counts, slid along by ${g}`,13,C.blue,'start');
  range(26).forEach(i=>{const j=(i+g)%26,x=x0+j*bw,v=NW_ENG[i];out+=R(x+2,190,bw-4,v*sc,C.blue,'none',2)});
  NW_AZ.split('').forEach((c,i)=>{const j=(i+g)%26;if(i<26)out+=TMF(x0+j*bw+bw/2,282,c.toLowerCase(),13,C.blue)});
  const scores=range(26).map(NW_faScore),best=scores.indexOf(Math.max(...scores)),smax=Math.max(...scores);
  out+=TF(x0,304,'match score for each shift',13,C.muted,'start');
  scores.forEach((v,i)=>{const h=v/smax*22,x=x0+i*bw,on=i===g;out+=R(x+5,330-h,bw-10,h,on?C.coral:i===best?C.green:C.line,'none',2)});
  const prev=NW_shift(NW_FA_CIPHER.slice(0,46),-g);out+=TMF(300,356,prev,13,g===NW_FA_KEY?C.green:C.ink,'middle','font-weight="700" xml:space="preserve"');
  out+=TF(300,374,g===NW_FA_KEY?'Readable English: the key is '+g:'Decryption with this shift',13,g===NW_FA_KEY?C.green:C.muted);
  return {svg:out,phase:g===NW_FA_KEY?`At a shift of ${g} the tall English bars (e, t, a, o) sit exactly under the ciphertext’s peaks, the score is highest, and the text reads as English.`:`At a shift of ${g} the patterns do not line up. The ciphertext’s tallest bar is ${NW_AZ[NW_FA_COUNT.indexOf(Math.max(...NW_FA_COUNT))]}; English’s is e. Line them up.`};
 }});

/* ---- Encryption lesson: block cipher modes ---- */
const NW_SBOX=[12,5,6,11,9,0,10,13,3,14,15,8,4,7,1,2],NW_BKEY=7,NW_IV=9;
const NW_IMGS={heart:['0000000000000000','0011110000111100','0111111001111110','1111111111111111','1111111111111111','1111111111111111','0111111111111110','0011111111111100','0001111111111000','0000111111110000','0000001111000000','0000000000000000'],
 checks:['1111000011110000','1111000011110000','1111000011110000','1111000011110000','0000111100001111','0000111100001111','0000111100001111','0000111100001111','1111000011110000','1111000011110000','1111000011110000','1111000011110000']};
function NW_blocks(img){return img.map(r=>range(4).map(j=>parseInt(r.slice(j*4,j*4+4),2)))}
function NW_ecb(b){return b.map(r=>r.map(v=>NW_SBOX[v^NW_BKEY]))}
function NW_cbc(b){let prev=NW_IV;return b.map(r=>r.map(v=>{const c=NW_SBOX[v^prev^NW_BKEY];prev=c;return c}))}
SCENE({id:'block-modes',name:'Block cipher modes',tag:'Same block in, same block out?',
 definition:'A block cipher encrypts fixed-size blocks. In ECB mode every block is encrypted on its own, so identical blocks give identical ciphertext. CBC mode mixes each block with the previous ciphertext first, hiding repeats.',
 example:'Encrypt a picture in ECB and its outline still shows, because every all-white block becomes the same scrambled block. In CBC (or modern modes such as GCM) the same picture looks like noise.',
 desc:'A small bitmap split into 4-pixel blocks, shown as the original, encrypted block by block (ECB), and encrypted with chaining (CBC); one row’s block values are listed below.',
 dur:12,hint:'Press pixels to draw on the original, or pick a picture. Watch the outline survive ECB but vanish in CBC.',
 init:()=>({img:NW_IMGS.heart.slice(),row:4}),
 watch(p){return {img:NW_IMGS.heart,row:4,shown:Math.min(12,Math.floor(p*13))}},
 ui:[{choose:[['heart','Heart'],['checks','Squares']],label:'Picture',get:s=>s.img.join()===NW_IMGS.heart.join()?'heart':s.img.join()===NW_IMGS.checks.join()?'checks':'',act:'pic'}],
 on:{pic(s,v){s.img=NW_IMGS[v].slice()},px(s,a){const [r,c]=String(a).split(',').map(Number);const row=s.img[r];s.img[r]=row.slice(0,c)+(row[c]==='1'?'0':'1')+row.slice(c+1);s.row=r}},
 draw(s,f,X){
  const B=NW_blocks(s.img),E=NW_ecb(B),Cc=NW_cbc(B),cs=11,shown=s.shown===undefined?12:s.shown;let out=heading('Encrypt 4 pixels at a time');
  // Cipher panels colour each whole block by its value, so equal blocks look equal at a glance.
  const NWP=['#1f5f8b','#e8a23a','#3c8d5a','#c45238','#7156a6','#8a6a4a','#d77fb3','#7d8a93','#b5b84a','#3fb3c4','#2f3570','#a8444a','#8ca252','#f0d27a','#5254a3','#f2b8b0'];
  const panel=(x,title,vals,cl,click,limit)=>{let o=TBF(x+88,58,title,14,cl);for(let r=0;r<12;r++)for(let j=0;j<4;j++){if(!click){o+=R(x+j*4*cs,68+r*cs,4*cs-1,cs-1,r<limit?NWP[vals[r][j]]:'#eef2f4','none',1);continue}const bits=bin(vals[r][j],4);for(let k=0;k<4;k++){const c=j*4+k,on=bits[k]==='1',show=r<limit;const cell=R(x+c*cs,68+r*cs,cs-1,cs-1,!show?'#eef2f4':on?C.dark:'#fff','none',1);o+=click?hit(X,'px',r+','+c,`Pixel row ${r+1}, column ${c+1}: ${on?'dark':'light'}`,cell):cell}}
   for(let j=1;j<4;j++)o+=L(x+j*4*cs-.5,66,x+j*4*cs-.5,68+12*cs,C.coral,1,'opacity=".5"');return o};
  out+=panel(16,'Original',B,C.ink,true,12)+panel(212,'ECB: block by block',E,C.coral,false,shown)+panel(408,'CBC: chained',Cc,C.green,false,shown);
  const r=clamp(s.row,0,11);  out+=TF(20,226,`Row ${r+1}, block values (0–15):`,13,C.muted,'start');
  const rowv=(y,lab,vals,col)=>{let o=TF(20,y,lab,13,col,'start');vals.forEach((v,j)=>o+=R(130+j*60,y-15,52,22,'#fff',col,5)+TMF(156+j*60,y+1,v,13,C.ink));return o};
  out+=rowv(254,'plain',B[r],C.ink)+rowv(282,'ECB',E[r],C.coral)+rowv(310,'CBC',Cc[r],C.green);
  const dupPlain=new Set(B.flat()).size,dupE=new Set(E.flat()).size,dupC=new Set(Cc.flat()).size;
  out+=TF(390,254,`${dupPlain} different plain blocks`,13,C.ink,'start')+TF(390,282,`${dupE} different ECB blocks`,13,C.coral,'start')+TF(390,310,`${dupC} different CBC blocks`,13,C.green,'start');
  out+=TF(300,348,'Each colour is one encrypted 4-pixel block value (toy 4-bit cipher). ECB: equal in, equal out;',13,C.muted)+TF(300,366,'CBC XORs each block with the previous ciphertext first, so repeats come out different.',13,C.muted);
  return {svg:out,phase:`ECB turns every all-dark block into the same ciphertext block and every all-light block into another, so the shape survives: the ${dupE===dupPlain?'same number of':'same pattern of'} distinct blocks as the original. CBC chains each block to the one before, so the picture becomes noise.`};
 }});

/* ---- Public-key lesson: Diffie–Hellman key exchange ---- */
const NW_DH={p:23,g:5};
const NW_mix=(...cs)=>{const v=cs.map(c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)));return '#'+[0,1,2].map(k=>Math.round(sum(v.map(x=>x[k]))/v.length).toString(16).padStart(2,'0')).join('')};
const NW_PAINT={common:'#f2c94c',alice:'#c45238',bob:'#1772b7'};
function NW_pot(x,y,col,label,sub,r=24){return Ci(x,y,r,col,C.dark)+TBF(x,y+r+17,label,13,C.ink)+(sub?TMF(x,y+r+33,sub,13,C.muted):'')}
SCENE({id:'diffie-hellman',name:'Diffie–Hellman key exchange',tag:'Agreeing a secret in public',
 definition:'Two people agree a shared secret key over a public channel. Each keeps a private number, sends a value made from it, and combines the other’s value with their own secret. Both end with the same key; an eavesdropper does not.',
 example:'With p = 23 and g = 5: Alice keeps a = 6 and sends 5⁶ mod 23 = 8; Bob keeps b = 15 and sends 5¹⁵ mod 23 = 19. Alice works out 19⁶ mod 23 = 2, Bob works out 8¹⁵ mod 23 = 2. The 2 never crossed the network.',
 desc:'Paint pots for a public colour and two secret colours: each side mixes its secret into the public colour, they swap mixtures, and each adds its own secret again to reach the same final colour; the matching arithmetic is shown underneath.',
 dur:14,hint:'Choose Alice’s and Bob’s secret numbers. However you set them, both sides reach the same key, while Eve only sees the public values.',
 init:()=>({a:6,b:15}),
 ui:[{range:'a',label:'Alice’s secret a',min:1,max:22,get:s=>s.a,act:'a'},{range:'b',label:'Bob’s secret b',min:1,max:22,get:s=>s.b,act:'b'}],
 on:{a(s,v){s.a=v},b(s,v){s.b=v}},
 trace:()=>[{say:'Everyone agrees on public numbers p = 23 and g = 5: the shared yellow paint. Eve knows them too.'},
  {say:'Alice and Bob each choose a secret number (a secret colour) and tell nobody.'},
  {say:'Each mixes their secret into the public paint: Alice computes gᵃ mod p, Bob computes gᵇ mod p.'},
  {say:'They swap these mixtures in public. Eve sees both, but cannot easily unmix them.'},
  {say:'Each adds their own secret to the mixture they received. Both reach the same colour, the same number: the shared key.'},
  {say:''}],
 draw(s,f,X){
  const {p,g}=NW_DH,A=NW_mod(g,s.a,p),B=NW_mod(g,s.b,p),Ka=NW_mod(B,s.a,p),Kb=NW_mod(A,s.b,p),k=X.k,u=smooth(X.u);
  const mixA=NW_mix(NW_PAINT.common,NW_PAINT.alice),mixB=NW_mix(NW_PAINT.common,NW_PAINT.bob),fin=NW_mix(NW_PAINT.common,NW_PAINT.alice,NW_PAINT.bob);
  let out=heading('Mixing paint you cannot unmix');
  out+=TB(100,56,'Alice',16)+TB(500,56,'Bob',16)+R(212,46,176,226,C.coralp,'none',12)+TB(300,66,'Public (Eve sees)',14,C.coral);
  out+=NW_pot(300,104,NW_PAINT.common,'p = 23, g = 5','',20);
  if(k>=1)out+=NW_pot(60,110,NW_PAINT.alice,'secret',`a = ${s.a}`,20)+NW_pot(540,110,NW_PAINT.bob,'secret',`b = ${s.b}`,20);
  if(k>=2)out+=NW_pot(140,110,mixA,'gᵃ mod p',`= ${A}`,20)+NW_pot(460,110,mixB,'gᵇ mod p',`= ${B}`,20);
  if(k===3){out+=Ci(lerp(140,300,u),lerp(110,190,u),14,mixA,C.dark)+Ci(lerp(460,300,u),lerp(110,232,u),14,mixB,C.dark)}
  if(k>=3){out+=Ci(266,200,14,mixA,C.dark)+TMF(300,205,`A = ${A}`,13,C.ink,'start')+Ci(266,240,14,mixB,C.dark)+TMF(300,245,`B = ${B}`,13,C.ink,'start')}
  if(k>=4){out+=NW_pot(100,226,fin,'key',`${B}^${s.a} mod 23 = ${Ka}`,26)+NW_pot(500,226,fin,'key',`${A}^${s.b} mod 23 = ${Kb}`,26)}
  out+=R(20,300,560,66,'#fff',C.grid,9);
  if(k>=5){const tries=range(22).findIndex(x=>NW_mod(g,x+1,p)===A)+1;out+=TBF(300,322,`Both keys are ${Ka}. Eve has 5, 23, ${A} and ${B} but not a or b.`,14,C.green)+TF(300,342,`To find a she must try exponents until 5ˣ mod 23 = ${A}: here ${tries} tries.`,13,C.ink)+TF(300,360,'With a 600-digit p, no known method finishes: that is the “discrete logarithm” problem.',13,C.muted)}
  else out+=TF(300,338,'Mixing is easy; working out the secret from the mixture is hard.',14,C.muted);
  return {svg:out,phase:f.say||`Both sides reach ${Ka}: (gᵇ)ᵃ = (gᵃ)ᵇ = gᵃᵇ mod p. Eve would have to undo a mix, which for big numbers nobody knows how to do quickly.`};
 }});

/* ---- Public-key lesson: why factoring is hard ---- */
const NW_PRIMES=(()=>{const out=[];for(let n=2;out.length<62;n++)if(range(Math.floor(Math.sqrt(n))-1).every(i=>n%(i+2)!==0))out.push(n);return out})();
SCENE({id:'factoring',name:'Multiplying is easy, factoring is hard',tag:'The one-way street under RSA',
 definition:'Multiplying two primes takes a moment, but splitting the product back into its primes (factoring) seems to take enormously longer as the numbers grow. RSA’s security rests on that gap.',
 example:'61 × 53 = 3233 in one multiplication. Going back means dividing 3233 by 2, 3, 5, 7… until something divides exactly: 16 tries here. For a 600-digit number, trial division would outlast the universe.',
 desc:'Two primes multiplied in one step beside a grid of trial divisions working upward through the primes until one divides the product exactly, with a counter and a table of how the work grows.',
 dur:14,hint:'Choose two primes, then step or Run the trial division and count the tries. Bigger primes, many more tries.',
 init:()=>({pi:17,qi:15}),
 ui:[{range:'pi',label:'Prime p',min:3,max:61,get:s=>s.pi,act:'p',show:v=>NW_PRIMES[v]},{range:'qi',label:'Prime q',min:3,max:61,get:s=>s.qi,act:'q',show:v=>NW_PRIMES[v]}],
 on:{p(s,v){s.pi=v},q(s,v){s.qi=v}},
 trace(s){const p=NW_PRIMES[s.pi],q=NW_PRIMES[s.qi],n=p*q,fr=[{i:-1}];for(let i=0;i<NW_PRIMES.length;i++){fr.push({i,hit:n%NW_PRIMES[i]===0});if(n%NW_PRIMES[i]===0)break}return fr},
 draw(s,f,X){
  const p=NW_PRIMES[s.pi],q=NW_PRIMES[s.qi],n=p*q;let out=heading('One multiplication forward; many divisions back');
  out+=R(20,44,250,58,C.greenp,C.green,9)+TF(32,64,'Easy direction',13,C.green,'start','font-weight="700"')+TMF(32,90,`${p} × ${q} = ${n}`,17,C.ink,'start','font-weight="700"');
  out+=R(290,44,290,58,C.coralp,C.coral,9)+TF(302,64,'Hard direction: what times what makes',13,C.coral,'start','font-weight="700"')+TMF(302,90,`${n} = ? × ?`,17,C.ink,'start','font-weight="700"');
  const cols=13,cw=42;
  for(let i=0;i<NW_PRIMES.length;i++){const d=NW_PRIMES[i],x=26+(i%cols)*cw,y=118+Math.floor(i/cols)*30,tried=i<=f.i,isHit=tried&&n%d===0;
   if(d*d>n&&!tried)continue;
   out+=R(x,y,cw-4,26,isHit?C.green:tried?'#f4e1da':'#fff',isHit?C.green:tried?C.coral:C.grid,5)+TMF(x+(cw-4)/2,y+18,d,13,isHit?'#fff':tried?C.coral:C.muted,'middle',isHit?'font-weight="700"':'')}
  const tries=f.i+1,found=f.hit;
  out+=counter(26,276,'divisions tried',Math.max(0,tries),C.coral,140)+counter(176,276,'multiplications',1,C.green,140);
  if(found)out+=TMF(330,304,`${n} ÷ ${NW_PRIMES[f.i]} = ${n/NW_PRIMES[f.i]} ✓`,16,C.green,'start','font-weight="700"');
  else if(f.i>=0)out+=TMF(330,304,`${n} ÷ ${NW_PRIMES[f.i]} leaves ${n%NW_PRIMES[f.i]}`,15,C.coral,'start');
  out+=TF(300,344,'Trial division needs about √n tries. n with 10 digits: ~10 000 tries; 100 digits: ~10⁴⁸;',13,C.muted)+TF(300,362,'617 digits (2048-bit RSA): beyond any computer, even with the cleverest known methods.',13,C.muted);
  return {svg:out,phase:found?`Found it after ${tries} division${tries>1?'s':''}: ${n} = ${NW_PRIMES[f.i]} × ${n/NW_PRIMES[f.i]}. Multiplying took one step. Give each prime one more digit and the search takes roughly ten times as many divisions.`:f.i<0?`Multiplying ${p} by ${q} is instant. Now pretend you only know ${n} and must find the primes.`:`${NW_PRIMES[f.i]} does not divide ${n} exactly. Try the next prime.`};
 }});

/* ---- Digital signature lesson: hash properties ---- */
function NW_h32(str){let h=0x811c9dc5;for(const b of new TextEncoder().encode(str)){h^=b;h=Math.imul(h,0x01000193)>>>0}h^=h>>>16;h=Math.imul(h,0x85ebca6b)>>>0;h^=h>>>13;h=Math.imul(h,0xc2b2ae35)>>>0;h^=h>>>16;return h>>>0}
const NW_HV=['Pay Bob £10','Pay Bob £11','Pay Bob £90','pay Bob £10'];
SCENE({id:'hash-avalanche',name:'Cryptographic hash',tag:'A fingerprint for any message',
 definition:'A hash function turns any message into a fixed-size digest. A cryptographic hash must be quick to compute, give a completely different digest for any change (the avalanche effect), and be practically impossible to reverse or to make two messages collide.',
 example:'Changing £10 to £11 flips about half of the digest’s bits. To find a message with a given digest you can only guess: about 2³² tries for this 32-bit toy, 2²⁵⁶ for SHA-256.',
 desc:'The 32-bit digests of two messages shown as rows of bits, with the bits that differ highlighted and counted, beside the properties a cryptographic hash needs.',
 dur:12,hint:'Edit either message. One changed character should flip about 16 of the 32 bits, in no predictable pattern.',
 init:()=>({a:'Pay Bob £10',b:'Pay Bob £11'}),
 watch(p){return {a:NW_HV[0],b:NW_HV[Math.min(3,Math.floor(p*4))]}},
 ui:[{text:'Message A',label:'Message A',get:s=>s.a,act:'a',max:20},{text:'Message B',label:'Message B',get:s=>s.b,act:'b',max:20},{b:'B = A with one letter changed',act:'one'}],
 on:{a(s,v){s.a=v},b(s,v){s.b=v},one(s){const t=Array.from(s.a);if(!t.length){s.b='a';return}const i=t.length-1;t[i]=String.fromCodePoint(t[i].codePointAt(0)+1);s.b=t.join('')}},
 draw(s){
  const ha=NW_h32(s.a),hb=NW_h32(s.b),diff=(ha^hb)>>>0,nd=bin(diff,32).split('').filter(c=>c==='1').length,cw=15,x0=60;let out=heading('Change the message a little, the digest a lot');
  const row=(y,lab,msg,h,col)=>{let o=TBF(x0,y-8,lab,13,col,'start')+TMF(x0+30,y-8,`“${msg.slice(0,20)}”`,13,C.ink,'start','xml:space="preserve"')+TMF(580,y-8,'0x'+hex(h,8),13,col,'end','font-weight="700"');
   bin(h,32).split('').forEach((b,i)=>{const x=x0+i*cw+Math.floor(i/8)*4,d=diff>>>(31-i)&1;o+=R(x,y,cw-2,24,b==='1'?col:'#fff',d?C.amber:C.grid,3)+TMF(x+(cw-2)/2,y+17,b,13,b==='1'?'#fff':C.muted)});return o};
  out+=row(74,'A',s.a,ha,C.blue)+row(134,'B',s.b,hb,C.purple);
  bin(diff,32).split('').forEach((b,i)=>{if(b==='1'){const x=x0+i*cw+Math.floor(i/8)*4;out+=TF(x+(cw-2)/2,178,'↕',13,C.amber)}});
  out+=TBF(300,204,s.a===s.b?'Same message, same digest: 0 bits differ':`${nd} of 32 bits differ`,16,s.a===s.b?C.green:C.amber);
  const props=[['Deterministic','the same message always gives the same digest'],['Avalanche','any change flips about half the bits'],['One-way','from a digest you cannot work back to the message'],['Collision-resistant','finding two messages with one digest is infeasible']];
  props.forEach(([a,b],i)=>{const y=226+i*34;out+=R(40,y,520,30,i%2?'#f6f9fb':'#fff',C.grid,6)+TBF(52,y+20,a,13,C.ink,'start')+TF(212,y+20,b,13,C.muted,'start')});
  return {svg:out,phase:s.a===s.b?'Identical messages always give identical digests: that is what makes a digest useful as a fingerprint.':`${nd} of the 32 bits changed. A good hash makes each output bit depend on every input bit, so even one changed character gives an unrelated-looking digest. (This 32-bit toy shows the idea; real systems use SHA-256.)`};
 }});

/* ---- Digital signature lesson: certificate chains ---- */
const NW_CERT={none:'',name:'The site certificate says evil.example.net, but the address bar says shop.example.co.uk.',expired:'The site certificate expired on 1 March 2026; today is 14 November 2026.',tampered:'Someone edited the site certificate after it was signed, so the signature no longer matches its contents.',untrusted:'The chain ends at “Totally Legit Root”, which is not in the browser’s list of trusted authorities.'};
function NW_certFrames(s){
 const checks=[{c:'name',lvl:2,t:'Does the name match the address bar?'},{c:'expired',lvl:2,t:'Is today within the validity dates?'},{c:'tampered',lvl:2,t:'Is the site certificate signed by the issuing CA? (check with the CA’s public key)'},{c:'none',lvl:1,t:'Is the issuing CA’s certificate signed by the root? (check with the root’s public key)'},{c:'untrusted',lvl:0,t:'Is the root in the browser’s trust store?'}];
 const fr=[{step:-1,say:'The site sends its certificate and the issuing CA’s certificate. The browser already holds a list of trusted root authorities.'}];
 for(let i=0;i<checks.length;i++){const bad=s.fault===checks[i].c&&checks[i].c!=='none';fr.push({step:i,lvl:checks[i].lvl,q:checks[i].t,bad,say:bad?NW_CERT[s.fault]+' The browser refuses the connection.':checks[i].t.replace('?','')+': yes.'});if(bad)return fr}
 fr.push({step:5,ok:true,say:'Every link in the chain checks out, up to a root the browser already trusts. The padlock appears.'});
 return fr;
}
SCENE({id:'certificate-chain',name:'Certificates and the chain of trust',tag:'Who vouches for this public key?',
 definition:'A certificate binds a name to a public key and is signed by a certificate authority (CA). Browsers trust a short list of root CAs and check each signature in the chain from the site up to one of those roots.',
 example:'shop.example.co.uk’s certificate is signed by an issuing CA, whose certificate is signed by a root CA that ships with your browser. If any signature, name or date is wrong, you see a warning instead of a padlock.',
 desc:'Three certificate cards, site, issuing CA and root, linked by “signed by” arrows, with the browser’s trust store; checks run from the site certificate up to the root.',
 dur:13,hint:'Choose a problem with the chain and step through the browser’s checks to see where it fails.',
 init:()=>({fault:'none'}),
 ui:[{choose:[['none','All good'],['name','Wrong name'],['expired','Expired'],['tampered','Tampered'],['untrusted','Unknown root']],label:'Problem',get:s=>s.fault,act:'fault'}],
 on:{fault(s,v){s.fault=v}},
 trace:NW_certFrames,
 draw(s,f,X){
  const flt=s.fault;let out=heading('Each certificate vouches for the next one down');
  const certs=[{t:flt==='untrusted'?'Totally Legit Root':'Example Root CA',by:'itself (a root)',until:'2038'},{t:'Example Issuing CA',by:flt==='untrusted'?'Totally Legit Root':'Example Root CA',until:'2031'},{t:flt==='name'?'evil.example.net':'shop.example.co.uk',by:'Example Issuing CA',until:flt==='expired'?'1 Mar 2026':'2027'}];
  certs.forEach((c,i)=>{const y=48+i*92,on=f.lvl===i,bad=on&&f.bad;
   out+=R(30,y,330,76,bad?C.coralp:on?C.pale:'#fff',bad?C.coral:on?C.blue:C.grid,10)+R(30,y,10,76,i===0?C.purple:i===1?C.blue:C.green,'none',4);
   out+=TBF(52,y+22,c.t,14,C.ink,'start')+TF(52,y+42,'signed by '+c.by,13,C.muted,'start')+TF(52,y+62,'valid until '+c.until+(i===2&&flt==='tampered'?' · contents edited!':''),13,i===2&&flt==='tampered'?C.coral:C.muted,'start');
   if(i>0)out+=arrow(200,y-2,200,y-14,C.line,2,7)+TF(210,y-4,'signed by ↑',13,C.muted,'start')});
  const inStore=flt!=='untrusted';out+=R(400,48,180,120,'#fff',C.grid,10)+TBF(490,70,'Browser trust store',13,C.ink);
  ['Example Root CA','Another Root','A Third Root'].forEach((r,i)=>out+=TF(412,96+i*22,(f.lvl===0&&i===0&&inStore?'✓ ':'• ')+r,13,f.lvl===0&&i===0&&inStore?C.green:C.muted,'start'));
  out+=R(400,186,180,46,'#fff',C.grid,10)+TF(410,205,'Address bar',13,C.muted,'start')+TMF(410,224,'shop.example.co.uk',13,C.ink,'start');
  out+=R(20,328,560,44,f.ok?C.greenp:f.bad?C.coralp:'#fff',f.ok?C.green:f.bad?C.coral:C.grid,10);
  out+=TBF(300,355,f.ok?'🔒 Connection secure':f.bad?'⚠ Warning: certificate not valid':f.q||'Checking the chain…',f.q&&!f.bad&&!f.ok?13.5:15,f.ok?C.green:f.bad?C.coral:C.ink);
  const done=Math.max(0,f.step);out+=counter(400,250,'checks passed',f.ok?5:f.bad?done:done,C.blue,180);
  return {svg:out,phase:f.say};
 }});

/* ---- Digital signature lesson: man in the middle ---- */
function NW_mitmFrames(s){
 const p=23,g=5,a=6,b=15,m=13,A=NW_mod(g,a,p),B=NW_mod(g,b,p),M=NW_mod(g,m,p),K1=NW_mod(M,a,p),K2=NW_mod(M,b,p);
 const fr=[{say:`Alice and Bob want a shared key, but every message passes through Mallory, who can change it.`,keys:{}}];
 fr.push({leg:['A','M'],label:`A = ${A}`,say:`Alice sends her key share ${A}. Mallory keeps it and sends Bob her own share ${M} instead.`,keys:{}});
 fr.push({leg:['M','B'],label:`${M} (Mallory’s)`,say:'Bob receives Mallory’s share, believing it came from Alice.',keys:{}});
 if(s.auth==='yes'){
  fr.push({leg:['B','M'],label:`B = ${B} + signature`,say:`Bob replies with ${B}, signed with the private key in his certificate.`,keys:{}});
  fr.push({leg:['M','A'],label:`${M} + forged signature?`,forged:true,say:'Mallory swaps in her own share again, but she cannot produce Bob’s signature for it.',keys:{}});
  fr.push({caught:true,say:'Alice checks the signature with Bob’s public key from his certificate. It fails, so she knows someone tampered with the exchange and stops. This is what the certificate check in HTTPS is for.',keys:{}});
  return fr}
 fr.push({leg:['B','M'],label:`B = ${B}`,say:`Bob replies with ${B}. Mallory keeps it too…`,keys:{}});
 fr.push({leg:['M','A'],label:`${M} (Mallory’s)`,say:'…and sends Alice her own share, so Alice also thinks she is talking to Bob.',keys:{}});
 fr.push({say:`Alice computes ${M}^${a} mod 23 = ${K1}; Mallory gets the same from ${A}^${m}. Bob computes ${M}^${b} mod 23 = ${K2}; Mallory gets that too. Two keys, and Mallory has both.`,keys:{A:K1,M:`${K1} and ${K2}`,B:K2}});
 fr.push({leg:['A','M'],label:'“PIN 4721” 🔒'+K1,say:`Alice encrypts her secret with key ${K1}. Mallory decrypts it and reads it.`,keys:{A:K1,M:`${K1} and ${K2}`,B:K2},read:true});
 fr.push({leg:['M','B'],label:'“PIN 4721” 🔒'+K2,say:`Mallory re-encrypts with key ${K2} and passes it on. Bob reads it happily. Neither of them notices anything wrong.`,keys:{A:K1,M:`${K1} and ${K2}`,B:K2},read:true});
 return fr;
}
SCENE({id:'man-in-the-middle',name:'Man-in-the-middle attack',tag:'Encryption without authentication',
 definition:'An attacker who can intercept and replace messages sits between two people, agreeing one key with each of them. Both connections are encrypted, but the attacker reads everything. Authentication (signatures and certificates) is what stops it.',
 example:'On a rogue Wi-Fi hotspot, a key exchange with no identity check can be hijacked. HTTPS prevents this because the server signs its key share and the browser checks the certificate.',
 desc:'Alice, Mallory and Bob in a line; key shares and messages pass through Mallory, who swaps them for her own, unless Bob’s share is signed and Alice checks the signature.',
 dur:14,hint:'Step through without authentication, then switch on “Bob signs his share” and see Mallory get caught.',
 init:()=>({auth:'no'}),
 ui:[{choose:[['no','No authentication'],['yes','Bob signs his share']],label:'Authentication',get:s=>s.auth,act:'auth'}],
 on:{auth(s,v){s.auth=v}},
 trace:NW_mitmFrames,
 draw(s,f,X){
  const pos={A:[80,150],M:[300,230],B:[520,150]},u=smooth(X.u);let out=heading(s.auth==='yes'?'A signature Mallory cannot forge':'Two encrypted links, one eavesdropper in the middle');
  out+=L(80,150,300,230,C.line,2,'stroke-dasharray="5 4"')+L(300,230,520,150,C.line,2,'stroke-dasharray="5 4"')+L(110,150,490,150,'#e3ebef',2)+TF(300,140,'what Alice and Bob think happens',13,C.muted);
  const who=(k,name,col)=>{const [x,y]=pos[k];return Ci(x,y,32,'#fff',col)+TBF(x,y+5,name,14,col)+(f.keys&&f.keys[k]!==undefined?TMF(x,y+52,'key '+f.keys[k],13,C.ink,'middle','font-weight="700"'):'')};
  out+=who('A','Alice',C.blue)+who('B','Bob',C.blue)+who('M','Mallory',C.coral);
  if(f.leg){const [a,b]=f.leg,pa=pos[a],pb=pos[b],x=lerp(pa[0],pb[0],u),y=lerp(pa[1],pb[1],u),w=Math.max(90,f.label.length*7.8+16);out+=R(x-w/2,y-48,w,26,f.forged?C.coralp:'#fff',f.forged?C.coral:C.purple,7)+TMF(x,y-30,f.label,13,f.forged?C.coral:C.ink,'middle','font-weight="700"')+Ci(x,y,6,C.purple)}
  if(f.read)out+=R(220,294,160,28,C.coralp,C.coral,8)+TBF(300,313,'Mallory reads: PIN 4721',13,C.coral);
  if(f.caught)out+=R(60,300,480,52,C.greenp,C.green,10)+TBF(300,322,'✗ Signature check fails at Alice: attack detected',15,C.green)+TF(300,342,'Mallory can change the numbers but cannot sign them as Bob.',13,C.ink);
  return {svg:out,phase:f.say};
 }});
