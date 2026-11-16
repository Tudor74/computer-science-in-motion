/* ===================== Chemistry era 4 · Bonds and shapes (1916–1960) =====================
 Lewis's shared pairs, the ionic–covalent continuum, VSEPR shapes, orbitals and hybrids, hydrogen bonds and
 electronegativity. In Try it the learner builds structures, moves atoms between bond types and reads shapes. */

/* ---------- shared helpers ---------- */
const C4_E={H:['#ffffff','#7d8f99',C.ink],C:['#3d4a52','#3d4a52','#fff'],N:['#2f5fb3','#2f5fb3','#fff'],O:['#c45238','#c45238','#fff'],F:['#4d9a3c','#4d9a3c','#fff'],Cl:['#3a8a48','#3a8a48','#fff'],Br:['#8a3b2a','#8a3b2a','#fff'],I:['#6b3fa0','#6b3fa0','#fff'],B:['#c97f6a','#c97f6a','#fff'],S:['#e0bd35','#b8961a',C.ink],P:['#d9822b','#d9822b','#fff'],Xe:['#3f8fa8','#3f8fa8','#fff'],Na:['#7156a6','#7156a6','#fff'],K:['#5a4690','#5a4690','#fff'],Li:['#8e6fc0','#8e6fc0','#fff'],Mg:['#2c776c','#2c776c','#fff'],A:['#3d4a52','#3d4a52','#fff'],X:['#1772b7','#1772b7','#fff']};
function C4_atom(x,y,el,r=20){const e=C4_E[el]||C4_E.X;return Ci(x,y,r,e[0],e[1])+TBF(x,y+5,el,el.length>1?13:15,e[2])}
function C4_wrap(x,y,text,n,size=13,col=C.ink,lh=17,anchor='start'){
 const words=String(text).split(' '),lines=[];let cur='';
 for(const w of words){if(cur&&(cur+' '+w).length>n){lines.push(cur);cur=w}else cur=cur?cur+' '+w:w}
 if(cur)lines.push(cur);return lines.map((l,i)=>TF(x,y+i*lh,l,size,col,anchor)).join('');
}
function C4_bond(x1,y1,x2,y2,o,col=C.ink,r1=20,r2=20,dashLast=false){
 const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d,px=-uy,py=ux,a=[x1+ux*r1,y1+uy*r1],b=[x2-ux*r2,y2-uy*r2];
 const offs=o===1?[0]:o===2?[-4.5,4.5]:[-7,0,7];let out='';
 offs.forEach((k,i)=>{out+=L(a[0]+px*k,a[1]+py*k,b[0]+px*k,b[1]+py*k,col,3,dashLast&&i===offs.length-1?'stroke-dasharray="5 4"':'')});
 return out;
}
function C4_angDist(a,b){let d=Math.abs(a-b)%(2*Math.PI);return d>Math.PI?2*Math.PI-d:d}
function C4_lpDirs(x,y,nbrs,n){
 const ang=nbrs.map(([a,b])=>Math.atan2(b-y,a-x)),cand=range(8).map(i=>i*Math.PI/4-Math.PI/2),out=[];
 for(let k=0;k<n;k++){let best=cand[0],bd=-1;for(const q of cand){if(out.includes(q))continue;const all=ang.concat(out);const d=all.length?Math.min(...all.map(a=>C4_angDist(q,a))):9;if(d>bd+1e-9){bd=d;best=q}}out.push(best)}
 return out;
}
function C4_pair(x,y,a,r=31,col=C.ink){const cx=x+Math.cos(a)*r,cy=y+Math.sin(a)*r,px=-Math.sin(a)*5.5,py=Math.cos(a)*5.5;return Ci(cx+px,cy+py,3.6,col)+Ci(cx-px,cy-py,3.6,col)}
// Fixed oblique view used by the 2D shape drawings (the 3D view uses the draggable camera instead).
function C4_proj(v,cx,cy,sc,yaw=.55,pitch=.38){const [x,y,z]=v,a=x*Math.cos(yaw)-y*Math.sin(yaw),b=x*Math.sin(yaw)+y*Math.cos(yaw);return [cx+a*sc,cy+(-b*Math.sin(pitch)-z*Math.cos(pitch))*sc,-b*Math.cos(pitch)+z*Math.sin(pitch)]}

/* ======================================================= lewis-structures */
const C4_VAL={H:1,C:4,N:5,O:6,F:7,Cl:7};
const C4_MOL={
 H2O:{n:'Water, H₂O',a:[['O',230,175],['H',160,235],['H',300,235]],b:[[0,1],[0,2]],ok:[1,1]},
 NH3:{n:'Ammonia, NH₃',a:[['N',230,165],['H',155,225],['H',230,265],['H',305,225]],b:[[0,1],[0,2],[0,3]],ok:[1,1,1]},
 CH4:{n:'Methane, CH₄',a:[['C',230,185],['H',230,105],['H',145,185],['H',315,185],['H',230,265]],b:[[0,1],[0,2],[0,3],[0,4]],ok:[1,1,1,1]},
 CO2:{n:'Carbon dioxide, CO₂',a:[['O',125,185],['C',230,185],['O',335,185]],b:[[1,0],[1,2]],ok:[2,2]},
 HCN:{n:'Hydrogen cyanide, HCN',a:[['H',125,185],['C',220,185],['N',330,185]],b:[[0,1],[1,2]],ok:[1,3]},
 N2:{n:'Nitrogen, N₂',a:[['N',175,185],['N',290,185]],b:[[0,1]],ok:[3]},
 O2:{n:'Oxygen, O₂',a:[['O',175,185],['O',290,185]],b:[[0,1]],ok:[2]}
};
function C4_lewis(m,ord){
 const A=m.a.map(x=>x[0]),V=sum(A.map(e=>C4_VAL[e])),bs=A.map(()=>0);
 m.b.forEach(([i,j],k)=>{bs[i]+=ord[k];bs[j]+=ord[k]});
 const bondE=2*sum(ord),lp=A.map(()=>0);let pairs=(V-bondE)/2;
 if(pairs<0)return {A,V,bondE,lp,bs,over:true};
 const deg=A.map((_,i)=>m.b.filter(b=>b.includes(i)).length);
 const order=A.map((_,i)=>i).filter(i=>A[i]!=='H').sort((i,j)=>deg[i]-deg[j]);
 for(const i of order){const g=Math.min(Math.max(0,(8-2*bs[i])/2),pairs);lp[i]+=g;pairs-=g}
 if(pairs>0&&order.length)lp[order[order.length-1]]+=pairs;
 const e=A.map((_,i)=>2*bs[i]+2*lp[i]),target=A.map(x=>x==='H'?2:8),fc=A.map((x,i)=>C4_VAL[x]-2*lp[i]-bs[i]);
 return {A,V,bondE,lp,bs,e,target,fc,over:false,good:A.every((_,i)=>e[i]===target[i])};
}
const C4_MLIST=[['H2O','H₂O'],['NH3','NH₃'],['CH4','CH₄'],['CO2','CO₂'],['HCN','HCN'],['N2','N₂'],['O2','O₂']];
SCENE({id:'lewis-structures',name:'Lewis structures',tag:'Bonds as shared pairs of electrons',
 definition:'In 1916 G. N. Lewis proposed that a covalent bond is a pair of electrons shared between two atoms, and that atoms tend to end up with eight outer electrons (two for hydrogen), counting shared pairs for both partners. A Lewis structure shows every bond and every unshared (lone) pair.',
 example:'Carbon dioxide has 16 outer electrons. With two double bonds, O=C=O, every atom has eight: carbon’s come from four shared pairs, each oxygen’s from two shared pairs and two lone pairs.',
 desc:'A molecule drawn as atoms joined by one, two or three lines. Lone pairs appear as pairs of dots, and a tally on the right counts the electrons available, those in bonds and those in lone pairs, and checks each atom’s shell.',
 research:['Lewis, G. N. (1916). The atom and the molecule. Journal of the American Chemical Society 38, 762–785.','Langmuir, I. (1919). The arrangement of electrons in atoms and molecules. Journal of the American Chemical Society 41, 868–934 (who named the “octet” rule).'],
 dur:12,hint:'Choose a molecule, then press the number on a bond to make it single, double or triple. The dots fill in automatically from the electrons left over; aim for a full shell on every atom.',
 init:()=>({m:'H2O',o:[1,1]}),
 watch(p){const L=['H2O','CO2','HCN','N2'],k=Math.min(3,Math.floor(p*4)),m=L[k],fr=p*4-k;return {m,o:fr<.5?C4_MOL[m].b.map(()=>1):C4_MOL[m].ok.slice()}},
 ui:[{choose:C4_MLIST,label:'Molecule',get:s=>s.m,act:'m'},{b:'Show the answer',act:'ans'}],
 on:{m(s,v){s.m=v;s.o=C4_MOL[v].b.map(()=>1);return 'keep'},bond(s,a){const k=Number(a);s.o[k]=s.o[k]%3+1;return 'keep'},ans(s){s.o=C4_MOL[s.m].ok.slice();return 'keep'}},
 draw(s,f,X){
  const m=C4_MOL[s.m],o=s.o,r=C4_lewis(m,o),A=m.a;let out=heading(m.n,28);
  m.b.forEach(([i,j],k)=>{const a=A[i],b=A[j];out+=C4_bond(a[1],a[2],b[1],b[2],o[k],C.ink);
   if(X.try){const dx=b[1]-a[1],dy=b[2]-a[2],d=Math.hypot(dx,dy),mx=(a[1]+b[1])/2-dy/d*24,my=(a[2]+b[2])/2+dx/d*24;
    out+=hit(X,'bond',k,`Bond ${a[0]}–${b[0]}, now ${['','single','double','triple'][o[k]]}. Press to change.`,Ci(mx,my,11,'#fff',C.blue)+TBF(mx,my+4.5,o[k],13,C.blue))}});
  if(!r.over)A.forEach((a,i)=>{if(r.lp[i]){const nb=m.b.filter(b=>b.includes(i)).map(b=>A[b[0]===i?b[1]:b[0]]).map(q=>[q[1],q[2]]);C4_lpDirs(a[1],a[2],nb,r.lp[i]).forEach(t=>{out+=C4_pair(a[1],a[2],t)})}});
  A.forEach(a=>{out+=C4_atom(a[1],a[2],a[0],20)});
  const x=420;out+=TBF(x,78,'Electron count',14,C.ink,'start');
  out+=TF(x,100,`Outer electrons: ${r.V}`,13,C.ink,'start')+TF(x,119,`In bonds: ${r.bondE}`,13,C.ink,'start')+TF(x,138,`In lone pairs: ${r.over?0:2*sum(r.lp)}`,13,C.ink,'start');
  let y=166;
  if(r.over){out+=C4_wrap(x,y,'Too many bonds: that needs more electrons than these atoms have.',24,13,C.coral)}
  else{const done=new Set();A.forEach((a,i)=>{let lab,okA;if(a[0]==='H'){if(done.has('H'))return;done.add('H');okA=A.every((b,j)=>b[0]!=='H'||r.e[j]===2);lab=`Each H: ${r.e[i]} of 2`}else{okA=r.e[i]===r.target[i];lab=`${a[0]}: ${r.e[i]} of ${r.target[i]}`}
    out+=TF(x,y,lab,13,okA?C.green:C.coral,'start');y+=19});
   out+=C4_wrap(x,y+10,r.good?'Every atom has a full shell: a valid Lewis structure.':'Some atom is short or over its shell. Change a bond.',24,13,r.good?C.green:C.coral)}
  let ph=r.over?'There are not enough electrons for that many bonds.':r.good?`Valid: ${r.V} outer electrons, ${r.bondE} of them in bonds.`:'Not yet: a shell is short or overfull.';
  if(s.m==='O2'&&r.good)ph+=' Lewis’s picture pairs every electron, yet liquid oxygen sticks to a magnet: two electrons are unpaired. Molecular orbital theory (later in this era) explains it.';
  return {svg:out,phase:ph};
 }});

/* lewis-structures-cube: Lewis's cubical atom (1902 notebook, 1916 paper). */
function C4_cubePts(cx,cy,a){const c=[];for(let z=0;z<2;z++)for(let y=0;y<2;y++)for(let x=0;x<2;x++)c.push([x,y,z]);return c.map(([x,y,z])=>({k:[x,y,z],p:[cx+(x-.5)*a+(y-.5)*a*.42,cy-(z-.5)*a-(y-.5)*a*.32]}))}
function C4_cube(cx,cy,a,filled,col,shared){
 const c=C4_cubePts(cx,cy,a),E=[[0,1],[0,2],[1,3],[2,3],[4,5],[4,6],[5,7],[6,7],[0,4],[1,5],[2,6],[3,7]];let out='';
 E.forEach(([i,j])=>{out+=L(c[i].p[0],c[i].p[1],c[j].p[0],c[j].p[1],C.line,1.8)});
 c.forEach((q,i)=>{if(filled.includes(i))out+=Ci(q.p[0],q.p[1],7,shared&&shared.includes(i)?C.coral:col,'#fff')});
 return out;
}
const C4_FILL=[7,6,5,4,3,2,1,0];
SCENE({id:'lewis-structures-cube',name:'Lewis’s cubical atom',tag:'The model before the pairs',
 definition:'Lewis first pictured the outer electrons of an atom sitting on the corners of a cube: eight corners, eight electrons, a full shell. Two atoms could complete their cubes by sharing an edge (one shared pair) or a face (two shared pairs).',
 example:'Chlorine has seven outer electrons. Two chlorine cubes sharing an edge each count eight corners filled, which is Lewis’s picture of the single bond in Cl₂.',
 desc:'One or two cubes in perspective, with dots on the corners that hold electrons. Shared corners are drawn in coral and counted by both atoms.',
 research:['Lewis, G. N. (1916). The atom and the molecule. Journal of the American Chemical Society 38, 762–785 (figures of cubical atoms; the cube idea dates from Lewis’s 1902 notes).','Kohler, R. E. (1971). The origin of G. N. Lewis’s theory of the shared pair bond. Historical Studies in the Physical Sciences 3, 343–376.'],
 dur:12,hint:'Choose one atom and change its electrons, or see two cubes sharing an edge or a face. Try the triple bond: cubes cannot do it, which is one reason Lewis moved to pairs.',
 init:()=>({v:'atom',n:6}),
 watch(p){return p<.4?{v:'atom',n:1+Math.min(7,Math.floor(p/.4*8))}:p<.6?{v:'single',n:7}:p<.8?{v:'double',n:6}:{v:'triple',n:5}},
 ui:[{choose:[['atom','One atom'],['single','Share an edge'],['double','Share a face'],['triple','Triple?']],label:'View',get:s=>s.v,act:'v'},{range:'n',label:'Outer electrons (one atom)',min:1,max:8,get:s=>s.n,act:'n'}],
 on:{v(s,v){s.v=v;return 'keep'},n(s,v){s.n=v;s.v='atom';return 'keep'}},
 draw(s){
  let out=heading('Lewis’s cubical atom',28),ph='';
  if(s.v==='atom'){const names=['Li','Be','B','C','N','O','F','Ne'];out+=C4_cube(220,200,130,C4_FILL.slice(0,s.n),C.blue);
   out+=TBF(220,330,`${names[s.n-1]}: ${s.n} outer electron${s.n>1?'s':''}`,15,C.ink);
   out+=C4_wrap(410,100,s.n===8?'All eight corners full: a stable, unreactive shell, as in neon.':`${8-s.n} corner${8-s.n>1?'s':''} empty. The atom gains, loses or shares electrons to fill them.`,24,13,C.ink);
   ph=`${names[s.n-1]} has ${s.n} outer electrons on the corners of its cube.`}
  else if(s.v==='single'){const a=110;out+=C4_cube(170,235,a,[0,1,3,4,5,6,7],C.blue,[5,7])+C4_cube(170+a,235-a,a,[0,1,2,3,4,5,6],'#3a8a48',[0,2]);
   out+=TBF(170,330,'Cl',15,C.ink)+TBF(280,330,'Cl',15,C.ink);
   out+=C4_wrap(410,100,'Two chlorine cubes share one edge. Each has 7 electrons of its own; the 2 corners on the shared edge count for both, so each sees 8.',24,13,C.ink);
   ph='An edge shared between two cubes: one shared pair, a single bond (Cl₂).'}
  else if(s.v==='double'){const a=110;out+=C4_cube(160,200,a,[1,3,5,7,0,2],C.blue,[1,3,5,7])+C4_cube(160+a,200,a,[0,2,4,6,1,3],'#3a8a48',[0,2,4,6]);
   out+=TBF(160,330,'O',15,C.ink)+TBF(270,330,'O',15,C.ink);
   out+=C4_wrap(410,100,'Two oxygen cubes share a face. Each has 6 electrons; the 4 shared corners count for both, so each sees 8: a double bond.',24,13,C.ink);
   ph='A face shared between two cubes: two shared pairs, a double bond (O₂).'}
  else{out+=C4_cube(135,200,100,[0,1,2,3,4],C.blue)+C4_cube(300,200,100,[0,1,2,3,4],'#3a8a48')+TBF(218,210,'?',30,C.coral);
   out+=TBF(135,330,'N',15,C.ink)+TBF(300,330,'N',15,C.ink);
   out+=C4_wrap(410,100,'N₂ needs three shared pairs. Two cubes cannot share three corners symmetrically, so the cube cannot show a triple bond.',24,13,C.ink);
   out+=C4_wrap(410,210,'In 1916 Lewis already preferred pairs that could point to the corners of a tetrahedron, which handles triple bonds and leads to the shapes in the VSEPR lesson.',24,13,C.muted);
   ph='Cubes cannot share three corners evenly, so Lewis’s cube fails for triple bonds like N₂; electron pairs succeed.'}
  return {svg:out,phase:ph};
 }});

/* lewis-structures-formal-charge */
const C4_FCM={
 CO2:{n:'CO₂',a:[['O',120,190],['C',230,190],['O',340,190]],b:[[1,0],[1,2]],S:[{o:[2,2],lp:[2,0,2]},{o:[1,3],lp:[3,0,1]}],real:'Both C–O bonds are 116 pm, the length of a C=O double bond.'},
 O3:{n:'O₃ (ozone)',a:[['O',135,225],['O',230,160],['O',325,225]],b:[[1,0],[1,2]],S:[{o:[2,1],lp:[2,1,3]},{o:[1,2],lp:[3,1,2]}],real:'Both O–O bonds are 128 pm, between a single (148 pm) and a double bond (121 pm).'},
 NO3:{n:'NO₃⁻ (nitrate)',ch:-1,a:[['N',230,190],['O',230,100],['O',150,250],['O',310,250]],b:[[0,1],[0,2],[0,3]],S:[{o:[2,1,1],lp:[0,2,3,3]},{o:[1,2,1],lp:[0,3,2,3]},{o:[1,1,2],lp:[0,3,3,2]}],real:'All three N–O bonds are the same length, 124 pm: each is about one and a third bonds.'}
};
function C4_fc(m,st){return m.a.map(([el],i)=>{const bs=m.b.reduce((t,[x,y],k)=>t+((x===i||y===i)?st.o[k]:0),0);return C4_VAL[el]-2*st.lp[i]-bs})}
SCENE({id:'lewis-structures-formal-charge',name:'Formal charge and resonance',tag:'Choosing between structures',
 definition:'Formal charge is the bookkeeping charge an atom would carry if every shared pair were split evenly: outer electrons of the free atom, minus its lone-pair electrons, minus half its bonding electrons. The best Lewis structure usually has the smallest formal charges. When several equally good structures exist, the real molecule is a blend of them, called resonance.',
 example:'For nitrate, NO₃⁻, three structures put the double bond on a different oxygen. None is right alone: all three N–O bonds measure the same, about one and a third bonds each.',
 desc:'A Lewis structure with formal charges in small circles beside each atom. Switch between alternative structures, or show the resonance hybrid with partial bonds drawn dashed.',
 research:['Pauling, L. (1939). The Nature of the Chemical Bond. Cornell University Press (resonance between valence-bond structures).','Langmuir, I. (1920). The octet theory of valence and its applications with special reference to organic nitrogen compounds. Journal of the American Chemical Society 42, 274–292 (early formal-charge bookkeeping).'],
 dur:12,hint:'Choose a molecule and a structure. Compare the formal charges, then press “Hybrid” to see the blend the molecule really is.',
 init:()=>({m:'CO2',k:0,hy:false}),
 watch(p){return p<.34?{m:'CO2',k:p<.17?1:0,hy:false}:p<.67?{m:'O3',k:p<.5?0:1,hy:p>.58}:{m:'NO3',k:Math.min(2,Math.floor((p-.67)/.33*4)),hy:p>.9}},
 ui:[{choose:[['CO2','CO₂'],['O3','O₃'],['NO3','NO₃⁻']],label:'Molecule',get:s=>s.m,act:'m'},{choose:[['0','Structure A'],['1','Structure B'],['2','Structure C']],label:'Structure',get:s=>String(s.k),act:'k'},{b:'Hybrid on/off',act:'hy'}],
 on:{m(s,v){s.m=v;s.k=0;s.hy=false;return 'keep'},k(s,v){const n=C4_FCM[s.m].S.length;s.k=Math.min(n-1,Number(v));s.hy=false;return 'keep'},hy(s){s.hy=!s.hy;return 'keep'}},
 draw(s){
  const m=C4_FCM[s.m],k=Math.min(m.S.length-1,s.k),st=m.S[k],fc=C4_fc(m,st),A=m.a;let out=heading(`${m.n}: ${s.hy?'resonance hybrid':'structure '+'ABC'[k]}`,28);
  m.b.forEach(([i,j],b)=>{const a=A[i],c=A[j];if(s.hy){const avg=sum(m.S.map(t=>t.o[b]))/m.S.length,lo=Math.floor(avg);out+=C4_bond(a[1],a[2],c[1],c[2],avg>lo?lo+1:lo,C.ink,20,20,avg>lo);
    const dx=c[1]-a[1],dy=c[2]-a[2],d=Math.hypot(dx,dy);out+=TF((a[1]+c[1])/2-dy/d*22,(a[2]+c[2])/2+dx/d*22+4,avg%1?(Math.abs(avg-4/3)<.01?'1⅓':'1½'):String(avg),13,C.blue)}
   else out+=C4_bond(a[1],a[2],c[1],c[2],st.o[b],C.ink)});
  if(!s.hy)A.forEach((a,i)=>{if(st.lp[i]){const nb=m.b.filter(b=>b.includes(i)).map(b=>A[b[0]===i?b[1]:b[0]]).map(q=>[q[1],q[2]]);C4_lpDirs(a[1],a[2],nb,st.lp[i]).forEach(t=>{out+=C4_pair(a[1],a[2],t)})}});
  A.forEach((a,i)=>{out+=C4_atom(a[1],a[2],a[0],20);if(!s.hy&&fc[i]){out+=Ci(a[1]+22,a[2]-22,10,fc[i]>0?C.coralp:C.pale,fc[i]>0?C.coral:C.blue)+TBF(a[1]+22,a[2]-17.5,fc[i]>0?'+'+fc[i]:'−'+(-fc[i]),12,fc[i]>0?C.coral:C.blue)}});
  if(m.ch)out+=TBF(230,335,'overall charge −1',13,C.blue);
  const x=410;out+=TBF(x,78,s.hy?'What is measured':'Formal charges',14,C.ink,'start');
  if(s.hy)out+=C4_wrap(x,100,m.real,25,13,C.ink);
  else{const tot=sum(fc.map(Math.abs));out+=TF(x,100,fc.map((v,i)=>`${A[i][0]} ${v>0?'+':v<0?'−':''}${Math.abs(v)}`).join(' · '),13,C.ink,'start');
   out+=TF(x,120,`Sum of sizes: ${tot}`,13,C.ink,'start');
   const best=Math.min(...m.S.map(t=>sum(C4_fc(m,t).map(Math.abs))));const eq=m.S.filter(t=>sum(C4_fc(m,t).map(Math.abs))===best).length;
   out+=C4_wrap(x,150,tot>best?'Larger formal charges than another structure: a poorer description.':eq>1?`${eq} structures tie for the smallest charges. The molecule is a blend: press Hybrid.`:'The smallest formal charges possible: the best single structure.',25,13,tot>best?C.coral:C.green)}
  return {svg:out,phase:s.hy?m.real:`Structure ${'ABC'[k]}: formal charges ${fc.map(v=>v>0?'+'+v:String(v).replace('-','−')).join(', ')}.`};
 }});

/* ======================================================= ionic-covalent */
const C4_IC=[['HH','H–H','H','H',0],['CH','C–H','C','H',.35],['HCl','H–Cl','H','Cl',.96],['HF','H–F','H','F',1.78],['NaCl','Na–Cl','Na','Cl',2.23],['KF','K–F','K','F',3.16]];
const C4_ion=d=>1-Math.exp(-d*d/4);
SCENE({id:'ionic-covalent',name:'From covalent to ionic',tag:'One continuum, not two boxes',
 definition:'Bonds range continuously from equal sharing (H–H) through unequal sharing (H–Cl) to near-complete transfer (Na⁺Cl⁻). The bigger the difference in electronegativity between the atoms, the more the shared pair shifts towards one of them.',
 example:'In H–Cl the pair sits closer to chlorine, leaving hydrogen slightly positive (δ+) and chlorine slightly negative (δ−). In sodium chloride the electron has essentially moved: Na⁺ and Cl⁻.',
 desc:'Two atoms with their shared electron pair drawn between them. A slider for the electronegativity difference moves the pair towards one atom, and a bar shows Pauling’s estimate of “percent ionic character”.',
 research:['Pauling, L. (1932). The nature of the chemical bond. IV. The energy of single bonds and the relative electronegativity of atoms. Journal of the American Chemical Society 54, 3570–3582.','Pauling, L. (1960). The Nature of the Chemical Bond, 3rd edn. Cornell University Press (the empirical formula 1 − e^(−Δχ²/4)).'],
 dur:12,hint:'Slide the electronegativity difference or pick a real bond. The cut-offs between “covalent”, “polar” and “ionic” are conventions, not laws.',
 init:()=>({d:.96,k:'HCl'}),
 watch(p){const r=C4_IC[Math.min(5,Math.floor(p*6))];return {d:r[4],k:r[0]}},
 ui:[{choose:C4_IC.map(r=>[r[0],r[1]]),label:'Bond',get:s=>s.k,act:'k'},{range:'d',label:'Electronegativity difference',min:0,max:3.3,step:.05,get:s=>s.d,act:'d',show:v=>Number(v).toFixed(2)}],
 on:{k(s,v){const r=C4_IC.find(q=>q[0]===v);s.k=v;s.d=r[4];return 'keep'},d(s,v){s.d=v;s.k='custom';return 'keep'}},
 draw(s){
  const r=C4_IC.find(q=>q[0]===s.k),la=r?r[2]:'A',lb=r?r[3]:'B',ion=C4_ion(s.d);let out=heading(`${r?r[1]:'A–B'}: electronegativity difference ${s.d.toFixed(2)}`,28);
  const ax=150,bx=350,y=160,px=lerp(250,bx-6,ion);
  out+=`<ellipse cx="${fmt(px)}" cy="${y}" rx="${fmt(lerp(78,46,ion))}" ry="38" fill="${C.pale}" opacity=".85"/>`;
  out+=C4_atom(ax,y,la,30)+C4_atom(bx,y,lb,30)+Ci(px-6,y-42,4.5,C.ink)+Ci(px+6,y-42,4.5,C.ink);
  const q=ion>.5?['+','−']:s.d>.05?['δ+','δ−']:['',''];out+=TBF(ax,y-46,q[0],16,C.coral)+TBF(bx+38,y-30,q[1],16,C.blue);
  // ionic-character bar
  const x0=60,w=480,yb=270;out+=R(x0,yb,w,18,'#fff',C.line,4)+R(x0,yb,w*ion,18,C.blue,'none',4);
  [[.4,'0.4'],[1.7,'1.7']].forEach(([d,l])=>{const xx=x0+w*C4_ion(d);out+=L(xx,yb-6,xx,yb+24,C.muted,1.5,'stroke-dasharray="3 3"')+TF(xx,yb+38,'Δ '+l,13,C.muted)});
  out+=TF(x0,yb-10,'non-polar',13,C.muted,'start')+TF(x0+w*.45,yb-10,'polar covalent',13,C.muted)+TF(x0+w,yb-10,'mostly ionic',13,C.muted,'end');
  out+=TBF(300,340,`About ${Math.round(ion*100)}% ionic character (Pauling’s estimate)`,15,C.ink);
  const cls=s.d<.4?'non-polar covalent':s.d<1.7?'polar covalent':'mostly ionic';
  let ph=`A difference of ${s.d.toFixed(2)} gives a ${cls} bond, about ${Math.round(ion*100)}% ionic by Pauling’s formula.`;
  if(s.k==='HCl')ph+=' The measured dipole of HCl suggests about 18%, so the formula is a rough guide.';
  return {svg:out,phase:ph};
 }});

/* ionic-covalent-born-haber */
const C4_BH=[{t:'Na(s) + ½Cl₂(g)',e:0,step:'start'},{t:'Na(g) + ½Cl₂(g)',e:107,step:'Turn sodium into gas: +107'},{t:'Na(g) + Cl(g)',e:229,step:'Break half a Cl–Cl bond: +122'},{t:'Na⁺(g) + e⁻ + Cl(g)',e:725,step:'Remove sodium’s electron: +496'},{t:'Na⁺(g) + Cl⁻(g)',e:376,step:'Chlorine gains the electron: −349'},{t:'NaCl(s)',e:-411,step:'Ions pack into the crystal: −787'}];
SCENE({id:'ionic-covalent-born-haber',name:'The Born–Haber cycle',tag:'Why salt holds together',
 definition:'The Born–Haber cycle (1919) builds an ionic solid from its elements in imaginary steps whose energies can be measured. Because energy is conserved, the steps must add up to the measured heat of formation, which reveals the one quantity that cannot be measured directly: the lattice enthalpy.',
 example:'Making Na⁺ and Cl⁻ from the elements costs energy overall (+376 kJ/mol). Salt still forms readily because packing the ions into a crystal releases 787 kJ/mol.',
 desc:'An energy-level diagram: each step moves up (costs energy) or down (releases it), from sodium metal and chlorine gas to solid sodium chloride. Numbers are standard values in kJ per mole.',
 research:['Born, M. (1919). Eine thermochemische Anwendung der Gittertheorie. Verhandlungen der Deutschen Physikalischen Gesellschaft 21, 13–24.','Haber, F. (1919). Betrachtungen zur Theorie der Wärmetönung. Verhandlungen der Deutschen Physikalischen Gesellschaft 21, 750–768.','Values: CRC Handbook of Chemistry and Physics (rounded).'],
 dur:12,hint:'Press Next step to climb the cycle. The surprise is that forming the ions costs energy: the crystal pays it back.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(5,Math.floor(p*6.5))}},
 ui:[{b:'Back',act:'back'},{b:'Next step',act:'next'},{b:'Whole cycle',act:'all'}],
 on:{next(s){s.k=Math.min(5,s.k+1);return 'keep'},back(s){s.k=Math.max(0,s.k-1);return 'keep'},all(s){s.k=5;return 'keep'}},
 draw(s){
  const Y=e=>330-(e+411)*265/1136;let out=heading('Building salt in steps (kJ/mol)',26);
  for(let i=0;i<=s.k;i++){const lv=C4_BH[i],y=Y(lv.e);out+=L(70,y,290,y,i===s.k?C.ink:C.line,i===s.k?3:2)+TF(300,y+4,lv.t,13,i===s.k?C.ink:C.muted,'start');
   if(i>0){const y0=Y(C4_BH[i-1].e),x=86+i*36,up=lv.e>C4_BH[i-1].e;out+=arrow(x,y0,x,y,up?C.coral:C.green,2.4,8);const v=lv.e-C4_BH[i-1].e;out+=TF(x+4,(y0+y)/2+4,(v>0?'+':'−')+Math.abs(v),13,up?C.coral:C.green,'start')}}
  if(s.k===5){out+=arrow(60,Y(0),60,Y(-411),C.blue,2.4,8)+TF(56,Y(-200),'−411',13,C.blue,'end')}
  out+=TF(300,362,s.k===5?'Lattice enthalpy = −411 − (107 + 122 + 496 − 349) = −787':C4_BH[s.k].step,13,C.ink);
  const ph=s.k===0?'Start from sodium metal and chlorine gas, set at zero.':s.k<5?C4_BH[s.k].step+' kJ/mol.':'Hess’s law closes the cycle: the measured heat of formation (−411) fixes the lattice enthalpy at −787 kJ/mol.';
  return {svg:out,phase:ph};
 }});

/* ionic-covalent-properties */
const C4_SUB=[
 {k:'NaCl',n:'Sodium chloride',b:'ionic lattice',mp:801,cond:['no','yes','yes'],note:'Ions are locked in place in the solid; melted or dissolved, they move and carry current.'},
 {k:'MgO',n:'Magnesium oxide',b:'ionic lattice (2+ and 2−)',mp:2852,cond:['no','yes','barely dissolves'],note:'Doubly charged ions attract four times as strongly: lattice enthalpy about −3800 against −787 for NaCl.'},
 {k:'SiO2',n:'Quartz, SiO₂',b:'covalent network',mp:1713,cond:['no','no','insoluble'],note:'Every atom is held by strong covalent bonds in all directions: a giant molecule.'},
 {k:'Cu',n:'Copper',b:'metallic',mp:1085,cond:['yes','yes','insoluble'],note:'Outer electrons move freely through a lattice of ions, so the solid conducts.'},
 {k:'H2O',n:'Ice, H₂O',b:'molecules with hydrogen bonds',mp:0,cond:['no','barely','—'],note:'Strong bonds inside each molecule, weaker attractions between them.'},
 {k:'CH4',n:'Methane, CH₄',b:'separate molecules',mp:-182,cond:['no','no','—'],note:'Only weak attractions between molecules, so very little energy separates them.'}];
SCENE({id:'ionic-covalent-properties',name:'Bonds and properties',tag:'What the bond type predicts',
 definition:'The kind of bonding in a substance predicts much of how it behaves. Ionic solids melt high and conduct only when melted or dissolved; covalent networks melt very high and do not conduct; metals conduct as solids; molecular substances melt low because only weak forces hold the molecules together.',
 example:'Salt melts at 801 °C and conducts once melted. Methane, held by covalent bonds just as strong inside each molecule, melts at −182 °C because the molecules barely attract one another.',
 desc:'Melting points of six substances on one temperature scale, coloured by bond type, with a table of whether each conducts as a solid, as a liquid and in water.',
 research:['Pauling, L. (1960). The Nature of the Chemical Bond, 3rd edn. Cornell University Press.','Melting points: CRC Handbook of Chemistry and Physics (rounded).'],
 dur:12,hint:'Pick a substance to see its bonding, melting point and whether it conducts.',
 init:()=>({k:'NaCl'}),
 watch(p){return {k:C4_SUB[Math.min(5,Math.floor(p*6))].k}},
 ui:[{choose:C4_SUB.map(q=>[q.k,q.n.split(',')[0]]),label:'Substance',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  const cur=C4_SUB.find(q=>q.k===s.k);let out=heading('Melting point by bond type (°C)',26);
  const col=q=>q.b.startsWith('ionic')?C.blue:q.b.startsWith('covalent')?C.green:q.b==='metallic'?C.amber:C.purple;
  const x0=150,w=260,X0=t=>x0+(t+273)/(3200)*w;
  out+=L(X0(0),50,X0(0),250,C.line,1.5,'stroke-dasharray="3 3"')+TF(X0(0),262,'0 °C',13,C.muted);
  C4_SUB.forEach((q,i)=>{const y=60+i*32,on=q.k===s.k,inner=TF(x0-8,y+15,q.n.split(',')[0],13,on?C.ink:C.muted,'end')+R(x0,y+2,Math.max(3,X0(q.mp)-x0),18,on?col(q):tint(col(q),.6),'none',4)+TF(X0(q.mp)+6,y+16,q.mp+'°',13,C.ink,'start');
   out+=hit(X,'k',q.k,`${q.n}, melts at ${q.mp} °C`,inner)});
  out+=TBF(460,70,cur.n,14,C.ink,'start')+TF(460,90,cur.b,13,col(cur),'start');
  out+=TF(460,116,'Conducts as',13,C.muted,'start');
  ['solid','liquid','in water'].forEach((l,i)=>{out+=TF(460,136+i*18,`${l}: ${cur.cond[i]}`,13,C.ink,'start')});
  out+=C4_wrap(40,290,cur.note,80,13,C.ink);
  return {svg:out,phase:`${cur.n}: ${cur.b}, melts at ${cur.mp} °C. ${cur.note}`};
 }});

/* ======================================================= vsepr-shapes */
function C4_dirs(n){const s=Math.sqrt(8/9),t=a=>a*Math.PI/180;
 if(n===2)return [[1,0,0],[-1,0,0]];
 if(n===3)return [0,120,240].map(a=>[Math.cos(t(a)),Math.sin(t(a)),0]);
 if(n===4)return [[0,0,1]].concat([0,120,240].map(a=>[s*Math.cos(t(a)),s*Math.sin(t(a)),-1/3]));
 if(n===5)return [[0,0,1],[0,0,-1]].concat([0,120,240].map(a=>[Math.cos(t(a)),Math.sin(t(a)),0]));
 return [[0,0,1],[0,0,-1],[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]];}
// which domain indices hold lone pairs (equatorial first for 5; trans pair first for 6)
function C4_lone(n,l){const o=n===3?[0]:n===4?[0,1]:n===5?[2,3,4]:n===6?[0,1]:[];return o.slice(0,l)}
const C4_SHAPES={2:['linear'],3:['trigonal planar','bent'],4:['tetrahedral','trigonal pyramidal','bent'],5:['trigonal bipyramidal','seesaw','T-shaped','linear'],6:['octahedral','square pyramidal','square planar']};
const C4_EXAMPLE={'2-0':'CO₂, BeCl₂','3-0':'BF₃','3-1':'SO₂','4-0':'CH₄','4-1':'NH₃','4-2':'H₂O','5-0':'PCl₅','5-1':'SF₄','5-2':'ClF₃','5-3':'XeF₂','6-0':'SF₆','6-1':'BrF₅','6-2':'XeF₄'};
function C4_shape(drawP,c,x,n,l,R0=1){
 // returns items for depth sorting: bonds+atoms and lone-pair lobes
 const dirs=C4_dirs(n),lone=C4_lone(n,l),items=[];
 dirs.forEach((d,i)=>{const v=d.map(q=>q*R0);if(lone.includes(i)){const tip=d.map(q=>q*.66*R0),mid=d.map(q=>q*.4*R0);items.push({at:tip,svg:P=>{const o=P([0,0,0]),p=P(tip),m=P(mid),dx=p[0]-o[0],dy=p[1]-o[1],len=Math.hypot(dx,dy)||1,ang=Math.atan2(dy,dx)*180/Math.PI,nx=-dy/len*5,ny=dx/len*5,q=P(d.map(t=>t*.5*R0));return `<ellipse cx="${fmt(m[0])}" cy="${fmt(m[1])}" rx="${fmt(Math.max(13,len*.55))}" ry="14" transform="rotate(${fmt(ang)} ${fmt(m[0])} ${fmt(m[1])})" fill="${C.amberp}" stroke="${C.amber}" stroke-width="1.5" opacity=".92"/>`+Ci(q[0]+nx,q[1]+ny,3.4,C.amber)+Ci(q[0]-nx,q[1]-ny,3.4,C.amber)}})}
  else items.push({at:v,svg:P=>{const o=P([0,0,0]),p=P(v);return L(o[0],o[1],p[0],p[1],C.ink,4)+C4_atom(p[0],p[1],x,17)}})});
 items.push({at:[0,0,0],svg:P=>{const o=P([0,0,0]);return C4_atom(o[0],o[1],c,21)}});
 return items;
}
const C4_VS={CO2:['CO₂','C','O',2,0,'180°'],BF3:['BF₃','B','F',3,0,'120°'],CH4:['CH₄','C','H',4,0,'109.5°'],NH3:['NH₃','N','H',4,1,'107°'],H2O:['H₂O','O','H',4,2,'104.5°'],PCl5:['PCl₅','P','Cl',5,0,'90° and 120°'],SF6:['SF₆','S','F',6,0,'90°'],XeF4:['XeF₄','Xe','F',6,2,'90°']};
const C4_VSL=Object.keys(C4_VS);
SCENE({id:'vsepr-shapes',name:'VSEPR shapes',tag:'Electron pairs push apart',
 definition:'Valence-shell electron-pair repulsion (VSEPR) predicts a molecule’s shape by assuming that the groups of electrons around the central atom, both bonds and lone pairs, spread out as far from each other as possible. Two groups give a line, three a triangle, four a tetrahedron, five a trigonal bipyramid, six an octahedron.',
 example:'Methane, ammonia and water all have four electron groups around the central atom, so all are built on a tetrahedron. Methane uses all four for bonds; ammonia has one lone pair (a pyramid); water has two (a bent molecule).',
 desc:'A molecule drawn in three dimensions: bonds and outer atoms, with lone pairs shown as amber lobes. A panel gives the number of electron groups, the shape’s name and its bond angles. The 3D view can be turned by dragging.',
 research:['Sidgwick, N. V. & Powell, H. M. (1940). Bakerian Lecture: Stereochemical types and valency groups. Proceedings of the Royal Society A 176, 153–180.','Gillespie, R. J. & Nyholm, R. S. (1957). Inorganic stereochemistry. Quarterly Reviews, Chemical Society 11, 339–380.'],
 dur:14,hint:'Choose a molecule. In 3D, drag to turn it; lone pairs are the amber lobes. Count the groups of electrons, not just the bonds.',
 init:()=>({m:'NH3'}),
 watch(p){return {m:C4_VSL[Math.min(7,Math.floor(p*8))]}},
 ui:[{choose:C4_VSL.map(k=>[k,C4_VS[k][0]]),label:'Molecule',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v;return 'keep'}},
 draw(s){
  const [nm,c,x,n,l,ang]=C4_VS[s.m];let out=heading(`${nm}: ${C4_SHAPES[n][l]}`,28);
  const P=v=>C4_proj(v,200,200,105);out+=sortedItems(C4_shape(P,c,x,n,l),P);
  const px=400;out+=TBF(px,90,'Electron groups',14,C.ink,'start')+TF(px,110,`${n} around ${c}: ${n-l} bond${n-l>1?'s':''}, ${l} lone pair${l===1?'':'s'}`,13,C.ink,'start');
  out+=TBF(px,142,'Shape',14,C.ink,'start')+TF(px,162,C4_SHAPES[n][l],13,C.ink,'start');
  out+=TBF(px,194,'Bond angle',14,C.ink,'start')+TF(px,214,ang,13,C.ink,'start');
  out+=C4_wrap(px,246,s.m==='CO2'?'A double bond counts as one group: two groups, a straight line.':l?'Lone pairs take up room but are not “seen” in the shape, which is named from the atoms alone.':'All groups are bonds, so the shape matches the arrangement of electron groups.',27,13,C.muted);
  return {svg:out,phase:`${nm}: ${n} electron groups (${l} lone), ${C4_SHAPES[n][l]}, ${ang}.`};
 },
 three(s,f,X,project){const [nm,c,x,n,l]=C4_VS[s.m];const P=project([-1.3,1.3,-1.3,1.3,-1.3,1.3]);return {svg:sortedItems(C4_shape(P,c,x,n,l),P),title:`${nm} in 3D`,caption:`${C4_SHAPES[n][l]}: drag to turn. Amber lobes are lone pairs.`}}
});

/* vsepr-shapes-domains */
SCENE({id:'vsepr-shapes-domains',name:'Counting electron groups',tag:'From AXE notation to a shape',
 definition:'In AXₘEₙ notation, A is the central atom, m the number of bonded atoms X and n the number of lone pairs E. The total m + n sets the arrangement of electron groups; how many of those are lone pairs sets the shape that the atoms make.',
 example:'Sulfur tetrafluoride, SF₄, is AX₄E₁: five groups arranged as a trigonal bipyramid, with the lone pair on the “equator” where it has more room, leaving a seesaw shape.',
 desc:'A generic central atom A with bonded atoms X and amber lone pairs E, drawn for any number of groups from two to six. The panel names the arrangement, the shape and a real example.',
 research:['Gillespie, R. J. & Nyholm, R. S. (1957). Inorganic stereochemistry. Quarterly Reviews, Chemical Society 11, 339–380.','Gillespie, R. J. & Hargittai, I. (1991). The VSEPR Model of Molecular Geometry. Allyn & Bacon.'],
 dur:14,hint:'Set the number of electron groups, then turn some into lone pairs. With five groups, lone pairs go to the equator; with six, to opposite corners.',
 init:()=>({n:5,l:1}),
 watch(p){const L=[[2,0],[3,0],[3,1],[4,0],[4,1],[4,2],[5,0],[5,1],[5,2],[5,3],[6,0],[6,1],[6,2]],q=L[Math.min(12,Math.floor(p*13))];return {n:q[0],l:q[1]}},
 ui:[{range:'n',label:'Electron groups',min:2,max:6,get:s=>s.n,act:'n'},{range:'l',label:'Lone pairs',min:0,max:3,get:s=>s.l,act:'l'}],
 on:{n(s,v){s.n=v;s.l=Math.min(s.l,C4_SHAPES[v].length-1);return 'keep'},l(s,v){s.l=Math.min(v,C4_SHAPES[s.n].length-1);return 'keep'}},
 draw(s){
  const n=s.n,l=Math.min(s.l,C4_SHAPES[n].length-1),geo=C4_SHAPES[n][0];let out=heading(`AX${n-l}E${l}: ${C4_SHAPES[n][l]}`,28);
  const P=v=>C4_proj(v,200,200,100);out+=sortedItems(C4_shape(P,'A','X',n,l),P);
  const px=400;out+=TBF(px,90,'Electron groups',14,C.ink,'start')+TF(px,110,`${n}: arranged ${geo}`,13,C.ink,'start');
  out+=TBF(px,142,'Shape of the atoms',14,C.ink,'start')+TF(px,162,C4_SHAPES[n][l],13,C.ink,'start');
  out+=TBF(px,194,'Example',14,C.ink,'start')+TF(px,214,C4_EXAMPLE[n+'-'+l]||'—',13,C.ink,'start');
  if(s.l>l)out+=C4_wrap(px,246,`With ${n} groups, at most ${C4_SHAPES[n].length-1} lone pair${C4_SHAPES[n].length-1===1?' is':'s are'} shown here.`,27,13,C.muted);
  return {svg:out,phase:`${n} electron groups (${geo}) with ${l} lone pair${l===1?'':'s'}: ${C4_SHAPES[n][l]}, as in ${C4_EXAMPLE[n+'-'+l]}.`};
 }});

/* vsepr-shapes-angles */
const C4_ANG=[['CH4','CH₄',109.5,0,'C'],['NH3','NH₃',106.7,1,'N'],['H2O','H₂O',104.5,2,'O'],['PH3','PH₃',93.5,1,'P'],['H2S','H₂S',92.1,2,'S']];
SCENE({id:'vsepr-shapes-angles',name:'Lone pairs squeeze angles',tag:'Where VSEPR works, and where it stops',
 definition:'Lone pairs are held by only one nucleus, so they spread out more than bonding pairs and push the bonds closer together. VSEPR predicts the order of bond angles from methane (109.5°) through ammonia to water. For heavier atoms like phosphorus and sulfur the angles fall close to 90°, more than the simple model explains.',
 example:'Water’s H–O–H angle is 104.5°, not the 109.5° of a perfect tetrahedron. Hydrogen sulfide, with the same AX₂E₂ count, is 92°.',
 desc:'The angle between two bonds drawn with an arc and its value, beside bars comparing five hydrides against the tetrahedral angle.',
 research:['Gillespie, R. J. & Nyholm, R. S. (1957). Inorganic stereochemistry. Quarterly Reviews, Chemical Society 11, 339–380.','Gillespie, R. J. & Popelier, P. L. A. (2001). Chemical Bonding and Molecular Geometry. Oxford University Press (the heavier hydrides).','Angles: CRC Handbook of Chemistry and Physics (gas-phase structures, rounded).'],
 dur:12,hint:'Compare methane, ammonia and water, then try the heavier PH₃ and H₂S, where the simple story no longer fits.',
 init:()=>({m:'H2O'}),
 watch(p){return {m:C4_ANG[Math.min(4,Math.floor(p*5))][0]}},
 ui:[{choose:C4_ANG.map(r=>[r[0],r[1]]),label:'Molecule',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v;return 'keep'}},
 draw(s,f,X){
  const r=C4_ANG.find(q=>q[0]===s.m),a=r[2]*Math.PI/180;let out=heading(`${r[1]}: H–${r[4]}–H angle ${r[2]}°`,28);
  const cx=170,cy=150,L0=110,h1=[cx-Math.sin(a/2)*L0,cy+Math.cos(a/2)*L0],h2=[cx+Math.sin(a/2)*L0,cy+Math.cos(a/2)*L0];
  out+=L(cx,cy,h1[0],h1[1],C.ink,4)+L(cx,cy,h2[0],h2[1],C.ink,4);
  const ar=46,p1=[cx-Math.sin(a/2)*ar,cy+Math.cos(a/2)*ar],p2=[cx+Math.sin(a/2)*ar,cy+Math.cos(a/2)*ar];
  out+=P(`M${fmt(p1[0])} ${fmt(p1[1])} A${ar} ${ar} 0 0 0 ${fmt(p2[0])} ${fmt(p2[1])}`,C.coral,2.5);
  out+=TBF(cx,cy+ar+24,r[2]+'°',15,C.coral);
  for(let i=0;i<r[3];i++){const t=-Math.PI/2+(r[3]===2?(i?.55:-.55):0);out+=C4_pair(cx,cy,t,34,C.amber)}
  out+=C4_atom(cx,cy,r[4],21)+C4_atom(h1[0],h1[1],'H',16)+C4_atom(h2[0],h2[1],'H',16);
  const x0=370,base=300;
  const y0=v=>base-(v-80)*7.5;out+=L(x0-10,y0(109.5),x0+210,y0(109.5),C.muted,1.5,'stroke-dasharray="4 4"')+TF(x0+210,y0(109.5)-6,'109.5° tetrahedral',13,C.muted,'end');
  C4_ANG.forEach((q,i)=>{const x=x0+i*42,on=q[0]===s.m,inner=R(x,y0(q[2]),30,base-y0(q[2]),on?C.coral:C.line,'none',4)+TF(x+15,base+18,q[1],13,on?C.ink:C.muted)+TF(x+15,y0(q[2])-6,String(q[2]),13,C.ink);out+=hit(X,'m',q[0],`${q[1]}, ${q[2]} degrees`,inner)});
  const ph=r[4]==='C'?'Four bonding pairs and no lone pairs: the ideal tetrahedral 109.5°.':r[4]==='N'||r[4]==='O'?`${r[3]} lone pair${r[3]>1?'s':''} squeeze the bonds to ${r[2]}°, as VSEPR predicts.`:`${r[2]}°: much closer to 90° than VSEPR alone suggests. The central atom’s bonds use almost pure p orbitals; models disagree on how best to explain it.`;
  return {svg:out,phase:ph};
 }});

/* ======================================================= orbitals-hybrids */
const C4_ORB=[['s','s'],['p','p'],['sp','sp'],['sp2','sp²'],['sp3','sp³']];
const C4_hn={sp:1,sp2:2,sp3:3};
function C4_amp(k,th){if(k==='s')return 1;if(k==='p')return Math.sqrt(3)*Math.cos(th);const n=C4_hn[k];return (1+Math.sqrt(3*n)*Math.cos(th))/Math.sqrt(1+n)}
function C4_lobe(k,cx,cy,sc,rot=0,faint=false){
 let pos='',neg='';for(let i=0;i<=180;i++){const th=i/180*2*Math.PI,v=C4_amp(k,th),r=Math.abs(v)*sc,x=cx+r*Math.cos(th+rot),y=cy-r*Math.sin(th+rot);(v>=0?(pos+=(pos?'L':'M')+fmt(x)+' '+fmt(y)):(neg+=(neg?'L':'M')+fmt(x)+' '+fmt(y)))}
 const o=faint?' opacity=".35"':'';return (pos?P(pos+'Z',C.blue,2,tint(C.blue,.75),o):'')+(neg?P(neg+'Z',C.coral,2,tint(C.coral,.75),o):'');
}
SCENE({id:'orbitals-hybrids',name:'Orbitals and hybrids',tag:'Shapes of electron waves',
 definition:'Quantum mechanics describes each electron in an atom by an orbital, a wave whose square gives where the electron is likely to be. An s orbital is spherical; a p orbital has two lobes of opposite sign. Linus Pauling (1931) proposed that atoms mix s and p orbitals into “hybrids” that point in the directions of their bonds.',
 example:'Mixing one s with three p orbitals gives four sp³ hybrids, each 25% s and 75% p, pointing 109.5° apart: the tetrahedron of methane.',
 desc:'A cross-section of one orbital’s angular shape: blue for the positive part of the wave, coral for the negative. Hybrids have one large lobe and one small one; a faint partner shows the angle between equivalent hybrids.',
 research:['Pauling, L. (1931). The nature of the chemical bond. Application of results obtained from the quantum mechanics and from a theory of paramagnetic susceptibility to the structure of molecules. Journal of the American Chemical Society 53, 1367–1400.','Heitler, W. & London, F. (1927). Wechselwirkung neutraler Atome und homöopolare Bindung nach der Quantenmechanik. Zeitschrift für Physik 44, 455–472.'],
 dur:12,hint:'Choose s, p or a hybrid. Compare the size of the two lobes and the angle between equivalent hybrids.',
 init:()=>({k:'sp3'}),
 watch(p){return {k:C4_ORB[Math.min(4,Math.floor(p*5))][0]}},
 ui:[{choose:C4_ORB,label:'Orbital',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s){
  const k=s.k,n=C4_hn[k];let out=heading(`${C4_ORB.find(q=>q[0]===k)[1]} orbital (cross-section)`,28);
  const cx=200,cy=200,sc=60;out+=L(cx-150,cy,cx+150,cy,C.grid,1.2)+L(cx,cy-140,cx,cy+140,C.grid,1.2);
  if(n){const alpha=Math.acos(-1/n);out+=C4_lobe(k,cx,cy,sc,alpha,true);out+=TF(cx+Math.cos(alpha/2)*40,cy-Math.sin(alpha/2)*40-6,Math.round(alpha*1800/Math.PI)/10+'°',13,C.muted)}
  out+=C4_lobe(k,cx,cy,sc)+Ci(cx,cy,4,C.ink);
  const px=400;out+=TBF(px,90,'Make-up',14,C.ink,'start');
  out+=TF(px,110,k==='s'?'pure s: same in every direction':k==='p'?'pure p: two lobes, a node between':`${Math.round(100/(1+n))}% s, ${Math.round(100*n/(1+n))}% p`,13,C.ink,'start');
  if(n){out+=TBF(px,142,'Angle between hybrids',14,C.ink,'start')+TF(px,162,`cos θ = −1/${n} → ${Math.round(Math.acos(-1/n)*1800/Math.PI)/10}°`,13,C.ink,'start');
   out+=TF(px,184,['','sp: linear, as in CO₂’s carbon','sp²: trigonal, as in ethene','sp³: tetrahedral, as in methane'][n],13,C.muted,'start')}
  out+=C4_wrap(px,226,'Blue and coral mark the wave’s sign, not charge. Hybrids are a model chosen to match known shapes.',27,13,C.muted);
  return {svg:out,phase:k==='s'?'An s orbital is spherical.':k==='p'?'A p orbital has two lobes of opposite sign with a node at the nucleus.':`An ${k} hybrid mixes s and p into one big lobe; equivalent ${k} hybrids point ${Math.round(Math.acos(-1/n)*1800/Math.PI)/10}° apart.`};
 }});

/* orbitals-hybrids-methane */
function C4_boxes(x,y,labels,fills,w=34){let out='';labels.forEach((l,i)=>{const bx=x+i*(w+4);out+=R(bx,y,w,30,'#fff',C.ink,3);const f=fills[i]||0;
  if(f>=1)out+=arrow(bx+(f===2?11:w/2),y+25,bx+(f===2?11:w/2),y+5,C.blue,2,6);if(f===2)out+=arrow(bx+w-11,y+5,bx+w-11,y+25,C.coral,2,6);if(f===3)out+=arrow(bx+w-11,y+5,bx+w-11,y+25,'#7d8f99',2,6)});
 labels.forEach((l,i)=>{if(l)out+=TF(x+i*(w+4)+w/2,y+46,l,13,C.muted)});return out}
SCENE({id:'orbitals-hybrids-methane',name:'The methane puzzle',tag:'A useful model, tested',
 definition:'Carbon’s ground state has two paired 2s electrons and two unpaired 2p electrons, which suggests two bonds at 90°. Methane has four identical bonds at 109.5°. The hybrid story explains this in steps: promote one 2s electron, mix the four orbitals, form four bonds. Photoelectron spectroscopy later showed methane’s bonding electrons sit at two different energies, as molecular orbital theory predicts, so hybrids are a description of shape, not literal orbitals.',
 example:'Methane’s photoelectron spectrum has bands near 14 and 23 electronvolts, not one band as four identical hybrid bonds would suggest.',
 desc:'Orbital boxes with electrons as arrows: carbon’s ground state, the promoted state, four sp³ hybrids, then four C–H bonds. A last view shows the two measured ionisation energies.',
 research:['Pauling, L. (1931). The nature of the chemical bond. Journal of the American Chemical Society 53, 1367–1400.','Turner, D. W., Baker, C., Baker, A. D. & Brundle, C. R. (1970). Molecular Photoelectron Spectroscopy. Wiley-Interscience.','Grushow, A. (2011). Is it time to retire the hybrid atomic orbital? Journal of Chemical Education 88, 860–862.'],
 dur:14,hint:'Step through the hybrid story, then press “What experiment shows” for the photoelectron result.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{b:'Back',act:'back'},{b:'Next step',act:'next'},{b:'What experiment shows',act:'pes'}],
 on:{next(s){s.k=Math.min(3,s.k+1);return 'keep'},back(s){s.k=Math.max(0,s.k-1);return 'keep'},pes(s){s.k=4;return 'keep'}},
 draw(s){
  const titles=['Carbon’s ground state','Promote one 2s electron','Mix into four sp³ hybrids','Form four C–H bonds','What photoelectron spectra show'];let out=heading(titles[s.k],28);
  if(s.k===0){out+=TF(60,245,'2s',13,C.muted,'start')+C4_boxes(100,215,[''],[2])+TF(200,175,'2p',13,C.muted,'start')+C4_boxes(240,145,['','',''],[1,1,0]);out+=C4_wrap(60,310,'Two unpaired electrons: this predicts only two bonds (CH₂), at 90°.',60,13,C.ink)}
  else if(s.k===1){out+=TF(60,245,'2s',13,C.muted,'start')+C4_boxes(100,215,[''],[1])+TF(200,175,'2p',13,C.muted,'start')+C4_boxes(240,145,['','',''],[1,1,1]);out+=C4_wrap(60,310,'Four unpaired electrons. Promotion costs energy, repaid by forming two extra bonds.',60,13,C.ink)}
  else if(s.k===2){out+=C4_boxes(150,180,['sp³','sp³','sp³','sp³'],[1,1,1,1],44);out+=C4_wrap(60,310,'Four equal hybrids pointing to the corners of a tetrahedron: 109.5° apart.',60,13,C.ink)}
  else if(s.k===3){out+=C4_boxes(150,180,['C–H','C–H','C–H','C–H'],[3,3,3,3],44);out+=C4_wrap(60,310,'Each hybrid pairs with a hydrogen 1s electron (grey): four identical bonds, as observed.',60,13,C.ink)}
  else{const x0=80,w=440,X0=e=>x0+(e-10)/16*w;out+=L(x0,230,x0+w,230,C.ink,1.5);[10,14,18,22,26].forEach(e=>{out+=L(X0(e),230,X0(e),236,C.ink,1.5)+TF(X0(e),252,e+' eV',13,C.muted)});
   out+=R(X0(13.6),110,X0(15.2)-X0(13.6),120,C.blue,'none',3)+TF(X0(14.4),100,'≈14 eV: 3 pairs',13,C.ink);
   out+=R(X0(22.5),190,X0(23.3)-X0(22.5),40,C.coral,'none',3)+TF(X0(22.9),180,'≈23 eV: 1 pair',13,C.ink);
   out+=C4_wrap(60,290,'Four identical hybrid bonds would give one band. Two bands match molecular orbital theory. Hybrids still predict the shape correctly: a model, not a photograph.',80,13,C.ink)}
  const ph=['Two unpaired electrons predict CH₂, not CH₄.','After promotion carbon has four unpaired electrons.','Mixing gives four equivalent sp³ hybrids at 109.5°.','Four identical C–H bonds: the hybrid model explains methane’s shape.','Methane’s spectrum shows two energy levels: molecular orbital theory describes the electrons; hybrids describe the shape.'][s.k];
  return {svg:out,phase:ph};
 }});

/* orbitals-hybrids-mo */
const C4_MOS={
 H2p:{n:'H₂⁺',e:1,set:'light'},H2:{n:'H₂',e:2,set:'light'},He2p:{n:'He₂⁺',e:3,set:'light'},He2:{n:'He₂',e:4,set:'light'},
 N2:{n:'N₂',e:10,set:'N'},O2:{n:'O₂',e:12,set:'O'}};
function C4_moLevels(set){
 if(set==='light')return [{n:'σ1s',y:250,g:1,b:true},{n:'σ*1s',y:130,g:1,b:false}];
 const s=[{n:'σ2s',y:318,g:1,b:true},{n:'σ*2s',y:278,g:1,b:false}];
 return set==='N'?s.concat([{n:'π2p',y:200,g:2,b:true},{n:'σ2p',y:170,g:1,b:true},{n:'π*2p',y:110,g:2,b:false},{n:'σ*2p',y:65,g:1,b:false}]):s.concat([{n:'σ2p',y:212,g:1,b:true},{n:'π2p',y:182,g:2,b:true},{n:'π*2p',y:110,g:2,b:false},{n:'σ*2p',y:65,g:1,b:false}]);
}
function C4_fill(levels,e){let left=e;return levels.map(lv=>{const occ=range(lv.g).map(()=>0);const take=Math.min(left,2*lv.g);for(let i=0;i<take;i++){occ[i<lv.g?i:i-lv.g]++}left-=take;return {...lv,occ}})}
SCENE({id:'orbitals-hybrids-mo',name:'Molecular orbitals',tag:'Why oxygen is magnetic',
 definition:'Molecular orbital (MO) theory spreads electrons over the whole molecule. Atomic orbitals combine into bonding orbitals (lower energy) and antibonding orbitals (higher energy, marked *). Bond order is half the difference between bonding and antibonding electrons. Electrons fill the lowest levels first, and spread singly across levels of equal energy before pairing.',
 example:'O₂ has two electrons in two equal-energy π* orbitals, one in each, unpaired. That is why liquid oxygen is drawn into a magnet, which Lewis structures cannot explain.',
 desc:'An energy-level diagram of molecular orbitals with electrons drawn as arrows, the bond order, and the number of unpaired electrons for six species.',
 research:['Mulliken, R. S. (1932). Electronic structures of polyatomic molecules and valence. Physical Review 40, 55–62.','Lennard-Jones, J. E. (1929). The electronic structure of some diatomic molecules. Transactions of the Faraday Society 25, 668–686.','Pauling, L. (1960). The Nature of the Chemical Bond, 3rd edn. Cornell University Press (bond orders and magnetism of O₂).'],
 dur:14,hint:'Pick a molecule and count electrons into the levels. Compare the bond order with what you know, and look at O₂’s two unpaired electrons.',
 init:()=>({m:'O2'}),
 watch(p){const L=['H2p','H2','He2p','He2','N2','O2'];return {m:L[Math.min(5,Math.floor(p*6))]}},
 ui:[{choose:Object.keys(C4_MOS).map(k=>[k,C4_MOS[k].n]),label:'Molecule',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v;return 'keep'}},
 draw(s){
  const mo=C4_MOS[s.m],lv=C4_fill(C4_moLevels(mo.set),mo.e);let out=heading(`${mo.n}: ${mo.e} ${mo.set==='light'?'':'outer '}electron${mo.e>1?'s':''}`,28);
  let bE=0,aE=0,unp=0;lv.forEach(q=>{const tot=sum(q.occ);q.b?bE+=tot:aE+=tot;unp+=q.occ.filter(o=>o===1).length;
   const xs=q.g===1?[200]:[165,235];xs.forEach((x,i)=>{out+=L(x-26,q.y,x+26,q.y,q.b?C.blue:C.coral,3);const o=q.occ[i];if(o>=1)out+=arrow(x-7,q.y+12,x-7,q.y-14,C.ink,2,6);if(o===2)out+=arrow(x+7,q.y-14,x+7,q.y+12,C.ink,2,6)});
   out+=TF(275,q.y+5,q.n,13,q.b?C.blue:C.coral,'start')});
  const bo=(bE-aE)/2;const px=390;
  out+=TBF(px,90,'Bond order',14,C.ink,'start')+TF(px,110,`(${bE} − ${aE}) ÷ 2 = ${bo%1?bo.toFixed(1):bo}`,13,C.ink,'start');
  out+=TBF(px,142,'Unpaired electrons',14,C.ink,'start')+TF(px,162,`${unp}: ${unp?'attracted by a magnet (paramagnetic)':'not attracted (diamagnetic)'}`,13,C.ink,'start');
  const note={H2p:'Half a bond: H₂⁺ exists, weaker than H₂.',H2:'One bond: 436 kJ/mol to break it.',He2p:'Half a bond: He₂⁺ is seen in gas discharges.',He2:'Bond order 0: helium stays as single atoms (apart from an extremely weak van der Waals pair).',N2:'A triple bond, as in the Lewis structure.',O2:'A double bond, as Lewis says, but with two unpaired electrons: oxygen is magnetic.'}[s.m];
  out+=C4_wrap(px,196,note,27,13,C.muted);
  out+=TF(80,350,'blue: bonding · coral: antibonding (*)',13,C.muted,'start');
  return {svg:out,phase:`${mo.n}: bond order ${bo}, ${unp} unpaired electron${unp===1?'':'s'}. ${note}`};
 }});

/* ======================================================= hydrogen-bonds */
const C4_BP={14:[['CH₄',-161.5],['SiH₄',-111.9],['GeH₄',-88.5],['SnH₄',-52]],15:[['NH₃',-33.3],['PH₃',-87.7],['AsH₃',-62.5],['SbH₃',-17]],16:[['H₂O',100],['H₂S',-60.3],['H₂Se',-41.3],['H₂Te',-2.2]],17:[['HF',19.5],['HCl',-85.1],['HBr',-66.8],['HI',-35.4]]};
const C4_GC={14:'#7d8f99',15:C.purple,16:C.blue,17:C.green};
SCENE({id:'hydrogen-bonds',name:'Hydrogen bonds',tag:'Water’s anomalous boiling point',
 definition:'A hydrogen bond is an attraction between a hydrogen atom bonded to a very electronegative atom (nitrogen, oxygen or fluorine) and a lone pair on another such atom. It is about a tenth as strong as a covalent bond but far stronger than ordinary attractions between molecules.',
 example:'Following the trend of H₂S, H₂Se and H₂Te, water “should” boil near −90 °C. It boils at 100 °C because its molecules are held together by hydrogen bonds.',
 desc:'Boiling points of the hydrides of groups 14 to 17 plotted against their row in the periodic table. The first member of groups 15, 16 and 17 breaks the trend; a dashed line extrapolates where water would be without hydrogen bonds.',
 research:['Latimer, W. M. & Rodebush, W. H. (1920). Polarity and ionization from the standpoint of the Lewis theory of valence. Journal of the American Chemical Society 42, 1419–1433.','Arunan, E. et al. (2011). Definition of the hydrogen bond (IUPAC Recommendations 2011). Pure and Applied Chemistry 83, 1637–1641.','Boiling points: CRC Handbook of Chemistry and Physics (rounded).'],
 dur:12,hint:'Show one group at a time, or all four. Press “Extrapolate water” to see where the trend says water should boil.',
 init:()=>({g:'all',ex:false}),
 watch(p){return p<.6?{g:['14','15','16','17'][Math.min(3,Math.floor(p/.6*4))],ex:false}:{g:'all',ex:p>.8}},
 ui:[{choose:[['all','All'],['14','Group 14'],['15','Group 15'],['16','Group 16'],['17','Group 17']],label:'Show',get:s=>s.g,act:'g'},{b:'Extrapolate water',act:'ex'}],
 on:{g(s,v){s.g=v;return 'keep'},ex(s){s.ex=!s.ex;return 'keep'}},
 draw(s){
  let out=heading('Boiling points of simple hydrides (°C)',26);const x0=90,w=380,y0=v=>320-(v+180)/300*270,xp=i=>x0+i*w/3;
  [-150,-100,-50,0,50,100].forEach(v=>{out+=L(x0-6,y0(v),x0+w,y0(v),C.grid,1)+TF(x0-10,y0(v)+4,String(v),13,C.muted,'end')});
  ['2','3','4','5'].forEach((r,i)=>{out+=TF(xp(i),340,'row '+r,13,C.muted)});
  Object.keys(C4_BP).forEach(g=>{if(s.g!=='all'&&s.g!==g)return;const d=C4_BP[g],col=C4_GC[g];let path='';d.forEach((q,i)=>{path+=(i?'L':'M')+fmt(xp(i))+' '+fmt(y0(q[1]))});out+=P(path,col,2.5);
   d.forEach((q,i)=>{out+=Ci(xp(i),y0(q[1]),6,col,'#fff');const lab=TF(xp(i)+9,y0(q[1])+(g==='17'?14:-8),q[0],13,col,'start');if(s.g!=='all'||i===0)out+=lab})});
  if(s.ex&&(s.g==='all'||s.g==='16')){const ys=C4_BP[16].slice(1).map(q=>q[1]),xs=[1,2,3],mx=2,my=sum(ys)/3,b=sum(xs.map((x,i)=>(x-mx)*(ys[i]-my)))/2,pred=my-b*mx;
   out+=P(`M${fmt(xp(0))} ${fmt(y0(pred))}L${fmt(xp(3))} ${fmt(y0(my+b))}`,C.blue,1.8,'none','stroke-dasharray="5 5"')+Ci(xp(0),y0(pred),6,'#fff',C.blue)+TF(xp(0)+10,y0(pred)+18,`trend: about ${Math.round(pred/10)*10} °C`,13,C.blue,'start')}
  out+=C4_wrap(485,90,'Groups 15–17 start with N, O or F, which form hydrogen bonds. Group 14 (carbon) does not, and rises smoothly.',16,13,C.muted);
  return {svg:out,phase:s.ex?'Extending the trend of H₂S, H₂Se and H₂Te puts water’s boiling point near −90 °C; hydrogen bonds lift it to 100 °C.':'NH₃, H₂O and HF boil far higher than their heavier relatives because of hydrogen bonding; methane follows the trend.'};
 }});

/* hydrogen-bonds-ice */
const C4_RHO=[[-10,.99815],[-5,.99930],[0,.99984],[2,.99994],[4,.99997],[6,.99994],[8,.99985],[10,.99970],[15,.99910],[20,.99821],[25,.99705],[30,.99565]];
function C4_rho(t){for(let i=1;i<C4_RHO.length;i++){if(t<=C4_RHO[i][0]){const [a,ra]=C4_RHO[i-1],[b,rb]=C4_RHO[i];return lerp(ra,rb,(t-a)/(b-a))}}return C4_RHO[C4_RHO.length-1][1]}
SCENE({id:'hydrogen-bonds-ice',name:'Why ice floats',tag:'Densest at 4 °C',
 definition:'Liquid water is densest at about 4 °C. On freezing, hydrogen bonds lock each molecule to four neighbours in an open hexagonal lattice, so ice is about 9% less dense than water and floats. Most substances are denser as solids.',
 example:'A lake cools from the top, but water below 4 °C stays at the surface and freezes there. The ice insulates the water beneath, which stays near 4 °C through winter.',
 desc:'The density of water from −10 °C (supercooled) to 30 °C, with its peak near 4 °C, and a beaker showing how deep an ice cube floats.',
 research:['Kell, G. S. (1975). Density, thermal expansivity, and compressibility of liquid water from 0° to 150 °C. Journal of Chemical and Engineering Data 20, 97–105.','Bernal, J. D. & Fowler, R. H. (1933). A theory of water and ionic solution, with particular reference to hydrogen and hydroxyl ions. Journal of Chemical Physics 1, 515–548.'],
 dur:12,hint:'Move the temperature and watch the density peak near 4 °C. The ice cube floats with about 92% of it under water.',
 init:()=>({t:4}),
 watch(p){return {t:Math.round(-10+p*40)}},
 ui:[{range:'t',label:'Temperature (°C)',min:-10,max:30,get:s=>s.t,act:'t'}],
 on:{t(s,v){s.t=v;return 'keep'}},
 draw(s){
  let out=heading('Density of water near its freezing point',26);const x0=80,w=300,X0=t=>x0+(t+10)/40*w,Y0=r=>300-(r-.9955)/.0047*220;
  [.996,.997,.998,.999,1].forEach(r=>{out+=L(x0,Y0(r),x0+w,Y0(r),C.grid,1)+TF(x0-6,Y0(r)+4,r.toFixed(3),13,C.muted,'end')});
  [-10,0,10,20,30].forEach(t=>{out+=TF(X0(t),322,t+'°',13,C.muted)});
  let path='';for(let t=-10;t<=30;t+=.5)path+=(t===-10?'M':'L')+fmt(X0(t))+' '+fmt(Y0(C4_rho(t)));out+=P(path,C.blue,2.5);
  out+=L(X0(0),70,X0(0),300,C.muted,1.2,'stroke-dasharray="4 4"')+TF(X0(-5),80,'supercooled',13,C.muted);
  out+=L(X0(4),Y0(.99997)-6,X0(4),Y0(.99997)-30,C.coral,1.5)+TF(X0(4)+4,Y0(.99997)-34,'peak ≈ 4 °C',13,C.coral,'start');
  const r=C4_rho(s.t);out+=Ci(X0(s.t),Y0(r),7,C.coral,'#fff')+TBF(300,352,`${s.t} °C: ${r.toFixed(5)} g/cm³ · ice: 0.917 g/cm³`,14,C.ink);
  // beaker with floating ice
  const bx=440,by=110,bw=120,bh=170,wl=by+40;out+=R(bx,wl,bw,by+bh-wl,C.pale,'none',0)+P(`M${bx} ${by}V${by+bh}H${bx+bw}V${by}`,C.ink,2);
  const cube=50,sub=cube*.917/r;out+=R(bx+35,wl-(cube-sub),cube,cube,'#ffffff',C.blue,3)+L(bx,wl,bx+bw,wl,C.blue,1.5);
  out+=TF(bx+bw/2,by+bh+22,`${Math.round(.917/r*100)}% under water`,13,C.ink);
  return {svg:out,phase:`At ${s.t} °C water’s density is ${r.toFixed(5)} g/cm³${Math.abs(s.t-4)<=1?', close to its maximum':''}. Ice, at 0.917, floats.`};
 }});

/* hydrogen-bonds-dna */
const C4_tm=gc=>69.3+.41*gc;
SCENE({id:'hydrogen-bonds-dna',name:'Hydrogen bonds in DNA',tag:'Two bonds or three',
 definition:'The two strands of DNA are held together by hydrogen bonds between bases: adenine pairs with thymine through two hydrogen bonds, guanine with cytosine through three. DNA richer in G–C pairs needs more heat to separate its strands, though stacking between neighbouring base pairs contributes much of that stability too.',
 example:'Marmur and Doty (1962) found that DNA’s melting temperature rises in a straight line with its G–C content: about 69 °C for pure A–T and 110 °C for pure G–C, in their salt solution.',
 desc:'A ten-pair stretch of DNA with dashed hydrogen bonds between partners. Press a pair to switch it between A–T and G–C; the G–C percentage and predicted melting temperature update.',
 research:['Watson, J. D. & Crick, F. H. C. (1953). Molecular structure of nucleic acids. Nature 171, 737–738.','Marmur, J. & Doty, P. (1962). Determination of the base composition of deoxyribonucleic acid from its thermal denaturation temperature. Journal of Molecular Biology 5, 109–118.','Yakovchuk, P., Protozanova, E. & Frank-Kamenetskii, M. D. (2006). Base-stacking and base-pairing contributions into thermal stability of the DNA double helix. Nucleic Acids Research 34, 564–574.'],
 dur:12,hint:'Press base pairs to switch them, or use a preset. Count the dashed hydrogen bonds and watch the melting temperature.',
 init:()=>({gc:[0,1,0,0,1,0,1,0,0,1].map(Boolean)}),
 watch(p){const n=Math.round(p*10);return {gc:range(10).map(i=>i<n)}},
 ui:[{b:'All A–T',act:'all',arg:'0'},{b:'Half and half',act:'all',arg:'h'},{b:'All G–C',act:'all',arg:'1'}],
 on:{pair(s,a){const i=Number(a);s.gc[i]=!s.gc[i];return 'keep'},all(s,a){s.gc=range(10).map(i=>a==='1'?true:a==='0'?false:i%2===1);return 'keep'}},
 draw(s,f,X){
  const n=s.gc.filter(Boolean).length,gc=n*10,tm=C4_tm(gc);let out=heading(`G–C content ${gc}%: predicted melting ${tm.toFixed(0)} °C`,28);
  const col={A:'#d9822b',T:'#c45238',G:'#2c776c',C:'#1772b7'};
  out+=L(40,110,400,110,C.ink,4)+L(40,250,400,250,C.ink,4)+TF(30,114,'5′',13,C.muted,'end')+TF(30,254,'3′',13,C.muted,'end');
  s.gc.forEach((g,i)=>{const x=58+i*36,top=g?(i%2?'C':'G'):(i%2?'T':'A'),bot={A:'T',T:'A',G:'C',C:'G'}[top],hb=g?3:2;
   let inner=R(x-14,112,28,52,tint(col[top],.75),col[top],5)+TBF(x,144,top,15,C.ink)+R(x-14,196,28,52,tint(col[bot],.75),col[bot],5)+TBF(x,228,bot,15,C.ink);
   for(let k=0;k<hb;k++){const xx=x+(hb===2?(k?5:-5):(k-1)*7);inner+=L(xx,166,xx,194,C.muted,1.8,'stroke-dasharray="3 3"')}
   out+=hit(X,'pair',i,`Pair ${i+1}: ${top}–${bot}. Press to switch.`,inner)});
  const tx=470,ty0=90,th=200,Y=t=>ty0+th-(t-60)/60*th;out+=R(tx-10,ty0,20,th,'#fff',C.ink,10)+R(tx-6,Y(tm),12,ty0+th-Y(tm),C.coral,'none',6);
  [60,80,100,120].forEach(t=>{out+=L(tx+12,Y(t),tx+20,Y(t),C.ink,1.5)+TF(tx+24,Y(t)+4,t+'°',13,C.muted,'start')});
  out+=TF(tx,ty0+th+24,'Tm = 69.3 + 0.41 × %GC',13,C.ink);
  out+=C4_wrap(40,300,`${n} G–C pairs (3 hydrogen bonds each), ${10-n} A–T pairs (2 each): ${3*n+2*(10-n)} hydrogen bonds in all.`,62,13,C.ink);
  return {svg:out,phase:`${gc}% G–C: predicted melting temperature ${tm.toFixed(1)} °C. Hydrogen bonds pair the bases; stacking between neighbours adds much of the stability.`};
 }});

/* ======================================================= electronegativity */
const C4_EN={H:2.20,Li:.98,Be:1.57,B:2.04,C:2.55,N:3.04,O:3.44,F:3.98,Na:.93,Mg:1.31,Al:1.61,Si:1.90,P:2.19,S:2.58,Cl:3.16,K:.82,Ca:1.00,Ga:1.81,Ge:2.01,As:2.18,Se:2.55,Br:2.96};
const C4_GRID=[['H'],['Li','Be','B','C','N','O','F'],['Na','Mg','Al','Si','P','S','Cl'],['K','Ca','Ga','Ge','As','Se','Br']];
function C4_heat(v){const t=clamp((v-.8)/3.2,0,1);return tint(C.blue,1-t*.85)}
SCENE({id:'electronegativity',name:'Electronegativity',tag:'Who pulls the shared pair',
 definition:'Electronegativity measures how strongly an atom in a molecule attracts shared electrons. On Pauling’s scale it rises across each row of the periodic table and falls down each group: fluorine (3.98) is the highest, the alkali metals the lowest. The difference between two atoms predicts how polar their bond is.',
 example:'Carbon (2.55) and hydrogen (2.20) differ by only 0.35, so C–H bonds are nearly non-polar; oxygen and hydrogen differ by 1.24, so O–H bonds are strongly polar.',
 desc:'Main-group elements of the first four rows shaded by Pauling electronegativity. Pick two to see the difference, the bond’s polarity and which atom takes the partial negative charge.',
 research:['Pauling, L. (1932). The nature of the chemical bond. IV. The energy of single bonds and the relative electronegativity of atoms. Journal of the American Chemical Society 54, 3570–3582.','Allred, A. L. (1961). Electronegativity values from thermochemical data. Journal of Inorganic and Nuclear Chemistry 17, 215–221 (the revised values used today).'],
 dur:12,hint:'Press two elements. Darker cells pull harder; compare pairs across a row and down a group.',
 init:()=>({a:'H',b:'Cl',t:0}),
 watch(p){const L=[['C','H'],['O','H'],['H','Cl'],['Na','Cl'],['C','F']],q=L[Math.min(4,Math.floor(p*5))];return {a:q[0],b:q[1],t:0}},
 ui:[{b:'Swap',act:'swap'}],
 on:{el(s,v){if(s.t===0){s.a=v;s.t=1}else{s.b=v;s.t=0}return 'keep'},swap(s){[s.a,s.b]=[s.b,s.a];return 'keep'}},
 draw(s,f,X){
  let out=heading('Pauling electronegativity',26);const cw=50,ch=46,x0=24,y0=50;
  C4_GRID.forEach((row,r)=>row.forEach((el,c)=>{const cc=r===0?0:c,x=x0+cc*(cw+3),y=y0+r*(ch+4),sel=el===s.a||el===s.b,v=C4_EN[el];
   const inner=R(x,y,cw,ch,C4_heat(v),sel?C.coral:'#fff',5,sel?'stroke-width="3"':'')+TBF(x+cw/2,y+20,el,15,v>2.6?'#fff':C.ink)+TF(x+cw/2,y+38,v.toFixed(2),13,v>2.6?'#fff':C.ink);
   out+=hit(X,'el',el,`${el}, electronegativity ${v}`,inner)}));
  const a=s.a,b=s.b,d=Math.abs(C4_EN[a]-C4_EN[b]),neg=C4_EN[a]>C4_EN[b]?a:b,pos=neg===a?b:a,cls=d<.4?'nearly non-polar':d<1.7?'polar covalent':'mostly ionic';
  const px=410;out+=TBF(px,72,`${a}–${b}`,16,C.ink,'start');
  out+=TF(px,96,`${C4_EN[a].toFixed(2)} and ${C4_EN[b].toFixed(2)}`,13,C.ink,'start')+TF(px,116,`difference ${d.toFixed(2)}`,13,C.ink,'start');
  out+=TF(px,140,cls,13,d<.4?C.green:d<1.7?C.blue:C.purple,'start');
  if(d>=.05)out+=C4_wrap(px,164,`${neg} takes the larger share: ${neg} is δ−, ${pos} is δ+.`,26,13,C.muted);
  out+=C4_wrap(24,272,'Rises across a row, falls down a group. Noble gases are left out: on this scale they rarely form bonds.',60,13,C.muted);
  return {svg:out,phase:`${a}–${b}: difference ${d.toFixed(2)}, ${cls}.`};
 }});

/* electronegativity-pauling: from bond energies */
const C4_D={H2:436,F2:158,Cl2:242,Br2:193,I2:151};
const C4_PB=[['HF','H','F',565],['HCl','H','Cl',431],['HBr','H','Br',366],['HI','H','I',298],['ClF','Cl','F',253]];
SCENE({id:'electronegativity-pauling',name:'Pauling’s bond-energy scale',tag:'Electronegativity from heats of reaction',
 definition:'Pauling noticed that a bond between two different atoms, A–B, is usually stronger than the average of A–A and B–B. He traced the “extra” energy to the attraction between partial charges, and defined the electronegativity difference from it: Δχ = 0.102 × √(extra energy in kJ/mol).',
 example:'H–Cl takes 431 kJ/mol to break; the average of H–H (436) and Cl–Cl (242) is 339. The extra 92 kJ/mol gives Δχ = 0.102 × √92 ≈ 0.98, close to the tabulated 0.96.',
 desc:'Bars for the bond energies of A–A, B–B, their average and A–B. The gap between the last two is Pauling’s extra energy, converted into a predicted electronegativity difference and set beside today’s table value.',
 research:['Pauling, L. (1932). The nature of the chemical bond. IV. The energy of single bonds and the relative electronegativity of atoms. Journal of the American Chemical Society 54, 3570–3582.','Bond energies: CRC Handbook of Chemistry and Physics (rounded, kJ/mol).'],
 dur:12,hint:'Choose a bond. The extra stability of the mixed bond predicts the electronegativity difference; see where it works and where it does not.',
 init:()=>({k:'HCl'}),
 watch(p){return {k:C4_PB[Math.min(4,Math.floor(p*5))][0]}},
 ui:[{choose:C4_PB.map(q=>[q[0],q[1]+'–'+q[2]]),label:'Bond',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s){
  const [k,a,b,dab]=C4_PB.find(q=>q[0]===s.k),daa=C4_D[a+'2'],dbb=C4_D[b+'2'],mean=(daa+dbb)/2,ex=dab-mean,pred=.102*Math.sqrt(Math.max(0,ex));
  let out=heading(`${a}–${b}: ${ex.toFixed(1)} kJ/mol of extra bond energy`,28);
  const base=300,sc=.4,items=[[`${a}–${a}`,daa,C.line],[`${b}–${b}`,dbb,C.line],['average',mean,C.muted],[`${a}–${b}`,dab,C.blue]];
  items.forEach(([l,v,col],i)=>{const x=70+i*80;out+=R(x,base-v*sc,56,v*sc,col,'none',4)+TF(x+28,base+18,l,13,C.ink)+TF(x+28,base-v*sc-6,String(Math.round(v)),13,C.ink)});
  out+=L(70+2*80+56,base-mean*sc,70+3*80+56,base-mean*sc,C.coral,1.5,'stroke-dasharray="4 4"');
  if(ex>0)out+=arrow(70+3*80+66,base-mean*sc,70+3*80+66,base-dab*sc,C.coral,2,7);
  const tabV=Math.abs(C4_EN[a]-(b==='I'?2.66:C4_EN[b]));
  const px=410;out+=TBF(px,90,'Predicted Δχ',14,C.ink,'start')+TF(px,110,`0.102 × √${ex.toFixed(1)} = ${pred.toFixed(2)}`,13,C.ink,'start');
  out+=TBF(px,142,'Table value',14,C.ink,'start')+TF(px,162,tabV.toFixed(2),13,C.ink,'start');
  out+=C4_wrap(px,194,Math.abs(pred-tabV)<.15?'Close agreement.':'A poor match: for H–I the extra energy is tiny and other effects dominate. Pauling’s scale was refitted with many bonds.',26,13,Math.abs(pred-tabV)<.15?C.green:C.coral);
  return {svg:out,phase:`${a}–${b}: extra ${ex.toFixed(1)} kJ/mol gives Δχ ≈ ${pred.toFixed(2)}, against ${tabV.toFixed(2)} in the table.`};
 }});

/* electronegativity-scales: Pauling against Mulliken */
const C4_MU=[['H',13.598,.754,2.20],['Li',5.392,.618,.98],['Na',5.139,.548,.93],['B',8.298,.280,2.04],['C',11.260,1.262,2.55],['N',14.534,-.07,3.04],['O',13.618,1.461,3.44],['F',17.423,3.401,3.98],['S',10.360,2.077,2.58],['Cl',12.968,3.613,3.16],['Br',11.814,3.364,2.96]];
function C4_fit(pts){const n=pts.length,mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n,sxy=sum(pts.map(p=>(p[0]-mx)*(p[1]-my))),sxx=sum(pts.map(p=>(p[0]-mx)**2)),syy=sum(pts.map(p=>(p[1]-my)**2)),b=sxy/sxx;return {b,a:my-b*mx,r:sxy/Math.sqrt(sxx*syy)}}
SCENE({id:'electronegativity-scales',name:'Two scales, one idea',tag:'Pauling and Mulliken compared',
 definition:'Robert Mulliken (1934) proposed an electronegativity built from two measurable atomic properties: the energy to remove an electron (ionisation energy) and the energy released on gaining one (electron affinity). Their average, in electronvolts, tracks Pauling’s bond-energy scale closely for most elements, which suggests both capture the same underlying idea.',
 example:'Fluorine has the highest values on both scales; sodium and lithium the lowest. Hydrogen is the clearest outlier: its Mulliken value is high because removing its only electron is unusually costly.',
 desc:'A scatter of Mulliken values (from free-atom ionisation energies and electron affinities) against Pauling values for eleven elements, with a fitted line and its correlation. Hydrogen can be left in or out.',
 research:['Mulliken, R. S. (1934). A new electroaffinity scale; together with data on valence states and on valence ionization potentials and electron affinities. Journal of Chemical Physics 2, 782–793.','Allen, L. C. (1989). Electronegativity is the average one-electron energy of the valence-shell electrons in ground-state free atoms. Journal of the American Chemical Society 111, 9003–9014.','Ionisation energies and electron affinities: NIST and CRC Handbook (rounded, eV).'],
 dur:12,hint:'Press a point to read its values. Toggle hydrogen to see how much one outlier changes the correlation.',
 init:()=>({h:true,sel:'F'}),
 watch(p){return {h:p<.6,sel:['F','H','N','Na'][Math.min(3,Math.floor(p*4))]}},
 ui:[{b:'Hydrogen in/out',act:'h'}],
 on:{h(s){s.h=!s.h;return 'keep'},pt(s,v){s.sel=v;return 'keep'}},
 draw(s,f,X){
  const pts=C4_MU.filter(q=>s.h||q[0]!=='H').map(q=>[(q[1]+q[2])/2,q[3],q[0]]),fit=C4_fit(pts);let out=heading('Mulliken (eV) against Pauling',26);
  const x0=80,y0=310,w=330,h=250,X0=v=>x0+(v-2)/10*w,Y0=v=>y0-(v-.5)/3.8*h;
  [2,4,6,8,10,12].forEach(v=>{out+=L(X0(v),y0,X0(v),y0+5,C.ink,1.2)+TF(X0(v),y0+20,String(v),13,C.muted)});
  [1,2,3,4].forEach(v=>{out+=L(x0-5,Y0(v),x0,Y0(v),C.ink,1.2)+TF(x0-9,Y0(v)+4,String(v),13,C.muted,'end')});
  out+=L(x0,y0,x0+w,y0,C.ink,1.5)+L(x0,y0,x0,y0-h,C.ink,1.5)+TF(x0+w/2,y0+40,'Mulliken: (ionisation energy + electron affinity) ÷ 2',13,C.muted);
  out+=L(X0(2.5),Y0(fit.a+fit.b*2.5),X0(11),Y0(fit.a+fit.b*11),C.blue,1.6,'stroke-dasharray="5 4"');
  C4_MU.forEach(q=>{const on=s.h||q[0]!=='H',xm=(q[1]+q[2])/2,x=X0(xm),y=Y0(q[3]),sel=q[0]===s.sel;
   out+=hit(X,'pt',q[0],`${q[0]}: Mulliken ${xm.toFixed(2)} eV, Pauling ${q[3]}`,Ci(x,y,sel?8:6,on?(q[0]==='H'?C.coral:C.blue):'#fff',on?'#fff':C.line)+TF(x+9,y-7,q[0],13,on?C.ink:C.muted,'start'))});
  const q=C4_MU.find(r=>r[0]===s.sel);const px=430;
  out+=TBF(px,80,'Fit',14,C.ink,'start')+TF(px,100,`r = ${fit.r.toFixed(3)}`,13,C.ink,'start')+TF(px,118,`${pts.length} elements`,13,C.muted,'start');
  out+=TBF(px,150,q[0],14,C.ink,'start')+TF(px,170,`IE ${q[1]} eV`,13,C.ink,'start')+TF(px,188,`EA ${q[2]} eV`,13,C.ink,'start')+TF(px,206,`Mulliken ${((q[1]+q[2])/2).toFixed(2)}`,13,C.ink,'start')+TF(px,224,`Pauling ${q[3]}`,13,C.ink,'start');
  out+=C4_wrap(px,256,'Free-atom values are used here; Mulliken’s own valence-state values agree better.',22,13,C.muted);
  return {svg:out,phase:`With ${pts.length} elements the two scales correlate at r = ${fit.r.toFixed(2)}${s.h?'; hydrogen is the main outlier':' without hydrogen'}.`};
 }});
