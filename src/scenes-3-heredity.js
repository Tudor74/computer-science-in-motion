/* ===================== Biology era 3 · Heredity (1866–1950) ===================== */
// Mendel's ratios, Punnett squares, chromosomes and linkage, genes in populations, drift and many-gene traits.
// Every random process is seeded (B3_rng), so Watch, rewind and Try it agree; pictures are pure functions of state.
const B3_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const B3_rng=n=>rng(B3_mix(n));
function B3_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const B3_n=v=>String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const B3_pct=(v,d=1)=>(Math.round(v*100*10**d)/10**d).toFixed(d).replace(/\.0+$/,'')+'%';
const B3_YEL='#e2b623',B3_GRN='#6f9d3b',B3_PUR='#8a5bb8',B3_WHT='#f6f3fb',B3_RED='#c8364a',B3_PINK='#e58fb0';
const B3_LINES=['#1772b7','#c45238','#2c776c','#7156a6','#9a6200','#b0337a','#3d8fb0','#546873'];
// Pressable box (a button in Try it, plain in Watch).
function B3_btn(X,act,arg,label,x,y,w,h,inner){return hit(X,act,arg,label,inner)}
// A plot frame mapping data to drawing units.
function B3_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(o.ylX===undefined?x0:o.ylX,y0-8,o.yl,13,C.muted,o.ylA||'start');
 return {svg,X,Y};
}
const B3_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function B3_wrap(s,n){const out=[];let line='';String(s).split(' ').forEach(w=>{if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w});if(line)out.push(line);return out}
const B3_lines=(x,y,lines,size=13,col=C.ink,anchor='start',gap=18)=>lines.map((l,i)=>TF(x,y+i*gap,l,size,col,anchor)).join('');
// A tile with a small label and a value.
function B3_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,48,'#fff',C.grid,8)+TF(x+w/2,y+18,label,13,C.muted)+TBF(x+w/2,y+39,value,17,col)}
// A pea seed: a smooth circle (round) or a crinkled outline (wrinkled).
function B3_pea(x,y,r,round,col){
 if(round)return P(`M${fmt(x-r)} ${fmt(y)}a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(2*r)} 0a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(-2*r)} 0Z`,'#5a4a1c',1.2,col);
 const pts=range(14).map(i=>{const a=i/14*2*Math.PI,rr=r*(i%2?.78:1);return [x+Math.cos(a)*rr,y+Math.sin(a)*rr]});
 return P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L')+'Z','#5a4a1c',1.2,col);
}
// A five-petal flower.
function B3_flower(x,y,r,col){let out='';for(let i=0;i<5;i++){const a=-Math.PI/2+i*2*Math.PI/5;out+=P(`M${fmt(x+Math.cos(a)*r*.55-r*.42)} ${fmt(y+Math.sin(a)*r*.55)}a${fmt(r*.42)} ${fmt(r*.42)} 0 1 0 ${fmt(r*.84)} 0a${fmt(r*.42)} ${fmt(r*.42)} 0 1 0 ${fmt(-r*.84)} 0Z`,'#7a6a8a',1,col)}return out+Ci(x,y,r*.22,B3_YEL,'none')}
// Chi-square tail probabilities (1 and 3 degrees of freedom).
function B3_erfc(x){const t=1/(1+.3275911*x);return t*(.254829592+t*(-.284496736+t*(1.421413741+t*(-1.453152027+t*1.061405429))))*Math.exp(-x*x)}
function B3_chiP(x,df){if(x<=0)return 1;const a=B3_erfc(Math.sqrt(x/2));return df===1?a:a+Math.sqrt(2*x/Math.PI)*Math.exp(-x/2)}
function B3_chi(obs,exp){let s=0;obs.forEach((o,i)=>{if(exp[i]>0)s+=(o-exp[i])**2/exp[i]});return s}
// Binomial draw (exact for small n, normal approximation for large n).
function B3_binom(r,n,p){if(p<=0)return 0;if(p>=1)return n;if(n<=240){let k=0;for(let i=0;i<n;i++)if(r()<p)k++;return k}return clamp(Math.round(n*p+Math.sqrt(n*p*(1-p))*B3_gauss(r)),0,n)}

/* ================================================================ mendel-crosses */
// F2 seeds from Rr × Rr: the number of R alleles in each seed (0, 1 or 2), from a seeded generator.
function B3_f2(seed,n){const r=B3_rng(seed),g=[];for(let i=0;i<n;i++)g.push((r()<.5?1:0)+(r()<.5?1:0));return g}
SCENE({id:'mendel-crosses',name:'Mendel’s pea crosses',tag:'Round × wrinkled, then the F2',
 definition:'Mendel crossed true-breeding pea plants that differed in one trait. The first generation all looked like one parent; when those plants self-pollinated, the hidden form came back in about a quarter of the next generation.',
 example:'Round × wrinkled gave only round seeds. Those plants then gave 5,474 round and 1,850 wrinkled seeds: 2.96 to 1.',
 desc:'Parents, first generation and a grid of second-generation pea seeds that you grow in batches, with counts and the ratio of round to wrinkled beside Mendel’s own result and the expected 3 : 1.',
 research:'Mendel, G. (1866). Versuche über Pflanzen-Hybriden. Verhandlungen des naturforschenden Vereines in Brünn 4, 3–47 (seed shape: 5,474 round, 1,850 wrinkled). Rediscovered in 1900 by de Vries, Correns and Tschermak.',
 dur:12,hint:'Grow F2 seeds in batches of 10 or 100 and watch the ratio settle. New seeds starts a fresh set.',
 init:()=>({seed:3,n:0}),
 watch(p){return {seed:3,n:Math.round(420*smooth(p))}},
 ui:[{b:'Grow 10 seeds',act:'grow',arg:10},{b:'Grow 100 seeds',act:'grow',arg:100},{b:'New seeds',act:'again'}],
 on:{grow(s,v){s.n=Math.min(2000,s.n+Number(v));return 'keep'},again(s){s.seed=nextSeed();s.n=0;return 'keep'}},
 draw(s){
  const g=B3_f2(s.seed,s.n),round=g.filter(v=>v>0).length,wr=s.n-round;
  let out=heading('Mendel’s cross: round × wrinkled peas',26);
  out+=TBF(115,56,'Parents',14,C.ink)+B3_pea(68,82,12,true,B3_YEL)+TF(115,88,'×',18,C.muted)+B3_pea(162,82,12,false,B3_YEL);
  out+=TF(68,114,'RR round',13,C.muted)+TF(162,114,'rr wrinkled',13,C.muted);
  out+=arrow(115,124,115,146,C.line,2);
  out+=TBF(115,166,'First generation',14,C.ink)+B3_pea(115,190,12,true,B3_YEL)+TF(115,222,'Rr: all round',13,C.muted);
  out+=arrow(115,232,115,256,C.line,2)+TF(124,249,'self-pollinate',13,C.muted,'start');
  out+=TBF(115,278,'Second generation',14,C.ink);
  // F2 grid: the last 100 seeds grown.
  const st=Math.max(0,s.n-100);
  out+=R(232,42,226,226,'#fff',C.grid,8);
  if(!s.n)out+=TF(345,150,'Press Grow to plant',14,C.muted)+TF(345,170,'second-generation seeds',14,C.muted);
  for(let i=st;i<s.n;i++){const k=i-st,x=244+(k%10)*22,y=54+Math.floor(k/10)*22;out+=B3_pea(x,y,8,g[i]>0,B3_YEL)}
  out+=TF(345,286,s.n?`showing the last ${Math.min(100,s.n)} of ${B3_n(s.n)} seeds`:'',13,C.muted);
  out+=B3_tile(472,42,108,'round',B3_n(round),C.blue)+B3_tile(472,98,108,'wrinkled',B3_n(wr),C.coral)+B3_tile(472,154,108,'ratio',wr?(round/wr).toFixed(2)+' : 1':'–',C.ink);
  out+=TF(526,224,'Mendel: 2.96 : 1',13,C.green)+TF(526,242,'expected: 3 : 1',13,C.coral);
  // Share bars.
  const rows=[['You',s.n?round/s.n:0,C.blue,!!s.n],['Mendel 1866',5474/7324,C.green,true],['Expected 3 : 1',.75,C.coral,true]];
  rows.forEach(([lab,f,col,show],i)=>{const y=292+i*24;out+=TF(140,y+14,lab,13,C.ink,'end')+R(150,y,380,18,C.coralp,'none',4);
   if(show)out+=R(150,y,380*f,18,col,'none',4)+TF(538,y+14,B3_pct(f),13,C.ink,'start')});
  out+=TF(340,376,'dark part = round seeds, pale = wrinkled',13,C.muted);
  return {svg:out,phase:s.n<20?'Every first-generation plant looked round, yet the wrinkled form had not gone: grow the next generation and see.':`About a quarter of the second generation is wrinkled again: the factor was hidden, not lost. Mendel counted 5,474 round and 1,850 wrinkled (2.96 : 1). Small batches wander around 3 : 1; large ones settle near it.`};
 }});

const B3_MEN7=[
 {t:'Seed shape',d:'round',r:'wrinkled',a:5474,b:1850},
 {t:'Seed colour',d:'yellow',r:'green',a:6022,b:2001},
 {t:'Seed-coat colour',d:'grey',r:'white',a:705,b:224},
 {t:'Pod shape',d:'inflated',r:'constricted',a:882,b:299},
 {t:'Pod colour',d:'green',r:'yellow',a:428,b:152},
 {t:'Flower position',d:'axial',r:'terminal',a:651,b:207},
 {t:'Stem length',d:'long',r:'short',a:787,b:277}];
SCENE({id:'mendel-crosses-seven',name:'Seven traits, one ratio',tag:'Mendel’s counts, and Fisher’s doubt',
 definition:'Mendel repeated the cross for seven pea traits. Each time one form was dominant and the second generation came out close to 3 dominant to 1 recessive.',
 example:'Across all seven traits he counted 14,949 dominant and 5,010 recessive: 2.98 to 1.',
 desc:'Mendel’s seven traits with his second-generation counts, each ratio drawn as a dot against 3 : 1; pressing a trait shows its counts and a chi-square test of fit.',
 research:'Mendel (1866), table of F2 results. Fisher, R. A. (1936). Has Mendel’s work been rediscovered? Annals of Science 1, 115–137 (the fit is closer than chance would usually give). Franklin, Edwards, Fairbanks, Hartl & Seidenfeld (2008). Ending the Mendel–Fisher Controversy.',
 dur:12,hint:'Press a trait to see its counts and how well they fit 3 : 1.',
 init:()=>({sel:0}),
 watch(p){return {sel:Math.min(6,Math.floor(p*7))}},
 on:{sel(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Mendel’s seven traits: second-generation counts',26);
  const ax=v=>360+(v-2.6)/.8*200;
  out+=TF(460,46,'ratio, dominant : recessive',13,C.muted);
  B3_MEN7.forEach((m,i)=>{const y=54+i*31,on=i===s.sel,rat=m.a/m.b;
   const inner=R(20,y,322,27,on?C.pale:'#fff',on?C.blue:C.grid,6,on?'stroke-width="2.5"':'')+TBF(30,y+18,m.t,13,C.ink,'start')+TF(334,y+18,`${m.d} ${B3_n(m.a)} · ${m.r} ${B3_n(m.b)}`,13,C.muted,'end');
   out+=hit(X,'sel',i,`${m.t}: ${m.d} ${m.a}, ${m.r} ${m.b}`,inner);
   out+=L(ax(2.6),y+13,ax(3.4),y+13,C.grid,1)+Ci(ax(rat),y+13,on?7:5,on?C.blue:C.muted,'none')});
  out+=L(ax(3),50,ax(3),272,C.coral,2,'stroke-dasharray="5 4"');
  [2.6,2.8,3,3.2,3.4].forEach(v=>out+=TF(ax(v),290,v.toFixed(1),13,v===3?C.coral:C.muted));
  const m=B3_MEN7[s.sel],n=m.a+m.b,ea=n*.75,eb=n*.25,chi=B3_chi([m.a,m.b],[ea,eb]),p=B3_chiP(chi,1);
  out+=R(20,300,560,74,C.pale,'none',10);
  out+=TBF(34,322,`${m.t}: ${B3_n(m.a)} ${m.d} to ${B3_n(m.b)} ${m.r} = ${(m.a/m.b).toFixed(2)} : 1`,14,C.ink,'start');
  out+=TF(34,343,`Expected for 3 : 1 with ${B3_n(n)} plants: ${B3_n(ea)} and ${B3_n(eb)}.`,13,C.ink,'start');
  out+=TF(34,363,`Chi-square ${chi.toFixed(2)} (1 degree of freedom), p = ${p.toFixed(2)}: ${p>.05?'a good fit to 3 : 1':'a poor fit'}.`,13,C.ink,'start');
  return {svg:out,phase:'All seven ratios sit close to 3 : 1. In 1936 Fisher calculated that, over all Mendel’s experiments, results this close to expectation would arise by chance only rarely, and suspected they had been tidied. Historians still debate why: unconscious bias, an assistant, or selective reporting. Nobody doubts the ratios themselves, which have been reproduced countless times.'};
 }});

// Dihybrid F2: R (round) and Y (yellow) assort independently.
function B3_dih(seed,n){const r=B3_rng(seed),c=[0,0,0,0];for(let i=0;i<n;i++){const R2=(r()<.5)+(r()<.5),Y2=(r()<.5)+(r()<.5);c[(R2>0?0:2)+(Y2>0?0:1)]++}return c}
const B3_DIH=[['round yellow',true,B3_YEL,9,315],['round green',true,B3_GRN,3,108],['wrinkled yellow',false,B3_YEL,3,101],['wrinkled green',false,B3_GRN,1,32]];
SCENE({id:'mendel-crosses-dihybrid',name:'Two traits at once',tag:'9 : 3 : 3 : 1',
 definition:'When Mendel followed two traits together, each was inherited independently of the other. The second generation then shows every combination in the proportions 9 : 3 : 3 : 1.',
 example:'Round yellow × wrinkled green gave 315 round yellow, 108 round green, 101 wrinkled yellow and 32 wrinkled green seeds.',
 desc:'A four-by-four grid of the sixteen equally likely combinations of pollen and egg, beside bars for the four seed types you grow, with the expected 9 : 3 : 3 : 1 and Mendel’s counts.',
 research:'Mendel (1866): 315, 108, 101 and 32 seeds from the round-yellow × wrinkled-green cross. Independent assortment holds for genes on different chromosomes; linked genes break it (see chromosomes and linkage).',
 dur:12,hint:'Grow second-generation seeds in batches of 16 or 160. The chi-square value compares your counts with 9 : 3 : 3 : 1.',
 init:()=>({seed:5,n:0}),
 watch(p){return {seed:5,n:Math.round(560*smooth(p))}},
 ui:[{b:'Grow 16 seeds',act:'grow',arg:16},{b:'Grow 160 seeds',act:'grow',arg:160},{b:'New seeds',act:'again'}],
 on:{grow(s,v){s.n=Math.min(3200,s.n+Number(v));return 'keep'},again(s){s.seed=nextSeed();s.n=0;return 'keep'}},
 draw(s){
  let out=heading('Two traits: round/wrinkled and yellow/green',26);
  const gam=['RY','Ry','rY','ry'],x0=74,y0=76,cs=38;
  out+=TF(x0+76,58,'pollen',13,C.muted)+TF(30,y0+80,'egg',13,C.muted,'middle');
  gam.forEach((g,i)=>{out+=TMF(x0+cs*i+cs/2,y0-4,g,13,C.ink)+TMF(x0-14,y0+cs*i+cs/2+5,g,13,C.ink)});
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){const a=gam[i],b=gam[j],rnd=a[0]==='R'||b[0]==='R',yel=a[1]==='Y'||b[1]==='Y';
   out+=R(x0+cs*j,y0+cs*i,cs-2,cs-2,'#fff',C.grid,4)+B3_pea(x0+cs*j+cs/2-1,y0+cs*i+cs/2-1,10,rnd,yel?B3_YEL:B3_GRN)}
  out+=TF(150,250,'16 equally likely pairings',13,C.muted);
  const c=B3_dih(s.seed,s.n),bx=430,bw=150,sc=bw/.6;
  B3_DIH.forEach(([lab,rnd,col,e,m],i)=>{const y=62+i*48;
   out+=B3_pea(268,y+14,11,rnd,col)+TBF(286,y+10,lab,13,C.ink,'start')+TF(286,y+28,`you ${B3_n(c[i])} · Mendel ${m}`,13,C.muted,'start');
   out+=R(bx,y,bw,22,C.pale,'none',4);if(s.n)out+=R(bx,y,c[i]/s.n*sc,22,C.blue,'none',4);
   out+=L(bx+e/16*sc,y-4,bx+e/16*sc,y+26,C.coral,2.5,'stroke-dasharray="4 3"');
   out+=P(`M${fmt(bx+m/556*sc)} ${y+27}l-5 9h10z`,C.green,1.2,C.green)});
  out+=TF(bx+bw/2,52,'share of seeds (0 to 60%)',13,C.muted);
  out+=TF(268,258,'blue bar = you · dashed line = 9 : 3 : 3 : 1',13,C.muted,'start')+TF(268,276,'green triangle = Mendel’s counts',13,C.muted,'start');
  if(s.n>=16){const chi=B3_chi(c,[9,3,3,1].map(v=>v/16*s.n)),p=B3_chiP(chi,3);
   out+=R(20,290,560,82,C.pale,'none',10)+TBF(36,314,`${B3_n(s.n)} seeds: ${c.map(B3_n).join(' : ')}`,14,C.ink,'start');
   out+=TF(36,336,`Expected 9 : 3 : 3 : 1 gives ${[9,3,3,1].map(v=>B3_n(v/16*s.n)).join(' : ')}.`,13,C.ink,'start');
   out+=TF(36,357,`Chi-square ${chi.toFixed(2)} on 3 degrees of freedom, p = ${p.toFixed(2)}${p>.05?': consistent with independent traits.':': an unusual sample.'}`,13,C.ink,'start')}
  else out+=R(20,290,560,82,C.pale,'none',10)+TF(300,336,'Grow at least 16 seeds to test the 9 : 3 : 3 : 1 prediction.',14,C.muted);
  return {svg:out,phase:'Shape and colour sort into the pollen and eggs independently, so the four seed types appear as 9 : 3 : 3 : 1, the product of two 3 : 1 ratios. Mendel’s 556 seeds came out 315 : 108 : 101 : 32, very close.'};
 }});

/* ================================================================ punnett-squares */
const B3_GT=['AA','Aa','aa'];
const B3_gam=g=>[g[0],g[1]];
const B3_sortG=(a,b)=>a===a.toUpperCase()?a+b:b===b.toUpperCase()?b+a:a+b;
SCENE({id:'punnett-squares',name:'Punnett squares',tag:'Every pairing of egg and pollen',
 definition:'A Punnett square lists the kinds of egg down one side and the kinds of pollen or sperm across the top. Each cell is one equally likely offspring, so counting cells gives the expected ratios.',
 example:'Aa × Aa gives AA, Aa, Aa and aa: genotypes 1 : 2 : 1, and with A dominant, appearances 3 : 1.',
 desc:'A two-by-two Punnett square for flower colour, with purple dominant over white. Choose each parent’s genotype and read the offspring genotypes and colours.',
 research:'Punnett, R. C. (1905). Mendelism. Cambridge: Macmillan and Bowes. Bateson, W. (1909). Mendel’s Principles of Heredity. Mendel’s own flower-colour trait: violet over white.',
 dur:12,hint:'Choose each parent’s genotype. A is purple and dominant; aa is white.',
 init:()=>({a:'Aa',b:'Aa'}),
 watch(p){const L=[['Aa','Aa'],['AA','aa'],['Aa','aa'],['AA','Aa'],['aa','aa']];const [a,b]=L[Math.min(4,Math.floor(p*5))];return {a,b}},
 ui:[{choose:B3_GT.map(g=>[g,'Parent 1: '+g]),label:'Parent 1 genotype',get:s=>s.a,act:'a'},{choose:B3_GT.map(g=>[g,'Parent 2: '+g]),label:'Parent 2 genotype',get:s=>s.b,act:'b'}],
 on:{a(s,v){s.a=v;return 'keep'},b(s,v){s.b=v;return 'keep'}},
 draw(s){
  let out=heading('A Punnett square for flower colour',26);
  const ga=B3_gam(s.a),gb=B3_gam(s.b),x0=170,y0=90,cs=84,kids=[];
  out+=TBF(x0+cs,58,`Parent 2: ${s.b}`,15,C.ink)+TBF(80,y0+cs-8,'Parent 1',15,C.ink)+TBF(80,y0+cs+14,s.a,15,C.ink);
  gb.forEach((g,j)=>out+=R(x0+cs*j+22,y0-22,40,20,C.pale,'none',6)+TMF(x0+cs*j+cs/2,y0-7,g,14,C.ink));
  ga.forEach((g,i)=>out+=R(x0-34,y0+cs*i+30,28,24,C.pale,'none',6)+TMF(x0-20,y0+cs*i+47,g,14,C.ink));
  for(let i=0;i<2;i++)for(let j=0;j<2;j++){const k=B3_sortG(ga[i],gb[j]),pur=k.includes('A');kids.push(k);
   out+=R(x0+cs*j,y0+cs*i,cs-4,cs-4,'#fff',C.grid,8)+B3_flower(x0+cs*j+cs/2-2,y0+cs*i+30,20,pur?B3_PUR:B3_WHT)+TMF(x0+cs*j+cs/2-2,y0+cs*i+70,k,14,C.ink)}
  const cnt=g=>kids.filter(k=>k===g).length,np=kids.filter(k=>k.includes('A')).length;
  out+=R(372,70,208,190,C.pale,'none',10)+TBF(386,94,'Genotypes',14,C.ink,'start');
  B3_GT.forEach((g,i)=>out+=TMF(386,118+i*22,g,14,C.ink,'start')+TF(430,118+i*22,`${cnt(g)} in 4`,14,C.ink,'start')+R(490,106+i*22,cnt(g)*20,14,C.purple,'none',3));
  out+=TBF(386,196,'Colours',14,C.ink,'start')+TF(386,220,`purple ${np} in 4`,14,B3_PUR,'start')+TF(386,242,`white ${4-np} in 4`,14,C.muted,'start');
  out+=R(490,208,80,14,'#e8e3ef','none',3)+R(490,208,np*20,14,B3_PUR,'none',3);
  const rat=np===4?'all purple':np===0?'all white':np===3?'3 purple : 1 white':'1 purple : 1 white';
  out+=TB(300,300,`${s.a} × ${s.b}: ${rat}`,17,C.ink);
  out+=T(300,328,'Each cell is one equally likely egg–pollen pairing.',14,C.muted);
  out+=T(300,350,'Ratios are expectations: real families vary around them.',14,C.muted);
  return {svg:out,phase:`Each parent passes on one of its two copies at random, so each cell of the square has a 1 in 4 chance. ${s.a} × ${s.b} gives ${rat}.`};
 }});

// Test-cross: an unknown purple plant (from an Aa × Aa cross) crossed with a white aa plant.
const B3_hidden=seed=>B3_rng(seed*13+1)()<1/3?'AA':'Aa';
const B3_kid=(seed,i,h)=>h==='AA'?'A':(B3_rng(seed*97+i*7+3)()<.5?'A':'a');
const B3_post=n=>(1/3)/(1/3+(2/3)*.5**n);
const B3_TCW=(()=>{for(let s=1;s<500;s++){if(B3_hidden(s)!=='Aa')continue;const k=range(4).map(i=>B3_kid(s,i,'Aa'));if(k[0]==='A'&&k[1]==='A'&&k[2]==='A'&&k[3]==='a')return s}return 1})();
SCENE({id:'punnett-squares-testcross',name:'The test-cross',tag:'Is the purple plant AA or Aa?',
 definition:'A test-cross mates an individual showing the dominant form with one showing the recessive form. Any recessive-looking offspring proves the first parent carried the hidden allele.',
 example:'A purple plant from an Aa × Aa cross is AA with probability 1/3. After five purple offspring from a test-cross, that rises to 94%; one white offspring makes Aa certain.',
 desc:'A purple plant of unknown genotype crossed with a white plant, a row of offspring you grow one at a time, and a chart of the probability that the purple parent is AA after each all-purple offspring.',
 research:'Mendel (1866) used back-crosses to the recessive parent to confirm the 1 : 2 : 1 genotypes. The updating rule is Bayes’ theorem with prior 1/3 from the 1 : 2 : 1 ratio.',
 dur:12,hint:'Grow offspring and watch the probability change. Reveal shows the hidden genotype; New plant picks another.',
 init:()=>({seed:B3_TCW+1,k:0,rev:false}),
 watch(p){const k=Math.min(8,Math.floor(p*9));return {seed:B3_TCW,k,rev:p>.9}},
 ui:[{b:'Grow one offspring',act:'grow',arg:1},{b:'Grow five',act:'grow',arg:5},{b:'Reveal the genotype',act:'rev'},{b:'New plant',act:'again'}],
 on:{grow(s,v){s.k=Math.min(20,s.k+Number(v));return 'keep'},rev(s){s.rev=true;return 'keep'},again(s){s.seed=nextSeed();s.k=0;s.rev=false;return 'keep'}},
 draw(s){
  const h=B3_hidden(s.seed),kids=range(s.k).map(i=>B3_kid(s.seed,i,h)),white=kids.indexOf('a');
  let out=heading('Test-cross: purple (AA or Aa?) × white (aa)',26);
  out+=B3_flower(200,70,22,B3_PUR)+TBF(200,112,s.rev?h:'A?',15,s.rev?C.blue:C.ink)+TF(300,76,'×',20,C.muted)+B3_flower(400,70,22,B3_WHT)+TBF(400,112,'aa',15,C.ink);
  out+=TF(30,140,'Offspring:',13,C.muted,'start');
  if(!s.k)out+=TF(110,140,'none yet',13,C.muted,'start');
  kids.forEach((k,i)=>{const x=40+i*27,y=162;out+=B3_flower(x,y,11,k==='A'?B3_PUR:B3_WHT)});
  // Posterior chart.
  const pl=B3_plot(70,206,280,96,[0,10],[0,1],{xt:[0,2,4,6,8,10].map(v=>[v,String(v)]),yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'purple offspring so far (no white)',yl:'probability the parent is AA'});
  out+=pl.svg+B3_poly(range(11).map(n=>[pl.X(n),pl.Y(B3_post(n))]),C.blue,2.5);
  const nP=white<0?s.k:white,cur=white<0?B3_post(Math.min(10,s.k)):0;
  if(white<0)out+=Ci(pl.X(Math.min(10,s.k)),pl.Y(cur),6,C.coral,'#fff');
  out+=R(380,200,200,130,C.pale,'none',10);
  out+=B3_lines(394,224,white<0?[`${s.k} offspring, all purple.`,`P(parent is AA) = ${(cur*100).toFixed(1)}%`,`P(parent is Aa) = ${((1-cur)*100).toFixed(1)}%`,'Each purple offspring halves','the chance of Aa.']:[`A white offspring appeared`,`(number ${white+1}).`,'Only an Aa parent can give a','white plant: the parent is Aa,',`whatever came before.`],13,C.ink);
  out+=TF(300,372,s.rev?`The hidden parent was ${h}.`:'Start: 1 in 3 purple plants from Aa × Aa are AA.',14,s.rev?C.blue:C.muted);
  return {svg:out,phase:'Before any offspring the purple plant is AA one time in three. An AA parent always gives purple; an Aa parent gives purple half the time. So every purple offspring makes AA more likely, but never certain, while a single white offspring settles it.'};
 }});

const B3_ABO=['AA','AO','BB','BO','AB','OO'],B3_SNAP=['RR','RW','WW'];
const B3_aboP=g=>g.includes('A')&&g.includes('B')?'AB':g.includes('A')?'A':g.includes('B')?'B':'O';
const B3_snapP=g=>g==='RR'?'red':g==='WW'?'white':'pink';
const B3_PCOL={A:C.blue,B:C.coral,AB:C.purple,O:C.muted,red:B3_RED,pink:B3_PINK,white:'#d9d2c6'};
const B3_ord=(a,b,list)=>list.find(g=>(g[0]===a&&g[1]===b)||(g[0]===b&&g[1]===a));
SCENE({id:'punnett-squares-blood',name:'When neither form dominates',tag:'Codominance and blending colours',
 definition:'Not every pair of alleles has a dominant member. With incomplete dominance the heterozygote is in between; with codominance it shows both forms at once.',
 example:'Red × white snapdragons give pink offspring. A child of an AO parent and a BO parent can have blood group A, B, AB or O.',
 desc:'Two parent boxes you press to change genotype, a Punnett square of their children, and bars of the chances of each blood group or flower colour.',
 research:'Landsteiner, K. (1901). Über Agglutinationserscheinungen normalen menschlichen Blutes. Wiener klinische Wochenschrift 14 (the ABO groups). Bernstein, F. (1924) showed one gene with three alleles explains their inheritance.',
 dur:12,hint:'Choose blood groups or flower colour, then press a parent box to change its genotype.',
 init:()=>({mode:'abo',p1:1,p2:3}),
 watch(p){return p<.6?{mode:'abo',p1:p<.3?1:4,p2:p<.3?3:5}:{mode:'snap',p1:1,p2:1}},
 ui:[{choose:[['abo','ABO blood groups'],['snap','Snapdragon colour']],label:'Example',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){if(s.mode!==v){s.mode=v;s.p1=1;s.p2=v==='abo'?3:1}return 'keep'},
  par(s,v){const list=s.mode==='abo'?B3_ABO:B3_SNAP;if(v==='1')s.p1=(s.p1+1)%list.length;else s.p2=(s.p2+1)%list.length;return 'keep'}},
 draw(s,f,X){
  const abo=s.mode==='abo',list=abo?B3_ABO:B3_SNAP,ph=abo?B3_aboP:B3_snapP,g1=list[s.p1%list.length],g2=list[s.p2%list.length];
  let out=heading(abo?'ABO blood groups: A and B are codominant':'Snapdragons: red × white gives pink',26);
  [[g1,'1',80],[g2,'2',200]].forEach(([g,k,y])=>{const p=ph(g);
   const inner=R(24,y,170,86,'#fff',C.blue,10,'stroke-width="2"')+TF(109,y+22,`Parent ${k}`,13,C.muted)+TBF(109,y+50,abo?`group ${p}`:p,17,B3_PCOL[p]==='#d9d2c6'?C.muted:B3_PCOL[p])+TF(109,y+74,`genotype ${g}`,14,C.ink);
   out+=hit(X,'par',k,`Parent ${k}: genotype ${g}. Press to change.`,inner)});
  const x0=250,y0=88,cs=86,kids=[];
  g2.split('').forEach((a,j)=>out+=TBF(x0+cs*j+cs/2,y0-8,a,14,C.ink));
  g1.split('').forEach((a,i)=>out+=TBF(x0-14,y0+cs*i+cs/2+5,a,14,C.ink));
  for(let i=0;i<2;i++)for(let j=0;j<2;j++){const k=B3_ord(g1[i],g2[j],list)||g1[i]+g2[j],p=ph(k);kids.push(p);
   out+=R(x0+cs*j,y0+cs*i,cs-4,cs-4,abo?'#fff':B3_PCOL[p],abo?B3_PCOL[p]:'#b7aa96',8,'stroke-width="2.5"')+TBF(x0+cs*j+cs/2-2,y0+cs*i+38,abo?p:p,abo?20:15,abo?B3_PCOL[p]:C.ink)+TF(x0+cs*j+cs/2-2,y0+cs*i+62,k,14,C.ink)}
  const cats=abo?['A','B','AB','O']:['red','pink','white'];
  out+=TBF(510,74,'Chance per child',13,C.ink);
  cats.forEach((c,i)=>{const n=kids.filter(k=>k===c).length,y=90+i*44;out+=TF(452,y+16,c,14,C.ink,'start')+R(494,y+4,80,16,C.pale,'none',3)+R(494,y+4,n*20,16,B3_PCOL[c],'none',3)+TF(534,y+38,`${n} in 4`,13,C.muted)});
  out+=R(20,300,560,72,C.pale,'none',10);
  out+=B3_lines(36,324,B3_wrap(abo?'A and B both show in an AB person (codominance); O is recessive. Parents of groups A and B who each carry O can have children of all four groups, so blood groups alone cannot prove who a parent is, though they can rule some people out.':'Neither colour hides the other: RW is pink (incomplete dominance). Pink × pink gives red, pink and white in 1 : 2 : 1. This is not blending inheritance: red and white come back unchanged.',80),13,C.ink);
  return {svg:out,phase:abo?'The ABO gene has three common alleles. A and B are codominant; O is recessive to both.':'The heterozygote is in between, but the alleles themselves are not mixed: they separate again, intact, in the next generation.'};
 }});

/* ================================================================ chromosomes-linkage */
const B3_STAGES=['Before meiosis: two pairs of chromosomes','Copied and paired at the middle of the cell','First division: partners separate','Second division: the copies separate','Four gametes (eggs or sperm)'];
function B3_chrom(x,y,len,col,lab,doubled){
 const one=(cx)=>R(cx-5,y-len/2,10,len,col,'none',5);
 const body=doubled?one(x-6)+one(x+6)+Ci(x,y,4,'#fff',col):one(x);
 return body+TBF(x+(doubled?16:11),y+5,lab,13,col,'start');
}
SCENE({id:'chromosomes-linkage',name:'Genes ride on chromosomes',tag:'Meiosis, and Nettie Stevens’ X and Y',
 definition:'Sutton and Boveri saw that chromosomes behave like Mendel’s factors: they come in pairs, one from each parent, and the partners separate when eggs and sperm form. Each pair lines up independently of the others.',
 example:'A plant that is Rr Yy, with R and Y on different chromosomes, makes RY, Ry, rY and ry gametes in equal numbers. In 1905 Nettie Stevens found that sex in mealworms follows an X and a Y chromosome.',
 desc:'A cell going through the stages of meiosis with two pairs of chromosomes, one copy of each from each parent. You choose how the second pair lines up, or replace it with the X and Y sex chromosomes.',
 research:'Sutton, W. S. (1903). The chromosomes in heredity. Biological Bulletin 4, 231–251. Boveri, T. (1902–1904). Stevens, N. M. (1905). Studies in spermatogenesis with especial reference to the “accessory chromosome”. Carnegie Institution of Washington Publication 36.',
 dur:14,hint:'Step through the stages, then swap how the second pair lines up and see which gametes form. Try the X and Y pair too.',
 init:()=>({step:0,flip:false,sex:false}),
 watch(p){const q=p<.5?p/.5:(p-.5)/.5;return {step:Math.min(4,Math.floor(q*5)),flip:p>=.5,sex:false}},
 ui:[{range:'step',label:'Stage',min:0,max:4,get:s=>s.step,act:'step',show:v=>`${Number(v)+1} of 5`},{choose:[['same','Pair 2 lines up one way'],['swap','The other way']],label:'Alignment of pair 2',get:s=>s.flip?'swap':'same',act:'flip'},{choose:[['auto','Two ordinary pairs'],['xy','Pair 2 is X and Y']],label:'Chromosomes',get:s=>s.sex?'xy':'auto',act:'sex'}],
 on:{step(s,v){s.step=Number(v);return 'keep'},flip(s,v){s.flip=v==='swap';return 'keep'},sex(s,v){s.sex=v==='xy';return 'keep'}},
 draw(s){
  let out=heading('Meiosis: chromosomes behave like Mendel’s factors',26);
  out+=TBF(300,52,`${s.step+1}. ${B3_STAGES[s.step]}`,14,C.ink);
  const ch=[{p:1,m:true,len:70,g:'R'},{p:1,m:false,len:70,g:'r'},{p:2,m:true,len:s.sex?60:40,g:s.sex?'X':'Y'},{p:2,m:false,len:s.sex?30:40,g:s.sex?'Y':'y'}];
  const side=c=>c.p===1?(c.m?0:1):((c.m?0:1)^(s.flip?1:0));
  const col=c=>c.m?C.coral:C.blue;
  if(s.step===0){out+=Ci(300,205,128,'#fffaf3',C.line);const pos=[[236,170],[364,236],[262,252],[340,158]];ch.forEach((c,i)=>out+=B3_chrom(pos[i][0],pos[i][1],c.len,col(c),c.g,false))}
  else if(s.step===1){out+=Ci(300,205,128,'#fffaf3',C.line)+L(300,92,300,318,C.muted,1.5,'stroke-dasharray="5 5"');ch.forEach(c=>out+=B3_chrom(side(c)?336:252,c.p===1?165:255,c.len,col(c),c.g,true))}
  else if(s.step===2){[165,435].forEach(x=>out+=Ci(x,205,102,'#fffaf3',C.line));ch.forEach(c=>out+=B3_chrom(side(c)?425:155,c.p===1?165:255,c.len,col(c),c.g,true))}
  else{const xs=[80,226,374,520];xs.forEach(x=>out+=Ci(x,205,64,s.step===4?C.pale:'#fffaf3',C.line));
   ch.forEach(c=>{const sd=side(c);[0,1].forEach(k=>out+=B3_chrom(xs[sd*2+k]-6,c.p===1?182:240,c.len*.72,col(c),c.g,false))});
   if(s.step===4)xs.forEach((x,i)=>{const sd=i<2?0:1,g=ch.filter(c=>side(c)===sd).map(c=>c.g).join(s.sex?' + ':'');out+=TBF(x,292,g,16,C.ink)})}
  out+=TF(30,336,'coral = copy from the mother · blue = copy from the father',13,C.muted,'start');
  const gam=s.sex?['R + X','r + Y']:(s.flip?['Ry','rY']:['RY','ry']);
  out+=TF(300,360,s.sex?'Half the sperm carry X (daughters), half carry Y (sons): about 1 : 1.':`This way gives ${gam.join(' and ')}. Both ways are equally likely, so RY, Ry, rY and ry form equally often.`,13,C.ink);
  return {svg:out,phase:s.sex?'In males the X and Y pair up and separate like any other pair, so sperm carrying X and sperm carrying Y are made in equal numbers. Stevens (and, independently, Wilson) showed this in 1905.':'Each pair lines up at random relative to the others. That is why genes on different chromosomes are inherited independently, as Mendel found.'};
 }});

const B3_EYE={normal:{F1:[['red',.5,'X+Xw'],null,['red',.5,'X+Y'],null],F2:[['red',.5,'X+X+, X+Xw'],null,['red',.25,'X+Y'],['white',.25,'XwY']]},
 recip:{F1:[['red',.5,'X+Xw'],null,null,['white',.5,'XwY']],F2:[['red',.25,'X+Xw'],['white',.25,'XwXw'],['red',.25,'X+Y'],['white',.25,'XwY']]}};
const B3_MORGAN=[2459,null,1011,782];
function B3_fly(x,y,eye,big){const s=big?1.1:1;return P(`M${fmt(x-18*s)} ${fmt(y)}q${fmt(18*s)} ${fmt(-14*s)} ${fmt(36*s)} 0q${fmt(-18*s)} ${fmt(14*s)} ${fmt(-36*s)} 0z`,'#6b5a3c',1.4,'#c8a96a')+P(`M${fmt(x-4)} ${fmt(y-6)}l-10 -12M${fmt(x+4)} ${fmt(y-6)}l10 -12`,'#9db6c8',3)+Ci(x+20*s,y-1,6.5*s,eye==='red'?B3_RED:'#fff','#6b5a3c')}
SCENE({id:'chromosomes-linkage-whiteeye',name:'Morgan’s white-eyed fly',tag:'A gene on the X chromosome',
 definition:'A sex-linked gene sits on the X chromosome. Males have one X, so a single recessive allele shows in them; females need two.',
 example:'Morgan crossed a white-eyed male with a red-eyed female. The second generation had 2,459 red-eyed females, 1,011 red-eyed males and 782 white-eyed males, and no white-eyed females.',
 desc:'Parents and offspring classes of fruit flies, females and males, red-eyed and white-eyed, with their X chromosomes. You switch between Morgan’s cross and the reciprocal cross, and between the first and second generations.',
 research:'Morgan, T. H. (1910). Sex limited inheritance in Drosophila. Science 32, 120–122 (F2: 2,459 red-eyed females, 1,011 red-eyed males, 782 white-eyed males).',
 dur:12,hint:'Choose Morgan’s cross or the reciprocal, and the generation. X+ carries red; Xw carries white.',
 init:()=>({cross:'normal',gen:'F2'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {cross:k<2?'normal':'recip',gen:k%2?'F2':'F1'}},
 ui:[{choose:[['normal','Red ♀ × white ♂ (Morgan)'],['recip','White ♀ × red ♂']],label:'Cross',get:s=>s.cross,act:'cross'},{choose:[['F1','First generation'],['F2','Second generation']],label:'Generation',get:s=>s.gen,act:'gen'}],
 on:{cross(s,v){s.cross=v;return 'keep'},gen(s,v){s.gen=v;return 'keep'}},
 draw(s){
  const nm=s.cross==='normal';let out=heading(nm?'Morgan’s cross: red-eyed female × white-eyed male':'The reciprocal cross: white-eyed female × red-eyed male',26);
  const par=s.gen==='F1'?(nm?[['red','X+X+'],['white','XwY']]:[['white','XwXw'],['red','X+Y']]):(nm?[['red','X+Xw'],['red','X+Y']]:[['red','X+Xw'],['white','XwY']]);
  [[60,'female',par[0]],[330,'male',par[1]]].forEach(([x,sx,[eye,g]],i)=>{out+=R(x,44,210,62,'#fff',C.grid,10)+B3_fly(x+42,78,eye,i===0)+TBF(x+90,70,`${eye}-eyed ${sx}`,14,C.ink,'start')+TMF(x+90,92,g,14,C.ink,'start')});
  out+=TF(300,82,'×',20,C.muted);
  out+=TF(300,126,`${s.gen==='F1'?'First':'Second'} generation${s.gen==='F2'?' (from the first-generation flies above)':''}`,13,C.muted);
  const cls=B3_EYE[s.cross][s.gen],lab=[['female','red'],['female','white'],['male','red'],['male','white']];
  lab.forEach(([sx,eye],i)=>{const x=i<2?60:310,y=136+(i%2)*92,c=cls[i];
   out+=R(x,y,230,84,c?'#fff':'#f3f5f7',c?C.grid:'#e3e8ec',10);
   if(c){out+=B3_fly(x+40,y+44,eye,sx==='female')+TBF(x+80,y+26,`${eye}-eyed ${sx}s`,14,C.ink,'start')+TMF(x+80,y+48,c[2],13,C.ink,'start')+TF(x+80,y+70,`expected ${c[1]===.5?'1/2':'1/4'} of offspring`,13,C.muted,'start');
    if(nm&&s.gen==='F2'&&B3_MORGAN[i])out+=TBF(x+222,y+26,B3_n(B3_MORGAN[i]),14,C.green,'end')}
   else out+=TF(x+115,y+48,`no ${eye}-eyed ${sx}s`,14,C.muted)});
  out+=TF(300,346,nm&&s.gen==='F2'?'Green: Morgan’s 1910 counts. White-eyed males were fewer than 1/4: white eyes lower survival.':'X+ = X carrying red (dominant) · Xw = X carrying white · Y carries no eye-colour gene',13,nm&&s.gen==='F2'?C.green:C.muted);
  out+=TF(300,368,'The trait follows the X chromosome from mother to son.',13,C.ink);
  return {svg:out,phase:nm?'White eyes skipped the first generation and returned only in males. Morgan concluded the eye-colour gene sits on the X chromosome: the first firm link between a particular gene and a particular chromosome.':'In the reciprocal cross every son gets his only X from his white-eyed mother, so all first-generation sons are white-eyed and all daughters red-eyed: a criss-cross pattern only an X-linked gene gives.'};
 }});

const B3_MAPG=[{k:'y',n:'yellow body',d:0},{k:'w',n:'white eyes',d:1},{k:'v',n:'vermilion eyes',d:30.7},{k:'m',n:'miniature wings',d:33.7},{k:'r',n:'rudimentary wings',d:57.6}];
const B3_hald=d=>(1-Math.exp(-2*d/100))/2;
SCENE({id:'chromosomes-linkage-map',name:'The first genetic map',tag:'Sturtevant, 1913',
 definition:'Genes on the same chromosome tend to be inherited together. Crossing over between partner chromosomes separates them, more often the further apart they are, so recombination frequencies can be used as distances.',
 example:'White eyes and yellow body recombine about 1% of the time; white and vermilion about 30%. So yellow and white are close, and vermilion far away.',
 desc:'Five genes on the fruit-fly X chromosome at Sturtevant’s positions. Press two genes to see how far apart they are, how often they recombine, and where that point lies on the curve that flattens at 50%.',
 research:'Sturtevant, A. H. (1913). The linear arrangement of six sex-linked factors in Drosophila, as shown by their mode of association. Journal of Experimental Zoology 14, 43–59. Haldane, J. B. S. (1919), the map function linking distance and recombination.',
 dur:12,hint:'Press two genes. Close genes recombine about as often as their map distance says; far ones never exceed 50%.',
 init:()=>({a:1,b:2}),
 watch(p){const P=[[0,1],[1,2],[2,3],[0,2],[0,4]];const [a,b]=P[Math.min(4,Math.floor(p*5))];return {a,b}},
 on:{sel(s,v){v=Number(v);if(v!==s.b&&v!==s.a){s.a=s.b;s.b=v}else if(v===s.a){[s.a,s.b]=[s.b,s.a]}return 'keep'}},
 draw(s,f,X){
  let out=heading('Sturtevant’s map of the fruit-fly X chromosome',26);
  const mx=d=>60+d*8.2;out+=R(50,96,500,16,C.pale,C.line,8);
  B3_MAPG.forEach((g,i)=>{const x=mx(g.d),sel=i===s.a||i===s.b,up=i%2===0;
   out+=L(x,92,x,116,sel?C.coral:C.blue,2.5);
   const inner=Ci(x,104,9,sel?C.coral:'#fff',sel?C.coral:C.blue)+TBF(x,up?74:146,g.k,15,sel?C.coral:C.ink)+TF(x,up?58:162,`${g.d}`,13,C.muted);
   out+=hit(X,'sel',i,`${g.n} at ${g.d}`,inner)});
  const a=B3_MAPG[Math.min(s.a,s.b)],b=B3_MAPG[Math.max(s.a,s.b)],d=Math.abs(b.d-a.d),r=B3_hald(d);
  out+=P(`M${fmt(mx(a.d))} 124v8H${fmt(mx(b.d))}v-8`,C.coral,2);
  out+=TF(50,184,'map units (centimorgans) from yellow',13,C.muted,'start');
  out+=R(20,196,280,176,C.pale,'none',10);
  out+=B3_lines(34,220,[`${a.n} and`,`${b.n}`],14,C.ink);
  out+=TBF(34,272,`distance: ${d.toFixed(1)} map units`,14,C.ink,'start');
  out+=TBF(34,296,`recombination: ${B3_pct(r)}`,14,C.coral,'start');
  out+=B3_lines(34,322,[`about ${B3_n(r*1000)} in 1,000 test-cross offspring`,d>20?'double crossovers hide some swaps':'close genes: % ≈ distance'],13,C.muted);
  const pl=B3_plot(350,206,210,120,[0,60],[0,.5],{xt:[[0,'0'],[20,'20'],[40,'40'],[60,'60']],yt:[[0,'0'],[.25,'25%'],[.5,'50%']],xl:'map distance',yl:'recombination'});
  out+=pl.svg+L(pl.X(0),pl.Y(0),pl.X(50),pl.Y(.5),C.muted,1.5,'stroke-dasharray="4 4"')+B3_poly(range(61).map(x=>[pl.X(x),pl.Y(B3_hald(x))]),C.blue,2.5)+Ci(pl.X(Math.min(60,d)),pl.Y(r),6,C.coral,'#fff');
  return {svg:out,phase:'Sturtevant, an undergraduate in Morgan’s fly room, realised that recombination percentages add up along a line, and drew the first genetic map in one night. Over long distances two crossovers can cancel out, so recombination flattens at 50% and far-apart genes look closer than they are.'};
 }});

/* ================================================================ hardy-weinberg */
SCENE({id:'hardy-weinberg',name:'Hardy–Weinberg',tag:'Why dominant alleles do not take over',
 definition:'In a large population with random mating and no selection, migration or mutation, allele frequencies stay the same from generation to generation, and after one round of random mating the genotypes settle at p², 2pq and q².',
 example:'If 60% of alleles are A, then after one generation 36% of people are AA, 48% Aa and 16% aa, and they stay that way.',
 desc:'Starting genotype shares that you set, a button for one generation of random mating, bars for the start and the current generation, and the curves p², 2pq and q² against the allele frequency.',
 research:'Hardy, G. H. (1908). Mendelian proportions in a mixed population. Science 28, 49–50. Weinberg, W. (1908), independently. Hardy was answering the claim that a dominant trait should spread until three-quarters of people show it.',
 dur:12,hint:'Set the starting shares of AA and aa (Aa is the rest), then press One generation. Nothing changes after the first.',
 init:()=>({AA:60,aa:40,gen:0}),
 watch(p){return {AA:60,aa:40,gen:p<.35?0:p<.7?1:2}},
 ui:[{range:'AA',label:'Starting AA',min:0,max:100,get:s=>s.AA,act:'AA',show:v=>v+'%'},{range:'aa',label:'Starting aa',min:0,max:100,get:s=>s.aa,act:'aa',show:v=>v+'%'},{b:'One generation of random mating',act:'gen'},{b:'Back to the start',act:'back'}],
 on:{AA(s,v){s.AA=Number(v);s.aa=Math.min(s.aa,100-s.AA);s.gen=0;return 'keep'},aa(s,v){s.aa=Number(v);s.AA=Math.min(s.AA,100-s.aa);s.gen=0;return 'keep'},gen(s){s.gen=Math.min(9,s.gen+1);return 'keep'},back(s){s.gen=0;return 'keep'}},
 draw(s){
  const Aa=100-s.AA-s.aa,p=(s.AA+Aa/2)/100,q=1-p,st=[s.AA/100,Aa/100,s.aa/100],now=s.gen?[p*p,2*p*q,q*q]:st;
  let out=heading('Random mating settles the genotypes in one generation',26);
  const cols=[C.blue,C.purple,C.coral],labs=['AA','Aa','aa'],base=262,sc=170;
  [['start',st,48],[s.gen?`generation ${s.gen}`:'(no mating yet)',now,180]].forEach(([lab,v,x0])=>{
   v.forEach((f,i)=>out+=R(x0+i*36,base-f*sc,28,f*sc,cols[i],'none',3)+TF(x0+i*36+14,base-f*sc-6,Math.round(f*100)+'%',13,C.ink)+TF(x0+i*36+14,base+18,labs[i],13,C.muted));
   out+=TBF(x0+50,base+42,lab,13,C.ink)});
  out+=L(40,base,300,base,C.line,1.5);
  const pl=B3_plot(350,58,220,200,[0,1],[0,1],{xt:[[0,'0'],[.5,'0.5'],[1,'1']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'frequency of A (p)',yl:'share of people'});
  out+=pl.svg;[[x=>x*x,C.blue,'AA = p²'],[x=>2*x*(1-x),C.purple,'Aa = 2pq'],[x=>(1-x)**2,C.coral,'aa = q²']].forEach(([fn,col,lab],i)=>{out+=B3_poly(range(41).map(k=>[pl.X(k/40),pl.Y(fn(k/40))]),col,2.2);out+=TBF(40+i*92,66,lab,13,col,'start')});
  out+=L(pl.X(p),58,pl.X(p),258,C.ink,1.5,'stroke-dasharray="4 4"');now.forEach((f,i)=>out+=Ci(pl.X(p),pl.Y(f),6,cols[i],'#fff'));
  out+=R(20,318,560,54,C.pale,'none',10);
  out+=TBF(300,340,`Frequency of A: p = ${p.toFixed(2)} at the start and in every generation after.`,14,C.ink);
  out+=TF(300,361,s.gen?'The genotypes now sit on the curves and will stay there.':'The starting shares can be anything; press One generation to see where they go.',13,C.muted);
  return {svg:out,phase:'A dominant allele does not spread just because it is dominant. Without selection, allele frequencies stay put, and one round of random mating puts the genotypes at p², 2pq and q². Departures from these numbers are clues that something else, such as selection or inbreeding, is going on.'};
 }});

SCENE({id:'hardy-weinberg-carriers',name:'Hidden carriers',tag:'Rare conditions, common carriers',
 definition:'For a recessive condition, affected people are q² of the population, but carriers are 2pq. When q is small, carriers far outnumber affected people.',
 example:'Cystic fibrosis affects roughly 1 in 2,500 babies of northern European ancestry, so q ≈ 0.02 and about 1 in 25 people are carriers.',
 desc:'A slider for how often a recessive condition appears, the allele frequency and carrier frequency worked out from Hardy–Weinberg, and dots showing how many carriers there are for each affected person.',
 research:'Hardy (1908); Weinberg (1908). Farrell, P. M. (2008). The prevalence of cystic fibrosis in the European Union. Journal of Cystic Fibrosis 7, 450–453 (about 1 in 2,000–3,500 births in most countries).',
 dur:10,hint:'Move the slider from common to rare. The rarer the condition, the more carriers there are for each affected person.',
 init:()=>({lg:3.4}),
 watch(p){return {lg:2+3*smooth(p)}},
 ui:[{range:'lg',label:'Affected: 1 in',min:2,max:5,step:.05,get:s=>s.lg,act:'lg',show:v=>B3_n(10**v)},{b:'Cystic fibrosis (about 1 in 2,500)',act:'pre',arg:'3.4'},{b:'Phenylketonuria (about 1 in 10,000)',act:'pre',arg:'4'}],
 on:{lg(s,v){s.lg=Number(v);return 'keep'},pre(s,v){s.lg=Number(v);return 'keep'}},
 draw(s){
  const N=10**s.lg,q=1/Math.sqrt(N),p=1-q,car=2*p*q,ratio=car/(q*q);
  let out=heading('A rare recessive condition and its carriers',26);
  out+=R(20,46,180,250,C.pale,'none',10);
  out+=B3_lines(34,72,['Affected (q²)'],13,C.muted)+TBF(34,94,`1 in ${B3_n(N)}`,17,C.coral,'start');
  out+=B3_lines(34,126,['Allele frequency q'],13,C.muted)+TBF(34,148,q.toFixed(3),17,C.ink,'start');
  out+=B3_lines(34,180,['Carriers (2pq)'],13,C.muted)+TBF(34,202,`1 in ${B3_n(1/car)}`,17,C.purple,'start');
  out+=B3_lines(34,234,['Carriers per','affected person'],13,C.muted)+TBF(34,276,B3_n(ratio),20,C.purple,'start');
  const show=Math.min(400,Math.round(ratio));
  out+=Ci(232,62,6,C.coral,'none')+TF(244,67,'one affected person',13,C.coral,'start');
  for(let i=0;i<show;i++){const x=232+(i%25)*13.5,y=86+Math.floor(i/25)*13;out+=Ci(x,y,5,C.purple,'none')}
  out+=TF(232,302,Math.round(ratio)>400?`…and ${B3_n(Math.round(ratio)-400)} more carriers`:`${B3_n(Math.round(ratio))} carriers (purple)`,13,C.purple,'start');
  out+=R(20,310,560,64,C.pale,'none',10);
  out+=B3_lines(36,328,B3_wrap('Most copies of a rare recessive allele are hidden in healthy carriers, which is why selection against affected people removes it only very slowly. These numbers assume random mating.',82),13,C.ink);
  return {svg:out,phase:`If 1 in ${B3_n(N)} is affected, q = ${q.toFixed(3)} and about 1 in ${B3_n(1/car)} people carry one copy: ${B3_n(ratio)} carriers for every affected person.`};
 }});

SCENE({id:'hardy-weinberg-inbreeding',name:'Inbreeding',tag:'Too many homozygotes',
 definition:'When relatives have children, the two copies a child inherits are more likely to be identical copies of one ancestor’s allele. The inbreeding coefficient F is that probability; it moves people from heterozygous to homozygous.',
 example:'A child of first cousins has F = 1/16. For an allele with q = 0.01, the chance of being aa rises from 1 in 10,000 to about 1 in 1,400.',
 desc:'Genotype shares with and without inbreeding for a chosen allele frequency, and the chance of a recessive condition per 10,000 births for each kind of parental relationship.',
 research:'Wright, S. (1922). Coefficients of inbreeding and relationship. American Naturalist 56, 330–338. Genotypes: AA = p² + Fpq, Aa = 2pq(1 − F), aa = q² + Fpq.',
 dur:10,hint:'Choose how the parents are related and the frequency of the recessive allele.',
 init:()=>({F:1/16,q:.05}),
 watch(p){const L=[0,1/64,1/16,1/8];return {F:L[Math.min(3,Math.floor(p*4))],q:.05}},
 ui:[{choose:[['0','Unrelated'],[String(1/64),'Second cousins'],[String(1/16),'First cousins'],[String(1/8),'Uncle and niece']],label:'Parents’ relationship',get:s=>String(s.F),act:'F'},{range:'q',label:'Recessive allele frequency q',min:.005,max:.3,step:.005,get:s=>s.q,act:'q',show:v=>Number(v).toFixed(3)}],
 on:{F(s,v){s.F=Number(v);return 'keep'},q(s,v){s.q=Number(v);return 'keep'}},
 draw(s){
  const q=s.q,p=1-q,F=s.F,g=(f)=>[p*p+f*p*q,2*p*q*(1-f),q*q+f*p*q],a=g(0),b=g(F);
  const fl={0:'unrelated parents',[1/64]:'second cousins',[1/16]:'first cousins',[1/8]:'uncle and niece'}[F]||'';
  let out=heading('Inbreeding makes homozygotes more common',26);
  const cols=[C.blue,C.purple,C.coral],labs=['AA','Aa','aa'];
  labs.forEach((l,i)=>{const y=56+i*48;out+=TBF(40,y+22,l,15,cols[i],'start');
   out+=R(80,y,220,16,C.pale,'none',3)+R(80,y,a[i]*220,16,C.muted,'none',3)+TF(306,y+13,B3_pct(a[i]),13,C.muted,'start');
   out+=R(80,y+20,220,16,C.pale,'none',3)+R(80,y+20,b[i]*220,16,cols[i],'none',3)+TF(306,y+33,B3_pct(b[i]),13,C.ink,'start')});
  out+=TF(80,214,`grey: F = 0 · colour: ${fl}, F = ${F?('1/'+Math.round(1/F)):'0'}`,13,C.muted,'start');
  const per=v=>v*1e4,mx=Math.max(per(b[2]),1);
  out+=R(390,50,190,164,C.pale,'none',10)+TBF(485,72,'aa per 10,000 births',13,C.ink);
  [['F = 0',per(a[2]),C.muted],[fl,per(b[2]),C.coral]].forEach(([l,v,col],i)=>{const h=100*v/mx;out+=R(420+i*80,196-h,44,h,col,'none',3)+TF(442+i*80,190-h,v<10?v.toFixed(1):B3_n(v),13,C.ink)});
  out+=TF(442,208,'unrelated',13,C.muted)+TF(522,208,F?'related':'unrelated',13,C.muted);
  const mult=b[2]/a[2];
  out+=R(20,240,560,132,'#fff',C.grid,10);
  out+=TB(300,266,F?`Chance of aa: 1 in ${B3_n(1/b[2])} instead of 1 in ${B3_n(1/a[2])} (× ${mult.toFixed(1)})`:`Chance of aa: 1 in ${B3_n(1/a[2])}`,15,C.ink);
  out+=B3_lines(36,294,B3_wrap('Inbreeding does not change allele frequencies; it rearranges alleles into homozygotes. The rarer the allele, the bigger the relative rise, which is why rare recessive conditions cluster in families with related parents. Most children of cousins are healthy: the extra risk of a serious condition is a few percentage points.',82),13,C.ink);
  return {svg:out,phase:'With F = 0 the genotypes follow Hardy–Weinberg. Inbreeding moves a fraction F of the heterozygotes’ share into the two homozygote classes, so the recessive condition becomes more common.'};
 }});

/* ================================================================ genetic-drift */
const B3_driftMemo={};
function B3_drift(N,seed,lines=8,gens=100,p0=.5){const key=[N,seed,lines,gens,p0].join('|');if(B3_driftMemo[key])return B3_driftMemo[key];
 const r=B3_rng(seed*7919+N),out=[];for(let l=0;l<lines;l++){let k=Math.round(2*N*p0);const tr=[k/(2*N)];for(let g=0;g<gens;g++){k=B3_binom(r,2*N,k/(2*N));tr.push(k/(2*N))}out.push(tr)}
 return B3_driftMemo[key]=out}
SCENE({id:'genetic-drift',name:'Genetic drift',tag:'Chance changes allele frequencies',
 definition:'Genetic drift is random change in allele frequencies because each generation is a finite sample of the last. Small populations drift fast and lose or fix alleles; large ones barely move.',
 example:'In a population of 20 individuals, an allele starting at 50% is usually lost or fixed within a hundred or so generations, with no selection at all.',
 desc:'Eight populations, each starting with an allele at 50%, followed for 100 generations of random sampling. You choose the population size and run new populations.',
 research:'Wright, S. (1931). Evolution in Mendelian populations. Genetics 16, 97–159. Fisher, R. A. (1930). The Genetical Theory of Natural Selection. Kimura, M. (1968). Evolutionary rate at the molecular level. Nature 217, 624–626 (neutral drift at the molecular level).',
 dur:12,hint:'Choose a population size. Small populations scatter quickly to 0% or 100%; large ones stay near 50%.',
 init:()=>({N:20,seed:4}),
 watch(p){return {N:20,seed:4,upto:Math.max(1,Math.round(100*p))}},
 ui:[{choose:[['5','5 individuals'],['20','20'],['100','100'],['500','500']],label:'Population size',get:s=>String(s.N),act:'N'},{b:'New populations',act:'again'}],
 on:{N(s,v){s.N=Number(v);return 'keep'},again(s){s.seed=nextSeed();return 'keep'}},
 draw(s){
  const tr=B3_drift(s.N,s.seed),up=s.upto===undefined?100:s.upto;
  let out=heading(`Eight populations of ${s.N} individuals, no selection`,26);
  const pl=B3_plot(70,62,490,218,[0,100],[0,1],{xt:[0,20,40,60,80,100].map(v=>[v,String(v)]),yt:[[0,'0%'],[.5,'50%'],[1,'100%']],xl:'generation',yl:'frequency of the allele'});
  out+=pl.svg;tr.forEach((t,i)=>out+=B3_poly(t.slice(0,up+1).map((v,g)=>[pl.X(g),pl.Y(v)]),B3_LINES[i],2));
  const end=tr.map(t=>t[up]),lost=end.filter(v=>v===0).length,fixed=end.filter(v=>v===1).length;
  out+=R(20,320,560,52,C.pale,'none',10);
  out+=TB(300,342,`Generation ${up}: ${lost} lost, ${fixed} fixed at 100%, ${8-lost-fixed} still mixed`,15,C.ink);
  out+=TF(300,363,`Expected time until loss or fixation from 50%: about 2.8 N = ${B3_n(2.8*s.N)} generations.`,13,C.muted);
  return {svg:out,phase:'Each generation the alleles of the next are a random sample of this one’s. The sampling error is about √(pq/2N), so drift is strong in small populations and weak in big ones. Lost or fixed, an allele stays that way without mutation or migration.'};
 }});

function B3_buri(seed){const key='buri|'+seed;if(B3_driftMemo[key])return B3_driftMemo[key];const r=B3_rng(seed*31+16),L=[];for(let l=0;l<107;l++){let k=16;const t=[k];for(let g=0;g<19;g++){k=B3_binom(r,32,k/32);t.push(k)}L.push(t)}return B3_driftMemo[key]=L}
SCENE({id:'genetic-drift-buri',name:'Buri’s 107 fly bottles',tag:'Drift you can count',
 definition:'In 1956 Peter Buri kept 107 lines of fruit flies, each started with half its copies of one eye-colour allele and kept at 16 flies per generation. Over 19 generations the lines spread out until most had lost or fixed the allele.',
 example:'After about ten generations every frequency from 0 to 100% was about equally common; by generation 19 the distribution was U-shaped.',
 desc:'A simulated version of Buri’s design: a histogram of 107 lines by number of copies of the allele (out of 32), for a generation you choose, and the fall in heterozygosity against the theory for 16 flies and for the smaller effective size Buri estimated.',
 research:'Buri, P. (1956). Gene frequency in small populations of mutant Drosophila. Evolution 10, 367–402. Heterozygosity fell faster than expected for 16 flies, as if the effective population size were about 11 (Hartl & Clark, Principles of Population Genetics).',
 dur:12,hint:'Move through the generations. Bars at the two ends are lines that have lost or fixed the allele.',
 init:()=>({gen:10,seed:9}),
 watch(p){return {gen:Math.min(19,Math.round(19*p)),seed:9}},
 ui:[{range:'gen',label:'Generation',min:0,max:19,get:s=>s.gen,act:'gen'},{b:'Rerun with new flies',act:'again'}],
 on:{gen(s,v){s.gen=Number(v);return 'keep'},again(s){s.seed=nextSeed();return 'keep'}},
 draw(s){
  const L=B3_buri(s.seed),g=s.gen,h=new Array(33).fill(0);L.forEach(t=>h[t[g]]++);
  let out=heading(`107 lines of 16 flies, generation ${g}`,26);
  const x0=60,bw=15,base=232,cap=40,sc=150/cap;
  out+=R(x0-6,60,33*bw+12,base-56,'#fff',C.grid,4);
  h.forEach((c,i)=>{const hh=Math.min(c,cap)*sc,col=i===0||i===32?C.coral:C.blue;out+=R(x0+i*bw+1,base-hh,bw-2,hh,col,'none',2);if(c>cap)out+=TBF(x0+i*bw+bw/2,base-hh-6,String(c),13,C.ink)});
  [0,8,16,24,32].forEach(v=>out+=TF(x0+v*bw+bw/2,base+18,String(v),13,C.muted));
  out+=TF(x0+16.5*bw,base+36,'copies of the allele in a line (out of 32)',13,C.muted);
  [0,20,40].forEach(v=>out+=TF(x0-12,base-v*sc+4,String(v),13,C.muted,'end'));
  const lost=h[0],fixed=h[32];
  out+=R(20,290,250,82,C.pale,'none',10);
  out+=B3_lines(34,312,[`Lost (0 copies): ${lost} lines`,`Fixed (32 copies): ${fixed} lines`,`Still mixed: ${107-lost-fixed} lines`],14,C.ink,'start',20);
  const H=t=>L.reduce((a,l)=>a+2*(l[t]/32)*(1-l[t]/32),0)/107/.5;
  const pl=B3_plot(310,300,160,50,[0,19],[0,1],{xt:[[0,'0'],[19,'19']],yt:[[0,'0'],[1,'1']],yl:'heterozygosity (start = 1)',ylX:296});
  out+=pl.svg+B3_poly(range(20).map(t=>[pl.X(t),pl.Y((1-1/32)**t)]),C.muted,2,'stroke-dasharray="4 3"')+B3_poly(range(20).map(t=>[pl.X(t),pl.Y((1-1/23)**t)]),C.coral,2)+B3_poly(range(g+1).map(t=>[pl.X(t),pl.Y(H(t))]),C.blue,2.5);
  out+=TF(482,312,'grey: 16 flies',13,C.muted,'start')+TF(482,330,'coral: about 11',13,C.coral,'start')+TF(482,348,'blue: simulated',13,C.blue,'start');
  return {svg:out,phase:'Every line started at 16 of 32 copies. Pure chance spread them out, then piled them up at the ends, where drift stops. Buri’s real bottles lost heterozygosity faster than 16 flies predict, because not every fly bred equally: the effective population was smaller than the census.'};
 }});

function B3_bottle(n,t,seed){const r=B3_rng(seed),K=12;let f=new Array(K).fill(1/K);for(let g=0;g<t;g++){const c=new Array(K).fill(0);for(let i=0;i<2*n;i++){let u=r(),j=0;while(j<K-1&&u>f[j]){u-=f[j];j++}c[j]++}f=c.map(v=>v/(2*n))}return f}
SCENE({id:'genetic-drift-bottleneck',name:'Bottlenecks and founders',tag:'Diversity lost in a crash',
 definition:'A bottleneck is a crash to a few individuals; a founder effect is a new population started by a few. Either way, the survivors carry only a sample of the old variety, and drift during the small phase loses more.',
 example:'Northern elephant seals were hunted to perhaps a few tens of animals in the 1890s; today there are well over 100,000, but their genetic variation is very low.',
 desc:'Twelve equally common versions of a gene in a large population, the population cut to a size and for a number of generations you choose, and which versions survive, with the average over twenty repeat runs.',
 research:'Hoelzel, A. R. et al. (1993). Elephant seal genetic variation and the use of simulation models to investigate historical population bottlenecks. Journal of Heredity 84, 443–449. Mayr, E. (1942) on founder effects. McKusick et al. (1964), Ellis–van Creveld syndrome among the Old Order Amish.',
 dur:12,hint:'Set how small the population becomes and for how long. Fewer survivors and longer bottlenecks lose more variety.',
 init:()=>({n:10,t:5,seed:3}),
 watch(p){return {n:Math.round(40-36*smooth(p)),t:5,seed:3}},
 ui:[{range:'n',label:'Survivors',min:2,max:100,get:s=>s.n,act:'n'},{range:'t',label:'Generations that small',min:1,max:20,get:s=>s.t,act:'t'},{b:'New run',act:'again'}],
 on:{n(s,v){s.n=Number(v);return 'keep'},t(s,v){s.t=Number(v);return 'keep'},again(s){s.seed=nextSeed();return 'keep'}},
 draw(s){
  const f=B3_bottle(s.n,s.t,s.seed),left=f.filter(v=>v>0).length,H=1-f.reduce((a,v)=>a+v*v,0);
  const reps=range(20).map(i=>B3_bottle(s.n,s.t,s.seed*101+i+1)),avgLeft=reps.reduce((a,r)=>a+r.filter(v=>v>0).length,0)/20,avgH=reps.reduce((a,r)=>a+1-r.reduce((b,v)=>b+v*v,0),0)/20;
  let out=heading(`Cut to ${s.n} individuals for ${s.t} generation${s.t>1?'s':''}`,26);
  const seg=(y,fr,lab)=>{let x=60,o=TF(50,y+20,lab,13,C.ink,'end');fr.forEach((v,i)=>{if(v>0){o+=R(x,y,480*v,28,B3_LINES[i%8],'#fff',2,i>=8?'opacity=".6"':'');x+=480*v}});return o};
  out+=seg(56,new Array(12).fill(1/12),'before')+seg(126,f,'after');
  out+=TF(300,106,'12 versions of a gene, equally common in a large population',13,C.muted)+TF(300,176,`after the bottleneck: ${left} of 12 versions remain`,13,C.ink);
  out+=B3_tile(60,196,150,'versions left',`${left} of 12`,C.blue)+B3_tile(225,196,150,'heterozygosity',`${(H/(11/12)*100).toFixed(0)}% of before`,C.purple)+B3_tile(390,196,150,'average of 20 runs',`${avgLeft.toFixed(1)} versions`,C.ink);
  out+=TF(300,268,`Average heterozygosity across 20 runs: ${(avgH/(11/12)*100).toFixed(0)}% of the starting level.`,13,C.muted);
  out+=R(20,286,560,86,C.pale,'none',10);
  out+=B3_lines(36,308,B3_wrap('Rare versions vanish first, and recovery in numbers does not bring them back: only new mutations can. Founder effects explain why some conditions are far more common in populations that grew from a few founders, such as Ellis–van Creveld syndrome among the Old Order Amish.',82),13,C.ink);
  return {svg:out,phase:'A short, sharp crash loses rare alleles; a long one loses common ones too, through drift. Heterozygosity falls by a factor of about (1 − 1/2N) each generation the population stays small.'};
 }});

/* ================================================================ quantitative-traits */
function B3_comb(n,k){let c=1;for(let i=1;i<=k;i++)c=c*(n-k+i)/i;return c}
SCENE({id:'quantitative-traits',name:'Many genes, one bell curve',tag:'Fisher reconciles Mendel and Galton',
 definition:'Traits like height are affected by many genes, each adding a little, plus the environment. Many small Mendelian effects add up to a smooth bell-shaped distribution.',
 example:'Nilsson-Ehle found wheat kernel colour controlled by three genes: the second generation fell into seven shades in the ratio 1 : 6 : 15 : 20 : 15 : 6 : 1.',
 desc:'The distribution of a trait controlled by a number of equal, additive genes that you choose, as bars for each class, with a slider that adds environmental variation and smooths the classes into a curve.',
 research:'Nilsson-Ehle, H. (1909). Kreuzungsuntersuchungen an Hafer und Weizen. Lunds Universitets Årsskrift. Fisher, R. A. (1918). The correlation between relatives on the supposition of Mendelian inheritance. Transactions of the Royal Society of Edinburgh 52, 399–433.',
 dur:12,hint:'Add genes and the classes multiply into a bell. Add environmental variation and the steps blur away.',
 init:()=>({k:3,env:0}),
 watch(p){return {k:1+Math.min(7,Math.floor(p*8)),env:p>.8?50:0}},
 ui:[{range:'k',label:'Number of genes',min:1,max:12,get:s=>s.k,act:'k'},{range:'env',label:'Environmental variation',min:0,max:100,step:5,get:s=>s.env,act:'env',show:v=>v+'%'}],
 on:{k(s,v){s.k=Number(v);return 'keep'},env(s,v){s.env=Number(v);return 'keep'}},
 draw(s){
  const n=2*s.k,probs=range(n+1).map(i=>B3_comb(n,i)/2**n),mx=Math.max(...probs);
  let out=heading(`${s.k} gene${s.k>1?'s':''}, two alleles each, all adding equally`,26);
  const x0=60,w=480,base=270,h=190,bw=w/(n+1);
  out+=R(x0-6,60,w+12,base-56,'#fff',C.grid,4);
  if(s.env<100)probs.forEach((p,i)=>{const hh=p/mx*h*(1-s.env/100*.85);out+=R(x0+i*bw+bw*.12,base-hh,bw*.76,hh,C.blue,'none',2)});
  if(s.env>0){const sd=Math.sqrt(n*.25),se=sd*s.env/100,dens=x=>probs.reduce((a,p,i)=>a+p*Math.exp(-((x-i)**2)/(2*se*se))/(se*Math.sqrt(2*Math.PI)),0),pk=Math.max(...range(81).map(j=>dens(j/80*n)));
   out+=B3_poly(range(121).map(j=>{const x=-.5+j/120*(n+1);return [x0+(x+.5)*bw,base-dens(x)/pk*h]}),C.coral,2.5)}
  out+=TF(x0,base+18,'shortest',13,C.muted,'start')+TF(x0+w,base+18,'tallest',13,C.muted,'end')+TF(300,base+18,'number of “taller” alleles carried',13,C.muted);
  out+=R(20,298,560,74,C.pale,'none',10);
  const rat=n<=8?probs.map(p=>Math.round(p*2**n)).join(' : '):null;
  out+=TB(300,320,`${n+1} classes${rat?': '+rat:''}`,15,C.ink);
  out+=B3_lines(36,344,B3_wrap('One gene gives three clear classes. A handful already looks like a bell, and environmental variation blurs the steps, so the Mendelian genes underneath can no longer be seen.',82),13,C.ink);
  return {svg:out,phase:'Around 1900, Mendelians and biometricians argued over whether continuous traits could be Mendelian at all. Fisher showed in 1918 that many small Mendelian effects plus environment give exactly the smooth variation and family correlations the biometricians measured.'};
 }});

function B3_fam(h2,seed,n=150){const r=B3_rng(seed),o=[];for(let i=0;i<n;i++){const m=Math.SQRT1_2*B3_gauss(r),e=Math.sqrt(Math.max(0,1-.5*h2*h2))*B3_gauss(r);o.push([m,h2*m+e])}return o}
SCENE({id:'quantitative-traits-regression',name:'Regression to the mean',tag:'Galton’s heights, and breeding',
 definition:'Children of unusually tall parents are, on average, tall but less extreme than their parents: they regress towards the mean. The slope of offspring against mid-parent measures the narrow-sense heritability.',
 example:'Galton found children deviated from average by about two-thirds as much as their parents did. Breeders use the same slope: the response to selection R equals h² times the selection differential S.',
 desc:'A scatter of simulated families, mid-parent height against offspring height, with a regression line whose slope is the heritability you set. Selecting the tallest parents shows the selection differential and the response in their children.',
 research:'Galton, F. (1886). Regression towards mediocrity in hereditary stature. Journal of the Anthropological Institute 15, 246–263. Lush, J. L. (1937). Animal Breeding Plans (the breeder’s equation R = h²S).',
 dur:12,hint:'Change the heritability and how many parents are selected. Offspring of selected parents move only h² of the way.',
 init:()=>({h:65,top:20}),
 watch(p){return {h:Math.round(20+60*smooth(p)),top:20}},
 ui:[{range:'h',label:'Heritability h²',min:0,max:100,step:5,get:s=>s.h,act:'h',show:v=>v+'%'},{range:'top',label:'Parents selected (tallest)',min:5,max:50,step:5,get:s=>s.top,act:'top',show:v=>'top '+v+'%'}],
 on:{h(s,v){s.h=Number(v);return 'keep'},top(s,v){s.top=Number(v);return 'keep'}},
 draw(s){
  const h2=s.h/100,fam=B3_fam(h2,12),sd=7,mu=170,cm=z=>mu+z*sd;
  const ms=fam.map(f=>f[0]).sort((a,b)=>b-a),cut=ms[Math.max(0,Math.round(fam.length*s.top/100)-1)],sel=fam.filter(f=>f[0]>=cut);
  const S=sel.reduce((a,f)=>a+f[0],0)/sel.length,Ro=sel.reduce((a,f)=>a+f[1],0)/sel.length;
  let out=heading('Children of tall parents are tall, but less so',26);
  const pl=B3_plot(80,52,250,210,[150,190],[150,190],{xt:[[150,'150'],[170,'170'],[190,'190']],yt:[[150,'150'],[170,'170'],[190,'190']],xl:'mid-parent height (cm)',yl:'child (cm)',ylX:40});
  out+=pl.svg+L(pl.X(150),pl.Y(150),pl.X(190),pl.Y(190),C.muted,1.5,'stroke-dasharray="4 4"');
  fam.forEach(f=>{const x=cm(f[0]),y=cm(f[1]);if(x>150&&x<190&&y>150&&y<190)out+=Ci(pl.X(x),pl.Y(y),3.2,f[0]>=cut?C.coral:C.blue,'none',f[0]>=cut?'':'opacity=".55"')});
  out+=L(pl.X(150),pl.Y(mu+h2*(150-mu)),pl.X(190),pl.Y(mu+h2*(190-mu)),C.ink,2.5);
  out+=L(pl.X(cut*sd+mu),52,pl.X(cut*sd+mu),262,C.coral,1.5,'stroke-dasharray="3 3"');
  out+=R(362,52,218,210,C.pale,'none',10);
  out+=B3_lines(376,76,['Selected parents (coral):'],13,C.muted)+TBF(376,98,`${(S*sd).toFixed(1)} cm above average`,14,C.coral,'start');
  out+=B3_lines(376,128,['Their children:'],13,C.muted)+TBF(376,150,`${(Ro*sd).toFixed(1)} cm above average`,14,C.blue,'start');
  out+=B3_lines(376,180,['Response = h² × selection',`= ${h2.toFixed(2)} × ${(S*sd).toFixed(1)} = ${(h2*S*sd).toFixed(1)} cm`,'(simulated families wobble','around this)'],13,C.ink);
  out+=R(20,302,560,72,'#fff',C.grid,10);
  out+=B3_lines(36,322,B3_wrap('Black line: slope h² · dashed: children exactly like their parents. Galton’s slope was about 2/3. Regression to the mean is statistics, not a force pulling families back to average.',82),13,C.ink);
  return {svg:out,phase:'Parents who are tall partly because of luck in their environment do not pass that luck on, so their children come out closer to the average. The fraction that is passed on, h², is the slope of the line and the reason selective breeding works step by step.'};
 }});

function B3_pots(seed){const r=B3_rng(seed);return range(24).map(()=>({g:B3_gauss(r),e:B3_gauss(r)}))}
SCENE({id:'quantitative-traits-heritability',name:'What heritability does not mean',tag:'Lewontin’s two pots',
 definition:'Heritability is the share of the variation in a trait, in one population and one range of environments, that is due to genetic differences. It is not how “genetic” the trait is in an individual, and it says nothing about why two groups differ.',
 example:'Seeds from the same sack are sown in two pots, one with good soil, one poor. Within each pot, height differences can be entirely genetic, yet the difference between the pots is entirely due to the soil.',
 desc:'Two pots of plants grown from the same mix of seeds. You choose whether light and water are even within each pot and whether one pot has poor soil, and see the heritability within each pot and the cause of the difference between pots.',
 research:'Lewontin, R. C. (1970). Race and intelligence. Bulletin of the Atomic Scientists 26(3), 2–8 (the two-pot analogy). Visscher, P. M., Hill, W. G. & Wray, N. R. (2008). Heritability in the genomics era: concepts and misconceptions. Nature Reviews Genetics 9, 255–266.',
 dur:12,hint:'Make conditions uneven within the pots and watch heritability fall, though the seeds have not changed. Then give pot B poor soil.',
 init:()=>({within:'even',poor:true}),
 watch(p){return {within:p<.5?'even':'uneven',poor:p>.25&&p<.5||p>.75}},
 ui:[{choose:[['even','Even light and water in each pot'],['uneven','Uneven']],label:'Conditions within each pot',get:s=>s.within,act:'within'},{choose:[['same','Same soil'],['poor','Pot B has poor soil']],label:'Soil',get:s=>s.poor?'poor':'same',act:'soil'}],
 on:{within(s,v){s.within=v;return 'keep'},soil(s,v){s.poor=v==='poor';return 'keep'}},
 draw(s){
  const pl=B3_pots(21),ve=s.within==='even'?0:1,h2=1/(1+ve),ht=(p,b)=>clamp(150+28*p.g+28*Math.sqrt(ve)*p.e-(b&&s.poor?60:0),40,215);
  let out=heading('Same seeds, two pots',26);
  [[60,'Pot A',false],[320,'Pot B',true]].forEach(([x,lab,b],k)=>{const plants=pl.slice(k*12,k*12+12);
   out+=P(`M${x} 262h220l-16 50h-188z`,'#8a5a3c',2,b&&s.poor?'#c9b79b':'#7b5236');
   const hs=plants.map(p=>ht(p,b)),mean=hs.reduce((a,v)=>a+v,0)/12;
   hs.forEach((h,i)=>{const px=x+14+i*17.5,top=262-h*.9;out+=L(px,262,px,top,C.green,2.5)+Ci(px,top,4.5,B3_GRN,'none')});
   out+=L(x-6,262-mean*.9,x+226,262-mean*.9,C.coral,1.5,'stroke-dasharray="5 4"');
   out+=TBF(x+110,332,`${lab}${b&&s.poor?' (poor soil)':''}`,14,C.ink)});
  out+=R(20,342,560,32,C.pale,'none',8);
  out+=TF(300,363,`Heritability within each pot: ${Math.round(h2*100)}% · difference between pots: ${s.poor?'all due to soil':'none (same soil)'}`,14,C.ink);
  out+=TF(300,52,'dashed line = pot average height',13,C.muted);
  return {svg:out,phase:`${s.within==='even'?'With even conditions every difference inside a pot comes from the seeds, so heritability is 100%.':'Uneven light and water add environmental differences, so heritability falls to about 50%, though the seeds are identical.'} ${s.poor?'The gap between the pots is caused entirely by soil, however high heritability is within them.':''} Heritability belongs to a population in its environment, not to a trait or a person. The idea grew up alongside eugenics, which Galton named and Fisher supported; modern genetics rejects its conclusions.`};
 }});
