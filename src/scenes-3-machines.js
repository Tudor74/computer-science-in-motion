/* ===================== Techno era 3 · The machines (1980–1990) ===================== */
// Sequencers here schedule one beat (four steps) of sound at a time from the tick handler, using Web Audio
// offsets, and move a playhead in the state with ctx.every. Nothing sounds unless the learner pressed Play.
// The voices are simplified models of the machines, not circuit emulations.
const X3_NOTE='Simplified model, not a circuit emulation.';
const X3_V={
 kick909:(at,g=1)=>AUDIO.kick({at,from:180,to:50,decay:.3,gain:.3*g}),
 kick808:(at,g=1)=>AUDIO.kick({at,from:130,to:42,decay:.62,gain:.3*g,click:.004}),
 snare:(at,g=1)=>{AUDIO.tone(190,{at,dur:.11,type:'triangle',gain:.12*g,attack:.002,release:.09});AUDIO.hit({at,dur:.14,gain:.11*g,type:'bandpass',cutoff:1900,q:.7})},
 clap:(at,g=1)=>{for(const d of [0,.011,.022])AUDIO.hit({at:at+d,dur:.02,gain:.09*g,type:'bandpass',cutoff:1300,q:1.2});AUDIO.hit({at:at+.03,dur:.14,gain:.1*g,type:'bandpass',cutoff:1300,q:1.2})},
 ch:(at,g=1)=>AUDIO.hit({at,dur:.04,gain:.07*g,type:'highpass',cutoff:8000}),
 oh:(at,g=1)=>AUDIO.hit({at,dur:.24,gain:.07*g,type:'highpass',cutoff:7000}),
 cow:(at,g=1)=>{AUDIO.tone(540,{at,dur:.22,type:'square',gain:.05*g,attack:.002,release:.18});AUDIO.tone(800,{at,dur:.22,type:'square',gain:.05*g,attack:.002,release:.18})},
 tom:(at,g=1)=>AUDIO.kick({at,from:220,to:110,decay:.25,gain:.2*g})
};
// Shared play/stop and tick. spec.ms(s): step length in ms; spec.N(s): steps (a multiple of 4);
// spec.step(s,i,at): sound step i at offset `at` seconds; spec.sw(s): swing as a fraction of a step.
function X3_loop(spec,extra={}){
 const tick=(s,tok)=>{if(!s.playing||Number(tok)!==s.tok)return 'stop';const N=spec.N(s),st=spec.ms(s)/1000;s.pos=(s.pos+1)%N;
  if(s.pos%4===0)for(let k=0;k<4;k++){const i=s.pos+k;spec.step(s,i,k*st+(i%2&&spec.sw?spec.sw(s)*st:0)+.03)}
  return 'keep'};
 return {...extra,tick,
  play(s,a,ctx){s.tok=(s.tok||0)+1;if(s.playing){s.playing=false;AUDIO.stopAll();return 'keep'}s.playing=true;s.pos=-1;tick(s,s.tok);ctx.every(spec.ms(s),'tick',s.tok);return 'keep'}};
}
function X3_restart(s,ctx,spec,H){if(s.playing){s.tok=(s.tok||0)+1;s.pos=-1;AUDIO.stopAll();H.tick(s,s.tok);ctx.every(spec.ms(s),'tick',s.tok)}}
const X3_pos=(s,X,N)=>X&&X.try?(s.playing?s.pos:-1):Math.floor(((X&&X.p)||0)*N*2)%N;
const X3_stepMs=bpm=>60000/bpm/4;
function X3_grid(X,rows,pos,o={}){
 const x0=o.x0||124,cw=o.cw||27,y0=o.y0||70,ch=o.ch||38,n=o.n||16;let out='';
 rows.forEach((row,r)=>{const y=y0+r*ch;out+=TF(x0-10,y+(ch-6)/2+5,row.name,13,C.muted,'end');
  for(let i=0;i<n;i++){const on=!!row.pat[i],cur=i===pos;
   const inner=R(x0+i*cw+1.5,y,cw-3,ch-6,on?row.col:(i%4===0?'#e3ecf1':'#fff'),cur?C.amber:(on?'none':C.grid),4);
   out+=row.act?hit(X,row.act,r+':'+i,`${row.name}, step ${i+1}: ${on?'on':'off'}. Press to toggle.`,inner):inner}});
 for(let b=0;b<n/4;b++)out+=TF(x0+b*4*cw+cw/2,y0-8,String(b+1),12,C.muted);
 return out;
}
function X3_wrap(text,max){const out=[];let line='';for(const w of String(text).split(' ')){if((line+' '+w).trim().length>max&&line){out.push(line);line=w}else line=(line+' '+w).trim()}if(line)out.push(line);return out}
function X3_para(x,y,text,max,size=14,col=C.ink){return X3_wrap(text,max).map((l,i)=>T(x,y+i*(size*1.28+5),l,size,col,'start')).join('')}
// A scene made of pressable cards: items [{chip,title,when,text}].
function X3_cards(def){
 const items=def.items,n=items.length;
 SCENE({id:def.id,name:def.name,tag:def.tag,definition:def.definition,example:def.example,desc:def.desc,research:def.research,dur:def.dur||12,hint:def.hint||'Press each card in turn, or use Next.',
  init:()=>({i:0}),watch(p){return {i:Math.min(n-1,Math.floor(p*n))}},
  ui:[{b:'Next',act:'next'}],
  on:{pick(s,v){s.i=Number(v);return 'keep'},next(s){s.i=(s.i+1)%n;return 'keep'}},
  draw(s,f,X){
   const it=items[s.i],w=(540-(n-1)*6)/n;let out=heading(def.head||def.name);
   items.forEach((q,i)=>{const x=30+i*(w+6),on=i===s.i;out+=hit(X,'pick',i,q.title,R(x,48,w,34,on?C.blue:'#fff',on?C.blue:C.line,8)+TF(x+w/2,70,q.chip,12,on?'#fff':C.ink))});
   out+=R(30,98,540,226,'#fff',C.grid,10)+TB(48,128,it.title,16,C.ink,'start');
   if(it.when)out+=TF(552,128,it.when,13,C.muted,'end');
   out+=X3_para(48,158,it.text,58);
   if(def.foot)out+=T(300,356,def.foot,14,C.muted);
   return {svg:out,phase:it.note||def.phase||it.text};
  }});
}

/* ---------- tr-808 ---------- */
SCENE({id:'tr-808',name:'The TR-808 kick',tag:'A sine that falls and fades',
 definition:'The Roland TR-808 (1980) made its drum sounds with analogue circuits, not recordings. Its bass drum is close to a sine wave that drops quickly in pitch and then rings on, for much longer than a real drum.',
 example:'Set a long decay and a low end pitch and you have the booming 808 kick. Shorten the decay and start higher and it turns into the tighter, punchier kick of the later TR-909.',
 desc:'Two small graphs of one drum hit: pitch falling from a start value to an end value, and loudness fading over the decay time, with sliders for decay and end pitch.',
 research:['Roland Corporation (1980). TR-808 Rhythm Composer owner’s manual and service notes.','Werner, K. J., Abel, J. S. & Smith, J. O. (2014). A physically-informed, circuit-bendable, digital model of the Roland TR-808 bass drum circuit. Proc. DAFx-14.'],
 dur:10,hint:'Move the sliders, then press Hit the drum. Try the two presets and listen for the length. '+X3_NOTE,
 init:()=>({decay:.6,to:42,from:130}),
 watch(p){return p<.5?{decay:.62,to:42,from:130}:{decay:.3,to:50,from:180}},
 ui:[{range:'decay',label:'Decay',min:.1,max:1,step:.02,get:s=>s.decay,act:'decay',show:v=>Number(v).toFixed(2)+' s'},
  {range:'to',label:'End pitch',min:30,max:90,step:1,get:s=>s.to,act:'to',show:v=>v+' Hz'},
  {b:'Hit the drum',act:'hit'},{b:'Long, like an 808',act:'p808'},{b:'Short, like a 909',act:'p909'}],
 on:{decay(s,v){s.decay=Number(v);return 'keep'},to(s,v){s.to=Number(v);return 'keep'},
  hit(s){AUDIO.kick({from:s.from,to:s.to,decay:s.decay,gain:.3});return 'keep'},
  p808(s){s.decay=.62;s.to=42;s.from=130;AUDIO.kick({from:130,to:42,decay:.62,gain:.3,click:.004});return 'keep'},
  p909(s){s.decay=.3;s.to=50;s.from=180;AUDIO.kick({from:180,to:50,decay:.3,gain:.3});return 'keep'}},
 draw(s){
  let out=heading(s.decay>=.5?'A long, low boom':'A short, tight thump');
  const px=60,pw=210,py=70,ph=150,tmax=1,X1=t=>px+t/tmax*pw;
  // pitch
  out+=R(px,py,pw,ph,'#fff',C.grid,6)+TF(px,py-8,'pitch (Hz)',13,C.muted,'start');
  const fall=Math.max(.02,s.decay*.35),Yp=v=>py+ph-(v-20)/(200-20)*ph;let d='';
  for(let k=0;k<=80;k++){const t=k/80*tmax,f=t<fall?s.from*Math.pow(s.to/s.from,t/fall):s.to;if(t<=s.decay)d+=(k?'L':'M')+fmt(X1(t))+' '+fmt(Yp(f))}
  out+=P(d,C.blue,2.6);
  for(const v of [50,100,150])out+=TF(px-6,Yp(v)+4,String(v),12,C.muted,'end');
  // loudness
  const qx=330,X2=t=>qx+t/tmax*pw;out+=R(qx,py,pw,ph,'#fff',C.grid,6)+TF(qx,py-8,'loudness',13,C.muted,'start');
  let e='';for(let k=0;k<=80;k++){const t=k/80*tmax,a=t<=s.decay?Math.exp(-6.9*t/s.decay):0;e+=(k?'L':'M')+fmt(X2(t))+' '+fmt(py+ph-a*(ph-8))}
  out+=P(e,C.coral,2.6)+L(X2(s.decay),py,X2(s.decay),py+ph,C.line,1.5,'stroke-dasharray="4 4"');
  for(const [x0,Xf] of [[px,X1],[qx,X2]]){out+=TF(Xf(0),py+ph+17,'0',12,C.muted)+TF(Xf(.5),py+ph+17,'0.5',12,C.muted)+TF(Xf(1),py+ph+17,'1 s',12,C.muted)}
  out+=counter(100,262,'falls to',s.to+' Hz',C.blue,120)+counter(240,262,'rings for',s.decay.toFixed(2)+' s',C.coral,120)+counter(380,262,'in a bar at 125 BPM',Math.round(s.decay/(60/125*4)*100)+'%',C.purple,150);
  out+=T(300,346,'Lower and longer reads as “808”; higher and shorter as “909”.',15,C.ink);
  return {svg:out,phase:`The pitch drops from ${s.from} Hz to ${s.to} Hz in the first ${Math.round(fall*1000)} ms, then the tone rings for ${s.decay.toFixed(2)} s. A real 808 gets this from a resonant circuit struck by a short pulse. ${X3_NOTE}`};
 }});

const X3_808PADS=[
 ['kick','Bass drum','A resonant circuit is struck by a pulse and rings like a bell made of bass: nearly a pure sine that fades.',at=>X3_V.kick808(at)],
 ['snare','Snare','Two tuned ringing circuits for the drum skin, plus filtered noise for the rattle of the snares.',at=>X3_V.snare(at)],
 ['clap','Handclap','Noise through a band-pass filter, fired several times a few milliseconds apart, then a longer tail.',at=>X3_V.clap(at)],
 ['ch','Closed hat','In the 808, six square-wave oscillators at clashing pitches, filtered and cut short. Modelled here with filtered noise.',at=>X3_V.ch(at)],
 ['oh','Open hat','The same metallic source as the closed hat, left to ring for about a quarter of a second.',at=>X3_V.oh(at)],
 ['cow','Cowbell','Two square waves, near 540 Hz and 800 Hz, through a band-pass filter. It sounds little like a cowbell and became famous anyway.',at=>X3_V.cow(at)]];
SCENE({id:'tr-808-voices',name:'Six circuits, six sounds',tag:'Drums built from oscillators and noise',
 definition:'Every sound in the TR-808 is synthesised: ringing circuits for the drums, square-wave oscillators for the hats, cymbal and cowbell, and filtered noise for snares and claps. No recordings are involved.',
 example:'The cowbell is two square waves at about 540 Hz and 800 Hz. The handclap is the same burst of noise fired three times quickly, then once more with a tail.',
 desc:'Six pads for the bass drum, snare, handclap, closed hat, open hat and cowbell; pressing one plays it and shows how the machine makes it.',
 research:['Roland Corporation (1980). TR-808 service notes (circuit descriptions).','Reid, G. (2002). Synth Secrets: practical snare, cymbal and cowbell synthesis. Sound on Sound.'],
 dur:12,hint:'Press each pad to hear it and read how it is made. '+X3_NOTE,
 init:()=>({v:0}),watch(p){return {v:Math.min(5,Math.floor(p*6))}},
 ui:[{b:'Play it again',act:'again'}],
 on:{pad(s,v){s.v=Number(v);X3_808PADS[s.v][3](0);return 'keep'},again(s){X3_808PADS[s.v][3](0);return 'keep'}},
 draw(s,f,X){
  let out=heading('How an 808 makes each sound');const w=84;
  X3_808PADS.forEach((q,i)=>{const x=30+i*(w+7.2),on=i===s.v;out+=hit(X,'pad',i,q[1]+': press to play',R(x,52,w,58,on?C.amber:'#fff',on?C.amber:C.line,10)+TF(x+w/2,86,q[1],12,on?'#fff':C.ink))});
  const q=X3_808PADS[s.v];out+=R(30,130,540,150,'#fff',C.grid,10)+TB(48,160,q[1],16,C.ink,'start')+X3_para(48,190,q[2],58);
  out+=T(300,316,'All analogue: electricity shaped into sound, with no recordings.',15,C.ink)+T(300,350,X3_NOTE,13,C.muted);
  return {svg:out,phase:q[1]+': '+q[2]};
 }});

X3_cards({id:'tr-808-story',name:'A failure that became a standard',tag:'Cheap second-hand machines found new owners',
 definition:'The TR-808 sold poorly when new because it did not sound like real drums. Once discontinued it was cheap second-hand, and young producers in hip-hop, electro and techno made its artificial sound their own.',
 example:'In 1982, while the machine was still on sale, Afrika Bambaataa and the Soulsonic Force’s “Planet Rock” and Marvin Gaye’s “Sexual Healing” both used it.',
 desc:'Six cards from the launch in 1980 to the machine’s later reputation.',
 research:['Kakehashi, I. & Olsen, R. (2002). I Believe in Music. Hal Leonard (Roland’s founder’s account).','Sicko, D. (2010). Techno Rebels: The Renegades of Electronic Funk. 2nd edn. Wayne State University Press.','Brewster, B. & Broughton, F. (2006). Last Night a DJ Saved My Life. Rev. edn. Headline.'],
 foot:'Prices and unit counts are as commonly reported.',
 items:[
  {chip:'1980',title:'Launch',when:'1980',text:'Roland releases the TR-808 Rhythm Composer at about $1,195. Memory chips for recorded drums are expensive, so its sounds are built from analogue circuits instead.'},
  {chip:'Rival',title:'“It doesn’t sound like drums”',when:'1980–82',text:'The Linn LM-1, also from 1980, plays digital recordings of real drums and costs about $5,000. Reviewers and studio players prefer its realism and call the 808 toy-like.'},
  {chip:'1982',title:'Two early hits',when:'1982',text:'“Planet Rock” (Afrika Bambaataa and the Soulsonic Force, produced by Arthur Baker) and Marvin Gaye’s “Sexual Healing” put the 808 on records heard round the world.'},
  {chip:'1983',title:'Discontinued',when:'1983',text:'Production ends after about 12,000 machines. Roland’s founder Ikutaro Kakehashi later said a transistor the circuits relied on could no longer be bought.'},
  {chip:'Cheap',title:'Second-hand',when:'mid-1980s',text:'Used 808s turn up in pawn shops and small ads for a fraction of the price. Producers with little money, in the Bronx, Miami, Chicago and Detroit, can now afford a drum machine.'},
  {chip:'Legacy',title:'A word for bass',when:'since',text:'The long kick becomes the low end of electro, Miami bass, techno and later trap. “808” now often just means a deep, sustained bass drum, whatever made it.'}]});

/* ---------- tr-909 ---------- */
const X3_909ROWS=[['Kick',C.blue,'kick909'],['Clap',C.coral,'clap'],['Closed hat',C.green,'ch'],['Open hat',C.purple,'oh']];
const X3_fromIdx=(a,n=16)=>{const p=Array(n).fill(0);a.forEach(i=>p[i]=1);return p};
const X3_909INIT=()=>[X3_fromIdx([0,4,8,12]),X3_fromIdx([4,12]),X3_fromIdx([0,1,3,4,5,7,8,9,11,12,13,15]),X3_fromIdx([2,6,10,14])];
const X3_909SPEC={ms:s=>X3_stepMs(s.bpm),N:()=>16,step(s,i,at){X3_909ROWS.forEach((r,k)=>{if(s.pat[k][i])X3_V[r[2]](at,k===2?.8:1)})}};
const X3_909H=X3_loop(X3_909SPEC,{
 tog(s,v){const [r,i]=String(v).split(':').map(Number);s.pat[r][i]=s.pat[r][i]?0:1;return 'keep'},
 bpm(s,v,ctx){s.bpm=Number(v);X3_restart(s,ctx,X3_909SPEC,X3_909H);return 'keep'},
 floor(s){s.pat=X3_909INIT();return 'keep'},clear(s){s.pat=X3_909ROWS.map(()=>Array(16).fill(0));return 'keep'}});
SCENE({id:'tr-909',name:'The TR-909 pattern',tag:'Four on the floor, hats on the off-beat',
 definition:'The Roland TR-909 (1983) supplied the drum sounds for the basic pattern of house and techno, which came from disco: a kick on every beat (“four on the floor”), a clap on beats two and four, and an open hi-hat on each off-beat.',
 example:'With sixteen steps in a bar, the kick sits on steps 1, 5, 9 and 13, the clap on 5 and 13, and the open hat on 3, 7, 11 and 15, halfway between kicks.',
 desc:'A sixteen-step grid with rows for kick, clap, closed hat and open hat, a playhead, and a tempo slider.',
 research:['Roland Corporation (1983). TR-909 Rhythm Composer owner’s manual.','Butler, M. J. (2006). Unlocking the Groove: Rhythm, Meter, and Musical Design in Electronic Dance Music. Indiana University Press.'],
 dur:12,hint:'Press Play, then press squares to switch steps on and off. Changes are heard from the next beat. '+X3_NOTE,
 init:()=>({bpm:126,pat:X3_909INIT(),playing:false,pos:-1}),
 watch(){return {bpm:126,pat:X3_909INIT(),playing:false,pos:-1}},
 ui:[{b:'Play / stop',act:'play'},{range:'bpm',label:'Tempo',min:110,max:140,step:1,get:s=>s.bpm,act:'bpm',show:v=>v+' BPM'},{b:'Four on the floor',act:'floor'},{b:'Clear',act:'clear'}],
 on:X3_909H,
 draw(s,f,X){
  const pos=X3_pos(s,X,16);let out=heading('Sixteen steps make one bar');
  out+=X3_grid(X,X3_909ROWS.map((r,k)=>({name:r[0],col:r[1],pat:s.pat[k],act:'tog'})),pos,{y0:72,ch:42});
  const kicks=s.pat[0].map((v,i)=>v?i:-1).filter(i=>i>=0),floor=kicks.join()==='0,4,8,12';
  out+=counter(124,252,'tempo',s.bpm+' BPM',C.blue,130)+counter(274,252,'one step lasts',Math.round(X3_stepMs(s.bpm))+' ms',C.purple,130)+counter(424,252,'one bar lasts',(X3_stepMs(s.bpm)*16/1000).toFixed(2)+' s',C.green,130);
  out+=T(300,330,floor?'Kick on every beat: four on the floor.':kicks.length?'Your own kick pattern: listen for where the beat sits now.':'No kick: the hats alone still imply the beat.',15,C.ink)+T(300,358,'The numbers above the grid count the four beats.',13,C.muted);
  return {svg:out,phase:`At ${s.bpm} BPM each of the sixteen steps lasts ${Math.round(X3_stepMs(s.bpm))} ms. Open hats on the off-beats pull against the kick; that push and pull is the basic motion of house and techno. ${X3_NOTE}`};
 }});

const X3_ACCSPEC={ms:()=>X3_stepMs(126),N:()=>16,step(s,i,at){const g=s.acc[i]?1+s.amt/100:1-.35*(s.amt/100);X3_V.ch(at,g*1.1);if(i%4===0)X3_V.kick909(at,.9)}};
const X3_ACCH=X3_loop(X3_ACCSPEC,{acc(s,v){const i=Number(String(v).split(':')[1]);s.acc[i]=s.acc[i]?0:1;return 'keep'},amt(s,v){s.amt=Number(v);return 'keep'}});
SCENE({id:'tr-909-accent',name:'Accent',tag:'The same hits, some louder',
 definition:'An accent track marks steps to be played louder. Sixteen identical hi-hats sound like a machine; accent a few and a rhythm appears inside them without adding a single note.',
 example:'Accent steps 1, 4, 7, 11 and 13 of a row of hats and you hear a syncopated figure riding over the steady kick.',
 desc:'A row of sixteen hi-hat steps drawn as bars, taller where accented, above an accent row of toggles, with a slider for how strong the accent is.',
 research:['Roland Corporation (1983). TR-909 owner’s manual: total accent and shuffle.','Butler, M. J. (2006). Unlocking the Groove. Indiana University Press.'],
 dur:10,hint:'Press Play. Toggle accents in the lower row and move the amount to zero and back. '+X3_NOTE,
 init:()=>({acc:X3_fromIdx([0,3,6,10,12]),amt:70,playing:false,pos:-1}),
 watch(p){return {acc:X3_fromIdx([0,3,6,10,12]),amt:p<.4?0:70,playing:false,pos:-1}},
 ui:[{b:'Play / stop',act:'play'},{range:'amt',label:'Accent amount',min:0,max:100,step:5,get:s=>s.amt,act:'amt',show:v=>v+'%'}],
 on:X3_ACCH,
 draw(s,f,X){
  const pos=X3_pos(s,X,16),x0=124,cw=27;let out=heading(s.amt?'Accents carve a rhythm out of even hats':'No accent: sixteen equal hats');
  for(let i=0;i<16;i++){const h=s.acc[i]?40+s.amt*.6:40-s.amt*.2;out+=R(x0+i*cw+5,170-h,cw-10,h,s.acc[i]?C.green:'#a9cfc8',i===pos?C.amber:'none',3)}
  out+=TF(x0-10,150,'Hat level',13,C.muted,'end')+L(x0,170,x0+16*cw,170,C.line,1.5);
  out+=X3_grid(X,[{name:'Accent',col:C.amber,pat:s.acc,act:'acc'}],pos,{y0:200,ch:40});
  const n=s.acc.filter(Boolean).length;
  out+=counter(160,262,'accented steps',n+' of 16',C.amber,130)+counter(310,262,'tempo',126+' BPM',C.blue,130);
  out+=T(300,344,'Every step still plays; only the loudness changes.',15,C.ink);
  return {svg:out,phase:`${n} of the 16 hats are accented by ${s.amt}%. On the TR-909 one accent track raises every drum sounding on that step, which is why accents shape the feel of the whole pattern. ${X3_NOTE}`};
 }});

const X3_HYB=[
 ['Bass drum','analogue','A sine-like tone with a fast pitch drop and a click at the front for punch.',at=>X3_V.kick909(at)],
 ['Snare','analogue','Tuned oscillators plus noise, with a “snappy” control for the noise level.',at=>X3_V.snare(at)],
 ['Toms','analogue','Pitched oscillators with a falling pitch, in low, mid and high versions.',at=>X3_V.tom(at)],
 ['Handclap','analogue','Filtered noise fired in quick bursts, as on the 808.',at=>X3_V.clap(at)],
 ['Hi-hats','sampled','Short digital recordings of real hi-hats, stored in memory chips and shaped by an analogue envelope.',at=>X3_V.oh(at)],
 ['Cymbals','sampled','Crash and ride are also low-resolution digital recordings, commonly given as 6-bit, which adds their grainy shimmer.',at=>AUDIO.hit({at,dur:.6,gain:.06,type:'highpass',cutoff:5000})]];
SCENE({id:'tr-909-hybrid',name:'Half analogue, half sampled',tag:'Synthesised drums, recorded metal',
 definition:'The TR-909 is a hybrid: its drums are analogue circuits, like the 808’s, but its hi-hats and cymbals are short digital recordings. It was also Roland’s first drum machine with MIDI.',
 example:'The kick you hear on thousands of house and techno records is a synthesised tone. The hi-hat that answers it is a few thousand numbers read from a memory chip.',
 desc:'Six voices sorted into two boxes, analogue circuits and digital samples; pressing a voice plays it and describes it.',
 research:['Roland Corporation (1983). TR-909 owner’s manual and service notes.','Vail, M. (2000). Vintage Synthesizers. 2nd edn. Miller Freeman.'],
 dur:12,hint:'Press each voice to hear it and see which side it sits on. '+X3_NOTE,
 init:()=>({v:0}),watch(p){return {v:Math.min(5,Math.floor(p*6))}},
 ui:[{b:'Play it again',act:'again'}],
 on:{voice(s,v){s.v=Number(v);X3_HYB[s.v][3](0);return 'keep'},again(s){X3_HYB[s.v][3](0);return 'keep'}},
 draw(s,f,X){
  let out=heading('Which 909 sounds are recordings?');
  out+=R(30,50,330,112,C.pale,'none',10)+TBF(46,72,'Analogue circuits',13,C.blue,'start')+R(374,50,196,112,C.purplep,'none',10)+TBF(390,72,'Digital samples',13,C.purple,'start');
  const pos=[[46,84],[204,84],[46,122],[204,122],[390,84],[390,122]];
  X3_HYB.forEach((q,i)=>{const [x,y]=pos[i],on=i===s.v,w=i<4?142:164,col=q[1]==='analogue'?C.blue:C.purple;out+=hit(X,'voice',i,q[0]+': press to play',R(x,y,w,30,on?col:'#fff',col,8)+TF(x+w/2,y+20,q[0],13,on?'#fff':C.ink))});
  const q=X3_HYB[s.v];out+=R(30,176,540,112,'#fff',C.grid,10)+TB(48,204,q[0]+' · '+q[1],16,q[1]==='analogue'?C.blue:C.purple,'start')+X3_para(48,232,q[2],58);
  out+=T(300,318,'1983: about 10,000 made, and the first Roland drum machine with MIDI.',14,C.ink)+T(300,350,X3_NOTE,13,C.muted);
  return {svg:out,phase:`${q[0]} (${q[1]}): ${q[2]}`};
 }});

/* ---------- tb-303 ---------- */
// An original line in A minor (MIDI notes), written for this page.
const X3_LINE=[45,45,57,45,48,45,52,43,45,57,45,55,48,45,52,50];
const X3_lp=(f,fc,q)=>1/Math.sqrt(Math.pow(1-(f/fc)*(f/fc),2)+Math.pow(f/(fc*q),2));
function X3_filterPlot(x,y,w,h,cut,top,res){
 const lf=v=>x+Math.log(v/50)/Math.log(200)*w,q=Math.max(.7,res/2.5),Y=g=>y+h-clamp((20*Math.log10(g)+30)/55,0,1)*h;
 let out=R(x,y,w,h,'#fff',C.grid,6)+TF(x,y-8,'what the filter lets through',13,C.muted,'start');
 const curve=(fc,col,wd,dash)=>{let d='';for(let k=0;k<=90;k++){const f=50*Math.pow(200,k/90);d+=(k?'L':'M')+fmt(lf(f))+' '+fmt(Y(X3_lp(f,fc,q)))}return P(d,col,wd,'none',dash?'stroke-dasharray="5 5"':'')};
 out+=curve(clamp(top,60,9500),C.coral,2,true)+curve(clamp(cut,60,9500),C.blue,2.8,false);
 for(const [v,l] of [[100,'100'],[1000,'1k'],[10000,'10k Hz']])out+=TF(lf(v),y+h+17,l,12,C.muted);
 return out;
}
const X3_303SPEC={ms:()=>X3_stepMs(124),N:()=>16,step(s,i,at){const st=X3_stepMs(124)/1000;AUDIO.acid(midiHz(X3_LINE[i]),{at,dur:st*.85,gain:.1,cutoff:s.cut,env:s.env,res:s.res,decay:.16});if(i%4===0)X3_V.kick909(at,.7)}};
const X3_303H=X3_loop(X3_303SPEC,{cut(s,v){s.cut=Number(v);return 'keep'},res(s,v){s.res=Number(v);return 'keep'},env(s,v){s.env=Number(v);return 'keep'}});
SCENE({id:'tb-303',name:'The TB-303 filter',tag:'Cutoff, resonance, envelope',
 definition:'The Roland TB-303 (1981) is a one-oscillator bass synthesiser with a built-in sequencer. Its character comes from a resonant low-pass filter: cutoff sets how bright the note is, resonance adds a whistling peak at the cutoff, and an envelope sweeps the cutoff down on every note.',
 example:'Low cutoff and no resonance gives a dull, round bass. Raise the resonance and the envelope and each note starts with a squelch as the peak sweeps down through the harmonics.',
 desc:'A graph of the filter’s response with its resting curve and the brighter curve at the start of each note, beside a sixteen-step bassline shown as a piano roll.',
 research:['Roland Corporation (1981). TB-303 Bass Line owner’s manual.','Stinchcombe, T. Analysis of the Moog transistor ladder and derivative filters (includes the TB-303 filter).','Vail, M. (2000). Vintage Synthesizers. Miller Freeman.'],
 dur:12,hint:'Press Play, then move one slider at a time. Changes are heard from the next beat. '+X3_NOTE,
 init:()=>({cut:400,res:10,env:1600,playing:false,pos:-1}),
 watch(p){return {cut:Math.round(250+p*900),res:Math.round(4+p*12),env:1600,playing:false,pos:-1}},
 ui:[{b:'Play / stop',act:'play'},{range:'cut',label:'Cutoff',min:100,max:2000,step:20,get:s=>s.cut,act:'cut',show:v=>v+' Hz'},
  {range:'res',label:'Resonance',min:1,max:18,step:1,get:s=>s.res,act:'res'},{range:'env',label:'Envelope',min:0,max:3000,step:50,get:s=>s.env,act:'env',show:v=>'+'+v+' Hz'}],
 on:X3_303H,
 draw(s,f,X){
  const pos=X3_pos(s,X,16);let out=heading(s.res>=12&&s.env>=1000?'Squelch: a resonant peak sweeping down':s.res<=4?'Round and plain: little resonance':'Brighter at the start of each note');
  out+=X3_filterPlot(40,74,250,150,s.cut,s.cut+s.env,s.res);
  out+=L(48,262,72,262,C.coral,2,'stroke-dasharray="5 5"')+TF(78,266,'note starts',12,C.muted,'start')+L(170,262,194,262,C.blue,2.8)+TF(200,266,'note settles',12,C.muted,'start');
  const rx=330,cw=15,lo=42,hi=58,ry=74,rh=150;out+=R(rx,ry,cw*16,rh,'#fff',C.grid,6)+TF(rx,ry-8,'the bassline, 16 steps',13,C.muted,'start');
  X3_LINE.forEach((n,i)=>{const y=ry+rh-8-(n-lo)/(hi-lo)*(rh-16);out+=R(rx+i*cw+1.5,y-4,cw-3,8,i===pos?C.amber:C.purple,'none',3)});
  out+=counter(60,284,'cutoff',s.cut+' Hz',C.blue,110)+counter(184,284,'resonance',String(s.res),C.purple,110)+counter(308,284,'envelope',`+${s.env} Hz`,C.coral,110)+counter(432,284,'tempo','124 BPM',C.green,110);
  out+=T(300,358,X3_NOTE,13,C.muted);
  return {svg:out,phase:`Each note opens the filter to about ${s.cut+s.env} Hz and lets it fall back to ${s.cut} Hz. With resonance at ${s.res}, the frequencies near the cutoff are ${s.res>=12?'strongly':'slightly'} boosted, so you hear the sweep itself. ${X3_NOTE}`};
 }});

const X3_AS=[45,45,48,45,52,45,43,57];
const X3_ASSPEC={ms:()=>X3_stepMs(124),N:()=>8,step(s,i,at){const st=X3_stepMs(124)/1000,prev=X3_AS[(i+7)%8];
 AUDIO.acid(midiHz(X3_AS[i]),{at,dur:st*(s.sl[i]?1.05:.6),gain:.1,cutoff:380,env:1500,res:12,decay:.16,accent:!!s.ac[i],slideFrom:s.sl[i]?midiHz(prev):0});if(i%4===0)X3_V.kick909(at,.7)}};
const X3_ASH=X3_loop(X3_ASSPEC,{tog(s,v){const [r,i]=String(v).split(':').map(Number);const a=r===0?s.ac:s.sl;a[i]=a[i]?0:1;return 'keep'}});
SCENE({id:'tb-303-accent-slide',name:'Accent and slide',tag:'Two switches per step',
 definition:'Each step of a TB-303 pattern has two switches. Accent makes the note louder and opens the filter further. Slide glides the pitch from the previous note and joins the two notes into one.',
 example:'The same eight notes can sound stiff or rubbery. Slide into the high note and accent the one after it and the line starts to talk.',
 desc:'Eight notes drawn as a pitch line, with slanted joins where slide is on and larger dots where accent is on, above two rows of toggles.',
 research:['Roland Corporation (1981). TB-303 Bass Line owner’s manual: accent and slide.','Vail, M. (2000). Vintage Synthesizers. Miller Freeman.'],
 dur:10,hint:'Press Play, then toggle accent and slide on different steps. Changes are heard from the next beat. '+X3_NOTE,
 init:()=>({ac:[0,0,0,1,0,0,0,1],sl:[0,0,1,0,0,0,0,1],playing:false,pos:-1}),
 watch(p){return p<.4?{ac:Array(8).fill(0),sl:Array(8).fill(0),playing:false,pos:-1}:{ac:[0,0,0,1,0,0,0,1],sl:[0,0,1,0,0,0,0,1],playing:false,pos:-1}},
 ui:[{b:'Play / stop',act:'play'}],
 on:X3_ASH,
 draw(s,f,X){
  const pos=X3_pos(s,X,8),x0=124,cw=54;let out=heading('Eight notes, two switches each');
  out+=R(x0,56,cw*8,112,'#fff',C.grid,6);const Y=n=>160-(n-42)/(58-42)*96,cx=i=>x0+i*cw+cw/2;
  X3_AS.forEach((n,i)=>{const y=Y(n);
   if(s.sl[i]&&i>0)out+=L(cx(i-1)+12,Y(X3_AS[i-1]),cx(i)-10,y,C.purple,3);
   out+=L(cx(i)-10,y,cx(i)+(s.sl[i]?16:6),y,C.purple,s.ac[i]?6:3.5)+Ci(cx(i)-10,y,s.ac[i]?8:5,i===pos?C.amber:C.purple)});
  out+=TF(x0-10,116,'Pitch',13,C.muted,'end');
  out+=X3_grid(X,[{name:'Accent',col:C.coral,pat:s.ac,act:'tog'},{name:'Slide',col:C.purple,pat:s.sl,act:'tog'}],pos,{x0,cw,y0:196,ch:40,n:8});
  const a=s.ac.filter(Boolean).length,l=s.sl.filter(Boolean).length;
  out+=T(300,308,a+l?`${a} accent${a===1?'':'s'}, ${l} slide${l===1?'':'s'}: the notes are the same, the phrasing is not.`:'No accents or slides: every note is separate and equal.',15,C.ink)+T(300,350,X3_NOTE,13,C.muted);
  return {svg:out,phase:`Accent raises a note’s level and its filter sweep together. Slide starts the note at the previous pitch and glides up or down in about 60 ms, holding the two notes together. ${X3_NOTE}`};
 }});

X3_cards({id:'tb-303-story',name:'From backing bassist to acid',tag:'A product that failed, a sound that did not',
 definition:'The TB-303 was sold as an automatic bass player for people practising alone. It failed at that, was discontinued, and was then turned into something new by producers who used its filter as the lead voice: acid house.',
 example:'Phuture’s “Acid Tracks”, released in 1987, is about twelve minutes of one 303 pattern with the filter knobs turned by hand.',
 desc:'Six cards from the 1981 launch to the acid records of the late 1980s and the machine’s afterlife.',
 research:['Roland Corporation (1981). TB-303 Bass Line owner’s manual.','Reynolds, S. (2013). Energy Flash: A Journey Through Rave Music and Dance Culture. Rev. edn. Faber.','Brewster, B. & Broughton, F. (2006). Last Night a DJ Saved My Life. Headline.','Singh, C. (1982). Synthesizing: Ten Ragas to a Disco Beat. EMI India (reissued 2010).'],
 foot:'Dates and unit counts are as commonly reported.',
 items:[
  {chip:'1981',title:'A bass player in a box',when:'1981',text:'Roland sells the TB-303 “Bass Line” with the TR-606 drum machine, as backing for guitarists and organists playing alone. You program it one step at a time, which most buyers find awkward.'},
  {chip:'1984',title:'Discontinued',when:'1984',text:'It does not sound like a bass guitar, and about 10,000 are made before production stops. Used machines sell very cheaply.'},
  {chip:'Mumbai',title:'Charanjit Singh',when:'1982',text:'The Indian session musician Charanjit Singh records “Synthesizing: Ten Ragas to a Disco Beat” with a 303, an 808 and a Jupiter-8. It sells little, and is rediscovered decades later as a striking early use of the machines.'},
  {chip:'Chicago',title:'Phuture',when:'1985–87',text:'DJ Pierre, Spanky and Herb J turn the knobs of a second-hand 303 while a pattern plays. Ron Hardy plays the tape at the Music Box; Marshall Jefferson produces the record, released on Trax in 1987 as “Acid Tracks”.'},
  {chip:'Acid',title:'A genre from one box',when:'1987–89',text:'The squelching line gives acid house its name and crosses to Britain within a year. Techno producers in Detroit, Berlin and elsewhere add the sound to harder drums.'},
  {chip:'After',title:'Clones and software',when:'since',text:'Original machines now sell for many times their first price. Hardware copies and software models are everywhere, and Roland released its own small reissue in 2016.'}]});

/* ---------- step-sequencer ---------- */
const X3_SQSND={kick:['Kick',at=>X3_V.kick909(at)],hat:['Hi-hat',at=>X3_V.ch(at,1.2)],clap:['Clap',at=>X3_V.clap(at)],cow:['Cowbell',at=>X3_V.cow(at)]};
const X3_SQSPEC={ms:s=>X3_stepMs(s.bpm),N:()=>16,step(s,i,at){if(s.pat[i])X3_SQSND[s.snd][1](at)}};
const X3_SQH=X3_loop(X3_SQSPEC,{tog(s,v){const i=Number(String(v).split(':')[1]);s.pat[i]=s.pat[i]?0:1;return 'keep'},
 bpm(s,v,ctx){s.bpm=Number(v);X3_restart(s,ctx,X3_SQSPEC,X3_SQH);return 'keep'},snd(s,v){s.snd=v;return 'keep'}});
SCENE({id:'step-sequencer',name:'The step sequencer',tag:'Music as a row of switches',
 definition:'A step sequencer divides the bar into equal steps, usually sixteen, and plays a sound on each step that is switched on. You do not need to play in time: the machine does the timing, and you choose the pattern.',
 example:'At 120 BPM a beat lasts half a second, so each of the four steps in a beat lasts 125 ms. At 130 BPM a step lasts about 115 ms.',
 desc:'One row of sixteen step switches with a moving playhead, a choice of sound, a tempo slider, and the arithmetic of step length.',
 research:['Roland Corporation (1980). TR-808 owner’s manual: step and tap write.','Butler, M. J. (2006). Unlocking the Groove. Indiana University Press.','Music In Motion: rhythm and sequencing.'],
 dur:10,hint:'Press Play, switch steps on and off, and change the tempo. The step length follows 60 ÷ BPM ÷ 4. '+X3_NOTE,
 init:()=>({bpm:120,snd:'kick',pat:X3_fromIdx([0,4,8,12]),playing:false,pos:-1}),
 watch(p){return {bpm:120,snd:'kick',pat:X3_fromIdx(p<.5?[0,4,8,12]:[0,3,6,10,12]),playing:false,pos:-1}},
 ui:[{b:'Play / stop',act:'play'},{choose:Object.keys(X3_SQSND).map(k=>[k,X3_SQSND[k][0]]),label:'Sound',get:s=>s.snd,act:'snd'},{range:'bpm',label:'Tempo',min:60,max:160,step:1,get:s=>s.bpm,act:'bpm',show:v=>v+' BPM'}],
 on:X3_SQH,
 draw(s,f,X){
  const pos=X3_pos(s,X,16),ms=X3_stepMs(s.bpm);let out=heading('One bar, sixteen switches');
  out+=X3_grid(X,[{name:X3_SQSND[s.snd][0],col:C.blue,pat:s.pat,act:'tog'}],pos,{y0:78,ch:56});
  out+=R(90,152,420,58,'#fff',C.grid,10)+TMF(300,176,`60 ÷ ${s.bpm} BPM = ${(60/s.bpm).toFixed(3)} s per beat`,14,C.ink)+TMF(300,198,`÷ 4 steps = ${Math.round(ms)} ms per step`,14,C.blue);
  out+=counter(124,232,'steps switched on',s.pat.filter(Boolean).length+' of 16',C.blue,130)+counter(274,232,'one step',Math.round(ms)+' ms',C.purple,130)+counter(424,232,'one bar',(ms*16/1000).toFixed(2)+' s',C.green,130);
  out+=T(300,318,'The machine keeps time; you choose where the sounds fall.',15,C.ink)+T(300,350,X3_NOTE,13,C.muted);
  return {svg:out,phase:`At ${s.bpm} BPM a beat lasts ${(60/s.bpm).toFixed(3)} s and each sixteenth-note step ${Math.round(ms)} ms. Programming by switches, rather than playing by hand, is why these patterns are so exact and so easy to change.`};
 }});

const X3_SWSPEC={ms:()=>X3_stepMs(122),N:()=>16,sw:s=>(2*s.r/100-1),step(s,i,at){X3_V.ch(at,i%2?.8:1.1);if(i%4===0)X3_V.kick909(at,.9);if(i===4||i===12)X3_V.clap(at,.8)}};
const X3_SWH=X3_loop(X3_SWSPEC,{r(s,v){s.r=Number(v);return 'keep'}});
SCENE({id:'step-sequencer-swing',name:'Swing',tag:'Every second step arrives late',
 definition:'Swing, or shuffle, delays every second sixteenth-note step. At 50% the steps are even. At about 66% the late step falls two-thirds of the way through each pair, which is a triplet feel.',
 example:'At 122 BPM a step lasts about 123 ms. With 58% swing every second step arrives about 20 ms late: too little to count, enough to feel.',
 desc:'Sixteen steps on a timeline, with every second step shifted right by the swing amount, a faint grid showing the even positions, and a slider from 50% to 70%.',
 research:['Roland Corporation (1983). TR-909 owner’s manual: shuffle.','Linn, R. (2013). Interview on swing and the MPC timing percentages. Attack Magazine.','Butterfield, M. (2011). Why do jazz musicians swing their eighth notes? Music Theory Spectrum 33(1), 3–26.'],
 dur:10,hint:'Press Play and move the slider slowly from 50% towards 66%. Changes are heard from the next beat. '+X3_NOTE,
 init:()=>({r:50,playing:false,pos:-1}),
 watch(p){return {r:Math.round(50+p*18),playing:false,pos:-1}},
 ui:[{b:'Play / stop',act:'play'},{range:'r',label:'Swing',min:50,max:70,step:1,get:s=>s.r,act:'r',show:v=>v+'%'}],
 on:X3_SWH,
 draw(s,f,X){
  const pos=X3_pos(s,X,16),x0=60,cw=30,st=X3_stepMs(122),off=(2*s.r/100-1);let out=heading(s.r===50?'Straight: every step evenly spaced':s.r>=64?'Close to a triplet shuffle':'A light swing');
  out+=L(x0,150,x0+16*cw,150,C.line,2);
  for(let i=0;i<=16;i++)out+=L(x0+i*cw,i%4===0?112:132,x0+i*cw,150,i%4===0?C.line:C.grid,i%4===0?2:1.5);
  for(let i=0;i<16;i++){const x=x0+(i+(i%2?off:0))*cw;out+=Ci(x,150,i%2?7:10,i===pos?C.amber:(i%2?C.coral:C.blue));if(i%2&&off>0)out+=L(x0+i*cw,166,x,166,C.coral,2)}
  for(let b=0;b<4;b++)out+=TF(x0+b*4*cw,104,String(b+1),13,C.muted);
  out+=Ci(80,200,10,C.blue)+TF(96,205,'on-step: stays put',13,C.muted,'start')+Ci(300,200,7,C.coral)+TF(314,205,'second step of each pair: late',13,C.muted,'start');
  out+=counter(124,232,'swing',s.r+'%',C.coral,130)+counter(274,232,'late by',Math.round(off*st)+' ms',C.purple,130)+counter(424,232,'tempo','122 BPM',C.blue,130);
  out+=T(300,318,'50% is straight; about 66% is a triplet.',15,C.ink)+T(300,350,X3_NOTE,13,C.muted);
  return {svg:out,phase:`With ${s.r}% swing the first step of each pair takes ${s.r}% of the pair’s time, so the second arrives ${Math.round(off*st)} ms late at 122 BPM. Drum machines made swing a number you can set, and a few per cent changes how a pattern feels.`};
 }});

const X3_CHA={AAAA:'A A A A',AAAB:'A A A B',ABAB:'A B A B',AABB:'A A B B'};
const X3_PA={k:X3_fromIdx([0,4,8,12]),c:X3_fromIdx([4,12]),h:X3_fromIdx([2,6,10,14])},X3_PB={k:X3_fromIdx([0,4,8,11,14]),c:X3_fromIdx([4,12,13,15]),h:X3_fromIdx([2,6,10])};
const X3_CHSPEC={ms:()=>X3_stepMs(126),N:()=>64,step(s,i,at){const P_=s.ch[Math.floor(i/16)]==='B'?X3_PB:X3_PA,j=i%16;if(P_.k[j])X3_V.kick909(at);if(P_.c[j])X3_V.clap(at,.9);if(P_.h[j])X3_V.oh(at,.9)}};
const X3_CHH=X3_loop(X3_CHSPEC,{ch(s,v){s.ch=v;return 'keep'}});
SCENE({id:'step-sequencer-chain',name:'Chaining patterns',tag:'Bars become phrases',
 definition:'One bar repeated for ever is a loop. Drum machines let you store several patterns and chain them, so a variation arrives at a set point, most often the last bar of four.',
 example:'Pattern A is the basic beat; pattern B adds a kick and a clap fill. Chained as A A A B, the fill lands every fourth bar and tells the dancer a new phrase is about to start.',
 desc:'Four bars drawn as boxes labelled A or B with a playhead, the two patterns as small grids beneath, and a choice of chain.',
 research:['Roland Corporation (1983). TR-909 owner’s manual: pattern and track play.','Butler, M. J. (2006). Unlocking the Groove (on hypermetre and four-bar groups). Indiana University Press.'],
 dur:12,hint:'Press Play and listen through all four bars before changing the chain. '+X3_NOTE,
 init:()=>({ch:'AAAB',playing:false,pos:-1}),
 watch(p){return {ch:p<.5?'AAAA':'AAAB',playing:false,pos:-1}},
 ui:[{b:'Play / stop',act:'play'},{choose:Object.keys(X3_CHA).map(k=>[k,X3_CHA[k]]),label:'Chain',get:s=>s.ch,act:'ch'}],
 on:X3_CHH,
 draw(s,f,X){
  const pos=X3_pos(s,X,64),bar=pos<0?-1:Math.floor(pos/16);let out=heading(s.ch==='AAAA'?'One pattern, repeated':'A variation marks the phrase');
  for(let b=0;b<4;b++){const k=s.ch[b],x=66+b*120;out+=R(x,52,108,58,k==='B'?C.coralp:C.pale,b===bar?C.amber:'none',10)+TBF(x+54,90,k,24,k==='B'?C.coral:C.blue)+TF(x+54,128,'bar '+(b+1),12,C.muted);
   if(b===bar)out+=L(x+(pos%16)/16*108,52,x+(pos%16)/16*108,110,C.amber,3)}
  const mini=(P_,y,name,col)=>{let o=TBF(60,y+26,name,15,col,'start');[['k','kick'],['c','clap'],['h','hat']].forEach(([key,lab],r)=>{o+=TF(132,y+11+r*13,lab,11,C.muted,'end');for(let i=0;i<16;i++)o+=R(140+i*25,y+r*13,22,10,P_[key][i]?col:(i%4===0?'#cfdbe3':'#e6edf1'),'none',2)});return o};
  out+=mini(X3_PA,146,'A',C.blue)+mini(X3_PB,200,'B',C.coral);
  const nb=s.ch.split('').filter(c=>c==='B').length;
  out+=counter(160,256,'bars of B in four',String(nb),C.coral,130)+counter(310,256,'four bars last',(X3_stepMs(126)*64/1000).toFixed(1)+' s',C.green,130);
  out+=T(300,330,nb?'The change tells you where the phrase turns.':'Nothing marks the fourth bar: the loop has no shape.',15,C.ink)+T(300,356,X3_NOTE,13,C.muted);
  return {svg:out,phase:`Chain ${X3_CHA[s.ch]}: ${nb?`pattern B plays in ${nb} of every four bars`:'the same bar every time'}. Dance music is counted in groups of four, eight and sixteen bars, and small variations at the ends of those groups are how a loop becomes a phrase.`};
 }});
