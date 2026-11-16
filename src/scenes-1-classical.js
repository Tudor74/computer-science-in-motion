/* ===================== Economics era 1 · Classical economics (1776–1870) ===================== */
// The pin factory, the invisible hand as Smith actually used it, Ricardo's cloth and wine, Malthus's race,
// diminishing returns and rent, and the labour theory of value as history of thought. Every picture is a pure
// function of state and X; models labelled illustrative are toys, published figures are given as published.
const E1_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function E1_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function E1_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,9,o.sel?'stroke-width="3"':'stroke-width="1.5"')+lines.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*17,t,o.size||13,o.ink||C.ink,'middle',o.bold&&i===0?'font-weight="700"':'')).join('');
 return hit(X,act,arg,label,inner);
}
// A text card: title plus wrapped lines (already split), drawn at fixed size.
function E1_card(x,y,w,title,lines,col=C.blue,fill='#fff'){
 const h=34+lines.length*18;
 return R(x,y,w,h,fill,col,10,'stroke-width="1.5"')+TBF(x+12,y+22,title,14,col,'start')+lines.map((t,i)=>TF(x+12,y+44+i*18,t,13,C.ink,'start')).join('');
}
// Thousands separators without locale differences.
const E1_int=n=>{const s=String(Math.round(Math.abs(n)));return (n<0?'−':'')+s.replace(/\B(?=(\d{3})+(?!\d))/g,',')};
const E1_f=(v,d=2)=>Number(v).toFixed(d);

/* ================================================================ division-of-labour */
// Smith's figures: one untrained worker, at most 20 pins a day; ten workers dividing about eighteen operations, 48,000.
// Between the two published ends, output per worker is interpolated geometrically (illustrative).
const E1_OPS=['draw wire','straighten','cut','point','grind top','make head','make head','make head','fix head','whiten','polish','sort','count','fold paper','prick paper','stick pins','pack','carry'];
const E1_perWorker=(w,org)=>org==='alone'?20:20*Math.pow(240,(w-1)/9);
SCENE({id:'division-of-labour',name:'The pin factory',tag:'Division of labour',
 definition:'Dividing a job into small operations, each done by a different worker, can multiply what each worker produces. Adam Smith opened The Wealth of Nations (1776) with a pin workshop to show it.',
 example:'Smith reported that ten workers sharing about eighteen operations made some 48,000 pins a day, 4,800 each, while one worker making whole pins alone could “certainly not make twenty”.',
 desc:'Eighteen pin-making operations shared out among the workers, coloured by who does them, with pins per day for the whole workshop and per worker on a log scale.',
 research:'Smith, A. (1776). An Inquiry into the Nature and Causes of the Wealth of Nations, Book I, chapter 1. The figures between one and ten workers are illustrative; the two ends are Smith’s.',
 dur:10,hint:'Change the number of workers and how the work is organised. Smith’s two numbers are the ends of the scale; the steps in between are an illustration.',
 init:()=>({w:10,org:'divided'}),
 watch(p){return {w:1+Math.min(9,Math.floor(p*11)),org:'divided'}},
 ui:[{range:'w',label:'Workers',min:1,max:10,step:1,get:s=>s.w,act:'w'},
  {choose:[['alone','Each makes whole pins'],['divided','Operations divided']],label:'Organisation',get:s=>s.org,act:'org'}],
 on:{w(s,v){s.w=Number(v);return 'keep'},org(s,v){s.org=v;return 'keep'}},
 draw(s){
  const {w,org}=s,per=E1_perWorker(w,org),tot=per*w;let out=heading('Smith’s pin workshop',28);
  const cols=[C.blue,C.coral,C.green,C.purple,C.amber,'#3a8fb7','#b0337a','#6b8e23','#8a5a2b','#546873'];
  out+=TF(30,62,org==='alone'?`Each of the ${w} worker${w>1?'s':''} does all 18 operations`:`The 18 operations shared among ${w} worker${w>1?'s':''}`,14,C.ink,'start');
  E1_OPS.forEach((op,i)=>{const x=30+(i%9)*60,y=74+Math.floor(i/9)*52,who=org==='alone'?0:Math.floor(i*w/18);
   out+=R(x,y,54,44,org==='alone'?'#fff':cols[who%10]+'22',org==='alone'?C.line:cols[who%10],7,'stroke-width="1.5"');
   out+=TBF(x+27,y+30,String(i+1),15,org==='alone'?C.muted:cols[who%10]);
  });
  // Log-scale bars: pins per worker and for the whole shop.
  const lg=v=>Math.log10(Math.max(1,v)),bx=150,bw=300,bar=(y,v,col,lab)=>R(bx,y,bw*lg(v)/5,22,col,'none',5)+TF(bx-8,y+16,lab,13,C.ink,'end')+TBF(bx+bw*lg(v)/5+8,y+16,E1_int(v),13,col,'start');
  out+=TF(30,190,'They include drawing, straightening, cutting and pointing the wire, three',13,C.muted,'start')+TF(30,206,'operations for the head, whitening, and sticking pins in paper (Smith’s list).',13,C.muted,'start');
  out+=TF(30,226,'pins a day (log scale: each step is ×10)',13,C.muted,'start');
  [1,10,100,1000,10000,100000].forEach((v,i)=>{out+=L(bx+bw*i/5,230,bx+bw*i/5,296,C.grid,1)+TF(bx+bw*i/5,312,v>=1000?E1_int(v):String(v),12.5,C.muted)});
  out+=bar(236,per,C.blue,'per worker')+bar(268,tot,C.coral,'whole shop');
  out+=counter(470,236,'vs one alone',org==='alone'?'×1':'×'+E1_int(per/20),C.green,110);
  return {svg:out,phase:org==='alone'?`Working alone, each worker makes at most about 20 pins a day, so ${w} worker${w>1?'s':''} make about ${E1_int(tot)}.`:`With the work divided among ${w}, each worker makes about ${E1_int(per)} pins a day${w===10?', Smith’s 4,800':''}; the shop makes about ${E1_int(tot)}. ${w===10?'That is 240 times what one worker could do alone.':'(Steps between Smith’s two figures are illustrative.)'}`};
 }});

// Smith gave three reasons but no numbers; the factors here (×4, ×3, ×20, multiplying to 240) are illustrative.
const E1_REASONS=[['dex','Dexterity','one task, repeated, gets faster',4],['switch','No switching','no time lost between tasks',3],['mach','Machines','simple tasks invite machines',20]];
SCENE({id:'division-of-labour-why',name:'Why dividing work helps',tag:'Smith’s three reasons',
 definition:'Smith gave three reasons why divided work is more productive: workers grow more dexterous at one task, no time is lost switching between tasks, and simple repeated tasks invite tools and machines.',
 example:'If dexterity made each worker 4 times faster, no switching saved a factor of 3 and machines a factor of 20, the gains would multiply to 240, the ratio in Smith’s pin numbers. Smith gave the reasons, not this split.',
 desc:'Three switches for Smith’s three reasons, with a bar for output per worker that grows by multiplying the factors that are switched on, on a log scale.',
 research:'Smith, A. (1776). The Wealth of Nations, Book I, chapter 1 (the three circumstances). Ibn Khaldun’s Muqaddimah (1377) had already argued that cooperation and the division of crafts let people produce more than they need. The numerical split here is illustrative.',
 dur:9,hint:'Switch each of Smith’s reasons on or off. The factors are invented for illustration; only their product, 240, matches Smith’s pin figures.',
 init:()=>({dex:true,switch:true,mach:true}),
 watch(p){const k=Math.floor(p*4);return {dex:k>=1,switch:k>=2,mach:k>=3}},
 ui:E1_REASONS.map(([k,l])=>({b:l,act:'tog',arg:k})),
 on:{tog(s,k){s[k]=!s[k];return 'keep'}},
 draw(s,f,X){
  let out=heading('Three reasons divided work is faster',28),m=1;
  E1_REASONS.forEach(([k,l,why,fac],i)=>{const on=!!s[k],y=58+i*70;if(on)m*=fac;
   out+=E1_btn(X,'tog',k,`${l}: ${on?'on':'off'}. Press to switch.`,30,y,250,58,[(on?'✓ ':'○ ')+l,why],{sel:on,stroke:on?C.green:C.line,bold:true,size:13});
   out+=TBF(300,y+36,on?'×'+fac:'×1',17,on?C.green:C.muted,'start');
  });
  const lg=v=>Math.log10(v)/Math.log10(300);
  out+=R(380,70,60,236,'#fff',C.grid,6)+R(388,306-228*lg(20*m)/ (Math.log10(6000)/Math.log10(300)),44,228*lg(20*m)/(Math.log10(6000)/Math.log10(300)),C.blue,'none',4);
  out+=TF(410,326,'pins per',13,C.muted)+TF(410,342,'worker',13,C.muted);
  out+=counter(460,96,'pins per worker',E1_int(20*m),C.blue,120)+counter(460,156,'gain',`×${m}`,C.green,120);
  out+=TF(30,290,'Factors are illustrative;',13,C.muted,'start')+TF(30,308,'their product, 240, matches',13,C.muted,'start')+TF(30,326,'Smith’s 20 → 4,800 pins.',13,C.muted,'start');
  return {svg:out,phase:`With ${E1_REASONS.filter(r=>s[r[0]]).map(r=>r[1].toLowerCase()).join(', ')||'no reasons'} switched on, output per worker is ×${m}, about ${E1_int(20*m)} pins a day. Smith named the reasons; how much each contributes is not known, so the split is an illustration.`};
 }});

// The extent of the market: a team only pays if it can sell what it makes.
SCENE({id:'division-of-labour-market',name:'Limited by the market',tag:'The extent of the market',
 definition:'Smith’s third chapter argues that the division of labour is limited by the extent of the market: a specialist is only worth employing if enough buyers want what they make. He also warned that a lifetime of one simple task could stunt a worker, and proposed public schooling.',
 example:'A village that buys a few hundred pins a day cannot keep even two specialist pin-makers busy, so its smith does many jobs; a city market of tens of thousands can support a full team.',
 desc:'A market-size slider on a log scale sets the largest pin team that can sell its whole output, with output per worker; a second view shows Smith’s own warning about repetitive work.',
 research:'Smith, A. (1776). The Wealth of Nations, Book I, chapter 3, and Book V, chapter 1, part III (on the effects of repetitive work and the case for parish schools). Stigler, G. J. (1951). The division of labor is limited by the extent of the market. Journal of Political Economy 59, 185–193.',
 dur:10,hint:'Slide the size of the market. Better roads, canals and ports widen markets, which is why Smith tied specialisation to trade.',
 init:()=>({m:3,view:'market'}),
 watch(p){return {m:1.5+p*3.5,view:'market'}},
 ui:[{choose:[['market','Extent of the market'],['warning','Smith’s warning']],label:'View',get:s=>s.view,act:'view'},
  {range:'m',label:'Pins bought per day (log)',min:1.5,max:5,step:.1,get:s=>s.m,act:'m',show:v=>E1_int(Math.pow(10,Number(v)))}],
 on:{view(s,v){s.view=v;return 'keep'},m(s,v){s.m=Number(v);s.view='market';return 'keep'}},
 draw(s){
  if(s.view==='warning'){
   let out=heading('Smith’s own warning',28);
   out+=E1_card(40,56,520,'Book V (1776): the cost of one simple task',['A worker who spends his whole life on a few simple operations “generally','becomes as stupid and ignorant as it is possible for a human creature','to become”, Smith wrote, unless the state takes care to prevent it.'],C.coral);
   out+=E1_card(40,176,520,'His remedy',['Small parish schools, cheap enough for labourers’ children, teaching','reading, writing and arithmetic, partly paid for by the public.'],C.green);
   out+=TF(300,300,'The same book that praises the pin factory worries about the pin-maker.',13,C.muted);
   return {svg:out,phase:'Smith did not treat the division of labour as purely good: he expected it to dull the minds of workers doing one task, and argued for public education to offset it.'};
  }
  const M=Math.pow(10,s.m);let w=1;for(let k=10;k>=1;k--){if(k*E1_perWorker(k,'divided')<=M){w=k;break}}
  const per=E1_perWorker(w,'divided'),made=Math.min(M,w*per);let out=heading('How big a team can the market support?',28);
  const pl=E1_plot(70,64,300,220,[1.5,5],[0,10.5],{xt:[[2,'100'],[3,'1,000'],[4,'10,000'],[5,'100,000']],yt:[[0,'0'],[5,'5'],[10,'10']],xl:'pins bought per day (log scale)',yl:'workers in the team'});
  out+=pl.svg;
  const pts=[];for(let m=1.5;m<=5.001;m+=.02){const MM=Math.pow(10,m);let k=1;for(let j=10;j>=1;j--){if(j*E1_perWorker(j,'divided')<=MM){k=j;break}}pts.push([pl.X(m),pl.Y(k)])}
  out+=E1_poly(pts,C.blue,2.6)+Ci(pl.X(s.m),pl.Y(w),7,C.coral,'#fff');
  const place=M<1000?'a village':M<20000?'a market town':'a city';
  out+=counter(400,70,'market',place,C.ink,170)+counter(400,128,'team size',String(w),C.coral,170)+counter(400,186,'pins per worker',E1_int(per),C.blue,170);
  out+=TF(485,268,'Team sizes come from',13,C.muted)+TF(485,286,'the illustrative curve',13,C.muted)+TF(485,304,'in the pin-factory scene.',13,C.muted);
  return {svg:out,phase:`A market of about ${E1_int(M)} pins a day supports a team of ${w}${w===1?': one worker doing every operation':''}, each making about ${E1_int(per)}. Only a large market keeps a fully divided workshop busy.`};
 }});

/* ================================================================ invisible-hand */
const E1_HAND=[
 {k:'astro',t:'History of Astronomy',b:'Astronomy essay',y:'c. 1750s, pub. 1795',ctx:['Pagan peoples blamed odd events such as thunder on','“the invisible hand of Jupiter”. Here it mocks','superstition; it has nothing to do with markets.']},
 {k:'tms',t:'Theory of Moral Sentiments',b:'Moral Sentiments',y:'1759',ctx:['The rich, consuming little more than the poor, are','“led by an invisible hand” to share out the necessities','of life almost as if the land had been divided equally.']},
 {k:'won',t:'Wealth of Nations',b:'Wealth of Nations',y:'1776, Book IV, ch. 2',ctx:['A merchant who prefers investing at home, for his own','security, is “led by an invisible hand” to support','domestic industry. It appears once in about 380,000 words.']}];
SCENE({id:'invisible-hand',name:'What Smith actually wrote',tag:'The invisible hand',
 definition:'“The invisible hand” is now used as shorthand for markets coordinating selfish choices. Smith used the phrase only three times in his surviving work, each time in passing, and once in The Wealth of Nations.',
 example:'In The Wealth of Nations the phrase is about merchants preferring to invest at home. Its fame as the book’s central idea came mostly from twentieth-century textbooks, Paul Samuelson’s Economics (1948) among the earliest.',
 desc:'Three cards, one for each place the phrase appears, with its context, and a strip comparing one mention with the length of The Wealth of Nations.',
 research:'Smith, A. (1759). The Theory of Moral Sentiments, part IV, chapter 1; (1776) The Wealth of Nations, Book IV, chapter 2; (1795) Essays on Philosophical Subjects (“History of Astronomy”). Rothschild, E. (2001). Economic Sentiments. Harvard University Press. Kennedy, G. (2009). Adam Smith and the invisible hand: from metaphor to myth. Econ Journal Watch 6, 239–263.',
 dur:9,hint:'Press each of the three places Smith used the phrase to read what it was about.',
 init:()=>({pick:'won'}),
 watch(p){return {pick:E1_HAND[Math.min(2,Math.floor(p*3))].k}},
 ui:[{choose:E1_HAND.map(h=>[h.k,h.t]),label:'Where',get:s=>s.pick,act:'pick'}],
 on:{pick(s,v){s.pick=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('Three uses of “invisible hand”',28);
  E1_HAND.forEach((h,i)=>{out+=E1_btn(X,'pick',h.k,`${h.t}, ${h.y}`,30+i*184,52,172,62,[h.b,h.y],{sel:s.pick===h.k,stroke:s.pick===h.k?C.blue:C.line,bold:true})});
  const h=E1_HAND.find(x=>x.k===s.pick)||E1_HAND[2];
  out+=E1_card(30,132,540,h.t+' ('+h.y.split(',')[0]+')',h.ctx,C.blue);
  out+=TF(30,256,'The Wealth of Nations: about 380,000 words, one “invisible hand”',13,C.muted,'start');
  out+=R(30,266,540,20,'#eef3f6','none',4)+R(30+540*.62,264,3,24,C.coral,'none',1);
  out+=TF(300,316,'Its fame as Smith’s central doctrine came later, largely from 20th-century textbooks.',13,C.ink);
  out+=TF(300,336,'(Smith’s argument about markets runs through the whole book, not through this phrase.)',13,C.muted);
  return {svg:out,phase:`${h.t}: ${h.ctx.join(' ').replace(/  +/g,' ')}`};
 }});

// Two towns, twenty bakers who move to wherever bread sells dearer (illustrative adjustment rule).
function E1_bakers(dB,weeks){
 const DA=100;let nB=10;const hist=[];
 const price=(D,n)=>Math.max(.2,1+(D-10*n)/100);
 for(let t=0;t<=weeks;t++){const pA=price(DA,20-nB),pB=price(dB,nB);hist.push({t,nB,pA,pB});
  if(pB-pA>.05&&nB<20)nB++;else if(pA-pB>.05&&nB>0)nB--;}
 return hist;
}
SCENE({id:'invisible-hand-prices',name:'Prices as signals',tag:'Coordination without a plan',
 definition:'When demand rises somewhere, its price rises; producers chasing the better price move resources there until prices even out. No one plans the move: the price carries the information. This is the idea later read into Smith’s phrase.',
 example:'If the people of town B start wanting 150 loaves a day instead of 100, bread there gets dearer, bakers drift from A to B, and within a few weeks the two prices meet again with about 12 or 13 bakers in B.',
 desc:'Two towns with twenty bakers between them, the price of bread in each, and a chart of both prices week by week as bakers move to the dearer town.',
 research:'Smith, A. (1776). The Wealth of Nations, Book I, chapter 7 (natural and market price). Hayek, F. A. (1945). The use of knowledge in society. American Economic Review 35, 519–530. The adjustment rule here (one baker moves per week) is illustrative.',
 dur:10,hint:'Change how much bread town B wants and how many weeks pass. Bakers move one at a time towards the higher price.',
 init:()=>({dB:150,wk:12}),
 watch(p){return {dB:150,wk:Math.round(p*12)}},
 ui:[{range:'dB',label:'Loaves wanted in town B',min:40,max:200,step:10,get:s=>s.dB,act:'dB'},{range:'wk',label:'Weeks',min:0,max:12,step:1,get:s=>s.wk,act:'wk'}],
 on:{dB(s,v){s.dB=Number(v);return 'keep'},wk(s,v){s.wk=Number(v);return 'keep'}},
 draw(s){
  const H=E1_bakers(s.dB,12),now=H[Math.min(12,s.wk)];let out=heading('Bread prices in two towns',28);
  const town=(x,name,n,p,D)=>{let o=R(x,50,250,128,'#fff',C.grid,10)+TBF(x+14,72,name,14,C.ink,'start')+TF(x+236,72,`wants ${D} loaves`,13,C.muted,'end');
   for(let i=0;i<n;i++)o+=Ci(x+22+(i%10)*22,96+Math.floor(i/10)*24,8,C.amber,'#fff');
   o+=TF(x+14,166,`${n} bakers · price £${E1_f(p)}`,14,C.blue,'start');return o};
  out+=town(30,'Town A',20-now.nB,now.pA,100)+town(320,'Town B',now.nB,now.pB,s.dB);
  const pl=E1_plot(70,214,470,104,[0,12],[0,2.4],{xt:[[0,'0'],[4,'4'],[8,'8'],[12,'12 weeks']],yt:[[0,'£0'],[1,'£1'],[2,'£2']],yl:'price of a loaf'});
  out+=pl.svg+E1_poly(H.map(h=>[pl.X(h.t),pl.Y(Math.min(2.4,h.pA))]),C.green,2.4)+E1_poly(H.map(h=>[pl.X(h.t),pl.Y(Math.min(2.4,h.pB))]),C.coral,2.4);
  out+=L(pl.X(s.wk),214,pl.X(s.wk),318,C.ink,1,'stroke-dasharray="4 4"');
  out+=TF(540,232,'A',13,C.green,'end')+TF(526,232,'B',13,C.coral,'end');
  const settled=Math.abs(now.pA-now.pB)<=.05;
  return {svg:out,phase:`Week ${s.wk}: bread costs £${E1_f(now.pA)} in A and £${E1_f(now.pB)} in B, with ${now.nB} of the 20 bakers in B. ${settled?'The prices have met: no baker gains by moving.':'Bakers keep moving towards the dearer town.'} Nobody planned the move; the price difference was the signal.`};
 }});

const E1_LIMITS=[
 {k:'collude',t:'Merchants collude',l:['“People of the same trade seldom meet together, even for merriment','and diversion, but the conversation ends in a conspiracy against the','publick, or in some contrivance to raise prices.” (Book I, ch. 10)'],m:'Modern name: cartels; the case for competition law.'},
 {k:'public',t:'Public works',l:['Some works, such as roads, bridges and harbours, are useful to a whole','society but would never repay a private builder, so the state should','provide them. (Book V, ch. 1)'],m:'Modern name: public goods (see externalities, era 2).'},
 {k:'school',t:'Education',l:['Repetitive work dulls workers, so the public should help pay for','schools that teach reading, writing and arithmetic. (Book V, ch. 1)'],m:'Modern name: positive externalities of education.'},
 {k:'banks',t:'Banking rules',l:['Smith backed limits on small bank notes: a man’s liberty to issue','them could endanger the whole society, like a fire spreading','between houses, which is why party walls are required. (Book II, ch. 2)'],m:'Modern name: financial regulation and systemic risk.'}];
SCENE({id:'invisible-hand-limits',name:'Smith’s own exceptions',tag:'Not a doctrine of no rules',
 definition:'Smith argued for freer trade and against monopolies, but he also listed things markets do badly: merchants colluding, public works no one would build for profit, education, and banking.',
 example:'The same author who described the gains from self-interest wrote that people of the same trade “seldom meet together … but the conversation ends in a conspiracy against the publick”.',
 desc:'Four cards with Smith’s own exceptions to leaving things to the market, each with its modern name.',
 research:'Smith, A. (1776). The Wealth of Nations, Book I ch. 10; Book II ch. 2; Book V ch. 1. Viner, J. (1927). Adam Smith and laissez faire. Journal of Political Economy 35, 198–232. Rothschild, E. (2001). Economic Sentiments.',
 dur:10,hint:'Press each exception to read what Smith wrote and what it is called today.',
 init:()=>({pick:'collude'}),
 watch(p){return {pick:E1_LIMITS[Math.min(3,Math.floor(p*4))].k}},
 ui:[{choose:E1_LIMITS.map(c=>[c.k,c.t]),label:'Exception',get:s=>s.pick,act:'pick'}],
 on:{pick(s,v){s.pick=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('Where Smith wanted rules',28);
  E1_LIMITS.forEach((c,i)=>{out+=E1_btn(X,'pick',c.k,c.t,30+i*137,52,128,46,c.t,{sel:s.pick===c.k,stroke:s.pick===c.k?C.coral:C.line,bold:true})});
  const c=E1_LIMITS.find(x=>x.k===s.pick)||E1_LIMITS[0];
  out+=E1_card(30,118,540,c.t,c.l,C.coral);
  out+=R(30,228,540,40,C.greenp,'none',8)+TF(46,253,c.m,14,C.green,'start');
  out+=TF(300,310,'Smith argued for freer trade and against monopolies; he did not argue for no rules at all.',13,C.muted);
  return {svg:out,phase:`${c.t}: ${c.l.join(' ')} ${c.m}`};
 }});

/* ================================================================ comparative-advantage */
// Ricardo (1817), chapter 7: men-years of labour per unit.
const E1_RIC={E:{cloth:100,wine:120,L:220},P:{cloth:90,wine:80,L:170}};
const E1_out=(c,share)=>({cloth:E1_RIC[c].L*share/E1_RIC[c].cloth,wine:E1_RIC[c].L*(1-share)/E1_RIC[c].wine});
SCENE({id:'comparative-advantage',name:'Cloth and wine',tag:'Comparative advantage',
 definition:'A country gains from trade by specialising in what it gives up least to produce (its comparative advantage), even if another country is better at making everything (absolute advantage). David Ricardo’s 1817 example uses England and Portugal.',
 example:'Portugal needs fewer workers than England for both cloth (90 against 100) and wine (80 against 120). Still, if England makes only cloth and Portugal only wine, the two together make more of both: 2.2 units of cloth and about 2.13 of wine, instead of 2 and 2.',
 desc:'England’s 220 and Portugal’s 170 men-years of labour split between cloth and wine, with each country’s output and the world total against the no-trade totals of 2 cloth and 2 wine.',
 research:'Ricardo, D. (1817). On the Principles of Political Economy and Taxation, chapter 7 (labour figures 100 and 120 for England, 90 and 80 for Portugal). Torrens, R. (1815) stated the idea earlier; Ruffin, R. J. (2002). David Ricardo’s discovery of comparative advantage. History of Political Economy 34, 727–748.',
 dur:10,hint:'Move each country’s share of labour spent on cloth, or press a preset. Watch the world totals: specialising by comparative advantage gives more of both goods.',
 init:()=>({e:100/220,p:90/170}),
 watch(p){const u=smooth(clamp((p-.2)/.6,0,1));return {e:lerp(100/220,1,u),p:lerp(90/170,0,u)}},
 ui:[{range:'e',label:'England: share of labour on cloth',min:0,max:1,step:.01,get:s=>s.e,act:'e',show:v=>Math.round(v*100)+'%'},
  {range:'p',label:'Portugal: share of labour on cloth',min:0,max:1,step:.01,get:s=>s.p,act:'p',show:v=>Math.round(v*100)+'%'},
  {b:'No trade',act:'preset',arg:'none'},{b:'Specialise',act:'preset',arg:'spec'},{b:'Wrong way round',act:'preset',arg:'wrong'}],
 on:{e(s,v){s.e=Number(v);return 'keep'},p(s,v){s.p=Number(v);return 'keep'},
  preset(s,a){if(a==='none'){s.e=100/220;s.p=90/170}else if(a==='spec'){s.e=1;s.p=0}else{s.e=0;s.p=1}return 'keep'}},
 draw(s){
  const E=E1_out('E',s.e),Pt=E1_out('P',s.p),cl=E.cloth+Pt.cloth,wi=E.wine+Pt.wine;let out=heading('Ricardo’s England and Portugal',28);
  const panel=(x,name,c,share,o)=>{let g=R(x,50,260,150,'#fff',C.grid,10)+TBF(x+14,72,name,15,C.ink,'start')+TF(x+246,72,`${E1_RIC[c].L} men-years`,13,C.muted,'end');
   g+=TF(x+14,96,`cloth: ${E1_RIC[c].cloth} a unit · wine: ${E1_RIC[c].wine} a unit`,13,C.muted,'start');
   g+=R(x+14,108,232,22,C.purplep,'none',4)+R(x+14,108,232*share,22,C.blue,'none',4)+TF(x+20,124,'cloth '+Math.round(share*100)+'%',12.5,share>.25?'#fff':C.ink,'start')+TF(x+240,124,'wine',12.5,C.purple,'end');
   g+=TF(x+14,156,`makes ${E1_f(o.cloth)} cloth`,14,C.blue,'start')+TF(x+14,180,`and ${E1_f(o.wine)} wine`,14,C.purple,'start');return g};
  out+=panel(30,'England','E',s.e,E)+panel(310,'Portugal','P',s.p,Pt);
  const d=(v)=>(v>=2?'+':'')+E1_f(v-2);
  out+=counter(90,220,'world cloth',E1_f(cl),cl>=1.995?C.green:C.coral,130)+counter(230,220,'vs no trade',d(cl),cl>=1.995?C.green:C.coral,110);
  out+=counter(360,220,'world wine',E1_f(wi),wi>=1.995?C.green:C.coral,130)+counter(500,220,'vs no trade',d(wi),wi>=1.995?C.green:C.coral,80);
  out+=TF(300,300,'Portugal is better at both goods, but relatively better at wine:',13,C.ink);
  out+=TF(300,318,'wine costs it 80/90 = 0.89 cloth, against 120/100 = 1.2 cloth in England.',13,C.ink);
  const both=cl>2.001&&wi>2.001;
  return {svg:out,phase:`The world makes ${E1_f(cl)} cloth and ${E1_f(wi)} wine. ${both?'Both totals beat the no-trade 2 and 2: specialising by comparative advantage frees labour, so there is more of both.':cl<1.995||wi<1.995?'At least one total is below the no-trade 2: this split wastes labour.':'Compare with Specialise to see the gain.'}`};
 }});

// Terms of trade: England keeps 1.1 cloth and exports 1.1 for 1.1·t wine.
SCENE({id:'comparative-advantage-ppf',name:'Who gains, at what price',tag:'Terms of trade',
 definition:'A country’s production possibility frontier shows every mix of goods it could make on its own. Trade lets it consume outside that line, as long as the exchange rate between the goods, the terms of trade, lies between the two countries’ own costs.',
 example:'Cloth costs England 0.83 units of wine to make and Portugal 1.125. At any price between those, say 1 wine per cloth, both countries end up with more than they could make alone.',
 desc:'Each country’s frontier as a straight line, its consumption point after trading 1.1 cloth for wine at the chosen terms of trade, and a verdict for each country.',
 research:'Ricardo, D. (1817). Principles, chapter 7. Mill, J. S. (1848). Principles of Political Economy, Book III, chapter 18 (on how the terms of trade are settled). The frontier picture is Haberler, G. (1936). The Theory of International Trade.',
 dur:10,hint:'Move the terms of trade. Between 0.83 and 1.125 wine per cloth both countries gain; outside that range one would rather not trade.',
 init:()=>({t:1}),
 watch(p){return {t:lerp(.7,1.25,p)}},
 ui:[{range:'t',label:'Terms of trade (wine per cloth)',min:.6,max:1.4,step:.01,get:s=>s.t,act:'t',show:v=>E1_f(v)}],
 on:{t(s,v){s.t=Number(v);return 'keep'}},
 draw(s){
  const t=s.t,ex=1.1;let out=heading('Trading outside your own frontier',28);
  const panel=(x,name,cmax,wmax,cons,ok)=>{const pl=E1_plot(x+40,84,190,170,[0,2.6],[0,2.6],{xt:[[0,'0'],[1,'1'],[2,'2']],yt:[[1,'1'],[2,'2']],xl:'cloth',xlDy:31,yl:'wine'});
   let g=pl.svg+TBF(x+135,56,name,14,C.ink)+L(pl.X(cmax),pl.Y(0),pl.X(0),pl.Y(wmax),C.blue,2.6);
   g+=Ci(pl.X(cons[0]),pl.Y(cons[1]),7,ok?C.green:C.coral,'#fff');
   g+=TF(pl.X(cons[0])+10,pl.Y(cons[1])-8,'after trade',12.5,ok?C.green:C.coral,'start');
   return g};
  const Ec=[2.2-ex,ex*t],Pc=[ex,2.125-ex*t];
  const Eok=Ec[1]>(220-100*Ec[0])/120+1e-9,Pok=Pc[1]>(170-90*Pc[0])/80+1e-9;
  out+=panel(20,'England (makes 2.2 cloth)',2.2,220/120,Ec,Eok)+panel(310,'Portugal (makes 2.125 wine)',170/90,2.125,Pc,Pok);
  out+=counter(70,300,'England',Eok?'gains':'loses',Eok?C.green:C.coral,160)+counter(360,300,'Portugal',Pok?'gains':'loses',Pok?C.green:C.coral,160);
  out+=TF(300,366,`Exchange: 1.1 cloth for ${E1_f(ex*t)} wine`,13,C.muted);
  return {svg:out,phase:`At ${E1_f(t)} wine per cloth, England ends at ${E1_f(Ec[0])} cloth and ${E1_f(Ec[1])} wine, ${Eok?'outside':'inside'} its frontier; Portugal at ${E1_f(Pc[0])} cloth and ${E1_f(Pc[1])} wine, ${Pok?'outside':'inside'} its. ${Eok&&Pok?'Both gain.':'This price is outside the range 0.83–1.125 where both gain.'}`};
 }});

SCENE({id:'comparative-advantage-limits',name:'Costs and losers',tag:'What the simple model leaves out',
 definition:'Ricardo’s example assumes no transport costs and workers who move freely between industries. Shipping costs eat into the gains, and inside each country some people lose even when the country as a whole gains.',
 example:'If a tenth of every shipment were lost on the way, Portugal’s gain in Ricardo’s example would vanish; England’s would survive until about a sixth was lost. And English wine-makers, or Portuguese weavers, lose their trade.',
 desc:'A transport-cost slider shows each country’s gain from trading one cloth for one wine shrinking to nothing; a second view lists who gains and who loses inside each country.',
 research:'Ricardo, D. (1817). Principles, chapter 7. Stolper, W. F. & Samuelson, P. A. (1941). Protection and real wages. Review of Economic Studies 9, 58–73. Samuelson, P. A. (1954) on “iceberg” transport costs. Autor, D., Dorn, D. & Hanson, G. (2013). The China syndrome. American Economic Review 103, 2121–2168.',
 dur:10,hint:'Raise the share lost in shipping and watch the gains disappear, or switch to see who wins and who loses inside each country.',
 init:()=>({c:.05,view:'transport'}),
 watch(p){return {c:p*.22,view:'transport'}},
 ui:[{choose:[['transport','Transport costs'],['inside','Winners and losers']],label:'View',get:s=>s.view,act:'view'},{range:'c',label:'Share lost in shipping',min:0,max:.25,step:.01,get:s=>s.c,act:'c',show:v=>Math.round(v*100)+'%'}],
 on:{view(s,v){s.view=v;return 'keep'},c(s,v){s.c=Number(v);s.view='transport';return 'keep'}},
 draw(s){
  if(s.view==='inside'){
   let out=heading('Inside each country',28);
   out+=E1_card(30,52,265,'England',['Gain: cloth workers and owners,','wine drinkers (cheaper wine).','Lose: English wine-makers, until','they find work in cloth.'],C.blue);
   out+=E1_card(305,52,265,'Portugal',['Gain: wine growers, cloth buyers.','Lose: Portuguese weavers, until','they find work in vineyards.',''],C.purple);
   out+=E1_card(30,180,540,'Stolper–Samuelson (1941)',['Trade raises the real income of the factor a country has plenty of and','lowers it for the scarce factor. Moving between jobs takes time, so','losses can last: Autor and colleagues (2013) found it for US towns.'],C.coral);
   return {svg:out,phase:'The country gains on average, but the gain is not shared out automatically: people in the shrinking industry lose, at least for a while. Whether they are compensated is a political choice.'};
  }
  const c=s.c,gE=.2*(100/120)-c,gP=.125-1.125*c;let out=heading('Shipping eats the gains',28);
  const pl=E1_plot(70,60,330,230,[0,.25],[-.15,.2],{xt:[[0,'0%'],[.1,'10%'],[.2,'20%']],yt:[[-.1,'−0.1'],[0,'0'],[.1,'0.1'],[.2,'0.2']],xl:'share of each shipment lost',yl:'gain (in each country’s own wine units)'});
  out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(.25),pl.Y(0),C.ink,1.2);
  out+=E1_poly([[pl.X(0),pl.Y(.2*100/120)],[pl.X(.25),pl.Y(.2*100/120-.25)]],C.blue,2.6)+E1_poly([[pl.X(0),pl.Y(.125)],[pl.X(.25),pl.Y(Math.max(-.15,.125-1.125*.25))]],C.purple,2.6);
  out+=L(pl.X(c),60,pl.X(c),290,C.ink,1,'stroke-dasharray="4 4"');
  out+=TF(pl.X(.2),pl.Y(.167-.2)-10,'England',13,C.blue,'start')+TF(pl.X(.12),pl.Y(.125-1.125*.12)+22,'Portugal',13,C.purple,'end');
  out+=counter(430,70,'England’s gain',E1_f(gE,3),gE>0?C.green:C.coral,140)+counter(430,130,'Portugal’s gain',E1_f(gP,3),gP>0?C.green:C.coral,140);
  out+=TF(500,214,'England stops gaining',13,C.muted)+TF(500,232,'at about 16.7%;',13,C.muted)+TF(500,256,'Portugal at about 11.1%.',13,C.muted);
  return {svg:out,phase:`With ${Math.round(c*100)}% of each shipment lost, England’s gain is ${E1_f(gE,3)} and Portugal’s ${E1_f(gP,3)} (in wine units). ${gE>0&&gP>0?'Both still gain.':gE>0||gP>0?'One country no longer gains, so this trade would not happen voluntarily.':'Neither gains: transport costs have eaten the whole benefit.'}`};
 }});

/* ================================================================ malthus-population */
SCENE({id:'malthus-population',name:'Malthus’s race',tag:'Geometric against arithmetic',
 definition:'Thomas Malthus argued in 1798 that population, unchecked, grows geometrically (doubling every 25 years) while food can grow only arithmetically (by the same amount each period), so population is always pressed back by “checks”: misery and vice, and later, he added, moral restraint.',
 example:'Malthus’s own sequences: population as 1, 2, 4, 8, 16, 32, 64, 128, 256 and food as 1, 2, 3, 4, 5, 6, 7, 8, 9 over two centuries, so food per person would fall to 9/256.',
 desc:'Malthus’s two sequences as bars for each 25-year step, with food per person falling as the gap widens.',
 research:'Malthus, T. R. (1798). An Essay on the Principle of Population, chapter 2 (the two sequences); second edition (1803) adds moral restraint as a preventive check. Harriet Martineau popularised his ideas in Illustrations of Political Economy (1832–34).',
 dur:10,hint:'Step through the 25-year periods. Malthus’s numbers are a thought experiment about what would happen without any checks.',
 init:()=>({g:8}),
 watch(p){return {g:Math.min(8,Math.floor(p*9.5))}},
 ui:[{range:'g',label:'25-year periods',min:0,max:8,step:1,get:s=>s.g,act:'g',show:v=>v*25+' years'}],
 on:{g(s,v){s.g=Number(v);return 'keep'}},
 draw(s){
  const g=s.g;let out=heading('Population doubles; food adds',28);
  const lg=v=>Math.log2(v)/8;
  for(let i=0;i<=8;i++){const x=60+i*58,on=i<=g,pop=Math.pow(2,i),food=i+1;
   out+=R(x,250-160*lg(pop),20,160*lg(pop)+2,on?C.coral:'#f2e6e2','none',3)+R(x+22,250-160*lg(food),20,160*lg(food)+2,on?C.green:'#e2efe9','none',3);
   out+=TF(x+21,270,`${i*25}`,12.5,C.muted);
   if(on){out+=TF(x+10,244-160*lg(pop),String(pop),12,C.coral);out+=TF(x+32,244-160*lg(food),String(food),12,C.green)}
  }
  out+=TF(300,290,'years from now (bars on a log scale: each step up doubles)',13,C.muted);
  out+=TF(64,60,'■ population',13,C.coral,'start')+TF(170,60,'■ food',13,C.green,'start');
  const per=(g+1)/Math.pow(2,g);
  out+=counter(240,40,'food per person',per>=.1?E1_f(per):`${g+1}/${Math.pow(2,g)}`,per<.5?C.coral:C.ink,150);
  out+=TF(300,322,'Malthus’s checks: “positive” (famine, disease, war) and “preventive” (later marriage).',13,C.ink);
  out+=TF(300,342,'His sequences are a thought experiment, not a forecast with data.',13,C.muted);
  return {svg:out,phase:`After ${g*25} years, unchecked population would be ${Math.pow(2,g)} times larger but food only ${g+1} times, leaving ${per>=.1?E1_f(per):(g+1)+'/'+Math.pow(2,g)} of the food per person. Malthus concluded that checks must always keep population near what food allows.`};
 }});

// World population (UN, rounded) and cereal production (FAO, from 1961, rounded).
const E1_POP=[[1800,.99],[1850,1.26],[1900,1.65],[1927,2],[1950,2.5],[1960,3.0],[1974,4],[1987,5],[1999,6],[2011,7],[2022,8]];
const E1_CER=[[1961,.88],[1970,1.19],[1980,1.55],[1990,1.95],[2000,2.06],[2010,2.47],[2020,3.0]];
const E1_interp=(tab,y)=>{if(y<=tab[0][0])return tab[0][1];for(let i=1;i<tab.length;i++)if(y<=tab[i][0]){const [a,va]=tab[i-1],[b,vb]=tab[i];return va+(vb-va)*(y-a)/(b-a)}return tab[tab.length-1][1]};
SCENE({id:'malthus-population-world',name:'What actually happened',tag:'People and food since 1800',
 definition:'Since Malthus wrote, world population has grown about eightfold, yet food per person has risen, not fallen. Farming became far more productive: new crops, machinery, artificial fertiliser (the Haber–Bosch process, 1913) and the Green Revolution of the 1960s.',
 example:'World cereal output rose from about 0.9 billion tonnes in 1961 to about 3 billion in 2020, faster than population, so cereal per person rose from roughly 290 kg to about 380 kg.',
 desc:'World population from 1800 and world cereal production from 1961, with cereal per person, and markers for fertiliser and the Green Revolution.',
 research:'United Nations (2022). World Population Prospects (rounded figures). FAO (2023). FAOSTAT, cereal production (rounded). Smil, V. (2001). Enriching the Earth: Fritz Haber, Carl Bosch and the Transformation of World Food Production. MIT Press. Clark, G. (2007). A Farewell to Alms argues Malthus described most of history before about 1800 well; that claim is debated.',
 dur:10,hint:'Move through the years. Before about 1800 Malthus’s picture fits much of history; after, productivity raced ahead.',
 init:()=>({yr:2020}),
 watch(p){return {yr:Math.round(1800+p*220)}},
 ui:[{range:'yr',label:'Year',min:1800,max:2022,step:1,get:s=>s.yr,act:'yr'}],
 on:{yr(s,v){s.yr=Number(v);return 'keep'}},
 draw(s){
  const yr=s.yr;let out=heading('People and grain since 1800',28);
  const pl=E1_plot(70,60,330,230,[1800,2022],[0,9],{xt:[[1800,'1800'],[1900,'1900'],[1961,'1961'],[2022,'2022']],yt:[[3,'3'],[6,'6'],[9,'9']],xl:'year',yl:'billions (people, or tonnes of cereal)'});
  out+=pl.svg;
  const pts=[];for(let y=1800;y<=yr;y+=2)pts.push([pl.X(y),pl.Y(E1_interp(E1_POP,y))]);out+=E1_poly(pts,C.coral,2.8);
  if(yr>=1961){const c=[];for(let y=1961;y<=Math.min(yr,2020);y+=1)c.push([pl.X(y),pl.Y(E1_interp(E1_CER,y))]);out+=E1_poly(c,C.green,2.8)}
  out+=L(pl.X(1913),pl.Y(0),pl.X(1913),pl.Y(9),C.line,1,'stroke-dasharray="4 4"')+TF(pl.X(1913)-4,pl.Y(8.5),'Haber–Bosch',12.5,C.muted,'end');
  out+=L(pl.X(1965),pl.Y(0),pl.X(1965),pl.Y(9),C.line,1,'stroke-dasharray="4 4"')+TF(pl.X(1965)+4,pl.Y(8.5),'Green Revolution',12.5,C.muted,'start');
  const pop=E1_interp(E1_POP,yr);out+=counter(420,60,'people (billion)',E1_f(pop,2),C.coral,150);
  if(yr>=1961){const cer=E1_interp(E1_CER,Math.min(yr,2020)),pc=cer/E1_interp(E1_POP,Math.min(yr,2020))*1000;
   out+=counter(420,118,'cereal (bn tonnes)',E1_f(cer,2),C.green,150)+counter(420,176,'cereal per person',Math.round(pc)+' kg',C.blue,150)}
  else out+=TF(495,150,'Comparable world',13,C.muted)+TF(495,168,'grain data start',13,C.muted)+TF(495,186,'in 1961 (FAO).',13,C.muted);
  out+=TF(495,262,'All figures rounded.',13,C.muted);
  return {svg:out,phase:yr>=1961?`In ${yr} there are about ${E1_f(pop,1)} billion people and about ${E1_f(E1_interp(E1_CER,Math.min(yr,2020)),1)} billion tonnes of cereal a year, around ${Math.round(E1_interp(E1_CER,Math.min(yr,2020))/E1_interp(E1_POP,Math.min(yr,2020))*1000)} kg each. Food has outpaced people, the opposite of Malthus’s prediction.`:`In ${yr} the world has about ${E1_f(pop,2)} billion people. Productivity growth, not Malthus’s checks, would decide what came next.`};
 }});

// A stylised demographic transition (per 1,000 people a year): deaths fall first, births later.
const E1_bd=t=>{const d=38-28*smooth(clamp((t-.15)/.45,0,1)),b=40-28*smooth(clamp((t-.42)/.45,0,1));return {b,d}};
SCENE({id:'malthus-population-transition',name:'The demographic transition',tag:'Why growth slowed',
 definition:'As countries grow richer, death rates fall first (food, clean water, medicine), so population grows fast; later, birth rates fall too (schooling, especially of girls, contraception, cities), and growth slows again. Malthus did not foresee this second fall.',
 example:'England’s death rate fell from the late 1700s while births stayed high until the 1870s; today most rich countries have birth rates near or below their death rates.',
 desc:'Stylised birth and death rates through the four stages of the transition, the gap between them shaded as natural growth, and the population curve it produces.',
 research:'Thompson, W. S. (1929). Population. American Journal of Sociology 34, 959–975. Notestein, F. W. (1945). Population: the long view. Boserup, E. (1965). The Conditions of Agricultural Growth (population pressure can drive farming innovation). Curves are stylised, not one country’s data.',
 dur:10,hint:'Move through the stages. The population grows fastest in the gap between falling deaths and falling births.',
 init:()=>({t:1}),
 watch(p){return {t:p}},
 ui:[{range:'t',label:'Through the transition',min:0,max:1,step:.01,get:s=>s.t,act:'t',show:v=>'stage '+(1+Math.min(3,Math.floor(v*4)))}],
 on:{t(s,v){s.t=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Births, deaths and the gap between',28);
  const pl=E1_plot(70,62,300,150,[0,1],[0,45],{yt:[[0,'0'],[20,'20'],[40,'40']],yl:'per 1,000 people a year'});
  out+=pl.svg;
  const N=100,b=[],d=[],fill=[];for(let i=0;i<=N*s.t;i++){const t=i/N,r=E1_bd(t);b.push([pl.X(t),pl.Y(r.b)]);d.push([pl.X(t),pl.Y(r.d)])}
  if(b.length>1)out+=P('M'+b.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L')+' L'+d.slice().reverse().map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L')+'Z',C.green,0,C.greenp);
  out+=E1_poly(b,C.blue,2.6)+E1_poly(d,C.coral,2.6);
  [0,.25,.5,.75].forEach((x,i)=>{out+=L(pl.X(x),62,pl.X(x),212,C.grid,1)+TF(pl.X(x+.125),228,'stage '+(i+1),12.5,C.muted)});
  out+=TF(80,80,'births',13,C.blue,'start')+TF(80,98,'deaths',13,C.coral,'start');
  // Population index from integrating the gap.
  const pp=E1_plot(70,262,300,80,[0,1],[0,8],{yt:[[1,'1'],[4,'4'],[8,'8']],yl:'population (×)'});
  out+=pp.svg;let P0=1;const pts=[[pp.X(0),pp.Y(1)]];for(let i=1;i<=N*s.t;i++){const t=i/N,r=E1_bd(t);P0*=Math.exp((r.b-r.d)/1000*2.6);pts.push([pp.X(t),pp.Y(Math.min(8,P0))])}
  out+=E1_poly(pts,C.ink,2.4);
  const r=E1_bd(s.t),st=1+Math.min(3,Math.floor(s.t*4));
  out+=counter(410,70,'birth rate',r.b.toFixed(0),C.blue,150)+counter(410,128,'death rate',r.d.toFixed(0),C.coral,150)+counter(410,186,'natural growth',((r.b-r.d)/10).toFixed(1)+'% a year',C.green,150)+counter(410,262,'population',`×${E1_f(P0,1)}`,C.ink,150);
  return {svg:out,phase:`Stage ${st}: about ${r.b.toFixed(0)} births and ${r.d.toFixed(0)} deaths per 1,000 people a year, so the population grows ${((r.b-r.d)/10).toFixed(1)}% a year. ${st===2?'Deaths have fallen but births have not yet: the fastest growth.':st===4?'Both are low: growth has almost stopped without Malthus’s checks.':''}`};
 }});

/* ================================================================ diminishing-returns */
const E1_Q=[0,100,190,270,340,400,450,490,520,540,550];
SCENE({id:'diminishing-returns',name:'More hands, same field',tag:'Diminishing returns',
 definition:'If more and more labour is applied to a fixed amount of land, each extra worker eventually adds less output than the one before: diminishing marginal returns. Turgot described it around 1767; West, Malthus, Torrens and Ricardo all published it in 1815.',
 example:'On this illustrative field the first worker adds 100 bushels, the second 90, the third 80, and the tenth only 10, so total output keeps rising but ever more slowly.',
 desc:'Total output of a fixed field against the number of workers, with a bar for the extra output each new worker adds.',
 research:'Turgot, A. R. J. (c. 1767). Observations sur le mémoire de M. de Saint-Péravy. West, E. (1815). Essay on the Application of Capital to Land. Ricardo, D. (1815). An Essay on the Influence of a Low Price of Corn on the Profits of Stock. Figures are illustrative.',
 dur:9,hint:'Add workers to the field and watch the extra output from each one shrink.',
 init:()=>({L:6}),
 watch(p){return {L:Math.min(10,Math.floor(p*11))}},
 ui:[{range:'L',label:'Workers on the field',min:0,max:10,step:1,get:s=>s.L,act:'L'}],
 on:{L(s,v){s.L=Number(v);return 'keep'}},
 draw(s){
  const n=s.L;let out=heading('A fixed field, more and more workers',28);
  const pl=E1_plot(70,62,240,200,[0,10],[0,600],{xt:[[0,'0'],[5,'5'],[10,'10']],yt:[[0,'0'],[300,'300'],[600,'600']],xl:'workers',yl:'total bushels'});
  out+=pl.svg+E1_poly(E1_Q.slice(0,n+1).map((q,i)=>[pl.X(i),pl.Y(q)]),C.blue,2.8)+E1_poly(E1_Q.map((q,i)=>[pl.X(i),pl.Y(q)]),C.line,1.2,'stroke-dasharray="4 4"');
  if(n)out+=Ci(pl.X(n),pl.Y(E1_Q[n]),6,C.blue,'#fff');
  const mp=E1_plot(370,62,200,200,[0,10.5],[0,110],{xt:[[1,'1'],[5,'5'],[10,'10']],yt:[[0,'0'],[50,'50'],[100,'100']],xl:'the worker added',yl:'extra bushels'});
  out+=mp.svg;for(let i=1;i<=10;i++){const m=E1_Q[i]-E1_Q[i-1];out+=R(mp.X(i)-7,mp.Y(m),14,mp.Y(0)-mp.Y(m),i<=n?(i===n?C.coral:C.green):'#e6edf1','none',2)}
  out+=counter(70,316,'total output',String(E1_Q[n]),C.blue,120)+counter(200,316,'per worker',n?E1_f(E1_Q[n]/n,0):'–',C.ink,110)+counter(320,316,'extra from the last',n?String(E1_Q[n]-E1_Q[n-1]):'–',C.coral,150);
  return {svg:out,phase:n?`${n} worker${n>1?'s':''} produce ${E1_Q[n]} bushels; the last one added ${E1_Q[n]-E1_Q[n-1]}. Each extra worker adds less because the land does not grow with them. (Illustrative numbers.)`:'No workers, no crop. Add some.'};
 }});

const E1_LAND=[100,90,80,70];
SCENE({id:'diminishing-returns-rent',name:'Ricardo’s rent',tag:'Rent from differences in land',
 definition:'Ricardo explained rent by diminishing returns across land of different quality. As population grows, poorer land is farmed; the price of corn must cover the cost on the worst land in use, so better land earns a surplus over the same cost: rent.',
 example:'Ricardo’s own numbers: equal capital and labour yield 100, 90 and 80 quarters of corn on three grades of land. When the third grade is farmed, the first earns a rent of 20 quarters and the second 10. “Corn is not high because a rent is paid, but a rent is paid because corn is high.”',
 desc:'Bars for each grade of land in use, split into the part that covers cost (equal to the worst land’s yield) and the part that is rent.',
 research:'Ricardo, D. (1817). Principles, chapter 2 (On Rent): the 100, 90 and 80 quarters example and the line about corn and rent. Malthus, T. R. (1815). An Inquiry into the Nature and Progress of Rent. Grade 4 (70 quarters) extends Ricardo’s sequence.',
 dur:9,hint:'Bring poorer land into use as the population grows. Rent appears on the better land, and rises each time the margin moves.',
 init:()=>({k:3}),
 watch(p){return {k:1+Math.min(3,Math.floor(p*4.4))}},
 ui:[{range:'k',label:'Grades of land farmed',min:1,max:4,step:1,get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const k=s.k,marg=E1_LAND[k-1];let out=heading('Rent on better land',28);
  const pl=E1_plot(90,62,300,220,[0,4],[0,110],{yt:[[0,'0'],[50,'50'],[100,'100']],yl:'quarters of corn from equal capital and labour'});
  out+=pl.svg;let rentTot=0;
  E1_LAND.forEach((y,i)=>{const x=pl.X(i+.5)-28,used=i<k;
   out+=R(x,pl.Y(y),56,pl.Y(0)-pl.Y(y),used?'#fff':'#f3f6f8',used?C.line:C.grid,4);
   if(used){out+=R(x,pl.Y(marg),56,pl.Y(0)-pl.Y(marg),C.blue,'none',4);if(y>marg){out+=R(x,pl.Y(y),56,pl.Y(marg)-pl.Y(y),C.amber,'none',4);out+=TBF(x+28,pl.Y(y)+(pl.Y(marg)-pl.Y(y))/2+5,String(y-marg),13,'#fff')}rentTot+=y-marg}
   out+=TF(x+28,300,'grade '+(i+1),13,used?C.ink:C.muted)+TF(x+28,pl.Y(y)-6,String(y),13,used?C.ink:C.muted);
  });
  out+=L(pl.X(0),pl.Y(marg),pl.X(4),pl.Y(marg),C.coral,1.5,'stroke-dasharray="5 4"');
  out+=TF(420,82,'■ covers cost',13,C.blue,'start')+TF(420,100,'■ rent',13,C.amber,'start')+TF(420,118,'- - the margin',13,C.coral,'start');
  out+=counter(420,150,'worst land in use',`grade ${k} (${marg})`,C.coral,150)+counter(420,208,'total rent',String(rentTot)+' quarters',C.amber,150);
  out+=TF(300,336,'“Corn is not high because a rent is paid, but a rent is paid because corn is high.”',13,C.ink);
  return {svg:out,phase:`With ${k} grade${k>1?'s':''} farmed, the worst land yields ${marg} quarters and sets the cost. ${k>1?`Better grades earn rent of ${E1_LAND.slice(0,k).map(y=>y-marg).filter(v=>v).join(', ')} quarters.`:'No land earns rent yet: there is no poorer land to compare with.'}`};
 }});

// Ricardo's long run (illustrative): the margin worsens each decade; wages fixed at 40; profit = (margin − wage)/wage.
function E1_stationary(tech,imp){const out=[];for(let d=0;d<=10;d++){let m=100-6*d;if(tech)m+=3.2*d;if(imp)m=Math.max(m,78);out.push({d,m,pr:Math.max(0,(m-40)/40)})}return out}
SCENE({id:'diminishing-returns-stationary',name:'Towards a stationary state',tag:'Profits, corn and the Corn Laws',
 definition:'Ricardo argued that as poorer land is farmed, the cost of feeding workers rises, rents rise and profits fall, until growth stops in a stationary state. Cheaper imported corn or better farming could hold it off, which is why he opposed the Corn Laws.',
 example:'In this illustration the margin worsens by 6 quarters a decade with wages fixed at 40: the profit rate falls from 150% to nothing in a century. Allowing imports or steady farming improvements keeps it well above zero.',
 desc:'The profit rate over ten decades as the margin of cultivation worsens, with switches for farming improvements and free corn imports.',
 research:'Ricardo, D. (1815). Essay on the Influence of a Low Price of Corn on the Profits of Stock; (1817) Principles, chapter 6. The Corn Laws (1815) were repealed in 1846. Mill, J. S. (1848). Principles of Political Economy, Book IV, chapter 6, welcomed a stationary state. The model is illustrative.',
 dur:10,hint:'Switch on farming improvements or free imports of corn and compare the profit rate after a century.',
 init:()=>({tech:false,imp:false}),
 watch(p){return {tech:p>.5,imp:false}},
 ui:[{b:'Farming improvements',act:'tog',arg:'tech'},{b:'Free corn imports',act:'tog',arg:'imp'}],
 on:{tog(s,k){s[k]=!s[k];return 'keep'}},
 draw(s,f,X){
  const run=E1_stationary(s.tech,s.imp),base=E1_stationary(false,false);let out=heading('Ricardo’s squeeze on profits',28);
  const pl=E1_plot(70,62,320,230,[0,10],[0,1.6],{xt:[[0,'0'],[5,'50'],[10,'100 years']],yt:[[0,'0%'],[.5,'50%'],[1,'100%'],[1.5,'150%']],xl:'years from now',yl:'rate of profit'});
  out+=pl.svg+E1_poly(base.map(r=>[pl.X(r.d),pl.Y(r.pr)]),C.line,1.6,'stroke-dasharray="5 4"')+E1_poly(run.map(r=>[pl.X(r.d),pl.Y(Math.min(1.6,r.pr))]),C.blue,2.8);
  out+=E1_btn(X,'tog','tech',`Farming improvements: ${s.tech?'on':'off'}`,420,70,150,46,(s.tech?'✓ ':'○ ')+'Improvements',{sel:s.tech,stroke:s.tech?C.green:C.line});
  out+=E1_btn(X,'tog','imp',`Free corn imports: ${s.imp?'on':'off'}`,420,126,150,46,(s.imp?'✓ ':'○ ')+'Free imports',{sel:s.imp,stroke:s.imp?C.green:C.line});
  const end=run[10].pr;out+=counter(420,196,'profit after 100 years',Math.round(end*100)+'%',end>.05?C.green:C.coral,150);
  out+=TF(495,276,'dashed: both',13,C.muted)+TF(495,294,'switched off',13,C.muted)+TF(495,318,'Numbers are',13,C.muted)+TF(495,336,'illustrative.',13,C.muted);
  return {svg:out,phase:end<=.001?'With no improvements and no imports, farming ever-poorer land drives the profit rate to zero: Ricardo’s stationary state, where investment and growth stop.':`The profit rate after a century is ${Math.round(end*100)}%: ${s.imp?'cheap imported corn caps the cost of feeding workers':'improvements keep pushing the margin back'}. Ricardo used this argument against the Corn Laws.`};
 }});

/* ================================================================ labour-theory-value */
SCENE({id:'labour-theory-value',name:'Deer and beaver',tag:'Labour as the measure of value',
 definition:'Smith and Ricardo held that, in simple conditions, goods exchange in proportion to the labour needed to produce them. If a beaver takes twice as long to hunt as a deer, one beaver should exchange for two deer.',
 example:'Smith: “If among a nation of hunters … it usually costs twice the labour to kill a beaver which it does to kill a deer, one beaver should naturally exchange for or be worth two deer.”',
 desc:'Sliders for the hours needed to hunt a beaver and a deer give the exchange ratio, with what a hunter would gain by switching if the ratio were different.',
 research:'Smith, A. (1776). The Wealth of Nations, Book I, chapter 6 (deer and beaver). Ricardo, D. (1817). Principles, chapter 1. Presented as history of economic thought; later economics explains prices differently (see marginal utility, era 2).',
 dur:9,hint:'Change the hours each hunt takes, then try a market ratio that differs from the labour ratio and see who would switch.',
 init:()=>({hb:2,hd:1,mk:2}),
 watch(p){return {hb:2,hd:1,mk:lerp(1,3,p)}},
 ui:[{range:'hb',label:'Hours to hunt a beaver',min:1,max:6,step:.5,get:s=>s.hb,act:'hb'},{range:'hd',label:'Hours to hunt a deer',min:1,max:6,step:.5,get:s=>s.hd,act:'hd'},
  {range:'mk',label:'Market: deer per beaver',min:.5,max:4,step:.1,get:s=>s.mk,act:'mk',show:v=>E1_f(v,1)}],
 on:{hb(s,v){s.hb=Number(v);return 'keep'},hd(s,v){s.hd=Number(v);return 'keep'},mk(s,v){s.mk=Number(v);return 'keep'}},
 draw(s){
  const lab=s.hb/s.hd,mk=s.mk;let out=heading('A nation of hunters',28);
  const beaver=(x,y)=>P(`M${x-24} ${y}Q${x-24} ${y-20} ${x} ${y-20}Q${x+24} ${y-20} ${x+24} ${y}Z`,C.amber,2,C.amberp)+P(`M${x+24} ${y-6}L${x+42} ${y-2}L${x+24} ${y+2}`,C.amber,2,C.amber);
  const deer=(x,y)=>R(x-18,y-18,36,16,C.greenp,C.green,6)+L(x-12,y-2,x-12,y+12,C.green,2)+L(x+12,y-2,x+12,y+12,C.green,2)+L(x+16,y-18,x+20,y-32,C.green,2)+L(x+20,y-32,x+26,y-36,C.green,1.5);
  out+=beaver(110,120)+TF(110,150,`${s.hb} h`,13,C.amber);out+=TF(190,116,'=',22,C.ink);
  const nd=Math.min(6,Math.round(lab*2)/2);for(let i=0;i<Math.ceil(nd);i++)out+=deer(240+i*52,118)+(i+1>nd?R(240+i*52-2,84,30,56,'#fff','none',0,'opacity=".7"'):'');
  out+=TF(256,152,`${s.hd} h each`,13,C.green,'start');
  out+=TF(300,176,`labour says 1 beaver = ${E1_f(lab,1)} deer`,15,C.ink);
  out+=R(60,198,480,92,'#fff',C.grid,10);
  out+=TF(80,222,`The market offers ${E1_f(mk,1)} deer per beaver.`,14,C.ink,'start');
  const gain=mk*s.hd-s.hb;
  out+=TF(80,248,gain>.01?`Hunting beaver and trading earns ${E1_f(mk*s.hd/s.hb)} hours’ worth of deer per hour.`:gain<-.01?`Hunting deer is better: a beaver bought costs fewer hours than hunting one.`:'Neither hunt pays better: no one switches.',13,gain>.01?C.green:gain<-.01?C.coral:C.blue,'start');
  out+=TF(80,272,gain>.01?'More hunters turn to beaver until the ratio falls back.':gain<-.01?'More hunters turn to deer until the ratio rises back.':'This is the labour ratio Smith predicted.',13,C.muted,'start');
  out+=TF(300,330,'History of thought: Smith thought labour ratios ruled only in this “early and rude state”.',13,C.muted);
  return {svg:out,phase:`A beaver takes ${s.hb} hours and a deer ${s.hd}, so by labour one beaver is worth ${E1_f(lab,1)} deer. At a market ratio of ${E1_f(mk,1)}, ${Math.abs(gain)<=.01?'nobody gains by switching.':'hunters gain by switching, pushing the ratio back towards the labour ratio.'}`};
 }});

SCENE({id:'labour-theory-value-water-diamond',name:'Water and diamonds',tag:'The paradox of value',
 definition:'Smith noted that water is extremely useful but nearly free, while diamonds are of little use but very dear. The classical answer pointed to the labour and difficulty of getting diamonds; the later marginal answer points to how useful the last unit is.',
 example:'Smith: “Nothing is more useful than water: but it will purchase scarce any thing … A diamond, on the contrary, has scarce any value in use; but a very great quantity of other goods may frequently be had in exchange for it.”',
 desc:'For water or diamonds, bars for total usefulness, usefulness of one more unit, and labour to get one more unit, with a slider for how much you already have.',
 research:'Smith, A. (1776). The Wealth of Nations, Book I, chapter 4. The marginal resolution: Jevons (1871), Menger (1871), Walras (1874), covered in era 2. Earlier, Galiani (1751) and others had linked value to scarcity. The usefulness numbers are illustrative.',
 dur:10,hint:'Choose water or diamonds and change how much you already have. In a desert, the last glass of water is worth more than a diamond.',
 init:()=>({good:'water',q:8}),
 watch(p){return p<.5?{good:'water',q:Math.round(lerp(1,10,p*2))}:{good:'diamond',q:1}},
 ui:[{choose:[['water','Water'],['diamond','Diamonds']],label:'Good',get:s=>s.good,act:'good'},{range:'q',label:'How much you already have',min:1,max:10,step:1,get:s=>s.q,act:'q'}],
 on:{good(s,v){s.good=v;return 'keep'},q(s,v){s.q=Number(v);return 'keep'}},
 draw(s){
  const w=s.good==='water',q=s.q,mu=w?100/Math.pow(q,1.6):9/Math.pow(q,.3),tot=w?range(q).reduce((a,i)=>a+100/Math.pow(i+1,1.6),0):range(q).reduce((a,i)=>a+9/Math.pow(i+1,.3),0),lab=w?.5:60;
  let out=heading(w?'Water: useful, cheap':'Diamonds: useless, dear',28);
  const pl=E1_plot(80,62,300,230,[0,3],[0,200],{yt:[[0,'0'],[100,'100'],[200,'200']],yl:'illustrative units'});
  out+=pl.svg;
  [['whole supply',tot,C.green],['one more',mu,C.blue],['labour cost',lab,C.amber]].forEach(([l,v,col],i)=>{const x=pl.X(i+.5)-34;out+=R(x,pl.Y(Math.min(200,v)),68,pl.Y(0)-pl.Y(Math.min(200,v)),col,'none',4)+TF(x+34,pl.Y(Math.min(200,v))-6,E1_f(v,1),13,col)+TF(x+34,312,l,12.5,C.ink)});
  out+=E1_card(400,62,180,'Classical answer',['price follows the labour','and difficulty of getting','one more unit'],C.amber);
  out+=E1_card(400,176,180,'Marginal answer (1871)',['price follows the use of','the last unit, not of','the whole supply'],C.blue);
  return {svg:out,phase:w?`With ${q} units of water already, the whole supply is very useful (${E1_f(tot,0)}) but one more glass adds only ${E1_f(mu,1)}. ${q<=2?'With very little water, as in a desert, that last glass is precious.':'That is why water is cheap.'}`:`Diamonds add little use (${E1_f(mu,1)} for one more), yet each takes much labour to find. The classical economists stressed the labour; the marginalists of era 2 stressed the use of the last unit.`};
 }});

SCENE({id:'labour-theory-value-marx',name:'Marx’s surplus value',tag:'Labour value as critique',
 definition:'Karl Marx took the labour theory of value further: if labour creates value, a worker paid the value of their labour power, but working longer than the time needed to produce it, creates surplus value for the employer. He called the ratio of surplus to necessary labour the rate of surplus value.',
 example:'In a 10-hour day, if 5 hours of work produce goods worth the day’s wage, the other 5 hours are surplus labour: a rate of surplus value of 100%.',
 desc:'A working day split into necessary and surplus labour, with the rate of surplus value, and cards for the main later critiques.',
 research:'Marx, K. (1867). Das Kapital, volume 1, chapters 7–9. Böhm-Bawerk, E. von (1896). Karl Marx and the Close of His System (the “transformation problem”). Samuelson, P. A. (1971). Understanding the Marxian notion of exploitation. Journal of Economic Literature 9, 399–431. Presented as history of thought; most economists today use marginal theories of price, and Marxian economists still debate these questions.',
 dur:10,hint:'Change the length of the day and the hours needed to cover the wage. Then read the critiques.',
 init:()=>({day:10,nec:5}),
 watch(p){return {day:Math.round(lerp(8,12,p)),nec:5}},
 ui:[{range:'day',label:'Working day (hours)',min:6,max:14,step:1,get:s=>s.day,act:'day'},{range:'nec',label:'Hours to cover the wage',min:2,max:8,step:.5,get:s=>s.nec,act:'nec'}],
 on:{day(s,v){s.day=Number(v);return 'keep'},nec(s,v){s.nec=Number(v);return 'keep'}},
 draw(s){
  const nec=Math.min(s.nec,s.day),sur=s.day-nec,rate=nec>0?sur/nec:0;let out=heading('A working day, in Marx’s terms',28);
  const x0=40,W=520,u=W/14;
  out+=R(x0,60,u*nec,40,C.blue,'none',6)+R(x0+u*nec,60,u*sur,40,C.coral,'none',6)+R(x0,60,W,40,'none',C.grid,6);
  for(let h=0;h<=14;h+=2)out+=TF(x0+u*h,118,String(h),12.5,C.muted);
  if(nec>=1.5)out+=TF(x0+u*nec/2,85,'necessary',13,'#fff');if(sur>=1.5)out+=TF(x0+u*(nec+sur/2),85,'surplus',13,'#fff');
  out+=TF(300,136,'hours',13,C.muted);
  out+=counter(140,150,'rate of surplus value',Math.round(rate*100)+'%',C.coral,170)+counter(320,150,'surplus hours',String(sur),C.coral,140);
  out+=E1_card(40,216,250,'Transformation problem',['Prices in real markets do not follow','labour values when industries use','different amounts of machinery.'],C.purple);
  out+=E1_card(310,216,250,'Marginal revolution',['From the 1870s most economists','explained prices by marginal','utility and cost instead.'],C.blue);
  return {svg:out,phase:`A ${s.day}-hour day with ${nec} hours covering the wage leaves ${sur} hours of surplus labour: a rate of surplus value of ${Math.round(rate*100)}% in Marx’s terms. This scene presents Marx’s ideas as history of thought, with the main critiques beside them.`};
 }});
