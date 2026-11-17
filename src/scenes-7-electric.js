/* ===================== Music era 7 · Recording and electronic sound (1877–today) ===================== */
// Shared helpers for this era (prefix M7_). Sound plays only from on() handlers.
const M7_TAU=Math.PI*2;
// A waveform path: fn(u) for u in [0,1] gives a value in roughly [-1,1].
function M7_wave(fn,x0,y0,w,h,n=180){let d='';for(let i=0;i<=n;i++){const u=i/n,x=x0+w*u,y=y0-h*fn(u);d+=(i?'L':'M')+fmt(x)+' '+fmt(y)}return d}
// Harmonic amplitudes for the classic oscillator shapes (first n harmonics).
function M7_partials(shape,n=16){return range(n).map(i=>{const k=i+1;if(shape==='sine')return k===1?1:0;if(shape==='saw')return 1/k;if(shape==='square')return k%2?1/k:0;if(shape==='triangle')return k%2?1/(k*k):0;return 0})}
// Two-pole low-pass magnitude at harmonic frequency f with cutoff fc and resonance q.
function M7_lp(f,fc,q){const r=f/fc;return 1/Math.sqrt((1-r*r)*(1-r*r)+(r/q)*(r/q))}
// Bessel function of the first kind, integer order, by its power series (fine for x ≤ 12).
function M7_J(n,x){let s=0,f=1;for(let i=1;i<=n;i++)f*=i;let m=0,fm=1,term;do{term=Math.pow(-1,m)*Math.pow(x/2,2*m+n)/(fm*f);s+=term;m++;fm*=m;f*=(m+n)}while(m<40&&Math.abs(term)>1e-12);return s}
// Spectrum bars: amps (0..1) at given x positions; labels under bars optional.
function M7_bars(amps,x0,base,w,h,col,labels){let out='';const bw=w/amps.length;amps.forEach((a,i)=>{const hh=clamp(a,0,1)*h;out+=R(x0+i*bw+2,base-hh,bw-4,hh,typeof col==='function'?col(i):col,'none',3);if(labels)out+=TF(x0+i*bw+bw/2,base+15,labels[i],12,C.muted)});return out+L(x0,base,x0+w,base,C.line,1.5)}
function M7_norm(a){const m=Math.max(...a.map(Math.abs),1e-9);return a.map(v=>v/m)}
// A small one-octave-plus keyboard; keys are hit targets 'key' with semitone arg.
function M7_keys(X,x0,y0,n,lit,act='key'){let out='';const wk=[0,2,4,5,7,9,11],wide=26;let wi=0;const whites=[],blacks=[];
 for(let k=0;k<n;k++){const pc=k%12;if(wk.includes(pc)){whites.push({k,x:x0+wi*wide});wi++}else blacks.push({k,x:x0+wi*wide-8})}
 for(const w of whites)out+=hit(X,act,w.k,`Key ${noteName(48+w.k)}`,R(w.x,y0,wide-2,74,w.k===lit?C.pale:'#fff',w.k===lit?C.blue:C.line,4));
 for(const b of blacks)out+=hit(X,act,b.k,`Key ${noteName(48+b.k)}`,R(b.x,y0,16,46,b.k===lit?C.blue:C.dark,'none',3));
 return out}
// A time-based playhead: start(s, ms) then tick(s) moves s.prog 0→1 and returns 'stop' at the end.
function M7_start(s,ms,ctx,tick='tick'){s.t0=performance.now();s.len=ms;s.prog=0;s.playing=true;s.tok=(s.tok||0)+1;ctx.every(40,tick,s.tok)}
function M7_tick(s,tok){if(Number(tok)!==s.tok||!s.playing)return 'stop';s.prog=clamp((performance.now()-s.t0)/s.len,0,1);if(s.prog>=1){s.playing=false;return 'stop'}return 'keep'}

/* ---------- phonograph ---------- */
const M7_SOUNDS={hum:{name:'Steady hum',parts:[1],amp:.5,f:196},loud:{name:'Loud hum',parts:[1],amp:1,f:196},voice:{name:'Voice-like',parts:[1,.6,.45,.3,.18,.1],amp:.8,f:196},fifth:{name:'Two notes (a fifth)',parts:null,amp:.8,f:196}};
function M7_soundFn(key){const S=M7_SOUNDS[key];if(key==='fifth')return u=>S.amp*.5*(Math.sin(M7_TAU*6*u)+Math.sin(M7_TAU*9*u));const n=M7_norm(S.parts.map((a,i)=>a));const tot=sum(n);return u=>S.amp*n.reduce((acc,a,i)=>acc+a*Math.sin(M7_TAU*6*(i+1)*u),0)/tot}
function M7_hearSound(key){const S=M7_SOUNDS[key];if(key==='fifth'){AUDIO.chord([196,294],{dur:1.2,gain:.18*S.amp+.04})}else AUDIO.tone(S.f,{dur:1.2,partials:S.parts,gain:.07+.13*S.amp})}
SCENE({id:'phonograph',name:'Phonograph',tag:'Sound written into a groove',
 definition:'A machine that records sound as a wavy groove: the air pushes a diaphragm, a stylus fixed to it cuts the groove, and playing it back runs the process in reverse.',
 example:'In 1877 Edison recited “Mary had a little lamb” into a tinfoil cylinder and heard it played back. No electricity was involved: the voice itself cut the groove, and the groove itself moved the horn.',
 desc:'A horn, a diaphragm and a stylus cut a groove whose depth follows the sound wave; in playback the stylus follows the groove and the horn sends the sound back out.',
 research:'Edison, T. A. (1878). The phonograph and its future. North American Review 126.',
 dur:10,hint:'Choose a sound, Record it into the groove, then switch to Play back. Press Hear it to hear the sound the groove holds.',
 init:()=>({snd:'voice',mode:'record',pos:.6}),
 watch(p){return p<.5?{snd:'voice',mode:'record',pos:p*2}:{snd:'voice',mode:'play',pos:(p-.5)*2}},
 ui:[{choose:Object.entries(M7_SOUNDS).map(([k,v])=>[k,v.name]),label:'Sound',get:s=>s.snd,act:'snd'},{choose:[['record','Record'],['play','Play back']],label:'Mode',get:s=>s.mode,act:'mode'},{range:'pos',label:'Groove position',min:0,max:100,get:s=>Math.round(s.pos*100),act:'pos',show:v=>v+'%'},{b:'Hear it',act:'hear'}],
 on:{snd(s,v){s.snd=v},mode(s,v){s.mode=v},pos(s,v){s.pos=v/100},hear(s){M7_hearSound(s.snd)}},
 draw(s,f,X){
  const fn=M7_soundFn(s.snd),rec=s.mode==='record',x0=190,x1=570,surf=210,sx=x0+(x1-x0)*s.pos;let out=heading(rec?'Recording: the voice cuts the groove':'Playing back: the groove moves the voice');
  // horn and diaphragm
  out+=P('M30 120 L120 160 L120 190 L30 230 Z',C.amber,2,C.amberp);
  out+=L(126,150,126,200,C.dark,4);
  const disp=fn(s.pos)*10;out+=L(126,175,sx,surf-4+disp*.4,C.dark,2)+Ci(sx,surf+disp*.6,5,C.coral);
  // sound in / out arrows
  for(let i=0;i<3;i++){const x=rec?18-i*0:110-i*30;out+=rec?P(`M${8+i*14} 160 Q${18+i*14} 175 ${8+i*14} 190`,C.blue,2):P(`M${20+i*12} 160 Q${10+i*12} 175 ${20+i*12} 190`,C.blue,2)}
  out+=TF(75,250,rec?'sound in':'sound out',13,C.blue);
  // cylinder surface (unrolled)
  out+=R(x0,surf-6,x1-x0,70,'#eef2f4',C.line,6);
  const cutTo=rec?s.pos:1;
  out+=P(M7_wave(u=>u<=cutTo?-.5-fn(u)*.45:-.02,x0,surf+12,x1-x0,26),C.dark,2.2);
  if(rec)out+=L(sx,surf-6,sx,surf+64,C.coral,1.5,'stroke-dasharray="4 3"');
  out+=TF((x0+x1)/2,surf+86,rec?'tinfoil cylinder, shown unrolled: louder means a deeper groove':'the stylus rides the hills and dales of the groove',13,C.muted);
  out+=T(380,90,'Groove depth follows the pressure wave',15,C.ink)+P(M7_wave(u=>fn(u),230,130,300,22),C.blue,2);
  out+=TF(380,170,'(the wave, magnified)',13,C.muted);
  return {svg:out,phase:rec?'Air pressure from the voice pushes the diaphragm in and out; the stylus fixed to it presses deeper or shallower into the foil. The groove is the sound, frozen.':'The stylus drops into the deep parts and rises on the shallow ones, shaking the diaphragm in the same pattern. The horn makes that small motion loud enough to hear. Nothing is electric.'};
 }});

const M7_DISC_FORMATS={'78-10':{name:'10-inch, 78 rpm',year:'1900s–1950s',rpm:78,rOut:127,rIn:55,lpmm:3.8},'78-12':{name:'12-inch, 78 rpm',year:'1900s–1950s',rpm:78,rOut:152,rIn:55,lpmm:3.8},'45-7':{name:'7-inch, 45 rpm',year:'1949–',rpm:45,rOut:88,rIn:55,lpmm:8},'lp-12':{name:'12-inch long-playing, 33⅓ rpm',year:'1948–',rpm:100/3,rOut:150,rIn:60,lpmm:9}};
function M7_discMinutes(F){return (F.rOut-F.rIn)*F.lpmm/F.rpm}
SCENE({id:'phonograph-lateral',name:'Cylinder and disc',tag:'Up and down, or side to side',
 definition:'Edison’s cylinders cut the groove up and down (“hill and dale”); Berliner’s gramophone disc of 1887 wiggled it side to side (lateral). A flat disc could be stamped from a metal master by the thousand.',
 example:'Early cylinders could not be copied easily, so performers sang the same song many times into several recording horns at once. A disc master made one performance enough for any number of copies.',
 desc:'Two groove cross-sections, vertical and lateral, above a row of copies made either by repeated performances or by stamping from one master.',
 research:'Berliner, E. (1887). US Patent 372,786, Gramophone. · Gelatt, R. (1977). The Fabulous Phonograph, 1877–1977.',
 dur:9,hint:'Pick a groove type and the number of copies you need. Compare how many performances each method takes.',
 init:()=>({kind:'lateral',copies:20}),
 watch(p){return {kind:p<.5?'vertical':'lateral',copies:Math.round(5+smooth(p)*45)}},
 ui:[{choose:[['vertical','Hill and dale (cylinder)'],['lateral','Lateral (disc)']],label:'Groove',get:s=>s.kind,act:'kind'},{range:'copies',label:'Copies needed',min:1,max:60,get:s=>s.copies,act:'copies'}],
 on:{kind(s,v){s.kind=v},copies(s,v){s.copies=v}},
 draw(s){
  let out=heading('Two ways to cut a groove');const vert=s.kind==='vertical';
  // panel 1: vertical
  out+=R(30,50,260,130,vert?'#fff':'#f6f8f9',vert?C.blue:C.grid,10)+TB(160,72,'Hill and dale (cylinder)',14,vert?C.blue:C.muted);
  out+=P(M7_wave(u=>-.3-.35*Math.sin(M7_TAU*4*u),50,120,220,60),C.dark,2.2)+L(50,120,270,120,C.line,1)+TF(160,170,'depth goes up and down',13,C.muted);
  out+=R(310,50,260,130,!vert?'#fff':'#f6f8f9',!vert?C.blue:C.grid,10)+TB(440,72,'Lateral (disc)',14,!vert?C.blue:C.muted);
  out+=P(M7_wave(u=>.35*Math.sin(M7_TAU*4*u),330,125,220,40),C.dark,6)+P(M7_wave(u=>.35*Math.sin(M7_TAU*4*u),330,125,220,40),'#eef2f4',2.5)+TF(440,170,'seen from above: it wiggles sideways',13,C.muted);
  // copies
  const perf=vert?Math.ceil(s.copies/5):1;
  out+=TB(300,214,`${s.copies} copies: ${perf} performance${perf>1?'s':''}`,17,vert?C.coral:C.green);
  const n=Math.min(s.copies,60);for(let i=0;i<n;i++){const x=40+(i%20)*26.5,y=232+Math.floor(i/20)*34;out+=vert?R(x,y,16,26,C.amberp,C.amber,3):Ci(x+10,y+13,11,'#2b3d47','none')+Ci(x+10,y+13,3,C.amberp)}
  out+=TF(300,350,vert?'Illustrative: five recording horns per performance, so every fifth copy needs the singer again.':'One performance makes a master; a metal stamper presses as many discs as you need.',13,C.muted);
  return {svg:out,phase:vert?'Before moulded cylinders arrived around 1902, each cylinder was a separate recording. Studios ran several machines at once, but popular songs still had to be sung over and over.':'Berliner’s disc could be pressed like a printing plate. That, more than sound quality, is why the flat disc won the format war in the 1910s and 1920s.'};
 }});

SCENE({id:'phonograph-three-minutes',name:'Why songs last three minutes',tag:'The medium shapes the music',
 definition:'A record side holds only as much music as its groove is long. Early 78 rpm discs held about three minutes, and popular songs were written to fit.',
 example:'A 10-inch 78 played for roughly three minutes, so singles settled at that length. The long-playing microgroove record of 1948 held over twenty minutes a side, room for a whole symphony movement or a concept album.',
 desc:'A disc with its playing band drawn as a ring of grooves, and a bar chart of playing time per side for four record formats.',
 research:'Katz, M. (2004). Capturing Sound: How Technology Has Changed Music. · Goldmark, Snepvangers & Bachman (1949), the long-playing microgroove record, Proceedings of the IRE.',
 dur:9,hint:'Choose a record format. Playing time = (width of the groove band × grooves per millimetre) ÷ turns per minute.',
 init:()=>({fmt:'78-10'}),
 watch(p){const k=Object.keys(M7_DISC_FORMATS);return {fmt:k[Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.entries(M7_DISC_FORMATS).map(([k,v])=>[k,v.name.replace(', ',' ')]),label:'Format',get:s=>s.fmt,act:'fmt'}],
 on:{fmt(s,v){s.fmt=v}},
 draw(s){
  const F=M7_DISC_FORMATS[s.fmt],min=M7_discMinutes(F),sc=.55;let out=heading('Playing time per side');
  const cx=140,cy=200;out+=Ci(cx,cy,F.rOut*sc,'#1d2a33')+Ci(cx,cy,F.rIn*sc,C.amberp)+Ci(cx,cy,5,'#fff');
  for(let r=F.rIn*sc+3;r<F.rOut*sc-1;r+=Math.max(1.6,6/F.lpmm))out+=Ci(cx,cy,r,'none','#3c4f5b','stroke-width=".6"');
  out+=TB(cx,cy+F.rOut*sc+24,F.name,14,C.ink)+TF(cx,cy+F.rOut*sc+42,F.year,13,C.muted)+TF(cx,cy+F.rOut*sc+60,`about ${F.lpmm} grooves per mm`,13,C.muted);
  out+=TB(cx,cy+4,`${fmt(F.rpm)} rpm`,13,C.ink);
  const keys=Object.keys(M7_DISC_FORMATS),x0=300,base=310,max=26;
  out+=L(x0,base,580,base,C.line,1.5);
  keys.forEach((k,i)=>{const G=M7_DISC_FORMATS[k],m=M7_discMinutes(G),h=200*m/max,x=x0+12+i*68,on=k===s.fmt;out+=R(x,base-h,48,h,on?C.blue:'#c9d8e2','none',4)+TBF(x+24,base-h-8,fmt(Math.round(m*10)/10)+' min',13,on?C.blue:C.muted)+TF(x+24,base+16,G.name.split(',')[0].replace('-inch','″'),12,C.muted)+TF(x+24,base+31,k==='lp-12'?'33⅓':String(G.rpm),12,C.muted)});
  const songY=base-200*3/max;out+=L(x0,songY,580,songY,C.coral,1.5,'stroke-dasharray="5 4"')+TF(578,songY-6,'a 3-minute song',13,C.coral,'end');
  return {svg:out,phase:`${F.name}: (${F.rOut} − ${F.rIn} mm) × ${F.lpmm} grooves/mm ÷ ${fmt(Math.round(F.rpm*100)/100)} rpm ≈ ${fmt(Math.round(min*10)/10)} minutes. ${s.fmt==='78-10'?'That is the origin of the three-minute pop song.':s.fmt==='lp-12'?'Finer grooves and a slower turntable gave the album its length.':''}`};
 }});

/* ---------- microphones-speakers ---------- */
SCENE({id:'microphones-speakers',name:'Microphone',tag:'Sound into voltage',
 definition:'A transducer that turns sound into an electrical signal. In a dynamic microphone the diaphragm moves a coil of wire inside a magnet, and the moving coil produces a voltage.',
 example:'The voltage is largest when the coil moves fastest, which is a quarter of a cycle before the diaphragm is furthest out. That is Faraday’s law of induction at work in every dynamic microphone.',
 desc:'A pressure wave pushes a diaphragm attached to a coil sitting in the gap of a magnet; two traces show the diaphragm position and the voltage it produces.',
 research:'Faraday, M. (1832). Experimental researches in electricity. · Wente, E. C. & Thuras, A. L. (1931), moving-coil microphone, Bell Telephone Laboratories.',
 dur:9,hint:'Change the loudness and pitch, and slide through one moment of the cycle. Hear it plays the tone the microphone picks up.',
 init:()=>({loud:.7,pitch:220,ph:.15}),
 watch(p){return {loud:.75,pitch:220,ph:(p*4)%1}},
 ui:[{range:'loud',label:'Loudness',min:10,max:100,get:s=>Math.round(s.loud*100),act:'loud',show:v=>v+'%'},{range:'pitch',label:'Pitch',min:110,max:880,step:10,get:s=>s.pitch,act:'pitch',show:v=>v+' Hz'},{range:'ph',label:'Moment',min:0,max:100,get:s=>Math.round(s.ph*100),act:'ph',show:v=>v+'%'},{b:'Hear it',act:'hear'}],
 on:{loud(s,v){s.loud=v/100},pitch(s,v){s.pitch=v},ph(s,v){s.ph=v/100},hear(s){AUDIO.tone(s.pitch,{dur:1,gain:.05+.15*s.loud})}},
 draw(s){
  const a=s.loud,ph=s.ph,disp=a*Math.sin(M7_TAU*ph),vel=a*Math.cos(M7_TAU*ph);let out=heading('Dynamic microphone: a coil moving in a magnet');
  // pressure arcs
  for(let i=0;i<4;i++){const x=40+i*22-((ph*22)%22);out+=P(`M${fmt(x)} 120 Q${fmt(x+14)} 160 ${fmt(x)} 200`,C.blue,2,'none',`opacity="${(.4+.15*i).toFixed(2)}"`)}
  const dx=150+disp*14;
  out+=P(`M${fmt(dx)} 100 Q${fmt(dx+10+disp*6)} 160 ${fmt(dx)} 220`,C.dark,4);
  out+=R(dx+8,148,40,24,C.amberp,C.amber,4)+TF(dx+28,190,'coil',13,C.amber);
  out+=P('M200 120 H260 V200 H200 M200 140 H240 V180 H200',C.coral,6)+TF(230,108,'magnet',13,C.coral);
  out+=L(dx+48,160,330,160,C.ink,1.5)+arrow(300,160,330,160,C.ink,1.5,6);
  // traces
  const x0=340,w=230;out+=R(x0-6,70,w+12,240,'#fff',C.grid,8);
  out+=TF(x0+4,90,'diaphragm position',13,C.dark,'start')+L(x0,140,x0+w,140,C.grid,1)+P(M7_wave(u=>a*Math.sin(M7_TAU*(2*u)),x0,140,w,36),C.dark,2);
  out+=TF(x0+4,200,'voltage out',13,C.blue,'start')+L(x0,250,x0+w,250,C.grid,1)+P(M7_wave(u=>a*Math.cos(M7_TAU*(2*u)),x0,250,w,36),C.blue,2);
  const mx=x0+w*(ph/2);out+=L(mx,96,mx,300,C.coral,1.5,'stroke-dasharray="4 3"')+Ci(mx,140-36*disp,4,C.dark)+Ci(mx,250-36*vel,4,C.blue);
  out+=TF(300,350,`Voltage now: ${vel>=0?'+':'−'}${fmt(Math.abs(vel)*10)} mV (illustrative scale) · it peaks when the coil moves fastest`,13,C.muted);
  return {svg:out,phase:`Louder sound moves the coil further and faster, so the voltage is bigger. Higher pitch moves it more often, so the voltage swings faster. The voltage leads the position by a quarter of a cycle, because it depends on speed, not on place.`};
 }});

function M7_loopGain(s){return s.gain*.06/(s.dist*s.dist)}
SCENE({id:'microphones-speakers-feedback',name:'Loudspeaker and feedback',tag:'The same idea in reverse',
 definition:'A loudspeaker is a microphone run backwards: a current through the coil pushes the cone. Put a microphone in front of an amplified speaker and the sound can loop round and grow into a howl.',
 example:'If each trip round the loop comes back louder than it went (loop gain above 1), the sound grows without limit until the amplifier clips: the familiar feedback squeal at concerts.',
 desc:'A microphone feeds an amplifier which drives a speaker; a dashed path returns from the speaker to the microphone, with bars showing the level after each trip round the loop.',
 research:'Rice, C. W. & Kellogg, E. W. (1925). Notes on the development of a new type of hornless loud speaker. · Nyquist, H. (1932). Regeneration theory. Bell System Technical Journal.',
 dur:9,hint:'Raise the amplifier gain or bring the speaker closer to the microphone. When the loop gain passes 1 the level grows every trip: that is feedback.',
 init:()=>({gain:8,dist:1.2}),
 watch(p){return {gain:4+p*14,dist:1.2}},
 ui:[{range:'gain',label:'Amplifier gain',min:1,max:30,get:s=>Math.round(s.gain),act:'gain',show:v=>'×'+v},{range:'dist',label:'Speaker distance',min:50,max:300,step:10,get:s=>Math.round(s.dist*100),act:'dist',show:v=>(v/100).toFixed(1)+' m'},{b:'Hear it',act:'hear'}],
 on:{gain(s,v){s.gain=v},dist(s,v){s.dist=v/100},hear(s){const g=M7_loopGain(s);if(g>1){AUDIO.tone(1250,{dur:1.4,gain:.05,attack:1.1,release:.1})}else AUDIO.tone(220,{dur:.8,gain:.14})}},
 draw(s){
  const g=M7_loopGain(s),howl=g>1;let out=heading('Microphone → amplifier → speaker → back again');
  out+=R(40,100,70,60,'#fff',C.dark,10)+TF(75,180,'microphone',13,C.ink);
  out+=P('M170 95 L250 130 L170 165 Z',C.blue,2,C.pale)+TB(200,135,'×'+Math.round(s.gain),14,C.blue)+TF(210,180,'amplifier',13,C.ink);
  out+=arrow(110,130,168,130,C.ink,2,7)+arrow(252,130,320,130,C.ink,2,7);
  out+=P('M330 105 H350 L380 85 V175 L350 155 H330 Z',C.dark,2,'#eef2f4')+TF(355,195,'speaker',13,C.ink);
  out+=P('M380 130 Q470 40 300 40 Q110 40 75 95',howl?C.coral:C.line,2.5,'none','stroke-dasharray="7 5"')+TF(470,62,`back to the mic (${s.dist.toFixed(1)} m)`,13,C.muted);
  out+=TB(470,140,`loop gain ${fmt(Math.round(g*100)/100)}`,18,howl?C.coral:C.green);
  out+=TF(470,162,howl?'above 1: every trip is louder':'below 1: every trip is quieter',13,howl?C.coral:C.green);
  // levels per trip
  out+=TF(300,232,'level after each trip round the loop',13,C.muted);let lv=1;
  for(let i=0;i<10;i++){const h=clamp(lv,0,6)/6*90;out+=R(70+i*48,330-h,32,h,howl?C.coralp:C.greenp,howl?C.coral:C.green,4);lv*=g}
  out+=L(60,330,550,330,C.line,1.5);
  if(howl)out+=TF(300,358,'Real amplifiers clip at their maximum, so the howl settles at one loud pitch.',13,C.coral);
  return {svg:out,phase:howl?`Loop gain ${fmt(Math.round(g*100)/100)}: the sound comes back louder each time round, so it grows into a howl. Turn the gain down or move the speaker away.`:`Loop gain ${fmt(Math.round(g*100)/100)}: each trip round the loop is quieter, so the echo dies away. Engineers keep loop gain safely below 1 (Nyquist’s condition).`};
 }});

SCENE({id:'microphones-speakers-pickup',name:'Electric guitar pickup',tag:'Where you listen changes the tone',
 definition:'A pickup is a magnet wrapped in a coil under steel strings. A vibrating string changes the magnetic field, inducing a voltage that copies the string’s motion at that spot.',
 example:'A pickup near the bridge sits close to a node of the low harmonics, so it hears relatively more high harmonics: a brighter, thinner tone. Near the neck it sounds warmer.',
 desc:'A string with a pluck point and a pickup position, above a bar chart of the first ten harmonics the pickup hears.',
 research:'Beauchamp, G. D. (1937). US Patent 2,089,171, Electrical stringed musical instrument. · Standing-wave modes of a string (Mersenne 1636; Bernoulli 1753).',
 dur:9,hint:'Move the pickup and the pluck point along the string, then press Hear it to compare bridge and neck tones.',
 init:()=>({pick:.12,pluck:.25}),
 watch(p){return {pick:.06+p*.44,pluck:.25}},
 ui:[{range:'pick',label:'Pickup (from bridge)',min:3,max:50,get:s=>Math.round(s.pick*100),act:'pick',show:v=>v+'%'},{range:'pluck',label:'Pluck point',min:5,max:50,get:s=>Math.round(s.pluck*100),act:'pluck',show:v=>v+'%'},{b:'Hear it',act:'hear'}],
 on:{pick(s,v){s.pick=v/100},pluck(s,v){s.pluck=v/100},hear(s){AUDIO.tone(110,{dur:1.4,partials:M7_pickup(s),gain:.2,release:.9})}},
 draw(s){
  const amps=M7_norm(M7_pickup(s));let out=heading('The pickup hears the string where it sits');
  const x0=60,x1=540,y=110;out+=L(x0,y,x1,y,C.dark,2.5)+R(x1,y-16,12,32,C.dark,'none',2)+TF(x1+6,y+34,'bridge',13,C.muted)+R(x0-12,y-16,12,32,C.dark,'none',2)+TF(x0-6,y+34,'nut',13,C.muted);
  const px=x1-(x1-x0)*s.pick,kx=x1-(x1-x0)*s.pluck;
  out+=R(px-14,y+10,28,16,C.dark,'none',3)+TF(px,y+44,'pickup',13,C.ink);
  out+=arrow(kx,y-42,kx,y-6,C.coral,2,7)+TF(kx,y-48,'pluck',13,C.coral);
  // faint mode shapes for first three harmonics
  [1,2,3].forEach((n,i)=>out+=P(M7_wave(u=>Math.sin(Math.PI*n*u)*.9,x0,y,x1-x0,18),[C.blue,C.green,C.purple][i],1.2,'none','opacity=".45"'));
  out+=M7_bars(amps,80,320,440,140,i=>i===0?C.blue:C.purple,range(10).map(i=>String(i+1)));
  out+=TF(300,350,'harmonic number',13,C.muted)+TF(300,175,'what the pickup hears (relative strength of each harmonic)',13,C.muted);
  const bright=sum(amps.slice(3))/sum(amps);
  return {svg:out,phase:`Harmonics with a node at the pickup are silent there. With the pickup ${Math.round(s.pick*100)}% of the way from the bridge, ${Math.round(bright*100)}% of what it hears is harmonics 4 and above, so the tone is ${bright>.2?'bright':bright>.08?'balanced':'warm'}.`};
 }});
function M7_pickup(s){return range(10).map(i=>{const n=i+1;return Math.abs(Math.sin(n*Math.PI*s.pluck)/(n*n)*Math.sin(n*Math.PI*s.pick))})}

/* ---------- tape-music ---------- */
const M7_MELODY=[60,62,64,67,64,62,60,55];
SCENE({id:'tape-music',name:'Tape speed',tag:'Pitch and tempo move together',
 definition:'Playing a tape faster raises the pitch and shortens the time by the same factor: double speed is an octave higher and twice as fast. Early tape composers used this as an instrument.',
 example:'Pierre Schaeffer’s musique concrète, from 1948, built pieces from recorded sounds (trains, pans, voices), sped up, slowed down and cut together.',
 desc:'A strip of tape carrying a short melody passes a playback head; the speed changes both the pitch of each note and how long the phrase takes.',
 research:'Schaeffer, P. (1948). Étude aux chemins de fer (railway study), Paris. · Schaeffer, P. (1952). À la recherche d’une musique concrète.',
 dur:10,hint:'Set the tape speed and press Play. Every halving or doubling of speed moves the melody a whole octave.',
 init:()=>({speed:1,prog:0,playing:false}),
 watch(p){const sp=p<.34?1:p<.67?2:.5;return {speed:sp,prog:(p*3)%1,playing:true}},
 ui:[{range:'speed',label:'Tape speed',min:25,max:200,step:5,get:s=>Math.round(s.speed*100),act:'speed',show:v=>'×'+(v/100).toFixed(2)},{b:'Play',act:'play'}],
 on:{speed(s,v){s.speed=v/100},play(s,a,ctx){const step=.32/s.speed;AUDIO.seq(M7_MELODY.map((m,i)=>({hz:midiHz(m)*s.speed,at:i*step,dur:step*.9})),{gain:.13});M7_start(s,M7_MELODY.length*step*1000,ctx)},tick(s,t){return M7_tick(s,t)}},
 draw(s){
  const semis=12*Math.log2(s.speed),secs=M7_MELODY.length*.32/s.speed;let out=heading('Faster tape: higher and quicker');
  const y=150,x0=40,x1=560,w=(x1-x0)/M7_MELODY.length;
  out+=R(x0,y-30,x1-x0,60,'#5b4636','none',4);
  M7_MELODY.forEach((m,i)=>{const h=8+(m-52)*2.6;out+=R(x0+i*w+6,y+18-h,w-12,h,'#d9b88f','none',3)});
  const hx=x0+(x1-x0)*s.prog;out+=R(hx-5,y-44,10,88,C.coral,'none',3)+TF(hx,y+62,'playback head',13,C.coral);
  out+=counter(70,250,'speed','×'+fmt(Math.round(s.speed*100)/100),C.blue,130)+counter(235,250,'pitch shift',(semis>=0?'+':'')+fmt(Math.round(semis*10)/10)+' semitones',C.purple,150)+counter(405,250,'phrase lasts',fmt(Math.round(secs*100)/100)+' s',C.green,130);
  out+=TF(300,330,`First note: ${noteName(60)} becomes ${fmt(Math.round(midiHz(60)*s.speed))} Hz (${s.speed===1?'unchanged':noteName(Math.round(60+semis))})`,14,C.ink);
  return {svg:out,phase:`At ×${fmt(Math.round(s.speed*100)/100)} every frequency is multiplied and every duration divided by the same number, so pitch and tempo cannot be changed separately on tape. (Digital time-stretching later broke that link.)`};
 }});

const M7_SEGS=[{m:60,c:'#1772b7'},{m:64,c:'#2c776c'},{m:67,c:'#7156a6'},{m:72,c:'#c45238'},{m:62,c:'#9a6200'},{m:55,c:'#546873'}];
SCENE({id:'tape-music-edit',name:'Splice, reverse, loop',tag:'Editing with a razor blade',
 definition:'On tape, sound became a physical object: composers cut it with a razor blade, spliced pieces in a new order, played them backwards and joined the ends into loops.',
 example:'A piano note played backwards swells up from nothing and stops dead: reversal turns a sharp attack into a slow fade-in. Loops repeat a fragment for as long as the machine runs.',
 desc:'A strip of tape cut into six coloured pieces; pieces can be swapped, the whole strip reversed and looped, and the order is played back.',
 research:'Schaeffer, P. (1952). À la recherche d’une musique concrète. · Cage, J. (1952–53). Williams Mix, assembled from a great many tape splices.',
 dur:10,hint:'Press one piece, then another, to splice them into each other’s places. Try Reverse and Loop, then Play.',
 init:()=>({order:[0,1,2,3,4,5],rev:false,loops:1,sel:null,prog:0,playing:false}),
 watch(p){const k=Math.min(3,Math.floor(p*4));const orders=[[0,1,2,3,4,5],[3,1,2,0,4,5],[3,1,5,0,4,2],[3,1,5,0,4,2]];return {order:orders[k],rev:k===3,loops:1,sel:null,prog:0}},
 ui:[{b:'Reverse',act:'rev'},{choose:[[1,'Once'],[2,'Loop ×2'],[4,'Loop ×4']],label:'Loop',get:s=>s.loops,act:'loops'},{b:'Play',act:'play'}],
 on:{seg(s,i){i=Number(i);if(s.sel===null){s.sel=i;return}const a=s.order.indexOf(s.sel),b=s.order.indexOf(i);[s.order[a],s.order[b]]=[s.order[b],s.order[a]];s.sel=null},
  rev(s){s.rev=!s.rev},loops(s,v){s.loops=Number(v)},
  play(s,a,ctx){const seq=s.rev?s.order.slice().reverse():s.order,step=.34,notes=[];for(let l=0;l<s.loops;l++)seq.forEach((k,i)=>notes.push({hz:midiHz(M7_SEGS[k].m),at:(l*seq.length+i)*step,dur:step*.95,attack:s.rev?step*.85:.01,release:s.rev?.02:step*.7}));AUDIO.seq(notes,{gain:.13});M7_start(s,notes.length*step*1000,ctx)},
  tick(s,t){return M7_tick(s,t)}},
 draw(s,f,X){
  let out=heading('Tape as a material you can cut');const seq=s.rev?s.order.slice().reverse():s.order,x0=40,w=86,y=110;
  seq.forEach((k,i)=>{const S=M7_SEGS[k],x=x0+i*w,sel=s.sel===k;
   const env=s.rev?u=>Math.pow(u,2):u=>Math.pow(1-u,2);
   const inner=R(x,y,w-6,90,'#5b4636',sel?'#ffd24a':'none',4)+R(x+6,y+10,w-18,70,S.c,'none',3)+P(M7_wave(u=>env(u)*Math.sin(M7_TAU*6*u),x+8,y+45,w-22,28),'#fff',1.6)+TF(x+(w-6)/2,y+112,noteName(S.m),13,C.ink);
   out+=hit(X,'seg',k,`Tape piece ${noteName(S.m)}${sel?', selected':''}. Press to splice.`,inner);if(i)out+=L(x-3,y-6,x-3,y+96,'#ffd24a',2,'stroke-dasharray="3 3"')});
  if(s.loops>1)out+=P(`M${x0+5} ${y+130} Q300 ${y+190} ${x0+6*w-12} ${y+130}`,C.blue,2,'none','stroke-dasharray="6 4"')+TF(300,y+176,`joined into a loop: plays ${s.loops} times`,13,C.blue);
  if(s.playing){const total=seq.length*s.loops,cur=Math.min(total-1,Math.floor(s.prog*total))%seq.length;out+=R(x0+cur*w-2,y-8,w-2,106,'none',C.coral,6,'stroke-width="3"')}
  out+=TF(300,330,s.rev?'Reversed: each note now swells in and cuts off sharply.':'Forwards: each note starts sharply and fades.',14,C.ink);
  out+=TF(300,352,s.sel!==null?'Now press the piece to swap it with.':'Yellow dashes mark splices, where tape was cut and joined.',13,C.muted);
  return {svg:out,phase:'Cutting tape at an angle and joining it with tape made edits silent. Reversing turns a note’s fast attack and slow decay inside out, which is why reversed sounds feel like they are being sucked in.'};
 }});

SCENE({id:'tape-music-radiophonic',name:'Sound from scratch on tape',tag:'The Radiophonic Workshop',
 definition:'Before synthesisers, electronic music was built note by note: each tone recorded from an oscillator, cut to the right length of tape and spliced into a line, then lines were mixed together.',
 example:'At the BBC Radiophonic Workshop, Delia Derbyshire realised Ron Grainer’s 1963 Doctor Who theme this way, timing every note by measuring tape. Daphne Oram, a co-founder, later built Oramics, which turned drawings on film into sound.',
 desc:'A ruler of tape showing how long each note must be cut at a chosen tape speed, and a stack of layers showing how hiss builds up as layers are copied together.',
 research:'Niebur, L. (2010). Special Sound: The Creation and Legacy of the BBC Radiophonic Workshop. · Oram, D. (1972). An Individual Note of Music, Sound and Electronics.',
 dur:9,hint:'Choose a tape speed and a note length to see how much tape to cut. Add layers to see why each copy adds hiss.',
 init:()=>({ips:15,ms:250,layers:3}),
 watch(p){return {ips:p<.5?15:7.5,ms:250,layers:1+Math.floor(p*6)}},
 ui:[{choose:[[15,'15 inches/s'],[7.5,'7½ inches/s']],label:'Tape speed',get:s=>s.ips,act:'ips'},{range:'ms',label:'Note length',min:50,max:1000,step:25,get:s=>s.ms,act:'ms',show:v=>v+' ms'},{range:'layers',label:'Layers mixed',min:1,max:8,get:s=>s.layers,act:'layers'},{b:'Hear a phrase',act:'hear'}],
 on:{ips(s,v){s.ips=Number(v)},ms(s,v){s.ms=v},layers(s,v){s.layers=v},hear(s){const d=s.ms/1000;AUDIO.seq([45,45,57,45].map((m,i)=>({hz:midiHz(m),at:i*d,dur:d*.9})),{type:'triangle',gain:.16});if(s.layers>3)AUDIO.noise({dur:d*4,gain:.015*(s.layers-3)})}},
 draw(s){
  const cmPerS=s.ips*2.54,cm=cmPerS*s.ms/1000;let out=heading('Every note is a measured piece of tape');
  out+=R(40,70,520,44,'#5b4636','none',4);const pxPerCm=520/60;
  for(let c=0;c<=60;c+=5)out+=L(40+c*pxPerCm,114,40+c*pxPerCm,124,C.muted,1)+(c%10===0?TF(40+c*pxPerCm,138,c+' cm',12,C.muted):'');
  const w=Math.min(520,cm*pxPerCm);out+=R(40,74,w,36,C.amberp,C.amber,3)+TB(40+Math.max(w,60)/2+(w<60?w/2+30:0),97,fmt(Math.round(cm*10)/10)+' cm',14,C.ink);
  out+=TF(300,160,`${s.ms} ms at ${s.ips === 15 ? '15' : '7½'} inches per second (${fmt(Math.round(cmPerS*10)/10)} cm/s) needs ${fmt(Math.round(cm*10)/10)} cm of tape`,14,C.ink);
  // layers and hiss
  out+=TF(300,198,'each layer is copied onto the next tape, adding a little hiss',13,C.muted);
  for(let i=0;i<s.layers;i++){const y=210+i*16;out+=R(150,y,300,12,[C.blue,C.green,C.purple,C.coral,C.amber,C.dark,C.blue,C.green][i],'none',3)}
  const hissDb=-60+10*Math.log10(s.layers);out+=counter(470,230,'hiss level',fmt(Math.round(hissDb*10)/10)+' dB',s.layers>4?C.coral:C.green,110);
  out+=TF(300,354,'Illustrative: equal hiss per copy adds up as 10 × log₁₀(copies) dB.',13,C.muted);
  return {svg:out,phase:'Derbyshire and her colleagues timed music with rulers: a crotchet at a given tempo was so many centimetres of tape. Every extra generation of copying added hiss, so layers were planned carefully.'};
 }});

/* ---------- synthesis ---------- */
SCENE({id:'synthesis',name:'Subtractive synthesis',tag:'Oscillator, filter, amplifier',
 definition:'Building a sound electronically: an oscillator makes a bright wave rich in harmonics, a filter removes some of them, and an amplifier shapes how loud it is over time.',
 example:'Lowering a low-pass filter’s cutoff dulls a sawtooth from a buzz to a soft hum; raising its resonance adds a peak that makes the classic “wah” of voltage-controlled synthesisers in the 1960s and 1970s.',
 desc:'A signal chain of oscillator, filter and amplifier above a spectrum of harmonics with the filter’s response drawn over it.',
 research:'Moog, R. A. (1965). Voltage-controlled electronic music modules. Journal of the Audio Engineering Society 13(3). · Carlos, W. (1968). Switched-On Bach.',
 dur:10,hint:'Choose a waveform, then move the filter cutoff and resonance. Hear it plays the filtered sound.',
 init:()=>({shape:'saw',cut:6,res:1.4}),
 watch(p){return {shape:'saw',cut:1+p*11,res:p>.6?4:1.2}},
 ui:[{choose:[['sine','Sine'],['triangle','Triangle'],['square','Square'],['saw','Sawtooth']],label:'Oscillator',get:s=>s.shape,act:'shape'},{range:'cut',label:'Cutoff',min:1,max:16,step:.5,get:s=>s.cut,act:'cut',show:v=>'harmonic '+v},{range:'res',label:'Resonance',min:.7,max:8,step:.1,get:s=>s.res,act:'res',show:v=>'Q '+v},{b:'Hear it',act:'hear'}],
 on:{shape(s,v){s.shape=v},cut(s,v){s.cut=v},res(s,v){s.res=v},hear(s){AUDIO.tone(110,{dur:1.3,partials:M7_filtered(s),gain:.2})}},
 draw(s){
  const raw=M7_partials(s.shape),out1=M7_filtered(s),nr=M7_norm(out1);let out=heading('Oscillator → filter → amplifier');
  [['oscillator',70,C.blue],['filter',230,C.purple],['amplifier',390,C.green]].forEach(([n,x,c])=>out+=R(x,52,130,40,'#fff',c,8)+TB(x+65,77,n,14,c));
  out+=arrow(200,72,228,72,C.ink,2,6)+arrow(360,72,388,72,C.ink,2,6)+arrow(520,72,548,72,C.ink,2,6)+TF(565,76,'out',13,C.ink);
  const x0=70,w=460,base=300,h=150,n=16,bw=w/n;
  raw.forEach((a,i)=>{const hh=a*h;out+=R(x0+i*bw+3,base-hh,bw-6,hh,'#dfe7ec','none',3)});
  out1.forEach((a,i)=>{const hh=clamp(a,0,1.6)/1.6*h*1.0;out+=R(x0+i*bw+6,base-Math.min(h,a*h),bw-12,Math.min(h,a*h),C.purple,'none',3)});
  let d='';for(let i=0;i<=120;i++){const k=1+15*i/120,g=Math.min(2.2,M7_lp(k,s.cut,s.res));d+=(i?'L':'M')+fmt(x0+(k-.5)*bw)+' '+fmt(base-g/2.2*h)}out+=P(d,C.coral,2);
  out+=L(x0,base,x0+w,base,C.line,1.5);for(let k=1;k<=16;k+=3)out+=TF(x0+(k-.5)*bw,base+16,k,12,C.muted);
  out+=TF(300,base+36,'harmonic number · grey = oscillator, purple = after the filter, red = filter response',13,C.muted);
  out+=P(M7_wave(u=>{let v=0;nr.forEach((a,i)=>v+=a*Math.sin(M7_TAU*2*(i+1)*u));return v/Math.max(1,sum(nr))*1.6},420,125,150,22),C.dark,1.6)+TF(495,150,'output wave',12,C.muted);
  return {svg:out,phase:`The ${s.shape==='saw'?'sawtooth contains every harmonic':s.shape==='square'?'square wave contains odd harmonics':s.shape==='triangle'?'triangle has weak odd harmonics':'sine has only the fundamental'}. The low-pass filter passes harmonics below about ${fmt(s.cut)} and cuts those above${s.res>3?'; high resonance boosts the harmonics right at the cutoff':''}.`};
 }});
function M7_filtered(s){return M7_partials(s.shape).map((a,i)=>a*M7_lp(i+1,s.cut,s.res))}

SCENE({id:'synthesis-voltage',name:'Voltage control',tag:'One volt per octave',
 definition:'In a voltage-controlled synthesiser every setting can be a voltage, so one module can play another. The common pitch standard is one volt per octave: each extra volt doubles the frequency.',
 example:'A keyboard sends 1/12 of a volt more for each key to the right. Because pitch is exponential in voltage, equal steps in volts give equal musical steps, from bass to treble.',
 desc:'A two-octave keyboard sends a control voltage to the oscillator; a curve shows frequency doubling for each added volt, with the pressed key marked.',
 research:'Moog, R. A. (1965). Voltage-controlled electronic music modules. Journal of the Audio Engineering Society. · Buchla, D. (1963–65), the modular electronic music system built for the San Francisco Tape Music Center.',
 dur:9,hint:'Press keys to send a control voltage. Watch the volts rise in equal steps while the frequency doubles every octave.',
 init:()=>({key:7}),
 watch(p){return {key:Math.min(24,Math.floor(p*25))}},
 on:{key(s,k){s.key=Number(k);AUDIO.tone(midiHz(48+s.key),{type:'sawtooth',dur:.6,gain:.09})}},
 draw(s,f,X){
  const V=s.key/12,hz=midiHz(48)*Math.pow(2,V);let out=heading('Keyboard → control voltage → oscillator pitch');
  out+=M7_keys(X,40,60,25,s.key);
  out+=counter(420,60,'control voltage',fmt(Math.round(V*1000)/1000)+' V',C.blue,140)+counter(420,116,'frequency',fmt(Math.round(hz*10)/10)+' Hz · '+noteName(48+s.key),C.purple,140);
  const x0=70,y0=330,w=460,h=150;out+=L(x0,y0,x0+w,y0,C.line,1.5)+L(x0,y0,x0,y0-h,C.line,1.5);
  let d='';for(let i=0;i<=100;i++){const v=2*i/100,fr=Math.pow(2,v);d+=(i?'L':'M')+fmt(x0+w*v/2)+' '+fmt(y0-h*(fr-1)/3)}out+=P(d,C.purple,2.5);
  [0,1,2].forEach(v=>out+=TF(x0+w*v/2,y0+16,v+' V',12,C.muted)+L(x0+w*v/2,y0,x0+w*v/2,y0-h*(Math.pow(2,v)-1)/3,C.grid,1,'stroke-dasharray="3 3"'));
  out+=TF(x0-8,y0-h,'×4',12,C.muted,'end')+TF(x0-8,y0-h/3,'×2',12,C.muted,'end')+TF(x0-8,y0,'×1',12,C.muted,'end');
  out+=Ci(x0+w*V/2,y0-h*(Math.pow(2,V)-1)/3,7,C.coral);
  return {svg:out,phase:`Key ${s.key} sends ${fmt(Math.round(V*1000)/1000)} V. Every 1 V doubles the frequency, so octaves are equally spaced in volts even though the frequencies themselves grow faster and faster.`};
 }});

SCENE({id:'synthesis-fm',name:'FM synthesis',tag:'One wave wobbling another',
 definition:'Frequency modulation: one oscillator (the modulator) rapidly bends the pitch of another (the carrier). This adds sidebands spaced at the modulator’s frequency, producing rich, bell-like or metallic tones from just two oscillators.',
 example:'John Chowning found in 1967 that with simple whole-number ratios between modulator and carrier FM gives harmonic, instrument-like spectra, and with non-integer ratios inharmonic, clangorous bells. It became the sound of 1980s digital keyboards.',
 desc:'A carrier and a modulator with ratio and index controls, above a spectrum of sidebands whose heights follow Bessel functions.',
 research:'Chowning, J. M. (1973). The synthesis of complex audio spectra by means of frequency modulation. Journal of the Audio Engineering Society 21(7).',
 dur:10,hint:'Change the ratio (modulator ÷ carrier) and the modulation index. Whole-number ratios sound like instruments; others sound like bells.',
 init:()=>({ratio:1,index:2}),
 watch(p){return {ratio:p<.5?1:1.41,index:.3+smooth((p*2)%1)*4.5}},
 ui:[{range:'ratio',label:'Ratio',min:.5,max:3.5,step:.01,get:s=>s.ratio,act:'ratio'},{range:'index',label:'Index',min:0,max:8,step:.1,get:s=>s.index,act:'index'},{b:'Hear it',act:'hear'}],
 on:{ratio(s,v){s.ratio=v},index(s,v){s.index=v},hear(s){const fc=220;M7_fmLines(s).forEach(l=>{if(l.f>20&&l.a>.02)AUDIO.tone(l.f,{dur:1.6,gain:.14*l.a,release:1.1})})}},
 draw(s){
  const lines=M7_fmLines(s),fc=220;let out=heading('Carrier frequency modulated by a second oscillator');
  out+=TF(300,56,`carrier ${fc} Hz · modulator ${fmt(Math.round(fc*s.ratio))} Hz · index ${fmt(s.index)}`,14,C.ink);
  const x0=50,w=500,base=300,h=200,fmax=fc*5;out+=L(x0,base,x0+w,base,C.line,1.5);
  for(let k=0;k<=5;k++)out+=TF(x0+w*k/5,base+16,Math.round(fmax*k/5)+' Hz',12,C.muted);
  lines.forEach(l=>{if(l.f<=0||l.f>fmax)return;const x=x0+w*l.f/fmax,hh=l.a*h;out+=L(x,base,x,base-hh,l.k===0?C.blue:C.purple,4)});
  const harmonic=[1,2,3,4].some(q=>Math.abs(s.ratio*q-Math.round(s.ratio*q))<.02*q);
  out+=TF(300,base+38,harmonic?'Simple ratio (1:1, 3:2…): sidebands land on a harmonic series (instrument-like).':'No simple ratio: sidebands fall between harmonics (bell-like, metallic).',13,harmonic?C.green:C.coral);
  out+=TF(300,90,'sideband k sits at carrier ± k × modulator, with height |Jₖ(index)|',13,C.muted);
  return {svg:out,phase:`With index ${fmt(s.index)} about ${lines.filter(l=>l.a>.05&&l.f>0).length} components are audible. Raising the index spreads energy into more sidebands, so the tone grows brighter, which is how FM instruments make a note brighten as it gets louder.`};
 }});
function M7_fmLines(s){const fc=220,fm=fc*s.ratio,out=[];for(let k=-8;k<=8;k++){const f=Math.abs(fc+k*fm),a=Math.abs(M7_J(Math.abs(k),s.index));out.push({k,f,a})}const m=Math.max(...out.map(o=>o.a),1e-9);return out.map(o=>({...o,a:o.a/m}))}

/* ---------- digital-audio ---------- */
SCENE({id:'digital-audio',name:'Sampling',tag:'Measuring the wave many times a second',
 definition:'Digital audio stores a sound as a list of measurements (samples) taken at a fixed rate. A sampling rate can capture frequencies only up to half of itself, the Nyquist frequency; anything higher is mistaken for a lower frequency (aliasing).',
 example:'CDs sample 44 100 times a second, so they can hold frequencies up to 22 050 Hz, just above the limit of human hearing. Sampled too slowly, a high note folds down into a wrong, lower one.',
 desc:'A sine wave with sample points marked on it, and the lower-frequency wave those same points also fit when the frequency is above half the sampling rate.',
 research:'Nyquist, H. (1928). Certain topics in telegraph transmission theory. · Shannon, C. E. (1949). Communication in the presence of noise. Proceedings of the IRE.',
 dur:10,hint:'Raise the signal frequency past half the sampling rate and watch the samples trace a different, lower wave. Hear both to compare.',
 init:()=>({f:1800,fs:3000}),
 watch(p){return {f:Math.round(400+p*2400),fs:3000}},
 ui:[{range:'f',label:'Signal',min:100,max:3000,step:10,get:s=>s.f,act:'f',show:v=>v+' Hz'},{range:'fs',label:'Sampling rate',min:1000,max:8000,step:100,get:s=>s.fs,act:'fs',show:v=>v+' /s'},{b:'Hear the original',act:'orig'},{b:'Hear what is stored',act:'stored'}],
 on:{f(s,v){s.f=v},fs(s,v){s.fs=v},orig(s){AUDIO.tone(s.f,{dur:.8,gain:.11})},stored(s){AUDIO.tone(M7_alias(s),{dur:.8,gain:.11})}},
 draw(s){
  const fa=M7_alias(s),T=.004,x0=40,w=520,y=180,h=80,al=s.f>s.fs/2;let out=heading('Samples are all the computer keeps');
  out+=L(x0,y,x0+w,y,C.grid,1);
  out+=P(M7_wave(u=>Math.sin(M7_TAU*s.f*T*u),x0,y,w,h,400),C.blue,1.6,'none','opacity=".75"');
  // The same samples fit sin(2π(f − k·fs)t), where k·fs is the nearest multiple of the sampling rate.
  if(al){const fd=s.f-s.fs*Math.round(s.f/s.fs);out+=P(M7_wave(u=>Math.sin(M7_TAU*fd*T*u),x0,y,w,h,400),C.coral,2.4,'none','stroke-dasharray="7 4"')}
  const n=Math.floor(s.fs*T);for(let i=0;i<=n;i++){const t=i/s.fs,u=t/T,v=Math.sin(M7_TAU*s.f*t);out+=L(x0+w*u,y,x0+w*u,y-h*v,C.dark,1)+Ci(x0+w*u,y-h*v,4.5,C.dark)}
  out+=TF(300,y+108,`showing ${T*1000} ms · ${n+1} samples`,13,C.muted);
  out+=counter(70,300,'Nyquist limit',fmt(s.fs/2)+' Hz',C.ink,140)+counter(230,300,'signal',s.f+' Hz',C.blue,140)+counter(390,300,'stored as',fmt(Math.round(fa))+' Hz',al?C.coral:C.green,140);
  return {svg:out,phase:al?`${s.f} Hz is above half the sampling rate (${s.fs/2} Hz), so the same dots also fit a ${fmt(Math.round(fa))} Hz wave, and that is what plays back. Real converters filter out such frequencies before sampling.`:s.f*2===s.fs?`${s.f} Hz is exactly half the sampling rate: here every sample lands on a zero crossing, so the wave is lost. The signal must be strictly below the Nyquist limit.`:`${s.f} Hz is below the Nyquist limit of ${s.fs/2} Hz, so the samples pin down this wave exactly; it can be rebuilt perfectly.`};
 }});
function M7_alias(s){return Math.abs(s.f-s.fs*Math.round(s.f/s.fs))}

SCENE({id:'digital-audio-bits',name:'Bit depth',tag:'How finely each sample is measured',
 definition:'Each sample is rounded to one of a fixed number of levels: 2 to the power of the bit depth. Rounding adds a small error heard as noise; each extra bit makes it about 6 dB quieter.',
 example:'16 bits give 65 536 levels and a signal-to-noise ratio of about 98 dB, enough for the quietest and loudest parts of most music. With 4 bits the rounding is clearly audible as hiss and grit.',
 desc:'One cycle of a sine wave drawn as a staircase of quantised levels, with the rounding error plotted underneath.',
 research:'Reeves, A. H. (1938). Pulse code modulation, French Patent 852,183. · Bennett, W. R. (1948). Spectra of quantized signals. Bell System Technical Journal 27.',
 dur:9,hint:'Lower the bit depth to see the staircase coarsen and the error grow. Hear it adds noise at the matching level.',
 init:()=>({bits:4}),
 watch(p){return {bits:Math.max(1,Math.round(8-p*7))}},
 ui:[{range:'bits',label:'Bit depth',min:1,max:16,get:s=>s.bits,act:'bits',show:v=>v+' bits'},{b:'Hear it',act:'hear'}],
 on:{bits(s,v){s.bits=v},hear(s){const snr=6.02*s.bits+1.76;AUDIO.tone(440,{dur:1,gain:.14});AUDIO.noise({dur:1,gain:clamp(.14*Math.pow(10,-snr/20)*3,0,.12)})}},
 draw(s){
  const L2=Math.pow(2,s.bits),q=v=>Math.round((v+1)/2*(L2-1))/(L2-1)*2-1,snr=6.02*s.bits+1.76;let out=heading(`${s.bits} bit${s.bits>1?'s':''}: ${L2.toLocaleString('en-GB')} levels`);
  const x0=50,w=500,y=150,h=90;out+=L(x0,y,x0+w,y,C.grid,1);
  out+=P(M7_wave(u=>Math.sin(M7_TAU*u),x0,y,w,h,200),C.blue,1.4,'none','opacity=".6"');
  const n=64;let d='';for(let i=0;i<n;i++){const v=q(Math.sin(M7_TAU*(i+.5)/n)),xa=x0+w*i/n,xb=x0+w*(i+1)/n;d+=(i?'L':'M')+fmt(xa)+' '+fmt(y-h*v)+'L'+fmt(xb)+' '+fmt(y-h*v)}out+=P(d,C.dark,2.2);
  if(s.bits<=4)for(let k=0;k<L2;k++){const v=k/(L2-1)*2-1;out+=L(x0,y-h*v,x0+w,y-h*v,C.grid,.8,'stroke-dasharray="2 4"')}
  const ey=290;out+=TF(x0,ey-48,'rounding error (magnified 4×)',13,C.coral,'start')+L(x0,ey,x0+w,ey,C.grid,1);
  let e='';for(let i=0;i<=200;i++){const u=i/200,v=Math.sin(M7_TAU*u);e+=(i?'L':'M')+fmt(x0+w*u)+' '+fmt(ey-clamp((q(v)-v)*4,-1,1)*30)}out+=P(e,C.coral,1.4);
  out+=counter(200,320,'signal-to-noise',fmt(Math.round(snr*10)/10)+' dB',snr>90?C.green:snr>40?C.amber:C.coral,200);
  return {svg:out,phase:`Each extra bit doubles the number of levels and halves the rounding error, about 6 dB quieter noise. ${s.bits>=16?'At 16 bits the noise is far below the music.':s.bits<=4?'At this depth the error is loud enough to hear as grit.':''} (SNR ≈ 6.02 × bits + 1.76 dB for a full-scale sine.)`};
 }});

const M7_FORMATS=[{n:'Telephone',rate:8000,bits:8,ch:1},{n:'Compact Disc',rate:44100,bits:16,ch:2},{n:'Studio',rate:96000,bits:24,ch:2}];
SCENE({id:'digital-audio-compression',name:'Data rates and compression',tag:'Bits per second, and what the ear ignores',
 definition:'Uncompressed audio needs sampling rate × bit depth × channels bits every second. Perceptual (lossy) coders shrink this by dropping detail that louder sounds nearby would mask anyway.',
 example:'CD audio runs at 1 411.2 kilobits per second. A 128 kbit/s perceptual file is about eleven times smaller; most listeners hear little difference, though trained ears and some music reveal artefacts.',
 desc:'A table of data rates for three formats, and a masking diagram where a loud tone hides quieter tones near it in frequency.',
 research:'IEC 60908 (Compact Disc digital audio system). · Zwicker, E. & Fastl, H. (1990). Psychoacoustics: Facts and Models. · Brandenburg, K. (1999). MP3 and AAC explained. AES 17th International Conference.',
 dur:9,hint:'Choose a bit rate for the compressed file and move the quiet tone: when it falls under the masking curve, a perceptual coder can leave it out.',
 init:()=>({kbps:128,q:1.4}),
 watch(p){return {kbps:Math.round(320-p*256),q:1+p*1.4}},
 ui:[{range:'kbps',label:'Compressed rate',min:32,max:320,step:8,get:s=>s.kbps,act:'kbps',show:v=>v+' kbit/s'},{range:'q',label:'Quiet tone',min:50,max:300,step:5,get:s=>Math.round(s.q*100),act:'q',show:v=>(v/100).toFixed(2)+' kHz'}],
 on:{kbps(s,v){s.kbps=v},q(s,v){s.q=v/100}},
 draw(s){
  let out=heading('How much data a second of sound needs');
  M7_FORMATS.forEach((F,i)=>{const kb=F.rate*F.bits*F.ch/1000,y=64+i*30;out+=TF(40,y+14,F.n,14,C.ink,'start')+TF(170,y+14,`${(F.rate/1000).toLocaleString('en-GB')} kHz × ${F.bits} bit × ${F.ch}`,13,C.muted,'start')+TBF(560,y+14,fmt(Math.round(kb*10)/10)+' kbit/s',13,C.ink,'end')});
  const cd=1411.2,ratio=cd/s.kbps;out+=TF(40,172,`Compressed at ${s.kbps} kbit/s: about ${fmt(Math.round(ratio*10)/10)} times smaller than CD`,14,C.blue,'start');
  // masking diagram, log frequency 0.25..4 kHz
  const x0=60,w=480,base=330,h=120,fx=k=>x0+w*(Math.log2(k/.25)/4);out+=L(x0,base,x0+w,base,C.line,1.5);
  [.25,.5,1,2,4].forEach(k=>out+=TF(fx(k),base+16,k+' kHz',12,C.muted));
  const loud=1,mask=k=>Math.max(0,1-Math.abs(Math.log2(k/loud))*(k<loud?2.2:1.1))*.75;
  let d='';for(let i=0;i<=120;i++){const k=.25*Math.pow(2,4*i/120);d+=(i?'L':'M')+fmt(fx(k))+' '+fmt(base-h*mask(k))}out+=P(d+`L${x0+w} ${base}L${x0} ${base}Z`,C.coral,1.5,C.coralp,'opacity=".8"');
  out+=L(fx(loud),base,fx(loud),base-h,C.dark,5)+TF(fx(loud)-8,base-h+6,'loud tone',13,C.dark,'end');
  const qa=.35,hidden=qa<mask(s.q);out+=L(fx(s.q),base,fx(s.q),base-h*qa,hidden?C.muted:C.blue,5)+TF(fx(s.q),base-h*qa-10,hidden?'masked: can be dropped':'audible: must be kept',13,hidden?C.muted:C.blue);
  out+=TF(300,192,'Red area: quiet sounds hidden by the loud tone (illustrative shape)',13,C.muted);
  return {svg:out,phase:`Masking spreads further towards higher frequencies than lower ones. A perceptual coder spends bits only on what stays above the masking curve, which is how ${s.kbps} kbit/s can sound close to CD${s.kbps<96?', although at rates this low artefacts become easy to hear':''}.`};
 }});

/* ---------- midi-sequencing ---------- */
SCENE({id:'midi-sequencing',name:'MIDI messages',tag:'Music as instructions, not sound',
 definition:'MIDI, standardised in 1983, sends performance instructions rather than audio: “note 60 on, this hard”, “note 60 off”. Each message is a few bytes, so one cable can carry 16 channels of playing.',
 example:'Pressing middle C fairly hard on channel 1 sends three bytes: 90 3C 64 in hexadecimal (Note On, channel 1; note 60; velocity 100). Releasing it sends 80 3C 40.',
 desc:'A keyboard and velocity control; the Note On and Note Off messages for the chosen key are shown as bytes in hexadecimal and binary.',
 research:'MIDI Manufacturers Association. MIDI 1.0 Detailed Specification (standard first published 1983). · Smith, D. & Wood, C. (1981). The “USI”, or Universal Synthesizer Interface. AES Convention.',
 dur:9,hint:'Press a key, and change the velocity and channel. The status byte, note number and velocity update as bytes.',
 init:()=>({key:12,vel:100,ch:1}),
 watch(p){return {key:Math.min(24,Math.floor(p*25)),vel:Math.round(40+p*80),ch:1}},
 ui:[{range:'vel',label:'Velocity',min:1,max:127,get:s=>s.vel,act:'vel'},{range:'ch',label:'Channel',min:1,max:16,get:s=>s.ch,act:'ch'}],
 on:{key(s,k){s.key=Number(k);AUDIO.tone(midiHz(48+s.key),{dur:.6,gain:.04+.14*s.vel/127})},vel(s,v){s.vel=v},ch(s,v){s.ch=v}},
 draw(s,f,X){
  const note=48+s.key,on=[0x90+(s.ch-1),note,s.vel],off=[0x80+(s.ch-1),note,64];let out=heading(`${noteName(note)} on channel ${s.ch}, velocity ${s.vel}`);
  out+=M7_keys(X,40,52,25,s.key);
  const row=(y,label,bytes,col,names)=>{let o=TB(40,y+4,label,14,col,'start');bytes.forEach((b,i)=>{const x=170+i*130;o+=R(x,y-20,118,56,'#fff',col,8)+TMF(x+59,y,hex(b),18,col,'middle','font-weight="700"')+TMF(x+59,y+22,bin(b,8),13,C.muted)+TF(x+59,y+52,names[i],12,C.muted)});return o};
  out+=row(190,'Note On',on,C.blue,[`status: on, ch ${s.ch}`,`note ${note}`,`velocity ${s.vel}`]);
  out+=row(290,'Note Off',off,C.coral,[`status: off, ch ${s.ch}`,`note ${note}`,'release 64']);
  return {svg:out,phase:`The first byte’s high half says what to do (9 = note on, 8 = note off) and its low half which of 16 channels; the next bytes are the note number (middle C = 60) and how hard it was played (0–127). The receiving instrument makes the actual sound.`};
 }});

const M7_ROLL_NOTES=[60,62,64,65,67,69,71,72];
SCENE({id:'midi-sequencing-roll',name:'Piano roll sequencer',tag:'Composing on a grid',
 definition:'A sequencer stores notes as events on a time grid and plays them back automatically. The piano-roll view, borrowed from mechanical player pianos, shows pitch up the side and time along the bottom.',
 example:'Max Mathews’s MUSIC program at Bell Labs (1957) was the first to have a computer calculate the sound wave itself from a score. Today’s sequencers show the same idea as a grid you can click.',
 desc:'An eight-step grid of eight pitches; pressed cells become notes, and a playhead sweeps across while they play.',
 research:'Mathews, M. V. (1963). The digital computer as a musical instrument. Science 142. · Mathews, M. V. (1957), MUSIC I at Bell Telephone Laboratories.',
 dur:10,hint:'Press cells to add or remove notes, set the tempo, then press Play.',
 init:()=>({grid:[[0],[2],[4],[2],[4],[5],[7],[7]],bpm:110,prog:0,playing:false}),
 watch(p){const k=Math.min(8,Math.floor(p*16));return {grid:[[0],[2],[4],[2],[4],[5],[7],[7]].map((c,i)=>i<k?c:[]),bpm:110,prog:p<.5?0:(p-.5)*2,playing:p>=.5}},
 ui:[{range:'bpm',label:'Tempo',min:60,max:200,step:5,get:s=>s.bpm,act:'bpm',show:v=>v+' bpm'},{b:'Play',act:'play'},{b:'Clear',act:'clear'}],
 on:{cell(s,a){const [i,n]=String(a).split(',').map(Number);const c=s.grid[i];const j=c.indexOf(n);if(j>=0)c.splice(j,1);else{c.push(n);AUDIO.tone(midiHz(M7_ROLL_NOTES[n]),{dur:.25,gain:.1})}},
  bpm(s,v){s.bpm=v},clear(s){s.grid=s.grid.map(()=>[])},
  play(s,a,ctx){const step=60/s.bpm/2,notes=[];s.grid.forEach((c,i)=>c.forEach(n=>notes.push({hz:midiHz(M7_ROLL_NOTES[n]),at:i*step,dur:step*.9})));AUDIO.seq(notes,{type:'triangle',gain:.13});M7_start(s,8*step*1000,ctx)},tick(s,t){return M7_tick(s,t)}},
 draw(s,f,X){
  let out=heading('Pitch up the side, time along the bottom');const x0=90,y0=50,cw=56,ch=30;
  M7_ROLL_NOTES.forEach((m,n)=>{const y=y0+(7-n)*ch;out+=TF(x0-10,y+20,noteName(m),13,C.muted,'end')});
  for(let i=0;i<8;i++)for(let n=0;n<8;n++){const x=x0+i*cw,y=y0+(7-n)*ch,on=s.grid[i].includes(n);out+=hit(X,'cell',i+','+n,`Step ${i+1}, ${noteName(M7_ROLL_NOTES[n])}: ${on?'note':'empty'}`,R(x+1,y+1,cw-2,ch-2,on?C.blue:(i%2?'#f6f9fb':'#fff'),on?C.blue:C.grid,4))}
  for(let i=0;i<=8;i++)out+=TF(x0+i*cw,y0+8*ch+16,i<8?String(i+1):'',12,C.muted);
  if(s.playing){const x=x0+8*cw*s.prog;out+=L(x,y0-4,x,y0+8*ch+4,C.coral,3)}
  const count=sum(s.grid.map(c=>c.length));out+=TF(300,y0+8*ch+44,`${count} note${count===1?'':'s'} · each step is a quaver at ${s.bpm} beats per minute (${fmt(Math.round(60000/s.bpm/2))} ms)`,13,C.muted);
  return {svg:out,phase:'Each filled cell is a stored note-on and note-off pair. Changing the tempo changes when they are sent, not the notes themselves, which is why sequenced music can be sped up without changing pitch, unlike tape.'};
 }});

const M7_PLAYED=(()=>{const r=rng(1983);return range(8).map(i=>({at:i*.5+(r()-.5)*.22,m:[60,64,67,72,67,64,60,64][i]}))})();
SCENE({id:'midi-sequencing-quantise',name:'Quantising',tag:'Snapping notes to the grid',
 definition:'Quantising moves recorded notes towards the nearest grid line. Full strength makes timing machine-perfect; partial strength tightens a performance while keeping some human feel.',
 example:'A player is always a little early or late, by tens of milliseconds. Quantising at 100% snaps every note on the beat; 50% halves each error.',
 desc:'A timeline with grid lines; played notes are shown slightly off the grid, with ghosts of their original positions and arrows to the quantised positions.',
 research:'Repp, B. H. (2005). Sensorimotor synchronization: a review of the tapping literature. Psychonomic Bulletin & Review 12. · MIDI 1.0 (1983) sequencing practice.',
 dur:9,hint:'Raise the quantise strength and choose the grid. Play the original and the quantised version to compare.',
 init:()=>({strength:60,grid:.5}),
 watch(p){return {strength:Math.round(p*100),grid:.5}},
 ui:[{range:'strength',label:'Strength',min:0,max:100,step:5,get:s=>s.strength,act:'strength',show:v=>v+'%'},{choose:[[.5,'Quavers'],[.25,'Semiquavers']],label:'Grid',get:s=>s.grid,act:'grid'},{b:'Play original',act:'orig'},{b:'Play quantised',act:'quant'}],
 on:{strength(s,v){s.strength=v},grid(s,v){s.grid=Number(v)},orig(){AUDIO.seq(M7_PLAYED.map(n=>({hz:midiHz(n.m),at:n.at+.15,dur:.3})),{gain:.12})},quant(s){AUDIO.seq(M7_quant(s).map(n=>({hz:midiHz(n.m),at:n.q+.15,dur:.3})),{gain:.12})}},
 draw(s){
  const Q=M7_quant(s),x0=50,w=500,tx=t=>x0+w*(t+.25)/4.25;let out=heading(`Quantise ${s.strength}% to ${s.grid===.5?'quavers':'semiquavers'}`);
  for(let g=0;g<=4;g+=s.grid)out+=L(tx(g),70,tx(g),300,Math.abs(g-Math.round(g))<1e-9?C.line:C.grid,Math.abs(g-Math.round(g))<1e-9?1.6:1);
  for(let b=0;b<=4;b++)out+=TF(tx(b),318,'beat '+(b+1),12,C.muted);
  Q.forEach((n,i)=>{const y=280-(n.m-58)*13;out+=R(tx(n.at)-7,y-7,14,14,'none',C.muted,3,'stroke-dasharray="3 2"');if(Math.abs(n.q-n.at)>.004)out+=arrow(tx(n.at),y,tx(n.q),y,C.coral,1.5,5);out+=R(tx(n.q)-7,y-7,14,14,C.blue,'none',3)});
  const err=Q.reduce((a,n)=>a+Math.abs(n.q-Math.round(n.q/s.grid)*s.grid),0)/Q.length*1000;
  out+=counter(220,330,'average timing error',fmt(Math.round(err))+' ms',err<5?C.green:C.amber,160);
  return {svg:out,phase:`Dashed boxes are where the notes were played; blue boxes are where they move. At ${s.strength}% each note travels ${s.strength}% of the way to its nearest grid line, leaving an average error of ${fmt(Math.round(err))} ms.`};
 }});
function M7_quant(s){return M7_PLAYED.map(n=>{const g=Math.round(n.at/s.grid)*s.grid;return {...n,q:n.at+(g-n.at)*s.strength/100}})}
