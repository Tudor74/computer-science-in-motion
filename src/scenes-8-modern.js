/* ===================== Biology era 8 · Reading and writing life ===================== */
// Sequencing, the tree of life, CRISPR, evolution in a flask, antibiotic resistance and the origin of life.
// Every picture is a pure function of state (and X). Random processes use seeded generators, never Math.random.
const B8_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const B8_rng=n=>rng(B8_mix(n));
const B8_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const B8_COL={A:C.green,C:C.blue,G:C.amber,T:C.coral,U:C.coral};
const B8_COMP={A:'T',T:'A',G:'C',C:'G'};
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function B8_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+18,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||36),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A pressable box: a button in Try it, plain in Watch.
function B8_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,8,o.sel?'stroke-width="3"':'stroke-width="1.5"')+lines.map((t,i)=>(o.bold&&i===0?TBF:TF)(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*17,t,o.size||13,o.ink||C.ink)).join('');
 return hit(X,act,arg,label,inner);
}
function B8_wrap(t,n){const out=[''];t.split(' ').forEach(w=>{const c=out[out.length-1];if(c&&(c+' '+w).length>n)out.push(w);else out[out.length-1]=c?c+' '+w:w});return out}
const B8_money=v=>v>=1e6?'$'+(v/1e6).toFixed(v>=1e7?0:1)+' million':v>=1e3?'$'+(v/1e3).toFixed(v>=1e4?0:1)+' thousand':'$'+Math.round(v);

/* ---------------------------------------------------------------- sequencing */
const B8_TPL=['GATCCTAGCATG','TTAGCCGATACG','ACGGTCATTGCA'];
const B8_LANES=['A','C','G','T'];
const B8_bandY=(len,n,t)=>74+t*(30+(n-len)*20);
SCENE({id:'sequencing',name:'Sanger sequencing',tag:'Reading DNA with chain-stopping bases',
 definition:'Sanger’s method copies a DNA strand many times with a few chain-stopping (dideoxy) bases mixed in. Each copy stops at a different place, and sorting the copies by length spells out the sequence.',
 example:'If the copies that end in G are 1, 5 and 9 bases long, then positions 1, 5 and 9 of the new strand are G.',
 desc:'A gel with four lanes, one for each chain-stopping base. The bands move down as the gel runs, short copies furthest; reading them from the bottom up gives the new strand, shown against the template it pairs with.',
 research:'Sanger, Nicklen & Coulson (1977). DNA sequencing with chain-terminating inhibitors. PNAS 74, 5463–5467. Automated, fluorescent versions of the method read the first human genome drafts (IHGSC 2001).',
 dur:12,hint:'Run the gel with the slider, then press Read next band. Choose another strand to read a different sequence.',
 init:()=>({tpl:0,t:100,r:0}),
 watch(p){return p<.45?{tpl:0,t:Math.round(p/.45*100),r:0}:{tpl:0,t:100,r:Math.min(12,Math.floor((p-.45)/.5*13))}},
 ui:[{choose:[['0','Strand 1'],['1','Strand 2'],['2','Strand 3']],label:'Strand',get:s=>String(s.tpl),act:'tpl'},{range:'t',label:'Run the gel',min:0,max:100,get:s=>s.t,act:'t',show:v=>v+'%'},{b:'Read next band',act:'read'},{b:'Read all',act:'all'}],
 on:{tpl(s,v){s.tpl=Number(v);s.r=0},t(s,v){s.t=Number(v);if(s.t<100)s.r=0;return 'keep'},read(s){s.t=100;s.r=Math.min(12,s.r+1);return 'keep'},all(s){s.t=100;s.r=12;return 'keep'}},
 draw(s){
  const seq=B8_TPL[s.tpl],n=seq.length,t=s.t/100;let out=heading('Four lanes, one per chain-stopping base',26);
  out+=R(30,40,246,318,'#eef3f6',C.grid,6);
  B8_LANES.forEach((b,j)=>{const x=40+j*58;out+=TBF(x+26,58,'dd'+b,13,B8_COL[b])+R(x+6,64,40,7,'#c3d1da','none',2)});
  for(let i=0;i<n;i++){const b=seq[i],j=B8_LANES.indexOf(b),x=40+j*58,y=B8_bandY(i+1,n,t),done=t>=1&&i<s.r;
   out+=R(x+6,y-3,40,7,done?B8_COL[b]:tint(B8_COL[b],.35),done?C.ink:'none',2);}
  if(t>=1&&s.r<n){const y=B8_bandY(s.r+1,n,1);out+=arrow(300,y,282,y,C.coral,2.2,7)}
  out+=TF(153,350,'shortest copies end up at the bottom',13,C.muted);
  out+=TB(450,62,'Read from the bottom up',15,C.ink);
  ['Each lane has one chain-stopping base.','A copy ends where that base joined,','so its length marks the base’s place.','Shorter copies run further down.'].forEach((l,i)=>{out+=TF(312,88+i*18,l,13,C.ink,'start')});
  out+=TF(312,180,'New strand, read 5′ → 3′',13,C.muted,'start');
  for(let i=0;i<n;i++){const x=312+i*23,b=seq[i],shown=t>=1&&i<s.r;out+=R(x,188,21,26,shown?tint(B8_COL[b],.75):'#fff',shown?B8_COL[b]:C.grid,4)+(shown?TMF(x+10.5,206,b,15,C.ink,'middle','font-weight="700"'):'')}
  out+=TF(312,240,'Template it was copied from, 3′ → 5′',13,C.muted,'start');
  for(let i=0;i<n;i++){const x=312+i*23,shown=t>=1&&i<s.r;out+=R(x,248,21,26,'#fff',C.grid,4)+(shown?TMF(x+10.5,266,B8_COMP[seq[i]],15,C.muted):'')}
  out+=TB(450,310,t<1?'Run the gel fully first':s.r>=n?'Read complete: 12 bases':`Bases read: ${s.r} of 12`,15,s.r>=n?C.green:C.ink);
  out+=TF(450,334,'A pairs with T, and G with C.',13,C.muted);
  return {svg:out,phase:t<1?'The copies are still bunched near the wells. Run the gel: each copy moves at a speed set by its length, so the bands spread out by size.':s.r>=n?`Read in order of length, the lanes spell ${seq}. Every base pairs with the template underneath. Machines later replaced the four lanes with four coloured dyes in one capillary.`:'The shortest copy is one base long, so it is the lowest band. Its lane tells you the first base of the new strand; the next band up gives the second, and so on.'};
 }});

/* ---- shotgun sequencing and assembly ---- */
const B8_GENOME=(()=>{const r=B8_rng(808),b='ACGT';let g='';for(let i=0;i<48;i++)g+=b[Math.floor(r()*4)];return g})();
const B8_OV=3;
function B8_reads(n,len,seed){const r=B8_rng(seed),G=B8_GENOME.length,out=[];for(let i=0;i<n;i++)out.push(Math.floor(r()*(G-len+1)));return out.sort((a,b)=>a-b)}
function B8_assemble(starts,len){const ctg=[];for(const st of starts){const en=st+len-1,c=ctg[ctg.length-1];if(c&&c[1]-st+1>=B8_OV)c[1]=Math.max(c[1],en);else ctg.push([st,en])}return ctg}
SCENE({id:'sequencing-shotgun',name:'Shotgun sequencing',tag:'Shred, read, reassemble',
 definition:'Shotgun sequencing breaks many copies of a genome into random pieces, reads each short piece, and rebuilds the genome by finding where the reads overlap.',
 example:'Reading enough random pieces to cover each base several times over usually leaves only a few gaps, which is roughly how the first bacterial genome was assembled in 1995.',
 desc:'A 48-base genome, random reads stacked above it, the coverage of each base, and the contigs that can be assembled from overlaps of at least three bases, with the gap and contig counts predicted by Lander and Waterman.',
 research:'Lander & Waterman (1988). Genomic mapping by fingerprinting random clones: a mathematical analysis. Genomics 2, 231–239. Fleischmann et al. (1995). Whole-genome random sequencing and assembly of Haemophilus influenzae Rd. Science 269, 496–512.',
 dur:12,hint:'Add reads or make them longer and watch the gaps close. New random reads draws a fresh set from the same genome.',
 init:()=>({n:12,len:10,seed:5}),
 watch(p){return {n:2+Math.floor(p*30),len:10,seed:5}},
 ui:[{range:'n',label:'Number of reads',min:1,max:40,get:s=>s.n,act:'n'},{range:'len',label:'Read length',min:6,max:16,get:s=>s.len,act:'len',show:v=>v+' bases'},{b:'New random reads',act:'again'}],
 on:{n(s,v){s.n=Number(v)},len(s,v){s.len=Number(v)},again(s){s.seed=nextSeed()%100000+1}},
 draw(s){
  const G=B8_GENOME.length,st=B8_reads(s.n,s.len,s.seed),ctg=B8_assemble(st,s.len),cov=range(G).map(i=>st.filter(a=>i>=a&&i<a+s.len).length);
  let out=heading('Shotgun sequencing: random reads, then overlaps',26);
  out+=TF(36,50,'The genome (unknown to the sequencer)',13,C.muted,'start');
  for(let i=0;i<G;i++)out+=TMF(36+i*11+5,68,B8_GENOME[i],13,cov[i]?C.ink:C.coral);
  const rows=[];const place=st.map(a=>{let r=rows.findIndex(e=>e+1<a);if(r<0){rows.push(-1);r=rows.length-1}rows[r]=a+s.len-1;return r});
  const rh=Math.min(10,118/Math.max(1,rows.length));
  st.forEach((a,i)=>{const ci=ctg.findIndex(c=>a>=c[0]&&a<=c[1]);out+=R(36+a*11,78+place[i]*rh,s.len*11-2,Math.max(2,rh-2),ci%2?C.purple:C.blue,'none',2)});
  out+=TF(36,214,'Coverage: reads over each base (red = never read)',13,C.muted,'start');
  for(let i=0;i<G;i++)out+=cov[i]?R(36+i*11,248-Math.min(cov[i],8)*3.5,9,Math.min(cov[i],8)*3.5,C.green,'none',1):R(36+i*11,244,9,4,C.coral,'none',1);
  out+=TF(36,268,`Assembled contigs (overlap of ${B8_OV} or more bases)`,13,C.muted,'start');
  ctg.forEach((c,i)=>{out+=R(36+c[0]*11,274,(c[1]-c[0]+1)*11-2,10,i%2?C.purple:C.blue,'none',3)});
  const c=s.n*s.len/G,gap=cov.filter(v=>!v).length/G,eGap=Math.exp(-c),eCtg=s.n*Math.exp(-c*(1-B8_OV/s.len));
  out+=counter(36,298,'Coverage c = NL/G',c.toFixed(1)+'×',C.ink,128)+counter(172,298,'Unread bases',Math.round(gap*100)+'%',C.coral,128)+counter(308,298,'Predicted: e^−c',Math.round(eGap*100)+'%',C.muted,128)+counter(444,298,'Contigs / predicted',`${ctg.length} / ${Math.max(1,eCtg).toFixed(1)}`,C.blue,128);
  out+=TF(300,358,'Predictions are averages for a long genome (Lander & Waterman 1988);',13,C.muted)+TF(300,375,'one draw varies, and reads cannot overhang the ends, so ends are read less.',13,C.muted);
  return {svg:out,phase:`${s.n} reads of ${s.len} bases give coverage ${c.toFixed(1)}×. With random starts some bases are still never read (about e^−c of them on average), so the genome comes back in ${ctg.length} piece${ctg.length===1?'':'s'}. Real projects aim for 8× or more, and repeats longer than a read remain hard to place.`};
 }});

/* ---- cost of a genome ---- */
// Approximate, rounded values from NHGRI's sequencing cost series (Wetterstrand).
const B8_COST=[[2001,95e6],[2002,70e6],[2004,20e6],[2006,14e6],[2007,9e6],[2008,1.4e6],[2009,7e4],[2010,3e4],[2011,8e3],[2013,5e3],[2015,1.3e3],[2017,1.1e3],[2019,950],[2021,600],[2022,500]];
function B8_costAt(y){const d=B8_COST;if(y<=d[0][0])return d[0][1];for(let i=1;i<d.length;i++)if(y<=d[i][0]){const u=(y-d[i-1][0])/(d[i][0]-d[i-1][0]);return Math.pow(10,lerp(Math.log10(d[i-1][1]),Math.log10(d[i][1]),u))}return d[d.length-1][1]}
const B8_moore=y=>95e6*Math.pow(2,-(y-2001)/2);
SCENE({id:'sequencing-cost',name:'The cost of a genome',tag:'Faster than Moore’s law',
 definition:'The cost of sequencing a human genome fell from tens of millions of dollars in 2001 to hundreds of dollars two decades later, far faster than computer chips improved.',
 example:'Around 2008, massively parallel sequencers that read millions of short fragments at once replaced one-fragment-at-a-time capillary machines, and the cost curve dropped off a cliff.',
 desc:'Cost per human genome against year on a logarithmic scale, with a line halving every two years (Moore’s law) for comparison. A year marker reads off both values.',
 research:'Wetterstrand, K. A. DNA Sequencing Costs: Data from the NHGRI Genome Sequencing Program (genome.gov/sequencingcostsdata). Values here are rounded and approximate; NHGRI notes that they leave out some costs, such as analysis.',
 dur:10,hint:'Move the year. Switch to a linear scale to see why the log scale is needed.',
 init:()=>({y:2008,lin:'log'}),
 watch(p){return {y:Math.round(2001+p*21),lin:'log'}},
 ui:[{range:'y',label:'Year',min:2001,max:2022,get:s=>s.y,act:'y'},{choose:[['log','Log scale'],['lin','Linear scale']],label:'Scale',get:s=>s.lin,act:'lin'}],
 on:{y(s,v){s.y=Number(v)},lin(s,v){s.lin=v}},
 draw(s){
  const log=s.lin==='log',yv=v=>log?Math.log10(Math.max(v,1)):v;
  const pl=B8_plot(110,56,440,220,[2001,2022],log?[2,8.2]:[0,1e8],{xt:[[2001,'2001'],[2005,'2005'],[2010,'2010'],[2015,'2015'],[2020,'2020']],yt:log?[[2,'$100'],[4,'$10k'],[6,'$1M'],[8,'$100M']]:[[0,'$0'],[2.5e7,'$25M'],[5e7,'$50M'],[7.5e7,'$75M'],[1e8,'$100M']],xl:'year',yl:'cost per human genome (US$)'+(log?', log scale':'')});
  let out=heading('Cost of sequencing one human genome',26)+pl.svg;
  const mo=[];for(let y=2001;y<=2022;y+=.25)mo.push([pl.X(y),pl.Y(yv(B8_moore(y)))]);
  out+=B8_poly(mo,C.coral,2,'stroke-dasharray="7 5"');
  out+=B8_poly(B8_COST.map(d=>[pl.X(d[0]),pl.Y(yv(d[1]))]),C.blue,2.6);
  B8_COST.forEach(d=>{out+=Ci(pl.X(d[0]),pl.Y(yv(d[1])),3.5,C.blue)});
  const cy=B8_costAt(s.y),my=B8_moore(s.y);
  out+=L(pl.X(s.y),56,pl.X(s.y),276,C.ink,1.2,'stroke-dasharray="3 3"')+Ci(pl.X(s.y),pl.Y(yv(cy)),6,C.blue,'#fff')+Ci(pl.X(s.y),pl.Y(yv(my)),5,C.coral,'#fff');
  out+=TF(120,328,'blue: NHGRI, approximate',13,C.blue,'start')+TF(550,328,'coral: halving every 2 years',13,C.coral,'end');
  out+=TB(300,354,`${s.y}: about ${B8_money(cy)} a genome`,15,C.ink);
  out+=TF(300,374,`At Moore’s-law pace it would be ${B8_money(my)}${my/cy>=2?` (${Math.round(my/cy)}× the real cost)`:''}.`,13,C.muted);
  return {svg:out,phase:log?'On a log scale each grid step is ten times cheaper. Until about 2007 the cost fell roughly as fast as chips improved; then massively parallel short-read machines arrived and it fell far faster. Since about 2015 the decline has slowed.':'On a linear scale everything after 2008 is squashed against the floor: a fall from $95 million to $500 cannot be seen. Growth and decay by factors need a log scale.'};
 }});

/* ---------------------------------------------------------------- phylogenetic trees */
const B8_TAXA=['Human','Chimp','Gorilla','Mouse','Chicken'],B8_SHORT=['Hu','Ch','Go','Mo','Ck'];
// A toy alignment (not real sequences): the differences are chosen to give the familiar tree.
const B8_ALN=['ACGTACGTACGT','ACGTACGTACGA','ACGTACCTATGA','ATGTTCCTACGA','GTGATCCAATCA'];
const B8_D=B8_ALN.map(a=>B8_ALN.map(b=>[...a].filter((c,i)=>c!==b[i]).length));
function B8_upgma(steps){let cl=B8_TAXA.map((n,i)=>({m:[i],h:0,kids:null}));const joins=[];
 for(let k=0;k<steps&&cl.length>1;k++){let best=null;
  for(let i=0;i<cl.length;i++)for(let j=i+1;j<cl.length;j++){let d=0;for(const a of cl[i].m)for(const b of cl[j].m)d+=B8_D[a][b];d/=cl[i].m.length*cl[j].m.length;if(!best||d<best.d-1e-9)best={i,j,d}}
  const A=cl[best.i],B=cl[best.j],node={m:A.m.concat(B.m),h:best.d/2,kids:[A,B]};joins.push({a:A,b:B,d:best.d});cl=cl.filter((c,q)=>q!==best.i&&q!==best.j);cl.push(node)}
 return {cl,joins}}
const B8_tipY=i=>84+i*46,B8_TX=500,B8_TS=50;
const B8_nodeY=c=>c.kids?(B8_nodeY(c.kids[0])+B8_nodeY(c.kids[1]))/2:B8_tipY(c.m[0]);
const B8_nodeX=c=>B8_TX-c.h*B8_TS;
function B8_drawClade(c,col){if(!c.kids)return '';const x=B8_nodeX(c);let out='';const ys=c.kids.map(B8_nodeY);
 c.kids.forEach((k,i)=>{out+=L(B8_nodeX(k),ys[i],x,ys[i],col,2.4)+B8_drawClade(k,col)});
 return out+L(x,ys[0],x,ys[1],col,2.4)+Ci(x,(ys[0]+ys[1])/2,4,col)}
SCENE({id:'phylogenetic-trees',name:'Trees from sequences',tag:'Count differences, join the closest',
 definition:'A phylogenetic tree shows how species are related by descent. One simple way to build one from DNA is to count the differences between sequences and repeatedly join the two closest groups (UPGMA).',
 example:'Human and chimpanzee sequences differ at fewer sites than either does from a gorilla’s, so they join first; the gorilla joins them next.',
 desc:'A toy 12-base alignment for five species, the table of pairwise differences, and the tree built one join at a time, with branch points placed at half the average distance between the groups.',
 research:'Sokal & Michener (1958). A statistical method for evaluating systematic relationships (UPGMA). Zuckerkandl & Pauling (1965). Evolutionary divergence and convergence in proteins (the molecular clock). Felsenstein (2004). Inferring Phylogenies. Sinauer. The alignment here is a toy, not real data.',
 dur:12,hint:'Press Join the closest pair to build the tree. Press two species names to highlight the sites where they differ.',
 init:()=>({k:0,sel:[0,1]}),
 watch(p){return {k:Math.min(4,Math.floor(p*5.2)),sel:[0,1]}},
 ui:[{b:'Join the closest pair',act:'join'},{b:'Build the whole tree',act:'all'}],
 on:{join(s){s.k=Math.min(4,s.k+1);return 'keep'},all(s){s.k=4;return 'keep'},pick(s,v){const i=Number(v);if(s.sel.includes(i))return 'keep';s.sel=[s.sel[1],i];return 'keep'}},
 draw(s,f,X){
  const {cl,joins}=B8_upgma(s.k),[a,b]=s.sel;let out=heading('Building a tree from differences',26);
  out+=TF(30,56,'Toy alignment (press two names)',13,C.muted,'start');
  B8_ALN.forEach((seq,i)=>{const y=80+i*22,on=s.sel.includes(i);
   out+=hit(X,'pick',i,`Select ${B8_TAXA[i]}`,R(26,y-15,62,20,on?C.pale:'#fff',on?C.blue:C.grid,4)+TF(31,y,B8_TAXA[i],13,C.ink,'start'));
   [...seq].forEach((ch,j)=>{const diff=on&&B8_ALN[a][j]!==B8_ALN[b][j];if(diff)out+=R(93+j*13,y-14,12,19,C.coralp,'none',2);out+=TMF(99+j*13,y,ch,14,diff?C.coral:C.ink)})});
  out+=TF(30,208,`${B8_TAXA[a]} vs ${B8_TAXA[b]}: ${B8_D[a][b]} site${B8_D[a][b]===1?' differs':'s differ'}`,13,C.coral,'start');
  const last=joins[joins.length-1],hl=new Set();if(last)for(const p of last.a.m)for(const q of last.b.m){hl.add(p+'-'+q);hl.add(q+'-'+p)}
  B8_SHORT.forEach((n,i)=>{out+=TBF(112+i*30,232,n,13,C.muted)+TBF(80,256+i*20,n,13,C.muted,'end')});
  for(let i=0;i<5;i++)for(let j=0;j<5;j++){const x=98+j*30,y=242+i*20,h=hl.has(i+'-'+j);out+=R(x,y,28,18,h?C.coralp:i===j?'#f1f5f7':'#fff',h?C.coral:C.grid,3)+TF(x+14,y+14,i===j?'–':B8_D[i][j],13,h?C.coral:C.ink)}
  out+=TF(256,300,'Ck = chicken',13,C.muted,'start');
  out+=TF(400,56,'The tree so far',13,C.muted);
  for(const c of cl)out+=B8_drawClade(c,C.blue);
  B8_TAXA.forEach((n,i)=>{const y=B8_tipY(i);out+=L(486,y,B8_TX,y,C.blue,2.4)+TF(B8_TX+6,y+5,n,14,C.ink,'start')});
  out+=L(B8_TX-B8_TS,312,B8_TX,312,C.ink,2)+TF(B8_TX-B8_TS/2,330,'1 difference',13,C.muted);
  if(last){const names=g=>g.m.slice().sort((x,y)=>x-y).map(i=>B8_SHORT[i]).join('+');out+=TF(300,370,`Join ${s.k}: ${names(last.a)} with ${names(last.b)} — average difference ${fmt(last.d)}, so they meet at ${fmt(last.d/2)}`,13,C.ink)}
  else out+=TF(300,370,'No joins yet: the smallest number in the table is joined first.',13,C.muted);
  return {svg:out,phase:s.k===0?'Every species starts on its own. The table counts the sites where each pair differs; the smallest entry, Human–Chimp with 1, will be joined first.':s.k<4?'After a join, the new group’s distance to each other species is the average over its members (the highlighted cells). The closest pair is joined again.':'The finished tree groups human and chimpanzee, then gorilla, then mouse, with chicken outside. UPGMA assumes every lineage changes at the same rate; modern methods (maximum likelihood, Bayesian) drop that assumption.'};
 }});

/* ---- reading trees: rotation does not change relationships ---- */
const B8_RTREE={id:'A',kids:['Fish',{id:'B',kids:['Frog',{id:'C',kids:['Lizard',{id:'D',kids:['Mouse','Human']}]}]}]};
const B8_RX={A:56,B:126,C:196,D:266},B8_RTIPX=336;
function B8_rlayout(rot){const tips=[],nodes={};
 const walk=n=>{if(typeof n==='string'){const y=78+tips.length*54;tips.push({name:n,y});return y}const ks=rot[n.id]?n.kids.slice().reverse():n.kids;const ys=ks.map(walk);const y=(ys[0]+ys[1])/2;nodes[n.id]={y,ys,ks};return y};
 walk(B8_RTREE);return {tips,nodes}}
function B8_leaves(n){return typeof n==='string'?[n]:n.kids.flatMap(B8_leaves)}
function B8_mrca(a,b){let best='A';const walk=n=>{if(typeof n==='string')return;const l=B8_leaves(n);if(l.includes(a)&&l.includes(b)){best=n.id;n.kids.forEach(walk)}};walk(B8_RTREE);return best}
const B8_PAIRS={'Frog-Fish':['Frog','Fish'],'Frog-Human':['Frog','Human'],'Lizard-Mouse':['Lizard','Mouse'],'Fish-Human':['Fish','Human']};
SCENE({id:'phylogenetic-trees-rotate',name:'Reading a tree',tag:'Spin the branches, keep the family',
 definition:'On a tree, relatedness is read from the most recent common ancestor of two species, the branch point where their lines meet, not from how close their names sit along the tips.',
 example:'A frog is more closely related to a human than to a fish, because frog and human share an ancestor (node B) more recent than the one frog shares with fish (node A).',
 desc:'A five-species tree whose branch points can be rotated. The tip order changes, but every most recent common ancestor stays the same. A chosen pair is highlighted with its shared ancestor.',
 research:'Baum, Smith & Donovan (2005). The tree-thinking challenge. Science 310, 979–980. Gregory (2008). Understanding evolutionary trees. Evolution: Education and Outreach 1, 121–137.',
 dur:10,hint:'Press a branch point (A to D) to rotate it. Choose a pair to see where their lines meet.',
 init:()=>({rot:{A:0,B:0,C:0,D:0},pair:'Frog-Fish'}),
 watch(p){const k=Math.floor(p*6);return {rot:{A:k>=1&&k<5?1:0,B:k>=2&&k<5?1:0,C:k>=3?1:0,D:k>=4?1:0},pair:k<3?'Frog-Fish':'Frog-Human'}},
 ui:[{choose:Object.keys(B8_PAIRS).map(k=>[k,k.replace('-',' and ')]),label:'Pair',get:s=>s.pair,act:'pair'}],
 on:{rot(s,v){s.rot={...s.rot,[v]:s.rot[v]?0:1};return 'keep'},pair(s,v){s.pair=v;return 'keep'}},
 draw(s,f,X){
  const {tips,nodes}=B8_rlayout(s.rot),[a,b]=B8_PAIRS[s.pair],m=B8_mrca(a,b);let out=heading('Rotate the branches: relationships stay the same',26);
  const xOf=k=>typeof k==='string'?B8_RTIPX:B8_RX[k.id];
  out+=L(30,nodes.A.y,B8_RX.A,nodes.A.y,C.line,2.6);
  for(const id in nodes){const nd=nodes[id],x=B8_RX[id];out+=L(x,nd.ys[0],x,nd.ys[1],C.line,2.6);nd.ks.forEach((k,i)=>{out+=L(x,nd.ys[i],xOf(k),nd.ys[i],C.line,2.6)})}
  for(const id in nodes){const nd=nodes[id],x=B8_RX[id],on=id===m;out+=hit(X,'rot',id,`Rotate branch point ${id}`,Ci(x,nd.y,13,on?C.coral:'#fff',on?C.coral:C.blue)+TBF(x,nd.y+5,id,13,on?'#fff':C.blue))}
  tips.forEach(t=>{const on=t.name===a||t.name===b;out+=Ci(B8_RTIPX,t.y,5,on?C.coral:C.blue)+TF(B8_RTIPX+12,t.y+5,t.name,14,on?C.coral:C.ink,'start','font-weight="'+(on?700:400)+'"')});
  out+=TF(56,358,'root (oldest)',13,C.muted)+TF(B8_RTIPX,358,'today',13,C.muted);
  const lines=[`${a} and ${b}`,`meet at node ${m}.`,'',m==='A'?'A is the oldest split:':`${m} is more recent than A:`,m==='A'?'the most distant pair.':'they are closer kin',m==='A'?'':'than either is to fish.'];
  lines.forEach((l,i)=>{if(l)out+=(i===0?TBF:TF)(410,90+i*20,l,i===0?14:13,i===0?C.coral:C.ink,'start')});
  ['Rotating a branch point','swaps its two sides but','changes no relationship.','Tip order is no ladder.'].forEach((l,i)=>{out+=TF(410,236+i*19,l,13,C.muted,'start')});
  return {svg:out,phase:'Many readers judge relatedness by how near two names sit at the tips. But any branch point can spin like a mobile. Only the branch points count: the more recent the ancestor two species share, the more closely related they are. The tree also does not run from “lower” to “higher” animals; all five tips are living species.'};
 }});

/* ---- three domains ---- */
const B8_ORG={
 ecoli:{n:'E. coli',note:'A gut bacterium. In every scheme it sits with the bacteria.'},
 cyano:{n:'Cyanobacteria',note:'Photosynthetic bacteria; one was engulfed long ago and became the chloroplast.'},
 methano:{n:'Methanogen',note:'Looks like a bacterium under a microscope, but its ribosomal RNA put it in a separate domain: the Archaea (Woese & Fox 1977).'},
 asgard:{n:'Asgard archaeon',note:'Archaea discovered from environmental DNA in 2015–17; they carry genes once thought unique to eukaryotes.'},
 amoeba:{n:'Amoeba',note:'A single-celled eukaryote, once lumped into “Protista” with many unrelated groups.'},
 yeast:{n:'Yeast',note:'A fungus. Fungi are more closely related to animals than to plants.'},
 oak:{n:'Oak',note:'A plant: a eukaryote whose cells carry chloroplasts.'},
 human:{n:'Human',note:'An animal, one twig among the eukaryotes.'}};
const B8_VIEWS={
 kingdoms:{title:'Five kingdoms (Whittaker 1969): by cell type and way of life',cols:[['Monera',['ecoli','cyano','methano']],['Protista',['amoeba']],['Fungi',['yeast']],['Plantae',['oak']],['Animalia',['human']]]},
 domains:{title:'Three domains (Woese et al. 1990): from ribosomal RNA',cols:[['Bacteria',['ecoli','cyano']],['Archaea',['methano']],['Eukarya',['amoeba','yeast','oak','human']]]},
 two:{title:'Two domains (current evidence, still debated)',cols:[['Bacteria',['ecoli','cyano']],['Archaea',['methano','asgard']],['Eukarya',['amoeba','yeast','oak','human']]]}};
SCENE({id:'phylogenetic-trees-domains',name:'Three domains of life',tag:'Woese’s ribosomal RNA tree',
 definition:'Comparing ribosomal RNA, which every cell has, showed that life falls into three deep groups, Bacteria, Archaea and Eukarya, rather than the older split by appearance into kingdoms.',
 example:'Methane-making microbes look like bacteria, but their ribosomal RNA is as different from bacteria’s as ours is: Carl Woese named them a separate domain.',
 desc:'The same eight organisms placed in three schemes: Whittaker’s five kingdoms, Woese’s three domains, and the newer view in which eukaryotes branch from within the Archaea near the Asgard group.',
 research:'Whittaker (1969). New concepts of kingdoms of organisms. Science 163, 150–160. Woese & Fox (1977). PNAS 74, 5088–5090. Woese, Kandler & Wheelis (1990). PNAS 87, 4576–4579. Zaremba-Niedzwiedzka et al. (2017). Nature 541, 353–358. Eme et al. (2017). Nature Reviews Microbiology 15, 711–723.',
 dur:12,hint:'Switch between the three schemes. Press an organism to read why it sits where it does.',
 init:()=>({view:'domains',pick:'methano'}),
 watch(p){return {view:p<.33?'kingdoms':p<.66?'domains':'two',pick:p<.33?'methano':p<.66?'methano':'asgard'}},
 ui:[{choose:[['kingdoms','Five kingdoms'],['domains','Three domains'],['two','Two domains']],label:'Scheme',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v;if(v!=='two'&&s.pick==='asgard')s.pick='methano';return 'keep'},pick(s,v){s.pick=v;return 'keep'}},
 draw(s,f,X){
  const V=B8_VIEWS[s.view],n=V.cols.length,w=n===5?110:150,gap=n===5?6:30,x0=(600-(n*w+(n-1)*gap))/2;let out=heading(V.title,26);
  const cx=i=>x0+i*(w+gap)+w/2;
  V.cols.forEach(([name,orgs],i)=>{const x=x0+i*(w+gap);out+=R(x,48,w,30,C.pale,'none',6)+TBF(x+w/2,68,name,14,C.ink);
   orgs.forEach((o,j)=>{const on=s.pick===o;out+=B8_btn(X,'pick',o,`About ${B8_ORG[o].n}`,x+6,86+j*30,w-12,26,B8_ORG[o].n,{fill:on?C.coralp:'#fff',stroke:on?C.coral:C.line,sel:on})})});
  if(s.view==='domains'){const rx=300,ry=318;out+=L(cx(0),212,cx(0),232,C.blue,2.4)+L(cx(1),212,cx(1),232,C.blue,2.4)+L(cx(2),212,cx(2),232,C.blue,2.4);
   const ae=(cx(1)+cx(2))/2;out+=B8_poly([[cx(0),232],[rx,ry]],C.blue,2.4)+B8_poly([[cx(1),232],[ae,270],[cx(2),232]],C.blue,2.4)+B8_poly([[ae,270],[rx,ry]],C.blue,2.4)+Ci(rx,ry,5,C.blue)+TF(rx,ry+18,'root: the last universal common ancestor',13,C.muted)}
  if(s.view==='two'){const rx=300,ry=318,ar=cx(1),eu=cx(2);out+=L(cx(0),212,cx(0),232,C.blue,2.4)+L(ar,212,ar,232,C.blue,2.4)+L(eu,212,eu,232,C.blue,2.4);
   out+=B8_poly([[cx(0),232],[rx,ry]],C.blue,2.4)+B8_poly([[ar,232],[ar+40,262],[eu,232]],C.blue,2.4)+B8_poly([[ar+40,262],[rx,ry]],C.blue,2.4)+Ci(rx,ry,5,C.blue);
   out+=R(x0+w+gap-8,44,2*w+gap+16,198,'none',C.purple,10,'stroke-dasharray="6 4"')+TF(330,300,'eukaryotes branch inside the Archaea',13,C.purple,'start')+TF(rx,ry+18,'root: the last universal common ancestor',13,C.muted)}
  if(s.view==='kingdoms')out+=TF(300,260,'Grouped by appearance and nutrition: no tree of descent behind the boxes.',13,C.muted);
  const note=B8_ORG[s.pick].note,words=note.split(' '),lines=[''];words.forEach(wd=>{if((lines[lines.length-1]+' '+wd).length>78)lines.push(wd);else lines[lines.length-1]=(lines[lines.length-1]+' '+wd).trim()});
  lines.slice(0,2).forEach((l,i)=>{out+=TF(300,(lines.length>1?358:366)+i*16,l,13,C.ink)});
  return {svg:out,phase:s.view==='kingdoms'?'Five kingdoms sorted life by what it looks like and how it feeds. It put all cells without a nucleus into one kingdom, Monera.':s.view==='domains'?'Ribosomal RNA split the old Monera in two. Archaea are as distinct from Bacteria as we are; most of life’s diversity is microbial.':'Genomes of Asgard archaea suggest that eukaryotes arose from within the Archaea, which would make two primary domains. This is supported by many analyses but still debated.'};
 }});

/* ---- endosymbiosis ---- */
const B8_EV=[
 ['Two membranes','Like their bacterial ancestors, they have two membranes; the outer still has bacterial-type pores.'],
 ['Their own DNA','A small, circular chromosome, like a bacterium’s, separate from the nucleus.'],
 ['Bacterial ribosomes','Their ribosomes resemble bacteria’s (70S) and are hit by some antibiotics.'],
 ['They divide by splitting','New ones form only by fission of old ones, as bacteria divide.'],
 ['Their genes sit in the bacterial tree','Mitochondrial genes group with alphaproteobacteria; chloroplast genes with cyanobacteria.']];
SCENE({id:'phylogenetic-trees-endosymbiosis',name:'Endosymbiosis',tag:'Cells inside cells',
 definition:'Endosymbiosis is the idea, championed by Lynn Margulis, that mitochondria and chloroplasts began as free-living bacteria engulfed by another cell and kept as partners.',
 example:'Your mitochondria still carry their own small circular DNA, a relic of their bacterial ancestors about two billion years ago.',
 desc:'Four steps from a host cell to a cell with mitochondria, and later chloroplasts, beside five lines of evidence that can be opened one at a time.',
 research:'Sagan (Margulis), L. (1967). On the origin of mitosing cells. Journal of Theoretical Biology 14. Mereschkowsky (1905) proposed a symbiotic origin for chloroplasts. Gray (2012). Mitochondrial evolution. Cold Spring Harbor Perspectives in Biology 4, a011403.',
 dur:12,hint:'Step through the story with the slider. Press each piece of evidence to read it.',
 init:()=>({step:3,open:4}),
 watch(p){return {step:Math.min(4,Math.floor(p*5)),open:Math.min(4,Math.floor(p*5))}},
 ui:[{range:'step',label:'Step',min:0,max:4,get:s=>s.step,act:'step',show:v=>['host cell','partner nearby','engulfed','mitochondrion','chloroplast'][v]}],
 on:{step(s,v){s.step=Number(v);return 'keep'},ev(s,v){s.open=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Mitochondria and chloroplasts were once bacteria',26);const cx=150,cy=200;
  out+=`<ellipse cx="${cx}" cy="${cy}" rx="118" ry="104" fill="${C.pale}" stroke="${C.blue}" stroke-width="2.5"/>`;
  out+=Ci(cx-40,cy-30,30,'#d6e4ee',C.blue)+TF(cx-40,cy-25,'nucleus',13,C.ink);
  const bact=(x,y,col,inside,label)=>{let o='';if(inside)o+=`<ellipse cx="${x}" cy="${y}" rx="34" ry="20" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-dasharray="${s.step>=3||label==='chloroplast'?'0':'4 3'}"/>`;o+=`<ellipse cx="${x}" cy="${y}" rx="28" ry="15" fill="${tint(col,.6)}" stroke="${col}" stroke-width="2"/>`+Ci(x+8,y,5,'none',col);return o+TF(x,y+(inside?34:30),label,13,col)};
  if(s.step===1)out+=bact(236,66,C.coral,false,'bacterium');
  if(s.step===2)out+=bact(cx+45,cy+40,C.coral,true,'engulfed bacterium');
  if(s.step>=3)out+=bact(cx+45,cy+40,C.coral,true,'mitochondrion');
  if(s.step>=4)out+=bact(cx-40,cy+55,C.green,true,'chloroplast');
  out+=TF(cx,330,['A host cell (related to the Archaea)','An alphaproteobacterium nearby','Engulfed but not digested','Kept: it became the mitochondrion','Later, in one lineage: a cyanobacterium'][s.step],13,C.ink);
  out+=TF(cx,348,s.step>=4?'became the chloroplast of algae and plants':s.step>=3?'about two billion years ago':'',13,C.muted);
  out+=TF(440,56,'The evidence (press one)',13,C.muted);
  B8_EV.forEach(([t],i)=>{const y=66+i*44,on=s.open===i;out+=hit(X,'ev',i,`Evidence: ${t}`,R(296,y,288,38,on?C.greenp:'#fff',on?C.green:C.line,8)+TBF(306,y+24,t,13,on?C.green:C.ink,'start'))});
  B8_wrap(B8_EV[s.open][1],40).slice(0,3).forEach((l,i)=>{out+=TF(300,300+i*18,l,13,C.ink,'start')});
  return {svg:out,phase:'Margulis’s 1967 paper was widely doubted; by the 1980s gene sequences had confirmed the bacterial origin of mitochondria and chloroplasts. Her further claim that cilia came from engulfed spirochaetes has not been supported. Which cell did the engulfing, and how the nucleus arose, are still being worked out.'};
 }});

/* ---------------------------------------------------------------- CRISPR */
// Target DNA (top strand, 5′→3′). NGG PAM sites follow the 20-base windows starting at 4 and 9 only.
const B8_TGT='ATGCTACGTTCAGCTACCATGACTAGGCATGGAC';
const B8_MM={none:[],far:[0,2],near:[19]};
const B8_rna=b=>b==='T'?'U':b;
const B8_swap=b=>({A:'C',C:'G',G:'T',T:'A'})[b];
SCENE({id:'crispr',name:'CRISPR–Cas9',tag:'A guide RNA finds its match',
 definition:'Cas9 is a bacterial enzyme that cuts DNA where a 20-letter guide RNA matches the DNA and the match is followed by a short PAM motif (NGG). Changing the guide retargets the cut.',
 example:'Doudna and Charpentier showed in 2012 that a single designed guide RNA could direct Cas9 to cut a chosen DNA sequence, which made gene editing far simpler.',
 desc:'A 34-base stretch of DNA with a Cas9 window that can slide along it. The guide RNA copies the window; Cas9 cuts three bases before the PAM only if the next three bases read NGG and the guide matches near the PAM.',
 research:'Jinek, Chylinski, Fonfara, Hauer, Doudna & Charpentier (2012). A programmable dual-RNA–guided DNA endonuclease in adaptive bacterial immunity. Science 337, 816–821. Fu et al. (2013) found that guides with mismatches can still cut off-target sites; the mismatch rule here is simplified.',
 dur:12,hint:'Slide the window along the DNA. Only two positions are followed by NGG. Then add mismatches far from or next to the PAM.',
 init:()=>({pos:4,mm:'none'}),
 watch(p){const k=Math.floor(p*14);return k<12?{pos:k,mm:'none'}:{pos:4,mm:k===12?'far':'near'}},
 ui:[{range:'pos',label:'Guide position',min:0,max:11,get:s=>s.pos,act:'pos'},{choose:[['none','Perfect match'],['far','2 mismatches far from PAM'],['near','1 mismatch next to PAM']],label:'Guide',get:s=>s.mm,act:'mm'}],
 on:{pos(s,v){s.pos=Number(v);return 'keep'},mm(s,v){s.mm=v;return 'keep'}},
 draw(s){
  const t=B8_TGT,p=s.pos,x=i=>30+i*16,pam=t.slice(p+20,p+23),pamOK=pam[1]==='G'&&pam[2]==='G',mmSet=new Set(B8_MM[s.mm].map(i=>p+i)),cut=pamOK&&s.mm!=='near';
  let out=heading('Cas9 cuts only where the guide matches and a PAM follows',26);
  out+=R(x(p)-6,108,20*16+4,138,tint(C.purple,.85),C.purple,14)+TBF(x(p)-2,124,'Cas9',13,C.purple,'start');
  out+=TF(x(p+10)-8,124,'guide RNA',13,C.purple);
  for(let i=0;i<20;i++){const b=mmSet.has(p+i)?B8_swap(t[p+i]):t[p+i];out+=TMF(x(i+p)+4,152,B8_rna(b),14,mmSet.has(p+i)?C.coral:C.purple,'middle','font-weight="700"')+(mmSet.has(p+i)?L(x(i+p)+4,158,x(i+p)+4,184,C.coral,1.4):'')}
  out+=R(x(p+20)-3,180,3*16+2,50,pamOK?C.greenp:C.coralp,pamOK?C.green:C.coral,5);
  for(let i=0;i<t.length;i++){out+=TMF(x(i)+4,200,t[i],14,C.ink)+TMF(x(i)+4,222,B8_COMP[t[i]],14,C.muted)}
  out+=TF(22,200,'5′',13,C.muted,'end')+TF(22,222,'3′',13,C.muted,'end');
  out+=TF(x(p+21)+4,246,'PAM '+pam,13,pamOK?C.green:C.coral);
  if(cut){const cx=x(p+17)-4;out+=L(cx,170,cx,236,C.coral,2.4,'stroke-dasharray="4 3"')+TBF(cx,262,'cut',14,C.coral)}
  for(let i=0;i<t.length;i+=5)out+=TF(x(i)+4,96,i+1,13,C.muted);
  const lines=[`Window at base ${p+1}; the next three bases read ${pam}: ${pamOK?'a valid NGG PAM.':'not NGG, so no grip.'}`,
   s.mm==='near'?'1 mismatch next to the PAM, in the seed region: binding fails.':s.mm==='far'?'2 mismatches far from the PAM: often tolerated (off-target risk).':'Guide and DNA match at all 20 positions.',
   cut?(s.mm==='far'?'Result: still cut, so a near-match elsewhere could be cut too.':'Result: Cas9 cuts both strands three bases before the PAM.'):'Result: no cut.'];
  out+=TF(300,282,'The guide has the top strand’s sequence and pairs with the bottom strand.',13,C.muted);
  lines.forEach((l,i)=>{out+=TF(300,306+i*21,l,13,i===2?(cut?C.green:C.coral):C.ink)});
  return {svg:out,phase:cut&&s.mm==='far'?'Mismatches far from the PAM are often tolerated, so a stretch of DNA elsewhere in the genome that nearly matches the guide may be cut too: an off-target edit (Fu et al. 2013). Guides are chosen to avoid near-matches.':cut?'The guide pairs with the DNA and the PAM is present, so Cas9 makes a blunt double-strand cut. The cell then repairs the break, often imperfectly, which can knock out a gene, or copies in a supplied template.':pamOK?'The PAM is right, but a mismatch in the seed region next to the PAM stops the guide pairing there, so Cas9 lets go. Mismatches far from the PAM are tolerated much more, which is where off-target cuts come from.':'Without an NGG motif right after the matching stretch, Cas9 does not bind firmly enough to cut, however good the match. That is how bacteria avoid cutting their own CRISPR arrays.'};
 }});

/* ---- bacterial immunity: acquiring spacers ---- */
const B8_PH={A:C.coral,B:C.purple,C:C.amber};
function B8_attack(st,ph){const cells=st.cells.map(a=>a.slice()),r=B8_rng(st.seed*97+st.round*13+ph.charCodeAt(0));
 const sus=[],imm=[];cells.forEach((a,i)=>(a.includes(ph)?imm:sus).push(i));
 const lucky=new Set(shuffled(sus,B8_mix(st.seed+st.round*7+ph.charCodeAt(0))).slice(0,Math.min(sus.length,1+Math.floor(r()*2))));
 const alive=[];cells.forEach((a,i)=>{if(imm.includes(i))alive.push(a);else if(lucky.has(i))alive.push([ph].concat(a).slice(0,4))});
 const next=range(20).map(i=>alive[i%alive.length].slice());
 return {seed:st.seed,round:st.round+1,cells:next,last:{ph,died:sus.length-lucky.size,newly:lucky.size,immune:imm.length}}}
const B8_crInit=()=>({seed:3,round:0,cells:range(20).map(()=>[]),last:null});
const B8_WATCHSEQ=['A','A','B','A','B','C'];
SCENE({id:'crispr-immunity',name:'CRISPR as immune memory',tag:'Bacteria remember viruses',
 definition:'In bacteria, CRISPR is an immune system. A cell that survives a virus stores a short piece of the virus’s DNA as a spacer in its CRISPR array; the RNA copy of that spacer then guides Cas proteins to cut the same virus next time.',
 example:'Yogurt-making Streptococcus thermophilus that survived phage attack had new spacers matching the phage, and adding those spacers by hand made other cells resistant (Barrangou et al. 2007).',
 desc:'Twenty bacterial cells, each with its CRISPR array of spacers (newest on the left). A phage attack kills cells with no matching spacer; a lucky survivor stores a spacer, and its descendants inherit it.',
 research:'Ishino et al. (1987) first noticed the repeats. Mojica et al. (2005). Intervening sequences of regularly spaced prokaryotic repeats derive from foreign genetic elements. Journal of Molecular Evolution 60, 174–182. Barrangou et al. (2007). CRISPR provides acquired resistance against viruses in prokaryotes. Science 315, 1709–1712.',
 dur:12,hint:'Send in a phage. Send the same one again and see who survives. Survivor counts are illustrative.',
 init:B8_crInit,
 watch(p){let st=B8_crInit();const k=Math.min(B8_WATCHSEQ.length,Math.floor(p*(B8_WATCHSEQ.length+1)));for(let i=0;i<k;i++)st=B8_attack(st,B8_WATCHSEQ[i]);return st},
 ui:[{b:'Phage A attacks',act:'atk',arg:'A'},{b:'Phage B attacks',act:'atk',arg:'B'},{b:'Phage C attacks',act:'atk',arg:'C'}],
 on:{atk(s,v){const n=B8_attack(s,v);Object.assign(s,n);return 'keep'}},
 draw(s){
  let out=heading('Each surviving cell stores a piece of the virus',26);
  s.cells.forEach((a,i)=>{const x=34+(i%5)*62,y=52+Math.floor(i/5)*66;out+=R(x,y,54,52,C.greenp,C.green,14);
   out+=R(x+5,y+30,44,14,'#fff',C.grid,3);a.forEach((ph,j)=>{out+=R(x+7+j*11,y+32,9,10,B8_PH[ph],'none',2)})});
  out+=TF(186,334,'Each cell’s CRISPR array, newest spacer on the left',13,C.muted);
  out+=TF(186,352,'(spacer colour = the phage it came from)',13,C.muted);
  ['A','B','C'].forEach((ph,i)=>{const n=s.cells.filter(a=>a.includes(ph)).length;out+=R(368,52+i*40,18,18,B8_PH[ph],'none',4)+TF(394,66+i*40,`Phage ${ph}: ${n}/20 immune`,13,C.ink,'start')});
  const L0=s.last;
  if(L0){const lines=[`Last attack: phage ${L0.ph}`,`${L0.immune} cells already had a spacer`,'and survived.',`${L0.died} cells had none and died.`,L0.newly?`${L0.newly} survived by luck and stored`:'',L0.newly?'a new spacer from the phage.':'','The survivors then regrew to 20.'];
   lines.forEach((l,i)=>{if(l)out+=(i===0?TBF:TF)(368,186+i*19,l,i===0?14:13,i===0?B8_PH[L0.ph]:C.ink,'start')})}
  else out+=TF(368,200,'No phage yet: no spacers.',13,C.muted,'start');
  return {svg:out,phase:!L0?'The arrays start empty. Send in a phage.':L0.immune===20?'Every cell already carried a spacer against this phage, so the attack failed: the population remembers.':L0.newly&&!L0.immune?'Almost the whole population died. The few survivors stored a spacer, and because the array is in the chromosome, every descendant inherits it.':'Cells with a matching spacer cut the phage DNA and survive; the rest die unless one stores a new spacer. This heritable memory is what was later turned into the editing tool.'};
 }});

/* ---- editing people: somatic against germline ---- */
const B8_ISSUES=[
 {t:'Who is affected',som:'Only the treated patient',ger:'The child and descendants',d:{som:'Edited blood stem cells are returned to the patient; eggs and sperm are untouched, so nothing is inherited.',ger:'An edited embryo carries the change in every cell, including eggs or sperm, so it can pass down the generations.'}},
 {t:'Consent',som:'The patient can agree',ger:'Future people cannot',d:{som:'The person who bears the risk is the person who chooses the treatment.',ger:'The child, and their descendants, carry the risk without having agreed to it.'}},
 {t:'Off-target and mosaic edits',som:'Cells checked before infusion',ger:'Not ruled out (He, 2018)',d:{som:'Edited cells can be tested in the lab before they go back into the body.',ger:'Commentators on He Jiankui’s data saw unintended edits and mosaicism: not every cell carried the same change.'}},
 {t:'Medical need',som:'Severe disease, few options',ger:'Safer options existed',d:{som:'Sickle cell disease and beta-thalassaemia: the first CRISPR therapy was approved in the UK in November 2023.',ger:'The twins’ risk of HIV from their father could already be avoided by washing sperm before IVF.'}},
 {t:'Outcome',som:'Approved therapy (2023)',ger:'Condemned; jailed 2019',d:{som:'Exa-cel (Casgevy) edits a gene switch so blood cells make fetal haemoglobin again (Frangoul et al. 2021).',ger:'He Jiankui was sentenced to three years in prison; many scientists called for a moratorium on heritable editing (Lander et al. 2019).'}}];
SCENE({id:'crispr-ethics',name:'Editing people',tag:'Somatic therapy and the 2018 twins',
 definition:'Somatic gene editing changes cells in one person’s body and is not inherited. Germline editing changes an embryo, egg or sperm, so the change can pass to future generations.',
 example:'In 2018 He Jiankui announced twin girls whose embryos he had edited at the CCR5 gene. In 2023 the UK approved the first CRISPR therapy, which edits a patient’s own blood stem cells to treat sickle cell disease.',
 desc:'A three-generation family showing who carries an edit under somatic or germline editing, beside five questions that weigh the two cases.',
 research:'Cyranoski & Ledford (2018). Genome-edited baby claim provokes international outcry. Nature 563, 607–608. Frangoul et al. (2021). CRISPR-Cas9 gene editing for sickle cell disease and β-thalassemia. NEJM 384, 252–260. Lander et al. (2019). Adopt a moratorium on heritable genome editing. Nature 567, 165–168. WHO (2021). Human genome editing: a framework for governance.',
 dur:12,hint:'Switch between somatic and germline editing, then press each question to read the detail.',
 init:()=>({type:'som',open:0}),
 watch(p){return {type:p<.5?'som':'ger',open:Math.min(4,Math.floor((p%.5)*10))}},
 ui:[{choose:[['som','Somatic (a patient)'],['ger','Germline (an embryo)']],label:'Kind of edit',get:s=>s.type,act:'type'}],
 on:{type(s,v){s.type=v;return 'keep'},open(s,v){s.open=Number(v);return 'keep'}},
 draw(s,f,X){
  const ger=s.type==='ger';let out=heading(ger?'Germline: the edit can be inherited':'Somatic: the edit stays with the patient',26);
  const person=(x,y,ed,label,partial)=>Ci(x,y,17,ed?(partial?tint(C.coral,.55):C.coral):'#fff',ed?C.coral:C.blue)+TF(x,y+34,label,13,C.ink);
  out+=TF(140,56,'Who carries the edit?',13,C.muted);
  out+=person(140,90,true,ger?'edited embryo':'patient',!ger);
  if(!ger)out+=TF(140,144,'(only blood stem cells)',13,C.coral);
  out+=L(140,ger?126:152,140,172,C.line,2)+L(80,172,200,172,C.line,2)+L(80,172,80,190,C.line,2)+L(200,172,200,190,C.line,2);
  out+=person(80,208,ger,'child',false)+person(200,208,ger,'child',false);
  out+=L(80,244,80,266,C.line,2)+L(40,266,120,266,C.line,2)+L(40,266,40,282,C.line,2)+L(120,266,120,282,C.line,2);
  out+=person(40,298,ger,'grandchild',false)+person(120,298,false,'grandchild',false);
  out+=TF(140,358,ger?'Each child of a carrier may inherit it':'Children are not affected',13,ger?C.coral:C.green);
  B8_ISSUES.forEach((it,i)=>{const y=48+i*52,on=s.open===i;out+=hit(X,'open',i,`Question: ${it.t}`,R(270,y,314,46,on?C.pale:'#fff',on?C.blue:C.line,8)+TBF(280,y+19,it.t,13,C.ink,'start')+TF(280,y+37,ger?it.ger:it.som,13,ger?C.coral:C.green,'start'))});
  B8_wrap(B8_ISSUES[s.open].d[s.type],44).slice(0,3).forEach((l,i)=>{out+=TF(276,324+i*18,l,13,C.ink,'start')});
  return {svg:out,phase:ger?'Germline editing changes every cell of a future person, who cannot consent, and their descendants. In 2018 He Jiankui did this to twin girls (a third child followed), against scientific consensus; he was jailed in 2019.':'Somatic editing works like any other treatment: the patient bears the risk and benefit, and nothing is passed on. Exa-cel was approved in the UK in November 2023 and in the US the following month.'};
 }});

/* ---------------------------------------------------------------- evolution in the lab */
// Fitness relative to the ancestor: power-law shape as in Wiser, Ribeck & Lenski (2013); values approximate.
const B8_pow=g=>Math.pow(1+0.002468*g,0.11);
const B8_hyp=g=>1+0.5647*g/(g+3134);
SCENE({id:'evolution-in-the-lab',name:'The long-term evolution experiment',tag:'75,000 generations of E. coli',
 definition:'Since 24 February 1988, Richard Lenski’s team has grown twelve populations of E. coli from one ancestor, transferring 1% of each flask into fresh medium every day and freezing samples every 500 generations.',
 example:'A 1 in 100 transfer means the cells double about 6.6 times a day (log₂ 100), so 75,000 generations took roughly 30 years.',
 desc:'The daily transfer, the frozen “fossil record”, and fitness relative to the ancestor against generations, comparing a curve that keeps rising (power law) with one that levels off (hyperbola).',
 research:'Lenski, Rose, Simpson & Tadler (1991). Long-term experimental evolution in Escherichia coli. I. American Naturalist 138, 1315–1341. Wiser, Ribeck & Lenski (2013). Long-term dynamics of adaptation in asexual populations. Science 342, 1364–1367. Curves here have the published shapes; values are approximate.',
 dur:12,hint:'Move through the generations. Switch models: the data favour the power law, which never quite levels off.',
 init:()=>({g:20000,model:'both'}),
 watch(p){return {g:Math.round(p*150)*500,model:'both'}},
 ui:[{range:'g',label:'Generation',min:0,max:75000,step:500,get:s=>s.g,act:'g',show:v=>Number(v).toLocaleString('en-GB')},{choose:[['both','Both models'],['pow','Power law'],['hyp','Hyperbola']],label:'Model',get:s=>s.model,act:'model'}],
 on:{g(s,v){s.g=Number(v)},model(s,v){s.model=v}},
 draw(s){
  let out=heading('Twelve flasks, one transfer a day, since 1988',26);
  const flask=(x,y,full)=>P(`M${x-10} ${y-26} L${x-10} ${y-10} L${x-24} ${y+14} Q${x-26} ${y+20} ${x-18} ${y+20} L${x+18} ${y+20} Q${x+26} ${y+20} ${x+24} ${y+14} L${x+10} ${y-10} L${x+10} ${y-26}`,C.blue,2,full?tint(C.amber,.55):'#fff');
  out+=flask(60,80,true)+TF(60,118,'today',13,C.muted)+arrow(94,76,146,76,C.ink,2)+TF(120,66,'1%',13,C.ink)+flask(180,80,false)+TF(180,118,'tomorrow',13,C.muted);
  out+=TF(226,72,'×100 regrowth: log₂100 ≈ 6.64',13,C.ink,'start')+TF(226,90,'generations a day',13,C.ink,'start');
  const frozen=Math.floor(s.g/500);out+=R(470,50,108,62,'#eef3f6',C.grid,6)+TF(524,68,'freezer',13,C.muted);for(let i=0;i<Math.min(frozen,30);i++)out+=R(478+(i%10)*9.6,74+Math.floor(i/10)*10,6,8,C.blue,'none',1);
  out+=TF(524,126,`${frozen} samples saved`,13,C.ink);
  const pl=B8_plot(80,150,470,150,[0,75000],[1,1.8],{xt:[[0,'0'],[25000,'25,000'],[50000,'50,000'],[75000,'75,000']],yt:[[1,'1.0'],[1.2,'1.2'],[1.4,'1.4'],[1.6,'1.6'],[1.8,'1.8']],xl:'generations',xlDy:34,yl:'fitness relative to the ancestor'});
  out+=pl.svg;const pts=fn=>range(151).map(i=>[pl.X(i*500),pl.Y(fn(i*500))]);
  if(s.model!=='hyp')out+=B8_poly(pts(B8_pow),C.blue,2.6);
  if(s.model!=='pow')out+=B8_poly(pts(B8_hyp),C.coral,2.4,'stroke-dasharray="7 5"');
  out+=L(pl.X(s.g),150,pl.X(s.g),300,C.ink,1.2,'stroke-dasharray="3 3"');
  if(s.model!=='hyp')out+=Ci(pl.X(s.g),pl.Y(B8_pow(s.g)),5.5,C.blue,'#fff');
  if(s.model!=='pow')out+=Ci(pl.X(s.g),pl.Y(B8_hyp(s.g)),5,C.coral,'#fff');
  const days=s.g/Math.log2(100);
  out+=TF(90,358,'blue = power law (keeps rising)',13,C.blue,'start')+TF(550,358,'coral = hyperbola (levels off)',13,C.coral,'end');
  out+=TF(300,376,`Generation ${s.g.toLocaleString('en-GB')} ≈ ${Math.round(days).toLocaleString('en-GB')} days ≈ ${(days/365.25).toFixed(1)} years · power-law fitness ${B8_pow(s.g).toFixed(2)}`,13,C.ink);
  return {svg:out,phase:'Fitness is measured by thawing frozen cells and racing them against the ancestor. Gains were fastest early, then slowed, but did not stop: a power law fits the first 50,000 generations better than a curve with a ceiling. The populations moved to Jeffrey Barrick’s lab in 2022.'};
 }});

/* ---- citrate: a rare innovation and its history ---- */
const B8_REPLAY=[0,10000,20000,25000,30000,32000];
const B8_repP=g=>g<20000?0:g<30000?.06:.12;
function B8_runReplays(g,seed,n){const r=B8_rng(seed*1009+g);let k=0;for(let i=0;i<n;i++)if(r()<B8_repP(g))k++;return k}
const B8_watchRuns=k=>{const runs={};for(let i=0;i<k&&i<B8_REPLAY.length;i++){const g=B8_REPLAY[i];runs[g]=[B8_runReplays(g,4,40),40]}return runs};
SCENE({id:'evolution-in-the-lab-citrate',name:'Citrate: a rare innovation',tag:'Replaying the tape',
 definition:'Around generation 31,500, one of the twelve populations (Ara−3) evolved the ability to use citrate in the medium in the presence of oxygen, something E. coli normally cannot do. Replays from frozen samples showed that earlier mutations had to come first.',
 example:'Replays started from Ara−3 clones frozen before generation 20,000 never re-evolved citrate use; some replays from later clones did. The population’s history had made the innovation possible.',
 desc:'A timeline of the Ara−3 population with its three steps (potentiation, actualisation, refinement), and replay experiments started from frozen samples of different ages, with the share that evolved citrate use.',
 research:'Blount, Borland & Lenski (2008). Historical contingency and the evolution of a key innovation in an experimental population of Escherichia coli. PNAS 105, 7899–7906. Blount et al. (2012). Genomic analysis of a key innovation in an experimental Escherichia coli population. Nature 489, 513–518. Replay success rates here are illustrative.',
 dur:12,hint:'Choose which generation’s frozen sample to start from, then run 40 replays. Samples from early generations never get there; later ones sometimes do.',
 init:()=>({g:20000,runs:{},seed:4}),
 watch(p){return {g:B8_REPLAY[Math.min(5,Math.floor(p*6))],runs:B8_watchRuns(Math.floor(p*7)),seed:4}},
 ui:[{choose:B8_REPLAY.map(g=>[String(g),'Gen '+g.toLocaleString('en-GB')]),label:'Start replays from',get:s=>String(s.g),act:'g'},{b:'Run 40 replays',act:'run'}],
 on:{g(s,v){s.g=Number(v);return 'keep'},run(s){const old=s.runs[s.g]||[0,0];s.seed=nextSeed()%100000+1;s.runs={...s.runs,[s.g]:[old[0]+B8_runReplays(s.g,s.seed,40),old[1]+40]};return 'keep'}},
 draw(s){
  let out=heading('Ara−3: how history made an innovation possible',26);
  const tx=g=>40+g/35000*240;out+=L(40,96,280,96,C.ink,2);
  [[0,'0'],[10000,'10k'],[20000,'20k'],[30000,'30k']].forEach(([g,l])=>{out+=L(tx(g),92,tx(g),100,C.ink,1.5)+TF(tx(g),116,l,13,C.muted)});
  out+=R(tx(20000),78,tx(31500)-tx(20000),12,C.amberp,'none',3)+TF(tx(25000),70,'potentiating mutations',13,C.amber);
  out+=Ci(tx(31500),96,6,C.coral)+TF(tx(31500)+8,138,'31,500: weak citrate use',13,C.coral,'end');
  out+=Ci(tx(33000),96,6,C.green)+TF(tx(33000)+8,156,'33,000: takes over',13,C.green,'end');
  [['1. Potentiation',184],['earlier mutations set the stage',201],['2. Actualisation',226],['a duplication moves citT next to',243],['an active promoter',260],['3. Refinement',285],['later mutations improve it',302],['(Blount et al. 2008, 2012)',330]].forEach(([t,y],i)=>{out+=(/^\d/.test(t)?TBF:TF)(40,y,t,13,/^\d/.test(t)?C.ink:C.muted,'start')});
  const bx=330,bw=40,base=290,H=170;out+=TF(455,56,'Replays that evolved citrate use',13,C.ink);
  out+=L(bx-6,base,bx+6*42,base,C.ink,1.5)+L(bx-6,base,bx-6,base-H,C.line,1)+TF(bx-10,base-H+5,'25%',13,C.muted,'end')+TF(bx-10,base+5,'0',13,C.muted,'end');
  B8_REPLAY.forEach((g,i)=>{const x=bx+i*42,r=s.runs[g],sel=g===s.g;out+=R(x,base-H,bw-4,H,sel?C.pale:'#f6f9fb','none',3);
   if(r&&r[1]){const fr=r[0]/r[1];out+=R(x,base-Math.min(1,fr/.25)*H,bw-4,Math.min(1,fr/.25)*H,C.green,'none',3)+TF(x+(bw-4)/2,base-H-6,`${r[0]}/${r[1]}`,13,C.ink)}
   out+=TF(x+(bw-4)/2,base+18,g?(g/1000)+'k':'0',13,sel?C.blue:C.muted)});
  out+=TF(455,base+38,'frozen sample’s generation',13,C.muted);
  const r=s.runs[s.g];out+=TF(300,366,r?`From generation ${s.g.toLocaleString('en-GB')}: ${r[0]} of ${r[1]} replays evolved citrate use.`:'Run replays from the chosen sample.',13,C.ink);
  return {svg:out,phase:'Gould asked what would happen if the tape of life were replayed. Here it was: from early samples citrate use never re-appeared; from later ones it sometimes did. Chance mutations around generation 20,000 had potentiated the innovation. The replay rates shown are illustrative; the published pattern is that only later samples succeeded.'};
 }});

/* ---- parallel and unique changes across the twelve populations ---- */
const B8_POPS=['Ara−1','Ara−2','Ara−3','Ara−4','Ara−5','Ara−6','Ara+1','Ara+2','Ara+3','Ara+4','Ara+5','Ara+6'];
const B8_TRAITS={
 fit:{n:'Faster growth on glucose',on:B8_POPS,src:'All 12 (Lenski et al. 1991; Wiser et al. 2013)'},
 size:{n:'Larger cells',on:B8_POPS,src:'All 12 (Lenski & Travisano 1994)'},
 rbs:{n:'Lost the use of ribose',on:B8_POPS,src:'All 12, by deletions (Cooper et al. 2001)'},
 mut:{n:'Became mutators',on:['Ara−1','Ara−2','Ara−3','Ara−4','Ara+3','Ara+6'],src:'6 of 12 by 50,000 generations (Tenaillon et al. 2016)'},
 cit:{n:'Use citrate',on:['Ara−3'],src:'1 of 12 (Blount et al. 2008)'}};
SCENE({id:'evolution-in-the-lab-parallel',name:'Same start, twelve histories',tag:'Repeatable and unique changes',
 definition:'Because all twelve populations started from the same ancestor in the same conditions, the experiment shows which changes evolution repeats and which happen only once.',
 example:'All twelve populations evolved larger cells and lost the ability to use ribose; only one evolved citrate use.',
 desc:'The twelve populations as tiles. Choosing a trait lights the populations that evolved it, with the published count.',
 research:'Lenski & Travisano (1994). Dynamics of adaptation and diversification. PNAS 91, 6808–6814. Cooper, Schneider, Blot & Lenski (2001). Journal of Bacteriology 183, 2834–2841. Tenaillon et al. (2016). Tempo and mode of genome evolution in a 50,000-generation experiment. Nature 536, 165–170.',
 dur:10,hint:'Choose a trait to see which populations evolved it.',
 init:()=>({tr:'size'}),
 watch(p){return {tr:Object.keys(B8_TRAITS)[Math.min(4,Math.floor(p*5))]}},
 ui:[{choose:Object.keys(B8_TRAITS).map(k=>[k,B8_TRAITS[k].n]),label:'Trait',get:s=>s.tr,act:'tr'}],
 on:{tr(s,v){s.tr=v;return 'keep'}},
 draw(s){
  const T0=B8_TRAITS[s.tr];let out=heading(T0.n,26);
  B8_POPS.forEach((n,i)=>{const x=40+(i%6)*88,y=58+Math.floor(i/6)*72,on=T0.on.includes(n);out+=R(x,y,80,60,on?C.green:'#fff',on?C.green:C.line,10)+TBF(x+40,y+36,n,14,on?'#fff':C.muted)});
  out+=TB(300,234,`${T0.on.length} of 12 populations`,17,T0.on.length===12?C.green:T0.on.length===1?C.coral:C.amber);
  out+=TF(300,258,T0.src,13,C.muted);
  ['Parallel changes (all 12) suggest strong, predictable selection.','A change in only one population points to chance and history.','Mutators copy DNA less accurately: mutation rates rose roughly 100-fold.'].forEach((l,i)=>{out+=TF(300,300+i*22,l,13,C.ink)});
  return {svg:out,phase:T0.on.length===12?'Every population found this change on its own: evolution in identical conditions was partly repeatable, even though the exact mutations differed.':T0.on.length===1?'Only one population in over 75,000 generations: a rare innovation that depended on that population’s particular history.':'About half the populations evolved a higher mutation rate, carried along with beneficial mutations it helped produce.'};
 }});

/* ---------------------------------------------------------------- antibiotic resistance */
// Pharmacodynamic net growth (Regoes et al. 2004): psi(a) = psiMax − (psiMax − psiMin)·x^k / (x^k − psiMin/psiMax), x = a/MIC.
const B8_psi=(x,pmax,pmin=-3,k=2)=>pmax-(pmax-pmin)*Math.pow(x,k)/(Math.pow(x,k)-pmin/pmax);
const B8_DOSES=[.25,.5,1,2,4,8,16,32];
function B8_treat(dose,dur){const K=1e10,dt=.05;let S=1e8,R=10;const out=[];for(let t=0;t<=72+1e-9;t+=dt){if(Math.abs(t/1-Math.round(t))<1e-6)out.push([Math.round(t),S,R]);
  const c=t<dur?dose:0,gs=B8_psi(c,.8),gr=B8_psi(c/8,.7),N=S+R,cap=Math.max(0,1-N/K);
  S+=S*(gs>0?gs*cap:gs)*dt;R+=R*(gr>0?gr*cap:gr)*dt;if(S<1)S=0;if(R<1)R=0}
 return out}
SCENE({id:'antibiotic-resistance',name:'Antibiotic resistance',tag:'The mutant selection window',
 definition:'Antibiotic resistance evolves by natural selection: a drug kills susceptible bacteria and leaves resistant ones to grow. Doses between the levels that stop the susceptible and the resistant strains select for resistance most strongly.',
 example:'With a resistant mutant whose MIC is eight times higher, a dose of four times the normal MIC kills the susceptible cells and lets the resistant ones take over.',
 desc:'Counts of susceptible (blue) and resistant (coral) bacteria over three days of treatment on a log scale, with a dose strip showing the mutant selection window between the two strains’ MICs.',
 research:'Fleming (1945). Penicillin. Nobel lecture (warned that too little drug breeds resistance). Drlica (2003). The mutant selection window and antimicrobial resistance. Journal of Antimicrobial Chemotherapy 52, 11–17. Regoes et al. (2004). Antimicrobial Agents and Chemotherapy 48, 3670–3676. Gullberg et al. (2011). Selection of resistant bacteria at very low antibiotic concentrations. PLoS Pathogens 7, e1002158.',
 dur:12,hint:'Change the dose (in multiples of the susceptible strain’s MIC) and how long treatment lasts. Rates are illustrative.',
 init:()=>({di:4,dur:24}),
 watch(p){return {di:Math.min(7,Math.floor(p*8)),dur:24}},
 ui:[{range:'di',label:'Dose',min:0,max:7,get:s=>s.di,act:'di',show:v=>B8_DOSES[v]+' × MIC'},{range:'dur',label:'Treatment length',min:6,max:48,step:6,get:s=>s.dur,act:'dur',show:v=>v+' h'}],
 on:{di(s,v){s.di=Number(v)},dur(s,v){s.dur=Number(v)}},
 draw(s){
  const dose=B8_DOSES[s.di],tr=B8_treat(dose,s.dur),lg=v=>v>0?Math.log10(v):-1;
  const pl=B8_plot(70,56,320,180,[0,72],[0,10],{xt:[[0,'0'],[24,'24'],[48,'48'],[72,'72 h']],yt:[[0,'1'],[4,'10⁴'],[8,'10⁸'],[10,'10¹⁰']],xl:'hours',xlDy:34,yl:'bacteria (log scale)'});
  let out=heading('Who survives the drug?',26)+pl.svg+R(pl.X(0),56,pl.X(s.dur)-pl.X(0),180,tint(C.amber,.82),'none',0)+TF(pl.X(s.dur/2),74,'drug on',13,C.amber);
  out+=B8_poly(tr.filter(d=>d[1]>0).map(d=>[pl.X(d[0]),pl.Y(lg(d[1]))]),C.blue,2.6)+B8_poly(tr.filter(d=>d[2]>0).map(d=>[pl.X(d[0]),pl.Y(lg(d[2]))]),C.coral,2.6);
  const end=tr[tr.length-1],tot=end[1]+end[2],share=tot?end[2]/tot:0;
  const verdict=tot===0?['Both strains cleared.','The dose was above the','resistant strain’s MIC.']:share>.5?['Resistant cells took over.','The dose sat inside the','mutant selection window.']:share>.001?['Resistant cells gained','ground but are a minority.','']:['Susceptible cells won.','Too little drug to select','strongly for resistance.'];
  out+=TBF(408,80,'After 72 hours',14,C.ink,'start');
  out+=TF(408,104,`resistant share: ${tot?(share*100<0.1?'<0.1':(share*100).toFixed(share>.1?0:1))+'%':'–'}`,13,C.ink,'start');
  verdict.forEach((l,i)=>{if(l)out+=TF(408,136+i*19,l,13,share>.5?C.coral:tot===0?C.green:C.ink,'start')});
  out+=TF(408,206,'blue = susceptible',13,C.blue,'start')+TF(408,225,'coral = resistant',13,C.coral,'start')+TF(408,244,'(its MIC is 8× higher)',13,C.coral,'start');
  const dx=v=>70+(Math.log2(v)+2)/7*480;out+=TF(70,292,'dose (× MIC of the susceptible strain)',13,C.muted,'start');
  out+=R(dx(1),314,dx(8)-dx(1),16,C.coralp,'none',3)+TF((dx(1)+dx(8))/2,348,'mutant selection window',13,C.coral)+L(70,330,550,330,C.ink,1.5);
  B8_DOSES.forEach(v=>{out+=L(dx(v),326,dx(v),334,C.ink,1.2)+TF(dx(v),368,String(v),13,C.muted)});
  out+=P(`M${fmt(dx(dose))} 312 l-7 -9 h14 z`,C.blue,1,C.blue);
  const enriched=tot>0&&share>1e-7*1.5;
  return {svg:out,phase:dose<1&&!enriched?'At this very low dose the susceptible cells still grow faster than the resistant ones, which pay a cost for resistance, so resistance does not spread.':dose<1?'Below the MIC the drug only slows the susceptible cells, yet the resistant ones are slowed less, so even low doses can enrich resistance (Gullberg et al. 2011).':dose<=8?'Inside the window the drug kills the susceptible majority but cannot stop the rare resistant mutants, which then inherit the empty space.':'Above the resistant strain’s MIC both are killed. How long a course should run is debated: shorter courses are often as effective (Llewelyn et al. 2017).'};
 }});

/* ---- the MEGA-plate ---- */
const B8_BANDS=['0','3','30','300','3,000'];
function B8_mega(supply){const r=B8_rng(31+supply*7),mean=[3.6,2.2,1.3][supply],lanes=[];
 for(let l=0;l<12;l++){const arr=[0];let t=.9;for(let b=1;b<5;b++){t+=.9+(-Math.log(1-r()*.98))*mean;arr.push(t)}lanes.push(arr)}
 return lanes}
SCENE({id:'antibiotic-resistance-megaplate',name:'The MEGA-plate',tag:'Watching resistance spread',
 definition:'The MEGA-plate is a giant dish of agar with bands of rising antibiotic concentration. Bacteria spread from the drug-free edges and can enter each stronger band only after a mutant arises that tolerates it.',
 example:'E. coli crossed from no trimethoprim to a band with 3,000 times the wild type’s MIC in about eleven days, step by step.',
 desc:'Half of a MEGA-plate with five bands (0 to 3,000 times the MIC) and twelve lanes of advancing bacteria. Each lane pauses at a band edge until a resistant mutant appears, then moves on.',
 research:'Baym, Lieberman, Kelsic, Chait, Gross, Yelin & Kishony (2016). Spatiotemporal microbial evolution on antibiotic landscapes. Science 353, 1147–1151. Waiting times here are illustrative, drawn from a seeded model.',
 dur:12,hint:'Move the day slider. Raise the mutation supply and resistance spreads sooner.',
 init:()=>({day:6,sup:1}),
 watch(p){return {day:Math.round(p*140)/10,sup:1}},
 ui:[{range:'day',label:'Day',min:0,max:14,step:.5,get:s=>s.day,act:'day'},{choose:[['0','Low'],['1','Medium'],['2','High']],label:'Mutation supply',get:s=>String(s.sup),act:'sup'}],
 on:{day(s,v){s.day=Number(v)},sup(s,v){s.sup=Number(v)}},
 draw(s){
  const lanes=B8_mega(s.sup),x0=40,bw=104,y0=74,lh=14;let out=heading('Bacteria advancing into stronger antibiotic',26);
  B8_BANDS.forEach((b,i)=>{out+=R(x0+i*bw,y0,bw,12*lh+8,tint(C.amber,.92-i*.17),'none',0)+TBF(x0+i*bw+bw/2,y0-10,b+'×',13,C.ink)});
  out+=TF(300,48,'trimethoprim, in multiples of the wild type’s MIC',13,C.muted);
  const first=[0,1e9,1e9,1e9,1e9];
  lanes.forEach((arr,l)=>{let b=0;for(let k=1;k<5;k++){if(arr[k]<=s.day)b=k;first[k]=Math.min(first[k],arr[k])}
   const tIn=s.day-arr[b],front=x0+b*bw+bw*clamp(tIn/.9,0,1);
   for(let k=0;k<=b;k++){const xa=x0+k*bw,xb=k<b?x0+(k+1)*bw:front;if(xb>xa)out+=R(xa,y0+4+l*lh,xb-xa,lh-3,[C.blue,C.green,C.purple,C.coral,C.ink][k],'none',2)}});
  out+=TF(300,y0+12*lh+28,'colour = the resistance level of the cells at that spot',13,C.muted);
  out+=TF(40,296,'First lane to reach each band (day):',13,C.ink,'start');
  for(let k=1;k<5;k++){const d=first[k];out+=TF(x0+k*bw+bw/2,318,d<=s.day?d.toFixed(1):'–',14,d<=s.day?C.ink:C.muted)}
  out+=TF(300,350,`Day ${s.day}. In the real plate, E. coli reached the 3,000× band in about 11 days.`,13,C.ink);
  return {svg:out,phase:'Each band is a barrier until a mutant that can grow there appears at the front. Resistance rose in steps, not all at once, and the most resistant lineages were not always the ones in front. Spatial gradients like these, inside bodies or in the environment, can speed up resistance.'};
 }});

/* ---- a history of resistance ---- */
const B8_HIST=[
 {n:'Penicillin',a:1943,b:1940,aL:'mass use 1943',bL:'penicillinase 1940',d:'Abraham and Chain described a bacterial enzyme that destroys penicillin in 1940, before the drug was in wide use.'},
 {n:'Methicillin',a:1960,b:1961,aL:'introduced 1960',bL:'MRSA 1961',d:'Resistant Staphylococcus aureus (MRSA) was reported in the UK within about a year (Jevons 1961).'},
 {n:'Vancomycin',a:1958,b:1988,aL:'introduced 1958',bL:'VRE 1988',d:'Resistant enterococci were reported in 1988, about thirty years on; resistant S. aureus followed in 2002.'},
 {n:'Colistin',a:1959,b:2015,aL:'introduced 1959',bL:'mcr-1 2015',d:'A last-resort drug: a transferable resistance gene, mcr-1, was found in China in 2015 (Liu et al. 2016).'},
 {n:'Artemisinin',a:1972,b:2008,aL:'Tu Youyou 1972',bL:'partial 2008',d:'Tu Youyou’s malaria drug (Nobel Prize 2015). Partial resistance was reported in western Cambodia in 2008–9 (Dondorp et al. 2009).'}];
SCENE({id:'antibiotic-resistance-history',name:'Every drug, then resistance',tag:'From penicillin to colistin',
 definition:'For every antibiotic in wide use so far, resistance has eventually been reported: sometimes within a year, sometimes only after decades. Use did not invent it: resistance genes are often far older, some recovered from 30,000-year-old permafrost. Clinical use selects them and spreads them. Fleming warned of this in his 1945 Nobel lecture.',
 example:'Methicillin was introduced in 1960; resistant Staphylococcus aureus (MRSA) was reported in 1961.',
 desc:'A timeline for five drugs, each with the year it came into use (blue) and the year resistance was reported (coral). Press a drug for details.',
 research:'Fleming (1945). Penicillin. Nobel lecture. Abraham & Chain (1940). Nature 146, 837. Jevons (1961). BMJ 1, 124–125. D’Costa, V. M. et al. (2011). Antibiotic resistance is ancient. Nature 477, 457–461. Liu et al. (2016). Lancet Infectious Diseases 16, 161–168. Dondorp et al. (2009). NEJM 361, 455–467. Murray et al. (2022). Global burden of bacterial antimicrobial resistance in 2019. Lancet 399, 629–655.',
 dur:10,hint:'Press a drug to read when, and how, resistance appeared.',
 init:()=>({pick:0}),
 watch(p){return {pick:Math.min(4,Math.floor(p*5))}},
 ui:[],
 on:{pick(s,v){s.pick=Number(v);return 'keep'}},
 draw(s,f,X){
  const tx=y=>150+(y-1935)/90*420;let out=heading('Drug introduced, then resistance reported',26);
  [1940,1960,1980,2000,2020].forEach(y=>{out+=L(tx(y),48,tx(y),282,C.grid,1)+TF(tx(y),300,y,13,C.muted)});
  B8_HIST.forEach((h,i)=>{const y=66+i*46,on=s.pick===i;out+=hit(X,'pick',i,`About ${h.n}`,R(20,y-16,118,30,on?C.pale:'#fff',on?C.blue:C.line,6)+TBF(79,y+4,h.n,13,C.ink));
   out+=L(tx(h.a),y,tx(h.b),y,on?C.ink:C.line,on?3:2)+Ci(tx(h.a),y,6,C.blue)+Ci(tx(h.b),y,6,C.coral);
   if(on){const lab=h.b<h.a?`${h.bL}, before ${h.aL}`:`${h.aL} → ${h.bL}`,w=lab.length*7,mid=clamp((tx(h.a)+tx(h.b))/2,150+w/2,570-w/2);out+=TF(mid,y-12,lab,13,C.ink)}});
  out+=TF(150,326,'blue = into use · coral = resistance reported',13,C.muted,'start');
  const d=B8_HIST[s.pick].d,cut=d.length>80?d.lastIndexOf(' ',80):-1;out+=TF(300,350,cut>0?d.slice(0,cut):d,13,C.ink)+(cut>0?TF(300,368,d.slice(cut+1),13,C.ink):'');
  return {svg:out,phase:'Resistance genes are often older than the drugs (they evolved among soil microbes making antibiotics) and can jump between species on plasmids. In 2019 bacterial resistance directly caused an estimated 1.27 million deaths worldwide (Murray et al. 2022).'};
 }});

/* ---------------------------------------------------------------- origins of life */
const B8_AA=[['Glycine',1],['Alanine',.6],['Aspartic acid',.18],['Glutamic acid',.1]];
SCENE({id:'origins-of-life',name:'The Miller–Urey experiment',tag:'Sparks in a flask of gases',
 definition:'In 1953 Stanley Miller, working with Harold Urey, sent electric sparks through methane, ammonia, hydrogen and water vapour, and found amino acids, the building blocks of proteins, collecting in the water within a week.',
 example:'Re-analysing Miller’s stored vials in 2008 with modern instruments found more than twenty amino acids in his “volcanic” version of the experiment.',
 desc:'Miller’s apparatus: boiling water, a flask of gases with electrodes, a condenser and a trap that darkens as products collect. Bars show relative amounts of four amino acids for the chosen gases and number of days.',
 research:'Miller (1953). A production of amino acids under possible primitive Earth conditions. Science 117, 528–529. Johnson et al. (2008). The Miller volcanic spark discharge experiment. Science 322, 404. Cleaves et al. (2008). Origins of Life and Evolution of Biospheres 38, 105–115 (neutral gases give much less unless buffered). Relative amounts here are illustrative.',
 dur:12,hint:'Switch the spark on, run some days, then try the neutral gases that geologists now think more likely.',
 init:()=>({gas:'red',spark:'on',day:7}),
 watch(p){return {gas:p<.7?'red':'neu',spark:'on',day:p<.7?Math.round(p/.7*7):7}},
 ui:[{choose:[['red','Reducing: CH₄, NH₃, H₂'],['neu','Neutral: CO₂, N₂']],label:'Gases',get:s=>s.gas,act:'gas'},{choose:[['on','Spark on'],['off','Spark off']],label:'Spark',get:s=>s.spark,act:'spark'},{range:'day',label:'Days',min:0,max:7,get:s=>s.day,act:'day'}],
 on:{gas(s,v){s.gas=v},spark(s,v){s.spark=v},day(s,v){s.day=Number(v)}},
 draw(s){
  const on=s.spark==='on',amt=on?(1-Math.exp(-s.day/2.2))*(s.gas==='red'?1:.06):0;let out=heading('Miller’s apparatus (1953)',26);
  out+=P('M90 262 L90 70 L196 70',C.ink,2.5)+P('M286 120 L300 120 L300 300 L246 300',C.ink,2.5)+P('M196 300 L128 300',C.ink,2.5);
  out+=Ci(220,118,58,'#f3f7fa',C.ink)+TF(220,104,s.gas==='red'?'CH₄  NH₃':'CO₂  N₂',13,C.ink)+TF(220,124,s.gas==='red'?'H₂  H₂O':'H₂O',13,C.ink);
  out+=L(176,150,196,140,C.muted,2.5)+L(264,150,244,140,C.muted,2.5);
  if(on)out+=P('M198 140 L208 132 L214 144 L224 134 L230 146 L242 140',C.amber,2.2);
  out+=R(290,180,20,80,'#e6eff5',C.blue,6)+TF(282,224,'condenser',13,C.blue,'end');
  const tr=tint('#8a5a2b',1-Math.min(1,amt*1.2)*.75);out+=P('M196 270 L196 300 Q221 326 246 300 L246 270',C.ink,2.5)+P('M200 296 Q221 318 242 296 Z',tr,1,tr)+TF(221,340,'trap',13,C.ink);
  out+=Ci(90,290,34,'#e6eff5',C.ink)+R(62,290,56,22,C.pale,'none',4)+TF(90,348,'boiling water',13,C.ink)+P('M78 334 Q84 324 90 334 Q96 324 102 334',C.coral,2);
  out+=TF(463,60,'Amino acids in the trap',13,C.ink);
  B8_AA.forEach(([n,v],i)=>{const y=84+i*44,w=amt*v*150;out+=TF(388,y+14,n,13,C.ink,'start')+R(388,y+20,150,12,'#f1f5f7','none',3)+R(388,y+20,w,12,C.green,'none',3)});
  out+=TF(470,272,on?`Day ${s.day} of 7`:'No spark: no energy, no products',13,on?C.ink:C.coral);
  out+=TF(470,292,'bar lengths are illustrative',13,C.muted);
  if(s.gas==='red')out+=TF(470,330,'Glycine and alanine were',13,C.ink)+TF(470,348,'the most abundant.',13,C.ink);
  else out+=TF(470,330,'Far less from neutral gases',13,C.coral);
  return {svg:out,phase:s.gas==='red'?'Energy from the sparks breaks the gases into reactive fragments that recombine in the water as amino acids. It showed that some building blocks of life form readily, but not how they joined into proteins or cells.':'Geologists now think the early atmosphere was mostly carbon dioxide and nitrogen. Sparks then make far fewer amino acids, unless the water is buffered against acids (Cleaves et al. 2008). Meteorites and vents are other possible sources.'};
 }});

/* ---- the RNA world: Eigen's error threshold ---- */
const B8_master=(mu,L,sig)=>{const Q=Math.pow(1-mu,L);return Math.max(0,(sig*Q-1)/(sig-1))};
SCENE({id:'origins-of-life-rna-world',name:'The RNA world',tag:'Copying without errors',
 definition:'The RNA-world idea is that early life used RNA both to carry information and to catalyse reactions, before DNA and proteins took over. Any copier faces Eigen’s error threshold: too many copying errors per molecule and the information melts away.',
 example:'With one error in every 100 bases copied and a hundredfold growth advantage, Eigen’s threshold is about ln 100 ÷ 0.01 ≈ 460 bases; a bigger advantage helps only slowly, because it enters as a logarithm. DNA with repair keeps millions.',
 desc:'Eigen’s quasispecies model: the share of perfect copies of a “master” sequence as its length grows, for a chosen error rate and growth advantage. Beyond the threshold length the share drops to zero (error catastrophe).',
 research:'Eigen (1971). Selforganization of matter and the evolution of biological macromolecules. Naturwissenschaften 58, 465–523. Kruger et al. (1982) and Guerrier-Takada et al. (1983) found RNA enzymes (ribozymes). Gilbert (1986). The RNA world. Nature 319, 618. Johnston et al. (2001). RNA-catalyzed RNA polymerization. Science 292, 1319–1325.',
 dur:12,hint:'Raise the error rate and the longest sequence that survives shrinks. Turn the view to 3D to see the whole landscape.',
 init:()=>({mu:-2,L:2,sig:10}),
 watch(p){return {mu:-1-p*4,L:2,sig:10}},
 ui:[{range:'mu',label:'Errors per base (log₁₀)',min:-6,max:-1,step:.1,get:s=>s.mu,act:'mu',show:v=>'1 in '+Math.round(Math.pow(10,-v)).toLocaleString('en-GB')},{range:'L',label:'Sequence length (log₁₀)',min:1,max:5,step:.1,get:s=>s.L,act:'L',show:v=>Math.round(Math.pow(10,v)).toLocaleString('en-GB')+' bases'},{range:'sig',label:'Growth advantage σ',min:2,max:50,get:s=>s.sig,act:'sig'}],
 on:{mu(s,v){s.mu=Number(v)},L(s,v){s.L=Number(v)},sig(s,v){s.sig=Number(v)}},
 draw(s){
  const mu=Math.pow(10,s.mu),Lm=Math.log(s.sig)/mu,cur=B8_master(mu,Math.pow(10,s.L),s.sig);
  const pl=B8_plot(80,56,300,200,[1,5],[0,1],{xt:[[1,'10'],[2,'100'],[3,'1,000'],[4,'10⁴'],[5,'10⁵']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'sequence length (bases, log scale)',xlDy:34,yl:'share of perfect copies'});
  let out=heading('Eigen’s error threshold',26)+pl.svg;
  out+=B8_poly(range(161).map(i=>{const l=1+i/40;return [pl.X(l),pl.Y(B8_master(mu,Math.pow(10,l),s.sig))]}),C.blue,2.6);
  const lx=Math.log10(Lm);if(lx>=1&&lx<=5)out+=L(pl.X(lx),56,pl.X(lx),256,C.coral,1.8,'stroke-dasharray="6 4"');
  out+=Ci(pl.X(s.L),pl.Y(cur),6,cur>0?C.blue:C.coral,'#fff');
  out+=TBF(400,74,'Threshold length',14,C.ink,'start')+TF(400,94,'L ≈ ln σ ÷ error rate',13,C.muted,'start')+TBF(400,118,Math.round(Lm).toLocaleString('en-GB')+' bases',15,C.coral,'start');
  out+=TBF(400,156,'At your length',14,C.ink,'start')+TF(400,176,`perfect copies: ${(cur*100).toFixed(cur>0&&cur<.1?1:0)}%`,13,C.ink,'start')+TF(400,195,cur>0?'information is kept':'error catastrophe:',13,cur>0?C.green:C.coral,'start')+TF(400,213,cur>0?'':'the sequence is lost',13,C.coral,'start');
  out+=TF(80,316,'Error rates, roughly: early RNA-copying ribozymes, a few per 100 bases;',13,C.ink,'start');
  out+=TF(80,334,'RNA viruses about 1 in 10,000 (genomes ~10,000 bases, near the limit);',13,C.ink,'start');
  out+=TF(80,352,'DNA copying with proofreading and repair, below 1 in 1,000,000,000.',13,C.ink,'start');
  out+=TF(80,372,'The dashed line marks the threshold for the current error rate.',13,C.muted,'start');
  return {svg:out,phase:`At ${Math.round(1/mu).toLocaleString('en-GB')} bases per error and advantage σ = ${s.sig}, information survives up to about ${Math.round(Lm).toLocaleString('en-GB')} bases. Longer genomes need more accurate copying, but accurate copying needs the enzymes a longer genome encodes: Eigen’s paradox, still unsolved.`};
 },
 three(s,f,X,project){
  const P3=project([0,5,0,4,0,3.8]),Z=(u,v)=>B8_master(Math.pow(10,-6+u),Math.pow(10,1+v),s.sig)*3.6;let out='';
  for(let j=0;j<=16;j++){const v=j/4;const pts=range(26).map(i=>[i/5,v,Z(i/5,v)]);for(let i=0;i<25;i++)out+=line3(pts[i],pts[i+1],P3,C.line,1.1)}
  for(let i=0;i<=20;i++){const u=i/4;const pts=range(33).map(j=>[u,j/8,Z(u,j/8)]);for(let j=0;j<32;j++)out+=line3(pts[j],pts[j+1],P3,C.grid,1)}
  const u=s.mu+6,v=s.L-1;out+=point3([u,v,Z(u,v)],P3,C.coral,7,'#fff');
  out+=axes3(P3,['errors per base (log)','length (log)','perfect copies'],[5.4,4.4,4]);
  return {svg:out,title:'The error-threshold landscape',caption:'Height is the share of perfect copies. It falls to zero along a ridge where length × error rate passes ln σ: a cliff that any early replicator had to stay behind.'};
 }});

/* ---- vents or ponds ---- */
const B8_HYP=[
 {r:'Energy source',v:'proton gradients',p:'UV, heat, lightning',d:'Alkaline vent fluid (pH about 9–11) meets more acidic seawater across thin mineral walls: a natural proton gradient, like the one cells use to make ATP.'},
 {r:'Concentrating',v:'in mineral pores',p:'by drying out',d:'Both settings can concentrate dilute molecules: vents in their porous walls, ponds as the water evaporates.'},
 {r:'Making chains',v:'hard in water',p:'wet–dry cycles help',d:'Joining building blocks into chains releases water, so it is hard in water; repeated drying and wetting drives the joining in lab experiments.'},
 {r:'Link to cells',v:'like chemiosmosis',p:'membranes form',d:'Vents mirror how all cells make energy; ponds favour the self-assembly of fatty-acid membranes found in lab studies.'},
 {r:'Main doubt',v:'little lab support',p:'needs dry land',d:'Making key molecules in vent-like reactors has proved hard; ponds need land above the early ocean, which is uncertain.'}];
SCENE({id:'origins-of-life-vents',name:'Where did life begin?',tag:'Deep-sea vents or warm little ponds',
 definition:'How life began is an open question. Two leading settings are alkaline hydrothermal vents on the sea floor, with natural energy gradients, and shallow ponds on land, where drying and wetting concentrate molecules and join them into chains.',
 example:'The Lost City vent field, found in 2000, vents warm alkaline fluid through towers of carbonate rock, the kind of setting proposed for life’s start.',
 desc:'A sketch of each setting beside a five-row comparison of what each explains well and where it struggles. Press a row for detail.',
 research:'Kelley et al. (2001). An off-axis hydrothermal vent field near the Mid-Atlantic Ridge at 30° N. Nature 412, 145–149. Lane & Martin (2012). The origin of membrane bioenergetics. Cell 151, 1406–1416. Darwin (1871), letter to J. D. Hooker (“warm little pond”). Damer & Deamer (2020). Astrobiology 20, 429–452. Patel et al. (2015). Nature Chemistry 7, 301–307.',
 dur:12,hint:'Switch between the two settings and press each row to compare them. Neither has made life in a lab.',
 init:()=>({h:'vent',row:0}),
 watch(p){return {h:p<.5?'vent':'pond',row:Math.min(4,Math.floor((p%.5)*10))}},
 ui:[{choose:[['vent','Alkaline vent'],['pond','Warm little pond']],label:'Setting',get:s=>s.h,act:'h'}],
 on:{h(s,v){s.h=v;return 'keep'},row(s,v){s.row=Number(v);return 'keep'}},
 draw(s,f,X){
  const vent=s.h==='vent';let out=heading('Two candidate cradles for life',26);
  if(vent){out+=R(20,48,250,250,'#dbe9f2','none',8)+TF(145,68,'sea water, pH about 6 (est.)',13,C.blue);
   out+=P('M100 298 L112 150 Q120 120 130 150 L142 230 L152 170 Q160 140 170 170 L184 298 Z',C.muted,2,'#e9e4da');
   out+=P('M121 290 L121 170',C.amber,3,'none','stroke-dasharray="5 5"')+P('M161 290 L161 190',C.amber,3,'none','stroke-dasharray="5 5"');
   out+=TF(145,316,'vent fluid, pH 9–11, 40–90 °C',13,C.amber);[[94,200],[192,230]].forEach(([x,y])=>{out+=arrow(x+(x<145?-28:28),y,x+(x<145?2:-2),y,C.coral,2,7)});
   out+=TF(145,96,'H⁺ gradient across thin walls',13,C.coral)}
  else{out+=R(20,48,250,250,'#eef6fb','none',8)+Ci(230,80,18,C.amberp,C.amber)+TF(230,114,'UV',13,C.amber);
   out+=P('M20 220 Q80 190 145 200 Q210 210 270 186 L270 298 L20 298 Z',C.muted,2,'#e9e4da');
   out+=P('M80 214 Q145 248 210 214 Z',C.blue,2,tint(C.blue,.7))+TF(145,264,'shallow pool',13,C.blue);
   out+=TF(145,316,'wet–dry cycles on volcanic land',13,C.ink)+TF(145,150,'(Darwin’s “warm little pond”, 1871)',13,C.muted)}
  out+=TBF(360,60,'Vent',13,vent?C.blue:C.muted,'middle')+TBF(511,60,'Pond',13,!vent?C.blue:C.muted,'middle');
  B8_HYP.forEach((h,i)=>{const y=70+i*48,on=s.row===i;out+=hit(X,'row',i,`Compare: ${h.r}`,R(282,y,302,44,on?C.pale:'#fff',on?C.blue:C.line,6)+TBF(288,y+16,h.r,13,C.ink,'start')+TF(360,y+35,h.v,13,vent?C.ink:C.muted,'middle')+TF(511,y+35,h.p,13,!vent?C.ink:C.muted,'middle'))});
  const d=B8_HYP[s.row].d,cut=d.length>80?d.lastIndexOf(' ',80):-1;out+=TF(300,354,cut>0?d.slice(0,cut):d,13,C.ink)+(cut>0?TF(300,372,d.slice(cut+1),13,C.ink):'');
  return {svg:out,phase:'This is open science: there are good arguments for both settings, and others besides, and no experiment has yet turned non-living chemistry into a cell. Panspermia, life arriving from space, would only move the question elsewhere.'};
 }});
