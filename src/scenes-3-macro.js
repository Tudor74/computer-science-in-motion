/* ===================== Economics era 3 · The whole economy (1929–1975) ===================== */
// The Depression forced economists to look at the whole economy at once: how to measure it, how spending
// multiplies, how unemployment and inflation trade off (and stop trading off), how rival schools read a slump,
// and how a world monetary system was built and broke. Historical series are rounded and labelled approximate;
// toy models are labelled illustrative. Every picture is a pure function of state, frame and X.
const E3_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function E3_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function E3_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.sel?(o.selCol||C.blue):C.line,9,o.sel?'stroke-width="3"':'stroke-width="1.5"')+lines.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*17,t,o.size||13,o.ink||C.ink,'middle',o.bold?'font-weight="700"':'')).join('');
 return hit(X,act,arg,label,inner);
}
// Wrap a paragraph into lines of at most n characters.
function E3_wrap(s,n){const out=[];let line='';for(const w of String(s).split(' ')){if((line+' '+w).trim().length>n){if(line)out.push(line);line=w}else line=(line+' '+w).trim()}if(line)out.push(line);return out}
const E3_para=(x,y,s,n,size=13,col=C.ink,dy=18,anchor='start')=>E3_wrap(s,n).map((t,i)=>TF(x,y+i*dy,t,size,col,anchor)).join('');
const E3_tag=(s,col)=>R(470,10,118,26,'#fff',col,13)+TF(529,28,s,13,col);

/* ================================================================ great-depression */
// United States, 1929–1939, rounded. Real GNP index (1929 = 100) after the BEA series; unemployment after
// Lebergott (share of the civilian labour force); consumer prices (1929 = 100) after the BLS CPI.
const E3_YEARS=[1929,1930,1931,1932,1933,1934,1935,1936,1937,1938,1939];
const E3_GDP=[100,91,85,74,73,81,88,100,105,101,109];
const E3_UNEMP=[3.2,8.7,15.9,23.6,24.9,21.7,20.1,16.9,14.3,19.0,17.2];
const E3_CPI=[100,97,89,80,76,78,80,81,84,82,81];
const E3_SERIES=[['gdp','Output (real GNP)'],['unemp','Unemployment'],['cpi','Prices (CPI)']];
SCENE({id:'great-depression',name:'The Great Depression in numbers',tag:'United States, 1929–1939',
 definition:'From 1929 to 1933 American output fell by about a quarter, prices by about a quarter and unemployment rose from about 3% to about 25%. Recovery began in 1933 but unemployment stayed in double figures for the rest of the decade.',
 example:'In 1933 roughly one American worker in four had no job, and real output was about 27% below its 1929 level. A sharp second downturn followed in 1937–38.',
 desc:'Three line charts for the United States, 1929–1939: real output as an index (1929 = 100), the unemployment rate and consumer prices, with a year cursor and the values for that year.',
 research:'Lebergott, S. (1964). Manpower in Economic Growth. US Bureau of Economic Analysis, National Income and Product Accounts (real GNP). US Bureau of Labor Statistics, Consumer Price Index. Romer, C. D. (1993). The nation in depression. Journal of Economic Perspectives 7(2), 19–39. (Figures rounded; approximate.)',
 dur:11,hint:'Move through the years and switch which series is highlighted. Notice that prices fell too: this was a deflation, not just a slump.',
 init:()=>({y:1933,hl:'gdp'}),
 watch(p){return {y:Math.min(1939,1929+Math.floor(p*11)),hl:p<.4?'gdp':p<.7?'unemp':'cpi'}},
 ui:[{range:'y',label:'Year',min:1929,max:1939,step:1,get:s=>s.y,act:'y'},{choose:E3_SERIES,label:'Highlight',get:s=>s.hl,act:'hl'}],
 on:{y(s,v){s.y=Number(v);return 'keep'},hl(s,v){s.hl=v;return 'keep'}},
 draw(s){
  let out=heading('The United States, 1929–1939',28);
  const i=E3_YEARS.indexOf(s.y);
  const pl=E3_plot(64,64,330,230,[1929,1939],[0,120],{xt:[[1929,'1929'],[1933,'1933'],[1937,'1937'],[1939,'1939']],yt:[[40,'40'],[80,'80'],[120,'120']],xl:'year',yl:'index (1929 = 100) or %'});
  out+=pl.svg;
  const ser={gdp:[E3_GDP,C.blue],unemp:[E3_UNEMP,C.coral],cpi:[E3_CPI,C.green]};
  for(const [k] of E3_SERIES){const [d,col]=ser[k];const on=k===s.hl;out+=E3_poly(E3_YEARS.map((y,j)=>[pl.X(y),pl.Y(d[j])]),col,on?3.4:1.6,on?'':'opacity=".45"');}
  out+=L(pl.X(s.y),pl.Y(0),pl.X(s.y),pl.Y(120),C.purple,1.5,'stroke-dasharray="5 4"');
  for(const [k] of E3_SERIES){const [d,col]=ser[k];out+=Ci(pl.X(s.y),pl.Y(d[i]),5,col,'#fff')}
  out+=counter(420,64,'real output',E3_GDP[i]+'',C.blue,160)+counter(420,120,'unemployment',E3_UNEMP[i].toFixed(1)+'%',C.coral,160)+counter(420,176,'consumer prices',E3_CPI[i]+'',C.green,160);
  out+=TF(500,250,'Output and prices: 1929 = 100',13,C.muted)+TF(500,268,'Unemployment: % of workers',13,C.muted);
  out+=TF(500,300,'Rounded, approximate',13,C.muted);
  const msg=s.y<=1933?`${s.y}: the slide. Output ${E3_GDP[i]}% of 1929, prices ${E3_CPI[i]}%, ${E3_UNEMP[i].toFixed(1)}% out of work.`:s.y<=1937?`${s.y}: recovery after the 1933 bank holiday and the end of the gold link; output is back to ${E3_GDP[i]}% of 1929 but ${E3_UNEMP[i].toFixed(1)}% are still unemployed.`:`${s.y}: the 1937–38 relapse, often blamed on tighter money and a smaller budget deficit, pushed unemployment back to ${E3_UNEMP[i].toFixed(1)}%.`;
  return {svg:out,phase:msg+' The figures are rounded from the official US series and Lebergott’s unemployment estimates.'};
 }});

// Four explanations, each a causal chain. All are debated; most historians now combine them.
const E3_EXPL={
 money:{name:'Money and banks',who:'Friedman & Schwartz 1963',chain:['Bank panics, 1930–33','Money stock falls by about a third','Prices and spending fall','Output and jobs collapse'],ev:'The money stock fell by about a third from 1929 to 1933 while about 9,000 banks suspended. Friedman and Schwartz blamed the Federal Reserve for letting it happen.'},
 debt:{name:'Debt deflation',who:'Fisher 1933',chain:['Debts fixed in dollars','Falling prices raise the real burden','Distress selling pushes prices lower','Spending and lending dry up'],ev:'Irving Fisher argued that falling prices made every debt heavier, so borrowers cut back and sold assets, pushing prices down further.'},
 demand:{name:'Collapse of spending',who:'Keynes 1936',chain:['Investment collapses','Incomes fall, and spending with them','The multiplier deepens the fall','Unemployment can persist'],ev:'Keynes argued that nothing guarantees spending returns to full employment on its own: a slump can last unless someone, such as government, spends.'},
 gold:{name:'The gold standard',who:'Eichengreen 1992',chain:['Currencies tied to gold','Central banks raise rates to defend gold','Deflation spreads between countries','Recovery waits until a country leaves gold'],ev:'Eichengreen and others found that countries recovered roughly in the order they left gold: Britain in 1931, the US in 1933, France only in 1936.'}};
const E3_EXPL_KEYS=[['money','Money and banks'],['debt','Debt deflation'],['demand','Spending'],['gold','Gold standard']];
SCENE({id:'great-depression-banks',name:'Why was it so deep?',tag:'Four explanations',
 definition:'Economists still argue about why the Depression was so deep and so long. Four explanations stand out: a collapse in money as banks failed, debts made heavier by falling prices, a collapse in spending, and the gold standard spreading deflation around the world.',
 example:'Milton Friedman and Anna Schwartz’s Monetary History (1963) blamed the Federal Reserve for letting the money stock fall by about a third; Ben Bernanke, who later chaired the Fed, said in 2002: “You’re right, we did it.”',
 desc:'A chain of four boxes for the chosen explanation, from first cause to unemployment, with its main author and its evidence.',
 research:'Friedman, M. & Schwartz, A. J. (1963). A Monetary History of the United States, 1867–1960. Princeton University Press. Fisher, I. (1933). The debt-deflation theory of great depressions. Econometrica 1, 337–357. Keynes, J. M. (1936). The General Theory of Employment, Interest and Money. Eichengreen, B. (1992). Golden Fetters. Oxford University Press. Bernanke, B. S. (1983). Nonmonetary effects of the financial crisis. American Economic Review 73, 257–276.',
 dur:12,hint:'Switch between the four explanations. They are not exclusive: most economists today think several worked together.',
 init:()=>({e:'money'}),
 watch(p){return {e:E3_EXPL_KEYS[Math.min(3,Math.floor(p*4))][0]}},
 ui:[{choose:E3_EXPL_KEYS,label:'Explanation',get:s=>s.e,act:'e'}],
 on:{e(s,v){s.e=v;return 'keep'}},
 draw(s,f,X){
  const ex=E3_EXPL[s.e];let out=heading('Why was the Depression so deep?',28)+E3_tag('debated',C.amber);
  out+=TF(300,60,`${ex.name} (${ex.who})`,15,C.purple,'middle','font-weight="700"');
  ex.chain.forEach((c,i)=>{const x=24+i*143;out+=R(x,80,128,74,i===3?C.coralp:C.pale,'none',10)+E3_para(x+64,106,c,17,13,C.ink,17,'middle');if(i<3)out+=arrow(x+130,117,x+141,117,C.blue,2,6)});
  out+=R(24,176,552,96,'#fff',C.grid,10)+TF(40,198,'Evidence',13,C.muted,'start')+E3_para(40,220,ex.ev,78,13,C.ink,18);
  out+=TF(300,300,'Press another explanation:',13,C.muted);
  E3_EXPL_KEYS.forEach(([k,l],i)=>{out+=E3_btn(X,'e',k,l,24+i*140,310,128,40,l,{sel:k===s.e})});
  return {svg:out,phase:`${ex.name}: ${ex.chain.join(' → ')}. ${ex.who}. The four stories overlap; Bernanke (1983) added that bank failures also destroyed knowledge of borrowers, cutting credit even beyond the fall in money.`};
 }});

// Leaving gold and recovery: industrial production in 1935 relative to 1929 (approximate, after
// Eichengreen & Sachs 1985, their figure 1, rounded; illustrative positions).
const E3_GOLD=[{c:'Sweden',y:1931,ip:123},{c:'Britain',y:1931,ip:106},{c:'Denmark',y:1931,ip:117},{c:'Norway',y:1931,ip:113},{c:'Finland',y:1931,ip:132},{c:'Germany',y:1931.6,ip:94,ctl:true},{c:'Belgium',y:1935,ip:83},{c:'Italy',y:1934.5,ip:93,ctl:true},{c:'France',y:1936,ip:72},{c:'Netherlands',y:1936,ip:86}];
SCENE({id:'great-depression-gold',name:'Leaving gold',tag:'Who recovered first?',
 definition:'Under the gold standard each currency was worth a fixed weight of gold, so a country losing gold had to raise interest rates and squeeze its economy. Countries that left gold could cut rates and let prices rise again, and on the whole they recovered sooner.',
 example:'Sweden and Britain left gold in 1931; by 1935 their industry was above its 1929 level. France held on until 1936 and was still about 30% below.',
 desc:'A scatter of ten countries: the year each left gold (or imposed exchange controls) against industrial production in 1935 relative to 1929, with a trend line. Press a country for its story.',
 research:'Eichengreen, B. & Sachs, J. (1985). Exchange rates and economic recovery in the 1930s. Journal of Economic History 45, 925–946. Eichengreen, B. (1992). Golden Fetters. Bernanke, B. & James, H. (1991). The gold standard, deflation, and financial crisis in the Great Depression. (Positions rounded; illustrative.)',
 dur:10,hint:'Press the dots. Germany stayed nominally on gold but imposed exchange controls in 1931, so it is placed with care; the pattern, not any single dot, is the finding.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(E3_GOLD.length-1,Math.floor(p*E3_GOLD.length))}},
 ui:[{range:'k',label:'Country',min:0,max:E3_GOLD.length-1,step:1,get:s=>s.k,act:'k',show:v=>E3_GOLD[v].c}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Leaving gold, 1929–1935',28)+E3_tag('plausible',C.blue);
  const pl=E3_plot(70,64,330,226,[1930.5,1936.5],[60,140],{xt:[[1931,'1931'],[1933,'1933'],[1935,'1935'],[1936,'1936']],yt:[[60,'60'],[80,'80'],[100,'100'],[120,'120'],[140,'140']],xl:'year the country left gold',yl:'industry in 1935 (1929 = 100)'});
  out+=pl.svg+L(pl.X(1930.5),pl.Y(100),pl.X(1936.5),pl.Y(100),C.line,1,'stroke-dasharray="4 4"');
  // Least-squares trend through the dots.
  const xs=E3_GOLD.map(d=>d.y),ys=E3_GOLD.map(d=>d.ip),mx=sum(xs)/xs.length,my=sum(ys)/ys.length;
  const b=sum(xs.map((x,i)=>(x-mx)*(ys[i]-my)))/sum(xs.map(x=>(x-mx)**2)),a=my-b*mx;
  out+=L(pl.X(1931),pl.Y(a+b*1931),pl.X(1936),pl.Y(a+b*1936),C.purple,2,'stroke-dasharray="7 5"');
  E3_GOLD.forEach((d,i)=>{const on=i===s.k;out+=hit(X,'k',i,d.c,Ci(pl.X(d.y),pl.Y(d.ip),on?8:6,on?C.coral:C.blue,'#fff'))});
  const d=E3_GOLD[s.k];
  out+=R(420,64,164,168,'#fff',C.grid,10)+TBF(502,88,d.c,16,C.coral)+TF(502,112,`${d.ctl?'controls':'left gold'}: ${Math.floor(d.y)}`,13,C.ink)+TF(502,132,`industry 1935: ${d.ip}`,13,C.ink);
  out+=E3_para(502,160,d.ip>=100?'Above its 1929 level.':'Still below its 1929 level.',22,13,d.ip>=100?C.green:C.coral,18,'middle');
  out+=TF(502,206,`trend: ${b.toFixed(1)} points a year`,13,C.purple)+TF(502,224,'later exit',13,C.purple);
  return {svg:out,phase:`${d.c} ${d.ctl?'imposed exchange controls':'left gold'} in ${Math.floor(d.y)}; by 1935 its industry stood at about ${d.ip}% of 1929. Across these countries each extra year on gold goes with about ${Math.abs(b).toFixed(0)} points less recovery. A correlation, but a strong and widely accepted one.`};
 }});

/* ================================================================ national-accounts */
// Value added along a supply chain: summing every sale double-counts.
const E3_CHAIN=[{who:'Farmer',makes:'wheat',sale:1,buys:0},{who:'Miller',makes:'flour',sale:3,buys:1},{who:'Baker',makes:'bread',sale:5,buys:3}];
SCENE({id:'national-accounts',name:'Measuring the whole economy',tag:'Value added and GDP',
 definition:'Gross domestic product (GDP) is the value of all final goods and services produced in a country in a year. To avoid counting the same wheat three times, it adds only the value each producer adds: sales minus what they bought from other producers.',
 example:'A farmer sells wheat for £1, a miller turns it into flour sold for £3, a baker sells the bread for £5. GDP rises by £5, the final sale, which equals £1 + £2 + £2 of value added, not the £9 of all sales.',
 desc:'A three-step supply chain from farmer to miller to baker, with each sale and each producer’s value added, and two bars comparing the sum of all sales with the sum of value added.',
 research:'Kuznets, S. (1934). National Income, 1929–1932. Senate Document 124, 73rd Congress. Meade, J. E. & Stone, R. (1941). The construction of tables of national income, expenditure, savings and investment. Economic Journal 51, 216–233. United Nations (1953). A System of National Accounts.',
 dur:10,hint:'Change the price of the bread and switch between counting every sale and counting value added. Only value added matches the final sale.',
 init:()=>({bread:5,mode:'va'}),
 watch(p){return {bread:5,mode:p<.5?'all':'va'}},
 ui:[{range:'bread',label:'Price of the bread (£)',min:4,max:8,step:.5,get:s=>s.bread,act:'bread',show:v=>'£'+Number(v).toFixed(2)},{choose:[['all','Count every sale'],['va','Count value added']],label:'Method',get:s=>s.mode,act:'mode'}],
 on:{bread(s,v){s.bread=Number(v);return 'keep'},mode(s,v){s.mode=v;return 'keep'}},
 draw(s){
  let out=heading('Wheat to flour to bread',28);
  const ch=E3_CHAIN.map((c,i)=>i===2?{...c,sale:s.bread}:c);
  ch.forEach((c,i)=>{const x=40+i*190,va=c.sale-c.buys;
   out+=R(x,58,150,112,C.pale,'none',12)+TBF(x+75,82,c.who,16,C.ink)+TF(x+75,104,`sells ${c.makes} for £${c.sale.toFixed(2)}`,13,C.ink)+TF(x+75,124,`bought £${c.buys.toFixed(2)} of inputs`,13,C.muted)+TBF(x+75,152,`adds £${va.toFixed(2)}`,15,C.green);
   if(i<2)out+=arrow(x+152,114,x+188,114,C.blue,2.4,8)});
  const all=sum(ch.map(c=>c.sale)),va=sum(ch.map(c=>c.sale-c.buys));
  const pl=E3_plot(120,206,360,90,[0,20],[0,1],{xt:[[0,'£0'],[5,'£5'],[10,'£10'],[15,'£15'],[20,'£20']]});
  out+=pl.svg;
  out+=R(pl.X(0),214,pl.X(all)-pl.X(0),30,s.mode==='all'?C.coralp:'#f4f4f4',s.mode==='all'?C.coral:C.line,4)+TF(pl.X(0)-6,234,'all sales',13,C.coral,'end')+TF(pl.X(all)+6,234,'£'+all.toFixed(2),13,C.coral,'start');
  out+=R(pl.X(0),256,pl.X(va)-pl.X(0),30,s.mode==='va'?C.greenp:'#f4f4f4',s.mode==='va'?C.green:C.line,4)+TF(pl.X(0)-6,276,'value added',13,C.green,'end')+TF(pl.X(va)+6,276,'£'+va.toFixed(2),13,C.green,'start');
  out+=TF(300,346,s.mode==='va'?`GDP counts £${va.toFixed(2)}: exactly the final sale of the bread.`:`Adding every sale gives £${all.toFixed(2)}: the wheat is counted three times.`,14,s.mode==='va'?C.green:C.coral);
  return {svg:out,phase:`Summing every sale gives £${all.toFixed(2)}; summing value added gives £${va.toFixed(2)}, the price of the final bread. National accounts count value added (or, equivalently, final spending, or the incomes paid out), so each pound of output is counted once.`};
 }});

// Expenditure approach: GDP = C + I + G + (X − M). Shares are rounded UK figures (ONS, early 2020s, approximate).
SCENE({id:'national-accounts-expenditure',name:'Who buys the output?',tag:'C + I + G + (X − M)',
 definition:'GDP can be measured by adding up spending on final output: households’ consumption (C), firms’ investment (I), government purchases (G) and exports minus imports (X − M). Measured carefully, spending, output and incomes give the same total.',
 example:'In the UK in the early 2020s households’ spending was roughly 60% of GDP, government purchases about 21%, investment about 18%, and net trade a small negative.',
 desc:'A stacked bar of the four parts of spending, which the learner sets, with GDP as their sum, beside rounded UK shares.',
 research:'Keynes, J. M. (1936). The General Theory. Stone, R. (1984). The accounts of society (Nobel lecture). Office for National Statistics, UK National Accounts (Blue Book), GDP expenditure components (shares rounded; approximate).',
 dur:10,hint:'Set the four parts and watch GDP add up. Imports are subtracted because they were produced abroad, though households, firms and government all buy some.',
 init:()=>({c:60,i:18,g:21,nx:-1}),
 watch(p){const u=smooth(p);return {c:Math.round(lerp(45,60,u)),i:Math.round(lerp(25,18,u)),g:Math.round(lerp(15,21,u)),nx:Math.round(lerp(4,-1,u))}},
 ui:[{range:'c',label:'Consumption C',min:20,max:80,step:1,get:s=>s.c,act:'c'},{range:'i',label:'Investment I',min:0,max:40,step:1,get:s=>s.i,act:'i'},{range:'g',label:'Government G',min:0,max:40,step:1,get:s=>s.g,act:'g'},{range:'nx',label:'Net exports X − M',min:-15,max:15,step:1,get:s=>s.nx,act:'nx'}],
 on:{c(s,v){s.c=Number(v);return 'keep'},i(s,v){s.i=Number(v);return 'keep'},g(s,v){s.g=Number(v);return 'keep'},nx(s,v){s.nx=Number(v);return 'keep'}},
 draw(s){
  let out=heading('GDP = C + I + G + (X − M)',28);
  const gdp=s.c+s.i+s.g+s.nx,sc=3.2,x0=60;
  const parts=[['C',s.c,C.blue],['I',s.i,C.green],['G',s.g,C.purple]];
  let x=x0;out+=TF(x0,66,'your economy (£ billions)',13,C.muted,'start');
  for(const [n,v,col] of parts){out+=R(x,76,v*sc,46,col,'none',2,'opacity=".85"');if(v*sc>22)out+=TBF(x+v*sc/2,105,n,15,'#fff');x+=v*sc}
  if(s.nx>=0){out+=R(x,76,s.nx*sc,46,C.amber,'none',2,'opacity=".85"');x+=s.nx*sc}
  else{out+=R(x+s.nx*sc,128,-s.nx*sc,16,C.coral,'none',2,'opacity=".85"')+TF(x+s.nx*sc-4,141,'net imports',13,C.coral,'end');x+=s.nx*sc}
  out+=L(x0+gdp*sc,70,x0+gdp*sc,152,C.ink,2)+TBF(Math.min(560,x0+gdp*sc),168,'GDP '+gdp,15,C.ink);
  out+=counter(40,190,'consumption',String(s.c),C.blue,118)+counter(166,190,'investment',String(s.i),C.green,118)+counter(292,190,'government',String(s.g),C.purple,118)+counter(418,190,'net exports',String(s.nx),s.nx<0?C.coral:C.amber,118);
  const sh=v=>gdp>0?Math.round(v/gdp*100)+'%':'–';
  out+=TF(40,268,`Shares of your GDP: C ${sh(s.c)}, I ${sh(s.i)}, G ${sh(s.g)}, net exports ${sh(s.nx)}`,13,C.ink,'start');
  out+=TF(40,292,'UK, early 2020s (rounded): C about 60%, I about 18%, G about 21%,',13,C.muted,'start')+TF(40,310,'net exports about −1%.',13,C.muted,'start');
  out+=TF(40,334,'Transfers such as pensions are not in G: they are counted when households spend them.',13,C.muted,'start');
  return {svg:out,phase:`GDP = ${s.c} + ${s.i} + ${s.g} + (${s.nx}) = ${gdp}. Every pound of final spending is somebody’s income and some producer’s output, which is why the three measures should agree; in practice statisticians reconcile small gaps.`};
 }});

// What GDP counts and what it misses (Kuznets's own warning).
const E3_LIMITS=[
 {id:'care',t:'A parent cares for their own child',gdp:0,well:1,why:'Unpaid work at home is outside GDP; pay a nursery to do it and GDP rises.'},
 {id:'smog',t:'A factory pollutes the air',gdp:1,well:-1,why:'The factory’s output counts; the damage to health does not.'},
 {id:'crash',t:'Repairs after a car crash',gdp:1,well:-1,why:'Spending on repairs and hospitals adds to GDP even though people are worse off than before the crash.'},
 {id:'leisure',t:'Everyone works a shorter week',gdp:-1,well:1,why:'More free time is valuable but appears in GDP only as less output.'},
 {id:'free',t:'A free online encyclopaedia',gdp:0,well:1,why:'Free digital goods add little to measured GDP, though people value them highly.'},
 {id:'unequal',t:'All growth goes to the richest 1%',gdp:1,well:0,why:'GDP is a total: it says nothing about who gets it.'}];
SCENE({id:'national-accounts-limits',name:'What GDP leaves out',tag:'Kuznets’s warning',
 definition:'GDP measures market production, not wellbeing. Simon Kuznets, who built the first US national income estimates, warned Congress in 1934 that the welfare of a nation can scarcely be inferred from a measure of national income.',
 example:'A car crash raises GDP through repairs and medical bills; a parent caring for their own child adds nothing to it.',
 desc:'Six cases; for each the learner sees whether GDP goes up, down or is unchanged, and whether wellbeing does, with the reason.',
 research:'Kuznets, S. (1934). National Income, 1929–1932. Senate Document 124. Stiglitz, J. E., Sen, A. & Fitoussi, J.-P. (2009). Report by the Commission on the Measurement of Economic Performance and Social Progress. Coyle, D. (2014). GDP: A Brief but Affectionate History. Princeton University Press.',
 dur:12,hint:'Press each case. GDP is a good measure of what it was designed for, market output, and a poor one of how well people live.',
 init:()=>({k:'care'}),
 watch(p){return {k:E3_LIMITS[Math.min(5,Math.floor(p*6))].id}},
 ui:[],on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('What GDP counts, and what it misses',28);
  const arrowTxt=v=>v>0?'up':v<0?'down':'unchanged',col=v=>v>0?C.green:v<0?C.coral:C.muted;
  E3_LIMITS.forEach((c,i)=>{const x=24+(i%2)*284,y=52+Math.floor(i/2)*62,on=c.id===s.k;
   out+=E3_btn(X,'k',c.id,c.t,x,y,268,52,E3_wrap(c.t,34),{sel:on,fill:on?C.pale:'#fff'})});
  const c=E3_LIMITS.find(c=>c.id===s.k);
  out+=R(24,246,552,96,'#fff',C.grid,10);
  out+=TF(48,272,'GDP:',13,C.muted,'start')+TBF(90,272,arrowTxt(c.gdp),15,col(c.gdp),'start');
  out+=TF(220,272,'Wellbeing:',13,C.muted,'start')+TBF(296,272,arrowTxt(c.well),15,col(c.well),'start');
  out+=E3_para(48,298,c.why,80,13,C.ink,18);
  return {svg:out,phase:`${c.t}: GDP ${arrowTxt(c.gdp)}, wellbeing ${arrowTxt(c.well)}. ${c.why} Kuznets himself warned against reading welfare from national income; later reports (Stiglitz, Sen & Fitoussi 2009) proposed adding measures of distribution, sustainability and wellbeing alongside it.`};
 }});

/* ================================================================ multiplier */
SCENE({id:'multiplier',name:'Spending that multiplies',tag:'Kahn and Keynes',
 definition:'When someone spends £100, that becomes someone else’s income; they spend part of it (the marginal propensity to consume, MPC), which becomes another income, and so on. The total rise in income is the first £100 times the multiplier 1 ÷ (1 − MPC).',
 example:'With an MPC of 0.75 each round is three-quarters of the last: £100, £75, £56, … adding up to £400, so the multiplier is 4.',
 desc:'Rounds of spending as shrinking bars, with the running total climbing towards its limit, and the multiplier for the chosen marginal propensity to consume.',
 research:'Kahn, R. F. (1931). The relation of home investment to unemployment. Economic Journal 41, 173–198. Keynes, J. M. (1936). The General Theory, chapter 10.',
 dur:10,hint:'Raise the marginal propensity to consume. The closer it is to 1, the less leaks out of each round and the bigger the multiplier.',
 init:()=>({mpc:.75,n:12}),
 watch(p){return {mpc:.75,n:Math.max(1,Math.round(p*12))}},
 ui:[{range:'mpc',label:'Marginal propensity to consume',min:.2,max:.9,step:.05,get:s=>s.mpc,act:'mpc',show:v=>Number(v).toFixed(2)},{range:'n',label:'Rounds shown',min:1,max:12,step:1,get:s=>s.n,act:'n'}],
 on:{mpc(s,v){s.mpc=Number(v);return 'keep'},n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  let out=heading('£100 of new spending, round by round',28);
  const k=1/(1-s.mpc),cap=1000;
  const pl=E3_plot(70,60,310,230,[0,12.5],[0,100],{xt:[[1,'1'],[4,'4'],[8,'8'],[12,'12']],yt:[[0,'£0'],[50,'£50'],[100,'£100']],xl:'round',yl:'spending in each round'});
  out+=pl.svg;let tot=0;
  for(let r=1;r<=s.n;r++){const v=100*s.mpc**(r-1);tot+=v;out+=R(pl.X(r)-9,pl.Y(v),18,pl.Y(0)-pl.Y(v),r===1?C.coral:C.blue,'none',2,'opacity=".85"')}
  const tp=E3_plot(430,60,140,230,[0,1],[0,cap],{yt:[[0,'£0'],[500,'£500'],[1000,'£1000']],yl:'running total'});
  out+=tp.svg+R(470,tp.Y(Math.min(cap,tot)),60,tp.Y(0)-tp.Y(Math.min(cap,tot)),C.green,'none',2,'opacity=".85"');
  out+=L(440,tp.Y(Math.min(cap,100*k)),560,tp.Y(Math.min(cap,100*k)),C.purple,2,'stroke-dasharray="6 4"')+TF(566,tp.Y(Math.min(cap,100*k))-6,'limit',13,C.purple,'end');
  out+=TF(300,352,`Multiplier = 1 ÷ (1 − ${s.mpc.toFixed(2)}) = ${k.toFixed(2)}.  After ${s.n} round${s.n>1?'s':''}: £${tot.toFixed(0)} of the eventual £${(100*k).toFixed(0)}.`,14,C.ink);
  return {svg:out,phase:`Each round is ${Math.round(s.mpc*100)}% of the one before, because ${Math.round((1-s.mpc)*100)}% is saved. The rounds add up to £100 × 1/(1 − ${s.mpc.toFixed(2)}) = £${(100*k).toFixed(0)}. Kahn worked this out in 1931 for public works; Keynes made it central in 1936.`};
 }});

// Leakages: taxes and imports shrink the multiplier. Empirical estimates are much smaller than textbook ones.
SCENE({id:'multiplier-leakages',name:'Leaks: tax and imports',tag:'Real-world multipliers',
 definition:'In a real economy part of each extra pound goes in tax and part buys imports, so less is re-spent at home. The multiplier becomes 1 ÷ (1 − c(1 − t) + m), where t is the tax rate and m the share spent on imports. Measured government-spending multipliers are mostly between about 0.5 and 2.',
 example:'With c = 0.8, a 30% tax rate and 25% of income spent on imports, the multiplier is 1 ÷ (1 − 0.56 + 0.25) ≈ 1.45, far below the simple 5.',
 desc:'Bars comparing the simple multiplier with the one after taxes and imports, beside the range of published estimates of real government-spending multipliers.',
 research:'Ramey, V. A. (2019). Ten years after the financial crisis: what have we learned from the renaissance in fiscal research? Journal of Economic Perspectives 33(2), 89–114. Auerbach, A. J. & Gorodnichenko, Y. (2012). Measuring the output responses to fiscal policy. American Economic Journal: Economic Policy 4(2), 1–27. Blanchard, O. & Leigh, D. (2013). Growth forecast errors and fiscal multipliers. American Economic Review 103(3), 117–120.',
 dur:10,hint:'Add taxes and imports and watch the multiplier shrink. Estimates tend to be higher in deep slumps, when interest rates are near zero, and lower in good times.',
 init:()=>({c:.8,t:.3,m:.25}),
 watch(p){return {c:.8,t:Math.min(.3,p*.6),m:Math.min(.25,Math.max(0,(p-.4)*.6))}},
 ui:[{range:'c',label:'Spending out of after-tax income c',min:.5,max:.95,step:.05,get:s=>s.c,act:'c',show:v=>Number(v).toFixed(2)},{range:'t',label:'Tax rate t',min:0,max:.5,step:.05,get:s=>s.t,act:'t',show:v=>Math.round(v*100)+'%'},{range:'m',label:'Import share m',min:0,max:.4,step:.05,get:s=>s.m,act:'m',show:v=>Math.round(v*100)+'%'}],
 on:{c(s,v){s.c=Number(v);return 'keep'},t(s,v){s.t=Number(v);return 'keep'},m(s,v){s.m=Number(v);return 'keep'}},
 draw(s){
  let out=heading('How leaks shrink the multiplier',28);
  const simple=1/(1-s.c),real=1/(1-s.c*(1-s.t)+s.m);
  const pl=E3_plot(80,64,300,220,[0,3],[0,21],{yt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20']],yl:'multiplier'});
  out+=pl.svg;
  const bar=(i,v,col,lab)=>R(pl.X(i+.5)-34,pl.Y(Math.min(21,v)),68,pl.Y(0)-pl.Y(Math.min(21,v)),col,'none',3,'opacity=".85"')+TBF(pl.X(i+.5),pl.Y(Math.min(21,v))-8,v.toFixed(2),15,col)+TF(pl.X(i+.5),pl.Y(0)+18,lab,13,C.muted);
  out+=bar(0,simple,C.blue,'no leaks')+bar(1,real,C.green,'tax + imports');
  // Published range for government-spending multipliers.
  out+=R(pl.X(2.5)-34,pl.Y(2),68,pl.Y(.5)-pl.Y(2),C.amberp,C.amber,3)+TF(pl.X(2.5),pl.Y(0)+18,'measured',13,C.muted)+TF(pl.X(2.5),pl.Y(2)-8,'0.5–2',14,C.amber);
  out+=E3_para(400,80,'Measured multipliers come from wars, defence build-ups and budget shocks. Most lie between about 0.5 and 2.',24,13,C.ink,18);
  out+=E3_para(400,190,'They tend to be larger in deep slumps and when interest rates are stuck near zero.',24,13,C.muted,18);
  return {svg:out,phase:`Without leaks the multiplier would be ${simple.toFixed(2)}; with a ${Math.round(s.t*100)}% tax rate and ${Math.round(s.m*100)}% of income spent on imports it is ${real.toFixed(2)}. Real estimates (Ramey 2019) are lower still on average, because spending can also push up interest rates, crowd out private spending, or be anticipated.`};
 }});

// Paradox of thrift in a Keynesian cross: Y = A + cY, saving S = I at equilibrium.
SCENE({id:'multiplier-paradox-thrift',name:'The paradox of thrift',tag:'The Keynesian cross',
 definition:'If every household tries to save more at once, spending falls, incomes fall, and in this simple model total saving ends up no higher: it still equals investment. What is prudent for one family can be self-defeating for a whole economy in a slump.',
 example:'With investment and government spending of 100 and households spending 80% of income, income settles at 500. If they try to save 30% instead, income falls to about 333, and saving is still 100.',
 desc:'The Keynesian cross: planned spending against income, with the 45° line where spending equals income. Raising the saving rate tilts the spending line down and moves the equilibrium to a lower income.',
 research:'Keynes, J. M. (1936). The General Theory, chapters 7 and 8. Samuelson, P. A. (1948). Economics: An Introductory Analysis (the 45° cross). Mandeville, B. (1714). The Fable of the Bees (an early version of the idea).',
 dur:10,hint:'Raise the saving rate. Income falls until saving again equals investment. If saving funds more investment, the paradox disappears; the model assumes investment is fixed.',
 init:()=>({sv:.2,A:100}),
 watch(p){return {sv:lerp(.2,.3,smooth(p)),A:100}},
 ui:[{range:'sv',label:'Saving rate (share of income saved)',min:.1,max:.4,step:.01,get:s=>s.sv,act:'sv',show:v=>Math.round(v*100)+'%'},{range:'A',label:'Investment + government spending',min:60,max:140,step:5,get:s=>s.A,act:'A'}],
 on:{sv(s,v){s.sv=Number(v);return 'keep'},A(s,v){s.A=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Everyone saves more: what happens?',28);
  const c=1-s.sv,Y=s.A/(1-c),Ymax=Y>900?Math.ceil(Y*1.15/500)*500:1000,half=Ymax/2;
  const pl=E3_plot(80,56,300,250,[0,Ymax],[0,Ymax],{xt:[[0,'0'],[half,String(half)],[Ymax,String(Ymax)]],yt:[[0,'0'],[half,String(half)],[Ymax,String(Ymax)]],xl:'income Y',yl:'planned spending'});
  out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(Ymax),pl.Y(Ymax),C.line,2)+TF(pl.X(Ymax*.86),pl.Y(Ymax*.93),'45°: spending = income',13,C.muted,'end');
  out+=L(pl.X(0),pl.Y(s.A),pl.X(Ymax),pl.Y(Math.min(Ymax*1.2,s.A+c*Ymax)),C.blue,3);
  out+=L(pl.X(Y),pl.Y(0),pl.X(Y),pl.Y(Y),C.coral,1.5,'stroke-dasharray="5 4"')+Ci(pl.X(Y),pl.Y(Y),7,C.coral,'#fff');
  out+=counter(410,70,'income',Y.toFixed(0),C.coral,170)+counter(410,126,'consumption',(c*Y).toFixed(0),C.blue,170)+counter(410,182,'total saving',(s.sv*Y).toFixed(0),C.green,170);
  out+=E3_para(410,256,'Saving always ends up equal to investment + government spending.',26,13,C.muted,18);
  return {svg:out,phase:`With ${Math.round(s.sv*100)}% saved, income settles at ${Y.toFixed(0)}, where planned spending meets the 45° line. Total saving is ${(s.sv*Y).toFixed(0)}, equal to the ${s.A} of investment and government spending. Trying to save more lowers income, not total saving. Economists debate how far this holds once interest rates and investment respond.`};
 }});

/* ================================================================ unemployment-phillips */
// Phillips (1958) fitted y + 0.900 = 9.638 x^−1.394 to UK data 1861–1913 (y: wage inflation %, x: unemployment %).
const E3_phil=u=>9.638*Math.pow(u,-1.394)-.9;
SCENE({id:'unemployment-phillips',name:'The Phillips curve',tag:'Unemployment and wages',
 definition:'In 1958 the New Zealand-born economist Bill Phillips showed that in nearly a century of British data, money wages rose fast when unemployment was low and slowly, or fell, when it was high. The curve seemed to offer a menu: less unemployment for a bit more inflation.',
 example:'Phillips’s fitted curve gives wages rising about 4.6% a year at 1.5% unemployment, about 1.8% at 2.5%, and not at all at about 5.5%.',
 desc:'Phillips’s fitted curve of wage inflation against unemployment, with a point the learner moves along it and its readings.',
 research:'Phillips, A. W. (1958). The relation between unemployment and the rate of change of money wage rates in the United Kingdom, 1861–1957. Economica 25, 283–299. Samuelson, P. A. & Solow, R. M. (1960). Analytical aspects of anti-inflation policy. American Economic Review 50(2), 177–194.',
 dur:10,hint:'Slide unemployment along the curve. Samuelson and Solow (1960) turned Phillips’s wages into prices and presented it as a menu for policy, with caveats that were often forgotten.',
 init:()=>({u:2.5}),
 watch(p){return {u:lerp(1.2,8,p)}},
 ui:[{range:'u',label:'Unemployment rate',min:1,max:10,step:.1,get:s=>s.u,act:'u',show:v=>Number(v).toFixed(1)+'%'}],
 on:{u(s,v){s.u=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Phillips’s curve, UK 1861–1913',28);
  const pl=E3_plot(80,56,320,250,[0,10],[-2,10],{xt:[[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8'],[10,'10%']],yt:[[-2,'−2'],[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8'],[10,'10%']],xl:'unemployment rate',yl:'money wages, % rise a year'});
  out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(10),pl.Y(0),C.line,1);
  const pts=[];for(let u=.85;u<=10;u+=.05){const w=E3_phil(u);if(w<=10)pts.push([pl.X(u),pl.Y(w)])}
  out+=E3_poly(pts,C.blue,3);
  const w=E3_phil(s.u);out+=L(pl.X(s.u),pl.Y(-2),pl.X(s.u),pl.Y(Math.min(10,w)),C.coral,1.4,'stroke-dasharray="5 4"')+Ci(pl.X(s.u),pl.Y(Math.min(10,w)),7,C.coral,'#fff');
  out+=counter(430,70,'unemployment',s.u.toFixed(1)+'%',C.coral,150)+counter(430,126,'wage rise a year',w.toFixed(1)+'%',C.blue,150);
  out+=TF(505,206,'zero wage growth',13,C.muted)+TF(505,224,'at about 5.5%',13,C.muted);
  out+=TF(505,262,'y + 0.900 = 9.638 x',13,C.purple)+TF(505,280,'with exponent −1.394',13,C.purple);
  return {svg:out,phase:`At ${s.u.toFixed(1)}% unemployment, Phillips’s curve predicts money wages rising ${w.toFixed(1)}% a year. The curve was a fitted summary of 1861–1913, which also described 1948–57 well. Whether it was a stable menu was the question the next twenty years answered.`};
 }});

// US unemployment and CPI inflation, 1961–1980 (BLS, annual averages, rounded).
const E3_US=[[1961,6.7,1.0],[1962,5.5,1.0],[1963,5.7,1.3],[1964,5.2,1.3],[1965,4.5,1.6],[1966,3.8,2.9],[1967,3.8,3.1],[1968,3.6,4.2],[1969,3.5,5.5],[1970,4.9,5.7],[1971,5.9,4.4],[1972,5.6,3.2],[1973,4.9,6.2],[1974,5.6,11.0],[1975,8.5,9.1],[1976,7.7,5.8],[1977,7.1,6.5],[1978,6.1,7.6],[1979,5.8,11.3],[1980,7.1,13.5]];
SCENE({id:'unemployment-phillips-1970s',name:'The curve breaks',tag:'Stagflation, 1961–1980',
 definition:'In the 1960s American unemployment and inflation traced out a neat Phillips curve. In the 1970s the pattern broke: inflation and unemployment rose together, which came to be called stagflation.',
 example:'In 1969 unemployment was 3.5% with inflation at 5.5%. By 1975 unemployment was 8.5% and inflation still 9.1%: both worse at once.',
 desc:'A scatter of US unemployment against consumer-price inflation for each year from 1961 to 1980, revealed year by year and joined in order, with the 1960s and 1970s coloured differently.',
 research:'US Bureau of Labor Statistics: unemployment rate and CPI-U, annual averages (rounded). Blinder, A. S. & Rudd, J. B. (2013). The supply-shock explanation of the Great Stagflation revisited. In The Great Inflation (NBER). Friedman, M. (1977). Inflation and unemployment (Nobel lecture). Journal of Political Economy 85, 451–472.',
 dur:12,hint:'Move the year forward. The 1960s points sit on a curve; the 1970s loop away from it. Oil price shocks in 1973 and 1979 were part of the story, and so were rising expectations of inflation.',
 init:()=>({y:1980}),
 watch(p){return {y:Math.round(lerp(1961,1980,p))}},
 ui:[{range:'y',label:'Show up to year',min:1961,max:1980,step:1,get:s=>s.y,act:'y'}],
 on:{y(s,v){s.y=Number(v);return 'keep'}},
 draw(s){
  let out=heading('United States: unemployment and inflation',28);
  const pl=E3_plot(80,56,330,250,[3,9],[0,14],{xt:[[3,'3'],[5,'5'],[7,'7'],[9,'9%']],yt:[[0,'0'],[4,'4'],[8,'8'],[12,'12%']],xl:'unemployment rate',yl:'consumer-price inflation'});
  out+=pl.svg;
  const shown=E3_US.filter(d=>d[0]<=s.y);
  const sixties=shown.filter(d=>d[0]<1970),later=shown.filter(d=>d[0]>=1969);
  out+=E3_poly(sixties.map(d=>[pl.X(d[1]),pl.Y(d[2])]),C.blue,2.2)+E3_poly(later.map(d=>[pl.X(d[1]),pl.Y(d[2])]),C.coral,2.2);
  shown.forEach(d=>{out+=Ci(pl.X(d[1]),pl.Y(d[2]),4.5,d[0]<1970?C.blue:C.coral,'#fff')});
  const lab=d=>{const dx=d[0]===1975||d[0]===1980?8:-8;return TF(pl.X(d[1])+dx,pl.Y(d[2])-8,String(d[0]),13,d[0]<1970?C.blue:C.coral,dx>0?'start':'end')};
  for(const y of [1961,1969,1974,1975,1980])if(y<=s.y)out+=lab(E3_US.find(d=>d[0]===y));
  const d=E3_US.find(d=>d[0]===s.y);
  out+=counter(440,70,'year',String(d[0]),C.ink,140)+counter(440,126,'unemployment',d[1].toFixed(1)+'%',C.purple,140)+counter(440,182,'inflation',d[2].toFixed(1)+'%',C.coral,140);
  out+=TF(510,262,'blue: 1961–69',13,C.blue)+TF(510,280,'red: 1969–80',13,C.coral)+TF(510,306,'BLS, rounded',13,C.muted);
  return {svg:out,phase:s.y<1970?`${s.y}: the 1960s points line up like Phillips’s curve: lower unemployment, higher inflation.`:`${s.y}: unemployment ${d[1].toFixed(1)}%, inflation ${d[2].toFixed(1)}%. The 1970s points no longer sit on one curve. Supply shocks (oil in 1973 and 1979) and higher expected inflation both shifted it; economists still weigh the two.`};
 }});

// Friedman–Phelps: with adaptive expectations, holding unemployment below the natural rate makes inflation accelerate.
function E3_accel(target,un,a,years){const out=[];let pe=2;for(let t=0;t<years;t++){const pi=pe-a*(target-un);out.push({t,pe,pi});pe=pi}return out}
SCENE({id:'unemployment-phillips-expectations',name:'Expectations shift the curve',tag:'Friedman and Phelps',
 definition:'Milton Friedman (1968) and Edmund Phelps (1967) argued that the Phillips curve depends on the inflation people expect. Push unemployment below its “natural” rate and inflation rises; people come to expect it, the curve shifts up, and holding unemployment down needs ever-rising inflation.',
 example:'If the natural rate is 5% and policy holds unemployment at 4%, inflation in this model climbs by a point each year: 3%, 4%, 5% … The trade-off is only temporary.',
 desc:'Short-run Phillips curves for successive years, each shifted up by last year’s inflation, with the economy’s position each year and a vertical line at the natural rate.',
 research:'Friedman, M. (1968). The role of monetary policy. American Economic Review 58(1), 1–17. Phelps, E. S. (1967). Phillips curves, expectations of inflation and optimal unemployment over time. Economica 34, 254–281. Staiger, D., Stock, J. & Watson, M. (1997). How precise are estimates of the natural rate of unemployment? (A model; the natural rate is hard to measure.)',
 dur:12,hint:'Set unemployment below the natural rate and watch the years pass. Set it equal to the natural rate and inflation stays put. Set it above and inflation falls, at the cost of jobs.',
 init:()=>({target:4,yr:6}),
 watch(p){return {target:4,yr:Math.max(1,Math.round(p*8))}},
 ui:[{range:'target',label:'Unemployment held by policy',min:3,max:7,step:.25,get:s=>s.target,act:'target',show:v=>Number(v).toFixed(2)+'%'},{range:'yr',label:'Years',min:1,max:8,step:1,get:s=>s.yr,act:'yr'}],
 on:{target(s,v){s.target=Number(v);return 'keep'},yr(s,v){s.yr=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Below the natural rate',28)+E3_tag('model',C.purple);
  const un=5,a=1,path=E3_accel(s.target,un,a,s.yr);
  const pl=E3_plot(80,56,320,250,[2,8],[-4,14],{xt:[[2,'2'],[4,'4'],[5,'5'],[6,'6'],[8,'8%']],yt:[[-4,'−4'],[0,'0'],[4,'4'],[8,'8'],[12,'12%']],xl:'unemployment rate',yl:'inflation'});
  out+=pl.svg+L(pl.X(un),pl.Y(-4),pl.X(un),pl.Y(14),C.green,2,'stroke-dasharray="7 5"')+TF(pl.X(un)+6,pl.Y(13),'natural rate',13,C.green,'start');
  path.forEach((d,i)=>{const op=.35+.65*(i+1)/path.length;
   out+=L(pl.X(2),pl.Y(d.pe+a*3),pl.X(8),pl.Y(d.pe-a*3),C.blue,1.8,`opacity="${op.toFixed(2)}"`);
   out+=Ci(pl.X(s.target),pl.Y(Math.max(-4,Math.min(14,d.pi))),5,C.coral,'#fff')});
  const last=path[path.length-1];
  out+=counter(430,70,'year',String(s.yr),C.ink,150)+counter(430,126,'expected inflation',last.pe.toFixed(1)+'%',C.blue,150)+counter(430,182,'actual inflation',last.pi.toFixed(1)+'%',C.coral,150);
  out+=E3_para(430,256,'Each blue line is one year’s short-run curve; it rises with expectations.',22,13,C.muted,18);
  const verdict=s.target<un?'accelerates':s.target>un?'falls':'stays put';
  return {svg:out,phase:`Holding unemployment at ${s.target.toFixed(2)}% against a natural rate of ${un}%, inflation ${verdict}: after ${s.yr} year${s.yr>1?'s':''} it is ${last.pi.toFixed(1)}%. The 1970s seemed to bear this out. The idea of a natural rate is widely used but hard to pin down: estimates carry wide error bands.`};
 }});

/* ================================================================ keynes-hayek */
const E3_KH=[
 {q:'cause',l:'What causes a slump?',k:'Spending falls short of what the economy can produce, and nothing makes it recover by itself quickly. Expectations (“animal spirits”) can stay gloomy.',h:'An earlier boom built on cheap credit sent investment into projects that could not pay. The slump is the painful unwinding of those mistakes.'},
 {q:'cure',l:'What should be done?',k:'Government should fill the gap: borrow and spend, cut taxes, and keep interest rates low until employment recovers.',h:'Let the bad investments be liquidated and prices adjust. Stimulus props up the mistakes and stores up the next crisis.'},
 {q:'state',l:'What role for government?',k:'An active one in managing total demand, while leaving most decisions to markets.',h:'A limited one: rules, sound money and the price system, because no planner can know what millions of people know.'},
 {q:'risk',l:'What is the main risk?',k:'Doing too little: mass unemployment that lasts years and wastes lives and skills.',h:'Doing too much: inflation, debt and a government that keeps growing.'}];
SCENE({id:'keynes-hayek',name:'Keynes and Hayek',tag:'Two readings of a slump',
 definition:'John Maynard Keynes and Friedrich Hayek argued through the 1930s about what causes depressions and what to do. Keynes stressed a shortfall of total spending that government could make up; Hayek stressed distortions built up by cheap credit in the boom, which must be worked out.',
 example:'In 1932 Keynes and others wrote to The Times urging more spending; days later Hayek and colleagues at the LSE replied urging the opposite.',
 desc:'Four questions about slumps; for each, Keynes’s and Hayek’s answers side by side, paraphrased.',
 research:'Keynes, J. M. (1936). The General Theory of Employment, Interest and Money. Hayek, F. A. (1931). Prices and Production. Hayek, F. A. (1945). The use of knowledge in society. American Economic Review 35, 519–530. Wapshott, N. (2011). Keynes Hayek: The Clash that Defined Modern Economics. Letters to The Times, 17 and 19 October 1932.',
 dur:12,hint:'Press each question. Both views are paraphrased; neither is offered as the right answer. Joan Robinson and Richard Kahn, in Keynes’s Cambridge circle, sharpened his side; Lionel Robbins hired Hayek at the LSE.',
 init:()=>({q:'cause'}),
 watch(p){return {q:E3_KH[Math.min(3,Math.floor(p*4))].q}},
 ui:[],on:{q(s,v){s.q=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('Two readings of a slump',28)+E3_tag('debate',C.amber);
  E3_KH.forEach((c,i)=>{out+=E3_btn(X,'q',c.q,c.l,24+i*140,48,128,48,E3_wrap(c.l,18),{sel:c.q===s.q})});
  const c=E3_KH.find(c=>c.q===s.q);
  out+=R(24,112,268,200,C.pale,'none',12)+TBF(158,138,'Keynes',16,C.blue)+E3_para(40,166,c.k,36,13,C.ink,18);
  out+=R(308,112,268,200,C.amberp,'none',12)+TBF(442,138,'Hayek',16,C.amber)+E3_para(324,166,c.h,36,13,C.ink,18);
  out+=TF(300,336,'Both paraphrased. Later economists borrow from each.',13,C.muted);
  return {svg:out,phase:`${c.l} Keynes: ${c.k} Hayek: ${c.h}`};
 }});

// A toy slump: the output gap closes at a rate set by policy; stimulus speeds recovery but adds debt,
// and stimulus kept on after the gap closes adds inflation. Illustrative only.
function E3_slump(pol,stay){const out=[];let g=-8,debt=0,infl=2;for(let t=0;t<=16;t++){out.push({t,g,debt,infl});const on=pol!=='none'&&(stay||g<-.3);const close=pol==='none'?.15:pol==='fiscal'?.35:.28;const push=on&&g>=-.3?.6:0;g=g+close*(0-g)+push;if(pol==='fiscal'&&on)debt+=1.2;infl=Math.max(-1,infl+.12*g)}return out}
const E3_POL=[['none','Wait it out'],['fiscal','Spend more'],['monetary','Cut rates']];
SCENE({id:'keynes-hayek-sim',name:'A slump, three ways',tag:'A toy model',
 definition:'A toy economy starts 8% below its potential output. Waiting lets it recover slowly; spending more or cutting interest rates speeds recovery. Keeping stimulus on after the gap has closed pushes output above potential and raises inflation: the risk Hayek and later critics stressed.',
 example:'In this model, waiting takes about 13 years to bring the gap within 1%; spending more does it in about 5, but adds debt.',
 desc:'The output gap over 16 years under the chosen policy, with debt added and inflation, and a switch for keeping stimulus on after recovery.',
 research:'Illustrative model, not an estimate. Keynes, J. M. (1936). The General Theory. Hayek, F. A. (1931). Prices and Production. Ramey, V. A. (2019). Journal of Economic Perspectives 33(2), 89–114. Jordà, Ò., Schularick, M. & Taylor, A. M. (2013). When credit bites back. Journal of Money, Credit and Banking 45(s2), 3–28.',
 dur:12,hint:'Compare the three policies, then switch on “keep stimulus on”. The numbers are illustrative: the point is the shape of each trade-off, not its size.',
 init:()=>({pol:'fiscal',stay:false}),
 watch(p){return {pol:E3_POL[Math.min(2,Math.floor(p*3))][0],stay:false}},
 ui:[{choose:E3_POL,label:'Policy',get:s=>s.pol,act:'pol'},{choose:[['off','Stop when recovered'],['on','Keep stimulus on']],label:'Timing',get:s=>s.stay?'on':'off',act:'stay'}],
 on:{pol(s,v){s.pol=v;return 'keep'},stay(s,v){s.stay=v==='on';return 'keep'}},
 draw(s){
  let out=heading('A slump under three policies',28)+E3_tag('illustrative',C.purple);
  const path=E3_slump(s.pol,s.stay);
  const pl=E3_plot(80,60,320,150,[0,16],[-9,4],{xt:[[0,'0'],[4,'4'],[8,'8'],[12,'12'],[16,'16']],yt:[[-8,'−8'],[-4,'−4'],[0,'0'],[4,'+4']],yl:'output gap (% of potential)'});
  out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(16),pl.Y(0),C.green,1.5,'stroke-dasharray="6 4"');
  out+=E3_poly(path.map(d=>[pl.X(d.t),pl.Y(Math.max(-9,Math.min(4,d.g)))]),C.blue,3);
  const ip=E3_plot(80,250,320,80,[0,16],[-1,8],{xt:[[0,'0'],[8,'8'],[16,'16 years']],yt:[[0,'0'],[4,'4'],[8,'8%']],yl:'inflation'});
  out+=ip.svg+E3_poly(path.map(d=>[ip.X(d.t),ip.Y(Math.max(-1,Math.min(8,d.infl)))]),C.coral,2.4);
  const end=path[path.length-1],yrs=(path.find(d=>d.g>-1)||{t:'over 16'}).t;
  out+=counter(430,70,'years to within 1%',String(yrs),C.blue,150)+counter(430,126,'debt added',end.debt.toFixed(0),C.amber,150)+counter(430,182,'inflation, year 16',end.infl.toFixed(1)+'%',C.coral,150);
  return {svg:out,phase:`Policy “${E3_POL.find(p=>p[0]===s.pol)[1]}”${s.stay?' with stimulus kept on':''}: the gap closes to within 1% after ${yrs} years, adding ${end.debt.toFixed(0)} of debt, with inflation ending at ${end.infl.toFixed(1)}%. A toy: real recoveries depend on what caused the slump, how stimulus is spent and how people expect policy to change.`};
 }});

// What later evidence says, and which side each finding leans towards.
const E3_EVID=[
 {id:'mult',t:'Fiscal multipliers',lean:'Keynes',col:C.blue,body:'Estimates mostly lie between 0.5 and 2, larger in deep slumps in some studies (Auerbach & Gorodnichenko 2012); Ramey (2019) finds that fragile, with firmer evidence when interest rates are near zero.',cav:'Smaller in normal times, and smaller still if spending is expected to be reversed.'},
 {id:'aust',t:'Austerity after 2010',lean:'Keynes',col:C.blue,body:'The IMF found that forecasters underestimated how much cutting budgets in 2010–11 would cut growth (Blanchard & Leigh 2013).',cav:'Some countries cut without a slump; the effect depends on monetary policy and trust in public finances.'},
 {id:'credit',t:'Credit booms and crises',lean:'Hayek',col:C.amber,body:'Across 14 countries over 140 years, rapid credit growth was the best single predictor of financial crises (Schularick & Taylor 2012).',cav:'This fits Minsky as well as Hayek, and does not show that stimulus after a crash is harmful.'},
 {id:'liq',t:'Liquidation in the 1930s',lean:'Keynes',col:C.blue,body:'Letting banks fail and prices fall in 1930–33 deepened the Depression rather than clearing it (Friedman & Schwartz 1963; Bernanke 1983).',cav:'Friedman’s reading is monetary rather than Keynesian, but it rejects liquidation too.'},
 {id:'know',t:'Prices as information',lean:'Hayek',col:C.amber,body:'Central planners lacked the local knowledge that prices carry; planned economies misallocated badly (Hayek 1945; Kornai 1992).',cav:'An argument about planning, not about whether to stabilise demand in a slump.'},
 {id:'stag',t:'Stagflation in the 1970s',lean:'Both critiques',col:C.purple,body:'Demand management could not deliver low unemployment and low inflation together once expectations adjusted (Friedman 1968).',cav:'Supply shocks mattered too (Blinder & Rudd 2013).'}];
SCENE({id:'keynes-hayek-evidence',name:'What the evidence says',tag:'Ninety years later',
 definition:'Neither side won outright. Later evidence supports parts of each: stimulus helps most in deep slumps, while credit booms are dangerous and planners cannot replace prices. Most working economists today mix ideas from several schools.',
 example:'Studies of austerity after 2010 found larger multipliers than expected, a point for Keynes; studies of 140 years of crises found credit booms predict them, a point for Hayek (and Minsky).',
 desc:'Six evidence cards; pressing one shows the finding, which side it leans towards, and its caveat.',
 research:'Ramey, V. A. (2019). JEP 33(2), 89–114. Blanchard, O. & Leigh, D. (2013). AER 103(3), 117–120. Schularick, M. & Taylor, A. M. (2012). Credit booms gone bust. American Economic Review 102(2), 1029–1061. Hayek, F. A. (1945). AER 35, 519–530. Kornai, J. (1992). The Socialist System. Friedman, M. (1968). AER 58(1), 1–17.',
 dur:12,hint:'Press each card. The lean is a summary for comparison, not a verdict; every finding has a caveat.',
 init:()=>({k:'mult'}),
 watch(p){return {k:E3_EVID[Math.min(5,Math.floor(p*6))].id}},
 ui:[],on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('What later evidence says',28);
  E3_EVID.forEach((c,i)=>{const x=24+(i%3)*188,y=48+Math.floor(i/3)*58;out+=E3_btn(X,'k',c.id,c.t,x,y,176,48,E3_wrap(c.t,22),{sel:c.id===s.k})});
  const c=E3_EVID.find(c=>c.id===s.k);
  out+=R(24,174,552,170,'#fff',C.grid,10)+TBF(40,198,c.t,15,C.ink,'start')+TF(560,198,'leans: '+c.lean,13,c.col,'end');
  out+=E3_para(40,224,c.body,78,13,C.ink,18)+E3_para(40,290,'Caveat: '+c.cav,78,13,C.muted,18);
  return {svg:out,phase:`${c.t}: ${c.body} Leans towards ${c.lean}. Caveat: ${c.cav}`};
 }});

/* ================================================================ bretton-woods */
// Par values against the US dollar (dollar = 1/35 ounce of gold).
const E3_PEGS=[{id:'gbp',c:'British pound',v:'£1 = $4.03 (1946), $2.80 (1949), $2.40 (1967)',note:'Devalued twice; the 1967 devaluation followed years of defending sterling.'},
 {id:'dm',c:'West German mark',v:'$1 = DM 4.20 (1949), DM 4.00 (1961), DM 3.66 (1969)',note:'Revalued upwards as German exports boomed.'},
 {id:'frf',c:'French franc',v:'$1 = 4.937 new francs (1960), 5.55 (1969)',note:'De Gaulle’s government swapped dollars for gold in the 1960s, criticising the dollar’s “exorbitant privilege”.'},
 {id:'jpy',c:'Japanese yen',v:'$1 = ¥360 (1949–1971)',note:'Held for 22 years while Japan grew fast, so the yen became undervalued.'},
 {id:'usd',c:'US dollar',v:'$35 = 1 troy ounce of gold',note:'Foreign central banks could swap dollars for gold until 15 August 1971.'}];
SCENE({id:'bretton-woods',name:'The Bretton Woods system',tag:'Pegged to the dollar, the dollar to gold',
 definition:'In 1944, at Bretton Woods in New Hampshire, 44 countries agreed a new monetary order: currencies pegged to the US dollar at adjustable rates, the dollar convertible into gold at $35 an ounce for central banks, and a new International Monetary Fund and World Bank.',
 example:'The pound was pegged at $4.03 in 1946, devalued to $2.80 in 1949 and to $2.40 in 1967; the yen stayed at ¥360 to the dollar from 1949 to 1971.',
 desc:'A hub diagram: gold at the centre, the dollar tied to it, other currencies tied to the dollar. Pressing a currency shows its par values and its story.',
 research:'Steil, B. (2013). The Battle of Bretton Woods. Princeton University Press. Eichengreen, B. (2019). Globalizing Capital, 3rd edn. Princeton University Press. Bordo, M. D. & Eichengreen, B. (eds) (1993). A Retrospective on the Bretton Woods System. University of Chicago Press.',
 dur:11,hint:'Press each currency. Keynes led the British delegation and Harry Dexter White the American one; White’s plan, built around the dollar, largely won.',
 init:()=>({k:'gbp'}),
 watch(p){return {k:E3_PEGS[Math.min(4,Math.floor(p*5))].id}},
 ui:[],on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('Bretton Woods, 1944–1971',28);
  const cx=180;
  out+=Ci(cx,92,32,C.amberp,C.amber)+TBF(cx,97,'gold',15,C.amber)+TF(cx+40,140,'$35 an ounce',13,C.amber,'start');
  out+=L(cx,124,cx,164,C.amber,3)+hit(X,'k','usd','US dollar',R(cx-56,164,112,38,s.k==='usd'?C.pale:'#fff',s.k==='usd'?C.blue:C.line,10,'stroke-width="2"')+TBF(cx,189,'US dollar',14,C.blue));
  const others=E3_PEGS.filter(p=>p.id!=='usd'),xs=[58,138,218,298];
  others.forEach((p,i)=>{const x=xs[i];out+=L(cx,202,x,270,C.blue,1.6,'stroke-dasharray="5 4"')+hit(X,'k',p.id,p.c,R(x-36,270,72,36,s.k===p.id?C.pale:'#fff',s.k===p.id?C.blue:C.line,10,'stroke-width="2"')+TF(x,293,p.c.replace('West German ','').replace('Japanese ','').replace('British ','').replace('French ',''),13,C.ink))});
  out+=TF(cx,336,'pegged to the dollar',13,C.muted);
  const c=E3_PEGS.find(p=>p.id===s.k);
  out+=R(366,62,214,250,'#fff',C.grid,10)+TBF(473,88,c.c,15,C.ink)+E3_para(380,116,c.v,28,13,C.blue,18)+E3_para(380,190,c.note,28,13,C.ink,18);
  return {svg:out,phase:`${c.c}: ${c.v}. ${c.note} The system gave the post-war boom stable exchange rates, but its rates could be changed only rarely and painfully.`};
 }});

// Triffin's dilemma: dollars held abroad outgrow the US gold stock (rounded, $ billions at $35/oz).
const E3_TRIF=[[1950,22.8,8.6],[1955,21.8,13.5],[1960,17.8,21.0],[1965,13.8,29.1],[1968,10.9,38.5],[1970,11.1,47.0],[1971,10.2,67.8]];
SCENE({id:'bretton-woods-triffin',name:'Triffin’s dilemma',tag:'Too many dollars, too little gold',
 definition:'The world needed more dollars as trade grew, and it got them through American deficits. But the more dollars piled up abroad, the less believable the promise to swap each one for gold. Robert Triffin warned in 1960 that the system could not last.',
 example:'Around 1960 the dollars held abroad came to exceed the gold in Fort Knox. On 15 August 1971 President Nixon “closed the gold window”: dollars could no longer be exchanged for gold.',
 desc:'Two lines from 1950 to 1971: the US gold stock and dollar liabilities to foreigners, crossing around 1960, with a year cursor.',
 research:'Triffin, R. (1960). Gold and the Dollar Crisis. Yale University Press. Eichengreen, B. (2011). Exorbitant Privilege. Oxford University Press. Federal Reserve Board, Banking and Monetary Statistics; IMF International Financial Statistics (rounded; approximate).',
 dur:11,hint:'Move through the years. The crossing did not end the system at once: governments were persuaded not to cash in, until 1971.',
 init:()=>({y:1971}),
 watch(p){return {y:Math.round(lerp(1950,1971,p))}},
 ui:[{range:'y',label:'Year',min:1950,max:1971,step:1,get:s=>s.y,act:'y'}],
 on:{y(s,v){s.y=Number(v);return 'keep'}},
 draw(s){
  let out=heading('US gold against dollars held abroad',28);
  const pl=E3_plot(80,56,330,250,[1950,1971],[0,70],{xt:[[1950,'1950'],[1955,'1955'],[1960,'1960'],[1965,'1965'],[1971,'1971']],yt:[[20,'20'],[40,'40'],[60,'$60bn']],xl:'year',yl:'$ billions'});
  out+=pl.svg;
  const interp=(y,j)=>{for(let i=1;i<E3_TRIF.length;i++){const a=E3_TRIF[i-1],b=E3_TRIF[i];if(y<=b[0]){const u=(y-a[0])/(b[0]-a[0]);return lerp(a[j],b[j],u)}}return E3_TRIF[E3_TRIF.length-1][j]};
  const upto=E3_TRIF.filter(d=>d[0]<=s.y).map(d=>d[0]);if(upto[upto.length-1]!==s.y)upto.push(s.y);
  out+=E3_poly(upto.map(y=>[pl.X(y),pl.Y(interp(y,1))]),C.amber,3)+E3_poly(upto.map(y=>[pl.X(y),pl.Y(interp(y,2))]),C.coral,3);
  const g=interp(s.y,1),d=interp(s.y,2);
  out+=Ci(pl.X(s.y),pl.Y(g),5,C.amber,'#fff')+Ci(pl.X(s.y),pl.Y(d),5,C.coral,'#fff');
  out+=counter(440,70,'US gold stock',`$${g.toFixed(1)}bn`,C.amber,140)+counter(440,126,'dollars abroad',`$${d.toFixed(1)}bn`,C.coral,140)+counter(440,182,'gold per dollar',`${(g/d*100).toFixed(0)}¢`,g>=d?C.green:C.coral,140);
  out+=TF(510,262,'Rounded, approximate',13,C.muted);
  if(s.y>=1971)out+=TF(pl.X(1966),pl.Y(64),'Aug 1971: gold window closed',13,C.coral,'middle');
  return {svg:out,phase:`${s.y}: about $${g.toFixed(1)} billion of US gold against about $${d.toFixed(1)} billion of dollars held abroad, so each foreign dollar was backed by about ${(g/d*100).toFixed(0)} cents of gold. ${g<d?'The promise could no longer be kept if everyone asked at once.':'Gold still covered the dollars abroad.'}`};
 }});

// The trilemma: pick at most two of fixed exchange rate, free capital movement, independent monetary policy.
const E3_TRI=[['fixed','Fixed exchange rate'],['capital','Free movement of capital'],['policy','Own interest rates']];
const E3_REGIMES={'fixed,policy':{n:'Bretton Woods (1944–71)',t:'Fixed rates and national interest rates, made possible by capital controls.'},'capital,fixed':{n:'Gold standard (1870s–1914); euro area',t:'Fixed rates and open capital markets, giving up an independent interest rate.'},'capital,policy':{n:'Floating: US, UK, Japan today',t:'Open capital markets and their own interest rates, letting the exchange rate move.'}};
SCENE({id:'bretton-woods-trilemma',name:'The impossible trinity',tag:'Choose two of three',
 definition:'A country cannot have all three at once: a fixed exchange rate, capital that moves freely across its borders, and interest rates set for its own economy. Bretton Woods chose fixed rates and national policy, so it relied on capital controls; as controls leaked in the 1960s, the system came under strain.',
 example:'If a country pegs to the dollar and lets money flow freely, its interest rate has to follow America’s, or money floods in or out and breaks the peg.',
 desc:'Three switches; with any two on, the matching real-world regime is shown. Switching all three on shows why it cannot work.',
 research:'Mundell, R. A. (1963). Capital mobility and stabilization policy under fixed and flexible exchange rates. Canadian Journal of Economics and Political Science 29, 475–485. Fleming, J. M. (1962). IMF Staff Papers 9, 369–380. Obstfeld, M., Shambaugh, J. C. & Taylor, A. M. (2005). The trilemma in history. Review of Economics and Statistics 87, 423–438. Rey, H. (2013). Dilemma not trilemma (Jackson Hole).',
 dur:11,hint:'Switch the three goals on and off. Hélène Rey (2013) argued that global credit cycles can constrain even floating countries, so the trilemma may be closer to a dilemma.',
 init:()=>({sel:['fixed','policy']}),
 watch(p){const sets=[['fixed','policy'],['capital','fixed'],['capital','policy'],['capital','fixed','policy']];return {sel:sets[Math.min(3,Math.floor(p*4))]}},
 ui:[],on:{tog(s,v){const i=s.sel.indexOf(v);if(i>=0)s.sel=s.sel.filter(x=>x!==v);else s.sel=s.sel.concat(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('The impossible trinity',28);
  const pts=[[300,70],[150,250],[450,250]];
  out+=P(`M${pts[0][0]} ${pts[0][1]} L${pts[1][0]} ${pts[1][1]} L${pts[2][0]} ${pts[2][1]} Z`,C.line,2,'none','stroke-dasharray="6 5"');
  E3_TRI.forEach(([k,l],i)=>{const [x,y]=pts[i],on=s.sel.includes(k);out+=hit(X,'tog',k,l,R(x-92,y-22,184,44,on?C.greenp:'#fff',on?C.green:C.line,22,'stroke-width="2"')+TF(x,y+5,(on?'✓ ':'')+l,14,on?C.green:C.muted))});
  const key=s.sel.slice().sort().join(',');let title,text,col;
  if(s.sel.length===3){title='Not possible';text='All three at once: money would flow to wherever interest rates are higher until the peg breaks.';col=C.coral}
  else if(s.sel.length<2){title='Choose two';text='Switch on two goals to see which regime they describe.';col=C.muted}
  else{const r=E3_REGIMES[key];title=r.n;text=r.t;col=C.blue}
  out+=TF(300,186,'Press the goals',13,C.muted)+TF(300,204,'to switch them',13,C.muted);
  out+=TBF(300,302,title,15,col)+E3_para(300,326,text,70,13,C.ink,18,'middle');
  return {svg:out,phase:`${title}. ${text}`};
 }});
