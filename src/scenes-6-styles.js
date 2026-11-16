/* ===================== Techno era 6 · Styles (1990–today) ===================== */
// Acid, minimal, dub techno and hard techno as settings of tempo, kick, swing, filter and delay. Sound is made
// only in on() handlers: Play starts ctx.every ticks that move a playhead in the state and sound each step.
// Watch derives the playhead from lesson time, so pictures stay deterministic and silent. Patterns are original,
// the voices are simplified models (not circuit emulations), and tempo ranges are typical and approximate.
const X6_wrap=(str,n)=>{const out=[];let line='';for(const w of String(str).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out};
const X6_para=(x,y,str,n=58,size=13,fill=C.ink,lh=19,anchor='start')=>X6_wrap(str,n).map((l,i)=>T(x,y+i*lh,l,size,fill,anchor)).join('');
const X6_hat=(at=0,g=.06)=>AUDIO.hit({at,type:'highpass',cutoff:8000,dur:.04,gain:g});
const X6_ohat=(at=0,g=.06)=>AUDIO.hit({at,type:'highpass',cutoff:7000,dur:.18,gain:g});
const X6_clap=(at=0)=>AUDIO.hit({at,type:'bandpass',cutoff:1500,q:1.2,dur:.12,gain:.12});
function X6_seq(spec,extra={}){
 return {...extra,
  play(s,a,ctx){s.token=(s.token||0)+1;if(s.playing){s.playing=false;s.pos=-1;AUDIO.stopAll();return 'keep'}s.playing=true;s.pos=-1;ctx.every(spec.ms(s),'tick',s.token);return 'keep'},
  tick(s,tok){if(!s.playing||Number(tok)!==s.token)return 'stop';s.pos=(s.pos+1)%spec.N;spec.step(s,s.pos);return 'keep'}};
}
function X6_restart(s,ctx,spec){if(s.playing){s.token=(s.token||0)+1;s.pos=-1;ctx.every(spec.ms(s),'tick',s.token)}}
const X6_pos=(s,X,N,perSec)=>X.try?(s.playing?s.pos:-1):Math.floor(X.p*10*perSec)%N;
function X6_grid(X,y0,rows,pos,o={}){
 const x0=o.x0||100,cw=o.cw||30,rh=o.rh||28,n=o.n||16;let out='';
 rows.forEach((r,k)=>{const y=y0+k*rh;out+=T(x0-10,y+rh/2+3,r.name,13,C.ink,'end');
  for(let i=0;i<n;i++){const on=r.on(i),beat=i%4===0;out+=R(x0+i*cw+1.5,y+2,cw-3,rh-5,on?(r.col||C.blue):(beat?'#e6eef3':'#fff'),on?'none':C.grid,4)}});
 if(pos>=0)out+=R(x0+pos*cw,y0-2,cw,rows.length*rh+1,'none',C.amber,5);
 return out;
}
// Magnitude of a two-pole resonant low-pass at frequency f: cutoff fc, resonance given as the peak height in dB.
const X6_lp=(f,fc,resDb)=>{const r=f/fc,q=Math.pow(10,resDb/20);return 1/Math.sqrt((1-r*r)*(1-r*r)+(r/q)*(r/q))};
function X6_cards(o){
 const n=o.items.length;
 SCENE({id:o.id,name:o.name,tag:o.tag,definition:o.definition,example:o.example,desc:o.desc,research:o.research,dur:o.dur||12,hint:o.hint,
  init:()=>({i:0}),
  watch(p){return {i:Math.min(n-1,Math.floor(p*n))}},
  ui:[{b:'Previous',act:'prev'},{b:'Next',act:'next'}],
  on:{pick(s,v){s.i=clamp(+v,0,n-1);return 'keep'},next(s){s.i=(s.i+1)%n;return 'keep'},prev(s){s.i=(s.i+n-1)%n;return 'keep'}},
  draw(s,f,X){
   const it=o.items[s.i],cw=568/n;let out=heading(o.heading);
   o.items.forEach((q,i)=>{const on=i===s.i;out+=hit(X,'pick',i,q.t,R(16+i*cw+2,50,cw-4,34,on?C.pale:'#fff',on?C.blue:C.grid,8)+TB(16+i*cw+cw/2,72,q.k,13,on?C.blue:C.muted))});
   out+=R(16,96,568,236,'#f6f9fb','none',10)+TB(32,124,it.t,15,C.ink,'start')+X6_para(32,152,it.body,56);
   out+=T(300,360,o.foot||'',14,C.muted);
   return {svg:out,phase:it.phase};
  }});
}

/* =========================== tempo-and-kick =========================== */
const X6_RANGES=[['Dub techno',115,128,C.green],['Minimal',122,130,C.blue],['Detroit techno',125,135,C.purple],['Acid techno',125,145,C.amber],['Hard techno',140,160,C.coral],['Gabber',160,200,C.dark]];
const X6_TKSPEC={N:16,ms:s=>15000/s.bpm,step(s,i){if(i%4===0)AUDIO.kick({from:170,to:50,decay:Math.min(.3,48/s.bpm),gain:.26});if(i%4===2)X6_ohat()}};
SCENE({id:'tempo-and-kick',name:'Tempo by style',tag:'The same beat, faster or slower',
 definition:'Techno styles share a kick drum on every beat and differ first of all in tempo, counted in beats per minute (BPM). Dub techno and minimal sit near 120–130, Detroit techno around 125–135, hard techno from about 140, and gabber from about 160.',
 example:'At 120 BPM a beat lasts half a second. At 180 BPM it lasts a third of a second: the same bar goes by in two-thirds of the time.',
 desc:'Six horizontal bands showing typical tempo ranges for six styles on a scale from 110 to 200 beats per minute, with a movable tempo line and readouts for the length of a beat and a sixteenth-note step.',
 research:['Butler, M. J. (2006). Unlocking the Groove. Indiana University Press (tempo and metre in techno).','Reynolds, S. (1998). Energy Flash. Picador.','Ranges are typical values gathered from these accounts and are approximate; real tracks stray outside them.'],
 dur:11,hint:'Move the tempo and press Play. Bands that light up are styles usually found at that speed. Ranges are approximate.',
 init:()=>({bpm:128,playing:false,pos:-1}),
 watch(p){return {bpm:Math.round(116+p*70),playing:false,pos:-1}},
 ui:[{range:'bpm',label:'Tempo (BPM)',min:110,max:200,step:1,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'}],
 on:X6_seq(X6_TKSPEC,{bpm(s,v,ctx){s.bpm=+v;X6_restart(s,ctx,X6_TKSPEC);return 'keep'}}),
 draw(s,f,X){
  const XX=b=>170+(b-110)/90*400,hits=X6_RANGES.filter(r=>s.bpm>=r[1]&&s.bpm<=r[2]).map(r=>r[0]);
  let out=heading(`${s.bpm} BPM`+(hits.length?': '+hits[0].toLowerCase()+(hits.length>1?' and others':''):''));
  X6_RANGES.forEach(([name,a,b,col],i)=>{const y=62+i*32,on=s.bpm>=a&&s.bpm<=b;
   out+=T(160,y+18,name,13,on?C.ink:C.muted,'end')+R(XX(a),y+3,XX(b)-XX(a),22,on?col:'#d5e0e7','none',5)});
  [110,140,170,200].forEach(b=>out+=L(XX(b),58,XX(b),256,C.grid,1)+TF(XX(b),272,String(b),12,C.muted));
  out+=L(XX(s.bpm),54,XX(s.bpm),258,C.ink,2.4)+Ci(XX(s.bpm),54,5,C.ink);
  out+=counter(110,290,'one beat',Math.round(60000/s.bpm)+' ms',C.blue,120)+counter(240,290,'one 16th step',Math.round(15000/s.bpm)+' ms',C.purple,120)+counter(370,290,'one bar',fmt(Math.round(240000/s.bpm)/1000)+' s',C.green,120);
  out+=T(300,364,'Typical ranges, approximate. BPM on the scale above.',13,C.muted);
  return {svg:out,phase:hits.length?`At ${s.bpm} BPM you are in the usual range for ${hits.join(', ').toLowerCase()}. The ranges overlap: tempo narrows the style down but does not decide it.`:`${s.bpm} BPM falls outside the typical ranges shown; real tracks do stray.`};
 }});

const X6_KPRE={'808':{from:120,to:40,decay:.7},'909':{from:180,to:50,decay:.3},hard:{from:260,to:55,decay:.22}};
// Pitch of the model kick at time t: an exponential fall from `from` to `to` over the first 35% of the decay.
const X6_kf=(k,t)=>{const tt=Math.max(.02,k.decay*.35);return t>=tt?k.to:k.from*Math.pow(k.to/k.from,t/tt)};
const X6_ka=(k,t)=>t>k.decay?0:Math.exp(-7.1*t/k.decay);
SCENE({id:'tempo-and-kick-shape',name:'The shape of a kick',tag:'A falling pitch and a fading level',
 definition:'A drum-machine kick is a low tone whose pitch drops quickly at the start while its loudness dies away. How far the pitch falls, where it lands and how long the tail lasts give each machine and each style its kick.',
 example:'A long, low tail suits slower styles and leaves room for little else in the bass. A short, punchy kick with a high starting pitch cuts through at fast tempos.',
 desc:'Sliders for starting pitch, final pitch and length. The picture shows the pitch falling over time, the level fading, and the resulting waveform.',
 research:['Roland Corporation (1980, 1983). TR-808 and TR-909 Owner’s Manuals (tune and decay controls).','Reid, G. (2002). Synth Secrets: practical bass drum synthesis. Sound on Sound, February 2002.','The model here is a simplified sine with a pitch sweep, not a circuit emulation.'],
 dur:11,hint:'Try the three starting points, then change one slider at a time and press Hit. Keep your volume gentle: low tones need little level.',
 init:()=>({pre:'909',...X6_KPRE['909']}),
 watch(p){const k=p<.34?'808':p<.67?'909':'hard';return {pre:k,...X6_KPRE[k]}},
 ui:[{choose:[['808','Long and low'],['909','Short and punchy'],['hard','Hard']],label:'Start from',get:s=>s.pre,act:'pre'},
  {range:'from',label:'Starting pitch',min:80,max:300,step:5,get:s=>s.from,act:'from',show:v=>v+' Hz'},{range:'to',label:'Final pitch',min:30,max:80,step:1,get:s=>s.to,act:'to',show:v=>v+' Hz'},
  {range:'decay',label:'Length',min:.1,max:.8,step:.02,get:s=>s.decay,act:'decay',show:v=>Math.round(v*1000)+' ms'},{b:'Hit',act:'hit'}],
 on:{pre(s,v){s.pre=v;Object.assign(s,X6_KPRE[v]);return 'keep'},from(s,v){s.from=+v;s.pre='';return 'keep'},to(s,v){s.to=+v;s.pre='';return 'keep'},decay(s,v){s.decay=+v;s.pre='';return 'keep'},
  hit(s){AUDIO.kick({from:s.from,to:s.to,decay:s.decay,gain:.28});return 'keep'}},
 draw(s){
  let out=heading(`${s.from} Hz falling to ${s.to} Hz in ${Math.round(s.decay*1000)} ms`,28);
  const px=70,pw=480,XX=t=>px+t/.8*pw;
  // pitch
  const y1=60,h1=80,YP=f=>y1+h1-(Math.log(f/30)/Math.log(10))*h1;out+=R(px,y1,pw,h1,'#fff',C.grid,4)+T(px+6,y1+16,'pitch',12,C.blue,'start');
  let d='';for(let i=0;i<=120;i++){const t=i/120*s.decay;d+=(i?'L':'M')+fmt(XX(t))+' '+fmt(YP(X6_kf(s,t)))}out+=P(d,C.blue,2.6);
  [30,100,300].forEach(f=>out+=TF(px-6,YP(f)+4,f+' Hz',12,C.muted,'end'));
  // level
  const y2=158,h2=60;out+=R(px,y2,pw,h2,'#fff',C.grid,4)+T(px+pw-6,y2+16,'level',12,C.coral,'end');
  d='';for(let i=0;i<=120;i++){const t=i/120*s.decay;d+=(i?'L':'M')+fmt(XX(t))+' '+fmt(y2+h2-X6_ka(s,t)*(h2-6))}out+=P(d,C.coral,2.6);
  // waveform
  const y3=236,h3=70;out+=R(px,y3,pw,h3,'#fff',C.grid,4)+T(px+pw-6,y3+16,'waveform',12,C.ink,'end');
  d='';let ph=0;const N=480;for(let i=0;i<=N;i++){const t=i/N*.8;if(i)ph+=2*Math.PI*X6_kf(s,t)*(.8/N);const v=t>s.decay?0:Math.sin(ph)*X6_ka(s,t);d+=(i?'L':'M')+fmt(XX(t))+' '+fmt(y3+h3/2-v*(h3/2-5))}out+=P(d,C.ink,1.6);
  [0,.2,.4,.6,.8].forEach(t=>out+=TF(XX(t),y3+h3+16,Math.round(t*1000)+' ms',12,C.muted));
  out+=T(300,364,'Model: a sine wave with a pitch sweep. Real machines add a click and more.',13,C.muted);
  return {svg:out,phase:s.decay>=.5?'A long tail: the kick is almost a bass note. In slower styles it can carry the low end on its own.':s.from>=220?'A high starting pitch gives a hard, clicking attack that stays audible at speed.':'A short kick with a quick pitch drop: punchy, and out of the way before the next sound.'};
 }});

// Four style settings to morph between. swing: delay of every second 16th, as a percentage of a step.
const X6_STY={
 dub:{name:'Dub techno',bpm:122,decay:.42,from:130,hat:.03,swing:10,cutoff:320,res:2,acid:.05},
 minimal:{name:'Minimal',bpm:127,decay:.26,from:165,hat:.05,swing:14,cutoff:520,res:6,acid:.06},
 acid:{name:'Acid',bpm:134,decay:.3,from:180,hat:.07,swing:0,cutoff:700,res:15,acid:.11},
 hard:{name:'Hard techno',bpm:150,decay:.22,from:250,hat:.09,swing:0,cutoff:1300,res:8,acid:.09}};
const X6_PKEYS=[['bpm','tempo',110,160,' BPM'],['decay','kick length',.15,.5,' s'],['from','kick start pitch',100,280,' Hz'],['hat','hat level',0,.1,''],['swing','swing',0,20,'%'],['cutoff','filter cutoff',200,1500,' Hz'],['res','resonance',0,18,' dB']];
const X6_mix=s=>{const a=X6_STY[s.a],b=X6_STY[s.b],u=s.m/100,o={};for(const k of ['bpm','decay','from','hat','swing','cutoff','res','acid'])o[k]=lerp(a[k],b[k],u);o.bpm=Math.round(o.bpm);return o};
const X6_MLINE=[33,0,33,45,0,33,36,0,33,0,45,33,0,40,33,31];
const X6_MSPEC={N:16,ms:s=>15000/X6_mix(s).bpm,step(s,i){const q=X6_mix(s),st=15/q.bpm,sw=i%2?q.swing/100*st:0;
  if(i%4===0)AUDIO.kick({from:q.from,to:48,decay:q.decay,gain:.26});if(i%4===2)X6_ohat(sw,q.hat);else if(i%2)X6_hat(sw,q.hat*.8);
  if(X6_MLINE[i])AUDIO.acid(midiHz(X6_MLINE[i]),{at:sw,dur:st*.9,gain:q.acid,cutoff:q.cutoff,env:q.cutoff*2,res:q.res,decay:.12})}};
SCENE({id:'tempo-and-kick-morph',name:'Morphing between styles',tag:'One pattern, many settings',
 definition:'Much of the difference between techno styles can be written as a handful of settings applied to the same pattern: tempo, the length and pitch of the kick, how loud the hats are, how much swing, and how open and resonant the filter is.',
 example:'Slide from dub techno to hard techno and the tempo rises from about 122 to 150, the kick shortens and sharpens, the swing disappears and the filter opens.',
 desc:'Two style choices and a morph slider between them. Seven bars show the blended settings, and a sixteen-step pattern plays with those settings.',
 research:['Butler, M. J. (2006). Unlocking the Groove. Indiana University Press.','Sherburne, P. (2004). Digital discipline: minimalism in house and techno. In Cox & Warner (eds), Audio Culture. Continuum.','The settings are illustrative values chosen for this model, not measurements of records.'],
 dur:12,hint:'Pick two styles, press Play and move the slider. Real styles differ in much more than these seven numbers; the settings are illustrative.',
 init:()=>({a:'dub',b:'hard',m:0,playing:false,pos:-1}),
 watch(p){return {a:'dub',b:'hard',m:Math.round(p*100),playing:false,pos:-1}},
 ui:[{choose:Object.keys(X6_STY).map(k=>[k,X6_STY[k].name]),label:'From',get:s=>s.a,act:'a'},{choose:Object.keys(X6_STY).map(k=>[k,X6_STY[k].name]),label:'To',get:s=>s.b,act:'b'},
  {range:'m',label:'Morph',min:0,max:100,step:5,get:s=>s.m,act:'m',show:v=>v+'%'},{b:'Play / stop',act:'play'}],
 on:X6_seq(X6_MSPEC,{a(s,v,ctx){s.a=v;X6_restart(s,ctx,X6_MSPEC);return 'keep'},b(s,v,ctx){s.b=v;X6_restart(s,ctx,X6_MSPEC);return 'keep'},m(s,v,ctx){s.m=+v;X6_restart(s,ctx,X6_MSPEC);return 'keep'}}),
 draw(s,f,X){
  const q=X6_mix(s),pos=X6_pos(s,X,16,q.bpm/15);let out=heading(s.m===0?X6_STY[s.a].name:s.m===100?X6_STY[s.b].name:`${100-s.m}% ${X6_STY[s.a].name.toLowerCase()}, ${s.m}% ${X6_STY[s.b].name.toLowerCase()}`,28);
  X6_PKEYS.forEach(([k,label,lo,hi,unit],i)=>{const y=54+i*27,u=clamp((q[k]-lo)/(hi-lo),0,1),val=k==='hat'?Math.round(q[k]*1000)/10:k==='decay'?fmt(q[k]):Math.round(q[k]);
   out+=T(190,y+16,label,13,C.ink,'end')+R(200,y+3,260,18,'#e6eef3','none',5)+R(200,y+3,Math.max(3,260*u),18,C.blue,'none',5)+T(470,y+16,val+unit,13,C.ink,'start')});
  out+=X6_grid(X,258,[{name:'Kick',col:C.blue,on:i=>i%4===0},{name:'Hats',col:C.green,on:i=>i%2===1||i%4===2},{name:'Bass line',col:C.purple,on:i=>!!X6_MLINE[i]}],pos,{rh:24});
  out+=T(300,364,'Illustrative settings for a simplified model.',13,C.muted);
  return {svg:out,phase:`The pattern never changes; only seven numbers do. At this setting: ${q.bpm} BPM, a ${Math.round(q.decay*1000)} ms kick, ${Math.round(q.swing)}% swing and the filter at ${Math.round(q.cutoff)} Hz.`};
 }});

/* =========================== acid =========================== */
const X6_ALINE=[33,33,45,0,33,36,0,33,45,33,0,40,33,0,43,31];
const X6_ASPEC={N:16,ms:s=>15000/s.bpm,step(s,i){if(s.drums&&i%4===0)AUDIO.kick({from:170,to:50,decay:.26,gain:.24});if(s.drums&&i%4===2)X6_ohat();
  if(s.on[i]&&X6_ALINE[i])AUDIO.acid(midiHz(X6_ALINE[i]),{dur:.105,gain:.1,cutoff:s.cutoff,env:s.env,res:s.res,decay:.12,accent:i%4===3})}};
SCENE({id:'acid',name:'The acid line',tag:'A bassline that became the lead',
 definition:'Acid is techno or house in which the main voice is a TB-303-style bassline: a short repeating pattern of notes whose tone is reshaped as it plays by turning the filter’s cutoff, resonance and envelope controls.',
 example:'With the cutoff low the line is a dull throb. Open the cutoff and raise the resonance and the same notes start to squeal and bubble.',
 desc:'A sixteen-step line drawn as notes at different heights, which can be switched on and off, with sliders for filter cutoff, resonance and envelope amount.',
 research:['Vine, R. (2011). Tadao Kikumoto invents the Roland TB-303. The Guardian, 15 June 2011.','Reynolds, S. (1998). Energy Flash. Picador (Phuture, “Acid Tracks”, 1987).','Butler, M. J. (2006). Unlocking the Groove. Indiana University Press.','Original pattern; simplified filter model.'],
 dur:12,hint:'Press Play, then move the three filter sliders while the line repeats: that movement is the performance. Press a note to silence it.',
 init:()=>({bpm:130,cutoff:400,res:12,env:1500,drums:true,on:X6_ALINE.map(()=>true),playing:false,pos:-1}),
 watch(p){return {bpm:130,cutoff:Math.round(250+p*1400),res:12,env:1500,drums:true,on:X6_ALINE.map(()=>true),playing:false,pos:-1}},
 ui:[{range:'cutoff',label:'Cutoff',min:150,max:2000,step:10,get:s=>s.cutoff,act:'cutoff',show:v=>v+' Hz'},{range:'res',label:'Resonance',min:0,max:18,step:1,get:s=>s.res,act:'res',show:v=>v+' dB'},
  {range:'env',label:'Envelope amount',min:0,max:3000,step:50,get:s=>s.env,act:'env',show:v=>'+'+v+' Hz'},{b:'Drums on / off',act:'drums'},{b:'Play / stop',act:'play'}],
 on:X6_seq(X6_ASPEC,{cutoff(s,v){s.cutoff=+v;return 'keep'},res(s,v){s.res=+v;return 'keep'},env(s,v){s.env=+v;return 'keep'},drums(s){s.drums=!s.drums;return 'keep'},note(s,v){s.on[+v]=!s.on[+v];return 'keep'}}),
 draw(s,f,X){
  const pos=X6_pos(s,X,16,s.bpm/15);let out=heading(s.res>=12&&s.cutoff>=600?'Open and resonant: the acid squelch':s.cutoff<350?'Cutoff low: a dull throb':'The same notes, a different tone');
  const x0=60,cw=30,yb=218;
  for(let i=0;i<16;i++){const m=X6_ALINE[i],x=x0+i*cw;out+=R(x+1.5,70,cw-3,160,i%4===0?'#e6eef3':'#fff',i===pos?C.amber:C.grid,4);
   if(m){const y=yb-(m-31)*9,on=s.on[i];out+=hit(X,'note',i,`Step ${i+1}: ${noteName(m)}, ${on?'on':'off'}. Press to toggle.`,R(x+4,y-8,cw-8,14,on?C.purple:'#d5d0e2','none',4))+(i%4===3&&on?Ci(x+cw/2,y-16,3.5,C.coral):'')}}
  out+=T(x0,252,'height: pitch · red dot: accented note',12,C.muted,'start');
  const bar=(x,label,u,val,col)=>R(x,272,150,14,'#e6eef3','none',5)+R(x,272,Math.max(3,150*u),14,col,'none',5)+T(x+75,304,`${label}: ${val}`,13,C.ink);
  out+=bar(60,'cutoff',(s.cutoff-150)/1850,s.cutoff+' Hz',C.blue)+bar(225,'resonance',s.res/18,s.res+' dB',C.coral)+bar(390,'envelope',s.env/3000,'+'+s.env+' Hz',C.green);
  out+=T(300,360,'Original pattern in A; simplified model of the filter.',13,C.muted);
  return {svg:out,phase:'The notes are fixed in the sequencer. What the player performs is the tone: cutoff sets how bright it is, resonance adds a whistling peak at the cutoff, and the envelope makes each note start bright and close down.'};
 }});

const X6_HARM=range(40).map(i=>i+1);
SCENE({id:'acid-filter',name:'Cutoff and resonance',tag:'What the two knobs do to the spectrum',
 definition:'A low-pass filter lets frequencies below its cutoff through and weakens those above. Resonance adds a narrow boost right at the cutoff, so whichever harmonic sits there rings out. Sweeping the cutoff moves that peak through the harmonics.',
 example:'A sawtooth bass note at 55 Hz has harmonics at 110, 165, 220 Hz and so on. With the cutoff at 440 Hz and strong resonance, the eighth harmonic is boosted and everything above fades.',
 desc:'A filter response curve on a logarithmic frequency scale with sliders for cutoff and resonance, drawn over the harmonics of a 55 Hz sawtooth before and after filtering.',
 research:['Moog, R. A. (1965). Voltage-controlled electronic music modules. Journal of the Audio Engineering Society 13(3), 200–206.','Smith, J. O. (2007). Introduction to Digital Filters with Audio Applications. W3K Publishing (resonant low-pass response).','The curve is a two-pole model; the TB-303’s own filter is steeper.'],
 dur:11,hint:'Raise the resonance, then sweep the cutoff and watch the peak pick out one harmonic after another. Play note lets you hear the setting.',
 init:()=>({cutoff:440,res:12}),
 watch(p){return {cutoff:Math.round(150*Math.pow(2000/150,p)),res:12}},
 ui:[{range:'cutoff',label:'Cutoff',min:150,max:2000,step:10,get:s=>s.cutoff,act:'cutoff',show:v=>v+' Hz'},{range:'res',label:'Resonance',min:0,max:18,step:1,get:s=>s.res,act:'res',show:v=>v+' dB'},{b:'Play note',act:'note'}],
 on:{cutoff(s,v){s.cutoff=+v;return 'keep'},res(s,v){s.res=+v;return 'keep'},note(s){AUDIO.acid(55,{dur:.9,gain:.11,cutoff:s.cutoff,env:0,res:s.res,decay:.5});return 'keep'}},
 draw(s){
  const px=70,pw=490,py=280,ph=200,XX=f=>px+Math.log(f/50)/Math.log(4000/50)*pw,YY=db=>py-(clamp(db,-36,24)+36)/60*ph;
  const peak=Math.round(s.cutoff/55);let out=heading(`Cutoff ${s.cutoff} Hz, resonance ${s.res} dB`);
  out+=R(px,py-ph,pw,ph,'#fff',C.grid,4);
  [-24,-12,0,12].forEach(db=>out+=L(px,YY(db),px+pw,YY(db),db===0?C.line:C.grid,1)+TF(px-6,YY(db)+4,(db>0?'+':'')+db+' dB',12,C.muted,'end'));
  [55,110,220,440,880,1760,3520].forEach(f=>out+=TF(XX(f),py+16,String(f),12,C.muted));
  for(const n of X6_HARM){const f=55*n;if(f>4000)break;const raw=20*Math.log10(1/n),flt=raw+20*Math.log10(X6_lp(f,s.cutoff,s.res));
   out+=L(XX(f),py,XX(f),YY(raw),'#cbd8e0',3)+L(XX(f),py,XX(f),YY(flt),n===peak?C.coral:C.purple,3)}
  let d='';for(let i=0;i<=200;i++){const f=50*Math.pow(80,i/200);d+=(i?'L':'M')+fmt(XX(f))+' '+fmt(YY(20*Math.log10(X6_lp(f,s.cutoff,s.res))))}
  out+=P(d,C.blue,2.4)+L(XX(s.cutoff),py-ph,XX(s.cutoff),py,C.amber,1.5,'stroke-dasharray="4 4"');
  out+=T(px+8,py-ph+18,'blue: filter · grey: saw harmonics · purple: after the filter',12,C.muted,'start');
  out+=T(300,326,`The peak sits near harmonic ${peak} of the 55 Hz note (${peak*55} Hz), shown in red.`,14,C.ink);
  out+=T(300,360,'Frequency in Hz, log scale. Two-pole model.',13,C.muted);
  return {svg:out,phase:s.res<=3?'With little resonance the filter only dulls the sound: harmonics above the cutoff fade away smoothly.':'With resonance, the harmonic nearest the cutoff is boosted well above its neighbours. Sweep the cutoff and the ear follows that peak as a tune of its own.'};
 }});

const X6_SL=[33,45,36,33,48,45,40,33];
const X6_SLPRE={none:[0,0,0,0,0,0,0,0],acc:[0,1,0,0,1,0,0,1],sl:[0,2,0,0,2,2,0,0],both:[0,1,2,0,3,2,0,1]};
const X6_SLSPEC={N:8,ms:s=>30000/s.bpm,step(s,i){const mk=s.marks[i],prev=X6_SL[(i+7)%8],sl=mk>=2,st=30/s.bpm;
  AUDIO.acid(midiHz(X6_SL[i]),{dur:sl?st*1.05:st*.55,gain:.1,cutoff:450,env:1400,res:13,decay:.14,accent:mk===1||mk===3,slideFrom:sl?midiHz(prev):0})}};
SCENE({id:'acid-accent-slide',name:'Accent and slide',tag:'Two switches per step',
 definition:'Each step of a TB-303 pattern can carry two marks. Accent makes the note louder and opens the filter further. Slide holds the note for its full length and glides the pitch into it from the note before.',
 example:'The same eight notes sound mechanical with no marks, punchy with accents, and rubbery and vocal with slides.',
 desc:'Eight notes on a pitch grid. Each can be plain, accented, slid or both; accented notes are drawn larger and slides are drawn as a line gliding from the previous note.',
 research:['Roland Corporation (1981). TB-303 Bass Line Owner’s Manual (accent and slide).','Butler, M. J. (2006). Unlocking the Groove. Indiana University Press.','Original pattern; simplified model of the accent and slide circuits.'],
 dur:11,hint:'Press Play and compare the four starting points. Press any note to cycle it through plain, accent, slide and both.',
 init:()=>({bpm:126,pre:'none',marks:X6_SLPRE.none.slice(),playing:false,pos:-1}),
 watch(p){const k=['none','acc','sl','both'][Math.min(3,Math.floor(p*4))];return {bpm:126,pre:k,marks:X6_SLPRE[k],playing:false,pos:-1}},
 ui:[{choose:[['none','No marks'],['acc','Accents'],['sl','Slides'],['both','Both']],label:'Start from',get:s=>s.pre,act:'pre'},{b:'Play / stop',act:'play'}],
 on:X6_seq(X6_SLSPEC,{pre(s,v){s.pre=v;s.marks=X6_SLPRE[v].slice();return 'keep'},cyc(s,v){s.marks[+v]=(s.marks[+v]+1)%4;s.pre='';return 'keep'}}),
 draw(s,f,X){
  const pos=X6_pos(s,X,8,s.bpm/30),x0=70,cw=58,yb=220,Y=m=>yb-(m-31)*7.5,na=s.marks.filter(m=>m===1||m===3).length,ns=s.marks.filter(m=>m>=2).length;
  let out=heading(`${na} accent${na===1?'':'s'}, ${ns} slide${ns===1?'':'s'}`);
  for(let i=0;i<8;i++){const x=x0+i*cw,m=X6_SL[i],mk=s.marks[i],acc=mk===1||mk===3,sl=mk>=2,y=Y(m);
   out+=R(x+2,64,cw-4,176,i%2===0?'#eef3f6':'#fff',i===pos?C.amber:C.grid,5);
   if(sl){const pm=X6_SL[(i+7)%8];out+=P(`M${fmt(x-cw/2+ (i?0:cw/2))} ${fmt(i?Y(pm):y)}C${fmt(x)} ${fmt(i?Y(pm):y)} ${fmt(x)} ${fmt(y)} ${fmt(x+cw/2)} ${fmt(y)}`,C.green,3)}
   out+=hit(X,'cyc',i,`Step ${i+1}: ${noteName(m)}, ${['plain','accent','slide','accent and slide'][mk]}. Press to change.`,R(x+(sl?6:14),y-(acc?10:7),sl?cw-12:cw-28,acc?20:14,acc?C.coral:C.purple,'none',5));
   out+=T(x+cw/2,258,['plain','accent','slide','both'][mk],12,mk?C.ink:C.muted)}
  out+=T(300,290,'red and larger: accent · green curve and long note: slide',13,C.muted);
  out+=T(300,326,'Press a note to change its marks.',15,C.ink);
  out+=T(300,360,'Original pattern; simplified model.',13,C.muted);
  return {svg:out,phase:ns&&na?'Accents and slides together give the line its speech-like quality: some notes jump out, others melt into the next.':ns?'Slid notes overlap the next step and bend into pitch, so the line stops sounding like separate notes.':na?'Accented notes are louder and brighter, which sets up a second rhythm inside the pattern.':'With no marks every note has the same length, loudness and tone.'};
 }});

/* =========================== dub-techno =========================== */
const X6_CHORD=[48,51,55,58];
// Echoes of stabs at steps 0 and 22 of a two-bar (32-step) loop: each repeat is d steps later and fb times as loud.
function X6_echoes(d,fb){const ev=[];for(const p of [0,22]){let g=1,k=0;while(g>=.06&&k<12){ev.push({step:(p+k*d)%32,g,k});g*=fb;k++;if(fb<=0)break}}return ev}
const X6_stab=(g,k,at=0)=>X6_CHORD.forEach(m=>AUDIO.acid(midiHz(m),{at,dur:.16,gain:.05*g,cutoff:1500*Math.pow(.8,k),env:0,res:1,decay:.1}));
const X6_DSPEC={N:32,ms:s=>15000/s.bpm,step(s,i){if(s.kick&&i%4===0)AUDIO.kick({from:130,to:46,decay:.4,gain:.22});X6_echoes(s.d,s.fb).forEach(e=>{if(e.step===i)X6_stab(e.g,e.k)})}};
SCENE({id:'dub-techno',name:'Dub techno: the echo',tag:'One chord, many repeats',
 definition:'Dub techno sets a soft chord stab against a steady kick and feeds it through a delay, so each stab is followed by a trail of quieter, duller echoes. The delay time is set in fractions of the beat, so the echoes form a rhythm of their own.',
 example:'With a delay of three sixteenth-notes at 122 BPM, the echoes come 369 ms apart and fall across the beat. With feedback at 0.6, each echo is 60% as loud as the one before.',
 desc:'A two-bar timeline of 32 steps. Two chord stabs are followed by echoes drawn as shrinking bars, with sliders for the delay time in steps and the feedback.',
 research:['Veal, M. E. (2007). Dub: Soundscapes and Shattered Songs in Jamaican Reggae. Wesleyan University Press.','Sherburne, P. (2004). Digital discipline: minimalism in house and techno. In Cox & Warner (eds), Audio Culture. Continuum.','Basic Channel (1993–95), the label and its releases, described here in words only. Original chord and pattern.'],
 dur:12,hint:'Press Play and change the delay time: 3 steps is the classic dotted-eighth echo. Raise the feedback for a longer trail.',
 init:()=>({bpm:122,d:3,fb:.6,kick:true,playing:false,pos:-1}),
 watch(p){return {bpm:122,d:p<.5?3:4,fb:Math.round((.3+p*.5)*20)/20,kick:true,playing:false,pos:-1}},
 ui:[{range:'d',label:'Delay time',min:1,max:6,step:1,get:s=>s.d,act:'d',show:v=>v+' step'+(v>1?'s':'')},{range:'fb',label:'Feedback',min:0,max:.8,step:.05,get:s=>s.fb,act:'fb',show:v=>Math.round(v*100)+'%'},{b:'Kick on / off',act:'kick'},{b:'Play / stop',act:'play'}],
 on:X6_seq(X6_DSPEC,{d(s,v){s.d=+v;return 'keep'},fb(s,v){s.fb=+v;return 'keep'},kick(s){s.kick=!s.kick;return 'keep'}}),
 draw(s,f,X){
  const pos=X6_pos(s,X,32,s.bpm/15),ev=X6_echoes(s.d,s.fb),x0=44,cw=16.4,yb=230,ms=Math.round(s.d*15000/s.bpm);
  let out=heading(`Echoes every ${s.d} step${s.d>1?'s':''}: ${ms} ms apart`);
  for(let i=0;i<32;i++){out+=R(x0+i*cw+1,80,cw-2,150,i%4===0?'#e6eef3':'#fff',i===pos?C.amber:'none',3);if(i%4===0&&s.kick)out+=Ci(x0+i*cw+cw/2,244,4,C.blue)}
  out+=L(x0+16*cw,74,x0+16*cw,236,C.line,1.5)+T(x0+8*cw,70,'bar 1',12,C.muted)+T(x0+24*cw,70,'bar 2',12,C.muted);
  ev.forEach(e=>{const h=e.g*140;out+=R(x0+e.step*cw+2.5,yb-h,cw-5,h,e.k===0?C.purple:'#b9a9d8','none',3)});
  out+=T(x0,268,'tall purple: the stab · pale: its echoes · blue dots: kick',12,C.muted,'start');
  out+=counter(60,284,'delay',ms+' ms',C.purple,120)+counter(196,284,'echoes heard',String(ev.filter(e=>e.k>0).length),C.blue,130)+counter(342,284,'each echo',Math.round(s.fb*100)+'% as loud',C.green,150);
  out+=T(300,362,'Each echo is also a little duller than the last.',13,C.muted);
  return {svg:out,phase:s.d===3?'Three steps is three-quarters of a beat, so the echoes land off the kick and drift across the bar before lining up again. This cross-rhythm is the heart of the style.':s.d%4===0?'A delay of a whole beat puts every echo on a kick, where it is half hidden.':s.d===2?'Two steps is half a beat: the echoes fall neatly between the kicks.':'An odd delay time makes the echoes tumble against the beat.'};
 }});

const X6_SSPEC={N:16,ms:s=>15000/s.bpm,step(s,i){if(s.kick&&i%4===0)AUDIO.kick({from:130,to:46,decay:.4,gain:.22});if(s.hat&&i%4===2)X6_ohat(0,.03);
  if(i===3||i===10)X6_CHORD.forEach(m=>AUDIO.acid(midiHz(m),{dur:.3,gain:.045,cutoff:s.cutoff,env:0,res:2,decay:.2}));if(s.hiss&&i===0)AUDIO.noise({dur:240/s.bpm,gain:.012})}};
SCENE({id:'dub-techno-space',name:'Dark, bright and hiss',tag:'Texture instead of melody',
 definition:'Dub techno changes slowly. Instead of new notes, the producer opens and closes a filter on the same chord, and often leaves in tape hiss or vinyl crackle as part of the sound.',
 example:'With the filter closed to 300 Hz the chord is a soft thud in the distance. Opened to 2,000 Hz the same chord comes forward, bright and close.',
 desc:'A slider for the chord’s filter cutoff with a picture of the chord’s harmonics dimmed above the cutoff, and switches for kick, hat and background hiss.',
 research:['Sherburne, P. (2004). Digital discipline: minimalism in house and techno. In Cox & Warner (eds), Audio Culture. Continuum.','Veal, M. E. (2007). Dub. Wesleyan University Press (the mixing desk as an instrument).','Original chord; the hiss is plain filtered noise.'],
 dur:11,hint:'Press Play and move the cutoff very slowly, as a producer would over a minute or more. Switch the layers on and off.',
 init:()=>({bpm:122,cutoff:500,kick:true,hat:false,hiss:false,playing:false,pos:-1}),
 watch(p){return {bpm:122,cutoff:Math.round(250+1750*(.5-.5*Math.cos(p*Math.PI*2))),kick:true,hat:true,hiss:p>.5,playing:false,pos:-1}},
 ui:[{range:'cutoff',label:'Chord filter',min:200,max:2500,step:10,get:s=>s.cutoff,act:'cutoff',show:v=>v+' Hz'},{b:'Kick',act:'tog',arg:'kick'},{b:'Hat',act:'tog',arg:'hat'},{b:'Hiss',act:'tog',arg:'hiss'},{b:'Play / stop',act:'play'}],
 on:X6_seq(X6_SSPEC,{cutoff(s,v){s.cutoff=+v;return 'keep'},tog(s,v){s[v]=!s[v];return 'keep'}}),
 draw(s,f,X){
  const pos=X6_pos(s,X,16,s.bpm/15),px=60,pw=480,py=206,ph=130,XX=fr=>px+Math.log(fr/100)/Math.log(50)*pw;
  let out=heading(s.cutoff<450?'Filter closed: far away and dark':s.cutoff>1500?'Filter open: close and bright':'Somewhere in between');
  out+=R(px,py-ph,pw,ph,'#fff',C.grid,4);
  if(s.hiss){const r=rng(7);for(let i=0;i<90;i++)out+=Ci(px+6+r()*(pw-12),py-4-r()*22,1.2,'#9fb2be')}
  X6_CHORD.forEach((m,ci)=>{for(let n=1;n<=24;n++){const fr=midiHz(m)*n;if(fr>5000)break;const a=(1/n)*Math.min(1.2,X6_lp(fr,s.cutoff,2));out+=L(XX(fr),py,XX(fr),py-Math.min(ph-8,a*(ph-12)),[C.purple,C.blue,C.green,C.amber][ci],2,`opacity="${fmt(.35+.65*Math.min(1,a*n))}"`)}});
  out+=L(XX(s.cutoff),py-ph,XX(s.cutoff),py,C.coral,1.6,'stroke-dasharray="5 4"')+T(XX(s.cutoff)+(s.cutoff>1400?-6:6),py-ph+16,'cutoff',12,C.coral,s.cutoff>1400?'end':'start');
  [100,300,1000,3000].forEach(fr=>out+=TF(XX(fr),py+16,fr+' Hz',12,C.muted));
  out+=X6_grid(X,246,[{name:'Kick',col:s.kick?C.blue:'#c9d6de',on:i=>i%4===0},{name:'Hat',col:s.hat?C.green:'#c9d6de',on:i=>i%4===2},{name:'Chord',col:C.purple,on:i=>i===3||i===10}],pos,{rh:24});
  out+=T(300,346,`Layers on: ${['chord',s.kick&&'kick',s.hat&&'hat',s.hiss&&'hiss'].filter(Boolean).join(', ')}`,14,C.ink);
  out+=T(300,366,'Four colours: the four notes of the chord and their harmonics.',12,C.muted);
  return {svg:out,phase:'Nothing in the pattern changes, yet the music moves: closing the filter pushes the chord into the distance, opening it brings it near. The hiss fills the silence the way room noise does.'};
 }});

X6_cards({id:'dub-techno-roots',name:'From Kingston to Berlin',tag:'Where the echo came from',
 definition:'Dub techno takes its methods from Jamaican dub of the 1970s, in which engineers remixed reggae tracks at the mixing desk with echo, reverb and sudden drop-outs. In the early 1990s producers in Berlin applied those methods to techno.',
 example:'In dub, a snare hit might be sent into a tape echo and left to repeat and decay while the rest of the band is muted. Dub techno does the same to a synthesiser chord over a kick drum.',
 desc:'Five chips from 1970s Kingston to dub techno today, each with a panel of text.',
 research:['Veal, M. E. (2007). Dub: Soundscapes and Shattered Songs in Jamaican Reggae. Wesleyan University Press.','Sherburne, P. (2004). Digital discipline: minimalism in house and techno. In Cox & Warner (eds), Audio Culture. Continuum.','Denk, F. & von Thülen, S. (2012). Der Klang der Familie: Berlin, Techno und die Wende. Suhrkamp.'],
 hint:'Press each chip to follow the idea from Jamaica to Berlin and on.',
 heading:'The mixing desk as an instrument',foot:'Sources: Veal (2007), Sherburne (2004)',
 items:[
  {k:'1970s',t:'Kingston, 1970s: dub',body:'Engineers such as King Tubby and producers such as Lee “Scratch” Perry made new versions of reggae recordings by muting and returning instruments, and by sending sounds through tape echo and spring reverb. The version, not the song, became the art.',phase:'Dub treated the studio itself as an instrument. That idea runs through all later electronic dance music.'},
  {k:'Systems',t:'Sound systems',body:'Dub was made for Jamaican sound systems: mobile stacks of speakers playing to open-air dances, where the weight of the bass mattered more than the tune. Engineers cut exclusive one-off discs for them.',phase:'The same culture, carried to Britain, shaped the free-party sound systems and the idea of the dubplate.'},
  {k:'1993',t:'Berlin, 1993: Basic Channel',body:'Moritz von Oswald and Mark Ernestus began releasing records as Basic Channel in 1993. They stripped techno down to a kick, a hazy chord and its echoes, with tape hiss left in. They also ran a record shop, a mastering studio and, from 1995, the label Chain Reaction.',phase:'Their later project Rhythm & Sound worked directly with reggae singers, making the Jamaican link explicit.'},
  {k:'Method',t:'What was borrowed',body:'Three things: echo timed to the beat, so repeats make a rhythm; filtering and reverb used to move a sound nearer or further away; and subtraction, where muting a part is as much of an event as adding one.',phase:'None of these needs a melody. That is why the style can hold attention with one chord for ten minutes.'},
  {k:'Since',t:'Since then',body:'The approach spread widely: to Detroit, where producers recorded for Basic Channel’s labels, and to artists in many countries who work with long delays, soft chords and deliberate noise. “Dub techno” became the usual name for it.',phase:'It remains one of techno’s slowest and quietest branches, typically around 115–128 BPM.'}]});

/* =========================== hard-and-industrial =========================== */
const X6_shape=(x,mode)=>mode==='soft'?Math.tanh(x):clamp(x,-1,1);
function X6_harm(drive,mode){const N=512,h=[];for(let n=1;n<=9;n++){let a=0;for(let i=0;i<N;i++){const th=2*Math.PI*(i+.5)/N;a+=X6_shape(drive*Math.sin(th),mode)*Math.sin(n*th)}h.push(Math.abs(2*a/N))}return h}
SCENE({id:'hard-and-industrial',name:'Distortion',tag:'Turning it up until it clips',
 definition:'Distortion happens when a signal is pushed past what a circuit can pass, so the tops of the wave are flattened. A flattened wave contains extra harmonics, which is why an overdriven kick sounds harder, brighter and louder at the same peak level.',
 example:'A pure sine has one harmonic. Driven to five times the clipping level it is nearly a square wave, with strong third, fifth and seventh harmonics.',
 desc:'A sine wave pushed through a clipping stage with a drive slider and a choice of hard or soft clipping, drawn beside a bar chart of its first nine harmonics.',
 research:['Pakarinen, J. & Yeh, D. T. (2009). A review of digital techniques for modeling vacuum-tube guitar amplifiers. Computer Music Journal 33(2), 85–100 (clipping and harmonics).','Reynolds, S. (1998). Energy Flash. Picador (hardcore and gabber).','The harmonic levels are computed from the drawn wave.'],
 dur:11,hint:'Raise the drive and press Play tone. Compare hard clipping, which flattens abruptly, with soft clipping, which rounds off.',
 init:()=>({drive:1,mode:'hard'}),
 watch(p){return {drive:Math.round((1+p*7)*2)/2,mode:p<.6?'hard':'soft'}},
 ui:[{range:'drive',label:'Drive',min:1,max:8,step:.5,get:s=>s.drive,act:'drive',show:v=>'×'+v},{choose:[['hard','Hard clip'],['soft','Soft clip']],label:'Kind',get:s=>s.mode,act:'mode'},{b:'Play tone',act:'tone'},{b:'Play kick',act:'kick'}],
 on:{drive(s,v){s.drive=+v;return 'keep'},mode(s,v){s.mode=v;return 'keep'},
  tone(s){const h=X6_harm(s.drive,s.mode),mx=Math.max(...h);AUDIO.tone(110,{dur:.8,gain:.1,partials:h.map(a=>a/mx)});return 'keep'},
  kick(s){const h=X6_harm(s.drive,s.mode),mx=Math.max(...h);AUDIO.kick({from:230,to:55,decay:.24,gain:.26});AUDIO.tone(55,{dur:.2,gain:.05,partials:h.map(a=>a/mx),attack:.003,release:.12});return 'keep'}},
 draw(s){
  const h=X6_harm(s.drive,s.mode),clip=s.mode==='hard'?s.drive>1:s.drive>1.5;let out=heading(s.drive<=1&&s.mode==='hard'?'No clipping: a clean sine':`Drive ×${s.drive}: ${s.mode==='hard'?'hard':'soft'} clipping`);
  const px=40,pw=260,cy=160,amp=80;out+=R(px,60,pw,200,'#fff',C.grid,4)+L(px,cy,px+pw,cy,C.grid,1);
  out+=L(px,cy-amp,px+pw,cy-amp,C.coral,1,'stroke-dasharray="5 4"')+L(px,cy+amp,px+pw,cy+amp,C.coral,1,'stroke-dasharray="5 4"');
  let d1='',d2='';for(let i=0;i<=200;i++){const th=i/200*4*Math.PI,x=px+i/200*pw;d1+=(i?'L':'M')+fmt(x)+' '+fmt(cy-clamp(s.drive*Math.sin(th),-1.22,1.22)*amp);d2+=(i?'L':'M')+fmt(x)+' '+fmt(cy-X6_shape(s.drive*Math.sin(th),s.mode)*amp)}
  out+=P(d1,'#b9c8d2',1.6,'none','stroke-dasharray="3 4"')+P(d2,C.blue,2.8)+T(px+pw/2,280,'wave: dashed in, blue out',12,C.muted);
  const bx=340,bw=24,by=250,bh=170;out+=R(bx-10,60,250,200,'#fff',C.grid,4);
  h.forEach((a,i)=>{const hh=Math.min(bh,a/1.3*bh);out+=R(bx+i*bw+2,by-hh,bw-6,hh,i===0?C.blue:(i%2===0?C.coral:C.purple),'none',3)+TF(bx+i*bw+bw/2-1,by+16-8,'',12,C.muted)+T(bx+i*bw+bw/2-1,276,String(i+1),12,C.muted)});
  out+=T(bx+115,78,'harmonics 1 to 9',12,C.muted);
  const odd=h[2]+h[4]+h[6]+h[8];
  out+=counter(60,296,'3rd harmonic',Math.round(h[2]/h[0]*100)+'% of 1st',C.coral,160)+counter(236,296,'5th harmonic',Math.round(h[4]/h[0]*100)+'% of 1st',C.coral,160)+counter(412,296,'even harmonics',h[1]+h[3]<.01?'none':'some',C.purple,130);
  out+=T(300,366,'Red dashes: the clipping level. Odd harmonics in red.',13,C.muted);
  return {svg:out,phase:!clip&&odd<.05?'Below the clipping level the wave passes unchanged: one harmonic, a pure tone.':s.mode==='hard'?'Hard clipping flattens the wave towards a square. A symmetrical clip adds only odd harmonics: the 3rd, 5th, 7th and 9th.':'Soft clipping rounds the peaks instead of cutting them. The same odd harmonics appear, but more gently.'};
 }});

const X6_HSPEC={N:16,ms:s=>15000/s.bpm,step(s,i){if(i%4===0)AUDIO.kick({from:240,to:55,decay:s.decay,gain:.25});if(i%4===2)X6_ohat(0,.05)}};
SCENE({id:'hard-and-industrial-tempo',name:'Fast kicks collide',tag:'When the tail meets the next hit',
 definition:'As the tempo rises, the gap between kicks shrinks. If the kick’s tail is longer than the gap, each kick lands on top of the last one’s tail, and the low end turns into a continuous rumble. Hard styles either shorten the kick or use that rumble on purpose.',
 example:'At 130 BPM the gap between kicks is 462 ms. At 180 BPM it is 333 ms, so a 400 ms kick overlaps the next one.',
 desc:'Four kicks drawn as fading envelopes along one bar, with sliders for tempo and kick length. Overlapping tails are shaded and the level left when the next kick lands is shown.',
 research:['Reynolds, S. (1998). Energy Flash. Picador (gabber and hardcore tempos).','Butler, M. J. (2006). Unlocking the Groove. Indiana University Press.','The envelope is a simple exponential fade; the percentages follow from it.'],
 dur:11,hint:'Raise the tempo with a long kick and watch the tails collide, then shorten the kick. Press Play to hear it.',
 init:()=>({bpm:140,decay:.3,playing:false,pos:-1}),
 watch(p){return {bpm:Math.round(125+p*85),decay:.4,playing:false,pos:-1}},
 ui:[{range:'bpm',label:'Tempo (BPM)',min:120,max:220,step:1,get:s=>s.bpm,act:'bpm'},{range:'decay',label:'Kick length',min:.1,max:.6,step:.02,get:s=>s.decay,act:'decay',show:v=>Math.round(v*1000)+' ms'},{b:'Play / stop',act:'play'}],
 on:X6_seq(X6_HSPEC,{bpm(s,v,ctx){s.bpm=+v;X6_restart(s,ctx,X6_HSPEC);return 'keep'},decay(s,v){s.decay=+v;return 'keep'}}),
 draw(s,f,X){
  const gap=60/s.bpm,over=s.decay>gap,left=Math.exp(-7.1*gap/s.decay),px=50,pw=500,py=230,ph=140,barT=4*gap,XX=t=>px+t/barT*pw;
  let out=heading(over?`Tails overlap: ${Math.round(s.decay*1000)} ms kick, ${Math.round(gap*1000)} ms gap`:`Clear: ${Math.round(gap*1000)} ms between kicks`,28);
  out+=R(px,py-ph,pw,ph+0,'#fff',C.grid,4);
  for(let k=0;k<4;k++){let d=`M${fmt(XX(k*gap))} ${py}`;const end=Math.min(barT,k*gap+s.decay);for(let i=0;i<=60;i++){const t=k*gap+i/60*(end-k*gap);d+='L'+fmt(XX(t))+' '+fmt(py-Math.exp(-7.1*(t-k*gap)/s.decay)*(ph-10))}d+=`L${fmt(XX(end))} ${py}Z`;
   out+=P(d,C.blue,2,k%2?'#cfe0ec':'#dfeaf2','fill-opacity=".8"');
   if(over&&k<3)out+=R(XX((k+1)*gap),py-ph+4,Math.max(2,XX(Math.min(barT,k*gap+s.decay))-XX((k+1)*gap)),ph-4,C.coralp,'none',0,'opacity=".45"');
   out+=TF(XX(k*gap)+4,py+16,'beat '+(k+1),12,C.muted,'start')}
  const pos=X6_pos(s,X,16,s.bpm/15);if(pos>=0)out+=L(XX(pos*gap/4),py-ph,XX(pos*gap/4),py,C.amber,2);
  out+=counter(50,264,'gap between kicks',Math.round(gap*1000)+' ms',C.blue,150)+counter(216,264,'kick length',Math.round(s.decay*1000)+' ms',C.purple,130)+counter(362,264,'tail left at next kick',(left<.001?'0':left<.01?'<1':Math.round(left*100))+'%',over?C.coral:C.green,188);
  out+=T(300,340,over?'Shaded: where one kick’s tail runs under the next kick.':'Each kick has faded before the next one starts.',14,C.ink);
  out+=T(300,364,'Model: exponential fade to silence over the kick length.',13,C.muted);
  return {svg:out,phase:over?'The tails overlap, so the bass never falls silent. Slow this down and it is mud; in gabber and hard techno a distorted, overlapping kick is the bassline.':'There is silence between the kicks, which is what lets a separate bassline or the room’s own echo be heard.'};
 }});

X6_cards({id:'hard-and-industrial-lineage',name:'Hard and industrial techno',tag:'Louder, faster, rougher',
 definition:'Alongside the smoother styles there has always been a harder line of techno: faster, distorted and percussive, drawing on 1980s industrial music and electronic body music. It includes Rotterdam gabber, the “Birmingham sound”, German schranz and today’s hard techno.',
 example:'Where minimal techno might run at 126 BPM with a soft kick, gabber runs at 160–200 BPM with a kick distorted until it has a pitch of its own.',
 desc:'Five chips from 1980s industrial music to the hard techno of the 2020s, each with a panel of text.',
 research:['Reynolds, S. (1998). Energy Flash. Picador (Belgian hardcore and gabber).','Reed, S. A. (2013). Assimilate: A Critical History of Industrial Music. Oxford University Press.','Denk, F. & von Thülen, S. (2012). Der Klang der Familie. Suhrkamp.','Tempo figures are typical and approximate.'],
 hint:'Press each chip. Tempo figures are typical values, not rules.',
 heading:'The hard line',foot:'Sources: Reynolds (1998), Reed (2013)',
 items:[
  {k:'1980s',t:'1980s: industrial and EBM',body:'Industrial groups used noise, metal percussion and tape. “Electronic body music”, a name used by the Belgian group Front 242, set shouted vocals over hard sequenced basslines and drum machines. Its sound fed directly into Belgian and German techno.',phase:'This is a European root of techno, alongside the American ones in Detroit and Chicago.'},
  {k:'Belgium',t:'Around 1990: Belgian hardcore',body:'Belgian producers and labels such as R&S turned out fast, harsh rave records built on distorted synthesiser riffs. Reynolds describes this as the moment rave music “hardened”, and British and Dutch scenes followed.',phase:'The stress moved from groove to impact: riffs and stabs rather than basslines.'},
  {k:'Gabber',t:'1992: Rotterdam gabber',body:'In Rotterdam, hardcore sped up past 160 BPM around a heavily distorted kick drum. “Gabber” is Amsterdam slang for “mate”. Rotterdam Records, founded by Paul Elstak in 1992, was its first well-known label.',phase:'In gabber the overdriven kick is long enough, and clipped enough, to act as the bassline.'},
  {k:'UK, DE',t:'Mid-1990s: Birmingham and schranz',body:'In Birmingham, the Downwards label and the club night House of God were home to a dry, pounding, loop-based techno often called the “Birmingham sound”. In Germany in the later 1990s a fast, compressed, percussive style became known as “schranz”.',phase:'Both kept techno’s four-on-the-floor frame and removed almost everything except drums and texture.'},
  {k:'Today',t:'2020s: hard techno again',body:'Since about 2020, tempos on many techno dance floors have risen again, with sets commonly at 140–160 BPM and distorted kicks back in fashion. The style is usually just called “hard techno”.',phase:'Speed in techno has gone in waves. The current one borrows openly from 1990s hardcore, trance and gabber.'}]});
