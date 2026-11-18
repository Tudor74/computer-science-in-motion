/* ===================== Brain In Motion · Era 7 · When things go wrong ===================== */
// Stroke, epilepsy, Parkinson’s disease, Alzheimer’s disease, depression and its treatments, addiction.
// This era explains; it never tests the learner. No scene is a self-check, a diagnosis or medical advice,
// and no scene gives a dose or suggests starting, stopping or changing a treatment.
// Nothing flashes: EEG and tremor traces are still lines, pulses are marks on a time axis. No sound.
// Every picture is a pure function of state, frame and X. Models are labelled schematic or illustrative;
// published numbers are drawn as published and named in the scene's research line.

/* ---- shared helpers ---- */
const B7_r1=v=>Math.round(v*10)/10;
const B7_r2=v=>Math.round(v*100)/100;
const B7_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const B7_note=(s,y=368)=>TF(300,y,s,13,C.muted);
const B7_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const B7_rng=n=>rng(B7_mix(n));
function B7_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
// Standard normal cumulative distribution (Abramowitz & Stegun 7.1.26, error below 1.5e-7).
function B7_Phi(z){const s=z<0?-1:1,x=Math.abs(z)/Math.SQRT2,t=1/(1+.3275911*x),y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return .5*(1+s*y)}
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function B7_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A tile with a label and a value (fixed-size text).
function B7_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,15,col)}
// Fixed-size text broken into lines of at most n characters.
function B7_wrap(x,y,s,n,size=13,fill=C.ink,anchor='start',lh=17){const lines=[];let cur='';for(const w of String(s).split(' ')){if(cur&&(cur+' '+w).length>n){lines.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)lines.push(cur);return lines.map((l,i)=>TF(x,y+i*lh,l,size,fill,anchor)).join('')}
// A coloured strip with one centred line, for safety messages.
const B7_banner=(s,y,col=C.coral,fill=C.coralp)=>R(20,y,560,26,fill,'none',8)+TBF(300,y+18,s,13,col);
// An inhibitory connection: a line ending in a bar.
function B7_inh(x1,y1,x2,y2,col=C.coral,w=2.4){const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;return L(x1,y1,x2,y2,col,w)+L(x2-uy*7,y2+ux*7,x2+uy*7,y2-ux*7,col,w+1.5)}
// A grid of 100 people (10 × 10 dots); colours from fn(i).
function B7_people(x,y,gap,fn,r=6){let o='';for(let i=0;i<100;i++)o+=Ci(x+(i%10)*gap,y+Math.floor(i/10)*gap,r,fn(i));return o}
// Lateral view of a cerebral hemisphere, front towards the left (or the right when flip). Points are given in a
// 240 × 160 box and mapped by B7_bp; the outline and the central sulcus come back as svg.
const B7_bp=(x,y,s,flip)=>(px,py)=>[flip?x+(240-px)*s:x+px*s,y+py*s];
function B7_brain(x,y,s,flip,fill='#f3eee9',stroke='#a99a8c'){
 const q=B7_bp(x,y,s,flip),pt=(a,b)=>q(a,b).map(fmt).join(' ');
 let o=`<path d="M${pt(22,92)} C${pt(10,52)} ${pt(50,10)} ${pt(112,12)} C${pt(172,8)} ${pt(228,32)} ${pt(232,80)} C${pt(236,108)} ${pt(216,128)} ${pt(192,132)} C${pt(176,150)} ${pt(150,156)} ${pt(132,148)} C${pt(112,158)} ${pt(84,156)} ${pt(72,142)} C${pt(44,142)} ${pt(26,122)} ${pt(22,92)} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.2"/>`;
 o+=`<ellipse cx="${fmt(q(196,146)[0])}" cy="${fmt(q(196,146)[1])}" rx="${fmt(30*s)}" ry="${fmt(15*s)}" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/>`;
 o+=P(`M${pt(150,134)} L${pt(158,166)}`,stroke,5*s);
 o+=P(`M${pt(70,104)} C${pt(100,92)} ${pt(140,88)} ${pt(176,84)}`,stroke,1.8);
 o+=P(`M${pt(126,13)} C${pt(120,40)} ${pt(112,66)} ${pt(104,92)}`,stroke,1.8);
 return o;
}

/* ===================== Lesson: stroke ===================== */
const B7_EMERG='Think someone is having a stroke? Call your local emergency number at once.';
// The artery sketch: a trunk, three branches, two twigs each. Branch 1 (the middle) is the one that fails.
const B7_ART={J:[96,178],br:[[[160,106],[[214,80],[228,124]]],[[172,164],[[238,146],[242,192]]],[[150,222],[[214,208],[236,236]]]]};
SCENE({id:'stroke',name:'Blocked or burst',tag:'Wepfer, 1658 · CT scanning, 1970s',
 definition:'A stroke is damage to the brain from a sudden failure of its blood supply. In 1658 the Swiss physician Johann Jakob Wepfer, examining people who had died of apoplexy, found bleeding inside the brain in several and proposed that a blocked artery could cause the same illness. Both kinds are recognised today. In an ischaemic stroke a clot blocks an artery and the tissue beyond it is starved. In a haemorrhagic stroke a vessel bursts and blood leaks into or around the brain.',
 example:'In Europe and North America about four strokes in five are ischaemic; bleeds make up a larger share in parts of Asia and Africa. Until CT scanning arrived in the 1970s, doctors could not reliably tell the two apart in a living person. It matters: a drug that dissolves clots can help an ischaemic stroke and would make a bleed worse.',
 desc:'A sketch of an artery and its branches with either a clot or a burst vessel, the territory affected, a schematic CT slice in the first hours or a day later, and a row of five strokes of which four are ischaemic.',
 research:['Wepfer (1658). Historiae apoplecticorum (observations on apoplexy). Schaffhausen.','Hounsfield (1973). Computerized transverse axial scanning (tomography). British Journal of Radiology 46, 1016–1022.','Shares of stroke types vary by region and study; “about four in five” describes data from Europe and North America.'],
 dur:14,hint:'Choose a blocked or a burst vessel, then look at the CT slice in the first hours and a day later. This picture explains; it is not a check. Think someone is having a stroke? Call your local emergency number at once.',
 init:()=>({type:'isch',scan:'early'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {type:k<2?'isch':'haem',scan:k%2?'later':'early'}},
 ui:[{choose:[['isch','Blocked (ischaemic)'],['haem','Burst (haemorrhagic)']],label:'Kind of stroke',get:s=>s.type,act:'type'},{choose:[['early','CT in the first hours'],['later','CT a day or two later']],label:'Scan',get:s=>s.scan,act:'scan'}],
 on:{type(s,v){s.type=v==='haem'?'haem':'isch'},scan(s,v){s.scan=v==='later'?'later':'early'}},
 draw(s,f,X){
  const isch=s.type==='isch',late=s.scan==='later';
  let out=heading(isch?'Ischaemic: a clot blocks an artery':'Haemorrhagic: a vessel bursts');
  // the artery sketch
  out+=R(20,46,272,212,'#fff',C.grid,10)+TF(156,66,'an artery and its branches (sketch)',13,C.muted);
  if(isch)out+=`<ellipse cx="222" cy="170" rx="54" ry="38" fill="${C.coralp}" stroke="${C.coral}" stroke-width="1.6" stroke-dasharray="5 4"/>`+TF(222,246,'starved of blood',13,C.coral);
  const J=B7_ART.J;out+=L(40,240,J[0],J[1],C.coral,7);
  B7_ART.br.forEach(([m,tw],i)=>{const dead=isch&&i===1,col=dead?'#d9b2a6':C.coral,ex=dead?'stroke-dasharray="4 5"':'';
   out+=(dead?L(J[0],J[1],136,171,C.coral,5)+L(136,171,m[0],m[1],col,4,ex):L(J[0],J[1],m[0],m[1],col,5))+tw.map(t=>L(m[0],m[1],t[0],t[1],col,3.2,ex)).join('')});
  if(isch){out+=`<ellipse cx="136" cy="171" rx="12" ry="8" fill="#6b2a1c" stroke="#fff" stroke-width="1.5" transform="rotate(-9 136 171)"/>`;
   out+=L(136,162,136,104,C.ink,1)+TF(136,98,'clot',13,C.ink)}
  else{const r=late?20:13;out+=`<ellipse cx="214" cy="154" rx="${r+6}" ry="${r}" fill="#b23a22" fill-opacity=".75"/>`+TF(214,154-r-10,'blood leaks out',13,C.coral)+TF(214,206,'pressure rises around it',13,C.coral)}
  // the CT slice (dark like a real scan, but still)
  out+=R(308,46,272,212,'#1f2a30','none',10)+TF(444,66,'CT slice, schematic',13,'#cfd8dd');
  out+=`<ellipse cx="444" cy="152" rx="96" ry="70" fill="#7b878d" stroke="#eef1f3" stroke-width="7"/>`;
  out+=`<ellipse cx="430" cy="150" rx="9" ry="20" fill="#3c474d"/><ellipse cx="458" cy="150" rx="9" ry="20" fill="#3c474d"/>`;
  if(!isch)out+=`<ellipse cx="490" cy="138" rx="${late?26:22}" ry="${late?19:16}" fill="#f6f6f6"/>`;
  if(isch&&late)out+=P('M470 100 L520 118 L522 176 L478 170 Z','none',0,'#525e64');
  out+=TF(444,242,!isch?'fresh blood shows bright white':late?'dead tissue now shows darker':'first hours: often looks normal',13,'#eef1f3');
  // four in five
  out+=R(20,268,272,70,'#fff',C.grid,10);
  for(let i=0;i<5;i++)out+=Ci(44+i*30,294,11,i<4?C.blue:C.coral,'#fff');
  out+=TF(156,328,'about 4 in 5 are ischaemic',13,C.ink);
  out+=TF(196,290,'blue: blocked',13,C.blue,'start')+TF(196,308,'red: burst',13,C.coral,'start');
  out+=R(308,268,272,70,C.amberp,'none',10)+TBF(444,288,'Why the scan comes first',13,C.amber)+TF(444,306,'Clot-dissolving drugs help a blockage',13,C.ink)+TF(444,324,'but would make a bleed worse.',13,C.ink);
  out+=B7_banner(B7_EMERG,346);
  return {svg:out,phase:isch?(late?'A day or two on, the tissue that died shows as a darker area on CT. By then the chance to save it has passed, which is why treatment cannot wait for this picture.':'A clot has lodged in an artery and the branches beyond it carry no blood. On CT in the first hours the brain often looks normal; the scan is done first mainly to rule out bleeding before any clot-dissolving drug.'):
   (late?'The leaked blood still shows bright white on CT, and the brain around it is under pressure. Treatment aims to stop the bleeding and protect the brain; clot-dissolving drugs are not given.':'Fresh blood is denser than brain, so it shows bright white on CT within minutes. That is what made it possible, from the 1970s, to tell a bleed from a blockage before treating.')};
 }});

// FAST: what each sign means and where in the brain it comes from. Not a check.
const B7_FAST={F:['Face','One side of the face droops: the smile is uneven.','The face area of motor cortex lies low on the strip, next to the hand.'],
 A:['Arm','One arm is weak or numb and drifts down.','The arm and hand areas lie just above the face area; one artery often supplies both.'],
 S:['Speech','Speech is slurred, muddled or lost.','For most people language depends more on the left hemisphere.'],
 T:['Time','Time to call the emergency number, now.','Every minute counts: the next scene shows why.']};
SCENE({id:'stroke-fast',name:'Face, arm, speech, time',tag:'Recognising a stroke quickly',
 definition:'FAST is a short public reminder of the commonest signs of a stroke. Face: one side droops. Arm: one arm is weak. Speech: words are slurred or muddled. Time: call the emergency number at once. It grew out of the Face Arm Speech Test, used by ambulance staff in England from the late 1990s, whose accuracy Harbison and colleagues reported in 2003.',
 example:'Each sign points to a part of the brain. The face and arm areas of motor cortex lie next to each other, and the middle cerebral artery supplies both, so a block there often weakens the face and arm together, on the side of the body opposite the stroke. A stroke can also show as sudden loss of vision, balance or coordination, which FAST does not cover, so a person without the FAST signs can still be having a stroke.',
 desc:'A side view of a hemisphere with the motor strip and language areas, a simple figure showing which side of the body is affected, and four letter tiles, F, A, S and T, that explain each sign. A banner says to call the emergency number.',
 research:['Harbison, Hossain, Jenkinson, Davis, Louw & Ford (2003). Diagnostic accuracy of stroke referrals from primary care, emergency room physicians, and ambulance staff using the face arm speech test. Stroke 34, 71–76.','Penfield & Rasmussen (1950). The Cerebral Cortex of Man (the face and hand areas lie side by side on the motor strip).'],
 dur:14,hint:'Press F, A, S or T to see what the sign is and where it comes from, and switch the side of the stroke. This explains the signs; it is not a check. Think someone is having a stroke? Call your local emergency number at once.',
 init:()=>({k:'F',side:'left'}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {k:'FAST'[Math.min(3,k)],side:k===4?'right':'left'}},
 ui:[{choose:[['F','Face'],['A','Arm'],['S','Speech'],['T','Time']],label:'Sign',get:s=>s.k,act:'k'},{choose:[['left','Left hemisphere'],['right','Right hemisphere']],label:'Stroke in the',get:s=>s.side,act:'side'}],
 on:{k(s,v){s.k=B7_FAST[v]?v:'F'},side(s,v){s.side=v==='right'?'right':'left'}},
 draw(s,f,X){
  const left=s.side==='left',sg=B7_FAST[s.k],flip=!left,q=B7_bp(28,58,1.05,flip),bodySide=left?'right':'left';
  let out=heading(`${s.k} for ${sg[0]}`);
  out+=R(20,44,276,200,'#fff',C.grid,10)+TF(left?30:286,62,`${left?'left':'right'} hemisphere`,13,C.muted,left?'start':'end');
  // middle cerebral artery territory, shaded
  const mca=[[44,84],[80,40],[150,30],[206,52],[214,100],[180,124],[120,120],[70,118]].map(p=>q(p[0],p[1]).map(fmt).join(' ')).join(' L');
  out+=B7_brain(28,58,1.05,flip)+P('M'+mca+' Z','none',0,C.coralp,'fill-opacity=".55"');
  out+=B7_brain(28,58,1.05,flip,'none');
  // motor strip in front of the central sulcus, with leg, arm and face areas
  const strip=[[118,16,'leg'],[112,42,'arm'],[104,70,'face']];
  strip.forEach(([a,b,l],i)=>{const p=q(a,b),on=(s.k==='F'&&l==='face')||(s.k==='A'&&l==='arm');out+=Ci(p[0],p[1],9,on?C.coral:C.pale,on?C.coral:C.blue)+TF(p[0]+(flip?16:-16),p[1]+5,l,13,on?C.coral:C.blue,flip?'start':'end')});
  if(left){const b=q(64,96),w=q(172,104),on=s.k==='S';out+=Ci(b[0],b[1],8,on?C.purple:C.purplep,C.purple)+Ci(w[0],w[1],8,on?C.purple:C.purplep,C.purple)+TF(b[0],b[1]+24,'Broca’s area',13,C.purple)+TF(w[0],w[1]+24,'Wernicke’s area',13,C.purple)}
  out+=TF(158,236,'shaded: middle cerebral artery territory',13,C.coral);
  // the figure, facing us: the person's right side is on our left
  const hx=440,affL=bodySide==='right';out+=R(310,44,270,200,'#fff',C.grid,10);
  const fc=(s.k==='F')?C.coral:C.ink,ac=(s.k==='A')?C.coral:C.ink;
  out+=Ci(hx,96,30,'#fdf7f1',C.ink)+Ci(hx-11,88,3,C.ink)+Ci(hx+11,88,3,C.ink);
  const mL=affL?[hx-14,112]:[hx-14,106],mR=affL?[hx+14,106]:[hx+14,112];out+=P(`M${mL[0]} ${mL[1]} Q${hx} ${s.k==='F'?110:116} ${mR[0]} ${mR[1]}`,fc,2.6);
  out+=L(hx,126,hx,196,C.ink,3)+L(hx,196,hx-22,236,C.ink,3)+L(hx,196,hx+22,236,C.ink,3);
  const armY=s.k==='A'?184:150;out+=L(hx,140,affL?hx-58:hx-58,affL?armY:150,affL?ac:C.ink,3)+L(hx,140,hx+58,affL?150:armY,affL?C.ink:ac,3);
  out+=TF(affL?352:528,70,'weaker side',13,C.coral)+TF(affL?352:528,86,`(person’s ${bodySide})`,13,C.coral);
  if(s.k==='S')out+=R(476,118,98,40,'#fff',C.purple,10)+TF(525,134,left?'words muddled':'words slurred',13,C.purple)+TF(525,150,left?'or lost':'',13,C.purple);
  if(s.k==='T')out+=Ci(522,140,24,'#fff',C.coral)+L(522,140,522,124,C.coral,2.6)+L(522,140,534,146,C.coral,2.6)+TF(522,180,'call now',13,C.coral);
  // letter tiles
  ['F','A','S','T'].forEach((k,i)=>{const x=20+i*142,on=k===s.k;out+=hit(X,'k',k,`${k}: ${B7_FAST[k][0]}`,R(x,252,134,46,on?C.coral:'#fff',on?C.coral:C.line,10)+TBF(x+24,282,k,20,on?'#fff':C.coral)+TBF(x+44,281,B7_FAST[k][0],15,on?'#fff':C.ink,'start'))});
  out+=TF(300,318,sg[1],13,C.ink);
  out+=B7_banner(B7_EMERG,328)+TF(300,370,'This picture explains the signs. It is not a check, and no sign means no stroke.',13,C.muted);
  const why=s.k==='S'&&!left?'A right-hemisphere stroke can still slur speech by weakening the muscles of the face and tongue, but language itself is usually spared.':sg[2];
  return {svg:out,phase:`${sg[0]}: ${sg[1]} ${why} A stroke in the ${s.side} hemisphere affects the ${bodySide} side of the body, because each hemisphere controls the opposite side.`};
 }});

// Saver (2006): a typical large-vessel ischaemic stroke grows to about 54 mL over about 10 hours, losing about
// 1.9 million neurons a minute on average. The average is spread evenly here, as in his estimate.
const B7_SAVER={ml:54,min:600,perMin:1.9e6,agePerHour:3.6};
const B7_hm=m=>m<60?`${m} min`:`${Math.floor(m/60)} h${m%60?` ${m%60} min`:''}`;
const B7_neurons=n=>n<1e9?`${Math.round(n/1e6)} million`:`${fmt(B7_r2(n/1e9))} billion`;
SCENE({id:'stroke-time',name:'Time is brain',tag:'The penumbra · Saver, 2006',
 definition:'When an artery is blocked, the tissue it feeds does not all die at once. A core with almost no blood flow dies within minutes. Around it lies the penumbra, a rim kept alive for a while by blood from neighbouring vessels: it has stopped working but can still recover if flow returns. Astrup, Siesjö and Symon named it in 1981. Over the following hours the core spreads into the penumbra.',
 example:'Jeffrey Saver (2006) estimated that in a typical large-vessel ischaemic stroke the brain loses about 1.9 million neurons, 14 billion synapses and 12 km of nerve fibres for every minute without treatment, and that each hour costs as many neurons as about 3.6 years of normal ageing. These are averages spread over about 10 hours; how fast the core grows differs a great deal between people.',
 desc:'A schematic brain slice with a region at risk, a core that grows into it as time passes, a graph of core volume against minutes from onset with the usual treatment windows marked, and tiles for neurons lost and tissue still saveable.',
 research:['Astrup, Siesjö & Symon (1981). Thresholds in cerebral ischemia: the ischemic penumbra. Stroke 12, 723–725.','Saver (2006). Time is brain, quantified. Stroke 37, 263–266 (54 mL over about 10 hours; 1.9 million neurons a minute).'],
 dur:12,hint:'Move the time from the start of the stroke to the moment blood flow returns, and watch how much of the rim is still saveable. Averages only: real strokes vary widely. Think someone is having a stroke? Call your local emergency number at once.',
 init:()=>({t:90}),
 watch(p){return {t:Math.round(600*smooth(p)/15)*15}},
 ui:[{range:'t',label:'Minutes until blood flow returns',min:0,max:600,step:15,get:s=>s.t,act:'t',show:v=>B7_hm(+v)}],
 on:{t(s,v){s.t=clamp(Math.round(+v/15)*15,0,600)}},
 draw(s){
  const S=B7_SAVER,u=s.t/S.min,core=S.ml*u,pen=S.ml-core,lost=S.perMin*s.t;
  let out=heading(s.t?`After ${B7_hm(s.t)}: ${fmt(B7_r1(core))} of ${S.ml} mL lost`:'At the start: the rim at risk is still alive');
  // slice
  out+=R(20,46,250,236,'#fff',C.grid,10)+`<ellipse cx="145" cy="146" rx="100" ry="82" fill="#f3eee9" stroke="#a99a8c" stroke-width="2.2"/>`+L(145,66,145,226,'#c9bcae',1.4);
  const rx=62,ry=46,cx=168,cy=142;out+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.amberp}" stroke="${C.amber}" stroke-width="2" stroke-dasharray="5 4"/>`;
  const k=Math.sqrt(Math.max(u,0));if(u>0)out+=`<ellipse cx="${cx}" cy="${cy}" rx="${fmt(rx*k)}" ry="${fmt(ry*k)}" fill="#9a3b26"/>`;
  out+=R(36,242,12,12,'#9a3b26','none',2)+TF(54,253,'core: lost',13,'#9a3b26','start')+R(36,262,12,12,C.amberp,C.amber,2)+TF(54,273,u<1?'penumbra: still saveable':'no penumbra left',13,C.amber,'start');
  // graph
  const pl=B7_plot(320,58,256,150,[0,600],[0,60],{xt:[[0,'0'],[120,'2 h'],[270,'4.5 h'],[360,'6 h'],[600,'10 h']],yt:[[0,'0'],[27,'27'],[54,'54']],xl:'time from onset to restoring flow',yl:'core volume, mL'});
  out+=R(pl.X(0),58,pl.X(270)-pl.X(0),150,C.greenp,'none',0)+R(pl.X(270),58,pl.X(360)-pl.X(270),150,C.pale,'none',0)+pl.svg.replace(/fill="#fff"/,'fill="none"');

  out+=L(pl.X(0),pl.Y(0),pl.X(600),pl.Y(54),C.coral,2.4)+L(pl.X(s.t),58,pl.X(s.t),208,C.ink,1.4,'stroke-dasharray="3 3"')+Ci(pl.X(s.t),pl.Y(core),6,C.coral,'#fff');
  out+=R(320,258,12,12,C.greenp,C.green,2)+TF(338,269,'drug, to 4.5 h',13,C.green,'start')+R(452,258,12,12,C.pale,C.blue,2)+TF(470,269,'clot removal, 6 h',13,C.blue,'start');
  out+=B7_tile(20,290,180,'Neurons lost (average)',s.t?B7_neurons(lost):'none yet',C.coral)+B7_tile(210,290,180,'Still saveable',fmt(B7_r1(pen))+' mL',C.amber)+B7_tile(400,290,180,'Like normal ageing of',fmt(B7_r1(B7_SAVER.agePerHour*s.t/60))+' years',C.ink);
  out+=B7_note(`1.9 million a minute × ${s.t} min (Saver’s averages). Not a guide to any one person.`,360);
  return {svg:out,phase:!s.t?'The blocked artery has left a region at risk. Its centre is already failing; the rim, the penumbra, is silent but alive, kept going by blood from neighbouring vessels.':
   u<1?`After ${B7_hm(s.t)} the core has, on Saver’s average, taken ${fmt(B7_r1(core))} mL and about ${B7_neurons(lost)} neurons. ${fmt(B7_r1(pen))} mL of penumbra could still recover if blood flow returned now. Every 15 minutes sooner saves, on average, about ${Math.round(S.perMin*15/1e6)} million neurons.`:
   `By about 10 hours the whole region at risk has, on average, become core: about ${B7_neurons(lost)} neurons, as many as about ${fmt(B7_r1(B7_SAVER.agePerHour*10))} years of normal ageing. Real strokes vary: in some people the penumbra survives much longer, which is why scans are used to select people for later treatment.`};
 }});

// Emberson et al. (2014): odds ratios for a good outcome (little or no disability at 3–6 months) with alteplase, by delay.
const B7_EMB=[{lab:'up to 3 h',or:1.75,lo:1.35,hi:2.27,to:180},{lab:'3 to 4.5 h',or:1.26,lo:1.05,hi:1.51,to:270},{lab:'over 4.5 h',or:1.15,lo:.95,hi:1.40,to:1e9}];
SCENE({id:'stroke-treatment',name:'Clearing the blockage',tag:'The NINDS trial, 1995 · thrombectomy, 2015',
 definition:'In 1995 the NINDS trial gave 624 people the clot-dissolving drug alteplase (tissue plasminogen activator) or a placebo within 3 hours of an ischaemic stroke. At three months, those given the drug were at least 30% more likely to have little or no disability. The main risk was bleeding into the brain: 6.4% against 0.6%. In 2015 five trials showed that pulling the clot out of a large artery with a catheter, thrombectomy, greatly improved recovery for people with that kind of blockage.',
 example:'Benefit falls with delay. Pooling nine alteplase trials, Emberson and colleagues (2014) found the odds of a good outcome raised by about 75% when treatment began within 3 hours, about 26% between 3 and 4.5 hours, and by an amount that could not be told apart from chance after that. For thrombectomy, the pooled HERMES data (2016) showed 46% of people independent at three months against 26.5% with usual care.',
 desc:'For the clot-dissolving drug, three odds ratios with their ranges, one for each time window, with the chosen delay highlighted and the bleeding risk from NINDS. For clot removal, the share of people independent at three months with and without it.',
 research:['NINDS rt-PA Stroke Study Group (1995). Tissue plasminogen activator for acute ischemic stroke. New England Journal of Medicine 333, 1581–1587.','Emberson et al. (2014). Effect of treatment delay, age, and stroke severity on the effects of intravenous thrombolysis with alteplase for acute ischaemic stroke. Lancet 384, 1929–1935.','Goyal et al. (2016). Endovascular thrombectomy after large-vessel ischaemic stroke: a meta-analysis of individual patient data from five randomised trials (HERMES). Lancet 387, 1723–1731.'],
 dur:14,hint:'Choose a treatment and move the delay. Whether any treatment is right is decided by the stroke team after a brain scan: this is history and evidence, not medical advice. Think someone is having a stroke? Call your local emergency number at once.',
 init:()=>({tr:'tpa',h:2}),
 watch(p){return p<.66?{tr:'tpa',h:[1.5,4,5.5][Math.min(2,Math.floor(p/.22))]}:{tr:'evt',h:4}},
 ui:[{choose:[['tpa','Clot-dissolving drug'],['evt','Clot removal']],label:'Treatment',get:s=>s.tr,act:'tr'},{range:'h',label:'Hours from onset to treatment',min:.5,max:6,step:.5,get:s=>s.h,act:'h',show:v=>fmt(+v)+' h'}],
 on:{tr(s,v){s.tr=v==='evt'?'evt':'tpa'},h(s,v){s.h=clamp(Math.round(+v*2)/2,.5,6)}},
 draw(s){
  const tpa=s.tr==='tpa',band=B7_EMB.findIndex(b=>s.h*60<=b.to),B=B7_EMB[band];
  let out=heading(tpa?`Drug given at ${fmt(s.h)} h: odds of a good outcome × ${B.or}`:'Clot removal: independent at three months');
  if(tpa){
   const pl=B7_plot(150,56,400,160,[.8,2.4],[0,3],{xt:[[.8,'0.8'],[1,'1'],[1.5,'1.5'],[2,'2'],[2.4,'2.4']],xl:'odds ratio for a good outcome (1 = no difference)'});out+=pl.svg;
   out+=L(pl.X(1),56,pl.X(1),216,C.ink,1.6,'stroke-dasharray="4 4"')+TF(pl.X(1)+6,210,'1 = no benefit',13,C.muted,'start');
   B7_EMB.forEach((b,i)=>{const y=pl.Y(2.5-i),on=i===band,col=on?(b.lo>1?C.green:C.amber):C.line;
    out+=TF(140,y+5,b.lab,13,on?C.ink:C.muted,'end')+L(pl.X(b.lo),y,pl.X(b.hi),y,col,on?3.4:2.4)+Ci(pl.X(b.or),y,on?8:6,col,'#fff')+TF(pl.X(Math.max(b.or,1.32)),y-12,`${b.or.toFixed(2)} (range ${b.lo.toFixed(2)}–${b.hi.toFixed(2)})`,13,on?C.ink:C.muted)});
   out+=B7_tile(24,262,270,'Bleeding into the brain (NINDS)','6.4% drug · 0.6% placebo',C.coral)+B7_tile(306,262,270,'Pooled trials (Emberson 2014)','9 trials · 6,756 people',C.ink);
  }else{
   const pl=B7_plot(150,56,400,160,[0,60],[0,2],{xt:[[0,'0'],[20,'20%'],[40,'40%'],[60,'60%']],xl:'people independent at three months'});out+=pl.svg;
   [['clot removal',46.0,C.green],['usual care',26.5,C.muted]].forEach(([l,v,c],i)=>{const y=pl.Y(1.45-i*.9);out+=TF(140,y+5,l,13,C.ink,'end')+R(pl.X(0),y-13,pl.X(v)-pl.X(0),26,c,'none',4)+TBF(pl.X(v)+8,y+5,fmt(v)+'%',14,c,'start')});
   out+=B7_tile(24,262,270,'HERMES: five trials pooled','1,287 people, 2015 trials',C.ink)+B7_tile(306,262,270,'Later trials (2018)','some benefit 6–24 h, chosen by scan',C.blue);
  }
  out+=TF(300,328,'Who is treated, and how, is decided by the stroke team after a brain scan.',13,C.ink);
  out+=B7_banner(B7_EMERG,340);
  return {svg:out,phase:tpa?(band<2?`At ${fmt(s.h)} hours the pooled trials put the odds of recovering with little or no disability at about ${B.or} times those without the drug (range ${B.lo.toFixed(2)}–${B.hi.toFixed(2)}). The earlier the drug is given, the larger the benefit, which is why stroke services work to shorten every step.`:`Beyond 4.5 hours the pooled estimate, ${B.or.toFixed(2)} (range ${B.lo.toFixed(2)}–${B.hi.toFixed(2)}), has a range that crosses 1: no clear benefit, while the bleeding risk remains. This is why alteplase is given within a time window, unless scans show tissue still worth saving.`):
   'For a blockage in a large artery, removing the clot through a catheter roughly doubled the share of people who were independent three months later. In 2018 two trials (DAWN and DEFUSE 3) found benefit up to 16–24 hours after onset in people selected by brain scans showing tissue still worth saving.'};
 }});

/* ===================== Lesson: epilepsy ===================== */
const B7_EPI_NOTE='Not medical advice. For seizure first aid, see your national epilepsy organisation.';
// The motor strip from top (near the midline) to bottom, in the order of Penfield’s maps (simplified).
const B7_STRIP=['toes','foot','knee','hip','trunk','shoulder','elbow','wrist','hand','fingers','thumb','neck','face','lips','jaw','tongue'];
const B7_START={thumb:10,face:12,toes:0};
function B7_marchFrames(s){const i0=B7_START[s.start],fr=[];let lo=i0,hi=i0,k=0;
 fr.push({lo,hi,k,say:`The discharge starts in the ${B7_STRIP[i0]} area of the motor strip: the ${B7_STRIP[i0]} on the opposite side of the body begins to jerk, and the person may be fully aware.`});
 while((lo>0||hi<B7_STRIP.length-1)&&k<6){k++;lo=Math.max(0,lo-1);hi=Math.min(B7_STRIP.length-1,hi+1);
  fr.push({lo,hi,k,say:k===1?`It spreads to the neighbouring areas, ${B7_STRIP[lo]} and ${B7_STRIP[hi]}. The order of the march follows the order of the map, not the order of the body.`:`Now ${B7_STRIP.slice(lo,hi+1).length} areas are involved, from ${B7_STRIP[lo]} to ${B7_STRIP[hi]}. Jackson read the cortex’s layout from marches like this before anyone had mapped it directly.`})}
 fr.push({lo,hi,k,end:1,say:'Many focal seizures stop before reaching this far; some spread to both hemispheres and become generalised. What a seizure looks like depends on where it starts: many involve no jerking at all.'});
 return fr}
SCENE({id:'epilepsy',name:'A march along the cortex',tag:'Hughlings Jackson, from 1870',
 definition:'John Hughlings Jackson, a London neurologist, studied seizures that began in one hand, or one corner of the mouth, and spread in a fixed order. He reasoned that a seizure is an excessive discharge of grey matter that starts in one place and spreads to its neighbours, and that the order of the march shows how movements are laid out in the cortex. In 1873 he described epilepsy as “occasional, sudden, excessive, rapid and local discharges of grey matter”.',
 example:'Jackson noticed that such seizures most often began in the thumb and fingers, the corner of the mouth or the foot. In 1870 Fritsch and Hitzig showed that stimulating a dog’s cortex moves the opposite limbs, and Ferrier mapped it in monkeys, confirming his inference. A seizure that starts in one area is now called focal; one that involves both hemispheres from the start is generalised.',
 desc:'A side view of a hemisphere with the motor strip marked, and the strip unrolled into a column of body parts from toes to tongue. A seizure starts at one part and spreads step by step to its neighbours on the map.',
 research:['Jackson (1870). A study of convulsions. Transactions of the St Andrews Medical Graduates’ Association 3, 162–204.','Jackson (1873). On the anatomical, physiological, and pathological investigation of epilepsies. West Riding Lunatic Asylum Medical Reports 3 (the definition quoted).','Fritsch & Hitzig (1870). Über die elektrische Erregbarkeit des Grosshirns. Archiv für Anatomie, Physiologie und wissenschaftliche Medicin.'],
 dur:14,hint:'Choose where the seizure starts and step through its spread along the map. The order of the body parts is the order of the cortex. Not medical advice; for seizure first aid, see your national epilepsy organisation.',
 init:()=>({start:'thumb'}),
 trace:s=>B7_marchFrames(s),
 ui:[{choose:[['thumb','Starts in the thumb'],['face','Corner of the mouth'],['toes','The toes']],label:'Seizure starts in',get:s=>s.start,act:'start'}],
 on:{start(s,v){s.start=B7_START[v]!==undefined?v:'thumb'}},
 draw(s,f){
  const i0=B7_START[s.start],n=B7_STRIP.length,q=B7_bp(20,70,1.08,false);
  let out=heading(f.end?'The march has spread along the strip':f.k?`Spreading: step ${f.k}`:`It starts in the ${B7_STRIP[i0]} area`);
  out+=R(20,46,296,282,'#fff',C.grid,10)+TF(168,66,'left hemisphere: it moves the right side',13,C.muted);
  out+=B7_brain(20,82,1.08,false);
  // the strip along the front of the central sulcus, from top (toes) to bottom (tongue)
  const a=[121,12],b=[99,94],pt=t=>{const p=B7_bp(20,82,1.08,false)(lerp(a[0],b[0],t),lerp(a[1],b[1],t));return p};
  for(let i=0;i<n;i++){const p=pt((i+.5)/n),on=i>=f.lo&&i<=f.hi;out+=Ci(p[0]-5,p[1],5.2,i===i0?C.coral:on?'#e9967f':C.pale,on?C.coral:C.blue)}
  const top=pt(0),bot=pt(1);out+=L(top[0]+4,top[1],330,58,C.line,1.2,'stroke-dasharray="3 4"')+L(bot[0]+4,bot[1],330,58+n*17.5,C.line,1.2,'stroke-dasharray="3 4"');
  out+=TF(168,272,'motor strip (dots), just in front',13,C.blue)+TF(168,290,'of the central sulcus',13,C.blue);
  out+=TF(168,316,`${f.hi-f.lo+1} of ${n} areas involved`,13,C.coral);
  // the unrolled strip
  B7_STRIP.forEach((l,i)=>{const y=58+i*17.5,on=i>=f.lo&&i<=f.hi;out+=R(334,y,150,16,i===i0?C.coral:on?C.coralp:'#f4f7f9','none',4)+TF(342,y+12.5,l,13,i===i0?'#fff':on?C.coral:C.muted,'start')});
  out+=(i0>1?TF(494,72,'top of the',13,C.muted,'start')+TF(494,88,'strip',13,C.muted,'start'):'')+TF(494,310,'bottom',13,C.muted,'start')+TF(494,326,'(near the ear)',13,C.muted,'start');
  if(!f.end)out+=TBF(494,58+i0*17.5+12.5,'← start',13,C.coral,'start');
  out+=B7_note(B7_EPI_NOTE,356);
  return {svg:out,phase:f.say};
 }});

// A 10-second, four-channel record with an absence seizure from 3.5 s to 8 s: spike-and-wave at 3 per second.
const B7_SW={t0:3.5,t1:8,hz:3,T:10};
const B7_SW_SPIKES=range(40).map(k=>B7_SW.t0+k/B7_SW.hz).filter(t=>t<B7_SW.t1-1e-9);
function B7_eeg(t,ch){const r=B7_rng(Math.round(t*100)*7+ch*131),bg=(.25+.08*ch)*Math.sin(2*Math.PI*(9.5+ch*.4)*t+ch)+.18*B7_gauss(r);
 if(t<B7_SW.t0||t>=B7_SW.t1)return bg;const ph=((t-B7_SW.t0)*B7_SW.hz)%1,g=[1,.85,.95,.75][ch];
 let v=0;if(ph<.07)v=ph<.035?ph/.035*2.6:(.07-ph)/.035*2.6;else if(ph>.12&&ph<.95)v=-1.25*Math.sin(Math.PI*(ph-.12)/.83);
 return g*v+.25*bg}
const B7_CH=['F3','F4','P3','P4'];
SCENE({id:'epilepsy-eeg',name:'Three per second',tag:'Gibbs, Davis & Lennox, 1935',
 definition:'In 1935 Frederic Gibbs, Hallowell Davis and William Lennox at Harvard recorded the EEG during absence seizures, brief spells, mostly in children, in which a person stops, stares and is unaware for several seconds. Every channel showed the same regular pattern: a sharp spike followed by a slow wave, about three times a second, starting and stopping abruptly. A kind of seizure had its own electrical signature, and the EEG became central to diagnosing epilepsy.',
 example:'Count the spike-and-wave complexes in one second of the seizure and you get 3. Between seizures the record can look normal, which is one reason a normal EEG does not rule epilepsy out. The traces here are still lines; nothing on this page flashes.',
 desc:'A still, ten-second EEG record on four channels. Background activity is small and irregular; from 3.5 to 8 seconds every channel shows regular spike-and-wave complexes. A one-second window can be moved along the record to count them, and a bar below marks when the person stopped and stared.',
 research:['Gibbs, Davis & Lennox (1935). The electro-encephalogram in epilepsy and in conditions of impaired consciousness. Archives of Neurology and Psychiatry 34, 1133–1148.','Berger (1929). Über das Elektrenkephalogramm des Menschen. Archiv für Psychiatrie und Nervenkrankheiten 87, 527–570 (the first human EEG; see the lesson on brain imaging).','Simulated record: the timing follows the classic description; the shapes are simplified.'],
 dur:12,hint:'Slide the one-second window along the record and count the complexes inside it. Compare the background before and after. A simulated record; not medical advice.',
 init:()=>({w:4}),
 watch(p){return {w:Math.round(p*18)/2}},
 ui:[{range:'w',label:'Window starts at',min:0,max:9,step:.5,get:s=>s.w,act:'w',show:v=>fmt(+v)+' s'}],
 on:{w(s,v){s.w=clamp(Math.round(+v*2)/2,0,9)}},
 draw(s){
  const x0=58,w=520,TX=t=>x0+t/B7_SW.T*w,inSz=s.w+1>B7_SW.t0&&s.w<B7_SW.t1,cnt=B7_SW_SPIKES.filter(t=>t>=s.w&&t<s.w+1).length;
  let out=heading(cnt?`${cnt} spike-and-wave complex${cnt===1?'':'es'} in this second`:'Background: small, irregular activity');
  out+=R(TX(s.w),46,TX(s.w+1)-TX(s.w),232,C.amberp,C.amber,4);
  B7_CH.forEach((c,ch)=>{const yb=78+ch*52,pts=[];for(let i=0;i<=520;i++){const t=i/520*B7_SW.T;pts.push([TX(t),yb-B7_eeg(t,ch)*13])}
   out+=TF(x0-10,yb+5,c,13,C.muted,'end')+B7_poly(pts,C.ink,1.3)});
  for(const t of [0,2,4,6,8,10])out+=L(TX(t),278,TX(t),284,C.line,1.2)+TF(TX(t),298,t+(t===10?' s':''),13,C.muted);
  out+=R(TX(B7_SW.t0),306,TX(B7_SW.t1)-TX(B7_SW.t0),18,C.purplep,C.purple,4)+TF((TX(B7_SW.t0)+TX(B7_SW.t1))/2,320,'stops, stares, unaware',13,C.purple)+TF(x0-10,320,'person',13,C.muted,'end');
  out+=TF(300,346,`Seizure: ${B7_SW.t1-B7_SW.t0} s, ${B7_SW_SPIKES.length} complexes, one every ${fmt(B7_r2(1/B7_SW.hz))} s = ${B7_SW.hz} a second`,13,C.ink);
  out+=B7_note('Simulated, still record. Not medical advice.',368);
  return {svg:out,phase:!inSz?'Before and after the seizure the record shows small, irregular activity with no regular pattern. The person is going about their business.':
   cnt===3?'Three complexes in one second, on every channel at once: the pattern Gibbs, Davis and Lennox described. Both hemispheres are involved together, which is why absence seizures are classed as generalised.':
   `This window catches the ${s.w<B7_SW.t0?'start':'end'} of the seizure: ${cnt} complex${cnt===1?'':'es'} inside it. The pattern begins and ends abruptly, and the person usually resumes what they were doing without knowing anything happened.`};
 }});

// Kwan & Brodie (2000): 470 people followed from diagnosis. Seizure-free: 47% on the first medicine, 13% more on the
// second, and a few per cent more on later medicines or combinations (64% in all).
const B7_KB=[[0,'At diagnosis',0],[1,'First medicine',47],[2,'Second medicine',13],[3,'Later medicines',4]];
SCENE({id:'epilepsy-treatment',name:'Medicines, and surgery',tag:'Kwan & Brodie, 2000 · Wiebe et al., 2001',
 definition:'Most people with epilepsy become free of seizures with medicine, but not all. Patrick Kwan and Martin Brodie followed 470 people in Glasgow from their diagnosis: 47% became seizure-free on the first medicine and 13% more on the second, but only a few per cent more after that. About a third had seizures that medicines did not control. For some of them, surgery can remove the place where seizures begin. Wilder Penfield and Herbert Jasper developed the approach in Montreal from the 1930s, mapping the cortex with mild stimulation in patients who were awake before removing tissue.',
 example:'In 2001 Samuel Wiebe and colleagues randomly assigned 80 people with temporal-lobe epilepsy not controlled by medicine to surgery or to continued medicine. After a year, 58% of the surgery group were free of seizures that impair awareness, against 8% of the medicine group. Surgery suits only some people, and decisions rest with specialist teams.',
 desc:'A grid of 100 people with newly diagnosed epilepsy, filling in as each medicine is tried, after Kwan and Brodie; and bars comparing surgery with continued medicine after one year, after Wiebe and colleagues.',
 research:['Kwan & Brodie (2000). Early identification of refractory epilepsy. New England Journal of Medicine 342, 314–319.','Wiebe, Blume, Girvin & Eliasziw (2001). A randomized, controlled trial of surgery for temporal-lobe epilepsy. New England Journal of Medicine 345, 311–318.','Penfield & Jasper (1954). Epilepsy and the Functional Anatomy of the Human Brain. Little, Brown.'],
 dur:14,hint:'Step through the medicines and see who becomes seizure-free at each step, then switch to the surgery trial. Group results only: they say nothing about any one person. Not medical advice.',
 init:()=>({k:0,view:'med'}),
 watch(p){return p<.7?{k:Math.min(3,Math.floor(p/.7*4)),view:'med'}:{k:3,view:'surg'}},
 ui:[{choose:B7_KB.map(r=>[r[0],r[1]]),label:'Step',get:s=>s.k,act:'k'},{choose:[['med','Medicines'],['surg','Surgery trial']],label:'Show',get:s=>s.view,act:'view'}],
 on:{k(s,v){s.k=clamp(Math.round(+v),0,3);s.view='med'},view(s,v){s.view=v==='surg'?'surg':'med'}},
 draw(s,f,X){
  const cols=[null,C.green,'#4f9e8e',C.blue],cum=[0,47,60,64];
  let out='';
  if(s.view==='med'){
   const free=cum[s.k];
   out+=heading(s.k?`Seizure-free so far: ${free} in 100`:'100 people at diagnosis');
   out+=R(20,46,250,250,'#fff',C.grid,10)+B7_people(48,72,21.5,i=>{for(let j=1;j<=s.k;j++)if(i<cum[j])return cols[j];return s.k===3?C.amberp:'#e8eef2'},8);
   B7_KB.slice(1).forEach((r,j)=>{const y=70+j*54,on=s.k>j;out+=hit(X,'k',r[0],r[1],R(290,y-18,290,46,on?'#fff':'#f7f9fa',on?cols[j+1]:C.line,8)+R(300,y-6,14,14,on?cols[j+1]:'#e8eef2','none',3)+TBF(322,y+6,r[1],13,on?C.ink:C.muted,'start')+TBF(570,y+6,on?`+${r[2]}`:'?',14,on?cols[j+1]:C.muted,'end'))});
   out+=R(290,226,290,46,s.k===3?C.amberp:'#f7f9fa',s.k===3?C.amber:C.line,8)+TBF(300,254,'Not controlled by medicines',13,s.k===3?C.amber:C.muted,'start')+TBF(570,254,s.k===3?'36':'?',14,C.amber,'end');
   out+=TF(435,292,'Kwan & Brodie (2000), 470 people',13,C.muted);
  }else{
   out+=heading('Surgery or continued medicine: seizure-free at one year');
   const pl=B7_plot(170,70,380,150,[0,70],[0,2],{xt:[[0,'0'],[20,'20%'],[40,'40%'],[60,'60%']],xl:'free of seizures that impair awareness, after one year'});out+=pl.svg;
   [['surgery',58,C.green],['medicine',8,C.muted]].forEach(([l,v,c],i)=>{const y=pl.Y(1.45-i*.9);out+=TF(160,y+5,l,13,C.ink,'end')+R(pl.X(0),y-14,pl.X(v)-pl.X(0),28,c,'none',4)+TBF(pl.X(v)+8,y+5,v+'%',14,c,'start')});
   out+=B7_tile(60,262,230,'Trial (Wiebe et al. 2001)','80 people, 40 in each group',C.ink)+B7_tile(310,262,230,'Before surgery','the seizure focus is mapped',C.blue);
  }
  out+=TF(300,330,'Decisions about medicines or surgery rest with specialist teams.',13,C.ink);
  out+=B7_note(B7_EPI_NOTE,356);
  return {svg:out,phase:s.view==='surg'?'In this trial surgery removed part of one temporal lobe after careful tests had located where the seizures began. A year later 58% of the surgery group were free of seizures that impair awareness, against 8% who continued with medicine alone. Penfield and Jasper’s Montreal approach, mapping first and removing second, lies behind such operations.':
   s.k===0?'A hundred people at diagnosis, drawn after the proportions Kwan and Brodie found. Press the steps in order.':s.k===1?'The first medicine leaves 47 in 100 free of seizures.':s.k===2?'A second medicine adds 13 more, so 60 in 100 are seizure-free.':'Later medicines and combinations add only a few more: 64 in 100 in all. For the other 36 the seizures continue. Failing two well-chosen, well-tolerated medicines is now taken as the mark of drug-resistant epilepsy, and a reason for specialists to consider other options such as surgery.'};
 }});

// Relative sensitivity to flash rate in photosensitive epilepsy: a schematic curve peaking near 15–25 a second.
const B7_sens=f=>f<3?0:Math.exp(-Math.pow(Math.log(f/18),2)/(2*.45*.45));
SCENE({id:'epilepsy-photosensitive',name:'Light-sensitive seizures, without light',tag:'Why this course never flashes',
 definition:'In photosensitive epilepsy, seizures can be set off by flashing light or by some high-contrast patterns such as stripes. It affects a small minority, a few per cent of people with epilepsy, and is commonest in children and teenagers. Sensitivity is greatest for flashes at roughly 15 to 25 a second, and large, bright and saturated red flashes are the most provoking.',
 example:'Broadcast and web guidelines therefore limit flashing. The Web Content Accessibility Guidelines allow no more than three flashes in any one second (success criterion 2.3.1), and they also limit how much of the screen a flash may cover. This course draws spikes, rhythms and light pulses as marks on a time axis, and nothing on the page flashes.',
 desc:'A still chart of relative sensitivity against flash rate, with the 3-per-second guideline marked; a slider moves a marker along it, and one second of a flashing stimulus is drawn as still tick marks, one per flash, never as light.',
 research:['Harding & Jeavons (1994). Photosensitive Epilepsy. Mac Keith Press.','Fisher, Harding, Erba, Barkley & Wilkins (2005). Photic- and pattern-induced seizures: a review for the Epilepsy Foundation of America Working Group. Epilepsia 46, 1426–1441.','W3C (2008). Web Content Accessibility Guidelines 2.0, success criterion 2.3.1: Three Flashes or Below Threshold.'],
 dur:12,hint:'Move the flash rate and read the chart. Each flash is drawn as a still tick mark, never as light. The curve’s shape is schematic. Not medical advice.',
 init:()=>({r:18}),
 watch(p){return {r:Math.round(lerp(1,50,smooth(p)))}},
 ui:[{range:'r',label:'Flashes per second',min:1,max:60,get:s=>s.r,act:'r'}],
 on:{r(s,v){s.r=clamp(Math.round(+v),1,60)}},
 draw(s){
  const ok=s.r<=3,v=B7_sens(s.r);
  let out=heading(ok?`${s.r} a second: within the guideline`:`${s.r} a second: above the 3-per-second limit`);
  const pl=B7_plot(70,62,500,170,[0,60],[0,1.1],{xt:[[0,'0'],[3,'3'],[10,'10'],[20,'20'],[30,'30'],[40,'40'],[50,'50'],[60,'60']],xl:'flashes per second',yl:'how provoking, relative (schematic)'});
  out+=R(pl.X(0),62,pl.X(3)-pl.X(0),170,C.greenp,'none',0)+pl.svg.replace(/fill="#fff"/,'fill="none"');
  out+=R(pl.X(15),62,pl.X(25)-pl.X(15),170,C.coralp,'none',0,'fill-opacity=".6"')+TF(pl.X(20),196,'most provoking',13,C.coral)+TF(pl.X(20),212,'about 15–25',13,C.coral);
  const pts=[];for(let i=0;i<=300;i++){const f=i/5;pts.push([pl.X(f),pl.Y(B7_sens(f))])}out+=B7_poly(pts,C.coral,2.4);
  out+=L(pl.X(s.r),62,pl.X(s.r),232,C.ink,1.4,'stroke-dasharray="3 3"')+Ci(pl.X(s.r),pl.Y(v),6,ok?C.green:C.coral,'#fff');
  out+=R(70,257,12,12,C.greenp,C.green,2)+TF(88,268,'guideline: up to 3',13,C.green,'start');
  // one second of flashes as still ticks
  const x0=70,w=500;out+=TF(x0,290,'one second of this stimulus, drawn as still marks:',13,C.muted,'start')+L(x0,314,x0+w,314,C.line,1.4);
  for(let i=0;i<s.r;i++){const x=x0+(i+.5)/s.r*w;out+=L(x,302,x,326,ok?C.green:C.ink,1.6)}
  out+=TF(x0,342,'0 s',13,C.muted,'start')+TF(x0+w,342,'1 s',13,C.muted,'end');
  out+=B7_note('Nothing on this page flashes. Shape of the curve schematic. Not medical advice.',368);
  return {svg:out,phase:ok?`At ${s.r} flash${s.r===1?'':'es'} a second the stimulus is within the guideline. Spikes and rhythms in this course are drawn this way, as marks on a time axis, so the screen itself never flickers.`:
   v>.6?`At ${s.r} a second the rate lies in the most provoking range for people with photosensitive epilepsy. That is why broadcasters test programmes for flashing, and why web guidelines set the limit at three flashes in any one second.`:
   `At ${s.r} a second the rate is above the guideline. Sensitivity is lower here than near 15–25 a second, but not zero, so guidelines draw one simple line at 3.`};
 }});

/* ===================== Lesson: parkinsons ===================== */
const B7_PD_NOTE='Schematic, not a prognosis: the course differs widely between people. Not medical advice.';
// Striatal dopamine on a schematic time axis: falls by a constant fraction per step, crossing 20% (80% lost) at t = 60.
const B7_PDK=Math.log(5)/60,B7_pdDa=t=>100*Math.exp(-B7_PDK*t);
const B7_PD_EARLY=[[18,'loss of smell'],[30,'constipation'],[44,'acting out dreams']];
const B7_PD_HIST=[['1817','Parkinson’s essay'],['1870s','Charcot names it'],['1912','Lewy’s inclusions'],['1919','nigra cells lost'],['1960','dopamine low']];
SCENE({id:'parkinsons',name:'An essay on the shaking palsy',tag:'James Parkinson, 1817',
 definition:'In 1817 the London surgeon James Parkinson described six people with a slowly progressing illness: a tremor at rest, a stooped posture and a shuffling walk that could break into small hurried steps. He had examined some of them and only watched others in the street. Jean-Martin Charcot later named the disease after him and stressed stiffness and slowness. In 1919 Konstantin Trétiakoff found that the substantia nigra, a dark-pigmented nucleus in the midbrain, had lost many of its cells.',
 example:'Those cells supply dopamine to the striatum. Movement symptoms appear only after much of it is gone: in the classic measurements of Bernheimer and colleagues (1973), striatal dopamine was down by roughly 80% when symptoms began. Other changes, such as loss of smell, constipation and acting out dreams in sleep, often come years earlier. Parkinson thought the intellect was spared; problems with thinking and mood are now known to be part of the disease for many people.',
 desc:'A slice of the midbrain whose dark-pigmented substantia nigra loses cells as time passes, a schematic curve of dopamine left in the striatum with the point at which movement symptoms usually appear, earlier non-movement symptoms marked before it, and a timeline from 1817 to 1960.',
 research:['Parkinson (1817). An Essay on the Shaking Palsy. Sherwood, Neely and Jones, London.','Trétiakoff (1919). Contribution à l’étude de l’anatomie pathologique du locus niger de Soemmering. Thesis, Paris.','Bernheimer, Birkmayer, Hornykiewicz, Jellinger & Seitelberger (1973). Brain dopamine and the syndromes of Parkinson and Huntington. Journal of the Neurological Sciences 20, 415–455.'],
 dur:12,hint:'Move along the schematic time axis and watch the nigra and the dopamine curve. The axis has no years on purpose: the pace differs widely between people. Not medical advice.',
 init:()=>({t:40}),
 watch(p){return {t:Math.round(100*p)}},
 ui:[{range:'t',label:'Time (schematic)',min:0,max:100,get:s=>s.t,act:'t'}],
 on:{t(s,v){s.t=clamp(Math.round(+v),0,100)}},
 draw(s){
  const da=B7_pdDa(s.t),motor=da<=20+1e-9,cells=Math.exp(-B7_PDK*.6*s.t);
  let out=heading(motor?'Movement symptoms: most striatal dopamine is gone':'No movement symptoms yet, though cells are being lost');
  // midbrain slice
  out+=R(20,46,236,226,'#fff',C.grid,10)+TF(138,66,'midbrain, cut across',13,C.muted);
  out+=P('M60 124 C60 80 216 80 216 124 C216 180 192 226 162 226 C150 226 146 216 138 216 C130 216 126 226 114 226 C84 226 60 180 60 124 Z','#a99a8c',2.2,'#f3eee9');
  out+=Ci(138,108,7,'#fff','#a99a8c');
  const r=B7_rng(17);for(const sg of [-1,1])for(let i=0;i<30;i++){const u=i/29,x=138+sg*(16+52*u)+5*(r()-.5),y=196-50*u-10*Math.sin(Math.PI*u)+5*(r()-.5),alive=r()<cells;out+=Ci(x,y,3.4,alive?'#3d2b23':'#e3d7cc')}
  out+=TF(138,246,'substantia nigra: dark cells',13,C.ink)+TF(138,262,'pale dots: cells lost',13,C.muted);
  // dopamine curve
  const pl=B7_plot(300,64,276,150,[0,100],[0,100],{yt:[[0,'0'],[20,'20'],[50,'50'],[100,'100%']],xl:'time (schematic, no years)',yl:'dopamine left in the striatum'});out+=pl.svg;
  out+=R(pl.X(0),pl.Y(20),276,pl.Y(0)-pl.Y(20),C.coralp,'none',0,'fill-opacity=".7"')+TF(pl.X(2),pl.Y(6),'movement symptoms below 20%',13,C.coral,'start');
  const pts=[];for(let i=0;i<=100;i++)pts.push([pl.X(i),pl.Y(B7_pdDa(i))]);out+=B7_poly(pts,C.blue,2.4);
  B7_PD_EARLY.forEach(([t,l],i)=>{const on=s.t>=t;out+=Ci(pl.X(t),pl.Y(B7_pdDa(t)),4,on?C.purple:'#fff',C.purple)});
  out+=L(pl.X(s.t),64,pl.X(s.t),214,C.ink,1.3,'stroke-dasharray="3 3"')+Ci(pl.X(s.t),pl.Y(da),6,motor?C.coral:C.blue,'#fff');
  const seen=B7_PD_EARLY.filter(e=>s.t>=e[0]).map(e=>e[1]);
  out+=B7_wrap(300,266,seen.length?'earlier signs (purple dots): '+seen.join(', '):'earlier signs (purple dots) come later',42,13,C.purple);
  // history
  out+=L(40,310,560,310,C.line,2);B7_PD_HIST.forEach(([y,l],i)=>{const x=70+i*115;out+=Ci(x,310,5,C.blue)+TBF(x,330,y,13,C.ink)+TF(x,346,l,13,C.muted)});
  out+=B7_note(B7_PD_NOTE,368);
  return {svg:out,phase:motor?`About ${Math.round(da)}% of the striatum’s dopamine is left. Below roughly 20% the basal ganglia can no longer compensate, and slowness, stiffness and often a tremor at rest appear. Parkinson described exactly these signs, without knowing their cause.`:
   `About ${Math.round(da)}% of the striatum’s dopamine is left and movement still seems normal, because the remaining cells and their targets compensate. ${seen.length?'Changes outside movement, such as '+seen.join(', ')+', can already be present.':'Nothing is noticeable yet.'}`};
 }});

// Braak et al. (2003): Lewy pathology in six stages. Positions on the sketch are approximate.
const B7_BRAAK=[
 {st:1,short:'brainstem, olfactory bulb',where:'lower brainstem, olfactory bulb',sym:'smell loss, constipation',shapes:[[222,282,11,17],[74,206,16,7]]},
 {st:2,short:'pons',where:'pons (locus coeruleus, raphe)',sym:'sleep changes, mood',shapes:[[214,246,14,15]]},
 {st:3,short:'midbrain, substantia nigra',where:'midbrain: substantia nigra',sym:'movement symptoms begin',shapes:[[204,214,13,11],[150,198,10,8]]},
 {st:4,short:'temporal cortex, forebrain',where:'temporal cortex, deep forebrain',sym:'movement symptoms',shapes:[[146,180,30,11],[190,168,16,12]]},
 {st:5,short:'association cortex',where:'association cortex',sym:'thinking may be affected',path:'M70 150 C60 110 90 70 140 62 M230 60 C280 64 312 104 310 150'},
 {st:6,short:'primary cortex',where:'primary cortex',sym:'thinking may be affected',path:'M146 60 C170 54 200 54 224 58'}];
SCENE({id:'parkinsons-synuclein',name:'Lewy bodies and α-synuclein',tag:'Lewy, 1912 · two discoveries, 1997 · Braak, 2003',
 definition:'In 1912 Friedrich Lewy described round clumps of protein inside neurons of people who had died with Parkinson’s disease; Trétiakoff named them Lewy bodies. What they were made of stayed unknown until 1997, when Mihael Polymeropoulos and colleagues found a mutation in the gene for the protein α-synuclein in families with inherited Parkinson’s disease, and Maria Grazia Spillantini and colleagues showed that Lewy bodies are full of α-synuclein.',
 example:'In 2003 Heiko Braak and colleagues proposed that Lewy pathology spreads in six stages, starting low in the brainstem and in the olfactory bulb, reaching the substantia nigra in stage 3 and the cortex last. That would fit the loss of smell, constipation and sleep changes that often come years before the movement symptoms. The staging is influential but debated: many brains do not follow it, and how the clumps relate to the loss of cells is not settled.',
 desc:'A side view of the brain cut down the middle, with the regions Braak’s stages add one by one, from the lower brainstem and olfactory bulb to the cortex, beside a list of the stages and the symptoms often linked with them.',
 research:['Lewy (1912). Paralysis agitans. In Lewandowsky (ed.), Handbuch der Neurologie, vol. 3. Springer.','Polymeropoulos et al. (1997). Mutation in the α-synuclein gene identified in families with Parkinson’s disease. Science 276, 2045–2047. · Spillantini et al. (1997). α-Synuclein in Lewy bodies. Nature 388, 839–840.','Braak et al. (2003). Staging of brain pathology related to sporadic Parkinson’s disease. Neurobiology of Aging 24, 197–211. (Debated: many cases do not fit the sequence.)'],
 dur:14,hint:'Move through the six stages and watch where the pathology is proposed to reach. This is a hypothesis about groups of brains, not a timetable for any person. For smell loss as an early sign, see Senses In Motion.',
 init:()=>({st:3}),
 watch(p){return {st:Math.min(6,1+Math.floor(p*6))}},
 ui:[{range:'st',label:'Braak stage',min:1,max:6,get:s=>s.st,act:'st'}],
 on:{st(s,v){s.st=clamp(Math.round(+v),1,6)}},
 draw(s,f,X){
  const B=B7_BRAAK[s.st-1];
  let out=heading(`Stage ${s.st}: ${B.where}`);
  out+=R(20,46,326,280,'#fff',C.grid,10)+TF(183,66,'cut down the middle; front at left',13,C.muted);
  let br='';br+=P('M60 190 C40 120 90 60 180 56 C270 52 322 100 316 160 C312 192 290 200 262 198 L222 196 C200 200 160 204 120 206 C90 208 66 204 60 190 Z','#a99a8c',2.2,'#f3eee9');
  br+=`<ellipse cx="270" cy="230" rx="38" ry="24" fill="#f3eee9" stroke="#a99a8c" stroke-width="2"/>`+P('M196 200 C204 240 214 270 220 306 L236 306 C232 270 228 236 226 198','#a99a8c',2,'#f3eee9');
  br+=`<ellipse cx="74" cy="206" rx="18" ry="7" fill="#f3eee9" stroke="#a99a8c" stroke-width="1.6"/>`;
  B7_BRAAK.forEach((b,i)=>{if(b.st>s.st)return;const col=b.st===s.st?C.coral:'#d98b74';
   if(b.shapes)b.shapes.forEach(([x,y,rx,ry])=>{br+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${col}" fill-opacity=".75"/>`});
   if(b.path)br+=P(b.path,col,9,'none','stroke-opacity=".7"')});
  out+=G(br,'transform="translate(16,16) scale(.9)"');
  const tq=(x,y)=>[16+.9*x,16+.9*y];
  out+=TF(tq(74,226)[0],tq(74,226)[1]+4,'olfactory bulb',13,C.muted)+TF(tq(238,300)[0],tq(238,300)[1],'brainstem',13,C.muted,'start')+TF(tq(270,234)[0],tq(270,234)[1],'cerebellum',13,C.muted);
  out+=TF(183,316,'After Braak et al. (2003); positions approximate.',13,C.muted);
  B7_BRAAK.forEach((b,i)=>{const y=52+i*45,on=b.st===s.st,done=b.st<=s.st;out+=hit(X,'st',b.st,`Stage ${b.st}: ${b.where}`,R(358,y,222,40,on?C.coralp:'#fff',on?C.coral:C.line,8)+TBF(368,y+17,`${b.st}`,14,done?C.coral:C.muted,'start')+TF(386,y+17,b.short,13,done?C.ink:C.muted,'start')+TF(386,y+34,b.sym,13,done?C.purple:C.muted,'start'))});
  out+=B7_note('A debated hypothesis about groups of brains, not a timetable for any person.',356);
  return {svg:out,phase:s.st<=2?`Stage ${s.st}: in Braak’s scheme the clumps of α-synuclein are found ${s.st===1?'in the lower brainstem and the olfactory bulb':'also in the pons, including the locus coeruleus and raphe nuclei'}, before the substantia nigra is involved. Loss of smell, constipation and sleep changes can appear at this point, years before any trouble with movement.`:
   s.st<=4?`Stage ${s.st}: the pathology has reached the midbrain${s.st===4?' and parts of the temporal cortex':''}. Nigral cells are being lost, and once enough are gone the movement symptoms appear.`:
   `Stage ${s.st}: in the last stages the pathology reaches the ${s.st===5?'association areas of the':'primary areas of the'} cortex, and problems with thinking become more likely. Many brains do not follow this order, which is why the scheme is debated.`};
 }});

// The basal-ganglia rate model of the movement era (Albin, Young & Penney 1989; DeLong 1990), on a 0–1 scale,
// with stimulation of the subthalamic nucleus modelled simply as reducing its output.
function B7_bg(da,stn=1){const c=.6,q=v=>clamp(v,0,1),D1=q(c*(.4+1.2*da)),D2=q(c*(1.6-1.2*da)),GPe=q(1-.8*D2),STN=q((1-.7*GPe)*stn),GPi=q(.5+.8*STN-.9*D1),Th=q(1-GPi);return {D1,D2,GPe,STN,GPi,Th}}
const B7_COND={healthy:['Healthy',.5,1],pd:['Parkinson’s, untreated',.1,1],ldopa:['With L-DOPA',.45,1],dbs:['With stimulation',.1,.45]};
// Schematic brain dopamine across a day after repeated doses: early disease buffers it, later it swings.
function B7_ldopa(t,later){let v=later?.05:.35;for(const d of [0,4,8,12]){const x=t-d;if(x>0){const tau=later?.9:3;v+=(later?.95:.22)*(x/tau)*Math.exp(1-x/tau)}}return v}
SCENE({id:'parkinsons-loop',name:'The loop with and without dopamine',tag:'Medicine and stimulation, compared in a model',
 definition:'The basal-ganglia model from the movement era makes a prediction: with too little dopamine, the indirect pathway becomes overactive, the subthalamic nucleus drives the output nuclei too hard and the thalamus is held down, so movement is slow and hard to start. Two treatments act at different points in the loop. L-DOPA replaces dopamine. Deep brain stimulation of the subthalamic nucleus, in the model, quietens its excessive drive; how stimulation really works is still debated.',
 example:'Both ease movement symptoms for many people, and neither stops the loss of nigral cells. In the first years L-DOPA’s effect is usually smooth. Later it often becomes shorter and less even: good periods alternate with poor ones, and peaks can bring involuntary movements called dyskinesias. In monkeys made parkinsonian with the toxin MPTP, a lesion of the subthalamic nucleus reversed the symptoms (Bergman and colleagues, 1990), which pointed to it as a target.',
 desc:'A circuit diagram of cortex, the two striatal pathways, outer pallidus, subthalamic nucleus, output nuclei and thalamus, with a level in each box for four conditions: healthy, untreated, with L-DOPA and with stimulation. A side panel shows how much movement is released, and for L-DOPA, a schematic day of brain dopamine in early and in later disease.',
 research:['Albin, Young & Penney (1989). Trends in Neurosciences 12, 366–375. · DeLong (1990). Trends in Neurosciences 13, 281–285 (the model; a simplification).','Bergman, Wichmann & DeLong (1990). Reversal of experimental parkinsonism by lesions of the subthalamic nucleus. Science 249, 1436–1438.','Marsden & Parkes (1976). “On-off” effects in patients with Parkinson’s disease on chronic levodopa therapy. Lancet 1, 292–296.'],
 dur:16,hint:'Compare the four conditions box by box, then look at L-DOPA early and later in the disease. Levels are a model on a 0 to 100 scale, not measurements; the day plot is schematic and is not a dosing guide. Not medical advice.',
 init:()=>({c:'pd',later:0}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {c:['healthy','pd','ldopa','ldopa','dbs'][k],later:k===3?1:0}},
 ui:[{choose:Object.keys(B7_COND).map(k=>[k,B7_COND[k][0]]),label:'Condition',get:s=>s.c,act:'c'},{choose:[[0,'Early years'],[1,'Later years']],label:'L-DOPA day',get:s=>s.later,act:'later'}],
 on:{c(s,v){s.c=B7_COND[v]?v:'pd'},later(s,v){s.later=+v?1:0;s.c='ldopa'}},
 draw(s){
  const cd=B7_COND[s.c],m=B7_bg(cd[1],cd[2]),mv=Math.round(m.Th*100),ref=Math.round(B7_bg(.5,1).Th*100);
  let out=heading(`${cd[0]}: movement released ${mv} (healthy ${ref})`);
  const node=(cx,y,label,v,col,w=130)=>R(cx-w/2,y,w,32,'#fff',col,8)+R(cx-w/2+4,y+24,(w-8)*v,5,col,'none',2)+TBF(cx-w/2+8,y+17,label,13,C.ink,'start')+TBF(cx+w/2-8,y+17,Math.round(v*100),13,col,'end');
  out+=arrow(150,80,110,98,C.green,2)+arrow(218,80,262,98,C.green,2);
  out+=B7_inh(96,134,96,212,C.coral,2.2)+TF(88,176,'direct',13,C.blue,'end');
  out+=B7_inh(272,134,272,154,C.coral,2.2)+B7_inh(272,190,272,206,C.coral,2.2)+arrow(206,228,162,228,C.green,2.2)+TF(272,262,'indirect',13,C.purple);
  out+=B7_inh(96,248,96,272,C.coral,2.2)+P('M31 292 L22 292 L22 64 L118 64',C.green,2);
  out+=node(184,48,'Cortex',.6,C.green,130)+node(96,100,'Striatum D1',m.D1,C.blue,130)+node(272,100,'Striatum D2',m.D2,C.purple,130)+node(272,158,'Outer pallidus',m.GPe,C.purple,130)+node(272,210,'Subthalamic',m.STN,C.purple,130)+node(96,212,'Output nuclei',m.GPi,C.coral,130)+node(96,276,'Thalamus',m.Th,C.green,130);
  out+=R(176,276,160,44,C.amberp,C.amber,8)+TBF(256,294,`dopamine ${Math.round(cd[1]*200)}%`,13,C.amber)+TF(256,312,'raises D1, lowers D2',13,C.amber);
  if(s.c==='dbs')out+=L(352,150,340,212,C.ink,3)+Ci(339,218,5,C.amber,C.ink)+TF(352,142,'electrode',13,C.ink);
  // side panel
  out+=R(382,46,198,108,'#fff',C.grid,10)+TBF(392,66,'Movement released',13,C.ink,'start')+R(392,76,178,14,'#eef3f6','none',6)+R(392,76,178*m.Th,14,mv<30?C.amber:C.green,'none',6)+L(392+178*ref/100,72,392+178*ref/100,94,C.ink,2);
  out+=TF(392,110,'tick: healthy level',13,C.muted,'start')+TF(392,128,mv<30?'too little: slow, stiff':'close to healthy',13,mv<30?C.amber:C.green,'start')+TF(392,146,'model levels, 0–100',13,C.muted,'start');
  if(s.c==='ldopa'){const pl=B7_plot(392,190,184,96,[0,16],[0,1.4],{xt:[[0,'0'],[8,'8'],[16,'16 h']]});out+=pl.svg;
   const lo=s.later?.4:.3,hi=s.later?.75:.95;out+=R(392,pl.Y(hi),184,pl.Y(lo)-pl.Y(hi),C.greenp,'none',0,'fill-opacity=".8"');
   const pts=[];for(let i=0;i<=160;i++){const t=i/10;pts.push([pl.X(t),pl.Y(Math.min(1.38,B7_ldopa(t,s.later)))])}out+=B7_poly(pts,C.amber,2.2);
   for(const d of [0,4,8,12])out+=L(pl.X(d),286,pl.X(d),280,C.ink,2);
   out+=TF(392,176,s.later?'later: swings out of the band':'early: steady, inside the band',13,s.later?C.coral:C.green,'start')+TF(382,318,'green band: good movement',13,C.muted,'start')+TF(382,334,'above: dyskinesia · below: “off”',13,C.muted,'start')}
  else out+=TF(392,190,s.c==='dbs'?'The electrode sits in the':'Choose “With L-DOPA” to',13,C.muted,'start')+TF(392,208,s.c==='dbs'?'subthalamic nucleus.':'see a schematic day.',13,C.muted,'start');
  out+=B7_note('A model and a simplification. Eases symptoms; does not stop the disease. Not medical advice.',360);
  const ph={healthy:`With normal dopamine the direct pathway (D1, ${Math.round(m.D1*100)}) and the indirect pathway (D2, ${Math.round(m.D2*100)}) balance, the output nuclei sit at ${Math.round(m.GPi*100)} and the thalamus passes ${mv}.`,
   pd:`With dopamine low, D2 cells are overactive (${Math.round(m.D2*100)}), the outer pallidus is suppressed, the subthalamic nucleus rises to ${Math.round(m.STN*100)} and the output nuclei climb to ${Math.round(m.GPi*100)}. The thalamus passes only ${mv}: slow, scarce movement.`,
   ldopa:s.later?'Years on, fewer nerve endings are left to store dopamine made from L-DOPA, so brain levels follow each dose more closely. Movement swings between “off” periods and peaks with involuntary movements, and the good band narrows. This is schematic, not a guide to doses.':`L-DOPA is turned into dopamine, the balance is largely restored and the thalamus passes ${mv}. In the early years the remaining nerve endings store dopamine and smooth out the supply, as the day plot sketches.`,
   dbs:`Dopamine is still low, but stimulation of the subthalamic nucleus reduces its drive (${Math.round(m.STN*100)} in the model), the output nuclei fall to ${Math.round(m.GPi*100)} and the thalamus passes ${mv}. Whether stimulation silences, excites or scrambles the nucleus’s signals is still debated; the model shows only the net effect.`}[s.c];
  return {svg:out,phase:ph};
 }});

// Tremor at rest (about 5 a second) against stimulation rate: a schematic curve, with suppression above about 100 a second.
const B7_dbsEff=f=>f<=0?0:1/(1+Math.exp(-(f-90)/12));
SCENE({id:'parkinsons-dbs',name:'Deep brain stimulation',tag:'Benabid and colleagues, Grenoble, from 1987',
 definition:'In 1987 Alim-Louis Benabid and colleagues in Grenoble were testing a target in the thalamus during surgery, before making a small lesion to stop tremor. They found that stimulating it at high frequency, above about 100 pulses a second, stopped the tremor, and that the effect ended when the current was switched off. They left electrodes in place instead of making lesions. In the 1990s the subthalamic nucleus became the main target in Parkinson’s disease, easing slowness and stiffness as well as tremor.',
 example:'A randomised trial of 156 people with advanced Parkinson’s disease (Deuschl and colleagues, 2006) found that stimulation plus medicine improved quality of life and movement more than medicine alone over six months. It requires brain surgery, with its own risks, it suits only some people, and, like L-DOPA, it eases symptoms without stopping the disease.',
 desc:'A slice through the brain with an electrode reaching the subthalamic nucleus, its pulses drawn as tick marks on a time axis, a still trace of tremor at rest, and a schematic curve of tremor size against the rate of stimulation.',
 research:['Benabid, Pollak, Louveau, Henry & de Rougemont (1987). Combined (thalamotomy and stimulation) stereotactic surgery of the VIM thalamic nucleus for bilateral Parkinson disease. Applied Neurophysiology 50, 344–346.','Limousin et al. (1995). Effect on parkinsonian signs and symptoms of bilateral subthalamic nucleus stimulation. Lancet 345, 91–95.','Deuschl et al. (2006). A randomized trial of deep-brain stimulation for Parkinson’s disease. New England Journal of Medicine 355, 896–908.'],
 dur:12,hint:'Raise the stimulation rate from off to high and watch the tremor trace. The curve’s shape is schematic; the finding that only high rates suppress tremor is Benabid’s. Not medical advice.',
 init:()=>({f:0}),
 watch(p){return {f:Math.round(lerp(0,180,smooth(p))/10)*10}},
 ui:[{range:'f',label:'Stimulation (pulses a second)',min:0,max:200,step:10,get:s=>s.f,act:'f',show:v=>+v?v:'off'}],
 on:{f(s,v){s.f=clamp(Math.round(+v/10)*10,0,200)}},
 draw(s){
  const e=B7_dbsEff(s.f),amp=1-e;
  let out=heading(!s.f?'Stimulator off: tremor at rest':e>.9?`${s.f} a second: the tremor stops`:e<.2?`${s.f} a second: too slow to help`:`${s.f} a second: partly suppressed`);
  // coronal sketch
  out+=R(20,46,230,226,'#fff',C.grid,10)+TF(135,66,'slice seen from the front',13,C.muted);
  out+=P('M40 190 C30 120 70 76 135 74 C200 76 240 120 230 190 C220 236 180 256 135 256 C90 256 50 236 40 190 Z','#a99a8c',2.2,'#f3eee9');
  out+=`<ellipse cx="112" cy="172" rx="22" ry="16" fill="#e4dcd2"/><ellipse cx="158" cy="172" rx="22" ry="16" fill="#e4dcd2"/>`+TF(135,152,'thalamus',13,C.muted);
  out+=`<ellipse cx="168" cy="204" rx="11" ry="6" fill="${C.purplep}" stroke="${C.purple}" stroke-width="1.6"/>`+TF(150,226,'subthalamic',13,C.purple,'end')+TF(150,242,'nucleus',13,C.purple,'end');
  out+=L(200,78,168,200,C.ink,3)+Ci(168,203,4,s.f?C.amber:C.ink);
  // pulses
  out+=TF(270,64,'pulses in 50 ms (marks, not light)',13,C.muted,'start')+L(270,90,576,90,C.line,1.2);
  const n=Math.round(s.f*.05);for(let i=0;i<n;i++){const x=270+(i+.5)/Math.max(n,1)*306;out+=L(x,78,x,102,C.amber,2)}
  if(!n)out+=TF(423,95,'off',13,C.muted);
  // tremor trace: 2 s at 5 a second
  out+=TF(270,128,'hand tremor over 2 s (relative size)',13,C.muted,'start');
  const pts=[];for(let i=0;i<=300;i++){const t=i/300*2;pts.push([270+i*306/300,170-26*amp*Math.sin(2*Math.PI*5*t)])}out+=B7_poly(pts,C.coral,2);
  // curve
  const pl=B7_plot(300,224,276,80,[0,200],[0,1.05],{xt:[[0,'off'],[50,'50'],[100,'100'],[150,'150'],[200,'200']],xl:'pulses a second',yl:'tremor size'});out+=pl.svg;
  const cp=[];for(let i=1;i<=200;i++)cp.push([pl.X(i),pl.Y(1-B7_dbsEff(i))]);out+=B7_poly([[pl.X(0),pl.Y(1)]].concat(cp),C.coral,2)+Ci(pl.X(s.f),pl.Y(amp),5.5,C.coral,'#fff');
  out+=B7_tile(24,284,226,'Tremor suppressed',Math.round(e*100)+'%',e>.9?C.green:C.coral);
  out+=B7_note('Schematic curve. Surgery suits only some people. Not medical advice.',368);
  return {svg:out,phase:!s.f?'With the stimulator off the hand trembles at about five beats a second, the classic tremor at rest. Click the rate up.':
   e<.2?`At ${s.f} pulses a second the tremor is barely changed. Benabid’s group found that only high rates worked, which ruled out the simplest idea that stimulation just adds activity.`:
   e<.9?`At ${s.f} a second the tremor is partly suppressed. The effect rises steeply around 100 a second in this schematic curve.`:
   `At ${s.f} a second the tremor stops, and it returns within seconds if the stimulator is switched off. High-frequency stimulation acts much like a reversible lesion, though how it does so is still debated.`};
 }});

/* ===================== Lesson: alzheimers ===================== */
// A schematic microscope field: neurons (some holding a tangle) and plaques between them.
const B7_FIELD={c:[150,172],r:102,
 plaques:[[111,123],[199,203],[144,228],[206,115]],
 neurons:[[89,181,1],[133,165,0],[174,151,1],[182,244,0],[221,165,1],[103,225,1],[160,101,0]]};
const B7_STAINS={silver:'Silver stain (Alzheimer’s method)',abeta:'Label for amyloid-β',tau:'Label for tau'};
const B7_AD_HIST=[['1901','admitted, aged 51'],['1906','she dies; lecture'],['1907','paper published'],['1910','Kraepelin names it'],['1995','records found']];
function B7_adPick(s,i){s.sel=i;s.found[i]=1}
SCENE({id:'alzheimers',name:'Auguste Deter’s brain',tag:'Alois Alzheimer, 1906',
 definition:'In 1901 Auguste Deter, aged 51, was admitted to the asylum in Frankfurt with failing memory, confusion and distress. Asked to write her name, she said: “I have, so to speak, lost myself.” The psychiatrist Alois Alzheimer followed her case. After her death in 1906 he examined her brain with a silver stain and described two abnormalities: clumps of material between the cells, now called plaques, and dense bundles of fibres inside many neurons, now called tangles. Emil Kraepelin named the disease after him in 1910.',
 example:'Decades later the materials were identified. Plaques are built mainly of a protein fragment, amyloid-β (Glenner and Wong, 1984; Masters and colleagues, 1985), and tangles of the protein tau (1986). Alzheimer’s disease is now the commonest cause of dementia, which is a decline in memory and thinking severe enough to affect daily life. Her case records, lost for decades, were found again in Frankfurt in 1995.',
 desc:'A round microscope field of brain tissue holding neurons and plaques. The stain can be switched between Alzheimer’s silver stain, a label for amyloid-β and a label for tau, and each structure can be pressed to identify it. A timeline runs from 1901 to 1995.',
 research:['Alzheimer (1907). Über eine eigenartige Erkrankung der Hirnrinde. Allgemeine Zeitschrift für Psychiatrie 64, 146–148.','Maurer, Volk & Gerbaldo (1997). Auguste D and Alzheimer’s disease. Lancet 349, 1546–1549 (the rediscovered case records).','Glenner & Wong (1984). Biochemical and Biophysical Research Communications 120, 885–890 (amyloid-β). · Grundke-Iqbal et al. (1986). PNAS 83, 4913–4917 (tau in tangles).'],
 dur:14,hint:'Switch the stain and press the dark shapes to find out what each one is. Some neurons hold a tangle; plaques lie between cells. A schematic field, not a real slide.',
 init:()=>({stain:'silver',sel:-1,found:{}}),
 watch(p){const k=Math.min(5,Math.floor(p*6)),st=['silver','silver','abeta','abeta','tau','tau'][k],sel=[-1,0,1,7,4,6][k];const found={};[0,7,4].forEach((i,j)=>{if(k>j*2)found[i]=1});return {stain:st,sel,found}},
 ui:[{choose:[['silver','Silver stain'],['abeta','Amyloid-β label'],['tau','Tau label']],label:'Stain',get:s=>s.stain,act:'stain'},{b:'Next structure',act:'next'}],
 on:{stain(s,v){s.stain=B7_STAINS[v]?v:'silver';return 'keep'},pick(s,v){B7_adPick(s,clamp(Math.round(+v),0,10));return 'keep'},next(s){B7_adPick(s,(s.sel+1)%11);return 'keep'}},
 draw(s,f,X){
  const F=B7_FIELD,np=F.plaques.length,st=s.stain;
  const item=s.sel<0?null:s.sel<np?{k:'plaque'}:{k:F.neurons[s.sel-np][2]?'tangle':'neuron'};
  let out=heading(!item?B7_STAINS[st]:item.k==='plaque'?'A plaque: between the cells':item.k==='tangle'?'A tangle: inside a neuron':'A neuron without a tangle');
  out+=`<circle cx="${F.c[0]}" cy="${F.c[1]}" r="${F.r+8}" fill="#2b3d47"/><circle cx="${F.c[0]}" cy="${F.c[1]}" r="${F.r}" fill="${st==='silver'?'#f1e3c6':'#f4f1ec'}"/>`;
  const ink=st==='silver'?'#2a1a10':'#9aa6ad',plaqueCol=st==='silver'?'#3a2416':st==='abeta'?'#b8562e':'#d9d2c8',tangleCol=st==='silver'?'#1c0f08':st==='tau'?'#7a3fa6':'#c9c1b6';
  F.plaques.forEach(([x,y],i)=>{const r=B7_rng(31+i);let g='';for(let j=0;j<26;j++){const a=r()*6.283,d=4+r()*16;g+=Ci(x+d*Math.cos(a),y+d*Math.sin(a),1.6+r()*1.6,plaqueCol)}g+=Ci(x,y,6,plaqueCol);
   const on=s.sel===i;out+=hit(X,'pick',i,`Structure ${i+1}`,Ci(x,y,24,on?'rgba(255,255,255,.01)':'rgba(0,0,0,0)',on?C.amber:'none')+g)});
  F.neurons.forEach(([x,y,t],j)=>{const i=np+j,on=s.sel===i;let g=P(`M${x} ${y-14} L${x-11} ${y+9} L${x+11} ${y+9} Z`,ink,1.6,st==='silver'?'#c9a77a':'#e8e2da')+L(x,y-14,x+3,y-34,ink,1.4)+L(x-9,y+8,x-22,y+18,ink,1.2)+L(x+9,y+8,x+22,y+16,ink,1.2);
   if(t)g+=P(`M${x-4} ${y+6} C${x-6} ${y-2} ${x-2} ${y-8} ${x} ${y-12} C${x+2} ${y-6} ${x+5} ${y} ${x+4} ${y+6}`,tangleCol,2.4,tangleCol);
   out+=hit(X,'pick',i,`Structure ${i+1}`,Ci(x,y-2,22,'rgba(0,0,0,0)',on?C.amber:'none')+g)});
  out+=TF(F.c[0],F.c[1]+F.r+24,'schematic field of cortex',13,C.muted);
  // card
  const nf=Object.keys(s.found).length,pl=Object.keys(s.found).filter(i=>+i<np).length,tg=Object.keys(s.found).filter(i=>+i>=np&&F.neurons[+i-np][2]).length;
  out+=R(300,46,280,150,'#fff',C.grid,10);
  if(!item)out+=B7_wrap(312,70,'Press a dark shape in the field, or Next structure, to identify it. Then switch the stain.',38,13,C.ink);
  else{const txt=item.k==='plaque'?'Outside the cells. A core of amyloid-β, a fragment cut from a larger protein (APP), with damaged nerve endings around it. Identified 1984–85.':
    item.k==='tangle'?'Inside a neuron. Fibrils of the protein tau, which normally supports the cell’s internal tracks, twisted together. Identified in 1986.':'A neuron with no tangle. In Alzheimer’s disease many neurons and synapses are lost as well, which shrinks the brain.';
   out+=TBF(312,70,item.k==='plaque'?'Plaque':item.k==='tangle'?'Tangle':'Neuron',14,item.k==='plaque'?'#b8562e':item.k==='tangle'?C.purple:C.blue,'start')+B7_wrap(312,92,txt,38,13,C.ink)}
  out+=B7_tile(300,206,136,'Plaques found',`${pl} of ${np}`,'#b8562e')+B7_tile(444,206,136,'Tangles found',`${tg} of ${F.neurons.filter(n=>n[2]).length}`,C.purple);
  out+=TF(440,272,st==='silver'?'Silver blackens both, as Alzheimer saw.':st==='abeta'?'Only the plaques take this label.':'Only the tangles take this label.',13,C.ink);
  B7_AD_HIST.forEach(([y,l],i)=>{const x=60+i*120;out+=TBF(x,328,y,13,C.ink)+TF(x,346,l,13,C.muted)});
  out+=L(40,312,560,312,C.line,2)+B7_AD_HIST.map((_,i)=>Ci(60+i*120,312,5,C.blue)).join('');
  return {svg:out,phase:!item?(st==='silver'?'With the silver stain that Alzheimer used, both kinds of abnormality show as dark shapes. Telling them apart needs care: one kind lies between the cells, the other inside them.':st==='abeta'?'A label for amyloid-β picks out the plaques only. Antibody labels like this became possible only after the protein was identified in the 1980s.':'A label for tau picks out the tangles inside neurons only.'):
   item.k==='plaque'?`A plaque, between the cells. ${nf} structure${nf===1?'':'s'} identified so far. Plaques were the first feature of the disease to have their chemistry worked out, which is one reason amyloid became the centre of research.`:
   item.k==='tangle'?'A tangle, filling part of a neuron’s cell body. Tangles spread through the brain in a fairly regular order, starting near the hippocampus, and their spread follows the symptoms more closely than plaques do.':'This neuron has no tangle. Not every cell is affected, but over years many neurons and far more synapses are lost.'};
 }});

const B7_EVID={
 for:[['APP mutations','Mutations in the APP gene, the source of amyloid-β, cause rare inherited forms beginning in mid-life (Goate and colleagues, 1991).',0],
  ['Presenilin mutations','Mutations in presenilin 1 and 2, part of the enzyme that cuts APP to release amyloid-β, also cause early inherited forms (from 1995).',0],
  ['Down syndrome','People with Down syndrome carry an extra chromosome 21, where APP lies, and most have plaques and tangles by about the age of 40.',0],
  ['A protective variant','A rare APP variant that lowers amyloid-β production protects against the disease and against decline with age (Jonsson and colleagues, 2012).',0]],
 against:[['Plaques without dementia','Many older people are found at death to have plenty of plaques, yet had no dementia.',1],
  ['Tangles track symptoms','Memory loss follows tangles and lost synapses more closely than plaques (reviewed by Nelson and colleagues, 2012).',2],
  ['Failed trials','For two decades drugs that cut amyloid-β production or cleared it failed to slow decline; one, semagacestat, made cognition worse (Doody and colleagues, 2013).',3],
  ['Mixed causes','Autopsy studies find that most dementia in old age has several causes together: vascular damage, other proteins, and amyloid.',3]]};
const B7_CASC=['more amyloid-β','plaques','tau tangles','synapses and neurons lost','dementia'];
SCENE({id:'alzheimers-amyloid',name:'The amyloid hypothesis',tag:'Hardy & Higgins, 1992 · strong genes, failed trials',
 definition:'In 1992 John Hardy and Gerald Higgins proposed the amyloid cascade hypothesis: amyloid-β building up in the brain is the first step, which leads on to tangles, the loss of synapses and neurons, and dementia. Its strongest support is genetic. Every known gene that causes the rare inherited, early forms of the disease changes how amyloid-β is made.',
 example:'Against it: plaques are common in older people without symptoms, memory loss tracks tangles more closely than plaques, and for twenty years drugs that lowered amyloid failed in trials. The hypothesis is debated. Supporters argue that the drugs came too late or were too weak; critics argue that amyloid is not the main cause in most people, whose disease begins late in life.',
 desc:'A chain of five boxes from more amyloid-β to dementia, and two columns of evidence, for and against. Pressing a piece of evidence highlights the link in the chain it bears on.',
 research:['Hardy & Higgins (1992). Alzheimer’s disease: the amyloid cascade hypothesis. Science 256, 184–185.','Goate et al. (1991). Nature 349, 704–706 (an APP mutation). · Jonsson et al. (2012). A mutation in APP protects against Alzheimer’s disease and age-related cognitive decline. Nature 488, 96–99.','Nelson et al. (2012). Journal of Neuropathology and Experimental Neurology 71, 362–381. · Doody et al. (2013). A phase 3 trial of semagacestat for treatment of Alzheimer’s disease. New England Journal of Medicine 369, 341–350.'],
 dur:16,hint:'Press each piece of evidence, for and against, and see which link in the chain it supports or challenges. The argument is not settled.',
 init:()=>({side:'for',i:0}),
 watch(p){const k=Math.min(7,Math.floor(p*8));return {side:k<4?'for':'against',i:k%4}},
 ui:[{choose:[['for','Evidence for'],['against','Evidence against']],label:'Show',get:s=>s.side,act:'side'},{b:'Next piece of evidence',act:'next'}],
 on:{side(s,v){s.side=v==='against'?'against':'for';s.i=0},pick(s,v){const [sd,i]=String(v).split(':');s.side=sd==='against'?'against':'for';s.i=clamp(Math.round(+i),0,3)},next(s){if(s.i<3)s.i++;else{s.side=s.side==='for'?'against':'for';s.i=0}}},
 draw(s,f,X){
  const E=B7_EVID[s.side][s.i],link=E[2],fo=s.side==='for';
  let out=heading(fo?'Evidence for: genes point to amyloid':'Evidence against: amyloid is not the whole story');
  B7_CASC.forEach((c,i)=>{const x=20+i*114,on=i===link||(fo&&i===0);out+=R(x,48,104,52,on?(fo?C.greenp:C.coralp):'#fff',on?(fo?C.green:C.coral):C.line,8)+B7_wrap(x+52,70,c,14,13,C.ink,'middle',16);if(i<4)out+=arrow(x+104,74,x+114,74,C.line,2,6)});
  out+=TF(300,120,fo?'Genes that change amyloid-β cause the disease: the first step looks causal.':'Challenges to the later links, and to amyloid as the cause in most people.',13,fo?C.green:C.coral);
  ['for','against'].forEach((sd,c)=>{const x=20+c*286;out+=TBF(x+4,148,sd==='for'?'For':'Against',14,sd==='for'?C.green:C.coral,'start');
   B7_EVID[sd].forEach((e,i)=>{const y=158+i*44,on=sd===s.side&&i===s.i;out+=hit(X,'pick',sd+':'+i,e[0],R(x,y,274,38,on?(sd==='for'?C.greenp:C.coralp):'#fff',on?(sd==='for'?C.green:C.coral):C.line,8)+TBF(x+12,y+24,e[0],13,on?C.ink:C.muted,'start'))})});
  out+=TF(300,352,'The hypothesis is debated; both columns are real findings.',13,C.muted);
  return {svg:out,phase:`${E[0]}. ${E[1]}`};
 }});

// Bateman et al. (2012), DIAN: years before expected onset at which each change was first detected.
const B7_DIAN=[['CSF amyloid-β falls',-25,'#b8562e','amyloid-β in the spinal fluid falls'],['Amyloid on PET',-15,'#d0763f','amyloid shows on PET scans'],['CSF tau rises',-15,C.purple,'tau in the spinal fluid rises'],['Brain shrinkage',-15,C.blue,'the brain begins to shrink'],['Glucose use falls',-10,'#4f9e8e','the brain uses less glucose'],['Memory for events',-10,C.green,'memory for events weakens'],['Overall cognition',-5,C.ink,'overall thinking declines']];
const B7_sig=(y,d)=>1/(1+Math.exp(-(y-d-6.6)/3));
SCENE({id:'alzheimers-decades',name:'Changes decades before symptoms',tag:'Bateman et al., 2012 (DIAN)',
 definition:'People in families with an inherited APP or presenilin mutation tend to develop symptoms at about the age their affected parent did, which lets researchers line up measurements against the expected age of onset. The Dominantly Inherited Alzheimer Network (Bateman and colleagues, 2012) found amyloid-β in the spinal fluid falling about 25 years before expected onset; amyloid on PET scans, rising tau and brain shrinkage about 15 years before; reduced glucose use and poorer memory for events about 10 years before; and impairment of overall thinking about 5 years before.',
 example:'These are averages from 128 people in rare families with a single strong mutation. Whether the same order holds in the common disease that begins late in life is studied but less certain. The long silent period is one argument for testing anti-amyloid treatments earlier, before symptoms.',
 desc:'Schematic curves of seven measures against years before expected onset, each starting to change at the year Bateman and colleagues reported, with a slider that moves along the years and a list that marks each change as it is passed.',
 research:['Bateman et al. (2012). Clinical and biomarker changes in dominantly inherited Alzheimer’s disease. New England Journal of Medicine 367, 795–804.','Jack et al. (2010). Hypothetical model of dynamic biomarkers of the Alzheimer’s pathological cascade. Lancet Neurology 9, 119–128 (the shape of the curves).'],
 dur:12,hint:'Move along the years before expected onset and see which changes have begun. The years are Bateman’s averages for rare inherited forms; the curves’ shapes are schematic. Nothing here predicts anything for a person.',
 init:()=>({y:-15}),
 watch(p){return {y:Math.round(lerp(-30,5,p))}},
 ui:[{range:'y',label:'Years from expected onset',min:-30,max:5,get:s=>s.y,act:'y',show:v=>(+v>0?'+':'')+v}],
 on:{y(s,v){s.y=clamp(Math.round(+v),-30,5)}},
 draw(s){
  const n=B7_DIAN.filter(d=>s.y>=d[1]).length;
  let out=heading(n?`${s.y} years: ${n} of 7 changes under way`:`${s.y} years: no change detected yet`);
  const pl=B7_plot(40,64,296,220,[-30,5],[0,1.05],{xt:[[-30,'−30'],[-25,'−25'],[-20,'−20'],[-15,'−15'],[-10,'−10'],[-5,'−5'],[0,'0'],[5,'+5']],xl:'years from expected onset of symptoms',yl:'how abnormal (schematic)'});out+=pl.svg;
  out+=L(pl.X(0),64,pl.X(0),284,C.coral,1.4,'stroke-dasharray="4 4"')+TF(pl.X(0),58,'onset',13,C.coral);
  B7_DIAN.forEach(([l,d,c])=>{const pts=[];for(let i=0;i<=140;i++){const y=-30+i/4;pts.push([pl.X(y),pl.Y(B7_sig(y,d))])}out+=B7_poly(pts,c,s.y>=d?2.4:1.4,s.y>=d?'':'stroke-opacity=".35"')});
  out+=L(pl.X(s.y),64,pl.X(s.y),284,C.ink,1.4);
  B7_DIAN.forEach(([l,d,c],i)=>{const y=58+i*38,on=s.y>=d;out+=R(352,y,228,32,on?'#fff':'#f7f9fa',on?c:C.line,8)+L(362,y+16,384,y+16,c,on?3:1.5)+TF(392,y+21,l,13,on?C.ink:C.muted,'start')+TBF(572,y+21,`${d}`,13,on?c:C.muted,'end')});
  out+=TF(466,338,'years first detected (Bateman 2012)',13,C.muted);
  out+=B7_note('128 people in rare inherited families. Curves schematic. Not a prediction for anyone.',360);
  const just=B7_DIAN.filter(d=>d[1]<=s.y).map(d=>d[3]);
  return {svg:out,phase:!n?'Nothing measurable has changed yet in these averages.':s.y<0?`${-s.y} years before expected onset, on average: ${just.join('; ')}. The person feels and functions as before; only measurements show the change.`:`At and after expected onset, symptoms appear. On average every measure had begun to change years before, amyloid first, which fits the amyloid hypothesis’s order without proving that amyloid causes the rest.`};
 }});

// The CDR sum of boxes: six areas, each scored 0, 0.5, 1, 2 or 3 (personal care: 0, 1, 2 or 3). Range 0–18.
const B7_CDR=[['Memory',[0,.5,1,2,3]],['Orientation',[0,.5,1,2,3]],['Judgement',[0,.5,1,2,3]],['Community affairs',[0,.5,1,2,3]],['Home and hobbies',[0,.5,1,2,3]],['Personal care',[0,1,2,3]]];
const B7_CDR0=[1,.5,.5,.5,.5,0];
SCENE({id:'alzheimers-antibodies',name:'Clearing plaques: how much does it help?',tag:'Lecanemab: van Dyck et al., 2023',
 definition:'Antibodies that bind amyloid-β can clear plaques from the brain. In the CLARITY AD trial, 1,795 people with early Alzheimer’s disease and confirmed amyloid received lecanemab or a placebo by infusion every two weeks for 18 months. Plaques fell steeply. On the CDR sum of boxes, an 18-point scale of memory and daily function on which higher is worse, scores rose by 1.21 points with lecanemab and 1.66 with placebo: a difference of 0.45 point, about 27% slower decline.',
 example:'Swelling or small bleeds in the brain seen on MRI, called ARIA, were more common with the drug: swelling in 12.6% against 1.7%, mostly without symptoms, and more often in people with two copies of the APOE ε4 gene. Whether a difference of about half a point matters in daily life is debated, as is the amyloid hypothesis behind it. Decisions about these treatments belong to specialists and the people they treat.',
 desc:'The trial’s average change over 18 months for lecanemab and placebo, and the six boxes of the CDR scale for an example person, which can be raised step by step to see how big half a point is.',
 research:['van Dyck et al. (2023). Lecanemab in early Alzheimer’s disease. New England Journal of Medicine 388, 9–21.','Morris (1993). The Clinical Dementia Rating (CDR): current version and scoring rules. Neurology 43, 2412–2414.','Sims et al. (2023). Donanemab in early symptomatic Alzheimer disease: the TRAILBLAZER-ALZ 2 randomized clinical trial. JAMA 330, 512–527 (a second antibody with a similar, modest slowing).'],
 dur:14,hint:'Press a box’s next step to raise it, and compare the change with the 0.45-point difference in the trial. The example person is invented. Not medical advice.',
 init:()=>({b:B7_CDR0.slice()}),
 watch(p){const b=B7_CDR0.slice();if(p>.3)b[0]=2;if(p>.6)b[3]=1;return {b}},
 ui:[{b:'Raise memory one step',act:'raise',arg:0},{b:'Raise home and hobbies one step',act:'raise',arg:4},{b:'Back to the start',act:'reset0'}],
 on:{raise(s,v){const i=clamp(Math.round(+v),0,5),st=B7_CDR[i][1],k=st.indexOf(s.b[i]);if(k<st.length-1)s.b[i]=st[k+1];return 'keep'},set(s,v){const [i,val]=String(v).split(':').map(Number);if(B7_CDR[i]&&B7_CDR[i][1].includes(val)&&val>=B7_CDR0[i])s.b[i]=val;return 'keep'},reset0(s){s.b=B7_CDR0.slice()}},
 draw(s,f,X){
  const tot=sum(s.b),t0=sum(B7_CDR0),d=tot-t0;
  let out=heading(d?`Your example rose ${fmt(d)} point${d===1?'':'s'}; the trial gap was 0.45`:'How big is the trial’s 0.45-point difference?');
  // trial
  const pl=B7_plot(56,64,200,150,[0,18],[0,2],{xt:[[0,'0'],[6,'6'],[12,'12'],[18,'18 mo']],yt:[[0,'0'],[1,'1'],[2,'2']],yl:'rise in CDR-SB (worse)'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(0),pl.X(18),pl.Y(1.66),C.muted,2.4)+L(pl.X(0),pl.Y(0),pl.X(18),pl.Y(1.21),C.blue,2.4);
  out+=TBF(pl.X(8),pl.Y(.74)-10,'placebo: 1.66',13,C.muted,'end')+TBF(pl.X(10),pl.Y(.67)+20,'lecanemab: 1.21',13,C.blue,'start');
  out+=TF(156,250,'drawn straight from 0 to month 18',13,C.muted)+B7_tile(30,262,232,'Swelling on MRI (ARIA-E)','12.6% drug · 1.7% placebo',C.coral);
  // boxes
  out+=TF(300,62,'An invented example person (start: '+fmt(t0)+' points)',13,C.muted,'start');
  B7_CDR.forEach(([l,st],i)=>{const y=72+i*36;out+=TF(300,y+19,l,13,C.ink,'start');
   st.forEach((v,j)=>{const x=430+j*30,on=s.b[i]===v,was=B7_CDR0[i]===v,below=v<B7_CDR0[i],cell=R(x,y+2,26,24,on?C.blue:below?'#f1f4f6':'#fff',on?C.blue:was?C.amber:C.line,6)+TF(x+13,y+19,v===.5?'½':String(v),13,on?'#fff':below?C.muted:C.ink);out+=below?cell:hit(X,'set',i+':'+v,`${l}: ${v}`,cell)})});
  out+=TF(300,292,'0 none · ½ questionable · 1 mild',13,C.muted,'start')+TF(300,306,'2 moderate · 3 severe · amber: start',13,C.muted,'start');
  out+=B7_tile(300,314,88,'Total',fmt(tot)+' / 18',C.blue)+B7_tile(396,314,88,'Change',(d>0?'+':'')+fmt(d),d?C.blue:C.muted)+B7_tile(492,314,88,'Trial gap','0.45',C.coral);
  out+=B7_note('Trial averages; the example person is invented. Not medical advice.',375);
  return {svg:out,phase:!d?'The example person starts at '+fmt(t0)+' points, about where people entered the trial. The scale adds six boxes. Half a point is a single box moving one step, from none to questionable or from questionable to mild.':
   `Your changes add ${fmt(d)} point${d===1?'':'s'}. The trial’s average difference, 0.45, is less than one box moving one half-step. Averaged over 18 months it reflects slower decline for many people, but whether it is noticeable in daily life is debated, and the gap may or may not widen with longer treatment.`};
 }});

/* ===================== Lesson: depression-treatments ===================== */
// No mood test, no self-assessment and nothing that could be read as advice to start, stop or change a treatment.
const B7_DEP_CRISIS='In crisis? Call your local emergency number or a crisis line now.';
const B7_DEP_NOTE='Not medical advice. Never start, stop or change a treatment because of this page.';
const B7_depFoot=()=>B7_banner(B7_DEP_CRISIS,330)+B7_note(B7_DEP_NOTE,372);
const B7_CHAIN=[
 ['Drugs raise monoamines','Observed. Iproniazid blocks the enzyme that breaks down noradrenaline and serotonin; imipramine blocks their reuptake into nerve endings. Either way, more transmitter stays at the synapse, within hours.','obs'],
 ['The drugs help many people','Observed in trials: on average they beat placebo, by a modest margin (next scene).','obs'],
 ['So depression is a shortage','An inference, and the weak link. A treatment can work without reversing the cause: a painkiller eases a headache that was never caused by a lack of painkiller.','inf'],
 ['Direct tests of low serotonin','Inconsistent. Moncrieff and colleagues (2022) reviewed measurements of serotonin and its receptors, depletion experiments and genetic studies, and found no consistent evidence that depression is caused by low serotonin.','dis']];
SCENE({id:'depression-treatments',name:'A theory from chance discoveries',tag:'The monoamine account, 1950s–1965, and why it is disputed',
 definition:'In the 1950s two drugs developed for other purposes seemed to lift depression: iproniazid, a tuberculosis drug, and imipramine, tested by Roland Kuhn in Switzerland. Both turned out to raise the levels of monoamine transmitters, chiefly noradrenaline and serotonin, at synapses. In 1965 Joseph Schildkraut proposed that depression is linked to too little noradrenaline; others proposed serotonin. This grew into the popular story that depression is a “chemical imbalance”.',
 example:'The story is disputed. An umbrella review by Joanna Moncrieff and colleagues (2022) found no consistent evidence that depression is caused by low serotonin. That does not show the medicines do not work: a treatment can help without correcting a cause. There is also a timing puzzle: the drugs change transmitter levels within hours, but their full effect usually builds over weeks. If you are struggling, talk to a doctor.',
 desc:'A chain of four steps from “drugs raise monoamines” to “depression is a shortage”, each marked as observed, inferred or inconsistent, and a schematic timeline comparing how fast transmitter levels change with how slowly symptoms usually improve.',
 research:['Kuhn (1958). The treatment of depressive states with G 22355 (imipramine hydrochloride). American Journal of Psychiatry 115, 459–464.','Schildkraut (1965). The catecholamine hypothesis of affective disorders: a review of supporting evidence. American Journal of Psychiatry 122, 509–522.','Moncrieff et al. (2022). The serotonin theory of depression: a systematic umbrella review of the evidence. Molecular Psychiatry 28, 3243–3256 (disputed account; the review itself has been debated).'],
 dur:16,hint:'Press each step of the argument to see how strong it is, then switch to the timing view. This explains a scientific argument; it is not medical advice. If you are struggling, talk to a doctor.',
 init:()=>({view:'chain',i:0}),
 watch(p){return p<.8?{view:'chain',i:Math.min(3,Math.floor(p/.2))}:{view:'time',i:3}},
 ui:[{choose:[['chain','The argument'],['time','The timing puzzle']],label:'View',get:s=>s.view,act:'view'},{b:'Next step',act:'next'}],
 on:{view(s,v){s.view=v==='time'?'time':'chain'},pick(s,v){s.view='chain';s.i=clamp(Math.round(+v),0,3)},next(s){s.view='chain';s.i=(s.i+1)%4}},
 draw(s,f,X){
  let out='';
  if(s.view==='chain'){const C0=B7_CHAIN[s.i],col={obs:C.green,inf:C.amber,dis:C.coral},lab={obs:'observed',inf:'inference',dis:'inconsistent'};
   out+=heading(`Step ${s.i+1}: ${lab[C0[2]]}`);
   B7_CHAIN.forEach((c,i)=>{const x=20+i*144,on=i===s.i,k=c[2];out+=hit(X,'pick',i,c[0],R(x,50,132,78,on?(k==='obs'?C.greenp:k==='inf'?C.amberp:C.coralp):'#fff',col[k],10,k==='obs'?'':'stroke-dasharray="6 4"')+B7_wrap(x+66,74,c[0],16,13,C.ink,'middle',17)+TBF(x+66,120,lab[k],13,col[k]));
    if(i<3)out+=arrow(x+132,89,x+144,89,i===1?C.amber:C.line,2,6)});
   out+=R(20,146,560,108,'#fff',col[C0[2]],10)+TBF(36,170,C0[0],14,col[C0[2]],'start')+B7_wrap(36,192,C0[1],80,13,C.ink);
   out+=TF(300,282,'Schildkraut 1965 → “chemical imbalance” → disputed (Moncrieff 2022)',13,C.muted)+TF(300,302,'Whether the medicines help is a separate question, asked by trials.',13,C.ink);
  }else{
   out+=heading('Hours for the chemistry, weeks for the mood');
   const pl=B7_plot(80,62,480,190,[0,42],[0,1.1],{xt:[[0,'0'],[7,'1 wk'],[14,'2'],[21,'3'],[28,'4'],[35,'5'],[42,'6 wk']],xl:'time after starting a typical antidepressant (schematic)'});out+=pl.svg;
   const a=[],b=[];for(let i=0;i<=210;i++){const t=i/5;a.push([pl.X(t),pl.Y(t<.2?t/.2:1)]);b.push([pl.X(t),pl.Y(1-Math.exp(-t/12))])}
   out+=B7_poly(a,C.purple,2.6)+B7_poly(b,C.blue,2.6,'stroke-dasharray="6 4"');
   out+=TF(pl.X(9),pl.Y(1)-8,'transmitter at the synapse: up within hours',13,C.purple,'start')+TF(pl.X(20),pl.Y(.62)+22,'average improvement: builds over weeks',13,C.blue,'start');
   out+=TF(300,302,'A slow change downstream, not the level itself, may matter. Schematic shapes.',13,C.ink);
  }
  out+=B7_depFoot();
  return {svg:out,phase:s.view==='time'?'Drugs that block reuptake raise transmitter levels within hours, but the average improvement in trials builds over weeks. If a simple shortage were the cause, the gap would be hard to explain; slower changes in receptors, in plasticity or in how people process emotional information have been proposed instead.':`${B7_CHAIN[s.i][0]}. ${B7_CHAIN[s.i][1]}`};
 }});

// Two normal distributions of improvement, one standard deviation wide, separated by an effect size d.
const B7_ovl=d=>2*B7_Phi(-Math.abs(d)/2);            // shared area of the two curves
const B7_sup=d=>B7_Phi(d/Math.SQRT2);                // chance a random treated person improves more than a random control
function B7_twoCurves(x0,y0,w,h,d,colA,colB,labA,labB){
 const X=z=>x0+(z+3.2)/(7.4)*w,pdf=z=>Math.exp(-z*z/2),Y=v=>y0+h-v*(h-14);
 let o=L(x0,y0+h,x0+w,y0+h,C.line,1.4),A=[],B=[],O=[];
 for(let i=0;i<=200;i++){const z=-3.2+i/200*7.4;A.push([X(z),Y(pdf(z))]);B.push([X(z),Y(pdf(z-d))]);O.push([X(z),Y(Math.min(pdf(z),pdf(z-d)))])}
 o+=P('M'+O.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L')+` L${fmt(X(4.2))} ${fmt(y0+h)} L${fmt(X(-3.2))} ${fmt(y0+h)} Z`,'none',0,C.purplep);
 o+=B7_poly(A,colA,2.4)+B7_poly(B,colB,2.6)+L(X(0),Y(1),X(0),y0+h,colA,1.2,'stroke-dasharray="3 3"')+L(X(d),Y(1),X(d),y0+h,colB,1.2,'stroke-dasharray="3 3"');
 o+=TF(X(0)-8,Y(1)-6,labA,13,colA,'end')+TF(X(d)+8,Y(1)-6,labB,13,colB,'start')+TF(x0+w,y0+h+16,'more improvement →',13,C.muted,'end');
 return o}
const B7_ES=[[.31,'Regulator’s files'],[.41,'Published papers'],[.8,'A large effect']];
SCENE({id:'depression-treatments-trials',name:'How much better than placebo?',tag:'Turner et al., 2008 · Cipriani et al., 2018',
 definition:'In 2018 Andrea Cipriani and colleagues pooled 522 randomised trials of 21 antidepressants, with more than 116,000 adults with major depression. Every one of the 21 did better than placebo on average, by a modest margin. Many people improve on placebo too, so the medicine’s extra effect is the gap between two groups that overlap a great deal.',
 example:'Erick Turner and colleagues (2008) compared published trials with the full files held by the US regulator: the published papers gave an average effect size of 0.41, the full set 0.31, because trials with weak results were less often published. Talking therapies such as cognitive behavioural therapy have evidence of a similar size, and combining therapy with medicine does better on average than either alone (Cuijpers and colleagues, 2020).',
 desc:'Two bell curves of improvement, for placebo and for medicine, separated by an effect size the learner can set, with the shared area shaded and the chance that a treated person improves more than an untreated one.',
 research:['Cipriani et al. (2018). Comparative efficacy and acceptability of 21 antidepressant drugs for the acute treatment of adults with major depressive disorder: a systematic review and network meta-analysis. Lancet 391, 1357–1366.','Turner, Matthews, Linardatos, Tell & Rosenthal (2008). Selective publication of antidepressant trials and its influence on apparent efficacy. New England Journal of Medicine 358, 252–260.','Cuijpers et al. (2020). A network meta-analysis of the effects of psychotherapies, pharmacotherapies and their combination in the treatment of adult depression. World Psychiatry 19, 92–107.','Leucht, Hierl, Kissling, Dold & Davis (2012). Putting the efficacy of psychiatric and general medicine medication into perspective. British Journal of Psychiatry 200, 97–106.'],
 dur:12,hint:'Set the effect size, or choose a published value, and read the overlap. These are group averages: they cannot say how any one person will respond. Not medical advice; if you are struggling, talk to a doctor.',
 init:()=>({d:.31}),
 watch(p){return {d:[.31,.41,.8][Math.min(2,Math.floor(p*3))]}},
 ui:[{range:'d',label:'Effect size (standard deviations)',min:0,max:100,get:s=>Math.round(s.d*100),act:'d',show:v=>fmt(+v/100)},{choose:B7_ES.map(e=>[e[0],e[1]]),label:'Published values',get:s=>s.d,act:'pre'}],
 on:{d(s,v){s.d=clamp(Math.round(+v),0,100)/100},pre(s,v){s.d=clamp(+v,0,1)}},
 draw(s){
  const ov=B7_ovl(s.d),sp=B7_sup(s.d),pre=B7_ES.find(e=>Math.abs(e[0]-s.d)<.005);
  let out=heading(`Effect size ${fmt(s.d)}: the groups overlap by ${Math.round(ov*100)}%`);
  out+=B7_twoCurves(40,56,520,170,s.d,C.muted,C.blue,'placebo','medicine');
  out+=TF(300,262,pre?`${pre[1]}: ${fmt(pre[0])}`:'shaded: the area the two groups share',13,pre?C.ink:C.purple);
  out+=B7_tile(30,272,170,'Overlap',Math.round(ov*100)+'%',C.purple)+B7_tile(215,272,170,'Treated does better',Math.round(sp*100)+' in 100 pairs',C.blue)+B7_tile(400,272,170,'Cipriani 2018','522 trials, 21 drugs',C.ink);
  out+=B7_depFoot();
  return {svg:out,phase:`With an effect size of ${fmt(s.d)}, the two groups share ${Math.round(ov*100)}% of their spread. Pick one person at random from each group, and the one given medicine improves more in about ${Math.round(sp*100)} pairs out of 100, against 50 if there were no effect. ${s.d<.5?'A real but modest average benefit, as the meta-analyses found; individual responses vary widely. Leucht and colleagues (2012) found that many drugs in general medicine have average effects of a similar size.':'Even an effect this large leaves the two groups overlapping a great deal.'}`};
 }});

// UK ECT Review Group (2003): standardised effect sizes.
const B7_ECT={sham:[.91,'Real against simulated ECT','6 trials, 256 people'],drugs:[.80,'ECT against medicines','18 trials, 1,144 people'],bil:[.32,'Both sides against one side','22 trials, 1,408 people']};
const B7_ECT_HIST=[['1938','first use, Rome'],['1950s','anaesthesia, relaxant'],['1980s–90s','brief pulses, one side'],['today','severe depression']];
SCENE({id:'depression-treatments-ect',name:'Electroconvulsive therapy',tag:'Cerletti & Bini, 1938 · given under anaesthesia today',
 definition:'In 1938 Ugo Cerletti and Lucio Bini in Rome first used an electric current to induce a seizure as a treatment. Early ECT was given without anaesthesia and the convulsions could cause injuries. Since the 1950s it has been given under a brief general anaesthetic with a muscle relaxant, so the body barely moves, and the current and the placing of the electrodes have been refined since. Today it is used mainly for severe depression, especially when other treatments have not helped or a person’s life is at risk.',
 example:'A meta-analysis by the UK ECT Review Group (2003) found real ECT clearly more effective than simulated ECT, in which only the anaesthetic is given; many of the trials were small and old. The main side effect is on memory: confusion just after treatment, and gaps in memory for events around the course, which for some people last. Electrodes on one side of the head cause fewer memory effects than on both sides, with somewhat less effect on mood.',
 desc:'Two bell curves, as in the previous scene, for three comparisons from the UK ECT Review Group, and a timeline of how the treatment has changed since 1938.',
 research:['Cerletti & Bini (1938), Rome: the first report of treatment by electrically induced seizures.','UK ECT Review Group (2003). Efficacy and safety of electroconvulsive therapy in depressive disorders: a systematic review and meta-analysis. Lancet 361, 799–808.','Sackeim et al. (2007). The cognitive effects of electroconvulsive therapy in community settings. Neuropsychopharmacology 32, 244–254.'],
 dur:12,hint:'Choose a comparison and compare the overlap with the medicines scene. These are group results; decisions about ECT are made by specialists with the person. Not medical advice.',
 init:()=>({c:'sham'}),
 watch(p){return {c:['sham','drugs','bil'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['sham','Real or simulated'],['drugs','ECT or medicines'],['bil','Both sides or one']],label:'Comparison',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=B7_ECT[v]?v:'sham'}},
 draw(s){
  const E=B7_ECT[s.c],d=E[0],ov=B7_ovl(d);
  let out=heading(`${E[1]}: effect size ${E[0]}`);
  out+=B7_twoCurves(40,52,520,150,d,C.muted,C.green,s.c==='sham'?'simulated':s.c==='drugs'?'medicines':'one side',s.c==='bil'?'both sides':'ECT');
  out+=TF(300,232,`${E[2]} · overlap ${Math.round(ov*100)}% · shaded: shared area`,13,C.ink);
  out+=L(60,258,540,258,C.line,2);B7_ECT_HIST.forEach(([y,l],i)=>{const x=90+i*140;out+=Ci(x,258,5,C.blue)+TBF(x,280,y,13,C.ink)+TF(x,298,l,13,C.muted)});
  out+=TF(300,318,s.c==='bil'?'Both sides: a little more effect on mood, more effect on memory.':'Memory effects are the main cost; see the research line.',13,s.c==='bil'?C.amber:C.ink);
  out+=B7_depFoot();
  return {svg:out,phase:s.c==='sham'?'Against simulated ECT, where people received the anaesthetic but no current, real ECT gave an effect size of 0.91, larger than most medicines achieve against placebo. The trials were few and mostly from the 1970s and 1980s.':
   s.c==='drugs'?'Against medicines the effect size was 0.80, though many of the medicine treatments in those trials would now be considered inadequate. ECT is usually reserved for severe depression because of its memory effects and the need for anaesthesia.':
   'Placing electrodes on both sides of the head was somewhat more effective than one side (effect size 0.32) but caused more memory problems. Much of the later refinement of ECT has been about this trade-off.'};
 }});

// Zarate et al. (2006): 18 people with treatment-resistant depression; one ketamine infusion.
const B7_KET=[[24,71,'1 day'],[168,35,'1 week']];
const B7_hrs=h=>h<24?`${Math.round(h)} h`:h<168?`${fmt(B7_r1(h/24))} days`:`${fmt(B7_r1(h/168))} weeks`;
SCENE({id:'depression-treatments-ketamine',name:'Ketamine: hours, not weeks',tag:'Berman et al., 2000 · Zarate et al., 2006',
 definition:'Ketamine is an anaesthetic that blocks NMDA receptors, a kind of glutamate receptor. In 2000 Robert Berman, John Krystal and colleagues gave a single low dose, by slow infusion, to a small group of people with depression and found that symptoms eased within hours to days, far faster than with conventional antidepressants. Later trials confirmed a rapid effect that usually fades within about a week after one dose.',
 example:'In a trial of 18 people whose depression had not improved with other treatments (Zarate and colleagues, 2006), 71% met the criterion for response the day after the infusion, and 35% still did a week later. A nasal spray of esketamine, one form of the molecule, was approved in the United States in 2019 for use under medical supervision. How ketamine affects mood is not settled, and it can cause dissociation and be misused.',
 desc:'A time axis from one hour to six weeks on a log scale. Two published points show the share of people responding one day and one week after a single ketamine infusion, joined by a schematic curve, with the usual weeks-long build-up of conventional antidepressants shaded for comparison.',
 research:['Berman et al. (2000). Antidepressant effects of ketamine in depressed patients. Biological Psychiatry 47, 351–354.','Zarate et al. (2006). A randomized trial of an N-methyl-D-aspartate antagonist in treatment-resistant major depression. Archives of General Psychiatry 63, 856–864.'],
 dur:12,hint:'Move along the time after one infusion and compare with the slower build-up of conventional antidepressants. Group results from small trials; not medical advice.',
 init:()=>({h:24}),
 watch(p){return {h:Math.round(Math.pow(10,lerp(0,3,p)))}},
 ui:[{range:'h',label:'Time after one infusion',min:0,max:300,get:s=>Math.round(Math.log10(s.h)*100),act:'h',show:v=>B7_hrs(Math.pow(10,+v/100))}],
 on:{h(s,v){s.h=Math.pow(10,clamp(+v,0,300)/100)}},
 draw(s){
  const lg=Math.log10(s.h),pl=B7_plot(70,62,500,180,[0,3.05],[0,100],{xt:[[0,'1 h'],[Math.log10(6),'6 h'],[Math.log10(24),'1 day'],[Math.log10(72),'3 d'],[Math.log10(168),'1 wk'],[Math.log10(1008),'6 wk']],yt:[[0,'0'],[50,'50'],[100,'100%']],xl:'time after the infusion (log scale)',yl:'people responding (ketamine)'});
  let out=heading(s.h<2?'During and just after the infusion':s.h<=36?'Within a day: the rapid effect':s.h<=200?'Over the first week the effect fades':'Weeks later: the time conventional drugs need');
  out+=R(pl.X(Math.log10(336)),62,pl.X(3.05)-pl.X(Math.log10(336)),180,C.pale,'none',0)+pl.svg.replace(/fill="#fff"/,'fill="none"');
  out+=TF(pl.X(2.78),84,'usual build-up of',13,C.blue)+TF(pl.X(2.78),100,'other antidepressants',13,C.blue);
  out+=R(pl.X(0),62,pl.X(Math.log10(2))-pl.X(0),180,C.amberp,'none',0,'fill-opacity=".8"')+TF(pl.X(.15),230,'dissociation',13,C.amber,'start');
  const k=lgv=>{const t=Math.pow(10,lgv);return t<2?10*t:t<=24?lerp(20,71,(lgv-Math.log10(2))/(Math.log10(24)-Math.log10(2))):t<=168?lerp(71,35,(lgv-Math.log10(24))/(Math.log10(168)-Math.log10(24))):Math.max(10,35-30*(lgv-Math.log10(168)))};
  const pts=[];for(let i=0;i<=150;i++){const g=i/150*3;pts.push([pl.X(g),pl.Y(k(g))])}out+=B7_poly(pts,C.purple,2,'stroke-dasharray="5 4"');
  B7_KET.forEach(([h,v,l])=>{out+=Ci(pl.X(Math.log10(h)),pl.Y(v),7,C.purple,'#fff')+TBF(pl.X(Math.log10(h))+10,pl.Y(v)-8,`${v}% at ${l}`,13,C.purple,'start')});
  out+=L(pl.X(lg),62,pl.X(lg),242,C.ink,1.4);
  out+=TF(300,296,'dots: Zarate et al. (2006), 18 people · dashed line: schematic',13,C.muted);
  out+=B7_depFoot();
  return {svg:out,phase:s.h<2?'During and just after the infusion many people feel detached or dreamlike (dissociation). This passes within a couple of hours and is one reason it is given under supervision.':
   s.h<=36?'By the next day 71% of the people in Zarate’s trial met the criterion for response, a speed no conventional antidepressant matches. The trial was small, and people can often tell ketamine from placebo, which complicates blinding.':
   s.h<=200?'The effect of a single dose fades over days: a week after the infusion 35% still met the criterion. Repeated doses, and how safe they are over the long term, are still being studied.':
   'By this time a single infusion has usually worn off, while conventional antidepressants are only reaching their full effect. Ketamine’s speed is what made researchers look beyond monoamines, towards glutamate and plasticity.'};
 }});

/* ===================== Lesson: addiction ===================== */
const B7_ADD_HELP='Worried about drug use? A doctor or a local support service can help.';
// Microdialysis after Di Chiara & Imperato (1988): illustrative peak sizes, relative to baseline, by site.
const B7_MD={saline:['Salt solution only',1,1],amph:['Amphetamine',4,2.4],coc:['Cocaine',3.2,2],morph:['Morphine',1.9,1.25],nic:['Nicotine',1.8,1.2],eth:['Alcohol',1.7,1.15],non:['A drug not misused',1,1]};
const B7_mdCurve=(t,peak)=>t<0?1:1+(peak-1)*(t/40)*Math.exp(1-t/40);
SCENE({id:'addiction',name:'Drugs and dopamine in the accumbens',tag:'Di Chiara & Imperato, 1988',
 definition:'Gaetano Di Chiara and Assunta Imperato used microdialysis in freely moving rats: a fine tube with a permeable tip, placed in the brain, collects samples of the surrounding fluid every few minutes so that dopamine can be measured. They found that drugs that humans misuse, including amphetamine, cocaine, morphine, nicotine and alcohol, raised dopamine more in the nucleus accumbens, part of the ventral striatum, than in the dorsal striatum, while drugs that people do not misuse did not raise it.',
 example:'Food raises accumbens dopamine too, but the response weakens as a food becomes familiar (Bassareo and Di Chiara, 1997), while the response to drugs tends not to. A surge of dopamine helps explain why drugs are learned about so strongly. It is not the same as pleasure, and it does not by itself explain why only some people who use drugs become addicted.',
 desc:'A rat’s brain with a microdialysis probe in either the nucleus accumbens or the dorsal striatum, and a plot of dopamine in successive samples before and after a drug or a salt-solution control.',
 research:['Di Chiara & Imperato (1988). Drugs abused by humans preferentially increase synaptic dopamine concentrations in the mesolimbic system of freely moving rats. PNAS 85, 5274–5278.','Bassareo & Di Chiara (1997). Journal of Neuroscience 17, 851–861 (accumbens responses to a familiar food habituate).','Peak sizes here are illustrative; the ordering by site follows the 1988 paper.'],
 dur:14,hint:'Choose a drug and a probe site, and compare the samples with the salt-solution control. Peak sizes are illustrative. Not medical advice.',
 init:()=>({d:'amph',site:'acc'}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {d:['saline','amph','amph','morph','nic','non'][k],site:k===2?'dors':'acc'}},
 ui:[{choose:Object.keys(B7_MD).map(k=>[k,B7_MD[k][0]]),label:'Injected',get:s=>s.d,act:'d'},{choose:[['acc','Nucleus accumbens'],['dors','Dorsal striatum']],label:'Probe in',get:s=>s.site,act:'site'}],
 on:{d(s,v){s.d=B7_MD[v]?v:'saline'},site(s,v){s.site=v==='dors'?'dors':'acc'}},
 draw(s,f,X){
  const M=B7_MD[s.d],acc=s.site==='acc',peak=acc?M[1]:M[2],other=acc?M[2]:M[1];
  let out=heading(peak<1.05?`${M[0]}: no change in dopamine`:`${M[0]}: dopamine rises ${acc?'in the accumbens':'in the dorsal striatum'}`);
  // rat brain, side view
  out+=R(20,46,230,250,'#fff',C.grid,10)+TF(135,66,'rat brain, side view',13,C.muted);
  out+=P('M40 170 C40 120 90 92 150 96 C200 98 232 128 230 166 C228 200 196 214 150 212 C100 212 40 210 40 170 Z','#a99a8c',2,'#f3eee9');
  out+=`<ellipse cx="206" cy="196" rx="28" ry="18" fill="#f3eee9" stroke="#a99a8c" stroke-width="1.8"/><ellipse cx="46" cy="186" rx="14" ry="9" fill="#f3eee9" stroke="#a99a8c" stroke-width="1.6"/>`;
  const tgt=acc?[104,180]:[112,146];
  out+=`<ellipse cx="104" cy="180" rx="16" ry="11" fill="${acc?C.coralp:'#ede4da'}" stroke="${acc?C.coral:'#c3b4a5'}" stroke-width="1.6"/><ellipse cx="112" cy="144" rx="22" ry="14" fill="${!acc?C.coralp:'#ede4da'}" stroke="${!acc?C.coral:'#c3b4a5'}" stroke-width="1.6"/>`;
  out+=L(tgt[0],66+14,tgt[0],tgt[1],C.ink,3)+Ci(tgt[0],tgt[1],3,C.ink);
  out+=P('M176 176 C150 186 128 186 112 182',C.amber,2,'none','stroke-dasharray="4 3"')+TF(178,236,'dopamine cells',13,C.amber)+TF(178,252,'(midbrain)',13,C.amber);
  out+=TF(56,262,'accumbens',13,acc?C.coral:C.muted,'start')+TF(56,280,'dorsal striatum',13,!acc?C.coral:C.muted,'start');
  // samples
  const pl=B7_plot(300,66,276,190,[-60,180],[0,4.4],{xt:[[-60,'−60'],[0,'0'],[60,'60'],[120,'120'],[180,'180 min']],yt:[[1,'baseline']],xl:'time from injection, one sample every 20 min',yl:'dopamine in each sample (illustrative)'});out+=pl.svg;
  out+=L(pl.X(0),66,pl.X(0),256,C.ink,1.2,'stroke-dasharray="3 3"')+L(pl.X(-60),pl.Y(1),pl.X(180),pl.Y(1),C.line,1.2);
  const pts=[],ghost=[];for(let t=-60;t<=180;t+=20){pts.push([pl.X(t),pl.Y(B7_mdCurve(t,peak))]);ghost.push([pl.X(t),pl.Y(B7_mdCurve(t,other))])}
  out+=B7_poly(ghost,C.line,1.6,'stroke-dasharray="5 4"')+B7_poly(pts,C.coral,2.4)+pts.map(p=>Ci(p[0],p[1],4.5,C.coral,'#fff')).join('');
  out+=TF(576,90,`solid: ${acc?'accumbens':'dorsal'}`,13,C.coral,'end')+TF(576,108,`dashed: ${acc?'dorsal':'accumbens'}`,13,C.muted,'end');
  out+=B7_banner(B7_ADD_HELP,312)+B7_note('Rats, from published microdialysis work; values illustrative. Not medical advice.',360);
  return {svg:out,phase:peak<1.05&&other<1.05?(s.d==='saline'?'The control: an injection of salt solution leaves dopamine at baseline in every sample. Any change with a drug can then be put down to the drug, not to handling or injection.':'A drug that people do not seek out for itself leaves dopamine at baseline, which is what made the result with misused drugs stand out.'):
   acc?`After ${M[0].toLowerCase()} dopamine in the accumbens climbs over the next samples and returns to baseline within a few hours. The dashed line shows the dorsal striatum, which rises less: the accumbens is where the drugs had their most consistent effect.`:
   `In the dorsal striatum the rise after ${M[0].toLowerCase()} is smaller than in the accumbens (dashed). The accumbens, a hub between the systems of motivation and of action, became the focus of addiction research.`};
 }});

// Opponent processes (Solomon & Corbit 1974): a fast drug effect a(t) and a slower opposing response b(t) that grows
// with each repetition. Part of b is learned and cued by the usual setting (Siegel). Units are schematic.
const B7_a=t=>t<=0?0:(t/1)*Math.exp(1-t/1);
const B7_bShape=t=>t<=0?0:(t/3)*Math.exp(1-t/3);
const B7_bSize=(n,set)=>{const g=.85*(1-Math.exp(-n/3));return set==='new'?g*.35:g};
SCENE({id:'addiction-tolerance',name:'Tolerance and withdrawal',tag:'Solomon & Corbit, 1974 · Siegel, 1982',
 definition:'With repeated use, the same amount of a drug often has less effect: tolerance. When it wears off, the body may swing the other way: withdrawal. Richard Solomon and John Corbit (1974) described this as two processes: the drug’s direct effect, and a slower opposing response that the body mounts against it. With repetition the opposing response grows larger and lasts longer, so the net effect shrinks and the after-effect deepens.',
 example:'Part of the opposing response is learned and tied to the setting. In experiments by Shepard Siegel and colleagues (1982), rats given a large dose of heroin in an unfamiliar setting were more likely to die than rats given the same dose where they usually received it: the cues that trigger the learned counter-response were missing. Withdrawal differs a great deal between drugs, and tolerance and withdrawal are not the whole of addiction.',
 desc:'Curves of the drug’s direct effect, the opposing response and the net effect after one dose, which change as the same dose is repeated; a row of bars for the peak and the after-dip of each dose; and a switch between the usual setting and a new one.',
 research:['Solomon & Corbit (1974). An opponent-process theory of motivation: I. Temporal dynamics of affect. Psychological Review 81, 119–145.','Siegel, Hinson, Krank & McCully (1982). Heroin “overdose” death: contribution of drug-associated environmental cues. Science 216, 436–437.','The curves are a schematic model, not measurements of any drug.'],
 dur:14,hint:'Repeat the same dose and watch the opposing response grow. Then switch to a new setting. Schematic units; not medical advice.',
 init:()=>({n:0,set:'usual',hist:[0]}),
 watch(p){const n=Math.min(8,Math.floor(p*9)),hist=[];for(let i=0;i<=n;i++)hist.push(i);return {n,set:p>.9?'new':'usual',hist}},
 ui:[{b:'Take the same dose again',act:'dose'},{choose:[['usual','Usual setting'],['new','A new setting']],label:'Where',get:s=>s.set,act:'set'},{b:'Start again',act:'clear'}],
 on:{dose(s){if(s.hist.length<10){s.n=s.hist.length;s.hist.push(s.n)}else s.n=9;return 'keep'},set(s,v){s.set=v==='new'?'new':'usual';return 'keep'},clear(s){s.n=0;s.hist=[0]}},
 draw(s){
  const B=B7_bSize(s.n,s.set),net=t=>B7_a(t)-B*B7_bShape(t);
  let pk=0,dip=0;for(let i=0;i<=240;i++){const t=i/20,v=net(t);pk=Math.max(pk,v);dip=Math.min(dip,v)}
  let out=heading(s.set==='new'?`Dose ${s.n+1} in a new setting: the learned brake is missing`:s.n?`Dose ${s.n+1}: net effect ${Math.round(pk*100)}% of the first`:'The first dose');
  const pl=B7_plot(60,60,310,170,[0,12],[-.8,1.1],{xt:[[0,'0'],[3,'3'],[6,'6'],[9,'9'],[12,'12']],yt:[[1,'+1'],[0,'0'],[-.5,'−0.5']],xl:'time after the dose (schematic units)'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(0),pl.X(12),pl.Y(0),C.line,1.2);
  const A=[],Bp=[],N=[];for(let i=0;i<=240;i++){const t=i/20;A.push([pl.X(t),pl.Y(B7_a(t))]);Bp.push([pl.X(t),pl.Y(-B*B7_bShape(t))]);N.push([pl.X(t),pl.Y(net(t))])}
  out+=B7_poly(A,C.blue,1.6,'stroke-dasharray="5 4"')+B7_poly(Bp,C.purple,1.6,'stroke-dasharray="5 4"')+B7_poly(N,C.coral,2.8);
  out+=TF(pl.X(1.2)+6,pl.Y(1)+4,'drug’s direct effect',13,C.blue,'start')+TF(pl.X(12)-4,pl.Y(-.62),'opposing response',13,C.purple,'end')+TF(pl.X(12)-4,pl.Y(.25),'net: what is felt',13,C.coral,'end');
  // per-dose bars
  out+=R(390,60,190,196,'#fff',C.grid,8)+TF(485,80,'each dose: peak and dip',13,C.muted);
  const bx=i=>404+i*17.5,yb=160;out+=L(396,yb,574,yb,C.line,1.2);
  s.hist.forEach((n,i)=>{const b=B7_bSize(n,i===s.hist.length-1?s.set:'usual');let p=0,d=0;for(let j=0;j<=240;j++){const t=j/20,v=B7_a(t)-b*B7_bShape(t);p=Math.max(p,v);d=Math.min(d,v)}
   out+=R(bx(i),yb-p*70,12,p*70,i===s.hist.length-1&&s.set==='new'?C.amber:C.coral,'none',2)+R(bx(i),yb,12,-d*70,C.purple,'none',2)});
  out+=TF(485,248,`${s.hist.length} dose${s.hist.length===1?'':'s'} so far`,13,C.muted);
  out+=B7_tile(60,280,150,'Peak of net effect',Math.round(pk*100)+'%',C.coral)+B7_tile(220,280,150,'After-dip',Math.round(-dip*100)+'%',C.purple)+B7_tile(380,280,200,'Opposing response',Math.round(B*100)+'% of full size',C.purple);
  out+=B7_banner(B7_ADD_HELP,334)+B7_note('Schematic model. Not medical advice.',374);
  return {svg:out,phase:s.set==='new'?'In a new setting the cues that normally trigger the learned part of the opposing response are absent, so the same dose has a much larger net effect. This is the logic of Siegel’s experiments with rats, and one reason doses that were tolerated before can be dangerous in a new place.':
   !s.n?'After a first dose the direct effect dominates and the opposing response is small, so there is little after-dip.':
   `By dose ${s.n+1} the opposing response has grown, so the same dose produces a smaller peak (tolerance) and a deeper dip as it wears off (the seed of withdrawal). To get the first dose’s effect, more would be needed.`};
 }});

// Incentive sensitisation (Robinson & Berridge 1993): schematic. Wanting grows with exposure and responds to cues;
// liking does not grow.
const B7_want=n=>1+2*(1-Math.exp(-n/4));
const B7_like=n=>1-.25*(1-Math.exp(-n/5));
SCENE({id:'addiction-wanting',name:'Wanting grows, liking does not',tag:'Robinson & Berridge, 1993',
 definition:'Terry Robinson and Kent Berridge proposed the incentive-sensitisation theory in 1993. Repeated drug use can make the brain’s dopamine-related systems more reactive, in some people and some circumstances, so that the drug, and cues linked to it, trigger intense wanting. Liking, the pleasure the drug gives, does not grow in the same way and may fall. The theory explains how craving can be strong, and set off by cues, long after use has stopped and when the drug is no longer much enjoyed.',
 example:'In rats, repeated amphetamine makes later doses produce larger increases in movement and in dopamine release, a sensitisation that can last for months. The wanting–liking distinction itself is described in the lesson on reward and dopamine; here it changes with experience. The theory is influential, and how much of human addiction it explains is still argued.',
 desc:'Two lines across repeated uses, one for wanting and one for liking, with a bar chart for the current moment: after a use, after seeing a cue alone, or after months without use.',
 research:['Robinson & Berridge (1993). The neural basis of drug craving: an incentive-sensitization theory of addiction. Brain Research Reviews 18, 247–291.','Robinson & Becker (1986). Enduring changes in brain and behavior produced by chronic amphetamine administration. Brain Research Reviews 11, 157–198.','Robinson & Berridge (2008). The incentive sensitization theory of addiction: some current issues. Philosophical Transactions of the Royal Society B 363, 3137–3146.'],
 dur:14,hint:'Repeat use, then show a cue alone, then let months pass without use. Watch wanting and liking separate. A schematic picture of a theory; not medical advice.',
 init:()=>({n:0,ev:'use',away:0}),
 watch(p){const n=Math.min(10,Math.floor(p*12));return {n,ev:p>.85?'cue':'use',away:p>.92?1:0}},
 ui:[{b:'Use again',act:'use'},{b:'A cue only (no drug)',act:'cue'},{b:'Months without use',act:'away'},{b:'Start again',act:'clear'}],
 on:{use(s){s.n=Math.min(12,s.n+1);s.ev='use';s.away=0;return 'keep'},cue(s){s.ev='cue';return 'keep'},away(s){s.away=1;s.ev='cue';return 'keep'},clear(s){s.n=0;s.ev='use';s.away=0}},
 draw(s){
  const w=B7_want(s.n)*(s.away?.85:1),l=B7_like(s.n),cue=s.ev==='cue';
  let out=heading(cue?(s.away?'Months later, a cue still triggers wanting':'A cue alone triggers wanting'):s.n?`After ${s.n} use${s.n===1?'':'s'}: wanting ${fmt(B7_r1(w))}, liking ${fmt(B7_r1(l))}`:'Before repeated use');
  const pl=B7_plot(60,62,320,200,[0,12],[0,3.3],{xt:[[0,'0'],[4,'4'],[8,'8'],[12,'12']],yt:[[1,'1'],[2,'2'],[3,'3']],xl:'number of past uses',yl:'relative size (first use = 1, schematic)'});out+=pl.svg;
  const W=[],Lk=[];for(let i=0;i<=120;i++){const n=i/10;W.push([pl.X(n),pl.Y(B7_want(n))]);Lk.push([pl.X(n),pl.Y(B7_like(n))])}
  out+=B7_poly(W,C.coral,2.6)+B7_poly(Lk,C.blue,2.6)+TF(pl.X(12)-4,pl.Y(B7_want(12))+20,'wanting',13,C.coral,'end')+TF(pl.X(12)-4,pl.Y(B7_like(12))-8,'liking',13,C.blue,'end');
  out+=Ci(pl.X(s.n),pl.Y(B7_want(s.n)),6,C.coral,'#fff')+Ci(pl.X(s.n),pl.Y(l),6,C.blue,'#fff');
  // bars for this moment
  out+=R(400,62,180,200,'#fff',C.grid,8)+TF(490,82,cue?(s.away?'cue, after months away':'cue only, no drug'):'just after a use',13,C.muted);
  const yb=236,h=v=>v/3.3*130;out+=L(410,yb,570,yb,C.line,1.2);
  const wb=cue?w*.9:w,lb=cue?0:l;out+=R(430,yb-h(wb),50,h(wb),C.coral,'none',4)+R(510,yb-h(lb),50,h(lb),C.blue,'none',4);
  out+=TF(455,254,'wanting',13,C.coral)+TF(535,254,'liking',13,C.blue)+TBF(455,yb-h(wb)-6,fmt(B7_r1(wb)),13,C.coral)+TBF(535,yb-h(lb)-6,cue?'none':fmt(B7_r1(lb)),13,C.blue);
  out+=B7_banner(B7_ADD_HELP,316)+B7_note('Use person-first words: a person with addiction. Not medical advice.',364);
  return {svg:out,phase:cue?(s.away?'Even after months without use, a cue linked to the drug still sets off strong wanting in this picture, which fits the long-lasting sensitisation seen in animals and the cue-triggered craving people describe. It is not a failure of will to feel it.':'A cue alone, with no drug at all, triggers wanting but brings no liking. In the theory, the sensitised system attaches “incentive salience” to the cue itself.'):
   !s.n?'At first, wanting and liking are matched.':`After ${s.n} uses, wanting has grown to ${fmt(B7_r1(w))} times its first size while liking has drifted to ${fmt(B7_r1(l))}. In the theory the two separate because they rest on different brain systems: dopamine-related systems for wanting, smaller “hotspots” for liking.`};
 }});

// Anthony, Warner & Kessler (1994), US National Comorbidity Survey: of people who had ever used each drug,
// the share who had ever been dependent on it.
const B7_AWK={tob:['Tobacco',32],her:['Heroin',23],coc:['Cocaine',17],alc:['Alcohol',15],can:['Cannabis',9]};
const B7_VIEWS={disease:['A brain disease','Leshner (1997): lasting brain changes justify treating addiction as a chronic illness, which counters blame and supports treatment.'],
 learn:['Learning and development','Lewis (2015): the changes are those of deep learning, like other strong habits, and can be outgrown.'],
 choice:['Choices shaped by circumstance','Heyman (2009): most people quit eventually, often as their circumstances change, which fits a disorder of choice.']};
SCENE({id:'addiction-recovery',name:'Most do not, and many recover',tag:'Who becomes addicted, and the “brain disease” debate',
 definition:'Most people who use a drug do not become addicted to it. In a large US survey (Anthony, Warner and Kessler, 1994), of the people who had ever used each drug, the share who had ever been dependent on it was about 32% for tobacco, 23% for heroin, 17% for cocaine, 15% for alcohol and 9% for cannabis. Many people with addiction recover: a later US survey estimated that, over a lifetime, the chance of remitting from dependence was over 80% for each of nicotine, alcohol, cannabis and cocaine (Lopez-Quintero and colleagues, 2011).',
 example:'In 1997 Alan Leshner, director of the US National Institute on Drug Abuse, argued that addiction is a brain disease, to counter blame and to support treatment. Critics such as Gene Heyman and Marc Lewis see it instead as choices shaped by circumstances, or as deep learning that can be outgrown; others defend the disease view (Heilig and colleagues, 2021). The framing is debated. Treatment helps: for opioid addiction, methadone and buprenorphine are linked to much lower death rates while people take them (Sordo and colleagues, 2017).',
 desc:'A grid of 100 people who have ever used a drug, with those who ever became dependent coloured, for five drugs; and three cards setting out views of what addiction is, with what each emphasises.',
 research:['Anthony, Warner & Kessler (1994). Comparative epidemiology of dependence on tobacco, alcohol, controlled substances, and inhalants: basic findings from the National Comorbidity Survey. Experimental and Clinical Psychopharmacology 2, 244–268.','Lopez-Quintero et al. (2011). Probability and predictors of remission from life-time nicotine, alcohol, cannabis or cocaine dependence. Addiction 106, 657–669.','Leshner (1997). Addiction is a brain disease, and it matters. Science 278, 45–47. · Heyman (2009). Addiction: A Disorder of Choice. Harvard University Press. · Lewis (2015). The Biology of Desire. PublicAffairs. · Heilig et al. (2021). Neuropsychopharmacology 46, 1715–1723. · Sordo et al. (2017). BMJ 357, j1550.'],
 dur:14,hint:'Choose a drug to see how many of every 100 people who ever used it became dependent. Then read the three views of what addiction is. Survey figures from one country; not medical advice.',
 init:()=>({d:'tob',v:'disease'}),
 watch(p){const k=Math.min(7,Math.floor(p*8));return {d:['tob','her','coc','alc','can','can','can','can'][k],v:['disease','disease','disease','disease','disease','disease','learn','choice'][k]}},
 ui:[{choose:Object.keys(B7_AWK).map(k=>[k,B7_AWK[k][0]]),label:'Ever used',get:s=>s.d,act:'d'},{choose:Object.keys(B7_VIEWS).map(k=>[k,B7_VIEWS[k][0]]),label:'View',get:s=>s.v,act:'v'}],
 on:{d(s,v){s.d=B7_AWK[v]?v:'tob';return 'keep'},v(s,v){s.v=B7_VIEWS[v]?v:'disease';return 'keep'}},
 draw(s,f,X){
  const A=B7_AWK[s.d],V=B7_VIEWS[s.v];
  let out=heading(`${A[0]}: ${A[1]} in 100 who ever used it became dependent`);
  out+=R(20,46,260,250,'#fff',C.grid,10)+B7_people(50,72,21.5,i=>i<A[1]?C.coral:'#e3ebf0',8);
  out+=TF(150,292,'Anthony, Warner & Kessler (1994), US',13,C.muted);
  Object.keys(B7_VIEWS).forEach((k,i)=>{const y=46+i*44,on=k===s.v;out+=hit(X,'v',k,B7_VIEWS[k][0],R(296,y,284,38,on?C.purplep:'#fff',on?C.purple:C.line,8)+TBF(308,y+24,B7_VIEWS[k][0],13,on?C.purple:C.ink,'start'))});
  out+=R(296,180,284,80,'#fff',C.purple,8)+B7_wrap(308,200,V[1],40,13,C.ink);
  out+=R(296,266,284,30,C.greenp,'none',8)+TBF(438,286,'Recovery is common: over 80% remit',13,C.green);
  out+=B7_banner(B7_ADD_HELP,308)+B7_note('Survey estimates for groups, not predictions for a person. Not medical advice.',356);
  return {svg:out,phase:`${A[1]} of every 100 people who had ever used ${A[0].toLowerCase()} had ever been dependent on it; the other ${100-A[1]} had not. ${V[0]}. ${V[1]}`};
 }});
