/* ===================== Ted Nelson era 4 · Computer Lib (1974) ===================== */
// The two-sided manifesto, its dream media, fantics and virtuality, and thinkertoys. Try it builds each idea.

function T4_wrap(str,n){const out=[];let line='';for(const w of String(str).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
function T4_runs(x,y,runs,size=16,anchor='start'){const all=runs.map(r=>r[0]).join('');return `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${textSize(size,all,x,anchor)}" text-anchor="${anchor}">`+runs.map(([t,fill,b])=>`<tspan fill="${fill||C.ink}"${b?' font-weight="700"':''}>${esc(t)}</tspan>`).join('')+'</text>'}

/* ---------------- Lesson: Computer Lib ---------------- */
const T4_SIDES={
 lib:{title:'Computer Lib',sub:'You can and must understand computers NOW',col:C.coral,topics:[
  ['What computers are','General machines for symbols of every kind, not only arithmetic.'],
  ['Programming for everyone','Languages explained plainly, so a reader can start.'],
  ['Who controls computers','Why the public, not only priests and companies, should decide.'],
  ['Cybercrud','Putting things over on people by blaming “the computer”.']]},
 dream:{title:'Dream Machines',sub:'New freedoms through computer screens',col:C.blue,topics:[
  ['Hypertext and stretchtext','Writing that branches, and text that grows on request.'],
  ['Screens and graphics','Pictures that move and respond: the display as a medium.'],
  ['Branching movies','Film that lets the viewer choose the way through.'],
  ['Fantics','The art of getting ideas across, in mind and in feeling.']]}};
SCENE({id:'computer-lib',name:'Computer Lib / Dream Machines',tag:'A book with two front covers, 1974',
 definition:'In 1974 Nelson self-published Computer Lib / Dream Machines, an oversized book with two front covers. One side argued that ordinary people can and must understand computers; turn it over and the other side imagined what computer media could become.',
 example:'Its layout was hand-assembled, full of drawings, clippings and asides. A revised edition followed from Microsoft Press in 1987.',
 research:'Nelson, T. H. (1974). Computer Lib / Dream Machines. Self-published; revised edition, Microsoft Press, 1987.',
 desc:'A book cover for the chosen side, with the other side shown upside down as its back, and a list of some of that side’s themes; pressing a theme shows a one-line summary.',
 dur:12,hint:'Flip the book over, and press a theme to read what that part argues. These are some of its themes, not a full contents list.',
 init:()=>({side:'lib',open:0}),
 watch(p){const k=Math.min(7,Math.floor(p*8));return {side:k<4?'lib':'dream',open:k%4}},
 ui:[{b:'Flip the book over',act:'flip'}],
 on:{flip(s){s.side=s.side==='lib'?'dream':'lib';s.open=0},open(s,i){s.open=Number(i)}},
 draw(s,f,X){
  const sd=T4_SIDES[s.side],other=T4_SIDES[s.side==='lib'?'dream':'lib'];let out=heading('One book, two front covers');
  out+=R(30,50,230,290,sd.col,'none',6)+R(42,62,206,266,'#fff','none',4);
  out+=TB(145,120,sd.title,22,sd.col)+T4_wrap(sd.sub,20).map((l,i)=>T(145,158+i*20,l,14,C.ink)).join('');
  out+=TF(145,236,'Ted Nelson · 1974',13,C.muted)+L(70,256,220,256,C.grid,1.5);
  out+=TF(145,288,'(the back is '+other.title+',',13,C.muted)+TF(145,306,'printed upside down)',13,C.muted);
  sd.topics.forEach(([t,d],i)=>{const y=58+i*58,on=i===s.open;out+=hit(X,'open',i,'Read: '+t,R(286,y,294,50,on?C.pale:'#fff',on?sd.col:C.grid,8)+TBF(300,y+30,t,14,on?sd.col:C.ink,'start'))});
  const [t,d]=sd.topics[s.open];
  out+=R(286,296,294,52,C.pale,'none',8)+TF(298,316,d.length>44?d.slice(0,d.lastIndexOf(' ',44)):d,13,C.ink,'start')+TF(298,336,d.length>44?d.slice(d.lastIndexOf(' ',44)+1):'',13,C.ink,'start');
  return {svg:out,phase:`${sd.title}: ${t}. ${d} The two halves were meant to be read together: understanding first, then imagination.`};
 }});

const T4_CRUD=[
 {t:'Sorry, the computer won’t let me change it.',v:'crud',why:'Someone chose that rule, and software can be changed.'},
 {t:'The file is 2 GB; the disk holds only 1 GB.',v:'limit',why:'A real physical limit: it will not fit.'},
 {t:'Only our software can read your files.',v:'crud',why:'A business decision about formats, not a law of computing.'},
 {t:'It’s too technical for you to understand.',v:'crud',why:'Nelson’s whole book argues the opposite.'},
 {t:'Sorting a million names takes longer than ten.',v:'limit',why:'More work really does take more time.'},
 {t:'The system decided you don’t qualify.',v:'crud',why:'People wrote the rules the system applies.'}];
SCENE({id:'computer-lib-cybercrud',name:'Cybercrud',tag:'“The computer won’t let me”',
 definition:'Nelson coined “cybercrud” for putting things over on people using computers: blaming the machine for decisions that people made, or using jargon to shut down questions.',
 example:'“The computer won’t let me change your address” usually means “our system was not designed to, and nobody will change it”.',
 research:'Nelson, T. H. (1974). Computer Lib / Dream Machines. Self-published (the term “cybercrud”).',
 desc:'Six things people say about computers, each with two buttons (real limit or cybercrud); after an answer, a tick or cross and the reason appear.',
 dur:12,hint:'For each statement decide: a real limit of computing, or cybercrud? The reasons appear as you answer. Your answers stay on this page.',
 init:()=>({ans:{},last:-1}),
 watch(p){const n=Math.min(6,Math.floor(p*7)),ans={};for(let i=0;i<n;i++)ans[i]=T4_CRUD[i].v;return {ans,last:n-1}},
 ui:[{b:'Clear my answers',act:'clear'}],
 on:{a(s,arg){const [i,v]=String(arg).split(':');s.ans[i]=v;s.last=Number(i)},clear(s){s.ans={};s.last=-1}},
 draw(s,f,X){
  let out=heading('Real limit, or cybercrud?');
  T4_CRUD.forEach((c,i)=>{const y=50+i*50,a=s.ans[i];
   out+=R(20,y,372,42,'#fff',C.grid,8)+TF(32,y+26,c.t,13,C.ink,'start');
   [['limit','limit',C.blue],['crud','crud',C.coral]].forEach(([v,lab,col],j)=>{const x=402+j*72,on=a===v;out+=hit(X,'a',i+':'+v,`${c.t} — ${lab==='crud'?'cybercrud':'real limit'}`,R(x,y,66,42,on?col:'#fff',col,8)+TBF(x+33,y+26,lab,13,on?'#fff':col))});
   if(a)out+=TBF(560,y+28,a===c.v?'✓':'✗',18,a===c.v?C.green:C.coral)});
  const done=Object.keys(s.ans).length,agree=Object.entries(s.ans).filter(([i,v])=>T4_CRUD[i].v===v).length;
  out+=TF(300,366,done?`${agree} of ${done} answered as Nelson would`:'answer any statement',13,C.muted);
  return {svg:out,phase:s.last>=0?`“${T4_CRUD[s.last].t}” — ${T4_CRUD[s.last].v==='crud'?'cybercrud':'a real limit'}. ${T4_CRUD[s.last].why}`:'Four of these six hide a human decision behind the machine.'};
 }});

const T4_MEDIA={
 text:{label:'Text',show:'Hi!',nums:[72,105,33],how:'each character is a code number (here ASCII/Unicode)'},
 picture:{label:'Picture',grid:[0,9,9,0,9,3,3,9,9,3,3,9,0,9,9,0],nums:[0,9,9,0,'…'],how:'each dot is a number for its shade (0 light, 9 dark)'},
 music:{label:'Music',notes:[60,64,67],nums:[60,64,67],how:'each note is a pitch number (MIDI: middle C = 60)'},
 numbers:{label:'Numbers',show:'3 + 4',nums:[3,4,7],how:'numbers stay numbers; the sum is 7'}};
SCENE({id:'computer-lib-everything',name:'Not just arithmetic',tag:'One machine for every kind of symbol',
 definition:'A central claim of Computer Lib is that computers are not mathematical machines but general machines for symbols: text, pictures and sound become numbers that the same machine stores, moves and shows.',
 example:'Ada Lovelace made a similar point in 1843: the Analytical Engine might compose music if notes were expressed in its notation.',
 research:['Nelson, T. H. (1974). Computer Lib / Dream Machines.','Lovelace, A. A. (1843). Notes to Menabrea’s Sketch of the Analytical Engine. Scientific Memoirs 3 (Note A).'],
 desc:'A chosen medium (text, picture, music or numbers) shown on the left, the numbers that represent it in the middle, and the same three machine operations, store, move and show, on the right.',
 dur:12,hint:'Choose a medium and see it become numbers. The operations on the right stay the same whatever you choose.',
 init:()=>({m:'text'}),
 watch(p){return {m:['text','picture','music','numbers'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.entries(T4_MEDIA).map(([k,v])=>[k,v.label]),label:'Medium',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v}},
 draw(s){
  const m=T4_MEDIA[s.m];let out=heading('Text, pictures and sound all become numbers');
  out+=R(20,56,190,200,'#fff',C.grid,10)+TBF(115,80,m.label,15,C.ink);
  if(m.grid)m.grid.forEach((v,i)=>out+=R(67+(i%4)*24,100+Math.floor(i/4)*24,22,22,`rgb(${255-v*25},${255-v*25},${255-v*22})`,C.grid,2));
  else if(m.notes){out+=range(5).map(i=>L(40,124+i*12,190,124+i*12,C.line,1.2)).join('');m.notes.forEach((n,i)=>{const y=184-(n-60)*3.4;out+=`<ellipse cx="${80+i*44}" cy="${fmt(y)}" rx="8" ry="6" fill="${C.ink}" transform="rotate(-20 ${80+i*44} ${fmt(y)})"/>`+L(88+i*44,y,88+i*44,y-34,C.ink,1.6)});out+=L(68,184,92,184,C.ink,1.2)}
  else out+=TB(115,170,m.show,32,C.ink);
  out+=arrow(214,156,252,156,C.blue,2.5);
  out+=R(256,56,140,200,C.pale,'none',10)+TBF(326,80,'numbers',14,C.ink);
  m.nums.forEach((n,i)=>out+=TMF(326,114+i*28,String(n),17,C.blue));
  out+=arrow(400,156,436,156,C.blue,2.5);
  ['store','move','show'].forEach((op,i)=>out+=R(440,64+i*64,140,52,'#fff',C.green,8)+TBF(510,95+i*64,op,15,C.green));
  out+=TF(300,288,m.how,14,C.ink)+TF(300,312,'the machine does the same three things whatever the numbers mean',13,C.muted);
  return {svg:out,phase:`${m.label}: ${m.how}. The meaning lives in how we read the numbers, which is why Nelson said computers are for everybody, not only for mathematicians.`};
 }});

/* ---------------- Lesson: Dream Machines ---------------- */
const T4_MOVIE={0:{t:'Arrive at the library',c:[1,2]},1:{t:'The map room',c:[3,4]},2:{t:'The music room',c:[5,6]},3:{t:'Old sea charts',c:[]},4:{t:'Star charts',c:[]},5:{t:'Recordings',c:[]},6:{t:'Printed scores',c:[]}};
const T4_MPOS={0:[440,70],1:[365,170],2:[515,170],3:[330,280],4:[400,280],5:[480,280],6:[550,280]};
SCENE({id:'dream-machines',name:'Branching movies',tag:'Dream Machines: media that let you choose',
 definition:'The Dream Machines half imagined new computer media. One was the branching movie: a film made of segments joined at choice points, so each viewer can take a different way through.',
 example:'Start at the library entrance and choose a room, then a shelf. Every path is a complete short film; nobody needs to see all of them.',
 research:'Nelson, T. H. (1974). Computer Lib / Dream Machines. Self-published (Dream Machines side).',
 desc:'A film strip of the segments watched so far, the current segment’s choices as buttons, and a tree of all seven segments with the chosen path highlighted.',
 dur:10,hint:'Press a choice to continue the film. Press Reset and take a different branch.',
 init:()=>({path:[0]}),
 watch(p){const k=Math.min(2,Math.floor(p*3)),alt=p>.66;return {path:[0,alt?2:1,alt?6:3].slice(0,k+1)}},
 ui:[],
 on:{pick(s,n){s.path.push(Number(n))},reset(s){s.path=[0]}},
 draw(s,f,X){
  const cur=s.path[s.path.length-1],node=T4_MOVIE[cur];let out=heading('A film with choice points');
  s.path.forEach((n,i)=>{const x=24+i*92;out+=R(x,56,86,62,'#1f2a30','none',4)+range(4).map(k=>R(x+6+k*20,60,10,6,'#fff','none',1)+R(x+6+k*20,110,10,6,'#fff','none',1)).join('')+TF(x+43,94,String(i+1),15,'#fff')});
  out+=R(20,134,280,70,'#fff',C.grid,8)+TBF(34,162,node.t,16,C.ink,'start')+TF(34,186,`segment ${s.path.length} of 3`,13,C.muted,'start');
  if(node.c.length)node.c.forEach((c,i)=>out+=hit(X,'pick',c,'Choose: '+T4_MOVIE[c].t,R(20+i*144,218,136,46,C.pale,C.blue,8)+TF(88+i*144,246,'→ '+T4_MOVIE[c].t,13,C.blue)));
  else out+=R(20,218,280,46,C.greenp,'none',8)+TF(160,246,'The end: a complete film',14,C.green);
  for(const [id,n] of Object.entries(T4_MOVIE))for(const c of n.c)out+=L(T4_MPOS[id][0],T4_MPOS[id][1],T4_MPOS[c][0],T4_MPOS[c][1],s.path.includes(Number(id))&&s.path.includes(c)?C.coral:C.grid,s.path.includes(Number(id))&&s.path.includes(c)?3:1.5);
  for(const [id,p] of Object.entries(T4_MPOS)){const on=s.path.includes(Number(id));out+=Ci(p[0],p[1],15,on?C.coral:'#fff',on?C.coral:C.line)+TF(p[0],p[1]+5,String(Number(id)+1),13,on?'#fff':C.ink)}
  out+=TF(440,320,'7 segments, 4 different films',13,C.muted);
  return {svg:out,phase:`You have watched ${s.path.length} segment${s.path.length===1?'':'s'}: ${s.path.map(n=>T4_MOVIE[n].t).join(' → ')}. The author writes the branches; the viewer chooses among them.`};
 }});

const T4_HG=[{t:'Library',parts:['Floor 1','Floor 2','Floor 3']},{t:'Floor',parts:['Shelf A','Shelf B','Shelf C','Shelf D']},{t:'Shelf',parts:['Book 1','Book 2','Book 3','Book 4','Book 5']},{t:'Book',parts:[]}];
SCENE({id:'dream-machines-hypergram',name:'Hypergrams',tag:'Pictures that branch',
 definition:'A hypergram, in Nelson’s terms, is a picture that branches or performs on request: press part of it and it opens into a more detailed picture, as hypertext opens into more text.',
 example:'Press a floor of the library, then a shelf, then a book. Each press is a branch in a picture rather than in prose.',
 research:'Nelson, T. H. (1974). Computer Lib / Dream Machines. Self-published (hypergrams).',
 desc:'A picture at one of four depths (library, floor, shelf, book) whose parts can be pressed to open the next picture, with a trail of where you are.',
 dur:10,hint:'Press part of the picture to open it. Use Back to go up a level.',
 init:()=>({trail:[]}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {trail:[1,2,2].slice(0,k)}},
 ui:[{b:'◀ Back',act:'back'}],
 on:{go(s,i){if(s.trail.length<3)s.trail.push(Number(i))},back(s){s.trail.pop()},reset(s){s.trail=[]}},
 draw(s,f,X){
  const d=s.trail.length,lv=T4_HG[d];let out=heading('Press part of the picture to open it');
  const crumbs=['Library'].concat(s.trail.map((t,i)=>T4_HG[i].parts[t]));
  out+=TF(30,64,crumbs.join('  ›  '),14,C.blue,'start');
  if(d===0){out+=P('M120 110 L300 70 L480 110 Z',C.ink,2,C.pale);lv.parts.forEach((p,i)=>{const y=246-i*62;out+=hit(X,'go',i,'Open '+p,R(140,y,320,56,'#fff',C.ink,4)+TF(300,y+33,p,15,C.ink))})}
  else if(d===1){out+=R(60,90,480,240,'#fff',C.ink,6);lv.parts.forEach((p,i)=>{const x=80+i*116;out+=hit(X,'go',i,'Open '+p,R(x,120,100,190,C.amberp,C.amber,4)+TF(x+50,220,p,14,C.ink))})}
  else if(d===2){out+=R(60,110,480,170,'#8a5a32','none',6);lv.parts.forEach((p,i)=>{const x=86+i*90,h=120+(i%3)*18;out+=hit(X,'go',i,'Open '+p,R(x,270-h,64,h,[C.blue,C.green,C.coral,C.purple,C.amber][i],'none',3)+TF(x+32,275-h/2,p,13,'#fff'))})}
  else{const b=T4_HG[2].parts[s.trail[2]];out+=R(120,90,360,230,'#fff',C.ink,4)+L(300,90,300,320,C.grid,1.5)+TBF(210,140,b,18,C.ink)+range(5).map(i=>R(140,170+i*22,140-(i*17)%50,8,C.grid,'none',3)).join('')+range(6).map(i=>R(320,120+i*22,140-(i*23)%60,8,C.grid,'none',3)).join('')}
  out+=TF(300,352,`depth ${d} of 3`,13,C.muted);
  return {svg:out,phase:d<3?`You are at: ${crumbs.join(' › ')}. Each part of the picture is a branch to a more detailed picture.`:`Opened ${crumbs.join(' › ')}. Today’s zoomable maps and clickable diagrams are hypergrams in all but name.`};
 }});

const T4_DATES=[
 {y:1975,t:'Altair 8800 kit',d:'A computer for individuals, sold as a kit (Popular Electronics, January 1975).'},
 {y:1977,t:'Apple II and others',d:'Ready-made personal computers for homes and schools.'},
 {y:1987,t:'HyperCard',d:'Hypertext for ordinary users, bundled with Macintosh computers.'},
 {y:1991,t:'World Wide Web',d:'Linked documents across the internet, open to anyone.'},
 {y:1993,t:'Mosaic browser',d:'Pictures and text together on web pages, easy to install.'},
 {y:1995,t:'WikiWikiWeb',d:'Pages any reader can edit, joined by links.'},
 {y:2001,t:'Wikipedia',d:'A shared encyclopedia that keeps every version of every page.'}];
SCENE({id:'dream-machines-dates',name:'From dream to everyday',tag:'How long the dreams took',
 definition:'Many things Dream Machines described in 1974 became everyday decades later, some in forms Nelson criticised. Measuring the gap shows how far ahead the book was.',
 example:'Personal computers arrived within a year; hypertext for ordinary users took 13 years; a worldwide hypertext 17.',
 research:['Nelson, T. H. (1974). Computer Lib / Dream Machines.','Roberts, H. E. & Yates, W. (1975). Altair 8800 minicomputer. Popular Electronics 7(1).','Berners-Lee, T. (1991). WorldWideWeb: summary. Posted to alt.hypertext, 6 August 1991.'],
 desc:'A timeline from 1974 to 2005 with seven milestones; pressing one shows how many years it came after Computer Lib and what it made real.',
 dur:12,hint:'Press a milestone to see the gap from 1974 and which dream it made ordinary.',
 init:()=>({sel:3}),
 watch(p){return {sel:Math.min(6,Math.floor(p*7))}},
 ui:[],
 on:{sel(s,i){s.sel=Number(i)}},
 draw(s,f,X){
  let out=heading('Years from Computer Lib (1974) to everyday use');
  const x=y=>40+(y-1974)/31*520,ay=112;
  out+=L(40,ay,560,ay,C.line,3);[1980,1990,2000].forEach(y=>out+=L(x(y),ay-5,x(y),ay+5,C.muted,1.5));
  out+=Ci(x(1974),ay,8,C.coral)+TBF(x(1974),ay-16,'1974',13,C.coral);
  T4_DATES.forEach((m,i)=>{const on=i===s.sel,up=i%2===1;out+=Ci(x(m.y),ay,on?8:6,on?C.blue:'#fff',C.blue)+TF(x(m.y),up?ay-16:ay+26,String(m.y),13,on?C.blue:C.muted)});
  T4_DATES.forEach((m,i)=>{const on=i===s.sel,bx=20+(i%4)*142,by=156+Math.floor(i/4)*62;
   out+=hit(X,'sel',i,`${m.t}, ${m.y}`,R(bx,by,134,52,on?C.blue:'#fff',on?C.blue:C.line,8)+TF(bx+67,by+22,m.t,13,on?'#fff':C.ink)+TBF(bx+67,by+42,String(m.y),13,on?'#fff':C.muted))});
  const m=T4_DATES[s.sel];out+=R(40,296,520,62,C.pale,'none',8)+TBF(56,322,`${m.t}: ${m.y-1974} year${m.y-1974===1?'':'s'} after Computer Lib`,14,C.ink,'start')+TF(56,344,m.d,13,C.ink,'start');
  return {svg:out,phase:`${m.t} (${m.y}), ${m.y-1974} year${m.y-1974===1?'':'s'} after 1974. ${m.d}`};
 }});

/* ---------------- Lesson: Fantics ---------------- */
SCENE({id:'fantics',name:'Fantics',tag:'The art of getting ideas across',
 definition:'Nelson’s word “fantics” names the art and science of presenting ideas, in both their understanding and their feeling: the showmanship and structure of how something is put across, on paper or on a screen.',
 example:'Later experiments on learning from multimedia tested some of these instincts: a relevant picture, clear signals of structure and no decorative clutter all tend to help.',
 research:['Nelson, T. H. (1974). Computer Lib / Dream Machines (fantics).','Mayer, R. E. (2009). Multimedia Learning, 2nd edn. Cambridge University Press (multimedia, signalling and coherence principles).'],
 desc:'A small explanation card about tides that changes as three presentation choices are switched on: a relevant diagram, headings that signal structure, and removal of decoration.',
 dur:12,hint:'Switch each choice on and off and compare the card. The principles are from Mayer’s experiments; this card is only an example.',
 init:()=>({pic:false,sig:false,clean:false}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {pic:k>=1,sig:k>=2,clean:k>=3}},
 ui:[{b:'Relevant picture on/off',act:'pic'},{b:'Signal the structure on/off',act:'sig'},{b:'Remove decoration on/off',act:'clean'}],
 on:{pic(s){s.pic=!s.pic},sig(s){s.sig=!s.sig},clean(s){s.clean=!s.clean}},
 draw(s){
  let out=heading('Same facts, different presentation');
  out+=R(20,48,370,300,s.clean?'#fff':'#fff7e6',s.clean?C.grid:C.amber,10);
  if(!s.clean){out+=range(6).map(i=>`<text x="${40+i*60}" y="${70+(i%2)*270}" font-size="18" fill="${C.amber}" opacity=".5">★</text>`).join('')+TF(330,92,'Fun fact!',13,C.purple)}
  let y=86;
  if(s.sig){out+=TBF(40,y,'Why the sea rises and falls',16,C.ink,'start');y+=26}
  const body=['The Moon’s gravity pulls the sea into','two bulges, so most coasts get two','high tides a day.'];
  if(s.sig)out+=TBF(40,y,'1  The cause',13,C.blue,'start'),y+=20;
  body.forEach(l=>{out+=TF(40,y,l,14,C.ink,'start');y+=20});
  if(s.sig){y+=6;out+=TBF(40,y,'2  The biggest tides',13,C.blue,'start');y+=20}
  ['When Sun and Moon line up, tides are','largest: spring tides.'].forEach(l=>{out+=TF(40,y,l,14,C.ink,'start');y+=20});
  if(s.pic){const cx=200,cy=y+44;out+=`<ellipse cx="${cx}" cy="${fmt(cy)}" rx="62" ry="40" fill="${C.pale}" stroke="${C.blue}"/>`+Ci(cx,cy,28,C.green)+Ci(cx+150,cy,10,'#c8ced2')+TF(cx+150,cy+26,'Moon',13,C.muted)+TF(cx-80,cy+4,'bulge',13,C.blue,'end')+TF(cx+70,cy+4,'bulge',13,C.blue,'start')}
  const rows=[['Relevant picture','multimedia principle',s.pic],['Signal the structure','signalling principle',s.sig],['Remove decoration','coherence principle',s.clean]];
  out+=R(406,48,174,300,C.pale,'none',10)+TBF(420,74,'Mayer’s principles',14,C.ink,'start');
  rows.forEach(([a,b,on],i)=>out+=R(418,90+i*80,150,72,on?'#fff':'transparent',on?C.green:C.line,8)+TBF(430,114+i*80,a,13,on?C.green:C.muted,'start')+TF(430,134+i*80,b,13,C.ink,'start')+TF(430,153+i*80,on?'on':'off',13,on?C.green:C.muted,'start'));
  const n=rows.filter(r=>r[2]).length;
  return {svg:out,phase:`${n} of 3 presentation choices on. Nelson argued presentation is not decoration but part of the idea; Mayer’s experiments found these three choices usually improve what learners can explain afterwards.`};
 }});

const T4_VIRT={
 cmd:{label:'Typed commands',acts:['> find tides','> open 2','> link 2 5']},
 cards:{label:'Cards on a desk',acts:['look over the cards','pick up card 2','draw a line to card 5']},
 talk:{label:'Spoken requests',acts:['“Find my notes on tides”','“Open the second one”','“Connect it to card five”']}};
SCENE({id:'fantics-virtuality',name:'Virtuality',tag:'What the system seems to be',
 definition:'Nelson used “virtuality” for the conceptual structure and feel of a system as the user experiences it, as opposed to how it is built. The same machinery can present very different virtualities.',
 example:'A note system could look like typed commands, cards on a desk or a conversation. Underneath, the same three operations run: find, open and link.',
 research:'Nelson, T. H. (1980). Interactive systems and the design of virtuality. Creative Computing 6(11), 56–62, and 6(12).',
 desc:'Above, the chosen front end showing three user actions; below, the same three operations in the machinery, with lines joining each action to its operation.',
 dur:12,hint:'Choose a virtuality and press an operation to see how each front end expresses it.',
 init:()=>({v:'cards',op:0}),
 watch(p){const k=Math.min(8,Math.floor(p*9));return {v:['cmd','cards','talk'][Math.floor(k/3)],op:k%3}},
 ui:[{choose:Object.entries(T4_VIRT).map(([k,v])=>[k,v.label]),label:'Virtuality',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=v},op(s,i){s.op=Number(i)}},
 draw(s,f,X){
  const v=T4_VIRT[s.v];let out=heading('One machine, many virtualities');
  out+=R(20,48,560,130,'#fff',C.grid,10)+TBF(36,72,'What you see: '+v.label,14,C.blue,'start');
  v.acts.forEach((a,i)=>{const x=36+i*184,on=i===s.op;out+=R(x,88,172,72,on?C.pale:'#f8fafb',on?C.blue:C.grid,8)+(s.v==='cmd'?TMF(x+10,130,a,14,C.ink,'start'):TF(x+86,130,a,13,C.ink))});
  const ops=['find','open','link'];
  ops.forEach((o,i)=>{const x=36+i*184,on=i===s.op;out+=L(x+86,160,x+86,226,on?C.blue:C.grid,on?3:1.5,on?'':'stroke-dasharray="4 4"');out+=hit(X,'op',i,'Operation: '+o,R(x,226,172,56,on?C.green:'#fff',C.green,8)+TBF(x+86,260,o,16,on?'#fff':C.green))});
  out+=R(20,212,560,86,'transparent',C.line,10,'stroke-dasharray="6 5"')+TF(300,318,'the machinery underneath: identical for every virtuality',13,C.muted);
  return {svg:out,phase:`${v.label}: “${v.acts[s.op]}” performs the operation “${ops[s.op]}”. Nelson’s point: designing the virtuality, what the user believes they are working with, is the real design task.`};
 }});

const T4_FEAT=[['Type and delete text',2,0],['Save and open',1,0],['Follow a link',1,0],['Make a link',2,0],['Compare two versions',3,0],['Styles and templates',4,1],['Mail merge',5,1],['Macros',6,1]];
SCENE({id:'fantics-ten-minutes',name:'The ten-minute rule',tag:'If it cannot be taught quickly, it is too complicated',
 definition:'Nelson proposed a rule of thumb: a system that a tutor cannot teach to a newcomer in about ten minutes, with the system in front of them, is too complicated.',
 example:'Every feature adds teaching time. One remedy, tested by Carroll and Carrithers, is a “training wheels” mode that blocks advanced features until the basics are learned.',
 research:['Nelson, T. H. (1974). Computer Lib / Dream Machines (the ten-minute rule).','Carroll, J. M. & Carrithers, C. (1984). Training wheels in a user interface. Communications of the ACM 27(8), 800–806.'],
 desc:'Eight features of an editor that can be switched on, with a bar of estimated teaching time against a ten-minute line; a training-wheels option counts only the basic features. Minutes are illustrative.',
 dur:12,hint:'Switch features on and watch the teaching time pass ten minutes. Then turn on training wheels. Minutes per feature are illustrative.',
 init:()=>({on:[0,1,2],wheels:false}),
 watch(p){const k=Math.min(8,Math.floor(p*9));return {on:range(Math.min(8,k)),wheels:k===8}},
 ui:[{b:'Training wheels on/off',act:'wheels'},{b:'All features',act:'all'},{b:'Basics only',act:'basic'}],
 on:{f(s,i){i=Number(i);s.on=s.on.includes(i)?s.on.filter(x=>x!==i):s.on.concat(i)},wheels(s){s.wheels=!s.wheels},all(s){s.on=range(8)},basic(s){s.on=[0,1,2]}},
 draw(s,f,X){
  let out=heading('Every feature adds teaching time');
  T4_FEAT.forEach(([t,m,adv],i)=>{const y=48+i*36,on=s.on.includes(i),blocked=adv&&s.wheels;
   out+=hit(X,'f',i,(on?'Remove ':'Add ')+t,R(20,y,280,30,on?(blocked?'#f1f1f1':C.pale):'#fff',on?(blocked?C.line:C.blue):C.grid,6)+TF(32,y+20,t,13,blocked?C.muted:C.ink,'start')+TF(288,y+20,blocked?'blocked':m+' min',13,blocked?C.muted:on?C.blue:C.muted,'end'))});
  const tot=s.on.reduce((a,i)=>a+(T4_FEAT[i][2]&&s.wheels?0:T4_FEAT[i][1]),0),sc=200/24,base=340;
  out+=L(330,base,580,base,C.line,2);
  out+=R(400,base-tot*sc,90,tot*sc,tot>10?C.coral:C.green,'none',4)+TBF(498,base-tot*sc+18,tot+' min',15,tot>10?C.coral:C.green,'start');
  out+=L(340,base-10*sc,570,base-10*sc,C.ink,2,'stroke-dasharray="6 4"')+TF(570,base-10*sc-6,'10 minutes',13,C.ink,'end');
  out+=TF(445,base+20,s.wheels?'training wheels on':'all switched-on features',13,C.muted);
  return {svg:out,phase:tot>10?`About ${tot} minutes to teach: too complicated by Nelson’s rule.${s.wheels?'':' Training wheels would hide the advanced features at first.'}`:`About ${tot} minutes: within the rule.${s.wheels?' In Carroll and Carrithers’s study, newcomers with training wheels got started faster and made fewer errors.':''}`};
 }});

/* ---------------- Lesson: Thinkertoys ---------------- */
const T4_DA='Hypertext lets every reader follow a different path through the same material.'.split(' ');
const T4_DB='Hypertext lets each reader choose a path through connected material.'.split(' ');
function T4_hunks(a,b){const n=a.length,m=b.length,L=range(n+1).map(()=>new Array(m+1).fill(0));for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=a[i]===b[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 const out=[];let i=0,j=0,ca=[],cb=[];const flush=()=>{if(ca.length||cb.length){out.push({a:ca,b:cb});ca=[];cb=[]}};
 while(i<n||j<m){if(i<n&&j<m&&a[i]===b[j]){flush();out.push({same:a[i]});i++;j++}else if(j<m&&(i>=n||L[i][j+1]>=L[i+1][j])){cb.push(b[j]);j++}else{ca.push(a[i]);i++}}flush();return out}
const T4_H=T4_hunks(T4_DA,T4_DB),T4_DIFFS=T4_H.filter(h=>!h.same);
SCENE({id:'thinkertoys',name:'Thinkertoys',tag:'Tools for thinking through alternatives',
 definition:'Nelson’s “thinkertoys” are computer tools that help people think about complex alternatives: seeing versions side by side, with their differences and connections visible, and choosing among them.',
 example:'Two drafts of one sentence differ in four places. See each difference, choose which wording to keep, and the merged sentence assembles itself.',
 research:['Nelson, T. H. (1974). Computer Lib / Dream Machines (thinkertoys).','Hunt, J. W. & McIlroy, M. D. (1976). An algorithm for differential file comparison. Bell Laboratories Computing Science Technical Report 41.'],
 desc:'Two drafts with their differing words highlighted, one row per difference with a choice of A or B, and the merged sentence built from the choices.',
 dur:12,hint:'For each difference press A or B. The merged sentence on the right updates as you choose.',
 init:()=>({pick:T4_DIFFS.map(()=>'b')}),
 watch(p){const k=Math.min(T4_DIFFS.length,Math.floor(p*(T4_DIFFS.length+1)));return {pick:T4_DIFFS.map((_,i)=>i<k?(i%2?'a':'b'):'a')}},
 ui:[{b:'All from A',act:'all',arg:'a'},{b:'All from B',act:'all',arg:'b'}],
 on:{p(s,arg){const [i,v]=String(arg).split(':');s.pick[Number(i)]=v},all(s,v){s.pick=T4_DIFFS.map(()=>v)}},
 draw(s,f,X){
  let out=heading('See the differences, then choose');
  const line=(lab,col,which,y)=>{const runs=[];T4_H.forEach(h=>{if(h.same)runs.push([h.same+' ',C.ink,false]);else{const w=h[which];if(w.length)runs.push([w.join(' ')+' ',col,true])}});
   const words=[];let cur=[],len=0;runs.forEach(r=>{if(len+r[0].length>48){words.push(cur);cur=[];len=0}cur.push(r);len+=r[0].length});words.push(cur);
   out+=TBF(30,y,lab,14,col,'start');words.forEach((ln,k)=>out+=T4_runs(30,y+22+k*22,ln,15))};
  line('Draft A',C.coral,'a',62);line('Draft B',C.blue,'b',138);
  T4_DIFFS.forEach((h,i)=>{const y=212+i*40;out+=TF(30,y+20,`${i+1}.`,13,C.muted,'start');
   [['a',C.coral],['b',C.blue]].forEach(([v,col],j)=>{const x=56+j*170,on=s.pick[i]===v,txt=h[v].length?h[v].join(' '):'(nothing)';out+=hit(X,'p',i+':'+v,`Difference ${i+1}: keep ${v.toUpperCase()}`,R(x,y,160,32,on?col:'#fff',col,6)+TF(x+80,y+21,(v.toUpperCase()+': '+txt).slice(0,24),13,on?'#fff':col))})});
  const merged=[];let k=0;T4_H.forEach(h=>{if(h.same)merged.push(h.same);else{merged.push(...h[s.pick[k]]);k++}});
  const ml=T4_wrap(merged.join(' '),22);
  out+=R(410,206,170,150,C.greenp,'none',8)+TBF(422,228,'Merged',14,C.green,'start');ml.slice(0,5).forEach((l,i)=>out+=TF(422,252+i*20,l,13,C.ink,'start'));
  return {svg:out,phase:`${T4_DIFFS.length} differences. Merged: “${merged.join(' ')}” Comparing alternatives side by side, with the connections visible, was the heart of what Nelson wanted computers to do for writers.`};
 }});

const T4_ALT=[['Opening','a story','a question'],['Middle','a live demo','slides'],['Ending','a summary','a challenge']];
SCENE({id:'thinkertoys-alternatives',name:'Envisioning alternatives',tag:'Every combination, side by side',
 definition:'Thinkertoys aim to let you see all the alternatives of a decision, not just the one in front of you, and compare any two directly.',
 example:'Planning a talk with three choices of two options each gives eight possible talks. Pin any two to compare them part by part.',
 research:'Nelson, T. H. (1974). Computer Lib / Dream Machines (thinkertoys and alternatives).',
 desc:'Eight possible plans for a talk drawn as a grid of cards; two pinned plans are compared row by row, with differences highlighted.',
 dur:12,hint:'Press two plans to pin them; the comparison shows where they differ. Press a pinned plan to unpin it.',
 init:()=>({pins:[0,5]}),
 watch(p){const seq=[[0],[0,7],[3,4],[2,6]];return {pins:seq[Math.min(3,Math.floor(p*4))]}},
 ui:[{b:'Clear pins',act:'clear'}],
 on:{pin(s,i){i=Number(i);if(s.pins.includes(i))s.pins=s.pins.filter(x=>x!==i);else{s.pins.push(i);if(s.pins.length>2)s.pins.shift()}},clear(s){s.pins=[]}},
 draw(s,f,X){
  let out=heading('Eight possible talks: compare any two');
  const opt=(n,r)=>T4_ALT[r][1+((n>>(2-r))&1)];
  range(8).forEach(n=>{const x=20+(n%4)*92,y=50+Math.floor(n/4)*126,on=s.pins.includes(n);
   out+=hit(X,'pin',n,`Plan ${n+1}: ${range(3).map(r=>opt(n,r)).join(', ')}`,R(x,y,86,118,on?C.pale:'#fff',on?C.blue:C.grid,8)+TBF(x+43,y+20,'Plan '+(n+1),13,on?C.blue:C.ink)+range(3).map(r=>TF(x+43,y+46+r*24,opt(n,r),13,C.ink)).join(''))});
  out+=R(392,50,188,244,C.pale,'none',10);
  if(s.pins.length===2){const [a,b]=s.pins;out+=TBF(486,74,`Plan ${a+1} vs Plan ${b+1}`,14,C.ink);
   T4_ALT.forEach((row,r)=>{const y=96+r*64,da=opt(a,r),db=opt(b,r),diff=da!==db;out+=TF(404,y+12,row[0],13,C.muted,'start')+R(404,y+18,80,30,diff?C.coralp:'#fff','none',6)+TF(444,y+38,da,13,C.ink)+R(490,y+18,80,30,diff?C.coralp:'#fff','none',6)+TF(530,y+38,db,13,C.ink)})}
  else out+=TF(486,170,'pin two plans',14,C.muted);
  const nd=s.pins.length===2?range(3).filter(r=>opt(s.pins[0],r)!==opt(s.pins[1],r)).length:0;
  out+=TF(300,346,'2 × 2 × 2 = 8 alternatives',13,C.muted);
  return {svg:out,phase:s.pins.length===2?`Plans ${s.pins[0]+1} and ${s.pins[1]+1} differ in ${nd} of 3 parts. Seeing every alternative at once is what paper makes hard and a thinkertoy makes easy.`:'Pin two plans to compare them.'};
 }});

const T4_TODAY=[
 {t:'Version control',y:'1972–75',ex:'SCCS at Bell Labs',idea:'Keep every version, and recover any of them.'},
 {t:'diff',y:'1974–76',ex:'Unix diff (Hunt & McIlroy)',idea:'Show exactly where two texts differ.'},
 {t:'Spreadsheet',y:'1979',ex:'VisiCalc',idea:'Change one figure and see every consequence: “what if?”.'},
 {t:'Mind maps',y:'1974',ex:'Buzan, Use Your Head',idea:'Draw ideas as a network, not a list.'},
 {t:'Page history',y:'2001',ex:'Wikipedia',idea:'Every version of a public page kept and comparable.'},
 {t:'Suggested edits',y:'1990s–',ex:'word processors',idea:'Alternatives shown in place, accepted one by one.'}];
SCENE({id:'thinkertoys-today',name:'Thinkertoys today',tag:'Where the ideas went',
 definition:'Several everyday tools do part of what Nelson’s thinkertoys described: keeping versions, showing differences, exploring “what if”, and drawing ideas as networks. None does all of it in one place.',
 example:'A spreadsheet answers “what if?” instantly; a diff shows two texts’ differences; a wiki keeps every version. Nelson wanted all of these joined together.',
 research:['Rochkind, M. J. (1975). The Source Code Control System. IEEE Transactions on Software Engineering SE-1(4), 364–370.','Hunt, J. W. & McIlroy, M. D. (1976). An algorithm for differential file comparison.','Grad, B. (2007). The creation and the demise of VisiCalc. IEEE Annals of the History of Computing 29(3).','Buzan, T. (1974). Use Your Head. BBC Books.'],
 desc:'Six cards for later tools, each with a date and example; pressing one shows which thinkertoy idea it carries.',
 dur:12,hint:'Press a card to see which part of the thinkertoy idea it carries.',
 init:()=>({sel:0}),
 watch(p){return {sel:Math.min(5,Math.floor(p*6))}},
 ui:[],
 on:{sel(s,i){s.sel=Number(i)}},
 draw(s,f,X){
  let out=heading('Pieces of the thinkertoy idea in later tools');
  T4_TODAY.forEach((c,i)=>{const x=20+(i%3)*190,y=50+Math.floor(i/3)*112,on=i===s.sel;
   out+=hit(X,'sel',i,`${c.t}, ${c.y}`,R(x,y,180,100,on?C.pale:'#fff',on?C.blue:C.grid,10)+TBF(x+14,y+30,c.t,15,on?C.blue:C.ink,'start')+TF(x+14,y+54,c.y,13,C.muted,'start')+TF(x+14,y+78,c.ex,13,C.ink,'start'))});
  const c=T4_TODAY[s.sel];
  out+=R(20,286,560,64,C.greenp,'none',10)+TBF(36,312,c.t+' carries:',14,C.green,'start')+TF(36,336,c.idea,14,C.ink,'start');
  return {svg:out,phase:`${c.t} (${c.y}, ${c.ex}): ${c.idea} Nelson’s complaint was that these arrived as separate tools rather than one connected way of working.`};
 }});
