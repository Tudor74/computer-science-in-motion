/* Ted Nelson In Motion · era 6 · The web arrives (1989–2000).
   A simpler hypertext wins; the costs of one-way links, broken links, lost versions and embedded markup, measured. */

const T6_wrap=(s,n)=>{const w=String(s).split(' '),out=[];let l='';for(const x of w){if((l+' '+x).trim().length>n){if(l)out.push(l);l=x}else l=(l+' '+x).trim()}if(l)out.push(l);return out};

/* ---------------- Web against Xanadu ---------------- */
const T6_FEAT=[
 {f:'Links',web:'One-way, written inside the page',xan:'Two-way, stored as separate objects',w:1,x:2},
 {f:'Quoting',web:'Copy and paste',xan:'Transclusion, connected to source',w:0,x:2},
 {f:'Versions',web:'Overwrite; old versions vanish',xan:'Every version kept and comparable',w:0,x:2},
 {f:'Addresses',web:'URLs that move and break',xan:'Permanent tumbler addresses',w:1,x:2},
 {f:'Payment',web:'None built in',xan:'Transcopyright royalties',w:0,x:1},
 {f:'Publishing',web:'Anyone, any server, no permission',xan:'Needs the shared network to run',w:2,x:0},
 {f:'Shipped',web:'Public in 1991; free code',xan:'No public system until 1999',w:2,x:0}];
SCENE({id:'web-vs-xanadu',name:'The web against Xanadu',tag:'Two designs for hypertext',
 definition:'Tim Berners-Lee’s World Wide Web (proposed at CERN in 1989) was a deliberately simple hypertext: one-way links, copied text and addresses that can break. Xanadu offered far more, but required everything to work together before anything worked at all.',
 example:'On the web you can publish a page today on your own server and link to anyone without asking. In Xanadu your page would join a shared docuverse with permanent addresses, two-way links and royalties, once that docuverse existed.',
 research:'Berners-Lee, T. (1989). Information Management: A Proposal. CERN. Berners-Lee, T. & Fischetti, M. (1999). Weaving the Web. Harper. Nelson, T. H. (1999). Xanalogical structure, needed now more than ever. ACM Computing Surveys 31(4es).',
 desc:'A table of seven features with the web’s and Xanadu’s approaches side by side; choosing a feature highlights it and shows which design served it better.',
 dur:12,hint:'Choose each feature in turn. Where did Xanadu have the better idea, and where did the web’s simplicity win?',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(6,Math.floor(p*7))}},
 ui:[{choose:T6_FEAT.map((d,i)=>[i,d.f]),label:'Feature',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Same goal, opposite bets');
  out+=TBF(200,64,'World Wide Web',14,C.blue)+TBF(450,64,'Xanadu',14,C.purple);
  const dot=(x,y,v,c)=>Ci(x,y,7,v===2?c:'#fff',c)+(v===1?P(`M${x} ${y-7} A7 7 0 0 1 ${x} ${y+7} Z`,'none',0,c):'');
  T6_FEAT.forEach((d,i)=>{const y=76+i*40,on=i===s.k;out+=hit(X,'k',i,`Feature ${d.f}`,R(16,y,568,34,on?C.pale:'#fff',on?C.blue:C.grid,6)+TBF(26,y+22,d.f,13,C.ink,'start'));
   if(!on)out+=dot(200,y+17,d.w,C.blue)+dot(450,y+17,d.x,C.purple);
   if(on){out+=TF(200,y+22,d.web,13,C.ink)+TF(450,y+22,d.xan,13,C.ink)}});
  const d=T6_FEAT[s.k],win=d.w>d.x?'the web':d.x>d.w?'Xanadu':'neither';
  out+=dot(176,366,2,C.muted)+TF(188,371,'served well',13,C.muted,'start')+dot(290,366,1,C.muted)+TF(302,371,'partly',13,C.muted,'start')+dot(372,366,0,C.muted)+TF(384,371,'not at all',13,C.muted,'start');
  return {svg:out,phase:`${d.f}: the web — ${d.web.toLowerCase()}; Xanadu — ${d.xan.toLowerCase()}. On this, ${win} had the stronger design.`};
 }});

const T6_GRAY=[[1991.6,1],[1993.45,130],[1993.95,623],[1994.45,2738],[1994.95,10022],[1995.45,23500],[1996.0,100000],[1996.45,230000],[1997.0,650000]];
const T6_XMILE=[[1988,'Autodesk funds it'],[1992,'Autodesk out'],[1995.4,'Wired article']];
SCENE({id:'web-vs-xanadu-growth',name:'How fast the web grew',tag:'Simple things spread',
 definition:'Within a few years of its public release in 1991, the web went from one server to hundreds of thousands, on a log scale nearly a straight line. Xanadu, with a richer design, had no public system in the same years.',
 example:'Matthew Gray’s web crawler counted 130 web sites in June 1993 and about 10,000 by the end of 1994; by early 1997 his estimate was 650,000.',
 research:'Gray, M. (1996). Web Growth Summary. MIT (counts from his Wanderer crawler; 1996–97 values are estimates). Gabriel, R. P. (1991). Lisp: good news, bad news, how to win big (“worse is better”).',
 desc:'A log-scale chart of the number of web sites from 1991 to 1997, with a moving year marker and Xanadu milestones on a separate band beneath.',
 dur:10,hint:'Move the year and read the number of sites. Each grid line is ten times the one below.',
 init:()=>({y:1995}),
 watch(p){return {y:1991.5+p*5.5}},
 ui:[{range:'y',label:'Year',min:1991.5,max:1997,step:.25,get:s=>s.y,act:'y',show:v=>Number(v).toFixed(2).replace(/\.00$/,'')}],
 on:{y(s,v){s.y=Number(v);return 'keep'}},
 draw(s){
  const x=yr=>70+(yr-1987)/(1997.2-1987)*500,y=v=>290-Math.log10(Math.max(1,v))/6*230;
  let out=heading('Web sites counted, 1991–1997 (log scale)');
  for(let e=0;e<=6;e++){out+=L(70,y(10**e),570,y(10**e),C.grid,1)+TF(64,y(10**e)+4,['1','10','100','1k','10k','100k','1M'][e],13,C.muted,'end')}
  for(let yr=1988;yr<=1997;yr+=1)out+=TF(x(yr),308,'’'+String(yr).slice(2),13,C.muted);
  let d='';T6_GRAY.forEach(([t,v],i)=>{d+=(i?'L':'M')+fmt(x(t))+' '+fmt(y(v))});out+=P(d,C.blue,2.5);
  T6_GRAY.forEach(([t,v])=>out+=Ci(x(t),y(v),4,C.blue));
  // Interpolate (log-linear) at the chosen year.
  let v=1;for(let i=1;i<T6_GRAY.length;i++){const [t0,v0]=T6_GRAY[i-1],[t1,v1]=T6_GRAY[i];if(s.y<=t1){const u=clamp((s.y-t0)/(t1-t0),0,1);v=10**(Math.log10(v0)+u*(Math.log10(v1)-Math.log10(v0)));break}v=v1}
  out+=L(x(s.y),56,x(s.y),290,C.coral,1.5,'stroke-dasharray="4 3"')+Ci(x(s.y),y(v),7,'#fff',C.coral);
  const lab=Math.round(v).toLocaleString('en-GB');out+=TBF(x(s.y)-12,y(v)-10,`≈ ${lab} sites`,14,C.coral,'end');
  out+=R(70,322,500,46,C.purplep,'none',6)+TBF(78,340,'Xanadu',13,C.purple,'start');
  T6_XMILE.forEach(([t,l])=>{out+=Ci(x(t),359,4,C.purple)+TF(x(t)+7,364,l,13,C.purple,'start')});out+=TF(562,340,'code released 1999 →',13,C.purple,'end');
  return {svg:out,phase:`${s.y.toFixed(1)}: about ${lab} web sites by Gray’s count. The curve rises roughly tenfold a year; in the same years Xanadu had funding, then none, and no public release.`};
 }});

SCENE({id:'web-vs-xanadu-404',name:'Allowed to break',tag:'Why “404 Not Found” helped the web grow',
 definition:'The web let links fail. A link is just an address typed into a page; if the target moves, the reader sees an error. Berners-Lee accepted this so that nobody had to ask permission or keep a global index, and anyone could start a server.',
 example:'To link to a page you only need its address. To be linked to, you need do nothing at all. The cost is the familiar “404 Not Found”.',
 research:'Berners-Lee, T. & Fischetti, M. (1999). Weaving the Web, on giving up link consistency. Fielding, R. et al. (1999). RFC 2616, HTTP/1.1, status code 404.',
 desc:'Steps a new author must take to publish and link in each design, drawn as two checklists, with a meter of how many other parties must agree.',
 dur:10,hint:'Step through publishing a page and linking to someone in each design.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{b:'Next step',act:'next'},{b:'Back',act:'back'}],
 on:{next(s){s.k=Math.min(4,s.k+1);return 'keep'},back(s){s.k=Math.max(0,s.k-1);return 'keep'}},
 draw(s){
  const W=[['Write a file in HTML',0],['Put it on any server',0],['Type the address of a page to link to',0],['Publish: done',0],['If the target moves: 404',0]];
  const Xs=[['Open an account on a Xanadu server',1],['Agree to the publishing and royalty terms',1],['Store the document in the docuverse',1],['Create a link object; both ends updated',2],['Target can never move: no 404',0]];
  let out=heading('What it takes to publish and link');
  const col=(x,t,list,c)=>{let o=TBF(x+130,64,t,15,c);list.forEach(([l,n],i)=>{const on=i<=s.k,y=78+i*52;o+=R(x,y,260,44,on?'#fff':'#f3f7fa',on?c:C.grid,6)+T6_wrap(l,32).map((ln,k)=>TF(x+12,y+19+k*17,ln,13,on?C.ink:C.muted,'start')).join('')+(n&&on?TF(x+250,y+38,'+'+n+' party'+(n>1?'ies':''),13,C.coral,'end'):'')});return o};
  out+=col(20,'World Wide Web',W,C.blue)+col(320,'Xanadu',Xs,C.purple);
  const wn=0,xn=sum(Xs.slice(0,s.k+1).map(a=>a[1]));
  out+=TF(150,354,`others who must cooperate: ${wn}`,13,C.blue)+TF(450,354,`others who must cooperate: ${xn}`,13,C.purple);
  return {svg:out,phase:s.k<4?`Step ${s.k+1}: on the web, nobody else is involved. In Xanadu, ${xn} other part${xn===1?'y has':'ies have'} had to take part so far.`:'The web’s price is the broken link; Xanadu’s price was that the whole system had to exist and agree before the first page could be published.'};
 }});

/* ---------------- Link rot ---------------- */
const T6_STUDIES=[
 {lab:'US Supreme Court opinions, since 1996',src:'Zittrain, Albert & Lessig 2014',v:50,what:'links no longer leading to the cited material'},
 {lab:'Harvard Law Review and others, 1999–2011',src:'Zittrain, Albert & Lessig 2014',v:70,what:'links no longer leading to the cited material'},
 {lab:'Web pages that existed in 2013',src:'Pew Research Center 2024',v:38,what:'no longer accessible in 2023'},
 {lab:'Science and medicine articles, 1997–2012',src:'Klein et al. 2014',v:20,what:'articles with at least one rotten web reference'}];
SCENE({id:'link-rot',name:'Link rot',tag:'Measured, not imagined',
 definition:'Link rot is the steady breaking of web links as pages move or vanish. Studies of cited links, in court opinions, journals and the web at large, find that a large share fail within a decade.',
 example:'About half the links in US Supreme Court opinions no longer led to the material originally cited when Zittrain and colleagues checked in 2013.',
 research:'Koehler, W. (2004). A longitudinal study of web pages continued. Information Research 9(2). Zittrain, J., Albert, K. & Lessig, L. (2014). Perma: scoping and addressing the problem of link and reference rot in legal citations. Harvard Law Review Forum 127, 176. Pew Research Center (2024). When Online Content Disappears.',
 desc:'Bars for four published studies of how many links or pages had failed, and a decay curve with a half-life slider that the learner fits to the 2013–2023 web figure.',
 dur:12,hint:'Read the studies, then set a half-life so the curve passes through the Pew figure (38% gone after ten years).',
 init:()=>({h:8}),
 watch(p){return {h:Math.round(2+p*20)}},
 ui:[{range:'h',label:'Half-life',min:2,max:30,get:s=>s.h,act:'h',show:v=>v+' years'}],
 on:{h(s,v){s.h=Number(v);return 'keep'}},
 draw(s){
  let out=heading('How much of the cited web has gone?');
  T6_STUDIES.forEach((d,i)=>{const y=54+i*44;out+=TF(20,y+12,d.lab,13,C.ink,'start')+R(20,y+18,200*d.v/100,14,C.coral,'none',3)+R(20+200*d.v/100,y+18,200*(1-d.v/100),14,'#eef2f5','none',3)+TBF(226,y+30,d.v+'%',13,C.coral,'start')});
  out+=TF(20,236,'share of links, pages or (last bar) articles',13,C.muted,'start');
  // Decay model.
  const x=t=>330+t*24,y=v=>300-v*2.2;
  out+=L(330,300,570,300,C.line,1.5)+L(330,80,330,300,C.line,1.5);
  [0,50,100].forEach(v=>out+=TF(324,y(v)+4,v+'%',13,C.muted,'end'));[0,5,10].forEach(t=>out+=TF(x(t),318,t+' y',13,C.muted));
  let d='';for(let t=0;t<=10;t+=.25){const v=100*Math.pow(.5,t/s.h);d+=(t?'L':'M')+fmt(x(t))+' '+fmt(y(v))}out+=P(d,C.blue,2.5);
  out+=Ci(x(10),y(62),6,C.coral)+TF(x(10)-8,y(62)+26,'Pew: 62% left',13,C.coral,'end');
  const m=100*Math.pow(.5,10/s.h);out+=Ci(x(10),y(m),5,'#fff',C.blue);
  out+=TBF(450,72,'pages still there',13,C.ink);
  const best=10*Math.log(.5)/Math.log(.62);
  return {svg:out,phase:`With a ${s.h}-year half-life, ${Math.round(m)}% of pages survive ten years; the Pew figure is 62%, which fits a half-life of about ${best.toFixed(0)} years. Koehler’s earlier samples decayed faster, with a half-life of about two years.`};
 }});

const T6_PAGES=[[90,90],[220,70],[350,100],[480,80],[130,200],[270,190],[410,210],[530,180],[100,300],[240,310],[380,300],[510,290]];
const T6_LINKS=[[0,1],[0,4],[1,2],[1,5],[2,3],[2,6],[3,7],[4,5],[4,8],[5,6],[5,9],[6,7],[6,10],[7,11],[8,9],[9,10],[10,11],[11,3],[9,1],[10,2]];
SCENE({id:'link-rot-sim',name:'Watch a web decay',tag:'And what archives and permanent addresses change',
 definition:'Each year some pages move or disappear. With plain web links, every link to them breaks. An archive such as the Wayback Machine can rescue some by keeping copies; permanent addresses, as in Xanadu, aim to keep every published version reachable for good, though that still depends on someone storing and copying the data.',
 example:'A page that moved in year 3 breaks every link to it. If an archive captured it first, readers can still reach the old copy, but only if someone thinks to look there.',
 research:'Internet Archive (1996–): the Wayback Machine. Zittrain, J., Albert, K. & Lessig, L. (2014), on Perma.cc archiving for citations. Nelson, T. H. (1981). Literary Machines (permanence). Loss rates here are illustrative.',
 desc:'Twelve pages joined by twenty links. Stepping through years removes pages at random from a fixed seed; broken links turn red unless an archive copy or permanent addressing saves them.',
 dur:12,hint:'Step through the years, then try the same history with an archive or with permanent addresses.',
 init:()=>({yr:0,pol:'web'}),
 watch(p){const k=Math.min(8,Math.floor(p*9));return {yr:[0,5,10][k%3],pol:['web','archive','perm'][Math.floor(k/3)]}},
 ui:[{range:'yr',label:'Years passed',min:0,max:10,get:s=>s.yr,act:'yr',show:v=>v},{choose:[['web','Plain web'],['archive','Web + archive'],['perm','Permanent addresses']],label:'Policy',get:s=>s.pol,act:'pol'}],
 on:{yr(s,v){s.yr=Number(v);return 'keep'},pol(s,v){s.pol=v;return 'keep'}},
 draw(s){
  const r=rng(23),gone=T6_PAGES.map(()=>Math.floor(1+r()*15)),archived=T6_PAGES.map(()=>r()<.55);
  const dead=i=>s.pol!=='perm'&&gone[i]<=s.yr,saved=i=>dead(i)&&s.pol==='archive'&&archived[i];
  let out=heading(s.pol==='perm'?'Permanent addresses: nothing published disappears':s.pol==='archive'?'With an archive: some lost pages can be recovered':'Plain web links: lost pages break every link to them');
  let broken=0,rescued=0;
  T6_LINKS.forEach(([a,b])=>{if(dead(a))return;const bad=dead(b)&&!saved(b),res=saved(b);if(bad)broken++;if(res)rescued++;out+=arrowR(T6_PAGES[a],T6_PAGES[b],18,20,bad?C.coral:res?C.amber:C.blue,bad?2.5:2)});
  T6_PAGES.forEach((p,i)=>{const d=dead(i),sv=saved(i);out+=Ci(p[0],p[1],18,d?(sv?C.amberp:'#f3f3f3'):'#fff',d?(sv?C.amber:C.line):C.blue,d&&!sv?'stroke-dasharray="4 3"':'')+TF(p[0],p[1]+5,d?(sv?'arch':'404'):i+1,13,d?(sv?C.amber:C.coral):C.ink)});
  const live=T6_LINKS.filter(([a])=>!dead(a)).length;
  out+=TF(300,366,`year ${s.yr}: ${broken} of ${live} links broken${s.pol==='archive'?`, ${rescued} rescued by the archive`:''}`,13,broken?C.coral:C.green);
  return {svg:out,phase:s.pol==='perm'?`Year ${s.yr}: with permanent addresses no page is withdrawn, so all ${T6_LINKS.length} links still work. That was Xanadu’s promise, and its cost was that publishing meant publishing for ever.`:`Year ${s.yr}: ${broken} of the ${live} links from surviving pages are broken${s.pol==='archive'?`, and an archive copy rescues ${rescued}`:''}.`};
 }});

SCENE({id:'link-rot-drift',name:'Content drift',tag:'The link works, but the page changed',
 definition:'Even when a link still works, the page it leads to may have changed since it was cited. Researchers call this content drift; together with broken links it is called reference rot.',
 example:'A paper cites a web page for a figure. Years later the link still opens, but the page now shows a different figure, and nothing tells the reader.',
 research:'Klein, M. et al. (2014). Scholarly context not found: one in five articles suffers from reference rot. PLOS ONE 9(12), e115253. Jones, S. M. et al. (2016). Scholarly context adrift: three out of four URI references lead to changed content. PLOS ONE 11(12), e0167475. Van de Sompel, H., Nelson, M. L. & Sanderson, R. (2013). RFC 7089: Memento.',
 desc:'The page as cited, beside the page as it is now; a years slider changes the live page sentence by sentence, with changes highlighted, and a button to view the archived version.',
 dur:12,hint:'Move forward in time and watch the cited page drift. Then open the archived copy that matches the citation date.',
 init:()=>({yr:4,arch:false}),
 watch(p){return {yr:Math.min(8,Math.floor(p*9)),arch:p>.85}},
 ui:[{range:'yr',label:'Years since citation',min:0,max:8,get:s=>s.yr,act:'yr',show:v=>v},{b:'View archived copy',act:'arch'}],
 on:{yr(s,v){s.yr=Number(v);s.arch=false;return 'keep'},arch(s){s.arch=!s.arch;return 'keep'}},
 draw(s){
  const L0=['Rainfall rose 12% in 2014.','Source: station records.','Method: daily gauges.','Contact the data team.'];
  const CH=[[2,'Rainfall rose 9% in 2014.'],[3,'Source: revised records.'],[5,'Method: satellite estimates.'],[7,'Contact form removed.']];
  const now=L0.slice();const changed=[false,false,false,false];
  CH.forEach(([at,t],i)=>{if(s.yr>=at){now[i]=t;changed[i]=true}});
  let out=heading('Cited version and the page today');
  const page=(x,title,lines,mark,col)=>{let o=R(x,52,260,250,'#fff',col,8)+TBF(x+14,76,title,14,col,'start');lines.forEach((l,i)=>{const y=96+i*48;if(mark[i])o+=R(x+10,y,240,36,C.amberp,'none',4);o+=T6_wrap(l,28).map((ln,k)=>TF(x+18,y+16+k*16,ln,13,C.ink,'start')).join('')});return o};
  out+=page(20,'As cited (year 0)',L0,[0,0,0,0],C.green);
  if(s.arch)out+=page(320,'Archived copy, year 0',L0,[0,0,0,0],C.amber);
  else out+=page(320,`Live page, year ${s.yr}`,now,changed,C.blue);
  const n=changed.filter(Boolean).length;
  out+=R(20,316,560,50,'#f3f7fa','none',8)+TF(36,346,s.arch?'An archive copy (a “memento”) restores what the author actually cited.':n?`${n} of 4 lines changed since citation, and the link still “works”.`:'No change yet: the cited page and the live page agree.',13,s.arch?C.amber:n?C.coral:C.green,'start');
  return {svg:out,phase:s.arch?'The archived copy matches the citation. Memento lets a browser ask for a page as it was on a given date.':n?`After ${s.yr} years the link still opens, but ${n} of 4 lines differ from what was cited. Jones et al. found most cited web pages had changed.`:'At the time of citation the page and the reference agree.'};
 }});

/* ---------------- Embedded markup ---------------- */
SCENE({id:'embedded-markup',name:'Embedded markup',tag:'Nelson’s objection to HTML',
 definition:'HTML mixes instructions into the text itself: tags for bold, headings and links sit between the words. Nelson argued for keeping content and its markup separate, so the same words can carry many layers of formatting, links and comments from different people.',
 example:'To make one word bold in HTML you must edit the document and insert <b> and </b> around it. With separate layers, the words stay untouched and a layer records “characters 5 to 9: bold”.',
 research:'Nelson, T. H. (1997). Embedded markup considered harmful. World Wide Web Journal 2(4), 129–134. Coombs, J. H., Renear, A. H. & DeRose, S. J. (1987). Markup systems and the future of scholarly text processing. Communications of the ACM 30(11), 933–947.',
 desc:'One sentence shown two ways: as an HTML stream with tags inserted between the words, and as plain content with separate markup layers pointing at character ranges.',
 dur:10,hint:'Add bold, a link and a comment, and compare how each design stores them.',
 init:()=>({bold:true,link:false,note:false}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {bold:k>=1,link:k>=2,note:k>=3}},
 ui:[{b:'Bold “every”',act:'bold'},{b:'Link “version”',act:'link'},{b:'Comment on “kept”',act:'note'}],
 on:{bold(s){s.bold=!s.bold;return 'keep'},link(s){s.link=!s.link;return 'keep'},note(s){s.note=!s.note;return 'keep'}},
 draw(s){
  const words='Ted wants every version kept.';
  let html='Ted wants '+(s.bold?'<b>every</b>':'every')+' '+(s.link?'<a href="v.html">version</a>':'version')+' '+(s.note?'<span title="why?">kept</span>':'kept')+'.';
  let out=heading('Markup inside the text, or beside it?');
  out+=TBF(20,62,'Embedded (HTML): one stream of text and tags',14,C.coral,'start');
  const hl=T6_wrap(html.replace(/ /g,' '),48);out+=R(20,72,560,26+hl.length*20,'#fff',C.coralp,8);
  hl.forEach((l,i)=>out+=TMF(32,94+i*20,l,13,C.ink,'start'));
  const y0=110+hl.length*20;
  out+=TBF(20,y0+18,'Separate layers: content untouched, markup points at ranges',14,C.green,'start');
  out+=R(20,y0+28,560,36,'#fff',C.green,8)+TMF(32,y0+52,words,15,C.ink,'start');
  const at=w=>words.indexOf(w),cx=i=>32+i*9;
  const layers=[[s.bold,'bold','every',C.blue],[s.link,'link → v.html','version',C.purple],[s.note,'comment “why?”','kept',C.amber]].filter(a=>a[0]);
  layers.forEach(([_,lab,w,col],i)=>{const y=y0+78+i*30,a=at(w),bx=cx(a),bw=w.length*9;out+=L(bx+bw/2,y,bx+bw/2,y0+64,col,1,'stroke-dasharray="3 3"')+R(bx,y,bw,22,'#fff',col,4)+L(bx+bw,y+11,346,y+11,col,1,'stroke-dasharray="2 3"')+TF(352,y+16,`${lab} (chars ${a}–${a+w.length})`,13,col,'start')});
  const tags=(html.match(/<[^>]+>/g)||[]).length;
  return {svg:out,phase:`The HTML now holds ${tags} tag${tags===1?'':'s'} among the words, and only the document’s owner can add them. The layered version keeps the ${words.length} characters unchanged and adds ${layers.length} separate layer${layers.length===1?'':'s'}, which anyone could add.`};
 }});

SCENE({id:'embedded-markup-overlap',name:'Overlapping structures',tag:'Why tags must nest, and text does not',
 definition:'Embedded tags must nest like boxes inside boxes. Real texts often have structures that overlap: a quotation that runs across two paragraphs, or a sentence that crosses a page break. Separate markup layers can describe overlapping ranges directly.',
 example:'A verse line that starts on one page and ends on the next cannot be both one <line> and split by a <page> boundary without tricks. Scholars encoding manuscripts meet this constantly.',
 research:'Renear, A., Mylonas, E. & Durand, D. (1996). Refining our notion of what text really is: the problem of overlapping hierarchies. In Research in Humanities Computing 4, Oxford University Press. Nelson, T. H. (1997). Embedded markup considered harmful.',
 desc:'A strip of text with two ranges you can move: a quotation and a page. When they overlap without nesting, the nested-tags view shows a broken structure while the layers view shows both ranges.',
 dur:10,hint:'Slide the end of the quotation past the page break and see what happens to each representation.',
 init:()=>({q:14}),
 watch(p){return {q:Math.round(6+p*14)}},
 ui:[{range:'q',label:'Quotation ends at word',min:6,max:20,get:s=>s.q,act:'q',show:v=>v}],
 on:{q(s,v){s.q=Number(v);return 'keep'}},
 draw(s){
  const W='We sat by the window and read until the light failed and the page turned and the story went on'.split(' ').slice(0,20);
  const qa=4,qb=s.q,pg=12; // quotation words qa..qb-1, page break before word pg
  let out=heading('Two structures over the same words');
  const x=i=>24+(i%10)*56,y=i=>86+Math.floor(i/10)*40;
  W.forEach((w,i)=>{const inq=i>=qa&&i<qb;out+=R(x(i),y(i)-18,52,26,inq?C.greenp:'#fff',i>=pg?C.purple:C.line,4)+TF(x(i)+26,y(i),w,13,C.ink)});
  out+=TF(24,58,'green: quotation · purple border: page 2',13,C.muted,'start');
  const cross=qa<pg&&qb>pg;
  out+=TBF(24,190,'Nested tags',14,C.ink,'start');
  const seq=cross?'<page1> … <q> … </page1> <page2> … </q> … </page2>':(qb<=pg?'<page1> … <q> … </q> … </page1> <page2> … </page2>':'<page1> … </page1> <page2> … </page2>');
  out+=R(24,200,552,34,cross?C.coralp:'#fff',cross?C.coral:C.line,6)+TMF(32,222,seq,13,C.ink,'start');
  out+=TF(24,252,cross?'✗ not well formed: </page1> closes before </q>':'✓ well formed: one box inside another',13,cross?C.coral:C.green,'start');
  out+=TBF(24,282,'Separate layers',14,C.ink,'start');
  out+=R(24,292,552,60,'#fff',C.green,6)+TMF(32,316,`quotation: words ${qa+1}–${qb}`,13,C.green,'start')+TMF(32,338,`page 2: words ${pg+1}–20`,13,C.purple,'start');
  out+=TF(300,372,'✓ both ranges recorded, overlap or not',13,C.green);
  return {svg:out,phase:cross?`The quotation (words ${qa+1}–${qb}) crosses the page break at word ${pg+1}. Nested tags cannot express that without splitting one structure; separate layers just record two ranges.`:`The quotation ends at word ${qb}, before the page break, so the structures nest and both representations work.`};
 }});

SCENE({id:'embedded-markup-links',name:'Links anyone can add',tag:'Outside the page, not inside it',
 definition:'Because a web link is written inside its source page, only the page’s owner can add one. In Nelson’s design links are separate objects, so a reader can attach a link or comment to someone else’s document without changing it. Web annotation systems later revived this idea.',
 example:'You spot an error on a public page. On the plain web you cannot attach a correction to it; with an annotation layer you can, and other readers using that layer will see your note in place.',
 research:'Nelson, T. H. (1981). Literary Machines (links as separate objects, made by anyone). W3C (2017). Web Annotation Data Model, Recommendation. NCSA Mosaic’s group annotations (1993) were an early web attempt.',
 desc:'Someone else’s page, and you as a reader trying to attach a correction: on the plain web the attempt is refused; with links as separate objects your note is stored apart and appears beside the text.',
 dur:10,hint:'Try to add a correction to the page in each mode.',
 init:()=>({mode:'web',tried:false}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {mode:k<2?'web':'sep',tried:k%2===1}},
 ui:[{choose:[['web','Links inside pages (web)'],['sep','Links as separate objects']],label:'Design',get:s=>s.mode,act:'mode'},{b:'Attach my correction',act:'try'}],
 on:{mode(s,v){s.mode=v;s.tried=false;return 'keep'},try(s){s.tried=true;return 'keep'}},
 draw(s){
  let out=heading('Can a reader add a link to a page they do not own?');
  out+=R(20,52,330,230,'#fff',C.ink,8)+TBF(34,76,'Someone else’s page',14,C.ink,'start');
  const err=s.tried&&s.mode==='sep';
  if(err)out+=R(28,119,250,24,C.amberp,C.amber,4);
  ['The memex was','described in 1955 by','Vannevar Bush.'].forEach((l,i)=>out+=TF(34,110+i*26,l,15,C.ink,'start'));
  out+=R(380,52,200,230,'#f3f7fa','none',8)+TBF(480,76,'You, a reader',14,C.ink);
  out+=R(396,92,168,60,'#fff',C.line,6)+TF(480,116,'Correction:',13,C.ink)+TF(480,136,'it was 1945',13,C.coral);
  if(s.tried){if(s.mode==='web'){out+=TBF(480,190,'✗ refused',15,C.coral)+TF(480,214,'you cannot edit',13,C.muted)+TF(480,232,'their page',13,C.muted)}
   else{out+=TBF(480,190,'✓ link stored',15,C.green)+TF(480,214,'outside their page;',13,C.muted)+TF(480,232,'shown beside it',13,C.muted)+curveArrow(396,122,280,131,-20,C.amber,2)}}
  out+=R(20,300,560,62,'#f3f7fa','none',8)+TF(36,326,s.mode==='web'?'Web: a link lives in its source page, so only the owner can add it.':'Separate links: anyone may attach a link or note; the page itself is unchanged.',13,C.ink,'start')+TF(36,348,s.mode==='web'?'Readers can only reply elsewhere and hope people find it.':'Readers who view the page with that layer see the note in place.',13,C.muted,'start');
  return {svg:out,phase:s.mode==='web'?(s.tried?'Refused: on the web you can only link from pages you control.':'Press “Attach my correction” to try.'):(s.tried?'Your correction is a separate link object, attached to “described in 1955” and visible to every reader of that layer.':'Press “Attach my correction” to try.')};
 }});

/* ---------------- The curse of Xanadu ---------------- */
const T6_TL=[[1960,'Begins as a Harvard term project'],[1965,'“Hypertext” named in an ACM paper'],[1967,'The name Xanadu adopted'],[1974,'Computer Lib / Dream Machines'],[1981,'Literary Machines published'],[1988,'Autodesk funds the Xanadu company'],[1989,'Berners-Lee proposes the web'],[1992,'Autodesk withdraws'],[1995,'Wired: “The Curse of Xanadu”'],[1999,'Udanax code released'],[2014,'OpenXanadu demo online']];
SCENE({id:'curse-of-xanadu',name:'The curse of Xanadu',tag:'Fifty-four years from idea to demo',
 definition:'Project Xanadu ran from 1960 to the 2014 OpenXanadu demonstration, with long gaps, changing teams and funding that came and went. Its critics called it the longest-running vaporware in computing; Nelson calls it an unfinished design that the industry has still not caught up with.',
 example:'In 1995 Wired called it “the longest-running vaporware story in the history of the computer industry”. Four years later the code was released, and in 2014 a working demonstration went online.',
 research:'Wolf, G. (1995). The curse of Xanadu. Wired 3.06 (June). Nelson, T. H. (2010). Possiplex: Movies, Intellect, Creative Control, My Computer Life and the Fight for Civilization. Barnet, B. (2013). Memory Machines: The Evolution of Hypertext. Anthem Press.',
 desc:'A timeline from 1960 to 2014 with eleven milestones, a cursor you step along, and the web’s arrival marked for comparison.',
 dur:14,hint:'Step through the milestones. Notice how the web arrives in the middle of Xanadu’s history.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(T6_TL.length-1,Math.floor(p*T6_TL.length))}},
 ui:[{b:'◀ Earlier',act:'prev'},{b:'Later ▶',act:'next'}],
 on:{prev(s){s.k=Math.max(0,s.k-1);return 'keep'},next(s){s.k=Math.min(T6_TL.length-1,s.k+1);return 'keep'}},
 draw(s){
  const x=yr=>40+(yr-1958)/(2016-1958)*520;
  let out=heading('Xanadu, 1960–2014');
  out+=L(40,200,560,200,C.line,3);
  for(let yr=1960;yr<=2010;yr+=10)out+=L(x(yr),194,x(yr),206,C.muted,1.5)+TF(x(yr),224,yr,13,C.muted);
  T6_TL.forEach(([yr,t],i)=>{const on=i===s.k,web=yr===1989,c=web?C.blue:C.purple;out+=Ci(x(yr),200,on?10:6,on?c:'#fff',c)});
  const [yr,t]=T6_TL[s.k],web=yr===1989;
  out+=R(clamp(x(yr)-130,20,320),80,260,70,'#fff',web?C.blue:C.purple,8)+TBF(clamp(x(yr)-130,20,320)+130,108,String(yr),18,web?C.blue:C.purple)+TF(clamp(x(yr)-130,20,320)+130,134,t,13,C.ink);
  out+=L(x(yr),150,x(yr),190,web?C.blue:C.purple,1.5,'stroke-dasharray="3 3"');
  out+=R(x(1988),246,x(1992)-x(1988),18,C.purplep,'none',4)+TF(x(1990),282,'funded years',13,C.purple);
  out+=R(x(1991),300,x(2014)-x(1991),18,C.pale,'none',4)+TF(x(2002),336,'the public web',13,C.blue);
  return {svg:out,phase:`${yr}: ${t}. ${yr<1989?'The web does not yet exist.':yr===1989?'The web arrives, simple and unfinished, in the middle of Xanadu’s history.':'By now the web is everywhere, and Xanadu is measured against it.'}`};
 }});

const T6_CLAIMS=[
 {c:'Vaporware',wolf:'The longest-running vaporware story in computing: decades of promises and no product.',nel:'Xanadu was a design to get right, not a product schedule; working versions existed and the ideas still stand.'},
 {c:'The people',wolf:'Dwelt on Nelson’s personality and working habits as part of the explanation.',nel:'Objected strongly to the portrait and published a list of what he called the article’s errors.'},
 {c:'The web',wolf:'The web had made Xanadu’s ambitions largely irrelevant.',nel:'The web is a simplified version of hypertext that discards what mattered: two-way links, transclusion and versions.'},
 {c:'Legacy',wolf:'A cautionary tale of perfectionism.',nel:'Many ideas later appeared piecemeal elsewhere, which shows they were needed.'}];
SCENE({id:'curse-of-xanadu-accounts',name:'Two accounts',tag:'Wolf’s article and Nelson’s reply',
 definition:'Gary Wolf’s 1995 Wired article told Xanadu as a story of brilliant ideas and repeated failure to ship. Nelson rejected much of it and wrote a detailed rebuttal. Both accounts are part of the record, and historians since have taken a more measured view.',
 example:'Wolf focused on missed deadlines and the people involved; Nelson answered that the article was inaccurate and that the design, not the schedule, was the point.',
 research:'Wolf, G. (1995). The curse of Xanadu. Wired 3.06. Nelson, T. H. (1995). Errors in “The Curse of Xanadu”, published in reply. Barnet, B. (2013). Memory Machines, chapter on Xanadu. All points here are paraphrased, not quoted, except Wolf’s widely cited “vaporware” phrase.',
 desc:'Four topics, each with a paraphrase of Wolf’s account on the left and of Nelson’s reply on the right.',
 dur:12,hint:'Choose a topic and read both sides. Where do you think the truth lies?',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:T6_CLAIMS.map((d,i)=>[i,d.c]),label:'Topic',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const d=T6_CLAIMS[s.k];let out=heading('Topic: '+d.c);
  const side=(x,t,txt,c)=>R(x,56,270,250,'#fff',c,10)+TBF(x+135,84,t,15,c)+T6_wrap(txt,30).map((l,i)=>T(x+18,118+i*24,l,14,C.ink,'start')).join('');
  out+=side(20,'Wolf, Wired (1995)',d.wolf,C.coral)+side(310,'Nelson’s reply',d.nel,C.purple);
  out+=TF(300,336,'paraphrased; read both originals before deciding',13,C.muted);
  return {svg:out,phase:`On “${d.c.toLowerCase()}”: Wolf — ${d.wolf} Nelson — ${d.nel}`};
 }});

const T6_IDEAS=[
 {i:'Version history',now:'Git, wiki histories, document editors keep every version',sc:3},
 {i:'Two-way links',now:'Wiki “what links here” and note-app backlinks, inside one system',sc:2},
 {i:'Transclusion',now:'Wiki templates and embeds; rarely across sites',sc:2},
 {i:'Permanent addresses',now:'DOIs, archive copies, content hashes',sc:2},
 {i:'Reader annotation',now:'Web Annotation standard (2017); not built into browsers',sc:1},
 {i:'Micropayment royalties',now:'Largely did not happen; subscriptions instead',sc:0},
 {i:'Visible side-by-side links',now:'Diff and review tools; rare in everyday reading',sc:1}];
SCENE({id:'curse-of-xanadu-ideas',name:'Which ideas came true?',tag:'A scorecard, honestly kept',
 definition:'Many of Xanadu’s ideas reappeared later in other systems, usually in part and inside a single platform rather than across the whole web. Some, like per-reading royalties, mostly did not.',
 example:'Every Wikipedia page has “What links here”, a two-way link view, but only for links within Wikipedia.',
 research:'Barnet, B. (2013). Memory Machines. Nelson, T. H. (1999). Xanalogical structure, needed now more than ever. W3C (2017). Web Annotation Data Model. Scores are this page’s judgement, not measurements.',
 desc:'Seven Xanadu ideas with a bar from not realised to fully realised; choosing one shows where it lives today.',
 dur:12,hint:'Choose each idea to see where it ended up. The legacy era looks at several in depth.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(6,Math.floor(p*7))}},
 ui:[{choose:T6_IDEAS.map((d,i)=>[i,d.i.split(' ')[0]]),label:'Idea',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Xanadu’s ideas today');
  const lab=['not realised','a little','partly','widely'];
  T6_IDEAS.forEach((d,i)=>{const y=52+i*40,on=i===s.k;out+=hit(X,'k',i,d.i,R(16,y,568,34,on?C.pale:'#fff',on?C.blue:C.grid,6)+TBF(26,y+22,d.i,13,C.ink,'start'));
   for(let j=0;j<3;j++)out+=R(250+j*44,y+10,40,14,j<d.sc?[C.coral,C.amber,C.green][d.sc-1]:'#eef2f5','none',3);
   out+=TF(392,y+22,lab[d.sc],13,C.muted,'start')});
  const d=T6_IDEAS[s.k];out+=R(16,336,568,36,'#f3f7fa','none',6)+TF(28,359,d.now,13,C.ink,'start');
  return {svg:out,phase:`${d.i}: ${lab[d.sc]}. ${d.now}.`};
 }});
