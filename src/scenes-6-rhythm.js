/* ===================== Music era 6 · Rhythm around the world ===================== */
// Step sequencers: in Try it, Play starts ctx.every ticks that move a playhead held in the state and sound
// each step; Watch derives the playhead from lesson time, so the picture stays deterministic and silent.
const M6_TAU=Math.PI*2;
const M6_SOUNDS={
 low:at=>AUDIO.tone(65,{dur:.22,type:'sine',gain:.3,at,attack:.003,release:.18}),
 mid:at=>AUDIO.tone(196,{dur:.14,type:'triangle',gain:.2,at,attack:.003,release:.1}),
 high:at=>AUDIO.tone(880,{dur:.07,type:'triangle',gain:.14,at,attack:.002,release:.05}),
 click:at=>AUDIO.tone(1500,{dur:.04,type:'square',gain:.05,at,attack:.001,release:.03}),
 hat:at=>AUDIO.noise({dur:.05,gain:.07,at}),
 bell:at=>AUDIO.tone(1320,{dur:.16,type:'sine',gain:.13,at,attack:.002,release:.13}),
 ketuk:at=>AUDIO.tone(700,{dur:.08,type:'triangle',gain:.1,at,attack:.002,release:.06}),
 kenong:at=>AUDIO.tone(523.25,{dur:.6,type:'sine',gain:.14,at,attack:.005,release:.5}),
 kempul:at=>AUDIO.tone(196,{dur:.9,type:'sine',gain:.18,at,attack:.005,release:.75}),
 gong:at=>AUDIO.tone(98,{dur:1.5,type:'sine',gain:.26,at,attack:.01,release:1.2})
};
function M6_sound(kind,at=0){const f=M6_SOUNDS[kind];if(f)f(at)}
// Play/stop and tick handlers shared by every sequencer. spec.ms(s): step length; spec.N(s): steps; spec.step(s,i): sounds.
function M6_seqOn(spec,extra={}){
 return {...extra,
  play(s,a,ctx){s.token=(s.token||0)+1;if(s.playing){s.playing=false;return 'keep'}s.playing=true;s.pos=-1;ctx.every(spec.ms(s),'tick',s.token);return 'keep'},
  tick(s,tok){if(!s.playing||Number(tok)!==s.token)return 'stop';s.pos=(s.pos+1)%spec.N(s);spec.step(s,s.pos);return 'keep'}};
}
// After a tempo or pattern change, restart a running sequencer at the new step length.
function M6_restart(s,ctx,spec){if(s.playing){s.token=(s.token||0)+1;s.pos=-1;ctx.every(spec.ms(s),'tick',s.token)}}
// The playhead: the learner's in Try it, lesson time in Watch.
function M6_pos(s,X,N,perSec){return X.try?(s.playing?s.pos:-1):Math.floor(X.p*9*perSec)%N}
function M6_ring(X,cx,cy,r,n,isHit,pos,o={}){
 let out=Ci(cx,cy,r,'none',o.ring||C.line);
 if(pos>=0){const a=-Math.PI/2+pos*M6_TAU/n;out+=L(cx,cy,cx+(r-14)*Math.cos(a),cy+(r-14)*Math.sin(a),C.amber,3)}
 for(let i=0;i<n;i++){const a=-Math.PI/2+i*M6_TAU/n,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a),h=isHit(i),cur=i===pos,rad=h?(o.big||10):5;
  const col=h?(o.col?o.col(i):C.blue):'#fff';
  const inner=Ci(x,y,rad,col,h?col:C.line);
  if(cur)out+=Ci(x,y,rad+6,'none',C.amber);
  out+=o.act?hit(X,o.act,i,`${o.name||'Step'} ${i+1}: ${h?'hit':'rest'}. Press to toggle.`,inner):inner;
  if(o.labels){const lr=r+(o.lr||22);out+=TF(cx+lr*Math.cos(a),cy+lr*Math.sin(a)+4,o.labels(i),13,o.labelCol?o.labelCol(i):C.muted)}
 }
 return out;
}
function M6_row(X,x0,y,cw,h,n,isHit,pos,o={}){
 let out='';
 for(let i=0;i<n;i++){const x=x0+i*cw,on=isHit(i),cur=i===pos,beat=o.beatEvery&&i%o.beatEvery===0;
  const inner=R(x+1.5,y,cw-3,h,on?(o.col?o.col(i):C.blue):(beat?'#e9f0f4':'#fff'),cur?C.amber:(on?'none':C.grid),4);
  out+=o.act?hit(X,o.act,i,`${o.name||'Step'} ${i+1}: ${on?'on':'off'}. Press to toggle.`,inner):inner;
 }
 return out;
}
const M6_gcd=(a,b)=>b?M6_gcd(b,a%b):a;
const M6_lcm=(a,b)=>a/M6_gcd(a,b)*b;

/* ---------- beat-metre ---------- */
const M6_BM={ms:s=>60000/s.bpm,N:()=>12,step(s,i){const g=s.group;if(g>1&&i%g===0)M6_sound('low');else M6_sound('click')}};
SCENE({id:'beat-metre',name:'Beat and metre',tag:'Pulses grouped into bars',
 definition:'The beat is a steady pulse you could tap along to. Metre groups beats into repeating units, usually of two, three or four, with the first beat of each group felt as strongest.',
 example:'A march goes STRONG-weak (two). A waltz goes STRONG-weak-weak (three). Most pop songs count STRONG-weak-medium-weak (four). Even identical clicks tend to be heard in twos or fours.',
 desc:'Twelve pulses in a row, grouped into bars of two, three or four, with the first pulse of each bar drawn larger; a playhead moves along the row at the chosen tempo.',
 dur:11,research:['Bolton, T. L. (1894). Rhythm. American Journal of Psychology: identical clicks are heard in groups.','London, J. (2004). Hearing in Time.'],
 hint:'Choose how to group the pulses and the tempo, then press Play. Try “No accents” and notice whether you hear groups anyway.',
 init:()=>({group:3,bpm:100,playing:false,pos:-1}),
 watch(p){return {group:p<.33?2:p<.66?3:4,bpm:100,playing:false,pos:-1}},
 ui:[{choose:[[1,'No accents'],[2,'In 2s'],[3,'In 3s'],[4,'In 4s']],label:'Grouping',get:s=>s.group,act:'group'},
  {range:'bpm',label:'Tempo (BPM)',min:40,max:200,step:2,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_BM,{group(s,v){s.group=Number(v);return 'keep'},bpm(s,v,ctx){s.bpm=v;M6_restart(s,ctx,M6_BM);return 'keep'}}),
 draw(s,f,X){
  const g=s.group,pos=M6_pos(s,X,12,s.bpm/60);let out=heading(g===1?'Twelve identical pulses':`Pulses grouped in ${g}s`);
  const x0=58,dx=44;
  for(let i=0;i<12;i++){const x=x0+i*dx,strong=g>1&&i%g===0,cur=i===pos;
   if(g>1&&i%g===0&&i>0)out+=L(x-dx/2,92,x-dx/2,168,C.line,2);
   out+=Ci(x,130,strong?17:9,strong?C.blue:'#cfe0eb',cur?C.amber:'none');
   if(cur)out+=Ci(x,130,(strong?17:9)+7,'none',C.amber);
   out+=TF(x,194,g>1?String(i%g+1):'·',15,strong?C.blue:C.muted,'middle',strong?'font-weight="700"':'');
  }
  const names={1:'No written accents: listeners still tend to hear groups of two or four.',2:'Duple metre: STRONG-weak, like a march.',3:'Triple metre: STRONG-weak-weak, like a waltz.',4:'Quadruple metre: STRONG-weak-medium-weak, common time.'};
  out+=R(80,232,440,46,'#fff',C.grid,10)+T(300,261,names[g],15,C.ink);
  out+=counter(160,300,'tempo',s.bpm+' BPM',C.blue,130)+counter(310,300,'one beat lasts',Math.round(60000/s.bpm)+' ms',C.purple,130);
  return {svg:out,phase:`The beat is the evenly spaced pulse; the metre is how we group it. At ${s.bpm} beats per minute each pulse lasts ${Math.round(60000/s.bpm)} ms. ${g===1?'Bolton (1894) found that people hear groups even in perfectly identical clicks.':'The first pulse of each group is felt as the strongest.'}`};
 }});

const M6_LEVELS={
 '4/4':{n:16,levels:i=>1+(i%2===0)+(i%4===0)+(i%8===0)+(i===0),beat:4,names:['semiquavers','quavers','crotchet beats','half bars','the bar']},
 '3/4':{n:12,levels:i=>1+(i%2===0)+(i%4===0)+(i===0),beat:4,names:['semiquavers','quavers','crotchet beats','the bar']},
 '6/8':{n:12,levels:i=>1+(i%2===0)+(i%6===0)+(i===0),beat:6,names:['semiquavers','quavers','dotted-crotchet beats','the bar']}
};
const M6_MH={ms:s=>60000/s.bpm/ (s.sig==='6/8'?6:4),N:s=>M6_LEVELS[s.sig].n,step(s,i){const lv=M6_LEVELS[s.sig].levels(i),max=M6_LEVELS[s.sig].names.length;M6_sound(lv>=max?'low':lv===max-1?'mid':lv===max-2?'high':'click')}};
SCENE({id:'beat-metre-hierarchy',name:'The metrical grid',tag:'Levels of strong and weak',
 definition:'A metre is a stack of evenly spaced pulse levels. A moment feels strong when many levels line up on it, and weak when only the fastest level does.',
 example:'In 4/4 the first beat sits on every level, beat 3 on all but the bar, beats 2 and 4 on fewer, and the “and”s between them on fewer still.',
 desc:'Columns of dots over one bar: each column’s height counts how many pulse levels land there, so the downbeat has the tallest column.',
 dur:10,research:'Lerdahl, F. & Jackendoff, R. (1983). A Generative Theory of Tonal Music: the metrical grid of dots.',
 hint:'Choose a time signature, press any column to hear how strong it is, or press Play to hear the whole bar with its accents.',
 init:()=>({sig:'4/4',bpm:84,playing:false,pos:-1}),
 watch(p){return {sig:p<.4?'4/4':p<.7?'3/4':'6/8',bpm:84,playing:false,pos:-1}},
 ui:[{choose:[['4/4','4/4'],['3/4','3/4'],['6/8','6/8']],label:'Time signature',get:s=>s.sig,act:'sig'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_MH,{sig(s,v,ctx){s.sig=v;M6_restart(s,ctx,M6_MH);return 'keep'},col(s,i){M6_MH.step(s,Number(i));return 'keep'}}),
 draw(s,f,X){
  const L6=M6_LEVELS[s.sig],n=L6.n,per=s.sig==='6/8'?6:4,pos=M6_pos(s,X,n,s.bpm/60*per);let out=heading(`${s.sig}: how many levels land on each moment?`);
  const x0=130,cw=430/n,base=250,dy=26;
  L6.names.forEach((nm,k)=>out+=TF(120,base-k*dy+5,nm,13,C.muted,'end'));
  for(let i=0;i<n;i++){const x=x0+i*cw+cw/2,lv=L6.levels(i),cur=i===pos;let col='';
   for(let k=0;k<lv;k++)col+=Ci(x,base-k*dy,7,k===lv-1&&lv>=3?C.blue:'#8fb3ca');
   if(cur)col+=R(x-cw/2+2,base-lv*dy+8,cw-4,lv*dy+10,'none',C.amber,6);
   out+=hit(X,'col',i,`Position ${i+1}: ${lv} levels`,R(x-cw/2+1,base-4*dy-14,cw-2,4*dy+30,'transparent','none',4)+col);
   out+=TF(x,base+30,i%per===0?String(i/per+1):'·',14,i%per===0?C.ink:C.muted);
  }
  out+=L(x0,base+12,x0+430,base+12,C.line,1.5);
  out+=T(300,330,s.sig==='6/8'?'6/8 groups six quavers as two beats of three: compound metre.':s.sig==='3/4'?'3/4: three crotchet beats, simple triple metre.':'4/4: four crotchet beats, the strongest on 1, then 3.',15,C.ink);
  return {svg:out,phase:`Each dot is one pulse level; a taller column is a stronger moment. Musicians play with this grid: stressing a short column (an off-beat) is how syncopation begins.`};
 }});

const M6_HEM={ms:s=>60000/s.bpm/3,N:()=>12,step(s,i){const acc=M6_hemAcc(s.mode,i);M6_sound(acc?'low':'click')}};
function M6_hemAcc(mode,i){const bar=Math.floor(i/6),j=i%6;const m=mode==='alt'?(bar===0?'68':'34'):mode;return m==='68'?j%3===0:j%2===0}
SCENE({id:'beat-metre-hemiola',name:'Hemiola',tag:'Six as two threes or three twos',
 definition:'Hemiola is the switch between hearing six pulses as two groups of three and as three groups of two, a 3:2 shift of the beat.',
 example:'In “America” from West Side Story (Bernstein, 1957) the bars alternate between 6/8 and 3/4: ONE-and-a-TWO-and-a, then ONE-and TWO-and THREE-and.',
 desc:'Two bars of six quavers with brackets above: grouped 3 + 3 (6/8), 2 + 2 + 2 (3/4), or alternating between the two.',
 dur:10,research:['Hemiola: from Greek hēmiolios, “one and a half” (the ratio 3:2).','Bernstein, L. (1957). “America”, West Side Story: alternating 6/8 and 3/4.'],
 hint:'Choose a grouping and press Play: the same six quavers change character when the accents move.',
 init:()=>({mode:'alt',bpm:72,playing:false,pos:-1}),
 watch(p){return {mode:p<.33?'68':p<.66?'34':'alt',bpm:72,playing:false,pos:-1}},
 ui:[{choose:[['68','3 + 3 (6/8)'],['34','2 + 2 + 2 (3/4)'],['alt','Alternate']],label:'Grouping',get:s=>s.mode,act:'mode'},{range:'bpm',label:'Tempo (bar-beats/min)',min:40,max:120,step:2,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_HEM,{mode(s,v){s.mode=v;return 'keep'},bpm(s,v,ctx){s.bpm=v;M6_restart(s,ctx,M6_HEM);return 'keep'}}),
 draw(s,f,X){
  const pos=M6_pos(s,X,12,s.bpm/60*3);let out=heading('Six quavers, two ways to count them');
  const x0=70,dx=40;
  for(let bar=0;bar<2;bar++){const m=s.mode==='alt'?(bar===0?'68':'34'):s.mode,bx=x0+bar*250,size=m==='68'?3:2;
   out+=TB(bx+100,78,m==='68'?'6/8: 3 + 3':'3/4: 2 + 2 + 2',15,m==='68'?C.blue:C.coral);
   for(let gI=0;gI<6/size;gI++){const a=bx+gI*size*dx-12,b=a+(size-1)*dx+24;out+=P(`M${a} 112V100H${b}V112`,m==='68'?C.blue:C.coral,2)}
   for(let j=0;j<6;j++){const i=bar*6+j,x=bx+j*dx,acc=M6_hemAcc(s.mode,i),cur=i===pos;
    out+=Ci(x,150,acc?15:8,acc?(m==='68'?C.blue:C.coral):'#cfe0eb');if(cur)out+=Ci(x,150,(acc?15:8)+7,'none',C.amber);
    out+=TF(x,186,acc?'ONE':(m==='68'&&j%3===2?'a':'and'),13,acc?C.ink:C.muted);}
   if(bar===0)out+=L(x0+225,96,x0+225,196,C.line,2);
  }
  out+=R(70,226,460,62,'#fff',C.grid,10)+T(300,252,'Same notes, same tempo: only the accents move.',15,C.ink)+T(300,274,'Two beats of three feel lilting; three beats of two feel square.',14,C.muted);
  return {svg:out,phase:s.mode==='alt'?'Alternating bars swing between two dotted-crotchet beats and three crotchet beats. Composers from the Baroque to Broadway use the switch at cadences and in dance music.':'Hemiola is a 3:2 relationship hiding inside six even pulses. Change the grouping and listen to the feel change.'};
 }});

/* ---------- syncopation ---------- */
const M6_LHL16=[0,-4,-3,-4,-2,-4,-3,-4,-1,-4,-3,-4,-2,-4,-3,-4];
// Longuet-Higgins & Lee (1984): a note followed (before the next note) by a rest on a stronger position is syncopated by the difference in weight.
function M6_sync(steps){const n=16;let total=0;const marks=[];
 for(let i=0;i<n;i++)if(steps[i]){let best=null;for(let d=1;d<n;d++){const j=(i+d)%n;if(steps[j])break;if(best===null||M6_LHL16[j]>M6_LHL16[best])best=j}
  if(best!==null&&M6_LHL16[best]>M6_LHL16[i]){const v=M6_LHL16[best]-M6_LHL16[i];total+=v;marks.push([i,best,v])}}
 return {total,marks}}
const M6_set16=a=>range(16).map(i=>a.includes(i));
const M6_SYNC_PRESETS={beat:[0,4,8,12],off:[2,6,10,14],tresillo:[0,6,12],clave:[0,3,6,10,12]};
const M6_SY={ms:s=>60000/s.bpm/4,N:()=>16,step(s,i){if(s.steps[i])M6_sound('mid');if(i%4===0)M6_sound('click')}};
SCENE({id:'syncopation',name:'Syncopation',tag:'Accents where the metre is weak',
 definition:'Syncopation is a note on a weak position of the metre that is not followed by a note on the next stronger position, so the strong moment is left silent.',
 example:'Play on all four beats and nothing is syncopated. Move the notes to the “and”s and the downbeats fall silent: the rhythm pulls against the pulse.',
 desc:'A one-bar grid of sixteen semiquaver steps with metrical weights underneath; arcs link each syncopated note to the stronger silent position it leaves empty, and a counter totals the syncopation.',
 dur:11,research:'Longuet-Higgins, H. C. & Lee, C. S. (1984). The rhythmic interpretation of monophonic music. Music Perception 1(4): metrical weights and syncopation.',
 hint:'Press steps to turn notes on and off, or load a preset, then press Play. Watch the syncopation score as you move notes off the beat.',
 init:()=>({steps:M6_set16([0,3,6,10,12]),bpm:96,playing:false,pos:-1}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),names=['beat','tresillo','clave','off'];return {steps:M6_set16(M6_SYNC_PRESETS[names[k]]),bpm:96,playing:false,pos:-1}},
 ui:[{choose:[['beat','On the beat'],['off','Off the beat'],['tresillo','Tresillo'],['clave','Son clave']],label:'Preset',get:s=>s.preset||'',act:'preset'},{b:'Clear',act:'clear'},{range:'bpm',label:'Tempo (BPM)',min:60,max:160,step:2,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_SY,{toggle(s,i){i=Number(i);s.steps[i]=!s.steps[i];s.preset='';return 'keep'},preset(s,v){s.steps=M6_set16(M6_SYNC_PRESETS[v]);s.preset=v;return 'keep'},clear(s){s.steps=M6_set16([]);s.preset='';return 'keep'},bpm(s,v,ctx){s.bpm=v;M6_restart(s,ctx,M6_SY);return 'keep'}}),
 draw(s,f,X){
  const pos=M6_pos(s,X,16,s.bpm/60*4),sy=M6_sync(s.steps);let out=heading('Notes against the metrical grid');
  const x0=60,cw=30,y=96;
  for(let i=0;i<16;i++)if(i%4===0)out+=TF(x0+i*cw+cw/2,y-12,String(i/4+1),14,C.ink,'middle','font-weight="700"');
  out+=M6_row(X,x0,y,cw,40,16,i=>s.steps[i],pos,{act:'toggle',beatEvery:4,col:i=>sy.marks.some(m=>m[0]===i)?C.coral:C.blue});
  for(let i=0;i<16;i++){const h=(5+M6_LHL16[i])*12,x=x0+i*cw+5;out+=R(x,240-h,cw-10,h,'#c9dbe7','none',3)}
  out+=TF(x0-8,236,'weight',13,C.muted,'end');
  for(const [a,b,v] of sy.marks){const xa=x0+a*cw+cw/2,xb=x0+(b<a?b+16:b)*cw+cw/2,xe=Math.min(xb,x0+16*cw+12);out+=P(`M${xa} 142 Q${(xa+xe)/2} ${178} ${xe} 142`,C.coral,2);out+=TF((xa+xe)/2,174,'+'+v,13,C.coral)}
  out+=counter(400,262,'syncopation score',String(sy.total),sy.total?C.coral:C.blue,140)+T(60,290,'Coral notes leave a stronger position silent.',14,C.muted,'start');
  return {svg:out,phase:sy.total?`Score ${sy.total}: each coral note is followed by silence on a stronger position, so the pulse is felt but not played. The score adds up the differences in metrical weight.`:'Score 0: every note sits on a position at least as strong as the silences that follow it, so nothing pulls against the beat.'};
 }});

const M6_STYLES={
 march:{name:'March: accents on 1 and 3',lanes:[['Bass drum','low',[0,8]],['Snare','mid',[4,12]],['Hi-hat','hat',[]]]},
 backbeat:{name:'Backbeat: snare on 2 and 4',lanes:[['Bass drum','low',[0,8,10]],['Snare','mid',[4,12]],['Hi-hat','hat',[0,2,4,6,8,10,12,14]]]},
 floor:{name:'Four on the floor',lanes:[['Bass drum','low',[0,4,8,12]],['Snare','mid',[4,12]],['Hi-hat','hat',[2,6,10,14]]]},
 onedrop:{name:'One drop (reggae): beat 1 left empty',lanes:[['Bass drum','low',[8]],['Rim','mid',[8]],['Guitar skank','high',[2,6,10,14]]]}
};
const M6_BB={ms:s=>60000/s.bpm/4,N:()=>16,step(s,i){for(const [,k,hits] of M6_STYLES[s.style].lanes)if(hits.includes(i))M6_sound(k)}};
SCENE({id:'syncopation-backbeat',name:'Backbeat and off-beat',tag:'Which beats get the accent',
 definition:'Styles differ in where they put their loudest sounds. A backbeat accents the metrically weaker beats 2 and 4; reggae’s one drop even leaves the downbeat empty.',
 example:'Rhythm and blues, rock and soul put the snare on 2 and 4, so the strongest sound lands on weaker beats while the bass drum keeps 1 and 3.',
 desc:'Three instrument lanes on a sixteen-step bar, over the metrical weights, for a march, a backbeat, four on the floor and a reggae one drop.',
 dur:11,research:['Danielsen, A. (2006). Presence and Pleasure: The Funk Grooves of James Brown and Parliament.','Longuet-Higgins, H. C. & Lee, C. S. (1984): metrical weights.'],
 hint:'Choose a style and press Play. Watch which lane lands on the strong (tall) positions.',
 init:()=>({style:'backbeat',bpm:96,playing:false,pos:-1}),
 watch(p){const k=['march','backbeat','floor','onedrop'][Math.min(3,Math.floor(p*4))];return {style:k,bpm:96,playing:false,pos:-1}},
 ui:[{choose:[['march','March'],['backbeat','Backbeat'],['floor','Four on the floor'],['onedrop','One drop']],label:'Style',get:s=>s.style,act:'style'},{range:'bpm',label:'Tempo (BPM)',min:60,max:160,step:2,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_BB,{style(s,v){s.style=v;return 'keep'},bpm(s,v,ctx){s.bpm=v;M6_restart(s,ctx,M6_BB);return 'keep'}}),
 draw(s,f,X){
  const st=M6_STYLES[s.style],pos=M6_pos(s,X,16,s.bpm/60*4);let out=heading(st.name);
  const x0=140,cw=27;
  for(let i=0;i<16;i++){const h=(5+M6_LHL16[i])*9;out+=R(x0+i*cw+4,104-h,cw-8,h,'#c9dbe7','none',3);if(i%4===0)out+=TF(x0+i*cw+cw/2,122,String(i/4+1),14,C.ink,'middle','font-weight="700"')}
  out+=TF(x0-10,100,'metre',13,C.muted,'end');
  const cols=[C.blue,C.coral,C.green];
  st.lanes.forEach(([nm,k,hits],li)=>{const y=140+li*52;out+=TF(x0-10,y+25,nm,13,C.ink,'end');out+=M6_row(X,x0,y,cw,36,16,i=>hits.includes(i),pos,{beatEvery:4,col:()=>cols[li]})});
  const accents=st.lanes[1][2].map(i=>i/4+1).filter(Number.isInteger);
  return {svg:out,phase:s.style==='backbeat'?'The snare (coral) cracks on beats 2 and 4, metrically weaker than 1 and 3. That push against the grid is the backbeat.':s.style==='onedrop'?'In the one drop the bass drum and rim fall on beat 3 and beat 1 is left empty, while the guitar skanks on every off-beat.':s.style==='floor'?'Four on the floor: the bass drum marks every beat while the hi-hat fills the off-beats in between.':`A march accents ${accents.join(' and ')||'the strong beats'} with the snare: the loudness agrees with the metre.`};
 }});

const M6_GROOVE=[[0,4,8,12],[0,4,6,12],[0,3,6,10,12],[0,3,7,10,14],[3,6,10,14],[1,3,6,9,11,14]];
const M6_GR={ms:s=>60000/s.bpm/4,N:()=>16,step(s,i){if(M6_GROOVE[s.k].includes(i))M6_sound('mid');if(i%4===0)M6_sound('low');if(i%2===0)M6_sound('hat')}};
SCENE({id:'syncopation-groove',name:'Groove and the sweet spot',tag:'How much syncopation makes us move',
 definition:'Groove is the pleasurable urge to move with music. In listening experiments it rises with syncopation up to a point, then falls when the rhythm becomes too hard to follow.',
 example:'A rhythm with no syncopation feels stiff; one that is all off-beats loses the pulse. Medium syncopation, like a funk or clave pattern, tends to be rated most danceable.',
 desc:'Six rhythms ordered by syncopation score on a chart with an inverted-U curve for the urge to move; the chosen rhythm is marked on the curve and shown on a grid.',
 dur:10,research:'Witek, M. A. G. et al. (2014). Syncopation, body-movement and pleasure in groove music. PLoS ONE 9(4): e94446 (inverted U). The curve here is illustrative.',
 hint:'Slide through the six rhythms from plain to heavily syncopated and press Play. Where on the curve do you most want to move?',
 init:()=>({k:2,bpm:100,playing:false,pos:-1}),
 watch(p){return {k:Math.min(5,Math.floor(p*6)),bpm:100,playing:false,pos:-1}},
 ui:[{range:'k',label:'Rhythm',min:0,max:5,get:s=>s.k,act:'k',show:v=>(Number(v)+1)+' of 6'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_GR,{k(s,v){s.k=Number(v);return 'keep'}}),
 draw(s,f,X){
  const pos=M6_pos(s,X,16,s.bpm/60*4),pats=M6_GROOVE.map(p=>({p,sc:M6_sync(M6_set16(p)).total})),cur=pats[s.k];let out=heading('More syncopation is not always more groove');
  out+=M6_row(X,60,58,30,30,16,i=>cur.p.includes(i),pos,{beatEvery:4});
  const gx=80,gy=320,gw=440,gh=180,max=14,fx=x=>gx+x/max*gw,fy=v=>gy-v*gh;
  out+=L(gx,gy,gx+gw,gy,C.line,2)+L(gx,gy,gx,gy-gh,C.line,2)+TF(gx+gw/2,gy+28,'syncopation score →',13,C.muted)+TF(gx+6,gy-gh-8,'↑ urge to move',13,C.muted,'start');
  let d='';for(let x=0;x<=max;x+=.25){const v=Math.max(0,1-Math.pow((x-6)/7.5,2));d+=(x?'L':'M')+fmt(fx(x))+' '+fmt(fy(v*.95))}
  out+=P(d,C.purple,3)+TF(gx+gw-4,gy-gh+6,'illustrative shape',13,C.muted,'end');
  pats.forEach((q,i)=>{const v=Math.max(0,1-Math.pow((q.sc-6)/7.5,2))*.95;out+=Ci(fx(q.sc),fy(v),i===s.k?9:5,i===s.k?C.coral:'#fff',i===s.k?C.coral:C.purple)});
  out+=TF(fx(cur.sc),fy(Math.max(0,1-Math.pow((cur.sc-6)/7.5,2))*.95)-16,'score '+cur.sc,13,C.coral);
  return {svg:out,phase:`This rhythm scores ${cur.sc}. Witek and colleagues (2014) found that ratings of pleasure and wanting to move peaked at medium syncopation and dropped for both very plain and very syncopated drum breaks.`};
 }});

/* ---------- polyrhythm ---------- */
const M6_PR={ms:s=>s.cycle*1000/M6_lcm(s.a,s.b),N:s=>M6_lcm(s.a,s.b),step(s,i){const N=M6_lcm(s.a,s.b);if(i%(N/s.a)===0)M6_sound('high');if(i%(N/s.b)===0)M6_sound('low')}};
SCENE({id:'polyrhythm',name:'Polyrhythm',tag:'Two pulses at once',
 definition:'A polyrhythm sounds two (or more) evenly spaced pulses at the same time over the same span, such as three beats against two.',
 example:'Tap three evenly with one hand and two evenly with the other in the same time: the hands meet only at the start of each cycle. Layered cross-rhythms are central to much West African and Afro-Cuban music.',
 desc:'Two concentric circles divide one cycle into a beats and b beats; a hand sweeps round both, and a strip below shows how the two pulses interleave.',
 dur:11,research:'Arom, S. (1991). African Polyphony and Polyrhythm: Musical Structure and Methodology.',
 hint:'Set the two counts and the cycle length, then press Play: high clicks play the outer pulse, low tones the inner one.',
 init:()=>({a:3,b:2,cycle:1.6,playing:false,pos:-1}),
 watch(p){return p<.5?{a:3,b:2,cycle:1.6,playing:false,pos:-1}:{a:4,b:3,cycle:1.6,playing:false,pos:-1}},
 ui:[{range:'a',label:'Outer',min:2,max:7,get:s=>s.a,act:'a'},{range:'b',label:'Inner',min:2,max:7,get:s=>s.b,act:'b'},{range:'cycle',label:'Cycle (s)',min:.8,max:3,step:.1,get:s=>s.cycle,act:'cycle'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_PR,{a(s,v,ctx){s.a=v;M6_restart(s,ctx,M6_PR);return 'keep'},b(s,v,ctx){s.b=v;M6_restart(s,ctx,M6_PR);return 'keep'},cycle(s,v,ctx){s.cycle=v;M6_restart(s,ctx,M6_PR);return 'keep'}}),
 draw(s,f,X){
  const N=M6_lcm(s.a,s.b),pos=M6_pos(s,X,N,N/s.cycle);let out=heading(`${s.a} against ${s.b}`);
  const cx=150,cy=205;
  out+=M6_ring(X,cx,cy,110,N,i=>i%(N/s.a)===0,pos,{col:()=>C.blue,big:11});
  out+=M6_ring(X,cx,cy,64,N,i=>i%(N/s.b)===0,pos,{col:()=>C.coral,big:11,ring:'#e3d5cf'});
  out+=TF(cx,cy+5,'cycle',13,C.muted);
  const x0=350,cw=Math.min(34,220/N);
  out+=TF(x0,92,`Composite on ${N} equal steps`,14,C.ink,'start','font-weight="650"');
  out+=TF(x0-6,128,s.a+':',13,C.blue,'end')+M6_row(X,x0,112,cw,24,N,i=>i%(N/s.a)===0,pos,{col:()=>C.blue});
  out+=TF(x0-6,164,s.b+':',13,C.coral,'end')+M6_row(X,x0,148,cw,24,N,i=>i%(N/s.b)===0,pos,{col:()=>C.coral});
  const both=range(N).filter(i=>i%(N/s.a)===0||i%(N/s.b)===0),iois=both.map((v,k)=>(both[k+1]??N)-v);
  out+=TF(x0-6,200,'both:',13,C.ink,'end')+M6_row(X,x0,184,cw,24,N,i=>both.includes(i),pos,{col:i=>i===0?C.purple:'#8b78bd'});
  out+=TF(x0,236,'gaps: '+iois.join(' · '),14,C.ink,'start');
  out+=TF(x0,262,M6_gcd(s.a,s.b)===1?'They meet only on step 1.':`They meet ${M6_gcd(s.a,s.b)} times per cycle.`,13,C.muted,'start');
  return {svg:out,phase:`Divide one cycle into ${N} tiny steps (the lowest common multiple of ${s.a} and ${s.b}): the ${s.a}-pulse lands every ${N/s.a} step${N/s.a>1?'s':''} and the ${s.b}-pulse every ${N/s.b}. Together they make the composite rhythm ${iois.join('-')}.${s.a===s.b?' With equal counts there is no cross-rhythm at all.':''}`};
 }});

const M6_RATIOS={'3:2':[3,2],'4:3':[4,3],'5:4':[5,4],'3:4':[3,4]};
const M6_PG={ms:s=>1400/M6_lcm(...M6_RATIOS[s.r]),N:s=>M6_lcm(...M6_RATIOS[s.r]),step(s,i){const [a,b]=M6_RATIOS[s.r],N=M6_lcm(a,b),A=i%(N/a)===0,B=i%(N/b)===0;if(s.layer!=='b'&&A)M6_sound('high');if(s.layer!=='a'&&B)M6_sound('low')}};
SCENE({id:'polyrhythm-composite',name:'Hearing a cross-rhythm',tag:'Which pulse is the beat?',
 definition:'In a cross-rhythm the ear can lock onto either pulse as “the beat” and hear the other as playing across it; the composite of both is a rhythm in its own right.',
 example:'In 3:2 the composite is long-short-short-long (2-1-1-2 small steps). Listen to the threes alone, then the twos, then both, and notice your sense of the beat shift.',
 desc:'A small-step grid for a chosen ratio with lanes for each pulse and their composite; the listener chooses which layer to hear.',
 dur:10,research:['Arom, S. (1991). African Polyphony and Polyrhythm.','London, J. (2004). Hearing in Time: listeners entrain to one pulse at a time.'],
 hint:'Choose a ratio and which layer to hear, then press Play. Switch layers while it plays.',
 init:()=>({r:'3:2',layer:'both',playing:false,pos:-1}),
 watch(p){return {r:p<.5?'3:2':'4:3',layer:'both',playing:false,pos:-1}},
 ui:[{choose:Object.keys(M6_RATIOS).map(k=>[k,k]),label:'Ratio',get:s=>s.r,act:'r'},{choose:[['a','First only'],['b','Second only'],['both','Both']],label:'Hear',get:s=>s.layer,act:'layer'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_PG,{r(s,v,ctx){s.r=v;M6_restart(s,ctx,M6_PG);return 'keep'},layer(s,v){s.layer=v;return 'keep'}}),
 draw(s,f,X){
  const [a,b]=M6_RATIOS[s.r],N=M6_lcm(a,b),pos=M6_pos(s,X,N,N/1.4);let out=heading(`${a}:${b} on ${N} small steps`);
  const cw=Math.min(40,440/N),x0=300-N*cw/2;
  const lanes=[[`${a} per cycle`,i=>i%(N/a)===0,C.blue,s.layer!=='b'],[`${b} per cycle`,i=>i%(N/b)===0,C.coral,s.layer!=='a'],['composite',i=>i%(N/a)===0||i%(N/b)===0,C.purple,true]];
  lanes.forEach(([nm,fn,col,on],li)=>{const y=86+li*64;out+=TF(x0,y-8,nm,13,on?col:C.muted,'start','font-weight="650"');out+=M6_row(X,x0,y,cw,34,N,fn,pos,{col:()=>on?col:'#d8e1e7'})});
  const both=range(N).filter(i=>i%(N/a)===0||i%(N/b)===0),iois=both.map((v,k)=>(both[k+1]??N)-v);
  out+=R(120,292,360,50,'#fff',C.grid,10)+T(300,315,'composite gaps: '+iois.join(' · '),15,C.ink)+TF(300,334,'(in small steps; the pattern repeats every cycle)',13,C.muted);
  return {svg:out,phase:s.layer==='both'?`Together the two pulses make the composite ${iois.join('-')}. Many listeners hear one layer as the beat and the other as crossing it.`:`Now you hear only the ${s.layer==='a'?a:b}-pulse. Switch to both and see whether it still feels like the beat.`};
 }});

const M6_BELL=[0,2,4,5,7,9,11];
const M6_BP={ms:s=>60000/s.bpm/3,N:()=>12,step(s,i){if(M6_BELL.includes(i))M6_sound('bell');const step=s.feel==='4'?3:4;if(s.feel!=='none'&&i%step===0)M6_sound('low')}};
SCENE({id:'polyrhythm-bell',name:'The standard bell pattern',tag:'Seven strokes in a cycle of twelve',
 definition:'A widespread West African bell pattern places seven strokes in a cycle of twelve fast pulses. Heard against four dance beats or against three, it sits in a 3:2 tension.',
 example:'Ewe drumming in Ghana uses this pattern on the gankogui bell; versions travelled to Cuba and Brazil. Its gaps are 2-2-1-2-2-2-1.',
 desc:'A circle of twelve pulses with the seven bell strokes filled, and markers for the chosen dance beat: four groups of three or three groups of four.',
 dur:11,research:['Agawu, K. (2006). Structural analysis or cultural analysis? Competing perspectives on the “standard pattern” of West African rhythm. JAMS 59(1).','Arom, S. (1991). African Polyphony and Polyrhythm.'],
 hint:'Choose the dance beat to play under the bell (in four, in three, or none) and press Play: the same seven strokes take on a different shape.',
 init:()=>({feel:'4',bpm:100,playing:false,pos:-1}),
 watch(p){return {feel:p<.5?'4':'3',bpm:100,playing:false,pos:-1}},
 ui:[{choose:[['4','Beat in 4'],['3','Beat in 3'],['none','Bell alone']],label:'Beat',get:s=>s.feel,act:'feel'},{range:'bpm',label:'Tempo (pulse groups/min)',min:60,max:140,step:2,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_BP,{feel(s,v){s.feel=v;return 'keep'},bpm(s,v,ctx){s.bpm=v;M6_restart(s,ctx,M6_BP);return 'keep'}}),
 draw(s,f,X){
  const pos=M6_pos(s,X,12,s.bpm/60*3),step=s.feel==='4'?3:4;let out=heading('Seven bell strokes in twelve pulses');
  const cx=170,cy=205;
  out+=M6_ring(X,cx,cy,115,12,i=>M6_BELL.includes(i),pos,{col:()=>C.amber,big:12,labels:i=>String(i+1)});
  if(s.feel!=='none')for(let i=0;i<12;i+=step){const a=-Math.PI/2+i*M6_TAU/12;out+=Ci(cx+72*Math.cos(a),cy+72*Math.sin(a),9,C.blue);}
  if(s.feel!=='none'){let d='';for(let i=0;i<=12;i+=step){const a=-Math.PI/2+(i%12)*M6_TAU/12;d+=(i?'L':'M')+fmt(cx+72*Math.cos(a))+' '+fmt(cy+72*Math.sin(a))}out+=P(d,C.blue,1.5,'none','opacity=".5"')}
  out+=TB(450,110,'Bell gaps',15,C.amber)+TMF(450,136,'2 2 1 2 2 2 1',15,C.ink);
  out+=TB(450,186,s.feel==='4'?'Dance beat in 4':s.feel==='3'?'Dance beat in 3':'No beat',15,C.blue);
  out+=TF(450,210,s.feel==='4'?'every 3 pulses (12/8)':s.feel==='3'?'every 4 pulses (3/4)':'',13,C.muted);
  out+=T(450,264,'Strokes on beats:',14,C.ink)+TB(450,288,s.feel==='none'?'—':String(M6_BELL.filter(i=>i%step===0).length)+' of '+(12/step),17,C.ink);
  return {svg:out,phase:`The bell’s seven strokes fall on pulses ${M6_BELL.map(i=>i+1).join(', ')}. ${s.feel==='none'?'Heard alone, many listeners find it ambiguous where the beat is.':'Against the dance beat only some strokes coincide; the rest cross it, giving the pattern its drive.'}`};
 }});

/* ---------- euclidean-rhythms ---------- */
function M6_euclid(k,n,rot=0){k=clamp(k,0,n);const b=range(n).map(i=>((i*k)%n)<k);return range(n).map(i=>b[(i+rot)%n])}
function M6_canon(bits){const n=bits.length;let best=null;for(let r=0;r<n;r++){const s=bits.map((_,i)=>bits[(i+r)%n]?'x':'.').join('');if(best===null||s<best)best=s}return best}
const M6_NAMED=[{k:3,n:8,name:'Cuban tresillo (3-3-2)'},{k:5,n:8,name:'Cuban cinquillo'},{k:7,n:12,name:'West African bell pattern'},{k:2,n:4,name:'evenly spaced: two beats'},{k:4,n:16,name:'four on the floor'}];
function M6_nameOf(k,n){const c=M6_canon(M6_euclid(k,n));const m=M6_NAMED.find(q=>q.n===n&&M6_canon(M6_euclid(q.k,q.n))===c);return m?m.name:null}
const M6_EU={ms:s=>60000/s.bpm/2,N:s=>s.n,step(s,i){const b=M6_euclid(s.k,s.n,s.rot);if(b[i])M6_sound(i===0?'low':'mid');else M6_sound('click')}};
SCENE({id:'euclidean-rhythms',name:'Euclidean rhythms',tag:'Spread k hits over n steps',
 definition:'A Euclidean rhythm spaces k onsets as evenly as possible among n pulses. Many traditional rhythms turn out to be such maximally even patterns, or rotations of them.',
 example:'Three hits in eight steps gives x..x..x., the Cuban tresillo; five in eight gives the cinquillo; seven in twelve gives (a rotation of) the West African bell pattern.',
 desc:'A circle of n steps with k hits spread evenly and joined into a polygon, with the gaps between hits listed and any traditional name it matches.',
 dur:11,research:'Toussaint, G. (2005). The Euclidean algorithm generates traditional musical rhythms. Proceedings of Bridges 2005.',
 hint:'Set hits (k), steps (n) and rotation, then press Play. Find the tresillo (3, 8) and the bell pattern (7, 12).',
 init:()=>({k:3,n:8,rot:0,bpm:110,playing:false,pos:-1}),
 watch(p){const L=[[3,8],[5,8],[7,12],[5,16]],q=L[Math.min(3,Math.floor(p*4))];return {k:q[0],n:q[1],rot:0,bpm:110,playing:false,pos:-1}},
 ui:[{range:'k',label:'Hits k',min:1,max:16,get:s=>s.k,act:'k'},{range:'n',label:'Steps n',min:2,max:16,get:s=>s.n,act:'n'},{range:'rot',label:'Rotate',min:0,max:15,get:s=>s.rot,act:'rot'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_EU,{k(s,v){s.k=Math.min(v,s.n);return 'keep'},n(s,v,ctx){s.n=v;s.k=Math.min(s.k,v);s.rot=s.rot%v;M6_restart(s,ctx,M6_EU);return 'keep'},rot(s,v){s.rot=v%s.n;return 'keep'}}),
 draw(s,f,X){
  const b=M6_euclid(s.k,s.n,s.rot),pos=M6_pos(s,X,s.n,s.bpm/60*2);let out=heading(`E(${s.k}, ${s.n}): ${s.k} hits in ${s.n} steps`);
  const cx=180,cy=205,r=120,pts=range(s.n).filter(i=>b[i]).map(i=>{const a=-Math.PI/2+i*M6_TAU/s.n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)]});
  if(pts.length>1)out+=P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L')+'Z',C.blue,2,C.pale);
  out+=M6_ring(X,cx,cy,r,s.n,i=>b[i],pos,{big:11});
  const on=range(s.n).filter(i=>b[i]),gaps=on.map((v,k)=>(on[k+1]??on[0]+s.n)-v);
  out+=TB(440,96,'Pattern',15,C.ink)+TMF(440,122,b.map(x=>x?'x':'.').join(''),17,C.ink);
  out+=TB(440,170,'Gaps between hits',15,C.ink)+TMF(440,196,gaps.join(' ')||'—',15,C.blue);
  const nm=M6_nameOf(s.k,s.n);
  out+=R(330,226,220,64,nm?C.amberp:'#fff',nm?C.amber:C.grid,10)+T(440,252,nm?'Known as':'No common name here',14,C.muted)+(nm?TB(440,276,nm,14,C.ink):'');
  out+=TF(440,316,'At most two gap sizes:',13,C.muted)+TF(440,334,'as even as possible.',13,C.muted);
  return {svg:out,phase:`${s.k} hits in ${s.n} steps leave gaps of ${[...new Set(gaps)].sort((a,b)=>b-a).join(' and ')} step${gaps.every(g=>g===1)?'':'s'}, the most even spacing possible. ${nm?`Up to rotation this is the ${nm}.`:'Toussaint (2005) found that many rhythms from around the world are patterns like this.'}`};
 }});

// Bjorklund (2003): repeatedly pair remaining groups, as in Euclid's algorithm on the counts.
function M6_bjork(k,n){k=clamp(k,1,n);let A=range(k).map(()=>'x'),B=range(n-k).map(()=>'.');const fr=[{A:A.slice(),B:B.slice(),say:`Start with ${k} hit-groups and ${n-k} rest-groups.`}];
 while(B.length>1){const m=Math.min(A.length,B.length),nA=range(m).map(i=>A[i]+B[i]),rem=A.length>m?A.slice(m):B.slice(m);A=nA;B=rem;fr.push({A:A.slice(),B:B.slice(),say:`Pair ${m} groups: attach one leftover group to each. ${B.length} group${B.length===1?'':'s'} remain${B.length===1?'s':''}.`})}
 fr.push({A,B,done:true,say:`Read the groups in order: ${A.join('')+B.join('')}.`});return fr}
SCENE({id:'euclidean-rhythms-bjorklund',name:'Bjorklund’s algorithm',tag:'Euclid’s algorithm, played as rhythm',
 definition:'Bjorklund’s algorithm builds the most even rhythm by repeatedly attaching leftover groups to the existing ones, the same steps as Euclid’s algorithm for the greatest common divisor.',
 example:'For 3 hits in 8 steps: [x][x][x] and five rests become [x.][x.][x.] with two rests left, then [x..][x..] with [x.] left: x..x..x.',
 desc:'Rows of groups, hits and rests, being paired step by step until one or no group is left over, then read out as a rhythm.',
 dur:11,research:['Bjorklund, E. (2003). The theory of rep-rate pattern generation in the SNS timing system. SNS ASD Technical Note.','Toussaint, G. (2005). The Euclidean algorithm generates traditional musical rhythms.'],
 hint:'Choose k and n, then Step through the pairing. Compare the counts with Euclid’s remainders for k and n.',
 init:()=>({k:5,n:8}),
 ui:[{range:'k',label:'Hits k',min:1,max:12,get:s=>s.k,act:'k'},{range:'n',label:'Steps n',min:2,max:16,get:s=>s.n,act:'n'},{b:'Hear the result',act:'hear'}],
 on:{k(s,v){s.k=Math.min(v,s.n)},n(s,v){s.n=v;s.k=Math.min(s.k,v)},hear(s){const b=M6_bjork(s.k,s.n).at(-1),str=b.A.join('')+b.B.join('');const notes=[];for(let r=0;r<2;r++)Array.from(str).forEach((c,i)=>{if(c==='x')notes.push({hz:i===0?131:196,at:(r*str.length+i)*.18,dur:.12})});AUDIO.seq(notes,{type:'triangle',gain:.2});return 'keep'}},
 trace(s){return M6_bjork(s.k,s.n)},
 draw(s,f,X){
  let out=heading(`Building E(${s.k}, ${s.n}) by pairing groups`);
  const groups=f.A.map(g=>[g,'A']).concat(f.B.map(g=>[g,'B'])),total=groups.reduce((a,[g])=>a+g.length,0),cw=Math.min(30,520/Math.max(1,total));
  let x=300-total*cw/2-(groups.length-1)*3;
  for(const [g,w] of groups){out+=R(x-3,96,g.length*cw+6,58,w==='A'?C.pale:'#f4ece9',w==='A'?C.blue:C.coral,8);
   for(let i=0;i<g.length;i++){out+=TM(x+i*cw+cw/2,132,g[i],Math.min(22,cw*.9),g[i]==='x'?C.ink:C.muted,'middle','font-weight="700"')}x+=g.length*cw+6}
  out+=TF(300,184,`${f.A.length} main group${f.A.length===1?'':'s'} (blue) · ${f.B.length} leftover (coral)`,14,C.muted);
  out+=R(110,214,380,52,'#fff',C.grid,10)+T(300,246,f.say,14,C.ink);
  if(f.done){const str=f.A.join('')+f.B.join('');out+=TM(300,304,str,22,C.blue,'middle','font-weight="700"')+TF(300,330,M6_nameOf(s.k,s.n)?'= '+M6_nameOf(s.k,s.n)+' (up to rotation)':'the maximally even pattern',13,C.muted)}
  return {svg:out,phase:f.say+' Each round shrinks the leftover count the way Euclid’s algorithm shrinks remainders.'};
 }});

const M6_NECK={tresillo:[3,8],cinquillo:[5,8],bell:[7,12],e512:[5,12]};
const M6_NK={ms:()=>60000/110/2,N:s=>M6_NECK[s.base][1],step(s,i){const [k,n]=M6_NECK[s.base];if(M6_euclid(k,n,s.rot)[i])M6_sound(i===0?'low':'mid');else M6_sound('click')}};
SCENE({id:'euclidean-rhythms-necklace',name:'Rhythm necklaces',tag:'Same pattern, different starting point',
 definition:'A rhythm necklace is a cyclic pattern considered without a fixed start. Rotating it changes where the downbeat falls and often turns one named rhythm into another.',
 example:'Rotating the twelve-pulse bell pattern gives several versions used in different African and Afro-Caribbean traditions; the gaps stay the same, only their starting point moves.',
 desc:'Every rotation of a chosen pattern listed as a row of cells; the selected rotation is highlighted and its gap sequence shown.',
 dur:10,research:'Toussaint, G. (2013). The Geometry of Musical Rhythm: necklaces and rotations.',
 hint:'Choose a pattern, press a row to pick its rotation, then Play to hear where the downbeat now falls.',
 init:()=>({base:'cinquillo',rot:0,playing:false,pos:-1}),
 watch(p){const n=8;return {base:'cinquillo',rot:Math.min(n-1,Math.floor(p*n)),playing:false,pos:-1}},
 ui:[{choose:[['tresillo','E(3,8)'],['cinquillo','E(5,8)'],['bell','E(7,12)'],['e512','E(5,12)']],label:'Pattern',get:s=>s.base,act:'base'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_NK,{base(s,v,ctx){s.base=v;s.rot=0;M6_restart(s,ctx,M6_NK);return 'keep'},pick(s,v){s.rot=Number(v);return 'keep'}}),
 draw(s,f,X){
  const [k,n]=M6_NECK[s.base],pos=M6_pos(s,X,n,110/60*2);let out=heading(`All ${n} rotations of E(${k}, ${n})`);
  const cw=Math.min(24,300/n),rh=Math.min(24,270/n),x0=70,y0=52;
  for(let r=0;r<n;r++){const b=M6_euclid(k,n,r),y=y0+r*rh,sel=r===s.rot;
   const inner=R(x0-8,y-1,n*cw+16,rh,sel?C.amberp:'transparent',sel?C.amber:'none',5)+range(n).map(i=>R(x0+i*cw+1,y+2,cw-2,rh-6,b[i]?C.blue:'#fff',b[i]?'none':C.grid,3)).join('');
   out+=hit(X,'pick',r,`Rotation ${r}`,inner)+TF(x0-14,y+rh/2+4,String(r),13,sel?C.amber:C.muted,'end');}
  const b=M6_euclid(k,n,s.rot),on=range(n).filter(i=>b[i]),gaps=on.map((v,j)=>(on[j+1]??on[0]+n)-v);
  out+=TB(470,110,'Rotation '+s.rot,16,C.amber)+TM(470,140,b.map(x=>x?'x':'.').join(''),15,C.ink);
  out+=T(470,184,'gaps from step 1:',14,C.muted)+TM(470,208,gaps.join(' · '),15,C.blue);
  out+=T(470,256,b[0]?'starts on a hit':'starts on a rest',14,b[0]?C.green:C.coral);
  if(pos>=0)out+=R(x0+pos*cw,y0+s.rot*rh-3,cw,rh+2,'none',C.amber,3);
  return {svg:out,phase:`Every row is the same circle of gaps (${gaps.slice().sort((a,b)=>a-b).join(', ')}) read from a different starting step. Where the cycle starts decides which hits feel like the downbeat.`};
 }});

/* ---------- swing-groove ---------- */
const M6_SW={ms:s=>60000/s.bpm,N:()=>4,step(s,i){const beat=60/s.bpm,f=s.ratio/(s.ratio+1);M6_sound('hat',0);M6_sound('hat',beat*f);if(i%2===1)M6_sound('mid');else M6_sound('low')}};
SCENE({id:'swing-groove',name:'Swing',tag:'Long-short pairs of quavers',
 definition:'Swing plays pairs of quavers unequally, long then short. The swing ratio is the length of the first note divided by the second.',
 example:'Straight quavers are 1:1. A triplet feel is 2:1 (the first note takes two thirds of the beat). Players often swing more at slow tempi and less at fast ones.',
 desc:'Four beats on a timeline, each split into a long and a short hi-hat stroke by the swing ratio, with the two durations given in milliseconds.',
 dur:11,research:'Friberg, A. & Sundström, A. (2002). Swing ratios and ensemble timing in jazz performance. Music Perception 19(3).',
 hint:'Slide the swing ratio from straight (1:1) through triplet (2:1) to a dotted feel (3:1) and press Play.',
 init:()=>({ratio:2,bpm:120,playing:false,pos:-1}),
 watch(p){return {ratio:Math.round((1+2*p)*10)/10,bpm:120,playing:false,pos:-1}},
 ui:[{range:'ratio',label:'Swing ratio',min:1,max:3.5,step:.1,get:s=>s.ratio,act:'ratio',show:v=>Number(v).toFixed(1)+' : 1'},{range:'bpm',label:'Tempo (BPM)',min:60,max:280,step:4,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_SW,{ratio(s,v){s.ratio=v;return 'keep'},bpm(s,v,ctx){s.bpm=v;M6_restart(s,ctx,M6_SW);return 'keep'}}),
 draw(s,f,X){
  const pos=M6_pos(s,X,4,s.bpm/60),fr=s.ratio/(s.ratio+1),beatMs=60000/s.bpm;let out=heading(`Swing ratio ${s.ratio.toFixed(1)} : 1`);
  const x0=60,bw=120;
  for(let b=0;b<4;b++){const x=x0+b*bw,cur=b===pos;out+=R(x+2,92,bw-4,70,cur?C.amberp:'#fff',cur?C.amber:C.grid,8);
   out+=R(x+6,100,(bw-12)*fr-3,54,C.blue,'none',5)+R(x+6+(bw-12)*fr,100,(bw-12)*(1-fr),54,'#9fc0d6','none',5);
   out+=TF(x+bw/2,186,String(b+1),15,C.ink,'middle','font-weight="700"')}
  out+=TF(x0,212,'long',13,C.blue,'start')+TF(x0+bw*fr,212,'short',13,'#5f88a3','start');
  out+=counter(150,236,'long note',Math.round(beatMs*fr)+' ms',C.blue,130)+counter(320,236,'short note',Math.round(beatMs*(1-fr))+' ms',C.purple,130);
  const feel=s.ratio<1.15?'straight quavers':Math.abs(s.ratio-2)<.15?'triplet swing (2:1)':s.ratio>2.85?'close to a dotted rhythm (3:1)':s.ratio<2?'light swing':'heavy swing';
  out+=T(300,318,'Feel: '+feel,16,C.ink);
  return {svg:out,phase:`At ${s.bpm} BPM a beat lasts ${Math.round(beatMs)} ms; a ${s.ratio.toFixed(1)}:1 swing splits it into ${Math.round(beatMs*fr)} ms and ${Math.round(beatMs*(1-fr))} ms. Written music usually shows both as equal quavers; the swing is in the playing.`};
 }});

const M6_SWR=bpm=>clamp(3.5-(bpm-100)*(2.5/200),1,3.5);
const M6_ST={ms:s=>60000/s.bpm,N:()=>4,step(s,i){const r=M6_SWR(s.bpm),beat=60/s.bpm;M6_sound('hat',0);M6_sound('hat',beat*r/(r+1));if(i%2===1)M6_sound('mid')}};
SCENE({id:'swing-groove-tempo',name:'Swing and tempo',tag:'Faster tunes swing less',
 definition:'In recorded jazz, drummers’ swing ratios fall as the tempo rises: strongly uneven at slow tempi and close to even at very fast ones, where the short note would otherwise become too short to play.',
 example:'At a slow tempo the cymbal’s long note can last about three times the short one; near 300 BPM the two become almost equal.',
 desc:'A chart of swing ratio against tempo following the measured trend, with a marker at the chosen tempo and the resulting long and short note lengths.',
 dur:10,research:'Friberg, A. & Sundström, A. (2002). Swing ratios and ensemble timing in jazz performance. Music Perception 19(3). Curve here: approximate trend, illustrative.',
 hint:'Move the tempo and press Play to hear the swing ratio follow the measured trend.',
 init:()=>({bpm:160,playing:false,pos:-1}),
 watch(p){return {bpm:Math.round(100+200*p),playing:false,pos:-1}},
 ui:[{range:'bpm',label:'Tempo (BPM)',min:100,max:300,step:4,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_ST,{bpm(s,v,ctx){s.bpm=v;M6_restart(s,ctx,M6_ST);return 'keep'}}),
 draw(s,f,X){
  const r=M6_SWR(s.bpm),gx=90,gy=300,gw=420,gh=200,fx=b=>gx+(b-100)/200*gw,fy=v=>gy-(v-1)/2.5*gh;let out=heading('Swing ratio against tempo');
  out+=L(gx,gy,gx+gw,gy,C.line,2)+L(gx,gy,gx,gy-gh,C.line,2);
  for(const b of [100,150,200,250,300])out+=TF(fx(b),gy+20,String(b),13,C.muted);
  for(const v of [1,2,3])out+=TF(gx-8,fy(v)+4,v+':1',13,C.muted,'end')+L(gx,fy(v),gx+gw,fy(v),'#eef3f6',1);
  out+=TF(gx+gw/2,gy+40,'tempo (BPM)',13,C.muted);
  let d='';for(let b=100;b<=300;b+=5)d+=(b===100?'M':'L')+fmt(fx(b))+' '+fmt(fy(M6_SWR(b)));out+=P(d,C.purple,3);
  out+=Ci(fx(s.bpm),fy(r),9,C.coral)+TBF(fx(s.bpm),fy(r)-16,r.toFixed(1)+':1',14,C.coral);
  out+=TF(gx+gw,gy-gh-8,'approximate measured trend (illustrative)',13,C.muted,'end');
  const beat=60000/s.bpm;
  return {svg:out,phase:`At ${s.bpm} BPM the trend gives about ${r.toFixed(1)}:1, so the short note lasts ${Math.round(beat/(r+1))} ms. Friberg and Sundström (2002) found the short note stayed roughly constant in absolute time across tempi, which is why the ratio falls as the beat gets shorter.`};
 }});

const M6_MT={ms:s=>60000/s.bpm,N:()=>4,step(s,i){const beat=60/s.bpm,f=2/3,lag=s.lag/1000;const d=Math.max(0,-lag),o=Math.max(0,lag);M6_sound('hat',d);M6_sound('hat',d+beat*f);
 // a negative offset (soloist ahead) is played by delaying the drummer instead, since sound cannot start before now
 AUDIO.tone(392,{dur:.13,type:'triangle',gain:.15,at:o});AUDIO.tone(440,{dur:.1,type:'triangle',gain:.13,at:beat*f+(s.all?o:d)})}};
SCENE({id:'swing-groove-microtiming',name:'Laying back',tag:'Tiny timing differences between players',
 definition:'Microtiming is the small, systematic offset of one player against another, often tens of milliseconds. It is far too small to write down, yet it shapes the feel of a groove.',
 example:'Friberg and Sundström found jazz soloists landing slightly behind the drummer on the downbeats while lining up with them on the off-beats; Keil called such offsets “participatory discrepancies”.',
 desc:'Two lanes, drummer and soloist, over four beats; the soloist’s notes are shifted by the chosen number of milliseconds, either on the downbeats only or on every note.',
 dur:10,research:['Friberg, A. & Sundström, A. (2002). Swing ratios and ensemble timing in jazz performance.','Keil, C. (1987). Participatory discrepancies and the power of music. Cultural Anthropology 2(3).'],
 hint:'Set how far the soloist lags (or leads) and whether every note moves or only the downbeats, then press Play.',
 init:()=>({lag:40,all:false,bpm:140,playing:false,pos:-1}),
 watch(p){return {lag:Math.round(-20+90*p),all:false,bpm:140,playing:false,pos:-1}},
 ui:[{range:'lag',label:'Soloist offset (ms)',min:-40,max:80,step:5,get:s=>s.lag,act:'lag'},{choose:[['down','Downbeats only'],['all','Every note']],label:'Which notes',get:s=>s.all?'all':'down',act:'which'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_MT,{lag(s,v){s.lag=v;return 'keep'},which(s,v){s.all=v==='all';return 'keep'}}),
 draw(s,f,X){
  const pos=M6_pos(s,X,4,s.bpm/60),beatMs=60000/s.bpm,x0=120,bw=108,pxms=bw/beatMs;let out=heading(s.lag>0?`Soloist ${s.lag} ms behind the drummer`:s.lag<0?`Soloist ${-s.lag} ms ahead of the drummer`:'Soloist exactly with the drummer');
  out+=TF(x0-24,128,'drummer',13,C.ink,'end')+TF(x0-24,208,'soloist',13,C.ink,'end');
  for(let b=0;b<4;b++){const x=x0+b*bw,cur=b===pos;out+=L(x,96,x,240,cur?C.amber:'#dbe5ec',cur?3:1.5)+TF(x,262,String(b+1),14,C.ink,'middle','font-weight="700"');
   out+=Ci(x,124,8,C.blue)+Ci(x+bw*2/3,124,6,C.blue);
   const d=s.lag*pxms,o=s.all?d:0;out+=Ci(x+d,204,9,C.coral)+Ci(x+bw*2/3+o,204,7,C.coral);
   if(Math.abs(d)>2)out+=L(x,204,x+d,204,C.coral,1.5,'stroke-dasharray="3 3"');}
  out+=R(110,284,380,50,'#fff',C.grid,10)+T(300,306,`${Math.abs(s.lag)} ms is ${Math.round(Math.abs(s.lag)/beatMs*100)}% of a beat at ${s.bpm} BPM`,15,C.ink)+TF(300,326,'too small to notate, large enough to feel',13,C.muted);
  return {svg:out,phase:s.lag>0?`Laying back by ${s.lag} ms ${s.all?'on every note':'on the downbeats only'} makes the soloist sound relaxed against a driving drummer. Off-beats that stay together keep the two locked.`:s.lag<0?'Playing ahead of the beat tends to sound urgent or rushed.':'With no offset the parts are perfectly aligned, which can sound mechanical.'};
 }});

/* ---------- rhythmic-cycles ---------- */
const M6_TEEN=['Dha','Dhin','Dhin','Dha','Dha','Dhin','Dhin','Dha','Dha','Tin','Tin','Ta','Ta','Dhin','Dhin','Dha'];
const M6_TEEN_MARK={0:'X',4:'2',8:'0',12:'3'};
function M6_bol(b){if(b==='Dha'){M6_sound('low');M6_sound('high')}else if(b==='Dhin'){M6_sound('low');M6_sound('mid')}else if(b==='Tin')M6_sound('mid');else M6_sound('high')}
const M6_TT={ms:s=>60000/s.mpm,N:()=>16,step(s,i){M6_bol(M6_TEEN[i])}};
SCENE({id:'rhythmic-cycles',name:'Rhythmic cycles: tala',tag:'Teentaal’s sixteen beats',
 definition:'A tala is a cyclic metre in Indian classical music. Teentaal has sixteen beats (matras) in four sections; the first beat, sam, is where phrases and improvisations come back together.',
 example:'Teentaal’s theka on the tabla: Dha Dhin Dhin Dha | Dha Dhin Dhin Dha | Dha Tin Tin Ta | Ta Dhin Dhin Dha. Claps fall on beats 1, 5 and 13; a wave of the hand marks the empty section (khali) at beat 9.',
 desc:'A circle of sixteen beats labelled with the tabla syllables of the Teentaal theka, with sam, the claps and khali marked and a playhead moving round.',
 dur:11,research:['Clayton, M. (2000). Time in Indian Music: Rhythm, Metre, and Form in North Indian Rāg Performance.','Natyashastra (traditionally attributed to Bharata; compiled roughly 200 BCE–200 CE): an early source on tala.'],
 hint:'Set the speed and press Play. Listen for the khali section: on Tin Tin Ta Ta (beats 10–13) the bass strokes drop out, then return before sam.',
 init:()=>({mpm:120,playing:false,pos:-1}),
 watch(){return {mpm:120,playing:false,pos:-1}},
 ui:[{range:'mpm',label:'Speed (matras/min)',min:60,max:240,step:4,get:s=>s.mpm,act:'mpm'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_TT,{mpm(s,v,ctx){s.mpm=v;M6_restart(s,ctx,M6_TT);return 'keep'}}),
 draw(s,f,X){
  const pos=M6_pos(s,X,16,s.mpm/60);let out=heading('Teentaal: 4 + 4 + 4 + 4 beats');
  const cx=175,cy=205;
  out+=M6_ring(X,cx,cy,112,16,i=>i in M6_TEEN_MARK,pos,{col:i=>i===8?C.coral:i===0?C.purple:C.blue,big:11,labels:i=>M6_TEEN[i],lr:30,labelCol:i=>i>=8&&i<12?C.coral:C.ink});
  for(const k in M6_TEEN_MARK){const a=-Math.PI/2+k*M6_TAU/16;out+=TBF(cx+88*Math.cos(a),cy+88*Math.sin(a)+5,M6_TEEN_MARK[k],14,k==='8'?C.coral:k==='0'?C.purple:C.blue)}
  out+=TB(cx,cy-4,'sam',16,C.purple)+TF(cx,cy+16,'beat 1',13,C.muted);
  out+=TB(450,104,'Signs',15,C.ink,'start');
  [['X','sam: clap',C.purple],['2, 3','claps (tali)',C.blue],['0','khali: a wave',C.coral]].forEach(([m,t,c],i)=>{out+=TBF(400,136+i*28,m,14,c,'start')+TF(440,136+i*28,t,13,C.ink,'start')});
  out+=T(470,250,pos>=0?`Beat ${pos+1}: ${M6_TEEN[pos]}`:'Theka on the tabla',15,C.ink,'middle');
  out+=TF(470,276,'Tin and Ta:',13,C.coral)+TF(470,294,'no bass stroke',13,C.coral);
  return {svg:out,phase:'The cycle is felt from sam to sam. In the khali section the bass of the tabla drops out (Tin, Ta), so even without seeing the hands a listener can tell where they are in the cycle.'};
 }});

const M6_CLAVES={'son32':[0,3,6,10,12],'son23':[2,4,8,11,14],'rumba32':[0,3,7,10,12],'rumba23':[2,4,8,11,15]};
const M6_CL={ms:s=>60000/s.bpm/4,N:()=>16,step(s,i){if(M6_CLAVES[s.clave].includes(i))M6_sound('bell');if(i%4===0)M6_sound(i%8===0?'low':'click')}};
SCENE({id:'rhythmic-cycles-clave',name:'Clave',tag:'The key pattern of Afro-Cuban music',
 definition:'Clave is a five-stroke pattern spread over two halves of a cycle: a “three side” and a “two side”. In Afro-Cuban music the other parts are arranged to fit its direction, 3-2 or 2-3.',
 example:'Son clave 3-2 sounds on steps 1, 4, 7, 11 and 13 of sixteen. Rumba clave delays the third stroke by one step, which makes it more tense.',
 desc:'A sixteen-step cycle split into two halves with the five clave strokes marked, for son and rumba clave in either direction, over a steady pulse.',
 dur:10,research:['Peñalosa, D. (2009). The Clave Matrix: Afro-Cuban Rhythm: Its Principles and African Origins.','Toussaint, G. (2013). The Geometry of Musical Rhythm.'],
 hint:'Choose a clave and press Play. Compare son and rumba, and hear what changes when the cycle starts on the other side.',
 init:()=>({clave:'son32',bpm:100,playing:false,pos:-1}),
 watch(p){const k=['son32','son23','rumba32','rumba23'][Math.min(3,Math.floor(p*4))];return {clave:k,bpm:100,playing:false,pos:-1}},
 ui:[{choose:[['son32','Son 3-2'],['son23','Son 2-3'],['rumba32','Rumba 3-2'],['rumba23','Rumba 2-3']],label:'Clave',get:s=>s.clave,act:'clave'},{range:'bpm',label:'Tempo (BPM)',min:70,max:140,step:2,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_CL,{clave(s,v){s.clave=v;return 'keep'},bpm(s,v,ctx){s.bpm=v;M6_restart(s,ctx,M6_CL);return 'keep'}}),
 draw(s,f,X){
  const hits=M6_CLAVES[s.clave],pos=M6_pos(s,X,16,s.bpm/60*4),three=s.clave.endsWith('32');let out=heading((s.clave.startsWith('son')?'Son':'Rumba')+' clave, '+(three?'3-2':'2-3'));
  const x0=60,cw=30;
  out+=R(x0,82,8*cw,26,three?C.amberp:'#eef3f6','none',6)+R(x0+8*cw,82,8*cw,26,three?'#eef3f6':C.amberp,'none',6);
  out+=TF(x0+4*cw,100,three?'three side':'two side',13,C.ink)+TF(x0+12*cw,100,three?'two side':'three side',13,C.ink);
  out+=M6_row(X,x0,118,cw,44,16,i=>hits.includes(i),pos,{beatEvery:4,col:()=>C.amber});
  for(let i=0;i<16;i++)out+=TF(x0+i*cw+cw/2,184,String(i+1),13,hits.includes(i)?C.ink:C.muted);
  for(let b=0;b<4;b++)out+=Ci(x0+b*4*cw+cw/2,206,6,C.blue);out+=TF(x0-8,210,'pulse',13,C.muted,'end');
  const gaps=hits.map((v,k)=>(hits[k+1]??hits[0]+16)-v);
  out+=R(110,236,380,56,'#fff',C.grid,10)+T(300,260,'gaps: '+gaps.join(' · '),15,C.ink)+TF(300,282,s.clave.startsWith('rumba')?'rumba moves the third stroke one step later':'the three side reproduces the tresillo (3-3-2)',13,C.muted);
  return {svg:out,phase:`Strokes on steps ${hits.map(h=>h+1).join(', ')}. ${three?'Starting on the three side':'Starting on the two side'}, the same five strokes give the cycle a different direction, and musicians arrange their parts to match it.`};
 }});

const M6_LANC=[['ketuk','ketuk',i=>i%2===0],['kenong','kenong',i=>i%4===3],['kempul','kempul',i=>[5,9,13].includes(i)],['gong','gong',i=>i===15]];
const M6_GM={ms:s=>60000/s.bpm,N:()=>16,step(s,i){for(const [,k,fn] of M6_LANC)if(fn(i))M6_sound(k);if(s.balungan)AUDIO.tone(midiHz([62,64,67,69][i%4]),{dur:.25,type:'triangle',gain:.1})}};
SCENE({id:'rhythmic-cycles-gamelan',name:'Gamelan cycles',tag:'The gong marks the end',
 definition:'In Javanese gamelan, gongs of different sizes divide a cycle (gongan) into nested parts, called colotomic structure. The great gong sounds on the last beat, where the cycle closes.',
 example:'In the short form lancaran, a sixteen-beat cycle has a small ketuk on odd beats, a kenong every fourth beat, a kempul on beats 6, 10 and 14, and the large gong on beat 16.',
 desc:'Four instrument lanes across a sixteen-beat lancaran cycle, from the frequent ketuk to the single gong stroke on the final beat.',
 dur:11,research:['Becker, J. (1979). Time and tune in Java. In The Imagination of Reality.','Lindsay, J. (1992). Javanese Gamelan (2nd edn).'],
 hint:'Press Play to hear one lancaran cycle repeat; add a simple melody to hear how the gongs frame it.',
 init:()=>({bpm:90,balungan:false,playing:false,pos:-1}),
 watch(){return {bpm:90,balungan:false,playing:false,pos:-1}},
 ui:[{range:'bpm',label:'Tempo (beats/min)',min:50,max:150,step:2,get:s=>s.bpm,act:'bpm'},{choose:[['off','Gongs only'],['on','Add melody']],label:'Layers',get:s=>s.balungan?'on':'off',act:'bal'},{b:'Play / stop',act:'play'}],
 on:M6_seqOn(M6_GM,{bpm(s,v,ctx){s.bpm=v;M6_restart(s,ctx,M6_GM);return 'keep'},bal(s,v){s.balungan=v==='on';return 'keep'}}),
 draw(s,f,X){
  const pos=M6_pos(s,X,16,s.bpm/60);let out=heading('Lancaran: one gong cycle of sixteen beats');
  const x0=130,cw=27,cols=[C.muted,C.blue,C.green,C.purple];
  M6_LANC.forEach(([nm,,fn],li)=>{const y=74+li*54;out+=TF(x0-10,y+24,nm,14,cols[li],'end','font-weight="650"');out+=M6_row(X,x0,y,cw,34,16,fn,pos,{beatEvery:4,col:()=>cols[li]})});
  for(let i=0;i<16;i++)out+=TF(x0+i*cw+cw/2,306,String(i+1),13,i===15?C.purple:C.muted,'middle',i===15?'font-weight="700"':'');
  out+=TF(x0+15*cw+cw/2,326,'gong',13,C.purple);
  return {svg:out,phase:'The pattern is end-weighted: lighter gongs mark the subdivisions and the deepest gong lands on the last beat, where the cycle closes and begins again. Longer forms such as ladrang stretch the same idea over more beats.'};
 }});
