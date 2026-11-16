/* =====================================================================
 Senses era 2 · Seeing: what the brain makes of the light.
 Edges (lateral inhibition), depth (cues, disparity, random-dot stereo), motion (apparent motion, the
 waterfall illusion, coherence), illusions (Müller-Lyer, Ebbinghaus, checker shadow, the dress), faces and
 the blind spot. Safety: no flashing faster than 3 per second, moderate contrast for the motion adapter,
 and no screen test is a diagnosis.
 ===================================================================== */

// Grey level 0..1 as a hex colour.
const S2_g=v=>{const n=Math.round(clamp(v,0,1)*255).toString(16).padStart(2,'0');return '#'+n+n+n};
// A seeded hash for repeatable dot patterns.
const S2_h=(i,seed)=>{let x=(i*2654435761+seed*97+1013904223)>>>0;x^=x>>>13;x=Math.imul(x,1274126177)>>>0;x^=x>>>16;return (x>>>0)/4294967296};
// Simple straight-line polyline.
const S2_poly=(pts,col,w=2.5,extra='')=>P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra);
// Small axes helper: returns {svg,x(),y()}.
function S2_axes(x0,y0,w,h,xr,yr,xl,yl,xt,yt){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let out=L(x0,y0+h,x0+w,y0+h,C.line,2)+L(x0,y0,x0,y0+h,C.line,2);
 (xt||[]).forEach(([v,l])=>out+=L(X(v),y0+h,X(v),y0+h+5,C.line,1.5)+TF(X(v),y0+h+19,l,13,C.muted));
 (yt||[]).forEach(([v,l])=>out+=L(x0-5,Y(v),x0,Y(v),C.line,1.5)+TF(x0-8,Y(v)+4,l,13,C.muted,'end'));
 if(xl)out+=TF(x0+w/2,y0+h+38,xl,13,C.muted);
 if(yl)out+=TF(x0-4,y0-10,yl,13,C.muted,'start');
 return {svg:out,X,Y};
}

/* =========================== lateral-inhibition =========================== */
const S2_BANDS=[.18,.3,.42,.54,.66,.78];
// Luminance along the strip (0..1), the blurred neighbourhood and the lateral-inhibition response.
function S2_mach(k,sigma){
 const N=240,L0=[];for(let i=0;i<N;i++)L0.push(S2_BANDS[Math.min(5,Math.floor(i/N*6))]);
 const R=[];for(let i=0;i<N;i++){let a=0,wsum=0;for(let j=-60;j<=60;j++){const q=clamp(i+j,0,N-1),w=Math.exp(-(j*j)/(2*sigma*sigma));a+=w*L0[q];wsum+=w}const B=a/wsum;R.push((L0[i]-k*B)/(1-k))}
 return {L0,R};
}
SCENE({id:'lateral-inhibition',name:'Mach bands',tag:'Edges are sharpened by neighbours',
 definition:'Each light-sensitive cell is inhibited by its neighbours. Where the light changes, cells on the bright side of an edge get less inhibition than their neighbours and cells on the dark side get more, so the edge is exaggerated. Ernst Mach described the resulting bands in 1865.',
 example:'A staircase of six evenly lit grey strips does not look even: each strip seems lighter next to its darker neighbour and darker next to its lighter one, though each is uniform.',
 desc:'Six uniform grey strips above a graph of the actual light (straight steps) and the response after lateral inhibition (with dips and overshoots at each edge).',
 research:'Mach, E. (1865). Über die Wirkung der räumlichen Vertheilung des Lichtreizes auf die Netzhaut; Ratliff, F. (1965). Mach Bands: Quantitative Studies on Neural Networks in the Retina. Holden-Day. Robust; the simple model here is a sketch, not a fitted retina.',
 dur:10,hint:'Look along the strips first and notice the bright and dark borders. Then turn the inhibition up and down and watch the response curve.',
 init:()=>({k:.5,sig:8}),
 watch(p){return {k:lerp(0,.7,smooth(p)),sig:8}},
 ui:[{range:'k',label:'Inhibition from neighbours',min:0,max:.8,step:.05,get:s=>s.k,act:'k',show:v=>Math.round(v*100)+'%'},{range:'sig',label:'Neighbourhood width',min:3,max:20,step:1,get:s=>s.sig,act:'sig',show:v=>v<7?'narrow':v<13?'medium':'wide'}],
 on:{k(s,v){s.k=Number(v);return 'keep'},sig(s,v){s.sig=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Uniform strips, uneven edges');
  S2_BANDS.forEach((v,i)=>out+=R(60+i*80,48,80,92,S2_g(v),'none',0));
  out+=TF(300,158,'each strip is one even grey',13,C.muted);
  const {L0,R:Rr}=S2_mach(s.k,s.sig),ax=S2_axes(60,182,480,130,[0,240],[0,1.05],'position along the strips','brightness',[],[[0,'0'],[1,'1']]);out+=ax.svg;
  out+=S2_poly(L0.map((v,i)=>[ax.X(i),ax.Y(v)]),C.muted,2,'stroke-dasharray="5 4"');
  out+=S2_poly(Rr.map((v,i)=>[ax.X(i),ax.Y(clamp(v,0,1.05))]),C.blue,3);
  out+=L(420,186,446,186,C.muted,2,'stroke-dasharray="5 4"')+TF(452,190,'light falling on the eye',13,C.muted,'start');
  out+=L(420,206,446,206,C.blue,3)+TF(452,210,'after inhibition',13,C.blue,'start');
  return {svg:out,phase:s.k<.05?'With no inhibition the response copies the light exactly, but you still see bands: your own retina is adding them.':`At ${Math.round(s.k*100)}% inhibition each edge gets a dip on the dark side and an overshoot on the bright side, just where you see the extra bands.`};
 }});

SCENE({id:'lateral-inhibition-limulus',name:'Hartline’s horseshoe crab',tag:'Inhibition measured in single cells',
 definition:'Haldan Keffer Hartline recorded from single receptor units in the eye of the horseshoe crab, Limulus. Lighting a unit made it fire; lighting its neighbours as well made it fire less. Each unit’s output is its own excitation minus a share of its neighbours’ outputs.',
 example:'A unit firing 30 times a second in the dark surround drops to about 24 when a neighbour firing 40 times a second is lit nearby, with an inhibition coefficient of 0.15.',
 desc:'Two neighbouring receptor units, A and B, with light levels set by sliders, and bars for A’s firing alone and with B lit, from the Hartline–Ratliff equations.',
 research:'Hartline, H. K., Wagner, H. G. & Ratliff, F. (1956). Inhibition in the eye of Limulus. Journal of General Physiology 39, 651–673; Hartline, H. K. & Ratliff, F. (1957). Inhibitory interaction of receptor units in the eye of Limulus. JGP 40, 357–376. Hartline shared the 1967 Nobel Prize. Coefficients here are illustrative.',
 dur:10,hint:'Set A’s light, then raise B’s light and watch A slow down. Raise the coupling to make the inhibition stronger.',
 init:()=>({a:30,b:40,kc:.15}),
 watch(p){return {a:30,b:Math.round(lerp(0,60,smooth(p))),kc:.15}},
 ui:[{range:'a',label:'Light on A (its own excitation)',min:0,max:60,step:2,get:s=>s.a,act:'a',show:v=>v+' spikes/s'},{range:'b',label:'Light on neighbour B',min:0,max:60,step:2,get:s=>s.b,act:'b',show:v=>v+' spikes/s'},{range:'kc',label:'Inhibition coefficient',min:0,max:.4,step:.01,get:s=>s.kc,act:'kc',show:v=>v.toFixed(2)}],
 on:{a(s,v){s.a=Number(v);return 'keep'},b(s,v){s.b=Number(v);return 'keep'},kc(s,v){s.kc=Number(v);return 'keep'}},
 draw(s){
  // Mutual inhibition, solved exactly for two units with threshold 5 spikes/s: rA = eA − k·max(0,rB−5), rB likewise.
  const th=5,k=s.kc;let rA=s.a,rB=s.b;for(let i=0;i<60;i++){const nA=Math.max(0,s.a-k*Math.max(0,rB-th)),nB=Math.max(0,s.b-k*Math.max(0,rA-th));rA=nA;rB=nB}
  let out=heading('Each unit is slowed by its lit neighbours');
  const eye=(x,lab,lv,r)=>Ci(x,120,34,'#fff',C.blue)+Ci(x,120,24,`rgba(244,190,60,${clamp(lv/60,0,1)})`,'none')+TB(x,126,lab,18,C.ink)+TF(x,176,`${fmt(r)} spikes/s`,13,C.blue);
  out+=eye(200,'A',s.a,rA)+eye(400,'B',s.b,rB);
  out+=arrow(240,108,360,108,C.coral,2.5)+arrow(360,132,240,132,C.coral,2.5)+TF(300,98,'inhibits',13,C.coral)+TF(300,152,'inhibits',13,C.coral);
  const base=330,sc=2.2;
  out+=R(150,base-s.a*sc,90,s.a*sc,'#cfe0ec','none',4)+R(260,base-rA*sc,90,rA*sc,C.blue,'none',4)+L(130,base,470,base,C.line,2);
  out+=TF(195,base+18,'A alone',13,C.muted)+TF(305,base+18,'A with B lit',13,C.muted);
  out+=TBF(195,base-s.a*sc-6,fmt(s.a),13,C.ink)+TBF(305,base-rA*sc-6,fmt(rA),13,C.blue);
  out+=TF(380,232,'drop for A:',13,C.muted,'start')+TBF(380,252,`${fmt(s.a-rA)} spikes/s`,15,C.coral,'start');
  return {svg:out,phase:s.b<=th?'B is too dim to inhibit anything: below its threshold it sends no inhibition, so A fires at its own rate.':`B’s activity takes ${fmt(s.a-rA)} spikes a second off A. A matching effect runs the other way, so the brighter unit wins by more than the light alone would suggest.`};
 }});

SCENE({id:'lateral-inhibition-contrast',name:'Simultaneous contrast',tag:'You take part: match two greys',
 definition:'A grey patch looks lighter on a dark background and darker on a light one. Michel Eugène Chevreul described this simultaneous contrast in 1839 while working on dyes at the Gobelins tapestry works. Lateral inhibition explains part of it; judgements about lighting and surfaces explain more.',
 example:'Two physically identical mid-grey squares, one on black and one on white, look clearly different. To make them look the same, most people set the square on white lighter than the one on black.',
 desc:'A fixed grey square on a black surround and an adjustable square on a white surround; the learner sets the right square until the two look the same, then sees the true value.',
 research:'Chevreul, M. E. (1839). De la loi du contraste simultané des couleurs; Heinemann, E. G. (1955). Simultaneous brightness induction as a function of inducing- and test-field luminances. JEP 50, 89–96. Robust; the size of the effect varies between people and displays.',
 dur:10,hint:'Move the slider until the right square looks the same as the left one, then press Record my match. Your setting stays on this page.',
 init:()=>({v:.5,rec:null}),
 watch(p){return {v:lerp(.38,.62,smooth(Math.min(1,p*1.4))),rec:p>.75?.6:null,sim:true}},
 ui:[{range:'v',label:'Grey of the right square',min:.2,max:.8,step:.01,get:s=>s.v,act:'v',show:v=>Math.round(v*100)+'%'},{b:'Record my match',act:'rec'}],
 on:{v(s,x){s.v=Number(x);return 'keep'},rec(s){s.rec=s.v;return 'keep'}},
 draw(s){
  let out=heading('Make the two squares look the same');
  out+=R(60,50,230,190,'#111','none',0)+R(140,110,70,70,S2_g(.5),'none',0)+R(310,50,230,190,'#f2f2f2','none',0)+R(390,110,70,70,S2_g(s.v),'none',0);
  out+=TF(175,260,'fixed: 50% grey',13,C.muted)+TF(425,260,'yours: '+Math.round(s.v*100)+'% grey',13,C.muted);
  if(s.rec!==null){const d=Math.round((s.rec-.5)*100);
   out+=TB(300,296,s.sim?'Simulated viewer (Watch)':'Your match',15,C.ink);
   out+=TF(300,320,`You set ${Math.round(s.rec*100)}% to match 50%: ${d>0?d+' points lighter':d<0?(-d)+' points darker':'exactly equal'}.`,13,d>0?C.green:C.ink);
   out+=TF(300,344,'The two squares were identical at 50%. Most people set the right one lighter.',13,C.muted)}
  else out+=TF(300,320,'Press Record my match when they look the same.',13,C.muted);
  return {svg:out,phase:s.rec===null?'The black surround makes the left square look lighter than it is, so you need to lighten the right one to match.':'The setting you chose is your size of the contrast effect on this screen; the direction, not the exact size, is what replicates.'};
 }});

/* =========================== depth-stereo =========================== */
const S2_CUES=[['occlusion','Occlusion','The nearer object hides part of the farther one.',[0,1]],['size','Relative size','Of two things known to be alike, the smaller looks farther away.',[0,1]],['texture','Texture gradient','A surface’s texture gets finer with distance.',[.3,1]],['perspective','Linear perspective','Parallel lines seem to meet in the distance.',[.3,1]],['shading','Shading','Light from above makes bumps and dents.',[0,.6]],['disparity','Binocular disparity','The two eyes see slightly different views.',[0,.35]],['parallax','Motion parallax','Near things slip past faster when you move.',[0,.6]]];
SCENE({id:'depth-stereo',name:'Cues to depth',tag:'Many clues, none sufficient alone',
 definition:'The retinal image is flat, yet we see a world in depth. The brain combines many cues: pictorial ones such as occlusion, size, texture and perspective, and others that need two eyes or movement. Different cues are useful at different distances.',
 example:'Disparity between the eyes is a strong cue within a few metres but weak beyond about 30; occlusion works at any distance but says only what is in front, not how far.',
 desc:'A small sketch of the chosen depth cue beside a chart of the distances over which each cue is most useful, after Cutting and Vishton.',
 research:'Gibson, J. J. (1950). The Perception of the Visual World; Cutting, J. E. & Vishton, P. M. (1995). Perceiving layout and knowing distances. In Epstein & Rogers (eds), Perception of Space and Motion, 69–117. The ranges are simplified from their figure.',
 dur:12,hint:'Choose a cue to see a sketch of it and where it works best: near (within reach), middle (to about 30 m) or far.',
 init:()=>({c:0}),
 watch(p){return {c:Math.min(6,Math.floor(p*7))}},
 ui:[{choose:S2_CUES.map((c,i)=>[i,c[1]]),label:'Cue',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=Number(v);return 'keep'}},
 draw(s){
  const cue=S2_CUES[s.c];let out=heading('Cue: '+cue[1]);
  out+=R(40,50,230,190,'#fff',C.grid,8);
  const k=cue[0];
  if(k==='occlusion')out+=R(80,100,90,90,'#9cc3dd','none',4)+Ci(190,160,42,C.coral);
  if(k==='size')out+=Ci(100,150,40,C.blue)+Ci(210,120,16,C.blue);
  if(k==='texture'){for(let r=0;r<7;r++){const y=230-r*r*3.4-r*6,n=5+r*2;for(let i=0;i<n;i++){const w=210/n;out+=Ci(50+w*(i+.5),y,Math.max(1.5,7-r*.9),'#7aa6c4')}}}
  if(k==='perspective')out+=L(60,230,150,80,C.ink,2.5)+L(250,230,160,80,C.ink,2.5)+[0,1,2,3,4].map(i=>{const t=i/5,y=230-150*t*(1.6-t*.6)/1;return L(lerp(60,150,t*.95),y,lerp(250,160,t*.95),y,C.line,2)}).join('');
  if(k==='shading'){out+=`<defs><radialGradient id="s2sh1" cx="40%" cy="30%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#5a6c78"/></radialGradient><radialGradient id="s2sh2" cx="60%" cy="70%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#5a6c78"/></radialGradient></defs>`+Ci(110,145,40,'url(#s2sh1)')+Ci(205,145,40,'url(#s2sh2)')+TF(110,212,'bump',13,C.muted)+TF(205,212,'dent',13,C.muted)}
  if(k==='disparity')out+=Ci(105,180,12,C.ink)+Ci(205,180,12,C.ink)+L(105,180,155,95,C.blue,2)+L(205,180,155,95,C.blue,2)+L(105,180,170,70,C.coral,2,'stroke-dasharray="5 4"')+L(205,180,170,70,C.coral,2,'stroke-dasharray="5 4"')+Ci(155,95,8,C.blue)+Ci(170,70,8,C.coral)+TF(155,218,'left eye · right eye',13,C.muted);
  if(k==='parallax')out+=arrow(80,180,150,180,C.coral,4)+Ci(115,150,14,C.coral)+arrow(160,90,190,90,C.blue,2.5)+Ci(175,70,9,C.blue)+TF(155,222,'near moves far, far moves little',13,C.muted);
  ['Near','Middle','Far'].forEach((l,i)=>out+=TF(455+i*50,68,l,13,C.muted));
  out+=L(430,74,580,74,C.grid,1.5);
  S2_CUES.forEach((c,i)=>{const y=96+i*26,sel=i===s.c;out+=TF(424,y+4,c[1],13,sel?C.ink:C.muted,'end');out+=R(430,y-8,150,14,'#eef3f6','none',3)+R(430+c[3][0]*150,y-8,(c[3][1]-c[3][0])*150,14,sel?C.blue:'#a9c6d8','none',3)});
  out+=T(300,300,cue[2],15,C.ink);
  out+=TF(300,326,'Ranges simplified from Cutting & Vishton (1995).',13,C.muted);
  return {svg:out,phase:`${cue[1]}: ${cue[2]} The brain weighs cues by how reliable each is at that distance, which is why no single cue fools us for long.`};
 }});

SCENE({id:'depth-stereo-disparity',name:'Binocular disparity',tag:'Two eyes, two views',
 definition:'The eyes are about 6 cm apart, so each sees a slightly different view. The difference in the angle an object makes at the two eyes, its disparity, shrinks with the square of distance. Charles Wheatstone proved in 1838 with his stereoscope that disparity alone can create depth.',
 example:'With a typical stereoacuity of 20 seconds of arc, a person can tell that one object is about 1.5 mm nearer than another at 1 metre, but at 10 metres the difference must be about 15 cm.',
 desc:'A top view of two eyes looking at two objects at a chosen distance and depth difference, with the disparity in seconds of arc and the smallest depth difference detectable at that distance.',
 research:'Wheatstone, C. (1838). Contributions to the physiology of vision, Part 1. Phil. Trans. R. Soc. 128, 371–394; Dodgson, N. A. (2004). Variation and extrema of human interpupillary distance (mean about 63 mm); Howard, I. P. & Rogers, B. J. (2012). Perceiving in Depth. Stereoacuity of about 20″ is typical in good conditions; it varies widely.',
 dur:10,hint:'Move the objects farther away and watch the disparity collapse. Change the eye separation to see why some animals have eyes far apart.',
 init:()=>({d:1,dd:5,ipd:63}),
 watch(p){return {d:+lerp(.5,10,smooth(p)).toFixed(2),dd:5,ipd:63}},
 ui:[{range:'d',label:'Distance to the objects',min:.3,max:20,step:.1,get:s=>s.d,act:'d',show:v=>v.toFixed(1)+' m'},{range:'dd',label:'Depth difference between them',min:1,max:200,step:1,get:s=>s.dd,act:'dd',show:v=>v+' mm'},{range:'ipd',label:'Eye separation',min:50,max:75,step:1,get:s=>s.ipd,act:'ipd',show:v=>v+' mm'}],
 on:{d(s,v){s.d=Number(v);return 'keep'},dd(s,v){s.dd=Number(v);return 'keep'},ipd(s,v){s.ipd=Number(v);return 'keep'}},
 draw(s){
  const I=s.ipd/1000,disp=I*(s.dd/1000)/(s.d*s.d),arcsec=disp*206265,minDd=20/206265*s.d*s.d/I*1000;
  let out=heading('Disparity shrinks with distance squared');
  const ex=60,ey=190,sx=v=>ex+70+Math.min(1,Math.log10(1+v*3)/Math.log10(61))*300;
  out+=Ci(ex,ey-22,10,C.ink)+Ci(ex,ey+22,10,C.ink)+TF(ex,ey+52,'eyes',13,C.muted);
  const x1=sx(s.d),x2=sx(s.d+s.dd/1000)+Math.max(8,0);
  out+=L(ex,ey-22,x1,ey,C.blue,1.5)+L(ex,ey+22,x1,ey,C.blue,1.5)+L(ex,ey-22,x2,ey-26,C.coral,1.5,'stroke-dasharray="4 4"')+L(ex,ey+22,x2,ey-26,C.coral,1.5,'stroke-dasharray="4 4"');
  out+=Ci(x1,ey,9,C.blue)+Ci(x2,ey-26,9,C.coral);
  out+=TF(x1,ey+30,`${s.d.toFixed(1)} m`,13,C.blue);
  out+=counter(70,288,'disparity',arcsec>=60?`${(arcsec/60).toFixed(1)}′`:`${arcsec.toFixed(arcsec<10?1:0)}″`,arcsec>=20?C.green:C.coral,140);
  out+=counter(230,288,'smallest depth seen',minDd>=1000?`${(minDd/1000).toFixed(2)} m`:`${minDd.toFixed(minDd<10?1:0)} mm`,C.blue,140);
  out+=counter(390,288,'can you see it?',arcsec>=20?'yes':'no',arcsec>=20?C.green:C.coral,140);
  out+=TF(300,360,'Detection assumes a typical 20″ stereoacuity; people vary a lot.',13,C.muted);
  return {svg:out,phase:arcsec>=20?`A ${s.dd} mm step at ${s.d.toFixed(1)} m gives ${arcsec.toFixed(0)}″ of disparity, above the typical 20″ threshold.`:`At ${s.d.toFixed(1)} m the disparity is only ${arcsec.toFixed(1)}″, below threshold: other cues must take over.`};
 }});

// Random-dot stereogram: a grid of dots, with a central square shifted sideways in the right image.
const S2_RDN=24;
function S2_rds(shift,seed){
 const L0=[],R0=[];for(let r=0;r<S2_RDN;r++){const lr=[],rr=[];for(let c=0;c<S2_RDN;c++)lr.push(S2_h(r*S2_RDN+c,seed)<.5?1:0);
  for(let c=0;c<S2_RDN;c++){const inSq=r>=7&&r<17&&c>=7&&c<17;let v;if(inSq){const src=c+shift;v=src>=7&&src<17?lr[src]:(S2_h(9000+r*S2_RDN+c,seed)<.5?1:0)}else v=lr[c];rr.push(v)}L0.push(lr);R0.push(rr)}
 return {L:L0,R:R0};
}
SCENE({id:'depth-stereo-random-dot',name:'Random-dot stereograms',tag:'Depth from disparity alone',
 definition:'Béla Julesz made pairs of images of random dots in which a hidden square is shifted sideways in one eye’s view. Each image alone shows only noise; viewed with both eyes, the square floats in depth. This proved the brain can compute depth before recognising any object.',
 example:'Shift the central 10×10 block of dots by two columns in the right image. Neither image shows a square, but with the two fused, a square stands out from the background.',
 desc:'A left and a right random-dot image with an adjustable shift of the hidden central square, an optional overlay of the dots that differ, and a 3D view of the surface the brain recovers.',
 research:'Julesz, B. (1960). Binocular depth perception of computer-generated patterns. Bell System Technical Journal 39, 1125–1162; Julesz, B. (1971). Foundations of Cyclopean Perception. University of Chicago Press. A few per cent of people lack useful stereo vision; estimates vary with the test.',
 dur:12,hint:'Change the shift and switch on Show differences to see where the hidden square is. If you can cross your eyes to fuse the two images, the square appears in depth; it is fine if you cannot.',
 init:()=>({sh:2,diff:false,seed:5}),
 watch(p){return {sh:p<.3?0:p<.65?2:3,diff:p>.45&&p<.65,seed:5}},
 ui:[{range:'sh',label:'Shift of the hidden square',min:0,max:4,step:1,get:s=>s.sh,act:'sh',show:v=>v+(v===1?' column':' columns')},{choose:[[false,'Plain'],[true,'Show differences']],label:'View',get:s=>s.diff,act:'diff'},{b:'New dots',act:'seed'}],
 on:{sh(s,v){s.sh=Number(v);return 'keep'},diff(s,v){s.diff=v===true||v==='true';return 'keep'},seed(s){s.seed=s.seed%97+3;return 'keep'}},
 draw(s){
  const {L:Li,R:Ri}=S2_rds(s.sh,s.seed),cell=7,ox1=70,ox2=360,oy=60;let out=heading('Each image alone is noise');
  const img=(M,ox,other)=>{let o=R(ox-4,oy-4,S2_RDN*cell+8,S2_RDN*cell+8,'#fff',C.grid,4);for(let r=0;r<S2_RDN;r++)for(let c=0;c<S2_RDN;c++){const d=other&&M[r][c]!==other[r][c];if(M[r][c])o+=R(ox+c*cell,oy+r*cell,cell,cell,d&&s.diff?C.coral:'#222','none',0);else if(d&&s.diff)o+=R(ox+c*cell,oy+r*cell,cell,cell,'#f6c9b9','none',0)}return o};
  out+=img(Li,ox1,null)+img(Ri,ox2,Li);
  out+=TF(ox1+S2_RDN*cell/2,oy+S2_RDN*cell+22,'left eye',13,C.muted)+TF(ox2+S2_RDN*cell/2,oy+S2_RDN*cell+22,'right eye',13,C.muted);
  const nd=Li.reduce((a,row,r)=>a+row.filter((v,c)=>v!==Ri[r][c]).length,0);
  out+=T(300,300,s.sh===0?'No shift: the images are identical and nothing stands out.':`Hidden square shifted ${s.sh} column${s.sh>1?'s':''}: ${nd} of ${S2_RDN*S2_RDN} dots differ.`,15,C.ink);
  out+=TF(300,326,'Only the shift between the eyes defines the square.',13,C.muted);
  return {svg:out,phase:s.sh===0?'With no shift there is no disparity, so there is nothing to see in depth.':`A ${s.sh}-column shift gives the square a disparity the brain reads as depth, though no edge exists in either image. Turn to the 3D view to see the surface.`};
 },
 three(s,f,X,project){
  const {L:Li}=S2_rds(s.sh,s.seed),Pp=project([0,S2_RDN,0,S2_RDN,-.5,4]),faces=[];
  for(let r=0;r<S2_RDN;r++)for(let c=0;c<S2_RDN;c++){const inSq=r>=7&&r<17&&c>=7&&c<17,z=inSq?s.sh:0;faces.push({pts:[[c,r,z],[c+1,r,z],[c+1,r+1,z],[c,r+1,z]],fill:Li[r][c]?'#2a3a44':(inSq&&s.sh?'#f6d9cc':'#d5e0e7'),opacity:1,stroke:'none'})}
  return {svg:paintFaces(faces,Pp),title:'The surface the brain recovers',caption:`The central square sits ${s.sh} units above the background, set only by the shift between the two images.`};
 }});

/* =========================== motion-perception =========================== */
SCENE({id:'motion-perception',name:'Apparent motion',tag:'Seeing movement that is not there',
 definition:'Two lights shown one after the other in different places can look like one light moving. Max Wertheimer’s 1912 study of this apparent motion helped launch Gestalt psychology, and cinema depends on it. Whether you see motion depends on the distance and the time between the lights.',
 example:'Two dots 4 cm apart shown 0.4 s apart can look like one dot jumping; at longer gaps they look like two separate dots taking turns.',
 desc:'Two dots that light one after the other at a safe, slow rate, with sliders for the gap in time and distance and a chart of how each setting is usually seen.',
 research:'Wertheimer, M. (1912). Experimentelle Studien über das Sehen von Bewegung. Zeitschrift für Psychologie 61, 161–265; Korte, A. (1915) on the trade-off between distance and time. The zones here are approximate. For faster timings see Mind In Motion’s Gestalt lesson.',
 dur:10,hint:'Press Play to light the dots in turn. To keep the display safe it never flashes faster than about twice a second, so you will see the slower end of the range.',
 init:()=>({gap:450,dist:120,on:0,run:false,tok:0}),
 watch(p){return {gap:450,dist:Math.round(lerp(60,260,smooth(p))),on:Math.floor(p*12)%2,run:true,tok:0}},
 ui:[{range:'gap',label:'Time between the dots',min:350,max:1200,step:50,get:s=>s.gap,act:'gap',show:v=>v+' ms'},{range:'dist',label:'Distance between the dots',min:40,max:300,step:10,get:s=>s.dist,act:'dist',show:v=>v+' units'},{b:'Play',act:'play'},{b:'Stop',act:'stop'}],
 on:{gap(s,v){s.gap=Number(v);return 'keep'},dist(s,v){s.dist=Number(v);return 'keep'},
  play(s,a,ctx){s.run=true;s.tok++;ctx.every(Math.max(350,s.gap),'tick',s.tok);return 'keep'},tick(s,t){if(!s.run||t!==s.tok)return 'stop';s.on=1-s.on;return 'keep'},stop(s){s.run=false;s.tok++;return 'keep'}},
 draw(s){
  let out=heading('One dot moving, or two dots taking turns?');
  out+=R(60,50,480,140,'#fbfcfd',C.grid,8);
  const x1=300-s.dist/2,x2=300+s.dist/2;out+=Ci(x1,120,13,s.on===0?C.ink:'#e3e9ed')+Ci(x2,120,13,s.on===1?C.ink:'#e3e9ed');
  // Approximate zones: motion is seen more readily at shorter gaps and moderate distances.
  const score=1-(s.gap-350)/850*0.8-Math.abs(s.dist-140)/400;const seen=score>.55?'smooth jumping motion':score>.3?'jerky, partial motion':'two separate dots';
  out+=TB(300,226,'Usually seen as: '+seen,16,score>.55?C.green:score>.3?C.amber:C.coral);
  out+=R(100,250,400,16,'#eef3f6','none',4)+R(100,250,400*clamp(score,0,1),16,C.blue,'none',4);
  out+=TF(100,286,'two dots',13,C.muted,'start')+TF(500,286,'motion',13,C.muted,'end');
  out+=TF(300,320,'Zones are approximate; people and displays differ.',13,C.muted);
  out+=TF(300,344,'Safe rate: never more than about 3 changes a second.',13,C.muted);
  return {svg:out,phase:`At ${s.gap} ms and ${s.dist} units most people report ${seen}. Shorter gaps and moderate distances favour motion; Korte’s laws describe the trade-off.`};
 }});

SCENE({id:'motion-perception-aftereffect',name:'The waterfall illusion',tag:'You take part: adapt to motion',
 definition:'After staring at steady motion in one direction, a still scene seems to drift the other way. Robert Addams described it in 1834 after watching the Falls of Foyers in Scotland. Motion-sensitive cells tuned to the adapted direction tire, so the balance tips towards the opposite direction.',
 example:'After 30 seconds of watching stripes drift downwards, stopped stripes seem to creep upwards for a few seconds, yet they plainly go nowhere.',
 desc:'A field of soft horizontal stripes that drift slowly down while you adapt, then stop; you report whether the still stripes seemed to drift and in which direction.',
 research:'Addams, R. (1834). An account of a peculiar optical phaenomenon seen after having looked at a moving body. London and Edinburgh Philosophical Magazine 5, 373–374; Mather, G., Verstraten, F. & Anstis, S. (eds) (1998). The Motion Aftereffect: A Modern Perspective. MIT Press. Robust.',
 dur:12,hint:'Press Start adapting and keep your eyes on the centre dot for the full 30 seconds; the stripes move smoothly and slowly at moderate contrast. When they stop, keep looking and answer. Stop any time if it feels uncomfortable.',
 init:()=>({phase:'idle',off:0,t:0,ans:null,tok:0}),
 watch(p){return p<.7?{phase:'adapt',off:(p*400)%40,t:Math.floor(p/.7*30),ans:null,tok:0}:{phase:'ask',off:0,t:30,ans:p>.85?'up':null,tok:0,sim:true}},
 ui:[{b:'Start adapting',act:'go'},{b:'Still stripes drifted up',act:'ans',arg:'up'},{b:'Drifted down',act:'ans',arg:'down'},{b:'No drift',act:'ans',arg:'none'}],
 on:{go(s,a,ctx){s.phase='adapt';s.t=0;s.off=0;s.ans=null;s.tok++;ctx.every(100,'tick',s.tok);return 'keep'},
  tick(s,t){if(t!==s.tok||s.phase!=='adapt')return 'stop';s.off=(s.off+1.5)%40;s.t+=.1;if(s.t>=30){s.phase='ask';return 'stop'}return 'keep'},
  ans(s,v){if(s.phase!=='ask')return 'keep';s.ans=v;return 'keep'}},
 draw(s){
  let out=heading(s.phase==='adapt'?'Keep your eyes on the dot':s.phase==='ask'?'Now: do the still stripes drift?':'Adapt to downward motion');
  out+=`<clipPath id="s2wf"><rect x="150" y="50" width="300" height="200" rx="8"/></clipPath><g clip-path="url(#s2wf)">`;
  for(let k=-1;k<7;k++){const y=50+k*40+(s.phase==='adapt'?s.off:0);out+=R(150,y,300,20,'#aebcc5','none',0)+R(150,y+20,300,20,'#d7dfe4','none',0)}
  out+='</g>'+R(150,50,300,200,'none',C.grid,8)+Ci(300,150,5,C.coral);
  if(s.phase==='adapt')out+=TF(300,272,`${Math.min(30,Math.floor(s.t))} of 30 s · stripes drifting down`,13,C.muted);
  if(s.phase==='ask'){out+=TF(300,272,'The stripes have stopped.',13,C.muted);
   if(s.ans){out+=TB(300,304,s.sim?'Simulated viewer (Watch)':'Your report',15,C.ink)+TF(300,326,s.ans==='up'?'Upward drift: the classic waterfall illusion.':s.ans==='down'?'Downward: unusual; try again with steadier fixation.':'No drift: some people see little after short adaptation.',13,s.ans==='up'?C.green:C.amber)}}
  out+=TF(300,352,'Published: most people see the still stripes drift up for a few seconds.',13,C.muted);
  return {svg:out,phase:s.phase==='ask'?'Cells tuned to downward motion have adapted and fire less, so the upward-tuned cells briefly win, even though nothing moves.':'Slow, moderate-contrast motion for 30 seconds is enough to adapt motion-sensitive cells in visual area MT and earlier.'};
 }});

function S2_dots(n,coh,seed){const out=[];for(let i=0;i<n;i++){const x=S2_h(i,seed),y=S2_h(i+500,seed),sig=S2_h(i+900,seed)<coh,a=sig?0:S2_h(i+1300,seed)*Math.PI*2;out.push([x,y,a,sig])}return out}
SCENE({id:'motion-perception-coherence',name:'Seeing a crowd move',tag:'Motion pooled across many dots',
 definition:'In a random-dot motion display, only a fraction of the dots move together while the rest move randomly. People and monkeys can report the common direction when only a few per cent of dots move coherently. William Newsome and colleagues tied this ability to visual area MT, and damage to the human motion area leaves people seeing the world as a series of stills (akinetopsia).',
 example:'With 10% of dots moving right and 90% scattering, most observers still say “right” almost every time; at 2% they are close to guessing.',
 desc:'A snapshot of dots with short trails showing their direction, a slider for the percentage moving together, and a curve of how often observers report the right direction.',
 research:'Newsome, W. T. & Paré, E. B. (1988). A selective impairment of motion perception following lesions of the middle temporal visual area (MT). Journal of Neuroscience 8, 2201–2211; Zihl, J., von Cramon, D. & Mai, N. (1983). Selective disturbance of movement vision after bilateral brain damage. Brain 106, 313–340. The curve is an illustrative psychometric function with a threshold of a few per cent.',
 dur:10,hint:'Raise the coherence until the rightward drift is obvious in the trails, then find where it becomes hard to see.',
 init:()=>({coh:.1,seed:3}),
 watch(p){return {coh:+lerp(0,.5,smooth(p)).toFixed(2),seed:3}},
 ui:[{range:'coh',label:'Dots moving together (rightwards)',min:0,max:.6,step:.01,get:s=>s.coh,act:'coh',show:v=>Math.round(v*100)+'%'},{b:'New dots',act:'seed'}],
 on:{coh(s,v){s.coh=Number(v);return 'keep'},seed(s){s.seed=s.seed%89+4;return 'keep'}},
 draw(s){
  let out=heading('Which way is the crowd moving?');
  out+=R(40,50,250,250,'#fff',C.grid,8);
  S2_dots(140,s.coh,s.seed).forEach(([x,y,a,sig])=>{const px=55+x*220,py=65+y*220,dx=Math.cos(a)*12,dy=Math.sin(a)*12;out+=L(px-dx,py-dy,px,py,sig?'#7fa7c4':'#c9d4db',2)+Ci(px,py,2.6,C.ink)});
  const ax=S2_axes(350,70,210,180,[0,.3],[.5,1],'coherence','correct',[[0,'0'],[.1,'10%'],[.2,'20%'],[.3,'30%']],[[.5,'50%'],[.75,'75%'],[1,'100%']]);out+=ax.svg;
  const pc=c=>.5+.5*(1-Math.exp(-Math.pow(c/.06,1.5)));const pts=[];for(let c=0;c<=.3;c+=.005)pts.push([ax.X(c),ax.Y(pc(c))]);out+=S2_poly(pts,C.blue,3);
  const cc=Math.min(.3,s.coh);out+=Ci(ax.X(cc),ax.Y(pc(cc)),6,C.coral);
  out+=TF(455,322,`${Math.round(pc(s.coh)*100)}% correct expected`,13,C.coral);
  out+=TF(165,322,`${Math.round(s.coh*100)}% of dots move right`,13,C.muted);
  return {svg:out,phase:s.coh<.03?'Below a few per cent, observers are near chance: the signal is lost in the noise.':`At ${Math.round(s.coh*100)}% coherence an observer would be right about ${Math.round(pc(s.coh)*100)}% of the time. MT neurons pool many local motions to make this possible.`};
 }});

/* =========================== visual-illusions =========================== */
function S2_ml(cx,y,len,out,col){const f=22,dy=16,x1=cx-len/2,x2=cx+len/2,s=out?-1:1;return L(x1,y,x2,y,col,3)+L(x1,y,x1+s*f,y-dy,col,3)+L(x1,y,x1+s*f,y+dy,col,3)+L(x2,y,x2-s*f,y-dy,col,3)+L(x2,y,x2-s*f,y+dy,col,3)}
SCENE({id:'visual-illusions',name:'The Müller-Lyer illusion',tag:'You take part: match two lines',
 definition:'Two lines of equal length look different when one ends in outward-pointing fins and the other in arrowheads. Franz Müller-Lyer published the figure in 1889. In the 1960s Marshall Segall and colleagues found that people in some non-Western samples were much less susceptible, a result that sparked a long debate about culture and perception.',
 example:'Most people must make the fins-out line noticeably shorter than the arrowhead line before the two look equal; the size of the gap varies with fin angle and length.',
 desc:'A fixed arrowhead figure and an adjustable fins-out figure; the learner sets the second until the two shafts look equal and records the match, then sees their illusion size beside the typical range.',
 research:'Müller-Lyer, F. C. (1889). Optische Urteilstäuschungen. Archiv für Physiologie, Suppl., 263–270; Segall, M. H., Campbell, D. T. & Herskovits, M. J. (1966). The Influence of Culture on Visual Perception; Henrich, Heine & Norenzayan (2010). The weirdest people in the world? BBS 33. Cross-cultural differences are reported but their causes are debated.',
 dur:12,hint:'Move the slider until the two shafts look the same length, then press Record my match. Your match stays on this page.',
 init:()=>({len:200,rec:null,view:'task'}),
 watch(p){return p<.7?{len:Math.round(lerp(220,165,smooth(p/.7))),rec:null,view:'task'}:{len:165,rec:165,view:p>.85?'culture':'task',sim:true}},
 ui:[{range:'len',label:'Length of the fins-out shaft',min:120,max:240,step:2,get:s=>s.len,act:'len',show:v=>v+' units'},{b:'Record my match',act:'rec'},{choose:[['task','Task'],['culture','Across cultures']],label:'View',get:s=>s.view,act:'view'}],
 on:{len(s,v){s.len=Number(v);return 'keep'},rec(s){s.rec=s.len;return 'keep'},view(s,v){s.view=v;return 'keep'}},
 draw(s){
  if(s.view==='culture'){let out=heading('Susceptibility across samples');
   const rows=[['US undergraduates','high'],['South African Europeans','high'],['Rural West African samples','lower'],['San foragers (Kalahari)','lowest']];
   rows.forEach(([l,v],i)=>{const y=86+i*48,w=v==='high'?300:v==='lower'?170:80;out+=TF(60,y+5,l,13,C.ink,'start')+R(260,y-10,w,22,i<2?C.blue:'#9cc3dd','none',4)});
   out+=TF(300,296,'Pattern after Segall et al. (1966), as replotted by Henrich et al. (2010).',13,C.muted);
   out+=TF(300,318,'Proposed causes: experience of rectangular built spaces, retinal',13,C.muted)+TF(300,338,'pigmentation, age and test procedure. Still debated.',13,C.muted);
   return {svg:out,phase:'The finding that people differ in susceptibility is one reason psychologists now worry about generalising from Western students alone.'}}
  let out=heading('Make the two shafts look equal');
  out+=S2_ml(300,110,200,false,C.ink)+TF(300,150,'fixed: arrowheads',13,C.muted);
  out+=S2_ml(300,210,s.len,true,C.blue)+TF(300,250,'yours: fins out',13,C.muted);
  if(s.rec!==null){const pct=Math.round((200-s.rec)/200*100);
   out+=TB(300,290,s.sim?'Simulated viewer (Watch)':'Your match',15,C.ink);
   out+=TF(300,314,`Your fins-out shaft was ${s.rec} units against 200: an illusion of ${pct}%.`,13,pct>0?C.green:C.ink);
   out+=TF(300,338,'Typical results are roughly 10–30%, depending on fin angle and length.',13,C.muted)}
  else out+=TF(300,314,'Press Record my match when the shafts look equal.',13,C.muted);
  return {svg:out,phase:s.rec===null?'The fins-out figure looks longer, so to match you will probably shorten it.':'Explanations include size–distance scaling (the fins suggest corners of rooms) and averaging of the whole figure’s extent; none is settled.'};
 }});

function S2_ebb(cx,cy,rc,rs,n,ring,col){let o=Ci(cx,cy,rc,col);for(let i=0;i<n;i++){const a=i/n*Math.PI*2;o+=Ci(cx+Math.cos(a)*ring,cy+Math.sin(a)*ring,rs,'#c7d3db')}return o}
SCENE({id:'visual-illusions-ebbinghaus',name:'The Ebbinghaus illusion',tag:'You take part: size in context',
 definition:'A circle surrounded by large circles looks smaller than the same circle surrounded by small ones. Hermann Ebbinghaus described it, and Edward Titchener popularised it. In 2007 Jules de Fockert and colleagues reported that Himba observers in remote Namibia were much less susceptible than British students.',
 example:'A central circle among big neighbours has to be made several per cent larger before it looks equal to one among small neighbours.',
 desc:'A fixed central circle among large circles and an adjustable circle among small circles; the learner matches their apparent sizes and records the setting.',
 research:'Titchener, E. B. (1901). Experimental Psychology; de Fockert, J., Davidoff, J., Fagot, J., Parron, C. & Goldstein, J. (2007). More accurate size contrast judgments in the Ebbinghaus illusion by a remote culture. JEP:HPP 33, 738–742. The Himba result is a single study with some later support.',
 dur:10,hint:'Adjust the right-hand circle until the two central circles look the same size, then press Record my match.',
 init:()=>({r:30,rec:null}),
 watch(p){return {r:Math.round(lerp(34,27,smooth(Math.min(1,p*1.4)))),rec:p>.75?27:null,sim:true}},
 ui:[{range:'r',label:'Right central circle radius',min:20,max:40,step:.5,get:s=>s.r,act:'r',show:v=>v+' units'},{b:'Record my match',act:'rec'}],
 on:{r(s,v){s.r=Number(v);return 'keep'},rec(s){s.rec=s.r;return 'keep'}},
 draw(s){
  let out=heading('Which centre circle is bigger?');
  out+=S2_ebb(160,165,30,25,6,68,C.coral)+S2_ebb(440,165,s.r,10,8,50,C.coral);
  out+=TF(160,280,'fixed: radius 30',13,C.muted)+TF(440,280,`yours: radius ${s.r}`,13,C.muted);
  if(s.rec!==null){const pct=Math.round((30-s.rec)/30*100);
   out+=TB(300,310,s.sim?'Simulated viewer (Watch)':'Your match',15,C.ink)+TF(300,332,`You matched a radius of ${s.rec} to 30: an illusion of ${pct}%.`,13,pct>0?C.green:C.ink)+TF(300,354,'Most people set it smaller; Himba observers less so (de Fockert 2007).',13,C.muted)}
  else out+=TF(300,332,'Press Record my match when they look equal.',13,C.muted);
  return {svg:out,phase:'Size is judged relative to the surroundings. How strongly people weigh context seems to vary with experience, which is what the cross-cultural studies probe.'};
 }});

SCENE({id:'visual-illusions-checker',name:'The checker shadow',tag:'Lightness is an inference',
 definition:'Edward Adelson’s 1995 checker-shadow illusion shows two squares that are exactly the same grey on the screen. One looks dark because it is a dark square in light; the other looks light because it is a light square in shadow. The visual system discounts the shadow to report the surface, not the light.',
 example:'Square A, a dark square outside the shadow, and square B, a light square inside it, send the same light to your eye, yet B looks much lighter. Connect them with a strip of the same grey and the difference vanishes.',
 desc:'A checkerboard with a cylinder casting a shadow; two marked squares share the same grey, and a toggle draws a bridge of that grey between them or shows them side by side.',
 research:'Adelson, E. H. (1995). Checker shadow illusion; Adelson, E. H. (2000). Lightness perception and lightness illusions. In Gazzaniga (ed.), The New Cognitive Neurosciences, 339–351. Robust.',
 dur:10,hint:'Switch between the views. Bridge connects the two squares with their true grey; Side by side cuts them out.',
 init:()=>({v:'plain'}),
 watch(p){return {v:p<.4?'plain':p<.7?'bridge':'cut'}},
 ui:[{choose:[['plain','Plain'],['bridge','Bridge'],['cut','Side by side']],label:'View',get:s=>s.v,act:'v'}],
 on:{v(s,x){s.v=x;return 'keep'}},
 draw(s){
  const light=.74,dark=.47,sh=.635,cell=42,ox=110,oy=50;let out=heading('Are squares A and B different greys?');
  const shadow=(r,c)=>Math.hypot(c-3.3,r-1.4)<2.3&&c>=2&&r<=3;
  for(let r=0;r<6;r++)for(let c=0;c<6;c++){const base=(r+c)%2?dark:light,v=shadow(r,c)?base*sh:base;out+=R(ox+c*cell,oy+r*cell,cell,cell,S2_g(v),'none',0)}
  out+=Ci(ox+cell*4.4,oy+cell*.7,26,'#5f8a6a')+R(ox+cell*4.4-26,oy+cell*.7-6,52,cell*1.2,'#5f8a6a','none',0)+Ci(ox+cell*4.4,oy+cell*.7-6,26,'#7fae8a');
  // A: a dark square outside the shadow; B: a light square inside it. Both send the same light.
  const A=[4,1],B=[1,3],cxy=([r,c])=>[ox+(c+.5)*cell,oy+(r+.5)*cell];
  const Av=dark,Bv=light*sh,[ax2,ay2]=cxy(A),[bx2,by2]=cxy(B),bw=cell*.36;
  if(s.v==='bridge')out+=R(ax2-bw/2,by2-bw/2,bw,ay2-by2+bw/2,S2_g(Av),'none',0)+R(ax2-bw/2,by2-bw/2,bx2-ax2+bw/2,bw,S2_g(Av),'none',0);
  out+=TBF(ax2,ay2+6,'A',16,'#fff')+TBF(bx2,by2+6,'B',16,'#fff');
  out+=R(400,70,150,170,'#fff',C.grid,8);
  if(s.v==='cut'){out+=R(420,100,50,50,S2_g(Av),'none',0)+R(480,100,50,50,S2_g(Bv),'none',0)+TF(445,170,'A',13,C.ink)+TF(505,170,'B',13,C.ink)}
  else out+=TF(475,150,'switch to',13,C.muted)+TF(475,170,'Side by side',13,C.muted);
  out+=TF(475,210,`A: ${Math.round(Av*255)} · B: ${Math.round(Bv*255)}`,13,C.muted)+TF(475,228,'(0–255 grey levels)',13,C.muted);
  out+=T(300,330,s.v==='plain'?'Most people see A as dark and B as light.':'Same grey: your brain had corrected for the shadow.',15,s.v==='plain'?C.ink:C.green);
  return {svg:out,phase:'The visual system estimates surfaces, not light. Inside the shadow, a patch sending moderate light must be a light surface; outside it, the same light means a dark one.'};
 }});

SCENE({id:'visual-illusions-dress',name:'The dress',tag:'One photo, two colour schemes',
 definition:'In February 2015 a photograph of a striped dress split the internet: some people saw it as white and gold, others as blue and black. The photo is ambiguous about the light. People who assume the dress is in bluish shade discount the blue and see white and gold; those who assume warm artificial light see blue and black.',
 example:'The same pale blue pixels mean a white fabric in blue shade, or a blue fabric under warm yellow light; your assumption decides.',
 desc:'A stylised dress drawn with fixed colours, an illuminant slider from cool shade to warm lamplight, the colours you would infer under each assumption, and survey shares from a 2015 study.',
 research:'Lafer-Sousa, R., Hermann, K. L. & Conway, B. R. (2015). Striking individual differences in color perception uncovered by ‘the dress’ photograph. Current Biology 25, R545–R546 (about 1,400 respondents; shares rounded); Brainard, D. H. & Hurlbert, A. C. (2015). Colour vision: understanding #TheDress. Current Biology 25, R551–R554. The drawing is a stylised stand-in, not the photograph.',
 dur:10,hint:'Slide the assumed light from cool shade to warm lamplight and watch how the inferred fabric colours change.',
 init:()=>({ill:.5}),
 watch(p){return {ill:smooth(p)}},
 ui:[{range:'ill',label:'Assumed light',min:0,max:1,step:.02,get:s=>s.ill,act:'ill',show:v=>v<.4?'cool shade':v>.6?'warm lamplight':'unsure'}],
 on:{ill(s,v){s.ill=Number(v);return 'keep'}},
 draw(s){
  let out=heading('What colour is the fabric?');
  const body=[140,156,204],lace=[122,100,64];
  // Divide out an illuminant that moves from bluish to yellowish (a von Kries-style correction).
  const illum=[lerp(.78,1.12,s.ill),lerp(.86,1.0,s.ill),lerp(1.2,.72,s.ill)];
  const inf=c=>c.map((v,i)=>clamp(v/illum[i]*1.15,0,255));
  const rgb=c=>`rgb(${c.map(Math.round).join(',')})`;
  out+=P('M110 60 L170 60 L185 110 L195 270 L85 270 L95 110 Z','none',0,rgb(body));
  [100,150,200,240].forEach(y=>out+=R(88,y,104,12,rgb(lace),'none',2));
  out+=TF(140,292,'the photo’s pixels',13,C.muted);
  const ib=inf(body),il=inf(lace);
  out+=R(260,70,90,70,rgb(ib),C.grid,6)+R(360,70,90,70,rgb(il),C.grid,6)+TF(305,158,'fabric',13,C.muted)+TF(405,158,'stripes',13,C.muted);
  const name=s.ill<.45?'white and gold':s.ill>.55?'blue and black':'hard to say';
  out+=TB(355,190,'You would see: '+name,15,s.ill<.45?C.amber:s.ill>.55?C.blue:C.muted);
  const bars=[['blue and black',57,C.blue],['white and gold',30,C.amber],['blue and brown',11,'#8a6d4f']];
  bars.forEach(([l,v,c],i)=>{const y=230+i*28;out+=TF(260,y+5,l,13,C.ink,'start')+R(380,y-8,v*2.6,16,c,'none',3)+TF(386+v*2.6,y+5,v+'%',13,C.muted,'start')});
  out+=TF(355,326,'Shares after Lafer-Sousa et al. (2015), rounded.',13,C.muted);
  return {svg:out,phase:`Assuming ${s.ill<.4?'cool, bluish shade':s.ill>.6?'warm lamplight':'neutral light'}, the brain subtracts that light and reports ${name}. The pixels never change.`};
 }});

/* =========================== face-perception =========================== */
SCENE({id:'face-perception',name:'A brain region for faces',tag:'The fusiform face area',
 definition:'Nancy Kanwisher and colleagues found in 1997 that a patch of the fusiform gyrus responds much more strongly to faces than to other objects. Turning a face upside down hurts recognition far more than turning a house upside down, which suggests faces are processed as wholes.',
 example:'In brain scans, the fusiform face area’s response to faces is roughly twice its response to houses or everyday objects.',
 desc:'Bars for the fusiform face area’s response to faces, objects, houses and scrambled images, and a second view of recognition accuracy for upright and inverted faces and houses.',
 research:'Kanwisher, N., McDermott, J. & Chun, M. M. (1997). The fusiform face area. Journal of Neuroscience 17, 4302–4311; Yin, R. K. (1969). Looking at upside-down faces. JEP 81, 141–145; Tsao, D. Y., Freiwald, W. A., Tootell, R. B. H. & Livingstone, M. S. (2006). A cortical region consisting entirely of face-selective cells. Science 311, 670–674. Bar heights are illustrative.',
 dur:10,hint:'Switch between the brain response and the inversion effect.',
 init:()=>({v:'ffa'}),
 watch(p){return {v:p<.5?'ffa':'inv'}},
 ui:[{choose:[['ffa','Brain response'],['inv','Upside-down faces']],label:'View',get:s=>s.v,act:'v'}],
 on:{v(s,x){s.v=x;return 'keep'}},
 draw(s){
  let out=heading(s.v==='ffa'?'Fusiform face area: response by picture type':'The inversion effect');
  if(s.v==='ffa'){const d=[['faces',1.0,C.coral],['objects',.45,C.blue],['houses',.4,C.blue],['scrambled',.3,C.muted]];
   d.forEach(([l,v,c],i)=>{const x=120+i*100;out+=R(x,300-v*200,60,v*200,c,'none',4)+TF(x+30,320,l,13,C.ink)});
   out+=L(100,300,520,300,C.line,2)+TF(300,346,'Relative response, illustrative heights.',13,C.muted);
   out+=TF(300,64,'Monkeys have similar face patches (Tsao & Livingstone 2006).',13,C.muted)}
  else{const d=[['faces upright',.9],['faces inverted',.6],['houses upright',.85],['houses inverted',.78]];
   d.forEach(([l,v],i)=>{const x=110+i*100;out+=R(x,300-v*220,64,v*220,i<2?C.coral:C.blue,'none',4)+TF(x+32,320,l.split(' ')[0],13,C.ink)+TF(x+32,338,l.split(' ')[1],13,C.muted)});
   out+=L(100,300,520,300,C.line,2)+TF(300,64,'Accuracy at recognising pictures seen before (illustrative).',13,C.muted)}
  return {svg:out,phase:s.v==='ffa'?'A region that prefers faces is consistent across people, though how specialised it is remains debated: some argue it supports expertise with any well-learned category.':'Inversion costs faces much more than other objects, a sign that faces are processed as configurations, not just parts.'};
 }});

function S2_face(cx,cy,flipFeat,inverted){
 let g=Ci(0,0,70,'#f3d7bf','#c79f82')+P('M-56 -40 Q0 -86 56 -40',C.ink,5);
 const eye=(x)=>{let e=P('M-16 0 Q0 -12 16 0 Q0 12 -16 0',C.ink,2,'#fff')+Ci(0,0,5,C.ink)+P('M-18 -14 Q0 -22 18 -14',C.ink,3);return `<g transform="translate(${x},-12) ${flipFeat?'scale(1,-1)':''}">${e}</g>`};
 g+=eye(-26)+eye(26)+P('M0 -4 L-6 18 L6 18',C.ink,2);
 g+=`<g transform="translate(0,38) ${flipFeat?'scale(1,-1)':''}">${P('M-24 -4 Q0 14 24 -4',C.coral,4)}</g>`;
 return `<g transform="translate(${cx},${cy}) ${inverted?'rotate(180)':''}">${g}</g>`;
}
SCENE({id:'face-perception-thatcher',name:'The Thatcher illusion',tag:'You take part: faces upside down',
 definition:'Peter Thompson showed in 1980 that if you turn the eyes and mouth of a face upside down, the result looks grotesque when the face is upright but almost normal when the whole face is inverted. We are poor at reading the relations between features in an upside-down face.',
 example:'An inverted face with flipped eyes and mouth looks merely a little odd; turn it the right way up and it looks shocking.',
 desc:'A generic drawn face whose eyes and mouth can be flipped and which can be turned upside down, with buttons to say whether it looks grotesque.',
 research:'Thompson, P. (1980). Margaret Thatcher: a new illusion. Perception 9, 483–484. Robust. The face here is a generic drawing, not a real person.',
 dur:10,hint:'Flip the features, then turn the whole face over. Say whether it looks grotesque each way. Your answers stay on this page.',
 init:()=>({flip:true,inv:true,ans:{}}),
 watch(p){return p<.5?{flip:true,inv:true,ans:{inv:'no'},sim:true}:{flip:true,inv:false,ans:{inv:'no',up:'yes'},sim:true}},
 ui:[{choose:[[false,'Normal features'],[true,'Flipped features']],label:'Eyes and mouth',get:s=>s.flip,act:'flip'},{choose:[[true,'Upside down'],[false,'Upright']],label:'Whole face',get:s=>s.inv,act:'inv'},{b:'Looks grotesque',act:'ans',arg:'yes'},{b:'Looks fine',act:'ans',arg:'no'}],
 on:{flip(s,v){s.flip=v===true||v==='true';return 'keep'},inv(s,v){s.inv=v===true||v==='true';return 'keep'},ans(s,v){if(s.flip)s.ans[s.inv?'inv':'up']=v;return 'keep'}},
 draw(s){
  let out=heading('Does this face look grotesque?')+S2_face(190,180,s.flip,s.inv);
  out+=TB(360,90,s.sim?'Simulated viewer':'Your answers',15,C.ink,'start');
  [['inv','Upside down'],['up','Upright']].forEach(([k,l],i)=>{const a=s.ans[k],y=124+i*32;out+=R(356,y-20,200,28,'#f6f9fb','none',6)+TF(364,y,l,13,C.ink,'start')+TBF(548,y,a==='yes'?'grotesque':a==='no'?'fine':'—',13,a==='yes'?C.coral:a==='no'?C.green:C.muted,'end')});
  ['Published: grotesque when upright,','almost normal when upside down.'].forEach((l,i)=>out+=TF(360,216+i*20,l,13,C.muted,'start'));
  if(!s.flip)out+=TF(360,280,'Flip the features to run the test.',13,C.amber,'start');
  return {svg:out,phase:'Upside down, the brain reads the features one by one and misses that their relation to the face is wrong. Upright, it reads the whole configuration and the error leaps out.'};
 }});

SCENE({id:'face-perception-variation',name:'From face blindness to super-recognisers',tag:'People differ widely',
 definition:'Face recognition varies enormously between people. About 2–2.5% of people have developmental prosopagnosia, lifelong difficulty recognising faces with otherwise normal vision; at the other end, “super-recognisers” remember faces exceptionally well. The Cambridge Face Memory Test measures the range.',
 example:'On the Cambridge Face Memory Test, a score more than about two standard deviations below the average suggests prosopagnosia; two above, a super-recogniser.',
 desc:'A bell curve of face-memory scores with the bottom and top tails marked, and a slider placing a person on it with their percentile.',
 research:'Duchaine, B. & Nakayama, K. (2006). The Cambridge Face Memory Test. Neuropsychologia 44, 576–585; Kennerknecht, I. et al. (2006). First report of prevalence of non-syndromic hereditary prosopagnosia. American Journal of Medical Genetics A 140, 1617–1622 (about 2.5%); Russell, R., Duchaine, B. & Nakayama, K. (2009). Super-recognizers. Psychonomic Bulletin & Review 16, 252–257. The curve is an approximate normal model.',
 dur:10,hint:'Move a score along the curve. This is not a test: it shows where a score would fall, not your own ability.',
 init:()=>({x:80}),
 watch(p){return {x:Math.round(lerp(52,100,smooth(p)))}},
 ui:[{range:'x',label:'Face-memory score',min:40,max:100,step:1,get:s=>s.x,act:'x',show:v=>v+'%'}],
 on:{x(s,v){s.x=Number(v);return 'keep'}},
 draw(s){
  const mu=80,sd=11,phi=z=>.5*(1+Math.tanh(z*.7978845608*(1+.044715*z*z)));let out=heading('Face memory across people');
  const ax=S2_axes(70,70,460,190,[40,110],[0,1.05],'score on a face-memory test','',[[40,'40'],[58,'58'],[80,'80'],[100,'100']],[]);out+=ax.svg;
  const pts=[];for(let x=40;x<=110;x+=1)pts.push([ax.X(x),ax.Y(Math.exp(-((x-mu)**2)/(2*sd*sd)))]);
  out+=P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L')+` L${fmt(ax.X(110))} ${fmt(ax.Y(0))} L${fmt(ax.X(40))} ${fmt(ax.Y(0))} Z`,'none',0,'#e3eef5')+S2_poly(pts,C.blue,2.5);
  out+=R(ax.X(40),70,ax.X(58)-ax.X(40),190,'rgba(196,82,56,.12)','none',0)+R(ax.X(102),70,ax.X(110)-ax.X(102),190,'rgba(44,119,108,.14)','none',0);
  out+=TF(ax.X(49),88,'possible',13,C.coral)+TF(ax.X(49),104,'prosopagnosia',13,C.coral);
  out+=TF(ax.X(106),88,'super-',13,C.green)+TF(ax.X(106),104,'recognisers',13,C.green);
  const xx=Math.min(110,s.x);out+=L(ax.X(xx),70,ax.X(xx),260,C.ink,2.5);
  const pct=Math.round(phi((s.x-mu)/sd)*100);
  out+=T(300,330,`A score of ${s.x}% is higher than about ${pct}% of people.`,15,C.ink);
  return {svg:out,phase:pct<3?'In the bottom tail: people here often rely on voice, gait and hair to recognise others, and many do not realise others find faces easier.':pct>97?'In the top tail: some police forces now recruit super-recognisers to review CCTV.':'Most people sit in the broad middle; face memory is partly heritable and fairly stable over time.'};
 }});

/* =========================== blind-spot-filling =========================== */
SCENE({id:'blind-spot-filling',name:'Finding your blind spot',tag:'You take part: a hole in vision',
 definition:'Where the optic nerve leaves the eye there are no photoreceptors, so each eye has a blind spot about 15° to the side of where you look. Edme Mariotte discovered it in 1660 and showed it to the French court: a target placed there simply vanishes.',
 example:'Hold a page at about 40 cm, close your left eye and look at a cross with your right eye; a dot about 11 cm to the right of the cross disappears.',
 desc:'A cross and a dot with instructions for the classic at-home test, and a top view of the eye showing the blind spot’s angle and where the dot must be on the page for a chosen viewing distance.',
 research:'Mariotte, E. (1668). Nouvelle découverte touchant la veüe; Armaly, M. F. (1969). The size and location of the normal blind spot. Archives of Ophthalmology 81, 192–201 (centre about 15° temporal, about 5–6° wide). A home demonstration, not an eye test.',
 dur:10,hint:'Draw a cross and a dot about 11 cm apart on paper (or use the pair shown, if your screen is large). Close your left eye, look at the cross with your right eye, and move slowly closer until the dot vanishes.',
 init:()=>({d:40}),
 watch(p){return {d:Math.round(lerp(25,60,smooth(p)))}},
 ui:[{range:'d',label:'Viewing distance',min:20,max:70,step:1,get:s=>s.d,act:'d',show:v=>v+' cm'}],
 on:{d(s,v){s.d=Number(v);return 'keep'}},
 draw(s){
  const sep=s.d*Math.tan(15*Math.PI/180),w=s.d*Math.tan(5.5*Math.PI/180);let out=heading('Where must the dot be to vanish?');
  out+=R(60,50,480,90,'#fff',C.grid,8)+TBF(150,108,'+',30,C.ink)+Ci(450,98,12,C.ink);
  out+=TF(300,160,'Close your left eye, look at the cross with your right eye.',13,C.muted);
  const ex=120,ey=270;out+=Ci(ex,ey,30,'#fff',C.blue)+Ci(ex+24,ey,5,C.coral)+TF(ex,ey+48,'right eye, top view',13,C.muted);
  out+=L(ex+30,ey,520,ey,C.ink,1.5)+L(ex,ey,520,ey-Math.tan(15*Math.PI/180)*400,C.coral,1.5,'stroke-dasharray="5 4"');
  out+=TF(520,ey+16,'cross',13,C.ink,'end')+TF(520,ey-Math.tan(15*Math.PI/180)*400-8,'dot',13,C.coral,'end');
  out+=TF(300,ey-38,'15°',13,C.coral);
  out+=counter(390,184,'dot from cross',`${sep.toFixed(1)} cm`,C.coral,140);
  out+=TF(300,366,`At ${s.d} cm the blind spot covers a patch about ${w.toFixed(1)} cm wide on the page.`,13,C.muted);
  return {svg:out,phase:`At ${s.d} cm, the dot vanishes when it is about ${sep.toFixed(1)} cm from the cross. You never notice the hole normally because the other eye covers it and the brain fills it in.`};
 }});

SCENE({id:'blind-spot-filling-in',name:'Filling in',tag:'The brain paints over the gap',
 definition:'When something falls on the blind spot, you do not see a black hole. The brain fills the gap with whatever surrounds it: a line passing through looks continuous, and a patterned background looks unbroken. Vilayanur Ramachandran and others studied this filling-in.',
 example:'A straight line drawn across the blind spot looks whole even if a short piece in the middle is missing; a small dot entirely inside it simply disappears.',
 desc:'Three test pictures, each with a dashed outline showing where the blind spot would fall, and what people report seeing.',
 research:'Ramachandran, V. S. (1992). Blind spots. Scientific American 266(5), 86–91; Ramachandran, V. S. & Gregory, R. L. (1991). Perceptual filling in of artificially induced scotomas in human vision. Nature 350, 699–702; Komatsu, H. (2006). The neural mechanisms of perceptual filling-in. Nature Reviews Neuroscience 7, 220–231.',
 dur:10,hint:'Choose a test picture. The dashed circle marks where the blind spot would fall during the home test.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:[[0,'Line with a gap'],[1,'Dot inside'],[2,'Patterned background']],label:'Test picture',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  let out=heading('What falls in the blind spot?');
  const cx=380,cy=150;out+=R(60,60,480,180,'#fff',C.grid,8)+TBF(150,160,'+',28,C.ink);
  if(s.k===0)out+=L(260,150,355,150,C.ink,6)+L(405,150,520,150,C.ink,6);
  if(s.k===1)out+=Ci(cx,cy,8,C.coral);
  if(s.k===2){for(let x=250;x<530;x+=18)out+=L(x,70,x,230,'#9cc3dd',4)}
  out+=Ci(cx,cy,28,'none',C.coral,'stroke-dasharray="4 4"');
  const rep=['People report one unbroken line.','People report a blank page: the dot is gone.','People report unbroken stripes.'][s.k];
  out+=T(300,282,'Reported: '+rep.replace('People report ',''),15,C.green);
  out+=TF(300,312,'Nothing reaches the brain from the dashed region; it is filled in.',13,C.muted);
  return {svg:out,phase:rep+' Filling-in shows that what we see is the brain’s best estimate of the scene, not a full copy of the retinal image.'};
 }});

SCENE({id:'blind-spot-filling-design',name:'Why we have a blind spot',tag:'An inverted retina',
 definition:'In vertebrate eyes the light-sensitive cells sit at the back of the retina, behind the nerve fibres, so the fibres must pass through the retina to leave the eye, creating the blind spot. Octopus eyes, which evolved separately, have the receptors in front and no blind spot.',
 example:'Light entering a human eye passes through layers of nerve cells before reaching the rods and cones; in an octopus it reaches the receptors first.',
 desc:'Cross-sections of a vertebrate and an octopus retina with the light path, the nerve exit and whether there is a blind spot, plus a note on the “bad design” debate.',
 research:'Land, M. F. & Nilsson, D.-E. (2012). Animal Eyes, 2nd edn. Oxford University Press; Franze, K. et al. (2007). Müller cells are living optical fibers in the vertebrate retina. PNAS 104, 8287–8292. Whether the inverted retina is a real handicap is debated.',
 dur:10,hint:'Switch between the two eyes and follow the light.',
 init:()=>({e:'v'}),
 watch(p){return {e:p<.5?'v':'o'}},
 ui:[{choose:[['v','Vertebrate (human)'],['o','Octopus']],label:'Eye',get:s=>s.e,act:'e'}],
 on:{e(s,v){s.e=v;return 'keep'}},
 draw(s){
  const vert=s.e==='v';let out=heading(vert?'Vertebrate retina: wired from the front':'Octopus retina: wired from the back');
  out+=arrow(60,150,150,150,'#e6b400',4)+TF(100,136,'light',13,C.amber);
  const recX=vert?400:200,nerX=vert?200:400;
  for(let i=0;i<7;i++){const y=70+i*28;out+=R(recX-20,y,40,20,C.blue,'none',4)}
  out+=TF(recX,288,'light-sensitive cells',13,C.blue);
  for(let i=0;i<7;i++){const y=80+i*28;out+=L(recX+(vert?-20:20),y,nerX,y,C.coral,2)}
  out+=L(nerX,80,nerX,250,C.coral,4)+TF(nerX,288,'nerve fibres',13,C.coral);
  if(vert)out+=L(nerX,250,480,320,C.coral,4)+R(nerX-4,250,8,16,'none',C.coral,2)+TF(480,340,'optic nerve passes through: blind spot',13,C.coral,'end');
  else out+=L(nerX,250,480,320,C.coral,4)+TF(480,340,'nerve leaves behind: no blind spot',13,C.green,'end');
  out+=TF(300,362,vert?'Müller glial cells may guide light through the layers (Franze 2007).':'Separate evolution produced the other arrangement.',13,C.muted);
  return {svg:out,phase:vert?'The inverted layout forces a hole where the fibres leave. Some argue it is a historical accident; others point to benefits such as close contact between receptors and their blood supply.':'The octopus eye shows the other solution evolution found: receptors facing the light, fibres behind, and no blind spot.'};
 }});
