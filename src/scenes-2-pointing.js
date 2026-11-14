/* ===================== Era 2 · Pointing and linking (1960s) ===================== */
// Shared helpers for this era (prefix H2_).
const H2_CRT={bg:'#0c1d18',ink:'#7dffb0',dim:'#2e6b52',glow:'#b8ffd4'};
// A phosphor screen: a dark rounded panel with a faint scanline frame.
function H2_crt(x,y,w,h,label){return R(x,y,w,h,H2_CRT.bg,'#33433d',14)+(label?TF(x+12,y+h-10,label,13,H2_CRT.dim,'start'):'')}
const H2_rad=d=>d*Math.PI/180;
// Plot frame: returns {svg, px, py}. x and y ranges start at 0.
function H2_plot(x,y,w,h,xmax,ymax,xlab,ylab,xticks,yticks){
 const px=v=>x+w*clamp(v/xmax,0,1),py=v=>y+h-h*clamp(v/ymax,0,1);
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const t of xticks)s+=L(px(t),y+h,px(t),y+h+5,C.line,1.5)+TF(px(t),y+h+18,t,13,C.muted);
 for(const t of yticks)s+=L(x-5,py(t),x,py(t),C.line,1.5)+L(x,py(t),x+w,py(t),'#eef3f6',1)+TF(x-8,py(t)+5,t,13,C.muted,'end');
 s+=TF(x+w/2,y+h+34,xlab,13,C.muted)+TF(x-34,y+h/2,ylab,13,C.muted,'middle',`transform="rotate(-90 ${x-34} ${y+h/2})"`);
 return {svg:s,px,py};
}
// Least-squares line y = a + b·x; null if there is too little spread.
function H2_fit(pts){
 if(pts.length<3)return null;const n=pts.length,mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n;
 const sxx=sum(pts.map(p=>(p[0]-mx)**2));if(sxx<.05)return null;
 const b=sum(pts.map(p=>(p[0]-mx)*(p[1]-my)))/sxx;return {a:my-b*mx,b};
}
const H2_mean=a=>a.length?sum(a)/a.length:0;
const H2_ms=s=>Math.round(s*1000)+' ms';
// A pointer arrow (the cursor), tip at (x,y).
const H2_cursor=(x,y,col=C.ink)=>`<path d="M${fmt(x)} ${fmt(y)}l0 18l5 -5l4 9l4 -2l-4 -9l7 0z" fill="#fff" stroke="${col}" stroke-width="1.6" stroke-linejoin="round"/>`;

/* ---------------- Lesson: Sketchpad (1963) ---------------- */
const H2_SK={a0:[50,250],angA:25,lenA:190,b0:[220,312]};
function H2_skSolve(s){let ang=s.ang,len=s.len;if(s.con==='parallel'||s.con==='both')ang=H2_SK.angA;if(s.con==='perpendicular')ang=H2_SK.angA+90;if(s.con==='equal'||s.con==='both')len=H2_SK.lenA;return {ang,len}}
const H2_end=(p,ang,len)=>[p[0]+len*Math.cos(H2_rad(ang)),p[1]-len*Math.sin(H2_rad(ang))];
SCENE({id:'sketchpad',name:'Sketchpad constraints',tag:'Draw roughly, let the machine make it exact',
 definition:'Ivan Sutherland’s Sketchpad (1963) let a person draw on a screen with a light pen and then state constraints, such as “these lines are parallel”, which the computer kept true.',
 example:'Draw a line by hand at roughly 70°, then declare it parallel to another line: Sketchpad rotates it to exactly match. The drawing records relationships, not just ink.',
 research:'Sutherland, I. E. (1963). Sketchpad: A man–machine graphical communication system. PhD thesis, MIT.',
 desc:'A phosphor screen with a fixed line A and a hand-drawn line B; a chosen constraint snaps B into an exact relationship with A, leaving the rough version as a dashed ghost.',
 dur:10,hint:'Set line B’s rough angle and length as if drawn by hand, then choose a constraint and watch Sketchpad satisfy it.',
 init:()=>({ang:70,len:120,con:'none'}),
 watch(p){const cons=['none','parallel','perpendicular','equal','both'],i=Math.min(4,Math.floor(p*5));return {ang:lerp(80,64,smooth(p*5)),len:120,con:cons[i],mix:smooth((p*5-i)*2.5)}},
 ui:[{range:'ang',label:'Rough angle',min:0,max:180,get:s=>s.ang,act:'ang',show:v=>v+'°'},{range:'len',label:'Rough length',min:60,max:200,get:s=>s.len,act:'len'},
  {choose:[['none','None'],['parallel','Parallel'],['perpendicular','Perpendicular'],['equal','Equal length'],['both','Parallel + equal']],label:'Constraint',get:s=>s.con,act:'con'}],
 on:{ang(s,v){s.ang=v},len(s,v){s.len=v},con(s,v){s.con=v}},
 draw(s,f,X){
  const mix=s.mix===undefined?1:s.mix,sol=H2_skSolve(s),ang=lerp(s.ang,sol.ang,mix),len=lerp(s.len,sol.len,mix);
  let out=heading('Sketchpad: state the relationship, not the coordinates')+H2_crt(20,48,390,312,'light pen display');
  const a1=H2_end(H2_SK.a0,H2_SK.angA,H2_SK.lenA),b1=H2_end(H2_SK.b0,ang,len),g1=H2_end(H2_SK.b0,s.ang,s.len);
  out+=L(H2_SK.a0[0],H2_SK.a0[1],a1[0],a1[1],H2_CRT.ink,3)+TF(a1[0]+8,a1[1]-4,'A',15,H2_CRT.glow,'start');
  if(s.con!=='none')out+=L(H2_SK.b0[0],H2_SK.b0[1],g1[0],g1[1],H2_CRT.dim,2,'stroke-dasharray="5 5"');
  out+=L(H2_SK.b0[0],H2_SK.b0[1],b1[0],b1[1],H2_CRT.glow,3)+Ci(H2_SK.b0[0],H2_SK.b0[1],4,H2_CRT.glow)+TF(H2_SK.b0[0]-12,H2_SK.b0[1]+4,'B',15,H2_CRT.glow,'end');
  // The light pen touching the end of B.
  out+=L(b1[0]+4,b1[1]-4,b1[0]+30,b1[1]-40,'#c9c9c9',5)+Ci(b1[0]+2,b1[1]-2,3,'#ffd24a');
  const names={none:'none',parallel:'B ∥ A',perpendicular:'B ⟂ A',equal:'|B| = |A|',both:'B ∥ A and |B| = |A|'};
  out+=R(426,60,160,236,'#fff',C.grid,10)+TB(506,86,'Constraint',15,C.ink)+TB(506,112,names[s.con],15,s.con==='none'?C.muted:C.green);
  out+=T(436,148,'Drawn',13,C.muted,'start')+TM(436,170,`${Math.round(s.ang)}°, ${Math.round(s.len)}`,15,C.ink,'start');
  out+=T(436,204,'Kept',13,C.muted,'start')+TM(436,226,`${Math.round(ang)}°, ${Math.round(len)}`,15,C.green,'start','font-weight="700"');
  out+=T(436,262,'A is 25°, 190 long',13,C.muted,'start');
  return {svg:out,phase:s.con==='none'?'Without constraints, B is exactly as wobbly as the hand that drew it.':`Sketchpad satisfies “${names[s.con]}” by moving B, and keeps it true if A changes. The dashed line is what the hand drew.`};
 }});

// A master shape and its instances: editing the master changes every instance.
function H2_shapePath(type,n,cx,cy,r,rot=0){
 const pts=[];if(type==='star'){for(let i=0;i<2*n;i++){const a=rot+i*Math.PI/n-Math.PI/2,rr=i%2?r*.45:r;pts.push([cx+rr*Math.cos(a),cy+rr*Math.sin(a)])}}
 else if(type==='flower'){let d='';for(let i=0;i<n;i++){const a=rot+i*2*Math.PI/n,x=cx+r*.55*Math.cos(a),y=cy+r*.55*Math.sin(a);d+=`M${fmt(x+r*.42)} ${fmt(y)}A${fmt(r*.42)} ${fmt(r*.42)} 0 1 0 ${fmt(x-r*.42)} ${fmt(y)}A${fmt(r*.42)} ${fmt(r*.42)} 0 1 0 ${fmt(x+r*.42)} ${fmt(y)}`}return d+`M${fmt(cx+r*.25)} ${fmt(cy)}A${fmt(r*.25)} ${fmt(r*.25)} 0 1 0 ${fmt(cx-r*.25)} ${fmt(cy)}A${fmt(r*.25)} ${fmt(r*.25)} 0 1 0 ${fmt(cx+r*.25)} ${fmt(cy)}`}
 else {for(let i=0;i<n;i++){const a=rot+i*2*Math.PI/n-Math.PI/2;pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)])}}
 return 'M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L')+'Z';
}
const H2_INST=[[300,110,28,.2],[380,150,18,.9],[450,100,34,1.5],[520,170,22,2.2],[330,250,40,.6],[470,265,26,3]];
SCENE({id:'sketchpad-instances',name:'Masters and instances',tag:'Change one, change them all',
 definition:'Sketchpad let a drawing be defined once as a master and placed many times as instances. Editing the master updated every copy.',
 example:'Draw one rivet, place 200 rivets on a bridge drawing, then change the rivet: all 200 change. Today the same idea appears as components, symbols and styles in design tools.',
 research:'Sutherland, I. E. (1963). Sketchpad: A man–machine graphical communication system. PhD thesis, MIT (“instances” and “masters”).',
 desc:'A master shape on the left and six scaled and rotated instances on the right; changing the master changes all six together.',
 dur:9,hint:'Change the master’s shape and number of points. You cannot edit an instance directly: it only refers to the master.',
 init:()=>({type:'star',n:5}),
 watch(p){const t=['star','polygon','flower','star'],i=Math.min(3,Math.floor(p*4));return {type:t[i],n:[5,6,6,8][i]}},
 ui:[{choose:[['star','Star'],['polygon','Polygon'],['flower','Flower']],label:'Master shape',get:s=>s.type,act:'type'},{range:'n',label:'Points',min:3,max:9,get:s=>s.n,act:'n'}],
 on:{type(s,v){s.type=v},n(s,v){s.n=v}},
 draw(s){
  let out=heading('One master, many instances')+H2_crt(20,48,560,290,'');
  out+=R(36,70,190,190,'#13291f','#2e6b52',10,'stroke-dasharray="6 5"')+TF(131,92,'MASTER',13,H2_CRT.glow)+P(H2_shapePath(s.type,s.n,131,170,62),H2_CRT.glow,3);
  for(const [x,y,r,rot] of H2_INST){out+=P(`M131 170L${x} ${y}`,'#24493b',1,'none','stroke-dasharray="2 5"');out+=P(H2_shapePath(s.type,s.n,x,y,r,rot),H2_CRT.ink,2.2)}
  out+=TF(420,322,'6 instances, each a reference + position, size, rotation',13,H2_CRT.dim);
  return {svg:out,phase:`Each instance stores only where it sits, how big and how turned. Its shape comes from the master: a ${s.n}-point ${s.type}. Change the master and every instance follows.`};
 }});

// A drawing sheet much larger than the screen, seen through a zoomable window.
const H2_SHEET=(()=>{const items=[];
 // A truss bridge across the sheet (sheet units 0..1000).
 const xs=range(9).map(i=>100+i*100);items.push({l:[100,620,900,620],w:6});items.push({l:[100,480,900,480],w:5});
 xs.forEach((x,i)=>{items.push({l:[x,480,x,620],w:3});if(i<8)items.push({l:[x,i%2?480:620,x+100,i%2?620:480],w:3})});
 items.push({l:[60,700,940,700],w:4});items.push({l:[100,620,60,700],w:4});items.push({l:[900,620,940,700],w:4});
 // Rivets at every joint, with tiny labels only visible when zoomed in.
 xs.forEach((x,i)=>{for(const y of [480,620])items.push({c:[x,y,4.5],label:`rivet ${i*2+(y===620?1:0)+1}`})});
 items.push({t:[500,420],s:28,text:'Bridge, side elevation'});items.push({t:[700,604],s:2.6,text:'weld note: 3 mm fillet'});
 return items})();
SCENE({id:'sketchpad-zoom',name:'Zooming a huge sheet',tag:'The screen is a window onto a bigger drawing',
 definition:'Sketchpad treated the screen as a movable, zoomable window onto a drawing sheet far larger than the display, so detail could be added at any scale.',
 example:'Zoom in on one rivet of a bridge to label it, then zoom out to see the whole span. Maps, design tools and spreadsheets still work this way.',
 research:'Sutherland, I. E. (1963). Sketchpad: A man–machine graphical communication system. PhD thesis, MIT (scaling and the large drawing sheet).',
 desc:'A screen showing part of a bridge drawing at the current zoom, beside a mini-map of the whole sheet with a rectangle marking the visible window.',
 dur:10,hint:'Zoom in and pan with the arrows. Small labels only become readable when you zoom in far enough.',
 init:()=>({z:1,cx:500,cy:560}),
 watch(p){const u=smooth(p);return {z:Math.round(Math.pow(48,u)*10)/10,cx:lerp(500,700,u),cy:lerp(560,604,u)}},
 ui:[{range:'z',label:'Zoom',min:1,max:48,step:1,get:s=>s.z,act:'z',show:v=>v+'×'},{b:'←',act:'pan',arg:'l',aria:'Pan left'},{b:'→',act:'pan',arg:'r',aria:'Pan right'},{b:'↑',act:'pan',arg:'u',aria:'Pan up'},{b:'↓',act:'pan',arg:'d',aria:'Pan down'},{b:'Go to the weld note',act:'weld'}],
 on:{z(s,v){s.z=v},pan(s,d){const k=150/s.z;if(d==='l')s.cx-=k;if(d==='r')s.cx+=k;if(d==='u')s.cy-=k;if(d==='d')s.cy+=k;s.cx=clamp(s.cx,0,1000);s.cy=clamp(s.cy,0,1000)},weld(s){s.cx=700;s.cy=604;s.z=40}},
 draw(s){
  const vx=24,vy=52,vw=380,vh=280,scale=vw/1000*s.z,map=(x,y)=>[vx+vw/2+(x-s.cx)*scale,vy+vh/2+(y-s.cy)*scale];
  let out=heading('A window onto a much larger sheet')+H2_crt(vx-4,vy-4,vw+8,vh+8,'')+`<clipPath id="h2-sheet-clip"><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}"/></clipPath><g clip-path="url(#h2-sheet-clip)">`;
  let tiny=0;
  for(const it of H2_SHEET){
   if(it.l){const a=map(it.l[0],it.l[1]),b=map(it.l[2],it.l[3]);out+=L(a[0],a[1],b[0],b[1],H2_CRT.ink,Math.max(1,Math.min(6,it.w*scale*.8)))}
   if(it.c){const c=map(it.c[0],it.c[1]),r=it.c[2]*scale;out+=Ci(c[0],c[1],Math.max(1.2,r),H2_CRT.bg,H2_CRT.glow);const inView=c[0]>vx+30&&c[0]<vx+vw-30&&c[1]>vy&&c[1]<vy+vh-20;if(r>9){if(inView)out+=TF(c[0],c[1]+r+15,it.label,13,H2_CRT.glow)}else if(inView)tiny++}
   if(it.t){const c=map(it.t[0],it.t[1]),sz=it.s*scale,inView=c[0]>vx&&c[0]<vx+vw&&c[1]>vy+10&&c[1]<vy+vh;if(!inView)continue;if(sz>=11&&sz<120)out+=TF(c[0],c[1],it.text,Math.min(40,sz),H2_CRT.glow);else if(sz<11)tiny++}
  }
  out+='</g>';
  // Mini-map of the whole sheet.
  const mx=430,my=60,ms=150,mw=vw/scale,mh=vh/scale;
  out+=R(mx,my,ms,ms,'#fff',C.grid,6);for(const it of H2_SHEET)if(it.l)out+=L(mx+it.l[0]*ms/1000,my+it.l[1]*ms/1000,mx+it.l[2]*ms/1000,my+it.l[3]*ms/1000,C.line,1.2);
  out+=R(mx+(s.cx-mw/2)*ms/1000,my+(s.cy-mh/2)*ms/1000,Math.max(2,mw*ms/1000),Math.max(2,mh*ms/1000),'none',C.coral,2);
  out+=TF(mx+ms/2,my+ms+20,'whole sheet',13,C.muted)+TB(mx+ms/2,my+ms+56,s.z+'×',22,C.blue)+TF(mx+ms/2,my+ms+80,'magnification',13,C.muted);
  out+=TF(mx+ms/2,my+ms+108,tiny?`${tiny} details too small`:'all details readable',13,tiny?C.muted:C.green);
  return {svg:out,phase:s.z<8?'Zoomed out, the rivets are dots and their labels are invisible: the detail exists on the sheet but is below what the screen can show.':'Zoomed in, the same sheet reveals labels drawn at a tiny scale. Nothing was added; the window simply moved closer.'};
 }});

/* ---------------- Lesson: The mouse (1964–1968) ---------------- */
SCENE({id:'mouse',name:'The mouse',tag:'A relative pointing device',
 definition:'The mouse, built by Douglas Engelbart and Bill English at SRI in the mid-1960s, turns hand movement on the desk into cursor movement on the screen. Two wheels at right angles count movement in x and in y.',
 example:'Lift the mouse and put it back in the middle of the desk: the cursor stays where it was. The mouse reports changes in position, not where it is.',
 research:'English, W. K., Engelbart, D. C. & Berman, M. L. (1967). Display-selection techniques for text manipulation. IEEE Transactions on Human Factors in Electronics, HFE-8(1), 5–15.',
 desc:'Left, a wooden mouse seen from above with an x wheel and a y wheel; right, a screen whose cursor moves only while the mouse touches the desk.',
 dur:10,hint:'Move the mouse with the arrows. Lift it, move it back, put it down: the cursor does not jump, because the mouse is relative.',
 init:()=>({mx:.5,my:.5,cx:.5,cy:.5,wx:0,wy:0,lifted:false}),
 watch(p){const q=clamp(p/.62,0,1),a=q*2*Math.PI,x=.5+.3*Math.sin(a),y=.5-.22*Math.sin(2*a);if(p<.62)return {mx:x,my:y,cx:x,cy:y,wx:q*4,wy:q*3,lifted:false};const r=smooth((p-.62)/.3);return {mx:lerp(.5,.18,r),my:.5,cx:.5,cy:.5,wx:4,wy:3,lifted:p<.95}},
 ui:[{b:'←',act:'move',arg:'l',aria:'Move left'},{b:'→',act:'move',arg:'r',aria:'Move right'},{b:'↑',act:'move',arg:'u',aria:'Move up'},{b:'↓',act:'move',arg:'d',aria:'Move down'},{b:'Lift / put down',act:'lift'}],
 on:{move(s,d){const v={l:[-.1,0],r:[.1,0],u:[0,-.1],d:[0,.1]}[d];s.mx=clamp(s.mx+v[0],.1,.9);s.my=clamp(s.my+v[1],.1,.9);if(!s.lifted){s.cx=clamp(s.cx+v[0],0,1);s.cy=clamp(s.cy+v[1],0,1);s.wx+=v[0]*10;s.wy+=v[1]*10}},lift(s){s.lifted=!s.lifted}},
 draw(s){
  let out=heading('The mouse counts movement, not position');
  out+=R(24,52,250,260,'#efe6d6','#cdbb9a',14)+TF(149,330,s.lifted?'lifted: wheels free, nothing counted':'on the desk: wheels roll and count',13,s.lifted?C.coral:C.muted);
  const x=40+s.mx*218,y=62+s.my*230;
  if(s.lifted)out+=`<ellipse cx="${fmt(x)}" cy="${fmt(y+40)}" rx="34" ry="8" fill="#00000018"/>`;
  out+=R(x-32,y-38,64,76,'#8b5a2b','#5d3a19',8);out+=L(x,y-38,x,y-62,'#555',2.5);
  // x wheel (horizontal) and y wheel (vertical), with spokes turning.
  out+=R(x-16,y+14,32,10,'#333','none',3)+R(x+16,y-14,10,28,'#333','none',3);
  for(let k=0;k<3;k++){const a=s.wx*2+k*2.1;out+=L(x-14+((Math.cos(a)+1)*14),y+15,x-14+((Math.cos(a)+1)*14),y+23,'#ddd',1.5);const b=s.wy*2+k*2.1;out+=L(x+17,y-12+((Math.cos(b)+1)*12),x+25,y-12+((Math.cos(b)+1)*12),'#ddd',1.5)}
  out+=Ci(x-12,y-26,5,'#d7c3a0')+Ci(x,y-26,5,'#d7c3a0')+Ci(x+12,y-26,5,'#d7c3a0');
  out+=H2_crt(300,52,280,200,'');const sx=314+s.cx*250,sy=64+s.cy*170;out+=H2_cursor(sx,sy,H2_CRT.glow).replace('fill="#fff"',`fill="${H2_CRT.bg}"`);
  out+=counter(300,266,'x wheel',Math.round(s.wx*10),C.blue,132)+counter(448,266,'y wheel',Math.round(s.wy*10),C.blue,132);
  return {svg:out,phase:s.lifted?'Lifted, the wheels turn freely and nothing is counted, so you can reposition the mouse without moving the cursor.':'Rolling right turns the x wheel; rolling down turns the y wheel. The computer adds those counts to the cursor position.'};
 }});

// Card, English & Burr (1978): positioning time against index of difficulty for two devices.
const H2_DEV=[{name:'Mouse',a:1.03,b:.096,col:C.blue},{name:'Rate joystick',a:.99,b:.22,col:C.coral}];
SCENE({id:'mouse-vs-joystick',name:'Why the mouse won',tag:'Measured against the alternatives',
 definition:'In 1978 Stuart Card, Bill English and Betty Burr timed people selecting text with a mouse, a joystick and keys. The mouse was fastest and most accurate, and its times followed Fitts’s law with a slope close to the limit of the hand itself.',
 example:'For the mouse, each extra bit of difficulty (doubling distance over target size) added about 0.1 s; for the rate-controlled joystick, about 0.22 s. So the mouse’s advantage grows as targets get harder.',
 research:'Card, S. K., English, W. K. & Burr, B. J. (1978). Evaluation of mouse, rate-controlled isometric joystick, step keys, and text keys for text selection on a CRT. Ergonomics, 21(8), 601–613.',
 desc:'A chart of predicted positioning time against index of difficulty for mouse and joystick, using the fitted equations reported by Card, English and Burr, with the current task marked on both lines.',
 dur:10,hint:'Change the distance-to-size ratio and compare the two fitted lines. Steeper lines mean each doubling of difficulty costs more time.',
 init:()=>({r:16}),
 watch(p){return {r:Math.round(Math.pow(64,smooth(p)))}},
 ui:[{range:'r',label:'Distance ÷ target size',min:1,max:64,get:s=>s.r,act:'r'}],
 on:{r(s,v){s.r=v}},
 draw(s){
  const id=Math.log2(s.r+.5);let out=heading('Card, English & Burr (1978): time = a + b · log₂(D/S + 0.5)');
  const pl=H2_plot(90,60,320,240,6.5,2.6,'index of difficulty (bits)','time (s)',[0,1,2,3,4,5,6],[0,.5,1,1.5,2,2.5]);out+=pl.svg;
  H2_DEV.forEach(d=>{out+=L(pl.px(0),pl.py(d.a),pl.px(6.5),pl.py(d.a+d.b*6.5),d.col,3);const t=d.a+d.b*id;out+=Ci(pl.px(id),pl.py(t),6,d.col,'#fff')});
  out+=L(pl.px(id),60,pl.px(id),300,C.amber,1.5,'stroke-dasharray="4 4"');
  H2_DEV.forEach((d,i)=>{const y=86+i*104,t=d.a+d.b*id;out+=R(436,y-24,150,90,'#fff',d.col,10)+TB(511,y,d.name,15,d.col)+TB(511,y+30,fmt(t.toFixed(2))+' s',22,C.ink)+TF(511,y+54,`slope ${d.b} s/bit`,13,C.muted)});
  out+=TF(511,300,`D/S = ${s.r}: ${id.toFixed(2)} bits`,13,C.amber);
  return {svg:out,phase:`At ${id.toFixed(1)} bits the mouse takes about ${(1.03+.096*id).toFixed(2)} s and the joystick ${(0.99+.22*id).toFixed(2)} s. Equations as reported in the 1978 study; the keys were slower still for long distances.`};
 }});

const H2_DEMO=[
 {t:'The setting',say:'9 December 1968, San Francisco: Engelbart sits at a console on stage while his team’s NLS system runs at SRI in Menlo Park, linked by video and data lines.'},
 {t:'Mouse and “bug”',say:'He points with the mouse; the on-screen pointer was called the “bug”. A word is selected by pointing, not by typing a command and a line number.'},
 {t:'Keyset + keyboard',say:'The left hand plays chords on a five-key keyset for commands while the right hand keeps the mouse: two hands, two jobs.'},
 {t:'Views of a document',say:'A shopping list is restructured, collapsed to headings and expanded again: the same text, different views.'},
 {t:'Links',say:'Selecting a link jumps to another statement or document: hypertext, demonstrated live.'},
 {t:'Shared screen + video',say:'Bill Paxton, 30 miles away at SRI, appears on video and edits the same document with his own pointer.'}];
SCENE({id:'mouse-demo-1968',name:'The 1968 demonstration',tag:'“The mother of all demos”',
 definition:'At a 1968 computer conference Douglas Engelbart demonstrated, in one 90-minute session, the mouse, windows of text, outlining, hypertext links, shared editing and video conferencing.',
 example:'Most of what offices adopted over the next 30 years appeared in that session, connected live to a lab 30 miles away.',
 research:'Engelbart, D. C. & English, W. K. (1968). A research center for augmenting human intellect. AFIPS Fall Joint Computer Conference, 33, 395–410.',
 desc:'A stage console linked to the SRI laboratory, with a large projected screen illustrating each feature of the demonstration in turn.',
 dur:12,hint:'Step through the features of the demonstration, or choose one.',
 init:()=>({f:0}),
 watch(p){return {f:Math.min(5,Math.floor(p*6))}},
 ui:[{b:'◀',act:'step',arg:-1,aria:'Previous feature'},{b:'▶',act:'step',arg:1,aria:'Next feature'},{choose:H2_DEMO.map((d,i)=>[i,String(i+1)]),label:'Feature',get:s=>s.f,act:'pick'}],
 on:{step(s,d){s.f=clamp(s.f+Number(d),0,5)},pick(s,v){s.f=Number(v)}},
 draw(s){
  const d=H2_DEMO[s.f];let out=heading(`${s.f+1} / 6 · ${d.t}`);
  // Stage console (left) and SRI lab (right), linked.
  out+=R(20,250,170,110,'#fff',C.grid,10)+TF(105,272,'San Francisco stage',13,C.muted);
  out+=R(40,292,60,30,'#ddd','none',4)+TF(70,312,'keys',13,C.ink)+R(108,296,26,22,'#8b5a2b','none',6)+R(144,292,34,30,'#bbb','none',4)+TF(166,340,'keyset',13,C.muted)+TF(114,354,'mouse',13,C.muted);
  out+=R(410,250,170,110,'#fff',C.grid,10)+TF(495,272,'SRI, Menlo Park',13,C.muted)+R(430,286,130,46,'#e8eef2','none',6)+TF(495,314,'NLS computer',13,C.ink);
  out+=P('M190 300 C 280 340 320 340 410 300',s.f>=5?C.coral:C.line,s.f>=5?3:2,'none','stroke-dasharray="6 5"')+TF(300,350,'video + data link',13,C.muted);
  // Big screen.
  out+=H2_crt(140,48,320,190,'projected screen');const g=H2_CRT.glow,k=H2_CRT.ink;
  if(s.f===0){out+=TF(300,120,'NLS',30,g)+TF(300,150,'oN-Line System',15,k)}
  if(s.f===1||s.f===2){['Produce','Bread','Milk','Oranges'].forEach((w,i)=>{out+=TF(170,90+i*30,w,16,i===2?g:k,'start')});out+=R(166,141,44,26,'none',g,3)+H2_cursor(214,160,g).replace('fill="#fff"',`fill="${H2_CRT.bg}"`);
   if(s.f===2)out+=R(330,90,110,90,'#13291f',k,8)+range(5).map(i=>R(340+i*19,110,15,44,i%2?g:'#13291f',k,3)).join('')+TF(385,175,'chord = command',13,g)}
  if(s.f===3){['1 Shopping','  1a Produce','  1b Dairy','2 Errands'].forEach((w,i)=>out+=TF(170,90+i*28,w,16,k,'start'));out+=TF(330,90,'collapse →',15,g,'start')+TF(330,120,'1 Shopping',16,g,'start')+TF(330,148,'2 Errands',16,g,'start')}
  if(s.f===4){out+=TF(170,100,'see (Library)',16,g,'start')+L(170,104,276,104,g,1.5)+curveArrow(270,110,380,170,-40,g,2)+R(330,170,110,40,'#13291f',g,6)+TF(385,195,'Library',15,g)}
  if(s.f===5){out+=R(170,74,140,120,'#13291f',k,6)+Ci(240,120,26,'#2b4a3e')+Ci(240,182,40,'#2b4a3e')+TF(240,210,'Paxton (video)',13,g)+TF(390,100,'shared text',14,k)+H2_cursor(360,120,g).replace('fill="#fff"',`fill="${H2_CRT.bg}"`)+H2_cursor(410,150,'#ffd24a').replace('fill="#fff"',`fill="${H2_CRT.bg}"`)+TF(390,190,'two pointers',13,g)}
  return {svg:out,phase:d.say};
 }});

/* ---------------- Lesson: Fitts's law (1954) ---------------- */
const H2_FITTS_CONDS=[[120,60],[240,40],[400,20],[480,12]];
const H2_FITTS_SIM=range(16).map(i=>{const [D,W]=H2_FITTS_CONDS[Math.floor(i/4)],id=Math.log2(D/W+1);return {id,mt:.12+.13*id+(((i*37)%7)-3)*.012}});
const H2_id=(D,W)=>Math.log2(D/W+1);
SCENE({id:'fitts-law',name:'Fitts’s law',tag:'Be the participant',
 definition:'Fitts’s law says the time to point at a target grows with the logarithm of distance divided by target width: MT = a + b · log₂(D/W + 1). Doubling the distance costs the same as halving the width.',
 example:'A big button close to the pointer is quick; a small, far one is slow. The log₂ term is the “index of difficulty” in bits.',
 research:'Fitts, P. M. (1954). The information capacity of the human motor system in controlling the amplitude of movement. Journal of Experimental Psychology, 47(6), 381–391. Shannon form: MacKenzie (1992), Human–Computer Interaction, 7, 91–139.',
 desc:'Two vertical targets at a set distance and width above a chart of movement time against index of difficulty, where each completed movement adds a point and a fitted line appears.',
 dur:14,hint:'Press the highlighted target, then the other, back and forth as fast as you can. Change distance and width to add points at new difficulties.',
 init:()=>({D:240,W:40,next:'L',t0:null,data:[],misses:0}),
 watch(p){const k=Math.min(16,Math.floor(p*17)),c=H2_FITTS_CONDS[Math.min(3,Math.floor(Math.min(15,k)/4))];return {D:c[0],W:c[1],next:k%2?'R':'L',data:H2_FITTS_SIM.slice(0,k),misses:0,u:p*17-Math.floor(p*17)}},
 ui:[{range:'D',label:'Distance',min:100,max:500,step:10,get:s=>s.D,act:'D'},{range:'W',label:'Width',min:10,max:80,step:2,get:s=>s.W,act:'W'},{b:'Clear my data',act:'clear'}],
 on:{D(s,v){s.D=v;s.t0=null},W(s,v){s.W=v;s.t0=null},clear(s){s.data=[];s.misses=0;s.t0=null},
  tap(s,side){if(side!==s.next){s.misses++;return 'keep'}const now=performance.now();if(s.t0!==null){const mt=(now-s.t0)/1000;if(mt<4)s.data.push({id:H2_id(s.D,s.W),mt,mine:true})}s.t0=now;s.next=s.next==='L'?'R':'L';if(s.data.length>60)s.data.shift();return 'keep'}},
 draw(s,f,X){
  const id=H2_id(s.D,s.W),lx=300-s.D/2,rx=300+s.D/2;let out=heading(`D = ${s.D}, W = ${s.W}: index of difficulty ${id.toFixed(2)} bits`);
  for(const [side,x] of [['L',lx],['R',rx]]){const on=s.next===side;out+=hit(X,'tap',side,`${side==='L'?'Left':'Right'} target${on?', press now':''}`,R(x-s.W/2,52,s.W,96,on?C.blue:C.pale,on?C.blue:C.line,4))}
  out+=L(lx,160,rx,160,C.muted,1.5)+TF(300,176,'D',13,C.muted);
  if(!X.try){const from=s.next==='L'?rx:lx,to=s.next==='L'?lx:rx,x=lerp(from,to,smooth((s.u||0)*1.6));out+=H2_cursor(x,96)}
  const pl=H2_plot(110,196,330,130,6,1.6,'index of difficulty, log₂(D/W + 1) bits','time (s)',[0,1,2,3,4,5,6],[0,.5,1,1.5]);out+=pl.svg;
  for(const d of s.data)out+=Ci(pl.px(d.id),pl.py(d.mt),4.5,d.mine?C.coral:C.blue,'#fff');
  const fit=H2_fit(s.data.map(d=>[d.id,d.mt]));
  if(fit)out+=L(pl.px(0),pl.py(fit.a),pl.px(6),pl.py(fit.a+fit.b*6),C.green,2.5);
  out+=R(462,196,124,130,'#fff',C.grid,8)+TF(524,218,X.try?'your trials':'trials',13,C.muted)+TB(524,244,s.data.length,20,C.ink)+TF(524,268,'misses '+s.misses,13,s.misses?C.coral:C.muted);
  out+=fit?TBF(524,296,`b = ${H2_ms(fit.b)}`,14,C.green)+TF(524,314,'per bit',13,C.muted):TF(524,300,'3+ points at 2 IDs',13,C.muted);
  const say=fit?`Your fitted line: MT ≈ ${fit.a.toFixed(2)} + ${fit.b.toFixed(3)} · ID seconds. Fitts measured slopes of roughly 0.1 s per bit for practised hand movements.`:'Each point is one movement. As the index of difficulty rises, so does the time, along a straight line in log₂(D/W + 1).';
  return {svg:out,phase:say};
 }});

SCENE({id:'fitts-edges',name:'Edges and corners',tag:'Targets you cannot overshoot',
 definition:'The cursor stops at the edge of the screen, so a target on the edge has effectively unlimited depth in that direction. Fitts’s law then predicts very fast selection.',
 example:'A menu bar along the top screen edge can be hit by throwing the pointer upwards; a menu bar inside a window must be hit precisely. Corners stop the pointer in two directions at once.',
 research:'Walker, N. & Smelcer, J. B. (1990). A comparison of selection times from walking and pull-down menus. Proceedings of CHI ’90, 221–225 (impenetrable screen edges). Fitts (1954).',
 desc:'A screen with a cursor moving to a menu in a window, a menu on the screen edge or a corner button; the overshoot either misses and corrects, or is absorbed by the edge.',
 dur:11,hint:'Choose where the target sits and how far the throw overshoots. Watch which targets forgive the overshoot.',
 init:()=>({where:'window',over:30}),
 watch(p){const w=['window','edge','corner'][Math.min(2,Math.floor(p*3))];return {where:w,over:30,u:(p*3)%1}},
 ui:[{choose:[['window','Menu in a window'],['edge','Menu on screen edge'],['corner','Corner button']],label:'Target',get:s=>s.where,act:'where'},{range:'over',label:'Overshoot',min:0,max:60,get:s=>s.over,act:'over'}],
 on:{where(s,v){s.where=v},over(s,v){s.over=v}},
 draw(s,f,X){
  let out=heading('The screen edge stops the pointer for you');const sx=40,sy=46,sw=360,sh=280,start=[300,300];
  out+=R(sx,sy,sw,sh,'#f7fafc','#475b66',6)+R(sx,sy,sw,20,'#e1e8ed','none',0)+TF(sx+40,sy+15,'File',13,C.ink)+TF(sx+90,sy+15,'Edit',13,C.ink);
  out+=R(110,120,250,190,'#fff',C.line,6)+R(110,120,250,22,'#eef3f6','none',4)+TF(140,136,'File',13,C.ink)+TF(185,136,'Edit',13,C.ink)+R(sx,sy,24,24,'#e1e8ed','#475b66',0);
  const tg={window:{x:140,y:131,box:[124,124,34,16],W:16},edge:{x:sx+40,y:sy+10,box:[sx+24,sy,34,20],W:20+160},corner:{x:sx+6,y:sy+6,box:[sx,sy,24,24],W:24+300}}[s.where];
  out+=R(...tg.box,'none',C.coral,3,'stroke-width="3"');
  const dx=tg.x-start[0],dy=tg.y-start[1],dd=Math.hypot(dx,dy),ux=dx/dd,uy=dy/dd;
  let end=[tg.x+ux*s.over,tg.y+uy*s.over];end=[Math.max(sx,end[0]),Math.max(sy,end[1])];
  const inside=end[0]>=tg.box[0]&&end[0]<=tg.box[0]+tg.box[2]&&end[1]>=tg.box[1]&&end[1]<=tg.box[1]+tg.box[3];
  const u=X.try?1:smooth(clamp((s.u||0)*1.5,0,1)),cx=lerp(start[0],end[0],u),cy=lerp(start[1],end[1],u);
  out+=L(start[0],start[1],cx,cy,C.blue,2,'stroke-dasharray="5 4"');
  if(u>=1&&!inside)out+=curveArrow(end[0],end[1],tg.x,tg.y,12,C.coral,2);
  out+=H2_cursor(cx,cy);
  // Predicted times with illustrative constants.
  const rows=[['window',16],['edge',180],['corner',324]].map(([k,W])=>{const t=k==='window'?tg:null;const tx={window:140,edge:sx+40,corner:sx+6}[k],ty={window:131,edge:sy+10,corner:sy+6}[k],D=Math.hypot(tx-start[0],ty-start[1]);return [k,Math.log2(D/W+1),W]});
  out+=TB(500,70,'Predicted time',14,C.ink)+TF(500,88,'MT = 0.1 + 0.15·ID (illustrative)',13,C.muted);
  rows.forEach(([k,id,W],i)=>{const t=.1+.15*id,y=110+i*62,on=k===s.where;out+=R(420,y,160,50,on?C.amberp:'#fff',on?C.amber:C.grid,8)+TF(432,y+19,{window:'in window',edge:'edge menu',corner:'corner'}[k],13,C.ink,'start')+TBF(570,y+19,t.toFixed(2)+' s',14,C.ink,'end')+TF(432,y+39,`effective W ${W}, ID ${id.toFixed(1)}`,13,C.muted,'start')});
  return {svg:out,phase:inside?(s.where==='window'?'This throw happened to land inside the small window menu, but any larger overshoot misses and needs a correction.':'The overshoot is absorbed: the pointer stops at the edge, still on the target. The edge acts like a target of enormous depth.'):'The overshoot carries the pointer past the small target, so a slower corrective movement is needed.'};
 }});

// Linear versus pie menus: distance and width per item.
function H2_menuGeom(i,layout){if(layout==='linear')return {D:24*i+12,W:24};return {D:70,W:2*Math.PI*70/8}}
SCENE({id:'fitts-pie-menu',name:'Pie menus',tag:'Every item at the same short distance',
 definition:'A pie menu places items in a circle around the pointer, so every item is the same short distance away and each wedge is wide. Fitts’s law predicts faster selection than a linear list, especially for items far down the list.',
 example:'In a linear menu the eighth item is eight rows away; in an eight-slice pie menu it is just as close as the first.',
 research:'Callahan, J., Hopkins, D., Weiser, M. & Shneiderman, B. (1988). An empirical comparison of pie vs. linear menus. Proceedings of CHI ’88, 95–100.',
 desc:'A linear menu and an eight-wedge pie menu side by side with the path to the chosen item, and a chart of predicted selection time for every item in both layouts.',
 dur:10,hint:'Choose an item number and compare the path and predicted time in each layout.',
 init:()=>({item:6}),
 watch(p){return {item:1+Math.min(7,Math.floor(p*8))}},
 ui:[{range:'item',label:'Item',min:1,max:8,get:s=>s.item,act:'item'}],
 on:{item(s,v){s.item=v}},
 draw(s){
  const i=s.item-1;let out=heading('Linear menu versus pie menu');
  out+=TF(110,58,'linear',13,C.muted);for(let k=0;k<8;k++){const on=k===i;out+=R(50,66+24*k,120,22,on?C.blue:'#fff',on?C.blue:C.line,3)+TF(60,82+24*k,'Item '+(k+1),13,on?'#fff':C.ink,'start')}
  out+=arrow(184,66,184,66+24*i+12,C.coral,2.2,7)+L(184,66+24*i+12,172,66+24*i+12,C.coral,2.2)+H2_cursor(182,58);
  const cx=310,cy=176;out+=TF(cx,58,'pie',13,C.muted);
  for(let k=0;k<8;k++){const a0=(k-.5)*Math.PI/4-Math.PI/2,a1=(k+.5)*Math.PI/4-Math.PI/2,r0=26,r1=104,on=k===i;
   out+=P(`M${fmt(cx+r0*Math.cos(a0))} ${fmt(cy+r0*Math.sin(a0))}L${fmt(cx+r1*Math.cos(a0))} ${fmt(cy+r1*Math.sin(a0))}A${r1} ${r1} 0 0 1 ${fmt(cx+r1*Math.cos(a1))} ${fmt(cy+r1*Math.sin(a1))}L${fmt(cx+r0*Math.cos(a1))} ${fmt(cy+r0*Math.sin(a1))}A${r0} ${r0} 0 0 0 ${fmt(cx+r0*Math.cos(a0))} ${fmt(cy+r0*Math.sin(a0))}Z`,on?C.blue:C.line,1.5,on?C.blue:'#fff');
   const am=k*Math.PI/4-Math.PI/2;out+=TF(cx+68*Math.cos(am),cy+68*Math.sin(am)+5,String(k+1),14,on?'#fff':C.ink)}
  const am=i*Math.PI/4-Math.PI/2;out+=arrow(cx,cy,cx+60*Math.cos(am),cy+60*Math.sin(am),C.coral,2.2,7)+H2_cursor(cx,cy);
  out+=TB(510,58,'Predicted time (s)',13,C.ink)+TF(510,74,'0.1 + 0.15·log₂(D/W+1)',13,C.muted);
  for(let k=0;k<8;k++){const y=90+k*30,tl=.1+.15*Math.log2(H2_menuGeom(k,'linear').D/24+1),tp=.1+.15*Math.log2(70/55+1),on=k===i;
   out+=TF(436,y+12,k+1,13,on?C.ink:C.muted,'end')+R(442,y,tl*160,10,C.line,'none',2)+R(442,y+12,tp*160,10,C.blue,'none',2)+(on?R(438,y-3,152,28,'none',C.amber,5):'')}
  out+=R(442,336,10,10,C.line,'none',2)+TF(456,345,'linear',13,C.muted,'start')+R(510,336,10,10,C.blue,'none',2)+TF(524,345,'pie',13,C.muted,'start');
  const gl=H2_menuGeom(i,'linear'),gp=H2_menuGeom(i,'pie');
  return {svg:out,phase:`Item ${s.item}: linear distance ${gl.D} with width 24; pie distance ${gp.D} with a wedge about ${Math.round(gp.W)} wide. Callahan and colleagues measured pie menus faster on average, with fewer errors.`};
 }});

/* ---------------- Lesson: Hick's law (1952) ---------------- */
const H2_HICK_N=[1,2,4,8];
SCENE({id:'hick-law',name:'Hick’s law',tag:'Be the participant',
 definition:'Hick’s law (also the Hick–Hyman law) says the time to choose a response grows with the logarithm of the number of equally likely choices: RT = a + b · log₂(n + 1).',
 example:'Going from 1 to 3 equally likely lights adds about as much time as going from 3 to 7: each doubling of (n + 1) adds a fixed step.',
 research:'Hick, W. E. (1952). On the rate of gain of information. Quarterly Journal of Experimental Psychology, 4(1), 11–26. Hyman, R. (1953). Stimulus information as a determinant of reaction time. Journal of Experimental Psychology, 45(3), 188–196.',
 desc:'A row of lamps, one lit at a time, above a chart of mean reaction time against log₂(n + 1) for 1, 2, 4 and 8 lamps.',
 dur:13,hint:'Choose how many lamps, press Start, then press each lamp the moment it lights. Collect a few trials at each size and compare.',
 init:()=>({n:4,lit:-1,t0:0,seed:4242,data:{1:[],2:[],4:[],8:[]},errors:0}),
 watch(p){const i=Math.min(3,Math.floor(p*4)),n=H2_HICK_N[i],data={1:[],2:[],4:[],8:[]};H2_HICK_N.forEach((m,j)=>{if(j<i||(j===i&&(p*4)%1>.5))data[m]=[.21+.14*Math.log2(m+1)]});return {n,lit:Math.floor(p*40)%n,data,errors:0}},
 ui:[{choose:H2_HICK_N.map(n=>[n,n+(n>1?' lamps':' lamp')]),label:'Lamps',get:s=>s.n,act:'n'},{b:'Start',act:'go'},{b:'Clear my data',act:'clear'}],
 on:{n(s,v){s.n=Number(v);s.lit=-1},clear(s){s.data={1:[],2:[],4:[],8:[]};s.errors=0;s.lit=-1},
  go(s){s.seed=(s.seed*48271)%2147483647;s.lit=s.seed%s.n;s.t0=performance.now()},
  lamp(s,i){if(s.lit<0)return;i=Number(i);if(i===s.lit){const rt=(performance.now()-s.t0)/1000;if(rt<3){s.data[s.n].push(rt);if(s.data[s.n].length>20)s.data[s.n].shift()}}else s.errors++;s.seed=(s.seed*48271)%2147483647;s.lit=s.seed%s.n;s.t0=performance.now()}},
 draw(s,f,X){
  let out=heading(`${s.n} equally likely ${s.n>1?'choices':'choice'}: log₂(${s.n} + 1) = ${Math.log2(s.n+1).toFixed(2)} bits`);
  const gap=Math.min(70,480/s.n),x0=300-gap*(s.n-1)/2;
  for(let i=0;i<s.n;i++){const on=i===s.lit,x=x0+i*gap;out+=hit(X,'lamp',i,`Lamp ${i+1}${on?', lit':''}`,Ci(x,100,24,on?'#ffd24a':'#eef2f4',on?'#c79100':C.line)+(on?Ci(x,100,33,'none','#ffd24a','opacity=".5"'):''))+TF(x,146,i+1,13,C.muted)}
  if(X.try&&s.lit<0)out+=TF(300,172,'Press Start, then press each lamp as it lights',13,C.muted);
  const pl=H2_plot(120,190,300,130,3.3,1.2,'log₂(n + 1)  (bits)','mean RT (s)',[0,1,2,3],[0,.4,.8,1.2]);out+=pl.svg;
  const pts=[];H2_HICK_N.forEach(n=>{const d=s.data[n];if(d.length){const m=H2_mean(d),x=Math.log2(n+1);pts.push([x,m]);out+=Ci(pl.px(x),pl.py(m),6,X.try?C.coral:C.blue,'#fff')+TF(pl.px(x),pl.py(m)-12,`n=${n}`,13,C.muted)}});
  const fit=pts.length>=2?(()=>{const n=pts.length,mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n,sxx=sum(pts.map(p=>(p[0]-mx)**2));if(sxx<.01)return null;const b=sum(pts.map(p=>(p[0]-mx)*(p[1]-my)))/sxx;return {a:my-b*mx,b}})():null;
  if(fit)out+=L(pl.px(0),pl.py(fit.a),pl.px(3.3),pl.py(fit.a+fit.b*3.3),C.green,2.5);
  out+=R(450,190,136,130,'#fff',C.grid,8)+TF(518,212,'trials',13,C.muted)+TB(518,236,sum(H2_HICK_N.map(n=>s.data[n].length)),20,C.ink)+TF(518,258,'errors '+s.errors,13,s.errors?C.coral:C.muted)+(fit?TBF(518,288,`${H2_ms(fit.b)} per bit`,14,C.green):TF(518,288,'2+ sizes for a line',13,C.muted));
  return {svg:out,phase:fit?`Your means rise by about ${H2_ms(fit.b)} per bit of choice. Hick and Hyman found the same straight line in log₂ of the number of alternatives.`:'Each extra equally likely alternative adds less time than the one before: time grows with the information to be resolved, not the raw count.'};
 }});

// Menu breadth versus depth for 64 items (Landauer & Nachbar 1985).
const H2_TREES=[[64],[8,8],[4,4,4],[2,2,2,2,2,2]];
const H2_menuTime=b=>.5+.2*Math.log2(b+1);
SCENE({id:'hick-menus',name:'Broad or deep menus?',tag:'Breadth versus depth',
 definition:'With the same items, a menu can be broad and shallow (many choices at one level) or narrow and deep (few choices, many levels). Because decision time grows only logarithmically with choices while each level adds fixed overhead, broad, shallow menus usually win.',
 example:'For 64 ordered items, one page of 64 needs one decision; 2 × 2 × 2 × 2 × 2 × 2 needs six decisions, each with its own pointing and waiting.',
 research:'Landauer, T. K. & Nachbar, D. W. (1985). Selection from alphabetic and numeric menu trees using a touch screen: breadth, depth, and width. Proceedings of CHI ’85, 73–78. Kiger, J. I. (1984). The depth/breadth trade-off in the design of menu-driven user interfaces. International Journal of Man–Machine Studies, 20, 201–213.',
 desc:'A menu hierarchy for 64 items drawn as columns of choices with the path to the target highlighted, beside bars of predicted total time for four structures.',
 dur:12,hint:'Choose a structure and a target, then step through the levels. Compare the totals on the right.',
 init:()=>({st:1,target:42}),
 ui:[{choose:H2_TREES.map((t,i)=>[i,t.join(' × ')]),label:'Structure',get:s=>s.st,act:'st'},{range:'target',label:'Target item',min:1,max:64,get:s=>s.target,act:'target'}],
 on:{st(s,v){s.st=Number(v)},target(s,v){s.target=v}},
 trace(s){const t=H2_TREES[s.st],fr=[{lv:-1,tm:0}];let tm=0;t.forEach((b,l)=>{tm+=H2_menuTime(b);fr.push({lv:l,tm})});return fr},
 draw(s,f,X){
  const t=H2_TREES[s.st],digits=[];let r=s.target-1;for(let l=t.length-1;l>=0;l--){digits[l]=r%t[l];r=Math.floor(r/t[l])}
  let out=heading(`64 items as ${t.join(' × ')}: find item ${s.target}`);
  const colW=Math.min(110,380/t.length);let lo=0,size=64;
  t.forEach((b,l)=>{const x=20+l*colW,step=size/b,shown=l<=f.lv;
   if(b===64){for(let k=0;k<64;k++){const cx=x+(k%8)*46,cy=56+Math.floor(k/8)*30,on=shown&&k===digits[l];out+=R(cx,cy,42,26,on?C.blue:'#fff',on?C.blue:C.grid,3)+TF(cx+21,cy+18,k+1,13,on?'#fff':C.ink)}}
   else for(let k=0;k<b;k++){const h=Math.min(36,260/b),cy=56+k*(h+4),on=shown&&k===digits[l],a=lo+k*step+1,z=lo+(k+1)*step;out+=R(x+2,cy,colW-10,h,on?C.blue:(l<=f.lv+1?'#fff':'#f3f6f8'),on?C.blue:C.grid,4)+TF(x+colW/2-3,cy+h/2+5,step>1?`${a}–${z}`:String(a),13,on?'#fff':C.ink)}
   lo+=digits[l]*step;size=step;
  });
  H2_TREES.forEach((tr,i)=>{const tot=sum(tr.map(H2_menuTime)),y=60+i*60,on=i===s.st;out+=R(440,y,148,48,on?C.amberp:'#fff',on?C.amber:C.grid,8)+TF(450,y+19,tr.length===1?'64 in one list':`${tr[0]}${'⁰¹²³⁴⁵⁶'[tr.length]} (${tr.length} levels)`,13,C.ink,'start')+TBF(580,y+19,tot.toFixed(2)+' s',14,C.ink,'end')+R(450,y+28,tot*24,10,on?C.amber:C.line,'none',2)});
  out+=TF(514,316,'per level: 0.5 s',13,C.muted)+TF(514,334,'+ 0.2 s · log₂(b + 1)',13,C.muted)+TF(514,352,'(illustrative constants)',13,C.muted);
  out+=TB(220,372,f.lv<0?'Ready':`Level ${f.lv+1} of ${t.length}: ${f.tm.toFixed(2)} s so far`,15,C.blue);
  return {svg:out,phase:f.lv<0?'Every structure reaches the same 64 items. The question is how many decisions, and how big each one is.':`Each level costs a fixed overhead plus a decision that grows only with log₂ of its breadth, so ${t.length===1?'one broad level is quickest':t.length===2?'two broad levels stay fairly quick':'many narrow levels add up'}.`};
 }});

SCENE({id:'hick-familiar',name:'When Hick’s law applies',tag:'Familiar choice versus visual search',
 definition:'Hick’s law describes deciding among familiar, equally likely options. When a list is unfamiliar or unordered, people must search it item by item, so time grows roughly linearly with the number of items instead.',
 example:'Experts choose from a familiar toolbar in Hick time; a newcomer reading an unfamiliar menu scans it line by line. Predictive menu models combine both, shifting from search to decision with practice.',
 research:'Cockburn, A., Gutwin, C. & Greenberg, S. (2007). A predictive model of menu performance. Proceedings of CHI ’07, 627–636. Hick (1952); Hyman (1953).',
 desc:'A list of items with either a scanning eye moving item by item or a direct jump to the target, beside curves of time against list length for linear search and for Hick decision.',
 dur:11,hint:'Change the list length and switch between an unfamiliar list (scan) and a familiar one (decide).',
 init:()=>({n:16,mode:'unfamiliar'}),
 watch(p){return {n:2+Math.round(smooth(p)*30),mode:p<.5?'unfamiliar':'familiar',u:(p*2)%1}},
 ui:[{range:'n',label:'Items',min:2,max:32,get:s=>s.n,act:'n'},{choose:[['unfamiliar','Unfamiliar (scan)'],['familiar','Familiar (decide)']],label:'List',get:s=>s.mode,act:'mode'}],
 on:{n(s,v){s.n=v},mode(s,v){s.mode=v}},
 draw(s,f,X){
  const names=['Copy','Paste','Cut','Undo','Redo','Find','Replace','Print','Save','Open','Close','Zoom','Bold','Italic','Insert','Delete','Format','Align','Group','Sort','Filter','Export','Import','Share','Rename','Lock','Hide','Show','Merge','Split','Fill','Clear'];
  const tgt=Math.max(0,Math.ceil(s.n*.7)-1),lin=n=>.3+.08*(n+1)/2,hick=n=>.3+.15*Math.log2(n+1);
  let out=heading(s.mode==='unfamiliar'?'Unfamiliar: search item by item':'Familiar: decide among known options');
  const rows=Math.min(s.n,16),cols=s.n>16?2:1;
  for(let k=0;k<s.n;k++){const c=Math.floor(k/16),r=k%16,x=24+c*104,y=50+r*18.5,on=k===tgt;out+=R(x,y,98,16.5,on?C.amberp:'#fff',on?C.amber:C.grid,3)+TF(x+6,y+13,names[k],13,C.ink,'start')}
  const u=X.try?1:smooth(s.u||0);
  if(s.mode==='unfamiliar'){const k=Math.min(tgt,Math.floor(u*(tgt+1)));const c=Math.floor(k/16),r=k%16;out+=Ci(24+c*104+92,50+r*18.5+8,6,C.coral)+TF(240,350,`scanned ${k+1} of ${s.n}`,13,C.coral)}
  else out+=curveArrow(240,200,24+Math.floor(tgt/16)*104+98,50+(tgt%16)*18.5+8,-30,C.green,2)+TF(240,350,'direct choice',13,C.green);
  const pl=H2_plot(300,60,270,220,32,3,'number of items','time (s)',[0,8,16,24,32],[0,1,2,3]);out+=pl.svg;
  let dl='',dh='';for(let n=1;n<=32;n++){dl+=(n>1?'L':'M')+fmt(pl.px(n))+' '+fmt(pl.py(lin(n)));dh+=(n>1?'L':'M')+fmt(pl.px(n))+' '+fmt(pl.py(hick(n)))}
  out+=P(dl,C.coral,2.5)+P(dh,C.green,2.5)+TF(pl.px(30),pl.py(lin(30))-10,'search',13,C.coral,'end')+TF(pl.px(31),pl.py(hick(31))-10,'Hick',13,C.green,'end');
  const tm=s.mode==='unfamiliar'?lin(s.n):hick(s.n);out+=Ci(pl.px(s.n),pl.py(tm),6,s.mode==='unfamiliar'?C.coral:C.green,'#fff')+TF(435,350,'illustrative constants',13,C.muted);
  return {svg:out,phase:`${s.n} items: about ${lin(s.n).toFixed(2)} s to search an unfamiliar list, ${hick(s.n).toFixed(2)} s to choose from a familiar one. Long unfamiliar lists punish newcomers; consistent layouts let practice turn search into decision.`};
 }});

/* ---------------- Lesson: Hypertext (1945, 1965) ---------------- */
const H2_PAGES={
 A:{t:'Hypertext',pos:[420,90],body:['Writing that branches.','Readers follow links','such as'],links:['B','C']},
 B:{t:'Memex',pos:[530,170],body:['Bush’s 1945 desk of','microfilm, joined by','trails. See'],links:['D','A']},
 C:{t:'Xanadu',pos:[330,170],body:['Nelson’s design for','linked, quotable','documents. See'],links:['E','F']},
 D:{t:'Microfilm',pos:[560,270],body:['Photographic storage','of whole libraries.','Back to'],links:['B']},
 E:{t:'Transclusion',pos:[330,280],body:['Quoting by reference,','so the source stays','connected. See'],links:['C','F']},
 F:{t:'The Web',pos:[450,300],body:['One-way links between','pages, from 1989.','Compare'],links:['A','B']}};
const H2_WALK=['A','C','E','F','B','D'];
SCENE({id:'hypertext',name:'Hypertext',tag:'Non-sequential writing',
 definition:'Ted Nelson coined “hypertext” in 1965 for text that branches and lets the reader choose the path: chunks of writing joined by links, readable in many orders.',
 example:'This page itself is hypertext: underlined words open meanings, and the map below leads sideways. A printed book has one order; hypertext has as many as its links allow.',
 research:'Nelson, T. H. (1965). Complex information processing: a file structure for the complex, the changing and the indeterminate. Proceedings of the ACM 20th National Conference, 84–100.',
 desc:'A page of text with links on the left and a map of six linked pages on the right, with the reader’s path drawn as numbered arrows.',
 dur:11,hint:'Follow links on the page. Your path appears on the map; Back retraces it.',
 init:()=>({cur:'A',path:['A']}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {cur:H2_WALK[k],path:H2_WALK.slice(0,k+1)}},
 ui:[{b:'◀ Back',act:'back'}],
 on:{go(s,id){s.cur=id;s.path.push(id);if(s.path.length>14)s.path.shift()},back(s){if(s.path.length>1){s.path.pop();s.cur=s.path[s.path.length-1]}}},
 draw(s,f,X){
  const pg=H2_PAGES[s.cur];let out=heading('Choose your own path through linked text');
  out+=R(20,52,250,290,'#fff',C.grid,10)+TB(36,84,pg.t,20,C.ink,'start');
  pg.body.forEach((l,i)=>out+=T(36,116+i*24,l,15,C.ink,'start'));
  pg.links.forEach((id,i)=>{const y=196+i*46;out+=hit(X,'go',id,`Link to ${H2_PAGES[id].t}`,R(36,y,214,36,C.pale,C.blue,6)+T(48,y+24,'→ '+H2_PAGES[id].t,15,C.blue,'start','text-decoration="underline"'))});
  for(const [id,p] of Object.entries(H2_PAGES))for(const to of p.links){const q=H2_PAGES[to].pos;out+=arrowR(p.pos,q,26,30,'#d5e0e7',1.5)}
  for(let i=1;i<s.path.length;i++){const a=H2_PAGES[s.path[i-1]].pos,b=H2_PAGES[s.path[i]].pos;out+=arrowR(a,b,26,30,C.coral,2.5);const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];out+=Ci(m[0],m[1],10,'#fff',C.coral)+TF(m[0],m[1]+5,i,13,C.coral)}
  for(const [id,p] of Object.entries(H2_PAGES)){const on=id===s.cur,seen=s.path.includes(id);out+=Ci(p.pos[0],p.pos[1],26,on?C.blue:seen?C.pale:'#fff',on?C.blue:C.line)+TF(p.pos[0],p.pos[1]+5,p.t.length>9?p.t.slice(0,8)+'…':p.t,13,on?'#fff':C.ink)}
  return {svg:out,phase:`Path so far: ${s.path.map(id=>H2_PAGES[id].t).join(' → ')}. No two readers need take the same route, which is the point and, as later research found, also the risk.`};
 }});

const H2_LIB=['Turkish short bow','English long bow','The Crusades','Elasticity','Physical constants','Archery article','Mechanics textbook','Your own notes'];
const H2_LIB_SHORT=['Turkish','Long bow','Crusades','Elastic','Constants','Archery','Mechanics','Notes'];
SCENE({id:'hypertext-memex',name:'Memex trails',tag:'Bush, “As We May Think”, 1945',
 definition:'Vannevar Bush imagined the memex: a desk storing a person’s books and notes on microfilm, where any two items could be tied together and a sequence of ties kept as a named trail to follow or share.',
 example:'Bush’s own example: a reader studying why the Turkish short bow beat the English long bow builds a trail through an encyclopedia, a history, a table of constants and personal notes.',
 research:'Bush, V. (1945). As We May Think. The Atlantic Monthly, 176(1), 101–108.',
 desc:'A memex desk with two viewing screens showing consecutive items of a trail, the trail as a chain of labels above, and the library of microfilmed items below.',
 dur:12,hint:'Press items in the library to add them to your trail, then step through the trail as a reader would.',
 init:()=>({trail:[0,5,1,3,4,7]}),
 ui:[{b:'Remove last',act:'pop'},{b:'Clear trail',act:'clear'}],
 on:{add(s,i){if(s.trail.length<7)s.trail.push(Number(i))},pop(s){s.trail.pop()},clear(s){s.trail=[]}},
 trace(s){return s.trail.length?s.trail.map((it,k)=>({k})):[{k:-1}]},
 draw(s,f,X){
  let out=heading('A trail ties items together in an order you choose');
  s.trail.forEach((it,k)=>{const x=24+k*80,on=k===f.k||k===f.k+1;out+=R(x,48,74,30,on?C.amberp:'#fff',on?C.amber:C.grid,6)+TF(x+37,68,H2_LIB_SHORT[it],13,C.ink);if(k)out+=L(x-6,63,x,63,C.amber,2)});
  out+=R(20,92,560,150,'#6d4c2f','#4d3420',12);
  for(const [j,dx] of [[0,40],[1,310]]){const it=s.trail[f.k+j];out+=R(dx,106,250,122,it===undefined?'#2a2a2a':'#f5efdf','#222',4);if(it!==undefined){out+=TB(dx+125,140,H2_LIB[it],15,C.ink);out+=range(4).map(r=>R(dx+20,156+r*16,210-(r*23)%60,7,'#cbbf9f','none',2)).join('')}else out+=TF(dx+125,170,j?'end of trail':'empty',13,'#aaa')}
  out+=TF(300,258,'microfilm library: press to add to the trail',13,C.muted);
  H2_LIB.forEach((t,i)=>{const x=20+(i%4)*142,y=268+Math.floor(i/4)*44;out+=hit(X,'add',i,`Add ${t} to the trail`,R(x,y,136,38,'#fff',C.line,6)+TF(x+68,y+24,t,13,C.ink))});
  return {svg:out,phase:f.k<0?'The trail is empty. Bush’s insight was that association, not alphabetical indexing, is how the mind moves between ideas.':`Step ${f.k+1} of ${s.trail.length}: ${H2_LIB[s.trail[f.k]]}${s.trail[f.k+1]!==undefined?' → '+H2_LIB[s.trail[f.k+1]]:''}. The trail is permanent and can be handed to a colleague.`};
 }});

SCENE({id:'hypertext-transclusion',name:'Transclusion and two-way links',tag:'Nelson’s Xanadu versus the web',
 definition:'In Ted Nelson’s Xanadu design, a quotation is included by reference (transclusion), so it stays connected to its source, and links are visible from both ends. The web instead copies text and uses one-way links that can break.',
 example:'Quote a paragraph on the web and the author later corrects it: your copy is now out of date, and if the page moves your link shows “404 Not Found”. With transclusion the quote updates and the source can list everyone who quotes it.',
 research:'Nelson, T. H. (1981). Literary Machines. Mindful Press. Nelson, T. H. (1995). The heart of connection: hypermedia unified by transclusion. Communications of the ACM, 38(8), 31–33.',
 desc:'Your document A quoting a passage of source document B, either as a copy with a one-way link or as a live transclusion with a two-way link; editing or deleting B shows the consequences.',
 dur:12,hint:'Choose copy or transclusion, then have the author edit or delete the source.',
 init:()=>({mode:'copy',edited:false,deleted:false}),
 watch(p){const i=Math.min(5,Math.floor(p*6));return {mode:i<3?'copy':'transclude',edited:i%3===1,deleted:i%3===2}},
 ui:[{choose:[['copy','Copy + one-way link (web)'],['transclude','Transclusion (Xanadu)']],label:'Quoting method',get:s=>s.mode,act:'mode'},{b:'Author edits B',act:'edit'},{b:'Author deletes B',act:'del'}],
 on:{mode(s,v){s.mode=v;s.edited=false;s.deleted=false},edit(s){s.edited=true;s.deleted=false},del(s){s.deleted=true}},
 draw(s){
  const oldT='“Links should work in both directions.”',newT='“Links must work in both directions.”',src=s.edited?newT:oldT,tr=s.mode==='transclude';
  let out=heading(tr?'Transclusion: the quote is a window onto the source':'Copy and paste: the quote is a snapshot');
  out+=R(20,56,260,270,'#fff',C.grid,10)+TB(36,84,'Your essay (A)',16,C.ink,'start')+range(3).map(r=>R(36,100+r*14,220-(r*31)%70,6,'#dfe7ec','none',2)).join('');
  const qa=tr?(s.deleted?oldT:src):oldT,cut=t=>{const k=t.lastIndexOf(' ',24);return [t.slice(0,k),t.slice(k+1)]};
  out+=R(36,160,228,70,tr?C.greenp:'#f6f6f6',tr?C.green:C.line,8,tr?'stroke-dasharray="6 4"':'')+T(48,190,cut(qa)[0],14,C.ink,'start')+T(48,210,cut(qa)[1],14,C.ink,'start');
  if(!tr&&s.edited&&!s.deleted)out+=TB(150,252,'⚠ out of date',14,C.coral);
  out+=range(3).map(r=>R(36,268+r*14,210-(r*29)%60,6,'#dfe7ec','none',2)).join('');
  // Source document B.
  if(s.deleted&&!tr){out+=R(330,56,250,150,'#fff',C.coral,10,'stroke-dasharray="6 4"')+TB(455,120,'404 Not Found',22,C.coral)+TF(455,150,'the link points nowhere',13,C.muted)}
  else{out+=R(330,56,250,150,'#fff',C.grid,10)+TB(346,84,'Source (B)'+(s.deleted?' · kept version':''),15,C.ink,'start')+R(346,100,218,52,s.edited?C.amberp:'#f3f7fa','none',6)+T(356,122,cut(src)[0],14,C.ink,'start')+T(356,142,cut(src)[1],14,C.ink,'start')}
  if(tr){out+=P('M264 195 C 300 195 300 126 346 126',C.green,8,'none','opacity=".25"')+R(346,166,218,30,C.greenp,'none',6)+TF(455,186,'← quoted in: Your essay (A)',13,C.green)}
  else out+=arrow(264,170,328,120,s.deleted?C.coral:C.blue,2.5)+TF(300,138,'link',13,C.muted);
  const say=tr?(s.deleted?'Xanadu’s design keeps every published version, so the transcluded quote never breaks and still credits its source.':s.edited?'The author edited B, and your quote shows the change, because it is a live window onto B rather than a copy. B also knows who quotes it.':'The quoted passage is included by reference: it stays connected to B, and the link can be followed from either end.')
   :(s.deleted?'The page has gone, so the one-way link fails. Nothing told you: a web link does not know what points at it.':s.edited?'B was corrected, but your copy still shows the old words. Copies drift from their sources.':'The quote is a copy, and the link points one way only: B cannot see that you quoted it.');
  out+=R(330,226,250,100,tr?C.greenp:'#f3f7fa','none',10)+TB(455,252,tr?'Two-way, by reference':'One-way, by copy',15,tr?C.green:C.ink)+TF(455,278,tr?'edits flow through, credit kept':'edits lost, links can break',13,C.muted)+TF(455,302,tr?'Xanadu (designed from 1960)':'World Wide Web (1989)',13,C.muted);
  return {svg:out,phase:say};
 }});

// A 12-node hypertext for the disorientation scene.
const H2_NET={pos:[[90,90],[200,70],[310,90],[400,140],[330,200],[220,180],[110,190],[80,290],[200,290],[310,300],[420,260],[480,190]],
 links:[[1,5,6],[0,2,5],[1,3,4],[2,11,10],[2,5,9],[0,4,8],[0,7,5],[6,8],[7,9,5],[8,10,4],[9,3,11],[3,10]]};
const H2_WANDER=[0,1,2,3,10,9,8,5,4,2,1,0,6,7];
SCENE({id:'hypertext-lost',name:'Lost in hyperspace',tag:'The cost of freedom',
 definition:'Freedom to follow links brings disorientation: readers lose track of where they are and how they got there, and spend effort deciding which link to follow. Breadcrumbs, history and overview maps reduce the problem.',
 example:'Ten clicks into a wiki you may not know how you arrived or how to get back. A trail of breadcrumbs or a map restores your bearings.',
 research:'Conklin, J. (1987). Hypertext: an introduction and survey. IEEE Computer, 20(9), 17–41 (“disorientation” and “cognitive overhead”).',
 desc:'A hypertext of twelve pages; the reader’s current page and its links, with optional breadcrumbs and an overview map that reveals the network and the path taken.',
 dur:12,hint:'Follow links. Then turn on breadcrumbs and the overview map, and notice how much easier it is to say where you are.',
 init:()=>({path:[0],crumbs:false,map:false}),
 watch(p){const k=Math.min(H2_WANDER.length-1,Math.floor(p*H2_WANDER.length));return {path:H2_WANDER.slice(0,k+1),crumbs:p>.5,map:p>.7}},
 ui:[{b:'Breadcrumbs on/off',act:'crumbs'},{b:'Overview map on/off',act:'map'},{b:'Start again',act:'restart'}],
 on:{go(s,i){s.path.push(Number(i));if(s.path.length>30)s.path.shift()},crumbs(s){s.crumbs=!s.crumbs},map(s){s.map=!s.map},restart(s){s.path=[0]}},
 draw(s,f,X){
  const cur=s.path[s.path.length-1],distinct=new Set(s.path).size;let out=heading('Where am I, and how did I get here?');
  out+=R(20,52,190,250,'#fff',C.grid,10)+TB(36,80,'Page '+(cur+1),18,C.ink,'start')+T(36,104,'Links from here:',13,C.muted,'start');
  H2_NET.links[cur].forEach((to,i)=>{const y=116+i*44;out+=hit(X,'go',to,`Go to page ${to+1}`,R(36,y,158,34,C.pale,C.blue,6)+T(48,y+22,'→ Page '+(to+1),15,C.blue,'start','text-decoration="underline"'))});
  if(s.crumbs){out+=R(230,326,350,40,C.pale,'none',8)+TF(242,342,'You came via:',13,C.muted,'start')+TF(242,360,s.path.slice(-7).map(i=>'p'+(i+1)).join(' › '),14,C.blue,'start')}
  if(s.map){for(let a=0;a<12;a++)for(const b of H2_NET.links[a])if(b>a)out+=L(...H2_NET.pos[a].map((v,j)=>v+(j?0:110)),...H2_NET.pos[b].map((v,j)=>v+(j?0:110)),'#dfe7ec',1.5);
   for(let i=1;i<s.path.length;i++){const a=H2_NET.pos[s.path[i-1]],b=H2_NET.pos[s.path[i]];out+=L(a[0]+110,a[1],b[0]+110,b[1],C.coral,2.2)}
   H2_NET.pos.forEach(([x,y],i)=>{const on=i===cur,seen=s.path.includes(i);out+=Ci(x+110,y,15,on?C.blue:seen?C.coralp:'#fff',on?C.blue:C.line)+TF(x+110,y+5,i+1,13,on?'#fff':C.ink)});out+=TF(410,318,'overview map: you are the blue node',13,C.muted)}
  else out+=R(230,60,360,260,'#f0f3f5','none',12)+TB(410,180,'?',60,'#c9d4db')+TF(410,230,'No map: only the current page is visible',13,C.muted);
  out+=counter(20,306,'pages / distinct',`${s.path.length} / ${distinct}`,C.purple,190).replace(/y="306"/,'y="306"');
  return {svg:out,phase:`You have opened ${s.path.length} pages, ${s.path.length-distinct} of them repeats. ${s.map?'With an overview you can see the structure and your route.':s.crumbs?'Breadcrumbs show the recent route, though not the shape of the whole.':'With only the current page in view, it is easy to circle back without noticing.'}`};
 }});

/* ---------------- Lesson: Augmenting human intellect (1962) ---------------- */
const H2_DOC=[[1,'1','Augment human intellect','Raise the capability of a person to approach a complex problem and gain understanding.'],[2,'1a','Tools','Artefacts that extend what hands and eyes can do with symbols.'],[3,'1a1','Display screens','Show structured text and diagrams that update instantly.'],[3,'1a2','Pointing devices','Select any item on the screen directly.'],[2,'1b','Methods','Ways of working that make the most of the tools.'],[3,'1b1','Structured statements','Break writing into numbered, linked pieces.'],[1,'2','Bootstrapping','Use the tools to improve the tools, then repeat.'],[2,'2a','The team as first users','The researchers work with what they build.'],[3,'2a1','Faster improvement','Each round makes the next round quicker.']];
SCENE({id:'augmenting-intellect',name:'Augmenting human intellect',tag:'Engelbart’s 1962 framework and NLS views',
 definition:'Douglas Engelbart argued in 1962 that computers should augment human thinking, not replace it. His NLS system stored documents as numbered, nested statements that could be viewed at any level of detail.',
 example:'Collapse a long plan to its top-level headings, expand one branch to read it fully, or show only the first line of each statement: the same document, different views.',
 research:'Engelbart, D. C. (1962). Augmenting Human Intellect: A Conceptual Framework. SRI Summary Report AFOSR-3223. Engelbart & English (1968).',
 desc:'A structured document of numbered statements shown at the chosen depth, with full text or first lines only.',
 dur:10,hint:'Change how many levels are shown and whether full text appears. Nothing in the document changes, only the view.',
 init:()=>({lv:3,full:true}),
 watch(p){const i=Math.min(4,Math.floor(p*5));return {lv:[1,2,3,3,2][i],full:i>=3}},
 ui:[{range:'lv',label:'Levels shown',min:1,max:3,get:s=>s.lv,act:'lv'},{choose:[['full','Full text'],['first','Headings only']],label:'Detail',get:s=>s.full?'full':'first',act:'full'}],
 on:{lv(s,v){s.lv=v},full(s,v){s.full=v==='full'}},
 draw(s){
  let out=heading(`View: ${s.lv} level${s.lv>1?'s':''}, ${s.full?'full text':'headings only'}`)+H2_crt(20,48,560,300,'NLS view control');
  let y=78;const shown=H2_DOC.filter(d=>d[0]<=s.lv);
  for(const [lv,num,head,body] of shown){const x=40+(lv-1)*34;out+=TMF(x,y,num,14,H2_CRT.dim,'start')+TF(x+44,y,head,15,H2_CRT.glow,'start','font-weight="650"');y+=22;
   if(s.full){out+=TF(x+44,y,body.length>62-lv*5?body.slice(0,60-lv*5)+'…':body,13,H2_CRT.ink,'start');y+=24}}
  const hidden=H2_DOC.length-shown.length;out+=TF(560,340,hidden?`${hidden} statements hidden`:'all statements shown',13,H2_CRT.dim,'end');
  return {svg:out,phase:`${shown.length} of ${H2_DOC.length} statements visible. Engelbart’s point: views let a person handle more complexity, by showing the structure first and detail on demand.`};
 }});

const H2_ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
SCENE({id:'augmenting-chord',name:'The chord keyset',tag:'Five keys, thirty-one chords',
 definition:'Engelbart’s chord keyset had five piano-like keys pressed in combinations. Each chord is a 5-bit binary number, so 5 keys give 31 chords: enough for every letter, entered with one hand while the other holds the mouse.',
 example:'A is 00001 (the rightmost key), B is 00010, C is 00011… Z is 11010. Practised users could type commands and short words without moving to the keyboard.',
 research:'Engelbart, D. C. & English, W. K. (1968). A research center for augmenting human intellect. AFIPS Fall Joint Computer Conference, 33, 395–410.',
 desc:'Five keys shown as piano keys with the pressed ones lit, the binary value of the chord and its letter, and a table of all 26 letter chords.',
 dur:11,hint:'Press keys to form a chord, then Enter to type its letter. Try to spell a short word.',
 init:()=>({keys:[0,0,0,0,0],typed:''}),
 watch(p){const w='MOUSE',i=Math.min(4,Math.floor(p*5)),v=H2_ABC.indexOf(w[i])+1;return {keys:bin(v,5).split('').map(Number),typed:w.slice(0,i)}},
 ui:[{b:'Enter chord',act:'enter'},{b:'Delete letter',act:'del'},{b:'Clear',act:'clear'}],
 on:{key(s,i){s.keys[Number(i)]^=1},enter(s){const v=parseInt(s.keys.join(''),2);if(v>=1&&v<=26&&s.typed.length<14)s.typed+=H2_ABC[v-1];else if(v===27&&s.typed.length<14)s.typed+=' ';s.keys=[0,0,0,0,0]},del(s){s.typed=s.typed.slice(0,-1)},clear(s){s.typed='';s.keys=[0,0,0,0,0]}},
 draw(s,f,X){
  const v=parseInt(s.keys.join(''),2),ch=v>=1&&v<=26?H2_ABC[v-1]:v===27?'space':v===0?'—':'(command)';let out=heading('A chord is a five-bit number');
  s.keys.forEach((k,i)=>{const x=40+i*58;out+=hit(X,'key',i,`Key ${i+1} ${k?'down':'up'}. Press to toggle.`,R(x,56,50,130,k?C.blue:'#fff',k?C.blue:C.line,6)+TF(x+25,170,'2'+'⁴³²¹⁰'[i],13,k?'#fff':C.muted)+TB(x+25,120,k,20,k?'#fff':C.muted))});
  out+=TM(170,216,s.keys.join(''),22,C.ink)+TF(170,242,`= ${v}`,15,C.muted)+TB(170,286,ch,34,C.blue);
  out+=R(330,52,250,206,'#fff',C.grid,8);for(let i=0;i<26;i++){const x=340+(i%3)*80,y=70+Math.floor(i/3)*21.5,on=i===v-1;out+=(on?R(x-4,y-14,76,20,C.amberp,'none',4):'')+TF(x,y+2,H2_ABC[i],13,C.ink,'start','font-weight="700"')+TMF(x+18,y+2,bin(i+1,5),13,C.muted,'start')}
  out+=R(330,270,250,46,'#13291f','none',8)+TMF(344,300,(s.typed||'')+'▌',18,H2_CRT.glow,'start');
  return {svg:out,phase:`Keys ${s.keys.join('')} make ${v}${v>=1&&v<=26?', the letter '+ch:''}. Letters follow their place in the alphabet, so the code can be learned rather than memorised as 26 separate shapes.`};
 }});

SCENE({id:'augmenting-bootstrapping',name:'Bootstrapping',tag:'Improve the tools with the tools',
 definition:'Engelbart’s strategy was to “bootstrap”: the team used its own tools every day, so each improvement also made the team better at making the next improvement.',
 example:'A group that writes its documentation in its own editor finds the editor’s flaws first, fixes them, and then writes faster. Today this is called “eating your own dog food”.',
 research:'Engelbart, D. C. (1962). Augmenting Human Intellect: A Conceptual Framework. SRI Summary Report AFOSR-3223 (the bootstrapping strategy).',
 desc:'A loop of better tools, better toolmakers and faster improvement beside two growth curves: a team that spends some effort on its own tools, and one that spends none.',
 dur:10,hint:'Change the share of effort spent improving the team’s own tools. This is an illustrative model of compounding, not measured data.',
 init:()=>({share:20}),
 watch(p){return {share:Math.round(lerp(0,40,smooth(p)))}},
 ui:[{range:'share',label:'Effort on own tools',min:0,max:50,get:s=>s.share,act:'share',show:v=>v+'%'}],
 on:{share(s,v){s.share=v}},
 draw(s){
  const run=sh=>{ // illustrative compounding model
 let c=1;const out=[c];for(let t=1;t<=20;t++){c=c+c*sh*.25+(1-sh)*.05;out.push(c)}return out};
  const a=run(s.share/100),b=run(0);let out=heading('Tools that improve their makers compound');
  const cx=150,cy=190,rr=72;['better tools','better toolmakers','faster improvement'].forEach((t,i)=>{const ang=-Math.PI/2+i*2*Math.PI/3,x=cx+rr*Math.cos(ang),y=cy+rr*Math.sin(ang);out+=R(x-62,y-17,124,34,C.pale,C.blue,17)+TF(x,y+5,t,13,C.ink)});
  for(let i=0;i<3;i++){const a0=-Math.PI/2+i*2*Math.PI/3+.5,a1=a0+1.1;out+=curveArrow(cx+rr*Math.cos(a0),cy+rr*Math.sin(a0),cx+rr*Math.cos(a1),cy+rr*Math.sin(a1),12,C.blue,2)}
  const ymax=Math.max(4,Math.ceil(Math.max(...a)));const pl=H2_plot(300,60,270,220,20,ymax,'improvement cycles','capability',[0,5,10,15,20],[0,Math.round(ymax/2),ymax]);out+=pl.svg;
  out+=P(a.map((v,t)=>(t?'L':'M')+fmt(pl.px(t))+' '+fmt(pl.py(v))).join(''),C.green,3)+P(b.map((v,t)=>(t?'L':'M')+fmt(pl.px(t))+' '+fmt(pl.py(v))).join(''),C.muted,2.5,'none','stroke-dasharray="5 4"');
  out+=TF(pl.px(20),pl.py(a[20])-10,'bootstrapping',13,C.green,'end')+TF(pl.px(12),pl.py(b[12])+24,'no own-tool effort',13,C.muted)+TF(435,350,'illustrative model',13,C.muted);
  return {svg:out,phase:`With ${s.share}% of effort on the team’s own tools, capability after 20 cycles is about ${a[20].toFixed(1)}× the start, against ${b[20].toFixed(1)}× without. The curve bends upward because each gain speeds up the next.`};
 }});
