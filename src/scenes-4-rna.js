/* ===================== Abiogenesis era 4 · An RNA world? ===================== */
// Molecules that both carry information and catalyse: ribozymes, replicators, the error threshold and the
// chemistry of making nucleotides. Every picture is a pure function of state (and X); simulations are seeded.
// Each scene carries a status tag: demonstrated, plausible or speculative.

/* ---- shared helpers ---- */
const A4_STATUS={demonstrated:C.green,plausible:C.amber,speculative:C.coral};
function A4_tag(st){const col=A4_STATUS[st],w=16+st.length*7.6;return R(10,8,w,24,'#fff',col,12,'stroke-width="1.6"')+TBF(10+w/2,25,st,13,col)}
function A4_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+18,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||36),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
const A4_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function A4_wrap(t,n){const out=[''];t.split(' ').forEach(w=>{const c=out[out.length-1];if(c&&(c+' '+w).length>n)out.push(w);else out[out.length-1]=c?c+' '+w:w});return out}
function A4_btn(X,act,arg,label,x,y,w,h,lines,o={}){
 lines=Array.isArray(lines)?lines:[lines];
 const inner=R(x,y,w,h,o.sel?C.pale:'#fff',o.sel?C.blue:C.line,8,o.sel?'stroke-width="2.5"':'stroke-width="1.4"')+lines.map((t,i)=>(i===0&&o.bold!==false?TBF:TF)(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*17,t,13,o.ink||C.ink)).join('');
 return hit(X,act,arg,label,inner);
}
const A4_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const A4_rng=n=>rng(A4_mix(n));

/* ================================================================ ribozymes */
const A4_ROLES=['Stores information','Copied by base pairing','Speeds up reactions','Folds into complex shapes'];
const A4_MOLS=[['dna','DNA',['yes','yes','rarely*','limited']],['rna','RNA',['yes','yes','yes','yes']],['protein','Protein',['no','no','yes','yes']]];
SCENE({id:'ribozymes',name:'Ribozymes',tag:'A molecule that does both jobs',
 definition:'In cells today, DNA stores information and proteins do the work, but each needs the other: DNA is copied by protein enzymes, and proteins are made from DNA’s instructions. RNA can do both jobs: it stores information like DNA, and some RNAs, called ribozymes, speed up reactions like enzymes. That makes RNA a candidate for life’s first molecule.',
 example:'In 1982 Thomas Cech found an RNA that cuts itself out of a longer RNA with no protein help; in 1983 Sidney Altman’s group showed the RNA part of an enzyme, RNase P, does the cutting. They shared the 1989 Nobel Prize in Chemistry.',
 desc:'A table of four jobs and whether DNA, RNA and protein can do each, with the chosen molecule highlighted, and the chicken-and-egg loop between DNA and proteins that RNA could break.',
 research:'Woese (1967). The Genetic Code. Harper & Row. Crick (1968). Journal of Molecular Biology 38, 367–379. Orgel (1968). Journal of Molecular Biology 38, 381–393. Kruger et al. (1982). Cell 31, 147–157. Guerrier-Takada et al. (1983). Cell 35, 849–857. Gilbert (1986). The RNA world. Nature 319, 618. Breaker & Joyce (1994). Chemistry & Biology 1, 223–229 (*DNA enzymes, made in the lab).',
 dur:12,hint:'Pick each molecule. Which one ticks every box?',
 init:()=>({m:'rna'}),
 watch(p){return {m:A4_MOLS[Math.min(2,Math.floor(p*3))][0]}},
 ui:[{choose:A4_MOLS.map(x=>[x[0],x[1]]),label:'Molecule',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v}},
 draw(s){
  let out=A4_tag('demonstrated')+heading('One molecule, two jobs',30);
  A4_MOLS.forEach(([k,n],j)=>{const x=290+j*100,sel=k===s.m;out+=R(x-44,52,88,190,sel?C.pale:'#fff',sel?C.blue:C.grid,8,sel?'stroke-width="2.4"':'')+TBF(x,74,n,14,sel?C.blue:C.ink)});
  A4_ROLES.forEach((r,i)=>{const y=110+i*36;out+=TF(30,y+5,r,13,C.ink,'start');A4_MOLS.forEach(([,,v],j)=>{const x=290+j*100,a=v[i],col=a==='yes'?C.green:a==='no'?C.coral:C.amber;out+=TBF(x,y+5,a==='yes'?'✓':a==='no'?'✗':a,a.length>3?13:17,col)})});
  // chicken and egg loop
  out+=R(40,270,110,36,'#fff',C.line,8)+TBF(95,293,'DNA',14,C.ink)+R(450,270,110,36,'#fff',C.line,8)+TBF(505,293,'Protein',14,C.ink);
  out+=P('M150 280 Q300 250 450 280',C.muted,2)+arrow(440,278,450,281,C.muted,2,8)+TF(300,258,'instructions to make',13,C.muted);
  out+=P('M450 298 Q300 328 150 298',C.muted,2)+arrow(160,300,150,297,C.muted,2,8)+TF(300,330,'enzymes to copy',13,C.muted);
  out+=Ci(300,289,20,s.m==='rna'?C.blue:'#fff',C.blue)+TBF(300,294,'RNA',13,s.m==='rna'?'#fff':C.blue);
  out+=TF(300,366,'* DNA enzymes exist only in the lab; no natural one is known',13,C.muted);
  return {svg:out,phase:'Status: demonstrated. Ribozymes are real and still run central jobs in every cell. That life went through an RNA-only stage (the RNA world, named by Walter Gilbert in 1986) is plausible and widely favoured, but not proven.'};
 }});

/* ---- self-splicing ---- */
const A4_SPLICE=['An RNA copy holds the intron between two exons.','A free guanosine (G) docks in the folded intron.','G attacks the first junction: exon 1 is cut free.','Exon 1’s loose end attacks the second junction.','The exons are joined; the intron is released.'];
SCENE({id:'ribozymes-splice',name:'An RNA that cuts itself',tag:'Cech’s self-splicing intron',
 definition:'Genes in many organisms are interrupted by introns that must be cut out of the RNA copy before it is used. In the single-celled Tetrahymena, one intron folds up and cuts itself out, joining the pieces either side, with no protein. Later work showed the cut-out intron can act on other RNAs too: a true enzyme made of RNA.',
 example:'Cech’s group made the RNA in a test tube from a cloned gene, so no protein from the cell could be present, and it still spliced itself.',
 desc:'Five steps of self-splicing by a group I intron, with exon 1 in blue, the intron in amber and exon 2 in green.',
 research:'Kruger, Grabowski, Zaug, Sands, Gottschling & Cech (1982). Self-splicing RNA: autoexcision and autocyclization of the ribosomal RNA intervening sequence of Tetrahymena. Cell 31, 147–157. Zaug & Cech (1986). The intervening sequence RNA of Tetrahymena is an enzyme. Science 231, 470–475.',
 dur:12,hint:'Step through the splicing. Which molecule does the cutting?',
 init:()=>({st:0}),
 watch(p){return {st:Math.min(4,Math.floor(p*5))}},
 ui:[{range:'st',label:'Step',min:0,max:4,get:s=>s.st,act:'st',show:v=>(Number(v)+1)+' of 5'}],
 on:{st(s,v){s.st=Number(v)}},
 draw(s){
  const st=s.st;let out=A4_tag('demonstrated')+heading('An RNA that cuts itself',30);
  const y=170,e1=[60,160],e2=[440,540];
  if(st<4){
   const gap1=st>=2?24:0;
   out+=R(e1[0]-gap1,y,100,26,C.blue,'none',4)+TBF(110-gap1,y+18,'exon 1',13,'#fff');
   out+=P(`M${160} ${y+13} C200 ${y-60} 400 ${y-60} 440 ${y+13}`,C.amber,7)+TBF(300,y-48,'intron (folds up)',13,C.amber);
   out+=R(e2[0],y,100,26,C.green,'none',4)+TBF(490,y+18,'exon 2',13,'#fff');
   out+=L(160,y+13,440,y+13,st>=2?'none':C.amber,0);
   if(st>=1)out+=Ci(st>=2?168:300,st>=2?y+13:y+70,13,'#fff',C.coral)+TBF(st>=2?168:300,st>=2?y+18:y+75,'G',13,C.coral);
   if(st===1)out+=arrow(300,y+56,300,y+20,C.coral,2,8);
   if(st===2)out+=TF(110-gap1,y+50,'cut free',13,C.blue);
   if(st===3)out+=P(`M${136} ${y+30} Q300 ${y+90} 440 ${y+30}`,C.blue,2,'none','stroke-dasharray="5 4"')+arrow(430,y+36,440,y+28,C.blue,2,8);
  } else {
   out+=R(150,y,100,26,C.blue,'none',4)+TBF(200,y+18,'exon 1',13,'#fff')+R(250,y,100,26,C.green,'none',4)+TBF(300,y+18,'exon 2',13,'#fff');
   out+=P('M380 120 C420 80 500 80 520 120 C540 160 470 190 420 160',C.amber,7)+Ci(400,150,12,'#fff',C.coral)+TBF(400,155,'G',13,C.coral)+TF(460,210,'released intron',13,C.amber);
  }
  A4_SPLICE.forEach((t,i)=>{const yy=262+i*22;out+=TBF(40,yy,`${i+1}`,13,i===st?C.blue:C.muted,'start')+TF(60,yy,t,13,i===st?C.ink:C.muted,'start')});
  return {svg:out,phase:'Status: demonstrated. No protein is involved: the intron’s own folded shape positions the guanosine and the two junctions. This showed in 1982 that RNA can be an enzyme, the key experimental support for an RNA world.'};
 }});

/* ---- the ribosome is a ribozyme ---- */
const A4_ATOMS=(()=>{const r=A4_rng(1979),out=[];for(let i=0;i<420;i++){let x,y,z,d;do{x=r()*2-1;y=r()*2-1;z=r()*2-1;d=Math.hypot(x,y,z)}while(d>1);const R0=d*70,isP=R0>18&&r()<.18+.5*(R0-18)/52;out.push({x:x*70,y:y*70,z:z*70,d:R0,p:isP})}return out})();
SCENE({id:'ribozymes-ribosome',name:'The ribosome is a ribozyme',tag:'RNA at the heart of protein-making',
 definition:'The ribosome is the machine that builds every protein. It is made of RNA and dozens of proteins, and for years the proteins were assumed to do the chemistry. The first detailed structures, in 2000, showed that the spot where amino acids are joined is made of RNA alone: the ribosome is a ribozyme, perhaps a relic of an RNA world.',
 example:'In the large ribosomal subunit studied by Steitz, Moore and colleagues, no protein comes within about 18 ångströms (1.8 nanometres) of the site where peptide bonds form.',
 desc:'Atoms around the ribosome’s peptide-bond site, RNA in blue and protein in amber (positions illustrative, sampled at random). A sphere of the chosen radius is drawn around the site and the atoms inside are counted.',
 research:'Noller, Hoffarth & Zimniak (1992). Unusual resistance of peptidyl transferase to protein extraction procedures. Science 256, 1416–1419. Ban, Nissen, Hansen, Moore & Steitz (2000). Science 289, 905–920. Nissen, Hansen, Ban, Moore & Steitz (2000). The structural basis of ribosome activity in peptide bond synthesis. Science 289, 920–930. Atom positions here are illustrative.',
 dur:12,hint:'Grow the sphere around the active site. How far out before you meet any protein? Try the 3D view.',
 init:()=>({r:15}),
 watch(p){return {r:Math.round(5+p*50)}},
 ui:[{range:'r',label:'Radius around the active site (Å)',min:5,max:60,get:s=>s.r,act:'r',show:v=>v+' Å'}],
 on:{r(s,v){s.r=Number(v)}},
 draw(s){
  let out=A4_tag('demonstrated')+heading('The ribosome is a ribozyme',30);
  const cx=180,cy=205,k=2.1,slab=A4_ATOMS.filter(a=>Math.abs(a.z)<14);
  out+=Ci(cx,cy,70*k,'#f6f9fb',C.grid);
  slab.forEach(a=>{out+=Ci(cx+a.x*k,cy+a.y*k,3.6,a.p?C.amber:C.blue,'none',a.d<=s.r?'':'opacity=".45"')});
  out+=Ci(cx,cy,s.r*k,'none',C.coral,'stroke-width="2.4" stroke-dasharray="6 4"')+Ci(cx,cy,5,C.coral,'#fff');
  out+=TF(cx,370,'a thin slice through the site',13,C.muted);
  const inside=A4_ATOMS.filter(a=>a.d<=s.r),nP=inside.filter(a=>a.p).length,nR=inside.length-nP;
  out+=TBF(370,96,`Within ${s.r} Å of the site`,14,C.ink,'start');
  out+=R(370,112,14,14,C.blue,'none',3)+TF(392,124,`RNA atoms: ${nR}`,13,C.ink,'start');
  out+=R(370,136,14,14,C.amber,'none',3)+TF(392,148,`protein atoms: ${nP}`,13,C.ink,'start');
  out+=TBF(370,190,nP?'Protein reached':'RNA only',16,nP?C.amber:C.green,'start');
  ['In the real structure, no','protein lies within about 18 Å,','so RNA must do the chemistry.'].forEach((l,i)=>{out+=TF(370,228+i*19,l,13,C.ink,'start')});
  out+=TF(370,300,'points sampled at random,',13,C.muted,'start')+TF(370,318,'illustrative only',13,C.muted,'start');
  return {svg:out,phase:`Status: demonstrated. Within ${s.r} Å: ${nR} RNA atoms and ${nP} protein atoms in this sketch. The real structure (2000) settled a long debate: the ribosome’s catalytic core is RNA, and the 2009 Nobel Prize in Chemistry went to Ramakrishnan, Steitz and Yonath for ribosome structures.`};
 },
 three(s,f,X,project){
  const P3=project(A4_ATOMS.map(a=>[a.x,a.y,a.z]));
  const items=A4_ATOMS.map(a=>({at:[a.x,a.y,a.z],svg:P=>point3([a.x,a.y,a.z],P,a.p?C.amber:C.blue,a.d<=s.r?4:2.6,'none')}));
  let out=sortedItems(items,P3);
  for(const plane of [0,1,2]){const pts=range(49).map(i=>{const t=i/48*2*Math.PI,c=Math.cos(t)*s.r,d=Math.sin(t)*s.r;return plane===0?[c,d,0]:plane===1?[c,0,d]:[0,c,d]});for(let i=0;i<48;i++)out+=line3(pts[i],pts[i+1],P3,C.coral,1.8)}
  out+=point3([0,0,0],P3,C.coral,6,'#fff');
  return {svg:out,title:'Atoms around the peptide-bond site',caption:`The red rings outline a sphere of ${s.r} Å around the site. Protein atoms (amber) appear only further out: the chemistry at the centre is done by RNA (blue). Positions are illustrative.`};
 }});

/* ================================================================ replicators */
function A4_spiegel(seed,strong){
 const r=A4_rng(seed),N=40;let L=Array(N).fill(4200);const fr=[];
 for(let g=0;g<=74;g++){
  const mean=sum(L)/N;fr.push({g,L:L.slice(),mean,min:Math.min(...L)});
  const w=L.map(l=>Math.pow(4200/l,strong?1:.4)),tot=sum(w);
  const next=[];for(let i=0;i<N;i++){let u=r()*tot,j=0;while(u>w[j]&&j<N-1){u-=w[j];j++}let l=L[j];if(r()<.05)l=Math.max(200,Math.round(l*(.72+r()*.23)));next.push(l)}
  L=next}
 return fr}
SCENE({id:'replicators',name:'Spiegelman’s monster',tag:'Evolution in a test tube',
 definition:'In the 1960s Sol Spiegelman gave the RNA genome of a virus (Qβ) its copying enzyme and building blocks in a test tube, let it copy for a short time, then transferred a drop into fresh tubes, again and again. Shorter RNAs are copied faster, so they took over: the RNA threw away every gene it no longer needed.',
 example:'After 74 transfers the surviving RNA was a small fraction of the original 4,200-base genome; a later, famous variant, “Spiegelman’s monster”, was only about 220 bases long.',
 desc:'A simulation of serial transfer: 40 RNA molecules, each copied at a rate that rises as it gets shorter, with occasional deletions. Bars show each molecule’s length at the chosen transfer; the line shows the average.',
 research:'Mills, Peterson & Spiegelman (1967). An extracellular Darwinian experiment with a self-duplicating nucleic acid molecule. PNAS 58, 217–224. Kacian, Mills, Kramer & Spiegelman (1972). PNAS 69, 3038–3042. The simulation is illustrative.',
 dur:14,hint:'Run the transfers. Then shorten the copying time (stronger selection) or reseed and run again.',
 init:()=>({seed:3,sel:'strong'}),
 trace(s){return A4_spiegel(s.seed,s.sel==='strong')},
 ui:[{choose:[['strong','Short copying time'],['weak','Long copying time']],label:'Selection',get:s=>s.sel,act:'sel'},{b:'New random run',act:'seed'}],
 on:{sel(s,v){s.sel=v;return 'end'},seed(s){s.seed=(s.seed*7+5)%997;return 'end'}},
 draw(s,f){
  const all=this.trace(s),fr=f||all[all.length-1];let out=A4_tag('demonstrated')+heading('Spiegelman’s monster',30);
  out+=TF(70,62,'each bar is one RNA molecule, tallest first',13,C.muted,'start');
  const bw=12;fr.L.slice().sort((a,b)=>b-a).forEach((l,i)=>{const h=l/4200*130;out+=R(70+i*bw,210-h,bw-2,h,l<1000?C.coral:C.blue,'none',1)});
  out+=L(66,210,556,210,C.ink,1.5)+L(62,80,66,80,C.muted,1)+TF(58,84,'4,200',13,C.muted,'end')+TF(58,214,'0',13,C.muted,'end');
  const pl=A4_plot(70,240,486,90,[0,74],[0,4200],{xt:[[0,'0'],[20,'20'],[40,'40'],[60,'60'],[74,'74']],yt:[[0,'0'],[4200,'4,200']],xl:'transfer',xlDy:32});
  out+=pl.svg+A4_poly(all.filter(q=>q.g<=fr.g).map(q=>[pl.X(q.g),pl.Y(q.mean)]),C.coral,2.6);
  out+=TBF(300,372,`transfer ${fr.g}: average ${Math.round(fr.mean).toLocaleString('en-GB')} bases, shortest ${fr.min.toLocaleString('en-GB')}`,13,C.ink);
  return {svg:out,phase:`Status: demonstrated. After ${fr.g} transfers the average length is ${Math.round(fr.mean).toLocaleString('en-GB')} bases. Selection rewarded only fast copying, so genes for making a virus were lost: evolution by natural selection, with no cell at all. Here the enzyme was supplied by the experimenters, which an RNA world would not have had.`};
 }});

/* ---- cross-replicating ribozymes ---- */
function A4_cross(mode){const fr=[];let R0=1e-3,S=1;const k=Math.LN2;   // dR/dt = k R S, dS/dt = −k R S: doubling about 1 hour while pieces last
 for(let i=0;i<=60;i++){const t=i*.5;fr.push({t,R:R0,S});
  for(let j=0;j<10;j++){const d=k*R0*S*.05;R0+=d;S=Math.max(0,S-d)}
  if(mode==='transfer'&&i%10===9){R0/=20;S=1}}
 return fr}
SCENE({id:'replicators-cross',name:'Ribozymes that copy each other',tag:'Lincoln and Joyce, 2009',
 definition:'Tracey Lincoln and Gerald Joyce built two ribozymes, E and E′, each of which joins two supplied RNA pieces to make the other. Together they multiply exponentially, doubling about every hour, and with fresh pieces and repeated dilution they keep going indefinitely.',
 example:'Because each ribozyme makes its partner, the pair is a tiny self-sustaining system: a step towards RNA that replicates itself, though the four pieces were made by the experimenters.',
 desc:'Amount of ribozyme (log scale) over 30 hours in a single batch, where the supplied pieces run out, or with a 20-fold dilution into fresh pieces every 5 hours. A simple growth model, illustrative.',
 research:'Lincoln & Joyce (2009). Self-sustained replication of an RNA enzyme. Science 323, 1229–1232. von Kiedrowski (1986). A self-replicating hexadeoxynucleotide. Angewandte Chemie International Edition 25, 932–935 (the first non-enzymatic self-replicator). The curve is a simple model, not their data.',
 dur:12,hint:'Compare one batch with repeated transfers. What stops the batch, and what keeps the transfers going?',
 init:()=>({mode:'transfer'}),
 trace(s){return A4_cross(s.mode)},
 ui:[{choose:[['batch','One batch'],['transfer','Dilute into fresh pieces every 5 h']],label:'Set-up',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v;return 'end'}},
 draw(s,f){
  const all=this.trace(s),fr=f||all[all.length-1];let out=A4_tag('demonstrated')+heading('Ribozymes that copy each other',30);
  // cycle diagram
  out+=Ci(110,140,30,C.pale,C.blue)+TBF(110,146,'E',17,C.blue)+Ci(230,140,30,C.greenp,C.green)+TBF(230,146,'E′',17,C.green);
  out+=P('M132 120 Q170 92 208 120',C.blue,2.2)+arrow(200,114,210,121,C.blue,2.2,8)+P('M208 160 Q170 188 132 160',C.green,2.2)+arrow(140,166,130,159,C.green,2.2,8);
  out+=TF(170,90,'E joins two pieces into E′',13,C.ink)+TF(170,204,'E′ joins two pieces into E',13,C.ink);
  const pl=A4_plot(330,64,240,180,[0,30],[-3,0],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30 h']],yt:[[-3,'0.1%'],[-2,'1%'],[-1,'10%'],[0,'100%']],yl:'ribozyme (share of maximum)'});
  out+=pl.svg+A4_poly(all.filter(q=>q.t<=fr.t).map(q=>[pl.X(q.t),pl.Y(Math.max(-3,Math.log10(Math.min(1,q.R))))]),C.blue,2.6);
  out+=TF(300,282,`after ${fr.t} hours: ${(Math.min(1,fr.R)*100).toPrecision(2)}% of maximum, pieces left ${Math.round(fr.S*100)}%`,13,C.ink);
  out+=TF(300,306,s.mode==='batch'?'The pieces run out and growth stops.':'Fresh pieces after each dilution keep the growth going.',13,s.mode==='batch'?C.coral:C.green);
  out+=TF(300,348,'In the real experiment the pair doubled about every hour, and',13,C.muted)+TF(300,366,'serial transfer amplified them by a huge factor over 30 hours.',13,C.muted);
  return {svg:out,phase:'Status: demonstrated, with a caveat. The pair replicates without any protein, but only because the experimenters supply ready-made pieces; a full RNA world would need ribozymes that copy any sequence from single building blocks.'};
 }});

/* ---- polymerase ribozymes ---- */
const A4_POLS=[[2001,14,'A ribozyme extends a primer by up to 14 bases (Johnston et al.)'],[2011,95,'The tC19Z ribozyme copies up to 95 bases and makes a working ribozyme (Wochner et al.)'],[2013,206,'Evolved in ice, a variant makes strands up to 206 bases, longer than itself (Attwater et al.)'],[2016,null,'An RNA polymerase ribozyme amplifies short RNAs by an RNA-only PCR (Horning & Joyce)'],[2018,null,'A ribozyme copies using three-letter building blocks, reaching folded templates (Attwater et al.)']];
SCENE({id:'replicators-polymerase',name:'Polymerase ribozymes',tag:'Can RNA copy RNA?',
 definition:'An RNA world needs an RNA that copies RNA: a polymerase ribozyme. None exists in nature, so chemists evolve them in the lab, rewarding molecules that extend RNA strands. Over two decades they have grown from adding a few letters to making strands longer than themselves, but no ribozyme has yet copied itself in full.',
 example:'The best polymerase ribozymes are roughly 200 bases long. Copying that much, accurately and through its own folded shape, is the remaining hurdle.',
 desc:'Longest strand made by a polymerase ribozyme against year, with the ribozyme’s own length (about 200 bases, approximate) as a dashed line. Later milestones that are not about length are listed.',
 research:'Johnston, Unrau, Lawrence, Glasner & Bartel (2001). RNA-catalyzed RNA polymerization. Science 292, 1319–1325. Wochner, Attwater, Coulson & Holliger (2011). Science 332, 209–212. Attwater, Wochner & Holliger (2013). Nature Chemistry 5, 1011–1018. Horning & Joyce (2016). PNAS 113, 9786–9791. Attwater et al. (2018). eLife 7, e35255.',
 dur:12,hint:'Move through the years. How close have chemists come to an RNA that copies itself?',
 init:()=>({y:2013}),
 watch(p){return {y:Math.round(2000+p*18)}},
 ui:[{range:'y',label:'Year',min:2000,max:2018,get:s=>s.y,act:'y'}],
 on:{y(s,v){s.y=Number(v)}},
 draw(s){
  const pl=A4_plot(80,60,300,230,[2000,2018],[0,240],{xt:[[2000,'2000'],[2006,'2006'],[2012,'2012'],[2018,'2018']],yt:[[0,'0'],[100,'100'],[200,'200']],xl:'year',xlDy:34,yl:'longest strand made (bases)'});
  let out=A4_tag('plausible')+heading('Polymerase ribozymes',30)+pl.svg;
  out+=L(80,pl.Y(200),380,pl.Y(200),C.coral,1.8,'stroke-dasharray="6 4"')+TF(376,pl.Y(200)-6,'its own length (about 200)',13,C.coral,'end');
  const shown=A4_POLS.filter(q=>q[0]<=s.y);
  out+=A4_poly(shown.filter(q=>q[1]).map(q=>[pl.X(q[0]),pl.Y(q[1])]),C.blue,2.4);
  shown.forEach(q=>{if(q[1])out+=Ci(pl.X(q[0]),pl.Y(q[1]),7,C.blue,'#fff')+TF(pl.X(q[0])+(q[0]>2012?-10:10),pl.Y(q[1])+(q[0]===2001?-12:20),String(q[1]),13,C.blue,q[0]>2012?'end':'start')});
  out+=L(pl.X(s.y),60,pl.X(s.y),290,C.muted,1.4,'stroke-dasharray="3 4"');
  out+=TBF(400,74,'Milestones so far',14,C.ink,'start');
  let yy=98;shown.forEach(q=>{A4_wrap(q[0]+': '+q[2],28).forEach((l,i)=>{if(yy<330)out+=TF(400,yy,l,13,i?C.ink:C.ink,'start');yy+=17});yy+=4});
  if(!shown.length)out+=TF(400,98,'none yet',13,C.muted,'start');
  out+=TF(300,360,'No polymerase ribozyme has yet copied itself in full.',13,C.ink);
  return {svg:out,phase:'Status: plausible. Every step shows RNA can do more of what an RNA world needs, but copying is still slow and error-prone, and folded templates are hard to copy. A self-replicating ribozyme would be the strongest support yet.'};
 }});

/* ================================================================ error-threshold */
function A4_qs(mu,sig,Lq){
 const bin=(n,p)=>{const out=[1];for(let i=1;i<=n;i++)out.push(out[i-1]*(n-i+1)/i);return out.map((c,k)=>c*Math.pow(p,k)*Math.pow(1-p,n-k))};
 const T=range(Lq+1).map(k=>{const row=Array(Lq+1).fill(0),b=bin(k,mu),a=bin(Lq-k,mu);b.forEach((pb,i)=>a.forEach((pa,j)=>{row[k-i+j]+=pb*pa}));return row});
 let x=Array(Lq+1).fill(0);x[0]=1;const fr=[];
 for(let g=0;g<=60;g++){fr.push({g,x:x.slice()});const w=x.map((v,k)=>v*(k?1:sig)),tot=sum(w);const nx=Array(Lq+1).fill(0);w.forEach((v,k)=>{if(v)T[k].forEach((t,m)=>{nx[m]+=v/tot*t})});x=nx}
 return fr}
SCENE({id:'error-threshold',name:'The error threshold',tag:'When copying errors win',
 definition:'Manfred Eigen showed in 1971 that a replicating molecule can hold on to its information only if copying errors are rare enough. Each copy has a chance of being perfect; if the best sequence’s growth advantage cannot make up for the copies it loses to mistakes, the population drifts into a cloud of random variants and the information melts away: an error catastrophe.',
 example:'For a 20-letter sequence with a 10-fold advantage, the threshold is about ln 10 ÷ 20 ≈ 0.115 errors per letter. Below it the master sequence persists; above it, it is lost.',
 desc:'A deterministic model of 20-letter binary sequences grouped by how many letters differ from the master. Bars show the share in each group at the chosen generation; the line shows the master’s share over time.',
 research:'Eigen (1971). Naturwissenschaften 58, 465–523. Eigen & Schuster (1977). The hypercycle. Naturwissenschaften 64, 541–565. Crotty, Cameron & Andino (2001). RNA virus error catastrophe: direct molecular test by using ribavirin. PNAS 98, 6895–6900 (pushing a virus past the threshold).',
 dur:14,hint:'Raise the error rate past the threshold and run the generations. Then raise the advantage and try again.',
 init:()=>({mu:5,sig:10}),
 trace(s){return A4_qs(s.mu/100,s.sig,20)},
 ui:[{range:'mu',label:'Errors per letter (%)',min:0,max:25,get:s=>s.mu,act:'mu',show:v=>v+'%'},{range:'sig',label:'Master’s advantage σ',min:2,max:40,get:s=>s.sig,act:'sig'}],
 on:{mu(s,v){s.mu=Number(v);return 'end'},sig(s,v){s.sig=Number(v);return 'end'}},
 draw(s,f){
  const all=this.trace(s),fr=f||all[all.length-1],thr=Math.log(s.sig)/20;let out=A4_tag('demonstrated')+heading('The error threshold',30);
  const pl=A4_plot(70,64,260,200,[-.5,20.5],[0,1],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'letters different from the master',xlDy:34,yl:'share of the population'});
  out+=pl.svg;fr.x.forEach((v,k)=>{out+=R(pl.X(k)-5,pl.Y(v),10,pl.Y(0)-pl.Y(v),k?C.blue:C.coral,'none',1)});
  const p2=A4_plot(380,64,190,200,[0,60],[0,1],{xt:[[0,'0'],[30,'30'],[60,'60']],yt:[[0,'0'],[1,'1']],xl:'generation',xlDy:34,yl:'master’s share'});
  out+=p2.svg+A4_poly(all.filter(q=>q.g<=fr.g).map(q=>[p2.X(q.g),p2.Y(q.x[0])]),C.coral,2.6);
  const above=s.mu/100>thr;
  out+=TF(300,326,`error rate ${s.mu}% · threshold ≈ ln ${s.sig} ÷ 20 = ${(thr*100).toFixed(1)}% · generation ${fr.g}`,13,C.ink);
  out+=TBF(300,350,above?'Above the threshold: the master sequence is lost':'Below the threshold: the master sequence persists',14,above?C.coral:C.green);
  const Q=Math.pow(1-s.mu/100,20),pred=Math.max(0,(s.sig*Q-1)/(s.sig-1));
  return {svg:out,phase:`Status: demonstrated. Master share now ${(fr.x[0]*100).toFixed(1)}%; Eigen’s formula (σQ − 1) ÷ (σ − 1), with Q the chance of a perfect copy, predicts about ${(pred*100).toFixed(1)}% (it ignores back-mutations). The threshold is a sharp transition, and RNA viruses live close to it: drugs such as ribavirin that raise their error rate can push them over (Crotty et al. 2001).`};
 }});

/* ---- Eigen's paradox ---- */
const A4_ORGS=[['Lab polymerase ribozyme',-2,2.3],['Poliovirus (RNA)',-4,3.88],['Phage λ (DNA)',-7.11,4.69],['E. coli',-9.27,6.66],['Baker’s yeast',-9.66,7.08]];
SCENE({id:'error-threshold-paradox',name:'Eigen’s paradox',tag:'Longer genomes need better copying',
 definition:'Plotting real genomes shows the error threshold at work: the longer the genome, the lower its error rate per letter. Microbes with DNA genomes make roughly 0.003 errors per genome per copy (Drake’s rule). Eigen’s paradox follows: an early replicator needs accurate copying to hold a long genome, but needs a long genome to encode an accurate copier.',
 example:'Poliovirus makes about 1 error per 10,000 letters and has about 7,500 letters; E. coli makes about 1 error per 2 billion and has 4.6 million.',
 desc:'Error rate per letter against genome length, both on log scales, for five replicators (values approximate). The coral line is the threshold for the chosen advantage σ; points to its right have too many errors to keep their information.',
 research:'Drake (1991). A constant rate of spontaneous mutation in DNA-based microbes. PNAS 88, 7160–7164. Drake, Charlesworth, Charlesworth & Crow (1998). Genetics 148, 1667–1686. Sanjuán, Nebot, Chirico, Mansky & Belshaw (2010). Journal of Virology 84, 9733–9748. Eigen (1971). Values are approximate; the ribozyme point is a rough lab figure.',
 dur:12,hint:'Press each replicator. How close to the threshold is each one?',
 init:()=>({o:1,sig:10}),
 watch(p){return {o:Math.min(4,Math.floor(p*5)),sig:10}},
 ui:[{range:'sig',label:'Advantage σ',min:2,max:100,get:s=>s.sig,act:'sig'}],
 on:{sig(s,v){s.sig=Number(v)},o(s,v){s.o=Number(v);return 'keep'}},
 draw(s,f,X){
  const pl=A4_plot(80,60,320,240,[1,8],[-11,-1],{xt:[[1,'10'],[3,'1,000'],[5,'10⁵'],[7,'10⁷']],yt:[[-1,'1 in 10'],[-4,'1 in 10⁴'],[-7,'1 in 10⁷'],[-10,'1 in 10¹⁰']],xl:'genome length (letters, log scale)',xlDy:34,yl:'errors per letter per copy (log scale)'});
  let out=A4_tag('demonstrated')+heading('Eigen’s paradox',30)+pl.svg;
  const ls=Math.log10(Math.log(s.sig));out+=A4_poly([[pl.X(1),pl.Y(Math.min(-1,ls-1))],[pl.X(8),pl.Y(Math.max(-11,ls-8))]].map(p=>p),C.coral,2.4);
  out+=A4_poly([[pl.X(1),pl.Y(Math.log10(.003)-1)],[pl.X(8),pl.Y(Math.max(-11,Math.log10(.003)-8))]],C.green,1.6,'stroke-dasharray="5 4"');
  out+=TF(pl.X(6.3),pl.Y(ls-6.3)-8,'threshold',13,C.coral)+TF(pl.X(2.6),pl.Y(Math.log10(.003)-2.6)+18,'Drake’s rule',13,C.green);
  A4_ORGS.forEach(([n,mu,l],i)=>{out+=hit(X,'o',i,`${n}: about ${Math.round(Math.pow(10,l)).toLocaleString('en-GB')} letters`,Ci(pl.X(l),pl.Y(mu),s.o===i?9:7,C.blue,s.o===i?C.ink:'#fff','stroke-width="2.4"'))});
  const o=A4_ORGS[s.o],ml=Math.pow(10,o[1]+o[2]),lim=Math.log(s.sig);
  out+=TBF(420,80,o[0],14,C.ink,'start');
  out+=TF(420,104,`length ≈ ${Math.round(Math.pow(10,o[2])).toLocaleString('en-GB')}`,13,C.ink,'start')+TF(420,124,`errors ≈ 1 in ${Math.round(Math.pow(10,-o[1])).toLocaleString('en-GB')}`,13,C.ink,'start');
  out+=TF(420,150,`errors per genome copy:`,13,C.ink,'start')+TBF(420,172,ml>=.1?ml.toFixed(2):ml.toPrecision(2),15,ml>lim?C.coral:C.blue,'start');
  out+=TF(420,196,`threshold: ln σ = ${lim.toFixed(2)}`,13,C.muted,'start')+TBF(420,220,ml>lim?'past the threshold':'below the threshold',13,ml>lim?C.coral:C.green,'start');
  out+=TF(300,354,'Press a replicator; points to the right of the coral line lose their information.',13,C.muted);
  return {svg:out,phase:'Status: demonstrated for living genomes (values approximate). Eigen’s paradox is a real puzzle for the RNA world: proposed ways out include very short first genes, cooperation between molecules, and compartments that share the work.'};
 }});

/* ---- hypercycles ---- */
function A4_hyper(n,par){const k=1,kp=1.6;let x=range(n).map(i=>1/n*(1+.3*Math.sin(i*2.1+1)));let pz=par==='on'?.02:0;
 const norm=()=>{const t=sum(x)+pz;x=x.map(v=>v/t);pz/=t};norm();
 const der=(x,pz)=>{const g=x.map((v,i)=>k*x[(i-1+n)%n]),gp=kp*x[n-1],phi=x.reduce((a,v,i)=>a+v*g[i],0)+pz*gp;return [x.map((v,i)=>v*(g[i]-phi)),pz*(gp-phi)]};
 const fr=[];const dt=.05;
 for(let st=0;st<=1200;st++){if(st%20===0)fr.push({t:st*dt,x:x.slice(),p:pz});
  const [a1,b1]=der(x,pz),[a2,b2]=der(x.map((v,i)=>v+a1[i]*dt/2),pz+b1*dt/2),[a3,b3]=der(x.map((v,i)=>v+a2[i]*dt/2),pz+b2*dt/2),[a4,b4]=der(x.map((v,i)=>v+a3[i]*dt),pz+b3*dt);
  x=x.map((v,i)=>Math.max(0,v+dt/6*(a1[i]+2*a2[i]+2*a3[i]+a4[i])));pz=Math.max(0,pz+dt/6*(b1+2*b2+2*b3+b4));norm()}
 return fr}
const A4_HCOL=[C.blue,C.green,C.amber,C.purple,'#2f8fa3','#8a5a2b'];
SCENE({id:'error-threshold-hypercycle',name:'Hypercycles',tag:'Cooperation and its cheats',
 definition:'One way past the error threshold is cooperation: several short replicators, each helping the next to copy, closed in a loop. Eigen and Schuster called this a hypercycle. John Maynard Smith pointed out the weakness: a “parasite” that takes help but gives none can take over and break the loop, unless the molecules are kept apart in compartments or patches.',
 example:'With five or more members the hypercycle never settles: its members rise and fall in turn, like runners passing a baton.',
 desc:'A replicator-equation model: each of n species grows with help from the one before it in the loop. Lines show each species’ share over time; an optional parasite (red) takes help from the last member but helps no one.',
 research:'Eigen & Schuster (1977). The hypercycle: a principle of natural self-organization. Naturwissenschaften 64, 541–565. Maynard Smith (1979). Hypercycles and the origin of life. Nature 280, 445–446. Boerlijst & Hogeweg (1991). Spiral wave structure in pre-biotic evolution. Physica D 48, 17–28. Szathmáry & Demeter (1987). Journal of Theoretical Biology 128, 463–486.',
 dur:14,hint:'Change the number of members, then add a parasite and run the model.',
 init:()=>({n:5,par:'off'}),
 trace(s){return A4_hyper(s.n,s.par)},
 ui:[{range:'n',label:'Members in the loop',min:2,max:6,get:s=>s.n,act:'n'},{choose:[['off','No parasite'],['on','Add a parasite']],label:'Parasite',get:s=>s.par,act:'par'}],
 on:{n(s,v){s.n=Number(v);return 'end'},par(s,v){s.par=v;return 'end'}},
 draw(s,f){
  const all=this.trace(s),fr=f||all[all.length-1];let out=A4_tag('speculative')+heading('Hypercycles',30);
  // loop diagram
  const cx=110,cy=170,rr=62,pt=i=>{const a=-Math.PI/2+i*2*Math.PI/s.n;return [cx+Math.cos(a)*rr,cy+Math.sin(a)*rr]};
  for(let i=0;i<s.n;i++){const [x1,y1]=pt(i),[x2,y2]=pt((i+1)%s.n),d=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/d,uy=(y2-y1)/d,sh=Math.min(22,d/3);out+=arrow(x1+ux*sh,y1+uy*sh,x2-ux*sh,y2-uy*sh,C.muted,1.8,7)}
  for(let i=0;i<s.n;i++){const a=-Math.PI/2+i*2*Math.PI/s.n,v=fr.x[i];out+=Ci(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,8+v*30,A4_HCOL[i],'#fff')}
  if(s.par==='on'){const a=-Math.PI/2+(s.n-1)*2*Math.PI/s.n;out+=Ci(cx+Math.cos(a)*(rr+50),cy+Math.sin(a)*(rr+50),6+fr.p*30,C.coral,'#fff')+TF(cx,284,'red: parasite',13,C.coral)}
  out+=TF(cx,306,'circle size = share now',13,C.muted);
  const pl=A4_plot(250,64,320,220,[0,60],[0,1],{xt:[[0,'0'],[20,'20'],[40,'40'],[60,'60']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'time',xlDy:34,yl:'share of each member'});
  out+=pl.svg;const seen=all.filter(q=>q.t<=fr.t);
  for(let i=0;i<s.n;i++)out+=A4_poly(seen.map(q=>[pl.X(q.t),pl.Y(q.x[i])]),A4_HCOL[i],2);
  if(s.par==='on')out+=A4_poly(seen.map(q=>[pl.X(q.t),pl.Y(q.p)]),C.coral,2.8);
  out+=TF(410,346,s.par==='on'?(fr.p>.5?'The parasite has taken over the loop':'The parasite is spreading'):s.n>=5?'Five or more members: endless oscillation':s.n===4?'Four members: the swings die away only slowly':'Three or fewer: the shares settle quickly',13,s.par==='on'?C.coral:C.ink);
  return {svg:out,phase:'Status: speculative. Hypercycles show how short replicators could cooperate to hold more information, but in a well-mixed soup they are easily hijacked by parasites. Keeping molecules together, in patches on mineral surfaces or inside compartments, is the usual proposed rescue.'};
 }});

/* ================================================================ nucleotide-synthesis */
const A4_ROUTES={
 classic:[['formaldehyde','Formaldehyde','Simple carbon molecules thought to be common on the early Earth.'],['formose','Sugar mixture','The formose reaction makes dozens of sugars; ribose is only a tiny share, and it breaks down quickly.'],['nucleoside','Ribose + base','Joining ribose to a base: works poorly for purines, and not at all for pyrimidines (C, U).'],['stuck','Stuck','This “obvious” route stalls: the pieces will not join. For decades this was a central problem.']],
 powner:[['start','Simple starting chemicals','Cyanamide, cyanoacetylene, glycolaldehyde, glyceraldehyde and phosphate.'],['oxazole','2-aminooxazole','Cyanamide and glycolaldehyde give 2-aminooxazole, which can be purified by evaporating it.'],['aminooxazoline','Pentose aminooxazoline','Adding glyceraldehyde builds the sugar and half the base at once; one form crystallises out pure.'],['anhydro','Anhydronucleoside','Cyanoacetylene completes the base: sugar and base are joined without ever making free ribose.'],['cyclic','Cytidine cyclic phosphate','Heating with phosphate gives an activated nucleotide, ready to link into chains.'],['uv','UV light cleans up','Ultraviolet light destroys the wrong forms and turns some C into U.']]};
SCENE({id:'nucleotide-synthesis',name:'Making nucleotides',tag:'Bypassing free ribose',
 definition:'An RNA world needs nucleotides, the letters of RNA, each made of a sugar (ribose), a base and a phosphate. The obvious route, making ribose and a base separately and joining them, fails. In 2009 Matthew Powner, Béatrice Gerland and John Sutherland found another way: build the sugar and part of the base together, so free ribose is never needed.',
 example:'In the Powner–Gerland–Sutherland route, the key intermediate, a pentose aminooxazoline, crystallises out of the mixture, purifying itself.',
 desc:'Two routes as chains of boxes: the classic route, which stalls, and the 2009 route to an activated pyrimidine nucleotide. Step through either route.',
 research:'Butlerow (1861) (the formose reaction). Breslow (1959). Tetrahedron Letters 1, 22–26. Fuller, Sanchez & Orgel (1972). Journal of Molecular Biology 67, 25–33. Powner, Gerland & Sutherland (2009). Synthesis of activated pyrimidine ribonucleotides in prebiotically plausible conditions. Nature 459, 239–242. Becker et al. (2019). Science 366, 76–82 (purines and pyrimidines from shared conditions).',
 dur:14,hint:'Step through the classic route, then the 2009 route. Where does each one succeed or stall?',
 init:()=>({route:'powner',st:3}),
 watch(p){return p<.4?{route:'classic',st:Math.min(3,Math.floor(p/.4*4))}:{route:'powner',st:Math.min(5,Math.floor((p-.4)/.6*6))}},
 ui:[{choose:[['classic','Classic route'],['powner','2009 route']],label:'Route',get:s=>s.route,act:'route'},{range:'st',label:'Step',min:0,max:5,get:s=>s.st,act:'st',show:v=>String(Number(v)+1)}],
 on:{route(s,v){s.route=v;s.st=0},st(s,v){s.st=Number(v)}},
 draw(s){
  const rt=A4_ROUTES[s.route],st=Math.min(s.st,rt.length-1),n=rt.length,bw=Math.min(150,(540-(n-1)*14)/Math.min(n,3));
  let out=A4_tag(s.route==='classic'?'demonstrated':'demonstrated')+heading(s.route==='classic'?'The classic route':'The 2009 route',30);
  rt.forEach(([,name],i)=>{const row=Math.floor(i/3),col=i%3,x=30+col*(bw+40),y=70+row*96,on=i<=st,cur=i===st,bad=s.route==='classic'&&i===n-1;
   out+=R(x,y,bw,52,cur?(bad?C.coralp:C.pale):on?'#fff':'#f6f9fb',cur?(bad?C.coral:C.blue):C.line,8,cur?'stroke-width="2.4"':'');
   A4_wrap(name,18).slice(0,2).forEach((l,j,a)=>{out+=TBF(x+bw/2,y+30+(j-(a.length-1)/2)*17,l,13,on?(bad?C.coral:C.ink):C.muted)});
   if(i<n-1&&col<2)out+=arrow(x+bw+4,y+26,x+bw+34,y+26,i<st?C.blue:C.line,2,7);
   if(i<n-1&&col===2)out+=P(`M${x+bw/2} ${y+54} L${x+bw/2} ${y+72} L${30+bw/2} ${y+72} L${30+bw/2} ${y+92}`,i<st?C.blue:C.line,2)});
  A4_wrap(rt[st][2],70).slice(0,3).forEach((l,i)=>{out+=TF(300,286+i*19,l,13,C.ink)});
  out+=TF(300,360,s.route==='classic'?'Step '+(st+1)+' of '+n+' (classic)':'Step '+(st+1)+' of '+n+' · each chemical added in a set order',13,C.muted);
  return {svg:out,phase:s.route==='classic'?'Status: demonstrated that it fails. Making ribose and joining it to the pyrimidine bases does not work under plausible conditions, which made the RNA world look chemically implausible for decades.':'Status: demonstrated in the lab. The 2009 route works, but the chemicals are added in a careful order; whether the early Earth offered such a sequence is debated. Becker and colleagues (2019) made both kinds of base pair from shared conditions using wet–dry cycles.'};
 }});

/* ---- cyanosulfidic chemistry ---- */
const A4_INGR=[['uv','UV light'],['h2s','Hydrogen sulphide'],['cu','Copper'],['pho','Phosphate']];
const A4_FAM=[['nuc','Nucleotide precursors',['uv','h2s','pho']],['amino','Amino acid precursors',['uv','h2s']],['lipid','Lipid precursors',['uv','h2s','pho']]];
SCENE({id:'nucleotide-synthesis-cyanosulfidic',name:'One pot, many building blocks',tag:'Cyanosulfidic chemistry',
 definition:'In 2015 Sutherland’s group showed that hydrogen cyanide, hydrogen sulphide and ultraviolet light, with copper and phosphate, can produce the starting molecules for nucleotides, amino acids and lipids in one connected network of reactions. It suggests the building blocks of RNA, proteins and membranes could have formed in the same place.',
 example:'They pictured streams and pools on the surface of a young planet, exposed to sunlight, collecting cyanide from meteorite impacts and minerals from rocks.',
 desc:'Four switchable ingredients and three families of products. A family lights up when the ingredients it needs, in this simplified reading of the network, are present; hydrogen cyanide is always there.',
 research:'Patel, Percivalle, Ritson, Duffy & Sutherland (2015). Common origins of RNA, protein and lipid precursors in a cyanosulfidic protometabolism. Nature Chemistry 7, 301–307. Sasselov, Grotzinger & Sutherland (2020). The origin of life as a planetary phenomenon. Science Advances 6, eaax3419. The rule for which branch needs which ingredient is simplified.',
 dur:12,hint:'Switch ingredients on and off. Which one does every branch need?',
 init:()=>({uv:1,h2s:1,cu:1,pho:0}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {uv:k>=1?1:0,h2s:k>=2?1:0,cu:k>=3?1:0,pho:k>=4?1:0}},
 ui:[],
 on:{t(s,v){s[v]=s[v]?0:1;return 'keep'}},
 draw(s,f,X){
  let out=A4_tag('plausible')+heading('One pot, many building blocks',30);
  out+=R(30,60,150,40,C.amberp,C.amber,8)+TBF(105,85,'Hydrogen cyanide',13,C.ink);
  A4_INGR.forEach(([k,n],i)=>{const y=114+i*50,on=!!s[k];out+=A4_btn(X,'t',k,`${n}: ${on?'on':'off'}. Press to switch.`,30,y,150,40,[n,on?'on':'off'],{sel:on,ink:on?C.ink:C.muted})});
  out+=P('M180 80 L250 80 L250 300 L180 300',C.line,2);
  A4_FAM.forEach(([k,n,need],i)=>{const y=80+i*90,ok=need.every(q=>s[q]),fast=ok&&s.cu;
   out+=arrow(252,y+22,330,y+22,ok?C.green:C.line,2.4,8)+R(336,y,230,46,ok?C.greenp:'#f6f9fb',ok?C.green:C.line,8,ok?'stroke-width="2.2"':'');
   out+=TBF(451,y+20,n,13,ok?C.ink:C.muted)+TF(451,y+38,ok?(fast?'formed, copper speeds it':'formed'):'needs '+need.filter(q=>!s[q]).map(q=>({uv:'UV light',h2s:'hydrogen sulphide',cu:'copper',pho:'phosphate'})[q]).join(' and '),13,ok?C.green:C.coral)});
  out+=TF(300,354,'Simplified: in the real network each branch has several steps and conditions.',13,C.muted);
  return {svg:out,phase:'Status: plausible. The reactions work in the lab, and one set of ingredients feeds all three families, a strong point. Whether a real planet surface supplied them together, in the right order and amounts, is an open question.'};
 }});

/* ---- wet–dry cycles ---- */
function A4_wet(mode,seed){const r=A4_rng(seed);let ch=Array(120).fill(1);const fr=[];const pj=mode==='water'?0:mode==='wetdry'?.35:.6,q=mode==='mineral'?.02:.05;
 for(let c=0;c<=40;c++){fr.push({c,ch:ch.slice()});
  // dry phase: chains join pairwise
  let next=[];const order=ch.slice();for(let i=order.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
  for(let i=0;i<order.length;i++){if(i+1<order.length&&r()<pj){next.push(order[i]+order[i+1]);i++}else next.push(order[i])}
  // wet phase: bonds break
  const after=[];for(const L0 of next){let seg=1;for(let b=0;b<L0-1;b++){if(r()<q){after.push(seg);seg=1}else seg++}after.push(seg)}
  ch=after}
 return fr}
SCENE({id:'nucleotide-synthesis-wetdry',name:'Wet and dry',tag:'Joining letters into chains',
 definition:'Joining two nucleotides releases a molecule of water, so in water the reaction runs backwards: chains fall apart. Drying helps: as a pool evaporates, building blocks crowd together and join, and when it refills, some bonds break again. Repeated wet–dry cycles, or mineral surfaces such as clay, let longer chains build up.',
 example:'On montmorillonite clay, activated nucleotides added again and again have formed chains of about 50 letters (Ferris et al. 1996).',
 desc:'A seeded simulation of 120 building blocks. Each dry phase joins chains in random pairs; each wet phase breaks some bonds. The bars show chain lengths after the chosen cycle; values are illustrative.',
 research:'Ferris, Hill, Liu & Orgel (1996). Synthesis of long prebiotic oligomers on mineral surfaces. Nature 381, 59–61. Rajamani et al. (2008). Origins of Life and Evolution of Biospheres 38, 57–74 (wet–dry cycles with lipids). Damer & Deamer (2020). Astrobiology 20, 429–452. Becker et al. (2019). Science 366, 76–82. The model is illustrative.',
 dur:12,hint:'Compare staying in water with wet–dry cycles and with a mineral surface. Run the cycles and watch the longest chain.',
 init:()=>({mode:'wetdry',seed:7}),
 trace(s){return A4_wet(s.mode,s.seed)},
 ui:[{choose:[['water','Always wet'],['wetdry','Wet–dry cycles'],['mineral','Cycles on clay']],label:'Setting',get:s=>s.mode,act:'mode'},{b:'New random run',act:'seed'}],
 on:{mode(s,v){s.mode=v;return 'end'},seed(s){s.seed=(s.seed*13+3)%991;return 'end'}},
 draw(s,f){
  const all=this.trace(s),fr=f||all[all.length-1],srt=fr.ch.slice().sort((a,b)=>b-a),mx=srt[0],mean=sum(fr.ch)/fr.ch.length;
  let out=A4_tag('plausible')+heading('Wet and dry',30);
  const top=srt.slice(0,30),sc=Math.min(8,190/Math.max(8,mx));
  out+=TF(40,62,'the 30 longest chains (one block per letter)',13,C.muted,'start');
  top.forEach((l,i)=>{const y=74+i*7.6;out+=R(40,y,Math.max(4,l*sc),5.6,l>=10?C.green:C.blue,'none',1)});
  const top2=Math.max(10,...all.map(q=>Math.max(...q.ch)));
  const pl=A4_plot(350,74,210,180,[0,40],[0,top2],{xt:[[0,'0'],[20,'20'],[40,'40']],yt:[[0,'0'],[top2,String(top2)]],xl:'cycle',xlDy:34,yl:'longest chain (letters)'});
  out+=pl.svg+A4_poly(all.filter(q=>q.c<=fr.c).map(q=>[pl.X(q.c),pl.Y(Math.max(...q.ch))]),C.green,2.6);
  out+=TF(300,326,`cycle ${fr.c}: ${fr.ch.length} pieces, longest ${mx} letters, average ${mean.toFixed(1)}`,13,C.ink);
  out+=TF(300,350,s.mode==='water'?'In water alone nothing joins: chains need the water to leave.':s.mode==='mineral'?'A mineral surface holds pieces together and protects bonds.':'Drying joins, wetting breaks: longer chains slowly accumulate.',13,s.mode==='water'?C.coral:C.ink);
  return {svg:out,phase:'Status: plausible. Wet–dry cycling and mineral surfaces do make RNA-like chains in the lab, but mostly short ones with mixed linkages. Getting long, uniform chains that can act as ribozymes, without a chemist’s help, is still unsolved.'};
 }});
