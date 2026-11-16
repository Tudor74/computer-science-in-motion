/* ===================== Techno era 1 · Roots (1970–1984) ===================== */
// Kraftwerk's machines, Moroder's sequenced disco, electro and Chicago house: the ingredients before the name.
// Sound scenes are step grids: Play starts ctx.every ticks that move a playhead held in the state and sound each
// step from the handler. Watch derives the playhead from lesson time and is silent. Every pattern here is an
// original pattern in the style; no real track is reproduced. The voices are simplified models of the machines.
/* X1-HELPERS-START */
const X1_wrap=(str,n)=>{const out=[];let line='';for(const w of String(str).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out};
const X1_lines=(x,y,str,n=44,size=13,fill=C.ink,lh=18)=>X1_wrap(str,n).map((l,i)=>TF(x,y+i*lh,l,size,fill,'start')).join('');
// A small grey label centred under the heading.
const X1_note=t=>{const w=t.length*6.6+24;return R(300-w/2,40,w,22,'#e8eef2','none',11)+TF(300,55,t,13,C.muted)};
const X1_stepMs=bpm=>60000/bpm/4;
// A list of pressable items on the left and the chosen item's text on the right.
function X1_cards(o){
 const n=o.items.length;
 SCENE({id:o.id,name:o.name,tag:o.tag,definition:o.definition,example:o.example,desc:o.desc,research:o.research,dur:o.dur||12,hint:o.hint,
  init:()=>({i:0}),
  watch(p){return {i:Math.min(n-1,Math.floor(p*n))}},
  ui:[{b:'Previous',act:'prev'},{b:'Next',act:'next'}],
  on:{pick(s,v){s.i=clamp(+v,0,n-1);return 'keep'},next(s){s.i=(s.i+1)%n;return 'keep'},prev(s){s.i=(s.i+n-1)%n;return 'keep'}},
  draw(s,f,X){
   const it=o.items[s.i],rh=Math.min(40,264/n),dw=o.dw||46;let out=heading(o.heading)+(it.note?X1_note(it.note):'');
   o.items.forEach((q,i)=>{const y=74+i*rh,on=i===s.i;
    out+=hit(X,'pick',i,q.t,R(16,y,236,rh-5,on?C.pale:'#fff',on?C.blue:C.grid,7)+TBF(26,y+rh/2+2,q.d,13,on?C.blue:C.muted,'start')+TF(26+dw,y+rh/2+2,q.t,13,C.ink,'start'))});
   out+=R(262,74,322,264,'#f6f9fb','none',10)+TBF(276,98,it.title||it.t,15,C.ink,'start')+X1_lines(276,124,it.text,45);
   if(o.foot)out+=T(300,364,o.foot,15,C.muted);
   return {svg:out,phase:it.phase};
  }});
}
// A 16-step grid of tracks. o.tracks: [{name,col,pat,cycle?,labels?,sound(s,at,v,pos,k)}]. Optional o.presets
// [{name,pat,set?(s)}], o.ui, o.on, o.init, o.swing(s) (delay of every second 16th, as a fraction of a step),
// o.mute(s,k), o.below(s,X,pos,y), o.heading(s), o.phase(s), o.tempo [min,max].
function X1_grid(o){
 const fresh=k=>{const s={playing:false,pos:-1,token:0,bpm:o.bpm||124,preset:k,pat:(o.presets?o.presets[k].pat:o.tracks.map(t=>t.pat)).map(r=>r.slice()),...(o.init?o.init():{})};if(o.presets&&o.presets[k].set)o.presets[k].set(s);return s};
 const restart=(s,ctx)=>{if(s.playing){s.token++;s.pos=-1;ctx.every(X1_stepMs(s.bpm),'tick',s.token)}};
 const dur=o.dur||12,y0=o.y0||70,rh=o.rh||28;
 SCENE({id:o.id,name:o.name,tag:o.tag,definition:o.definition,example:o.example,desc:o.desc,research:o.research,dur,hint:o.hint,
  init:()=>fresh(0),
  watch(p){const k=o.presets?Math.min(o.presets.length-1,Math.floor(p*o.presets.length)):0;return {...fresh(k),...(o.watch?o.watch(p):{})}},
  ui:[...(o.presets?[{choose:o.presets.map((q,i)=>[String(i),q.name]),label:o.presetLabel||'Pattern',get:s=>String(s.preset),act:'preset'}]:[]),...(o.ui||[]),
   ...(o.tempo?[{range:'bpm',label:'Tempo (BPM)',min:o.tempo[0],max:o.tempo[1],step:1,get:s=>s.bpm,act:'bpm'}]:[]),{b:'Play / stop',act:'play'}],
  on:{
   play(s,a,ctx){s.token++;if(s.playing){s.playing=false;s.pos=-1;AUDIO.stopAll();return 'keep'}s.playing=true;s.pos=-1;ctx.every(X1_stepMs(s.bpm),'tick',s.token);return 'keep'},
   tick(s,tok){if(!s.playing||Number(tok)!==s.token)return 'stop';s.pos=(s.pos+1)%16;
    const at=s.pos%2?(o.swing?o.swing(s):0)*X1_stepMs(s.bpm)/1000:0;
    o.tracks.forEach((t,k)=>{const v=s.pat[k][s.pos];if(v&&!(o.mute&&o.mute(s,k)))t.sound(s,at,v,s.pos,k)});return 'keep'},
   tog(s,v){const k=Math.floor(v/16),i=v%16;s.pat[k][i]=(s.pat[k][i]+1)%(o.tracks[k].cycle||2);s.preset=-1;return 'keep'},
   preset(s,v,ctx){const k=+v,was=s.playing,tok=s.token;Object.assign(s,fresh(k));s.token=tok;s.playing=was;restart(s,ctx);return 'keep'},
   bpm(s,v,ctx){s.bpm=+v;restart(s,ctx);return 'keep'},...(o.on||{})},
  draw(s,f,X){
   const pos=X.try?(s.playing?s.pos:-1):Math.floor(X.p*dur*s.bpm/60*4)%16;
   let out=heading(o.heading(s))+(o.note?X1_note(o.note):'');
   o.tracks.forEach((t,k)=>{const y=y0+k*rh,off=o.mute&&o.mute(s,k);
    out+=TF(94,y+rh/2+2,t.name,13,off?'#a9b8c1':C.muted,'end');
    for(let i=0;i<16;i++){const x=100+i*30,v=s.pat[k][i],beat=i%4===0,cur=i===pos;
     const inner=R(x+1.5,y,27,rh-5,v?(off?'#cfd9df':t.col):(beat?'#e9f0f4':'#fff'),cur?C.amber:(v?'none':C.grid),4)+(v&&t.labels?TF(x+15,y+rh/2+2,t.labels[v],12,'#fff'):'');
     out+=hit(X,'tog',k*16+i,`${t.name}, step ${i+1}: ${v?(t.labels?t.labels[v]:'on'):'off'}. Press to change.`,inner)}});
   const yb=y0+o.tracks.length*rh;
   for(let b=0;b<4;b++)out+=TF(115+b*120,yb+10,String(b+1),12,C.muted);
   if(o.below)out+=o.below(s,X,pos,yb+18);
   return {svg:out,phase:o.phase(s)};
  }});
 return restart;
}
/* Voices: simplified models, gentle levels. Call only from handlers. */
const X1_V={
 kick:(at,long)=>AUDIO.kick({at,from:long?130:170,to:long?42:50,decay:long?.5:.28,gain:.3}),
 snare:at=>{AUDIO.hit({at,dur:.12,gain:.11,type:'bandpass',cutoff:1800,q:.7});AUDIO.tone(190,{at,dur:.08,type:'triangle',gain:.07,attack:.002,release:.06})},
 clap:at=>AUDIO.hit({at,dur:.11,gain:.13,type:'bandpass',cutoff:1300,q:1.2}),
 ch:at=>AUDIO.hit({at,dur:.04,gain:.06,cutoff:8000}),
 oh:at=>AUDIO.hit({at,dur:.2,gain:.06,cutoff:7000}),
 bell:at=>{AUDIO.tone(540,{at,dur:.09,type:'square',gain:.04,attack:.002,release:.07});AUDIO.tone(800,{at,dur:.09,type:'square',gain:.03,attack:.002,release:.07})},
 bass:(m,at,dur,o={})=>AUDIO.acid(midiHz(m),{at,dur,gain:o.gain||.13,cutoff:o.cutoff||500,env:o.env==null?900:o.env,res:o.res||3,decay:.12,type:o.type||'sawtooth'})
};
/* X1-HELPERS-END */

/* =========================== kraftwerk =========================== */
X1_cards({id:'kraftwerk',name:'Kraftwerk',tag:'Pop music made by machines, on purpose',
 definition:'Kraftwerk, founded in Düsseldorf in 1970 by Ralf Hütter and Florian Schneider, made records in which synthesisers, sequencers and electronic drums were the whole band, and the mechanical sound was the point.',
 example:'Trans-Europe Express (1977) builds a whole track from a train-like electronic rhythm and a few synthesiser lines. There is no guitar, no drum kit and no blues scale.',
 desc:'Six pressable albums and events from 1970 to 1982, each with what it added to the idea of music made by machines.',
 research:'Bussy, P. (1993). Kraftwerk: Man, Machine and Music. SAF. Schütte, U. (2020). Kraftwerk: Future Music from Germany. Penguin. Sicko, D. (1999). Techno Rebels. Billboard Books.',
 hint:'Press each year. Notice how early these records are: the last one is from 1981.',heading:'Kraftwerk: the man-machine',dw:46,
 items:[
  {d:'1970',t:'Kling Klang studio',text:'Ralf Hütter and Florian Schneider set up their own studio in Düsseldorf and call it Kling Klang. They treat the studio itself as the instrument and keep control of how their records are made.',phase:'Kraftwerk began as an experimental group with flutes and organs. Owning the studio let them rebuild their sound around machines over the next few years.'},
  {d:'1974',t:'Autobahn',text:'A 22-minute piece about driving on the motorway, built on synthesisers and electronic percussion. An edited version becomes an international hit in 1975.',phase:'Autobahn showed that a pop audience would accept a record whose main voices were synthesisers. It still used some flute and guitar.'},
  {d:'1977',t:'Trans-Europe Express',text:'Sequenced rhythms imitate a train. The melodies are simple and European, far from rock and blues. American club and radio DJs pick it up.',phase:'This is the record most often named by early hip-hop, electro and Detroit musicians. Its steady, repeating machine rhythm is the template.'},
  {d:'1978',t:'The Man-Machine',text:'The group present themselves as part human, part machine, with robot stand-ins on stage and on the sleeve. The image matches the sound.',phase:'The “man-machine” idea matters for techno: the machine is not hidden or made to sound human. It is a partner, and its precision is part of the feeling.'},
  {d:'1981',t:'Computer World',text:'An album about a society run on computers, made before home computers were common. Its track “Numbers” has a hard electronic beat that dancers and DJs loved.',phase:'Computer World is funkier than its title suggests. Its rhythms were quickly reused by electro producers in New York, Detroit and Miami.'},
  {d:'1982',t:'Heard in the Bronx',text:'Afrika Bambaataa and the Soulsonic Force release “Planet Rock”, which replays a Kraftwerk melody over a beat modelled on “Numbers”, played on a Roland TR-808.',phase:'A German art group became a foundation of Black American dance music. The next scenes follow that route, through electro to Detroit.'}]});

const X1_jit=(hum,pos,k)=>hum?(rng(pos*13+k*7+3)()*2-1)*hum:0;
X1_grid({id:'kraftwerk-machine-pulse',name:'Machine time',tag:'Exactly on the grid, on purpose',
 definition:'A sequencer or drum machine places every sound exactly on a grid of equal steps. Human players drift a few milliseconds early or late. Kraftwerk chose the grid and made its precision part of the music.',
 example:'With looseness at 0 ms every hit lands on its step. At 25 ms the same pattern sounds like a band keeping roughly together.',
 desc:'A three-track step grid for kick, snare and hat, and below it a strip showing where each hit actually lands against the grid lines, as a looseness control spreads them out.',
 research:'Schütte, U. (2020). Kraftwerk: Future Music from Germany. Butler, M. J. (2006). Unlocking the Groove. Indiana University Press. Danielsen, A. (ed.) (2010). Musical Rhythm in the Age of Digital Reproduction. Ashgate (on microtiming).',
 hint:'Press Play, then raise the looseness. Bring it back to 0 to hear machine time. Press steps to change the pattern.',
 bpm:118,tempo:[100,130],note:'simplified drum voices',
 init:()=>({hum:0}),watch(p){return {hum:p<.5?0:24}},
 ui:[{range:'hum',label:'Timing looseness',min:0,max:30,step:1,get:s=>s.hum,act:'hum',show:v=>v+' ms'}],
 on:{hum(s,v){s.hum=+v;return 'keep'}},
 tracks:[
  {name:'Kick',col:C.blue,pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],sound:(s,at,v,pos,k)=>X1_V.kick((s.hum+X1_jit(s.hum,pos,k))/1000)},
  {name:'Snare',col:C.coral,pat:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],sound:(s,at,v,pos,k)=>X1_V.snare((s.hum+X1_jit(s.hum,pos,k))/1000)},
  {name:'Hat',col:C.green,pat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],sound:(s,at,v,pos,k)=>X1_V.ch((s.hum+X1_jit(s.hum,pos,k))/1000)}],
 heading:s=>s.hum?`Loosened by up to ${s.hum} ms`:'Every hit exactly on the grid',
 below(s,X,pos,y){let out=TF(94,y+38,'timing',13,C.muted,'end')+R(100,y+14,480,40,'#fff',C.grid,6);
  for(let i=0;i<16;i++)out+=L(115+i*30,y+16,115+i*30,y+52,i%4===0?C.line:C.grid,1);
  const cols=[C.blue,C.coral,C.green];
  for(let k=0;k<3;k++)for(let i=0;i<16;i++)if(s.pat[k][i]){const dx=X1_jit(s.hum,i,k)/30*12;out+=Ci(115+i*30+dx,y+24+k*10,3.6,cols[k])}
  out+=TF(340,y+72,'dots: where each hit lands · lines: the grid',13,C.muted);
  out+=T(300,y+104,`One step lasts ${Math.round(X1_stepMs(s.bpm))} ms at ${s.bpm} BPM`,15,C.ink);return out},
 phase:s=>s.hum===0?'This is machine time. Every hit is exactly on its step, and the pattern is identical each bar. Kraftwerk and later techno producers treated that sameness as a sound in its own right.':`Each hit is now up to ${s.hum} ms early or late, about what human players do. The step is ${Math.round(X1_stepMs(s.bpm))} ms long, so the pattern is still clear, but the hard edge has gone.`});

X1_cards({id:'kraftwerk-influence',name:'Who was listening',tag:'One group, many scenes',
 definition:'Kraftwerk’s records travelled further than the group did. Radio and club DJs in American cities played them next to funk and disco, and musicians in several scenes took their machine rhythm in different directions.',
 example:'In Detroit the radio DJ known as the Electrifying Mojo played long stretches of Kraftwerk. In New York, Afrika Bambaataa played them at Bronx parties.',
 desc:'Five pressable scenes that drew on Kraftwerk, each with what it took and what it made.',
 research:'Toop, D. (1984). The Rap Attack. Pluto. Sicko, D. (1999). Techno Rebels. Brewster, B. & Broughton, F. (1999). Last Night a DJ Saved My Life. Headline. Reynolds, S. (1998). Energy Flash. Picador.',
 hint:'Press each scene. The same records led to different music in each place.',heading:'Where the machine rhythm went',dw:0,
 items:[
  {d:'',t:'The Bronx: electro',title:'The Bronx: hip-hop and electro',text:'Bambaataa’s “Planet Rock” (1982), produced by Arthur Baker with John Robie, set a Kraftwerk melody to an 808 beat. It started the style called electro. Kraftwerk’s side later reached a settlement over the borrowed material.',phase:'Electro kept Kraftwerk’s precision and added the weight of the TR-808 and the syncopation of funk.'},
  {d:'',t:'Detroit: techno',text:'Juan Atkins, Derrick May and Kevin Saunderson heard Kraftwerk on late-night radio as teenagers. Atkins’s first group, Cybotron, made electro; his later records as Model 500 became the first Detroit techno.',phase:'Detroit musicians often describe their music as a meeting of Kraftwerk’s machines and Black American funk. Era 2 tells that story.'},
  {d:'',t:'Britain: synth-pop',text:'Groups such as the Human League, Orchestral Manoeuvres in the Dark and Depeche Mode built pop songs on synthesisers and drum machines from the late 1970s.',phase:'Synth-pop kept the song and the singer. Its records were in turn played in American clubs and on Detroit radio.'},
  {d:'',t:'Japan: YMO',title:'Japan: Yellow Magic Orchestra',text:'YMO, formed in Tokyo in 1978, were working with sequencers and computers at the same time as Kraftwerk, not after them. Electro producers used their records too.',phase:'The move to machine music happened in several places at once. Kraftwerk were the best known, not the only source.'},
  {d:'',t:'Chicago and Miami',text:'Chicago DJs mixed European electronic records into disco sets, which fed into house. In Miami the 808-heavy electro style became Miami bass.',phase:'By the mid-1980s, drum machines and sequencers were the normal tools of dance music in many American cities.'}]});

/* =========================== moroder-sequencer =========================== */
const X1_DEG=[0,0,7,10,12];
X1_grid({id:'moroder-sequencer',name:'A sequenced bass line',tag:'Sixteen notes a bar, never tired',
 definition:'A sequencer stores a short row of notes and plays it round and round in strict time. In 1977 Giorgio Moroder and Pete Bellotte built Donna Summer’s “I Feel Love” on a synthesiser bass line driven by a sequencer.',
 example:'A player would tire of sixteen even notes a bar for six minutes. The sequencer does not, and it can shift the whole pattern to a new key at the press of one note.',
 desc:'A step grid with a kick drum track and a bass track whose steps cycle through rest, root, fifth, seventh and octave; a transpose control moves the whole bass pattern.',
 research:'Brewster, B. & Broughton, F. (1999). Last Night a DJ Saved My Life. Buskin, R. (2009). Classic Tracks: Donna Summer “I Feel Love”. Sound on Sound. Lawrence, T. (2003). Love Saves the Day. Duke University Press. The pattern here is original, not the record’s.',
 hint:'Press Play. Press a bass step to cycle its note: R root, 5 fifth, 7 seventh, 8 octave, or rest. Then move Transpose.',
 bpm:124,tempo:[100,135],note:'original pattern in the style',
 init:()=>({tr:0}),watch(p){return {tr:p<.5?0:p<.75?5:3}},
 ui:[{range:'tr',label:'Transpose',min:-5,max:7,step:1,get:s=>s.tr,act:'tr',show:v=>(v>0?'+':'')+v+' semitones'}],
 on:{tr(s,v){s.tr=+v;return 'keep'}},
 tracks:[
  {name:'Kick',col:C.blue,pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],sound:(s,at)=>X1_V.kick(at)},
  {name:'Bass',col:C.purple,cycle:5,labels:['','R','5','7','8'],pat:[1,1,4,1,1,2,1,4,1,1,3,1,4,1,2,1],sound:(s,at,v)=>X1_V.bass(36+s.tr+X1_DEG[v],at,.1)}],
 heading:s=>'One bar, repeated by the sequencer',
 below(s,X,pos,y){const n=s.pat[1].filter(v=>v).length;
  let out=counter(110,y+16,'bass notes per bar',String(n),C.purple,150)+counter(275,y+16,'one step',Math.round(X1_stepMs(s.bpm))+' ms',C.blue,120)+counter(410,y+16,'root note',noteName(36+s.tr),C.green,120);
  out+=T(300,y+98,'The same row of notes, moved up or down as one block',15,C.ink);return out},
 phase:s=>`The sequencer plays ${s.pat[1].filter(v=>v).length} bass notes in every bar, each exactly ${Math.round(X1_stepMs(s.bpm))} ms after the last. Transpose moves the whole pattern (now starting on ${noteName(36+s.tr)}), which is how a sequenced bass follows the chords of a song.`});

X1_grid({id:'moroder-sequencer-delay',name:'Doubling with a delay',tag:'An echo fills the gaps',
 definition:'A delay repeats a sound a fixed time later. If the delay is set to a musical length, such as one sixteenth note, the echoes fall between the played notes and a simple pattern turns into a busier one.',
 example:'Eight bass notes a bar with an echo one sixteenth later sound like sixteen. The makers of “I Feel Love” have described using a delay on the bass in this way.',
 desc:'A bass track of eighth notes and, below it, a paler row showing where each echo lands as the delay time changes from none to three sixteenths.',
 research:'Buskin, R. (2009). Classic Tracks: Donna Summer “I Feel Love”. Sound on Sound (engineer and producer accounts of the delayed bass). Butler, M. J. (2006). Unlocking the Groove. The pattern here is original.',
 hint:'Press Play with the delay at 0, then set it to 1 sixteenth. Try 3 sixteenths for a lopsided, galloping feel.',
 bpm:122,tempo:[100,135],note:'original pattern in the style',
 init:()=>({dl:1,lv:70}),watch(p){return {dl:Math.min(3,Math.floor(p*4)),lv:70}},
 ui:[{range:'dl',label:'Delay time',min:0,max:3,step:1,get:s=>s.dl,act:'dl',show:v=>v+(v==1?' sixteenth':' sixteenths')},{range:'lv',label:'Echo level',min:0,max:100,step:5,get:s=>s.lv,act:'lv',show:v=>v+'%'}],
 on:{dl(s,v){s.dl=+v;return 'keep'},lv(s,v){s.lv=+v;return 'keep'}},
 tracks:[{name:'Bass',col:C.purple,cycle:5,labels:['','R','5','7','8'],pat:[1,0,1,0,4,0,1,0,1,0,2,0,4,0,1,0],
  sound:(s,at,v)=>{X1_V.bass(36+X1_DEG[v],at,.1);if(s.dl&&s.lv)X1_V.bass(36+X1_DEG[v],at+s.dl*X1_stepMs(s.bpm)/1000,.1,{gain:.13*s.lv/100})}}],
 heading:s=>s.dl?`Echo ${s.dl} sixteenth${s.dl>1?'s':''} later`:'No delay: eight notes a bar',
 below(s,X,pos,y){let out=TF(94,y+24,'Echo',13,C.muted,'end'),both=0;
  for(let i=0;i<16;i++){const src=s.pat[0][(i-s.dl+16)%16],on=s.dl&&s.lv&&src;if(s.pat[0][i]||on)both++;
   out+=R(101.5+i*30,y+8,27,23,on?'#cdbfe6':'#fff',on?'none':C.grid,4)+(on?TF(115+i*30,y+24,['','R','5','7','8'][src],12,'#fff'):'')}
  out+=counter(130,y+50,'delay',Math.round(s.dl*X1_stepMs(s.bpm))+' ms',C.purple,130)+counter(330,y+50,'steps that sound',both+' of 16',C.green,150);
  out+=T(300,y+124,s.dl===1?'Played notes and echoes interlock':s.dl?'Echoes land between or on the played notes':'Add a delay to fill the gaps',15,C.ink);return out},
 phase:s=>s.dl===0?'With no delay you hear only the played notes, with a gap after each one.':`The delay is ${s.dl} sixteenth${s.dl>1?'s':''}, which is ${Math.round(s.dl*X1_stepMs(s.bpm))} ms at ${s.bpm} BPM. Because the delay time is tied to the tempo, the echoes fall on the grid and become part of the rhythm.`});

X1_cards({id:'moroder-sequencer-studio',name:'Munich, 1977',tag:'A disco record with no band',
 definition:'“I Feel Love” was made in Munich by Giorgio Moroder and Pete Bellotte with the singer Donna Summer. Almost every sound except the voice came from a large Moog modular synthesiser.',
 example:'Earlier disco records used string sections, horn players and a drummer. This one used a sequencer, a synthesiser and a tape machine.',
 desc:'Five pressable facts about how the record was made and what followed from it.',
 research:'Lawrence, T. (2003). Love Saves the Day. Brewster, B. & Broughton, F. (1999). Last Night a DJ Saved My Life. Buskin, R. (2009). Sound on Sound. Shapiro, P. (2005). Turn the Beat Around. Faber.',
 hint:'Press each item. The remark attributed to Brian Eno is reported by David Bowie, so treat it as a story.',heading:'How “I Feel Love” was made',dw:0,
 items:[
  {d:'',t:'The people',text:'Donna Summer sang and co-wrote it. Giorgio Moroder and Pete Bellotte wrote and produced it at Musicland Studios in Munich for the album I Remember Yesterday.',phase:'The album imagined music from different decades. This track was meant to stand for the future.'},
  {d:'',t:'The machine',text:'The bass, chords and most percussion sounds came from a Moog modular synthesiser. The synthesist Robby Wedel is credited with working out how to lock separate takes together in time.',phase:'Locking several synthesiser parts to one clock was new and difficult in 1977. It is what a modern sequencer does without being asked.'},
  {d:'',t:'What stayed human',text:'Summer’s voice floats freely over the strict pattern. Accounts of the session say the kick drum was played on a real drum, because the synthesiser could not make a heavy enough one.',phase:'The contrast between a free human voice and a fixed machine pattern became a standard shape for house and techno vocals.'},
  {d:'',t:'The reaction',note:'a reported remark',text:'David Bowie recalled Brian Eno bringing the record to their Berlin sessions and saying it would change the sound of club music for years. The record reached number one in the UK.',phase:'Whether or not the words are exact, the forecast held. Sequenced synthesiser bass became normal in dance music within a few years.'},
  {d:'',t:'What followed',text:'The longer club mixes by Patrick Cowley, the Hi-NRG style and Italo disco all built on it. DJs in Chicago and Detroit played these European records beside American ones.',phase:'By the early 1980s, electronic disco from Europe was part of what young musicians in Chicago and Detroit heard every week.'}]});

/* =========================== electro =========================== */
const X1_EL=[[1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0],[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],[1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0]];
const X1_FF=[[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
X1_grid({id:'electro',name:'Electro',tag:'Funk played by a drum machine',
 definition:'Electro is early-1980s dance music built on the Roland TR-808 drum machine, with syncopated kick drums, synthesiser bass and robot-like voices. It joined hip-hop, funk and Kraftwerk’s machine rhythm.',
 example:'In a house or techno beat the kick falls on every beat. In an electro beat the kicks dodge around the beat, and the snare on beats 2 and 4 holds the bar together.',
 desc:'A four-track step grid for kick, snare, hat and cowbell with two starting patterns, an electro beat and a four-on-the-floor beat, and counts of kicks on and off the beat.',
 research:'Toop, D. (1984). The Rap Attack. Sicko, D. (1999). Techno Rebels. Reynolds, S. (1998). Energy Flash. The patterns here are original, in the style.',
 hint:'Press Play and switch between the two patterns. Then move the kicks yourself and watch the count of off-beat kicks.',
 bpm:122,tempo:[100,135],note:'original patterns · simplified 808 voices',
 presets:[{name:'Electro',pat:X1_EL},{name:'Four on the floor',pat:X1_FF}],
 tracks:[
  {name:'Kick',col:C.blue,pat:X1_EL[0],sound:(s,at)=>X1_V.kick(at,true)},
  {name:'Snare',col:C.coral,pat:X1_EL[1],sound:(s,at)=>X1_V.snare(at)},
  {name:'Hat',col:C.green,pat:X1_EL[2],sound:(s,at)=>X1_V.ch(at)},
  {name:'Cowbell',col:C.amber,pat:X1_EL[3],sound:(s,at)=>X1_V.bell(at)}],
 heading:s=>{const off=s.pat[0].filter((v,i)=>v&&i%4).length;return off?'Kicks dodge the beat: electro':'A kick on every beat'},
 below(s,X,pos,y){const on=s.pat[0].filter((v,i)=>v&&i%4===0).length,off=s.pat[0].filter((v,i)=>v&&i%4).length;
  return counter(130,y+12,'kicks on a beat',String(on),C.blue,150)+counter(320,y+12,'kicks between beats',String(off),C.coral,160)+T(300,y+88,off?'Off-beat kicks make the body lean into the gaps':'Even kicks make a steady walking pulse',15,C.ink)},
 phase:s=>{const off=s.pat[0].filter((v,i)=>v&&i%4).length;return off?`${off} of the kicks fall between the beats. That syncopation comes from funk drumming, and it is what separates electro from the even pulse of house and techno.`:'Every kick is on a beat. This even pulse, four to the bar, is the foundation of house and techno.'}});

X1_cards({id:'electro-cybotron',name:'Electro reaches Detroit',tag:'Cybotron and the first use of the word',
 definition:'Cybotron was the Detroit group of Juan Atkins and Rik Davis. Their records from 1981 to 1984 were electro, but their science-fiction themes and the track title “Techno City” point straight at what Atkins did next.',
 example:'Cybotron’s “Clear” (1983) uses an 808 beat and synthesiser lines like New York electro, with a colder, more mechanical mood.',
 desc:'Five pressable records and events from 1981 to 1985 linking electro to the start of Detroit techno.',
 research:'Sicko, D. (1999). Techno Rebels. Brown, D. Jr. (2022). Assembling a Black Counter Culture. Primary Information. Reynolds, S. (1998). Energy Flash.',
 hint:'Press each year to follow Juan Atkins from electro to the first techno records.',heading:'From Cybotron to Model 500',dw:46,
 items:[
  {d:'1981',t:'“Alleys of Your Mind”',text:'Juan Atkins and Rik Davis, who met at a community college near Detroit, release their first single as Cybotron on their own Deep Space label. It sells well locally.',phase:'Atkins was still a teenager. Putting the record out themselves set a pattern Detroit musicians kept: own the label, press the records, sell them locally first.'},
  {d:'1982',t:'“Planet Rock” in New York',text:'Afrika Bambaataa and the Soulsonic Force’s record makes the 808 beat and Kraftwerk melodies the sound of electro across the United States.',phase:'Cybotron were working on similar ideas at the same time. Electro was a shared language between cities.'},
  {d:'1983',t:'“Clear”',text:'Cybotron’s best-known track, from the album Enter. It was sampled and replayed by hip-hop and R&B producers for decades afterwards.',phase:'“Clear” is usually filed as electro. Its stripped, repeating structure is often named as a step towards techno.'},
  {d:'1984',t:'“Techno City”',text:'A Cybotron single whose title uses the word. Atkins took “techno” from the writer Alvin Toffler, who wrote about “techno rebels” in The Third Wave (1980).',phase:'The word was in use in Detroit years before it named a genre. Era 2 follows how it became the name.'},
  {d:'1985',t:'Model 500',text:'Atkins leaves Cybotron, starts the Metroplex label and releases “No UFO’s” as Model 500. It is commonly counted as the first Detroit techno record.',phase:'The drum machine and the science fiction stayed. What changed was the feel: a straighter, faster pulse closer to Chicago house.'}]});

const X1_VOW=[0,400,950,2200],X1_VN=['','oo','ah','ee'];
X1_grid({id:'electro-robot-voice',name:'Robot voices',tag:'A synthesiser shaped like speech',
 definition:'A vocoder analyses a voice into frequency bands and uses them to shape a synthesiser, so the synthesiser seems to speak. Electro records used it for robot voices. Here a simpler model moves one filter between vowel-like settings.',
 example:'Set the steps to oo, ah, ee in the rhythm of a short phrase and the chord seems to mouth words, without any recorded voice.',
 desc:'A step grid with a kick and a chord track whose steps cycle through rest and three vowel-like filter settings, with a filter curve showing the chosen brightness.',
 research:'Dudley, H. (1939). The vocoder. Bell Laboratories Record 18. Tompkins, D. (2010). How to Wreck a Nice Beach: The Vocoder from World War II to Hip-Hop. Stop Smiling. A real vocoder uses many bands; this is a one-filter sketch.',
 hint:'Press Play. Press a chord step to cycle its vowel: oo is dark, ah is open, ee is bright.',
 bpm:112,tempo:[95,130],note:'one-filter sketch, not a real vocoder',
 tracks:[
  {name:'Kick',col:C.blue,pat:[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],sound:(s,at)=>X1_V.kick(at,true)},
  {name:'Voice',col:C.purple,cycle:4,labels:X1_VN,pat:[2,0,3,0,1,1,0,0,2,0,0,3,3,0,1,0],
   sound:(s,at,v)=>[48,55,60].forEach(m=>AUDIO.acid(midiHz(m),{at,dur:.11,gain:.06,cutoff:X1_VOW[v],env:0,res:8,decay:.1}))}],
 heading:s=>'A chord that seems to speak',
 below(s,X,pos,y){const v=pos>=0?s.pat[1][pos]:0,cut=v?X1_VOW[v]:0;
  let out=R(140,y+8,320,84,'#fff',C.grid,6)+TF(300,y+108,'filter: which part of the chord gets through',13,C.muted);
  const lx=f=>140+Math.log(f/100)/Math.log(80)*320;
  [[100,'100'],[1000,'1 kHz'],[8000,'8 kHz']].forEach(([f,l])=>out+=TF(clamp(lx(f),156,440),y+86,l,12,C.muted));
  X1_VOW.slice(1).forEach((f,i)=>{const on=v===i+1;out+=L(lx(f),y+14,lx(f),y+70,on?C.purple:C.grid,on?3:1.5)+TF(lx(f),y+26,X1_VN[i+1],13,on?C.purple:C.muted)});
  out+=T(300,y+136,cut?`Now: “${X1_VN[v]}”, peak near ${cut} Hz`:'Three filter settings stand in for three vowels',15,C.ink);return out},
 phase:s=>'Vowels differ in which frequencies are strongest. Moving a resonant filter between three positions gives a rough oo, ah and ee. A real vocoder tracks a live voice with ten or more bands, which is why it can carry words.'});

/* =========================== chicago-house =========================== */
const X1_HS=[[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],[1,0,0,1,0,0,2,0,1,0,0,1,0,2,0,0]];
const X1_Z=()=>new Array(16).fill(0);
X1_grid({id:'chicago-house',name:'Chicago house',tag:'Four on the floor, built in layers',
 definition:'House music grew in Chicago clubs in the early 1980s, when DJs extended disco records with drum machines. Its core is a kick drum on every beat, an open hi-hat between the beats and a clap on beats 2 and 4.',
 example:'Take away everything but the kick and the off-beat hat and it is still recognisably a house rhythm.',
 desc:'A four-track step grid for kick, clap, open hat and bass, with four starting patterns that add one layer at a time.',
 research:'Brewster, B. & Broughton, F. (1999). Last Night a DJ Saved My Life. Lawrence, T. (2003). Love Saves the Day. Butler, M. J. (2006). Unlocking the Groove. The pattern here is original, in the style.',
 hint:'Press Play and step through the four patterns to hear each layer join. Then change steps yourself.',
 bpm:122,tempo:[112,130],note:'original pattern · simplified drum voices',presetLabel:'Layers',
 presets:[{name:'Kick',pat:[X1_HS[0],X1_Z(),X1_Z(),X1_Z()]},{name:'+ hat',pat:[X1_HS[0],X1_Z(),X1_HS[2],X1_Z()]},{name:'+ clap',pat:[X1_HS[0],X1_HS[1],X1_HS[2],X1_Z()]},{name:'+ bass',pat:X1_HS}],
 tracks:[
  {name:'Kick',col:C.blue,pat:X1_HS[0],sound:(s,at)=>X1_V.kick(at)},
  {name:'Clap',col:C.coral,pat:X1_HS[1],sound:(s,at)=>X1_V.clap(at)},
  {name:'Open hat',col:C.green,pat:X1_HS[2],sound:(s,at)=>X1_V.oh(at)},
  {name:'Bass',col:C.purple,cycle:3,labels:['','R','8'],pat:X1_HS[3],sound:(s,at,v)=>X1_V.bass(v===2?45:33,at,.14,{cutoff:420,env:500})}],
 heading:s=>{const n=s.pat.filter(r=>r.some(v=>v)).length;return n<=1?'The kick alone: four on the floor':`${n} layers of a house beat`},
 below(s,X,pos,y){const offhat=s.pat[2].filter((v,i)=>v&&i%4===2).length;
  return counter(110,y+12,'kicks per bar',String(s.pat[0].filter(v=>v).length),C.blue,130)+counter(260,y+12,'off-beat hats',String(offhat),C.green,130)+counter(410,y+12,'claps',String(s.pat[1].filter(v=>v).length),C.coral,110)+T(300,y+88,'Kick on the beat, hat between the beats',15,C.ink)},
 phase:s=>'The kick marks every beat. The open hat answers halfway between, so the bar rocks down-up, down-up. The clap on 2 and 4 comes from gospel and disco handclaps. Detroit techno kept this skeleton and changed what was hung on it.'});

X1_cards({id:'chicago-house-warehouse',name:'The Warehouse and after',tag:'Clubs, DJs, radio, then records',
 definition:'House is usually traced to Chicago clubs with mostly Black and gay crowds, above all the Warehouse, where Frankie Knuckles was resident DJ from 1977. Local DJs began making their own drum-machine tracks, and from 1984 pressing them as records.',
 example:'The name “house” is most often explained as short for the Warehouse: record shops sold “house music”, meaning what Knuckles played there. Other explanations exist.',
 desc:'Six pressable people, places and records in Chicago from 1977 to 1987.',
 research:'Brewster, B. & Broughton, F. (1999). Last Night a DJ Saved My Life. Lawrence, T. (2003). Love Saves the Day. Reynolds, S. (1998). Energy Flash. Salkind, M. (2019). Do You Remember House? Oxford University Press.',
 hint:'Press each item. Where a “first” is claimed, the text says who claims it.',heading:'Chicago, 1977 to 1987',dw:46,
 items:[
  {d:'1977',t:'The Warehouse',text:'Frankie Knuckles, a DJ from New York, becomes resident at a new members’ club on South Jefferson Street. He plays disco, soul and European electronic records, re-edited on tape to run longer.',phase:'Knuckles is often called the godfather of house. His long, carefully blended sets were built to keep a room of dancers together through the night.'},
  {d:'1981',t:'Radio: the Hot Mix 5',text:'A team of DJs on the station WBMX broadcasts mixed sets to the whole city. Teenagers tape the shows. Farley “Jackmaster” Funk is one of the five.',phase:'Radio carried club music to people too young for the clubs, in Chicago as in Detroit.'},
  {d:'1982',t:'The Music Box',text:'After Knuckles leaves to open the Power Plant, the Warehouse’s owner opens the Music Box. Its DJ, Ron Hardy, plays faster, louder and rawer, and tests local producers’ tapes on the crowd.',phase:'Many early house tracks were made to be played by Hardy or Knuckles that same weekend. The club was the test bench.'},
  {d:'1984',t:'“On and On”',note:'a contested first',text:'Jesse Saunders, with Vince Lawrence, presses “On and On” on his own Jes Say label. It is often called the first house record. Others point to different early tracks.',phase:'What matters more than who was first is what the record proved: a local DJ with a drum machine could press and sell a track.'},
  {d:'1985',t:'Trax and DJ International',text:'Two Chicago labels release a flood of tracks by Marshall Jefferson, Larry Heard, Adonis, Steve “Silk” Hurley and many more. Artists later complained about unpaid royalties.',phase:'The disputes over money in Chicago are one reason Detroit producers were determined to own their labels.'},
  {d:'1987',t:'Number one in Britain',text:'Steve “Silk” Hurley’s “Jack Your Body” tops the UK singles chart in January 1987. House becomes the base of British club culture, as era 5 describes.',phase:'House was a local Chicago style for about three years before it became an export. Detroit techno followed it across the Atlantic within a year.'}]});

const X1_AD=[0,0,12,3,7];
X1_grid({id:'chicago-house-acid',name:'The squelch',tag:'A bass machine pushed too far',
 definition:'Acid house began when Chicago producers turned the filter knobs of a Roland TB-303 bass machine while its pattern played. The filter’s resonance makes the squelching, vowel-like sound that gave the style its name.',
 example:'With the cutoff low the line is a dull thud. Raise the cutoff with the resonance high and each note yelps.',
 desc:'A step grid with a kick and a bass line, cutoff and resonance controls, and a curve of the filter showing its resonant peak moving.',
 research:'Reynolds, S. (1998). Energy Flash. Brewster, B. & Broughton, F. (1999). Last Night a DJ Saved My Life. Phuture, “Acid Tracks” (Trax Records, 1987), produced by Marshall Jefferson. The pattern here is original; the filter is a simplified model.',
 hint:'Press Play, then move Cutoff slowly up and down. Raise Resonance to hear the squelch sharpen.',
 bpm:122,tempo:[112,132],note:'original pattern · simplified 303 model',
 init:()=>({cut:500,res:12}),watch(p){return {cut:Math.round(200+1800*(.5-.5*Math.cos(p*Math.PI*2))),res:12}},
 ui:[{range:'cut',label:'Cutoff',min:150,max:2500,step:10,get:s=>s.cut,act:'cut',show:v=>v+' Hz'},{range:'res',label:'Resonance',min:1,max:18,step:1,get:s=>s.res,act:'res'}],
 on:{cut(s,v){s.cut=+v;return 'keep'},res(s,v){s.res=+v;return 'keep'}},
 tracks:[
  {name:'Kick',col:C.blue,pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],sound:(s,at)=>X1_V.kick(at)},
  {name:'Bass',col:C.purple,cycle:5,labels:['','R','8','3','5'],pat:[1,0,1,2,0,1,3,0,1,1,0,2,4,0,1,3],sound:(s,at,v)=>AUDIO.acid(midiHz(36+X1_AD[v]),{at,dur:.11,gain:.11,cutoff:s.cut,env:s.cut*1.5,res:s.res,decay:.14})}],
 heading:s=>s.res>=10?'High resonance: the filter sings':'Low resonance: a plain bass line',
 below(s,X,pos,y){let out=R(140,y+8,320,86,'#fff',C.grid,6);const lx=f=>140+Math.log(f/60)/Math.log(100)*320,pts=[];
  for(let i=0;i<=64;i++){const f=60*Math.pow(100,i/64),r=f/s.cut,q=Math.max(.7,s.res/3),g=1/Math.sqrt((1-r*r)**2+(r/q)**2),db=clamp(20*Math.log10(g),-30,18);pts.push((i?'L':'M')+fmt(lx(f))+' '+fmt(y+62-db*2.6))}
  out+=`<clipPath id="x1acid"><rect x="140" y="${fmt(y+8)}" width="320" height="86"/></clipPath><g clip-path="url(#x1acid)">`+P(pts.join(''),C.purple,2.6)+'</g>';
  [[100,'100'],[1000,'1 kHz'],[5000,'5 kHz']].forEach(([f,l])=>out+=TF(lx(f),y+108,l,12,C.muted));
  out+=T(300,y+136,`Peak at ${s.cut} Hz · everything above it is cut`,15,C.ink);return out},
 phase:s=>`The filter lets through what lies below ${s.cut} Hz and boosts a narrow band right at that point. With resonance at ${s.res} the boost is ${s.res>=10?'strong, so each note gets a whistling edge that moves when you move the cutoff':'mild, so the line just gets brighter or duller'}. Phuture’s “Acid Tracks” (1987) is a 303 pattern with the knobs turned by hand for more than ten minutes.`});
