/* ===================== Physics era 4 · Waves and sound ===================== */
/* Watch: time is X.p × span seconds (deterministic). Try it: s.t advances only while Play is on, through the
   engine's ctx.every timer, so the picture is still a pure function of the state. All waves here are ideal
   (no damping unless stated, small amplitudes, linear media). */
const P4_time=(s,X,span)=>X.try?(s.t||0):X.p*span;
const P4_PLAY={b:'Play / pause',act:'play',aria:'Play or pause the motion'};
function P4_on(extra){return Object.assign({
 play(s,a,ctx){s.run=!s.run;if(s.run){s.tok=(s.tok||0)+1;ctx.every(50,'tick',s.tok)}return 'keep'},
 tick(s,tok){if(!s.run||Number(tok)!==s.tok)return 'stop';s.t=Math.round(((s.t||0)+0.05)*1000)/1000;return 'keep'}},extra)}
const P4_path=pts=>pts.map((p,i)=>(i?'L':'M')+fmt(p[0])+' '+fmt(p[1])).join('');
function P4_curve(x0,x1,n,f){const pts=[];for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n;pts.push([x,f(x,i/n)])}return P4_path(pts)}
const P4_note=(y,s)=>TF(300,y,s,13,C.muted);
// Paint a scalar field into a small canvas and show it as a smoothly scaled image (one SVG element, no aliasing).
function P4_field(x0,y0,W,H,fn,px=4){
 const cw=Math.ceil(W/px),ch=Math.ceil(H/px);let url='';
 try{const cv=document.createElement('canvas');cv.width=cw;cv.height=ch;const g=cv.getContext('2d'),im=g.createImageData(cw,ch);
  for(let j=0;j<ch;j++)for(let i=0;i<cw;i++){const v=fn(x0+(i+.5)*px,y0+(j+.5)*px),u=clamp(Math.abs(v)/2,0,1),to=v>=0?[196,82,56]:[23,114,183],o=4*(j*cw+i);
   for(let c=0;c<3;c++)im.data[o+c]=Math.round(255+(to[c]-255)*u);im.data[o+3]=255}
  g.putImageData(im,0,0);url=cv.toDataURL()}catch(e){return R(x0,y0,W,H,'#eef4f7','none',0)}
 return `<image href="${url}" x="${x0}" y="${y0}" width="${W}" height="${H}" preserveAspectRatio="none"/>`;
}
// Diverging colour for a signed displacement v in about [−2, 2]: blue troughs, white still water, coral crests.
function P4_rgb(v){const u=clamp(Math.abs(v)/2,0,1),to=v>=0?[196,82,56]:[23,114,183];return `rgb(${to.map(c=>Math.round(255+(c-255)*u)).join(',')})`}

/* ---------- Lesson: wave-basics ---------- */
SCENE({id:'wave-basics',name:'Wave',tag:'Energy moves; the medium stays',
 definition:'A wave is a travelling disturbance: energy moves from place to place while each bit of the medium only oscillates about where it started.',
 example:'Flick a rope and the hump runs along it, but no piece of rope travels with the hump. In a slinky or in air the particles move back and forth along the direction of travel instead: that is a longitudinal wave.',
 desc:'A rope carrying a transverse wave above a slinky carrying a longitudinal wave; one particle in each is highlighted and only oscillates in place while the wave pattern moves right.',
 dur:10,hint:'Press Play and follow the coral particle: it never leaves its dashed track. Change the amplitude to see bigger oscillations, not faster travel.',
 research:'d’Alembert (1747). Recherches sur la courbe que forme une corde tendue mise en vibration: the wave equation for a vibrating string.',
 init:()=>({t:0,amp:1,run:false}),
 ui:[P4_PLAY,{range:'amp',label:'Amplitude',min:.3,max:1.4,step:.1,get:s=>s.amp,act:'amp',show:v=>v.toFixed(1)}],
 on:P4_on({amp(s,v){s.amp=v}}),
 draw(s,f,X){
  const t=P4_time(s,X,10),A=s.amp,k=2*Math.PI/210,w=2*Math.PI*.5;let out=heading('Two kinds of mechanical wave');
  // Transverse: rope.
  const yR=118,ys=x=>yR-A*30*Math.sin(k*x-w*t);
  out+=TB(40,66,'Transverse (rope)',15,C.ink,'start')+T(560,66,'wave travels →',14,C.blue,'end');
  out+=P(P4_curve(40,560,104,x=>ys(x)),C.line,3);
  for(let i=0;i<=20;i++){const x=40+i*26;out+=Ci(x,ys(x),i===7?7:4.5,i===7?C.coral:C.blue)}
  const xm=40+7*26;out+=L(xm,yR-A*30-6,xm,yR+A*30+6,C.coral,1.5,'stroke-dasharray="4 4"');
  // Longitudinal: slinky.
  const yS=262;out+=TB(40,206,'Longitudinal (slinky or air)',15,C.ink,'start')+T(560,206,'wave travels →',14,C.blue,'end');
  for(let i=0;i<=52;i++){const x0=40+i*10,x=x0+A*9*Math.sin(k*x0-w*t),mark=i===18;out+=L(x,yS-26,x,yS+26,mark?C.coral:C.blue,mark?3.5:1.8)}
  const x18=40+18*10;out+=L(x18-A*9-4,yS+36,x18+A*9+4,yS+36,C.coral,2,'stroke-dasharray="4 4"');
  out+=P4_note(330,'Coral particles only oscillate in place (dashed tracks).')+P4_note(348,'Crowded coils: compressions · spread coils: rarefactions');
  out+=TF(300,370,`Amplitude ${A.toFixed(1)} (relative) · 0.5 Hz · ideal, undamped`,13,C.muted);
  return {svg:out,phase:'The pattern moves right; the medium does not. In the rope each particle moves at right angles to the travel; in the slinky it moves along the travel, making compressions and rarefactions, as sound does in air.'};
 }});

SCENE({id:'wave-basics-speed',name:'Wave speed, frequency and wavelength',tag:'v = f λ',
 definition:'A wave’s speed equals its frequency times its wavelength: in one period the pattern moves on by exactly one wavelength.',
 example:'A wave with frequency 2 Hz and wavelength 1.5 m travels at 3 m/s. In a given medium the speed is fixed, so raising the frequency shortens the wavelength.',
 desc:'A wave over a six-metre ruler; one crest is tracked while readouts show frequency, wavelength, period and the speed they multiply to.',
 dur:10,hint:'Set frequency and wavelength, then press Play and time the coral crest along the ruler. Its speed is always f × λ.',
 research:'Huygens (1690). Traité de la lumière: waves as disturbances spreading at a definite speed; v = fλ follows from one wavelength per period.',
 init:()=>({t:0,fq:1,lam:1.5,run:false}),
 ui:[P4_PLAY,{range:'fq',label:'Frequency',min:.2,max:3,step:.1,get:s=>s.fq,act:'fq',show:v=>v.toFixed(1)+' Hz'},{range:'lam',label:'Wavelength',min:.5,max:3,step:.1,get:s=>s.lam,act:'lam',show:v=>v.toFixed(1)+' m'}],
 on:P4_on({fq(s,v){s.fq=v},lam(s,v){s.lam=v}}),
 draw(s,f,X){
  const t=P4_time(s,X,10),fq=s.fq,lam=s.lam,v=fq*lam,mx=x=>40+x*(520/6),y0=170;let out=heading('In one period the wave moves one wavelength');
  out+=L(40,y0,560,y0,C.grid,1.5);
  out+=P(P4_curve(40,560,150,(px)=>{const x=(px-40)/(520/6);return y0-48*Math.sin(2*Math.PI*(x/lam-fq*t))}),C.blue,3);
  // Track the crest that started at x = λ/4 (wrapped to the ruler).
  const xc=((lam/4+v*t)%6+6)%6;out+=Ci(mx(xc),y0-48,8,C.coral);
  // λ bracket under the first full wavelength after the tracked crest.
  const xb=xc+lam<=6?xc:Math.max(0,xc-lam);out+=L(mx(xb),y0-70,mx(xb+lam),y0-70,C.green,2)+L(mx(xb),y0-76,mx(xb),y0-64,C.green,2)+L(mx(xb+lam),y0-76,mx(xb+lam),y0-64,C.green,2)+TB((mx(xb)+mx(xb+lam))/2,y0-80,'λ',15,C.green);
  out+=L(40,250,560,250,C.ink,2);for(let m=0;m<=6;m++){out+=L(mx(m),244,mx(m),256,C.ink,2)+T(mx(m),274,m+' m',13,C.muted)}
  out+=counter(40,296,'frequency f',fq.toFixed(1)+' Hz',C.blue,118)+counter(168,296,'wavelength λ',lam.toFixed(1)+' m',C.green,118)+counter(296,296,'period T = 1/f',(1/fq).toFixed(2)+' s',C.purple,128)+counter(434,296,'speed v = f λ',v.toFixed(2)+' m/s',C.coral,126);
  return {svg:out,phase:`${fq.toFixed(1)} Hz × ${lam.toFixed(1)} m = ${v.toFixed(2)} m/s. The coral crest has moved ${(v*t).toFixed(1)} m in ${t.toFixed(1)} s. In one medium v is set by the medium, so f and λ trade off.`};
 }});

SCENE({id:'wave-basics-energy',name:'Amplitude and energy',tag:'Double the height, four times the energy',
 definition:'The energy a wave carries grows with the square of its amplitude. How it depends on frequency depends on the wave and on what “amplitude” measures: for a wave on a string, at a fixed displacement amplitude, energy also grows with the square of the frequency; for sound at a fixed pressure amplitude, intensity does not depend on frequency.',
 example:'A sea swell twice as high carries about four times the energy per metre of wave front. Sound twice the pressure amplitude carries four times the intensity.',
 desc:'A wave whose amplitude can be changed, beside bars comparing amplitude and energy relative to a reference wave.',
 dur:9,hint:'Slide the amplitude and frequency. This is a wave on a string: the energy bar grows as amplitude² × frequency², so doubling either quadruples it.',
 research:'Feynman, Leighton & Sands (1963). The Feynman Lectures on Physics, Vol. I, ch. 47–51: wave energy and intensity ∝ amplitude².',
 init:()=>({amp:1,fq:1}),
 watch(p){return {amp:.5+1.5*smooth(p),fq:1}},
 ui:[{range:'amp',label:'Amplitude',min:.25,max:2,step:.05,get:s=>s.amp,act:'amp',show:v=>'× '+v.toFixed(2)},{range:'fq',label:'Frequency',min:.5,max:2,step:.1,get:s=>s.fq,act:'fq',show:v=>'× '+v.toFixed(1)}],
 on:{amp(s,v){s.amp=v},fq(s,v){s.fq=v}},
 draw(s){
  const A=s.amp,fq=s.fq,E=A*A*fq*fq;let out=heading('String wave: energy ∝ amplitude² × frequency²');
  out+=L(30,160,350,160,C.grid,1.5)+P(P4_curve(30,350,120,(x)=>160-A*40*Math.sin(2*Math.PI*fq*(x-30)/160)),C.blue,3);
  out+=P(P4_curve(30,350,120,(x)=>160-40*Math.sin(2*Math.PI*(x-30)/160)),C.line,1.5,'none','stroke-dasharray="5 5"');
  out+=T(190,262,'dashed: reference wave (× 1, × 1)',13,C.muted);
  const bar=(x,label,val,col)=>{const h=Math.min(190,val*48);return R(x,260-h,56,h,col,'none',6)+TBF(x+28,252-h,'× '+(val<10?val.toFixed(2):val.toFixed(1)),14,col)+TF(x+28,282,label,13,C.ink)};
  out+=L(390,260,590,260,C.ink,1.5)+L(390,260-48,590,260-48,C.grid,1,'stroke-dasharray="4 4"')+TF(386,260-44,'reference',13,C.muted,'end');
  out+=bar(400,'amplitude',A,C.blue)+bar(464,'freq.',fq,C.green)+bar(528,'energy',E,C.coral);
  out+=P4_note(330,'Energy per unit length of a wave on a string = ½ μ ω² A² (μ: mass per metre, ω = 2πf).');
  out+=P4_note(354,E>3.6?'Bars over the scale are clipped; read the number above them.':'Ideal string or gas: no damping.');
  return {svg:out,phase:`Amplitude × ${A.toFixed(2)} and frequency × ${fq.toFixed(1)} give energy × ${E.toFixed(2)}: the squares multiply. That is why a modest rise in wave height makes a much more destructive sea.`};
 }});

/* ---------- Lesson: superposition ---------- */
function P4_pulse(x,c,w=34){return Math.exp(-(((x-c)/w)**2))}
SCENE({id:'superposition',name:'Superposition',tag:'Waves add, then carry on',
 definition:'When two waves overlap, the displacement at each point is the sum of the displacements each wave would cause alone, and each wave leaves the meeting unchanged.',
 example:'Two equal pulses meeting on a rope make one pulse twice as tall. An upright pulse meeting an inverted one makes the rope momentarily flat, yet both reappear: the energy was still there, as motion.',
 desc:'Two pulses approach on a rope from opposite ends; the thin blue and coral curves show each pulse alone and the thick dark curve shows their sum.',
 dur:9,hint:'Drag the time slider through the meeting. Choose same-side or opposite pulses and watch the sum double or vanish, then the pulses pass through unchanged.',
 research:'Young (1802). On the theory of light and colours, Phil. Trans.: the principle of interference (superposition) of waves.',
 init:()=>({t:1.2,mode:'same'}),
 watch(p){return {t:p*4,mode:p<.5?'same':'opposite'}},
 ui:[{range:'t',label:'Time',min:0,max:4,step:.05,get:s=>s.t,act:'t',show:v=>v.toFixed(2)+' s'},{choose:[['same','Same side'],['opposite','Opposite']],label:'Pulses',get:s=>s.mode,act:'mode'}],
 on:{t(s,v){s.t=v},mode(s,v){s.mode=v}},
 draw(s,f,X){
  const t=X.try?s.t:s.t,sg=s.mode==='same'?1:-1,xa=60+120*t,xb=540-120*t,y0=200,h=70;let out=heading('Displacements add point by point');
  out+=L(30,y0,570,y0,C.grid,1.5);
  out+=P(P4_curve(30,570,160,x=>y0-h*P4_pulse(x,xa)),C.blue,2,'none','stroke-dasharray="6 4"');
  out+=P(P4_curve(30,570,160,x=>y0-sg*h*P4_pulse(x,xb)),C.coral,2,'none','stroke-dasharray="6 4"');
  out+=P(P4_curve(30,570,240,x=>y0-h*P4_pulse(x,xa)-sg*h*P4_pulse(x,xb)),C.ink,4);
  out+=arrow(xa-20,96,xa+20,96,C.blue,2)+T(xa,86,'A →',14,C.blue)+arrow(xb+20,320,xb-20,320,C.coral,2)+T(xb,344,'← B',14,C.coral);
  const meet=Math.abs(t-2)<.25;
  if(meet)out+=R(170,54,260,30,sg>0?C.amberp:C.greenp,'none',8)+TB(300,74,sg>0?'Overlap: twice the height':'Overlap: momentarily flat',15,sg>0?C.amber:C.green);
  return {svg:out,phase:t<1.6?'The pulses approach. Each would travel alone exactly as drawn by its dashed curve.':t<2.4?(sg>0?'Where they overlap the heights add: the rope rises to about twice one pulse.':'Opposite pulses cancel in shape, but each bit of rope is still moving: the energy is in motion, not lost.'):'They have passed through each other unchanged, as if the other had never been there.'};
 }});

SCENE({id:'superposition-two-sources',name:'Two-source interference',tag:'Still lines in a ripple tank',
 definition:'Two sources of the same frequency make a fixed pattern: where crests meet crests the water moves strongly; where crests meet troughs it stays still, along nodal lines.',
 example:'Thomas Young drew this pattern for two sets of water ripples in 1807. Points on a nodal line are half a wavelength further from one source than the other (or 1½, 2½ …).',
 desc:'A ripple tank seen from above with two point sources at the left; colour shows the instantaneous height (coral crests, blue troughs, white still water) and the still nodal lines fan out to the right.',
 dur:10,hint:'Change the source separation and the wavelength. More wavelengths between the sources give more nodal lines. Press Play to see the pattern ripple while the still lines stay put.',
 research:'Young (1807). A Course of Lectures on Natural Philosophy and the Mechanical Arts: the two-source water-wave interference figure.',
 init:()=>({t:0,d:3,lam:36,run:false}),
 ui:[P4_PLAY,{range:'d',label:'Separation',min:1,max:6,step:.5,get:s=>s.d,act:'d',show:v=>v.toFixed(1)+' λ'},{range:'lam',label:'Wavelength',min:24,max:56,step:2,get:s=>s.lam,act:'lam',show:v=>v+' px'}],
 on:P4_on({d(s,v){s.d=v},lam(s,v){s.lam=v}}),
 draw(s,f,X){
  const t=P4_time(s,X,10),lam=s.lam,k=2*Math.PI/lam,w=2*Math.PI*.6,sep=s.d*lam,cy=196,sx=40,y1=cy-sep/2,y2=cy+sep/2,cs=10;let out='';
  out+=P4_field(0,52,600,288,(x,y)=>Math.cos(k*Math.hypot(x-sx,y-y1)-w*t)+Math.cos(k*Math.hypot(x-sx,y-y2)-w*t));
  out+=Ci(sx,y1,6,C.ink,'#fff')+Ci(sx,y2,6,C.ink,'#fff');
  const nodal=2*Math.floor(s.d+.5);
  out+=R(0,0,600,50,'#f3f7fa','none',0)+heading('Ripples from two sources');
  out+=R(360,346,236,30,'#fff',C.grid,6)+TBF(478,366,`${nodal} nodal lines (still water)`,14,C.ink);
  out+=TF(10,366,'Coral: crest · blue: trough · white: still',13,C.muted,'start');
  return {svg:out,phase:`The sources are ${s.d.toFixed(1)} wavelengths apart, so the path difference can reach ±${s.d.toFixed(1)}λ and there are ${nodal} nodal lines, where it equals an odd number of half-wavelengths. Ideal point sources; amplitude fall-off ignored.`};
 },
 three(s,f,X,project){
  const t=P4_time(s,X,10),lam=s.lam,k=2*Math.PI/lam,w=2*Math.PI*.6,sep=s.d*lam,N=26,span=300,Pj=project([[0,0,-1.6],[N,N,-1.6],[0,N,1.6],[N,0,1.6]]);
  const h=(i,j)=>{const x=40+i*(span*1.6/N),y=196+(j-N/2)*(span/N);return .8*(Math.cos(k*Math.hypot(x-40,y-196+sep/2)-w*t)+Math.cos(k*Math.hypot(x-40,y-196-sep/2)-w*t))};
  let out='';for(let j=0;j<=N;j+=1){const pts=[];for(let i=0;i<=N;i++){const p=Pj([i,j,h(i,j)]);pts.push([p[0],p[1]])}out+=P(P4_path(pts),j%2?'#9ab5c7':C.blue,1.2)}
  for(let i=0;i<=N;i+=2){const pts=[];for(let j=0;j<=N;j++){const p=Pj([i,j,h(i,j)]);pts.push([p[0],p[1]])}out+=P(P4_path(pts),'#c4d4de',.8)}
  return {svg:out,title:'The water surface in 3D',caption:'The same field as a surface: tall peaks where crests meet crests, flat channels along the nodal lines.'};
 }});

SCENE({id:'superposition-beats',name:'Beats',tag:'Two close notes throb',
 definition:'Two waves with slightly different frequencies drift in and out of step, so their sum swells and fades at the difference frequency: the beat frequency.',
 example:'Strings tuned to 440 Hz and 442 Hz throb twice a second. Tuners listen for the beats to slow and vanish as the strings come into tune.',
 desc:'Two waves of nearby frequency and their sum over two seconds; a dashed envelope shows the slow swell and fade at the difference frequency.',
 dur:10,hint:'Bring the two frequencies closer and the beats slow down; at equal frequencies they stop. The beat rate is always |f₁ − f₂|.',
 research:'Sauveur (1701). Système général des intervalles des sons (Mémoires de l’Académie royale des sciences): counting beats to measure vibration frequencies.',
 init:()=>({f1:10,f2:11}),
 watch(p){return {f1:10,f2:12-1.8*smooth(p)}},
 ui:[{range:'f1',label:'f₁',min:8,max:12,step:.1,get:s=>s.f1,act:'f1',show:v=>v.toFixed(1)+' Hz'},{range:'f2',label:'f₂',min:8,max:12,step:.1,get:s=>s.f2,act:'f2',show:v=>v.toFixed(1)+' Hz'}],
 on:{f1(s,v){s.f1=v},f2(s,v){s.f2=v}},
 draw(s){
  const f1=s.f1,f2=s.f2,df=Math.abs(f1-f2),tx=x=>(x-40)/520*2;let out=heading('Close frequencies drift in and out of step');
  out+=TB(36,64,'f₁ = '+f1.toFixed(1)+' Hz',13,C.blue,'start')+P(P4_curve(40,560,400,x=>92-18*Math.sin(2*Math.PI*f1*tx(x))),C.blue,1.6);
  out+=TB(36,128,'f₂ = '+f2.toFixed(1)+' Hz',13,C.coral,'start')+P(P4_curve(40,560,400,x=>156-18*Math.sin(2*Math.PI*f2*tx(x))),C.coral,1.6);
  out+=TB(36,196,'sum',13,C.ink,'start')+P(P4_curve(40,560,500,x=>254-24*(Math.sin(2*Math.PI*f1*tx(x))+Math.sin(2*Math.PI*f2*tx(x)))),C.ink,2);
  out+=P(P4_curve(40,560,200,x=>254-48*Math.abs(Math.cos(Math.PI*df*tx(x)))),C.amber,1.6,'none','stroke-dasharray="5 4"');
  out+=L(40,318,560,318,C.ink,1.5);for(let i=0;i<=4;i++){const x=40+i*130;out+=L(x,312,x,324,C.ink,1.5)+T(x,342,(i*.5).toFixed(1)+' s',13,C.muted)}
  out+=counter(420,52,'beat frequency',df<.05?'none':df.toFixed(1)+' Hz',C.amber,150);
  return {svg:out,phase:df<.05?'Equal frequencies stay in step forever: no beats. This is how instruments are tuned by ear.':`|${f1.toFixed(1)} − ${f2.toFixed(1)}| = ${df.toFixed(1)} Hz: the sum swells and fades ${df.toFixed(1)} times a second, while its inner wiggle sits at the average, ${((f1+f2)/2).toFixed(1)} Hz.`};
 }});

/* ---------- Lesson: standing-waves ---------- */
const P4_MU=.005; // kg/m, string mass per metre
SCENE({id:'standing-waves',name:'Standing wave',tag:'Fixed nodes, swinging antinodes',
 definition:'A standing wave is the sum of two equal waves travelling in opposite directions: points called nodes never move, and antinodes between them swing the most.',
 example:'A guitar string fixed at both ends can only hold whole numbers of half-wavelengths, so it vibrates at f₁, 2f₁, 3f₁ … : the harmonics.',
 desc:'A string fixed at both ends vibrating in a chosen harmonic, with nodes and antinodes labelled, beside readouts of wave speed and frequency from length, tension and mass per metre.',
 dur:12,hint:'Choose the harmonic, then change length and tension. Mersenne’s laws: frequency falls with length, rises with the square root of tension.',
 research:'Mersenne (1636). Harmonie universelle: frequency of a string ∝ (1/L)·√(tension/mass per length) — Mersenne’s laws.',
 init:()=>({t:0,n:2,L:.65,Tn:80,run:false}),
 watch(p){return {t:p*12,n:1+Math.min(4,Math.floor(p*5)),L:.65,Tn:80}},
 ui:[P4_PLAY,{range:'n',label:'Harmonic n',min:1,max:6,step:1,get:s=>s.n,act:'n'},{range:'L',label:'Length',min:.3,max:1,step:.05,get:s=>s.L,act:'L',show:v=>v.toFixed(2)+' m'},{range:'Tn',label:'Tension',min:20,max:200,step:5,get:s=>s.Tn,act:'Tn',show:v=>v+' N'}],
 on:P4_on({n(s,v){s.n=v},L(s,v){s.L=v},Tn(s,v){s.Tn=v}}),
 draw(s,f,X){
  const t=X.try?(s.t||0):s.t,n=s.n,Lm=s.L,v=Math.sqrt(s.Tn/P4_MU),f1=v/(2*Lm),fn=n*f1,x0=60,len=Lm*480,y0=166,A=46,c=Math.cos(2*Math.PI*.7*t);
  let out=heading('Harmonic '+n+': '+n+' half-wavelength'+(n>1?'s':'')+' fit the string');
  out+=P(P4_curve(x0,x0+len,160,x=>y0-A*Math.sin(n*Math.PI*(x-x0)/len)),C.line,1,'none','stroke-dasharray="4 4"')+P(P4_curve(x0,x0+len,160,x=>y0+A*Math.sin(n*Math.PI*(x-x0)/len)),C.line,1,'none','stroke-dasharray="4 4"');
  out+=P(P4_curve(x0,x0+len,200,x=>y0-A*c*Math.sin(n*Math.PI*(x-x0)/len)),C.blue,3.5);
  out+=R(x0-12,y0-40,12,80,C.dark,'none',3)+R(x0+len,y0-40,12,80,C.dark,'none',3);
  for(let i=0;i<=n;i++){const x=x0+len*i/n;out+=Ci(x,y0,6,C.coral)+TF(x,y0+68,'N',13,C.coral)}
  for(let i=0;i<n;i++){const x=x0+len*(i+.5)/n;out+=TF(x,y0-60,'A',13,C.green)}
  out+=TF(300,y0+94,'N: node (never moves) · A: antinode (largest swing)',13,C.muted);
  out+=counter(30,290,'wave speed √(T/μ)',v.toFixed(0)+' m/s',C.purple,132)+counter(172,290,'f₁ = v / 2L',f1.toFixed(1)+' Hz',C.blue,120)+counter(302,290,'fₙ = n f₁',fn.toFixed(1)+' Hz',C.coral,120)+counter(432,290,'λₙ = 2L / n',(2*Lm/n).toFixed(2)+' m',C.green,138);
  out+=TF(300,368,'μ = 5 g/m. The drawn swing is slowed down; the real string vibrates at fₙ.',13,C.muted);
  return {svg:out,phase:`Length ${Lm.toFixed(2)} m, tension ${s.Tn} N: waves travel at ${v.toFixed(0)} m/s, so the fundamental is ${f1.toFixed(1)} Hz and harmonic ${n} is ${fn.toFixed(1)} Hz. Halve the length and every frequency doubles.`};
 }});

const P4_MODES=[[1,2],[1,3],[2,3],[1,4],[2,5],[3,4]];
function P4_chladni(m,n,x,y){const P=Math.PI;return Math.cos(m*P*x)*Math.cos(n*P*y)-Math.cos(n*P*x)*Math.cos(m*P*y)}
SCENE({id:'standing-waves-chladni',name:'Chladni figures',tag:'Sand finds the nodal lines',
 definition:'A vibrating plate has standing waves in two dimensions. Sand scattered on it is thrown off the moving regions and settles on the nodal lines, which stay still.',
 example:'Ernst Chladni bowed sand-covered metal plates in the 1780s and drew the figures. Each mode gives a different pattern; higher modes give finer patterns.',
 desc:'A square plate with grains of sand that gather along the still nodal lines of a chosen vibration mode as bowing continues.',
 dur:12,hint:'Pick a mode and slide “bow strokes”: the grains move away from vibrating areas and settle on the nodal lines.',
 research:'Chladni (1787). Entdeckungen über die Theorie des Klanges (Discoveries in the theory of sound).',
 init:()=>({mode:2,strokes:12}),
 watch(p){return {mode:p<.5?0:2,strokes:Math.round(((p<.5?p:p-.5)*2)*22)}},
 ui:[{choose:P4_MODES.map((m,i)=>[i,m.join(',')]),label:'Mode',get:s=>s.mode,act:'mode'},{range:'strokes',label:'Bow strokes',min:0,max:24,step:1,get:s=>s.strokes,act:'strokes'}],
 on:{mode(s,v){s.mode=Number(v);s.strokes=0},strokes(s,v){s.strokes=v}},
 draw(s){
  const [m,n]=P4_MODES[s.mode],x0=40,y0=60,W=270,r=rng(4242+s.mode);let out=heading('A bowed plate sorts the sand');
  out+=R(x0-6,y0-6,W+12,W+12,'#3b4750','none',6);
  for(let g=0;g<520;g++){let x=r(),y=r();
   for(let k=0;k<s.strokes;k++){const e=1e-3,z=P4_chladni(m,n,x,y),gx=(P4_chladni(m,n,x+e,y)-z)/e,gy=(P4_chladni(m,n,x,y+e)-z)/e,g2=gx*gx+gy*gy+.5;x=clamp(x-.35*z*gx/g2,0,1);y=clamp(y-.35*z*gy/g2,0,1)}
   out+=`<circle cx="${fmt(x0+x*W)}" cy="${fmt(y0+y*W)}" r="1.7" fill="#f4e6c4"/>`}
  out+=TB(450,84,'Mode ('+m+', '+n+')',18,C.ink)+T(450,110,s.strokes+' bow strokes',15,C.muted);
  const lines=['Vibrating regions throw','the sand off; it piles up','where the plate stays still.','','Idealised square-plate','pattern:','z = cos mπx · cos nπy','   − cos nπx · cos mπy'];
  lines.forEach((l,i)=>out+=(i>=6?TMF:TF)(350,150+i*22,l,13,i>=4?C.muted:C.ink,'start','xml:space="preserve"'));
  out+=TF(300,362,'Real free-edge plates have more complex modes; this formula is a classic approximation.',13,C.muted);
  return {svg:out,phase:s.strokes<4?'Sand starts spread evenly. Each bow stroke shakes it off the parts of the plate that move.':`After ${s.strokes} strokes the sand has gathered along the nodal lines of mode (${m}, ${n}): a picture of where the plate does not move.`};
 }});

SCENE({id:'standing-waves-pipes',name:'Open and closed pipes',tag:'Air columns ring at set notes',
 definition:'Air in a pipe holds standing sound waves. An open end is a displacement antinode; a closed end is a node. That decides which harmonics exist.',
 example:'A pipe open at both ends sounds f, 2f, 3f …; the same length closed at one end sounds an octave lower and only odd harmonics: f, 3f, 5f …',
 desc:'A pipe of chosen length, open at both ends or closed at one, with the shaded envelope of air displacement for the chosen mode and its frequency.',
 dur:10,hint:'Switch between open and closed and step through the modes. Closed pipes skip the even harmonics.',
 research:'Helmholtz (1863). On the Sensations of Tone: resonance of air columns and pipes (end corrections ignored here).',
 init:()=>({type:'open',k:1,L:.8,t:0,run:false}),
 watch(p){return {type:p<.5?'open':'closed',k:1+Math.min(2,Math.floor((p%.5)*6)),L:.8,t:p*10}},
 ui:[P4_PLAY,{choose:[['open','Open–open'],['closed','Closed–open']],label:'Pipe',get:s=>s.type,act:'type'},{range:'k',label:'Mode',min:1,max:4,step:1,get:s=>s.k,act:'k'},{range:'L',label:'Length',min:.3,max:1.2,step:.05,get:s=>s.L,act:'L',show:v=>v.toFixed(2)+' m'}],
 on:P4_on({type(s,v){s.type=v},k(s,v){s.k=v},L(s,v){s.L=v}}),
 draw(s,f,X){
  const t=X.try?(s.t||0):s.t,open=s.type==='open',n=open?s.k:2*s.k-1,v=343,fr=open?n*v/(2*s.L):n*v/(4*s.L),x0=70,W=460,y0=150,H=56,c=Math.cos(2*Math.PI*.6*t);
  const env=x=>{const u=(x-x0)/W;return open?Math.abs(Math.cos(n*Math.PI*u)):Math.abs(Math.sin(n*Math.PI*u/2))};
  let out=heading(open?'Open at both ends: every harmonic':'Closed at the left: odd harmonics only');
  out+=R(x0,y0-H,W,2*H,'#eef4f7','none',0)+L(x0,y0-H,x0+W,y0-H,C.dark,4)+L(x0,y0+H,x0+W,y0+H,C.dark,4);
  if(!open)out+=L(x0,y0-H-2,x0,y0+H+2,C.dark,8);
  out+=P(P4_curve(x0,x0+W,160,x=>y0-H*.8*env(x)),C.blue,1.5,'none','stroke-dasharray="4 4"')+P(P4_curve(x0,x0+W,160,x=>y0+H*.8*env(x)),C.blue,1.5,'none','stroke-dasharray="4 4"');
  out+=P(P4_curve(x0,x0+W,160,x=>{const u=(x-x0)/W;return y0-H*.8*c*(open?Math.cos(n*Math.PI*u):Math.sin(n*Math.PI*u/2))}),C.coral,3);
  out+=TF(x0,y0+H+22,open?'open: antinode':'closed: node',13,C.muted,'start')+TF(x0+W,y0+H+22,'open: antinode',13,C.muted,'end');
  out+=counter(70,262,'harmonic',String(n),C.blue,110)+counter(196,262,'length',s.L.toFixed(2)+' m',C.green,110)+counter(322,262,'frequency',fr.toFixed(0)+' Hz',C.coral,110)+counter(448,262,'speed of sound',v+' m/s',C.purple,110);
  out+=TF(300,340,open?'f = n v / 2L  (n = 1, 2, 3 …)':'f = n v / 4L  (n = 1, 3, 5 …)',15,C.ink);
  out+=TF(300,362,'Dashed: displacement envelope · coral: the air now (slowed)',13,C.muted)+TF(300,378,'Air at 20 °C; end corrections ignored.',13,C.muted);
  return {svg:out,phase:`${open?'Open–open':'Closed–open'} pipe, ${s.L.toFixed(2)} m long: harmonic ${n} at about ${fr.toFixed(0)} Hz. ${open?'Both ends must be antinodes, so whole half-wavelengths fit.':'A node at the closed end and an antinode at the open end fit only odd quarter-wavelengths.'}`};
 }});

/* ---------- Lesson: sound ---------- */
SCENE({id:'sound',name:'Sound',tag:'A pressure wave in air',
 definition:'Sound is a longitudinal wave: air molecules oscillate back and forth along the direction of travel, making alternating compressions (high pressure) and rarefactions (low pressure).',
 example:'Robert Boyle showed in 1660 that a ringing bell in a jar fades as the air is pumped out: sound needs a medium. The pressure peaks sit where the displacement crosses zero.',
 desc:'Columns of air particles displaced back and forth, above two graphs: particle displacement and pressure, which peaks a quarter-wavelength away from the displacement peak.',
 dur:10,hint:'Press Play and change the wavelength. Compare the two graphs: the pressure peak is where neighbouring particles crowd together, a quarter-wave from the biggest displacement.',
 research:'Boyle (1660). New Experiments Physico-Mechanicall, Touching the Spring of the Air: a bell in an evacuated receiver cannot be heard.',
 init:()=>({t:0,lam:220,run:false}),
 ui:[P4_PLAY,{range:'lam',label:'Wavelength',min:120,max:320,step:10,get:s=>s.lam,act:'lam',show:v=>v+' px'}],
 on:P4_on({lam(s,v){s.lam=v}}),
 draw(s,f,X){
  const t=P4_time(s,X,10),k=2*Math.PI/s.lam,w=2*Math.PI*.5,A=9;let out=heading('Particles swing; pressure rises and falls');
  for(let i=0;i<=40;i++)for(let j=0;j<6;j++){const x0=48+i*12.6,x=x0+A*Math.sin(k*x0-w*t);out+=Ci(x,66+j*16,2.6,(i===14&&j===2)?C.coral:C.blue)}
  out+=L(40,214,560,214,C.grid,1.2)+TB(36,182,'displacement',13,C.blue,'start')+P(P4_curve(40,560,150,x=>214-26*Math.sin(k*x-w*t)),C.blue,2.2);
  out+=L(40,304,560,304,C.grid,1.2)+TB(36,272,'pressure',13,C.coral,'start')+P(P4_curve(40,560,150,x=>304+26*Math.cos(k*x-w*t)),C.coral,2.2);
  out+=TF(560,182,'+ forward',13,C.muted,'end')+TF(560,272,'+ compression',13,C.muted,'end');
  out+=TF(300,360,'Pressure = −(slope of displacement) × stiffness of air: a quarter-wave shift.',13,C.muted);
  return {svg:out,phase:'Where particles on both sides move towards each other, the air is squeezed: a compression and a pressure peak. Your ear drum is pushed by the pressure, not by air travelling from the source.'};
 }});

const P4_vs=T=>331.3*Math.sqrt(1+T/273.15);
SCENE({id:'sound-speed',name:'Speed of sound',tag:'About 343 m/s, and warmer is faster',
 definition:'Sound in air travels at about 343 m/s at 20 °C, a million times slower than light, and faster in warmer air: v ≈ 331.3 √(1 + T/273.15) m/s.',
 example:'Count the seconds from lightning to thunder and divide by 3 to get the distance in kilometres: sound covers about 1 km in 3 s.',
 desc:'A lightning flash at the left and a listener at a chosen distance; the flash arrives at once while the sound front crosses the gap, with readouts for speed and arrival time.',
 dur:12,hint:'Set the distance and the air temperature, then drag “time since flash” until the sound front reaches the listener.',
 research:'Laplace (1816) corrected Newton’s (1687) speed of sound by treating compressions as adiabatic; the French Academy of Sciences timed cannon fire over long distances in 1738.',
 init:()=>({T:20,d:2,tt:3}),
 watch(p){return {T:20,d:2,tt:p*7.5}},
 ui:[{range:'d',label:'Distance',min:.2,max:5,step:.1,get:s=>s.d,act:'d',show:v=>v.toFixed(1)+' km'},{range:'T',label:'Air',min:-20,max:40,step:1,get:s=>s.T,act:'T',show:v=>v+' °C'},{range:'tt',label:'Time since flash',min:0,max:16,step:.1,get:s=>s.tt,act:'tt',show:v=>v.toFixed(1)+' s'}],
 on:{d(s,v){s.d=v},T(s,v){s.T=v},tt(s,v){s.tt=v}},
 draw(s){
  const v=P4_vs(s.T),arr=s.d*1000/v,xs=60,mx=km=>xs+km*(480/5),xl=mx(s.d),front=Math.min(s.d,v*s.tt/1000),heard=s.tt>=arr;let out=heading('Light arrives at once; sound takes its time');
  out+=L(30,250,570,250,C.green,3);for(let km=0;km<=5;km++)out+=L(mx(km),246,mx(km),258,C.ink,1.5)+T(mx(km),276,km+' km',13,C.muted);
  out+=P(`M${xs-8} 90L${xs+6} 140L${xs-4} 142L${xs+10} 200`,s.tt<.3?'#e0a800':'#c9b56a',4,'none');
  if(front>0)out+=P(`M${fmt(mx(front))} 150 Q${fmt(mx(front)+20)} 200 ${fmt(mx(front))} 250`,C.blue,3)+T(mx(front),140,'sound',13,C.blue);
  out+=Ci(xl,222,12,heard?C.coral:'#fff',C.ink)+T(xl,206,heard?'Boom!':'listener',14,heard?C.coral:C.ink);
  out+=counter(40,296,'speed of sound',v.toFixed(0)+' m/s',C.blue,140)+counter(196,296,'arrival time',arr.toFixed(1)+' s',C.coral,130)+counter(342,296,'rule of thumb',(s.d*3).toFixed(1)+' s',C.green,120)+counter(478,296,'light takes',(s.d*1000/3e8*1e6).toFixed(1)+' µs',C.purple,100);
  return {svg:out,phase:`At ${s.T} °C sound travels about ${v.toFixed(0)} m/s, so ${s.d.toFixed(1)} km takes ${arr.toFixed(1)} s (rule of thumb: ${(s.d*3).toFixed(1)} s). Dry air, ideal gas; wind and humidity ignored.`};
 }});

SCENE({id:'sound-decibels',name:'Decibels',tag:'A logarithmic scale for loudness',
 definition:'Sound intensity level is measured in decibels: L = 10 log₁₀(I / I₀), with I₀ = 10⁻¹² W/m². Every doubling of intensity adds about 3 dB; every factor of ten adds 10 dB.',
 example:'One voice at 60 dB; two equal voices make 63 dB, not 120 dB. Ten voices make 70 dB. People usually judge about +10 dB as “twice as loud”.',
 desc:'A grid of identical sound sources beside a decibel scale from 0 to 140 dB with typical landmarks; the level rises by 10 log₁₀ of the number of sources.',
 dur:9,hint:'Add identical sources. Watch how slowly the decibel level climbs: 2 sources give +3 dB, 10 give +10 dB, 100 give +20 dB.',
 research:'Stevens (1957). On the psychophysical law, Psychological Review: perceived loudness roughly doubles for each 10 dB increase.',
 init:()=>({n:2}),
 watch(p){return {n:Math.max(1,Math.round(Math.pow(64,smooth(p))))}},
 ui:[{range:'n',label:'Sources',min:1,max:64,step:1,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=v}},
 draw(s){
  const n=s.n,Lv=60+10*Math.log10(n);let out=heading('Each source adds intensity; decibels count powers of ten');
  for(let i=0;i<64;i++){const x=48+(i%8)*30,y=66+Math.floor(i/8)*30,on=i<n;out+=R(x,y,22,22,on?C.blue:'#fff',on?C.blue:C.grid,5)+(on?P(`M${x+16} ${y+6}Q${x+22} ${y+11} ${x+16} ${y+16}`,'#fff',1.5):'')}
  out+=TF(168,328,n+' source'+(n>1?'s':'')+' at 60 dB each',14,C.ink);
  const yb=v=>336-v*2;out+=L(420,yb(0),420,yb(140),C.ink,2);
  for(const [v,lab] of [[0,'threshold of hearing'],[30,'whisper'],[60,'conversation'],[85,'busy road'],[110,'rock concert'],[130,'pain']]){out+=L(414,yb(v),426,yb(v),C.ink,1.5)+TF(432,yb(v)+4,v+' dB '+lab,13,C.muted,'start')}
  out+=`<polygon points="414,${fmt(yb(Lv))} 400,${fmt(yb(Lv)-8)} 400,${fmt(yb(Lv)+8)}" fill="${C.coral}"/>`+TBF(396,yb(Lv)+5,Lv.toFixed(1)+' dB',15,C.coral,'end');
  out+=TF(300,366,'Landmark levels are typical, approximate values.',13,C.muted);
  return {svg:out,phase:`${n} equal sources give ${n} × the intensity: 60 + 10 log₁₀(${n}) = ${Lv.toFixed(1)} dB. The scale compresses a range of a million million in intensity into 0–120 dB.`};
 }});

/* ---------- Lesson: doppler ---------- */
function P4_fronts(xs0,vsrc,v,t,period,cy){let out='';for(let te=0;te<=t;te+=period){const r=v*(t-te),cx=xs0+vsrc*te;if(r>0&&r<700)out+=Ci(cx,cy,r,'none',C.blue,'stroke-width="1.6" opacity="'+fmt(clamp(1-r/700,.25,1))+'"')}return out}
SCENE({id:'doppler',name:'Doppler effect',tag:'Higher ahead, lower behind',
 definition:'When a source moves, the waves it sends ahead are squeezed and those behind are stretched, so a listener ahead hears a higher frequency and one behind a lower one.',
 example:'A passing ambulance siren drops in pitch as it goes by. For a source moving at speed vₛ towards you through air with sound speed v: f′ = f · v / (v − vₛ).',
 desc:'Wavefronts from a moving source drawn as circles centred where each was emitted; they crowd ahead and spread behind, with the frequency heard by a listener on each side.',
 dur:12,hint:'Set the source speed as a fraction of the speed of sound, then press Play. Compare the spacing of the circles ahead and behind.',
 research:'Doppler (1842). Über das farbige Licht der Doppelsterne (On the coloured light of double stars).',
 init:()=>({M:.5,t:2.5,run:false}),
 ui:[P4_PLAY,{range:'M',label:'Source speed',min:0,max:.9,step:.05,get:s=>s.M,act:'M',show:v=>v.toFixed(2)+' v'}],
 on:P4_on({M(s,v){s.M=v}}),
 draw(s,f,X){
  const M=s.M,t=(X.try?(s.t||0):X.p*12)%5,vp=80,xs0=110,cy=196,xs=xs0+M*vp*t,f0=440;let out=P4_fronts(xs0,M*vp,vp,t,.5,cy);
  out=R(0,0,600,380,'#f3f7fa','none',0)+out+R(0,0,600,48,'#f3f7fa','none',0)+heading('Wavefronts crowd ahead, spread behind');
  out+=Ci(xs,cy,9,C.coral)+arrow(xs+12,cy,xs+40,cy,C.coral,2.5);
  out+=Ci(560,cy,10,'#fff',C.ink)+Ci(40,cy,10,'#fff',C.ink);
  out+=R(470,300,124,52,'#fff',C.grid,8)+TF(532,320,'ahead hears',13,C.muted)+TBF(532,342,(f0/(1-M)).toFixed(0)+' Hz',16,C.coral);
  out+=R(6,300,124,52,'#fff',C.grid,8)+TF(68,320,'behind hears',13,C.muted)+TBF(68,342,(f0/(1+M)).toFixed(0)+' Hz',16,C.blue);
  out+=TF(300,346,'source plays 440 Hz',13,C.muted);
  return {svg:out,phase:`Moving at ${M.toFixed(2)} of the speed of sound, the source squeezes the waves ahead to ${(1-M).toFixed(2)} of their normal spacing: 440 Hz is heard as ${(f0/(1-M)).toFixed(0)} Hz ahead and ${(f0/(1+M)).toFixed(0)} Hz behind. Still air; listeners at rest.`};
 }});

SCENE({id:'doppler-train',name:'Buys Ballot’s train test',tag:'Musicians on a moving train',
 definition:'In 1845 Buys Ballot tested Doppler’s prediction for sound: horn players rode a train past musicians with trained ears, who judged how far the notes shifted.',
 example:'For a semitone rise (frequency ratio 2^(1/12) ≈ 1.059) the source must approach at about 6% of the speed of sound, roughly 70 km/h.',
 desc:'A graph of the heard pitch, in semitones, against train speed for an approaching and a receding source, with a marker at the chosen speed and the total drop as the train passes.',
 dur:10,hint:'Change the train speed. The drop you hear as it passes is the gap between the two curves.',
 research:'Buys Ballot (1845). Akustische Versuche auf der Niederländischen Eisenbahn, Annalen der Physik: horn players on a train near Utrecht.',
 init:()=>({kmh:70}),
 watch(p){return {kmh:Math.round(10+140*smooth(p))}},
 ui:[{range:'kmh',label:'Train speed',min:0,max:150,step:5,get:s=>s.kmh,act:'kmh',show:v=>v+' km/h'}],
 on:{kmh(s,v){s.kmh=v}},
 draw(s){
  const v=343,semi=(kmh,sg)=>12*Math.log2(v/(v-sg*kmh/3.6)),gx=k=>60+k*(270/150),gy=st=>196-st*36;let out=heading('How far does the note shift?');
  out+=L(60,196,330,196,C.ink,1.5)+L(60,70,60,322,C.ink,1.5);for(let st=-3;st<=3;st++)out+=L(56,gy(st),64,gy(st),C.ink,1)+TF(52,gy(st)+4,(st>0?'+':'')+st,13,C.muted,'end');
  for(let k=0;k<=150;k+=50)out+=TF(gx(k),214,k,13,C.muted);out+=TF(195,330,'train speed (km/h)',13,C.muted)+TF(22,60,'semitones',13,C.muted,'start');
  out+=P(P4_curve(60,330,60,x=>gy(semi((x-60)/270*150,1))),C.coral,2.5)+P(P4_curve(60,330,60,x=>gy(semi((x-60)/270*150,-1))),C.blue,2.5);
  const up=semi(s.kmh,1),dn=semi(s.kmh,-1);out+=Ci(gx(s.kmh),gy(up),6,C.coral)+Ci(gx(s.kmh),gy(dn),6,C.blue)+L(gx(s.kmh),gy(up),gx(s.kmh),gy(dn),C.amber,2,'stroke-dasharray="4 3"');
  out+=TF(336,gy(semi(150,1))+4,'approaching',13,C.coral,'start')+TF(336,gy(semi(150,-1))+4,'receding',13,C.blue,'start');
  out+=counter(430,70,'approaching',(up>=0?'+':'')+up.toFixed(2)+' st',C.coral,150)+counter(430,126,'receding',dn.toFixed(2)+' st',C.blue,150)+counter(430,182,'drop as it passes',(up-dn).toFixed(2)+' st',C.amber,150);
  out+=TF(300,360,'1 semitone = frequency ratio 2^(1/12) ≈ 1.059. Sound speed 343 m/s, still air.',13,C.muted);
  return {svg:out,phase:`At ${s.kmh} km/h the note rises ${up.toFixed(2)} semitones while the train approaches and falls ${(-dn).toFixed(2)} as it recedes: a ${(up-dn).toFixed(2)}-semitone drop at the moment it passes.`};
 }});

SCENE({id:'doppler-mach',name:'Mach cone and sonic boom',tag:'Faster than its own sound',
 definition:'When a source moves faster than sound, its wavefronts cannot get ahead of it and pile up on a cone, the Mach cone, with half-angle θ given by sin θ = 1/M.',
 example:'At Mach 2 the cone’s half-angle is 30°. The cone sweeping over the ground is heard as a sonic boom, all along the aircraft’s path, not just once.',
 desc:'Wavefronts from a source at a chosen Mach number; below Mach 1 they stay ahead of it, at Mach 1 they bunch at the nose, and above it they form a cone drawn with its half-angle.',
 dur:12,hint:'Slide the Mach number through 1 and press Play. Above Mach 1 the circles’ common tangents form the cone.',
 research:'Mach & Salcher (1887). Photographische Fixirung der durch Projectile in der Luft eingeleiteten Vorgänge: photographs of shock waves around supersonic bullets.',
 init:()=>({M:1.6,t:3,run:false}),
 watch(p){return {M:.6+1.6*smooth(p),t:3.2}},
 ui:[P4_PLAY,{range:'M',label:'Mach',min:.5,max:2.5,step:.05,get:s=>s.M,act:'M',show:v=>v.toFixed(2)}],
 on:P4_on({M(s,v){s.M=v}}),
 draw(s,f,X){
  const M=s.M,vp=46,t=X.try?((s.t||0)%4.5)+.5:3.2,xs0=40,cy=200,xs=xs0+M*vp*t;let out=R(0,0,600,380,'#f3f7fa','none',0)+P4_fronts(xs0,M*vp,vp,t,.35,cy);
  if(M>1){const th=Math.asin(1/M),Lc=520;out+=L(xs,cy,xs-Lc*Math.cos(th),cy-Lc*Math.sin(th),C.coral,3)+L(xs,cy,xs-Lc*Math.cos(th),cy+Lc*Math.sin(th),C.coral,3)}
  out+=Ci(xs,cy,8,C.ink);
  out+=R(0,0,600,48,'#f3f7fa','none',0)+heading(M<1?'Subsonic: sound runs ahead':Math.abs(M-1)<.03?'Mach 1: fronts pile up at the nose':'Supersonic: a Mach cone');
  out+=R(400,310,192,58,'#fff',C.grid,8)+TBF(496,332,'Mach '+M.toFixed(2),15,C.ink)+TF(496,354,M>1?'sin θ = 1/M → θ = '+(Math.asin(1/M)*180/Math.PI).toFixed(1)+'°':'no cone below Mach 1',13,C.muted);
  return {svg:out,phase:M<1?'Each new front still escapes ahead of the source, so listeners ahead hear it coming (at a higher pitch).':`The source outruns its own waves; their edges line up on a cone of half-angle ${(Math.asin(Math.min(1,1/M))*180/Math.PI).toFixed(1)}°. Anyone the cone sweeps past hears the sudden pressure jump: a sonic boom.`};
 }});

/* ---------- Lesson: resonance ---------- */
const P4_amp=(r,z)=>1/Math.sqrt((1-r*r)**2+(2*z*r)**2);
SCENE({id:'resonance',name:'Resonance',tag:'Driving at the natural frequency',
 definition:'A system driven at its natural frequency absorbs energy every cycle and oscillates with a large amplitude, limited only by damping.',
 example:'With little damping the peak is tall and narrow; with more damping it is low and broad. Below resonance the motion follows the driver; far above, it lags half a cycle behind.',
 desc:'A mass on a spring driven by a shaking hand, beside a resonance curve of amplitude against driving frequency for the chosen damping, with the current frequency marked.',
 dur:12,hint:'Sweep the driving frequency through 1 × the natural frequency, then try more and less damping.',
 research:'Galileo (1638). Two New Sciences: a heavy pendulum set swinging by small puffs timed to its own period; the driven damped oscillator of later mechanics.',
 init:()=>({r:.9,z:.1,t:0,run:false}),
 watch(p){return {r:.3+1.5*p,z:.1,t:p*12}},
 ui:[P4_PLAY,{range:'r',label:'Drive frequency',min:.2,max:2.5,step:.02,get:s=>s.r,act:'r',show:v=>v.toFixed(2)+' × f₀'},{range:'z',label:'Damping ζ',min:.03,max:.6,step:.01,get:s=>s.z,act:'z',show:v=>v.toFixed(2)}],
 on:P4_on({r(s,v){s.r=v},z(s,v){s.z=v}}),
 draw(s,f,X){
  const r=s.r,z=s.z,t=X.try?(s.t||0):s.t,A=P4_amp(r,z),ph=Math.atan2(2*z*r,1-r*r),w=2*Math.PI*.5*r,drv=8*Math.sin(w*t),xm=Math.min(1,A/P4_amp(1,.03))*90*Math.sin(w*t-ph);
  let out=heading('Amplitude peaks at the natural frequency');
  out+=R(40,66,90,14,C.dark,'none',4)+L(85+drv,80,85+drv,96,C.dark,3)+TF(85,60,'driver',13,C.muted);
  let coil='M'+fmt(85+drv)+' 96';for(let i=1;i<=12;i++)coil+=`L${fmt(85+drv+(i%2?-12:12))} ${fmt(96+i*(110+xm)/13)}`;out+=P(coil,C.blue,2);
  out+=R(60,206+xm,50,40,C.coral,'none',6)+TF(85,300,'mass',13,C.muted);
  const gx=r=>200+r*(360/2.5),gy=a=>310-Math.min(a,10)*24;out+=L(200,310,570,310,C.ink,1.5)+L(200,70,200,310,C.ink,1.5);
  out+=P(P4_curve(200,560,240,x=>gy(P4_amp((x-200)/360*2.5,z))),C.blue,2.5);
  out+=L(gx(1),70,gx(1),310,C.grid,1.2,'stroke-dasharray="4 4"')+TF(gx(1),330,'f₀',13,C.muted);
  for(const k of [0,.5,1.5,2,2.5])out+=TF(gx(k),330,k.toFixed(1),13,C.muted);out+=TF(380,352,'driving frequency ÷ natural frequency',13,C.muted)+TF(206,82,'amplitude',13,C.muted,'start');
  out+=Ci(gx(r),gy(A),7,C.coral)+TBF(gx(r)+10,gy(A)-8,'× '+A.toFixed(1),14,C.coral,'start');
  return {svg:out,phase:`Driving at ${r.toFixed(2)} × f₀ with damping ζ = ${z.toFixed(2)}: amplitude ${A.toFixed(1)} × the static stretch, lagging the driver by ${(ph*180/Math.PI).toFixed(0)}°. At resonance the lag is 90° and the peak is about 1/(2ζ) = ${(1/(2*z)).toFixed(1)}.`};
 }});

SCENE({id:'resonance-swing',name:'Pushing a swing',tag:'Small pushes, timed right',
 definition:'Small, regular pushes build a big motion only if they arrive in step with the natural swing; pushes out of step take energy away again.',
 example:'Push a child on a swing once per swing, just as it starts forward, and it goes higher each time. A singer can shatter a wine glass the same way by holding its natural note, typically several hundred hertz.',
 desc:'A swing drawn at its current amplitude beside a bar chart of the amplitude after each push, for pushes in step, half a swing out of step, every other swing, or slightly too often.',
 dur:10,hint:'Choose how the pushes are timed and slide the number of pushes. Only pushes in step keep adding.',
 research:'Galileo (1638). Two New Sciences: even a heavy pendulum can be set in large motion by small impulses timed to its period.',
 init:()=>({timing:'in',k:8}),
 watch(p){return {timing:['in','half','other','fast'][Math.min(3,Math.floor(p*4))],k:12}},
 ui:[{choose:[['in','In step'],['half','Half a swing off'],['other','Every other swing'],['fast','10% too often']],label:'Timing',get:s=>s.timing,act:'timing'},{range:'k',label:'Pushes',min:0,max:16,step:1,get:s=>s.k,act:'k'}],
 on:{timing(s,v){s.timing=v},k(s,v){s.k=v}},
 draw(s){
  // Undamped oscillator, period 1; each push adds a velocity kick of 0.12 in the forward direction at the push time.
  const times=[];for(let i=0;i<16;i++)times.push(s.timing==='in'?i:s.timing==='half'?i+.5:s.timing==='other'?2*i:i*.9);
  const amps=[];let x=.12,v=0,tp=0;// starts with a small swing at the bottom moving forward when amplitude is x
  let ph={a:.12,phi:0};for(let i=0;i<16;i++){const tt=times[i],ang=2*Math.PI*tt+ph.phi;let xx=ph.a*Math.sin(ang),vv=ph.a*Math.cos(ang);vv+=.12;ph={a:Math.hypot(xx,vv),phi:Math.atan2(xx,vv)-2*Math.PI*tt};amps.push(ph.a)}
  const a=s.k?amps[s.k-1]:.12;let out=heading('Timing matters more than strength');
  const px=150,py=70,len=170,th=Math.min(1.1,a*.55);out+=L(px-40,py,px+40,py,C.dark,5)+L(px,py,px+len*Math.sin(th),py+len*Math.cos(th),C.ink,2.5)+R(px+len*Math.sin(th)-22,py+len*Math.cos(th),44,10,C.coral,'none',3);
  out+=P(`M${px-len*Math.sin(th)} ${py+len*Math.cos(th)}A${len} ${len} 0 0 0 ${px+len*Math.sin(th)} ${py+len*Math.cos(th)}`,C.line,1.5,'none','stroke-dasharray="4 4"');
  const bx=310,by=300;out+=L(bx,by,590,by,C.ink,1.5);amps.forEach((am,i)=>{const h=Math.min(220,am*80),on=i<s.k;out+=R(bx+6+i*17,by-h,13,h,on?C.blue:'#e6edf1','none',3)});
  out+=TF(450,322,'amplitude after each push',13,C.muted)+TF(300,352,'Ideal swing: no friction, equal small pushes. Bars after the slider’s count are greyed.',13,C.muted);
  const msg={in:'Each push lands as the swing starts forward, so every push adds energy: the amplitude grows steadily.',half:'Each push meets the swing coming back, so it cancels what the last added: nothing builds up.',other:'Pushing every other swing still keeps in step, so it grows, but at half the rate.',fast:'Pushing 10% too often drifts out of step: the swing grows, then the pushes start fighting it.'}[s.timing];
  return {svg:out,phase:msg};
 }});

SCENE({id:'resonance-tacoma',name:'Tacoma Narrows: flutter, not simple resonance',tag:'A famous example, told correctly',
 definition:'The Tacoma Narrows Bridge (1940) did not fall because wind gusts matched its natural frequency. A steady wind fed energy into a twisting motion through aeroelastic flutter, acting like negative damping.',
 example:'The wind was steady, at about 64 km/h, with no matching rhythm. Once the deck twisted, the airflow pushed it further each cycle; above a critical wind speed the twisting grows until something breaks.',
 desc:'A bridge deck twisting over time for a chosen steady wind speed, from an illustrative model where effective damping falls with wind speed and turns negative above a critical value.',
 dur:12,hint:'Raise the steady wind speed. Below the critical speed twists die away; above it they grow, with no rhythmic forcing at all.',
 research:'Billah & Scanlan (1991). Resonance, Tacoma Narrows bridge failure, and undergraduate physics textbooks, American Journal of Physics 59(2).',
 init:()=>({U:20}),
 watch(p){return {U:10+14*smooth(p)}},
 ui:[{range:'U',label:'Steady wind',min:5,max:26,step:.5,get:s=>s.U,act:'U',show:v=>v.toFixed(1)+' m/s'}],
 on:{U(s,v){s.U=v}},
 draw(s,f,X){
  const Uc=18,z=.012*(1-(s.U/Uc)**2),w=2*Math.PI*.2,a0=2,tmax=60;let out=heading('Steady wind, growing twist');
  const ang=t=>{const g=a0*Math.exp(-z*w*t*6);return Math.min(28,g)*Math.sin(w*t*6/2)};
  const gx=t=>60+t*(500/tmax),gy=d=>220-d*3.4;out+=L(60,220,560,220,C.grid,1.2)+L(60,120,60,320,C.ink,1.5);
  out+=P(P4_curve(60,560,600,x=>gy(ang((x-60)/500*tmax))),z<0?C.coral:C.blue,1.8);
  for(let t=0;t<=60;t+=15)out+=TF(gx(t),338,t+' s',13,C.muted);out+=TF(66,112,'twist angle (°)',13,C.muted,'start');
  const tn=X.try?tmax:X.p*tmax,th=ang(tn)*Math.PI/180;out+=L(470-60*Math.cos(th),78-60*Math.sin(th),470+60*Math.cos(th),78+60*Math.sin(th),C.dark,7)+TF(470,108,'deck, end view',13,C.muted);
  out+=R(60,52,250,48,z<0?C.coralp:C.greenp,'none',8)+TBF(185,72,z<0?'Above critical: flutter grows':'Below critical: twists decay',14,z<0?C.coral:C.green)+TF(185,90,'effective damping '+(z>=0?'+':'')+(z*100).toFixed(2)+'%',13,C.ink);
  out+=TF(300,364,'Illustrative model: critical wind 18 m/s chosen for the picture; no rhythmic gusts are applied.',13,C.muted);
  return {svg:out,phase:z<0?`At ${s.U.toFixed(1)} m/s the moving deck draws more energy from the steady wind each cycle than it loses: negative damping. That self-excited growth, not a matching gust rhythm, destroyed the 1940 bridge.`:`At ${s.U.toFixed(1)} m/s the structure still loses more energy than the wind feeds it, so twists die away.`};
 }});
