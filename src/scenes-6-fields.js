/* ===================== Physics era 6 · Electricity and magnetism (1780s–1880s) ===================== */
// Shared helpers for this era. Everything is a pure function of state and lesson time.
const P6_K=8.9875e9,P6_MU0=4*Math.PI*1e-7,P6_EPS0=8.8541878128e-12,P6_C=299792458;
const P6_SUPD='⁰¹²³⁴⁵⁶⁷⁸⁹';
function P6_sup(n){return String(n).replace(/-/g,'⁻').replace(/\d/g,d=>P6_SUPD[d])}
function P6_sci(v,dp=2){if(!isFinite(v))return '∞';if(v===0)return '0';const e=Math.floor(Math.log10(Math.abs(v)));if(e>=-2&&e<=3)return String(+v.toPrecision(3));return (v/Math.pow(10,e)).toFixed(dp)+' × 10'+P6_sup(e)}
function P6_hex(c){c=c.replace('#','');return [0,2,4].map(i=>parseInt(c.slice(i,i+2),16))}
function P6_mix(a,b,t){const A=P6_hex(a),B=P6_hex(b);t=clamp(t,0,1);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function P6_noise(seed){return rng(seed*7919+13)()*2-1}
// Plot frame: returns {svg, X, Y} mapping data to pixels.
function P6_axes(x,y,w,h,o){
 const X=v=>x+(v-o.x0)/(o.x1-o.x0)*w,Y=v=>y+h-(v-o.y0)/(o.y1-o.y0)*h;let s=R(x,y,w,h,'#fff',C.grid,4);
 (o.yt||[]).forEach(v=>{s+=L(x,Y(v),x+w,Y(v),'#edf2f5',1)+TF(x-6,Y(v)+4,o.fy?o.fy(v):v,13,C.muted,'end')});
 (o.xt||[]).forEach(v=>{s+=L(X(v),y+h,X(v),y+h+4,C.muted,1)+TF(X(v),y+h+17,o.fx?o.fx(v):v,13,C.muted)});
 if(o.xl)s+=TF(x+w/2,y+h+33,o.xl,13,C.muted);if(o.yl)s+=TF(x,y-7,o.yl,13,C.muted,'start');
 return {svg:s,X,Y};
}
const P6_path=pts=>'M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L');
// Point charges (or magnetic poles) in pixel coordinates: field and field lines.
function P6_E(ch,x,y){let ex=0,ey=0;for(const c of ch){const dx=x-c.x,dy=y-c.y,r2=dx*dx+dy*dy+1e-9,r=Math.sqrt(r2),f=c.q/(r2*r);ex+=f*dx;ey+=f*dy}return [ex,ey]}
function P6_lines(ch,o={}){
 const per=o.per||6,step=o.step||4,max=o.max||320,rad=o.rad||13,box=o.box||[-20,40,620,400];
 const pos=ch.filter(c=>c.q>0),src=pos.length?pos:ch.filter(c=>c.q<0),sg=pos.length?1:-1,paths=[];
 for(const c of src){const n=Math.max(4,Math.round(per*Math.abs(c.q)));
  for(let k=0;k<n;k++){const a=2*Math.PI*(k+.5)/n+(o.turn||0);let x=c.x+rad*Math.cos(a),y=c.y+rad*Math.sin(a);const pts=[[x,y]];
   for(let i=0;i<max;i++){let [ex,ey]=P6_E(ch,x,y),m=Math.hypot(ex,ey);if(!m)break;
    const hx=x+sg*step*.5*ex/m,hy=y+sg*step*.5*ey/m;[ex,ey]=P6_E(ch,hx,hy);m=Math.hypot(ex,ey);if(!m)break;
    x+=sg*step*ex/m;y+=sg*step*ey/m;pts.push([x,y]);
    if(x<box[0]||x>box[2]||y<box[1]||y>box[3])break;
    if(ch.some(d=>d!==c&&Math.hypot(x-d.x,y-d.y)<rad*.8))break}
   paths.push(pts)}}
 return {paths,sign:sg};
}
function P6_drawLines(Ls,col,w=1.6){let s='';for(const pts of Ls.paths){if(pts.length<4)continue;s+=P(P6_path(pts),col,w);
  const i=Math.floor(pts.length*.45),a=pts[i],b=pts[i+1];const dx=(b[0]-a[0])*Ls.sign,dy=(b[1]-a[1])*Ls.sign,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;
  s+=`<polygon points="${fmt(a[0]+ux*6)},${fmt(a[1]+uy*6)} ${fmt(a[0]-ux*4-uy*4)},${fmt(a[1]-uy*4+ux*4)} ${fmt(a[0]-ux*4+uy*4)},${fmt(a[1]-uy*4-ux*4)}" fill="${col}"/>`}return s}
function P6_charge(x,y,q,label,r=15){const pos=q>0,col=q===0?C.line:pos?C.coral:C.blue;return Ci(x,y,r,col,'#fff')+TBF(x,y+6,q===0?'0':pos?'+':'−',17,'#fff')+(label?R(x-28,y+r+4,56,18,'#ffffffd9','none',5)+TF(x,y+r+17,label,13,col):'')}
function P6_signs(cx,y,n,maxw=120){let s='';const k=Math.abs(Math.round(n)),per=Math.max(1,Math.floor(maxw/15)),rows=Math.ceil(k/per);
 for(let i=0;i<k;i++){const row=Math.floor(i/per),inRow=Math.min(per,k-row*per),col=i%per;s+=TBF(cx+(col-(inRow-1)/2)*15,y+row*15,n>0?'+':'−',15,n>0?C.coral:C.blue)}return s}
// A gold-leaf electroscope: charge on the cap and on the leaves (signed units). Leaves part with leaf charge.
function P6_scope(cx,top,cap,leaves,label){
 const a=clamp(Math.abs(leaves)*6,0,46)*Math.PI/180;let s=R(cx-72,top+44,144,176,'#f7fafc',C.line,16);
 s+=L(cx,top+12,cx,top+140,C.dark,4)+Ci(cx,top+10,17,'#d8dfe4',C.dark)+R(cx-14,top+38,28,10,'#c9d3da','none',3);
 const lx=cx-Math.sin(a)*64,rx=cx+Math.sin(a)*64,ly=top+140+Math.cos(a)*64;
 s+=L(cx,top+140,lx,ly,'#d4a017',6)+L(cx,top+140,rx,ly,'#d4a017',6);
 s+=P6_signs(cx,top-14,cap,90);
 const k=Math.abs(leaves),left=Math.ceil(k/2),sg=Math.sign(leaves);
 for(let i=0;i<k;i++){const onLeft=i<left,j=onLeft?i:i-left,f=.42+.27*(j%3),off=12+13*Math.floor(j/3),x=onLeft?cx-Math.sin(a)*64*f-off:cx+Math.sin(a)*64*f+off,y=top+140+Math.cos(a)*64*f;s+=TBF(x,y+5,sg>0?'+':'−',14,sg>0?C.coral:C.blue)}
 if(label)s+=TF(cx,top+238,label,13,C.muted);
 return s;
}

/* ---------- Lesson: electric-charge ---------- */
const P6_MAT={glass:{rod:'Glass rod',cloth:'Silk',sign:1},ebonite:{rod:'Ebonite rod',cloth:'Fur',sign:-1},polythene:{rod:'Polythene strip',cloth:'Wool',sign:-1}};
SCENE({id:'electric-charge',name:'Electric charge',tag:'Rubbing moves electrons',
 definition:'A property of matter that comes in two kinds, positive and negative. Like charges repel, unlike charges attract, and charge is never created or destroyed, only moved.',
 example:'Rub a glass rod with silk and electrons move from the glass to the silk: the rod becomes positive and the silk equally negative. Touch the rod to an electroscope and its gold leaves spread apart, repelled by the same charge.',
 desc:'A rod and cloth being rubbed, with charge signs moving between them, beside a gold-leaf electroscope whose leaves spread when it receives charge.',
 dur:10,hint:'Choose a pair of materials, rub, then touch the electroscope. Earth it to start again.',
 research:'Gilbert (1600) De Magnete; du Fay (1733) two kinds of electricity; Franklin (1747–1751) named them positive and negative.',
 init:()=>({mat:'glass',rod:0,cloth:0,cap:0,leaves:0}),
 watch(p){const sg=P6_MAT.glass.sign,r=Math.min(5,Math.floor(Math.min(p,.62)/.62*6)),q=sg*2*r;if(p<.72)return {mat:'glass',rod:q,cloth:-q,cap:0,leaves:0};const t=Math.trunc(q/2);return {mat:'glass',rod:q-t,cloth:-q,cap:Math.trunc(t/3),leaves:t-Math.trunc(t/3),touched:true}},
 ui:[{choose:[['glass','Glass + silk'],['ebonite','Ebonite + fur'],['polythene','Polythene + wool']],label:'Materials',get:s=>s.mat,act:'mat'},{b:'Rub',act:'rub'},{b:'Touch the electroscope',act:'touch'},{b:'Earth the electroscope',act:'earth'}],
 on:{mat(s,v){s.mat=v;s.rod=0;s.cloth=0},rub(s){const sg=P6_MAT[s.mat].sign;if(Math.abs(s.rod)<12){s.rod+=2*sg;s.cloth-=2*sg}},
  touch(s){const t=Math.trunc(s.rod/2);s.rod-=t;const tot=s.cap+s.leaves+t;s.cap=Math.trunc(tot/3);s.leaves=tot-s.cap;s.touched=true},earth(s){s.cap=0;s.leaves=0}},
 draw(s){
  const m=P6_MAT[s.mat];let out=heading('Rubbing moves electrons; it does not make charge');
  out+=R(40,92,260,30,s.mat==='glass'?'#e3f1f6':'#3b3f45','none',15)+TF(170,82,m.rod,14,C.ink)+P6_signs(170,113,s.rod,230);
  out+=R(70,170,200,46,s.mat==='glass'?'#efe7f7':'#b98a5c','none',14)+TF(170,236,m.cloth,14,C.ink)+P6_signs(170,197,s.cloth,180);
  out+=counter(56,262,'rod charge',(s.rod>0?'+':'')+s.rod+' nC',s.rod>=0?C.coral:C.blue,110)+counter(178,262,'cloth charge',(s.cloth>0?'+':'')+s.cloth+' nC',s.cloth>=0?C.coral:C.blue,110);
  out+=P6_scope(455,84,s.cap,s.leaves,'electroscope: '+((s.cap+s.leaves)>0?'+':'')+(s.cap+s.leaves)+' nC');
  out+=TF(300,372,'Each sign stands for about 1 nC (some 6 billion electrons).',13,C.muted);
  const tot=s.cap+s.leaves;
  const say=s.rod===0&&s.cloth===0&&tot===0?'Everything starts neutral: equal positive and negative charge. Rubbing only moves electrons from one material to the other.'
   :tot!==0?`The electroscope now holds ${tot>0?'+':''}${tot} nC of the same sign as the rod, so its leaves repel each other and spread. Rod + cloth + electroscope still add up to zero.`
   :`${m.rod} and ${m.cloth.toLowerCase()} carry equal and opposite charge (${s.rod>0?'+':''}${s.rod} and ${s.cloth>0?'+':''}${s.cloth} nC): electrons moved ${m.sign>0?'from the glass to the silk':'onto the '+m.rod.toLowerCase()}.`;
  return {svg:out,phase:say};
 }});

SCENE({id:'electric-charge-induction',name:'Charging by induction',tag:'Charge without touching',
 definition:'Charging a conductor without touching it: a nearby charged rod pushes the conductor’s electrons to one side, an earth connection lets some escape, and the conductor is left with the opposite charge.',
 example:'Hold a negative rod near an electroscope, touch the cap with a finger, remove the finger, then the rod: the electroscope ends up positive and the rod keeps all its own charge.',
 desc:'An electroscope with a charged rod above it, step by step: charges separate, the earth connection lets electrons go, and the electroscope is left oppositely charged.',
 dur:12,hint:'Pick the rod’s charge and the order of the steps, then step through. The order matters.',
 research:'Canton (1753) and Wilcke (1757) described charging by induction; the electroscope is Bennet’s gold-leaf design (1787).',
 init:()=>({sign:-1,order:'correct'}),
 ui:[{choose:[[-1,'Negative rod'],[1,'Positive rod']],label:'Rod',get:s=>s.sign,act:'sign'},{choose:[['correct','Finger off, then rod away'],['rod-first','Rod away, then finger off']],label:'Order',get:s=>s.order,act:'order'}],
 on:{sign(s,v){s.sign=Number(v)},order(s,v){s.order=v}},
 trace(s){const g=s.sign,n=4;const F=[{rod:false,earth:false,cap:0,leaves:0,say:'A neutral electroscope: its positive and negative charges are balanced, so the leaves hang together.'},
  {rod:true,earth:false,cap:-g*n,leaves:g*n,say:`The ${g<0?'negative':'positive'} rod ${g<0?'pushes electrons down':'pulls electrons up'}: the cap becomes ${g<0?'positive':'negative'} and the leaves ${g<0?'negative':'positive'}, so they spread. Nothing has been touched yet.`},
  {rod:true,earth:true,cap:-g*n,leaves:0,say:`A finger connects the electroscope to earth. ${g<0?'The repelled electrons escape to earth':'Electrons flow up from earth'}, so the leaves collapse, but the cap stays ${g<0?'positive':'negative'}, held by the rod.`}];
  if(s.order==='correct')F.push({rod:true,earth:false,cap:-g*n,leaves:0,say:'Remove the finger first: the escaped charge can no longer come back.'},{rod:false,earth:false,cap:-g*2,leaves:-g*2,net:-g*n,say:`Now take the rod away. The ${g<0?'positive':'negative'} charge spreads over cap and leaves, and the leaves part again: the electroscope is charged ${g<0?'positively':'negatively'}, opposite to the rod.`});
  else F.push({rod:false,earth:true,cap:0,leaves:0,say:`Rod away while still earthed: ${g<0?'electrons flow back from earth':'electrons flow back to earth'} and the electroscope returns to neutral.`},{rod:false,earth:false,cap:0,leaves:0,net:0,say:'Removing the finger now changes nothing: the electroscope is neutral. Induction only works if the earth is cut first.'});
  return F},
 draw(s,f){
  const g=s.sign;let out=heading('Induction: the order of the steps decides the result');
  out+=P6_scope(300,92,f.cap,f.leaves,'');
  if(f.rod)out+=R(200,40,200,24,g<0?'#3b3f45':'#e3f1f6','none',12)+P6_signs(300,57,g*6,180)+TF(410,57,g<0?'negative rod':'positive rod',13,C.muted,'start');
  if(f.earth)out+=P('M317 98 Q360 98 380 150 V300',C.green,3)+L(366,300,394,300,C.green,3)+L(371,307,389,307,C.green,3)+L(376,314,384,314,C.green,3)+TF(400,250,'earth',13,C.green,'start');
  const tot=f.cap+f.leaves;out+=counter(470,300,'electroscope',(tot>0?'+':'')+tot+' nC',tot>0?C.coral:tot<0?C.blue:C.muted,110);
  return {svg:out,phase:f.say};
 }});

SCENE({id:'electric-charge-coulomb',name:'Coulomb’s law',tag:'Rerun Coulomb’s torsion balance',
 definition:'The force between two point charges is proportional to the product of the charges and inversely proportional to the square of the distance: F = k q₁q₂ / r², with k ≈ 8.99 × 10⁹ N m² C⁻².',
 example:'Halve the distance between two charged spheres and the force becomes four times as strong. Coulomb measured this by how far he had to twist a thin wire to hold the spheres apart.',
 desc:'A torsion balance seen from above with two charged spheres, beside a plot of the force needed against separation, with the learner’s measurements, the inverse-square curve and Coulomb’s three reported readings.',
 dur:12,hint:'Set the separation and press Measure. Take readings at several distances; then compare with Coulomb’s 1785 numbers.',
 research:'Coulomb (1785), Premier mémoire sur l’électricité et le magnétisme: separations 36°, 18° and 8½° needed twists of 36°, 144° and 575½°.',
 init:()=>({r:6,log:[],n:0}),
 watch(p){const rs=[3,4,5,6,8,10,12],k=Math.min(rs.length,Math.floor(p*8));return {r:rs[Math.max(0,k-1)]||3,log:rs.slice(0,k).map((r,i)=>({r,F:P6_K*4e-16/Math.pow(r/100,2)*1000*(1+.025*P6_noise(i))})),n:k}},
 ui:[{range:'r',label:'Separation',min:2,max:14,step:.5,get:s=>s.r,act:'r',show:v=>v+' cm'},{b:'Measure',act:'measure'},{b:'Clear readings',act:'clear'}],
 on:{r(s,v){s.r=v},measure(s){s.n++;s.log=s.log.concat({r:s.r,F:P6_K*4e-16/Math.pow(s.r/100,2)*1000*(1+.025*P6_noise(s.n))}).slice(-12)},clear(s){s.log=[];s.n=0}},
 draw(s){
  const F=P6_K*4e-16/Math.pow(s.r/100,2),twist=F/1.25e-5;let out=heading('Twist the wire until the spheres sit apart');
  // Top view: glass case, fixed sphere, movable sphere on a bar hanging from the fibre.
  out+=Ci(120,190,92,'#f4f8fb',C.line)+Ci(120,190,4,C.dark);
  const ang=-Math.PI/2+(s.r/14)*1.5;out+=L(120-80*Math.cos(ang),190-80*Math.sin(ang),120+80*Math.cos(ang),190+80*Math.sin(ang),C.dark,3);
  out+=Ci(120+80*Math.cos(ang),190+80*Math.sin(ang),9,C.coral,'#fff')+Ci(120,110,9,C.coral,'#fff')+TF(120,96,'fixed sphere',13,C.muted);
  out+=TF(120,302,`twist needed ≈ ${Math.round(twist)}°`,14,C.ink)+TF(120,320,`(${(twist/360).toFixed(1)} turns of the fibre)`,13,C.muted);
  const A=P6_axes(270,64,300,190,{x0:0,x1:15,y0:0,y1:10,xt:[0,5,10,15],yt:[0,2,4,6,8,10],xl:'separation r (cm)',yl:'force F (mN)'});out+=A.svg;
  let curve=[];for(let r=2.1;r<=15;r+=.2)curve.push([A.X(r),A.Y(Math.min(10,P6_K*4e-16/Math.pow(r/100,2)*1000))]);out+=P(P6_path(curve),C.blue,2,'none','stroke-dasharray="6 4"');
  s.log.forEach(m=>out+=Ci(A.X(m.r),A.Y(Math.min(10,m.F)),5,C.coral,'#fff'));
  out+=Ci(A.X(s.r),A.Y(Math.min(10,F*1000)),7,'none',C.amber);
  out+=TF(420,330,'Coulomb 1785: separation 36° → 18° → 8½°',13,C.ink)+TF(420,348,'twist 36° → 144° → 575½° (×4 each halving)',13,C.ink);
  out+=TF(420,370,'Model: two spheres of 20 nC; readings ±2.5 %',13,C.muted);
  const ok=s.log.length>=2;
  return {svg:out,phase:ok?`Your ${s.log.length} readings follow the dashed 1/r² curve: at ${s.r} cm the force is ${(F*1000).toFixed(2)} mN. Halving the distance multiplies the force by four, as in Coulomb’s readings.`:`At ${s.r} cm the spheres push apart with ${(F*1000).toFixed(2)} mN. Take readings at a few distances to see the pattern.`};
 }});

/* ---------- Lesson: electric-field ---------- */
const P6_PX=2000; // pixels per metre in the field scenes (1 cm = 20 px)
function P6_pair(conf,q2,d){const y=215;if(conf==='single')return [{x:300,y,q:2}];return [{x:300-d/2,y,q:2},{x:300+d/2,y,q:conf==='like'?2:q2}]}
SCENE({id:'electric-field',name:'Electric field',tag:'Faraday’s lines of force',
 definition:'The force a charge would feel per coulomb at each point in space, E = F / q, measured in newtons per coulomb (equivalently volts per metre). Field lines start on positive charges and end on negative ones.',
 example:'Lines crowd together where the field is strong, near a charge, and spread out where it is weak. Between a positive and a negative charge they run from one to the other, the pattern of a dipole.',
 desc:'Field lines traced from two point charges whose values and separation can be changed, with arrows showing the direction of the force on a positive test charge.',
 dur:10,hint:'Change the second charge and the separation. Watch lines connect unlike charges and avoid each other between like charges.',
 research:'Faraday (1830s–1850s), lines of force, Experimental Researches in Electricity; field as a physical thing: Maxwell (1865).',
 init:()=>({conf:'pair',q2:-2,d:200}),
 watch(p){return {conf:'pair',q2:Math.round((2-4*smooth(p))*2)/2,d:200}},
 ui:[{choose:[['pair','Two charges'],['like','Like charges'],['single','One charge']],label:'Set-up',get:s=>s.conf,act:'conf'},{range:'q2',label:'Second charge',min:-4,max:4,step:.5,get:s=>s.q2,act:'q2',show:v=>(v>0?'+':'')+v+' nC'},{range:'d',label:'Separation',min:100,max:300,step:10,get:s=>s.d,act:'d',show:v=>v/20+' cm'}],
 on:{conf(s,v){s.conf=v},q2(s,v){s.q2=v;if(s.conf!=='pair')s.conf='pair'},d(s,v){s.d=v}},
 draw(s){
  const ch=P6_pair(s.conf,s.q2,s.d).filter(c=>c.q!==0);let out=heading('Lines show the direction of the force on a + test charge');
  out+=P6_drawLines(P6_lines(ch,{per:6}),C.purple,1.5);
  ch.forEach((c,i)=>out+=P6_charge(c.x,c.y,c.q,(c.q>0?'+':'')+c.q+' nC'));
  // Field strength at the midpoint, in V/m.
  const mx=300,my=215-80;let ex=0,ey=0;for(const c of ch){const dx=(mx-c.x)/P6_PX,dy=(my-c.y)/P6_PX,r=Math.hypot(dx,dy);ex+=P6_K*c.q*1e-9*dx/r**3;ey+=P6_K*c.q*1e-9*dy/r**3}
  out+=Ci(mx,my,5,C.amber)+TF(mx+10,my-8,`E = ${P6_sci(Math.hypot(ex,ey),1)} N/C here`,13,C.amber,'start');
  const say=s.conf==='single'?'Lines spread out evenly from a single charge: their density falls as 1/r², just like the force.'
   :s.conf==='like'||s.q2>0?'Like charges: the lines bend away from each other and none join the two charges. Midway the fields cancel.'
   :s.q2===0?'With the second charge at zero there is only one charge and its lines leave evenly in all directions.'
   :`Unlike charges: lines leave the +2 nC charge and ${Math.abs(s.q2)>=2?'all':'some'} end on the ${s.q2} nC charge${Math.abs(s.q2)<2?'; the rest go out to infinity':''}. More lines means more charge.`;
  return {svg:out,phase:say};
 }});

function P6_V(ch,x,y){let v=0;for(const c of ch){const r=Math.hypot(x-c.x,y-c.y)/P6_PX;v+=P6_K*c.q*1e-9/Math.max(r,.004)}return v}
SCENE({id:'electric-field-potential',name:'Potential and equipotentials',tag:'Voltage is energy per charge',
 definition:'Electric potential V is the energy each coulomb of charge would have at a point, in volts (joules per coulomb). Equipotential lines join points at the same potential and always cross field lines at right angles.',
 example:'Moving 1 nC of charge from a point at 900 V to a point at 300 V releases 1 nC × 600 V = 600 nJ of energy. Moving it along an equipotential costs nothing at all.',
 desc:'A colour map of potential around two charges, with equipotential contour lines and a movable test point whose potential and energy are shown.',
 dur:10,hint:'Move the test point with the sliders. Mark point A, then move to B to see the energy needed to carry 1 nC between them.',
 research:'Green (1828) introduced the potential function; Faraday and Maxwell linked it to lines of force. Volta’s name gave the unit, the volt.',
 init:()=>({conf:'pair',tx:15,ty:5,ax:null,ay:null}),
 watch(p){const a=p*2*Math.PI;return {conf:'pair',tx:15+6*Math.cos(a),ty:9-4*Math.sin(a),ax:null,ay:null}},
 ui:[{choose:[['pair','+ and −'],['like','+ and +'],['single','One +']],label:'Charges',get:s=>s.conf,act:'conf'},{range:'tx',label:'Test point x',min:1,max:29,step:.5,get:s=>s.tx,act:'tx',show:v=>v+' cm'},{range:'ty',label:'y',min:2,max:15,step:.5,get:s=>s.ty,act:'ty',show:v=>v+' cm'},{b:'Mark point A here',act:'mark'}],
 on:{conf(s,v){s.conf=v},tx(s,v){s.tx=v},ty(s,v){s.ty=v},mark(s){s.ax=s.tx;s.ay=s.ty}},
 draw(s){
  const ch=P6_pair(s.conf==='pair'?'pair':s.conf,-2,200);let out='';const x0=0,y0=44,cs=20,nx=30,ny=17,Vm=1200;
  const V=(i,j)=>P6_V(ch,x0+i*cs,y0+j*cs);const grid=[];for(let i=0;i<=nx;i++){grid.push([]);for(let j=0;j<=ny;j++)grid[i].push(V(i,j))}
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const v=P6_V(ch,x0+(i+.5)*cs,y0+(j+.5)*cs),t=Math.abs(v)/Vm;out+=`<rect x="${x0+i*cs}" y="${y0+j*cs}" width="${cs+.5}" height="${cs+.5}" fill="${v>=0?P6_mix('#ffffff','#e98d77',t):P6_mix('#ffffff','#6aa6d6',t)}"/>`}
  // Equipotential contours by marching squares.
  for(const lv of [-1000,-600,-300,-150,150,300,600,1000]){let d='';
   for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const c=[[i,j],[i+1,j],[i+1,j+1],[i,j+1]],v=c.map(([a,b])=>grid[a][b]),pts=[];
    for(let e=0;e<4;e++){const a=e,b=(e+1)%4;if((v[a]-lv)*(v[b]-lv)<0){const t=(lv-v[a])/(v[b]-v[a]);pts.push([x0+cs*(c[a][0]+t*(c[b][0]-c[a][0])),y0+cs*(c[a][1]+t*(c[b][1]-c[a][1]))])}}
    if(pts.length>=2)d+=`M${fmt(pts[0][0])} ${fmt(pts[0][1])}L${fmt(pts[1][0])} ${fmt(pts[1][1])}`;if(pts.length===4)d+=`M${fmt(pts[2][0])} ${fmt(pts[2][1])}L${fmt(pts[3][0])} ${fmt(pts[3][1])}`}
   if(d)out+=P(d,lv>0?'#9b3a24':'#1d5d8e',1.3)}
  ch.forEach(c=>out+=P6_charge(c.x,c.y,c.q,''));
  const px=x0+s.tx*cs,py=y0+s.ty*cs,vt=P6_V(ch,px,py);
  out+=Ci(px,py,7,C.amber,'#fff');
  let line=`V = ${Math.round(vt)} V at the test point; 1 nC there has ${Math.round(vt)} nJ of potential energy`;
  if(s.ax!==null){const ax=x0+s.ax*cs,ay=y0+s.ay*cs,va=P6_V(ch,ax,ay);out+=Ci(ax,ay,7,'#fff',C.dark)+TBF(ax,ay-11,'A',13,C.dark)+L(ax,ay,px,py,C.dark,1.5,'stroke-dasharray="4 4"');line=`A: ${Math.round(va)} V → here: ${Math.round(vt)} V. Moving 1 nC needs ${Math.round(vt-va)} nJ (negative means energy is released).`}
  out+=R(10,350,580,26,'#ffffffdd','none',6)+TF(300,368,line,13,C.ink);
  out+=TF(300,32,'Equipotentials: dark red > 0 V, dark blue < 0 V (150, 300, 600, 1000 V)',13,C.muted);
  return {svg:out,phase:'Contours are equipotentials: moving along one costs no energy. They cross the field lines at right angles, and they crowd together where the field is strong, because E is how fast V changes with distance.'};
 }});

SCENE({id:'electric-field-cage',name:'Faraday cage',tag:'No field inside a conductor',
 definition:'A closed conducting shell blocks an outside steady electric field: its free electrons move until their own field cancels the outside one everywhere inside, so the field in the hollow is zero. Shielding changing fields depends on their frequency, the metal and any gaps.',
 example:'Faraday sat inside a metal-coated room while sparks flew outside and his electroscope showed nothing. A car body or an aircraft protects people from lightning the same way.',
 desc:'A uniform field between two plates, with and without a hollow conducting box: with the box, field lines end on induced charges on its surface and the inside is empty.',
 dur:9,hint:'Switch the cage on and off, change the outside field, and move the probe inside or outside.',
 research:'Faraday (1836) built a 12-foot conducting cube and found no charge effects inside, reported in Experimental Researches in Electricity (1838).',
 init:()=>({cage:true,E0:5,probe:'inside'}),
 watch(p){return {cage:p>.45,E0:Math.round(2+6*smooth(p)),probe:'inside'}},
 ui:[{choose:[[1,'Cage on'],[0,'Cage off']],label:'Cage',get:s=>s.cage?1:0,act:'cage'},{range:'E0',label:'Outside field',min:1,max:10,get:s=>s.E0,act:'E0',show:v=>v+' kV/m'},{choose:[['inside','Probe inside'],['outside','Probe outside']],label:'Probe',get:s=>s.probe,act:'probe'}],
 on:{cage(s,v){s.cage=Number(v)===1},E0(s,v){s.E0=v},probe(s,v){s.probe=v}},
 draw(s){
  let out=heading(s.cage?'Charges on the cage cancel the field inside':'Without a cage the field passes straight through');
  out+=R(40,60,22,270,C.coral,'none',4)+R(538,60,22,270,C.blue,'none',4);
  for(let i=0;i<9;i++)out+=TBF(51,80+i*30,'+',15,'#fff')+TBF(549,80+i*30,'−',15,'#fff');
  const n=Math.max(3,Math.round(s.E0*1.2)),bx=220,by=120,bw=160,bh=150;
  for(let k=0;k<n;k++){const y=70+(k+.5)*250/n;const inside=y>by&&y<by+bh;
   if(s.cage&&inside){out+=arrow(64,y,bx-2,y,C.purple,1.6,7)+arrow(bx+bw+2,y,536,y,C.purple,1.6,7)}
   else if(s.cage&&!inside){const bend=y<by?-1:1;out+=P(`M64 ${fmt(y)} H${bx-30} Q${bx+bw/2} ${fmt(y+bend*10)} ${bx+bw+30} ${fmt(y)} H530`,C.purple,1.6)+`<polygon points="536,${fmt(y)} 528,${fmt(y-4)} 528,${fmt(y+4)}" fill="${C.purple}"/>`}
   else out+=arrow(64,y,536,y,C.purple,1.6,7)}
  if(s.cage){out+=R(bx,by,bw,bh,'#ffffffcc',C.dark,10,'stroke-width="5"');for(let i=0;i<5;i++)out+=TBF(bx-10,by+18+i*28,'−',14,C.blue)+TBF(bx+bw+10,by+18+i*28,'+',14,C.coral)}
  const inP=s.probe==='inside',px=inP?300:140,py=inP?195:330,E=s.cage&&inP?0:s.E0;
  out+=Ci(px,py,8,C.amber,'#fff')+TBF(px,py-14,'probe',13,C.amber);
  out+=counter(470,340-6,'field at probe',E+' kV/m',E?C.purple:C.green,112);
  return {svg:out,phase:s.cage?(inP?'Inside the cage the probe reads 0 kV/m: electrons crowded onto the left wall and left the right wall positive, and their field exactly cancels the outside field in the hollow.':`Outside the cage the field is still about ${s.E0} kV/m and lines bend to meet the metal at right angles.`):`With no conductor the field of ${s.E0} kV/m runs straight from the + plate to the − plate and fills every point, including where the cage would be.`};
 }});

/* ---------- Lesson: circuits ---------- */
// A loop path for moving charges: rectangle from (x0,y0) to (x1,y1).
function P6_loopPoint(u,x0,y0,x1,y1){const w=x1-x0,h=y1-y0,per=2*(w+h);let d=((u%1)+1)%1*per;if(d<w)return [x0+d,y0];d-=w;if(d<h)return [x1,y0+d];d-=h;if(d<w)return [x1-d,y1];d-=w;return [x0,y1-d]}
function P6_bulb(x,y,Pw,label){const t=clamp(Pw/3,0,1);return (t>0?Ci(x,y,26+12*t,'#ffd84a','none',`opacity="${(.25+.45*t).toFixed(2)}"`):'')+Ci(x,y,18,P6_mix('#eef2f4','#ffd84a',t),C.dark)+P(`M${x-7} ${y+4} Q${x} ${y-10} ${x+7} ${y+4}`,P6_mix('#9aa8b0','#c47a00',t),2)+(label?TF(x,y+38,label,13,C.muted):'')}
SCENE({id:'circuits',name:'Electric circuit',tag:'Volta’s pile drives a current',
 definition:'A closed loop of conductors through which charge flows. A source such as a battery gives each coulomb energy (its voltage); the current is the charge passing a point each second, in amperes.',
 example:'Volta stacked pairs of zinc and copper discs separated by brine-soaked card: each pair adds roughly 0.8 V. Close the switch and a current flows at once all round the loop, even though each electron drifts only millimetres a second.',
 desc:'A voltaic pile, switch, ammeter and bulb in one loop; dots move round the loop when the switch is closed, faster for a larger current.',
 dur:10,hint:'Add or remove pairs of discs and open or close the switch. The bulb only lights when the loop is complete.',
 research:'Volta (1800), On the electricity excited by the mere contact of conducting substances of different kinds, Phil. Trans. R. Soc.',
 init:()=>({pairs:6,closed:true}),
 watch(p){return {pairs:Math.max(1,Math.round(2+8*smooth(p))),closed:p>.18,ph:p*6}},
 ui:[{range:'pairs',label:'Zinc–copper pairs',min:1,max:12,get:s=>s.pairs,act:'pairs'},{choose:[[1,'Switch closed'],[0,'Switch open']],label:'Switch',get:s=>s.closed?1:0,act:'sw'}],
 on:{pairs(s,v){s.pairs=v},sw(s,v){s.closed=Number(v)===1}},
 draw(s,f,X){
  const V=.8*s.pairs,Rb=10,I=s.closed?V/Rb:0,Pw=I*V;let out=heading('A complete loop, a push and a flow');
  const x0=130,y0=80,x1=470,y1=300;out+=R(x0,y0,x1-x0,y1-y0,'none',C.dark,4,'stroke-width="4"');
  // pile on the left edge
  for(let i=0;i<s.pairs;i++){const y=y1-34-i*13;out+=R(x0-22,y,44,5,'#9aa1a6','none',2)+R(x0-22,y+5,44,4,'#f1e2c5','none',1)+R(x0-22,y+9,44,4,'#c27a46','none',2)}
  out+=TF(x0,y1+22,`${s.pairs} pairs ≈ ${V.toFixed(1)} V`,13,C.ink);
  out+=R(x1-4,150,8,60,'#fff','none',0);
  out+=s.closed?L(x1,150,x1,210,C.dark,4):L(x1,150,x1+26,192,C.dark,4);out+=Ci(x1,150,5,C.dark)+Ci(x1,210,5,C.dark)+TF(x1+18,140,s.closed?'closed':'open',13,C.muted,'start');
  if(I>0){const ph=X.try?0:(s.ph||0),sp=I*0.25;for(let k=0;k<22;k++){const [x,y]=P6_loopPoint(k/22+ph*sp,x0,y0,x1,y1);out+=Ci(x,y,3.5,C.blue)}
   out+=arrow(210,y0-14,250,y0-14,C.coral,2,7)+TF(230,y0-22,'conventional current',13,C.coral)}
  out+=P6_bulb(300,y0,Pw,'');out+=R(270,y1-18,60,36,'#fff',C.dark,8)+TF(300,y1+5,(I*1000).toFixed(0)+' mA',13,C.ink)+TF(300,y1+34,'ammeter',13,C.muted);
  out+=counter(470,24,'power in bulb',Pw.toFixed(2)+' W',C.amber,116);
  return {svg:out,phase:!s.closed?'With the switch open the loop is broken: no current flows anywhere, however many discs you stack.':`${s.pairs} pairs give about ${V.toFixed(1)} V across a 10 Ω bulb (model), so I = V/R = ${(I*1000).toFixed(0)} mA. Blue dots are electrons, which drift the opposite way to the conventional current arrow.`};
 }});

SCENE({id:'circuits-ohm',name:'Ohm’s law',tag:'Rerun Ohm: current against voltage',
 definition:'For many conductors at constant temperature the current is proportional to the voltage: V = I R, where R is the resistance in ohms. Components that follow it are called ohmic; many do not.',
 example:'Double the voltage across a 30 Ω resistor and the current doubles. A filament bulb is different: as it heats up its resistance rises, so its current-voltage graph curves.',
 desc:'A plot of current against voltage where the learner records points for a resistor and for a filament bulb; the resistor’s points lie on a straight line and the bulb’s curve over.',
 dur:12,hint:'Pick a component, set the voltage and press Record. Compare the shapes: a straight line means constant resistance.',
 research:'Ohm (1827), Die galvanische Kette, mathematisch bearbeitet. The bulb uses a common empirical model, I ∝ V^0.6 for a tungsten filament.',
 init:()=>({comp:'resistor',V:6,log:[]}),
 watch(p){const pts=[];const n=Math.floor(p*13);for(let i=1;i<=n;i++){const V=(i<=6?i*2:(i-6)*2);pts.push({c:i<=6?'resistor':'bulb',V})}return {comp:n>6?'bulb':'resistor',V:pts.length?pts[pts.length-1].V:0,log:pts}},
 ui:[{choose:[['resistor','30 Ω resistor'],['bulb','12 V bulb']],label:'Component',get:s=>s.comp,act:'comp'},{range:'V',label:'Voltage',min:0,max:12,step:.5,get:s=>s.V,act:'V',show:v=>v+' V'},{b:'Record',act:'rec'},{b:'Clear',act:'clear'}],
 on:{comp(s,v){s.comp=v},V(s,v){s.V=v},rec(s){s.log=s.log.concat({c:s.comp,V:s.V}).slice(-24)},clear(s){s.log=[]}},
 draw(s){
  const I=(c,V)=>c==='resistor'?V/30:.5*Math.pow(Math.max(V,0)/12,.6);let out=heading('Is current proportional to voltage?');
  const A=P6_axes(80,62,300,250,{x0:0,x1:12,y0:0,y1:.5,xt:[0,3,6,9,12],yt:[0,.1,.2,.3,.4,.5],xl:'voltage V (V)',yl:'current I (A)'});out+=A.svg;
  s.log.forEach(m=>out+=m.c==='resistor'?Ci(A.X(m.V),A.Y(I('resistor',m.V)),5,C.blue,'#fff'):R(A.X(m.V)-5,A.Y(I('bulb',m.V))-5,10,10,C.coral,'#fff',2));
  const rs=s.log.filter(m=>m.c==='resistor'),bs=s.log.filter(m=>m.c==='bulb');
  if(rs.length>=2)out+=L(A.X(0),A.Y(0),A.X(12),A.Y(.4),C.blue,1.5,'stroke-dasharray="5 4"');
  if(bs.length>=2){const pts=[];for(let v=0;v<=12;v+=.25)pts.push([A.X(v),A.Y(I('bulb',v))]);out+=P(P6_path(pts),C.coral,1.5,'none','stroke-dasharray="5 4"')}
  const i=I(s.comp,s.V);out+=Ci(A.X(s.V),A.Y(i),8,'none',C.amber);
  out+=counter(420,70,'current',(i*1000).toFixed(0)+' mA',C.ink,140)+counter(420,128,'R = V / I',s.V>0?(s.V/i).toFixed(1)+' Ω':'—',C.purple,140);
  out+=Ci(430,206,5,C.blue,'#fff')+TF(442,210,'resistor (ohmic)',13,C.ink,'start')+R(425,226,10,10,C.coral,'#fff',2)+TF(442,236,'filament bulb (model)',13,C.ink,'start');
  return {svg:out,phase:s.comp==='resistor'?`For the resistor, V / I stays at 30 Ω whatever the voltage: a straight line through the origin, as Ohm found for his wires.`:`For the bulb, V / I rises from about ${(1/I('bulb',.5)*.5).toFixed(0)} Ω at 0.5 V to 24 Ω at 12 V: the hotter filament resists more, so the graph curves. Ohm’s law is a property of some materials, not a law of nature.`};
 }});

SCENE({id:'circuits-series-parallel',name:'Series and parallel',tag:'One path or several',
 definition:'In series, components share one path: the same current flows through each and the voltage is shared. In parallel, each has its own path: each gets the full voltage and the currents add.',
 example:'Two identical 12 Ω bulbs on a 6 V battery: in series each gets 3 V and glows dimly; in parallel each gets 6 V and draws four times the power. Remove one series bulb and both go out; in parallel the other stays lit.',
 desc:'Two bulbs wired either in series or in parallel across the same battery, with currents, voltages and brightness shown, and the option to remove one bulb.',
 dur:10,hint:'Switch between series and parallel, and remove bulb B to see which circuit survives.',
 research:'Kirchhoff (1845) stated the current and voltage laws for networks of conductors; the water analogy is a teaching model with known limits.',
 init:()=>({mode:'series',broken:false}),
 watch(p){return {mode:p<.5?'series':'parallel',broken:(p>.32&&p<.5)||p>.82}},
 ui:[{choose:[['series','Series'],['parallel','Parallel']],label:'Wiring',get:s=>s.mode,act:'mode'},{choose:[[0,'Bulb B in'],[1,'Bulb B removed']],label:'Bulb B',get:s=>s.broken?1:0,act:'brk'}],
 on:{mode(s,v){s.mode=v},brk(s,v){s.broken=Number(v)===1}},
 draw(s){
  const V=6,Rb=12;let IA,IB,VA,VB;if(s.mode==='series'){const I=s.broken?0:V/(2*Rb);IA=IB=I;VA=VB=I*Rb}else{IA=V/Rb;VA=V;IB=s.broken?0:V/Rb;VB=s.broken?0:V}
  const PA=IA*VA,PB=IB*VB;let out=heading(s.mode==='series'?'Series: one path, the current is shared by both':'Parallel: two paths, each bulb gets the full 6 V');
  out+=R(70,170,30,60,'#dfe6ea',C.dark,4)+TF(110,205,'6 V',13,C.ink,'start')+TBF(85,190,'+',14,C.coral);
  if(s.mode==='series'){out+=P('M85 170 V90 H520 V300 H85 V230',C.dark,3);out+=P6_bulb(240,90,PA,'A')+(s.broken?R(360,74,40,32,C.bg,'none',4)+TF(380,96,'gap',13,C.coral):P6_bulb(380,90,PB,'B'))}
  else{out+=P('M85 170 V90 H520 V300 H85 V230',C.dark,3)+P('M180 90 V200 H440 V90',C.dark,3);out+=P6_bulb(310,90,PA,'A')+(s.broken?R(290,184,40,32,C.bg,'none',4)+TF(310,206,'gap',13,C.coral):P6_bulb(310,200,PB,'B'))}
  out+=counter(140,318,'bulb A',`${VA.toFixed(1)} V · ${IA.toFixed(2)} A`,C.ink,140)+counter(300,318,'bulb B',`${VB.toFixed(1)} V · ${IB.toFixed(2)} A`,C.ink,140)+counter(460,318,'from battery',`${(s.mode==='series'?IA:IA+IB).toFixed(2)} A`,C.blue,120);
  const say=s.mode==='series'?(s.broken?'Series with bulb B removed: the only path is broken, so no current flows and bulb A goes out too.':`Series: 0.25 A flows through both bulbs and each gets 3 V, so each uses 0.75 W and glows dimly.`)
   :(s.broken?'Parallel with bulb B removed: bulb A still has its own complete path and keeps its full 6 V, 0.5 A and 3 W.':'Parallel: each bulb gets the full 6 V, draws 0.5 A and uses 3 W, four times the series power. The battery supplies 1 A, the sum of the branches.');
  return {svg:out,phase:say+' (Model: bulbs treated as fixed 12 Ω resistors.)'};
 }});

/* ---------- Lesson: magnetism ---------- */
function P6_magnet(ang,len=150,str=1){const c=Math.cos(ang),sn=Math.sin(ang);return [{x:300+c*len/2,y:215+sn*len/2,q:str,p:'N'},{x:300-c*len/2,y:215-sn*len/2,q:-str,p:'S'}]}
SCENE({id:'magnetism',name:'Magnetic field',tag:'Iron filings and compasses',
 definition:'The region around a magnet or a current where magnetic forces act. Its direction at a point is the way a compass needle’s north end points; its lines run from a magnet’s north pole round to its south pole.',
 example:'Sprinkle iron filings around a bar magnet and they line up along curves joining the poles. A compass placed anywhere on those curves points along them; the Earth is itself a giant magnet.',
 desc:'A bar magnet that can be rotated, surrounded either by compass needles that point along the field or by filing-like field lines from north to south.',
 dur:10,hint:'Rotate the magnet and switch between compasses and filings. The needles always point along the lines.',
 research:'Gilbert (1600), De Magnete, showed the Earth is a magnet; Faraday (1831–1852) mapped lines of force with filings.',
 init:()=>({ang:0,view:'compass'}),
 watch(p){return {ang:smooth(p)*Math.PI/2,view:p<.5?'filings':'compass'}},
 ui:[{range:'ang',label:'Magnet angle',min:0,max:180,step:5,get:s=>Math.round(s.ang*180/Math.PI),act:'ang',show:v=>v+'°'},{choose:[['compass','Compasses'],['filings','Field lines']],label:'View',get:s=>s.view,act:'view'}],
 on:{ang(s,v){s.ang=v*Math.PI/180},view(s,v){s.view=v}},
 draw(s){
  const poles=P6_magnet(s.ang);let out=heading('North pole to south pole, outside the magnet');
  if(s.view==='filings')out+=P6_drawLines(P6_lines(poles,{per:12,rad:10}),'#7c858b',1.2);
  else for(let i=0;i<10;i++)for(let j=0;j<6;j++){const x=48+i*56,y=72+j*55;const near=poles.some(p=>Math.hypot(x-p.x,y-p.y)<34)||Math.abs((x-300)*Math.sin(s.ang)-(y-215)*Math.cos(s.ang))<34&&Math.abs((x-300)*Math.cos(s.ang)+(y-215)*Math.sin(s.ang))<98;if(near)continue;
   const [bx,by]=P6_E(poles,x,y),m=Math.hypot(bx,by)||1,ux=bx/m,uy=by/m;out+=Ci(x,y,14,'#fff',C.line)+`<polygon points="${fmt(x+ux*12)},${fmt(y+uy*12)} ${fmt(x-uy*4)},${fmt(y+ux*4)} ${fmt(x+uy*4)},${fmt(y-ux*4)}" fill="${C.coral}"/><polygon points="${fmt(x-ux*12)},${fmt(y-uy*12)} ${fmt(x-uy*4)},${fmt(y+ux*4)} ${fmt(x+uy*4)},${fmt(y-ux*4)}" fill="#8a969d"/>`}
  const c=Math.cos(s.ang),sn=Math.sin(s.ang);
  out+=`<g transform="translate(300 215) rotate(${fmt(s.ang*180/Math.PI)})"><rect x="-75" y="-16" width="75" height="32" fill="#6f8796" rx="3"/><rect x="0" y="-16" width="75" height="32" fill="${C.coral}" rx="3"/></g>`;
  out+=TBF(300+c*52,215+sn*52+5,'N',15,'#fff')+TBF(300-c*52,215-sn*52+5,'S',15,'#fff');
  return {svg:out,phase:s.view==='compass'?'Each compass needle’s red north end points along the field: away from the magnet’s north pole and round towards its south pole. Turn the magnet and every needle follows.':'Field lines leave the north pole, loop round and enter the south pole. Inside the magnet they continue from south back to north, so magnetic field lines never end.'};
 }});

SCENE({id:'magnetism-oersted',name:'Ørsted’s discovery',tag:'Rerun Ørsted: a current turns a compass',
 definition:'An electric current produces a magnetic field around it. Ørsted saw a compass needle swing when the current in a wire above it was switched on, the first link between electricity and magnetism.',
 example:'With the wire running north–south above a compass, a current flowing north pushes the needle west; reverse the current and it swings east. The deflection grows with the current but never passes 90°.',
 desc:'A compass under a north–south wire seen from above, with a current slider; the needle deflects, and recorded readings are plotted against the model curve.',
 dur:12,hint:'Set the current (negative means flowing south) and press Record. Take several readings and compare them with the curve.',
 research:'Ørsted (1820), Experimenta circa effectum conflictus electrici in acum magneticam. Model: wire 2 cm above the needle, Earth’s horizontal field ≈ 20 µT.',
 init:()=>({I:2,log:[],n:0}),
 watch(p){const Is=[0,1,2,3,4,5,-2,-4],k=Math.min(Is.length,Math.floor(p*9));return {I:k?Is[k-1]:0,log:Is.slice(0,k).map((I,i)=>({I,th:Math.atan(I*1e-5/2e-5)*180/Math.PI+1.2*P6_noise(i)})),n:k}},
 ui:[{range:'I',label:'Current',min:-5,max:5,step:.5,get:s=>s.I,act:'I',show:v=>v+' A'},{b:'Record reading',act:'rec'},{b:'Clear',act:'clear'}],
 on:{I(s,v){s.I=v},rec(s){s.n++;s.log=s.log.concat({I:s.I,th:Math.atan(s.I*1e-5/2e-5)*180/Math.PI+1.2*P6_noise(s.n)}).slice(-14)},clear(s){s.log=[];s.n=0}},
 draw(s){
  const Bw=P6_MU0*s.I/(2*Math.PI*.02),th=Math.atan(Bw/2e-5);let out=heading('A current deflects a compass needle');
  const cx=140,cy=200;out+=Ci(cx,cy,92,'#fff',C.line);['N','E','S','W'].forEach((d,i)=>out+=TBF(cx+Math.sin(i*Math.PI/2)*76,cy-Math.cos(i*Math.PI/2)*76+5,d,14,C.muted));
  const a=-th,ux=Math.sin(a),uy=-Math.cos(a);out+=`<polygon points="${fmt(cx+ux*70)},${fmt(cy+uy*70)} ${fmt(cx-uy*8)},${fmt(cy+ux*8)} ${fmt(cx+uy*8)},${fmt(cy-ux*8)}" fill="${C.coral}"/><polygon points="${fmt(cx-ux*70)},${fmt(cy-uy*70)} ${fmt(cx-uy*8)},${fmt(cy+ux*8)} ${fmt(cx+uy*8)},${fmt(cy-ux*8)}" fill="#8a969d"/>`;
  out+=R(cx-4,80,8,240,s.I?C.amber:'#c9d2d8','none',3,'opacity=".45"');
  if(s.I)out+=arrow(cx+22,s.I>0?250:150,cx+22,s.I>0?150:250,C.amber,2.5,8)+TF(cx+30,200,'I',14,C.amber,'start');
  const A=P6_axes(330,70,240,220,{x0:-5,x1:5,y0:-90,y1:90,xt:[-5,0,5],yt:[-90,-45,0,45,90],xl:'current I (A, + = northwards)',yl:'deflection (°, + = west)'});out+=A.svg;
  const pts=[];for(let I=-5;I<=5;I+=.1)pts.push([A.X(I),A.Y(Math.atan(I/2)*180/Math.PI)]);out+=P(P6_path(pts),C.blue,1.6,'none','stroke-dasharray="5 4"');
  s.log.forEach(m=>out+=Ci(A.X(m.I),A.Y(m.th),5,C.coral,'#fff'));out+=Ci(A.X(s.I),A.Y(th*180/Math.PI),8,'none',C.amber);
  return {svg:out,phase:`${Math.abs(s.I)} A at 2 cm makes ${(Bw*1e6).toFixed(1)} µT; with Earth’s ~20 µT the needle settles at ${(th*180/Math.PI).toFixed(0)}° ${s.I>0?'west':s.I<0?'east':'(no deflection)'}. tan(deflection) = B_wire / B_Earth, so it approaches but never reaches 90°.`};
 }});

SCENE({id:'magnetism-wire-coil',name:'Field of a wire and a coil',tag:'Circles and solenoids',
 definition:'A straight current is circled by magnetic field lines, B = μ₀I / 2πr, getting weaker with distance. Wound into a long coil (a solenoid) the fields add to a nearly uniform field inside, B = μ₀ n I.',
 example:'Grip the wire with your right hand, thumb along the current: your fingers curl the way the field goes. A coil of 1000 turns per metre carrying 2 A has about 2.5 mT inside, much like a weak bar magnet.',
 desc:'Either a wire seen end-on with circular field lines, or a coil cut lengthways with dots and crosses for the current and a uniform field inside; a 3D view shows the loops around the wire.',
 dur:10,hint:'Switch between a wire and a coil, and change the current and its direction. Open 3D to see the circles in space.',
 research:'Biot & Savart (1820) and Ampère (1820–1826) gave the field of a current; Sturgeon (1824) built the first electromagnet.',
 init:()=>({kind:'wire',I:3}),
 watch(p){return {kind:p<.5?'wire':'coil',I:p<.25||(p>.5&&p<.75)?3:-3}},
 ui:[{choose:[['wire','Straight wire'],['coil','Coil (solenoid)']],label:'Shape',get:s=>s.kind,act:'kind'},{range:'I',label:'Current',min:-5,max:5,step:.5,get:s=>s.I,act:'I',show:v=>v+' A'}],
 on:{kind(s,v){s.kind=v},I(s,v){s.I=v}},
 draw(s){
  let out='';const sg=Math.sign(s.I)||1,on=s.I!==0;
  if(s.kind==='wire'){out+=heading('Field lines circle the wire');
   [40,75,110,145].forEach((r,i)=>{out+=Ci(300,215,r,'none',on?C.purple:C.line,'stroke-width="1.6"');if(on){const a=-Math.PI/4,x=300+r*Math.cos(a),y=215+r*Math.sin(a),tx=-Math.sin(a)*-sg,ty=Math.cos(a)*-sg;out+=`<polygon points="${fmt(x+tx*8)},${fmt(y+ty*8)} ${fmt(x-tx*4-ty*5)},${fmt(y-ty*4+tx*5)} ${fmt(x-tx*4+ty*5)},${fmt(y-ty*4-tx*5)}" fill="${C.purple}"/>`}
    out+=TF(300+r*Math.cos(Math.PI*.8),215+r*Math.sin(Math.PI*.8),`${(P6_MU0*Math.abs(s.I)/(2*Math.PI*r/2000)*1e6).toFixed(0)} µT`,13,C.muted)});
   out+=Ci(300,215,14,C.amber,'#fff')+(s.I>0?Ci(300,215,4,C.dark):s.I<0?L(292,207,308,223,C.dark,3)+L(308,207,292,223,C.dark,3):'');
   out+=TF(300,380-12,s.I>0?'current out of the page (•): field anticlockwise':s.I<0?'current into the page (×): field clockwise':'no current, no field',13,C.ink);
  }else{out+=heading('A coil makes a nearly uniform field inside');
   for(let i=0;i<8;i++){const x=150+i*43;out+=Ci(x,140,10,'#fff',C.dark)+Ci(x,290,10,'#fff',C.dark);if(on){out+=(s.I>0?Ci(x,140,3,C.dark)+L(x-6,284,x+6,296,C.dark,2)+L(x+6,284,x-6,296,C.dark,2):Ci(x,290,3,C.dark)+L(x-6,134,x+6,146,C.dark,2)+L(x+6,134,x-6,146,C.dark,2))}}
   if(on){for(let k=0;k<4;k++){const y=172+k*30;out+=s.I>0?arrow(120,y,480,y,C.purple,1.8,8):arrow(480,y,120,y,C.purple,1.8,8)}
    out+=P(`M480 172 C580 40 20 40 120 172`,C.purple,1.4,'none','stroke-dasharray="5 4"')+P(`M480 262 C580 390 20 390 120 262`,C.purple,1.4,'none','stroke-dasharray="5 4"');
    out+=TBF(s.I>0?505:95,222,'N',15,C.coral)+TBF(s.I>0?95:505,222,'S',15,C.blue)}
   out+=counter(250,330-4,'B inside (1000 turns/m)',`${(P6_MU0*1000*Math.abs(s.I)*1000).toFixed(2)} mT`,C.purple,170);
  }
  return {svg:out,phase:s.kind==='wire'?`B = μ₀I / 2πr: with ${Math.abs(s.I)} A the field is ${(P6_MU0*Math.abs(s.I)/(2*Math.PI*.02)*1e6).toFixed(0)} µT at 2 cm and halves each time the distance doubles. Reverse the current and the circles reverse.`:`Inside a long coil the loops’ fields add up to a uniform field, B = μ₀nI. The coil behaves like a bar magnet with a north pole at the end where the field comes out.`};
 },
 three(s,f,X,project){
  const Pj=project([[-1.6,-1.6,-1.4],[1.6,1.6,1.6]]),sg=Math.sign(s.I)||1,on=s.I!==0;let out='';
  if(s.kind==='wire'){out+=line3([0,0,-1.4],[0,0,1.6],Pj,C.amber,5)+arrow3([0,0,.9],[0,0,1.5].map((v,i)=>i===2?(sg>0?1.5:.3):v),Pj,C.amber,3);
   for(const z of [-.8,.2,1.1])for(const r of [.5,1,1.5]){const pts=[];for(let k=0;k<=48;k++){const a=k/48*2*Math.PI;pts.push(Pj([r*Math.cos(a),r*Math.sin(a),z]))}out+=P(P6_path(pts),on?C.purple:C.line,1.4);
    if(on){const a=.6,q=Pj([r*Math.cos(a),r*Math.sin(a),z]),q2=Pj([r*Math.cos(a+sg*.25),r*Math.sin(a+sg*.25),z]);out+=arrow(q[0],q[1],q2[0],q2[1],C.purple,1.6,7)}}}
  else{const pts=[];for(let k=0;k<=360;k++){const t=k/360,a=t*8*2*Math.PI;pts.push(Pj([-1.4+2.8*t,.8*Math.cos(a),.8*Math.sin(a)]))}out+=P(P6_path(pts),C.amber,2.2);
   if(on)for(const [y,z] of [[0,0],[.35,0],[-.35,0],[0,.35],[0,-.35]])out+=arrow3([sg>0?-1.5:1.5,y,z],[sg>0?1.5:-1.5,y,z],Pj,C.purple,1.8)}
  return {svg:out,title:'Field of a current in 3D',caption:s.kind==='wire'?'Circles of field in planes at right angles to the wire, getting weaker further out.':'Inside the coil the field runs straight along the axis.'};
 }});

SCENE({id:'magnetism-ampere',name:'Force between currents',tag:'Ampère’s parallel wires',
 definition:'Two parallel currents attract if they flow the same way and repel if they flow opposite ways, with a force per metre F/L = μ₀ I₁ I₂ / 2πd.',
 example:'Two wires 1 m apart each carrying 1 A pull on each other with 2 × 10⁻⁷ N per metre. From 1948 until 2019 that exact force defined the ampere; it is now fixed through the charge of the electron.',
 desc:'Two parallel vertical wires with adjustable currents and separation, showing current arrows, the force arrows on each wire and the force per metre.',
 dur:10,hint:'Set both currents (negative flows downwards) and the gap. Same direction attracts; opposite directions repel.',
 research:'Ampère (1826), Théorie des phénomènes électro-dynamiques, uniquement déduite de l’expérience; BIPM (2019) SI Brochure, 9th edition.',
 init:()=>({I1:5,I2:5,d:4}),
 watch(p){return {I1:5,I2:Math.round(5-10*smooth(p)),d:4}},
 ui:[{range:'I1',label:'Current 1',min:-10,max:10,get:s=>s.I1,act:'I1',show:v=>v+' A'},{range:'I2',label:'Current 2',min:-10,max:10,get:s=>s.I2,act:'I2',show:v=>v+' A'},{range:'d',label:'Gap',min:1,max:10,step:.5,get:s=>s.d,act:'d',show:v=>v+' cm'}],
 on:{I1(s,v){s.I1=v},I2(s,v){s.I2=v},d(s,v){s.d=v}},
 draw(s){
  const F=P6_MU0*s.I1*s.I2/(2*Math.PI*s.d/100),gap=s.d*20,x1=300-gap/2,x2=300+gap/2;let out=heading(F>0?'Same direction: the wires attract':F<0?'Opposite directions: the wires repel':'No force without both currents');
  for(const [x,I] of [[x1,s.I1],[x2,s.I2]]){out+=R(x-5,60,10,270,C.amber,'none',3);if(I)out+=arrow(x-22,I>0?260:120,x-22,I>0?120:260,C.amber,2.5,8)+TF(x-30,200,Math.abs(I)+' A',13,C.amber,'end')}
  if(F){const len=clamp(Math.abs(F)*1e6*.8,10,70),dir=F>0?1:-1;out+=arrow(x1+8,330-140,x1+8+dir*len,190,C.coral,3,9)+arrow(x2-8,190,x2-8-dir*len,190,C.coral,3,9)}
  out+=counter(200,334,'force per metre',`${(Math.abs(F)*1e6).toFixed(1)} µN/m`,C.coral,200);
  return {svg:out,phase:F?`F/L = μ₀I₁I₂ / 2πd = ${(Math.abs(F)*1e6).toFixed(1)} µN per metre, ${F>0?'pulling the wires together':'pushing them apart'}. Double the gap and the force halves.`:'With either current at zero there is no force between the wires.'};
 }});

/* ---------- Lesson: induction ---------- */
const P6_A=.03,P6_PHI0=1e-4; // coil radius (m) and peak flux from the magnet (Wb): a model
function P6_dPhi(x){const u=x/P6_A;return -3*P6_PHI0*x/(P6_A*P6_A*Math.pow(1+u*u,2.5))}
SCENE({id:'induction',name:'Electromagnetic induction',tag:'Rerun Faraday: move a magnet through a coil',
 definition:'A changing magnetic field through a coil makes a voltage in it (an induced EMF), equal to the number of turns times the rate of change of magnetic flux. Lenz’s law: the induced current always opposes the change that caused it.',
 example:'Push a magnet into a coil and the meter kicks one way; pull it out and it kicks the other way; hold it still and nothing happens. Move it twice as fast and the kick is twice as big.',
 desc:'A bar magnet moving through a coil connected to a meter, with a plot of the induced EMF against time showing one pulse as it enters and an opposite pulse as it leaves.',
 dur:12,hint:'Choose the speed, the number of turns and which pole leads, then step or run the magnet through the coil.',
 research:'Faraday (1832), Experimental researches in electricity, Phil. Trans. R. Soc. 122; Lenz (1834) for the direction. Flux model: a dipole on the coil’s axis.',
 init:()=>({v:.5,N:200,pole:'N'}),
 ui:[{range:'v',label:'Speed',min:.1,max:1,step:.05,get:s=>s.v,act:'v',show:v=>v.toFixed(2)+' m/s'},{range:'N',label:'Turns',min:50,max:400,step:25,get:s=>s.N,act:'N'},{choose:[['N','North pole first'],['S','South pole first']],label:'Magnet',get:s=>s.pole,act:'pole'}],
 on:{v(s,x){s.v=x},N(s,x){s.N=x},pole(s,x){s.pole=x}},
 trace(s){const T=.6/s.v,n=48,sg=s.pole==='N'?1:-1,fr=[];const hist=[];for(let k=0;k<n;k++){const t=k/(n-1)*T,x=-.3+s.v*t,emf=-s.N*P6_dPhi(x)*s.v*sg;hist.push([t,emf]);fr.push({t,x,emf,hist:hist.slice(),T})}return fr},
 draw(s,f){
  const sg=s.pole==='N'?1:-1,peak=s.N*s.v*.858*P6_PHI0/P6_A;let out=heading('A changing field through the coil induces a voltage');
  // Coil (side view) centred at x=300, y=120; magnet position scale 800 px/m.
  for(let i=0;i<9;i++)out+=`<ellipse cx="${270+i*7.5}" cy="120" rx="6" ry="38" fill="none" stroke="${C.amber}" stroke-width="3"/>`;
  const mx=300+f.x*800;out+=`<g transform="translate(${fmt(mx)} 120)"><rect x="-60" y="-12" width="60" height="24" fill="${sg>0?'#6f8796':C.coral}"/><rect x="0" y="-12" width="60" height="24" fill="${sg>0?C.coral:'#6f8796'}"/></g>`+TBF(mx+45,125,sg>0?'N':'S',13,'#fff')+TBF(mx-45,125,sg>0?'S':'N',13,'#fff');
  const approaching=f.x<0;if(Math.abs(f.emf)>peak*.05)out+=TF(300,178,approaching?'coil repels the approaching magnet':'coil pulls back on the leaving magnet',13,C.coral);
  // Meter
  const g=clamp(f.emf/Math.max(peak,1e-9),-1,1);out+=P('M40 300 A60 60 0 0 1 160 300',C.dark,2)+L(100,300,100+56*Math.sin(g*1.1),300-56*Math.cos(g*1.1),C.coral,3)+Ci(100,300,5,C.dark)+TF(100,330,`${(f.emf*1000).toFixed(0)} mV`,14,C.ink)+P('M266 156 V184 H140 V246 M334 156 V196 H60 V250',C.line,1.5);
  const A=P6_axes(250,215,320,120,{x0:0,x1:f.T,y0:-1.15*peak*1000,y1:1.15*peak*1000,xt:[0,+(f.T/2).toFixed(2),+f.T.toFixed(2)],yt:[-Math.round(peak*1000),0,Math.round(peak*1000)],xl:'time (s)',yl:'EMF (mV)'});out+=A.svg;
  if(f.hist.length>1)out+=P(P6_path(f.hist.map(([t,e])=>[A.X(t),A.Y(e*1000)])),C.blue,2);
  return {svg:out,phase:`EMF = −N dΦ/dt. At ${s.v.toFixed(2)} m/s with ${s.N} turns the peak is about ${(peak*1000).toFixed(0)} mV. Entering and leaving give opposite pulses; double the speed and the pulses are twice as tall and half as long.`};
 }});

SCENE({id:'induction-generator',name:'Generator',tag:'Spinning a coil makes AC',
 definition:'A coil turning in a magnetic field has a flux through it that rises and falls, so it produces an alternating voltage: EMF = N B A ω sin ωt, peaking when the coil’s sides cut the field fastest.',
 example:'A coil of 100 turns, 10 cm square, spinning 50 times a second in a 0.1 T field gives a peak of about 31 V. Mains generators do the same with stronger fields, more turns and huge turbines.',
 desc:'A rectangular coil turning between magnet poles, seen end-on, beside the sine-shaped EMF it produces over time with the current moment marked.',
 dur:10,hint:'Change the speed, turns and field strength and see the peak voltage change. Press Play to turn the coil.',
 research:'Faraday (1831) built the first disc generator; Pixii (1832) the first alternating-current generator.',
 init:()=>({f:50,N:100,B:.1,t:0,playing:false}),
 watch(p){return {f:50,N:100,B:.1,t:p*2}},
 ui:[{range:'f',label:'Turns per second',min:1,max:60,get:s=>s.f,act:'f',show:v=>v+' Hz'},{range:'N',label:'Coil turns',min:10,max:200,step:10,get:s=>s.N,act:'N'},{range:'B',label:'Field',min:.05,max:.5,step:.05,get:s=>s.B,act:'B',show:v=>v.toFixed(2)+' T'},{b:'Play / pause',act:'play'}],
 on:{f(s,v){s.f=v},N(s,v){s.N=v},B(s,v){s.B=v},play(s,a,ctx){s.playing=!s.playing;if(s.playing)ctx.every(50,'tick');return 'keep'},tick(s){if(!s.playing)return 'stop';s.t=(s.t+.02)%2;return 'keep'}},
 draw(s){
  const Aa=.01,peak=s.N*s.B*Aa*2*Math.PI*s.f,ph=s.t*Math.PI*2;let out=heading('A turning coil: flux rises and falls, voltage alternates');
  out+=R(50,90,50,200,C.coral,'none',6)+R(250,90,50,200,'#6f8796','none',6)+TBF(75,195,'N',16,'#fff')+TBF(275,195,'S',16,'#fff');
  for(let k=0;k<4;k++)out+=arrow(104,130+k*40,246,130+k*40,'#c2ccd2',1.2,6);
  const hx=70*Math.cos(ph),hy=70*Math.sin(ph);out+=L(175-hx,190-hy,175+hx,190+hy,C.amber,6)+Ci(175-hx,190-hy,8,C.amber,'#fff')+Ci(175+hx,190+hy,8,C.amber,'#fff')+Ci(175,190,4,C.dark);
  out+=TF(175,320,'coil seen end-on (shown slowed down)',13,C.muted);
  const A=P6_axes(340,80,230,200,{x0:0,x1:2,y0:-1.15*peak,y1:1.15*peak,xt:[0,1,2],yt:[-+peak.toFixed(1),0,+peak.toFixed(1)],xl:'turns of the coil',yl:'EMF (V)'});out+=A.svg;
  const pts=[];for(let u=0;u<=2;u+=.02)pts.push([A.X(u),A.Y(peak*Math.sin(u*2*Math.PI))]);out+=P(P6_path(pts),C.blue,2)+Ci(A.X(s.t),A.Y(peak*Math.sin(ph)),6,C.coral,'#fff');
  return {svg:out,phase:`Peak EMF = NBAω = ${s.N} × ${s.B.toFixed(2)} T × 0.01 m² × 2π × ${s.f} Hz ≈ ${peak.toFixed(2)} V. The voltage is zero when the coil faces the field squarely (most flux, changing least) and largest when it lies along the field.`};
 }});

SCENE({id:'induction-transformer',name:'Transformer',tag:'Trading voltage for current',
 definition:'Two coils on a shared iron core. An alternating current in the primary makes a changing flux that induces a voltage in the secondary: V₂ / V₁ = N₂ / N₁. In an ideal transformer the power is the same on both sides, so the current changes the other way.',
 example:'A 230 V supply into 1000 turns with 50 turns on the secondary gives 11.5 V, enough for a doorbell. Power stations step up to hundreds of thousands of volts so the current, and the heat lost in the cables, is small.',
 desc:'An iron ring with a primary and secondary coil whose turns can be changed, with input and output voltages and currents for alternating or direct current.',
 dur:10,hint:'Change the turns on each coil and the input voltage. Try DC: a steady current makes no changing flux.',
 research:'Faraday (1831) induction ring, his first induction experiment; Gaulard & Gibbs (1882) and Stanley (1886) practical transformers.',
 init:()=>({N1:1000,N2:50,V1:230,ac:true}),
 watch(p){return {N1:500,N2:Math.round((50+1450*smooth(p))/50)*50,V1:230,ac:true}},
 ui:[{range:'N1',label:'Primary turns',min:50,max:2000,step:50,get:s=>s.N1,act:'N1'},{range:'N2',label:'Secondary turns',min:50,max:2000,step:50,get:s=>s.N2,act:'N2'},{range:'V1',label:'Input',min:0,max:240,step:10,get:s=>s.V1,act:'V1',show:v=>v+' V'},{choose:[[1,'AC input'],[0,'DC input']],label:'Supply',get:s=>s.ac?1:0,act:'ac'}],
 on:{N1(s,v){s.N1=v},N2(s,v){s.N2=v},V1(s,v){s.V1=v},ac(s,v){s.ac=Number(v)===1}},
 draw(s){
  const V2=s.ac?s.V1*s.N2/s.N1:0,Pw=60,I1=s.V1?Pw/s.V1:0,I2=V2?Pw/V2:0;let out=heading(s.N2>s.N1?'Step-up: more turns, more volts':s.N2<s.N1?'Step-down: fewer turns, fewer volts':'Equal turns, equal voltage');
  out+=R(180,80,240,220,'none','#7d8a92',18,'stroke-width="26"');
  const coil=(x,n,col)=>{let o='';const k=clamp(Math.round(n/100),2,16);for(let i=0;i<k;i++){const y=100+i*(180/k);o+=`<ellipse cx="${x}" cy="${fmt(y+90/k)}" rx="24" ry="${fmt(Math.min(9,80/k))}" fill="none" stroke="${col}" stroke-width="3"/>`}return o};
  out+=coil(180,s.N1,C.blue)+coil(420,s.N2,C.coral);
  out+=TF(120,190,`${s.N1} turns`,13,C.blue,'end')+TF(480,190,`${s.N2} turns`,13,C.coral,'start');
  out+=counter(20,250,'input',`${s.V1} V ${s.ac?'AC':'DC'}`,C.blue,130)+counter(450,250,'output',`${V2.toFixed(1)} V`,C.coral,130);
  if(s.ac&&V2)out+=TF(85,320,`for 60 W: ${I1.toFixed(2)} A in`,13,C.muted)+TF(515,320,`${I2.toFixed(2)} A out`,13,C.muted);
  return {svg:out,phase:s.ac?`V₂ = V₁ × N₂/N₁ = ${s.V1} × ${s.N2}/${s.N1} = ${V2.toFixed(1)} V. For the same 60 W, a higher voltage needs a smaller current, which is why power lines use very high voltages. (Ideal transformer, no losses.)`:'With a steady (DC) input the flux in the core does not change, so after the moment of switching on nothing is induced: the output is 0 V.'};
 }});

/* ---------- Lesson: electromagnetic-waves ---------- */
function P6_wavePts(lam,t,fn){const pts=[];for(let k=0;k<=160;k++){const x=k/160*4;pts.push([x,fn(Math.sin(2*Math.PI*(x/lam-t)))])}return pts}
SCENE({id:'electromagnetic-waves',name:'Electromagnetic wave',tag:'Fields that keep each other going',
 definition:'A travelling disturbance of electric and magnetic fields: a changing electric field makes a magnetic field and a changing magnetic field makes an electric field, so the pair moves on by itself, at right angles to each other and to the direction of travel.',
 example:'Radio, microwaves, light and X-rays are all the same kind of wave, differing only in wavelength. In empty space they all travel at c = 299 792 458 m/s, so wavelength × frequency = c.',
 desc:'An electric field wave in one plane and a magnetic field wave in the plane at right angles, travelling together along an axis; a 3D view can be turned to see the two planes.',
 dur:10,hint:'Change the wavelength and press Play. Frequency always adjusts so that wavelength × frequency = c. Open 3D to turn the wave.',
 research:'Maxwell (1865), A dynamical theory of the electromagnetic field, Phil. Trans. R. Soc. 155; confirmed by Hertz (1887–1888).',
 init:()=>({lam:1.5,t:0,playing:false}),
 watch(p){return {lam:1.5,t:p*3}},
 ui:[{range:'lam',label:'Wavelength',min:.5,max:3,step:.1,get:s=>s.lam,act:'lam',show:v=>v.toFixed(1)+' m'},{b:'Play / pause',act:'play'}],
 on:{lam(s,v){s.lam=v},play(s,a,ctx){s.playing=!s.playing;if(s.playing)ctx.every(50,'tick');return 'keep'},tick(s){if(!s.playing)return 'stop';s.t=(s.t+.03)%100;return 'keep'}},
 draw(s){
  const O=(x,y,z)=>[60+x*120+z*55,210-y*85+z*40];let out=heading('E and B at right angles, moving together');
  out+=arrow(...O(0,0,0),...O(4.1,0,0),C.dark,2,8)+TF(590,O(4.1,0,0)[1]+22,'direction of travel →',13,C.muted,'end');
  const E=P6_wavePts(s.lam,s.t,v=>v),B=P6_wavePts(s.lam,s.t,v=>v);
  out+=P(P6_path(E.map(([x,v])=>O(x,v,0))),C.blue,2.4)+P(P6_path(B.map(([x,v])=>O(x,0,v*.9))),C.coral,2.4);
  for(let k=0;k<=16;k++){const x=k/4,v=Math.sin(2*Math.PI*(x/s.lam-s.t));out+=L(...O(x,0,0),...O(x,v,0),C.blue,1,'opacity=".5"')+L(...O(x,0,0),...O(x,0,v*.9),C.coral,1,'opacity=".5"')}
  out+=TBF(70,100,'E (electric)',14,C.blue,'start')+TBF(70,350,'B (magnetic)',14,C.coral,'start');
  const f=P6_C/s.lam;out+=counter(440,326,'frequency',`${(f/1e6).toFixed(0)} MHz`,C.ink,130);
  return {svg:out,phase:`Wavelength ${s.lam.toFixed(1)} m, so frequency = c / λ = ${(f/1e6).toFixed(0)} MHz (a radio wave). E and B rise and fall together, each at right angles to the other and to the direction of travel.`};
 },
 three(s,f,X,project){
  const Pj=project([[0,-1.2,-1.2],[4,1.2,1.2]]);let out=line3([0,0,0],[4.2,0,0],Pj,C.dark,2);
  const E=P6_wavePts(s.lam,s.t,v=>v);out+=P(P6_path(E.map(([x,v])=>Pj([x,0,v]))),C.blue,2.4)+P(P6_path(E.map(([x,v])=>Pj([x,v*.9,0]))),C.coral,2.4);
  for(let k=0;k<=16;k++){const x=k/4,v=Math.sin(2*Math.PI*(x/s.lam-s.t));out+=line3([x,0,0],[x,0,v],Pj,C.blue,1)+line3([x,0,0],[x,v*.9,0],Pj,C.coral,1)}
  return {svg:out,title:'Electromagnetic wave in 3D',caption:'Blue: electric field in the vertical plane. Coral: magnetic field in the horizontal plane. Both travel along the axis.'};
 }});

SCENE({id:'electromagnetic-waves-maxwell',name:'Maxwell’s speed of light',tag:'Light from electrical measurements',
 definition:'Maxwell’s equations predict waves travelling at 1/√(μ₀ε₀), a speed built only from electrical and magnetic constants measured on a laboratory bench. It came out equal to the measured speed of light.',
 example:'μ₀ ≈ 4π × 10⁻⁷ and ε₀ = 8.854 × 10⁻¹² give 2.998 × 10⁸ m/s. Maxwell wrote that light must be an electromagnetic disturbance.',
 desc:'The calculation of 1/√(μ₀ε₀) step by step, then compared on a bar chart with measurements of the speed of light by Fizeau and Foucault and the electrical ratio of Weber and Kohlrausch.',
 dur:12,hint:'Step through the calculation. Then try a different ε₀ to see how closely nature ties electricity to light.',
 research:'Maxwell (1865); Weber & Kohlrausch (1856) measured the ratio of electrical units, about 3.1 × 10⁸ m/s; Fizeau (1849) and Foucault (1862) measured light.',
 init:()=>({k:1}),
 ui:[{range:'k',label:'What if ε₀ were ×',min:.5,max:2,step:.05,get:s=>s.k,act:'k',show:v=>v.toFixed(2)}],
 on:{k(s,v){s.k=v;return 'end'}},
 trace(s){return [{st:0,say:'Start with two constants measured with coils and capacitors, nothing to do with light: μ₀ (magnetic) and ε₀ (electric).'},{st:1,say:'Multiply them: μ₀ε₀ ≈ 1.11 × 10⁻¹⁷ s²/m². The units are those of 1 / speed².'},{st:2,say:'Take the square root and invert it: a speed.'},{st:3,say:'Compare with measured light speeds. They agree within the errors of the time: light is an electromagnetic wave.'}]},
 draw(s,f){
  const eps=P6_EPS0*s.k,v=1/Math.sqrt(P6_MU0*eps);let out=heading('A speed from bench-top electricity');
  const rows=[['μ₀ ≈ 4π × 10⁻⁷ ≈ 1.257 × 10⁻⁶ T m/A',0],[`ε₀ = ${P6_sci(eps,3)} F/m${s.k!==1?' (changed)':''}`,0],[`μ₀ε₀ = ${P6_sci(P6_MU0*eps,3)} s²/m²`,1],[`1/√(μ₀ε₀) = ${P6_sci(v,3)} m/s`,2]];
  rows.forEach(([t,k],i)=>{if(f.st>=k)out+=R(40,58+i*40,330,32,f.st===k&&k?C.amberp:'#fff',C.grid,6)+TMF(52,79+i*40,t,14,C.ink,'start')});
  if(f.st>=3){const A=P6_axes(410,64,170,200,{x0:0,x1:4,y0:2.8,y1:3.3,yt:[2.8,2.9,3,3.1,3.2,3.3],fy:v=>v.toFixed(1)});out+=A.svg;
   [['Fizeau',3.13,C.blue],['Foucault',2.98,C.blue],['W & K',3.107,C.purple],['1/√μ₀ε₀',v/1e8,C.coral]].forEach(([n,val,col],i)=>{const x=A.X(i+.5),y=A.Y(clamp(val,2.8,3.3));out+=R(x-14,y,28,A.Y(2.8)-y,col,'none',3)+TF(x,286+((i%2)*14),n,13,C.ink)});
   out+=TF(495,56,'× 10⁸ m/s',13,C.muted)}
  out+=TF(205,250,'c measured today: 299 792 458 m/s (exact by definition)',13,C.muted);
  return {svg:out,phase:f.st<3?f.say:s.k===1?f.say:`With ε₀ × ${s.k.toFixed(2)} the predicted speed would be ${P6_sci(v,3)} m/s, no longer matching light. The match is not a coincidence: light is the electromagnetic wave.`};
 }});

SCENE({id:'electromagnetic-waves-hertz',name:'Hertz’s experiment',tag:'Rerun Hertz: find the quiet spots',
 definition:'Hertz made electromagnetic waves with a spark gap and detected them with a small loop that sparked when a wave arrived. Reflecting them from a metal sheet made a standing wave whose nodes are half a wavelength apart.',
 example:'If the quiet spots, where the receiver will not spark, are 1.5 m apart, the wavelength is 3 m. Times the known frequency, that gives the wave’s speed, the speed of light.',
 desc:'A spark-gap transmitter on the left, a metal reflector on the right and a receiver loop that can be moved between them; its spark brightness follows the standing wave, and marked nodes give the wavelength.',
 dur:13,hint:'Move the receiver, mark each place where it goes quiet, and read off the wavelength and speed from the spacing.',
 research:'Hertz (1887–1888) experiments, collected as Electric Waves (1893, trans. Jones). Frequencies here are illustrative.',
 init:()=>({f:100,x:1.2,marks:[]}),
 watch(p){const lam=3,x=.1+5.8*p,marks=[0,1.5,3,4.5].filter(m=>m>0&&m<x).concat(p>.98?[]:[]);return {f:100,x,marks}},
 ui:[{range:'f',label:'Frequency',min:60,max:300,step:10,get:s=>s.f,act:'f',show:v=>v+' MHz'},{range:'x',label:'Receiver distance from reflector',min:.1,max:6,step:.05,get:s=>s.x,act:'x',show:v=>v.toFixed(2)+' m'},{b:'Mark a quiet spot here',act:'mark'},{b:'Clear marks',act:'clear'}],
 on:{f(s,v){s.f=v;s.marks=[]},x(s,v){s.x=v},mark(s){s.marks=s.marks.concat(+s.x.toFixed(2)).sort((a,b)=>a-b)},clear(s){s.marks=[]}},
 draw(s){
  const lam=P6_C/(s.f*1e6),amp=x=>Math.abs(Math.sin(2*Math.PI*x/lam));let out=heading('A standing wave between the spark gap and a metal sheet');
  const X0=540,sc=78;const px=x=>X0-x*sc;out+=R(X0,70,16,220,'#8a969d','none',3)+TF(X0+8,62,'reflector',13,C.muted);
  out+=R(18,160,40,40,'#fff',C.dark,6)+TF(38,215,'spark gap',13,C.muted)+P('M30 180 l8 -8 l4 14 l8 -10',C.amber,2);
  const pts=[],neg=[];for(let x=0;x<=6.1;x+=.02){pts.push([px(x),180-70*amp(x)]);neg.push([px(x),180+70*amp(x)])}out+=P(P6_path(pts),C.purple,1.6)+P(P6_path(neg),C.purple,1.6);
  s.marks.forEach(m=>out+=L(px(m),110,px(m),250,C.green,2,'stroke-dasharray="4 3"'));
  const a=amp(s.x),rx=px(s.x);out+=Ci(rx,180,22,'none',C.dark,'stroke-width="3"')+(a>.15?Ci(rx,158,6+10*a,'#fff2a8','none',`opacity="${(.4+.6*a).toFixed(2)}"`)+Ci(rx,158,3,C.amber):'');
  let say,est='';if(s.marks.length>=2){const d=[];for(let i=1;i<s.marks.length;i++)d.push(s.marks[i]-s.marks[i-1]);const sp=d.reduce((a,b)=>a+b,0)/d.length,l=2*sp,c=l*s.f*1e6;est=`spacing ${sp.toFixed(2)} m → λ ≈ ${l.toFixed(2)} m → speed ≈ ${P6_sci(c,2)} m/s`}
  out+=R(30,300,500,58,'#fff',C.grid,8)+TF(280,322,`receiver ${a>.15?'sparks':'is quiet'} (${Math.round(a*100)} % of the maximum)`,14,a>.15?C.amber:C.green)+TF(280,344,est||'mark two or more quiet spots',13,C.ink);
  return {svg:out,phase:est?`Quiet spots are half a wavelength apart. Your marks give ${est}. Hertz did this with metre-scale waves and found speeds close to the speed of light.`:`The reflected wave meets the outgoing one and forms nodes every ${(lam/2).toFixed(2)} m, starting at the metal sheet. Find them with the receiver.`};
 }});

const P6_BANDS=[[3,-3,'Radio','#8fb7d9','broadcast, Wi-Fi at the short end'],[-3,-3.52,'Microwave','#9fc9a8','ovens, radar, phone links'],[-3.52,-6.12,'Infrared','#e7b28f','warm objects, remote controls'],[-6.12,-6.42,'Visible','#fff','the narrow band our eyes see'],[-6.42,-8,'Ultraviolet','#c1a6e2','sunburn, sterilising lamps'],[-8,-11,'X-ray','#b0b8bf','medical images'],[-11,-12.5,'Gamma','#8d959b','radioactive decay, cosmic sources']];
function P6_rgbOfNm(nm){let r=0,g=0,b=0;if(nm<440){r=(440-nm)/60;b=1}else if(nm<490){g=(nm-440)/50;b=1}else if(nm<510){g=1;b=(510-nm)/20}else if(nm<580){r=(nm-510)/70;g=1}else if(nm<645){r=1;g=(645-nm)/65}else r=1;const f=nm<420?.3+.7*(nm-380)/40:nm>700?.3+.7*(750-nm)/50:1;return '#'+[r,g,b].map(v=>Math.round(255*clamp(v*f,0,1)).toString(16).padStart(2,'0')).join('')}
SCENE({id:'electromagnetic-waves-spectrum',name:'Electromagnetic spectrum',tag:'One kind of wave, many names',
 definition:'The whole range of electromagnetic waves, ordered by wavelength from kilometre-long radio waves to gamma rays smaller than an atomic nucleus. Shorter wavelength means higher frequency and more energy per photon.',
 example:'Visible light is only 380–750 nm, a tiny slice. A 3 GHz microwave has a wavelength of 10 cm; a 0.1 nm X-ray photon carries about 12 000 eV, enough to knock electrons out of atoms.',
 desc:'A logarithmic strip of the spectrum from radio to gamma with a movable marker; readouts show wavelength, frequency, photon energy and typical sources, and the visible band shows its colour.',
 dur:12,hint:'Slide through the spectrum. Watch frequency and photon energy rise as wavelength shrinks; stop in the visible band to see the colour.',
 research:'Herschel (1800) found infrared; Ritter (1801) ultraviolet; Röntgen (1895) X-rays; Villard (1900) gamma rays. Band edges are conventions.',
 init:()=>({e:-6.27}),
 watch(p){return {e:3-15.5*p}},
 ui:[{range:'e',label:'Wavelength (log scale)',min:-12.5,max:3,step:.05,get:s=>s.e,act:'e',show:v=>P6_sci(Math.pow(10,v),1)+' m'}],
 on:{e(s,v){s.e=v}},
 draw(s){
  const lam=Math.pow(10,s.e),f=P6_C/lam,eV=1.23984e-6/lam;const X=e=>40+(3-e)/15.5*520;let out=heading('Same waves, from kilometres to picometres');
  P6_BANDS.forEach(([a,b,n,col])=>{out+=R(X(a),90,X(b)-X(a),56,col,'none',0);});
  for(let nm=380;nm<=750;nm+=10){const e=Math.log10(nm*1e-9);out+=R(X(e),90,Math.max(1,X(Math.log10((nm-10)*1e-9))-X(e)),56,P6_rgbOfNm(nm),'none',0)}
  P6_BANDS.forEach(([a,b,n])=>{const w=X(b)-X(a),c=(X(a)+X(b))/2-(n==='Infrared'?10:0);if(w>n.length*7.4+10)out+=TF(c,124,n,13,C.ink)});
  out+=TF(X(-6.27),76,'visible',13,C.ink);
  [3,0,-3,-6,-9,-12].forEach(e=>out+=L(X(e),146,X(e),152,C.muted,1)+TF(X(e),166,['1 km','1 m','1 mm','1 µm','1 nm','1 pm'][[3,0,-3,-6,-9,-12].indexOf(e)],13,C.muted));
  const mx=X(clamp(s.e,-12.5,3));out+=L(mx,82,mx,154,C.dark,3)+`<polygon points="${fmt(mx)},82 ${fmt(mx-7)},72 ${fmt(mx+7)},72" fill="${C.dark}"/>`;
  const band=P6_BANDS.find(([a,b])=>s.e<=a&&s.e>b)||P6_BANDS[P6_BANDS.length-1];const nm=lam*1e9,vis=nm>=380&&nm<=750;
  out+=counter(40,196,'wavelength',P6_sci(lam,2)+' m',C.ink,170)+counter(220,196,'frequency',P6_sci(f,2)+' Hz',C.ink,170)+counter(400,196,'photon energy',P6_sci(eV,2)+' eV',C.ink,160);
  out+=R(40,262,520,70,vis?P6_rgbOfNm(nm):'#fff',C.grid,10)+TBF(300,290,band[2],17,vis&&nm<450?'#fff':C.ink)+TF(300,316,vis?`${Math.round(nm)} nm: ${band[4]}`:band[4],14,vis&&nm<450?'#fff':C.ink);
  return {svg:out,phase:`λ × f = c for every band. Here f = ${P6_sci(f,2)} Hz and each photon carries ${P6_sci(eV,2)} eV. Band edges are conventions: X-rays and gamma rays overlap and are named by how they are made.`};
 }});
