/* ===================== Music era 1 · Sound and number (antiquity) ===================== */
// Shared helpers for this era (prefix M1_).
const M1_cents=r=>1200*Math.log2(r);
const M1_f2=v=>v>=100?v.toFixed(0):v.toFixed(1);
// A waveform: fn(t) for t in seconds over [0, span], drawn in the box (x, y, w, h) with values in [-1, 1].
function M1_wave(x,y,w,h,span,fn,col=C.blue,width=2.2,n=420){
 let d='';for(let i=0;i<=n;i++){const t=span*i/n,v=clamp(fn(t),-1.2,1.2);d+=(i?'L':'M')+fmt(x+w*i/n)+' '+fmt(y+h/2-v*h/2*0.9)}
 return P(d,col,width);
}
// Log-frequency axis from lo to hi Hz; returns x for a frequency.
const M1_logX=(x,w,lo,hi)=>f=>x+w*Math.log(f/lo)/Math.log(hi/lo);
// A small piano keyboard from MIDI lo to hi (whole octaves from C). hl: set of MIDI numbers to tint; act: hit act name.
function M1_keyboard(X,x,y,w,h,lo,hi,hl,act,lit){
 const whites=[];for(let m=lo;m<=hi;m++)if(![1,3,6,8,10].includes(((m%12)+12)%12))whites.push(m);
 const ww=w/whites.length;let out='',blacks='';
 whites.forEach((m,i)=>{const on=hl&&hl.has(m),isLit=lit===m;
  const inner=R(x+i*ww,y,ww-2,h,isLit?C.amber:on?C.pale:'#fff',on?C.blue:C.line,4)+(m%12===0?TF(x+i*ww+ww/2-1,y+h-8,noteName(m),13,C.muted):'');
  out+=act?hit(X,act,m,`${noteName(m)}, ${M1_f2(midiHz(m))} hertz`,inner):inner});
 whites.forEach((m,i)=>{const b=m+1;if(b>hi||![1,3,6,8,10].includes(((b%12)+12)%12))return;const on=hl&&hl.has(b),isLit=lit===b;
  const inner=R(x+(i+1)*ww-ww*.32-1,y,ww*.62,h*.6,isLit?C.amber:on?C.blue:C.dark,on?C.blue:C.dark,3);
  blacks+=act?hit(X,act,b,`${noteName(b)}, ${M1_f2(midiHz(b))} hertz`,inner):inner});
 return out+blacks;
}
const M1_sing=(hz,o={})=>AUDIO.tone(hz,{dur:.9,type:'triangle',gain:.14,...o});

/* ---------------- Lesson: pitch and frequency ---------------- */
SCENE({id:'pitch-frequency',name:'Pitch and frequency',tag:'How fast it shakes',
 definition:'Pitch is how high or low a sound seems. It follows frequency: how many times each second the air pressure swings back and forth, measured in hertz (Hz).',
 example:'Concert A is 440 Hz: the air at your ear pushes and pulls 440 times a second. Twice as fast, 880 Hz, sounds like the same note an octave higher.',
 research:'Mersenne, M. (1636). Harmonie universelle — first measurements of string frequencies. Hertz as the unit: adopted by the IEC in 1930.',
 desc:'A pressure waveform over 20 milliseconds beside a log-scale frequency bar marked with the piano’s range; the note name and frequency are shown above.',
 dur:9,hint:'Slide through the notes and press Play. Watch the number of waves in 20 ms rise with the pitch.',
 init:()=>({m:57}),
 watch(p){return {m:Math.round(33+smooth(p)*60)}},
 ui:[{range:'m',label:'Note',min:33,max:96,get:s=>s.m,act:'m',show:v=>noteName(v)+' · '+M1_f2(midiHz(v))+' Hz'},{b:'Play',act:'play',aria:'Play this note'}],
 on:{m(s,v){s.m=v;return 'keep'},play(s){M1_sing(midiHz(s.m));return 'keep'}},
 draw(s){
  const hz=midiHz(s.m),span=.02;let out=heading(`${noteName(s.m)} = ${M1_f2(hz)} Hz: ${M1_f2(hz)} swings every second`);
  out+=R(40,52,520,150,'#fff',C.grid,10);
  out+=M1_wave(48,58,504,138,span,t=>Math.sin(2*Math.PI*hz*t));
  out+=L(48,212,552,212,C.line,1.5)+TF(48,230,'0 ms',13,C.muted,'start')+TF(552,230,'20 ms',13,C.muted,'end')+T(300,230,`${M1_f2(hz*span)} waves in 20 ms`,15,C.ink);
  const X=M1_logX(60,480,20,8000);
  out+=L(60,300,540,300,C.line,3)+R(X(27.5),292,X(4186)-X(27.5),16,C.pale,C.blue,4)+TF((X(27.5)+X(4186))/2,326,'piano: 27.5 to 4186 Hz',13,C.blue);
  for(const f of [20,100,1000,8000])out+=L(X(f),296,X(f),304,C.muted,1.5)+TF(X(f),282,f>=1000?f/1000+' kHz':f+' Hz',13,C.muted);
  out+=`<polygon points="${fmt(X(hz))},288 ${fmt(X(hz)-8)},270 ${fmt(X(hz)+8)},270" fill="${C.coral}"/>`;
  out+=T(300,360,'Frequency axis is logarithmic: each octave gets the same width.',14,C.muted);
  return {svg:out,phase:`At ${M1_f2(hz)} Hz the air pressure rises and falls ${M1_f2(hz)} times a second. Higher frequency means more waves squeezed into the same 20 ms, and a higher pitch.`};
 }});

SCENE({id:'pitch-frequency-octave',name:'The octave doubles',tag:'Equal steps for the ear, doubling for the air',
 definition:'An octave is a doubling of frequency. Notes an octave apart sound so alike that they share a letter name.',
 example:'A1 = 55 Hz, A2 = 110, A3 = 220, A4 = 440, A5 = 880. On a straight hertz ruler the A’s bunch up at the left; on the ear’s ruler they are evenly spaced.',
 research:'Octave equivalence is found across many musical cultures, though not universally: Jacoby et al. (2019), Current Biology, found the Tsimane’ in Bolivia did not treat octaves as equivalent.',
 desc:'Two rulers: a linear hertz ruler where the A notes bunch towards the left, and a logarithmic ruler where the same A notes are evenly spaced; arrows mark each doubling.',
 dur:10,hint:'Press an A on either ruler to hear it, or play all six in turn. In 3D the pitch helix stacks the same letter vertically.',
 init:()=>({sel:3,shown:6}),
 watch(p){return {sel:Math.min(5,Math.floor(p*6)),shown:1+Math.min(5,Math.floor(p*6))}},
 ui:[{b:'Play A1 to A6',act:'all'}],
 on:{pick(s,i){s.sel=Number(i);M1_sing(55*2**s.sel);return 'keep'},all(s){AUDIO.seq(range(6).map(i=>({hz:55*2**i,at:i*.45,dur:.4})),{type:'triangle',gain:.13});return 'keep'}},
 draw(s,f,X){
  let out=heading('Each octave doubles the frequency');
  const lin=f=>50+500*f/1800,lg=M1_logX(50,500,55*.85,1760*1.15);
  out+=TB(50,72,'Hertz ruler (linear)',14,C.muted,'start')+L(50,110,550,110,C.line,3);
  for(const v of [0,500,1000,1500])out+=L(lin(v),104,lin(v),116,C.muted,1.5)+TF(lin(v),132,v+' Hz',13,C.muted);
  out+=TB(50,192,'Ear’s ruler (logarithmic)',14,C.muted,'start')+L(50,230,550,230,C.line,3);
  for(let i=0;i<6;i++){if(i>=s.shown)continue;const hz=55*2**i,on=i===s.sel;
   const a=Ci(lin(hz),110,on?10:7,on?C.coral:C.blue),b=Ci(lg(hz),230,on?12:9,on?C.coral:C.blue)+TB(lg(hz),262,'A'+(i+1),15,on?C.coral:C.ink)+TF(lg(hz),282,hz+' Hz',13,C.muted);
   out+=hit(X,'pick',i,`A${i+1}, ${hz} hertz`,a)+hit(X,'pick',i,`A${i+1}, ${hz} hertz`,b);
   if(i>0)out+=curveArrow(lg(hz/2)+12,214,lg(hz)-12,214,-14,C.green,1.8)+TF((lg(hz/2)+lg(hz))/2,192+(i%2?0:-12)+12,'×2',13,C.green);
  }
  out+=T(300,330,'Same distance on the ear’s ruler = same ratio of frequencies',15,C.ink);
  out+=T(300,356,'(the hertz gaps double: 55, 110, 220, 440, 880…)',14,C.muted);
  return {svg:out,phase:`A${s.sel+1} is ${55*2**s.sel} Hz. Every A is double the one below, so on the hertz ruler they spread out, while to the ear each octave is the same-sized step.`};
 },
 three(s,f,X,project){
  // Pitch helix: chroma goes round, height rises one turn per octave.
  const pt=m=>{const a=2*Math.PI*((m%12)/12),h=(m-33)/12;return [Math.cos(a)*1.6,Math.sin(a)*1.6,h*1.1]};
  const all=range(48).map(i=>33+i),P=project([[-2,-2,0],[2,2,4.6]]);let out='',d='';
  all.forEach((m,i)=>{const q=P(pt(m));d+=(i?'L':'M')+fmt(q[0])+' '+fmt(q[1])});out+=P_path(d);
  function P_path(dd){return `<path d="${dd}" fill="none" stroke="${C.line}" stroke-width="1.6"/>`}
  out+=line3([0,0,0],[0,0,4.6],P,'#dbe5ec',1.5);
  out+=sortedItems(all.map(m=>({at:pt(m),svg:P=>{const q=P(pt(m)),isA=m%12===9,on=isA&&Math.round((m-33)/12)===s.sel;return Ci(q[0],q[1],isA?(on?10:8):4,isA?(on?C.coral:C.blue):'#9ab0bf')+(isA?TF(q[0]+14,q[1]+4,'A'+(Math.floor(m/12)-1),13,on?C.coral:C.ink,'start'):'')}})),P);
  return {svg:out,title:'Pitch helix',caption:'Going once round the helix climbs one octave, so every A sits directly above the last: same letter, same direction, higher up. This is why octaves feel like the same note.'};
 }});

SCENE({id:'pitch-frequency-range',name:'The range of hearing',tag:'From 20 Hz to 20 kHz, and shrinking',
 definition:'Young people hear roughly from 20 Hz to 20,000 Hz. Musical notes sit mostly in the lower part of that range; higher frequencies give brightness and detail.',
 example:'A piano runs from 27.5 Hz to 4,186 Hz. Telephones long carried only about 300–3,400 Hz, yet speech stayed understandable because what matters most lies inside that band.',
 research:'ISO 7029 (2017). Acoustics — Statistical distribution of hearing thresholds related to age and gender. Telephone band: ITU-T G.712.',
 desc:'A logarithmic ruler from 20 Hz to 20 kHz with the band of hearing, the piano, typical singing voices and the telephone band, a marker for the chosen frequency, and the upper limit for a chosen age.',
 dur:9,hint:'Move the frequency and press Play (gently: very high tones can be uncomfortable). Change the age to see how the upper limit typically falls.',
 init:()=>({i:55,age:20}),
 watch(p){return {i:Math.round(100*p),age:Math.round(20+p*50)}},
 ui:[{range:'i',label:'Frequency',min:0,max:100,get:s=>s.i,act:'i',show:v=>M1_f2(20*1000**(v/100))+' Hz'},{range:'age',label:'Age',min:10,max:80,step:5,get:s=>s.age,act:'age',show:v=>v+' years'},{b:'Play',act:'play'}],
 on:{i(s,v){s.i=v;return 'keep'},age(s,v){s.age=v;return 'keep'},play(s){const hz=20*1000**(s.i/100);AUDIO.tone(hz,{dur:.8,gain:hz>6000||hz<60?.07:.12});return 'keep'}},
 draw(s){
  const hz=20*1000**(s.i/100),X=M1_logX(50,500,20,20000),up=clamp(20000-(s.age>20?(s.age-20)*190:0),6000,20000);
  let out=heading('What we hear, and what music uses');
  out+=R(X(20),70,X(up)-X(20),34,C.greenp,C.green,6)+R(X(up),70,X(20000)-X(up),34,'#f2f4f5',C.grid,6)+TB(X(20)+8,92,'hearing at age '+s.age,14,C.green,'start');
  const bands=[['piano',27.5,4186,C.blue],['singing voices',82,1050,C.purple],['telephone band',300,3400,C.amber]];
  bands.forEach(([n,a,b,col],k)=>{const y=126+k*44;out+=R(X(a),y,X(b)-X(a),26,col,'none',6,'opacity=".85"')+TF(X(b)+8,y+18,n,13,col,'start')});
  for(const v of [20,50,100,200,500,1000,2000,5000,10000,20000])out+=L(X(v),262,X(v),270,C.muted,1.5)+TF(X(v),288,v>=1000?v/1000+'k':String(v),13,C.muted);
  out+=L(50,266,550,266,C.line,2)+TF(300,306,'hertz (logarithmic)',13,C.muted);
  out+=L(X(hz),66,X(hz),262,C.coral,2.5)+TB(X(hz),340,M1_f2(hz)+' Hz',17,C.coral);
  out+=T(300,366,hz>up?'Above the typical limit for this age':'Within typical hearing for this age',14,hz>up?C.coral:C.green);
  return {svg:out,phase:`The upper limit drawn for age ${s.age} (${Math.round(up/1000)} kHz) is a rough illustrative guide: hearing varies widely, and ISO 7029 describes the spread, not a single cut-off.`};
 }});

/* ---------------- Lesson: the monochord ---------------- */
const M1_MONO=[[1/2,'octave','1 : 2'],[2/3,'perfect fifth','2 : 3'],[3/4,'perfect fourth','3 : 4'],[4/5,'major third','4 : 5'],[8/9,'whole tone','8 : 9'],[3/5,'major sixth','3 : 5']];
const M1_F0=196; // G3: the whole open string
function M1_named(r){const c=M1_cents(1/r);let best=null;for(const [q,n,l] of M1_MONO){const d=Math.abs(M1_cents(1/q)-c);if(d<6&&(!best||d<best.d))best={n,l,d}}return best}
function M1_string(x1,x2,y,amp,loops,col=C.ink,w=2.5){let d='';const n=80;for(let i=0;i<=n;i++){const u=i/n;d+=(i?'L':'M')+fmt(x1+(x2-x1)*u)+' '+fmt(y-amp*Math.sin(Math.PI*loops*u))}return P(d,col,w)}
SCENE({id:'monochord',name:'The monochord',tag:'One string, many intervals',
 definition:'A monochord is a single string over a sound box with a movable bridge. Stopping the string at simple fractions of its length gives the intervals that sound most consonant.',
 example:'Stop the string at half its length and that half sounds an octave above the whole. At two-thirds you hear a perfect fifth; at three-quarters, a perfect fourth.',
 research:'Boethius (c. 510). De institutione musica, retelling Pythagorean teaching; Nicomachus of Gerasa (2nd century). Manual of Harmonics. Attribution to Pythagoras himself is legendary.',
 desc:'A long string with a movable bridge; the stopped part vibrates beside the open string, with lengths, frequencies and the interval between them.',
 dur:11,hint:'Slide the bridge, or choose a ratio, then press Pluck both to hear the open string and the stopped part together.',
 init:()=>({r:2/3}),
 watch(p){const k=Math.min(2,Math.floor(p*3)),u=smooth(clamp((p*3-k)*2.2,0,1)),from=k?M1_MONO[k-1][0]:.9,to=M1_MONO[k][0];return {r:lerp(from,to,u)}},
 ui:[{range:'r',label:'Bridge at',min:40,max:95,get:s=>Math.round(s.r*100),act:'r',show:v=>v+'% of the length'},{choose:[['0.5','1 : 2'],['0.667','2 : 3'],['0.75','3 : 4'],['0.8','4 : 5']],label:'Ratio',get:s=>String(+s.r.toFixed(3)),act:'pick'},{b:'Pluck both',act:'play'}],
 on:{r(s,v){s.r=v/100;return 'keep'},pick(s,v){s.r=Number(v);if(Math.abs(s.r-.667)<.001)s.r=2/3;return 'keep'},play(s){AUDIO.chord([M1_F0,M1_F0/s.r],{dur:1.4,type:'triangle',gain:.2});return 'keep'}},
 draw(s,f,X){
  const x1=60,x2=540,xb=x1+(x2-x1)*s.r,hz=M1_F0/s.r,nm=M1_named(s.r),ph=X.try?1:Math.cos(X.p*40);
  let out=heading('Stop the string, shorten the vibrating length');
  out+=R(40,236,520,40,'#e8d7b0','#c7a96b',8)+TF(300,262,'sound box',13,'#7a5a1d');
  out+=TB(x1,96,'open string',14,C.muted,'start')+M1_string(x1,x2,126,9*ph,1,C.ink,2.2)+L(x1,112,x1,140,C.dark,4)+L(x2,112,x2,140,C.dark,4);
  out+=M1_string(x1,xb,196,12*ph,1,C.blue,3)+L(xb,206,xb,232,C.coral,5)+`<polygon points="${fmt(xb)},206 ${fmt(xb-9)},226 ${fmt(xb+9)},226" fill="${C.coral}"/>`+L(xb,196,x2,196,C.line,2,'stroke-dasharray="4 4"')+L(x1,182,x1,210,C.dark,4);
  out+=TF((x1+xb)/2,176,`${Math.round(s.r*100)}% of the length`,13,C.blue)+TF(xb+8,222,'bridge',13,C.coral,'start');
  out+=counter(60,292,'open string',M1_f2(M1_F0)+' Hz',C.ink,150)+counter(225,292,'stopped part',M1_f2(hz)+' Hz',C.blue,150)+counter(390,292,'interval',Math.round(M1_cents(1/s.r))+' cents',C.coral,150);
  out+=T(300,362,nm?`${nm.l} of the length: a ${nm.n}`:'Not a simple ratio: the two notes clash more',15,nm?C.green:C.muted);
  return {svg:out,phase:`Half the length vibrates twice as fast. Here the stopped part is ${Math.round(s.r*100)}% of the string, so its frequency is ${(1/s.r).toFixed(3)} times higher.${nm?' That is the '+nm.n+'.':''}`};
 }});

SCENE({id:'monochord-ratios',name:'Six, eight, nine, twelve',tag:'The Pythagorean numbers',
 definition:'Divide a string into 12 equal parts. Lengths of 12, 9, 8 and 6 parts give the open note, a fourth, a fifth and an octave: the ratios 3:4, 2:3 and 1:2.',
 example:'12 : 6 = 2 : 1 is the octave; 12 : 8 = 3 : 2 the fifth; 12 : 9 = 4 : 3 the fourth. And 9 : 8, the gap between fourth and fifth, became the whole tone.',
 research:'Nicomachus of Gerasa (2nd century). Manual of Harmonics, ch. 6; Boethius (c. 510). De institutione musica, book 1.',
 desc:'A string ruled into 12 equal parts with stops at 9, 8 and 6 parts; each stop is labelled with its ratio and interval, and the whole tone 9:8 appears between the fourth and fifth.',
 dur:10,hint:'Press a stop on the string (or a ratio chip) to hear it with the open string.',
 init:()=>({k:2}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 on:{pick(s,k){s.k=Number(k);const L=[12,9,8,6][s.k];AUDIO.chord([M1_F0,M1_F0*12/L],{dur:1.3,type:'triangle',gain:.2});return 'keep'}},
 draw(s,f,X){
  let out=heading('Twelve equal parts of one string');const x0=60,w=480,u=w/12,lens=[12,9,8,6],names=['open string','perfect fourth','perfect fifth','octave'],rat=['1 : 1','4 : 3','3 : 2','2 : 1'];
  out+=L(x0,100,x0+w,100,C.ink,3);for(let i=0;i<=12;i++)out+=L(x0+i*u,92,x0+i*u,108,C.line,1.5)+(i%3===0?TF(x0+i*u,84,String(12-i),13,C.muted):'');
  out+=TF(x0-6,104,'',13);
  lens.forEach((Lg,i)=>{const y=150+i*48,on=i===s.k,xr=x0+(12-Lg)*u;
   const inner=R(x0,y-16,w,34,on?C.amberp:'#fff',on?C.amber:C.grid,8)+R(xr,y-10,Lg*u,22,on?C.blue:C.pale,'none',5)+TB(x0+10,y+6,`${Lg} parts`,14,on?C.ink:C.muted,'start')+TB(x0+w-10,y+6,`${rat[i]} · ${names[i]}`,14,on?C.coral:C.ink,'end');
   out+=hit(X,'pick',i,`${Lg} parts: ${names[i]}`,inner)});
  out+=T(300,352,'Between the fourth (9) and the fifth (8): 9 : 8, the whole tone',15,C.green);
  return {svg:out,phase:`A stopped length of ${lens[s.k]} parts against the open 12 gives ${rat[s.k]}: the ${names[s.k]}. Simple whole numbers, simple sounds — the observation at the root of Greek music theory.`};
 }});

SCENE({id:'monochord-hammers',name:'The blacksmith’s hammers',tag:'A legend put to the test',
 definition:'A famous story says Pythagoras heard hammers in a smithy sounding in harmony and found their weights in the ratios 12, 9, 8 and 6. The story cannot be true as told.',
 example:'Hang weights of 12 and 6 on two equal strings: you get not an octave but about 600 cents, because frequency grows with the square root of tension. You need 4 : 1 to get an octave.',
 research:'Nicomachus (2nd century). Manual of Harmonics, ch. 6, tells the smithy story; Vincenzo Galilei (1589) and Mersenne (1636) showed frequency ∝ √tension, so the weights story fails.',
 desc:'Three tests of the ratio 2:1 — hammers by weight, weights hanging on strings, and string lengths — each with the interval the legend predicts and what physics actually gives.',
 dur:10,hint:'Choose a test and press Play to hear what the 2 : 1 pair really gives.',
 init:()=>({t:'weights'}),
 watch(p){return {t:['hammers','weights','lengths'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['hammers','Hammers'],['weights','Weights on strings'],['lengths','String lengths']],label:'Test',get:s=>s.t,act:'t'},{b:'Play the pair',act:'play'}],
 on:{t(s,v){s.t=v;return 'keep'},play(s){if(s.t==='lengths')AUDIO.chord([M1_F0,2*M1_F0],{dur:1.3,type:'triangle'});else if(s.t==='weights')AUDIO.chord([M1_F0,M1_F0*Math.SQRT2],{dur:1.3,type:'triangle'});else{AUDIO.noise({dur:.12,gain:.14});AUDIO.tone(1230,{dur:.5,gain:.07});AUDIO.tone(1710,{dur:.5,gain:.06,at:.02})}return 'keep'}},
 draw(s){
  let out=heading('Does a 2 : 1 ratio always give an octave?');
  const rows={hammers:['Hammers weighing 12 and 6','octave','no single answer','A struck hammer rings at frequencies set by its shape and material, not simply its weight.'],
   weights:['Weights 12 and 6 stretching equal strings','octave','√2 : 1 ≈ 600 cents','Frequency ∝ √tension, so doubling the weight raises the pitch by only √2.'],
   lengths:['Equal strings, lengths 12 and 6','octave','2 : 1 = 1200 cents ✓','Frequency ∝ 1/length: halve the string, double the frequency.']};
  const r=rows[s.t];
  if(s.t==='hammers'){out+=R(130,90,120,40,C.dark,'none',6)+L(190,130,190,190,'#7a5a1d',8)+TF(190,212,'12',15,C.ink)+R(360,100,70,28,C.dark,'none',6)+L(395,128,395,190,'#7a5a1d',7)+TF(395,212,'6',15,C.ink)}
  else if(s.t==='weights'){out+=L(150,70,150,190,C.ink,2.5)+R(130,190,40,46,C.dark,'none',4)+TF(150,258,'12',15,C.ink)+L(400,70,400,190,C.ink,2.5)+R(386,190,28,30,C.dark,'none',4)+TF(400,242,'6',15,C.ink)+L(110,70,450,70,C.dark,4)}
  else{out+=L(80,150,520,150,C.ink,2.5)+TF(300,136,'12',15,C.ink)+L(80,200,300,200,C.blue,2.5)+TF(190,186,'6',15,C.blue)}
  out+=R(40,268,250,70,'#fff',C.grid,8)+TF(165,290,'the legend predicts',13,C.muted)+TB(165,320,r[1],17,C.muted)+R(310,268,250,70,'#fff',C.green,8)+TF(435,290,'physics gives',13,C.muted)+TB(435,320,r[2],17,s.t==='lengths'?C.green:C.coral);
  out+=T(300,362,r[0],14,C.ink);
  return {svg:out,phase:r[3]+' The smithy story is a legend; the ratios really belong to string lengths, which is what the monochord measures.'};
 }});

/* ---------------- Lesson: the harmonic series ---------------- */
SCENE({id:'harmonic-series',name:'The harmonic series',tag:'One string, many frequencies at once',
 definition:'A string fixed at both ends can vibrate in 1, 2, 3, … equal loops. Loop n vibrates at n times the lowest frequency; together these are the harmonic series.',
 example:'On a 110 Hz string, harmonic 2 is 220 Hz (an octave up), 3 is 330 Hz (a fifth above that), 4 is 440 Hz (two octaves up). A real pluck sounds many of them at once.',
 research:'Sauveur, J. (1701). Système général des intervalles des sons — named harmonics and nodes; Mersenne (1636) heard them in a single string.',
 desc:'A string vibrating in n loops with nodes marked, its frequency n × 110 Hz, and a strip of the first eight harmonics with the current one lit.',
 dur:10,hint:'Choose a harmonic and press Play, or play 1 to n in turn and hear the series climb.',
 init:()=>({n:3}),
 watch(p){return {n:1+Math.min(7,Math.floor(p*8))}},
 ui:[{range:'n',label:'Harmonic',min:1,max:8,get:s=>s.n,act:'n'},{b:'Play',act:'play'},{b:'Play 1 to n',act:'climb'}],
 on:{n(s,v){s.n=v;return 'keep'},play(s){M1_sing(110*s.n);return 'keep'},climb(s){AUDIO.seq(range(s.n).map(i=>({hz:110*(i+1),at:i*.42,dur:.4})),{type:'sine',gain:.15});return 'keep'}},
 draw(s,f,X){
  const ph=X.try?1:Math.cos(X.p*60);let out=heading(`Harmonic ${s.n}: ${s.n} loop${s.n>1?'s':''}, ${110*s.n} Hz`);
  out+=L(60,96,60,184,C.dark,5)+L(540,96,540,184,C.dark,5);
  out+=M1_string(60,540,140,34*ph,s.n,C.blue,3)+M1_string(60,540,140,-34*ph,s.n,C.line,1.5);
  for(let k=1;k<s.n;k++)out+=Ci(60+480*k/s.n,140,5,C.coral);
  out+=TF(300,206,s.n>1?`${s.n-1} node${s.n>2?'s':''} (red): points that never move`:'only the ends stay still',13,C.coral);
  for(let k=1;k<=8;k++){const x=60+(k-1)*61,on=k===s.n;out+=R(x,236,56,62,on?C.blue:'#fff',on?C.blue:C.grid,8)+TB(x+28,260,String(k),17,on?'#fff':C.ink)+TF(x+28,284,110*k+' Hz',13,on?'#fff':C.muted)}
  out+=T(300,334,'Frequencies 1×, 2×, 3×, 4×… the lowest: the series is evenly spaced in hertz',14,C.ink);
  out+=T(300,358,'(so the musical gaps between harmonics shrink as you go up)',13,C.muted);
  return {svg:out,phase:`Harmonic ${s.n} fits ${s.n} half-waves on the string, so its wavelength is 1/${s.n} as long and its frequency ${s.n} times higher: ${110*s.n} Hz.`};
 }});

SCENE({id:'harmonic-series-notes',name:'Harmonics as notes',tag:'Close to the keyboard, but not exactly',
 definition:'The harmonics of a low note land near notes of the scale, but some miss by a lot. The distance is measured in cents: 100 cents per equal-tempered semitone.',
 example:'Over C2 (65.4 Hz), harmonic 5 is about 14 cents flat of E, harmonic 7 is 31 cents flat of B♭, and harmonic 11 falls almost exactly between F and F♯.',
 research:'Ellis, A. J. (1885). On the musical scales of various nations — introduced the cent; Helmholtz, H. (1863). Die Lehre von den Tonempfindungen.',
 desc:'Sixteen cards for the harmonics of C2, each with its frequency, the nearest note and how many cents sharp or flat it is, coloured by how far it misses.',
 dur:11,hint:'Press any harmonic to hear it above the fundamental. Watch the cents: 0 is an exact match with the piano.',
 init:()=>({sel:7}),
 watch(p){return {sel:1+Math.min(15,Math.floor(p*16))}},
 on:{pick(s,n){s.sel=Number(n);AUDIO.chord([65.41,65.41*s.sel],{dur:1.2,type:'sine',gain:.2});return 'keep'}},
 draw(s,f,X){
  let out=heading('Harmonics of C2 (65.4 Hz) against the piano');
  for(let n=1;n<=16;n++){const i=n-1,x=28+(i%8)*69,y=60+Math.floor(i/8)*126,mid=36+12*Math.log2(n),near=Math.round(mid),dev=(mid-near)*100,on=n===s.sel;
   const col=Math.abs(dev)<10?C.green:Math.abs(dev)<30?C.amber:C.coral;
   const inner=R(x,y,64,112,on?C.amberp:'#fff',on?C.amber:C.grid,8)+TB(x+32,y+24,'n = '+n,14,C.ink)+TF(x+32,y+46,M1_f2(65.41*n),13,C.muted)+TF(x+32,y+62,'Hz',13,C.muted)+TB(x+32,y+84,noteName(near),15,C.ink)+TBF(x+32,y+104,(dev>=0?'+':'−')+Math.abs(dev).toFixed(0)+'¢',14,col);
   out+=hit(X,'pick',n,`Harmonic ${n}: ${noteName(near)}, ${dev.toFixed(0)} cents`,inner)}
  const n=s.sel,mid=36+12*Math.log2(n),near=Math.round(mid),dev=(mid-near)*100;
  out+=T(300,330,`Harmonic ${n} = ${M1_f2(65.41*n)} Hz, ${Math.abs(dev).toFixed(1)} cents ${dev>=0?'sharp of':'flat of'} ${noteName(near)}`,16,C.ink);
  out+=T(300,356,'green: within 10¢ · amber: 10–30¢ · red: more than 30¢',13,C.muted);
  return {svg:out,phase:`Powers of 2 (1, 2, 4, 8, 16) are exact octaves. Harmonic 3 is 2 cents sharp of G; harmonic 7, 31 cents flat of B♭, is one reason the "natural seventh" sounds bluesy to some ears and out of tune to others.`};
 }});

const M1_PRESETS={sine:[1,0,0,0,0,0,0,0],bright:[1,1/2,1/3,1/4,1/5,1/6,1/7,1/8],hollow:[1,0,1/3,0,1/5,0,1/7,0],mellow:[1,1/4,1/9,1/16,1/25,1/36,1/49,1/64]};
SCENE({id:'harmonic-series-build',name:'Building a tone',tag:'Mix the harmonics',
 definition:'Every steady musical tone can be built by adding harmonics in different strengths. The mix decides the shape of the wave and much of the tone’s character.',
 example:'Harmonics in strengths 1, ½, ⅓, ¼… make a bright, buzzy sawtooth; odd harmonics only (1, ⅓, ⅕…) give the hollow sound associated with a clarinet’s low register.',
 research:'Fourier, J. (1822). Théorie analytique de la chaleur; Helmholtz, H. (1863) applied it to musical tone. (The full story of timbre is in era 5.)',
 desc:'Eight bars for the strengths of harmonics 1 to 8 above the waveform they add up to over two cycles, with preset mixes.',
 dur:11,hint:'Press a bar to step its strength (off, quarter, half, full), or pick a preset, then press Play to hear the mix.',
 init:()=>({a:M1_PRESETS.bright.slice()}),
 watch(p){const k=1+Math.min(7,Math.floor(p*8));return {a:M1_PRESETS.bright.map((v,i)=>i<k?v:0)}},
 ui:[{choose:[['sine','Pure'],['bright','Bright'],['hollow','Hollow'],['mellow','Mellow']],label:'Preset',get:s=>s.p||'',act:'pre'},{b:'Play',act:'play'}],
 on:{pre(s,v){s.a=M1_PRESETS[v].slice();s.p=v;return 'keep'},bar(s,i){i=Number(i);const steps=[0,.25,.5,1];const k=steps.findIndex(v=>Math.abs(v-s.a[i])<.01);s.a[i]=steps[(k+1)%4];s.p='';return 'keep'},play(s){AUDIO.tone(146.83,{dur:1.3,gain:.18,partials:s.a.map(v=>v)});return 'keep'}},
 draw(s,f,X){
  let out=heading('Add harmonics, change the wave');const amps=s.a,mx=Math.max(1e-6,...amps.map(Math.abs));
  amps.forEach((v,i)=>{const x=60+i*58,h=110*v;out+=hit(X,'bar',i,`Harmonic ${i+1}: strength ${v.toFixed(2)}`,R(x,70,44,120,'#fff',C.grid,6)+R(x+4,186-h,36,h,C.blue,'none',4))+TF(x+22,208,String(i+1),13,C.muted)});
  out+=TF(60+4*58-7,228,'harmonic number',13,C.muted);
  const norm=sum(amps.map(Math.abs))||1;
  out+=R(40,244,520,104,'#fff',C.grid,10)+M1_wave(48,250,504,92,2,t=>sum(amps.map((a,k)=>a*Math.sin(2*Math.PI*(k+1)*t)))/norm*1.6,C.coral,2.4);
  out+=TF(300,366,'two cycles of the summed wave',13,C.muted);
  const used=amps.filter(v=>v>0).length;
  return {svg:out,phase:`${used} harmonic${used===1?'':'s'} switched on. The pitch stays the same (the repetition rate of the fundamental); only the shape of each cycle, and the colour of the sound, changes.`};
 }});

/* ---------------- Lesson: consonant ratios ---------------- */
const M1_RAT=[[2,1,'octave'],[3,2,'perfect fifth'],[4,3,'perfect fourth'],[5,4,'major third'],[6,5,'minor third'],[5,3,'major sixth'],[16,15,'minor second'],[45,32,'tritone']];
SCENE({id:'consonant-ratios',name:'Simple ratios, regular waves',tag:'Why some pairs blend',
 definition:'When two notes are in a simple frequency ratio, their combined wave repeats quickly and regularly. Complex ratios make a pattern that takes much longer to repeat.',
 example:'For a fifth (3:2) the combined wave repeats after every 2 cycles of the lower note. For a tritone (45:32) it takes 32 cycles — and in practice, with any slight mistuning, it never settles at all.',
 research:'Helmholtz, H. (1863). Die Lehre von den Tonempfindungen; Plomp, R. & Levelt, W. J. M. (1965). Tonal consonance and critical bandwidth. JASA 38 (tested in era 8).',
 desc:'Two sine waves at a chosen ratio and their sum over 40 milliseconds, with marks where the combined pattern repeats.',
 dur:12,hint:'Choose a ratio and press Play to hear the two notes together. Count how often the sum repeats.',
 shared:'m1-ratio',init:()=>({i:1}),
 watch(p){return {i:Math.min(7,Math.floor(p*8))}},
 ui:[{choose:M1_RAT.map((r,i)=>[i,r[0]+':'+r[1]]),label:'Ratio',get:s=>s.i,act:'i'},{b:'Play together',act:'play'}],
 on:{i(s,v){s.i=Number(v);return 'keep'},play(s){const [p,q]=M1_RAT[s.i];AUDIO.chord([220,220*p/q],{dur:1.5,type:'sine',gain:.22});return 'keep'}},
 draw(s){
  const [p,q,nm]=M1_RAT[s.i],f1=220,f2=220*p/q,span=.04,rep=q/f1;let out=heading(`${p} : ${q}, the ${nm}`);
  out+=TF(46,62,`${f1} Hz`,13,C.blue,'start')+R(40,66,520,60,'#fff',C.grid,8)+M1_wave(44,68,512,56,span,t=>Math.sin(2*Math.PI*f1*t),C.blue,1.6);
  out+=TF(46,146,`${M1_f2(f2)} Hz`,13,C.purple,'start')+R(40,150,520,60,'#fff',C.grid,8)+M1_wave(44,152,512,56,span,t=>Math.sin(2*Math.PI*f2*t),C.purple,1.6);
  out+=TF(46,230,'together',13,C.coral,'start')+R(40,234,520,80,'#fff',C.grid,8)+M1_wave(44,236,512,76,span,t=>(Math.sin(2*Math.PI*f1*t)+Math.sin(2*Math.PI*f2*t))/2,C.coral,2);
  if(rep<=span)for(let k=1;k*rep<=span+1e-9;k++){const x=44+512*k*rep/span;out+=L(x,232,x,318,C.green,1.5,'stroke-dasharray="4 3"')}
  out+=T(300,346,rep<=span?`Repeats every ${(rep*1000).toFixed(1)} ms (every ${q} cycle${q>1?'s':''} of the lower note)`:`Repeats only every ${(rep*1000).toFixed(0)} ms — beyond this 40 ms window`,15,rep<=span?C.green:C.coral);
  out+=TF(300,368,'window: 40 milliseconds',13,C.muted);
  return {svg:out,phase:`The sum repeats once the lower note has done ${q} cycle${q>1?'s':''} and the upper ${p}. Simple ratios give short, regular patterns; how the ear judges this is tested with real listeners in era 8.`};
 }});

SCENE({id:'consonant-ratios-ladder',name:'Shared harmonics',tag:'Where the ladders meet',
 definition:'Each note brings its whole harmonic series. For simple ratios, many harmonics of the two notes coincide exactly; for complex ratios, they fall close together but apart.',
 example:'A fifth over 220 Hz (330 Hz): harmonics at 660, 1320, 1980 Hz are shared. A minor second (16:15) shares none in this range — instead its harmonics nearly touch, and near-misses roughen the sound.',
 research:'Helmholtz, H. (1863) — consonance from coinciding partials and the absence of beats; Plomp & Levelt (1965) refined this with critical bands.',
 desc:'Two ladders of the first twelve harmonics of each note on a log-frequency axis, with exact coincidences highlighted and near-misses marked.',
 dur:12,hint:'Choose a ratio and count the shared rungs; press Play to hear the pair.',
 shared:'m1-ratio',init:()=>({i:1}),
 watch(p){return {i:Math.min(7,Math.floor(p*8))}},
 ui:[{choose:M1_RAT.map((r,i)=>[i,r[0]+':'+r[1]]),label:'Ratio',get:s=>s.i,act:'i'},{b:'Play together',act:'play'}],
 on:{i(s,v){s.i=Number(v);return 'keep'},play(s){const [p,q]=M1_RAT[s.i];AUDIO.chord([220,220*p/q],{dur:1.5,type:'sawtooth',gain:.12});return 'keep'}},
 draw(s){
  const [p,q,nm]=M1_RAT[s.i],f1=220,f2=220*p/q,X=M1_logX(60,480,200,5600);let out=heading(`Harmonic ladders for the ${nm} (${p}:${q})`);
  const h1=range(12).map(k=>f1*(k+1)),h2=range(12).map(k=>f2*(k+1));
  out+=TB(54,104,'lower',13,C.blue,'end')+TB(54,204,'upper',13,C.purple,'end')+L(60,100,540,100,C.line,1.5)+L(60,200,540,200,C.line,1.5);
  let shared=0,near=0;
  h1.forEach(a=>{if(a<=5600)out+=L(X(a),86,X(a),114,C.blue,3)});
  h2.forEach(b=>{if(b>5600)return;const hitA=h1.some(a=>Math.abs(a-b)/a<.003),close=!hitA&&h1.some(a=>{const d=Math.abs(a-b);return d>4&&d/a<.06});
   if(hitA){shared++;out+=L(X(b),100,X(b),200,C.green,2.5,'stroke-dasharray="5 4"')}else if(close){near++;out+=Ci(X(b),150,6,C.coralp,C.coral)}
   out+=L(X(b),186,X(b),214,hitA?C.green:C.purple,3)});
  for(const v of [250,500,1000,2000,4000])out+=TF(X(v),250,v>=1000?v/1000+' kHz':v+' Hz',13,C.muted);
  out+=counter(140,276,'shared harmonics',String(shared),C.green,150)+counter(310,276,'near misses',String(near),C.coral,150);
  out+=TF(300,356,'green: exactly shared · red circles: close but not equal (they beat)',13,C.muted);
  return {svg:out,phase:`${shared} of the upper note’s first harmonics land exactly on the lower note’s, and ${near} fall uncomfortably close. Simple ratios share many rungs; complex ones scatter near-misses.`};
 }});

SCENE({id:'consonant-ratios-rate',name:'Rate the pairs yourself',tag:'You are the listener',
 definition:'How pleasant or smooth two notes sound together is a judgement listeners can rate. Ratings broadly follow ratio simplicity, with real variation between people and cultures.',
 example:'Most listeners in Western studies rate the octave and fifth smoothest and the minor second and tritone roughest; familiarity with a musical style shifts the middle ground.',
 research:'Plomp & Levelt (1965) rated pure-tone pairs; McDermott, Lehr & Oxenham (2010), Current Biology, linked consonance preference to harmonicity; McDermott et al. (2016), Nature, found Tsimane’ listeners largely indifferent.',
 desc:'A rating panel for eight intervals in a seeded order and a chart of your ratings, ordered by ratio simplicity; in Watch, an illustrative typical listener is shown.',
 dur:10,hint:'Press Play pair, then rate it from 1 (rough) to 5 (smooth). Your chart builds up; era 8 compares ratings with the published curve.',
 init:()=>({order:shuffled(range(8),3),pos:0,r:{}}),
 watch(p){const typical=[5,4.6,4.1,3.8,3.4,3.6,1.6,2.1],k=Math.min(8,Math.floor(p*9));const r={};for(let i=0;i<k;i++)r[i]=typical[i];return {order:range(8),pos:k,r,demo:true}},
 ui:[{b:'Play pair',act:'play'},{b:'New order',act:'shuffle'}],
 on:{play(s){if(s.pos>=8)return 'keep';const [p,q]=M1_RAT[s.order[s.pos]];AUDIO.chord([261.63,261.63*p/q],{dur:1.4,type:'triangle',gain:.2});return 'keep'},
  rate(s,v){if(s.pos>=8)return 'keep';s.r[s.order[s.pos]]=Number(v);s.pos++;return 'keep'},
  shuffle(s){s.order=shuffled(range(8),nextSeed());s.pos=0;s.r={};return 'keep'}},
 draw(s,f,X){
  let out=heading(s.demo?'An illustrative listener’s ratings':'Rate how smooth each pair sounds');
  if(s.pos<8&&!s.demo){out+=T(300,72,`Pair ${s.pos+1} of 8 — press Play pair, then rate it`,15,C.ink);
   for(let v=1;v<=5;v++){const x=120+(v-1)*76;out+=hit(X,'rate',v,`Rate ${v}`,R(x,86,64,46,'#fff',C.blue,10)+TB(x+32,116,String(v),19,C.blue))}
   out+=TF(120,150,'1 = rough',13,C.muted,'start')+TF(480,150,'5 = smooth',13,C.muted,'end')}
  else out+=T(300,100,s.demo?'Typical shape: smooth for simple ratios, rough for complex ones':'Done. Your ratings, simplest ratio first:',15,C.ink);
  const base=320;out+=L(60,base,560,base,C.line,2);
  M1_RAT.forEach(([p,q,nm],i)=>{const x=66+i*61,v=s.r[i];if(v)out+=R(x,base-v*30,46,v*30,C.blue,'none',4)+TF(x+23,base-v*30-6,String(+v.toFixed(1)),13,C.blue);
   out+=TF(x+23,base+18,p+':'+q,13,C.ink)+TF(x+23,base+34,nm.split(' ').pop(),13,C.muted)});
  out+=TF(30,base-150,'5',13,C.muted)+TF(30,base-4,'0',13,C.muted);
  const done=Object.keys(s.r).length;
  return {svg:out,phase:s.demo?'These bars are illustrative, not data. Rate the pairs yourself in Try it; era 8 sets ratings against Plomp and Levelt’s roughness curve.':`${done} of 8 rated. Ratings differ between people, and studies across cultures show that preferring consonance is partly learned.`};
 }});

/* ---------------- Lesson: Pythagorean tuning ---------------- */
const M1_FIFTHS=['C','G','D','A','E','B','F♯','C♯','G♯','D♯','A♯','E♯','B♯'];
SCENE({id:'pythagorean-tuning',name:'Stacking fifths',tag:'A spiral that does not close',
 definition:'Pythagorean tuning builds every note from pure fifths (3:2). Twelve fifths almost return to the starting note, seven octaves up — but overshoot by a small interval called the Pythagorean comma.',
 example:'C → G → D → A → E → B → F♯ → C♯ → G♯ → D♯ → A♯ → E♯ → B♯. B♯ “should” be C, but it is about 23.5 cents sharp.',
 research:'Boethius (c. 510); Barbour, J. M. (1951). Tuning and Temperament: A Historical Survey. (3/2)¹² ÷ 2⁷ = 531441/524288.',
 desc:'A circle of twelve positions with a spiral path adding one fifth at a time; after twelve steps the path ends just past its start, with the gap magnified and the drift in cents counted.',
 dur:13,hint:'Step through the twelve fifths. Press Play the stack to hear the notes, each folded back into one octave.',
 init:()=>({}),
 trace(){return range(13).map(k=>({k,say:k===0?'Start on C.':k<12?`${k} fifth${k>1?'s':''} up: ${M1_FIFTHS[k]}, ${(k*1.955).toFixed(1)} cents sharper than the equal-tempered ${M1_FIFTHS[k]}.`:'Twelve fifths: B♯, 23.46 cents above C. The circle does not close.'}))},
 ui:[{b:'Play the stack',act:'play'}],
 on:{play(){const notes=range(13).map(k=>{let r=1.5**k;while(r>=2)r/=2;return {hz:261.63*r,at:k*.38,dur:.36}});AUDIO.seq(notes,{type:'triangle',gain:.14});return 'keep'}},
 draw(s,f){
  const k=f.k,cx=200,cy=200,R0=128;let out=heading('Twelve pure fifths, folded into one octave');
  out+=Ci(cx,cy,R0,'none',C.grid);
  for(let i=0;i<12;i++){const a=-Math.PI/2+i*Math.PI/6;out+=TF(cx+Math.cos(a)*(R0+22),cy+Math.sin(a)*(R0+22)+5,M1_FIFTHS[i],14,i<=k?C.ink:C.line)}
  let d='';for(let i=0;i<=k;i++){const dev=i*1.955*3,a=-Math.PI/2+i*Math.PI/6+dev*Math.PI/180/10,r=R0-i*3;d+=(i?'L':'M')+fmt(cx+Math.cos(a)*r)+' '+fmt(cy+Math.sin(a)*r)}
  out+=P(d,C.blue,2.4);const last=(()=>{const dev=k*1.955*3,a=-Math.PI/2+k*Math.PI/6+dev*Math.PI/180/10,r=R0-k*3;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r]})();
  out+=Ci(last[0],last[1],7,k===12?C.coral:C.blue)+Ci(cx,cy-R0,6,C.green);
  out+=counter(390,86,'fifths stacked',String(k),C.blue,160)+counter(390,146,'note',M1_FIFTHS[k],C.ink,160)+counter(390,206,'drift from equal temp.',(k*1.955).toFixed(1)+' ¢',k===12?C.coral:C.amber,160);
  out+=TF(470,286,'(path drawn with the drift',13,C.muted)+TF(470,304,'exaggerated so you can see it)',13,C.muted);
  return {svg:out,phase:f.say};
 }});

SCENE({id:'pythagorean-tuning-comma',name:'The Pythagorean comma',tag:'129.75 is not 128',
 definition:'Twelve pure fifths multiply the frequency by (3/2)¹² ≈ 129.75; seven octaves multiply it by 2⁷ = 128. The ratio between them, about 1.0136, is the Pythagorean comma: 23.46 cents.',
 example:'Play B♯ (twelve fifths up, folded down) against C: about 3.6 beats per second at middle C. Instruments tuned in pure fifths must hide this “wolf” somewhere.',
 research:'Barbour, J. M. (1951). Tuning and Temperament; Boethius (c. 510) already discussed the comma.',
 desc:'Two bars, 129.75 and 128, side by side with their ratio, and the beating waveform of C against B♯ over one second.',
 dur:10,hint:'Play C and B♯ together and listen for the slow wobble — the beats are the comma made audible.',
 init:()=>({}),
 ui:[{b:'Play C with B♯',act:'pair'},{b:'Play B♯ then C',act:'seq'}],
 on:{pair(){AUDIO.chord([261.63,261.63*531441/524288],{dur:2.4,type:'sine',gain:.24});return 'keep'},seq(){AUDIO.seq([{hz:261.63*531441/524288,at:0,dur:.7},{hz:261.63,at:.8,dur:.7}],{type:'triangle',gain:.15});return 'keep'}},
 draw(s,f,X){
  const u=X.try?1:smooth(X.p*1.6);let out=heading('Twelve fifths overshoot seven octaves');
  const sc=1.6,b1=129.746*u,b2=128*u;
  out+=R(90,250-b1*sc,110,b1*sc,C.blue,'none',6)+TB(145,240-b1*sc,'(3/2)¹² = 129.75',15,C.blue)+TF(145,272,'twelve fifths',13,C.muted);
  out+=R(240,250-b2*sc,110,b2*sc,C.green,'none',6)+TB(295,236-b2*sc+16,'2⁷ = 128',15,C.green)+TF(295,272,'seven octaves',13,C.muted);
  out+=counter(400,80,'ratio',(531441/524288).toFixed(5),C.coral,160)+counter(400,140,'comma',M1_cents(531441/524288).toFixed(2)+' cents',C.coral,160)+counter(400,200,'beats at middle C',(261.63*(531441/524288-1)).toFixed(2)+' /s',C.amber,160);
  out+=R(40,292,520,62,'#fff',C.grid,8)+M1_wave(44,294,512,58,1,t=>Math.cos(Math.PI*3.565*t)*Math.sin(2*Math.PI*40*t),C.purple,1.2,700);
  out+=TF(300,372,'one second of C + B♯ (fine wave slowed for display): the envelope throbs 3.6 times',13,C.muted);
  return {svg:out,phase:'The two notes are 23.46 cents apart — about a quarter of a semitone. Played together they beat, a slow rise and fall in loudness, at the difference of their frequencies.'};
 }});

SCENE({id:'pythagorean-tuning-thirds',name:'Two kinds of major third',tag:'81:64 or 5:4?',
 definition:'Four pure fifths up and two octaves down give the Pythagorean major third, 81:64 (408 cents). The simpler ratio 5:4 (386 cents) is the “pure” or just major third. The gap, 81:80, is the syntonic comma.',
 example:'Medieval music, tuned in fifths, treated thirds as dissonances. Renaissance musicians, wanting sweet thirds, moved towards 5:4 — and the tuning debates of era 3 began.',
 research:'Zarlino, G. (1558). Le istitutioni harmoniche (just intonation); Barbour (1951). Syntonic comma 81/80 ≈ 21.51 cents.',
 desc:'A cents ruler from 370 to 420 with the just, equal-tempered and Pythagorean major thirds marked, the syntonic comma between the outer two, and the beating rate of each third over middle C.',
 dur:10,hint:'Choose a third and play it over C. The just third is smooth; the Pythagorean one beats fast.',
 init:()=>({t:'pyth'}),
 watch(p){return {t:['just','equal','pyth'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['just','Just 5:4'],['equal','Equal tempered'],['pyth','Pythagorean 81:64']],label:'Third',get:s=>s.t,act:'t'},{b:'Play over C',act:'play'}],
 on:{t(s,v){s.t=v;return 'keep'},play(s){const r={just:5/4,equal:2**(4/12),pyth:81/64}[s.t];AUDIO.chord([261.63,261.63*r],{dur:2,type:'sawtooth',gain:.12});return 'keep'}},
 draw(s){
  const th={just:[5/4,'just 5:4',C.green],equal:[2**(1/3),'equal tempered',C.blue],pyth:[81/64,'Pythagorean 81:64',C.coral]};
  let out=heading('Major thirds in three tunings');const X=c=>60+480*(c-370)/50;
  out+=L(60,150,540,150,C.line,3);for(let c=370;c<=420;c+=10)out+=L(X(c),144,X(c),156,C.muted,1.5)+TF(X(c),176,c+'¢',13,C.muted);
  Object.entries(th).forEach(([k,[r,n,col]],i)=>{const c=M1_cents(r),on=k===s.t;out+=L(X(c),100,X(c),150,col,on?4:2)+Ci(X(c),100,on?9:6,col)+TF(X(c),i===1?84:72-0*i,n,13,col)+TF(X(c),i===1?70:88,c.toFixed(1)+'¢',13,col)});
  out+=P(`M${X(386.31)} 200 L${X(386.31)} 214 L${X(407.82)} 214 L${X(407.82)} 200`,C.purple,2)+TF((X(386.31)+X(407.82))/2,234,'syntonic comma 21.5¢',13,C.purple);
  const r=th[s.t][0],beat=Math.abs(4*261.63*r-5*261.63);
  out+=counter(70,262,'ratio',s.t==='equal'?'2^(4/12)':s.t==='just'?'5 : 4':'81 : 64',th[s.t][2],140)+counter(230,262,'frequency over C4',M1_f2(261.63*r)+' Hz',C.ink,140)+counter(390,262,'beats per second',beat<.05?'0':beat.toFixed(1),beat<.05?C.green:C.coral,140);
  out+=TF(300,340,'beats between harmonic 4 of the third and harmonic 5 of C',13,C.muted);
  return {svg:out,phase:`The ${th[s.t][1]} third is ${M1_cents(r).toFixed(1)} cents. ${beat<.05?'Its harmonics line up exactly with C’s, so it does not beat.':`Its 4th harmonic misses C’s 5th by ${beat.toFixed(1)} Hz, so the chord shimmers ${beat.toFixed(1)} times a second.`}`};
 }});

/* ---------------- Lesson: pentatonic scales ---------------- */
SCENE({id:'pentatonic-scales',name:'Five fifths make a scale',tag:'The pentatonic',
 definition:'Stack four fifths above a note (five notes in all), fold them into one octave and sort them: you get a five-note scale with no semitones, the anhemitonic pentatonic.',
 example:'C G D A E, sorted: C D E G A. The steps are tone, tone, minor third, tone, minor third — no two notes are a jarring semitone apart.',
 research:'Day-O’Connell, J. (2007). Pentatonicism from the Eighteenth Century to Debussy; the fifth-generation construction appears in early Chinese sources such as the Guanzi (c. 4th–3rd century BCE).',
 desc:'A circle of fifths with five adjacent notes lit, unfolding into a sorted ladder of the pentatonic scale with the size of each step in semitones.',
 dur:12,hint:'Step through the construction, then press Play the scale.',
 init:()=>({}),
 trace(){return range(7).map(k=>({k,say:k===0?'Start on C.':k<5?`Add a fifth: ${['G','D','A','E'][k-1]}.`:k===5?'Fold the five notes into one octave and sort them: C D E G A.':'Steps: 2, 2, 3, 2, 3 semitones — no semitone anywhere.'}))},
 ui:[{b:'Play the scale',act:'play'}],
 on:{play(){AUDIO.seq([0,2,4,7,9,12].map((d,i)=>({hz:midiHz(60+d),at:i*.34,dur:.32})),{type:'triangle',gain:.15});return 'keep'}},
 draw(s,f){
  const k=f.k,cx=150,cy=200,Rr=110,circ=['C','G','D','A','E','B','F♯','C♯','A♭','E♭','B♭','F'];let out=heading('From five stacked fifths to a scale');
  out+=Ci(cx,cy,Rr,'none',C.grid);
  circ.forEach((n,i)=>{const a=-Math.PI/2+i*Math.PI/6,on=i<Math.min(k+1,5);out+=Ci(cx+Math.cos(a)*Rr,cy+Math.sin(a)*Rr,17,on?C.blue:'#fff',on?C.blue:C.line)+TB(cx+Math.cos(a)*Rr,cy+Math.sin(a)*Rr+5,n,14,on?'#fff':C.muted)});
  if(k>=5){const sc=[['C',0],['D',2],['E',4],['G',7],['A',9],['C',12]];
   sc.forEach(([n,d],i)=>{const x=310+d*21;out+=Ci(x,250,15,i<5?C.blue:'#fff',C.blue)+TB(x,255,n,14,i<5?'#fff':C.blue);if(i)out+=TF((x+310+sc[i-1][1]*21)/2,224,String(d-sc[i-1][1]),15,d-sc[i-1][1]===3?C.coral:C.green)});
   out+=TF(436,290,'semitones between neighbours',13,C.muted)}
  else out+=T(440,200,k===0?'C':['C','C G','C G D','C G D A','C G D A E'][k],20,C.ink);
  return {svg:out,phase:f.say};
 }});

SCENE({id:'pentatonic-scales-black-keys',name:'The black keys',tag:'Hard to play a wrong note',
 definition:'The black keys of a piano form a pentatonic scale (F♯ G♯ A♯ C♯ D♯). Because it contains no semitones, any order of black keys tends to sound “in tune” with itself.',
 example:'Children improvising on the black keys alone rarely make a harsh clash: the smallest gap is a whole tone, so no two notes rub like C against C♯.',
 research:'Day-O’Connell (2007); pedagogical use is long-standing (e.g. Orff-Schulwerk, from the 1950s).',
 desc:'A two-octave keyboard with the black keys highlighted as the pentatonic; pressed keys light up and the last few notes are listed.',
 dur:10,hint:'Press any key to play it. Try a tune on the black keys only, then sneak in a white key and listen for the clash.',
 init:()=>({last:[],lit:null}),
 watch(p){const tune=[66,68,70,73,75,73,70,68,66,70,73,78],k=Math.min(tune.length,Math.floor(p*tune.length)+1);return {last:tune.slice(0,k).slice(-8),lit:tune[k-1]}},
 ui:[{b:'Play a black-key tune',act:'tune'},{b:'Clear',act:'clear'}],
 on:{key(s,m){m=Number(m);M1_sing(midiHz(m),{dur:.6});s.last=s.last.concat(m).slice(-8);s.lit=m;return 'keep'},
  tune(s){const r=rng(nextSeed()),bl=[66,68,70,73,75,78,80,82];const t=range(10).map(()=>bl[Math.floor(r()*bl.length)]);AUDIO.seq(t.map((m,i)=>({hz:midiHz(m),at:i*.28,dur:.26})),{type:'triangle',gain:.14});s.last=t.slice(-8);s.lit=null;return 'keep'},
  clear(s){s.last=[];s.lit=null;return 'keep'}},
 draw(s,f,X){
  const black=new Set([66,68,70,73,75,78,80,82]);let out=heading('The black keys are a pentatonic scale');
  out+=M1_keyboard(X,40,70,520,170,60,83,black,'key',s.lit);
  out+=TF(300,262,'blue keys: F♯ G♯ A♯ C♯ D♯ — no two a semitone apart',13,C.blue);
  out+=T(300,300,s.last.length?'You played: '+s.last.map(noteName).join('  '):'Nothing played yet',15,C.ink);
  const white=s.last.filter(m=>!black.has(m)).length;
  out+=T(300,334,s.last.length?(white?`${white} white key${white>1?'s':''} — listen for semitone clashes`:'All black keys: no semitone clashes possible'):'',14,white?C.coral:C.green);
  return {svg:out,phase:'Every black key is at least a whole tone from its neighbours in the set, so melodies and even chords drawn from it avoid the sharp rub of a semitone.'};
 }});

const M1_TRAD={
 chinese:{name:'Chinese wu sheng',c:[0,200,400,700,900],labels:['gong','shang','jue','zhi','yu'],note:'The five tones gong–shang–jue–zhi–yu. Any of them can serve as the home tone, giving five modes from one set of pitches.'},
 scottish:{name:'Scottish and Irish tunes',c:[0,200,400,700,900],labels:['1','2','3','5','6'],note:'Many traditional tunes (for example much of “Auld Lang Syne”) use these same five pitches, but phrasing, ornament and the home tone differ from Chinese practice.'},
 blues:{name:'Blues minor pentatonic',c:[0,300,500,700,1000],labels:['1','♭3','4','5','♭7'],note:'A common framework, but blue notes are bent and sung between fixed pitches; the scale is a teaching simplification. Kubik (1999) traces strong West African roots.'},
 slendro:{name:'Javanese sléndro',c:[0,240,480,720,960],labels:['1','2','3','5','6'],note:'Five steps of roughly equal size (about 240 cents each, approximately). Real gamelans are each tuned individually, so this is not the Western pentatonic at all.'}};
SCENE({id:'pentatonic-scales-traditions',name:'Pentatonics around the world',tag:'Five notes, many systems',
 definition:'Five-note scales appear in many musical traditions, but “pentatonic” covers different things: some share the Western black-key pitches, others divide the octave quite differently.',
 example:'Chinese gong–shang–jue–zhi–yu and many Scottish tunes share the same pitch set; the blues bends its notes; Javanese sléndro splits the octave into five near-equal steps that no piano can play.',
 research:'Kunst, J. (1949). Music in Java; Kubik, G. (1999). Africa and the Blues; Day-O’Connell (2007). Sléndro step sizes vary by ensemble; 240 cents is an average.',
 desc:'A ring of 1,200 cents with the five degrees of the chosen tradition marked and named, against the twelve equal-tempered semitones.',
 dur:12,hint:'Choose a tradition and press Play the scale. Compare sléndro with the others — it does not fit the piano’s grid.',
 init:()=>({t:'chinese'}),
 watch(p){return {t:['chinese','scottish','blues','slendro'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['chinese','Chinese'],['scottish','Scottish'],['blues','Blues'],['slendro','Sléndro']],label:'Tradition',get:s=>s.t,act:'t'},{b:'Play the scale',act:'play'}],
 on:{t(s,v){s.t=v;return 'keep'},play(s){const c=M1_TRAD[s.t].c.concat(1200);AUDIO.seq(c.map((x,i)=>({hz:261.63*2**(x/1200),at:i*.36,dur:.34})),{type:'triangle',gain:.15});return 'keep'}},
 draw(s){
  const tr=M1_TRAD[s.t],cx=180,cy=210,Rr=120;let out=heading(tr.name);
  out+=Ci(cx,cy,Rr,'none',C.grid,'stroke-width="3"');
  for(let i=0;i<12;i++){const a=-Math.PI/2+i*Math.PI/6;out+=L(cx+Math.cos(a)*(Rr-8),cy+Math.sin(a)*(Rr-8),cx+Math.cos(a)*(Rr+8),cy+Math.sin(a)*(Rr+8),C.line,2)}
  tr.c.forEach((c,i)=>{const a=-Math.PI/2+2*Math.PI*c/1200;out+=L(cx,cy,cx+Math.cos(a)*Rr,cy+Math.sin(a)*Rr,C.pale,2)+Ci(cx+Math.cos(a)*Rr,cy+Math.sin(a)*Rr,14,C.blue)+TB(cx+Math.cos(a)*(Rr+34),cy+Math.sin(a)*(Rr+34)+5,tr.labels[i],13,C.ink)});
  out+=TF(cx,cy+5,'1200 ¢',13,C.muted);
  out+=TB(340,90,'degrees (cents)',14,C.muted,'start');
  tr.c.forEach((c,i)=>{out+=TF(340,118+i*24,`${tr.labels[i]}: ${c}`,14,C.ink,'start')+(i?TF(470,118+i*24,`+${c-tr.c[i-1]}`,13,C.green,'start'):'')});
  out+=TF(340,250,'grey ticks: the 12 equal semitones',13,C.muted,'start');
  return {svg:out,phase:tr.note};
 }});
