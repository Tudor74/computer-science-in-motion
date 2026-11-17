/* ===================== Abiogenesis era 7 · The last common ancestor ===================== */
// Reconstructing LUCA, where the genetic code came from, rooting the tree of life and the origins of viruses.
// Every picture is a pure function of state (and X). Random processes use seeded generators, never Math.random.
const A7_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const A7_rng=n=>rng(A7_mix(n));
const A7_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
// Status tag, bottom right: demonstrated, plausible or speculative.
const A7_ST={demonstrated:[C.green,'#e3f2ec'],plausible:[C.amber,'#fbefd5'],speculative:[C.purple,'#ece6f6']};
function A7_tag(st){const [c,bg]=A7_ST[st],w=st.length*7.4+26;return R(592-w,354,w,22,bg,c,11)+TF(592-w/2,369.5,st,13,c)}
function A7_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+18,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||36),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function A7_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,8)+lines.map((t,i)=>(o.bold&&i===0?TBF:TF)(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*17,t,o.size||13,o.ink||C.ink)).join('');
 return hit(X,act,arg,label,inner);
}
function A7_wrap(t,n){const out=[''];t.split(' ').forEach(w=>{const c=out[out.length-1];if(c&&(c+' '+w).length>n)out.push(w);else out[out.length-1]=c?c+' '+w:w});return out}
const A7_lines=(x,y,lines,col=C.ink,size=13,gap=18)=>lines.map((l,i)=>TF(x,y+i*gap,l,size,col,'start')).join('');

/* ---------------------------------------------------------------- luca: which genes go back to LUCA? */
// An illustrative set of 240 gene families: how many bacterial and archaeal phyla carry each one.
const A7_FAMS=(()=>{const r=A7_rng(71),out=[];
 const add=(n,fb,fa,kind)=>{for(let i=0;i<n;i++)out.push({b:fb(r),a:fa(r),kind})};
 add(36,r=>8+Math.floor(r()*3),r=>6+Math.floor(r()*3),'core');
 add(54,r=>3+Math.floor(r()*7),r=>2+Math.floor(r()*5),'wide');
 add(52,r=>6+Math.floor(r()*5),r=>1+Math.floor(r()*2),'patchy');
 for(let i=0;i<98;i++){const bact=r()<.6;out.push(bact?{b:1+Math.floor(r()*10),a:0,kind:'one'}:{b:0,a:1+Math.floor(r()*8),kind:'one'})}
 return out})();
const A7_pass=(f,k)=>f.b>=k&&f.a>=k;
SCENE({id:'luca',name:'Reconstructing LUCA',tag:'Genes shared across the deepest split',
 definition:'LUCA, the last universal common ancestor, is the most recent population from which all living cells descend. Its genes are inferred from families found on both sides of the deepest split in the tree, bacteria and archaea, after allowing for genes that later jumped between lineages.',
 example:'A gene found in every bacterium and every archaeon was probably in LUCA. One found in many bacteria but in just one group of archaea may have been borrowed later, by horizontal gene transfer.',
 desc:'Each dot is a gene family, placed by how many bacterial and archaeal groups (phyla) carry it. The slider sets how widely a family must be spread on both sides to count as inherited from LUCA; families inside the shaded corner pass.',
 research:'Weiss, M. C. et al. (2016). The physiology and habitat of the last universal common ancestor. Nature Microbiology 1, 16116: 355 protein families passed a strict filter against gene transfer. Moody, E. R. R. et al. (2024). The nature of the last universal common ancestor and its impact on the early Earth system. Nature Ecology & Evolution 8, 1654–1666: modelling transfers instead of filtering them suggested about 2,600 proteins. The dots here are illustrative, not real data.',
 dur:12,hint:'Raise the bar for how widely a family must be shared. Too low and borrowed genes sneak in; too high and real LUCA genes lost in some lineages are thrown out.',
 init:()=>({k:2}),
 watch(p){return {k:1+Math.min(5,Math.floor(p*6))}},
 ui:[{range:'k',label:'Minimum groups on each side',min:1,max:6,get:s=>s.k,act:'k',show:v=>v+' bacterial and '+v+' archaeal'}],
 on:{k(s,v){s.k=Number(v)}},
 draw(s){
  const pl=A7_plot(70,56,300,236,[-.5,10.5],[-.5,8.5],{xt:[[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8'],[10,'10']],yt:[[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8']],xl:'bacterial phyla carrying the family',xlDy:36,yl:'archaeal phyla'});
  let out=heading('Which genes go back to LUCA?',26)+pl.svg;
  out+=R(pl.X(s.k-.5),pl.Y(8.5),pl.X(10.5)-pl.X(s.k-.5),pl.Y(s.k-.5)-pl.Y(8.5),'#e3f2ec','none',0);
  const jr=A7_rng(5);let n=0,core=0,patchy=0,lost=0;
  A7_FAMS.forEach(f=>{const jx=(jr()-.5)*.7,jy=(jr()-.5)*.7,ok=A7_pass(f,s.k);if(ok){n++;if(f.kind==='patchy')patchy++}if(f.kind==='core'&&ok)core++;if((f.kind==='core'||f.kind==='wide')&&!ok&&f.a>0&&f.b>0)lost++;
   out+=Ci(pl.X(f.b+jx),pl.Y(f.a+jy),3.6,ok?C.green:'#b7c6cf','none')});
  out+=TBF(388,76,'Families that pass',14,C.ink,'start')+TBF(388,100,n+' of '+A7_FAMS.length,18,C.green,'start');
  out+=A7_lines(388,132,['Patchy families let in: '+patchy,'(probably borrowed later)','Widely shared but cut: '+lost,'(perhaps lost in some lines)'],C.ink);
  out+=A7_lines(388,222,['Real studies: Weiss 2016','kept 355 families, filtering','strictly; Moody 2024','modelled transfers instead','and estimated about 2,600','proteins.'],C.muted);
  out+=TF(20,368,'Dots are illustrative gene families, not real data.',13,C.muted,'start');
  out+=A7_tag('plausible');
  return {svg:out,phase:s.k<=2?`With a low bar, ${n} families pass, including ${patchy} patchy ones that were probably passed sideways between microbes long after LUCA. The picture of LUCA comes out too rich.`:s.k>=5?`With a strict bar only ${n} families pass. Genes that were in LUCA but later lost by some lineages are thrown out, so LUCA looks too simple. Real estimates depend on this choice, which is why they range from hundreds to thousands of genes.`:`At ${s.k} groups on each side, ${n} families pass. Every threshold trades borrowed genes let in against inherited genes thrown out.`};
 }});

/* ---- a portrait of LUCA ---- */
const A7_TRAITS=[
 {t:['Ribosomes and','the genetic code'],st:'demonstrated',d:'Every living cell builds proteins on ribosomes using almost the same genetic code, so LUCA must have had both. This is the firmest inference of all.',src:'Shared by all cells; Woese 1977'},
 {t:['ATP made by','an ion gradient'],st:'demonstrated',d:'All cells make ATP with a rotary ATP synthase driven by a proton or sodium gradient across a membrane, so LUCA almost certainly did too.',src:'Universal ATP synthase; Lane & Martin 2012'},
 {t:['No oxygen;','fed on H₂ and CO₂'],st:'plausible',d:'Both large studies inferred an anaerobe that fixed carbon dioxide using hydrogen, by the Wood–Ljungdahl pathway, much like today’s acetogens.',src:'Weiss 2016; Moody 2024'},
 {t:['Loved heat','(a thermophile)'],st:'speculative',d:'Weiss et al. found reverse gyrase, an enzyme of heat-lovers. Other studies reconstructing ancient proteins suggest a moderate-temperature LUCA with heat-loving descendants. Contested.',src:'Weiss 2016; Boussau et al. 2008'},
 {t:['Had a CRISPR-like','immune system'],st:'speculative',d:'Moody et al. inferred parts of a CRISPR–Cas system, implying LUCA already fought viruses and lived in an ecosystem with other cells.',src:'Moody et al. 2024'},
 {t:['Its membrane','lipids'],st:'speculative',d:'Bacteria and archaea build membranes from mirror-image glycerol lipids with different chemistry (the “lipid divide”), so what LUCA’s membrane was made of is unknown.',src:'Koga 2011; Lombard et al. 2012'}];
SCENE({id:'luca-portrait',name:'A portrait of LUCA',tag:'What we can and cannot say',
 definition:'From the genes shared across life, researchers infer what LUCA did: how it made proteins and energy, what it ate, and where it may have lived. Some inferences are near-certain; others are disputed.',
 example:'Every cell alive uses ribosomes, so LUCA did. Whether LUCA lived in hot water is still argued.',
 desc:'Six traits proposed for LUCA, each with a status tag. Press a trait to read the evidence and who proposed it.',
 research:'Weiss et al. (2016). Nature Microbiology 1, 16116. Moody et al. (2024). Nature Ecology & Evolution 8, 1654–1666. Boussau, B. et al. (2008). Parallel adaptations to high temperatures in the Archaean eon. Nature 456, 942–945. Lombard, J., López-García, P. & Moreira, D. (2012). The early evolution of lipid membranes and the three domains of life. Nature Reviews Microbiology 10, 507–515.',
 dur:12,hint:'Press each trait. Notice how the status changes from shared-by-all to argued-over.',
 init:()=>({sel:0}),
 watch(p){return {sel:Math.min(5,Math.floor(p*6))}},
 ui:[],
 on:{sel(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('What LUCA probably had',26);
  A7_TRAITS.forEach((t,i)=>{const x=20+(i%2)*142,y=52+Math.floor(i/2)*96,[c,bg]=A7_ST[t.st];
   out+=A7_btn(X,'sel',i,'Trait: '+t.t.join(' '),x,y,134,84,t.t,{fill:i===s.sel?bg:'#fff',stroke:i===s.sel?c:C.line,bold:false});
   out+=TF(x+67,y+76,t.st,13,c)});
  const t=A7_TRAITS[s.sel],[c]=A7_ST[t.st];
  out+=R(310,52,272,276,'#fff',C.grid,8)+TBF(326,78,t.t.join(' '),14,C.ink,'start');
  out+=A7_lines(326,106,A7_wrap(t.d,36),C.ink,13,19);
  out+=TF(326,310,t.src,13,C.muted,'start');
  out+=A7_tag(t.st);
  return {svg:out,phase:t.st==='demonstrated'?'Shared by every living cell, so almost certainly in LUCA. LUCA was not the first life: it was already a sophisticated cell.':t.st==='plausible'?'Two independent studies agree, but both rest on which genes are counted as LUCA’s, so this is a strong hypothesis rather than a fact.':'Studies disagree. Treat this as an open question.'};
 }});

/* ---- when did LUCA live? ---- */
const A7_EV=[
 {y:4.54,n:'Earth forms',st:'demonstrated',d:'Meteorite and lead-isotope ages put Earth’s formation at about 4.54 billion years ago (Patterson 1956; ±0.05).'},
 {y:4.47,n:'Moon-forming impact',st:'plausible',d:'A giant impact that formed the Moon would have sterilised the surface; most estimates fall between about 4.51 and 4.43 billion years ago.'},
 {y:4.4,n:'Oldest zircons',st:'demonstrated',d:'Jack Hills zircon crystals are 4.4 billion years old; their heavy oxygen hints at liquid water (Wilde et al. 2001).'},
 {y:4.1,n:'Graphite in zircon',st:'speculative',d:'Carbon with a light, life-like isotope ratio sealed in a 4.1-billion-year-old zircon (Bell et al. 2015). Not proof of life.'},
 {y:3.7,n:'Isua structures',st:'speculative',d:'Claimed 3.7-billion-year-old stromatolites (Nutman et al. 2016), reinterpreted as deformed rock (Allwood et al. 2018).'},
 {y:3.43,n:'Strelley Pool reefs',st:'plausible',d:'Stromatolites 3.43 billion years old in Western Australia (Allwood et al. 2006), widely accepted as made by microbes.'}];
const A7_BOUNDS={both:{lo:4.09,hi:4.33,c:4.2,t:'Moon-impact maximum and fossil minimum'},min:{lo:3.6,hi:4.7,c:4.15,t:'fossil minimum only (illustrative)'},none:{lo:3.2,hi:5.0,c:4.1,t:'no calibrations (illustrative)'}};
SCENE({id:'luca-dating',name:'When did LUCA live?',tag:'Molecular clocks and their anchors',
 definition:'A molecular clock dates branch points from how many differences have built up between genes. It needs calibrations: dated events, such as fossils or impacts, that bound how old a branch can be.',
 example:'Moody et al. (2024) placed LUCA at about 4.2 billion years ago (4.09–4.33), only a few hundred million years after Earth formed.',
 desc:'A timeline from 4.6 to 3.3 billion years ago with key evidence. The bar shows LUCA’s estimated age; choose which calibrations the clock may use and watch the uncertainty change. Press a marker for detail.',
 research:'Moody et al. (2024). Nature Ecology & Evolution 8, 1654–1666 (4.09–4.33 Ga). Wilde, S. A. et al. (2001). Nature 409, 175–178. Bell, E. A. et al. (2015). PNAS 112, 14518–14521. Nutman, A. P. et al. (2016). Nature 537, 535–538; Allwood, A. C. et al. (2018). Nature 563, 241–244. Allwood et al. (2006). Nature 441, 714–718. Only the first setting is a published result; the other two are illustrative.',
 dur:12,hint:'Remove the calibrations one by one: without anchors, a clock can only say “some time long ago”.',
 init:()=>({b:'both',sel:2}),
 watch(p){return {b:p<.34?'both':p<.67?'min':'none',sel:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:[['both','Both anchors'],['min','Fossil minimum only'],['none','No anchors']],label:'Calibrations',get:s=>s.b,act:'b'}],
 on:{b(s,v){s.b=v;return 'keep'},sel(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  const x0=40,x1=560,Xa=y=>x0+(4.6-y)/(4.6-3.3)*(x1-x0),b=A7_BOUNDS[s.b];let out=heading('Dating the last common ancestor',26);
  const lo=Math.max(3.3,b.lo),hi=Math.min(4.6,b.hi);
  const bw=Xa(lo)-Xa(hi),blab='LUCA '+b.lo.toFixed(2)+'–'+b.hi.toFixed(2)+(b.hi>4.6?'+':'')+' billion years ago';out+=R(Xa(hi),48,bw,26,s.b==='both'?'#e3f2ec':'#fbefd5',s.b==='both'?C.green:C.amber,6)+(bw>300?TBF((Xa(hi)+Xa(lo))/2,66,blab,13,C.ink):TBF(Xa(lo)+10,66,blab,13,C.ink,'start'));
  out+=TF(300,94,'calibrations: '+b.t,13,C.muted);
  out+=L(x0,136,x1,136,C.line,2);[4.6,4.4,4.2,4.0,3.8,3.6,3.4].forEach(y=>{out+=L(Xa(y),132,Xa(y),140,C.line,1.5)+TF(Xa(y),158,y.toFixed(1),13,C.muted)});
  out+=TF(300,176,'billion years ago',13,C.muted);
  A7_EV.forEach((e,i)=>{const x=Xa(e.y),[c]=A7_ST[e.st];
   out+=hit(X,'sel',i,e.n,Ci(x,136,i===s.sel?8:6,i===s.sel?c:'#fff',c)+TBF(x,120,String(i+1),13,c));
   const cx=24+(i%3)*188,cy=188+Math.floor(i/3)*32;
   out+=hit(X,'sel',i,e.n,R(cx,cy,180,26,i===s.sel?tint(c,.8):'#fff',i===s.sel?c:C.line,6)+TF(cx+10,cy+18,(i+1)+'  '+e.n,13,C.ink,'start'))});
  const e=A7_EV[s.sel];
  out+=R(24,256,552,90,'#fff',C.grid,8)+TBF(40,278,e.n+' · about '+e.y+' billion years ago',14,C.ink,'start');
  out+=A7_lines(40,300,A7_wrap(e.d,82),C.ink,13,18);
  out+=A7_tag('plausible');
  return {svg:out,phase:s.b==='both'?'Bounded by the Moon-forming impact above and the oldest accepted fossils below, the clock puts LUCA about 4.2 billion years ago. That is a model estimate with a range, not a measurement.':s.b==='min'?'With only a minimum age from fossils, the upper end drifts: the clock alone cannot rule out a LUCA older than the Earth itself, which is impossible.':'With no anchors at all, a molecular clock gives only relative ages. Dates come from the calibrations as much as from the genes.'};
 }});

/* ---------------------------------------------------------------- the genetic code */
const A7_THEORIES=[
 {n:'Frozen accident',who:'Crick 1968',st:'speculative',claim:'The assignments were arbitrary, then froze because changing any codon would wreck many proteins at once.',pred:'No pattern in which codons go with which amino acids.',ev:'The code is far from random (next scene), so a pure accident is unlikely; yet small changes do occur (third scene).'},
 {n:'Stereochemical',who:'Woese 1967; Yarus',st:'speculative',claim:'Some amino acids physically bind RNA containing their own codons or anticodons, so chemistry chose the pairings.',pred:'RNA that binds an amino acid should be rich in its codon.',ev:'Selected RNA aptamers for several amino acids are enriched in matching triplets (Yarus, Widmann & Knight 2009); critics question the statistics.'},
 {n:'Coevolution',who:'Wong 1975',st:'speculative',claim:'The code grew: new amino acids made from old ones took over some of their precursors’ codons.',pred:'Amino acids made from the same precursor share codon neighbourhoods.',ev:'Some biosynthetic families do share codon blocks; how strong the signal is remains debated.'},
 {n:'Error minimisation',who:'Freeland & Hurst 1998',st:'plausible',claim:'The code was selected so that common errors swap an amino acid for a similar one (first suggested by Woese in 1965).',pred:'The real code should beat almost all random codes at limiting damage.',ev:'It does: under realistic error patterns, about one random code in a million does better. Whether this was selected or a side effect of the other mechanisms is open.'}];
SCENE({id:'genetic-code-origin',name:'Where did the genetic code come from?',tag:'Four ideas, none settled',
 definition:'The genetic code maps 64 three-letter codons to 20 amino acids and stop signals. Almost every organism uses the same code, so it was fixed by LUCA. Why these assignments is one of the oldest open questions in biology.',
 example:'Codons that differ only in the third letter usually code for the same amino acid: GCU, GCC, GCA and GCG all mean alanine.',
 desc:'Four leading explanations. Press one to see what it claims, what it predicts and how the evidence stands. They are not exclusive: several may each have played a part.',
 research:'Crick, F. H. C. (1968). The origin of the genetic code. Journal of Molecular Biology 38, 367–379. Wong, J. T.-F. (1975). PNAS 72, 1909–1912. Yarus, M., Widmann, J. J. & Knight, R. (2009). RNA–amino acid binding: a stereochemical era for the genetic code. Journal of Molecular Evolution 69, 406–429. Freeland, S. J. & Hurst, L. D. (1998). The genetic code is one in a million. Journal of Molecular Evolution 47, 238–248. Koonin, E. V. & Novozhilov, A. S. (2009). IUBMB Life 61, 99–111.',
 dur:12,hint:'Press each idea. Then go to the next scene and test the error-minimisation prediction yourself.',
 init:()=>({sel:0}),
 watch(p){return {sel:Math.min(3,Math.floor(p*4))}},
 ui:[],
 on:{sel(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Four ideas about the genetic code',26);
  A7_THEORIES.forEach((t,i)=>{const [c,bg]=A7_ST[t.st];out+=A7_btn(X,'sel',i,'Idea: '+t.n,20,52+i*72,190,62,[t.n,t.who],{fill:i===s.sel?bg:'#fff',stroke:i===s.sel?c:C.line,bold:true})});
  const t=A7_THEORIES[s.sel];
  out+=R(226,52,356,286,'#fff',C.grid,8)+TBF(242,78,t.n,15,C.ink,'start');
  let y=102;[['Claim',t.claim],['Predicts',t.pred],['Evidence',t.ev]].forEach(([h,b])=>{out+=TBF(242,y,h,13,C.muted,'start');const w=A7_wrap(b,48);out+=A7_lines(242,y+18,w,C.ink,13,16);y+=24+w.length*16});
  out+=A7_tag(t.st);
  return {svg:out,phase:`${t.n} (${t.who}): ${t.claim} Status: ${t.st}.`};
 }});

/* ---- is the code good at limiting errors? ---- */
const A7_AA='FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const A7_PR={A:7.0,R:9.1,N:10.0,D:13.0,C:4.8,Q:8.6,E:12.5,G:7.9,H:8.4,I:4.9,L:4.9,K:10.1,M:5.3,F:5.0,P:6.6,S:7.5,T:6.6,W:5.2,Y:5.4,V:5.6};
const A7_AAS=Object.keys(A7_PR);
function A7_cost(code){let s=0,n=0;for(let c=0;c<64;c++){const a=code[c];if(a==='*')continue;for(let pos=0;pos<3;pos++){const sh=pos===0?16:pos===1?4:1,base=Math.floor(c/sh)%4;for(let nb=0;nb<4;nb++){if(nb===base)continue;const b=code[c+(nb-base)*sh];if(b==='*')continue;const d=A7_PR[a]-A7_PR[b];s+=d*d;n++}}}return s/n}
const A7_REAL=A7_cost(A7_AA);
const A7_RAND=[];
function A7_randCosts(n){while(A7_RAND.length<n){const i=A7_RAND.length,perm=shuffled(A7_AAS,A7_mix(9000+i)),map={};A7_AAS.forEach((a,j)=>{map[a]=perm[j]});A7_RAND.push(A7_cost(A7_AA.split('').map(a=>a==='*'?'*':map[a]).join('')))}return A7_RAND.slice(0,n)}
SCENE({id:'genetic-code-origin-cost',name:'Is the code built to limit errors?',tag:'The real code against random codes',
 definition:'If a mutation or misreading changes one letter of a codon, the amino acid may change. A code that keeps such changes between chemically similar amino acids does less damage. Comparing the real code with shuffled codes tests whether it is unusually good at this.',
 example:'CUU means leucine; change the first letter to A and AUU means isoleucine, which is almost as oily, so the protein is barely hurt.',
 desc:'Each random code keeps the real code’s block structure but shuffles which amino acid goes in which block. Its cost is the average squared change in polar requirement (a measure of how water-loving an amino acid is) over every single-letter change. The histogram collects random codes; the coral line is the real code.',
 research:'Haig, D. & Hurst, L. D. (1991). A quantitative measure of error minimization in the genetic code. Journal of Molecular Evolution 33, 412–417 (about 1 in 10,000 random codes did better). Freeland & Hurst (1998), weighting errors by how often they happen: about 1 in a million. Polar requirement values from Woese et al. (1966). This scene weights all errors equally.',
 dur:12,hint:'Press Try 1,000 random codes a few times. How many beat the real one?',
 init:()=>({n:0}),
 watch(p){return {n:Math.round(p*5000/100)*100}},
 ui:[{b:'Try 100 random codes',act:'add',arg:100},{b:'Try 1,000',act:'add',arg:1000},{b:'Clear',act:'clear'}],
 on:{add(s,v){s.n=Math.min(20000,s.n+Number(v));return 'keep'},clear(s){s.n=0;return 'keep'}},
 draw(s){
  const costs=A7_randCosts(s.n),lo=3,hi=15,bins=new Array(24).fill(0);costs.forEach(c=>{const k=Math.floor((c-lo)/(hi-lo)*24);if(k>=0&&k<24)bins[k]++});
  const mx=Math.max(1,...bins),better=costs.filter(c=>c<=A7_REAL).length;
  const pl=A7_plot(70,56,330,210,[lo,hi],[0,mx*1.1],{xt:[[3,'3'],[6,'6'],[9,'9'],[12,'12'],[15,'15']],yt:[[0,'0']],xl:'error cost (lower is better)',xlDy:36,yl:'random codes'});
  let out=heading('The real code against random codes',26)+pl.svg;
  bins.forEach((b,i)=>{if(!b)return;const x=pl.X(lo+i*(hi-lo)/24),w=pl.X(lo+(i+1)*(hi-lo)/24)-x;out+=R(x+1,pl.Y(b),w-2,pl.Y(0)-pl.Y(b),'#9fb8c7','none',2)});
  out+=L(pl.X(A7_REAL),56,pl.X(A7_REAL),266,C.coral,2.5)+TBF(pl.X(A7_REAL)+6,74,'real code',13,C.coral,'start');
  out+=TBF(420,80,'Real code cost',14,C.ink,'start')+TBF(420,102,A7_REAL.toFixed(2),17,C.coral,'start');
  out+=TBF(420,142,'Random codes tried',14,C.ink,'start')+TBF(420,164,s.n.toLocaleString('en-GB'),17,C.ink,'start');
  out+=TBF(420,204,'Beat the real code',14,C.ink,'start')+TBF(420,226,s.n?better.toLocaleString('en-GB'):'–',17,better?C.amber:C.green,'start');
  if(s.n){const mean=costs.reduce((a,b)=>a+b,0)/costs.length;out+=TF(420,256,'random average '+mean.toFixed(2),13,C.muted,'start')}
  out+=A7_lines(70,326,['Here all errors count equally. Published tests that weight','errors by how often they happen find about 1 in a million better.'],C.muted,13,17);
  out+=A7_tag('plausible');
  return {svg:out,phase:!s.n?'No random codes yet. Each random code keeps the same blocks of codons but hands them to different amino acids.':better===0?`None of ${s.n.toLocaleString('en-GB')} random codes beats the real one, whose cost is ${A7_REAL.toFixed(2)}. The pattern is real; whether natural selection made it, or it fell out of how the code grew, is still debated.`:`${better} of ${s.n.toLocaleString('en-GB')} random codes beat the real one (${(better/s.n*100).toFixed(2)}%). The real code still sits in the far left tail.`};
 }});

/* ---- not quite frozen: variant codes ---- */
const A7_VAR={
 std:{n:'Standard code',ch:{},d:'Used by nearly all bacteria, archaea and the nuclear genomes of eukaryotes.'},
 mito:{n:'Vertebrate mitochondria',ch:{UGA:'W',AUA:'M',AGA:'*',AGG:'*'},d:'Our mitochondria read UGA as tryptophan, AUA as methionine, and AGA and AGG as stops (NCBI table 2).'},
 myco:{n:'Mycoplasma',ch:{UGA:'W'},d:'These tiny bacteria read the stop codon UGA as tryptophan (NCBI table 4).'},
 cand:{n:'Candida yeasts',ch:{CUG:'S'},d:'In the “CTG clade” of yeasts, CUG means serine instead of leucine (NCBI table 12).'},
 cil:{n:'Ciliates',ch:{UAA:'Q',UAG:'Q'},d:'Many ciliates, such as Tetrahymena, read UAA and UAG as glutamine, leaving UGA as the only stop (NCBI table 6).'},
 sec:{n:'Extra amino acids',ch:{UGA:'U',UAG:'O'},d:'Selenocysteine (U, in all three domains) and pyrrolysine (O, in some archaea and bacteria) are written into UGA and UAG when a special signal in the RNA is present.'}};
const A7_B='UCAG';
SCENE({id:'genetic-code-origin-variants',name:'A code that can still change',tag:'Variants of the “universal” code',
 definition:'The genetic code is nearly universal but not frozen solid. In some lineages a few codons have been reassigned, usually rarely used codons or stop codons, and two extra amino acids are written into stop codons in special contexts.',
 example:'Human mitochondria read UGA as tryptophan, while the rest of our cells read it as stop.',
 desc:'The full codon table, by first letter and third letter (rows) and second letter (columns). Choose an organism to highlight the codons it reads differently.',
 research:'Osawa, S., Jukes, T. H., Watanabe, K. & Muto, A. (1992). Recent evidence for evolution of the genetic code. Microbiological Reviews 56, 229–264. Barrell, B. G., Bankier, A. T. & Drouin, J. (1979). Nature 282, 189–194 (first mitochondrial variant). NCBI genetic code tables 2, 4, 6 and 12. Böck, A. et al. (1991) on selenocysteine; Srinivasan, G., James, C. M. & Krzycki, J. A. (2002). Science 296, 1459–1462 on pyrrolysine.',
 dur:12,hint:'Pick each organism and look for coral cells. Most changes touch stop codons or rare codons.',
 init:()=>({v:'mito'}),
 watch(p){const k=Object.keys(A7_VAR);return {v:k[Math.min(k.length-1,Math.floor(p*k.length))]}},
 ui:[{choose:Object.keys(A7_VAR).map(k=>[k,A7_VAR[k].n]),label:'Organism',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=v;return 'keep'}},
 draw(s){
  const v=A7_VAR[s.v];let out=heading('The codon table, and where it differs',26);
  const x0=20,y0=58,cw=72,rh=17.2;
  for(let j=0;j<4;j++)out+=TBF(x0+cw*j+cw/2,y0-8,'2nd '+A7_B[j],13,C.muted);
  for(let a=0;a<4;a++)for(let c=0;c<4;c++){const row=a*4+c;for(let b=0;b<4;b++){const cod=A7_B[a]+A7_B[b]+A7_B[c],std=A7_AA[16*a+4*b+c],aa=v.ch[cod]||std,chg=v.ch[cod]!==undefined;
   out+=R(x0+cw*b,y0+row*rh,cw-2,rh-2,chg?'#f9e2d9':(aa==='*'?'#eef1f3':'#fff'),chg?C.coral:C.grid,3)+TMF(x0+cw*b+6,y0+row*rh+12.5,cod,13,C.ink,'start')+TMF(x0+cw*b+cw-8,y0+row*rh+12.5,aa==='*'?'stop':aa,13,chg?C.coral:C.muted,'end')}}
  out+=TF(x0,y0+16*rh+16,'Rows: first letter, then third letter. One-letter amino acid codes.',13,C.muted,'start');
  out+=R(318,52,264,180,'#fff',C.grid,8)+TBF(334,78,v.n,15,C.ink,'start');
  out+=A7_lines(334,104,A7_wrap(v.d,34),C.ink,13,19);
  out+=A7_lines(334,256,['More than 30 variant codes are','known. They show the code can','still evolve, slowly, and that','“frozen” is only nearly true.'],C.muted);
  out+=A7_tag('demonstrated');
  return {svg:out,phase:s.v==='std'?'The standard table: 61 codons for 20 amino acids and three stops. Neighbouring cells usually share an amino acid or a similar one.':`${v.n}: ${v.d}`};
 }});

/* ---------------------------------------------------------------- rooting the tree */
const A7_TIPS=[['E. coli','B'],['Bacillus','B'],['Methanococcus','A'],['Sulfolobus','A'],['Yeast','E'],['Human','E']];
const A7_DOM={B:['Bacteria',C.blue],A:['Archaea',C.coral],E:['Eukaryotes',C.green]};
const A7_ROOTS={B:'Between Bacteria and the rest',A:'Between Archaea and the rest',E:'Between eukaryotes and the rest'};
SCENE({id:'rooting-the-tree',name:'Where is the root?',tag:'An unrooted tree has no first branch',
 definition:'Comparing genes gives an unrooted tree: it shows which groups are related, but not which branch came first. To root a tree you normally add an outgroup, a relative known to sit outside. For all of life there is no outgroup.',
 example:'Root the three-domain tree between Bacteria and the rest and archaea become eukaryotes’ closest relatives; root it elsewhere and the story of early life changes.',
 desc:'Left: the unrooted tree of six organisms from the three domains. Choose where the root goes and the right side redraws the rooted tree, with LUCA at its base.',
 research:'Woese, C. R., Kandler, O. & Wheelis, M. L. (1990). PNAS 87, 4576–4579. Gogarten, J. P. et al. (1989). PNAS 86, 6661–6665 and Iwabe, N. et al. (1989). PNAS 86, 9355–9359, which rooted the tree with genes duplicated before LUCA. Coleman, G. A. et al. (2021). A rooted phylogeny resolves early bacterial evolution. Science 372, eabe0511.',
 dur:12,hint:'Try all three roots. The relationships on the left never change; only the order of branching does.',
 init:()=>({r:'B'}),
 watch(p){return {r:p<.34?'B':p<.67?'A':'E'}},
 ui:[{choose:Object.keys(A7_ROOTS).map(k=>[k,A7_DOM[k][0]]),label:'Root between … and the rest',get:s=>s.r,act:'r'}],
 on:{r(s,v){s.r=v;return 'keep'}},
 draw(s){
  let out=heading('Placing the root of the tree of life',26);
  // unrooted: three domain branches from a centre
  const cx=140,cy=200,ang={B:-135,A:-45,E:90},mid={};
  out+=R(20,48,262,292,'#f7fafc',C.grid,8)+TF(151,68,'Unrooted tree',13,C.muted);
  Object.keys(ang).forEach(k=>{const a=ang[k]*Math.PI/180,mx=cx+Math.cos(a)*46,my=cy+Math.sin(a)*46;mid[k]=[(cx+mx)/2,(cy+my)/2];
   out+=L(cx,cy,mx,my,A7_DOM[k][1],3);
   A7_TIPS.filter(t=>t[1]===k).forEach((t,j)=>{const b=a+(j?.5:-.5),tx=mx+Math.cos(b)*40,ty=my+Math.sin(b)*40,cb=Math.cos(b),sb=Math.sin(b);out+=L(mx,my,tx,ty,A7_DOM[k][1],2.5)+Ci(tx,ty,4,A7_DOM[k][1])+TF(tx+(cb>.45?6:cb<-.45?-6:0),ty+(Math.abs(cb)>.45?5:sb>0?18:-9),t[0],13,C.ink,cb>.45?'start':cb<-.45?'end':'middle')})});
  out+=Ci(mid[s.r][0],mid[s.r][1],8,C.amber,'#fff')+TBF(mid[s.r][0]+(s.r==='B'?-14:14),mid[s.r][1]+5,'root',13,C.amber,s.r==='B'?'end':'start');
  // rooted cladogram on the right
  const order=[s.r,...['B','A','E'].filter(k=>k!==s.r)],rx=300,ry=52;out+=R(rx,ry,282,288,'#fff',C.grid,8)+TF(rx+141,ry+20,'Rooted tree, read from LUCA',13,C.muted);
  const tipY=(i)=>ry+50+i*38,tips=[];order.forEach(k=>A7_TIPS.filter(t=>t[1]===k).forEach(t=>tips.push(t)));
  const xr=rx+24,xLeaf=rx+178;
  const dY=k=>{const ys=tips.map((t,i)=>t[1]===k?tipY(i):null).filter(v=>v!==null);return (ys[0]+ys[1])/2};
  const xd=rx+128,xs=rx+78;
  tips.forEach((t,i)=>{out+=L(xd,tipY(i),xLeaf,tipY(i),A7_DOM[t[1]][1],2.4)+TF(xLeaf+6,tipY(i)+5,t[0],13,C.ink,'start')});
  order.forEach(k=>{const ys=tips.map((t,i)=>t[1]===k?tipY(i):null).filter(v=>v!==null);out+=L(xd,ys[0],xd,ys[1],A7_DOM[k][1],2.4)});
  const y1=dY(order[1]),y2=dY(order[2]),ys=(y1+y2)/2,y0=dY(order[0]);
  out+=L(xs,y1,xd,y1,C.line,2.4)+L(xs,y2,xd,y2,C.line,2.4)+L(xs,y1,xs,y2,C.line,2.4);
  out+=L(xr,y0,xd,y0,C.line,2.4)+L(xr,ys,xs,ys,C.line,2.4)+L(xr,y0,xr,ys,C.line,2.4);
  out+=Ci(xr,(y0+ys)/2,7,C.amber,'#fff')+TBF(xr+10,(y0+ys)/2+5,'LUCA',13,C.amber,'start');
  out+=TF(rx+141,ry+278,s.r==='B'?'most evidence favours this root':'a minority view',13,s.r==='B'?C.green:C.muted);
  out+=A7_tag(s.r==='B'?'plausible':'speculative');
  return {svg:out,phase:s.r==='B'?'Rooted between Bacteria and the rest, archaea and eukaryotes share a more recent ancestor. Ancient duplicated genes and most later analyses support this root, though it is still argued.':s.r==='A'?'Rooting between Archaea and the rest would make bacteria the eukaryotes’ closest relatives. The relationships on the left are unchanged; only the story of what came first differs.':'Rooting among the eukaryotes would make the complex cell the most ancient lineage. A few researchers have argued this, but most evidence places eukaryotes late.'};
 }});

/* ---- rooting with ancient duplicates ---- */
const A7_PSTEP=['One ancient gene','Duplicated before LUCA','Both copies passed on','Each tree roots the other'];
SCENE({id:'rooting-the-tree-paralogs',name:'Rooting with ancient duplicates',tag:'Genes that doubled before LUCA',
 definition:'Some genes were duplicated before LUCA, so every living cell carries both copies, called paralogs. A tree of copy A can then be rooted using copy B as its outgroup, and the other way round.',
 example:'The protein-making factors EF-Tu and EF-G, and two subunits of the ATP synthase, are such ancient pairs.',
 desc:'Four steps: a single gene; its duplication into copies A and B before LUCA; both copies inherited by bacteria, archaea and eukaryotes; and the combined tree, where each copy’s family acts as the other’s outgroup and marks the root.',
 research:'Gogarten, J. P. et al. (1989). Evolution of the vacuolar H⁺-ATPase: implications for the origin of eukaryotes. PNAS 86, 6661–6665. Iwabe, N., Kuma, K., Hasegawa, M., Osawa, S. & Miyata, T. (1989). Evolutionary relationship of archaebacteria, eubacteria, and eukaryotes inferred from phylogenetic trees of duplicated genes. PNAS 86, 9355–9359. Gouy, R., Baurain, D. & Philippe, H. (2015). Rooting the tree of life: the phylogenetic jury is still out. Phil. Trans. R. Soc. B 370, 20140329.',
 dur:12,hint:'Step through the four stages. The trick only works because the duplication happened before LUCA.',
 init:()=>({st:0}),
 watch(p){return {st:Math.min(3,Math.floor(p*4))}},
 ui:[{b:'Back',act:'step',arg:-1},{b:'Next step',act:'step',arg:1}],
 on:{step(s,v){s.st=clamp(s.st+Number(v),0,3);return 'keep'}},
 draw(s){
  let out=heading(`Step ${s.st+1} of 4 · ${A7_PSTEP[s.st]}`,26);const cA=C.blue,cB=C.purple;
  const gene=(x,y,c,lab)=>R(x,y,64,24,tint(c,.75),c,6)+TBF(x+32,y+17,lab,13,C.ink);
  if(s.st===0){out+=gene(268,150,C.muted,'gene')+TF(300,200,'An ancestor of LUCA carries one copy of a gene.',13,C.ink)}
  if(s.st>=1&&s.st<3){out+=TF(120,78,'before LUCA',13,C.muted)+gene(88,100,cA,'copy A')+gene(88,132,cB,'copy B');out+=TF(120,176,'one gene became two',13,C.muted);
   out+=Ci(220,128,9,C.amber,'#fff')+TBF(220,156,'LUCA',13,C.amber)+L(160,128,208,128,C.line,2)}
  if(s.st===2){['Bacteria','Archaea','Eukaryotes'].forEach((d,i)=>{const y=80+i*86,col=[C.blue,C.coral,C.green][i];out+=L(230,128,330,y+18,C.line,2)+R(340,y,232,62,'#fff',col,8)+TBF(356,y+22,d,13,col,'start')+gene(356,y+30,cA,'A')+gene(430,y+30,cB,'B')})}
  if(s.st===3){
   const sub=(y,c,lab)=>{let o=L(140,y,190,y,c,2.4)+L(190,y-34,190,y+34,c,2.4);
    o+=L(190,y-34,330,y-34,c,2.4)+TF(336,y-29,'Bacteria, copy '+lab,13,C.blue,'start');
    o+=L(190,y+34,240,y+34,c,2.4)+L(240,y+17,240,y+51,c,2.4)+L(240,y+17,330,y+17,c,2.4)+TF(336,y+22,'Archaea, copy '+lab,13,C.coral,'start')+L(240,y+51,330,y+51,c,2.4)+TF(336,y+56,'Eukaryotes, copy '+lab,13,C.green,'start');return o};
   out+=L(70,100,70,242,C.line,2.4)+L(70,100,140,100,C.line,2.4)+L(70,242,140,242,C.line,2.4)+Ci(70,171,8,C.amber,'#fff')+TBF(56,176,'root',13,C.amber,'end');
   out+=sub(100,cA,'A')+sub(242,cB,'B')+TBF(150,92,'copy A family',13,cA,'start')+TBF(150,234,'copy B family',13,cB,'start')}
  out+=R(20,318,450,30,'#f7fafc',C.grid,6)+TF(32,338,['Most genes give only an unrooted tree of life.','Duplication must come before LUCA for this to work.','Every domain inherits both copies.','In both trees, Bacteria branch off first: the root.'][s.st],13,C.ink,'start');
  out+=A7_tag('plausible');
  return {svg:out,phase:['Start with one gene in a pre-LUCA cell.','The gene is duplicated, and the two copies drift apart in sequence and job. This happened before LUCA.','LUCA passes both copies to every descendant, so every domain carries an A and a B.','A tree of all the A copies can be rooted where the B copies join it. Both early studies placed the root between Bacteria and the rest. Later work warns that long branches can mislead, so the jury is still out.'][s.st]};
 }});

/* ---- three domains or two? (3D) ---- */
const A7_TREES={
 three:{n:'Three domains',d:'Woese 1990: Bacteria, Archaea and Eukarya as three separate branches, eukaryotes sister to archaea.',tips:[['Bacteria',C.blue,0],['TACK archaea',C.coral,1],['Euryarchaea',C.coral,1],['Eukaryotes',C.green,2]]},
 two:{n:'Two domains',d:'Since the Asgard archaea (2015 onwards): eukaryotes arose from within the archaea, so there are two primary domains, Bacteria and Archaea.',tips:[['Bacteria',C.blue,0],['Euryarchaea',C.coral,1],['TACK archaea',C.coral,1],['Asgard archaea',C.coral,1],['Eukaryotes',C.green,1]]}};
SCENE({id:'rooting-the-tree-domains',name:'Three domains or two?',tag:'Where eukaryotes branch',
 definition:'In the three-domain tree, eukaryotes are a primary branch of life beside bacteria and archaea. Genomes of Asgard archaea, found from 2015, suggest instead that eukaryotes grew out of within the archaea, leaving two primary domains.',
 example:'In 2020 an Asgard archaeon was grown in the lab for the first time, after twelve years of culturing; it has tentacle-like protrusions.',
 desc:'The two competing trees drawn from LUCA. In 3D the tree grows upward in time, with lineages spread around a circle; turn it to see that eukaryotes either sit on their own branch or nest inside the archaea.',
 research:'Woese, Kandler & Wheelis (1990). PNAS 87, 4576–4579. Spang, A. et al. (2015). Complex archaea that bridge the gap between prokaryotes and eukaryotes. Nature 521, 173–179. Williams, T. A., Cox, C. J., Foster, P. G., Szöllősi, G. J. & Embley, T. M. (2020). Phylogenomics provides robust support for a two-domains tree of life. Nature Ecology & Evolution 4, 138–147. Imachi, H. et al. (2020). Nature 577, 519–525. See also Biology In Motion’s tree-of-life lesson.',
 dur:12,hint:'Switch between the trees, then turn on 3D and drag to rotate.',
 init:()=>({t:'two'}),
 watch(p){return {t:p<.5?'three':'two'}},
 ui:[{choose:[['three','Three domains'],['two','Two domains']],label:'Tree',get:s=>s.t,act:'t'}],
 on:{t(s,v){s.t=v;return 'keep'}},
 draw(s){
  const tr=A7_TREES[s.t];let out=heading(tr.n+': where eukaryotes branch',26);
  const n=tr.tips.length,ty=i=>66+i*(200/(n-1)),xL=110,xT=380,seg=(x1,y1,x2,y2,c)=>L(x1,y1,x2,y1,c,2.6)+L(x2,y1,x2,y2,c,2.6);
  const yB=ty(0);
  if(s.t==='three'){const yT=ty(1),yE2=ty(2),yE=ty(3),aN=(yT+yE2)/2,cN=(aN+yE)/2,root=(yB+cN)/2;
   out+=L(xL,yB,xL,cN,C.line,2.6)+L(xL,yB,xT,yB,C.blue,2.6)+L(xL,cN,170,cN,C.line,2.6)+L(170,aN,170,yE,C.line,2.6)+L(170,aN,240,aN,C.coral,2.6)+L(240,yT,240,yE2,C.coral,2.6)+L(240,yT,xT,yT,C.coral,2.6)+L(240,yE2,xT,yE2,C.coral,2.6)+L(170,yE,xT,yE,C.green,2.6);
   out+=Ci(xL,root,8,C.amber,'#fff')+TBF(xL-14,root+5,'LUCA',13,C.amber,'end')}
  else{const yA=[ty(1),ty(2),ty(3)],yE=ty(4),aN=(yA[0]+yE)/2,root=(yB+aN)/2,gN=(yA[2]+yE)/2;
   out+=L(xL,yB,xL,aN,C.line,2.6)+L(xL,yB,xT,yB,C.blue,2.6)+L(xL,aN,200,aN,C.coral,2.6)+L(200,yA[0],200,gN,C.coral,2.6)+L(200,yA[0],xT,yA[0],C.coral,2.6)+L(200,yA[1],xT,yA[1],C.coral,2.6);
   out+=L(200,gN,290,gN,C.coral,2.6)+L(290,yA[2],290,yE,C.coral,2.6)+L(290,yA[2],xT,yA[2],C.coral,2.6)+L(290,yE,xT,yE,C.green,2.6);
   out+=Ci(xL,root,8,C.amber,'#fff')+TBF(xL-14,root+5,'LUCA',13,C.amber,'end')}
  tr.tips.forEach((t,i)=>{out+=Ci(xT,ty(i),5,t[1])+TF(xT+12,ty(i)+5,t[0],13,C.ink,'start')});
  out+=R(20,290,562,54,'#f7fafc',C.grid,6)+A7_lines(32,311,A7_wrap(tr.d,84),C.ink,13,18);
  out+=A7_tag(s.t==='two'?'plausible':'speculative');
  return {svg:out,phase:s.t==='two'?'In the two-domain tree eukaryotes branch from inside the archaea, closest to the Asgard group: the complex cell began as a partnership between an archaeon and a bacterium. Increasingly favoured, still debated.':'In the three-domain tree eukaryotes are a primary branch. It was the standard picture for decades and remains defended by some.'};
 },
 three(s,f,X,project){
  const tr=A7_TREES[s.t],n=tr.tips.length,P3=project([-1.3,1.3,-1.3,1.3,0,3.2]);let out='';
  const tip=i=>{const a=i/n*Math.PI*2;return [Math.cos(a)*1.2,Math.sin(a)*1.2,3]};
  const luca=[0,0,0],bact=[tip(0)[0]*.3,tip(0)[1]*.3,1],arch=[0,0,1.2];
  out+=line3([-1.3,-1.3,0],[1.3,-1.3,0],P3,C.grid,1)+line3([-1.3,-1.3,0],[-1.3,-1.3,3.2],P3,C.grid,1);
  out+=line3(luca,bact,P3,C.blue,3)+line3(bact,tip(0),P3,C.blue,3);
  out+=line3(luca,arch,P3,C.coral,3);
  tr.tips.forEach((t,i)=>{if(i===0)return;if(s.t==='three'&&t[2]===2){const e=[tip(i)[0]*.3,tip(i)[1]*.3,1.1];out+=line3(luca,e,P3,C.green,3)+line3(e,tip(i),P3,C.green,3)}else out+=line3(arch,tip(i),P3,t[1],3)});
  out+=sortedItems(tr.tips.map((t,i)=>({at:tip(i),svg:P=>{const p=P(tip(i));return Ci(p[0],p[1],6,t[1],'#fff')+TF(p[0],p[1]-12,t[0],13,C.ink)}})),P3);
  const pl=P3(luca);out+=Ci(pl[0],pl[1],7,C.amber,'#fff')+TF(pl[0],pl[1]+22,'LUCA',13,C.amber);
  return {svg:out,title:tr.n+' in time',caption:'Height is time, from LUCA at the bottom to today at the top. '+(s.t==='two'?'Eukaryotes sprout from the archaeal trunk.':'Eukaryotes have their own trunk from near LUCA.')};
 }});

/* ---------------------------------------------------------------- the origins of viruses */
const A7_VH={
 first:{n:'Virus first',st:'speculative',d:'Self-copying genetic elements came before cells; some later became parasites of the first cells.',for:'Viruses infect all three domains and share some genes, such as a capsid fold, found in no cell.',against:'Every virus known today needs a cell to copy itself.'},
 escape:{n:'Escape',st:'speculative',d:'Pieces of cellular DNA or RNA escaped, gained a coat, and became viruses.',for:'Retroviruses resemble mobile genetic elements already present in cells.',against:'Many viral genes have no cellular relatives to escape from.'},
 reduction:{n:'Reduction',st:'speculative',d:'Viruses are descended from cellular parasites that lost most of their genes.',for:'Giant viruses carry genes for protein-making once thought unique to cells.',against:'Many giant-virus genes seem to have been picked up from hosts later.'}};
SCENE({id:'viruses-origins',name:'Where did viruses come from?',tag:'Three hypotheses, perhaps all true',
 definition:'Viruses are genetic parasites that copy themselves only inside cells. Their origin is unknown. Three main hypotheses compete, and since viruses may not form one family, different groups may have arisen in different ways.',
 example:'Herpesviruses, retroviruses and giant viruses are so different that they may not share a single origin.',
 desc:'A timeline from before LUCA to today, with cells shown as a growing trunk. Choose a hypothesis to see where viruses would come from, and read the evidence for and against.',
 research:'Forterre, P. (2006). The origin of viruses and their possible roles in major evolutionary transitions. Virus Research 117, 5–16. Koonin, E. V., Senkevich, T. G. & Dolja, V. V. (2006). The ancient Virus World and evolution of cells. Biology Direct 1, 29. Krupovic, M., Dolja, V. V. & Koonin, E. V. (2019). Origin of viruses: primordial replicators recruiting capsids from hosts. Nature Reviews Microbiology 17, 449–458. Nasir, A. & Caetano-Anollés, G. (2015). Science Advances 1, e1500527.',
 dur:12,hint:'Choose each hypothesis. Notice that none is ruled out.',
 init:()=>({h:'first'}),
 watch(p){return {h:p<.34?'first':p<.67?'escape':'reduction'}},
 ui:[{choose:Object.keys(A7_VH).map(k=>[k,A7_VH[k].n]),label:'Hypothesis',get:s=>s.h,act:'h'}],
 on:{h(s,v){s.h=v;return 'keep'}},
 draw(s){
  const h=A7_VH[s.h];let out=heading('Three ways viruses might have begun',26);
  const x0=40,x1=560,yC=130;out+=L(x0,190,x1,190,C.line,1.5)+TF(x0,208,'before LUCA',13,C.muted,'start')+TF(300,208,'LUCA',13,C.amber)+TF(x1,208,'today',13,C.muted,'end');
  out+=Ci(300,190,6,C.amber,'#fff');
  out+=P(`M300 180 C380 160 460 120 560 110`,C.green,10,'none','opacity=".55"')+TF(560,98,'cells',13,C.green,'end');
  const vir=(x,y)=>`<polygon points="${[0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3;return fmt(x+Math.cos(a)*9)+','+fmt(y+Math.sin(a)*9)}).join(' ')}" fill="#ece6f6" stroke="${C.purple}" stroke-width="2"/>`;
  if(s.h==='first'){out+=P('M60 150 C150 140 230 150 300 160',C.purple,2.5,'none','stroke-dasharray="6 5"');[80,150,220].forEach(x=>{out+=vir(x,148)});out+=arrow(330,150,420,132,C.purple,2,7)+vir(440,128);out+=TF(150,120,'replicators before cells',13,C.purple)}
  if(s.h==='escape'){[380,470].forEach(x=>{out+=arrow(x,132,x+10,72,C.purple,2,7)+vir(x+12,62)});out+=TF(430,46,'genes escape from cells',13,C.purple)}
  if(s.h==='reduction'){[400,490].forEach(x=>{out+=Ci(x,70,13,'#e3f2ec',C.green)+arrow(x,86,x,112,C.line,2,7)});out+=vir(400,60)+TF(445,46,'parasitic cells shrink',13,C.purple)}
  let y=246;out+=R(20,224,562,124,'#fff',C.grid,8)+TBF(36,y,h.n,14,C.ink,'start');y+=20;
  [['',h.d,C.ink],['For: ',h.for,C.green],['Against: ',h.against,C.coral]].forEach(([lab,txt,c])=>{A7_wrap(lab+txt,84).forEach((l,i)=>{out+=TF(36,y,l,13,i===0&&lab?c:C.ink,'start');y+=17})});
  out+=A7_tag(h.st);
  return {svg:out,phase:`${h.n}: ${h.d} Status: speculative. Many virologists now think different virus groups arose by different routes.`};
 }});

/* ---- giant viruses ---- */
const A7_GEN=[
 {n:'Influenza A',kb:13.5,v:true,d:'Eight RNA segments, about 13,500 bases in all.'},
 {n:'SARS-CoV-2',kb:29.9,v:true,d:'One RNA strand of about 29,900 bases, among the largest RNA virus genomes.'},
 {n:'Phage T4',kb:169,v:true,d:'A virus of bacteria with about 169,000 base pairs of DNA.'},
 {n:'Carsonella',kb:160,v:false,d:'A bacterium living inside insect cells, with one of the smallest known cellular genomes, about 160,000 base pairs.'},
 {n:'Mycoplasma genitalium',kb:580,v:false,d:'A free-living (but parasitic) bacterium with about 580,000 base pairs.'},
 {n:'Mimivirus',kb:1181,v:true,d:'Found in 1992 in an amoeba and mistaken for a bacterium; recognised as a virus in 2003. About 1.18 million base pairs and some protein-making genes.'},
 {n:'Pandoravirus salinus',kb:2470,v:true,d:'Described in 2013, with about 2.5 million base pairs, larger than many bacteria.'},
 {n:'E. coli',kb:4640,v:false,d:'A typical gut bacterium with about 4.6 million base pairs.'}];
SCENE({id:'viruses-origins-giants',name:'Giant viruses',tag:'When a virus outgrows a cell',
 definition:'Giant viruses, discovered from 2003, have genomes larger than some bacteria and carry genes for parts of the protein-making machinery. They blurred the line between viruses and cells and revived the debate about where viruses came from.',
 example:'Mimivirus was first catalogued as a bacterium because it is visible in a light microscope.',
 desc:'Genome sizes on a logarithmic scale, viruses in purple and cells in green. Press a bar to read about it.',
 research:'La Scola, B. et al. (2003). A giant virus in amoebae. Science 299, 2033. Raoult, D. et al. (2004). The 1.2-megabase genome sequence of Mimivirus. Science 306, 1344–1350. Philippe, N. et al. (2013). Pandoraviruses. Science 341, 281–286. Nakabachi, A. et al. (2006). Science 314, 267 (Carsonella). Moreira, D. & Brochier-Armanet, C. (2008). BMC Evolutionary Biology 8, 12 (giant-virus genes mostly borrowed from hosts).',
 dur:12,hint:'Press Mimivirus and Carsonella: which is bigger?',
 init:()=>({sel:5}),
 watch(p){return {sel:Math.min(7,Math.floor(p*8))}},
 ui:[],
 on:{sel(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  const pl=A7_plot(200,48,370,202,[1,4],[0,8],{xt:[[1,'10 kb'],[2,'100 kb'],[3,'1 Mb'],[4,'10 Mb']]});
  let out=heading('Genome sizes: viruses and cells',26)+pl.svg;
  A7_GEN.forEach((g,i)=>{const y=54+i*24.5,w=pl.X(Math.log10(g.kb))-200,c=g.v?C.purple:C.green;
   out+=hit(X,'sel',i,g.n,R(200,y,w,18,i===s.sel?c:tint(c,.55),'none',3)+TF(192,y+14,g.n,13,i===s.sel?C.ink:C.muted,'end'))});
  const g=A7_GEN[s.sel];out+=R(20,278,562,70,'#fff',C.grid,6)+TBF(32,298,g.n+(g.v?' (virus)':' (cell)'),13,g.v?C.purple:C.green,'start')+A7_lines(32,318,A7_wrap(g.d,84),C.ink,13,17);
  out+=A7_tag('demonstrated');
  return {svg:out,phase:`${g.n}: ${g.d} Size alone does not separate viruses from cells; what does is that viruses cannot make their own proteins or energy.`};
 }});

/* ---- viruses inside us ---- */
const A7_HG=[
 {n:'Retrovirus-like (ERVs)',pc:8,c:C.purple,d:'About 8% of the human genome is made of endogenous retroviruses and their relatives: viral DNA that entered germ cells and was inherited.'},
 {n:'LINE elements',pc:20,c:'#7f9db0',d:'Long interspersed elements, copy-and-paste genetic parasites (about 20%).'},
 {n:'SINE elements (e.g. Alu)',pc:13,c:'#a6bccb',d:'Short interspersed elements (about 13%), copied using LINE machinery.'},
 {n:'DNA transposons',pc:3,c:'#c3d3de',d:'Cut-and-paste elements, now inactive in humans (about 3%).'},
 {n:'Protein-coding',pc:1.5,c:C.green,d:'Only about 1.5% codes for proteins.'},
 {n:'Everything else',pc:54.5,c:'#e9eef2',d:'Introns, regulatory DNA, repeats and sequence of unknown function.'}];
SCENE({id:'viruses-origins-in-us',name:'Viruses inside our genome',tag:'Endogenous retroviruses',
 definition:'When a retrovirus infects an egg or sperm cell, its DNA copy can be inherited. Over millions of years these endogenous retroviruses built up in genomes. A few were put to use by their hosts.',
 example:'Syncytin, a protein needed to build the human placenta, comes from the envelope gene of an ancient retrovirus.',
 desc:'The human genome as a bar split by origin. Press a part to read about it. The purple slice is viral in origin.',
 research:'International Human Genome Sequencing Consortium (2001). Nature 409, 860–921 (genome composition). Mi, S. et al. (2000). Syncytin is a captive retroviral envelope protein involved in human placental morphogenesis. Nature 403, 785–789. Feschotte, C. & Gilbert, C. (2012). Endogenous viruses: insights into viral evolution and impact on host biology. Nature Reviews Genetics 13, 283–296. Percentages rounded.',
 dur:12,hint:'Press the purple slice, then the green one, and compare their sizes.',
 init:()=>({sel:0}),
 watch(p){return {sel:Math.min(5,Math.floor(p*6))}},
 ui:[],
 on:{sel(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('What the human genome is made of',26);let x=30;const W=540;
  A7_HG.forEach((g,i)=>{const w=g.pc/100*W;out+=hit(X,'sel',i,g.n+', '+g.pc+'%',R(x,70,Math.max(2,w-1),56,g.c,i===s.sel?C.ink:'none',2));if(w>40)out+=TF(x+w/2,104,g.pc+'%',13,i===0||i===4?'#fff':C.ink);x+=w});
  A7_HG.forEach((g,i)=>{const y=150+Math.floor(i/2)*26,xx=30+(i%2)*280;out+=hit(X,'sel',i,g.n,R(xx,y,16,16,g.c,i===s.sel?C.ink:C.line,3)+TF(xx+24,y+13,g.n+' · '+g.pc+'%',13,i===s.sel?C.ink:C.muted,'start'))});
  const g=A7_HG[s.sel];out+=R(30,238,540,96,'#fff',C.grid,8)+TBF(46,262,g.n,14,C.ink,'start')+A7_lines(46,286,A7_wrap(g.d,76),C.ink,13,19);
  out+=A7_tag('demonstrated');
  return {svg:out,phase:s.sel===0?'Viral DNA makes up about 8% of our genome, more than five times the share that codes for proteins. Most of it is broken and silent, but syncytin shows that some was put to work.':`${g.n}: ${g.d}`};
 }});
