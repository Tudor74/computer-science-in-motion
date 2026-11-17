/* ===================== Era 6 · The networked page (1990s–2000s) ===================== */
// Helpers for this era are prefixed H6_ because every file shares one scope.
// A rounded browser window: toolbar with Back/Forward, an address field, then the page area (y+36…).
function H6_browser(X,x,y,w,h,url,opt={}){
 let out=R(x,y,w,h,'#fff',C.line,9)+R(x,y,w,32,'#e9eff3','none',9)+R(x,y+22,w,10,'#e9eff3','none',0);
 const nav=(cx,glyph,act,on)=>{const inner=Ci(cx,y+16,11,on?'#fff':'#f1f4f6',on?C.line:'#dde5ea')+T(cx,y+21,glyph,14,on?C.ink:'#b5c3cc','middle','font-weight="700"');return act&&on?hit(X,act,'',glyph==='←'?'Back':'Forward',inner):inner};
 out+=nav(x+18,'←',opt.back,opt.canBack!==false)+nav(x+44,'→',opt.fwd,!!opt.canFwd);
 out+=R(x+62,y+6,w-70,20,'#fff',C.grid,6)+TMF(x+70,y+21,url,13,C.muted,'start');
 return out;
}
// Arrow between two rectangles of size w×h centred on a and b; off shifts it sideways (for two-way pairs).
function H6_rectArrow(a,b,w,h,col=C.line,wd=2,off=0){
 const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d*off,ny=dx/d*off;
 const t=Math.min(Math.abs(dx)>.01?(w/2+4)/Math.abs(dx):9,Math.abs(dy)>.01?(h/2+4)/Math.abs(dy):9);
 return arrow(a[0]+dx*t+nx,a[1]+dy*t+ny,b[0]-dx*t+nx,b[1]-dy*t+ny,col,wd,8);
}
// A grid of found/not-found cells (rows = people, columns = problems) with seeded detection.
function H6_detect(rows,cols,probs,seed){const r=rng(seed);return range(rows).map(()=>range(cols).map(j=>r()<probs[j]))}

/* ---------- Lesson: The World Wide Web ---------- */
const H6_SITE={
 home:{t:'Home',title:'The World Wide Web',url:'/',text:['A web of documents joined','by hypertext links.'],links:['project','people','help']},
 project:{t:'Project',title:'About the project',url:'/project.html',text:['What the web is and how','to put a page on it.'],links:['proposal','servers','home']},
 people:{t:'People',title:'People',url:'/people.html',text:['Who is building it.'],links:['home','project']},
 help:{t:'Help',title:'Help',url:'/help.html',text:['Follow a link to read on;','press Back to return.'],links:['home']},
 proposal:{t:'Proposal',title:'The 1989 proposal',url:'/proposal.html',text:['“Information Management:','A Proposal”'],links:['project','people']},
 servers:{t:'Servers',title:'Known servers',url:'/servers.html',text:['A list of other sites','you can link to.'],links:['home','proposal']}
};
const H6_POS={home:[452,82],project:[372,152],people:[532,152],help:[532,232],proposal:[372,232],servers:[452,300]};
const H6_TOUR=[['go','project'],['go','proposal'],['back'],['go','servers'],['back'],['back'],['go','help'],['back']];
function H6_webApply(s,a){
 if(a[0]==='go'){s.back.push(s.page);s.fwd=[];s.page=a[1];s.visited[a[1]]=1;s.last='go'}
 else if(a[0]==='back'&&s.back.length){s.fwd.push(s.page);s.page=s.back.pop();s.last='back'}
 else if(a[0]==='fwd'&&s.fwd.length){s.back.push(s.page);s.page=s.fwd.pop();s.last='fwd'}
}
SCENE({id:'world-wide-web',name:'The World Wide Web',tag:'Pages, addresses and links',
 definition:'A system of documents (pages), each with its own address (URL), joined by hypertext links that anyone can add and any browser can follow.',
 example:'Tim Berners-Lee proposed it at CERN in 1989 and put the first site online in 1991. A link is one-way: the page you link to never needs to know.',
 research:'Berners-Lee (1989). Information Management: A Proposal, CERN. The web combined hypertext with the internet: a URL for every page and simple one-way links.',
 desc:'A browser window showing one page and its links beside a map of the whole small site, with the visited pages shaded and the Back history listed underneath.',
 dur:10,hint:'Press links in the page to follow them, and use ← and → in the toolbar. Watch the map and the Back history.',
 init:()=>({page:'home',back:[],fwd:[],visited:{home:1},last:''}),
 watch(p){const s={page:'home',back:[],fwd:[],visited:{home:1},last:''},k=Math.min(H6_TOUR.length,Math.floor(p*(H6_TOUR.length+1)));for(let i=0;i<k;i++)H6_webApply(s,H6_TOUR[i]);return s},
 on:{go(s,id){H6_webApply(s,['go',id])},back(s){H6_webApply(s,['back'])},fwd(s){H6_webApply(s,['fwd'])}},
 draw(s,f,X){
  const pg=H6_SITE[s.page];let out=heading('Pages joined by one-way links');
  out+=H6_browser(X,14,46,292,250,'w3.example'+pg.url,{back:'back',fwd:'fwd',canBack:s.back.length>0,canFwd:s.fwd.length>0});
  out+=TB(30,108,pg.title,17,C.ink,'start');pg.text.forEach((l,i)=>out+=T(30,134+i*21,l,15,C.muted,'start'));
  pg.links.forEach((id,i)=>{const y=196+i*30;out+=hit(X,'go',id,'Follow the link to '+H6_SITE[id].title,R(26,y-18,180,26,X.try?'#f4f8fb':'#fff','none',5)+T(32,y,'→ '+H6_SITE[id].title,15,C.blue,'start','text-decoration="underline"'))});
  for(const a in H6_SITE)for(const b of H6_SITE[a].links){const two=H6_SITE[b].links.includes(a);out+=H6_rectArrow(H6_POS[a],H6_POS[b],74,28,C.line,1.6,two?(a<b?4:-4):0)}
  for(const id in H6_POS){const [x,y]=H6_POS[id],cur=id===s.page,vis=s.visited[id];out+=R(x-37,y-14,74,28,cur?C.blue:vis?C.pale:'#fff',cur?C.blue:C.line,7)+TF(x,y+5,H6_SITE[id].t,13,cur?'#fff':C.ink,'middle','font-weight="650"')}
  out+=TF(452,46+12,'site map',13,C.muted);
  out+=TF(14,322,'Back history',13,C.muted,'start');
  const hist=s.back.slice(-4);hist.forEach((id,i)=>{const x=110+i*80;out+=R(x,307,72,24,i===hist.length-1?C.amberp:'#fff',i===hist.length-1?C.amber:C.grid,12)+TF(x+36,324,H6_SITE[id].t,13)});
  if(!hist.length)out+=TF(110,324,'empty: this is where you started',13,C.muted,'start');
  else out+=TF(110,350,'← Back returns to the highlighted page: the history is a stack.',13,C.muted,'start');
  const say=s.last==='back'?`Back took you to ${pg.title}: the browser popped the last page off its history.`:s.last==='fwd'?'Forward replays a page you backed out of.':s.last==='go'?`You followed a link to ${pg.title}. The page you came from is pushed onto the Back history.`:'Every page has an address. Links point from one page to another; the browser keeps a history so you can return.';
  return {svg:out,phase:say+' No page knows who links to it.'};
 }});

SCENE({id:'world-wide-web-one-way',name:'One-way and two-way links',tag:'Why the web scaled, and why links break',
 definition:'A web link is stored only in the page that makes it. Ted Nelson’s Xanadu design wanted links known at both ends, so moving or quoting a page could never break them.',
 example:'If a report moves to a new address, every essay that linked to it now shows “404 Not Found”. Nobody had to ask permission to link, which is exactly why the web grew so fast.',
 research:'Berners-Lee (1989) chose one-way links with no central link register. Nelson (1981), Literary Machines, argued for two-way links and transclusion.',
 desc:'Two pages link to a report. In the one-way model, moving the report leaves both links pointing at a missing page; in the two-way model the report lists its backlinks and the links follow it.',
 dur:10,hint:'Choose the web’s one-way links or two-way links, then move or delete the report.',
 init:()=>({model:'web',status:'ok'}),
 watch(p){const q=p%.5;return {model:p<.5?'web':'xanadu',status:q<.2?'ok':'moved'}},
 ui:[{choose:[['web','One-way (web)'],['xanadu','Two-way (Xanadu)']],label:'Link model',get:s=>s.model,act:'model'},{b:'Move the report',act:'move'},{b:'Delete it',act:'del'},{b:'Restore',act:'ok'}],
 on:{model(s,v){s.model=v},move(s){s.status='moved'},del(s){s.status='deleted'},ok(s){s.status='ok'}},
 draw(s){
  const two=s.model==='xanadu',st=s.status;let out=heading(two?'Two-way links: both ends know':'One-way links: only the source knows');
  const card=(x,y,w,h,title,lines,fill='#fff',stroke=C.line)=>R(x,y,w,h,fill,stroke,9)+TB(x+12,y+24,title,15,C.ink,'start')+lines.map((l,i)=>TF(x+12,y+46+i*19,l,13,C.muted,'start')).join('');
  out+=card(20,64,190,96,'Essay A',['…as the report shows,','see link ↗']);
  out+=card(20,214,190,96,'Essay C',['Background reading:','see link ↗']);
  const bx=st==='moved'&&two?390:390,by=st==='moved'?214:64;
  const gone=st!=='ok',broken=!two&&gone;
  if(broken){out+=R(390,64,190,96,C.coralp,C.coral,9,'stroke-dasharray="6 4"')+TB(485,104,'404 Not Found',17,C.coral)+TF(485,128,'the old address is empty',13,C.coral)}
  if(st!=='deleted'||two){
   const del=st==='deleted';
   out+=card(390,by,190,96,del?'Report (deleted)':'Report',del?['the system warns A and C','before anything breaks']:two?['Linked from: A, C',st==='moved'?'new address; links followed':'(backlinks are stored)']:[st==='moved'?'new address: nobody told':'reports/2024.html',st==='moved'?'the essays still point at':'the old location'],del?C.amberp:'#fff',two?C.purple:C.line);
  }
  const target=[390,broken?112:by+48],tcol=broken?C.coral:two?C.purple:C.blue;
  for(const [y] of [[112],[262]]){const dash=broken?'stroke-dasharray="6 4"':'';
   if(two&&st!=='deleted')out+=L(210,y,target[0]-10,target[1]+(y-112)*.08,C.purple,2.5)+`<polygon points="${target[0]},${fmt(target[1]+(y-112)*.08)} ${target[0]-11},${fmt(target[1]+(y-112)*.08-6)} ${target[0]-11},${fmt(target[1]+(y-112)*.08+6)}" fill="${C.purple}"/>`+`<polygon points="210,${y} 221,${y-6} 221,${y+6}" fill="${C.purple}"/>`;
   else if(st!=='deleted'||!two)out+=arrow(210,y,target[0]-2,target[1]+(y-112)*.08,tcol,2.5,9,dash);
  }
  out+=T(300,346,two?'Each link is stored once and known at both ends, so it can be updated or the author warned.':broken?'The links still point at the old address: link rot.':'The link lives only in the essays; the report has no idea who points at it.',14,two?C.purple:broken?C.coral:C.ink);
  return {svg:out,phase:two?'Two-way links need a shared record of every link, which is hard to keep across millions of independent servers. Xanadu was never widely deployed.':'One-way links let anyone link to anything without asking or registering: the web could grow without a central authority. The price is broken links when pages move.'};
 }});

const H6_ROT_ORDER=shuffled(range(40),61);
SCENE({id:'world-wide-web-link-rot',name:'Link rot',tag:'Links decay over time',
 definition:'Link rot is the steady loss of linked pages as sites move, close or change. A link that worked when written later leads nowhere, or to something else.',
 example:'Zittrain, Albert and Lessig found in 2014 that about half of the web addresses cited in US Supreme Court opinions no longer led to the material originally cited. Archives keep copies to rescue them.',
 research:'Zittrain, Albert & Lessig (2014). Perma: Scoping and addressing the problem of link and reference rot in legal citations. Harvard Law Review Forum 127.',
 desc:'A curve of the share of links still working as years pass, beside forty link dots that turn into broken crosses as time runs; archived links stay readable.',
 dur:9,hint:'Slide the years and the half-life of this illustrative model. Turn archiving on to rescue some links.',
 init:()=>({years:10,half:9,archive:false}),
 watch(p){return {years:Math.round(p*20*10)/10,half:9,archive:p>.7}},
 ui:[{range:'years',label:'Years',min:0,max:20,get:s=>s.years,act:'years'},{range:'half',label:'Half-life',min:2,max:15,get:s=>s.half,act:'half',show:v=>v+' y'},{b:'Toggle archiving',act:'arch'}],
 on:{years(s,v){s.years=v},half(s,v){s.half=v},arch(s){s.archive=!s.archive}},
 draw(s){
  const alive=Math.pow(.5,s.years/s.half);let out=heading('How many links still work?');
  const x0=50,y0=300,w=240,h=220;out+=L(x0,y0,x0+w,y0,C.muted,1.5)+L(x0,y0,x0,y0-h,C.muted,1.5);
  for(const v of [0,5,10,15,20])out+=TF(x0+w*v/20,y0+18,v,13,C.muted);for(const v of [0,50,100])out+=TF(x0-8,y0-h*v/100+5,v+'%',13,C.muted,'end');
  out+=TF(x0+w/2,y0+38,'years since the links were written',13,C.muted);
  let d='';for(let i=0;i<=40;i++){const t=i/2,y=y0-h*Math.pow(.5,t/s.half);d+=(i?'L':'M')+fmt(x0+w*t/20)+' '+fmt(y)}out+=P(d,C.blue,2.5);
  const mx=x0+w*s.years/20,my=y0-h*alive;out+=L(mx,y0,mx,my,C.amber,1.5,'stroke-dasharray="4 3"')+Ci(mx,my,6,C.amber)+TB(mx+8,my-8,Math.round(alive*100)+'% work',14,C.amber,'start');
  let broken=0,saved=0;
  H6_ROT_ORDER.forEach((rank,i)=>{const u=(rank+.5)/40,breakAt=-s.half*Math.log2(1-u),dead=s.years>=breakAt,arch=s.archive&&i%3===0,x=350+(i%8)*30,y=80+Math.floor(i/8)*42;
   if(dead){broken++;if(arch)saved++}
   out+=dead?(arch?Ci(x,y,11,C.purplep,C.purple)+TF(x,y+5,'A',13,C.purple,'middle','font-weight="700"'):L(x-8,y-8,x+8,y+8,C.coral,3)+L(x-8,y+8,x+8,y-8,C.coral,3)):Ci(x,y,10,C.greenp,C.green);
  });
  out+=TF(465,306,`${40-broken} working · ${broken-saved} broken${s.archive?` · ${saved} rescued from an archive`:''}`,13,C.ink);
  out+=TF(465,330,'Illustrative model: half of the',13,C.muted)+TF(465,348,'remaining links die each half-life.',13,C.muted);
  return {svg:out,phase:`After ${s.years} years about ${Math.round(alive*100)}% of links still work in this model. Real decay rates vary by site and field; studies of law, science and news all find steady losses. Services such as the Internet Archive’s Wayback Machine and Perma.cc keep copies so citations survive.`};
 }});

const H6_CLIENTS={line:'1991 line-mode browser',graphical:'1993 graphical browser',reader:'Screen reader'};
SCENE({id:'world-wide-web-clients',name:'One page, many browsers',tag:'Content separate from presentation',
 definition:'HTML marks up what each part of a page is (a heading, a link, an image) and leaves how it looks to the browser, so the same page works on a teletype-style terminal, a graphical screen or a screen reader.',
 example:'The 1991 line-mode browser numbered the links: type 2 to follow the second. Mosaic (1993) put pictures inline with the text, and the web took off. Screen readers speak the same markup aloud.',
 research:'Nicola Pellow’s line-mode browser (CERN, 1991); NCSA Mosaic by Andreessen and Bina (1993) showed images inline. W3C (1999), Web Content Accessibility Guidelines 1.0.',
 desc:'The same short HTML source on the left; on the right the page as a numbered text browser, a graphical browser or a screen reader’s spoken output.',
 dur:10,hint:'Choose a browser. Then remove the image’s alt text and listen to what the screen reader can say.',
 init:()=>({client:'graphical',alt:true}),
 watch(p){return {client:['line','graphical','reader'][Math.min(2,Math.floor(p*3))],alt:true}},
 ui:[{choose:[['line','Line mode 1991'],['graphical','Graphical 1993'],['reader','Screen reader']],label:'Browser',get:s=>s.client,act:'client'},{b:'Toggle alt text',act:'alt'}],
 on:{client(s,v){s.client=v},alt(s){s.alt=!s.alt}},
 draw(s){
  let out=heading('The same page in three browsers');
  const src=['<h1>Mountain huts</h1>','<p>Huts give shelter on','long walks.</p>',s.alt?'<img src="hut.png"':'<img src="hut.png">',s.alt?'  alt="Stone hut in snow">':'','<a href="map.html">Map</a>','<a href="book.html">','  Book a bed</a>'].filter(Boolean);
  out+=R(14,48,236,290,'#20303a','none',9)+TF(24,68,'page.html',13,'#9fb3bf','start');
  src.forEach((l,i)=>out+=TMF(24,96+i*26,l,13,l.includes('alt=')?'#ffd48a':'#e6eef2','start'));
  out+=arrow(256,190,282,190,C.muted,2,8);
  out+=R(288,48,298,290,'#fff',C.line,9)+TF(300,68,H6_CLIENTS[s.client],13,C.muted,'start');
  if(s.client==='line'){out+=R(290,78,294,258,'#111','none',0);
   ['MOUNTAIN HUTS','','Huts give shelter on long','walks.[1]','','[1] Map','[2] Book a bed','','1-2, Back, Quit, or Help:'].forEach((l,i)=>out+=TMF(300,102+i*24,l,13,'#9fe6a0','start'))}
  else if(s.client==='graphical'){out+=TB(304,104,'Mountain huts',20,C.ink,'start')+T(304,130,'Huts give shelter on long walks.',14,C.ink,'start');
   out+=R(304,146,150,104,'#dfe9ef','none',6)+P('M314 236 L354 186 L382 214 L404 196 L444 236 Z',C.muted,1.5,'#b9cbd6')+R(366,206,32,28,'#8a9aa5','none',2)+P('M360 208 L382 188 L404 208',C.ink,2);
   out+=T(304,280,'Map',15,C.blue,'start','text-decoration="underline"')+T(350,280,'Book a bed',15,C.blue,'start','text-decoration="underline"')+TF(304,318,'Images sit inline with the text.',13,C.muted,'start')}
  else{['“Heading level 1: Mountain huts.”','“Huts give shelter on long walks.”',s.alt?'“Image: Stone hut in snow.”':'“Image. hut dot png.”','“Link: Map.”','“Link: Book a bed.”'].forEach((l,i)=>out+=R(300,84+i*44,274,34,i===2&&!s.alt?C.coralp:C.purplep,'none',8)+TF(310,106+i*44,l,13,i===2&&!s.alt?C.coral:C.ink,'start'));
   out+=TF(304,318,'Spoken in order, as the markup says.',13,C.muted,'start')}
  const say=s.client==='line'?'With no screen graphics, links became numbers to type. The markup did not change.':s.client==='graphical'?'A graphical browser lays the same markup out with fonts, colour and an inline picture.':s.alt?'A screen reader announces what each element is. The alt text describes the picture.':'Without alt text the reader can only say the file name: the picture is lost to someone who cannot see it.';
  return {svg:out,phase:say+' Separating what content is from how it looks is why one page can serve every device.'};
 }});

/* ---------- Lesson: Information scent ---------- */
const H6_LINKS=['Products','Support','Specifications','Batteries & power','Downloads','About us'];
const H6_GOALS=[
 {q:'How long does the battery last?',scent:[.35,.3,.55,.85,.1,.05],answer:2,note:'“Batteries & power” smells strongest but sells spare batteries; the answer is under Specifications. Misleading scent costs a click.'},
 {q:'Get the latest firmware',scent:[.15,.55,.1,.05,.8,.05],answer:4,note:'“Downloads” carries strong, accurate scent: the forager goes straight there.'},
 {q:'Who founded the company?',scent:[.05,.1,.05,.02,.05,.85],answer:5,note:'“About us” is the conventional label, so its scent is strong for history questions.'}
];
SCENE({id:'information-scent',name:'Information scent',tag:'Foraging for information',
 definition:'People choose links the way animals forage for food: they follow the cues (“scent”) that a link’s words and context give about what lies behind it, and give up when the scent fades.',
 example:'Looking for battery life, most people click “Batteries & power” before “Specifications”. Clear labels that match the words in users’ heads keep the scent strong.',
 research:'Pirolli & Card (1999). Information foraging. Psychological Review 106(4). Chi, Pirolli, Chen & Pitkow (2001) modelled scent to predict where users click.',
 desc:'A goal, a home page of six links with scent bars showing how well each label matches the goal, the link the scent model predicts, and the learner’s own clicks.',
 dur:11,hint:'Pick a goal and press the link you would follow. Then turn on the scent bars to compare with the foraging model.',
 init:()=>({goal:0,clicks:[],show:false}),
 watch(p){const g=Math.min(2,Math.floor(p*3)),u=p*3-g;return {goal:g,clicks:u>.7?[H6_GOALS[g].scent.indexOf(Math.max(...H6_GOALS[g].scent))].concat(u>.85&&g===0?[2]:[]):[],show:u>.25,grow:clamp((u-.25)/.4,0,1)}},
 ui:[{choose:[[0,'Battery life'],[1,'Firmware'],[2,'Founder']],label:'Goal',get:s=>s.goal,act:'goal'},{b:'Show scent',act:'show'}],
 on:{goal(s,v){s.goal=Number(v);s.clicks=[]},link(s,i){i=Number(i);if(!s.clicks.includes(i))s.clicks.push(i)},show(s){s.show=!s.show}},
 draw(s,f,X){
  const g=H6_GOALS[s.goal],best=g.scent.indexOf(Math.max(...g.scent)),grow=s.grow===undefined?1:s.grow;let out=heading('Goal: '+g.q);
  out+=H6_browser(X,14,48,300,288,'shop.example/',{canBack:false});
  out+=TB(30,108,'Camera shop',16,C.ink,'start');
  H6_LINKS.forEach((lab,i)=>{const y=134+i*32,c=s.clicks.includes(i),ok=i===g.answer;
   out+=hit(X,'link',i,`Follow ${lab}`,R(26,y-18,180,26,c?(ok?C.greenp:C.coralp):'#f6f9fb',c?(ok?C.green:C.coral):'none',5)+T(34,y,lab,15,C.blue,'start','text-decoration="underline"'));
   if(c)out+=TF(212,y,ok?'✓ found it':'✗ dead end',13,ok?C.green:C.coral,'start')});
  out+=TB(450,72,'Scent: how well each label',14,C.ink)+TB(450,90,'matches the goal',14,C.ink);
  H6_LINKS.forEach((lab,i)=>{const y=126+i*32,v=s.show?g.scent[i]*grow:0;out+=TF(346,y+5,lab,13,C.muted,'start');out+=R(346,y+10,200,8,'#eef3f6','none',4)+R(346,y+10,200*v,8,i===best?C.amber:C.blue,'none',4)});
  if(s.show)out+=TF(450,330,'Model’s pick: '+H6_LINKS[best],13,C.amber);
  const clicks=s.clicks.length,found=s.clicks.includes(g.answer);
  out+=TF(170,356,clicks?`${clicks} click${clicks>1?'s':''}${found?', found':''}`:'Which link would you follow?',13,found?C.green:C.muted);
  return {svg:out,phase:s.show?g.note:'Each label is a cue. Foragers weigh how strongly it promises the goal against the cost of the click.'};
 }});

function H6_gain(t){return 10*(1-Math.exp(-t/4))}
function H6_bestLeave(T){let bt=0,br=-1;for(let t=.1;t<=20;t+=.05){const r=H6_gain(t)/(t+T);if(r>br){br=r;bt=t}}return {t:bt,r:br}}
SCENE({id:'information-scent-patch',name:'When to leave a site',tag:'The marginal value theorem',
 definition:'Within a site (a “patch”) the useful finds come quickly at first and then dry up. Foraging theory predicts you should leave when the rate of gain here falls to the average rate you could get by moving on.',
 example:'When every new site is slow to reach, people stay longer and dig deeper in each one. When the next site is a click away, they skim and move on.',
 research:'Charnov (1976). Optimal foraging, the marginal value theorem. Theoretical Population Biology. Applied to web use by Pirolli & Card (1999).',
 desc:'A curve of information gained against time spent in a site, starting after a travel time; a tangent from the start of the journey touches the curve at the best moment to leave.',
 dur:10,hint:'Change how long it takes to reach a new site, then choose when you leave. Compare your rate with the best rate.',
 init:()=>({travel:4,leave:5}),
 watch(p){const T=lerp(1.5,9,smooth(p));return {travel:Math.round(T*10)/10,leave:Math.round(H6_bestLeave(T).t*10)/10,auto:true}},
 ui:[{range:'travel',label:'Travel time',min:1,max:10,step:.5,get:s=>s.travel,act:'travel',show:v=>v+' s'},{range:'leave',label:'Leave after',min:1,max:20,step:.5,get:s=>s.leave,act:'leave',show:v=>v+' s'}],
 on:{travel(s,v){s.travel=v},leave(s,v){s.leave=v}},
 draw(s){
  const T=s.travel,best=H6_bestLeave(T),you=H6_gain(s.leave)/(s.leave+T);let out=heading('Stay or move on?');
  const ox=60,oy=300,sx=24/1.2*.9,sy=20,x=t=>ox+(t+10)*12.5,y=g=>oy-g*sy;
  out+=L(x(-10),oy,x(20),oy,C.muted,1.5)+L(x(0),oy,x(0),y(10.5),C.muted,1.5);
  for(const t of [-10,-5,0,5,10,15,20])out+=TF(x(t),oy+18,t,13,C.muted);out+=TF(x(5),oy+40,'seconds (travel before 0, searching after)',13,C.muted);
  out+=TF(x(0)-6,y(10)+5,'gain',13,C.muted,'end');
  out+=R(x(-T),oy-6,x(0)-x(-T),12,C.amberp,'none',3)+TF((x(-T)+x(0))/2,oy-12,'travel',13,C.amber);
  let d='';for(let t=0;t<=20;t+=.25)d+=(t?'L':'M')+fmt(x(t))+' '+fmt(y(H6_gain(t)));out+=P(d,C.blue,2.5);
  const tx=x(best.t),ty=y(H6_gain(best.t));out+=L(x(-T),oy,x(-T)+(tx-x(-T))*1.25,oy+(ty-oy)*1.25,C.green,2,'stroke-dasharray="6 4"')+Ci(tx,ty,6,C.green);
  out+=TB(tx+8,ty+20,'best: leave at '+fmt(Math.round(best.t*10)/10)+' s',13,C.green,'start');
  if(!s.auto){const yx=x(s.leave),yy=y(H6_gain(s.leave));out+=L(x(-T),oy,yx,yy,C.coral,1.8)+Ci(yx,yy,6,C.coral)+TB(yx+8,yy-10,'you',13,C.coral,'start')}
  out+=counter(20,46,'best rate',(best.r*60).toFixed(1)+' /min',C.green,130)+(s.auto?'':counter(20,98,'your rate',(you*60).toFixed(1)+' /min',you>=best.r*.98?C.green:C.coral,130));
  return {svg:out,phase:`The steepest line from the start of the journey that still touches the curve marks the best time to leave: about ${fmt(Math.round(best.t*10)/10)} s with ${T} s of travel. Longer travel (slow pages, poor search) makes it worth staying longer.`};
 }});

const H6_TREE={home:{t:'Home',kids:['cameras','accessories'],p:null},cameras:{t:'Cameras',kids:['compact','pro'],p:'home'},accessories:{t:'Accessories',kids:['bags','lenses'],p:'home'},compact:{t:'Compact',kids:['x1'],p:'cameras'},pro:{t:'Pro',kids:[],p:'cameras'},x1:{t:'Model X1',kids:[],p:'compact'},bags:{t:'Bags',kids:[],p:'accessories'},lenses:{t:'Lenses',kids:[],p:'accessories'}};
const H6_TPOS={home:[460,72],cameras:[388,140],accessories:[530,140],compact:[354,208],pro:[422,208],x1:[354,276],bags:[494,208],lenses:[566,208]};
function H6_path(id){const p=[];for(let n=id;n;n=H6_TREE[n].p)p.unshift(n);return p}
SCENE({id:'information-scent-breadcrumbs',name:'Breadcrumbs and wayfinding',tag:'Where am I, and how do I get back?',
 definition:'Wayfinding is knowing where you are, where you can go and how to return. A breadcrumb trail shows the path from the home page to the current page, and each step is a link back up.',
 example:'Deep in a shop at Home › Cameras › Compact › Model X1, the trail lets you jump straight to Home and then to Accessories, instead of pressing Back again and again.',
 research:'Lynch (1960). The Image of the City: people find their way by paths, edges, districts, nodes and landmarks. Site designers borrowed these ideas for navigation.',
 desc:'A page deep in a site with or without a breadcrumb trail, beside the site tree with the current page and its path from the root highlighted, and a click counter for reaching Bags.',
 dur:10,hint:'You are on Model X1 and want Bags. Navigate with the trail, the page links or Back, then turn the trail off and try again.',
 init:()=>({at:'x1',crumbs:true,clicks:0,hist:['home','cameras','compact']}),
 watch(p){const crumbs=p<.5,u=(p%.5)*2;const seq=crumbs?['x1','home','accessories','bags']:['x1','compact','cameras','home','accessories','bags'];const k=Math.min(seq.length-1,Math.floor(u*seq.length));return {at:seq[k],crumbs,clicks:k,hist:[]}},
 ui:[{b:'Toggle breadcrumbs',act:'crumbs'}],
 on:{go(s,id){if(id!==s.at){s.hist.push(s.at);s.at=id;s.clicks++}},back(s){if(s.hist.length){s.at=s.hist.pop();s.clicks++}},crumbs(s){s.crumbs=!s.crumbs;s.at='x1';s.clicks=0;s.hist=['home','cameras','compact']}},
 draw(s,f,X){
  const node=H6_TREE[s.at],path=H6_path(s.at);let out=heading('Goal: reach Bags from Model X1');
  out+=H6_browser(X,14,48,300,252,'shop.example/'+path.slice(1).join('/'),{back:'back',canBack:(s.hist||[]).length>0});
  let y=104;
  if(s.crumbs){let x=28;path.forEach((id,i)=>{const lab=H6_TREE[id].t,w=lab.length*7.6+12,last=i===path.length-1;out+=last?TF(x,y,lab,13,C.ink,'start','font-weight="700"'):hit(X,'go',id,'Breadcrumb: '+lab,TF(x,y,lab,13,C.blue,'start','text-decoration="underline"'));x+=w;if(!last){out+=TF(x,y,'›',13,C.muted,'start');x+=14}});y+=30}
  out+=TB(28,y,node.t,18,C.ink,'start');
  const links=node.kids.length?node.kids:[];out+=TF(28,y+26,links.length?'In this section:':'No sub-pages here.',13,C.muted,'start');
  links.forEach((id,i)=>out+=hit(X,'go',id,'Open '+H6_TREE[id].t,T(28,y+52+i*26,'→ '+H6_TREE[id].t,15,C.blue,'start','text-decoration="underline"')));
  if(s.at==='home')out+=TF(28,y+110,'Main menu links shown above.',13,C.muted,'start');
  for(const id in H6_TREE){const p=H6_TREE[id].p;if(p)out+=L(H6_TPOS[p][0],H6_TPOS[p][1]+12,H6_TPOS[id][0],H6_TPOS[id][1]-12,path.includes(id)?C.amber:C.line,path.includes(id)?3:1.6)}
  for(const id in H6_TPOS){const [x,yy]=H6_TPOS[id],cur=id===s.at,on=path.includes(id),goal=id==='bags';out+=R(x-32,yy-12,64,24,cur?C.blue:goal?C.greenp:on?C.amberp:'#fff',cur?C.blue:goal?C.green:on?C.amber:C.line,6)+TF(x,yy+5,H6_TREE[id].t,13,cur?'#fff':C.ink)}
  out+=TF(456,316,'site structure',13,C.muted);
  out+=counter(14,312,'clicks',String(s.clicks),s.at==='bags'?C.green:C.blue,110);
  const say=s.at==='bags'?`Reached Bags in ${s.clicks} clicks${s.crumbs?' using the trail':' by retracing the path'}.`:s.crumbs?'The trail shows the path from Home and turns every level into a shortcut back up.':'Without a trail, the only way up is to retrace your steps with Back.';
  return {svg:out,phase:say+' The trail also answers “where am I?” for visitors who arrived from a search engine.'};
 }});

/* ---------- Lesson: Usability testing ---------- */
// Draw a people × problems detection grid plus the cumulative "found by anyone" row.
function H6_grid(mat,n,x0,y0,cw,rh,rowLabel){
 const cols=mat[0].length;let out='',any=range(cols).map(()=>false);
 out+=TF(x0+cols*cw/2,y0-8,'problems →',13,C.muted)+TF(x0-6,y0+rh*2,rowLabel,13,C.muted,'end');
 mat.forEach((row,i)=>{const on=i<n;row.forEach((f,j)=>{if(on&&f)any[j]=true;out+=R(x0+j*cw+1,y0+i*rh+1,cw-2,rh-2,!on?'#f5f7f8':f?C.blue:'#e9eff3','none',2)})});
 const yA=y0+mat.length*rh+8;any.forEach((f,j)=>out+=R(x0+j*cw+1,yA,cw-2,rh,f?C.green:'#fff',f?C.green:C.line,3));
 out+=TF(x0-6,yA+rh-3,'found',13,C.green,'end');
 return {svg:out,found:any.filter(Boolean).length};
}
// Curve of share found against people, with the model line and observed points.
function H6_curve(model,observed,n,max,x0,y0,w,h,xLabel){
 let out=L(x0,y0,x0+w,y0,C.muted,1.5)+L(x0,y0,x0,y0-h,C.muted,1.5);
 for(const v of [0,50,100])out+=TF(x0-6,y0-h*v/100+5,v+'%',13,C.muted,'end');
 for(let k=0;k<=max;k+=5)out+=TF(x0+w*k/max,y0+17,k,13,C.muted);out+=TF(x0+w/2,y0+36,xLabel,13,C.muted);
 let d='';for(let k=0;k<=max;k++)d+=(k?'L':'M')+fmt(x0+w*k/max)+' '+fmt(y0-h*model(k));out+=P(d,C.blue,2.2);
 observed.slice(0,n).forEach((v,k)=>out+=Ci(x0+w*(k+1)/max,y0-h*v,4,C.green));
 const mx=x0+w*n/max;out+=L(mx,y0,mx,y0-h,C.amber,1.5,'stroke-dasharray="4 3"');
 return out;
}
const H6_DIFF=[1.9,1.7,1.5,1.35,1.2,1.05,.95,.85,.7,.6,.45,.25];
const H6_U=(()=>{const r=rng(31);return range(15).map(()=>range(12).map(()=>r()))})();
SCENE({id:'usability-testing',name:'Usability testing',tag:'How many users do you need?',
 definition:'In a usability test, real people try real tasks while you watch where they struggle. Each extra participant finds fewer new problems, because the obvious ones keep turning up.',
 example:'Nielsen and Landauer modelled problems found as N(1 − (1 − L)ⁿ). With L = 0.31, five users find about 84%. L varies a lot between products and tasks, so five users can also miss a great deal.',
 research:'Nielsen & Landauer (1993). A mathematical model of the finding of usability problems. INTERCHI ’93. Faulkner (2003). Beyond the five-user assumption, Behavior Research Methods.',
 desc:'A grid of participants against twelve problems showing who found what, a bottom row of problems found by anyone, and the model curve of share found against number of users.',
 dur:10,hint:'Add users one at a time, or change L, the chance that one user meets a given problem. Compare the dots with the curve.',
 init:()=>({n:5,L:.31}),
 watch(p){return {n:1+Math.min(14,Math.floor(p*15)),L:.31}},
 ui:[{range:'n',label:'Users',min:1,max:15,get:s=>s.n,act:'n'},{range:'L',label:'L',min:.1,max:.6,step:.01,get:s=>s.L,act:'L'},{b:'Add a user',act:'add'}],
 on:{n(s,v){s.n=v},L(s,v){s.L=v},add(s){s.n=Math.min(15,s.n+1)}},
 draw(s){
  const probs=H6_DIFF.map(d=>clamp(s.L*d,.02,.98)),mat=H6_U.map(r=>r.map((u,j)=>u<probs[j]));let out=heading('Each new user finds fewer new problems');
  const g=H6_grid(mat,s.n,70,64,18,15,'users ↓');out+=g.svg;
  const obs=range(15).map(k=>{const any=range(12).map(j=>mat.slice(0,k+1).some(r=>r[j]));return any.filter(Boolean).length/12});
  out+=H6_curve(k=>1-Math.pow(1-s.L,k),obs,s.n,15,340,300,240,220,'number of users');
  const model=Math.round(100*(1-Math.pow(1-s.L,s.n)));
  out+=TB(460,50,`${s.n} user${s.n>1?'s':''}: model ${model}%`,14,C.blue)+TB(460,68,`this run found ${g.found} of 12`,14,C.green);
  return {svg:out,phase:`With L = ${s.L.toFixed(2)}, the model predicts ${model}% of problems after ${s.n} user${s.n>1?'s':''}. Hard-to-meet problems (right-hand columns) need many users. Nielsen’s advice was several small rounds of testing, fixing between them, rather than one large test.`};
 }});

const H6_SESSION=[
 {screen:'Product page',focus:'Add to basket',say:'Okay, I want the blue mug. Add to basket… done.',note:'Found the button quickly.',silent:'Clicked Add to basket (0:04).'},
 {screen:'Product page',focus:'Basket icon',say:'Where’s my basket? Is it… oh, that little bag at the top?',note:'Basket icon not recognised as the basket (8 s).',silent:'Paused 8 s, then clicked the bag icon.'},
 {screen:'Delivery',focus:'“Standard (2)”',say:'‘Standard (2)’ — two days? Two pounds? I can’t tell.',note:'Ambiguous delivery label.',silent:'Switched delivery option twice.'},
 {screen:'Address',focus:'Postcode',say:'It says invalid postcode, but I typed it right!',note:'Validation rejects the space in the postcode.',silent:'Postcode error shown twice.'},
 {screen:'Address',focus:'Error message',say:'Maybe without the space? …Yes, that worked. Annoying.',note:'Error message does not say what is wrong.',silent:'Removed a character; error cleared.'},
 {screen:'Confirmation',focus:'“Request processed”',say:'‘Request processed’… did I actually pay?',note:'Confirmation does not confirm the order.',silent:'Hovered over the page for 6 s, then left.'}
];
function H6_wrap(text,max){const words=String(text).split(' '),lines=[];let cur='';for(const w of words){if((cur+' '+w).trim().length>max&&cur){lines.push(cur);cur=w}else cur=(cur+' '+w).trim()}if(cur)lines.push(cur);return lines}
SCENE({id:'usability-testing-think-aloud',name:'Thinking aloud',tag:'Hearing why people struggle',
 definition:'In a think-aloud test the participant says what they are looking for, expecting and feeling as they work. Observers hear why something is hard, not just that it is.',
 example:'A silent recording shows an 8-second pause on a product page. Thinking aloud reveals the cause: “Is that little bag the basket?”',
 research:'Ericsson & Simon (1980). Verbal reports as data. Psychological Review. Lewis (1982) introduced thinking aloud to interface design at IBM.',
 desc:'A simple checkout screen with the element being used highlighted, the participant’s spoken thoughts in a speech bubble, and the observer’s notes building up beside it.',
 dur:12,hint:'Step through the session. Then switch to a silent session and compare what the observer can write down.',
 init:()=>({mode:'think'}),
 ui:[{choose:[['think','Thinking aloud'],['silent','Silent session']],label:'Session',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v}},
 trace(s){return H6_SESSION.map((st,i)=>({i,st}))},
 draw(s,f,X){
  const st=f.st,think=s.mode==='think';let out=heading(think?'The participant says what they think':'A silent session: actions only');
  out+=R(14,46,290,150,'#fff',C.line,9)+R(14,46,290,26,'#e9eff3','none',9)+TF(24,64,'Shop · '+st.screen,13,C.muted,'start');
  const rows=['Add to basket','Basket icon','“Standard (2)”','Postcode','Error message','“Request processed”'];
  rows.slice(0,4).concat(st.focus&&!rows.slice(0,4).includes(st.focus)?[st.focus]:[]).forEach((r,i)=>{const on=r===st.focus;out+=R(26,82+i*22,266,19,on?C.amberp:'#f4f7f9',on?C.amber:'none',4)+TF(34,96+i*22,r,13,on?C.ink:C.muted,'start',on?'font-weight="700"':'')});
  out+=R(14,212,290,110,think?C.purplep:'#f1f4f6',think?C.purple:C.grid,12)+P('M60 212 L72 198 L84 212',think?C.purple:C.grid,2,think?C.purplep:'#f1f4f6');
  const lines=think?H6_wrap('“'+st.say+'”',36):['(no speech recorded)','',...H6_wrap(st.silent,36)];
  lines.forEach((l,i)=>out+=TF(28,238+i*20,l,13,think?C.ink:C.muted,'start',think?'font-style="italic"':''));
  out+=TB(450,62,'Observer’s notes',15,C.ink);
  let y=86;for(let i=0;i<=f.i;i++){const t=think?H6_SESSION[i].note:H6_SESSION[i].silent;const ls=H6_wrap(t,30);out+=R(320,y-14,266,ls.length*18+10,i===f.i?C.amberp:'#fff',i===f.i?C.amber:C.grid,6);ls.forEach((l,j)=>out+=TF(330,y+2+j*18,l,13,C.ink,'start'));y+=ls.length*18+16}
  return {svg:out,phase:think?'Thinking aloud turns behaviour into reasons. The observer notes the problem and its cause, while keeping prompts neutral (“keep talking”) so as not to lead the participant.':'Silent sessions show what people did and how long it took, but leave the observer guessing why.'};
 }});

const H6_SUS=['Would use it frequently','Unnecessarily complex','Easy to use','Would need technical help','Functions well integrated','Too much inconsistency','Most people learn it quickly','Cumbersome to use','Felt confident using it','Had to learn a lot first'];
const H6_SUS0=[4,2,4,1,4,2,5,2,4,2];
const H6_susScore=r=>r.every(v=>v)?2.5*sum(r.map((v,i)=>i%2===0?v-1:5-v)):null;
SCENE({id:'usability-testing-sus',name:'The System Usability Scale',tag:'Ten questions, one score',
 definition:'The SUS asks ten statements, alternately positive and negative, each rated 1 (strongly disagree) to 5 (strongly agree). The answers convert to a single score from 0 to 100.',
 example:'For odd items subtract 1 from the rating; for even items subtract the rating from 5; add them up and multiply by 2.5. A score of 68 is roughly average across many studies. It is not a percentage.',
 research:'Brooke (1996). SUS: a “quick and dirty” usability scale. Bangor, Kortum & Miller (2008) and Sauro (2011) collected benchmarks putting the average near 68.',
 desc:'Ten abbreviated SUS statements with five rating circles each, each row’s contribution, the total score and a gauge with the average of 68 marked.',
 dur:10,hint:'Press a circle on each row to rate the statement. Notice how negative statements count in reverse.',
 init:()=>({r:H6_SUS0.slice()}),
 watch(p){const k=Math.min(10,Math.floor(p*11));return {r:H6_SUS0.map((v,i)=>i<k?v:0)}},
 on:{rate(s,a){const [i,v]=String(a).split(',').map(Number);s.r[i]=v}},
 draw(s,f,X){
  let out=heading('System Usability Scale',22);
  for(let v=1;v<=5;v++)out+=TF(250+v*34,58,v,13,C.muted);out+=TF(284,43,'disagree',13,C.muted,'middle')+TF(420,43,'agree',13,C.muted,'middle');
  H6_SUS.forEach((t,i)=>{const y=74+i*24,v=s.r[i];out+=R(10,y-15,456,22,i%2?'#f7f9fa':'#fff','none',4)+TF(18,y,(i+1)+'. '+t,13,i%2?C.purple:C.ink,'start');
   for(let k=1;k<=5;k++)out+=hit(X,'rate',i+','+k,`Statement ${i+1}: rate ${k}`,Ci(250+k*34,y-4,9,v===k?C.blue:'#fff',v===k?C.blue:C.line));
   if(v)out+=TF(452,y,(i%2===0?'+'+(v-1):'+'+(5-v)),13,C.green,'end')});
  const sc=H6_susScore(s.r);
  out+=TB(530,130,sc===null?'—':fmt(sc),34,C.blue)+TF(530,154,'SUS score',13,C.muted)+TF(530,178,'(sum × 2.5)',13,C.muted);
  out+=TF(530,214,'odd rows: rating − 1',13,C.ink)+TF(530,232,'even rows: 5 − rating',13,C.purple);
  const gx=v=>40+520*v/100;out+=R(40,330,520,10,'#e9eff3','none',5)+L(gx(68),322,gx(68),348,C.ink,2)+TF(gx(68),364,'average ≈ 68',13,C.ink);
  for(const v of [0,25,50,75,100])out+=TF(gx(v),322,v,13,C.muted);
  if(sc!==null)out+=Ci(gx(sc),335,9,C.blue,'#fff');
  return {svg:out,phase:sc===null?'Rate every statement to get a score. Statements alternate between positive (odd) and negative (even) wording, which discourages answering on autopilot.':`This respondent scores ${fmt(sc)}, ${sc>=68?'above':'below'} the rough average of 68. SUS is quick and reliable for comparing versions, but it says how usable something feels, not what to fix.`};
 }});

/* ---------- Lesson: Heuristic evaluation ---------- */
const H6_HEUR=['System status','Real-world match','Control and freedom','Consistency','Error prevention','Recognition not recall','Flexibility','Minimalist design','Error recovery','Help and docs'];
const H6_HEUR_FULL=['Visibility of system status','Match between the system and the real world','User control and freedom','Consistency and standards','Error prevention','Recognition rather than recall','Flexibility and efficiency of use','Aesthetic and minimalist design','Help users recognise, diagnose and recover from errors','Help and documentation'];
const H6_SPOTS=[
 {id:'jargon',h:2,box:[24,82,296,24],why:'“Submit credentials to the auth service” is system language; users say “sign up”.'},
 {id:'rules',h:5,box:[24,150,296,30],why:'Password rules are only revealed after you get them wrong.'},
 {id:'error',h:9,box:[24,182,296,20],why:'“Error 0x3F” does not say what went wrong or how to fix it.'},
 {id:'date',h:4,box:[24,206,296,44],why:'The label asks for MM/DD/YYYY but the box shows DD/MM/YYYY.'},
 {id:'recall',h:6,box:[24,254,296,34],why:'Asking for “the code shown on the previous page” makes people remember instead of recognise.'},
 {id:'cancel',h:3,box:[24,296,90,32],why:'There is no Cancel or Back: no emergency exit.'},
 {id:'spinner',h:1,box:[122,296,198,32],why:'After Submit a spinner turns forever with no progress or message.'}
];
function H6_form(X,found,act){
 let out=R(14,46,316,292,'#fff',C.line,9)+R(14,46,316,28,'#e9eff3','none',9)+TF(24,65,'Create account',13,C.muted,'start');
 out+=TBF(30,100,'Submit credentials to the auth service',13,C.ink,'start');
 out+=TF(30,124,'Email',13,C.muted,'start')+R(80,112,236,20,'#fff',C.grid,4);
 out+=TF(30,170,'Password',13,C.muted,'start')+R(96,158,220,20,'#fff',C.coral,4)+TF(102,173,'••••••',13,C.ink,'start');
 out+=TF(30,196,'Error 0x3F',13,C.coral,'start');
 out+=TF(30,224,'Date of birth (MM/DD/YYYY)',13,C.muted,'start')+R(30,230,150,20,'#fff',C.grid,4)+TF(36,245,'DD/MM/YYYY',13,'#a7b6bf','start');
 out+=TF(30,270,'Enter the code shown on the',13,C.muted,'start')+TF(30,285,'previous page:',13,C.muted,'start')+R(136,272,80,18,'#fff',C.grid,4);
 out+=R(30,300,80,26,C.blue,'none',6)+TF(70,318,'Submit',13,'#fff','middle','font-weight="700"');
 out+=Ci(140,313,8,'none','#9fb3bf')+P('M140 305 A8 8 0 0 1 148 313',C.blue,2.5);
 H6_SPOTS.forEach(sp=>{const [x,y,w,h]=sp.box,on=found.includes(sp.id);
  const inner=R(x,y,w,h,on?'rgba(196,82,56,0.10)':'rgba(0,0,0,0)',on?C.coral:'none',6)+(on?Ci(x+w-4,y+4,10,C.coral)+TF(x+w-4,y+9,sp.h,13,'#fff','middle','font-weight="700"'):'');
  out+=act?hit(X,act,sp.id,'Inspect this part of the form',inner):inner});
 return out;
}
SCENE({id:'heuristics',name:'Heuristic evaluation',tag:'Ten rules of thumb',
 definition:'In a heuristic evaluation, a few evaluators inspect an interface against a short list of usability principles and note every violation. It is fast and cheap because no users are needed.',
 example:'Nielsen’s ten heuristics include “visibility of system status”, “recognition rather than recall” and “help users recognise, diagnose and recover from errors”. This sign-up form breaks seven of them.',
 research:'Nielsen & Molich (1990). Heuristic evaluation of user interfaces. CHI ’90. Nielsen (1994) refined the list into the ten heuristics still used today.',
 desc:'A sign-up form with seven planted usability problems; finding one marks it with the number of the heuristic it breaks in the list of ten beside it.',
 dur:12,hint:'Inspect the form and press each part you think breaks a heuristic. Found problems are numbered.',
 init:()=>({found:[]}),
 watch(p){return {found:H6_SPOTS.slice(0,Math.min(7,Math.floor(p*8))).map(s=>s.id)}},
 ui:[{b:'Reveal all',act:'all'}],
 on:{spot(s,id){if(!s.found.includes(id))s.found.push(id)},all(s){s.found=H6_SPOTS.map(x=>x.id)}},
 draw(s,f,X){
  let out=heading('Find what breaks the rules');out+=H6_form(X,s.found,'spot');
  const hit6=new Set(s.found.map(id=>H6_SPOTS.find(x=>x.id===id).h));
  H6_HEUR.forEach((h,i)=>{const y=62+i*27,on=hit6.has(i+1);out+=R(342,y-16,246,23,on?C.coralp:'#f6f9fa',on?C.coral:'none',5)+TF(352,y,(i+1)+'  '+h,13,on?C.coral:C.ink,'start',on?'font-weight="700"':'')});
  out+=TF(465,350,`${s.found.length} of 7 problems found`,13,s.found.length===7?C.green:C.muted);
  const last=s.found.length?H6_SPOTS.find(x=>x.id===s.found[s.found.length-1]):null;
  return {svg:out,phase:last?`Heuristic ${last.h}, ${H6_HEUR_FULL[last.h-1]}: ${last.why}`:'Each heuristic is a broad principle, not a checklist item, so evaluators still need judgement.'};
 }});

const H6_SEVN=['0 not a problem','1 cosmetic','2 minor','3 major','4 catastrophe'];
const H6_SEV0={jargon:1,rules:3,error:3,date:3,recall:2,cancel:2,spinner:4};
SCENE({id:'heuristics-severity',name:'Severity ratings',tag:'Which problem do we fix first?',
 definition:'Each problem found gets a severity from 0 (not a problem) to 4 (usability catastrophe), judged from how often it occurs, how badly it hurts when it does, and whether people can learn to work around it.',
 example:'A spinner that never ends blocks everyone, every time, with no workaround: severity 4. Slightly odd wording on the heading is cosmetic: severity 1.',
 research:'Nielsen (1994). Severity ratings for usability problems, combining frequency, impact and persistence. Ratings from several evaluators are averaged because single ratings are unreliable.',
 desc:'The seven problems from the sign-up form as bars sorted by severity, with the selected problem’s details and the three factors that decide its rating.',
 dur:9,hint:'Select a problem and raise or lower its severity. The list re-sorts into the order you would fix things.',
 init:()=>({sev:{...H6_SEV0},sel:'spinner'}),
 watch(p){const sev={};H6_SPOTS.forEach(s=>sev[s.id]=H6_SEV0[s.id]*smooth(clamp(p*1.6,0,1)));return {sev,sel:H6_SPOTS[Math.min(6,Math.floor(p*7))].id,anim:true}},
 ui:[{b:'Severity −',act:'down'},{b:'Severity +',act:'up'}],
 on:{pick(s,id){s.sel=id},down(s){s.sev[s.sel]=Math.max(0,s.sev[s.sel]-1)},up(s){s.sev[s.sel]=Math.min(4,s.sev[s.sel]+1)}},
 draw(s,f,X){
  let out=heading('Fix the worst problems first');
  const order=H6_SPOTS.slice().sort((a,b)=>Math.round(s.sev[b.id])-Math.round(s.sev[a.id])||H6_SPOTS.indexOf(a)-H6_SPOTS.indexOf(b));
  const label={jargon:'Jargon heading',rules:'Hidden password rules',error:'Cryptic error code',date:'Date format mismatch',recall:'Code from previous page',cancel:'No way to cancel',spinner:'Endless spinner'};
  order.forEach((sp,i)=>{const y=54+i*40,v=s.sev[sp.id],sel=sp.id===s.sel,col=v>=3.5?C.coral:v>=2.5?C.amber:v>=1.5?C.blue:C.muted;
   out+=hit(X,'pick',sp.id,`${label[sp.id]}, severity ${Math.round(v)}. Press to select.`,R(14,y,350,34,sel?C.pale:'#fff',sel?C.blue:C.grid,7)+TF(24,y+22,label[sp.id],13,C.ink,'start',sel?'font-weight="700"':'')+R(196,y+11,130*v/4,12,col,'none',5)+TF(356,y+22,Math.round(v),13,col,'end','font-weight="700"'))});
  const sp=H6_SPOTS.find(x=>x.id===s.sel),v=Math.round(s.sev[s.sel]);
  out+=R(378,54,210,274,'#fff',C.grid,9)+TBF(390,78,label[sp.id],14,C.ink,'start');
  H6_wrap(sp.why,28).forEach((l,i)=>out+=TF(390,102+i*18,l,13,C.muted,'start'));
  out+=TB(390,186,'Rated: '+H6_SEVN[v],13,C.blue,'start');
  ['Frequency: how often?','Impact: how bad?','Persistence: every time,','or learnt around?'].forEach((l,i)=>out+=TF(390,222+i*20,l,13,C.ink,'start'));
  out+=TF(390,310,'Heuristic '+sp.h+': '+H6_HEUR[sp.h-1],13,C.purple,'start');
  return {svg:out,phase:'Severity turns a list of complaints into a plan. Average several evaluators’ ratings: individual judgements of severity vary a lot.'};
 }});

const H6_EVD=[.75,.65,.6,.55,.5,.45,.4,.38,.33,.3,.25,.2,.17,.12,.1,.05];
const H6_EVU=(()=>{const r=rng(77);return range(10).map(()=>range(16).map(()=>r()))})();
SCENE({id:'heuristics-evaluators',name:'Several evaluators',tag:'Why one expert is not enough',
 definition:'Different evaluators notice different problems. Pooling the findings of a few evaluators, each working alone, catches far more than any one of them.',
 example:'Nielsen found that single evaluators caught only about a third of the known problems on average, and recommended three to five evaluators.',
 research:'Nielsen & Molich (1990); Nielsen (1992). Finding usability problems through heuristic evaluation. CHI ’92.',
 desc:'A grid of evaluators against sixteen problems of varying difficulty, a row of problems found by anyone, and a curve of the share found as evaluators are added.',
 dur:10,hint:'Add evaluators and watch the pooled row fill. Hard problems on the right are found by only a few people.',
 init:()=>({k:3}),
 watch(p){return {k:1+Math.min(9,Math.floor(p*10))}},
 ui:[{range:'k',label:'Evaluators',min:1,max:10,get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const mat=H6_EVU.map(r=>r.map((u,j)=>u<H6_EVD[j]));let out=heading('Pool independent evaluators');
  const g=H6_grid(mat,s.k,86,64,14,20,'evaluators ↓');out+=g.svg;
  const single=sum(mat.map(r=>r.filter(Boolean).length))/10/16;
  const obs=range(10).map(k=>range(16).filter(j=>mat.slice(0,k+1).some(r=>r[j])).length/16);
  out+=H6_curve(k=>1-Math.pow(1-single,k),obs,s.k,10,360,300,220,220,'evaluators');
  out+=TB(470,50,`${s.k} evaluator${s.k>1?'s':''}: ${g.found} of 16 found`,14,C.green)+TF(470,68,`one evaluator alone: about ${Math.round(single*100)}%`,13,C.muted);
  out+=TF(86+8*14,352,'← easy to spot · hard to spot →',13,C.muted);
  return {svg:out,phase:`Each evaluator here finds about ${Math.round(single*100)}% of problems. Pooling ${s.k} finds ${Math.round(100*g.found/16)}%. The curve flattens: past about five evaluators, extra effort buys little. The blue curve assumes evaluators are independent; real ones overlap more.`};
 }});

/* ---------- Lesson: Scanning patterns ---------- */
const H6_FIX={
 wall:[[70,92],[140,94],[210,92],[290,95],[350,93],[72,118],[150,120],[230,118],[70,146],[74,172],[120,174],[72,200],[70,226],[78,252],[140,254],[72,280],[74,306]],
 layered:[[70,90],[150,92],[240,92],[70,142],[130,144],[72,170],[72,194],[70,236],[160,238],[72,264],[72,288],[72,312],[110,314]]
};
function H6_pageWire(layout){
 let out=R(40,60,340,276,'#fff',C.line,8);
 if(layout==='wall'){out+=R(56,80,300,16,C.ink,'none',3);for(let i=0;i<9;i++)out+=R(56,108+i*26,i%3===2?250:300,8,'#c9d4db','none',3)}
 else{out+=R(56,80,240,16,C.ink,'none',3);
  [[132,'Opening hours'],[226,'Prices']].forEach(([y,t])=>out+=R(56,y,160,12,'#516775','none',3));
  [164,188,258,282,306].forEach(y=>out+=Ci(60,y+4,3,C.ink)+R(68,y,46,8,'#7d929e','none',3)+R(118,y,150,8,'#d3dce2','none',3));
  out+=R(56,108,280,8,'#c9d4db','none',3);}
 return out;
}
SCENE({id:'scanning-patterns',name:'Scanning patterns',tag:'People scan, they rarely read',
 definition:'On screen, most people scan rather than read word by word. On a dense block of text their eyes often trace an F: across the top, a shorter second sweep, then down the left edge.',
 example:'Break the same content into headings, short paragraphs and bullet points starting with key words, and readers can jump from heading to heading (a “layer cake”) and still find what they need.',
 research:'Nielsen (2006). F-shaped pattern for reading web content (eye-tracking study, Nielsen Norman Group). Pernice (2017) described further patterns such as layer-cake and spotted scanning.',
 desc:'A wireframe page with a heat map of where the eyes rest, built up fixation by fixation; a dense wall of text produces an F shape, a structured page a layered pattern.',
 dur:12,hint:'Choose a layout and step through the fixations, or show them all. These patterns are illustrative, drawn from published findings.',
 init:()=>({layout:'wall',k:17}),
 watch(p){const wall=p<.5,u=(p%.5)*2,n=H6_FIX[wall?'wall':'layered'].length;return {layout:wall?'wall':'layered',k:Math.min(n,Math.floor(u*1.2*n))}},
 ui:[{choose:[['wall','Wall of text'],['layered','Headings and bullets']],label:'Layout',get:s=>s.layout,act:'layout'},{b:'Next fixation',act:'next'},{b:'Show all',act:'all'}],
 on:{layout(s,v){s.layout=v;s.k=0},next(s){s.k=Math.min(H6_FIX[s.layout].length,s.k+1)},all(s){s.k=H6_FIX[s.layout].length}},
 draw(s){
  const fx=H6_FIX[s.layout].slice(0,s.k);let out=heading(s.layout==='wall'?'A wall of text: the F pattern':'Headings and bullets: a layer cake');
  out+=`<defs><radialGradient id="h6heat"><stop offset="0" stop-color="#e5482a" stop-opacity=".5"/><stop offset=".6" stop-color="#f2a33a" stop-opacity=".25"/><stop offset="1" stop-color="#f2a33a" stop-opacity="0"/></radialGradient></defs>`;
  out+=H6_pageWire(s.layout);
  fx.forEach(([x,y])=>out+=`<circle cx="${x}" cy="${y}" r="34" fill="url(#h6heat)"/>`);
  fx.forEach(([x,y],i)=>{if(i)out+=L(fx[i-1][0],fx[i-1][1],x,y,'#6b7f8a',1,'opacity=".6"');out+=Ci(x,y,9,'#fff',C.coral)+TF(x,y+4.5,i+1,13,C.coral,'middle','font-weight="700"')});
  out+=TB(490,90,`${s.k} fixation${s.k===1?'':'s'}`,16,C.ink)+TF(490,114,s.layout==='wall'?'most on the top lines':'one per heading',13,C.muted)+TF(490,132,s.layout==='wall'?'and the left edge':'and per key word',13,C.muted);
  out+=TF(490,300,'Illustrative pattern based',13,C.muted)+TF(490,318,'on published eye-tracking',13,C.muted);
  return {svg:out,phase:s.layout==='wall'?'The F pattern is not a law: it is what people fall back on when a page gives them no structure. Content at the right of lower lines is seldom seen.':'With headings and front-loaded bullets, the eye hops between landmarks. The design gives scanning something to hold on to.'};
 }});

const H6_NAV=['News','Our team','Prices','Events','Contact','Gallery','Jobs'];
SCENE({id:'scanning-patterns-banner',name:'Banner blindness',tag:'We learn to ignore what looks like an ad',
 definition:'Banner blindness is the tendency to skip over anything that looks like an advertisement: bright boxes, banners and animated panels, even when they hold exactly what we want.',
 example:'Benway and Lane put the answer to a search task inside a large, colourful banner. Many participants failed to find it, while the same link presented as plain text was found easily.',
 research:'Benway & Lane (1998). Banner blindness: web searchers often miss “obvious” links. Internetworking 1.3.',
 desc:'A page with a navigation list and a bright banner. In Try it, a timed search task alternates between the target shown as a plain link and as a banner, and the learner’s times are charted.',
 dur:10,hint:'Press Start, then find and press “Opening hours” as fast as you can. Trials alternate between a plain link and a banner.',
 init:()=>({phase:'ready',trial:0,cond:'plain',t0:0,res:{plain:[],banner:[]},misses:0,seed:5}),
 watch(p){return {phase:'watch',cond:'banner',k:Math.min(9,Math.floor(p*10)),seed:5,res:{plain:[],banner:[]},misses:0,trial:0}},
 ui:[{b:'Start trial',act:'start'},{b:'Clear results',act:'clear'}],
 on:{start(s){s.cond=s.trial%2?'banner':'plain';s.seed=nextSeed();s.phase='search';s.t0=performance.now();s.misses=0},
  found(s){if(s.phase!=='search')return;s.res[s.cond].push(Math.round(performance.now()-s.t0));s.phase='done';s.trial++},
  wrong(s){if(s.phase==='search')s.misses++},clear(s){s.res={plain:[],banner:[]};s.trial=0;s.phase='ready'}},
 draw(s,f,X){
  let out=heading('Find “Opening hours”');
  const showPage=s.phase==='search'||s.phase==='watch'||s.phase==='done';
  const order=shuffled(H6_NAV,s.seed),slot=Math.floor(rng(s.seed+1)()*6);
  const nav=s.cond==='plain'?order.slice(0,6).map((x,i)=>i===slot?'Opening hours':x):order.slice(0,6);
  out+=R(14,46,390,300,'#fff',C.line,9)+R(14,46,390,30,'#2b3d47','none',9)+R(14,66,390,10,'#2b3d47','none',0)+TF(26,66,'Museum of Clocks',13,'#fff','start','font-weight="700"');
  const tap=(act,arg,lab,inner)=>s.phase==='search'?hit(X,act,arg,lab,inner):inner;
  nav.forEach((lab,i)=>{const y=106+i*34,isT=lab==='Opening hours';out+=tap(isT?'found':'wrong',i,lab,R(24,y-20,120,28,'#f3f6f8','none',5)+TF(32,y,lab,13,C.blue,'start'))});
  const bannerIsTarget=s.cond==='banner';
  out+=tap(bannerIsTarget?'found':'wrong','b',bannerIsTarget?'Banner: Opening hours':'Banner: Summer sale',R(160,90,232,92,'#ffcf3f','#e08a00',10)+TB(276,124,bannerIsTarget?'OPENING HOURS':'SUMMER SALE',17,'#8a2b00')+TF(276,148,bannerIsTarget?'Open 10:00–17:00 daily':'50% off gift shop',13,'#8a2b00')+TF(276,168,'click here!',13,'#8a2b00','middle','font-weight="700"'));
  for(let i=0;i<5;i++)out+=R(160,202+i*24,226,8,'#d3dce2','none',3);
  if(s.phase==='watch'){const path=[[300,108],[90,106],[88,140],[86,174],[90,208],[88,242],[260,206],[250,230],[90,276],[90,310]].slice(0,s.k+1);
   path.forEach(([x,y],i)=>{if(i)out+=L(path[i-1][0],path[i-1][1],x,y,'#6b7f8a',1.2);out+=Ci(x,y,8,'#fff',C.coral)+TF(x,y+4.5,i+1,13,C.coral,'middle')});
   out+=TF(209,368,'Simulated gaze: one glance at the banner, then the eyes leave it.',13,C.muted)}
  if(s.phase==='ready'){out+=R(40,140,340,90,'rgba(255,255,255,0.94)',C.blue,12)+TB(210,176,'Press “Start trial”',16,C.blue)+TF(210,200,'then find “Opening hours” and press it',13,C.ink)}
  const mean=a=>a.length?Math.round(sum(a)/a.length):null,mp=mean(s.res.plain),mb=mean(s.res.banner),mx=Math.max(1500,mp||0,mb||0);
  out+=TB(500,72,'Your mean times',14,C.ink);
  [['plain link',mp,s.res.plain.length,C.blue],['banner',mb,s.res.banner.length,'#e08a00']].forEach(([lab,v,n,col],i)=>{const x=440+i*80,h=v?200*v/mx:0;out+=R(x,300-h,50,h,col,'none',4)+TF(x+25,320,lab,13,C.ink)+TF(x+25,338,n?`${v} ms (n=${n})`:'no trials',13,C.muted);});
  out+=L(424,300,580,300,C.muted,1.5);
  const say=s.phase==='done'?`Found in ${s.res[s.cond][s.res[s.cond].length-1]} ms (${s.cond==='banner'?'banner':'plain link'}${s.misses?`, ${s.misses} wrong click${s.misses>1?'s':''}`:''}). Press Start for the next trial.`:s.phase==='search'?'Searching… find “Opening hours”.':'People learn that banner-shaped things are adverts and steer their eyes away from them, so important content should not be dressed like an ad.';
  return {svg:out,phase:say};
 }});

const H6_OPTS=[{t:'Prices and tickets',q:62},{t:'Plan your visit',q:78},{t:'Accessibility',q:40},{t:'Visit us: hours and directions',q:92},{t:'News',q:15},{t:'Groups and schools',q:55},{t:'Contact',q:70},{t:'FAQ',q:48}];
SCENE({id:'scanning-patterns-satisficing',name:'Satisficing',tag:'Good enough beats best',
 definition:'Satisficing means choosing the first option that seems good enough instead of comparing every option to find the best. On the web it is usually the sensible strategy, because a wrong guess costs only a Back click.',
 example:'Looking for the museum’s opening hours, many people click “Plan your visit” as soon as they see it, without reading on to “Visit us: hours and directions”.',
 research:'Simon (1956). Rational choice and the structure of the environment. Psychological Review. Krug (2000), Don’t Make Me Think, applied satisficing to web design.',
 desc:'A list of eight links read from the top; each reveals how well it matches the goal, and the reader stops at the first link above the aspiration line. A chart compares links read with quality gained.',
 dur:10,hint:'Set your aspiration level (how good is good enough) and step through the list. Shuffle the order and try again.',
 init:()=>({asp:70,seed:0}),
 ui:[{range:'asp',label:'Good enough at',min:30,max:100,get:s=>s.asp,act:'asp'},{b:'Shuffle order',act:'shuffle'}],
 on:{asp(s,v){s.asp=v},shuffle(s){s.seed=nextSeed()}},
 trace(s){const list=s.seed?shuffled(H6_OPTS,s.seed):H6_OPTS;const fr=[];let pick=-1;for(let i=0;i<list.length;i++){fr.push({list,read:i+1,pick:-1});if(list[i].q>=s.asp){pick=i;break}}
  if(pick<0){const best=list.reduce((b,o,i)=>o.q>list[b].q?i:b,0);fr.push({list,read:list.length,pick:best,fallback:true})}else fr.push({list,read:pick+1,pick});return fr},
 draw(s,f){
  const list=f.list,best=list.reduce((b,o,i)=>o.q>list[b].q?i:b,0);let out=heading('Goal: opening hours');
  list.forEach((o,i)=>{const y=58+i*34,read=i<f.read,pk=i===f.pick;out+=R(14,y,330,28,pk?C.greenp:read?'#fff':'#f4f6f7',pk?C.green:read?C.grid:'none',6)+TF(24,y+19,o.t,13,read?C.blue:'#a2b1ba','start','text-decoration="underline"');
   if(read)out+=R(250,y+9,84*o.q/100,10,o.q>=s.asp?C.green:C.line,'none',4);if(i===best&&f.pick>=0)out+=TF(350,y+19,'best',13,C.amber,'start')});
  const ay=58+8*34+8;out+=L(250+84*s.asp/100,52,250+84*s.asp/100,ay-6,C.coral,1.5,'stroke-dasharray="4 3"')+TF(250+84*s.asp/100,ay+8,'good enough',13,C.coral);
  const pts=range(15).map(a=>{const asp=30+a*5,i=list.findIndex(o=>o.q>=asp);return {asp,read:i<0?list.length:i+1,q:i<0?list[best].q:list[i].q}});
  const px=a=>400+180*(a-30)/70;out+=TB(490,66,'Links read (bars) and',13,C.ink)+TB(490,84,'quality found (line)',13,C.ink);
  out+=L(400,300,580,300,C.muted,1.5);pts.forEach(p=>out+=R(px(p.asp)-5,300-p.read*20,10,p.read*20,'#c8d6df','none',2));
  out+=P(pts.map((p,i)=>(i?'L':'M')+fmt(px(p.asp))+' '+fmt(300-p.q*1.6)).join(''),C.green,2.2);
  out+=L(px(s.asp),110,px(s.asp),300,C.coral,1.5,'stroke-dasharray="4 3"')+TF(490,320,'aspiration level →',13,C.muted);
  const done=f.pick>=0;
  return {svg:out,phase:done?(f.fallback?'Nothing reached the bar, so the reader went back to the best seen after reading every link.':`Stopped after ${f.read} link${f.read>1?'s':''} on “${list[f.pick].t}” (quality ${list[f.pick].q}${f.pick===best?', the best':'; the best was '+list[best].q}). Higher standards cost more reading for a modest gain.`):`Reading link ${f.read}: is it good enough?`};
 }});

/* ---------- Lesson: Response time ---------- */
// Timed Try-it scenes schedule follow-up actions through the page's own action hook, only while still on the scene.
function H6_live(id){try{const st=window.csApp&&window.csApp.state();return !!st&&st.id===id&&st.mode==='try'}catch(_){return false}}
const H6_lx=t=>40+520*(Math.log10(t)-Math.log10(.05))/(Math.log10(30)-Math.log10(.05));
const H6_BANDS=[[.05,.1,'feels instant',C.greenp],[.1,1,'noticed, flow kept',C.pale],[1,10,'needs progress feedback',C.amberp],[10,30,'attention drifts',C.coralp]];
SCENE({id:'response-time',name:'Response time',tag:'How long can people wait?',
 definition:'People perceive delays in bands: up to about 0.1 s a response feels instantaneous, up to about 1 s their flow of thought is kept, and beyond about 10 s their attention drifts away.',
 example:'Doherty and Thadani reported that keeping system responses under about 0.4 s made IBM users markedly more productive: they stopped waiting and started working at the machine’s pace.',
 research:'Miller (1968). Response time in man–computer conversational transactions. Card, Robertson & Mackinlay (1991). Doherty & Thadani (1982), The economic value of rapid response time, IBM.',
 desc:'A logarithmic time line from 0.05 to 30 seconds divided into the perception bands, with the 0.4 s threshold marked and the learner’s measured delays plotted.',
 dur:10,hint:'Choose a delay, then press Save and feel the wait. Each measured response is plotted on the time line.',
 init:()=>({delay:1000,phase:'idle',token:0,log:[]}),
 watch(p){return {delay:Math.round(50*Math.pow(600,p)),phase:'watch',log:[]}},
 ui:[{range:'delay',label:'Delay',min:50,max:5000,step:50,get:s=>s.delay,act:'delay',show:v=>v+' ms'}],
 on:{delay(s,v){s.delay=v},press(s,a,ctx){if(s.phase==='wait')return;s.token++;s.phase='wait';s.t0=performance.now();ctx.later(s.delay,'arrive',s.token)},
  arrive(s,tok){if(Number(tok)!==s.token||s.phase!=='wait')return;s.phase='done';s.got=Math.round(performance.now()-s.t0);s.log=s.log.concat(s.got).slice(-8)}},
 draw(s,f,X){
  let out=heading('Three limits of waiting');
  H6_BANDS.forEach(([a,b,lab,col],i)=>{out+=R(H6_lx(a),190,H6_lx(b)-H6_lx(a),60,col,'none',0);out+=TF(i===3?556:(H6_lx(a)+H6_lx(b))/2,i%2?290:272,lab,13,C.ink,i===3?'end':'middle')});
  for(const t of [.1,.4,1,10]){out+=L(H6_lx(t),182,H6_lx(t),258,t===.4?C.purple:C.ink,t===.4?2:1.5);out+=TF(H6_lx(t),176,t+' s',13,t===.4?C.purple:C.ink)}
  out+=TF(H6_lx(.4),316,'0.4 s: Doherty threshold',13,C.purple);
  for(const t of [.05,30])out+=TF(H6_lx(t),176,t+' s',13,C.muted);
  if(s.phase==='watch'){const t=s.delay/1000,x=H6_lx(t);out+=`<polygon points="${fmt(x)},252 ${fmt(x-8)},266 ${fmt(x+8)},266" fill="${C.blue}"/>`+TB(x,238,t<1?Math.round(t*1000)+' ms':fmt(Math.round(t*10)/10)+' s',13,C.blue)}
  s.log.forEach((ms,i)=>out+=Ci(H6_lx(ms/1000),220,7,C.blue,'#fff'));
  const state=s.phase==='wait'?'Saving…':s.phase==='done'?`Saved ✓ after ${s.got} ms`:'Unsaved changes';
  out+=hit(X,'press','','Save (measures the delay)',R(60,60,140,46,s.phase==='wait'?C.line:C.blue,'none',10)+TB(130,89,s.phase==='wait'?'…':'Save',17,'#fff'));
  out+=TF(220,89,state,15,s.phase==='done'?C.green:C.ink,'start');
  out+=TF(300,340,'Logarithmic scale: each step right is ten times longer.',13,C.muted);
  const band=t=>t<.1?'instant':t<1?'noticeable but fine':t<10?'long enough to need feedback':'long enough to lose attention';
  return {svg:out,phase:s.phase==='done'?`That response took ${s.got} ms: ${band(s.got/1000)}.`:s.phase==='watch'?`At ${s.delay} ms a response is ${band(s.delay/1000)}.`:'These limits come from how human attention and memory work, so they have stayed the same while computers became millions of times faster.'};
 }});

let H6_timer=null;
const H6_BAR_MS=3500;
SCENE({id:'response-time-progress',name:'Progress indicators',tag:'Making waits feel shorter',
 definition:'A progress indicator tells people the system is working and how much is left. Its shape changes how long the wait feels, even when the actual time is the same.',
 example:'Myers found people prefer a percent-done indicator during long waits. Harrison and colleagues found that bars which speed up towards the end feel faster than ones that move steadily or slow down.',
 research:'Myers (1985). The importance of percent-done progress indicators for computer–human interfaces. CHI ’85. Harrison, Amento, Kuznetsov & Bell (2007). Rethinking the progress bar. UIST ’07.',
 desc:'Two progress bars of identical duration, one steady and one accelerating. In Try it the learner watches both, chooses which felt faster, and then sees which was which.',
 dur:9,hint:'Press Play to watch bar A then bar B (each takes the same time), then say which felt faster.',
 init:()=>({phase:'idle',u:0,trials:0,votes:{accel:0,linear:0,same:0},token:0}),
 watch(p){return {phase:'watch',u:clamp(p*1.1,0,1),trials:0,votes:{accel:0,linear:0,same:0}}},
 ui:[{b:'Play A then B',act:'play'}],
 on:{play(s,a,ctx){if(s.phase==='A'||s.phase==='B')return;s.first=s.trials%2?'linear':'accel';s.phase='A';s.u=0;s.t0=performance.now();s.token++;clearInterval(H6_timer);H6_timer=ctx.every(80,'tick',s.token)},
  tick(s,tok){if(Number(tok)!==s.token)return 'stop';const u=(performance.now()-s.t0)/H6_BAR_MS;if(u<1){s.u=u;return}
   if(s.phase==='A'){s.phase='B';s.u=0;s.t0=performance.now()}else if(s.phase==='B'){s.phase='judge';s.u=1;return 'stop'}},
  judge(s,w){if(s.phase!=='judge')return;const kind=w==='same'?'same':(w==='A')===(s.first==='accel')?'accel':'linear';s.votes[kind]++;s.trials++;s.phase='reveal'}},
 draw(s,f,X){
  const fn=(kind,u)=>kind==='accel'?u*u:u;let out=heading('Same duration, different feel');
  const kinds=s.phase==='watch'?['linear','accel']:[s.first||'accel',s.first==='linear'?'accel':'linear'];
  const fill=(i)=>{if(s.phase==='watch')return fn(kinds[i],s.u);if(s.phase==='A')return i===0?fn(kinds[0],s.u):0;if(s.phase==='B')return i===0?1:fn(kinds[1],s.u);if(s.phase==='idle')return 0;return 1};
  ['A','B'].forEach((n,i)=>{const y=80+i*76,v=fill(i),reveal=s.phase==='reveal'||s.phase==='watch';
   out+=TB(40,y+20,n,17,C.ink)+R(70,y,440,30,'#eef3f6',C.grid,8)+R(70,y,440*v,30,C.blue,'none',8)+TF(520,y+20,Math.round(v*100)+'%',13,C.ink,'start');
   if(reveal)out+=TF(70,y+50,kinds[i]==='accel'?'accelerating: slow start, fast finish':'steady: same speed throughout',13,kinds[i]==='accel'?C.purple:C.muted,'start')});
  if(s.phase==='judge'){[['A','A felt faster'],['B','B felt faster'],['same','About the same']].forEach(([w,lab],i)=>out+=hit(X,'judge',w,lab,R(70+i*150,250,140,36,C.pale,C.blue,8)+TF(140+i*150,273,lab,13,C.blue,'middle','font-weight="700"')))}
  if(s.phase==='reveal')out+=TB(300,266,`Both bars took exactly ${H6_BAR_MS/1000} s.`,15,C.ink);
  const v=s.votes;out+=TF(300,330,`Your votes: accelerating felt faster ${v.accel} · steady ${v.linear} · same ${v.same}`,13,C.muted);
  return {svg:out,phase:s.phase==='watch'?'Both bars start and finish together. The accelerating one lags early on and surges at the end, which people tend to remember as quicker.':s.phase==='reveal'?'Harrison and colleagues found accelerating bars were judged faster than steady ones. Your own vote is one data point; try a few trials.':s.phase==='judge'?'Which one felt faster?':'Press Play. Watch bar A, then bar B.'};
 }});

SCENE({id:'response-time-optimistic',name:'Optimistic updates',tag:'Show the result before the server replies',
 definition:'An optimistic interface shows the result of an action immediately, assuming it will succeed, and quietly undoes it with an explanation if the server later reports a failure.',
 example:'Pressing a heart turns it red at once, even though the server takes 800 ms to save it. If saving fails, the heart turns grey again and a message explains.',
 research:'Card, Robertson & Mackinlay (1991): feedback within about 0.1 s feels like direct cause and effect. Optimistic updating is a design pattern built on that limit rather than a single study.',
 desc:'A “like” card and a timeline of a request to the server; in blocking mode the card waits for the reply, in optimistic mode it updates at once and rolls back if the save fails.',
 dur:10,hint:'Choose blocking or optimistic, decide whether the server fails, then step through the 1.2 seconds.',
 init:()=>({mode:'optimistic',fail:false}),
 ui:[{choose:[['blocking','Blocking'],['optimistic','Optimistic']],label:'Strategy',get:s=>s.mode,act:'mode'},{b:'Toggle server failure',act:'fail'}],
 on:{mode(s,v){s.mode=v},fail(s){s.fail=!s.fail}},
 trace(s){return range(13).map(k=>({k}))},
 draw(s,f){
  const k=f.k,back=k>=8,opt=s.mode==='optimistic';let liked,count,msg='';
  if(opt){liked=!(back&&s.fail);msg=back?(s.fail?'Couldn’t save, so it was undone.':''):''}else{liked=back&&!s.fail;msg=back?(s.fail?'Couldn’t save. Try again.':''):'Saving…'}
  count=liked?42:41;let out=heading(opt?'Optimistic: update now, confirm later':'Blocking: wait for the server');
  out+=R(40,58,220,180,'#fff',C.line,12)+R(56,74,188,88,'#dfe9ef','none',6)+TF(150,124,'photo',13,C.muted);
  out+=P('M74 196 C74 186 86 182 92 192 C98 182 110 186 110 196 C110 206 92 214 92 218 C92 214 74 206 74 196 Z',liked?C.coral:C.muted,2,liked?C.coral:'#fff');
  out+=TB(122,206,count+' likes',15,C.ink,'start');if(msg)out+=TF(150,232,msg,13,s.fail&&back?C.coral:C.muted);
  out+=TF(150,262,'what the user sees',13,C.muted);
  const tx=t=>300+t*22;out+=L(tx(0),110,tx(12),110,C.muted,1.5)+L(tx(0),200,tx(12),200,C.muted,1.5);
  out+=TF(300,96,'server',13,C.muted,'start')+TF(300,186,'screen',13,C.muted,'start');
  for(let t=0;t<=12;t+=4)out+=TF(tx(t),300,(t*100)+' ms',13,C.muted);
  out+=arrow(tx(0),196,tx(4),114,C.blue,2,8)+TF(tx(1.6),140,'request',13,C.blue,'end');
  if(back)out+=arrow(tx(4),114,tx(8),196,s.fail?C.coral:C.green,2,8)+TF(tx(6.2),140,s.fail?'✗ failed':'✓ saved',13,s.fail?C.coral:C.green,'start');
  out+=R(tx(0),210,opt?tx(.6)-tx(0):tx(8)-tx(0),14,opt?C.greenp:C.amberp,'none',3)+TF(tx(0),246,opt?'feedback at once':'waiting for the reply',13,opt?C.green:C.amber,'start');
  out+=L(tx(k),90,tx(k),270,C.ink,1.5,'stroke-dasharray="4 3"');
  return {svg:out,phase:`${k*100} ms. `+(opt?(back?(s.fail?'The save failed, so the interface rolls back and says why. Rollbacks must be rare and clearly explained, or people stop trusting what they see.':'The server agrees; nothing visible changes because the screen was already right.'):'The heart is already red: the action feels instant even though the server has not answered.'):(back?(s.fail?'Only now does the user learn it failed.':'After 800 ms the heart finally turns red.'):'The user stares at “Saving…” while the request travels.'))};
 }});
