/* Techno era 2 · Detroit (1985–1994): scenes. Simplified models of the machines, not circuit emulations. */
/* X2-HELPERS-START */
const X2_wrap=(str,n)=>{const out=[];let line='';for(const w of String(str).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out};
const X2_lines=(x,y,str,n=44,size=13,fill=C.ink,lh=18)=>X2_wrap(str,n).map((l,i)=>TF(x,y+i*lh,l,size,fill,'start')).join('');
// A small grey label centred under the heading.
const X2_note=t=>{const w=t.length*6.6+24;return R(300-w/2,40,w,22,'#e8eef2','none',11)+TF(300,55,t,13,C.muted)};
const X2_stepMs=bpm=>60000/bpm/4;
// A list of pressable items on the left and the chosen item's text on the right.
function X2_cards(o){
 const n=o.items.length;
 SCENE({id:o.id,name:o.name,tag:o.tag,definition:o.definition,example:o.example,desc:o.desc,research:o.research,dur:o.dur||12,hint:o.hint,
  init:()=>({i:0}),
  watch(p){return {i:Math.min(n-1,Math.floor(p*n))}},
  ui:[{b:'Previous',act:'prev'},{b:'Next',act:'next'}],
  on:{pick(s,v){s.i=clamp(+v,0,n-1);return 'keep'},next(s){s.i=(s.i+1)%n;return 'keep'},prev(s){s.i=(s.i+n-1)%n;return 'keep'}},
  draw(s,f,X){
   const it=o.items[s.i],rh=Math.min(40,264/n),dw=o.dw||46;let out=heading(o.heading)+(it.note?X2_note(it.note):'');
   o.items.forEach((q,i)=>{const y=74+i*rh,on=i===s.i;
    out+=hit(X,'pick',i,q.t,R(16,y,236,rh-5,on?C.pale:'#fff',on?C.blue:C.grid,7)+TBF(26,y+rh/2+2,q.d,13,on?C.blue:C.muted,'start')+TF(26+dw,y+rh/2+2,q.t,13,C.ink,'start'))});
   out+=R(262,74,322,264,'#f6f9fb','none',10)+TBF(276,98,it.title||it.t,15,C.ink,'start')+X2_lines(276,124,it.text,45);
   if(o.foot)out+=T(300,364,o.foot,15,C.muted);
   return {svg:out,phase:it.phase};
  }});
}
// A 16-step grid of tracks. o.tracks: [{name,col,pat,cycle?,labels?,sound(s,at,v,pos,k)}]. Optional o.presets
// [{name,pat,set?(s)}], o.ui, o.on, o.init, o.swing(s) (delay of every second 16th, as a fraction of a step),
// o.mute(s,k), o.below(s,X,pos,y), o.heading(s), o.phase(s), o.tempo [min,max].
function X2_grid(o){
 const fresh=k=>{const s={playing:false,pos:-1,token:0,bpm:o.bpm||124,preset:k,pat:(o.presets?o.presets[k].pat:o.tracks.map(t=>t.pat)).map(r=>r.slice()),...(o.init?o.init():{})};if(o.presets&&o.presets[k].set)o.presets[k].set(s);return s};
 const restart=(s,ctx)=>{if(s.playing){s.token++;s.pos=-1;ctx.every(X2_stepMs(s.bpm),'tick',s.token)}};
 const dur=o.dur||12,y0=o.y0||70,rh=o.rh||28;
 SCENE({id:o.id,name:o.name,tag:o.tag,definition:o.definition,example:o.example,desc:o.desc,research:o.research,dur,hint:o.hint,
  init:()=>fresh(0),
  watch(p){const k=o.presets?Math.min(o.presets.length-1,Math.floor(p*o.presets.length)):0;return {...fresh(k),...(o.watch?o.watch(p):{})}},
  ui:[...(o.presets?[{choose:o.presets.map((q,i)=>[String(i),q.name]),label:o.presetLabel||'Pattern',get:s=>String(s.preset),act:'preset'}]:[]),...(o.ui||[]),
   ...(o.tempo?[{range:'bpm',label:'Tempo (BPM)',min:o.tempo[0],max:o.tempo[1],step:1,get:s=>s.bpm,act:'bpm'}]:[]),{b:'Play / stop',act:'play'}],
  on:{
   play(s,a,ctx){s.token++;if(s.playing){s.playing=false;s.pos=-1;AUDIO.stopAll();return 'keep'}s.playing=true;s.pos=-1;ctx.every(X2_stepMs(s.bpm),'tick',s.token);return 'keep'},
   tick(s,tok){if(!s.playing||Number(tok)!==s.token)return 'stop';s.pos=(s.pos+1)%16;
    const at=s.pos%2?(o.swing?o.swing(s):0)*X2_stepMs(s.bpm)/1000:0;
    o.tracks.forEach((t,k)=>{const v=s.pat[k][s.pos];if(v&&!(o.mute&&o.mute(s,k)))t.sound(s,at,v,s.pos,k)});return 'keep'},
   tog(s,v){const k=Math.floor(v/16),i=v%16;s.pat[k][i]=(s.pat[k][i]+1)%(o.tracks[k].cycle||2);s.preset=-1;return 'keep'},
   preset(s,v,ctx){const k=+v,was=s.playing,tok=s.token;Object.assign(s,fresh(k));s.token=tok;s.playing=was;restart(s,ctx);return 'keep'},
   bpm(s,v,ctx){s.bpm=+v;restart(s,ctx);return 'keep'},...(o.on||{})},
  draw(s,f,X){
   const pos=X.try?(s.playing?s.pos:-1):Math.floor(X.p*dur*s.bpm/60*4)%16;
   let out=heading(o.heading(s))+(o.note?X2_note(o.note):'');
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
const X2_V={
 kick:(at,long)=>AUDIO.kick({at,from:long?130:170,to:long?42:50,decay:long?.5:.28,gain:.3}),
 snare:at=>{AUDIO.hit({at,dur:.12,gain:.11,type:'bandpass',cutoff:1800,q:.7});AUDIO.tone(190,{at,dur:.08,type:'triangle',gain:.07,attack:.002,release:.06})},
 clap:at=>AUDIO.hit({at,dur:.11,gain:.13,type:'bandpass',cutoff:1300,q:1.2}),
 ch:at=>AUDIO.hit({at,dur:.04,gain:.06,cutoff:8000}),
 oh:at=>AUDIO.hit({at,dur:.2,gain:.06,cutoff:7000}),
 bell:at=>{AUDIO.tone(540,{at,dur:.09,type:'square',gain:.04,attack:.002,release:.07});AUDIO.tone(800,{at,dur:.09,type:'square',gain:.03,attack:.002,release:.07})},
 bass:(m,at,dur,o={})=>AUDIO.acid(midiHz(m),{at,dur,gain:o.gain||.13,cutoff:o.cutoff||500,env:o.env==null?900:o.env,res:o.res||3,decay:.12,type:o.type||'sawtooth'})
};
/* X2-HELPERS-END */
/* =========================== belleville-three =========================== */
X2_cards({id:'belleville-three',name:'The Belleville Three',tag:'Three school friends and a new music',
 definition:'Juan Atkins, Derrick May and Kevin Saunderson met as teenagers at school in Belleville, a small town outside Detroit. Between 1985 and 1988 their records, on labels they owned, became the music now called Detroit techno.',
 example:'Atkins’s “No UFO’s” (1985) is tense and mechanical, May’s “Strings of Life” (1987) is ecstatic, and Saunderson’s “Big Fun” (1988) is a pop hit. All three came from the same circle of friends.',
 desc:'Six pressable people, labels and places from 1985 to 1988, each with the records and facts attached to it.',
 research:'Sicko, D. (1999). Techno Rebels. Brown, D. Jr. (2022). Assembling a Black Counter Culture. Reynolds, S. (1998). Energy Flash. Brewster, B. & Broughton, F. (1999). Last Night a DJ Saved My Life.',
 hint:'Press each item. The three are often summed up as the originator, the innovator and the elevator, a tag used in Detroit itself.',heading:'Detroit, 1985 to 1988',dw:46,
 items:[
  {d:'1985',t:'Juan Atkins: Metroplex',text:'After Cybotron, Atkins starts the Metroplex label and records as Model 500. “No UFO’s” and “Night Drive (Thru-Babylon)” set the mood: fast, sparse, about technology and the city at night.',phase:'Atkins is called the originator. He was the oldest of the three and taught the others how to use the machines.'},
  {d:'1986',t:'Derrick May: Transmat',text:'May starts Transmat. As Rhythim Is Rhythim he releases “Nude Photo” and “Strings of Life” (1987), whose piano and string stabs over a drum machine became an anthem in British clubs.',phase:'May is called the innovator. “Strings of Life” has no bass line at all, which shows how much a drum machine and a few chords can carry.'},
  {d:'1987',t:'Kevin Saunderson: KMS',text:'Saunderson starts KMS. With the singer Paris Grey, as Inner City, he makes “Big Fun” and “Good Life” (1988), which reach the UK top ten.',phase:'Saunderson is called the elevator, for taking the music into the charts. His darker tracks as Reese gave later British styles a much-copied bass sound.'},
  {d:'1987',t:'More than three',text:'Eddie Fowlkes, Blake Baxter, James Pennington, Anthony Shakir and others were releasing records on the same labels. The neat story of three founders leaves people out.',phase:'“The Belleville Three” is a useful label, not a full list. Kelli Hand, Carl Craig and the Underground Resistance group followed within a few years.'},
  {d:'1988',t:'The Music Institute',text:'A club in downtown Detroit where May, Darryl Wynn, Chez Damier and Alton Miller play. It runs for about eighteen months and has no alcohol licence.',phase:'For a short time the music had a home in its own city. Its larger audience was already in Britain and continental Europe.'},
  {d:'1988',t:'A compilation in Britain',text:'The British label 10 Records, part of Virgin, releases Techno! The New Dance Sound of Detroit, compiled with Neil Rushton. The next scene shows how it fixed the name.',phase:'Until this album, most people outside Detroit filed these records under house.'}]});

const X2_CH={min:[57,60,64],maj:[57,61,64],m7:[57,60,64,67]};
const X2_stab=(s,at,v)=>X2_CH[s.q].forEach(m=>AUDIO.acid(midiHz(m+(v===2?5:0)),{at,dur:.15,gain:.055,cutoff:1500,env:900,res:1.5,decay:.12}));
X2_grid({id:'belleville-three-stabs',name:'Chord stabs',tag:'A few chords over a drum machine',
 definition:'A stab is a short, sharp chord. Detroit techno often sets string or piano stabs in a syncopated rhythm against a steady kick, so the drums drive and the chords dance around them.',
 example:'Move one stab from a beat to the step just before it and the pattern starts to push forward.',
 desc:'A step grid with kick, hat and a chord track whose steps cycle through rest, a chord and the same chord shifted up, with a choice of chord colour.',
 research:'Butler, M. J. (2006). Unlocking the Groove (on syncopated patterns against a regular kick). Sicko, D. (1999). Techno Rebels. The pattern here is original, in the style.',
 hint:'Press Play. Press chord steps to cycle rest, chord and shifted chord. Try the three chord colours.',
 bpm:126,tempo:[115,135],note:'original pattern in the style',
 init:()=>({q:'min'}),watch(p){return {q:p<.34?'min':p<.67?'m7':'maj'}},
 ui:[{choose:[['min','Minor'],['m7','Minor seventh'],['maj','Major']],label:'Chord',get:s=>s.q,act:'q'}],
 on:{q(s,v){s.q=v;return 'keep'}},
 tracks:[
  {name:'Kick',col:C.blue,pat:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],sound:(s,at)=>X2_V.kick(at)},
  {name:'Hat',col:C.green,pat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1],sound:(s,at)=>X2_V.ch(at)},
  {name:'Stab',col:C.purple,cycle:3,labels:['','I','IV'],pat:[1,0,0,1,0,0,1,0,0,2,0,0,2,0,1,0],sound:X2_stab}],
 heading:s=>'Stabs that fall between the kicks',
 below(s,X,pos,y){const on=s.pat[2].filter((v,i)=>v&&i%4===0).length,off=s.pat[2].filter((v,i)=>v&&i%4).length;
  return counter(130,y+14,'stabs on a beat',String(on),C.blue,150)+counter(320,y+14,'stabs between beats',String(off),C.purple,160)+T(300,y+92,off>on?'Most stabs miss the beat: the chords push and pull':'Stabs on the beat sound square and settled',15,C.ink)},
 phase:s=>{const off=s.pat[2].filter((v,i)=>v&&i%4).length;return `${off} of the stabs fall between the beats while the kick stays on every beat. That contrast, a fixed pulse with chords moving against it, is one of the main ways Detroit records create motion without a singer or a bass line.`}});

X2_cards({id:'belleville-three-name',name:'How techno got its name',tag:'A word looking for a genre',
 definition:'The word “techno” was used in Detroit for years as a description before it became the name of a genre. A British compilation in 1988 made it official.',
 example:'In 1984 Cybotron released “Techno City”. In 1988 a Juan Atkins track called “Techno Music” gave a compilation its title, and the genre its name.',
 desc:'Five pressable dates from 1980 to 1988 showing each use of the word.',
 research:'Sicko, D. (1999). Techno Rebels (the account of the 1988 compilation). Toffler, A. (1980). The Third Wave. Morrow. Cosgrove, S. (1988). Sleeve notes and article “Seventh City Techno”, The Face.',
 hint:'Press each date. The account of the compilation’s working title comes from the people who made it.',heading:'The word “techno”',dw:46,
 items:[
  {d:'1980',t:'Toffler’s “techno rebels”',text:'The futurist Alvin Toffler’s book The Third Wave describes “techno rebels”: people who take control of new technology and do not just accept it. Juan Atkins read it at school.',phase:'Atkins has often named Toffler as the source of the word. The idea suited musicians taking up cheap machines to make their own future.'},
  {d:'1984',t:'“Techno City”',text:'Cybotron use the word in a title. In Detroit it is an adjective for a sound, not yet a category in record shops.',phase:'Records by Atkins, May and Saunderson were at first sold and reviewed as a Detroit kind of house.'},
  {d:'1988',t:'A working title',note:'as told by its compilers',text:'According to those involved, the British compilation was first going to be called The House Sound of Detroit. Atkins’s contribution was a track titled “Techno Music”.',phase:'The compilers wanted to set Detroit apart from Chicago. The track title gave them the word.'},
  {d:'1988',t:'The album appears',text:'The album comes out as Techno! The New Dance Sound of Detroit. An article in The Face by Stuart Cosgrove introduces the musicians to British readers.',phase:'From this point the genre has a name, and the three friends are presented as its founders.'},
  {d:'After',t:'A word that travelled',text:'In Germany, Belgium and Britain “techno” soon covered harder, faster local styles too. Detroit musicians sometimes felt the word had left them behind.',phase:'A name fixes a history. Era 8 returns to who is remembered and who is left out.'}]});

/* =========================== the-electrifying-mojo =========================== */
X2_cards({id:'the-electrifying-mojo',name:'The Electrifying Mojo',tag:'A radio show with no format',
 definition:'The Electrifying Mojo is the on-air name of Charles Johnson, a Detroit radio DJ whose late-night shows from 1977 mixed funk, new wave, rock, soul and European electronic music with no regard for format. Nearly every early Detroit techno musician names him as an influence.',
 example:'On one night a listener might hear Parliament, Kraftwerk, Prince and the B-52’s in a row, with whole album sides played without interruption.',
 desc:'Five pressable facts about the show and the scene around it.',
 research:'Sicko, D. (1999). Techno Rebels. Brown, D. Jr. (2022). Assembling a Black Counter Culture. Brewster, B. & Broughton, F. (1999). Last Night a DJ Saved My Life.',
 hint:'Press each item. Mojo avoided publicity, so most of what is known comes from his listeners.',heading:'Detroit radio after midnight',dw:0,
 items:[
  {d:'',t:'The show',text:'Mojo broadcast on several Detroit stations from 1977 through the 1980s. His programme opened with the landing of a “Mothership” and included the Midnight Funk Association, when listeners were asked to flash their lights.',phase:'The theatre mattered. Listeners across the city felt part of one audience at the same moment.'},
  {d:'',t:'The playlist',text:'He ignored the usual split between Black and white radio. Funk and soul sat beside Kraftwerk, Tangerine Dream, Prince, the B-52’s and Yellow Magic Orchestra.',phase:'For teenagers in and around Detroit this was the only place to hear European electronic records. Many of them heard Kraftwerk there first.'},
  {d:'',t:'The listeners',text:'Juan Atkins, Derrick May and Kevin Saunderson all listened. Atkins and May took their own early mixes to him, and he played them on air.',phase:'A DJ who would play a local teenager’s tape next to Prince gave those teenagers a reason to keep making tapes.'},
  {d:'',t:'The party scene',text:'Black high-school social clubs in north-west Detroit ran parties around 1980 with DJs playing Italo disco, new wave and funk. One club’s name, Charivari, became the title of an early local dance record.',phase:'These parties were where the young DJs learned to mix, and where a taste for European electronic records was already established.'},
  {d:'',t:'The man',text:'Charles Johnson rarely gave interviews and was almost never photographed. He is known through recordings of his shows and through what his listeners went on to make.',phase:'It is unusual for a broadcaster to shape a genre he never played. Mojo did it by widening what a generation thought music could be.'}]});

const X2_POP=[[1950,1.85],[1960,1.67],[1970,1.51],[1980,1.2],[1990,1.03]];
SCENE({id:'the-electrifying-mojo-city',name:'The city behind the music',tag:'A shrinking industrial city',
 definition:'Detroit, the centre of the American car industry, lost almost half its population between 1950 and 1990 as factories automated or moved and many residents left for the suburbs. Techno was made by young Black musicians who grew up during that decline.',
 example:'Belleville, where Atkins, May and Saunderson went to school, is about 30 miles south-west of the city. Their families were part of a Black middle class that car-industry wages had helped to build.',
 desc:'A bar chart of Detroit’s census population for each decade from 1950 to 1990, with a year control and a note for each decade.',
 research:'US Census Bureau, decennial census counts for the city of Detroit, 1950–1990 (rounded here). Sugrue, T. J. (1996). The Origins of the Urban Crisis. Princeton University Press. Sicko, D. (1999). Techno Rebels.',
 dur:12,hint:'Move the year. The musicians of the Belleville Three were born between 1962 and 1964.',
 init:()=>({i:4}),
 watch(p){return {i:Math.min(4,Math.floor(p*5))}},
 ui:[{range:'i',label:'Census year',min:0,max:4,step:1,get:s=>s.i,act:'i',show:v=>X2_POP[v][0]}],
 on:{i(s,v){s.i=clamp(+v,0,4);return 'keep'}},
 draw(s){
  let out=heading('Detroit’s population, 1950 to 1990')+X2_note('census counts, rounded');
  const x0=90,bw=70,gap=28,yb=280,sc=110;
  out+=L(x0-14,yb,x0+5*(bw+gap),yb,C.line,1.5);
  [0,1,2].forEach(v=>out+=L(x0-18,yb-v*sc,x0-14,yb-v*sc,C.line,1.2)+TF(x0-22,yb-v*sc+4,v+'m',12,C.muted,'end'));
  X2_POP.forEach(([yr,m],k)=>{const x=x0+k*(bw+gap),h=m*sc,on=k===s.i,shown=k<=s.i;
   out+=R(x,yb-h,bw,h,shown?(on?C.blue:'#b9d4e6'):'#eef3f6','none',4)+TF(x+bw/2,yb+18,String(yr),13,on?C.ink:C.muted)+(shown?TBF(x+bw/2,yb-h-8,m.toFixed(2)+'m',13,on?C.blue:C.muted):'')});
  const notes=['The peak. Car plants employ hundreds of thousands in and around the city.','Plants automate and move to the suburbs. The city has begun to shrink.','After the unrest of 1967, the move to the suburbs speeds up.','Oil shocks and foreign competition hit the car firms. The Belleville Three are in their teens.','Techno has its name. The city has lost 44% of its 1950 population.'];
  out+=X2_lines(90,318,notes[s.i],70);
  out+=T(300,366,`${X2_POP[s.i][0]}: ${X2_POP[s.i][1].toFixed(2)} million · ${Math.round((1-X2_POP[s.i][1]/1.85)*100)}% below the 1950 peak`,15,C.ink);
  return {svg:out,phase:s.i<2?'In 1950 Detroit was the fifth-largest city in the United States and its factories were a model of modern industry.':'Detroit musicians have often linked their music to this setting: the sound of the assembly line, empty downtown streets at night, and a belief that technology could be turned to their own ends.'};
 }});

const X2_FUNK=[[1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0],[0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],[1,0,0,2,0,1,0,0,1,0,2,0,0,1,0,2]];
const X2_MACH=[[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,2,1,1,1,2,1,1,1,2,1,1,2,1,1]];
X2_grid({id:'the-electrifying-mojo-blend',name:'Funk meets the machine',tag:'Two feels, one grid',
 definition:'Funk drumming is syncopated and often swung: the kicks dodge the beat and every second sixteenth note may arrive a little late. Machine music is straight: every step is the same length. Detroit techno is often described as a meeting of the two.',
 example:'Derrick May’s much-quoted description of techno is that it is like George Clinton and Kraftwerk stuck in a lift with only a sequencer for company.',
 desc:'A four-track step grid with a funk-like pattern and a machine-like pattern, a swing control that delays every second step, and a strip showing the step timing.',
 research:'Sicko, D. (1999). Techno Rebels (for May’s description). Butler, M. J. (2006). Unlocking the Groove. Danielsen, A. (2006). Presence and Pleasure: The Funk Grooves of James Brown and Parliament. Wesleyan. The patterns here are original.',
 hint:'Press Play and switch between the two patterns. Then keep the machine pattern and add swing, or straighten the funk one.',
 bpm:104,tempo:[96,136],note:'original patterns · simplified voices',
 init:()=>({sw:0}),
 presets:[{name:'Funk feel',pat:X2_FUNK,set:s=>{s.bpm=104;s.sw=34}},{name:'Machine feel',pat:X2_MACH,set:s=>{s.bpm=128;s.sw=0}}],
 ui:[{range:'sw',label:'Swing',min:0,max:50,step:2,get:s=>s.sw,act:'sw',show:v=>v+'% of a step'}],
 on:{sw(s,v){s.sw=+v;return 'keep'}},
 swing:s=>s.sw/100,
 tracks:[
  {name:'Kick',col:C.blue,pat:X2_FUNK[0],sound:(s,at)=>X2_V.kick(at)},
  {name:'Snare',col:C.coral,pat:X2_FUNK[1],sound:(s,at)=>X2_V.snare(at)},
  {name:'Hat',col:C.green,pat:X2_FUNK[2],sound:(s,at)=>X2_V.ch(at)},
  {name:'Bass',col:C.purple,cycle:3,labels:['','R','8'],pat:X2_FUNK[3],sound:(s,at,v)=>X2_V.bass(v===2?45:33,at,.1,{cutoff:480,env:700})}],
 heading:s=>s.sw?`Every second step ${Math.round(s.sw/100*X2_stepMs(s.bpm))} ms late`:'Straight time: all steps equal',
 below(s,X,pos,y){let out=TF(94,y+30,'timing',13,C.muted,'end')+R(100,y+12,480,28,'#fff',C.grid,6);
  for(let i=0;i<16;i++){const x=115+i*30+(i%2?s.sw/100*30:0);out+=L(115+i*30,y+14,115+i*30,y+38,C.grid,1)+Ci(x,y+26,i%2?3.4:4.4,i%2?C.coral:C.blue)}
  const offk=s.pat[0].filter((v,i)=>v&&i%4).length;
  out+=counter(130,y+52,'kicks between beats',String(offk),C.blue,160)+counter(320,y+52,'swing delay',Math.round(s.sw/100*X2_stepMs(s.bpm))+' ms',C.coral,150);
  out+=T(300,y+124,s.sw>=20?'Long-short pairs: the pattern lilts':s.sw?'A slight lilt':'Even steps: the pattern drives',15,C.ink);return out},
 phase:s=>`Swing here is the delay of every second step: ${s.sw}% of a step, or ${Math.round(s.sw/100*X2_stepMs(s.bpm))} ms at ${s.bpm} BPM. A delay of 33% turns pairs of steps into a triplet lilt. Detroit records mostly keep the machine’s straight steps and take their syncopation from where the notes are placed.`});

/* =========================== afrofuturism =========================== */
X2_cards({id:'afrofuturism',name:'Afrofuturism',tag:'Black music imagining the future',
 definition:'Afrofuturism is a name, coined by the critic Mark Dery in 1993, for Black art that uses science fiction and technology to imagine other futures and to rethink the past. Detroit techno is one of its clearest examples in music.',
 example:'Juan Atkins’s group names, Cybotron and Model 500, and titles such as “Cosmic Cars” and “No UFO’s” treat the synthesiser as a way out of the present.',
 desc:'Five pressable artists and writers from the 1950s to 1998, each with how they joined Black music to ideas of the future.',
 research:'Dery, M. (1993). Black to the future: interviews with Samuel R. Delany, Greg Tate and Tricia Rose. South Atlantic Quarterly 92(4). Eshun, K. (1998). More Brilliant Than the Sun: Adventures in Sonic Fiction. Quartet. Brown, D. Jr. (2022). Assembling a Black Counter Culture.',
 hint:'Press each item. The term came later than most of the music it describes.',heading:'Futures in Black music',dw:46,
 items:[
  {d:'1950s',t:'Sun Ra',text:'The bandleader Sun Ra said he came from Saturn and led his Arkestra in space-age costumes from the 1950s on. He was among the first jazz musicians to use electronic keyboards.',phase:'Sun Ra treated outer space as a place of freedom that Earth had not offered. Later musicians took up the idea in their own ways.'},
  {d:'1975',t:'Parliament-Funkadelic',text:'George Clinton’s groups built a mythology of a funk Mothership landing to free the dance floor, with synthesiser bass lines by Bernie Worrell.',phase:'P-Funk was on Detroit radio constantly. Its mix of science fiction, humour and synthesisers fed directly into electro and techno.'},
  {d:'1981',t:'Cybotron and Model 500',text:'Juan Atkins and Rik Davis wrote about a city they called Techno City. Atkins has said he wanted his music to sound like the future as Toffler’s books described it.',phase:'Where P-Funk’s future was a party, Atkins’s was cooler and more uncertain: machines, night drives, signals from elsewhere.'},
  {d:'1993',t:'The word',text:'Mark Dery coins “Afrofuturism” in an essay built on interviews with the writers Samuel R. Delany, Greg Tate and Tricia Rose. Scholars such as Alondra Nelson develop it.',phase:'The term gave critics a way to see Sun Ra, P-Funk, science-fiction novels and techno as parts of one tradition.'},
  {d:'1998',t:'Kodwo Eshun',text:'In More Brilliant Than the Sun, the British-Ghanaian writer Kodwo Eshun describes Detroit techno, jungle and hip-hop as “sonic fiction”: music that builds its own worlds.',phase:'Eshun argued that this music should be heard as forward-looking invention, not only as a response to hardship.'}]});

X2_cards({id:'afrofuturism-drexciya',name:'Drexciya',tag:'A myth told in sleeve notes',
 definition:'Drexciya was a Detroit electro and techno duo, active from the early 1990s, who released records with almost no information about themselves. Their sleeve notes and titles built up a myth of an underwater civilisation.',
 example:'Track titles such as “Wavejumper” and “Bubble Metropolis” read like reports from that world. The music is fast electro with bright, darting synthesiser lines.',
 desc:'Four pressable parts: the duo, the myth, what it does, and the art it has inspired.',
 research:'Drexciya (1997). The Quest (Submerge), sleeve notes. Eshun, K. (1998). More Brilliant Than the Sun. Gilroy, P. (1993). The Black Atlantic. Verso. Solomon, R. et al. (2019). The Deep. Saga Press.',
 hint:'Press each part. The myth deals with the Atlantic slave trade and is told here as the duo told it.',heading:'Drexciya’s underwater world',dw:0,
 items:[
  {d:'',t:'The duo',text:'Drexciya’s records came out from 1992, at first through Underground Resistance. The group was James Stinson (1969–2002) and, by most accounts, Gerald Donald. They avoided photographs and interviews.',phase:'Like Underground Resistance, Drexciya put the work in front and kept the makers out of view.'},
  {d:'',t:'The myth',note:'the duo’s own story',text:'The notes to The Quest (1997) imagine that the unborn children of pregnant African women thrown from slave ships learned to breathe underwater, and that their descendants built a civilisation on the ocean floor.',phase:'The story starts from a historical atrocity, the killing of enslaved people at sea, and imagines survival and a new society growing from it.'},
  {d:'',t:'What it does',text:'The myth turns the Middle Passage from an ending into a beginning. Kodwo Eshun and others read it beside Paul Gilroy’s idea of the Black Atlantic as a shared history made by the crossing.',phase:'This is Afrofuturism at its most direct: a science-fiction story used to rethink the past as well as the future.'},
  {d:'',t:'Afterlives',text:'The painter Ellen Gallagher’s Watery Ecstatic series, the group clipping.’s song “The Deep” (2017) and Rivers Solomon’s novella The Deep (2019) all build on Drexciya’s world.',phase:'A story first told on record sleeves has become a shared setting for other artists, which is rare for any band’s invention.'}]});

const X2_ZP=[['laser','Laser',2400,180,.22],['drop','Falling drop',900,60,.7],['kick','Kick drum',170,48,.3],['blip','Rising blip',300,1800,.12]];
SCENE({id:'afrofuturism-future-sound',name:'Sounds from nowhere',tag:'No instrument makes this',
 definition:'A synthesiser can make sounds that no acoustic instrument produces, such as a tone whose pitch sweeps across several octaves in a fraction of a second. Electro and techno used such sounds to signal the future.',
 example:'Start a sine wave at 2,400 Hz and drop it to 180 Hz in under a tenth of a second and you get a science-fiction laser. Start at 170 Hz and fall to 48 Hz and the same circuit is a kick drum.',
 desc:'A graph of pitch against time for one swept tone, with controls for the start pitch, end pitch and length, and four presets.',
 research:'Eshun, K. (1998). More Brilliant Than the Sun. Pinch, T. & Trocco, F. (2002). Analog Days. Harvard University Press. Electronic drum sounds as swept oscillators: see Electronic Music In Motion.',
 dur:12,hint:'Choose a preset and press Play, then move the sliders. A fast fall from high to low is a zap; a short fall at the bottom is a kick.',
 init:()=>({pre:'laser',from:2400,to:180,dec:.22}),
 watch(p){const z=X2_ZP[Math.min(3,Math.floor(p*4))];return {pre:z[0],from:z[2],to:z[3],dec:z[4]}},
 ui:[{choose:X2_ZP.map(z=>[z[0],z[1]]),label:'Preset',get:s=>s.pre,act:'pre'},
  {range:'from',label:'Start pitch',min:60,max:3000,step:10,get:s=>s.from,act:'from',show:v=>v+' Hz'},{range:'to',label:'End pitch',min:30,max:2000,step:10,get:s=>s.to,act:'to',show:v=>v+' Hz'},
  {range:'dec',label:'Length',min:.05,max:.8,step:.01,get:s=>s.dec,act:'dec',show:v=>Math.round(v*1000)+' ms'},{b:'Play',act:'play'}],
 on:{pre(s,v){const z=X2_ZP.find(q=>q[0]===v);if(z){s.pre=v;s.from=z[2];s.to=z[3];s.dec=z[4]}return 'keep'},from(s,v){s.from=+v;s.pre='';return 'keep'},to(s,v){s.to=+v;s.pre='';return 'keep'},dec(s,v){s.dec=+v;s.pre='';return 'keep'},
  play(s){AUDIO.kick({from:s.from,to:s.to,decay:s.dec,gain:s.from>600?.14:.26});return 'keep'}},
 draw(s){
  const oct=Math.log2(s.from/s.to);let out=heading(Math.abs(oct)<.2?'A steady tone':oct>0?`Falling ${Math.abs(oct).toFixed(1)} octaves`:`Rising ${Math.abs(oct).toFixed(1)} octaves`)+X2_note('simplified model: one swept sine wave');
  const x0=90,w=440,y0=78,h=190,fy=f=>y0+h-Math.log(f/30)/Math.log(100)*h,tx=t=>x0+t/.8*w;
  out+=R(x0,y0,w,h,'#fff',C.grid,6);
  [[50,'50'],[200,'200'],[1000,'1k'],[3000,'3k Hz']].forEach(([f,l])=>out+=L(x0,fy(f),x0+w,fy(f),C.grid,1)+TF(x0-8,fy(f)+4,l,12,C.muted,'end'));
  [[0,'0'],[.2,'200'],[.4,'400'],[.6,'600'],[.8,'800 ms']].forEach(([t,l])=>out+=TF(tx(t),y0+h+18,l,12,C.muted));
  const sweep=Math.max(.02,s.dec*.35),pts=[];for(let i=0;i<=60;i++){const t=s.dec*i/60,f=t<sweep?s.from*Math.pow(s.to/s.from,t/sweep):s.to;pts.push((i?'L':'M')+fmt(tx(t))+' '+fmt(fy(clamp(f,30,3000))))}
  out+=P(pts.join(''),C.coral,3)+Ci(tx(0),fy(clamp(s.from,30,3000)),5,C.coral)+L(tx(s.dec),y0+4,tx(s.dec),y0+h-4,C.line,1.2,'stroke-dasharray="4 4"')+TF(Math.min(tx(s.dec)+6,x0+w-40),y0+16,'ends',12,C.muted,'start');
  out+=TF(x0+w/2,y0+h+38,'time after the sound starts',13,C.muted);
  out+=T(300,356,`${s.from} Hz to ${s.to} Hz in about ${Math.round(sweep*1000)} ms, then fading by ${Math.round(s.dec*1000)} ms`,15,C.ink);
  return {svg:out,phase:Math.abs(oct)>2.5?'A sweep of several octaves in a fraction of a second is something no string, pipe or drum skin does, in either direction. Listeners in the early 1980s heard it as the sound of machines and of the future.':oct>.5&&s.to<=120?'A short fall in pitch ending at a low frequency is how an analogue drum machine makes a kick drum. The same circuit, started higher, makes a tom or a zap.':Math.abs(oct)>.5?'A sweep of an octave or two gives a chirp or a tom. Push the start and end further apart, or shorten the length, and it turns into a zap.':'With little or no sweep this is a plain tone. The character of these sounds comes from how far and how fast the pitch moves.'};
 }});

/* =========================== underground-resistance =========================== */
X2_cards({id:'underground-resistance',name:'Underground Resistance',tag:'Independence as a principle',
 definition:'Underground Resistance, known as UR, is a Detroit label and collective founded in 1989 by Mike Banks and Jeff Mills, soon joined by Robert Hood. It refused the usual music-industry routes: no artist photographs, its own pressing and distribution, and a message of self-reliance for Black Detroit.',
 example:'UR members performed in masks or bandannas and signed records with slogans, not faces. The group’s statements describe the music as a way to break down barriers between people.',
 desc:'Six pressable facts and records from 1989 to 1999.',
 research:'Sicko, D. (1999). Techno Rebels. Brown, D. Jr. (2022). Assembling a Black Counter Culture. Reynolds, S. (1998). Energy Flash. Vecchiola, C. (2011). Submerge in Detroit: techno’s creative response to urban crisis. Journal of American Studies 45(1).',
 hint:'Press each item to follow the group and the careers that came out of it.',heading:'Underground Resistance',dw:46,
 items:[
  {d:'1989',t:'Founding',text:'Mike Banks, a session musician, and Jeff Mills, a radio DJ known as The Wizard, start UR. Robert Hood joins soon after. Early records are hard, fast and militant in their imagery.',phase:'UR presented itself as a movement, not a band. The name set out its stance towards the mainstream industry.'},
  {d:'1991',t:'Anonymity',text:'The group avoids photographs and hides faces on stage. Records carry messages scratched into the vinyl. The idea is that the music and the collective matter, not a star.',phase:'Anonymity was also practical. It kept attention on Detroit and stopped the industry picking out one member to market.'},
  {d:'1992',t:'Submerge',text:'A distribution company is set up to press and ship records for UR and other Detroit labels, keeping the business in the city and in the artists’ hands.',phase:'Submerge is still based in Detroit and houses a small museum of the city’s techno history.'},
  {d:'1992',t:'Mills and Hood leave',text:'Jeff Mills moves to New York and then Berlin and Chicago, and starts the Axis label. Robert Hood founds M-Plant in 1994 and releases Minimal Nation.',phase:'Mills’s fast, stripped DJ style and Hood’s minimalism shaped European techno through the 1990s. Era 4 picks this up.'},
  {d:'1993',t:'Hi-tech jazz',text:'As Galaxy 2 Galaxy, Banks and others release music with saxophone and warm chords, linking techno to Detroit’s jazz and gospel traditions.',phase:'UR’s output was never only hard. The same collective made some of the most melodic records in the genre.'},
  {d:'1999',t:'“Knights of the Jaguar”',text:'A UR record by DJ Rolando becomes a club hit. When a major label released its own version without agreement, UR campaigned publicly against it.',phase:'The dispute showed why the group had built its own system in the first place.'}]});

const X2_own=c=>3*c-1*c-600,X2_lic=c=>1500+Math.max(0,.36*c-1500);
SCENE({id:'underground-resistance-independent',name:'Owning the label',tag:'Who is paid for each record',
 definition:'An artist can license a record to a larger label for an advance and a small royalty, or press it on their own label, pay the costs and keep what is left. The independent route risks more and, if the record sells, returns more.',
 example:'In this model the licensed artist is paid 1,500 up front whatever happens. The independent artist is out of pocket at first and overtakes after about a thousand copies.',
 desc:'Two lines of artist income against copies sold, one for licensing and one for an own label, with a slider for copies sold and the split of one record’s price.',
 research:'Vecchiola, C. (2011). Submerge in Detroit. Journal of American Studies 45(1). Sicko, D. (1999). Techno Rebels. Hesmondhalgh, D. (1998). The British dance music industry: a case study of independent cultural production. British Journal of Sociology 49(2). All figures here are invented for illustration.',
 dur:12,hint:'Move the number of copies sold. Find where the own-label line crosses the licensing line.',
 init:()=>({c:3000}),
 watch(p){return {c:Math.round((300+p*9700)/100)*100}},
 ui:[{range:'c',label:'Copies sold',min:100,max:10000,step:100,get:s=>s.c,act:'c',show:v=>Number(v).toLocaleString('en-GB')}],
 on:{c(s,v){s.c=+v;return 'keep'}},
 draw(s){
  let out=heading('Artist income: licensing or own label')+X2_note('illustrative figures, not real accounts');
  const x0=80,w=300,y0=80,h=200,X=c=>x0+c/10000*w,Y=v=>y0+h-(v+1000)/21000*h;
  out+=R(x0,y0,w,h,'#fff',C.grid,6)+L(x0,Y(0),x0+w,Y(0),C.line,1.2);
  [[0,'0'],[10000,'10,000'],[20000,'20,000']].forEach(([v,l])=>out+=TF(x0-8,Y(v)+4,l,12,C.muted,'end'));
  [[0,'0'],[5000,'5,000'],[10000,'10,000']].forEach(([c,l])=>out+=TF(X(c),y0+h+18,l,12,C.muted));
  out+=TF(x0+w/2,y0+h+38,'copies sold',13,C.muted);
  const line=fn=>{let d='';for(let i=0;i<=50;i++){const c=i*200;d+=(i?'L':'M')+fmt(X(c))+' '+fmt(Y(fn(c)))}return d};
  out+=P(line(X2_lic),C.amber,2.6)+P(line(X2_own),C.blue,2.6)+L(X(s.c),y0+4,X(s.c),y0+h-4,C.line,1.2,'stroke-dasharray="4 4"')+Ci(X(s.c),Y(X2_own(s.c)),6,C.blue,'#fff')+Ci(X(s.c),Y(X2_lic(s.c)),6,C.amber,'#fff');
  const o=X2_own(s.c),l=X2_lic(s.c),nf=v=>(v<0?'−':'')+Math.abs(Math.round(v)).toLocaleString('en-GB');
  out+=R(400,80,184,200,'#f6f9fb','none',10)+TBF(412,104,'Own label',14,C.blue,'start')+TF(412,124,'sells each record for 3',13,C.ink,'start')+TF(412,142,'pressing costs 1 each',13,C.ink,'start')+TF(412,160,'set-up costs 600',13,C.ink,'start')+TBF(412,182,'income: '+nf(o),14,C.blue,'start');
  out+=TBF(412,212,'Licensed',14,C.amber,'start')+TF(412,232,'advance 1,500',13,C.ink,'start')+TF(412,250,'royalty 0.36 a copy',13,C.ink,'start')+TBF(412,272,'income: '+nf(l),14,C.amber,'start');
  out+=T(300,356,o>l?`At ${s.c.toLocaleString('en-GB')} copies the own label pays ${nf(o-l)} more`:`At ${s.c.toLocaleString('en-GB')} copies licensing pays ${nf(l-o)} more`,15,C.ink);
  return {svg:out,phase:o>l?'Past the crossing point, every copy on your own label is worth 2 to you, and you still own the recording. Under licence a copy adds nothing until the advance is earned back, at about 4,200 copies, and 0.36 after that. That arithmetic, and the experience of unpaid royalties in Chicago, is why Detroit producers set up their own labels.':'Below the crossing point the advance is worth more, and the own-label artist may not have covered the cost of pressing. Independence means carrying that risk yourself.'};
 }});

const X2_FULL=[[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],[1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],[0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0]];
const X2_STRIP=[[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],new Array(16).fill(0),new Array(16).fill(0),[0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0]];
X2_grid({id:'underground-resistance-stripped',name:'Faster and barer',tag:'A track as a tool for the DJ',
 definition:'In the early 1990s Jeff Mills, Robert Hood and others made tracks with very few parts at high tempos. Each track was a tool: a loop that a DJ could layer with two or three others, so the mix on the night was the finished music.',
 example:'A pattern with only a kick, an off-beat hat and two notes of a tone sounds empty alone. At 138 BPM, with another record over it, it is the frame that holds a set together.',
 desc:'A five-track step grid with a full pattern and a stripped pattern, a tempo control up to 150 BPM, and counts of hits per bar and per second.',
 research:'Butler, M. J. (2006). Unlocking the Groove (on DJ tools and layering). Sicko, D. (1999). Techno Rebels. Reynolds, S. (1998). Energy Flash. Hood, R. (1994). Minimal Nation (M-Plant). The patterns here are original.',
 hint:'Press Play on the full pattern, switch to the stripped one, then raise the tempo. Count how little is left.',
 bpm:132,tempo:[120,150],note:'original patterns · simplified 909-like voices',
 presets:[{name:'Full',pat:X2_FULL,set:s=>{s.bpm=128}},{name:'Stripped',pat:X2_STRIP,set:s=>{s.bpm=138}}],
 tracks:[
  {name:'Kick',col:C.blue,pat:X2_FULL[0],sound:(s,at)=>X2_V.kick(at)},
  {name:'Open hat',col:C.green,pat:X2_FULL[1],sound:(s,at)=>X2_V.oh(at)},
  {name:'Closed hat',col:'#5a9c8f',pat:X2_FULL[2],sound:(s,at)=>X2_V.ch(at)},
  {name:'Clap',col:C.coral,pat:X2_FULL[3],sound:(s,at)=>X2_V.clap(at)},
  {name:'Tone',col:C.purple,pat:X2_FULL[4],sound:(s,at)=>AUDIO.acid(midiHz(69),{at,dur:.09,gain:.07,cutoff:1400,env:600,res:4,decay:.08,type:'square'})}],
 heading:s=>{const n=s.pat.filter(r=>r.some(v=>v)).length;return n<=3?'Three parts: a DJ tool':`${n} parts sounding`},
 below(s,X,pos,y){const hits=s.pat.reduce((a,r)=>a+r.filter(v=>v).length,0),bar=4*60/s.bpm;
  return counter(110,y+12,'hits per bar',String(hits),C.purple,130)+counter(260,y+12,'one bar lasts',bar.toFixed(2)+' s',C.blue,130)+counter(410,y+12,'hits per second',(hits/bar).toFixed(1),C.coral,130)+T(300,y+86,hits<=14?'Space left for the next record':'A full pattern leaves little room to layer',15,C.ink)},
 phase:s=>{const hits=s.pat.reduce((a,r)=>a+r.filter(v=>v).length,0);return `${hits} hits in a bar of ${(240/s.bpm).toFixed(2)} seconds. Stripped tracks at high tempo were made to be mixed: Jeff Mills became known for running three turntables at once. Minimal Nation (1994) by Robert Hood took the same reduction and made it a style of its own, which era 4 follows to Berlin.`}});
