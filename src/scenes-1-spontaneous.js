/* ===================== Abiogenesis era 1 · Spontaneous generation (350 BCE–1862) ===================== */
// Status tag for every scene: what kind of claim the scene is about.
const A1_STATUS={demonstrated:['Demonstrated',C.green,C.greenp],plausible:['Plausible',C.amber,C.amberp],speculative:['Speculative',C.purple,C.purplep],refuted:['Refuted claim',C.coral,C.coralp],historical:['Historical view',C.muted,'#eef2f4']};
function A1_head(title,st){const S=A1_STATUS[st],w=S[0].length*8.2+24;return heading(title,48)+R(594-w,3,w,22,S[2],S[1],11)+TBF(594-w/2,18,S[0],13,S[1])}
function A1_axes(x,y,w,h,xr,yr,o={}){
 const X=v=>x+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const t of o.xt||[]){const v=Array.isArray(t)?t[0]:t,lab=Array.isArray(t)?t[1]:t;s+=L(X(v),y,X(v),y+h,'#eef3f6',1)+TF(X(v),y+h+15,lab,13,C.muted)}
 for(const t of o.yt||[]){const v=Array.isArray(t)?t[0]:t,lab=Array.isArray(t)?t[1]:t;s+=L(x,Y(v),x+w,Y(v),'#eef3f6',1)+TF(x-6,Y(v)+4,lab,13,C.muted,'end')}
 if(o.xl)s+=TF(x+w/2,y+h+31,o.xl,13,C.muted);
 if(o.yl)s+=TF(x+8,y+16,o.yl,13,C.muted,'start');
 return {svg:s,X,Y};
}
const A1_path=pts=>'M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L');
function A1_wrap(t,n){const out=[];let cur='';for(const w of String(t).split(' ')){if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out}
function A1_card(x,y,w,title,lines,col=C.blue){
 let out=R(x,y,w,30+lines.length*19,'#fff',C.grid,8)+TBF(x+12,y+21,title,14,col,'start');
 lines.forEach((l,i)=>{out+=TF(x+12,y+42+i*19,l,13,C.ink,'start')});return out;
}
// A jar outline with optional cover; returns svg. cover: 'open' | 'sealed' | 'gauze'.
function A1_jar(x,y,w,h,cover,fill='#f6eedd'){
 let out=R(x,y+10,w,h-10,'#fbfdfe',C.ink,10)+R(x+8,y+h-44,w-16,36,fill,'none',6);
 if(cover==='sealed')out+=R(x-4,y+2,w+8,14,'#e9dcc0',C.ink,4);
 if(cover==='gauze'){out+=R(x-4,y+2,w+8,14,'#fff',C.ink,4);for(let i=0;i<w;i+=8)out+=L(x+i,y+4,x+i,y+14,C.muted,1)}
 return out;
}
const A1_fly=(x,y,c=C.ink)=>Ci(x,y,4,c)+P(`M${fmt(x-2)} ${fmt(y-3)}Q${fmt(x-9)} ${fmt(y-11)} ${fmt(x-6)} ${fmt(y-2)}M${fmt(x+2)} ${fmt(y-3)}Q${fmt(x+9)} ${fmt(y-11)} ${fmt(x+6)} ${fmt(y-2)}`,C.muted,1.5);
const A1_maggot=(x,y)=>`<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="6" ry="2.6" fill="#f4efe2" stroke="#9a8a62" stroke-width="1.2"/>`;
const A1_egg=(x,y)=>`<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="2.4" ry="1.4" fill="#fff" stroke="#9a8a62" stroke-width="1"/>`;

/* ---------- Lesson: aristotle-generation ---------- */
const A1_RECIPES={
 eels:{n:'Eels from mud',who:'Aristotle, c. 350 BCE',ing:'wet mud and rotting weed',makes:'eels',day:20,
  claim:['No one had ever found eel eggs or milt,','so Aristotle wrote that eels come from','“earth’s guts” formed in wet mud.'],
  truth:['European eels breed far out in the Sargasso','Sea. See-through larvae drift to Europe and','turn into young eels (Schmidt, 1920s).']},
 mice:{n:'Mice from wheat',who:'van Helmont, published 1648',ing:'wheat grains and a sweaty shirt',makes:'mice',day:21,
  claim:['Leave a sweaty shirt on wheat in an open','pot, said Jan Baptist van Helmont, and mice','appear in about 21 days.'],
  truth:['Mice came in from outside for the grain.','An open pot is not a closed experiment.','']},
 maggots:{n:'Maggots from meat',who:'common belief to the 1600s',ing:'rotting meat',makes:'maggots',day:3,
  claim:['Meat left out “turns into” maggots within','days: everyone could see it happen.',''],
  truth:['Flies lay tiny eggs on the meat. Maggots','hatch from them. Redi showed it in 1668.','']},
 fleas:{n:'Fleas from dust',who:'Aristotle, c. 350 BCE',ing:'dust and dried dirt',makes:'fleas',day:12,
  claim:['Aristotle wrote that fleas form from','small amounts of decaying matter.',''],
  truth:['Adult fleas lay eggs that fall into dust;','larvae live there and turn into fleas.','']}};
SCENE({id:'aristotle-generation',name:'Spontaneous generation',tag:'Old recipes for making animals',
 definition:'Spontaneous generation is the idea that living things can arise directly from non-living matter, such as mud, dew or rotting meat, without parents. For about two thousand years it was the ordinary, sensible explanation for creatures that seemed to appear from nowhere.',
 example:'Aristotle described eels arising from mud. In the 1600s Jan Baptist van Helmont gave a recipe for mice: a sweaty shirt on wheat in an open pot, about 21 days. These recipes convinced their advocates because nobody controlled for creatures getting in from outside; no controlled experiment ever produced mice from a shirt and wheat.',
 desc:'A container prepared by one of four historical recipes, followed over the days until its “product” appears. A switch reveals where the creatures really came from.',
 research:['Aristotle (c. 350 BCE). History of Animals, Book VI (eels from mud) and Book V (insects).','van Helmont, J. B. (1648). Ortus medicinae (the recipe for mice), published after his death.','Schmidt, J. (1923). The breeding places of the eel. Philosophical Transactions of the Royal Society B 211.'],
 dur:12,hint:'Choose a recipe and move the days forward until something appears. Then switch on “What really happened”.',
 init:()=>({rec:'mice',d:25,show:0}),
 watch(p){const k=['eels','mice','maggots','fleas'],i=Math.min(3,Math.floor(p*4)),q=(p*4)%1;return {rec:k[i],d:Math.round(q*30),show:q>.6?1:0}},
 ui:[{choose:[['eels','Eels'],['mice','Mice'],['maggots','Maggots'],['fleas','Fleas']],label:'Recipe',get:s=>s.rec,act:'rec'},{range:'d',label:'Days',min:0,max:30,step:1,get:s=>s.d,act:'d',show:v=>'day '+v},{b:'What really happened',act:'show'}],
 on:{rec(s,v){s.rec=v;s.show=0},d(s,v){s.d=+v},show(s){s.show=s.show?0:1}},
 draw(s){
  const R0=A1_RECIPES[s.rec],there=s.d>=R0.day;let out=A1_head(R0.n,'refuted');
  out+=TF(170,74,R0.who,13,C.muted);
  out+=A1_jar(70,90,200,190,'open',s.rec==='eels'?'#c9b48a':s.rec==='fleas'?'#d9cfbf':'#f2e1b8');
  out+=TF(170,300,R0.ing,13,C.ink);
  const r=rng(3);
  if(there){for(let i=0;i<5;i++){const x=95+r()*150,y=232+r()*30;
   if(s.rec==='eels')out+=P(`M${fmt(x-14)} ${fmt(y)}q7 -6 14 0t14 0`,C.ink,2.5);
   else if(s.rec==='mice')out+=`<ellipse cx="${fmt(x)}" cy="${fmt(y-4)}" rx="11" ry="6" fill="#8a8a8a"/>`+Ci(x+11,y-6,3.5,'#8a8a8a')+P(`M${fmt(x-11)} ${fmt(y-3)}q-8 2 -12 -4`,'#8a8a8a',1.5);
   else if(s.rec==='maggots')out+=A1_maggot(x,y);
   else out+=Ci(x,y,2.6,'#5a3b1e')}}
  if(s.show){
   const lab={mice:'mice climb in for the grain',maggots:'a fly lays eggs on the meat',fleas:'an adult flea lays eggs',eels:'young eels arrive from the sea'}[s.rec];
   out+=TF(170,128,lab,13,C.coral);
   if(s.rec==='mice')out+=`<ellipse cx="236" cy="98" rx="11" ry="6" fill="#8a8a8a"/>`+Ci(247,96,3.5,'#8a8a8a')+P('M236 150Q236 190 220 224',C.coral,2.5,'none','stroke-dasharray="6 4"');
   if(s.rec==='maggots'||s.rec==='fleas')out+=A1_fly(170,152)+A1_egg(150,250)+A1_egg(190,256);
   if(s.rec==='eels')out+=P('M110 150Q120 200 150 236',C.coral,2.5,'none','stroke-dasharray="6 4"');
  }
  out+=TF(170,322,there?R0.makes+' appear by day '+R0.day:'day '+s.d+': nothing yet',14,there?C.coral:C.muted);
  const cl=A1_wrap(R0.claim.join(' ').trim(),36),tr=A1_wrap(R0.truth.join(' ').trim(),36);
  out+=A1_card(310,70,280,'The claim',cl,C.amber);
  if(s.show)out+=A1_card(310,96+cl.length*19+20,280,'What really happened',tr,C.green);
  else out+=TF(450,250,'Press “What really happened”',13,C.muted);
  return {svg:out,phase:s.show?R0.truth.join(' ').trim():there?`The recipe “works”: ${R0.makes} appear. The question is where they came from.`:`Waiting: day ${s.d} of the recipe.`};
 }});

const A1_SORT=[
 {n:'Horse',a:0,why:'born from parents'},{n:'Hen',a:0,why:'hatched from eggs'},{n:'Eel',a:1,why:'from mud, he wrote'},
 {n:'Oyster',a:1,why:'from slime and mud'},{n:'Fly',a:1,why:'some insects from decay'},{n:'Human',a:0,why:'born from parents'}];
SCENE({id:'aristotle-generation-sort',name:'Aristotle’s two kinds of origin',tag:'Guess which animals he thought had no parents',
 definition:'Aristotle was a careful observer who dissected many animals. He held that most animals come from parents of the same kind, but that some, such as eels, many shellfish and some insects, arise spontaneously from mud, slime or decaying matter.',
 example:'He traced the development of the chick in the egg day by day, yet wrote that oysters form in mud and eels from “earth’s guts”. For creatures whose eggs were too small, too hidden or too far away to find, spontaneous generation was the best explanation available.',
 desc:'Six animals as cards. In Try it you mark each as “from parents” or “by itself”, as you think Aristotle classed it; Reveal shows his view, and the modern answer that every one has parents.',
 research:['Aristotle (c. 350 BCE). History of Animals, Book V and Book VI; Generation of Animals, Book III.','Lennox, J. G. (1982). Teleology, chance, and Aristotle’s theory of spontaneous generation. Journal of the History of Philosophy 20.'],
 dur:10,hint:'Press each card to mark how you think Aristotle classed it, then press Reveal. Your answers stay on this page.',
 init:()=>({g:[-1,-1,-1,-1,-1,-1],rev:0}),
 watch(p){const g=A1_SORT.map((c,i)=>p>(i+1)/8?(i===4?0:c.a):-1);return {g,rev:p>.8?1:0}},
 ui:[{b:'Reveal',act:'rev'},{b:'Clear',act:'clear'}],
 on:{pick(s,a){if(s.rev)return;const i=+a;s.g=s.g.slice();s.g[i]=s.g[i]===1?0:1},rev(s){s.rev=1},clear(s){s.g=[-1,-1,-1,-1,-1,-1];s.rev=0}},
 draw(s,f,X){
  let out=A1_head('Which did Aristotle say had no parents?','historical');
  let right=0;
  A1_SORT.forEach((c,i)=>{const x=40+(i%3)*180,y=70+Math.floor(i/3)*112,g=s.g[i],ok=s.rev&&g===c.a;if(ok)right++;
   const lab=g===-1?'press to choose':g===1?'by itself':'from parents';
   const inner=R(x,y,160,96,'#fff',s.rev?(g===-1?C.grid:ok?C.green:C.coral):g===-1?C.grid:C.blue,10)+TBF(x+80,y+28,c.n,17,C.ink)+TF(x+80,y+52,'you: '+lab,13,g===-1?C.muted:C.blue)+(s.rev?TF(x+80,y+76,'Aristotle: '+(c.a?'by itself':'from parents'),13,c.a?C.coral:C.green):'');
   out+=hit(X,'pick',i,c.n+': '+lab,inner)});
  if(s.rev){out+=A1_card(40,302,520,`You matched Aristotle on ${right} of ${A1_SORT.filter((c,i)=>s.g[i]!==-1).length} marked`,['Today: all six have parents. Eels breed at sea; oysters and flies lay eggs.'],C.green)}
  else out+=TF(300,330,'Mark each card, then press Reveal',14,C.muted);
  return {svg:out,phase:s.rev?'Aristotle placed eels, oysters and some insects outside the rule that like comes from like. Every one of them, we now know, has parents.':'Mark each animal as Aristotle would have classed it.'};
 }});

const A1_TIME=[
 {y:'c. 350 BCE',who:'Aristotle',t:'eels, shellfish and some insects arise by themselves',sc:3},
 {y:'1648',who:'van Helmont',t:'a recipe for mice from wheat and a shirt',sc:3},
 {y:'1668',who:'Redi',t:'maggots come only from flies’ eggs',sc:2},
 {y:'1676',who:'Leeuwenhoek',t:'sees “animalcules”: new, tiny candidates',sc:1},
 {y:'1748',who:'Needham',t:'microbes appear in boiled, corked gravy',sc:1},
 {y:'1765',who:'Spallanzani',t:'longer boiling and melted seals: none appear',sc:1},
 {y:'1862',who:'Pasteur',t:'swan-neck flasks stay clear for months',sc:0},
 {y:'1877',who:'Tyndall',t:'heat-proof spores explain the last exceptions',sc:0}];
const A1_SCOPE=['nothing: life comes from life (today)','microbes only','insects and microbes','mice, eels, insects, microbes'];
SCENE({id:'aristotle-generation-shrinks',name:'An idea that shrank',tag:'From mice to microbes to nothing',
 definition:'Spontaneous generation was not overturned in one blow. Each careful experiment removed a group of creatures from the list, until only invisible microbes were left, and then those too.',
 example:'In 1648 mice were on the list. After Redi in 1668 educated people stopped believing that insects arise from meat. Microscopes then revealed microbes, which became the new candidates, until Pasteur and Tyndall closed the question for life as it exists today.',
 desc:'A timeline of eight moments from Aristotle to Tyndall. As each is selected, a bar shows the largest creatures still thought able to arise without parents.',
 research:['Farley, J. (1977). The Spontaneous Generation Controversy from Descartes to Oparin. Johns Hopkins University Press.','Redi, F. (1668). Esperienze intorno alla generazione degl’insetti.','Pasteur, L. (1862). Mémoire sur les corpuscules organisés qui existent dans l’atmosphère.'],
 dur:12,hint:'Step through the timeline and watch the list of creatures “allowed” to appear without parents shrink.',
 init:()=>({i:7}),
 watch(p){return {i:Math.min(7,Math.floor(p*8.5))}},
 ui:[{range:'i',label:'Moment',min:0,max:7,step:1,get:s=>s.i,act:'i',show:v=>A1_TIME[v].y+' '+A1_TIME[v].who}],
 on:{i(s,v){s.i=+v},pick(s,a){s.i=+a}},
 draw(s,f,X){
  let out=A1_head('An idea that shrank over 2,000 years','demonstrated');
  out+=L(50,120,550,120,C.ink,2.5);
  A1_TIME.forEach((e,i)=>{const x=50+i*500/7,on=i===s.i,past=i<=s.i;
   out+=hit(X,'pick',i,e.y+' '+e.who,Ci(x,120,on?10:7,past?C.blue:'#fff',C.blue)+TF(x,i%2?152:100,e.who,13,on?C.coral:C.ink))});
  const E=A1_TIME[s.i];
  out+=A1_card(50,176,500,`${E.y} · ${E.who}`,[E.t],C.blue);
  out+=TBF(50,266,'Still thought to arise without parents:',14,C.ink,'start');
  for(let k=0;k<4;k++){const on=k===E.sc,gone=k>E.sc;out+=R(50+k*125,280,118,44,on?(k===0?C.greenp:C.coralp):'#f6f9fb',on?(k===0?C.green:C.coral):C.grid,8)+TF(109+k*125,307,['nothing','microbes','+ insects','+ mice, eels'][k],13,on?C.ink:C.muted)+(gone?L(70+k*125,302,148+k*125,302,C.muted,1.5):'')}
  out+=TF(300,350,A1_SCOPE[E.sc],14,E.sc?C.coral:C.green);
  return {svg:out,phase:`${E.y}: ${E.who}. ${E.t.charAt(0).toUpperCase()+E.t.slice(1)}. Still on the list: ${A1_SCOPE[E.sc]}.`};
 }});

/* ---------- Lesson: redi-flies ---------- */
// Stages after meat is exposed (days, at summer warmth, approximate for a blowfly).
const A1_STAGE=d=>d<1?'none':d<2?'eggs':d<7?'maggots':d<13?'pupae':'flies';
SCENE({id:'redi-flies',name:'Redi’s jars',tag:'Maggots come from flies, 1668',
 definition:'In 1668 Francesco Redi put meat into jars. Some he left open, some he sealed, and some he covered with fine gauze. Maggots appeared only where flies could reach the meat and lay their eggs.',
 example:'In the open jars flies landed and maggots swarmed within days. In the sealed jars the meat rotted but no maggots appeared. On the gauze-covered jars, flies drawn by the smell laid eggs on the gauze itself, and maggots hatched there, not in the meat.',
 desc:'Three jars of meat side by side, open, sealed and covered with gauze, followed day by day. Flies, eggs, maggots, pupae and new flies appear only where flies can lay.',
 research:['Redi, F. (1668). Esperienze intorno alla generazione degl’insetti (Experiments on the Generation of Insects), Florence.','Stage timings: typical for blowflies at summer warmth (approximate; they vary with temperature).'],
 dur:12,hint:'Move the days forward and compare the three jars. Notice where the eggs on the gauze jar end up.',
 init:()=>({d:8}),
 watch(p){return {d:Math.round(p*16)}},
 ui:[{range:'d',label:'Days',min:0,max:16,step:1,get:s=>s.d,act:'d',show:v=>'day '+v}],
 on:{d(s,v){s.d=+v}},
 draw(s){
  const st=A1_STAGE(s.d);let out=A1_head('Three jars of meat, day '+s.d,'demonstrated');
  const J=[['open','Open'],['sealed','Sealed'],['gauze','Gauze']];
  J.forEach(([c,lab],j)=>{const x=50+j*180,y=90;out+=A1_jar(x,y,140,190,c);
   out+=TBF(x+70,y+212,lab,15,C.ink);
   const r=rng(11+j);
   // Flies buzz around every jar (they smell the meat).
   for(let i=0;i<3;i++){const fx=x+20+r()*100+Math.sin(s.d*1.7+i)*8,fy=y-18+r()*14;if(s.d>0)out+=A1_fly(fx,fy)}
   if(c==='open'){if(st==='eggs')for(let i=0;i<6;i++)out+=A1_egg(x+30+r()*80,y+160+r()*20);
    if(st==='maggots')for(let i=0;i<9;i++)out+=A1_maggot(x+28+r()*84,y+156+r()*24);
    if(st==='pupae')for(let i=0;i<7;i++)out+=`<ellipse cx="${fmt(x+30+r()*80)}" cy="${fmt(y+160+r()*20)}" rx="5" ry="3" fill="#7a4a22"/>`;
    if(st==='flies')for(let i=0;i<5;i++)out+=A1_fly(x+30+r()*80,y+80+r()*60,C.coral)}
   if(c==='gauze'&&s.d>=1){for(let i=0;i<5;i++)out+=(st==='eggs'?A1_egg:A1_maggot)(x+20+r()*100,y+8)}
   const note=c==='sealed'?'no maggots':c==='gauze'?(s.d>=2?'maggots on the gauze':s.d>=1?'eggs on the gauze':'nothing yet'):st==='none'?'nothing yet':st;
   out+=TF(x+70,y+236,note,13,c==='open'&&st!=='none'?C.coral:C.muted)});
  out+=TF(300,362,'Stage timings approximate (blowfly in warm weather)',13,C.muted);
  return {svg:out,phase:s.d<1?'Flies are drawn to all three jars by the smell of meat.':st==='flies'?'A new generation of flies has emerged from the open jar. The sealed jar never had a maggot, and the gauze jar’s maggots were on the gauze.':`Day ${s.d}: in the open jar, ${st}. In the sealed jar, none. On the gauze, eggs laid by flies that could not reach the meat.`};
 }});

const A1_FAIR=[
 {k:'control',n:'Leave some jars open',obj:'No comparison: maybe this meat never grows maggots anyway.'},
 {k:'same',n:'Same meat in every jar',obj:'Different meats: maybe only some meats breed maggots.'},
 {k:'air',n:'Let air in (gauze, not seal)',obj:'Sealing shuts out air: critics say life needs fresh air.'},
 {k:'many',n:'Several jars of each, several meats',obj:'One jar each: the result could be chance.'}];
SCENE({id:'redi-flies-fair',name:'Making it a fair test',tag:'Controls, replicates and answering critics',
 definition:'A fair experiment changes one thing and keeps everything else the same, compares against a control, and repeats the test. Redi’s design is an early, clear example.',
 example:'Redi used several kinds of flesh (snake, fish, veal), kept open jars as controls, and added gauze covers when critics argued that sealed jars spoiled the air. With gauze, air reached the meat but flies did not, and still no maggots appeared in the meat.',
 desc:'Four design choices for a maggot experiment. Each one you switch on removes an objection from the list a sceptic could raise.',
 research:['Redi, F. (1668). Esperienze intorno alla generazione degl’insetti.','Fisher, R. A. (1935). The Design of Experiments (controls, replication and randomisation).'],
 dur:10,hint:'Switch each design choice on or off and read which objections a critic could still raise.',
 init:()=>({on:[1,1,0,0]}),
 watch(p){return {on:A1_FAIR.map((x,i)=>p>(i+1)/5?1:0)}},
 ui:[],
 on:{pick(s,a){const i=+a;s.on=s.on.slice();s.on[i]=s.on[i]?0:1}},
 draw(s,f,X){
  let out=A1_head('Design choices and the objections left','demonstrated');
  A1_FAIR.forEach((c,i)=>{const y=70+i*52,on=s.on[i];
   out+=hit(X,'pick',i,c.n+(on?': on':': off'),R(24,y,262,42,on?C.greenp:'#fff',on?C.green:C.grid,8)+Ci(44,y+21,9,on?C.green:'#fff',C.green)+TF(60,y+26,c.n,13,C.ink,'start'))});
  const left=A1_FAIR.filter((c,i)=>!s.on[i]);
  out+=TBF(304,88,left.length?'A critic could still say:':'No easy objection left',14,left.length?C.coral:C.green,'start');
  left.forEach((c,i)=>{A1_wrap(c.obj,34).forEach((l,j)=>{out+=TF(304,114+i*58+j*18,(j?'  ':'• ')+l,13,C.ink,'start')})});
  if(!left.length)out+=A1_wrap('This is Redi’s final design: controls, the same meats, gauze to let air in, and several jars of several meats.',34).map((l,j)=>TF(304,114+j*18,l,13,C.ink,'start')).join('');
  out+=TF(300,362,`${4-left.length} of 4 design choices in place`,14,left.length?C.muted:C.green);
  return {svg:out,phase:left.length?`${left.length} objection${left.length>1?'s':''} still open. Each design choice removes one way the result could be explained without flies.`:'With all four choices in place, the only difference between jars is whether flies could reach the meat.'};
 }});

SCENE({id:'redi-flies-cycle',name:'Egg, maggot, pupa, fly',tag:'Following a life cycle',
 definition:'Redi did not stop at “no flies, no maggots”. He kept the maggots, watched them turn into still, hard pupae, and saw adult flies emerge: the same kind of fly that had laid the eggs. Like produced like.',
 example:'A blowfly’s eggs hatch in about a day in warm weather; the maggots feed for several days, then pupate; adults emerge a week or so later. Yet Redi still thought the insects inside plant galls were generated by the plant itself, an exception later shown wrong (Malpighi, Vallisneri).',
 desc:'A circle of the four stages of a blowfly, with a day slider moving round it. A button shows Redi’s own exception, the gall insects, which he wrongly kept on the list.',
 research:['Redi, F. (1668). Esperienze intorno alla generazione degl’insetti (rearing maggots to flies; galls).','Vallisneri, A. (1700). Dialoghi sopra la curiosa origine di molti insetti (gall insects come from eggs laid by wasps).'],
 dur:10,hint:'Move through the days to follow one generation. Then press “Redi’s exception”.',
 init:()=>({d:9,gall:0}),
 watch(p){return {d:Math.round(p*18),gall:p>.8?1:0}},
 ui:[{range:'d',label:'Day',min:0,max:18,step:1,get:s=>s.d,act:'d',show:v=>'day '+v},{b:'Redi’s exception',act:'gall'}],
 on:{d(s,v){s.d=+v},gall(s){s.gall=s.gall?0:1}},
 draw(s){
  let out=A1_head('One generation of a blowfly','demonstrated');
  const cx=180,cy=206,r=104,st=['eggs','maggots','pupae','flies'],dd=[0,1,7,13,18];
  const k=s.d<1?0:s.d<7?1:s.d<13?2:3;
  out+=Ci(cx,cy,r,'none',C.grid,'stroke-width="3"');
  st.forEach((t,i)=>{const a=-Math.PI/2+i*Math.PI/2,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r,on=i===k;
   out+=Ci(x,y,on?28:22,on?C.coralp:'#fff',on?C.coral:C.line);
   if(i===0)out+=A1_egg(x-5,y)+A1_egg(x+5,y+2);else if(i===1)out+=A1_maggot(x,y);else if(i===2)out+=`<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="7" ry="4" fill="#7a4a22"/>`;else out+=A1_fly(x,y+2);
   out+=TF(x+(i===1?36:0),y+(i===0?-36:i===2||i===3?46:5),t,13,on?C.coral:C.ink,i===1?'start':'middle')});
  const a=-Math.PI/2+(s.d/18)*2*Math.PI;out+=L(cx,cy,cx+Math.cos(a)*(r-36),cy+Math.sin(a)*(r-36),C.blue,3)+Ci(cx,cy,5,C.blue)+TBF(cx,cy+26,'day '+s.d,14,C.blue);
  if(s.gall)out+=A1_card(320,74,260,'Redi’s exception',['He thought grubs inside plant galls','were made by the plant itself.','Vallisneri (1700) showed they hatch','from eggs laid by tiny wasps.'],C.amber);
  else out+=A1_card(320,74,260,'What Redi saw',['The maggots stopped feeding, turned','into hard pupae, and adult flies','emerged: the same kind that laid','the eggs. Like comes from like.'],C.green);
  out+=TF(450,330,'Durations approximate; warmth speeds them up',13,C.muted);
  return {svg:out,phase:s.gall?'Even Redi kept one exception: he thought gall insects were produced by plants. Careful observers closed that gap a generation later.':`Day ${s.d}: ${st[k]}. Redi reared maggots to adults and found the same species as the egg-laying flies.`};
 }});

/* ---------- Lesson: needham-spallanzani ---------- */
// Illustrative heat-kill model: decimal reduction times (minutes at 100 °C).
const A1_DV=.5,A1_DS=12,A1_NV=1e5,A1_NS=2;
const A1_steril=(t)=>Math.exp(-(A1_NV*10**(-t/A1_DV)+A1_NS*10**(-t/A1_DS)));
SCENE({id:'needham-spallanzani',name:'Needham and Spallanzani',tag:'How long to boil, and how to seal',
 definition:'In 1748 John Needham boiled mutton gravy briefly, corked the flasks, and found them full of microscopic life days later. Lazzaro Spallanzani repeated the work in the 1760s, boiling for much longer and sealing the flasks by melting the glass necks shut. His flasks stayed free of life.',
 example:'Needham took his result as evidence that a “vegetative force” in matter makes life. Spallanzani’s reply was that a few minutes of boiling does not kill everything, and a cork does not keep out what floats in the air.',
 desc:'Eight flasks of broth, boiled for a chosen time and sealed with a cork or by melting the glass. A few days later each flask is clear or cloudy. The heat-kill model is illustrative: tough microbes survive short boiling, and corks leak.',
 research:['Needham, J. T. (1748). A summary of some late observations upon the generation, composition, and decomposition of animal and vegetable substances. Philosophical Transactions 45.','Spallanzani, L. (1765). Saggio di osservazioni microscopiche concernenti il sistema della generazione de’ signori di Needham e Buffon.','Survival model illustrative (decimal reduction times), not historical data.'],
 dur:12,hint:'Set the boiling time and the seal. Try Needham’s choice (a few minutes, cork), then Spallanzani’s (long boiling, melted glass).',
 init:()=>({t:3,seal:'cork',seed:1}),
 watch(p){return p<.5?{t:Math.round(2+p*8),seal:'cork',seed:1}:{t:Math.round(10+(p-.5)*100),seal:'glass',seed:1}},
 ui:[{range:'t',label:'Boiling',min:0,max:60,step:1,get:s=>s.t,act:'t',show:v=>v+' min'},{choose:[['cork','Cork (Needham)'],['glass','Melted glass (Spallanzani)']],label:'Seal',get:s=>s.seal,act:'seal'},{b:'Repeat with new flasks',act:'again'}],
 on:{t(s,v){s.t=+v},seal(s,v){s.seal=v},again(s){s.seed=(s.seed%97)+1}},
 draw(s){
  const pS=A1_steril(s.t),pLeak=s.seal==='cork'?.6:0,pClear=pS*(1-pLeak);
  let out=A1_head(`Boiled ${s.t} min, ${s.seal==='cork'?'corked':'sealed in glass'}`,'demonstrated');
  const r=rng(s.seed*31+7);let clear=0;
  for(let i=0;i<8;i++){const x=60+i*64,cx=x+24,ok=r()<pClear;if(ok)clear++;
   out+=Ci(cx,190,26,ok?'#f3e9c6':'#c9a96a',C.ink)+R(cx-7,112,14,54,'#fff',C.ink,3);
   out+=s.seal==='cork'?R(cx-9,104,18,14,'#a0754a','none',3):P(`M${cx-7} 112Q${cx} 100 ${cx+7} 112`,C.ink,2.5);
   if(!ok)for(let k=0;k<7;k++)out+=Ci(cx-14+((k*37)%28),178+((k*23)%22),1.8,'#6b4c1a');
   out+=TF(cx,236,ok?'clear':'cloudy',13,ok?C.green:C.coral)}
  out+=TBF(300,276,`${clear} of 8 flasks stayed clear`,16,clear>5?C.green:C.coral);
  out+=TF(300,302,`model: chance a flask is truly sterile ${Math.round(pS*100)}%, chance its seal lets microbes in ${Math.round(pLeak*100)}%`,13,C.muted);
  out+=TF(300,330,'Heat resistance and leak rates illustrative',13,C.muted);
  return {svg:out,phase:s.seal==='cork'&&s.t<10?'Needham’s conditions: short boiling leaves survivors, and corks let microbes in. Most flasks cloud over.':s.seal==='glass'&&s.t>=30?'Spallanzani’s conditions: long boiling and a glass seal. Almost every flask stays clear.':'Both choices matter: how thoroughly the broth is heated, and whether anything can get in afterwards.'};
 }});

const A1_HYP=[
 {n:'Germs come in from outside',who:'Spallanzani'},
 {n:'Long boiling destroys a “vital force” in the broth',who:'Needham'},
 {n:'Sealing spoils the air that life needs',who:'Needham'}];
// Experiments: observed result and whether each hypothesis predicted it (1 consistent, 0 contradicted).
const A1_EXP=[
 {n:'Boil briefly, cork',obs:'cloudy',fit:[1,1,1],who:'Needham, 1748'},
 {n:'Boil long, melt-seal',obs:'clear',fit:[1,1,1],who:'Spallanzani, 1760s'},
 {n:'Crack a clear sealed flask',obs:'cloudy',fit:[1,0,1],who:'Spallanzani’s reported cracked flasks'},
 {n:'Swan neck: air in, dust out',obs:'clear',fit:[1,1,0],who:'Pasteur, 1859–62'}];
SCENE({id:'needham-spallanzani-vital',name:'The vital-force dispute',tag:'Which experiment can tell the ideas apart?',
 definition:'Needham answered Spallanzani by saying that long boiling destroyed a “vegetative” or vital force in the broth, and that sealing spoiled the air. A good experiment is one whose result is different depending on which idea is true.',
 example:'If boiling destroys the broth’s power to make life, a long-boiled flask should stay lifeless even when opened to the air. Spallanzani reported that flasks whose seals cracked soon teemed with life, so the broth could still support it. A century later, Pasteur’s swan necks let air in but kept dust out, and the broth stayed clear, which answered the point about air.',
 desc:'Three hypotheses in rows and four experiments as buttons. Running an experiment marks each hypothesis as consistent or contradicted by what was actually observed.',
 research:['Needham, J. T. (1750). Nouvelles observations microscopiques.','Spallanzani, L. (1765, 1776). Saggio di osservazioni microscopiche; Opuscoli di fisica animale e vegetabile.','Farley, J. (1977). The Spontaneous Generation Controversy from Descartes to Oparin.'],
 dur:12,hint:'Run the experiments one at a time. Which ones actually separate the hypotheses?',
 init:()=>({run:[0,0,0,0]}),
 watch(p){return {run:A1_EXP.map((e,i)=>p>(i+.5)/5?1:0)}},
 ui:[{b:'Clear',act:'clear'}],
 on:{pick(s,a){s.run=s.run.slice();s.run[+a]=1},clear(s){s.run=[0,0,0,0]}},
 draw(s,f,X){
  let out=A1_head('Testing three ideas with four experiments','demonstrated');
  A1_EXP.forEach((e,j)=>{const x=210+j*96,on=s.run[j];
   out+=hit(X,'pick',j,'Run: '+e.n,R(x,62,88,78,on?C.pale:'#fff',on?C.blue:C.grid,8)+A1_wrap(e.n,13).map((l,k)=>TF(x+44,80+k*16,l,13,C.ink)).join('')+(on?TBF(x+44,132,e.obs,13,e.obs==='clear'?C.green:C.coral):TF(x+44,132,'press to run',13,C.muted)))});
  A1_HYP.forEach((h,i)=>{const y=162+i*60;let dead=0;
   A1_EXP.forEach((e,j)=>{if(s.run[j]&&!e.fit[i])dead=1});
   out+=R(14,y,192,56,dead?C.coralp:'#fff',dead?C.coral:C.grid,8)+A1_wrap(h.n,25).map((l,k)=>TF(24,y+18+k*16,l,13,dead?C.coral:C.ink,'start')).join('');
   A1_EXP.forEach((e,j)=>{if(!s.run[j])return;const x=254+j*96;out+=TBF(x,y+33,e.fit[i]?'✓':'✗',20,e.fit[i]?C.green:C.coral)})});
  const live=A1_HYP.filter((h,i)=>!A1_EXP.some((e,j)=>s.run[j]&&!e.fit[i])).length;
  out+=TF(300,362,`${live} of 3 ideas still standing · ✓ consistent with the result, ✗ contradicted`,13,C.muted);
  return {svg:out,phase:!s.run[2]&&!s.run[3]?'The first two experiments fit all three ideas, so they cannot decide between them. Try the others.':live===1?'Only “germs come in from outside” survives every experiment.':'Some experiments separate the ideas; others fit them all.'};
 }});

SCENE({id:'needham-spallanzani-heat',name:'Why short boiling fails',tag:'Killing curves for microbes',
 definition:'Heat kills microbes at a steady rate: in each fixed interval at a given temperature, the same fraction dies. Ordinary cells die in seconds at 100 °C, but some bacteria form spores that survive boiling for many minutes or hours.',
 example:'If a hundred thousand cells lose 90% every half minute, after 3 minutes almost none are left. A handful of spores that lose 90% only every 12 minutes can survive a quarter of an hour of boiling. Needham’s few minutes were never enough; Spallanzani’s long boiling usually was.',
 desc:'Number of surviving microbes against minutes of boiling, on a logarithmic scale, for ordinary cells and for heat-resistant spores. A marker shows the chosen boiling time and the chance that no survivor is left.',
 research:['Esty, J. R. & Meyer, K. F. (1922). The heat resistance of the spores of B. botulinus and allied anaerobes. Journal of Infectious Diseases 31 (logarithmic death).','Rates shown are illustrative decimal reduction times, not measurements of eighteenth-century broths.'],
 dur:10,hint:'Move the boiling time and watch the two lines fall. When do you expect no survivor at all?',
 init:()=>({t:5}),
 watch(p){return {t:Math.round(p*60)}},
 ui:[{range:'t',label:'Boiling',min:0,max:60,step:1,get:s=>s.t,act:'t',show:v=>v+' min'}],
 on:{t(s,v){s.t=+v}},
 draw(s){
  let out=A1_head('Survivors against minutes of boiling','demonstrated');
  const A=A1_axes(90,70,440,220,[0,60],[-3,6],{xt:[0,10,20,30,40,50,60],yt:[[6,'1,000,000'],[3,'1,000'],[0,'1'],[-3,'0.001']],xl:'minutes at 100 °C',yl:'microbes left'});out+=A.svg;
  const v=t=>Math.log10(A1_NV)-t/A1_DV,sp=t=>Math.log10(A1_NS)-t/A1_DS;
  out+=P(A1_path(range(121).map(i=>i/2).filter(t=>v(t)>=-3).map(t=>[A.X(t),A.Y(v(t))])),C.blue,3);
  out+=P(A1_path(range(121).map(i=>i/2).map(t=>[A.X(t),A.Y(Math.max(-3,sp(t)))])),C.coral,3);
  out+=L(A.X(0),A.Y(0),A.X(60),A.Y(0),C.muted,1.5,'stroke-dasharray="5 4"');
  out+=TF(A.X(4)+6,A.Y(4.4),'ordinary cells',13,C.blue,'start')+TF(A.X(32),A.Y(-1.4),'spores',13,C.coral,'start');
  out+=L(A.X(s.t),70,A.X(s.t),290,C.ink,2);
  const pS=A1_steril(s.t);
  out+=TBF(300,352,`After ${s.t} min: chance no microbe survives = ${Math.round(pS*100)}%`,15,pS>.9?C.green:C.coral);
  return {svg:out,phase:pS<.5?'Survivors are still likely. Below the dashed line means fewer than one expected microbe; above it, at least one is probably alive.':'The expected number of survivors has fallen well below one: most flasks will now be sterile.'};
 }});

/* ---------- Lesson: pasteur-pouchet ---------- */
const A1_SITES={arbois:{n:'Near Arbois',h:'low ground',p:8},jura:{n:'Mont Poupet, Jura',h:'about 850 m',p:5},mont:{n:'Montanvert, by the Mer de Glace',h:'about 2,000 m',p:1}};
SCENE({id:'pasteur-pouchet',name:'Pasteur’s mountain flasks',tag:'Germs in the air, counted',
 definition:'If microbes in broth come from germs carried in the air, then cleaner air should seed fewer flasks. In 1860 Louis Pasteur carried sealed flasks of sterile broth to different places, snapped open the necks for a moment, resealed them and counted how many grew.',
 example:'Of 20 flasks opened in the countryside near Arbois, 8 grew microbes; of 20 on Mont Poupet in the Jura, 5; of 20 near the Mer de Glace glacier at Montanvert, only 1. The air itself was not the cause: what mattered was what the air carried.',
 desc:'Twenty flasks opened at a chosen site, with each flask growing or staying clear. Your draw uses Pasteur’s published proportions; his own counts are shown beside it.',
 research:['Pasteur, L. (1860). Expériences relatives aux générations dites spontanées. Comptes rendus de l’Académie des sciences 50 and 51.','Pasteur, L. (1862). Mémoire sur les corpuscules organisés qui existent dans l’atmosphère. Annales de chimie et de physique (3rd series) 64.'],
 dur:12,hint:'Choose a site and open 20 flasks. Repeat a few times: your counts scatter around Pasteur’s.',
 init:()=>({site:'arbois',seed:1}),
 watch(p){return {site:['arbois','jura','mont'][Math.min(2,Math.floor(p*3))],seed:1+Math.floor(p*9)}},
 ui:[{choose:[['arbois','Lowland'],['jura','Jura hill'],['mont','Glacier']],label:'Site',get:s=>s.site,act:'site'},{b:'Open 20 new flasks',act:'again'}],
 on:{site(s,v){s.site=v},again(s){s.seed=(s.seed%97)+1}},
 draw(s){
  const S=A1_SITES[s.site];let out=A1_head(S.n+', '+S.h,'demonstrated');
  const r=rng(s.seed*17+S.p);let n=0;
  for(let i=0;i<20;i++){const x=70+(i%10)*48,y=96+Math.floor(i/10)*92,g=r()<S.p/20;if(g)n++;
   out+=Ci(x,y+40,18,g?'#c9a96a':'#f3e9c6',C.ink)+R(x-5,y,10,26,'#fff',C.ink,3);
   if(g)for(let k=0;k<5;k++)out+=Ci(x-9+((k*31)%18),y+34+((k*17)%14),1.6,'#6b4c1a')}
  out+=TBF(160,300,`Your draw: ${n} of 20 grew`,16,C.blue)+TBF(440,300,`Pasteur: ${S.p} of 20 grew`,16,C.coral);
  out+=TF(300,332,'Flasks of boiled yeast broth, opened briefly and resealed',13,C.muted);
  out+=TF(300,354,'Your draw is a simulation using Pasteur’s proportions',13,C.muted);
  return {svg:out,phase:s.site==='mont'?'High on the glacier the air carries few germs: almost every flask stays clear.':s.site==='jura'?'Higher and cleaner air: fewer flasks grow.':'Dusty lowland air carries many germs: many flasks grow.'};
 }});

const A1_MED={yeast:{n:'Yeast-water broth (Pasteur)',spores:0},hay:{n:'Hay infusion (Pouchet)',spores:1}};
const A1_TREAT={short:{n:'Boil 10 minutes',kv:1,ks:0},long:{n:'Boil 1 hour',kv:1,ks:.3},tynd:{n:'Tyndall: boil, rest a day, ×3',kv:1,ks:1},auto:{n:'Pressure-cook at 121 °C',kv:1,ks:1}};
SCENE({id:'pasteur-pouchet-hay',name:'Pouchet’s hay',tag:'Why boiled hay still grew',
 definition:'Félix Pouchet, a respected naturalist in Rouen, used infusions of hay. Even after boiling, his flasks often teemed with life, and he took this as evidence for spontaneous generation. He was reporting real results.',
 example:'Hay carries spores of hay bacillus (Bacillus subtilis) that survive boiling. In 1863 Pouchet and colleagues opened hay flasks high in the Pyrenees, on the Maladetta glacier, and all of them grew, unlike Pasteur’s yeast flasks. Ferdinand Cohn described heat-resistant bacterial spores in 1876, and John Tyndall showed in 1877 that heating, resting and reheating kills them.',
 desc:'Eight flasks of a chosen broth, treated by a chosen method, then left for a week. Hay brings heat-resistant spores; yeast water does not. Repeated heating lets spores germinate between boils and die.',
 research:['Pouchet, F.-A. (1859). Hétérogénie, ou traité de la génération spontanée.','Cohn, F. (1876). Untersuchungen über Bacterien IV. Beiträge zur Biologie der Pflanzen 2 (endospores).','Tyndall, J. (1877). Further researches on the deportment … of putrefactive and infective organisms. Philosophical Transactions 167.','Outcome model illustrative.'],
 dur:12,hint:'Compare yeast water and hay under each treatment. Which method finally makes hay flasks stay clear?',
 init:()=>({med:'hay',tr:'long'}),
 watch(p){const t=['short','long','tynd','auto'];return {med:p<.5?'yeast':'hay',tr:t[Math.min(3,Math.floor((p*2)%1*4))]}},
 ui:[{choose:[['yeast','Yeast water'],['hay','Hay']],label:'Broth',get:s=>s.med,act:'med'},{choose:[['short','10 min'],['long','1 hour'],['tynd','Tyndall ×3'],['auto','121 °C']],label:'Treatment',get:s=>s.tr,act:'tr'}],
 on:{med(s,v){s.med=v},tr(s,v){s.tr=v}},
 draw(s){
  const M=A1_MED[s.med],Tr=A1_TREAT[s.tr],pGrow=M.spores?(1-Tr.ks)*.95:.02;
  let out=A1_head(M.n+': '+Tr.n,'demonstrated');
  const r=rng(5+s.tr.length*3+(M.spores?11:0));let g=0;
  for(let i=0;i<8;i++){const cx=84+i*62,grow=r()<pGrow;if(grow)g++;
   out+=Ci(cx,150,24,grow?'#c9a96a':'#f3e9c6',C.ink)+R(cx-6,90,12,40,'#fff',C.ink,3)+P(`M${cx-6} 90Q${cx} 80 ${cx+6} 90`,C.ink,2.5);
   if(grow)for(let k=0;k<6;k++)out+=Ci(cx-12+((k*29)%24),142+((k*13)%16),1.7,'#6b4c1a')}
  out+=TBF(300,206,`${g} of 8 flasks grew within a week`,16,g?C.coral:C.green);
  const lines=M.spores?(s.tr==='short'||s.tr==='long'?['Hay is coated with bacterial spores.','Boiling kills the active cells but many','spores survive, then sprout and grow.']:s.tr==='tynd'?['Between boils, surviving spores sprout','into active cells, which the next boil','kills. Three rounds clear the flask.']:['Steam under pressure at 121 °C kills','even resistant spores in minutes:','the method used in labs today.']):['Yeast water carries few or no spores,','so ordinary boiling is enough and','sealed flasks stay clear.',''];
  out+=A1_card(80,232,440,M.spores?'Why the hay flasks behave differently':'Why yeast water stays clear',lines.filter(Boolean),M.spores&&g?C.coral:C.green);
  return {svg:out,phase:M.spores&&g?'Pouchet’s flasks grew because hay brings heat-resistant spores, not because life arose from the broth.':'With the spores killed, or never present, the broth stays clear.'};
 }});

const A1_VIEWS={
 pouchet:{n:'Pouchet’s case',c:C.amber,l:['A careful naturalist with a long record.','Boiled hay infusions grew again and again;','his glacier flasks in the Pyrenees all grew.','He argued life arises from organic matter','under the right conditions. His results were','real: he could not know about spores.']},
 pasteur:{n:'Pasteur’s case',c:C.blue,l:['Sterile broth stays sterile for months if','nothing living can get in: swan necks, and','fewer growths in cleaner air. Dust filtered','from the air is full of microbes.','His private notebooks show he set aside some','results that did not fit (Geison, 1995).']},
 commission:{n:'The 1864 Académie commission',c:C.purple,l:['The Académie des sciences named a commission','to repeat the experiments side by side.','Pouchet’s team withdrew before the tests,','objecting to the conditions, and the commission','found for Pasteur. Many historians see politics','and religion in how the debate was judged.']},
 settled:{n:'What was settled, and what was not',c:C.green,l:['Settled: in today’s world, microbes in sterile','broth come only from other microbes.','Not settled: how the very first life began','on the early Earth, under different conditions','over millions of years. That is a separate','question, and the rest of this course.']}};
SCENE({id:'pasteur-pouchet-contest',name:'Pasteur against Pouchet',tag:'A real controversy, fairly told',
 definition:'The Pasteur–Pouchet debate of the 1860s is often told as reason defeating superstition. Historians tell a more interesting story: two skilled experimenters, real but conflicting results, a commission that ruled before the cause of the conflict (spores) was understood, and a prize-winning answer to a narrower question than it seemed.',
 example:'Pasteur won the Académie’s Alhumbert prize in 1862. His famous 1864 lecture at the Sorbonne declared spontaneous generation dead. Yet Pouchet’s hay results were genuine and were only explained in the 1870s by Cohn and Tyndall.',
 desc:'Four views of the controversy as cards: Pouchet’s case, Pasteur’s case, the 1864 commission, and what the debate did and did not settle.',
 research:['Farley, J. & Geison, G. L. (1974). Science, politics and spontaneous generation in nineteenth-century France: the Pasteur–Pouchet debate. Bulletin of the History of Medicine 48.','Geison, G. L. (1995). The Private Science of Louis Pasteur. Princeton University Press.','Pasteur, L. (1864). Lecture at the Sorbonne “soirées scientifiques”, 7 April.'],
 dur:12,hint:'Read each view. Notice how much the last card leaves open.',
 init:()=>({v:'settled'}),
 watch(p){return {v:['pouchet','pasteur','commission','settled'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['pouchet','Pouchet'],['pasteur','Pasteur'],['commission','1864'],['settled','Settled?']],label:'View',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=v}},
 draw(s){
  const V=A1_VIEWS[s.v];let out=A1_head(V.n,'demonstrated');
  const ks=Object.keys(A1_VIEWS);
  ks.forEach((k,i)=>{const on=k===s.v;out+=R(40+i*132,64,124,30,on?A1_VIEWS[k].c:'#fff',A1_VIEWS[k].c,15,on?'':'opacity=".8"')+TF(102+i*132,84,['Pouchet','Pasteur','1864','Settled?'][i],13,on?'#fff':A1_VIEWS[k].c)});
  out+=R(40,112,520,180,'#fff',V.c,10);
  V.l.forEach((l,i)=>{out+=TF(60,142+i*25,l,14,C.ink,'start')});
  out+=TF(300,330,s.v==='settled'?'Spontaneous generation today ≠ the origin of life long ago':'Two skilled experimenters, conflicting results',14,s.v==='settled'?C.green:C.muted);
  return {svg:out,phase:s.v==='settled'?'Pasteur showed that life does not arise in sterile broth today. Whether chemistry produced the first life billions of years ago is a different, open question.':V.l.join(' ')};
 }});
