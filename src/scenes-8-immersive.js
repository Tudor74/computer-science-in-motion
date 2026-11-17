/* ===================== Era 8 · Immersive and beyond (1968–tomorrow) ===================== */
const H8_DEG=Math.PI/180;
// A toggle chip drawn in the diagram (pressable in Try it).
function H8_chip(X,act,arg,x,y,w,label,on,col=C.blue){
 return hit(X,act,arg,`${label}: ${on?'on':'off'}. Press to switch.`,R(x,y,w,30,on?col:'#fff',on?col:C.line,15)+TF(x+w/2,y+20,(on?'✓ ':'')+label,13,on?'#fff':C.muted,'middle','font-weight="650"'));
}
// Perspective camera at the origin looking along +z (y up). yaw turns right, pitch looks up.
function H8_camera(yaw,pitch,F,cx,cy,eye=[0,0,0]){
 const cr=Math.cos(yaw),sr=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 return p=>{const x=p[0]-eye[0],y=p[1]-eye[1],z=p[2]-eye[2];const rx=x*cr-z*sr,fz=x*sr+z*cr,uy=y*cp-fz*sp,dz=fz*cp+y*sp;return [rx,uy,dz,cx,cy,F]};
}
// Draw a 3D segment through the camera, clipped at the near plane.
function H8_seg(cam,a,b,col,w=1.6,extra=''){
 let A=cam(a),B=cam(b);const near=.08;
 if(A[2]<near&&B[2]<near)return '';
 if(A[2]<near||B[2]<near){const u=(near-A[2])/(B[2]-A[2]);const M=A.map((v,i)=>i<3?v+(B[i]-v)*u:v);if(A[2]<near)A=M;else B=M}
 const s=q=>[q[3]+q[5]*q[0]/q[2],q[4]-q[5]*q[1]/q[2]];const p=s(A),q=s(B);
 return L(p[0],p[1],q[0],q[1],col,w,extra);
}
// The room used by the head-mounted display scenes: walls, a window ahead, a door to the right, a table.
const H8_ROOM=(()=>{const S=[],b=(x0,y0,z0,x1,y1,z1)=>{const c=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(([i,j])=>S.push([c[i],c[j],'wall']))};
 b(-3,-1.6,-3,3,1.4,3);
 [[-1,0,3,1,0,3],[1,0,3,1,1,3],[1,1,3,-1,1,3],[-1,1,3,-1,0,3],[0,0,3,0,1,3]].forEach(s=>S.push([s.slice(0,3),s.slice(3),'window']));
 [[3,-1.6,-1,3,.6,-1],[3,.6,-1,3,.6,.5],[3,.6,.5,3,-1.6,.5]].forEach(s=>S.push([s.slice(0,3),s.slice(3),'door']));
 for(let x=-2;x<=2;x++)S.push([[x,-1.6,-3],[x,-1.6,3],'floor']);for(let z=-2;z<=2;z++)S.push([[-3,-1.6,z],[3,-1.6,z],'floor']);
 b(-2.2,-1.6,1.2,-.8,-.85,2.2);return S.map(x=>x[2]?x:x)})();
const H8_ROOMCOL={wall:'#9fd3f5',window:'#ffd24a',door:'#f59e7f',floor:'#4f7590'};
function H8_view(yaw,pitch,x0,y0,w,h,fov=90,eye=[0,0,0]){
 const F=(w/2)/Math.tan(fov/2*H8_DEG),cam=H8_camera(yaw,pitch,F,x0+w/2,y0+h/2,eye);
 let out=`<defs><clipPath id="h8clip"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="10"/></clipPath></defs>`+R(x0,y0,w,h,'#14222b','none',10);
 out+='<g clip-path="url(#h8clip)">'+H8_ROOM.map(([a,b,k])=>H8_seg(cam,a,b,H8_ROOMCOL[k],k==='floor'?1:k==='wall'?1.8:2.4)).join('')+'</g>';
 return out;
}

SCENE({id:'head-mounted-display',name:'Head-mounted display',tag:'The picture follows your head',
 definition:'A display worn on the head that redraws the scene for wherever you look, so a virtual room seems to stay still while you turn.',
 example:'In 1968 Ivan Sutherland’s headset hung from a ceiling arm that measured head position; two small screens showed a wireframe room that stayed put as the wearer looked around.',
 research:'Sutherland, I. E. (1968). A head-mounted three dimensional display. AFIPS Fall Joint Computer Conference.',
 desc:'Left: the headset’s view of a wireframe room with a window and a door. Right: a plan of the room with the head and its field of view.',
 dur:10,hint:'Turn your head with the sliders. The headset redraws the room so the window and door stay in the same place in the world.',
 init:()=>({yaw:20,pitch:0}),
 watch(p){return {yaw:Math.round(70*Math.sin(2*Math.PI*p)),pitch:Math.round(18*Math.sin(4*Math.PI*p))}},
 ui:[{range:'yaw',label:'Turn',min:-180,max:180,get:s=>s.yaw,act:'yaw',show:v=>v+'°'},{range:'pitch',label:'Look up',min:-60,max:60,get:s=>s.pitch,act:'pitch',show:v=>v+'°'}],
 on:{yaw(s,v){s.yaw=v},pitch(s,v){s.pitch=v}},
 draw(s){
  let out=heading('The headset redraws the room for your head');
  out+=H8_view(s.yaw*H8_DEG,s.pitch*H8_DEG,20,50,350,250);
  out+=TF(195,320,`What each eye is shown: turn ${s.yaw}°, look ${s.pitch>=0?'up':'down'} ${Math.abs(s.pitch)}°`,13,C.muted);
  // Plan view: the room seen from above, the head and its field of view.
  const mx=490,my=170,sc=26;out+=R(mx-3*sc,my-3*sc,6*sc,6*sc,'#fff',C.ink,4);
  out+=L(mx-sc,my-3*sc,mx+sc,my-3*sc,'#e0a800',5)+TF(mx,my-3*sc-8,'window',13,C.amber)+L(mx+3*sc,my-sc*.5,mx+3*sc,my+sc,C.coral,5)+TF(mx+3*sc-8,my-sc*.9,'door',13,C.coral,'end');
  out+=R(mx-2.2*sc,my-2.2*sc,1.4*sc,1*sc,C.pale,C.line,3)+TF(mx-1.5*sc,my-1.5*sc+5,'table',12,C.muted);
  const a=s.yaw*H8_DEG,r=2.7*sc,w=45*H8_DEG;
  out+=P(`M${mx} ${my}L${fmt(mx+r*Math.sin(a-w))} ${fmt(my-r*Math.cos(a-w))}A${r} ${r} 0 0 1 ${fmt(mx+r*Math.sin(a+w))} ${fmt(my-r*Math.cos(a+w))}Z`,C.blue,1.5,'#1772b733');
  out+=Ci(mx,my,9,C.blue)+arrow(mx,my,mx+30*Math.sin(a),my-30*Math.cos(a),'#fff',2.5,7);
  out+=TF(mx,my+3*sc+22,'Plan: you and your 90° view',13,C.muted);
  return {svg:out,phase:`The tracker reports a ${s.yaw}° turn, so the computer turns the virtual camera by exactly the same amount. Because the picture moves opposite to your head, the room appears fixed in space. That illusion is the whole trick of virtual reality.`};
 },
 three(s,f,X,project){
  const P=project([[-3,-3,-1.6],[3,3,1.4]]),t=([x,y,z])=>[x,z,y];let out='';
  for(const [a,b,k] of H8_ROOM)out+=line3(t(a),t(b),P,k==='floor'?'#c9d8e2':k==='wall'?C.line:H8_ROOMCOL[k],k==='wall'?1.6:2.4);
  const yaw=s.yaw*H8_DEG,pit=s.pitch*H8_DEG,fw=[Math.sin(yaw)*Math.cos(pit),Math.sin(pit),Math.cos(yaw)*Math.cos(pit)],rt=[Math.cos(yaw),0,-Math.sin(yaw)],up=[-Math.sin(yaw)*Math.sin(pit),Math.cos(pit),-Math.cos(yaw)*Math.sin(pit)];
  const d=2.4,corner=(i,j)=>t([0,1,2].map(k=>d*(fw[k]+i*rt[k]*1+j*up[k]*.72)));
  const cs=[corner(-1,-1),corner(1,-1),corner(1,1),corner(-1,1)];
  cs.forEach((c,i)=>out+=line3([0,0,0],c,P,C.blue,1.6)+line3(c,cs[(i+1)%4],P,C.blue,2));
  out+=poly3(cs,P,'#1772b722',C.blue)+point3([0,0,0],P,C.coral,9);
  return {svg:out,title:'The view frustum inside the room',caption:'The blue pyramid is what the headset can show from your head (orange). Turning moves the pyramid; the room itself never moves.'};
 }});

SCENE({id:'head-mounted-display-fov',name:'Field of view',tag:'How much of the world the display covers',
 definition:'The angle of the scene a display covers, set by the screen’s apparent size and how far it is from the eye.',
 example:'Sutherland’s 1968 headset covered about 40°. Modern headsets cover roughly 90–110°, while two human eyes together take in about 200° horizontally.',
 research:'Sutherland, I. E. (1968). A head-mounted three dimensional display. AFIPS Fall Joint Computer Conference.',
 desc:'A side view of an eye and a display screen with the angle between their edges, beside bars comparing fields of view.',
 dur:9,hint:'Make the (apparent) screen wider or bring it closer. The field of view is 2 × atan(width ÷ 2 ÷ distance).',
 init:()=>({w:10,d:5}),
 watch(p){return {w:Math.round(3+13*smooth(p)),d:5}},
 ui:[{range:'w',label:'Screen width (cm)',min:2,max:20,get:s=>s.w,act:'w'},{range:'d',label:'Distance (cm)',min:2,max:12,get:s=>s.d,act:'d'}],
 on:{w(s,v){s.w=v},d(s,v){s.d=v}},
 draw(s){
  const fov=2*Math.atan(s.w/2/s.d)/H8_DEG;let out=heading(`Field of view = ${Math.round(fov)}°`);
  const ex=70,ey=190,k=14,sx=ex+s.d*k,h=s.w*k/2;
  out+=Ci(ex,ey,16,'#fff',C.ink)+Ci(ex+8,ey,5,C.ink);
  out+=L(sx,ey-h,sx,ey+h,C.blue,6)+L(ex,ey,sx,ey-h,C.blue,1.5,'stroke-dasharray="5 4"')+L(ex,ey,sx,ey+h,C.blue,1.5,'stroke-dasharray="5 4"');
  const ar=40,a1=Math.atan2(-h,sx-ex),a2=Math.atan2(h,sx-ex);out+=P(`M${fmt(ex+ar*Math.cos(a1))} ${fmt(ey+ar*Math.sin(a1))}A${ar} ${ar} 0 0 1 ${fmt(ex+ar*Math.cos(a2))} ${fmt(ey+ar*Math.sin(a2))}`,C.coral,2.5)+TB(ex+ar+14,ey+5,Math.round(fov)+'°',15,C.coral,'start');
  out+=TF(sx,Math.min(330,ey+h+20),`${s.w} cm wide at ${s.d} cm`,13,C.muted);
  const bars=[['Sutherland 1968',40,C.muted],['Your setting',fov,C.coral],['Modern headset',100,C.blue],['Two human eyes',200,C.green]];
  bars.forEach(([n,v,col],i)=>{const y=70+i*62;out+=TF(330,y,n,13,C.ink,'start','font-weight="650"')+R(330,y+8,240,20,'#eef3f6','none',5)+R(330,y+8,240*Math.min(1,v/200),20,col,'none',5)+TF(330+Math.min(236,240*v/200)+(v>170?-6:6),y+23,Math.round(v)+'°',13,v>170?'#fff':C.ink,v>170?'end':'start')});
  out+=TF(450,340,'Approximate values; lenses enlarge the screen.',13,C.muted);
  return {svg:out,phase:`A ${s.w} cm screen at ${s.d} cm spans ${Math.round(fov)}°. A narrow field of view feels like looking through binoculars: you must turn your head to see what your eyes would normally catch at the edges.`};
 }});

SCENE({id:'head-mounted-display-dof',name:'Six degrees of freedom',tag:'Turning is not the same as moving',
 definition:'Head tracking can measure three rotations (turn, nod, tilt) and three movements (left–right, up–down, forward–back). Tracking all six lets near things shift more than far things when you lean.',
 example:'Lean sideways in a 3-degree-of-freedom headset and the whole world leans with you; with all 6 the nearby post slides past the distant tree, as it would in real life.',
 research:'Sutherland, I. E. (1968). A head-mounted three dimensional display. The mechanical arm measured both the position and the orientation of the head.',
 desc:'A plan view of a head leaning sideways with a near post and a far tree, and the resulting view with motion parallax present or missing.',
 dur:10,hint:'Lean with the slider, then switch between 3 and 6 degrees of freedom. Watch whether the near post moves more than the far tree.',
 init:()=>({mode:'6',lean:35}),
 watch(p){return {mode:p<.5?'3':'6',lean:Math.round(45*Math.sin(4*Math.PI*p))}},
 ui:[{choose:[['3','3 DoF (rotation only)'],['6','6 DoF (rotation + position)']],label:'Tracking',get:s=>s.mode,act:'mode'},{range:'lean',label:'Lean (cm)',min:-50,max:50,get:s=>s.lean,act:'lean'}],
 on:{mode(s,v){s.mode=v},lean(s,v){s.lean=v}},
 draw(s){
  const tracked=s.mode==='6'?s.lean/100:0,real=s.lean/100;let out=heading(s.mode==='6'?'6 DoF: leaning moves your viewpoint':'3 DoF: leaning is ignored');
  // Plan: near post at 1 m, far tree at 6 m.
  const ox=150,oy=330,k=40;out+=R(30,60,240,290,'#fff',C.grid,8);
  out+=Ci(ox-.25*k*2,oy-1*k,9,C.coral)+TF(ox-.25*k*2+14,oy-1*k+5,'post 1 m',13,C.coral,'start')+Ci(ox+.6*k*2,oy-6*k,14,C.green)+TF(ox+.6*k*2+20,oy-6*k+5,'tree 6 m',13,C.green,'start');
  out+=Ci(ox+real*k*2,oy+2,10,C.blue)+TF(ox+real*k*2,oy-14,'you',13,C.blue);
  if(s.mode==='3'&&s.lean)out+=Ci(ox,oy+2,10,'none',C.blue,'stroke-dasharray="3 3"')+TF(ox,oy+26,'where the headset thinks you are',12,C.muted);
  // View: horizontal position of each object = F*(x - eye)/z.
  const F=180,vx=430,eye=tracked;
  out+=R(300,70,270,190,'#14222b','none',10)+L(300,190,570,190,'#4f7590',1);
  const tx=vx+F*(.6-eye)/6,px=vx+F*(-.25-eye)/1;
  out+=R(tx-10,120,20,70,'#5fb08f','none',4)+Ci(tx,118,22,'#5fb08f');
  out+=R(px-16,130,32,130,'#f59e7f','none',4);
  const shiftNear=Math.round(F*tracked/1),shiftFar=Math.round(F*tracked/6);
  out+=TF(435,284,s.mode==='6'?`post shifts ${Math.abs(shiftNear)} px, tree ${Math.abs(shiftFar)} px`:'nothing shifts: no parallax',13,s.mode==='6'?C.ink:C.coral);
  const dof=[['turn',1],['nod',1],['tilt',1],['left–right',s.mode==='6'],['up–down',s.mode==='6'],['forward–back',s.mode==='6']];
  dof.forEach(([n,on],i)=>{const x=300+(i%3)*92,y=304+Math.floor(i/3)*34;out+=R(x,y,86,28,on?C.blue:'#fff',on?C.blue:C.line,14)+TF(x+43,y+19,n,12.5,on?'#fff':C.muted)});
  return {svg:out,phase:s.mode==='6'?'With position tracked, the near post slides much further across the view than the distant tree. That motion parallax is one of the strongest cues to depth.':'With rotation only, the picture ignores your lean. Your body says you moved but your eyes see no change, a small mismatch that can feel uncomfortable.'};
 },
 three(s,f,X,project){
  const P=project([[-1.6,-1.6,-1.6],[1.6,1.6,1.6]]);let out=axes3(P,['left–right','forward–back','up–down'],[1.5,1.5,1.5],[0,0,0]);
  const ring=(fn,col)=>{const pts=range(41).map(i=>fn(i/40*2*Math.PI));let o='';for(let i=0;i<40;i++)o+=line3(pts[i],pts[i+1],P,col,2.2);return o};
  out+=ring(a=>[Math.cos(a),Math.sin(a),0],C.coral)+ring(a=>[Math.cos(a),0,Math.sin(a)],C.purple)+ring(a=>[0,Math.cos(a),Math.sin(a)],C.green);
  const lean=s.mode==='6'?s.lean/50:0;out+=point3([lean*.5,0,0],P,C.blue,12);
  const q1=P([1,0,0]),q2=P([0,0,1]),q3=P([0,1,0]);out+=label3(q1[0]+8,q1[1]-8,'turn',13,C.coral)+label3(q2[0]+10,q2[1]-8,'tilt',13,C.purple)+label3(q3[0]-10,q3[1]-8,'nod',13,C.green);
  return {svg:out,title:'Three rotations and three translations',caption:`Three rings for rotation and three arrows for movement around your head (blue).${s.mode==='6'?' Your lean moves the head along the left–right axis.':' In 3 DoF the head stays at the centre whatever you do.'}`};
 }});

/* ---- Presence ---- */
const H8_FEATS=[['track','Head tracking'],['stereo','Stereo'],['fov','Wide view'],['lat','Low latency'],['sound','3D sound'],['hands','Tracked hands']];
SCENE({id:'presence',name:'Presence',tag:'Feeling that you are there',
 definition:'The sense of being in the virtual place. Researchers separate immersion, what the system delivers, from presence, how the person responds.',
 example:'In the “virtual pit”, people asked to walk to the edge of a drop that existed only in the headset slowed down and their heart rate rose, even though they knew the floor was flat.',
 research:['Slater, M. & Wilbur, S. (1997). A framework for immersive virtual environments (FIVE). Presence 6(6).','Meehan, M., Insko, B., Whitton, M. & Brooks, F. P. (2002). Physiological measures of presence in stressful virtual environments. ACM SIGGRAPH.'],
 desc:'A plank over a virtual pit with a person stepping out, beside switches for six immersion features and two meters for immersion and the likely response.',
 dur:11,hint:'Switch immersion features on and off. Immersion counts what the system delivers; the response meter is an illustration of the direction found in studies, not measured data.',
 init:()=>({track:1,stereo:1,fov:0,lat:0,sound:0,hands:0}),
 watch(p){const n=Math.min(6,Math.floor(p*7));const s={};H8_FEATS.forEach(([k],i)=>s[k]=i<n?1:0);return s},
 ui:[{b:'All on',act:'all',arg:1},{b:'All off',act:'all',arg:0}],
 on:{tog(s,k){s[k]^=1},all(s,v){H8_FEATS.forEach(([k])=>s[k]=Number(v))}},
 draw(s,f,X){
  const n=H8_FEATS.filter(([k])=>s[k]).length,imm=n/6,resp=Math.pow(imm,1.4);let out=heading('Immersion is what the system gives; presence is how you respond');
  // The pit: a room floor with a hole, a plank across, a figure.
  out+=R(30,80,300,240,'#eef3f6','none',8)+R(70,190,220,120,'#14222b','none',4)+TF(180,262,'virtual drop',13,'#9fd3f5');
  out+=R(40,184,250,10,'#b07a3a','none',2);
  const fx=60+150*smooth(imm);out+=Ci(fx,140,9,C.ink)+L(fx,150,fx,170,C.ink,3)+L(fx,170,fx-8+(n%2)*4,184,C.ink,3)+L(fx,170,fx+8,184,C.ink,3)+L(fx,156,fx-12,166-resp*12,C.ink,3)+L(fx,156,fx+12,166-resp*12,C.ink,3);
  out+=TF(180,110,n?`steps along the plank ${imm>.6?'very carefully':'warily'}`:'walks as if on flat floor',13,C.ink);
  H8_FEATS.forEach(([k,n2],i)=>out+=H8_chip(X,'tog',k,350+(i%2)*118,64+Math.floor(i/2)*40,112,n2,!!s[k]));
  out+=TF(350,200,'Immersion (system)',13,C.ink,'start','font-weight="650"')+R(350,208,230,18,'#eef3f6','none',6)+R(350,208,230*imm,18,C.blue,'none',6)+TF(575,222,`${n} of 6`,12.5,imm>.8?'#fff':C.ink,'end');
  out+=TF(350,256,'Likely response (illustrative)',13,C.ink,'start','font-weight="650"')+R(350,264,230,18,'#eef3f6','none',6)+R(350,264,230*resp,18,C.coral,'none',6);
  out+=TF(465,312,'Measured as behaviour, heart rate and',12.5,C.muted)+TF(465,328,'questionnaires in the studies cited.',12.5,C.muted);
  return {svg:out,phase:n?`With ${n} of 6 features on, the system is more immersive. In studies, more immersive set-ups, including lower latency, produced stronger physical responses at the virtual edge.`:'With nothing that tracks or surrounds you, the pit is just a picture, and people walk straight across it.'};
 }});

SCENE({id:'presence-latency',name:'Motion-to-photon latency',tag:'Why the world swims',
 definition:'The delay between moving your head and the display showing the matching picture. While you turn, the picture lags behind, so the world seems to slide.',
 example:'A designer’s rule of thumb is to keep it under about 20 milliseconds. At 60 ms a quick head turn leaves the picture several degrees out of place.',
 research:'Meehan, M., Razzaque, S., Whitton, M. C. & Brooks, F. P. (2003). Effect of latency on presence in stressful virtual environments. IEEE Virtual Reality.',
 desc:'Two curves over time, the real head angle and the angle the display shows, offset by the latency, with the error at a chosen moment and a post that drifts by that error.',
 dur:10,hint:'Change the latency and move the moment. The error is roughly head speed × latency, largest when you turn fastest.',
 init:()=>({lat:60,t:30}),
 watch(p){return {lat:p<.5?20:80,t:Math.round((p*2%1)*100)}},
 ui:[{range:'lat',label:'Latency (ms)',min:0,max:150,step:5,get:s=>s.lat,act:'lat'},{range:'t',label:'Moment',min:0,max:100,get:s=>s.t,act:'t',show:v=>v+'%'}],
 on:{lat(s,v){s.lat=v},t(s,v){s.t=v}},
 draw(s){
  const A=40,T=1.2,head=t=>A*Math.sin(2*Math.PI*t/T),dur=2.4,x0=40,w=360,y0=200,k=2;let out=heading(`Latency ${s.lat} ms`);
  const pts=(fn)=>range(121).map(i=>{const t=i/120*dur;return [x0+w*t/dur,y0-k*fn(t)]}).map((q,i)=>(i?'L':'M')+fmt(q[0])+' '+fmt(q[1])).join('');
  out+=L(x0,y0,x0+w,y0,C.grid,1)+TF(x0-6,y0-k*A+4,'+40°',12.5,C.muted,'end')+TF(x0-6,y0+k*A+4,'−40°',12.5,C.muted,'end');
  out+=P(pts(head),C.blue,3)+P(pts(t=>head(t-s.lat/1000)),C.coral,3,'none','stroke-dasharray="7 4"');
  const t=s.t/100*dur,cx=x0+w*s.t/100,e=head(t)-head(t-s.lat/1000);
  out+=L(cx,y0-k*A-14,cx,y0+k*A+14,C.ink,1.2,'stroke-dasharray="3 3"')+Ci(cx,y0-k*head(t),5,C.blue)+Ci(cx,y0-k*head(t-s.lat/1000),5,C.coral);
  out+=TF(70,300,'head angle',13,C.blue,'start','font-weight="650"')+TF(170,300,'picture shown',13,C.coral,'start','font-weight="650"')+TF(x0+w/2,322,'time over two head turns →',13,C.muted);
  // A post that should stay still, drawn where the lagging picture puts it.
  out+=R(420,60,160,240,'#14222b','none',10)+R(496,90,8,180,'#4f7590','none',3)+TF(500,84,'true place',12.5,'#9fd3f5');
  const off=clamp(e*3,-70,70);out+=R(496+off,90,8,180,'#f59e7f','none',3)+TF(500,292,`error ${Math.abs(e).toFixed(1)}°`,14,'#fff','middle','font-weight="700"');
  const r0=v=>Math.round(v)||0;return {svg:out,phase:`At this moment your head is ${r0(head(t))}° but the picture shows ${r0(head(t-s.lat/1000))}°: the world is ${Math.abs(e).toFixed(1)}° out of place and seems to swim. Meehan and colleagues found that lower latency (50 rather than 90 ms) gave stronger signs of presence.`};
 }});

const H8_LOCO={walk:['Walk for real',1,1],stick:['Joystick glide',1,0],teleport:['Teleport',0,0],vection:['Sit; world moves',1,0]};
SCENE({id:'presence-sickness',name:'Cybersickness',tag:'When the eyes and inner ear disagree',
 definition:'Nausea and disorientation in virtual reality, best explained by sensory conflict: the eyes report movement that the balance organs of the inner ear do not feel.',
 example:'Gliding forward with a joystick while sitting still makes many people queasy; walking for real or teleporting in jumps causes far less conflict.',
 research:['Reason, J. T. & Brand, J. J. (1975). Motion Sickness. Academic Press.','Kennedy, R. S., Lane, N. E., Berbaum, K. S. & Lilienthal, M. G. (1993). Simulator Sickness Questionnaire. Int. J. Aviation Psychology 3(3).'],
 desc:'Two signals, what the eyes report and what the inner ear reports, for different ways of moving, with a conflict meter and moving stripes showing vection.',
 dur:12,hint:'Choose how you move and how fast. Conflict is the gap between what the eyes see and what the inner ear feels.',
 init:()=>({mode:'stick',speed:3}),
 watch(p){const m=['walk','stick','teleport','vection'][Math.min(3,Math.floor(p*4))];return {mode:m,speed:3,ph:p}},
 ui:[{choose:Object.entries(H8_LOCO).map(([k,v])=>[k,v[0]]),label:'Movement',get:s=>s.mode,act:'mode'},{range:'speed',label:'Speed (m/s)',min:0,max:6,get:s=>s.speed,act:'speed'}],
 on:{mode(s,v){s.mode=v},speed(s,v){s.speed=v}},
 draw(s){
  const [name,eyes,ear]=H8_LOCO[s.mode],ev=eyes*s.speed,iv=ear*s.speed,conf=s.mode==='teleport'?0.5:Math.abs(ev-iv);let out=heading(name);
  // Vection stripes: shift with time in Watch, with speed in Try it.
  const shift=((s.ph||0)*400*(ev?1:0)+s.speed*7)%40;out+=`<defs><clipPath id="h8vec"><rect x="30" y="60" width="240" height="180" rx="10"/></clipPath></defs><g clip-path="url(#h8vec)">`+R(30,60,240,180,'#14222b','none',10);
  for(let i=-1;i<8;i++)out+=R(30+i*40+(ev?shift:0),60,18,180,'#2f4a5a','none',0);out+='</g>'+TF(150,256,ev?'the scene streams past your eyes':'the scene is still (or jumps)',13,C.muted);
  const bar=(y,label,v,col)=>TF(300,y,label,13.5,C.ink,'start','font-weight="650"')+R(300,y+8,260,20,'#eef3f6','none',6)+R(300,y+8,260*v/6,20,col,'none',6)+TF(565,y+23,v+' m/s',12.5,C.ink,'end');
  out+=bar(78,'Eyes say: moving at',ev,C.blue)+bar(136,'Inner ear feels:',iv,C.green);
  out+=TF(300,206,'Sensory conflict',13.5,C.ink,'start','font-weight="650"')+R(300,214,260,22,'#eef3f6','none',6)+R(300,214,260*Math.min(1,conf/6),22,conf>2?C.coral:C.amber,'none',6);
  out+=TF(430,268,conf>2?'high: likely queasiness':conf>0?'low':'none: senses agree',14,conf>2?C.coral:C.green,'middle','font-weight="700"');
  out+=TF(300,310,'Teleporting avoids continuous conflict but can',13,C.muted,'start')+TF(300,328,'cost you your sense of where you are.',13,C.muted,'start');
  return {svg:out,phase:s.mode==='walk'?'Walking for real: eyes and inner ear agree, so there is no conflict, but you need room to walk.':s.mode==='teleport'?'Teleporting skips the motion, so the eyes never report a glide the ear does not feel.':s.mode==='vection'?'Vection: a moving scene alone makes you feel you are moving, yet your inner ear disagrees.':'Gliding with a joystick: the eyes see steady motion the inner ear never feels. This mismatch is the classic cause of cybersickness.'};
 }});

/* ---- Depth cues ---- */
const H8_POSTS=[[-1.6,3],[.6,5],[1.8,9],[-.5,14],[-2.6,7]];
const H8_CUES=[['size','Relative size'],['height','Height in view'],['occl','Occlusion'],['persp','Perspective'],['shade','Shadows'],['aerial','Haze']];
SCENE({id:'depth-cues',name:'Depth cues',tag:'How a flat picture looks deep',
 definition:'Features of an image that the visual system uses to judge distance, such as relative size, occlusion, perspective, shadows and haze.',
 example:'Switch every cue off and five posts at different distances look like a row of identical sticks; switch them on one by one and the scene opens up.',
 research:'Cutting, J. E. & Vishton, P. M. (1995). Perceiving layout and knowing distances: the integration, relative potency, and contextual use of different information about depth. In Epstein & Rogers (eds), Perception of Space and Motion.',
 desc:'Five posts in a field, drawn with a chosen set of depth cues switched on or off.',
 dur:12,hint:'Switch cues on and off. Each one alone gives some depth; together they agree and the layout becomes obvious.',
 init:()=>({size:1,height:1,occl:1,persp:1,shade:0,aerial:0}),
 watch(p){const n=Math.min(6,Math.floor(p*7));const s={};H8_CUES.forEach(([k],i)=>s[k]=i<n?1:0);return s},
 ui:[{b:'All cues',act:'all',arg:1},{b:'No cues',act:'all',arg:0}],
 on:{tog(s,k){s[k]^=1},all(s,v){H8_CUES.forEach(([k])=>s[k]=Number(v))}},
 draw(s,f,X){
  let out=heading('Depth cues');const hz=110,F=200,cx=210;
  out+=`<defs><clipPath id="h8dc"><rect x="20" y="50" width="380" height="270" rx="10"/></clipPath></defs>`+R(20,50,380,270,s.aerial?'#e9f1f6':'#f3f7fa','none',10)+'<g clip-path="url(#h8dc)">';
  if(s.persp){for(let i=-4;i<=4;i++)out+=L(cx+i*12,hz,cx+i*140,320,'#c9d8e2',1);for(const z of [3,5,8,14])out+=L(20,hz+F*1.6/z*.95,400,hz+F*1.6/z*.95,'#c9d8e2',1)}
  out+=L(20,hz,400,hz,C.line,1.2);
  const posts=H8_POSTS.map(([x,z],i)=>({x,z,i})).sort((a,b)=>b.z-a.z);
  posts.forEach(({x,z,i})=>{
   const sc=s.size?3/z:.55,h=110*sc,w=24*sc,base=s.height?hz+F*1.6/z*.95:300,px=s.occl?cx+F*x/z:50+i*72;
   const col=s.aerial?tint('#2c5b78',clamp((z-3)/14,0,.75)):'#2c5b78';
   if(s.shade)out+=`<ellipse cx="${fmt(px+w*.9)}" cy="${fmt(base)}" rx="${fmt(w*1.1)}" ry="${fmt(4*sc+1)}" fill="#00000026"/>`;
   out+=R(px-w/2,base-h,w,h,col,'none',2)+(s.shade?R(px,base-h,w/2,h,'#00000022','none',0):'');
  });
  out+='</g>';H8_CUES.forEach(([k,n],i)=>out+=H8_chip(X,'tog',k,420,56+i*42,160,n,!!s[k],C.purple));
  const on=H8_CUES.filter(([k])=>s[k]).length;
  out+=TF(500,330,`${on} of 6 cues on`,13,C.muted);
  return {svg:out,phase:on?`With ${on} cue${on>1?'s':''} on the posts spread out in depth. Cutting and Vishton showed cues work best at different distances: occlusion everywhere, size and height across the field, haze only far away.`:'With every cue off, nothing tells the eye which post is nearer. The picture is flat.'};
 },
 three(s,f,X,project){
  const P=project([[-3,0,0],[3,15,2.4]]);let out=poly3([[-3,1,0],[3,1,0],[3,15,0],[-3,15,0]],P,'#e5edf2');
  let faces=[];H8_POSTS.forEach(([x,z])=>faces.push(...prism(x-.15,z-.15,0,.3,.3,1.6,'#2c5b78')));out+=paintFaces(faces,P);
  out+=point3([0,0,.9],P,C.coral,8);const q=P([0,0,.9]);out+=label3(q[0],q[1]+24,'your eye',13,C.coral);
  return {svg:out,title:'The same posts in space',caption:'Turned in 3D, the true distances are obvious: the 2D picture had to rely on cues to suggest them.'};
 }});

SCENE({id:'depth-cues-stereo',name:'Binocular disparity',tag:'Two eyes, two pictures',
 definition:'Each eye sees the scene from a slightly different place. The brain turns the small differences between the two images into a strong sense of depth, mostly for nearby things.',
 example:'Charles Wheatstone’s 1838 stereoscope showed each eye its own drawing and produced vivid depth. Headsets do the same with two screens.',
 research:['Wheatstone, C. (1838). On some remarkable, and hitherto unobserved, phenomena of binocular vision. Phil. Trans. Royal Society.','Cutting, J. E. & Vishton, P. M. (1995). Perceiving layout and knowing distances.'],
 desc:'A plan view of two eyes converging on an object, the angle between their lines of sight, and a curve showing that angle shrinking with distance.',
 dur:10,hint:'Move the object and change the distance between the eyes. The angle (and the difference between the two eyes’ views) falls quickly with distance.',
 init:()=>({d:1,ipd:64}),
 watch(p){return {d:+(0.3+9.7*p*p).toFixed(1),ipd:64}},
 ui:[{range:'d',label:'Distance (m)',min:0.3,max:20,step:0.1,get:s=>s.d,act:'d'},{range:'ipd',label:'Eye separation (mm)',min:54,max:74,get:s=>s.ipd,act:'ipd'}],
 on:{d(s,v){s.d=v},ipd(s,v){s.ipd=v}},
 draw(s){
  const ang=2*Math.atan(s.ipd/2000/s.d)/H8_DEG;let out=heading(`Angle between the eyes’ lines of sight: ${ang<1?ang.toFixed(2):ang.toFixed(1)}°`);
  const ex=150,ey=320,sep=s.ipd*.9,yo=ey-Math.min(230,40+Math.log10(s.d*10)*95);
  out+=Ci(ex-sep/2,ey,12,'#fff',C.ink)+Ci(ex+sep/2,ey,12,'#fff',C.ink)+L(ex-sep/2,ey,ex,yo,C.blue,2)+L(ex+sep/2,ey,ex,yo,C.coral,2)+Ci(ex,yo,10,C.green)+TF(ex+16,yo+5,`${s.d} m`,13,C.green,'start');
  out+=TF(ex,ey+28,`eyes ${s.ipd} mm apart (not to scale)`,12.5,C.muted);
  // Curve of angle against distance.
  const gx=310,gy=290,gw=260,gh=200,dmax=20,amax=2*Math.atan(.037/.3)/H8_DEG;
  out+=L(gx,gy,gx+gw,gy,C.line,1.5)+L(gx,gy,gx,gy-gh,C.line,1.5)+TF(gx+gw/2,gy+30,'distance (m) →',13,C.muted)+TF(gx-8,gy-gh+6,amax.toFixed(0)+'°',12.5,C.muted,'end');
  const pth=range(81).map(i=>{const d=.3+i/80*(dmax-.3),a=2*Math.atan(s.ipd/2000/d)/H8_DEG;return (i?'L':'M')+fmt(gx+gw*d/dmax)+' '+fmt(gy-gh*a/amax)}).join('');
  out+=P(pth,C.purple,2.5)+Ci(gx+gw*s.d/dmax,gy-gh*ang/amax,6,C.green);
  [1,5,10,20].forEach(d=>out+=TF(gx+gw*d/dmax,gy+16,d,12.5,C.muted));
  return {svg:out,phase:`At ${s.d} m the two eyes differ by ${ang<1?ang.toFixed(2):ang.toFixed(1)}°. Disparity is a powerful cue close up and fades with distance, which is why stereo matters most within arm’s reach and at room scale.`};
 }});

SCENE({id:'depth-cues-vac',name:'Vergence–accommodation conflict',tag:'Pointing and focusing disagree',
 definition:'In the real world the eyes point at (verge on) and focus on (accommodate to) the same distance. In most headsets the screen sits at one fixed focal distance, so the eyes point at the virtual object but must focus elsewhere.',
 example:'A virtual object held 30 cm from your face asks your eyes to converge for 30 cm while the lenses still demand focus at around 1.5 m: a common source of eye strain.',
 research:['Hoffman, D. M., Girshick, A. R., Akeley, K. & Banks, M. S. (2008). Vergence–accommodation conflicts hinder visual performance and cause visual fatigue. Journal of Vision 8(3).','Shibata, T., Kim, J., Hoffman, D. M. & Banks, M. S. (2011). The zone of comfort. Journal of Vision 11(8).'],
 desc:'A side view of an eye: one line to the virtual object for vergence and one to the fixed focal plane for focus, with the conflict shown in dioptres.',
 dur:9,hint:'Move the virtual object nearer or further. The conflict in dioptres is 1/vergence distance − 1/focal distance.',
 init:()=>({d:0.4,focal:1.5,real:0}),
 watch(p){return {d:+(0.25+3.75*p).toFixed(2),focal:1.5,real:0}},
 ui:[{range:'d',label:'Object (m)',min:0.25,max:10,step:0.05,get:s=>s.d,act:'d'},{choose:[[0,'Headset'],[1,'Real world']],label:'Viewing',get:s=>s.real,act:'real'}],
 on:{d(s,v){s.d=v},real(s,v){s.real=Number(v)}},
 draw(s){
  const focal=s.real?s.d:s.focal,conf=Math.abs(1/s.d-1/focal);let out=heading(s.real?'Real world: pointing and focus agree':'Headset: focus stays at the screen');
  const ex=60,ey=160,pos=d=>ex+60+Math.log10(d/0.25)/Math.log10(40)*440;
  out+=Ci(ex,ey,22,'#fff',C.ink)+Ci(ex+12,ey,7,C.ink);
  out+=L(pos(s.d),ey-60,pos(s.d),ey+60,C.green,2,'stroke-dasharray="4 4"')+Ci(pos(s.d),ey,11,C.green)+TF(pos(s.d),ey-70,`object ${s.d} m`,13,C.green);
  out+=L(ex+20,ey-6,pos(s.d),ey,C.blue,2.5)+TF((ex+pos(s.d))/2,ey-14,'eyes point here',12.5,C.blue);
  out+=L(pos(focal),ey-50,pos(focal),ey+70,C.coral,4)+L(ex+20,ey+8,pos(focal),ey+40,C.coral,2,'stroke-dasharray="6 4"')+TF(pos(focal),ey+88,`focus ${focal} m`,13,C.coral);
  // Dioptre scale with an approximate comfort band.
  const sx=60,sw=480,sy=300,dmax=4,toX=v=>sx+sw*v/dmax;out+=R(sx,sy,sw,18,'#eef3f6','none',6)+R(sx,sy,Math.min(sw,toX(.5)-sx),18,C.greenp,'none',6)+R(sx,sy,Math.min(sw,toX(conf)-sx),18,conf>.5?C.coral:C.green,'none',6,'opacity=".75"');
  [0,1,2,3,4].forEach(v=>out+=TF(toX(v),sy+34,v+' D',12.5,C.muted));out+=TF(sx,sy-8,`Conflict ${conf.toFixed(2)} dioptres`,13.5,C.ink,'start','font-weight="650"')+TF(sx+sw,sy-8,'green ≈ zone of comfort (±0.5 D)',12.5,C.green,'end');
  return {svg:out,phase:s.real?'In the real world both distances match, so there is no conflict.':`The eyes converge for ${s.d} m but focus at ${s.focal} m: a ${conf.toFixed(2)} D mismatch. Hoffman and colleagues found such conflicts slow down fusing the images and cause fatigue.`};
 }});

/* ---- Augmented reality ---- */
SCENE({id:'augmented-reality',name:'Augmented reality',tag:'From the real room to a virtual one',
 definition:'Adding computer-generated objects to a live view of the real world. Milgram and Kishino placed it on a continuum from a wholly real environment to a wholly virtual one.',
 example:'The term “augmented reality” was coined at Boeing around 1990 for a headset that overlaid wiring diagrams on the boards technicians were assembling.',
 research:['Milgram, P. & Kishino, F. (1994). A taxonomy of mixed reality visual displays. IEICE Transactions on Information and Systems E77-D(12).','Caudell, T. P. & Mizell, D. W. (1992). Augmented reality: an application of heads-up display technology to manual manufacturing processes. HICSS.'],
 desc:'A desk scene that blends from real objects to virtual ones as a slider moves along the reality–virtuality continuum.',
 dur:10,hint:'Slide along the continuum. Near the left, a few virtual labels sit on the real desk; near the right, a virtual room keeps only a few real things.',
 init:()=>({m:30}),
 watch(p){return {m:Math.round(100*p)}},
 ui:[{range:'m',label:'Continuum',min:0,max:100,get:s=>s.m,act:'m',show:v=>v+'%'}],
 on:{m(s,v){s.m=v}},
 draw(s){
  const m=s.m/100,real=1-smooth(clamp((m-.35)/.6,0,1)),virt=smooth(clamp(m/.65,0,1));let out=heading('The reality–virtuality continuum');
  out+=R(30,50,540,220,'#f3f7fa','none',10);
  out+=G(R(60,190,300,16,'#9c7b5b','none',3)+R(80,206,12,50,'#9c7b5b','none',2)+R(328,206,12,50,'#9c7b5b','none',2)+R(120,150,40,40,'#d9d2c5',C.muted,4)+R(410,70,130,90,'#cfe3ee',C.muted,4)+L(475,70,475,160,C.muted,2)+R(230,160,60,30,'#555','none',3),`opacity="${real.toFixed(2)}"`);
  out+=G(R(60,190,300,16,'none',C.blue,3,'stroke-dasharray="5 3"')+R(410,70,130,90,'none',C.blue,4,'stroke-dasharray="5 3"')+P('M60 268L300 120L560 268',C.blue,1.2,'none','opacity=".6"')+P('M120 268L300 150L480 268',C.blue,1.2,'none','opacity=".6"'),`opacity="${clamp((m-.5)/.3,0,1).toFixed(2)}"`);
  const lab=clamp(m/.25,0,1);out+=G(R(160,100,140,30,C.blue,'none',8)+TF(230,120,'mug: 72 °C',13,'#fff')+L(160,115,145,148,C.blue,2)+R(250,224,170,30,C.blue,'none',8)+TF(335,244,'meeting in 5 min',13,'#fff'),`opacity="${lab.toFixed(2)}"`);
  out+=G(Ci(470,215,26,C.purple)+TF(470,220,'3D',13,'#fff'),`opacity="${virt.toFixed(2)}"`);
  const bx=40,bw=520,by=300;out+=R(bx,by,bw,12,'#eef3f6','none',6)+R(bx,by,bw*m,12,C.blue,'none',6)+Ci(bx+bw*m,by+6,9,'#fff',C.blue);
  [['Real',0],['Augmented reality',.25],['Augmented virtuality',.75],['Virtual',1]].forEach(([n,v])=>out+=TF(bx+bw*v,by+34,n,13,C.ink,v===0?'start':v===1?'end':'middle'));
  const zone=m<.08?'the real environment':m<.5?'augmented reality: mostly real, some virtual':m<.92?'augmented virtuality: mostly virtual, some real':'a fully virtual environment';
  return {svg:out,phase:`At ${s.m}% you are in ${zone}. Milgram and Kishino called everything between the two ends “mixed reality”.`};
 }});

SCENE({id:'augmented-reality-registration',name:'Registration',tag:'Keeping virtual things pinned to real ones',
 definition:'Aligning virtual content with the real object it belongs to. Small tracking errors grow into large misplacements, especially at a distance.',
 example:'An arrow meant to point at a bolt hole 2 m away misses by 3.5 cm if the headset’s orientation is just 1° wrong.',
 research:'Azuma, R. T. (1997). A survey of augmented reality. Presence: Teleoperators and Virtual Environments 6(4).',
 desc:'A real panel with a target hole and a virtual arrow offset by the combined position and angle error, with the size of the miss.',
 dur:9,hint:'Add angle error, position error and distance. The miss is position error + distance × tan(angle error).',
 init:()=>({ang:1,pos:1,d:2}),
 watch(p){return {ang:+(3*p).toFixed(1),pos:1,d:2}},
 ui:[{range:'ang',label:'Angle error (°)',min:0,max:5,step:0.1,get:s=>s.ang,act:'ang'},{range:'pos',label:'Position error (cm)',min:0,max:5,step:0.5,get:s=>s.pos,act:'pos'},{range:'d',label:'Distance (m)',min:0.5,max:5,step:0.5,get:s=>s.d,act:'d'}],
 on:{ang(s,v){s.ang=v},pos(s,v){s.pos=v},d(s,v){s.d=v}},
 draw(s){
  const miss=s.pos+s.d*100*Math.tan(s.ang*H8_DEG);let out=heading(`The virtual arrow misses by ${miss.toFixed(1)} cm`);
  out+=R(60,60,480,230,'#d9e0e4',C.muted,8);for(let i=0;i<5;i++)for(let j=0;j<3;j++)out+=Ci(120+i*90,110+j*70,9,'#7d8a92');
  const tx=300,ty=180,k=6;out+=Ci(tx,ty,13,'#3d474d')+Ci(tx,ty,17,'none',C.green)+TF(tx,ty+38,'real hole',13,C.green);
  const ax=tx+miss*k*.8,ay=ty-miss*k*.6;out+=arrow(ax+60,ay-70,ax+4,ay-4,C.blue,5,14)+TF(ax+64,ay-78,'virtual arrow',13,C.blue,'start');
  out+=TF(300,322,`${s.pos} cm + ${s.d} m × tan ${s.ang}° = ${miss.toFixed(1)} cm (drawn ×6)`,14,C.ink);
  return {svg:out,phase:`Angular error is multiplied by distance: ${s.ang}° at ${s.d} m alone is ${(s.d*100*Math.tan(s.ang*H8_DEG)).toFixed(1)} cm. Azuma’s survey named registration as one of the hardest problems in augmented reality, because people notice misalignment of a few millimetres.`};
 }});

SCENE({id:'augmented-reality-occlusion',name:'Occlusion in AR',tag:'Virtual things hidden behind real ones',
 definition:'Near things should hide far things. If the system does not know the real scene’s depth, it draws virtual objects on top of everything, even ones that should be hidden.',
 example:'A virtual cat behind a real sofa should be partly hidden; without depth sensing it floats in front of the sofa and looks pasted on.',
 research:'Azuma, R. T. (1997). A survey of augmented reality. Presence 6(4).',
 desc:'A real box and a virtual cube at an adjustable distance, drawn either with depth sensing (correct occlusion) or without it (always on top).',
 dur:9,hint:'Move the virtual cube behind the real box and switch depth sensing off and on.',
 init:()=>({d:3,depth:0}),
 watch(p){return {d:+(1+3*p).toFixed(1),depth:p>.5?1:0}},
 ui:[{range:'d',label:'Virtual cube (m)',min:0.5,max:4,step:0.1,get:s=>s.d,act:'d'},{choose:[[0,'No depth sensing'],[1,'Depth sensing']],label:'Mode',get:s=>s.depth,act:'depth'}],
 on:{d(s,v){s.d=v},depth(s,v){s.depth=Number(v)}},
 draw(s){
  const boxD=2,behind=s.d>boxD,hidden=behind&&s.depth;let out=heading(behind?(s.depth?'Correct: the real box hides the cube':'Wrong: the cube is pasted on top'):'The cube is in front, so it should be visible');
  out+=R(30,50,540,260,'#f3f7fa','none',10)+L(30,230,570,230,C.line,1.5);
  const cs=120/s.d,cx=300+(s.d-2)*40,cy=230-cs*.4;const cube=R(cx-cs/2,cy-cs,cs,cs,C.blue,'none',4,'opacity=".9"');
  const realBox=R(220,150,170,80,'#b08a5e','#7a5a38',4);
  if(behind&&!s.depth)out+=realBox+cube;else if(behind&&s.depth)out+=cube+realBox;else out+=realBox+cube;
  out+=TF(305,252,'real box (2 m)',13,'#7a5a38','middle','font-weight="650"')+TF(cx,Math.max(64,cy-cs-8),'virtual cube',13,C.blue,'middle','font-weight="650"')+TF(300,290,`cube at ${s.d} m · box at 2 m`,14,C.ink);
  return {svg:out,phase:hidden?'With a depth map of the room, the renderer knows the real box is nearer and hides the parts of the cube behind it.':behind?'Without knowing the real scene’s depth, the system simply draws the virtual cube over the camera image, breaking the most basic depth cue.':'The cube is nearer than the box, so drawing it on top is correct either way.'};
 }});

/* ---- Conversational interfaces ---- */
const H8_ELIZA=[
 {k:/\b(mother|father|family|sister|brother)\b/i,rank:3,say:()=>'Tell me more about your family.'},
 {k:/\bi am (.*)/i,rank:2,say:m=>`How long have you been ${m}?`},
 {k:/\bi feel (.*)/i,rank:2,say:m=>`Do you often feel ${m}?`},
 {k:/\bcomputers?\b/i,rank:2,say:()=>'Do computers worry you?'},
 {k:/\bbecause\b/i,rank:1,say:()=>'Is that the real reason?'},
 {k:/\byou\b/i,rank:1,say:()=>'We were discussing you, not me.'},
 {k:/.*/,rank:0,say:()=>'Please go on.'}];
const H8_SWAP={my:'your',me:'you',i:'you',am:'are',your:'my',you:'I',mine:'yours'};
function H8_reflect(t){return t.replace(/[.!?]+$/,'').split(/\s+/).map(w=>H8_SWAP[w.toLowerCase()]||w).join(' ')}
SCENE({id:'conversational-ui',name:'Conversational interface',tag:'ELIZA and the illusion of understanding',
 definition:'An interface you use by typing or speaking ordinary language. The first famous one, ELIZA, matched keywords and turned your words around, yet people felt understood.',
 example:'Type “I am worried about my exams” and ELIZA replies “How long have you been worried about your exams?”, a rule, not comprehension. Weizenbaum was alarmed at how readily people confided in it.',
 research:'Weizenbaum, J. (1966). ELIZA: a computer program for the study of natural language communication between man and machine. Communications of the ACM 9(1).',
 desc:'A typed sentence, the list of ELIZA-style keyword rules with the matching one highlighted, the pronoun swap and the reply.',
 dur:12,hint:'Type a sentence or pick one. Step to see the keyword scan, the chosen rule, the pronoun swap and the reply.',
 init:()=>({text:'I am worried about my exams'}),
 ui:[{text:'You say',label:'You say',get:s=>s.text,act:'text',max:40},{choose:[['I am worried about my exams','I am…'],['My mother never listens','Family'],['I think computers are taking over','Computers'],['Hello there','Anything else']],label:'Examples',get:s=>s.text,act:'text'}],
 on:{text(s,v){s.text=v}},
 trace(s){const t=s.text.trim()||'…',hits=H8_ELIZA.map((r,i)=>({r,i,m:t.match(r.k)})).filter(x=>x.m);const best=hits.sort((a,b)=>b.r.rank-a.r.rank)[0];
  const frag=best.m[1]?H8_reflect(best.m[1]):'';const reply=best.r.say(frag);
  return [{st:0,t,say:'ELIZA scans your sentence for keywords it has rules for.'},{st:1,t,hits:hits.map(h=>h.i),say:`Keywords found: ${hits.length-1||'none'}${hits.length>1?'':' (the fallback rule always matches)'}.`},{st:2,t,hits:hits.map(h=>h.i),best:best.i,say:`The highest-ranked rule wins: rule ${best.i+1}.`},{st:3,t,hits:hits.map(h=>h.i),best:best.i,frag,orig:best.m[1]||'',say:best.m[1]?`It swaps pronouns in the rest of your sentence: “${best.m[1].replace(/[.!?]+$/,'')}” → “${frag}”.`:'This rule needs none of your words.'},{st:4,t,hits:hits.map(h=>h.i),best:best.i,frag,reply,say:`Reply: “${reply}” No meaning was involved, only matching and rearranging.`}]},
 draw(s,f){
  let out=heading('Keyword, rule, swap, reply');const t=f.t.length>44?f.t.slice(0,43)+'…':f.t;
  out+=R(30,48,380,40,'#fff',C.blue,20)+T(220,74,t,15,C.ink);
  const labels=['family words','“I am …”','“I feel …”','computer(s)','because','you','(anything)'],resp=['Tell me more about your family.','How long have you been …?','Do you often feel …?','Do computers worry you?','Is that the real reason?','We were discussing you, not me.','Please go on.'];
  labels.forEach((l,i)=>{const y=102+i*28,h=f.hits&&f.hits.includes(i),b=f.best===i;out+=R(30,y,380,24,b?C.amberp:h?'#eef6fb':'#fff',b?C.amber:h?C.blue:C.grid,6)+TF(40,y+17,`${i+1}. ${l}`,13,C.ink,'start',b?'font-weight="700"':'')+TF(400,y+17,resp[i],12.5,C.muted,'end')});
  if(f.st>=3&&f.orig)out+=TF(430,120,'swap',13,C.purple,'start','font-weight="650"')+TF(430,140,'I → you, my → your',12.5,C.purple,'start')+TF(430,160,'am → are, me → you',12.5,C.purple,'start');
  if(f.st>=4){const r=f.reply.length>46?f.reply.slice(0,45)+'…':f.reply;out+=R(150,310,420,44,C.green,'none',20)+T(360,338,r,14.5,'#fff')}
  out+=TF(430,250,'ELIZA, 1966:',13,C.muted,'start')+TF(430,268,'about 200 lines of rules,',13,C.muted,'start')+TF(430,286,'no understanding.',13,C.muted,'start');
  return {svg:out,phase:f.say};
 }});

const H8_REPAIR={none:'No check',implicit:'Implicit confirm',explicit:'Explicit confirm'};
SCENE({id:'conversational-ui-repair',name:'Repair and discoverability in voice',tag:'No menu to look at',
 definition:'A voice interface cannot show its options, and it sometimes mishears. Good designs confirm what they heard in proportion to how unsure they are, and tell people what they can say.',
 example:'If the system is 95% sure, it can confirm implicitly (“A table for four at seven. Any dietary needs?”); at 50% it should ask outright (“Did you say four people?”).',
 research:['Yankelovich, N. (1996). How do users know what to say? ACM interactions 3(6).','Grice, H. P. (1975). Logic and conversation. In Cole & Morgan (eds), Syntax and Semantics 3.'],
 desc:'A voice booking dialogue with a recognition-confidence slider and three confirmation strategies, showing the turns taken and whether an error slips through.',
 dur:12,hint:'Change how sure the recogniser is and the confirmation strategy. Count the turns and whether a mistake gets through.',
 init:()=>({conf:55,strat:'explicit'}),
 watch(p){return {conf:p<.5?90:45,strat:['none','implicit','explicit'][Math.min(2,Math.floor((p*2%1)*3))]}},
 ui:[{range:'conf',label:'Recogniser confidence',min:20,max:99,get:s=>s.conf,act:'conf',show:v=>v+'%'},{choose:Object.entries(H8_REPAIR),label:'Strategy',get:s=>s.strat,act:'strat'}],
 on:{conf(s,v){s.conf=v},strat(s,v){s.strat=v}},
 draw(s){
  const wrong=s.conf<70,heard=wrong?'fourteen':'four';const turns=[['you','A table for four at seven, please.']];
  if(s.strat==='none'){turns.push(['sys',`Booked: ${heard} people at seven.`])}
  else if(s.strat==='implicit'){turns.push(['sys',`A table for ${heard} at seven. Any dietary needs?`]);if(wrong)turns.push(['you','No, four people, not fourteen!'],['sys','Sorry, four people at seven. Any dietary needs?'])}
  else{turns.push(['sys',`Did you say ${heard} people at seven?`]);turns.push(['you',wrong?'No, four.':'Yes.']);if(wrong)turns.push(['sys','Four people at seven. Booked.']);else turns.push(['sys','Booked.'])}
  const slipped=s.strat==='none'&&wrong;let out=heading(`${H8_REPAIR[s.strat]} at ${s.conf}% confidence`);
  turns.forEach(([who,t],i)=>{const y=56+i*48,me=who==='you';out+=R(me?250:30,y,320,38,me?C.blue:'#fff',me?C.blue:C.line,19)+TF(me?560:44,y+24,t,13.5,me?'#fff':C.ink,me?'end':'start')});
  out+=counter(30,300,'turns',turns.length,C.blue,110)+counter(150,300,'error slipped through',slipped?'yes':'no',slipped?C.coral:C.green,170);
  out+=R(340,292,230,62,'#fff',C.grid,8)+TF(455,312,'On screen you would see a menu.',12.5,C.muted)+TF(455,330,'By voice, people must guess',12.5,C.muted)+TF(455,346,'what they are allowed to say.',12.5,C.muted);
  return {svg:out,phase:slipped?'Without any confirmation the misheard “fourteen” goes straight into the booking: a silent error.':s.strat==='explicit'&&!wrong?'Asking outright when the system was already sure costs an extra question and answer for nothing: confirmation should match uncertainty.':s.strat==='implicit'&&!wrong?'Implicit confirmation repeats what was heard while moving on, so a correct hearing costs no extra turn.':'The check catches the mishearing, at the price of extra turns. Conversation is cooperative: people expect a partner to say as much as needed and no more.'};
 }});

SCENE({id:'conversational-ui-social',name:'The media equation',tag:'People treat computers socially',
 definition:'People respond to computers with the same social rules they use with other people, such as politeness and flattery, without believing the computer is a person.',
 example:'When a computer asked people to rate its own performance, their ratings were more positive than when a different computer, or paper, asked the same questions, as people are polite to a person face to face.',
 research:['Nass, C., Moon, Y. & Carney, P. (1999). Are people polite to computers? Responses to computer-based interviewing systems. Journal of Applied Social Psychology 29(5).','Reeves, B. & Nass, C. (1996). The Media Equation. Cambridge University Press.'],
 desc:'A tutoring computer, then an evaluation asked by the same computer, a different computer or on paper, with illustrative ratings showing the direction of the published result.',
 dur:10,hint:'Choose who asks for the evaluation. The bars show the direction of the result, not the study’s numbers.',
 init:()=>({who:'same'}),
 watch(p){return {who:['same','other','paper'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['same','Same computer asks'],['other','Another computer asks'],['paper','Paper form']],label:'Who asks',get:s=>s.who,act:'who'}],
 on:{who(s,v){s.who=v}},
 draw(s){
  let out=heading('Who asks how well the computer did?');
  const comp=(x,y,label,col)=>R(x,y,90,64,'#fff',col,8)+R(x+8,y+8,74,40,col,'none',4)+R(x+30,y+64,30,10,col,'none',2)+TF(x+45,y+96,label,13,C.ink);
  out+=comp(40,70,'tutor',C.blue)+TF(85,190,'1. It tutors you',13,C.muted);
  out+=arrow(140,100,190,100,C.line,2);
  if(s.who==='paper')out+=R(210,70,70,90,'#fff',C.ink,4)+range(5).map(i=>L(222,90+i*12,268,90+i*12,C.line,2)).join('')+TF(245,190,'2. Paper asks',13,C.muted);
  else out+=comp(200,70,s.who==='same'?'the same tutor':'another computer',s.who==='same'?C.blue:C.purple)+TF(245,190,'2. It asks you',13,C.muted);
  const vals={same:.8,other:.62,paper:.6};
  ['same','other','paper'].forEach((k,i)=>{const x=340+i*78,h=170*vals[k],on=k===s.who;out+=R(x,270-h,56,h,on?C.coral:'#d6e2ea','none',5)+TF(x+28,290,{same:'same',other:'another',paper:'paper'}[k],13,on?C.ink:C.muted,'middle',on?'font-weight="700"':'')});
  out+=TF(457,82,'Rating of the tutor',13,C.ink,'middle','font-weight="650"')+TF(457,320,'Illustrative: direction of the finding only',12.5,C.muted);
  return {svg:out,phase:s.who==='same'?'Asked by the same computer, people were kinder about it, just as they soften criticism to a person’s face.':'Asked by another machine or on paper, ratings of the same tutoring were less flattering. Reeves and Nass called this the media equation: media = real life.'};
 }});

/* ---- Brain–computer interfaces ---- */
const H8_GRID='ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789_';
function H8_speller(target,rounds,noise){
 const ti=H8_GRID.indexOf(target),tr=Math.floor(ti/6),tc=ti%6,ev=Array(12).fill(0),fr=[{fl:-1,ev:ev.slice(),guess:null}];const r=rng(97+ti*13+rounds*7+noise);
 for(let k=0;k<rounds;k++){const order=shuffled(range(12),31+k*17+ti);for(const fl of order){const isT=fl<6?fl===tr:fl-6===tc;const g=(r()+r()+r()-1.5)*noise/40;ev[fl]+=(isT?1:0)+g;
   const br=ev.slice(0,6).indexOf(Math.max(...ev.slice(0,6))),bc=ev.slice(6).indexOf(Math.max(...ev.slice(6)));fr.push({fl,ev:ev.slice(),guess:H8_GRID[br*6+bc],round:k+1})}}
 return fr;
}
SCENE({id:'brain-computer',name:'Brain–computer interface',tag:'Spelling with brain signals',
 definition:'A system that turns measured brain activity into commands, without muscle movement. The P300 speller flashes rows and columns of letters; the flash containing your letter produces a small, detectable brain response about 300 ms later.',
 example:'In 1988 Farwell and Donchin let people spell by counting flashes of the letter they wanted; the computer averaged the responses to find the row and column.',
 research:['Farwell, L. A. & Donchin, E. (1988). Talking off the top of your head: toward a mental prosthesis utilizing event-related brain potentials. Electroencephalography and Clinical Neurophysiology 70(6).','Vidal, J. J. (1973). Toward direct brain–computer communication. Annual Review of Biophysics and Bioengineering 2.'],
 desc:'A 6 × 6 grid of letters with one row or column flashing, bars of accumulated evidence for each row and column, and the current best guess.',
 dur:16,hint:'Press a letter to make it your target, set the noise and the number of rounds, then step through the flashes and watch the evidence build.',
 init:()=>({target:'H',rounds:3,noise:60}),
 ui:[{range:'rounds',label:'Rounds',min:1,max:6,get:s=>s.rounds,act:'rounds'},{range:'noise',label:'Noise',min:0,max:120,step:10,get:s=>s.noise,act:'noise'}],
 on:{pick(s,c){s.target=c},rounds(s,v){s.rounds=v},noise(s,v){s.noise=v}},
 trace(s){return H8_speller(s.target,s.rounds,s.noise)},
 draw(s,f,X){
  let out=heading(`Target “${s.target==='_'?'space':s.target}” · best guess ${f.guess?'“'+f.guess+'”':'—'}`);const gx=40,gy=56,c=40;
  for(let i=0;i<36;i++){const r=Math.floor(i/6),cc=i%6,lit=f.fl>=0&&(f.fl<6?f.fl===r:f.fl-6===cc),isT=H8_GRID[i]===s.target;
   out+=hit(X,'pick',H8_GRID[i],`Letter ${H8_GRID[i]}${isT?' (target)':''}`,R(gx+cc*c,gy+r*c,c-4,c-4,lit?'#fff2b3':'#14222b',isT?C.coral:'none',5)+TF(gx+cc*c+18,gy+r*c+24,H8_GRID[i]==='_'?'␣':H8_GRID[i],15,lit?C.ink:'#9fd3f5','middle','font-weight="650"'))}
  const mx=Math.max(1,...f.ev.map(Math.abs));
  ['rows','columns'].forEach((lab,g)=>{out+=TF(300,70+g*140,`Evidence for ${lab}`,13,C.ink,'start','font-weight="650"');for(let i=0;i<6;i++){const v=f.ev[g*6+i],y=78+g*140+i*18;out+=TF(300,y+13,g?'col '+(i+1):'row '+(i+1),12.5,C.muted,'start')+R(352,y+2,210,13,'#eef3f6','none',4)+R(352,y+2,Math.max(0,210*v/mx),13,f.fl===g*6+i?C.amber:C.blue,'none',4)}});
  out+=TF(40,316,f.fl<0?'Ready: count the flashes of your letter.':`Flash ${X.k} of ${X.n-1}${f.round?' · round '+f.round:''}`,13.5,C.ink,'start');
  return {svg:out,phase:f.fl<0?'Each row and column will flash in a shuffled order. Only flashes containing the target letter add a real response; every flash adds noise.':`The ${f.fl<6?'row':'column'} just flashed ${(f.fl<6?Math.floor(H8_GRID.indexOf(s.target)/6)===f.fl:H8_GRID.indexOf(s.target)%6===f.fl-6)?'contains the target, so its evidence jumps':'does not contain the target; only noise is added'}. The best row × best column gives the guess.`};
 }});

function H8_epoch(i,t){const r=rng(1000+i*7919+Math.round(t*1000));let n=0;for(let k=0;k<4;k++)n+=r();return (n-2)*1.6}
SCENE({id:'brain-computer-averaging',name:'Averaging brain signals',tag:'Signal grows, noise cancels',
 definition:'A single brain response is buried in noise. Averaging many responses time-locked to the same event keeps the response and cancels the noise, which shrinks roughly with the square root of the number of trials.',
 example:'Averaging 16 trials cuts the noise to about a quarter; 64 trials to an eighth. That is why spellers repeat each flash several times, trading speed for accuracy.',
 research:['Farwell, L. A. & Donchin, E. (1988). Talking off the top of your head. Electroencephalography and Clinical Neurophysiology 70(6).','Wolpaw, J. R., Birbaumer, N., McFarland, D. J., Pfurtscheller, G. & Vaughan, T. M. (2002). Brain–computer interfaces for communication and control. Clinical Neurophysiology 113(6).'],
 desc:'A single noisy trial in grey, the average of N trials in blue and the true response, a peak near 300 ms, dashed.',
 dur:10,hint:'Increase the number of trials averaged. The blue average settles onto the dashed true response.',
 init:()=>({n:4}),
 watch(p){return {n:Math.max(1,Math.round(Math.pow(2,p*6)))}},
 ui:[{range:'n',label:'Trials averaged',min:1,max:64,get:s=>s.n,act:'n'},{b:'×2',act:'dbl',aria:'Double the trials'}],
 on:{n(s,v){s.n=v},dbl(s){s.n=Math.min(64,s.n*2)}},
 draw(s){
  const truth=t=>2.2*Math.exp(-Math.pow((t-300)/60,2)),x0=60,w=500,y0=210,k=30,T=800,X=t=>x0+w*t/T;let out=heading(`Average of ${s.n} trial${s.n>1?'s':''}`);
  const curve=(fn,col,wd,extra)=>P(range(81).map(i=>{const t=i*10;return (i?'L':'M')+fmt(X(t))+' '+fmt(y0-k*fn(t))}).join(''),col,wd,'none',extra);
  out+=L(x0,y0,x0+w,y0,C.grid,1)+L(X(300),70,X(300),330,C.line,1,'stroke-dasharray="3 4"')+TF(X(300),64,'300 ms',13,C.muted);
  out+=curve(t=>truth(t)+H8_epoch(0,t),'#b9c9d3',1.5,'')+curve(t=>{let a=0;for(let i=0;i<s.n;i++)a+=truth(t)+H8_epoch(i,t);return a/s.n},C.blue,3,'')+curve(truth,C.coral,2,'stroke-dasharray="6 4"');
  [0,200,400,600,800].forEach(t=>out+=TF(X(t),y0+108,t+' ms',12.5,C.muted));
  out+=TF(70,350,'one trial',13,'#8fa3b0','start','font-weight="650"')+TF(160,350,'average',13,C.blue,'start','font-weight="650"')+TF(240,350,'true response',13,C.coral,'start','font-weight="650"');
  out+=TF(560,350,`noise ≈ 1/√${s.n} = ${(1/Math.sqrt(s.n)).toFixed(2)} of one trial`,13,C.ink,'end');
  return {svg:out,phase:`With ${s.n} trial${s.n>1?'s':''} the noise is about ${(100/Math.sqrt(s.n)).toFixed(0)}% of a single trial’s. The response is always there; averaging lets it show.`};
 }});

SCENE({id:'brain-computer-itr',name:'Information transfer rate',tag:'How many bits per minute?',
 definition:'A measure of a brain–computer interface’s speed in bits per minute. It depends on the number of choices, the accuracy and how many selections can be made each minute.',
 example:'Choosing among 36 letters with 90% accuracy at 4 selections a minute gives about 17 bits a minute; typing on a keyboard is easily ten times faster.',
 research:'Wolpaw, J. R. et al. (2002). Brain–computer interfaces for communication and control. Clinical Neurophysiology 113(6). The bits-per-selection formula is from this line of work.',
 desc:'The bits-per-selection formula with sliders for choices, accuracy and speed, and a log-scale comparison with typing.',
 dur:10,hint:'Change the number of choices, the accuracy and selections per minute. Below chance accuracy, a selection carries no information.',
 init:()=>({n:36,acc:90,spm:4}),
 watch(p){return {n:36,acc:Math.round(40+59*p),spm:4}},
 ui:[{range:'n',label:'Choices N',min:2,max:64,get:s=>s.n,act:'n'},{range:'acc',label:'Accuracy P (%)',min:5,max:100,get:s=>s.acc,act:'acc'},{range:'spm',label:'Selections/min',min:1,max:30,get:s=>s.spm,act:'spm'}],
 on:{n(s,v){s.n=v},acc(s,v){s.acc=v},spm(s,v){s.spm=v}},
 draw(s){
  const N=s.n,Pp=s.acc/100;let B=Math.log2(N);if(Pp<1)B+=(Pp>0?Pp*Math.log2(Pp):0)+(1-Pp)*Math.log2((1-Pp)/(N-1));if(Pp<=1/N)B=0;B=Math.max(0,B);
  const bpm=B*s.spm;let out=heading(`${B.toFixed(2)} bits per selection × ${s.spm} = ${bpm.toFixed(1)} bits per minute`);
  out+=R(30,52,540,66,'#fff',C.grid,8)+TMF(300,80,'B = log₂N + P·log₂P + (1−P)·log₂((1−P)/(N−1))',15,C.ink)+TF(300,104,`N = ${N} choices, P = ${Pp.toFixed(2)}${Pp<=1/N?' (at or below chance)':''}`,13,C.muted);
  const items=[['This interface',bpm,C.coral],['Morse by switch (approx.)',60,C.muted],['Typing, 40 words/min (approx.)',900,C.blue],['Speech (approx.)',2400,C.green]];
  const lx=v=>230+330*Math.log10(Math.max(1,v))/Math.log10(5000);
  items.forEach(([n,v,col],i)=>{const y=150+i*44;out+=TF(220,y+15,n,13,C.ink,'end')+R(230,y,330,22,'#eef3f6','none',5)+R(230,y,Math.max(2,lx(v)-230),22,col,'none',5)+TF(Math.min(552,lx(v)+6),y+16,v<10?v.toFixed(1):Math.round(v),12.5,lx(v)>500?'#fff':C.ink,lx(v)>500?'end':'start')});
  [1,10,100,1000].forEach(v=>out+=TF(lx(v),336,v,12.5,C.muted));out+=TF(560,354,'bits per minute (log scale)',12.5,C.muted,'end');
  return {svg:out,phase:`Each selection carries at most log₂${N} = ${Math.log2(N).toFixed(2)} bits; errors reduce that. Rough comparisons on the chart are approximate. Brain–computer interfaces matter most to people who cannot use their muscles at all.`};
 }});

/* ---- AI agents ---- */
SCENE({id:'ai-agents',name:'Trust in automation',tag:'Calibrated trust',
 definition:'Trust should match how reliable an automated agent actually is. Too much trust leads to misuse, relying on it when it is wrong; too little leads to disuse, ignoring it when it is right.',
 example:'A driver who stops watching the road because the assistant is “usually fine” over-trusts it; a doctor who ignores a well-tested alert under-trusts it.',
 research:['Lee, J. D. & See, K. A. (2004). Trust in automation: designing for appropriate reliance. Human Factors 46(1).','Parasuraman, R. & Riley, V. (1997). Humans and automation: use, misuse, disuse, abuse. Human Factors 39(2).'],
 desc:'A chart of agent reliability against the user’s trust, with a diagonal of calibrated trust and regions of over-trust and under-trust, and a dot for the chosen pair.',
 dur:10,hint:'Set how reliable the agent is and how much the person trusts it. Aim for the diagonal.',
 init:()=>({rel:70,trust:90}),
 watch(p){const a=2*Math.PI*p;return {rel:Math.round(55+35*Math.cos(a)),trust:Math.round(55+35*Math.sin(a+.6))}},
 ui:[{range:'rel',label:'Agent reliability',min:0,max:100,get:s=>s.rel,act:'rel',show:v=>v+'%'},{range:'trust',label:'Person’s trust',min:0,max:100,get:s=>s.trust,act:'trust',show:v=>v+'%'}],
 on:{rel(s,v){s.rel=v},trust(s,v){s.trust=v}},
 draw(s){
  const gx=70,gy=320,g=250,X=v=>gx+g*v/100,Y=v=>gy-g*v/100,gap=s.trust-s.rel;let out=heading(Math.abs(gap)<=10?'Calibrated trust':gap>0?'Over-trust: risk of misuse':'Under-trust: risk of disuse');
  out+=`<polygon points="${X(0)},${Y(0)} ${X(0)},${Y(100)} ${X(100)},${Y(100)}" fill="${C.coralp}"/><polygon points="${X(0)},${Y(0)} ${X(100)},${Y(0)} ${X(100)},${Y(100)}" fill="${C.pale}"/>`;
  out+=L(X(0),Y(0),X(100),Y(100),C.green,3)+L(X(0),Y(0),X(100),Y(0),C.ink,1.5)+L(X(0),Y(0),X(0),Y(100),C.ink,1.5);
  out+=TF(X(28),Y(80),'over-trust',14,C.coral,'middle','font-weight="650"')+TF(X(75),Y(20),'under-trust',14,C.blue,'middle','font-weight="650"')+TF(X(62),Y(66),'calibrated',13,C.green,'middle','font-weight="650"');
  out+=TF(X(50),gy+30,'agent reliability →',13,C.muted)+`<text x="${gx-34}" y="${Y(50)}" font-size="13" fill="${C.muted}" text-anchor="middle" transform="rotate(-90 ${gx-34} ${Y(50)})">trust →</text>`;
  out+=Ci(X(s.rel),Y(s.trust),10,Math.abs(gap)<=10?C.green:gap>0?C.coral:C.blue,'#fff');
  const lines=Math.abs(gap)<=10?['Reliance matches ability:','use it when it is right,','check it when it is not.']:gap>0?['The person relies on the','agent more than it deserves:','its errors go unnoticed.']:['The person ignores an','agent that is usually right:','its help is wasted.'];
  lines.forEach((l,i)=>out+=TF(360,120+i*22,l,14,C.ink,'start'));
  out+=TF(360,220,`reliability ${s.rel}%, trust ${s.trust}%`,13,C.muted,'start');
  return {svg:out,phase:'Lee and See argued that the goal is not more trust but appropriate trust. Showing how reliable an agent is, and when, helps people calibrate.'};
 }});

const H8_LOA=['The computer offers no help: the person decides and acts.','It offers a complete set of options,','or narrows the options down to a few,','or suggests one option,','and carries it out if the person approves,','or gives the person limited time to veto before acting,','or acts, then necessarily tells the person,','or tells the person only if asked,','or tells the person only if it decides to.','It decides and acts alone, ignoring the person.'];
SCENE({id:'ai-agents-levels',name:'Levels of automation',tag:'Who decides, who acts?',
 definition:'A scale from the person doing everything to the computer doing everything, with steps in between for suggesting, approving, vetoing and reporting.',
 example:'An email assistant that drafts a reply for you to send is around level 4–5; one that sends it and tells you afterwards is level 7.',
 research:['Sheridan, T. B. & Verplank, W. L. (1978). Human and computer control of undersea teleoperators. MIT Man–Machine Systems Laboratory.','Parasuraman, R., Sheridan, T. B. & Wickens, C. D. (2000). A model for types and levels of human interaction with automation. IEEE Trans. Systems, Man, and Cybernetics A 30(3).'],
 desc:'The ten levels of automation listed from manual to fully autonomous, with the chosen level highlighted and an email example of what happens at that level.',
 dur:12,hint:'Move through the ten levels. Notice where the person stops approving each action and starts only being told.',
 init:()=>({lvl:5}),
 watch(p){return {lvl:1+Math.min(9,Math.floor(p*10))}},
 ui:[{range:'lvl',label:'Level',min:1,max:10,get:s=>s.lvl,act:'lvl'}],
 on:{lvl(s,v){s.lvl=v},set(s,v){s.lvl=Number(v)}},
 draw(s,f,X){
  let out=heading(`Level ${s.lvl} of 10`);
  H8_LOA.forEach((t,i)=>{const y=48+i*27,on=i+1===s.lvl,col=i<4?C.blue:i<6?C.purple:C.coral;out+=hit(X,'set',i+1,`Level ${i+1}: ${t}`,R(30,y,370,23,on?col:'#fff',on?col:C.grid,6)+TF(42,y+16,`${i+1}`,13,on?'#fff':col,'start','font-weight="700"')+TF(62,y+16,t,12.5,on?'#fff':C.ink,'start'))});
  const ex={1:'You write and send every reply.',2:'It lists every possible reply.',3:'It offers three short replies.',4:'It drafts one reply for you.',5:'It sends the draft when you press OK.',6:'It sends in 10 s unless you cancel.',7:'It sends, then tells you.',8:'It sends; you can look it up.',9:'It sends; it mentions some.',10:'It handles your email alone.'}[s.lvl];
  out+=R(415,60,160,150,'#fff',C.grid,8)+TF(495,82,'Email example',13,C.ink,'middle','font-weight="650"');
  ex.match(/.{1,22}(\s|$)/g).forEach((l,i)=>out+=TF(495,108+i*20,l.trim(),13,C.ink));
  out+=TF(495,240,s.lvl<=5?'Person approves':s.lvl===6?'Person can veto':'Person is informed',14,s.lvl<=5?C.blue:s.lvl===6?C.purple:C.coral,'middle','font-weight="700"');
  return {svg:out,phase:`Level ${s.lvl}: ${H8_LOA[s.lvl-1]} Parasuraman, Sheridan and Wickens added that the right level can differ for gathering information, analysing it, deciding and acting.`};
 }});

const H8_SUGG=[[96,1],[92,1],[88,1],[85,0],[83,1],[78,1],[72,0],[70,1],[64,1],[58,0],[52,1],[40,0]];
SCENE({id:'ai-agents-confidence',name:'Confidence and automation bias',tag:'When to accept a suggestion',
 definition:'Automation bias is accepting an automated suggestion without checking it. Showing the agent’s confidence lets people check the doubtful cases, but only if the confidence is honest.',
 example:'With a well-calibrated agent, checking only suggestions below 80% confidence catches most errors (three of four in this example) with just over half the effort; with an over-confident agent, the same rule lets errors through.',
 research:['Parasuraman, R. & Manzey, D. H. (2010). Complacency and bias in human use of automation: an attentional integration. Human Factors 52(3).','Horvitz, E. (1999). Principles of mixed-initiative user interfaces. ACM CHI.'],
 desc:'Twelve suggestions with the agent’s stated confidence and whether each was right, a threshold below which the person checks, and counts of checks made and errors let through.',
 dur:12,hint:'Set your threshold: suggestions below it get checked. Then switch to an over-confident agent and see the same rule fail.',
 init:()=>({th:80,over:0}),
 watch(p){return {th:Math.round(100-90*p),over:0}},
 ui:[{range:'th',label:'Check below (%)',min:0,max:100,step:5,get:s=>s.th,act:'th'},{choose:[[0,'Honest confidence'],[1,'Over-confident agent']],label:'Agent',get:s=>s.over,act:'over'}],
 on:{th(s,v){s.th=v},over(s,v){s.over=Number(v)}},
 draw(s){
  const items=H8_SUGG.map(([c,ok])=>({c:s.over?Math.min(99,Math.round(c*.35+65)):c,ok}));let checks=0,missed=0,caught=0;
  let out=heading(s.over?'Over-confident agent':'Honestly calibrated agent');
  items.forEach((it,i)=>{const x=40+(i%6)*88,y=60+Math.floor(i/6)*110,chk=it.c<s.th;if(chk)checks++;if(!it.ok&&chk)caught++;if(!it.ok&&!chk)missed++;
   out+=R(x,y,78,92,chk?'#fff':C.pale,!it.ok&&!chk?C.coral:chk?C.amber:C.grid,8)+TB(x+39,y+30,it.c+'%',17,C.ink)+TF(x+39,y+52,it.ok?'right':'wrong',13,it.ok?C.green:C.coral,'middle','font-weight="650"')+TF(x+39,y+76,chk?'checked':'accepted',12.5,chk?C.amber:C.muted)});
  out+=counter(40,290,'checks made',`${checks} of 12`,C.amber,140)+counter(196,290,'errors caught',caught,C.green,130)+counter(342,290,'errors let through',missed,missed?C.coral:C.green,150);
  return {svg:out,phase:s.over?'This agent says 80–99% whatever happens, so a confidence threshold no longer separates good suggestions from bad. People then either check everything or accept errors: automation bias.':`Checking below ${s.th}% means ${checks} checks and ${missed} error${missed===1?'':'s'} accepted. Horvitz argued an assistant should act, ask or stay quiet depending on how sure it is and what a mistake would cost.`};
 }});

/* ---- Calm and ubiquitous computing ---- */
SCENE({id:'calm-technology',name:'Calm technology',tag:'Information at the edge of attention',
 definition:'Technology designed to inform without demanding attention, by moving between the periphery of attention, where we notice without focusing, and the centre when it matters.',
 example:'The “dangling string” at Xerox PARC was a plastic cord on a motor that twitched with network traffic: busy network, busy string, noticed from the corner of the eye without a single alert.',
 research:['Weiser, M. & Brown, J. S. (1996). Designing calm technology. PowerGrid Journal 1(1).','Weiser, M. (1991). The computer for the 21st century. Scientific American 265(3).'],
 desc:'A wiggling string whose motion grows with network traffic, beside rings of attention from centre to periphery and a count of interruptions for an ambient display versus pop-up alerts.',
 dur:10,hint:'Change the traffic and the way it is shown. An ambient display stays in the periphery until it becomes unusual; pop-ups interrupt every time.',
 init:()=>({traffic:40,style:'ambient'}),
 watch(p){return {traffic:Math.round(50+45*Math.sin(2*Math.PI*p*1.5)),style:p<.6?'ambient':'popup',ph:p}},
 ui:[{range:'traffic',label:'Network traffic',min:0,max:100,get:s=>s.traffic,act:'traffic',show:v=>v+'%'},{choose:[['ambient','Ambient string'],['popup','Pop-up alerts']],label:'Display',get:s=>s.style,act:'style'}],
 on:{traffic(s,v){s.traffic=v},style(s,v){s.style=v}},
 draw(s){
  const a=s.traffic/100,ph=(s.ph||0)*30;let out=heading(s.style==='ambient'?'An ambient display at the periphery':'Pop-up alerts at the centre');
  out+=L(130,52,130,62,C.ink,4)+R(115,44,30,12,C.ink,'none',3);
  out+=P(range(31).map(i=>{const y=62+i*8.5;return (i?'L':'M')+fmt(130+Math.sin(i*.9+ph+a*6)*a*30*(i/30))+' '+fmt(y)}).join(''),C.coral,3);
  out+=TF(130,340,`traffic ${s.traffic}%`,13,C.muted);
  const cx=420,cy=200;[150,100,50].forEach((r,i)=>out+=Ci(cx,cy,r,['#f3f7fa','#e6eff5','#d4e5f0'][i],C.grid));
  out+=TF(cx,cy+4,'centre: your task',13,C.ink,'middle','font-weight="650"')+TF(cx,cy-120,'periphery',13,C.muted);
  const unusual=s.traffic>85,inCentre=s.style==='popup'||unusual;
  out+=Ci(inCentre?cx+30:cx+110,inCentre?cy+26:cy+60,12,C.coral)+TF(inCentre?cx+30:cx+110,inCentre?cy+52:cy+86,s.style==='popup'?'alert!':'string',12.5,C.coral);
  const interrupts=s.style==='popup'?Math.round(s.traffic/10):(unusual?1:0);
  out+=counter(470,300,'interruptions/hour',interrupts,interrupts>3?C.coral:C.green,120);
  return {svg:out,phase:s.style==='ambient'?(unusual?'Unusually heavy traffic makes the string whirl, so it moves to the centre of attention by itself, which is exactly when you need to know.':'The string is noticed without being looked at. Weiser and Brown called this engaging the periphery: we stay aware without being interrupted.'):'Every change triggers an alert in the centre of attention, so information becomes interruption.'};
 }});

SCENE({id:'calm-technology-ubiquitous',name:'Ubiquitous computing',tag:'Many computers per person',
 definition:'Weiser’s vision of computers so numerous and so embedded in everyday things that they disappear into the background. He described three waves: many people sharing one computer, one person to one computer, then many computers to one person.',
 example:'A 1960s office shared one mainframe; a 1990s desk had one PC; today a person may carry a phone, a watch and earbuds and live among thermostats, cars and speakers that all compute.',
 research:['Weiser, M. (1991). The computer for the 21st century. Scientific American 265(3).','Weiser, M. & Brown, J. S. (1996). The coming age of calm technology. Xerox PARC.'],
 desc:'A timeline from 1960 to 2030 with the three waves of computing and figures for people and computers, illustrating the shift from many people per computer to many computers per person.',
 dur:10,hint:'Move through the years. The figures are an illustration of Weiser’s three waves, not measured counts.',
 init:()=>({year:1995}),
 watch(p){return {year:Math.round(1960+70*p)}},
 ui:[{range:'year',label:'Year',min:1960,max:2030,get:s=>s.year,act:'year'}],
 on:{year(s,v){s.year=v}},
 draw(s){
  const y=s.year,wave=y<1980?0:y<2005?1:2,names=['Mainframe: many people, one computer','Personal computer: one person, one computer','Ubiquitous: one person, many computers'];
  let out=heading(names[wave]);const tx=50,tw=500,X=v=>tx+tw*(v-1960)/70;
  out+=L(tx,300,tx+tw,300,C.line,3);[1960,1980,2005,2030].forEach(v=>out+=L(X(v),294,X(v),306,C.line,2)+TF(X(v),324,v,13,C.muted));
  [['mainframe',1960,1980],['PC',1980,2005],['ubiquitous',2005,2030]].forEach(([n,a,b],i)=>out+=R(X(a),270,X(b)-X(a),18,i===wave?[C.blue,C.purple,C.green][i]:'#e6eef3','none',4)+TF((X(a)+X(b))/2,284,n,12.5,i===wave?'#fff':C.muted));
  out+=`<polygon points="${X(y)},264 ${X(y)-8},252 ${X(y)+8},252" fill="${C.coral}"/>`+TF(X(y),246,y,13,C.coral,'middle','font-weight="700"');
  const person=(x,yy)=>Ci(x,yy,8,C.ink)+P(`M${x-10} ${yy+28}Q${x} ${yy+6} ${x+10} ${yy+28}`,C.ink,3);
  const comp=(x,yy,sz=1)=>R(x-14*sz,yy-10*sz,28*sz,20*sz,C.blue,'none',3)+R(x-4*sz,yy+10*sz,8*sz,5*sz,C.blue,'none',1);
  if(wave===0){out+=R(270,70,60,100,C.blue,'none',4)+TF(300,186,'one mainframe',13,C.blue);for(let i=0;i<8;i++)out+=person(120+i*50+(i>3?120:0),110+(i%2)*40)}
  else if(wave===1){for(let i=0;i<3;i++){out+=person(170+i*130,140)+comp(200+i*130,128)}out+=TF(300,206,'one each',13,C.purple)}
  else{out+=person(300,120);[[240,90],[360,90],[220,150],[380,150],[260,200],[340,200],[300,70],[300,210]].forEach(([x,yy],i)=>out+=comp(x,yy,.6));out+=TF(300,236,'phone, watch, car, home…',13,C.green)}
  return {svg:out,phase:wave===2?'“The most profound technologies are those that disappear,” Weiser wrote. Many computers, few of them noticed as computers.':wave===1?'One person, one computer: the desktop era where interface design was mostly about a single screen.':'Many people take turns on one expensive machine, as in the early chapters of this route.'};
 }});

const H8_BLDG=[{id:'A',x:120,y:150,w:60,d:50,h:70},{id:'B',x:270,y:120,w:50,d:70,h:110},{id:'C',x:200,y:240,w:80,d:40,h:40}];
SCENE({id:'calm-technology-tangible',name:'Tangible interfaces',tag:'Grasping digital information',
 definition:'Interfaces where physical objects stand for digital information and are manipulated by hand, with the computer responding around them.',
 example:'In the Urp urban-planning table, architects moved wooden building models while a projector drew each building’s computed shadow on the table for the chosen time of day.',
 research:['Ishii, H. & Ullmer, B. (1997). Tangible bits: towards seamless interfaces between people, bits and atoms. ACM CHI.','Underkoffler, J. & Ishii, H. (1999). Urp: a luminous-tangible workbench for urban planning and design. ACM CHI.'],
 desc:'A table seen from above with three building blocks and their projected shadows for a chosen sun direction and height.',
 dur:11,hint:'Pick up a building (press it) and move it with the arrows, or change the time of day. The shadows are recomputed around the physical blocks.',
 init:()=>({hour:15,sel:'B',pos:{A:[120,150],B:[270,120],C:[200,240]}}),
 watch(p){return {hour:+(8+10*p).toFixed(1),sel:null,pos:{A:[120,150],B:[270,120],C:[200,240]}}},
 ui:[{range:'hour',label:'Time of day',min:7,max:19,step:0.5,get:s=>s.hour,act:'hour',show:v=>`${Math.floor(v)}:${v%1?'30':'00'}`},{b:'←',act:'mv',arg:'-1,0',aria:'Move left'},{b:'→',act:'mv',arg:'1,0',aria:'Move right'},{b:'↑',act:'mv',arg:'0,-1',aria:'Move up'},{b:'↓',act:'mv',arg:'0,1',aria:'Move down'}],
 on:{hour(s,v){s.hour=v},pick(s,id){s.sel=id},mv(s,a){if(!s.sel)return;const [dx,dy]=String(a).split(',').map(Number);const p=s.pos[s.sel];p[0]=clamp(p[0]+dx*20,50,330);p[1]=clamp(p[1]+dy*20,70,280)}},
 draw(s,f,X){
  const az=(s.hour-12)*15*H8_DEG,el=Math.max(8,60-Math.abs(s.hour-12)*8)*H8_DEG,len=1/Math.tan(el),dx=-Math.sin(az)*len,dy=Math.cos(az)*len*.6;
  let out=heading(`Shadows at ${Math.floor(s.hour)}:${s.hour%1?'30':'00'}`);out+=R(30,50,380,290,'#e9e4d8','#b8ad96',10);
  // Each shadow is the footprint swept along the sun direction: the offset footprint plus one quad per edge.
  let sh='';for(const b of H8_BLDG){const [x,y]=s.pos[b.id],sx=dx*b.h*.6,sy=dy*b.h*.6,c=[[x,y],[x+b.w,y],[x+b.w,y+b.d],[x,y+b.d]];
   sh+=`<polygon points="${c.map(q=>fmt(q[0]+sx)+','+fmt(q[1]+sy)).join(' ')}"/>`;for(let i=0;i<4;i++){const a=c[i],q=c[(i+1)%4];sh+=`<polygon points="${fmt(a[0])},${fmt(a[1])} ${fmt(q[0])},${fmt(q[1])} ${fmt(q[0]+sx)},${fmt(q[1]+sy)} ${fmt(a[0]+sx)},${fmt(a[1]+sy)}"/>`}}
  out+=`<g fill="#3f4a5a" opacity=".35">${sh}</g>`;
  for(const b of H8_BLDG){const [x,y]=s.pos[b.id],on=s.sel===b.id;out+=hit(X,'pick',b.id,`Building ${b.id}${on?' (held)':''}`,R(x,y,b.w,b.d,on?'#d9a66b':'#c49563',on?C.coral:'#8a6538',3)+TF(x+b.w/2,y+b.d/2+5,b.id,14,'#fff','middle','font-weight="700"'))}
  const sunx=220+170*Math.sin(az),suny=60;out+=Ci(sunx,suny,9,'#ffd24a','#c79100');
  out+=TF(420,80,'Physical blocks',13,C.ink,'start','font-weight="650"')+TF(420,100,'on the table; digital',13,C.muted,'start')+TF(420,118,'shadows drawn around',13,C.muted,'start')+TF(420,136,'them by a projector.',13,C.muted,'start');
  out+=TF(420,190,s.sel?`Holding ${s.sel}: use the arrows`:'Press a block to pick it up',13,C.coral,'start');
  return {svg:out,phase:'The model on the table is both the input and part of the display: moving a block is the command, and the answer appears around it. Ishii and Ullmer called this giving bits a physical form.'};
 }});
