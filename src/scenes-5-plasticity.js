/* ===================== Brain In Motion · Era 5 · Development and plasticity ===================== */
// Wiring up, critical periods, Hebb and LTP, changing maps, neurogenesis, the adolescent brain.
// Every picture is a pure function of state, frame and X. This era uses no sound.
// Simulated records use seeded generators (B5_rng) and are labelled as simulated, schematic or illustrative.

/* ---- shared helpers ---- */
const B5_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const B5_rng=n=>rng(B5_mix(n));
function B5_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const B5_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const B5_r1=v=>Math.round(v*10)/10;
const B5_r2=v=>Math.round(v*100)/100;
const B5_note=(s,y=370)=>TF(300,y,s,13,C.muted);
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function B5_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
function B5_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col)}
const B5_pick=(v,list,d)=>list.includes(v)?v:d;

/* ===================== Lesson: wiring-up ===================== */
// A growth cone that turns towards the side where it senses more of a chemical. Model: each step the cone
// turns by 0.07 × (percentage difference across the cone) × sin(angle to the source), plus random wobble.
const B5_SRC=[];for(const y of [86,176,266])for(const x of [200,320,440,550])B5_SRC.push([x,y]);
const B5_coneStart=()=>({pts:[[70,176]],ang:0,src:7,steep:6,n:0,done:0});
function B5_coneGrow(s,k){
 for(let i=0;i<k&&!s.done&&s.n<220;i++){
  const [x,y]=s.pts[s.pts.length-1],[sx,sy]=B5_SRC[s.src];
  if(Math.hypot(sx-x,sy-y)<14){s.done=1;break}
  const r=B5_rng(s.n*7+3),phi=Math.atan2(sy-y,sx-x)-s.ang;
  s.ang+=.07*s.steep*Math.sin(phi)+.2*B5_gauss(r);
  let nx=x+7*Math.cos(s.ang),ny=y+7*Math.sin(s.ang);
  if(nx<40||nx>578||ny<58||ny>296){s.ang+=.9;nx=clamp(nx,40,578);ny=clamp(ny,58,296)}
  s.pts.push([nx,ny]);s.n++;
 }
 const [x,y]=s.pts[s.pts.length-1],[sx,sy]=B5_SRC[s.src];if(Math.hypot(sx-x,sy-y)<14)s.done=1;
 return s;
}
SCENE({id:'wiring-up',name:'The growth cone',tag:'Cajal, 1890',
 definition:'In 1890 Santiago Ramón y Cajal saw, in stained spinal cords of chick embryos, a swelling at the tip of each young axon and named it the growth cone. He guessed that it crawled through the embryo, drawn by chemicals from its target. In 1907 Ross Harrison grew pieces of frog embryo in a drop of lymph and watched axons lengthen from their cells, which settled that an axon grows out from its own neuron.',
 example:'A growth cone puts out fine fingers and compares the two sides. If one side meets slightly more of an attractant, the cone turns that way. In 1994 Marc Tessier-Lavigne’s group purified the first such attractant, netrin, which draws axons towards the midline of the spinal cord. Other molecules repel.',
 desc:'A cell body on the left with an axon growing from it. The tip is a growth cone with fine fingers. A green cloud marks a chemical that is strongest at its source. Dotted circles are places the source can be moved to.',
 research:['Ramón y Cajal (1890). À quelle époque apparaissent les expansions des cellules nerveuses de la moëlle épinière du poulet? Anatomischer Anzeiger 5.','Harrison (1910). The outgrowth of the nerve fiber as a mode of protoplasmic movement. Journal of Experimental Zoology 9, 787–846.','Kennedy, Serafini, de la Torre & Tessier-Lavigne (1994). Netrins are diffusible chemotropic factors for commissural axons in the embryonic spinal cord. Cell 78, 425–435.'],
 dur:12,hint:'Press a dotted circle to move the source of the chemical; the axon grows 8 more steps each time. Set the gradient to 0 to see the cone wander.',
 init:B5_coneStart,
 watch(p){const s=B5_coneStart(),n=Math.floor(p*74);s.src=2;for(let i=0;i<n;i++){if(i===26){s.src=11;s.done=0}B5_coneGrow(s,1)}if(n<26)s.src=2;return s},
 ui:[{range:'steep',label:'Difference across the cone (%)',min:0,max:10,get:s=>s.steep,act:'steep'},{b:'Grow 8 more steps',act:'grow'},{b:'Start again',act:'reset'}],
 on:{src(s,v){s.src=clamp(Math.round(+v)||0,0,11);s.done=0;B5_coneGrow(s,8)},grow(s){B5_coneGrow(s,8)},steep(s,v){s.steep=clamp(Math.round(+v)||0,0,10)},reset(s){const k=s.steep;Object.assign(s,B5_coneStart());s.steep=k}},
 draw(s,f,X){
  const [sx,sy]=B5_SRC[s.src],tip=s.pts[s.pts.length-1],d=Math.hypot(sx-tip[0],sy-tip[1]);
  let out=heading(s.done?'The growth cone has reached the source':s.steep===0?'No gradient: the cone wanders':'The growth cone climbs the gradient');
  out+=R(30,48,556,256,'#fff',C.grid,8)+'<clipPath id="b5-cone-clip"><rect x="31" y="49" width="554" height="254" rx="8"/></clipPath>';
  let cloud='';if(s.steep>0)for(const r of [170,125,88,56,30])cloud+=Ci(sx,sy,r,C.green,'none','fill-opacity=".07"');
  out+=G(cloud,'clip-path="url(#b5-cone-clip)"');
  B5_SRC.forEach(([x,y],i)=>{if(i!==s.src)out+=hit(X,'src',i,'Move the source of the chemical here',Ci(x,y,19,'#fff',C.line,'fill-opacity=".01" stroke-dasharray="3 4"')+Ci(x,y,3.5,C.line))});
  out+=Ci(sx,sy,9,C.green,'#fff')+TF(sx,sy+(sy>250?-16:26),'source',13,C.green);
  out+=Ci(52,176,14,C.pale,C.blue)+L(64,176,70,176,C.blue,3.5)+B5_poly(s.pts,C.blue,3.5);
  for(const a of [-1,-.5,0,.5,1])out+=L(tip[0],tip[1],tip[0]+13*Math.cos(s.ang+a),tip[1]+13*Math.sin(s.ang+a),C.coral,2);
  out+=Ci(tip[0],tip[1],5,C.coral,'#fff')+TF(52,208,'neuron',13,C.blue);
  out+=B5_tile(30,312,170,'Steps grown',String(s.n))+B5_tile(215,312,170,'Distance to the source',s.done?'arrived':Math.round(d)+' µm',s.done?C.green:C.ink)+B5_tile(400,312,186,'Difference across the cone',s.steep+'%',C.green);
  out+=B5_note('A model. Scale is illustrative: one step is 7 µm.',372);
  return {svg:out,phase:s.done?'The cone has arrived. In an embryo it would now stop, flatten against its target and start to build a synapse. Move the source to send the axon somewhere else.':
   s.steep===0?'With the same amount of chemical on both sides the cone has nothing to compare. It still advances, but its turns are random.':
   `The side of the cone nearer the source meets about ${s.steep}% more of the chemical, so each step it turns a little that way. The wobble is real: growth cones advance in fits, and a steeper gradient makes the path straighter.`};
 }});

// Sperry's rotated eye. The lens inverts the image; each retinal quadrant keeps its own central connection.
const B5_OPP={up:'down',down:'up',front:'back',back:'front'};
const B5_QUAD=[{up:'D',down:'V',front:'N',back:'T'},{up:'V',down:'D',front:'T',back:'N'}];   // which quadrant sits where: normal, rotated
const B5_AIM={D:'down',V:'up',N:'back',T:'front'},B5_DIRV={up:[0,-1],down:[0,1],front:[1,0],back:[-1,0]};
const B5_DIRN={up:'above',down:'below',front:'in front',back:'behind'},B5_QCOL={D:C.blue,V:C.coral,N:C.green,T:C.amber};
const B5_sperryAim=s=>B5_AIM[B5_QUAD[s.rot?1:0][B5_OPP[s.fly]]];
SCENE({id:'wiring-up-sperry',name:'Sperry’s rotated eye',tag:'Chemoaffinity, 1943–1963',
 definition:'In the 1940s Roger Sperry cut the optic nerve of newts and frogs and turned the eye upside down in its socket. In these animals the nerve regrows. When sight returned, the animals reached the wrong way: for a fly above them they struck downwards, and they never corrected it. Each fibre had grown back to its old place in the brain, whatever the result for the animal. In 1963 Sperry proposed that growing axons and their targets carry matching chemical labels: the chemoaffinity hypothesis.',
 example:'With the eye rotated, light from a fly above lands on the part of the retina that used to look down. Its fibres still report “below”, so the frog strikes below. Practice changes nothing. Later work found graded labels, the ephrins and their Eph receptors (1995), not a separate tag for every cell, and activity then sharpens the map.',
 desc:'Three panels: a frog and a fly with an arrow showing where the frog strikes; the retina as a disc with four coloured quadrants and the spot where the fly’s image lands; and the brain’s visual map, where each colour stands for the direction that the fibres from that quadrant signal.',
 research:['Sperry (1943). Visuomotor coordination in the newt (Triturus viridescens) after regeneration of the optic nerve. Journal of Comparative Neurology 79, 33–55.','Sperry (1963). Chemoaffinity in the orderly growth of nerve fiber patterns and connections. PNAS 50, 703–710.','Cheng, Nakamoto, Bergemann & Flanagan (1995), Cell 82, 371–381, and Drescher et al. (1995), Cell 82, 359–370: graded ephrins in the map from retina to tectum.'],
 dur:12,hint:'Choose a normal or a rotated eye, put the fly in different places, and let weeks pass. Follow the colour from the retina to the brain map to see why the strike goes where it does.',
 init:()=>({rot:1,fly:'up',wk:0}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {rot:k>=2?1:0,fly:['up','front','up','front','down','back'][k],wk:k>=2?(k-2)*8:0}},
 ui:[{choose:[['0','Normal eye'],['1','Eye rotated 180°']],label:'Eye',get:s=>String(s.rot),act:'rot'},{choose:[['up','Above'],['down','Below'],['front','In front'],['back','Behind']],label:'Fly',get:s=>s.fly,act:'fly'},{b:'Wait 4 more weeks',act:'wait'}],
 on:{rot(s,v){s.rot=v==='0'?0:1;s.wk=0},fly(s,v){s.fly=B5_pick(v,['up','down','front','back'],'up')},wait(s){s.wk=Math.min(104,s.wk+4)}},
 draw(s,f,X){
  const aim=B5_sperryAim(s),ok=aim===s.fly,pos=B5_OPP[s.fly],q=B5_QUAD[s.rot?1:0],hitQ=q[pos];
  let out=heading(ok?'Normal eye: the strike goes to the fly':'Rotated eye: the strike goes the opposite way');
  // frog and fly
  out+=R(18,48,186,214,'#fff',C.grid,8)+TBF(111,68,'What the frog does',13,C.ink);
  const fx=111,fy=166,fv=B5_DIRV[s.fly],av=B5_DIRV[aim];
  out+=`<ellipse cx="${fx}" cy="${fy}" rx="26" ry="17" fill="${C.greenp}" stroke="${C.green}" stroke-width="2"/>`+Ci(fx+17,fy-9,5,'#fff',C.green)+TF(fx-2,fy+5,'frog',13,C.green);
  out+=arrow(fx+av[0]*30,fy+av[1]*21,fx+av[0]*62,fy+av[1]*52,ok?C.green:C.coral,3)+TF(fx+av[0]*40+(av[0]?0:36),fy+av[1]*38+(av[0]?-10:4),'strike',13,ok?C.green:C.coral);
  out+=Ci(fx+fv[0]*72,fy+fv[1]*62,6,C.ink)+TF(fx+fv[0]*72+(fv[0]?0:-22),fy+fv[1]*62+(fv[0]?-12:4),'fly',13,C.ink);
  out+=TF(111,252,'The frog faces right.',13,C.muted);
  // retina
  out+=R(212,48,180,214,'#fff',C.grid,8)+TBF(302,68,s.rot?'Retina, rotated':'Retina',13,C.ink);
  const cx=302,cy=160,rr=56,ang={front:0,down:90,back:180,up:270};
  for(const k of ['up','down','front','back']){const a0=(ang[k]-45)*Math.PI/180,a1=(ang[k]+45)*Math.PI/180,am=ang[k]*Math.PI/180,act=k===pos;
   out+=`<path d="M${cx} ${cy}L${fmt(cx+rr*Math.cos(a0))} ${fmt(cy+rr*Math.sin(a0))}A${rr} ${rr} 0 0 1 ${fmt(cx+rr*Math.cos(a1))} ${fmt(cy+rr*Math.sin(a1))}Z" fill="${B5_QCOL[q[k]]}" fill-opacity="${act?1:.3}" stroke="#fff" stroke-width="2"/>`+TBF(cx+rr*.62*Math.cos(am),cy+rr*.62*Math.sin(am)+5,q[k],14,act?'#fff':C.ink)}
  const iv=B5_DIRV[pos];out+=Ci(cx+iv[0]*rr*.3,cy+iv[1]*rr*.3,4.5,'#fff',C.ink);
  out+=TF(302,236,'The lens inverts: the image',13,C.muted)+TF(302,252,`lands ${pos==='up'?'at the top':pos==='down'?'at the bottom':pos==='front'?'on the nose side':'on the far side'}, on ${hitQ}.`,13,C.muted);
  // brain map
  out+=R(400,48,182,214,'#fff',C.grid,8)+TBF(491,68,'Brain map (tectum)',13,C.ink);
  ['D','V','N','T'].forEach((k,i)=>{const act=k===hitQ,y=82+i*42;out+=R(412,y,158,34,act?B5_QCOL[k]:'#fff',B5_QCOL[k],7)+TF(491,y+22,`${k} fibres: aim ${B5_DIRN[B5_AIM[k]]}`,13,act?'#fff':C.ink,'middle',act?'font-weight="700"':'')});
  out+=TF(491,256,'Fibres keep their old places.',13,C.muted);
  out+=B5_tile(18,270,186,'The fly is',B5_DIRN[s.fly],C.ink)+B5_tile(212,270,180,'The frog strikes',B5_DIRN[aim],ok?C.green:C.coral)+B5_tile(400,270,182,'Weeks since surgery',s.rot?String(s.wk):'no surgery',C.ink);
  out+=TF(300,338,'D dorsal (top) · V ventral · N nasal (nose side) · T temporal',13,C.muted);
  out+=B5_note('Schematic. The eye is drawn from the side of the head, nose to the right.',360);
  return {svg:out,phase:ok?`The image of the fly lands on quadrant ${hitQ}, whose fibres end where the brain map means “${B5_DIRN[aim]}”. Seeing and striking agree, as they do in an untouched animal.`:
   `The fly is ${B5_DIRN[s.fly]}, but after the rotation its image lands on quadrant ${hitQ}, whose fibres still end where the map means “${B5_DIRN[aim]}”. ${s.wk>=8?`After ${s.wk} weeks of missed flies the frog still strikes ${B5_DIRN[aim]}: the wiring was set by matching labels, not learned by practice.`:'If connections were learned by trial and error, the error should fade. Let some weeks pass and test again.'}`};
 }});

// Trophic support. Twenty neurons are born; the target supplies enough factor for only some of them. Counts are illustrative.
const B5_NGF_ORDER=shuffled(range(20),5),B5_NGF_T=[2,12,15];
const B5_ngfSurv=s=>s.ngf===0?1:s.ngf===2?19:B5_NGF_T[s.target];
const B5_NGF_TN=['limb bud removed','normal limb','extra limb grafted'];
SCENE({id:'wiring-up-ngf',name:'Too many neurons, and a factor that saves some',tag:'Hamburger and Levi-Montalcini, 1949–1954',
 definition:'An embryo makes more neurons than it keeps. Viktor Hamburger and Rita Levi-Montalcini showed in chick embryos that many neurons die during normal development, that more die if the limb they would supply is removed, and that fewer die if an extra limb is grafted on. The target must supply something the neurons need. In the early 1950s they found it: a mouse tumour grafted into a chick embryo released a substance that made sensory and sympathetic nerve cells grow hugely. It was named nerve growth factor (NGF).',
 example:'Stanley Cohen purified NGF. An antibody against it, given to newborn mice, removed almost all their sympathetic neurons, which showed that the neurons depend on it in life. In chick embryos about 40% of spinal motor neurons die in normal development (they rely on other factors, not NGF). This death is orderly and is part of matching neurons to their targets.',
 desc:'Twenty neurons in a ganglion on the left send axons to a target on the right. The target releases a limited amount of a survival factor, drawn as green dots. Neurons that take up enough survive; the others are shown as faint outlines.',
 research:['Hamburger & Levi-Montalcini (1949). Proliferation, differentiation and degeneration in the spinal ganglia of the chick embryo under normal and experimental conditions. Journal of Experimental Zoology 111, 457–501.','Levi-Montalcini & Hamburger (1951). Journal of Experimental Zoology 116, 321–361 (the mouse tumour). Cohen (1960). PNAS 46, 302–311 (purification and the antiserum). Nobel Prize 1986: Levi-Montalcini and Cohen.','Hamburger (1975). Journal of Comparative Neurology 160, 535–546; Hollyday & Hamburger (1976). Journal of Comparative Neurology 170, 311–320: motor neuron death, and its reduction by an extra limb.'],
 dur:11,hint:'Change the size of the target, then add NGF or the antibody against it. Step through and compare how many of the 20 neurons survive.',
 init:()=>({target:1,ngf:1}),
 trace(s){const n=B5_ngfSurv(s),lost=20-n;return [
  {k:0,say:'Twenty young neurons have been born in this ganglion. That is more than the adult animal will have.'},
  {k:1,say:`Each sends an axon to the target (${B5_NGF_TN[s.target]}). The target releases a small supply of a survival factor, and the axon endings take it up and carry it back to the cell body.`},
  {k:2,say:s.ngf===2?'Extra NGF has been supplied, so nearly every neuron gets enough, however small the target.':s.ngf===0?'The antibody binds the NGF before the axons can take it up. Almost no neuron gets enough.':`There is enough for about ${n} neurons. The ones marked green took up enough; the pale ones did not.`},
  {k:3,say:`${n} of 20 survive and ${lost} are lost (${Math.round(lost/20*100)}%). The losers shrink and are cleared away without damage to their neighbours. ${s.ngf===1&&s.target===1?'Losing some neurons is the normal way to fit their number to the size of the target.':s.ngf===1&&s.target===0?'With no target, nearly all die: the result of Hamburger’s limb-bud removals.':s.ngf===1?'A larger target supports more neurons, as Hollyday and Hamburger found with an extra limb.':s.ngf===2?'This is how NGF was recognised: ganglia given extra factor keep cells that would have died, and grow.':'Cohen and Levi-Montalcini’s antiserum had this effect on the sympathetic ganglia of newborn mice.'}`}]},
 ui:[{choose:[['0','Limb bud removed'],['1','Normal limb'],['2','Extra limb']],label:'Target',get:s=>String(s.target),act:'target'},{choose:[['1','No treatment'],['2','NGF added'],['0','Antibody to NGF']],label:'Treatment',get:s=>String(s.ngf),act:'ngf'}],
 on:{target(s,v){s.target=clamp(Math.round(+v)||0,0,2)},ngf(s,v){s.ngf=clamp(Math.round(+v)||0,0,2)}},
 draw(s,f,X){
  const k=f?f.k:3,n=B5_ngfSurv(s),th=[40,120,196][s.target],ty=160-th/2,alive=new Set(B5_NGF_ORDER.slice(0,n));
  let out=heading(k===0?'More neurons than will be kept':k===1?'Axons reach the target':k===2?'A limited supply of survival factor':`${n} of 20 neurons survive`);
  out+=R(30,48,180,226,C.pale,'none',16)+TF(120,292,'ganglion: 20 neurons',13,C.blue);
  out+=R(470,ty,96,th,C.amberp,C.amber,10)+TF(518,ty+th+18,'target',13,C.amber)+TF(518,ty+th+34,B5_NGF_TN[s.target],13,C.muted);
  for(let i=0;i<20;i++){const cx=60+(i%4)*40,cy=72+Math.floor(i/4)*44,ok=alive.has(i),gone=k===3&&!ok,tyy=ty+8+(i+.5)*(th-16)/20;
   if(k>=1&&!gone)out+=L(cx+10,cy,470,tyy,k>=2&&ok?C.green:C.line,k>=2&&ok?2:1.4);
   out+=gone?Ci(cx,cy,9,'#fff',C.line,'stroke-dasharray="3 3"'):Ci(cx,cy,10,k>=2?(ok?C.green:'#fff'):C.blue,k>=2&&!ok?C.line:'none')}
  if(k>=1){const nd=[3,12,15][s.target];for(let j=0;j<nd;j++)out+=Ci(476+(j%3)*10-22,ty+12+Math.floor(j/3)*((th-20)/Math.max(1,Math.ceil(nd/3)-1||1)),3.2,C.green)}
  if(k>=1&&s.ngf===2){const r=B5_rng(41);for(let j=0;j<16;j++)out+=Ci(225+r()*200,60+r()*200,3.2,C.green);out+=TF(330,292,'NGF added',13,C.green)}
  if(k>=1&&s.ngf===0){for(let j=0;j<6;j++)out+=TBF(436-(j%2)*16,ty+16+j*((th-20)/6),'Y',14,C.purple);out+=TF(330,292,'antibody binds the NGF',13,C.purple)}
  out+=B5_tile(30,312,170,'Neurons born','20')+B5_tile(215,312,170,'Survive',k>=3?String(n):k>=2?'about '+n:'not yet known',C.green)+B5_tile(400,312,186,'Lost',k>=3?`${20-n} (${Math.round((20-n)/20*100)}%)`:'…',C.coral);
  out+=B5_note('Schematic: work on different ganglia and species is drawn on one. Counts are illustrative.',372);
  return {svg:out,phase:f?f.say:''};
 }});

// Retinal waves and eye-specific layers. Each target cell starts with mixed input; a wave in one eye strengthens
// that eye's synapses in proportion to the square of their present strength, and the two eyes' strengths sum to 1.
function B5_segInit(){const r=B5_rng(77);return range(10).map(i=>clamp(.5+(i<5?.06:-.06)+.03*B5_gauss(r),.35,.65))}
function B5_segWave(w,j){const left=j%2===0;return w.map(a=>{let l=a,rr=1-a;if(left)l+=1.5*l*l;else rr+=1.5*rr*rr;return l/(l+rr)})}
const B5_segIdx=w=>sum(w.map(a=>Math.abs(2*a-1)))/w.length;
function B5_segRun(n){let w=B5_segInit();const h=[B5_segIdx(w)];for(let j=0;j<n;j++){w=B5_segWave(w,j);if(j%4===3)h.push(B5_segIdx(w))}return {w,h}}
const B5_segStart=()=>({w:B5_segInit(),hist:[B5_segIdx(B5_segInit())],n:0,ttx:0});
SCENE({id:'wiring-up-activity',name:'Activity sorts the connections',tag:'Carla Shatz and retinal waves, 1988–1991',
 definition:'Chemical labels bring axons to roughly the right place. Activity does the fine sorting. In the thalamus, fibres from the two eyes at first overlap and then separate into layers, one eye to each layer. This happens before birth, in the dark. Carla Shatz’s group found that the unborn retina makes its own activity: waves of firing sweep across it, so that neighbouring cells in one eye fire together and the two eyes fire apart.',
 example:'When Shatz and Michael Stryker silenced nerve impulses in fetal cats with tetrodotoxin, the fibres from the two eyes stayed mixed. Shatz summed up the rule in 1992 as “cells that fire together wire together”. The phrase is often credited to Donald Hebb, who proposed the idea but never wrote those words.',
 desc:'Two eyes on the left send fibres to a column of ten target cells. Each cell is a bar split into blue for the left eye’s share of its input and red for the right eye’s. A graph on the right shows how fully the two eyes have separated as waves pass.',
 research:['Shatz & Stryker (1988). Prenatal tetrodotoxin infusion blocks segregation of retinogeniculate afferents. Science 242, 87–89.','Meister, Wong, Baylor & Shatz (1991). Synchronous bursts of action potentials in ganglion cells of the developing mammalian retina. Science 252, 939–943.','Galli & Maffei (1988). Spontaneous impulse activity of rat retinal ganglion cells in prenatal life. Science 242, 90–91. The phrase: Shatz (1992). The developing brain. Scientific American 267(3), 60–67.'],
 dur:11,hint:'Send waves through the eyes and watch each target cell settle on one eye. Then start again with activity blocked.',
 init:B5_segStart,
 watch(p){const n=Math.min(7,Math.floor(p*8))*4,q=B5_segRun(n);return {w:q.w,hist:q.h,n,ttx:0}},
 ui:[{b:'Send 4 waves',act:'wave'},{choose:[['0','Retinal waves'],['1','Activity blocked']],label:'Condition',get:s=>String(s.ttx),act:'ttx'},{b:'Start again',act:'reset'}],
 on:{wave(s){if(s.hist.length>8)return;if(!s.ttx)for(let j=0;j<4;j++)s.w=B5_segWave(s.w,s.n+j);s.n+=4;s.hist.push(B5_segIdx(s.w))},ttx(s,v){const t=v==='1'?1:0;Object.assign(s,B5_segStart());s.ttx=t},reset(s){const t=s.ttx;Object.assign(s,B5_segStart());s.ttx=t}},
 draw(s,f,X){
  const idx=B5_segIdx(s.w),sorted=idx>.9,left=s.n>0&&!s.ttx?(s.n-1)%2===0:null;
  let out=heading(s.ttx?'No activity: the two eyes stay mixed':sorted?'Each cell now listens to one eye':s.n?'Waves sort the fibres by eye':'Before the waves: mixed input');
  const eye=(y,lab,col,on)=>Ci(78,y,36,'#fff',col)+(on?`<path d="M${78-20} ${y-30}Q${78+8} ${y} ${78-20} ${y+30}L${78-4} ${y+33}Q${78+26} ${y} ${78-4} ${y-33}Z" fill="${col}" fill-opacity=".55"/>`:'')+TF(78,y+54,lab,13,col)+(s.ttx?TF(78,y+5,'silent',13,C.muted):on?'':TF(78,y+5,s.n?'quiet':'',13,C.muted));
  out+=eye(104,'left eye',C.blue,left===true)+eye(236,'right eye',C.coral,left===false);
  out+=TBF(260,62,'Target cells in the thalamus',13,C.ink);
  s.w.forEach((a,i)=>{const y=74+i*22;out+=L(114,104,196,y+8,C.blue,.6+2*a)+L(114,236,196,y+8,C.coral,.6+2*(1-a));out+=R(200,y,120*a,16,C.blue,'none',3)+R(200+120*a,y,120*(1-a),16,C.coral,'none',3)});
  out+=TF(260,310,'blue: left eye’s share of the input',13,C.blue)+TF(260,326,'red: right eye’s share',13,C.coral);
  const pl=B5_plot(394,74,176,170,[0,32],[0,1],{xt:[[0,'0'],[16,'16'],[32,'32']],yt:[[0,'0'],[1,'1']],xl:'waves so far'});out+=pl.svg+TF(394,62,'separation of the eyes',13,C.muted,'start');
  out+=B5_poly(s.hist.map((v,i)=>[pl.X(i*4),pl.Y(v)]),s.ttx?C.muted:C.green,2.6);s.hist.forEach((v,i)=>{out+=Ci(pl.X(i*4),pl.Y(v),3.5,s.ttx?C.muted:C.green)});
  out+=B5_tile(394,292,176,'Separation (0 to 1)',fmt(B5_r2(idx)),s.ttx?C.muted:C.green);
  out+=B5_note('A model of the rule, not a record. Time is counted in waves'+(s.ttx?'; here none can fire.':'.'),360);
  return {svg:out,phase:s.ttx?'Tetrodotoxin stops nerve impulses, so no wave reaches the target cells. Nothing tells the fibres of one eye apart from the other’s, and the input stays mixed, as Shatz and Stryker found.':
   s.n===0?'Every target cell receives fibres from both eyes in nearly equal amounts. A small head start, here for the left eye at the top and the right eye at the bottom, is all the chemical cues provide.':
   sorted?'The cells have sorted into two groups, one for each eye. No light was needed: the pattern in the retina’s own activity carried the information about which fibres belong together.':
   `A wave has just crossed the ${left?'left':'right'} eye. Its fibres fired together and drove the target cells, so their synapses grew, most where they were already strongest. The other eye was silent and lost ground. Separation is ${fmt(B5_r2(idx))} of 1.`};
 }});

/* ===================== Lesson: critical-periods ===================== */
// Ocular dominance in seven groups (1 = driven only by one eye, 7 = only by the other). Percentages are illustrative.
const B5_OD_N=[10,12,15,26,15,12,10],B5_OD_S=[0,0,0,0,1,1,98];
function B5_odHist(x,y,w,h,vals,ref,o={}){
 const bw=w/7,Y=v=>y+h-v/100*h;let out=R(x,y,w,h,'#fff',C.grid,4);
 vals.forEach((v,i)=>{out+=R(x+i*bw+3,Y(v),bw-6,y+h-Y(v),o.col||C.blue,'none',2);if(ref)out+=R(x+i*bw+3,Y(ref[i]),bw-6,y+h-Y(ref[i]),'none',C.muted,2,'stroke-dasharray="4 3" stroke-width="1.4"');out+=TF(x+i*bw+bw/2,y+h+16,i+1,13,C.muted)});
 if(o.left)out+=TF(x,y+h+33,o.left,13,o.lc||C.muted,'start');if(o.right)out+=TF(x+w,y+h+33,o.right,13,o.rc||C.muted,'end');
 if(o.title)out+=TF(x,y-7,o.title,13,C.muted,'start');
 return out;
}
// Sensitivity of the kitten's cortex to closing one eye, by age in weeks (peak = 1), after Hubel & Wiesel (1970).
const B5_sens=a=>a<3?0:a<4.5?(a-3)/1.5:Math.exp(-(a-4.5)/3);
function B5_mdEffect(start,dur){let q=0;for(let a=start;a<start+dur-1e-9;a+=.1)q+=B5_sens(a+.05)*.1;return 1-Math.exp(-3*q)}
const B5_mdVals=e=>B5_OD_N.map((v,i)=>B5_r1(lerp(v,B5_OD_S[i],e)));
SCENE({id:'critical-periods',name:'One eye closed',tag:'Wiesel and Hubel, 1963',
 definition:'A critical period is a limited time in development when experience has a specially strong and lasting effect on a circuit. In 1963 Torsten Wiesel and David Hubel closed the lids of one eye of kittens, by stitching under anaesthetic, for their first two to three months. When the eye was reopened it was healthy, but almost no cell in the visual cortex responded to it; the cortex had been given over to the other eye. The same closure in an adult cat, even for much longer, changed little.',
 example:'In a normal cat most cortical cells respond to both eyes. Hubel and Wiesel later found the sensitive time: it begins near 4 weeks of age, when a few days of closure are enough, and has faded by about 3 months. They shared the 1981 Nobel Prize with Roger Sperry. Adult plasticity is reduced, not absent.',
 desc:'A time line of the cat’s first year with a curve showing how sensitive the cortex is to closing one eye, and a red bar for the time the eye is closed. Below, a histogram sorts cortical cells into seven groups, from cells driven only by the closed eye to cells driven only by the open eye, with the normal pattern as a dashed outline.',
 research:['Wiesel & Hubel (1963). Single-cell responses in striate cortex of kittens deprived of vision in one eye. Journal of Neurophysiology 26, 1003–1017.','Hubel & Wiesel (1970). The period of susceptibility to the physiological effects of unilateral eye closure in kittens. Journal of Physiology 206, 419–436.','Nobel Prize in Physiology or Medicine 1981: Hubel and Wiesel (half), Sperry (half).'],
 dur:12,hint:'Move the start of the closure and its length, or use the three presets. Compare the filled bars with the dashed normal pattern.',
 init:()=>({start:1,dur:10}),
 watch(p){return p<.34?{start:1,dur:10}:p<.67?{start:4,dur:1}:{start:52,dur:12}},
 ui:[{range:'start',label:'Eye closed from week',min:0,max:56,get:s=>s.start,act:'start'},{range:'dur',label:'For how many weeks',min:1,max:12,get:s=>s.dur,act:'dur'},{b:'Kitten: first 10 weeks',act:'pk'},{b:'One week at week 4',act:'pb'},{b:'Adult cat: 12 weeks',act:'pa'}],
 on:{start(s,v){s.start=clamp(Math.round(+v)||0,0,56)},dur(s,v){s.dur=clamp(Math.round(+v)||1,1,12)},pk(s){s.start=1;s.dur=10},pb(s){s.start=4;s.dur=1},pa(s){s.start=52;s.dur=12}},
 draw(s,f,X){
  const e=B5_mdEffect(s.start,s.dur),vals=B5_mdVals(e),left=B5_r1(100-vals[6]);
  let out=heading(e>.8?'The cortex goes over to the open eye':e>.2?'A partial shift to the open eye':'Little or no change');
  const x0=50,w=500,TX=a=>x0+a/68*w;
  out+=TF(x0,58,'sensitivity to closing one eye',13,C.purple,'start');
  const pts=[];for(let a=0;a<=68;a+=.5)pts.push([TX(a),108-B5_sens(a)*40]);
  out+=P('M'+pts.map(q=>fmt(q[0])+' '+fmt(q[1])).join(' L')+`L${TX(68)} 108L${TX(0)} 108Z`,C.purple,2,C.purplep)+L(x0,108,x0+w,108,C.line,1.4);
  out+=R(TX(s.start),112,TX(s.start+s.dur)-TX(s.start),11,C.coral,'none',3)+TF(clamp(TX(s.start+s.dur/2),x0+40,x0+w-40),137,'eye closed',13,C.coral);
  for(const [a,l] of [[0,'birth'],[13,'3 months'],[26,'6 months'],[52,'1 year']])out+=L(TX(a),108,TX(a),126,C.line,1)+TF(TX(a)+(a?0:-4),152,l,13,C.muted,a?'middle':'start');
  out+=B5_odHist(60,178,260,112,vals,B5_OD_N,{left:'closed eye only',right:'open eye only',lc:C.coral,rc:C.blue,title:'% of cortical cells in each group'});
  out+=B5_tile(350,172,220,'Shift towards the open eye',Math.round(e*100)+'%',C.purple)+B5_tile(350,226,220,'Cells the closed eye still drives',fmt(left)+'%',C.coral);
  out+=TF(460,292,'Dashed: a normal cat.',13,C.muted)+TF(460,308,'Groups 2 to 6 answer to both eyes.',13,C.muted);
  out+=B5_note('Illustrative model, shaped on Hubel and Wiesel’s recordings.',350);
  return {svg:out,phase:e>.8?`With the eye closed for week${s.dur>1?'s':''} ${s.start}${s.dur>1?' to '+(s.start+s.dur):''}, only ${fmt(left)}% of cells still respond to it. The eye itself works; its connections in the cortex lost out to the open eye’s while the circuit was being set.`:
   e>.2?`Part of the closure fell inside the sensitive weeks, so the cortex shifted ${Math.round(e*100)}% of the way. The earlier or longer the closure within those weeks, the larger the shift.`:
   s.start<3?'The closure ended before the sensitive period began, near week 4, so the cortex looks normal.':'The closure came after the sensitive period had faded. Most cells still respond to both eyes, as in the adult cats Wiesel and Hubel tested.'};
 }});

const B5_COMP={
 norm:{name:'Both eyes open',od:B5_OD_N,none:0,fl:.5,head:'The normal pattern',dis:'no change expected',found:'most cells answer to both eyes; equal stripes',
  say:'In layer 4 of the cortex the inputs from the two eyes end in alternating stripes of equal width. Above and below, most cells combine both eyes.'},
 md:{name:'Left eye closed',od:B5_OD_S,none:0,fl:.25,head:'One eye closed: the open eye takes over',dis:'the closed eye loses its cells',found:'it does, and its stripes shrink while the open eye’s widen',
  say:'The closed eye’s stripes narrow and the open eye’s widen into the space. On its own this fits either idea: connections that are not used fade, or the two eyes compete.'},
 bd:{name:'Both eyes closed',od:[6,9,11,22,11,9,6],none:26,fl:.5,head:'Both closed: far less loss than expected',dis:'both eyes lose their cells',found:'most cells still respond, many to both eyes',
  say:'If disuse were the rule, closing both eyes should empty the cortex. Wiesel and Hubel found most cells still responding, though often poorly, and about a quarter silent. An eye loses its territory only when the other eye is there to take it.'},
 sq:{name:'Squint (eyes misaligned)',od:[40,6,3,2,3,6,40],none:0,fl:.5,head:'Squint: both eyes used, yet binocular cells go',dis:'no change: both eyes see',found:'about four cells in five answer to one eye only',
  say:'Both eyes saw normally, but never the same thing at the same moment. Each cell kept one eye and dropped the other. Inputs that fire together are kept together; inputs that fire apart are separated.'}};
SCENE({id:'critical-periods-columns',name:'Competition, not disuse',tag:'Wiesel and Hubel, 1965',
 definition:'Why does a closed eye lose its place in the cortex? The simplest idea is disuse: connections that carry no signals wither. Wiesel and Hubel tested it in 1965 by closing both eyes of kittens. If disuse were the cause, both eyes should lose their cells. Instead most cells still responded. An eye loses ground when the other eye is active and it is not: the inputs compete.',
 example:'In a third experiment they cut one eye muscle so that the kitten’s eyes pointed in different directions. Both eyes were used fully, yet the cells that normally combine the two eyes became driven by one eye or the other. What matters is whether the two inputs are active at the same time.',
 desc:'Two eyes drawn open, closed or misaligned; a strip of cortex with alternating blue and red stripes for the left and right eye’s inputs; a histogram of cells from left-eye-only to right-eye-only; and two lines comparing what disuse predicts with what was found.',
 research:['Wiesel & Hubel (1965). Comparison of the effects of unilateral and bilateral eye closure on cortical unit responses in kittens. Journal of Neurophysiology 28, 1029–1040.','Hubel & Wiesel (1965). Binocular interaction in striate cortex of kittens reared with artificial squint. Journal of Neurophysiology 28, 1041–1059.','Hubel, Wiesel & LeVay (1977). Plasticity of ocular dominance columns in monkey striate cortex. Philosophical Transactions of the Royal Society B 278, 377–409.'],
 dur:12,hint:'Before choosing each rearing condition, predict what disuse alone would do. Then compare the prediction with the finding.',
 init:()=>({c:'md'}),
 watch(p){return {c:['norm','md','bd','sq'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['norm','Both eyes open'],['md','Left eye closed'],['bd','Both eyes closed'],['sq','Squint']],label:'Rearing',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=B5_COMP[v]?v:'norm'}},
 draw(s,f,X){
  const q=B5_COMP[s.c]||B5_COMP.norm;
  let out=heading(q.head);
  const eye=(x,lab,col,closed,turn)=>(closed?P(`M${x-22} 84Q${x} 100 ${x+22} 84`,col,3):`<ellipse cx="${x}" cy="84" rx="22" ry="13" fill="#fff" stroke="${col}" stroke-width="2.5"/>`+Ci(x+(turn||0),84,6,col))+TF(x,116,lab,13,col);
  out+=R(18,48,264,82,'#fff',C.grid,8)+eye(95,s.c==='md'||s.c==='bd'?'left: closed':'left eye',C.blue,s.c==='md'||s.c==='bd',s.c==='sq'?-9:0)+eye(205,s.c==='bd'?'right: closed':'right eye',C.coral,s.c==='bd',s.c==='sq'?9:0);
  // stripes in layer 4
  out+=TF(18,152,'Layer 4 of the cortex, seen from above',13,C.muted,'start');
  const sx=18,sw=264,per=sw/4;for(let i=0;i<4;i++){out+=R(sx+i*per,160,per*q.fl,62,C.blue,'none',0)+R(sx+i*per+per*q.fl,160,per*(1-q.fl),62,C.coral,'none',0)}
  out+=R(sx,160,sw,62,'none',C.line,4)+TF(sx,240,`left eye’s stripes: ${Math.round(q.fl*100)}% of the width`,13,C.blue,'start');
  // histogram
  const hx=318,hw=224;out+=B5_odHist(hx,66,hw,116,q.od,s.c==='norm'?null:B5_OD_N,{left:'left eye only',right:'right eye only',lc:C.blue,rc:C.coral,title:'% of cells in each group'});
  out+=TF(hx+hw/2,232,q.none?`${q.none}% of cells gave no response at all.`:`One eye only: ${q.od[0]+q.od[6]}%. Both eyes: ${100-q.od[0]-q.od[6]}%.`,13,q.none?C.coral:C.ink);
  out+=R(18,254,564,84,'#fff',C.grid,8)+TBF(30,276,'Disuse alone predicts:',13,C.muted,'start')+TF(196,276,q.dis,13,C.ink,'start')+TBF(30,300,'Found:',13,C.green,'start')+TF(84,300,q.found,13,C.ink,'start');
  out+=TF(30,324,s.c==='norm'?'Choose a rearing condition to test the idea.':s.c==='md'?'Fits both ideas. The next two conditions tell them apart.':'Disuse fails here; competition between the eyes fits.',13,s.c==='norm'||s.c==='md'?C.muted:C.coral,'start');
  out+=B5_note('Illustrative percentages and widths, after the kitten and monkey studies cited.',360);
  return {svg:out,phase:q.say};
 }});

// Reverse closure (Blakemore & Van Sluyters 1974): how far the first-closed eye recovers depends on the age at the swap. Illustrative curve.
const B5_recov=a=>1/(1+Math.exp((a-8.5)/1.2));
const B5_PEDIG=[['Aged 7 to 12',53,25],['Aged 13 to 17',25,23],['13 to 17, never treated',47,20]];
SCENE({id:'critical-periods-amblyopia',name:'Reversing it, and amblyopia',tag:'Why children’s eyes are treated early',
 definition:'Amblyopia is reduced vision through an eye that is itself healthy. It can develop when, in early childhood, one eye is misaligned, out of focus or covered, so the cortex comes to favour the other. Colin Blakemore and Richard Van Sluyters showed the way back in kittens: open the closed eye and close the other one. At 5 weeks of age the cortex switched over completely; by 14 weeks it hardly changed.',
 example:'Children with amblyopia are treated on the same logic: correct the cause, then cover or blur the stronger eye for part of the day so that the weaker one must be used. Earlier is better, but the window does not slam shut: in a trial of 507 patients aged 7 to 17, 53% of the 7 to 12 year olds improved with treatment against 25% with glasses alone.',
 desc:'On the left, a histogram of cortical cells in a kitten whose first eye was closed from birth and then swapped with the other eye at an age set by the slider. On the right, bars from a clinical trial showing the percentage of children whose vision improved, by age group, with and without added treatment.',
 research:['Blakemore & Van Sluyters (1974). Reversal of the physiological effects of monocular deprivation in kittens: further evidence for a sensitive period. Journal of Physiology 237, 195–216.','Pediatric Eye Disease Investigator Group (2005). Randomized trial of treatment of amblyopia in children aged 7 to 17 years. Archives of Ophthalmology 123, 437–447.','For how two eyes combine into depth, see Senses In Motion (depth and stereo vision).'],
 dur:11,hint:'Move the age at which the kitten’s eyes are swapped and see how much the first-closed eye wins back. This is not a vision test, and treatment is a matter for an eye-care professional.',
 init:()=>({age:5}),
 watch(p){return {age:Math.round(lerp(5,14,p))}},
 ui:[{range:'age',label:'Eyes swapped at age (weeks)',min:4,max:14,get:s=>s.age,act:'age'}],
 on:{age(s,v){s.age=clamp(Math.round(+v)||5,4,14)}},
 draw(s,f,X){
  const rec=B5_recov(s.age),vals=B5_OD_S.map((v,i)=>B5_r1(lerp(v,B5_OD_S[6-i],rec))),won=B5_r1(100-vals[6]);
  let out=heading(rec>.7?'Swapped early: the first eye wins back the cortex':rec>.25?'Swapped later: a partial recovery':'Swapped late: little recovery');
  out+=R(12,46,282,270,'#fff',C.grid,8)+TBF(24,66,'Kittens: reverse closure',13,C.ink,'start');
  const TX=a=>30+a/24*246;out+=R(TX(0),78,TX(s.age)-TX(0),10,C.coral,'none',3)+R(TX(s.age),92,TX(s.age+9)-TX(s.age),10,C.blue,'none',3);
  out+=TF(TX(0),114,'red: first eye closed',13,C.coral,'start')+TF(TX(24),114,'blue: other eye',13,C.blue,'end')+TF(TX(s.age),134,`swap at ${s.age} weeks`,13,C.ink,s.age>10?'end':'start');
  out+=B5_odHist(34,160,240,96,vals,B5_OD_S,{left:'first eye only',right:'other eye only',lc:C.coral,rc:C.blue,title:'% of cells, 9 weeks after the swap'});
  out+=TF(153,308,`First eye drives ${fmt(won)}% of cells`,13,C.coral);
  out+=R(304,46,284,270,'#fff',C.grid,8)+TBF(316,66,'Children: % whose vision improved',13,C.ink,'start');
  B5_PEDIG.forEach((g,i)=>{const y=86+i*62,BX=v=>316+v/60*200;out+=TF(316,y+4,g[0],13,C.ink,'start')+R(316,y+10,BX(g[1])-316,14,C.green,'none',3)+TBF(BX(g[1])+6,y+22,g[1]+'%',13,C.green,'start')+R(316,y+28,BX(g[2])-316,14,C.line,'none',3)+TF(BX(g[2])+6,y+40,g[2]+'%',13,C.muted,'start')});
  out+=R(316,276,12,12,C.green,'none',2)+TF(334,287,'glasses and added treatment',13,C.ink,'start')+R(316,294,12,12,C.line,'none',2)+TF(334,305,'glasses alone',13,C.ink,'start');
  out+=TF(300,336,'Trial: PEDIG 2005. “Improved” means 10 or more letters on the chart.',13,C.muted);
  out+=B5_note('Kitten bars are illustrative. Not a vision test and not medical advice.',358);
  return {svg:out,phase:rec>.7?`Swapped at ${s.age} weeks, well inside the sensitive period, the first-closed eye recovers nearly all the cortex and the newly closed eye loses it. The circuit is still open to revision in either direction.`:
   rec>.25?`Swapped at ${s.age} weeks, the first eye wins back ${fmt(won)}% of cells. The sensitive period is fading, so the same nine weeks of forced use achieve less.`:
   `Swapped at ${s.age} weeks, the first eye regains very little in the kitten. In children the decline is slower and less complete: the trial on the right found gains at 7 to 12, and in teenagers who had never been treated.`};
 }});

// What opens and closes the window (mouse visual cortex; ages in days after birth).
const B5_WIN={norm:[19,32,'Inhibition matures on time'],early:[15,28,'Inhibition boosted early'],weak:null,late:[60,73,'Kept weak, boosted in the adult']};
const B5_WIN_N={norm:'On time',early:'Boosted from day 15',weak:'Kept weak',late:'Weak, boosted at day 60'};
function B5_winShift(s){const w=B5_WIN[s.inh];if(!w)return 0;return clamp((Math.min(s.day+4,w[1])-Math.max(s.day,w[0]))/4,0,1)}
SCENE({id:'critical-periods-window',name:'What opens and closes the window',tag:'Hensch and colleagues, 1998–2000',
 definition:'A critical period is not set by age alone. In mouse visual cortex the window for the two eyes opens when the cortex’s inhibitory (GABA) circuits mature. Takao Hensch’s group showed this in 1998: mice that make too little GABA never entered the critical period, and a drug that strengthens GABA’s action opened it, even in adults. Given early to normal mice, the same drug opened the window early.',
 example:'The window also closes actively. Structures that settle around mature neurons act as brakes: when Pizzorusso and colleagues dissolved the nets around neurons in adult rats, closing one eye shifted the cortex again. So adult plasticity is reduced and held back, not absent. Other abilities have their own windows: infants stop telling some foreign speech sounds apart by about a year (Werker and Tees, 1984).',
 desc:'A time line of a mouse’s age in days with a purple curve for the strength of inhibition, a green band for the critical period, and a red marker for four days with one eye closed. A bar shows how far the cortex shifted towards the open eye.',
 research:['Hensch, Fagiolini, Mataga, Stryker, Baekkeskov & Kash (1998). Local GABA circuit control of experience-dependent plasticity in developing visual cortex. Science 282, 1504–1508.','Fagiolini & Hensch (2000). Inhibitory threshold for critical-period activation in primary visual cortex. Nature 404, 183–186.','Gordon & Stryker (1996). Journal of Neuroscience 16, 3274–3286 (the mouse’s critical period). Pizzorusso et al. (2002). Science 298, 1248–1251 (reopening in adult rats).'],
 dur:12,hint:'Choose how inhibition develops, then slide the four days of eye closure along the time line to find where the cortex shifts.',
 init:()=>({inh:'norm',day:24}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {inh:['norm','early','weak','late'][k],day:[24,16,24,64][k]}},
 ui:[{choose:[['norm','On time'],['early','Boosted early'],['weak','Kept weak'],['late','Weak, boosted in adult']],label:'Inhibition',get:s=>s.inh,act:'inh'},{range:'day',label:'One eye closed from day',min:12,max:76,step:2,get:s=>s.day,act:'day'}],
 on:{inh(s,v){s.inh=B5_pick(v,['norm','early','weak','late'],'norm')},day(s,v){s.day=clamp(Math.round(+v/2)*2||12,12,76)}},
 draw(s,f,X){
  const w=B5_WIN[s.inh],sh=B5_winShift(s),x0=50,ww=500,TX=d=>x0+(d-10)/74*ww;
  let out=heading(sh>.9?'Inside the window: the cortex shifts':sh>0?'Partly inside the window':w?'Outside the window: no shift':'The window never opens');
  out+=R(x0,56,ww,120,'#fff',C.grid,4);
  if(w)out+=R(TX(w[0]),56,TX(w[1])-TX(w[0]),120,C.greenp,'none',0)+TF((TX(w[0])+TX(w[1]))/2,74,'critical period',13,C.green);
  const pts=[];for(let d=10;d<=84;d+=1){const lev=s.inh==='weak'?.18:s.inh==='late'?.18+.72*smooth((d-58)/4):s.inh==='early'?.18+.72*smooth((d-13)/5):.1+.8*smooth((d-12)/10);pts.push([TX(d),170-lev*90])}
  out+=B5_poly(pts,C.purple,2.6);
  out+=R(TX(s.day),150,TX(s.day+4)-TX(s.day),20,C.coral,'none',3)+TF(clamp(TX(s.day+2),x0+38,x0+ww-38),142,'eye closed',13,C.coral);
  for(const d of [10,20,30,40,50,60,70,80])out+=L(TX(d),176,TX(d),181,C.line,1)+TF(TX(d),194,d,13,C.muted);
  out+=TF(x0+ww/2,212,'age of the mouse (days after birth)',13,C.muted)+TF(x0+ww,228,'purple line: strength of inhibition (GABA)',13,C.purple,'end');
  out+=TF(50,244,'Shift towards the open eye',13,C.muted,'start')+R(50,252,300,22,'#fff',C.line,5)+R(50,252,300*sh,22,C.coral,'none',5)+TBF(362,269,sh>.9?'full shift':sh>0?Math.round(sh*100)+'% of a full shift':'none',14,sh>0?C.coral:C.muted,'start');
  out+=B5_tile(50,290,160,'Inhibition',B5_WIN_N[s.inh],C.purple)+B5_tile(220,290,160,'Critical period',w?`days ${w[0]} to ${w[1]}`:'does not open',C.green)+B5_tile(390,290,160,'Eye closed',`days ${s.day} to ${s.day+4}`,C.coral);
  out+=B5_note('Schematic of results in mice. The boosting drug is a benzodiazepine; no doses are given.',360);
  return {svg:out,phase:!w?'These mice lack an enzyme that makes GABA. Whenever the eye is closed, the cortex stays as it was. The machinery for change is present but nothing has switched it on.':
   sh>.9?`The four days fall inside the window (${B5_WIN[s.inh][2].toLowerCase()}), so cells shift to the open eye. ${s.inh==='late'?'This mouse is an adult. Its critical period had simply never been started.':s.inh==='early'?'The window opened about four days early, because inhibition was strengthened early.':'In normal mice this is roughly days 19 to 32.'}`:
   sh>0?'The closure overlaps the edge of the window, so the shift is partial. Slide it fully inside the green band.':
   `No shift: the eye was closed ${s.day+4<=w[0]?'before the window opened':'after it had closed'}. Once started, the window runs for about two weeks and then shuts, whatever the animal’s age when it began.`};
 }});

/* ===================== Lesson: hebb-ltp ===================== */
// Field-response size as % of baseline. A weak train gives only a brief boost; a strong train adds a lasting step
// that saturates at +80%. Illustrative model of the kind of record Bliss and Lømo published.
function B5_ltpAt(ev,t){let lt=0,ptp=0;for(const e of ev){if(e.t>t)continue;const dt=t-e.t;if(e.k==='tet'){lt+=(80-lt)*.55;ptp+=60*Math.exp(-dt/2.5)}else ptp+=35*Math.exp(-dt/2)}return {lt,ptp}}
const B5_ltpResp=(ev,t)=>{const q=B5_ltpAt(ev,t);return 100+q.lt+q.ptp+3*B5_gauss(B5_rng(t*13+7))};
SCENE({id:'hebb-ltp',name:'A synapse that stays stronger',tag:'Hebb 1949; Bliss and Lømo 1973',
 definition:'In 1949 Donald Hebb proposed how experience could be stored: when one cell repeatedly takes part in firing another, the connection between them grows more effective. For two decades nobody had seen a synapse do this. In Oslo in 1966 Terje Lømo noticed that after a rapid train of stimuli to a pathway into a rabbit’s hippocampus, single test stimuli gave larger responses for a long time. He and Tim Bliss published the full study in 1973. It is now called long-term potentiation (LTP).',
 example:'They stimulated the perforant path of anaesthetised rabbits and recorded from the dentate gyrus. After trains such as 100 pulses a second for a few seconds, responses stayed enlarged for between 30 minutes and 10 hours, as long as they recorded. A companion paper in animals that were awake followed it for days. Mind In Motion introduces Hebb’s rule itself.',
 desc:'A graph of the size of the response to a test pulse, once a minute, as a percentage of its starting size. Vertical marks show when a weak or a strong train of stimuli was given. A small inset compares the shape of the response before and now.',
 research:['Hebb (1949). The Organization of Behavior. Wiley.','Bliss & Lømo (1973). Long-lasting potentiation of synaptic transmission in the dentate area of the anaesthetized rabbit following stimulation of the perforant path. Journal of Physiology 232, 331–356.','Bliss & Gardner-Medwin (1973). Journal of Physiology 232, 357–374 (unanaesthetised rabbits). Lømo (2003). The discovery of long-term potentiation. Philosophical Transactions of the Royal Society B 358, 617–620.'],
 dur:12,hint:'Record a baseline, then give a weak or a strong train and keep recording. Give more strong trains to find where the response stops growing.',
 init:()=>({ev:[],T:10}),
 watch(p){const T=Math.round(p*90),ev=[{t:15,k:'weak'},{t:35,k:'tet'},{t:60,k:'tet'}].filter(e=>e.t<=T);return {ev,T:Math.max(5,T)}},
 ui:[{b:'Record 10 more minutes',act:'rec'},{b:'Weak train',act:'weak'},{b:'Strong train',act:'tet'}],
 on:{rec(s){s.T=Math.min(180,s.T+10)},weak(s){if(s.T<=170){s.ev.push({t:s.T,k:'weak'});s.T+=10}},tet(s){if(s.T<=170){s.ev.push({t:s.T,k:'tet'});s.T+=10}}},
 draw(s,f,X){
  const xmax=Math.max(60,Math.ceil(s.T/30)*30),now=B5_ltpAt(s.ev,s.T),nt=s.ev.filter(e=>e.k==='tet').length,last=s.ev[s.ev.length-1],val=Math.round(100+now.lt+now.ptp);
  let out=heading(!s.ev.length?'A steady baseline':now.lt>70?'Close to its ceiling: about 180%':now.lt>0?'The response stays enlarged':'A brief boost that fades');
  const pl=B5_plot(60,62,370,190,[0,xmax],[60,260],{xt:range(xmax/30+1).map(i=>[i*30,String(i*30)]),yt:[[100,'100'],[150,'150'],[200,'200'],[250,'250']],xl:'time (minutes)'});
  out+=pl.svg+TF(60,54,'size of the response (% of baseline)',13,C.muted,'start')+L(pl.X(0),pl.Y(100),pl.X(xmax),pl.Y(100),C.line,1.2,'stroke-dasharray="4 4"');
  for(const e of s.ev)out+=L(pl.X(e.t)-1,62,pl.X(e.t)-1,252,e.k==='tet'?C.coral:C.amber,1.6)+TF(pl.X(e.t)+3,76,e.k==='tet'?'strong':'weak',13,e.k==='tet'?C.coral:C.amber,'start');
  for(let t=0;t<=s.T;t++)out+=Ci(pl.X(t),pl.Y(clamp(B5_ltpResp(s.ev,t),62,258)),xmax>90?1.8:2.4,C.blue);
  // inset: shape of the response
  out+=R(450,62,132,128,'#fff',C.grid,6)+TF(516,80,'one response',13,C.muted);
  const shp=(a,col,w)=>{const pts=[];for(let i=0;i<=50;i++){const t=i/50*14,v=t<2?0:(Math.exp(-(t-2)/3.5)-Math.exp(-(t-2)/.8))/.6;pts.push([460+i*2.2,104+a*v*30])}return B5_poly(pts,col,w)};
  out+=shp(1,C.muted,1.6)+shp(val/100,C.blue,2.4)+TF(516,182,'grey: before',13,C.muted);
  out+=B5_tile(450,200,132,'Response now',val+'%',C.blue);
  out+=B5_tile(60,300,170,'Strong trains given',String(nt),C.coral)+B5_tile(245,300,185,'Lasting part',now.lt>0?'+'+Math.round(now.lt)+'%':'none',C.green)+B5_tile(445,300,137,'Published',' 30 min to 10 h',C.ink);
  out+=B5_note('Simulated record. Sizes are illustrative; the pattern is Bliss and Lømo’s.',364);
  return {svg:out,phase:!s.ev.length?'Each dot is the response of many dentate cells to one test pulse on the perforant path. With a pulse a minute and nothing else, the size stays near 100%.':
   last.k==='weak'&&now.lt===0?'A weak train gives a boost that is gone within minutes. This short-lived effect was already known. It is not what Lømo had noticed.':
   now.lt>70?`After ${nt} strong trains the lasting part is +${Math.round(now.lt)}%. Each train adds less than the one before: the potentiation saturates, as Bliss and Lømo reported.`:
   `After the strong train the response jumps, settles within a few minutes and then stays about ${Math.round(now.lt)}% above baseline. Nothing but the synapses’ own recent activity has changed. Keep recording to see that it holds.`};
 }});

// The NMDA receptor channel: fraction free of magnesium block (Jahr & Stevens 1990), with voltage in mV and Mg in mM.
const B5_unblock=(v,mg)=>1/(1+mg/3.57*Math.exp(-.062*v));
const B5_nmdaI=(v,mg,glu)=>glu?B5_unblock(v,mg)*v:0;     // relative current; reversal potential 0 mV
const B5_pc=v=>Math.round(v*100);
SCENE({id:'hebb-ltp-nmda',name:'A receptor that detects coincidence',tag:'The magnesium block, 1984',
 definition:'Hebb’s rule needs a device that responds only when the sending cell and the receiving cell are active together. One kind of glutamate receptor does this. The NMDA receptor’s channel opens when glutamate binds, but at the resting potential a magnesium ion sits in its pore and blocks it. Only when the receiving cell is already depolarised is the magnesium driven out. Then the channel passes current, including calcium, which starts the strengthening of the synapse.',
 example:`With 1 mM magnesium outside, about ${B5_pc(B5_unblock(-70,1))}% of open channels are unblocked at −70 mV, ${B5_pc(B5_unblock(-20,1))}% at −20 mV and ${B5_pc(B5_unblock(0,1))}% at 0 mV. In 1983 Graham Collingridge and colleagues showed that a drug blocking NMDA receptors stops LTP from being induced in hippocampal slices, while ordinary transmission carries on.`,
 desc:'On the left, a channel in a membrane with glutamate above it and a magnesium ion that sits in the pore or is pushed out. On the right, a graph of the current through the channel against membrane voltage, with and without magnesium, and a marker at the chosen voltage.',
 research:['Nowak, Bregestovski, Ascher, Herbet & Prochiantz (1984). Magnesium gates glutamate-activated channels in mouse central neurones. Nature 307, 462–465.','Mayer, Westbrook & Guthrie (1984). Voltage-dependent block by Mg²⁺ of NMDA responses in spinal cord neurones. Nature 309, 261–263.','Collingridge, Kehl & McLennan (1983). Journal of Physiology 334, 33–46. Block formula: Jahr & Stevens (1990). Journal of Neuroscience 10, 3178–3182.'],
 dur:11,hint:'Try all four combinations: glutamate with the cell at rest, depolarisation without glutamate, both, and neither. Then remove the magnesium.',
 init:()=>({v:-70,glu:1,mg:1}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {v:[-70,-20,-20,-70][k],glu:[1,0,1,1][k],mg:k===3?0:1}},
 ui:[{range:'v',label:'Voltage of the receiving cell (mV)',min:-90,max:40,step:5,get:s=>s.v,act:'v'},{choose:[['1','Glutamate bound'],['0','No glutamate']],label:'Sending cell',get:s=>String(s.glu),act:'glu'},{choose:[['1','Magnesium present'],['0','Magnesium removed']],label:'Magnesium',get:s=>String(s.mg),act:'mg'}],
 on:{v(s,v){s.v=clamp(Math.round(+v/5)*5||0,-90,40)},glu(s,v){s.glu=v==='0'?0:1},mg(s,v){s.mg=v==='0'?0:1}},
 draw(s,f,X){
  const ub=B5_unblock(s.v,s.mg),I=B5_nmdaI(s.v,s.mg,s.glu),flow=s.glu&&ub>.3&&Math.abs(s.v)>2,dep=s.v>-45;
  let out=heading(!s.glu?'No glutamate: the channel stays shut':s.mg&&ub<.2?'Glutamate alone: magnesium blocks the pore':flow?'Both together: current and calcium flow':'Open, with little current at this voltage');
  out+=R(18,48,254,250,'#fff',C.grid,8)+TF(30,68,'outside the cell',13,C.muted,'start')+TF(30,286,'inside: '+(s.v<0?'−':s.v>0?'+':'')+Math.abs(s.v)+' mV',13,dep?C.coral:C.muted,'start');
  out+=R(18,150,254,50,C.amberp,'none',0)+TF(232,180,'membrane',13,C.amber,'end');
  const gap=s.glu?13:3;out+=R(145-gap-26,138,26,74,C.purple,'none',8)+R(145+gap,138,26,74,C.purple,'none',8)+TF(145,232,'NMDA receptor',13,C.purple);
  if(s.glu)out+=Ci(106,128,7,C.green,'#fff')+Ci(184,128,7,C.green,'#fff')+TF(145,92,'glutamate',13,C.green);
  if(s.mg){const blocked=ub<.5;out+=Ci(blocked&&s.glu?145:208,blocked&&s.glu?166:110,9,C.coral,'#fff')+TF(blocked&&s.glu?64:232,blocked&&s.glu?170:92,'Mg²⁺',13,C.coral)}
  if(flow){out+=arrow(145,s.v<0?112:226,145,s.v<0?222:116,C.blue,3)+TF(145,s.v<0?250:108,s.v<0?'Na⁺ and Ca²⁺ in':'outward current',13,C.blue)}
  const pl=B5_plot(318,62,254,190,[-90,40],[-45,45],{xt:[[-80,'−80'],[-40,'−40'],[0,'0'],[40,'+40']],xl:'voltage of the receiving cell (mV)'});
  out+=pl.svg+TF(318,54,'current when glutamate is bound',13,C.muted,'start')+L(pl.X(-90),pl.Y(0),pl.X(40),pl.Y(0),C.line,1.2)+L(pl.X(0),62,pl.X(0),252,C.line,1.2);
  const cur=mg=>{const pts=[];for(let v=-90;v<=40;v+=2)pts.push([pl.X(v),pl.Y(B5_unblock(v,mg)*v*.5)]);return pts};
  out+=B5_poly(cur(0),C.muted,s.mg?1.6:2.8,s.mg?'stroke-dasharray="5 4"':'')+B5_poly(cur(1),C.coral,s.mg?2.8:1.6,s.mg?'':'stroke-dasharray="5 4"');
  out+=TF(pl.X(-60),pl.Y(-34),'no Mg²⁺',13,C.muted)+TF(pl.X(-66),pl.Y(5),'with Mg²⁺',13,C.coral)+TF(pl.X(-86),pl.Y(-40),'inward',13,C.muted,'start');
  out+=Ci(pl.X(s.v),pl.Y(I*.5),6,s.glu?C.blue:'#fff',C.blue);
  out+=B5_tile(18,308,180,'Channels free of Mg²⁺',B5_pc(ub)+'%',C.coral)+B5_tile(208,308,180,'Inward current (relative)',I<0?fmt(B5_r1(-I)):'0',C.blue)+B5_tile(398,308,184,'Sender and receiver',s.glu&&dep?'active together':s.glu?'sender only':dep?'receiver only':'neither',s.glu&&dep?C.green:C.ink);
  out+=B5_note('Block follows Jahr and Stevens’s formula with '+(s.mg?'1 mM':'no')+' magnesium. Current in relative units.',372);
  return {svg:out,phase:!s.glu?'The sending cell is silent, so no glutamate is bound and the channel is closed, whatever the voltage. Depolarisation alone achieves nothing here.':
   s.mg&&ub<.2?`Glutamate has opened the channel, but at ${s.v} mV the negative inside holds a magnesium ion in the pore. Only ${B5_pc(ub)}% of channels are clear, and the synapse’s ordinary AMPA receptors carry the signal.`:
   !s.mg?'Without magnesium the current follows a straight line: the channel has lost its dependence on voltage. This is how Nowak and colleagues, and Mayer and colleagues, showed that magnesium is what makes it a coincidence detector.':
   flow?`Glutamate is bound and the cell is depolarised to ${s.v} mV, which pushes the magnesium out of ${B5_pc(ub)}% of channels. Calcium enters, but only at synapses that were active while the cell was depolarised. That is Hebb’s condition, met by a single molecule.`:
   'Near 0 mV the channel is clear, but there is almost no force driving ions through it, so the net current is small.'};
 }});

// Pairing. W1 and W2 are weak inputs, S is strong. Strengths are relative to baseline (1), rising by 0.5 per successful train to a ceiling of 2.
const B5_PAIR_N={weak:'W1 alone',strong:'S alone',pair:'W1 with S',late:'W1, then S'};
function B5_pairStep(s,act){
 const w=s.w.slice(),seen={...s.seen};let res='none';
 if(!s.apv){
  if(act==='strong'||act==='pair'){w[2]=Math.min(2,w[2]+.5);res='s'}
  if(act==='pair'){w[0]=Math.min(2,w[0]+.5);res='both';seen.assoc=1;seen.spec=1}
  if(act==='strong'){seen.spec=seen.spec||0}
  if(act==='weak')seen.coop=1;
 }else res='apv';
 const log=s.log.concat([act]);while(log.length>6)log.shift();
 return {w,seen,log,last:act,res};
}
const B5_pairInit=()=>({w:[1,1,1],apv:0,seen:{},log:[],last:'',res:''});
SCENE({id:'hebb-ltp-pairing',name:'Pairing a weak input with a strong one',tag:'Associative LTP, 1979–1986',
 definition:'LTP has three properties that make it a candidate for learning. It is cooperative: a weak input, active alone, does not depolarise the cell enough to induce it. It is associative: the same weak input is strengthened if it is active at the moment a strong input depolarises the cell. And it is input-specific: other synapses on the same cell that were silent at that moment do not change.',
 example:'William Levy and Oswald Steward found the associative effect in 1979 in rats, and Barrionuevo and Brown showed it in hippocampal slices in 1983. In 1986 Kelso, Ganong and Brown replaced the strong input with current injected into the receiving cell: weak input plus depolarisation was enough, and holding the cell negative prevented it. This fits the NMDA receptor exactly.',
 desc:'A neuron with three inputs: W1, a weak input to be paired; W2, a weak input left alone as a control; and S, a strong input. Bars show the size of each input’s response as a percentage of baseline. A strip records the trains given, and three boxes tick off cooperativity, associativity and input specificity.',
 research:['Levy & Steward (1979). Synapses as associative memory elements in the hippocampal formation. Brain Research 175, 233–245.','Barrionuevo & Brown (1983). Associative long-term potentiation in hippocampal slices. PNAS 80, 7347–7351.','Kelso, Ganong & Brown (1986). Hebbian synapses in hippocampus. PNAS 83, 5326–5330. Input specificity: Andersen, Sundberg, Sveen & Wigström (1977). Nature 266, 736–737.'],
 dur:12,hint:'Give a train to W1 alone, then to W1 and S together, and watch which bars grow. W2 is never stimulated with a train. Try the pairing again with NMDA receptors blocked.',
 init:B5_pairInit,
 watch(p){let s=B5_pairInit();const seq=['weak','strong','pair','pair'],k=Math.min(seq.length,Math.floor(p*(seq.length+1)));for(let i=0;i<k;i++)s={...s,...B5_pairStep(s,seq[i])};return s},
 ui:[{b:'Train W1 alone',act:'weak'},{b:'Train S alone',act:'strong'},{b:'Train W1 and S together',act:'pair'},{b:'W1 first, S a second later',act:'late'},{choose:[['0','Receptors working'],['1','NMDA receptors blocked']],label:'Drug',get:s=>String(s.apv),act:'apv'}],
 on:{weak(s){Object.assign(s,B5_pairStep(s,'weak'))},strong(s){Object.assign(s,B5_pairStep(s,'strong'))},pair(s){Object.assign(s,B5_pairStep(s,'pair'))},late(s){Object.assign(s,B5_pairStep(s,'weak'),{last:'late'});s.log[s.log.length-1]='late';if(!s.apv){s.w[2]=Math.min(2,s.w[2]+.5);s.res='s'}},apv(s,v){s.apv=v==='1'?1:0;s.last='apv';s.res=''}},
 draw(s,f,X){
  const cols=[C.blue,C.muted,C.amber],names=['W1','W2','S'],ys=[92,162,232],on=[s.last==='weak'||s.last==='pair'||s.last==='late',false,s.last==='strong'||s.last==='pair'||s.last==='late'];
  let out=heading(s.res==='both'?'Paired: the weak synapse grows':s.res==='apv'?'Receptors blocked: nothing changes':s.last==='weak'?'Alone, the weak input changes nothing':s.last==='late'?'A second apart is too late':s.res==='s'?'The strong input strengthens itself only':'Three inputs to one neuron');
  out+=`<path d="M236 60L236 264" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>`+Ci(262,162,26,C.pale,C.ink)+L(288,162,318,162,C.ink,4)+TF(262,208,'neuron',13,C.ink);
  names.forEach((nm,i)=>{const y=ys[i];out+=L(40,y,222,y,cols[i],on[i]?4:2.4)+Ci(226,y,4+3.5*s.w[i],cols[i],'#fff')+TBF(40,y-10,nm,14,cols[i],'start')+TF(70,y-10,i===0?'weak, paired':i===1?'weak, control':'strong',13,C.muted,'start');if(on[i])out+=TF(150,y+18,'train of stimuli',13,cols[i])});
  if(s.apv)out+=TBF(262,132,'blocked',13,C.coral);
  // bars
  const bx=350,BW=v=>v*70;out+=TF(bx,60,'test response (% of baseline)',13,C.muted,'start');
  names.forEach((nm,i)=>{const y=ys[i]-22;out+=TBF(bx,y+17,nm,14,cols[i],'start')+R(bx+34,y,BW(s.w[i]),24,cols[i],'none',4)+R(bx+34,y,BW(1),24,'none',C.ink,4,'stroke-dasharray="4 3" stroke-width="1.4"')+TBF(bx+40+BW(s.w[i]),y+17,Math.round(s.w[i]*100)+'%',13,s.w[i]>1?cols[i]:C.muted,'start')});
  out+=TF(bx,ys[2]+22,'dashed: baseline (100%)',13,C.muted,'start');
  // log
  out+=TF(30,286,'Trains given:',13,C.muted,'start');s.log.forEach((a,i)=>{out+=R(118+i*78,271,74,22,a==='pair'?C.greenp:C.pale,'none',5)+TF(155+i*78,286,B5_PAIR_N[a],13,C.ink)});
  const box3=(x,lab,done)=>R(x,304,180,40,done?C.greenp:'#fff',done?C.green:C.grid,8)+TF(x+90,329,(done?'✓ ':'')+lab,13,done?C.green:C.muted);
  out+=box3(18,'Cooperativity',s.seen.coop)+box3(210,'Associativity',s.seen.assoc)+box3(402,'Input specificity',s.seen.spec);
  out+=B5_note('Model of experiments in hippocampal slices. Sizes are illustrative.',366);
  return {svg:out,phase:s.res==='apv'?'With NMDA receptors blocked, no train of any kind leaves a lasting change. Test pulses still give their usual responses, because ordinary transmission uses other glutamate receptors.':
   s.res==='both'?`W1 was active while S held the cell depolarised, so W1’s synapse grew to ${Math.round(s.w[0]*100)}% of baseline. W2, on the same cell but silent during the pairing, is still at 100%. The cell has linked a weak input to a strong one.`:
   s.last==='weak'?'W1 released glutamate, but on its own it barely moves the cell’s voltage, so magnesium stayed in the NMDA channels. One weak input cannot potentiate itself.':
   s.last==='late'?'W1’s glutamate had gone by the time S depolarised the cell, so W1 is unchanged; S, strong enough on its own, still grew. The two must overlap within a fraction of a second.':
   s.res==='s'?'S depolarises the cell enough to unblock its own NMDA channels, so S grows. W1 and W2 were silent and do not change: potentiation stays at the synapses that were active.':
   s.last==='apv'?(s.apv?'A blocker of NMDA receptors is now in the bath. Repeat the pairing.':'The blocker has been washed out.'):'W1 and W2 are weak inputs: each gives a small response. S is strong. All three end on the same neuron. Choose which to stimulate with a train.'};
 }});

// Morris water maze, simulated. The rat's heading mixes a pull towards the platform (strength k, which grows with
// training) with random turning. One step is one second; a trial ends at 120 s. All numbers are illustrative.
const B5_POOL=[150,186,100],B5_PLAT=[190,148];
const B5_mwmK=(drug,n)=>drug?.22*(1-Math.exp(-n/5)):1-Math.exp(-n/2.5);
const B5_MWM_CACHE={};
function B5_mwmPath(drug,trial,rat,probe){
 const key=[drug,trial,rat,probe?1:0].join(':');if(B5_MWM_CACHE[key])return B5_MWM_CACHE[key];
 const [cx,cy,rad]=B5_POOL,r=B5_rng(trial*31+rat*977+(drug?5003:0)+(probe?99:0)),k=B5_mwmK(drug,trial),a0=((trial+rat)%4)*Math.PI/2+2.4;
 let x=cx+(rad-6)*Math.cos(a0),y=cy+(rad-6)*Math.sin(a0),h=a0+Math.PI,inq=0,lat=probe?60:120;const pts=[[x,y]],n=probe?60:120;
 for(let i=0;i<n;i++){
  const d=Math.atan2(B5_PLAT[1]-y,B5_PLAT[0]-x)-h,dd=Math.atan2(Math.sin(d),Math.cos(d));
  h+=.6*k*dd+(1-.7*k)*.6*B5_gauss(r);x+=9*Math.cos(h);y+=9*Math.sin(h);
  const q=Math.hypot(x-cx,y-cy);if(q>rad-5){x=cx+(x-cx)/q*(rad-5);y=cy+(y-cy)/q*(rad-5);h=Math.atan2(cy-y,cx-x)+1.1*(r()-.5)*2}
  pts.push([x,y]);if(x>cx&&y<cy)inq++;
  if(!probe&&Math.hypot(x-B5_PLAT[0],y-B5_PLAT[1])<12){lat=i+1;break}
 }
 return B5_MWM_CACHE[key]={pts,lat,frac:inq/n};
}
const B5_mwmLat=(drug,trial)=>sum(range(8).map(r=>B5_mwmPath(drug,trial,r,false).lat))/8;
const B5_mwmProbe=(drug,trained)=>sum(range(8).map(r=>B5_mwmPath(drug,trained,r,true).frac))/8;
SCENE({id:'hebb-ltp-morris',name:'Block the receptor, test the memory',tag:'Morris and colleagues, 1986',
 definition:'If LTP is how the hippocampus stores memories, blocking LTP should block learning. In 1986 Richard Morris and colleagues tested this with his water maze: a rat swims in a pool of cloudy water to find a platform hidden just under the surface, and over several trials learns where it is from landmarks around the room. Rats given AP5, which blocks NMDA receptors, into the brain learned the place poorly, and LTP in their hippocampus was blocked too.',
 example:'With the platform removed, trained control rats spent most of a minute searching the right quarter of the pool; AP5 rats searched all four quarters about equally, near the 25% expected by chance. The result supports the idea without proving it. In 1995 two groups found that rats trained beforehand in another pool could learn a new place under the drug. LTP is the leading candidate mechanism for memory, not a proven account of all of it.',
 desc:'A round pool seen from above with a hidden platform and the swimming path of one simulated rat. A graph shows the average time to reach the platform on each trial for control rats and for rats with NMDA receptors blocked. Tiles give the share of time spent in the platform’s quarter after the platform is removed.',
 research:['Morris, Anderson, Lynch & Baudry (1986). Selective impairment of learning and blockade of long-term potentiation by an N-methyl-D-aspartate receptor antagonist, AP5. Nature 319, 774–776.','Bannerman, Good, Butcher, Ramsay & Morris (1995). Nature 378, 182–186; Saucier & Cain (1995). Nature 378, 186–189: spatial learning despite NMDA receptor blockade after pretraining.','Martin, Grimwood & Morris (2000). Synaptic plasticity and memory: an evaluation of the hypothesis. Annual Review of Neuroscience 23, 649–711. Whitlock, Heynen, Shuler & Bear (2006). Learning induces long-term potentiation in the hippocampus. Science 313, 1093–1097.'],
 dur:13,hint:'Run trials for the control rats, then for the AP5 rats, and compare the two learning curves. Then remove the platform to see where each group searches.',
 init:()=>({drug:0,n:[0,0],pr:[0,0],last:'trial'}),
 watch(p){const k=Math.floor(p*23);return {drug:k>10?1:0,n:[Math.min(10,k),clamp(k-11,0,10)],pr:[k>=22?1:0,k>=22?1:0],last:k>=22?'probe':'trial'}},
 ui:[{choose:[['0','Control rats'],['1','AP5 rats']],label:'Group',get:s=>String(s.drug),act:'drug'},{b:'Run the next trial',act:'run'},{b:'Remove the platform (probe)',act:'probe'}],
 on:{drug(s,v){s.drug=v==='1'?1:0;s.last='trial'},run(s){s.n[s.drug]=Math.min(10,s.n[s.drug]+1);s.last='trial'},probe(s){s.pr[s.drug]=1;s.last='probe'}},
 draw(s,f,X){
  const d=s.drug,[cx,cy,rad]=B5_POOL,n=s.n[d],probe=s.last==='probe',path=probe?B5_mwmPath(d,n,0,true):n?B5_mwmPath(d,n-1,0,false):null;
  let out=heading(probe?(d?'AP5 rats search everywhere':'Control rats search the right quarter'):!n?'A hidden platform in cloudy water':d?'AP5 rats: little improvement':'Control rats: faster on each trial');
  out+=Ci(cx,cy,rad,'#eef6fb',C.line)+L(cx-rad,cy,cx+rad,cy,C.line,1,'stroke-dasharray="4 4"')+L(cx,cy-rad,cx,cy+rad,C.line,1,'stroke-dasharray="4 4"');
  if(probe)out+=`<path d="M${cx} ${cy}L${cx} ${cy-rad}A${rad} ${rad} 0 0 1 ${cx+rad} ${cy}Z" fill="${C.greenp}" fill-opacity=".7"/>`;
  out+=Ci(B5_PLAT[0],B5_PLAT[1],10,probe?'none':'#fff',C.green,'stroke-dasharray="3 3"')+TF(B5_PLAT[0]+16,B5_PLAT[1]-12,probe?'platform was here':'platform',13,C.green,'start');
  if(path){const show=X&&!X.try?path.pts:path.pts;out+=B5_poly(show,d?C.coral:C.blue,1.8)+Ci(path.pts[0][0],path.pts[0][1],5,C.ink)+TF(clamp(path.pts[0][0],60,240),path.pts[0][1]+(path.pts[0][1]>cy?20:-10),'start',13,C.ink)}
  out+=TF(cx,cy+rad+20,probe?`one ${d?'AP5':'control'} rat, 60 s without the platform`:n?`one ${d?'AP5':'control'} rat, trial ${n}`:'the pool from above',13,C.muted);
  const pl=B5_plot(322,62,250,170,[.5,10.5],[0,120],{xt:[[1,'1'],[4,'4'],[7,'7'],[10,'10']],yt:[[0,'0'],[60,'60'],[120,'120']],xl:'trial'});out+=pl.svg+TF(322,54,'seconds to reach the platform (8 rats)',13,C.muted,'start');
  for(const g of [0,1]){const pts=range(s.n[g]).map(i=>[pl.X(i+1),pl.Y(B5_mwmLat(g,i))]);out+=B5_poly(pts,g?C.coral:C.blue,2.4);pts.forEach(q=>{out+=Ci(q[0],q[1],3.5,g?C.coral:C.blue)})}
  out+=TF(566,78,'control',13,C.blue,'end')+TF(566,94,'AP5',13,C.coral,'end');
  const pv=g=>s.pr[g]?Math.round(B5_mwmProbe(g,s.n[g])*100)+'%':'not tested';
  out+=B5_tile(322,274,120,'Probe: control',pv(0),C.blue)+B5_tile(452,274,120,'Probe: AP5',pv(1),C.coral);
  out+=TF(447,336,'Share of 60 s in the platform’s quarter.',13,C.muted)+TF(447,352,'Chance is 25%.',13,C.muted);
  out+=B5_note('Simulated rats; times are illustrative. The pattern is that of Morris et al. (1986).',372);
  return {svg:out,phase:probe?(d?`These rats had ${n} trial${n===1?'':'s'} with NMDA receptors blocked. With the platform gone they spend ${pv(1)} of the time in its quarter, close to chance: they have not learned the place.`:`After ${n} trial${n===1?'':'s'} the control rats spend ${pv(0)} of the minute in the platform’s quarter${n>=4?', well above the 25% of chance. They know where it should be':'. With so little training this is still near chance'}.`):
   !n?'The rat cannot see, smell or feel its way to the platform; it has to learn the place from the room around the pool. Run the first trial.':
   d?`Trial ${n}: the AP5 rats took ${Math.round(B5_mwmLat(1,n-1))} s on average. They swim normally and can see, but their times fall slowly. In the real experiment LTP could not be induced in their hippocampus.`:
   `Trial ${n}: the control rats took ${Math.round(B5_mwmLat(0,n-1))} s on average. ${n>=4?'They now head for the platform from any starting point, which is what makes this a test of place memory.':'Early paths wander around the pool until the rat bumps into the platform.'}`};
 }});

/* ===================== Lesson: map-plasticity ===================== */
const B5_DCOL=[C.amber,C.blue,C.green,C.purple,C.coral],B5_DNAME=['thumb','index finger','middle finger','ring finger','little finger'];
function B5_mapAct(s,i,mode){
 if(!(s.w[i]>0)){s.last=i;s.act='gone';return s}
 if(mode==='cut'){const pres=range(5).filter(j=>j!==i&&s.w[j]>0);if(!pres.length){s.act='gone';return s}
  const l=pres.filter(j=>j<i).pop(),r=pres.find(j=>j>i);
  if(l!==undefined&&r!==undefined){s.w[l]+=s.w[i]/2;s.w[r]+=s.w[i]/2}else s.w[l!==undefined?l:r]+=s.w[i];
  s.w[i]=0;s.act='cut'}
 else{s.w[i]=Math.min(2.6,s.w[i]+.4);s.act='train'}
 s.last=i;return s;
}
const B5_mapInit=()=>({w:[1,1,1,1,1],mode:'train',last:-1,act:''});
SCENE({id:'map-plasticity',name:'The finger map moves',tag:'Merzenich and colleagues, 1983–1990',
 definition:'The touch map in an adult’s cortex was long thought to be fixed once development ended. In the early 1980s Michael Merzenich, Jon Kaas and colleagues mapped the hand area of adult owl monkeys with fine electrodes, before and after a change. When the input from a finger was lost, its patch of cortex did not fall silent: within weeks the neighbouring fingers’ territories had spread into it. And when monkeys were trained for months to use two fingertips on a task, those fingertips came to occupy more cortex.',
 example:'The shifts were real but small: borders moved by about a millimetre at most in these studies. Far larger changes were later reported in monkeys many years after losing the input from a whole arm (Pons and colleagues, 1991). The map is held in place by the balance of its inputs, and it moves when that balance changes.',
 desc:'A hand with five fingers in five colours, and two strips of cortex in the same colours: the map before, with equal shares, and the map now. Pressing a finger either trains it or removes its input.',
 research:['Merzenich, Nelson, Stryker, Cynader, Schoppmann & Zook (1984). Somatosensory cortical map changes following digit amputation in adult monkeys. Journal of Comparative Neurology 224, 591–605.','Jenkins, Merzenich, Ochs, Allard & Guic-Robles (1990). Functional reorganization of primary somatosensory cortex in adult owl monkeys after behaviorally controlled tactile stimulation. Journal of Neurophysiology 63, 82–104.','Pons, Garraghty, Ommaya, Kaas, Taub & Mishkin (1991). Massive cortical reorganization after sensory deafferentation in adult macaques. Science 252, 1857–1860.'],
 dur:11,hint:'Choose Train or Remove input, then press a finger on the hand. Compare the map now with the map before.',
 init:B5_mapInit,
 watch(p){const s=B5_mapInit(),k=Math.min(5,Math.floor(p*6));for(let i=0;i<Math.min(k,3);i++)B5_mapAct(s,1,'train');if(k>=4)B5_mapAct(s,3,'cut');if(k>=5)B5_mapAct(s,1,'train');return s},
 ui:[{choose:[['train','Train a finger'],['cut','Remove a finger’s input']],label:'Pressing a finger will',get:s=>s.mode,act:'mode'},{b:'Start again',act:'reset'}],
 on:{mode(s,v){s.mode=v==='cut'?'cut':'train'},finger(s,v){B5_mapAct(s,clamp(Math.round(+v)||0,0,4),s.mode)},reset(s){Object.assign(s,B5_mapInit())}},
 draw(s,f,X){
  const tot=sum(s.w),fr=s.w.map(v=>v/tot);
  let out=heading(s.act==='cut'?'Neighbours move into the silent patch':s.act==='train'?'A trained finger gains cortex':'Five fingers, five patches of cortex');
  // hand
  out+=R(58,196,128,92,'#f4ece4',C.line,22);
  const fx=[34,72,104,136,166],fy=[196,98,84,96,124],fh=[70,104,118,106,78];
  for(let i=0;i<5;i++){const gone=!(s.w[i]>0),x=fx[i],y=fy[i],inner=(i===0?`<rect x="${x-12}" y="${y}" width="26" height="${fh[i]}" rx="13" fill="${gone?'#fff':B5_DCOL[i]}" stroke="${B5_DCOL[i]}" stroke-width="2" ${gone?'stroke-dasharray="4 3"':''} transform="rotate(-28 ${x} ${y+fh[i]})"/>`:R(x-12,y,26,fh[i],gone?'#fff':B5_DCOL[i],B5_DCOL[i],13,gone?'stroke-dasharray="4 3"':''))+TBF(i===0?x-16:x+1,y+(i===0?34:24),i+1,14,gone?B5_DCOL[i]:'#fff');
   out+=hit(X,'finger',i,`${B5_DNAME[i]}: press to ${s.mode==='cut'?'remove its input':'train it'}`,inner)}
  out+=TF(122,312,'1 thumb … 5 little finger',13,C.muted)+TF(122,330,'dashed: input lost',13,C.muted);
  // strips
  const sx=250,sw=320,strip=(y,frs,lab)=>{let o=TF(sx,y-8,lab,13,C.muted,'start'),x=sx;frs.forEach((v,i)=>{const w=v*sw;if(w>0){o+=R(x,y,w,48,B5_DCOL[i],'#fff',0);if(w>20)o+=TBF(x+w/2,y+29,i+1,14,'#fff')}x+=w});return o+R(sx,y,sw,48,'none',C.line,4)};
  out+=strip(78,[.2,.2,.2,.2,.2],'Hand area of the cortex: before')+strip(170,fr,'Now');
  const li=s.last>=0?s.last:1;
  out+=B5_tile(250,240,150,'Finger '+(li+1)+': before','20%',C.muted)+B5_tile(420,240,150,'Finger '+(li+1)+': now',Math.round(fr[li]*100)+'%',B5_DCOL[li]);
  out+=TF(410,312,'Shares of the strip. In the monkeys the borders',13,C.muted)+TF(410,328,'moved by about a millimetre at most.',13,C.muted);
  out+=B5_note('Schematic of maps made with electrodes in adult owl monkeys. Shares are illustrative.',364);
  return {svg:out,phase:s.act==='cut'?`The input from finger ${s.last+1} is gone. Its patch of cortex now responds to touch on the neighbouring fingers, which have spread across the old border. No neuron moved: weak connections that were already there became effective.`:
   s.act==='train'?`Finger ${s.last+1} has been used intensively on a touch task, and now holds ${Math.round(fr[s.last]*100)}% of the strip, at its neighbours’ expense. In Jenkins and Merzenich’s monkeys the enlarged patch also had finer touch fields.`:
   s.act==='gone'?'That finger no longer sends any input, so training it changes nothing.':'Each finger’s skin is represented in its own patch, in order across the cortex. Use the hand on the left to change the balance of inputs.'};
 }});

const B5_PH={face:{name:'Touch the cheek',z:[4],felt:'on the cheek, and also in the missing hand',ref:1},arm:{name:'Touch the upper arm',z:[2],felt:'on the arm, and also in the missing hand',ref:1},leg:{name:'Touch the leg',z:[0],felt:'on the leg only',ref:0},move:{name:'Move the phantom hand',z:[3],felt:'as the missing hand moving',ref:0}};
const B5_PH_Z=['leg','trunk','arm','hand','face'];
SCENE({id:'map-plasticity-phantom',name:'Phantom limbs and a contested explanation',tag:'Ramachandran 1992; Makin 2013',
 definition:'Most people who lose a limb continue to feel it, and for many it is at times painful. In 1992 V. S. Ramachandran reported that touching the face of a man whose arm had been amputated produced sensations that he felt in particular fingers of the missing hand. In the cortex’s touch map the hand lies between the face and the upper arm, so Ramachandran proposed that the face’s input had spread into the silent hand area, and that such remapping causes phantom pain.',
 example:'The evidence is disputed. Flor and colleagues (1995) found that people with more shift in the map had more pain. Makin and colleagues (2013) found the opposite pattern: the hand area was still there and still active when people moved the phantom hand, most strongly in those with the worst pain. The mirror box, introduced in 1996, eased pain in a small trial of 22 patients, but later reviews judge the evidence weak. This page describes research; it is not advice on treatment.',
 desc:'A strip of the cortex’s touch map with zones for leg, trunk, arm, hand and face; the hand zone has lost its input. Choosing where the person is touched lights up zones of the strip. Below, two boxes set out the remapping account and the preserved-map account, each with the study that supports it.',
 research:['Ramachandran, Rogers-Ramachandran & Stewart (1992). Perceptual correlates of massive cortical reorganization. Science 258, 1159–1160.','Flor et al. (1995). Phantom-limb pain as a perceptual correlate of cortical reorganization following arm amputation. Nature 375, 482–484. Makin et al. (2013). Phantom pain is associated with preserved structure and function in the former hand area. Nature Communications 4, 1570.','Ramachandran & Rogers-Ramachandran (1996). Synaesthesia in phantom limbs induced with mirrors. Proceedings of the Royal Society B 263, 377–386. Chan et al. (2007). Mirror therapy for phantom limb pain. New England Journal of Medicine 357, 2206–2207. Review: Barbin et al. (2016). Annals of Physical and Rehabilitation Medicine 59, 270–275.'],
 dur:12,hint:'Choose what happens to the person and which account to look at. Notice which observations each account explains and which it does not.',
 init:()=>({spot:'face',view:'remap'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {spot:['face','arm','leg','move'][k],view:k===3?'kept':'remap'}},
 ui:[{choose:[['face','Touch the cheek'],['arm','Touch the upper arm'],['leg','Touch the leg'],['move','Move the phantom hand']],label:'Event',get:s=>s.spot,act:'spot'},{choose:[['remap','Remapping account'],['kept','Preserved-map account']],label:'Account',get:s=>s.view,act:'view'}],
 on:{spot(s,v){s.spot=B5_PH[v]?v:'face'},view(s,v){s.view=v==='kept'?'kept':'remap'}},
 draw(s,f,X){
  const q=B5_PH[s.spot]||B5_PH.face,remap=s.view==='remap',zw=104,zx=i=>40+i*zw,handOn=s.spot==='move'||(q.ref&&remap);
  let out=heading(s.spot==='move'?'The hand area still answers':q.ref?'A touch felt in the missing hand':'A touch felt only where it lands');
  out+=TF(40,62,'The touch map along the cortex (schematic)',13,C.muted,'start');
  B5_PH_Z.forEach((z,i)=>{const hand=i===3,on=q.z.includes(i)||(hand&&handOn);out+=R(zx(i),70,zw,56,on?(hand?C.coral:C.blue):(hand?'#fff':C.pale),hand?C.coral:C.line,0,hand&&!on?'stroke-dasharray="5 4"':'')+TBF(zx(i)+zw/2,96,z,14,on?'#fff':C.ink)+TF(zx(i)+zw/2,116,hand?'input lost':'',13,on?'#fff':C.coral)});
  if(q.ref&&remap){const from=s.spot==='face'?zx(4)+10:zx(3)-10,to=s.spot==='face'?zx(4)-34:zx(3)+34;out+=arrow(from,140,to,140,C.coral,3)+TF(zx(3)+zw/2,158,'neighbour’s input spreads in',13,C.coral)}
  if(q.ref&&!remap)out+=TF(300,150,'Why the touch is felt in the hand is not settled on this account.',13,C.muted);
  if(s.spot==='move')out+=TF(300,150,'Trying to move the missing hand activates its old area.',13,C.coral);
  out+=B5_tile(40,168,250,'Event',q.name,C.ink)+B5_tile(300,168,260,'Reported as felt',q.felt,q.ref?C.coral:C.ink);
  const card=(x,on,title,l1,l2,l3)=>R(x,226,270,104,on?C.amberp:'#fff',on?C.amber:C.grid,8)+TBF(x+12,246,title,13,C.ink,'start')+TF(x+12,266,l1,13,C.ink,'start')+TF(x+12,284,l2,13,C.ink,'start')+TF(x+12,302,l3,13,C.muted,'start')+TF(x+12,320,on?'selected':'',13,C.amber,'start');
  out+=card(22,remap,'Remapping account','Neighbours invade the hand area;','more invasion goes with more pain.','Flor et al. 1995, 13 people')+card(308,!remap,'Preserved-map account','The hand area persists; more pain','goes with more activity in it.','Makin et al. 2013, 18 people');
  out+=TF(300,348,'Mirror therapy: one small positive trial (2007); reviews call the evidence weak.',13,C.muted);
  out+=B5_note('Explains published research. Not a test, and not advice on treatment.',368);
  return {svg:out,phase:s.spot==='move'?(remap?'On a pure remapping account the hand area has been taken over, so this activity is awkward to explain. It is the observation that led Makin and colleagues to challenge the account.':'Makin and colleagues scanned people while they moved their phantom hand. The old hand area responded, and its response was strongest in people with the most persistent pain. On this view pain goes with a map that is kept, not one that is overwritten.'):
   q.ref?(remap?`Touch on the ${s.spot==='face'?'cheek':'upper arm'} activates its own zone. On the remapping account that input has also come to drive the neighbouring hand area, and activity there is felt as the missing hand. The ${s.spot==='face'?'face':'upper arm'} borders the hand in the map, which is why these two regions are the ones that refer.`:'The referred sensations are real reports, and both accounts must explain them. The preserved-map account does not deny some remapping; it denies that remapping is what causes the pain.'):
   'The leg’s zone is far from the hand’s in the map. A touch here is felt on the leg and nowhere else, on either account.'};
 }});

// Taxi drivers: a simulated sample of 16 from a population in which the true correlation is 0.6.
function B5_taxiSample(seed){const r=B5_rng(seed*53+1),pts=[];for(let i=0;i<16;i++){const x=2+38*r(),zx=(x-21)/10.97;pts.push([x,.6*zx+.8*B5_gauss(r)])}
 const mx=sum(pts.map(q=>q[0]))/16,my=sum(pts.map(q=>q[1]))/16;let sxy=0,sxx=0,syy=0;for(const [x,y] of pts){sxy+=(x-mx)*(y-my);sxx+=(x-mx)**2;syy+=(y-my)**2}
 return {pts,r:sxy/Math.sqrt(sxx*syy),b:sxy/sxx,mx,my}}
SCENE({id:'map-plasticity-taxi',name:'London taxi drivers',tag:'Maguire and colleagues, 2000 and 2011',
 definition:'To be licensed, London taxi drivers must learn the layout of some 25,000 streets, which takes years. In 2000 Eleanor Maguire and colleagues compared brain scans of 16 male drivers with 50 other men. The drivers had a larger posterior hippocampus and a smaller anterior hippocampus, and the posterior part was larger the longer a man had been driving (a correlation of about 0.6).',
 example:'The caveats matter. Sixteen is a small sample, the gain at the back came with a loss at the front, and a difference between groups cannot show how it arose: people with a larger posterior hippocampus might simply be the ones who qualify. A later study followed 79 trainees. The 39 who qualified had gained posterior hippocampal grey matter; the 20 who failed and 31 controls had not. That supports training as the cause.',
 desc:'A scatter plot of years of taxi driving against the size of the posterior hippocampus for a simulated sample of 16 drivers, with the correlation it gives. A row of dots collects the correlations from every sample drawn so far, with the published value marked. A second view shows the design of the later study that followed trainees over time.',
 research:['Maguire, Gadian, Johnsrude, Good, Ashburner, Frackowiak & Frith (2000). Navigation-related structural change in the hippocampi of taxi drivers. PNAS 97, 4398–4403.','Woollett & Maguire (2011). Acquiring “the Knowledge” of London’s layout drives structural brain changes. Current Biology 21, 2109–2114.','Mind In Motion has the basic finding (plasticity: taxi drivers). Here the question is how much a sample of 16 can show.'],
 dur:12,hint:'Draw new samples of 16 drivers from the same imaginary population and watch the correlation move. Then switch to the 2011 study to see what following people over time adds.',
 init:()=>({seed:1,rs:[B5_taxiSample(1).r],view:'a'}),
 watch(p){const n=1+Math.min(6,Math.floor(p*9)),rs=range(n).map(i=>B5_taxiSample(i+1).r);return {seed:n,rs,view:p>.8?'b':'a'}},
 ui:[{b:'Draw another 16 drivers',act:'again'},{choose:[['a','2000: one scan each'],['b','2011: before and after']],label:'Study',get:s=>s.view,act:'view'}],
 on:{again(s){s.view='a';s.seed++;s.rs.push(B5_taxiSample(s.seed).r);if(s.rs.length>40)s.rs.shift()},view(s,v){s.view=v==='b'?'b':'a'}},
 draw(s,f,X){
  let out;
  if(s.view==='b'){
   out=heading('Following trainees shows the change itself');
   out+=TF(300,60,'Posterior hippocampal grey matter, before and after 3 to 4 years',13,C.muted);
   const grp=[['Qualified','39 trainees',1,C.green],['Did not qualify','20 trainees',0,C.muted],['Controls','31 non-trainees',0,C.muted]];
   grp.forEach((g,i)=>{const x=60+i*176;out+=R(x,76,152,196,'#fff',C.grid,8)+TBF(x+76,98,g[0],14,C.ink)+TF(x+76,116,g[1],13,C.muted)+R(x+30,170,34,80,C.line,'none',3)+R(x+88,g[2]?146:170,34,g[2]?104:80,g[3],'none',3)+TF(x+47,264,'before',13,C.muted)+TF(x+105,264,'after',13,C.muted)+TBF(x+76,138,g[2]?'increased':'no change',13,g[3])});
   out+=TF(300,296,'Before training the three groups did not differ.',13,C.ink)+TF(300,316,'Those who qualified did worse on one test of visual memory.',13,C.ink);
   out+=B5_note('Bars show the direction of change only, not measured sizes. After Woollett & Maguire (2011).',350);
   return {svg:out,phase:'A single scan cannot say whether driving enlarged the posterior hippocampus or whether people who start with a large one become drivers. Scanning the same people before and after answers that: the groups began alike, and only those who learned the streets changed. The change came with a cost on one other memory test.'};
  }
  const q=B5_taxiSample(s.seed),lo=Math.min(...s.rs),hi=Math.max(...s.rs);
  out=heading(`This sample of 16: r = ${fmt(B5_r2(q.r))}`);
  const pl=B5_plot(60,62,260,196,[0,42],[-3,3],{xt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40']],xl:'years as a taxi driver'});out+=pl.svg+TF(60,54,'posterior hippocampus (relative size)',13,C.muted,'start');
  out+=L(pl.X(0),pl.Y(clamp(q.my+q.b*(0-q.mx),-3,3)),pl.X(42),pl.Y(clamp(q.my+q.b*(42-q.mx),-3,3)),C.coral,2);
  for(const [x,y] of q.pts)out+=Ci(pl.X(x),pl.Y(clamp(y,-2.9,2.9)),4.5,C.blue,'#fff');
  // strip of correlations
  const RX=v=>350+(v+.2)/1.2*222;out+=TF(350,74,'correlations from each sample so far',13,C.muted,'start')+L(350,150,572,150,C.line,2);
  for(const v of [0,.5,1])out+=L(RX(v),150,RX(v),156,C.line,1.4)+TF(RX(v),172,v===0?'0':v===.5?'0.5':'1',13,C.muted);
  out+=L(RX(.6),92,RX(.6),150,C.green,2,'stroke-dasharray="4 3"')+TF(RX(.6),88,'published: 0.6',13,C.green);
  const cnt={};s.rs.forEach((v,i)=>{const b=Math.round(clamp(v,-.2,1)*20),k=cnt[b]=(cnt[b]||0)+1;if(k<=5)out+=Ci(RX(b/20),150-k*9,4,i===s.rs.length-1?C.coral:C.blue,'#fff')});
  out+=B5_tile(350,190,105,'This sample',fmt(B5_r2(q.r)),C.coral)+B5_tile(467,190,105,'Samples drawn',String(s.rs.length),C.ink)+B5_tile(350,246,222,'Range so far',s.rs.length>1?`${fmt(B5_r2(lo))} to ${fmt(B5_r2(hi))}`:'draw more samples',C.blue);
  out+=TF(300,318,'Every sample comes from the same population, where the true value is 0.6.',13,C.muted);
  out+=B5_note('Simulated drivers, not the study’s data. Sizes are in standard units.',350);
  return {svg:out,phase:s.rs.length<3?`These 16 simulated drivers give r = ${fmt(B5_r2(q.r))}. The population they were drawn from has a true correlation of 0.6, the value Maguire’s group reported. Draw more samples to see how far 16 people can stray from it.`:
   `Across ${s.rs.length} samples of 16, the correlation has ranged from ${fmt(B5_r2(lo))} to ${fmt(B5_r2(hi))}, though nothing about the population changed. A single small study gives an estimate with wide error, which is why the finding needed the larger follow-up.`};
 }});

// Enriched and impoverished cages: each pair of littermates gives one difference in cortical thickness (%). Illustrative: mean 5, sd 4.
const B5_enrDiff=i=>5+4*B5_gauss(B5_rng(i*17+211));
SCENE({id:'map-plasticity-enriched',name:'Experience thickens the cortex',tag:'Marian Diamond and colleagues, 1964',
 definition:'In the early 1960s at Berkeley, Mark Rosenzweig, David Krech and Edward Bennett found that rats raised in a large cage with companions and changing objects had heavier cortex, with different enzyme activity, than littermates raised alone in plain cages. Marian Diamond measured the tissue itself under the microscope: the cortex of the enriched rats was thicker, by a few per cent. It was the first anatomical evidence that experience changes the structure of the mammalian brain.',
 example:'The difference is small, so it needs many pairs of littermates to see it clearly. Later work traced it to more branching of dendrites, more synapses per neuron and more glial cells, not to extra neurons. And a laboratory’s “enriched” cage is still plainer than a wild rat’s life, so the result may show the cost of an impoverished cage as much as a benefit of enrichment.',
 desc:'Two cages, one with several rats and objects and one with a single rat. A dot plot shows, for each pair of littermates measured, how much thicker the enriched rat’s cortex was. A bar gives the running average and its margin of error against the zero line.',
 research:['Diamond, Krech & Rosenzweig (1964). The effects of an enriched environment on the histology of the rat cerebral cortex. Journal of Comparative Neurology 123, 111–119.','Rosenzweig, Krech, Bennett & Diamond (1962). Effects of environmental complexity and training on brain chemistry and anatomy. Journal of Comparative and Physiological Psychology 55, 429–437.','Volkmar & Greenough (1972). Rearing complexity affects branching of dendrites in the visual cortex of the rat. Science 176, 1445–1447.'],
 dur:11,hint:'Measure pairs of littermates one at a time, or five at a time. Watch when the margin of error first stays clear of zero.',
 init:()=>({n:0}),
 watch(p){return {n:Math.floor(p*20.5)}},
 ui:[{b:'Measure 1 more pair',act:'one'},{b:'Measure 5 more pairs',act:'five'},{b:'Start again',act:'clear'}],
 on:{one(s){s.n=Math.min(20,s.n+1)},five(s){s.n=Math.min(20,s.n+5)},clear(s){s.n=0}},
 draw(s,f,X){
  const d=range(s.n).map(B5_enrDiff),m=s.n?sum(d)/s.n:0,sd=s.n>1?Math.sqrt(sum(d.map(v=>(v-m)**2))/(s.n-1)):0,se=s.n>1?sd/Math.sqrt(s.n):0,lo=m-2*se,hi=m+2*se,clear=s.n>1&&lo>0;
  let out=heading(!s.n?'Two cages, one litter':s.n<2?'One pair says little':clear?'Thicker, and clear of zero':'Not yet clear of zero');
  const cage=(y,lab,rats,toys)=>{let o=R(18,y,200,100,'#fff',C.line,6)+TF(118,y+118,lab,13,C.ink);rats.forEach(([x,yy])=>{o+=`<ellipse cx="${18+x}" cy="${y+yy}" rx="13" ry="8" fill="${C.muted}"/>`+Ci(18+x+13,y+yy-3,5,C.muted)});if(toys)o+=R(40,y+16,30,10,C.amber,'none',3)+P(`M150 ${y+86}L166 ${y+58}L182 ${y+86}`,C.green,3)+Ci(110,y+26,9,'none',C.purple);return o};
  out+=cage(52,'enriched: company and objects',[[40,70],[92,58],[128,80],[70,36],[160,34]],true)+cage(190,'impoverished: alone, plain cage',[[100,56]],false);
  const pl=B5_plot(280,62,180,200,[0,21],[-6,16],{yt:[[-5,'−5'],[0,'0'],[5,'+5'],[10,'+10'],[15,'+15']],xt:[[1,'1'],[10,'10'],[20,'20']],xl:'pair of littermates'});
  out+=pl.svg+TF(250,54,'enriched cortex thicker by (%)',13,C.muted,'start')+L(pl.X(0),pl.Y(0),pl.X(21),pl.Y(0),C.ink,1.4);
  d.forEach((v,i)=>{out+=Ci(pl.X(i+1),pl.Y(clamp(v,-5.5,15.5)),4,C.blue,'#fff')});
  // mean and interval
  const bx=510,BY=v=>pl.Y(clamp(v,-6,16));out+=L(bx-34,pl.Y(0),bx+34,pl.Y(0),C.ink,1.4)+TF(bx,54,'average',13,C.muted);
  if(s.n>1)out+=L(bx,BY(lo),bx,BY(hi),clear?C.green:C.coral,3)+L(bx-8,BY(lo),bx+8,BY(lo),clear?C.green:C.coral,3)+L(bx-8,BY(hi),bx+8,BY(hi),clear?C.green:C.coral,3);
  if(s.n)out+=Ci(bx,BY(m),6,clear?C.green:C.coral,'#fff');
  out+=TF(bx,pl.Y(0)+16,'no difference',13,C.muted);
  out+=B5_tile(250,318,100,'Pairs',String(s.n),C.ink)+B5_tile(360,318,110,'Average',s.n?(m<0?'−':'+')+fmt(B5_r1(Math.abs(m)))+'%':'none yet',C.blue)+B5_tile(480,318,104,'Margin (±)',s.n>1?fmt(B5_r1(2*se))+'%':'needs 2',clear?C.green:C.coral);
  out+=TF(118,338,'Simulated measurements;',13,C.muted)+TF(118,354,'the true difference is set at 5%.',13,C.muted);
  return {svg:out,phase:!s.n?'Littermates are split at weaning: one joins a group in a large cage with objects that are changed often, the other lives alone in a plain cage. After about 80 days the thickness of the cortex is measured in each.':
   s.n<2?`In the first pair the enriched rat’s cortex is ${d[0]<0?'thinner':'thicker'} by ${fmt(B5_r1(Math.abs(d[0])))}%. One pair cannot separate an effect of the cage from ordinary variation between two animals.`:
   clear?`After ${s.n} pairs the average is +${fmt(B5_r1(m))}%, give or take ${fmt(B5_r1(2*se))}%. The whole margin lies above zero. A few per cent of thickness is a small effect, found only by measuring many animals carefully.`:
   `After ${s.n} pairs the average is ${m<0?'−':'+'}${fmt(B5_r1(Math.abs(m)))}%, give or take ${fmt(B5_r1(2*se))}%. The margin still reaches zero, so more pairs are needed.`};
 }});

/* ===================== Lesson: neurogenesis ===================== */
// Labelling dividing cells with radioactive thymidine. Cell counts in the drawing are illustrative.
const B5_NG={
 dg:{name:'Dentate gyrus',d1:6,mo:5,neu:4,layer:'granule cell layer',
  s1:'A day later, six labelled cells lie just under the granule cell layer. They were copying their DNA when the label arrived, so they were dividing.',
  s2:'A month later five labelled cells remain, and they have moved up into the layer and taken the shape of granule cells.',
  s3:'Four of the five have the features of neurons; one is a glial cell. This is what Altman and Das reported in rats in 1965, and what Kaplan and Hinds confirmed with the electron microscope in 1977.'},
 ob:{name:'Olfactory bulb',d1:0,mo:6,neu:6,layer:'granule cell layer',
  s1:'A day later there is no labelled cell in the bulb. The dividing cells are elsewhere, beside the fluid-filled ventricles deep in the brain.',
  s2:'A month later six labelled cells have appeared among the bulb’s granule cells. They were born beside the ventricle and migrated forward along a fixed route.',
  s3:'All six have the features of small neurons. Altman described this stream of new cells to the rat’s olfactory bulb in 1969.'},
 ctx:{name:'Neocortex',d1:3,mo:3,neu:0,layer:'a layer of cortical neurons',
  s1:'A day later three small labelled cells are scattered through the tissue.',
  s2:'A month later there are still three, small and scattered, and none sits among the large neurons.',
  s3:'None is a neuron: they are glia and cells of blood-vessel walls, which divide throughout life. A 1999 report of new neurons in adult monkey neocortex was not confirmed (Kornack and Rakic, 2001).'}};
SCENE({id:'neurogenesis',name:'Are new neurons born in adults?',tag:'Altman, 1962–1965',
 definition:'Neurogenesis is the birth of new neurons. For most of the twentieth century the rule was that it ends soon after birth: an adult brain can lose neurons and never gains one. In 1962 Joseph Altman injected adult rats with radioactive thymidine, a building block of DNA that is taken up only by cells preparing to divide, and later found labelled cells that looked like neurons. With Gopal Das in 1965 he showed them in the dentate gyrus of the hippocampus.',
 example:'The work was largely ignored. The label proves a cell divided, but not what kind of cell it became, and critics held that the labelled cells were glia. A 1985 study of adult monkeys by Pasko Rakic found no new neurons. Opinion changed only in the 1980s and 1990s, with songbirds and with better markers. In rodents two regions are now accepted: the dentate gyrus and the stream of cells to the olfactory bulb.',
 desc:'A slice of brain tissue with a layer of grey cells. After an injection of label, some cells are drawn dark; over the steps they move, and in the last step each is marked N for neuron or G for glia. A list on the right gives the steps of the method.',
 research:['Altman (1962). Are new neurons formed in the brains of adult mammals? Science 135, 1127–1128.','Altman & Das (1965). Autoradiographic and histological evidence of postnatal hippocampal neurogenesis in rats. Journal of Comparative Neurology 124, 319–335.','Kaplan & Hinds (1977). Science 197, 1092–1094. Rakic (1985). Limits of neurogenesis in primates. Science 227, 1054–1056. Kornack & Rakic (2001). Science 294, 2127–2130.'],
 dur:12,hint:'Choose a region of the adult rat’s brain and step through the method. Ask at each step what the label does and does not prove.',
 init:()=>({region:'dg'}),
 trace(s){const q=B5_NG[s.region]||B5_NG.dg;return [
  {k:0,say:'An adult rat is injected with radioactive thymidine. Any cell that is copying its DNA in the next hours builds the label into its chromosomes and keeps it.'},
  {k:1,say:q.s1},{k:2,say:q.s2},{k:3,say:q.s3}]},
 ui:[{choose:[['dg','Dentate gyrus'],['ob','Olfactory bulb'],['ctx','Neocortex']],label:'Region',get:s=>s.region,act:'region'}],
 on:{region(s,v){s.region=B5_NG[v]?v:'dg'}},
 draw(s,f,X){
  const q=B5_NG[s.region]||B5_NG.dg,k=f?f.k:3,nlab=k===0?0:k===1?q.d1:q.mo;
  let out=heading(k===0?'Label the cells that are dividing':k===1?(q.d1?'One day on: labelled cells':'One day on: none here yet'):k===2?'One month on':q.neu?`${q.neu} of ${q.mo} labelled cells are neurons`:'Labelled, but not neurons');
  out+=R(18,48,350,250,'#fff',C.grid,8)+TBF(30,68,q.name+' of an adult rat',13,C.ink,'start');
  out+=R(30,138,326,56,C.pale,'none',6)+TF(350,132,q.layer,13,C.blue,'end');
  const r=B5_rng(s.region==='dg'?3:s.region==='ob'?8:14);
  for(let i=0;i<26;i++)out+=Ci(42+(i%13)*25+4*r(),152+Math.floor(i/13)*26+4*r(),s.region==='ctx'?10:8,'#fff',C.line);
  for(let j=0;j<nlab;j++){
   const bx=62+j*52+(s.region==='ctx'?12*Math.sin(j*2.1):0),inLayer=s.region!=='ctx'&&k>=2,by=s.region==='ctx'?[94,236,222][j%3]:inLayer?(j%2?178:152):214,neu=j<q.neu;
   if(inLayer)out+=L(bx,by-8,bx,by-26,C.ink,2);
   out+=Ci(bx,by,inLayer?8:6,C.ink)+Ci(bx-2,by-2,1.6,'#fff')+Ci(bx+3,by+1,1.6,'#fff');
   if(k===3)out+=TBF(bx,by+(s.region==='ctx'?24:inLayer?27:24),neu?'N':'G',14,neu?C.green:C.coral)}
  if(k===0)out+=TF(193,236,'No label yet: every cell looks the same.',13,C.muted);
  out+=TF(193,286,'dark: labelled  ·  N neuron  ·  G glia or other',13,C.muted);
  ['Inject the label','Wait one day: who took it up?','Wait a month: where are they?','Check each: neuron or not?'].forEach((t,i)=>{out+=R(380,56+i*44,202,36,i===k?C.amberp:'#fff',i===k?C.amber:C.grid,7)+TF(390,79+i*44,`${i+1}. ${t}`,13,i===k?C.ink:C.muted,'start')});
  out+=B5_tile(380,238,96,'Labelled',String(nlab),C.ink)+B5_tile(486,238,96,'Neurons',k===3?String(q.neu):'?',C.green);
  out+=TF(300,320,'The label shows that a cell divided. It does not show what the cell became.',13,C.ink);
  out+=B5_note('Schematic of thymidine labelling in adult rats. Counts are illustrative.',350);
  return {svg:out,phase:f?f.say:''};
 }});

// A canary's year. HVC size relative to its autumn low, and the arrival of new neurons; both curves are schematic.
const B5_MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const B5_hvc=m=>1.5+.45*Math.cos(2*Math.PI*(m-3.5)/12),B5_arrive=m=>.5+.5*Math.cos(2*Math.PI*(m-9.5)/12);
const B5_song=m=>m>=2&&m<=5?'full, stable song':m===6||m===7?'song falls away':m>=8?'unstable; new syllables':'song settling';
SCENE({id:'neurogenesis-canaries',name:'A canary’s song nucleus through the year',tag:'Nottebohm, 1981–1984',
 definition:'The evidence that changed minds came from birds. Fernando Nottebohm found that the brain region a male canary uses to control song, called HVC, is nearly twice as large in spring, when he sings a stable song, as in autumn, when the song breaks down and is relearned with new syllables. In 1983 Steven Goldman and Nottebohm showed with labelled thymidine that new neurons are born in the adult canary’s brain and move into HVC.',
 example:'The decisive step came in 1984. John Paton and Nottebohm recorded electrical responses to sound from single cells in HVC, filled each recorded cell with dye, and then found the birth label in some of them. Cells born in adulthood were working neurons wired into the circuit. Old neurons die as new ones arrive, so the nucleus is partly rebuilt each year.',
 desc:'The outline of a canary’s brain with the song nucleus HVC drawn at its size for the chosen month. A graph across the twelve months shows the size of HVC and the arrival of new neurons, with a marker on the chosen month. Tiles give the month, the size and the state of the song.',
 research:['Nottebohm (1981). A brain for all seasons: cyclical anatomical changes in song control nuclei of the canary brain. Science 214, 1368–1370.','Goldman & Nottebohm (1983). Neuronal production, migration, and differentiation in a vocal control nucleus of the adult female canary brain. PNAS 80, 2390–2394.','Paton & Nottebohm (1984). Neurons generated in the adult brain are recruited into functional circuits. Science 225, 1046–1048. Kirn, O’Loughlin, Kasparian & Nottebohm (1994). PNAS 91, 7844–7848.'],
 dur:12,hint:'Move through the months of the year. Compare when HVC is largest with when most new neurons arrive.',
 init:()=>({m:3}),
 watch(p){return {m:Math.min(11,Math.floor(p*12))}},
 ui:[{range:'m',label:'Month',min:1,max:12,get:s=>s.m+1,act:'m'},{b:'Next month',act:'next'}],
 on:{m(s,v){s.m=clamp(Math.round(+v)-1||0,0,11)},next(s){s.m=(s.m+1)%12}},
 draw(s,f,X){
  const v=B5_hvc(s.m),ar=B5_arrive(s.m),rel=v/1.05;
  let out=heading(s.m>=2&&s.m<=5?'Spring: a large HVC and a stable song':s.m>=8?'Autumn: a small HVC, many new neurons':s.m>=6?'Late summer: the song falls away':'Winter: the new song settles');
  out+=R(18,48,230,196,'#fff',C.grid,8)+`<path d="M52 170C52 112 110 82 164 92C214 100 232 140 220 172C210 200 168 212 126 208C86 206 52 200 52 170Z" fill="#f4ece4" stroke="${C.line}" stroke-width="2"/>`;
  out+=Ci(150,128,10*Math.sqrt(v),C.coral,'#fff')+TBF(150,133,'HVC',13,'#fff')+TF(133,232,'canary brain, from the side',13,C.muted);
  out+=Ci(92,168,3,C.blue)+Ci(104,160,3,C.blue)+(ar>.5?Ci(118,150,3,C.blue)+Ci(130,142,3,C.blue):'')+TF(84,190,'new neurons',13,C.blue);
  const pl=B5_plot(290,62,280,150,[-.5,11.5],[0,2.2],{xt:B5_MONTHS.map((n,i)=>[i,n[0]]),yt:[[1,'1'],[2,'2']],xl:'month'});
  out+=pl.svg+TF(290,54,'red: size of HVC  ·  blue: new neurons arriving',13,C.muted,'start');
  out+=R(pl.X(s.m-.5),62,pl.X(.5)-pl.X(-.5),150,C.amberp,'none',0);
  for(let i=0;i<12;i++)out+=R(pl.X(i)-7,pl.Y(B5_arrive(i)*.8),14,pl.Y(0)-pl.Y(B5_arrive(i)*.8),C.blue,'none',2,'fill-opacity=".45"');
  out+=B5_poly(range(12).map(i=>[pl.X(i),pl.Y(B5_hvc(i))]),C.coral,2.6)+Ci(pl.X(s.m),pl.Y(v),5.5,C.coral,'#fff');
  out+=B5_tile(18,256,180,'Month',B5_MONTHS[s.m],C.ink)+B5_tile(208,256,180,'HVC size (autumn low = 1)','× '+fmt(B5_r1(rel)),C.coral)+B5_tile(398,256,184,'Song',B5_song(s.m),C.ink);
  out+=TF(300,326,'New neurons replace old ones; the total rises and falls with the seasons.',13,C.ink);
  out+=B5_note('Schematic curves for male canaries, after Nottebohm (1981) and Kirn et al. (1994).',354);
  return {svg:out,phase:s.m>=2&&s.m<=5?`${B5_MONTHS[s.m]}: the breeding season. HVC is ${fmt(B5_r1(rel))} times its autumn size and the male repeats a fixed set of syllables. Few new neurons are arriving.`:
   s.m>=8?`${B5_MONTHS[s.m]}: HVC is near its smallest, the song is variable, and new neurons are arriving in numbers. Paton and Nottebohm showed that such cells respond to sound: they join the working circuit while the bird learns new syllables.`:
   s.m>=6?`${B5_MONTHS[s.m]}: after breeding the bird moults and sings less. HVC is shrinking as older neurons die.`:
   `${B5_MONTHS[s.m]}: the neurons added in autumn are in place, HVC is growing again, and the new season’s song is settling into its fixed form.`};
 }});

const B5_HUM=[
 {y:'1998',who:'Eriksson et al.',m:['A dividing-cell label (BrdU), given','for cancer care, read after death.'],n:'5 people, all with cancer',f:'Labelled neurons in the dentate gyrus.',d:'A very small and unusual sample.',side:1},
 {y:'2013',who:'Spalding et al.',m:['Carbon-14 from 1950s bomb tests,','measured in neurons’ DNA.'],n:'Hippocampal neurons, post-mortem',f:'About 700 new neurons a day.',d:'Indirect: rests on a model of turnover.',side:1},
 {y:'2018',who:'Sorrells et al.',m:['Antibody markers of young','neurons in brain tissue.'],n:'59 samples, before birth to 77 years',f:'A steep fall in childhood; none in adults.',d:'Markers can fade before tissue is fixed.',side:0},
 {y:'2018',who:'Boldrini et al.',m:['Antibody markers, counted through','the whole hippocampus.'],n:'28 people aged 14 to 79',f:'Thousands of young neurons at every age.',d:'The markers may not mean “newborn”.',side:1},
 {y:'2019',who:'Moreno-Jiménez et al.',m:['Antibody markers, with tightly','controlled tissue fixation.'],n:'13 healthy adults aged 43 to 87',f:'Thousands of young neurons.',d:'Same doubt about what markers mean.',side:1}];
const B5_fixSeen=h=>Math.exp(-(h-1)/3.5);
SCENE({id:'neurogenesis-human',name:'Adult humans: an open question',tag:'1998 to today: debated',
 definition:'Whether adult humans make new neurons is debated. In 1998 Peter Eriksson and colleagues examined the brains of five people who had been given a dividing-cell label during cancer treatment, and found labelled neurons in the dentate gyrus. In 2018 two careful studies of donated brain tissue disagreed: Sorrells and colleagues found that young neurons fall steeply in childhood and could detect none in adults, while Boldrini and colleagues found them persisting into old age.',
 example:'The labelling method used in animals cannot be used in healthy people, so human studies rely on marker proteins in tissue taken after death. How long the tissue waits, and how it is preserved, change how many marked cells can be seen, and it is disputed whether the markers pick out only newborn cells. Nothing here supports any claim about ways to “grow new brain cells”.',
 desc:'Five studies listed by year on the left; choosing one fills a card with its method, sample, finding and the main doubt about it. Below, a slider changes how long a piece of tissue stays in fixative, and a bar shows how many marked cells can then be seen in the same tissue.',
 research:['Eriksson et al. (1998). Neurogenesis in the adult human hippocampus. Nature Medicine 4, 1313–1317. Spalding et al. (2013). Dynamics of hippocampal neurogenesis in adult humans. Cell 153, 1219–1227.','Sorrells et al. (2018). Human hippocampal neurogenesis drops sharply in children to undetectable levels in adults. Nature 555, 377–381. Boldrini et al. (2018). Human hippocampal neurogenesis persists throughout aging. Cell Stem Cell 22, 589–599.','Moreno-Jiménez et al. (2019). Adult hippocampal neurogenesis is abundant in neurologically healthy subjects and drops sharply in patients with Alzheimer’s disease. Nature Medicine 25, 554–560.'],
 dur:13,hint:'Open each study in turn and compare the methods, not just the conclusions. Then lengthen the time in fixative and watch the count from one piece of tissue fall.',
 init:()=>({st:2,fix:1}),
 watch(p){return {st:Math.min(4,Math.floor(p*5)),fix:1+Math.round(p*9)}},
 ui:[{range:'fix',label:'Time in fixative (1 short, 10 long)',min:1,max:10,get:s=>s.fix,act:'fix'},{b:'Next study',act:'next'}],
 on:{st(s,v){s.st=clamp(Math.round(+v)||0,0,4)},next(s){s.st=(s.st+1)%5},fix(s,v){s.fix=clamp(Math.round(+v)||1,1,10)}},
 draw(s,f,X){
  const q=B5_HUM[s.st],seen=B5_fixSeen(s.fix);
  let out=heading(q.side?`${q.who} ${q.y}: new neurons found`:`${q.who} ${q.y}: none found in adults`);
  B5_HUM.forEach((h,i)=>{const on=i===s.st;out+=hit(X,'st',i,`${h.who} ${h.y}`,R(18,50+i*42,196,36,on?C.amberp:'#fff',on?C.amber:C.grid,7)+TBF(28,73+i*42,h.y,13,h.side?C.green:C.coral,'start')+TF(66,73+i*42,h.who,13,C.ink,'start'))});
  out+=R(224,50,358,204,'#fff',C.grid,8);
  const row=(y,lab,txt,col=C.ink)=>TBF(236,y,lab,13,C.muted,'start')+TF(306,y,txt,13,col,'start');
  out+=row(74,'Method',q.m[0])+TF(306,92,q.m[1],13,C.ink,'start')+row(124,'Sample',q.n)+row(156,'Found',q.f,q.side?C.green:C.coral)+row(188,'Doubt',q.d)+TF(236,236,'green year: found them  ·  red year: did not',13,C.muted,'start');
  out+=R(18,266,564,76,'#fff',C.grid,8)+TF(30,286,'The same tissue, counted after a short or a long time in fixative:',13,C.ink,'start');
  out+=R(30,296,330,22,'#fff',C.line,5)+R(30,296,330*seen,22,C.purple,'none',5)+TBF(372,313,Math.round(seen*100)+'% of marked cells still visible',13,C.purple,'start');
  out+=TF(30,334,'Illustrative curve; the effect was reported by Moreno-Jiménez et al.',13,C.muted,'start');
  out+=B5_note('A summary of published studies. The question is not settled.',362);
  return {svg:out,phase:`${q.who} (${q.y}). ${q.m.join(' ')} Sample: ${q.n}. Result: ${q.f} Main doubt: ${q.d} ${s.fix>4?'With long fixation most marked cells in the same tissue go unseen, so a count of zero may reflect the method.':'With short, controlled fixation more marked cells are seen, though what they are is still argued.'}`};
 }});

/* ===================== Lesson: adolescent-brain ===================== */
// Synaptic density by age, as % of the adult level. Schematic curves through the peaks Huttenlocher reported.
const B5_ageOf=u=>(Math.pow(10,u/100*2.45)-1)*.25,B5_uOf=a=>Math.log10(a/.25+1)/2.45*100;
const B5_SYN={front:{name:'Frontal cortex',pts:[[0,100],[1,150],[2,150],[16,100],[70,100]],col:C.purple},vis:{name:'Visual cortex',pts:[[0,40],[.67,165],[11,100],[70,100]],col:C.green}};
function B5_synAt(reg,age){const p=B5_SYN[reg].pts,u=B5_uOf(age);for(let i=1;i<p.length;i++){const u0=B5_uOf(p[i-1][0]),u1=B5_uOf(p[i][0]);if(u<=u1+1e-9)return lerp(p[i-1][1],p[i][1],smooth((u-u0)/(u1-u0)))}return p[p.length-1][1]}
const B5_ageName=a=>a<.04?'birth':a<1?Math.max(1,Math.round(a*12))+(Math.round(a*12)<=1?' month':' months'):a<3?fmt(B5_r1(a))+' years':Math.round(a)+' years';
SCENE({id:'adolescent-brain',name:'Synapses rise, then fall',tag:'Huttenlocher, 1979',
 definition:'In 1979 Peter Huttenlocher counted synapses under the electron microscope in a layer of frontal cortex from 21 human brains, from newborns to people in their nineties. The density of synapses rose through infancy to a peak at about 1 to 2 years, some 50% above the adult level, and then fell slowly until about 16. The developing brain makes more synapses than it keeps and removes the surplus, a process called pruning.',
 example:'Regions differ. In visual cortex the peak came at about 8 months and the adult level was reached by about 11 years; in frontal cortex pruning ran on through adolescence, and a later study of dendritic spines suggests it continues through the twenties. The counts come from few brains, one per age, examined after death.',
 desc:'A graph of synapse density against age from birth to 70 years, on a stretched age scale, for frontal and for visual cortex, with a marker at the chosen age. Beside it, a length of dendrite whose number of spines follows the curve.',
 research:['Huttenlocher (1979). Synaptic density in human frontal cortex: developmental changes and effects of aging. Brain Research 163, 195–205.','Huttenlocher, de Courten, Garey & Van der Loos (1982). Synaptogenesis in human visual cortex: evidence for synapse elimination during normal development. Neuroscience Letters 33, 247–252.','Petanjek et al. (2011). Extraordinary neoteny of synaptic spines in the human prefrontal cortex. PNAS 108, 13281–13286.'],
 dur:12,hint:'Slide the age from birth to 70 and switch between the two regions. The age scale is stretched so that the first years have room.',
 init:()=>({u:35,reg:'front'}),
 watch(p){return {u:Math.round(p*100),reg:'front'}},
 ui:[{range:'u',label:'Age',min:0,max:100,get:s=>s.u,show:u=>B5_ageName(B5_ageOf(u)),act:'u'},{choose:[['front','Frontal cortex'],['vis','Visual cortex']],label:'Region',get:s=>s.reg,act:'reg'}],
 on:{u(s,v){s.u=clamp(Math.round(+v)||0,0,100)},reg(s,v){s.reg=v==='vis'?'vis':'front'}},
 draw(s,f,X){
  const age=B5_ageOf(s.u),q=B5_SYN[s.reg],v=B5_synAt(s.reg,age),pk=s.reg==='vis'?.67:1.5,rising=age<(s.reg==='vis'?.67:1),falling=age>(s.reg==='vis'?.67:2)&&age<(s.reg==='vis'?11:16);
  let out=heading(rising?'Synapses are being added':falling?'Pruning: the surplus is removed':age>=(s.reg==='vis'?11:16)?'The adult level':'At the peak');
  const pl=B5_plot(60,62,360,200,[0,100],[0,190],{xt:[[0,'birth'],[B5_uOf(1),'1'],[B5_uOf(5),'5'],[B5_uOf(16),'16'],[B5_uOf(70),'70']],yt:[[50,'50'],[100,'100'],[150,'150']],xl:'age (years, stretched scale)'});
  out+=pl.svg+TF(60,54,'synapse density (% of the adult level)',13,C.muted,'start')+L(pl.X(0),pl.Y(100),pl.X(100),pl.Y(100),C.line,1.2,'stroke-dasharray="4 4"');
  for(const key of ['front','vis']){const pts=[];for(let u=0;u<=100;u+=1)pts.push([pl.X(u),pl.Y(B5_synAt(key,B5_ageOf(u)))]);out+=B5_poly(pts,B5_SYN[key].col,key===s.reg?3:1.5,key===s.reg?'':'stroke-dasharray="5 4"')}
  out+=TF(pl.X(B5_uOf(.67))+8,pl.Y(172),'visual',13,C.green,'start')+TF(pl.X(B5_uOf(5)),pl.Y(150),'frontal',13,C.purple,'start');
  out+=L(pl.X(s.u),62,pl.X(s.u),262,C.ink,1.2,'stroke-dasharray="3 3"')+Ci(pl.X(s.u),pl.Y(v),6,q.col,'#fff');
  // dendrite with spines
  out+=R(446,62,136,200,'#fff',C.grid,8)+TF(514,80,'a stretch of dendrite',13,C.muted)+L(514,96,514,250,C.ink,6);
  const ns=Math.round(v/10);for(let i=0;i<ns;i++){const y=102+i*(144/Math.max(1,ns-1||1)),sd=i%2?1:-1;out+=L(514+sd*3,y,514+sd*20,y-4,q.col,2)+Ci(514+sd*22,y-4,3.5,q.col)}
  out+=B5_tile(60,300,150,'Age',B5_ageName(age),C.ink)+B5_tile(225,300,195,q.name,s.reg==='vis'&&age<.3?'low, rising fast':'about '+Math.round(v/5)*5+'% of adult',q.col)+B5_tile(435,300,147,'Spines drawn',String(ns),q.col);
  out+=B5_note('Schematic curves through Huttenlocher’s reported peaks, from few brains. Not a growth chart.',366);
  return {svg:out,phase:rising?`At ${B5_ageName(age)} synapses are forming faster than they are lost in ${q.name.toLowerCase()}. Density is a count per volume; the cortex is also growing, so the total number rises even faster.`:
   falling?`At ${B5_ageName(age)} density in ${q.name.toLowerCase()} is falling from its peak. Synapses that are little used are removed and those in use are kept and strengthened, so pruning is part of how experience shapes the circuit. It is not damage.`:
   age>=(s.reg==='vis'?11:16)?`By ${B5_ageName(age)} density in ${q.name.toLowerCase()} is at the adult level, where Huttenlocher found it steady for decades.`:
   `Around ${s.reg==='vis'?'8 months':'1 to 2 years'} density in ${q.name.toLowerCase()} peaks, about ${s.reg==='vis'?'two-thirds':'half'} again above the adult level.`};
 }});

// Group average and individuals. Grey-matter volume as % of the average peak: G(a) = 100 − 0.12 (a − 12)²; people differ by about 10% (sd). Illustrative.
const B5_grey=a=>100-.12*(a-12)**2;
const B5_PEOPLE=range(8).map(i=>{const r=B5_rng(i*29+401);return {o:10*B5_gauss(r),sh:1.5*B5_gauss(r)}});
function B5_fitAges(s){const out=[];for(let a=4;a<=22;a++){if(Math.abs(s.v-B5_grey(a))>20)continue;if(s.two==='up'&&a>15)continue;if(s.two==='down'&&a<9)continue;out.push(a)}return out}
SCENE({id:'adolescent-brain-mri',name:'The average curve and the individual',tag:'Giedd and colleagues, 1999',
 definition:'In 1999 Jay Giedd and colleagues published MRI scans of 145 healthy children and young people aged about 4 to 22, many of them scanned more than once. White matter increased steadily across the whole range, by about 12%. The cortex’s grey matter rose and then fell, with the turning point at around 12 in the frontal lobes and about 16 in the temporal lobes. Later work showed the cortex thinning from back to front, with the regions for planning and control among the last to settle.',
 example:'These are group averages. Brain volumes differ between healthy people of the same age by about 10% either way, far more than the average changes from one year to the next. The age of the grey-matter peak also depends on the method: a 2022 analysis of over 100,000 people put it near 6 years. No scan can explain one teenager’s behaviour.',
 desc:'A graph of grey-matter volume against age from 4 to 22: a thick average curve, a shaded band for the usual spread between people, and eight thin lines for simulated individuals. A horizontal line marks one measured value, and a green bar along the bottom shows every age that value is consistent with.',
 research:['Giedd, Blumenthal, Jeffries, Castellanos, Liu, Zijdenbos, Paus, Evans & Rapoport (1999). Brain development during childhood and adolescence: a longitudinal MRI study. Nature Neuroscience 2, 861–863.','Gogtay et al. (2004). Dynamic mapping of human cortical development during childhood through early adulthood. PNAS 101, 8174–8179.','Bethlehem, Seidlitz, White et al. (2022). Brain charts for the human lifespan. Nature 604, 525–533.'],
 dur:12,hint:'Set a measured value and see which ages it fits. Then add a second scan two years later. This is a model for reasoning about scans, not a way to assess anyone.',
 init:()=>({v:96,two:'0'}),
 watch(p){return p<.5?{v:Math.round(lerp(80,112,p*2)/2)*2,two:'0'}:{v:96,two:p<.75?'up':'down'}},
 ui:[{range:'v',label:'Measured volume (% of the average peak)',min:70,max:130,step:2,get:s=>s.v,act:'v'},{choose:[['0','One scan'],['up','Two scans: rising'],['down','Two scans: falling']],label:'Scans',get:s=>s.two,act:'two'}],
 on:{v(s,v){s.v=clamp(Math.round(+v/2)*2||100,70,130)},two(s,v){s.two=B5_pick(v,['0','up','down'],'0')}},
 draw(s,f,X){
  const fit=B5_fitAges(s),n=fit.length;
  let out=heading(n>=17?'One value fits almost every age':n===0?'Outside the usual range at every age':s.two!=='0'?'Two scans narrow it, a little':'This value fits '+n+' of the 19 ages');
  const pl=B5_plot(60,62,370,200,[4,22],[60,130],{xt:[[4,'4'],[8,'8'],[12,'12'],[16,'16'],[20,'20']],yt:[[80,'80'],[100,'100'],[120,'120']],xl:'age (years)'});
  out+=pl.svg+TF(60,54,'grey-matter volume (% of the average peak)',13,C.muted,'start');
  const up=[],dn=[];for(let a=4;a<=22;a+=.5){up.push([pl.X(a),pl.Y(Math.min(130,B5_grey(a)+20))]);dn.push([pl.X(a),pl.Y(Math.max(60,B5_grey(a)-20))])}
  out+=P('M'+up.concat(dn.reverse()).map(q=>fmt(q[0])+' '+fmt(q[1])).join(' L')+'Z','none',0,C.pale);
  for(const pn of B5_PEOPLE){const pts=[];for(let a=4;a<=22;a+=.5)pts.push([pl.X(a),pl.Y(clamp(100+pn.o-.12*(a-12-pn.sh)**2,61,129))]);out+=B5_poly(pts,C.line,1.3)}
  const av=[];for(let a=4;a<=22;a+=.5)av.push([pl.X(a),pl.Y(B5_grey(a))]);out+=B5_poly(av,C.blue,3)+TF(pl.X(12),pl.Y(B5_grey(12))-8,'average',13,C.blue);
  out+=L(pl.X(4),pl.Y(s.v),pl.X(22),pl.Y(s.v),C.coral,2,'stroke-dasharray="6 4"');
  for(const a of fit)out+=R(pl.X(a-.5<4?4:a-.5),254,pl.X(Math.min(22,a+.5))-pl.X(Math.max(4,a-.5)),8,C.green,'none',0);
  out+=B5_tile(446,62,136,'Measured',s.v+'%',C.coral)+B5_tile(446,116,136,'Ages that fit',n?`${n} of 19`:'none',C.green)+B5_tile(446,170,136,'Scans',s.two==='0'?'one':s.two==='up'?'two, rising':'two, falling',C.ink);
  out+=TF(514,236,'band: usual spread',13,C.muted)+TF(514,252,'thin lines: 8 people',13,C.muted);
  out+=TF(300,318,'Green bar: ages at which this measurement would be unremarkable.',13,C.ink);
  out+=B5_note('Illustrative model: average after Giedd et al. (1999), spread of about 10% between people.',346);
  return {svg:out,phase:n===0?'A value this far from the average would be unusual at any age in the range, and still would not say anything about how a person thinks or behaves.':
   s.two==='0'?`A volume of ${s.v}% is within the usual spread for ${n} of the 19 ages from 4 to 22. The differences between people are several times larger than the change with age, so one scan cannot place a person on the curve.`:
   `Two scans of the same person show the direction of change, which is what Giedd’s repeated scans added. A ${s.two==='up'?'rising':'falling'} volume fits ${n} ages, ${s.two==='up'?'up to the mid-teens':'from about 9 onwards'}, because people’s turning points differ by years. It describes growth; it does not explain behaviour.`};
 }});

// Ages at which four whole-brain measures peak on average (Bethlehem et al. 2022). Curve shapes are schematic.
const B5_MEAS=[['Cortical thickness',1.7,C.green],['Grey-matter volume',5.9,C.blue],['Deep grey matter',14.4,C.purple],['White-matter volume',28.7,C.amber]];
const B5_measF=(a,pk)=>a<pk?.3+.7*smooth(a/pk):1-.4*smooth((a-pk)/(100-pk));
SCENE({id:'adolescent-brain-myths',name:'“Finished at 25”?',tag:'A claim with no sharp basis',
 definition:'It is often said that the brain is finished at 25. No study shows a finishing line at that age, or at any age. Different measures turn at different times: in a 2022 analysis of scans from more than 100,000 people, average cortical thickness peaked before age 2, grey-matter volume at about 6, the deep grey matter at about 14 and white-matter volume at about 29, and all of them kept changing afterwards.',
 example:'The number 25 seems to have grown out of early studies that stopped following people in their early twenties, so they could not show where change ends. Development into the twenties is real, but it is gradual, it differs between people by years, and these are averages over thousands of scans. None of it says what a particular 17 or 24 year old can or cannot do.',
 desc:'Four rows, one for each brain measure, each with a schematic curve from birth to 60 years and a dot at its average peak. A vertical line at the chosen age crosses all four rows, and each row says whether that measure is still rising or how long ago it peaked.',
 research:['Bethlehem, Seidlitz, White et al. (2022). Brain charts for the human lifespan. Nature 604, 525–533.','Sowell, Thompson, Holmes, Jernigan & Toga (1999). In vivo evidence for post-adolescent brain maturation in frontal and striatal regions. Nature Neuroscience 2, 859–861.','Lebel & Beaulieu (2011). Longitudinal development of human brain wiring continues from childhood into adulthood. Journal of Neuroscience 31, 10937–10947.'],
 dur:11,hint:'Move the line to any age you think the brain might be “finished” and read the four rows. Try 18, 25 and 30.',
 init:()=>({age:25}),
 watch(p){return {age:Math.round(lerp(10,40,p))}},
 ui:[{range:'age',label:'Proposed finishing age (years)',min:10,max:40,get:s=>s.age,act:'age'}],
 on:{age(s,v){s.age=clamp(Math.round(+v)||25,10,40)}},
 draw(s,f,X){
  const x0=236,w=340,AX=a=>x0+a/60*w,rising=B5_MEAS.filter(m=>s.age<m[1]).length;
  let out=heading(`At ${s.age}: ${rising?rising+' measure'+(rising>1?'s':'')+' still rising, ':''}${4-rising} past ${4-rising===1?'its':'their'} peak`);
  B5_MEAS.forEach((m,i)=>{const y=58+i*62,Y=v=>y+50-v*42,pts=[];for(let a=0;a<=60;a+=.5)pts.push([AX(a),Y(B5_measF(a,m[1]))]);
   out+=R(x0,y,w,54,'#fff',C.grid,4)+B5_poly(pts,m[2],2.6)+Ci(AX(m[1]),Y(1),5,m[2],'#fff');
   out+=TBF(18,y+18,m[0],13,m[2],'start')+TF(18,y+34,`average peak: ${fmt(m[1])} years`,13,C.muted,'start')+TF(18,y+50,s.age<m[1]?'still rising':`${fmt(B5_r1(s.age-m[1]))} years past its peak`,13,C.ink,'start')});
  out+=L(AX(s.age),54,AX(s.age),300,C.coral,2,'stroke-dasharray="6 4"')+TBF(AX(s.age)+(s.age>32?-6:6),51,'age '+s.age,13,C.coral,s.age>32?'end':'start');
  for(const a of [0,20,40,60])out+=TF(AX(a),318,a,13,C.muted);
  out+=TF(300,340,'Every curve is still moving at the line. There is no age at which all are flat.',13,C.ink);
  out+=B5_note('Peak ages are averages from Bethlehem et al. (2022). Curve shapes are schematic.',362);
  return {svg:out,phase:`Put the line at ${s.age}. ${rising?`White-matter volume is still rising on average${rising>1?', and so is the deep grey matter':''}`:'All four measures are past their average peaks'}; the others have been declining for years, slowly, and will go on doing so. Whichever age is chosen, some measure is still changing, so no age marks the brain as finished. These are averages across many people, with a wide spread around each.`};
 }});
