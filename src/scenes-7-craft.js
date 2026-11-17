/* ===================== Techno era 7 · DJ craft and arrangement ===================== */
// Sound is scheduled only from on() handlers. Loops tick once per step with ctx.every; the tick moves a playhead
// held in the state and sounds that step. Watch derives every picture from lesson time and stays silent.
// All voices are simplified models of drum machines and synths, not circuit emulations.
const X7_now=()=>performance.now()/1000;
const X7_V={
 kick:(at=0,g=.26)=>AUDIO.kick({at,from:170,to:50,decay:.28,gain:g}),
 kickB:(at=0,g=.2)=>AUDIO.kick({at,from:230,to:75,decay:.16,gain:g}),
 hat:(at=0,g=.055)=>AUDIO.hit({at,dur:.04,gain:g,cutoff:8000}),
 ohat:(at=0,g=.05)=>AUDIO.hit({at,dur:.2,gain:g,cutoff:7000}),
 clap:(at=0,g=.11)=>AUDIO.hit({at,type:'bandpass',cutoff:1500,q:1.2,dur:.12,gain:g}),
 crash:(at=0)=>AUDIO.hit({at,dur:.7,gain:.07,cutoff:5000}),
 bass:(hz,at=0,g=.13)=>AUDIO.acid(hz,{at,dur:.17,cutoff:260,env:420,res:4,gain:g,decay:.12}),
 lead:(hz,at=0,cut=900)=>AUDIO.acid(hz,{at,dur:.12,cutoff:cut,env:cut*1.2,res:10,gain:.07,decay:.1}),
 pad:(at=0,dur=.9)=>AUDIO.chord([220,261.63,329.63],{at,dur,type:'triangle',gain:.1,attack:.05,release:.3})
};
// Shared play/stop/tick handlers: spec.ms(s) step length, spec.N(s) steps in the loop, spec.step(s,i) sounds one step.
function X7_loopOn(spec,extra={}){
 return {...extra,
  play(s,a,ctx){s.token=(s.token||0)+1;if(s.playing){s.playing=false;AUDIO.stopAll();return 'keep'}s.playing=true;s.pos=-1;ctx.every(spec.ms(s),'tick',s.token);return 'keep'},
  tick(s,tok){if(!s.playing||Number(tok)!==s.token)return 'stop';s.pos=(s.pos+1)%spec.N(s);s.tStep=X7_now();spec.step(s,s.pos);return 'keep'}};
}
const X7_pos=(s,X,N,rate)=>X.try?(s.playing?s.pos:-1):Math.floor(X.p*rate)%N;
const X7_frac=v=>v-Math.floor(v);
const X7_note=(x,y,w,lines,col=C.muted)=>lines.map((t,i)=>TF(x,y+i*18,t,13,col,'start')).join('');
const X7_BPM=128,X7_STEP=60000/X7_BPM/4;

/* ---------- beatmatching ---------- */
const X7_A=126,X7_B0=120;
const X7_bpmB=s=>X7_B0*(1+s.pitch/100);
SCENE({id:'beatmatching',name:'Beatmatching',tag:'Two decks, one pulse',
 definition:'Beatmatching means adjusting one record’s speed until its beats fall exactly on the beats of the record already playing, so the two can be mixed without the rhythm stumbling.',
 example:'Deck A plays at 126 BPM. Deck B was made at 120 BPM. Push B’s pitch fader to +5% and it also runs at 126; then nudge it until the kicks land together.',
 desc:'Two rows of beat marks, one for each deck, sliding past a centre line; a meter shows how far deck B’s beat is ahead of or behind deck A’s.',
 research:'Brewster, B. & Broughton, F. (1999). Last Night a DJ Saved My Life. · Butler, M. J. (2006). Unlocking the Groove, ch. 6. · Francis Grasso is usually credited with early beat-mixing around 1969–70; accounts vary.',
 dur:12,hint:'Press Play, then move deck B’s pitch until the two kicks stop drifting apart. Use the nudges to line them up. A simplified model; your sounds stay on this page.',
 init:()=>({pitch:0,playing:false,posA:0,posB:0,nextA:0,nextB:0,lastT:0,token:0}),
 watch(p){const pitch=Math.round(Math.min(5,p*7)*10)/10,posA=p*30;return {pitch,playing:false,posA,posB:posA*(X7_B0*(1+pitch/100))/X7_A,sim:true}},
 ui:[{range:'pitch',label:'Deck B pitch',min:-8,max:8,step:.1,get:s=>s.pitch,act:'pitch',show:v=>(v>0?'+':'')+Number(v).toFixed(1)+'%'},{b:'Play / stop',act:'play'},{b:'Nudge B back',act:'nudge',arg:-1},{b:'Nudge B on',act:'nudge',arg:1}],
 on:{pitch(s,v){s.pitch=Number(v);return 'keep'},
  nudge(s,v){s.posB+=Number(v)*.04;s.nextB=Math.max(s.nextB,Math.ceil(s.posB));return 'keep'},
  play(s,a,ctx){s.token++;if(s.playing){s.playing=false;AUDIO.stopAll();return 'keep'}s.playing=true;s.posA=0;s.posB=0;s.nextA=0;s.nextB=0;s.lastT=X7_now();ctx.every(50,'tick',s.token);return 'keep'},
  tick(s,tok){if(!s.playing||Number(tok)!==s.token)return 'stop';const now=X7_now(),dt=Math.min(.3,now-s.lastT);s.lastT=now;const bB=X7_bpmB(s);s.posA+=dt*X7_A/60;s.posB+=dt*bB/60;
   while((s.nextA-s.posA)*60/X7_A<.12){X7_V.kick(Math.max(0,(s.nextA-s.posA)*60/X7_A));s.nextA++}
   while((s.nextB-s.posB)*60/bB<.12){X7_V.kickB(Math.max(0,(s.nextB-s.posB)*60/bB));s.nextB++}
   return 'keep'}},
 draw(s,f,X){
  const bB=X7_bpmB(s),d=bB-X7_A;let ph=X7_frac(s.posB-s.posA);if(ph>.5)ph-=1;
  const matched=Math.abs(d)<.07&&Math.abs(ph)<.05;
  let out=heading(matched?'Locked: the two kicks land together':Math.abs(d)<.07?'Same speed: now nudge the beats together':d<0?'Deck B is slower: its beats fall behind':'Deck B is faster: its beats run ahead');
  const row=(y,pos,col,name,bpm)=>{let o=R(60,y,480,46,'#fff',C.grid,8)+TBF(52,y+19,name,14,col,'end')+TF(52,y+37,bpm.toFixed(1),12,C.muted,'end');
   for(let k=Math.ceil(pos-2.4);k<=pos+2.4;k++){const x=300+(k-pos)*100;if(x>66&&x<534)o+=R(x-5,y+7,10,32,col,'none',3)}return o};
  out+=row(70,s.posA,C.blue,'A',X7_A)+row(128,s.posB,C.coral,'B',bB)+L(300,60,300,184,C.amber,2,'stroke-dasharray="4 4"')+TF(300,54,'now',12,C.amber);
  // phase meter
  out+=R(100,214,400,22,'#eef3f6','none',11)+R(280,214,40,22,C.greenp,'none',6)+L(300,208,300,242,C.line,1.5)+Ci(300+ph*400,225,9,matched?C.green:C.coral,'#fff');
  out+=TF(100,256,'B half a beat behind',12,C.muted,'start')+TF(500,256,'half a beat ahead',12,C.muted,'end');
  out+=counter(90,278,'deck B tempo',bB.toFixed(1)+' BPM',C.coral,130)+counter(235,278,'difference',(d>=0?'+':'')+d.toFixed(1)+' BPM',Math.abs(d)<.07?C.green:C.amber,130)+counter(380,278,'drifts one beat in',Math.abs(d)<.07?'never':(60/Math.abs(d)).toFixed(0)+' s',C.purple,130);
  out+=T(300,356,X.try&&!s.playing?'Press Play to hear both decks.':'Deck A: 126 BPM. Deck B was made at 120 BPM.',15,C.ink);
  return {svg:out,phase:matched?'Speed and position both match, so the kicks fuse into one. From here a DJ only needs small nudges, because no two tempos stay matched forever.':Math.abs(d)<.07?'The tempos match, so the gap between the beats now stays the same. Nudge deck B forward or back until its kick sits on deck A’s.':`A difference of ${Math.abs(d).toFixed(1)} BPM means deck B ${d<0?'loses':'gains'} one whole beat every ${(60/Math.abs(d)).toFixed(0)} seconds. You hear it as a gallop that keeps changing.`};
 }});

SCENE({id:'beatmatching-drift',name:'Why unmatched beats gallop',tag:'The arithmetic of drift',
 definition:'Two steady pulses at different tempos slide past each other at a constant rate. The gap between their beats grows, wraps round after a whole beat, and starts again.',
 example:'At 126 and 128 BPM the faster record gains 2 beats every minute, so the kicks coincide once every 30 seconds and sound like a flam or gallop in between.',
 desc:'A sawtooth graph of the gap between two decks’ beats over one minute, with the moments the beats coincide marked.',
 research:'Butler, M. J. (2006). Unlocking the Groove: Rhythm, Meter, and Musical Design in Electronic Dance Music. Indiana University Press. · The arithmetic is exact; the 30 ms figure for hearing two separate onsets is a rough textbook value.',
 dur:10,hint:'Set the two tempos and read how often the beats line up. Press Hear to listen to eight seconds of both.',
 init:()=>({a:126,b:128}),
 watch(p){return {a:126,b:126+Math.round(p*6*2)/2}},
 ui:[{range:'a',label:'Deck A',min:118,max:140,step:.5,get:s=>s.a,act:'a',show:v=>v+' BPM'},{range:'b',label:'Deck B',min:118,max:140,step:.5,get:s=>s.b,act:'b',show:v=>v+' BPM'},{b:'Hear 8 seconds',act:'hear'}],
 on:{a(s,v){s.a=Number(v);return 'keep'},b(s,v){s.b=Number(v);return 'keep'},
  hear(s){AUDIO.stopAll();for(let t=0;t<8;t+=60/s.a)X7_V.kick(t);for(let t=0;t<8;t+=60/s.b)X7_V.kickB(t);return 'keep'}},
 draw(s){
  const d=Math.abs(s.a-s.b),per=d?60/d:Infinity;let out=heading(d?`The beats coincide every ${per.toFixed(per<10?1:0)} seconds`:'Same tempo: the gap never changes');
  const x0=80,w=460,y0=250,h=150;out+=R(x0,y0-h,w,h,'#fff',C.grid,4);
  for(const t of [0,15,30,45,60])out+=L(x0+t/60*w,y0,x0+t/60*w,y0+5,C.line,1.2)+TF(x0+t/60*w,y0+20,t===60?'60 s':String(t),12,C.muted);
  out+=TF(x0-8,y0-h+6,'1 beat',12,C.muted,'end')+TF(x0-8,y0+4,'0',12,C.muted,'end')+TF(x0,y0-h-8,'gap between the two decks’ beats',12,C.muted,'start');
  if(d){let pth='';for(let k=0;k*per<60;k++){const xa=x0+k*per/60*w,xb=x0+Math.min(60,(k+1)*per)/60*w,yb=y0-h*Math.min(1,(60-k*per)/per);pth+=`M${fmt(xa)} ${y0}L${fmt(xb)} ${fmt(yb)}`;out+=Ci(xa,y0,5,C.green,'#fff')}out+=P(pth,C.coral,2.4)}
  else out+=L(x0,y0,x0+w,y0,C.green,3);
  const ms30=d?.03*(60/Math.max(s.a,s.b))/((1/Math.min(s.a,s.b)-1/Math.max(s.a,s.b))*60):Infinity;
  out+=counter(100,292,'difference',d.toFixed(1)+' BPM',C.coral,120)+counter(240,292,'beats gained a minute',d.toFixed(1),C.purple,150)+counter(410,292,'coincide every',d?per.toFixed(1)+' s':'always',C.green,120);
  out+=T(300,366,'green dots: the kicks land together',14,C.muted);
  return {svg:out,phase:d?`A ${d.toFixed(1)} BPM difference means one deck gains ${d.toFixed(1)} beats a minute. The gap climbs steadily to a whole beat, which sounds the same as no gap, every ${per.toFixed(1)} seconds. In between, two kicks more than about 30 ms apart are heard as two.`:'With identical tempos the gap stays wherever it started. That is why beatmatching has two parts: match the speed, then slide the beats together.'};
 }});

SCENE({id:'beatmatching-pitch',name:'The pitch fader',tag:'Speed and pitch move together',
 definition:'A turntable’s pitch fader changes how fast the record spins. Tempo and musical pitch rise and fall together: playing a record 6% faster also raises every note by about a semitone.',
 example:'A 125 BPM record at +4% plays at 130 BPM and sounds about two-thirds of a semitone higher. Digital “key lock” changes the tempo and keeps the pitch.',
 desc:'A vertical pitch fader beside readouts of the new tempo and the pitch shift in semitones, with a keyboard strip showing how far a note has moved.',
 research:'Technics SL-1200MK2 (1979): ±8% pitch control, the standard club turntable for decades. · Pitch shift in semitones = 12 × log₂(speed ratio), exact. · Brewster & Broughton (1999).',
 dur:10,hint:'Move the fader and switch key lock on and off. Press Hear to compare the original note with the shifted one.',
 init:()=>({pct:4,lock:'off',bpm:125}),
 watch(p){return {pct:Math.round((-8+p*16)*2)/2,lock:p>.8?'on':'off',bpm:125}},
 ui:[{range:'pct',label:'Pitch fader',min:-8,max:8,step:.5,get:s=>s.pct,act:'pct',show:v=>(v>0?'+':'')+v+'%'},{choose:[['off','Vinyl (no key lock)'],['on','Key lock']],label:'Mode',get:s=>s.lock,act:'lock'},{b:'Hear original then shifted',act:'hear'}],
 on:{pct(s,v){s.pct=Number(v);return 'keep'},lock(s,v){s.lock=v;return 'keep'},
  hear(s){AUDIO.stopAll();const r=1+s.pct/100,f=220*(s.lock==='on'?1:r);AUDIO.tone(220,{dur:.5,type:'triangle',gain:.14});AUDIO.tone(f,{at:.65,dur:.5,type:'triangle',gain:.14});
   for(let k=0;k<4;k++){X7_V.kick(1.5+k*60/s.bpm);X7_V.kickB(1.5+4*60/s.bpm+.3+k*60/(s.bpm*r))}return 'keep'}},
 draw(s){
  const r=1+s.pct/100,bpm=s.bpm*r,semi=s.lock==='on'?0:12*Math.log2(r);let out=heading(s.lock==='on'?'Key lock: new tempo, same pitch':`${s.pct>0?'+':''}${s.pct}%: tempo and pitch move together`);
  out+=R(80,62,36,220,'#eef3f6',C.grid,8)+L(98,72,98,272,C.line,2);for(const v of [-8,-4,0,4,8])out+=L(118,172-v*12.5,126,172-v*12.5,C.line,1.5)+TF(132,176-v*12.5,(v>0?'+':'')+v+'%',12,C.muted,'start');
  out+=R(72,172-s.pct*12.5-9,52,18,C.ink,'none',5);
  out+=counter(210,70,'tempo',bpm.toFixed(1)+' BPM',C.blue,150)+counter(380,70,'pitch shift',(semi>=0?'+':'')+semi.toFixed(2)+' semitones',semi?C.coral:C.green,170);
  // keyboard strip: one octave around A
  const kx=210,kw=340,ky=160;out+=TF(kx,ky-10,'where the note A lands',12,C.muted,'start')+L(kx,ky+30,kx+kw,ky+30,C.line,2);
  for(let n=-2;n<=2;n++){const x=kx+kw/2+n*kw/5;out+=L(x,ky+22,x,ky+38,C.line,1.5)+TF(x,ky+56,n===0?'A':(n>0?'+':'')+n,12,C.muted)}
  out+=Ci(kx+kw/2,ky+30,7,'#fff',C.blue)+Ci(kx+kw/2+semi*kw/5,ky+30,7,C.coral,'#fff')+TF(kx+kw,ky+76,'semitones from the original',12,C.muted,'end');
  out+=X7_note(210,262,340,s.lock==='on'?['Key lock stretches time digitally and','leaves the notes where they were.','Large shifts can blur the transients.']:['On vinyl there is one control: speed.','About +5.9% is a whole semitone,','enough to clash with a record in key.']);
  out+=T(300,356,`${s.bpm} BPM record → ${bpm.toFixed(1)} BPM`,15,C.ink);
  return {svg:out,phase:s.lock==='on'?'Key lock (time-stretching) lets a DJ match tempos without changing key. It is a digital process; turntables cannot do it.':s.pct===0?'At 0% the record plays at its recorded speed and pitch. A full semitone up needs about +5.9%, because 2^(1/12) ≈ 1.0595.':`${s.pct>0?'Speeding a record up':'Slowing a record down'} by ${Math.abs(s.pct)}% multiplies every frequency by ${r.toFixed(3)}, a shift of ${semi.toFixed(2)} semitones. A full semitone needs about 5.9%, because 2^(1/12) ≈ 1.0595.`};
 }});

/* ---------- eq-mixing ---------- */
const X7_EQ={ms:()=>X7_STEP,N:()=>16,step(s,i){
 const a=s.xa,b=s.xb;
 if(i%4===0){if(a.low)X7_V.kick(0,.24);if(b.low)X7_V.kickB(0,.2)}
 if(i%4===2){if(a.low)X7_V.bass(55,0);if(b.low)X7_V.bass(65.41,0)}
 if(i%8===4){if(a.mid)X7_V.clap(0,.1)}
 if(i%4===3&&b.mid)X7_V.lead(261.63,0,800);
 if(i%2===0&&a.high)X7_V.hat(0);
 if(i%4===2&&b.high)X7_V.ohat(0)}};
const X7_tog=(o,k)=>({...o,[k]:!o[k]});
SCENE({id:'eq-mixing',name:'Mixing with the EQ',tag:'Only one bassline at a time',
 definition:'A DJ mixer has low, mid and high controls for each channel. During a blend the DJ turns one record’s bass down before bringing the other’s up, because two basslines and two kicks at once turn to mud.',
 example:'Track B comes in with only its hats. Then its mids. At the phrase change, A’s low goes out and B’s low comes in on the same beat: the bass swap.',
 desc:'Two mixer channels with low, mid and high buttons each, and a meter of how much bass is playing in total.',
 research:'Brewster, B. & Broughton, F. (2002). How to DJ (Properly). · Butler (2006), ch. 6. · Early club mixers (Bozak, UREI) had only bass and treble controls; some 1970s–80s DJs cut frequencies with a separate crossover or isolator. Three-band EQ on every channel became standard on DJ mixers in the 1990s.',
 dur:11,hint:'Press Play. Switch bands on and off on each track. Try both lows at once, then swap them. A simplified model: real EQs turn smoothly.',
 init:()=>({xa:{low:true,mid:true,high:true},xb:{low:false,mid:false,high:true},playing:false,pos:-1}),
 watch(p){const st=Math.min(4,Math.floor(p*5));return {xa:{low:st<3,mid:st<4,high:st<4},xb:{low:st>=3||st===2&&false,mid:st>=1,high:true},playing:false,pos:-1,both:st===2}},
 ui:[{b:'Play / stop',act:'play'},{b:'Bass swap',act:'swap'}],
 on:X7_loopOn(X7_EQ,{band(s,v){const [t,k]=String(v).split('.');s[t]=X7_tog(s[t],k);return 'keep'},swap(s){const al=s.xa.low;s.xa={...s.xa,low:s.xb.low};s.xb={...s.xb,low:al};return 'keep'}}),
 draw(s,f,X){
  const pos=X7_pos(s,X,16,8*9),bass=(s.xa.low?1:0)+(s.xb.low?1:0);
  let out=heading(bass===2?'Two basslines at once: muddy':bass===0?'No bass at all: the floor empties':'One bassline: clean');
  const chan=(x,name,key,col,o)=>{let g=R(x,58,200,190,'#fff',C.grid,10)+TBF(x+100,82,name,15,col);
   [['high','High · hats'],['mid','Mid · claps, lead'],['low','Low · kick, bass']].forEach(([k,lab],i)=>{const on=o[k],y=98+i*48;
    g+=hit(X,'band',key+'.'+k,`${name} ${lab}: ${on?'on':'cut'}. Press to switch.`,R(x+16,y,168,38,on?col:'#eef3f6',on?'none':C.grid,8)+TF(x+100,y+24,lab+(on?'':' (cut)'),13,on?'#fff':C.muted))});return g};
  out+=chan(60,'Track A','xa',C.blue,s.xa)+chan(340,'Track B','xb',C.coral,s.xb);
  out+=TF(300,120,'mixer',12,C.muted)+arrow(266,150,290,150,C.blue,2)+arrow(334,150,310,150,C.coral,2);
  out+=TF(100,280,'total bass',13,C.muted,'start')+R(190,266,300,20,'#eef3f6','none',10)+R(190,266,150*bass,20,bass===2?C.coral:bass?C.green:'#eef3f6','none',10)+L(340,260,340,292,C.ink,1.5)+TF(340,306,'one track’s worth',12,C.muted);
  for(let i=0;i<16;i++)out+=R(140+i*20,322,16,8,i===pos?C.amber:i%4===0?'#cfdce5':'#eef3f6','none',3);
  out+=T(300,362,bass===2?'Cut one low before the other comes in.':'Press a band to switch it.',15,bass===2?C.coral:C.ink);
  return {svg:out,phase:bass===2?'Two kicks and two basslines rarely line up in pitch or phase, so the low end booms and blurs. The sound system also has the least headroom there.':bass===0?'With both lows cut the mix keeps its rhythm in the hats and claps but loses its weight. DJs use this on purpose, briefly, before bringing the bass back.':'One track owns the low end. The other can be layered above it with its hats and mids, which is how a blend stays clear for a minute or more.'};
 }});

const X7_BANDS=[['kick',60,'Kick',C.blue,45,110],['bass',90,'Bassline',C.purple,60,250],['clap',1500,'Clap, snare',C.coral,700,3000],['lead',800,'Lead, chords',C.green,300,4000],['hat',9000,'Hi-hats',C.amber,5000,14000]];
SCENE({id:'eq-mixing-bands',name:'Where each sound sits',tag:'A map of the spectrum',
 definition:'Each part of a techno track occupies its own range of frequencies. The mixer’s three bands divide that range, so a DJ can remove a kick, a lead or the hats from a finished record.',
 example:'The kick’s weight is around 50–100 Hz, a clap around 1–2 kHz and closed hats above 6 kHz. A low cut removes kick and bassline together.',
 desc:'A frequency axis from 30 Hz to 16 kHz with bars for kick, bassline, clap, lead and hats, and three shaded mixer bands that can be cut.',
 research:'Typical ranges, approximate; they vary by track and by mixer. Three-band crossover points on common DJ mixers are roughly 250–300 Hz and 2.5–5 kHz. · Katz, B. (2002). Mastering Audio.',
 dur:10,hint:'Cut a band and see which sounds go with it. Press a sound’s bar to hear it alone. Ranges are approximate.',
 init:()=>({low:true,mid:true,high:true}),
 watch(p){const st=Math.floor(p*4);return {low:st!==1,mid:st!==2,high:st!==3}},
 ui:[{choose:[['low','Low'],['mid','Mid'],['high','High']],label:'Switch a band',get:()=>'',act:'cut'},{b:'All on',act:'all'}],
 on:{cut(s,v){s[v]=!s[v];return 'keep'},all(s){s.low=s.mid=s.high=true;return 'keep'},
  solo(s,v){AUDIO.stopAll();const f={kick:()=>X7_V.kick(),bass:()=>X7_V.bass(55),clap:()=>X7_V.clap(),lead:()=>X7_V.lead(261.63),hat:()=>{X7_V.hat();X7_V.hat(.12);X7_V.ohat(.24)}}[v];if(f)f();return 'keep'}},
 draw(s,f,X){
  const x0=70,w=480,fx=v=>x0+Math.log(v/30)/Math.log(16000/30)*w;let out=heading('Five sounds, three mixer bands');
  const bands=[['low',30,280,'LOW'],['mid',280,3500,'MID'],['high',3500,16000,'HIGH']];
  bands.forEach(([k,a,b,lab])=>{out+=R(fx(a),56,fx(b)-fx(a),214,s[k]?'#f1f6f9':'#fbe9e4','none',0)+TBF((fx(a)+fx(b))/2,74,lab+(s[k]?'':' cut'),13,s[k]?C.muted:C.coral)});
  out+=L(fx(280),56,fx(280),270,C.line,1.5,'stroke-dasharray="4 4"')+L(fx(3500),56,fx(3500),270,C.line,1.5,'stroke-dasharray="4 4"');
  X7_BANDS.forEach(([k,c,name,col,lo,hi],i)=>{const y=92+i*34,band=c<280?'low':c<3500?'mid':'high',on=s[band];
   out+=hit(X,'solo',k,`Hear the ${name.toLowerCase()} alone`,R(fx(lo),y,fx(hi)-fx(lo),22,on?col:'#d7e0e6','none',6)+TF(fx(lo)+6,y+16,name,12,'#fff','start'))});
  out+=L(x0,270,x0+w,270,C.line,1.5);for(const v of [50,100,500,1000,5000,10000])out+=L(fx(v),270,fx(v),275,C.line,1.2)+TF(fx(v),290,v>=1000?v/1000+'k':String(v),12,C.muted);
  out+=TF(x0+w,306,'frequency, Hz (log scale)',12,C.muted,'end');
  const gone=X7_BANDS.filter(([k,c])=>!s[c<280?'low':c<3500?'mid':'high']).map(b=>b[2].toLowerCase());
  out+=T(300,350,gone.length?'Removed: '+gone.join(', '):'All three bands on: the full track',15,gone.length?C.coral:C.ink);
  return {svg:out,phase:gone.length?`Cutting a band removes whatever lives there: here the ${gone.join(' and the ')}. That is how a DJ can take the drums out of one record and lay another record’s drums underneath.`:'A finished record cannot be un-mixed, but because the main elements sit in different ranges, three filters are enough to pull it apart roughly. The lead spills across mid and high, so cuts are never perfectly clean.'};
 }});

SCENE({id:'eq-mixing-crossfade',name:'Fader curves',tag:'Why a straight line dips',
 definition:'A crossfade turns one track down as the other comes up. If both gains change in a straight line, the combined loudness sags in the middle; an equal-power curve keeps it level.',
 example:'Halfway through a straight-line fade each track is at half amplitude, and two unrelated signals at half amplitude carry only half the total power: a 3 dB dip.',
 desc:'Two gain curves crossing as a fader moves from track A to track B, with a third curve for the combined power, for a straight-line or an equal-power fade.',
 research:'For uncorrelated signals powers add, so total power = gA² + gB². Equal-power law: gA = cos(πx/2), gB = sin(πx/2), giving a constant sum (standard audio engineering; e.g. Roads, C. (1996). The Computer Music Tutorial).',
 dur:10,hint:'Move the fader and switch the curve. Watch the combined level in the middle. Press Hear to listen to a four-beat fade.',
 init:()=>({x:50,curve:'lin'}),
 watch(p){return {x:Math.round(Math.min(1,p*1.6)*100)%101,curve:p<.55?'lin':'pow'}},
 ui:[{range:'x',label:'Crossfader',min:0,max:100,step:1,get:s=>s.x,act:'x',show:v=>v<50?'A '+(100-v)+'%':v>50?'B '+v+'%':'centre'},{choose:[['lin','Straight line'],['pow','Equal power']],label:'Curve',get:s=>s.curve,act:'curve'},{b:'Hear the fade',act:'hear'}],
 on:{x(s,v){s.x=Number(v);return 'keep'},curve(s,v){s.curve=v;return 'keep'},
  hear(s){AUDIO.stopAll();for(let k=0;k<16;k++){const x=k/15,ga=s.curve==='lin'?1-x:Math.cos(x*Math.PI/2),gb=s.curve==='lin'?x:Math.sin(x*Math.PI/2),t=k*.2;
   if(ga>.02)AUDIO.tone(220,{at:t,dur:.19,type:'triangle',gain:.16*ga});if(gb>.02)AUDIO.tone(277.18,{at:t,dur:.19,type:'triangle',gain:.16*gb})}return 'keep'}},
 draw(s){
  const g=x=>s.curve==='lin'?[1-x,x]:[Math.cos(x*Math.PI/2),Math.sin(x*Math.PI/2)],x=s.x/100,[ga,gb]=g(x),pw=ga*ga+gb*gb,db=10*Math.log10(pw);
  let out=heading(s.curve==='lin'?'Straight-line fade: a dip in the middle':'Equal-power fade: level all the way');
  const x0=90,w=420,y0=260,h=170;out+=R(x0,y0-h,w,h,'#fff',C.grid,4);
  const path=fn=>{let d='';for(let k=0;k<=60;k++){const u=k/60;d+=(k?'L':'M')+fmt(x0+u*w)+' '+fmt(y0-h*fn(u))}return d};
  out+=P(path(u=>g(u)[0]),C.blue,2.6)+P(path(u=>g(u)[1]),C.coral,2.6)+P(path(u=>{const q=g(u);return q[0]*q[0]+q[1]*q[1]}),C.green,2.6,'none','stroke-dasharray="6 4"');
  out+=L(x0+x*w,y0-h,x0+x*w,y0,C.amber,2)+Ci(x0+x*w,y0-h*pw,6,C.green,'#fff');
  out+=TF(x0,y0+20,'all A',12,C.blue,'start')+TF(x0+w,y0+20,'all B',12,C.coral,'end')+TF(x0-8,y0-h+5,'1',12,C.muted,'end')+TF(x0-8,y0+4,'0',12,C.muted,'end');
  out+=TF(x0+w/2,y0-h-8,'blue: A gain · red: B gain · dashed: combined power',12,C.muted);
  out+=counter(100,292,'track A',Math.round(ga*100)+'%',C.blue,110)+counter(225,292,'track B',Math.round(gb*100)+'%',C.coral,110)+counter(350,292,'combined level',(db>-.05?'0.0':db.toFixed(1))+' dB',db<-.5?C.coral:C.green,150);
  return {svg:out,phase:s.curve==='lin'?`With straight lines the two gains always add to 1, but loudness follows power, the sum of the squares. At the centre that is 0.5² + 0.5² = 0.5, a 3 dB sag. Here: ${db.toFixed(1)} dB.`:'With cosine and sine curves the squares always add to 1, so the room hears a steady level while one record replaces the other. Mixers offer several curves; scratch DJs prefer a sharp cut instead.'};
 }});

/* ---------- phrasing ---------- */
const X7_PH={ms:()=>60000/X7_BPM,N:()=>32,step(s,i){const b=60/X7_BPM;
 X7_V.kick(0);X7_V.hat(b/2);if(i%4===1||i%4===3)X7_V.clap(0,.09);
 if(i===0)X7_V.crash(0);
 if(s.fill!=='off'&&i>=30){for(let k=0;k<4;k++)X7_V.clap(k*b/4,.05+.015*k)}}};
SCENE({id:'phrasing',name:'Phrases',tag:'Counting in eights',
 definition:'Dance tracks are built in blocks: four beats make a bar, and bars come in groups of 8, 16 or 32 called phrases. New sounds almost always enter or leave at the start of a phrase.',
 example:'Count “1, 2, 3, 4” eight times. On the next “1” a cymbal crashes and the bassline arrives. A fill in the last bar is the warning that a phrase is ending.',
 desc:'A grid of eight bars of four beats, with a playhead; the first beat of the phrase carries a crash and the last bar a fill.',
 research:'Butler, M. J. (2006). Unlocking the Groove, chs 4–5 (multi-measure grouping in electronic dance music). · Snoman, R. (2009). Dance Music Manual. · Powers of two are a strong convention, not a rule.',
 dur:11,hint:'Press Play and count along. Listen for the crash on beat 1 of the phrase and the fill in bar 8. Switch the fill off and see if you still feel the phrase.',
 init:()=>({playing:false,pos:-1,fill:'on'}),
 watch(){return {playing:false,pos:-1,fill:'on'}},
 ui:[{b:'Play / stop',act:'play'},{choose:[['on','Fill in bar 8'],['off','No fill']],label:'Warning',get:s=>s.fill,act:'fill'}],
 on:X7_loopOn(X7_PH,{fill(s,v){s.fill=v;return 'keep'}}),
 draw(s,f,X){
  const pos=X7_pos(s,X,32,32),bar=pos<0?-1:Math.floor(pos/4);let out=heading(pos<0?'One phrase: 8 bars of 4 beats':`Bar ${bar+1} of 8, beat ${pos%4+1}`);
  for(let b=0;b<8;b++){const x=62+b*60,cur=b===bar;out+=R(x,70,54,150,cur?C.amberp:'#fff',cur?C.amber:C.grid,8)+TBF(x+27,92,String(b+1),14,cur?C.amber:C.muted);
   for(let k=0;k<4;k++){const i=b*4+k,on=i===pos;out+=Ci(x+27,112+k*26,k===0?9:6,on?C.amber:b===0&&k===0?C.coral:b===7&&k>=2&&s.fill==='on'?C.purple:k===0?C.blue:'#cfdce5',on?'#fff':'none')}}
  out+=Ci(80,250,7,C.coral)+TF(94,255,'crash: phrase starts',13,C.muted,'start')+Ci(250,250,7,C.blue)+TF(264,255,'beat 1 of a bar',13,C.muted,'start');
  if(s.fill==='on')out+=Ci(400,250,7,C.purple)+TF(414,255,'fill: phrase ending',13,C.muted,'start');
  out+=counter(120,280,'beats in a bar','4',C.blue,110)+counter(245,280,'bars in this phrase','8',C.purple,130)+counter(390,280,'one phrase lasts',(32*60/X7_BPM).toFixed(0)+' s',C.green,110);
  out+=T(300,360,`${X7_BPM} BPM · 32 beats`,15,C.ink);
  return {svg:out,phase:'Producers signal phrase boundaries with crashes, fills, risers and drops in density. Dancers feel them without counting, and DJs count them so that two records change at the same moment.'};
 }});

SCENE({id:'phrasing-mix',name:'Mixing on the phrase',tag:'Start the next record on a “one”',
 definition:'Beatmatched records can still clash if their phrases are out of step. A DJ starts the incoming record so that its phrase boundaries fall on the playing record’s phrase boundaries.',
 example:'Start track B on the first beat of an 8-bar phrase of track A and both drop their fills, and bring in their basslines, together. Start it three bars late and B’s changes land in the middle of A’s phrases.',
 desc:'Two timelines of 8-bar phrases, track A above and track B below, with track B’s start position adjustable; aligned phrase boundaries are marked.',
 research:'Butler (2006), ch. 6 (the DJ set as large-scale form). · Brewster & Broughton (2002). · Illustrative timelines; real tracks vary in phrase length.',
 dur:10,hint:'Slide where track B starts. Its changes line up with track A’s only when it starts on a phrase boundary.',
 init:()=>({off:3}),
 watch(p){return {off:[3,5,8,2,0,16][Math.min(5,Math.floor(p*6))]}},
 ui:[{range:'off',label:'Track B starts after',min:0,max:16,step:1,get:s=>s.off,act:'off',show:v=>v+' bars'}],
 on:{off(s,v){s.off=Number(v);return 'keep'}},
 draw(s){
  const ok=s.off%8===0,half=!ok&&s.off%4===0;let out=heading(ok?'On the phrase: both tracks change together':half?'Half a phrase out':'Off the phrase: changes collide');
  const x0=50,bw=500/32,row=(y,start,col,name)=>{let o=TBF(x0-6,y+24,name,14,col,'end');for(let b=start;b<32;b++){const k=b-start,ph=Math.floor(k/8);o+=R(x0+b*bw+1,y,bw-2,38,k%8===0?col:ph%2?'#cfdbe3':'#e3ebf0','none',3)}return o};
  out+=row(84,0,C.blue,'A')+row(170,s.off,C.coral,'B');
  for(let b=0;b<=32;b+=8){out+=L(x0+b*bw,70,x0+b*bw,136,C.blue,1.2,'stroke-dasharray="3 4"')+TF(x0+b*bw,64,'bar '+(b+1>32?32:b+1),12,C.muted)}
  for(let b=s.off;b<32;b+=8){const al=b%8===0;out+=Ci(x0+b*bw+bw/2,228,7,al?C.green:C.coral,'#fff')+L(x0+b*bw+bw/2,134,x0+b*bw+bw/2,170,al?C.green:C.coral,1.6)}
  
  out+=counter(110,256,'B starts at bar',String(s.off+1),C.coral,130)+counter(260,256,'bars into A’s phrase',String(s.off%8),ok?C.green:C.amber,150)+counter(430,256,'verdict',ok?'aligned':half?'half out':'off',ok?C.green:C.coral,110);
  out+=TF(300,322,'coloured blocks: first bar of each 8-bar phrase',12,C.muted)+T(300,356,ok?'Fills, drops and new parts arrive on the same beat.':'B’s bassline would arrive mid-phrase in A.',15,ok?C.green:C.ink);
  return {svg:out,phase:ok?'Phrase-matched records sound like one arrangement: when A thins out for its break, B can take over the kick at exactly that boundary.':'The beats still match, so nothing sounds “wrong” at once. But B’s crash and bassline arrive while A is in the middle of a phrase, and the mix feels lopsided until one track ends.'};
 }});

const X7_CNT={ms:()=>60000/X7_BPM,N:()=>32,step(s,i){X7_PH.step({fill:s.fill},i)}};
SCENE({id:'phrasing-count',name:'Find the “one”',tag:'You are the DJ',
 definition:'To mix on the phrase a DJ must know where the next phrase starts before it arrives. This is a counting skill, practised until it is automatic.',
 example:'Listen to the loop. When you think the next 8-bar phrase begins, press the button exactly on its first beat, as you would press play on the incoming record.',
 desc:'A strip showing how many beats early or late each of your presses was, measured against the true start of the phrase.',
 research:'Butler (2006), ch. 6. · Your presses are timed with performance.now() against the loop’s own clock; browsers add a few tens of milliseconds of delay, and nothing leaves this page. · Watch shows a simulated learner.',
 dur:10,hint:'Press Play, count the bars, and press Now on beat 1 of a new phrase. Try it with the fill switched off. Up to six tries are kept.',
 init:()=>({playing:false,pos:-1,fill:'on',tries:[],tStep:0}),
 watch(p){const all=[2.2,-1.1,.6,-.3,.2,.1];return {playing:false,pos:-1,fill:'on',tries:all.slice(0,Math.floor(p*7)),sim:true}},
 ui:[{b:'Play / stop',act:'play'},{b:'Now: phrase starts',act:'now'},{choose:[['on','With fill'],['off','No fill']],label:'Hint',get:s=>s.fill,act:'fill'},{b:'Clear my tries',act:'clear'}],
 on:X7_loopOn(X7_CNT,{fill(s,v){s.fill=v;return 'keep'},clear(s){s.tries=[];return 'keep'},
  now(s){if(!s.playing||s.pos<0)return 'keep';const x=s.pos+(X7_now()-s.tStep)/(60/X7_BPM);let e=((x+16)%32+32)%32-16;s.tries=s.tries.concat([Math.round(e*100)/100]).slice(-6);return 'keep'}}),
 draw(s,f,X){
  const n=s.tries.length,best=n?Math.min(...s.tries.map(Math.abs)):null,pos=X7_pos(s,X,32,0);
  let out=heading(n?`Closest so far: ${best<.25?'on the beat':best.toFixed(1)+' beats out'}`:'Press Now on beat 1 of the next phrase');
  const x0=60,w=480,y=150,ex=e=>x0+w/2+clamp(e,-8,8)/8*w/2;
  out+=R(x0,y-40,w,80,'#fff',C.grid,8)+R(ex(-.5),y-40,ex(.5)-ex(-.5),80,C.greenp,'none',0)+L(ex(0),y-48,ex(0),y+48,C.green,2);
  for(const v of [-8,-4,0,4,8])out+=L(ex(v),y+40,ex(v),y+46,C.line,1.2)+TF(ex(v),y+62,v===0?'phrase start':(v>0?'+':'')+v,12,C.muted);
  out+=TF(x0,y-50,'early',12,C.muted,'start')+TF(x0+w,y-50,'late',12,C.muted,'end')+TF(x0+w,y+82,'beats',12,C.muted,'end');
  s.tries.forEach((e,i)=>{out+=Ci(ex(e),y-22+i*9,6,Math.abs(e)<=.5?C.green:C.coral,'#fff')});
  if(X.try&&s.playing){const bar=Math.floor(s.pos/4);for(let b=0;b<8;b++)out+=R(180+b*30,252,26,10,b===bar&&s.fill==='on'?C.amber:'#e3ebf0','none',4)}
  out+=counter(120,280,'tries',String(n),C.blue,100)+counter(240,280,'within half a beat',String(s.tries.filter(e=>Math.abs(e)<=.5).length),C.green,150)+counter(410,280,s.sim?'simulated learner':'hint',s.sim?'improving':s.fill==='on'?'fill on':'no fill',C.purple,130);
  out+=T(300,360,X.try&&!s.playing?'Press Play to start the loop.':'Green band: within half a beat.',15,C.ink);
  return {svg:out,phase:s.sim?'A simulated learner starts two beats late and closes in with practice. In Try it the dots are yours.':n?`Your last press was ${Math.abs(s.tries[n-1])<.25?'on the beat':Math.abs(s.tries[n-1]).toFixed(1)+' beats '+(s.tries[n-1]<0?'early':'late')}. Counting “1-2-3-4, 2-2-3-4 …” up to eight bars is the standard way to stay oriented, and the fill is a strong cue.`:'With the fill on, the last bar announces itself. Without it you must keep count yourself, which is the skill DJs train.'};
 }});

/* ---------- arrangement ---------- */
const X7_SECT=[['Intro',16,[1,1,0,0,0]],['Build',16,[1,1,1,0,0]],['Main',32,[1,1,1,1,0]],['Break',16,[0,0,0,1,1]],['Drop',32,[1,1,1,1,1]],['Outro',16,[1,1,0,0,0]]];
const X7_LAYERS=[['Kick',C.blue],['Hats',C.amber],['Bass',C.purple],['Lead',C.green],['Pad',C.coral]];
const X7_TOTAL=X7_SECT.reduce((a,b)=>a+b[1],0);
function X7_sectAt(bar){let a=0;for(let i=0;i<X7_SECT.length;i++){if(bar<a+X7_SECT[i][1])return [i,a];a+=X7_SECT[i][1]}return [X7_SECT.length-1,a-X7_SECT[X7_SECT.length-1][1]]}
function X7_playBar(on,cut=900){const st=X7_STEP/1000;AUDIO.stopAll();for(let i=0;i<16;i++){const t=i*st;
 if(on[0]&&i%4===0)X7_V.kick(t);if(on[1]&&i%2===1)X7_V.hat(t);if(on[1]&&i%4===2)X7_V.ohat(t,.04);
 if(on[2]&&i%4===2)X7_V.bass(55,t);if(on[2]&&i===15)X7_V.bass(65.41,t);
 if(on[3]&&[0,3,6,10,12].includes(i))X7_V.lead([220,261.63,220,329.63,196][[0,3,6,10,12].indexOf(i)],t,cut)}
 if(on[4])X7_V.pad(0,16*st)}
SCENE({id:'arrangement',name:'How a track is laid out',tag:'Layers that enter and leave',
 definition:'A techno track is usually arranged by adding and removing layers over time, not by changing chords or melody. Sections are named for what the layers are doing: intro, build, main section, break, drop, outro.',
 example:'The intro is kick and hats alone, so a DJ can mix it in. The break takes the kick away. The drop brings everything back at once.',
 desc:'A timeline of 128 bars with five rows, one each for kick, hats, bass, lead and pad, filled where that layer plays; a cursor picks a bar.',
 research:'Butler (2006), ch. 5 (“the breakdown” and “the build”). · Snoman (2009). · This layout is one common pattern, drawn as an illustration; no real track is reproduced.',
 dur:11,hint:'Slide through the track and press Hear this bar to listen to the layers that are playing there. An original pattern in the style, not a real record.',
 init:()=>({bar:40}),
 watch(p){return {bar:Math.min(X7_TOTAL-1,Math.floor(p*X7_TOTAL))}},
 ui:[{range:'bar',label:'Bar',min:0,max:X7_TOTAL-1,step:1,get:s=>s.bar,act:'bar',show:v=>String(Number(v)+1)},{b:'Hear this bar',act:'hear'}],
 on:{bar(s,v){s.bar=Number(v);return 'keep'},hear(s){X7_playBar(X7_SECT[X7_sectAt(s.bar)[0]][2]);return 'keep'}},
 draw(s){
  const [si]=X7_sectAt(s.bar),sec=X7_SECT[si],x0=96,w=460,bw=w/X7_TOTAL;let out=heading(`${sec[0]}: ${sec[2].map((v,i)=>v?X7_LAYERS[i][0].toLowerCase():null).filter(Boolean).join(', ')}`),a=0;
  X7_SECT.forEach(([name,len,on],i)=>{const x=x0+a*bw;out+=R(x+1,58,len*bw-2,22,i===si?C.ink:'#e3ebf0','none',5)+TF(x+len*bw/2,74,name,12,i===si?'#fff':C.muted);
   on.forEach((v,k)=>{if(v)out+=R(x+1,92+k*34,len*bw-2,24,X7_LAYERS[k][1],'none',5,i===si?'':'opacity=".55"')});a+=len});
  X7_LAYERS.forEach(([n,c],k)=>{out+=TBF(x0-8,109+k*34,n,13,c,'end')});
  const cx=x0+(s.bar+.5)*bw;out+=L(cx,52,cx,262,C.amber,2);
  out+=L(x0,268,x0+w,268,C.line,1.5);for(let b=0;b<=X7_TOTAL;b+=32)out+=L(x0+b*bw,268,x0+b*bw,273,C.line,1.2)+TF(x0+b*bw,288,b===0?'bar 1':String(b),12,C.muted);
  out+=counter(110,300,'section',sec[0],C.ink,120)+counter(245,300,'layers playing',String(sec[2].filter(Boolean).length)+' of 5',C.blue,140)+counter(400,300,'track length',(X7_TOTAL*4*60/X7_BPM/60).toFixed(1)+' min',C.purple,120);
  return {svg:out,phase:si===3?'The break removes the kick and bass and leaves the pad and lead. With the pulse gone, dancers wait for it, which is what makes its return land so hard.':si===4?'The drop: every layer returns on the first beat of a phrase. Nothing here is louder than the main section, but after the break it feels much bigger.':si===0||si===5?'Intros and outros are deliberately bare, usually just drums. They are there for the DJ, who mixes the previous or next record over them.':'Change comes from the texture: which layers are present, and how each is filtered. The harmony may not move at all.'};
 }});

const X7_tension=(bar,nk)=>{const [si,a]=X7_sectAt(bar),u=(bar-a)/X7_SECT[si][1];return [.2,.25+.25*u,.5,nk?.5+.45*u:.5,.45,.3-.1*u][si]};
const X7_cut=bar=>{const [si,a]=X7_sectAt(bar),u=(bar-a)/X7_SECT[si][1];return [300,300+900*u,1200,400*Math.pow(10,u*1.05),4000,800-500*u][si]};
SCENE({id:'arrangement-tension',name:'Tension and release',tag:'The filter is the storyteller',
 definition:'Producers build tension by taking away something the listener expects, usually the kick, and by slowly opening a filter so the sound brightens. Release comes when the kick returns.',
 example:'During a 16-bar break the lead’s filter cutoff climbs from 400 Hz to nearly 4 kHz and a noise riser swells. Then, on beat 1, the kick is back.',
 desc:'A curve of the lead’s filter cutoff across the track and a second curve of expected tension, with the break shaded; removing the kick in the break changes the tension curve.',
 research:'Butler (2006), ch. 5. · Solberg, R. T. & Jensenius, A. R. (2017). Group behaviour and interpersonal synchronization to electronic dance music. Musicae Scientiae (movement changes around break and drop). · The tension curve is this page’s illustration, not measured data.',
 dur:11,hint:'Slide through the track and press Hear to listen to the lead at that point. Switch “kick stays in the break” to hear how little tension is left.',
 init:()=>({bar:70,nk:'out'}),
 watch(p){return {bar:Math.min(X7_TOTAL-1,Math.floor(p*X7_TOTAL)),nk:'out'}},
 ui:[{range:'bar',label:'Bar',min:0,max:X7_TOTAL-1,step:1,get:s=>s.bar,act:'bar',show:v=>String(Number(v)+1)},{choose:[['out','Kick drops out in the break'],['in','Kick stays in']],label:'Break',get:s=>s.nk,act:'nk'},{b:'Hear this bar',act:'hear'}],
 on:{bar(s,v){s.bar=Number(v);return 'keep'},nk(s,v){s.nk=v;return 'keep'},
  hear(s){const [si]=X7_sectAt(s.bar),on=X7_SECT[si][2].slice();if(si===3&&s.nk==='in'){on[0]=1}X7_playBar(on,X7_cut(s.bar));return 'keep'}},
 draw(s){
  const x0=80,w=470,bw=w/X7_TOTAL,y0=250,h=170,[si]=X7_sectAt(s.bar),nk=s.nk==='out',cut=X7_cut(s.bar);
  let out=heading(si===3?(nk?'Break: no kick, filter opening':'Break with the kick left in'):X7_SECT[si][0]),a=0;
  out+=R(x0,y0-h,w,h,'#fff',C.grid,4);
  X7_SECT.forEach(([name,len],i)=>{const x=x0+a*bw;if(i===3)out+=R(x,y0-h,len*bw,h,C.amberp,'none',0);out+=TF(x+len*bw/2,y0+18,name,12,i===si?C.ink:C.muted);if(i)out+=L(x,y0-h,x,y0,C.grid,1);a+=len});
  let d1='',d2='';for(let b=0;b<X7_TOTAL;b++){const x=x0+(b+.5)*bw;d1+=(b?'L':'M')+fmt(x)+' '+fmt(y0-h*X7_tension(b,nk));d2+=(b?'L':'M')+fmt(x)+' '+fmt(y0-h*Math.log10(X7_cut(b)/200)/Math.log10(25))}
  out+=P(d2,C.green,2.2,'none','stroke-dasharray="5 4"')+P(d1,C.coral,2.8);
  const cx=x0+(s.bar+.5)*bw;out+=L(cx,y0-h,cx,y0,C.amber,2)+Ci(cx,y0-h*X7_tension(s.bar,nk),6,C.coral,'#fff');
  out+=L(100,286,124,286,C.coral,3)+TF(130,290,'tension (illustration)',12,C.muted,'start')+L(300,286,324,286,C.green,2.2,'stroke-dasharray="5 4"')+TF(330,290,'lead filter cutoff',12,C.muted,'start');
  out+=counter(140,304,'filter cutoff',cut>=1000?(cut/1000).toFixed(1)+' kHz':Math.round(cut)+' Hz',C.green,140)+counter(320,304,'kick',X7_SECT[si][2][0]||(si===3&&!nk)?'playing':'silent',X7_SECT[si][2][0]||(si===3&&!nk)?C.blue:C.coral,140);
  return {svg:out,phase:si===3?(nk?'With the kick gone the body loses its anchor, and the rising filter says something is coming. Tension climbs until the drop resolves it.':'Leave the kick in and the same filter sweep is just a tone change. Tension needs something taken away first.'):si===4?'The drop releases the tension: the expected kick is back, so the curve falls even though the sound is at its fullest and brightest.':'Outside the break the kick keeps expectation satisfied bar after bar. The filter still moves slowly, which is how a pattern can repeat for minutes without going stale.'};
 }});

const X7_BUILD0=[[1,0,0,0],[1,1,0,0],[1,1,1,0],[1,1,1,1],[0,0,0,1],[0,1,0,1],[1,1,1,1],[1,1,0,0]];
const X7_BLD={ms:()=>X7_STEP,N:()=>128,step(s,i){const slot=Math.floor(i/16),k=i%16,on=s.grid[slot];
 if(on[0]&&k%4===0)X7_V.kick(0);if(on[1]&&k%2===1)X7_V.hat(0);if(on[2]&&k%4===2)X7_V.bass(55,0);
 if(on[3]&&[0,3,6,10,12].includes(k))X7_V.lead([220,261.63,220,329.63,196][[0,3,6,10,12].indexOf(k)],0,1100)}};
SCENE({id:'arrangement-build',name:'Arrange your own',tag:'Eight blocks, four layers',
 definition:'Arranging is deciding which layers play in each block of bars. The same four loops can make a flat track or one with a clear rise, break and return.',
 example:'Add one layer per block for three blocks, strip everything but the lead, then bring all four back together. That is a build, a break and a drop.',
 desc:'A grid of eight blocks by four layers that can be switched on and off, with a bar above each block showing how many layers play and a marker where a drop is detected.',
 research:'Butler (2006), ch. 5. · Snoman (2009). · The “drop” marker is this page’s simple rule: the kick returns with at least three layers after a block without it.',
 dur:11,hint:'Press cells to switch layers on and off, then Play: each block is shortened to one bar. Try to make a break followed by a drop.',
 init:()=>({grid:X7_BUILD0.map(r=>r.slice()),playing:false,pos:-1}),
 watch(p){const n=Math.floor(p*9);return {grid:X7_BUILD0.map((r,i)=>i<n?r.slice():[0,0,0,0]),playing:false,pos:-1,sim:true}},
 ui:[{b:'Play / stop',act:'play'},{b:'Clear',act:'clear'},{b:'Example',act:'ex'}],
 on:X7_loopOn(X7_BLD,{cell(s,v){const [a,b]=String(v).split('.').map(Number);s.grid=s.grid.map((r,i)=>i===a?r.map((x,k)=>k===b?1-x:x):r);return 'keep'},
  clear(s){s.grid=X7_BUILD0.map(()=>[0,0,0,0]);return 'keep'},ex(s){s.grid=X7_BUILD0.map(r=>r.slice());return 'keep'}}),
 draw(s,f,X){
  const pos=X.try?(s.playing?Math.floor(s.pos/16):-1):-1,x0=110,cw=54;let drops=[];
  s.grid.forEach((r,i)=>{if(i&&!s.grid[i-1][0]&&r[0]&&sum(r)>=3)drops.push(i)});
  let out=heading(drops.length?`Drop at block ${drops.map(d=>d+1).join(' and ')}`:'No drop yet: take the kick out, then bring it back');
  s.grid.forEach((r,i)=>{const x=x0+i*cw,n=sum(r);out+=R(x+8,96-n*9,cw-20,n*9,drops.includes(i)?C.coral:'#b9cbd6','none',3)+TF(x+cw/2-2,112,String(i+1),12,i===pos?C.amber:C.muted);
   r.forEach((v,k)=>{out+=hit(X,'cell',i+'.'+k,`Block ${i+1}, ${X7_LAYERS[k][0]}: ${v?'on':'off'}. Press to switch.`,R(x+2,122+k*38,cw-8,30,v?X7_LAYERS[k][1]:'#fff',i===pos?C.amber:v?'none':C.grid,6))});
   if(drops.includes(i))out+=TBF(x+cw/2-2,52,'drop',12,C.coral)});
  X7_LAYERS.slice(0,4).forEach(([n,c],k)=>{out+=TBF(x0-8,142+k*38,n,13,c,'end')});
  out+=TF(x0-8,90,'layers',12,C.muted,'end');
  const hasBreak=s.grid.some((r,i)=>i>0&&!r[0]&&sum(r)>0&&s.grid[i-1][0]);
  out+=counter(120,290,'blocks with a kick',String(s.grid.filter(r=>r[0]).length)+' of 8',C.blue,150)+counter(290,290,'break',hasBreak?'yes':'none',hasBreak?C.green:C.muted,100)+counter(410,290,'drops',String(drops.length),drops.length?C.coral:C.muted,100);
  out+=T(300,362,s.sim?'Example arrangement, block by block':'Each block stands for 8 or 16 bars.',15,C.ink);
  return {svg:out,phase:drops.length?'Your arrangement has a moment where the kick returns with most of the layers after a block without it. Listeners hear that as the drop, even though no layer is new.':hasBreak?'There is a break, but the kick comes back alone or with too little. Bring three or four layers back together for the return to feel like a drop.':'With the kick in every block the track is steady and functional, which is exactly what some minimal techno wants. Contrast needs an absence.'};
 }});
