/* ===================== Biology era 4 · The molecules of life ===================== */
// DNA's structure, how it is copied, how genes become proteins, the code itself, how genes are switched
// on and off, and how they change. Every picture is a pure function of state; random processes use seeds.

/* ---- shared helpers ---- */
const B4_B='UCAG';
const B4_CODE='FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const B4_aa=c=>{c=c.replace(/T/g,'U');const i=B4_B.indexOf(c[0])*16+B4_B.indexOf(c[1])*4+B4_B.indexOf(c[2]);return i<0||c.length<3?'?':B4_CODE[i]};
const B4_N3={A:'Ala',R:'Arg',N:'Asn',D:'Asp',C:'Cys',Q:'Gln',E:'Glu',G:'Gly',H:'His',I:'Ile',L:'Leu',K:'Lys',M:'Met',F:'Phe',P:'Pro',S:'Ser',T:'Thr',W:'Trp',Y:'Tyr',V:'Val','*':'Stop','?':'—'};
const B4_COMP={A:'T',T:'A',G:'C',C:'G',U:'A'};
const B4_COL={A:C.green,T:C.coral,U:C.coral,G:C.amber,C:C.blue,X:C.purple};
const B4_PALE={A:C.greenp,T:C.coralp,U:C.coralp,G:C.amberp,C:C.pale,X:C.purplep};
const B4_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const B4_rng=n=>rng(B4_mix(n));
// One base as a coloured tile.
function B4_base(x,y,b,w=22,h=26,o={}){
 return R(x,y,w,h,o.fill||B4_PALE[b]||'#fff',o.stroke||B4_COL[b]||C.line,5,o.dash?'stroke-width="1.6" stroke-dasharray="4 3"':'stroke-width="1.6"')+TMF(x+w/2,y+h/2+5,b,o.size||14,o.ink||C.ink,'middle','font-weight="700"');
}
const B4_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function B4_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function B4_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,9,o.sel?'stroke-width="3"':'stroke-width="1.5"')+TF(x+w/2,y+h/2+5,text,o.size||14,o.ink||C.ink,'middle',o.bold?'font-weight="700"':'');
 return hit(X,act,arg,label,inner);
}
// Poisson draw by inversion (small means only).
function B4_poisson(r,lam){if(lam<=0)return 0;let k=0,p=Math.exp(-lam),c=p;const u=r();while(u>c&&k<500){k++;p*=lam/k;c+=p}return k}
function B4_translate(seq){const out=[];for(let i=0;i+3<=seq.length;i+=3){const a=B4_aa(seq.slice(i,i+3));out.push(a);if(a==='*')break}return out}

/* ================================================================ double-helix */
const B4_ORG={you:{n:'Your setting'},human:{n:'Human (thymus)',v:[30.9,29.4,19.9,19.8]},ecoli:{n:'E. coli',v:[24.7,23.6,26.0,25.7]},phix:{n:'φX174 virus',v:[24.6,32.7,24.1,18.5],single:true}};
const B4_comp=s=>s.org==='you'?[s.a,s.a,50-s.a,50-s.a]:B4_ORG[s.org].v;
SCENE({id:'double-helix',name:'Chargaff’s rules',tag:'A matches T, G matches C',
 definition:'In double-stranded DNA the amount of adenine (A) equals the amount of thymine (T), and guanine (G) equals cytosine (C). Erwin Chargaff measured this in 1950; the double helix explains it, because A always pairs with T and G with C across the two strands.',
 example:'Human DNA is about 30% A and 30% T, but only about 20% each of G and C; in E. coli all four are near 25%. In both, A ≈ T and G ≈ C.',
 desc:'Bars for the share of each base in a chosen DNA, the A/T and G/C ratios, and a short stretch of the molecule drawn as pairs; a single-stranded virus breaks the rule.',
 research:'Chargaff, E. (1950). Chemical specificity of nucleic acids and mechanism of their enzymatic degradation. Experientia 6, 201–209. Base compositions as given in standard tables (human thymus, E. coli); φX174 is single-stranded (Sinsheimer 1959). Values rounded.',
 dur:10,hint:'Choose a source of DNA, or move the slider to set your own composition. Compare the A/T and G/C ratios.',
 init:()=>({org:'human',a:30}),
 watch(p){return p<.25?{org:'human',a:30}:p<.5?{org:'ecoli',a:25}:p<.75?{org:'phix',a:25}:{org:'you',a:Math.round(12+26*(p-.75)*4)}},
 ui:[{choose:Object.keys(B4_ORG).map(k=>[k,B4_ORG[k].n]),label:'DNA from',get:s=>s.org,act:'org'},{range:'a',label:'A in your setting',min:10,max:40,get:s=>s.a,act:'a',show:v=>v+'%'}],
 on:{org(s,v){s.org=v},a(s,v){s.a=Number(v);s.org='you'}},
 draw(s){
  const v=B4_comp(s),org=B4_ORG[s.org];let out=heading('Chargaff’s rules: A matches T, G matches C',26);
  const pl=B4_plot(60,60,250,210,[0,4],[0,40],{yt:[[0,'0'],[20,'20%'],[40,'40%']],yl:'share of bases'});out+=pl.svg;
  'ATGC'.split('').forEach((b,i)=>{const x=pl.X(i+.18),w=pl.X(i+.82)-x,h=pl.Y(0)-pl.Y(Math.min(40,v[i]));out+=R(x,pl.Y(0)-h,w,h,B4_COL[b],'none',3)+TBF(x+w/2,pl.Y(0)+20,b,16,B4_COL[b])+TF(x+w/2,pl.Y(0)-h-6,v[i].toFixed(1),13,C.ink)});
  const at=v[0]/v[1],gc=v[2]/v[3],ok=Math.abs(at-1)<.1&&Math.abs(gc-1)<.1;
  out+=TF(185,318,`A/T = ${at.toFixed(2)}   ·   G/C = ${gc.toFixed(2)}`,15,ok?C.green:C.coral);
  out+=TF(185,340,org.n,13,C.muted);
  // A stretch of the molecule: pairs drawn from the composition (seeded).
  const r=B4_rng(s.org==='you'?s.a*7+1:Object.keys(B4_ORG).indexOf(s.org)*13+3),tot=v[0]+v[1]+v[2]+v[3];
  out+=TF(470,56,org.single?'one strand only':'two strands, paired',13,C.muted);
  for(let i=0;i<9;i++){const u=r()*tot;let b=u<v[0]?'A':u<v[0]+v[1]?'T':u<v[0]+v[1]+v[2]?'G':'C';const y=68+i*30;
   out+=B4_base(392,y,b);
   if(org.single)out+=L(416,y+13,520,y+13,C.grid,1.5,'stroke-dasharray="3 5"');
   else{const c=B4_COMP[b];out+=L(416,y+13,522,y+13,C.line,2)+B4_base(522,y,c)}}
  out+=L(386,66,386,338,C.ink,3)+(org.single?'':L(550,66,550,338,C.ink,3));
  return {svg:out,phase:org.single?'φX174 carries its DNA as a single strand, so nothing pairs A with T: here A and T differ by a third. Chargaff’s rule is a fingerprint of the double strand.':ok?'A ≈ T and G ≈ C, although A+T and G+C differ between species. The pairing proposed by Watson and Crick explains exactly this: every A on one strand faces a T on the other.':'Your setting breaks pairing.'};
 }});

/* ---- Photo 51: what the X-ray pattern says about a helix ---- */
SCENE({id:'double-helix-photo51',name:'Reading Photo 51',tag:'A helix makes an X',
 definition:'X-rays scattered by a fibre of DNA make a pattern on film. A helix gives a characteristic X of spots: the angle of the X depends on how steeply the strands wind, the spacing of the rows (layer lines) gives the pitch, and a strong spot far out gives the distance between stacked bases.',
 example:'Photo 51, taken in May 1952 by Raymond Gosling working with Rosalind Franklin, shows a sharp X with a strong spot on the tenth layer line: a helix 34 ångströms per turn with 10 bases per turn, 3.4 Å apart.',
 desc:'A side view of a helix with sliders for its pitch, radius and bases per turn, beside a schematic of the X-ray pattern it would make.',
 research:'Franklin, R. E. & Gosling, R. G. (1953). Molecular configuration in sodium thymonucleate. Nature 171, 740–741. Cochran, Crick & Vand (1952), the theory of diffraction by a helix. Cobb, M. & Comfort, N. (2023). What Rosalind Franklin truly contributed to the discovery of DNA’s structure. Nature 616, 657–660. The pattern here is schematic.',
 dur:12,hint:'Make the helix steeper or flatter with the pitch and radius sliders and watch the X open and close. The spot on layer n gives the rise per base.',
 init:()=>({P:34,r:10,n:10}),
 watch(p){return p<.6?{P:Math.round(22+24*p/.6),r:10,n:10}:p<.8?{P:34,r:Math.round(6+8*(p-.6)/.2),n:10}:{P:34,r:10,n:10}},
 ui:[{range:'P',label:'Pitch',min:20,max:50,get:s=>s.P,act:'P',show:v=>v+' Å'},{range:'r',label:'Radius',min:5,max:15,get:s=>s.r,act:'r',show:v=>v+' Å'},{range:'n',label:'Bases per turn',min:8,max:12,get:s=>s.n,act:'n'}],
 on:{P(s,v){s.P=Number(v)},r(s,v){s.r=Number(v)},n(s,v){s.n=Number(v)}},
 draw(s){
  let out=heading('Reading Photo 51: a helix makes an X',26);
  // Helix, side view.
  const cx=150,y0=62,y1=332,k=3,Rp=s.r*k,Pp=s.P*k;
  out+=R(40,52,220,290,'#fff',C.grid,6)+L(cx,y0,cx,y1,C.grid,1,'stroke-dasharray="3 4"');
  const strand=ph=>range(121).map(i=>{const y=y0+i/120*(y1-y0);return [cx+Rp*Math.sin(2*Math.PI*(y-y0)/Pp+ph),y]});
  const stepY=Pp/s.n;for(let y=y0+stepY/2;y<y1;y+=stepY){const a=cx+Rp*Math.sin(2*Math.PI*(y-y0)/Pp),b=cx+Rp*Math.sin(2*Math.PI*(y-y0)/Pp+2.4);out+=L(a,y,b,y,C.line,1.4)}
  out+=B4_poly(strand(0),C.blue,3)+B4_poly(strand(2.4),C.coral,3);
  out+=L(250,y0+4,250,y0+4+Pp,C.ink,1.5)+L(244,y0+4,256,y0+4,C.ink,1.5)+L(244,y0+4+Pp,256,y0+4+Pp,C.ink,1.5)+TF(244,y0+Pp/2+8,'P',14,C.ink,'end');
  // Diffraction pattern (schematic).
  const dx=450,dy=197,half=135,d=440/s.P,phi=Math.atan(s.P/(2*Math.PI*s.r));
  out+=R(330,52,240,290,'#1d2a33','none',6);
  out+=L(dx-half*Math.tan(phi),dy-half,dx+half*Math.tan(phi),dy+half,'#4b6170',1,'stroke-dasharray="3 5"')+L(dx+half*Math.tan(phi),dy-half,dx-half*Math.tan(phi),dy+half,'#4b6170',1,'stroke-dasharray="3 5"');
  for(let k2=1;k2*d<=half;k2++){if(k2%s.n===0)continue;const x=k2*d*Math.tan(phi);if(x>112)continue;const rr=Math.max(2,6-k2*.6);
   for(const sg of [-1,1])out+=Ci(dx+x,dy+sg*k2*d,rr,'#e8eef2')+Ci(dx-x,dy+sg*k2*d,rr,'#e8eef2')}
  const mer=s.n*d;if(mer<=half)out+=Ci(dx,dy-mer,7,'#ffd24a')+Ci(dx,dy+mer,7,'#ffd24a');
  out+=Ci(dx,dy,10,'#33454f');
  out+=TF(450,47,'schematic X-ray pattern',13,C.muted)+TF(150,47,'helix, side view',13,C.muted);
  const rise=s.P/s.n,match=s.P===34&&s.n===10;
  out+=TF(150,362,`strand angle ${Math.round(90-phi*180/Math.PI)}° from the axis`,13,C.muted);
  out+=TF(450,362,mer<=half?`gold spot on layer ${s.n}: rise ${rise.toFixed(2)} Å`:`layer ${s.n} is off the film`,13,match?C.green:C.ink);
  return {svg:out,phase:match?'Pitch 34 Å with 10 bases per turn puts a strong spot on the 10th layer line, at 3.4 Å: the bases are stacked flat, one every 3.4 Å. This is the pattern in Photo 51.':`Arms of the X sit ${Math.round(phi*180/Math.PI)}° from the vertical: a steeper strand gives a wider X. Rows of spots are 1/P apart, so a longer pitch packs them closer.`};
 }});

/* ---- 3D structure ---- */
const B4_SEQ='GATTACAGCTTAGCCATGACGTTAGCGCATAGCTTGACCGAT';
SCENE({id:'double-helix-structure',name:'The double helix',tag:'Two antiparallel strands',
 definition:'DNA is two strands wound around each other. Each strand has a sugar–phosphate backbone with a base sticking inwards; bases pair A–T and G–C across the middle. The strands run in opposite directions (5′ to 3′ one way, 3′ to 5′ the other) and the twist leaves a wide major groove and a narrow minor groove.',
 example:'A turn of DNA in a cell holds about 10.5 base pairs and is 3.4–3.6 nanometres long; the helix is about 2 nanometres across.',
 desc:'The molecule unrolled as a ladder of pairs with its two directions marked; the 3D view twists it into a helix with its grooves.',
 research:'Watson, J. D. & Crick, F. H. C. (1953). Molecular structure of nucleic acids: a structure for deoxyribose nucleic acid. Nature 171, 737–738. Wang, J. C. (1979). Helical repeat of DNA in solution, about 10.5 base pairs per turn. PNAS 76, 200–203.',
 dur:10,hint:'Change the number of base pairs, then switch to 3D and drag to turn the helix.',
 init:()=>({n:21}),
 watch(p){return {n:Math.round(10+(42-10)*Math.min(1,p*1.4))}},
 ui:[{range:'n',label:'Base pairs',min:10,max:42,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=Number(v)}},
 draw(s){
  let out=heading('The double helix, unrolled',26);
  const n=Math.min(s.n,21),w=24,x0=300-n*w/2;
  out+=TF(x0-10,86,'5′',14,C.blue,'end')+TF(x0+n*w+10,86,'3′',14,C.blue,'start');
  out+=TF(x0-10,182,'3′',14,C.coral,'end')+TF(x0+n*w+10,182,'5′',14,C.coral,'start');
  for(let i=0;i<n;i++){const b=B4_SEQ[i],x=x0+i*w;out+=B4_base(x+1,68,b)+L(x+12,94,x+12,150,C.line,1.5)+B4_base(x+1,152,B4_COMP[b])}
  out+=L(x0,64,x0+n*w,64,C.blue,3)+L(x0,182,x0+n*w,182,C.coral,3);
  out+=arrow(x0+n*w-60,50,x0+n*w-10,50,C.blue,2)+arrow(x0+60,198,x0+10,198,C.coral,2);
  if(s.n>21)out+=TF(300,222,`showing the first 21 of ${s.n} pairs`,13,C.muted);
  out+=box(40,250,160,58,'',C.pale)+TF(120,272,'one turn',13,C.muted)+TBF(120,296,'≈ 10.5 pairs',16,C.ink);
  out+=box(220,250,160,58,'',C.pale)+TF(300,272,'rise per pair',13,C.muted)+TBF(300,296,'0.34 nm',16,C.ink);
  out+=box(400,250,160,58,'',C.pale)+TF(480,272,'width',13,C.muted)+TBF(480,296,'≈ 2 nm',16,C.ink);
  out+=TF(300,340,`${s.n} pairs ≈ ${(s.n/10.5).toFixed(1)} turns, ${(s.n*.34).toFixed(1)} nm long`,14,C.ink);
  return {svg:out,phase:'Flattened, DNA is a ladder: two backbones with base pairs as rungs. The arrows show the strands run in opposite directions. Switch to 3D to see the twist.'};
 },
 three(s,f,X,project){
  const n=Math.min(s.n,21),h=n*.34,off=2.4,tw=2*Math.PI/10.5,P=project([-1.6,1.6,-1.6,1.6,-.2,h+.2]);
  const pt=(i,ph)=>[Math.cos(i*tw+ph),Math.sin(i*tw+ph),i*.34];const items=[];
  for(let i=0;i<n;i++){const a=pt(i,0),b=pt(i,off),m=a.map((v,k)=>(v+b[k])/2),bs=B4_SEQ[i%B4_SEQ.length];
   items.push({at:a.map((v,k)=>(v*3+m[k])/4),svg:P=>line3(a,m,P,B4_COL[bs],5)});items.push({at:b.map((v,k)=>(v*3+m[k])/4),svg:P=>line3(m,b,P,B4_COL[B4_COMP[bs]],5)})}
  for(const [ph,col] of [[0,C.blue],[off,C.coral]])for(let j=0;j<(n-1)*3;j++){const a=pt(j/3,ph),b=pt((j+1)/3,ph);items.push({at:a.map((v,k)=>(v+b[k])/2),svg:P=>line3(a,b,P,col,7)})}
  let out=sortedItems(items,P);
  if(s.n>21)out+=TF(300,372,`showing 21 of ${s.n} pairs (two turns)`,13,C.muted);
  return {svg:out,title:'The double helix',caption:'Blue and coral are the two backbones, running in opposite directions. Base pairs (green A–T, amber–blue G–C) stack up the middle. The uneven gaps between the backbones are the major and minor grooves.'};
 }});

/* ================================================================ replication */
const B4_TPL='GATTACAGCTTA';
SCENE({id:'replication',name:'Copying DNA',tag:'Unzip and fill in',
 definition:'To copy DNA the two strands separate and each serves as a template: a new strand is built against it by pairing A with T and G with C. Each daughter molecule keeps one old strand and gains one new one. This is called semi-conservative replication.',
 example:'Watson and Crick ended their 1953 paper by noting that the pairing they proposed “immediately suggests a possible copying mechanism”.',
 desc:'A short double strand unzipping pair by pair; each old strand gets a new partner, giving two daughters that are each half old and half new.',
 research:'Watson, J. D. & Crick, F. H. C. (1953). Genetical implications of the structure of deoxyribonucleic acid. Nature 171, 964–967. Kornberg, A. et al. (1958), DNA polymerase.',
 dur:10,hint:'Press Copy next pair, or Copy all. Old strands are solid, new strands dashed.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(12,Math.floor(p*13))}},
 ui:[{b:'Copy next pair',act:'step'},{b:'Copy all',act:'all'}],
 on:{step(s){if(s.k<12)s.k++},all(s,a,ctx){if(s.k>=12)s.k=0;ctx.every(220,'tick')},tick(s){if(s.k>=12)return 'stop';s.k++;return s.k>=12?'stop':'keep'}},
 draw(s){
  let out=heading('Copying DNA: each strand is a template',26);
  const w=36,x0=84;
  for(let i=0;i<12;i++){const b=B4_TPL[i],c=B4_COMP[b],x=x0+i*w;
   if(i<s.k){out+=B4_base(x,70,b,28,28)+B4_base(x,104,c,28,28,{dash:true,fill:'#fff'})+B4_base(x,250,b,28,28,{dash:true,fill:'#fff'})+B4_base(x,284,c,28,28)}
   else out+=B4_base(x,160,b,28,28)+B4_base(x,194,c,28,28)}
  out+=TF(76,90,'old',13,C.muted,'end')+TF(76,124,'new',13,C.muted,'end')+TF(76,270,'new',13,C.muted,'end')+TF(76,304,'old',13,C.muted,'end');
  if(s.k<12){const fx=x0+s.k*w-15;out+=Ci(fx,192,13,C.purple)+TF(fx,197,'H',13,'#fff')+TF(fx+18,236,'helicase opens the strands here',13,C.purple,'start')}
  out+=TF(300,350,`${s.k} of 12 pairs copied`,15,s.k===12?C.green:C.ink);
  return {svg:out,phase:s.k===12?'Two identical molecules, each with one old strand (solid) and one new strand (dashed): semi-conservative copying.':'Each base on an old strand picks up its partner: A with T, G with C. The sequence of the new strand is fixed by the old one.'};
 }});

/* ---- Meselson–Stahl ---- */
const B4_DEN={L:1.710,H:1.724};
function B4_bands(model,g){
 if(g===0)return [{rho:B4_DEN.H,f:1}];
 if(model==='semi')return [{rho:(B4_DEN.H+B4_DEN.L)/2,f:2/2**g},{rho:B4_DEN.L,f:1-2/2**g}].filter(b=>b.f>1e-9);
 if(model==='cons')return [{rho:B4_DEN.H,f:1/2**g},{rho:B4_DEN.L,f:1-1/2**g}];
 const h=.5**g;return [{rho:B4_DEN.L+(B4_DEN.H-B4_DEN.L)*h,f:1}];
}
const B4_MODELS=[['semi','Semi-conservative'],['cons','Conservative'],['disp','Dispersive']];
SCENE({id:'replication-meselson',name:'The Meselson–Stahl experiment',tag:'Weighing DNA',
 definition:'Matthew Meselson and Franklin Stahl grew bacteria on heavy nitrogen (¹⁵N), moved them to normal nitrogen (¹⁴N), and spun their DNA in a density gradient. Heavy, light and half-heavy DNA settle at different places, so each model of copying predicts a different set of bands.',
 example:'After one generation all DNA was half-heavy; after two, half was half-heavy and half light, exactly as semi-conservative copying predicts.',
 desc:'Rows for each generation after the switch, with the bands each model predicts on a density scale beside the bands Meselson and Stahl observed.',
 research:'Meselson, M. & Stahl, F. W. (1958). The replication of DNA in Escherichia coli. PNAS 44, 671–682. Densities ≈ 1.710 (¹⁴N) and 1.724 g/cm³ (¹⁵N), as reported; often called “the most beautiful experiment in biology” (Holmes 2001).',
 dur:12,hint:'Choose a model and step through the generations. Which model matches every row?',
 init:()=>({model:'cons',g:2}),
 watch(p){const m=Math.min(2,Math.floor(p*3));return {model:['cons','disp','semi'][m],g:Math.min(4,Math.floor((p*3-m)*5))}},
 ui:[{choose:B4_MODELS,label:'Model',get:s=>s.model,act:'model'},{range:'g',label:'Generations',min:0,max:4,get:s=>s.g,act:'g'}],
 on:{model(s,v){s.model=v},g(s,v){s.g=Number(v)}},
 draw(s){
  let out=heading('Meselson and Stahl: which model fits?',26);
  const cols=[[165,'prediction'],[455,'observed (1958)']],X=(c,r)=>c-90+(r-1.706)/(1.728-1.706)*180;
  cols.forEach(([c,l],ci)=>{out+=TBF(c,58,l,14,ci?C.green:C.blue)});
  let all=true;
  for(let g=0;g<=4;g++){const y=78+g*52,shown=g<=s.g;out+=TF(20,y+24,`gen ${g}`,13,shown?C.ink:C.grid,'start');
   cols.forEach(([c],ci)=>{out+=R(c-95,y,190,38,ci?'#f3f8f4':'#f4f8fb',C.grid,6);
    if(!shown)return;const bs=B4_bands(ci?'semi':s.model,g);
    bs.forEach(b=>{const x=X(c,b.rho);out+=R(x-3-5*b.f,y+4,6+10*b.f,30,ci?C.green:C.blue,'none',3,`opacity="${(.25+.75*b.f).toFixed(2)}"`)})});
   if(shown){const a=B4_bands(s.model,g),b=B4_bands('semi',g),m=a.length===b.length&&a.every((q,i)=>Math.abs(q.rho-b[i].rho)<1e-6&&Math.abs(q.f-b[i].f)<1e-6);all=all&&m;out+=TBF(310,y+25,m?'✓':'✗',18,m?C.green:C.coral)}}
  [165,455].forEach(c=>{out+=TF(X(c,B4_DEN.L),352,'light',13,C.muted)+TF(X(c,(B4_DEN.L+B4_DEN.H)/2),370,'hybrid',13,C.muted)+TF(X(c,B4_DEN.H),352,'heavy',13,C.muted)});
  const name=B4_MODELS.find(m=>m[0]===s.model)[1];
  return {svg:out,phase:s.model==='semi'?'Semi-conservative copying matches every generation: one hybrid band, then hybrid and light, with light growing each time.':s.model==='cons'?'Conservative copying would keep a fully heavy band forever. The observed first generation has no heavy band at all: this model fails at generation 1.':`${name} copying predicts a single band drifting towards light. It matches generation 1 but fails at generation 2, where two separate bands appear.`};
 }});

/* ---- replication fork ---- */
const B4_ORGF={ecoli:{n:'E. coli',G:4.6e6,v:1000,frag:70,fr:'1,000–2,000'},human:{n:'Human cell',G:3.1e9,v:33,frag:24,fr:'100–200'}};
function B4_dur(sec){return sec<120?Math.round(sec)+' s':sec<7200?Math.round(sec/60)+' min':sec<172800?(sec/3600).toFixed(1)+' h':sec<6e7?Math.round(sec/86400)+' days':(sec/3.15e7).toFixed(1)+' years'}
SCENE({id:'replication-fork',name:'The replication fork',tag:'One strand in pieces',
 definition:'DNA polymerase can only add to the 3′ end of a growing strand. At a replication fork one new strand (the leading strand) is made continuously towards the fork; the other (the lagging strand) is made backwards in short Okazaki fragments, each started by a short RNA primer and later joined up.',
 example:'In E. coli Okazaki fragments are about 1,000–2,000 bases long; in human cells about 100–200. Two forks from a single origin copy the E. coli chromosome in roughly 40 minutes.',
 desc:'A fork moving along DNA with the leading strand continuous and the lagging strand in fragments, and a calculation of how long copying takes for a chosen organism and number of starting points.',
 research:'Okazaki, R., Okazaki, T., Sakabe, K., Sugimoto, K. & Sugino, A. (1968). Mechanism of DNA chain growth. PNAS 59, 598–605. Fork speeds and origin numbers are typical values (about 1,000 bases/s in E. coli; about 1–3 kb/min in human cells, which use tens of thousands of origins).',
 dur:12,hint:'Move the fork with the slider. Then choose an organism and set how many origins it starts copying from.',
 init:()=>({t:.6,org:'ecoli',o:0}),
 watch(p){return p<.5?{t:.1+p*1.7,org:'ecoli',o:0}:{t:.95,org:'human',o:Math.min(5,(p-.5)*11)}},
 ui:[{range:'t',label:'Fork position',min:.05,max:1,step:.01,get:s=>s.t,act:'t'},{choose:[['ecoli','E. coli'],['human','Human cell']],label:'Organism',get:s=>s.org,act:'org'},{range:'o',label:'Origins',min:0,max:5,step:.5,get:s=>s.o,act:'o',show:v=>Math.round(10**v).toLocaleString('en-GB')}],
 on:{t(s,v){s.t=Number(v)},org(s,v){s.org=v},o(s,v){s.o=Number(v)}},
 draw(s){
  let out=heading('The replication fork',26);
  const o=B4_ORGF[s.org],xf=70+s.t*470,L0=60;
  out+=L(xf,136,575,136,C.ink,3)+L(xf,158,575,158,C.ink,3);
  out+=L(L0,96,xf,136,C.ink,3)+L(L0,206,xf,158,C.ink,3);
  // leading strand (continuous) under the top template
  out+=L(L0+4,108,xf-10,142,C.green,4);out+=arrow(xf-30,139,xf-10,142,C.green,3,8);
  // lagging fragments, each built away from the fork
  const len=o.frag,yAt=x=>194+(x-L0)/(xf-L0)*(-42);let j=0;
  for(let e=xf-6;e>L0+4;e-=len,j++){const st=Math.max(L0+4,e-len+4),near=j<2;
   out+=L(st,yAt(st)-2,e,yAt(e)-2,near?C.blue:C.green,4);
   if(near){out+=R(e-8,yAt(e)-8,8,10,C.coral,'none',2);out+=arrow(st+16,yAt(st+16)-2,st,yAt(st)-2,C.blue,3,8)}}
  out+=Ci(xf+4,147,12,C.purple);
  out+=TF(L0,86,'leading strand: continuous',13,C.green,'start');
  out+=TF(L0,232,'lagging strand: Okazaki fragments',13,C.blue,'start');
  out+=TF(Math.min(530,xf+20),126,'fork',13,C.purple,'start');
  out+=R(400,190,12,10,C.coral,'none',2)+TF(418,200,'RNA primer',13,C.coral,'start');
  // timing
  const O=s.org==='ecoli'?1:Math.round(10**s.o),sec=o.G/(2*O*o.v);
  out+=R(40,262,520,104,C.pale,'none',10);
  out+=TF(300,286,`${o.n}: ${(o.G/1e6).toLocaleString('en-GB')} million bases · fork speed ≈ ${o.v.toLocaleString('en-GB')} bases/s · fragments ${o.fr} bases`,13,C.ink);
  out+=TBF(300,318,`${O.toLocaleString('en-GB')} origin${O>1?'s':''} × 2 forks → about ${B4_dur(sec)}`,17,C.ink);
  out+=TF(300,346,s.org==='ecoli'?'E. coli starts from a single origin (oriC); about 40 minutes is what is observed.':'Real S phase lasts about 8 hours: origins fire in a timed order, not all at once.',13,C.muted);
  return {svg:out,phase:s.org==='human'&&O<100?'From one origin, copying a human genome at this speed would take far longer than a cell lives. Many origins make it possible.':'The top new strand grows smoothly towards the fork. The bottom one must be made in pieces that run the other way, each started by a primer (coral) and later sealed.'};
 }});

/* ================================================================ transcription-translation */
const B4_GENE='ATGGGCGAAAACTTCTGGTAA';
SCENE({id:'transcription-translation',name:'From gene to protein',tag:'Transcribe, then translate',
 definition:'A protein-coding gene is used in two steps. (Other genes make RNAs that work without being translated, such as transfer and ribosomal RNA.) In transcription, RNA polymerase copies one stretch of DNA into messenger RNA (mRNA), with U in place of T. In translation, a ribosome reads the mRNA three bases (a codon) at a time and joins the matching amino acids into a protein, stopping at a stop codon.',
 example:'The mRNA AUG GGC GAA AAC UUC UGG UAA is read as Met–Gly–Glu–Asn–Phe–Trp, then stop.',
 desc:'A short gene on two DNA strands, the mRNA built from it base by base, then the ribosome reading codons into a chain of amino acids.',
 research:'Brenner, S., Jacob, F. & Meselson, M. (1961). An unstable intermediate carrying information from genes to ribosomes for protein synthesis. Nature 190, 576–581. Crick, F. H. C. (1958). On protein synthesis. Symp. Soc. Exp. Biol. 12, 138–163.',
 dur:12,hint:'Press Next step to transcribe one base or translate one codon, or Run to watch it all.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(28,Math.floor(p*29))}},
 ui:[{b:'Next step',act:'step'},{b:'Run',act:'run'}],
 on:{step(s){if(s.k<28)s.k++},run(s,a,ctx){if(s.k>=28)s.k=0;ctx.every(160,'tick')},tick(s){if(s.k>=28)return 'stop';s.k++;return s.k>=28?'stop':'keep'}},
 draw(s){
  let out=heading('From gene to protein',26);
  const w=24,x0=300-21*w/2,tk=Math.min(21,s.k),c=Math.max(0,s.k-21);
  out+=TF(x0,52,'DNA coding strand 5′→3′',13,C.muted,'start')+TF(x0,134,'template strand, read by the polymerase',13,C.muted,'start');
  for(let i=0;i<21;i++){const b=B4_GENE[i],x=x0+i*w;out+=B4_base(x+1,62,b,22,24,{size:13})+B4_base(x+1,90,B4_COMP[b],22,24,{size:13})}
  if(s.k<=21){const px=x0+tk*w;out+=R(px-4,58,30,60,'none',C.purple,8,'stroke-width="3"')+TF(Math.min(px-4,x0+21*w-110),152,'RNA polymerase',13,C.purple,'start')}
  out+=TF(x0,174,'mRNA',13,C.muted,'start');
  for(let i=0;i<tk;i++){const b=B4_GENE[i]==='T'?'U':B4_GENE[i];out+=B4_base(x0+i*w+1,180,b,22,24,{size:13})}
  for(let j=0;j<7;j++)if(3*j+3<=tk)out+=L(x0+j*3*w+3,208,x0+(j+1)*3*w-3,208,C.line,2);
  if(s.k>21){const cc=Math.min(c,7);out+=R(x0+(cc-1)*3*w-4,172,3*w+8,42,'none',C.green,10,'stroke-width="3"');out+=TF(x0+(cc-1)*3*w+1.5*w,230,'ribosome',13,C.green)}
  out+=TF(x0,256,'protein',13,C.muted,'start');
  for(let j=0;j<Math.min(c,7);j++){const a=B4_aa(B4_GENE.slice(3*j,3*j+3)),x=x0+j*3*w+1.5*w;
   if(a==='*')out+=TBF(x,292,'stop',14,C.coral);else{out+=Ci(x,288,22,C.greenp,C.green)+TF(x,293,B4_N3[a],13,C.ink);if(j>0)out+=L(x-3*w+22,288,x-22,288,C.green,3)}}
  out+=TF(300,350,s.k<21?`Transcribing: ${tk} of 21 bases`:s.k<28?`Translating: codon ${c} of 7`:'Done: a six-amino-acid chain, released at the stop codon',14,s.k===28?C.green:C.ink);
  return {svg:out,phase:s.k<=21?'The polymerase reads the template strand and builds mRNA that matches the coding strand, with U for T.':'The ribosome moves three bases at a time. Each codon names one amino acid; UAA means stop.'};
 }});

/* ---- tRNA matching (participant) ---- */
const B4_ANTI=c=>c.split('').reverse().map(b=>({A:'U',U:'A',G:'C',C:'G'})[b]).join('');
function B4_opts(c,seed){const cod=B4_GENE.slice(3*c,3*c+3).replace(/T/g,'U'),r=B4_rng(seed*17+c),pool=[];
 while(pool.length<3){const x='UCAG'[Math.floor(r()*4)]+'UCAG'[Math.floor(r()*4)]+'UCAG'[Math.floor(r()*4)];if(x!==cod&&!pool.includes(x)&&B4_aa(x)!=='*')pool.push(x)}
 return shuffled([cod,...pool],B4_mix(seed+c*5)).map(x=>({cod:x,anti:B4_ANTI(x),aa:B4_aa(x)}))}
SCENE({id:'transcription-translation-trna',name:'Matching the tRNA',tag:'Adaptors read the code',
 definition:'Transfer RNAs (tRNAs) are adaptors: each carries one amino acid and has three bases, the anticodon, that pair with a codon on the mRNA. The ribosome accepts only the tRNA whose anticodon pairs with the codon in front of it.',
 example:'For the codon GGC the matching tRNA has the anticodon GCC (read 3′ to 5′ as CCG pairs base by base) and carries glycine.',
 desc:'The ribosome on an mRNA with the next codon showing, four tRNAs to choose from, and the growing chain; a wrong choice is rejected.',
 research:'Crick, F. H. C. (1958). On protein synthesis: the adaptor hypothesis. Hoagland, M. B., Stephenson, M. L., Scott, J. F., Hecht, L. I. & Zamecnik, P. C. (1958). A soluble ribonucleic acid intermediate in protein synthesis. J. Biol. Chem. 231, 241–257. Bacterial ribosomes add about 15–20 amino acids a second.',
 dur:12,hint:'Press the tRNA whose anticodon pairs with the codon in the ribosome. Anticodons are written 5′→3′, so read them backwards to pair.',
 init:()=>({c:1,seed:4,msg:'',miss:0}),
 watch(p){return {c:Math.min(7,1+Math.floor(p*7)),seed:4,msg:'',miss:0,sim:true}},
 ui:[{b:'Start again',act:'again'}],
 on:{pick(s,v){if(s.c>=7)return;const o=B4_opts(s.c,s.seed)[Number(v)],want=B4_GENE.slice(3*s.c,3*s.c+3).replace(/T/g,'U');
   if(o.cod===want){s.c++;s.msg=s.c>=7?'':`Accepted: ${B4_N3[o.aa]} added.`}else{s.miss++;s.msg=`Rejected: anticodon ${o.anti} does not pair with ${want}.`}},
  again(s){s.c=1;s.seed=nextSeed();s.msg='';s.miss=0}},
 draw(s,f,X){
  let out=heading('Matching the tRNA to the codon',26);
  const cw=66,x0=300-7*cw/2;
  for(let j=0;j<7;j++){const cod=B4_GENE.slice(3*j,3*j+3).replace(/T/g,'U'),x=x0+j*cw;out+=R(x+2,156,cw-4,30,j===s.c?C.amberp:'#fff',j===s.c?C.amber:C.line,6)+TMF(x+cw/2,176,cod,15,C.ink,'middle','font-weight="700"')}
  out+=TF(x0-6,176,'mRNA',13,C.muted,'end');
  const rc=Math.min(s.c,6);out+=R(x0+(rc-1)*cw-6,128,2*cw+12,74,'none',C.green,14,'stroke-width="3"');
  out+=TF(x0+(rc-1)*cw+cw/2,218,'P site',13,C.green)+TF(x0+rc*cw+cw/2,218,'A site',13,C.green);
  // chain
  const done=Math.min(s.c,7);let cx=x0+(rc-1)*cw+cw/2;
  for(let j=done-1;j>=0;j--){const a=B4_aa(B4_GENE.slice(3*j,3*j+3)),y=110-(done-1-j)*0,x=cx-(done-1-j)*44;if(a==='*')continue;out+=Ci(x,92,17,C.greenp,C.green)+TF(x,97,B4_N3[a],13,C.ink);if(j<done-1)out+=L(x+17,92,x+27,92,C.green,3)}
  out+=TF(x0+(rc-1)*cw+cw/2,66,'growing chain',13,C.green);
  if(s.c<7){const opts=B4_opts(s.c,s.seed);
   out+=TF(300,252,s.sim?'A simulated reader picks the matching tRNA.':'Which tRNA pairs with the codon in the A site?',14,C.ink);
   opts.forEach((o,i)=>{const x=60+i*124;out+=B4_btn(X,'pick',i,`tRNA with anticodon ${o.anti} carrying ${B4_N3[o.aa]}`,x,266,112,62,'',{});
    out+=TMF(x+56,290,o.anti,16,C.ink,'middle','font-weight="700"')+TF(x+56,314,B4_N3[o.aa],13,C.muted)})}
  else out+=TBF(300,290,'Stop codon reached: the chain is released',16,C.green);
  out+=TF(300,354,s.msg||`codon ${Math.min(s.c+1,7)} of 7 · rejected so far: ${s.miss}`,14,s.msg.startsWith('Rejected')?C.coral:C.muted);
  return {svg:out,phase:'Each tRNA’s anticodon is written 5′→3′; reverse it and it pairs base for base with the codon (A–U, G–C). Only that tRNA delivers its amino acid.'};
 }});

/* ---- central dogma ---- */
const B4_FLOW=[
 {id:'dd',a:'DNA',b:'DNA',k:'general',t:'DNA → DNA: replication',d:'Every cell copies its DNA before dividing.'},
 {id:'dr',a:'DNA',b:'RNA',k:'general',t:'DNA → RNA: transcription',d:'Genes are copied into RNA by RNA polymerase.'},
 {id:'rp',a:'RNA',b:'Protein',k:'general',t:'RNA → protein: translation',d:'Ribosomes read mRNA into protein.'},
 {id:'rd',a:'RNA',b:'DNA',k:'special',t:'RNA → DNA: reverse transcription',d:'Retroviruses such as HIV carry reverse transcriptase (Temin & Mizutani; Baltimore, 1970).'},
 {id:'rr',a:'RNA',b:'RNA',k:'special',t:'RNA → RNA: RNA replication',d:'Many RNA viruses, such as influenza and coronaviruses, copy RNA directly.'},
 {id:'pn',a:'Protein',b:'DNA',k:'never',t:'Protein → nucleic acid or protein: not seen',d:'No known process reads a protein’s sequence back into RNA, DNA or another protein. Prions pass on a shape, not a sequence.'}];
SCENE({id:'transcription-translation-dogma',name:'The central dogma',tag:'Which way information flows',
 definition:'Francis Crick’s “central dogma” (1958, restated 1970) says that once sequence information has passed into protein it cannot get out again. Information flows DNA → DNA, DNA → RNA and RNA → protein; some viruses also go RNA → DNA or RNA → RNA; nothing goes back from protein.',
 example:'The 1970 discovery of reverse transcriptase was reported as overturning the dogma, but Crick replied that RNA → DNA had always been allowed: the dogma only forbids flow out of protein.',
 desc:'DNA, RNA and protein with arrows for each possible transfer; press an arrow to see whether it happens and where.',
 research:'Crick, F. (1970). Central dogma of molecular biology. Nature 227, 561–563. Temin, H. M. & Mizutani, S. (1970); Baltimore, D. (1970), reverse transcriptase, Nature 226. Prusiner, S. B. (1998), prions, PNAS 95.',
 dur:12,hint:'Press each arrow. Solid arrows are general transfers, dashed ones are special cases, and the red one is not known to happen.',
 init:()=>({sel:'dr'}),
 watch(p){return {sel:B4_FLOW[Math.min(5,Math.floor(p*6))].id}},
 ui:[],
 on:{sel(s,v){s.sel=v}},
 draw(s,f,X){
  let out=heading('The central dogma',26);
  const N={DNA:[130,130],RNA:[470,130],Protein:[300,300]};
  const col=k=>k==='general'?C.green:k==='special'?C.blue:C.coral;
  const arc=(fl,d,lab)=>{const sel=s.sel===fl.id,c=col(fl.k),st=fl.k==='general'?'':'stroke-dasharray="7 5"';return hit(X,'sel',fl.id,fl.t,P(d,c,sel?5:3,'none',st)+(lab?Ci(lab[0],lab[1],15,sel?c:'#fff',c)+TF(lab[0],lab[1]+5,'?',13,sel?'#fff':c):''))};
  out+=arc(B4_FLOW[0],'M100 100 C60 40 200 40 160 100',[130,52]);
  out+=arc(B4_FLOW[1],'M180 120 Q300 90 420 120',[300,102]);
  out+=arc(B4_FLOW[3],'M420 150 Q300 180 180 150',[300,170]);
  out+=arc(B4_FLOW[4],'M440 100 C400 40 540 40 500 100',[470,52]);
  out+=arc(B4_FLOW[2],'M460 165 Q420 250 345 290',[420,240]);
  out+=arc(B4_FLOW[5],'M255 290 Q180 250 150 170',[180,240]);
  for(const k in N){const [x,y]=N[k];out+=R(x-58,y-22,116,44,'#fff',C.ink,10,'stroke-width="2"')+TBF(x,y+6,k,16,C.ink)}
  const fl=B4_FLOW.find(q=>q.id===s.sel);
  out+=R(30,330,540,44,fl.k==='never'?C.coralp:fl.k==='special'?C.pale:C.greenp,'none',8)+TBF(300,349,fl.t,14,col(fl.k))+TF(300,367,fl.d,13,C.ink);
  return {svg:out,phase:'Green: transfers that happen in all cells. Blue dashed: transfers found in some viruses. Coral: transfers out of protein, which have never been found.'};
 }});

/* ================================================================ genetic-code */
SCENE({id:'genetic-code',name:'The genetic code',tag:'64 codons, 20 amino acids',
 definition:'The genetic code is the table that says which amino acid each three-base codon stands for. There are 4 × 4 × 4 = 64 codons for 20 amino acids and a stop signal, so most amino acids have several codons. AUG means methionine and also “start here”.',
 example:'In 1961 Marshall Nirenberg and Heinrich Matthaei added an RNA made only of U to a cell-free extract and got a protein made only of phenylalanine: UUU means Phe.',
 desc:'Three columns of buttons to build a codon, the amino acid it names, and the whole code as a 4 × 4 table with the chosen codon highlighted.',
 research:'Nirenberg, M. W. & Matthaei, J. H. (1961). The dependence of cell-free protein synthesis in E. coli upon naturally occurring or synthetic polyribonucleotides. PNAS 47, 1588–1602. The code was complete by 1966 (Khorana, Nirenberg and others; Cold Spring Harbor Symposium 31).',
 dur:12,hint:'Press one base in each of the three columns to build a codon. Letters in the table are one-letter amino-acid codes; * means stop.',
 init:()=>({c:[0,0,0]}),
 watch(p){const L=[[0,0,0],[2,0,3],[3,1,2],[0,3,3],[0,2,2],[1,3,0]];return {c:L[Math.min(5,Math.floor(p*6))]}},
 ui:[],
 on:{b(s,v){const [i,j]=String(v).split(':').map(Number);s.c=s.c.slice();s.c[i]=j}},
 draw(s,f,X){
  let out=heading('The genetic code',26);
  for(let i=0;i<3;i++){out+=TF(62+i*56,62,['1st','2nd','3rd'][i],13,C.muted);
   for(let j=0;j<4;j++){const b=B4_B[j],sel=s.c[i]===j,y=72+j*44;out+=hit(X,'b',i+':'+j,`Base ${i+1}: ${b}`,R(40+i*56,y,44,38,sel?B4_COL[b]:B4_PALE[b],B4_COL[b],8,'stroke-width="2"')+TMF(62+i*56,y+25,b,17,sel?'#fff':C.ink,'middle','font-weight="700"'))}}
  const cod=s.c.map(j=>B4_B[j]).join(''),a=B4_aa(cod);
  out+=R(36,256,172,96,a==='*'?C.coralp:C.greenp,'none',10)+TMF(122,288,cod,24,C.ink,'middle','font-weight="700"')+TBF(122,318,a==='*'?'Stop':B4_N3[a],18,a==='*'?C.coral:C.green)+TF(122,340,cod==='AUG'?'also the start signal':a==='*'?'ends the protein':'one-letter code '+a,13,C.muted);
  // Table: rows = first base, columns = second base, letters = third base U C A G.
  const tx=266,ty=74,cw=76,ch=62;
  for(let c=0;c<4;c++)out+=TBF(tx+c*cw+cw/2,ty-10,B4_B[c],15,B4_COL[B4_B[c]]);
  out+=TF(tx+2*cw,ty-28,'second base',13,C.muted);
  for(let r=0;r<4;r++){out+=TBF(tx-14,ty+r*ch+ch/2+5,B4_B[r],15,B4_COL[B4_B[r]]);
   for(let c=0;c<4;c++){const x=tx+c*cw,y=ty+r*ch,here=r===s.c[0]&&c===s.c[1];out+=R(x+2,y+2,cw-4,ch-4,here?C.amberp:'#fff',here?C.amber:C.grid,6);
    for(let t=0;t<4;t++){const aa=B4_CODE[r*16+c*4+t],on=here&&t===s.c[2];out+=TMF(x+14+t*16,y+ch/2+6,aa,15,on?C.coral:aa==='*'?C.coral:C.ink,'middle',on?'font-weight="800" text-decoration="underline"':'')}}}
  out+=TF(tx-14,ty-10,'1st',13,C.muted);
  out+=TF(tx+2*cw,ty+4*ch+20,'within a cell: third base U, C, A, G from left to right',13,C.muted);
  return {svg:out,phase:a==='*'?`${cod} is one of three stop codons (UAA, UAG, UGA).`:`${cod} means ${B4_N3[a]}. Look along its cell: codons that differ only in the third base often mean the same amino acid.`};
 }});

/* ---- reading frame ---- */
const B4_SENT='THEBIGREDFOXATETHEHEN';
function B4_applyEd(eds){let a=B4_SENT.split('');eds.forEach(([t,p])=>{if(t==='ins')a.splice(Math.min(p,a.length),0,'X');else if(a.length>1)a.splice(Math.min(p,a.length-1),1)});return a.join('')}
SCENE({id:'genetic-code-frames',name:'Reading frames',tag:'Read in threes, from a fixed start',
 definition:'Because the code is read in non-overlapping threes from a fixed starting point, adding or removing one base shifts the reading frame: every codon after it changes. Adding or removing three bases restores the frame, leaving only a short garbled stretch.',
 example:'Crick, Barnett, Brenner and Watts-Tobin (1961) combined small insertions and deletions in a virus gene: one or two broke it, but three insertions together gave a working gene. This showed the code is a triplet code.',
 desc:'A sentence of three-letter words read in threes; insert or delete letters and see which words are still read correctly.',
 research:'Crick, F. H. C., Barnett, L., Brenner, S. & Watts-Tobin, R. J. (1961). General nature of the genetic code for proteins. Nature 192, 1227–1232. The sentence analogy is Crick’s own teaching device.',
 dur:12,hint:'Pick a position with the slider, then Insert or Delete. Try one insertion, then two, then three.',
 init:()=>({eds:[],pos:4}),
 watch(p){const all=[['ins',4],['ins',10],['ins',16]];return {eds:all.slice(0,Math.min(3,Math.floor(p*4))),pos:4}},
 ui:[{range:'pos',label:'Position',min:1,max:24,get:s=>s.pos,act:'pos'},{b:'Insert X here',act:'ins'},{b:'Delete here',act:'del'},{b:'Clear edits',act:'clear'}],
 on:{pos(s,v){s.pos=Number(v)},ins(s){if(s.eds.length<6)s.eds=s.eds.concat([['ins',s.pos-1]])},del(s){if(s.eds.length<6)s.eds=s.eds.concat([['del',s.pos-1]])},clear(s){s.eds=[]}},
 draw(s){
  let out=heading('Reading frames: one letter shifts everything after it',26);
  const seq=B4_applyEd(s.eds),orig=B4_SENT.match(/.{3}/g),net=seq.length-B4_SENT.length;
  const trip=[];for(let i=0;i<seq.length;i+=3)trip.push(seq.slice(i,i+3));
  out+=TF(40,60,'original',13,C.muted,'start');orig.forEach((w,i)=>{out+=R(40+i*74,68,66,34,C.pale,'none',6)+TMF(73+i*74,91,w,17,C.ink,'middle','font-weight="700"')});
  out+=TF(40,134,'after your edits, read in threes',13,C.muted,'start');
  let good=0;const pr=Math.min(s.pos-1,seq.length);
  trip.forEach((w,i)=>{const row=i<7?0:1,col=i%7,x=40+col*74,y=142+row*48,ok=orig.includes(w)&&(w===orig[i]||w===orig[i-Math.round(net/3)]);if(ok)good++;
   out+=R(x,y,66,34,ok?C.greenp:C.coralp,ok?C.green:C.coral,6,'stroke-width="1.5"')+TMF(x+33,y+23,w,17,C.ink,'middle','font-weight="700"')});
  {const q=Math.min(s.pos-1,Math.max(0,seq.length-1)),ti=Math.floor(q/3),o=q%3,row=ti<7?0:1;out+=TF(40+(ti%7)*74+33+(o-1)*11,142+row*48+50,'▲',13,C.purple)}
  out+=TF(560,262,`position ${s.pos}`,13,C.purple,'end');
  out+=R(40,280,520,72,'#fff',C.grid,8);
  const nm=net===0?'0':net>0?'+'+net:String(net),inF=net%3===0;
  out+=TBF(300,306,`net change ${nm} letter${Math.abs(net)===1?'':'s'}: ${inF?'back in frame':'frame shifted'}`,16,inF?C.green:C.coral);
  out+=TF(300,332,`${good} of ${trip.length} words read as real words`,14,C.ink);
  out+=TF(300,372,'X marks an inserted letter; green words are read correctly',13,C.muted);
  return {svg:out,phase:inF?(s.eds.length?'The changes add up to a multiple of three, so reading falls back into step: only the words between the first and last change are garbled.':'Every three-letter word is read correctly.'):'The reading frame has slipped: every word after the change is nonsense, like a protein made of the wrong amino acids from that point on.'};
 }});

/* ---- redundancy ---- */
const B4_SENSE=range(64).map(i=>B4_B[i>>4]+B4_B[(i>>2)&3]+B4_B[i&3]).filter(c=>B4_aa(c)!=='*');
function B4_synByPos(){const out=[0,0,0];let tot=0;B4_SENSE.forEach(c=>{const a=B4_aa(c);for(let p=0;p<3;p++)for(const b of B4_B){if(b===c[p])continue;const m=c.slice(0,p)+b+c.slice(p+1);if(B4_aa(m)===a)out[p]++}});return out.map(v=>v/(B4_SENSE.length*3))}
const B4_SYN=B4_synByPos();
SCENE({id:'genetic-code-redundancy',name:'A forgiving code',tag:'Many changes change nothing',
 definition:'Because most amino acids have several codons, many single-base changes do not alter the protein at all. Such synonymous changes are concentrated in the third position of the codon; changes in the second position almost always change the amino acid.',
 example:'GCU, GCC, GCA and GCG all mean alanine: any change to the third base of an alanine codon is silent.',
 desc:'A chosen codon with all nine of its single-base variants, coloured by effect, beside the share of silent changes at each codon position across the whole code.',
 research:'Crick, F. H. C. (1966). Codon–anticodon pairing: the wobble hypothesis. J. Mol. Biol. 19, 548–555. Freeland, S. J. & Hurst, L. D. (1998). The genetic code is one in a million. J. Mol. Evol. 47, 238–248. Shares computed here from the standard code.',
 dur:12,hint:'Move the slider through the 61 codons that code for amino acids. Green variants are silent, blue change the amino acid, coral create a stop.',
 init:()=>({i:B4_SENSE.indexOf('GCU')}),
 watch(p){return {i:Math.min(60,Math.floor(p*61))}},
 ui:[{range:'i',label:'Codon',min:0,max:60,get:s=>s.i,act:'i',show:v=>B4_SENSE[v]+' ('+B4_N3[B4_aa(B4_SENSE[v])]+')'}],
 on:{i(s,v){s.i=Number(v)}},
 draw(s){
  let out=heading('A forgiving code: single-base changes',26);
  const c=B4_SENSE[s.i],a=B4_aa(c);let syn=0;
  out+=TMF(150,74,c,26,C.ink,'middle','font-weight="700"')+TF(150,98,B4_N3[a],15,C.green);
  for(let p=0;p<3;p++){out+=TF(26,148+p*62,`base ${p+1}`,13,C.muted,'start');let col=0;
   for(const b of B4_B){if(b===c[p])continue;const m=c.slice(0,p)+b+c.slice(p+1),ma=B4_aa(m),k=ma===a?'s':ma==='*'?'n':'m';if(k==='s')syn++;
    const x=86+col*72,y=120+p*62;out+=R(x,y,64,50,k==='s'?C.greenp:k==='n'?C.coralp:C.pale,k==='s'?C.green:k==='n'?C.coral:C.blue,6,'stroke-width="1.5"')+TMF(x+32,y+21,m,14,C.ink,'middle','font-weight="700"')+TF(x+32,y+41,B4_N3[ma],13,C.ink);col++}}
  out+=TF(194,330,`${syn} of 9 changes are silent`,15,syn?C.green:C.ink);
  const pl=B4_plot(380,92,190,200,[0,3],[0,1],{yt:[[0,'0'],[.5,'50%'],[1,'100%']],yl:'silent changes, whole code'});out+=pl.svg;
  B4_SYN.forEach((v,i)=>{const x=pl.X(i+.2),w=pl.X(i+.8)-x;out+=R(x,pl.Y(v),w,pl.Y(0)-pl.Y(v),C.green,'none',3)+TF(x+w/2,pl.Y(v)-6,Math.round(v*100)+'%',13,C.ink)+TF(x+w/2,pl.Y(0)+18,['1st','2nd','3rd'][i],13,C.muted)});
  out+=TF(475,334,'codon position',13,C.muted);
  return {svg:out,phase:`Across all 61 sense codons, about ${Math.round(B4_SYN[2]*100)}% of third-position changes are silent, ${Math.round(B4_SYN[0]*100)}% at the first position and ${Math.round(B4_SYN[1]*100)}% at the second.`};
 }});

/* ================================================================ gene-regulation */
SCENE({id:'gene-regulation',name:'The lac operon',tag:'A gene with a switch',
 definition:'Bacteria make the enzymes for digesting lactose only when they need them. In the lac operon a repressor protein sits on the operator and blocks transcription; lactose (as allolactose) pulls the repressor off. A second control, the CAP protein with cAMP, boosts transcription when glucose is scarce.',
 example:'E. coli given both glucose and lactose uses the glucose first and switches on the lac genes strongly only when the glucose runs out.',
 desc:'The lac operon drawn along the DNA with its repressor, CAP and RNA polymerase, for each combination of lactose and glucose, and the resulting level of transcription.',
 research:'Jacob, F. & Monod, J. (1961). Genetic regulatory mechanisms in the synthesis of proteins. J. Mol. Biol. 3, 318–356. Gilbert, W. & Müller-Hill, B. (1966). Isolation of the lac repressor. PNAS 56. Glucose also acts through inducer exclusion, not only cAMP (Görke & Stülke 2008).',
 dur:12,hint:'Switch lactose and glucose on and off. Transcription is high only when one condition holds.',
 init:()=>({lac:1,glu:0}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {lac:[0,1,1,0][k],glu:[1,1,0,0][k]}},
 ui:[{choose:[[1,'Lactose present'],[0,'No lactose']],label:'Lactose',get:s=>s.lac,act:'lac'},{choose:[[1,'Glucose present'],[0,'No glucose']],label:'Glucose',get:s=>s.glu,act:'glu'}],
 on:{lac(s,v){s.lac=Number(v)},glu(s,v){s.glu=Number(v)}},
 draw(s){
  let out=heading('The lac operon: a gene with a switch',26);
  const y=200,seg=[['CAP',40,96,C.amberp],['promoter',96,176,C.pale],['operator',176,246,C.coralp],['lacZ',246,376,C.greenp],['lacY',376,466,C.greenp],['lacA',466,560,C.greenp]];
  seg.forEach(([n,a,b,f])=>{out+=R(a,y,b-a,30,f,C.line,0)+TF((a+b)/2,y+20,n,13,C.ink)});
  out+=L(30,y,570,y,C.ink,2)+L(30,y+30,570,y+30,C.ink,2);
  const rep=!s.lac,cap=!s.glu,level=s.lac?(cap?1:.2):.02;
  if(rep)out+=P(`M181 ${y-2} Q211 ${y-50} 241 ${y-2} Z`,C.coral,2,C.coralp)+TF(211,y-40,'repressor',13,C.coral);
  else out+=P('M150 92 Q180 52 210 92 Z',C.coral,2,C.coralp)+Ci(180,80,7,C.purple)+TF(180,112,'repressor',13,C.coral)+TF(222,70,'+ allolactose',13,C.purple,'start');
  if(cap)out+=Ci(68,y-20,18,C.amberp,C.amber)+TF(68,y-15,'CAP',13,C.amber);
  if(!rep)out+=R(102,y-50,70,46,C.purplep,C.purple,20,'stroke-width="2"')+TF(137,y-22,'RNA pol',13,C.purple);
  if(level>.05){const th=1+5*level;out+=P(`M250 ${y-26} Q300 ${y-44} 350 ${y-26} T450 ${y-26} T550 ${y-26}`,C.green,th)+TF(400,y-52,'mRNA for the lactose enzymes',13,C.green)}
  // output
  out+=R(60,272,480,26,'#fff',C.grid,6)+R(60,272,480*level,26,C.green,'none',6);
  out+=TBF(300,326,level>.9?'High: lactose is there and glucose is not':level>.1?'Low: lactose is there, but glucose is preferred':'Off: no lactose, so the repressor blocks the operator',15,level>.9?C.green:level>.1?C.amber:C.coral);
  out+=TF(300,350,`repressor ${rep?'bound':'released'} · CAP ${cap?'bound (glucose low)':'not bound (glucose high)'}`,13,C.muted);
  return {svg:out,phase:'Two signals combine like a logic gate: lactose removes the brake (the repressor), and low glucose presses the accelerator (CAP). Only with both is transcription high.'};
 }});

/* ---- diauxie ---- */
function B4_diaux(g){const N0=.02,r1=1.0,r2=.55,lag=g>0&&g<1?.9:0,N1=N0+g,t1=g>0?Math.log(N1/N0)/r1:0,N2=N1+(1-g),t2=t1+lag+Math.log(N2/N1)/r2;
 return t=>t<t1?{N:N0*Math.exp(r1*t),e:0}:t<t1+lag?{N:N1,e:g<1?smooth((t-t1)/Math.max(lag,.01))*.8:0}:t<t2?{N:N1*Math.exp(r2*(t-t1-lag)),e:g<1?1:0}:{N:N2,e:g<1?1:0}}
SCENE({id:'gene-regulation-diauxie',name:'Two growth spurts',tag:'Monod’s diauxie',
 definition:'Bacteria given two sugars grow in two phases: first on the preferred sugar, then, after a pause while they switch on new genes, on the second. Jacques Monod called this diauxie (“double growth”); explaining the pause led to the lac operon.',
 example:'With glucose and lactose, E. coli grows quickly on glucose, stalls for a while when it runs out, then grows again more slowly on lactose.',
 desc:'A growth curve on a log scale for a mixture of glucose and lactose, with the share of glucose set by a slider, and the level of the lactose enzyme rising during the pause.',
 research:'Monod, J. (1942). Recherches sur la croissance des cultures bactériennes (thesis, Paris); Monod (1949), Annual Review of Microbiology 3, 371–394. Growth rates and lag here are illustrative.',
 dur:10,hint:'Change how much of the sugar is glucose. With only one sugar there is one growth phase and no pause.',
 init:()=>({g:.4}),
 watch(p){return {g:Math.round(p*20)/20}},
 ui:[{range:'g',label:'Glucose share',min:0,max:1,step:.05,get:s=>s.g,act:'g',show:v=>Math.round(v*100)+'%'}],
 on:{g(s,v){s.g=Number(v)}},
 draw(s){
  let out=heading('Diauxie: glucose first, then lactose',26);
  const f=B4_diaux(s.g),tm=12,pl=B4_plot(70,56,470,200,[0,tm],[Math.log10(.02),Math.log10(1.2)],{xt:[[0,'0'],[4,'4 h'],[8,'8 h'],[12,'12 h']],yt:[[Math.log10(.02),'0.02'],[Math.log10(.1),'0.1'],[Math.log10(1),'1']],yl:'cell density (log scale)',xl:'time'});out+=pl.svg;
  out+=B4_poly(range(241).map(i=>{const t=i/240*tm;return [pl.X(t),pl.Y(Math.log10(f(t).N))]}),C.blue,3);
  out+=B4_poly(range(241).map(i=>{const t=i/240*tm;return [pl.X(t),pl.Y(Math.log10(.02)+f(t).e*(Math.log10(1.2)-Math.log10(.02))*.9)]}),C.green,2,'stroke-dasharray="6 4"');
  out+=TF(530,232,'blue: cells',13,C.blue,'end')+TF(530,250,'green dashed: lactose enzyme',13,C.green,'end');
  out+=R(70,302,470*s.g,22,C.amber,'none',4)+R(70+470*s.g,302,470*(1-s.g),22,C.purple,'none',4,'opacity=".75"');
  if(s.g>.12)out+=TF(70+235*s.g,318,'glucose',13,'#fff');if(s.g<.88)out+=TF(70+470*s.g+235*(1-s.g),318,'lactose',13,'#fff');
  out+=TF(305,350,s.g===0||s.g===1?'One sugar: one growth phase, no pause':'Two phases with a pause between them while the lac genes switch on',14,C.ink);
  return {svg:out,phase:'The flat step in the blue curve is the pause: glucose has run out, and the cells are making the lactose enzymes (green) before they can grow again.'};
 }});

/* ---- bistable switch ---- */
const B4_SW={c:15,n:4,b:.01};
const B4_h=z=>B4_SW.b+(1-B4_SW.b)*z**B4_SW.n/(1+z**B4_SW.n);
const B4_relax=(I,x,c=B4_SW.c)=>{for(let i=0;i<300;i++)x=B4_h(I*(1+c*x));return x};
function B4_roots(I){const r=[];let prev=B4_h(I*1)-0;for(let i=1;i<=400;i++){const x=i/400,g=B4_h(I*(1+B4_SW.c*x))-x,x0=(i-1)/400,g0=B4_h(I*(1+B4_SW.c*x0))-x0;if(g0===0||g0*g<0){const xr=x0+(x-x0)*g0/(g0-g);r.push({x:xr,stable:g<g0})}}return r}
function B4_cells(path){const r=B4_rng(77),cs=range(24).map(()=>B4_SW.c*(.8+.4*r()));let xs=cs.map(()=>B4_SW.b);path.forEach(I=>{xs=xs.map((x,i)=>B4_relax(I,x,cs[i]))});return xs}
SCENE({id:'gene-regulation-switch',name:'All or none',tag:'A switch with memory',
 definition:'When a gene’s product helps bring in more of its own inducer, the system can have two stable states: off and fully on. Individual cells then switch all at once rather than gradually, and once on they stay on even if the inducer falls a little. This memory is called hysteresis.',
 example:'Aaron Novick and Milton Weiner (1957) found that at intermediate inducer levels a culture of E. coli was a mixture of fully induced and uninduced cells, not a population of half-induced ones.',
 desc:'A curve of how strongly a gene is expressed against the inducer level, with stable and unstable states, the current state, and 24 cells that are each either on or off; raise and then lower the inducer to see the memory.',
 research:'Novick, A. & Weiner, M. (1957). Enzyme induction as an all-or-none phenomenon. PNAS 43, 553–566. Ozbudak, E. M. et al. (2004). Multistability in the lactose utilization network of E. coli. Nature 427, 737–740. The model is a simple positive-feedback sketch.',
 dur:14,hint:'Raise the inducer slowly to the top, then lower it again. The cells switch off at a lower level than they switched on.',
 init:()=>({I:0,path:[0]}),
 watch(p){const I=p<.5?p*2*.4:(1-p)*2*.4,path=[];const n=Math.round(p*60);for(let k=0;k<=n;k++){const q=k/60;path.push(q<.5?q*2*.4:(1-q)*2*.4)}return {I,path}},
 ui:[{range:'I',label:'Inducer',min:0,max:.4,step:.01,get:s=>s.I,act:'I'},{b:'Reset cells',act:'reset'}],
 on:{I(s,v){const I=Number(v),last=s.path[s.path.length-1],n=Math.max(1,Math.ceil(Math.abs(I-last)/.01));for(let k=1;k<=n;k++)s.path.push(last+(I-last)*k/n);if(s.path.length>400)s.path=s.path.slice(-400);s.I=I},reset(s){s.I=0;s.path=[0]}},
 draw(s){
  let out=heading('All or none: a switch with memory',26);
  const pl=B4_plot(70,54,300,240,[0,.4],[0,1],{xt:[[0,'0'],[.2,'0.2'],[.4,'0.4']],yt:[[0,'off'],[1,'on']],xl:'inducer level',yl:'gene expression'});out+=pl.svg;
  const st=[],un=[];for(let i=0;i<=160;i++){const I=i/160*.4;B4_roots(I).forEach(r=>(r.stable?st:un).push([pl.X(I),pl.Y(r.x)]))}
  st.forEach(p=>{out+=Ci(p[0],p[1],1.6,C.blue)});un.forEach(p=>{out+=Ci(p[0],p[1],1.2,C.coral)});
  let x=B4_SW.b;s.path.forEach(I=>{x=B4_relax(I,x)});
  out+=Ci(pl.X(s.I),pl.Y(x),8,C.amber,'#fff');
  out+=TF(480,238,'blue: stable states',13,C.blue)+TF(480,256,'coral: unstable',13,C.coral);
  const xs=B4_cells(s.path),on=xs.filter(v=>v>.5).length;
  out+=TF(480,56,'24 cells',13,C.muted);
  xs.forEach((v,i)=>{const cx=410+(i%6)*28,cy=74+Math.floor(i/6)*28;out+=Ci(cx,cy,11,v>.5?C.green:'#fff',v>.5?C.green:C.line)});
  out+=TBF(480,206,`${on} on, ${24-on} off`,15,C.ink);
  const up=s.path.length>1&&s.path[s.path.length-1]>=s.path[s.path.length-2];
  out+=TF(300,366,`inducer ${s.I.toFixed(2)} · this cell is ${x>.5?'ON':'off'} · inducer ${up?'rising':'falling'}`,14,C.ink);
  return {svg:out,phase:on>0&&on<24?'A mixed culture: each cell is either fully on or off, as Novick and Weiner found. Cells differ slightly, so they flip at slightly different levels.':'Between the two switching points there are two stable states. Which one a cell sits in depends on its history: that is the memory.'};
 }});

/* ================================================================ mutation */
const B4_HBB='GTGCACCTGACTCCTGAGGAGAAG';
function B4_mut(s){const a=B4_HBB.split(''),i=s.pos-1;if(s.kind==='sub')a[i]=s.base;else if(s.kind==='ins')a.splice(i,0,s.base);else a.splice(i,1);return a.join('')}
function B4_class(o,m,kind){if(kind!=='sub')return 'frameshift';const po=B4_translate(o),pm=B4_translate(m);if(pm.includes('*')&&pm.indexOf('*')<po.length)return 'nonsense';return po.join('')===pm.join('')?'silent':'missense'}
SCENE({id:'mutation',name:'Kinds of mutation',tag:'One letter, many outcomes',
 definition:'A mutation is a change in DNA sequence. A single-base substitution can be silent (same amino acid), missense (a different amino acid) or nonsense (a stop codon that cuts the protein short). Inserting or deleting a base shifts the reading frame.',
 example:'Sickle-cell haemoglobin differs from normal haemoglobin by one amino acid: glutamic acid at position 6 of the β chain becomes valine, because GAG has become GTG.',
 desc:'The start of the human β-globin gene with its amino acids; choose a position, a base and a kind of change, and see the new protein and the kind of mutation.',
 research:'Ingram, V. M. (1957). Gene mutations in human haemoglobin: the chemical difference between normal and sickle cell haemoglobin. Nature 180, 326–328. Pauling, L., Itano, H. A., Singer, S. J. & Wells, I. C. (1949). Sickle cell anemia, a molecular disease. Science 110, 543–548. Allison, A. C. (1954), malaria protection in carriers.',
 dur:12,hint:'Pick a position and a base, choose substitute, insert or delete, or press Sickle-cell change.',
 init:()=>({pos:17,base:'T',kind:'sub'}),
 watch(p){const L=[{pos:3,base:'A',kind:'sub'},{pos:17,base:'T',kind:'sub'},{pos:22,base:'T',kind:'sub'},{pos:10,base:'A',kind:'del'}];return L[Math.min(3,Math.floor(p*4))]},
 ui:[{range:'pos',label:'Position',min:1,max:24,get:s=>s.pos,act:'pos'},{choose:[['A','A'],['C','C'],['G','G'],['T','T']],label:'Base',get:s=>s.base,act:'base'},{choose:[['sub','Substitute'],['ins','Insert'],['del','Delete']],label:'Change',get:s=>s.kind,act:'kind'},{b:'Sickle-cell change',act:'sickle'}],
 on:{pos(s,v){s.pos=Number(v)},base(s,v){s.base=v},kind(s,v){s.kind=v},sickle(s){s.pos=17;s.base='T';s.kind='sub'}},
 draw(s){
  let out=heading('Kinds of mutation: the β-globin gene',26);
  const m=B4_mut(s),same=s.kind==='sub'&&B4_HBB[s.pos-1]===s.base,k=same?'unchanged':B4_class(B4_HBB,m,s.kind),w=22,x0=300-24*w/2;
  const row=(seq,y,lab,hl)=>{let o=TF(x0,y-8,lab,13,C.muted,'start');for(let i=0;i<Math.min(seq.length,25);i++)o+=B4_base(x0+i*w,y,seq[i],20,24,{size:13,stroke:hl===i?C.purple:undefined});
   for(let j=0;j*3+3<=Math.min(seq.length,24);j++)o+=L(x0+j*3*w+2,y+30,x0+(j+1)*3*w-4,y+30,C.line,2);return o};
  const prot=(seq,y)=>{let o='';const pr=B4_translate(seq);pr.forEach((a,j)=>{if(j>=8)return;const x=x0+j*3*w+1.5*w-2,ref=B4_aa(B4_HBB.slice(3*j,3*j+3)),diff=a!==ref;o+=a==='*'?TBF(x,y+5,'stop',14,C.coral):Ci(x,y,20,diff?C.coralp:C.greenp,diff?C.coral:C.green)+TF(x,y+5,B4_N3[a],13,C.ink)});return o};
  out+=row(B4_HBB,64,'normal DNA (codons 1–8)',-1)+prot(B4_HBB,124);
  out+=row(m,186,'mutated DNA',s.pos-1)+prot(m,246);
  out+=TF(x0+(s.pos-1)*w+10,222,'▲',13,C.purple);
  const col={silent:C.green,missense:C.blue,nonsense:C.coral,frameshift:C.purple,unchanged:C.muted}[k];
  out+=R(120,290,360,40,'#fff',col,10,'stroke-width="2"')+TBF(300,316,k[0].toUpperCase()+k.slice(1),18,col);
  const sickle=s.kind==='sub'&&s.pos===17&&s.base==='T';
  out+=TF(300,354,sickle?'Glu → Val at position 6: the sickle-cell change (Ingram 1957)':{unchanged:'That base is already there: choose a different one',silent:'Same protein: the code has more than one codon for this amino acid',missense:'One amino acid changed; the effect depends on where',nonsense:'A stop codon: the protein is cut short',frameshift:'Every codon after the change is read differently'}[k],14,C.ink);
  return {svg:out,phase:same?'No change yet: pick a base different from the one in the normal gene.':`${k[0].toUpperCase()+k.slice(1)} mutation. Coral circles mark amino acids that differ from normal β-globin.`};
 }});

/* ---- Luria–Delbrück fluctuation test ---- */
function B4_fluct(model,seed){const G=20,mu=2e-7,r=B4_rng(seed*101+7),out=[];
 for(let c=0;c<20;c++){if(model==='induced'){out.push(B4_poisson(r,G*mu*2**G));continue}
  let m=0;for(let g=0;g<G;g++){const k=B4_poisson(r,mu*2**g);m+=k*2**(G-g-1)}out.push(m)}return out}
SCENE({id:'mutation-luria-delbruck',name:'The fluctuation test',tag:'Do mutations wait for need?',
 definition:'Do bacteria become resistant to a virus because they meet it, or do resistant mutants arise at random beforehand? If mutations come first, a mutant that appears early in a culture leaves many descendants, so counts vary wildly between cultures (“jackpots”). If exposure causes them, counts vary only a little, like a Poisson distribution.',
 example:'Salvador Luria and Max Delbrück (1943) found huge variation between parallel cultures, with a few jackpots: mutations arise at random, before selection. Esther and Joshua Lederberg confirmed this with replica plating in 1952.',
 desc:'Twenty parallel cultures plated on a virus, with the number of resistant colonies in each under the random-mutation or the induced model, and the variance-to-mean ratio.',
 research:'Luria, S. E. & Delbrück, M. (1943). Mutations of bacteria from virus sensitivity to virus resistance. Genetics 28, 491–511. Lederberg, J. & Lederberg, E. M. (1952). Replica plating and indirect selection of bacterial mutants. J. Bacteriol. 63, 399–406. Simulated: 2²⁰ cells per culture, mutation rate 2 × 10⁻⁷ per division.',
 dur:12,hint:'Choose a model and press Plate 20 new cultures a few times. Compare the spread of the counts.',
 init:()=>({model:'random',seed:3}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {model:k%2?'induced':'random',seed:3+Math.floor(k/2)}},
 ui:[{choose:[['random','Random, before exposure'],['induced','Caused by exposure']],label:'Model',get:s=>s.model,act:'model'},{b:'Plate 20 new cultures',act:'again'}],
 on:{model(s,v){s.model=v},again(s){s.seed=nextSeed()}},
 draw(s){
  let out=heading('Luria and Delbrück’s fluctuation test',26);
  const v=B4_fluct(s.model,s.seed),mean=sum(v)/20,vr=sum(v.map(x=>(x-mean)**2))/19,cap=40;
  const pl=B4_plot(70,60,480,200,[0,20],[0,cap],{yt:[[0,'0'],[20,'20'],[40,'40+']],yl:'resistant colonies per culture',xl:'20 parallel cultures',xlDy:22});out+=pl.svg;
  v.forEach((x,i)=>{const h=Math.min(cap,x),X0=pl.X(i+.15),w=pl.X(i+.85)-X0;out+=R(X0,pl.Y(h),w,pl.Y(0)-pl.Y(h),x>cap?C.coral:s.model==='random'?C.blue:C.green,'none',2);if(x>=10||x>cap)out+=TF(X0+w/2,pl.Y(h)-5,String(x),13,x>cap?C.coral:C.ink)});
  out+=counter(90,306,'mean',mean.toFixed(1),C.ink)+counter(240,306,'variance',vr.toFixed(1),C.ink)+counter(390,306,'variance ÷ mean',(vr/(mean||1)).toFixed(1),vr/(mean||1)>3?C.coral:C.green,130);
  return {svg:out,phase:s.model==='random'?'Random mutation gives jackpots: a mutant arising early leaves thousands of resistant descendants, so the variance is far larger than the mean. This is what Luria and Delbrück saw.':'If exposure caused resistance, every culture would have about the same chance, and the counts would scatter like a Poisson distribution: variance about equal to the mean.'};
 }});

/* ---- McClintock's jumping genes ---- */
function B4_spots(when,rate,seed){const r=B4_rng(seed*13+3),n=Math.min(260,Math.round(rate*2.5*2**((when-2)/1.15))),rad=3+2.2*2**((12-when)/2),out=[];
 for(let i=0;i<n;i++){let x,y;do{x=r()*2-1;y=r()*2-1}while(x*x+y*y>1);out.push([x,y,rad*(.7+.6*r())])}return out}
SCENE({id:'mutation-transposons',name:'Jumping genes',tag:'McClintock’s spotted maize',
 definition:'Transposons are stretches of DNA that can move to new places in the genome. Barbara McClintock found them in maize in the 1940s: an element sitting in a pigment gene leaves a kernel colourless, and when it jumps out in one cell, that cell’s descendants are coloured again, giving a spot.',
 example:'A kernel whose element jumps out early in development has a few large purple sectors; one where it jumps late has many tiny specks.',
 desc:'A maize kernel with purple spots where the element has left the pigment gene; sliders set when in development and how often it jumps.',
 research:'McClintock, B. (1950). The origin and behavior of mutable loci in maize. PNAS 36, 344–355; Nobel Prize 1983. Lander, E. S. et al. (2001), transposon-derived sequence ≈ 45% of the human genome, Nature 409. ENCODE (2012) claimed 80% “biochemical function”; Graur et al. (2013) and Rands et al. (2014, ≈ 8% under selection) disputed it.',
 dur:12,hint:'Move the timing slider from early to late and watch the spots shrink and multiply. Press New kernel for another.',
 init:()=>({when:6,rate:1,seed:2}),
 watch(p){return {when:Math.round(2+9*p),rate:1,seed:2}},
 ui:[{range:'when',label:'When it jumps',min:2,max:11,get:s=>s.when,act:'when',show:v=>v<5?'early':v<9?'middle':'late'},{range:'rate',label:'How often',min:.3,max:2,step:.1,get:s=>s.rate,act:'rate',show:v=>v.toFixed(1)+'×'},{b:'New kernel',act:'again'}],
 on:{when(s,v){s.when=Number(v)},rate(s,v){s.rate=Number(v)},again(s){s.seed=nextSeed()}},
 draw(s){
  let out=heading('Jumping genes: McClintock’s spotted maize',26);
  const cx=170,cy=206,rx=110,ry=140,sp=B4_spots(s.when,s.rate,s.seed);
  out+=`<defs><clipPath id="b4kernel"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath></defs>`;
  out+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#f6e9b8" stroke="#c9a94a" stroke-width="2.5"/>`;
  out+=G(sp.map(([x,y,r])=>Ci(cx+x*rx,cy+y*ry,r,'#6d3a8c')).join(''),'clip-path="url(#b4kernel)"');
  out+=TF(170,370,`${sp.length} spots`,14,C.ink);
  out+=R(320,60,250,286,C.pale,'none',10);
  const lines=['Colourless: the element sits','inside the pigment gene.','','Purple spot: in one cell it','jumped out; every daughter of','that cell is coloured again.','','Early jumps → big sectors.','Late jumps → small specks.'];
  lines.forEach((t,i)=>{out+=TF(336,86+i*22,t,13,C.ink,'start')});
  out+=TF(336,300,'Transposon-derived DNA is about',13,C.muted,'start')+TF(336,320,'45% of the human genome.',13,C.muted,'start');
  return {svg:out,phase:s.when<5?'An early jump: few cells have divided yet, so each event colours a large share of the kernel.':s.when>8?'A late jump: each event colours only a handful of cells, so the kernel is finely speckled.':'Spot size records when the element moved; the number of spots records how often.'};
 }});
