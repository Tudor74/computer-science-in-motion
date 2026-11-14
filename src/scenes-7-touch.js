/* ===================== Era 7 · Touch, mobile and attention (2000s–2010s) ===================== */
// Shared helpers for this era (prefix H7_).
function H7_phone(x,y,w,h){return R(x,y,w,h,'#fff',C.dark,18)+R(x+8,y+22,w-16,h-44,'#f6f9fb','none',4)+R(x+w/2-18,y+9,36,5,C.line,'none',3)+Ci(x+w/2,y+h-11,6,'none',C.line)}
function H7_erf(x){const s=Math.sign(x);x=Math.abs(x);const t=1/(1+.3275911*x),y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return s*y}
const H7_Phi=z=>.5*(1+H7_erf(z/Math.SQRT2));
function H7_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function H7_finger(x,y,r=15,col=C.coral){return Ci(x,y,r+6,col,'none','opacity=".18"')+Ci(x,y,r,'none',col,'stroke-width="2.5"')+Ci(x,y,3,col)}

/* ---------- Lesson: multi-touch ---------- */
SCENE({id:'multi-touch',name:'Multi-touch',tag:'Two fingers, one mapping',
 definition:'A touch surface that senses several contact points at once, so a gesture can use the relationship between fingers: their distance, angle and midpoint.',
 example:'Spread two fingers and a map zooms; twist them and it turns. The software keeps the map point under each finger pinned to that finger.',
 desc:'A generic phone screen showing a map held by two finger contacts, beside the scale, rotation and shift worked out from the two points.',
 research:['Han (2005). Low-cost multi-touch sensing through frustrated total internal reflection. UIST.','Buxton (2007). Multi-touch systems that I have known and loved.'],
 dur:12,hint:'Change the spread, twist and slide of the two fingers. The map moves so that each finger stays on the same spot. Then try one finger.',
 init:()=>({spread:1.4,twist:20,dx:10,fingers:2}),
 watch(p){const a=smooth(clamp(p/.33,0,1)),b=smooth(clamp((p-.33)/.33,0,1)),c=smooth(clamp((p-.66)/.34,0,1));return {spread:1+.6*a,twist:Math.round(30*b),dx:Math.round(40*c),fingers:2}},
 ui:[{range:'spread',label:'Spread',min:.5,max:2,step:.05,get:s=>s.spread,act:'spread',show:v=>'×'+fmt(v)},{range:'twist',label:'Twist',min:-60,max:60,step:5,get:s=>s.twist,act:'twist',show:v=>v+'°'},{range:'dx',label:'Slide',min:-60,max:60,step:5,get:s=>s.dx,act:'dx'},{choose:[[2,'Two fingers'],[1,'One finger']],label:'Fingers',get:s=>s.fingers,act:'fingers'}],
 on:{spread(s,v){s.spread=v},twist(s,v){s.twist=v},dx(s,v){s.dx=v},fingers(s,v){s.fingers=Number(v)}},
 draw(s){
  const two=s.fingers===2,sp=two?s.spread:1,tw=two?s.twist:0,th=tw*Math.PI/180,cx=180,cy=205,mx=cx+s.dx,my=cy;
  const a=sp*Math.cos(th),b=sp*Math.sin(th);
  let out=heading('Each finger stays on its spot');
  out+=H7_phone(40,46,280,320)+`<clipPath id="h7-mt-clip"><rect x="48" y="68" width="264" height="276" rx="4"/></clipPath>`;
  let map=R(-120,-90,240,180,'#e6f0e1',C.line,6)+P('M-120 -20 C-40 -40 20 10 120 -10',C.amber,7)+P('M-30 -90 L10 90',C.amber,5)+`<ellipse cx="55" cy="40" rx="38" ry="22" fill="#cfe3f2" stroke="${C.blue}"/>`+R(-80,10,34,26,'#fff',C.dark,3)+P('M-84 10 L-63 -6 L-42 10',C.dark,2,'#fff')+T(55,45,'lake',13,C.blue)+T(-63,56,'home',13,C.ink);
  for(let g=-120;g<=120;g+=40)map+=L(g,-90,g,90,'#ffffff',1);
  out+=`<g clip-path="url(#h7-mt-clip)"><g transform="matrix(${fmt(a)} ${fmt(b)} ${fmt(-b)} ${fmt(a)} ${fmt(mx)} ${fmt(my)})">${map}</g></g>`;
  const ux=Math.cos(th)*55*sp,uy=Math.sin(th)*55*sp;
  if(two){out+=Ci(cx-55,cy,15,'none',C.muted,'stroke-dasharray="4 4"')+Ci(cx+55,cy,15,'none',C.muted,'stroke-dasharray="4 4"')+H7_finger(mx-ux,my-uy)+H7_finger(mx+ux,my+uy)+L(mx-ux,my-uy,mx+ux,my+uy,C.coral,1.5,'stroke-dasharray="3 4"')}
  else out+=Ci(cx,cy,15,'none',C.muted,'stroke-dasharray="4 4"')+H7_finger(mx,my);
  const px=345;out+=TBF(px,80,two?'From two contacts':'From one contact',16,C.ink,'start');
  if(two){out+=TF(px,112,'distance 110 → '+Math.round(110*sp),14,C.muted,'start')+TBF(px,134,'scale = ×'+fmt(sp),17,C.blue,'start');
   out+=TF(px,168,'angle of the line 0° → '+tw+'°',14,C.muted,'start')+TBF(px,190,'rotation = '+tw+'°',17,C.purple,'start');
   out+=TF(px,224,'midpoint moved '+s.dx+' px',14,C.muted,'start')+TBF(px,246,'shift = '+s.dx+' px',17,C.green,'start');
   out+=TF(px,290,'Two points fix all four:',14,C.ink,'start')+TF(px,310,'scale, turn, and shift in x, y.',14,C.ink,'start')}
  else{out+=TF(px,112,'One point can only drag:',14,C.muted,'start')+TBF(px,134,'shift = '+s.dx+' px',17,C.green,'start');
   out+=TF(px,176,'No distance and no angle,',14,C.ink,'start')+TF(px,196,'so no zoom or rotation.',14,C.ink,'start')+TF(px,230,'Single-touch screens needed',14,C.muted,'start')+TF(px,250,'buttons or double taps to zoom.',14,C.muted,'start')}
  return {svg:out,phase:two?`The two contacts moved, so the software solves for one transform that keeps both map points under the fingers: ×${fmt(sp)} zoom, ${tw}° turn, ${s.dx} px shift. Nothing is a button; the gesture is the geometry.`:'With one contact the only consistent change is a drag. Multi-touch matters because a second point adds distance and angle, which map naturally to zoom and rotation.'};
 }});

SCENE({id:'multi-touch-ftir',name:'Frustrated total internal reflection',tag:'Light that escapes at a fingertip',
 definition:'A way of sensing touches: light is trapped inside an acrylic sheet by total internal reflection until a fingertip touches the surface and scatters it out towards a camera.',
 example:'Jefferson Han’s 2005 table used infrared LEDs along the edges and a camera underneath; every touch became a bright blob, so ten fingers were as easy to see as one.',
 desc:'A side view of an acrylic sheet with light bouncing inside it; where fingers touch, light escapes downward to a camera, whose image shows one bright spot per finger.',
 research:'Han (2005). Low-cost multi-touch sensing through frustrated total internal reflection. UIST.',
 dur:10,hint:'Press places on the surface to add or lift fingers. Press harder to widen the contact and the blob.',
 init:()=>({touch:[0,0,1,0,0,1,0,0],press:1}),
 watch(p){const t=[0,0,0,0,0,0,0,0];if(p>.15)t[2]=1;if(p>.45)t[5]=1;if(p>.7)t[6]=1;return {touch:t,press:p>.85?2:1}},
 ui:[{choose:[[1,'Light touch'],[2,'Firm press']],label:'Pressure',get:s=>s.press,act:'press'},{b:'Lift all',act:'clear'}],
 on:{tap(s,i){s.touch[Number(i)]^=1},press(s,v){s.press=Number(v)},clear(s){s.touch=s.touch.map(()=>0)}},
 draw(s,f,X){
  const xs=range(8).map(i=>80+i*62),top=126,bot=152;let out=heading('Light stays trapped until a finger touches');
  out+=R(30,top,540,bot-top,'#dfeff7',C.blue,3)+T(565,118,'acrylic',13,C.blue,'end');
  for(const y of [top+4,bot-4])out+=R(14,y-4,14,8,C.coral,'none',2);
  out+=T(22,112,'LEDs',13,C.coral);
  let pts=[];for(let x=30,k=0;x<=570;x+=26,k++)pts.push(`${x},${k%2?top+2:bot-2}`);
  out+=`<polyline points="${pts.join(' ')}" fill="none" stroke="#e58c6b" stroke-width="1.6" opacity=".9"/>`;
  const cam=[200,300];
  xs.forEach((x,i)=>{const on=!!s.touch[i],w=s.press===2?22:15;
   if(on){out+=`<ellipse cx="${x}" cy="${top-16}" rx="${w}" ry="20" fill="#f3d6c4" stroke="#b07a5e" stroke-width="1.5"/>`+R(x-w*.8,top-3,w*1.6,4,'#b07a5e','none',2);
    for(const d of [-1,0,1])out+=L(x+d*w*.5,bot,cam[0]+d*4,cam[1]-12,'#e58c6b',1.4,'opacity=".75"')}
   out+=hit(X,'tap',i,`Surface spot ${i+1}: ${on?'touched':'not touched'}. Press to ${on?'lift':'touch'}.`,R(x-24,top-48,48,46,'transparent',on?'none':C.grid,8,on?'':'stroke-dasharray="3 4"'));
  });
  out+=R(cam[0]-22,cam[1]-12,44,30,C.dark,'none',5)+Ci(cam[0],cam[1]-12,8,'#536b78')+T(cam[0],cam[1]+36,'camera below',13,C.muted);
  out+=R(380,226,200,128,'#0f1b21','none',8)+T(480,244,'camera image',13,'#aac2cf');
  xs.forEach((x,i)=>{if(s.touch[i]){const bx=388+(x-30)/540*184;out+=Ci(bx,300,(s.press===2?11:7)+5,'#ffffff','none','opacity=".25"')+Ci(bx,300,s.press===2?11:7,'#ffffff')}});
  const n=sum(s.touch);out+=T(480,344,n?`${n} blob${n>1?'s':''}`:'dark: nothing escapes',13,'#d9e7ee');
  return {svg:out,phase:n?`Each fingertip breaks the reflection where it touches, so light leaks out there and the camera sees ${n} bright blob${n>1?'s':''}. Software only has to find bright spots, however many there are.`:'With nothing touching, every ray reflects off the inner surfaces and stays inside the sheet. The camera sees darkness.'};
 }});

const H7_CS={cols:8,rows:5,x0:84,y0:84,dx:42,dy:50};
function H7_capVal(f,c,r){return sum(f.map(([fx,fy])=>Math.exp(-((c-fx)**2+(r-fy)**2)/.6)))}
SCENE({id:'multi-touch-capacitive',name:'Capacitive grid sensing',tag:'Rows, columns and ghosts',
 definition:'Most modern touch screens sense the small change in electric charge where a finger comes near a grid of transparent row and column electrodes.',
 example:'Scanning every row–column crossing (mutual capacitance) finds each finger separately. Measuring only whole rows and columns (self capacitance) can be fooled by two fingers into reporting “ghost” touches.',
 desc:'A grid of row and column electrodes with fingers placed between them; a heat map of capacitance changes is filled in row by row, or row and column profiles show where ghosts appear.',
 research:['Lee, Buxton & Smith (1985). A multi-touch three dimensional touch-sensitive tablet. CHI.','Rekimoto (2002). SmartSkin: an infrastructure for freehand manipulation on interactive surfaces. CHI.'],
 dur:12,hint:'Press grid squares to place up to three fingers, choose how the grid is measured, then step through the scan.',
 init:()=>({fingers:[[1,1],[5,2]],mode:'mutual'}),
 ui:[{choose:[['mutual','Every crossing (mutual)'],['self','Rows and columns only (self)']],label:'Sensing',get:s=>s.mode,act:'mode'},{b:'Lift all',act:'clear'}],
 on:{cell(s,a){const [c,r]=String(a).split(',').map(Number),i=s.fingers.findIndex(([x,y])=>x===c&&y===r);if(i>=0)s.fingers.splice(i,1);else{if(s.fingers.length>=3)s.fingers.shift();s.fingers.push([c,r])}},mode(s,v){s.mode=v},clear(s){s.fingers=[]}},
 trace(s){const fr=[];if(s.mode==='mutual'){for(let r=0;r<=H7_CS.rows;r++)fr.push({rows:r});fr.push({rows:H7_CS.rows,done:true})}else{fr.push({stage:0},{stage:1},{stage:2})}return fr},
 draw(s,f,X){
  const G=H7_CS,fp=s.fingers.map(([c,r])=>[c+.5,r+.5]);let out=heading(s.mode==='mutual'?'Scan every crossing, one row at a time':'Measure each row and each column');
  const X0=G.x0,Y0=G.y0,ex=c=>X0+c*G.dx,ey=r=>Y0+r*G.dy;
  if(s.mode==='mutual'){for(let r=0;r<Math.min(f.rows,G.rows);r++)for(let c=0;c<G.cols;c++){const v=Math.min(1,H7_capVal(fp,c,r));if(v>.05)out+=Ci(ex(c),ey(r),6+12*v,C.coral,'none',`opacity="${fmt(.15+.75*v)}"`)}}
  for(let r=0;r<G.rows;r++)out+=L(ex(0)-14,ey(r),ex(G.cols-1)+14,ey(r),s.mode==='mutual'&&!f.done&&r===f.rows?C.amber:'#9db7c7',s.mode==='mutual'&&r===f.rows&&!f.done?4:2);
  for(let c=0;c<G.cols;c++)out+=L(ex(c),ey(0)-14,ex(c),ey(G.rows-1)+14,'#b8c9d4',2);
  for(let r=0;r<G.rows-1;r++)for(let c=0;c<G.cols-1;c++){const on=s.fingers.some(([x,y])=>x===c&&y===r);out+=hit(X,'cell',c+','+r,`Square ${c+1}, ${r+1}: ${on?'finger':'empty'}. Press to ${on?'lift':'place'} a finger.`,R(ex(c)+6,ey(r)+6,G.dx-12,G.dy-12,'transparent','none',6))+(on?Ci(ex(c)+G.dx/2,ey(r)+G.dy/2,13,'none',C.dark,'stroke-width="2.5"'):'')}
  const px=420;let say;
  if(s.mode==='mutual'){
   if(f.done){fp.forEach(([x,y])=>{let wx=0,wy=0,ws=0;for(let r=0;r<G.rows;r++)for(let c=0;c<G.cols;c++){const v=H7_capVal([[x,y]],c,r);wx+=v*c;wy+=v*r;ws+=v}out+=TB(ex(wx/ws)+G.dx*0+0,ey(wy/ws)+5,'+',22,C.blue)});
    say=`All crossings measured. Each finger is a separate hot spot, and a weighted average of nearby crossings places it between the wires, finer than the grid spacing.`}
   else say=f.rows<G.rows?`Driving row ${f.rows+1} and listening on every column: crossings near a finger lose some charge (coral).`:'All rows driven.';
   out+=TBF(px,96,'Mutual capacitance',15,C.ink,'start')+TF(px,122,`rows scanned: ${Math.min(f.rows,G.rows)} of ${G.rows}`,14,C.muted,'start')+TF(px,146,`fingers found: ${f.done?s.fingers.length:'…'}`,14,C.muted,'start')+TF(px,186,'Each crossing is measured',13,C.ink,'start')+TF(px,204,'on its own, so several',13,C.ink,'start')+TF(px,222,'fingers never get confused.',13,C.ink,'start');
  }else{
   const colV=range(G.cols).map(c=>sum(fp.map(([x])=>Math.exp(-((c-x)**2)/.6)))),rowV=range(G.rows).map(r=>sum(fp.map(([,y])=>Math.exp(-((r-y)**2)/.6))));
   if(f.stage>=0)colV.forEach((v,c)=>out+=R(ex(c)-7,ey(G.rows-1)+52-Math.min(1,v)*34,14,Math.min(1,v)*34,C.amber,'none',3));
   out+=T(ex(0)-20,ey(G.rows-1)+50,'cols',13,C.muted,'end');
   if(f.stage>=1)rowV.forEach((v,r)=>out+=R(X0-30-Math.min(1,v)*36,ey(r)-6,Math.min(1,v)*36,12,C.amber,'none',3));
   const xsF=[...new Set(fp.map(p=>p[0]))],ysF=[...new Set(fp.map(p=>p[1]))];let ghosts=0;
   if(f.stage>=2)for(const x of xsF)for(const y of ysF){const real=fp.some(p=>p[0]===x&&p[1]===y);if(!real)ghosts++;out+=Ci(X0+x*G.dx,Y0+y*G.dy,10,real?C.blue:'none',real?C.blue:C.coral,real?'':'stroke-width="2.5" stroke-dasharray="3 3"')}
   out+=TBF(px,96,'Self capacitance',15,C.ink,'start')+TF(px,122,f.stage<1?'reading columns…':f.stage<2?'reading rows…':'combining',14,C.muted,'start');
   if(f.stage>=2)out+=TBF(px,152,`${xsF.length*ysF.length} candidate${xsF.length*ysF.length>1?'s':''}, ${ghosts} ghost${ghosts===1?'':'s'}`,14,ghosts?C.coral:C.green,'start');
   out+=TF(px,186,'Profiles say which columns',13,C.ink,'start')+TF(px,204,'and rows are touched, but',13,C.ink,'start')+TF(px,222,'not which pairs belong together.',13,C.ink,'start');
   say=f.stage<2?'Each whole column, then each whole row, reports how much its charge changed.':ghosts?`Two fingers in different rows and columns light two columns and two rows, which cross in four places. ${ghosts} of the candidates are ghosts: the profiles cannot tell real touches from false ones.`:'With these finger positions every candidate is real, so self capacitance gets away with it. Try two fingers on a diagonal.';
  }
  return {svg:out,phase:say};
 }});

/* ---------- Lesson: touch-targets ---------- */
const H7_MM=13;
function H7_hitProb(wmm,sigma=1.9){const p=H7_erf(wmm/(2*Math.SQRT2*sigma));return p*p}
SCENE({id:'touch-targets',name:'Touch target size',tag:'The fat-finger problem',
 definition:'How large a button must be to be hit reliably with a finger. Touches scatter around the aimed point, and the finger hides what it is pressing.',
 example:'In a study of one-handed thumb use, Parhi, Karlson and Bederson found error rates levelled off for targets of about 9.2–9.6 mm. Platform guidelines settle on roughly 7–10 mm (44 points or 48 density-independent pixels).',
 desc:'A target drawn at true scale with twenty taps scattered around its centre, beside a curve of the hit rate against target size with the recommended range marked.',
 research:['Parhi, Karlson & Bederson (2006). Target size study for one-handed thumb use on small touchscreen devices. MobileHCI.','Vogel & Baudisch (2007). Shift: a technique for operating pen-based interfaces using touch. CHI.'],
 dur:11,hint:'Change the target size and take a new set of taps. Watch the misses fall away as the target grows past about 9 mm.',
 init:()=>({size:6,seed:5}),
 watch(p){return {size:Math.round((3+9*smooth(p))*2)/2,seed:5}},
 ui:[{range:'size',label:'Target size (mm)',min:2,max:14,step:.5,get:s=>s.size,act:'size'},{b:'New set of taps',act:'retap'}],
 on:{size(s,v){s.size=v},retap(s){s.seed=nextSeed()}},
 draw(s){
  const cx=165,cy=205,w=s.size*H7_MM,r=rng(s.seed),sig=1.9*H7_MM;let out=heading('Taps scatter; bigger targets catch them');
  out+=R(30,60,270,290,'#fff',C.grid,10)+T(165,80,'true scale on a 13 px = 1 mm grid',13,C.muted);
  for(let g=0;g<=20;g++){const x=35+g*H7_MM;if(x<297)out+=L(x,88,x,346,'#eef3f6',1)}
  out+=R(cx-w/2,cy-w/2,w,w,C.pale,C.blue,6);let hits=0;
  for(let i=0;i<20;i++){const x=cx+H7_gauss(r)*sig,y=cy+H7_gauss(r)*sig,ok=Math.abs(x-cx)<=w/2&&Math.abs(y-cy)<=w/2;if(ok)hits++;out+=Ci(clamp(x,34,296),clamp(y,92,344),4.5,ok?C.green:C.coral)}
  out+=`<ellipse cx="${cx+60}" cy="${cy+92}" rx="${5*H7_MM}" ry="${6*H7_MM*.75}" fill="#f3d6c4" opacity=".55"/>`+T(cx+60,cy+96,'finger pad ≈ 10 mm',13,'#8a5a3e');
  const gx=340,gy=100,gw=230,gh=190,xm=v=>gx+(v-2)/14*gw,ym=v=>gy+gh-v*gh;
  out+=R(xm(9.2),gy,xm(9.6)-xm(9.2)+8,gh,C.greenp,'none',3)+TF(xm(9.2)-6,gy+gh-14,'Parhi et al.: 9.2–9.6 mm',13,C.green,'end');
  out+=L(gx,gy+gh,gx+gw,gy+gh,C.line,2)+L(gx,gy,gx,gy+gh,C.line,2);
  let d='';for(let v=2;v<=16;v+=.25)d+=(v===2?'M':'L')+fmt(xm(v))+' '+fmt(ym(H7_hitProb(v)));
  out+=P(d,C.blue,3);
  for(const v of [2,6,10,14])out+=T(xm(v),gy+gh+18,v,13,C.muted);out+=T(gx+gw/2,gy+gh+38,'target size (mm)',13,C.muted);
  for(const v of [0,.5,1])out+=T(gx-6,ym(v)+4,Math.round(v*100)+'%',13,C.muted,'end');
  out+=Ci(xm(s.size),ym(H7_hitProb(s.size)),7,C.coral)+T(xm(s.size)+(s.size>11?-10:10),ym(H7_hitProb(s.size))+(s.size>11?24:-10),Math.round(H7_hitProb(s.size)*100)+'%',14,C.coral,s.size>11?'end':'start','font-weight="700"');
  out+=TB(160,372,`${hits} of 20 taps hit`,15,hits>=19?C.green:hits>=14?C.amber:C.coral)+T(455,372,'model: taps spread ≈ 2 mm',13,C.muted);
  return {svg:out,phase:`At ${s.size} mm, ${hits} of these 20 taps land inside. The curve is an illustrative model of touch scatter, not the study’s data, but it has the same shape: steep below about 7 mm, nearly flat beyond 9–10 mm, where extra size costs screen space but buys little.`};
 }});

SCENE({id:'touch-targets-thumb',name:'Thumb reach',tag:'Where one hand can tap',
 definition:'Holding a phone in one hand, the thumb sweeps an arc from its base: the middle of the arc is easy to reach, while the far corner and the area right next to the thumb are awkward.',
 example:'Watching people in streets and stations, Hoober recorded that many held their phone in one hand. Larger phones push more of the screen out of comfortable reach.',
 desc:'A phone outline coloured into easy, possible and hard zones for the thumb of the holding hand; buttons can be placed to see which zone they fall in.',
 research:['Hoober (2013). How do users really hold mobile devices? UXmatters.','Bergstrom-Lehtovirta & Oulasvirta (2014). Modeling the functional area of the thumb on mobile touchscreen surfaces. CHI.'],
 dur:10,hint:'Choose the hand and the phone size, then press a square to place your most important button and see how reachable it is.',
 init:()=>({hand:'right',big:0,placed:'1,1'}),
 watch(p){return {hand:p<.5?'right':'left',big:(p>.25&&p<.5)||p>.75?1:0,placed:null}},
 ui:[{choose:[['right','Right hand'],['left','Left hand']],label:'Hand',get:s=>s.hand,act:'hand'},{choose:[[0,'Small phone'],[1,'Large phone']],label:'Phone',get:s=>s.big,act:'big'}],
 on:{hand(s,v){s.hand=v},big(s,v){s.big=Number(v)},place(s,a){s.placed=a}},
 draw(s,f,X){
  const w=s.big?190:150,h=s.big?320:270,x=80+(190-w)/2,y=50+(320-h)/2,cols=4,rows=7,sx=x+12,sy=y+28,cw=(w-24)/cols,ch=(h-56)/rows;
  const px=s.hand==='right'?x+w+14:x-14,py=y+h-18,Rr=225;let out=heading('The thumb sweeps an arc');
  out+=H7_phone(x,y,w,h);const zone=d=>d>=.38*Rr&&d<=.86*Rr?0:d>=.25*Rr&&d<=1.0*Rr?1:2,zc=['#cdebdc','#fbefd5','#f6d4c8'],zn=['easy','possible','hard'];
  let counts=[0,0,0],placedZone=null;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const cx=sx+c*cw+cw/2,cy=sy+r*ch+ch/2,z=zone(Math.hypot(cx-px,cy-py));counts[z]++;const key=c+','+r,on=s.placed===key;if(on)placedZone=z;
   out+=hit(X,'place',key,`Square ${c+1}, ${r+1}: ${zn[z]} to reach. Press to place the main button here.`,R(sx+c*cw+2,sy+r*ch+2,cw-4,ch-4,zc[z],on?C.dark:'none',5))+(on?TB(cx,cy+5,'Buy',13,C.dark):'')}
  const ang=s.hand==='right'?[180,270]:[270,360],arc=k=>{const a0=ang[0]*Math.PI/180,a1=ang[1]*Math.PI/180;return `M${fmt(px+k*Math.cos(a0))} ${fmt(py+k*Math.sin(a0))} A${k} ${k} 0 0 1 ${fmt(px+k*Math.cos(a1))} ${fmt(py+k*Math.sin(a1))}`};
  out+=P(arc(.62*Rr),'#b07a5e',2,'none','stroke-dasharray="6 5" opacity=".7"')+Ci(px,py,10,'#f3d6c4','#b07a5e');
  const tx=360;out+=TBF(tx,90,(s.big?'Large':'Small')+' phone, '+s.hand+' hand',15,C.ink,'start');
  [['easy',0,C.green],['possible',1,C.amber],['hard',2,C.coral]].forEach(([n,z,col],i)=>out+=R(tx,112+i*30,18,18,zc[z],col,4)+TF(tx+28,126+i*30,`${n}: ${Math.round(100*counts[z]/(rows*cols))}% of the screen`,14,C.ink,'start'));
  if(placedZone!==null)out+=TBF(tx,232,`Your button is ${zn[placedZone]} to reach`,15,[C.green,C.amber,C.coral][placedZone],'start');
  out+=TF(tx,268,'Zones are an illustrative model:',13,C.muted,'start')+TF(tx,286,'an arc around the thumb’s base.',13,C.muted,'start');
  return {svg:out,phase:`The thumb pivots near the ${s.hand==='right'?'bottom-right':'bottom-left'} corner. ${s.big?'On the larger phone the far top corner is well beyond the arc, so':'Even on a small phone'} the top ${s.hand==='right'?'left':'right'} corner is the hardest place for a frequent action; navigation placed at the bottom is easier to reach.`};
 }});

SCENE({id:'touch-targets-offset',name:'Perceived input point',tag:'Where you think you touched',
 definition:'Touches land slightly away from where people aim, by an amount that depends on how the finger is tilted; the finger also hides the target at the moment of touch.',
 example:'Holz and Baudisch showed that the offset is systematic, not random: knowing a person’s finger angle (or even their fingerprint) and correcting for it roughly halved touch error. Shift, by Vogel and Baudisch, shows the hidden area in a callout above the finger.',
 desc:'A crosshair target with twelve tap points shifted below it; correcting for the offset recentres them, and a callout can show what is under the finger.',
 research:['Holz & Baudisch (2010). The generalized perceived input point model and how to double touch accuracy by extracting fingerprints. CHI.','Vogel & Baudisch (2007). Shift: a technique for operating pen-based interfaces using touch. CHI.'],
 dur:11,hint:'Tilt the finger and choose a fix. Correction moves the taps back onto the crosshair; the callout shows what the finger hides.',
 init:()=>({pitch:35,fix:'none'}),
 watch(p){return {pitch:p<.5?Math.round(lerp(80,20,smooth(p*2))):20,fix:p<.5?'none':p<.78?'correct':'callout'}},
 ui:[{range:'pitch',label:'Finger tilt',min:15,max:90,step:5,get:s=>s.pitch,act:'pitch',show:v=>v+'°'},{choose:[['none','No fix'],['correct','Correct the offset'],['callout','Show a callout']],label:'Fix',get:s=>s.fix,act:'fix'}],
 on:{pitch(s,v){s.pitch=v},fix(s,v){s.fix=v}},
 draw(s){
  const cx=170,cy=180,mm=12,off=(1.2+3*Math.cos(s.pitch*Math.PI/180))*mm,cor=s.fix==='correct',r=rng(9);let out=heading('Touches land below the aimed point');
  out+=R(30,56,280,300,'#fff',C.grid,10);
  out+=L(cx-22,cy,cx+22,cy,C.blue,2)+L(cx,cy-22,cx,cy+22,C.blue,2)+Ci(cx,cy,9,'none',C.blue);
  let errs=0;const pts=range(12).map(()=>{const x=cx+H7_gauss(r)*1.1*mm,y=cy+(cor?0:off)+H7_gauss(r)*1.1*mm;errs+=Math.hypot(x-cx,y-cy)/mm;return [x,y]});
  pts.forEach(([x,y])=>out+=Ci(x,y,4.5,cor?C.green:C.coral));
  out+=`<ellipse cx="${cx+8}" cy="${cy+off+36}" rx="${4.5*mm}" ry="${5.5*mm}" fill="#f3d6c4" opacity="${s.fix==='callout'?.85:.45}"/>`;
  if(!cor)out+=arrow(cx+32,cy,cx+32,cy+off,C.coral,2,7)+T(cx+40,cy+off/2+5,fmt(off/mm)+' mm',13,C.coral,'start');
  if(s.fix==='callout'){out+=R(cx-48,72,96,64,'#fff',C.dark,10)+L(cx-14,98,cx+14,98,C.blue,2)+L(cx,84,cx,112,C.blue,2)+Ci(cx,98,6,'none',C.blue)+Ci(cx,98+off*.4,4,C.coral)+P(`M${cx-6} 136 L${cx} 148 L${cx+6} 136`,C.dark,2,'#fff')+T(cx,160,'callout above the finger',13,C.muted)}
  const tx=335;out+=TBF(tx,90,'Mean miss',15,C.ink,'start')+TBF(tx,118,fmt(errs/12)+' mm',22,cor?C.green:C.coral,'start');
  out+=TF(tx,150,s.fix==='correct'?'Offset known and subtracted.':s.fix==='callout'?'You can see and adjust.':'Every tap lands low.',14,C.ink,'start');
  const bx=420,by=320;out+=L(bx-40,by,bx+120,by,C.dark,3)+T(bx+40,by+20,'side view of the finger',13,C.muted);
  const a=s.pitch*Math.PI/180,len=90;out+=L(bx,by-6,bx+len*Math.cos(a),by-6-len*Math.sin(a),'#d4a68b',18)+T(bx+len*Math.cos(a)+8,by-6-len*Math.sin(a),s.pitch+'°',14,C.ink,'start');
  return {svg:out,phase:s.fix==='correct'?'Because the offset is systematic, subtracting it recentres the taps: what remains is the much smaller random scatter. That is how Holz and Baudisch roughly doubled accuracy.':s.fix==='callout'?'The finger still hides the target, so Shift copies the hidden area into a callout above the finger. People can then slide to the right spot before lifting.':`At a ${s.pitch}° tilt the contact centre sits about ${fmt(off/mm)} mm below where people aim. Flatter fingers push it further. (Offsets here are an illustrative model.)`};
 }});

/* ---------- Lesson: gestures ---------- */
const H7_ROWS=['Lunch on Friday?','Your parcel is on its way','Notes from the meeting','Photos from the trip','Reminder: dentist'];
SCENE({id:'gestures',name:'Gesture discoverability',tag:'Invisible actions',
 definition:'Gestures such as swipes leave nothing on screen to show they exist, so people can only use them if they already know, are told, or are given a visible hint.',
 example:'Swiping a message sideways to delete it is quick once known, but nothing on the screen announces it. Norman and Nielsen argued that many gestural interfaces gave up visibility and consistency for elegance.',
 desc:'A generic message list where the delete action is either hidden behind a swipe, shown as a visible button, or hinted at by a row that briefly peeks open.',
 research:'Norman & Nielsen (2010). Gestural interfaces: a step backward in usability. ACM Interactions.',
 dur:11,hint:'Task: delete “Notes from the meeting”. Try tapping rows. In the hidden design, nothing tells you about the swipe; switch designs to compare.',
 init:()=>({design:'hidden',tries:0,done:false,open:-1}),
 watch(p){const design=p<.55?'hidden':p<.8?'hint':'visible';return {design,tries:p<.55?Math.floor(p*9):0,done:p>.45&&p<.55||p>.92,open:p>.45&&p<.55?2:-1}},
 ui:[{choose:[['hidden','Hidden swipe'],['hint','Swipe with a hint'],['visible','Visible button']],label:'Design',get:s=>s.design,act:'design'},{b:'Swipe the row left',act:'swipe'}],
 on:{design(s,v){s.design=v;s.tries=0;s.done=false;s.open=-1},tap(s){s.tries++},bin(s,i){if(Number(i)===2){s.done=true}else s.tries++},swipe(s){s.open=2;s.done=true}},
 draw(s,f,X){
  let out=heading('Delete “Notes from the meeting”');out+=H7_phone(40,46,260,320);
  H7_ROWS.forEach((t,i)=>{const y=74+i*54,open=s.open===i,peek=s.design==='hint'&&i===0&&!s.done,shift=open?-70:peek?-24:0;
   if(open||peek)out+=R(232,y,72,48,C.coral,'none',0)+T(268,y+29,'Delete',13,'#fff','middle','font-weight="700"');
   const row=R(48+shift,y,244,48,(s.done&&i===2)?C.greenp:'#fff',C.grid,0)+TF(60+shift,y+22,t,14,C.ink,'start')+TF(60+shift,y+40,'Sam · 09:4'+i,13,C.muted,'start');
   out+=hit(X,'tap',i,`Message: ${t}. Tap.`,row);
   if(s.design==='visible')out+=hit(X,'bin',i,`Delete ${t}`,R(254,y+11,28,26,'#fff',C.coral,6)+T(268,y+29,'✕',14,C.coral,'middle','font-weight="700"'));
  });
  const tx=330;out+=TBF(tx,92,{hidden:'Hidden swipe',hint:'Swipe with a hint',visible:'Visible button'}[s.design],16,C.ink,'start');
  out+=counter(tx,110,'taps that did nothing',s.tries,s.tries?C.coral:C.muted,170)+counter(tx,166,'task done',s.done?'yes':'not yet',s.done?C.green:C.muted,170);
  const lines={hidden:['Nothing on screen shows that','a swipe exists. People who','don’t already know are stuck.'],hint:['The first row peeks open once,','a signifier that rows slide.','The gesture is now learnable.'],visible:['Every action is on screen.','Slower for experts, but nobody','has to guess.']}[s.design];
  lines.forEach((l,i)=>out+=TF(tx,250+i*20,l,14,C.ink,'start'));
  return {svg:out,phase:s.done?'Done. In the hidden design you only succeed by knowing (or being told) the swipe; a visible button or a hint makes the same action discoverable.':s.tries?`${s.tries} tap${s.tries>1?'s':''} and nothing: tapping opens messages, and the delete gesture leaves no visible trace.`:'Gestures are fast but invisible. Discoverability depends on signifiers: something on the screen that suggests what is possible.'};
 }});

SCENE({id:'gestures-conflict',name:'Gesture conflicts',tag:'Swipe or scroll?',
 definition:'When two gestures start the same way, such as a sideways swipe inside a page that scrolls up and down, the system must guess from the first movement, and some strokes will be misread.',
 example:'A carousel inside a scrolling page reads mostly-sideways strokes as swipes and mostly-vertical ones as scrolls. Wherever the cut-off angle is placed, some slanted strokes land on the wrong side.',
 desc:'A dial of stroke angles split into a swipe sector and a scroll sector by a threshold, with two bell curves of how people’s intended swipes and scrolls are spread, and the error rate for the chosen threshold.',
 research:['Hinckley & Wigdor (2012). Input technologies and techniques. In The Human–Computer Interaction Handbook (3rd ed.).','Norman & Nielsen (2010). Gestural interfaces: a step backward in usability. ACM Interactions.'],
 dur:11,hint:'Move the threshold that separates swipes from scrolls, and draw a stroke at any angle to see how it is read.',
 init:()=>({th:40,stroke:30}),
 watch(p){return {th:Math.round(lerp(15,70,smooth(p))),stroke:35}},
 ui:[{range:'th',label:'Threshold',min:10,max:80,step:1,get:s=>s.th,act:'th',show:v=>v+'°'},{range:'stroke',label:'Your stroke',min:0,max:90,step:1,get:s=>s.stroke,act:'stroke',show:v=>v+'°'}],
 on:{th(s,v){s.th=v},stroke(s,v){s.stroke=v}},
 draw(s){
  const eSwipe=2*(1-H7_Phi(s.th/20)),eScroll=2*H7_Phi((s.th-90)/24);let out=heading('The first movement decides');
  const ox=60,oy=320,Rr=220;
  const sector=(a0,a1,col)=>{const r0=a0*Math.PI/180,r1=a1*Math.PI/180;return P(`M${ox} ${oy} L${fmt(ox+Rr*Math.cos(r0))} ${fmt(oy-Rr*Math.sin(r0))} A${Rr} ${Rr} 0 0 0 ${fmt(ox+Rr*Math.cos(r1))} ${fmt(oy-Rr*Math.sin(r1))} Z`,'none',0,col)};
  out+=sector(0,s.th,'#dcebf7')+sector(s.th,90,'#e9e2f6');
  const a=s.stroke*Math.PI/180;out+=arrow(ox,oy,ox+180*Math.cos(a),oy-180*Math.sin(a),s.stroke<s.th?C.blue:C.purple,4,12);
  const t=s.th*Math.PI/180;out+=L(ox,oy,ox+Rr*Math.cos(t),oy-Rr*Math.sin(t),C.dark,2,'stroke-dasharray="6 5"');
  out+=TB(ox+150,oy-18,'swipe',15,C.blue)+TB(ox+30,oy-170,'scroll',15,C.purple);
  for(const g of [0,30,60,90])out+=T(ox+(Rr+14)*Math.cos(g*Math.PI/180),oy-(Rr+14)*Math.sin(g*Math.PI/180)+5,g+'°',13,C.muted);
  const gx=330,gy=80,gw=250,gh=110,xm=d=>gx+d/90*gw;
  let d1='',d2='';for(let d=0;d<=90;d+=2){const y1=Math.exp(-(d*d)/(2*20*20)),y2=Math.exp(-((d-90)**2)/(2*24*24));d1+=(d?'L':'M')+fmt(xm(d))+' '+fmt(gy+gh-y1*gh*.9);d2+=(d?'L':'M')+fmt(xm(d))+' '+fmt(gy+gh-y2*gh*.9)}
  out+=L(gx,gy+gh,gx+gw,gy+gh,C.line,2)+P(d1,C.blue,2.5)+P(d2,C.purple,2.5)+L(xm(s.th),gy,xm(s.th),gy+gh,C.dark,2,'stroke-dasharray="5 4"');
  out+=T(gx,gy+gh+18,'0° sideways',13,C.muted,'start')+T(gx+gw,gy+gh+18,'90° vertical',13,C.muted,'end');
  out+=TF(gx+4,gy+6,'intended swipes',13,C.blue,'start')+TF(gx+gw-4,gy+6,'intended scrolls',13,C.purple,'end');
  out+=TB(gx,250,`Swipes read as scrolls: ${Math.round(eSwipe*100)}%`,14,C.blue,'start')+TB(gx,276,`Scrolls read as swipes: ${Math.round(eScroll*100)}%`,14,C.purple,'start');
  out+=TF(gx,308,`Your ${s.stroke}° stroke is read as a ${s.stroke<s.th?'swipe':'scroll'}.`,14,C.ink,'start')+T(gx,336,'Spreads are illustrative.',13,C.muted,'start');
  return {svg:out,phase:`The two kinds of stroke overlap at slanted angles. A threshold of ${s.th}° trades one error for the other: lower it and slanted swipes become scrolls; raise it and slanted scrolls become swipes. Designers soften this by waiting for a little more movement, or by not nesting the two gestures at all.`};
 }});

const H7_REFS=[{name:'Delete',props:['Drag to a bin','Flick off the edge','Draw an X','Press and hold'],counts:[9,6,3,2]},{name:'Zoom in',props:['Spread two fingers','Double tap','Draw a circle','Press and hold'],counts:[16,2,1,1]},{name:'Undo',props:['Scratch out','Swipe left','Two-finger tap','Shake the device'],counts:[5,5,5,5]}];
SCENE({id:'gestures-agreement',name:'User-defined gestures',tag:'Asking people first',
 definition:'An elicitation study shows people the effect of a command and asks them to invent the gesture. The agreement score measures how much they converge on the same proposal.',
 example:'Wobbrock, Morris and Wilson asked people to propose gestures for tabletop commands. Where agreement was high, the most popular proposal was adopted; where it was low, no gesture was obvious and a visible control may be the better choice.',
 desc:'Bars of how many of twenty participants proposed each gesture for a command, with the agreement score computed as the sum of squared shares.',
 research:['Wobbrock, Morris & Wilson (2009). User-defined gestures for surface computing. CHI.','Wobbrock, Aung, Rothrock & Myers (2005). Maximizing the guessability of symbolic input. CHI EA.'],
 dur:12,hint:'Pick a command and press + or − to change how many people proposed each gesture. The counts are examples, not the study’s data.',
 init:()=>({ref:0,counts:H7_REFS.map(r=>r.counts.slice())}),
 watch(p){const i=Math.min(2,Math.floor(p*3));return {ref:i,counts:H7_REFS.map(r=>r.counts.slice())}},
 ui:[{choose:H7_REFS.map((r,i)=>[i,r.name]),label:'Command',get:s=>s.ref,act:'ref'}],
 on:{ref(s,v){s.ref=Number(v)},inc(s,j){const c=s.counts[s.ref];c[Number(j)]=Math.min(30,c[Number(j)]+1)},dec(s,j){const c=s.counts[s.ref];c[Number(j)]=Math.max(0,c[Number(j)]-1)}},
 draw(s,f,X){
  const ref=H7_REFS[s.ref],c=s.counts[s.ref],n=sum(c)||1,A=sum(c.map(v=>(v/n)**2)),best=c.indexOf(Math.max(...c));let out=heading(`Command: “${ref.name}”`);
  ref.props.forEach((p,j)=>{const y=70+j*56,w=c[j]/n*250;out+=T(30,y+16,p,14,C.ink,'start')+R(30,y+24,250,20,'#eef3f6','none',4)+R(30,y+24,w,20,j===best?C.blue:'#9db7c7','none',4)+T(290,y+40,`${c[j]} / ${n}`,13,C.muted,'start');
   out+=hit(X,'dec',j,`Fewer people proposed ${p}`,R(352,y+20,30,28,'#fff',C.line,6)+TB(367,y+39,'−',16,C.ink))+hit(X,'inc',j,`More people proposed ${p}`,R(388,y+20,30,28,'#fff',C.line,6)+TB(403,y+39,'+',16,C.ink))});
  out+=R(440,70,145,150,'#fff',C.grid,10)+T(512,94,'agreement',13,C.muted)+TB(512,130,fmt(A),28,A>.3?C.green:A>.15?C.amber:C.coral)+T(512,160,A>.3?'strong':A>.15?'moderate':'weak',14,C.ink)+T(512,192,`(${Math.round(A*100)}% chance two`,13,C.muted)+T(512,208,'people agree)',13,C.muted);
  out+=T(30,312,'A = Σ (share of each proposal)²',15,C.ink,'start')+TM(30,338,c.map(v=>`(${v}/${n})²`).join(' + ')+' = '+fmt(A),13,C.muted,'start');
  return {svg:out,phase:A>.3?`Most people converge on “${ref.props[best]}”, so it is a natural choice for “${ref.name}”.`:`Proposals are spread out (agreement ${fmt(A)}), so no gesture is obvious for “${ref.name}”. A visible button or menu item is the safer design.`};
 }});

/* ---------- Lesson: interruptions ---------- */
SCENE({id:'interruptions',name:'Interruptions',tag:'The cost of a notification',
 definition:'An interruption costs more than the time spent on it: afterwards there is a resumption lag while you recall where you were, and it is longer when the break comes in the middle of a subtask.',
 example:'Altmann and Trafton explained the lag as rebuilding a goal in memory. Adamczyk and Bailey found interruptions at task boundaries were less disruptive than those in the middle. Mark, Gudith and Klocke found people compensate by working faster, at the price of more stress.',
 desc:'A thirty-minute timeline of a writing task: a notification arrives, the person switches, returns, and spends a resumption lag before getting back to full speed.',
 research:['Altmann & Trafton (2002). Memory for goals: an activation-based model. Cognitive Science.','Adamczyk & Bailey (2004). If not now, when? The effects of interruption at different moments within task execution. CHI.','Mark, Gudith & Klocke (2008). The cost of interrupted work: more speed and stress. CHI.'],
 dur:12,hint:'Change how long the interruption lasts and whether it arrives mid-sentence or at a natural break. Compare the time lost.',
 init:()=>({len:4,when:'mid',cursor:30}),
 watch(p){return {len:4,when:p<.6?'mid':'boundary',cursor:Math.min(30,p<.6?p/.6*30:30)}},
 ui:[{range:'len',label:'Interruption (min)',min:1,max:12,step:1,get:s=>s.len,act:'len'},{choose:[['mid','Mid-subtask'],['boundary','At a break']],label:'When',get:s=>s.when,act:'when'}],
 on:{len(s,v){s.len=v},when(s,v){s.when=v}},
 draw(s){
  const T0=10,lag=s.when==='mid'?.8+.35*Math.min(s.len,8):.4,x0=50,W=500,xm=t=>x0+t/30*W,y=150;let out=heading('A notification arrives at minute 10');
  const seg=(a,b,col,lab)=>{if(b<=a)return '';const r=R(xm(a),y,xm(b)-xm(a),44,col,'none',4);return r+(xm(b)-xm(a)>lab.length*8+10?T((xm(a)+xm(b))/2,y+27,lab,13,'#fff','middle','font-weight="650"'):'')};
  const c=s.cursor===undefined?30:s.cursor,cl=v=>Math.min(v,c);
  out+=R(x0,y,W,44,'#eef3f6','none',4);
  out+=seg(0,cl(T0),C.blue,'writing')+seg(T0,cl(T0+s.len),C.coral,'message')+seg(T0+s.len,cl(T0+s.len+lag),C.amber,'resume')+seg(T0+s.len+lag,cl(30),C.blue,'writing');
  if(c>=T0){out+=R(xm(T0)-58,y-74,116,40,'#fff',C.dark,10)+T(xm(T0),y-49,'New message',13,C.ink)+L(xm(T0),y-34,xm(T0),y,C.dark,1.5)}
  if(c>=T0+s.len&&lag>.05)out+=T(xm(T0+s.len+lag/2),y+66,`lag ${fmt(lag)} min`,13,C.amber);
  for(let t=0;t<=30;t+=5)out+=T(xm(t),y+86,t+' min',13,C.muted);
  if(s.cursor!==undefined&&s.cursor<30)out+=L(xm(c),y-8,xm(c),y+52,C.dark,2);
  const lost=s.len+lag;out+=counter(60,276,'away',s.len+' min',C.coral,140)+counter(220,276,'resumption lag',fmt(lag)+' min',C.amber,140)+counter(380,276,'total cost',fmt(lost)+' min',C.ink,140);
  out+=T(300,350,'Lag lengths are illustrative; the pattern follows the studies.',13,C.muted);
  return {svg:out,phase:s.when==='mid'?`Interrupted mid-sentence, you must rebuild what you were about to write: the lag grows with the length of the break (here ${fmt(lag)} min). Total cost ${fmt(lost)} min for a ${s.len}-minute message.`:`At a natural break little is held in mind, so resuming takes only ${fmt(lag)} min. Timing matters as much as length.`};
 }});

function H7_day(n,mode){const r=rng(17),arr=range(n).map(()=>Math.floor(r()*470)+5).sort((a,b)=>a-b);const deliver=mode==='immediate'?arr.slice():mode==='batched'?[120,300,450].filter(t=>arr.some(a=>a<=t)):[];return {arr,deliver}}
SCENE({id:'interruptions-batching',name:'Batching notifications',tag:'Fewer, scheduled breaks',
 definition:'Instead of delivering every notification at once, a device can hold them and deliver them together a few times a day, or not at all during focused time.',
 example:'In a field experiment, Fitz and colleagues found that people whose phone notifications were batched three times a day reported feeling more attentive and productive than those who received them as they arrived.',
 desc:'A working day from 9 to 5 with notification arrivals along the top and deliveries along the bottom; green blocks show uninterrupted focus periods of at least 25 minutes.',
 research:['Fitz, Kushlev, Jagannathan, Lewis, Paliwal & Ariely (2019). Batching smartphone notifications can improve well-being. Computers in Human Behavior.','Iqbal & Horvitz (2007). Disruption and recovery of computing tasks: field study, analysis, and directions. CHI.'],
 dur:11,hint:'Choose a delivery policy and how many notifications arrive in a day. Count the long stretches left for focused work.',
 init:()=>({mode:'immediate',n:40}),
 watch(p){return {mode:p<.4?'immediate':p<.75?'batched':'dnd',n:40}},
 ui:[{choose:[['immediate','As they arrive'],['batched','Three batches'],['dnd','Do not disturb']],label:'Policy',get:s=>s.mode,act:'mode'},{range:'n',label:'Per day',min:5,max:80,step:5,get:s=>s.n,act:'n'}],
 on:{mode(s,v){s.mode=v},n(s,v){s.n=v}},
 draw(s){
  const {arr,deliver}=H7_day(s.n,s.mode),x0=40,W=520,xm=t=>x0+t/480*W;let out=heading('A working day, 9:00 to 17:00');
  out+=T(x0,74,'arrive',13,C.muted,'start');arr.forEach(t=>out+=L(xm(t),82,xm(t),96,C.muted,1.5));
  const breaks=deliver.map(t=>[t,t+(s.mode==='immediate'?2:6)]);let blocks=[],cur=0;for(const [a,b] of breaks){if(a-cur>=25)blocks.push([cur,a]);cur=Math.max(cur,b)}if(480-cur>=25)blocks.push([cur,480]);
  out+=R(x0,120,W,50,'#eef3f6','none',4);blocks.forEach(([a,b])=>out+=R(xm(a),120,xm(b)-xm(a),50,C.greenp,C.green,3));
  breaks.forEach(([a,b])=>out+=R(xm(a),116,Math.max(3,xm(b)-xm(a)),58,C.coral,'none',2));
  out+=T(x0,200,'deliveries',13,C.muted,'start');
  for(let h=0;h<=8;h++)out+=T(xm(h*60),222,(9+h)+':00',13,C.muted);
  const longest=Math.max(0,...blocks.map(([a,b])=>b-a));
  out+=counter(50,250,'times focus broken',deliver.length,C.coral,150)+counter(220,250,'focus blocks ≥ 25 min',blocks.length,C.green,160)+counter(400,250,'longest block',Math.round(longest)+' min',C.blue,150);
  out+=T(300,334,s.mode==='dnd'?'Everything waits until 17:00: urgent messages wait too.':s.mode==='batched'?'Delivered at 11:00, 14:00 and 16:30.':'Every arrival interrupts at once.',14,C.ink);
  return {svg:out,phase:s.mode==='immediate'?`${s.n} notifications break the day into fragments; the longest uninterrupted stretch is ${Math.round(longest)} minutes.`:s.mode==='batched'?`The same ${s.n} messages arrive, but only three deliveries break the day, leaving ${blocks.length} long blocks for focused work.`:'No deliveries at all during the day maximises focus, at the risk of missing something urgent; real systems let chosen contacts through.'};
 }});

SCENE({id:'interruptions-residue',name:'Attention residue',tag:'The unfinished task lingers',
 definition:'After switching away from an unfinished task, part of your attention stays with it, and performance on the next task suffers.',
 example:'Leroy found that people who left a task unfinished did worse on the next one. A later study found that writing a quick “ready-to-resume” plan before switching reduced the effect.',
 desc:'Two task cards, A and B; bars over five moments show how much attention stays on unfinished task A while working on B, under three ways of switching.',
 research:['Leroy (2009). Why is it so hard to do my work? The challenge of attention residue when switching between work tasks. Organizational Behavior and Human Decision Processes.','Leroy & Glomb (2018). Tasks interrupted: how anticipating time pressure on resumption of an interrupted task causes attention residue and low performance on interrupting tasks and how a “ready-to-resume” plan mitigates the effects. Organization Science.'],
 dur:10,hint:'Choose how you leave task A before starting task B, and compare how much of your mind is free for B.',
 init:()=>({mode:'unfinished'}),
 watch(p){return {mode:p<.4?'unfinished':p<.7?'plan':'finished'}},
 ui:[{choose:[['unfinished','Leave A unfinished'],['plan','Write a ready-to-resume plan'],['finished','Finish A first']],label:'Switch',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v}},
 draw(s){
  const start={unfinished:.42,plan:.16,finished:.1}[s.mode],decay={unfinished:.85,plan:.6,finished:.5}[s.mode];let out=heading('How much of your mind is on task B?');
  out+=R(40,60,150,70,'#fff',C.purple,10)+TB(115,88,'Task A',15,C.purple)+T(115,112,s.mode==='finished'?'done ✓':s.mode==='plan'?'paused, plan written':'left half-done',13,C.ink);
  out+=arrow(196,95,236,95,C.dark,2.5)+R(242,60,150,70,'#fff',C.blue,10)+TB(317,88,'Task B',15,C.blue)+T(317,112,'starting now',13,C.ink);
  let avg=0;range(5).forEach(i=>{const res=start*Math.pow(decay,i),x=40+i*86,h=170;avg+=1-res;out+=R(x,160,60,h*(1-res),C.blue,'none',4)+R(x,160+h*(1-res),60,h*res,C.purple,'none',4)+T(x+30,350,(i*5)+' min',13,C.muted)+T(x+30,160+h*(1-res)+h*res/2+5,res>.08?Math.round(res*100)+'%':'',13,'#fff')});
  out+=R(470,60,110,70,'#fff',C.grid,10)+T(525,82,'free for B',13,C.muted)+TB(525,114,Math.round(avg/5*100)+'%',22,C.blue);
  out+=T(525,152,'purple = still',13,C.purple)+T(525,170,'thinking of A',13,C.purple);
  return {svg:out,phase:s.mode==='unfinished'?'Leaving A half-done keeps it active in memory; for a while, a large share of attention drifts back to it while you work on B. (Shares are illustrative.)':s.mode==='plan'?'Writing down exactly where you stopped and what comes next lets the mind let go of A, so more attention goes to B.':'With A finished there is little left to hold on to, so B gets nearly all of your attention.'};
 }});

/* ---------- Lesson: accessibility ---------- */
const H7_HUES={grey:[118,118,118],blue:[23,114,183],red:[196,82,56],green:[44,119,108],orange:[230,140,40]},H7_BGS={white:[255,255,255],black:[0,0,0],navy:[25,44,55],cream:[251,239,213]};
function H7_lum([r,g,b]){const f=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)}
function H7_contrast(a,b){const l1=H7_lum(a),l2=H7_lum(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)}
function H7_shade(rgb,t){return rgb.map(c=>Math.round(t>=0?c+(255-c)*t:c*(1+t)))}
const H7_rgb=c=>`rgb(${c.join(',')})`;
SCENE({id:'accessibility',name:'Colour contrast',tag:'Text everyone can read',
 definition:'The contrast ratio compares the brightness of text and background, from 1:1 (no difference) to 21:1 (black on white). Accessibility guidelines set minimum ratios for readable text.',
 example:'WCAG 2.0 asks for at least 4.5:1 for normal text and 3:1 for large text (level AA), and 7:1 and 4.5:1 for the stricter level AAA. Light grey on white often fails.',
 desc:'A sample of normal and large text in the chosen colours, the contrast ratio worked out from relative luminance, and a pass/fail table for the four guideline thresholds.',
 research:['W3C (2008). Web Content Accessibility Guidelines (WCAG) 2.0: contrast (minimum) and contrast (enhanced).'],
 dur:11,hint:'Pick a text colour and a background, then slide the text lighter or darker until it passes.',
 init:()=>({fg:'grey',bg:'white',t:.25}),
 watch(p){return {fg:'grey',bg:'white',t:Math.round(lerp(.7,-.5,smooth(p))*100)/100}},
 ui:[{range:'t',label:'Lighter ↔ darker',min:-.9,max:.9,step:.05,get:s=>s.t,act:'t',show:v=>v>0?'+'+fmt(v):fmt(v)}],
 on:{t(s,v){s.t=v},fg(s,v){s.fg=v},bg(s,v){s.bg=v}},
 draw(s,f,X){
  const fg=H7_shade(H7_HUES[s.fg],s.t),bg=H7_BGS[s.bg],cr=H7_contrast(fg,bg);let out=heading('Contrast ratio = (L₁ + 0.05) ÷ (L₂ + 0.05)');
  out+=R(30,56,300,170,H7_rgb(bg),C.line,10)+`<text x="50" y="104" font-size="16" fill="${H7_rgb(fg)}">Normal text, 16 px. The</text><text x="50" y="126" font-size="16" fill="${H7_rgb(fg)}">quick brown fox jumps over.</text><text x="50" y="180" font-size="26" font-weight="700" fill="${H7_rgb(fg)}">Large bold text</text>`;
  out+=T(30,250,'text',13,C.muted,'start');Object.keys(H7_HUES).forEach((k,i)=>out+=hit(X,'fg',k,`Text colour ${k}`,R(64+i*40,236,32,24,H7_rgb(H7_HUES[k]),s.fg===k?C.dark:C.line,5,s.fg===k?'stroke-width="3"':'')));
  out+=T(30,290,'back',13,C.muted,'start');Object.keys(H7_BGS).forEach((k,i)=>out+=hit(X,'bg',k,`Background ${k}`,R(64+i*40,276,32,24,H7_rgb(H7_BGS[k]),s.bg===k?C.dark:C.line,5,s.bg===k?'stroke-width="3"':'')));
  out+=TB(460,90,fmt(Math.round(cr*100)/100)+' : 1',30,C.ink);
  out+=T(460,118,`L(text) = ${H7_lum(fg).toFixed(3)} · L(back) = ${H7_lum(bg).toFixed(3)}`,13,C.muted);
  const rows=[['AA normal',4.5],['AA large',3],['AAA normal',7],['AAA large',4.5]];
  rows.forEach(([n,v],i)=>{const ok=cr>=v,y=146+i*36;out+=R(360,y,200,30,ok?C.greenp:C.coralp,'none',6)+T(372,y+20,`${n} ≥ ${v}`,14,C.ink,'start')+TB(548,y+20,ok?'pass':'fail',14,ok?C.green:C.coral,'end')});
  out+=T(300,340,'Luminance weights green most: 0.2126 R + 0.7152 G + 0.0722 B (after removing gamma).',13,C.muted);
  return {svg:out,phase:`This pair has a ratio of ${fmt(Math.round(cr*100)/100)}:1. ${cr>=7?'It passes every level.':cr>=4.5?'Fine for normal text at AA; AAA needs 7:1.':cr>=3?'Only large text passes; body text needs 4.5:1.':'It fails even for large text: many people, including anyone in bright sunlight, will struggle.'}`};
 }});

const H7_FIELDS=[{n:'First name',x:40,y:80},{n:'Last name',x:200,y:80},{n:'Email',x:40,y:160},{n:'Phone',x:200,y:160},{n:'Send',x:120,y:240,btn:true}];
SCENE({id:'accessibility-focus-order',name:'Focus order',tag:'What a keyboard or screen reader meets',
 definition:'Keyboard and screen-reader users move through a page in the order of its underlying code, not its visual layout. If the two differ, focus jumps around; if a field has no label, a screen reader can only say “edit text”.',
 example:'A form laid out in two columns but coded column by column sends the Tab key down the left side, to the button, and then back up to the right. WCAG asks for a focus order that preserves meaning.',
 desc:'A two-column form; each Tab press moves a focus ring to the next field in code order, with numbered arrows and the words a screen reader would announce.',
 research:['W3C (2008). WCAG 2.0 success criteria 2.4.3 Focus order and 1.3.1 Info and relationships.'],
 dur:12,hint:'Choose whether the code order matches the layout and whether fields have labels, then press Step to Tab through the form.',
 init:()=>({order:'bad',labels:'no'}),
 ui:[{choose:[['good','Code order matches layout'],['bad','Coded column by column']],label:'Order',get:s=>s.order,act:'order'},{choose:[['yes','Labelled fields'],['no','Missing labels']],label:'Labels',get:s=>s.labels,act:'labels'}],
 on:{order(s,v){s.order=v},labels(s,v){s.labels=v}},
 trace(s){const ord=s.order==='good'?[0,1,2,3,4]:[0,2,4,1,3];return [{k:-1}].concat(ord.map((f,i)=>({k:i,f,ord})))},
 draw(s,f,X){
  const ord=f.ord||(s.order==='good'?[0,1,2,3,4]:[0,2,4,1,3]);let out=heading('Press Tab: where does focus go?');
  out+=R(24,58,330,240,'#fff',C.grid,10);
  H7_FIELDS.forEach((fl,i)=>{const on=f.f===i,w=fl.btn?120:140;out+=(fl.btn?R(fl.x,fl.y,w,40,C.blue,on?C.coral:'none',8)+TB(fl.x+w/2,fl.y+26,fl.n,15,'#fff'):T(fl.x,fl.y-6,s.labels==='yes'?fl.n:'',13,C.ink,'start')+R(fl.x,fl.y,w,36,'#fff',on?C.coral:C.line,6)+(s.labels==='no'?T(fl.x+8,fl.y+24,fl.n.toLowerCase()+'…',13,C.line,'start'):''));
   if(on)out+=R(fl.x-5,fl.y-5,w+10,(fl.btn?40:36)+10,'none',C.coral,10,'stroke-width="3"')});
  const ctr=i=>{const fl=H7_FIELDS[i];return [fl.x+(fl.btn?60:70),fl.y+(fl.btn?20:18)]};
  for(let i=1;i<=Math.max(0,f.k);i++){const a=ctr(ord[i-1]),b=ctr(ord[i]);out+=curveArrow(a[0],a[1]+12,b[0],b[1]-12,ord[i]<ord[i-1]?40:-14,C.coral,2)}
  ord.slice(0,f.k+1).forEach((fi,i)=>{const c=ctr(fi);out+=Ci(c[0]+(H7_FIELDS[fi].btn?66:76),c[1]-18,10,C.coral)+TB(c[0]+(H7_FIELDS[fi].btn?66:76),c[1]-13,i+1,13,'#fff')});
  const said=f.k<0?'—':H7_FIELDS[f.f].btn?'“Send, button”':s.labels==='yes'?`“${H7_FIELDS[f.f].n}, edit text”`:'“Edit text”';
  out+=R(374,90,210,90,'#1f2f38','none',10)+T(479,114,'screen reader says',13,'#aac2cf')+TB(479,150,said,15,'#fff');
  out+=T(374,214,`Tab presses: ${Math.max(0,f.k+1)} of 5`,14,C.ink,'start');
  out+=T(374,244,s.order==='good'?'Order follows the layout.':'Order follows the code,',14,s.order==='good'?C.green:C.coral,'start')+(s.order==='bad'?T(374,264,'not the layout.',14,C.coral,'start'):'');
  return {svg:out,phase:f.k<0?'Focus starts before the form. Each Tab moves it to the next control in code order.':s.order==='bad'&&f.k>=2&&f.k<4?'Focus has skipped the right-hand column and jumped to the button: a sighted keyboard user is confused, and a screen-reader user may submit an unfinished form.':s.labels==='no'&&!H7_FIELDS[f.f].btn?'Placeholder text is not a label: the screen reader can only say “edit text”, so the user does not know what to type.':'Focus moves in an order that matches what you see, and each field announces its name.'};
 }});

const H7_SPEC=[['Touch','One arm','Arm injury','New parent','one-handed and voice control'],['See','Blind','Cataract','Distracted driver','screen readers, audio and high contrast'],['Hear','Deaf','Ear infection','Bartender','captions and visual alerts'],['Speak','Non-verbal','Laryngitis','Heavy accent','typed and visual alternatives to speech']];
SCENE({id:'accessibility-spectrum',name:'The persona spectrum',tag:'Permanent, temporary, situational',
 definition:'Inclusive design treats disability as a mismatch between a person and their surroundings, which anyone can experience permanently, temporarily or just for a moment.',
 example:'Microsoft’s inclusive design toolkit pairs a person with one arm, someone with an arm injury and a new parent holding a baby: one-handed design helps all three. Kerb cuts, made for wheelchair users, also help people with prams, bikes and luggage.',
 desc:'A grid of four abilities by three kinds of limitation, with an example person in each cell; choosing a row shows the design that helps everyone in it.',
 research:['Microsoft (2016). Inclusive Design toolkit: the persona spectrum.','Blackwell (2017). The curb-cut effect. Stanford Social Innovation Review.'],
 dur:12,hint:'Press any person to see who else the same design feature helps.',
 init:()=>({row:0,col:2}),
 watch(p){const r=Math.min(3,Math.floor(p*4));return {row:r,col:Math.min(2,Math.floor((p*4-r)*3))}},
 on:{pick(s,a){const [r,c]=String(a).split(',').map(Number);s.row=r;s.col=c}},
 draw(s,f,X){
  let out=heading('One design, many people');const x0=110,cw=160,y0=82,rh=56;
  ['Permanent','Temporary','Situational'].forEach((h,j)=>out+=TB(x0+j*cw+cw/2,y0-10,h,14,C.muted));
  H7_SPEC.forEach((row,i)=>{const y=y0+i*rh,on=i===s.row;out+=TB(30,y+32,row[0],15,on?C.blue:C.ink,'start');
   for(let j=0;j<3;j++){const sel=on&&j===s.col;out+=hit(X,'pick',i+','+j,`${row[0]}: ${row[j+1]}`,R(x0+j*cw+4,y+4,cw-8,rh-8,on?(sel?C.blue:C.pale):'#fff',on?C.blue:C.grid,8)+T(x0+j*cw+cw/2,y+33,row[j+1],14,sel?'#fff':C.ink,'middle',sel?'font-weight="700"':''))}});
  const r=H7_SPEC[s.row];out+=R(40,318,520,46,C.greenp,'none',10)+TB(300,338,`Helps all three: ${r[4]}`,14,C.green)+T(300,356,'Designing for the permanent case reaches far more people.',13,C.ink);
  return {svg:out,phase:`${r[s.col+1]} and the others in the “${r[0]}” row face the same mismatch for different reasons and for different lengths of time. A feature built for one of them (${r[4]}) works for all.`};
 }});

/* ---------- Lesson: dark-patterns ---------- */
const H7_DP=[{id:'sneak',name:'Sneak into basket',cat:'Sneaking',say:'Insurance was added without asking; you must notice and remove it.'},{id:'timer',name:'Countdown timer',cat:'Urgency',say:'A deadline pressures a hurried decision; Mathur and colleagues found some timers simply reset.'},{id:'stock',name:'Low-stock message',cat:'Scarcity',say:'“Only 2 left” pushes you to buy now, whether or not it is true.'},{id:'optin',name:'Pre-ticked opt-in',cat:'Interface interference',say:'The default does the company’s work: many people never untick it.'},{id:'shame',name:'Confirmshaming',cat:'Misdirection',say:'Declining is worded to make you feel foolish.'}];
SCENE({id:'dark-patterns',name:'Dark patterns',tag:'Design that works against you',
 definition:'Interface designs that trick or pressure people into choices they did not intend, such as buying extras, sharing data or signing up.',
 example:'Harry Brignull named and catalogued dark patterns in 2010. Mathur and colleagues crawled about 11,000 shopping sites in 2019 and found deceptive patterns on roughly one in ten.',
 desc:'A generic checkout screen containing five dark patterns; finding each one reveals its name and category.',
 research:['Brignull (2010). Dark patterns (now deceptive.design).','Mathur, Acar, Friedman, Lucherini, Mayer, Chetty & Narayanan (2019). Dark patterns at scale: findings from a crawl of 11K shopping websites. CSCW.','Gray, Kou, Battles, Hoggatt & Toombs (2018). The dark (patterns) side of UX design. CHI.'],
 dur:12,hint:'Press anything on the checkout that seems designed to push you. Five dark patterns are hidden here.',
 init:()=>({found:[]}),
 watch(p){return {found:H7_DP.slice(0,Math.floor(p*5.99)).map(d=>d.id)}},
 ui:[{b:'Reveal all',act:'all'}],
 on:{spot(s,id){if(!s.found.includes(id))s.found.push(id)},all(s){s.found=H7_DP.map(d=>d.id)}},
 draw(s,f,X){
  const has=id=>s.found.includes(id),mark=(id,x,y,w,h,inner)=>hit(X,'spot',id,`Suspicious element ${H7_DP.findIndex(d=>d.id===id)+1}`,inner+(has(id)?R(x-3,y-3,w+6,h+6,'none',C.coral,8,'stroke-width="3"'):''));
  let out=heading('Checkout');out+=R(30,50,320,316,'#fff',C.grid,12);
  out+=T(50,80,'Running shoes',15,C.ink,'start')+T(330,80,'£60.00',15,C.ink,'end');
  out+=mark('sneak',44,90,292,30,R(44,90,292,30,'#fafbfc','none',4)+T(50,110,'Shoe protection plan ✓',14,C.ink,'start')+T(330,110,'£4.99',14,C.ink,'end'));
  out+=mark('stock',44,126,150,24,R(44,126,150,24,'#fdecea','none',4)+T(52,143,'Only 2 left in stock!',13,C.coral,'start'));
  out+=mark('timer',202,126,134,24,R(202,126,134,24,'#fff4dc','none',4)+T(210,143,'Offer ends 09:58',13,C.amber,'start'));
  out+=L(44,166,336,166,C.grid,1)+TB(50,190,'Total',15,C.ink,'start')+TB(330,190,'£64.99',15,C.ink,'end');
  out+=mark('optin',44,206,292,30,R(44,206,292,30,'#fff','none',4)+R(50,212,18,18,C.blue,'none',3)+T(59,226,'✓',13,'#fff')+T(76,226,'Send me offers from partners',14,C.ink,'start'));
  out+=R(60,252,260,44,C.green,'none',10)+TB(190,280,'Pay now',16,'#fff');
  out+=mark('shame',70,308,240,26,T(190,326,'No thanks, I prefer paying full price',13,C.muted));
  out+=TB(380,74,`Found ${s.found.length} of 5`,16,s.found.length===5?C.green:C.ink,'start');
  H7_DP.forEach((d,i)=>{const y=96+i*52,ok=has(d.id);out+=R(375,y,210,44,ok?C.coralp:'#f4f6f7','none',8)+(ok?TB(385,y+19,d.name,13,C.coral,'start')+T(385,y+37,d.cat,13,C.ink,'start'):T(385,y+27,'?',14,C.muted,'start'))});
  const last=H7_DP.find(d=>d.id===s.found[s.found.length-1]);
  return {svg:out,phase:last?`${last.name} (${last.cat}): ${last.say}`:'Each element on this page is ordinary on its own. Together they steer the buyer towards spending more and sharing more than intended.'};
 }});

const H7_FLOW={signup:['Choose plan','Pay','Welcome!'],cancel:['Account','Settings','Your plan','Are you sure?','50% off if you stay!','Tell us why','Cancelled'],fair:['Account','Cancel membership','Cancelled']};
SCENE({id:'dark-patterns-roach-motel',name:'Roach motel',tag:'Easy in, hard out',
 definition:'A design that makes it easy to get into a situation, such as a subscription, and hard to get out of it, by burying, lengthening or obstructing the way out.',
 example:'Signing up takes a couple of taps; cancelling means finding a setting several menus deep, refusing offers and filling in a survey. Brignull called this the roach motel; Mathur and colleagues class it as obstruction.',
 desc:'Two flows of screens: a short sign-up and a long cancellation path, stepped through one screen at a time, with counts compared.',
 research:['Brignull (2010). Dark patterns: roach motel.','Mathur et al. (2019). Dark patterns at scale: findings from a crawl of 11K shopping websites. CSCW.'],
 dur:12,hint:'Step through cancelling. Then switch to the fair design, where leaving takes as few steps as joining.',
 init:()=>({design:'obstructed'}),
 ui:[{choose:[['obstructed','Obstructed'],['fair','Symmetric']],label:'Design',get:s=>s.design,act:'design'}],
 on:{design(s,v){s.design=v}},
 trace(s){const fl=s.design==='fair'?H7_FLOW.fair:H7_FLOW.cancel;return fl.map((_,i)=>({i,fl}))},
 draw(s,f,X){
  let out=heading('Joining versus leaving');const sw=s.design==='fair'?110:72;
  out+=TB(30,74,'Sign up',15,C.green,'start');H7_FLOW.signup.forEach((n,i)=>{const x=30+i*120;out+=R(x,86,104,58,C.greenp,C.green,8)+T(x+52,120,n,13,C.ink);if(i)out+=arrow(x-14,115,x-2,115,C.green,2,6)});
  out+=T(400,120,`${H7_FLOW.signup.length} screens`,14,C.green,'start');
  out+=TB(30,190,'Cancel',15,C.coral,'start');f.fl.forEach((n,i)=>{const x=24+i*(sw+8),on=i<=f.i,cur=i===f.i;const words=n.split(' ');
   out+=R(x,204,sw,74,cur?C.coralp:on?'#fff':'#f4f6f7',on?C.coral:C.grid,8);
   const lines=[];let line='';for(const w of words){if((line+' '+w).trim().length>9&&line){lines.push(line);line=w}else line=(line+' '+w).trim()}lines.push(line);
   lines.slice(0,3).forEach((l,j)=>out+=TF(x+sw/2,236+j*16-((lines.length-1)*8),l,13,on?C.ink:C.muted));
   if(i)out+=arrow(x-8,241,x-1,241,on?C.coral:C.grid,2,5)});
  out+=TB(300,320,`Step ${f.i+1} of ${f.fl.length} to leave, against ${H7_FLOW.signup.length} to join`,15,f.fl.length>H7_FLOW.signup.length?C.coral:C.green);
  return {svg:out,phase:s.design==='fair'?'Leaving takes about as many steps as joining. Symmetry is a simple test of whether a design respects the user.':f.i<f.fl.length-1?`Screen ${f.i+1}: “${f.fl[f.i]}”. Every extra screen is a chance to give up, and that is the point.`:'Finally cancelled, after more than twice as many screens as it took to join.'};
 }});

SCENE({id:'dark-patterns-fogg',name:'Fogg behaviour model',tag:'Motivation, ability, prompt',
 definition:'B. J. Fogg’s model says a behaviour happens when motivation, ability and a prompt come together: a prompt works only if the person is above an action line where motivation × ability is high enough.',
 example:'A reminder to take medication succeeds when the dose is easy to take and the person cares. The same model can serve the user’s goals or be turned against them; Fogg advises making behaviours easier rather than pushing motivation.',
 desc:'A plot of motivation against ability with a curved action line; a dot marks the person, and prompts either succeed above the line or fail below it.',
 research:['Fogg (2003). Persuasive technology: using computers to change what we think and do.','Fogg (2009). A behavior model for persuasive design. Persuasive ’09.'],
 dur:11,hint:'Set the person’s motivation and how easy the action is, then send a prompt. Try reaching success by making it easier instead of more motivating.',
 init:()=>({m:.3,a:.3,log:[]}),
 watch(p){return {m:.3,a:Math.round(lerp(.15,.9,smooth(p))*20)/20,log:[]}},
 ui:[{range:'m',label:'Motivation',min:.05,max:1,step:.05,get:s=>s.m,act:'m'},{range:'a',label:'Ability (ease)',min:.05,max:1,step:.05,get:s=>s.a,act:'a'},{b:'Send a prompt',act:'prompt'}],
 on:{m(s,v){s.m=v},a(s,v){s.a=v},prompt(s){s.log.push(s.m*s.a>=.15?1:0);if(s.log.length>8)s.log.shift()}},
 draw(s){
  const gx=70,gy=60,gw=280,gh=260,xm=v=>gx+v*gw,ym=v=>gy+gh-v*gh,ok=s.m*s.a>=.15;let out=heading('B = Motivation × Ability × Prompt');
  out+=L(gx,gy+gh,gx+gw,gy+gh,C.line,2)+L(gx,gy,gx,gy+gh,C.line,2);
  let d='';for(let a=.15;a<=1.0001;a+=.02)d+=(a===.15?'M':'L')+fmt(xm(a))+' '+fmt(ym(Math.min(1,.15/a)));
  out+=P(d+` L${xm(1)} ${ym(1)} L${xm(.15)} ${ym(1)} Z`,'none',0,C.greenp)+P(d,C.green,3)+T(xm(.8),ym(.42),'action line',13,C.green);
  out+=T(gx+gw/2,gy+gh+24,'ability: hard → easy',13,C.muted)+T(gx-14,gy+gh/2,'motivation',13,C.muted,'middle',`transform="rotate(-90 ${gx-14} ${gy+gh/2})"`);
  out+=Ci(xm(s.a),ym(s.m),11,ok?C.green:C.coral)+T(xm(s.a)+16,ym(s.m)+5,ok?'prompt works':'prompt fails',13,ok?C.green:C.coral,'start');
  out+=TB(380,90,'Prompts sent',15,C.ink,'start');s.log.forEach((v,i)=>out+=Ci(392+i*24,114,9,v?C.green:C.coral)+T(392+i*24,119,v?'✓':'✗',13,'#fff'));
  if(!s.log.length)out+=T(380,118,'none yet',13,C.muted,'start');
  out+=TF(380,170,'Two ways over the line:',14,C.ink,'start')+TF(380,194,'raise motivation (persuade),',14,C.ink,'start')+TF(380,214,'or raise ability (simplify).',14,C.ink,'start');
  out+=TF(380,256,'Dark patterns use the same',13,C.coral,'start')+TF(380,274,'levers for the seller’s goals:',13,C.coral,'start')+TF(380,292,'one-click buying, urgency.',13,C.coral,'start');
  return {svg:out,phase:ok?'Above the action line a prompt triggers the behaviour. Notice how far the dot can sit to the right with little motivation: easy actions need less persuasion.':'Below the line, prompting more often only annoys. Either make the action easier (move right) or find genuine motivation (move up).'};
 }});
