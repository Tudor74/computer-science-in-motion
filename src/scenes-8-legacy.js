/* ===================== Ted Nelson era 8 · Reading and legacy ===================== */
// What research says about reading hypertext, and where Nelson's ideas live on: backlinks, ranking by links,
// content addresses, Merkle trees, wiki transclusion, and his "intertwingled" view of knowledge.
// Every picture is a pure function of state, frame and X; the navigation experiment counts the learner's clicks.
const T8_wrap=(str,n)=>{const out=[];let line='';for(const w of String(str).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out};
const T8_lines=(x,y,lines,size=13,fill=C.ink,anchor='start',lh=18)=>lines.map((l,i)=>TF(x,y+i*lh,l,size,fill,anchor)).join('');
// FNV-1a, 32 bits: a small, fast, non-cryptographic hash, used here only to show the idea of a content address.
function T8_fnv(str){let h=0x811c9dc5;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h.toString(16).padStart(8,'0')}

/* =========================== reading-hypertext =========================== */
// A twelve-page hypertext with one-way links. Tasks start at Start; clicks are compared with the shortest path.
const T8_PAGES={home:'Start',memex:'Memex',trails:'Trails',hyper:'Hypertext',xan:'Xanadu',trans:'Transclusion',two:'Two-way',lib:'Computer Lib',web:'The web',rot:'Link rot',zz:'ZigZag',ver:'Versions'};
const T8_OUT={home:['memex','lib','web'],memex:['trails','hyper'],trails:['memex','ver'],hyper:['xan','home'],xan:['trans','two','zz'],trans:['ver','xan'],two:['web'],lib:['hyper','zz'],web:['rot','home'],rot:['two'],zz:['lib'],ver:['trans','rot']};
const T8_POS={lib:[340,64],home:[435,64],memex:[530,64],zz:[340,110],hyper:[435,110],trails:[530,110],two:[340,156],xan:[435,156],ver:[530,156],web:[340,202],rot:[435,202],trans:[530,202]};
const T8_TASKS=['ver','zz','rot','trans'];
function T8_bfs(from,to){const d={[from]:0},q=[from];while(q.length){const u=q.shift();if(u===to)return d[u];for(const v of T8_OUT[u])if(d[v]===undefined){d[v]=d[u]+1;q.push(v)}}return Infinity}
const T8_SIMPATH=['home','web','home','memex','trails','memex','hyper','xan','trans'];
SCENE({id:'reading-hypertext',name:'Try it: lost in hyperspace?',tag:'Navigating one-way links',
 definition:'Conklin (1987) named two costs of reading hypertext: disorientation (not knowing where you are or how to get somewhere) and cognitive overhead (the effort of deciding which link to follow). Overview maps are the classic remedy.',
 example:'Asked to find “Transclusion” from the Start page, a reader without a map may wander through the web pages and back before finding the four-step route through Memex, Hypertext and Xanadu.',
 desc:'A page with its outgoing links as buttons, an optional overview map of all twelve pages with your path drawn on it, and a chart comparing your clicks with the shortest route for each task.',
 research:['Conklin, J. (1987). Hypertext: an introduction and survey. IEEE Computer 20(9), 17–41: disorientation and cognitive overhead.','Nilsson, R. M. & Mayer, R. E. (2002). The effects of graphic organizers giving cues to the structure of a hypertext document on users’ navigation strategies and performance. International Journal of Human-Computer Studies 57(1), 1–26: maps can make navigation easier without always improving learning.'],
 dur:12,hint:'Follow links to reach each target page. Switch the map on or off before a task to compare. Your clicks stay in this page.',
 init:()=>({cur:'home',task:0,clicks:0,map:false,path:['home'],res:[]}),
 watch(p){const k=Math.min(T8_SIMPATH.length-1,Math.floor(p*1.15*T8_SIMPATH.length));return {cur:T8_SIMPATH[k],task:3,clicks:k,map:p>.5,path:T8_SIMPATH.slice(0,k+1),res:[{t:'ver',c:5,s:3,map:false},{t:'zz',c:2,s:2,map:true},{t:'rot',c:4,s:2,map:false}],sim:true}},
 ui:[{choose:[[false,'No map'],[true,'Overview map']],label:'Map',get:s=>s.map,act:'map'},{b:'Back',act:'back'},{b:'New round',act:'again'}],
 on:{map(s,v){s.map=v===true||v==='true';return 'keep'},
  go(s,to){if(s.task>=T8_TASKS.length||!T8_OUT[s.cur].includes(to))return 'keep';s.cur=to;s.clicks++;s.path.push(to);
   if(to===T8_TASKS[s.task]){s.res.push({t:to,c:s.clicks,s:T8_bfs('home',to),map:s.map});s.task++;s.cur='home';s.clicks=0;s.path=['home']}return 'keep'},
  back(s){if(s.path.length>1&&s.task<T8_TASKS.length){s.path.pop();s.cur=s.path[s.path.length-1];s.clicks++}return 'keep'},
  again(s){s.task=0;s.cur='home';s.clicks=0;s.path=['home'];if(s.res.length>8)s.res=s.res.slice(-8);return 'keep'}},
 draw(s,f,X){
  const done=s.task>=T8_TASKS.length,target=done?null:T8_TASKS[s.task];let out=heading(done?'Round complete':`Task ${s.task+1} of 4: find “${T8_PAGES[target]}”`,26);
  out+=R(20,44,260,196,'#fff',C.grid,8)+TBF(34,68,done?'Done':T8_PAGES[s.cur],17,C.ink,'start')+TF(266,68,done?'':`${s.clicks} click${s.clicks===1?'':'s'}`,13,C.muted,'end');
  if(!done){out+=TF(34,90,'Links on this page:',13,C.muted,'start');
   T8_OUT[s.cur].forEach((to,i)=>{const y=100+i*40;out+=hit(X,'go',to,`Link to ${T8_PAGES[to]}`,R(34,y,232,32,C.pale,C.blue,6)+TF(46,y+21,'→ '+T8_PAGES[to],13,C.blue,'start'))})}
  else out+=T8_lines(34,100,['All four pages found.','Press New round to try again,','perhaps with the map switched','the other way.'],13,C.ink);
  out+=R(296,44,284,196,s.map?'#fff':'#f3f6f8',C.grid,8);
  if(s.map){for(const u in T8_OUT)for(const v of T8_OUT[u])out+=L(T8_POS[u][0],T8_POS[u][1],T8_POS[v][0],T8_POS[v][1],'#d7e2e9',1.3);
   for(let i=1;i<s.path.length;i++){const a=T8_POS[s.path[i-1]],b=T8_POS[s.path[i]];out+=L(a[0],a[1],b[0],b[1],C.coral,2.6)}
   for(const id in T8_POS){const [x,y]=T8_POS[id],isCur=id===s.cur,isT=id===target;out+=Ci(x,y,isCur?8:6,isCur?C.coral:isT?C.green:'#fff',isT?C.green:C.blue)+TF(x,y+19,T8_PAGES[id],13,isT?C.green:C.ink)}}
  else out+=TF(438,146,'Map hidden',14,C.muted);
  out+=TBF(20,262,'Clicks per task: yours against the shortest route',13,C.ink,'start');
  const base=352,bh=v=>Math.min(v,10)*7.5;out+=L(20,base,580,base,C.line,1.5);
  s.res.slice(-8).forEach((r,i)=>{const x=40+i*68;out+=R(x,base-bh(r.s),22,bh(r.s),'#c9d6de','none',3)+R(x+24,base-bh(r.c),22,bh(r.c),r.map?C.blue:C.purple,'none',3)+TF(x+34,base-bh(r.c)-5,String(r.c),13,C.ink)+TF(x+23,base+16,{ver:'Versions',zz:'ZigZag',rot:'Link rot',trans:'Transcl.'}[r.t],13,C.muted)});
  if(!s.res.length)out+=TF(300,320,'Finish a task to see your bar',13,C.muted);
  out+=TF(580,262,'grey shortest · blue map · purple no map',13,C.muted,'end');
  const extra=s.res.length?` So far: ${s.res.map(r=>r.c).reduce((a,b)=>a+b,0)} clicks against ${s.res.map(r=>r.s).reduce((a,b)=>a+b,0)} on the shortest routes.`:'';
  return {svg:out,phase:(s.sim?'Simulated reader. ':'')+(done?'All four found.':`You are on “${T8_PAGES[s.cur]}”. The shortest route from Start to “${T8_PAGES[target]}” takes ${T8_bfs('home',target)} clicks.`)+extra};
 }});

// Illustrative trade-off from the review literature: more link decisions add load, more so for novices.
const T8_comp=(links,know,net)=>clamp((know==='high'?.82:.68)-(know==='high'?.010:.026)*links*(net?1.3:1),.15,.95);
SCENE({id:'reading-hypertext-load',name:'Links cost attention',tag:'Cognitive load in hypertext reading',
 definition:'Every link is a small decision. Reviews of hypertext reading find that these decisions, and the work of keeping track of where you are, add to the reader’s mental load, and that readers with little prior knowledge are hurt most; clear structure reduces the cost.',
 example:'A newcomer reading pages with a dozen links each tends to understand less than one reading a well-ordered sequence; an expert is barely affected.',
 desc:'Two illustrative curves of comprehension against links per page, one for readers with high and one for readers with low prior knowledge, with a marker for the settings chosen and a bar for decision load.',
 research:['DeStefano, D. & LeFevre, J.-A. (2007). Cognitive load in hypertext reading: a review. Computers in Human Behavior 23(3), 1616–1641.','Conklin, J. (1987). Hypertext: an introduction and survey. IEEE Computer 20(9). The curves here are an illustrative shape of the review’s conclusions, not data from one study.'],
 dur:10,hint:'Change the number of links per page, the reader’s prior knowledge and the structure, and watch the marker move.',
 init:()=>({links:6,know:'low',net:true}),
 watch(p){return {links:Math.round(1+p*11),know:p<.5?'low':'high',net:true}},
 ui:[{range:'links',label:'Links per page',min:1,max:12,step:1,get:s=>s.links,act:'links'},{choose:[['low','Low'],['high','High']],label:'Prior knowledge',get:s=>s.know,act:'know'},{choose:[[true,'Tangled network'],[false,'Clear hierarchy']],label:'Structure',get:s=>s.net,act:'net'}],
 on:{links(s,v){s.links=clamp(Math.round(Number(v)),1,12);return 'keep'},know(s,v){s.know=v;return 'keep'},net(s,v){s.net=v===true||v==='true';return 'keep'}},
 draw(s){
  let out=heading('More link decisions, less understanding: an illustration',26);
  const x0=70,y0=60,w=330,h=230,X=v=>x0+(v-1)/11*w,Y=v=>y0+h-v*h;
  out+=R(x0,y0,w,h,'#fff',C.grid,4);[0,.25,.5,.75,1].forEach(v=>{out+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-8,Y(v)+4,Math.round(v*100)+'%',13,C.muted,'end')});
  [1,4,8,12].forEach(v=>{out+=TF(X(v),y0+h+18,String(v),13,C.muted)});out+=TF(x0+w/2,y0+h+38,'links per page',13,C.muted)+TF(x0,y0-8,'comprehension (illustrative)',13,C.muted,'start');
  for(const k of ['high','low']){let d='';for(let l=1;l<=12;l+=.5)d+=(l===1?'M':'L')+fmt(X(l))+' '+fmt(Y(T8_comp(l,k,s.net)));out+=P(d,k==='high'?C.blue:C.coral,k===s.know?3:1.6,'none',k===s.know?'':'stroke-dasharray="5 4"')}
  out+=TF(X(12)-4,Y(T8_comp(12,'high',s.net))-14,'high knowledge',13,C.blue,'end')+TF(X(12)-4,Y(T8_comp(12,'low',s.net))+18,'low knowledge',13,C.coral,'end');
  const c=T8_comp(s.links,s.know,s.net);out+=Ci(X(s.links),Y(c),7,C.ink);
  const load=clamp(.12+.06*s.links*(s.net?1.3:1),0,1);
  out+=TBF(430,72,'Decision load',13,C.ink,'start')+R(430,82,150,22,'#eef3f6','none',6)+R(430,82,150*load,22,load>.6?C.coral:C.amber,'none',6);
  out+=TBF(430,142,'Comprehension',13,C.ink,'start')+TBF(430,168,Math.round(c*100)+'%',22,C.ink,'start')+TF(430,190,'(illustrative)',13,C.muted,'start');
  out+=T8_lines(430,226,T8_wrap(s.net?'Tangled: links jump anywhere, so readers must keep track themselves.':'Hierarchy: links follow a clear outline, which lowers the cost.',22),13,C.muted);
  return {svg:out,phase:`${s.links} link${s.links===1?'':'s'} per page, ${s.know} prior knowledge, ${s.net?'tangled network':'clear hierarchy'}: about ${Math.round(c*100)}% on this illustrative scale. The gap between the curves is the review’s main point: the same links cost novices more.`};
 }});

// Reading order: coherence (follow the most related next node) against interest. Relatedness set by hand.
const T8_TOP=['Memex trails','Hypertext 1965','Xanadu links','Web links','Link rot','Backlinks'];
const T8_REL=[[0,.8,.5,.3,.1,.5],[.8,0,.8,.5,.2,.3],[.5,.8,0,.7,.4,.6],[.3,.5,.7,0,.8,.6],[.1,.2,.4,.8,0,.5],[.5,.3,.6,.6,.5,0]];
const T8_PATHS={coherence:[0,1,2,3,4,5],interest:[4,0,5,1,3,2]};
const T8_coh=o=>o.length<2?0:sum(o.slice(1).map((v,i)=>T8_REL[o[i]][v]))/(o.length-1);
SCENE({id:'reading-hypertext-order',name:'Choosing a reading order',tag:'Coherence or interest',
 definition:'In hypertext the reader chooses the order. Studies by Salmerón and colleagues found that readers with little prior knowledge understood more when they chose each next text by how closely it followed from the last (coherence) than by what looked most interesting.',
 example:'Going from Memex trails to Hypertext to Xanadu links keeps each step closely related; jumping from Link rot to Memex trails to Backlinks makes the reader build the bridges.',
 desc:'Six texts arranged in a circle with their relatedness shown as line thickness, the reading order you build, and bars comparing its average step relatedness with a coherence order and an interest order.',
 research:['Salmerón, L., Cañas, J. J., Kintsch, W. & Fajardo, I. (2005). Reading strategies and hypertext comprehension. Discourse Processes 40(3), 171–191.','The relatedness values here are set by hand for illustration.'],
 dur:10,hint:'Press the texts in the order you would read them. Compare your order’s coherence with the two strategies.',
 init:()=>({order:[]}),
 watch(p){const pth=p<.5?T8_PATHS.coherence:T8_PATHS.interest;return {order:pth.slice(0,1+Math.floor(((p%.5)/.5)*6)),which:p<.5?'coherence':'interest'}},
 ui:[{b:'Undo',act:'undo'},{b:'Clear',act:'clear'}],
 on:{add(s,i){i=Number(i);if(!s.order.includes(i))s.order.push(i);return 'keep'},undo(s){s.order.pop();return 'keep'},clear(s){s.order=[];return 'keep'}},
 draw(s,f,X){
  const cx=170,cy=205,r=118,pos=i=>[cx+r*Math.cos(-Math.PI/2+i*Math.PI/3),cy+r*Math.sin(-Math.PI/2+i*Math.PI/3)];let out=heading('Each step’s relatedness adds up to coherence',26);
  for(let i=0;i<6;i++)for(let j=i+1;j<6;j++){const a=pos(i),b=pos(j);out+=L(a[0],a[1],b[0],b[1],'#d5e0e7',T8_REL[i][j]*5)}
  for(let k=1;k<s.order.length;k++){const a=pos(s.order[k-1]),b=pos(s.order[k]);out+=arrowR(a,b,30,32,C.coral,3)}
  for(let i=0;i<6;i++){const [x,y]=pos(i),n=s.order.indexOf(i);out+=hit(X,'add',i,`Read ${T8_TOP[i]}`,R(x-56,y-17,112,34,n>=0?C.coralp:'#fff',n>=0?C.coral:C.blue,8)+TF(x,y+5,T8_TOP[i],13,C.ink));if(n>=0)out+=Ci(x-56,y-17,10,C.coral)+TBF(x-56,y-12,String(n+1),13,'#fff')}
  const bars=[['Your order',T8_coh(s.order),C.coral],['Coherence order',T8_coh(T8_PATHS.coherence),C.blue],['Interest order',T8_coh(T8_PATHS.interest),C.purple]];
  out+=TBF(360,72,'Average relatedness per step',13,C.ink,'start');
  bars.forEach(([n,v,c],i)=>{const y=96+i*58;out+=TF(360,y,n,13,C.ink,'start')+R(360,y+8,210,20,'#eef3f6','none',5)+R(360,y+8,210*v,20,c,'none',5)+TBF(574,y+23,s.order.length<2&&i===0?'—':v.toFixed(2),13,C.ink,'end')});
  out+=T8_lines(360,290,T8_wrap(s.order.length===6?'All six read. Compare your bar with the two strategies.':`${s.order.length} of 6 texts read.`,30),13,C.muted);
  return {svg:out,phase:s.which?`${s.which==='coherence'?'A coherence order: each next text is the one most related to the last.':'An interest order: jumps to whatever looks most interesting, leaving gaps the reader must bridge.'}`:(s.order.length>1?`Your order averages ${T8_coh(s.order).toFixed(2)} per step, against ${T8_coh(T8_PATHS.coherence).toFixed(2)} for the coherence order.`:'Press the texts in the order you would read them.')};
 }});

/* =========================== backlinks =========================== */
const T8_WIKI=['Xanadu','Hypertext','Memex','Web','ZigZag','Link rot'];
const T8_WL=[[1,2],[1,0],[0,1],[0,4],[3,1],[3,5],[5,3],[4,0]];
const T8_wpos=i=>[175+115*Math.cos(-Math.PI/2+i*Math.PI/3),205+115*Math.sin(-Math.PI/2+i*Math.PI/3)];
SCENE({id:'backlinks',name:'Backlinks: the other end of a link',tag:'Two-way links in wikis',
 definition:'A backlink is a link seen from the page it points to. Nelson wanted every link visible from both ends; the web stores links only on the page they leave from, so “what links here?” needs a search over every page. Wikis keep that index for you.',
 example:'The Hypertext page links to Memex and Xanadu. Its backlinks, from Xanadu and Web, appear on the Hypertext page in a wiki; on the open web you would need a crawler to find them.',
 desc:'Six wiki pages joined by arrows, the chosen page’s outgoing links in blue and incoming links in green, and a panel listing both.',
 research:['Leuf, B. & Cunningham, W. (2001). The Wiki Way. Addison-Wesley: the first wiki (1995) listed the pages that link to each page.','Nelson, T. H. (1981). Literary Machines: links visible and followable from both ends. Wikipedia’s “What links here” keeps the same index.'],
 dur:10,hint:'Press a page to see its links both ways. Switch between a wiki and the open web.',
 init:()=>({sel:1,mode:'wiki'}),
 watch(p){return {sel:Math.min(5,Math.floor(p*6)),mode:'wiki'}},
 ui:[{choose:[['wiki','In a wiki'],['web','On the open web']],label:'Where',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v;return 'keep'},sel(s,i){s.sel=Number(i);return 'keep'}},
 draw(s,f,X){
  let out=heading('Every link has two ends',26);
  T8_WL.forEach(([a,b])=>{const out_=a===s.sel,in_=b===s.sel;out+=arrowR(T8_wpos(a),T8_wpos(b),34,36,out_?C.blue:in_?(s.mode==='wiki'?C.green:'#b9c8d2'):'#cdd9e1',out_||in_?3:1.8)});
  T8_WIKI.forEach((n,i)=>{const [x,y]=T8_wpos(i);out+=hit(X,'sel',i,`Page ${n}`,R(x-40,y-16,80,32,i===s.sel?C.coralp:'#fff',i===s.sel?C.coral:C.blue,8)+TF(x,y+5,n,13,C.ink))});
  const outs=T8_WL.filter(l=>l[0]===s.sel).map(l=>T8_WIKI[l[1]]),ins=T8_WL.filter(l=>l[1]===s.sel).map(l=>T8_WIKI[l[0]]);
  out+=R(370,52,210,300,C.pale,'none',10)+TBF(384,78,T8_WIKI[s.sel],16,C.ink,'start');
  out+=TBF(384,108,'Links from here →',13,C.blue,'start')+T8_lines(398,130,outs.length?outs:['(none)'],13,C.ink);
  out+=TBF(384,212,'← Linked from',13,s.mode==='wiki'?C.green:C.muted,'start');
  out+=s.mode==='wiki'?T8_lines(398,234,ins.length?ins:['(none)'],13,C.ink):T8_lines(384,234,['Not stored. Finding these','means crawling every page','on the web.'],13,C.coral);
  return {svg:out,phase:s.mode==='wiki'?`${T8_WIKI[s.sel]} links to ${outs.length?outs.join(' and '):'nothing'}, and is linked from ${ins.length?ins.join(' and '):'nowhere'}. The wiki keeps both lists, as Nelson asked.`:`On the open web only the outgoing links are written in the page; ${ins.length} page${ins.length===1?'':'s'} link here, but nothing on this page says so.`};
 }});

// PageRank on the same six pages: power iteration with damping 0.85; pages with no outgoing links share evenly.
function T8_rank(links,n=6,d=.85,it=60){let r=Array(n).fill(1/n);const out=range(n).map(i=>links.filter(l=>l[0]===i).map(l=>l[1]));
 for(let k=0;k<it;k++){const nr=Array(n).fill((1-d)/n);for(let i=0;i<n;i++){if(out[i].length)out[i].forEach(j=>nr[j]+=d*r[i]/out[i].length);else for(let j=0;j<n;j++)nr[j]+=d*r[i]/n}r=nr}return r}
SCENE({id:'backlinks-rank',name:'Backlinks as votes',tag:'Ranking pages by who links to them',
 definition:'Search engines turned the web’s one-way links into backlinks by crawling every page, then treated each backlink as a vote. PageRank weights each vote by the rank of the page casting it, shared among that page’s links.',
 example:'Xanadu ranks highest: it is linked from Hypertext, itself well linked, and from ZigZag. Add a link from ZigZag to Memex and Memex climbs from about 13% to about 20%.',
 desc:'Bars of each page’s PageRank (with its count of incoming links), recomputed when you add a link, and the link list that drives them.',
 research:['Brin, S. & Page, L. (1998). The anatomy of a large-scale hypertextual web search engine. Computer Networks and ISDN Systems 30, 107–117.','Kleinberg, J. M. (1999). Authoritative sources in a hyperlinked environment. Journal of the ACM 46(5), 604–632.'],
 dur:10,hint:'Choose a page to link from and a page to link to, then add the link. Watch the ranks and the incoming-link counts change.',
 init:()=>({extra:[],from:4,to:2}),
 watch(p){return {extra:p<.5?[]:[[4,2],[5,2]].slice(0,p<.75?1:2),from:4,to:2,iters:Math.max(1,Math.round(Math.min(1,p*2)*30))}},
 ui:[{choose:T8_WIKI.map((n,i)=>[i,n]),label:'From',get:s=>s.from,act:'from'},{choose:T8_WIKI.map((n,i)=>[i,n]),label:'To',get:s=>s.to,act:'to'},{b:'Add link',act:'add'},{b:'Remove last added',act:'pop'}],
 on:{from(s,v){s.from=Number(v);return 'keep'},to(s,v){s.to=Number(v);return 'keep'},
  add(s){const l=[s.from,s.to];if(s.from!==s.to&&!T8_WL.concat(s.extra).some(m=>m[0]===l[0]&&m[1]===l[1])&&s.extra.length<8)s.extra.push(l);return 'keep'},pop(s){s.extra.pop();return 'keep'}},
 draw(s){
  const links=T8_WL.concat(s.extra),r=T8_rank(links,6,.85,s.iters||60),ins=range(6).map(i=>links.filter(l=>l[1]===i).length);let out=heading('Each link is a vote, weighted by the voter’s rank',26);
  const top=Math.max(...r),order=range(6).sort((a,b)=>r[b]-r[a]);
  order.forEach((i,k)=>{const y=58+k*42;out+=TF(20,y+20,T8_WIKI[i],13,C.ink,'start')+R(110,y+4,260,24,'#eef3f6','none',5)+R(110,y+4,260*r[i]/top,24,k===0?C.blue:tint(C.blue,.35),'none',5)+TBF(376,y+21,(r[i]*100).toFixed(1)+'%',13,C.ink,'start')+TF(440,y+21,`${ins[i]} in`,13,C.green,'start')});
  const added=s.extra.map(l=>`${T8_WIKI[l[0]]} → ${T8_WIKI[l[1]]}`);out+=TF(20,356,'Added: '+(added.length?added.slice(-3).join(' · ')+(added.length>3?` (+${added.length-3})`:''):'none yet'),13,added.length?C.coral:C.muted,'start');
  out+=TF(20,330,`Damping 0.85 · ${links.length} links · ${s.iters?`after ${s.iters} iterations`:'converged'} · bars sorted by rank`,13,C.muted,'start');
  return {svg:out,phase:`${T8_WIKI[order[0]]} ranks highest with ${(r[order[0]]*100).toFixed(1)}% of the rank and ${ins[order[0]]} incoming links. Rank is not just a count: a link from a well-linked page is worth more.`};
 }});

// Notes with bidirectional links: backlinks and unlinked mentions, as in Zettelkasten-style note tools.
const T8_NOTES=[{t:'Trails',b:'The [[Memex]] stored trails between documents.'},{t:'Memex',b:'Bush imagined a desk that kept trails of reading.'},{t:'Transclusion',b:'Quoting by reference, as in [[Xanadu]].'},
 {t:'Xanadu',b:'Nelson’s design used [[Transclusion]] and two-way links.'},{t:'Backlinks',b:'Every note shows who links to it, as Xanadu wanted.'}];
const T8_links=n=>[...n.b.matchAll(/\[\[([^\]]+)\]\]/g)].map(m=>m[1]);
SCENE({id:'backlinks-notes',name:'Notes that link both ways',tag:'From card index to note apps',
 definition:'Personal note tools since about 2019 show, under each note, every note that links to it, and even notes that mention its title without linking. The idea goes back through wikis to Nelson’s two-way links and to card indexes such as Niklas Luhmann’s Zettelkasten.',
 example:'The Memex note links nowhere, yet it shows a backlink from Trails, and the word “trails” in its own text is offered as an unlinked mention of the Trails note.',
 desc:'A list of five notes, the chosen note with its links highlighted, the notes that link to it, and the notes that mention its title without a link.',
 research:['Luhmann, N. (1981). Kommunikation mit Zettelkästen. In Baier, H. et al. (eds), Öffentliche Meinung und sozialer Wandel. Westdeutscher Verlag.','Schmidt, J. F. K. (2016). Niklas Luhmann’s card index: thinking tool, communication partner, publication machine. In Cevolini, A. (ed.), Forgetting Machines. Brill. Claims that backlink tools improve thinking rest mostly on personal accounts, not controlled studies.'],
 dur:10,hint:'Press a note on the left to open it.',
 init:()=>({sel:1}),
 watch(p){return {sel:Math.min(4,Math.floor(p*5))}},
 ui:[],
 on:{sel(s,i){s.sel=Number(i);return 'keep'}},
 draw(s,f,X){
  const n=T8_NOTES[s.sel];let out=heading('Each note shows who links to it',26);
  T8_NOTES.forEach((m,i)=>{const y=56+i*48;out+=hit(X,'sel',i,`Open note ${m.t}`,R(20,y,150,38,i===s.sel?C.coralp:'#fff',i===s.sel?C.coral:C.blue,8)+TF(95,y+24,m.t,13,C.ink))});
  out+=R(190,52,390,300,'#fff',C.grid,10)+TBF(206,80,n.t,17,C.ink,'start');
  const shown=n.b.replace(/\[\[([^\]]+)\]\]/g,'$1');out+=T8_lines(206,108,T8_wrap(shown,50),14,C.ink,'start',20);
  const ls=T8_links(n);out+=TF(206,156,ls.length?'Links to: '+ls.join(', '):'Links to: (none)',13,C.blue,'start');
  const back=T8_NOTES.filter(m=>T8_links(m).includes(n.t)).map(m=>m.t);
  const ment=T8_NOTES.filter(m=>m!==n&&!T8_links(m).includes(n.t)&&m.b.replace(/\[\[[^\]]+\]\]/g,'').toLowerCase().includes(n.t.toLowerCase())).map(m=>m.t);
  out+=L(206,176,564,176,C.grid,1.5)+TBF(206,200,`Linked from (${back.length})`,13,C.green,'start')+T8_lines(220,222,back.length?back:['(none)'],13,C.ink);
  out+=TBF(206,278,`Unlinked mentions (${ment.length})`,13,C.amber,'start')+T8_lines(220,300,ment.length?ment.map(m=>m+' mentions “'+n.t.toLowerCase()+'”'):['(none)'],13,C.ink);
  return {svg:out,phase:`“${n.t}”: ${back.length} backlink${back.length===1?'':'s'} and ${ment.length} unlinked mention${ment.length===1?'':'s'}. The note did nothing to collect them; the tool keeps the other end of every link.`};
 }});

/* =========================== content-addressing =========================== */
const T8_TEXTS=['Links should go both ways.','Links should go both ways!','Links should go both ways and last.'];
SCENE({id:'content-addressing',name:'Naming content by what it is',tag:'Location addresses and content addresses',
 definition:'A location address says where a file is (a server and a path), so it breaks when the file moves. A content address is computed from the content itself with a hash function, so any copy anywhere can answer to it, and any change gives a new address.',
 example:'Changing a full stop to an exclamation mark gives a completely different content address. Moving the file to another server breaks its web address but not its content address.',
 desc:'A short text, its location address and its content address with their status, and a list of the content addresses of three nearly identical versions.',
 research:['Merkle, R. C. (1987). A digital signature based on a conventional encryption function. CRYPTO ’87, LNCS 293: hash trees.','Benet, J. (2014). IPFS: content addressed, versioned, P2P file system. arXiv:1407.3561. The 8-digit hash here is a small FNV-1a hash for illustration; real systems use cryptographic hashes such as SHA-256.'],
 dur:10,hint:'Choose a version of the text, and move the file to another server. Compare the two kinds of address.',
 init:()=>({v:0,moved:false}),
 watch(p){return {v:Math.min(2,Math.floor(p*3)),moved:p>.66}},
 ui:[{choose:[[0,'Version 1'],[1,'Version 2'],[2,'Version 3']],label:'Text',get:s=>s.v,act:'v'},{b:'Move the file to another server',act:'move'}],
 on:{v(s,v){s.v=Number(v);return 'keep'},move(s){s.moved=!s.moved;return 'keep'}},
 draw(s){
  const t=T8_TEXTS[s.v],h=T8_fnv(t);let out=heading('Where it is, or what it is?',26);
  out+=R(20,46,560,44,C.pale,'none',8)+TF(34,73,'“'+t+'”',15,C.ink,'start');
  out+=TBF(20,120,'Location address',13,C.ink,'start')+R(20,128,560,40,'#fff',s.moved?C.coral:C.grid,8)+TMF(32,153,'https://server-a.example/notes/links.html',13,C.ink,'start')+TBF(568,153,s.moved?'✗ 404 Not Found':'✓ found',13,s.moved?C.coral:C.green,'end');
  out+=TBF(20,196,'Content address (hash of the text)',13,C.ink,'start')+R(20,204,560,40,'#fff',C.green,8)+TMF(32,229,'fnv1a:'+h,13,C.ink,'start')+TBF(568,229,s.moved?'✓ found on server B':'✓ found',13,C.green,'end');
  out+=TBF(20,276,'The three versions and their content addresses',13,C.ink,'start');
  T8_TEXTS.forEach((x,i)=>{const y=298+i*22;out+=TMF(32,y,T8_fnv(x),13,i===s.v?C.green:C.muted,'start')+TF(130,y,'“'+x+'”',13,i===s.v?C.ink:C.muted,'start')});
  return {svg:out,phase:`${s.moved?'The file moved: its web address now fails, but its content address still finds a copy.':'Both addresses work while the file stays put.'} One character’s change gives an unrelated hash, so, with a cryptographic hash, a content address in practice never points at the wrong text.`};
 }});

// A Merkle tree over four chunks: editing one chunk changes only the hashes on its path to the root.
const T8_CH=['Chapter 1','Chapter 2','Chapter 3','Chapter 4'];
function T8_tree(ed){const leaf=T8_CH.map((c,i)=>T8_fnv(c+(ed[i]?' (revised)':''))),mid=[T8_fnv(leaf[0]+leaf[1]),T8_fnv(leaf[2]+leaf[3])];return {leaf,mid,root:T8_fnv(mid[0]+mid[1])}}
SCENE({id:'content-addressing-merkle',name:'Versions that share their parts',tag:'Merkle trees',
 definition:'In a Merkle tree each piece of content is named by its hash, and each parent is named by the hash of its children’s names. Change one piece and only the names on its path to the root change; a new version reuses every unchanged part. Git stores versions this way.',
 example:'Revise Chapter 3 and three names change: Chapter 3, its pair and the root. The other four nodes are shared, unchanged, between the two versions.',
 desc:'A tree of seven named nodes above four chapters; nodes whose names changed since the first version are coral, shared ones blue, with a count of how many are reused.',
 research:['Merkle, R. C. (1987). A digital signature based on a conventional encryption function. CRYPTO ’87, LNCS 293, 369–378.','Chacon, S. & Straub, B. (2014). Pro Git, 2nd ed., chapter 10 (Git objects). Nelson’s versions were likewise to share unchanged content rather than copy it.'],
 dur:10,hint:'Press a chapter to revise it, and press it again to undo. See which names change.',
 init:()=>({ed:[false,false,true,false]}),
 watch(p){return {ed:[false,p>.75,p>.25,false]}},
 ui:[{b:'Undo all revisions',act:'reset'}],
 on:{ed(s,i){i=Number(i);s.ed[i]=!s.ed[i];return 'keep'},reset(s){s.ed=[false,false,false,false];return 'keep'}},
 draw(s,f,X){
  const a=T8_tree([false,false,false,false]),b=T8_tree(s.ed);let out=heading('Change one part; only its path to the root changes',26);
  const node=(x,y,hh,old,label)=>{const ch=hh!==old;return R(x-55,y-20,110,40,ch?C.coralp:tint(C.blue,.86),ch?C.coral:C.blue,8)+TF(x,y-3,label,13,C.muted)+TMF(x,y+13,hh,13,C.ink)};
  const lx=[90,230,370,510],mx=[160,440];
  out+=L(300,86,mx[0],146,C.line,2)+L(300,86,mx[1],146,C.line,2);mx.forEach((x,i)=>{out+=L(x,166,lx[i*2],218,C.line,2)+L(x,166,lx[i*2+1],218,C.line,2)});
  out+=node(300,66,b.root,a.root,'version root');mx.forEach((x,i)=>out+=node(x,146,b.mid[i],a.mid[i],i?'chapters 3–4':'chapters 1–2'));lx.forEach((x,i)=>out+=node(x,238,b.leaf[i],a.leaf[i],'hash'));
  lx.forEach((x,i)=>{out+=hit(X,'ed',i,`${T8_CH[i]}${s.ed[i]?', revised':''}: press to ${s.ed[i]?'undo':'revise'}`,R(x-55,280,110,46,s.ed[i]?C.amberp:'#fff',s.ed[i]?C.amber:C.grid,8)+TBF(x,300,T8_CH[i],13,C.ink)+TF(x,318,s.ed[i]?'revised':'original',13,s.ed[i]?C.amber:C.muted))});
  const changed=[b.root!==a.root].concat(b.mid.map((h,i)=>h!==a.mid[i]),b.leaf.map((h,i)=>h!==a.leaf[i])).filter(Boolean).length;
  out+=TF(300,354,`${7-changed} of 7 nodes shared with the first version · ${changed} new`,13,C.muted);
  return {svg:out,phase:changed?`${changed} names changed and ${7-changed} are shared. The new version stores only the changed nodes and points at the rest; the old version is still complete.`:'No revisions: this is the first version. Press a chapter to revise it.'};
 }});

// Wiki templates: content included by reference into many pages, against a manual copy.
const T8_TPL={orig:'Term coined: 1965',fix:'Term coined: 1965, in an ACM conference paper',vand:'Term coined: (vandalised)'};
SCENE({id:'content-addressing-transclusion',name:'Transclusion in wikis',tag:'Templates included by reference',
 definition:'MediaWiki, the software behind Wikipedia, calls including one page inside another “transclusion”, borrowing Nelson’s word. A template is written once and shown on many pages, so a correction appears everywhere at once; so would vandalism, which is why heavily used templates are protected.',
 example:'Correct the hypertext fact box once and three articles update; an article that pasted a copy of the box stays out of date.',
 desc:'A template box at the top, three articles that include it by reference and one that copied it, with the template’s current text shown in each.',
 research:['MediaWiki documentation, Help:Transclusion and Help:Templates (mediawiki.org).','Nelson, T. H. (1981). Literary Machines. Wiki transclusion shows the latest version of the included page, whereas Xanadu’s design quotes fixed content and flags newer versions.'],
 dur:10,hint:'Correct the template or vandalise it, and switch protection on or off.',
 init:()=>({v:'orig',prot:false}),
 watch(p){return {v:p<.33?'orig':p<.66?'fix':'vand',prot:p>.83}},
 ui:[{choose:[['orig','Original'],['fix','Correct it'],['vand','Vandalise it']],label:'Template edit',get:s=>s.v,act:'v'},{choose:[[false,'Unprotected'],[true,'Protected']],label:'Template',get:s=>s.prot,act:'prot'}],
 on:{v(s,v){s.v=v;return 'keep'},prot(s,v){s.prot=v===true||v==='true';return 'keep'}},
 draw(s){
  const refused=s.prot&&s.v==='vand',cur=refused?T8_TPL.orig:T8_TPL[s.v],bad=cur===T8_TPL.vand;let out=heading('Written once, shown in every page that includes it',26);
  out+=R(130,44,340,58,bad?C.coralp:C.pale,bad?C.coral:C.blue,8)+TBF(300,64,'Template: Hypertext facts'+(s.prot?' (protected)':''),13,C.ink)+TF(300,86,cur,13,bad?C.coral:C.ink);
  if(refused)out+=TF(300,118,'Edit refused: only trusted editors may change a protected template',13,C.coral);
  const arts=['Ted Nelson','Hypertext','Project Xanadu'];
  arts.forEach((a,i)=>{const x=20+i*146;out+=L(300,102,x+65,146,C.blue,2,'stroke-dasharray="4 3"')+R(x,146,130,150,'#fff',C.grid,8)+TBF(x+65,168,a,13,C.ink);
   for(let k=0;k<3;k++)out+=R(x+12,180+k*14,106,7,'#d5e0e7','none',3);
   out+=R(x+8,226,114,60,bad?C.coralp:C.pale,bad?C.coral:C.blue,6)+T8_lines(x+14,246,T8_wrap(cur,15).slice(0,2),13,C.ink)});
  out+=R(460,146,120,150,'#fff',C.amber,8,'stroke-dasharray="5 4"')+TBF(520,168,'Memex',13,C.ink)+TF(520,186,'(pasted a copy)',13,C.amber);
  out+=R(466,226,108,60,'#fff8e8',C.amber,6)+T8_lines(472,246,T8_wrap(T8_TPL.orig,14),13,C.ink);
  out+=TF(300,328,'dashed blue: included by reference · amber: copied by hand',13,C.muted);
  const msg=refused?'Protection blocked the vandalism, so all three including pages are safe.':s.v==='orig'?'All four pages show the same text. Three include it; one copied it.':s.v==='fix'?'One correction to the template fixed all three including pages at once. The pasted copy is now out of date.':'The vandalism appeared in all three including pages at once. This is why heavily used templates are protected.';
  return {svg:out,phase:msg};
 }});

/* =========================== deep-interconnection =========================== */
const T8_ALL=[['memex','Memex',1],['associative-trails','Trails',1],['non-sequential-writing','Non-sequential',1],['index-cards','Index cards',1],
 ['coining-hypertext','Coining hypertext',2],['zippered-lists','Zippered lists',2],['hypermedia','Hypermedia',2],['version-history','Version history',2],
 ['hes-brown','HES at Brown',3],['nls-demo','NLS demo',3],['fress','FRESS',3],['stretchtext','Stretchtext',3],
 ['computer-lib','Computer Lib',4],['dream-machines','Dream Machines',4],['fantics','Fantics',4],['thinkertoys','Thinkertoys',4],
 ['transclusion','Transclusion',5],['two-way-links','Two-way links',5],['transcopyright','Transcopyright',5],['tumblers','Tumblers',5],
 ['web-vs-xanadu','Web vs Xanadu',6],['link-rot','Link rot',6],['embedded-markup','Embedded markup',6],['curse-of-xanadu','Curse of Xanadu',6],
 ['zigzag','ZigZag',7],['xanadu-space','Xanadu Space',7],['open-xanadu','OpenXanadu',7],['parallel-documents','Parallel docs',7],
 ['reading-hypertext','Reading hypertext',8],['backlinks','Backlinks',8],['content-addressing','Content addresses',8],['deep-interconnection','Intertwingled',8]];
const T8_IDX=Object.fromEntries(T8_ALL.map((a,i)=>[a[0],i]));
const T8_E=[['memex','associative-trails'],['memex','coining-hypertext'],['memex','nls-demo'],['associative-trails','backlinks'],['associative-trails','reading-hypertext'],['non-sequential-writing','coining-hypertext'],['non-sequential-writing','index-cards'],
 ['index-cards','zippered-lists'],['index-cards','zigzag'],['coining-hypertext','hes-brown'],['coining-hypertext','hypermedia'],['coining-hypertext','web-vs-xanadu'],['zippered-lists','zigzag'],['zippered-lists','version-history'],
 ['version-history','parallel-documents'],['version-history','content-addressing'],['version-history','fress'],['hypermedia','dream-machines'],['hes-brown','fress'],['hes-brown','nls-demo'],['nls-demo','thinkertoys'],
 ['fress','two-way-links'],['stretchtext','reading-hypertext'],['stretchtext','fantics'],['computer-lib','dream-machines'],['computer-lib','deep-interconnection'],['fantics','thinkertoys'],['thinkertoys','parallel-documents'],
 ['transclusion','xanadu-space'],['transclusion','open-xanadu'],['transclusion','transcopyright'],['transclusion','content-addressing'],['two-way-links','backlinks'],['two-way-links','link-rot'],['transcopyright','tumblers'],
 ['tumblers','content-addressing'],['tumblers','open-xanadu'],['web-vs-xanadu','embedded-markup'],['web-vs-xanadu','link-rot'],['link-rot','content-addressing'],['embedded-markup','open-xanadu'],['curse-of-xanadu','transcopyright'],
 ['curse-of-xanadu','web-vs-xanadu'],['zigzag','deep-interconnection'],['xanadu-space','parallel-documents'],['reading-hypertext','deep-interconnection'],['backlinks','deep-interconnection'],['dream-machines','xanadu-space']].map(([a,b])=>[T8_IDX[a],T8_IDX[b]]);
const T8_ERA=['#1772b7','#2c776c','#7156a6','#9a6200','#b0337a','#2f6e8e','#5a5f9e','#1f6f5c'];
const T8_ang=i=>-Math.PI/2+(i+.5)*2*Math.PI/32;
const T8_nb=i=>T8_E.filter(e=>e[0]===i||e[1]===i).map(e=>e[0]===i?e[1]:e[0]);
SCENE({id:'deep-interconnection',name:'Everything is deeply intertwingled',tag:'This course as a network',
 definition:'Nelson’s word “intertwingled” (Computer Lib, 1974) says that ideas cannot be cleanly divided into separate subjects; they cross and depend on each other everywhere. This course’s own lessons show it: most connections run between eras, not within them.',
 example:'Version history (1965) connects forward to parallel documents and content addressing, and back to the zippered lists it grew from.',
 desc:'The 32 lessons of this course as dots on a ring, coloured by era, with curves for the connections chosen for this course; pressing a dot highlights its connections and lists them.',
 research:['Nelson, T. H. (1974). Computer Lib/Dream Machines: “everything is deeply intertwingled”.','The connections drawn here were chosen by the authors of this course as a map of its ideas; they are an interpretation, not data.'],
 dur:12,hint:'Press any dot to see that lesson’s connections. Turn on 3D to see the eras rise as a helix.',
 init:()=>({sel:T8_IDX['version-history']}),
 watch(p){const seq=['memex','coining-hypertext','version-history','transclusion','link-rot','deep-interconnection'].map(k=>T8_IDX[k]);return {sel:seq[Math.min(seq.length-1,Math.floor(p*seq.length))]}},
 ui:[{b:'Most connected lesson',act:'most'},{b:'Clear selection',act:'clear'}],
 on:{pick(s,i){s.sel=Number(i);return 'keep'},most(s){let best=0;for(let i=0;i<32;i++)if(T8_nb(i).length>T8_nb(best).length)best=i;s.sel=best;return 'keep'},clear(s){s.sel=-1;return 'keep'}},
 draw(s,f,X){
  const cx=190,cy=206,r=140,pos=i=>[cx+r*Math.cos(T8_ang(i)),cy+r*Math.sin(T8_ang(i))];let out=heading('Thirty-two lessons, one tangle',26);
  T8_E.forEach(([a,b])=>{const on=a===s.sel||b===s.sel,pa=pos(a),pb=pos(b);out+=P(`M ${fmt(pa[0])} ${fmt(pa[1])} Q ${cx} ${cy} ${fmt(pb[0])} ${fmt(pb[1])}`,on?C.coral:'#cfdbe3',on?2.6:1.1)});
  for(let e=0;e<8;e++){const a=T8_ang(e*4+1.5);out+=TBF(cx+(r+22)*Math.cos(a),cy+(r+22)*Math.sin(a)+5,String(e+1),13,T8_ERA[e])}
  const nb=s.sel>=0?T8_nb(s.sel):[];
  T8_ALL.forEach((a,i)=>{const [x,y]=pos(i),on=i===s.sel||nb.includes(i);out+=hit(X,'pick',i,`Lesson ${a[1]}, era ${a[2]}`,Ci(x,y,on?8:6,i===s.sel?C.coral:T8_ERA[a[2]-1],on?C.ink:'#fff'))});
  const cross=T8_E.filter(([a,b])=>T8_ALL[a][2]!==T8_ALL[b][2]).length;
  out+=R(372,48,208,304,C.pale,'none',10);
  if(s.sel>=0){const a=T8_ALL[s.sel];out+=T8_lines(386,74,T8_wrap(a[1],22),15,C.ink,'start',19).replace(/<text /g,'<text font-weight="700" ')+TF(386,74+19*T8_wrap(a[1],22).length,`era ${a[2]} · ${nb.length} connections`,13,C.muted,'start');
   nb.slice(0,8).forEach((j,k)=>{const y=128+k*26;out+=Ci(392,y-4,5,T8_ERA[T8_ALL[j][2]-1])+TF(404,y,`${T8_ALL[j][2]} · ${T8_ALL[j][1]}`,13,C.ink,'start')})}
  else out+=T8_lines(386,78,['Press a dot to see','a lesson’s connections.'],13,C.ink);
  out+=TF(386,338,`${cross} of ${T8_E.length} links cross eras`,13,C.muted,'start');
  const a=s.sel>=0?T8_ALL[s.sel]:null,nbe=nb.filter(j=>T8_ALL[j][2]!==a?.[2]).length;
  return {svg:out,phase:a?`${a[1]} (era ${a[2]}) connects to ${nb.length} lessons, ${nbe} of them in other eras. Across the course, ${cross} of ${T8_E.length} connections cross from one era to another.`:`Across the course, ${cross} of ${T8_E.length} connections cross from one era to another.`};
 },
 three(s,f,X,project){
  const pt=i=>[3*Math.cos(T8_ang(i)),3*Math.sin(T8_ang(i)),(T8_ALL[i][2]-1)*.5+(i%4)*.12];const P=project([-4.4,4.4,-4.4,4.4,0,4]);let out='';
  T8_E.forEach(([a,b])=>{const on=a===s.sel||b===s.sel;out+=line3(pt(a),pt(b),P,on?C.coral:'#cfdbe3',on?2.6:1)});
  out+=sortedItems(T8_ALL.map((a,i)=>({at:pt(i),svg:Q=>point3(pt(i),Q,i===s.sel?C.coral:T8_ERA[a[2]-1],i===s.sel?8:5.5,'#fff')})),P);
  for(let e=0;e<8;e++){const q=P([4.3*Math.cos(T8_ang(e*4+1.5)),4.3*Math.sin(T8_ang(e*4+1.5)),e*.5+.2]);out+=label3(q[0],q[1],'era '+(e+1),13,T8_ERA[e])}
  return {svg:out,title:'Eras as a rising helix',caption:'Each era sits one step higher. Straight lines that climb or fall many steps join ideas decades apart, which is most of them.'};
 }});

// Hierarchy against network: a tree keeps some links inside folders and cuts the rest.
const T8_ITEMS=['memex','coining-hypertext','transclusion','two-way-links','link-rot','backlinks','zigzag','content-addressing'];
const T8_TL=[['memex','coining-hypertext'],['memex','backlinks'],['coining-hypertext','transclusion'],['coining-hypertext','zigzag'],['transclusion','content-addressing'],['two-way-links','backlinks'],['two-way-links','link-rot'],['link-rot','content-addressing']];
const T8_GROUPS={era:[['Before 1970',['memex','coining-hypertext']],['1970–1995',['transclusion','two-way-links']],['After 1995',['link-rot','zigzag','backlinks','content-addressing']]],
 theme:[['Links',['memex','two-way-links','link-rot','backlinks']],['Content',['transclusion','content-addressing']],['Structure',['coining-hypertext','zigzag']]],
 person:[['Bush',['memex']],['Nelson',['coining-hypertext','transclusion','two-way-links','zigzag']],['Others',['link-rot','backlinks','content-addressing']]]};
SCENE({id:'deep-interconnection-tree',name:'A tree cuts connections',tag:'Hierarchy against network',
 definition:'Sorting ideas into folders keeps the links inside each folder and hides every link between folders, unless extra shortcuts are added. Whatever classification you choose, some connections are lost; Nelson argued that hierarchies are imposed on material that is really a network.',
 example:'Filed by date, transclusion and content addressing land in different folders, so the link between them disappears; filed by theme they stay together, but others are cut instead.',
 desc:'Eight lessons sorted into three folders by the chosen classification, with links inside a folder drawn solid and links cut by the hierarchy drawn dashed in coral, and a count of each.',
 research:['Nelson, T. H. (1974). Computer Lib/Dream Machines, on hierarchy as an imposed structure.','Alexander, C. (1965). A city is not a tree. Architectural Forum 122(1–2): real structures overlap and cannot be captured by a tree.'],
 dur:10,hint:'Choose a way to file the eight lessons and count the links that survive.',
 init:()=>({by:'theme'}),
 watch(p){return {by:['era','theme','person'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['era','By date'],['theme','By theme'],['person','By person']],label:'File by',get:s=>s.by,act:'by'}],
 on:{by(s,v){s.by=v;return 'keep'}},
 draw(s){
  const groups=T8_GROUPS[s.by],where={},pos={};let out=heading('Whatever folders you choose, some links are cut',26);
  groups.forEach(([g,items],gi)=>{const x=20+gi*194;out+=R(x,48,176,176,'#f6f9fb',C.grid,10)+TBF(x+88,70,g,13,C.ink);
   items.forEach((it,k)=>{where[it]=gi;const y=84+k*34;pos[it]=[x+88,y+13];out+=R(x+18,y,146,26,'#fff',C.blue,6)+TF(x+91,y+18,T8_ALL[T8_IDX[it]][1],13,C.ink)})});
  let kept=0,cut=0;const cuts=[];
  T8_TL.forEach(([a,b])=>{const pa=pos[a],pb=pos[b];if(where[a]===where[b]){kept++;out+=P(`M ${pa[0]-73} ${pa[1]} C ${pa[0]-86} ${pa[1]}, ${pb[0]-86} ${pb[1]}, ${pb[0]-73} ${pb[1]}`,C.blue,2.4)}
   else{cut++;cuts.push(T8_ALL[T8_IDX[a]][1]+' — '+T8_ALL[T8_IDX[b]][1])}});
  out+=TBF(20,248,'Links cut by the folders',13,C.coral,'start');
  cuts.forEach((c,i)=>{out+=TF(20+(i%2)*290,270+Math.floor(i/2)*20,'✂ '+c,13,C.ink,'start')});
  out+=counter(150,330,'kept in a folder',String(kept),C.blue,140)+counter(310,330,'cut by the tree',String(cut),C.coral,140);
  return {svg:out,phase:`Filed ${s.by==='era'?'by date':'by '+s.by}, ${kept} of ${T8_TL.length} links stay inside a folder and ${cut} are cut. No choice of folders keeps them all.`};
 }});

// What became of Nelson's ideas: a scorecard with brief evidence for each status.
const T8_SCORE=[['Every version kept','Widely adopted',C.green,'Git (2005) and wiki page histories keep every version; Nelson asked for this in his 1965 paper.'],
 ['Two-way links','Partly',C.amber,'Wikis, note tools and Wikipedia’s “What links here” show both ends; links on the open web still go one way.'],
 ['Transclusion','Partly',C.amber,'Wiki templates and embedded posts include content by reference, but usually show the latest version, not fixed content.'],
 ['Permanent addresses','Partly',C.amber,'DOIs, the Internet Archive and content addresses (Git, IPFS) help; ordinary web addresses still break.'],
 ['Visible side-by-side connections','Partly',C.amber,'Diff and review tools show versions side by side; everyday reading tools rarely draw connections.'],
 ['A small royalty for every quotation','Not adopted',C.coral,'No system pays a micro-royalty for each quoted span at web scale.']];
SCENE({id:'deep-interconnection-scorecard',name:'What came true',tag:'A scorecard of Nelson’s ideas',
 definition:'Some of Nelson’s ideas became everyday tools, some arrived in partial forms under other names, and some have not been adopted. Judging them fairly means separating the idea from the Xanadu software, which was never finished as designed.',
 example:'Keeping every version is now normal for programmers; two-way links exist inside wikis and note tools; paying a small royalty for each quotation has not happened.',
 desc:'Six ideas with a status for each; pressing a row shows the evidence behind its status.',
 research:['Nelson, T. H. (1981). Literary Machines; Nelson, T. H. (2010). Possiplex.','Zittrain, J., Albert, K. & Lessig, L. (2014). Perma: scoping and addressing the problem of link and reference rot in legal citations. Harvard Law Review Forum 127, 176–196. The statuses are this course’s judgement, with the reasons shown.'],
 dur:12,hint:'Press a row to see why it has that status.',
 init:()=>({sel:0}),
 watch(p){return {sel:Math.min(5,Math.floor(p*6))}},
 ui:[],
 on:{sel(s,i){s.sel=Number(i);return 'keep'}},
 draw(s,f,X){
  let out=heading('Nelson’s ideas today',26);
  T8_SCORE.forEach(([idea,st,col],i)=>{const y=46+i*38,on=i===s.sel;out+=hit(X,'sel',i,`${idea}: ${st}`,R(20,y,560,32,on?C.pale:'#fff',on?C.blue:C.grid,8)+TF(34,y+21,idea,13,C.ink,'start')+R(430,y+6,136,20,tint(col,.8),'none',10)+TBF(498,y+21,st,13,C.ink))});
  const d=T8_SCORE[s.sel];out+=R(20,282,560,76,tint(d[2],.88),'none',10)+TBF(34,302,d[0]+': '+d[1],13,C.ink,'start')+T8_lines(34,324,T8_wrap(d[3],80),13,C.ink);
  const n={w:T8_SCORE.filter(r=>r[1]==='Widely adopted').length,p:T8_SCORE.filter(r=>r[1]==='Partly').length,x:T8_SCORE.filter(r=>r[1]==='Not adopted').length};
  return {svg:out,phase:`${d[0]}: ${d[1].toLowerCase()}. ${d[3]} Overall: ${n.w} widely adopted, ${n.p} partly, ${n.x} not adopted.`};
 }});
