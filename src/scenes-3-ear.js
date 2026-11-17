/* ===================== Senses In Motion · Era 3 · The ear ===================== */
// Outer and middle ear, the cochlea, hair cells, the range of hearing, hearing loss and cochlear implants.
// All sound plays only from on-handlers (Try it buttons). Volumes are gentle and capped.

/* ---- shared helpers ---- */
const S3_fstr=f=>f>=1000?fmt(Math.round(f/100)/10)+' kHz':Math.round(f)+' Hz';
const S3_logx=(f,x0,w,f0=20,f1=20000)=>x0+w*Math.log(f/f0)/Math.log(f1/f0);
const S3_sliderF=v=>Math.round(50*Math.pow(320,v/100));            // 0..100 -> 50 Hz..16 kHz
const S3_sliderV=f=>Math.round(100*Math.log(f/50)/Math.log(320));
// Greenwood (1990) human place–frequency map: x = fraction of length from the apex (0) to the base (1).
const S3_greenF=x=>165.4*(Math.pow(10,2.1*x)-.88);
const S3_greenX=f=>clamp(Math.log10(f/165.4+.88)/2.1,0,1);
// Terhardt (1979) approximation to the threshold of hearing for young adults, dB SPL.
const S3_terh=f=>{const k=f/1000;return 3.64*Math.pow(k,-.8)-6.5*Math.exp(-.6*Math.pow(k-3.3,2))+1e-3*Math.pow(k,4)};
// Approximate median age-related loss (shape after ISO 7029): loss = a(f)·(age−18)² dB. Illustrative.
const S3_AGEA=[[125,.003],[250,.003],[500,.0035],[1000,.004],[2000,.007],[4000,.016],[8000,.022],[16000,.03]];
function S3_ageLoss(f,age){if(age<=18)return 0;let a=S3_AGEA[S3_AGEA.length-1][1];
 for(let i=0;i<S3_AGEA.length-1;i++){const [f0,a0]=S3_AGEA[i],[f1,a1]=S3_AGEA[i+1];if(f<=f0){a=a0;break}if(f<=f1){const u=Math.log(f/f0)/Math.log(f1/f0);a=a0+(a1-a0)*u;break}}
 return a*Math.pow(age-18,2)}
// Log-frequency axis with labelled ticks.
function S3_faxis(x0,y,w,f0,f1,ticks){let out=L(x0,y,x0+w,y,C.line,1.5);for(const f of ticks){const x=S3_logx(f,x0,w,f0,f1);out+=L(x,y,x,y+6,C.line,1.4)+TF(x,y+20,f>=1000?f/1000+'k':String(f),12,C.muted)}return out}
const S3_note=(s,y=356)=>TF(300,y,s,12,C.muted);

/* ===================== Lesson: outer-middle-ear ===================== */
// Specific acoustic impedances (rayl): air ≈ 415, water ≈ 1.48 million. Intensity transmission T = 4Z1Z2/(Z1+Z2)².
const S3_ZA=415,S3_ZW=1.48e6,S3_T=4*S3_ZA*S3_ZW/Math.pow(S3_ZA+S3_ZW,2),S3_TdB=10*Math.log10(S3_T);
SCENE({id:'outer-middle-ear',name:'Why we need a middle ear',tag:'Matching air to fluid',
 definition:'The inner ear is filled with fluid, and sound in air mostly bounces off water: only about 0.1% of the energy gets in, a loss of about 30 dB. The middle ear wins most of it back by concentrating the force from the large eardrum onto the tiny stirrup footplate, helped by the lever of the ossicles.',
 example:'With an eardrum about 17 times the area of the footplate and a lever of about 1.3, pressure rises about 22 times, roughly 27 dB, which is nearly the whole 30 dB lost at an air–water boundary.',
 desc:'Two bars: the sound lost at a bare air-to-fluid boundary and the pressure gain from the eardrum-to-footplate area ratio and the ossicle lever, with the net result.',
 research:'Helmholtz (1868) on the ossicles as a lever. · von Békésy (1960). Experiments in Hearing. · Aibara et al. (2001). Human middle-ear sound transfer function. Hearing Research 152 (measured gain about 20 dB near 1 kHz, falling at high and low frequencies).',
 dur:10,hint:'Change the area ratio and the lever, or switch the middle ear off, to see how much of the 30 dB loss is recovered. These are ideal-transformer numbers; measured gain is lower and depends on frequency.',
 init:()=>({area:17,lever:1.3,on:1}),
 watch(p){return {area:Math.round(lerp(1,17,smooth(clamp(p*1.6,0,1)))),lever:1.3,on:p<.08?0:1}},
 ui:[{choose:[[1,'Middle ear on'],[0,'Off']],label:'Middle ear',get:s=>s.on,act:'on'},
  {range:'area',label:'Eardrum ÷ footplate area',min:1,max:25,get:s=>s.area,act:'area',show:v=>v+'×'},
  {range:'lever',label:'Ossicle lever',min:10,max:20,get:s=>Math.round(s.lever*10),act:'lever',show:v=>fmt(v/10)+'×'}],
 on:{on(s,v){s.on=+v},area(s,v){s.area=+v},lever(s,v){s.lever=v/10}},
 draw(s){
  const G=s.on?s.area*s.lever:1,gdB=20*Math.log10(G),net=S3_TdB+gdB;
  let out=heading(s.on?`Middle ear gain ${fmt(Math.round(gdB*10)/10)} dB · net ${fmt(Math.round(net*10)/10)} dB`:'No middle ear: about 30 dB of sound is lost');
  // picture: eardrum (large) -> ossicles -> footplate (small) -> fluid
  out+=`<ellipse cx="96" cy="140" rx="14" ry="56" fill="${C.pale}" stroke="${C.blue}" stroke-width="3"/>`+TF(96,214,'eardrum',12,C.muted);
  if(s.on){out+=Ci(140,118,13,C.amberp,C.amber)+Ci(172,128,10,C.amberp,C.amber)+R(194,128,26,22,C.amberp,C.amber,5)+L(110,118,127,118,C.amber,4)+L(153,122,162,126,C.amber,4)+L(182,132,194,136,C.amber,4)+TF(160,166,'ossicles',12,C.muted)}
  const fh=Math.max(6,56*2/Math.sqrt(s.area));out+=R(224,140-fh/2,7,fh,C.amber,'none',2)+TF(228,214,'footplate',12,C.muted);
  out+=R(236,92,48,96,'#dceef9',C.blue,6)+TF(260,214,'fluid',12,C.muted);
  for(let i=0;i<4;i++)out+=P(`M${20+i*14} 110Q${28+i*14} 140 ${20+i*14} 170`,C.blue,1.6);
  // bars
  const x0=330,z=170,sc=3.2;out+=L(x0,z,580,z,C.line,1.5)+TF(x0-6,z+4,'0 dB',12,C.muted,'end');
  const bar=(x,v,col,lab)=>R(x,v<0?z:z-v*sc,56,Math.abs(v)*sc,col,'none',4)+TF(x+28,v<0?z+Math.abs(v)*sc+16:z-v*sc-8,(v>0?'+':'')+fmt(Math.round(v*10)/10),13,col,'middle','font-weight="700"')+TF(x+28,lab[2]||300,lab[0],12,C.muted)+TF(x+28,(lab[2]||300)+15,lab[1],12,C.muted);
  out+=bar(x0+8,S3_TdB,C.coral,['air → fluid','loss',308]);
  out+=bar(x0+88,gdB,C.green,['middle-ear','gain',308]);
  out+=bar(x0+168,net,net>-6?C.blue:C.coral,['what','remains',308]);
  out+=TF(455,52,`Only ${fmt(Math.round(S3_T*10000)/100)}% of sound energy`,13,C.ink)+TF(455,70,'crosses bare air into water.',13,C.ink);
  out+=S3_note('Ideal values. Real middle ears give about 20 dB near 1 kHz, less elsewhere.',352);
  return {svg:out,phase:s.on?`Area ratio ${s.area}× and lever ${fmt(s.lever)}× multiply the pressure ${fmt(Math.round(G*10)/10)} times, ${fmt(Math.round(gdB*10)/10)} dB, against a ${fmt(Math.round(-S3_TdB*10)/10)} dB loss. Without this transformer we would hear the world as if underwater.`:'With no middle ear the sound meets the fluid directly and only about one thousandth of its energy gets in. People whose ossicles are fixed (otosclerosis) lose roughly this much.'};
 }});

SCENE({id:'outer-middle-ear-canal',name:'The ear canal resonates',tag:'A tube closed at one end',
 definition:'The ear canal is a tube about 2.5 cm long, open at the outside and closed by the eardrum. Like an organ pipe closed at one end, it resonates at the frequency whose quarter-wavelength fits its length, boosting sounds near 3 kHz by roughly 10 to 15 dB.',
 example:'With c = 343 m/s and L = 2.5 cm, the resonance is 343 ÷ (4 × 0.025) ≈ 3,400 Hz, close to where human hearing is most sensitive.',
 desc:'A tube closed at the eardrum with the pressure of a quarter-wave standing wave drawn inside it, and a gain curve with its peak at c/4L.',
 research:'Shaw (1974). Transformation of sound pressure level from the free field to the eardrum in the horizontal plane. JASA 56, 1848–1861. · Wiener & Ross (1946). The pressure distribution in the auditory canal. JASA 18.',
 dur:9,hint:'Change the canal length and watch the resonance move. Play compares a 1 kHz tone with one at the resonance, at the same level from your device.',
 init:()=>({len:25}),
 watch(p){return {len:Math.round(lerp(18,32,.5-.5*Math.cos(p*2*Math.PI)))}},
 ui:[{range:'len',label:'Canal length',min:15,max:35,get:s=>s.len,act:'len',show:v=>fmt(v/10)+' cm'},{b:'Play 1 kHz, then resonance ▶',act:'play'}],
 on:{len(s,v){s.len=+v},play(s){const f=343/(4*s.len/1000);AUDIO.tone(1000,{dur:.7,gain:.07,attack:.03});AUDIO.tone(f,{dur:.7,gain:.07,attack:.03,at:.9})}},
 draw(s){
  const Lm=s.len/1000,f=343/(4*Lm);let out=heading(`Resonance at ${S3_fstr(f)}`);
  const x0=60,len=40+s.len*8,yc=118;
  out+=R(x0,yc-28,len,56,'#f7efe6',C.amber,6)+L(x0+len,yc-34,x0+len,yc+34,C.blue,5)+TF(x0+len+8,yc+4,'eardrum (closed end)',12,C.blue,'start')+TF(x0,yc-38,'open end',12,C.muted,'start');
  let d='';for(let i=0;i<=60;i++){const u=i/60,x=x0+u*len,amp=Math.sin(u*Math.PI/2);d+=(i?'L':'M')+fmt(x)+' '+fmt(yc-amp*22)}out+=P(d,C.coral,2.4);
  d='';for(let i=0;i<=60;i++){const u=i/60,x=x0+u*len,amp=Math.sin(u*Math.PI/2);d+=(i?'L':'M')+fmt(x)+' '+fmt(yc+amp*22)}out+=P(d,C.coral,2.4,'none','stroke-dasharray="4 3"');
  out+=TF(x0+len/2,yc+46,'pressure swing: none at the opening, largest at the eardrum',12,C.coral);
  // gain curve (illustrative resonance shape, peak about 12 dB)
  const gx=60,gw=480,gy=320,gh=120,f0=200,f1=16000;out+=S3_faxis(gx,gy,gw,f0,f1,[200,500,1000,2000,5000,10000]);
  out+=L(gx,gy,gx,gy-gh,C.line,1.5)+TF(gx-6,gy-gh+4,'+15',12,C.muted,'end')+TF(gx-6,gy+4,'0',12,C.muted,'end')+TF(gx+4,gy-gh-8,'canal gain, dB (illustrative shape)',12,C.muted,'start');
  d='';for(let i=0;i<=120;i++){const ff=f0*Math.pow(f1/f0,i/120),r=ff/f,g=12/(1+Math.pow((r-1/r)*1.6,2));d+=(i?'L':'M')+fmt(S3_logx(ff,gx,gw,f0,f1))+' '+fmt(gy-g*gh/15)}
  out+=P(d,C.blue,2.6);const xp=S3_logx(f,gx,gw,f0,f1);out+=L(xp,gy,xp,gy-gh*.8,C.coral,1.5,'stroke-dasharray="4 3"')+TF(xp,gy-gh*.8-8,`c ÷ 4L = ${S3_fstr(f)}`,13,C.coral,'middle','font-weight="700"');
  return {svg:out,phase:`A ${fmt(s.len/10)} cm canal fits a quarter of a ${fmt(Math.round(4*Lm*1000)/10)} cm wave, so it rings at about ${S3_fstr(f)}. Longer canals ring lower. The boost of roughly 10–15 dB is one reason hearing is most sensitive between 2 and 5 kHz.`};
 }});

SCENE({id:'outer-middle-ear-reflex',name:'The acoustic reflex',tag:'A slow muscle, not a fuse',
 definition:'When a sound is loud, the tiny stapedius muscle tightens the stirrup and stiffens the middle ear, cutting low-frequency transmission by up to about 15 dB. It also tightens when you speak.',
 example:'A loud sustained noise triggers it in about 25–150 ms. A gunshot rises in under a millisecond, so the reflex is far too slow to protect against it.',
 desc:'Left: attenuation against sound level, flat until the reflex threshold, then rising. Right: a timeline comparing a sound’s onset with the reflex delay.',
 research:'Borg & Counter (1989). The middle-ear muscles. Scientific American 261(2), 74–80. · Møller (1974). The acoustic middle-ear muscle reflex. In Handbook of Sensory Physiology V/1. (Thresholds and attenuation are approximate.)',
 dur:9,hint:'Raise the sound level past the reflex threshold, then switch between a steady noise and a gunshot to see why the reflex cannot protect against sudden impulses.',
 init:()=>({lev:95,kind:'steady'}),
 watch(p){return {lev:Math.round(lerp(60,115,p)),kind:p<.6?'steady':'shot'}},
 ui:[{range:'lev',label:'Sound level',min:50,max:120,get:s=>s.lev,act:'lev',show:v=>v+' dB SPL'},{choose:[['steady','Steady noise'],['shot','Gunshot']],label:'Sound',get:s=>s.kind,act:'kind'}],
 on:{lev(s,v){s.lev=+v},kind(s,v){s.kind=v}},
 draw(s){
  const thr=85,att=clamp((s.lev-thr)*.5,0,15);let out=heading(s.lev>thr?`Reflex on: about ${fmt(Math.round(att))} dB less at low frequencies`:'Below the reflex threshold');
  const x0=50,y0=300,w=220,h=200;out+=L(x0,y0,x0+w,y0,C.line,1.5)+L(x0,y0,x0,y0-h,C.line,1.5);
  for(const v of [60,80,100,120]){const x=x0+(v-50)/70*w;out+=L(x,y0,x,y0+5,C.line,1.2)+TF(x,y0+19,v,12,C.muted)}
  for(const v of [0,5,10,15]){const y=y0-v/16*h;out+=TF(x0-6,y+4,v,12,C.muted,'end')}
  out+=TF(x0+w/2,y0+36,'sound level, dB SPL',12,C.muted)+TF(x0,y0-h-10,'attenuation, dB',12,C.muted,'start');
  let d='';for(let v=50;v<=120;v++){const a=clamp((v-thr)*.5,0,15);d+=(v>50?'L':'M')+fmt(x0+(v-50)/70*w)+' '+fmt(y0-a/16*h)}out+=P(d,C.blue,2.6);
  const xm=x0+(s.lev-50)/70*w;out+=Ci(xm,y0-att/16*h,6,C.coral)+L(x0+(thr-50)/70*w,y0,x0+(thr-50)/70*w,y0-h,C.amber,1.2,'stroke-dasharray="4 3"')+TF(x0+(thr-50)/70*w+4,y0-h+12,'≈ threshold',12,C.amber,'start');
  // timeline
  const tx=330,tw=240,ty=170,ms=200,X=t=>tx+t/ms*tw;out+=TB(450,72,'First 200 ms',14,C.ink)+L(tx,ty,tx+tw,ty,C.line,1.5);
  for(const t of [0,50,100,150,200]){out+=L(X(t),ty,X(t),ty+5,C.line,1.2)+TF(X(t),ty+19,t+' ms',12,C.muted)}
  if(s.kind==='shot'){out+=R(X(0),ty-80,3,80,C.coral,'none',1)+TF(X(0)+6,ty-70,'peak in < 1 ms',12,C.coral,'start')}
  else{out+=R(X(0),ty-60,tw,60,C.coralp,'none',2)+TF(X(0)+6,ty-46,'steady noise',12,C.coral,'start')}
  if(s.lev>thr){out+=R(X(25),ty-100,X(150)-X(25),12,C.blue,'none',4)+TF(X(87),ty-106,'reflex starts: 25–150 ms',12,C.blue)}
  else out+=TF(450,ty-96,'no reflex at this level',12,C.muted);
  out+=R(310,214,272,88,'#fff',C.grid,10)+TF(446,238,s.kind==='shot'?'The impulse is over before the':'For a steady noise the reflex',13,C.ink)+TF(446,256,s.kind==='shot'?'muscle moves: no protection.':'helps, mostly below about 1 kHz.',13,C.ink)+TF(446,280,'Earplugs are the real protection.',13,C.green,'middle','font-weight="700"');
  return {svg:out,phase:s.lev>thr?(s.kind==='shot'?'The reflex threshold is passed, but a gunshot peaks within a millisecond while the muscle needs tens of milliseconds to respond, so the damaging peak passes through unchanged.':`At ${s.lev} dB the stapedius contracts after a few tens of milliseconds and trims about ${fmt(Math.round(att))} dB from low frequencies. Values are approximate and vary between people.`):`At ${s.lev} dB SPL the reflex is not triggered; it typically needs about 70–90 dB above threshold.`};
 }});

/* ===================== Lesson: cochlea ===================== */
function S3_env(b,peak,sharp){return b<peak?Math.exp(-Math.pow((peak-b)/.22,2)):Math.exp(-Math.pow((b-peak)/(sharp?.035:.07),2))}
SCENE({id:'cochlea',name:'The cochlea sorts by frequency',tag:'A travelling wave with a place for each pitch',
 definition:'The basilar membrane runs the length of the cochlea, narrow and stiff at the base and wide and floppy at the apex. A sound sends a travelling wave along it that peaks at a place set by its frequency: high notes near the base, low notes near the apex.',
 example:'A 1 kHz tone peaks about 60% of the way from the base towards the apex; an 8 kHz tone peaks near the base; 200 Hz travels almost to the apex.',
 desc:'The uncoiled membrane from base to apex with the wave for the chosen frequency and a place scale from Greenwood’s map; in 3D, the cochlea coiled about 2¾ turns with the excited place marked.',
 research:'von Békésy (1960). Experiments in Hearing (Nobel Prize 1961). · Greenwood (1990). A cochlear frequency-position function for several species — 29 years later. JASA 87, 2592–2605.',
 dur:12,hint:'Slide the frequency and watch the peak move. Press Play to hear it. Switch to 3D to see the same place on the coiled cochlea.',
 init:()=>({f:1000,ph:0}),
 watch(p){return {f:Math.round(Math.pow(10,lerp(Math.log10(8000),Math.log10(150),smooth(p)))),ph:p*50}},
 ui:[{range:'f',label:'Frequency',min:0,max:100,get:s=>S3_sliderV(s.f),act:'f',show:v=>S3_fstr(S3_sliderF(v))},{b:'Play ▶',act:'play'}],
 on:{f(s,v){s.f=S3_sliderF(+v)},play(s){AUDIO.tone(s.f,{dur:.8,gain:.08,attack:.03})}},
 draw(s){
  const xb=60,xa=540,w=xa-xb,yc=160,peak=1-S3_greenX(s.f),ph=s.ph||0,mm=Math.round((1-S3_greenX(s.f))*350)/10;
  let out=heading(`${S3_fstr(s.f)} peaks ${fmt(mm)} mm from the base`);
  out+=P(`M${xb} ${yc-10}L${xa} ${yc-34}L${xa} ${yc+34}L${xb} ${yc+10}Z`,C.line,1.5,'#f6f0ea');
  let up='',wave='';for(let i=0;i<=240;i++){const b=i/240,x=xb+b*w,e=S3_env(b,peak,true),half=10+24*b;up+=(i?'L':'M')+fmt(x)+' '+fmt(yc-e*half);wave+=(i?'L':'M')+fmt(x)+' '+fmt(yc-e*half*Math.sin(b*60/(.08+b*.9)-ph))}
  out+=P(up,C.coral,1.4,'none','stroke-dasharray="4 3"')+P(wave,C.blue,2.4);
  out+=TB(xb,yc-48,'base',14,C.ink,'start')+TF(xb,yc-32,'narrow, stiff',12,C.muted,'start')+TB(xa,yc-54,'apex',14,C.ink,'end')+TF(xa,yc-38,'wide, floppy',12,C.muted,'end');
  out+=L(xb,250,xa,250,C.line,1.5);
  for(const f of [16000,8000,4000,2000,1000,500,200,50]){const x=xb+(1-S3_greenX(f))*w;out+=L(x,244,x,256,C.line,1.4)+TF(x,272,f>=1000?f/1000+'k':f,12,C.muted)}
  for(const m of [0,10,20,30]){const x=xb+m/35*w;out+=TF(x,300,m+' mm',12,C.muted)}
  const xp=xb+peak*w;out+=`<polygon points="${fmt(xp)},238 ${fmt(xp-7)},226 ${fmt(xp+7)},226" fill="${C.coral}"/>`;
  out+=TF(300,322,'Top: frequency for each place (Greenwood). Bottom: distance from the base.',12,C.muted);
  out+=S3_note('Sketch: the real membrane is 35 mm long, coiled 2¾ turns; the wave is far smaller.',346);
  return {svg:out,phase:`The wave builds slowly from the base, peaks where the membrane’s stiffness and mass suit ${S3_fstr(s.f)}, then dies away within a millimetre or two. Hair cells at that place respond most, so place codes frequency.`};
 },
 three(s,f,X,project){
  const peak=1-S3_greenX(s.f),N=160,pt=t=>{const th=t*2.75*2*Math.PI,r=1.25*(1-.62*t);return [r*Math.cos(th),r*Math.sin(th),.95*t]};
  const Pr=project([-1.4,1.4,-1.4,1.4,0,1]),items=[];
  for(let i=0;i<N;i++){const t0=i/N,t1=(i+1)/N,b=(t0+t1)/2,e=S3_env(b,peak,true),a=pt(t0),c=pt(t1),col=e>.5?C.coral:e>.12?C.amber:'#9fb3c0',w=3+e*7;
   items.push({at:pt(b),svg:P2=>{const p=P2(a),q=P2(c);return L(p[0],p[1],q[0],q[1],col,w)}})}
  let out=sortedItems(items,Pr);const pk=Pr(pt(peak));out+=Ci(pk[0],pk[1],8,C.coral,'#fff');
  const bs=Pr(pt(0)),ap=Pr(pt(1));out+=TF(bs[0],bs[1]+22,'base (high)',13,C.ink)+TF(ap[0],ap[1]-14,'apex (low)',13,C.ink);
  return {svg:out,title:`${S3_fstr(s.f)} on the coiled cochlea`,caption:`The membrane spirals about 2¾ turns from the base (outer turn) to the apex (top). Orange shows where ${S3_fstr(s.f)} moves it most.`};
 }});

const S3_MAPPOS=[0,5,10,15,20,25,30,35];
SCENE({id:'cochlea-map',name:'The place map',tag:'About 5 mm per octave',
 definition:'Greenwood’s formula gives the frequency each place on the human basilar membrane responds to best: f = 165.4 × (10^(2.1x) − 0.88), where x is the fraction of the length from the apex. Above about 1 kHz each octave takes roughly the same length, about 5 mm.',
 example:'The base (x = 1) responds to about 20 kHz; the apex (x = 0) to about 20 Hz. Moving 5 mm towards the base near the middle roughly doubles the frequency.',
 desc:'The membrane as a strip with eight press points from base to apex, the chosen place’s best frequency, and a plot of best frequency on a log scale against distance from the base.',
 research:'Greenwood (1961; 1990). JASA 33, 1344–1356; JASA 87, 2592–2605. · Liberman (1982). The cochlear frequency map for the cat. JASA 72 (labelled single fibres, the basis for checking such maps).',
 dur:10,hint:'Press a place on the membrane to read its best frequency and how many millimetres one octave takes there.',
 init:()=>({mm:15}),
 watch(p){return {mm:S3_MAPPOS[Math.min(7,Math.floor(p*8))]}},
 ui:[{range:'mm',label:'Distance from base',min:0,max:35,get:s=>s.mm,act:'mm',show:v=>v+' mm'}],
 on:{mm(s,v){s.mm=+v},pick(s,v){s.mm=+v}},
 draw(s,f,X){
  const x=1-s.mm/35,fr=S3_greenF(x),f2=fr*2,x2=S3_greenX(f2),oct=Math.round((x2-x)*35*10)/10;
  let out=heading(`${s.mm} mm from the base: best frequency ${S3_fstr(fr)}`);
  const sx=60,sw=480,sy=86;out+=P(`M${sx} ${sy}L${sx+sw} ${sy-10}L${sx+sw} ${sy+34}L${sx} ${sy+24}Z`,C.line,1.5,'#f6f0ea');
  for(const m of S3_MAPPOS){const xx=sx+m/35*sw,on=m===s.mm;out+=hit(X,'pick',m,`${m} mm from the base`,Ci(xx,sy+12,on?11:8,on?C.coral:'#fff',on?C.coral:C.blue)+TF(xx,sy+48,m+' mm',12,on?C.coral:C.muted))}
  out+=TF(sx,sy-14,'base',12,C.muted,'start')+TF(sx+sw,sy-24,'apex',12,C.muted,'end');
  // plot
  const px=90,pw=430,py=330,ph=170,fy=v=>py-Math.log10(v/20)/3*ph;out+=L(px,py,px+pw,py,C.line,1.5)+L(px,py,px,py-ph,C.line,1.5);
  for(const v of [20,100,1000,10000]){out+=L(px-5,fy(v),px,fy(v),C.line,1.2)+TF(px-8,fy(v)+4,v>=1000?v/1000+'k':v,12,C.muted,'end')}
  for(const m of [0,10,20,30]){out+=TF(px+m/35*pw,py+18,m,12,C.muted)}
  out+=TF(px+pw,py+18,'mm',12,C.muted,'start')+TF(px+4,py-ph-8,'best frequency, Hz (log)',12,C.muted,'start');
  let d='';for(let i=0;i<=70;i++){const m=i/2,v=S3_greenF(1-m/35);d+=(i?'L':'M')+fmt(px+m/35*pw)+' '+fmt(fy(Math.max(20,v)))}out+=P(d,C.blue,2.6);
  out+=Ci(px+s.mm/35*pw,fy(Math.max(20,fr)),7,C.coral);
  if(oct>0)out+=L(px+(1-x2)*pw,fy(f2),px+s.mm/35*pw,fy(f2),C.green,2,'stroke-dasharray="4 3"')+(s.mm<20?TF(px+s.mm/35*pw+10,fy(f2)+17,`+1 octave: ${fmt(oct)} mm`,12,C.green,'start'):TF(px+(1-x2)*pw-8,fy(f2)+4,`+1 octave: ${fmt(oct)} mm`,12,C.green,'end'));
  return {svg:out,phase:oct>0?`Here ${s.mm} mm from the base the best frequency is ${S3_fstr(fr)}. Doubling it to ${S3_fstr(f2)} means moving ${fmt(oct)} mm towards the base. Near the apex octaves are squeezed into less length.`:`At the base the best frequency is about ${S3_fstr(fr)}, near the upper limit of human hearing.`};
 }});

const S3_BK_STEPS=8;
SCENE({id:'cochlea-bekesy',name:'Békésy’s wave, and the living cochlea',tag:'Dead ears are broadly tuned',
 definition:'Georg von Békésy watched travelling waves in cochleas from human cadavers through a microscope. His waves were broad. Later measurements in living animals showed much sharper, larger peaks: the living cochlea amplifies its own motion near the peak.',
 example:'Measured in living animals at low levels, the membrane near its peak moves about 1,000 times (60 dB) more than the incoming stapes motion; after death the gain falls and the peak broadens and shifts.',
 desc:'A 1 kHz travelling wave stepped through time from base to apex, with its envelope drawn sharp for a living cochlea or broad for Békésy’s post-mortem preparation.',
 research:'von Békésy (1960). Experiments in Hearing. · Rhode (1971). Observations of the vibration of the basilar membrane in squirrel monkeys using the Mössbauer technique. JASA 49. · Ruggero et al. (1997). Basilar-membrane responses to tones at the base of the chinchilla cochlea. JASA 101.',
 dur:12,hint:'Step through time to watch the wave travel, then switch between living and post-mortem to compare the envelopes.',
 init:()=>({mode:'live'}),
 trace(s){return range(S3_BK_STEPS).map(i=>({i,mode:s.mode}))},
 ui:[{choose:[['live','Living cochlea'],['dead','Post-mortem (Békésy)']],label:'Cochlea',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v}},
 draw(s,f){
  const live=s.mode==='live',xb=60,xa=540,w=xa-xb,yc=170,peak=1-S3_greenX(1000)-(live?0:.06),front=(f.i+1)/S3_BK_STEPS*(peak+.12);
  let out=heading(live?'Living: a tall, sharp peak':'Post-mortem: a low, broad peak');
  out+=P(`M${xb} ${yc-10}L${xa} ${yc-36}L${xa} ${yc+36}L${xb} ${yc+10}Z`,C.line,1.5,'#f6f0ea');
  const gain=live?1:.35;let env='',wave='';
  for(let i=0;i<=240;i++){const b=i/240,x=xb+b*w,e=(live?S3_env(b,peak,true):S3_env(b,peak,false)*(b<peak?1:1))*gain*(b<=front?1:Math.exp(-Math.pow((b-front)/.02,2))),half=12+30*b;env+=(i?'L':'M')+fmt(x)+' '+fmt(yc-e*half);wave+=(i?'L':'M')+fmt(x)+' '+fmt(yc-e*half*Math.sin(b*60/(.08+b*.9)-f.i*1.3))}
  out+=P(env,C.coral,1.4,'none','stroke-dasharray="4 3"')+P(wave,live?C.blue:C.purple,2.4);
  out+=TF(xb,yc-46,'base',13,C.ink,'start')+TF(xa,yc-52,'apex',13,C.ink,'end');
  out+=R(70,250,460,82,'#fff',C.grid,10)+TF(300,274,`Time step ${f.i+1} of ${S3_BK_STEPS}: the wave travels from base to apex.`,13,C.ink);
  out+=TF(300,296,live?'Outer hair cells add energy near the peak: tall and narrow.':'Without the amplifier the peak is ~50 dB smaller and broader.',13,live?C.blue:C.purple);
  out+=TF(300,318,'Shapes illustrative; gain values from living-animal measurements.',12,C.muted);
  return {svg:out,phase:live?'In a living cochlea the wave grows sharply just before its peak, because outer hair cells push energy into it. Rhode (1971) first showed this nonlinear, sensitive tuning.':'Békésy’s cadaver cochleas needed very loud sounds to see any motion. The wave was real, but broad: the sharp tuning of hearing comes from the living cochlea’s amplifier.'};
 }});

/* ===================== Lesson: hair-cells ===================== */
const S3_po=x=>1/(1+Math.exp(-(x-23)/12));
SCENE({id:'hair-cells',name:'Hair cells turn bending into signals',tag:'Tip links pull channels open',
 definition:'On top of each hair cell is a bundle of stereocilia in rows of rising height, joined by fine tip links. Bending the bundle towards the tallest row stretches the tip links and opens ion channels; bending it back closes them.',
 example:'Deflections of about a nanometre, close to the width of a few atoms, are enough to change the current. About 10–15% of channels are open at rest, so the cell can signal both directions.',
 desc:'A hair bundle tilted by the chosen deflection with tip links stretched or slack, open channels lit, and the open-probability curve with the current point marked.',
 research:'Hudspeth & Corey (1977). Sensitivity, polarity, and conductance change in the response of vertebrate hair cells to controlled mechanical stimuli. PNAS 74. · Pickles, Comis & Osborne (1984). Cross-links between stereocilia in the guinea pig organ of Corti. Hearing Research 15. · Fettiplace & Kim (2014). Physiological Reviews 94. (Curve parameters illustrative.)',
 dur:10,hint:'Slide the deflection both ways. Towards the tall row opens channels; away from it closes the few that were open at rest.',
 init:()=>({x:30}),
 watch(p){return {x:Math.round(80*Math.sin(p*2*Math.PI))}},
 ui:[{range:'x',label:'Bundle deflection',min:-100,max:100,step:5,get:s=>s.x,act:'x',show:v=>(v>0?'+':'')+v+' nm'}],
 on:{x(s,v){s.x=+v}},
 draw(s){
  const po=S3_po(s.x),ang=s.x/100*.32;let out=heading(`${Math.round(po*100)}% of channels open`);
  const bx=150,by=270;out+=R(70,by,160,50,C.greenp,C.green,10)+TF(150,by+30,'hair cell',13,C.green);
  const rows=[{dx:-40,h:60},{dx:0,h:95},{dx:40,h:130}],tips=[];
  rows.forEach(r=>{const x0=bx+r.dx,tx=x0+Math.sin(ang)*r.h,ty=by-Math.cos(ang)*r.h;out+=L(x0,by,tx,ty,C.dark,7);tips.push([tx,ty])});
  for(let i=0;i<2;i++){const a=tips[i],b=tips[i+1],str=s.x>0;out+=L(a[0],a[1],b[0],b[1]-(i===0?35:35)*Math.cos(ang),str?C.coral:C.line,str?2.5:1.5);const open=po>.2+i*.3;out+=Ci(a[0],a[1]+2,6,open?C.amber:'#fff',C.amber)}
  out+=TF(150,98,s.x>0?'towards the tallest row':s.x<0?'away from the tallest row':'at rest',13,C.ink);
  out+=arrow(150-40,112,150+40*(s.x>=0?1:-1),112,C.blue,2);
  out+=TF(70,350,'orange dots: channels at the tip links',12,C.amber,'start');
  // curve
  const px=320,pw=240,py=290,ph=180;out+=L(px,py,px+pw,py,C.line,1.5)+L(px+pw/2,py,px+pw/2,py-ph,C.line,1);
  for(const v of [-100,0,100]){const x=px+(v+100)/200*pw;out+=TF(x,py+18,v,12,C.muted)}
  out+=TF(px+pw/2,py+34,'deflection, nm',12,C.muted)+TF(px,py-ph-6,'share of channels open',12,C.muted,'start');
  for(const v of [0,.5,1]){out+=TF(px-6,py-v*ph+4,Math.round(v*100)+'%',12,C.muted,'end')}
  let d='';for(let v=-100;v<=100;v+=2)d+=(v>-100?'L':'M')+fmt(px+(v+100)/200*pw)+' '+fmt(py-S3_po(v)*ph);out+=P(d,C.blue,2.6);
  out+=Ci(px+(s.x+100)/200*pw,py-po*ph,7,C.coral)+TF(px+pw/2+6,py-S3_po(0)*ph-8,'resting',12,C.muted,'start');
  return {svg:out,phase:s.x>0?`Bent ${s.x} nm towards the tall row, the tip links stretch and about ${Math.round(po*100)}% of channels open; potassium flows in and the cell depolarises.`:s.x<0?`Bent ${-s.x} nm the other way, the links slacken and the resting ${Math.round(S3_po(0)*100)}% falls to about ${Math.round(po*100)}%: the cell hyperpolarises.`:`At rest about ${Math.round(po*100)}% of channels are open, so the cell can report movement in either direction.`};
 }});

SCENE({id:'hair-cells-outer',name:'Outer hair cells amplify',tag:'The cochlear amplifier',
 definition:'Each inner hair cell sends the signal to the brain; the three rows of outer hair cells mostly act as motors. They change length with their voltage (electromotility, driven by the protein prestin), pumping energy into the membrane and boosting quiet sounds by up to about 50 dB.',
 example:'When outer hair cells are lost through noise or some drugs, thresholds rise by roughly 40–50 dB and tuning becomes broad, even if the inner hair cells survive.',
 desc:'Left: a tuning curve (threshold against frequency for one place) with or without outer hair cells. Right: the membrane’s response against input level, compressive when healthy and linear and smaller when damaged.',
 research:'Brownell et al. (1985). Evoked mechanical responses of isolated cochlear outer hair cells. Science 227. · Zheng et al. (2000). Prestin is the motor protein of cochlear outer hair cells. Nature 405. · Liberman & Dodds (1984). Hearing Research 16. · Ruggero et al. (1997). JASA 101. (Curves stylised.)',
 dur:10,hint:'Switch the outer hair cells off to see the sharp tip vanish, then move the input level to see why a healthy cochlea compresses a huge range of levels.',
 init:()=>({ohc:1,lev:40}),
 watch(p){return {ohc:p<.5?1:0,lev:Math.round(lerp(0,100,(p*2)%1))}},
 ui:[{choose:[[1,'Outer hair cells healthy'],[0,'Lost']],label:'Outer hair cells',get:s=>s.ohc,act:'ohc'},{range:'lev',label:'Input level',min:0,max:100,step:5,get:s=>s.lev,act:'lev',show:v=>v+' dB SPL'}],
 on:{ohc(s,v){s.ohc=+v},lev(s,v){s.lev=+v}},
 draw(s){
  const io=(L,h)=>h?(L<=30?L+39:69+.286*(L-30)):L-11;let out=heading(s.ohc?'Healthy: sharp tuning and compression':'Outer hair cells lost: about 50 dB less gain');
  // tuning curve at CF 4 kHz
  const x0=50,w=230,y0=320,h=210,f0=1000,f1=10000,ty=v=>y0-(100-v)/100*h;
  out+=S3_faxis(x0,y0,w,f0,f1,[1000,2000,4000,8000])+L(x0,y0,x0,y0-h,C.line,1.5);
  for(const v of [0,50,100])out+=TF(x0-6,ty(v)+4,v,12,C.muted,'end');
  out+=TF(x0,y0-h-8,'threshold, dB SPL (lower = more sensitive)',12,C.muted,'start');
  for(const hl of [1,0]){let d='';for(let i=0;i<=80;i++){const ff=f0*Math.pow(f1/f0,i/80);let th;const o=Math.log2(ff/4000);
    if(hl)th=o>=0?10+90*o*o*2:Math.min(10+120*o*o,62+10*o);else th=o>=0?58+70*o*o:Math.min(58+60*o*o,70+6*o);th=clamp(th,0,100);d+=(i?'L':'M')+fmt(S3_logx(ff,x0,w,f0,f1))+' '+fmt(ty(th))}
   out+=P(d,hl?C.blue:C.coral,hl===s.ohc?3:1.6,'none',hl===s.ohc?'':'stroke-dasharray="4 3" opacity=".7"')}
  out+=TF(S3_logx(4000,x0,w,f0,f1),ty(10)-8,'4 kHz place',12,C.ink);
  // input-output
  const ix=340,iw=220,iy=320,ihh=210,X=v=>ix+v/100*iw,Y=v=>iy-(v+15)/105*ihh;
  out+=L(ix,iy,ix+iw,iy,C.line,1.5)+L(ix,iy,ix,iy-ihh,C.line,1.5);for(const v of [0,50,100])out+=TF(X(v),iy+18,v,12,C.muted);
  out+=TF(ix+iw/2,iy+34,'input level, dB SPL',12,C.muted)+TF(ix,iy-ihh-8,'membrane motion, dB (relative)',12,C.muted,'start');
  for(const hl of [1,0]){let d='';for(let v=0;v<=100;v+=2)d+=(v?'L':'M')+fmt(X(v))+' '+fmt(Y(io(v,hl)));out+=P(d,hl?C.blue:C.coral,hl===s.ohc?3:1.6,'none',hl===s.ohc?'':'stroke-dasharray="4 3" opacity=".7"')}
  const cur=io(s.lev,s.ohc),gap=io(s.lev,1)-io(s.lev,0);out+=Ci(X(s.lev),Y(cur),7,s.ohc?C.blue:C.coral);
  out+=TF(X(52),Y(io(52,1))-12,'healthy',12,C.blue,'start')+TF(X(60),Y(io(60,0))+20,'no outer hair cells',12,C.coral,'start');
  return {svg:out,phase:`At ${s.lev} dB the healthy cochlea moves about ${fmt(Math.round(gap))} dB more than one without outer hair cells. The gain is largest for quiet sounds and fades at loud ones, squeezing about 100 dB of input into a much smaller range of motion.`};
 }});

SCENE({id:'hair-cells-oae',name:'The ear makes sounds',tag:'Otoacoustic emissions',
 definition:'David Kemp found in 1978 that a click played into the ear canal comes back as a faint echo a few milliseconds later, generated by the outer hair cells. If the echo is present, the cochlear amplifier is working.',
 example:'Newborn hearing screening in the UK and many other countries uses this: a tiny probe plays clicks and listens for the echo, without the baby having to respond.',
 desc:'A microphone recording in the ear canal: the click at time zero, then the much smaller emission, with high frequencies returning first and low ones later, present for a healthy cochlea and absent when outer hair cells are lost.',
 research:'Kemp (1978). Stimulated acoustic emissions from within the human auditory system. JASA 64, 1386–1391. · Kemp (2002). Otoacoustic emissions, their origin in cochlear function, and use. British Medical Bulletin 63. (Waveform illustrative; emission scaled up 30×.)',
 dur:9,hint:'Press Click to hear a short click (the emission itself is far too quiet to hear). Switch the outer hair cells off to see the echo vanish. A screen demo is not a hearing test.',
 init:()=>({ok:1}),
 watch(p){return {ok:p<.6?1:0}},
 ui:[{choose:[[1,'Healthy cochlea'],[0,'Outer hair cells lost']],label:'Cochlea',get:s=>s.ok,act:'ok'},{b:'Click ▶',act:'click'}],
 on:{ok(s,v){s.ok=+v},click(){AUDIO.noise({dur:.004,gain:.12})}},
 draw(s){
  const x0=60,w=500,y=170,ms=20,X=t=>x0+t/ms*w;let out=heading(s.ok?'An echo returns from the cochlea':'No echo: the amplifier is not working');
  out+=L(x0,y,x0+w,y,C.line,1.2);for(const t of [0,5,10,15,20]){out+=L(X(t),y+70,X(t),y+76,C.line,1.2)+TF(X(t),y+92,t+' ms',12,C.muted)}
  out+=L(x0,y+70,x0+w,y+70,C.line,1.2);
  out+=R(X(0)-2,y-90,5,180,C.coral,'none',1)+TF(X(0)+10,y-80,'click',12,C.coral,'start');
  if(s.ok){let d='';for(let i=0;i<=400;i++){const t=4+i/400*13,fq=4000*Math.pow(.25,(t-4)/9),env=Math.exp(-Math.pow((t-9)/3.6,2)),ph=2*Math.PI*fq*t/1000*1.0;d+=(i?'L':'M')+fmt(X(t))+' '+fmt(y-env*40*Math.sin(ph*3))}out+=P(d,C.blue,1.8);
   out+=TF(X(6),y-56,'high frequencies first',12,C.blue)+TF(X(14),y-56,'low frequencies later',12,C.blue)+TF(X(10),y+56,'emission (shown 30× larger)',12,C.blue)}
  else out+=TF(X(10),y-20,'flat: nothing comes back',13,C.muted);
  out+=R(70,286,460,54,'#fff',C.grid,10)+TF(300,308,'Used in newborn screening: quick, painless, no response needed.',13,C.ink)+TF(300,328,'A missing emission means “refer for a full test”, not a diagnosis.',12,C.muted);
  return {svg:out,phase:s.ok?'The outer hair cells’ motion leaks back out through the middle ear as a faint sound. High-frequency places sit nearer the base, so their echo returns sooner.':'With outer hair cells lost, the cochlea no longer amplifies, and the emission disappears: a sign of at least mild-to-moderate hearing loss.'};
 }});

/* ===================== Lesson: hearing-range ===================== */
SCENE({id:'hearing-range',name:'The range of hearing',tag:'From 20 Hz to 20 kHz, unevenly',
 definition:'The quietest sound you can hear depends strongly on frequency. Young adults are most sensitive between about 2 and 5 kHz, need far more sound at low frequencies, and lose the highest frequencies with age.',
 example:'A 100 Hz tone must be about 30 dB more intense than a 3 kHz tone to be just heard. By 70, many people need about 40–60 dB more at 4–8 kHz than they did at 20.',
 desc:'Threshold of hearing against frequency on a log scale (Terhardt’s fit for young adults), with an age-related shift added for the chosen age and the chosen frequency marked.',
 research:'Terhardt (1979). Calculating virtual pitch. Hearing Research 1 (threshold approximation). · ISO 226:2003 and ISO 389-7 (threshold of hearing). · ISO 7029 (age-related thresholds; the age curves here are an approximation of its shape).',
 dur:10,hint:'Choose an age and move the frequency to read the threshold. Play uses a gentle level from your device; it is not a hearing test.',
 init:()=>({f:4000,age:20}),
 watch(p){return {f:S3_sliderF(Math.round(p*100)),age:p<.5?20:70}},
 ui:[{choose:[[20,'Age 20'],[50,'50'],[70,'70']],label:'Age',get:s=>s.age,act:'age'},{range:'f',label:'Frequency',min:0,max:100,get:s=>S3_sliderV(s.f),act:'f',show:v=>S3_fstr(S3_sliderF(v))},{b:'Play ▶',act:'play'}],
 on:{age(s,v){s.age=+v},f(s,v){s.f=S3_sliderF(+v)},play(s){AUDIO.tone(s.f,{dur:.8,gain:.06,attack:.04})}},
 draw(s){
  const x0=70,w=480,y0=310,h=230,f0=20,f1=20000,Y=v=>y0-(v+10)/110*h,thr=f=>S3_terh(f)+S3_ageLoss(f,s.age);
  let out=heading(`At ${S3_fstr(s.f)}: about ${Math.round(thr(s.f))} dB SPL to be just heard (age ${s.age})`);
  out+=S3_faxis(x0,y0,w,f0,f1,[20,50,100,200,500,1000,2000,5000,10000,20000])+L(x0,y0,x0,y0-h,C.line,1.5);
  for(const v of [0,20,40,60,80,100])out+=L(x0-5,Y(v),x0,Y(v),C.line,1.2)+TF(x0-8,Y(v)+4,v,12,C.muted,'end');
  out+=TF(x0+4,y0-h-8,'threshold, dB SPL (lower = more sensitive)',12,C.muted,'start')+TF(x0+w/2,y0+36,'frequency, Hz',12,C.muted);
  let shade='',d='',d20='';for(let i=0;i<=200;i++){const ff=f0*Math.pow(f1/f0,i/200),x=S3_logx(ff,x0,w,f0,f1),v=clamp(thr(ff),-10,100),v20=clamp(S3_terh(ff),-10,100);d+=(i?'L':'M')+fmt(x)+' '+fmt(Y(v));d20+=(i?'L':'M')+fmt(x)+' '+fmt(Y(v20))}
  out+=P(d+`L${x0+w} ${Y(100)}L${x0} ${Y(100)}Z`,'none',0,C.pale)+TF(x0+w/2,Y(85),'audible',13,C.blue);
  if(s.age>20)out+=P(d20,C.line,1.6,'none','stroke-dasharray="4 3"')+TF(S3_logx(300,x0,w,f0,f1),Y(S3_terh(300))+16,'age 20',12,C.muted);
  out+=P(d,C.blue,2.8);const xp=S3_logx(s.f,x0,w,f0,f1);out+=Ci(xp,Y(clamp(thr(s.f),-10,100)),7,C.coral);
  out+=S3_note('Population averages; individuals vary by ±10 dB or more. Not a hearing test.',350);
  return {svg:out,phase:`The curve dips between 2 and 5 kHz, helped by the ear-canal resonance. ${s.age>20?`At age ${s.age} the high-frequency end rises most, because hair cells at the base are lost first.`:'Low frequencies need much more sound to be heard at all.'}`};
 }});

const S3_SWF=[250,500,1000,2000,4000,8000],S3_START=50,S3_CAP=.06;
const S3_gainOf=att=>S3_CAP*Math.pow(10,-att/20);
SCENE({id:'hearing-range-sweep',name:'Try a relative threshold sweep',tag:'You are the listener',
 definition:'Audiologists find thresholds by playing quiet tones and raising the level until you hear them. Here you can do a rough, uncalibrated version: each tone starts very quiet and gets 5 dB louder each time you say you did not hear it.',
 example:'Your results are relative: headphones and speakers vary by tens of decibels across frequency, so this shows the shape your device and ears give together, not a hearing level.',
 desc:'Six test frequencies with your relative threshold for each (or a simulated listener in Watch), beside the published shape for young adults, all relative to 1 kHz.',
 research:'Hughson & Westlake (1944) ascending method; British Society of Audiology (2018). Recommended procedure: pure-tone air-conduction audiometry. · Terhardt (1979) threshold shape. (Not calibrated; not a hearing test.)',
 dur:12,hint:'Before you start, turn your device volume low to medium and use headphones in a quiet room. Press Play; if you heard the tone press Heard it, otherwise press Louder and Play again. Stop at once if anything is uncomfortable. This is not a hearing test; if you are worried, see an audiologist. Your answers stay on this page.',
 init:()=>({fi:0,att:S3_START,thr:S3_SWF.map(()=>null),sim:false}),
 watch(p){const n=Math.min(6,Math.floor(p*7));const thr=S3_SWF.map((f,i)=>i<n?Math.round(30-(S3_terh(f)-S3_terh(1000))+[2,-1,0,3,-2,4][i]):null);return {fi:Math.min(5,n),att:S3_START,thr,sim:true}},
 ui:[{b:'Play ▶',act:'play'},{b:'Heard it',act:'heard'},{b:'Louder',act:'louder'}],
 on:{play(s){if(s.fi<6)AUDIO.tone(S3_SWF[s.fi],{dur:.9,gain:S3_gainOf(s.att),attack:.06,release:.1});return 'keep'},
  heard(s){if(s.fi>=6)return 'keep';s.thr[s.fi]=s.att;s.fi++;s.att=S3_START;return 'keep'},
  louder(s){if(s.fi>=6)return 'keep';if(s.att<=0){s.thr[s.fi]=-1;s.fi++;s.att=S3_START}else s.att=Math.max(0,s.att-5);return 'keep'}},
 draw(s){
  const done=s.thr.filter(v=>v!==null).length;let out=heading(s.fi<6?`Testing ${S3_fstr(S3_SWF[s.fi])}: level ${S3_START-s.att} dB above the start`:'Sweep finished');
  // relative threshold: higher attenuation when heard = more sensitive. rel = -(att) relative to 1 kHz.
  const ref=s.thr[2],x0=90,w=430,y0=300,h=190,Y=v=>y0-(v+30)/60*h,xs=i=>x0+i/5*w;
  out+=L(x0,y0,x0+w,y0,C.line,1.5)+L(x0,y0,x0,y0-h,C.line,1.5);
  for(const v of [-30,-15,0,15,30])out+=L(x0-5,Y(v),x0,Y(v),C.line,1.2)+TF(x0-8,Y(v)+4,(v>0?'+':'')+v,12,C.muted,'end');
  out+=TF(x0+4,y0-h-8,'threshold relative to 1 kHz, dB (lower = more sensitive)',12,C.muted,'start');
  S3_SWF.forEach((f,i)=>{out+=TF(xs(i),y0+18,f>=1000?f/1000+'k':f,12,i===s.fi&&s.fi<6?C.coral:C.muted)});out+=TF(x0+w/2,y0+34,'frequency, Hz',12,C.muted);
  let d='';S3_SWF.forEach((f,i)=>{d+=(i?'L':'M')+fmt(xs(i))+' '+fmt(Y(clamp(S3_terh(f)-S3_terh(1000),-30,30)))});out+=P(d,C.line,2.2,'none','stroke-dasharray="5 4"')+TF(xs(5)+4,Y(clamp(S3_terh(8000)-S3_terh(1000),-30,30))-8,'published shape',12,C.muted,'end');
  if(ref!==null&&ref!==undefined&&ref>=0){let dd='',pts='';S3_SWF.forEach((f,i)=>{const t=s.thr[i];if(t===null)return;const rel=t<0?30:clamp(-(t-ref),-30,30);dd+=(dd?'L':'M')+fmt(xs(i))+' '+fmt(Y(rel));pts+=Ci(xs(i),Y(rel),6,s.sim?C.purple:C.blue)});out+=P(dd,s.sim?C.purple:C.blue,2.4)+pts}
  else S3_SWF.forEach((f,i)=>{if(s.thr[i]!==null)out+=Ci(xs(i),Y(0),5,C.line)});
  out+=R(64,322,472,30,s.sim?C.purplep:'#fff',C.grid,8)+TF(300,342,s.sim?'Watch: a simulated listener. Try it to run your own sweep.':`${done} of 6 done · uncalibrated · not a hearing test`,12,s.sim?C.purple:C.muted);
  return {svg:out,phase:s.fi<6?(s.sim?'The simulated listener’s points follow the published shape: least sensitive at 250 Hz, most sensitive near 2–4 kHz.':`Press Play to hear ${S3_fstr(S3_SWF[s.fi])}. If you heard it, press Heard it; if not, press Louder and play again.`):'Compare your shape with the dashed published one. Large differences usually reflect your headphones, not your hearing. For a real test, see an audiologist.'};
 }});

const S3_SOURCES=[['Rustling leaves',20],['Whisper',30],['Conversation',60],['Busy traffic',80],['Concert',105],['Threshold of pain',130]];
SCENE({id:'hearing-range-decibels',name:'Decibels',tag:'A log scale for a huge range',
 definition:'The decibel scale compresses an enormous range of pressures: 0 dB SPL is 20 micropascals, and every 20 dB is ten times more pressure. Each 10 dB increase sounds roughly twice as loud.',
 example:'Two equally loud sources together are only 3 dB louder than one. Ten of them are 10 dB louder, which sounds about twice as loud as one.',
 desc:'A decibel ladder from 0 to 140 dB with everyday sounds, the chosen source multiplied by a number of copies, its pressure in pascals and its loudness in sones.',
 research:'Stevens (1957). On the psychophysical law. Psychological Review 64 (loudness doubles about every 10 dB). · ISO 532 (sone scale). · Everyday levels are typical values, rounded.',
 dur:9,hint:'Pick a source and add copies of it to see how decibels add: doubling the sources adds only 3 dB.',
 init:()=>({src:2,n:1}),
 watch(p){return {src:Math.min(5,Math.floor(p*6)),n:1}},
 ui:[{choose:S3_SOURCES.map((q,i)=>[i,q[0]]),label:'Source',get:s=>s.src,act:'src'},{range:'n',label:'Copies',min:1,max:10,get:s=>s.n,act:'n',show:v=>v+(v===1?' source':' sources')}],
 on:{src(s,v){s.src=+v},n(s,v){s.n=+v}},
 draw(s){
  const [name,L1]=S3_SOURCES[s.src],Lt=L1+10*Math.log10(s.n),pa=20e-6*Math.pow(10,Lt/20),sone=Math.pow(2,(Lt-40)/10);
  let out=heading(`${s.n} × ${name}: ${fmt(Math.round(Lt*10)/10)} dB SPL`);
  const x=110,y0=330,h=280,Y=v=>y0-v/140*h;out+=L(x,y0,x,y0-h,C.line,3);
  for(let v=0;v<=140;v+=20)out+=L(x-6,Y(v),x,Y(v),C.line,1.5)+TF(x-10,Y(v)+4,v,12,C.muted,'end');
  S3_SOURCES.forEach(([n,v],i)=>{const on=i===s.src;out+=L(x,Y(v),x+18,Y(v),on?C.coral:C.line,1.5)+TF(x+22,Y(v)+4,n,12,on?C.coral:C.muted,'start',on?'font-weight="700"':'')});
  out+=Ci(x,Y(Lt),8,C.coral)+TF(x,y0+22,'dB SPL',12,C.muted);
  const cx=330;out+=R(cx,80,250,220,'#fff',C.grid,12);
  out+=TF(cx+16,110,'pressure',13,C.muted,'start')+TBF(cx+234,110,pa>=1?fmt(Math.round(pa*100)/100)+' Pa':fmt(Math.round(pa*1e6))+' µPa',15,C.ink,'end');
  out+=TF(cx+16,142,'× quietest sound',13,C.muted,'start')+TBF(cx+234,142,Math.round(pa/20e-6).toLocaleString('en-GB'),15,C.ink,'end');
  out+=TF(cx+16,174,'loudness',13,C.muted,'start')+TBF(cx+234,174,fmt(Math.round(sone*100)/100)+' sones',15,C.ink,'end');
  out+=TF(cx+16,206,'one copy',13,C.muted,'start')+TBF(cx+234,206,L1+' dB',15,C.ink,'end');
  out+=TF(cx+16,238,`${s.n} copies add`,13,C.muted,'start')+TBF(cx+234,238,'+'+fmt(Math.round(10*Math.log10(s.n)*10)/10)+' dB',15,C.green,'end');
  out+=TF(cx+125,280,'sones: 1 sone = 40 dB at 1 kHz',12,C.muted);
  return {svg:out,phase:`${s.n} copies of a ${L1} dB source give ${fmt(Math.round(Lt*10)/10)} dB, not ${L1*s.n} dB: intensities add, then the total is put back on the log scale. Loudness of about ${fmt(Math.round(sone*10)/10)} sones (a rough 1 kHz estimate).`};
 }});

/* ===================== Lesson: hearing-loss ===================== */
const S3_NOISE=[['Busy road',75],['Hairdryer',85],['Motorbike',95],['Nightclub',100],['Rock concert',105],['Maximum on some headphones',100]];
SCENE({id:'hearing-loss',name:'Noise dose',tag:'Every 3 dB halves the safe time',
 definition:'Noise damage depends on level and time together. A common guideline treats 85 dB(A) for 8 hours as one full daily dose and halves the allowed time for every 3 dB more, because 3 dB is double the sound energy.',
 example:'At 85 dB(A) the allowance is 8 hours; at 94 dB(A) it is 1 hour; at 100 dB(A), 15 minutes. UK workplace law sets action values at 80 and 85 dB(A) and a limit of 87 dB(A).',
 desc:'A level slider and an hours slider giving the percentage of a daily noise dose, a clock of the safe time at that level, and everyday sound levels.',
 research:'NIOSH (1998). Criteria for a recommended standard: occupational noise exposure (85 dBA, 3 dB exchange rate). · Control of Noise at Work Regulations 2005 (UK). · WHO–ITU (2019). Global standard for safe listening devices and systems.',
 dur:9,hint:'Set a level and how long you are exposed. Over 100% of the daily dose risks permanent damage over time; ear protection or turning the level down helps most.',
 init:()=>({lev:100,h:2}),
 watch(p){return {lev:Math.round(lerp(80,106,p)),h:2}},
 ui:[{range:'lev',label:'Level',min:75,max:110,get:s=>s.lev,act:'lev',show:v=>v+' dB(A)'},{range:'h',label:'Time',min:1,max:48,get:s=>Math.round(s.h*4),act:'h',show:v=>fmt(v/4)+' h'}],
 on:{lev(s,v){s.lev=+v},h(s,v){s.h=v/4}},
 draw(s){
  const T=8/Math.pow(2,(s.lev-85)/3),dose=s.h/T*100,danger=dose>100;let out=heading(`${fmt(Math.round(dose))}% of a daily noise dose`);
  const Tstr=T>=1?fmt(Math.round(T*10)/10)+' h':Math.round(T*60)>=1?Math.round(T*60)+' min':Math.round(T*3600)+' s';
  out+=R(60,72,230,110,danger?C.coralp:C.greenp,'none',12)+TF(175,102,`Safe time at ${s.lev} dB(A)`,13,C.ink)+TBF(175,140,Tstr,26,danger?C.coral:C.green)+TF(175,166,'(85 dB(A) for 8 h, halved per 3 dB)',12,C.muted);
  const bx=320,bw=250,by=110;out+=R(bx,by,bw,28,'#fff',C.line,8)+R(bx,by,Math.min(1,dose/200)*bw,28,danger?C.coral:C.green,'none',8)+L(bx+bw/2,by-6,bx+bw/2,by+34,C.ink,1.5)+TF(bx+bw/2,by-10,'100%',12,C.ink)+TF(bx,by+48,'0',12,C.muted,'start')+TF(bx+bw,by+48,'200%+',12,C.muted,'end');
  // level ladder of examples
  const x0=60,w=500,y=270,X=v=>x0+(v-70)/40*w;out+=L(x0,y,x0+w,y,C.line,2);for(let v=70;v<=110;v+=10)out+=L(X(v),y-5,X(v),y+5,C.line,1.4)+TF(X(v),y+20,v,12,C.muted);
  S3_NOISE.slice(0,5).forEach(([n,v],i)=>{out+=Ci(X(v),y,5,C.amber)+TF(X(v),y-14-(i%2)*16,n,12,C.ink)});
  out+=`<polygon points="${fmt(X(s.lev))},${y+8} ${fmt(X(s.lev)-7)},${y+20} ${fmt(X(s.lev)+7)},${y+20}" fill="${C.coral}"/>`+TF(x0+w/2,y+44,'dB(A), typical values',12,C.muted);
  out+=S3_note('Guidance for planning, not a medical limit. Ringing ears after noise is a warning sign.',350);
  return {svg:out,phase:danger?`${fmt(s.h)} h at ${s.lev} dB(A) is ${fmt(Math.round(dose))}% of the daily dose. Each 3 dB less doubles the safe time, so earplugs giving 15–20 dB make a large difference.`:`${fmt(s.h)} h at ${s.lev} dB(A) is within the guideline: ${fmt(Math.round(dose))}% of the daily dose.`};
 }});

const S3_AF=[250,500,1000,2000,4000,8000];
const S3_AUD={normal:{n:'Typical hearing',air:[5,5,0,5,10,10]},noise:{n:'Noise-induced (4 kHz notch)',air:[10,10,15,30,55,30]},age:{n:'Age-related (sloping)',air:[15,15,20,35,55,70]},cond:{n:'Conductive (middle ear)',air:[40,40,35,35,35,40],bone:[5,5,10,10,5,10]}};
const S3_grade=v=>v<20?'no loss':v<35?'mild':v<50?'moderate':v<65?'moderately severe':v<80?'severe':v<95?'profound':'complete';
function S3_lossAt(f,air){if(f<=S3_AF[0])return air[0];if(f>=S3_AF[5])return air[5];for(let i=0;i<5;i++)if(f<=S3_AF[i+1]){const u=Math.log(f/S3_AF[i])/Math.log(S3_AF[i+1]/S3_AF[i]);return air[i]+(air[i+1]-air[i])*u}return air[5]}
SCENE({id:'hearing-loss-audiogram',name:'Reading an audiogram',tag:'Four common patterns',
 definition:'An audiogram plots the quietest tone heard at each frequency, in dB HL (0 = the young-adult average), with worse hearing lower down. Its shape points to the cause: a notch near 4 kHz suggests noise, a downward slope suggests age, and a gap between air and bone conduction points to the middle ear.',
 example:'Averaging 500, 1000, 2000 and 4000 Hz gives the WHO grade: under 20 dB HL is no loss, 20–35 mild, 35–50 moderate.',
 desc:'An audiogram for the chosen pattern with air-conduction circles and, for conductive loss, bone-conduction marks, with the four-frequency average and its WHO grade.',
 research:'WHO (2021). World Report on Hearing (grades). · Coles, Lutman & Buffin (2000). Guidelines on the diagnosis of noise-induced hearing loss. Clinical Otolaryngology 25. · British Society of Audiology (2018) audiogram conventions. (Patterns are typical examples.)',
 dur:12,hint:'Choose a pattern to read its audiogram. Play muffled plays a note with its higher harmonics reduced as that pattern would, a rough simulation: real hearing loss also blurs and distorts sound.',
 init:()=>({k:'noise'}),
 watch(p){return {k:['normal','noise','age','cond'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.keys(S3_AUD).map(k=>[k,S3_AUD[k].n.split(' (')[0]]),label:'Pattern',get:s=>s.k,act:'k'},{b:'Play typical ▶',act:'norm'},{b:'Play muffled ▶',act:'muff'}],
 on:{k(s,v){s.k=v},norm(){const a=range(32).map(i=>1/(i+1));AUDIO.tone(220,{dur:1.2,gain:.08,partials:a})},
  muff(s){const air=S3_AUD[s.k].air,a=range(32).map(i=>1/(i+1)*Math.pow(10,-S3_lossAt(220*(i+1),air)/20));const g=.08*Math.min(1,Math.sqrt(a.reduce((x,y)=>x+y*y,0))/Math.sqrt(range(32).reduce((x,i)=>x+1/((i+1)*(i+1)),0)));AUDIO.tone(220,{dur:1.2,gain:Math.max(.004,g),partials:a})}},
 draw(s){
  const q=S3_AUD[s.k],avg=(q.air[1]+q.air[2]+q.air[3]+q.air[4])/4;let out=heading(`${q.n}: average ${fmt(avg)} dB HL, ${S3_grade(avg)}`);
  const x0=90,w=420,y0=78,h=240,Y=v=>y0+(v+10)/110*h,xs=i=>x0+i/5*w;
  out+=R(x0,y0,w,h,'#fff',C.grid,6);
  for(let v=0;v<=100;v+=20)out+=L(x0,Y(v),x0+w,Y(v),C.grid,1)+TF(x0-8,Y(v)+4,v,12,C.muted,'end');
  out+=R(x0,Y(-10),w,Y(20)-Y(-10),C.greenp,'none',0,'opacity=".6"')+TF(x0+w-6,Y(12),'typical range',12,C.green,'end');
  S3_AF.forEach((f,i)=>{out+=L(xs(i),y0,xs(i),y0+h,C.grid,1)+TF(xs(i),y0-8,f>=1000?f/1000+'k':f,12,C.muted)});
  out+=TF(x0-8,y0-8,'Hz',12,C.muted,'end')+TF(x0-46,Y(50),'dB HL',12,C.muted,'middle','transform="rotate(-90 '+fmt(x0-46)+' '+fmt(Y(50))+')"');
  let d='';q.air.forEach((v,i)=>{d+=(i?'L':'M')+fmt(xs(i))+' '+fmt(Y(v))});out+=P(d,C.coral,2.4);q.air.forEach((v,i)=>{out+=Ci(xs(i),Y(v),7,'#fff',C.coral)});
  if(q.bone){let b='';q.bone.forEach((v,i)=>{b+=(i?'L':'M')+fmt(xs(i)+10)+' '+fmt(Y(v))});out+=P(b,C.blue,1.8,'none','stroke-dasharray="4 3"');q.bone.forEach((v,i)=>{out+=TBF(xs(i)+10,Y(v)+5,'△',16,C.blue)});out+=TF(x0+8,Y(3),'△ bone conduction',12,C.blue,'start')}
  out+=TF(x0+8,y0+h-8,'○ air conduction',12,C.coral,'start')+TF(x0+w-8,y0+h-8,'worse hearing is lower',12,C.muted,'end');
  out+=S3_note('Typical example patterns. Only an audiologist’s calibrated test measures hearing.',350);
  const say={normal:'All thresholds sit within the typical range near 0 dB HL.',noise:'A dip centred near 4 kHz with recovery at 8 kHz is the classic sign of noise exposure: the cochlea is most vulnerable around the place for 3–6 kHz.',age:'A steady slope downwards towards high frequencies is typical of age-related loss (presbycusis): consonants like s, f and th fade first.',cond:'Air conduction is down but bone conduction (vibration applied to the skull, bypassing the middle ear) is normal: the cochlea works and sound is blocked on the way in, for example by fluid or otosclerosis.'};
  return {svg:out,phase:say[s.k]};
 }});

SCENE({id:'hearing-loss-hidden',name:'Hidden hearing loss?',tag:'Synapses before thresholds',
 definition:'In mice, a noise that only temporarily raises thresholds can still permanently destroy up to about half the synapses between inner hair cells and nerve fibres. Thresholds recover, so the loss is “hidden” from a standard audiogram. Whether this happens to a meaningful degree in humans is still debated.',
 example:'Kujawa and Liberman (2009) exposed mice to 100 dB noise for 2 hours: thresholds returned to normal within two weeks, but about 50% of the synapses in the affected region were gone for good.',
 desc:'Two curves over the weeks after a noise: the temporary threshold shift fading to zero, and the synapse count staying low, for mice; and evidence cards for humans.',
 research:'Kujawa & Liberman (2009). Adding insult to injury: cochlear nerve degeneration after “temporary” noise-induced hearing loss. Journal of Neuroscience 29. · Prendergast et al. (2017). Hearing Research 344 (no clear effect in young adults). · Wu et al. (2019). Primary neural degeneration in the human cochlea: evidence for hidden hearing loss in the aging ear. Neuroscience 407, 8–20. · Wu et al. (2021). Primary neural degeneration in noise-exposed human cochleas. Journal of Neuroscience 41, 4439–4447. · Bramhall et al. (2019). Hearing Research 377 (review).',
 dur:10,hint:'Slide the weeks after exposure for the mouse data, then switch to humans to see why the question is still open.',
 init:()=>({wk:4,who:'mice'}),
 watch(p){return {wk:Math.round(p*16),who:p<.65?'mice':'humans'}},
 ui:[{choose:[['mice','Mice (shown)'],['humans','Humans (debated)']],label:'Evidence',get:s=>s.who,act:'who'},{range:'wk',label:'Weeks after the noise',min:0,max:16,get:s=>s.wk,act:'wk',show:v=>v+' weeks'}],
 on:{who(s,v){s.who=v},wk(s,v){s.wk=+v}},
 draw(s){
  if(s.who==='humans'){let out=heading('In humans: evidence is mixed');
   const cards=[['Supports','Post-mortem ears show nerve-fibre loss with age and noise (Wu et al. 2019, 2021).',C.green],['Mixed','Some studies link noise history to weaker nerve responses; others find none (Bramhall 2019 review).',C.amber],['Against','Young adults with high noise exposure showed no clear deficit (Prendergast 2017).',C.coral],['Open','Better tests are needed; “hidden” loss may explain some trouble hearing in noise.',C.blue]];
   cards.forEach(([t,b,col],i)=>{const x=40+(i%2)*270,y=70+Math.floor(i/2)*130;out+=R(x,y,250,112,'#fff',col,10)+TBF(x+14,y+26,t,14,col,'start');const words=b.split(' ');let line='',ly=y+50;for(const w of words){if((line+w).length>34){out+=TF(x+14,ly,line.trim(),12,C.ink,'start');line='';ly+=17}line+=w+' '}out+=TF(x+14,ly,line.trim(),12,C.ink,'start')});
   out+=S3_note('Status: shown in animals; in humans, plausible but debated.',344);
   return {svg:out,phase:'The mechanism is clear in rodents and synapse loss is seen in human temporal bones, but whether everyday noise causes measurable hidden loss in living people is unresolved.'}}
  const tts=w=>40*Math.exp(-w/1.6),syn=w=>100-50*(1-Math.exp(-w*3));let out=heading(`Mice, ${s.wk} weeks on: threshold shift ${fmt(Math.round(tts(s.wk)))} dB, synapses ${Math.round(syn(s.wk))}%`);
  const x0=80,w=440,y0=310,h=210,X=v=>x0+v/16*w;out+=L(x0,y0,x0+w,y0,C.line,1.5)+L(x0,y0,x0,y0-h,C.line,1.5);
  for(const v of [0,4,8,12,16])out+=TF(X(v),y0+18,v,12,C.muted);out+=TF(x0+w/2,y0+34,'weeks after the noise',12,C.muted);
  for(const v of [0,50,100])out+=TF(x0-8,y0-v/100*h+4,v,12,C.muted,'end');
  let a='',b='';for(let i=0;i<=80;i++){const v=i/5;a+=(i?'L':'M')+fmt(X(v))+' '+fmt(y0-tts(v)/40*h*.5);b+=(i?'L':'M')+fmt(X(v))+' '+fmt(y0-syn(v)/100*h)}
  out+=P(a,C.coral,2.6)+P(b,C.blue,2.6)+TF(X(1.8),y0-tts(1.8)/40*h*.5-10,'threshold shift (dB, scaled)',12,C.coral,'start')+TF(X(9),y0-h*.5-10,'synapses left (%)',12,C.blue);
  out+=L(X(s.wk),y0,X(s.wk),y0-h,C.ink,1.2,'stroke-dasharray="4 3"');
  return {svg:out,phase:`The audiogram looks normal again within about two weeks, but around half the synapses in the noise-affected region stay lost. Those fibres mostly carry loud-sound detail, which may matter for hearing speech in noise.`};
 }});

/* ===================== Lesson: cochlear-implants ===================== */
const S3_VOW={a:{n:'“ah”',F:[730,1090,2440]},i:{n:'“ee”',F:[270,2290,3010]},u:{n:'“oo”',F:[300,870,2240]}};
const S3_F0=120,S3_NH=40;
function S3_vowelAmps(F){return range(S3_NH).map(k=>{const f=S3_F0*(k+1);let a=0;F.forEach((Fi,j)=>{a+=[1,.7,.35][j]/(1+Math.pow((f-Fi)/(60+Fi*.06),2))});return a/(1+f/700)})}
function S3_bands(n){const lo=200,hi=5000;return range(n).map(i=>[lo*Math.pow(hi/lo,i/n),lo*Math.pow(hi/lo,(i+1)/n)])}
function S3_vocode(amps,n){return S3_bands(n).map(([a,b])=>{let e=0;amps.forEach((v,k)=>{const f=S3_F0*(k+1);if(f>=a&&f<b)e+=v*v});return {c:Math.sqrt(a*b),a:Math.sqrt(e),lo:a,hi:b}})}
SCENE({id:'cochlear-implants',name:'Hearing through an implant',tag:'A few channels carry speech',
 definition:'A cochlear implant splits sound into frequency bands and sends each band’s loudness to an electrode at the matching place in the cochlea, stimulating the nerve directly. Fine detail and pitch are largely lost; what remains is a coarse picture of the spectrum.',
 example:'Shannon and colleagues (1995) found that with only four bands people with normal hearing understood about 90% of simple sentences in quiet. Implant users typically benefit from up to about eight effective channels, even with 12–22 electrodes.',
 desc:'A synthetic vowel’s harmonic spectrum with its formant peaks, and the coarse band levels an implant-style processor with the chosen number of channels would keep.',
 research:'Shannon et al. (1995). Speech recognition with primarily temporal cues. Science 270, 303–304. · Friesen et al. (2001). Speech recognition in noise as a function of the number of spectral channels. JASA 110. · Peterson & Barney (1952) vowel formants. (The sine vocoder here is a rough simulation.)',
 dur:12,hint:'Pick a vowel and a number of channels. Play the original, then the version through the channels: a crude sine-wave vocoder that keeps each band’s level but not its detail.',
 init:()=>({v:'a',n:4}),
 watch(p){return {v:['a','i','u'][Math.min(2,Math.floor(p*3))],n:[1,2,4,8,16][Math.min(4,Math.floor((p*3%1)*5))]}},
 ui:[{choose:Object.keys(S3_VOW).map(k=>[k,S3_VOW[k].n]),label:'Vowel',get:s=>s.v,act:'v'},{range:'n',label:'Channels',min:1,max:22,get:s=>s.n,act:'n',show:v=>v+(v===1?' channel':' channels')},{b:'Play original ▶',act:'orig'},{b:'Play through channels ▶',act:'voc'}],
 on:{v(s,v){s.v=v},n(s,v){s.n=+v},orig(s){AUDIO.tone(S3_F0,{dur:1.1,gain:.09,partials:S3_vowelAmps(S3_VOW[s.v].F)})},
  voc(s){const b=S3_vocode(S3_vowelAmps(S3_VOW[s.v].F),s.n),m=Math.max(...b.map(q=>q.a))||1,tot=Math.sqrt(b.reduce((x,q)=>x+(q.a/m)*(q.a/m),0))||1;b.forEach(q=>{if(q.a>0)AUDIO.tone(q.c,{dur:1.1,gain:.09*(q.a/m)/tot,attack:.03})})}},
 draw(s){
  const amps=S3_vowelAmps(S3_VOW[s.v].F),mx=Math.max(...amps),b=S3_vocode(amps,s.n),bm=Math.max(...b.map(q=>q.a))||1;
  let out=heading(`${S3_VOW[s.v].n} through ${s.n} channel${s.n===1?'':'s'}`);
  const x0=60,w=500,f0=100,f1=5000,X=f=>S3_logx(f,x0,w,f0,f1);
  // original
  const y1=170,h1=100;out+=TF(x0,y1-h1-10,'original: harmonics of 120 Hz shaped by the vocal tract',12,C.muted,'start');
  amps.forEach((a,k)=>{const f=S3_F0*(k+1);if(f<=f1)out+=L(X(f),y1,X(f),y1-a/mx*h1,C.blue,2)});out+=L(x0,y1,x0+w,y1,C.line,1.4);
  S3_VOW[s.v].F.slice(0,2).forEach((F,j)=>{out+=TF(X(F),y1-h1-2+j*0,'F'+(j+1),12,C.purple)});
  // channels
  const y2=320,h2=110;out+=TF(x0,y2-h2-12,`after ${s.n} channel${s.n===1?'':'s'}: one level per band`,12,C.muted,'start');
  b.forEach((q,i)=>{const xa=X(q.lo),xb=X(q.hi);out+=R(xa+1,y2-q.a/bm*h2,xb-xa-2,q.a/bm*h2,i%2?C.amber:C.coral,'none',2)});
  out+=S3_faxis(x0,y2,w,f0,f1,[100,200,500,1000,2000,5000]);
  return {svg:out,phase:s.n<=2?`With ${s.n} channel${s.n===1?'':'s'} the two vowel peaks (formants) merge and the vowels become hard to tell apart.`:s.n<8?`With ${s.n} channels the first two formant peaks start to show as separate bands, enough for many vowels in quiet.`:`With ${s.n} channels the band levels trace the formants well. Real implants are limited less by electrode count than by current spreading between nearby electrodes.`};
 }});

const S3_CI_MS=[
 {y:1957,t:'Paris',b:'André Djourno and Charles Eyriès stimulate a deaf patient’s auditory nerve with a wire; he hears sounds, but not speech.'},
 {y:1961,t:'Los Angeles',b:'William House and John Doyle implant early single-electrode devices; House’s wearable single-channel system follows in 1972.'},
 {y:1977,t:'Vienna',b:'Ingeborg and Erwin Hochmair implant a multichannel microelectronic device, the start of what became MED-EL.'},
 {y:1978,t:'Melbourne',b:'Graeme Clark’s team implants a multichannel device; it develops into the Nucleus implant.'},
 {y:1984,t:'Approval',b:'The US FDA approves the House/3M single-channel implant for adults; multichannel Nucleus follows in 1985, for children from 1990.'},
 {y:2019,t:'Today',b:'Over 700,000 implants had been registered worldwide by 2019 (NIDCD estimate), many in young children.'}];
SCENE({id:'cochlear-implants-history',name:'From a wire to 700,000 implants',tag:'Sixty years of development',
 definition:'Cochlear implants grew from a single wire placed on an auditory nerve in 1957 to multichannel devices that let many deaf people understand speech, developed in parallel in Paris, Los Angeles, Vienna and Melbourne.',
 example:'Early single-channel implants mostly helped with lip-reading and sound awareness; multichannel implants made open-set speech understanding possible for many users.',
 desc:'A timeline of six milestones from 1957 to today, with the chosen one described.',
 research:'Djourno & Eyriès (1957). Presse Médicale 65. · House (1976). Cochlear implants. Annals of Otology, Rhinology and Laryngology 85 suppl. 27. · Clark (2003). Cochlear Implants: Fundamentals and Applications. Springer. · Hochmair et al. (2006). MED-EL cochlear implants: state of the art. Trends in Amplification 10. · NIDCD (2021). Cochlear implants fact sheet.',
 dur:12,hint:'Press a milestone on the timeline to read what happened.',
 init:()=>({k:2}),
 watch(p){return {k:Math.min(5,Math.floor(p*6))}},
 ui:[],
 on:{pick(s,v){s.k=+v}},
 draw(s,f,X){
  const q=S3_CI_MS[s.k];let out=heading(`${q.y}: ${q.t}`);const x0=60,w=480,y=120,Xy=yr=>x0+(yr-1955)/(2022-1955)*w;
  out+=L(x0,y,x0+w,y,C.line,3);for(const yr of [1960,1980,2000,2020])out+=TF(Xy(yr),y+40,yr,12,C.muted);
  S3_CI_MS.forEach((m,i)=>{const on=i===s.k,x=Xy(m.y);out+=hit(X,'pick',i,`${m.y}, ${m.t}`,Ci(x,y,on?12:9,on?C.coral:'#fff',on?C.coral:C.blue)+TF(x,y-18-(i%2)*16,m.y,12,on?C.coral:C.muted,'middle',on?'font-weight="700"':''))});
  out+=R(70,180,460,130,'#fff',C.grid,12)+TBF(90,208,q.t,15,C.ink,'start');
  const words=q.b.split(' ');let line='',ly=236;for(const wd of words){if((line+wd).length>58){out+=TF(90,ly,line.trim(),13,C.ink,'start');line='';ly+=20}line+=wd+' '}out+=TF(90,ly,line.trim(),13,C.ink,'start');
  return {svg:out,phase:q.b};
 }});

const S3_VIEWS=[
 {t:'Language from the start',b:'What matters most is that a child gets full access to a language early, signed or spoken. Delayed access to any language can harm development (Humphries et al. 2012).',col:C.blue},
 {t:'Outcomes vary',b:'Many implant users understand speech well, especially in quiet; others gain less. Results depend on age at implant, duration of deafness and support.',col:C.amber},
 {t:'Deaf culture',b:'Many Deaf people see deafness as a cultural and linguistic identity, not a defect to fix, with sign languages as full languages. Views on implanting children differ.',col:C.purple},
 {t:'Both together',b:'Some families combine an implant with a sign language (bimodal bilingualism), keeping both communities open to the child.',col:C.green}];
SCENE({id:'cochlear-implants-perspectives',name:'Implants and Deaf perspectives',tag:'Timing, outcomes and identity',
 definition:'Cochlear implants work best when given early, while the auditory system is still developing, but they raise real questions as well as hopes. Deaf communities, families and clinicians weigh language access, identity and outcomes differently.',
 example:'Children implanted before about 3½ years tend to develop typical auditory brain responses; those implanted after about 7 years usually do not (Sharma, Dorman & Spahr 2002).',
 desc:'An age-at-implant slider with an illustrative band of typical spoken-language benefit and the sensitive period marked, and four cards with different perspectives.',
 research:'Sharma, Dorman & Spahr (2002). A sensitive period for the development of the central auditory system in children with cochlear implants. Ear and Hearing 23. · Humphries et al. (2012). Language acquisition for deaf children. Harm Reduction Journal 9. · National Association of the Deaf (2000) position statement on cochlear implants. (Benefit curve illustrative.)',
 dur:12,hint:'Slide the age at implant and press each card to read a different perspective. No single view is the right one for every family.',
 init:()=>({age:2,k:0}),
 watch(p){return {age:Math.round(lerp(1,12,p)*2)/2,k:Math.min(3,Math.floor(p*4))}},
 ui:[{range:'age',label:'Age at implant',min:2,max:24,get:s=>Math.round(s.age*2),act:'age',show:v=>fmt(v/2)+' years'}],
 on:{age(s,v){s.age=v/2},card(s,v){s.k=+v}},
 draw(s,f,X){
  const ben=a=>a<=3.5?1:a>=7?.35:1-.65*(a-3.5)/3.5;let out=heading(`Implant at ${fmt(s.age)} years: ${s.age<=3.5?'within':'after'} the sensitive period`);
  const x0=60,w=240,y0=210,h=120,Xa=a=>x0+(a-1)/11*w;out+=R(Xa(1),y0-h,Xa(3.5)-Xa(1),h,C.greenp,'none',0)+TF(Xa(2.25),y0-h+16,'sensitive period',12,C.green);
  out+=L(x0,y0,x0+w,y0,C.line,1.5);for(const a of [1,3,5,7,9,12])out+=TF(Xa(a),y0+18,a,12,C.muted);out+=TF(x0+w/2,y0+34,'age at implant, years',12,C.muted);
  let d='';for(let a=1;a<=12;a+=.1)d+=(a>1?'L':'M')+fmt(Xa(a))+' '+fmt(y0-ben(a)*h*.9);out+=P(d,C.blue,2.6)+Ci(Xa(s.age),y0-ben(s.age)*h*.9,7,C.coral);
  out+=TF(x0,y0-h-8,'typical spoken-language benefit (illustrative)',12,C.muted,'start');
  S3_VIEWS.forEach((v,i)=>{const on=i===s.k,y=64+i*36;out+=hit(X,'card',i,v.t,R(330,y,250,30,on?v.col:'#fff',v.col,8)+TF(455,y+20,v.t,13,on?'#fff':v.col,'middle','font-weight="650"'))});
  const q=S3_VIEWS[s.k];out+=R(40,262,540,84,'#fff',q.col,10);const words=q.b.split(' ');let line='',ly=286;for(const wd of words){if((line+wd).length>68){out+=TF(56,ly,line.trim(),13,C.ink,'start');line='';ly+=19}line+=wd+' '}out+=TF(56,ly,line.trim(),13,C.ink,'start');
  return {svg:out,phase:`${q.t}: ${q.b}`};
 }});
