/* ===================== Senses era 4 · Listening ===================== */
// Where a sound is, pulling one sound out of a mixture, hearing speech, pitch, masking and listening in noise.
// Sound plays only from on() handlers. Stereo sounds (for two-ear demos) are built here as two-channel
// buffers and routed through the shared AUDIO master, so mute and stopAll() still apply. Every picture is a
// pure function of state, frame and X. Trial orders and noise use seeded generators (never Math.random).
// Headphones are needed for the two-ear scenes; every hearing task says it is not a diagnosis.

const S4_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const S4_rng=n=>rng(S4_mix(n));
function S4_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const S4_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const S4_logistic=(x,mid,slope)=>1/(1+Math.exp(-(x-mid)*slope));
function S4_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
const S4_TAG=(txt,col)=>R(474,8,118,24,'#fff',col,12)+TF(533,25,txt,12,col);

/* ---- Sound helpers (call only from on() handlers) ---- */
// Play a two-channel buffer. gen(L,R,sr,n) fills both channels; the whole buffer is then scaled to one peak
// level (so loudness differences inside the buffer are kept) and given 10 ms ramps.
function S4_play(dur,gen,o={}){const c=AUDIO.get();if(!c)return;
 try{const sr=c.sampleRate,n=Math.max(1,Math.floor(sr*dur)),buf=c.createBuffer(2,n,sr),Lc=buf.getChannelData(0),Rc=buf.getChannelData(1);gen(Lc,Rc,sr,n);
  let pk=0;for(let i=0;i<n;i++){const a=Math.abs(Lc[i]),b=Math.abs(Rc[i]);if(a>pk)pk=a;if(b>pk)pk=b}
  const g=Math.min(o.gain||.16,.3)/(pk||1),ra=Math.max(1,Math.floor(sr*.01));
  for(let i=0;i<n;i++){const e=Math.min(1,i/ra,(n-1-i)/ra);Lc[i]*=g*e;Rc[i]*=g*e}
  const src=c.createBufferSource();src.buffer=buf;src.connect(AUDIO.master);src.start(c.currentTime+(o.at||0));AUDIO.nodes.add(src);src.onended=()=>AUDIO.nodes.delete(src)}catch(_){}}
// Seeded white-ish noise (sum of 3 uniforms, roughly Gaussian).
function S4_noise(n,seed){const r=S4_rng(seed),a=new Float32Array(n);for(let i=0;i<n;i++)a[i]=(r()+r()+r()-1.5)/0.866;return a}
// Gated burst envelope with 5 ms ramps.
const S4_gate=(t,t0,t1)=>t<t0||t>t1?0:Math.min(1,(t-t0)/.005,(t1-t)/.005);
// A noise burst lateralised by an interaural time difference (µs, + = right ear leads) and level difference (dB).
function S4_burst(itdUs,ildDb,seed,o={}){const dur=o.dur||.45;
 S4_play(dur+.02,(Lc,Rc,sr,n)=>{const z=S4_noise(n+200,seed),d=Math.round(Math.abs(itdUs)*1e-6*sr),far=Math.pow(10,-Math.abs(ildDb)/20);
  for(let i=0;i<n;i++){const t=i/sr,e=S4_gate(t,.01,dur),early=z[i+d]*e,late=z[i]*e;
   // the leading ear gets the signal d samples earlier; the far ear is quieter by |ILD|
   if(itdUs>=0){Rc[i]=early;Lc[i]=late}else{Lc[i]=early;Rc[i]=late}
   if(ildDb>0)Lc[i]*=far;else if(ildDb<0)Rc[i]*=far}},{gain:o.gain||.14,at:o.at||0})}
// Pure tone in both ears with an interaural time difference.
function S4_toneITD(f,itdUs,o={}){const dur=o.dur||.8;
 S4_play(dur,(Lc,Rc,sr,n)=>{const dt=itdUs*1e-6;for(let i=0;i<n;i++){const t=i/sr,e=Math.min(1,t/.05,(dur-t)/.05);Lc[i]=Math.sin(2*Math.PI*f*(t+(itdUs<0?-dt:0)))*e;Rc[i]=Math.sin(2*Math.PI*f*(t+(itdUs>0?dt:0)))*e}},{gain:o.gain||.14})}
// A simple formant (Klatt-style cascade) syllable: glottal pulses through three time-varying resonators.
// f2 / f3 onsets glide to the vowel over 45 ms. Clearly a crude synthetic voice, not recorded speech.
function S4_syllable(on,vowel,o={}){const dur=o.dur||.36;
 S4_play(dur,(Lc,Rc,sr,n)=>{const T=1/sr,ys=[[0,0],[0,0],[0,0]],bw=[90,110,170];let ph=0;
  for(let i=0;i<n;i++){const t=i/sr,f0=135-25*t/dur;ph+=f0*T;let x=0;if(ph>=1){ph-=1;x=1}
   const k=clamp(t/.045,0,1),F=[lerp(on[0],vowel[0],k),lerp(on[1],vowel[1],k),lerp(on[2],vowel[2],k)];let y=x;
   for(let j=0;j<3;j++){const Cc=-Math.exp(-2*Math.PI*bw[j]*T),B=2*Math.exp(-Math.PI*bw[j]*T)*Math.cos(2*Math.PI*F[j]*T),A=1-B-Cc,v=A*y+B*ys[j][0]+Cc*ys[j][1];ys[j][1]=ys[j][0];ys[j][0]=v;y=v}
   const e=Math.min(1,t/.012)*Math.min(1,(dur-t)/.06);Lc[i]=Rc[i]=y*e}},{gain:o.gain||.16,at:o.at||0})}
// Band of noise built from seeded random-phase sines (spacing 10 Hz), optionally with a tone added.
function S4_band(fc,bw,o={}){const dur=o.dur||1;const r=S4_rng(o.seed||7),lo=Math.max(20,fc-bw/2),hi=fc+bw/2,comps=[];
 for(let f=lo;f<=hi+1e-9;f+=Math.max(2,Math.min(10,bw/4)))comps.push([f,r()*2*Math.PI,.5+r()]);
 const aTone=o.toneDb===undefined?0:Math.sqrt(comps.length/2)*Math.pow(10,o.toneDb/20);
 S4_play(dur,(Lc,Rc,sr,n)=>{for(let i=0;i<n;i++){const t=i/sr;let v=0;for(const [f,p,a] of comps)v+=a*Math.sin(2*Math.PI*f*t+p);
  if(aTone&&t>.25&&t<dur-.25)v+=aTone*Math.sin(2*Math.PI*(o.toneF||fc)*t)*Math.min(1,(t-.25)/.02,(dur-.25-t)/.02);Lc[i]=Rc[i]=v}},{gain:o.gain||.13})}

/* =========================== sound-localisation =========================== */
// Woodworth's spherical-head formula: ITD = (a/c)(θ + sin θ), a = 8.75 cm, c = 343 m/s.
const S4_A=.0875,S4_C=343;
const S4_itd=deg=>{const t=clamp(deg,-90,90)*Math.PI/180;return S4_A/S4_C*(t+Math.sin(t))*1e6};
const S4_ITDMAX=S4_itd(90);
// Head-shadow level difference: illustrative, growing with frequency and with sin θ (shape after Feddersen et al. 1957).
const S4_ildMax=f=>1+19*clamp(Math.log2(f/500)/4,0,1);
const S4_ild=(deg,f)=>S4_ildMax(f)*Math.sin(clamp(deg,-90,90)*Math.PI/180);
function S4_head(cx,cy,r,deg,o={}){
 let out=Ci(cx,cy,r,'#f8efe6',C.ink)+P(`M${cx-9} ${cy-r+2}L${cx} ${cy-r-14}L${cx+9} ${cy-r+2}`,C.ink,2,'#f8efe6');
 out+=R(cx-r-9,cy-12,10,24,C.amberp,C.amber,4)+R(cx+r-1,cy-12,10,24,C.amberp,C.amber,4)+TF(cx-r-22,cy+5,'L',13,C.muted)+TF(cx+r+22,cy+5,'R',13,C.muted);
 if(deg!==null&&deg!==undefined){const a=(deg-90)*Math.PI/180,d=o.dist||r*2.6,sx=cx+Math.cos(a)*d,sy=cy+Math.sin(a)*d;
  out+=L(sx,sy,cx-r-4,cy,C.blue,1.6,'stroke-dasharray="5 4"')+L(sx,sy,cx+r+4,cy,C.coral,1.6,'stroke-dasharray="5 4"')+Ci(sx,sy,10,C.ink)+TF(sx,sy-16,o.label||'source',13,C.ink)}
 return out;
}
SCENE({id:'sound-localisation',name:'Two ears, two clues',tag:'Time and level differences',
 definition:'With two ears the brain compares arrival times and levels. A sound from the side reaches the near ear first (an interaural time difference) and louder, because the head casts an acoustic shadow (an interaural level difference).',
 example:'A sound directly to your right reaches the right ear about 0.66 ms before the left: about 5 × 10⁻⁴ s, yet the brain uses differences as small as 10 µs.',
 desc:'A head seen from above with a sound source on an arc. Dashed paths run to each ear; readouts give the time difference from Woodworth’s formula and an illustrative level difference for the chosen frequency.',
 research:'Lord Rayleigh (1907). On our perception of sound direction. Philosophical Magazine 13, 214–232. · Woodworth (1938). Experimental Psychology (spherical-head ITD). · Feddersen, Sandel, Teas & Jeffress (1957). Localization of high-frequency tones. JASA 29, 988–991 (ILD shape; values here illustrative).',
 dur:10,hint:'Move the source and press Play burst. Headphones are needed: on speakers both ears hear both channels. This is a demonstration, not a hearing test.',
 init:()=>({az:40,f:4000}),
 watch(p){return {az:Math.round(-80+160*smooth(p)),f:4000}},
 ui:[{range:'az',label:'Direction',min:-90,max:90,step:5,get:s=>s.az,act:'az',show:v=>v===0?'ahead':(Math.abs(v)+'° '+(v<0?'left':'right'))},{choose:[[500,'500 Hz'],[1500,'1.5 kHz'],[4000,'4 kHz'],[8000,'8 kHz']],label:'Frequency for the level clue',get:s=>s.f,act:'f'},{b:'Play burst (headphones)',act:'play'}],
 on:{az(s,v){s.az=Number(v)},f(s,v){s.f=Number(v)},play(s){S4_burst(S4_itd(s.az),S4_ild(s.az,s.f),11)}},
 draw(s){
  let out=heading('A sound off to one side reaches the ears differently',26);
  out+=S4_head(170,200,46,s.az);
  out+=P('M48 200A122 122 0 0 1 292 200',C.grid,2,'none','stroke-dasharray="3 5"');
  const itd=S4_itd(s.az),ild=S4_ild(s.az,s.f);
  out+=R(330,62,250,240,'#fff',C.grid,10);
  out+=TB(455,90,'What the ears receive',15,C.ink);
  out+=TF(346,122,'Time difference (ITD)',13,C.muted,'start')+TBF(564,122,`${Math.round(Math.abs(itd))} µs`,15,C.blue,'end');
  const bw=210,itdW=Math.abs(itd)/S4_ITDMAX*bw;out+=R(346,132,bw,12,'#eef3f6','none',6)+R(346,132,itdW,12,C.blue,'none',6);
  out+=TF(346,166,'Level difference (ILD)',13,C.muted,'start')+TBF(564,166,`${fmt(Math.abs(ild))} dB`,15,C.coral,'end');
  out+=R(346,176,bw,12,'#eef3f6','none',6)+R(346,176,Math.abs(ild)/20*bw,12,C.coral,'none',6);
  out+=TF(346,212,`Nearer ear: ${s.az===0?'neither':s.az>0?'right':'left'}`,14,C.ink,'start');
  out+=TF(346,236,`ITD maximum ≈ ${Math.round(S4_ITDMAX)} µs at 90°`,13,C.muted,'start');
  out+=TF(346,258,`ILD at ${s.f>=1000?s.f/1000+' kHz':s.f+' Hz'}: up to ≈ ${fmt(S4_ildMax(s.f))} dB`,13,C.muted,'start');
  out+=TF(346,284,'ILD sizes illustrative',12,C.muted,'start');
  out+=T(300,356,`Time difference ${Math.round(Math.abs(itd))} µs · level difference ${fmt(Math.abs(ild))} dB`,15,C.ink);
  return {svg:out,phase:s.az===0?'Straight ahead both ears get the same sound at the same time: no difference to use.':`The ${s.az>0?'right':'left'} ear hears it ${Math.round(Math.abs(itd))} µs earlier. At ${s.f>=1000?s.f/1000+' kHz':s.f+' Hz'} the head also shades the far ear by about ${fmt(Math.abs(ild))} dB; low frequencies bend round the head, so their level difference is small.`};
 }});

SCENE({id:'sound-localisation-duplex',name:'Rayleigh’s duplex theory',tag:'Low notes by time, high notes by level',
 definition:'Rayleigh’s duplex theory: for low frequencies the brain uses the time (phase) difference between the ears; for high frequencies it uses the level difference, because the head is then large enough to cast a sound shadow.',
 example:'At 400 Hz one cycle lasts 2.5 ms, longer than any ITD, so the phase difference is unambiguous. At 4 kHz a cycle lasts 0.25 ms, shorter than the 0.66 ms maximum ITD, so the phase repeats and the time clue becomes ambiguous.',
 desc:'Two graphs over frequency on a log axis: the period of one cycle against the largest possible ITD (phase becomes ambiguous where they cross, near 1.5 kHz), and the head-shadow level difference rising with frequency.',
 research:'Lord Rayleigh (1907). On our perception of sound direction. · Henning (1974). Detectability of interaural delay in high-frequency complex waveforms. JASA 55, 84–90 (high frequencies can still use envelope timing).',
 dur:10,hint:'Slide the frequency. With headphones, play a tone with the right ear 500 µs ahead: at low frequencies it moves to the right; at high frequencies the side is unclear.',
 init:()=>({f:400}),
 watch(p){return {f:Math.round(200*Math.pow(40,smooth(p)))}},
 ui:[{range:'f',label:'Frequency',min:0,max:100,get:s=>Math.round(100*Math.log(s.f/200)/Math.log(40)),act:'f',show:v=>{const f=Math.round(200*Math.pow(40,v/100));return f>=1000?fmt(f/1000)+' kHz':f+' Hz'}},{b:'Tone, right ear 500 µs ahead',act:'play'}],
 on:{f(s,v){s.f=Math.round(200*Math.pow(40,Number(v)/100))},play(s){S4_toneITD(s.f,500)}},
 draw(s){
  let out=heading('Which clue works at which frequency?',26);
  const lx=f=>70+Math.log(f/200)/Math.log(40)*460;
  const pl=S4_plot(70,62,460,120,[0,1],[0,3],{yt:[[1,'1'],[2,'2'],[3,'3 ms']]});out+=pl.svg;
  const per=[];for(let i=0;i<=80;i++){const f=200*Math.pow(40,i/80);per.push([lx(f),pl.Y(Math.min(3,1000/f))])}
  out+=S4_poly(per,C.blue,2.4)+L(70,pl.Y(S4_ITDMAX/1000),530,pl.Y(S4_ITDMAX/1000),C.coral,2,'stroke-dasharray="6 5"');
  out+=TF(526,pl.Y(S4_ITDMAX/1000)-6,'largest ITD 0.66 ms',13,C.coral,'end')+TF(lx(260),pl.Y(2.9)+4,'one cycle',13,C.blue,'start');
  const fx=1e6/S4_ITDMAX;out+=L(lx(fx),62,lx(fx),182,C.amber,1.6,'stroke-dasharray="4 4"')+TF(lx(fx)+4,76,'≈1.5 kHz',13,C.amber,'start');
  const p2=S4_plot(70,206,460,100,[0,1],[0,20],{yt:[[0,'0'],[10,'10'],[20,'20 dB']],yl:'',xl:'frequency (log scale)'});out+=p2.svg;
  const il=[];for(let i=0;i<=80;i++){const f=200*Math.pow(40,i/80);il.push([lx(f),p2.Y(S4_ildMax(f))])}
  out+=S4_poly(il,C.coral,2.4)+TF(lx(7000),p2.Y(19)+16,'head shadow (ILD at 90°)',13,C.coral,'end');
  [[200,'200'],[500,'500'],[1000,'1k'],[2000,'2k'],[4000,'4k'],[8000,'8k Hz']].forEach(([f,l])=>out+=TF(lx(f),196,l,12,C.muted));
  out+=L(lx(s.f),62,lx(s.f),306,C.ink,2)+Ci(lx(s.f),pl.Y(Math.min(3,1000/s.f)),6,C.ink);
  const amb=1e6/s.f<S4_ITDMAX;out+=T(300,360,amb?`${fmt(s.f/1000)} kHz: the time clue is ambiguous, the level clue is strong`:`${s.f<1000?s.f+' Hz':fmt(s.f/1000)+' kHz'}: the time clue is clear, the level clue is ${S4_ildMax(s.f)<4?'weak':'growing'}`,15,C.ink);
  return {svg:out,phase:amb?'One cycle is now shorter than the time between the ears, so the same phase lines up several ways: pure tones become hard to place by timing. The head shadow takes over. (Complex high sounds can still use the timing of their envelope.)':'The cycle is longer than any interaural delay, so the phase difference points one way only. The head is small next to the wavelength, so it casts little shadow.'};
 }});

const S4_CONE_AZ=[20,45,70];
SCENE({id:'sound-localisation-cone',name:'The cone of confusion',tag:'Front or back?',
 definition:'Every point on a cone around the line through the two ears gives the same time and level differences. Two ears alone cannot tell front from back on that cone; turning the head or the shape of the outer ear (the pinna) breaks the tie.',
 example:'A sound 30° to the right in front and one 30° to the right behind give the same ITD. Turn your head 20° to the right: the front one moves towards the middle, the back one further to the side.',
 desc:'A head from above with a source in front and its mirror image behind giving the same ITD; turning the head separates them. The 3D view shows the whole cone of equal ITD around the ear axis.',
 research:'Wallach (1940). The role of head movements and vestibular and visual cues in sound localization. J. Exp. Psychol. 27, 339–368. · Blauert (1997). Spatial Hearing, rev. ed. MIT Press.',
 dur:10,hint:'Move the source and turn the head. Watch the two ITD readouts: identical with the head still, different once it turns.',
 init:()=>({az:30,turn:0}),
 watch(p){return {az:30,turn:p<.45?0:Math.round(20*smooth((p-.45)/.4))}},
 ui:[{range:'az',label:'Source',min:5,max:85,step:5,get:s=>s.az,act:'az',show:v=>v+'° right'},{range:'turn',label:'Turn head',min:0,max:30,step:5,get:s=>s.turn,act:'turn',show:v=>v+'°'}],
 on:{az(s,v){s.az=Number(v)},turn(s,v){s.turn=Number(v)}},
 draw(s){
  let out=heading('Same ITD in front and behind, until you turn your head',26);
  const cx=200,cy=200,r=46,d=130,front=s.az,back=180-s.az;
  out+=G(S4_head(cx,cy,r,null),`transform="rotate(${s.turn} ${cx} ${cy})"`);
  const pos=a=>{const t=(a-90)*Math.PI/180;return [cx+Math.cos(t)*d,cy+Math.sin(t)*d]};
  const [fx,fy]=pos(front),[bx,by]=pos(back);
  out+=L(cx,cy,cx+150,cy,C.grid,1.5,'stroke-dasharray="3 5"')+TF(cx+150,cy-6,'ear axis',12,C.muted,'end');
  out+=Ci(fx,fy,10,C.blue)+TF(fx+14,fy+5,'front',13,C.blue,'start')+Ci(bx,by,10,C.coral)+TF(bx+14,by+5,'behind',13,C.coral,'start');
  const lat=a=>S4_itd(a>90?180-a:a<-90?-180-a:a),iF=lat(front-s.turn),iB2=lat(back-s.turn);
  out+=R(360,80,220,190,'#fff',C.grid,10)+TB(470,106,'ITD (right ear first)',14,C.ink);
  out+=TF(376,140,'source in front',13,C.blue,'start')+TBF(564,140,`${Math.round(iF)} µs`,15,C.blue,'end');
  out+=TF(376,172,'source behind',13,C.coral,'start')+TBF(564,172,`${Math.round(iB2)} µs`,15,C.coral,'end');
  const same=Math.abs(iF-iB2)<1;
  out+=TBF(470,212,same?'identical: confusable':'different: resolved',14,same?C.coral:C.green);
  out+=TF(470,240,s.turn?`head turned ${s.turn}° right`:'head still',13,C.muted);
  out+=T(300,360,same?'Two ears give one number for both positions':`Turning by ${s.turn}° separates them by ${Math.round(Math.abs(iF-iB2))} µs`,15,C.ink);
  return {svg:out,phase:same?'Front and back mirror each other across the ear axis, so time and level differences match. Listeners do make front–back errors with the head still and the pinna cues removed.':'After the turn the front source moves towards straight ahead (smaller ITD) while the one behind moves further to the side (larger ITD). The change tells the brain which it was.'};
 },
 three(s,f,X,project){
  const Pr=project([[-1.4,-1.4,-1.1],[1.4,1.4,1.1]]),th=s.az*Math.PI/180,cone=Math.PI/2-th,faces=[];
  // cone of equal ITD: points making angle (90° − az) with the +x (right-ear) axis
  const N=28,ring=(k)=>{const p=k/N*2*Math.PI,rr=1.25;return [rr*Math.cos(cone),rr*Math.sin(cone)*Math.cos(p),rr*Math.sin(cone)*Math.sin(p)]};
  for(let k=0;k<N;k++)faces.push({pts:[[0,0,0],ring(k),ring(k+1)],fill:C.blue,opacity:.35,stroke:'#ffffff66'});
  // head sphere approximated by latitude bands
  const sph=(a,b)=>[.35*Math.cos(a)*Math.cos(b),.35*Math.sin(a)*Math.cos(b),.35*Math.sin(b)];
  for(let i=0;i<12;i++)for(let j=0;j<6;j++){const a0=i/12*2*Math.PI,a1=(i+1)/12*2*Math.PI,b0=-Math.PI/2+j/6*Math.PI,b1=-Math.PI/2+(j+1)/6*Math.PI;faces.push({pts:[sph(a0,b0),sph(a1,b0),sph(a1,b1),sph(a0,b1)],fill:'#f1dcc8',opacity:.9,stroke:'#d9bfa6'})}
  let out=paintFaces(faces,Pr);
  const a=Pr([-1.4,0,0]),b=Pr([1.4,0,0]);out+=L(a[0],a[1],b[0],b[1],C.amber,2,'stroke-dasharray="6 4"');
  const fr=Pr([1.25*Math.cos(cone),1.25*Math.sin(cone),0]),bk=Pr([1.25*Math.cos(cone),-1.25*Math.sin(cone),0]);
  out+=Ci(fr[0],fr[1],8,C.blue)+Ci(bk[0],bk[1],8,C.coral)+label3(b[0],b[1]-10,'right ear',14,C.amber);
  return {svg:out,title:`Cone of equal ITD for ${s.az}° to the right`,caption:'Every point on the blue cone around the ear axis gives the same ITD: front (blue dot), behind (coral) and above or below.'};
 }});

const S4_LOC_ITDS=[-600,-400,-200,-80,0,80,200,400,600];
const S4_LOC_N=9;
const S4_locOrder=seed=>shuffled(S4_LOC_ITDS,S4_mix(seed));
const S4_itdToDeg=us=>{let lo=-90,hi=90;for(let k=0;k<40;k++){const m=(lo+hi)/2;if(S4_itd(m)<us)lo=m;else hi=m}return (lo+hi)/2};
const S4_POS=[-90,-60,-30,0,30,60,90];
SCENE({id:'sound-localisation-test',name:'Where is it?',tag:'You are the listener',
 definition:'A lateralisation test: with headphones, a noise burst carries only a time difference between the ears. You point to where it seems to come from; the answers are compared with the direction that time difference would mean in open air.',
 example:'With the right ear 400 µs ahead, most people hear the sound well to the right, around 45°. In open air the smallest detectable change straight ahead is about 1°, the minimum audible angle.',
 desc:'Nine headphone trials. Each answer is plotted against the direction implied by the trial’s time difference, beside the line of perfect agreement.',
 research:'Mills (1958). On the minimum audible angle. JASA 30, 237–246. · Yost (1981). Lateral position of sinusoids presented with interaural intensive and temporal differences. JASA 70, 397–409. Headphone sounds are heard inside the head, so points are “lateralisation”, not true localisation.',
 dur:10,hint:'Headphones on, volume low. Press Play burst, then press the dot where it seemed to be. Nine trials. Your answers stay on this page. Not a hearing test.',
 init:()=>({seed:4,i:0,res:[]}),
 watch(p){const n=Math.min(S4_LOC_N,Math.floor(p*(S4_LOC_N+1))),o=S4_locOrder(4),r=S4_rng(31),res=[];for(let i=0;i<n;i++){const d=S4_itdToDeg(o[i]);const g=clamp(d+12*S4_gauss(r),-90,90);res.push({itd:o[i],ans:S4_POS.reduce((a,b)=>Math.abs(b-g)<Math.abs(a-g)?b:a)})}return {seed:4,i:n,res,sim:true}},
 ui:[{b:'Play burst (headphones)',act:'play'},{b:'New order',act:'again'}],
 on:{play(s){if(s.i<S4_LOC_N)S4_burst(S4_locOrder(s.seed)[s.i],0,100+s.i)},ans(s,a){if(s.i>=S4_LOC_N)return;s.res.push({itd:S4_locOrder(s.seed)[s.i],ans:Number(a)});s.i++},again(s){s.seed=nextSeed();s.i=0;s.res=[]}},
 draw(s,f,X){
  let out=heading(s.i<S4_LOC_N?`Trial ${s.i+1} of ${S4_LOC_N}: where did it come from?`:'All nine trials done',26);
  const cx=150,cy=230,rr=110;out+=S4_head(cx,cy,34,null);
  S4_POS.forEach(a=>{const t=(a-90)*Math.PI/180,x=cx+Math.cos(t)*rr,y=cy+Math.sin(t)*rr;
   out+=hit(X,'ans',a,`Answer ${a===0?'ahead':Math.abs(a)+' degrees '+(a<0?'left':'right')}`,Ci(x,y,15,s.i<S4_LOC_N?'#fff':'#f3f5f7',C.blue)+TF(x,y+5,a===0?'0':String(Math.abs(a)),12,C.ink))});
  out+=TF(cx-rr-4,cy+30,'left',13,C.muted)+TF(cx+rr+4,cy+30,'right',13,C.muted);
  const pl=S4_plot(330,64,240,226,[-90,90],[-90,90],{xt:[[-90,'−90'],[0,'0'],[90,'90']],yt:[[-90,'−90'],[0,'0'],[90,'90']],xl:'direction implied by the ITD (°)',yl:'your answer (°)'});out+=pl.svg;
  out+=L(pl.X(-90),pl.Y(-90),pl.X(90),pl.Y(90),C.green,1.8,'stroke-dasharray="6 5"');
  s.res.forEach(r=>out+=Ci(pl.X(S4_itdToDeg(r.itd)),pl.Y(r.ans),6,C.ink,'#fff'));
  out+=TF(450,330,s.sim?'Simulated listener (Watch)':'Your answers',13,C.muted);
  let msg='Points on the green line match the direction the time difference implies.';
  if(s.res.length){const side=s.res.filter(r=>r.itd!==0&&Math.sign(r.ans)===Math.sign(r.itd)).length,tot=s.res.filter(r=>r.itd!==0).length;msg=`Correct side on ${side} of ${tot} off-centre trials`}
  out+=T(300,362,msg,15,C.ink);
  return {svg:out,phase:s.res.length?'Most people get the side right even for 80 µs, under a tenth of a millisecond. Answers often bunch towards the middle or the ends; with headphones the sound sits inside the head, so this is lateralisation, not true direction.':'Each burst has only a time difference between the ears, from 0 to 600 µs either way. Nothing else changes.'};
 }});

/* =========================== auditory-scene =========================== */
// van Noorden (1975) boundaries, approximate: fission boundary ≈ 3 semitones (flat); temporal coherence
// boundary rises with the time between tones (≈ 4 semitones at 60 ms to ≈ 13 at 150 ms). Illustrative.
const S4_fission=()=>3;
const S4_coherence=ioi=>clamp(4+(ioi-60)*0.1,4,16);
function S4_streamPercept(df,ioi){if(df<S4_fission())return 'one';if(df>S4_coherence(ioi))return 'two';return 'either'}
SCENE({id:'auditory-scene',name:'One stream or two?',tag:'Bregman’s auditory scene analysis',
 definition:'Auditory scene analysis: the brain sorts the jumble reaching the ear into separate sources. In a fast A-B-A sequence, tones close in pitch group into one galloping rhythm; far apart and fast, they split into two streams, a high one and a low one.',
 example:'With A and B 2 semitones apart you hear a gallop, da-di-da, da-di-da. Twelve semitones apart at 100 ms per tone, the gallop falls apart into two separate beats.',
 desc:'Left: the A-B-A pattern on a pitch–time grid, drawn as one stream or two. Right: van Noorden’s map of time between tones against pitch separation, with the always-one, either and always-two regions (boundaries approximate).',
 research:'Bregman (1990). Auditory Scene Analysis. MIT Press. · van Noorden (1975). Temporal coherence in the perception of tone sequences (PhD thesis, Eindhoven). · Miller & Heise (1950). The trill threshold. JASA 22, 637–638.',
 dur:10,hint:'Set the pitch gap and the speed, then Play. Listen for a gallop (one stream) or two separate beats. In the middle region it can flip while you listen.',
 init:()=>({df:7,ioi:100}),
 watch(p){return {df:Math.round(1+13*smooth(p)),ioi:100}},
 ui:[{range:'df',label:'Pitch gap',min:1,max:15,step:1,get:s=>s.df,act:'df',show:v=>v+' semitones'},{range:'ioi',label:'Time per tone',min:60,max:200,step:10,get:s=>s.ioi,act:'ioi',show:v=>v+' ms'},{b:'Play ▶',act:'play'}],
 on:{df(s,v){s.df=Number(v)},ioi(s,v){s.ioi=Number(v)},play(s){const a=midiHz(69),b=midiHz(69+s.df),dt=s.ioi/1000,notes=[];for(let k=0;k<10;k++){notes.push({hz:a,at:k*4*dt,dur:dt*.8},{hz:b,at:(k*4+1)*dt,dur:dt*.8},{hz:a,at:(k*4+2)*dt,dur:dt*.8})}AUDIO.seq(notes,{gain:.12})}},
 draw(s){
  const pc=S4_streamPercept(s.df,s.ioi);let out=heading(pc==='one'?'Close in pitch: one galloping stream':pc==='two'?'Far apart and fast: two streams':'In between: it can go either way',26);
  out+=R(30,56,270,230,'#fff',C.grid,6);const yA=236,yB=236-s.df*11;
  for(let k=0;k<8;k++){const x=46+k*31,slot=k%4;if(slot===3)continue;const isB=slot===1,y=isB?yB:yA;out+=R(x,y-6,24,12,isB?C.coral:C.blue,'none',4)}
  if(pc!=='two'){const pts=[];for(let k=0;k<8;k++){const slot=k%4;if(slot===3)continue;pts.push([58+k*31,slot===1?yB:yA])}out+=S4_poly(pts,C.ink,1.5,'stroke-dasharray="4 4"')}
  else{out+=L(58,yA+12,276,yA+12,C.blue,1.5,'stroke-dasharray="4 4"')+L(58,yB-12,276,yB-12,C.coral,1.5,'stroke-dasharray="4 4"')}
  out+=TF(40,yA+4,'A',13,C.blue,'end')+TF(40,yB+4,'B',13,C.coral,'end')+TF(165,302,'time →',13,C.muted);
  const pl=S4_plot(370,60,200,224,[60,200],[0,16],{xt:[[60,'60'],[130,'130'],[200,'200']],yt:[[0,'0'],[4,'4'],[8,'8'],[12,'12'],[16,'16']],xl:'time per tone (ms)',yl:'gap (semitones)'});out+=pl.svg;
  const coh=[];for(let t=60;t<=200;t+=5)coh.push([pl.X(t),pl.Y(S4_coherence(t))]);
  out+=P(`M${pl.X(60)} ${pl.Y(16)}`+coh.map(p=>`L${fmt(p[0])} ${fmt(p[1])}`).join('')+`L${pl.X(200)} ${pl.Y(16)}Z`,'none',0,C.coralp);
  out+=P(`M${pl.X(60)} ${pl.Y(0)}L${pl.X(60)} ${pl.Y(3)}L${pl.X(200)} ${pl.Y(3)}L${pl.X(200)} ${pl.Y(0)}Z`,'none',0,C.pale);
  out+=S4_poly(coh,C.coral,2)+L(pl.X(60),pl.Y(3),pl.X(200),pl.Y(3),C.blue,2);
  out+=TF(pl.X(80),pl.Y(14.6),'two streams',12,C.coral,'start')+TF(pl.X(196),pl.Y(1.2),'one stream',12,C.blue,'end')+TF(pl.X(196),pl.Y(5),'either',12,C.muted,'end');
  out+=Ci(pl.X(s.ioi),pl.Y(s.df),7,C.ink,'#fff');
  out+=T(300,360,`${s.df} semitones apart, ${s.ioi} ms per tone: ${pc==='one'?'one stream':pc==='two'?'two streams':'either percept'}`,15,C.ink);
  return {svg:out,phase:pc==='one'?'Nearby pitches are heard as one source, so the A-B-A pattern keeps its galloping rhythm.':pc==='two'?'Large jumps at speed cannot be followed as one source; the brain hands the high and low tones to separate streams and the gallop disappears.':'Between the boundaries both organisations are possible and attention can tip the balance. Boundary lines are approximate, after van Noorden (1975).'};
 }});

SCENE({id:'auditory-scene-continuity',name:'Hearing through noise',tag:'The continuity illusion',
 definition:'The continuity illusion: when a gap in a tone is filled with a loud noise that could have hidden it, the tone is heard to carry on through the noise. Leave the gap silent and the break is obvious.',
 example:'A 1 kHz tone with a 200 ms gap sounds broken. Put a loud noise burst in the gap and most people hear one unbroken tone behind the noise, though no tone is there during it.',
 desc:'A frequency–time picture of a tone with a gap: silent, or filled by a broad noise burst, with the tone people report hearing drawn as a dashed continuation.',
 research:'Miller & Licklider (1950). The intelligibility of interrupted speech. JASA 22, 167–173. · Warren, Obusek & Ackroff (1972). Auditory induction. Science 176, 1149–1151. · Warren (1970). Perceptual restoration of missing speech sounds. Science 167, 392–393.',
 dur:9,hint:'Play the silent gap, then the gap filled with noise. Does the tone seem to continue? The noise is gentle; keep the volume low.',
 init:()=>({fill:'noise'}),
 watch(p){return {fill:p<.5?'silence':'noise'}},
 ui:[{choose:[['silence','Silent gap'],['noise','Noise in the gap']],label:'Gap',get:s=>s.fill,act:'fill'},{b:'Play ▶',act:'play'}],
 on:{fill(s,v){s.fill=v},play(s){const noise=s.fill==='noise';S4_play(1.4,(Lc,Rc,sr,n)=>{const z=S4_noise(n,5);for(let i=0;i<n;i++){const t=i/sr,inGap=t>.6&&t<.8;let v=0;
   if(!inGap&&t>.02&&t<1.38)v+=.35*Math.sin(2*Math.PI*1000*t)*Math.min(1,Math.abs(t-.6)/.005,Math.abs(t-.8)/.005);
   if(noise&&inGap)v+=z[i]*.9*Math.min(1,(t-.6)/.004,(.8-t)/.004);Lc[i]=Rc[i]=v}},{gain:.12})}},
 draw(s){
  const noise=s.fill==='noise';let out=heading(noise?'Gap filled with noise: the tone seems to continue':'Silent gap: you hear the tone stop',26);
  const pl=S4_plot(70,64,460,220,[0,1.4],[0,4],{xt:[[0,'0'],[.6,'0.6'],[.8,'0.8'],[1.4,'1.4 s']],yt:[[0,'0'],[1,'1'],[2,'2'],[4,'4 kHz']],xl:'time',yl:'frequency'});out+=pl.svg;
  out+=L(pl.X(.02),pl.Y(1),pl.X(.6),pl.Y(1),C.blue,5)+L(pl.X(.8),pl.Y(1),pl.X(1.38),pl.Y(1),C.blue,5);
  if(noise){const r=S4_rng(9);for(let k=0;k<70;k++){const x=lerp(pl.X(.6),pl.X(.8),r()),y=lerp(pl.Y(3.9),pl.Y(.1),r());out+=R(x,y,5,3,C.muted,'none',1)}
   out+=R(pl.X(.6),pl.Y(4),pl.X(.8)-pl.X(.6),220,'#9aa9b322','none',0)+L(pl.X(.6),pl.Y(1),pl.X(.8),pl.Y(1),C.blue,2,'stroke-dasharray="5 4"')+TF(pl.X(.7),pl.Y(1)+22,'heard, not there',12,C.blue)}
  else out+=TF(pl.X(.7),pl.Y(1)+5,'gap',13,C.muted);
  out+=T(300,360,noise?'The brain fills in a sound the noise could have masked':'Nothing could have hidden the tone, so the gap is heard',15,C.ink);
  return {svg:out,phase:noise?'The noise is loud enough, and covers the tone’s frequency, so it could have masked a continuing tone. The auditory system assumes it did, and you hear the tone carry on. Speech is restored the same way when a sound is replaced by a cough.':'With nothing in the gap there is no evidence the tone continued, so the break is plain.'};
 }});

const S4_MIS_N=10,S4_MIS_F0=200;
SCENE({id:'auditory-scene-mistuning',name:'A harmonic that pops out',tag:'Grouping by harmonicity',
 definition:'Harmonicity grouping: partials at whole-number multiples of one fundamental fuse into a single sound. Shift one partial off its harmonic slot and, beyond a few per cent, it separates and is heard as a second tone.',
 example:'In a 200 Hz complex, moving the 4th harmonic from 800 Hz to 832 Hz (4% off) makes a separate tone stand out from the buzz.',
 desc:'Ten harmonics of 200 Hz on a frequency axis with their exact harmonic slots marked; one partial can be moved off its slot by up to 8%.',
 research:'Moore, Glasberg & Peters (1986). Thresholds for hearing mistuned partials as separate tones in harmonic complexes. JASA 80, 479–483 (about 1–3% for low harmonics). · Bregman (1990), ch. 3.',
 dur:9,hint:'Choose which harmonic to move and how far, then compare with the in-tune sound.',
 init:()=>({h:4,mis:4}),
 watch(p){return {h:4,mis:Math.round(8*smooth(p))}},
 ui:[{choose:[[2,'2nd'],[3,'3rd'],[4,'4th'],[6,'6th']],label:'Harmonic',get:s=>s.h,act:'h'},{range:'mis',label:'Mistuning',min:0,max:8,step:1,get:s=>s.mis,act:'mis',show:v=>v+'%'},{b:'Play in tune',act:'tune'},{b:'Play mistuned',act:'play'}],
 on:{h(s,v){s.h=Number(v)},mis(s,v){s.mis=Number(v)},tune(){range(S4_MIS_N).forEach(i=>AUDIO.tone(S4_MIS_F0*(i+1),{dur:1.4,gain:.12/Math.sqrt(S4_MIS_N)}))},
  play(s){range(S4_MIS_N).forEach(i=>{const n=i+1,f=S4_MIS_F0*n*(n===s.h?1+s.mis/100:1);AUDIO.tone(f,{dur:1.4,gain:.12/Math.sqrt(S4_MIS_N)})})}},
 draw(s){
  const out0=s.mis>=3;let out=heading(s.mis===0?'All ten partials in tune: one buzzy tone':out0?`The ${s.h}${s.h===2?'nd':s.h===3?'rd':'th'} harmonic now stands out`:'Slightly off: still part of the whole',26);
  const pl=S4_plot(50,70,520,200,[0,2200],[0,1],{xt:[[200,'200'],[600,'600'],[1000,'1000'],[1400,'1400'],[1800,'1800'],[2000,'2000 Hz']],xl:'frequency (dashed: multiples of 200 Hz)'});out+=pl.svg;
  for(let n=1;n<=S4_MIS_N;n++){const slot=S4_MIS_F0*n,f=n===s.h?slot*(1+s.mis/100):slot,x=pl.X(f);
   out+=L(pl.X(slot),pl.Y(1),pl.X(slot),pl.Y(0),C.grid,1,'stroke-dasharray="3 4"');
   out+=R(x-5,pl.Y(.85/Math.sqrt(n)+.1),10,pl.Y(0)-pl.Y(.85/Math.sqrt(n)+.1),n===s.h&&s.mis?C.coral:C.blue,'none',3)}
  if(s.mis){const x=pl.X(S4_MIS_F0*s.h*(1+s.mis/100));out+=TF(x,pl.Y(.97),`${fmt(S4_MIS_F0*s.h*(1+s.mis/100))} Hz`,13,C.coral)}
  out+=T(300,356,`${s.mis}% off · threshold for low harmonics is roughly 1–3% (Moore et al. 1986)`,15,C.ink);
  return {svg:out,phase:s.mis===0?'Every partial sits on a multiple of 200 Hz, so the brain groups them into one sound with one pitch.':out0?'Off its slot, the partial no longer fits the harmonic template; the brain assigns it to a separate source and you hear it as its own tone.':'A small shift still lets the partial join the group, though it may nudge the pitch slightly.'};
 }});

/* =========================== speech-perception =========================== */
// Formant targets (Hz) for three vowels, and syllable onsets from locus-style rules (illustrative, after
// Delattre, Liberman & Cooper 1955): F2 starts part-way between a consonant locus and the vowel's F2.
const S4_VOW={a:[700,1220,2600],i:[280,2250,2900],u:[310,870,2250]};
function S4_onset(c,v){const V=S4_VOW[v],locus=c==='b'?720:c==='d'?1800:(V[1]>1700?2700:1500),f2=V[1]+.55*(locus-V[1]);
 const f3=c==='b'?V[2]-300:c==='d'?2700:f2+150;return [250,f2,f3]}
const S4_MOUTH={b:{closed:1,open:.8},d:{closed:.25,open:.8},g:{closed:.35,open:.85}};
function S4_face(cx,cy,vis,t){
 // t: ms since start; consonant release at 300 ms. Lips close for a bilabial before release.
 const m=S4_MOUTH[vis],rel=300,pre=t<rel-120?0:t<rel?(t-(rel-120))/120:1,openAmt=t<rel?(vis==='b'?lerp(.25,0,pre):m.closed*.5):lerp(vis==='b'?0:m.closed*.5,m.open,clamp((t-rel)/90,0,1));
 let out=Ci(cx,cy,78,'#f8e6d4',C.ink)+Ci(cx-28,cy-24,7,C.ink)+Ci(cx+28,cy-24,7,C.ink)+P(`M${cx} ${cy-14}L${cx-6} ${cy+10}L${cx+5} ${cy+10}`,C.ink,2);
 const w=34,h=4+openAmt*26,my=cy+38;
 out+=P(`M${cx-w} ${my}Q${cx} ${my-h} ${cx+w} ${my}Q${cx} ${my+h} ${cx-w} ${my}Z`,'#a2404a',3,openAmt>.05?'#5a1e26':'#c66f78');
 if(vis==='g'&&openAmt>.2)out+=P(`M${cx-14} ${my+h*.4}Q${cx} ${my-h*.2} ${cx+14} ${my+h*.4}`,'#e8909a',3);
 return out;
}
const S4_MCG_CONDS=[['audio','Sound only'],['match','Sound + matching lips'],['mcgurk','Sound “ba” + lips “ga”']];
SCENE({id:'speech-perception',name:'The McGurk effect',tag:'Seeing changes hearing',
 definition:'The McGurk effect: when the sound of one syllable is paired with lips saying another, many people hear a third syllable. Hearing “ba” while seeing “ga” is often heard as “da”: vision and hearing are merged before you are aware of either.',
 example:'McGurk and MacDonald reported that 98% of adults heard “da” for audio “ba” with video “ga”. Later studies find huge differences between people, from nearly never to nearly always.',
 desc:'A cartoon face whose lips either close for “b” or stay open for “g” while a synthetic “ba” plays; the learner reports what they heard in each of three conditions.',
 research:'McGurk & MacDonald (1976). Hearing lips and seeing voices. Nature 264, 746–748. · Basu Mallick, Magnotti & Beauchamp (2015). Variability and stability in the McGurk effect. Psychonomic Bulletin & Review 22, 1299–1307. The cartoon lips here are a far weaker cue than real video, so the effect may be small or absent.',
 dur:10,hint:'Choose a condition, press Play and watch the mouth, then answer. Try all three. The voice is crudely synthetic. Your answers stay on this page.',
 init:()=>({cond:'mcgurk',t:-1,tok:0,ans:{}}),
 watch(p){const c=p<.33?'audio':p<.66?'match':'mcgurk',lt=((p*3)%1)*900;return {cond:c,t:lt,tok:0,ans:{}}},
 ui:[{choose:S4_MCG_CONDS,label:'Condition',get:s=>s.cond,act:'cond'},{b:'Play ▶',act:'play'},{b:'I heard “ba”',act:'say',arg:'ba'},{b:'“da”',act:'say',arg:'da'},{b:'“ga”',act:'say',arg:'ga'}],
 on:{cond(s,v){s.cond=v;s.t=-1},
  play(s,a,ctx){s.tok++;s.t0=performance.now();s.t=0;S4_syllable(S4_onset('b','a'),S4_VOW.a,{at:.3});ctx.every(30,'tick',s.tok)},
  tick(s,tok){if(Number(tok)!==s.tok)return 'stop';s.t=performance.now()-s.t0;if(s.t>900){s.t=900;return 'stop'}},
  say(s,a){s.ans[s.cond]=a}},
 draw(s,f,X){
  const vis=s.cond==='mcgurk'?'g':'b',show=s.cond!=='audio';let out=heading(S4_MCG_CONDS.find(c=>c[0]===s.cond)[1],26);
  if(show)out+=S4_face(160,190,vis,s.t<0?0:s.t);else out+=R(82,112,156,156,'#eef2f5',C.grid,12)+TF(160,186,'no face:',14,C.muted)+TF(160,206,'listen only',14,C.muted);
  out+=TF(160,300,show?`lips say “${vis}a”`:'',13,C.muted)+TF(160,320,'sound is always “ba”',13,C.blue);
  out+=R(320,70,260,230,'#fff',C.grid,10)+TB(450,96,'What you heard',15,C.ink);
  S4_MCG_CONDS.forEach(([k,l],i)=>{const y=134+i*48,a=s.ans[k];out+=TF(334,y,l,13,C.ink,'start')+TBF(566,y,a?`“${a}”`:'–',15,a==='da'&&k==='mcgurk'?C.coral:C.blue,'end')});
  out+=TF(450,288,'published: 98% “da” (1976); varies widely',12,C.muted);
  const mc=s.ans.mcgurk;
  out+=T(300,360,mc?(mc==='ba'?'You heard the sound as it is: the lips did not win this time':mc==='da'?'You fused sound and sight into “da”: the McGurk effect':'You heard what the lips said: vision took over'):'Play each condition and report what you hear',15,C.ink);
  return {svg:out,phase:'The sound is identical in every condition; only the picture changes. Any change in what you report is your brain combining sight and sound. With cartoon lips and a synthetic voice, many people still hear “ba”, which is itself a useful result: the effect depends on how strong each cue is.'};
 }});

const S4_CONT_STEPS=7,S4_CONT_REPS=2;
const S4_contF2=k=>lerp(1000,1800,k/(S4_CONT_STEPS-1));
const S4_contOrder=seed=>shuffled(range(S4_CONT_STEPS*S4_CONT_REPS).map(i=>i%S4_CONT_STEPS),S4_mix(seed));
SCENE({id:'speech-perception-categories',name:'From “ba” to “da”',tag:'You are the listener',
 definition:'Categorical perception: along a smooth physical continuum between two speech sounds, listeners report one category, then switch sharply to the other, rather than hearing a gradual blend.',
 example:'Seven syllables differ only in how the second formant starts, from 1000 Hz to 1800 Hz. Most people call the first three “ba” and the last three “da”, with a steep change in between.',
 desc:'Fourteen trials of a seven-step synthetic “ba”–“da” continuum. The share of “da” answers at each step is plotted beside a typical steep identification curve.',
 research:'Liberman, Harris, Hoffman & Griffith (1957). The discrimination of speech sounds within and across phoneme boundaries. J. Exp. Psychol. 54, 358–368. · Pisoni & Lazarus (1974): listeners can hear differences inside a category, so the strong form is debated (McMurray 2022, Psychological Review).',
 dur:10,hint:'Press Play, then answer “ba” or “da”. Fourteen trials in a fixed random order. The voice is synthetic. Your answers stay on this page.',
 init:()=>({seed:9,i:0,res:[]}),
 watch(p){const n=Math.min(14,Math.floor(p*15)),o=S4_contOrder(9),r=S4_rng(41),res=[];for(let i=0;i<n;i++){const k=o[i];res.push({k,da:r()<S4_logistic(k,3,2.6)})}return {seed:9,i:n,res,sim:true}},
 ui:[{b:'Play ▶',act:'play'},{b:'“ba”',act:'ans',arg:0},{b:'“da”',act:'ans',arg:1},{b:'New order',act:'again'}],
 on:{play(s){if(s.i>=14)return;const k=S4_contOrder(s.seed)[s.i],f2=S4_contF2(k);S4_syllable([250,f2,lerp(2100,2800,k/6)],S4_VOW.a)},
  ans(s,a){if(s.i>=14)return;s.res.push({k:S4_contOrder(s.seed)[s.i],da:Number(a)===1});s.i++},again(s){s.seed=nextSeed();s.i=0;s.res=[]}},
 draw(s,f,X){
  let out=heading(s.i<14?`Trial ${s.i+1} of 14`:'All fourteen trials done',26);
  const pl=S4_plot(80,64,440,216,[0,6],[0,100],{xt:range(7).map(k=>[k,String(Math.round(S4_contF2(k)))]),yt:[[50,'50'],[100,'100%']],xl:'second-formant start (Hz): “ba” → “da”',yl:'answered “da”'});out+=pl.svg;
  const typ=[];for(let i=0;i<=60;i++){const k=i/10;typ.push([pl.X(k),pl.Y(100*S4_logistic(k,3,2.6))])}out+=S4_poly(typ,C.muted,2,'stroke-dasharray="6 5"');
  out+=TF(pl.X(5.9),pl.Y(100*S4_logistic(5.9,3,2.6))+18,'typical',13,C.muted,'end');
  const by=range(7).map(k=>{const r=s.res.filter(x=>x.k===k);return r.length?100*r.filter(x=>x.da).length/r.length:null});
  const pts=by.map((v,k)=>v===null?null:[pl.X(k),pl.Y(v)]).filter(Boolean);out+=S4_poly(pts,C.blue,2.4);pts.forEach(p=>out+=Ci(p[0],p[1],6,C.blue,'#fff'));
  out+=TF(300,318,s.sim?'Simulated listener (Watch)':'Your answers (blue)',13,s.sim?C.muted:C.blue);
  out+=T(300,358,s.res.length>=14?'A steep step means you heard categories, not a smooth change':'The physical change between steps is always the same size',15,C.ink);
  return {svg:out,phase:s.res.length?'Even though each step changes the sound by the same amount, answers tend to jump from “ba” to “da” over one or two steps. A shallow curve is also normal with a crude synthetic voice.':'Every syllable has the same vowel; only the first 45 ms differs, where the second formant glides from its start into the vowel.'};
 }});

SCENE({id:'speech-perception-formants',name:'No single cue for “d”',tag:'The lack of invariance',
 definition:'Consonants are heard largely from formant transitions, the quick glides of resonances into the vowel. The same consonant has different transitions before different vowels, so there is no one acoustic pattern for “d”: the lack of invariance.',
 example:'Before “ee” the second formant of “d” rises; before “oo” it falls. Yet both are heard as the same “d”.',
 desc:'Schematic formant tracks (F1, F2, F3) for the chosen consonant and vowel, with the transition region shaded; the syllable can be played. Values are illustrative locus-style rules.',
 research:'Delattre, Liberman & Cooper (1955). Acoustic loci and transitional cues for consonants. JASA 27, 769–773. · Liberman, Cooper, Shankweiler & Studdert-Kennedy (1967). Perception of the speech code. Psychological Review 74, 431–461.',
 dur:10,hint:'Pick a consonant and a vowel, compare the tracks, then Play. Try “d” with each vowel and watch F2 change direction.',
 init:()=>({c:'d',v:'i'}),
 watch(p){return {c:'d',v:p<.33?'i':p<.66?'a':'u'}},
 ui:[{choose:[['b','b'],['d','d'],['g','g']],label:'Consonant',get:s=>s.c,act:'c'},{choose:[['i','ee'],['a','ah'],['u','oo']],label:'Vowel',get:s=>s.v,act:'v'},{b:'Play ▶',act:'play'}],
 on:{c(s,v){s.c=v},v(s,v){s.v=v},play(s){S4_syllable(S4_onset(s.c,s.v),S4_VOW[s.v])}},
 draw(s){
  const on=S4_onset(s.c,s.v),V=S4_VOW[s.v],vn={i:'ee',a:'ah',u:'oo'}[s.v];let out=heading(`“${s.c}${vn}”: second formant ${on[1]<V[1]?'rises':'falls'} into the vowel`,26);
  const pl=S4_plot(80,60,440,230,[0,300],[0,3200],{xt:[[0,'0'],[45,'45'],[150,'150'],[300,'300 ms']],yt:[[0,'0'],[1000,'1000'],[2000,'2000'],[3000,'3000 Hz']],xl:'time',yl:'formant frequency'});out+=pl.svg;
  out+=R(pl.X(0),60,pl.X(45)-pl.X(0),230,C.amberp,'none',0)+TF(pl.X(22),78,'transition',12,C.amber);
  [[0,C.green,'F1'],[1,C.coral,'F2'],[2,C.blue,'F3']].forEach(([j,col,lab])=>{out+=L(pl.X(0),pl.Y(on[j]),pl.X(45),pl.Y(V[j]),col,4)+L(pl.X(45),pl.Y(V[j]),pl.X(300),pl.Y(V[j]),col,4)+TF(pl.X(300)-4,pl.Y(V[j])-8,lab,13,col,'end')});
  out+=T(300,356,`F2 starts at ${Math.round(on[1])} Hz and moves to ${V[1]} Hz`,15,C.ink);
  return {svg:out,phase:s.c==='d'?`For “d” the second formant always points back towards about 1800 Hz, its locus, but ends wherever the vowel is. So it ${on[1]<V[1]?'rises':'falls'} here, and the listener has to read the consonant in the light of the vowel.`:'Each consonant pulls the start of the formants towards its own region; the vowel decides where they end. Values are a simplified locus rule, not measurements of one speaker.'};
 }});

/* =========================== pitch-perception =========================== */
// Greenwood (1990) map: f = 165.4 (10^(2.1 x) − 0.88), x = 0 at the apex, 1 at the base.
const S4_greenX=f=>clamp(Math.log10(f/165.4+.88)/2.1,0,1);
// Phase locking in the auditory nerve: strong to about 1 kHz, gone by about 4–5 kHz (cat data; human limit debated).
const S4_lock=f=>clamp(1/(1+Math.pow(f/2200,3)),0,1);
SCENE({id:'pitch-perception',name:'Place and timing',tag:'Two codes for pitch',
 definition:'The ear has two ways to signal frequency: place (which part of the cochlea vibrates most) and timing (nerve fibres firing in step with each cycle, phase locking). Phase locking fades above a few kilohertz, so very high pitches rely on place alone.',
 example:'At 500 Hz fibres fire on the same part of nearly every cycle; at 6 kHz they can no longer keep up in step, and only the place of the peak says what the frequency is.',
 desc:'Left: the uncoiled cochlea from apex to base with the place of the peak for the chosen frequency. Right: a waveform with nerve spikes that line up with its peaks while phase locking is strong, and scatter when it is weak.',
 research:'Greenwood (1990). A cochlear frequency-position function for several species. JASA 87, 2592–2605. · Johnson (1980). The relationship between spike rate and synchrony in responses of auditory-nerve fibers to single tones. JASA 68, 1115–1122 (cat). · Verschooten et al. (2019). The upper frequency limit for the use of phase locking to code temporal fine structure in humans. J. Neurosci. 39, 3938–3956 (human limit debated).',
 dur:10,hint:'Slide the frequency and Play. Watch the place move along the cochlea and the spikes lose their lock to the wave.',
 init:()=>({f:500}),
 watch(p){return {f:Math.round(100*Math.pow(100,smooth(p)))}},
 ui:[{range:'f',label:'Frequency',min:0,max:100,get:s=>Math.round(100*Math.log(s.f/100)/Math.log(100)),act:'f',show:v=>{const f=Math.round(100*Math.pow(100,v/100));return f>=1000?fmt(f/1000)+' kHz':f+' Hz'}},{b:'Play ▶',act:'play'}],
 on:{f(s,v){s.f=Math.round(100*Math.pow(100,Number(v)/100))},play(s){AUDIO.tone(s.f,{dur:.9,gain:s.f>4000?.08:.12})}},
 draw(s){
  const x=S4_greenX(s.f),lk=S4_lock(s.f);let out=heading(`${s.f>=1000?fmt(s.f/1000)+' kHz':s.f+' Hz'}: place ${Math.round(x*100)}% towards the base, timing ${lk>.6?'strong':lk>.2?'weak':'lost'}`,26);
  out+=TB(160,70,'Place',15,C.ink);const xa=40,xb=280;out+=P(`M${xa} 110L${xb} 100L${xb} 130L${xa} 140Z`,C.line,1.5,'#f6f0ea');
  const px=xa+x*(xb-xa);out+=Ci(px,120,9,C.coral)+TF(xa,160,'apex (low)',12,C.muted,'start')+TF(xb,160,'base (high)',12,C.muted,'end');
  [[100,'100'],[1000,'1k'],[10000,'10k Hz']].forEach(([f,l])=>{const q=xa+S4_greenX(f)*(xb-xa);out+=L(q,96,q,104,C.muted,1)+TF(q,90,l,12,C.muted)});
  out+=TB(450,70,'Timing',15,C.ink);out+=R(320,84,260,110,'#fff',C.grid,6);
  const cyc=6,wv=[];for(let i=0;i<=200;i++){const t=i/200;wv.push([330+t*240,140-28*Math.sin(2*Math.PI*cyc*t)])}out+=S4_poly(wv,C.blue,1.8);
  const r=S4_rng(Math.round(s.f));for(let k=0;k<cyc;k++){if(r()>.7)continue;const jitter=(1-lk)*(r()-.5);const t=(k+.25+jitter)/cyc;out+=L(330+t*240,176,330+t*240,190,C.ink,2.4)}
  out+=TF(450,212,'spikes (one fibre)',12,C.muted);
  const pl=S4_plot(320,236,260,70,[0,1],[0,1],{yt:[[0,'0'],[1,'1']]});out+=pl.svg;const lc=[];for(let i=0;i<=60;i++){const f=100*Math.pow(100,i/60);lc.push([pl.X(i/60),pl.Y(S4_lock(f))])}
  out+=S4_poly(lc,C.ink,2)+Ci(pl.X(Math.log(s.f/100)/Math.log(100)),pl.Y(lk),6,C.coral)+TF(450,326,'phase locking, 100 Hz → 10 kHz',12,C.muted);
  out+=TF(160,214,'place code: works across the range',13,C.ink)+TF(160,236,'timing code: fades above ~4 kHz',13,C.ink);
  out+=T(300,364,lk>.3?'Both codes agree on the frequency':'Only the place code is left',15,C.ink);
  return {svg:out,phase:lk>.3?'Spikes fall near the same part of each cycle, so the gaps between them carry the period. The place of the peak says the same thing.':'The fibre still fires, but no longer in step with each cycle, so timing carries little about frequency. Musical pitch also weakens up here: melodies above about 5 kHz are hard to recognise.'};
 }});

const S4_DL_N=24,S4_DL_F=1000;
function S4_dlTrial(s){const r=S4_rng(s.seed*97+s.i);return r()<.5?0:1}
function S4_dlNext(s,correct){s.hist.push({d:s.d,ok:correct});if(correct){s.run++;if(s.run===2){s.run=0;const nd=Math.max(.25,s.d/Math.SQRT2);if(s.dir===1)s.rev.push(s.d);s.dir=-1;s.d=nd}}else{s.run=0;const nd=Math.min(40,s.d*Math.SQRT2);if(s.dir===-1)s.rev.push(s.d);s.dir=1;s.d=nd}s.i++}
const S4_dlThresh=s=>{const r=s.rev.slice(-6);return r.length?Math.exp(r.reduce((a,v)=>a+Math.log(v),0)/r.length):null};
SCENE({id:'pitch-perception-discrimination',name:'How small a pitch change?',tag:'You are the listener',
 definition:'The frequency difference limen is the smallest change in frequency a listener can hear. It is measured with an adaptive staircase: the difference shrinks after correct answers and grows after mistakes, homing in on the threshold.',
 example:'Trained listeners can tell 1000 Hz from about 1002 Hz, a 0.2% change. Untrained listeners are often several times worse at first, and musicians better.',
 desc:'Two tones per trial, one 1000 Hz and one slightly higher, in a fixed random order. The staircase of differences is plotted with its reversals; the threshold estimate is compared with published values.',
 research:'Wier, Jesteadt & Green (1977). Frequency discrimination as a function of frequency and sensation level. JASA 61, 178–184 (about 0.2% near 1 kHz, trained listeners). · Micheyl, Delhommeau, Perrot & Oxenham (2006). Influence of musical and psychoacoustical training on pitch discrimination. Hearing Research 219, 36–47. · Levitt (1971), 2-down-1-up staircase.',
 dur:10,hint:'Press Play pair, then say which tone was higher. 24 trials. Use a quiet room and low volume. Not a hearing test; your results stay on this page.',
 init:()=>({seed:3,i:0,d:20,run:0,dir:0,rev:[],hist:[]}),
 watch(p){const s={seed:3,i:0,d:20,run:0,dir:0,rev:[],hist:[],sim:true};const n=Math.floor(p*S4_DL_N),r=S4_rng(55);for(let k=0;k<n;k++){const pc=.5+.5*(1-Math.exp(-Math.pow(s.d/3,1.5)));S4_dlNext(s,r()<pc)}return s},
 ui:[{b:'Play pair ▶',act:'play'},{b:'First was higher',act:'ans',arg:0},{b:'Second was higher',act:'ans',arg:1}],
 on:{play(s){if(s.i>=S4_DL_N)return;const hi=S4_dlTrial(s),f1=hi===0?S4_DL_F+s.d:S4_DL_F,f2=hi===1?S4_DL_F+s.d:S4_DL_F;AUDIO.tone(f1,{dur:.3,gain:.1,attack:.02,release:.04});AUDIO.tone(f2,{dur:.3,gain:.1,at:.6,attack:.02,release:.04})},
  ans(s,a){if(s.i>=S4_DL_N)return;S4_dlNext(s,Number(a)===S4_dlTrial(s))}},
 draw(s){
  const th=S4_dlThresh(s);let out=heading(s.i<S4_DL_N?`Trial ${s.i+1} of ${S4_DL_N}: difference now ${fmt(s.d)} Hz`:'Staircase finished',26);
  const pl=S4_plot(80,62,330,230,[0,S4_DL_N],[Math.log(.25),Math.log(40)],{xt:[[0,'0'],[12,'12'],[24,'24']],yt:[[.25,'0.25'],[1,'1'],[4,'4'],[16,'16 Hz']].map(([v,l])=>[Math.log(v),l]),xl:'trial',yl:'frequency difference'});out+=pl.svg;
  s.hist.forEach((h,k)=>out+=Ci(pl.X(k+.5),pl.Y(Math.log(h.d)),5,h.ok?C.green:C.coral));
  if(th)out+=L(pl.X(0),pl.Y(Math.log(th)),pl.X(S4_DL_N),pl.Y(Math.log(th)),C.blue,2,'stroke-dasharray="6 5"');
  out+=L(pl.X(0),pl.Y(Math.log(2)),pl.X(S4_DL_N),pl.Y(Math.log(2)),C.muted,1.5,'stroke-dasharray="2 4"')+TF(pl.X(S4_DL_N)-4,pl.Y(Math.log(2))+14,'trained ≈ 2 Hz',12,C.muted,'end');
  out+=R(428,80,152,190,'#fff',C.grid,10)+TB(504,104,s.sim?'Simulated':'Your estimate',14,C.ink);
  out+=TBF(504,140,th?`${fmt(th)} Hz`:'–',18,C.blue)+TF(504,162,th?`${fmt(th/10)}% of 1 kHz`:'needs reversals',12,C.muted);
  out+=TF(504,194,'green: correct',12,C.green)+TF(504,214,'coral: wrong',12,C.coral)+TF(504,240,`${s.rev.length} reversals`,12,C.muted);
  out+=T(300,356,th?`Your estimate ${fmt(th)} Hz · trained listeners about 2 Hz at 1 kHz`:'The difference shrinks after two correct answers and grows after a mistake',15,C.ink);
  return {svg:out,phase:th?'The estimate is the average of the last reversals, near where you are right about 71% of the time. Values of 3–10 Hz are common without practice; it improves quickly with training. Device and room noise matter.':'Answer even when you are unsure: guessing is part of the method.'};
 }});

const S4_TUNE=[0,0,7,7,9,9,7,5,5,4,4,2,2,0];
SCENE({id:'pitch-perception-melody',name:'Melodies at the top',tag:'Where musical pitch fades',
 definition:'Above about 4–5 kHz, tones are still heard and can be told apart, but they lose their musical quality: melodies become hard to recognise and octave judgements break down. This matches roughly where phase locking fades.',
 example:'A nursery tune played around 500 Hz is instantly familiar; moved up four octaves, near 8 kHz, many listeners struggle to name it even though every note is audible.',
 desc:'The same melody drawn on a log-frequency axis at the chosen octave shift, with the region where phase locking is strong shaded.',
 research:'Attneave & Olson (1971). Pitch as a medium: a new approach to psychophysical scaling. American Journal of Psychology 84, 147–166. · Ward (1954). Subjective musical pitch. JASA 26, 369–380. Recent work finds some listeners still hear melodies above 8 kHz (Lau, Mehta & Oxenham 2017, J. Neurosci. 37, 9013–9021).',
 dur:10,hint:'Play the tune, then shift it up octave by octave. Keep the volume low: high tones can be piercing.',
 init:()=>({oct:0}),
 watch(p){return {oct:Math.min(4,Math.floor(p*5))}},
 ui:[{range:'oct',label:'Shift up',min:0,max:4,step:1,get:s=>s.oct,act:'oct',show:v=>v+' octave'+(v===1?'':'s')},{b:'Play tune ▶',act:'play'}],
 on:{oct(s,v){s.oct=Number(v)},play(s){AUDIO.seq(S4_TUNE.map((m,i)=>({hz:midiHz(72+m+12*s.oct),at:i*.32,dur:.28})),{gain:s.oct>=3?.07:.11})}},
 draw(s){
  const base=midiHz(72+12*s.oct);let out=heading(`Melody starting at ${base>=1000?fmt(base/1000)+' kHz':Math.round(base)+' Hz'}`,26);
  const lx=f=>70+Math.log(f/200)/Math.log(80)*460,pl=S4_plot(70,64,460,220,[0,1],[0,1]);out+=pl.svg;
  out+=R(70,64,lx(4000)-70,220,C.greenp,'none',0)+TF(lx(4000)-6,82,'phase locking strong',12,C.green,'end');
  [[250,'250'],[500,'500'],[1000,'1k'],[2000,'2k'],[4000,'4k'],[8000,'8k'],[16000,'16k Hz']].forEach(([f,l])=>out+=L(lx(f),284,lx(f),290,C.line,1)+TF(lx(f),304,l,12,C.muted));
  S4_TUNE.forEach((m,i)=>{const f=midiHz(72+m+12*s.oct),x=lx(f),y=100+i*12.5;out+=R(x-6,y-4,12,8,f>5000?C.coral:C.blue,'none',3)});
  out+=TF(300,326,'frequency (log scale) · rows: notes in order',12,C.muted);
  out+=T(300,360,base>4500?'Still audible, but the tune is much harder to recognise':'Easy to recognise: a clear musical pitch',15,C.ink);
  return {svg:out,phase:base>4500?'Each note is heard and the steps up and down are still noticed, but naming the tune gets hard for most people. Not everyone: some listeners keep musical pitch higher, which is why the timing explanation is debated.':'In this range both place and timing codes are available and musical pitch is strong.'};
 }});

/* =========================== masking =========================== */
// Equivalent rectangular bandwidth (Glasberg & Moore 1990): ERB = 24.7 (4.37 F + 1), F in kHz. 132 Hz at 1 kHz.
const S4_erb=f=>24.7*(4.37*f/1000+1);
const S4_bwThresh=bw=>10*Math.log10(Math.min(bw,S4_erb(1000))/S4_erb(1000));
SCENE({id:'masking',name:'The critical band',tag:'Fletcher’s band-widening',
 definition:'Only noise near a tone’s frequency masks it. Widen a band of noise around a tone (keeping its level per hertz fixed) and the tone gets harder to hear, until the band reaches the critical bandwidth; beyond that, extra noise further away makes no difference.',
 example:'For a 1 kHz tone, noise bands up to about 130 Hz wide raise the threshold by 3 dB per doubling; bands of 200, 500 or 2000 Hz all mask it equally.',
 desc:'A frequency picture of a noise band around a 1 kHz tone with the auditory filter shown, and a graph of masked threshold against bandwidth that rises then flattens at the critical band.',
 research:'Fletcher (1940). Auditory patterns. Reviews of Modern Physics 12, 47–65. · Glasberg & Moore (1990). Derivation of auditory filter shapes from notched-noise data. Hearing Research 47, 103–138 (ERB 132 Hz at 1 kHz).',
 dur:10,hint:'Change the noise bandwidth and listen to noise alone, then noise with the 1 kHz tone. Keep the volume low.',
 init:()=>({bw:100}),
 watch(p){return {bw:Math.round(20*Math.pow(100,smooth(p)))}},
 ui:[{range:'bw',label:'Noise bandwidth',min:0,max:100,get:s=>Math.round(100*Math.log(s.bw/20)/Math.log(100)),act:'bw',show:v=>Math.round(20*Math.pow(100,v/100))+' Hz'},{b:'Noise alone',act:'n'},{b:'Noise + tone',act:'nt'}],
 on:{bw(s,v){s.bw=Math.round(20*Math.pow(100,Number(v)/100))},n(s){S4_band(1000,s.bw,{dur:1.2})},nt(s){S4_band(1000,s.bw,{dur:1.2,toneDb:-2})}},
 draw(s){
  const erb=S4_erb(1000),th=S4_bwThresh(s.bw);let out=heading(s.bw<erb?'Inside the critical band: wider noise masks more':'Wider than the critical band: no extra masking',26);
  const lx=f=>60+(f-0)/2200*240;out+=R(50,60,260,170,'#fff',C.grid,6);
  out+=R(lx(1000-s.bw/2),110,lx(1000+s.bw/2)-lx(1000-s.bw/2),100,'#9aa9b355','none',0);
  const filt=[];for(let i=0;i<=120;i++){const f=i/120*2200,g=Math.exp(-Math.pow((f-1000)/(erb*.75),2));filt.push([lx(f),210-g*110])}out+=S4_poly(filt,C.blue,2.2);
  out+=L(lx(1000),80,lx(1000),210,C.coral,3)+TF(lx(1000),74,'1 kHz tone',12,C.coral);
  out+=TF(180,226,'0',12,C.muted)+TF(60,226,'0',12,C.muted)+TF(lx(2000),226,'2 kHz',12,C.muted)+TF(180,250,'grey: noise band · blue: auditory filter',12,C.muted);
  const pl=S4_plot(350,64,220,200,[Math.log(20),Math.log(2000)],[-9,1],{xt:[[20,'20'],[200,'200'],[2000,'2000']].map(([v,l])=>[Math.log(v),l]),yt:[[-9,'−9'],[-6,'−6'],[-3,'−3'],[0,'0 dB']],xl:'bandwidth (Hz)',yl:'masked threshold'});out+=pl.svg;
  const c=[];for(let i=0;i<=60;i++){const b=20*Math.pow(100,i/60);c.push([pl.X(Math.log(b)),pl.Y(S4_bwThresh(b))])}out+=S4_poly(c,C.ink,2.2);
  out+=L(pl.X(Math.log(erb)),64,pl.X(Math.log(erb)),264,C.amber,1.5,'stroke-dasharray="4 4"')+TF(pl.X(Math.log(erb))-4,80,'critical band',12,C.amber,'end');
  out+=Ci(pl.X(Math.log(s.bw)),pl.Y(th),6,C.coral);
  out+=T(300,356,`Band ${s.bw} Hz · threshold ${fmt(th)} dB relative to its maximum · critical band ≈ ${Math.round(erb)} Hz`,15,C.ink);
  return {svg:out,phase:s.bw<erb?'All this noise passes through the same auditory filter as the tone, so more bandwidth means more masking.':'The extra noise falls outside the filter centred on the tone, so the ear simply ignores it when listening for the tone. The ear behaves like a bank of overlapping filters.'};
 }});

// Critical ratio: tone power ÷ noise power per Hz at masked threshold. About 18 dB at 1 kHz (Hawkins & Stevens 1950).
const S4_CR_TYP=18,S4_CR_N=24;
function S4_crTrial(s){return S4_rng(s.seed*131+s.i)()<.5?0:1}
function S4_crNext(s,ok){s.hist.push({db:s.db,ok});if(ok){s.run++;if(s.run===2){s.run=0;if(s.dir===1)s.rev.push(s.db);s.dir=-1;s.db=Math.max(0,s.db-2)}}else{s.run=0;if(s.dir===-1)s.rev.push(s.db);s.dir=1;s.db=Math.min(40,s.db+2)}s.i++}
const S4_crThresh=s=>{const r=s.rev.slice(-6);return r.length?r.reduce((a,b)=>a+b,0)/r.length:null};
SCENE({id:'masking-detect',name:'Find the tone in the noise',tag:'You are the listener',
 definition:'A two-interval detection test: two bursts of noise, only one with a faint 1 kHz tone. You say which. The tone level falls after two correct answers and rises after a mistake, homing in on your masked threshold.',
 example:'At threshold the tone’s power is about 18 dB above the noise power in one hertz: the critical ratio. That ratio is one of the oldest ways to estimate the width of the auditory filter.',
 desc:'A staircase of tone levels over 24 trials with the estimate from the last reversals, beside the typical critical ratio of about 18 dB at 1 kHz.',
 research:'Hawkins & Stevens (1950). The masking of pure tones and of speech by white noise. JASA 22, 6–13. · Fletcher (1940). Levels here are relative to your device’s noise, so comparisons are approximate.',
 dur:10,hint:'Press Play, then choose the interval that had the tone. Low volume, quiet room. Not a hearing test; your results stay on this page.',
 init:()=>({seed:6,i:0,db:30,run:0,dir:0,rev:[],hist:[]}),
 watch(p){const s={seed:6,i:0,db:30,run:0,dir:0,rev:[],hist:[],sim:true};const n=Math.floor(p*S4_CR_N),r=S4_rng(66);for(let k=0;k<n;k++){const pc=.5+.5/(1+Math.exp(-(s.db-S4_CR_TYP)/1.5));S4_crNext(s,r()<pc)}return s},
 ui:[{b:'Play ▶',act:'play'},{b:'Tone in 1st',act:'ans',arg:0},{b:'Tone in 2nd',act:'ans',arg:1}],
 on:{play(s){if(s.i>=S4_CR_N)return;const which=S4_crTrial(s),db=s.db;
  S4_play(1.5,(Lc,Rc,sr,n)=>{const z=S4_noise(n,s.seed*7+s.i),A=Math.sqrt(2*Math.pow(10,db/10)/(sr/2));for(let i=0;i<n;i++){const t=i/sr,inA=t>.05&&t<.6,inB=t>.9&&t<1.45;let v=0;
   if(inA||inB)v=z[i]*S4_gate(t,inA?.05:.9,inA?.6:1.45);
   const tw=which===0?[.15,.5]:[1,1.35];if(t>tw[0]&&t<tw[1])v+=A*Math.sin(2*Math.PI*1000*t)*Math.min(1,(t-tw[0])/.02,(tw[1]-t)/.02);Lc[i]=Rc[i]=v}},{gain:.12})},
  ans(s,a){if(s.i>=S4_CR_N)return;S4_crNext(s,Number(a)===S4_crTrial(s))}},
 draw(s){
  const th=S4_crThresh(s);let out=heading(s.i<S4_CR_N?`Trial ${s.i+1} of ${S4_CR_N}: tone ${s.db} dB above the noise per hertz`:'Finished',26);
  const pl=S4_plot(80,62,330,230,[0,S4_CR_N],[0,40],{xt:[[0,'0'],[12,'12'],[24,'24']],yt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40 dB']],xl:'trial',yl:'tone level re noise per Hz'});out+=pl.svg;
  out+=L(pl.X(0),pl.Y(S4_CR_TYP),pl.X(S4_CR_N),pl.Y(S4_CR_TYP),C.muted,1.5,'stroke-dasharray="2 4"')+TF(pl.X(S4_CR_N)-4,pl.Y(S4_CR_TYP)-6,'typical ≈ 18 dB',12,C.muted,'end');
  s.hist.forEach((h,k)=>out+=Ci(pl.X(k+.5),pl.Y(h.db),5,h.ok?C.green:C.coral));
  if(th!==null)out+=L(pl.X(0),pl.Y(th),pl.X(S4_CR_N),pl.Y(th),C.blue,2,'stroke-dasharray="6 5"');
  out+=R(428,80,152,190,'#fff',C.grid,10)+TB(504,104,s.sim?'Simulated':'Your estimate',14,C.ink)+TBF(504,140,th!==null?`${fmt(th)} dB`:'–',18,C.blue)+TF(504,162,'critical ratio',12,C.muted);
  out+=TF(504,196,'green: correct',12,C.green)+TF(504,216,'coral: wrong',12,C.coral)+TF(504,242,`${s.rev.length} reversals`,12,C.muted);
  out+=T(300,356,th!==null?`Your estimate ${fmt(th)} dB · typical about 18 dB at 1 kHz`:'Start loud, then the tone gets fainter as you succeed',15,C.ink);
  return {svg:out,phase:th!==null?'The estimate is the average of your last reversals. If your noise is quieter than the room, or your device filters it, your number will differ from the lab value; the method is what matters.':'Each trial has two noise bursts. The tone is in only one; guessing gives 50%.'};
 }});

// Masking pattern of a narrowband masker at 1 kHz (illustrative roex-like skirts; upper skirt flattens with level).
function S4_maskPat(f,Lm){const oct=Math.log2(f/1000),floor=5;if(oct<0)return Math.max(floor,Lm-15+oct*45*1);const up=Math.max(12,30-.35*(Lm-40));return Math.max(floor,Lm-15-oct*up)}
SCENE({id:'masking-spread',name:'Masking spreads upwards',tag:'The upward spread of masking',
 definition:'A sound masks frequencies above it far more than frequencies below it, and the spread upwards grows as the masker gets louder. This asymmetry comes from the shape of the travelling wave in the cochlea.',
 example:'A loud 1 kHz sound can hide a 2 kHz tone, but barely affects a 500 Hz tone. Bass-heavy noise, such as traffic, hides more of speech than you might expect.',
 desc:'Masked threshold of a probe against its frequency (log axis) for a 1 kHz masker at the chosen level. The curve falls steeply below the masker and gently above it, more gently at high levels. Values illustrative.',
 research:'Wegel & Lane (1924). The auditory masking of one pure tone by another and its probable relation to the dynamics of the inner ear. Physical Review 23, 266–285. · Egan & Hake (1950). On the masking pattern of a simple auditory stimulus. JASA 22, 622–630.',
 dur:10,hint:'Raise the masker level and watch the upper skirt spread. Play the masker with a probe below and above. Keep the volume low.',
 init:()=>({lm:70,probe:2000}),
 watch(p){return {lm:Math.round(40+40*smooth(p)),probe:2000}},
 ui:[{range:'lm',label:'Masker level',min:40,max:80,step:5,get:s=>s.lm,act:'lm',show:v=>v+' dB'},{choose:[[500,'probe 500 Hz'],[1400,'1.4 kHz'],[2000,'2 kHz'],[3000,'3 kHz']],label:'Probe',get:s=>s.probe,act:'probe'},{b:'Masker + probe',act:'play'}],
 on:{lm(s,v){s.lm=Number(v)},probe(s,v){s.probe=Number(v)},play(s){S4_band(1000,80,{dur:1.3,toneDb:-12,toneF:s.probe,gain:.12})}},
 draw(s){
  let out=heading(`Masker ${s.lm} dB at 1 kHz: what it hides`,26);
  const lx=f=>Math.log2(f/250)/Math.log2(32),pl=S4_plot(80,62,440,230,[0,1],[0,80],{xt:[[250,'250'],[500,'500'],[1000,'1k'],[2000,'2k'],[4000,'4k'],[8000,'8k Hz']].map(([f,l])=>[lx(f),l]),yt:[[0,'0'],[20,'20'],[40,'40'],[60,'60'],[80,'80 dB']],xl:'probe frequency (log scale)',yl:'masked threshold'});out+=pl.svg;
  const c=[];for(let i=0;i<=100;i++){const f=250*Math.pow(32,i/100);c.push([pl.X(i/100),pl.Y(S4_maskPat(f,s.lm))])}
  out+=P(`M${pl.X(0)} ${pl.Y(0)}`+c.map(p=>`L${fmt(p[0])} ${fmt(p[1])}`).join('')+`L${pl.X(1)} ${pl.Y(0)}Z`,'none',0,C.coralp)+S4_poly(c,C.coral,2.4);
  out+=L(pl.X(lx(1000)),pl.Y(0),pl.X(lx(1000)),pl.Y(s.lm),C.ink,3)+TF(pl.X(lx(1000)),pl.Y(s.lm)-8,'masker',12,C.ink);
  const pt=S4_maskPat(s.probe,s.lm);out+=Ci(pl.X(lx(s.probe)),pl.Y(pt),7,C.blue,'#fff')+TF(pl.X(lx(s.probe)),pl.Y(pt)-12,`${Math.round(pt)} dB`,12,C.blue);
  out+=T(300,356,`A ${s.probe>=1000?fmt(s.probe/1000)+' kHz':s.probe+' Hz'} probe needs about ${Math.round(pt)} dB to be heard`,15,C.ink);
  return {svg:out,phase:s.probe>1000?'Above the masker the curve falls slowly, and more slowly still at high levels: loud low sounds spread their masking far upwards. Shaded area: frequencies hidden at those levels. Values illustrative.':'Below the masker the curve drops steeply, so lower frequencies escape most masking.'};
 }});

/* =========================== hearing-in-noise =========================== */
// Binaural masking level difference: tone in noise with the noise identical at both ears (N0). Inverting the
// tone at one ear (Sπ) lowers the threshold by about 12–15 dB at 500 Hz, about 3 dB at 4 kHz (approximate).
const S4_BMLD=[[250,13],[500,14],[1000,10],[2000,4],[4000,3]];
SCENE({id:'hearing-in-noise',name:'Two ears beat noise',tag:'The binaural masking level difference',
 definition:'The binaural masking level difference: a tone hidden in noise becomes much easier to hear if, with the noise identical in both ears, the tone is flipped upside down in one ear. The brain compares the ears and cancels what they share.',
 example:'At 500 Hz, flipping the tone in one ear lets you hear it at a level about 12–15 dB lower: roughly a twentieth of the power.',
 desc:'The two ears’ waveforms for noise plus tone, with the tone in phase (N0S0) or inverted at one ear (N0Sπ), and a bar chart of the release from masking by frequency (approximate).',
 research:'Hirsh (1948). The influence of interaural phase on interaural summation and inhibition. JASA 20, 536–544. · Licklider (1948). The influence of interaural phase relations upon the masking of speech by white noise. JASA 20, 150–159. · Durlach (1963). Equalization and cancellation theory of binaural masking-level differences. JASA 35, 1206–1218.',
 dur:10,hint:'Headphones needed. Set the tone level so it is just inaudible in N0S0, then switch to N0Sπ at the same level and listen again. Keep the volume low.',
 init:()=>({ph:'pi',db:-14}),
 watch(p){return {ph:p<.5?'same':'pi',db:-14}},
 ui:[{choose:[['same','N0S0: tone same in both ears'],['pi','N0Sπ: tone flipped in one ear']],label:'Condition',get:s=>s.ph,act:'ph'},{range:'db',label:'Tone level',min:-30,max:0,step:2,get:s=>s.db,act:'db',show:v=>v+' dB'},{b:'Play (headphones)',act:'play'}],
 on:{ph(s,v){s.ph=v},db(s,v){s.db=Number(v)},play(s){const inv=s.ph==='pi',db=s.db;
  S4_play(1.6,(Lc,Rc,sr,n)=>{const z=S4_noise(n,21);let lp=0;const a=Math.pow(10,db/20)*1.2;for(let i=0;i<n;i++){const t=i/sr;lp+=.25*(z[i]-lp);const tn=(t>.4&&t<1.2)?a*Math.sin(2*Math.PI*500*t)*Math.min(1,(t-.4)/.03,(1.2-t)/.03):0;Lc[i]=lp+tn;Rc[i]=lp+(inv?-tn:tn)}},{gain:.13})}},
 draw(s){
  const inv=s.ph==='pi';let out=heading(inv?'Tone flipped in one ear: it stands out from the noise':'Same tone in both ears: hidden in the noise',26);
  const r=S4_rng(3),nz=range(120).map(()=>S4_gauss(r)*.35);
  [[0,'left ear',false],[1,'right ear',inv]].forEach(([k,lab,flip])=>{const y0=90+k*90;out+=R(40,y0-34,280,68,'#fff',C.grid,6)+TF(48,y0-38,lab,12,C.muted,'start');
   const nzp=[],tp=[];for(let i=0;i<120;i++){const x=46+i*2.25,tone=Math.sin(i/120*2*Math.PI*4)*(flip?-1:1);nzp.push([x,y0-nz[i]*26]);tp.push([x,y0-tone*14])}
   out+=S4_poly(nzp,C.muted,1.2)+S4_poly(tp,flip?C.coral:C.blue,2.2)});
  out+=TF(180,224,'grey: noise (identical) · colour: the 500 Hz tone',12,C.muted);
  const pl=S4_plot(370,70,200,200,[0,5],[0,16],{yt:[[0,'0'],[5,'5'],[10,'10'],[15,'15 dB']],yl:'release (N0Sπ)'});out+=pl.svg;
  S4_BMLD.forEach(([f,d],i)=>{out+=R(pl.X(i+.15),pl.Y(d),pl.X(.7)-pl.X(0),pl.Y(0)-pl.Y(d),f===500?C.coral:C.blue,'none',3)+TF(pl.X(i+.5),288,f>=1000?f/1000+'k':String(f),12,C.muted)});
  out+=TF(470,306,'frequency (Hz), approximate',12,C.muted);
  out+=T(300,356,inv?`At ${s.db} dB the flipped tone is often audible when the in-phase one was not`:`At ${s.db} dB the tone sits under the noise in both ears`,15,C.ink);
  return {svg:out,phase:inv?'The noise is the same in both ears, the tone is not. A brain that subtracts one ear from the other cancels the noise and keeps the tone. This works best at low frequencies, where nerve timing is precise.':'With everything identical in the two ears, comparing them helps nothing: the tone must beat the noise on level alone.'};
 }});

// Spatial release from masking for speech with one masker, illustrative after Bronkhorst (2000): up to ≈ 8 dB at 90°.
const S4_srm=deg=>8*Math.sin(clamp(deg,0,90)*Math.PI/180);
const S4_intel=(snr,srt)=>100*S4_logistic(snr,srt,.55);
SCENE({id:'hearing-in-noise-spatial',name:'Moving the noise aside',tag:'Spatial release from masking',
 definition:'Speech is easier to follow when the competing sound comes from a different direction. Part of the benefit is the head shadow (the better ear has a better signal-to-noise ratio), part is binaural comparison, as in the masking level difference.',
 example:'With one talker in front and noise also in front, about half the words are understood at −6 dB. Move the noise to the side and the same 50% point drops by several decibels, worth a large gain in words.',
 desc:'A head from above with the target talker ahead and a noise source on an arc; an intelligibility curve against signal-to-noise ratio shifts left as the noise moves to the side. Values illustrative.',
 research:'Bronkhorst (2000). The cocktail party phenomenon: a review of research on speech intelligibility in multiple-talker conditions. Acustica 86, 117–128. · Hawley, Litovsky & Culling (2004). The benefit of binaural hearing in a cocktail party. JASA 115, 833–843. · Cherry (1953). JASA 25, 975–979.',
 dur:10,hint:'Move the noise around the head and change the signal-to-noise ratio. Watch the share of words understood.',
 init:()=>({az:0,snr:-6}),
 watch(p){return {az:Math.round(90*smooth(p)),snr:-6}},
 ui:[{range:'az',label:'Noise direction',min:0,max:90,step:5,get:s=>s.az,act:'az',show:v=>v===0?'ahead':v+'° to the side'},{range:'snr',label:'Signal-to-noise',min:-15,max:5,step:1,get:s=>s.snr,act:'snr',show:v=>v+' dB'}],
 on:{az(s,v){s.az=Number(v)},snr(s,v){s.snr=Number(v)}},
 draw(s){
  const srt=-6-S4_srm(s.az),pc=S4_intel(s.snr,srt);let out=heading(`Noise ${s.az?s.az+'° to the side':'ahead'}: ${Math.round(pc)}% of words understood`,26);
  out+=S4_head(150,220,38,null);const t=(s.az-90)*Math.PI/180;
  out+=Ci(150,92,12,C.blue)+TF(150,72,'talker',12,C.blue)+Ci(150+Math.cos(t)*112,220+Math.sin(t)*112,12,C.coral)+TF(150+Math.cos(t)*112,220+Math.sin(t)*112-18,'noise',12,C.coral);
  const pl=S4_plot(320,62,250,220,[-15,5],[0,100],{xt:[[-15,'−15'],[-10,'−10'],[-5,'−5'],[0,'0'],[5,'5 dB']],yt:[[0,'0'],[50,'50'],[100,'100%']],xl:'signal-to-noise ratio',yl:'words understood'});out+=pl.svg;
  const c0=[],c1=[];for(let i=0;i<=60;i++){const x=-15+i/3;c0.push([pl.X(x),pl.Y(S4_intel(x,-6))]);c1.push([pl.X(x),pl.Y(S4_intel(x,srt))])}
  out+=S4_poly(c0,C.muted,2,'stroke-dasharray="6 5"')+S4_poly(c1,C.blue,2.4)+Ci(pl.X(s.snr),pl.Y(pc),7,C.coral,'#fff');
  out+=TF(pl.X(4.5),pl.Y(30),'grey: noise ahead',12,C.muted,'end');
  out+=T(300,356,`Release from masking ≈ ${fmt(S4_srm(s.az))} dB · 50% point at ${fmt(srt)} dB`,15,C.ink);
  return {svg:out,phase:s.az?'With the noise to one side, the far ear is shaded from it and the brain can compare the ears, so the same words survive at a worse signal-to-noise ratio. Each decibel on this steep curve is worth many words. Values illustrative.':'With talker and noise in the same place, the two ears get the same mixture and binaural hearing cannot help.'};
 }});

// Plomp (1978): hearing loss = attenuation (fixed by amplification) + distortion (raises the SRT in noise).
// Illustrative split: distortion D = HL / 4 dB; a directional hearing aid adds ≈ 4 dB in noise.
const S4_NOISE=[['quiet','Quiet room'],['cafe','Café (≈ 65 dB)'],['pub','Busy pub (≈ 75 dB)']];
SCENE({id:'hearing-in-noise-loss',name:'Why noise is hardest',tag:'Plomp’s attenuation and distortion',
 definition:'Hearing loss has two parts: attenuation, which makes everything quieter and is largely fixed by amplification, and distortion, which blurs sounds and raises the signal-to-noise ratio needed in noise. Hearing aids restore quiet listening much better than noisy listening.',
 example:'Someone with a moderate loss may follow speech in a quiet room with an aid, yet still need the talker several decibels louder than others need in a busy pub, because amplification also amplifies the noise.',
 desc:'Bars of words understood for normal hearing and for the chosen hearing loss, with and without a hearing aid, in quiet or in noise. A simplified model, values illustrative.',
 research:'Plomp (1978). Auditory handicap of hearing impairment and the limited benefit of hearing aids. JASA 63, 533–549. · Plomp (1986). A signal-to-noise ratio model for the speech-reception threshold of the hearing impaired. J. Speech Hear. Res. 29, 146–154. Directional microphones typically add a few dB in noise.',
 dur:10,hint:'Change the hearing loss, switch the aid on and off, and compare quiet with noise.',
 init:()=>({hl:40,aid:1,env:'pub'}),
 watch(p){return {hl:40,aid:p<.5?0:1,env:p<.25||(p>=.5&&p<.75)?'quiet':'pub'}},
 ui:[{range:'hl',label:'Hearing loss',min:0,max:60,step:5,get:s=>s.hl,act:'hl',show:v=>v+' dB'},{choose:[[0,'No aid'],[1,'Hearing aid']],label:'Aid',get:s=>s.aid,act:'aid'},{choose:S4_NOISE,label:'Place',get:s=>s.env,act:'env'}],
 on:{hl(s,v){s.hl=Number(v)},aid(s,v){s.aid=Number(v)},env(s,v){s.env=v}},
 draw(s){
  const speech=62,noise={quiet:0,cafe:65,pub:75}[s.env],snr=noise?speech+ (s.env==='pub'?3:0)-noise:30;
  const words=(hl,aid)=>{const audib=speech+(aid?Math.min(hl,30):0)-(20+hl);const qi=100*S4_logistic(audib,0,.35);if(!noise)return qi;const srt=-6+hl/4-(aid?4:0);return Math.min(qi,S4_intel(snr,srt))};
  const nh=words(0,0),me=words(s.hl,s.aid);
  let out=heading(`${S4_NOISE.find(n=>n[0]===s.env)[1]}: ${Math.round(me)}% of words with ${s.hl} dB loss${s.aid?' and an aid':''}`,26);
  const pl=S4_plot(90,62,420,220,[0,3],[0,100],{yt:[[0,'0'],[50,'50'],[100,'100%']],yl:'words understood'});out+=pl.svg;
  [[nh,'normal hearing',C.green],[words(s.hl,0),`${s.hl} dB loss, no aid`,C.coral],[words(s.hl,1),`${s.hl} dB loss, aid`,C.blue]].forEach(([v,l,col],i)=>{out+=R(pl.X(i+.2),pl.Y(v),pl.X(.6)-pl.X(0),pl.Y(0)-pl.Y(v),col,'none',4)+TF(pl.X(i+.5),pl.Y(v)-8,Math.round(v)+'%',13,col)+TF(pl.X(i+.5),300,l,12,C.muted)});
  out+=T(300,356,noise?`Signal-to-noise ${snr} dB: the aid helps less here than in quiet`:'In quiet, amplification restores most of what was lost',15,C.ink);
  return {svg:out,phase:noise?'Amplifying speech also amplifies the noise, so the signal-to-noise ratio barely changes. The distortion part of the loss still demands a better ratio than normal ears need; directional microphones claw back a few decibels. Values illustrative.':'In quiet the main problem is audibility, and gain fixes most of it.'};
 }});
