/* ===================== Chemistry era 1 · From alchemy to chemistry (400 BCE–1790) ===================== */
// Four elements and their rivals, the alchemist's still, Boyle's J-tube, phlogiston, Lavoisier's balance and the
// three-way discovery of oxygen. Pictures are pure functions of state and X. Published figures are given as
// published; anything modelled is labelled illustrative.
const C1_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function C1_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function C1_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,9)+lines.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*17,t,o.size||13,o.ink||C.ink,'middle',o.bold&&i===0?'font-weight="700"':'')).join('');
 return hit(X,act,arg,label,inner);
}
function C1_wrap(text,n){const out=[];let cur='';for(const w of String(text).split(/\s+/)){if(!w)continue;if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out}
function C1_card(x,y,w,title,lines,col=C.blue,fill='#fff'){
 {const n=Math.floor((w-24)/6.6),arr=Array.isArray(lines)?lines:[lines];lines=arr.every(l=>l.length<=n)?arr:C1_wrap(arr.join(' '),n)}
 const h=34+lines.length*18;
 return R(x,y,w,h,fill,col,10)+TBF(x+12,y+22,title,14,col,'start')+lines.map((t,i)=>TF(x+12,y+44+i*18,t,13,C.ink,'start')).join('');
}
const C1_f=(v,d=2)=>Number(v).toFixed(d);

/* ================================================================ four-elements */
// Aristotle: each element is a pair of qualities; change one quality and the element turns into its neighbour.
const C1_EL={fire:{q:['hot','dry'],col:'#c45238',name:'Fire'},air:{q:['hot','wet'],col:'#6aa7cf',name:'Air'},water:{q:['cold','wet'],col:'#1772b7',name:'Water'},earth:{q:['cold','dry'],col:'#8a6d3b',name:'Earth'}};
const C1_fromQ=(a,b)=>Object.keys(C1_EL).find(k=>C1_EL[k].q.includes(a)&&C1_EL[k].q.includes(b));
const C1_POS={fire:[300,86],air:[440,190],water:[300,294],earth:[160,190]};
SCENE({id:'four-elements',name:'Aristotle’s four elements',tag:'Qualities, not atoms',
 definition:'Empedocles (5th century BCE) proposed four roots, earth, water, air and fire. Aristotle explained them with four qualities, hot, cold, wet and dry: each element is a pair, and changing one quality turns one element into another.',
 example:'Heat water (cold and wet) and it becomes hot and wet: air, which is how the theory explained steam. Cool air and it turns back into water, as dew.',
 desc:'Aristotle’s square of opposition: four elements at the corners, the qualities between them, and buttons that heat, cool, wet or dry the current element.',
 research:'Aristotle, On Generation and Corruption, book II (4th century BCE). Empedocles, fragments on the four roots. Lloyd, G. E. R. (1970). Early Greek Science: Thales to Aristotle. Chatto & Windus.',
 dur:10,hint:'Pick a starting element, then heat, cool, wet or dry it. Each change swaps one quality and moves you to a neighbouring corner.',
 init:()=>({el:'water',last:''}),
 watch(p){const seq=['water','air','fire','earth','water'];return {el:seq[Math.min(4,Math.floor(p*5))],last:''}},
 ui:[{b:'Heat',act:'q',arg:'hot'},{b:'Cool',act:'q',arg:'cold'},{b:'Wet',act:'q',arg:'wet'},{b:'Dry',act:'q',arg:'dry'}],
 on:{q(s,v){const [a,b]=C1_EL[s.el].q,opp={hot:'cold',cold:'hot',wet:'dry',dry:'wet'};
   if(a===v||b===v){s.last=`${C1_EL[s.el].name} is already ${v}.`;return 'keep'}
   const keep=(a===opp[v])?b:a,nk=C1_fromQ(v,keep);s.last=`${C1_EL[s.el].name} made ${v} becomes ${C1_EL[nk].name.toLowerCase()}.`;s.el=nk;return 'keep'},
  pick(s,v){s.el=v;s.last='';return 'keep'}},
 draw(s,f,X){
  let out=heading('Four elements, four qualities',28);
  const P4=C1_POS;out+=P(`M${P4.fire[0]} ${P4.fire[1]}L${P4.air[0]} ${P4.air[1]}L${P4.water[0]} ${P4.water[1]}L${P4.earth[0]} ${P4.earth[1]}Z`,C.grid,2);
  const mid=(a,b)=>[(P4[a][0]+P4[b][0])/2,(P4[a][1]+P4[b][1])/2];
  [['fire','air','hot'],['air','water','wet'],['water','earth','cold'],['earth','fire','dry']].forEach(([a,b,q])=>{const [mx,my]=mid(a,b),dx=mx-300,dy=my-190,n=Math.hypot(dx,dy);out+=TBF(mx+dx/n*28,my+dy/n*22+5,q,14,C.muted)});
  for(const k in C1_EL){const [x,y]=P4[k],on=s.el===k;
   out+=hit(X,'pick',k,`${C1_EL[k].name}: ${C1_EL[k].q.join(' and ')}. Press to start here.`,Ci(x,y,on?34:28,on?C1_EL[k].col:'#fff',C1_EL[k].col)+TBF(x,y+5,C1_EL[k].name,14,on?'#fff':C1_EL[k].col));}
  out+=TF(300,198,C1_EL[s.el].q.join(' + '),14,C.ink);
  out+=TF(30,340,s.last||'Press an element, then use the buttons to change one quality at a time.',13,C.ink,'start');
  out+=TF(570,360,'A theory of change, not of matter as we now know it.',13,C.muted,'end');
  return {svg:out,phase:`${C1_EL[s.el].name} is ${C1_EL[s.el].q.join(' and ')}. ${s.last||'Change one quality to reach a neighbouring element; opposite corners differ in both.'}`};
 }});

// Three traditions of elements, side by side.
const C1_WUXING=['Wood','Fire','Earth','Metal','Water'];
const C1_TRAD={greek:{name:'Greek: four elements',items:['Earth','Water','Air','Fire'],note:['Empedocles and Aristotle; Aristotle added a fifth,','aether, for the heavens. Elements turn into one','another by swapping qualities.']},
 wuxing:{name:'Chinese: wuxing, five phases',items:C1_WUXING,note:['Better translated “phases” or “agents” than elements:','processes that generate and overcome one another,','used in medicine, cosmology and alchemy (wàidān).']},
 indian:{name:'Indian: pañcabhūta, five elements',items:['Earth (pṛthvī)','Water (ap)','Fire (tejas)','Air (vāyu)','Space (ākāśa)'],note:['Found in Sāṃkhya, Nyāya–Vaiśeṣika and Āyurveda;','Vaiśeṣika thinkers also proposed indivisible atoms','(paramāṇu) of the first four.']}};
SCENE({id:'four-elements-traditions',name:'Elements in three traditions',tag:'Greece, China, India',
 definition:'Several ancient traditions described the world in terms of a few basic elements or phases. They answered different questions: the Chinese wuxing describe cycles of change, the Greek elements describe qualities, and Indian schools included space and, in Vaiśeṣika, atoms.',
 example:'In the wuxing generating cycle wood feeds fire, fire makes earth (ash), earth bears metal, metal collects water (condensation), and water nourishes wood.',
 desc:'A choice of tradition: the Greek four elements, the Chinese five phases with their generating and overcoming cycles, or the Indian five elements, each with a short note.',
 research:'Needham, J. (1956). Science and Civilisation in China, vol. 2. Cambridge University Press. Lloyd, G. E. R. (1970). Early Greek Science. Dasgupta, S. (1922). A History of Indian Philosophy, vol. 1. Cambridge University Press.',
 dur:12,hint:'Choose a tradition. For the Chinese five phases, switch between the generating and the overcoming cycle.',
 init:()=>({t:'wuxing',cyc:'gen'}),
 watch(p){const k=['greek','wuxing','wuxing','indian'][Math.min(3,Math.floor(p*4))];return {t:k,cyc:p>.5&&p<.75?'over':'gen'}},
 ui:[{choose:[['greek','Greek'],['wuxing','Chinese'],['indian','Indian']],label:'Tradition',get:s=>s.t,act:'t'},{choose:[['gen','Generating'],['over','Overcoming']],label:'Wuxing cycle',get:s=>s.cyc,act:'cyc'}],
 on:{t(s,v){s.t=v;return 'keep'},cyc(s,v){s.cyc=v;s.t='wuxing';return 'keep'}},
 draw(s){
  const t=C1_TRAD[s.t];let out=heading(t.name,28);
  const n=t.items.length,cx=200,cy=190,r=110,pt=i=>[cx+r*Math.sin(2*Math.PI*i/n),cy-r*Math.cos(2*Math.PI*i/n)];
  if(s.t==='wuxing'){const step=s.cyc==='gen'?1:2;
   for(let i=0;i<n;i++){const [x1,y1]=pt(i),[x2,y2]=pt((i+step)%n),d=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/d,uy=(y2-y1)/d;
    out+=L(x1+ux*32,y1+uy*32,x2-ux*36,y2-uy*36,s.cyc==='gen'?C.green:C.coral,2.4)+P(`M${fmt(x2-ux*34)} ${fmt(y2-uy*34)}l${fmt(-ux*10-uy*5)} ${fmt(-uy*10+ux*5)}l${fmt(uy*10)} ${fmt(-ux*10)}Z`,s.cyc==='gen'?C.green:C.coral,1,s.cyc==='gen'?C.green:C.coral)}}
  t.items.forEach((it,i)=>{const [x,y]=pt(i);out+=Ci(x,y,30,'#fff',C.blue)+TBF(x,y+5,it.split(' ')[0],13,C.blue)});
  out+=C1_card(340,70,240,s.t==='wuxing'?(s.cyc==='gen'?'Generating cycle':'Overcoming cycle'):'Note',s.t==='wuxing'?(s.cyc==='gen'?['Wood feeds Fire','Fire makes Earth (ash)','Earth bears Metal','Metal collects Water','Water nourishes Wood']:['Wood parts Earth','Earth dams Water','Water quenches Fire','Fire melts Metal','Metal chops Wood']):t.items,C.blue);
  t.note.forEach((l,i)=>out+=TF(30,330+i*16,l,13,C.muted,'start'));
  return {svg:out,phase:`${t.name}. ${t.note.join(' ')}`};
 }});

// Burning a log: what the four-element theory said, what Boyle objected, what we now say.
const C1_LOG=[{k:'flame',a:'Fire escapes from the wood',m:'Hot glowing gas: carbon and hydrogen reacting with oxygen'},{k:'smoke',a:'Air escapes as smoke',m:'Soot, water vapour and carbon dioxide'},{k:'sap',a:'Water hisses out of the ends',m:'Water already in the wood, boiled off'},{k:'ash',a:'Earth is left behind as ash',m:'Mineral salts (calcium, potassium carbonates)'}];
SCENE({id:'four-elements-test',name:'A burning log as evidence',tag:'Boyle’s sceptical chymist',
 definition:'A burning log seemed to prove the four elements: fire, smoke (air), hissing sap (water) and ash (earth) all come out. In The Sceptical Chymist (1661) Robert Boyle argued that fire separates substances into products that need not be elements at all, and that different methods give different “elements”.',
 example:'Boyle pointed out that heating gold does not split it into four parts, while heating wood gives more than four products, so fire is no reliable test of what things are made of.',
 desc:'A log with four labelled products of burning; press each to compare the four-element reading with the modern one.',
 research:'Boyle, R. (1661). The Sceptical Chymist. London. Principe, L. M. (1998). The Aspiring Adept: Robert Boyle and His Alchemical Quest. Princeton University Press.',
 dur:9,hint:'Press each product of the fire. Note that Boyle himself practised alchemy: his objection was to the four-element theory, not to experiment.',
 init:()=>({k:'ash'}),
 watch(p){return {k:C1_LOG[Math.min(3,Math.floor(p*4))].k}},
 ui:[{choose:C1_LOG.map(c=>[c.k,c.k[0].toUpperCase()+c.k.slice(1)]),label:'Product',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('What comes out of a burning log?',28);
  out+=R(80,250,200,34,'#8a6d3b','none',14)+R(90,256,180,10,'#a98b57','none',5);
  const spots={flame:[180,200],smoke:[180,100],sap:[60,267],ash:[180,338]};
  out+=R(80,300,200,18,'#cfc6b6','none',6);
  out+=P('M150 248Q140 210 170 190Q160 220 185 205Q195 175 210 196Q225 215 210 248Z','#e3753f',1,'#f2a65a');
  out+=P('M170 160Q150 130 175 110Q195 90 180 70',C.muted,3,'none','stroke-dasharray="4 5"');
  for(const c of C1_LOG){const [x,y]=spots[c.k],on=s.k===c.k;out+=hit(X,'k',c.k,`${c.k}: press to compare explanations`,Ci(x,y,15,on?C.coral:'#fff',C.coral)+TBF(x,y+5,'?',13,on?'#fff':C.coral))}
  const c=C1_LOG.find(z=>z.k===s.k);
  out+=C1_card(320,70,260,'Four-element reading',[c.a],C.amber)+C1_card(320,150,260,'Modern reading',c.m,C.green);
  out+=TF(320,262,'Boyle (1661): fire splits things into',13,C.muted,'start')+TF(320,280,'products, but these need not be the',13,C.muted,'start')+TF(320,298,'elements they are made of.',13,C.muted,'start');
  return {svg:out,phase:`${c.k[0].toUpperCase()+c.k.slice(1)}: the four-element theory said “${c.a.toLowerCase()}”; today we say ${c.m.toLowerCase()}.`};
 }});

/* ================================================================ alchemy-distillation */
// A simplified still: ethanol–water with a constant relative volatility (illustrative; real mixtures form an
// azeotrope at about 95.6% ethanol by mass, so simple distillation cannot pass it).
const C1_ALPHA=5;
const C1_y=x=>C1_ALPHA*x/(1+(C1_ALPHA-1)*x);
function C1_distil(x0,frac){ // Rayleigh-style batch: returns {xPot, yNow, avg collected} after boiling off frac of the liquid
 let L=1,xl=x0,collected=0,collEth=0;const steps=200,dL=frac/steps;
 for(let i=0;i<steps;i++){const y=C1_y(xl);collected+=dL;collEth+=dL*y;const eth=xl*L-dL*y;L-=dL;xl=L>1e-6?Math.max(0,eth/L):0}
 return {xPot:xl,yNow:C1_y(xl),avg:collected?collEth/collected:0};
}
SCENE({id:'alchemy-distillation',name:'The alchemist’s still',tag:'Distillation',
 definition:'Distillation separates liquids by boiling them and condensing the vapour. The alembic, a pot with a beaked head, was developed in Hellenistic Egypt and refined by alchemists writing in Arabic; the first vapour off a wine–water mixture is much richer in alcohol.',
 example:'Starting from a wine at about 10% alcohol, the first drops that condense are several times richer. As the pot loses its alcohol, the distillate gets weaker, so distillers collect the middle and discard the end.',
 desc:'An alembic with a heat slider and a “fraction boiled off” slider; the pot and receiver show the alcohol share, with a curve of the distillate’s strength as distillation goes on.',
 research:'Forbes, R. J. (1948). A Short History of the Art of Distillation. Brill. Taylor, F. S. (1945). The evolution of the still. Annals of Science 5, 185–202. The single relative volatility here is a simplification; real ethanol–water mixtures form an azeotrope near 95.6% ethanol by mass.',
 dur:10,hint:'Set the starting strength and boil off more and more of the pot. Note how the distillate weakens. The vapour model is simplified.',
 init:()=>({x0:.1,frac:.2}),
 watch(p){return {x0:.1,frac:Math.min(.9,.02+p*.88)}},
 ui:[{range:'x0',label:'Alcohol in the pot at start',min:.02,max:.4,step:.01,get:s=>s.x0,act:'x0',show:v=>Math.round(v*100)+'%'},{range:'frac',label:'Share boiled off',min:.02,max:.9,step:.02,get:s=>s.frac,act:'frac',show:v=>Math.round(v*100)+'%'},{b:'Listen to it bubble',act:'bub'}],
 on:{x0(s,v){s.x0=Number(v);return 'keep'},frac(s,v){s.frac=Number(v);return 'keep'},bub(){for(let i=0;i<8;i++)AUDIO.noise({dur:.05,gain:.05,at:i*.13});return 'keep'}},
 draw(s){
  const r=C1_distil(s.x0,s.frac);let out=heading('An alembic separating alcohol from water',28);
  // pot
  out+=P('M60 200Q60 300 120 300Q180 300 180 200Z',C.dark,2,'#f4ece0');
  const lvl=300-90*(1-s.frac);out+=P(`M64 ${lvl}Q66 296 120 296Q174 296 176 ${lvl}Z`,'none',0,`rgba(23,114,183,${.15+.5*r.xPot})`);
  out+=R(70,302,100,16,'#e3753f','none',5)+TF(120,340,'heat',13,C.coral);
  // head and beak
  out+=P('M70 200Q70 140 120 140Q170 140 170 200',C.dark,2,'#fff')+P('M160 160L300 210',C.dark,6)+P('M300 210L300 236',C.dark,4);
  // receiver
  out+=P('M270 240L330 240L325 310L275 310Z',C.dark,2,'#fff');
  const rl=310-60*s.frac;out+=P(`M273 ${rl}L327 ${rl}L325 308L275 308Z`,'none',0,`rgba(196,82,56,${.2+.6*r.avg})`);
  out+=TF(120,124,'pot: '+Math.round(r.xPot*100)+'% alcohol',13,C.blue)+TF(300,334,'receiver: '+Math.round(r.avg*100)+'%',13,C.coral);
  const pl=C1_plot(380,70,190,180,[0,.9],[0,1],{xt:[[0,'0'],[.45,'45%'],[.9,'90%']],yt:[[0,'0'],[.5,'50%'],[1,'100%']],xl:'share boiled off',yl:'alcohol in what drips now'});
  out+=pl.svg;const pts=[];for(let q=0;q<=.9001;q+=.015)pts.push([pl.X(q),pl.Y(C1_distil(s.x0,q).yNow)]);
  out+=C1_poly(pts,C.coral)+Ci(pl.X(s.frac),pl.Y(r.yNow),6,C.coral,'#fff');
  out+=TF(475,350,'simplified vapour model',13,C.muted);
  return {svg:out,phase:`After boiling off ${Math.round(s.frac*100)}% of the pot, the drops coming over are ${Math.round(r.yNow*100)}% alcohol and the receiver averages ${Math.round(r.avg*100)}%, from a ${Math.round(s.x0*100)}% start. (Simplified: real mixtures cannot pass about 95.6% by simple distillation.)`};
 }});

// Jabir's sulphur–mercury theory of metals.
const C1_METALS=[{k:'lead',name:'Lead',s:.75,note:'too much impure, “burning” sulphur'},{k:'tin',name:'Tin',s:.62,note:'impure, out of balance'},{k:'iron',name:'Iron',s:.55,note:'earthy, coarse sulphur'},{k:'copper',name:'Copper',s:.5,note:'balanced but impure'},{k:'silver',name:'Silver',s:.4,note:'pure, but lacking “redness”'},{k:'gold',name:'Gold',s:.5,note:'perfect balance and purity'}];
SCENE({id:'alchemy-distillation-sulphur-mercury',name:'Sulphur and mercury',tag:'The Jābirian theory of metals',
 definition:'Writings attributed to Jābir ibn Ḥayyān (8th–10th centuries) explained metals as mixtures of two principles, sulphur and mercury, in different proportions and purities. If a metal’s balance could be corrected, it could in principle become gold, the goal of transmutation.',
 example:'On this theory lead had too much impure sulphur; refining its balance would turn it into silver or gold. Today gold is element 79, and no chemical reaction can change one element into another; in 1980 Glenn Seaborg’s team made a few thousand gold atoms from bismuth in a particle accelerator, at enormous cost.',
 desc:'A sulphur–mercury balance with a purity slider: the theory’s verdict for each metal on one side, and the modern view (an element with a fixed number of protons) on the other.',
 research:'Kraus, P. (1942–43). Jābir ibn Ḥayyān. Cairo. Newman, W. R. (1991). The Summa Perfectionis of Pseudo-Geber. Brill. Aleklett, K. et al. (1981). Energy dependence of 209Bi fragmentation in relativistic nuclear collisions. Physical Review C 23, 1044. The per-metal proportions are a schematic rendering; the sources describe them qualitatively.',
 dur:10,hint:'Choose a metal to see what the theory said was wrong with it, and what modern chemistry says. The proportions are schematic.',
 init:()=>({k:'lead'}),
 watch(p){return {k:C1_METALS[Math.min(5,Math.floor(p*6))].k}},
 ui:[{choose:C1_METALS.map(m=>[m.k,m.name]),label:'Metal',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s){
  const m=C1_METALS.find(z=>z.k===s.k);let out=heading('Metals as sulphur plus mercury',28);
  const Z={lead:82,tin:50,iron:26,copper:29,silver:47,gold:79};
  out+=L(160,110,160,250,C.dark,3)+L(60,140+(m.s-.5)*120,260,140-(m.s-.5)*120,C.dark,4);
  const yl=140+(m.s-.5)*120,yr=140-(m.s-.5)*120;
  out+=Ci(70,yl-24,22,'#e8c547',C.dark)+TBF(70,yl-19,'S',15,C.dark)+Ci(250,yr-24,22,'#b8c4cc',C.dark)+TBF(250,yr-19,'Hg',14,C.dark);
  out+=TF(70,yl+30,'sulphur '+Math.round(m.s*100)+'%',13,C.muted)+TF(250,yr+30,'mercury '+Math.round((1-m.s)*100)+'%',13,C.muted);
  out+=P('M140 250H180L190 270H130Z',C.dark,2,'#dfe7ec');
  out+=C1_card(310,64,270,'Jābirian theory: '+m.name,[m.note,m.k==='gold'?'The goal of transmutation.':'Correct it, and it nears gold.'],C.amber);
  out+=C1_card(310,170,270,'Modern chemistry: '+m.name,[`An element: ${Z[m.k]} protons in every atom.`,'No chemical reaction changes that.'],C.green);
  out+=TF(30,320,'Nuclear reactions can: in 1980 a few thousand gold atoms were made from bismuth',13,C.muted,'start')+TF(30,338,'in a particle accelerator. Proportions in the balance are schematic.',13,C.muted,'start');
  return {svg:out,phase:`${m.name}: the Jābirian theory says “${m.note}”; modern chemistry says it is element ${Z[m.k]}, which chemistry cannot transmute.`};
 }});

// al-Razi's classification of substances (Kitab al-asrar, 10th century).
const C1_RAZI=[{k:'mercury',n:'Mercury',c:'spirit',m:'Hg, a liquid metal'},{k:'sulphur',n:'Sulphur',c:'spirit',m:'S, an element'},{k:'salammoniac',n:'Sal ammoniac',c:'spirit',m:'NH₄Cl, sublimes'},{k:'gold',n:'Gold',c:'body',m:'Au, an element'},{k:'iron',n:'Iron',c:'body',m:'Fe, an element'},{k:'vitriol',n:'Green vitriol',c:'vitriol',m:'FeSO₄·7H₂O'},{k:'borax',n:'Borax',c:'borax',m:'Na₂B₄O₇·10H₂O'},{k:'salt',n:'Common salt',c:'salt',m:'NaCl'}];
const C1_RCLS=[['spirit','Spirits'],['body','Bodies'],['vitriol','Vitriols'],['borax','Boraxes'],['salt','Salts']];
SCENE({id:'alchemy-distillation-classify',name:'Al-Rāzī sorts substances',tag:'A laboratory classification',
 definition:'In his Book of Secrets (Kitāb al-asrār, 10th century) Abū Bakr al-Rāzī sorted mineral substances into groups by how they behave in the laboratory: “spirits” that fly off when heated, “bodies” (metals), stones, vitriols, boraxes and salts. He also listed the apparatus of the laboratory.',
 example:'Mercury, sulphur and sal ammoniac are “spirits” because they vaporise or sublime when heated; gold and iron are “bodies” because they melt but do not fly off.',
 desc:'Eight substances to sort into al-Rāzī’s classes by pressing a class button for each, with the modern formula revealed when you check.',
 research:'Stapleton, H. E., Azo, R. F. & Hidayat Husain, M. (1927). Chemistry in Iraq and Persia in the tenth century A.D. Memoirs of the Asiatic Society of Bengal 8, 317–418. Ruska, J. (1937). Al-Rāzī’s Buch Geheimnis der Geheimnisse. Berlin.',
 dur:10,hint:'Pick a substance, then the class you think al-Rāzī put it in. Press Check to see his grouping and the modern formula. Your answers stay on this page.',
 init:()=>({sel:'mercury',ans:{},checked:false}),
 watch(p){const n=Math.floor(p*9),ans={};C1_RAZI.slice(0,Math.min(8,n)).forEach(r=>ans[r.k]=r.c);return {sel:C1_RAZI[Math.min(7,n)].k,ans,checked:p>.9}},
 ui:[{b:'Check',act:'check'},{b:'Clear',act:'clear'}],
 on:{sel(s,v){s.sel=v;return 'keep'},cls(s,v){s.ans={...s.ans,[s.sel]:v};s.checked=false;const i=C1_RAZI.findIndex(r=>r.k===s.sel);if(i<C1_RAZI.length-1)s.sel=C1_RAZI[i+1].k;return 'keep'},check(s){s.checked=true;return 'keep'},clear(s){s.ans={};s.checked=false;s.sel='mercury';return 'keep'}},
 draw(s,f,X){
  let out=heading('Sort the substances as al-Rāzī did',28);let right=0;
  C1_RAZI.forEach((r,i)=>{const x=30+(i%4)*138,y=50+Math.floor(i/4)*92,a=s.ans[r.k],ok=a===r.c;if(ok)right++;
   const st=s.checked&&a?(ok?C.green:C.coral):(s.sel===r.k?C.blue:C.line);
   out+=C1_btn(X,'sel',r.k,`${r.n}${a?', placed as '+a:''}. Press to select.`,x,y,128,80,[r.n,a?(C1_RCLS.find(c=>c[0]===a)[1]):'—',s.checked?r.m:''],{stroke:st,bold:true});
  });
  out+=TF(30,250,'Put the selected substance in:',13,C.muted,'start');
  C1_RCLS.forEach(([k,l],i)=>out+=C1_btn(X,'cls',k,`Class ${l}`,30+i*110,260,102,40,l,{stroke:C.purple}));
  out+=counter(30,312,'placed',Object.keys(s.ans).length+' of 8',C.blue,130)+(s.checked?counter(170,312,'matching al-Rāzī',right+' of 8',C.green,170):'');
  out+=TF(570,340,'Classes by behaviour on heating,',13,C.muted,'end')+TF(570,356,'not by modern composition.',13,C.muted,'end');
  return {svg:out,phase:s.checked?`You matched ${right} of 8 to al-Rāzī’s classes. His “spirits” were the substances that fly off when heated: a practical, laboratory test.`:`Selected: ${C1_RAZI.find(r=>r.k===s.sel).n}. Choose a class for it.`};
 }});

/* ================================================================ boyle-law */
// Boyle's J-tube (1662). Air column of 12 inches (48 quarter-inch divisions) at atmospheric pressure 29 2/16 in Hg.
// Ideal law: length = 48 × 29.125 / (29.125 + h). Boyle's own rows quoted: 48 → 29 2/16; 24 → 58 13/16 (ideal 58 2/8);
// 12 → 117 9/16 (ideal 116 4/8), as reproduced in standard histories.
const C1_PATM=29.125;
const C1_BOYLE=[[48,29.125],[24,58.8125],[12,117.5625]];
SCENE({id:'boyle-law',name:'Boyle’s J-tube',tag:'Pressure × volume',
 definition:'In 1662 Robert Boyle trapped air in the closed short arm of a J-shaped glass tube and poured mercury into the long arm. Each time he doubled the pressure on the air, its volume halved: pressure times volume stayed constant at a fixed temperature.',
 example:'Boyle started with 48 divisions of air at atmospheric pressure (29 2/16 inches of mercury). Squeezed to 24 divisions it needed about 58 13/16 inches in total, close to the 58 2/8 his hypothesis predicted.',
 desc:'A J-tube: a slider pours mercury into the open arm, the trapped air column shortens, and a table and plot compare your readings and three of Boyle’s rows with P × V = constant.',
 research:'Boyle, R. (1662). A Defence of the Doctrine Touching the Spring and Weight of the Air (2nd edn of New Experiments Physico-Mechanicall). West, J. B. (2005). Robert Boyle’s landmark book of 1660 with the first experiments on rarified air. Journal of Applied Physiology 98, 31–39. Boyle’s rows are quoted as commonly reproduced. Mercury is toxic: this is not an experiment to do at home.',
 dur:11,hint:'Pour in mercury, press Record at a few levels, and compare your points with Boyle’s. Mercury vapour is poisonous; Boyle did not know that.',
 init:()=>({h:29,pts:[]}),
 watch(p){const h=Math.round(p*88);const pts=[0,15,29,50,88].filter(v=>v<=h).map(v=>v);return {h,pts}},
 ui:[{range:'h',label:'Mercury difference (inches)',min:0,max:90,step:1,get:s=>s.h,act:'h'},{b:'Record',act:'rec'},{b:'Clear',act:'clr'}],
 on:{h(s,v){s.h=Number(v);return 'keep'},rec(s){if(!s.pts.includes(s.h))s.pts=[...s.pts,s.h].sort((a,b)=>a-b);return 'keep'},clr(s){s.pts=[];return 'keep'}},
 draw(s){
  const P_=C1_PATM+s.h,len=48*C1_PATM/P_;let out=heading('Squeezing air with mercury',28);
  // tube: closed short arm on left, open long arm on right; scale 2.2 px per quarter-inch for air, 2 px per inch of mercury
  const bx=60,by=330,sc=2.2;
  out+=P(`M${bx} ${by-48*sc-20}V${by}Q${bx} ${by+20} ${bx+30} ${by+20}Q${bx+60} ${by+20} ${bx+60} ${by}V40`,'#cfdbe3',18)+P(`M${bx} ${by}Q${bx} ${by+20} ${bx+30} ${by+20}Q${bx+60} ${by+20} ${bx+60} ${by}`,'#9aa7b0',12)+R(bx-9,by-48*sc-26,18,8,C.dark,'none',3)+TF(bx+60,32,'open',13,C.muted)+TF(bx,by-48*sc-34,'sealed',13,C.muted);
  const airTop=by-48*sc-20,airBot=airTop+len*sc;
  out+=R(bx-6,airTop,12,len*sc,'#dbeaf5','none',3);
  out+=R(bx-6,airBot,12,by-airBot,'#9aa7b0','none',2)+R(bx+54,Math.max(40,airBot-s.h*2*1),12,by-Math.max(40,airBot-s.h*2),'#9aa7b0','none',2);
  out+=TF(bx-14,airTop+len*sc/2+4,Math.round(len)+' div',13,C.blue,'end');
  out+=TF(bx+80,airBot-s.h+4,'h = '+s.h+' in',13,C.ink,'start');
  // plot P vs 1/V
  const pl=C1_plot(250,64,190,200,[0,.09],[0,130],{xt:[[0,'0'],[1/24,'1/24'],[1/12,'1/12']],yt:[[0,'0'],[60,'60'],[120,'120']],xl:'1 ÷ volume (divisions)',yl:'pressure (in Hg)'});
  out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(.09),pl.Y(.09*48*C1_PATM),C.green,2,'stroke-dasharray="6 4"');
  C1_BOYLE.forEach(([v,p])=>out+=R(pl.X(1/v)-5,pl.Y(p)-5,10,10,C.amber,'none',2));
  s.pts.forEach(h=>{const p=C1_PATM+h,l=48*C1_PATM/p;out+=Ci(pl.X(1/l),pl.Y(p),5,C.blue)});
  out+=Ci(pl.X(1/len),pl.Y(P_),7,'none',C.coral);
  out+=counter(460,64,'pressure',C1_f(P_,1)+' in',C.coral,120)+counter(460,118,'volume',C1_f(len,1)+' div',C.blue,120)+counter(460,172,'P × V',Math.round(P_*len),C.green,120);
  out+=R(462,236,10,10,C.amber,'none',2)+TF(478,245,'Boyle 1662',13,C.ink,'start')+Ci(467,264,5,C.blue)+TF(478,268,'your records',13,C.ink,'start');
  out+=TF(250,330,'Dashed line: P × V = 48 × 29⅛ ≈ 1,398',13,C.muted,'start');
  return {svg:out,phase:`With ${s.h} inches of extra mercury the air is at ${C1_f(P_,1)} inches of pressure and fills ${C1_f(len,1)} divisions: P × V ≈ ${Math.round(P_*len)}, the same as at the start. Boyle’s own readings sat within about 1% of this.`};
 }});

// P against V is a curve; P against 1/V is a straight line. Amount of gas shifts the curve.
SCENE({id:'boyle-law-curve',name:'Why plot 1 ÷ V?',tag:'Straightening a curve',
 definition:'If pressure times volume is constant, a graph of pressure against volume is a hyperbola, which is hard to judge by eye. Plotting pressure against 1 ÷ volume turns it into a straight line through the origin, so any departure from the law shows at once.',
 example:'Doubling the amount of trapped air doubles the constant: at the same volume the pressure doubles, so the hyperbola moves outward and the straight line gets twice as steep.',
 desc:'Two plots side by side: pressure against volume (a curve) and pressure against 1 ÷ volume (a line), with sliders for the amount of gas and a volume marker.',
 research:'Boyle, R. (1662). A Defence of the Doctrine Touching the Spring and Weight of the Air. Mariotte, E. (1676). Discours de la nature de l’air. The temperature dependence (Charles, Gay-Lussac) is taken up in Physics In Motion.',
 dur:9,hint:'Change the amount of gas and move the volume marker. The straight-line plot makes the law easy to test.',
 init:()=>({n:1,v:2}),
 watch(p){return {n:1+Math.floor(p*2.99)*.5,v:.6+p*3.2}},
 ui:[{range:'n',label:'Amount of gas',min:.5,max:2,step:.25,get:s=>s.n,act:'n',show:v=>'×'+v},{range:'v',label:'Volume',min:.5,max:4,step:.1,get:s=>s.v,act:'v'}],
 on:{n(s,v){s.n=Number(v);return 'keep'},v(s,v){s.v=Number(v);return 'keep'}},
 draw(s){
  let out=heading('The same law, two ways of plotting',28);const k=s.n*2,p=k/s.v;
  const a=C1_plot(60,64,220,220,[0,4],[0,8],{xt:[[0,'0'],[2,'2'],[4,'4']],yt:[[0,'0'],[4,'4'],[8,'8']],xl:'volume',yl:'pressure'});
  const b=C1_plot(340,64,220,220,[0,2],[0,8],{xt:[[0,'0'],[1,'1'],[2,'2']],yt:[[0,'0'],[4,'4'],[8,'8']],xl:'1 ÷ volume',yl:'pressure'});
  out+=a.svg+b.svg;
  const pa=[];for(let v=.25;v<=4;v+=.05){const pp=k/v;if(pp<=8)pa.push([a.X(v),a.Y(pp)])}out+=C1_poly(pa,C.blue);
  out+=C1_poly([[b.X(0),b.Y(0)],[b.X(Math.min(2,8/k)),b.Y(Math.min(8,2*k))]],C.green);
  if(p<=8){out+=Ci(a.X(s.v),a.Y(p),6,C.coral,'#fff')+Ci(b.X(1/s.v),b.Y(p),6,C.coral,'#fff')}
  out+=TF(300,350,`P × V = ${C1_f(k,1)} for this amount of gas; at V = ${C1_f(s.v,1)}, P = ${C1_f(p,2)}`,13,C.ink);
  return {svg:out,phase:`With ${s.n}× the gas, P × V = ${C1_f(k,1)}. At volume ${C1_f(s.v,1)} the pressure is ${C1_f(p,2)}. On the right the same data lie on a straight line of slope ${C1_f(k,1)}.`};
 }});

// Who gets the credit: Boyle, Hooke, Towneley and Power, Mariotte.
const C1_BCRED0=[{k:'power',y:'1661',t:'Richard Towneley and Henry Power',l:['Measured air at different altitudes and suggested','the inverse relation; Boyle credits “Mr Towneley”','for the hypothesis in 1662.']},
 {k:'hooke',y:'1658–62',t:'Robert Hooke',l:['Boyle’s paid assistant; built the improved air pump','and probably ran many of the experiments. His','role is now widely acknowledged.']},
 {k:'boyle',y:'1662',t:'Robert Boyle',l:['Published the J-tube tables and argued for the','“spring of the air”; English-speaking countries','call the relation Boyle’s law.']},
 {k:'mariotte',y:'1676',t:'Edme Mariotte',l:['Found the same law independently and noted the','temperature condition; in France it is often','called Mariotte’s law (loi de Mariotte).']}];
const C1_BCRED=['hooke','power','boyle','mariotte'].map(k=>C1_BCRED0.find(c=>c.k===k));
SCENE({id:'boyle-law-credit',name:'Whose law is it?',tag:'Credit and collaboration',
 definition:'Boyle’s law was a collaborative result. Richard Towneley and Henry Power suggested the relation, Robert Hooke built the pump and much of the apparatus, Boyle published the decisive tables in 1662, and Edme Mariotte found it independently in 1676.',
 example:'Boyle himself wrote that the hypothesis “that supposes the pressures and expansions to be in reciprocal proportion” was Mr Towneley’s.',
 desc:'A timeline of four contributors; press each for their part in establishing the law.',
 research:'Webster, C. (1965). The discovery of Boyle’s law, and the concept of the elasticity of air in the seventeenth century. Archive for History of Exact Sciences 2, 441–502. Shapin, S. (1989). The invisible technician. American Scientist 77, 554–563.',
 dur:9,hint:'Press each name. Laboratory work in the 1660s depended on assistants and instrument makers whose names were often left out.',
 init:()=>({k:'boyle'}),
 watch(p){return {k:C1_BCRED[Math.min(3,Math.floor(p*4))].k}},
 ui:[{choose:C1_BCRED.map(c=>[c.k,c.t.split(' ').slice(-1)[0]]),label:'Who',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('One law, several people',28);out+=L(50,110,550,110,C.line,3);
  C1_BCRED.forEach((c,i)=>{const x=80+i*146,on=s.k===c.k;out+=hit(X,'k',c.k,`${c.t}, ${c.y}`,Ci(x,110,on?14:10,on?C.blue:'#fff',C.blue)+TBF(x,84,c.y,13,C.muted)+TF(x,142,c.t.split(' ').slice(-1)[0],13,on?C.blue:C.ink))});
  const c=C1_BCRED.find(z=>z.k===s.k);out+=C1_card(50,170,500,c.t+' ('+c.y+')',c.l,C.blue);
  return {svg:out,phase:`${c.t} (${c.y}): ${c.l.join(' ')}`};
 }});

/* ================================================================ phlogiston */
const C1_PROC=[{k:'charcoal',n:'Burn charcoal',ph:['Charcoal is rich in phlogiston; burning releases','it into the air, leaving a little ash.'],ox:['Carbon combines with oxygen from the air','to make carbon dioxide: C + O₂ → CO₂.']},
 {k:'calcine',n:'Heat a metal in air',ph:['The metal loses its phlogiston and becomes','a dull powder, its “calx”.'],ox:['The metal combines with oxygen to make an','oxide: 2Hg + O₂ → 2HgO.']},
 {k:'smelt',n:'Smelt ore with charcoal',ph:['Charcoal gives its phlogiston back to the','calx, restoring the shiny metal.'],ox:['Carbon takes the oxygen away from the','oxide: 2PbO + C → 2Pb + CO₂.']},
 {k:'jar',n:'Burn in a closed jar',ph:['The air becomes saturated with phlogiston','and can take no more, so the flame dies.'],ox:['The flame uses up much of the oxygen and','goes out before it is all gone.']}];
SCENE({id:'phlogiston',name:'The phlogiston theory',tag:'Stahl’s explanation of burning',
 definition:'Georg Ernst Stahl (around 1700), building on Johann Becher, proposed that combustible things contain phlogiston, which they give off when they burn. The theory linked burning, rusting, smelting and breathing in one scheme, and most chemists accepted it for most of the eighteenth century.',
 example:'Smelting was its triumph: charcoal, rich in phlogiston, gives phlogiston back to a metal’s calx (its oxide) and the metal reappears. The oxygen theory explains the same step as carbon removing oxygen.',
 desc:'Four processes, each with the phlogiston explanation and the oxygen explanation side by side, and a picture of the step.',
 research:'Stahl, G. E. (1703). Specimen Becherianum. Partington, J. R. & McKie, D. (1937–39). Historical studies on the phlogiston theory. Annals of Science 2–4. Chang, H. (2012). Is Water H2O? Evidence, Realism and Pluralism. Springer (a defence of phlogiston’s merits).',
 dur:10,hint:'Choose a process. Both theories explain all four; the next scene shows the one thing phlogiston struggled with.',
 init:()=>({k:'smelt'}),
 watch(p){return {k:C1_PROC[Math.min(3,Math.floor(p*4))].k}},
 ui:[{choose:C1_PROC.map(c=>[c.k,c.n]),label:'Process',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s){
  const c=C1_PROC.find(z=>z.k===s.k);let out=heading(c.n,28);
  out+=C1_card(30,60,260,'Phlogiston theory (1700s)',c.ph,C.amber)+C1_card(310,60,260,'Oxygen theory (Lavoisier)',c.ox,C.green);
  // little picture
  const y=210;out+=R(240,y+60,120,14,'#e3753f','none',5);
  if(s.k==='jar'){out+=P(`M250 ${y+56}V${y}Q250 ${y-30} 300 ${y-30}Q350 ${y-30} 350 ${y}V${y+56}`,C.dark,2,'#f6fbff')+R(296,y+20,8,36,'#efe6d0',C.dark,2)}
  else{out+=R(255,y+30,90,26,s.k==='charcoal'?'#333':s.k==='calcine'?'#b8c4cc':'#d9d2c4',C.dark,6)}
  out+=P(`M290 ${y+(s.k==='jar'?20:30)}Q282 ${y+5} 300 ${y-8}Q318 ${y+5} 310 ${y+(s.k==='jar'?20:30)}Z`,'none',0,'#f2a65a');
  out+=TF(300,330,'Both explanations fit what you see. The difference shows up on a balance.',13,C.ink);
  return {svg:out,phase:`${c.n}. Phlogiston: ${c.ph.join(' ')} Oxygen: ${c.ox.join(' ')}`};
 }});

// The weight problem: metals gain weight when they burn.
const C1_MW={Sn:118.71,O:16.00,Hg:200.59,Mg:24.305};
const C1_CALX={tin:{n:'Tin',f:'SnO₂',r:(C1_MW.Sn+2*C1_MW.O)/C1_MW.Sn},mercury:{n:'Mercury',f:'HgO',r:(C1_MW.Hg+C1_MW.O)/C1_MW.Hg},magnesium:{n:'Magnesium',f:'MgO',r:(C1_MW.Mg+C1_MW.O)/C1_MW.Mg}};
SCENE({id:'phlogiston-weight',name:'Burning metals get heavier',tag:'The weight problem',
 definition:'When a metal is heated in air and turns to calx, it gets heavier, not lighter. If burning released phlogiston, the calx should weigh less. Some defenders suggested phlogiston had negative weight or was lighter than air; Lavoisier argued instead that the metal had taken something from the air.',
 example:'10 g of tin heated fully in air becomes about 12.7 g of tin oxide (SnO₂); 10 g of magnesium becomes about 16.6 g of magnesium oxide. The extra mass is oxygen from the air.',
 desc:'A balance with a metal sample and a heating slider; the pan’s reading rises as the metal turns to oxide, with the mass gain computed from atomic masses.',
 research:'Guyton de Morveau, L.-B. (1772). Digressions académiques (on the weight gain of calcined metals). Lavoisier, A.-L. (1774). Opuscules physiques et chimiques. Masses use modern atomic masses: Sn 118.71, Hg 200.59, Mg 24.305, O 16.00.',
 dur:9,hint:'Choose a metal and heat it. Magnesium burns with a dazzling flame in real life: do not look straight at it.',
 init:()=>({m:'tin',ext:1}),
 watch(p){return {m:p<.5?'tin':'magnesium',ext:Math.min(1,(p%.5)*2.4)}},
 ui:[{choose:Object.keys(C1_CALX).map(k=>[k,C1_CALX[k].n]),label:'Metal',get:s=>s.m,act:'m'},{range:'ext',label:'How much has turned to calx',min:0,max:1,step:.05,get:s=>s.ext,act:'ext',show:v=>Math.round(v*100)+'%'}],
 on:{m(s,v){s.m=v;return 'keep'},ext(s,v){s.ext=Number(v);return 'keep'}},
 draw(s){
  const c=C1_CALX[s.m],mass=10*(1+(c.r-1)*s.ext);let out=heading('Weigh the metal as it burns',28);
  const tilt=(mass-10)/(c.r*10-10||1)*14;
  out+=L(200,120,200,300,C.dark,4)+P('M150 300H250',C.dark,4)+L(80,120+tilt,320,120-tilt,C.dark,4);
  out+=P(`M60 ${150+tilt}H140L130 ${170+tilt}H70Z`,C.dark,2,'#eef3f6')+R(78,140+tilt,44,12,s.ext>.5?'#dcd7cc':'#b8c4cc','none',4);
  out+=P(`M260 ${150-tilt}H340L330 ${170-tilt}H270Z`,C.dark,2,'#eef3f6')+R(286,140-tilt,28,10,C.amber,'none',3);
  out+=L(100,124+tilt*.83,100,150+tilt,C.dark,1.5)+L(300,124-tilt*.83,300,150-tilt,C.dark,1.5)+TF(300,195-tilt,'10 g weight',13,C.muted)+TF(100,195+tilt,'metal',13,C.muted);
  out+=counter(380,70,'metal at start','10.00 g',C.blue,190)+counter(380,124,'now on the pan',C1_f(mass,2)+' g',C.coral,190)+counter(380,178,'fully turned to '+c.f,C1_f(10*c.r,2)+' g',C.green,190);
  out+=TF(30,330,'Phlogiston predicted a loss. The pan shows a gain: something comes in from the air.',13,C.ink,'start');
  return {svg:out,phase:`${c.n}: ${Math.round(s.ext*100)}% turned to ${c.f}, so 10 g now weighs ${C1_f(mass,2)} g. Fully converted it would weigh ${C1_f(10*c.r,2)} g, a gain of ${C1_f((c.r-1)*100,1)}%.`};
 }});

// Airs in a closed jar: phlogisticated, dephlogisticated, fixed.
const C1_AIRS=[{k:'fixed',old:'Fixed air',who:'Black, 1750s',now:'Carbon dioxide, CO₂'},{k:'inflammable',old:'Inflammable air',who:'Cavendish, 1766',now:'Hydrogen, H₂'},{k:'phlog',old:'Phlogisticated air',who:'Rutherford, 1772',now:'Mostly nitrogen, N₂'},{k:'dephlog',old:'Dephlogisticated air',who:'Priestley, 1774',now:'Oxygen, O₂'}];
SCENE({id:'phlogiston-air',name:'The airs of pneumatic chemistry',tag:'A candle in a jar',
 definition:'Eighteenth-century chemists isolated several distinct “airs” and named them with phlogiston in mind. Air left after something burns in a sealed jar was “phlogisticated air”, saturated with phlogiston; Priestley’s new air, in which candles burned brighter, was “dephlogisticated air”.',
 example:'A candle in a sealed jar goes out while some oxygen is still left, typically somewhere around 15% instead of the 21% in fresh air (an approximate figure; it depends on the candle and jar). The remaining gas, mostly nitrogen, was called phlogisticated air.',
 desc:'A sealed jar with a candle and a time slider; the oxygen share falls until the flame dies; below, a table of the airs’ eighteenth-century and modern names.',
 research:'Black, J. (1756). Experiments upon magnesia alba, quicklime, and some other alcaline substances. Cavendish, H. (1766). Three papers containing experiments on factitious air. Philosophical Transactions 56, 141–184. Rutherford, D. (1772). Dissertatio inauguralis de aere fixo dicto, aut mephitico. Priestley, J. (1775). Experiments and Observations on Different Kinds of Air, vol. 2. The extinction level is approximate.',
 dur:10,hint:'Run time forward and light the candle again. Press any air in the table to compare its names.',
 init:()=>({t:.4,air:'phlog'}),
 watch(p){return {t:p,air:C1_AIRS[Math.min(3,Math.floor(p*4))].k}},
 ui:[{range:'t',label:'Time in the sealed jar',min:0,max:1,step:.02,get:s=>s.t,act:'t',show:v=>Math.round(v*60)+' s'},{b:'Light it (with sound)',act:'light'}],
 on:{t(s,v){s.t=Number(v);return 'keep'},light(s){s.t=0;AUDIO.noise({dur:.25,gain:.06});return 'keep'},air(s,v){s.air=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('A candle in a sealed jar',28);const o2=Math.max(15,21-12*s.t),lit=o2>15.01;
  out+=P('M60 250V110Q60 70 140 70Q220 70 220 110V250',C.dark,2,'#f6fbff')+R(40,250,200,10,C.dark,'none',3);
  out+=R(134,180,12,70,'#efe6d0',C.dark,3);
  if(lit)out+=P('M140 180Q130 160 140 140Q150 160 140 180Z','none',0,'#f2a65a');else out+=P('M140 176Q134 150 146 128',C.muted,2,'none','stroke-dasharray="3 4"');
  out+=counter(260,64,'oxygen in the jar',C1_f(o2,1)+'%',lit?C.blue:C.coral,150)+counter(420,64,'flame',lit?'burning':'out',lit?C.green:C.coral,150);
  out+=TF(260,134,'Flames usually die near 15% oxygen (approximate).',13,C.muted,'start');
  C1_AIRS.forEach((a,i)=>{const y=160+i*44,on=s.air===a.k;out+=hit(X,'air',a.k,`${a.old}: ${a.now}`,R(260,y,310,38,on?C.pale:'#fff',on?C.blue:C.line,8)+TBF(270,y+16,a.old,13,C.ink,'start')+TF(270,y+32,a.who,12.5,C.muted,'start')+TF(560,y+24,a.now,13,C.green,'end'))});
  out+=TF(30,290,'What is left: “phlogisticated air”,',13,C.ink,'start')+TF(30,308,'mostly nitrogen with some CO₂.',13,C.ink,'start');
  return {svg:out,phase:lit?`After ${Math.round(s.t*60)} s the jar holds about ${C1_f(o2,1)}% oxygen and the candle still burns.`:'The candle has gone out with oxygen still left (around 15%, approximate). The leftover gas was called phlogisticated air.'};
 }});

/* ================================================================ conservation-of-mass */
// Lavoisier: tin heated in a sealed retort. Sealed: total mass unchanged. Opened afterwards: air rushes in.
SCENE({id:'conservation-of-mass',name:'Lavoisier’s sealed vessel',tag:'Mass is conserved',
 definition:'Antoine Lavoisier heated metals in sealed glass vessels and weighed everything before and after. The total mass did not change; only when the vessel was opened did air rush in and the mass increase. Matter is neither created nor destroyed in a chemical reaction, only rearranged.',
 example:'Heat 10 g of tin in a sealed flask containing about 1.5 g of air. Before and after, flask plus tin plus air weighs the same. Open it, and fresh air flows in to replace the oxygen the tin has taken, so the reading goes up.',
 desc:'A balance holding a sealed flask of tin, with buttons to heat it and to open it; readings for the whole flask, the tin and the air inside.',
 research:'Lavoisier, A.-L. (1774). Mémoire sur la calcination de l’étain dans les vaisseaux fermés. Lavoisier, A.-L. (1789). Traité élémentaire de chimie. Boyle had heated tin in sealed vessels in 1673 but opened them before weighing, so missed the point. The air mass here is illustrative.',
 dur:10,hint:'Heat the sealed flask and watch the total. Then open it. Lavoisier’s trick was weighing before opening.',
 init:()=>({heat:0,open:false}),
 watch(p){return {heat:Math.min(1,p*1.6),open:p>.75}},
 ui:[{range:'heat',label:'Heating',min:0,max:1,step:.05,get:s=>s.heat,act:'heat',show:v=>Math.round(v*100)+'%'},{b:'Open the flask',act:'open'},{b:'Reseal and start again',act:'reset'}],
 on:{heat(s,v){s.heat=Number(v);return 'keep'},open(s){s.open=true;return 'keep'},reset(s){s.heat=0;s.open=false;return 'keep'}},
 draw(s){
  // 10 g tin; air in flask 1.50 g of which oxygen 0.35 g (≈23% by mass). Tin takes up to all the oxygen (illustrative).
  const glass=80,tin0=10,air0=1.5,o2=.35,used=o2*s.heat,tin=tin0+used,air=air0-used,inflow=s.open?used*28.97/32:0,total=glass+tin+air+inflow;
  let out=heading('Weigh before you open',28);
  out+=L(170,140,170,320,C.dark,4)+P('M110 320H230',C.dark,4)+L(60,140,280,140,C.dark,4);
  out+=Ci(100,190,40,'#f6fbff',C.dark)+R(92,130,16,24,'#f6fbff',C.dark,3)+(s.open?'':R(88,124,24,8,C.dark,'none',2));
  out+=P('M78 210Q100 220 122 210L118 222H82Z','none',0,s.heat>.5?'#dcd7cc':'#b8c4cc');
  if(s.heat>0&&!s.open)out+=R(80,236,40,8,'#e3753f','none',3);
  out+=counter(320,64,'whole flask',C1_f(total,2)+' g',s.open&&used>0?C.coral:C.green,240);
  out+=counter(320,124,'tin (and calx)',C1_f(tin,2)+' g',C.blue,115)+counter(445,124,'air inside',C1_f(air+inflow,2)+' g',C.purple,115);
  out+=C1_card(320,190,250,s.open?'Opened':'Sealed',s.open?'Fresh air rushed in to replace the oxygen the tin took, so the reading went up.':'The tin gains exactly what the air inside loses, so the total stays the same.',s.open?C.coral:C.green);
  out+=TF(320,330,'Glass 80 g; air 1.50 g (illustrative).',13,C.muted,'start');
  return {svg:out,phase:s.open?`Opened after heating: the reading rose by ${C1_f(inflow,2)} g, as fresh air filled the space left by the ${C1_f(used,2)} g of oxygen the tin had taken.`:`Sealed and ${Math.round(s.heat*100)}% heated: the tin has gained ${C1_f(used,2)} g, the air has lost ${C1_f(used,2)} g, and the total is still ${C1_f(total,2)} g.`};
 }});

// Balancing equations: count atoms and masses on both sides.
const C1_EQ={methane:{n:'Burning methane',l:[['CH₄',{C:1,H:4},16.043],['O₂',{O:2},31.998]],r:[['CO₂',{C:1,O:2},44.009],['H₂O',{H:2,O:1},18.015]],ans:[1,2,1,2]},
 hydrogen:{n:'Burning hydrogen',l:[['H₂',{H:2},2.016],['O₂',{O:2},31.998]],r:[['H₂O',{H:2,O:1},18.015]],ans:[2,1,2]},
 tin:{n:'Calcining tin',l:[['Sn',{Sn:1},118.71],['O₂',{O:2},31.998]],r:[['SnO₂',{Sn:1,O:2},150.708]],ans:[1,1,1]},
 mercury:{n:'Heating mercury oxide',l:[['HgO',{Hg:1,O:1},216.589]],r:[['Hg',{Hg:1},200.59],['O₂',{O:2},31.998]],ans:[2,2,1]}};
SCENE({id:'conservation-of-mass-balance',name:'Balancing an equation',tag:'Atoms in, atoms out',
 definition:'Because mass is conserved, a chemical equation must have the same number of each kind of atom on both sides. The numbers in front of each formula (coefficients) are chosen to make the atoms balance; then the masses balance too.',
 example:'Methane burning: CH₄ + 2O₂ → CO₂ + 2H₂O. One carbon, four hydrogens and four oxygens on each side; 16.04 + 64.00 ≈ 44.01 + 36.03 g per mole, about 80.04 g each side.',
 desc:'A reaction with steppers for each coefficient, atom tallies for both sides, and the total molar mass on each side.',
 research:'Lavoisier, A.-L. (1789). Traité élémentaire de chimie. Modern atomic masses (IUPAC): H 1.008, C 12.011, O 15.999, Sn 118.71, Hg 200.59.',
 dur:10,hint:'Change the coefficients until every element has a tick. Try to use the smallest whole numbers.',
 init:()=>({eq:'methane',c:[1,1,1,1]}),
 watch(p){const keys=Object.keys(C1_EQ),k=keys[Math.min(3,Math.floor(p*4))],a=C1_EQ[k].ans,frac=(p*4)%1;return {eq:k,c:frac>.5?a.slice():a.map(()=>1)}},
 ui:[{choose:Object.keys(C1_EQ).map(k=>[k,C1_EQ[k].n]),label:'Reaction',get:s=>s.eq,act:'eq'}],
 on:{eq(s,v){s.eq=v;s.c=C1_EQ[v].l.concat(C1_EQ[v].r).map(()=>1);return 'keep'},up(s,i){i=Number(i);s.c=s.c.slice();s.c[i]=Math.min(6,(s.c[i]||1)+1);return 'keep'},dn(s,i){i=Number(i);s.c=s.c.slice();s.c[i]=Math.max(1,(s.c[i]||1)-1);return 'keep'}},
 draw(s,f,X){
  const e=C1_EQ[s.eq],all=e.l.concat(e.r),c=all.map((_,i)=>s.c[i]||1);let out=heading(e.n,28);
  let x=40;const n=all.length,w=(520-(n-1)*20)/n;
  all.forEach((sp,i)=>{const cx=x+w/2;
   out+=R(x,60,w,90,'#fff',C.line,10)+TBF(cx,112,`${c[i]} ${sp[0]}`,20,C.ink);
   out+=hit(X,'up',i,`More ${sp[0]}`,R(x+w-34,64,28,26,C.pale,C.blue,6)+TBF(x+w-20,82,'+',15,C.blue))+hit(X,'dn',i,`Less ${sp[0]}`,R(x+6,64,28,26,C.pale,C.blue,6)+TBF(x+20,82,'−',15,C.blue));
   if(i<n-1)out+=TBF(x+w+10,112,i===e.l.length-1?'→':'+',20,C.muted);
   x+=w+20;});
  const tally=(side,off)=>{const t={};side.forEach((sp,i)=>{for(const a in sp[1])t[a]=(t[a]||0)+sp[1][a]*c[i+off]});return t};
  const L_=tally(e.l,0),Rr=tally(e.r,e.l.length),els=[...new Set(Object.keys(L_).concat(Object.keys(Rr)))];
  let ok=true;els.forEach((el,i)=>{const a=L_[el]||0,b=Rr[el]||0,good=a===b;if(!good)ok=false;const y=184+i*30;
   out+=TBF(80,y,el,15,C.ink)+TF(200,y,'left '+a,14,C.blue)+TF(330,y,'right '+b,14,C.coral)+TBF(430,y,good?'✓':'✗',16,good?C.green:C.coral)});
  const mass=(side,off)=>side.reduce((t,sp,i)=>t+sp[2]*c[i+off],0),mL=mass(e.l,0),mR=mass(e.r,e.l.length);
  out+=counter(70,300,'mass in (g per mole)',C1_f(mL,2),C.blue,200)+counter(330,300,'mass out',C1_f(mR,2),C.coral,200);
  return {svg:out,phase:ok?`Balanced: every element has the same count on both sides, and the masses agree (${C1_f(mL,2)} g in, ${C1_f(mR,2)} g out).`:`Not yet balanced: ${els.filter(el=>(L_[el]||0)!==(Rr[el]||0)).join(', ')} differ between the sides.`};
 }});

// Marie-Anne Paulze Lavoisier, Lomonosov, and the fate of Lavoisier.
const C1_ML=[{k:'plates',sh:'The plates',t:'Drawing the apparatus',y:'1789',l:['Marie-Anne Paulze Lavoisier drew the thirteen','copperplate illustrations of apparatus in the','Traité élémentaire de chimie; she had studied','drawing with Jacques-Louis David.']},
 {k:'kirwan',sh:'Translation',t:'Translating the opposition',y:'1788',l:['She translated Richard Kirwan’s Essay on Phlogiston','into French, with notes by Lavoisier and colleagues','refuting it, so French chemists could read the','case for phlogiston and its rebuttal together.']},
 {k:'records',sh:'Lab records',t:'Recording the experiments',y:'1770s–80s',l:['Her sketches show her at the laboratory table','taking down results during experiments on','respiration. After 1794 she published his','Mémoires de chimie.']},
 {k:'lomonosov',sh:'Lomonosov',t:'An earlier claim',y:'1756',l:['Mikhail Lomonosov reported heating metals in','sealed vessels without a change in total weight,','and had stated conservation of matter in a 1748','letter; his work was little known in the West.']},
 {k:'1794',sh:'The Terror',t:'The guillotine',y:'1794',l:['Lavoisier, also a tax farmer, was executed in the','Terror on 8 May 1794. Lagrange is reported to','have said it took a moment to cut off that head;','a century might not produce another like it.']}];
SCENE({id:'conservation-of-mass-people',name:'The Lavoisier laboratory',tag:'More than one Lavoisier',
 definition:'The chemical revolution was a team effort. Marie-Anne Paulze Lavoisier drew the apparatus plates for the Traité, translated the leading defence of phlogiston so it could be answered, and recorded experiments. Mikhail Lomonosov had reached a similar conclusion about conservation decades earlier.',
 example:'The thirteen plates in Lavoisier’s 1789 Traité, showing the gasometer, balances and calorimeter in exact detail, are signed “Paulze Lavoisier sculpsit”.',
 desc:'Five cards on the people around the discovery of mass conservation; press each to read.',
 research:'Eagle, C. T. & Sloan, J. (1998). Marie Anne Paulze Lavoisier: the mother of modern chemistry. The Chemical Educator 3, 1–18. Kawashima, K. (2000). The issue of gender and science: a case study of Madame Lavoisier. Menshutkin, B. N. (1952). Russia’s Lomonosov. Princeton University Press. The Lagrange remark is reported second-hand.',
 dur:11,hint:'Press each card. Historians still debate how much of the Lavoisier laboratory’s work should be credited to Marie-Anne.',
 init:()=>({k:'plates'}),
 watch(p){return {k:C1_ML[Math.min(4,Math.floor(p*5))].k}},
 ui:[{choose:C1_ML.map(c=>[c.k,c.y]),label:'Card',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('Who made the chemical revolution?',28);
  C1_ML.forEach((c,i)=>out+=C1_btn(X,'k',c.k,`${c.t}, ${c.y}`,20+i*114,52,106,62,[c.y,c.sh],{sel:s.k===c.k,stroke:s.k===c.k?C.purple:C.line,bold:true,size:12.5}));
  const c=C1_ML.find(z=>z.k===s.k);out+=C1_card(40,140,520,c.t+' ('+c.y+')',c.l,C.purple);
  return {svg:out,phase:`${c.t} (${c.y}): ${c.l.join(' ')}`};
 }});

/* ================================================================ oxygen-discovery */
const C1_OX=[{k:'scheele',who:'Carl Wilhelm Scheele',y:'c. 1771–72',pub:'published 1777',l:['Made “fire air” by heating saltpetre, mercuric','oxide and other compounds. His book was delayed','by the printer, so others published first.']},
 {k:'priestley',who:'Joseph Priestley',y:'1 Aug 1774',pub:'published 1775',l:['Heated mercuric oxide with a burning lens; the','air made a candle flare. He called it','“dephlogisticated air” and kept phlogiston.']},
 {k:'lavoisier',who:'Antoine Lavoisier',y:'1775–77',pub:'named 1777',l:['After Priestley described his air in Paris in','October 1774, Lavoisier repeated the work and','argued it was an element: “principe oxygine”.']}];
SCENE({id:'oxygen-discovery',name:'Three discoverers of oxygen',tag:'A priority dispute',
 definition:'Oxygen was isolated independently by Carl Wilhelm Scheele and Joseph Priestley, and understood as an element by Antoine Lavoisier. Who “discovered” it depends on what discovery means: making it, publishing it, or explaining it.',
 example:'Scheele made it first, around 1771–72, but published in 1777. Priestley made it on 1 August 1774 and published in 1775. Lavoisier never isolated it first but was the one who explained what it was.',
 desc:'A timeline of the three claimants, with a choice of what counts as discovering, which highlights who wins on that definition.',
 research:'Scheele, C. W. (1777). Chemische Abhandlung von der Luft und dem Feuer. Priestley, J. (1775). Experiments and Observations on Different Kinds of Air, vol. 2. Lavoisier, A.-L. (1777). Mémoire sur la combustion en général. Kuhn, T. S. (1962). The Structure of Scientific Revolutions, ch. 6 (oxygen as a case study). Djerassi, C. & Hoffmann, R. (2001). Oxygen (a play about the dispute).',
 dur:11,hint:'Change what counts as discovering oxygen and see whose claim wins. Thomas Kuhn used this case to argue that discoveries are not single moments.',
 init:()=>({crit:'make'}),
 watch(p){return {crit:['make','publish','explain'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['make','First to make it'],['publish','First to publish'],['explain','First to explain it']],label:'Discovery means',get:s=>s.crit,act:'crit'}],
 on:{crit(s,v){s.crit=v;return 'keep'}},
 draw(s){
  let out=heading('Who discovered oxygen?',28);const win={make:'scheele',publish:'priestley',explain:'lavoisier'}[s.crit];
  const X_=y=>60+(y-1770)*60;out+=L(60,58,540,58,C.line,3);
  for(let y=1770;y<=1778;y+=2)out+=TF(X_(y),80,String(y),13,C.muted);
  [[1771.5,'scheele'],[1774.6,'priestley'],[1777,'lavoisier']].forEach(([y,k])=>out+=Ci(X_(y),58,k===win?10:7,k===win?C.coral:'#fff',C.coral));
  C1_OX.forEach((c,i)=>{const y=94+i*90,on=c.k===win;out+=R(40,y,520,82,on?C.coralp:'#fff',on?C.coral:C.line,10)+TBF(54,y+20,`${c.who} · ${c.y} · ${c.pub}`,13,on?C.coral:C.ink,'start')+c.l.map((t,j)=>TF(54,y+38+j*16,t,12.5,C.ink,'start')).join('')});
  const w=C1_OX.find(c=>c.k===win);
  return {svg:out,phase:`If discovery means “${{make:'first to make it',publish:'first to publish',explain:'first to explain it'}[s.crit]}”, the credit goes to ${w.who}. ${w.l.join(' ')}`};
 }});

// Priestley's experiment: heat mercuric oxide, collect oxygen. 2HgO → 2Hg + O2.
SCENE({id:'oxygen-discovery-hgo',name:'Priestley’s burning lens',tag:'2HgO → 2Hg + O₂',
 definition:'On 1 August 1774 Joseph Priestley focused sunlight with a large burning lens onto red mercuric oxide (mercurius calcinatus). It gave off a gas in which a candle burned with a remarkably vigorous flame, and in which a mouse lived longer than in ordinary air.',
 example:'Heating 10 g of mercuric oxide completely gives 9.26 g of mercury and 0.74 g of oxygen: about 0.52 litres at 0 °C, or 0.57 litres at room temperature.',
 desc:'A lens focusing light onto mercuric oxide in a tube over mercury, with a slider for the amount of oxide and how far it has decomposed, and the oxygen collected computed from the equation.',
 research:'Priestley, J. (1775). Experiments and Observations on Different Kinds of Air, vol. 2, section III. Molar masses: HgO 216.59, Hg 200.59, O₂ 32.00 g/mol; molar gas volume 22.41 L at 0 °C, 24.47 L at 25 °C (1 atm). Mercury and its vapour are highly toxic.',
 dur:10,hint:'Choose how much oxide to heat and how far the reaction has gone. Do not try this: mercury vapour is poisonous, which Priestley did not know.',
 init:()=>({m:10,ext:1}),
 watch(p){return {m:10,ext:Math.min(1,p*1.2)}},
 ui:[{range:'m',label:'Mercuric oxide',min:1,max:20,step:1,get:s=>s.m,act:'m',show:v=>v+' g'},{range:'ext',label:'Decomposed',min:0,max:1,step:.05,get:s=>s.ext,act:'ext',show:v=>Math.round(v*100)+'%'}],
 on:{m(s,v){s.m=Number(v);return 'keep'},ext(s,v){s.ext=Number(v);return 'keep'}},
 draw(s){
  const mol=s.m/216.59*s.ext,o2=mol/2,hg=mol*200.59,mo=o2*32,v0=o2*22.41,v25=o2*24.47;let out=heading('Heating mercuric oxide with sunlight',28);
  out+=P('M40 60Q90 90 40 120Q-10 90 40 60Z',C.blue,2,'#e1eef7')+L(40,90,160,180,'#f2c94c',2,'stroke-dasharray="4 4"')+L(40,70,160,180,'#f2c94c',1.5,'stroke-dasharray="4 4"')+L(40,110,160,180,'#f2c94c',1.5,'stroke-dasharray="4 4"');
  out+=R(140,100,40,200,'#f6fbff',C.dark,8);
  const gasH=Math.min(160,v25*400);out+=R(143,104,34,186,'#b8c4cc','none',6)+R(143,104,34,24+gasH,'#e8f2fa','none',6);
  out+=R(150,108,20,14,s.ext<1?'#c4422a':'#cfcfcf','none',3)+TF(186,120,'oxide',13,C.muted,'start')+TF(186,140+gasH/2,'gas',13,C.blue,'start');
  out+=R(110,290,100,30,'#b8c4cc',C.dark,6)+TF(160,340,'mercury trough',13,C.muted);
  out+=counter(260,64,'oxygen made',C1_f(mo,2)+' g',C.blue,150)+counter(420,64,'mercury left',C1_f(hg,2)+' g',C.purple,150);
  out+=counter(260,122,'gas volume at 0 °C',C1_f(v0,3)+' L',C.green,150)+counter(420,122,'at 25 °C',C1_f(v25,3)+' L',C.green,150);
  out+=TF(260,206,'2 HgO → 2 Hg + O₂',16,C.ink,'start');
  out+=TF(260,236,'Every 2 × 216.59 g of oxide gives 32.00 g of oxygen.',13,C.muted,'start');
  out+=TF(260,266,'Priestley: a candle “burned with a remarkably',13,C.ink,'start')+TF(260,284,'vigorous flame”; a mouse lived longer than in air.',13,C.ink,'start');
  out+=TF(260,330,'Mercury vapour is toxic. Do not try this.',13,C.coral,'start');
  return {svg:out,phase:`${s.m} g of mercuric oxide, ${Math.round(s.ext*100)}% decomposed, gives ${C1_f(mo,2)} g of oxygen: ${C1_f(v0,3)} L at 0 °C (${C1_f(v25,3)} L at room temperature).`};
 }});

// Lavoisier's 1787 nomenclature: old names to new.
const C1_NAMES=[{old:'Oil of vitriol',neu:'Sulphuric acid',f:'H₂SO₄'},{old:'Flowers of zinc',neu:'Zinc oxide',f:'ZnO'},{old:'Fixed air',neu:'Carbonic acid gas (carbon dioxide)',f:'CO₂'},{old:'Inflammable air',neu:'Hydrogen',f:'H₂'},{old:'Dephlogisticated air',neu:'Oxygen',f:'O₂'},{old:'Phlogisticated air',neu:'Azote (nitrogen)',f:'N₂'}];
SCENE({id:'oxygen-discovery-names',name:'A new language for chemistry',tag:'The 1787 nomenclature',
 definition:'In 1787 Guyton de Morveau, Lavoisier, Berthollet and Fourcroy published a new system of chemical names: a compound’s name would say what it was made of. Old names like “oil of vitriol” and “flowers of zinc” gave way to names like sulphuric acid and zinc oxide.',
 example:'“Oxygen” means “acid-former”: Lavoisier thought all acids contained it. Humphry Davy showed in 1810 that muriatic acid (hydrochloric acid, HCl) contains no oxygen, so the name preserves a mistake.',
 desc:'Six old names; press each to reveal its 1787 replacement and modern formula, with a note on the meaning of “oxygen”.',
 research:'Guyton de Morveau, L.-B., Lavoisier, A.-L., Berthollet, C.-L. & Fourcroy, A.-F. (1787). Méthode de nomenclature chimique. Paris. Davy, H. (1810). Researches on the oxymuriatic acid, its nature and combinations; and on the elements of the muriatic acid. Philosophical Transactions 100, 231–257.',
 dur:10,hint:'Press each old name to reveal the new one. Guess first: the new names were designed to be guessable from composition.',
 init:()=>({shown:[]}),
 watch(p){return {shown:C1_NAMES.slice(0,Math.min(6,Math.floor(p*7))).map(n=>n.old)}},
 ui:[{b:'Reveal all',act:'all'},{b:'Hide all',act:'none'}],
 on:{rev(s,v){s.shown=s.shown.includes(v)?s.shown.filter(x=>x!==v):[...s.shown,v];return 'keep'},all(s){s.shown=C1_NAMES.map(n=>n.old);return 'keep'},none(s){s.shown=[];return 'keep'}},
 draw(s,f,X){
  let out=heading('Old names, new names (1787)',28);
  C1_NAMES.forEach((n,i)=>{const y=52+i*42,on=s.shown.includes(n.old);
   out+=hit(X,'rev',n.old,`${n.old}${on?': '+n.neu:'. Press to reveal.'}`,R(30,y,540,36,on?C.greenp:'#fff',on?C.green:C.line,8)+TBF(44,y+23,n.old,13,C.ink,'start')+TF(240,y+23,on?n.neu:'?',13,on?C.green:C.muted,'start')+TMF(556,y+23,on?n.f:'',13,C.ink,'end'))});
  out+=TF(30,322,'“Oxygen” = “acid-former”: Lavoisier thought every acid contained it.',13,C.ink,'start')+TF(30,340,'Davy showed in 1810 that hydrochloric acid (HCl) has none.',13,C.muted,'start');
  return {svg:out,phase:`${s.shown.length} of 6 revealed. The new names say what a substance is made of, though “oxygen” itself rests on Lavoisier’s mistaken idea that all acids contain it.`};
 }});
