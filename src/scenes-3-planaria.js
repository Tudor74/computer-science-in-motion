/* ===================== Levin Lab In Motion · Era 3 · Planaria ===================== */
// Worms that regrow, two-headed worms, a pattern that persists through later cuts, heads of other species,
// adaptation to barium, and the claim that a trained worm keeps something of its training after its head regrows.
// Every picture is a pure function of state, frame and X. Every count, fraction, level and voltage on screen is
// computed here by a toy model (seeded with L3_rng, never Math.random). The only literals shown as results are
// published values (dates, a drug concentration, the percentages reported for Durant et al. 2017), and each
// carries a research line. Planarians are drawn as schematics, never as injured animals.

/* ---- shared helpers ---- */
const L3_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const L3_rng=n=>rng(L3_mix(n));
function L3_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const L3_note=(s,y=368)=>TF(300,y,s,13,C.muted);
const L3_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function L3_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,15,col)}
const L3_pct=(a,b)=>b?Math.round(100*a/b):0;
const L3_r1=v=>Math.round(v*10)/10;
const L3_mv=v=>{const r=Math.round(v);return (r<0?'−':r>0?'+':'')+Math.abs(r)+' mV'};
// The six evidence labels, each with its own colour pair. The badge is drawn beside the claim it applies to.
const L3_LABELS={rep:['Replicated finding',C.green,C.greenp],single:['Single-lab finding',C.blue,C.pale],frame:['Framework or hypothesis',C.purple,C.purplep],
 spec:['Speculation',C.amber,C.amberp],debate:['Criticism and debate',C.coral,C.coralp],model:['Simplified model',C.dark,'#eef2f4']};
const L3_badgeW=k=>Math.round(L3_LABELS[k][0].length*7.1+18);
function L3_badge(x,y,k,anchor='start'){const [lab,ink,fill]=L3_LABELS[k],w=L3_badgeW(k),x0=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
 return R(x0,y,w,20,fill,ink,10,k==='model'?'stroke-dasharray="4 3" stroke-width="1.4"':'stroke-width="1.4"')+TBF(x0+w/2,y+14.5,lab,12.5,ink)}
function L3_badges(x,y,keys,anchor='start'){const tot=keys.reduce((a,k)=>a+L3_badgeW(k)+8,-8);let cx=anchor==='end'?x-tot:x,out='';for(const k of keys){out+=L3_badge(cx,y,k);cx+=L3_badgeW(k)+8}return out}

/* ---- a schematic planarian, drawn sideways (head usually on the left) ----
 Ends are 'head', 'tail', 'cut' or {mix:m} (m=1 head, m=0 tail, in between a blend). The body is a polygon whose
 half-width comes from the two end profiles; new (unpigmented) tissue at either end is drawn paler. */
const L3_SKIN='#c99a69',L3_SKIND='#7a5533',L3_NEW='#f3e4d1';
function L3_endW(kind,d,hw,E,o){
 if(kind&&kind.mix!==undefined){const m=clamp(kind.mix,0,1);return m*L3_endW('head',d,hw,E,o)+(1-m)*L3_endW('tail',d,hw,E,o)}
 if(kind==='cut')return hw*(.86+.14*smooth(d/3));
 if(kind==='tail')return hw*Math.pow(smooth(d/(E*1.7)),.8);
 // head: from a tip of relative width `tip`, widening to the auricles (extra width `aur`) at 55% of the head length,
 // then a slight neck behind them, then the body.
 const a=o.aur===undefined?.25:o.aur,tip=o.tip===undefined?.34:o.tip,len=(o.len||1)*E,dp=.55*len;
 if(d<dp)return hw*(tip+(1+a-tip)*Math.pow(smooth(d/dp),.8));
 return hw*(1+a*Math.exp(-Math.pow((d-dp)/(.13*len),2))-.18*a*Math.exp(-Math.pow((d-.95*len)/(.16*len),2)));
}
const L3_isHead=k=>k==='head'||(k&&k.mix!==undefined&&k.mix>.5);
function L3_worm(x0,x1,yc,hw,Lk,Rk,o={}){
 const E=o.E||Math.min(26,(x1-x0)*.28),N=Math.max(16,Math.round((x1-x0)/5));
 // The two end profiles multiply (each is 1·hw far from its end), so auricles can stand out beyond the body.
 const w=x=>L3_endW(Lk,x-x0,hw,E,o.hl||{})*L3_endW(Rk,x1-x,hw,E,o.hr||{})/hw;
 const seg=(xa,xb,fill,stroke='none',sw=0)=>{const n=Math.max(3,Math.round((xb-xa)/4)),top=[],bot=[];
  for(let i=0;i<=n;i++){const x=xa+(xb-xa)*i/n,h=Math.max(.6,w(x));top.push([x,yc-h]);bot.push([x,yc+h])}
  const pts=top.concat(bot.reverse());return `<polygon points="${pts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`};
 let out=seg(x0,x1,o.fill||L3_SKIN,o.stroke||L3_SKIND,o.sw===undefined?1.6:o.sw);
 if(o.shade){const n=o.shadeN||24;for(let i=0;i<n;i++){const xa=x0+(x1-x0)*i/n,xb=x0+(x1-x0)*(i+1)/n;out+=seg(xa,xb+.4,o.shade((i+.5)/n))}out+=seg(x0,x1,'none',o.stroke||L3_SKIND,1.6)}
 if(o.newL>0)out+=seg(x0,Math.min(x1,x0+o.newL),L3_NEW,'none');
 if(o.newR>0)out+=seg(Math.max(x0,x1-o.newR),x1,L3_NEW,'none');
 if((o.newL>0||o.newR>0)&&!o.shade)out+=seg(x0,x1,'none',o.stroke||L3_SKIND,1.6);
 if(o.pharynx&&x1-x0>60){const px=x0+(x1-x0)*.52;out+=`<ellipse cx="${fmt(px)}" cy="${fmt(yc)}" rx="${fmt((x1-x0)*.06)}" ry="${fmt(hw*.32)}" fill="none" stroke="${L3_SKIND}" stroke-width="1.2" opacity=".7"/>`}
 if(o.eyes!==false){const er=Math.max(1.3,Math.min(2.8,hw*.13));
  const eyes=(x,dir)=>Ci(x,yc-hw*.3,er,'#fff',L3_SKIND)+Ci(x,yc+hw*.3,er,'#fff',L3_SKIND)+Ci(x+dir*er*.35,yc-hw*.3,er*.5,'#2b2b2b')+Ci(x+dir*er*.35,yc+hw*.3,er*.5,'#2b2b2b');
  const len=(o.hl&&o.hl.len||1)*E,lenR=(o.hr&&o.hr.len||1)*E;
  if(L3_isHead(Lk))out+=G(eyes(x0+len*.62,-1),Lk.mix!==undefined?`opacity="${fmt(clamp((Lk.mix-.5)*2,0,1))}"`:'');
  if(L3_isHead(Rk))out+=G(eyes(x1-lenR*.62,1),Rk.mix!==undefined?`opacity="${fmt(clamp((Rk.mix-.5)*2,0,1))}"`:'');
 }
 return out;
}
// A tiny worm icon for counts and lineages: heads = 1 (head left, tail right) or 2 (heads at both ends).
const L3_icon=(x,y,heads,len=46,col)=>L3_worm(x-len/2,x+len/2,y,len*.13,'head',heads===2?'head':'tail',{E:len*.3,fill:col||L3_SKIN,sw:1.1});

/* ===================== Lesson: worm-regeneration ===================== */
// Toy worm: 70 neoblasts at seeded positions along the body, none in the head tip (front 9%) or the pharynx (46–58.5%),
// where real planarians also have none. A piece regrows only if it holds at least one neoblast.
const L3_TIP=.09,L3_PHX=[.46,.585],L3_MAXCUTS=6;
const L3_NB=(()=>{const r=L3_rng(301),a=[];while(a.length<70){const x=r(),y=r();if(x<L3_TIP||x>.94||(x>L3_PHX[0]&&x<L3_PHX[1]))continue;a.push([x,y*2-1])}return a.sort((p,q)=>p[0]-q[0])})();
function L3_pieces(cuts){const ks=[...cuts].sort((a,b)=>a-b),b=[0,...ks.map(k=>k/12),1],out=[];
 for(let i=0;i<b.length-1;i++){const a=b[i],c=b[i+1],nb=L3_NB.filter(p=>p[0]>=a&&p[0]<c).length;out.push({a,b:c,nb,ok:nb>0,first:i===0,last:i===b.length-2})}
 return out}
const L3_cutFrames=s=>[{st:'plan',say:s.cuts.length?`${s.cuts.length} cut${s.cuts.length>1?'s':''} marked. Each dot is a neoblast, a dividing adult stem cell. There are none in front of the eyes or in the pharynx, the feeding tube in the middle.`:'No cuts yet. In Try it, press the worm where you want to cut it.'},
 {st:'cut',say:'The pieces separate. Each keeps the neoblasts that were in it; the toy counts them.'},
 {st:'grow',say:'Neoblasts near each wound divide and form a pale bud of new tissue, the blastema. A piece cut from the front grows a tail; one from the back grows a head; a middle piece grows both.'},
 {st:'done',say:''}];
SCENE({id:'worm-regeneration',name:'Cut a worm, get worms',tag:'Replicated finding · Pieces regrow whole worms',
 definition:'A planarian is a small free-living flatworm. Cut one into pieces and, within a week or two, most pieces rebuild a complete worm with a head, a brain, eyes, a pharynx and a tail. Harriet Randolph (1897) and Thomas Hunt Morgan (1898) studied this systematically, cutting worms in many ways; many labs have repeated it since. It is a replicated finding.',
 example:'The new tissue comes from neoblasts, dividing stem cells spread through the body. They are absent from the tip in front of the eyes and from the pharynx, and pieces cut only from those regions do not regenerate. The toy here keeps just that rule: a piece regrows if it holds at least one neoblast.',
 desc:'A schematic planarian with neoblasts drawn as dots, cut marks the learner places, the separated pieces, and the worms they regrow, with counts computed by the toy.',
 research:['Randolph (1897). Observations and experiments on regeneration in planarians. Archiv für Entwickelungsmechanik der Organismen 5, 352–372.','Morgan (1898). Experimental studies of the regeneration of Planaria maculata. Archiv für Entwickelungsmechanik der Organismen 7, 364–397.','Reddien & Sánchez Alvarado (2004). Fundamentals of planarian regeneration. Annual Review of Cell and Developmental Biology 20, 725–757.'],
 dur:12,hint:'Press the worm to add or remove cuts (up to six), then step through. Try a cut just behind the eyes, or two cuts close together across the pharynx.',
 init:()=>({cuts:[1,4,6,7,9]}),
 trace:L3_cutFrames,
 ui:[{b:'Clear the cuts',act:'clear'},{b:'Three even cuts',act:'even'}],
 on:{cut(s,k){k=clamp(Math.round(+k),1,11);const i=s.cuts.indexOf(k);if(i>=0)s.cuts.splice(i,1);else if(s.cuts.length<L3_MAXCUTS)s.cuts.push(k);s.cuts.sort((a,b)=>a-b)},clear(s){s.cuts=[]},even(s){s.cuts=[3,6,9]}},
 draw(s,f,X){
  const ps=L3_pieces(s.cuts),st=f?f.st:'plan',u=X?X.u:1,x0=50,x1=550,yc=92,hw=21;
  const ok=ps.filter(p=>p.ok).length;
  let out=heading(st==='done'?`${ok} of ${ps.length} piece${ps.length>1?'s':''} became worms`:st==='plan'?'Where would you cut?':st==='cut'?`${ps.length} piece${ps.length>1?'s':''}`:'Regrowing');
  out+=L3_badge(590,40,'rep','end');
  // the intact worm with neoblasts and cut marks
  out+=L3_worm(x0,x1,yc,hw,'head','tail',{pharynx:true,fill:st==='plan'?L3_SKIN:tint(L3_SKIN,.55),stroke:st==='plan'?L3_SKIND:C.line});
  for(const [nx,ny] of L3_NB)out+=Ci(x0+nx*(x1-x0),yc+ny*hw*.55,2.6,st==='plan'?C.purple:C.purplep);
  for(const k of s.cuts){const x=x0+k/12*(x1-x0);out+=L(x,yc-hw-10,x,yc+hw+10,C.coral,2.4,'stroke-dasharray="5 4"')}
  if(X&&X.try)for(let k=1;k<=11;k++){const x=x0+k/12*(x1-x0);out+=hit(X,'cut',k,`Cut position ${k} of 11${s.cuts.includes(k)?', cut marked':''}. Press to ${s.cuts.includes(k)?'remove':'add'} a cut.`,R(x-11,yc-hw-12,22,2*hw+24,'rgba(255,255,255,0)',s.cuts.includes(k)?C.coral:'none',5)+(s.cuts.includes(k)?'':Ci(x,yc+hw+16,3,C.line)))}
  out+=TF(x0,yc+hw+30,'head',13,C.muted,'start')+TF((x0+x1)/2+(x1-x0)*.02,yc+hw+30,'pharynx',13,C.muted)+TF(x1,yc+hw+30,'tail',13,C.muted,'end');
  // the pieces
  if(st!=='plan'){
   const gap=34,W=500-(ps.length-1)*gap,yp=210;let cx=50;
   const g=st==='grow'?u:st==='done'?1:0;
   ps.forEach((p,i)=>{const len=Math.max(14,(p.b-p.a)*W),E=Math.min(15,len*.5),nl=p.first?0:E*g*(p.ok?1:0),nr=p.last?0:E*g*(p.ok?1:0);
    const Lk=p.first?'head':p.ok&&g>.25?{mix:1}:'cut',Rk=p.last?'tail':p.ok&&g>.25?{mix:0}:'cut';
    const xa=cx-nl,xb=cx+len+nr;
    out+=G(L3_worm(xa,xb,yp,14,Lk,Rk,{E:Math.max(6,E),newL:nl,newR:nr,fill:p.ok?L3_SKIN:'#e6e1dc',stroke:p.ok?L3_SKIND:C.line,eyes:p.ok||p.first}),!p.ok&&st==='done'?'opacity=".55"':'');
    for(const [nx,ny] of L3_NB)if(nx>=p.a&&nx<p.b)out+=Ci(cx+(nx-p.a)/(p.b-p.a)*len,yp+ny*7,1.9,C.purple);
    out+=TF(cx+len/2,yp+34,p.ok?String(p.nb):'0',13,p.ok?C.purple:C.coral);
    if(!p.ok&&st==='done')out+=TBF(cx+len/2,yp-22,'✕',15,C.coral);
    cx+=len+gap});
   out+=TF(50,yp+52,'neoblasts in each piece (counted by the toy)',13,C.muted,'start');
   out+=L3_badge(550,yp+40,'model','end');
  }
  out+=L3_tile(70,296,140,'Pieces',String(ps.length))+L3_tile(230,296,140,'With neoblasts',String(ok),C.purple)+L3_tile(390,296,140,'Whole worms',st==='done'?String(ok):'…',C.green);
  out+=L3_note('Schematic. The toy’s only rule: a piece regrows if it holds a neoblast.',366);
  const bad=ps.filter(p=>!p.ok);
  const say=f&&f.say?f.say:`${ok} piece${ok===1?'':'s'} regrew into small whole worms, which then grow as they feed.${bad.length?` ${bad.length} piece${bad.length>1?'s':''} held no neoblasts (${bad.map(p=>p.first?'the head tip':'a piece of pharynx').join(', ')}) and did not regrow, as in real worms.`:' Every piece held neoblasts.'}`;
  return {svg:out,phase:say};
 }});

// Scene 2: one stem cell can rebuild the worm. Toy growth of the neoblast population (logistic, in days).
const L3_K=1000,L3_NB_REGEN=.1;
const L3_NEO={none:{n0:L3_K,lab:'No radiation'},sub:{n0:8,lab:'Low dose: a few survive'},lethal:{n0:0,lab:'Lethal dose'},one:{n0:1,lab:'Lethal dose + 1 transplanted cell'}};
function L3_neoRun(cond,dbl,days=40){const r=Math.log(2)/dbl;let n=L3_NEO[cond].n0;const a=[n];
 for(let d=1;d<=days;d++){if(n>0)n=n+r*n*(1-n/L3_K)*1;a.push(n)}return a}
const L3_cross=a=>{const i=a.findIndex(v=>v>=L3_NB_REGEN*L3_K);return i<0?null:i};
const L3_NBPOS=(()=>{const r=L3_rng(77),a=[];for(let i=0;i<90;i++){const x=r(),y=r()*2-1;if(x<L3_TIP||x>.93||(x>L3_PHX[0]&&x<L3_PHX[1])){i--;continue}a.push([x,y])}const sx=.7;return a.sort((p,q)=>Math.hypot(p[0]-sx,p[1]*.3)-Math.hypot(q[0]-sx,q[1]*.3))})();
SCENE({id:'worm-regeneration-neoblasts',name:'One stem cell can rebuild the worm',tag:'Replicated finding · Neoblasts make the new tissue',
 definition:'Neoblasts are the only dividing cells in an adult planarian. Radiation that kills dividing cells abolishes regeneration, and the worms die after some weeks. In 2011 Daniel Wagner, Irving Wang and Peter Reddien gave worms a dose that left only rare, isolated neoblasts, and saw single cells grow into colonies that made many cell types. Then they transplanted one such cell into a worm whose own neoblasts had been destroyed: it restored the host’s ability to regenerate.',
 example:'The single-cell result came from Reddien’s lab, independent of the Levin lab, and the wider finding that neoblasts make the new tissue is textbook. The curves here are a toy: logistic growth with a doubling time you choose, and “able to regenerate” set at 10% of the normal number. Real timings depend on species and conditions.',
 desc:'A worm drawn with its neoblasts as dots, which fill in as the population grows, beside a computed growth curve on a logarithmic scale for four treatments.',
 research:['Wagner, Wang & Reddien (2011). Clonogenic neoblasts are pluripotent adult stem cells that underlie planarian regeneration. Science 332, 811–816.','Reddien & Sánchez Alvarado (2004). Fundamentals of planarian regeneration. Annual Review of Cell and Developmental Biology 20, 725–757.'],
 dur:12,hint:'Choose a treatment and a doubling time, then run. Compare the worm with no surviving neoblasts with the one given a single transplanted cell.',
 init:()=>({cond:'one',dbl:3}),
 trace:s=>range(21).map(i=>({day:i*2,say:''})),
 ui:[{choose:[['none','None'],['sub','Low dose'],['lethal','Lethal'],['one','Lethal + 1 cell']],label:'Radiation',get:s=>s.cond,act:'cond'},{range:'dbl',label:'Doubling time (toy days)',min:1,max:6,step:.5,get:s=>s.dbl,act:'dbl'}],
 on:{cond(s,v){s.cond=L3_NEO[v]?v:'one'},dbl(s,v){s.dbl=clamp(+v,1,6)}},
 draw(s,f,X){
  const a=L3_neoRun(s.cond,s.dbl),day=f?f.day:40,n=a[Math.min(40,day)],cr=L3_cross(a),can=n>=L3_NB_REGEN*L3_K;
  let out=heading(`${L3_NEO[s.cond].lab}: day ${day}`);
  out+=L3_badge(590,40,'rep','end');
  // worm with dots
  const x0=40,x1=290,yc=118,hw=26;
  out+=L3_worm(x0,x1,yc,hw,'head','tail',{pharynx:true});
  const nd=Math.round(clamp(n/L3_K,0,1)*L3_NBPOS.length);
  L3_NBPOS.slice(0,nd).forEach(([px,py])=>{out+=Ci(x0+px*(x1-x0),yc+py*hw*.6,2.4,C.purple)});
  if(s.cond==='one')out+=arrow(x0+.7*(x1-x0),yc-hw-26,x0+.7*(x1-x0),yc-hw-4,C.coral,2)+TF(x0+.7*(x1-x0),yc-hw-32,'one cell transplanted',13,C.coral);
  out+=TF(165,yc+hw+24,`neoblasts: ${Math.round(n)} of ${L3_K} (toy count)`,13,C.purple);
  out+=TBF(165,yc+hw+46,can?'enough to regenerate':'too few to regenerate',14,can?C.green:C.coral);
  // growth curve
  const pl={x0:340,y0:84,w:230,h:136},Xd=d=>pl.x0+d/40*pl.w,Yn=v=>pl.y0+pl.h-(Math.log10(Math.max(1,v)))/3*pl.h;
  out+=R(pl.x0,pl.y0,pl.w,pl.h,'#fff',C.grid,4);
  for(const [v,l] of [[1,'1'],[10,'10'],[100,'100'],[1000,'1000']])out+=L(pl.x0-4,Yn(v),pl.x0,Yn(v),C.line,1)+TF(pl.x0-7,Yn(v)+4,l,13,C.muted,'end');
  for(const d of [0,10,20,30,40])out+=TF(Xd(d),pl.y0+pl.h+17,d,13,C.muted);
  out+=TF(pl.x0+pl.w/2,pl.y0+pl.h+34,'toy days',13,C.muted)+TF(pl.x0,pl.y0-8,'neoblasts (log scale)',13,C.muted,'start');
  out+=L(pl.x0,Yn(L3_NB_REGEN*L3_K),pl.x0+pl.w,Yn(L3_NB_REGEN*L3_K),C.green,1.4,'stroke-dasharray="5 4"')+TF(pl.x0+pl.w-4,Yn(L3_NB_REGEN*L3_K)-6,'10%',13,C.green,'end');
  if(s.cond==='lethal')out+=TF(pl.x0+pl.w/2,pl.y0+pl.h-12,'none left: the curve stays at zero',13,C.coral);
  else out+=L3_poly(a.slice(0,day+1).map((v,d)=>[Xd(d),Yn(v)]),C.purple,2.6);
  out+=L3_badge(pl.x0,pl.y0+pl.h+44,'model');
  out+=L3_tile(40,296,160,'Doubling time',fmt(s.dbl)+' toy days')+L3_tile(220,296,160,'Reaches 10% on',cr===null?(s.cond==='lethal'?'never':'after day 40'):'day '+cr,C.green)+L3_tile(400,296,160,'Started with',String(L3_NEO[s.cond].n0)+(L3_NEO[s.cond].n0===1?' cell':' cells'),C.purple);
  out+=L3_note('The toy grows cells logistically; the experiment showed the qualitative result.',366);
  const ph=s.cond==='lethal'?'With every neoblast killed, nothing can divide. The worm cannot replace cells or regenerate, and in the experiments such worms died after some weeks.':
   s.cond==='none'?'An untreated worm keeps its full neoblast population and can regenerate at any time.':
   s.cond==='one'?(can?`One transplanted neoblast has divided into enough cells (toy count ${Math.round(n)}) to repopulate the host. This is what Wagner, Wang and Reddien saw: a single cell restored regeneration, so one neoblast can make every cell type the worm needs.`:`A single transplanted neoblast is dividing. In the toy it needs until day ${cr===null?'beyond 40':cr} to pass the 10% line.`):
   (can?`The few survivors each grew into a colony. Colonies from single cells made neurons, gut and other cell types, the first sign that individual neoblasts are pluripotent.`:'A few neoblasts survived the low dose. Each starts a colony.');
  return {svg:out,phase:ph};
 }});

// Scene 3: which end becomes the head. Toy β-catenin level at each wound of a trunk fragment.
const L3_BC={ant:.12,post:.78,th:.4};
const L3_bcEnd=(k,end)=>k*L3_BC[end];
SCENE({id:'worm-regeneration-polarity',name:'Which end becomes the head?',tag:'Replicated finding · β-catenin sets head versus tail',
 definition:'A trunk piece regrows a head at its front wound and a tail at its back wound, so it keeps the old polarity. In 2008 two independent groups, Christian Petersen and Peter Reddien, and Kyle Gurley, Jochen Rink and Alejandro Sánchez Alvarado, showed that the protein β-catenin, part of the Wnt signalling pathway, acts as the switch: high activity at a wound makes a tail, low activity a head.',
 example:'Silencing β-catenin by RNA interference made fragments regrow heads at back wounds, and turned the tail of uncut worms into a head. Silencing APC, which normally holds β-catenin down, made tails grow at front wounds. In the toy, each wound reads a level of β-catenin activity against one threshold.',
 desc:'A trunk fragment with a toy β-catenin level at each wound drawn as a bar against a threshold, and the fragment regrown with a head or a tail at each end.',
 research:['Petersen & Reddien (2008). Smed-βcatenin-1 is required for anteroposterior blastema polarity in planarian regeneration. Science 319, 327–330.','Gurley, Rink & Sánchez Alvarado (2008). β-Catenin defines head versus tail identity during planarian regeneration and homeostasis. Science 319, 323–327.'],
 dur:10,hint:'Slide β-catenin activity down (as with RNA interference) or up (as with APC silenced) and watch which end regrows what.',
 init:()=>({k:1}),
 watch(p){const seq=[1,1,.25,.25,3.5,3.5,1];return {k:seq[Math.min(seq.length-1,Math.floor(p*seq.length))]}},
 ui:[{range:'k',label:'β-catenin activity',min:0,max:4,step:.25,get:s=>s.k,act:'k',show:v=>fmt(v)+' × normal'},{choose:[['0.25','β-catenin RNAi'],['1','Normal'],['3.5','APC RNAi']],label:'Preset',get:s=>String(s.k),act:'k'}],
 on:{k(s,v){s.k=clamp(Math.round(+v*4)/4,0,4)}},
 draw(s){
  const la=L3_bcEnd(s.k,'ant'),lp=L3_bcEnd(s.k,'post'),hA=la<L3_BC.th,hP=lp<L3_BC.th;
  const res=hA&&!hP?'normal: head in front, tail behind':hA&&hP?'two heads':!hA&&!hP?'two tails':'reversed';
  let out=heading(`Regrows ${res}`);
  out+=L3_badge(590,40,'rep','end');
  // the worm and the fragment cut from it
  const sh=t=>`rgba(196,82,56,${fmt(clamp(.08+.5*t,0,.6))})`;
  out+=L3_worm(60,540,84,17,'head','tail',{shade:sh,pharynx:true})+L(220,58,220,110,C.coral,2,'stroke-dasharray="4 3"')+L(380,58,380,110,C.coral,2,'stroke-dasharray="4 3"');
  out+=TF(300,126,'toy β-catenin activity: higher towards the tail (darker)',13,C.muted);
  // regrown fragment
  const g=14;out+=L3_worm(190,410,196,22,hA?'head':'tail',hP?'head':'tail',{newL:g+4,newR:g+4,E:24});
  out+=TF(300,238,'the fragment, regrown',13,C.muted);
  // bars
  const bx=[110,490],yb=336,top=1.2,Hb=78,hv=v=>Math.min(v,top)/top*Hb;
  [[la,0],[lp,1]].forEach(([v,i])=>{const h=Math.max(2,hv(v)),c=v<L3_BC.th;out+=R(bx[i]-18,yb-h,36,h,c?C.purplep:C.coralp,c?C.purple:C.coral,4)+TBF(bx[i]+26,yb-h+12,(v>top?'↑ ':'')+fmt(Math.round(v*100)/100),13,c?C.purple:C.coral,'start')+TF(bx[i],yb+16,i?'back wound':'front wound',13,C.muted)});
  const yth=yb-hv(L3_BC.th);out+=L(70,yth,530,yth,C.ink,1.4,'stroke-dasharray="6 4"')+TF(300,yth-8,`threshold ${L3_BC.th}: below → head, above → tail`,13,C.ink);
  out+=L3_badge(300,yb+8,'model','middle');
  return {svg:out,phase:hA&&!hP?`At normal activity the front wound reads ${fmt(la)} (head) and the back wound ${fmt(lp)} (tail). The fragment keeps its polarity.`:
   hA&&hP?`With β-catenin activity at ${fmt(s.k)} × normal, even the back wound reads only ${fmt(lp)}, below the threshold, so it makes a head too. Petersen and Reddien, and Gurley and colleagues, saw two-headed regenerates after silencing β-catenin.`:
   !hA&&!hP?`With activity at ${fmt(s.k)} × normal, even the front wound reads ${fmt(la)}, above the threshold, so it makes a tail. Gurley and colleagues saw tails at front wounds after silencing APC.`:'The levels are reversed.'};
 }});

/* ===================== Lesson: two-headed-worms ===================== */
// Toy: a trunk fragment as a row of 10 coupled cells. A long-range cue enters at the front end (cell 0, held at 1)
// and spreads by gap-junction coupling with slow decay. The back wound "decides" during a 12-hour window: it makes a
// tail if the cue it received (A, the time integral at the last cell) passes that fragment's own threshold, which
// varies between fragments (seeded, log-normal). Octanol cuts the coupling by 70% while it is applied.
const L3_GJ={n:10,g0:4,lam:.15,blk:.7,win:12,dt:.01,th:.18,sd:.6,N:100};
const L3_gjMemo={};
function L3_gjRun(start,dur){const key=start+'|'+dur;if(L3_gjMemo[key])return L3_gjMemo[key];
 const o=L3_GJ;let c=new Array(o.n).fill(0);c[0]=1;let A=0;const snaps=[c.slice()],As=[0];
 const steps=Math.round(o.win/o.dt),per=Math.round(1/o.dt);
 for(let k=0;k<steps;k++){const t=k*o.dt,g=(t>=start&&t<start+dur)?o.g0*(1-o.blk):o.g0,d=c.slice();
  for(let i=1;i<o.n;i++){const r=i<o.n-1?c[i+1]:c[i];d[i]=c[i]+o.dt*(g*(c[i-1]-2*c[i]+r)-o.lam*c[i])}
  c=d;c[0]=1;A+=c[o.n-1]*o.dt;if((k+1)%per===0){snaps.push(c.slice());As.push(A)}}
 const r=L3_rng(2010),th=range(o.N).map(()=>o.th*Math.exp(o.sd*L3_gauss(r))),two=th.map(t=>A<t);
 return (L3_gjMemo[key]={snaps,As,A,two,n2:two.filter(Boolean).length})}
SCENE({id:'two-headed-worms',name:'A brief block of gap junctions',tag:'Single-lab finding · Octanol after cutting gives two heads',
 definition:'Gap junctions join neighbouring cells (era 1). Nogi and Levin (2005) found the planarian’s gap-junction genes, the innexins, and reported that blocking gap-junctional communication made some back wounds regrow heads. Nestor Oviedo, Junji Morokuma and colleagues (2010) soaked freshly cut trunk fragments in octanol, a gap-junction blocker, and some regrew a head at both ends. This was reported by one lab and its collaborators.',
 example:'Timing mattered: Oviedo and colleagues reported that starting octanol a few hours after cutting sharply reduced the two-headed outcome, as if a decision were taken early. They also implicated signals carried by the nervous system and three innexins. The toy keeps only the timing logic: a cue must cross the fragment in time.',
 desc:'A trunk fragment drawn as a row of ten coupled cells, a cue spreading from the front, coupling thinned while octanol is on, a time bar with the block and the decision window, and the computed outcomes of 100 seeded fragments.',
 research:['Nogi & Levin (2005). Characterization of innexin gene expression and functional roles of gap-junctional communication in planarian regeneration. Developmental Biology 287, 314–335.','Oviedo, Morokuma, Walentek, Kema, Gu, Ahn, Hwang, Gojobori & Levin (2010). Long-range neural and gap junction protein-mediated cues control polarity during planarian regeneration. Developmental Biology 339, 188–199.'],
 dur:14,hint:'Set when the octanol starts and how long it lasts, then run the twelve hours. Compare starting at once with starting a few hours late.',
 init:()=>({start:0,dur:12}),
 trace:s=>range(L3_GJ.win+1).map(h=>({h,say:''})).concat([{h:L3_GJ.win,end:1,say:''}]),
 ui:[{range:'start',label:'Octanol starts at (h)',min:0,max:8,get:s=>s.start,act:'start'},{range:'dur',label:'Octanol lasts (h)',min:0,max:24,step:2,get:s=>s.dur,act:'dur'},{b:'No octanol',act:'none'}],
 on:{start(s,v){s.start=clamp(Math.round(+v),0,8)},dur(s,v){s.dur=clamp(Math.round(+v/2)*2,0,24)},none(s){s.dur=0}},
 draw(s,f,X){
  const o=L3_GJ,run=L3_gjRun(s.start,s.dur),h=f?f.h:o.win,end=f?!!f.end:true,c=run.snaps[h],on=s.dur>0&&h>=s.start&&h<s.start+s.dur;
  let out=heading(end?`${run.n2} of ${o.N} toy fragments regrew two heads`:`Hour ${h}${on?': octanol on, coupling thinned':': coupling normal'}`);
  out+=L3_badge(10,40,'single')+L3_badge(590,40,'model','end');
  // the fragment
  const x0=96,x1=504,yc=100,xs=i=>x0+20+i*(x1-x0-40)/(o.n-1);
  out+=L3_worm(x0-30,x1+30,yc,30,{mix:end?1:0},'cut',{fill:'#efe3d6',E:22,eyes:false});
  for(let i=0;i<o.n-1;i++)out+=L(xs(i)+12,yc,xs(i+1)-12,yc,on?C.line:C.purple,on?1.4:5);
  for(let i=0;i<o.n;i++){const v=clamp(c[i],0,1);out+=Ci(xs(i),yc,12,`rgba(113,86,166,${fmt(.08+.8*v)})`,C.purple)}
  out+=TF(xs(0),yc+48,'front: cue 1',13,C.purple)+TF(xs(o.n-1),yc+48,`back wound: cue ${fmt(Math.round(c[o.n-1]*100)/100)}`,13,C.purple);
  // time bar
  const tx0=96,tw=408,Tx=t=>tx0+t/24*tw,ty=186;
  out+=R(Tx(0),ty,Tx(o.win)-Tx(0),16,C.pale,'none',3)+TF(Tx(o.win/2),ty+30,'decision window (toy)',13,C.blue);
  if(s.dur>0)out+=R(Tx(s.start),ty+3,Tx(Math.min(24,s.start+s.dur))-Tx(s.start),10,C.coral,'none',3)+TF(Tx(Math.min(24,s.start+s.dur))+4,ty+12,'octanol',13,C.coral,'start');
  out+=L(Tx(h),ty-6,Tx(h),ty+22,C.ink,2);
  for(const t of [0,6,12,18,24])out+=TF(Tx(t),ty-9,t+' h',13,C.muted);
  // outcomes grid
  const gx=330,gy=226,cs=12.5;
  if(end){run.two.forEach((t,i)=>{const x=gx+(i%20)*cs,y=gy+Math.floor(i/20)*cs;out+=R(x,y,cs-2,cs-2,t?C.coral:L3_SKIN,'none',2)});
   out+=R(gx,gy+70,10,10,C.coral,'none',2)+TF(gx+14,gy+79,'two heads',13,C.ink,'start')+R(gx+110,gy+70,10,10,L3_SKIN,'none',2)+TF(gx+124,gy+79,'head and tail',13,C.ink,'start')}
  else out+=TF(gx+124,gy+36,'outcomes appear after hour 12',13,C.muted);
  out+=L3_tile(40,224,130,'Cue received',fmt(Math.round(run.As[h]*100)/100))+L3_tile(180,224,130,'Two-headed',end?L3_pct(run.n2,o.N)+'%':'…',C.coral);
  out+=R(40,284,270,62,C.pale,'none',8)+L3_badge(48,290,'single')+TF(50,326,'Oviedo et al. 2010: a later start',13,C.ink,'start')+TF(50,341,'sharply reduced two-headed worms.',13,C.ink,'start');
  out+=L3_note('A cartoon of timing only. The toy’s percentages are not the paper’s.',368);
  const ph=!end?(on?`Octanol is on: the toy cuts coupling by ${Math.round(o.blk*100)}%, so the cue creeps along the fragment. The back wound has received ${fmt(Math.round(run.As[h]*100)/100)} units so far.`:h===0?'The fragment has just been cut. A cue enters at the front end and spreads from cell to cell through gap junctions.':`Coupling is normal. The back wound has received ${fmt(Math.round(run.As[h]*100)/100)} units of cue.`):
   s.dur===0?`Without octanol the back wound receives ${fmt(Math.round(run.A*100)/100)} units, above nearly every fragment’s threshold, so ${o.N-run.n2} of ${o.N} make a tail.`:
   `With octanol from hour ${s.start} for ${s.dur} h the back wound received ${fmt(Math.round(run.A*100)/100)} units. ${run.n2} of ${o.N} toy fragments fell short of their own threshold and made a head instead of a tail.${s.start>=3?' Starting later let the cue through first, as in the reported timing effect.':''}`;
  return {svg:out,phase:ph};
 }});

// Scene 2: voltage at the wound. Toy chord-conductance voltage with illustrative reversal potentials (not planarian measurements).
const L3_WV={EK:-80,EL:0,ECl:-20,gK:1,gL:.25,gCl:.05,gClIvm:1.5,Ip:30,Vth:-45};
function L3_wound(end,sch,ivm){const o=L3_WV,gCl=ivm?o.gClIvm:o.gCl,ip=end==='front'&&!sch?o.Ip:0;
 return (o.gK*o.EK+o.gL*o.EL+gCl*o.ECl+ip)/(o.gK+o.gL+gCl)}
SCENE({id:'two-headed-worms-voltage',name:'Voltage at the wound',tag:'Single-lab finding · Depolarised wounds make heads',
 definition:'Wendy Beane, Junji Morokuma, Dany Spencer Adams and Michael Levin (2011) reported that front wounds need a proton–potassium pump (H,K-ATPase) to depolarise. Blocking it with the drug SCH-28080 left the wound tissue more negative inside, and fragments regrew without heads. Depolarising tissue another way, with ivermectin, which opens chloride channels, gave heads even at back wounds. One lab’s result.',
 example:`The toy computes a wound’s voltage from three channels and a pump term with illustrative values: a front wound with the pump on sits at ${L3_mv(L3_wound('front',0,0))}, above its head threshold of ${L3_mv(L3_WV.Vth)}; a back wound sits at ${L3_mv(L3_wound('back',0,0))}. Ivermectin moves the back wound to ${L3_mv(L3_wound('back',0,1))}.`,
 desc:'A trunk fragment with both wounds, a voltage scale for each with the toy threshold, the computed voltages, and the head or tail each wound regrows.',
 research:['Beane, Morokuma, Adams & Levin (2011). A chemical genetics approach reveals H,K-ATPase-mediated membrane voltage is required for planarian head regeneration. Chemistry & Biology 18, 77–89.'],
 dur:12,hint:'Switch the pump blocker and the chloride-channel opener on and off, and read each wound’s computed voltage against the threshold.',
 init:()=>({sch:0,ivm:1}),
 watch(p){const seq=[[0,0],[1,0],[0,1]];const k=seq[Math.min(2,Math.floor(p*3))];return {sch:k[0],ivm:k[1]}},
 ui:[{choose:[['0','Pump working'],['1','SCH-28080 (pump blocked)']],label:'H,K-ATPase',get:s=>String(s.sch),act:'sch'},{choose:[['0','No ivermectin'],['1','Ivermectin']],label:'Chloride channels',get:s=>String(s.ivm),act:'ivm'}],
 on:{sch(s,v){s.sch=+v?1:0},ivm(s,v){s.ivm=+v?1:0}},
 draw(s){
  const o=L3_WV,vf=L3_wound('front',s.sch,s.ivm),vb=L3_wound('back',s.sch,s.ivm),hf=vf>o.Vth,hb=vb>o.Vth;
  const toyOnly=s.sch&&s.ivm;
  let out=heading(`Front: ${hf?'head':'no head'} · Back: ${hb?'head':'tail'}`);
  out+=L3_badge(10,40,'single')+L3_badge(590,40,'model','end');
  out+=L3_worm(170,430,112,24,hf?'head':'cut',hb?'head':'tail',{newL:20,newR:20,E:24,fill:L3_SKIN});
  if(!hf)out+=TF(170,154,'blastema, no head',13,C.coral);
  // scales
  const sc=(x,v,lab)=>{const y0=200,y1=330,Yv=q=>y1-(q+90)/90*(y1-y0);let g=L(x,y0,x,y1,C.line,3);
   for(const q of [-90,-60,-30,0])g+=L(x-5,Yv(q),x,Yv(q),C.muted,1.2)+TF(x-9,Yv(q)+4,q?'−'+Math.abs(q):'0',13,C.muted,'end');
   g+=L(x-14,Yv(o.Vth),x+70,Yv(o.Vth),C.ink,1.4,'stroke-dasharray="5 4"')+TF(x+74,Yv(o.Vth)+(Math.abs(v-o.Vth)<12&&v>o.Vth?16:-6),'head threshold',13,C.ink,'start');
   g+=`<polygon points="${x+4},${fmt(Yv(v))} ${x+18},${fmt(Yv(v)-7)} ${x+18},${fmt(Yv(v)+7)}" fill="${v>o.Vth?C.coral:C.blue}"/>`+TBF(x+22,Yv(v)+5,L3_mv(v),14,v>o.Vth?C.coral:C.blue,'start');
   return g+TBF(x,y0-12,lab,13,C.ink)+TF(x,y1+18,'mV',13,C.muted)};
  out+=sc(110,vf,'front wound')+sc(390,vb,'back wound');
  out+=L3_note(toyOnly?'Both drugs at once is a toy prediction, not a reported experiment.':'Illustrative reversal voltages; not measured planarian values.',368);
  return {svg:out,phase:toyOnly?`In the toy, ivermectin depolarises both wounds (${L3_mv(vf)} and ${L3_mv(vb)}) even with the pump blocked. This combination is the toy’s prediction only; this scene does not report it as an experiment.`:
   s.sch?`With the pump blocked the front wound stays at ${L3_mv(vf)}, below the toy threshold, and makes no head. Beane and colleagues saw fragments regrow without heads and reported that the treated wound tissue was hyperpolarised.`:
   s.ivm?`Ivermectin opens chloride channels and depolarises the back wound to ${L3_mv(vb)}. It makes a head, so the fragment has two. The paper reported heads even at back wounds after ivermectin.`:
   `Normally the pump depolarises the front wound to ${L3_mv(vf)}, above the toy threshold, while the back wound stays at ${L3_mv(vb)}. Head in front, tail behind.`};
 }});

// Scene 3: two routes to two heads. The learner reveals the label on each claim.
const L3_ROUTES=[
 ['rep','Silencing β-catenin makes back','wounds regrow heads.','Petersen & Reddien 2008; Gurley et al. 2008'],
 ['rep','Neoblasts make the new head;','pieces without them do not regrow.','Wagner et al. 2011; many labs'],
 ['single','A brief octanol soak after cutting','gives some two-headed worms.','Nogi & Levin 2005; Oviedo et al. 2010'],
 ['single','Depolarising back wounds with','ivermectin gives heads there.','Beane et al. 2011'],
 ['single','Octanol two-headed worms stay','two-headed when cut again.','Oviedo et al. 2010 (next lesson)'],
 ['frame','How the voltage route and the','β-catenin route connect.','an open question; reviewed by Durant et al. 2016']];
SCENE({id:'two-headed-worms-routes',name:'Two routes to two heads',tag:'Replicated finding and single-lab finding · Which claim is which',
 definition:'Two-headed planarians can be made in two ways. Silencing β-catenin, a gene result reported by two independent labs in 2008 and widely used since, is a replicated finding. Brief gap-junction blockade or wound depolarisation are results reported by the Levin lab and its collaborators, peer-reviewed but not, as far as this course could find, repeated by an independent group.',
 example:'How the bioelectric route and the β-catenin route are connected is being studied and is not settled. A review by Fallon Durant, Daniel Lobo, Jennifer Hammelman and Michael Levin (2016) sets out the evidence and models from the bioelectric side.',
 desc:'Six cards, each a claim about how planarians decide head or tail. Pressing a card reveals its evidence label and its source.',
 research:['Petersen & Reddien (2008); Gurley, Rink & Sánchez Alvarado (2008). Science 319.','Oviedo et al. (2010), Developmental Biology 339; Beane et al. (2011), Chemistry & Biology 18.','Durant, Lobo, Hammelman & Levin (2016). Physiological controls of large-scale patterning in planarian regeneration. Regeneration 3, 78–102.'],
 dur:12,hint:'Guess which label each claim deserves, then press the card to reveal the course’s label and the source.',
 init:()=>({shown:[]}),
 watch(p){return {shown:range(Math.min(6,Math.floor(p*7)))}},
 ui:[{b:'Reveal all',act:'all'},{b:'Hide all',act:'none'}],
 on:{card(s,i){i=clamp(Math.round(+i),0,5);s.shown=s.shown.includes(i)?s.shown.filter(k=>k!==i):s.shown.concat([i])},all(s){s.shown=range(6)},none(s){s.shown=[]}},
 draw(s,f,X){
  let out=heading(`Which kind of claim is each? (${s.shown.length} of 6 shown)`);
  L3_ROUTES.forEach(([k,a,b,src],i)=>{const x=i%2?306:14,y=48+Math.floor(i/2)*100,sh=s.shown.includes(i),w=280;
   const inner=R(x,y,w,90,sh?L3_LABELS[k][2]:'#fff',sh?L3_LABELS[k][1]:C.grid,10)+TF(x+12,y+22,a,13,C.ink,'start')+TF(x+12,y+40,b,13,C.ink,'start')+
    (sh?L3_badge(x+12,y+50,k)+TF(x+12,y+84,src,12.5,C.muted,'start'):TF(x+12,y+70,X&&X.try?'press to reveal':'…',13,C.muted,'start'));
   out+=hit(X,'card',i,`${a} ${b} ${sh?'Label: '+L3_LABELS[k][0]:'Press to reveal the label'}`,inner)});
  const n=s.shown.length,rep=s.shown.filter(i=>L3_ROUTES[i][0]==='rep').length;
  out+=L3_badges(14,346,['rep','single','frame']);
  return {svg:out,phase:n===6?'The β-catenin and neoblast results have been repeated by several labs. The bioelectric results come from one lab and its collaborators, and how the two routes connect is still open. Both kinds of result can be true at once: voltage may act upstream of genes such as β-catenin, but that link needs direct tests.':
   n?`Revealed: ${s.shown.map(i=>L3_LABELS[L3_ROUTES[i][0]][0].toLowerCase()).join(', ')}.`:'Six claims about what decides head or tail. Before revealing, decide which have been repeated by independent labs.'};
 }});

/* ===================== Lesson: rewritten-pattern ===================== */
// Toy: a hidden state v in a double well, U(v) = v⁴/4 − v²/2. v near −1 means "one head", near +1 "two heads".
// Each cut is a regeneration episode: v follows dv/dt = v − v³ + u for 12 time units, with a push u = ±kick for the
// first 2 units when a treatment is applied. Plain water has no push, so whatever well v is in, it stays there.
const L3_DW={T:12,kickT:2,dt:.01};
function L3_episode(v,u){const o=L3_DW,path=[v];for(let k=0;k<o.T/o.dt;k++){const t=k*o.dt,uu=t<o.kickT?u:0;v+=o.dt*(v-v*v*v+uu);if(k%50===49)path.push(v)}return {v,path}}
const L3_heads=v=>v>0?2:1;
const L3_TREAT={oct:['octanol',1],water:['plain water',0],inv:['inverting treatment',-1]};
function L3_lineage(seq,kick){let v=-1;const out=[];for(const t of seq){const e=L3_episode(v,L3_TREAT[t][1]*kick);out.push({t,from:v,v:e.v,path:e.path,heads:L3_heads(e.v)});v=e.v}return out}
const L3_WSEQ=['water','oct','water','water','inv','water'];
SCENE({id:'rewritten-pattern',name:'Cut again, in plain water',tag:'Single-lab finding · Two heads persist after the drug is gone',
 definition:'Oviedo and colleagues (2010) took two-headed worms made by a brief octanol soak and cut them again, in plain water with no drug. The pieces regrew two heads again, and kept doing so through later rounds of cutting, long after the octanol had washed out. Their genomes had not been edited. This is a single-lab finding: reported by the Levin lab and collaborators, not yet repeated by an independent group as far as this course could find.',
 example:'The toy stores the outcome in one hidden number sitting in one of two valleys. A strong enough push during one regeneration moves it over the ridge; later cuts in plain water leave it where it is. Durant and colleagues (2017) later reported that inverting the bioelectric signal brought treated worms back to one head; the toy’s inverting push does the same.',
 desc:'A double valley with a ball for the hidden state, its path during the latest regeneration, and a lineage of cuts showing the treatment and the worm that regrew each time.',
 research:['Oviedo et al. (2010). Long-range neural and gap junction protein-mediated cues control polarity during planarian regeneration. Developmental Biology 339, 188–199.','Durant, Morokuma, Fields, Williams, Adams & Levin (2017). Long-term, stochastic editing of regenerative anatomy via targeting endogenous bioelectric gradients. Biophysical Journal 112, 2231–2243.'],
 dur:14,hint:'Cut the worm with octanol, then cut it again and again in plain water. Lower the push strength to see when one octanol episode is not enough, and try the inverting treatment.',
 init:()=>({seq:['water','oct','water'],kick:1}),
 watch(p){return {seq:L3_WSEQ.slice(0,1+Math.min(5,Math.floor(p*6))),kick:1}},
 ui:[{b:'Cut in octanol',act:'oct'},{b:'Cut in plain water',act:'water'},{b:'Cut with inverting treatment',act:'inv'},{range:'kick',label:'Push strength',min:.2,max:1.6,step:.1,get:s=>s.kick,act:'kick'},{b:'Start again',act:'clear'}],
 on:{oct(s){s.seq=s.seq.concat(['oct']).slice(-6)},water(s){s.seq=s.seq.concat(['water']).slice(-6)},inv(s){s.seq=s.seq.concat(['inv']).slice(-6)},kick(s,v){s.kick=clamp(Math.round(+v*10)/10,.2,1.6)},clear(s){s.seq=['water']}},
 draw(s,f,X){
  const lin=L3_lineage(s.seq,s.kick),last=lin[lin.length-1];
  let out=heading(`Latest cut (${L3_TREAT[last.t][0]}): ${last.heads===2?'two heads':'one head'}`);
  out+=L3_badge(10,40,'single')+L3_badge(590,40,'model','end');
  // double well
  const px0=40,pw=230,py0=100,ph=120,Xv=v=>px0+(v+1.7)/3.4*pw,U=v=>v*v*v*v/4-v*v/2,Yu=u=>py0+ph-(u+.3)/1.2*ph;
  const pts=range(69).map(i=>{const v=-1.7+i*.05;return [Xv(v),Yu(U(v))]});
  out+=L3_poly(pts,C.ink,2.4)+TF(Xv(-1),Yu(U(-1))+24,'one head',13,C.blue)+TF(Xv(1),Yu(U(1))+24,'two heads',13,C.coral)+TF(px0+pw/2,py0-6,'hidden state (toy)',13,C.muted);
  out+=L3_poly(last.path.map(v=>[Xv(clamp(v,-1.7,1.7)),Yu(U(clamp(v,-1.7,1.7)))-10]),C.purple,1.6,'stroke-dasharray="3 3"');
  out+=Ci(Xv(last.v),Yu(U(last.v))-9,9,last.heads===2?C.coral:C.blue,'#fff');
  out+=TF(px0+pw/2,py0+ph+44,`ridge at 0 · push ${fmt(s.kick)} for ${L3_DW.kickT} time units`,13,C.muted);
  // lineage
  const lx=300;out+=TBF(lx,84,'cut',13,C.muted,'start')+TBF(lx+44,84,'treatment',13,C.muted,'start')+TBF(lx+180,84,'regrew',13,C.muted,'start');
  lin.forEach((e,i)=>{const y=106+i*35;out+=TF(lx+8,y+5,String(i+1),13,C.ink,'start')+TF(lx+44,y+5,L3_TREAT[e.t][0],13,e.t==='oct'?C.coral:e.t==='inv'?C.purple:C.blue,'start')+L3_icon(lx+222,y,e.heads,52)});
  out+=R(300,322,280,26,C.greenp,'none',6)+TF(440,340,'genome: the same in every round',13,C.green);
  out+=L3_note('The toy is a cartoon of the lab’s interpretation, not a known molecular mechanism.',368);
  const ph2=last.t==='oct'?(last.heads===2?`The octanol push (${fmt(s.kick)}) carried the hidden state over the ridge into the two-head valley.`:`A push of ${fmt(s.kick)} for ${L3_DW.kickT} time units was too weak to cross the ridge, so the state fell back and the worm regrew one head. Try a stronger push.`):
   last.t==='inv'?(last.heads===1?'The inverting push carried the state back into the one-head valley. Durant and colleagues (2017) reported that inverting the bioelectric signal rescued normal anatomy.':'The inverting push was too weak to cross back.'):
   `Plain water gives no push, so the state stays in its valley and the worm regrows ${last.heads===2?'two heads again. This is the persistence Oviedo and colleagues reported.':'one head, as before.'}`;
  return {svg:out,phase:ph2};
 }});

// Scene 2: cryptic worms. Population toy: 100 fragments, hidden state W (never treated), C (cryptic), D (two-headed).
// A fragment in state C regrows two heads when a seeded normal draw exceeds L3_ZC; the toy's L3_ZC was chosen so that
// its fraction lands near the reported one. It reproduces the bookkeeping, not the cause of the fraction.
const L3_ZC=.67,L3_POP=100;
const L3_DUR={two:25,one:72,fail:3};   // Durant et al. 2017, as reported by Tufts University’s release of the paper
function L3_popRun(rounds,seed=17){const r=L3_rng(seed);let st=new Array(L3_POP).fill('W');const out=[];
 for(const t of rounds){const prev=st,pool=t==='inv'?0:prev.filter(q=>q==='C'||(t==='oct'&&q==='W')).length;st=st.map(q=>{if(t==='inv')return 'W';if(q==='D')return 'D';if(t==='oct'||q==='C')return L3_gauss(r)>L3_ZC?'D':'C';return 'W'});
  const nD=st.filter((q,i)=>q==='D'&&prev[i]!=='D').length;
  out.push({t,pool,nD,D:st.filter(q=>q==='D').length,C:st.filter(q=>q==='C').length,W:st.filter(q=>q==='W').length,st:st.slice()})}
 return out}
SCENE({id:'rewritten-pattern-cryptic',name:'Normal-looking, but not normal',tag:'Single-lab finding · Cryptic worms',
 definition:'Fallon Durant and colleagues (2017) soaked cut trunk fragments in octanol. As reported in the university’s release of the paper, about 25% regrew two heads, 72% looked normal and 3% did not develop properly. Cut again in plain water, the normal-looking worms gave two-headed worms in about the same ratio, round after round. The authors called these worms “cryptic”: normal in anatomy and in the molecular and tissue tests they used, but carrying a changed state that showed only when cut. One lab’s finding.',
 example:'The paper also reported that the worms’ bioelectric pattern was altered, and that inverting it restored normal anatomy. In the toy, each fragment in the cryptic state regrows two heads when a seeded random draw passes a fixed threshold; that threshold was chosen to land near the reported fraction, so the toy shows the bookkeeping across rounds, not why the fraction is what it is.',
 desc:'A grid of 100 toy worms, coloured by how they look and, when chosen, by their hidden state, a table of counts for each round of cutting, and the published percentages drawn separately.',
 research:['Durant, Morokuma, Fields, Williams, Adams & Levin (2017). Long-term, stochastic editing of regenerative anatomy via targeting endogenous bioelectric gradients. Biophysical Journal 112, 2231–2243.','Percentages as given in Tufts University’s news release on the paper (23 May 2017).'],
 dur:14,hint:'Cut the population in octanol once, then in plain water several times. Show the hidden state to see which normal-looking worms are cryptic. Try the inverting treatment.',
 init:()=>({rounds:['oct','water','water'],hidden:1}),
 watch(p){const all=['oct','water','water','water','inv'];return {rounds:all.slice(0,1+Math.min(4,Math.floor(p*5))),hidden:p>.3?1:0}},
 ui:[{b:'Cut all in octanol',act:'oct'},{b:'Cut all in plain water',act:'water'},{b:'Inverting treatment',act:'inv'},{choose:[['0','How they look'],['1','Hidden state']],label:'Show',get:s=>String(s.hidden),act:'hidden'},{b:'Start again',act:'clear'}],
 on:{oct(s){s.rounds=s.rounds.concat(['oct']).slice(-5)},water(s){s.rounds=s.rounds.concat(['water']).slice(-5)},inv(s){s.rounds=s.rounds.concat(['inv']).slice(-5)},hidden(s,v){s.hidden=+v?1:0},clear(s){s.rounds=['water']}},
 draw(s,f,X){
  const run=L3_popRun(s.rounds),last=run[run.length-1];
  let out=heading(`Round ${run.length} (${L3_TREAT[last.t][0]}): ${last.D} two-headed, ${last.C+last.W} one-headed`);
  out+=L3_badge(10,40,'model')+L3_badge(590,40,'single','end');
  // grid
  const gx=24,gy=72,cs=21;
  last.st.forEach((q,i)=>{const x=gx+(i%10)*cs,y=gy+Math.floor(i/10)*cs;
   const fill=q==='D'?C.coral:s.hidden&&q==='C'?C.amberp:L3_SKIN,stroke=s.hidden&&q==='C'?C.amber:'none';
   out+=R(x,y,cs-3,cs-3,fill,stroke,3,stroke!=='none'?'stroke-dasharray="3 2"':'');if(q==='D')out+=TBF(x+(cs-3)/2,y+14,'2',12,'#fff')});
  const ly=gy+10*cs+16;
  out+=R(gx,ly-10,12,12,C.coral,'none',2)+TF(gx+16,ly,'two heads',13,C.ink,'start')+R(gx+100,ly-10,12,12,L3_SKIN,'none',2)+TF(gx+116,ly,s.hidden?'never treated':'one head',13,C.ink,'start');
  if(s.hidden)out+=R(gx,ly+8,12,12,C.amberp,C.amber,2)+TF(gx+16,ly+18,'cryptic: one head, changed state',13,C.ink,'start');
  // table
  const tx=262;out+=TBF(tx,84,'cut in',13,C.muted,'start')+TBF(tx+118,84,'2 heads',13,C.coral,'start')+TBF(tx+178,84,'1 head',13,C.muted,'start')+TBF(tx+234,84,'new 2-head',13,C.amber,'start');
  run.forEach((e,i)=>{const y=106+i*22;out+=TF(tx,y,(i+1)+'. '+L3_TREAT[e.t][0].replace('plain ',''),13,C.ink,'start')+TBF(tx+140,y,String(e.D),13,C.coral)+TBF(tx+198,y,String(e.C+e.W),13,C.ink)+TBF(tx+270,y,e.pool?L3_pct(e.nD,e.pool)+'%':'–',13,C.amber)});
  if(run.length<5)out+=TF(tx,run.length*22+112,'new 2-head: share of worms that could still',12.5,C.muted,'start')+TF(tx,run.length*22+127,'change (cut in octanol, or cryptic)',12.5,C.muted,'start');
  // published
  out+=R(262,226,322,96,C.pale,'none',8)+L3_badge(272,234,'single')+TF(272,272,'Durant et al. 2017, after octanol:',13,C.ink,'start');
  out+=TBF(272,292,`${L3_DUR.two}% two heads · ${L3_DUR.one}% one head · ${L3_DUR.fail}% failed`,13,C.blue,'start')+TF(272,312,'normal-looking ones repeated the ratio',13,C.ink,'start');
  out+=L3_note('Toy counts from 100 seeded fragments; the toy has no failures.',368);
  const ph=last.t==='inv'?'The inverting treatment returns every toy worm, cryptic or two-headed, to the untreated state. The paper reported that inverting the bioelectric signal rescued normal anatomy.':
   last.t==='oct'?`After one octanol episode ${last.D} toy worms regrew two heads and ${last.C} look normal but carry the changed state.`:
   last.C+last.D===0?'Untreated worms cut in plain water stay normal.':`Cut again in plain water: two-headed worms stay two-headed, and the cryptic ones split again, adding ${last.D-(run.length>1?run[run.length-2].D:0)} new two-headed worms. ${s.hidden?'The amber outlines show which one-headed worms are cryptic.':'Show the hidden state to see which one-headed worms are cryptic.'}`;
  return {svg:out,phase:ph};
 }});

// Scene 3: target morphology, a framework. Toy: the back end's "head-ness" m (0 tail, 1 head) is regrown step by step
// towards a stored target (target model) or set by a fixed recipe that ignores any stored state (recipe model).
const L3_TGT={rate:.38,steps:8};
const L3_tgtPath=(model,target)=>{let m=0;const a=[m];const goal=model==='recipe'?0:(target===2?1:0);for(let k=0;k<L3_TGT.steps;k++){m+=L3_TGT.rate*(goal-m);a.push(m)}return a};
SCENE({id:'rewritten-pattern-target',name:'A target to rebuild towards',tag:'Framework or hypothesis · Target morphology',
 definition:'The Levin lab interprets these results with the idea of a “target morphology”: tissues work towards a stored pattern of the whole body, keep repairing until they match it, and that stored pattern can be rewritten, for example by a brief change to bioelectric signalling, without editing the genome. This is a framework or hypothesis: a way of reading the experiments, not itself an observation.',
 example:'Persistence fits the idea, but it does not prove it. Any self-sustaining state, such as a gene-expression loop that holds itself on, or a lasting change in the nerve cords, would also persist through cuts. A test needs to find where the pattern is stored, read it, and rewrite it predictably. The lab proposes the bioelectric state of the tissue as that store.',
 desc:'A treated worm cut in plain water regrows its back end step by step under two toy models, one that rebuilds towards a stored target and one that follows a fixed recipe, beside three statements labelled observation, interpretation and alternative.',
 research:['Durant, Lobo, Hammelman & Levin (2016). Physiological controls of large-scale patterning in planarian regeneration. Regeneration 3, 78–102.','Oviedo et al. (2010), Developmental Biology 339; Durant et al. (2017), Biophysical Journal 112 (the observations).'],
 dur:12,hint:'Choose a model and a stored target, then step through the regrowth. Only one of the models can keep two heads after the drug has gone.',
 init:()=>({model:'target',target:2}),
 trace:s=>range(L3_TGT.steps+1).map(k=>({k,say:''})),
 ui:[{choose:[['target','Rebuild to a stored target'],['recipe','Fixed recipe']],label:'Model',get:s=>s.model,act:'model'},{choose:[['1','Stored: one head'],['2','Stored: two heads']],label:'Stored pattern',get:s=>String(s.target),act:'target'}],
 on:{model(s,v){s.model=v==='recipe'?'recipe':'target'},target(s,v){s.target=+v===1?1:2}},
 draw(s,f,X){
  const path=L3_tgtPath(s.model,s.target),k=f?f.k:L3_TGT.steps,m=path[k],done=k===L3_TGT.steps;
  let out=heading(`${s.model==='target'?'Target model':'Recipe model'}: step ${k} of ${L3_TGT.steps}`);
  out+=L3_badge(10,40,'frame')+L3_badge(590,40,'model','end');
  out+=L3_worm(150,450,104,26,'head',{mix:m},{newR:46,E:28});
  out+=TF(450,148,`back end: ${Math.round(m*100)}% head-like (toy)`,13,m>.5?C.coral:C.blue,'end')+TF(150,148,'old head',13,C.muted,'start');
  out+=TF(300,172,s.model==='target'?`stored target: ${s.target===2?'two heads':'one head'} · each step closes ${Math.round(L3_TGT.rate*100)}% of the gap`:'recipe: back wounds always make tails; any stored state is ignored',13,C.muted);
  const rows=[['single','Observed: two-headed worms stay','two-headed when cut in plain water.'],['frame','Interpretation: a stored target','pattern was rewritten (target morphology).'],['frame','Alternative: any self-sustaining state,','genetic or neural, would also persist.']];
  rows.forEach(([kk,a,b],i)=>{const y=192+i*58;out+=R(40,y,520,50,L3_LABELS[kk][2],'none',8)+L3_badge(48,y+15,kk)+TF(48+L3_badgeW(kk)+10,y+21,a,13,C.ink,'start')+TF(48+L3_badgeW(kk)+10,y+39,b,13,C.ink,'start')});
  out+=L3_note('The toy compares two ideas; it is not a model of real planarian tissue.',372);
  return {svg:out,phase:!done?`Step ${k}: the back end is ${Math.round(m*100)}% of the way from tail to head.`:
   s.model==='recipe'?'The recipe model always regrows a tail at the back. It cannot explain two-headed worms that stay two-headed in plain water, which is why the lab argues that something besides a fixed recipe is stored.':
   s.target===2?'Rebuilding towards a stored two-headed target gives a second head, cut after cut, with the same genome. That is what the target-morphology framework proposes; it remains an interpretation.':'With a one-headed target the back end returns to a tail, as in an untreated worm.'};
 }});

/* ===================== Lesson: species-heads ===================== */
// Schematic head outlines drawn for this course from three numbers (auricle size, blunt tip, head length). They show
// the kinds of difference the paper measured; they are not traced from its images.
const L3_SHAPES=[
 {id:'own',name:'G. dorotocephala',sub:'own: pointed auricles',aur:.6,tip:.18,len:1.25,col:C.green},
 {id:'round',name:'rounded',sub:'no auricles',aur:0,tip:.62,len:.95,col:C.blue},
 {id:'tri',name:'triangular',sub:'long, pointed',aur:.12,tip:.08,len:1.6,col:C.purple},
 {id:'square',name:'square-fronted',sub:'short, blunt',aur:.04,tip:.88,len:.6,col:C.amber}];
const L3_HS=24;   // sample points along the head
function L3_headProf(p){const E=26,hw=1;return range(L3_HS).map(i=>L3_endW('head',i/(L3_HS-1)*E*1.8,hw,E,p))}
function L3_headDist(p,q){const a=L3_headProf(p),b=L3_headProf(q);return Math.sqrt(a.reduce((t,v,i)=>t+(v-b[i])*(v-b[i]),0)/L3_HS)}
SCENE({id:'species-heads',name:'Heads of other species',tag:'Single-lab finding · One genome, several head shapes',
 definition:'Maya Emmons-Bell, Fallon Durant and colleagues (2015) cut the heads off Girardia dorotocephala, a planarian with pointed ear-like auricles, and briefly blocked gap junctions with octanol. Some fragments regrew heads shaped like those of other planarian species, Schmidtea mediterranea, Dugesia japonica and Polycelis felina, which they measured by morphometrics: comparing outlines by numbers. The worms’ genomes were unchanged. One lab’s finding.',
 example:'Planarian head shapes range from rounded to triangular to square-fronted. The toy builds a head from three numbers and computes how far your outline is from each schematic template, using the root-mean-square difference of the head’s width along its length.',
 desc:'A large head outline built from the learner’s three numbers, four schematic templates with computed distances, and the nearest template highlighted.',
 research:['Emmons-Bell, Durant, Hammelman, Bessonov, Volpert, Morokuma, Pinet, Adams, Pietak, Lobo & Levin (2015). Gap junctional blockade stochastically induces different species-specific head anatomies in genetically wild-type Girardia dorotocephala flatworms. International Journal of Molecular Sciences 16, 27865–27896.'],
 dur:12,hint:'Change the auricles, the tip and the head length, and watch which template your outline is nearest to.',
 init:()=>({aur:.6,tip:.18,len:1.25}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),u=smooth(clamp(p*4-k,0,1)*1.6),a=L3_SHAPES[k],b=L3_SHAPES[(k+1)%4];
  return {aur:lerp(a.aur,b.aur,u),tip:lerp(a.tip,b.tip,u),len:lerp(a.len,b.len,u)}},
 ui:[{range:'aur',label:'Auricles',min:0,max:.8,step:.04,get:s=>s.aur,act:'aur'},{range:'tip',label:'Blunt tip',min:0,max:1,step:.04,get:s=>s.tip,act:'tip'},{range:'len',label:'Head length',min:.5,max:1.8,step:.05,get:s=>s.len,act:'len'}],
 on:{aur(s,v){s.aur=clamp(+v,0,.8)},tip(s,v){s.tip=clamp(+v,0,1)},len(s,v){s.len=clamp(+v,.5,1.8)}},
 draw(s){
  const ds=L3_SHAPES.map(t=>L3_headDist(s,t)),best=ds.indexOf(Math.min(...ds)),bt=L3_SHAPES[best];
  let out=heading(`Nearest template: ${bt.name}`);
  out+=L3_badge(10,40,'single')+L3_badge(590,40,'model','end');
  out+=L3_worm(40,330,150,46,'head','cut',{hl:s,E:92,stroke:bt.col,sw:2.4});
  out+=TF(185,226,`auricles ${fmt(L3_r1(s.aur*100)/100)} · tip ${fmt(L3_r1(s.tip*100)/100)} · length ${fmt(L3_r1(s.len*100)/100)}`,13,C.muted);
  L3_SHAPES.forEach((t,i)=>{const y=62+i*68,x=362,sel=i===best;
   out+=R(x,y,226,60,sel?tint(t.col,.85):'#fff',sel?t.col:C.grid,8)+L3_worm(x+8,x+86,y+30,12,'head','cut',{hl:t,E:26,sw:1.2})+TBF(x+94,y+22,t.name,13,t.col,'start')+TF(x+94,y+38,t.sub,12.5,C.muted,'start')+TMF(x+218,y+54,'d = '+fmt(Math.round(ds[i]*1000)/1000),12.5,sel?t.col:C.muted,'end')});
  out+=R(40,250,300,90,C.pale,'none',8)+L3_badge(48,256,'single')+TF(50,296,'Reported: octanol-treated G. dorotocephala',13,C.ink,'start')+TF(50,314,'regrew heads like S. mediterranea,',13,C.ink,'start')+TF(50,332,'D. japonica or P. felina.',13,C.ink,'start');
  out+=L3_note('Templates are schematic outlines drawn for this course, not traced from the paper.',368);
  return {svg:out,phase:`Your outline is ${fmt(Math.round(ds[best]*1000)/1000)} from the ${bt.name} template and ${fmt(Math.round(ds[0]*1000)/1000)} from the worm’s own shape. Morphometrics turns a judgement such as “looks rounder” into a distance that can be compared and tested.`};
 }});

// Scene 2: several stable shapes. Toy landscape over a one-dimensional "shape" coordinate with four valleys
// (own shape at 0.5, three others at 1.5, 2.5, 3.5). Octanol makes the own valley shallower during regeneration;
// afterwards the landscape returns to one deep valley with a gentle slope towards it (the remodelling phase).
const L3_AT={c:[.5,1.5,2.5,3.5],w:.32,dReg:[1,.6,.5,.4],sig:.45,steps:300,week:100,N:200,dt:.01};
function L3_atGrad(x,d,slope){let g=0;for(let j=0;j<4;j++){const e=Math.exp(-((x-L3_AT.c[j])**2)/(2*L3_AT.w**2));g+=d[j]*e*(x-L3_AT.c[j])/(L3_AT.w**2)}
 if(slope&&x>.5)g+=slope;if(x<0)g+=-6*x;if(x>4)g+=6*(x-4);return g}
const L3_well=x=>clamp(Math.round(x-.5),0,3);
const L3_atMemo={};
function L3_atRun(b,weeks){const key=b+'|'+weeks;if(L3_atMemo[key])return L3_atMemo[key];
 const o=L3_AT,r=L3_rng(2015),dReg=o.dReg.map((d,j)=>j?d:d*(1-.85*b)),dRest=[1,0,0,0],sq=Math.sqrt(o.dt),xs=[],ys=[];
 for(let i=0;i<o.N;i++){let x=.5+.25*L3_gauss(r);for(let k=0;k<o.steps;k++)x+=-L3_atGrad(x,dReg,0)*o.dt+o.sig*sq*L3_gauss(r);xs.push(x);
  for(let k=0;k<weeks*o.week;k++)x+=-L3_atGrad(x,dRest,.5)*o.dt+o.sig*sq*L3_gauss(r);ys.push(x)}
 const cnt=a=>[0,1,2,3].map(j=>a.filter(x=>L3_well(x)===j).length);
 return (L3_atMemo[key]={xs,ys,reg:cnt(xs),now:cnt(ys)})}
SCENE({id:'species-heads-attractor',name:'Several stable shapes, one genome',tag:'Framework or hypothesis · Valleys in a shape landscape',
 definition:'The authors read their result with a picture from dynamical systems: the tissue’s bioelectric network has several stable states, or attractors, each matching a head shape, and the worm’s own shape is normally the deepest. Blocking gap junctions changes the landscape so that a fragment can settle into another valley. They reported that the altered heads later remodelled back to the worm’s own head shape within several weeks. The result is a single-lab finding; the landscape reading is a framework.',
 example:'In the toy, each of 200 seeded fragments is a ball jostled by noise while it regenerates. The octanol slider makes the own valley shallower; afterwards the landscape returns to one deep valley and the balls drift home over toy weeks. Which valley a ball ends in is computed, not chosen.',
 desc:'A landscape with four valleys, one per head shape, balls for fragments, a slider for the strength of the gap-junction block, and counts of fragments in each valley during regeneration and after remodelling.',
 research:['Emmons-Bell et al. (2015). International Journal of Molecular Sciences 16, 27865–27896 (shapes of other species, then remodelling back within several weeks).','Durant, Lobo, Hammelman & Levin (2016). Regeneration 3, 78–102 (the attractor reading).'],
 dur:14,hint:'Set the strength of the gap-junction block, regenerate, then let toy weeks pass and watch the balls drift back.',
 init:()=>({b:1,weeks:0}),
 watch(p){return p<.5?{b:Math.round(smooth(p*2)*10)/10,weeks:0}:{b:1,weeks:Math.min(6,Math.floor((p-.5)*14))}},
 ui:[{range:'b',label:'Gap-junction block',min:0,max:1,step:.1,get:s=>s.b,act:'b',show:v=>Math.round(v*100)+'%'},{range:'weeks',label:'Toy weeks after regrowth',min:0,max:6,get:s=>s.weeks,act:'weeks'}],
 on:{b(s,v){s.b=clamp(Math.round(+v*10)/10,0,1)},weeks(s,v){s.weeks=clamp(Math.round(+v),0,6)}},
 draw(s){
  const o=L3_AT,run=L3_atRun(s.b,s.weeks),cur=s.weeks?run.now:run.reg,arr=s.weeks?run.ys:run.xs,other=o.N-cur[0];
  let out=heading(s.weeks?`${s.weeks} toy week${s.weeks>1?'s':''} later: ${cur[0]} of ${o.N} back in the own valley`:`After regrowth: ${other} of ${o.N} in another valley`);
  out+=L3_badge(10,40,'frame')+L3_badge(590,40,'model','end');
  const X0=50,Wd=500,Xs=x=>X0+x/4*Wd,y0=110,Hh=110;
  const d=s.weeks?[1,0,0,0]:o.dReg.map((v,j)=>j?v:v*(1-.85*s.b));
  const U=x=>{let u=0;for(let j=0;j<4;j++)u-=d[j]*Math.exp(-((x-o.c[j])**2)/(2*o.w**2));if(s.weeks&&x>.5)u+=.5*(x-.5)*.3;return u};
  const Yu=u=>y0+Hh*(1+u)*.9;
  out+=L3_poly(range(81).map(i=>{const x=i*.05;return [Xs(x),Yu(U(x))]}),C.ink,2.4);
  const cnt=[0,0,0,0];
  arr.forEach(x=>{const j=L3_well(x),k=cnt[j]++;if(k<40)out+=Ci(Xs(o.c[j])+((k%8)-3.5)*6,Yu(U(o.c[j]))-8-Math.floor(k/8)*6,2.6,j?L3_SHAPES[j].col:C.green)});
  L3_SHAPES.forEach((t,j)=>{out+=L3_worm(Xs(o.c[j])-36,Xs(o.c[j])+28,y0+Hh+40,11,'head','cut',{hl:t,E:22,sw:1})+TBF(Xs(o.c[j]),y0+Hh+70,String(cur[j]),15,t.col)+TF(Xs(o.c[j]),y0+Hh+88,t.name,13,C.muted)});
  out+=R(40,330,520,30,C.pale,'none',8)+L3_badge(48,335,'single')+TF(48+L3_badgeW('single')+8,350,'Reported: other-species heads, then back to own shape',13,C.ink,'start');
  out+=L3_note('Ball counts are computed from 200 seeded toy fragments, not the paper’s.',376);
  return {svg:out,phase:s.weeks?`With the block gone the landscape has one deep valley and a slope towards it. After ${s.weeks} toy week${s.weeks>1?'s':''}, ${cur[0]} of ${o.N} fragments have the worm’s own head shape again, as the paper reported for real worms over several weeks.`:
   s.b===0?`Without octanol the own valley is deepest and ${cur[0]} of ${o.N} fragments stay in it.`:`With a ${Math.round(s.b*100)}% block the own valley is shallower, and noise carried ${other} of ${o.N} fragments into another valley: ${cur.slice(1).map((c,j)=>c+' '+L3_SHAPES[j+1].name).join(', ')}.`};
 }});

// Scene 3: more than the outline. Schematic layers; the left head is the worm's own, the right one an induced rounded head.
const L3_LAYERS={outline:['Head outline','The overall shape of the head differed, as measured by morphometrics.'],brain:['Brain','The shape of the brain differed too.'],neo:['Neoblasts','The distribution of neoblasts in the head differed.'],volt:['Voltage','The pattern of resting voltage in the front tissues differed.']};
SCENE({id:'species-heads-inside',name:'More than the outline',tag:'Single-lab finding · Brain, stem cells and voltage changed too',
 definition:'Emmons-Bell and colleagues reported that the induced heads differed from the worm’s own not only in outline but in the shape of the brain, in the characteristic distribution of neoblasts, and in the gradients of resting voltage in the front tissues. After regeneration was complete, the worms remodelled back to their own head shape within several weeks. One lab’s finding.',
 example:'This makes the result more than a change of outline. Whether the induced heads are true copies of another species’ head, or similar in some measures and not others, can only be judged from the paper’s measurements; the pictures here are schematic and show which features changed, not how.',
 desc:'Two schematic heads side by side, the worm’s own and an induced one, with a chosen layer drawn over each: outline, brain, neoblasts or voltage, and a computed outline difference.',
 research:['Emmons-Bell et al. (2015). Gap junctional blockade stochastically induces different species-specific head anatomies in genetically wild-type Girardia dorotocephala flatworms. International Journal of Molecular Sciences 16, 27865–27896.'],
 dur:12,hint:'Choose a layer to compare, then move the induced head on several weeks to see it remodel.',
 init:()=>({layer:'brain',later:0}),
 watch(p){const ks=Object.keys(L3_LAYERS),k=Math.min(4,Math.floor(p*5));return {layer:ks[Math.min(3,k)],later:k===4?1:0}},
 ui:[{choose:Object.keys(L3_LAYERS).map(k=>[k,L3_LAYERS[k][0]]),label:'Layer',get:s=>s.layer,act:'layer'},{choose:[['0','Just regrown'],['1','Several weeks later']],label:'Time',get:s=>String(s.later),act:'later'}],
 on:{layer(s,v){s.layer=L3_LAYERS[v]?v:'brain'},later(s,v){s.later=+v?1:0}},
 draw(s){
  const own=L3_SHAPES[0],ind=s.later?own:L3_SHAPES[1],diff=L3_headDist(own,ind)/L3_headProf(own).reduce((a,v)=>a+v,0)*L3_HS;
  let out=heading(`${L3_LAYERS[s.layer][0]}: own head and ${s.later?'remodelled':'induced'} head`);
  out+=L3_badge(10,40,'single');
  const panel=(x,sh,lab,col,variant)=>{const yc=150;let g=L3_worm(x,x+250,yc,52,'head','cut',{hl:sh,E:100,eyes:s.layer==='outline',fill:s.layer==='volt'?'#f6f6f6':L3_SKIN,
    shade:s.layer==='volt'?(t=>L3_vcol3(variant?(t<.45?.15+.5*t:.4):(.1+.9*Math.min(1,t*1.4)))):null,shadeN:20});
   const hx=x+100*((sh.len||1)*.5);
   if(s.layer==='brain'){const rx=variant?24:18,ry=variant?22:30,sep=variant?24:20;g+=`<ellipse cx="${fmt(hx+16)}" cy="${yc-sep}" rx="${rx}" ry="${ry*.6}" fill="${C.purplep}" stroke="${C.purple}" stroke-width="2"/><ellipse cx="${fmt(hx+16)}" cy="${yc+sep}" rx="${rx}" ry="${ry*.6}" fill="${C.purplep}" stroke="${C.purple}" stroke-width="2"/>`+L(hx+30,yc-sep+6,x+240,yc-18,C.purple,3)+L(hx+30,yc+sep-6,x+240,yc+18,C.purple,3)}
   if(s.layer==='neo'){const r=L3_rng(variant?51:50);for(let i=0;i<46;i++){const u=r(),v=r()*2-1,px=x+(variant?.18+u*.8:.42+u*.56)*250;if(px<x+30)continue;g+=Ci(px,yc+v*42*(variant?.8:.9),2.6,C.purple)}}
   return g+TBF(x+125,yc+84,lab,14,col)};
  out+=panel(30,own,'own head',C.green,0)+panel(320,ind,s.later?'induced, weeks later':'induced (rounded)',s.later?C.green:C.blue,s.later?0:1);
  if(s.layer==='volt')out+=L3_vbar3(160,280,280);
  else out+=TF(300,282,`computed outline difference: ${Math.round(diff*100)}% of the own head’s width profile`,13,C.ink);
  out+=R(40,302,520,40,C.pale,'none',8)+TF(300,327,s.later?'Reported: the worms remodelled back to their own head shape.':`Reported: ${L3_LAYERS[s.layer][1].toLowerCase()}`,13,C.ink);
  out+=L3_note('Schematic: which features changed, not how. See the paper’s figures for the data.',368);
  return {svg:out,phase:s.later?'Several weeks after regeneration the induced heads had remodelled back towards the worm’s own shape, so the change was not permanent. The genome was the same throughout.':`${L3_LAYERS[s.layer][1]} The schematic marks the layer as different; the paper shows how.`};
 }});
// Voltage colour for the schematic layer (t in 0..1, more depolarised to the right), with its scale bar.
function L3_vcol3(t){const a=[23,114,183],b=[196,82,56],w=[246,246,246];t=clamp(t,0,1);const m=t<.5?a.map((q,i)=>Math.round(lerp(q,w[i],t*2))):w.map((q,i)=>Math.round(lerp(q,b[i],(t-.5)*2)));return `rgb(${m.join(',')})`}
function L3_vbar3(x,y,w){let out='';for(let i=0;i<20;i++)out+=R(x+i*w/20,y-12,w/20+.5,10,L3_vcol3((i+.5)/20),'none',0);return out+TF(x-6,y-3,'more negative',13,C.blue,'end')+TF(x+w+6,y-3,'less negative',13,C.coral,'start')}

/* ===================== Lesson: barium-heads ===================== */
// Toy cell: Goldman–Hodgkin–Katz voltage at 20 °C from illustrative concentrations (not measured planarian values).
// Barium blocks a fraction b of the potassium channels. Excitotoxic stress lowers the head's integrity while the
// voltage is above a safe level; the head degenerates in the toy when integrity falls below 0.2.
const L3_ION={Ko:5,Ki:140,Nao:145,Nai:15,Clo:110,Cli:10};
const L3_RTF=8.314462*(273.15+20)/96485.33*1000;
function L3_ghk(pK,pNa,pCl){const c=L3_ION;return L3_RTF*Math.log((pK*c.Ko+pNa*c.Nao+pCl*c.Cli)/(pK*c.Ki+pNa*c.Nai+pCl*c.Clo))}
const L3_BA={pK:1,pNa:.05,pCl:.1,Vsafe:-50,k:.012,hours:72};
const L3_baV=(b,e={K:1,Na:1,Cl:1})=>L3_ghk(L3_BA.pK*e.K*(1-b),L3_BA.pNa*e.Na,L3_BA.pCl*e.Cl);
function L3_baRun(b){const V=L3_baV(b),a=[1];let I=1;for(let h=1;h<=L3_BA.hours;h++){I=Math.max(0,I-L3_BA.k*Math.max(0,V-L3_BA.Vsafe)/10);a.push(I)}return {V,a,gone:a.findIndex(v=>v<.2)}}
SCENE({id:'barium-heads',name:'Heads that dissolve in barium',tag:'Single-lab finding · Barium blocks potassium channels',
 definition:'Barium ions block many kinds of potassium channel. Maya Emmons-Bell and colleagues (2019) put Dugesia japonica planarians in 1 mM barium chloride and reported that the front of the head degenerated rapidly. Their analysis suggested excitotoxicity: the damage nerve cells suffer when they are held depolarised and overexcited. One lab’s finding.',
 example:`The toy computes a cell’s voltage with the Goldman equation. With no barium it rests at ${L3_mv(L3_baV(0))}; with 90% of its potassium channels blocked it sits at ${L3_mv(L3_baV(.9))}, above the toy’s safe level of ${L3_mv(L3_BA.Vsafe)}, and head integrity falls. Brain In Motion explains the Goldman equation step by step.`,
 desc:'A planarian head fading as its toy integrity falls, a cell with potassium channels being blocked by barium, the computed voltage against a safe level, and a plot of integrity over 72 toy hours.',
 research:['Emmons-Bell, Durant, Tung, Pietak, Miller, Kane, Martyniuk, Davidian, Morokuma & Levin (2019). Regenerative adaptation to electrochemical perturbation in planaria: a molecular analysis of physiological plasticity. iScience 22, 147–165.','Goldman (1943); Hodgkin & Katz (1949): the voltage equation used by the toy.'],
 dur:12,hint:'Set how many potassium channels barium blocks, then run the 72 toy hours. Find the block at which the head survives.',
 init:()=>({b:.9}),
 trace:s=>range(13).map(i=>({h:i*6,say:''})),
 ui:[{range:'b',label:'Potassium channels blocked',min:0,max:.95,step:.05,get:s=>s.b,act:'b',show:v=>Math.round(v*100)+'%'}],
 on:{b(s,v){s.b=clamp(Math.round(+v*20)/20,0,.95)}},
 draw(s,f,X){
  const run=L3_baRun(s.b),h=f?f.h:L3_BA.hours,I=run.a[h],gone=I<.2;
  let out=heading(`Hour ${h}: head integrity ${Math.round(I*100)}%${gone?', degenerated':''}`);
  out+=L3_badge(10,40,'single')+L3_badge(590,40,'model','end');
  // head fading: draw the front part paler as integrity falls
  out+=L3_worm(40,300,118,32,I>.2?'head':'cut','cut',{E:40,fill:L3_SKIN,eyes:I>.5});
  out+=`<rect x="40" y="80" width="${fmt(130*(1-I))}" height="76" fill="#ffffff" opacity=".78"/>`;
  out+=TF(170,172,gone?'front of the head lost (schematic)':'head (schematic)',13,C.muted);
  // the cell
  const cx=420,cy=118;out+=Ci(cx,cy,46,C.pale,C.blue)+TF(cx,cy+4,L3_mv(run.V),15,run.V>L3_BA.Vsafe?C.coral:C.blue,'middle','font-weight="700"');
  const nk=8,nb=Math.round(s.b*nk);for(let i=0;i<nk;i++){const a=-Math.PI/2+i*2*Math.PI/nk,x=cx+46*Math.cos(a),y=cy+46*Math.sin(a);out+=R(x-6,y-6,12,12,C.purple,'none',2)+(i<nb?Ci(x,y,5,C.amber,'#fff'):'')}
  out+=TF(cx,cy+66,`K⁺ channels ${nb} of ${nk} drawn blocked (●)`,13,C.muted);
  // integrity plot
  const pl={x0:70,y0:210,w:460,h:100},Xh=t=>pl.x0+t/L3_BA.hours*pl.w,Yi=v=>pl.y0+pl.h-v*pl.h;
  out+=R(pl.x0,pl.y0,pl.w,pl.h,'#fff',C.grid,4);
  for(const t of [0,24,48,72])out+=TF(Xh(t),pl.y0+pl.h+16,t+' h',13,C.muted);
  for(const v of [0,.5,1])out+=TF(pl.x0-6,Yi(v)+4,Math.round(v*100)+'%',13,C.muted,'end');
  out+=L(pl.x0,Yi(.2),pl.x0+pl.w,Yi(.2),C.coral,1.2,'stroke-dasharray="5 4"')+TF(pl.x0+pl.w-4,Yi(.2)-5,'degenerates',13,C.coral,'end');
  out+=L3_poly(run.a.slice(0,h+1).map((v,t)=>[Xh(t),Yi(v)]),C.blue,2.6)+TF(pl.x0,pl.y0-7,'toy head integrity',13,C.muted,'start');
  out+=L3_note('Illustrative concentrations at 20 °C. The paper used 1 mM barium chloride.',368);
  return {svg:out,phase:run.V<=L3_BA.Vsafe?`With ${Math.round(s.b*100)}% of potassium channels blocked the cell stays at ${L3_mv(run.V)}, below the toy’s safe level, so the head survives.`:
   gone?`Blocking ${Math.round(s.b*100)}% of potassium channels leaves the cell at ${L3_mv(run.V)}. Held depolarised, the toy head loses integrity and degenerates by hour ${run.gone}. In the experiments the front of the head broke down within days.`:
   `The cell sits at ${L3_mv(run.V)}, above the safe level, and the head is losing integrity: ${Math.round(I*100)}% left at hour ${h}.`};
 }});

// Scene 2: a cell that finds its way back. Toy homeostat: each toy day the cell may change the expression of the
// channel types it is allowed to change (by ×1.25 or ÷1.25, between 0.25 and 4 times normal), keeping the single
// change that brings its voltage closest to its target. Barium still blocks the same fraction of K⁺ channels.
const L3_HO={b:.9,days:30,f:1.25,lo:.25,hi:4};
const L3_HO_T=L3_baV(0);
function L3_homeo(allow){const e={K:1,Na:1,Cl:1},trace=[{V:L3_baV(L3_HO.b,e),e:{...e}}];
 for(let d=1;d<=L3_HO.days;d++){let best=null,bv=Math.abs(L3_baV(L3_HO.b,e)-L3_HO_T);
  for(const k of ['K','Na','Cl'])if(allow[k])for(const m of [L3_HO.f,1/L3_HO.f]){const ee={...e,[k]:clamp(e[k]*m,L3_HO.lo,L3_HO.hi)},v=Math.abs(L3_baV(L3_HO.b,ee)-L3_HO_T);if(v<bv-1e-9){bv=v;best=ee}}
  if(best)Object.assign(e,best);trace.push({V:L3_baV(L3_HO.b,e),e:{...e}})}
 return trace}
SCENE({id:'barium-heads-adapt',name:'A cell that finds its way back',tag:'Single-lab finding · Heads regrew tolerant of barium',
 definition:'Kept in fresh barium solution, the worms of Emmons-Bell and colleagues (2019) regenerated new heads that were insensitive to barium. The authors argue that planarians are unlikely to have met barium in their evolution, and asked how the tissue found a working state. This adaptation is a single-lab finding; how tissue “searches” for a solution is an open question and, in the lab’s framing, a hypothesis.',
 example:`The toy is a simple homeostat, not a model of the real genes: each toy day the cell changes one allowed channel type a little, keeping the change that brings its voltage nearer its target of ${L3_mv(L3_HO_T)}. With barium blocking ${Math.round(L3_HO.b*100)}% of its potassium channels, which channels it may change decides whether it gets back.`,
 desc:'A plot of a toy cell’s voltage over 30 toy days approaching or failing to reach its target, with bars for the expression of potassium, sodium and chloride channels and switches for which ones the cell may change.',
 research:['Emmons-Bell et al. (2019). Regenerative adaptation to electrochemical perturbation in planaria: a molecular analysis of physiological plasticity. iScience 22, 147–165.'],
 dur:12,hint:'Choose which channel types the cell may change, then run the toy days. Which single change is enough? Which combination gets closest?',
 init:()=>({K:1,Na:0,Cl:0}),
 trace:s=>range(16).map(i=>({d:i*2,say:''})),
 ui:[{choose:[['1','May change K⁺'],['0','K⁺ fixed']],label:'Potassium channels',get:s=>String(s.K),act:'K'},{choose:[['1','May change Na⁺'],['0','Na⁺ fixed']],label:'Sodium channels',get:s=>String(s.Na),act:'Na'},{choose:[['1','May change Cl⁻'],['0','Cl⁻ fixed']],label:'Chloride channels',get:s=>String(s.Cl),act:'Cl'}],
 on:{K(s,v){s.K=+v?1:0},Na(s,v){s.Na=+v?1:0},Cl(s,v){s.Cl=+v?1:0}},
 draw(s,f,X){
  const tr=L3_homeo(s),d=f?f.d:L3_HO.days,cur=tr[d],gap=cur.V-L3_HO_T,okk=Math.abs(gap)<2;
  let out=heading(`Toy day ${d}: ${L3_mv(cur.V)}, ${okk?'back at target':L3_mv(gap).replace(' mV','')+' mV from target'}`);
  out+=L3_badge(10,40,'single')+L3_badge(590,40,'model','end');
  const pl={x0:70,y0:80,w:300,h:200},Xd=t=>pl.x0+t/L3_HO.days*pl.w,Yv=v=>pl.y0+pl.h-(v+80)/60*pl.h;
  out+=R(pl.x0,pl.y0,pl.w,pl.h,'#fff',C.grid,4);
  for(const v of [-80,-60,-40,-20])out+=TF(pl.x0-6,Yv(v)+4,'−'+Math.abs(v),13,C.muted,'end');
  for(const t of [0,10,20,30])out+=TF(Xd(t),pl.y0+pl.h+16,t,13,C.muted);
  out+=TF(pl.x0+pl.w/2,pl.y0+pl.h+34,'toy days in barium',13,C.muted)+TF(pl.x0,pl.y0-8,'cell voltage (mV)',13,C.muted,'start');
  out+=L(pl.x0,Yv(L3_HO_T),pl.x0+pl.w,Yv(L3_HO_T),C.green,1.4,'stroke-dasharray="5 4"')+TF(pl.x0+pl.w-4,Yv(L3_HO_T)+16,'target',13,C.green,'end');
  out+=L(pl.x0,Yv(L3_BA.Vsafe),pl.x0+pl.w,Yv(L3_BA.Vsafe),C.coral,1.2,'stroke-dasharray="2 4"')+TF(pl.x0+4,Yv(L3_BA.Vsafe)+15,'safe level (previous scene)',13,C.coral,'start');
  out+=L3_poly(tr.slice(0,d+1).map((q,t)=>[Xd(t),Yv(q.V)]),C.blue,2.6);
  // expression bars
  const bx=410,by=250,lg=v=>Math.log(v)/Math.log(4);
  out+=TF(bx+80,74,'channel expression',13,C.muted)+L(bx,by-70,bx+170,by-70,C.line,1)+TF(bx-2,by-66,'1×',13,C.muted,'end');
  [['K','K⁺',C.purple],['Na','Na⁺',C.coral],['Cl','Cl⁻',C.green]].forEach(([k,lab,col],i)=>{const x=bx+10+i*56,v=cur.e[k],h=lg(v)*60;
   out+=R(x,h>=0?by-70-h:by-70,32,Math.abs(h),s[k]?col:C.grid,'none',3)+TBF(x+16,by+14,lab,13,col)+TF(x+16,by+30,fmt(Math.round(v*100)/100)+'×',13,C.ink)+TF(x+16,by+46,s[k]?'may change':'fixed',12.5,C.muted)});
  out+=TF(bx-2,by-126,'4×',13,C.muted,'end')+TF(bx-2,by-6,'¼×',13,C.muted,'end');
  out+=L3_note('A toy homeostat. The real adapted heads changed a small set of genes (next scene).',368);
  return {svg:out,phase:!s.K&&!s.Na&&!s.Cl?`The cell may change nothing, so it stays at ${L3_mv(cur.V)}, held depolarised by the barium.`:
   okk?`By toy day ${tr.findIndex(q=>Math.abs(q.V-L3_HO_T)<2)} the cell is back within 2 mV of its target, by changing ${['K','Na','Cl'].filter(k=>Math.abs(Math.log(cur.e[k]))>.01).map(k=>({K:'potassium',Na:'sodium',Cl:'chloride'})[k]).join(' and ')} channel expression. The barium is still there; the cell has found another way to the same voltage.`:
   `After ${d} toy days the cell is at ${L3_mv(cur.V)}, ${L3_mv(Math.abs(gap)).replace('+','')} from its target. ${d===L3_HO.days?'Within the allowed range of expression this is as close as it gets.':'It is still adjusting.'}`};
 }});

// Scene 3: what the paper tested. Each condition shows the reported outcome as a schematic (no model).
const L3_BAT=[
 ['ba','Barium chloride (1 mM)','The front of the head degenerated rapidly.','gone'],
 ['adapt','Kept in fresh barium','New heads regenerated that were insensitive to barium.','tolerant'],
 ['protect','Barium + chloride and calcium channel blockers','Heads survived the first exposure.','kept'],
 ['trpm','Adapted worms + a TRPM channel blocker','The adaptation was reversed.','lost'],
 ['rna','RNA sequencing of adapted heads','A small set of genes changed expression; the authors proposed a model of adaptation to excitotoxicity.','genes']];
SCENE({id:'barium-heads-tests',name:'What changed in the adapted heads',tag:'Single-lab finding · Gene expression and channel blockers',
 definition:'Emmons-Bell and colleagues compared the regenerated, barium-tolerant heads with normal ones by RNA sequencing and found changes in a small set of genes. Blocking chloride and calcium channels let heads survive the first exposure to barium, and blocking TRPM channels, a family of cation channels, reversed the adaptation. They proposed that the adapted heads had adjusted to excitotoxic stress. One lab’s findings.',
 example:'The small number of changed genes is part of the puzzle the authors raise: of the many changes the tissue could have made, it found a few that worked. That framing, tissue solving a problem it never met in evolution, is the lab’s interpretation, a framework or hypothesis, not a measured fact.',
 desc:'A list of five conditions from the paper; choosing one draws a schematic of the head before and after and states the reported outcome.',
 research:['Emmons-Bell, Durant, Tung, Pietak, Miller, Kane, Martyniuk, Davidian, Morokuma & Levin (2019). iScience 22, 147–165.'],
 dur:12,hint:'Choose each condition to see what the paper reported.',
 init:()=>({c:'adapt'}),
 watch(p){return {c:L3_BAT[Math.min(4,Math.floor(p*5))][0]}},
 ui:[{choose:L3_BAT.map(r=>[r[0],{ba:'Barium',adapt:'Kept in it',protect:'Cl⁻/Ca²⁺ blockers',trpm:'TRPM blocker',rna:'Genes'}[r[0]]]),label:'Condition',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=L3_BAT.some(r=>r[0]===v)?v:'adapt'}},
 draw(s,f,X){
  const row=L3_BAT.find(r=>r[0]===s.c);
  let out=heading(row[1]);
  out+=L3_badge(10,40,'single');
  L3_BAT.forEach((r,i)=>{const y=96+i*30,sel=r[0]===s.c;out+=hit(X,'c',r[0],r[1],R(14,y-16,196,24,sel?C.pale:'#fff',sel?C.blue:C.grid,6)+TF(22,y+1,r[1].length>28?r[1].slice(0,27)+'…':r[1],12.5,sel?C.blue:C.ink,'start'))});
  const before=(x,lab)=>L3_worm(x,x+130,120,22,'head','cut',{E:26})+TF(x+65,160,lab,13,C.muted);
  const o=row[3];
  out+=before(240,'before')+arrow(384,120,410,120,C.ink,2);
  if(o==='gone')out+=L3_worm(420,550,120,22,'cut','cut',{E:26,fill:tint(L3_SKIN,.3)})+TF(485,160,'front lost',13,C.coral);
  else if(o==='tolerant')out+=L3_worm(420,550,120,22,'head','cut',{E:26,newL:30})+TF(485,160,'new head, tolerant',13,C.green);
  else if(o==='kept')out+=L3_worm(420,550,120,22,'head','cut',{E:26})+TF(485,160,'head survives',13,C.green);
  else if(o==='lost')out+=L3_worm(420,550,120,22,'cut','cut',{E:26,fill:tint(L3_SKIN,.3)})+TF(485,160,'sensitive again',13,C.coral);
  else{const r=L3_rng(19);for(let i=0;i<60;i++){const x=420+(i%12)*11,y=96+Math.floor(i/12)*11,hl=i%13===4||i===37||i===51;out+=R(x,y,9,9,hl?C.coral:C.grid,'none',2)}out+=TF(485,170,'a few genes changed (schematic grid)',13,C.coral)}
  // reported box
  const words=row[2].split(' '),lines=[''];for(const w of words){if((lines[lines.length-1]+' '+w).length>58)lines.push(w);else lines[lines.length-1]+=(lines[lines.length-1]?' ':'')+w}
  out+=R(230,196,350,34+lines.length*18,C.pale,'none',8)+TBF(242,216,'Reported',13,C.blue,'start');lines.forEach((l,i)=>{out+=TF(242,236+i*18,l,13,C.ink,'start')});
  out+=R(14,300,572,46,C.purplep,'none',8)+L3_badge(22,306,'frame')+TF(22+L3_badgeW('frame')+8,320,'How did the tissue find these few changes?',13,C.ink,'start')+TF(22+L3_badgeW('frame')+8,338,'The lab treats it as problem-solving; that is an interpretation.',13,C.ink,'start');
  out+=L3_note('Schematics of reported outcomes; no model numbers in this scene.',370);
  return {svg:out,phase:`${row[1]}: ${row[2]}`};
 }});

/* ===================== Lesson: headless-memory ===================== */
// Scene 1: the history, and why scoring must be blind or automated. Toy: two groups of worms with the SAME true
// chance (0.3) of responding on each trial. Some trials (30%) are ambiguous; an observer who knows which group a worm
// is in scores ambiguous trials towards what they expect, by an amount set by the learner. Counts are seeded.
const L3_OB={p:.3,amb:.3,worms:20,trials:20};
function L3_obRun(mode,bias){const r=L3_rng(1959),res={trained:0,control:0},n=L3_OB.worms*L3_OB.trials;
 for(const g of ['trained','control'])for(let i=0;i<n;i++){const real=r()<L3_OB.p,amb=r()<L3_OB.amb,c=r();
  let yes=real;if(amb){if(mode==='auto')yes=real;else if(mode==='blind')yes=c<.5;else yes=c<.5+(g==='trained'?bias:-bias)}
  if(yes)res[g]++}
 return {t:res.trained/n,c:res.control/n,n}}
const L3_HIST=[[1959,'McConnell et al.','halves kept it'],[1962,'McConnell','“transfer” claim'],[1964,'Bennett, Calvin','hard to train'],[2013,'Shomrat, Levin','automated test'],[2023,'Gershman','re-reads record']];
SCENE({id:'headless-memory',name:'McConnell’s worms',tag:'Criticism and debate · A disputed history',
 definition:'In 1959 James McConnell and his colleagues Jacobson and Kimble trained planarians to react to a light paired with a shock, cut them in two, and reported that both halves, once regenerated, kept the response, the tail halves as well as the heads. McConnell later reported that untrained worms fed on trained ones learned faster. Other labs found planarians hard to train at all (Bennett and Calvin, 1964), critics pointed to weak controls, and by the 1970s the work was widely doubted.',
 example:'The toy shows one reason scoring matters, not what happened in any study: two groups with exactly the same true response rate can look different when the scorer knows which is which and must judge ambiguous trials. Blind or automated scoring removes it. A 2023 review by Samuel Gershman argued that the planarian record was more mixed than its reputation suggests; the debate is historical, not settled.',
 desc:'A timeline of the planarian memory claims, and a toy in which two identical groups are scored by an observer who knows the groups, by a blind observer, or by an automated tracker, with the computed response rates.',
 research:['McConnell, Jacobson & Kimble (1959). The effects of regeneration upon retention of a conditioned response in the planarian. Journal of Comparative and Physiological Psychology 52, 1–5.','McConnell (1962). Memory transfer through cannibalism in planarians. Journal of Neuropsychiatry 3, supplement 1.','Bennett & Calvin (1964). Failure to train planarians reliably. Neurosciences Research Program Bulletin.','Gershman (2023). The molecular memory code and synaptic plasticity: a synthesis. BioSystems 224, 104825.'],
 dur:12,hint:'Choose how the trials are scored and how strongly a knowing observer leans, and compare the two groups’ computed response rates. Both groups truly respond on 30% of trials.',
 init:()=>({mode:'know',bias:.3}),
 watch(p){return p<.4?{mode:'know',bias:Math.round(p/.4*4)/10}:p<.7?{mode:'blind',bias:.4}:{mode:'auto',bias:.4}},
 ui:[{choose:[['know','Observer knows groups'],['blind','Blind observer'],['auto','Automated tracker']],label:'Scoring',get:s=>s.mode,act:'mode'},{range:'bias',label:'Observer’s lean',min:0,max:.4,step:.05,get:s=>s.bias,act:'bias',show:v=>Math.round(v*100)+'%'}],
 on:{mode(s,v){s.mode=['know','blind','auto'].includes(v)?v:'know'},bias(s,v){s.bias=clamp(Math.round(+v*20)/20,0,.4)}},
 draw(s){
  const r=L3_obRun(s.mode,s.bias),diff=Math.round((r.t-r.c)*100);
  let out=heading(`Apparent difference: ${diff>0?'+':diff<0?'−':''}${Math.abs(diff)} points`);
  out+=L3_badge(10,40,'debate')+L3_badge(590,40,'model','end');
  // timeline
  out+=L(40,96,560,96,C.line,2);
  L3_HIST.forEach(([y,a,b],i)=>{const x=70+i*115;out+=Ci(x,96,6,y>=2013?C.blue:C.coral)+TBF(x,84,y,13,y>=2013?C.blue:C.coral)+TF(x,116,a,12.5,C.ink)+TF(x,132,b,12.5,C.muted)});
  // bars
  const bx=150,base=300,Hh=130;
  [['trained',r.t,C.coral],['control',r.c,C.blue]].forEach(([g,v,col],i)=>{const x=bx+i*110,h=v*Hh/.6;out+=R(x,base-h,64,h,tint(col,.6),col,4)+TBF(x+32,base-h-6,Math.round(v*100)+'%',14,col)+TF(x+32,base+18,g==='trained'?'“trained”':'control',13,C.ink)});
  out+=L(bx-20,base-L3_OB.p*Hh/.6,bx+194,base-L3_OB.p*Hh/.6,C.ink,1.4,'stroke-dasharray="5 4"')+TF(bx-24,base-L3_OB.p*Hh/.6+4,'true 30%',13,C.ink,'end');
  out+=TF(170,base+36,`responses scored, ${r.n} trials per group`,13,C.muted);
  out+=R(380,160,200,140,'#fff',C.grid,8)+TBF(480,182,s.mode==='know'?'Observer knows':s.mode==='blind'?'Blind observer':'Automated',13,C.ink);
  const lines=s.mode==='know'?['Ambiguous trials are','scored towards what','the observer expects.']:s.mode==='blind'?['Ambiguous trials are','scored without knowing','the group: no lean.']:['A camera scores each','trial by one rule.','Shomrat & Levin (2013).'];
  lines.forEach((l,i)=>{out+=TF(480,206+i*18,l,13,C.muted)});
  out+=L3_note('A toy about scoring. It does not show that any study was biased.',368);
  return {svg:out,phase:s.mode==='know'?(s.bias>0?`Both groups truly respond on 30% of trials, yet the knowing observer’s lean of ${Math.round(s.bias*100)}% on ambiguous trials makes the “trained” group look ${diff} points better. Critics of the early planarian work asked for controls against exactly this kind of effect.`:'With no lean, the knowing observer scores both groups alike.'):
   s.mode==='blind'?`Scored blind, the two groups differ by ${Math.abs(diff)} points, which is chance in the toy’s seeded trials.`:`An automated tracker applies one rule to every trial. The groups differ by ${Math.abs(diff)} points, only chance. Shomrat and Levin built an automated system so that no human judged the worms.`};
 }});

// Scene 2: the arena. Toy latencies to start feeding in a lit area (log-normal, seeded). Familiarised worms are
// less hesitant in a familiar rough-floored arena; the advantage fades with a toy time constant of 30 days.
const L3_AR={med:8,sd:.45,eff:.45,tau:30};
function L3_arRun(n,days,seed=2013){const r=L3_rng(seed),m=Math.exp(-days/L3_AR.tau);
 const g=f=>range(n).map(()=>L3_AR.med*Math.exp(-f*L3_AR.eff*m+L3_AR.sd*L3_gauss(r)));
 const fam=g(1),ctl=g(0),med=a=>{const b=a.slice().sort((x,y)=>x-y);return b.length%2?b[(b.length-1)/2]:(b[b.length/2-1]+b[b.length/2])/2};
 return {fam,ctl,mf:med(fam),mc:med(ctl),m}}
SCENE({id:'headless-memory-arena',name:'A familiar floor',tag:'Single-lab finding · Automated training',
 definition:'Tal Shomrat and Michael Levin (2013) built an automated system in which cameras tracked Dugesia japonica planarians and a computer scored them. Worms were kept for days in dishes with a rough floor, or, as controls, a smooth one. Then each worm was put in a rough-floored arena with food in a lit area, which planarians normally avoid. Worms familiar with the rough floor began feeding sooner, and the authors reported that this memory lasted at least 14 days. One lab’s finding.',
 example:'The toy draws each worm’s time to start feeding from a seeded log-normal spread, with a familiarity advantage that fades with time since training. Its minutes and its fading rate are invented for illustration; only the design of the experiment comes from the paper.',
 desc:'A schematic arena with a rough floor and a lit feeding spot, and dot plots of the computed times to start feeding for familiarised and control worms, with their medians.',
 research:['Shomrat & Levin (2013). An automated training paradigm reveals long-term memory in planarians and its persistence through head regeneration. Journal of Experimental Biology 216, 3799–3810.'],
 dur:12,hint:'Change the number of worms per group and the days since familiarisation, and compare the medians. With few worms, chance can hide or fake a difference.',
 init:()=>({n:20,days:1}),
 watch(p){return {n:20,days:Math.round(p*28)}},
 ui:[{range:'n',label:'Worms per group',min:6,max:40,step:2,get:s=>s.n,act:'n'},{range:'days',label:'Days since familiarisation',min:0,max:28,get:s=>s.days,act:'days'}],
 on:{n(s,v){s.n=clamp(Math.round(+v/2)*2,6,40)},days(s,v){s.days=clamp(Math.round(+v),0,28)}},
 draw(s){
  const r=L3_arRun(s.n,s.days),faster=Math.round((1-r.mf/r.mc)*100);
  let out=heading(`Familiar worms ${faster>=0?faster+'% faster':Math.abs(faster)+'% slower'} (toy medians)`);
  out+=L3_badge(10,40,'single')+L3_badge(590,40,'model','end');
  // arena
  const ax=120,ay=150;out+=Ci(ax,ay,74,'#fff',C.line);
  for(let i=-6;i<=6;i++){const y=ay+i*11,hw=Math.sqrt(Math.max(0,74*74-(i*11)**2));out+=L(ax-hw+4,y,ax+hw-4,y,C.grid,1.2,'stroke-dasharray="2 3"')}
  out+=`<path d="M${ax} ${ay} L${ax+74} ${ay-30} A74 74 0 0 1 ${ax+74} ${ay+30} Z" fill="${C.amberp}" opacity=".9"/>`+Ci(ax+56,ay,7,C.coral)+TF(ax+56,ay-16,'food',13,C.coral);
  out+=TF(ax+64,ay+50,'lit',13,C.amber)+TF(ax,ay+92,'rough floor (schematic)',13,C.muted);
  out+=L3_icon(ax-40,ay+8,1,40);
  // dot plots
  const px=250,pw=320,tmax=30,Xt=t=>px+Math.min(t,tmax)/tmax*pw;
  out+=L(px,250,px+pw,250,C.line,1.4);for(const t of [0,10,20,30])out+=TF(Xt(t),266,t,13,C.muted);
  out+=TF(px+pw/2,284,'toy minutes to start feeding',13,C.muted);
  [['familiar',r.fam,r.mf,C.coral,110],['control',r.ctl,r.mc,C.blue,190]].forEach(([lab,a,m,col,y])=>{
   a.forEach((t,i)=>{out+=Ci(Xt(t),y+((i%5)-2)*5,3.2,tint(col,.25))});
   out+=L(Xt(m),y-20,Xt(m),y+20,col,3)+TBF(Xt(m),y-26,'median '+fmt(L3_r1(m)),13,col)+TBF(px-8,y+5,lab,13,col,'end')});
  out+=R(250,300,330,42,C.pale,'none',8)+L3_badge(258,311,'single')+TF(258+L3_badgeW('single')+8,325,'Reported: ≥ 14 days',13,C.ink,'start');
  out+=L3_note('Toy minutes and fading rate; only the design follows the paper.',368);
  return {svg:out,phase:`${s.days} day${s.days===1?'':'s'} after familiarisation, the toy’s familiarised worms have a median of ${fmt(L3_r1(r.mf))} toy minutes against ${fmt(L3_r1(r.mc))} for controls (${s.n} worms each). ${s.n<12?'With so few worms the medians jump about from chance alone.':'The toy advantage fades slowly with time.'}`};
 }});

// Scene 3: after the head regrows. Toy: a worm starts feeding quickly when "trace + retraining" passes a threshold.
// The trace left in the body after decapitation is a hypothetical toy quantity; brief retraining adds a fixed amount.
const L3_SV={trace:.5,retrain:.5,th:.75,gain:.5,med:8,sd:.45};
// Both groups share one seeded spread of worm-to-worm variation, so only the toy effect differs between them.
function L3_svRun(retrain,n=30,seed=713){const r=L3_rng(seed),o=L3_SV,res={},z=range(n).map(()=>L3_gauss(r));
 for(const g of ['fam','ctl']){const tr=g==='fam'?o.trace:0,drive=tr+(retrain?o.retrain:0),on=drive>=o.th,sh=g==='fam'?3:0;
  res[g]={on,drive,t:range(n).map(i=>o.med*Math.exp(-(on?o.gain:0)+o.sd*z[(i+sh)%n]))}}
 const med=a=>{const b=a.slice().sort((x,y)=>x-y);return (b[n/2-1]+b[n/2])/2};res.mf=med(res.fam.t);res.mc=med(res.ctl.t);return res}
SCENE({id:'headless-memory-savings',name:'After the head regrows',tag:'Single-lab finding · Savings after regeneration',
 definition:'Shomrat and Levin then cut the heads off familiarised and control worms and let new heads, with new brains, regrow. Tested straight away, the regenerated worms showed no clear difference. After one brief retraining session, too short to train naive worms, the regenerated familiarised worms began feeding sooner than the controls: “savings”, faster relearning. This is one lab’s result; the effect was modest, appeared only after retraining, and, as far as this course could find, has not yet been independently replicated.',
 example:'Where such a trace could be kept is unknown. The authors suggested it may lie outside the brain and be imprinted on the new brain as it forms; that is a hypothesis, not an established fact, and nothing here shows that memories are “stored in the tail”. In the toy, a hypothetical trace plus a brief retraining must pass one threshold; neither alone is enough.',
 desc:'Regenerated worms tested with or without a brief retraining session; bars show the toy’s trace and retraining against a threshold for each group, and dot plots show the computed times to start feeding.',
 research:['Shomrat & Levin (2013). An automated training paradigm reveals long-term memory in planarians and its persistence through head regeneration. Journal of Experimental Biology 216, 3799–3810.'],
 dur:12,hint:'Test the regenerated worms without and then with a brief retraining session, and compare the groups.',
 init:()=>({retrain:1}),
 watch(p){return {retrain:p<.5?0:1}},
 ui:[{choose:[['0','Test straight away'],['1','Brief retraining first']],label:'Before testing',get:s=>String(s.retrain),act:'retrain'}],
 on:{retrain(s,v){s.retrain=+v?1:0}},
 draw(s){
  const o=L3_SV,r=L3_svRun(s.retrain),faster=Math.round((1-r.mf/r.mc)*100);
  let out=heading(s.retrain?`After brief retraining: familiar ${faster}% faster (toy)`:`No retraining: ${Math.abs(faster)<15?'no clear difference':faster+'% difference'} (toy)`);
  out+=L3_badges(10,40,['single','debate'])+L3_badge(590,40,'model','end');
  // worms: old head gone, new head
  out+=L3_worm(40,200,100,18,'head','tail',{newL:34,E:22})+TF(120,134,'new head and brain',13,C.muted);
  // drive bars
  const bx=260,base=150,Hh=70,hv=v=>v/1.1*Hh;
  [['fam','familiar',C.coral],['ctl','control',C.blue]].forEach(([g,lab,col],i)=>{const x=bx+i*150,tr=g==='fam'?o.trace:0,rt=s.retrain?o.retrain:0;
   out+=R(x,base-hv(tr),40,hv(tr),C.amberp,C.amber,2)+R(x,base-hv(tr+rt),40,hv(rt),tint(col,.6),col,2)+TBF(x+20,base+18,lab,13,col)+TF(x+48,base-hv(tr+rt)+12,r[g].on?'passes':'below',13,r[g].on?C.green:C.muted,'start')});
  out+=L(bx-10,base-hv(o.th),bx+250,base-hv(o.th),C.ink,1.4,'stroke-dasharray="5 4"')+TF(bx+256,base-hv(o.th)+4,'threshold',13,C.ink,'start');
  out+=R(bx-6,base+28,10,10,C.amberp,C.amber,2)+TF(bx+8,base+37,'hypothetical trace',13,C.muted,'start')+R(bx+150,base+28,10,10,C.line,'none',2)+TF(bx+164,base+37,'brief retraining',13,C.muted,'start');
  // dot plots
  const px=150,pw=400,tmax=30,Xt=t=>px+Math.min(t,tmax)/tmax*pw;
  out+=L(px,320,px+pw,320,C.line,1.4);for(const t of [0,10,20,30])out+=TF(Xt(t),336,t,13,C.muted);
  out+=TF(px+pw/2,352,'toy minutes to start feeding',13,C.muted);
  [['familiar',r.fam.t,r.mf,C.coral,232],['control',r.ctl.t,r.mc,C.blue,286]].forEach(([lab,a,m,col,y])=>{
   a.forEach((t,i)=>{out+=Ci(Xt(t),y+((i%5)-2)*4,3,tint(col,.25))});
   out+=L(Xt(m),y-14,Xt(m),y+14,col,3)+TBF(Xt(m)+6,y-14,fmt(L3_r1(m)),13,col,'start')+TBF(px-8,y+5,lab,13,col,'end')});
  out+=L3_note('A toy of the savings logic; times and amounts are invented.',372);
  return {svg:out,phase:s.retrain?`With one brief session added, the familiarised group’s hypothetical trace plus retraining passes the toy threshold and its median falls to ${fmt(L3_r1(r.mf))} toy minutes, against ${fmt(L3_r1(r.mc))} for controls, for whom the brief session alone is not enough. This is the pattern the paper reported; whether it survives independent replication is open.`:
   `Tested straight away, neither group passes the toy threshold, and the medians (${fmt(L3_r1(r.mf))} and ${fmt(L3_r1(r.mc))} toy minutes) are the same: the toy gives both groups one shared spread, so only a passed threshold could separate them. The paper likewise reported no clear difference before retraining.`};
 }});
