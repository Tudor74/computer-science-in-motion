/* ===================== Economics era 2 · Margins and markets (1870–1930) ===================== */
// Value at the margin, supply and demand, elasticity, surplus, general equilibrium and the costs markets ignore.
// Every picture is a pure function of state, frame and X; markets are straight lines so the numbers can be
// checked by hand. The standard market: demand P = 10 − 0.1Q, supply P = 2 + 0.06Q, equilibrium Q = 50, P = £5.
const E2_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const E2_area=(pts,fill,extra='')=>pts.length?`<polygon points="${pts.map(p=>fmt(p[0])+','+fmt(p[1])).join(' ')}" fill="${fill}" stroke="none" ${extra}/>`:'';
function E2_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function E2_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,9,o.sel?'stroke-width="3"':'stroke-width="1.5"')+TF(x+w/2,y+h/2+5,text,o.size||13,o.ink||C.ink,'middle',o.bold?'font-weight="700"':'');
 return hit(X,act,arg,label,inner);
}
const E2_gbp=v=>(v<0?'−':'')+'£'+Math.abs(v).toFixed(Math.abs(v)<1000&&Math.abs(v-Math.round(v))>.004?2:0);
const E2_n=(v,d=1)=>{const r=Number(v.toFixed(d));return (r<0?'−':'')+String(Math.abs(r))};
// Standard linear market (price in £, quantity in units a day).
const E2_D=(q,ds=0)=>10+ds-.1*q, E2_S=(q,ss=0)=>2+ss+.06*q;
const E2_Qd=(p,ds=0)=>Math.max(0,(10+ds-p)/.1), E2_Qs=(p,ss=0)=>Math.max(0,(p-2-ss)/.06);
const E2_eq=(ds=0,ss=0)=>{const q=Math.max(0,(8+ds-ss)/.16);return {q,p:E2_D(q,ds)}};
// A price–quantity plot for the standard market (Q 0–100, P £0–£12).
const E2_mkt=(x,y,w,h)=>E2_plot(x,y,w,h,[0,100],[0,12],{xt:[[0,'0'],[25,'25'],[50,'50'],[75,'75'],[100,'100']],yt:[[0,'£0'],[4,'£4'],[8,'£8'],[12,'£12']],xl:'quantity a day',yl:'price'});
const E2_line=(pl,f,col,w=2.6,extra='',q0=0,q1=100)=>{const pts=[];for(let i=0;i<=50;i++){const q=q0+(q1-q0)*i/50,p=f(q);if(p>=-.01&&p<=12.01)pts.push([pl.X(q),pl.Y(p)])}return E2_poly(pts,col,w,extra)};

/* ================================================================ marginal-utility */
const E2_MUW=[10,7,4.9,3.4,2.4,1.7,1.2,.8];
SCENE({id:'marginal-utility',name:'Each glass is worth less',tag:'Diminishing marginal utility',
 definition:'Marginal utility is the extra satisfaction from one more unit of something. It usually falls as you have more: the first glass of water on a hot day matters a great deal, the eighth hardly at all. Buying the next unit is worth it only while its marginal utility is at least its price.',
 example:'If the glasses are worth 10, 7, 4.9, 3.4 … (in pence of satisfaction) and a glass costs 3p, you buy four: the fifth would give 2.4p of satisfaction for 3p.',
 desc:'Bars for the marginal utility of each glass, falling from left to right, with a price line across them; glasses above the line are bought. Beside it, total utility rising ever more slowly.',
 research:'Gossen, H. H. (1854). Entwickelung der Gesetze des menschlichen Verkehrs. Jevons, W. S. (1871). The Theory of Political Economy. Menger, C. (1871). Grundsätze der Volkswirthschaftslehre. Walras, L. (1874). Éléments d’économie politique pure. Three economists reached the idea independently within four years: the “marginal revolution”.',
 dur:10,hint:'Move the price. You keep buying while the next glass is worth at least the price, so a lower price means more glasses: a demand curve, built from falling marginal utility.',
 init:()=>({p:3}),
 watch(p){return {p:Math.round(lerp(9,1,smooth(p))*2)/2}},
 ui:[{range:'p',label:'Price of a glass (pence)',min:.5,max:10,step:.5,get:s=>s.p,act:'p',show:v=>v+'p'}],
 on:{p(s,v){s.p=Number(v);return 'keep'}},
 draw(s){
  const n=E2_MUW.filter(v=>v>=s.p).length;let out=heading('Each extra glass adds less',28);
  const pl=E2_plot(66,62,300,226,[0,8],[0,11],{yt:[[0,'0'],[5,'5'],[10,'10']],xl:'glass number',yl:'marginal utility (pence)'});
  out+=pl.svg;
  E2_MUW.forEach((v,i)=>{const bought=v>=s.p;out+=R(pl.X(i)+5,pl.Y(v),pl.X(1)-pl.X(0)-10,pl.Y(0)-pl.Y(v),bought?C.blue:C.pale,'none',3)+TF(pl.X(i+.5),pl.Y(0)+17,String(i+1),13,C.muted)});
  out+=L(pl.X(0),pl.Y(s.p),pl.X(8),pl.Y(s.p),C.coral,2.4)+TF(pl.X(8)-4,pl.Y(s.p)-7,'price '+s.p+'p',13,C.coral,'end');
  // Total utility.
  const tot=[0];E2_MUW.forEach(v=>tot.push(tot[tot.length-1]+v));
  const g=E2_plot(420,62,150,150,[0,8],[0,34],{xt:[[0,'0'],[4,'4'],[8,'8']],yt:[[0,'0'],[30,'30']],xl:'glasses',xlDy:31,yl:'total utility'});
  out+=g.svg+E2_poly(tot.map((v,i)=>[g.X(i),g.Y(v)]),C.green,2.6)+Ci(g.X(n),g.Y(tot[n]),5,C.green,'#fff');
  const spent=n*s.p,surplus=tot[n]-spent;
  out+=counter(404,262,'bought',String(n),C.blue,80)+counter(490,262,'worth − cost',E2_n(surplus)+'p',C.green,90);
  return {svg:out,phase:`At ${s.p}p a glass you buy ${n}: each of those is worth at least the price, and the next (${n<8?E2_MUW[n]+'p':'none left'}) is not. Total utility still rises with every glass, but more and more slowly. Plot glasses bought against price and you get a downward-sloping demand curve.`};
 }});

// Water and diamonds: marginal value against total value.
const E2_MUw=q=>100/(1+q), E2_TUw=q=>100*Math.log(1+q);
SCENE({id:'marginal-utility-paradox',name:'Water and diamonds',tag:'The paradox of value',
 definition:'Water is essential and cheap; diamonds are inessential and dear. The paradox dissolves at the margin: price reflects the value of one more unit, and because water is plentiful the next litre is worth little, even though all the water together is worth a great deal.',
 example:'With 50 litres a day the next litre is worth about 2p, though the water as a whole is worth almost £4 a day of satisfaction; in a desert with half a litre, the next litre is worth about 67p.',
 desc:'The marginal value of water against how much you have. The height of the curve at your amount is the value of the next litre; the shaded area under it is the value of all your water together.',
 research:'Law, J. (1705). Money and Trade Considered. Smith, A. (1776). The Wealth of Nations, Book I, chapter 4 (value in use against value in exchange). Jevons, W. S. (1871). The Theory of Political Economy. The utility curve here is illustrative.',
 dur:10,hint:'Change how much water you have. The shaded area (total value) grows while the height at the edge (the value of the next litre, which is what sets the price) shrinks.',
 init:()=>({q:50}),
 watch(p){return {q:Math.round(lerp(.5,60,smooth(p))*2)/2}},
 ui:[{range:'q',label:'Water you have (litres a day)',min:.5,max:60,step:.5,get:s=>s.q,act:'q'},{choose:[['desert','Desert: ½ litre'],['town','Town: 50 litres']],label:'Place',get:s=>s.q<=1?'desert':s.q>=50?'town':'',act:'place'}],
 on:{q(s,v){s.q=Number(v);return 'keep'},place(s,v){s.q=v==='desert'?.5:50;return 'keep'}},
 draw(s){
  let out=heading('Total value against the value of one more',28);
  const pl=E2_plot(66,62,340,226,[0,60],[0,100],{xt:[[0,'0'],[20,'20'],[40,'40'],[60,'60']],yt:[[0,'0'],[50,'50p'],[100,'£1']],xl:'litres of water a day',yl:'value of one more litre'});
  out+=pl.svg;
  const area=[[pl.X(0),pl.Y(0)]];for(let i=0;i<=60;i++){const q=s.q*i/60;area.push([pl.X(q),pl.Y(E2_MUw(q))])}area.push([pl.X(s.q),pl.Y(0)]);
  out+=E2_area(area,C.pale);
  out+=E2_poly(range(121).map(i=>{const q=i/2;return [pl.X(q),pl.Y(E2_MUw(q))]}),C.blue,2.6);
  const mu=E2_MUw(s.q);out+=L(pl.X(s.q),pl.Y(0),pl.X(s.q),pl.Y(mu),C.coral,2.4)+Ci(pl.X(s.q),pl.Y(mu),5,C.coral,'#fff');
  out+=TF(pl.X(s.q)+(s.q>40?-8:8),pl.Y(mu)-10,'next litre: '+E2_n(mu,1)+'p',13,C.coral,s.q>40?'end':'start');
  out+=counter(430,70,'value of the next litre',E2_n(mu,1)+'p',C.coral,150)+counter(430,126,'value of all of it',E2_gbp(E2_TUw(s.q)/100),C.blue,150);
  out+=TF(505,206,'Diamonds: few exist,',13,C.muted)+TF(505,224,'so the next one',13,C.muted)+TF(505,242,'is worth a lot.',13,C.muted);
  return {svg:out,phase:s.q<=2?`With only ${s.q} litres a day the next litre is worth ${E2_n(mu,1)}p: water is precious at the margin, as in a desert, and people would pay a great deal for it.`:`With ${s.q} litres a day the next litre is worth only ${E2_n(mu,1)}p, so water is cheap, even though all your water together is worth ${E2_gbp(E2_TUw(s.q)/100)} a day of satisfaction. Prices follow the margin, not the total.`};
 }});

// Spending a budget: equalise marginal utility per pound.
const E2_MUT=[12,10,8,6,4,2],E2_MUC=[24,12,9,6,3,1],E2_PT=2,E2_PC=3,E2_BUD=12;
const E2_cum=a=>{const c=[0];a.forEach(v=>c.push(c[c.length-1]+v));return c};
const E2_UT=E2_cum(E2_MUT),E2_UC=E2_cum(E2_MUC);
const E2_BEST=(()=>{let b={t:0,c:0,u:-1};for(let t=0;t<=6;t++)for(let c=0;c<=6;c++)if(t*E2_PT+c*E2_PC<=E2_BUD&&E2_UT[t]+E2_UC[c]>b.u)b={t,c,u:E2_UT[t]+E2_UC[c]};return b})();
SCENE({id:'marginal-utility-equimarginal',name:'Spending a budget well',tag:'Equal satisfaction per pound',
 definition:'With a fixed budget, you get the most satisfaction by spending each next pound where it adds the most. At the best mix, the last pound spent on each thing adds about the same: marginal utility divided by price is equal across goods.',
 example:'With £12, tea at £2 and cake at £3, the best mix here is 3 teas and 2 cakes: the third tea adds 8 (4 per pound) and the second cake adds 12 (also 4 per pound).',
 desc:'Two rows of bars for the marginal utility of each cup of tea and slice of cake, with the chosen units filled in, the money spent against the £12 budget, total satisfaction and the best possible total.',
 research:'Gossen, H. H. (1854) (his “second law”). Jevons, W. S. (1871). The Theory of Political Economy. Marshall, A. (1890). Principles of Economics, Book III. The utility numbers are illustrative.',
 dur:10,hint:'Choose how many cups of tea and slices of cake to buy with £12. Try to beat the best total; at the best mix the last pound on each gives about the same satisfaction.',
 init:()=>({t:1,c:3}),
 watch(p){const path=[[0,4],[1,3],[2,2],[3,2]],k=Math.min(3,Math.floor(p*4));return {t:path[k][0],c:path[k][1]}},
 ui:[{range:'t',label:'Cups of tea (£2 each)',min:0,max:6,step:1,get:s=>s.t,act:'t'},{range:'c',label:'Slices of cake (£3 each)',min:0,max:6,step:1,get:s=>s.c,act:'c'}],
 on:{t(s,v){s.t=Number(v);return 'keep'},c(s,v){s.c=Number(v);return 'keep'}},
 draw(s){
  const spend=s.t*E2_PT+s.c*E2_PC,over=spend>E2_BUD,u=E2_UT[s.t]+E2_UC[s.c];let out=heading('£12 to spend on tea and cake',28);
  const row=(y,mu,n,price,col,name)=>{let o=TF(30,y-8,name+' (£'+price+')',13,C.muted,'start');mu.forEach((v,i)=>{const h=v*2.6;o+=R(30+i*46,y+80-h,36,h,i<n?col:C.pale,'none',3)+TF(48+i*46,y+80-h-5,String(v),13,i<n?col:C.muted)});
   o+=TF(30+6*46+4,y+60,'per £: '+(n>0?E2_n(mu[n-1]/price,1):'—'),13,col,'start');return o};
  out+=row(70,E2_MUT,s.t,E2_PT,C.blue,'Tea: extra satisfaction from each cup');
  out+=row(196,E2_MUC,s.c,E2_PC,C.coral,'Cake: extra satisfaction from each slice');
  out+=counter(440,62,'money spent',(over?'':'')+'£'+spend+' of £12',over?C.coral:C.ink,140)+counter(440,118,'total satisfaction',over?'over budget':String(u),over?C.coral:C.green,140)+counter(440,174,'best possible',String(E2_BEST.u),C.muted,140);
  return {svg:out,phase:over?`That costs £${spend}, more than the £12 budget. Drop a cup or a slice.`:u===E2_BEST.u?`${s.t} teas and ${s.c} cakes give ${u}, the best possible with £12. The last tea adds ${E2_MUT[s.t-1]} for £2 and the last cake adds ${E2_MUC[s.c-1]} for £3: ${E2_n(E2_MUT[s.t-1]/2)} and ${E2_n(E2_MUC[s.c-1]/3)} per pound, equal at the margin.`:`${s.t} teas and ${s.c} cakes give ${u} for £${spend}. The best mix gives ${E2_BEST.u}. Move a pound from the good with the lower satisfaction per pound at the margin to the one with the higher.`};
 },
 three(s,f,X,project){
  const P=project([[0,0,0],[6,6,4]]);let o=axes3(P,['tea','cake','satisfaction'],[6,6,4]);
  const z=(t,c)=>(E2_UT[t]+E2_UC[c])/96*4;
  for(let t=0;t<=6;t++)o+=`<polyline points="${range(7).map(c=>P([t,c,z(t,c)]).slice(0,2).map(fmt).join(',')).join(' ')}" fill="none" stroke="${C.line}" stroke-width="1.2"/>`;
  for(let c=0;c<=6;c++)o+=`<polyline points="${range(7).map(t=>P([t,c,z(t,c)]).slice(0,2).map(fmt).join(',')).join(' ')}" fill="none" stroke="${C.line}" stroke-width="1.2"/>`;
  // Budget line on the floor: 2t + 3c = 12.
  const b0=P([6,0,0]),b1=P([0,4,0]);o+=L(b0[0],b0[1],b1[0],b1[1],C.coral,2.4,'stroke-dasharray="6 4"');
  for(let t=0;t<=6;t++)for(let c=0;c<=6;c++)if(t*2+c*3<=12){const q=P([t,c,z(t,c)]);o+=Ci(q[0],q[1],3.2,C.blue)}
  const b=P([E2_BEST.t,E2_BEST.c,z(E2_BEST.t,E2_BEST.c)]),me=P([s.t,s.c,z(s.t,s.c)]);
  o+=Ci(b[0],b[1],7,'none',C.green)+Ci(me[0],me[1],5,C.coral,'#fff');
  return {svg:o,title:'Satisfaction over every mix',caption:'Height is total satisfaction for each number of teas and cakes. Blue points are affordable (inside the dashed budget line); the green ring is the best of them, the coral dot your choice.'};
 }});

/* ================================================================ supply-demand */
SCENE({id:'supply-demand',name:'Where supply meets demand',tag:'Marshall’s scissors',
 definition:'Demand shows how much buyers want at each price; supply shows how much sellers offer. At most prices one is bigger than the other: a shortage below the crossing, a surplus above it. Where the curves cross, the market clears.',
 example:'With demand P = 10 − 0.1Q and supply P = 2 + 0.06Q, the market clears at £5 and 50 units a day. At £4, buyers want 60 but sellers offer only 33: a shortage of 27.',
 desc:'A downward-sloping demand curve and an upward-sloping supply curve. A horizontal line at the chosen price meets each; the gap between them is the shortage or surplus.',
 research:'Cournot, A. A. (1838). Recherches sur les principes mathématiques de la théorie des richesses (first demand function). Jenkin, F. (1870). The graphic representation of the laws of supply and demand. Marshall, A. (1890). Principles of Economics (the “blades of the scissors”). Mary Paley Marshall co-wrote The Economics of Industry (1879).',
 dur:10,hint:'Move the price and watch the shortage or surplus. Shift demand or supply, and see where the new crossing is. “Nudge the price” moves the price a step towards clearing.',
 init:()=>({p:4,ds:0,ss:0}),
 watch(p){return {p:Number(lerp(8,5,smooth(Math.min(1,p*1.6))).toFixed(2)),ds:0,ss:0}},
 ui:[{range:'p',label:'Price',min:1,max:11,step:.25,get:s=>s.p,act:'p',show:v=>'£'+Number(v).toFixed(2)},
  {range:'ds',label:'Shift demand',min:-3,max:3,step:.5,get:s=>s.ds,act:'ds',show:v=>(v>0?'+':'')+v},
  {range:'ss',label:'Shift supply (up = dearer to make)',min:-3,max:3,step:.5,get:s=>s.ss,act:'ss',show:v=>(v>0?'+':'')+v},{b:'Nudge the price',act:'nudge'}],
 on:{p(s,v){s.p=Number(v);return 'keep'},ds(s,v){s.ds=Number(v);return 'keep'},ss(s,v){s.ss=Number(v);return 'keep'},
  nudge(s){const e=E2_eq(s.ds,s.ss).p;s.p=Math.round((s.p+(e-s.p)*.5)*4)/4;if(Math.abs(s.p-e)<.13)s.p=Number(e.toFixed(2));return 'keep'}},
 draw(s){
  const e=E2_eq(s.ds,s.ss),qd=E2_Qd(s.p,s.ds),qs=E2_Qs(s.p,s.ss),gap=qd-qs;let out=heading('Supply and demand',28);
  const pl=E2_mkt(70,58,330,234);out+=pl.svg;
  out+=E2_line(pl,q=>E2_D(q,s.ds),C.blue)+E2_line(pl,q=>E2_S(q,s.ss),C.coral);
  out+=TF(pl.X(8),pl.Y(E2_D(8,s.ds))-8,'demand',13,C.blue,'start')+TF(pl.X(92),pl.Y(Math.min(11.6,E2_S(92,s.ss)))-8,'supply',13,C.coral,'end');
  out+=L(pl.X(0),pl.Y(s.p),pl.X(100),pl.Y(s.p),C.ink,1.6,'stroke-dasharray="5 4"');
  const q1=Math.min(100,Math.min(qd,qs)),q2=Math.min(100,Math.max(qd,qs));
  if(Math.abs(gap)>.5)out+=L(pl.X(q1),pl.Y(s.p),pl.X(q2),pl.Y(s.p),gap>0?C.amber:C.purple,6,'opacity=".75"');
  out+=Ci(pl.X(e.q),pl.Y(e.p),6,C.green,'#fff');
  out+=counter(430,62,'buyers want',E2_n(Math.min(qd,999),0),C.blue,140)+counter(430,118,'sellers offer',E2_n(qs,0),C.coral,140);
  out+=counter(430,174,Math.abs(gap)<.5?'market clears':gap>0?'shortage':'surplus',Math.abs(gap)<.5?'✓':E2_n(Math.abs(gap),0),Math.abs(gap)<.5?C.green:gap>0?C.amber:C.purple,140);
  out+=TF(500,250,`clears at £${e.p.toFixed(2)}, ${E2_n(e.q,0)} a day`,13,C.green);
  return {svg:out,phase:Math.abs(gap)<.5?`At £${s.p.toFixed(2)} buyers want exactly what sellers offer: ${E2_n(e.q,0)} a day. Nothing pushes the price up or down.`:gap>0?`At £${s.p.toFixed(2)} buyers want ${E2_n(qd,0)} but sellers offer ${E2_n(qs,0)}: a shortage of ${E2_n(gap,0)}. Queues and bidding push the price up, towards £${e.p.toFixed(2)}.`:`At £${s.p.toFixed(2)} sellers offer ${E2_n(qs,0)} but buyers want only ${E2_n(qd,0)}: a surplus of ${E2_n(-gap,0)}. Unsold stock pushes the price down, towards £${e.p.toFixed(2)}.`};
 }});

const E2_EVENTS=[['harvest','A bad harvest',0,2,'Supply shifts up: each unit costs more to grow. Price rises, quantity falls.'],
 ['income','Incomes rise',2,0,'For a normal good, demand shifts out. Price and quantity both rise.'],
 ['tech','A cheaper way to make it',0,-2,'Supply shifts down: each unit is cheaper to make. Price falls, quantity rises.'],
 ['subst','A substitute gets cheaper',-2,0,'Some buyers switch to the substitute, so demand shifts in. Price and quantity both fall.'],
 ['both','Incomes rise and costs rise',2,2,'Both curves shift up. Price rises for sure; quantity barely changes here, because the two shifts pull it opposite ways.']];
SCENE({id:'supply-demand-shifts',name:'What moves a market',tag:'Shifts of demand and supply',
 definition:'A change in price moves along a curve. A change in anything else (incomes, tastes, costs, technology, the prices of related goods) shifts a whole curve, and the market moves to a new crossing point.',
 example:'A bad harvest shifts supply up: at every quantity, sellers need a higher price. Here the price rises from £5.00 to about £6.25 and the quantity falls from 50 to about 38.',
 desc:'The old demand and supply curves dashed, the new ones solid, with an arrow from the old crossing to the new one and the changes in price and quantity.',
 research:'Marshall, A. (1890). Principles of Economics, Book V (the distinction between changes in demand and movements along it). Working, E. J. (1927). What do statistical “demand curves” show? Quarterly Journal of Economics 41, 212–235 (why observed prices and quantities trace neither curve alone).',
 dur:12,hint:'Pick an event. Decide first which curve shifts and which way, then check the arrow.',
 init:()=>({ev:'harvest'}),
 watch(p){return {ev:E2_EVENTS[Math.min(4,Math.floor(p*5))][0]}},
 ui:[{choose:E2_EVENTS.map(e=>[e[0],e[1]]),label:'Event',get:s=>s.ev,act:'ev'}],
 on:{ev(s,v){s.ev=v;return 'keep'}},
 draw(s){
  const ev=E2_EVENTS.find(e=>e[0]===s.ev)||E2_EVENTS[0],[,name,ds,ss,why]=ev,e0=E2_eq(0,0),e1=E2_eq(ds,ss);let out=heading(name,28);
  const pl=E2_mkt(70,58,330,234);out+=pl.svg;
  out+=E2_line(pl,q=>E2_D(q),C.blue,1.8,'stroke-dasharray="6 5" opacity=".7"')+E2_line(pl,q=>E2_S(q),C.coral,1.8,'stroke-dasharray="6 5" opacity=".7"');
  out+=E2_line(pl,q=>E2_D(q,ds),C.blue,2.8)+E2_line(pl,q=>E2_S(q,ss),C.coral,2.8);
  out+=Ci(pl.X(e0.q),pl.Y(e0.p),5,'#fff',C.muted);
  if(Math.hypot(e1.q-e0.q,e1.p-e0.p)>.5)out+=arrow(pl.X(e0.q),pl.Y(e0.p),pl.X(e1.q),pl.Y(e1.p),C.green,2.6);
  out+=Ci(pl.X(e1.q),pl.Y(e1.p),6,C.green,'#fff');
  out+=TF(80,78,'dashed: before · solid: after',13,C.muted,'start');
  out+=counter(430,62,'price',`£${e0.p.toFixed(2)} → £${e1.p.toFixed(2)}`,C.ink,150)+counter(430,118,'quantity a day',`${E2_n(e0.q,0)} → ${E2_n(e1.q,0)}`,C.ink,150);
  out+=counter(430,174,'curve that shifts',ds&&ss?'both':ds?'demand':'supply',ds?C.blue:C.coral,150);
  return {svg:out,phase:why};
 }});

const E2_RENT={lines:['Covered tenants stayed put','more often; landlords cut','rental supply by about 15%.'],src:'Diamond, McQuade & Qian 2019'};
SCENE({id:'supply-demand-price-control',name:'Price ceilings and floors',tag:'When the price is not allowed to move',
 definition:'A legal maximum price below the market price (a ceiling) leaves buyers wanting more than sellers supply: a shortage. A legal minimum above it (a floor) leaves a surplus. In the simple model some trades that would benefit both sides never happen.',
 example:'With a ceiling of £4, sellers offer 33 a day but buyers want 60. The 17 lost trades between 33 and 50 units were each worth more to a buyer than they cost a seller.',
 desc:'The standard market with a ceiling or floor drawn across it, the shortage or surplus marked, and the lost gains from trade shaded as a triangle. A card summarises evidence from real markets.',
 research:'Marshall, A. (1890). Principles of Economics. Diamond, R., McQuade, T. & Qian, F. (2019). The effects of rent control expansion on tenants, landlords, and inequality: evidence from San Francisco. American Economic Review 109, 3365–3394. On minimum wages, contested: Card, D. & Krueger, A. B. (1994), American Economic Review 84, 772–793; Neumark, D. & Wascher, W. (2000); Cengiz, D. et al. (2019), Quarterly Journal of Economics 134, 1405–1454. Robinson, J. (1933). The Economics of Imperfect Competition (monopsony).',
 dur:12,hint:'Choose a ceiling or a floor and move it. A ceiling only matters below £5 and a floor only above it. Then read the evidence card: real markets are not always this simple.',
 init:()=>({kind:'ceiling',p:4}),
 watch(p){return p<.5?{kind:'ceiling',p:Number(lerp(5,3.5,smooth(p*2)).toFixed(2))}:{kind:'floor',p:Number(lerp(5,6.5,smooth((p-.5)*2)).toFixed(2))}},
 ui:[{choose:[['ceiling','Ceiling (maximum price)'],['floor','Floor (minimum price)']],label:'Rule',get:s=>s.kind,act:'kind'},
  {range:'p',label:'Legal price',min:2.5,max:7.5,step:.25,get:s=>s.p,act:'p',show:v=>'£'+Number(v).toFixed(2)}],
 on:{kind(s,v){s.kind=v;s.p=v==='ceiling'?4:6;return 'keep'},p(s,v){s.p=Number(v);return 'keep'}},
 draw(s){
  const e=E2_eq(),binds=s.kind==='ceiling'?s.p<e.p:s.p>e.p,price=binds?s.p:e.p;
  const qd=E2_Qd(price),qs=E2_Qs(price),traded=Math.min(qd,qs);let out=heading(s.kind==='ceiling'?'A maximum price':'A minimum price',28);
  const pl=E2_mkt(70,58,300,234);out+=pl.svg;
  if(binds){const tri=[[pl.X(traded),pl.Y(E2_D(traded))],[pl.X(traded),pl.Y(E2_S(traded))],[pl.X(e.q),pl.Y(e.p)]];out+=E2_area(tri,C.coralp)}
  out+=E2_line(pl,q=>E2_D(q),C.blue)+E2_line(pl,q=>E2_S(q),C.coral);
  out+=L(pl.X(0),pl.Y(s.p),pl.X(100),pl.Y(s.p),s.kind==='ceiling'?C.purple:C.amber,2.4)+TF(pl.X(100)-4,pl.Y(s.p)+(s.kind==='ceiling'?18:-8),s.kind+' £'+s.p.toFixed(2),13,s.kind==='ceiling'?C.purple:C.amber,'end');
  if(binds)out+=L(pl.X(Math.min(qd,qs)),pl.Y(s.p),pl.X(Math.max(qd,qs)),pl.Y(s.p),C.ink,5,'opacity=".35"');
  const dwl=binds?.5*(e.q-traded)*(E2_D(traded)-E2_S(traded)):0;
  out+=counter(392,62,'units traded',E2_n(traded,0),C.ink,92)+counter(492,62,binds?(qd>qs?'shortage':'surplus'):'no effect',binds?E2_n(Math.abs(qd-qs),0):'—',binds?C.coral:C.green,92);
  out+=counter(392,118,'gains from trade lost a day',E2_gbp(dwl),C.coral,192);
  // Evidence card.
  out+=R(384,180,202,118,'#fff',C.grid,8);
  if(s.kind==='ceiling'){out+=TBF(394,198,'Evidence: rent control',13,C.ink,'start');E2_RENT.lines.forEach((l,i)=>out+=TF(394,218+i*17,l,13,C.ink,'start'));out+=TF(394,289,E2_RENT.src,12,C.muted,'start')}
  else{out+=TBF(394,198,'Evidence: minimum wages',13,C.ink,'start');['Moderate rises: small or no','job losses in many studies;','others disagree. Debated.'].forEach((l,i)=>out+=TF(394,218+i*17,l,13,C.ink,'start'));out+=TF(394,289,'Card 1994; Cengiz et al. 2019',12,C.muted,'start')}
  return {svg:out,phase:!binds?`A ${s.kind} at £${s.p.toFixed(2)} does nothing here, because the market price (£5) is already ${s.kind==='ceiling'?'at or below':'at or above'} it.`:s.kind==='ceiling'?`At £${s.p.toFixed(2)} buyers want ${E2_n(qd,0)} but only ${E2_n(qs,0)} are offered. The shaded triangle (${E2_gbp(dwl)} a day) is trade that both sides would have welcomed. Real rent control also shifts who gets housed and for how long, which the simple model leaves out.`:`At £${s.p.toFixed(2)} sellers offer ${E2_n(qs,0)} but buyers take only ${E2_n(qd,0)}. In labour markets the simple picture is contested: where a few employers set wages (Robinson’s monopsony), a moderate minimum wage need not cut jobs.`};
 }});

/* ================================================================ elasticity */
const E2_ELQ=(p,e)=>50*Math.pow(p/5,-e);
SCENE({id:'elasticity',name:'How strongly buyers respond',tag:'Price elasticity of demand',
 definition:'Price elasticity of demand is the percentage change in quantity bought for each 1% change in price. Below 1 in size (inelastic), buyers barely respond; above 1 (elastic), they respond strongly.',
 example:'If a 10% price rise cuts sales by 3%, the elasticity is −0.3: inelastic, and the seller’s revenue rises. If it cuts sales by 18%, the elasticity is −1.8 and revenue falls.',
 desc:'Two demand curves through the same point (50 units at £5), one steep and one flat. A price change moves along both; bars compare the change in quantity and in revenue.',
 research:'Marshall, A. (1890). Principles of Economics, Book III, chapter IV (he named and defined elasticity of demand). The two curves are illustrative constant-elasticity curves.',
 dur:10,hint:'Change the price. The steep curve (elasticity −0.3) hardly moves; the flat one (−1.8) moves a lot. Watch what happens to revenue on each.',
 init:()=>({p:5.5}),
 watch(p){return {p:Number(lerp(4,6.5,smooth(p)).toFixed(2))}},
 ui:[{range:'p',label:'Price',min:3.5,max:7,step:.25,get:s=>s.p,act:'p',show:v=>'£'+Number(v).toFixed(2)}],
 on:{p(s,v){s.p=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Same price change, different responses',28);
  const pl=E2_plot(70,58,280,234,[0,120],[0,10],{xt:[[0,'0'],[50,'50'],[100,'100']],yt:[[0,'£0'],[5,'£5'],[10,'£10']],xl:'quantity',yl:'price'});
  out+=pl.svg;
  const curve=(e,col)=>E2_poly(range(61).map(i=>{const p=2+i*.13;return [E2_ELQ(p,e),p]}).filter(v=>v[0]<=120).map(v=>[pl.X(v[0]),pl.Y(v[1])]),col,2.6);
  out+=curve(.3,C.blue)+curve(1.8,C.coral);
  const qa=E2_ELQ(s.p,.3),qb=E2_ELQ(s.p,1.8);
  out+=L(pl.X(0),pl.Y(s.p),pl.X(120),pl.Y(s.p),C.ink,1.4,'stroke-dasharray="5 4"')+Ci(pl.X(50),pl.Y(5),5,'#fff',C.muted);
  out+=Ci(pl.X(Math.min(120,qa)),pl.Y(s.p),6,C.blue,'#fff')+Ci(pl.X(Math.min(120,qb)),pl.Y(s.p),6,C.coral,'#fff');
  out+=TF(pl.X(56),pl.Y(9.4),'steep: −0.3',13,C.blue,'start')+TF(pl.X(70),pl.Y(1.4),'flat: −1.8',13,C.coral,'start');
  const dp=(s.p/5-1)*100,da=(qa/50-1)*100,db=(qb/50-1)*100,ra=(s.p*qa/250-1)*100,rb=(s.p*qb/250-1)*100;
  out+=TF(370,72,`price change: ${dp>=0?'+':''}${E2_n(dp,0)}%`,14,C.ink,'start');
  const bars=[['quantity, steep',da,C.blue],['quantity, flat',db,C.coral],['revenue, steep',ra,C.blue],['revenue, flat',rb,C.coral]];
  bars.forEach(([l,v,col],i)=>{const y=96+i*48,x0=480,w=Math.max(-90,Math.min(90,v*1.6));out+=TF(372,y+14,l,13,C.muted,'start')+L(x0,y+2,x0,y+26,C.line,1)+R(w<0?x0+w:x0,y+6,Math.abs(w),16,col,'none',3)+TF(x0+(w<0?w-4:w+4),y+19,(v>=0?'+':'')+E2_n(v,0)+'%',13,col,w<0?'end':'start')});
  return {svg:out,phase:Math.abs(dp)<.5?`At £5 both curves sell 50. Move the price to see the difference.`:`A ${E2_n(Math.abs(dp),0)}% price ${dp>0?'rise':'cut'} changes sales by ${E2_n(da,0)}% on the steep curve but ${E2_n(db,0)}% on the flat one. Revenue ${ra>0?'rises':'falls'} on the steep (inelastic) curve and ${rb>0?'rises':'falls'} on the flat (elastic) one.`};
 }});

SCENE({id:'elasticity-revenue',name:'Revenue and the middle of the line',tag:'Elastic above, inelastic below',
 definition:'Along a straight demand line, elasticity is not constant. Near the top, a small price cut wins many buyers (elastic); near the bottom, it wins few (inelastic). Revenue, price × quantity, is highest exactly halfway, where elasticity is −1.',
 example:'On demand P = 10 − 0.1Q, revenue is highest at £5 and 50 units (£250). At £8 it is £160; at £2 it is also £160.',
 desc:'The demand line with the revenue rectangle under the chosen price, and beside it the revenue hump against price, with the elastic and inelastic halves labelled.',
 research:'Marshall, A. (1890). Principles of Economics, Book III, mathematical note on elasticity. Cournot, A. A. (1838) (the revenue-maximising price for a seller with no costs).',
 dur:10,hint:'Slide the price. The rectangle’s area is revenue. It grows as you cut the price from the top, peaks at £5, then shrinks.',
 init:()=>({p:7}),
 watch(p){return {p:Number(lerp(9,1,p).toFixed(2))}},
 ui:[{range:'p',label:'Price',min:.5,max:9.5,step:.25,get:s=>s.p,act:'p',show:v=>'£'+Number(v).toFixed(2)}],
 on:{p(s,v){s.p=Number(v);return 'keep'}},
 draw(s){
  const q=E2_Qd(s.p),rev=s.p*q,el=-s.p/(10-s.p);let out=heading('Where revenue is highest',28);
  const pl=E2_plot(66,58,270,234,[0,100],[0,10],{xt:[[0,'0'],[50,'50'],[100,'100']],yt:[[0,'£0'],[5,'£5'],[10,'£10']],xl:'quantity',yl:'price'});
  out+=pl.svg+R(pl.X(0),pl.Y(s.p),pl.X(q)-pl.X(0),pl.Y(0)-pl.Y(s.p),C.greenp,'none',0)+E2_line(pl,v=>E2_D(v),C.blue,2.8);
  out+=TF(pl.X(18),pl.Y(9.2),'elastic',13,C.coral,'start')+TF(pl.X(60),pl.Y(1.2),'inelastic',13,C.purple,'start');
  out+=Ci(pl.X(q),pl.Y(s.p),6,C.blue,'#fff');
  const g=E2_plot(390,58,180,150,[0,10],[0,260],{xt:[[0,'£0'],[5,'£5'],[10,'£10']],yt:[[0,'0'],[250,'£250']],xl:'price',xlDy:31,yl:'revenue'});
  out+=g.svg+E2_poly(range(41).map(i=>{const p=i/4;return [g.X(p),g.Y(p*E2_Qd(p))]}),C.green,2.6)+Ci(g.X(s.p),g.Y(rev),5,C.green,'#fff');
  out+=counter(390,262,'revenue',E2_gbp(rev),C.green,86)+counter(482,262,'elasticity',E2_n(el,2),Math.abs(el)>1?C.coral:C.purple,92);
  return {svg:out,phase:Math.abs(el+1)<.05?`At £${s.p.toFixed(2)} the elasticity is −1: a 1% price cut wins exactly 1% more buyers, so revenue is at its peak, ${E2_gbp(rev)}.`:Math.abs(el)>1?`At £${s.p.toFixed(2)} demand is elastic (${E2_n(el,2)}): cutting the price wins proportionally more buyers, so revenue would rise.`:`At £${s.p.toFixed(2)} demand is inelastic (${E2_n(el,2)}): cutting the price wins proportionally fewer buyers, so revenue would fall. Raising it would increase revenue.`};
 }});

const E2_GOODS=[['eggs','Eggs',-.27,'Andreyeva et al. 2010'],['petrolS','Petrol, first year',-.26,'Espey 1998'],['cigs','Cigarettes',-.48,'Gallet & List 2003'],['petrolL','Petrol, long run',-.58,'Espey 1998'],['soft','Soft drinks',-.79,'Andreyeva et al. 2010'],['eatout','Eating out',-.81,'Andreyeva et al. 2010']];
SCENE({id:'elasticity-examples',name:'Elasticities in real markets',tag:'What a 10% tax does',
 definition:'Elasticities are estimated from data, with wide ranges between studies. Necessities and habits respond little to price; goods with close substitutes respond more; most goods respond more in the long run, when people have time to change habits.',
 example:'Studies of petrol find an average of about −0.26 in the first year but about −0.58 in the long run: people buy smaller cars and move house only slowly.',
 desc:'Bars for average estimated price elasticities of six goods from published reviews, and for the chosen good, what a 10% price rise would do to the quantity bought.',
 research:'Espey, M. (1998). Gasoline demand revisited: an international meta-analysis of elasticities. Energy Economics 20, 273–295. Gallet, C. A. & List, J. A. (2003). Cigarette demand: a meta-analysis of elasticities. Health Economics 12, 821–835. Andreyeva, T., Long, M. W. & Brownell, K. D. (2010). The impact of food prices on consumption: a systematic review of research on the price elasticity of demand for food. American Journal of Public Health 100, 216–222. Values are review averages, rounded; individual studies vary widely.',
 dur:12,hint:'Pick a good. Every bar is a review average from many studies; real estimates spread widely around it.',
 init:()=>({g:'cigs'}),
 watch(p){return {g:E2_GOODS[Math.min(5,Math.floor(p*6))][0]}},
 ui:[{choose:E2_GOODS.map(g=>[g[0],g[1]]),label:'Good',get:s=>s.g,act:'g'}],
 on:{g(s,v){s.g=v;return 'keep'}},
 draw(s,f,X){
  const g=E2_GOODS.find(x=>x[0]===s.g)||E2_GOODS[2];let out=heading('Average estimated price elasticities',28);
  E2_GOODS.forEach(([k,name,e],i)=>{const y=58+i*38,w=Math.abs(e)*300,sel=k===s.g;
   out+=hit(X,'g',k,name,R(30,y,540,32,sel?C.pale:'#fff',sel?C.blue:C.grid,6))+TF(40,y+21,name,13,C.ink,'start')+R(200,y+8,w,16,sel?C.blue:C.line,'none',3)+TF(206+w,y+21,E2_n(e,2),13,sel?C.blue:C.muted,'start')});
  out+=L(200,52,200,290,C.ink,1)+L(500,52,500,290,C.coral,1.2,'stroke-dasharray="4 4"')+TF(500,306,'−1: unit elastic',13,C.coral);
  const dq=(Math.pow(1.1,g[2])-1)*100;
  out+=TF(30,334,`A 10% price rise on ${g[1].toLowerCase()} would cut the quantity bought by about ${E2_n(-dq,1)}%.`,14,C.ink,'start')+TF(30,354,'Source: '+g[3]+'. Review average; single studies vary widely.',13,C.muted,'start');
  return {svg:out,phase:`${g[1]}: about ${E2_n(g[2],2)} on average, so demand is inelastic and a tax raises revenue while cutting use only a little. Inelastic demand is why governments tax tobacco and fuel: the tax brings in money, though it changes behaviour less than its supporters sometimes hope.`};
 }});

/* ================================================================ consumer-surplus */
SCENE({id:'consumer-surplus',name:'Gains from trade',tag:'Consumer and producer surplus',
 definition:'Consumer surplus is what buyers would have been willing to pay minus what they actually pay; producer surplus is what sellers receive minus their costs. Added up, they measure the gains from trade, and in a simple competitive market they are largest at the market-clearing quantity.',
 example:'At £5 and 50 units, buyers gain £125 a day (the triangle above the price) and sellers £75 (the triangle below): £200 in all. Trading a 60th unit would cost more to make than anyone would pay for it.',
 desc:'The standard market with the trades made so far shaded: consumer surplus above the price, producer surplus below it, and any trades beyond 50 units shaded red as losses.',
 research:'Dupuit, J. (1844). De la mesure de l’utilité des travaux publics. Annales des ponts et chaussées (the first surplus measure, for bridges). Marshall, A. (1890). Principles of Economics, Book III, chapter VI (consumer’s surplus).',
 dur:10,hint:'Slide the number of units traded. Each unit adds the gap between what a buyer would pay and what it costs to make, until the 50th; after that each unit is a loss.',
 init:()=>({q:30}),
 watch(p){return {q:Math.round(lerp(0,70,p))}},
 ui:[{range:'q',label:'Units traded a day',min:0,max:80,step:1,get:s=>s.q,act:'q'}],
 on:{q(s,v){s.q=Number(v);return 'keep'}},
 draw(s){
  const p=5,qa=Math.min(s.q,50);let out=heading('Who gains from trade, and how much',28);
  const pl=E2_mkt(70,58,320,234);out+=pl.svg;
  if(qa>0){out+=E2_area([[pl.X(0),pl.Y(10)],[pl.X(qa),pl.Y(E2_D(qa))],[pl.X(qa),pl.Y(p)],[pl.X(0),pl.Y(p)]],C.pale)+E2_area([[pl.X(0),pl.Y(p)],[pl.X(qa),pl.Y(p)],[pl.X(qa),pl.Y(E2_S(qa))],[pl.X(0),pl.Y(2)]],C.coralp)}
  if(s.q>50)out+=E2_area([[pl.X(50),pl.Y(5)],[pl.X(s.q),pl.Y(E2_S(s.q))],[pl.X(s.q),pl.Y(E2_D(s.q))]],'#f3b8a8');
  out+=E2_line(pl,q=>E2_D(q),C.blue)+E2_line(pl,q=>E2_S(q),C.coral)+L(pl.X(0),pl.Y(p),pl.X(100),pl.Y(p),C.ink,1.2,'stroke-dasharray="5 4"');
  out+=L(pl.X(s.q),pl.Y(0),pl.X(s.q),pl.Y(11.5),C.ink,1.6);
  const cs=qa*(10-p)-.05*qa*qa,ps=qa*(p-2)-.03*qa*qa,loss=s.q>50?.5*(s.q-50)*(E2_S(s.q)-E2_D(s.q)):0;
  out+=counter(410,62,'buyers’ surplus',E2_gbp(cs),C.blue,160)+counter(410,118,'sellers’ surplus',E2_gbp(ps),C.coral,160)+counter(410,174,'losses past 50',loss?'−'+E2_gbp(loss):'£0',C.coral,160)+counter(410,230,'total gains',E2_gbp(cs+ps-loss),C.green,160);
  return {svg:out,phase:s.q<50?`${s.q} units traded so far give £${E2_n(cs+ps-loss,0)} of gains. Every extra unit up to 50 is worth more to a buyer than it costs to make, so there are gains left on the table.`:s.q===50?`At 50 units the gains are as large as they can be: £200, shared £125 to buyers and £75 to sellers.`:`Past 50 units each extra unit costs more to make than any buyer would pay. The red triangle (${E2_gbp(loss)}) is a loss, so total gains fall.`};
 }});

const E2_WTP=[9,8.5,8,7,6,5,4,3,2.5,1];
SCENE({id:'consumer-surplus-buyers',name:'Ten buyers and you',tag:'Willingness to pay',
 definition:'Each buyer has a highest price they would pay, their willingness to pay. Line buyers up from highest to lowest and you get a staircase demand curve. At any price, everyone above it buys, and each gains the difference.',
 example:'If concert tickets cost £5, the six people willing to pay £5 or more buy. Someone who would have paid £9 gains £4.',
 desc:'A staircase of eleven bars, one per buyer including you, sorted by willingness to pay, with the price line across them. Bars above the line are buyers; the part above the line is each one’s surplus.',
 research:'Marshall, A. (1890). Principles of Economics, Book III, chapter VI. Becker, G. M., DeGroot, M. H. & Marschak, J. (1964). Measuring utility by a single-response sequential method. Behavioral Science 9, 226–232 (a way to measure willingness to pay honestly). The other ten buyers are illustrative.',
 dur:10,hint:'Set your own highest price for a concert ticket, then move the ticket price. Your answer stays on this page.',
 init:()=>({p:5,me:6.5}),
 watch(p){return {p:Number(lerp(9.5,1,p).toFixed(1)),me:6.5}},
 ui:[{range:'me',label:'Your highest price for a ticket',min:0,max:10,step:.5,get:s=>s.me,act:'me',show:v=>'£'+Number(v).toFixed(2)},{range:'p',label:'Ticket price',min:.5,max:10,step:.5,get:s=>s.p,act:'p',show:v=>'£'+Number(v).toFixed(2)}],
 on:{me(s,v){s.me=Number(v);return 'keep'},p(s,v){s.p=Number(v);return 'keep'}},
 draw(s){
  const all=E2_WTP.map(v=>({v,me:false})).concat([{v:s.me,me:true}]).sort((a,b)=>b.v-a.v);let out=heading('A staircase of buyers',28);
  const pl=E2_plot(66,58,360,234,[0,11],[0,10],{yt:[[0,'£0'],[5,'£5'],[10,'£10']],xl:'buyers, highest price first',yl:'willing to pay'});
  out+=pl.svg;let n=0,sur=0;
  all.forEach((b,i)=>{const x=pl.X(i)+3,w=pl.X(1)-pl.X(0)-6,buys=b.v>=s.p;if(buys){n++;sur+=b.v-s.p}
   out+=R(x,pl.Y(b.v),w,pl.Y(0)-pl.Y(b.v),b.me?(buys?C.green:C.greenp):(buys?C.blue:C.pale),'none',3);
   if(buys&&b.v>s.p)out+=R(x,pl.Y(b.v),w,pl.Y(s.p)-pl.Y(b.v),'#ffffff','none',0,'opacity=".45"');
   if(b.me)out+=TF(x+w/2,pl.Y(b.v)-6,'you',13,C.green)});
  out+=L(pl.X(0),pl.Y(s.p),pl.X(11),pl.Y(s.p),C.coral,2.4)+TF(pl.X(11)-4,pl.Y(s.p)-7,'price £'+s.p.toFixed(2),13,C.coral,'end');
  const meBuys=s.me>=s.p;
  out+=counter(446,62,'tickets sold',String(n),C.blue,124)+counter(446,118,'buyers’ surplus',E2_gbp(sur),C.blue,124)+counter(446,174,'your surplus',meBuys?E2_gbp(s.me-s.p):'no ticket',C.green,124)+counter(446,230,'revenue',E2_gbp(n*s.p),C.ink,124);
  return {svg:out,phase:meBuys?`At £${s.p.toFixed(2)} you buy, and gain ${E2_gbp(s.me-s.p)}: the ticket was worth £${s.me.toFixed(2)} to you. ${n} tickets are sold; buyers gain ${E2_gbp(sur)} in all.`:`At £${s.p.toFixed(2)} you would not buy: the ticket is worth only £${s.me.toFixed(2)} to you. ${n} others buy.`};
 }});

SCENE({id:'consumer-surplus-tax',name:'Who really pays a tax',tag:'Tax incidence and deadweight loss',
 definition:'A tax on each unit drives a wedge between what buyers pay and what sellers keep. Who bears it does not depend on who hands it to the government: the side that responds less to price bears more. Trades lost to the tax are a deadweight loss, a cost on top of the revenue raised.',
 example:'A £2 tax in the standard market raises the buyers’ price to £6.25 and cuts the sellers’ price to £4.25: buyers bear £1.25 of it, sellers £0.75. Revenue is £75 a day and the deadweight loss is £12.50.',
 desc:'The standard market with a tax wedge between the two curves, the revenue rectangle, and the lost-trade triangle. A switch makes demand much less responsive.',
 research:'Dupuit, J. (1844) (the loss from a tax grows with the square of the tax). Marshall, A. (1890). Principles of Economics. Harberger, A. C. (1964). The measurement of waste. American Economic Review 54, 58–76 (“Harberger triangles”).',
 dur:12,hint:'Move the tax and switch demand between normal and unresponsive. With unresponsive demand, buyers bear most of the tax and fewer trades are lost.',
 init:()=>({t:2,steep:false}),
 watch(p){return {t:Number(lerp(0,4,smooth(p<.6?p/.6:1)).toFixed(2)),steep:p>=.6}},
 ui:[{range:'t',label:'Tax per unit',min:0,max:4,step:.25,get:s=>s.t,act:'t',show:v=>'£'+Number(v).toFixed(2)},{choose:[['n','Normal demand'],['s','Unresponsive demand']],label:'Demand',get:s=>s.steep?'s':'n',act:'steep'}],
 on:{t(s,v){s.t=Number(v);return 'keep'},steep(s,v){s.steep=v==='s';return 'keep'}},
 draw(s){
  const b=s.steep?.25:.1,a=5+50*b,Dm=q=>a-b*q,Sm=q=>2+.06*q,q=(a-2-s.t)/(b+.06),pb=Dm(q),ps=Sm(q),rev=s.t*q,dwl=.5*s.t*(50-q),bshare=(pb-5)/(s.t||1);
  let out=heading('A tax of £'+s.t.toFixed(2)+' a unit',28);
  const pl=E2_mkt(70,58,300,234);out+=pl.svg;
  if(s.t>0){out+=R(pl.X(0),pl.Y(pb),pl.X(q)-pl.X(0),pl.Y(ps)-pl.Y(pb),C.amberp,'none',0)+E2_area([[pl.X(q),pl.Y(pb)],[pl.X(q),pl.Y(ps)],[pl.X(50),pl.Y(5)]],'#f3b8a8')}
  out+=E2_line(pl,Dm,C.blue)+E2_line(pl,Sm,C.coral)+L(pl.X(0),pl.Y(5),pl.X(50),pl.Y(5),C.muted,1.2,'stroke-dasharray="4 4"');
  if(s.t>0)out+=L(pl.X(q),pl.Y(pb),pl.X(q),pl.Y(ps),C.ink,2.4)+TF(pl.X(q),pl.Y(pb)-8,'tax',13,C.ink);
  out+=counter(392,62,'buyers pay',E2_gbp(pb),C.blue,92)+counter(492,62,'sellers keep',E2_gbp(ps),C.coral,92);
  out+=counter(392,118,'tax revenue a day',E2_gbp(rev),C.amber,192)+counter(392,174,'deadweight loss a day',E2_gbp(dwl),C.coral,192);
  out+=counter(392,230,'share borne by buyers',s.t?E2_n(bshare*100,0)+'%':'—',C.blue,192);
  return {svg:out,phase:s.t===0?'With no tax, buyers pay and sellers receive £5.':`Buyers pay ${E2_gbp(pb)} and sellers keep ${E2_gbp(ps)}, so buyers bear ${E2_n(bshare*100,0)}% of the tax. The government collects ${E2_gbp(rev)} a day; the red triangle, ${E2_gbp(dwl)}, is trade that no longer happens. ${s.steep?'Unresponsive buyers cannot easily avoid the tax, so they bear most of it.':'Double the tax and the triangle roughly quadruples.'}`};
 }});

/* ================================================================ general-equilibrium */
// Two traders, two goods (apples and bread; bread is the unit of account). Cobb–Douglas preferences.
// A owns 8 apples and 2 loaves and spends 60% on apples; B owns 2 apples and 8 loaves and spends 30% on apples.
const E2_zA=p=>3.6/p-4.6, E2_PSTAR=3.6/4.6;
const E2_tat=(p0,k,n)=>{const out=[p0];let p=p0;for(let i=0;i<n;i++){p=Math.max(.15,Math.min(3,p+k*E2_zA(p)));out.push(p)}return out};
SCENE({id:'general-equilibrium',name:'Walras’s auctioneer',tag:'Every market clearing at once',
 definition:'Markets are linked: the price of one good changes what people can afford of every other. Walras imagined an auctioneer who calls out prices, hears how much everyone wants, and raises the price of anything in excess demand until every market clears at once. A key fact, Walras’s law: if all but one market clear, the last one clears too.',
 example:'Two traders swap apples for bread. At 0.50 loaves an apple, they want 2.6 more apples than exist; at about 0.78 loaves, both markets clear.',
 desc:'Two traders’ wants of apples and bread at the price called, as bars against what exists, and the history of prices called so far.',
 research:'Walras, L. (1874). Éléments d’économie politique pure. Arrow, K. J. & Debreu, G. (1954). Existence of an equilibrium for a competitive economy. Econometrica 22, 265–290. The auctioneer is a thought experiment: no real market works this way.',
 dur:12,hint:'Call a price for apples (in loaves), or let the auctioneer adjust it step by step. Watch both markets: when apples clear, bread clears too.',
 init:()=>({p:.5,hist:[.5]}),
 watch(p){const h=E2_tat(.4,.06,Math.round(p*12));return {p:h[h.length-1],hist:h}},
 ui:[{range:'p',label:'Price of an apple (loaves)',min:.3,max:2,step:.02,get:s=>s.p,act:'p',show:v=>Number(v).toFixed(2)},{b:'Auctioneer adjusts',act:'step'}],
 on:{p(s,v){s.p=Number(v);s.hist=[s.p];return 'keep'},step(s){s.p=Math.max(.15,Math.min(3,s.p+.06*E2_zA(s.p)));s.hist=(s.hist||[]).concat([s.p]).slice(-14);return 'keep'}},
 draw(s){
  const p=s.p,dA=.6*(8*p+2)/p,dB=.3*(2*p+8)/p,bA=.4*(8*p+2),bB=.7*(2*p+8),za=dA+dB-10,zb=bA+bB-10;let out=heading('Calling prices until everything clears',28);
  const bar=(x,label,a,b,ex)=>{let o=TF(x+60,78,label,14,C.ink);const sc=13;o+=R(x+10,290-a*sc,44,a*sc,C.blue,'none',3)+R(x+10,290-(a+b)*sc,44,b*sc,C.purple,'none',3);
   o+=R(x+66,290-10*sc,44,10*sc,C.pale,'none',3)+TF(x+32,306,'wanted',13,C.muted)+TF(x+88,306,'exists',13,C.muted)+TF(x+60,326,Math.abs(ex)<.05?'clears ✓':(ex>0?'short by ':'spare ')+E2_n(Math.abs(ex),1),13,Math.abs(ex)<.05?C.green:C.coral);return o};
  out+=L(30,290,330,290,C.line,1)+bar(30,'Apples',Math.min(14,dA),Math.min(14,dB),za)+bar(180,'Bread',Math.min(14,bA),Math.min(14,bB),zb);
  out+=TF(36,104,'blue: trader A',13,C.blue,'start')+TF(36,122,'purple: trader B',13,C.purple,'start');
  const g=E2_plot(380,70,190,150,[0,13],[0,2],{xt:[[0,'0'],[12,'12']],yt:[[0,'0'],[1,'1'],[2,'2']],xl:'call number',xlDy:31,yl:'price called'});
  out+=g.svg+L(g.X(0),g.Y(E2_PSTAR),g.X(13),g.Y(E2_PSTAR),C.green,1.3,'stroke-dasharray="5 4"');
  const h=(s.hist&&s.hist.length?s.hist:[p]).slice(-14);out+=E2_poly(h.map((v,i)=>[g.X(i),g.Y(Math.min(2,v))]),C.ink,2)+h.map((v,i)=>Ci(g.X(i),g.Y(Math.min(2,v)),3.5,C.ink)).join('');
  out+=TF(475,272,'price × apple gap',13,C.muted)+TF(475,290,'+ bread gap = '+E2_n(p*za+zb,2),13,C.muted);
  return {svg:out,phase:Math.abs(za)<.05?`At ${p.toFixed(2)} loaves an apple, both markets clear at once. That is a general equilibrium (about 0.78 here).`:`At ${p.toFixed(2)} loaves an apple, apples are ${za>0?'short':'in surplus'} by ${E2_n(Math.abs(za),1)} and bread is ${zb>0?'short':'in surplus'} by ${E2_n(Math.abs(zb),1)}. Walras’s law: the value of one market’s gap always balances the other’s, so raising the apple price ${za>0?'helps both':'is the wrong way'}.`};
 }});

// Edgeworth box: A's utility x^0.6 y^0.4, B's x^0.3 y^0.7, 10 apples and 10 loaves in total.
const E2_uA=(x,y)=>Math.pow(Math.max(1e-6,x),.6)*Math.pow(Math.max(1e-6,y),.4),E2_uB=(x,y)=>Math.pow(Math.max(1e-6,x),.3)*Math.pow(Math.max(1e-6,y),.7);
const E2_cc=x=>(30/7)*x/(15-1.5*x+(3/7)*x);
SCENE({id:'general-equilibrium-edgeworth',name:'The Edgeworth box',tag:'Trades that help both sides',
 definition:'An Edgeworth box shows every way of dividing two goods between two people. From where they start, the trades that make both better off lie inside a lens between their indifference curves. Allocations where no one can gain without the other losing are Pareto efficient; they form the contract curve.',
 example:'A starts with 8 apples and 2 loaves, B with 2 apples and 8 loaves. If A gives 1.75 apples for 1.25 loaves, both end up better off and the result sits on the contract curve.',
 desc:'A square box: A’s holdings measured from the bottom-left, B’s from the top-right. The starting point, both indifference curves through it forming a lens, the contract curve, and the allocation after the chosen trade.',
 research:'Edgeworth, F. Y. (1881). Mathematical Psychics. Pareto, V. (1906). Manuale di economia politica. Bowley, A. L. (1924) (the box drawn in its familiar form). Preferences are illustrative.',
 dur:12,hint:'Choose how many apples A gives and how many loaves A gets back. Trades inside the lens make both better off; the best end on the green contract curve.',
 init:()=>({ga:1,gb:1}),
 watch(p){return {ga:Math.round(lerp(0,1.75,smooth(p))*4)/4,gb:Math.round(lerp(0,1.25,smooth(p))*4)/4}},
 ui:[{range:'ga',label:'Apples A gives B',min:0,max:6,step:.25,get:s=>s.ga,act:'ga'},{range:'gb',label:'Loaves B gives A',min:0,max:6,step:.25,get:s=>s.gb,act:'gb'}],
 on:{ga(s,v){s.ga=Number(v);return 'keep'},gb(s,v){s.gb=Number(v);return 'keep'}},
 draw(s){
  const x0=70,y0=56,W=250,H=250,X=v=>x0+v/10*W,Y=v=>y0+H-v/10*H;let out=heading('Dividing 10 apples and 10 loaves',28);
  out+=R(x0,y0,W,H,'#fff',C.ink,0);
  out+=TF(x0,y0+H+18,'A',14,C.blue,'middle','font-weight="700"')+TF(x0+W,y0-6,'B',14,C.purple,'middle','font-weight="700"');
  out+=TF(x0+W/2,y0+H+18,'apples (A from left)',13,C.muted)+TF(x0-8,y0+H/2,'loaves',13,C.muted,'end');
  const ex=8,ey=2,uA0=E2_uA(ex,ey),uB0=E2_uB(10-ex,10-ey);
  const icA=u=>range(81).map(i=>{const x=.5+i*.11875;const y=Math.pow(u/Math.pow(x,.6),1/.4);return [x,y]}).filter(v=>v[1]<=10&&v[1]>=0);
  const icB=u=>range(81).map(i=>{const xb=.5+i*.11875;const yb=Math.pow(u/Math.pow(xb,.3),1/.7);return [10-xb,10-yb]}).filter(v=>v[1]>=0&&v[1]<=10);
  out+=E2_poly(icA(uA0).map(v=>[X(v[0]),Y(v[1])]),C.blue,1.8)+E2_poly(icB(uB0).map(v=>[X(v[0]),Y(v[1])]),C.purple,1.8);
  out+=E2_poly(range(51).map(i=>{const x=i/5;return [X(x),Y(E2_cc(x))]}),C.green,2.4,'stroke-dasharray="7 4"');
  const nx=ex-s.ga,ny=ey+s.gb,ok=nx>=0&&ny<=10,uA=E2_uA(nx,ny),uB=E2_uB(10-nx,10-ny),gA=uA>uA0+1e-9,gB=uB>uB0+1e-9;
  out+=Ci(X(ex),Y(ey),5,'#fff',C.ink);
  if(ok){out+=arrow(X(ex),Y(ey),X(nx),Y(ny),C.coral,2.2);out+=Ci(X(nx),Y(ny),6,gA&&gB?C.green:C.coral,'#fff')}
  out+=TF(X(ex)+8,Y(ey)+18,'start',13,C.ink,'start')+TF(X(1.4),Y(E2_cc(1.4))-8,'contract curve',13,C.green,'start');
  const pct=(u,u0)=>(u/u0-1)*100;
  out+=counter(350,62,'A now has',`${E2_n(nx)} apples, ${E2_n(ny)} loaves`,C.blue,230)+counter(350,118,'B now has',`${E2_n(10-nx)} apples, ${E2_n(10-ny)} loaves`,C.purple,230);
  out+=counter(350,174,'A’s satisfaction',(pct(uA,uA0)>=0?'+':'')+E2_n(pct(uA,uA0),0)+'%',gA?C.green:C.coral,112)+counter(468,174,'B’s satisfaction',(pct(uB,uB0)>=0?'+':'')+E2_n(pct(uB,uB0),0)+'%',gB?C.green:C.coral,112);
  const dist=Math.abs(ny-E2_cc(nx));
  out+=TF(465,256,gA&&gB?(dist<.3?'both better off, and efficient':'both better off'):'someone loses',14,gA&&gB?C.green:C.coral);
  return {svg:out,phase:gA&&gB?(dist<.3?`Both gain, and this allocation sits on the contract curve: no further trade could help one without hurting the other. That is Pareto efficiency, which says nothing about whether the split is fair.`:`Both gain from this trade, so it lies inside the lens. It is not yet on the contract curve, so a further trade could help both again.`):(!gA&&!gB?'This trade leaves both worse off than at the start, so neither would agree to it.':`This trade leaves ${!gA?'A':'B'} worse off than at the start, so ${!gA?'A':'B'} would not agree to it voluntarily.`)};
 }});

SCENE({id:'general-equilibrium-stability',name:'Can prices find their way?',tag:'Stability of tâtonnement',
 definition:'Proving that an equilibrium exists is not the same as showing that markets reach it. If the auctioneer reacts too strongly to excess demand, prices overshoot and swing back and forth; in some examples they cycle for ever, however gently they adjust.',
 example:'In the apple market here, adjusting by 0.06 per unit of excess demand settles smoothly; at 0.30 it swings back and forth; above about 0.34 the swings never die away.',
 desc:'Prices called round after round from the same start, for the chosen adjustment speed, against the equilibrium price.',
 research:'Walras, L. (1874). Éléments. Scarf, H. (1960). Some examples of global instability of the competitive equilibrium. International Economic Review 1, 157–172. Sonnenschein, H. (1973), Mantel, R. (1974), Debreu, G. (1974): aggregate excess demand can have almost any shape. The speeds here are an illustration with the two-trader economy, not Scarf’s three-good example.',
 dur:10,hint:'Change how strongly the auctioneer reacts. Small steps creep to the equilibrium; large ones overshoot. Scarf showed that with three goods, prices can circle for ever even with small steps.',
 init:()=>({k:.3}),
 watch(p){return {k:Number(lerp(.05,.4,p).toFixed(2))}},
 ui:[{range:'k',label:'Adjustment speed',min:.02,max:.45,step:.01,get:s=>s.k,act:'k',show:v=>Number(v).toFixed(2)}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const h=E2_tat(.4,s.k,24);let out=heading('Prices called, round by round',28);
  const pl=E2_plot(70,58,480,220,[0,24],[0,2],{xt:[[0,'0'],[6,'6'],[12,'12'],[18,'18'],[24,'24']],yt:[[0,'0'],[.5,'0.5'],[1,'1'],[1.5,'1.5'],[2,'2']],xl:'round',yl:'price of an apple (loaves)'});
  out+=pl.svg+L(pl.X(0),pl.Y(E2_PSTAR),pl.X(24),pl.Y(E2_PSTAR),C.green,1.4,'stroke-dasharray="6 4"')+TF(pl.X(24)-4,pl.Y(E2_PSTAR)-6,'equilibrium 0.78',13,C.green,'end');
  out+=E2_poly(h.map((v,i)=>[pl.X(i),pl.Y(Math.min(2,v))]),C.blue,2.4)+h.map((v,i)=>Ci(pl.X(i),pl.Y(Math.min(2,v)),3,C.blue)).join('');
  const last=h.slice(-4),swing=Math.max(...last)-Math.min(...last),gain=s.k*3.6/(E2_PSTAR*E2_PSTAR);
  const verdict=gain<1?'settles smoothly':gain<2?'overshoots, then settles':'keeps swinging';
  out+=TF(300,336,`speed ${s.k.toFixed(2)}: ${verdict}`,15,gain<1?C.green:gain<2?C.amber:C.coral);
  return {svg:out,phase:gain<1?`At speed ${s.k.toFixed(2)} the price ${h[1]>E2_PSTAR?'jumps past 0.78 on the first step and then eases back down to it':'creeps up to 0.78'}: near the equilibrium each step closes part of the gap.`:gain<2?`At speed ${s.k.toFixed(2)} each step overshoots the equilibrium, but by less each time, so the swings die away.`:`At speed ${s.k.toFixed(2)} the overshoots no longer die away: the price keeps swinging either side of 0.78 (the final swings span ${E2_n(swing,2)}). The equilibrium exists, but this process never reaches it.`};
 }});

/* ================================================================ externalities */
SCENE({id:'externalities',name:'Costs the market ignores',tag:'Pollution and a Pigouvian tax',
 definition:'An externality is a cost or benefit that falls on people outside a trade. With pollution, the seller’s costs leave out the damage done to others, so the market produces too much. A tax equal to the damage per unit (a Pigouvian tax) makes the price tell the truth.',
 example:'If each unit does £2 of damage to neighbours, the market makes 50 units but the best amount is 37.5. A £2 tax per unit brings output to 37.5 and the lost value (the red triangle) to zero.',
 desc:'Demand, the producers’ own cost (supply) and the full social cost including damage. Market output, the efficient output, and output under the tax, with the welfare lost shaded.',
 research:'Marshall, A. (1890). Principles of Economics (external economies). Pigou, A. C. (1920). The Economics of Welfare. Baumol, W. J. (1972). On taxation and the control of externalities. American Economic Review 62, 307–322.',
 dur:12,hint:'Set the damage each unit does, then set the tax. The red triangle disappears when the tax equals the damage per unit.',
 init:()=>({d:2,t:0}),
 watch(p){return {d:2,t:Number(lerp(0,3,p).toFixed(2))}},
 ui:[{range:'d',label:'Damage per unit to others',min:0,max:4,step:.25,get:s=>s.d,act:'d',show:v=>'£'+Number(v).toFixed(2)},{range:'t',label:'Tax per unit',min:0,max:4,step:.25,get:s=>s.t,act:'t',show:v=>'£'+Number(v).toFixed(2)}],
 on:{d(s,v){s.d=Number(v);return 'keep'},t(s,v){s.t=Number(v);return 'keep'}},
 draw(s){
  const qe=(8-s.d)/.16,qt=(8-s.t)/.16,loss=.5*Math.pow(s.d-s.t,2)/.16;let out=heading('Pollution and a tax on it',28);
  const pl=E2_mkt(70,58,300,234);out+=pl.svg;
  if(Math.abs(qt-qe)>.2){out+=E2_area([[pl.X(qe),pl.Y(E2_D(qe))],[pl.X(qt),pl.Y(E2_D(qt))],[pl.X(qt),pl.Y(E2_S(qt)+s.d)]],'#f3b8a8')}
  out+=E2_line(pl,q=>E2_D(q),C.blue)+E2_line(pl,q=>E2_S(q),C.coral)+E2_line(pl,q=>E2_S(q)+s.d,C.purple,2.4,'stroke-dasharray="7 4"');
  out+=TF(392,298,'dashed: social cost (with damage)',13,C.purple,'start')+TF(392,316,'red: producers’ own cost',13,C.coral,'start')+TF(392,334,'blue: demand',13,C.blue,'start');
  out+=L(pl.X(qt),pl.Y(0),pl.X(qt),pl.Y(E2_D(qt)),C.ink,1.6)+L(pl.X(qe),pl.Y(0),pl.X(qe),pl.Y(E2_D(qe)),C.green,1.6,'stroke-dasharray="4 4"');
  out+=counter(392,62,'output with this tax',E2_n(qt,1),C.ink,192)+counter(392,118,'best output',E2_n(qe,1),C.green,192)+counter(392,174,'value lost a day',E2_gbp(loss),loss>.01?C.coral:C.green,192)+counter(392,230,'tax raised a day',E2_gbp(s.t*qt),C.amber,192);
  return {svg:out,phase:Math.abs(s.t-s.d)<.01?`With the tax equal to the damage (${E2_gbp(s.d)}), sellers face the full cost of what they make and output falls to the best level, ${E2_n(qe,1)}.`:s.t<s.d?`The tax (${E2_gbp(s.t)}) is less than the damage (${E2_gbp(s.d)}), so too much is still made: ${E2_n(qt,1)} instead of ${E2_n(qe,1)}. The red triangle is damage that outweighs what buyers gain.`:`The tax (${E2_gbp(s.t)}) is more than the damage (${E2_gbp(s.d)}), so now too little is made: trades worth more than their full cost are lost.`};
 }});

SCENE({id:'externalities-coase',name:'The factory and the laundry',tag:'The Coase theorem',
 definition:'Coase argued that if people can bargain cheaply, the efficient fix for an externality happens whoever holds the legal right; the law only decides who pays. When bargaining is costly, as with many people affected, who holds the right matters and taxes or rules may do better.',
 example:'Smoke does £100 a year of damage to a laundry. A filter on the factory costs £60; an indoor dryer for the laundry costs £40. The cheapest fix is the dryer, and with free bargaining it gets bought whoever holds the right.',
 desc:'A factory and a laundry, the three possible outcomes with their costs, and the money that changes hands, for the chosen legal right and bargaining cost.',
 research:'Coase, R. H. (1960). The problem of social cost. Journal of Law and Economics 3, 1–44. Ostrom, E. (1990). Governing the Commons (when communities find their own rules). The costs are illustrative.',
 dur:12,hint:'Switch who holds the legal right, then raise the cost of bargaining. With cheap bargaining the dryer is always bought; with costly bargaining the outcome depends on the law.',
 init:()=>({right:'laundry',tc:5}),
 watch(p){return p<.5?{right:'factory',tc:Math.round(lerp(0,40,p*2))}:{right:'laundry',tc:Math.round(lerp(0,40,(p-.5)*2))}},
 ui:[{choose:[['factory','Factory may pollute'],['laundry','Laundry has clean air']],label:'Legal right',get:s=>s.right,act:'right'},{range:'tc',label:'Cost of reaching a deal',min:0,max:50,step:1,get:s=>s.tc,act:'tc',show:v=>'£'+v}],
 on:{right(s,v){s.right=v;return 'keep'},tc(s,v){s.tc=Number(v);return 'keep'}},
 draw(s){
  let fix,who,cost,flow;
  if(s.right==='factory'){fix='dryer';cost=40;who='The laundry buys its own dryer';flow='No deal is needed: the laundry pays £40 itself.'}
  else if(s.tc+40<60){fix='dryer';cost=40+s.tc;who='The factory pays the laundry to buy a dryer';flow=`The factory pays £40 for the dryer, plus £${s.tc} to reach the deal.`}
  else{fix='filter';cost=60;who='The factory fits a filter';flow='A deal would cost too much to reach, so the factory fits the £60 filter.'}
  let out=heading(who,28);
  // Factory and laundry.
  out+=R(40,96,120,90,C.pale,C.line,6)+R(66,60,20,40,C.line,'none',2)+TF(100,148,'factory',14,C.ink)+R(400,110,150,76,C.greenp,C.line,6)+TF(475,154,'laundry',14,C.ink);
  if(fix!=='filter')for(let i=0;i<5;i++)out+=Ci(96+i*58,70-i*3+(i%2)*6,10+i*2,'#d9d9d9','none','opacity=".8"');
  else out+=R(64,54,24,10,C.green,'none',2)+TF(76,48,'filter',13,C.green);
  if(fix==='dryer')out+=R(510,124,30,30,'#fff',C.blue,4)+TF(525,174,'dryer',13,C.blue);
  out+=arrow(170,130,390,145,C.coral,2,9,'stroke-dasharray="6 5"')+TF(280,124,'smoke: £100 of damage a year',13,C.coral);
  const opts=[['Nothing',100],['Filter on the factory',60],['Dryer for the laundry',40]];
  opts.forEach(([n,c],i)=>{const y=212+i*30,sel=(fix==='filter'&&i===1)||(fix==='dryer'&&i===2);out+=R(40,y,300,26,sel?C.pale:'#fff',sel?C.blue:C.grid,6)+TF(52,y+18,n,13,C.ink,'start')+TF(330,y+18,'£'+c,13,sel?C.blue:C.muted,'end')});
  out+=counter(370,212,'total cost to society',E2_gbp(cost),cost===40?C.green:C.coral,200)+counter(370,262,'wasted versus the best fix',E2_gbp(cost-40),cost===40?C.green:C.coral,200);
  return {svg:out,phase:`${flow} ${cost===40?'The cheapest fix happens, as Coase predicted.':`Society spends ${E2_gbp(cost)} where ${E2_gbp(40)} would do: when bargaining is costly, the legal right changes the outcome, not just who pays.`} Real pollution usually harms thousands of people, which makes bargaining very costly.`};
 }});

SCENE({id:'externalities-positive',name:'Benefits the market ignores',tag:'Positive externalities and subsidies',
 definition:'Some goods benefit people other than the buyer: a vaccination protects neighbours, a well-kept garden pleases a street. Buyers weigh only their own benefit, so too little is bought. A subsidy equal to the benefit to others per unit corrects it.',
 example:'If each vaccination gives £2 of protection to others, the market buys 50 but the best amount is 62.5. A £2 subsidy per dose gets there.',
 desc:'Buyers’ own benefit (demand), the full social benefit including others, and the supply curve. Market quantity, the best quantity and the quantity with the subsidy, with the lost value shaded.',
 research:'Pigou, A. C. (1920). The Economics of Welfare. Fine, P. E. M. (1993). Herd immunity: history, theory, practice. Epidemiologic Reviews 15, 265–302. The market numbers are illustrative.',
 dur:12,hint:'Set the benefit to others and the subsidy. The lost value disappears when the subsidy equals the benefit to others per unit.',
 init:()=>({e:2,sub:0}),
 watch(p){return {e:2,sub:Number(lerp(0,3,p).toFixed(2))}},
 ui:[{range:'e',label:'Benefit to others per unit',min:0,max:4,step:.25,get:s=>s.e,act:'e',show:v=>'£'+Number(v).toFixed(2)},{range:'sub',label:'Subsidy per unit',min:0,max:4,step:.25,get:s=>s.sub,act:'sub',show:v=>'£'+Number(v).toFixed(2)}],
 on:{e(s,v){s.e=Number(v);return 'keep'},sub(s,v){s.sub=Number(v);return 'keep'}},
 draw(s){
  const qe=(8+s.e)/.16,qs=(8+s.sub)/.16,loss=.5*Math.pow(s.e-s.sub,2)/.16;let out=heading('Too little of a good thing',28);
  const pl=E2_mkt(70,58,300,234);out+=pl.svg;
  if(Math.abs(qs-qe)>.2)out+=E2_area([[pl.X(qe),pl.Y(E2_S(qe))],[pl.X(qs),pl.Y(E2_S(qs))],[pl.X(qs),pl.Y(E2_D(qs)+s.e)]],'#f3b8a8');
  out+=E2_line(pl,q=>E2_D(q),C.blue)+E2_line(pl,q=>E2_D(q)+s.e,C.purple,2.4,'stroke-dasharray="7 4"')+E2_line(pl,q=>E2_S(q),C.coral);
  out+=TF(392,298,'dashed: benefit to everyone',13,C.purple,'start')+TF(392,316,'blue: buyers’ own benefit',13,C.blue,'start')+TF(392,334,'red: supply',13,C.coral,'start');
  out+=L(pl.X(qs),pl.Y(0),pl.X(qs),pl.Y(E2_S(qs)),C.ink,1.6)+L(pl.X(qe),pl.Y(0),pl.X(qe),pl.Y(E2_S(qe)),C.green,1.6,'stroke-dasharray="4 4"');
  out+=counter(392,62,'quantity with subsidy',E2_n(qs,1),C.ink,192)+counter(392,118,'best quantity',E2_n(qe,1),C.green,192)+counter(392,174,'value lost a day',E2_gbp(loss),loss>.01?C.coral:C.green,192)+counter(392,230,'subsidy cost a day',E2_gbp(s.sub*qs),C.amber,192);
  return {svg:out,phase:Math.abs(s.e-s.sub)<.01?`With a subsidy equal to the benefit to others (${E2_gbp(s.e)}), buyers act as if they counted everyone’s benefit, and the quantity reaches the best level, ${E2_n(qe,1)}.`:s.sub<s.e?`Buyers count only their own benefit, so ${E2_n(qs,1)} units are bought instead of ${E2_n(qe,1)}. The red triangle is benefit to others that never happens.`:`The subsidy is larger than the benefit to others, so now too much is bought.`};
 }});
