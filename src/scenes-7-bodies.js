/* ===================== Biology era 7 · Bodies and disease (1880–today) ===================== */
// Immunity, epidemics and vaccines, how an embryo makes patterns, the heart and the microbiome.
// Every simulation is deterministic: seeded generators (rng), fixed time steps, and caches keyed by the
// inputs, so Watch, rewind and Try it agree. Sound plays only from on() handlers.
const B7_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const B7_rng=n=>rng(B7_mix(n));
const B7_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const B7_pct=(v,d=0)=>(v*100).toFixed(d)+'%';
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function B7_plot(x0,y0,w,h,xr,yr,o={}){
 const lg=!!o.log,f=v=>lg?Math.log10(v):v,X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(f(v)-f(yr[0]))/(f(yr[1])-f(yr[0]))*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0,Y(v),x0+w,Y(v),'#eef3f6',1)+TF(x0-6,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A pressable box (a button in Try it, plain in Watch).
function B7_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,9,o.sel?'stroke-width="3"':'stroke-width="1.5"')+lines.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*17,t,o.size||14,o.ink||C.ink,'middle',o.bold?'font-weight="700"':'')).join('');
 return hit(X,act,arg,label,inner);
}
// Wrap a sentence into lines of at most n characters.
function B7_wrap(s,n){const out=[];let line='';for(const w of String(s).split(' ')){if((line+' '+w).trim().length>n&&line){out.push(line);line=w}else line=(line+' '+w).trim()}if(line)out.push(line);return out}
function B7_stat(x,y,label,value,col,w=148){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+37,value,14,col)}
const B7_lines=(x,y,lines,size=14,col=C.ink,anchor='start',gap=19)=>lines.map((t,i)=>TF(x,y+i*gap,t,size,col,anchor)).join('');

/* ================================================================ immune-system */
// Eight lymphocyte clones, each with one receptor shape. An antigen selects the clone whose receptor fits.
const B7_SHAPES=[
 {n:'triangle',c:C.blue},{n:'square',c:C.coral},{n:'diamond',c:C.green},{n:'circle',c:C.purple},
 {n:'bar',c:C.amber},{n:'chevron',c:C.blue},{n:'cross',c:C.coral},{n:'star',c:C.green}];
function B7_mark(x,y,k,r=8,fill){const col=fill||B7_SHAPES[k].c;
 switch(B7_SHAPES[k].n){
  case 'triangle':return P(`M${fmt(x)} ${fmt(y-r)} L${fmt(x+r)} ${fmt(y+r*.8)} L${fmt(x-r)} ${fmt(y+r*.8)} Z`,col,1.5,col);
  case 'square':return R(x-r*.8,y-r*.8,r*1.6,r*1.6,col,'none',2);
  case 'diamond':return P(`M${fmt(x)} ${fmt(y-r)} L${fmt(x+r)} ${fmt(y)} L${fmt(x)} ${fmt(y+r)} L${fmt(x-r)} ${fmt(y)} Z`,col,1.5,col);
  case 'circle':return Ci(x,y,r*.85,col);
  case 'bar':return R(x-r,y-r*.4,r*2,r*.8,col,'none',2);
  case 'chevron':return P(`M${fmt(x-r)} ${fmt(y-r*.6)} L${fmt(x)} ${fmt(y+r*.5)} L${fmt(x+r)} ${fmt(y-r*.6)}`,col,3.5,'none');
  case 'cross':return L(x-r,y,x+r,y,col,3.5)+L(x,y-r,x,y+r,col,3.5);
  default:{const pts=range(10).map(i=>{const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;return [x+rr*Math.cos(a),y+rr*Math.sin(a)]});return P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L')+' Z',col,1,col)}
 }}
// Clone size over days after infection (illustrative): a lag, about ten doublings, then contraction to memory.
function B7_clone(day){if(day<2)return 1;if(day<=8.5)return Math.pow(2,(day-2)*1.55);const peak=Math.pow(2,6.5*1.55);return Math.max(40,peak*Math.exp(-(day-8.5)*.75))}
SCENE({id:'immune-system',name:'Clonal selection',tag:'The right cell is already there',
 definition:'In clonal selection, each lymphocyte carries one kind of receptor, made before any infection. An invader selects the few cells whose receptors fit it, and only those cells multiply into a large clone.',
 example:'A virus displaying a triangle-shaped molecule finds the rare lymphocyte with a triangle-shaped receptor. That cell divides about ten times in a week, making roughly a thousand copies that all recognise the same thing.',
 desc:'Eight lymphocyte clones, each with a different receptor shape, and an antigen you choose. Bars on a logarithmic scale show each clone’s size as the days pass; only the matching clone expands, then shrinks back to a population of memory cells.',
 research:'Burnet, F. M. (1957). A modification of Jerne’s theory of antibody production using the concept of clonal selection. Australian Journal of Science 20. Nossal & Lederberg (1958) showed one cell makes one antibody. Expansion figures are illustrative.',
 dur:12,hint:'Choose the antigen, then move through the days. Only the clone whose receptor fits it grows; the others stay at one cell.',
 init:()=>({ag:2,day:8}),
 watch(p){return {ag:2,day:Math.min(14,p*16)}},
 ui:[{choose:[[0,'Triangle virus'],[2,'Diamond bacterium'],[4,'Bar toxin'],[7,'Star parasite']],label:'Antigen',get:s=>s.ag,act:'ag'},{range:'day',label:'Days since infection',min:0,max:14,step:.5,get:s=>s.day,act:'day',show:v=>v+' days'}],
 on:{ag(s,v){s.ag=Number(v)},day(s,v){s.day=Number(v)}},
 draw(s){
  const ag=s.ag,day=s.day;let out=heading('Clonal selection: the antigen picks the clone',26);
  // Antigen on the left
  out+=R(18,46,140,140,C.coralp,'none',10)+TF(88,66,'antigen',13,C.muted);
  out+=Ci(88,112,24,'#fff',C.coral,'stroke-width="2"');range(6).forEach(i=>{const a=i*Math.PI/3;out+=B7_mark(88+34*Math.cos(a),112+34*Math.sin(a),ag,6.5)});
  out+=TF(88,174,['Triangle virus','','Diamond bacterium','','Bar toxin','','','Star parasite'][ag],13,C.ink);
  // Clones: receptor glyphs on cells
  const pl=B7_plot(200,58,370,212,[0,8],[1,2000],{log:true,yt:[[1,'1'],[10,'10'],[100,'100'],[1000,'1000']],yl:'cells in each clone (log scale)'});out+=pl.svg;
  range(8).forEach(k=>{const n=k===ag?B7_clone(day):1,x=pl.X(k+.5),y=pl.Y(n),hl=k===ag;
   out+=R(x-15,y,30,pl.Y(1)-y+.01,hl?B7_SHAPES[k].c:C.grid,'none',3);
   out+=Ci(x,296,15,'#fff',hl?B7_SHAPES[k].c:C.line,'stroke-width="2"')+B7_mark(x,296,k,7);
   if(hl)out+=TF(x,y-8,String(Math.round(n)),13,C.ink);
  });
  out+=TF(385,330,'eight lymphocyte clones, one receptor shape each',13,C.muted);
  const st=day<2?'Lag: the antigen is found and the matching cell is activated.':day<=8.5?'Expansion: the selected cell divides again and again.':'Contraction: most copies die; long-lived memory cells remain.';
  out+=T(300,362,`Day ${fmt(day)}. ${st}`,14,C.ink);
  return {svg:out,phase:'Burnet’s idea reversed the old view that the antigen teaches the cell what to make. The variety is made first, at random, and the antigen only chooses. That is why the body can answer molecules it has never met, and why one clone, and only one, expands. The numbers here are illustrative; real T-cell clones can grow ten-thousand-fold or more.'};
 }});

// Primary and secondary antibody responses (illustrative shapes, logarithmic scale).
function B7_resp(t,t0,lag,peak,tau){const tp=t0+lag;if(t<t0+lag*.35)return 0;if(t<=tp){const u=(t-t0-lag*.35)/(lag*.65);return peak*Math.pow(u,3)}return peak*Math.exp(-(t-tp)/tau)}
SCENE({id:'immune-system-memory',name:'Immune memory',tag:'Faster and stronger the second time',
 definition:'Immunological memory is the faster, larger response to an antigen the body has met before. Memory cells left after the first response start the second one from a bigger, better-matched population.',
 example:'After a first infection, antibodies take about two weeks to peak. Meeting the same antigen months later, they rise within days to a level many times higher, often before any symptoms appear.',
 desc:'Antibody level against time on a logarithmic scale, for a first exposure on day 0 and a second exposure on a day you choose. A second exposure to the same antigen gives a quick, tall response; a different antigen gives a slow, first-time response.',
 research:'Ahmed, R. & Gray, D. (1996). Immunological memory and protective immunity: understanding their relation. Science 272, 54–60. The primary–secondary response is a textbook finding; the curves here are illustrative shapes.',
 dur:10,hint:'Move the day of the second exposure and switch between the same and a different antigen.',
 init:()=>({d2:40,same:1}),
 watch(p){return {d2:40,same:p<.6?1:0,grow:Math.min(1,p/.45)}},
 ui:[{range:'d2',label:'Second exposure on day',min:25,max:70,step:1,get:s=>s.d2,act:'d2',show:v=>'day '+v},{choose:[[1,'Same antigen'],[0,'Different antigen']],label:'Second antigen',get:s=>s.same,act:'same'}],
 on:{d2(s,v){s.d2=Number(v)},same(s,v){s.same=Number(v)}},
 draw(s){
  const g=s.grow===undefined?1:s.grow,Tm=100*g,base=.01;let out=heading('First and second responses',26);
  const pl=B7_plot(80,56,470,236,[0,100],[.01,30],{log:true,xt:[[0,'0'],[20,'20'],[40,'40'],[60,'60'],[80,'80'],[100,'100']],yt:[[.01,'0.01'],[.1,'0.1'],[1,'1'],[10,'10']],xl:'days',yl:'antibody level (relative, log scale)'});out+=pl.svg;
  const first=t=>B7_resp(t,0,14,1,12),second=t=>s.same?B7_resp(t,s.d2,6,12,30):B7_resp(t,s.d2,14,1,12);
  const pts=range(401).map(i=>i*.25).filter(t=>t<=Tm).map(t=>[pl.X(t),pl.Y(Math.max(base,first(t)+second(t)))]);
  out+=B7_poly(pts,C.blue,3);
  [[0,'1st'],[s.d2,'2nd']].forEach(([d,l],i)=>{if(d<=Tm)out+=arrow(pl.X(d),pl.Y(30)-2,pl.X(d),pl.Y(30)+20,i?(s.same?C.green:C.coral):C.ink,2.2,7)+TF(pl.X(d)+6,pl.Y(30)+16,l,13,C.ink,'start')});
  const pk2=s.same?12:1,lag2=s.same?6:14;
  out+=T(300,350,s.same?`Same antigen: peak after about ${lag2} days, about ${pk2}× the first peak.`:'Different antigen: no memory, so a slow first-time response.',15,s.same?C.green:C.coral);
  out+=TF(300,374,'Shapes are illustrative; real sizes vary with the antigen and the person.',13,C.muted);
  return {svg:out,phase:'The first response is slow because the matching clone starts tiny. Memory cells left behind make the second response start sooner and climb higher, and the antibodies made later also bind more tightly (affinity maturation). Vaccines work by staging the first response safely.'};
 }});

// Metchnikoff's starfish larva: wandering cells gather around a thorn.
const B7_THORNS=[[170,170],[250,240],[330,150],[400,230],[460,175]];
function B7_cells(seed){const r=B7_rng(seed);return range(34).map(()=>{let x,y;do{x=110+r()*400;y=95+r()*190}while(((x-310)/205)**2+((y-190)/100)**2>1);return {x,y,ph:r()*6.28}})}
SCENE({id:'immune-system-phagocyte',name:'Metchnikoff’s thorn',tag:'Cells that eat invaders',
 definition:'Phagocytes are cells that engulf and digest particles, bacteria and debris. Metchnikoff argued that these wandering cells, not only substances in the blood, are the body’s first defence.',
 example:'In 1882 Élie Metchnikoff pushed rose thorns into transparent starfish larvae. The next morning the thorns were ringed by mobile cells: the start of the cellular theory of immunity.',
 desc:'A transparent larva with wandering cells and five places where you can push in a thorn. As the hours pass, cells crawl towards the thorn at a steady speed and gather around it; nearer cells arrive first.',
 research:'Metchnikoff, É. (1884). Über eine Sprosspilzkrankheit der Daphnien. Virchows Archiv 96. Nobel Prize 1908, shared with Paul Ehrlich, whose side-chain theory (1897) explained antibodies. Crawling speed here is illustrative.',
 dur:10,hint:'Press one of the crosses to push in a thorn, then move the time on. Count how many cells have arrived.',
 init:()=>({th:2,h:12}),
 watch(p){return {th:2,h:Math.min(24,p*28)}},
 ui:[{range:'h',label:'Hours after the thorn',min:0,max:24,step:1,get:s=>s.h,act:'h',show:v=>v+' h'}],
 on:{h(s,v){s.h=Number(v)},thorn(s,v){s.th=Number(v);s.h=0}},
 draw(s,f,X){
  let out=heading('Metchnikoff’s thorn in a starfish larva (1882)',26);
  out+=`<ellipse cx="310" cy="190" rx="215" ry="112" fill="#f4f9fb" stroke="${C.line}" stroke-width="2"/>`;
  const [tx,ty]=B7_THORNS[s.th],speed=13,cells=B7_cells(3);let arrived=0;
  B7_THORNS.forEach(([x,y],i)=>{if(i!==s.th)out+=hit(X,'thorn',i,`Push the thorn in at place ${i+1}`,L(x-7,y-7,x+7,y+7,C.line,2)+L(x-7,y+7,x+7,y-7,C.line,2)+Ci(x,y,14,'transparent'))});
  out+=L(tx-30,ty-30,tx+4,ty+4,C.amber,5)+P(`M${tx+4} ${ty+4} l-9 -2 l7 -7 z`,C.amber,2,C.amber);
  cells.forEach(c=>{const d=Math.hypot(c.x-tx,c.y-ty),reach=Math.max(0,d-18),u=Math.min(1,s.h*speed/Math.max(1,reach)),a=Math.atan2(c.y-ty,c.x-tx)+c.ph*.05;
   const x=lerp(c.x,tx+18*Math.cos(a+c.ph),u),y=lerp(c.y,ty+18*Math.sin(a+c.ph),u);if(u>=1)arrived++;
   out+=`<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="7" ry="5.5" fill="${u>=1?C.coral:C.blue}" opacity=".85" transform="rotate(${fmt(c.ph*30)} ${fmt(x)} ${fmt(y)})"/>`});
  out+=counter(30,300,'cells at the thorn',`${arrived} of ${cells.length}`,C.coral,150)+counter(430,300,'time',`${s.h} h`,C.blue,140);
  out+=T(300,370,'Blue: wandering cells. Coral: cells that have reached the thorn.',14,C.muted);
  return {svg:out,phase:'Metchnikoff saw the cells gather overnight and guessed that the same cells fight bacteria in us. Ehrlich stressed antibodies in the blood instead. Both were right: cells and antibodies work together, and they shared the 1908 Nobel Prize. Here nearer cells arrive first because all crawl at the same illustrative speed.'};
 }});

/* ================================================================ epidemics-sir */
// SIR model (Kermack & McKendrick 1927), fractions of the population, RK4 with a 0.1-day step.
const B7_SIRC=new Map();
function B7_sir(R0,D,T=200,cut=null){
 const key=[R0,D,T,cut?cut.join(','):''].join('|');if(B7_SIRC.has(key))return B7_SIRC.get(key);
 const g=1/D,h=.1,out=[];let S=.999,I=.001,Rr=0;
 const beta=t=>R0*g*(cut&&t>=cut[1]&&t<cut[1]+cut[2]?1-cut[0]:1);
 const f=(t,S,I)=>{const b=beta(t);return [-b*S*I,b*S*I-g*I]};
 for(let i=0;i<=T/h;i++){const t=i*h;if(i%5===0)out.push({t,S,I,R:Rr});
  const k1=f(t,S,I),k2=f(t+h/2,S+h/2*k1[0],I+h/2*k1[1]),k3=f(t+h/2,S+h/2*k2[0],I+h/2*k2[1]),k4=f(t+h,S+h*k3[0],I+h*k3[1]);
  const dS=h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),dI=h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]);S+=dS;I+=dI;Rr=1-S-I}
 if(B7_SIRC.size>200)B7_SIRC.clear();B7_SIRC.set(key,out);return out;
}
// Final size: the fraction ever infected, z = 1 − exp(−R0 z) (starting almost everyone susceptible).
function B7_final(R0,s0=1){if(R0*s0<=1)return 0;let z=.9*s0;for(let i=0;i<200;i++)z=s0*(1-Math.exp(-R0*z));return z}
SCENE({id:'epidemics-sir',name:'The SIR model',tag:'Susceptible, infected, recovered',
 definition:'The SIR model splits a population into the susceptible, the infected and the recovered. Each infected person infects others at a rate set by contacts and passes on R0 new infections on average when everyone else is susceptible.',
 example:'With R0 = 2.5 and an infectious period of 9 days, infections rise, peak when only 1 in 2.5 people (40%) are still susceptible, then fall. In the end about 89% have been infected, more than the 60% needed for herd immunity, because the epidemic overshoots.',
 desc:'Three curves for the fractions susceptible (blue), infected (coral) and recovered (green) over 200 days, with sliders for R0 and the infectious period. The dashed line marks 1/R0: infections peak when the susceptible curve crosses it.',
 research:'Kermack, W. O. & McKendrick, A. G. (1927). A contribution to the mathematical theory of epidemics. Proceedings of the Royal Society A 115, 700–721. Final size from z = 1 − e^(−R0 z).',
 dur:12,hint:'Change R0 and the infectious period. A longer infectious period with the same R0 gives a slower, flatter epidemic with the same final size.',
 init:()=>({r0:2.5,d:9,t:200}),
 watch(p){return {r0:p<.7?2.5:1.6,d:9,t:Math.min(200,p<.7?p/.6*200:200)}},
 ui:[{range:'r0',label:'R0 (basic reproduction number)',min:.5,max:6,step:.1,get:s=>s.r0,act:'r0',show:v=>Number(v).toFixed(1)},{range:'d',label:'Infectious period',min:3,max:14,step:1,get:s=>s.d,act:'d',show:v=>v+' days'},{range:'t',label:'Show up to day',min:10,max:200,step:5,get:s=>s.t,act:'t',show:v=>'day '+v}],
 on:{r0(s,v){s.r0=Number(v)},d(s,v){s.d=Number(v)},t(s,v){s.t=Number(v)}},
 draw(s){
  const run=B7_sir(s.r0,s.d),Tm=s.t;let out=heading(`SIR epidemic: R0 = ${s.r0.toFixed(1)}, infectious for ${s.d} days`,26);
  const pl=B7_plot(70,52,350,240,[0,200],[0,1],{xt:[[0,'0'],[50,'50'],[100,'100'],[150,'150'],[200,'200']],yt:[[0,'0%'],[.25,'25%'],[.5,'50%'],[.75,'75%'],[1,'100%']],xl:'days',yl:'share of the population'});out+=pl.svg;
  const vis=run.filter(r=>r.t<=Tm);
  if(s.r0>1)out+=L(pl.X(0),pl.Y(1/s.r0),pl.X(200),pl.Y(1/s.r0),C.muted,1.5,'stroke-dasharray="6 5"')+TF(pl.X(200)-4,pl.Y(1/s.r0)-6,'1/R0',13,C.muted,'end');
  [['S',C.blue],['I',C.coral],['R',C.green]].forEach(([k,col])=>out+=B7_poly(vis.map(r=>[pl.X(r.t),pl.Y(r[k])]),col,3));
  let pk=run[0];run.forEach(r=>{if(r.I>pk.I)pk=r});
  if(pk.t<=Tm&&s.r0>1)out+=Ci(pl.X(pk.t),pl.Y(pk.I),5.5,C.coral)+L(pl.X(pk.t),pl.Y(pk.I),pl.X(pk.t),pl.Y(0),C.coral,1,'stroke-dasharray="3 3"');
  const fin=run[run.length-1].R,eq=B7_final(s.r0);
  out+=TF(440,74,'susceptible',14,C.blue,'start')+TF(440,96,'infected',14,C.coral,'start')+TF(440,118,'recovered',14,C.green,'start');
  out+=counter(440,140,'peak infected',s.r0>1?B7_pct(pk.I,1):'none',C.coral,130);
  out+=counter(440,194,'peak on day',s.r0>1?String(Math.round(pk.t)):'—',C.coral,130);
  out+=counter(440,248,'ever infected',B7_pct(fin,0),C.green,130);
  out+=T(300,342,s.r0>1?`Final-size equation predicts ${B7_pct(eq,1)}; herd-immunity threshold 1 − 1/R0 = ${B7_pct(1-1/s.r0,0)}.`:'R0 below 1: each case causes less than one more, so the outbreak fades.',14,C.ink);
  out+=TF(300,366,'Idealised: everyone mixes equally; recovery gives lasting immunity; no births or deaths.',13,C.muted);
  return {svg:out,phase:s.r0>1?`Infections grow while each case infects more than one person, that is while R0 × S is above 1. They peak exactly when the susceptible share falls to 1/R0 (${B7_pct(1/s.r0,0)}). The epidemic keeps going past that point, so more people are infected than the herd-immunity threshold alone would need.`:'With R0 below 1 there is no epidemic: chains of infection shrink.'};
 }});

SCENE({id:'epidemics-sir-flatten',name:'Flattening the curve',tag:'Fewer contacts, for how long?',
 definition:'Cutting contacts lowers the transmission rate, so the epidemic peaks lower and later. If the measures stop while many people are still susceptible, infections can rise again.',
 example:'With R0 = 2.5, halving contacts from day 30 for 60 days keeps the peak below the capacity line, but when contacts return a second wave follows, because most people are still susceptible.',
 desc:'An SIR epidemic with R0 = 2.5 and a 7-day infectious period, without measures (dashed) and with contacts cut by your chosen amount, from your chosen day, for your chosen length. A horizontal line marks an illustrative hospital capacity.',
 research:'Kermack & McKendrick (1927). Hatchett, Mecher & Lipsitch (2007). Public health interventions and epidemic intensity during the 1918 influenza pandemic. PNAS 104, 7582–7587: cities that intervened earlier had lower peaks. Ferguson et al. (2020), Imperial College Report 9. Capacity line illustrative.',
 dur:12,hint:'Change how much contacts are cut, when and for how long. Look at the peak, the days over capacity and whether a second wave appears.',
 init:()=>({cut:50,start:30,len:60}),
 watch(p){return {cut:Math.round(Math.min(1,p/.6)*50),start:30,len:p<.75?200:60}},
 ui:[{range:'cut',label:'Contacts cut by',min:0,max:80,step:5,get:s=>s.cut,act:'cut',show:v=>v+'%'},{range:'start',label:'Starting on day',min:5,max:90,step:5,get:s=>s.start,act:'start',show:v=>'day '+v},{range:'len',label:'Lasting',min:20,max:200,step:10,get:s=>s.len,act:'len',show:v=>v>=200?'to the end':v+' days'}],
 on:{cut(s,v){s.cut=Number(v)},start(s,v){s.start=Number(v)},len(s,v){s.len=Number(v)}},
 draw(s){
  const base=B7_sir(2.5,7,240),run=B7_sir(2.5,7,240,[s.cut/100,s.start,s.len>=200?999:s.len]),cap=.06;let out=heading('Flattening the curve (R0 = 2.5, illustrative capacity)',26);
  const pl=B7_plot(70,52,350,236,[0,240],[0,.25],{xt:[[0,'0'],[60,'60'],[120,'120'],[180,'180'],[240,'240']],yt:[[0,'0%'],[.05,'5%'],[.1,'10%'],[.15,'15%'],[.2,'20%'],[.25,'25%']],xl:'days',yl:'share infected at once'});out+=pl.svg;
  const e=s.len>=200?240:Math.min(240,s.start+s.len);out+=R(pl.X(s.start),52,pl.X(e)-pl.X(s.start),236,C.greenp,'none',0,'opacity=".7"')+TF((pl.X(s.start)+pl.X(e))/2,68,`contacts −${s.cut}%`,13,C.green);
  out+=L(pl.X(0),pl.Y(cap),pl.X(240),pl.Y(cap),C.amber,2,'stroke-dasharray="8 5"')+TF(pl.X(240)-4,pl.Y(cap)-6,'capacity',13,C.amber,'end');
  out+=B7_poly(base.map(r=>[pl.X(r.t),pl.Y(r.I)]),C.muted,2,'stroke-dasharray="6 5"');
  out+=B7_poly(run.map(r=>[pl.X(r.t),pl.Y(r.I)]),C.coral,3.2);
  const pk=a=>a.reduce((m,r)=>r.I>m.I?r:m,a[0]),over=a=>a.filter(r=>r.I>cap).length*.5,fin=a=>a[a.length-1].R;
  const b=pk(base),m=pk(run);
  out+=TF(440,70,'grey dashed:',13,C.muted,'start')+TF(440,88,'without measures',13,C.muted,'start');
  out+=B7_stat(440,102,'peak',`${B7_pct(m.I,1)} · was ${B7_pct(b.I,1)}`,C.coral)+B7_stat(440,156,'days over capacity',`${Math.round(over(run))} · was ${Math.round(over(base))}`,C.amber)+B7_stat(440,210,'ever infected',`${B7_pct(fin(run))} · was ${B7_pct(fin(base))}`,C.green);
  const second=run.some((r,i)=>i>2&&r.t>e&&r.I>run[i-1].I&&r.I>.005);
  out+=T(300,342,second?'A second wave: the measures ended while most people were still susceptible.':s.cut?'Lower and later: the same model, with fewer contacts.':'No measures: the dashed and solid curves coincide.',14,second?C.coral:C.ink);
  out+=TF(300,366,'Well-mixed SIR model; real epidemics also depend on behaviour and season.',13,C.muted);
  return {svg:out,phase:'Cutting contacts lowers the effective reproduction number. A long enough cut keeps the peak under capacity; lifting it early leaves enough susceptible people for infections to grow again, which is what many cities saw in 1918.'};
 }});

// Reed–Frost chain binomial: 100 people, one first case, generations of infection.
function B7_reedFrost(R0,seed,N=100){const r=B7_rng(seed),p=R0/(N-1);let S=N-1,I=1,tot=1;const gens=[1];
 for(let g=0;g<40&&I>0;g++){const q=1-Math.pow(1-p,I);let n=0;for(let k=0;k<S;k++)if(r()<q)n++;S-=n;I=n;tot+=n;if(n)gens.push(n)}
 return {tot,gens}}
// Chance that one case's chain dies out (Poisson offspring, one generation infectious): q = exp(−R0(1−q)).
function B7_extinct(R0){if(R0<=1)return 1;let q=.5;for(let i=0;i<500;i++)q=Math.exp(-R0*(1-q));return q}
SCENE({id:'epidemics-sir-chance',name:'Outbreaks and chance',tag:'Why some sparks go out',
 definition:'When cases are few, chance matters: a first case may recover before infecting anyone. Even with R0 above 1, many introductions fizzle out, and the rest grow into large outbreaks. Final sizes split into two groups.',
 example:'With R0 = 2 in a group of 100, about one introduction in five dies out after a handful of cases; the others infect about 80 people. When cases stay infectious for a fixed time, the chance of fizzling out solves q = e^(−R0(1−q)); when infectious times vary widely it is larger, up to 1/R0.',
 desc:'A Reed–Frost chain-binomial model of a closed group of 100 people. Each run starts with one case. Bars show the cases in each generation of the last run, and a histogram collects the final sizes of all runs.',
 research:'The Reed–Frost model (Reed & Frost, lectures 1928; published by Abbey 1952). Branching-process theory gives the chance of a minor outbreak; Whittle, P. (1955), Biometrika 42, 116–122, showed it is about 1/R0 when infectious periods are exponentially distributed.',
 dur:10,hint:'Set R0, then press Run 20 outbreaks a few times. Count the runs that die out early against those that take off.',
 init:()=>({r0:2,runs:[],seed:1}),
 watch(p){const n=Math.floor(p*60);return {r0:2,runs:range(n).map(i=>B7_reedFrost(2,1000+i).tot),last:n?B7_reedFrost(2,1000+n-1):null,seed:1}},
 ui:[{range:'r0',label:'R0',min:.5,max:4,step:.1,get:s=>s.r0,act:'r0',show:v=>Number(v).toFixed(1)},{b:'Run one outbreak',act:'one'},{b:'Run 20 outbreaks',act:'twenty'},{b:'Clear and reseed',act:'clear'}],
 on:{r0(s,v){s.r0=Number(v);s.runs=[];s.last=null},
  one(s){const res=B7_reedFrost(s.r0,s.seed*7919+s.runs.length);s.runs.push(res.tot);s.last=res;return 'keep'},
  twenty(s){for(let i=0;i<20;i++){const res=B7_reedFrost(s.r0,s.seed*7919+s.runs.length);s.runs.push(res.tot);s.last=res}return 'keep'},
  clear(s){s.runs=[];s.last=null;s.seed=nextSeed()%100000+1}},
 draw(s){
  let out=heading(`Outbreaks in a group of 100 (R0 = ${s.r0.toFixed(1)})`,26);
  const g=s.last?s.last.gens:[];out+=TF(40,60,'last run: new cases in each generation',13,C.muted,'start');
  const gp=B7_plot(40,72,230,190,[0,16],[0,50],{yt:[[0,'0'],[25,'25'],[50,'50']],xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15']],xl:'generation'});out+=gp.svg;
  g.slice(0,16).forEach((n,i)=>out+=R(gp.X(i)+1.5,gp.Y(Math.min(50,n)),gp.X(1)-gp.X(0)-3,gp.Y(0)-gp.Y(Math.min(50,n)),C.coral,'none',2));
  if(s.last)out+=TF(155,92,`${s.last.tot} infected in all`,14,C.ink);
  const bins=range(10).map(b=>s.runs.filter(v=>Math.min(9,Math.floor((v-1)/10))===b).length),mx=Math.max(4,...bins);
  out+=TF(320,60,'final sizes of all runs',13,C.muted,'start');
  const hp=B7_plot(320,72,250,190,[0,10],[0,mx],{xt:[[0,'1'],[5,'51'],[10,'100']],yt:[[0,'0'],[mx,String(mx)]],xl:'people infected in the end'});out+=hp.svg;
  bins.forEach((n,i)=>{if(n)out+=R(hp.X(i)+2,hp.Y(n),hp.X(1)-hp.X(0)-4,hp.Y(0)-hp.Y(n),i<2?C.blue:C.green,'none',2)});
  const small=s.runs.filter(v=>v<=20).length,n=s.runs.length;
  out+=T(300,330,n?`${n} runs: ${small} died out with 20 or fewer cases (${B7_pct(small/n)}).`:'No runs yet.',15,C.ink);
  out+=T(300,356,s.r0>1?`Theory for this model: ${B7_pct(B7_extinct(s.r0))} die out early; large outbreaks reach about ${Math.round(100*B7_final(s.r0))}.`:'With R0 at or below 1 almost every run stays small.',14,C.muted);
  return {svg:out,phase:'Each case infects a random number of others. Early on, a run of bad luck for the virus ends the chain; once there are many cases, chance averages out and the outbreak follows the deterministic curve. That is why public health teams chase the first cases so hard.'};
 }});

/* ================================================================ vaccines-herd */
const B7_DIS={measles:{n:'Measles',r0:15,note:'typical range 12–18'},polio:{n:'Polio',r0:6,note:'typical range 5–7'},flu:{n:'Pandemic flu (1918)',r0:2,note:'estimates about 2–3'}};
// Fraction of everyone infected when a share v is vaccinated with effectiveness e: z = (1 − v·e)(1 − exp(−R0 z)).
function B7_herdSize(R0,v,e){return B7_final(R0,1-v*e)}
SCENE({id:'vaccines-herd',name:'Herd immunity',tag:'Protecting those who cannot be vaccinated',
 definition:'Herd immunity is indirect protection: when enough people are immune, each case infects fewer than one other on average and outbreaks die out, protecting people who are not immune too. With a perfect vaccine the threshold is 1 − 1/R0.',
 example:'Measles has an R0 of about 12–18, so roughly 92–95% of people must be immune. Pandemic flu, with R0 around 2, needs about 50%.',
 desc:'A group of 400 people, with the share vaccinated set by you. Green squares are vaccinated, coral are infected in the final outbreak, white escaped. A curve below shows the final outbreak size against coverage, with the threshold marked.',
 research:'Anderson, R. M. & May, R. M. (1991). Infectious Diseases of Humans. Oxford University Press. Fine, P. E. M. (1993). Herd immunity: history, theory, practice. Epidemiologic Reviews 15, 265–302. Threshold with imperfect vaccine: (1 − 1/R0)/E.',
 dur:12,hint:'Choose a disease, then raise the coverage. Lower the vaccine effectiveness and see the threshold move up, or out of reach.',
 init:()=>({dz:'measles',v:80,e:97}),
 watch(p){return {dz:'measles',v:Math.round(Math.min(98,p/.85*98)),e:97}},
 ui:[{choose:Object.keys(B7_DIS).map(k=>[k,B7_DIS[k].n]),label:'Disease',get:s=>s.dz,act:'dz'},{range:'v',label:'Vaccinated',min:0,max:100,step:1,get:s=>s.v,act:'v',show:v=>v+'%'},{range:'e',label:'Vaccine effectiveness',min:50,max:100,step:1,get:s=>s.e,act:'e',show:v=>v+'%'}],
 on:{dz(s,v){s.dz=v},v(s,v){s.v=Number(v)},e(s,v){s.e=Number(v)}},
 draw(s){
  const d=B7_DIS[s.dz],R0=d.r0,v=s.v/100,e=s.e/100,z=B7_herdSize(R0,v,e),thr=(1-1/R0)/e;let out=heading(`${d.n}: R0 ≈ ${R0} (${d.note})`,26);
  const order=shuffled(range(400),77),nv=Math.round(400*v),vac=new Set(order.slice(0,nv)),others=order.slice(nv),ni=Math.round(400*z),inf=new Set(shuffled(others,13).slice(0,ni));
  range(400).forEach(i=>{const x=30+(i%20)*11,y=54+Math.floor(i/20)*11;out+=R(x,y,9.2,9.2,vac.has(i)?C.green:inf.has(i)?C.coral:'#fff',vac.has(i)||inf.has(i)?'none':C.line,2)});
  out+=TF(30,290,'green: vaccinated · coral: infected',13,C.muted,'start')+TF(30,308,'white: escaped infection',13,C.muted,'start');
  const pl=B7_plot(320,60,250,170,[0,1],[0,1],{xt:[[0,'0%'],[.5,'50%'],[1,'100%']],yt:[[0,'0%'],[.5,'50%'],[1,'100%']],xl:'share vaccinated',yl:'share infected in the end'});out+=pl.svg;
  out+=B7_poly(range(101).map(i=>[pl.X(i/100),pl.Y(B7_herdSize(R0,i/100,e))]),C.coral,2.6);
  if(thr<=1)out+=L(pl.X(thr),60,pl.X(thr),230,C.green,2,'stroke-dasharray="6 4"')+TF(pl.X(thr)-4,76,'threshold',13,C.green,'end');
  out+=Ci(pl.X(v),pl.Y(z),6.5,C.ink);
  out+=counter(320,270,'infected',`${ni} of 400`,C.coral,120)+counter(450,270,'threshold',thr<=1?B7_pct(thr):'unreachable',C.green,120);
  out+=T(300,346,thr>1?'Even 100% coverage cannot stop spread with a vaccine this weak.':v>=thr?'Above the threshold: one case cannot start a large outbreak.':'Below the threshold: outbreaks can still spread.',14,v>=thr&&thr<=1?C.green:C.coral);
  out+=TF(300,370,'Well-mixed model: clusters of unvaccinated people can still have outbreaks.',13,C.muted);
  return {svg:out,phase:`For ${d.n.toLowerCase()} the threshold is 1 − 1/${R0} = ${B7_pct(1-1/R0)} with a perfect vaccine${e<1?`, or ${thr<=1?B7_pct(thr):'more than 100%'} at ${s.e}% effectiveness`:''}. Below it, infections still spread, but each vaccinated person also shrinks the outbreak among others.`};
 }});

const B7_JENNER=[
 {y:'by 1500s',t:'Variolation',b:'Deliberately infecting people with matter from smallpox sores gave a milder illness and lasting immunity. It was practised in China, India and parts of Africa long before it reached Europe.'},
 {y:'1721',t:'Inoculation reaches London and Boston',b:'Lady Mary Wortley Montagu had her children inoculated, having seen the practice in Constantinople. In Boston, Onesimus, an enslaved West African man, told Cotton Mather how it was done in his homeland.'},
 {y:'1796',t:'Jenner’s test',b:'Edward Jenner took cowpox from the hand of the milkmaid Sarah Nelmes and inoculated James Phipps. Later exposure to smallpox matter caused no disease. Cowpox was far safer than variolation.'},
 {y:'1798',t:'An Inquiry',b:'Jenner published his cases. “Vaccination” comes from vacca, Latin for cow. The method spread worldwide within a few years, with fierce public debate.'},
 {y:'1853',t:'Compulsory vaccination',b:'Britain made infant vaccination compulsory, provoking organised resistance and later an exemption for conscientious objectors (1898).'},
 {y:'1967',t:'Intensified eradication',b:'The World Health Organization’s programme combined mass vaccination with surveillance and containment: find each case and vaccinate everyone around it (ring vaccination).'},
 {y:'1977',t:'The last natural case',b:'Ali Maow Maalin, a hospital cook in Merca, Somalia, recovered from the last naturally acquired case of smallpox.'},
 {y:'1980',t:'Eradicated',b:'The World Health Assembly declared smallpox eradicated: the first human disease removed from the wild by deliberate effort.'}];
SCENE({id:'vaccines-herd-jenner',name:'From variolation to eradication',tag:'Smallpox, 1500s–1980',
 definition:'Vaccination trains the immune system with a harmless relative or part of a germ. Smallpox vaccination began with Jenner’s use of cowpox in 1796, built on older practices of variolation, and ended with eradication in 1980.',
 example:'Jenner inoculated eight-year-old James Phipps with cowpox in 1796; a later challenge with smallpox matter caused no illness. Under two centuries later, ring vaccination ended natural smallpox.',
 desc:'A timeline of eight steps from variolation to eradication. Press a step or use the buttons to read what happened and who did it.',
 research:'Jenner, E. (1798). An Inquiry into the Causes and Effects of the Variolae Vaccinae. Fenner, F. et al. (1988). Smallpox and its Eradication. World Health Organization. Riedel, S. (2005). Edward Jenner and the history of smallpox and vaccination. Baylor University Medical Center Proceedings 18, 21–25.',
 dur:12,hint:'Press a date, or use Earlier and Later. Jenner’s experiment would not pass an ethics committee today: the child was deliberately exposed to smallpox matter.',
 init:()=>({k:2}),
 watch(p){return {k:Math.min(7,Math.floor(p*8))}},
 ui:[{b:'Earlier',act:'step',arg:-1},{b:'Later',act:'step',arg:1}],
 on:{step(s,v){s.k=clamp(s.k+Number(v),0,7);return 'keep'},pick(s,v){s.k=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Smallpox: from variolation to eradication',26);
  const x0=50,x1=550,xs=range(8).map(i=>x0+i*(x1-x0)/7);out+=L(x0,82,x1,82,C.line,3);
  B7_JENNER.forEach((e,i)=>{const sel=i===s.k;out+=hit(X,'pick',i,`${e.y}: ${e.t}`,Ci(xs[i],82,sel?13:9,sel?C.coral:'#fff',sel?C.coral:C.blue,'stroke-width="2.5"')+Ci(xs[i],82,18,'transparent'));
   out+=TF(xs[i],i%2?118:58,e.y,13,sel?C.coral:C.muted)});
  const e=B7_JENNER[s.k];out+=R(40,140,520,170,C.pale,'none',12);
  out+=TB(300,170,`${e.y} · ${e.t}`,17,C.ink);
  out+=B7_lines(64,202,B7_wrap(e.b,64),15,C.ink,'start',22);
  out+=T(300,346,`Step ${s.k+1} of 8`,14,C.muted);
  return {svg:out,phase:'Vaccination grew out of folk and medical practice from several continents. Smallpox could be eradicated because it infects only humans, every infection is visible, and the vaccine gives strong, lasting protection; few diseases share all three.'};
 }});

const B7_STUDIES=[
 {n:'Wakefield et al. 1998',k:12,c:C.coral,t:'12 children, no control group. Retracted by The Lancet in 2010 after findings of misrepresented data; the lead author was struck off the UK medical register.'},
 {n:'Madsen et al. 2002',k:537303,c:C.green,t:'All children born in Denmark 1991–1998: no higher risk of autism in vaccinated than unvaccinated children (NEJM).'},
 {n:'Taylor et al. 2014',k:1256407,c:C.green,t:'Meta-analysis of cohort and case–control studies covering over 1.25 million children: no link between vaccines and autism (Vaccine).'},
 {n:'Hviid et al. 2019',k:657461,c:C.green,t:'Danish children born 1999–2010: hazard ratio 0.93 (95% CI 0.85–1.01), no increased risk, including in children with autistic siblings (Annals of Internal Medicine).'}];
SCENE({id:'vaccines-herd-evidence',name:'A retracted scare',tag:'MMR and autism',
 definition:'A retracted paper is one withdrawn by the journal because its findings cannot be trusted. The 1998 paper that suggested a link between the MMR vaccine and autism was retracted, and large later studies found no link.',
 example:'The 1998 study described 12 children. Studies since have followed over a million children and found no difference in autism rates between vaccinated and unvaccinated children.',
 desc:'Four studies drawn as bars on a logarithmic scale of the number of children studied. Press a study to read what it found. A second view shows how MMR coverage in England fell after the scare and later recovered (approximate values).',
 research:'Wakefield, A. J. et al. (1998), The Lancet 351, retracted 2010. Godlee, F. et al. (2011). Wakefield’s article linking MMR vaccine and autism was fraudulent. BMJ 342. Madsen et al. (2002) NEJM 347; Taylor, Swerdfeger & Eslick (2014) Vaccine 32; Hviid et al. (2019) Annals of Internal Medicine 170.',
 dur:10,hint:'Press each study. Then switch to the coverage view.',
 init:()=>({k:0,view:'studies'}),
 watch(p){return {k:Math.min(3,Math.floor(p*5)),view:p<.8?'studies':'coverage'}},
 ui:[{choose:[['studies','The studies'],['coverage','MMR coverage in England']],label:'View',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v},pick(s,v){s.k=Number(v);s.view='studies';return 'keep'}},
 draw(s,f,X){
  let out=heading(s.view==='studies'?'How many children did each study follow?':'MMR coverage at age two, England (approximate)',26);
  if(s.view==='studies'){
   const X0=210,W=340,lx=v=>X0+Math.log10(v)/7*W;
   [1,100,10000,1000000].forEach(v=>out+=L(lx(v),52,lx(v),222,C.grid,1)+TF(lx(v),240,v>=1e6?'1 million':v>=1e4?'10,000':String(v),13,C.muted));
   B7_STUDIES.forEach((st,i)=>{const y=58+i*40,sel=i===s.k;
    out+=hit(X,'pick',i,`${st.n}: ${st.k.toLocaleString('en-GB')} children`,R(20,y,180,30,sel?C.pale:'#fff',sel?C.blue:C.line,7,sel?'stroke-width="2.5"':'')+TF(30,y+20,st.n,14,C.ink,'start'));
    out+=R(X0,y+4,lx(st.k)-X0,22,st.c,'none',4,sel?'':'opacity=".55"')+TF(lx(st.k)+6,y+20,st.k.toLocaleString('en-GB'),13,C.ink,'start')});
   out+=R(20,256,560,96,C.pale,'none',10)+B7_lines(36,282,B7_wrap(B7_STUDIES[s.k].t,74),14,C.ink,'start',20);
  }else{
   const data=[[1996,92],[1998,88],[2000,88],[2002,84],[2004,80],[2006,85],[2008,85],[2010,89],[2012,92]];
   const pl=B7_plot(80,56,440,220,[1995,2013],[70,100],{xt:[[1996,'1996'],[2000,'2000'],[2004,'2004'],[2008,'2008'],[2012,'2012']],yt:[[70,'70%'],[80,'80%'],[90,'90%'],[100,'100%']],xl:'year'});out+=pl.svg;
   out+=L(pl.X(1995),pl.Y(95),pl.X(2013),pl.Y(95),C.green,1.8,'stroke-dasharray="6 4"')+TF(pl.X(2013)-4,pl.Y(95)-6,'about 95% needed for measles',13,C.green,'end');
   out+=L(pl.X(1998),56,pl.X(1998),276,C.coral,1.5,'stroke-dasharray="3 3"')+TF(pl.X(1998)+4,pl.Y(72),'1998 paper',13,C.coral,'start');
   out+=B7_poly(data.map(([y,v])=>[pl.X(y),pl.Y(v)]),C.blue,3)+data.map(([y,v])=>Ci(pl.X(y),pl.Y(v),4.5,C.blue)).join('');
   out+=T(300,320,'Coverage fell to about 80% by 2003–04, and measles became endemic again in England and Wales by 2008.',14,C.ink);
   out+=TF(300,344,'Values rounded from published annual coverage figures; shown to give the shape, not exact data.',13,C.muted);
  }
  return {svg:out,phase:'One small, flawed study received enormous attention; the studies that answered it were thousands of times larger. A retraction does not undo a scare: coverage took about a decade to recover, and measles returned in the meantime.'};
 }});

/* ================================================================ morphogenesis */
// Gray–Scott reaction–diffusion (Pearson 1993), a system in the spirit of Turing (1952). Grid 60×36, periodic.
const B7_GW=60,B7_GH=36,B7_GSTEP=500,B7_GMAX=6000,B7_GSC=new Map();
const B7_GPRE={spots:{n:'Spots',F:.03,k:.062},stripes:{n:'Stripes',F:.055,k:.062}};
function B7_grayScott(pre,seed){
 const key=pre+'|'+seed;if(B7_GSC.has(key))return B7_GSC.get(key);
 const {F,k}=B7_GPRE[pre],W=B7_GW,H=B7_GH,n=W*H,r=B7_rng(seed);let u=new Float32Array(n).fill(1),v=new Float32Array(n),u2=new Float32Array(n),v2=new Float32Array(n);
 for(let q=0;q<8;q++){const cx=Math.floor(r()*W),cy=Math.floor(r()*H);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const i=((cy+dy+H)%H)*W+((cx+dx+W)%W);u[i]=.5;v[i]=.25+.05*r()}}
 const snaps=[Float32Array.from(v)];
 for(let t=1;t<=B7_GMAX;t++){
  for(let y=0;y<H;y++){const ym=((y-1+H)%H)*W,y0=y*W,yp=((y+1)%H)*W;
   for(let x=0;x<W;x++){const xm=(x-1+W)%W,xp=(x+1)%W,i=y0+x;
    const lu=-u[i]+.2*(u[ym+x]+u[yp+x]+u[y0+xm]+u[y0+xp])+.05*(u[ym+xm]+u[ym+xp]+u[yp+xm]+u[yp+xp]);
    const lv=-v[i]+.2*(v[ym+x]+v[yp+x]+v[y0+xm]+v[y0+xp])+.05*(v[ym+xm]+v[ym+xp]+v[yp+xm]+v[yp+xp]);
    const uvv=u[i]*v[i]*v[i];u2[i]=u[i]+lu-uvv+F*(1-u[i]);v2[i]=v[i]+.5*lv+uvv-(F+k)*v[i]}}
  let tmp=u;u=u2;u2=tmp;tmp=v;v=v2;v2=tmp;
  if(t%B7_GSTEP===0)snaps.push(Float32Array.from(v));
 }
 if(B7_GSC.size>8)B7_GSC.clear();B7_GSC.set(key,snaps);return snaps;
}
const B7_GCOL=['#ffffff','#f6dccf','#e3a083','#c45238'];
function B7_gField(v,x0,y0,cs){let out=R(x0,y0,B7_GW*cs,B7_GH*cs,'#fff',C.line,4);
 for(let y=0;y<B7_GH;y++){let x=0;while(x<B7_GW){const lv=v[y*B7_GW+x],b=lv>.3?3:lv>.18?2:lv>.08?1:0;let e=x+1;while(e<B7_GW){const l2=v[y*B7_GW+e],b2=l2>.3?3:l2>.18?2:l2>.08?1:0;if(b2!==b)break;e++}
  if(b)out+=`<rect x="${fmt(x0+x*cs)}" y="${fmt(y0+y*cs)}" width="${fmt((e-x)*cs+.3)}" height="${fmt(cs+.3)}" fill="${B7_GCOL[b]}"/>`;x=e}}
 return out}
SCENE({id:'morphogenesis',name:'Turing patterns',tag:'Spots and stripes from chemistry',
 definition:'A reaction–diffusion system is a pair of chemicals that react with each other and spread at different speeds. Turing showed in 1952 that such a system can turn a nearly uniform start into a stable pattern of spots or stripes, with a spacing set by the chemistry, not by a blueprint.',
 example:'Start with a few random specks of one chemical in a sea of the other. Run the reaction: the specks grow, split and settle into evenly spaced spots. Change two rate constants and the same equations draw stripes and mazes.',
 desc:'A grid of 60 × 36 cells running the Gray–Scott reaction–diffusion model. The colour shows the concentration of the second chemical. Choose spots or stripes, grow the pattern step by step, and reseed to see that the spacing, not the exact layout, is fixed.',
 research:'Turing, A. M. (1952). The chemical basis of morphogenesis. Philosophical Transactions of the Royal Society B 237, 37–72. Pearson, J. E. (1993). Complex patterns in a simple system. Science 261, 189–192 (the Gray–Scott model used here). Kondo & Asai (1995) saw Turing-like stripes rearrange on angelfish.',
 dur:12,hint:'Choose spots or stripes, move the steps slider to grow the pattern, and press New seed to start from different specks.',
 init:()=>({pre:'spots',seed:4,steps:B7_GMAX}),
 watch(p){return {pre:p<.6?'spots':'stripes',seed:4,steps:Math.round(Math.min(1,(p<.6?p/.5:(p-.6)/.35))*B7_GMAX)}},
 ui:[{choose:Object.keys(B7_GPRE).map(k=>[k,B7_GPRE[k].n]),label:'Pattern',get:s=>s.pre,act:'pre'},{range:'steps',label:'Steps grown',min:0,max:B7_GMAX,step:B7_GSTEP,get:s=>s.steps,act:'steps'},{b:'New seed',act:'seed'}],
 on:{pre(s,v){s.pre=v},steps(s,v){s.steps=Number(v)},seed(s){s.seed=nextSeed()%1000+1}},
 draw(s){
  const snaps=B7_grayScott(s.pre,s.seed),k=clamp(Math.floor(s.steps/B7_GSTEP),0,snaps.length-1),v=snaps[k],pre=B7_GPRE[s.pre];
  let out=heading(`${pre.n}: reaction–diffusion after ${k*B7_GSTEP} steps`,26);
  out+=B7_gField(v,90,48,7);
  out+=TF(90,322,`feed F = ${pre.F}, kill k = ${pre.k}`,13,C.muted,'start')+TF(510,322,`seed ${s.seed}`,13,C.muted,'end');
  out+=T(300,350,'Darker: more of the second chemical. The rules are the same everywhere on the grid.',14,C.ink);
  out+=TF(300,372,'Gray–Scott model, periodic edges; a stand-in for the real molecules in skin and limbs.',13,C.muted);
  return {svg:out,phase:k===0?'The start: a few random specks. Nothing in the rules says where spots should go.':'Two chemicals that react and diffuse at different rates amplify small differences up to a preferred spacing and then hold it. Reseed and the spots move, but their size and spacing stay the same. Turing proposed this in 1952; strong biological evidence came only from the 1990s onwards.'};
 },
 three(s,f,X,project){
  const snaps=B7_grayScott(s.pre,s.seed),k=clamp(Math.floor(s.steps/B7_GSTEP),0,snaps.length-1),v=snaps[k],sx=2,P=project([0,B7_GW/10,0,B7_GH/10,0,1.2]);let out='';
  const z=(x,y)=>Math.min(.5,v[y*B7_GW+x])*2.2;
  for(let y=0;y<B7_GH;y+=sx)out+=B7_poly(range(B7_GW/sx).map(i=>P([i*sx/10,y/10,z(i*sx,y)])),C.coral,1.3);
  for(let x=0;x<B7_GW;x+=sx*2)out+=B7_poly(range(B7_GH/sx).map(j=>P([x/10,j*sx/10,z(x,j*sx)])),C.line,1);
  return {svg:out,title:'The pattern as a landscape',caption:'Height is the concentration of the second chemical. Peaks are spots (or ridges are stripes), all about the same height and spacing.'};
 }});

SCENE({id:'morphogenesis-flag',name:'The French flag',tag:'Positional information',
 definition:'In Wolpert’s French flag model, a chemical (a morphogen) spreads from one end of a tissue and fades with distance. Cells read the local level against thresholds: high means one fate, medium another, low a third, so each cell knows roughly where it is.',
 example:'In the fruit fly egg, the protein Bicoid is highest at the head end. Doubling the mother’s bicoid genes shifts the head–thorax boundary towards the tail, as the model predicts.',
 desc:'A row of 30 cells with a morphogen made at the left end and decaying exponentially. Two thresholds divide the row into blue, white and red regions. Change how much is made and how far it spreads, and watch the boundaries move.',
 research:'Wolpert, L. (1969). Positional information and the spatial pattern of cellular differentiation. Journal of Theoretical Biology 25, 1–47. Driever, W. & Nüsslein-Volhard, C. (1988). The bicoid protein determines position in the Drosophila embryo in a concentration-dependent manner. Cell 54, 95–104.',
 dur:10,hint:'Double the source and see how far each boundary shifts. A simple gradient does not rescale when the tissue grows: real embryos need extra mechanisms for that.',
 init:()=>({src:1,lam:25}),
 watch(p){return {src:p<.5?1:lerp(1,2,smooth((p-.5)/.3)),lam:25}},
 ui:[{range:'src',label:'Amount made at the source',min:.5,max:2.5,step:.1,get:s=>s.src,act:'src',show:v=>Number(v).toFixed(1)+'×'},{range:'lam',label:'Decay length',min:10,max:50,step:1,get:s=>s.lam,act:'lam',show:v=>v+'% of the tissue'}],
 on:{src(s,v){s.src=Number(v)},lam(s,v){s.lam=Number(v)}},
 draw(s){
  const T1=.5,T2=.15,lam=s.lam/100,c=x=>s.src*Math.exp(-x/lam);let out=heading('Wolpert’s French flag',26);
  const x0=70,W=460,xp=u=>x0+u*W,y0=60,H=170,lo=Math.log10(.03),hi=Math.log10(3),yp=v=>y0+H-(Math.log10(clamp(v,.03,3))-lo)/(hi-lo)*H;
  out+=R(x0,y0,W,H,'#fff',C.grid,4);
  [[T1,'blue threshold'],[T2,'red threshold']].forEach(([t,l])=>out+=L(x0,yp(t),x0+W,yp(t),C.muted,1.5,'stroke-dasharray="6 4"')+TF(x0+W-4,yp(t)-5,l,13,C.muted,'end'));
  out+=B7_poly(range(101).map(i=>[xp(i/100),yp(c(i/100))]),C.purple,3);
  out+=TF(x0,y0-8,'morphogen level (log scale)',13,C.muted,'start');[[.03,'0.03'],[.1,'0.1'],[.3,'0.3'],[1,'1'],[3,'3']].forEach(([v,l])=>out+=TF(x0-6,yp(v)+4,l,13,C.muted,'end'));
  out+=R(x0-6,y0+H+26,6,40,C.purple,'none',2)+TF(x0-10,y0+H+50,'source',13,C.purple,'end');
  range(30).forEach(i=>{const u=(i+.5)/30,l=c(u),col=l>=T1?C.blue:l>=T2?'#ffffff':C.coral;out+=R(x0+i*W/30+1,256,W/30-2,40,col,C.line,3)});
  const b1=lam*Math.log(s.src/T1),b2=lam*Math.log(s.src/T2);
  [b1,b2].forEach(b=>{if(b>0&&b<1)out+=L(xp(b),y0,xp(b),300,C.ink,1.5,'stroke-dasharray="3 3"')});
  out+=TF(x0,316,'cells: blue, white or red by the level they read',13,C.muted,'start');
  const f=v=>v<=0?'none':v>=1?'off the end':B7_pct(v);
  out+=T(300,342,`Blue–white boundary at ${f(b1)} of the tissue; white–red at ${f(b2)}.`,15,C.ink);
  out+=TF(300,366,`Doubling the source moves both boundaries by the same distance, ${B7_pct(lam*Math.log(2))} here.`,13,C.muted);
  return {svg:out,phase:'Each boundary sits where the gradient crosses a threshold: x = λ ln(source/threshold). More morphogen pushes every boundary away from the source by the same distance, λ ln 2 for a doubling, just as extra Bicoid shifts the fly’s head boundary.'};
 }});

// Digit number as stripes of a Turing-like pattern across the limb bud (after Sheth et al. 2012).
const B7_HOX=[[1,'All Hox copies'],[.75,'Three quarters'],[.5,'Half'],[.25,'A quarter']];
SCENE({id:'morphogenesis-digits',name:'Counting fingers',tag:'A Turing pattern in the hand',
 definition:'Digits form as evenly spaced stripes of cartilage across the growing limb bud. Experiments suggest these stripes come from a Turing-type network of signals, whose wavelength is tuned by Hox genes.',
 example:'Mice with progressively fewer distal Hox gene copies grow more, thinner digits: the stripes come closer together, while the limb stays about the same width.',
 desc:'A limb bud with a stripe pattern across it. The number of digits is the bud width divided by the stripe wavelength. Change the bud width and the Hox dose, which shortens the wavelength, and count the digits.',
 research:'Sheth, R. et al. (2012). Hox genes regulate digit patterning by controlling the wavelength of a Turing-type mechanism. Science 338, 1476–1480. Raspopovic, J. et al. (2014). Digit patterning is controlled by a Bmp–Sox9–Wnt Turing network modulated by morphogen gradients. Science 345, 566–570. Model simplified.',
 dur:10,hint:'Lower the Hox dose and the stripes squeeze together; widen the bud and more fit in.',
 init:()=>({hox:1,w:100}),
 watch(p){const i=Math.min(3,Math.floor(p*4.5));return {hox:B7_HOX[i][0],w:100}},
 ui:[{choose:B7_HOX.map(h=>[h[0],h[1]]),label:'Hox dose',get:s=>s.hox,act:'hox'},{range:'w',label:'Bud width',min:60,max:140,step:5,get:s=>s.w,act:'w',show:v=>v+'%'}],
 on:{hox(s,v){s.hox=Number(v)},w(s,v){s.w=Number(v)}},
 draw(s){
  const lamb=1*(.55+.45*s.hox),Wd=5*s.w/100,n=Math.max(1,Math.round(Wd/lamb));let out=heading('Digits as Turing stripes',26);
  const cx=230,cy=270,R0=56,R1=60+120*Math.min(1.2,s.w/100),span=Math.PI*(.25+.2*s.w/140);
  out+=P(`M${fmt(cx+R1*Math.cos(-Math.PI/2-span))} ${fmt(cy+R1*Math.sin(-Math.PI/2-span))} A${fmt(R1)} ${fmt(R1)} 0 0 1 ${fmt(cx+R1*Math.cos(-Math.PI/2+span))} ${fmt(cy+R1*Math.sin(-Math.PI/2+span))} L${cx+40} ${cy+40} L${cx-40} ${cy+40} Z`,C.line,2,'#fdf3ea');
  range(n).forEach(i=>{const a=-Math.PI/2-span+(i+.5)/n*2*span,w=Math.min(18,.6*R1*2*span/n);
   out+=L(cx+R0*Math.cos(a),cy+R0*Math.sin(a),cx+(R1-14)*Math.cos(a),cy+(R1-14)*Math.sin(a),C.coral,w);});
  out+=L(cx-40,cy+40,cx+40,cy+40,C.line,2);
  out+=counter(462,60,'digits',String(n),C.coral,118)+counter(462,114,'stripe spacing',`${(lamb*20).toFixed(0)} units`,C.purple,118)+counter(462,168,'bud width',`${(Wd*20).toFixed(0)} units`,C.ink,118);
  out+=T(300,366,'digits ≈ bud width ÷ stripe spacing (simplified; real limbs also prune and fuse digits)',14,C.muted);
  return {svg:out,phase:`With ${({1:'the full Hox dose',.75:'three quarters of the Hox dose',.5:'half the Hox dose',.25:'a quarter of the Hox dose'})[s.hox]} the stripe spacing is ${(lamb*20).toFixed(0)} units, so about ${n} digits fit across this bud. Sheth and colleagues saw this kind of polydactyly in mice lacking Hox genes; Raspopovic and colleagues identified the signals that make the stripes.`};
 }});

/* ================================================================ circulation-heart */
SCENE({id:'circulation-heart',name:'Harvey’s calculation',tag:'Blood must go round',
 definition:'Harvey’s argument for circulation was a calculation: the heart pumps out far more blood in an hour than the body contains or could make from food, so the same blood must return to the heart again and again.',
 example:'Harvey supposed half an ounce (about 14 g) per beat and 1,000 beats in half an hour: about 14 kg of blood, several times what the body holds. Even his smallest guess, 1 drachm (about 4 g), gives about 8 kg in an hour. A modern resting heart pumps about 70 mL a beat at 70 beats a minute: about 5 litres every minute.',
 desc:'Sliders for blood per beat and heart rate, with bars comparing the blood pumped in half an hour against the blood in the body (about 5 litres) and a day’s food and drink (about 3 kg). Presets give Harvey’s cautious figures and a modern resting heart.',
 research:'Harvey, W. (1628). Exercitatio Anatomica de Motu Cordis et Sanguinis in Animalibus, chapter 9. Modern resting values (stroke volume about 70 mL, cardiac output about 5 L/min) from standard physiology texts.',
 dur:10,hint:'Start from Harvey’s figures, then try the modern ones. Even his smallest guess outruns the body’s whole blood supply within an hour.',
 init:()=>({sv:14,bpm:33}),
 watch(p){return p<.5?{sv:14,bpm:33,grow:Math.min(1,p/.35)}:{sv:70,bpm:70,grow:Math.min(1,(p-.5)/.3)}},
 ui:[{range:'sv',label:'Blood per beat',min:1,max:100,step:.1,get:s=>s.sv,act:'sv',show:v=>Number(v).toFixed(1)+' mL'},{range:'bpm',label:'Heart rate',min:20,max:180,step:1,get:s=>s.bpm,act:'bpm',show:v=>v+' per minute'},{b:'Harvey: half an ounce',act:'harvey'},{b:'Harvey: 1 drachm',act:'smallest'},{b:'Modern resting heart',act:'modern'}],
 on:{sv(s,v){s.sv=Number(v)},bpm(s,v){s.bpm=Number(v)},harvey(s){s.sv=14;s.bpm=33},smallest(s){s.sv=3.9;s.bpm=33},modern(s){s.sv=70;s.bpm=70}},
 draw(s){
  const g=s.grow===undefined?1:s.grow,half=s.sv*s.bpm*30/1000,shown=half*g;let out=heading('Harvey’s calculation (1628)',26);
  const mx=Math.max(10,half),lx=v=>200+Math.log10(1+v)/Math.log10(1+Math.max(200,mx))*340;
  const rows=[['pumped in half an hour',shown,C.coral],['blood in the whole body',5,C.blue],['a day’s food and drink',3,C.green]];
  rows.forEach(([l,v,c],i)=>{const y=70+i*58;out+=TF(30,y+22,l,14,C.ink,'start')+R(200,y,lx(v)-200,32,c,'none',5)+TF(lx(v)+8,y+22,`${v<10?v.toFixed(1):Math.round(v)} ${i===2?'kg':'L'}`,14,C.ink,'start')});
  out+=TF(200,262,'bar length on a logarithmic scale',13,C.muted,'start');
  out+=counter(30,282,'beats in half an hour',String(s.bpm*30),C.blue,160)+counter(210,282,'per beat',`${s.sv.toFixed(1)} mL`,C.blue,120)+counter(350,282,'in a day',`${Math.round(half*48).toLocaleString('en-GB')} L`,C.coral,190);
  out+=T(300,360,half>=5?`In half an hour the heart moves ${(half/5).toFixed(half/5<10?1:0)} times the blood in the body: it must circulate.`:`About ${(half/5*2).toFixed(1)} times the body’s blood in an hour: still more than it holds.`,14,C.ink);
  return {svg:out,phase:'Harvey deliberately chose numbers too small to be disputed and still found the heart pumping more blood than the body holds. The liver could not make so much from food, and the limbs could not absorb it: the same blood must go round. Half an ounce is about 14 g and 1 drachm about 3.9 g.'};
 }});

const B7_MODELS={galen:{n:'Galen (2nd century)',t:'Blood is made from food in the liver and consumed by the body. Some seeps through invisible pores in the septum to the left side.'},nafis:{n:'Ibn al-Nafis (c. 1242)',t:'The septum has no pores: blood from the right ventricle must pass through the lungs to reach the left. The pulmonary circuit, unknown in Europe for three centuries.'},harvey:{n:'Harvey (1628)',t:'One closed loop: heart, arteries, body, veins, heart, and a second loop through the lungs. Valves in the veins allow flow only towards the heart.'},malpighi:{n:'Malpighi (1661)',t:'Under the microscope, a frog’s lung shows capillaries joining the smallest arteries to the smallest veins: the missing link in Harvey’s loop.'}};
SCENE({id:'circulation-heart-pulmonary',name:'Two circuits',tag:'Galen, Ibn al-Nafis, Harvey, Malpighi',
 definition:'Blood flows in two circuits. The pulmonary circuit carries blood from the right side of the heart through the lungs and back to the left; the systemic circuit carries it from the left side round the body and back to the right.',
 example:'Galen thought blood crossed the heart through pores in the septum. Ibn al-Nafis, in 13th-century Damascus and Cairo, argued that the septum is solid and blood must go through the lungs instead.',
 desc:'A heart with four chambers, the lungs above and the body below. Choose a model to see the paths of blood as each thinker described them, with a note on what each saw or argued.',
 research:'Ibn al-Nafis (c. 1242). Commentary on Anatomy in Avicenna’s Canon. Harvey (1628). De Motu Cordis. Malpighi, M. (1661). De pulmonibus. West, J. B. (2008). Ibn al-Nafis, the pulmonary circulation, and the Islamic Golden Age. Journal of Applied Physiology 105, 1877–1880.',
 dur:12,hint:'Step through the four models in order. Look at the septum, the lungs, and whether the paths close into loops.',
 init:()=>({m:'nafis'}),
 watch(p){return {m:['galen','nafis','harvey','malpighi'][Math.min(3,Math.floor(p*4.4))]}},
 ui:[{choose:Object.keys(B7_MODELS).map(k=>[k,B7_MODELS[k].n]),label:'Model',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v}},
 draw(s,f,X){
  const m=s.m,M=B7_MODELS[m];let out=heading(M.n,26);
  out+=`<ellipse cx="300" cy="78" rx="120" ry="30" fill="${C.pale}" stroke="${C.line}" stroke-width="2"/>`+TF(300,83,'lungs',14,C.blue);
  out+=`<ellipse cx="300" cy="303" rx="190" ry="22" fill="${C.coralp}" stroke="${C.line}" stroke-width="2"/>`+TF(300,308,'body',14,C.coral);
  out+=R(230,140,70,50,'#e6eef8',C.line,8)+R(300,140,70,50,'#fbe9e3',C.line,8)+R(230,190,70,64,'#e6eef8',C.line,8)+R(300,190,70,64,'#fbe9e3',C.line,8);
  out+=TF(265,170,'RA',13,C.blue)+TF(335,170,'LA',13,C.coral)+TF(265,227,'RV',13,C.blue)+TF(335,227,'LV',13,C.coral);
  out+=L(300,190,300,254,m==='galen'?C.amber:C.ink,m==='galen'?3:4,m==='galen'?'stroke-dasharray="3 4"':'');
  if(m==='galen'){out+=arrow(278,224,322,224,C.amber,2.2,7)+TF(300,272,'pores?',13,C.amber);
   out+=R(450,170,80,40,C.amberp,'none',8)+TF(490,195,'liver',14,C.amber)+curveArrow(450,190,370,215,-20,C.amber,2.2)+curveArrow(470,210,420,288,20,C.amber,2.2);
   out+=curveArrow(335,140,335,108,0,C.muted,2)+TF(360,124,'air?',13,C.muted,'start')}
  else{out+=curveArrow(232,224,206,100,-30,C.blue,2.6)+curveArrow(350,104,340,140,-30,C.coral,2.6);
   if(m!=='nafis'){out+=curveArrow(350,254,420,290,-25,C.coral,2.6)+curveArrow(170,292,228,166,-30,C.blue,2.6)}
   else{out+=curveArrow(350,254,420,290,-25,C.coral,2.2)+TF(470,262,'to the body',13,C.muted,'start')}
   if(m==='malpighi'){range(5).forEach(i=>out+=P(`M${410-i*6} ${288+i} q-30 ${-8+i*4} -60 0`,C.purple,1.4));out+=TF(470,340,'capillaries',13,C.purple,'start')}
   }
  out+=R(30,332,540,44,C.pale,'none',8)+B7_lines(42,350,B7_wrap(M.t,84),13,C.ink,'start',17);
  return {svg:out,phase:'Ibn al-Nafis reasoned from anatomy that the septum is solid; his work was largely unknown in Europe, where Servetus (1553) and Colombo (1559) described the lung circuit again. Harvey closed both loops in 1628, and Malpighi found the capillaries that join them.'};
 }});

// A synthetic ECG: P, QRS and T waves as sums of Gaussians, repeated at the heart rate.
const B7_ecgT=rr=>{const cp=.08+.08*rr,cq=cp+.14+.04*rr;return {cp,cq,ct:cq+.06+.2*Math.sqrt(rr)}};
function B7_beat(u,rr){const {cp,cq,ct}=B7_ecgT(rr),g=(c,w,a)=>a*Math.exp(-((u-c)**2)/(2*w*w));return g(cp,.025,.15)+g(cq-.03,.008,-.12)+g(cq,.012,1.1)+g(cq+.03,.009,-.25)+g(ct,.045,.3)}
function B7_ecg(t,rr){const k=Math.floor(t/rr);let v=0;for(let j=k-2;j<=k+1;j++)v+=B7_beat(t-j*rr,rr);return v}
SCENE({id:'circulation-heart-ecg',name:'The heart’s electricity',tag:'Reading an ECG',
 definition:'An electrocardiogram (ECG) records the tiny voltages on the skin made by the heart’s electrical activity. The P wave marks the atria contracting, the QRS complex the ventricles contracting, and the T wave the ventricles recovering.',
 example:'At 60 beats a minute, the peaks of the QRS complexes are 1 second apart: five large squares on standard ECG paper running at 25 mm per second.',
 desc:'A four-second strip of a synthetic ECG on standard paper (large squares are 0.2 s). Move the heart rate and the cursor; the heart cartoon lights the chambers that are active at the cursor. Press Hear eight beats for a soft lub-dub at the chosen rate.',
 research:'Waller, A. D. (1887). A demonstration on man of electromotive changes accompanying the heart’s beat. Journal of Physiology 8, 229–234. Einthoven, W. (1903) string galvanometer; Nobel Prize 1924. Waveform here is synthetic.',
 dur:10,hint:'Change the heart rate and move the cursor across one beat. Press Hear eight beats to listen at that rate.',
 init:()=>({bpm:72,cur:.34}),
 watch(p){return {bpm:72,cur:(p*8)%1*60/72}},
 ui:[{range:'bpm',label:'Heart rate',min:40,max:160,step:1,get:s=>s.bpm,act:'bpm',show:v=>v+' per minute'},{range:'cur',label:'Cursor',min:0,max:1.5,step:.01,get:s=>s.cur,act:'cur',show:v=>Number(v).toFixed(2)+' s'},{b:'Hear eight beats',act:'hear'}],
 on:{bpm(s,v){s.bpm=Number(v);return 'keep'},cur(s,v){s.cur=Number(v);return 'keep'},
  hear(s){const rr=60/s.bpm;AUDIO.seq(range(8).flatMap(i=>[{hz:72,at:i*rr,dur:.12},{hz:96,at:i*rr+.28*Math.sqrt(rr),dur:.1}]),{type:'triangle',gain:.3,attack:.005,release:.06});return 'keep'}},
 draw(s){
  const rr=60/s.bpm,x0=40,y0=60,W=520,H=170,xp=t=>x0+t/4*W,yp=v=>y0+H*.65-v*H*.5;let out=heading(`ECG at ${s.bpm} beats per minute`,26);
  out+=R(x0,y0,W,H,'#fff6f4',C.coralp,2);
  for(let t=0;t<=4.001;t+=.04)out+=L(xp(t),y0,xp(t),y0+H,Math.round(t/.04)%5===0?'#efb7a6':'#f8ded5',Math.round(t/.04)%5===0?1.1:.6);
  for(let v=0;v<=H;v+=H/20)out+=L(x0,y0+v,x0+W,y0+v,Math.round(v/(H/20))%5===0?'#efb7a6':'#f8ded5',Math.round(v/(H/20))%5===0?1.1:.6);
  out+=B7_poly(range(801).map(i=>{const t=i*.005;return [xp(t),yp(B7_ecg(t,rr))]}),C.ink,1.8);
  const cur=clamp(s.cur,0,4),u=((cur%rr)+rr)%rr;out+=L(xp(cur),y0,xp(cur),y0+H,C.blue,2);
  const {cp,cq,ct}=B7_ecgT(rr),phase=u<cp-.06?'rest':u<cp+.07?'atria':u<cq+.1?'ventricles':u<ct+.1?'recover':'rest';
  out+=TF(xp(cp),y0+H-8,'P',13,C.muted)+TF(xp(cq)+8,y0+14,'QRS',13,C.muted,'start')+TF(xp(ct),y0+H-8,'T',13,C.muted);
  out+=TF(x0,y0+H+18,'0 s',13,C.muted,'start')+TF(x0+W,y0+H+18,'4 s',13,C.muted,'end');
  const hx=120,hy=270,on=k=>phase===k;
  out+=R(hx-50,hy,48,34,on('atria')?C.coral:C.pale,C.line,8)+R(hx+2,hy,48,34,on('atria')?C.coral:C.pale,C.line,8)+R(hx-50,hy+38,48,50,on('ventricles')?C.coral:on('recover')?C.amberp:C.pale,C.line,8)+R(hx+2,hy+38,48,50,on('ventricles')?C.coral:on('recover')?C.amberp:C.pale,C.line,8);
  out+=TF(hx+72,hy+18,'atria',13,C.muted,'start')+TF(hx+72,hy+68,'ventricles',13,C.muted,'start');
  const say={atria:'P wave: the atria contract and top up the ventricles.',ventricles:'QRS: the ventricles contract and pump blood out.',recover:'T wave: the ventricles recover, ready for the next beat.',rest:'Rest: the heart fills before the next P wave.'}[phase];
  out+=B7_lines(280,290,B7_wrap(say,36),15,C.ink,'start',21);
  out+=TF(280,354,`beat-to-beat interval ${rr.toFixed(2)} s`,13,C.muted,'start');
  return {svg:out,phase:'The ECG is a record of electricity, not of pumping, but each wave lines up with a mechanical event. Faster rates squeeze the gap between T and the next P most: the resting phase shortens before contraction does.'};
 }});

/* ================================================================ microbiome */
const B7_COUNTS={luckey:{n:'1972 estimate',b:100,h:10,rbc:0,src:'Luckey (1972): about 10¹⁴ bacteria and 10¹³ human cells, a ratio of 10 : 1. It was a rough, back-of-envelope figure that spread through textbooks.'},sender:{n:'2016 recount',b:38,h:30,rbc:25,src:'Sender, Fuchs & Milo (2016): about 3.8 × 10¹³ bacteria and 3.0 × 10¹³ human cells, a ratio near 1.3 : 1. Most human cells by number are red blood cells.'}};
SCENE({id:'microbiome',name:'How many microbes?',tag:'The 10-to-1 myth',
 definition:'The microbiome is the community of microbes living in and on the body, most of them bacteria in the large intestine. A careful recount in 2016 found roughly as many bacterial cells as human cells, not ten times as many.',
 example:'A reference man of 70 kg carries about 38 trillion bacteria (around 0.2 kg) and about 30 trillion human cells. A single bowel movement can tip the balance towards human cells.',
 desc:'Each dot is one trillion (10¹²) cells: bacteria in green, human cells in blue, with red blood cells marked in coral in the 2016 view. Switch between the 1972 estimate and the 2016 recount.',
 research:'Luckey, T. D. (1972). Introduction to intestinal microecology. American Journal of Clinical Nutrition 25, 1292–1294. Sender, R., Fuchs, S. & Milo, R. (2016). Revised estimates for the number of human and bacteria cells in the body. PLoS Biology 14(8): e1002533.',
 dur:10,hint:'Switch between the two estimates and compare the green and blue dots.',
 init:()=>({c:'sender'}),
 watch(p){return {c:p<.5?'luckey':'sender'}},
 ui:[{choose:[['luckey','1972 estimate'],['sender','2016 recount']],label:'Estimate',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v}},
 draw(s){
  const e=B7_COUNTS[s.c];let out=heading(`${e.n}: bacteria against human cells`,26);
  const dot=(i,x0,y0,col)=>Ci(x0+(i%10)*13+6,y0+Math.floor(i/10)*13+6,5,col);
  out+=TB(150,60,`bacteria: ${e.b} trillion`,15,C.green);range(e.b).forEach(i=>out+=dot(i,85,72,C.green));
  out+=TB(450,60,`human cells: ${e.h} trillion`,15,C.blue);range(e.h).forEach(i=>out+=dot(i,385,72,i<e.rbc?C.coral:C.blue));
  if(e.rbc)out+=TF(450,140,'coral: red blood cells (about 84%)',13,C.coral);
  out+=TB(300,226,`ratio about ${(e.b/e.h).toFixed(e.b/e.h>5?0:1)} : 1`,20,C.ink);
  out+=R(30,250,540,92,C.pale,'none',10)+B7_lines(46,276,B7_wrap(e.src,76),14,C.ink,'start',20);
  out+=TF(300,366,'Each dot = 10¹² cells. Most bacteria live in the colon.',13,C.muted);
  return {svg:out,phase:'The 10 : 1 figure began as a rough estimate in 1972 and was repeated for decades. Counting more carefully, using the volume of the colon and the number of bacteria per gram of its contents, brought it down to about 1 : 1. The microbes still matter: they are just not most of us.'};
 }});

// van Nood et al. 2013 NEJM: cured without relapse after first treatment.
const B7_ARMS=[{n:'Donor faeces',k:13,N:16,c:C.green},{n:'Vancomycin',k:4,N:13,c:C.blue},{n:'Vancomycin + bowel lavage',k:3,N:13,c:C.purple}];
const B7_ARMORD=(()=>{const all=[];B7_ARMS.forEach((a,ai)=>range(a.N).forEach(i=>all.push({a:ai,ok:i<a.k})));const sh=shuffled(range(all.length),2013).map(i=>all[i]);return sh})();
SCENE({id:'microbiome-cdiff',name:'A transplant that works',tag:'Faecal microbiota for C. difficile',
 definition:'Faecal microbiota transplantation (FMT) puts gut microbes from a healthy donor into a patient’s intestine. For recurrent Clostridioides difficile infection, which antibiotics often fail to clear, it is the best-supported microbiome treatment.',
 example:'In a 2013 trial, 13 of 16 patients (81%) given donor faeces were cured after one infusion, against 4 of 13 (31%) given vancomycin and 3 of 13 (23%) given vancomycin with bowel lavage. The trial was stopped early because the difference was so large.',
 desc:'The 42 patients of van Nood and colleagues’ trial, revealed one at a time in a seeded order. Bars show the share cured in each arm after one treatment, beside the published results.',
 research:'van Nood, E. et al. (2013). Duodenal infusion of donor feces for recurrent Clostridium difficile. New England Journal of Medicine 368, 407–415. Small trial, stopped early; later trials and meta-analyses support FMT for recurrent C. difficile.',
 dur:10,hint:'Press Treat next patient, or Treat everyone, and watch the three arms separate.',
 init:()=>({k:0}),
 watch(p){return {k:Math.round(Math.min(1,p/.85)*42)}},
 ui:[{b:'Treat next patient',act:'next'},{b:'Treat everyone',act:'all'}],
 on:{next(s){s.k=Math.min(42,s.k+1);return 'keep'},all(s){s.k=42;return 'keep'}},
 draw(s){
  let out=heading('Recurrent C. difficile: three treatments (2013 trial)',26);const seen=B7_ARMORD.slice(0,s.k);
  B7_ARMS.forEach((a,ai)=>{const y=62+ai*84,pts=seen.filter(q=>q.a===ai),ok=pts.filter(q=>q.ok).length;
   out+=TF(30,y+14,a.n,14,C.ink,'start');
   range(a.N).forEach(i=>{const q=pts[i],x=30+i*20;out+=Ci(x+8,y+36,8,q?(q.ok?a.c:C.coral):'#fff',q?'none':C.line)});
   const share=pts.length?ok/pts.length:0;out+=R(380,y+24,170*share,22,a.c,'none',4)+R(380,y+24,170,22,'none',C.line,4);
   out+=TF(380+170*a.k/a.N,y+20,'▼',13,C.ink)+TF(560,y+40,pts.length?`${ok}/${pts.length}`:'',13,C.ink,'end');
   out+=TF(380,y+64,`published: ${a.k}/${a.N} (${B7_pct(a.k/a.N)})`,13,C.muted,'start')});
  out+=TF(30,322,'filled: cured after one treatment · coral: infection came back',13,C.muted,'start');
  out+=T(300,354,s.k<42?`${s.k} of 42 patients treated so far.`:'All 42 treated: donor microbes cured most patients after one infusion.',15,C.ink);
  return {svg:out,phase:'Antibiotics kill C. difficile but also the competing microbes, so the infection returns. Donor microbes restore the competition. This is the clearest case where changing the microbiome treats a disease; most other claims are much less certain.'};
 }});

const B7_CLAIMS=[
 {t:'Donor faeces cure most cases of recurrent C. difficile infection.',a:'strong',w:'Randomised trials (van Nood et al. 2013 and later) and now clinical guidelines.'},
 {t:'Diet and antibiotics change which microbes live in the gut, within days.',a:'strong',w:'Repeated human studies, for example David et al. (2014, Nature) on diet and Dethlefsen & Relman (2011) on antibiotics.'},
 {t:'Microbes from obese donors make germ-free mice gain fat.',a:'mixed',w:'Shown in mice (Turnbaugh et al. 2006; Ridaura et al. 2013). Whether the same happens in people is unclear.'},
 {t:'Shop-bought probiotics improve health in healthy adults.',a:'weak',w:'A systematic review found no convincing effect on the gut microbiota of healthy adults (Kristensen et al. 2016).'},
 {t:'Gut microbes cause autism.',a:'weak',w:'Mostly correlations and mouse experiments; causation in people is not established.'},
 {t:'Your body is 90% bacteria.',a:'wrong',w:'Based on a rough 1972 estimate; the 2016 recount gives about 1.3 bacteria per human cell (Sender et al. 2016).'}];
const B7_EV={strong:['Strong evidence',C.green,C.greenp],mixed:['Promising, mostly in mice',C.amber,C.amberp],weak:['Weak or unproven',C.coral,C.coralp],wrong:['Wrong',C.purple,C.purplep]};
SCENE({id:'microbiome-hype',name:'Microbiome claims',tag:'Strong, promising or hype?',
 definition:'Microbiome science moves fast and attracts hype. Associations between microbes and disease are easy to find; showing that the microbes cause the disease, in people, is much harder.',
 example:'Germ-free mice given microbes from obese donors gain fat, a striking result. But mice are not people, and most human studies show correlations, not causes.',
 desc:'Six popular claims, one at a time. Judge each as strong, promising, weak or wrong, then see the evidence and your running score.',
 research:'Hanage, W. P. (2014). Microbiology: microbiome science needs a healthy dose of scepticism. Nature 512, 247–248. van Nood et al. (2013); Turnbaugh et al. (2006) Nature 444; Kristensen et al. (2016) Genome Medicine 8; Sender, Fuchs & Milo (2016).',
 dur:12,hint:'Pick a verdict for each claim. Hanage’s five questions help: can we detect real differences, do they show causation, what mechanism, how much is in mice, and could it be otherwise?',
 init:()=>({i:0,ans:[]}),
 watch(p){const n=Math.min(6,Math.floor(p*7));return {i:Math.min(5,n),ans:B7_CLAIMS.slice(0,n).map(c=>c.a),sim:true}},
 ui:[{b:'Strong',act:'ans',arg:'strong'},{b:'Promising',act:'ans',arg:'mixed'},{b:'Weak',act:'ans',arg:'weak'},{b:'Wrong',act:'ans',arg:'wrong'}],
 on:{ans(s,v){if(s.ans.length>=6)return 'keep';s.ans.push(v);s.i=Math.min(5,s.ans.length);return 'keep'}},
 draw(s){
  let out=heading('Microbiome claims: how strong is the evidence?',26);
  const done=s.ans.length;
  B7_CLAIMS.forEach((c,i)=>{const y=42+i*44,ev=B7_EV[c.a],a=s.ans[i],cur=i===done;
   out+=R(20,y,560,40,i<done?ev[2]:cur?'#fff':C.pale,cur?C.blue:'none',8,cur?'stroke-width="2"':'');
   out+=TF(32,y+17,c.t,13.5,C.ink,'start');
   if(i<done){out+=TF(32,y+33,`${ev[0]}${a===c.a?' ✓':` (you said ${B7_EV[a][0].toLowerCase()})`}`,13,ev[1],'start')}
   else if(cur)out+=TF(32,y+33,'Your verdict?',13,C.blue,'start')});
  const right=s.ans.filter((a,i)=>a===B7_CLAIMS[i].a).length;
  const last=done?B7_CLAIMS[done-1]:null;
  out+=B7_lines(300,322,B7_wrap(last?last.w:'Choose Strong, Promising, Weak or Wrong for the first claim.',84),13.5,C.ink,'middle',17);
  out+=T(300,374,`${s.sim?'Simulated reader':'You'}: ${right} of ${done} matched the evidence.`,14,C.muted);
  return {svg:out,phase:'The microbiome matters, and one treatment works well. Many headline claims rest on mice or correlations. Hanage’s advice: ask whether the differences are real, whether they show cause, what the mechanism is, and how much depends on mice.'};
 }});
