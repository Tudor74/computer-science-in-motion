/* ===================== Biology era 1 · Cells (1665–1900) ===================== */
// Axes in a box: returns {svg, X, Y} mapping data to drawing units.
function B1_axes(x,y,w,h,xr,yr,o={}){
 const X=v=>x+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const t of o.xt||[]){const v=Array.isArray(t)?t[0]:t,lab=Array.isArray(t)?t[1]:t;s+=L(X(v),y,X(v),y+h,'#eef3f6',1)+TF(X(v),y+h+15,lab,13,C.muted)}
 for(const t of o.yt||[]){const v=Array.isArray(t)?t[0]:t,lab=Array.isArray(t)?t[1]:t;s+=L(x,Y(v),x+w,Y(v),'#eef3f6',1)+TF(x-6,Y(v)+4,lab,13,C.muted,'end')}
 if(o.xl)s+=TF(x+w/2,y+h+31,o.xl,13,C.muted);
 if(o.yl)s+=TF(x+8,y+16,o.yl,13,C.muted,'start');
 return {svg:s,X,Y};
}
const B1_path=pts=>'M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L');
const B1_n=(v,d=1)=>(+v).toFixed(d);
const B1_sci=v=>{if(v<1e6)return Math.round(v).toLocaleString('en-GB');if(v<1e9)return B1_n(v/1e6,1)+' million';if(v<1e12)return B1_n(v/1e9,1)+' billion';const e=Math.floor(Math.log10(v));return B1_n(v/10**e,1)+' × 10'+String(e).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('')};
const B1_int=v=>Math.round(v).toLocaleString('en-GB');
// A soft blob: concentric circles whose opacities add up to a rough Gaussian spot.
function B1_blob(x,y,r,col){let out='';for(let i=5;i>=1;i--)out+=Ci(x,y,r*i/3.2,col,'none',`opacity=".2"`);return out}
// Greedy word wrap to at most n characters per line.
function B1_wrap(t,n){const out=[];let cur='';for(const w of String(t).split(' ')){if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out}
// Card with a title and wrapped lines.
function B1_card(x,y,w,title,lines,col=C.blue){
 let out=R(x,y,w,30+lines.length*19,'#fff',C.grid,8)+TBF(x+12,y+21,title,14,col,'start');
 lines.forEach((l,i)=>{out+=TF(x+12,y+42+i*19,l,13,C.ink,'start')});return out;
}

/* ---------- Lesson: microscopes ---------- */
const B1_INST={
 eye:{name:'Unaided eye',res:100,mag:'1×',note:'about 0.1 mm at reading distance'},
 leeu:{name:'Leeuwenhoek’s single lens',res:1.35,mag:'about 270×',note:'best surviving lens, measured in modern tests'},
 light:{name:'Modern light microscope',res:.2,mag:'up to 1,500×',note:'Abbe limit: λ ÷ 2NA ≈ 550 nm ÷ 2.8'}
};
SCENE({id:'microscopes',name:'Microscopes',tag:'Magnifying is not the same as resolving',
 definition:'A microscope’s power is not its magnification but its resolution: the smallest gap between two points that can still be seen as two. Below that gap, more magnification only gives a bigger blur.',
 example:'The unaided eye resolves about 0.1 mm. Antonie van Leeuwenhoek’s tiny single lenses resolved about 1.35 µm, enough to see bacteria in the 1670s. A modern light microscope reaches about 0.2 µm, the limit set by the wavelength of light (Abbe, 1873).',
 desc:'Two point-like objects a chosen distance apart, imaged by three instruments. Each point becomes a blur as wide as the instrument’s resolution; the brightness profile beneath shows whether a dip separates the two.',
 research:['Hooke, R. (1665). Micrographia. Royal Society.','van Leeuwenhoek, A. (1677). Letter on “little animals” (protists and bacteria), Philosophical Transactions 12.','Abbe, E. (1873). Beiträge zur Theorie des Mikroskops und der mikroskopischen Wahrnehmung.','Resolution of a surviving Leeuwenhoek lens (Utrecht): about 1.35 µm (van Zuylen, 1981).'],
 dur:12,hint:'Pick an instrument, then shrink the gap between the two points. Watch for the moment the two blurs merge into one.',
 init:()=>({inst:'leeu',gap:4}),
 watch(p){return p<.5?{inst:'leeu',gap:+B1_n(Math.max(.4,6-11*p),1)}:{inst:'light',gap:+B1_n(Math.max(.1,1.2-2.2*(p-.5)),2)}},
 ui:[{choose:[['eye','Eye'],['leeu','Leeuwenhoek'],['light','Modern']],label:'Instrument',get:s=>s.inst,act:'inst'},{range:'gap',label:'Gap',min:-1,max:2.3,step:.05,get:s=>Math.log10(s.gap),act:'gap',show:v=>{const g=10**v;return g>=10?B1_n(g,0)+' µm':g>=1?B1_n(g,1)+' µm':B1_n(g,2)+' µm'}}],
 on:{inst(s,v){s.inst=v},gap(s,v){s.gap=10**v}},
 draw(s){
  const I=B1_INST[s.inst],res=I.res,d=s.gap,ok=d>=res;let out=heading(I.name+': '+I.mag);
  // Image panel: the pair always drawn 160 units apart; blur scales with res/d.
  out+=R(40,52,520,150,'#11202a','none',10);
  const blur=clamp(160*res/d,6,520),cx=300;
  out+=`<defs><clipPath id="b1-scope"><rect x="40" y="52" width="520" height="150" rx="10"/></clipPath></defs><g clip-path="url(#b1-scope)">`+B1_blob(cx-80,127,blur/2,'#ffe9a8')+B1_blob(cx+80,127,blur/2,'#ffe9a8')+'</g>';
  if(blur<20)out+=Ci(cx-80,127,4,'#fff')+Ci(cx+80,127,4,'#fff');
  out+=TF(52,72,'what you see',13,'#c9d6de','start');
  // Brightness profile.
  const A=B1_axes(80,222,440,90,[-2.2,2.2],[0,2.1],{});out+=A.svg;
  const sg=res/2.355/d,prof=x=>Math.exp(-((x+.5)**2)/(2*sg*sg))+Math.exp(-((x-.5)**2)/(2*sg*sg));
  const xs=range(221).map(i=>-2.2+i*.02),mx=Math.max(...xs.map(prof));
  out+=P(B1_path(xs.map(x=>[A.X(x),A.Y(2*prof(x)/mx)])),ok?C.green:C.coral,3);
  out+=L(A.X(-.5),312,A.X(-.5),318,C.muted,2)+L(A.X(.5),312,A.X(.5),318,C.muted,2)+TF(300,336,`gap ${d>=1?B1_n(d,1):B1_n(d,2)} µm · resolution ${res} µm (${I.note})`,13,C.muted);
  const dip=prof(0)/mx;
  out+=TBF(300,362,ok?`Resolved: two points, with a dip to ${Math.round(dip*100)}% between them`:'Not resolved: one blur, however much you magnify',15,ok?C.green:C.coral);
  return {svg:out,phase:ok?`The gap (${d>=1?B1_n(d,1):B1_n(d,2)} µm) is larger than this instrument’s resolution, so the brightness dips between the two points and you see two.`:`The gap is smaller than the resolution (${res} µm). The two blurs overlap into one hump; magnifying the picture would only enlarge the blur.`};
 }});

const B1_OBJ=[
 {n:'Hen’s egg',k:'egg',m:5e-2},{n:'Ant',k:'ant',m:3e-3},{n:'Human egg cell',k:'human egg',m:1.2e-4},{n:'Width of a hair',k:'hair',m:7e-5,dx:16},
 {n:'Red blood cell',k:'red cell',m:7.5e-6},{n:'E. coli bacterium',k:'E. coli',m:2e-6},{n:'Influenza virus',k:'flu virus',m:1e-7},{n:'Ribosome',k:'ribosome',m:2.5e-8},{n:'DNA helix (width)',k:'DNA',m:2e-9}];
const B1_TOOLS=[{n:'eye',lim:1e-4,col:C.green},{n:'light microscope',lim:2e-7,col:C.blue},{n:'electron microscope',lim:1e-10,col:C.purple}];
SCENE({id:'microscopes-scale',name:'The scale of life',tag:'Eight powers of ten',
 definition:'Living things span more than seven powers of ten, from eggs you can hold to molecules a few nanometres wide. Each kind of instrument opens a band of that range: the eye down to about 0.1 mm, light microscopes to about 0.2 µm, electron microscopes to below a nanometre.',
 example:'A red blood cell (7.5 µm) needs a light microscope. A flu virus (about 100 nm) is below the light limit and was first seen with the electron microscope, built by Ernst Ruska and Max Knoll from 1931.',
 desc:'A logarithmic ruler from 10 cm down to 1 nm, with objects placed at their size and the three instruments’ ranges shaded beneath. Pressing an object shows which instruments can resolve it.',
 research:['Abbe, E. (1873). The diffraction limit of the light microscope.','Knoll, M. & Ruska, E. (1932). Das Elektronenmikroskop. Zeitschrift für Physik 78.'],
 dur:10,hint:'Press an object on the ruler to see its size and which instruments can show it.',
 init:()=>({sel:4}),
 watch(p){return {sel:Math.min(8,Math.floor(p*9))}},
 ui:[{range:'sel',label:'Object',min:0,max:8,step:1,get:s=>s.sel,act:'sel',show:v=>B1_OBJ[v].n}],
 on:{sel(s,v){s.sel=+v},pick(s,a){s.sel=+a}},
 draw(s,f,X){
  const xl=m=>60+480*(-1-Math.log10(m))/8;let out=heading('From eggs to molecules (each step is ×10 smaller)');
  out+=L(60,150,540,150,C.ink,2.5);
  const labs=['10 cm','1 cm','1 mm','100 µm','10 µm','1 µm','100 nm','10 nm','1 nm'];
  labs.forEach((t,i)=>{const x=60+60*i;out+=L(x,144,x,156,C.ink,2)+TF(x,174,t,13,C.muted)});
  B1_TOOLS.forEach((t,i)=>{const y=196+i*30,x2=Math.min(540,xl(t.lim));out+=R(60,y,x2-60,20,t.col,'none',5,'opacity=".18"')+L(x2,y,x2,y+20,t.col,3)+TF(x2-6,y+15,t.n+(t.lim<1e-9?' (below 1 nm)':''),13,t.col,'end')});
  B1_OBJ.forEach((o,i)=>{const x=xl(o.m),on=i===s.sel,y=i%2?112:86;
   out+=L(x,y+8,x,146,on?C.coral:C.line,on?2.5:1.5)+hit(X,'pick',i,o.n,Ci(x,y,on?9:7,on?C.coral:C.blue)+TF(x+(o.dx||0),y-13,o.k,13,on?C.coral:C.ink,o.dx?'start':'middle'))});
  const o=B1_OBJ[s.sel],sees=B1_TOOLS.filter(t=>o.m>=t.lim).map(t=>t.n);
  const sz=o.m>=1e-3?B1_n(o.m*1000,o.m>=1e-2?0:1)+' mm':o.m>=1e-6?B1_n(o.m*1e6,o.m>=1e-5?0:1)+' µm':B1_n(o.m*1e9,0)+' nm';
  out+=B1_card(60,292,480,`${o.n}: about ${sz}`,[`Can be resolved by: ${sees.join(', ')}.`,sees.length===1?'Only an electron microscope (or X-ray methods) shows it.':sees.length===3?'Visible without any instrument.':o.m>=5e-5?'The eye can see it is there, but not its detail.':'Too small for the unaided eye.']);
  return {svg:out,phase:`${o.n}, about ${sz}. Each tick on the ruler is ten times smaller than the one before, so the distance from an egg to a DNA helix is seven tenfold steps.`};
 }});

SCENE({id:'microscopes-cork',name:'Hooke counts the cells',tag:'Rerun the arithmetic of 1665',
 definition:'Robert Hooke sliced cork thinly, saw it divided into tiny boxes and called them “cells”. He counted them along a measured line and multiplied up to estimate how many fill a cubic inch.',
 example:'Hooke counted about 60 cells in one eighteenth of an inch: about 1,080 to the inch, 1,166,400 to the square inch, and 1,259,712,000 to the cubic inch, “a thing almost incredible”.',
 desc:'A slice of cork drawn as rows of boxes, with a ruler marking one eighteenth of an inch. The counted cells along the ruler are multiplied up to an inch, a square inch and a cubic inch, beside Hooke’s own figures.',
 research:'Hooke, R. (1665). Micrographia, Observation XVIII: “Of the Schematisme or Texture of Cork”.',
 dur:10,hint:'Change how many cells you count in one eighteenth of an inch and see how the estimate for a cubic inch changes. Hooke counted about 60.',
 init:()=>({n:60,c:60}),
 watch(p){return {n:60,c:Math.min(60,Math.round(p*80))}},
 ui:[{range:'n',label:'Cells in 1/18 inch',min:40,max:80,step:1,get:s=>s.n,act:'n',show:v=>v+' cells'}],
 on:{n(s,v){s.n=+v;s.c=+v}},
 draw(s){
  let out=heading('Counting cork cells along a line');
  const w=480/s.n*3;// show one third of the 1/18 inch at this scale
  out+=R(60,56,480,96,'#f6eedd','none',6);
  for(let r=0;r<4;r++)for(let i=0;i*w<480;i++){const x=60+i*w+(r%2?w/2:0);if(x+w>540)continue;const lit=r===1&&i<Math.min(s.c,Math.floor(480/w));out+=R(x+1.5,60+r*23,w-3,20,lit?'#e6b86a':'#fff6e6','#b88a4a',3)}
  out+=L(60,166,540,166,C.ink,2)+L(60,160,60,172,C.ink,2)+L(540,160,540,172,C.ink,2)+TF(300,188,'one third of 1/18 inch (≈ 0.47 mm) shown; highlighted cells are counted',13,C.muted);
  const inch=s.n*18,sq=inch*inch,cu=inch*inch*inch,counted=Math.min(s.c,s.n);
  const rows=[['Counted in 1/18 inch',B1_int(counted),'about 60'],['Per inch (× 18)',B1_int(counted*18),'“neer eleven hundred”'],['Per square inch',B1_int((counted*18)**2),'1,166,400'],['Per cubic inch',B1_int((counted*18)**3),'1,259,712,000']];
  out+=TBF(330,216,'your estimate',13,C.blue,'end')+TBF(530,216,'Hooke (1665)',13,C.coral,'end');
  rows.forEach((r,i)=>{const y=242+i*28;out+=L(60,y+9,540,y+9,'#eef3f6',1)+TF(70,y,r[0],14,C.ink,'start')+TBF(330,y,r[1],15,C.blue,'end')+TF(530,y,r[2],14,C.coral,'end')});
  out+=TF(300,362,`1 cubic inch = 16.4 cm³, so about ${B1_int(cu/16.39)} cells per cubic centimetre`,13,C.muted);
  return {svg:out,phase:counted<s.n?'Counting the cells along the line, as Hooke did through his microscope.':`${s.n} cells in 1/18 inch makes ${B1_int(inch)} per inch. Squaring and cubing multiplies any counting error: ±5 cells changes the cubic-inch total by about a quarter.`};
 }});

/* ---------- Lesson: cell-theory ---------- */
const B1_EVENTS=[
 {y:1665,who:'Hooke',t:'names “cells” in cork',l:['Empty walls of dead plant cells, seen at about 50×.','He did not know they had once been alive.']},
 {y:1676,who:'Leeuwenhoek',t:'sees living “animalcules”',l:['Protists and bacteria in rain water and pepper water.','The first view of single-celled life.']},
 {y:1831,who:'Brown',t:'describes the nucleus',l:['Robert Brown sees a dark body in orchid cells','and names it the nucleus.']},
 {y:1838,who:'Schleiden',t:'all plants are made of cells',l:['But he wrongly thought new cells crystallise','out of fluid inside old ones.']},
 {y:1839,who:'Schwann',t:'animals too are made of cells',l:['Cartilage, nerve and muscle share one plan:','the cell is the unit of all life.']},
 {y:1852,who:'Remak',t:'cells only arise by division',l:['Robert Remak shows it in frog embryos.','His priority was long overlooked.']},
 {y:1855,who:'Virchow',t:'“omnis cellula e cellula”',l:['Rudolf Virchow makes the phrase famous,','without crediting Remak’s evidence.']}];
SCENE({id:'cell-theory',name:'Cell theory',tag:'Every living thing is made of cells',
 definition:'Cell theory has three claims: all living things are made of one or more cells; the cell is the basic unit of life; and every cell comes from an existing cell.',
 example:'Schleiden (plants, 1838) and Schwann (animals, 1839) gave the first two claims. The third came from Robert Remak’s work on dividing embryo cells (1852), made famous by Rudolf Virchow in 1855 as “omnis cellula e cellula”: every cell from a cell.',
 desc:'A timeline from Hooke’s cork in 1665 to Virchow in 1855. Each event can be opened; the three claims of cell theory light up as the evidence for them arrives.',
 research:['Schleiden, M. J. (1838). Beiträge zur Phytogenesis.','Schwann, T. (1839). Mikroskopische Untersuchungen.','Remak, R. (1852). Über extracellulare Entstehung thierischer Zellen.','Virchow, R. (1855). Cellular-Pathologie; on Remak’s priority see Harris (1999), The Birth of the Cell.'],
 dur:12,hint:'Press each event on the timeline. Watch which claim of cell theory it supports, and notice that the famous phrase was not first shown by the man who made it famous.',
 init:()=>({sel:6}),
 watch(p){return {sel:Math.min(6,Math.floor(p*7.5))}},
 ui:[{range:'sel',label:'Event',min:0,max:6,step:1,get:s=>s.sel,act:'sel',show:v=>B1_EVENTS[v].y+' '+B1_EVENTS[v].who}],
 on:{sel(s,v){s.sel=+v},pick(s,a){s.sel=+a}},
 draw(s,f,X){
  let out=heading('From cork to “every cell from a cell”');
  out+=L(70,110,530,110,C.ink,2.5)+TF(300,152,'(events evenly spaced, not to time scale)',13,C.muted);
  B1_EVENTS.forEach((e,i)=>{const x=80+i*73.3,on=i===s.sel,past=i<=s.sel;
   out+=hit(X,'pick',i,e.y+' '+e.who,Ci(x,110,on?10:7,on?C.coral:past?C.blue:'#fff',past?'none':C.line)+TF(x,88,e.who,13,on?C.coral:C.ink)+TF(x,134,e.y,13,on?C.coral:C.muted))});
  const e=B1_EVENTS[s.sel];out+=B1_card(60,172,480,`${e.y} · ${e.who}: ${e.t}`,e.l,C.coral);
  const tenets=[['All living things are made of cells',3],['The cell is the basic unit of life',4],['Every cell comes from a cell',5]];
  tenets.forEach(([t,k],i)=>{const on=s.sel>=k,y=268+i*32;out+=R(60,y,480,26,on?C.greenp:'#f3f6f8','none',6)+TF(76,y+18,(on?'✓ ':'· ')+t,14,on?C.green:C.muted,'start')});
  return {svg:out,phase:`${e.y}: ${e.who} — ${e.t}. ${s.sel<3?'No general theory yet: cells are seen, but not understood.':s.sel<5?'The first two claims are in place; how new cells arise is still wrong.':'All three claims now have evidence.'}`};
 }});

// Seeded positions for the dish in the "cells from cells" scene.
const B1_DIV=(()=>{const r=rng(7);const pts=[[0,0]];const parent=[-1],gen=[0];
 for(let g=1;g<=5;g++){const n=pts.length;for(let i=0;i<n;i++){if(gen[i]!==g-1)continue;const a=r()*Math.PI*2,d=34/Math.sqrt(g+.5);
  const [x,y]=pts[i];pts[i]=[x-Math.cos(a)*d/2,y-Math.sin(a)*d/2];pts.push([x+Math.cos(a)*d/2,y+Math.sin(a)*d/2]);parent.push(i);gen.push(g);gen[i]=g}}
 return {pts,parent};})();
const B1_FREE=(()=>{const r=rng(31);return range(32).map(i=>[(r()-.5)*170,(r()-.5)*170,1+Math.floor(r()*5)])})();
SCENE({id:'cell-theory-division',name:'Cells from cells',tag:'Free formation or division?',
 definition:'Schleiden and Schwann thought new cells could form out of a structureless fluid, a little like crystals. Remak and then Virchow showed that new cells arise only by the division of existing ones.',
 example:'In a dish where cells form freely, new cells would appear anywhere and have no parent. Under division, every cell can be traced back through an unbroken family tree to the first cell. Observation of dividing embryo cells settled it for division.',
 desc:'Two predictions side by side over five generations: on the left, cells appearing in fluid with no ancestors; on the right, cells that each split in two, with the family tree drawn beneath.',
 research:['Schwann, T. (1839). Free cell formation from the “cytoblastema”.','Remak, R. (1852 and 1855). Untersuchungen über die Entwickelung der Wirbelthiere.','Virchow, R. (1858). Die Cellularpathologie.'],
 dur:10,hint:'Move through the generations and compare the two dishes. Only one gives every cell a parent.',
 init:()=>({g:3,model:'both'}),
 watch(p){return {g:Math.min(5,Math.floor(p*6.5)),model:'both'}},
 ui:[{range:'g',label:'Generation',min:0,max:5,step:1,get:s=>s.g,act:'g',show:v=>'generation '+v}],
 on:{g(s,v){s.g=+v}},
 draw(s){
  let out=heading('Two ideas about where new cells come from');
  out+=TBF(150,62,'Free formation (Schwann, 1839)',14,C.coral)+TBF(450,62,'Division (Remak, 1852)',14,C.green);
  out+=Ci(150,170,95,'#fdf3ee',C.coralp)+Ci(450,170,95,'#eef7f3',C.greenp);
  const free=B1_FREE.filter(p=>p[2]<=s.g+ (s.g?0:0)).slice(0,Math.min(32,2**s.g));
  free.forEach(([x,y])=>{out+=Ci(150+x*.9,170+y*.9,7,C.coral)});
  const n=2**s.g,{pts,parent}=B1_DIV;
  // At generation g the first 2^g cells exist; positions shrink toward the final ones.
  for(let i=0;i<n;i++){const [x,y]=pts[i];out+=Ci(450+x*1.25,170+y*1.25,7,C.green)}
  // Family tree for division.
  const ty=284;out+=TF(450,ty-8,'every cell has a parent',13,C.green);
  for(let g=0;g<=s.g;g++){const k=2**g;for(let i=0;i<k;i++){const x=330+240*(i+.5)/k,y=ty+g*14;out+=Ci(x,y,2.6,C.green);if(g){const px=330+240*(Math.floor(i/2)+.5)/(k/2);out+=L(px,y-14,x,y,C.green,1)}}}
  out+=TF(150,ty-8,'no parents: cells just appear',13,C.coral);
  for(let i=0;i<Math.min(free.length,16);i++)out+=TF(80+(i%8)*20,ty+16+Math.floor(i/8)*18,'?',13,C.coral);
  out+=TBF(300,370,`${n} cell${n>1?'s':''} after ${s.g} generation${s.g===1?'':'s'} of division (2^${s.g})`,14,C.ink);
  return {svg:out,phase:s.g===0?'One cell. Under division it is the ancestor of everything that follows.':`Under division the count doubles each generation and every cell traces back to the first. Under free formation cells appear with no history, which is not what microscopes showed in dividing embryos.`};
 }});

const B1_PARTS={
 membrane:{n:'Cell membrane',both:true,t:['A thin oily layer around every cell, controlling','what enters and leaves.']},
 ribosome:{n:'Ribosomes',both:true,t:['Protein factories, in every kind of cell;','smaller in bacteria than in eukaryotes.']},
 dna:{n:'DNA',both:true,t:['Bacteria keep one loop of DNA loose in the cell','(the nucleoid); eukaryotes keep theirs in a nucleus.']},
 nucleus:{n:'Nucleus',both:false,t:['A double membrane around the DNA: the feature','that names eukaryotes (“true kernel”).']},
 mito:{n:'Mitochondria',both:false,t:['Where most energy is released from food.','Descended from bacteria taken in long ago (see era 8).']},
 wall:{n:'Cell wall',both:'some',t:['Bacteria, plants and fungi have a rigid wall','outside the membrane; animal cells do not.']}};
SCENE({id:'cell-theory-kinds',name:'Two kinds of cell',tag:'Prokaryotes and eukaryotes',
 definition:'Cells come in two broad plans. Prokaryotes (bacteria and archaea) are small and have no nucleus. Eukaryotes (animals, plants, fungi and protists) are usually ten or more times wider, keep their DNA in a nucleus and have membrane-bound compartments.',
 example:'An E. coli bacterium is about 2 µm long; a typical animal cell is 10–30 µm across, so its volume is around a thousand times larger. Both have a membrane, ribosomes and DNA.',
 desc:'A bacterium and an animal cell drawn side by side, enlarged or at true relative scale. Pressing a part shows whether both kinds of cell have it and what it does.',
 research:['Chatton, É. (1925). Coined procaryote and eucaryote.','Stanier, R. Y. & van Niel, C. B. (1962). The concept of a bacterium. Archiv für Mikrobiologie 42.'],
 dur:12,hint:'Press a part to see what it does and whether both kinds of cell have it. Switch to true scale to see how small a bacterium is.',
 init:()=>({part:'nucleus',scale:'big'}),
 watch(p){const k=Object.keys(B1_PARTS);return {part:k[Math.min(k.length-1,Math.floor(p*7))],scale:p>.86?'true':'big'}},
 ui:[{choose:[['big','Enlarged'],['true','True scale']],label:'Scale',get:s=>s.scale,act:'scale'},{choose:Object.keys(B1_PARTS).map(k=>[k,B1_PARTS[k].n]),label:'Part',get:s=>s.part,act:'part'}],
 on:{scale(s,v){s.scale=v},part(s,v){s.part=v}},
 draw(s,f,X){
  const P0=B1_PARTS[s.part];let out=heading('Bacterium and animal cell');
  const tr=s.scale==='true',bs=tr?.12:1,on=k=>s.part===k;
  // Bacterium (left).
  const bx=150,by=150;out+=TBF(bx,62,'Bacterium (prokaryote)',14,C.ink);
  out+=hit(X,'part','wall',`Cell wall`,`<rect x="${bx-90*bs}" y="${by-38*bs}" width="${180*bs}" height="${76*bs}" rx="${38*bs}" fill="none" stroke="${on('wall')?C.coral:'#9bb0bd'}" stroke-width="${on('wall')?5:3}"/>`);
  out+=hit(X,'part','membrane','Membrane',`<rect x="${bx-82*bs}" y="${by-30*bs}" width="${164*bs}" height="${60*bs}" rx="${30*bs}" fill="#eaf4fa" stroke="${on('membrane')?C.coral:C.blue}" stroke-width="${on('membrane')?4:2}"/>`);
  if(!tr){out+=hit(X,'part','dna','DNA',P(`M${bx-40} ${by}C${bx-20} ${by-24} ${bx} ${by+24} ${bx+20} ${by}S${bx+50} ${by-18} ${bx+30} ${by+10}`,on('dna')?C.coral:C.purple,on('dna')?4:2.5));
   for(let i=0;i<9;i++)out+=hit(X,'part','ribosome','Ribosomes',Ci(bx-60+i*15,by+(i%2?18:-18),3,on('ribosome')?C.coral:C.ink))}
  // Animal cell (right).
  const ax=430,ay=200,ar=tr?120:110;out+=TBF(ax,62,'Animal cell (eukaryote)',14,C.ink);
  out+=hit(X,'part','membrane','Membrane',Ci(ax,ay,ar,'#f4f8fb',on('membrane')?C.coral:C.blue,on('membrane')?'stroke-width="4"':''));
  out+=hit(X,'part','nucleus','Nucleus',Ci(ax-10,ay-6,40,'#e6e0f3',on('nucleus')?C.coral:C.purple,on('nucleus')?'stroke-width="4"':''));
  out+=hit(X,'part','dna','DNA',P(`M${ax-34} ${ay-6}C${ax-20} ${ay-28} ${ax} ${ay+18} ${ax+16} ${ay-10}`,on('dna')?C.coral:C.purple,on('dna')?4:2.5));
  [[ax+55,ay+50,-20],[ax-62,ay+58,25],[ax+62,ay-48,40]].forEach(([x,y,r])=>{out+=hit(X,'part','mito','Mitochondria',`<ellipse cx="${x}" cy="${y}" rx="22" ry="11" transform="rotate(${r} ${x} ${y})" fill="#fbe9d4" stroke="${on('mito')?C.coral:C.amber}" stroke-width="${on('mito')?4:2}"/>`)});
  for(let i=0;i<14;i++){const a=i*.45,r2=60+(i%3)*12;out+=hit(X,'part','ribosome','Ribosomes',Ci(ax+Math.cos(a)*r2,ay+Math.sin(a)*r2,2.6,on('ribosome')?C.coral:C.ink))}
  if(tr)out+=TF(bx,by+28,'(the dot is the bacterium)',13,C.muted);
  out+=TF(150,by+62,tr?'about 2 µm':'enlarged ≈ 60×',13,C.muted)+TF(ax,342,tr?'about 20 µm, same scale':'enlarged ≈ 5×',13,C.muted);
  const has=P0.both===true?'Both kinds of cell':P0.both==='some'?'Bacteria and plants, not animals':'Eukaryotes only';
  out+=B1_card(30,236,270,P0.n+': '+has.toLowerCase(),B1_wrap(P0.t.join(' '),34),C.coral);
  return {svg:out,phase:`${P0.n}: ${has.toLowerCase()}. ${P0.t.join(' ')}`};
 }});

/* ---------- Lesson: surface-volume ---------- */
SCENE({id:'surface-volume',name:'Surface and volume',tag:'Why cells stay small',
 definition:'As an object grows, its volume grows with the cube of its size but its surface only with the square. A cell takes in food and oxygen through its surface but needs them throughout its volume, so a bigger cell has less surface per unit of volume to supply.',
 example:'A cube 1 µm across has 6 µm² of surface for 1 µm³ of volume, a ratio of 6. A cube 10 µm across has 600 µm² for 1,000 µm³, a ratio of only 0.6. Cutting the big cube into 1,000 little ones multiplies the surface by ten.',
 desc:'A cube whose side can be changed, with its surface, volume and their ratio, and a graph of the ratio falling as 6 ÷ side. The cube can be cut into smaller cubes of the same total volume, which adds surface.',
 research:['Galileo (1638). Two New Sciences: the square–cube law.','Haldane, J. B. S. (1926). On being the right size.'],
 dur:12,hint:'Change the side of the cube, then cut it into smaller pieces. The total volume stays the same while the surface grows.',
 init:()=>({L:6,k:1}),
 watch(p){return p<.6?{L:+B1_n(1+p/.6*9,1),k:1}:{L:10,k:1+Math.min(3,Math.floor((p-.6)/.1))}},
 ui:[{range:'L',label:'Side',min:1,max:10,step:.5,get:s=>s.L,act:'L',show:v=>v+' µm'},{choose:[['1','Whole'],['2','Cut in 8'],['3','Cut in 27'],['4','Cut in 64']],label:'Pieces',get:s=>String(s.k),act:'k'}],
 on:{L(s,v){s.L=+v},k(s,v){s.k=+v}},
 draw(s){
  const S=6*s.L*s.L*s.k,V=s.L**3,r=S/V;let out=heading('Surface grows as side², volume as side³');
  // Oblique drawing of the cube(s) at left.
  const sc=13,k=s.k,sub=s.L/k,gap=k>1?6:0,ox=60,oy=300;
  for(let i=k-1;i>=0;i--)for(let j=0;j<k;j++)for(let h=0;h<k;h++){
   const x=ox+(j*(sub*sc+gap))+i*(sub*sc*.5+gap*.5),y=oy-h*(sub*sc+gap)-i*(sub*sc*.5+gap*.5),a=sub*sc,d=a*.5;
   out+=`<polygon points="${x},${y} ${x+a},${y} ${x+a},${y-a} ${x},${y-a}" fill="#cfe3f1" stroke="${C.blue}" stroke-width="1.2"/>`+`<polygon points="${x},${y-a} ${x+a},${y-a} ${x+a+d},${y-a-d} ${x+d},${y-a-d}" fill="#e7f1f8" stroke="${C.blue}" stroke-width="1.2"/>`+`<polygon points="${x+a},${y} ${x+a+d},${y-d} ${x+a+d},${y-a-d} ${x+a},${y-a}" fill="#b3d2e8" stroke="${C.blue}" stroke-width="1.2"/>`}
  out+=counter(330,56,'surface',B1_n(S,0)+' µm²',C.green,120)+counter(460,56,'volume',B1_n(V,s.L%1?2:0)+' µm³',C.blue,90);
  const A=B1_axes(330,130,220,170,[0,10],[0,6.5],{xt:[0,5,10],yt:[0,2,4,6],xl:'side of each piece (µm)',yl:'surface ÷ volume'});out+=A.svg;
  out+=P(B1_path(range(91).map(i=>1+i*.1).map(x=>[A.X(x),A.Y(6/x)])),C.line,2,'none','stroke-dasharray="5 4"');
  out+=Ci(A.X(sub),A.Y(Math.min(6.4,6/sub)),7,C.coral);
  out+=TBF(300,362,`surface ÷ volume = ${B1_n(r,2)} per µm${k>1?` (×${k} by cutting into ${k**3})`:''}`,15,C.coral);
  return {svg:out,phase:k>1?`Cutting into ${k**3} pieces keeps the volume at ${B1_n(V,0)} µm³ but multiplies the surface by ${k}. Many small cells have far more surface than one big one.`:`At ${s.L} µm the cube has ${B1_n(r,2)} µm² of surface for every µm³ inside it. Double the side and the ratio halves.`};
 },
 three(s,f,X,project){
  const k=s.k,sub=s.L/k,gap=k>1?sub*.35:0,tot=s.L+gap*(k-1),P=project([0,tot,0,tot,0,tot]);let faces=[];
  for(let i=0;i<k;i++)for(let j=0;j<k;j++)for(let h=0;h<k;h++)faces=faces.concat(prism(i*(sub+gap),j*(sub+gap),h*(sub+gap),sub,sub,sub,(i+j+h)%2?'#5a9fd0':'#8cc0e2'));
  return {svg:paintFaces(faces,P),title:'Same volume, more surface',caption:k>1?`${k**3} pieces with ${B1_n(6*s.L*s.L*k,0)} µm² of surface between them, ${k} times the surface of the whole cube. Drag to turn.`:`One cube ${s.L} µm across: ${B1_n(6*s.L*s.L,0)} µm² of surface around ${B1_n(s.L**3,0)} µm³. Choose a cut to split it.`};
 }});

const B1_D=2e-9;// O2 in water, about 2 × 10⁻⁹ m²/s at 25 °C
const B1_tdiff=x=>x*x/(2*B1_D);
function B1_time(t){return t<1e-3?B1_n(t*1e6,0)+' µs':t<1?B1_n(t*1e3,t<1e-2?2:0)+' ms':t<120?B1_n(t,t<10?2:0)+' s':t<7200?B1_n(t/60,0)+' min':t<172800?B1_n(t/3600,1)+' hours':B1_n(t/86400,0)+' days'}
function B1_len(x){return x<1e-3?B1_n(x*1e6,x<1e-5?1:0)+' µm':x<1e-2?B1_n(x*1e3,1)+' mm':x<1?B1_n(x*100,0)+' cm':B1_n(x,1)+' m'}
SCENE({id:'surface-volume-diffusion',name:'The reach of diffusion',tag:'Fast over microns, hopeless over centimetres',
 definition:'Molecules spread by diffusion, but the time it takes grows with the square of the distance: t ≈ x² ÷ 2D. That is quick across a cell and hopelessly slow across a body, which is why large animals need blood and lungs.',
 example:'For oxygen in water (D ≈ 2 × 10⁻⁹ m²/s), crossing 10 µm takes about 25 ms, 1 mm about 4 minutes, and 1 cm about 7 hours. August Krogh used this to show why muscle needs a capillary every fraction of a millimetre.',
 desc:'A log–log graph of diffusion time against distance for oxygen in water, with a chosen distance marked. Labels place a bacterium, a cell, a flatworm’s thickness and a human body on the curve.',
 research:['Fick, A. (1855). Über Diffusion. Annalen der Physik 94.','Einstein, A. (1905). Mean square displacement x² = 2Dt in Brownian motion.','Krogh, A. (1919). The number and distribution of capillaries in muscles. Journal of Physiology 52.'],
 dur:10,hint:'Move the distance and read off how long oxygen would take to diffuse that far. Each tenfold step in distance costs a hundredfold in time.',
 init:()=>({e:-4}),
 watch(p){return {e:+B1_n(-6+p*4.5,2)}},
 ui:[{range:'e',label:'Distance',min:-6,max:-1.5,step:.1,get:s=>s.e,act:'e',show:v=>B1_len(10**v)}],
 on:{e(s,v){s.e=+v}},
 draw(s){
  const x=10**s.e,t=B1_tdiff(x);let out=heading('Diffusion time grows with distance squared');
  const A=B1_axes(90,60,440,220,[-6,-1],[-4,6],{xt:[[-6,'1 µm'],[-5,'10 µm'],[-4,'100 µm'],[-3,'1 mm'],[-2,'1 cm'],[-1,'10 cm']],yt:[[-3,'1 ms'],[0,'1 s'],[2,'100 s'],[4,'3 h'],[6,'12 d']],xl:'distance',yl:'time for oxygen to diffuse'});out+=A.svg;
  out+=P(B1_path(range(49).map(i=>-6+i*.1).map(e=>[A.X(e),A.Y(Math.log10(B1_tdiff(10**e)))])),C.blue,3);
  [[-5.7,'bacterium'],[-4.7,'animal cell'],[-3.3,'flatworm'],[-1.2,'human']].forEach(([e,n])=>{const yy=A.Y(Math.log10(B1_tdiff(10**e)));out+=Ci(A.X(e),yy,4,C.muted)+TF(A.X(e)+7,yy+16,n,13,C.muted,'start')});
  const yy=A.Y(clamp(Math.log10(t),-4,6));out+=L(A.X(s.e),280,A.X(s.e),yy,C.coral,1.5,'stroke-dasharray="4 3"')+Ci(A.X(s.e),yy,7,C.coral);
  out+=TBF(300,342,`${B1_len(x)}: about ${B1_time(t)}`,17,C.coral);
  out+=TF(300,366,'t ≈ x² ÷ 2D, with D = 2 × 10⁻⁹ m²/s (oxygen in water, 25 °C)',13,C.muted);
  return {svg:out,phase:t<1?`Across ${B1_len(x)} diffusion takes only ${B1_time(t)}: fast enough to supply a cell with nothing but its surface.`:t<600?`${B1_time(t)} to cross ${B1_len(x)}: workable for thin animals like flatworms, but too slow for thick tissue.`:`${B1_time(t)} to cross ${B1_len(x)}. No large animal could live on diffusion alone; it needs a circulation to carry oxygen close to every cell.`};
 }});

const B1_RBC_V=90;
SCENE({id:'surface-volume-shapes',name:'Shapes that cheat',tag:'Flattening adds surface',
 definition:'A sphere has the least surface for its volume. Cells that need a lot of exchange break the rule by flattening, stretching out or folding their membranes.',
 example:'A red blood cell holds about 90 µm³. As a sphere that would need about 97 µm² of surface; its flattened, dimpled disc has about 135 µm², around 40% more, so oxygen enters and leaves faster.',
 desc:'A fixed volume of 90 µm³ shaped as a cylinder whose radius can be changed, from a tall column through a sphere-like shape to a thin disc. Its surface is compared with a sphere’s and with a measured red blood cell.',
 research:['Evans, E. & Fung, Y.-C. (1972). Improved measurements of the erythrocyte geometry. Microvascular Research 4: area about 135 µm², volume about 94 µm³.'],
 dur:10,hint:'Flatten the cell by widening it. Its volume stays at 90 µm³ while its surface climbs past the sphere’s.',
 init:()=>({r:4}),
 watch(p){return {r:+B1_n(1.6+p*4.4,1)}},
 ui:[{range:'r',label:'Radius',min:1.6,max:6,step:.1,get:s=>s.r,act:'r',show:v=>v+' µm'}],
 on:{r(s,v){s.r=+v}},
 draw(s){
  const r=s.r,h=B1_RBC_V/(Math.PI*r*r),S=2*Math.PI*r*r+2*Math.PI*r*h,rs=Math.cbrt(3*B1_RBC_V/(4*Math.PI)),Ss=4*Math.PI*rs*rs;let out=heading('The same 90 µm³, in different shapes');
  const sc=18,cx=170,cy=200;
  out+=`<ellipse cx="${cx}" cy="${cy-h*sc/2}" rx="${r*sc}" ry="${r*sc*.25}" fill="#f6d2cb" stroke="${C.coral}" stroke-width="2"/>`;
  out+=R(cx-r*sc,cy-h*sc/2,2*r*sc,h*sc,'#efb3a6','none',0)+`<ellipse cx="${cx}" cy="${cy+h*sc/2}" rx="${r*sc}" ry="${r*sc*.25}" fill="#efb3a6" stroke="${C.coral}" stroke-width="2"/>`+`<ellipse cx="${cx}" cy="${cy-h*sc/2}" rx="${r*sc}" ry="${r*sc*.25}" fill="#f6d2cb" stroke="${C.coral}" stroke-width="2"/>`;
  out+=L(cx-r*sc,cy-h*sc/2,cx-r*sc,cy+h*sc/2,C.coral,2)+L(cx+r*sc,cy-h*sc/2,cx+r*sc,cy+h*sc/2,C.coral,2);
  out+=TF(cx,336,`radius ${B1_n(r,1)} µm · height ${B1_n(h,2)} µm`,13,C.muted);
  const A=B1_axes(340,70,210,200,[0,3],[0,300],{yt:[0,100,200,300]});out+=A.svg+TF(340,60,'surface (µm²)',13,C.muted,'start');
  const bars=[['sphere',Ss,C.muted],['your shape',S,C.coral],['red cell',135,C.green]];
  bars.forEach(([n,v,c],i)=>{const x=A.X(i+.5);out+=R(x-24,A.Y(v),48,A.Y(0)-A.Y(v),c,'none',4)+TBF(x,A.Y(v)-6,B1_n(v,0),14,c)+TF(x,288,n,13,C.ink)});
  out+=TBF(300,356,`${B1_n((S/Ss-1)*100,0)}% more surface than a sphere of the same volume`,15,S>Ss*1.02?C.green:C.ink);
  return {svg:out,phase:h>2*r?'A tall column: more surface than a sphere, but awkward to move through narrow capillaries.':S>Ss*1.15?`A flat disc: ${B1_n(S,0)} µm² of surface${Math.abs(S-135)<20?', close to a real red blood cell’s 135 µm²':S>155?', more than a real red blood cell (135 µm²), which must stay thick enough to bend through capillaries':''}. Every point inside is near the membrane.`:'Close to a compact shape: little surface for the volume it holds.'};
 }});

/* ---------- Lesson: diffusion-osmosis ---------- */
const B1_WALK=(()=>{const r=rng(2024),N=60,T=300,pos=[];for(let i=0;i<N;i++){let x=0,y=0;const tr=[[0,0]];for(let t=0;t<T;t++){const a=r()*Math.PI*2;x+=Math.cos(a);y+=Math.sin(a);tr.push([x,y])}pos.push(tr)}return pos})();
SCENE({id:'diffusion-osmosis',name:'Diffusion',tag:'Random steps, steady spreading',
 definition:'Diffusion is the spreading of molecules by their own random motion. No single molecule heads anywhere in particular, yet a crowd spreads out from where it is concentrated, and the mean squared distance grows in proportion to time.',
 example:'Drop ink into still water: each molecule jiggles at random, but the patch widens steadily. Doubling the time doubles the mean squared spread, so the patch’s width grows only as the square root of time. Smaller molecules take bigger steps and spread faster.',
 desc:'Sixty molecules start together and take random steps. Their cloud spreads, and a graph plots their mean squared distance from the start against time, rising along a straight line.',
 research:['Brown, R. (1828). Microscopical observations on particles in pollen.','Fick, A. (1855). Über Diffusion.','Einstein, A. (1905). Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung.'],
 dur:12,hint:'Move time forward and watch the cloud spread. Then switch to a large molecule, which takes smaller steps.',
 init:()=>({t:150,big:'small'}),
 watch(p){return {t:Math.round(p*300),big:'small'}},
 ui:[{range:'t',label:'Time',min:0,max:300,step:5,get:s=>s.t,act:'t',show:v=>v+' steps'},{choose:[['small','Small molecule'],['big','Large molecule']],label:'Molecule',get:s=>s.big,act:'big'}],
 on:{t(s,v){s.t=+v},big(s,v){s.big=v}},
 draw(s){
  const st=s.big==='big'?.45:1,cx=170,cy=200,sc=4.2;let out=heading('Each molecule wanders; the crowd spreads');
  out+=R(40,60,260,280,'#fff',C.grid,8);
  let msd=0;B1_WALK.forEach(tr=>{const [x,y]=tr[s.t];msd+=(x*x+y*y)*st*st;out+=Ci(cx+clamp(x*st*sc,-126,126),cy+clamp(y*st*sc,-136,136),3.4,s.big==='big'?C.purple:C.blue,'none','opacity=".8"')});
  msd/=B1_WALK.length;out+=Ci(cx,cy,3,C.coral);
  const rr=Math.sqrt(msd)*sc;if(rr>4)out+=Ci(cx,cy,Math.min(rr,130),'none',C.coral,'stroke-dasharray="5 4"');
  const A=B1_axes(340,70,210,200,[0,300],[0,420],{xt:[0,150,300],yt:[0,100,200,300,400],xl:'time (steps)',yl:'mean squared distance'});out+=A.svg;
  out+=L(A.X(0),A.Y(0),A.X(300),A.Y(300),C.blue,2,'stroke-dasharray="5 4"')+L(A.X(0),A.Y(0),A.X(300),A.Y(300*.45*.45),C.purple,2,'stroke-dasharray="5 4"')+TF(A.X(296),A.Y(300)+18,'small',13,C.blue,'end')+TF(A.X(296),A.Y(61)-8,'large',13,C.purple,'end');
  const pts=range(Math.floor(s.t/10)+1).map(i=>i*10).map(t=>{let m=0;B1_WALK.forEach(tr=>{const [x,y]=tr[t];m+=(x*x+y*y)*st*st});return [A.X(t),A.Y(Math.min(420,m/B1_WALK.length))]});
  out+=P(B1_path(pts),s.big==='big'?C.purple:C.blue,3);
  out+=TBF(300,364,`after ${s.t} steps: mean squared distance ${B1_n(msd,0)} (expected ${B1_n(s.t*st*st,0)})`,14,C.ink);
  return {svg:out,phase:`Every molecule moves at random, but the dashed circle (the typical distance) keeps growing. The mean squared distance rises in a straight line with time${s.big==='big'?', more slowly for the big molecule':''}: the signature of diffusion.`};
 }});

SCENE({id:'diffusion-osmosis-membrane',name:'Osmosis',tag:'Water follows the solute',
 definition:'Osmosis is the net movement of water across a membrane that lets water through but not a dissolved substance. Water moves towards the side with more dissolved particles until the extra pressure on that side balances it: the osmotic pressure.',
 example:'Wilhelm Pfeffer (1877) measured this with porous pots lined with a membrane. Jacobus van ’t Hoff (1887) showed the pressure follows π = cRT, like a gas: a solution of just 1 mmol/L of sugar would hold up a column of water about 25 cm high at 25 °C.',
 desc:'A U-tube with pure water on the left and sugar solution on the right, separated by a membrane that only water can cross. As time passes, water crosses and the right-hand column rises to the height predicted by π = cRT.',
 research:['Pfeffer, W. (1877). Osmotische Untersuchungen.','van ’t Hoff, J. H. (1887). Die Rolle des osmotischen Druckes in der Analogie zwischen Lösungen und Gasen.'],
 dur:12,hint:'Choose the sugar concentration and move time forward. The column stops rising when its weight balances the osmotic pressure.',
 init:()=>({c:5,t:100}),
 watch(p){return {c:5,t:Math.round(p*100)}},
 ui:[{range:'c',label:'Sugar',min:0,max:10,step:.5,get:s=>s.c,act:'c',show:v=>v+' mmol/L'},{range:'t',label:'Time',min:0,max:100,step:2,get:s=>s.t,act:'t',show:v=>v+'%'}],
 on:{c(s,v){s.c=+v},t(s,v){s.t=+v}},
 draw(s){
  const pi=s.c*8.314*298.15,heq=pi/(1000*9.81),h=heq*(1-Math.exp(-s.t/22)),sc=70;let out=heading('A membrane that lets only water through');
  const base=300,lx=150,rx=290,w=46,lvl=180;
  out+=P(`M${lx-w/2} 70V${base}Q${lx-w/2} ${base+40} ${lx+20} ${base+40}H${rx-20}Q${rx+w/2} ${base+40} ${rx+w/2} ${base}V70`,C.ink,2.5)+P(`M${lx+w/2} 70V${base-10}H${rx-w/2}V70`,C.ink,2.5);
  const yl=lvl+h*sc/2,yr=lvl-h*sc/2;
  out+=R(lx-w/2+2,yl,w-4,base-yl,'#cfe6f6','none',0)+R(rx-w/2+2,yr,w-4,base-yr,'#f3dcc0','none',0)+R(lx-w/2+2,base,rx-lx+w-4,36,'#e3e9ee','none',8);
  out+=L(220,base-8,220,base+40,C.purple,4,'stroke-dasharray="3 4"')+TF(220,base+58,'membrane',13,C.purple);
  for(let i=0;i<Math.round(s.c);i++)out+=Ci(rx-12+(i%3)*12,base-14-Math.floor(i/3)*18,4,C.amber);
  out+=TF(lx,62,'pure water',13,C.blue)+TF(rx,62,'sugar solution',13,C.amber);
  if(h>.003)out+=L(rx+w/2+10,yr,rx+w/2+10,yl,C.coral,2)+L(rx+w/2+4,yr,rx+w/2+16,yr,C.coral,2)+L(rx+w/2+4,yl,rx+w/2+16,yl,C.coral,2)+TF(rx+w/2+20,(yr+yl)/2+5,B1_n(h*100,1)+' cm',13,C.coral,'start');
  out+=counter(420,90,'osmotic pressure',B1_n(pi/1000,1)+' kPa',C.purple,140)+counter(420,150,'balancing column',B1_n(heq*100,0)+' cm',C.coral,140);
  out+=TF(490,224,'π = cRT',15,C.ink)+TF(490,246,`c = ${s.c} mmol/L`,13,C.muted)+TF(490,266,'T = 298 K (25 °C)',13,C.muted);
  out+=TF(490,300,'A cell’s contents, about',13,C.muted)+TF(490,318,'300 mmol/L, would give',13,C.muted)+TF(490,336,'about 740 kPa (7 atm).',13,C.muted);
  return {svg:out,phase:s.c===0?'No sugar: water crosses equally both ways and the levels stay level.':s.t<90?'Water crosses the membrane into the sugar side faster than it comes back, so the right-hand column rises.':`Equilibrium: the extra ${B1_n(heq*100,0)} cm of water presses back as hard as osmosis pulls, ${B1_n(pi/1000,1)} kPa.`};
 }});

SCENE({id:'diffusion-osmosis-cells',name:'Cells in salt water',tag:'Swell, hold or shrink',
 definition:'A cell placed in a solution swells if the outside has fewer dissolved particles than its contents (hypotonic), keeps its shape if they match (isotonic) and shrinks if the outside has more (hypertonic). Animal cells can burst; plant cells are held by their walls.',
 example:'Human red blood cells are isotonic with about 0.9% salt, which is why saline drips use it. In pure water they swell and burst (haemolysis begins near 0.45%). In strong salt, plant cells pull their membranes away from the wall: plasmolysis, first described by Hugo de Vries.',
 desc:'A red blood cell and a plant cell side by side, in a salt solution whose strength can be changed. The red cell swells into a sphere and bursts, or shrivels with spikes; the plant cell goes from firm to plasmolysed.',
 research:['de Vries, H. (1884). Eine Methode zur Analyse der Turgorkraft.','Ponder, E. (1948). Hemolysis and Related Phenomena.','Osmotic fragility test: haemolysis typically begins near 0.45% and is complete near 0.3% NaCl.'],
 dur:12,hint:'Change the salt concentration outside the cells and compare what happens to an animal cell and a plant cell.',
 init:()=>({c:.9}),
 watch(p){return {c:+B1_n(p<.5?1.8-p*3.4:.1+(p-.5)*1.6,2)}},
 ui:[{range:'c',label:'Salt outside',min:0,max:2,step:.05,get:s=>s.c,act:'c',show:v=>B1_n(v,2)+'%'}],
 on:{c(s,v){s.c=+v}},
 draw(s){
  const c=s.c,ratio=c>0?.4+.6*.9/Math.max(c,.05):9,vol=Math.min(ratio,1.8),burst=c<.45;let out=heading(c<.85?'Hypotonic: water flows in':c>.95?'Hypertonic: water flows out':'Isotonic: no net flow');
  // Red blood cell.
  const rx=160,ry=190;out+=TBF(rx,66,'Red blood cell',14,C.ink);
  if(burst){out+=Ci(rx,ry,62,'#fbe4df','#e6a89a','stroke-dasharray="6 7"')+TF(rx,ry+5,'burst (haemolysis)',13,C.coral)}
  else if(c>.95){const n=16,r0=48*Math.sqrt(1/ratio>1?.8:1);let d='';for(let i=0;i<=n*2;i++){const a=i*Math.PI/n,rr=i%2?r0*.82:r0*1.06;d+=(i?'L':'M')+fmt(rx+Math.cos(a)*rr)+' '+fmt(ry+Math.sin(a)*rr*.9)}out+=P(d+'Z',C.coral,2.5,'#e88d7c')}
  else{const sw=clamp((vol-1)/.8,0,1),rr=58+sw*6;out+=`<ellipse cx="${rx}" cy="${ry}" rx="${rr}" ry="${rr*(.5+.5*sw)}" fill="#e88d7c" stroke="${C.coral}" stroke-width="2.5"/>`+(sw<.6?`<ellipse cx="${rx}" cy="${ry}" rx="${22*(1-sw)}" ry="${10*(1-sw)}" fill="#f2b6a9"/>`:'')}
  // Plant cell.
  const px=440,py=190,wall=72;out+=TBF(px,66,'Plant cell',14,C.ink);
  out+=R(px-wall,py-wall,wall*2,wall*2,'#e6f1d8',C.green,6,'stroke-width="5"');
  const shrink=c>.95?clamp((c-.95)/.6,0,1):0,m=wall-5-shrink*34;
  out+=R(px-m,py-m*(1-shrink*.25),m*2,m*2*(1-shrink*.25),'#bfe0a4',C.green,m>40?10:18)+Ci(px,py,Math.max(14,m*.42),'#d8ecc5',C.green);
  out+=TF(px,py+wall+22,shrink>.15?'plasmolysed: membrane pulls from wall':'turgid: pressed firmly against the wall',13,C.green);
  out+=TF(rx,ry+92,burst?'':c>.95?'shrunken and spiky (crenated)':vol>1.15?'swollen towards a sphere':'normal dimpled disc',13,C.coral);
  // Scale bar of concentration.
  const sx=v=>80+440*v/2;out+=L(80,330,520,330,C.line,6);out+=R(sx(.45),324,sx(.9)-sx(.45),12,C.coralp,'none',3)+L(sx(.9),320,sx(.9),340,C.green,3)+TF(sx(.9),356,'0.9% (isotonic)',13,C.green)+TF(sx(.45),316,'bursting begins',13,C.coral,'end');
  out+=Ci(sx(c),330,8,C.ink);
  return {svg:out,phase:burst?`At ${B1_n(c,2)}% salt so much water rushes in that red cells burst. The plant cell survives: its wall pushes back.`:c>.95?`At ${B1_n(c,2)}% salt water leaves the cells. The red cell shrivels; ${shrink>.15?'the plant cell’s membrane pulls away from its wall (plasmolysis)':'the plant cell loses pressure but its contents still fill the wall'}.`:c<.85?`At ${B1_n(c,2)}% salt more water enters the cells than leaves. The red cell swells; the plant cell presses harder against its wall.`:`Near 0.9% salt, water enters and leaves the cells equally.`};
 }});

/* ---------- Lesson: cell-division ---------- */
const B1_PH=['Interphase','Prophase','Metaphase','Anaphase','Telophase','Cytokinesis'];
const B1_CHR=[{c:C.blue,l:38},{c:'#7fb3da',l:38},{c:C.coral,l:26},{c:'#eeaa98',l:26}];
SCENE({id:'cell-division',name:'Mitosis',tag:'One cell becomes two identical cells',
 definition:'In mitosis a cell copies each chromosome, lines the pairs of copies up in the middle, pulls them apart to opposite ends and divides, giving two cells with the same chromosomes as the original.',
 example:'A human cell copies all 46 chromosomes during interphase. In mitosis the 46 pairs of sister copies line up, split, and each daughter gets exactly 46 again. Walther Flemming named the process in 1882 from the thread-like shapes he saw in stained cells.',
 desc:'A cell with four chromosomes (two pairs, shown in two colours) passing through the stages of mitosis: copying, condensing, lining up, separating, re-forming nuclei and pinching in two.',
 research:['Flemming, W. (1882). Zellsubstanz, Kern und Zelltheilung.','Strasburger, E. (1884): the names prophase, metaphase and anaphase.'],
 dur:14,hint:'Step through the stages, or slide smoothly between them. Track one chromosome to see that each daughter gets one copy of it.',
 init:()=>({ph:2,track:'no'}),
 watch(p){return {ph:+B1_n(p*5.4,2),track:'no'}},
 ui:[{range:'ph',label:'Stage',min:0,max:5,step:.1,get:s=>s.ph,act:'ph',show:v=>B1_PH[Math.min(5,Math.round(v))]},{choose:[['no','All'],['yes','Track one']],label:'Chromosome',get:s=>s.track,act:'track'}],
 on:{ph(s,v){s.ph=+v},track(s,v){s.track=v}},
 draw(s){
  const ph=clamp(s.ph,0,5),st=Math.min(5,Math.round(ph)),cx=300,cy=190;let out=heading(B1_PH[st]);
  const pinch=smooth((ph-4)/1),sep=smooth((ph-2.5)/1.2),line=smooth((ph-1.3)/.9),cond=smooth((ph-.4)/.9);
  // Membrane: ellipse that pinches in two.
  const w=150+60*sep,Dd=w/2+pinch*20;if(pinch<.02)out+=`<ellipse cx="${cx}" cy="${cy}" rx="${w}" ry="110" fill="#f5f9fc" stroke="${C.blue}" stroke-width="2.5"/>`;
  else{const g=pinch*100;[-1,1].forEach(k=>{out+=`<ellipse cx="${cx+k*Dd}" cy="${cy}" rx="${w/2+20-g*.15}" ry="${110-g*.05}" fill="#f5f9fc" stroke="${C.blue}" stroke-width="2.5"/>`})}
  // Nuclear envelope: present in interphase, dissolves in prophase, reforms in telophase.
  const envA=1-smooth((ph-.6)/.6),envB=smooth((ph-3.6)/.5);
  if(envA>.05)out+=Ci(cx,cy,72,'none',C.purple,`stroke-dasharray="${envA>.9?'0':'6 6'}" opacity="${envA}"`);
  if(envB>.05)[-1,1].forEach(k=>{out+=Ci(cx+k*Dd,cy,48,'none',C.purple,`opacity="${envB}"`)});
  // Spindle.
  if(ph>1.2&&ph<4.2){const op=Math.min(smooth((ph-1.2)/.5),1-smooth((ph-3.8)/.4));[-1,1].forEach(k=>{const px=cx+k*(w-16);out+=Ci(px,cy,5,C.green,'none',`opacity="${op}"`);for(let j=0;j<4;j++)out+=L(px,cy,cx+k*(18+60*sep),cy-54+j*36,C.green,1,`opacity="${op*.6}"`)})}
  // Chromosomes.
  B1_CHR.forEach((ch,i)=>{const show=s.track==='no'||i===0,col=show?ch.c:'#d5dde3';
   const loose=[[cx-38,cy-30],[cx+24,cy-36],[cx-20,cy+30],[cx+34,cy+20]][i],mid=[cx,cy-54+i*36];
   const x0=lerp(loose[0],mid[0],line),y0=lerp(loose[1],mid[1],line),len=ch.l*(1-.35*cond),off=lerp(18+60*sep,Dd,smooth((ph-3.4)/1));
   if(ph<.4){out+=P(`M${x0-len/2} ${y0}q${len/4} -14 ${len/2} 0t${len/2} 0`,col,3)}
   else if(sep<.02){out+=L(x0-5,y0-len/2,x0-5,y0+len/2,col,7)+L(x0+5,y0-len/2,x0+5,y0+len/2,col,7)+Ci(x0,y0,4,C.ink)}
   else [-1,1].forEach(k=>{const xx=x0+k*off,ry=k>0?0:0;out+=L(xx,y0-len/2+ry,xx,y0+len/2,col,7)})});
  const n=st>=5||pinch>.6?'2 cells × 4 chromosomes':'1 cell, 4 chromosomes'+(ph>=.3&&sep<.5?' (each copied)':'');
  out+=TBF(300,334,n,15,C.ink);
  out+=B1_PH.map((p,i)=>TF(70+i*92,362,p,13,i===st?C.coral:C.muted)).join('');
  const say=['The chromosomes are long, loose threads; each is copied before mitosis begins.','The copies coil up into compact X shapes (two sister copies joined in the middle) and the nuclear envelope breaks down.','Spindle fibres line every chromosome up across the middle of the cell.','The sister copies are pulled apart to opposite ends: one copy of every chromosome goes each way.','New nuclear envelopes form around each set.','The cell pinches in two: two daughters, each with the same four chromosomes as the parent.'][st];
  return {svg:out,phase:say};
 }});

SCENE({id:'cell-division-growth',name:'Doubling',tag:'Exponential growth, and its end',
 definition:'When every cell divides in a fixed time, the number of cells doubles each generation: N = N₀ × 2^(t ÷ doubling time). The curve starts slowly and then explodes, until food runs out.',
 example:'E. coli can divide about every 20 minutes in rich broth. From one cell, 8 hours is 24 doublings: about 16.8 million cells. Unchecked for two days it would outweigh the Earth; in reality the culture stops growing within hours as nutrients run out.',
 desc:'The number of bacteria against time for a chosen doubling time, on a linear or a logarithmic axis, with a toggle for a limited food supply that flattens the curve into the classic growth phases.',
 research:['Monod, J. (1949). The growth of bacterial cultures. Annual Review of Microbiology 3.','E. coli doubling about 20 min in rich medium: e.g. Neidhardt et al. (1990), Physiology of the Bacterial Cell.'],
 dur:12,hint:'Change the doubling time and the time elapsed. Switch to the log axis, where doubling becomes a straight line, then limit the food.',
 init:()=>({dt:20,h:8,axis:'lin',food:'no'}),
 watch(p){return p<.5?{dt:20,h:+B1_n(p*16,1),axis:'lin',food:'no'}:{dt:20,h:8,axis:p<.75?'log':'lin',food:p<.75?'no':'yes'}},
 ui:[{range:'dt',label:'Doubling time',min:15,max:60,step:5,get:s=>s.dt,act:'dt',show:v=>v+' min'},{range:'h',label:'Time',min:0,max:12,step:.5,get:s=>s.h,act:'h',show:v=>v+' h'},{choose:[['lin','Linear axis'],['log','Log axis']],label:'Axis',get:s=>s.axis,act:'axis'},{choose:[['no','Unlimited'],['yes','Limited food']],label:'Food',get:s=>s.food,act:'food'}],
 on:{dt(s,v){s.dt=+v},h(s,v){s.h=+v},axis(s,v){s.axis=v},food(s,v){s.food=v}},
 draw(s){
  const K=1e9,N=t=>{const n=2**(t*60/s.dt);return s.food==='yes'?K*n/(K+n-1):n},n=N(s.h),lg=s.axis==='log';let out=heading('One bacterium, dividing');
  const ymax=lg?10:Math.max(N(12),10),A=B1_axes(80,60,440,220,[0,12],lg?[0,10]:[0,ymax],{xt:[0,2,4,6,8,10,12],yt:lg?[[0,'1'],[3,'1,000'],[6,'10⁶'],[9,'10⁹']]:[[0,'0'],[ymax,B1_sci(ymax)]],xl:'hours',yl:lg?'number of cells (log)':'number of cells'});out+=A.svg;
  const yv=v=>lg?A.Y(Math.log10(Math.max(1,v))):A.Y(v);
  out+=P(B1_path(range(121).map(i=>i/10).map(t=>[A.X(t),yv(N(t))])),C.line,2,'none','stroke-dasharray="5 4"');
  out+=P(B1_path(range(Math.round(s.h*10)+1).map(i=>i/10).map(t=>[A.X(t),yv(N(t))])),C.blue,3.5)+Ci(A.X(s.h),yv(n),7,C.coral);
  const gens=s.h*60/s.dt;
  out+=TBF(300,328,`${B1_n(gens,1)} doublings → ${B1_sci(n)} cells`,16,C.coral);
  out+=TF(300,354,s.food==='yes'?'limited food: steady doubling, then a plateau near 1 billion (stationary phase)':lg?'on a log axis, steady doubling is a straight line':'on a linear axis almost nothing seems to happen, then everything does',13,C.muted);
  return {svg:out,phase:s.food==='yes'&&n>K*.5?'The food is running out: growth slows and stops. Real cultures show a lag, an exponential phase, a stationary phase and then decline.':`Every ${s.dt} minutes the population doubles. After ${B1_n(s.h,1)} hours that is ${B1_n(gens,1)} doublings.`};
 }});

const B1_CYC=[{n:'G1',h:11,c:'#7fb3da'},{n:'S',h:8,c:C.purple},{n:'G2',h:4,c:'#6fb8a6'},{n:'M',h:1,c:C.coral}];
SCENE({id:'cell-division-checkpoints',name:'The cell cycle',tag:'Checkpoints that stop a damaged cell',
 definition:'A dividing cell runs through a cycle: growth (G1), copying its DNA (S), more growth (G2) and mitosis (M). At checkpoints it checks for damage and stops if something is wrong. Cancer cells have usually lost these brakes.',
 example:'A typical human cell in culture takes about 24 hours: roughly 11 h in G1, 8 h in S, 4 h in G2 and 1 h in M. If its DNA is damaged, the protein p53 halts it at the G1 checkpoint until the damage is repaired. About half of human cancers carry a broken p53.',
 desc:'A clock of the cell cycle with its four phases and three checkpoints, and a cell moving round it. Damage can be added, and the checkpoint switched off, to see a damaged cell either stop or carry on dividing.',
 research:['Hartwell, L. H. & Weinert, T. A. (1989). Checkpoints: controls that ensure the order of cell cycle events. Science 246.','Nurse, P. (1975): cell-cycle control genes in fission yeast; Evans, T., Hunt, T. et al. (1983): cyclins. Nobel Prize 2001 (Hartwell, Hunt, Nurse).','Lane, D. P. (1992). p53, guardian of the genome. Nature 358.'],
 dur:12,hint:'Move the cell through the cycle. Then add DNA damage, and compare a working checkpoint with a broken one.',
 init:()=>({t:8,dmg:'no',chk:'on'}),
 watch(p){return p<.4?{t:+B1_n(p/.4*24,1),dmg:'no',chk:'on'}:p<.7?{t:+B1_n((p-.4)/.3*24,1),dmg:'yes',chk:'on'}:{t:+B1_n((p-.7)/.3*24,1),dmg:'yes',chk:'off'}},
 ui:[{range:'t',label:'Time',min:0,max:24,step:.5,get:s=>s.t,act:'t',show:v=>v+' h'},{choose:[['no','No damage'],['yes','DNA damaged']],label:'DNA',get:s=>s.dmg,act:'dmg'},{choose:[['on','Working'],['off','Broken']],label:'Checkpoint',get:s=>s.chk,act:'chk'}],
 on:{t(s,v){s.t=+v},dmg(s,v){s.dmg=v},chk(s,v){s.chk=v}},
 draw(s){
  const cx=190,cy=200,r=120,halt=s.dmg==='yes'&&s.chk==='on',t=halt?Math.min(s.t,10.8):s.t;let out=heading('Round the cell cycle in about 24 hours');
  let a0=-Math.PI/2;B1_CYC.forEach(ph=>{const a1=a0+ph.h/24*2*Math.PI,lg=a1-a0>Math.PI?1:0;out+=`<path d="M${cx} ${cy}L${fmt(cx+Math.cos(a0)*r)} ${fmt(cy+Math.sin(a0)*r)}A${r} ${r} 0 ${lg} 1 ${fmt(cx+Math.cos(a1)*r)} ${fmt(cy+Math.sin(a1)*r)}Z" fill="${ph.c}" opacity=".3" stroke="#fff" stroke-width="2"/>`;const am=(a0+a1)/2;out+=TBF(cx+Math.cos(am)*r*.62,cy+Math.sin(am)*r*.62+5,ph.n,16,C.ink);a0=a1});
  [[11,'G1/S'],[23,'G2/M'],[23.5,'spindle']].forEach(([h,n],i)=>{const a=-Math.PI/2+h/24*2*Math.PI;out+=L(cx+Math.cos(a)*(r-10),cy+Math.sin(a)*(r-10),cx+Math.cos(a)*(r+12),cy+Math.sin(a)*(r+12),C.ink,4);if(i<2)out+=TF(cx+Math.cos(a)*(r+30),cy+Math.sin(a)*(r+30)+5,n,13,C.ink)});
  const a=-Math.PI/2+t/24*2*Math.PI,dm=s.dmg==='yes';out+=Ci(cx+Math.cos(a)*r,cy+Math.sin(a)*r,13,dm?C.coral:C.blue,'#fff')+(dm?TBF(cx+Math.cos(a)*r,cy+Math.sin(a)*r+5,'!',14,'#fff'):'');
  const ph=t<11?'G1':t<19?'S':t<23?'G2':'M';
  let msg,col;if(!dm){msg=B1_wrap('No damage: the cell passes each checkpoint and divides on time.',26);col=C.green}
  else if(halt){msg=B1_wrap('Damage found at G1/S: p53 halts the cycle until it is repaired.',26);col=C.green}
  else{msg=B1_wrap('Checkpoint broken: the damaged cell copies its DNA and divides anyway, passing the damage on.',26);col=C.coral}
  out+=B1_card(345,90,215,`Now in ${ph}`,msg,col);
  out+=TF(452,300,'G1 11 h · S 8 h · G2 4 h · M 1 h',13,C.muted)+TF(452,320,'(typical human cell in culture)',13,C.muted);
  return {svg:out,phase:halt&&s.t>10.8?'The cell is stopped at the G1/S checkpoint: it will not copy damaged DNA until it is repaired (or, if the damage is too great, it destroys itself).':dm&&s.chk==='off'?'Without a working checkpoint the damaged cell carries on. Each division can fix new mutations into its descendants.':`${ph}: ${({G1:'the cell grows and checks its surroundings',S:'every chromosome is copied',G2:'the cell checks the copies and prepares to divide',M:'mitosis, about an hour'})[ph]}.`};
 }});

SCENE({id:'cell-division-hayflick',name:'The Hayflick limit',tag:'Normal cells count their divisions',
 definition:'Normal human cells grown in a dish do not divide forever: after about 40–60 divisions they stop, a state called senescence. One reason is the telomeres, protective caps on the chromosome ends, which shorten a little at each division.',
 example:'Leonard Hayflick and Paul Moorhead found in 1961 that fetal lung cells stopped after about 50 doublings. Cells that switch on the enzyme telomerase, such as most cancer cells and the HeLa line, rebuild their telomeres and keep dividing. HeLa cells were taken from Henrietta Lacks in 1951 without her knowledge or consent.',
 desc:'A count of divisions for normal cells and for cells with telomerase switched on, with a bar for telomere length that shortens with each division until the normal cells stop.',
 research:['Hayflick, L. & Moorhead, P. S. (1961). The serial cultivation of human diploid cell strains. Experimental Cell Research 25.','Harley, C. B., Futcher, A. B. & Greider, C. W. (1990). Telomeres shorten during ageing of human fibroblasts. Nature 345.','Skloot, R. (2010). The Immortal Life of Henrietta Lacks.'],
 dur:10,hint:'Move the number of divisions for both kinds of cell. Watch the telomere bars and see which population stops.',
 init:()=>({n:30}),
 watch(p){return {n:Math.round(p*80)}},
 ui:[{range:'n',label:'Divisions',min:0,max:80,step:1,get:s=>s.n,act:'n',show:v=>v+' doublings'}],
 on:{n(s,v){s.n=+v}},
 draw(s){
  const lim=52,nn=Math.min(s.n,lim),tel=10-nn*.11,stop=s.n>=lim;let out=heading('Counting divisions with telomeres');
  const row=(y,name,len,div,stopped,col)=>{let o=TBF(60,y,name,15,col,'start');
   const cap=30*len/10;o+=R(60+cap,y+14,420-2*cap,22,'#dfe9ef','none',4)+R(60,y+14,cap,22,col,'none',4)+R(480-cap,y+14,cap,22,col,'none',4);
   o+=TF(270,y+30,'chromosome',13,C.muted)+TF(492,y+30,`${B1_n(len,1)} kb`,13,col,'start');
   o+=TF(60,y+58,stopped?`stopped after ${lim} doublings (senescence)`:`${div} doublings so far, still dividing`,14,stopped?C.coral:C.ink,'start');return o};
  out+=row(70,'Normal human cells',tel,nn,stop,C.blue)+row(170,'Cells with telomerase (e.g. most cancers, HeLa)',10,s.n,false,C.purple);
  const A=B1_axes(80,272,440,60,[0,80],[0,10],{xt:[0,20,40,60,80]});out+=A.svg;
  out+=L(A.X(lim),272,A.X(lim),332,C.coral,2,'stroke-dasharray="4 3"')+TF(A.X(lim)+5,288,'Hayflick limit ≈ 50',13,C.coral,'start')+P(B1_path(range(nn+1).map(k=>[A.X(k),A.Y(10-k*.11)])),C.blue,2.5)+L(A.X(0),A.Y(10),A.X(s.n),A.Y(10),C.purple,2.5)+Ci(A.X(nn),A.Y(tel),6,C.blue)+TF(300,326,'telomere length (normal cells: blue)',13,C.muted);
  out+=TF(300,366,'telomere lengths illustrative: they lose roughly 50–200 bases per division',13,C.muted);
  return {svg:out,phase:stop?'The normal cells have stopped: their shortest telomeres have triggered senescence. The telomerase cells keep their caps and keep going.':`Each division trims the telomeres of the normal cells a little. Cells with telomerase rebuild them.`};
 }});

/* ---------- Lesson: germ-theory ---------- */
SCENE({id:'germ-theory',name:'Germ theory',tag:'Pasteur’s swan-neck flasks',
 definition:'Germ theory says many diseases, and the spoiling of food, are caused by microorganisms that come from other microorganisms, not from spontaneous generation out of non-living matter.',
 example:'Louis Pasteur boiled broth in flasks with long S-shaped necks. Air could get in, but dust and microbes settled in the bend. The broth stayed clear for months; tilt the flask so broth touched the dust and it clouded within days. Some of his flasks are still clear today.',
 desc:'Three flasks of boiled broth followed over the days: an open straight neck, a swan neck, and a swan neck tilted so the broth has touched the trapped dust. Dust falls, and the broth clouds or stays clear.',
 research:['Pasteur, L. (1861). Mémoire sur les corpuscules organisés qui existent dans l’atmosphère. Annales des sciences naturelles 16.','Tyndall, J. (1877). Further researches on the deportment and vital resistance of putrefactive and infective organisms.'],
 dur:12,hint:'Choose a flask and move the days forward. Only one kind of flask lets microbes reach the broth.',
 init:()=>({fl:'swan',d:20}),
 watch(p){return {fl:p<.33?'open':p<.66?'swan':'tilt',d:Math.round(((p*3)%1)*30)}},
 ui:[{choose:[['open','Straight neck'],['swan','Swan neck'],['tilt','Swan neck, tilted']],label:'Flask',get:s=>s.fl,act:'fl'},{range:'d',label:'Days',min:0,max:30,step:1,get:s=>s.d,act:'d',show:v=>'day '+v}],
 on:{fl(s,v){s.fl=v},d(s,v){s.d=+v}},
 draw(s){
  const grows=s.fl!=='swan',start=s.fl==='tilt'?6:1,cloud=grows?clamp((s.d-start)/5,0,1):0;let out=heading(({open:'Open straight neck',swan:'Swan neck',tilt:'Swan neck, tilted on day 6'})[s.fl]);
  const fx=230,fy=270,br=78;
  const col=cloud>0?`rgb(${Math.round(240-60*cloud)},${Math.round(224-80*cloud)},${Math.round(170-90*cloud)})`:'#f3e9c6';
  out+=Ci(fx,fy,br,col,C.ink,'stroke-width="2.5"');
  if(s.fl==='open')out+=R(fx-14,90,28,fy-br-82,'#fff',C.ink,2)+L(fx-14,88,fx-14,fy-br+4,C.ink,2.5)+L(fx+14,88,fx+14,fy-br+4,C.ink,2.5);
  else out+=P(`M${fx-12} ${fy-br+6}V150Q${fx-12} 96 ${fx+50} 120T${fx+150} 84`,C.ink,2.5)+P(`M${fx+12} ${fy-br+6}V160Q${fx+12} 124 ${fx+56} 144T${fx+156} 104`,C.ink,2.5);
  // Dust and microbes.
  const r=rng(9);for(let i=0;i<14;i++){const ph=((s.d*.37+i/14)%1),x0=s.fl==='open'?fx-8+r()*16:fx+150+r()*10,y=60+ph*60;
   if(s.fl==='open'){const yy=60+ph*(fy-60);if(yy<fy-br+10)out+=Ci(x0,yy,2.8,C.muted)}
   else{const trapped=i<Math.min(14,s.d);if(trapped)out+=Ci(fx+40+(i%5)*6,136+(i%3)*4,2.8,C.muted);else out+=Ci(x0-ph*60,90+ph*30,2.8,C.muted)}}
  if(s.fl==='tilt'&&s.d>=6)out+=P(`M${fx+30} 140Q${fx+46} 130 ${fx+58} 140`,C.amber,6,'none','opacity=".8"')+TF(fx+60,186,'broth washed the bend',13,C.amber,'start');
  if(cloud>0)for(let i=0;i<Math.round(cloud*26);i++){const a=i*2.4,rr=(i*13%60);out+=Ci(fx+Math.cos(a)*rr,fy+Math.sin(a)*rr*.8,2.2,'#8a6a2b')}
  out+=TF(fx,fy+br+22,cloud>.5?'cloudy: microbes growing':cloud>0?'starting to cloud':'clear',14,cloud>0?C.amber:C.green);
  out+=B1_card(400,190,170,'Day '+s.d,[grows&&s.d>=start?'microbes have reached':'no microbes in the',grows&&s.d>=start?'the broth':'broth yet',''],cloud>.5?C.amber:C.green);
  return {svg:out,phase:s.fl==='swan'?'Air reaches the broth, but dust and microbes stick in the wet bend. The broth stays clear: nothing arises from the broth by itself.':s.fl==='open'?'Dust and microbes fall straight in, and the broth clouds within days.':s.d<6?'Clear so far: the swan neck is still trapping the dust.':'After tilting, broth has washed through the dusty bend and carried microbes in. It clouds within days.'};
 }});

const B1_SEMM={first:[[1841,7.8],[1842,15.8],[1843,9.0],[1844,8.2],[1845,6.9],[1846,11.4],[1847,5.0],[1848,1.3],[1849,2.7]],second:[[1841,3.5],[1842,7.6],[1843,6.0],[1844,2.3],[1845,2.0],[1846,2.8]]};
SCENE({id:'germ-theory-semmelweis',name:'Semmelweis and handwashing',tag:'Data before a theory',
 definition:'In Vienna in the 1840s, Ignaz Semmelweis noticed that far more mothers died of childbed fever in the clinic run by doctors than in the one run by midwives. Doctors came from dissecting corpses. He ordered handwashing in chlorinated lime from May 1847, and deaths fell sharply.',
 example:'From 1841 to 1846 the doctors’ clinic lost about 9.9% of mothers and the midwives’ clinic about 3.9%. In 1848, the first full year of handwashing, the doctors’ clinic lost 1.3%. His idea was resisted; he died in an asylum in 1865, before germ theory explained why it worked.',
 desc:'Yearly maternal death rates in the two clinics of the Vienna General Hospital from 1841 to 1849, with the start of handwashing marked. A choice compares the clinics, or the doctors’ clinic before and after.',
 research:['Semmelweis, I. (1861). Die Ätiologie, der Begriff und die Prophylaxis des Kindbettfiebers.','Figures as tabulated from Semmelweis (1861), e.g. in Carter, K. C. (1983) translation, The Etiology, Concept and Prophylaxis of Childbed Fever.'],
 dur:12,hint:'Compare the two clinics, then look at the doctors’ clinic before and after handwashing began in 1847.',
 init:()=>({view:'both'}),
 watch(p){return {view:p<.5?'both':'after'}},
 ui:[{choose:[['both','Two clinics, 1841–46'],['after','Before and after']],label:'View',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v}},
 draw(s){
  const both=s.view==='both',yrs=both?6:9,A=B1_axes(80,60,450,220,[1840.4,1840.6+yrs],[0,19],{xt:range(yrs).map(i=>[1841+i,String(1841+i)]),yt:[0,5,10,15],xl:'year',yl:'mothers who died (%)'});let out=heading(both?'Doctors’ clinic against midwives’ clinic':'Doctors’ clinic, before and after handwashing');
  out+=A.svg;const bw=both?22:30;
  B1_SEMM.first.slice(0,yrs).forEach(([y,v])=>{const x=A.X(y)-(both?bw:bw/2);out+=R(x,A.Y(v),bw,A.Y(0)-A.Y(v),y>=1847?C.green:C.coral,'none',3)+TF(x+bw/2,A.Y(v)-5,B1_n(v,1),13,y>=1847?C.green:C.coral)});
  if(both)B1_SEMM.second.forEach(([y,v])=>{const x=A.X(y);out+=R(x,A.Y(v),bw,A.Y(0)-A.Y(v),C.blue,'none',3)});
  if(!both){const x=A.X(1846.5);out+=L(x,60,x,280,C.green,2,'stroke-dasharray="5 4"')+TF(x+6,78,'handwashing from May 1847',13,C.green,'start')}
  out+=R(100,320,14,14,C.coral,'none',3)+TF(120,332,'doctors’ clinic',13,C.ink,'start')+(both?R(250,320,14,14,C.blue,'none',3)+TF(270,332,'midwives’ clinic',13,C.ink,'start'):R(250,320,14,14,C.green,'none',3)+TF(270,332,'doctors’ clinic, with handwashing',13,C.ink,'start'));
  out+=TF(300,362,'1847 includes four months before handwashing began',13,C.muted);
  return {svg:out,phase:both?'Every year the doctors’ clinic was deadlier, often by two or three times. The obvious difference: doctors came straight from the autopsy room.':'After handwashing, the doctors’ clinic fell to the midwives’ level. Semmelweis had the right remedy without the right theory, and was ignored for years.'};
 }});

const B1_KOCH=['Found in every case of the disease, not in healthy hosts','Can be isolated and grown in a pure culture','The pure culture causes the disease in a healthy host','The same microbe is recovered from that host'];
const B1_DIS={
 anthrax:{n:'Anthrax (Koch, 1876)',ok:[1,1,1,1],why:'Koch’s model case: all four steps work.'},
 cholera:{n:'Cholera',ok:[0,1,1,1],why:'Many people carry Vibrio cholerae without being ill, so step 1 fails. Koch himself relaxed it.'},
 leprosy:{n:'Leprosy',ok:[1,0,1,1],why:'The leprosy bacterium has never been grown in an ordinary culture, so step 2 cannot be met (armadillos are used instead).'},
 polio:{n:'Polio',ok:[0,0,1,1],why:'Most infections are silent, and a virus cannot grow on its own in a culture dish; it needs living cells.'}};
SCENE({id:'germ-theory-koch',name:'Koch’s postulates',tag:'How to prove a microbe causes a disease',
 definition:'Robert Koch set out a test for showing that a particular microbe causes a particular disease: find it in every case, grow it pure, give it to a healthy host to cause the disease, and recover it again. They were a breakthrough, but many real diseases do not fit all four.',
 example:'Anthrax fits perfectly, which is how Koch proved its cause in 1876. Cholera does not, because healthy carriers exist; leprosy does not, because its bacterium cannot be cultured. Today molecular versions of the postulates test for a microbe’s genes instead.',
 desc:'Koch’s four postulates as a checklist, with ticks and crosses for four diseases. Pressing a postulate explains it; choosing a disease shows which steps hold and why.',
 research:['Koch, R. (1876). Die Ätiologie der Milzbrand-Krankheit. Cohns Beiträge zur Biologie der Pflanzen 2.','Koch, R. (1882). Die Ätiologie der Tuberkulose.','Loeffler, F. (1884): first formal statement of the postulates.','Falkow, S. (1988). Molecular Koch’s postulates applied to microbial pathogenicity. Reviews of Infectious Diseases 10.'],
 dur:12,hint:'Choose a disease and read down the checklist. The card beneath explains why a step fails.',
 init:()=>({dis:'anthrax',sel:0}),
 watch(p){const k=Object.keys(B1_DIS);return {dis:k[Math.min(3,Math.floor(p*4))],sel:Math.floor((p*16)%4)}},
 ui:[{choose:Object.keys(B1_DIS).map(k=>[k,B1_DIS[k].n.split(' (')[0]]),label:'Disease',get:s=>s.dis,act:'dis'}],
 on:{dis(s,v){s.dis=v},pick(s,a){s.sel=+a}},
 draw(s,f,X){
  const D=B1_DIS[s.dis];let out=heading(D.n);
  B1_KOCH.forEach((t,i)=>{const y=62+i*52,ok=D.ok[i],on=i===s.sel;
   out+=hit(X,'pick',i,'Postulate '+(i+1),R(60,y,480,44,on?'#fff':'#f6f9fb',on?C.blue:C.grid,8)+Ci(88,y+22,15,ok?C.greenp:C.coralp)+TBF(88,y+28,ok?'✓':'✗',17,ok?C.green:C.coral)+TBF(116,y+20,'Step '+(i+1),13,C.muted,'start')+TF(116,y+37,t,13,C.ink,'start'))});
  out+=B1_card(60,280,480,'Why',B1_wrap(D.why,60),D.ok.every(x=>x)?C.green:C.coral);
  return {svg:out,phase:D.why};
 }});
