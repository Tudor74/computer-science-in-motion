/* ===================== Brain In Motion · Era 4 · Movement ===================== */
// Motor cortex, spinal reflexes, pattern generators, the cerebellum, the basal ganglia and population coding.
// Sound plays only from on-handlers (Try it buttons), as sparse, quiet clicks. Nothing flashes: spikes are marks on a time axis.
// Models are small and labelled as models; rates and sizes marked "illustrative" are not measurements.

/* ---- shared helpers ---- */
const B4_note=(s,y=368)=>TF(300,y,s,12,C.muted);
const B4_r1=v=>Math.round(v*10)/10;
const B4_rng=seed=>{const r=rng(((seed+1)*2654435761)>>>0||7);r();r();return r};
function B4_pois(r,lam){if(lam<=0)return 0;const m=Math.exp(-lam);let k=0,p=1;do{k++;p*=r()}while(p>m);return k-1}
const B4_click=(at=0,hz=0,gain=.06)=>hz?AUDIO.tone(hz,{dur:.04,gain,at,attack:.003,release:.02}):AUDIO.noise({dur:.012,gain,at});
const B4_reg=(rate,T,ph=.5)=>{const o=[];if(rate>0)for(let t=ph/rate;t<T;t+=1/rate)o.push(t);return o};
function B4_ticks(x0,y,w,times,T,col=C.ink,h=12,sw=1.5){let o='';for(const t of times)if(t>=0&&t<=T){const x=x0+t/T*w;o+=L(x,y-h/2,x,y+h/2,col,sw)}return o}
// An inhibitory connection: a line ending in a bar.
function B4_inh(x1,y1,x2,y2,col=C.coral,w=2.5){const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;return L(x1,y1,x2,y2,col,w)+L(x2-uy*7,y2+ux*7,x2+uy*7,y2-ux*7,col,w+1.5)}
// A point a fraction u of the way along a polyline.
function B4_along(pts,u){const seg=[];let tot=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);tot+=d}
 let g=clamp(u,0,1)*tot;for(let i=0;i<seg.length;i++){if(g<=seg[i]||i===seg.length-1){const q=seg[i]?clamp(g/seg[i],0,1):0;return [lerp(pts[i][0],pts[i+1][0],q),lerp(pts[i][1],pts[i+1][1],q)]}g-=seg[i]}return pts[0]}
const B4_poly=pts=>pts.map((p,i)=>(i?'L':'M')+fmt(p[0])+' '+fmt(p[1])).join('');
// A noisy muscle recording (EMG): quiet baseline with louder bursts. bursts: [[t0,t1,amp]].
function B4_emg(x0,y,w,T,bursts,seed,base=1.2,col=C.ink){const r=B4_rng(seed),n=170;let d='';for(let i=0;i<=n;i++){const t=i/n*T;let a=base;for(const b of bursts)if(t>=b[0]&&t<=b[1])a=b[2];d+=(i?'L':'M')+fmt(x0+i/n*w)+' '+fmt(y+(r()*2-1)*a)}return P(d,col,1.3)}
// Timed animation for Try it: a handler starts it, 'tick' advances s.a from 0 to 1.
const B4_start=(s,ctx,ms=60)=>{s.a=0;ctx.every(ms,'tick')};
const B4_tick=step=>s=>{s.a=Math.min(1,(s.a||0)+step);return s.a>=1?'stop':'keep'};
const B4_ang=d=>((d%360)+360)%360;
const B4_adiff=(a,b)=>{const d=B4_ang(a-b);return d>180?d-360:d};

/* ===================== Lesson: motor-cortex ===================== */
// Fritsch & Hitzig's points, drawn schematically on a dog's cortex seen from above (x = distance from the midline).
const B4_FH=[{k:'neck',lab:'neck',x:26,y:-78,part:'neck'},{k:'fore',lab:'foreleg',x:56,y:-58,part:'foreleg'},{k:'hind',lab:'hind leg',x:32,y:-38,part:'hind leg'},{k:'face',lab:'face',x:74,y:-26,part:'face'},{k:'r1',lab:'',x:52,y:30},{k:'r2',lab:'',x:38,y:72}];
const B4_FHW=[['L','fore'],['L','hind'],['L','face'],['L','neck'],['L','r1'],['R','fore'],['R','hind'],['R','r2']];
function B4_dog(cx,cy,part,side){
 const m=side==='L'?-1:1,base='#7f97a5',skin='#eef3f6',hot=C.coral;let o='';
 o+=P(`M${cx} ${cy+92}q12 20 -2 36`,base,4);
 for(const sg of [-1,1]){const mv=sg===m;
  o+=L(cx+sg*26,cy-22,cx+sg*(mv&&part==='fore'?66:58),cy-(mv&&part==='fore'?52:34),mv&&part==='fore'?hot:base,9);
  o+=L(cx+sg*26,cy+62,cx+sg*(mv&&part==='hind'?66:58),cy+(mv&&part==='hind'?92:76),mv&&part==='hind'?hot:base,9)}
 o+=`<ellipse cx="${cx}" cy="${cy+18}" rx="32" ry="76" fill="${skin}" stroke="${base}" stroke-width="2"/>`;
 o+=R(cx-15,cy-76,30,26,skin,base,6);
 if(part==='neck')o+=L(cx+m*15,cy-74,cx+m*15,cy-52,hot,6);
 o+=`<ellipse cx="${cx-20}" cy="${cy-92}" rx="8" ry="14" fill="${base}"/><ellipse cx="${cx+20}" cy="${cy-92}" rx="8" ry="14" fill="${base}"/>`;
 o+=Ci(cx,cy-94,23,skin,base)+`<ellipse cx="${cx}" cy="${cy-118}" rx="12" ry="14" fill="${skin}" stroke="${base}" stroke-width="2"/>`;
 if(part==='face')o+=Ci(cx+m*11,cy-112,7,hot);
 return o;
}
SCENE({id:'motor-cortex',name:'A cortex that moves the body',tag:'Fritsch and Hitzig, 1870',
 definition:'The motor cortex is the strip of cortex in front of the central sulcus whose activity leads to movement of the opposite side of the body. It was found in 1870, when Gustav Fritsch and Eduard Hitzig in Berlin passed weak electric currents through points on the exposed cortex of dogs.',
 example:'One point at the front moved the opposite foreleg, another the hind leg, others the face or the neck. Points further back gave no movement at the same current. Until then most physiologists, following Flourens, held that the cortex could not be excited at all.',
 desc:'A dog’s brain seen from above with six test points on each hemisphere, and the dog seen from above with the part that moves marked on the side opposite the stimulated hemisphere.',
 research:['Fritsch & Hitzig (1870). Über die elektrische Erregbarkeit des Grosshirns. Archiv für Anatomie, Physiologie und wissenschaftliche Medicin, 300–332.','Ferrier (1876). The Functions of the Brain: maps of movements from stimulating the cortex of monkeys and other animals.','Leyton & Sherrington (1917). Observations on the excitable cortex of the chimpanzee, orang-utan and gorilla. Quarterly Journal of Experimental Physiology 11, 135–222.'],
 dur:12,hint:'Press a point on either hemisphere and see which part of the dog moves, and on which side. Then weaken the current. The positions of the points are schematic.',
 init:()=>({side:'L',site:'fore',cur:1}),
 watch(p){const k=Math.min(7,Math.floor(p*8));return {side:B4_FHW[k][0],site:B4_FHW[k][1],cur:1}},
 ui:[{choose:[[1,'Enough current'],[0,'Too weak']],label:'Current',get:s=>s.cur,act:'cur'}],
 on:{cur(s,v){s.cur=+v},pick(s,v){const [a,b]=String(v).split(':');s.side=a;s.site=b}},
 draw(s,f,X){
  const pt=B4_FH.find(q=>q.k===s.site)||B4_FH[1],moves=!!pt.part&&s.cur===1,opp=s.side==='L'?'R':'L',sideName=s.side==='L'?'left':'right',oppName=opp==='L'?'left':'right';
  let out=heading(moves?`${sideName[0].toUpperCase()+sideName.slice(1)} cortex, ${pt.lab} point: ${pt.k==='neck'||pt.k==='face'?'the '+pt.lab+' moves on the '+oppName:'the '+oppName+' '+pt.lab+' moves'}`:(pt.part?'Too weak a current: nothing moves':'A point further back: nothing moves'));
  const bx=150,by=200;
  out+=TF(bx,by-112,'front',12,C.muted)+TF(bx,by+124,'back',12,C.muted);
  for(const sg of [-1,1]){out+=`<ellipse cx="${bx+sg*52}" cy="${by}" rx="46" ry="104" fill="#f3ece6" stroke="${C.line}" stroke-width="2"/>`+P(`M${bx+sg*8} ${by-50}q${sg*24} -12 ${sg*40} 4`,'#b9a898',2)}
  out+=TF(bx-52,by+142,'left hemisphere',12,C.muted)+TF(bx+52,by+142,'right hemisphere',12,C.muted);
  for(const sd of ['L','R'])for(const q of B4_FH){const sg=sd==='L'?-1:1,x=bx+sg*q.x,y=by+q.y,on=sd===s.side&&q.k===s.site;
   out+=hit(X,'pick',sd+':'+q.k,`${sd==='L'?'Left':'Right'} hemisphere, ${q.lab?q.lab+' point':'a point further back'}`,Ci(x,y,on?10:7,on?(moves?C.coral:C.muted):'#fff',on?(moves?C.coral:C.muted):(q.part?C.blue:C.line)))}
  out+=Ci(bx-118,by+160,5,'#fff',C.blue)+TF(bx-108,by+164,'moved a body part',12,C.muted,'start')+Ci(bx+22,by+160,5,'#fff',C.line)+TF(bx+32,by+164,'no movement',12,C.muted,'start');
  const dx=450,dy=196;out+=B4_dog(dx,dy,moves?pt.k:null,opp);
  out+=TF(dx-78,dy+128,'dog’s left',12,C.muted)+TF(dx+78,dy+128,'dog’s right',12,C.muted)+TF(dx,dy+150,'The dog seen from above, head at the top',12,C.muted);
  if(moves){const m=opp==='L'?-1:1,yy=pt.k==='fore'?dy-58:pt.k==='hind'?dy+100:pt.k==='face'?dy-128:dy-84;out+=TB(dx+m*74,yy,'moves',14,C.coral,m<0?'end':'start')}
  out+=arrow(262,by-20,340,by-20,moves?C.coral:C.line,2.5)+TF(301,by-30,moves?'crosses over':'no response',12,moves?C.coral:C.muted);
  return {svg:out,phase:moves?`Current through the ${pt.lab} point of the ${sideName} hemisphere moves the ${pt.lab} on the dog’s ${oppName} side. Each excitable point has its own body part, always on the opposite side: the cortex holds a map for movement.`:(pt.part?'Fritsch and Hitzig used the weakest current that worked, one barely felt on the tip of the tongue. Below that, the same point gives nothing.':'The same current applied further back moves nothing. Only the front region is “excitable”, which is why it came to be called the motor cortex.')};
 }});

// Corticospinal pathway, seen from behind so that left is on the left. Latencies after transcranial stimulation (approximate).
const B4_LAT={hand:21,foot:30};
function B4_cstPath(side,target){const m=side==='L'?-1:1,xs=170+m*40,xi=170+m*12,xo=170-m*12,ye=target==='hand'?205:318,end=target==='hand'?[170-m*108,252]:[170-m*78,356];
 return [[xs,74],[xi,112],[xi,140],[xo,166],[xo,ye],end]}
SCENE({id:'motor-cortex-pathway',name:'From cortex to muscle',tag:'The pathway crosses, and it is fast',
 definition:'Large pyramidal cells in the motor cortex (described by Vladimir Betz in 1874) send axons down through the brainstem into the spinal cord: the corticospinal tract. In the medulla most of these fibres, roughly 85–90%, cross to the other side, which is why each hemisphere moves the opposite half of the body. In the cord they drive motor neurons, whose axons run out to the muscles.',
 example:'A brief magnetic pulse over the motor cortex makes a hand muscle on the opposite side twitch about 20 ms later, and a muscle of the lower leg about 30 ms later: the route to the leg is longer.',
 desc:'The brain, brainstem and spinal cord seen from behind with the corticospinal pathway crossing in the medulla and running to a hand or foot muscle, beside a recording of the muscle’s response and its delay.',
 research:['Betz (1874). Anatomischer Nachweis zweier Gehirncentra. Centralblatt für die medizinischen Wissenschaften 12, 578–580, 595–599.','Merton & Morton (1980). Stimulation of the cerebral cortex in the intact human subject. Nature 285, 227.','Barker, Jalinous & Freeston (1985). Non-invasive magnetic stimulation of human motor cortex. The Lancet 325, 1106–1107. (Delays here are typical values and vary with height and the muscle recorded.)'],
 dur:12,hint:'Choose a hemisphere and a muscle, then press Stimulate and read the delay. Record both muscles and compare your delays with the published ones. This is a simulation of a laboratory method.',
 init:()=>({side:'L',target:'hand',recs:{hand:[],foot:[]},last:null,a:1,n:0}),
 watch(p){const tg=p<.5?'hand':'foot',u=(p<.5?p:p-.5)*2,a=clamp(u/.6,0,1);return {side:'L',target:tg,recs:{hand:p>=.3?[21.2]:[],foot:p>=.8?[29.6]:[]},last:a>=1?{target:tg,lat:tg==='hand'?21.2:29.6}:null,a,n:0}},
 ui:[{choose:[['L','Left hemisphere'],['R','Right']],label:'Hemisphere',get:s=>s.side,act:'side'},{choose:[['hand','Hand muscle'],['foot','Lower-leg muscle']],label:'Muscle',get:s=>s.target,act:'target'},{b:'Stimulate',act:'stim'}],
 on:{side(s,v){s.side=v;s.last=null;s.a=1},target(s,v){s.target=v;s.last=null;s.a=1},
  stim(s,v,ctx){s.n++;const r=B4_rng(s.n*31+(s.target==='hand'?1:2)),lat=B4_r1(B4_LAT[s.target]+(r()*2-1)*1.2);s.recs[s.target].push(lat);if(s.recs[s.target].length>12)s.recs[s.target].shift();s.last={target:s.target,lat};B4_start(s,ctx,50);return 'keep'},
  tick:B4_tick(.08)},
 draw(s){
  const m=s.side==='L'?-1:1,oppName=s.side==='L'?'right':'left',mus=s.target==='hand'?'hand':'lower leg',done=s.last&&s.a>=1&&s.last.target===s.target;
  let out=heading(done?`${s.side==='L'?'Left':'Right'} cortex → ${oppName} ${mus}: ${fmt(s.last.lat)} ms`:`${s.side==='L'?'Left':'Right'} motor cortex to the ${oppName} ${mus}`);
  // anatomy
  for(const sg of [-1,1])out+=`<ellipse cx="${170+sg*42}" cy="74" rx="40" ry="28" fill="#f3ece6" stroke="${C.line}" stroke-width="2"/>`;
  out+=R(152,100,36,74,'#f3ece6',C.line,10)+R(156,170,28,172,'#f3ece6',C.line,8);
  for(const sg of [-1,1]){out+=P(B4_poly([[170+sg*40,74],[170+sg*12,112],[170+sg*12,140],[170-sg*12,166],[170-sg*12,330]]),'#c9d6de',2);
   out+=P(B4_poly([[170+sg*12,205],[170+sg*108,252]]),'#c9d6de',2)+P(B4_poly([[170+sg*12,318],[170+sg*78,356]]),'#c9d6de',2);
   out+=`<ellipse cx="${170+sg*114}" cy="256" rx="13" ry="8" fill="${C.pale}" stroke="${C.line}" stroke-width="1.5"/><ellipse cx="${170+sg*84}" cy="360" rx="13" ry="8" fill="${C.pale}" stroke="${C.line}" stroke-width="1.5"/>`}
  out+=TF(56,240,'hand',12,C.muted)+TF(284,240,'hand',12,C.muted)+TF(66,362,'leg',12,C.muted,'end')+TF(274,362,'leg',12,C.muted,'start');
  out+=TF(222,112,'motor cortex',12,C.muted,'start')+TF(40,74,'left',12,C.muted)+TF(300,74,'right',12,C.muted)+TF(196,156,'crossing in',12,C.muted,'start')+TF(196,170,'the medulla',12,C.muted,'start')+TF(196,284,'spinal',12,C.muted,'start')+TF(196,298,'cord',12,C.muted,'start');
  const path=B4_cstPath(s.side,s.target),ye=path[4];
  out+=P(B4_poly(path.slice(0,5)),C.blue,3.5)+P(B4_poly(path.slice(4)),C.coral,3.5)+Ci(ye[0],ye[1],6,'#fff',C.coral)+Ci(path[0][0],path[0][1],7,C.blue);
  if(s.a<1){const q=B4_along(path,s.a);out+=Ci(q[0],q[1],7,C.amber,'#fff')}
  out+=TF(330,330,'Seen from behind:',12,C.muted,'start')+TF(330,345,'left is on the left.',12,C.muted,'start');
  // scope
  const x0=352,w=224,yb=128,T=40,X2=t=>x0+t/T*w;out+=R(340,52,246,116,'#fff',C.grid,10)+L(x0,yb+26,x0+w,yb+26,C.line,1.4);
  for(const t of [0,10,20,30,40])out+=L(X2(t),yb+26,X2(t),yb+31,C.line,1.2)+TF(X2(t),yb+43,t,12,C.muted);
  out+=TF(x0+w,68,'ms after the pulse',12,C.muted,'end')+L(X2(0),yb-52,X2(0),yb+26,C.amber,2)+TF(X2(0)+4,yb-44,'pulse',12,C.amber,'start');
  if(done){const t0=s.last.lat;let d=`M${fmt(x0)} ${yb}L${fmt(X2(t0))} ${yb}`;for(let i=0;i<=40;i++){const u=i/40,t=t0+u*7;d+='L'+fmt(X2(Math.min(T,t)))+' '+fmt(yb-34*Math.sin(u*2*Math.PI)*Math.exp(-u*1.2))}d+=`L${fmt(x0+w)} ${yb}`;out+=P(d,C.ink,2)+L(X2(t0),yb-52,X2(t0),yb+26,C.coral,1.4,'stroke-dasharray="4 3"')+TBF(Math.min(X2(t0)+4,x0+w-52),yb-44,fmt(t0)+' ms',12,C.coral,'start')}
  else out+=L(x0,yb,x0+w,yb,C.ink,2)+(s.a<1?'':TF(x0+w/2,yb-14,'muscle quiet: press Stimulate',12,C.muted));
  // table
  const mean=a=>a.length?fmt(B4_r1(sum(a)/a.length))+' ms':'—';
  out+=R(340,182,246,128,'#fff',C.grid,10)+TBF(352,204,'Delay to the muscle',13,C.ink,'start')+TF(470,226,'yours',12,C.muted)+TF(545,226,'published',12,C.muted);
  out+=TF(352,250,'hand',13,C.ink,'start')+TBF(470,250,mean(s.recs.hand),13,C.blue)+TF(545,250,'about 20 ms',12,C.muted);
  out+=TF(352,276,'lower leg',13,C.ink,'start')+TBF(470,276,mean(s.recs.foot),13,C.blue)+TF(545,276,'about 30 ms',12,C.muted);
  out+=TF(352,300,`pulses given: ${s.recs.hand.length+s.recs.foot.length}`,12,C.muted,'start');
  return {svg:out,phase:done?`The signal left the ${s.side==='L'?'left':'right'} cortex (blue), crossed in the medulla, met a motor neuron in the cord and ran out along its axon (orange) to the ${oppName} ${mus}, all in about ${fmt(s.last.lat)} ms. ${s.recs.hand.length&&s.recs.foot.length?'The leg’s reply comes roughly 9 ms after the hand’s because its route is longer.':'Now record the other muscle and compare.'}`:`Blue: the corticospinal fibre from the cortex, crossing in the medulla. Orange: the motor neuron’s axon to the ${mus}. Press Stimulate to time the journey.`};
 }});

// Long trains of stimulation in a monkey's motor cortex (Graziano et al. 2002). Hand positions are schematic.
const B4_ARM={S:[150,206],l1:72,l2:80,starts:[[236,304],[298,236],[214,100]],sites:[{k:'A',end:[158,134],name:'hand to the mouth',what:'the hand closes and comes to the mouth'},{k:'B',end:[206,226],name:'hand in front of the chest',what:'the hand comes to the space in front of the chest'},{k:'C',end:[288,168],name:'arm stretched out',what:'the arm reaches out, the hand opening'}]};
function B4_armIK(H){const {S,l1,l2}=B4_ARM;let dx=H[0]-S[0],dy=H[1]-S[1],d=Math.hypot(dx,dy)||1;const mx=l1+l2-2;if(d>mx){dx*=mx/d;dy*=mx/d;d=mx}const a=Math.atan2(dy,dx),b=Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1));return {E:[S[0]+l1*Math.cos(a+b),S[1]+l1*Math.sin(a+b)],H:[S[0]+dx,S[1]+dy]}}
const B4_GW=[[0,0],[0,1],[0,2],[1,0],[1,2],[2,1]];
SCENE({id:'motor-cortex-actions',name:'Muscles, movements or actions?',tag:'What the map is a map of is debated',
 definition:'What the motor map represents is still debated. Brief stimulation gives a twitch of a few muscles, which suggested a map of muscles, yet the territories of neighbouring muscles and joints overlap heavily. In 2002 Michael Graziano and colleagues stimulated monkey motor cortex for half a second, about as long as a reach, and each site drove the arm to one final posture from wherever it started.',
 example:'One site brought the hand to the mouth with the mouth opening; another brought it in front of the chest; another stretched the arm out. Critics reply that such long trains spread through connected circuits, so the posture may belong to the network and not to the site.',
 desc:'A monkey’s arm drawn as two segments with three starting positions for the hand, three stimulation sites, and the path the hand takes for a short or a long train of stimulation.',
 research:['Graziano, Taylor & Moore (2002). Complex movements evoked by microstimulation of precentral cortex. Neuron 34, 841–851. (Debated: see Strick (2002), Nature Neuroscience 5, 714–715.)','Schieber (2001). Constraints on somatotopic organization in the primary motor cortex. Journal of Neurophysiology 86, 2125–2143.','Leyton & Sherrington (1917). Quarterly Journal of Experimental Physiology 11, 135–222.'],
 dur:14,hint:'Pick a site and a starting position for the hand, then switch between a short and a long train. With the long train, try all three starts for one site and see where the hand ends up.',
 init:()=>({site:0,start:0,dur:'long',u:1,tried:{'0:0':1}}),
 watch(p){const k=Math.min(5,Math.floor(p*6)),u=clamp((p*6-k)/.7,0,1),tr={};for(let i=0;i<=k;i++)tr[B4_GW[i][0]+':'+B4_GW[i][1]]=1;return {site:B4_GW[k][0],start:B4_GW[k][1],dur:'long',u:smooth(u),tried:tr}},
 ui:[{choose:[[0,'Site A'],[1,'Site B'],[2,'Site C']],label:'Site',get:s=>s.site,act:'site'},{choose:[['short','50 ms train'],['long','500 ms train']],label:'Train',get:s=>s.dur,act:'dur'},{choose:[[0,'Start 1'],[1,'Start 2'],[2,'Start 3']],label:'Start',get:s=>s.start,act:'start'}],
 on:{site(s,v){s.site=+v;if(s.dur==='long')s.tried[s.site+':'+s.start]=1},dur(s,v){s.dur=v;if(v==='long')s.tried[s.site+':'+s.start]=1},start(s,v){s.start=+v;if(s.dur==='long')s.tried[s.site+':'+s.start]=1}},
 draw(s,f,X){
  const st=B4_ARM.sites[s.site],A=B4_ARM.starts[s.start],long=s.dur==='long',u=(s.u===undefined?1:s.u)*(long?1:.14),H=[lerp(A[0],st.end[0],u),lerp(A[1],st.end[1],u)],ik=B4_armIK(H),S=B4_ARM.S;
  let out=heading(long?`Site ${st.k}, 500 ms: ${st.name}`:`Site ${st.k}, 50 ms: a brief twitch`);
  out+=R(96,196,96,150,'#eef3f6',C.line,26)+Ci(118,116,36,'#eef3f6',C.line)+Ci(146,128,5,C.muted)+TF(100,74,'head',12,C.muted);
  if(long)for(let i=0;i<3;i++)if(s.tried[s.site+':'+i]&&i!==s.start)out+=L(B4_ARM.starts[i][0],B4_ARM.starts[i][1],st.end[0],st.end[1],C.line,2,'stroke-dasharray="5 4"');
  out+=L(A[0],A[1],H[0],H[1],C.coral,2.5,'stroke-dasharray="5 4"');
  B4_ARM.starts.forEach((q,i)=>{out+=hit(X,'start',i,`Starting position ${i+1} for the hand`,Ci(q[0],q[1],12,i===s.start?C.amberp:'#fff',i===s.start?C.amber:C.line)+TF(q[0],q[1]+4,i+1,12,C.ink))});
  out+=L(S[0],S[1],ik.E[0],ik.E[1],'#7f97a5',12)+L(ik.E[0],ik.E[1],ik.H[0],ik.H[1],'#7f97a5',10)+Ci(S[0],S[1],8,'#fff','#7f97a5')+Ci(ik.E[0],ik.E[1],6,'#fff','#7f97a5')+Ci(ik.H[0],ik.H[1],9,C.coral,'#fff');
  if(long)out+=Ci(st.end[0],st.end[1],15,'none',C.green,'stroke-dasharray="3 3"');
  out+=TF(170,362,'1–3: where the hand starts. Dashed ring: where it ends.',12,C.muted);
  // sites and train
  out+=R(352,52,234,92,'#fff',C.grid,10)+TBF(364,72,'Motor cortex: three sites',13,C.ink,'start');
  B4_ARM.sites.forEach((q,i)=>{const x=396+i*72;out+=hit(X,'site',i,`Stimulation site ${q.k}`,Ci(x,104,17,i===s.site?C.coral:'#fff',i===s.site?C.coral:C.blue)+TB(x,109,q.k,14,i===s.site?'#fff':C.ink))});
  out+=TF(469,137,'positions schematic',12,C.muted);
  out+=R(352,154,234,66,'#fff',C.grid,10)+TBF(364,174,'Train of pulses',13,C.ink,'start')+L(364,202,574,202,C.line,1.4)+R(364,190,long?210:21,12,C.coral,'none',3)+TF(574,186,long?'500 ms':'50 ms',12,C.coral,'end')+TF(364,216,'0',12,C.muted,'start')+TF(574,216,'500 ms',12,C.muted,'end');
  out+=R(352,230,234,112,'#fff',C.grid,10)+TBF(364,250,'Two readings',13,C.ink,'start')+TF(364,270,'Muscle map: a site drives a',12,long?C.muted:C.ink,'start')+TF(364,285,'few muscles (a twitch).',12,long?C.muted:C.ink,'start')+TF(364,305,'Action map: a site drives the',12,long?C.ink:C.muted,'start')+TF(364,320,'body to one useful posture.',12,long?C.ink:C.muted,'start')+TBF(364,337,'Still debated.',12,C.amber,'start');
  const nTried=[0,1,2].filter(i=>s.tried[s.site+':'+i]).length;
  return {svg:out,phase:long?`With a 500 ms train at site ${st.k}, ${st.what}, starting from position ${s.start+1}. ${nTried>=2?`You have tried ${nTried} starts for this site and the hand ends in the same place each time: the site specifies an end posture, not one fixed muscle twitch.`:'Try another starting position for the same site.'} Whether this shows a map of actions, or the spread of a long stimulus through the network, is argued over.`:`A 50 ms train gives only a small twitch from wherever the hand is. Early maps were made this way, and read as maps of muscles; even so, Leyton and Sherrington and later Schieber found that the territories overlap.`};
 }});

/* ===================== Lesson: spinal-reflexes ===================== */
const B4_kneeDelay=s=>2*(s.d/100)/s.v*1000+2;
SCENE({id:'spinal-reflexes',name:'The knee jerk, timed',tag:'A reflex arc with one synapse',
 definition:'A reflex is a fast, automatic response produced by a short circuit from a sensory neuron through the spinal cord to a muscle. In the knee jerk, described by Erb and by Westphal in 1875, a tap on the tendon below the kneecap stretches the thigh muscle; stretch sensors in the muscle fire, their axons excite motor neurons in the cord directly, and the same muscle contracts.',
 example:'With about half a metre of nerve each way at about 55 m/s, plus about 1 ms at the synapse in the cord and 1 ms at the nerve–muscle junction, the muscle answers about 20 ms after the tap. A deliberate kick in response to a signal takes several times longer.',
 desc:'A seated leg with a tendon hammer, the sensory axon running up to the spinal cord and the motor axon running back, beside a recording from the thigh muscle showing the delay after the tap and how the delay adds up.',
 research:['Erb (1875) and Westphal (1875), independently, in Archiv für Psychiatrie und Nervenkrankheiten 5: the first descriptions of the knee jerk.','Sherrington (1906). The Integrative Action of the Nervous System. Yale University Press. (Nobel Prize 1932, with Edgar Adrian.)','Lloyd (1943). Conduction and synaptic transmission of the reflex response to stretch in spinal cats. Journal of Neurophysiology 6, 317–326: the delay inside the cord leaves time for only one synapse.'],
 dur:12,hint:'Press the hammer (or Tap) and read the delay on the recording. Change the length of the nerve path and the conduction speed to see what the delay is made of. A simulation: not a medical test.',
 init:()=>({d:50,v:55,a:1,n:0,taps:[]}),
 watch(p){const a=clamp((p%.5)/.4,0,1);return {d:p<.5?50:35,v:55,a,n:a>=1?1:0,taps:[]}},
 ui:[{b:'Tap the tendon',act:'tap'},{range:'d',label:'Nerve path, each way',min:30,max:70,get:s=>s.d,act:'d',show:v=>v+' cm'},{range:'v',label:'Conduction speed',min:30,max:70,get:s=>s.v,act:'v',show:v=>v+' m/s'}],
 on:{d(s,v){s.d=+v;s.n=0;s.a=1},v(s,v){s.v=+v;s.n=0;s.a=1},
  tap(s,v,ctx){s.n++;const r=B4_rng(s.n*17+s.d),lat=B4_r1(B4_kneeDelay(s)+(r()*2-1)*.8);s.lat=lat;s.taps.push(lat);if(s.taps.length>10)s.taps.shift();B4_start(s,ctx,50);return 'keep'},tick:B4_tick(.07)},
 draw(s,f,X){
  const D=B4_kneeDelay(s),leg=s.d/100/s.v*1000,done=s.n>0&&s.a>=1,lat=s.lat||B4_r1(D),kick=s.n>0?smooth(clamp((s.a-.8)/.2,0,1)):0;
  let out=heading(done?`Muscle answers ${fmt(lat)} ms after the tap`:'Tap the tendon and time the reflex');
  // cord
  out+=R(40,58,96,70,'#f3ece6',C.line,16)+P('M66 76q22 16 44 0q-6 18 0 34q-22 -16 -44 0q6 -16 0 -34z','#d8c9bb',1.5,'#e6d9cd')+TF(88,50,'spinal cord',12,C.muted);
  // leg
  const hip=[70,214],knee=[236,214],th=kick*.6,ank=[knee[0]+112*Math.sin(th),knee[1]+112*Math.cos(th)];
  out+=L(hip[0],hip[1],knee[0],knee[1],'#c8d3da',30)+L(knee[0],knee[1],ank[0],ank[1],'#c8d3da',24)+`<ellipse cx="150" cy="202" rx="62" ry="9" fill="${done||s.a>.75&&s.n?C.coral:C.coralp}" stroke="${C.coral}" stroke-width="1.5"/>`+Ci(knee[0]+4,knee[1],13,'#fff',C.line);
  out+=TF(150,246,'thigh muscle',12,C.muted)+L(knee[0]+10,knee[1]+12,knee[0]+10,knee[1]+34,C.muted,3);
  out+=hit(X,'tap',0,'Tap the tendon with the hammer',L(264,238,300,262,C.dark,4)+R(252,224,20,26,C.amber,'none',5)+TF(304,280,'hammer',12,C.muted));
  // axons
  const sens=[[136,200],[136,150],[112,112],[96,100]],mot=[[100,94],[150,96],[166,140],[166,196]];
  out+=P(B4_poly(sens),C.blue,2.6)+P(B4_poly(mot),C.coral,2.6)+Ci(98,97,5,'#fff',C.ink)+Ci(136,200,5,C.blue)+TF(128,172,'sensory',12,C.blue,'end')+TF(176,150,'motor',12,C.coral,'start');
  if(s.n>0&&s.a<.8){const q=s.a<.4?B4_along(sens,s.a/.4):B4_along(mot,(s.a-.4)/.4);out+=Ci(q[0],q[1],7,C.amber,'#fff')}
  out+=TF(170,356,'Slowed down many times so that you can follow it.',12,C.muted);
  // scope
  const x0=356,w=216,yb=110,T=50,X2=t=>x0+t/T*w;out+=R(344,52,242,104,'#fff',C.grid,10)+L(x0,yb+24,x0+w,yb+24,C.line,1.4);
  for(const t of [0,10,20,30,40,50])out+=L(X2(t),yb+24,X2(t),yb+29,C.line,1.2)+TF(X2(t),yb+42,t,12,C.muted);
  out+=TF(x0+w,68,'ms after the tap',12,C.muted,'end')+L(X2(0),yb-36,X2(0),yb+24,C.amber,2);
  out+=done?B4_emg(x0,yb,w,T,[[lat,lat+9,16]],7+s.n)+L(X2(lat),yb-36,X2(lat),yb+24,C.coral,1.4,'stroke-dasharray="4 3"')+TBF(X2(lat)+4,yb-26,fmt(lat)+' ms',12,C.coral,'start'):B4_emg(x0,yb,w,T,[],3);
  // sums
  out+=R(344,166,242,148,'#fff',C.grid,10)+TBF(356,186,'What the delay is made of',13,C.ink,'start');
  const row=(y,a,b,col=C.ink)=>TF(356,y,a,12,col,'start')+TF(574,y,b,12,col,'end');
  out+=row(206,`up the sensory axon, ${s.d} cm`,fmt(B4_r1(leg))+' ms',C.blue)+row(224,'one synapse in the cord','≈ 1 ms')+row(242,`down the motor axon, ${s.d} cm`,fmt(B4_r1(leg))+' ms',C.coral)+row(260,'nerve to muscle','≈ 1 ms')+L(356,268,574,268,C.line,1.2)+TBF(356,286,'model total',12,C.ink,'start')+TBF(574,286,fmt(B4_r1(D))+' ms',12,C.ink,'end')+row(304,'recorded in people','about 20 ms',C.muted);
  out+=TF(465,334,s.taps.length?`your taps: ${s.taps.length}, mean ${fmt(B4_r1(sum(s.taps)/s.taps.length))} ms`:'no taps yet',12,C.blue);
  return {svg:out,phase:done?`The tap stretched the muscle; its stretch sensors fired; the signal ran ${s.d} cm up to the cord, crossed one synapse and ran ${s.d} cm back: ${fmt(B4_r1(D))} ms in this model, ${fmt(lat)} ms on this tap. There is no time in that for a trip to the brain and back.`:`Two axons and one synapse: ${fmt(B4_r1(leg))} ms up, about 1 ms across, ${fmt(B4_r1(leg))} ms down and about 1 ms at the muscle make ${fmt(B4_r1(D))} ms. Press the hammer to test it.`};
 }});

SCENE({id:'spinal-reflexes-reciprocal',name:'Reciprocal inhibition',tag:'One muscle contracts, its opponent is switched off',
 definition:'Reciprocal inhibition is the silencing of a muscle’s opponent while the muscle itself is excited. Sherrington showed that when a reflex contracts one muscle of a pair, the opposing muscle relaxes at the same moment. The same sensory axon that excites the extensor’s motor neurons also excites a small inhibitory neuron in the cord, which quietens the motor neurons of the flexor.',
 example:'With the inhibition working, the knee straightens freely. When it is blocked, the kick stretches the muscle at the back of the thigh, that muscle’s own stretch reflex fires, and the two muscles pull against each other.',
 desc:'A circuit in the spinal cord in which a stretch sensor’s axon excites the extensor motor neuron and an inhibitory interneuron that quietens the flexor motor neuron, beside recordings from the two muscles and the size of the kick.',
 research:['Sherrington (1897). On reciprocal innervation of antagonistic muscles. Third note. Proceedings of the Royal Society 60, 414–417; and The Integrative Action of the Nervous System (1906).','Eccles, Fatt & Landgren (1956). Central pathway for direct inhibitory action of impulses in largest afferent nerve fibres to muscle. Journal of Neurophysiology 19, 75–98: the inhibitory interneuron in this pathway.','Bradley, Easton & Eccles (1953). An investigation of primary or direct inhibition. Journal of Physiology 122, 474–488: strychnine blocks this inhibition. (Sizes of the recordings here are illustrative.)'],
 dur:12,hint:'Tap with the inhibition working, then block it and tap again. Compare the recording from the back of the thigh and the size of the kick.',
 init:()=>({inh:1,k:2,a:1,n:1}),
 watch(p){return {inh:p<.5?1:0,k:2,a:clamp((p%.5)/.35,0,1),n:1}},
 ui:[{choose:[[1,'Inhibition working'],[0,'Blocked']],label:'Inhibition',get:s=>s.inh,act:'inh'},{range:'k',label:'Tap strength',min:1,max:3,get:s=>s.k,act:'k',show:v=>['','light','medium','firm'][v]},{b:'Tap the tendon',act:'tap'}],
 on:{inh(s,v){s.inh=+v;s.a=1},k(s,v){s.k=+v;s.a=1},tap(s,v,ctx){s.n++;B4_start(s,ctx,50);return 'keep'},tick:B4_tick(.07)},
 draw(s){
  const on=!!s.inh,a=s.a===undefined?1:s.a,done=a>=1,amp=4+s.k*4,kick=Math.round((on?1:.45)*[0,50,75,100][s.k]);
  let out=heading(on?'Extensor contracts, flexor is silenced':'Inhibition blocked: both muscles contract');
  out+=R(34,54,250,214,'#f7f1ec',C.line,18)+TF(159,72,'inside the spinal cord',12,C.muted);
  const E=[214,120],F=[214,214],I=[136,196],inp=[[20,318],[60,290],[70,160]];
  out+=P(B4_poly(inp),C.blue,2.6)+arrow(70,160,196,122,C.blue,2.6)+arrow(70,190,120,195,C.blue,2.6)+L(70,160,70,190,C.blue,2.6);
  out+=on?B4_inh(152,200,194,211,C.purple,3):L(152,200,194,211,C.line,2,'stroke-dasharray="4 4"');
  out+=Ci(E[0],E[1],17,C.coralp,C.coral)+Ci(F[0],F[1],17,C.pale,C.blue)+Ci(I[0],I[1],14,on?C.purple:'#fff',on?C.purple:C.line);
  out+=TF(214,96,'extensor',12,C.coral)+TF(214,246,'flexor',12,C.blue)+TF(214,260,'motor neuron',12,C.muted)+TF(134,228,on?'inhibitory':'blocked',12,on?C.purple:C.muted)+TF(134,242,'interneuron',12,on?C.purple:C.muted);
  out+=arrow(231,120,318,120,C.coral,2.6)+arrow(231,214,318,214,C.blue,2.6)+TF(40,340,'from the stretch sensor',12,C.blue,'start')+TF(40,355,'in the front thigh muscle',12,C.blue,'start');
  if(!done){const q=a<.5?B4_along(inp,a/.5):B4_along([[70,160],[196,122]],(a-.5)/.5);out+=Ci(q[0],q[1],7,C.amber,'#fff')}
  // recordings
  const x0=350,w=226,T=100,X2=t=>x0+t/T*w;out+=R(338,52,248,202,'#fff',C.grid,10);
  out+=TBF(350,72,'Front of thigh (extensor)',12,C.coral,'start')+(done?B4_emg(x0,104,w,T,[[20,46,amp]],11,1.2,C.coral):B4_emg(x0,104,w,T,[],11,1.2,C.coral));
  out+=TBF(350,146,'Back of thigh (flexor)',12,C.blue,'start')+(done?B4_emg(x0,178,w,T,on?[[22,70,.25]]:[[46,76,amp*.75]],13,2.2,C.blue):B4_emg(x0,178,w,T,[],13,2.2,C.blue));
  out+=L(x0,214,x0+w,214,C.line,1.4);for(const t of [0,20,40,60,80,100])out+=L(X2(t),214,X2(t),219,C.line,1.2)+TF(X2(t),231,t,12,C.muted);
  out+=TF(x0+w/2,247,'ms after the tap',12,C.muted)+L(X2(0),84,X2(0),214,C.amber,1.6);
  if(done)out+=on?TF(X2(46),168,'goes quiet',12,C.purple):TF(X2(61),160,'its own stretch reflex',12,C.blue);
  // kick meter
  out+=R(338,262,248,82,'#fff',C.grid,10)+TBF(350,282,'Size of the kick (illustrative)',12,C.ink,'start')+R(350,292,180,16,'#eef3f6','none',6)+R(350,292,180*(done?kick:0)/100,16,on?C.green:C.amber,'none',6)+TF(350,330,done?(on?'Free movement: nothing pulls back.':'Smaller, stiffer: the muscles fight.'):'Tap to see the kick.',12,C.muted,'start')+(done?TBF(574,306,kick+'%',13,on?C.green:C.amber,'end'):'');
  return {svg:out,phase:on?'The sensory axon branches in the cord. One branch excites the extensor’s motor neuron; the other excites an inhibitory interneuron (purple), which quietens the flexor’s motor neuron, so the opposing muscle lets go just as the extensor pulls. Sherrington called this reciprocal innervation.':'With the inhibitory step blocked, as strychnine does in animal experiments, nothing silences the flexor. The kick stretches it, its own stretch reflex fires a little later, and both muscles contract together. Co-ordinated movement needs inhibition as much as excitation.'};
 }});

// Five motor units, recruited in order of size (Henneman): thresholds in drive units, sizes as relative force.
const B4_MU=[{thr:8,size:1},{thr:24,size:2},{thr:40,size:4},{thr:56,size:7},{thr:72,size:11}];
const B4_muRate=(drive,u)=>drive>u.thr?Math.min(22,7+.3*(drive-u.thr)):0;
SCENE({id:'spinal-reflexes-common',name:'The final common path',tag:'Every command ends at the motor neuron',
 definition:'The final common path is Sherrington’s name for the motor neuron: reflexes, commands from the brain and inhibition all converge on it, and the muscle obeys only what it sends. A motor neuron and the muscle fibres it drives make one motor unit (Liddell and Sherrington, 1925). More drive recruits more units, small ones first (Henneman, 1957), and makes each fire faster (Adrian and Bronk, 1929).',
 example:'The brain can turn the same reflex up or down. Clench your teeth or pull your clasped hands apart and the knee jerk gets bigger, as Jendrassik reported in 1883.',
 desc:'Three inputs, stretch sensors, commands from the brain and inhibition, adding up on a pool of five motor neurons of increasing size, each with its train of impulses, and a bar for the force of the muscle.',
 research:['Sherrington (1906). The Integrative Action of the Nervous System. · Liddell & Sherrington (1925). Recruitment and some other features of reflex inhibition. Proceedings of the Royal Society B 97, 488–518.','Adrian & Bronk (1929). The discharge of impulses in motor nerve fibres. Part II. Journal of Physiology 67, 119–151: single motor units recorded with a needle electrode and played through a loudspeaker.','Henneman (1957). Relation between size of neurons and their susceptibility to discharge. Science 126, 1345–1347. (Thresholds, rates and forces here are illustrative.)'],
 dur:12,hint:'Change the three inputs and watch motor units join in, smallest first, and speed up. Listen plays the first unit’s impulses as quiet clicks, as Adrian did with a loudspeaker.',
 init:()=>({st:20,br:20,inh:10}),
 watch(p){return {st:20,br:Math.round(lerp(0,60,smooth(clamp(p*1.5,0,1)))),inh:Math.round(lerp(0,50,smooth(clamp((p-.7)/.3,0,1))))}},
 ui:[{range:'st',label:'Stretch sensors',min:0,max:60,get:s=>s.st,act:'st'},{range:'br',label:'Commands from the brain',min:0,max:60,get:s=>s.br,act:'br'},{range:'inh',label:'Inhibition',min:0,max:60,get:s=>s.inh,act:'inh'},{b:'Listen to unit 1 ▶',act:'listen'}],
 on:{st(s,v){s.st=+v},br(s,v){s.br=+v},inh(s,v){s.inh=+v},listen(s){const r=B4_muRate(Math.max(0,s.st+s.br-s.inh),B4_MU[0]);for(const t of B4_reg(r,1.5))B4_click(t);return 'keep'}},
 draw(s){
  const drive=Math.max(0,s.st+s.br-s.inh),rates=B4_MU.map(u=>B4_muRate(drive,u)),nOn=rates.filter(r=>r>0).length,force=Math.round(100*sum(B4_MU.map((u,i)=>u.size*rates[i]/22))/25);
  let out=heading(nOn?`Net drive ${drive}: ${nOn} of 5 motor units firing`:`Net drive ${drive}: the muscle is silent`);
  const inx=(y,lab,v,col,sign)=>TF(24,y-8,lab,12,col,'start')+R(24,y,150,12,'#eef3f6','none',5)+R(24,y,150*v/60,12,col,'none',5)+TBF(182,y+11,sign+v,13,col,'start');
  out+=inx(84,'stretch sensors',s.st,C.blue,'+')+inx(150,'commands from the brain',s.br,C.green,'+')+inx(216,'inhibition',s.inh,C.purple,'−');
  out+=arrow(214,90,262,150,C.blue,2.2)+arrow(214,156,262,172,C.green,2.2)+B4_inh(214,222,262,196,C.purple,2.2);
  out+=R(24,262,196,72,'#fff',C.grid,10)+TF(36,284,`${s.st} + ${s.br} − ${s.inh}`,13,C.ink,'start')+TBF(36,306,`net drive = ${drive}`,14,C.ink,'start')+TF(36,324,'(arbitrary units)',12,C.muted,'start');
  B4_MU.forEach((u,i)=>{const y=70+i*52,r=rates[i],rad=7+i*2.6;
   out+=Ci(284,y,rad,r?C.coralp:'#fff',r?C.coral:C.line)+L(284+rad,y,316,y,r?C.coral:C.line,2)+L(316,y+14,490,y+14,C.grid,1.2)+B4_ticks(316,y,174,B4_reg(r,1,.3+i*.13),1,C.coral,18,1.6);
   out+=TF(316,y+30,r?`unit ${i+1}: ${fmt(B4_r1(r))} a second`:`unit ${i+1}: silent (needs ${u.thr})`,12,r?C.ink:C.muted,'start')});
  out+=TF(403,50,'impulses in one second',12,C.muted)+TF(284,340,'small',12,C.muted)+TF(284,354,'→ large',12,C.muted);
  out+=R(520,70,36,240,'#eef3f6','none',6)+R(520,310-240*force/100,36,240*force/100,C.coral,'none',6)+TBF(538,60,force+'%',14,C.coral)+TF(538,330,'muscle',12,C.muted)+TF(538,345,'force',12,C.muted);
  return {svg:out,phase:nOn?`Excitation of ${s.st+s.br} less inhibition of ${s.inh} leaves a net drive of ${drive}. ${nOn===5?'All five units fire':'The '+['','smallest unit fires','two smallest units fire','three smallest units fire','four smallest units fire'][nOn]}, and force is ${force}% of the maximum. The muscle cannot tell a reflex from a decision: it sees only the motor neurons’ impulses.`:'Inhibition cancels the excitation, so no motor neuron reaches its threshold and the muscle stays relaxed, whatever the reflex or the brain asked for.'};
 }});

/* ===================== Lesson: pattern-generators ===================== */
// Bursts of impulses drawn as groups of ticks: on for the first `duty` of each period.
function B4_bursts(x0,y,w,T,period,phase,col,duty=.42,per=5){let o='';if(!(period>0))return L(x0,y,x0+w,y,C.grid,1.2);o+=L(x0,y+9,x0+w,y+9,C.grid,1.2);
 for(let k=-1;k*period<T+period;k++){const t0=(k+phase)*period;for(let j=0;j<per;j++){const t=t0+j*duty*period/per;if(t>=0&&t<=T)o+=L(x0+t/T*w,y-8,x0+t/T*w,y+8,col,1.6)}}return o}
const B4_CPG={cat:{name:'cat',T:4,unit:'s',per:1,cutPer:1,m1:'ankle flexor',m2:'ankle extensor',who:'Graham Brown, 1911',fb:'the leg',ticks:[0,1,2,3]},
 locust:{name:'locust',T:.4,unit:'s',per:1/17,cutPer:2/17,m1:'wing-raising muscle',m2:'wing-lowering muscle',who:'Wilson, 1961',fb:'the wings',ticks:[0,.1,.2,.3]}};
SCENE({id:'pattern-generators',name:'A rhythm without feedback',tag:'Graham Brown, 1911',
 definition:'A central pattern generator is a circuit that produces a rhythmic pattern of activity without needing rhythmic input. Sherrington had explained stepping as a chain of reflexes, each movement triggering the next through the senses. In 1911 Thomas Graham Brown tested this in cats under anaesthesia: he cut the sensory nerve roots from the hind legs and then the spinal cord itself, and for a while the ankle’s flexor and extensor muscles still contracted in turn.',
 example:'Brown’s result was mostly set aside for fifty years. Then Donald Wilson (1961) found that a locust’s flight muscles keep their rhythm with the wings’ sense organs cut off, though at about half the usual 17 or so beats a second. Feedback is not needed to make the rhythm, but it tunes it.',
 desc:'A nerve cord with its sensory feedback intact or cut, and two pairs of muscle recordings: what the chosen theory predicts and what was recorded in the cat or the locust.',
 research:['Graham Brown (1911). The intrinsic factors in the act of progression in the mammal. Proceedings of the Royal Society B 84, 308–319.','Wilson (1961). The central nervous control of flight in a locust. Journal of Experimental Biology 38, 471–490.','Sherrington (1910). Flexion-reflex of the limb, crossed extension-reflex, and reflex stepping and standing. Journal of Physiology 40, 28–121. (Burst timing here is illustrative.)'],
 dur:12,hint:'Choose a theory, then cut the feedback and see whether its prediction matches the recording. Try both animals.',
 init:()=>({animal:'cat',fb:1,theory:'chain'}),
 watch(p){return {animal:p<.6?'cat':'locust',fb:p<.2?1:0,theory:p<.4?'chain':'centre'}},
 ui:[{choose:[['cat','Cat (1911)'],['locust','Locust (1961)']],label:'Animal',get:s=>s.animal,act:'animal'},{choose:[['chain','Theory: chain of reflexes'],['centre','Theory: central generator']],label:'Theory',get:s=>s.theory,act:'theory'},{choose:[[1,'Feedback intact'],[0,'Feedback cut']],label:'Feedback',get:s=>s.fb,act:'fb'}],
 on:{animal(s,v){s.animal=v},theory(s,v){s.theory=v},fb(s,v){s.fb=+v}},
 draw(s){
  const A=B4_CPG[s.animal],cut=!s.fb,pred=cut&&s.theory==='chain'?0:A.per,rec=cut?A.cutPer:A.per,match=(pred>0)===(rec>0);
  let out=heading(cut?(match?'Feedback cut: the rhythm goes on, as predicted':'Feedback cut: the rhythm goes on, against the prediction'):'Feedback intact: both theories predict a rhythm');
  // schematic
  out+=R(44,96,92,170,'#f3ece6',C.line,18)+TF(90,86,s.animal==='cat'?'spinal cord':'nerve cord',12,C.muted)+Ci(72,180,15,C.pale,C.blue)+Ci(108,180,15,C.coralp,C.coral)+TF(90,222,s.theory==='centre'?'rhythm made here':'relay only?',12,C.ink);
  if(s.theory==='centre')out+=B4_inh(80,168,100,168,C.purple,2)+B4_inh(100,192,80,192,C.purple,2);
  out+=arrow(72,266,72,318,C.blue,2.4)+arrow(108,266,108,318,C.coral,2.4)+TF(90,336,'to the two muscles',12,C.muted);
  out+=cut?P('M176 300Q196 240 168 200',C.line,2.4,'none','stroke-dasharray="5 5"')+TB(190,186,'cut',13,C.coral):curveArrow(176,300,138,196,-34,C.green,2.4);
  out+=TF(186,356,'feedback from '+A.fb,12,cut?C.muted:C.green);
  if(s.animal==='cat')out+=L(90,52,90,70,C.line,2.4,'stroke-dasharray="5 5"')+TF(144,64,'brain: cut off',12,C.muted);
  // records
  const x0=250,w=320,panel=(y,title,per,col,note)=>{let o=R(232,y,354,122,'#fff',C.grid,10)+TBF(244,y+20,title,13,col,'start');
   o+=TF(244,y+46,A.m1,12,C.blue,'start')+B4_bursts(x0,y+62,w,A.T,per,0,C.blue)+TF(244,y+86,A.m2,12,C.coral,'start')+B4_bursts(x0,y+102,w,A.T,per,.5,C.coral);
   if(!per)o+=TF(x0+w/2,y+84,'no rhythm',13,C.muted);return o+(note?TF(574,y+20,note,12,C.muted,'end'):'')};
  out+=panel(52,s.theory==='chain'?'Chain of reflexes predicts':'Central generator predicts',pred,C.ink,'');
  out+=panel(184,`Recorded (${A.who})`,rec,C.green,cut&&s.animal==='locust'?'about half the rate':'');
  out+=L(x0,318,x0+w,318,C.line,1.4);for(const t of A.ticks)out+=L(x0+t/A.T*w,318,x0+t/A.T*w,323,C.line,1.2)+TF(x0+t/A.T*w,336,t+' s',12,C.muted);
  out+=TB(410,362,match?'Prediction and recording agree':'Prediction fails',13,match?C.green:C.coral);
  return {svg:out,phase:cut?(s.theory==='chain'?`If each movement were triggered by the feeling of the one before, cutting the feedback from ${A.fb} should stop the rhythm. It does not: the muscles go on alternating${s.animal==='locust'?', only more slowly':' for a while'}. A chain of reflexes cannot be the whole story.`:`A circuit that makes its own rhythm should keep going with the feedback cut, and it does${s.animal==='locust'?', though at about half the rate: the wings’ sense organs normally speed it up':''}. Graham Brown proposed two “half-centres” that inhibit each other, one for each muscle.`):'With the senses intact both theories predict the same alternating bursts, so the intact animal cannot decide between them. Cut the feedback to tell them apart.'};
 }});

// Two neurons that inhibit each other and tire (Matsuoka 1985). Returns firing over 6 s and what kind of pattern it is.
const B4_HCM={k:'',v:null};
function B4_hcSim(drive,w,b,Ta){
 const key=[drive,w,b,Ta].join(',');if(B4_HCM.k===key)return B4_HCM.v;
 const tau=.1,dt=.005,N=1200;let x1=.1,x2=0,a1=0,a2=0;const y1=[],y2=[];
 for(let i=0;i<N;i++){const o1=Math.max(0,x1),o2=Math.max(0,x2);y1.push(o1);y2.push(o2);
  x1+=dt*(-x1-w*o2-b*a1+drive)/tau;x2+=dt*(-x2-w*o1-b*a2+drive)/tau;a1+=dt*(o1-a1)/Ta;a2+=dt*(o2-a2)/Ta}
 const h=N/2,s1=y1.slice(h),s2=y2.slice(h),mx1=Math.max(...s1),mn1=Math.min(...s1),mx2=Math.max(...s2),mn2=Math.min(...s2),top=Math.max(mx1,mx2);
 const kind=top<.02?'silent':(mx1-mn1>.25*top&&mx2-mn2>.25*top)?'rhythm':Math.min(mx1,mx2)<.1*top?'one':'both';
 const ups=[];for(let i=300;i<N;i++)if(y1[i-1]-y2[i-1]<=0&&y1[i]-y2[i]>0)ups.push(i*dt);
 const period=kind==='rhythm'&&ups.length>=2?(ups[ups.length-1]-ups[0])/(ups.length-1):0;
 const spikes=y=>{const o=[];let acc=.5;for(let i=0;i<N;i++){acc+=y[i]*14*dt;if(acc>=1){acc-=1;o.push(i*dt)}}return o};
 const v={y1,y2,kind,period,top:Math.max(top,Math.max(...y1),Math.max(...y2),.3),sp1:spikes(y1),sp2:spikes(y2),dt,N};B4_HCM.k=key;B4_HCM.v=v;return v}
SCENE({id:'pattern-generators-halfcentre',name:'The half-centre oscillator',tag:'Two neurons, mutual inhibition, fatigue',
 definition:'A half-centre oscillator is a pair of neurons, or groups of neurons, that inhibit each other and tire with use. Whichever is active holds the other down until its own activity fades; then the other escapes and takes over. Graham Brown proposed this in 1911 to explain alternating flexion and extension. Each needs only a steady drive, with no rhythm in it.',
 example:'Remove the fatigue and one side wins for good. Remove the mutual inhibition and both fire together. The rhythm needs both. Real circuits use further mechanisms as well, such as rebound after inhibition and cells that burst on their own.',
 desc:'Two neurons joined by inhibitory connections, each with a steady drive and a fatigue loop, and their firing over six seconds drawn as two traces with impulses marked beneath.',
 research:['Graham Brown (1911). Proceedings of the Royal Society B 84, 308–319: the half-centre proposal.','Matsuoka (1985). Sustained oscillations generated by mutually inhibiting neurons with adaptation. Biological Cybernetics 52, 367–376: the model used here.','Perkel & Mulloney (1974). Motor pattern production in reciprocally inhibitory neurons exhibiting postinhibitory rebound. Science 185, 181–183.','Shik, Severin & Orlovsky (1966). Control of walking and running by means of electrical stimulation of the mid-brain. Biophysics 11, 756–765: in cats, stronger drive from the brainstem speeds the rhythm and changes the gait.'],
 dur:12,hint:'Tune the drive, the mutual inhibition and the fatigue. Find settings where one side wins, where both fire together, and where they alternate. Listen plays the two neurons as quiet clicks at two pitches.',
 init:()=>({d:5,w:20,b:25,T:6,ph:-1}),
 watch(p){return p<.4?{d:5,w:20,b:25,T:6,ph:p/.4*6}:p<.6?{d:5,w:20,b:0,T:6,ph:-1}:p<.8?{d:5,w:0,b:25,T:6,ph:-1}:{d:5,w:20,b:25,T:12,ph:-1}},
 ui:[{range:'d',label:'Steady drive',min:0,max:10,get:s=>s.d,act:'d',show:v=>fmt(v/5)},{range:'w',label:'Mutual inhibition',min:0,max:30,get:s=>s.w,act:'w',show:v=>fmt(v/10)},{range:'b',label:'Fatigue strength',min:0,max:40,get:s=>s.b,act:'b',show:v=>fmt(v/10)},{range:'T',label:'Fatigue builds over',min:2,max:14,get:s=>s.T,act:'T',show:v=>fmt(v/10)+' s'},{b:'Listen ▶',act:'listen'}],
 on:{d(s,v){s.d=+v;s.ph=-1},w(s,v){s.w=+v;s.ph=-1},b(s,v){s.b=+v;s.ph=-1},T(s,v){s.T=+v;s.ph=-1},
  listen(s,v,ctx){const m=B4_hcSim(s.d/5,s.w/10,s.b/10,s.T/10);AUDIO.stopAll();for(const t of m.sp1)B4_click(t,660,.05);for(const t of m.sp2)B4_click(t,440,.05);if(!(s.ph>=0&&s.ph<6)){s.ph=0;ctx.every(100,'tick')}else s.ph=0;return 'keep'},
  tick(s){if(s.ph<0)return 'stop';s.ph+=.1;if(s.ph>=6){s.ph=-1;return 'stop'}return 'keep'}},
 draw(s){
  const m=B4_hcSim(s.d/5,s.w/10,s.b/10,s.T/10),w=s.w/10,b=s.b/10;
  const title={rhythm:`They alternate: one cycle every ${fmt(Math.round(m.period*100)/100)} s`,one:'One side wins and stays on',both:'Both fire together: no alternation',silent:'No drive: both are silent'}[m.kind];
  let out=heading(title);
  const A=[82,150],B=[198,150];
  out+=arrow(A[0],74,A[0],122,C.green,2+s.d/4)+arrow(B[0],74,B[0],122,C.green,2+s.d/4)+TF(140,68,'steady drive '+fmt(s.d/5),12,C.green);
  if(w>0)out+=B4_inh(A[0]+24,140,B[0]-26,140,C.blue,1.2+w*1.3)+B4_inh(B[0]-24,160,A[0]+26,160,C.coral,1.2+w*1.3);else out+=L(A[0]+24,150,B[0]-24,150,C.line,1.5,'stroke-dasharray="4 4"');
  out+=TF(140,116,w>0?'mutual':'no',12,C.muted)+TF(140,130,'inhibition',12,C.muted);
  out+=Ci(A[0],A[1],24,C.pale,C.blue)+TB(A[0],A[1]+5,'A',15,C.blue)+Ci(B[0],B[1],24,C.coralp,C.coral)+TB(B[0],B[1]+5,'B',15,C.coral);
  for(const [q,col] of [[A,C.blue],[B,C.coral]])out+=b>0?P(`M${q[0]-12} ${q[1]+22}q-16 34 12 36q28 -2 12 -36`,C.purple,1.2+b*.6,'none')+L(q[0]+8,q[1]+26,q[0]+16,q[1]+19,C.purple,2.5):'';
  out+=TF(140,222,b>0?'fatigue: each tires as it fires':'no fatigue',12,b>0?C.purple:C.muted);
  out+=TF(A[0],250,'flexor side',12,C.blue)+TF(B[0],250,'extensor side',12,C.coral);
  out+=R(24,268,232,76,'#fff',C.grid,10)+TF(36,288,m.kind==='rhythm'?'Rhythm needs inhibition':m.kind==='one'?'Fatigue too weak to end':m.kind==='both'?'Inhibition too weak to make':'Nothing drives the cells.',12,C.ink,'start')+TF(36,304,m.kind==='rhythm'?'stronger than '+fmt(B4_r1(1+.1/(s.T/10)))+' and weaker':m.kind==='one'?'the winner’s turn:':m.kind==='both'?'them take turns:':'',12,C.ink,'start')+TF(36,320,m.kind==='rhythm'?'than 1 + fatigue = '+fmt(1+b)+'.':m.kind==='one'?'inhibition '+fmt(w)+' > 1 + '+fmt(b)+'.':m.kind==='both'?'inhibition '+fmt(w)+' is too low.':'',12,C.ink,'start')+TF(36,336,'(Matsuoka’s conditions)',12,C.muted,'start');
  // traces
  const x0=286,ww=290,T=6,tr=(y,arr,col)=>{let d='';for(let i=0;i<m.N;i+=4)d+=(i?'L':'M')+fmt(x0+i*m.dt/T*ww)+' '+fmt(y-arr[i]/m.top*54);return L(x0,y,x0+ww,y,C.grid,1.2)+P(d,col,2.2)};
  out+=R(272,52,314,292,'#fff',C.grid,10)+TBF(284,72,'A: firing rate and impulses',12,C.blue,'start')+tr(134,m.y1,C.blue)+B4_ticks(x0,152,ww,m.sp1,T,C.blue,12,1.3);
  out+=TBF(284,186,'B: firing rate and impulses',12,C.coral,'start')+tr(248,m.y2,C.coral)+B4_ticks(x0,266,ww,m.sp2,T,C.coral,12,1.3);
  out+=L(x0,290,x0+ww,290,C.line,1.4);for(let t=0;t<=6;t++)out+=L(x0+t/T*ww,290,x0+t/T*ww,295,C.line,1.2)+TF(x0+t/T*ww,310,t,12,C.muted);
  out+=TF(x0+ww,330,'seconds',12,C.muted,'end');
  if(s.ph>=0)out+=L(x0+s.ph/T*ww,80,x0+s.ph/T*ww,290,C.amber,2);
  out+=B4_note('A rate model in arbitrary units. In animals, stronger drive also speeds the rhythm.',364);
  return {svg:out,phase:m.kind==='rhythm'?`A fires and holds B down, but A tires; when its firing fades, B escapes, fires and holds A down in turn. One full cycle takes ${fmt(Math.round(m.period*100)/100)} s here, set mostly by how slowly fatigue builds (${fmt(s.T/10)} s). The drive itself is steady: the rhythm is made by the circuit.`:m.kind==='one'?'The side that got ahead silences the other and never tires enough to let go. With no rhythm of its own, this circuit is a switch, not a clock. Add fatigue.':m.kind==='both'?'Each cell settles to a steady rate and neither can silence the other, so nothing alternates. Strengthen the mutual inhibition.':'With no drive there is nothing to shape. A pattern generator needs a steady “go” signal, which in vertebrates comes down from the brainstem.'};
 }});

SCENE({id:'pattern-generators-lamprey',name:'A chain of oscillators swims',tag:'The lamprey spinal cord',
 definition:'In the lamprey, a jawless fish, Sten Grillner’s group worked out a pattern generator cell by cell. A spinal cord removed from the animal and bathed with an excitatory transmitter produces the swimming rhythm by itself: “fictive swimming”. Each of about 100 segments holds a left–right half-centre, and each segment fires slightly after the one in front, so a wave of bending runs from head to tail.',
 example:'The delay between neighbouring segments stays at about 1% of the cycle whether the fish swims slowly or fast, so about one whole wave fits along the body at any speed.',
 desc:'A lamprey’s body seen from above bending in a travelling wave, with bursts recorded from the left side of three segments showing the delay from head to tail, and the number of waves along the body.',
 research:['Cohen & Wallén (1980). The neuronal correlate of locomotion in fish: “fictive swimming” induced in an in vitro preparation of the lamprey spinal cord. Experimental Brain Research 41, 11–18.','Wallén & Williams (1984). Fictive locomotion in the lamprey spinal cord in vitro compared with swimming in the intact and spinal animal. Journal of Physiology 347, 225–239.','Grillner (1985). Neurobiological bases of rhythmic motor acts in vertebrates. Science 228, 143–149.','In people the evidence is indirect: Dimitrijevic, Gerasimenko & Pinter (1998). Evidence for a spinal central pattern generator in humans. Annals of the New York Academy of Sciences 860, 360–376.'],
 dur:12,hint:'Change the rhythm’s rate and the delay between segments. Find the delay that fits exactly one wave along the body, then change the rate and check that the shape stays the same. Swim runs it in slow motion.',
 init:()=>({f:2,lag:10,t:.1,run:0}),
 watch(p){return {f:p<.6?2:4,lag:p<.8?10:20,t:p*3,run:0}},
 ui:[{range:'f',label:'Cycles a second',min:1,max:6,get:s=>s.f,act:'f',show:v=>v+' Hz'},{range:'lag',label:'Delay per segment',min:0,max:20,get:s=>s.lag,act:'lag',show:v=>fmt(v/10)+'% of a cycle'},{b:'Swim / pause',act:'swim'}],
 on:{f(s,v){s.f=+v;return 'keep'},lag(s,v){s.lag=+v;return 'keep'},swim(s,v,ctx){s.run=s.run?0:1;if(s.run){s.left=150;ctx.every(80,'tick')}return 'keep'},tick(s){if(!s.run)return 'stop';s.t+=.02;s.left--;if(s.left<=0){s.run=0;return 'stop'}return 'keep'}},
 draw(s){
  const lag=s.lag/1000,per=1/s.f,waves=100*lag,delay=lag*per*1000,xh=70,xt=560,yc=112;
  let out=heading(`${fmt(B4_r1(waves))} wave${Math.abs(waves-1)<.01?'':'s'} along the body · ${fmt(B4_r1(delay))} ms between segments`);
  let d='',d2='';const pos=i=>{const A=5+21*i/100,y=yc+A*Math.sin(2*Math.PI*(s.f*s.t-i*lag));return [xh+(xt-xh)*i/100,y]};
  for(let i=0;i<=100;i++){const q=pos(i);d+=(i?'L':'M')+fmt(q[0])+' '+fmt(q[1])}
  out+=L(xh,yc,xt,yc,C.grid,1.2)+P(d,'#8fa7b4',11)+P(d,'#dfe8ed',7);const hd=pos(0);out+=Ci(hd[0]-6,hd[1],9,'#8fa7b4')+Ci(hd[0]-9,hd[1]-3,2,'#fff');
  const segs=[10,50,90],cols=[C.blue,C.green,C.coral];segs.forEach((g,j)=>{const q=pos(g);out+=Ci(q[0],q[1],6,cols[j],'#fff')+TF(xh+(xt-xh)*g/100,62,'segment '+g,12,cols[j])});
  out+=TF(xh-12,160,'head',12,C.muted)+TF(xt,160,'tail',12,C.muted)+TF(300,172,s.run?'slow motion':'seen from above',12,C.muted);
  // bursts from the left side of three segments
  const x0=120,w=440,T=2;out+=R(24,186,562,118,'#fff',C.grid,10)+TBF(36,206,'Left-side bursts in three segments',12,C.ink,'start');
  segs.forEach((g,j)=>{const y=228+j*24;out+=TF(36,y+4,'segment '+g,12,cols[j],'start')+B4_bursts(x0,y,w,T,per,g*lag,cols[j],.4,4)});
  const t10=10*lag*per,t90=90*lag*per;if(lag>0&&t90<T){out+=L(x0+t10/T*w,216,x0+t10/T*w,286,C.blue,1,'stroke-dasharray="3 3"')+L(x0+t90/T*w,216,x0+t90/T*w,286,C.coral,1,'stroke-dasharray="3 3"')}
  out+=L(x0,290,x0+w,290,C.line,1.2);for(const t of [0,.5,1,1.5,2])out+=TF(x0+t/T*w,301,t+' s',12,C.muted);
  out+=counter(40,312,'one cycle',Math.round(per*1000)+' ms',C.ink,150)+counter(225,312,'delay per segment',fmt(B4_r1(delay))+' ms',C.blue,150)+counter(410,312,'waves on 100 segments',fmt(B4_r1(waves)),Math.abs(waves-1)<.01?C.green:C.amber,150);
  return {svg:out,phase:lag===0?'With no delay every segment bends at once: the body flaps from side to side like a stiff rod and pushes no wave backwards.':`Each segment starts ${fmt(B4_r1(s.lag/10))}% of a cycle after the one in front, ${fmt(B4_r1(delay))} ms at ${s.f} Hz, so ${fmt(B4_r1(waves))} wave${Math.abs(waves-1)<.01?' fits':'s fit'} along 100 segments. ${Math.abs(waves-1)<.01?'This is what the lamprey does. Change the rate: the delay in milliseconds changes, but the shape of the body does not.':'A swimming lamprey keeps this near 1% at every speed, which gives about one wave along the body.'}`};
 }});

/* ===================== Lesson: cerebellum ===================== */
// Azevedo et al. (2009): 86.1 billion neurons in all; cerebellum 69.0, cerebral cortex 16.3, rest 0.7. Masses 154 g of 1,509 g.
const B4_CB={neu:[69.0,16.3,.7],mass:[154,1509]};
const B4_PKRATE=pf=>20+.6*pf;
function B4_pkSpikes(pf,cf){const cs=[.2,.45,.7,.95].slice(0,cf),simple=B4_reg(B4_PKRATE(pf),1,.5).filter(t=>!cs.some(c=>t>c-.004&&t<c+.03));return {cs,simple}}
SCENE({id:'cerebellum',name:'Most of the brain’s neurons',tag:'The cerebellar circuit',
 definition:'The cerebellum is the structure at the back of the brain that makes movements accurate and smooth by learning from errors. It is about a tenth of the brain’s mass and holds about four fifths of its neurons, nearly all of them tiny granule cells. Their axons, the parallel fibres, run through the flat, fan-shaped dendrites of Purkinje cells, the only output of the cerebellar cortex, and that output is inhibitory.',
 example:'A Purkinje cell receives well over 100,000 parallel-fibre synapses, each weak, and a single climbing fibre from the inferior olive, which is very strong. Parallel fibres drive ordinary “simple” spikes many times a second; the climbing fibre causes a “complex” spike about once a second.',
 desc:'Bars comparing the cerebellum’s share of the brain’s neurons and mass, a diagram of granule cells, parallel fibres, a Purkinje cell and its climbing fibre, and one second of the Purkinje cell’s spikes. In 3D, Purkinje cells stand like flat fans with parallel fibres running through them at right angles.',
 research:['Azevedo et al. (2009). Equal numbers of neuronal and nonneuronal cells make the human brain an isometrically scaled-up primate brain. Journal of Comparative Neurology 513, 532–541: about 69 of 86 billion neurons are in the cerebellum.','Purkyně (1837) described the cells that bear his name; Ramón y Cajal drew the circuit from Golgi-stained tissue from 1888.','Eccles, Ito & Szentágothai (1967). The Cerebellum as a Neuronal Machine. Springer. · Ito & Yoshida (1964): Purkinje cells inhibit their targets.'],
 dur:14,hint:'Raise the activity in the parallel fibres to speed the simple spikes, and press the climbing fibre to add a complex spike. Listen plays the second of spikes slowed four times. Switch to 3D for the fans.',
 init:()=>({pf:40,cf:1}),
 watch(p){return {pf:Math.round(lerp(10,90,smooth(clamp(p*2,0,1)))),cf:Math.min(3,Math.floor(p*4))}},
 ui:[{range:'pf',label:'Parallel fibres active',min:0,max:100,get:s=>s.pf,act:'pf',show:v=>v+'%'},{b:'Climbing fibre fires',act:'cf'},{b:'Listen, slowed ×4 ▶',act:'listen'}],
 on:{pf(s,v){s.pf=+v},cf(s){s.cf=(s.cf+1)%5},listen(s){const m=B4_pkSpikes(s.pf,s.cf);AUDIO.stopAll();for(const t of m.simple)B4_click(t*4,0,.05);for(const t of m.cs){B4_click(t*4,180,.08);B4_click(t*4+.07,180,.05)}return 'keep'}},
 draw(s,f,X){
  const m=B4_pkSpikes(s.pf,s.cf),tot=sum(B4_CB.neu),share=Math.round(100*B4_CB.neu[0]/tot),ms=Math.round(100*B4_CB.mass[0]/B4_CB.mass[1]),rate=Math.round(B4_PKRATE(s.pf));
  let out=heading(`${share}% of the neurons in ${ms}% of the brain’s mass`);
  out+=TBF(24,66,'Neurons (billions)',12,C.ink,'start')+R(24,74,180*B4_CB.neu[0]/tot,20,C.coral,'none',4)+R(24+180*B4_CB.neu[0]/tot+2,74,180*(1-B4_CB.neu[0]/tot)-2,20,C.blue,'none',4)+TBF(30,89,'cerebellum 69',12,'#fff','start')+TF(204,110,'rest of the brain 17',12,C.blue,'end');
  out+=TBF(24,138,'Mass',12,C.ink,'start')+R(24,146,180*ms/100,20,C.coral,'none',4)+R(24+180*ms/100+2,146,180*(1-ms/100)-2,20,C.blue,'none',4)+TF(24,182,'cerebellum 154 g of 1,509 g',12,C.muted,'start');
  out+=TF(24,212,'Counts: Azevedo et al.',12,C.muted,'start')+TF(24,227,'(2009), four brains.',12,C.muted,'start');
  // circuit
  const sx=420,sy=214,act=s.pf/100;
  for(let i=0;i<5;i++){const y=74+i*17;out+=L(250,y,585,y,C.blue,1.2+act*2,`opacity="${fmt(.3+.7*act)}"`)}
  out+=TF(585,64,'parallel fibres',12,C.blue,'end');
  for(const dx of [-70,-46,-24,0,24,46,70])out+=P(`M${sx} ${sy-12}Q${sx+dx*.4} ${sy-56} ${sx+dx} ${sy-146}`,'#6c8d9f',2.2);
  out+=hit(X,'cf',0,'Make the climbing fibre fire',P(`M${sx+70} 270Q${sx+34} 250 ${sx+16} ${sy}Q${sx+8} ${sy-60} ${sx+30} ${sy-136}`,C.coral,3.2)+P(`M${sx+14} ${sy-40}Q${sx-6} ${sy-80} ${sx-34} ${sy-120}`,C.coral,2.4)+TB(585,286,'climbing fibre',13,C.coral,'end'));
  out+=Ci(sx,sy,15,C.purplep,C.purple)+TB(sx-24,sy+5,'Purkinje cell',13,C.purple,'end')+B4_inh(sx,sy+15,sx,sy+40,C.purple,2.6)+TF(sx,sy+58,'inhibits deep nucleus',12,C.purple);
  for(let i=0;i<4;i++){const gx=262+i*15,py=74+i*17;out+=Ci(gx,246,5,C.pale,C.blue)+L(gx,241,gx,py,C.blue,1.3)}
  out+=TF(250,266,'granule cells',12,C.blue,'start')+TF(250,281,'(mossy fibres in)',12,C.muted,'start');
  // spikes
  const x0=40,w=530,y=326;out+=R(24,294,562,74,'#fff',C.grid,10)+TBF(36,310,`Purkinje cell, one second: ${rate} simple spikes, ${m.cs.length} complex`,12,C.ink,'start');
  out+=L(x0,y+14,x0+w,y+14,C.grid,1.2)+B4_ticks(x0,y+2,w,m.simple,1,C.purple,18,1.2);
  for(const c of m.cs){const x=x0+c*w;out+=L(x,y-14,x,y+14,C.coral,2.6)+L(x+4,y,x+4,y+12,C.coral,1.4)+L(x+8,y+2,x+8,y+12,C.coral,1.4)+L(x+12,y+4,x+12,y+12,C.coral,1.4)}
  out+=TF(x0+w/2,y+36,'purple: simple spikes · orange: complex spikes, each followed by a short pause',12,C.muted);
  return {svg:out,phase:`Parallel fibres set the pace of the simple spikes, ${rate} a second here. Each time the climbing fibre fires, the whole cell answers with one large complex spike and pauses briefly. Two inputs, one weak and numerous, one strong and single: the next scene shows what Marr and Albus thought the strong one was for.`};
 },
 three(s,f,X,project){
  const Pr=project([-1.5,1.5,-2.3,2.3,-1,2.2]),items=[],act=s.pf/100;
  for(const c of [-1.3,0,1.3]){
   items.push({at:[0,c,1.2],svg:P2=>poly3([[0,c,.15],[-1,c,.9],[-1.15,c,2],[1.15,c,2],[1,c,.9]],P2,C.purplep,C.purple,'fill-opacity=".72"')+[-.8,-.4,0,.4,.8].map(x=>line3([0,c,.15],[x,c,1.95],P2,C.purple,1.4)).join('')});
   items.push({at:[0,c,-.4],svg:P2=>line3([0,c,0],[0,c,-.9],P2,C.purple,2.4)+point3([0,c,0],P2,C.purple,8,'#fff')})}
  for(const z of [1.05,1.45,1.85])for(const x of [-.75,-.25,.25,.75])for(const seg of [[-2.2,-1.3],[-1.3,0],[0,1.3],[1.3,2.2]])items.push({at:[x,(seg[0]+seg[1])/2+.01,z],svg:P2=>line3([x,seg[0],z],[x,seg[1],z],P2,C.blue,1.2+act*1.8)});
  items.push({at:[.12,-.06,.8],svg:P2=>line3([.5,-.06,-.9],[.12,-.06,0],P2,C.coral,3)+line3([.12,-.06,0],[-.45,-.06,1.5],P2,C.coral,2.6)+line3([.12,-.06,.5],[.55,-.06,1.6],P2,C.coral,2.6)});
  items.push({at:[-.75,-2.1,0],svg:P2=>line3([-.75,-2.2,-.8],[-.75,-2.2,1.05],P2,C.blue,1.6)+point3([-.75,-2.2,-.8],P2,C.blue,5,'#fff')});
  let out=sortedItems(items,Pr);const g=Pr([-.75,-2.2,-.8]);
  out+=TF(g[0],g[1]+18,'granule cell',13,C.blue)+TBF(16,28,'Purkinje cells: flat fans',13,C.purple,'start')+TBF(16,46,'parallel fibres',13,C.blue,'start')+TBF(16,64,'one climbing fibre',13,C.coral,'start');
  return {svg:out,title:'Purkinje cells and parallel fibres in 3D',caption:'Each Purkinje cell’s dendrites spread in one flat plane, and the planes stand side by side like plates in a rack. Parallel fibres (blue) run through them at right angles, so one fibre touches many Purkinje cells and each cell is crossed by a vast number of fibres. One climbing fibre (orange) wraps a single cell.'};
 }});

SCENE({id:'cerebellum-learning',name:'An error signal that rewires',tag:'Marr, Albus and Ito',
 definition:'David Marr (1969) and James Albus (1971) proposed that the cerebellum learns movements under a teacher. The climbing fibre reports that a movement went wrong, and this changes the strength of whichever parallel-fibre synapses were active at that moment. Marr guessed that they grow stronger; Albus that they grow weaker. In 1982 Masao Ito and colleagues found that pairing the two inputs weakens the parallel-fibre synapse: long-term depression.',
 example:'Weakening a synapse lowers the Purkinje cell’s firing in that situation. Because Purkinje cells inhibit, the deep nucleus is released, and the next movement in that situation comes out differently.',
 desc:'A Purkinje cell crossed by three parallel fibres standing for three situations, with a climbing fibre beside it, and bars for the strength of each synapse and the cell’s firing rate, which change as movements are paired with errors.',
 research:['Marr (1969). A theory of cerebellar cortex. Journal of Physiology 202, 437–470. · Albus (1971). A theory of cerebellar function. Mathematical Biosciences 10, 25–61.','Ito, Sakurai & Tongroach (1982). Climbing fibre induced depression of both mossy fibre responsiveness and glutamate sensitivity of cerebellar Purkinje cells. Journal of Physiology 324, 113–134.','Influential and still debated in its details: Schonewille et al. (2011). Reevaluating the role of LTD in cerebellar motor learning. Neuron 70, 43–50, found that mice lacking this depression could still learn the movements tested.'],
 dur:12,hint:'Pick a situation (A, B or C), then make movements with or without an error. Watch only the active synapse change. Switch between Albus’s and Marr’s rule and compare with what Ito measured.',
 init:()=>({w:[1,1,1],c:1,rule:'albus',n:0,err:0}),
 watch(p){const n=Math.floor(p*9);return {w:[1,Math.pow(.8,n),1],c:1,rule:'albus',n,err:n>0?1:0}},
 ui:[{choose:[[0,'Situation A'],[1,'B'],[2,'C']],label:'Situation',get:s=>s.c,act:'c'},{b:'Move, with an error',act:'err'},{b:'Move, no error',act:'ok'},{choose:[['albus','Albus: weaken'],['marr','Marr: strengthen']],label:'Rule',get:s=>s.rule,act:'rule'}],
 on:{c(s,v){s.c=+v;s.err=0},rule(s,v){s.rule=v;s.w=[1,1,1];s.n=0;s.err=0},
  err(s){s.w[s.c]=s.rule==='albus'?s.w[s.c]*.8:Math.min(1.6,s.w[s.c]*1.12);s.n++;s.err=1},ok(s){s.w[s.c]+=.05*(1-s.w[s.c]);s.err=0}},
 draw(s,f,X){
  const names=['A','B','C'],cols=[C.blue,C.green,C.amber],w=s.w,rate=Math.round(50*w[s.c]),albus=s.rule==='albus';
  let out=heading(s.n?`${s.n} error${s.n>1?'s':''} paired: the active synapse is ${albus?'weaker':'stronger'}`:'Pair a movement with an error');
  const tx=176;out+=L(tx,74,tx,232,'#6c8d9f',7)+Ci(tx,250,17,C.purplep,C.purple)+B4_inh(tx,267,tx,312,C.purple,2.6)+TF(30,300,'Purkinje cell inhibits',12,C.purple,'start')+TF(30,315,'the deep nucleus',12,C.purple,'start');
  out+=P(`M${tx+86} 300Q${tx+30} 270 ${tx+16} 232L${tx+12} 78`,C.coral,s.err?4.5:2.2)+TB(344,326,'climbing fibre',13,C.coral,'end')+TF(344,342,s.err?'fires: “that was wrong”':'silent',12,s.err?C.coral:C.muted,'end');
  names.forEach((nm,i)=>{const y=96+i*46,on=i===s.c;out+=hit(X,'c',i,`Situation ${nm}`,L(30,y,330,y,cols[i],on?4:1.8,on?'':'opacity=".55"')+R(30,y-26,26,20,on?cols[i]:'#fff',cols[i],5)+TB(43,y-11,nm,13,on?'#fff':cols[i]));
   out+=Ci(tx,y,4+7*w[i],'#fff',cols[i])+(on?TF(260,y-10,'active',12,cols[i]):'')});
  out+=TF(30,232,'parallel fibres: one for',12,C.muted,'start')+TF(30,247,'each situation',12,C.muted,'start');
  // bars
  out+=R(352,52,234,168,'#fff',C.grid,10)+TBF(364,72,'Synapse strength',13,C.ink,'start');
  names.forEach((nm,i)=>{const y=84+i*30;out+=TB(372,y+15,nm,13,cols[i])+R(388,y,150,18,'#eef3f6','none',5)+R(388,y,150*clamp(w[i]/1.6,0,1),18,cols[i],'none',5)+TF(578,y+14,Math.round(w[i]*100)+'%',12,C.ink,'end')});
  out+=L(388+150/1.6,80,388+150/1.6,172,C.muted,1.2,'stroke-dasharray="3 3"')+TF(388+150/1.6,186,'start: 100%',12,C.muted);
  out+=TF(364,208,`Purkinje firing in ${names[s.c]}: ${rate} a second`,12,C.purple,'start');
  out+=R(352,230,234,116,'#fff',C.grid,10)+TBF(364,250,albus?'Albus (1971): pairing weakens':'Marr (1969): pairing strengthens',12,C.ink,'start')+TF(364,272,'Ito and colleagues (1982)',12,C.muted,'start')+TF(364,288,'measured: weaker.',12,C.muted,'start')+TB(364,312,albus?'Matches the recordings':'Does not match',13,albus?C.green:C.coral,'start')+TF(364,334,'Illustrative sizes; details debated.',12,C.muted,'start');
  return {svg:out,phase:s.n?(albus?`Each pairing of situation ${names[s.c]} with a climbing-fibre signal cuts that synapse by a fifth and leaves the others alone: it is now at ${Math.round(w[s.c]*100)}%. The Purkinje cell fires less in this situation, so it inhibits the deep nucleus less and the movement changes. This is the depression Ito found. How much of motor learning it explains is still argued over.`:`Under Marr’s rule the paired synapse grows, to ${Math.round(w[s.c]*100)}% here. The idea of a teaching signal was right, but when Ito’s group tested it the paired synapse became weaker, as Albus had proposed.`):'Three parallel fibres stand for three situations the body might be in. The climbing fibre is silent while movements go well. Make a movement with an error and see which synapse changes.'};
 }});

// Prism adaptation as a one-rate error-correcting model: each throw corrects a fraction B of the last error.
const B4_PR={typ:.3,dmg:.008,sd:1.3,max:60};
function B4_prThrow(s){const i=s.th.length,r=B4_rng(s.seed*101+i),noise=(r()+r()+r()-1.5)*2*B4_PR.sd,e=(s.on?s.shift:0)-s.ad+noise;s.th.push({e:B4_r1(e),on:s.on});s.ad+=B4_PR[s.who]*e;if(s.th.length>B4_PR.max){s.th.shift()}}
function B4_prWatch(n,who){const s={shift:17,on:0,who,th:[],ad:0,seed:5};for(let i=0;i<n;i++){s.on=i>=8&&i<26?1:0;B4_prThrow(s)}s.on=n>=8&&n<26?1:0;return s}
SCENE({id:'cerebellum-prisms',name:'Throwing through prisms',tag:'Error shrinks throw by throw',
 definition:'Prism adaptation shows the cerebellum’s error-correction in a person. Wedge prisms shift the view sideways, so the first throws land to one side of the target. Over the next throws the error shrinks, without any need to aim off deliberately. Take the prisms off and the throws land on the opposite side for a while: an after-effect, which shows that the mapping from seeing to throwing was recalibrated.',
 example:'In Martin and colleagues’ study (1996), people threw balls of clay at a target while wearing prisms that shifted their view by about 17°. Healthy throwers adapted within a few dozen throws and showed an after-effect; people with damage to certain parts of the cerebellum adapted little or not at all, and had little after-effect.',
 desc:'A target with the landing points of recent throws, and a graph of the sideways error of every throw, with the block of throws made through prisms shaded and the expected course of adaptation drawn as a dashed line.',
 research:['Martin, Keating, Goodkin, Bastian & Thach (1996). Throwing while looking through prisms. I. Focal olivocerebellar lesions impair adaptation. Brain 119, 1183–1198.','Helmholtz (1867). Handbuch der physiologischen Optik: an early description of adaptation to prisms and its after-effect.','The thrower here is a simulation: each throw corrects a fixed fraction of the last error, plus scatter. That simple rule and its rate are illustrative, not fitted to the 1996 data.'],
 dur:14,hint:'Throw a few times, put the prisms on and keep throwing until the error has gone. Before you take them off, predict where the next throw will land. Then repeat with the second thrower. A simulation, not a test of you.',
 init:()=>({shift:17,on:0,who:'typ',th:[],ad:0,seed:3}),
 watch(p){return B4_prWatch(Math.floor(p*38),'typ')},
 ui:[{b:'Throw',act:'thr'},{b:'Throw × 5',act:'thr5'},{choose:[[0,'Prisms off'],[1,'Prisms on']],label:'Prisms',get:s=>s.on,act:'on'},{choose:[['typ','Typical thrower'],['dmg','Cerebellar damage']],label:'Thrower',get:s=>s.who,act:'who'},{range:'shift',label:'Prism shift',min:5,max:20,get:s=>s.shift,act:'shift',show:v=>v+'°'}],
 on:{thr(s){B4_prThrow(s);return 'keep'},thr5(s){for(let i=0;i<5;i++)B4_prThrow(s);return 'keep'},on(s,v){s.on=+v},who(s,v){s.who=v;s.th=[];s.ad=0;s.on=0;s.seed++},shift(s,v){s.shift=+v}},
 draw(s){
  const th=s.th,last=th[th.length-1],n=th.length,dmg=s.who==='dmg';
  let out=heading(n?`Throw ${n}: ${Math.abs(last.e)<2?'on target':fmt(Math.abs(last.e))+'° to the '+(last.e>0?'right':'left')}${last.on?' (prisms on)':''}`:'Throw at the target');
  // target strip
  const cx=300,sc=9.6,y=96;out+=L(60,y,540,y,C.line,1.5);for(const d of [-20,-10,10,20])out+=L(cx+d*sc,y-5,cx+d*sc,y+5,C.line,1.4)+TF(cx+d*sc,y+22,(d>0?'+':'')+d+'°',12,C.muted);
  out+=Ci(cx,y,13,'#fff',C.green)+Ci(cx,y,5,C.green)+TF(cx,y-22,'target',12,C.green);
  th.slice(-6).forEach((t,i,a)=>{const x=cx+clamp(t.e,-24,24)*sc,newest=i===a.length-1;out+=Ci(x,y,newest?8:5,newest?C.coral:'#e9b8aa',newest?'#fff':'none')});
  if(s.on)out+=arrow(cx+10,60,cx+s.shift*sc-4,60,C.amber,2)+TF(cx+s.shift*sc+6,64,'view shifted '+s.shift+'°',12,C.amber,s.shift>14?'end':'start').replace('y="64"',s.shift>14?'y="50"':'y="64"');
  out+=TF(60,y+22,'left',12,C.muted,'start')+TF(540,y+22,'right',12,C.muted,'end');
  // graph
  const x0=62,w=500,yb=240,h=80,N=B4_PR.max,xx=i=>x0+(i+.5)/N*w,yy=e=>yb-clamp(e,-22,22)/22*h;
  out+=R(24,136,562,220,'#fff',C.grid,10);
  let i0=-1;th.forEach((t,i)=>{if(t.on&&i0<0)i0=i;if((!t.on||i===n-1)&&i0>=0){const i1=t.on?i:i-1;out+=R(xx(i0)-w/N/2,yb-h,xx(i1)-xx(i0)+w/N,2*h,C.amberp,'none',0);i0=-1}});
  out+=L(x0,yb,x0+w,yb,C.line,1.4)+L(x0,yb-h,x0,yb+h,C.line,1.4);for(const e of [-20,-10,0,10,20])out+=TF(x0-6,yy(e)+4,(e>0?'+':'')+e+'°',12,C.muted,'end')+L(x0-3,yy(e),x0,yy(e),C.line,1.2);
  out+=TF(x0+6,150,'error: + right, − left',12,C.muted,'start')+TF(x0+w,350,'throw number',12,C.muted,'end')+TF(x0+w-150,350,'shaded: prisms on',12,C.amber,'end');
  // expected course: follows the same schedule without scatter
  let ad=0,d='';th.forEach((t,i)=>{const e=(t.on?s.shift:0)-ad;d+=(i?'L':'M')+fmt(xx(i))+' '+fmt(yy(e));ad+=B4_PR[s.who]*e});if(n>1)out+=P(d,C.muted,1.6,'none','stroke-dasharray="5 4"');
  th.forEach((t,i)=>{out+=Ci(xx(i),yy(t.e),i===n-1?5:3.2,t.on?C.amber:C.blue)});
  for(const k of [10,20,30,40,50,60])out+=TF(x0+(k-.5)/N*w,yb+h+14,k,12,C.muted);
  out+=TF(x0+w,150,dmg?'thrower: cerebellar damage':'thrower: typical',12,dmg?C.purple:C.blue,'end');
  const adp=Math.abs(s.ad)>3;
  return {svg:out,phase:!n?'Throw a few times without prisms to see the ordinary scatter, then put the prisms on.':last.on?(Math.abs(last.e)<3?`Through the prisms the throws are back on target after ${th.filter(t=>t.on).length} throws. Nothing in the eyes has changed; the link between where the target looks to be and where the arm throws has. Predict the next throw with the prisms off.`:dmg?`The error stays near ${s.shift}° throw after throw. In Martin’s study, people with damage to particular parts of the cerebellum adapted little or not at all, although they could see the miss perfectly well.`:`The view is shifted ${s.shift}° to the right and so is the throw. Each miss corrects part of the error: keep throwing.`):(adp&&last.e<-2?`Prisms off, yet the throw lands ${fmt(Math.abs(last.e))}° to the left: the after-effect. The recalibration is still in place and now it is the error. It fades over the next throws.`:n>8&&dmg&&th.some(t=>t.on)?'With the prisms off the throws are back on target at once, with almost no after-effect: little was learned, so there is little to unlearn.':'Without prisms the throws scatter around the target. The dashed line is the course this simple model expects without scatter.')};
 }});

/* ===================== Lesson: basal-ganglia ===================== */
const B4_BGN=['A','B','C'];
SCENE({id:'basal-ganglia',name:'A brake that is released',tag:'Selecting an action by disinhibition',
 definition:'The basal ganglia are a group of connected nuclei deep in the forebrain that help select and start actions: the striatum (caudate and putamen), the globus pallidus, the subthalamic nucleus and the substantia nigra. Their output cells fire fast all the time and inhibit the thalamus and brainstem, like a brake held on. To let an action through, the striatum inhibits those output cells for a moment. Two inhibitions in a row release the target: disinhibition.',
 example:'In monkeys, cells in the substantia nigra’s output part fire steadily at high rates and pause just before the eyes jump to a target (Hikosaka and Wurtz, 1983). Silencing that region with a drug left the animals unable to hold back eye movements.',
 desc:'Three columns, one for each possible action, showing a request from the cortex, firing in the striatum, the fast firing of the output nuclei and the thalamus; the chosen action’s output pauses and its thalamus is released. In 3D, the nuclei of one hemisphere.',
 research:['Hikosaka & Wurtz (1983). Visual and oculomotor functions of monkey substantia nigra pars reticulata. Journal of Neurophysiology 49, 1230–1301; and (1985) 53, 292–308 on silencing it with muscimol.','Chevalier & Deniau (1990). Disinhibition as a basic process in the expression of striatal functions. Trends in Neurosciences 13, 277–280.','DeLong (1971). Activity of pallidal neurons during movement. Journal of Neurophysiology 34, 414–427. (Firing rates here are rounded, illustrative values.)'],
 dur:14,hint:'Press an action in the cortex row and follow it down: which cells speed up, which pause, and which thalamus is released? Then silence the brake. Switch to 3D to see where the nuclei lie.',
 init:()=>({act:0,brake:1}),
 watch(p){return {act:p<.15?-1:p<.4?0:p<.6?1:p<.8?2:1,brake:p<.8?1:0}},
 ui:[{choose:[[-1,'No request'],[0,'Action A'],[1,'B'],[2,'C']],label:'Cortex asks for',get:s=>s.act,act:'act'},{choose:[[1,'Brake working'],[0,'Brake silenced']],label:'Output nuclei',get:s=>s.brake,act:'brake'}],
 on:{act(s,v){s.act=+v},brake(s,v){s.brake=+v}},
 draw(s,f,X){
  const freed=B4_BGN.filter((n,i)=>!s.brake||i===s.act);
  let out=heading(!s.brake?'Brake silenced: everything is released at once':s.act<0?'No request: the brake holds every action':`Action ${B4_BGN[s.act]} is released; the others stay braked`);
  const lab=(y,a,b)=>TF(24,y,a,12,C.ink,'start')+(b?TF(24,y+14,b,12,C.muted,'start'):'');
  out+=lab(76,'cortex','asks for')+lab(128,'striatum')+lab(184,'output nuclei','(GPi, SNr)')+lab(246,'thalamus')+lab(304,'result');
  B4_BGN.forEach((n,i)=>{const cx=220+i*130,x0=cx-52,on=i===s.act,st=on?25:1,gp=s.brake?(on?6:70):0,th=gp<10?25:3;
   out+=hit(X,'act',i,`Cortex asks for action ${n}`,R(x0,58,104,30,on?C.green:'#fff',on?C.green:C.line,8)+TB(cx,78,'Action '+n,13,on?'#fff':C.ink));
   out+=arrow(cx,90,cx,110,on?C.green:C.line,2.2)+L(x0,138,x0+104,138,C.grid,1.2)+B4_ticks(x0,126,104,B4_reg(st,1,.4),1,C.blue,16,1.4)+TF(cx,154,st+' a second',12,on?C.blue:C.muted);
   out+=B4_inh(cx,158,cx,170,on?C.coral:C.line,2.2)+L(x0,194,x0+104,194,C.grid,1.2)+B4_ticks(x0,182,104,B4_reg(gp,1,.4),1,C.coral,16,1.1)+TF(cx,210,gp?gp+' a second':'silent',12,gp>10?C.coral:C.muted);
   out+=B4_inh(cx,216,cx,230,gp>10?C.coral:C.line,2.2)+L(x0,256,x0+104,256,C.grid,1.2)+B4_ticks(x0,244,104,B4_reg(th,1,.4),1,C.green,16,1.4)+TF(cx,272,th+' a second',12,th>10?C.green:C.muted);
   out+=R(x0,286,104,28,th>10?C.greenp:'#f1f4f6',th>10?C.green:C.line,8)+TB(cx,305,th>10?'released':'held back',13,th>10?C.green:C.muted)});
  out+=arrow(40,336,70,336,C.green,2.2)+TF(76,340,'excites',12,C.muted,'start')+B4_inh(150,336,180,336,C.coral,2.2)+TF(190,340,'inhibits',12,C.muted,'start')+TF(574,340,'each row of marks is one second',12,C.muted,'end');
  return {svg:out,phase:!s.brake?'With the output nuclei silent nothing holds the thalamus back, so every channel is released whether or not it was asked for. The brake is not the opposite of movement: it is what makes selection possible.':s.act<0?'At rest the striatum is nearly silent and the output nuclei fire at about 70 a second, holding each thalamic channel down.':`The cortex excites striatal cells for action ${B4_BGN[s.act]}. They inhibit that channel’s output cells, whose firing drops from 70 to about 6 a second, and the thalamus they were holding down is released. ${freed.length===1?'The other channels keep their brake on.':''}`};
 },
 three(s,f,X,project){
  const Pr=project([0,2.8,-2,1.9,-1.4,1.4]),items=[],ball=(at,r,col,op=.9)=>({at,svg:P2=>{const q=P2(at);return Ci(q[0],q[1],r,col,'#fff',`fill-opacity="${op}"`)}});
  const caud=[[1.1,1.7,.45],[1.12,1.2,.85],[1.2,.6,1.1],[1.3,0,1.22],[1.45,-.6,1.2],[1.7,-1.2,1.02],[2,-1.65,.65],[2.3,-1.8,.2],[2.45,-1.45,-.2],[2.5,-.9,-.45]];
  caud.forEach((q,i)=>items.push(ball(q,20-i*1.4,C.blue)));
  for(const q of [[2.15,.75,.1],[2.25,.2,.05],[2.2,-.35,0],[2.1,.45,-.3]])items.push(ball(q,23,'#6aa9d8'));
  for(const q of [[1.62,.4,0],[1.6,-.05,-.05]])items.push(ball(q,15,C.coral));
  items.push(ball([1.22,.1,-.1],11,'#a23d27'));
  for(const q of [[.6,-.3,.4],[.65,-.9,.4],[.7,-.6,.1]])items.push(ball(q,21,'#c3d0d8',.95));
  items.push(ball([.9,-.5,-.72],8,C.green));for(const q of [[.75,-.95,-1.15],[.95,-1.25,-1.2]])items.push(ball(q,10,C.dark));
  let out=line3([0,-2,-1.4],[0,1.9,-1.4],Pr,C.line,1.4,'stroke-dasharray="5 4"')+sortedItems(items,Pr);
  [['caudate',C.blue],['putamen','#6aa9d8'],['globus pallidus',C.coral],['thalamus','#c3d0d8'],['subthalamic nucleus',C.green],['substantia nigra',C.dark]].forEach((q,i)=>{out+=Ci(22,26+i*19,6,q[1],'#fff')+TF(34,30+i*19,q[0],13,C.ink,'start')});
  const fr=Pr([0,1.9,-1.4]);out+=TF(fr[0],fr[1]+16,'midline, front',12,C.muted);
  return {svg:out,title:'The basal ganglia of one hemisphere',caption:'A schematic of one hemisphere, with sizes and positions approximate. The caudate arches over the thalamus and with the putamen makes up the striatum (blue), the input side. The globus pallidus (orange; its inner part is darker) lies inside the putamen. Below the thalamus are the small subthalamic nucleus (green) and the substantia nigra (dark), which supplies dopamine.'};
 }});

// The direct/indirect pathway model (Albin, Young & Penney 1989; DeLong 1990) as a rate sketch, everything on a 0–1 scale.
function B4_bg(da,ctx){const d=da/100,c=ctx/100,q=v=>clamp(v,0,1),D1=q(c*(.4+1.2*d)),D2=q(c*(1.6-1.2*d)),GPe=q(1-.8*D2),STN=q(1-.7*GPe),GPi=q(.5+.8*STN-.9*D1),Th=q(1-GPi);return {D1,D2,GPe,STN,GPi,Th}}
SCENE({id:'basal-ganglia-pathways',name:'Direct and indirect pathways',tag:'A useful model, and a simplification',
 definition:'In 1989–90 Albin, Young and Penney, and DeLong, proposed two routes through the basal ganglia. In the direct pathway, striatal cells inhibit the output nuclei, releasing movement. In the indirect pathway, other striatal cells act through the outer globus pallidus and the subthalamic nucleus to raise the output and hold movement back. Dopamine from the substantia nigra excites the first group, through D1 receptors, and inhibits the second, through D2 receptors, so it tips the balance towards movement.',
 example:'Take dopamine away and the model predicts too much output and too little movement, as in Parkinson’s disease. But “go” and “stop” is a simplification: in mice, cells of both pathways become active together when a movement starts (Cui and colleagues, 2013).',
 desc:'A circuit of boxes for cortex, the two groups of striatal cells, the outer globus pallidus, subthalamic nucleus, output nuclei and thalamus, with excitatory and inhibitory connections, a level in each box, and a slider for dopamine.',
 research:['Albin, Young & Penney (1989). The functional anatomy of basal ganglia disorders. Trends in Neurosciences 12, 366–375. · DeLong (1990). Primate models of movement disorders of basal ganglia origin. Trends in Neurosciences 13, 281–285.','Gerfen et al. (1990). D1 and D2 dopamine receptor-regulated gene expression of striatonigral and striatopallidal neurons. Science 250, 1429–1432.','Kravitz et al. (2010). Regulation of parkinsonian motor behaviours by optogenetic control of basal ganglia circuitry. Nature 466, 622–626 (supports the model). · Cui et al. (2013). Concurrent activation of striatal direct and indirect pathways during action initiation. Nature 494, 238–242 (complicates it).'],
 dur:12,hint:'Lower and raise dopamine and follow the change box by box to the thalamus. Then switch to what recordings show. The levels are a sketch on a scale of 0 to 100, not measurements.',
 init:()=>({da:50,cx:60,view:'model'}),
 watch(p){return {da:Math.round(p<.5?lerp(50,5,smooth(p*2)):lerp(5,95,smooth((p-.5)*2.2))),cx:60,view:p>.92?'rec':'model'}},
 ui:[{range:'da',label:'Dopamine',min:0,max:100,get:s=>s.da,act:'da',show:v=>v+'%'},{range:'cx',label:'Drive from cortex',min:0,max:100,get:s=>s.cx,act:'cx',show:v=>v+'%'},{choose:[['model','What the model says'],['rec','What recordings show']],label:'View',get:s=>s.view,act:'view'}],
 on:{da(s,v){s.da=+v},cx(s,v){s.cx=+v},view(s,v){s.view=v}},
 draw(s){
  const m=B4_bg(s.da,s.cx),mv=Math.round(m.Th*100),state=mv<25?'low':mv>80?'high':'mid';
  let out=heading(`Dopamine ${s.da}%: ${state==='low'?'output high, little movement released':state==='high'?'output low, too much released':'the two pathways in balance'}`);
  const node=(cx,y,label,v,col,w=124)=>R(cx-w/2,y,w,32,'#fff',col,8)+R(cx-w/2+4,y+24,(w-8)*v,5,col,'none',2)+TBF(cx-w/2+8,y+17,label,12,C.ink,'start')+TBF(cx+w/2-8,y+17,Math.round(v*100),12,col,'end');
  out+=arrow(262,78,170,98,C.green,2.2)+arrow(338,78,430,98,C.green,2.2);
  out+=arrow(246,116,216,116,C.green,1.8+s.da/40)+B4_inh(354,116,384,116,C.coral,1.8+s.da/40)+TBF(232,108,'+',14,C.green)+TBF(368,108,'−',14,C.coral);
  out+=B4_inh(150,134,150,214,C.coral,2.4)+TF(142,178,'direct',12,C.blue,'end');
  out+=B4_inh(450,134,450,154,C.coral,2.4)+B4_inh(450,190,450,214,C.coral,2.4)+arrow(386,232,216,232,C.green,2.4)+TF(300,224,'indirect',12,C.purple);
  out+=B4_inh(150,250,150,276,C.coral,2.4)+P('M86 296L44 296L44 62L236 62',C.green,2.2)+`<polygon points="238,62 229,57 229,67" fill="${C.green}"/>`;
  out+=node(300,46,'Cortex',s.cx/100,C.green)+node(150,100,'Striatum D1',m.D1,C.blue)+node(450,100,'Striatum D2',m.D2,C.purple)+node(300,100,'Dopamine',s.da/100,C.amber,104)+node(450,158,'Outer pallidus',m.GPe,C.purple)+node(450,216,'Subthalamic n.',m.STN,C.purple)+node(150,216,'Output nuclei',m.GPi,C.coral)+node(150,280,'Thalamus',m.Th,C.green);
  out+=TF(52,340,'thalamus excites cortex',12,C.muted,'start');
  out+=R(300,262,286,92,'#fff',C.grid,10);
  if(s.view==='model'){out+=TBF(312,282,'Movement released (model)',12,C.ink,'start')+R(312,292,262,14,'#eef3f6','none',6)+R(312,292,262*m.Th,14,state==='mid'?C.green:C.amber,'none',6)+TF(312,326,state==='low'?'Too little: slow, hard to start.':state==='high'?'Too much: unwanted movements.':'Enough to let the chosen action go.',12,C.ink,'start')+TF(312,344,'A simplification: see the other view.',12,C.amber,'start')}
  else{out+=TBF(312,282,'When a movement starts',12,C.ink,'start')+TF(312,302,'model predicts',12,C.muted,'start')+TBF(574,302,'D1 cells ↑   D2 cells ↓',12,C.ink,'end')+TF(312,322,'recorded in mice',12,C.muted,'start')+TBF(574,322,'D1 cells ↑   D2 cells ↑',12,C.coral,'end')+TF(312,344,'Cui et al. (2013): both are active.',12,C.amber,'start')}
  return {svg:out,phase:s.view==='rec'?'Recordings do not show a simple go and stop. Both groups of striatal cells become active together as a movement begins. One reading is that the direct pathway releases the wanted action while the indirect pathway holds back its competitors. The model remains a good first guide to what dopamine loss does, and a poor guide to the details.':state==='low'?`With dopamine at ${s.da}%, D1 cells are under-driven (${Math.round(m.D1*100)}) and D2 cells over-active (${Math.round(m.D2*100)}). The outer pallidus is suppressed, the subthalamic nucleus is freed, and the output nuclei rise to ${Math.round(m.GPi*100)}, clamping the thalamus at ${mv}. This is the model’s account of slow, scarce movement when dopamine is lost.`:state==='high'?`With dopamine at ${s.da}%, the direct pathway dominates, output falls to ${Math.round(m.GPi*100)} and the thalamus is barely braked (${mv}). The model was built to explain disorders of too much movement as well as too little.`:`With dopamine at ${s.da}%, the direct pathway (D1, ${Math.round(m.D1*100)}) pushes the output down and the indirect pathway (D2, ${Math.round(m.D2*100)}) pushes it up. They settle at ${Math.round(m.GPi*100)}, and the thalamus passes ${mv}.`};
 }});

const B4_DAEV=[{y:'1957',a:'Carlsson: rabbits stilled by reserpine move again',b:'after L-DOPA, which the brain turns into dopamine.'},{y:'1959',a:'Most of the brain’s dopamine is found in the striatum',b:'(Bertler & Rosengren; Sano and colleagues).'},{y:'1960',a:'Ehringer & Hornykiewicz: striatal dopamine is very low',b:'in the brains of people who had Parkinson’s disease.'},{y:'1961',a:'Birkmayer & Hornykiewicz give L-DOPA into a vein:',b:'movement eases for a few hours.'},{y:'1967',a:'Cotzias: doses by mouth, raised slowly, give lasting',b:'benefit. L-DOPA becomes the standard treatment.'}];
SCENE({id:'basal-ganglia-dopamine',name:'The missing dopamine',tag:'Hornykiewicz, 1960, and L-DOPA',
 definition:'In 1960 Herbert Ehringer and Oleh Hornykiewicz in Vienna measured dopamine in brains donated after death and found that in people who had had Parkinson’s disease the striatum held only a small fraction of the usual amount. Dopamine itself cannot be given as a medicine for this, because it does not pass from the blood into the brain. Its precursor L-DOPA does, and cells in the brain convert it into dopamine.',
 example:'Within a year Hornykiewicz had persuaded the neurologist Walther Birkmayer to try L-DOPA in patients, and people who could hardly move got up and walked for a few hours. George Cotzias made the treatment practical in 1967. It eases symptoms; it does not stop the loss of the cells.',
 desc:'A timeline of five discoveries from 1957 to 1967, bars comparing striatal dopamine in control brains and in Parkinson’s disease, and a blood–brain barrier that stops dopamine but lets L-DOPA through to be converted.',
 research:['Ehringer & Hornykiewicz (1960). Verteilung von Noradrenalin und Dopamin (3-Hydroxytyramin) im Gehirn des Menschen und ihr Verhalten bei Erkrankungen des extrapyramidalen Systems. Klinische Wochenschrift 38, 1236–1239.','Carlsson, Lindqvist & Magnusson (1957). 3,4-Dihydroxyphenylalanine and 5-hydroxytryptophan as reserpine antagonists. Nature 180, 1200. · Birkmayer & Hornykiewicz (1961). Wiener klinische Wochenschrift 73, 787–788.','Cotzias, Van Woert & Schiffer (1967). Aromatic amino acids and modification of parkinsonism. New England Journal of Medicine 276, 374–379. (History, not medical advice: see the lesson on Parkinson’s disease.)'],
 dur:14,hint:'Press the years to follow the discoveries in order. Then choose a molecule and press Give to see which one reaches the brain. This is history and mechanism, not medical advice.',
 init:()=>({ev:2,mol:'da',a:1,given:0}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {ev:k,mol:p<.5?'da':'ldopa',a:clamp((p%.5)/.4,0,1),given:1}},
 ui:[{choose:[['da','Dopamine'],['ldopa','L-DOPA']],label:'Molecule',get:s=>s.mol,act:'mol'},{b:'Give',act:'give'}],
 on:{ev(s,v){s.ev=+v;return 'keep'},mol(s,v){s.mol=v;s.given=0;s.a=1},give(s,v,ctx){s.given=1;B4_start(s,ctx,60);return 'keep'},tick:B4_tick(.05)},
 draw(s,f,X){
  const ev=B4_DAEV[s.ev],ld=s.mol==='ldopa',a=s.given?s.a:0,done=s.given&&s.a>=1;
  let out=heading(done?(ld?'L-DOPA crosses and becomes dopamine':'Dopamine is stopped at the barrier'):'Why give the precursor, not dopamine?');
  B4_DAEV.forEach((e,i)=>{const x=40+i*108,on=i===s.ev;out+=hit(X,'ev',i,`${e.y}: ${e.a} ${e.b}`,R(x,44,88,28,on?C.blue:'#fff',on?C.blue:C.line,14)+TB(x+44,63,e.y,13,on?'#fff':C.ink))+(i<4?L(x+90,58,x+106,58,C.line,2):'')});
  out+=T(300,96,ev.a,13,C.ink)+T(300,116,ev.b,13,C.ink);
  // bars
  out+=R(24,134,250,220,'#fff',C.grid,10)+TBF(36,154,'Dopamine in the striatum',12,C.ink,'start')+L(52,318,246,318,C.line,1.4);
  out+=R(70,178,62,140,C.blue,'none',5)+R(164,304,62,14,C.coral,'none',3)+TF(101,334,'control',12,C.muted)+TF(195,334,'Parkinson’s',12,C.muted)+TBF(101,172,'100%',12,C.blue)+TBF(195,296,'about a tenth',12,C.coral)+TF(149,348,'after Ehringer & Hornykiewicz (1960)',12,C.muted);
  // barrier
  out+=R(290,134,296,220,'#fff',C.grid,10)+R(300,168,112,150,'#fdeeee','none',8)+R(444,168,132,150,'#eef5fb','none',8)+TF(356,160,'blood',12,C.muted)+TF(510,160,'brain',12,C.muted);
  for(let i=0;i<5;i++)out+=R(416,170+i*30,24,26,'#e6d9cd','#b9a898',5);
  out+=TF(428,334,'blood–brain barrier',12,C.muted);
  for(let i=0;i<5;i++){const y=186+i*28,u=clamp(a*1.3-i*.06,0,1),xs=312+(i%2)*14;let x,col=ld?C.amber:C.coral;
   if(ld){x=xs+u*(470+(i%3)*30-xs);if(x>462)col=C.coral}else{x=xs+Math.min(u,.42)*210;if(u>.42)x-=(Math.min(u,.6)-.42)*120}
   out+=Ci(x,y,7,col,'#fff')}
  out+=Ci(306,344,6,C.amber,'#fff')+TF(316,348,'L-DOPA',12,C.muted,'start')+Ci(380,344,6,C.coral,'#fff')+TF(390,348,'dopamine',12,C.muted,'start');
  if(done)out+=ld?TB(510,306,'converted here',12,C.coral):TB(356,306,'turned back',12,C.coral);
  return {svg:out,phase:done?(ld?'L-DOPA is an amino acid, and the barrier’s amino-acid carriers take it across. Inside the brain an enzyme removes one small group and it becomes dopamine. That is why the precursor works as a medicine where dopamine itself cannot. It replaces what is missing for a time; it does not protect the cells.':'Dopamine in the blood does not cross the wall of tightly joined cells that lines the brain’s blood vessels, so giving dopamine cannot refill the striatum. Try L-DOPA.'):`${ev.y}: ${ev.a} ${ev.b} Choose a molecule and press Give.`};
 }});

/* ===================== Lesson: population-coding ===================== */
const B4_CELLS=[{pd:135,b:18,k:14},{pd:30,b:12,k:9},{pd:250,b:25,k:18}];
const B4_rad=d=>d*Math.PI/180;
function B4_tuneReach(s,j){s.n++;const c=B4_CELLS[s.cell],r=B4_rng(s.n*13+s.cell*7),rate=c.b+c.k*Math.cos(B4_rad(j*45-c.pd)),cnt=B4_pois(r,rate*.5),times=[];for(let i=0;i<cnt;i++)times.push(r()*.5);times.sort((a,b)=>a-b);s.data[s.cell][j].push(cnt*2);s.last={j,times}}
const B4_tuneNew=()=>({cell:0,n:0,last:null,data:[0,1,2].map(()=>range(8).map(()=>[]))});
function B4_tuneFit(rows){if(rows.some(a=>!a.length))return null;const m=rows.map(a=>sum(a)/a.length),b=sum(m)/8,ax=sum(m.map((v,j)=>v*Math.cos(B4_rad(j*45))))/4,ay=sum(m.map((v,j)=>v*Math.sin(B4_rad(j*45))))/4;return {b,k:Math.hypot(ax,ay),pd:B4_ang(Math.atan2(ay,ax)*180/Math.PI)}}
SCENE({id:'population-coding',name:'One cell, eight directions',tag:'Georgopoulos, 1982: broad tuning',
 definition:'In a population code, information such as the direction of a reach is carried by the combined activity of many neurons, each broadly tuned. In 1982 Apostolos Georgopoulos and colleagues recorded single cells in a monkey’s motor cortex while it moved a handle from the centre of a board to one of eight lights. A typical cell fired most for one preferred direction and progressively less for directions further from it, following a cosine curve.',
 example:'A cell that prefers reaches up and to the left still fires well for reaches straight up or straight left, and falls silent only for the opposite direction. So one cell’s firing cannot tell you the direction: two different reaches give the same rate.',
 desc:'A board with a centre and eight targets for the reach, the cell’s spikes on the last reach, and a graph of the firing rate against direction with the learner’s measurements and the fitted cosine curve.',
 research:['Georgopoulos, Kalaska, Caminiti & Massey (1982). On the relations between the direction of two-dimensional arm movements and cell discharge in primate motor cortex. Journal of Neuroscience 2, 1527–1537: about three quarters of the arm-related cells were tuned in this way.','Evarts (1968). Relation of pyramidal tract activity to force exerted during voluntary movement. Journal of Neurophysiology 31, 14–27: the first recordings from motor cortex cells in a moving monkey.','The cells here are simulated: a cosine tuning curve with random (Poisson) variation from reach to reach.'],
 dur:12,hint:'Press a target to have the monkey reach to it, and repeat: counts vary from reach to reach. Sample all eight directions to fit the curve and find the preferred direction. Listen plays the last reach’s spikes as clicks.',
 init:B4_tuneNew,
 watch(p){const s=B4_tuneNew(),n=Math.floor(p*24.99);for(let i=0;i<n;i++)B4_tuneReach(s,i%8);return s},
 ui:[{choose:[[0,'Cell 1'],[1,'Cell 2'],[2,'Cell 3']],label:'Cell',get:s=>s.cell,act:'cell'},{b:'Reach to all eight',act:'all'},{b:'Listen ▶',act:'listen'}],
 on:{cell(s,v){s.cell=+v;s.last=null},reach(s,v){B4_tuneReach(s,+v);return 'keep'},all(s){for(let j=0;j<8;j++)B4_tuneReach(s,j);return 'keep'},listen(s){if(s.last)for(const t of s.last.times)B4_click(t*2);return 'keep'}},
 draw(s,f,X){
  const rows=s.data[s.cell],fit=B4_tuneFit(rows),nTot=sum(rows.map(a=>a.length)),cx=130,cy=168,R0=78;
  let out=heading(fit?`Cell ${s.cell+1}: preferred direction about ${Math.round(fit.pd)}°`:`Cell ${s.cell+1}: ${rows.filter(a=>a.length).length} of 8 directions sampled`);
  if(s.last){const a=B4_rad(s.last.j*45);out+=L(cx,cy,cx+R0*Math.cos(a),cy-R0*Math.sin(a),C.coral,3)}
  for(let j=0;j<8;j++){const a=B4_rad(j*45),x=cx+R0*Math.cos(a),y=cy-R0*Math.sin(a),on=s.last&&s.last.j===j;out+=hit(X,'reach',j,`Reach towards ${j*45} degrees`,Ci(x,y,17,on?C.coral:rows[j].length?C.pale:'#fff',on?C.coral:C.blue)+TF(x,y+4,j*45+'°',12,on?'#fff':C.ink))}
  out+=Ci(cx,cy,9,C.dark)+TF(cx,cy+R0+40,'0° is to the right; angles go anticlockwise',12,C.muted);
  out+=R(24,300,214,58,'#fff',C.grid,10)+(s.last?TF(36,318,`last reach, ${s.last.j*45}°: ${s.last.times.length} spikes in 0.5 s`,12,C.ink,'start')+L(36,346,226,346,C.grid,1.2)+B4_ticks(36,338,190,s.last.times,.5,C.ink,14,1.5):TF(131,334,'press a target',12,C.muted));
  // graph
  const x0=300,w=262,yb=300,h=210,xx=d=>x0+d/360*w,yy=v=>yb-clamp(v,0,50)/50*h;
  out+=R(258,48,328,310,'#fff',C.grid,10)+L(x0,yb,x0+w,yb,C.line,1.4)+L(x0,yb,x0,yb-h,C.line,1.4);
  for(const v of [0,10,20,30,40,50])out+=TF(x0-6,yy(v)+4,v,12,C.muted,'end')+L(x0-3,yy(v),x0,yy(v),C.line,1.2);
  for(const d of [0,90,180,270,360])out+=TF(xx(d),yb+16,d+'°',12,C.muted)+L(xx(d),yb,xx(d),yb+4,C.line,1.2);
  out+=TF(x0+4,66,'spikes a second',12,C.muted,'start')+TF(x0+w,yb+34,'direction of reach',12,C.muted,'end');
  if(fit){let d='';for(let a=0;a<=360;a+=6)d+=(a?'L':'M')+fmt(xx(a))+' '+fmt(yy(fit.b+fit.k*Math.cos(B4_rad(a-fit.pd))));out+=P(d,C.coral,2.4)+L(xx(fit.pd),yb,xx(fit.pd),yy(fit.b+fit.k),C.coral,1.2,'stroke-dasharray="4 3"')+TF(x0+w,66,'cosine fitted to your data',12,C.coral,'end')}
  rows.forEach((a,j)=>{for(const v of a)out+=Ci(xx(j*45),yy(v),2.6,'#9fb9c9');if(a.length)out+=Ci(xx(j*45),yy(sum(a)/a.length),5.5,C.blue,'#fff')});
  out+=Ci(x0+8,yb+48,5,C.blue,'#fff')+TF(x0+18,yb+52,'mean',12,C.muted,'start')+Ci(x0+70,yb+48,2.6,'#9fb9c9')+TF(x0+78,yb+52,'single reaches',12,C.muted,'start')+TF(x0+w,yb+52,nTot+(nTot===1?' reach':' reaches'),12,C.muted,'end');
  return {svg:out,phase:fit?`Cell ${s.cell+1} fires most, about ${Math.round(fit.b+fit.k)} spikes a second, for reaches near ${Math.round(fit.pd)}°, and least, about ${Math.round(Math.max(0,fit.b-fit.k))}, for the opposite direction. In between the rate falls off smoothly, so the cell “votes” for a wide range of directions. More reaches make the estimate steadier. Try another cell: each has its own preferred direction.`:s.last?`The cell fired ${s.last.times.length} spikes in the half second around a reach to ${s.last.j*45}°, a rate of ${s.last.times.length*2} a second. Repeat the same reach and the count changes. Sample every direction to see the shape of the tuning.`:'Each press is one reach by the monkey from the centre to a target, with the cell’s spikes counted for half a second.'};
 }});

// Population vector: each cell votes along its preferred direction, weighted by how far its rate is from its mean rate.
const B4_POP={b:20,k:15,win:.5};
function B4_popDecode(pds,dir,r){let vx=0,vy=0;const votes=[];for(const pd of pds){const rate=B4_POP.b+B4_POP.k*Math.cos(B4_rad(dir-pd)),v=(B4_pois(r,rate*B4_POP.win)/B4_POP.win-B4_POP.b)/B4_POP.k;votes.push(v);vx+=v*Math.cos(B4_rad(pd));vy+=v*Math.sin(B4_rad(pd))}
 return {votes,vx,vy,dec:B4_ang(Math.atan2(vy,vx)*180/Math.PI)}}
const B4_popCells=n=>{const r=B4_rng(900+n);return range(n).map(()=>r()*360)};
SCENE({id:'population-coding-vector',name:'The population vector',tag:'Georgopoulos, Schwartz and Kettner, 1986',
 definition:'The population vector is a way of reading a direction out of many broadly tuned cells. Each cell casts a vote along its own preferred direction, with a weight given by how far its firing is above or below its average. Added head to tail, the votes of a few hundred motor cortex cells point close to the direction in which the monkey is about to reach.',
 example:'With three cells the sum is at the mercy of each cell’s random variation and of gaps between their preferred directions. With a hundred, the errors of individual cells largely cancel.',
 desc:'A dial with a line for each cell’s vote along its preferred direction, the true reach direction, and the sum of the votes, with the number of cells, the decoded direction and the error.',
 research:['Georgopoulos, Schwartz & Kettner (1986). Neuronal population coding of movement direction. Science 233, 1416–1419.','Georgopoulos, Caminiti, Kalaska & Massey (1983). Spatial coding of movement: a hypothesis concerning the coding of movement direction by motor cortical populations. Experimental Brain Research Supplement 7, 327–336.','Simulated cells with cosine tuning and Poisson variation; preferred directions are scattered at random.'],
 dur:12,hint:'Set the reach direction and the number of cells, then press New reach several times: the cells stay the same but their spike counts vary. Watch how far the blue sum strays from the green reach.',
 init:()=>({dir:60,n:10,seed:1}),
 watch(p){const n=[3,3,10,10,30,100][Math.min(5,Math.floor(p*6))];return {dir:60,n,seed:1+Math.floor(p*12)}},
 ui:[{range:'dir',label:'Reach direction',min:0,max:345,step:15,get:s=>s.dir,act:'dir',show:v=>v+'°'},{choose:[[3,'3 cells'],[10,'10'],[30,'30'],[100,'100']],label:'Cells',get:s=>s.n,act:'n'},{b:'New reach',act:'again'}],
 on:{dir(s,v){s.dir=+v},n(s,v){s.n=+v},again(s){s.seed++}},
 draw(s){
  const pds=B4_popCells(s.n),m=B4_popDecode(pds,s.dir,B4_rng(s.seed*53+s.n)),err=Math.round(Math.abs(B4_adiff(m.dec,s.dir))),cx=170,cy=206,R0=128;
  let out=heading(`${s.n} cells: decoded ${Math.round(m.dec)}°, reach ${s.dir}°, error ${err}°`);
  out+=Ci(cx,cy,R0,'#fbfcfd',C.grid);for(const d of [0,90,180,270])out+=TF(cx+(R0+16)*Math.cos(B4_rad(d)),cy-(R0+16)*Math.sin(B4_rad(d))+4,d+'°',12,C.muted);
  const sc=s.n>30?.3:s.n>10?.42:.55;pds.forEach((pd,i)=>{const v=m.votes[i],a=B4_rad(pd),len=Math.min(R0,Math.abs(v)*R0*sc),sg=v<0?-1:1;out+=L(cx,cy,cx+sg*len*Math.cos(a),cy-sg*len*Math.sin(a),v<0?'#d9a99b':'#8fb2ca',s.n>30?1.2:2)});
  const a0=B4_rad(s.dir);out+=arrow(cx,cy,cx+R0*Math.cos(a0),cy-R0*Math.sin(a0),C.green,3);
  const mag=Math.hypot(m.vx,m.vy)/(s.n/2),lv=clamp(mag,.25,1.05)*R0*.92,a1=B4_rad(m.dec);out+=arrow(cx,cy,cx+lv*Math.cos(a1),cy-lv*Math.sin(a1),C.blue,4.5)+Ci(cx,cy,5,C.dark);
  out+=R(340,52,246,150,'#fff',C.grid,10)+L(354,76,384,76,C.green,3)+TF(392,80,'the reach',12,C.ink,'start')+L(354,100,384,100,C.blue,4.5)+TF(392,104,'sum of the votes',12,C.ink,'start')+L(354,124,384,124,'#8fb2ca',2)+TF(392,128,'a cell firing above its mean',12,C.ink,'start')+L(354,148,384,148,'#d9a99b',2)+TF(392,152,'below its mean: it votes',12,C.ink,'start')+TF(392,167,'against its direction',12,C.ink,'start')+TF(354,190,'Each line lies along a preferred direction.',12,C.muted,'start');
  out+=counter(340,216,'cells',s.n,C.ink,76)+counter(425,216,'decoded',Math.round(m.dec)+'°',C.blue,76)+counter(510,216,'error',err+'°',err>20?C.coral:C.green,76);
  out+=R(340,276,246,74,'#fff',C.grid,10)+TF(352,298,err>20?'A large miss. Press New reach:':'Close. Press New reach: does',12,C.ink,'start')+TF(352,314,err>20?'is it always this far out?':'it stay close every time?',12,C.ink,'start')+TF(352,336,'Then change the number of cells.',12,C.muted,'start');
  return {svg:out,phase:`Each of the ${s.n} cells pulls along its own preferred direction, forwards if it fired more than its average rate and backwards if less. The blue arrow is the sum: ${Math.round(m.dec)}°, against a true reach of ${s.dir}°. ${s.n<=3?'With so few cells one unlucky spike count, or a gap between the preferred directions, swings the answer a long way.':s.n>=100?'With a hundred cells the random errors mostly cancel and the sum stays close on every reach.':'Press New reach a few times to see how much the answer wanders.'}`};
 }});

// Mean absolute error of the population vector against the number of cells (this model; 4,000 simulated reaches each).
const B4_REF={3:26.5,10:13.4,30:7.8,100:4.2,300:2.4};
const B4_NS=[3,10,30,100,300];
function B4_popRun(s,n,trials){for(let t=0;t<trials;t++){s.seed++;const r=B4_rng(s.seed*97+n),pds=range(n).map(()=>r()*360),dir=r()*360,m=B4_popDecode(pds,dir,r),e=Math.abs(B4_adiff(m.dec,dir));s.res[n].push(e);s.last={dir,dec:m.dec,n}}}
const B4_popNew=()=>({n:3,seed:0,last:null,res:{3:[],10:[],30:[],100:[],300:[]}});
SCENE({id:'population-coding-decode',name:'Few cells or many',tag:'Decoding error falls as cells are added',
 definition:'Decoding means estimating what the body is doing from the firing of neurons. With broadly tuned, variable cells, the error of the estimate depends on how many cells are read. Each cell’s random variation is independent of the others’, so averaging over more cells cancels more of it: the typical error falls roughly as one over the square root of the number of cells.',
 example:'In this simulation, reading 3 cells gives an average error of about 26°. Reading 300 brings it down to about 2°. This is why brain–computer interfaces record from many neurons at once.',
 desc:'A dial showing the last decoded reach, and a graph of average decoding error against the number of cells on a logarithmic axis, with the learner’s results as points beside the curve expected for this model.',
 research:['Georgopoulos, Schwartz & Kettner (1986). Science 233, 1416–1419. · Georgopoulos, Kettner & Schwartz (1988). Primate motor cortex and free arm movements to visual targets in three-dimensional space. II. Coding of the direction of movement by a neuronal population. Journal of Neuroscience 8, 2928–2937.','Salinas & Abbott (1994). Vector reconstruction from firing rates. Journal of Computational Neuroscience 1, 89–107: the population vector is simple but not the most accurate decoder.','The grey curve is this model’s own expected error, from 4,000 simulated reaches at each size. Real cells are not independent, so real gains from adding cells are smaller.'],
 dur:12,hint:'Choose a number of cells and run 20 reaches; repeat for each size and watch your points settle on the curve. With 3 cells, run it several times: how much does your average move?',
 init:B4_popNew,
 watch(p){const s=B4_popNew(),k=Math.min(5,Math.floor(p*6));for(let i=0;i<k;i++)B4_popRun(s,B4_NS[i],20);s.n=B4_NS[Math.min(4,k)];return s},
 ui:[{choose:B4_NS.map(n=>[n,n+(n===3?' cells':'')]),label:'Cells',get:s=>s.n,act:'n'},{b:'Run 20 reaches',act:'run'}],
 on:{n(s,v){s.n=+v},run(s){B4_popRun(s,s.n,20);return 'keep'}},
 draw(s){
  const mean=n=>s.res[n].length?sum(s.res[n])/s.res[n].length:null,cur=mean(s.n);
  let out=heading(cur===null?`${s.n} cells: run some reaches`:`${s.n} cells: average error ${fmt(B4_r1(cur))}° over ${s.res[s.n].length} reaches`);
  const cx=120,cy=170,R0=74;out+=Ci(cx,cy,R0,'#fbfcfd',C.grid)+TBF(cx,74,'Last reach',12,C.ink);
  if(s.last){const a0=B4_rad(s.last.dir),a1=B4_rad(s.last.dec);out+=arrow(cx,cy,cx+R0*Math.cos(a0),cy-R0*Math.sin(a0),C.green,3)+arrow(cx,cy,cx+R0*.86*Math.cos(a1),cy-R0*.86*Math.sin(a1),C.blue,4)+TF(cx,cy+R0+22,`${s.last.n} cells: off by ${Math.round(Math.abs(B4_adiff(s.last.dec,s.last.dir)))}°`,12,C.ink)}
  else out+=TF(cx,cy+32,'none yet',12,C.muted);
  out+=Ci(cx,cy,4,C.dark)+L(36,296,62,296,C.green,3)+TF(68,300,'the reach',12,C.muted,'start')+L(36,316,62,316,C.blue,4)+TF(68,320,'decoded from the cells',12,C.muted,'start')+TF(36,344,'A new set of cells each reach.',12,C.muted,'start');
  const x0=300,w=262,yb=300,h=220,lx=n=>x0+Math.log(n/2)/Math.log(450/2)*w,yy=e=>yb-clamp(e,0,60)/60*h;
  out+=R(244,48,342,310,'#fff',C.grid,10)+L(x0,yb,x0+w,yb,C.line,1.4)+L(x0,yb,x0,yb-h,C.line,1.4);
  for(const e of [0,15,30,45,60])out+=TF(x0-6,yy(e)+4,e+'°',12,C.muted,'end')+L(x0,yy(e),x0+w,yy(e),C.grid,1);
  for(const n of B4_NS)out+=TF(lx(n),yb+16,n,12,n===s.n?C.blue:C.muted,'middle',n===s.n?'font-weight="700"':'')+L(lx(n),yb,lx(n),yb+4,C.line,1.2);
  out+=TF(x0+4,66,'average error',12,C.muted,'start')+TF(x0+w,yb+34,'number of cells (log scale)',12,C.muted,'end');
  out+=P(B4_NS.map((n,i)=>(i?'L':'M')+fmt(lx(n))+' '+fmt(yy(B4_REF[n]))).join(''),C.muted,2,'none','stroke-dasharray="6 4"');
  for(const n of B4_NS)out+=Ci(lx(n),yy(B4_REF[n]),3,C.muted);
  out+=TF(x0+w,yb+52,'dashed: expected for this model',12,C.muted,'end');
  for(const n of B4_NS){const mu=mean(n);if(mu!==null)out+=Ci(lx(n),yy(mu),n===s.n?7:5.5,C.blue,'#fff')+TF(lx(n)+(n===300?-10:10),yy(mu)-8,fmt(B4_r1(mu))+'°',12,C.blue,n===300?'end':'start')}
  out+=Ci(x0+8,yb+48,5.5,C.blue,'#fff')+TF(x0+18,yb+52,'your averages',12,C.muted,'start');
  const done=B4_NS.filter(n=>s.res[n].length).length;
  return {svg:out,phase:cur===null?`Press Run to decode 20 reaches in random directions from ${s.n} cells.`:`From ${s.n} cells the decoded direction is off by ${fmt(B4_r1(cur))}° on average; the model expects about ${fmt(B4_REF[s.n])}°. ${done>=4?'Across your points, ten times as many cells cut the error to about a third: the square-root rule. Real neurons share some of their variation, so real populations gain less than this.':'Run the other sizes to draw the whole curve.'}`};
 }});

// Kakei, Hoffman & Strick (1999): turn the forearm and see whether a cell's preferred direction stays fixed in space
// or turns with the muscles. Angles here are illustrative.
const B4_KK=[{pd:60,turn:.03,peak:[34,33,35],kind:'space'},{pd:60,turn:.4,peak:[32,33,31],kind:'muscle'},{pd:200,turn:.02,peak:[36,26,15],kind:'gain'}];
const B4_POST=[[0,'palm down'],[90,'thumb up'],[180,'palm up']];
SCENE({id:'population-coding-debate',name:'What does motor cortex encode?',tag:'Direction, muscles or dynamics: an open argument',
 definition:'What motor cortex cells “encode” is an open argument. Georgopoulos read their firing as the direction of the hand in space. Evarts had found in 1968 that it follows the force a muscle must exert. In 1999 Kakei, Hoffman and Strick turned a monkey’s forearm, so that the same wrist movement in space needed different muscles, and found both kinds of cell side by side. Others argue that single cells encode no one variable, and that the population as a whole generates the pattern that drives the muscles.',
 example:'When the forearm turned from palm down to palm up, the wrist muscles’ own preferred directions turned a long way with it. Some cortical cells turned too (“muscle-like”); others kept the same preferred direction in space (“extrinsic-like”), some of them firing more or less strongly in each posture.',
 desc:'A forearm seen end-on in three postures and a dial showing a cell’s preferred direction in space for each posture, so that cells whose preference turns with the arm can be told from cells whose preference stays fixed.',
 research:['Kakei, Hoffman & Strick (1999). Muscle and movement representations in the primary motor cortex. Science 285, 2136–2139. (The cells here are illustrations of the two kinds, not their data.)','Evarts (1968). Journal of Neurophysiology 31, 14–27. · Todorov (2000). Direction tuning could arise from muscle control. Nature Neuroscience 3, 391–398. · Scott, Gribble, Graham & Cabel (2001). Dissociation between hand motion and population vectors from neural activity in motor cortex. Nature 413, 161–165.','Churchland et al. (2012). Neural population dynamics during reaching. Nature 487, 51–56: the population as a pattern generator.'],
 dur:12,hint:'Pick a cell and turn the forearm through its three postures. Does the cell’s preferred direction stay put in space, or turn with the arm? Decide before reading the verdict, which appears once you have seen all three.',
 init:()=>({cell:0,post:0,seen:{'0:0':1}}),
 watch(p){const k=Math.min(8,Math.floor(p*9)),cell=Math.floor(k/3),seen={};for(let i=0;i<=k%3;i++)seen[cell+':'+i]=1;return {cell,post:k%3,seen}},
 ui:[{choose:[[0,'Cell 1'],[1,'Cell 2'],[2,'Cell 3']],label:'Cell',get:s=>s.cell,act:'cell'},{choose:[[0,'Palm down'],[1,'Thumb up'],[2,'Palm up']],label:'Forearm',get:s=>s.post,act:'post'}],
 on:{cell(s,v){s.cell=+v;s.seen[s.cell+':'+s.post]=1},post(s,v){s.post=+v;s.seen[s.cell+':'+s.post]=1}},
 draw(s,f,X){
  const c=B4_KK[s.cell],rot=B4_POST[s.post][0],pdOf=i=>c.pd+c.turn*B4_POST[i][0],pd=pdOf(s.post),all=[0,1,2].every(i=>s.seen[s.cell+':'+i]),shift=Math.round(pdOf(2)-pdOf(0));
  let out=heading(all?`Cell ${s.cell+1}: preferred direction shifts ${shift}° for a 180° turn`:`Cell ${s.cell+1}, ${B4_POST[s.post][1]}: prefers ${Math.round(pd)}°`);
  // forearm end-on
  const ax=130,ay=170;out+=TBF(ax,70,'Forearm seen end-on',12,C.ink)+Ci(ax,ay,70,'#fbfcfd',C.grid);
  out+=G(R(-52,-17,104,34,'#e9dccf','#b9a898',14)+R(-52,-17,104,10,'#cdb9a6','none',6)+Ci(-58,0,10,'#e9dccf','#b9a898'),`transform="translate(${ax} ${ay}) rotate(${-rot})"`);
  out+=TF(ax,ay+92,B4_POST[s.post][1],13,C.ink)+TF(ax,ay+110,`turned ${rot}° from palm down`,12,C.muted);
  B4_POST.forEach((q,i)=>{const x=60+i*70;out+=hit(X,'post',i,`Forearm ${q[1]}`,R(x-30,300,60,26,i===s.post?C.amber:'#fff',i===s.post?C.amber:C.line,8)+TF(x,318,q[0]+'°',12,i===s.post?'#fff':C.ink))});
  out+=TF(130,346,'dark band: back of the hand',12,C.muted);
  // dial
  const cx=400,cy=188,R0=82;out+=TBF(cx,70,'Preferred direction in space',12,C.ink)+Ci(cx,cy,R0,'#fbfcfd',C.grid);
  for(const d of [0,90,180,270])out+=TF(cx+(R0+15)*Math.cos(B4_rad(d)),cy-(R0+15)*Math.sin(B4_rad(d))+4,d+'°',12,C.muted);
  for(let i=0;i<3;i++)if(i!==s.post&&s.seen[s.cell+':'+i]){const a=B4_rad(pdOf(i)),len=R0*c.peak[i]/36;out+=L(cx,cy,cx+len*Math.cos(a),cy-len*Math.sin(a),'#e3b3a6',3,'stroke-dasharray="6 4"')}
  const a=B4_rad(pd),len=R0*c.peak[s.post]/36;out+=arrow(cx,cy,cx+len*Math.cos(a),cy-len*Math.sin(a),C.coral,4)+Ci(cx,cy,5,C.dark);
  out+=TF(cx,cy+R0+36,`best direction ${Math.round(pd)}° · peak ${c.peak[s.post]} spikes a second`,12,C.ink)+TF(cx,cy+R0+52,'dashed: the other postures you have tried',12,C.muted);
  out+=R(500,96,86,150,'#fff',C.grid,10)+TBF(543,116,'Verdict',12,C.ink);
  const vd=c.kind==='muscle'?['turns with','the arm:','muscle-like']:c.kind==='space'?['fixed in','space:','extrinsic-like']:['fixed in space,','but its rate','depends on posture'];
  out+=all?TF(543,142,vd[0],12,C.ink)+TF(543,158,vd[1],12,C.ink)+TBF(543,180,vd[2].length>14?vd[2].slice(0,vd[2].indexOf(' ',6)):vd[2],12,c.kind==='muscle'?C.purple:C.green)+(vd[2].length>14?TBF(543,196,vd[2].slice(vd[2].indexOf(' ',6)+1),12,C.green):''):TF(543,150,'see all three',12,C.muted)+TF(543,166,'postures first',12,C.muted);
  out+=TBF(543,232,'Both exist.',12,C.amber);
  return {svg:out,phase:all?(c.kind==='muscle'?`Turning the forearm 180° swung this cell’s preferred direction by ${shift}°, part of the way round, as the wrist muscles’ own preferred directions do. It behaves like a controller of muscles.`:c.kind==='space'?`This cell’s preferred direction barely moved (${shift}°) although the muscles needed for that movement changed completely. It behaves as if it coded the direction of movement in space.`:`The preferred direction stayed put (${shift}°), but the peak rate fell from ${c.peak[0]} to ${c.peak[2]} spikes a second. Space-like in direction, yet not blind to posture: cells like this do not fit either simple reading.`)+' Kakei and colleagues found such kinds mixed together in primary motor cortex, which is one reason the question of what it “encodes” has no agreed answer.':'The task: the monkey moves its wrist in eight directions with the forearm held palm down, thumb up or palm up. The direction in space is the same each time, but the muscles that produce it are not. Turn the forearm and watch the arrow.'};
 }});
