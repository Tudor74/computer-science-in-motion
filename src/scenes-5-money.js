/* ===================== Economics era 5 · Money and finance ===================== */
// Money and prices, central banks, compounding, bank runs, exchange rates and crises. Most scenes are
// mechanisms the learner steers; in bank-runs-game the learner plays a depositor against nine simulated ones.
// Every picture is a pure function of state; random choices are seeded with rng(), never Math.random.

const E5_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function E5_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function E5_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,9,o.sel?'stroke-width="3"':'stroke-width="1.5"')+lines.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*16,t,o.size||13,o.ink||C.ink,'middle',o.bold?'font-weight="700"':'')).join('');
 return hit(X,act,arg,label,inner);
}
function E5_wrap(text,max){const out=[];let line='';for(const w of String(text).split(' ')){if(line&&(line+' '+w).length>max){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
const E5_lines=(x,y,lines,size=13,col=C.ink,anchor='start',dy=17)=>lines.map((l,i)=>TF(x,y+i*dy,l,size,col,anchor)).join('');
function E5_th(n){const s=String(Math.round(Math.abs(n)));return (n<0?'−':'')+s.replace(/\B(?=(\d{3})+(?!\d))/g,',')}
const E5_gbp=v=>Math.abs(v)>=100?(v<0?'−£':'£')+E5_th(Math.abs(v)):(v<0?'−£':'£')+Math.abs(v).toFixed(2);
const E5_pc=(v,d=1)=>{const x=v*100;return (Math.abs(x)<Math.pow(10,-d)/2?'0':(x<0?'−':'')+Math.abs(x).toFixed(d))+'%'};
const E5_sg=(v,d=1)=>(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(d);
function E5_nice(v){const p=Math.pow(10,Math.floor(Math.log10(Math.max(v,1e-9))));for(const m of [1,1.2,1.5,2,2.5,3,4,5,6,8,10])if(v<=m*p*1.0001)return m*p;return 10*p}
const E5_ticks=(max,n=4)=>range(n+1).map(i=>max*i/n);
const E5_short=v=>v>=1e6?(v/1e6).toFixed(v>=1e7?0:1)+'m':v>=1e4?Math.round(v/1000)+'k':v>=1000?(v/1000).toFixed(1)+'k':String(Math.round(v));
// A pressable timeline of evenly spaced events, with a card for the chosen one.
function E5_timeline(X,s,events,act,y=78){
 let out=L(48,y,552,y,C.line,3);const n=events.length,dx=504/(n-1);
 events.forEach((e,i)=>{const x=48+i*dx,on=i===s.k;
  out+=hit(X,act,i,`${e.y}: ${e.t}`,Ci(x,y,on?11:8,on?C.coral:'#fff',on?C.coral:C.blue,'stroke-width="2.5"')+TF(x,y+(i%2?-18:28),e.y,13,on?C.coral:C.muted))});
 const e=events[s.k];out+=R(36,128,528,200,'#fff',C.grid,10);
 out+=TBF(54,156,`${e.y} · ${e.t}`,16,C.ink,'start');
 out+=E5_lines(54,184,E5_wrap(e.d,74),14,C.ink,'start',20);
 if(e.n)out+=E5_lines(54,184+E5_wrap(e.d,74).length*20+8,E5_wrap(e.n,78),13,C.muted,'start',17);
 return out;
}

/* ================================================================ inflation-money */
SCENE({id:'inflation-money',name:'Money, spending and prices',tag:'The quantity equation MV = PY',
 definition:'The quantity equation says that the stock of money M, times its velocity V (how many times each pound is spent in a year), equals the price level P times real output Y. Written in growth rates: inflation ≈ money growth + velocity growth − real growth.',
 example:'If money grows by 8% a year, velocity stays steady and real output grows by 2%, prices must rise by about 6% a year.',
 desc:'Four boxes spell M × V = P × Y. Bars show the yearly growth of money, velocity and real output, and the inflation they imply. A second graph shows the price level over ten years against a 2% target path.',
 research:'Fisher, I. (1911). The Purchasing Power of Money. Macmillan. Friedman, M. & Schwartz, A. J. (1963). A Monetary History of the United States, 1867–1960. Princeton University Press. McCandless, G. T. & Weber, W. E. (1995). Some monetary facts. Federal Reserve Bank of Minneapolis Quarterly Review 19(3), 2–11: across 110 countries over 30 years, money growth and inflation were correlated above 0.9. The equation is an identity; the link is loose at low inflation because velocity moves.',
 dur:10,hint:'Raise money growth and watch inflation follow. Then let velocity fall: the same money growth gives less inflation, as after 2008 when banks held new money as reserves.',
 init:()=>({m:8,v:0,y:2}),
 watch(p){return {m:Math.round(lerp(2,25,smooth(p/.8))),v:0,y:2}},
 ui:[{range:'m',label:'Money growth',min:-2,max:30,step:1,get:s=>s.m,act:'m',show:v=>v+'% a year'},
  {range:'v',label:'Velocity growth',min:-5,max:5,step:1,get:s=>s.v,act:'v',show:v=>v+'% a year'},
  {range:'y',label:'Real output growth',min:-3,max:6,step:1,get:s=>s.y,act:'y',show:v=>v+'% a year'}],
 on:{m(s,v){s.m=Number(v)},v(s,v){s.v=Number(v)},y(s,v){s.y=Number(v)}},
 draw(s){
  const pi=(1+s.m/100)*(1+s.v/100)/(1+s.y/100)-1,ap=s.m+s.v-s.y;let out=heading('M × V = P × Y, in growth rates',26);
  [['M','money',60,C.blue],['V','velocity',190,C.purple],['P','prices',330,C.coral],['Y','real output',460,C.green]].forEach(([l,t,x,col])=>{out+=R(x,42,80,38,'#fff',col,8,'stroke-width="2"')+TBF(x+40,68,l,22,col)+TF(x+40,98,t,13,C.muted)});
  out+=TBF(165,68,'×',20,C.muted)+TBF(300,68,'=',20,C.muted)+TBF(435,68,'×',20,C.muted);
  const pl=E5_plot(60,130,250,160,[0,4],[-6,32],{yt:[[-5,'−5%'],[0,'0%'],[10,'10%'],[20,'20%'],[30,'30%']],yl:'growth per year'});out+=pl.svg;
  out+=L(60,pl.Y(0),310,pl.Y(0),C.muted,1.5);
  [[s.m,'money',C.blue],[s.v,'velocity',C.purple],[s.y,'output',C.green],[pi*100,'prices',C.coral]].forEach(([v,l,col],i)=>{const x=pl.X(i+.5),y1=pl.Y(Math.max(0,v)),y2=pl.Y(Math.min(0,v));
   out+=R(x-22,y1,44,Math.max(1,y2-y1),col,'none',3)+TF(x,v>=0?y1-5:y2+14,E5_sg(v,v===Math.round(v)?0:1)+'%',13,col)+TF(x,306,l,13,C.muted)});
  const yrs=10,end=100*Math.pow(1+pi,yrs),ymax=E5_nice(Math.max(130,end,100*Math.pow(1.02,yrs))),ymin=0;
  const p2=E5_plot(370,130,190,160,[0,yrs],[ymin,ymax],{xt:[[0,'0'],[5,'5'],[10,'10 yr']],yt:E5_ticks(ymax,2).map(v=>[v,E5_short(v)]),yl:'price level (start = 100)'});out+=p2.svg;
  out+=E5_poly(range(41).map(i=>[p2.X(i/4),p2.Y(100*Math.pow(1.02,i/4))]),C.muted,1.5,'stroke-dasharray="5 4"');
  out+=E5_poly(range(41).map(i=>[p2.X(i/4),p2.Y(100*Math.pow(1+pi,i/4))]),C.coral,3);
  out+=TF(376,146,'dashed: 2% a year',12,C.muted,'start');
  out+=T(300,336,`Inflation ≈ ${s.m} + ${s.v} − ${s.y} = ${ap}% · exactly ${E5_pc(pi)} a year`,15,pi>0.1?C.coral:C.ink);
  out+=TF(300,360,'An identity, so always true. Whether money drives prices depends on how steady V is.',13,C.muted);
  return {svg:out,phase:pi>0.1?`With money growing ${s.m}% a year and output only ${s.y}%, the extra money ends up as higher prices: about ${E5_pc(pi,0)} a year. Across countries with high inflation this link is strong; McCandless and Weber found correlations above 0.9.`:'At low inflation the link is loose: velocity moves around, so money growth is a poor guide to next year’s inflation. Central banks stopped targeting money for that reason.'};
 }});

SCENE({id:'inflation-money-erosion',name:'What inflation does to £100',tag:'Purchasing power and the rule of 70',
 definition:'Inflation erodes purchasing power: at inflation π, £100 kept for t years buys only what about £100 ÷ (1 + π)ᵗ buys today. The time for prices to double is about 70 divided by the inflation rate in per cent.',
 example:'At 2% inflation prices double in about 35 years; at 10% they double in about 7 years, and £100 buys what £39 buys today after 10 years.',
 desc:'A curve shows what £100 is worth in today’s money year by year at your chosen inflation rate, with a dashed curve for the 2% target. Tiles give the value after your chosen number of years, the exact doubling time and the rule-of-70 estimate.',
 research:'The rule of 70 follows from ln 2 ≈ 0.693 and ln(1 + π) ≈ π for small π. UK inflation target of 2% (CPI) set by the government for the Bank of England since 2003; from 1997 the target was 2.5% on RPIX. Office for National Statistics, Consumer price inflation tables.',
 dur:10,hint:'Compare 2% with 5% and 10%. Small differences in the rate make big differences over a working life.',
 init:()=>({pi:5,yrs:20}),
 watch(p){return {pi:p<.5?2:10,yrs:Math.round(lerp(0,40,p<.5?p*2:(p-.5)*2))}},
 ui:[{range:'pi',label:'Inflation',min:0,max:20,step:.5,get:s=>s.pi,act:'pi',show:v=>Number(v).toFixed(1)+'% a year'},
  {range:'yrs',label:'Years',min:0,max:40,step:1,get:s=>s.yrs,act:'yrs',show:v=>v+' years'}],
 on:{pi(s,v){s.pi=Number(v)},yrs(s,v){s.yrs=Number(v)}},
 draw(s){
  const r=s.pi/100,val=t=>100/Math.pow(1+r,t);let out=heading(`What £100 buys, in today’s money, at ${s.pi}% inflation`,26);
  const pl=E5_plot(70,56,320,220,[0,40],[0,100],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40']],yt:[[0,'£0'],[25,'£25'],[50,'£50'],[75,'£75'],[100,'£100']],xl:'years from now',yl:'buying power of £100'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(50),pl.X(40),pl.Y(50),C.grid,1.5,'stroke-dasharray="4 4"');
  out+=E5_poly(range(81).map(i=>[pl.X(i/2),pl.Y(100/Math.pow(1.02,i/2))]),C.muted,1.5,'stroke-dasharray="5 4"');
  out+=E5_poly(range(81).map(i=>[pl.X(i/2),pl.Y(val(i/2))]),C.coral,3);
  out+=Ci(pl.X(s.yrs),pl.Y(val(s.yrs)),6,C.coral,'#fff');
  out+=TF(pl.X(40)-4,pl.Y(100/Math.pow(1.02,40))+16,'2% target',12,C.muted,'end');
  const half=r>0?Math.log(2)/Math.log(1+r):Infinity;
  out+=counter(420,60,`£100 after ${s.yrs} years buys`,E5_gbp(val(s.yrs)),C.coral,150);
  out+=counter(420,118,'prices double in',r>0?half.toFixed(1)+' years':'never',C.ink,150);
  out+=counter(420,176,'rule of 70 says',r>0?(70/s.pi).toFixed(1)+' years':'—',C.blue,150);
  out+=E5_lines(420,250,['The dotted line marks half:','where prices have doubled.'],13,C.muted);
  out+=T(300,340,r>0?`At ${s.pi}% a year, money loses half its buying power in about ${half.toFixed(0)} years.`:'With zero inflation, £100 keeps its buying power.',15);
  out+=TF(300,362,'Savings that earn less than inflation shrink in real terms.',13,C.muted);
  return {svg:out,phase:'Inflation compounds just like interest, but against you. That is why central banks aim for low, steady inflation rather than zero: a little inflation gives room to cut real interest rates in a slump, and measured inflation slightly overstates the true rise in living costs.'};
 }});

const E5_HYPER={
 weimar:{n:'Germany 1923',peak:'October 1923',mo:29500,dbl:'3.7 days',f:[1,1,1,0],why:'War debts and reparations, then the 1923 occupation of the Ruhr cut output while the Reichsbank financed the government by discounting its bills without limit.'},
 hungary:{n:'Hungary 1946',peak:'July 1946',mo:4.19e16,dbl:'15 hours',f:[1,1,1,0],why:'War had destroyed much of industry and transport; the government paid its way by printing. The record: prices tripled roughly every day.'},
 zimbabwe:{n:'Zimbabwe 2008',peak:'November 2008',mo:7.96e10,dbl:'about 25 hours',f:[1,1,1,0],why:'Farm output collapsed after land seizures from 2000; the central bank financed the state and its own losses by printing.'},
 ukqe:{n:'UK 2009–2020 (QE)',peak:'—',mo:0.17,dbl:'about 35 years',f:[0,0,0,1],why:'The Bank of England created about £895bn of reserves to buy bonds. Inflation stayed mostly near 2% until 2021; its later rise to 11.1% in 2022 had several causes, energy prices above all, and the share due to money is debated.'}};
const E5_HROWS=['Central bank financed big budget deficits directly','Production had collapsed (war, seizures, occupation)','People lost confidence and spent money at once','New money mostly sat as bank reserves'];
SCENE({id:'inflation-money-hyper',name:'When printing becomes hyperinflation',tag:'Germany, Hungary, Zimbabwe and QE',
 definition:'Hyperinflation, in Cagan’s definition, is inflation above 50% a month. It has happened when governments financed large deficits by printing money while production collapsed and people stopped trusting the currency, not whenever a central bank created money.',
 example:'In July 1946 Hungarian prices doubled about every 15 hours, the highest inflation on record. The Bank of England created hundreds of billions of pounds in quantitative easing after 2009, yet inflation stayed near 2% for a decade.',
 desc:'Bars on a scale of powers of ten show how much prices multiplied in the peak month of three hyperinflations and in a typical month of UK quantitative easing. A checklist shows which conditions were present in the chosen case.',
 research:'Cagan, P. (1956). The monetary dynamics of hyperinflation. In Friedman, M. (ed.), Studies in the Quantity Theory of Money. Hanke, S. H. & Krus, N. (2013). World hyperinflations. In Parker, R. & Whaples, R. (eds), Routledge Handbook of Major Events in Economic History (peak monthly rates and doubling times). Sargent, T. J. (1982). The ends of four big inflations. Bank of England (2021), asset purchase facility totals.',
 dur:12,hint:'Compare the hyperinflations with QE. What was present in all three that was missing in the UK?',
 init:()=>({c:'weimar'}),
 watch(p){return {c:['weimar','hungary','zimbabwe','ukqe'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.keys(E5_HYPER).map(k=>[k,E5_HYPER[k].n]),label:'Case',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v}},
 draw(s){
  const d=E5_HYPER[s.c];let out=heading('How much prices multiplied in one month',26);
  const x0=200,sc=22,X=v=>x0+v*sc;
  Object.keys(E5_HYPER).forEach((k,i)=>{const h=E5_HYPER[k],y=50+i*26,lg=Math.log10(1+h.mo/100),on=k===s.c;
   out+=TF(190,y+14,h.n,13,on?C.ink:C.muted,'end',on?'font-weight="700"':'');
   out+=R(x0,y+2,Math.max(2,lg*sc),16,on?C.coral:C.coralp,'none',3);
   out+=TF(X(lg)+6,y+14,E5_mult(1+h.mo/100),12,C.muted,'start')});
  out+=L(x0,158,x0+16*sc,158,C.line,1.5);
  [0,4,8,12,16].forEach(v=>out+=L(X(v),154,X(v),162,C.line,1)+TF(X(v),176,v?'×10'+E5_sup(v):'×1',12,C.muted));
  out+=R(30,190,540,176,'#fff',C.grid,10);
  out+=TBF(48,214,d.n,16,C.ink,'start')+TF(552,214,d.peak!=='—'?`peak month ${d.peak} · prices doubled every ${d.dbl}`:`about 2% a year · prices double every ${d.dbl}`,13,C.muted,'end');
  E5_HROWS.forEach((t,i)=>{const on=d.f[i];out+=TBF(56,242+i*22,on?'✓':'✗',15,on?C.coral:C.muted,'middle')+TF(72,247+i*22,t,13,on?C.ink:C.muted,'start')});
  out+=E5_lines(48,340,E5_wrap(d.why,80),13,C.ink,'start',16);
  return {svg:out,phase:s.c==='ukqe'?'Quantitative easing swapped bonds for bank reserves. Without a collapse in production or in trust, and with banks holding the new money as reserves, it did not set off runaway inflation.':`${d.n}: prices doubled every ${d.dbl} at the peak. Each hyperinflation combined money printing to pay for deficits with collapsing production and lost trust. Each ended with a fiscal reform and a new, credible currency (Sargent 1982).`};
 }});
function E5_mult(m){if(m<1e4)return '×'+(m<10?m.toFixed(4):String(Math.round(m)));const e=Math.floor(Math.log10(m));return '×'+(m/Math.pow(10,e)).toFixed(1)+' × 10'+E5_sup(e)}
function E5_sup(n){const m='⁰¹²³⁴⁵⁶⁷⁸⁹';return String(n).split('').map(c=>m[Number(c)]).join('')}

/* ================================================================ central-banks */
SCENE({id:'central-banks',name:'Setting the interest rate',tag:'The Taylor rule',
 definition:'The Taylor rule is a rule of thumb for a central bank’s interest rate: start from a neutral real rate, add inflation, then add half the gap between inflation and its target and half the output gap (how far output is above its normal level).',
 example:'With a neutral real rate of 2%, inflation at 4% against a 2% target, and output at its normal level, the rule suggests 2 + 4 + 1 + 0 = 7%.',
 desc:'A waterfall builds the suggested rate from its four parts: the neutral real rate r*, inflation, half the inflation gap and half the output gap. Sliders set inflation, the output gap and r*.',
 research:'Taylor, J. B. (1993). Discretion versus policy rules in practice. Carnegie-Rochester Conference Series on Public Policy 39, 195–214 (fitted US policy 1987–92 with r* = 2% and a 2% target). Laubach, T. & Williams, J. C. (2003). Measuring the natural rate of interest. Review of Economics and Statistics 85, 1063–1070; Holston, Laubach & Williams (2017): estimates of r* fell after 2008. A description of past policy, not a law.',
 dur:12,hint:'Push inflation up to 9%, as in 2022, and see how high the rule wants rates. Then set a deep recession with low inflation: the rule asks for a rate below zero.',
 init:()=>({pi:2,gap:0,rs:2}),
 watch(p){return p<.55?{pi:Math.round(lerp(2,9,smooth(p/.45))),gap:0,rs:2}:{pi:1,gap:-6,rs:.5}},
 ui:[{range:'pi',label:'Inflation',min:-2,max:12,step:.5,get:s=>s.pi,act:'pi',show:v=>v+'%'},
  {range:'gap',label:'Output gap',min:-8,max:6,step:.5,get:s=>s.gap,act:'gap',show:v=>(v>0?'+':'')+v+'%'},
  {range:'rs',label:'Neutral real rate r*',min:0,max:3,step:.25,get:s=>s.rs,act:'rs',show:v=>v+'%'}],
 on:{pi(s,v){s.pi=Number(v)},gap(s,v){s.gap=Number(v)},rs(s,v){s.rs=Number(v)}},
 draw(s){
  const parts=[s.rs,s.pi,.5*(s.pi-2),.5*s.gap],i=parts.reduce((a,b)=>a+b,0);let out=heading('What interest rate does the Taylor rule suggest?',26);
  const pl=E5_plot(70,52,300,228,[0,5],[-8,20],{yt:[[-5,'−5%'],[0,'0%'],[5,'5%'],[10,'10%'],[15,'15%'],[20,'20%']]});out+=pl.svg+L(70,pl.Y(0),370,pl.Y(0),C.muted,1.5);
  let run=0;const cols=[C.green,C.coral,C.amber,C.purple],labs=['r*','inflation','½(π − 2%)','½ × gap','rate'];
  parts.forEach((v,k)=>{const x=pl.X(k+.5),a=pl.Y(run),b=pl.Y(run+v);out+=R(x-22,Math.min(a,b),44,Math.max(1.5,Math.abs(b-a)),cols[k],'none',3);
   if(k<3)out+=L(x+22,b,pl.X(k+1.5)-22,b,C.line,1,'stroke-dasharray="3 3"');out+=TF(x,Math.min(a,b)-5,E5_sg(v,v%1?2:0),12,cols[k]);run+=v});
  const xr=pl.X(4.5);out+=R(xr-22,Math.min(pl.Y(0),pl.Y(i)),44,Math.max(1.5,Math.abs(pl.Y(i)-pl.Y(0))),C.blue,'none',3);
  labs.forEach((l,k)=>out+=TF(pl.X(k+.5),298,l,12,C.muted));
  out+=counter(400,56,'inflation',s.pi+'%',C.coral,170)+counter(400,110,'output gap',(s.gap>0?'+':'')+s.gap+'%',C.purple,170);
  out+=R(400,166,170,64,i<0.25?C.amberp:C.pale,'none',8)+TF(485,186,'suggested rate',12,C.muted)+TBF(485,216,i.toFixed(2)+'%',22,i<0.25?C.amber:C.blue);
  if(i<0.25)out+=E5_lines(404,252,['At or below the floor: rates','cannot go far under zero,','so banks used QE instead.'],13,C.amber);
  out+=T(300,336,'i = r* + π + ½(π − 2%) + ½ × output gap',15);
  out+=TF(300,360,'A rule of thumb that described US policy in 1987–92 (Taylor 1993), not a law.',13,C.muted);
  return {svg:out,phase:i<0.25?'The rule asks for a rate of zero or less, but cash pays zero, so rates cannot fall far below zero. After 2008 central banks met this floor and turned to quantitative easing and forward guidance.':`The rule raises rates by more than any rise in inflation (1.5 points per point), so real rates rise and cool demand. Here it suggests ${i.toFixed(2)}%. Central banks look at rules like this but decide by judgement.`};
 }});

const E5_STEPS=[['Bank Rate','changes'],['Market and','mortgage rates'],['Spending and','borrowing'],['Output','and jobs'],['Inflation','']];
const E5_DLY=[0,1,4,9,15];
const E5_resp=(t,pk)=>t<=0?0:Math.pow(t/pk,2)*Math.exp(2*(1-t/pk));
SCENE({id:'central-banks-transmission',name:'How a rate change spreads',tag:'Long and variable lags',
 definition:'Monetary policy works through a chain: the policy rate moves market and mortgage rates, which change borrowing and spending, which change output and jobs, and only then inflation. Each link takes time.',
 example:'The Bank of England says a change in Bank Rate takes up to about two years to have its full effect on inflation, so it sets rates for where inflation is heading, not where it is.',
 desc:'Five boxes in a row light up in turn as months pass after a rate rise or cut. Below, two illustrative curves show the response of output and inflation, peaking about a year and about two years later.',
 research:'Friedman, M. (1961). The lag in effect of monetary policy. Journal of Political Economy 69, 447–466 (“long and variable lags”). Christiano, L. J., Eichenbaum, M. & Evans, C. L. (1999). Monetary policy shocks: what have we learned and to what end? Handbook of Macroeconomics 1A. Romer, C. D. & Romer, D. H. (2004). A new measure of monetary shocks. American Economic Review 94, 1055–1084. Bank of England, “How does monetary policy work?”. Curve shapes illustrative.',
 dur:12,hint:'Step through the months after a rise. Notice how long inflation takes to respond compared with mortgage rates.',
 init:()=>({dir:'hike',mo:12}),
 watch(p){return {dir:'hike',mo:Math.round(p*36)}},
 ui:[{choose:[['hike','Raise the rate'],['cut','Cut the rate']],label:'Decision',get:s=>s.dir,act:'dir'},
  {range:'mo',label:'Months after the decision',min:0,max:36,step:1,get:s=>s.mo,act:'mo',show:v=>v+' months'}],
 on:{dir(s,v){s.dir=v},mo(s,v){s.mo=Number(v)}},
 draw(s){
  const sg=s.dir==='hike'?-1:1;let out=heading(`${s.dir==='hike'?'A rate rise':'A rate cut'}, ${s.mo} months on`,26);
  E5_STEPS.forEach((t,k)=>{const x=20+k*116,a=clamp((s.mo-E5_DLY[k])/3,0,1),col=s.dir==='hike'?C.blue:C.green;
   out+=R(x,44,100,54,a>0?tint(col,1-.75*a):'#fff',a>0?col:C.line,9,'stroke-width="2"')+TF(x+50,66,t[0],13,a>.5?'#fff':C.ink)+TF(x+50,83,t[1],13,a>.5?'#fff':C.ink);
   if(k<4)out+=arrow(x+101,71,x+115,71,C.line,2,6)});
  const pl=E5_plot(70,130,470,160,[0,36],[-1.1,1.1],{xt:[[0,'0'],[6,'6'],[12,'12'],[18,'18'],[24,'24'],[30,'30'],[36,'36']],yt:[[-1,'down'],[0,'0'],[1,'up']],xl:'months after the decision'});out+=pl.svg;
  out+=L(70,pl.Y(0),540,pl.Y(0),C.muted,1);
  out+=E5_poly(range(73).map(i=>[pl.X(i/2),pl.Y(sg*.9*E5_resp(i/2-1,12))]),C.purple,2.5);
  out+=E5_poly(range(73).map(i=>[pl.X(i/2),pl.Y(sg*.7*E5_resp(i/2-3,22))]),C.coral,2.5);
  out+=L(pl.X(s.mo),130,pl.X(s.mo),290,C.ink,1.5,'stroke-dasharray="4 3"');
  out+=TF(536,146,'output',13,C.purple,'end')+TF(536,162,'inflation',13,C.coral,'end');
  out+=T(300,338,s.mo<6?'Market and mortgage rates move within weeks.':s.mo<18?'Spending and output respond most around a year in.':'Inflation responds most around two years in.',15);
  out+=TF(300,362,'Curve shapes illustrative; real lags vary from cycle to cycle.',13,C.muted);
  return {svg:out,phase:'Because the full effect takes up to about two years, central banks set rates for the inflation they forecast, not for today’s figure. Friedman called the lags “long and variable”, a reason he favoured simple rules.'};
 }});

const E5_CB=[
 {y:'1668',t:'Sveriges Riksbank',d:'Sweden’s Riksbank, the oldest central bank still operating, grew out of a bank that had issued some of Europe’s first banknotes.'},
 {y:'1694',t:'Bank of England',d:'Founded to lend £1.2 million to the government of William III for war with France; it slowly became the government’s banker and the bankers’ bank.'},
 {y:'1873',t:'Lender of last resort',d:'After Overend, Gurney failed in 1866, Walter Bagehot’s Lombard Street argued that in a panic a central bank should lend freely, against good collateral, at a high rate.',n:'Bagehot’s rule still guides central banks in a crisis.'},
 {y:'1913',t:'Federal Reserve',d:'The United States created the Fed after the Panic of 1907, which had been stopped largely by the private banker J. P. Morgan.'},
 {y:'1971',t:'End of gold convertibility',d:'President Nixon closed the gold window: the dollar could no longer be swapped for gold, and the world moved to fiat money whose value rests on policy.'},
 {y:'1990',t:'Inflation targeting',d:'New Zealand’s Reserve Bank adopted the first explicit inflation target. The UK followed in 1992, Canada in 1991, and most large central banks since.'},
 {y:'1997',t:'Independence',d:'The Bank of England was given operational independence to set rates to meet a target set by the government, as many central banks had been.',n:'Independence aims to remove the temptation to boost the economy before elections.'},
 {y:'2009',t:'Zero rates and QE',d:'Bank Rate fell to 0.5%, its lowest in the Bank’s history to that point, and the Bank began buying government bonds with new reserves (quantitative easing).'}];
SCENE({id:'central-banks-history',name:'A short history of central banks',tag:'From war finance to inflation targets',
 definition:'A central bank issues a country’s money, is banker to the government and to other banks, and today usually sets short-term interest rates to keep inflation near a target.',
 example:'The Bank of England began in 1694 as a way to fund a war; since 1997 it has set interest rates independently to meet an inflation target set by the government: 2.5% on RPIX at first, and 2% on CPI since the end of 2003.',
 desc:'A timeline of eight milestones from 1668 to 2009. Press a milestone to read what changed.',
 research:'Bagehot, W. (1873). Lombard Street: A Description of the Money Market. Capie, F., Goodhart, C., Fischer, S. & Schnadt, N. (1994). The Future of Central Banking. Cambridge University Press. Bernanke, B. S. et al. (1999). Inflation Targeting: Lessons from the International Experience. Princeton University Press. Bank of England history pages.',
 dur:12,hint:'Press each milestone. Which jobs did central banks gain over time?',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(E5_CB.length-1,Math.floor(p*E5_CB.length))}},
 ui:[{b:'Previous',act:'step',arg:-1},{b:'Next',act:'step',arg:1}],
 on:{pick(s,v){s.k=Number(v)},step(s,v){s.k=clamp(s.k+Number(v),0,E5_CB.length-1)}},
 draw(s,f,X){
  let out=heading('Central banks, 1668 to today',26)+E5_timeline(X,s,E5_CB,'pick');
  out+=TF(300,354,'From funding wars, to rescuing banks, to steering inflation.',13,C.muted);
  return {svg:out,phase:'Central banks began as lenders to governments, became lenders of last resort to banks, and after the end of the gold standard took on the job of keeping fiat money’s value steady.'};
 }});

/* ================================================================ compound-interest */
SCENE({id:'compound-interest',name:'Interest on interest',tag:'Compounding and the rule of 72',
 definition:'With compound interest, each year’s interest is added to the balance and earns interest itself, so savings grow by a fixed fraction each year rather than a fixed amount. The rule of 72 says a sum doubles in about 72 ÷ r years at r% a year.',
 example:'£1,000 at 5% a year grows to £4,322 after 30 years with compounding, but only £2,500 with simple interest. It doubles in 14.2 years; the rule of 72 says 14.4.',
 desc:'Two curves show £1,000 growing with simple interest (straight) and compound interest (curving up). Tiles give both final amounts, the exact doubling time and the rule-of-72 estimate.',
 research:'The rule of 72 approximates ln 2 ÷ ln(1 + r); 72 is used because it has many divisors and corrects for rates near 8%. Pacioli, L. (1494). Summa de arithmetica gives an early version of the rule. Bank of England, savings and mortgage rate statistics.',
 dur:10,hint:'Raise the rate or the number of years. The gap between the curves is interest earned on interest.',
 init:()=>({r:5,yrs:30}),
 watch(p){return {r:5,yrs:Math.round(lerp(5,50,smooth(p)))}},
 ui:[{range:'r',label:'Interest rate',min:.5,max:15,step:.5,get:s=>s.r,act:'r',show:v=>Number(v).toFixed(1)+'% a year'},
  {range:'yrs',label:'Years',min:5,max:50,step:1,get:s=>s.yrs,act:'yrs',show:v=>v+' years'}],
 on:{r(s,v){s.r=Number(v)},yrs(s,v){s.yrs=Number(v)}},
 draw(s){
  const r=s.r/100,P0=1000,cp=t=>P0*Math.pow(1+r,t),sp=t=>P0*(1+r*t),Ty=s.yrs,ymax=E5_nice(cp(Ty));let out=heading(`£1,000 at ${s.r}% a year`,26);
  const pl=E5_plot(76,52,320,222,[0,Ty],[0,ymax],{xt:E5_ticks(Ty,4).map(v=>[v,String(Math.round(v))]),yt:E5_ticks(ymax,4).map(v=>[v,'£'+E5_short(v)]),xl:'years',yl:'balance'});out+=pl.svg;
  const dbl=Math.log(2)/Math.log(1+r);
  for(let k=1;k*dbl<=Ty;k++){const y=pl.Y(P0*Math.pow(2,k));out+=L(pl.X(k*dbl),y,pl.X(k*dbl),274,C.grid,1,'stroke-dasharray="3 3"')+Ci(pl.X(k*dbl),y,3.5,C.coral)}
  out+=E5_poly(range(101).map(i=>[pl.X(i/100*Ty),pl.Y(sp(i/100*Ty))]),C.blue,2.5);
  out+=E5_poly(range(101).map(i=>[pl.X(i/100*Ty),pl.Y(cp(i/100*Ty))]),C.coral,3);
  out+=TF(82,70,'compound',13,C.coral,'start')+TF(82,86,'simple',13,C.blue,'start')+TF(82,102,'dots: each doubling',12,C.muted,'start');
  out+=counter(420,56,'compound',E5_gbp(cp(Ty)),C.coral,150)+counter(420,112,'simple',E5_gbp(sp(Ty)),C.blue,150);
  out+=counter(420,168,'doubles in',dbl.toFixed(1)+' years',C.ink,150)+counter(420,224,'rule of 72 says',(72/s.r).toFixed(1)+' years',C.muted,150);
  out+=T(300,334,`Interest on interest after ${Ty} years: ${E5_gbp(cp(Ty)-sp(Ty))}`,15,C.coral);
  out+=TF(300,358,'Debts compound too: unpaid credit-card interest grows the same way.',13,C.muted);
  return {svg:out,phase:`Simple interest adds the same ${E5_gbp(P0*r)} each year. Compound interest adds a fixed fraction of a growing balance, so the curve bends upward and the gap keeps widening.`};
 }});

const E5_FREQ=[['1','yearly',1],['2','half-yearly',2],['4','quarterly',4],['12','monthly',12],['52','weekly',52],['365','daily',365],['inf','continuous',Infinity]];
SCENE({id:'compound-interest-frequency',name:'How often is interest added?',tag:'Bernoulli’s question and the number e',
 definition:'The more often interest is added, the more a stated yearly rate yields, because each addition starts earning sooner. As additions become continuous, (1 + r/n)ⁿ approaches eʳ, where e ≈ 2.71828.',
 example:'£1 at 100% a year becomes £2 if interest is added once, £2.61 if added monthly and £2.72 (e) if added continuously. At 5% a year, monthly additions give an annual equivalent rate of 5.12%.',
 desc:'Bars show what £1 becomes after a year for seven compounding frequencies, from yearly to continuous, at your chosen rate. The highest bar is the limit eʳ.',
 research:'Bernoulli, J. (1690). Quaestiones nonnullae de usuris, Acta Eruditorum, posed the problem of continuous compounding in 1683; Euler later named the limit e. UK savings rates are compared by the annual equivalent rate (AER), which accounts for compounding.',
 dur:10,hint:'Set the rate to 100% to see Bernoulli’s example, then lower it to a realistic 5%: compounding frequency matters much less at low rates.',
 init:()=>({r:100,n:'12'}),
 watch(p){return {r:p<.6?100:5,n:E5_FREQ[Math.min(6,Math.floor((p%.6)/.6*7.99))][0]}},
 ui:[{range:'r',label:'Yearly rate',min:1,max:100,step:1,get:s=>s.r,act:'r',show:v=>v+'%'},
  {choose:E5_FREQ.map(f=>[f[0],f[1]]),label:'Interest added',get:s=>s.n,act:'n'}],
 on:{r(s,v){s.r=Number(v)},n(s,v){s.n=v}},
 draw(s,f,X){
  const r=s.r/100,val=n=>n===Infinity?Math.exp(r):Math.pow(1+r/n,n),top=val(Infinity),base=1;let out=heading(`£1 at ${s.r}% a year: what it becomes after one year`,26);
  const hmax=top-base;const pl=E5_plot(70,56,470,214,[0,7],[0,hmax*1.08],{yt:[[0,'£1'],[hmax,'£'+top.toFixed(top<1.2?4:2)]],yl:'after one year'});out+=pl.svg;
  E5_FREQ.forEach((q,i)=>{const v=val(q[2]),x=pl.X(i+.5),on=q[0]===s.n,y=pl.Y(v-base);
   out+=hit(X,'n',q[0],`${q[1]}: £${v.toFixed(4)}`,R(x-26,y,52,pl.Y(0)-y,on?C.coral:C.coralp,'none',4)+TF(x,y-6,'£'+v.toFixed(s.r>=20?3:4),12,on?C.coral:C.muted));
   out+=TF(x,288,q[1],12,on?C.ink:C.muted)});
  const v=val(E5_FREQ.find(q=>q[0]===s.n)[2]);
  out+=T(300,330,`Added ${E5_FREQ.find(q=>q[0]===s.n)[1]}: annual equivalent rate ${((v-1)*100).toFixed(2)}% (stated rate ${s.r}%)`,15);
  out+=TF(300,354,s.r>=50?'The bars approach e^r: here '+top.toFixed(4)+'. With r = 100% that is e = 2.71828…':'The lower the rate, the less the frequency matters: at 5% it adds only about 0.1p.',13,C.muted);
  return {svg:out,phase:'Each extra addition gives interest a little longer to earn interest. The gain shrinks as additions become more frequent, and the total approaches a limit: eʳ. Bernoulli asked this question in 1683, which is how the number e first appeared.'};
 }});

const E5_db=(r,t)=>t*Math.log2(1+r/100);
SCENE({id:'compound-interest-surface',name:'Rate and time together',tag:'A map of doublings',
 definition:'How much a sum grows depends on rate and time together: the number of doublings is t × log₂(1 + r). Combinations with the same product r × t give roughly the same growth.',
 example:'4% for 36 years and 8% for 18 years both double a sum about twice, multiplying it by about 4.',
 desc:'A map with the interest rate across and years up, shaded by how many times the money has doubled. Curves join combinations that give 2×, 4×, 8×, 16× and 32×. In 3D the number of doublings rises as a surface.',
 research:'Exact doubling time ln 2 ÷ ln(1 + r); the curves are t = k ln 2 ÷ ln(1 + r) for k doublings. Compare the rule of 72: r × t ≈ 72 per doubling.',
 dur:10,hint:'Move the point along one curve: a lower rate needs proportionally more years to reach the same multiple.',
 init:()=>({r:5,yrs:30}),
 watch(p){return {r:Math.round(lerp(2,9,smooth(p))*2)/2,yrs:Math.round(lerp(40,15,smooth(p)))}},
 ui:[{range:'r',label:'Interest rate',min:.5,max:10,step:.5,get:s=>s.r,act:'r',show:v=>Number(v).toFixed(1)+'%'},
  {range:'yrs',label:'Years',min:1,max:50,step:1,get:s=>s.yrs,act:'yrs',show:v=>v+' years'}],
 on:{r(s,v){s.r=Number(v)},yrs(s,v){s.yrs=Number(v)}},
 draw(s){
  let out=heading('How many times does the money double?',26);
  const pl=E5_plot(70,50,330,224,[0,10],[0,50],{xt:[[0,'0%'],[2,'2%'],[4,'4%'],[6,'6%'],[8,'8%'],[10,'10%']],yt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40'],[50,'50']],xl:'interest rate',yl:'years'});out+=pl.svg;
  const cw=330/20,ch=224/20;
  for(let i=0;i<20;i++)for(let j=0;j<20;j++){const d=E5_db((i+.5)/2,(j+.5)*2.5);out+=R(70+i*cw,50+224-(j+1)*ch,cw+.3,ch+.3,tint(C.coral,1-clamp(d/7,0,1)*.75),'none',0)}
  for(let k=1;k<=5;k++){const pts=[];for(let i=1;i<=100;i++){const r=i/10,t=k/Math.log2(1+r/100);if(t<=50)pts.push([pl.X(r),pl.Y(t)])}
   out+=E5_poly(pts,C.ink,1.4);if(pts.length){const q=pts[Math.min(pts.length-1,Math.floor(pts.length*.82))];out+=TF(q[0]+4,q[1]-4,(1<<k)+'×',12,C.ink,'start')}}
  out+=Ci(pl.X(s.r),pl.Y(s.yrs),7,C.blue,'#fff');
  const d=E5_db(s.r,s.yrs),m=Math.pow(2,d);
  out+=counter(420,60,'doublings',d.toFixed(2),C.coral,150)+counter(420,116,'money multiplied by',m.toFixed(2)+'×',C.blue,150)+counter(420,172,'r × t',(s.r*s.yrs).toFixed(0),C.muted,150);
  out+=E5_lines(420,246,['Each doubling needs','r × t of about 72.'],13,C.muted);
  out+=T(300,334,`${s.r}% for ${s.yrs} years multiplies money by ${m.toFixed(2)}`,15);
  out+=TF(300,358,'Darker shading: more doublings. The curves are hyperbolas, close to r × t = constant.',13,C.muted);
  return {svg:out,phase:'Growth depends on the product of rate and time. That is why starting to save ten years earlier can matter as much as finding a much higher rate.'};
 },
 three(s,f,X,project){
  const P=project([0,10,0,10,0,7]);let out='';
  for(let j=0;j<=10;j++)out+=E5_poly(range(21).map(i=>P([i/2,j,E5_db(i/2,j*5)])),C.coral,1.3);
  for(let i=0;i<=10;i++)out+=E5_poly(range(21).map(j=>P([i,j/2,E5_db(i,j*2.5)])),C.line,1);
  out+=point3([s.r,s.yrs/5,E5_db(s.r,s.yrs)],P,C.blue,7,'#fff');
  const a=P([10,0,0]),b=P([0,10,0]),c=P([0,0,7]);out+=TF(a[0],a[1]+16,'rate 10%',12,C.muted)+TF(b[0],b[1]+16,'50 years',12,C.muted)+TF(c[0],c[1]-8,'7 doublings',12,C.muted);
  return {svg:out,title:'Doublings as a surface',caption:'Height is the number of doublings. It rises with rate and with time, steepest where both are large.'};
 }});

/* ================================================================ bank-runs */
function E5_sheet(res,wd,hc){
 const loans=108-res,h=hc/100;let resLeft=res-wd,sold=0,loss=0,illiquid=false;
 if(wd>res){resLeft=0;sold=(wd-res)/(1-h);if(sold>loans){illiquid=true;sold=loans}loss=sold*h}
 return {loans,resLeft,loansLeft:loans-sold,sold,loss,eq:8-loss,dep:100-wd,fail:illiquid||8-loss<0,illiquid};
}
SCENE({id:'bank-runs',name:'A bank’s balance sheet',tag:'Why sound banks can fail',
 definition:'A bank keeps only a fraction of deposits as reserves and lends the rest. If many depositors withdraw at once, it must sell loans quickly, often at a loss; if the losses exceed its capital (equity), the bank becomes insolvent.',
 example:'A bank with 10% reserves and 8% equity that can sell loans only at half their value fails when about 18% of deposits are withdrawn at once.',
 desc:'Two balance sheets, before and after a wave of withdrawals: reserves and loans on the asset side, deposits and equity on the other. A graph shows the bank’s equity falling as withdrawals grow, and where it fails.',
 research:'Diamond, D. W. & Dybvig, P. H. (1983). Bank runs, deposit insurance, and liquidity. Journal of Political Economy 91, 401–419. Bagehot, W. (1873). Lombard Street. The numbers are a stylised bank: deposits 100, equity 8.',
 dur:10,hint:'Raise the withdrawals until the bank fails. Then give it more reserves, or make fire sales less costly, and see how far it can go.',
 init:()=>({res:10,wd:12,hc:50}),
 watch(p){return {res:10,wd:Math.round(lerp(0,30,smooth(p))),hc:50}},
 ui:[{range:'res',label:'Reserves',min:2,max:30,step:1,get:s=>s.res,act:'res',show:v=>v+'% of deposits'},
  {range:'wd',label:'Deposits withdrawn',min:0,max:60,step:1,get:s=>s.wd,act:'wd',show:v=>v+'%'},
  {range:'hc',label:'Loss on fire-sold loans',min:0,max:70,step:5,get:s=>s.hc,act:'hc',show:v=>v+'%'}],
 on:{res(s,v){s.res=Number(v)},wd(s,v){s.wd=Number(v)},hc(s,v){s.hc=Number(v)}},
 draw(s){
  const a=E5_sheet(s.res,s.wd,s.hc),b=E5_sheet(s.res,0,s.hc),k=1.85,base=282;let out=heading('Assets and liabilities, before and after withdrawals',26);
  const col=(x,parts,lab)=>{let y=base,o='';parts.forEach(([v,c,t])=>{if(v<=0)return;const hh=v*k;o+=R(x,y-hh,60,hh,c,'#fff',2,'stroke-width="1"');if(hh>16)o+=TF(x+30,y-hh/2+4,t,12,'#fff');y-=hh});return o+TF(x+30,base+16,lab,12,C.muted)};
  out+=col(36,[[b.resLeft,C.green,'reserves'],[b.loansLeft,C.blue,'loans']],'assets')+col(100,[[b.dep,C.purple,'deposits'],[b.eq,C.amber,'equity']],'liabilities');
  out+=TBF(98,62,'Before',14,C.muted);
  out+=col(196,[[a.resLeft,C.green,'reserves'],[a.loansLeft,C.blue,'loans']],'assets')+col(260,[[a.dep,C.purple,'deposits'],[Math.max(0,a.eq),C.amber,'equity']],'liabilities');
  out+=TBF(258,62,'After',14,C.muted);
  if(a.eq<0)out+=R(260,base-a.dep*k-(-a.eq)*k,60,-a.eq*k,'none',C.coral,2,'stroke-width="2" stroke-dasharray="4 3"')+TF(290,base-a.dep*k-(-a.eq)*k-6,'hole',12,C.coral);
  const pl=E5_plot(380,64,190,190,[0,60],[-20,10],{xt:[[0,'0'],[20,'20'],[40,'40'],[60,'60%']],yt:[[-20,'−20'],[-10,'−10'],[0,'0'],[8,'8']],xl:'withdrawn',yl:'equity left'});out+=pl.svg;
  out+=L(380,pl.Y(0),570,pl.Y(0),C.coral,1.2,'stroke-dasharray="4 3"');
  out+=E5_poly(range(61).map(w=>[pl.X(w),pl.Y(clamp(E5_sheet(s.res,w,s.hc).eq,-20,10))]),C.amber,2.5);
  out+=Ci(pl.X(s.wd),pl.Y(clamp(a.eq,-20,10)),6,a.fail?C.coral:C.amber,'#fff');
  let thr=null;for(let w=0;w<=60;w+=.5)if(E5_sheet(s.res,w,s.hc).fail){thr=w;break}
  out+=T(300,338,a.fail?`The bank fails: ${a.illiquid?'it runs out of loans to sell':'fire-sale losses exceed its equity'}.`:`The bank survives with equity of ${a.eq.toFixed(1)} (of 8).`,15,a.fail?C.coral:C.green);
  out+=TF(300,358,thr!==null?`With these settings a run of ${thr}% of deposits is enough to sink it.`:'With these settings it survives even a 60% run.',13,C.muted);
  return {svg:out,phase:'The bank was solvent before the run: its assets (reserves plus loans) were worth more than its deposits. Selling them in a hurry destroys value, so a run can bring down a sound bank. That is why runs can be self-fulfilling.'};
 }});

// Diamond–Dybvig style game: 10 depositors with £1 each. The bank holds 3 in cash and 7 in loans that pay 1.5
// at maturity but only 0.5 if sold early. n = number who withdraw now.
function E5_pay(n){
 if(n<=3)return {w:1,s:n<10?(3-n+7*1.5)/(10-n):0};
 const sell=2*(n-3);
 if(sell<=7)return {w:1,s:n<10?(7-sell)*1.5/(10-n):0};
 return {w:6.5/n,s:0};
}
function E5_rum(seed){const r=rng(seed*7+3);return range(8).map(()=>.05+r()*.6)}
function E5_others(seed,i,prev){const r=rng(seed*131+i*17+(prev?5:0)+1),p=clamp(E5_rum(seed)[i]+(prev?.2:0),0,.95);let k=0;for(let j=0;j<9;j++)if(r()<p)k++;return k}
function E5_play(seed,choices){const res=[];choices.forEach((c,i)=>{const prev=i>0&&res[i-1].n>=5,k=E5_others(seed,i,prev),you=c==='out'?1:0,n=k+you,pay=E5_pay(n);
 res.push({c,k,n,got:you?pay.w:pay.s,best:Math.max(E5_pay(k).s,E5_pay(k+1).w)})});return res}
SCENE({id:'bank-runs-game',name:'Wait or withdraw?',tag:'A bank run you can join',
 definition:'In the Diamond–Dybvig model a bank run is a coordination failure: if others keep their money in, it pays you to wait; if enough others withdraw, it pays you to withdraw too. Both outcomes are stable, and rumours can tip the bank from one to the other.',
 example:'Here waiting pays more than withdrawing as long as at most 4 of the other 9 depositors withdraw. If 5 or more go, waiting leaves you with less than £1.',
 desc:'You are one of ten depositors, each with £1, over eight rounds. Each round you hear how worried the queue is, choose to wait or withdraw, and see how many of the nine simulated depositors withdrew and what you received. A graph shows the payoff from waiting and from withdrawing against the number of others who withdraw.',
 research:'Diamond, D. W. & Dybvig, P. H. (1983). Journal of Political Economy 91, 401–419 (Nobel Prize 2022 with Ben Bernanke). Laboratory versions: Madiès, P. (2006). An experimental exploration of self-fulfilling banking panics. Journal of Business 79, 1831–1866: runs were frequent and persistent once started. Garratt, R. & Keister, T. (2009). Bank runs as coordination failures: an experimental study. Journal of Economic Behavior & Organization 71, 300–317. Simulated depositors here are a toy model.',
 dur:14,hint:'Nothing is paid and your choices stay in this page. Watch the rumours: once a run starts, the simulated depositors grow more nervous.',
 init:()=>({seed:5,ch:[]}),
 watch(p){const n=Math.min(8,Math.floor(p*9)),rum=E5_rum(5);return {seed:5,ch:range(n).map(i=>rum[i]>=.42?'out':'stay'),sim:true}},
 ui:[{b:'Wait',act:'go',arg:'stay'},{b:'Withdraw',act:'go',arg:'out'},{b:'Start again',act:'again'}],
 on:{go(s,v){if(s.ch.length>=8)return;s.ch.push(v);if(v==='out')AUDIO.tone(988,{dur:.07,gain:.05,type:'triangle'})},again(s){s.seed=nextSeed()%997+1;s.ch=[]}},
 draw(s){
  const res=E5_play(s.seed,s.ch),i=res.length,rum=E5_rum(s.seed);let out=heading('Wait or withdraw? You are one of ten depositors',26);
  if(i<8){const worried=Math.round(clamp(rum[i]+(i>0&&res[i-1].n>=5?.2:0),0,.95)*9);
   out+=R(30,42,540,56,C.pale,'none',10)+TBF(300,64,`Round ${i+1} of 8${s.sim?' · simulated participant':''}`,15,C.ink)+TF(300,86,`Talk in the queue: about ${worried} of the other 9 say they are worried`,14,worried>=5?C.coral:C.ink)}
  else{const tot=res.reduce((a,r)=>a+r.got,0),best=res.reduce((a,r)=>a+r.best,0);
   out+=R(30,42,540,56,C.greenp,'none',10)+TBF(300,64,`${s.sim?'Simulated depositor':'You'} received £${tot.toFixed(2)} from £8 deposited`,15,C.green)+TF(300,86,`The best choice each round, given what the others did, would have given £${best.toFixed(2)}`,13,C.ink)}
  const pl=E5_plot(70,122,250,160,[0,9],[0,1.6],{xt:[[0,'0'],[3,'3'],[6,'6'],[9,'9']],yt:[[0,'£0'],[.5,'£0.50'],[1,'£1'],[1.5,'£1.50']],xl:'others who withdraw',yl:'what you get per £1'});out+=pl.svg;
  out+=E5_poly(range(10).map(k=>[pl.X(k),pl.Y(E5_pay(k).s)]),C.blue,2.5)+E5_poly(range(10).map(k=>[pl.X(k),pl.Y(E5_pay(k+1).w)]),C.coral,2.5);
  out+=L(pl.X(4.5),122,pl.X(4.5),282,C.muted,1,'stroke-dasharray="3 3"');
  out+=TF(pl.X(.2),pl.Y(1.42)-6,'wait',13,C.blue,'start')+TF(pl.X(8.8),pl.Y(.62)+18,'withdraw',13,C.coral,'end');
  if(i>0)out+=Ci(pl.X(res[i-1].k),pl.Y(res[i-1].c==='out'?E5_pay(res[i-1].k+1).w:E5_pay(res[i-1].k).s),6,C.ink,'#fff');
  out+=TF(360,120,'round · you · others out · got',12,C.muted,'start');
  range(8).forEach(j=>{const y=140+j*20,r=res[j];if(!r){out+=TF(360,y,`${j+1}`,13,C.grid,'start');return}
   out+=TF(360,y,`${j+1}`,13,C.muted,'start')+TF(384,y,r.c==='out'?'withdrew':'waited',13,r.c==='out'?C.coral:C.blue,'start')+TF(470,y,`${r.k}`,13,r.n>=5?C.coral:C.ink,'start')+TF(510,y,`£${r.got.toFixed(2)}`,13,C.ink,'start')});
  out+=T(300,330,'Waiting pays if at most 4 of the other 9 withdraw; otherwise withdrawing pays.',14);
  out+=TF(300,354,'Two stable outcomes: nobody runs (all get £1.35) or all run (all get £0.65).',13,C.muted);
  return {svg:out,phase:'Each depositor’s best choice depends on what they expect the others to do. That makes a run self-fulfilling: fear of a run causes one, even at a bank whose loans are sound. Deposit insurance and a lender of last resort are designed to remove that fear.'};
 }});

const E5_RUNS=[
 {t:'United States, 1930–33',d:'About 9,000 banks suspended in waves of panic. Federal deposit insurance began in 1934, and runs on insured US banks nearly disappeared for decades.'},
 {t:'Northern Rock, September 2007',d:'Queues formed outside branches in the first run on a British bank since Overend, Gurney in 1866. The guarantee then covered only 90% of deposits above £2,000, so it paid to run; the Treasury then guaranteed all deposits.'},
 {t:'Silicon Valley Bank, March 2023',d:'Customers asked to withdraw about $42 billion in a single day, many by phone app. Around nine in ten of its deposits were above the $250,000 insurance limit.'}];
SCENE({id:'bank-runs-insurance',name:'Stopping runs',tag:'Deposit insurance and three real runs',
 definition:'Deposit insurance guarantees depositors their money up to a limit, so waiting never pays less than withdrawing. That removes the reason to run, as long as depositors believe the guarantee and their deposits are covered.',
 example:'With insurance, a depositor gets at least £1 whatever others do, so nobody needs to queue. Runs in 2007 and 2023 hit banks where many deposits were not fully covered.',
 desc:'The wait-or-withdraw payoffs from the bank-run game, with and without a guarantee that waiters get at least £1. A second view describes three real runs.',
 research:'Diamond & Dybvig (1983). Friedman, M. & Schwartz, A. J. (1963), A Monetary History, on the 1930–33 panics. Shin, H. S. (2009). Reflections on Northern Rock: the bank run that heralded the global financial crisis. Journal of Economic Perspectives 23(1), 101–119. Federal Reserve Board (2023). Review of the Federal Reserve’s Supervision and Regulation of Silicon Valley Bank.',
 dur:10,hint:'Switch insurance on and see the waiting line lift. Then read how each real run unfolded.',
 init:()=>({ins:'off',view:'model'}),
 watch(p){return p<.5?{ins:p<.25?'off':'on',view:'model'}:{ins:'on',view:'history'}},
 ui:[{choose:[['model','The model'],['history','Three runs']],label:'View',get:s=>s.view,act:'view'},
  {choose:[['off','No insurance'],['on','Deposits insured']],label:'Guarantee',get:s=>s.ins,act:'ins'}],
 on:{view(s,v){s.view=v},ins(s,v){s.ins=v}},
 draw(s){
  let out=heading(s.view==='model'?'Does it still pay to run?':'Three bank runs',26);
  if(s.view==='model'){const ins=s.ins==='on',ws=k=>ins?Math.max(1,E5_pay(k).s):E5_pay(k).s;
   const pl=E5_plot(80,56,440,220,[0,9],[0,1.6],{xt:range(10).map(k=>[k,String(k)]),yt:[[0,'£0'],[.5,'£0.50'],[1,'£1'],[1.5,'£1.50']],xl:'other depositors who withdraw',yl:'what you get per £1'});out+=pl.svg;
   out+=E5_poly(range(10).map(k=>[pl.X(k),pl.Y(E5_pay(k+1).w)]),C.coral,2.5)+E5_poly(range(10).map(k=>[pl.X(k),pl.Y(ws(k))]),C.blue,3);
   if(ins)out+=E5_poly(range(10).map(k=>[pl.X(k),pl.Y(E5_pay(k).s)]),C.blue,1.2,'stroke-dasharray="4 4"');
   out+=TF(pl.X(.2),pl.Y(1.42)-8,ins?'wait (insured)':'wait',13,C.blue,'start')+TF(pl.X(8.8),pl.Y(.6)+20,'withdraw',13,C.coral,'end');
   out+=T(300,334,ins?'Waiting never pays less than withdrawing, so there is no reason to run.':'Once 5 or more others run, waiting pays less: so fear alone can start a run.',15,ins?C.green:C.coral);
   out+=TF(300,358,'Insurance shifts the cost of a failure to the insurer, which is why insured banks are also regulated.',13,C.muted)}
  else{E5_RUNS.forEach((r,i)=>{const y=44+i*96;out+=R(30,y,540,88,'#fff',C.grid,10)+TBF(46,y+24,r.t,15,C.ink,'start')+E5_lines(46,y+46,E5_wrap(r.d,78),13,C.ink,'start',17)});
   out+=TF(300,350,s.ins==='on'?'In each case a wider guarantee ended the run.':'Each run struck where depositors doubted they would be paid in full.',13,C.muted)}
  return {svg:out,phase:'A credible guarantee changes the game so that waiting is always at least as good as running. The price is moral hazard: insured banks may take more risk, so they are supervised and must hold capital.'};
 }});

/* ================================================================ exchange-rates */
SCENE({id:'exchange-rates',name:'What should a pound buy?',tag:'Purchasing power parity and the burger standard',
 definition:'Purchasing power parity (PPP) says that, in the long run, exchange rates should move so that the same basket of goods costs the same in every country. Comparing the price of one standard product, as in The Economist’s Big Mac index, is a light-hearted version.',
 example:'If a burger costs £4.50 in Britain and $5.80 in America, PPP implies $1.29 per pound. If the market rate is $1.27, the pound is about 1.5% undervalued by the burger standard.',
 desc:'Two price tags, one in pounds and one in dollars, with the market exchange rate between them. A gauge shows how far the pound is over- or undervalued compared with the rate that would make the prices equal.',
 research:'Cassel, G. (1918). Abnormal deviations in international exchanges. Economic Journal 28, 413–415. The Economist’s Big Mac index, published since 1986. Rogoff, K. (1996). The purchasing power parity puzzle. Journal of Economic Literature 34, 647–668: deviations from PPP halve in roughly 3 to 5 years. Prices here are illustrative.',
 dur:10,hint:'Change the market rate and the two prices. Why might a burger be cheaper in one country for years? Think about rents and wages.',
 init:()=>({uk:4.5,us:5.8,rate:1.27}),
 watch(p){return {uk:4.5,us:5.8,rate:Math.round(lerp(1,1.6,smooth(p))*100)/100}},
 ui:[{range:'uk',label:'Price in Britain',min:3,max:6,step:.1,get:s=>s.uk,act:'uk',show:v=>'£'+Number(v).toFixed(2)},
  {range:'us',label:'Price in the US',min:3,max:8,step:.1,get:s=>s.us,act:'us',show:v=>'$'+Number(v).toFixed(2)},
  {range:'rate',label:'Market rate',min:.8,max:2,step:.01,get:s=>s.rate,act:'rate',show:v=>'$'+Number(v).toFixed(2)+' per £'}],
 on:{uk(s,v){s.uk=Number(v)},us(s,v){s.us=Number(v)},rate(s,v){s.rate=Number(v)}},
 draw(s){
  const ppp=s.us/s.uk,val=s.rate/ppp-1;let out=heading('Is the pound over- or undervalued?',26);
  const tag=(x,c,p,lab)=>R(x,52,170,92,'#fff',c,12,'stroke-width="2.5"')+TF(x+85,76,lab,13,C.muted)+TBF(x+85,116,p,28,c);
  out+=tag(40,C.blue,'£'+s.uk.toFixed(2),'a burger in Britain')+tag(390,C.green,'$'+s.us.toFixed(2),'a burger in the US');
  out+=arrow(220,86,384,86,C.ink,2,8)+TF(302,78,`market: £1 = $${s.rate.toFixed(2)}`,13,C.ink)+TF(302,108,`prices imply £1 = $${ppp.toFixed(2)}`,13,C.muted);
  out+=TF(302,126,`in Britain it costs $${(s.uk*s.rate).toFixed(2)}`,13,C.muted);
  const gx=v=>300+clamp(v,-.5,.5)*500;
  out+=R(50,190,500,22,'#fff',C.line,11);out+=R(50,190,250,22,C.coralp,'none',11)+R(300,190,250,22,C.pale,'none',11);
  [-.5,-.25,0,.25,.5].forEach(v=>out+=L(gx(v),212,gx(v),220,C.line,1)+TF(gx(v),236,(v>0?'+':v<0?'−':'')+Math.abs(v*100)+'%',12,C.muted));
  out+=TF(60,180,'pound undervalued',13,C.coral,'start')+TF(540,180,'pound overvalued',13,C.blue,'end');
  out+=Ci(gx(val),201,10,Math.abs(val)<.02?C.ink:val>0?C.blue:C.coral,'#fff','stroke-width="2.5"');
  out+=T(300,276,Math.abs(val)<.005?'By the burger standard the pound is at parity.':`By the burger standard the pound is ${E5_pc(Math.abs(val))} ${val>0?'overvalued':'undervalued'}.`,16,val>0?C.blue:C.coral);
  out+=TF(300,304,'Prices illustrative. The Economist has published its Big Mac index since 1986.',13,C.muted);
  out+=TF(300,350,'PPP holds poorly year to year: gaps take about 3–5 years to halve (Rogoff 1996).',13,C.muted);
  return {svg:out,phase:'A burger is made partly from traded ingredients and partly from local rent and wages, which differ between countries. So PPP is a long-run pull on exchange rates, not a prediction of next year’s rate.'};
 }});

const E5_TRI={
 peg:{n:'Fixed rate + free capital',give:'You give up: your own interest rates',ex:'Euro-area countries share the European Central Bank’s rate. Hong Kong has pegged to the US dollar since 1983, so its rates follow the Fed’s.'},
 float:{n:'Free capital + own policy',give:'You give up: a fixed exchange rate',ex:'The UK, the US and Japan let their currencies float, so the Bank of England can set rates for British conditions.'},
 controls:{n:'Fixed rate + own policy',give:'You give up: free movement of capital',ex:'Under Bretton Woods (1944–71) countries fixed rates and kept their own policies by limiting capital flows. China managed its rate with capital controls.'}};
SCENE({id:'exchange-rates-trilemma',name:'The impossible trinity',tag:'Pick two of three',
 definition:'A country cannot have all three at once: a fixed exchange rate, free movement of capital and an interest rate set for its own economy. It must choose two and give up the third.',
 example:'Hong Kong fixes its dollar to the US dollar and allows money to move freely, so it cannot set its own interest rates: they follow the Federal Reserve’s.',
 desc:'A triangle whose corners are the three goals. Press a side to choose the two goals it joins and see what the country gives up and which countries chose that side.',
 research:'Mundell, R. A. (1963). Capital mobility and stabilization policy under fixed and flexible exchange rates. Canadian Journal of Economics and Political Science 29, 475–485. Fleming, J. M. (1962). IMF Staff Papers 9, 369–380. Obstfeld, M., Shambaugh, J. C. & Taylor, A. M. (2005). The trilemma in history. Review of Economics and Statistics 87, 423–438. Rey, H. (2013). Dilemma not trilemma (Jackson Hole): a global financial cycle may limit even floating countries. Debated.',
 dur:10,hint:'Press each side of the triangle. Which side does your own country sit on?',
 init:()=>({side:'float'}),
 watch(p){return {side:['peg','float','controls'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:Object.keys(E5_TRI).map(k=>[k,E5_TRI[k].n]),label:'Choose two',get:s=>s.side,act:'side'}],
 on:{side(s,v){s.side=v}},
 draw(s,f,X){
  const A=[170,64],B=[50,284],Cc=[286,284],d=E5_TRI[s.side];let out=heading('Pick two of three',26);
  const sides={peg:[A,B],float:[B,Cc],controls:[A,Cc]};
  for(const k in sides){const [p,q]=sides[k],on=k===s.side,mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2;
   out+=L(p[0],p[1],q[0],q[1],on?C.coral:C.line,on?6:3);
   out+=hit(X,'side',k,E5_TRI[k].n,Ci(mx,my,14,on?C.coral:'#fff',on?C.coral:C.blue,'stroke-width="2"')+TBF(mx,my+5,k==='peg'?'1':k==='float'?'2':'3',13,on?'#fff':C.blue))}
  const corner=(p,l1,l2,dy)=>Ci(p[0],p[1],7,C.ink)+TF(p[0],p[1]+dy,l1,13,C.ink)+TF(p[0],p[1]+dy+15,l2,13,C.ink);
  out+=corner(A,'Fixed','exchange rate',-30)+corner(B,'Free','capital',20)+corner(Cc,'Own interest','rates',20);
  out+=R(356,56,216,250,'#fff',C.grid,10)+TBF(368,82,d.n,14,C.coral,'start')+TF(368,106,d.give,13,C.ink,'start');
  out+=E5_lines(368,134,E5_wrap(d.ex,29),13,C.ink,'start',17);
  out+=TF(300,350,'Rey (2013) argues global money flows constrain even floating countries: debated.',13,C.muted);
  return {svg:out,phase:`${d.n}. ${d.give.replace('You give up: ','The cost: ')}. If capital can move freely and the rate is fixed, any attempt to set a different interest rate sends money flooding in or out until the peg breaks or the rate is brought back in line.`};
 }});

SCENE({id:'exchange-rates-depreciation',name:'When the pound falls',tag:'Import prices, inflation and exports',
 definition:'When a currency depreciates, imports cost more in that currency and exports become cheaper abroad. How much of the fall reaches shop prices (the pass-through) depends on how much is imported and on how firms set prices.',
 example:'A 15% fall in the pound with full pass-through raises import prices by about 18%; if imports are 30% of the shopping basket, consumer prices rise by about 5%.',
 desc:'A chain of bars from the fall in the pound to import prices and then consumer prices, with a bar for how much cheaper British exports become abroad. Sliders set the fall, the import share and the pass-through.',
 research:'Forbes, K., Hjortsoe, I. & Nenova, T. (2018). The shocks matter: improving our estimates of exchange rate pass-through. Journal of International Economics 114, 255–275. After the June 2016 referendum sterling fell by around 15–20% and UK consumer price inflation rose to about 3% by late 2017 (ONS). The model is a simple sketch.',
 dur:10,hint:'Try a 15% fall with 30% imports and 60% pass-through, roughly the UK after 2016.',
 init:()=>({dep:15,share:30,pass:60}),
 watch(p){return {dep:Math.round(lerp(0,25,smooth(p))),share:30,pass:60}},
 ui:[{range:'dep',label:'Fall in the pound',min:0,max:30,step:1,get:s=>s.dep,act:'dep',show:v=>v+'%'},
  {range:'share',label:'Imports in the basket',min:10,max:50,step:1,get:s=>s.share,act:'share',show:v=>v+'%'},
  {range:'pass',label:'Pass-through',min:0,max:100,step:5,get:s=>s.pass,act:'pass',show:v=>v+'%'}],
 on:{dep(s,v){s.dep=Number(v)},share(s,v){s.share=Number(v)},pass(s,v){s.pass=Number(v)}},
 draw(s){
  const d=s.dep/100,imp=d/(1-d)*s.pass/100,cpi=imp*s.share/100,exp=d;let out=heading(`The pound falls ${s.dep}%: what happens to prices?`,26);
  const rows=[['the pound buys fewer dollars','−'+s.dep+'%',d,C.ink],['import prices in pounds','+'+(imp*100).toFixed(1)+'%',imp,C.coral],['consumer prices','+'+(cpi*100).toFixed(1)+'%',cpi,C.coral],['British exports, priced abroad','−'+s.dep+'%',exp,C.green]];
  rows.forEach(([l,v,x,col],i)=>{const y=60+i*58;out+=TF(46,y,l,14,C.ink,'start')+R(46,y+8,Math.max(2,x*1000),22,col===C.ink?C.muted:col,'none',4)+TBF(Math.max(2,x*1000)+56,y+25,v,14,col,'start')});
  out+=T(300,316,`Inflation rises by about ${(cpi*100).toFixed(1)} points, spread over a year or two.`,15,C.coral);
  out+=TF(300,342,'Exporters gain sales abroad, but over time higher prices can erode the advantage.',13,C.muted);
  out+=TF(300,362,'A sketch: real pass-through depends on why the currency fell (Forbes et al. 2018).',13,C.muted);
  return {svg:out,phase:'A weaker currency is a trade-off: it helps exporters and firms competing with imports, but it makes households poorer by raising the price of what they buy from abroad.'};
 }});

/* ================================================================ financial-crises */
const E5_mix=t=>{const h=.85-.55*smooth(t/20),po=.3*smooth((t-6)/14);return {h,sp:1-h-po,po}};
SCENE({id:'financial-crises',name:'Stability breeds instability',tag:'Minsky’s financial instability hypothesis',
 definition:'Hyman Minsky argued that long calm periods make borrowers bolder. Hedge borrowers can repay interest and principal from income; speculative borrowers can pay only interest and must roll over debts; Ponzi borrowers rely on rising asset prices just to pay interest. As the mix tilts towards the last two, a small shock can set off a crash.',
 example:'In the years before 2008 many mortgages could only be repaid if house prices kept rising. When prices fell, those borrowers defaulted together.',
 desc:'A stacked area shows the share of hedge, speculative and Ponzi borrowers over twenty calm years. A grid of 100 borrowers shows the mix at your chosen year; a shock marks which borrowers fail.',
 research:'Minsky, H. P. (1986). Stabilizing an Unstable Economy. Yale University Press. Minsky, H. P. (1992). The financial instability hypothesis. Levy Economics Institute Working Paper 74. The phrase “Minsky moment” was coined by Paul McCulley in 1998. Shares here are illustrative.',
 dur:12,hint:'Move through the calm years, then press Shock. How many borrowers fail at year 5 compared with year 18?',
 init:()=>({t:10,shock:false}),
 watch(p){return {t:Math.round(lerp(0,20,smooth(Math.min(1,p/.75)))),shock:p>.8}},
 ui:[{range:'t',label:'Years of calm',min:0,max:20,step:1,get:s=>s.t,act:'t',show:v=>v+' years'},{b:'Shock: prices fall',act:'shock'},{b:'Calm again',act:'calm'}],
 on:{t(s,v){s.t=Number(v)},shock(s){s.shock=true},calm(s){s.shock=false}},
 draw(s){
  const m=E5_mix(s.t);let out=heading(`After ${s.t} calm years`,26);
  const pl=E5_plot(70,56,250,220,[0,20],[0,1],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20']],yt:[[0,'0%'],[.5,'50%'],[1,'100%']],xl:'years of calm',yl:'share of borrowers'});out+=pl.svg;
  const ts=range(41).map(i=>i/2),band=(lo,hi,col)=>P('M'+ts.map(t=>fmt(pl.X(t))+' '+fmt(pl.Y(hi(t)))).join(' L')+' L'+ts.slice().reverse().map(t=>fmt(pl.X(t))+' '+fmt(pl.Y(lo(t)))).join(' L')+' Z',col,0,col,'fill-opacity=".8"');
  out+=band(t=>0,t=>E5_mix(t).h,C.green)+band(t=>E5_mix(t).h,t=>E5_mix(t).h+E5_mix(t).sp,C.amber)+band(t=>1-E5_mix(t).po,t=>1,C.coral);
  out+=L(pl.X(s.t),56,pl.X(s.t),276,C.ink,2);
  const nh=Math.round(m.h*100),np=Math.round(m.po*100),ns=100-nh-np;let failed=0,strained=0;
  for(let i=0;i<100;i++){const x=356+(i%10)*21,y=64+Math.floor(i/10)*21,type=i<nh?0:i<nh+ns?1:2,col=[C.green,C.amber,C.coral][type];
   const fail=s.shock&&(type===2||(type===1&&i%3===0));if(fail){failed++;out+=R(x-8,y-8,16,16,'#fff',col,3,'stroke-width="1.5"')+L(x-6,y-6,x+6,y+6,col,1.5)+L(x+6,y-6,x-6,y+6,col,1.5)}else out+=R(x-8,y-8,16,16,col,'none',3)}
  out+=TF(356,286,`hedge ${nh}`,13,C.green,'start')+TF(420,286,`speculative ${ns}`,13,C.amber,'start')+TF(516,286,`Ponzi ${np}`,13,C.coral,'start');
  out+=T(300,330,s.shock?`The shock: ${failed} of 100 borrowers default.`:'Press Shock to see who is exposed.',15,s.shock?C.coral:C.ink);
  out+=TF(300,356,'Shares illustrative. Minsky’s hypothesis is influential but hard to test directly.',13,C.muted);
  return {svg:out,phase:'Calm makes lenders and borrowers more confident, so debts grow riskier without anyone noticing a single turning point. Minsky’s ideas were neglected until 2008, when many economists began citing them.'};
 }});

SCENE({id:'financial-crises-leverage',name:'Leverage',tag:'Borrowed money magnifies gains and losses',
 definition:'Leverage is the ratio of a firm’s assets to its own capital (equity). With leverage L, a fall of 1 ÷ L in the value of its assets wipes out its equity completely.',
 example:'A bank with £30 of assets for every £1 of equity is wiped out by a 3.3% fall in asset values. Lehman Brothers had leverage of about 30 to 1 before it failed in 2008.',
 desc:'A graph shows how much equity is left as asset prices fall, for your chosen leverage, with reference lines at 10 to 1 and 30 to 1. Tiles give the fall that wipes out equity and the gain on a rise of the same size.',
 research:'Adrian, T. & Shin, H. S. (2010). Liquidity and leverage. Journal of Financial Intermediation 19, 418–437. Lehman Brothers 2007 annual report (net leverage about 16, gross about 31). Basel III leverage ratio: Tier 1 capital of at least 3% of exposures (Basel Committee 2014).',
 dur:10,hint:'Set leverage to 30 and the fall to 4%: the equity is gone. Then try 10 to 1.',
 init:()=>({lev:30,fall:4}),
 watch(p){return {lev:p<.5?10:30,fall:Math.round(lerp(0,12,smooth((p%.5)*2))*2)/2}},
 ui:[{range:'lev',label:'Leverage (assets ÷ equity)',min:1,max:50,step:1,get:s=>s.lev,act:'lev',show:v=>v+' to 1'},
  {range:'fall',label:'Fall in asset prices',min:0,max:30,step:.5,get:s=>s.fall,act:'fall',show:v=>v+'%'}],
 on:{lev(s,v){s.lev=Number(v)},fall(s,v){s.fall=Number(v)}},
 draw(s){
  const left=L=>f=>Math.max(-1,1-L*f/100);let out=heading(`Leverage ${s.lev} to 1: what a ${s.fall}% fall does`,26);
  const pl=E5_plot(70,56,320,206,[0,30],[-1,1],{xt:[[0,'0%'],[10,'10%'],[20,'20%'],[30,'30%']],yt:[[-1,'−100%'],[0,'0'],[1,'100%']],xl:'fall in asset prices',yl:'equity left'});out+=pl.svg;
  out+=L(70,pl.Y(0),390,pl.Y(0),C.coral,1.2,'stroke-dasharray="4 3"');
  [[10,C.muted],[30,C.coral]].forEach(([l,col])=>out+=E5_poly(range(121).map(i=>[pl.X(i/4),pl.Y(left(l)(i/4))]),col,1.2,'stroke-dasharray="5 4"'));
  out+=E5_poly(range(121).map(i=>[pl.X(i/4),pl.Y(left(s.lev)(i/4))]),C.blue,3);
  out+=Ci(pl.X(s.fall),pl.Y(left(s.lev)(s.fall)),6,C.blue,'#fff');
  out+=TF(pl.X(30)-4,pl.Y(left(10)(30))-6,'10 to 1',12,C.muted,'end')+TF(pl.X(1.2)+4,pl.Y(-.25),'30 to 1',12,C.coral,'start');
  const e=1-s.lev*s.fall/100;
  out+=counter(420,60,'equity left',e<=0?'none':E5_pc(e,0),e<=0?C.coral:C.blue,150)+counter(420,116,'wiped out by a fall of',(100/s.lev).toFixed(1)+'%',C.coral,150)+counter(420,172,`a ${s.fall}% rise adds`,'+'+(s.lev*s.fall).toFixed(0)+'%',C.green,150);
  out+=E5_lines(420,246,['Leverage cuts both ways:','gains and losses are both','multiplied by L.'],13,C.muted);
  out+=T(300,338,e<=0?'Equity is gone: the firm owes more than it owns.':`${E5_pc(1-e,0)} of the equity is lost.`,15,e<=0?C.coral:C.ink);
  out+=TF(300,358,'Basel III requires banks to hold capital of at least 3% of exposures: leverage of about 33.',13,C.muted);
  return {svg:out,phase:'High leverage lets a firm earn large returns on its own money in good times, but leaves almost no room for losses. Before 2008 many large banks and investment banks ran leverage of 25 to 30 or more.'};
 }});

const E5_CRISES=[
 {y:'1637',t:'Tulip mania',d:'Prices of rare Dutch tulip bulbs rose and collapsed within weeks.',n:'Historians now think its economic damage was small; tales of ruin grew in the retelling (Goldgar 2007).'},
 {y:'1720',t:'South Sea Bubble',d:'Shares in the South Sea Company soared on promises of trade and government debt deals, then crashed, ruining many investors in London.'},
 {y:'1866',t:'Overend, Gurney',d:'A great London discount house failed, setting off a panic that shaped Bagehot’s rule for central banks in a crisis.'},
 {y:'1929',t:'The Great Crash',d:'Wall Street fell sharply; banking panics followed in 1930–33, and the money supply shrank by about a third (Friedman & Schwartz 1963).'},
 {y:'1997',t:'Asian financial crisis',d:'Thailand’s currency peg broke, and capital flight spread to Indonesia, South Korea and others, all with large foreign-currency debts.'},
 {y:'2008',t:'Global financial crisis',d:'Losses on US mortgage securities spread through highly leveraged banks; Lehman Brothers failed on 15 September 2008.',n:'It led to new rules on capital, liquidity and leverage (Basel III).'},
 {y:'2023',t:'Silicon Valley Bank',d:'Rising interest rates cut the value of the bank’s bonds; a fast, app-driven run followed and the bank failed within days.'}];
SCENE({id:'financial-crises-history',name:'Four centuries of crises',tag:'This time is different?',
 definition:'Financial crises recur. Reinhart and Rogoff found common patterns across eight centuries: debts and asset prices rise fast, people explain why “this time is different”, and a shock reveals that many borrowers cannot pay.',
 example:'The South Sea Bubble of 1720 and the mortgage boom before 2008 both combined easy credit, rising prices and new financial products few understood.',
 desc:'A timeline of seven crises from 1637 to 2023. Press each one to read what happened and what was learned.',
 research:'Reinhart, C. M. & Rogoff, K. S. (2009). This Time Is Different: Eight Centuries of Financial Folly. Princeton University Press. Kindleberger, C. P. (1978). Manias, Panics, and Crashes. Goldgar, A. (2007). Tulipmania: Money, Honor, and Knowledge in the Dutch Golden Age. University of Chicago Press. A separate Reinhart–Rogoff paper on debt and growth (2010) was found to contain a spreadsheet error (Herndon, Ash & Pollin 2013); the crisis history is not affected.',
 dur:14,hint:'Press each crisis. Which ones began with too much borrowing?',
 init:()=>({k:5}),
 watch(p){return {k:Math.min(E5_CRISES.length-1,Math.floor(p*E5_CRISES.length))}},
 ui:[{b:'Previous',act:'step',arg:-1},{b:'Next',act:'step',arg:1}],
 on:{pick(s,v){s.k=Number(v)},step(s,v){s.k=clamp(s.k+Number(v),0,E5_CRISES.length-1)}},
 draw(s,f,X){
  let out=heading('Financial crises, 1637 to 2023',26)+E5_timeline(X,s,E5_CRISES,'pick');
  out+=TF(300,354,'A pattern: fast-growing debt, rising prices, then a shock.',13,C.muted);
  return {svg:out,phase:'Each crisis had its own trigger, but most shared a build-up of borrowing and a belief that old risks no longer applied. Some famous stories, like tulip mania, have been exaggerated in the retelling.'};
 }});
