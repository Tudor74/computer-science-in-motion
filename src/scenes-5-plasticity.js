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
  out+=R(316,276,12,12,C.green,'none',2)+TF(334,287,'glasses and patching',13,C.ink,'start')+R(316,294,12,12,C.line,'none',2)+TF(334,305,'glasses alone',13,C.ink,'start');
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
  out+=B5_poly(pts,C.purple,2.6)+TF(x0+ww-6,pts[pts.length-1][1]-8,'inhibition (GABA)',13,C.purple,'end');
  out+=R(TX(s.day),150,TX(s.day+4)-TX(s.day),20,C.coral,'none',3)+TF(clamp(TX(s.day+2),x0+38,x0+ww-38),142,'eye closed',13,C.coral);
  for(const d of [10,20,30,40,50,60,70,80])out+=L(TX(d),176,TX(d),181,C.line,1)+TF(TX(d),194,d,13,C.muted);
  out+=TF(x0+ww/2,212,'age of the mouse (days after birth)',13,C.muted);
  out+=TF(50,244,'Shift towards the open eye',13,C.muted,'start')+R(50,252,300,22,'#fff',C.line,5)+R(50,252,300*sh,22,C.coral,'none',5)+TBF(362,269,sh>.9?'full shift':sh>0?Math.round(sh*100)+'% of a full shift':'none',14,sh>0?C.coral:C.muted,'start');
  out+=B5_tile(50,290,160,'Inhibition',B5_WIN_N[s.inh],C.purple)+B5_tile(220,290,160,'Critical period',w?`days ${w[0]} to ${w[1]}`:'does not open',C.green)+B5_tile(390,290,160,'Eye closed',`days ${s.day} to ${s.day+4}`,C.coral);
  out+=B5_note('Schematic of results in mice. The boosting drug is a benzodiazepine; no doses are given.',360);
  return {svg:out,phase:!w?'These mice lack an enzyme that makes GABA. Whenever the eye is closed, the cortex stays as it was. The machinery for change is present but nothing has switched it on.':
   sh>.9?`The four days fall inside the window (${B5_WIN[s.inh][2].toLowerCase()}), so cells shift to the open eye. ${s.inh==='late'?'This mouse is an adult. Its critical period had simply never been started.':s.inh==='early'?'The window opened about four days early, because inhibition was strengthened early.':'In normal mice this is roughly days 19 to 32.'}`:
   sh>0?'The closure overlaps the edge of the window, so the shift is partial. Slide it fully inside the green band.':
   `No shift: the eye was closed ${s.day+4<=w[0]?'before the window opened':'after it had closed'}. Once started, the window runs for about two weeks and then shuts, whatever the animal’s age when it began.`};
 }});
