/* ===================== Music era 5 · The science of timbre ===================== */
/* Why a violin and a flute differ on the same note: harmonic spectra (Fourier, Helmholtz), envelopes,
   resonant bodies, the ear, loudness and the voice. Pictures are pure functions of state and time; sound
   comes only from on() handlers through AUDIO. Instrument spectra and envelopes are illustrative. */

// ---- Sound: one oscillator with a harmonic spectrum (amplitudes, optional phases) and an ADSR envelope.
function M5_play(hz,o={}){
 const c=AUDIO.get();if(!c||!(hz>0))return;
 const {amps=[1],phases=null,dur=1,gain=.16,at=0,env={a:.01,d:.1,s:.8,r:.2}}=o;
 if(!amps.some(a=>a>0))return;
 try{
  const t0=c.currentTime+at,osc=c.createOscillator(),g=c.createGain(),n=amps.length+1,re=new Float32Array(n),im=new Float32Array(n);
  amps.forEach((a,k)=>{const ph=phases?phases[k]:0;im[k+1]=a*Math.cos(ph);re[k+1]=a*Math.sin(ph)});
  osc.setPeriodicWave(c.createPeriodicWave(re,im));osc.frequency.setValueAtTime(hz,t0);
  const G=Math.min(gain,.3),a=Math.max(.003,env.a),d=Math.max(.003,env.d),sus=clamp(env.s,0,1),r=Math.max(.02,env.r),hold=Math.max(a+d,dur);
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(G,t0+a);g.gain.linearRampToValueAtTime(G*sus+1e-4,t0+a+d);
  g.gain.setValueAtTime(G*sus+1e-4,t0+hold);g.gain.linearRampToValueAtTime(0,t0+hold+r);
  osc.connect(g);g.connect(AUDIO.master);osc.start(t0);osc.stop(t0+hold+r+.05);AUDIO.nodes.add(osc);osc.onended=()=>AUDIO.nodes.delete(osc);
 }catch(_){}
}
// A set of (possibly inharmonic) partials, each its own sine, struck and decaying.
function M5_strike(hz,ratios,amps,o={}){const {dur=1.6,gain=.2}=o,tot=sum(amps)||1;ratios.forEach((q,i)=>{if(amps[i]>0&&hz*q<16000)M5_play(hz*q,{amps:[1],gain:gain*amps[i]/tot*1.6,dur:.02,env:{a:.004,d:dur*(1-i*.08),s:0,r:.05}})})}

// ---- Drawing helpers
// Waveform: the sum of harmonics k = 1..n with amplitudes and phases, over `periods` cycles, scaled to fit.
function M5_wave(amps,phases,x0,y0,w,h,periods=2,col=C.blue,envFn=null){
 const n=220,vals=[];let mx=1e-9;
 for(let i=0;i<=n;i++){const t=i/n*periods;let v=0;amps.forEach((a,k)=>{if(a)v+=a*Math.sin(2*Math.PI*(k+1)*t+(phases?phases[k]:0))});vals.push(v);mx=Math.max(mx,Math.abs(v))}
 const sc=(h/2*.92)/mx;
 return L(x0,y0,x0+w,y0,C.grid,1)+P('M'+vals.map((v,i)=>fmt(x0+i/n*w)+' '+fmt(y0-v*sc*(envFn?envFn(i/n):1))).join('L'),col,2.4);
}
// Spectrum bars for harmonics 1..n; optional press target per bar.
function M5_bars(X,amps,x0,base,w,h,col=C.blue,act=null,labelEvery=1){
 const n=amps.length,bw=w/n;let out=L(x0,base,x0+w,base,C.line,1.5);
 amps.forEach((a,k)=>{const bh=clamp(a,0,1)*h,x=x0+k*bw;
  const inner=R(x+bw*.18,base-h,bw*.64,h,'transparent','none',3)+R(x+bw*.18,base-bh,bw*.64,bh,col,'none',3);
  out+=act?hit(X,act,k,`Harmonic ${k+1}: ${Math.round(a*100)}%. Press to change.`,inner):inner;
  if(k%labelEvery===0||k===n-1)out+=TF(x+bw/2,base+15,k+1,12,C.muted)});
 return out;
}
const M5_ADSR_PTS=(e,hold)=>[[0,0],[e.a,1],[e.a+e.d,e.s],[hold,e.s],[hold+e.r,0]];
function M5_envPath(e,x0,y0,w,h,total,col=C.coral){const hold=Math.max(e.a+e.d,total*.62);return P('M'+M5_ADSR_PTS(e,hold).map(([t,v])=>fmt(x0+t/(hold+e.r)*w)+' '+fmt(y0-v*h)).join('L'),col,3)}
function M5_envAt(e,t,hold){if(t<e.a)return t/Math.max(e.a,1e-3);if(t<e.a+e.d)return 1-(1-e.s)*(t-e.a)/Math.max(e.d,1e-3);if(t<hold)return e.s;return Math.max(0,e.s*(1-(t-hold)/Math.max(e.r,1e-3)))}
const M5_logX=(f,x0,w,f0=20,f1=20000)=>x0+w*Math.log(f/f0)/Math.log(f1/f0);

// Illustrative instrument spectra (harmonic amplitudes) and envelopes (seconds; s = sustain level 0–1).
const M5_INST={
 piano:{name:'Piano-like',amps:[1,.6,.42,.3,.22,.14,.1,.06,.04,.03],env:{a:.005,d:1.4,s:0,r:.25},noise:true},
 violin:{name:'Violin-like',amps:[1,.82,.66,.58,.46,.38,.3,.26,.2,.16,.12,.1],env:{a:.13,d:.12,s:.85,r:.22}},
 organ:{name:'Organ-like',amps:[1,.5,.32,.06,.22,0,.12,.05],env:{a:.03,d:.01,s:1,r:.06}},
 guitar:{name:'Plucked string',amps:[1,.72,.5,.34,.24,.16,.1,.07],env:{a:.003,d:.9,s:.04,r:.3},noise:true},
 flute:{name:'Flute-like',amps:[1,.24,.1,.05,.02],env:{a:.09,d:.05,s:.9,r:.12}},
 clarinet:{name:'Clarinet-like',amps:[1,.05,.62,.04,.38,.03,.22,.02,.12],env:{a:.04,d:.05,s:.9,r:.12}},
 trumpet:{name:'Trumpet-like',amps:[.75,.95,1,.8,.62,.48,.36,.26,.18,.12],env:{a:.05,d:.08,s:.85,r:.12}}
};
const M5_PRESETS={sine:[1],square:range(12).map(k=>(k+1)%2?1/(k+1):0),saw:range(12).map(k=>1/(k+1)),clarinet:M5_INST.clarinet.amps,flute:M5_INST.flute.amps};
const M5_pad=(a,n=12)=>range(n).map(k=>a[k]||0);
const M5_norm=a=>{const m=Math.max(...a,1e-9);return a.map(v=>v/m)};

/* ===================== Lesson: fourier-timbre ===================== */
SCENE({id:'fourier-timbre',name:'Timbre and harmonics',tag:'A note is a stack of sine waves',
 definition:'Timbre is the colour of a sound: what makes two instruments differ on the same pitch and loudness. Much of it comes from the mix of harmonics, sine waves at whole-number multiples of the note’s frequency.',
 example:'Add harmonic 2 at half strength, harmonic 3 at a third, and so on, and a smooth sine turns into a buzzy sawtooth. Keep only the odd harmonics and it becomes a hollow, clarinet-like square wave.',
 desc:'A waveform built from up to twelve harmonics beside bars showing how strong each harmonic is.',
 research:'Fourier (1822). Théorie analytique de la chaleur. · Helmholtz (1863). On the Sensations of Tone.',
 dur:10,hint:'Press a bar to change that harmonic’s strength, or choose a preset, then press Play to hear the waveform.',
 init:()=>({amps:M5_PRESETS.saw.slice(),preset:'saw',note:57}),
 watch(p){const n=1+Math.floor(p*11.99);return {amps:range(12).map(k=>k<n?1/(k+1):0),preset:'build',n,note:57}},
 ui:[{choose:[['sine','Sine'],['saw','Sawtooth'],['square','Square'],['clarinet','Clarinet-like'],['flute','Flute-like']],label:'Preset',get:s=>s.preset,act:'preset'},
  {range:'note',label:'Pitch',min:45,max:72,get:s=>s.note,act:'note',show:v=>noteName(v)},{b:'Play ▶',act:'play',aria:'Play this waveform'}],
 on:{preset(s,v){s.preset=v;s.amps=M5_pad(M5_PRESETS[v])},note(s,v){s.note=v},
  bar(s,k){k=Number(k);const lv=[0,.2,.4,.6,.8,1],i=lv.findIndex(x=>x>=s.amps[k]-1e-6);s.amps[k]=lv[(i+1)%lv.length];s.preset='custom'},
  play(s){M5_play(midiHz(s.note),{amps:s.amps,dur:1.2,env:{a:.02,d:.05,s:.9,r:.2}})}},
 draw(s,f,X){
  const n=s.amps.filter(a=>a>0).length;let out=heading(s.preset==='build'?`Adding harmonics one at a time: ${s.n} so far`:'The sum of the harmonics below');
  out+=R(24,48,552,150,'#fff',C.grid,10)+M5_wave(s.amps,null,40,123,520,130,2,C.blue);
  out+=TF(560,190,'2 cycles of the waveform',12,C.muted,'end');
  out+=M5_bars(X,s.amps,60,330,480,105,C.purple,'bar');
  out+=T(300,370,`harmonic number (× ${fmt(midiHz(s.note))} Hz, ${noteName(s.note)})`,13,C.muted);
  out+=TF(56,222,'strength',12,C.muted,'start');
  const odd=s.amps.every((a,k)=>(k%2===0)||a<1e-6)&&n>1;
  return {svg:out,phase:s.preset==='build'?`Each new harmonic is a faster sine wave. With ${s.n} of them at strengths 1, ½, ⅓ …, the smooth sine is turning into the sharp-cornered sawtooth Fourier showed any periodic shape can be built from.`:
   odd?'Only odd harmonics: the wave grows flat tops and a hollow, reedy sound, like a clarinet’s low register.':`${n} harmonic${n===1?'':'s'} switched on. Same pitch, different mix, different colour: this is the heart of timbre.`};
 }});

// Ohm's acoustic law (as tested by Helmholtz): changing the phases of harmonics changes the shape, not the sound.
SCENE({id:'fourier-timbre-phase',name:'Phase and timbre',tag:'Same harmonics, different shape',
 definition:'Shifting harmonics in time against each other (changing their phases) can change a waveform’s shape completely while it sounds almost the same. The ear mostly hears how strong each harmonic is.',
 example:'A sawtooth and a jumbled wave with the same harmonic strengths look nothing alike on an oscilloscope, yet for a steady tone most listeners hear them as the same sound.',
 desc:'Two waveforms with identical harmonic strengths but different phases, above one shared set of spectrum bars.',
 research:'Ohm (1843), as tested by Helmholtz (1863). On the Sensations of Tone. Later work (e.g. Plomp & Steeneken 1969) found phase can matter slightly for low notes.',
 dur:9,hint:'Press New phases to jumble the timing of the harmonics, then play A and B to compare.',
 init:()=>({seed:7}),
 watch(p){return {seed:7,mix:smooth(p)}},
 ui:[{b:'Play A ▶',act:'playA'},{b:'Play B ▶',act:'playB'},{b:'New phases',act:'reseed'}],
 on:{reseed(s){s.seed=nextSeed()%10000},
  playA(){M5_play(midiHz(50),{amps:M5_PRESETS.saw,dur:1.1})},
  playB(s){M5_play(midiHz(50),{amps:M5_PRESETS.saw,phases:M5_phases(s.seed,1),dur:1.1})}},
 draw(s,f,X){
  const mix=s.mix===undefined?1:s.mix,ph=M5_phases(s.seed,mix);let out=heading('Same strengths, different timing');
  out+=R(24,46,270,150,'#fff',C.grid,10)+TB(40,66,'A · phases lined up',13,C.blue,'start')+M5_wave(M5_PRESETS.saw,null,36,128,246,110,2,C.blue);
  out+=R(306,46,270,150,'#fff',C.grid,10)+TB(322,66,`B · phases ${mix<1?'drifting':'jumbled'}`,13,C.coral,'start')+M5_wave(M5_PRESETS.saw,ph,318,128,246,110,2,C.coral);
  out+=M5_bars(X,M5_PRESETS.saw,120,330,360,100,C.purple);
  out+=TF(300,234,'strength of each harmonic: identical for A and B',12,C.muted);
  return {svg:out,phase:'The bars are the same for both waves, so their spectra match. Play them: on a steady note they sound nearly alike, which is why timbre is described by the spectrum rather than the shape.'};
 }});
function M5_phases(seed,mix){const r=rng(seed*7919+13);return range(12).map(()=>r()*2*Math.PI*mix)}

SCENE({id:'fourier-timbre-pitch',name:'Timbre across pitch',tag:'The pattern moves as a block',
 definition:'When an instrument plays a higher note, all its harmonics move up together. On a logarithmic frequency scale the pattern keeps its shape and simply slides.',
 example:'A3 has harmonics at 220, 440, 660 Hz …; A4’s are at 440, 880, 1320 Hz …. Each ratio between harmonics stays the same, so the instrument stays recognisable.',
 desc:'A spectrum on a logarithmic frequency axis from 50 Hz to 5 kHz, with the harmonics of the chosen note marked as bars.',
 research:'Helmholtz (1863). On the Sensations of Tone.',
 dur:9,hint:'Slide the pitch and watch the whole pattern of harmonics shift. Press Play to hear it.',
 init:()=>({note:45,inst:'violin'}),
 watch(p){return {note:Math.round(36+p*36),inst:'violin'}},
 ui:[{range:'note',label:'Pitch',min:36,max:76,get:s=>s.note,act:'note',show:v=>noteName(v)},{choose:[['violin','Violin-like'],['clarinet','Clarinet-like'],['flute','Flute-like']],label:'Instrument',get:s=>s.inst,act:'inst'},{b:'Play ▶',act:'play'}],
 on:{note(s,v){s.note=v},inst(s,v){s.inst=v},play(s){const I=M5_INST[s.inst];M5_play(midiHz(s.note),{amps:I.amps,env:I.env,dur:1})}},
 draw(s){
  const f0=midiHz(s.note),I=M5_INST[s.inst],x0=50,w=500,base=280;let out=heading(`${noteName(s.note)} = ${fmt(f0)} Hz, ${I.name.toLowerCase()}`);
  out+=L(x0,base,x0+w,base,C.line,1.5);
  for(const f of [50,100,200,500,1000,2000,5000]){const x=M5_logX(f,x0,w,50,5000);out+=L(x,base,x,base+6,C.line,1.5)+TF(x,base+22,f>=1000?f/1000+' kHz':f+' Hz',12,C.muted)}
  I.amps.forEach((a,k)=>{const f=f0*(k+1);if(f>5000)return;const x=M5_logX(f,x0,w,50,5000);out+=L(x,base,x,base-a*170,C.purple,6)+(k<4?TF(x,base-a*170-8,k+1,12,C.purple):'')});
  out+=T(300,330,'Frequency on a log scale: equal steps are equal ratios',14,C.muted);
  return {svg:out,phase:`Harmonic 1 sits at ${fmt(f0)} Hz and the rest at 2×, 3×, 4× …. Moving the pitch slides the whole pattern sideways without changing its shape, which is part of why we still recognise the instrument.`};
 }});

/* ===================== Lesson: envelope ===================== */
SCENE({id:'envelope',name:'Envelope (ADSR)',tag:'How a sound starts, holds and fades',
 definition:'A sound’s envelope is how its loudness changes over time. Synthesisers describe it with four numbers: attack, decay, sustain and release (ADSR).',
 example:'A piano note starts instantly and then fades even while the key is held; an organ note reaches full volume and stays there until you let go.',
 desc:'An ADSR envelope graph above a tone whose amplitude follows the envelope.',
 research:'ADSR envelopes were introduced in early analogue synthesisers (Buchla and Moog, 1960s); see also Pinch & Trocco (2002). Analog Days.',
 dur:10,hint:'Set attack, decay, sustain and release, then press Play. The same harmonics with a different envelope can sound like a different instrument.',
 init:()=>({a:120,d:150,s:80,r:300}),
 watch(p){const A=M5_INST.organ.env,B=M5_INST.piano.env,u=smooth(p);return {a:Math.round(lerp(A.a,B.a,u)*1000),d:Math.round(lerp(A.d,B.d,u)*1000),s:Math.round(lerp(A.s,B.s,u)*100),r:Math.round(lerp(A.r,B.r,u)*1000)}},
 ui:[{range:'a',label:'Attack',min:0,max:800,step:10,get:s=>s.a,act:'a',show:v=>v+' ms'},{range:'d',label:'Decay',min:0,max:1500,step:10,get:s=>s.d,act:'d',show:v=>v+' ms'},
  {range:'s',label:'Sustain',min:0,max:100,step:5,get:s=>s.s,act:'s',show:v=>v+'%'},{range:'r',label:'Release',min:10,max:1500,step:10,get:s=>s.r,act:'r',show:v=>v+' ms'},{b:'Play ▶',act:'play'}],
 on:{a(s,v){s.a=v},d(s,v){s.d=v},s(s,v){s.s=v},r(s,v){s.r=v},play(s){M5_play(midiHz(57),{amps:M5_INST.violin.amps,dur:1.2,env:{a:s.a/1000,d:s.d/1000,s:s.s/100,r:s.r/1000}})}},
 draw(s){
  const e={a:s.a/1000,d:s.d/1000,s:s.s/100,r:s.r/1000},hold=Math.max(e.a+e.d,1.2),T1=hold+e.r,x0=50,w=500;let out=heading('Loudness over time');
  out+=R(30,46,540,176,'#fff',C.grid,10);
  const pts=M5_ADSR_PTS(e,hold).map(([t,v])=>[x0+t/T1*w,206-v*140]);
  out+=P('M'+pts.map(q=>fmt(q[0])+' '+fmt(q[1])).join('L')+`L${fmt(x0+w)} 206L${x0} 206Z`,'none',0,'#e7e2f3')+P('M'+pts.map(q=>fmt(q[0])+' '+fmt(q[1])).join('L'),C.purple,3);
  const lab=[['A',0,e.a],['D',e.a,e.a+e.d],['S',e.a+e.d,hold],['R',hold,T1]];
  lab.forEach(([n,a,b])=>{const xa=x0+a/T1*w,xb=x0+b/T1*w;if(xb-xa>14)out+=TB((xa+xb)/2,220,n,13,C.purple)});
  out+=L(x0+hold/T1*w,58,x0+hold/T1*w,206,C.coral,1.5,'stroke-dasharray="4 4"')+TF(x0+hold/T1*w,70,'key released',12,C.coral);
  // the tone itself, shaped by the envelope (drawn at a slow, illustrative frequency)
  out+=R(30,236,540,110,'#fff',C.grid,10);
  const N=400;let d='';for(let i=0;i<=N;i++){const t=i/N*T1,v=M5_envAt(e,t,hold)*Math.sin(2*Math.PI*i/N*40);d+=(i?'L':'M')+fmt(x0+i/N*w)+' '+fmt(291-v*46)}
  out+=P(d,C.blue,1.6)+TF(300,360,`attack ${s.a} ms · decay ${s.d} ms · sustain ${s.s}% · release ${s.r} ms`,13,C.muted);
  return {svg:out,phase:s.s<10?'With almost no sustain the sound dies away even while held, like a struck or plucked string.':s.a>300?'A slow attack swells in gently, like a bowed string or a soft pad.':'A quick attack and steady sustain: the sound starts crisply and holds while the key is down.'};
 }});

SCENE({id:'envelope-instruments',name:'Envelopes of instruments',tag:'Spectrum and envelope together',
 definition:'Real instruments differ in both their harmonic mix and their envelope. Struck and plucked sounds die away; bowed and blown sounds can be held.',
 example:'A plucked guitar string and a bowed violin string share harmonics, but the guitar’s fast attack and steady decay make it sound plucked however you mix the harmonics.',
 desc:'For the chosen instrument model, its harmonic bars and its loudness envelope side by side.',
 research:'Risset & Wessel (1999). Exploration of timbre by analysis and synthesis, in Deutsch (ed.), The Psychology of Music.',
 dur:12,hint:'Choose an instrument model and press Play. The models are simplified: real instruments change their spectrum as the note evolves.',
 init:()=>({inst:'piano'}),
 watch(p){const ks=['piano','violin','organ','guitar','trumpet'];return {inst:ks[Math.min(4,Math.floor(p*5))]}},
 ui:[{choose:Object.entries(M5_INST).map(([k,v])=>[k,v.name.replace('-like','')]),label:'Instrument',get:s=>s.inst,act:'inst'},{b:'Play ▶',act:'play'}],
 on:{inst(s,v){s.inst=v},play(s){const I=M5_INST[s.inst];if(I.noise)AUDIO.noise({dur:.03,gain:.06});M5_play(midiHz(55),{amps:I.amps,env:I.env,dur:1.1})}},
 draw(s,f,X){
  const I=M5_INST[s.inst];let out=heading(I.name+' model');
  out+=R(24,48,264,250,'#fff',C.grid,10)+TB(156,72,'Harmonics',14,C.ink)+M5_bars(X,M5_pad(I.amps,12),40,270,232,170,C.purple,null,2);
  out+=R(312,48,264,250,'#fff',C.grid,10)+TB(444,72,'Envelope',14,C.ink);
  const e=I.env,hold=Math.max(e.a+e.d,1.2),T1=hold+e.r;
  out+=L(328,270,560,270,C.line,1.5)+M5_envPath(e,328,270,232,170,1.2,C.coral);
  out+=TF(444,288,'time →',12,C.muted);
  out+=T(300,330,e.s<.1?'Dies away: struck or plucked':'Holds while sounding: bowed, blown or electronic',15,C.ink);
  return {svg:out,phase:`${I.name}: ${I.amps.filter(a=>a>.05).length} strong harmonics and a ${e.a<.02?'sudden':e.a<.08?'quick':'gentle'} attack. Change only the envelope and the same harmonics can sound plucked, bowed or held.`};
 }});

// Saldanha & Corso (1964): removing the initial transient makes instruments much harder to identify.
const M5_QUIZ=['piano','violin','trumpet','flute','guitar','clarinet'];
SCENE({id:'envelope-no-attack',name:'Cutting off the attack',tag:'Listening experiment',
 definition:'The first fraction of a second of a note, its attack, carries much of what lets us name the instrument. Remove it and identification gets much harder.',
 example:'In 1964 Saldanha and Corso played recorded instrument notes with and without their opening transients; listeners named the instruments noticeably less accurately without them.',
 desc:'A mystery tone with its attack either kept or cut, three answer buttons, and your accuracy for each condition.',
 research:'Saldanha & Corso (1964). Timbre cues and the identification of musical instruments. Journal of the Acoustical Society of America 36.',
 dur:10,hint:'Choose With attack or Attack removed, press Play mystery, then press the instrument you think it is. Compare your scores.',
 init:()=>({cut:false,trial:0,seed:5,res:{with:[0,0],cut:[0,0]},last:null}),
 watch(p){return {cut:p>.5,trial:0,seed:5,res:{with:[0,0],cut:[0,0]},last:null,demo:p}},
 ui:[{choose:[['false','With attack'],['true','Attack removed']],label:'Condition',get:s=>String(s.cut),act:'cut'},{b:'Play mystery ▶',act:'play'},{b:'Clear scores',act:'clear'}],
 on:{cut(s,v){s.cut=v==='true';s.last=null},clear(s){s.res={with:[0,0],cut:[0,0]};s.last=null},
  play(s){const q=M5_quizTrial(s),I=M5_INST[q.inst];
   if(s.cut)M5_play(midiHz(55),{amps:I.amps,dur:.9,env:{a:.12,d:.01,s:Math.max(.35,I.env.s||.35),r:.25}});
   else{if(I.noise)AUDIO.noise({dur:.03,gain:.06});M5_play(midiHz(55),{amps:I.amps,env:I.env,dur:.9})}},
  guess(s,v){const q=M5_quizTrial(s),k=s.cut?'cut':'with';s.res[k][1]++;if(v===q.inst)s.res[k][0]++;s.last={guess:v,ans:q.inst};s.trial++}},
 draw(s,f,X){
  const q=M5_quizTrial(s),I=M5_INST[q.inst];let out=heading(s.cut?'Attack removed: only the steady part is left':'With attack: the note starts as the instrument starts it');
  const e=s.cut?{a:.12,d:.01,s:.6,r:.25}:I.env,hold=Math.max(e.a+e.d,1),T1=hold+e.r;
  out+=R(24,46,552,120,'#fff',C.grid,10);
  if(!s.cut)out+=R(50,54,64,104,C.amberp,'none',6)+TF(82,148,'attack',12,C.amber);
  out+=L(50,150,550,150,C.line,1)+M5_envPath(e,50,150,500,86,1,C.coral);
  if(s.cut)out+=P('M60 56L80 156M80 56L60 156',C.coral,2)+TF(72,72,'cut',12,C.coral,'end');
  out+=T(300,192,X.try?'Which instrument was it?':'In Try it, you identify mystery notes',15,C.ink);
  q.choices.forEach((c,i)=>{const x=110+i*140,ok=s.last&&s.last.ans===c,wrong=s.last&&s.last.guess===c&&!ok;out+=hit(X,'guess',c,`Answer: ${M5_INST[c].name}`,R(x-60,206,120,44,ok?C.greenp:wrong?C.coralp:'#fff',ok?C.green:wrong?C.coral:C.line,10)+T(x,234,M5_INST[c].name.replace('-like',''),15,C.ink))});
  const pc=r=>r[1]?Math.round(100*r[0]/r[1])+'%':'—';
  out+=counter(140,276,'with attack',`${pc(s.res.with)} of ${s.res.with[1]}`,C.blue,150)+counter(310,276,'attack removed',`${pc(s.res.cut)} of ${s.res.cut[1]}`,C.coral,150);
  out+=TF(300,352,'Published finding: identification drops when the attack is removed (Saldanha & Corso 1964).',12,C.muted);
  return {svg:out,phase:s.last?`It was the ${M5_INST[s.last.ans].name.toLowerCase()} model. ${s.last.guess===s.last.ans?'Correct.':'Not this time.'} Try several of each condition and compare your two scores.`:'The attack carries scraping, breathy or percussive noise that names the instrument. These synthetic models are simpler than real recordings, so expect a smaller drop than with real instruments.'};
 }});
function M5_quizTrial(s){const r=rng(s.seed*131+s.trial*977+1),inst=M5_QUIZ[Math.floor(r()*M5_QUIZ.length)];const others=shuffled(M5_QUIZ.filter(k=>k!==inst),s.seed+s.trial*31).slice(0,2);return {inst,choices:shuffled([inst,...others],s.trial*17+s.seed)}}

/* ===================== Lesson: instrument-resonance ===================== */
const M5_BODIES={
 string:{name:'String (fixed ends)',ratios:[1,2,3,4,5,6],amps:[1,.5,.33,.25,.2,.17],note:'Harmonic: every mode is a whole-number multiple.'},
 openpipe:{name:'Open pipe (flute)',ratios:[1,2,3,4,5,6],amps:[1,.4,.25,.15,.1,.07],note:'Open at both ends: all harmonics, like a string.'},
 closedpipe:{name:'Closed pipe',ratios:[1,3,5,7,9,11],amps:[1,.45,.28,.18,.12,.08],note:'Closed at one end: only odd harmonics.'},
 membrane:{name:'Drum membrane',ratios:[1,1.593,2.136,2.295,2.653,2.917],amps:[1,.75,.6,.5,.42,.36],note:'Circular membrane: Bessel-function modes, not whole-number multiples.'},
 bar:{name:'Free bar (xylophone blank)',ratios:[1,2.756,5.404,8.933],amps:[1,.5,.3,.2],note:'A uniform free bar: 1 : 2.76 : 5.40 : 8.93. Makers carve the bar to tune these.'},
 bell:{name:'Church bell (approx.)',ratios:[.5,1,1.2,1.5,2,2.5],amps:[.6,1,.7,.45,.9,.4],note:'Hum, prime, minor-third tierce, quint, nominal: approximate tuned-bell partials.'}
};
SCENE({id:'instrument-resonance',name:'Resonant bodies',tag:'Why drums are less pitched',
 definition:'An instrument’s vibrating body has natural modes. Strings and pipes have modes at whole-number ratios, so they sound clearly pitched; drums, bars and bells have inharmonic modes.',
 example:'A timpani’s membrane modes sit at about 1, 1.59, 2.14 and 2.30 times the lowest mode, not 1, 2, 3, 4, which is why a drum sounds less like a single note than a string does.',
 desc:'The chosen body’s modes as bars on a frequency axis, with grey guide lines at whole-number multiples to show which modes line up.',
 research:'Rayleigh (1877). The Theory of Sound. · Rossing & Fletcher (1998). The Physics of Musical Instruments.',
 dur:12,hint:'Choose a vibrating body and press Strike to hear its first few modes together.',
 init:()=>({body:'membrane'}),
 watch(p){const ks=['string','closedpipe','membrane','bar','bell'];return {body:ks[Math.min(4,Math.floor(p*5))]}},
 ui:[{choose:Object.entries(M5_BODIES).map(([k,v])=>[k,v.name.split(' (')[0]]),label:'Body',get:s=>s.body,act:'body'},{b:'Strike ▶',act:'strike'}],
 on:{body(s,v){s.body=v},strike(s){const B=M5_BODIES[s.body];M5_strike(midiHz(s.body==='bell'?60:48),B.ratios,B.amps,{dur:s.body==='string'||s.body==='openpipe'||s.body==='closedpipe'?1.2:1.8})}},
 draw(s){
  const B=M5_BODIES[s.body],x0=50,w=500,base=270,mx=Math.max(...B.ratios)*1.08;let out=heading(B.name);
  out+=L(x0,base,x0+w,base,C.line,1.5);
  for(let k=1;k<=Math.floor(mx);k++){const x=x0+k/mx*w;out+=L(x,80,x,base,C.grid,1.2,'stroke-dasharray="3 5"')+TF(x,base+18,k+'×',12,C.muted)}
  B.ratios.forEach((q,i)=>{const x=x0+q/mx*w,h=B.amps[i]*160,whole=Math.abs(q-Math.round(q))<.02;out+=L(x,base,x,base-h,whole?C.blue:C.coral,7)+TF(x,base-h-8,fmt(q),12,whole?C.blue:C.coral)});
  out+=T(300,316,B.note,15,C.ink);
  out+=TF(300,346,'blue: on a whole-number multiple · coral: inharmonic',12,C.muted);
  return {svg:out,phase:B.ratios.every(q=>Math.abs(q*2-Math.round(q*2))<.03)&&s.body!=='bell'?'The modes line up with the harmonic series, so the ear fuses them into one clear pitch.':'The modes fall between the whole-number lines, so the ear hears a clang or a less definite pitch.'};
 }});

// Plucking at a fraction x of the length: harmonic k has amplitude ∝ sin(kπx)/k² (triangular initial shape).
SCENE({id:'instrument-resonance-string',name:'Where you pluck',tag:'Pluck position shapes the spectrum',
 definition:'Plucking a string at a point gives harmonics whose strengths depend on where you pluck. Harmonics with a node at the plucking point are missing.',
 example:'Pluck exactly in the middle and every even harmonic vanishes, giving a soft, hollow tone; pluck near the bridge and many high harmonics appear, giving a bright, twangy tone.',
 desc:'The plucked string’s initial triangular shape above bars showing the strength of each harmonic, which follow sin(kπx)/k².',
 research:'Helmholtz (1863). On the Sensations of Tone. Thomas Young had noted the missing harmonics in 1800.',
 dur:10,hint:'Move the pluck point along the string and press Pluck to hear how the tone brightens near the end.',
 init:()=>({x:.2}),
 watch(p){return {x:lerp(.5,.08,smooth(p))}},
 ui:[{range:'x',label:'Pluck point',min:.05,max:.5,step:.01,get:s=>s.x,act:'x',show:v=>Math.round(v*100)+'% along'},{b:'Pluck ▶',act:'pluck'}],
 on:{x(s,v){s.x=v},pluck(s){M5_play(midiHz(52),{amps:M5_pluckAmps(s.x),dur:.02,env:{a:.003,d:1.6,s:0,r:.1}})}},
 draw(s,f,X){
  const a=M5_pluckAmps(s.x),x0=60,w=480;let out=heading(`Plucked ${Math.round(s.x*100)}% of the way along`);
  out+=L(x0,120,x0+w,120,C.grid,1)+Ci(x0,120,5,C.dark)+Ci(x0+w,120,5,C.dark)+P(`M${x0} 120L${fmt(x0+s.x*w)} 66L${x0+w} 120`,C.amber,3)+Ci(x0+s.x*w,66,6,C.coral)+TF(x0+s.x*w,56,'pluck',12,C.coral);
  out+=M5_bars(X,a,60,320,480,150,C.purple);
  const missing=a.map((v,k)=>v<.02?k+1:0).filter(Boolean);
  out+=TF(300,350,missing.length?`missing harmonics: ${missing.join(', ')}`:'all harmonics present',13,C.muted);
  return {svg:out,phase:missing.length&&missing[0]===2?'Plucked in the middle: every even harmonic is missing, because each has a node exactly where you plucked. The tone is soft and hollow.':`Plucking ${Math.round(s.x*100)}% along: the closer to the end, the more high harmonics, so the tone gets brighter and more metallic.`};
 }});
function M5_pluckAmps(x){const a=range(12).map(k=>Math.abs(Math.sin((k+1)*Math.PI*x))/((k+1)*(k+1)));return M5_norm(a).map(v=>v<1e-3?0:v)}

// Circular membrane: displacement J_m(j_mn r) cos(mθ). Zeros of J_m and their ratios to j01 = 2.405.
const M5_MODES=[{m:0,n:1,j:2.4048},{m:1,n:1,j:3.8317},{m:2,n:1,j:5.1356},{m:0,n:2,j:5.5201},{m:3,n:1,j:6.3802},{m:1,n:2,j:7.0156}];
function M5_besselJ(m,x){let s=0,term;for(let k=0;k<30;k++){term=Math.pow(-1,k)*Math.pow(x/2,2*k+m)/(M5_fact(k)*M5_fact(k+m));s+=term;if(Math.abs(term)<1e-12&&k>3)break}return s}
function M5_fact(n){let f=1;for(let i=2;i<=n;i++)f*=i;return f}
SCENE({id:'instrument-resonance-membrane',name:'Drum modes',tag:'Nodal circles and diameters',
 definition:'A circular drumhead vibrates in modes with nodal circles and nodal diameters that stay still. Their frequencies follow the zeros of Bessel functions, not whole-number ratios.',
 example:'The (1,1) mode, with one still diameter, rings about 1.59 times higher than the (0,1) mode, where the whole skin moves up and down together.',
 desc:'A top view of the drumhead coloured by displacement, with still lines drawn, beside the mode’s frequency ratio. A 3D view shows the surface moving.',
 research:'Rayleigh (1877). The Theory of Sound. · Rossing (1982). The physics of kettledrums. Scientific American 247.',
 dur:12,hint:'Choose a mode to see where the drumhead stays still, and press Strike to hear that mode against the lowest one.',
 init:()=>({mode:1}),
 watch(p){return {mode:Math.min(5,Math.floor(p*6)),t:p*24}},
 ui:[{choose:M5_MODES.map((q,i)=>[i,`(${q.m},${q.n})`]),label:'Mode',get:s=>s.mode,act:'mode'},{b:'Strike ▶',act:'strike'}],
 on:{mode(s,v){s.mode=Number(v)},strike(s){const q=M5_MODES[s.mode],f=midiHz(48);M5_play(f,{amps:[1],dur:.02,env:{a:.004,d:1.4,s:0,r:.1},gain:.12});M5_play(f*q.j/2.4048,{amps:[1],at:.7,dur:.02,env:{a:.004,d:1.4,s:0,r:.1},gain:.14})}},
 draw(s){
  const q=M5_MODES[s.mode],ph=Math.cos((s.t||0)*Math.PI),cx=180,cy=200,R0=130;let out=heading(`Mode (${q.m},${q.n}): ${fmt(q.j/2.4048)} × the lowest mode`);
  const NR=14,NT=36;
  for(let i=0;i<NR;i++)for(let k=0;k<NT;k++){const r0=i/NR,r1=(i+1)/NR,t0=k/NT*2*Math.PI,t1=(k+1)/NT*2*Math.PI,rm=(r0+r1)/2,tm=(t0+t1)/2;
   const z=M5_besselJ(q.m,q.j*rm)*Math.cos(q.m*tm)*ph,c=z>=0?`rgba(23,114,183,${fmt(Math.min(1,Math.abs(z)*1.6))})`:`rgba(196,82,56,${fmt(Math.min(1,Math.abs(z)*1.6))})`;
   const pt=(r,t)=>fmt(cx+R0*r*Math.cos(t))+','+fmt(cy+R0*r*Math.sin(t));
   out+=`<polygon points="${pt(r0,t0)} ${pt(r1,t0)} ${pt(r1,t1)} ${pt(r0,t1)}" fill="${c}" stroke="${c}" stroke-width=".6"/>`}
  out+=Ci(cx,cy,R0,'none',C.dark);
  // nodal circles (inner zeros) and nodal diameters
  const zeros={0:[2.4048,5.5201],1:[3.8317,7.0156],2:[5.1356],3:[6.3802]}[q.m]||[];
  zeros.filter(z=>z<q.j-1e-6).forEach(z=>out+=Ci(cx,cy,R0*z/q.j,'none',C.ink,'stroke-dasharray="5 4"'));
  for(let k=0;k<q.m;k++){const t=(k+.5)*Math.PI/q.m;out+=L(cx-R0*Math.cos(t),cy-R0*Math.sin(t),cx+R0*Math.cos(t),cy+R0*Math.sin(t),C.ink,1.5,'stroke-dasharray="5 4"')}
  out+=R(340,70,236,250,'#fff',C.grid,10)+TB(458,96,'Frequency ratios',14,C.ink);
  M5_MODES.forEach((m,i)=>{const y=124+i*30,on=i===s.mode;out+=R(352,y-18,212,26,on?C.amberp:'none','none',6)+TF(372,y,`(${m.m},${m.n})`,14,C.ink,'start')+TF(552,y,fmt(m.j/2.4048)+'×',14,on?C.amber:C.muted,'end',on?'font-weight="700"':'')});
  out+=TF(458,306,'dashed: lines that stay still',12,C.muted);
  return {svg:out,phase:`Mode (${q.m},${q.n}) has ${q.m} still diameter${q.m===1?'':'s'} and ${q.n-1} still circle${q.n===2?'':'s'} inside the rim. Its ratio, ${fmt(q.j/2.4048)}, is not a whole number, so a drum’s modes do not fuse into one clear pitch.`};
 },
 three(s,f,X,project){
  const q=M5_MODES[s.mode],ph=Math.cos((s.t||0)*Math.PI),NR=10,NT=28,Pr=project([[-1.1,-1.1,-.7],[1.1,1.1,.7]]),faces=[];
  const pt=(r,t)=>[r*Math.cos(t),r*Math.sin(t),.55*M5_besselJ(q.m,q.j*r)*Math.cos(q.m*t)*ph];
  for(let i=0;i<NR;i++)for(let k=0;k<NT;k++){const r0=i/NR,r1=(i+1)/NR,t0=k/NT*2*Math.PI,t1=(k+1)/NT*2*Math.PI,zm=M5_besselJ(q.m,q.j*(r0+r1)/2)*Math.cos(q.m*(t0+t1)/2)*ph;
   faces.push({pts:[pt(r0,t0),pt(r1,t0),pt(r1,t1),pt(r0,t1)],fill:zm>=0?C.blue:C.coral,opacity:.55+Math.min(.45,Math.abs(zm)),stroke:'#ffffff55'})}
  let out=paintFaces(faces,Pr);
  const ring=range(49).map(k=>{const t=k/48*2*Math.PI;return [Math.cos(t),Math.sin(t),0]});out+=P('M'+ring.map(v=>Pr(v).slice(0,2).map(fmt).join(' ')).join('L'),C.dark,2);
  return {svg:out,title:`Drum mode (${q.m},${q.n}) in 3D`,caption:`The drumhead in mode (${q.m},${q.n}): blue rises while coral falls, and the still lines separate them.`};
 }});

/* ===================== Lesson: the-ear ===================== */
// Greenwood (1990) place–frequency map for the human cochlea: f = 165.4 (10^(2.1 x) − 0.88), x = 0 at the apex.
const M5_greenX=f=>clamp(Math.log10(f/165.4+.88)/2.1,0,1);
SCENE({id:'the-ear',name:'The cochlea’s map',tag:'Each pitch has a place',
 definition:'Inside the cochlea the basilar membrane is stiff and narrow at the base and floppy and wide at the apex. Each frequency makes a travelling wave that peaks at its own place, so the ear sorts sound by frequency.',
 example:'High notes peak near the base, close to the middle ear; low notes travel almost to the apex. About two-thirds of the membrane is given to frequencies below about 4 kHz.',
 desc:'The uncoiled basilar membrane from base to apex, with a travelling wave peaking at the place for the chosen frequency and a frequency scale along it.',
 research:'von Békésy (1960). Experiments in Hearing (Nobel Prize 1961). · Greenwood (1990). A cochlear frequency-position function for several species. JASA 87.',
 dur:10,hint:'Slide the frequency and watch the peak move along the membrane. Press Play to hear the tone.',
 init:()=>({f:1000,ph:0}),
 watch(p){return {f:Math.round(Math.pow(10,lerp(Math.log10(8000),Math.log10(100),smooth(p)))),ph:p*40}},
 ui:[{range:'f',label:'Frequency',min:0,max:100,get:s=>Math.round(100*Math.log(s.f/50)/Math.log(16000/50)),act:'f',show:v=>fmt(Math.round(50*Math.pow(16000/50,v/100)))+' Hz'},{b:'Play ▶',act:'play'}],
 on:{f(s,v){s.f=Math.round(50*Math.pow(16000/50,v/100))},play(s){M5_play(s.f,{amps:[1],dur:.9,gain:.12})}},
 draw(s){
  const xb=60,xa=540,w=xa-xb,yc=170,peak=1-M5_greenX(s.f),ph=s.ph||0;let out=heading(`${fmt(s.f)} Hz peaks ${Math.round((1-peak)*100)}% of the way from apex to base`);
  // membrane drawn base (left) to apex (right), widening
  out+=P(`M${xb} ${yc-10}L${xa} ${yc-34}L${xa} ${yc+34}L${xb} ${yc+10}Z`,C.line,1.5,'#f6f0ea');
  const N=240;let up='',dn='',wave='';
  for(let i=0;i<=N;i++){const b=i/N,x=xb+b*w,env=b<peak?Math.exp(-Math.pow((peak-b)/.22,2)):Math.exp(-Math.pow((b-peak)/.045,2));const half=10+24*b,k=60/(.08+b*.9);
   up+=(i?'L':'M')+fmt(x)+' '+fmt(yc-env*half);dn+=(i?'L':'M')+fmt(x)+' '+fmt(yc+env*half);wave+=(i?'L':'M')+fmt(x)+' '+fmt(yc-env*half*Math.sin(b*k-ph))}
  out+=P(up,C.coral,1.4,'none','stroke-dasharray="4 3"')+P(dn,C.coral,1.4,'none','stroke-dasharray="4 3"')+P(wave,C.blue,2.4);
  out+=TB(xb,yc-50,'base',14,C.ink,'start')+TF(xb,yc-34,'stiff, narrow',12,C.muted,'start')+TB(xa,yc-56,'apex',14,C.ink,'end')+TF(xa,yc-40,'floppy, wide',12,C.muted,'end');
  // frequency scale along the membrane (Greenwood)
  out+=L(xb,262,xa,262,C.line,1.5);
  for(const f of [20000,8000,4000,2000,1000,500,200,50]){const x=xb+(1-M5_greenX(f))*w;out+=L(x,256,x,268,C.line,1.5)+TF(x,286,f>=1000?f/1000+'k':f,13,C.muted)}
  const xp=xb+peak*w;out+=`<polygon points="${fmt(xp)},250 ${fmt(xp-7)},238 ${fmt(xp+7)},238" fill="${C.coral}"/>`;
  out+=T(300,316,'Frequency (Hz) for each place, from Greenwood’s map',14,C.muted);
  out+=TF(300,350,'Sketch, not to scale: the real membrane is about 35 mm long and coiled 2¾ turns.',12,C.muted);
  return {svg:out,phase:`The wave grows as it travels from the base, peaks where the membrane’s stiffness matches ${fmt(s.f)} Hz, then dies quickly. Hair cells at that place fire most, telling the brain which frequency arrived.`};
 }});

const M5_EAR_STEPS=[
 {k:'air',t:'Sound in the air',say:'A sound is a small, fast change in air pressure arriving at the ear.'},
 {k:'pinna',t:'Outer ear',say:'The outer ear and canal funnel the sound in. The canal resonates near 3 kHz, boosting those frequencies by roughly 10 dB.'},
 {k:'drum',t:'Eardrum',say:'The eardrum turns pressure changes into tiny vibrations, smaller than the width of an atom for quiet sounds.'},
 {k:'ossicles',t:'Middle-ear bones',say:'Three tiny bones act as a lever and a funnel: the eardrum’s area is about 17 times the stirrup’s footplate, giving roughly 20 to 25 times more pressure (approximate).'},
 {k:'cochlea',t:'Cochlea',say:'The stirrup pushes the oval window, sending waves through the fluid of the cochlea along the basilar membrane.'},
 {k:'hair',t:'Hair cells',say:'Inner hair cells bend where the membrane moves most and fire the auditory nerve; outer hair cells actively sharpen the tuning.'},
 {k:'nerve',t:'Auditory nerve',say:'About 30 000 nerve fibres carry place and timing information to the brainstem and on to the auditory cortex.'}];
SCENE({id:'the-ear-path',name:'From air to nerve',tag:'Outer, middle and inner ear',
 definition:'Hearing passes sound through three stages: the outer ear collects it, the middle ear’s three bones match the air to the fluid of the inner ear, and the cochlea turns vibration into nerve signals.',
 example:'Without the middle-ear bones, most of the sound energy would bounce off the fluid-filled cochlea, much as voices above a swimming pool are hard to hear underwater.',
 desc:'A chain of seven stages from sound in the air to the auditory nerve, with the current stage highlighted and a note on what it does.',
 research:'von Békésy (1960). Experiments in Hearing. · Pickles (2012). An Introduction to the Physiology of Hearing, 4th ed.',
 dur:12,hint:'Step through the stages from the air to the nerve.',
 init:()=>({}),
 trace(){return M5_EAR_STEPS.map((q,i)=>({...q,i}))},
 draw(s,f){
  let out=heading('The path of a sound');const n=M5_EAR_STEPS.length,w=78;
  M5_EAR_STEPS.forEach((q,i)=>{const x=30+i*w,on=i===f.i,past=i<f.i;out+=R(x,70,w-10,74,on?C.blue:past?C.pale:'#fff',on?C.blue:C.line,10)+TF(x+(w-10)/2,104,q.t.split(' ')[0],12.5,on?'#fff':C.ink,'middle','font-weight="650"')+TF(x+(w-10)/2,122,q.t.split(' ').slice(1).join(' '),12,on?'#fff':C.muted);if(i<n-1)out+=arrow(x+w-10,107,x+w,107,C.line,2,6)});
  // small schematic for the current stage
  const cx=300,cy=240;let pic='';
  if(f.k==='air'){for(let i=0;i<6;i++)pic+=P(`M${cx-120+i*40} ${cy-40}Q${cx-100+i*40} ${cy} ${cx-120+i*40} ${cy+40}`,C.blue,2)}
  else if(f.k==='pinna')pic+=P(`M${cx-90} ${cy-60}Q${cx-150} ${cy} ${cx-90} ${cy+60}Q${cx-60} ${cy+20} ${cx-40} ${cy}`,C.amber,6)+R(cx-40,cy-12,160,24,C.amberp,C.amber,10)+TF(cx+40,cy+44,'canal ≈ 2.5 cm',13,C.muted);
  else if(f.k==='drum')pic+=`<ellipse cx="${cx}" cy="${cy}" rx="22" ry="60" fill="${C.pale}" stroke="${C.blue}" stroke-width="3"/>`+TF(cx,cy+84,'eardrum',13,C.muted);
  else if(f.k==='ossicles')pic+=Ci(cx-60,cy,22,C.amberp,C.amber)+Ci(cx,cy,18,C.amberp,C.amber)+R(cx+40,cy-20,40,40,C.amberp,C.amber,6)+L(cx-38,cy,cx-18,cy,C.amber,4)+L(cx+18,cy,cx+40,cy,C.amber,4)+TF(cx-60,cy+44,'hammer',12,C.muted)+TF(cx,cy+44,'anvil',12,C.muted)+TF(cx+60,cy+44,'stirrup',12,C.muted);
  else if(f.k==='cochlea'){let d='';for(let i=0;i<=200;i++){const t=i/200*2.75*2*Math.PI,r=70*(1-i/240);d+=(i?'L':'M')+fmt(cx+r*Math.cos(t))+' '+fmt(cy+r*Math.sin(t)*.8)}pic+=P(d,C.purple,4)}
  else if(f.k==='hair'){for(let i=0;i<5;i++){const x=cx-80+i*40;pic+=R(x-10,cy,20,40,C.greenp,C.green,6)+P(`M${x-6} ${cy}L${x-10} ${cy-26}M${x} ${cy}L${x} ${cy-30}M${x+6} ${cy}L${x+10} ${cy-26}`,C.green,2)}pic+=L(cx-120,cy-34,cx+120,cy-34,C.line,3)+TF(cx,cy-44,'membrane above the hair bundles',12,C.muted)}
  else{for(let i=0;i<5;i++)pic+=P(`M${cx-130} ${cy-30+i*15}C${cx-40} ${cy-50+i*20} ${cx+40} ${cy-10+i*8} ${cx+130} ${cy-20+i*10}`,C.green,2);pic+=TF(cx,cy+64,'to the brainstem and auditory cortex',13,C.muted)}
  out+=R(70,164,460,170,'#fff',C.grid,12)+pic;
  return {svg:out,phase:f.say};
 }});

// Equivalent rectangular bandwidth and ERB-number scale (Glasberg & Moore 1990).
const M5_erb=f=>24.7*(4.37*f/1000+1),M5_cam=f=>21.4*Math.log10(4.37*f/1000+1);
SCENE({id:'the-ear-critical-bands',name:'Critical bands',tag:'Close tones share a place',
 definition:'Each place on the basilar membrane responds to a band of frequencies, a critical band. Two tones inside one band disturb the same place: they beat, sound rough or mask each other. Further apart, they are heard as two clean tones.',
 example:'Around 1000 Hz the auditory filter is about 130 Hz wide measured as an equivalent rectangular bandwidth (ERB); the older critical-bandwidth measure gives about 160 Hz. The two are related but distinct ways of sizing the same filter. A 1000 Hz and a 1040 Hz tone sound rough together; 1000 and 1500 Hz sound smooth.',
 desc:'Two excitation bumps on a scale of critical-band numbers, with the band around the first tone shaded and a verdict on how they sound together.',
 research:'Fletcher (1940). Auditory patterns. Reviews of Modern Physics 12. · Glasberg & Moore (1990). Derivation of auditory filter shapes from notched-noise data. Hearing Research 47.',
 dur:10,hint:'Slide the second tone away from the first and press Play both to hear beating turn into roughness and then into two clean tones.',
 init:()=>({f1:1000,df:40}),
 watch(p){return {f1:1000,df:Math.round(lerp(4,500,Math.pow(p,1.6)))}},
 ui:[{range:'df',label:'Second tone',min:1,max:600,get:s=>s.df,act:'df',show:v=>'+'+v+' Hz'},{b:'Play both ▶',act:'play'}],
 on:{df(s,v){s.df=v},play(s){AUDIO.chord([s.f1,s.f1+s.df],{dur:1.6,gain:.16})}},
 draw(s){
  const f2=s.f1+s.df,c1=M5_cam(s.f1),c2=M5_cam(f2),lo=c1-4,hi=c1+6,x0=50,w=500,base=260,cx=c=>x0+(c-lo)/(hi-lo)*w,dc=c2-c1;let out=heading(`${s.f1} Hz and ${f2} Hz: ${fmt(dc)} critical bands apart`);
  out+=R(cx(c1-.5),80,cx(c1+.5)-cx(c1-.5),base-80,C.amberp,'none',4)+TF(cx(c1),96,'one critical band',12,C.amber);
  for(const [c,col] of [[c1,C.blue],[c2,C.coral]]){let d='';for(let i=0;i<=160;i++){const z=lo+i/160*(hi-lo),v=Math.exp(-Math.pow((z-c)/.55,2));d+=(i?'L':'M')+fmt(cx(z))+' '+fmt(base-v*140)}out+=P(d,col,2.6)}
  out+=L(x0,base,x0+w,base,C.line,1.5);
  for(let z=Math.ceil(lo);z<=hi;z++){const x=cx(z);out+=L(x,base,x,base+6,C.line,1.2)}
  for(const f of [600,800,1000,1200,1500,2000]){const z=M5_cam(f);if(z>lo&&z<hi)out+=TF(cx(z),base+22,f+' Hz',12,C.muted)}
  const verdict=s.df<15?'Beating: one tone that pulses '+s.df+' times a second':dc<1?'Rough: the two excitations overlap':'Smooth: two separate tones';
  out+=R(140,296,320,44,dc<1?C.coralp:C.greenp,'none',10)+TB(300,324,verdict,15,dc<1?C.coral:C.green);
  return {svg:out,phase:`One ERB at ${s.f1} Hz is about ${Math.round(M5_erb(s.f1))} Hz. The tones are ${s.df} Hz apart, ${fmt(dc)} ERB numbers. Overlapping excitation is heard as beats or roughness; once they separate by about one band, the roughness fades.`};
 }});

/* ===================== Lesson: loudness ===================== */
// ISO 226:2003 equal-loudness contours: parameters at 29 frequencies, and Lp for a loudness level Ln (phon).
const M5_ISO={f:[20,25,31.5,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500],
 af:[.532,.506,.480,.455,.432,.409,.387,.367,.349,.330,.315,.301,.288,.276,.267,.259,.253,.250,.246,.244,.243,.243,.243,.242,.242,.245,.254,.271,.301],
 Lu:[-31.6,-27.2,-23.0,-19.1,-15.9,-13.0,-10.3,-8.1,-6.2,-4.5,-3.1,-2.0,-1.1,-.4,0,.3,.5,0,-2.7,-4.1,-1.0,1.7,2.5,1.2,-2.1,-7.1,-11.2,-10.7,-3.1],
 Tf:[78.5,68.7,59.5,51.1,44.0,37.5,31.5,26.5,22.1,17.9,14.4,11.4,8.6,6.2,4.4,3.0,2.2,2.4,3.5,1.7,-1.3,-4.2,-6.0,-5.4,-1.5,6.0,12.6,13.9,12.3]};
function M5_isoLp(i,Ln){const af=M5_ISO.af[i],Lu=M5_ISO.Lu[i],Tf=M5_ISO.Tf[i];const Af=4.47e-3*(Math.pow(10,.025*Ln)-1.15)+Math.pow(.4*Math.pow(10,(Tf+Lu)/10-9),af);return 10/af*Math.log10(Af)-Lu+94}
const M5_logF=(f,x0,w)=>x0+w*Math.log(f/20)/Math.log(12500/20);
SCENE({id:'loudness',name:'Equal loudness',tag:'The ear is not flat',
 definition:'Loudness is how strong a sound seems, not how much pressure it has. Equal-loudness contours show the sound level each frequency needs to seem as loud as a 1000 Hz tone; the unit of loudness level is the phon.',
 example:'To sound as loud as a 1000 Hz tone at 40 dB, a 100 Hz tone needs about 64 dB (ISO 226:2003). That is why quiet music sounds thin in the bass.',
 desc:'Equal-loudness contours from the ISO 226:2003 standard on a logarithmic frequency axis, with the chosen contour highlighted and the hearing threshold dotted.',
 research:'Fletcher & Munson (1933). Loudness, its definition, measurement and calculation. JASA 5. · ISO 226:2003, revised from new measurements (Suzuki & Takeshima 2004).',
 dur:10,hint:'Choose a loudness level and a frequency to read the sound level needed. Press Compare to hear 1000 Hz, then your frequency adjusted by the contour (exact levels depend on your speakers).',
 init:()=>({phon:40,fi:7}),
 watch(p){return {phon:20+10*Math.min(6,Math.floor(p*7)),fi:7}},
 ui:[{range:'phon',label:'Loudness level',min:20,max:90,step:10,get:s=>s.phon,act:'phon',show:v=>v+' phon'},{range:'fi',label:'Frequency',min:0,max:28,get:s=>s.fi,act:'fi',show:v=>M5_ISO.f[v]+' Hz'},{b:'Compare ▶',act:'play'}],
 on:{phon(s,v){s.phon=v},fi(s,v){s.fi=v},play(s){const d=M5_isoLp(s.fi,s.phon)-M5_isoLp(17,s.phon),g=clamp(.12*Math.pow(10,d/20),.005,.3);M5_play(1000,{amps:[1],dur:.7,gain:.12});M5_play(M5_ISO.f[s.fi],{amps:[1],dur:.7,gain:g,at:.95})}},
 draw(s){
  const x0=70,w=480,y0=330,h=270,yd=db=>y0-(db+10)/140*h;let out=heading(`${s.phon} phon: as loud as 1000 Hz at ${s.phon} dB`);
  out+=L(x0,y0,x0+w,y0,C.line,1.5)+L(x0,y0-h,x0,y0,C.line,1.5);
  for(const db of [0,20,40,60,80,100,120]){const y=yd(db);out+=L(x0,y,x0+w,y,C.grid,1)+TF(x0-8,y+4,db,12,C.muted,'end')}
  for(const f of [20,50,100,200,500,1000,2000,5000,10000]){const x=M5_logF(f,x0,w);out+=TF(x,y0+18,f>=1000?f/1000+'k':f,12,C.muted)}
  out+=TF(x0-36,y0-h-8,'dB SPL',12,C.muted,'start')+TF(x0+w,y0+34,'Hz',12,C.muted,'end');
  out+=P('M'+M5_ISO.f.map((f,i)=>fmt(M5_logF(f,x0,w))+' '+fmt(yd(M5_ISO.Tf[i]))).join('L'),C.muted,1.5,'none','stroke-dasharray="3 4"');
  for(let L0=20;L0<=90;L0+=10){const on=L0===s.phon;out+=P('M'+M5_ISO.f.map((f,i)=>fmt(M5_logF(f,x0,w))+' '+fmt(yd(M5_isoLp(i,L0)))).join('L'),on?C.purple:'#cfc6e3',on?3:1.4)}
  const fx=M5_logF(M5_ISO.f[s.fi],x0,w),lp=M5_isoLp(s.fi,s.phon),fy=yd(lp);
  out+=Ci(fx,fy,7,C.coral,'#fff')+R(fx>380?fx-150:fx+12,fy-30,140,26,'#fff',C.coral,6)+TF(fx>380?fx-80:fx+82,fy-12,`${M5_ISO.f[s.fi]} Hz needs ${Math.round(lp)} dB`,12,C.coral);
  return {svg:out,phase:`At ${s.phon} phon a ${M5_ISO.f[s.fi]} Hz tone needs ${Math.round(lp)} dB to match 1000 Hz at ${s.phon} dB. The ear is most sensitive around 3 to 4 kHz and much less sensitive in the deep bass, especially at quiet levels.`};
 }});

SCENE({id:'loudness-sones',name:'Decibels and sones',tag:'Twice as loud is not twice the power',
 definition:'Perceived loudness grows much more slowly than sound power. Roughly, every 10 dB increase sounds about twice as loud; the sone scale counts that perceived loudness.',
 example:'One violin and ten identical violins differ by 10 dB, so ten violins sound only about twice as loud as one.',
 desc:'A bar for perceived loudness in sones beside a bar for sound power, as the loudness level rises.',
 research:'Stevens (1955). The measurement of loudness. JASA 27. · Stevens (1957). On the psychophysical law. Psychological Review 64.',
 dur:10,hint:'Change the number of identical instruments and press Play to hear one, then all of them together.',
 init:()=>({n:10}),
 watch(p){return {n:Math.round(Math.pow(100,p))}},
 ui:[{range:'n',label:'Instruments',min:1,max:100,get:s=>s.n,act:'n'},{b:'Play 1, then all ▶',act:'play'}],
 on:{n(s,v){s.n=v},play(s){const g=.05;M5_play(440,{amps:M5_INST.violin.amps,dur:.8,gain:g});M5_play(440,{amps:M5_INST.violin.amps,dur:.8,gain:Math.min(.3,g*Math.sqrt(s.n)),at:1.1})}},
 draw(s){
  const dB=10*Math.log10(s.n),sone=Math.pow(2,dB/10);let out=heading(`${s.n} instrument${s.n===1?'':'s'}: +${fmt(dB)} dB, about ${fmt(sone)}× as loud`);
  const bar=(x,label,val,max,col,txt)=>R(x,90,110,220,'#f6f9fb','none',8)+R(x,310-220*Math.min(1,val/max),110,220*Math.min(1,val/max),col,'none',8)+TB(x+55,334,label,14,C.ink)+TF(x+55,352,txt,12,C.muted);
  out+=bar(120,'Sound power',s.n,100,C.blue,`${s.n}× one instrument`)+bar(370,'Perceived loudness',sone,4.0,C.purple,`≈ ${fmt(sone)}× (sones)`);
  out+=T(300,70,'Rule of thumb: +10 dB sounds about twice as loud',14,C.muted);
  return {svg:out,phase:`Power multiplies by ${s.n}, which is ${fmt(dB)} dB; loudness grows by only about ${fmt(sone)}×. This compression lets the ear handle a range of power over a trillion to one.`};
 }});

// Bark scale (Zwicker & Terhardt 1980) and an illustrative masking pattern with stronger upward spread.
const M5_bark=f=>13*Math.atan(.00076*f)+3.5*Math.atan(Math.pow(f/7500,2));
SCENE({id:'loudness-masking',name:'Masking',tag:'A loud sound hides a quiet one',
 definition:'A loud sound raises the threshold for nearby frequencies, so quieter sounds close to it can become inaudible. Masking spreads further towards higher frequencies than lower ones.',
 example:'A loud bass note can hide a soft note just above it, but a loud high note hides much less of the bass. Audio formats such as MP3 save space by dropping sounds that would be masked.',
 desc:'A loud masker’s raised threshold drawn as a tent on a critical-band scale, with a quieter probe tone that is either above or under it.',
 research:'Wegel & Lane (1924). The auditory masking of one pure tone by another. Physical Review 23. · Zwicker & Fastl (1990). Psychoacoustics. Slopes here are illustrative.',
 dur:10,hint:'Move the probe tone’s frequency and level, then press Play to hear masker and probe together.',
 init:()=>({pf:1400,pl:40}),
 watch(p){return {pf:Math.round(lerp(500,3000,p)),pl:40}},
 ui:[{range:'pf',label:'Probe',min:300,max:4000,step:50,get:s=>s.pf,act:'pf',show:v=>v+' Hz'},{range:'pl',label:'Probe level',min:10,max:70,get:s=>s.pl,act:'pl',show:v=>v+' dB'},{b:'Play ▶',act:'play'}],
 on:{pf(s,v){s.pf=v},pl(s,v){s.pl=v},play(s){M5_play(1000,{amps:[1],dur:1.4,gain:.16});M5_play(s.pf,{amps:[1],dur:.6,gain:.16*Math.pow(10,(s.pl-70)/20),at:.4})}},
 draw(s){
  const mz=M5_bark(1000),ML=70,thr=z=>Math.max(0,z<mz?ML-12-27*(mz-z):ML-12-12*(z-mz)),x0=60,w=480,y0=300,h=220,zx=z=>x0+(z-2)/(20-2)*w,yd=db=>y0-db/90*h;
  const pz=M5_bark(s.pf),heard=s.pl>thr(pz);let out=heading(heard?'The probe is above the masked threshold: audible':'The probe is under the masker’s tent: hidden');
  out+=L(x0,y0,x0+w,y0,C.line,1.5);
  let d='';for(let i=0;i<=160;i++){const z=2+i/160*18;d+=(i?'L':'M')+fmt(zx(z))+' '+fmt(yd(thr(z)))}
  out+=P(d+`L${zx(20)} ${y0}L${zx(2)} ${y0}Z`,'none',0,'#efe9f7')+P(d,C.purple,2.4);
  out+=L(zx(mz),y0,zx(mz),yd(ML),C.blue,7)+TF(zx(mz),yd(ML)-8,'masker 1000 Hz, 70 dB',12,C.blue);
  out+=L(zx(pz),y0,zx(pz),yd(s.pl),heard?C.green:C.coral,7)+TF(zx(pz),yd(s.pl)-8,`probe ${s.pf} Hz`,12,heard?C.green:C.coral);
  for(const f of [300,500,1000,2000,4000,8000]){const x=zx(M5_bark(f));if(x>=x0&&x<=x0+w)out+=TF(x,y0+18,f>=1000?f/1000+'k':f,12,C.muted)}
  out+=TF(300,346,'Masked threshold slopes are illustrative: steep below the masker, shallow above',12,C.muted);
  return {svg:out,phase:`Masking spreads upward: the tent falls slowly above 1000 Hz and steeply below. A probe at ${s.pf} Hz needs more than ${fmt(thr(pz))} dB to be heard here; at ${s.pl} dB it is ${heard?'audible':'hidden'}.`};
 }});

/* ===================== Lesson: voice-formants ===================== */
// Source–filter model: glottal source harmonics (≈ −12 dB/octave) shaped by vocal-tract resonances F1, F2, F3.
function M5_formantGain(f,F){return F.reduce((g,[Fc,B])=>g/Math.sqrt(Math.pow(1-(f*f)/(Fc*Fc),2)+Math.pow(f*B/(Fc*Fc),2)),1)}
function M5_voice(f0,F1,F2,singer=false){const F=[[F1,80],[F2,100],[2500,120]];if(singer)F.push([2800,150],[3100,170]);const n=Math.min(48,Math.floor(4500/f0));
 return M5_norm(range(n).map(k=>{const f=f0*(k+1);return M5_formantGain(f,F)/Math.pow(k+1,2)}))}
SCENE({id:'voice-formants',name:'Source and filter',tag:'How the voice makes vowels',
 definition:'The voice is a source and a filter. The vocal folds buzz, producing many harmonics; the throat and mouth act as a filter whose resonances, called formants, strengthen some harmonics and weaken others.',
 example:'Sing “ee” and then “ah” on the same pitch: the buzz is the same, but moving your tongue and jaw shifts the formants, and the vowel changes.',
 desc:'Three panels: the vocal folds’ harmonic source, the vocal tract’s filter curve with peaks at F1 and F2, and the resulting output spectrum.',
 research:'Fant (1960). Acoustic Theory of Speech Production. · Chiba & Kajiyama (1941). The Vowel: Its Nature and Structure.',
 dur:11,hint:'Change the pitch and the two formants, then press Play to hear the vowel.',
 init:()=>({f0:130,F1:730,F2:1090}),
 watch(p){const u=smooth(p);return {f0:130,F1:Math.round(lerp(730,270,u)),F2:Math.round(lerp(1090,2290,u))}},
 ui:[{range:'f0',label:'Pitch',min:80,max:300,step:5,get:s=>s.f0,act:'f0',show:v=>v+' Hz'},{range:'F1',label:'F1',min:250,max:900,step:10,get:s=>s.F1,act:'F1',show:v=>v+' Hz'},{range:'F2',label:'F2',min:700,max:2500,step:10,get:s=>s.F2,act:'F2',show:v=>v+' Hz'},{b:'Play ▶',act:'play'}],
 on:{f0(s,v){s.f0=v},F1(s,v){s.F1=v},F2(s,v){s.F2=v},play(s){M5_play(s.f0,{amps:M5_voice(s.f0,s.F1,s.F2),dur:1.1,env:{a:.06,d:.05,s:.9,r:.15},gain:.18})}},
 draw(s){
  const x0=60,w=480,fx=f=>x0+f/4000*w,F=[[s.F1,80],[s.F2,100],[2500,120]],src=M5_norm(range(Math.floor(4000/s.f0)).map(k=>1/Math.pow(k+1,2)));let out=heading(`Pitch ${s.f0} Hz · F1 ${s.F1} Hz · F2 ${s.F2} Hz`);
  const panel=(y,title)=>L(x0,y,x0+w,y,C.line,1.2)+TB(x0,y-68,title,13,C.ink,'start');
  out+=panel(130,'1 · Source: the vocal folds’ buzz');src.forEach((a,k)=>{const x=fx(s.f0*(k+1));out+=L(x,130,x,130-a*62,C.blue,2.2)});
  out+=panel(230,'2 · Filter: the vocal tract');let d='';const g0=Math.max(...range(200).map(i=>M5_formantGain(i*20+20,F)));for(let i=0;i<=200;i++){const f=i*20+1,g=M5_formantGain(f,F)/g0;d+=(i?'L':'M')+fmt(fx(f))+' '+fmt(230-Math.min(1,g)*62)}out+=P(d,C.amber,2.4);
  out+=TF(fx(s.F1),241,'F1',12,C.amber)+TF(fx(s.F2),241,'F2',12,C.amber);
  out+=panel(330,'3 · Output: what we hear');M5_voice(s.f0,s.F1,s.F2).forEach((a,k)=>{const f=s.f0*(k+1);if(f<4000){const x=fx(f);out+=L(x,330,x,330-a*62,C.purple,2.2)}});
  for(const f of [0,1000,2000,3000,4000])out+=TF(fx(f),348,f?f/1000+' kHz':'0',12,C.muted);
  return {svg:out,phase:`The same buzz passes through a filter with peaks at ${s.F1} and ${s.F2} Hz. Harmonics near those peaks come out strong. Low F1 with high F2 sounds like “ee”; high F1 with low F2 sounds like “ah”.`};
 }});

// Peterson & Barney (1952): average formants of American English vowels, adult male speakers.
const M5_VOWELS=[['i','heed',270,2290],['ɪ','hid',390,1990],['ɛ','head',530,1840],['æ','had',660,1720],['ɑ','hod',730,1090],['ɔ','hawed',570,840],['ʊ','hood',440,1020],['u','who’d',300,870],['ʌ','hud',640,1190],['ɝ','heard',490,1350]];
SCENE({id:'voice-formants-vowels',name:'The vowel chart',tag:'Two numbers describe a vowel',
 definition:'Each vowel has a typical pair of first and second formants. Plotting F1 against F2 lays the vowels out much like the shape of the mouth: tongue height follows F1 and tongue frontness follows F2.',
 example:'“Heed” has F1 near 270 Hz and F2 near 2290 Hz; “hod” has F1 near 730 and F2 near 1090, in Peterson and Barney’s averages for men.',
 desc:'Vowels placed by their average first and second formants, with F2 running right to left and F1 increasing downwards, as in phoneticians’ charts.',
 research:'Peterson & Barney (1952). Control methods used in a study of the vowels. JASA 24. (Averages for adult male speakers of American English.)',
 dur:11,hint:'Press a vowel to hear a synthetic version, or set F1 and F2 to explore the space between them.',
 init:()=>({F1:730,F2:1090,sel:4}),
 watch(p){const v=M5_VOWELS[Math.min(9,Math.floor(p*10))];return {F1:v[2],F2:v[3],sel:Math.min(9,Math.floor(p*10))}},
 ui:[{range:'F1',label:'F1',min:250,max:800,step:10,get:s=>s.F1,act:'F1',show:v=>v+' Hz'},{range:'F2',label:'F2',min:800,max:2400,step:10,get:s=>s.F2,act:'F2',show:v=>v+' Hz'},{b:'Play ▶',act:'play'}],
 on:{F1(s,v){s.F1=v;s.sel=-1},F2(s,v){s.F2=v;s.sel=-1},play(s){M5_play(120,{amps:M5_voice(120,s.F1,s.F2),dur:.9,env:{a:.05,d:.05,s:.9,r:.15},gain:.18})},
  vowel(s,i){i=Number(i);const v=M5_VOWELS[i];s.F1=v[2];s.F2=v[3];s.sel=i;M5_play(120,{amps:M5_voice(120,v[2],v[3]),dur:.9,env:{a:.05,d:.05,s:.9,r:.15},gain:.18})}},
 draw(s,f,X){
  const x0=70,w=470,y0=60,h=260,px=F2=>x0+(2500-F2)/(2500-750)*w,py=F1=>y0+(F1-220)/(800-220)*h;let out=heading('Vowels by their first two formants');
  out+=R(x0,y0,w,h,'#fff',C.grid,8);
  for(const f2 of [2400,2000,1600,1200,800])out+=TF(px(f2),y0+h+18,f2,12,C.muted);
  for(const f1 of [300,400,500,600,700,800])out+=TF(x0-8,py(f1)+4,f1,12,C.muted,'end');
  out+=TF(x0+w/2,y0+h+36,'F2 (Hz) ← front of mouth · back of mouth →',12,C.muted)+TF(x0-46,y0-10,'F1 (Hz)',12,C.muted,'start');
  M5_VOWELS.forEach((v,i)=>{const x=px(v[3]),y=py(v[2]),on=i===s.sel;out+=hit(X,'vowel',i,`Vowel ${v[0]} as in ${v[1]}`,Ci(x,y,on?20:16,on?C.purple:'#fff',C.purple)+T(x,y+6,v[0],17,on?'#fff':C.purple,'middle','font-weight="700"'))+TF(x,y+(i===9?-24:32),v[1],12,C.muted)});
  if(s.sel<0)out+=Ci(px(s.F2),py(s.F1),8,C.coral,'#fff');
  return {svg:out,phase:s.sel>=0?`/${M5_VOWELS[s.sel][0]}/ as in “${M5_VOWELS[s.sel][1]}”: F1 ≈ ${M5_VOWELS[s.sel][2]} Hz, F2 ≈ ${M5_VOWELS[s.sel][3]} Hz. A raised tongue lowers F1; a forward tongue raises F2.`:`F1 ${s.F1} Hz and F2 ${s.F2} Hz sit between the averages. Real speakers vary widely, and women’s and children’s formants are higher.`};
 }});

SCENE({id:'voice-formants-singer',name:'The singer’s formant',tag:'How opera voices cut through',
 definition:'Trained classical singers cluster their third, fourth and fifth formants around 2.5 to 3 kHz. This “singer’s formant” makes the voice stand out where an orchestra is relatively quiet.',
 example:'An orchestra’s average spectrum is strongest around 450 Hz and falls above it; a tenor’s singer’s formant puts extra energy near 3 kHz, so he can be heard without a microphone.',
 desc:'An orchestra’s average spectrum and a voice spectrum with or without the singer’s formant, showing where the voice rises above the orchestra.',
 research:'Sundberg (1974). Articulatory interpretation of the “singing formant”. JASA 55. · Sundberg (1987). The Science of the Singing Voice. Curves here are illustrative.',
 dur:10,hint:'Switch the singer’s formant on and off and press Play to compare the two voices.',
 init:()=>({on:true}),
 watch(p){return {on:p>.5}},
 ui:[{choose:[['true','Singer’s formant on'],['false','Off (speech-like)']],label:'Voice',get:s=>String(s.on),act:'on'},{b:'Play ▶',act:'play'}],
 on:{on(s,v){s.on=v==='true'},play(s){M5_play(196,{amps:M5_voice(196,600,1000,s.on),dur:1.2,env:{a:.06,d:.05,s:.9,r:.15},gain:.18})}},
 draw(s){
  const x0=60,w=480,y0=300,fx=f=>x0+w*Math.log(f/100)/Math.log(5000/100),yd=db=>y0-(db+50)/55*220;let out=heading(s.on?'With the singer’s formant the voice rises above the orchestra near 3 kHz':'Without it the orchestra covers the voice everywhere');
  out+=L(x0,y0,x0+w,y0,C.line,1.5);
  const orch=f=>-6-14*Math.max(0,Math.log2(f/450))-6*Math.max(0,Math.log2(450/f));
  const voice=f=>{let g=-14-12*Math.max(0,Math.log2(f/400))-4*Math.max(0,Math.log2(400/f));if(s.on)g+=22*Math.exp(-Math.pow(Math.log2(f/2900)/.28,2));return g};
  let po='',pv='';for(let i=0;i<=160;i++){const f=100*Math.pow(50,i/160);po+=(i?'L':'M')+fmt(fx(f))+' '+fmt(yd(orch(f)));pv+=(i?'L':'M')+fmt(fx(f))+' '+fmt(yd(voice(f)))}
  if(s.on)out+=R(fx(2300),70,fx(3600)-fx(2300),y0-70,C.amberp,'none',6)+TF(fx(2900),86,'2.5–3.5 kHz',12,C.amber);
  out+=P(po,C.blue,3)+P(pv,C.coral,3)+TB(fx(180),yd(orch(180))-12,'orchestra',13,C.blue)+TB(fx(900),yd(voice(900))+24,'voice',13,C.coral);
  for(const f of [100,200,500,1000,2000,5000])out+=TF(fx(f),y0+18,f>=1000?f/1000+' kHz':f+' Hz',12,C.muted);
  out+=TF(300,352,'Average spectra, illustrative levels',12,C.muted);
  return {svg:out,phase:s.on?'Clustering three formants near 2.9 kHz gives the voice a ringing band where the orchestra is about 15 to 20 dB weaker, so the singer is heard over it.':'Without the cluster, the voice’s energy falls off like the orchestra’s, and in every band the orchestra is louder.'};
 }});
